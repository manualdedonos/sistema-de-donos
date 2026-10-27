"""Monta um projeto do CapCut CAMADA POR CAMADA a partir de um kit de peças reais (tools/capcut_kit.py) e de uma
especificação de edição (projects/<p>/capcut_spec.py). Cada legenda, forma, título, efeito e som vira um segmento
editável no CapCut — mesmo jeito que o editor monta à mão.

uso: python3 tools/capcut_build.py projects/<p>/capcut_spec.py
     (feche o CapCut antes; a mídia usada é recortada/copiada para dentro do projeto por causa do sandbox)

spec (python):
  NAME = "C. UNIV - Tema (Claude)"     KIT = "styles/coders-univ/capcut_kit.json"     DUR = seg
  TRACKS = [("nome", "video"|"sticker"|"text"|"effect"|"audio"), ...]   # ordem = camada de baixo p/ cima
  ITEMS  = [dict(t="nome", p="peça", s=ini, d=dur, ...)]
     text=  texto (peças de texto)          src= arquivo de mídia   in= início na mídia (s)
     speed= velocidade                      vol= volume             scale= escala   pos=(x,y) (-1..1, CapCut)
     push=(s0,s1) ou (s0,s1,(x0,y0),(x1,y1))   zoom/pan contínuo com a curva "Desaceleração circular"
     rot= rotação   mask=False remove máscaras do modelo
     blur=[(y, "acima"|"abaixo", feather?)]  efeito "Desfocar" no clipe com máscara "Dividir" na altura y
          (fração 0..1 da altura do vídeo-fonte, de cima p/ baixo) — cobre legenda queimada, igual ao editor faz
  FPS = 30|60 (opcional)
  FROM = seg     → com APPEND: anexa SÓ a parte nova da narração a partir desse segundo (padrão do editor: nunca duplicar o que ele já montou)
  APPEND = True  → NÃO cria projeto: anexa tudo no projeto NAME já existente, depois do fim atual + GAP segundos
                   (nada do que já está lá é alterado; backup *.antes_claude_<ts> de cada arquivo). Faixas com o mesmo
                   nome são reaproveitadas; faixas novas entram na posição de camada certa.
  item color="#RRGGBB" troca a cor do texto · fade=(in,out) em áudio
  keyframes: gerados em tempo de MÍDIA (source start + t), que é como o CapCut lê
"""
import copy, json, os, re, runpy, shutil, subprocess, sys, time, uuid, hashlib
from pathlib import Path

ROOT = Path.home() / "Movies/CapCut/User Data/Projects/com.lveditor.draft"
STUDIO = Path(__file__).resolve().parent.parent
TPL = STUDIO / "tools/capcut/template"
OLD = {"draft": "C50CF1BD-31C0-46b9-B43E-D7E00DC9F92D", "tl": "44E68289-B5B2-4da7-A4C5-E1290A9BD307",
       "proj": "4802CD9A-058B-4558-AAF6-6F57C7B11E64"}
US = 1_000_000
GRID = 30   # fps da timeline (spec FPS)
UUID = re.compile(r"[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}")
# arquivos que o CapCut já enxerga (container dele / app) — não precisam ser copiados
SAFE = (str(Path.home() / "Library/Containers/com.lemon.lvoverseas"), "/Applications/CapCut.app", str(Path.home() / "Movies"))


def uid():
    return str(uuid.uuid4()).upper()


def us(sec):
    return int(round(sec * GRID)) * US // GRID      # grade de frames da timeline


def probe(path):
    j = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
                   "stream=codec_type,width,height:format=duration", "-of", "json", path]))
    v = next((s for s in j["streams"] if s["codec_type"] == "video"), {})
    return v.get("width", 0), v.get("height", 0), float(j["format"].get("duration", 0) or 0)


def renew_ids(obj, keep=()):
    """troca TODOS os UUIDs de um pedaço clonado por novos, de forma consistente"""
    s = json.dumps(obj, ensure_ascii=False)
    m = {}
    def rep(x):
        k = x.group(0).upper()
        if k in keep:
            return x.group(0)
        if k not in m:
            m[k] = uid()
        return m[k]
    return json.loads(UUID.sub(rep, s))


class Media:
    """recorta/copia mídia para dentro do projeto (o CapCut sandboxed não lê o SSD em projeto gerado)"""
    def __init__(self, folder):
        self.folder = folder
        self.done = {}

    def clip(self, src, a, dur, handle=2.0):
        """trecho [a, a+dur] com folga de `handle`s dos dois lados; devolve (caminho, offset_dentro_do_trecho)"""
        w, h, full = probe(src)
        a0 = max(0.0, a - handle)
        b0 = min(full, a + dur + handle) if full else a + dur + handle
        key = (src, round(a0, 2), round(b0, 2))
        if key not in self.done:
            out = self.folder / "materials/video" / f"{Path(src).stem[:40]}_{hashlib.md5(str(key).encode()).hexdigest()[:6]}.mp4"
            out.parent.mkdir(parents=True, exist_ok=True)
            if not out.exists():
              subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a0:.3f}", "-i", src, "-t", f"{b0 - a0:.3f}", "-an",
                            "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", str(out)], check=True)
            self.done[key] = str(out)
        return self.done[key], a - a0

    def copy(self, src, sub):
        if src.startswith(SAFE):
            return src
        if src not in self.done:
            out = self.folder / "materials" / sub / Path(src).name
            out.parent.mkdir(parents=True, exist_ok=True)
            if not out.exists():
                shutil.copy2(src, out)
            self.done[src] = str(out)
        return self.done[src]


def kf_curve(ex, prop, t0, t1, v0, v1):
    """keyframes de 2 pontos copiando a curva (tipo + preset + alças) de um exemplo real, reescalada"""
    e = copy.deepcopy(ex)
    a, b = e["keyframe_list"][0], e["keyframe_list"][-1]
    span0 = (b["time_offset"] - a["time_offset"]) or 1
    d0 = (b["values"][0] - a["values"][0]) or 1
    span, d = t1 - t0, v1 - v0
    for k, t, v in ((a, t0, v0), (b, t1, v1)):
        k["time_offset"], k["values"] = t, [v]
        for c in ("left_control", "right_control"):
            k[c] = {"x": round(k[c]["x"] * span / span0), "y": k[c]["y"] * d / d0 if d0 else 0.0}
    e["property_type"] = prop
    e["keyframe_list"] = [a, b]
    return e


def set_text(mat, text, color=None):
    c = json.loads(mat["content"])
    st = c["styles"][0]
    if color:
        rgb = [int(color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        st["fill"] = {"content": {"solid": {"color": rgb}, "render_type": "solid"}}
    n = len(text.encode("utf-16-le")) // 2
    st["range"] = [0, n]
    c["styles"], c["text"] = [st], text
    mat["content"] = json.dumps(c, ensure_ascii=False)
    for k in ("words", "current_words"):
        if k in mat:
            mat[k] = {"start_time": [], "end_time": [], "text": []}
    mat["recognize_text"] = ""


def build(specpath):
    if subprocess.run(["pgrep", "-x", "CapCut"], capture_output=True).stdout:
        sys.exit("Feche o CapCut antes de gerar o projeto.")
    S = runpy.run_path(specpath)
    global GRID
    GRID = S.get("FPS", 30)
    kit = json.load(open(STUDIO / S["KIT"]))
    name = S["NAME"]
    folder = ROOT / name
    APPEND = S.get("APPEND", False)
    if APPEND:
        if not folder.exists():
            sys.exit(f"projeto não encontrado para anexar: {folder}")
    else:
        n = 1
        while folder.exists():
            n += 1
            folder = ROOT / f"{S['NAME']} ({n})"
        name = folder.name
        folder.mkdir()
    media = Media(folder)
    DUR = us(S["DUR"])
    if APPEND:
        old = json.load(open(folder / "draft_info.json"))
        # FROM = segundo da narração onde começa a parte NOVA: só ela é anexada (nada do que o editor já tem é duplicado).
        # Itens que atravessam o FROM (narração, música, efeitos globais) são cortados e continuam do ponto certo.
        FROM = S.get("FROM", 0.0)
        keep = []
        for it in S["ITEMS"]:
            e = it["s"] + it["d"]
            if e <= FROM + 1e-6:
                continue
            if it["s"] < FROM:
                cut = FROM - it["s"]
                it["d"] -= cut
                it["s"] = FROM
                if "in" in it or it["p"] in ("narracao", "musica"):
                    it["in"] = it.get("in", 0.0) + cut
            keep.append(it)
        S["ITEMS"] = keep
        OFF = old["duration"] + us(S.get("GAP", 3.0)) - us(FROM)
        for it in S["ITEMS"]:
            it["s"] = it["s"] + OFF / US
        print(f"anexando a partir de {OFF / US:.2f}s (fim atual {old['duration'] / US:.2f}s + intervalo)")
    ex_scale = next(k for k in kit["foot_916"]["segment"]["common_keyframes"] if k["property_type"] == "KFTypeScaleX")
    ex_pos = next(k for k in kit["foot_916"]["segment"]["common_keyframes"] if k["property_type"] == "KFTypePositionX")

    if not APPEND:
        d = json.load(open(TPL / "draft_info.json"))
        d.update(duration=DUR, tracks=[], keyframe_graph_list=[])
        d["canvas_config"] = {"ratio": "9:16", "width": 1080, "height": 1920, "background": None}
        d["fps"] = float(GRID)
        M = d["materials"]
        for k, v in M.items():
            if isinstance(v, list):
                M[k] = []
    tracks = {}
    for i, (tn, tt) in enumerate(S["TRACKS"]):
        tracks[tn] = {"id": uid(), "type": tt, "flag": {"video": 2 if i else 0, "text": 1}.get(tt, 0), "attribute": 0,
                      "name": tn, "is_default_name": False, "segments": []}
    if APPEND:
        d = old
        M = d["materials"]
        d.setdefault("keyframe_graph_list", [])
    rx = {"video": 0, "sticker": 14000, "text": 14100, "effect": 11000, "audio": 0}

    for it in S["ITEMS"]:
        p = renew_ids(kit[it["p"]])
        seg, (kind, mat) = p["segment"], p["material"]
        start = us(it["s"])
        dur = us(it["s"] + it["d"]) - start
        old_dur = seg["target_timerange"]["duration"] or 1
        old_src = (seg.get("source_timerange") or {}).get("start", 0) if kind in ("videos", "audios") else 0
        seg["target_timerange"] = {"start": start, "duration": dur}
        speed = it.get("speed", 1.0)
        if seg.get("source_timerange") is not None:
            seg["source_timerange"] = {"start": 0, "duration": int(dur * speed)}
        seg["speed"] = speed
        for rk, r in p["refs"]:
            if rk == "speeds":
                r["speed"] = speed
            if rk == "material_animations":
                for a in r.get("animations", []):
                    a["duration"] = min(a["duration"], int(dur * 0.85))
                    if a.get("type") == "out":
                        a["start"] = dur - a["duration"]
        # mídia
        if kind == "videos":
            src = it.get("src") or mat["path"]
            if mat.get("type") == "photo":
                path = media.copy(src, "photo")
                w, h, _ = probe(path)
                mat.update(path=path, material_name=Path(path).name, width=w, height=h)
                seg["source_timerange"] = {"start": 0, "duration": dur}
            else:
                if "in" in it:
                    path, off = media.clip(src, it["in"], it["d"] * speed)
                else:
                    path, off = media.copy(src, "video"), 0.0
                w, h, full = probe(path)
                mat.update(path=path, material_name=Path(path).name, width=w, height=h, duration=int(full * US),
                           has_audio=False, local_material_id="", unique_id="", media_path="")
                seg["source_timerange"] = {"start": us(off), "duration": int(dur * speed)}
            seg["volume"] = it.get("vol", 0.0 if it["p"] != "girando" else 0.0)
        elif kind == "audios":
            src = it.get("src") or mat["path"]
            path = media.copy(src, "audio")
            _, _, full = probe(path)
            mat.update(path=path, duration=int(full * US), local_material_id="", unique_id="")
            mat["name"] = it.get("name") or Path(path).name
            seg["source_timerange"] = {"start": us(it.get("in", 0)), "duration": dur}
            seg["volume"] = seg["last_nonzero_volume"] = it.get("vol", seg["volume"])
        elif kind == "texts" and ("text" in it or "color" in it):
            set_text(mat, it.get("text", json.loads(mat["content"])["text"]), it.get("color"))
        # geometria
        cl = seg.get("clip")
        if cl:
            if "scale" in it:
                cl["scale"] = {"x": it["scale"], "y": it["scale"]}
            if "pos" in it:
                cl["transform"] = {"x": it["pos"][0], "y": it["pos"][1]}
            if "rot" in it:
                cl["rotation"] = it["rot"]
        # keyframes: os do modelo que duram o segmento inteiro são reescalados; curtos (pops) ficam como estão
        kfs = []
        for k in seg.get("common_keyframes", []):
            L = k["keyframe_list"]
            for x in L:                                   # exemplo: tempo de mídia → tempo do clipe
                x["time_offset"] = max(0, x["time_offset"] - old_src)
            if it.get("push") and k["property_type"] in ("KFTypeScaleX", "KFTypePositionX", "KFTypePositionY"):
                continue
            if len(L) > 1 and L[-1]["time_offset"] >= 0.8 * old_dur:
                f = dur / old_dur
                for x in L:
                    x["time_offset"] = int(x["time_offset"] * f)
                    for c in ("left_control", "right_control"):
                        x[c]["x"] = round(x[c]["x"] * f)
            k["keyframe_list"] = [x for x in L if x["time_offset"] <= dur]
            if k["keyframe_list"]:
                kfs.append(k)
        if it.get("push"):
            pu = it["push"]
            s0, s1 = pu[0], pu[1]
            (x0, y0), (x1, y1) = (pu[2], pu[3]) if len(pu) > 2 else (tuple(it.get("pos", (0, 0))),) * 2
            kfs.append(kf_curve(ex_scale, "KFTypeScaleX", 0, dur, s0, s1))
            kfs.append(kf_curve(ex_pos, "KFTypePositionX", 0, dur, x0, x1))
            kfs.append(kf_curve(ex_pos, "KFTypePositionY", 0, dur, y0, y1))
            cl["scale"] = {"x": s0, "y": s0}
            cl["transform"] = {"x": x0, "y": y0}
        if it.get("blur"):
            tpl = next(r for k, r in kit["foot_blur"]["refs"] if k == "video_effects" and r.get("effect_mask"))
            keep = {m["constant_material_id"].upper() for m in tpl["effect_mask"] if m.get("constant_material_id")}
            for b in it["blur"]:
                y, side = b[0], b[1]
                e = renew_ids(tpl, keep=keep)
                cfg = e["effect_mask"][0]["config"]
                cfg.update(centerY=1 - 2 * y, centerX=0.0, rotation=0.0, invert=(side == "abaixo"))
                if len(b) > 2:
                    cfg["feather"] = b[2]
                p["refs"].append(["video_effects", e])
        if it.get("mask") is False:
            p["refs"] = [r for r in p["refs"] if r[0] not in ("masks", "common_mask")]
        # ids novos p/ cada keyframe; cada ponto com curva-preset ganha sua entrada em keyframe_graph_list
        G = {g["id"]: g for g in p["graphs"] + kit["foot_916"]["graphs"]}
        kfs = copy.deepcopy(kfs)
        for k in kfs:
            k["id"] = uid()
            for x in k["keyframe_list"]:
                x["id"] = uid()
                if x["graphID"]:
                    src_g = G.get(x["graphID"])
                    if not src_g:
                        x["graphID"] = ""
                        continue
                    ng = copy.deepcopy(src_g)
                    ng["id"] = x["graphID"] = uid()
                    d["keyframe_graph_list"].append(ng)
        # CapCut: time_offset do keyframe conta a partir do início do TRECHO DA MÍDIA (source_timerange.start)
        src0 = (seg.get("source_timerange") or {}).get("start", 0) if kind in ("videos", "audios") else 0
        for k in kfs:
            for x in k["keyframe_list"]:
                x["time_offset"] += src0
        seg["common_keyframes"] = kfs
        if it.get("fade") and kind == "audios":         # fade=(entrada, saída) em segundos
            fr = next((r for rk, r in p["refs"] if rk == "audio_fades"), None)
            if fr is None:
                fr = renew_ids(next(r for rk, r in kit["sfx_wheel"]["refs"] if rk == "audio_fades"))
                p["refs"].append(["audio_fades", fr])
            fr["fade_in_duration"], fr["fade_out_duration"] = us(it["fade"][0]), us(it["fade"][1])
        seg["extra_material_refs"] = [r[1]["id"] for r in p["refs"]]
        M.setdefault(kind, []).append(mat)
        for rk, r in p["refs"]:
            M.setdefault(rk, []).append(r)
        tr = tracks[it["t"]]
        tr["segments"].append(seg)

    if APPEND:
        return append_write(folder, name, d, tracks, S)
    order = list(tracks.values())
    for i, tr in enumerate(order):
        tr["segments"].sort(key=lambda s: s["target_timerange"]["start"])
        base = rx[tr["type"]] + (i if tr["type"] in ("sticker", "text", "effect") else 0)
        for s in tr["segments"]:
            s["track_render_index"] = i
            s["render_index"] = base if tr["type"] != "video" else min(i, 1)
        # sobreposição na mesma faixa = CapCut recusa: apara o anterior até o início do próximo
        for a, b in zip(tr["segments"], tr["segments"][1:]):
            ta, tb = a["target_timerange"], b["target_timerange"]
            over = ta["start"] + ta["duration"] - tb["start"]
            if over > 0:
                if over > US // 10:
                    print(f"AVISO sobreposição de {over / US:.2f}s na faixa '{tr['name']}' em {tb['start'] / US:.2f}s (aparado)")
                ta["duration"] -= over
                if a.get("source_timerange"):
                    a["source_timerange"]["duration"] = int(ta["duration"] * a.get("speed", 1.0))
    d["tracks"] = [t for t in order if t["segments"]]
    write_project(folder, name, d, DUR, S.get("COVER"))
    print(f"Projeto CapCut criado: {folder}\n  {len(d['tracks'])} faixas, {sum(len(t['segments']) for t in d['tracks'])} segmentos")


def append_write(folder, name, d, tracks, S):
    """mescla as faixas novas no projeto existente sem mexer no que já está lá"""
    ts = time.strftime("%Y%m%d-%H%M%S")
    pj = json.load(open(folder / "Timelines/project.json"))
    tld = folder / "Timelines" / pj["main_timeline_id"]
    targets = [folder / "draft_info.json", folder / "draft_info.json.bak", tld / "draft_info.json",
               tld / "draft_info.json.bak", tld / "draft_content.json"]
    for t in targets + [folder / "draft_meta_info.json"]:
        if t.exists():
            shutil.copy2(t, t.with_name(t.name + f".antes_claude_{ts}"))
    existing = d["tracks"]
    added, created = 0, []
    prev_idx = -1
    for tn, tt in S["TRACKS"]:
        new = tracks[tn]
        new["segments"].sort(key=lambda s: s["target_timerange"]["start"])
        hit = next((i for i, t in enumerate(existing) if t.get("name") == tn and t["type"] == tt), None)
        if hit is None:
            if not new["segments"]:
                continue
            existing.insert(prev_idx + 1, new)          # logo acima da faixa anterior da lista → camada certa
            hit = prev_idx + 1
            created.append(tn)
        else:
            tr = existing[hit]
            ref = tr["segments"][-1] if tr["segments"] else None
            for sg in new["segments"]:
                if ref:
                    sg["render_index"], sg["track_render_index"] = ref["render_index"], ref["track_render_index"]
                tr["segments"].append(sg)
        added += len(new["segments"])
        prev_idx = hit
    rx = {"video": 0, "sticker": 14000, "text": 14100, "effect": 11000, "audio": 0}
    for i, tr in enumerate(existing):
        for sg in tr["segments"]:
            if tr["name"] in created:
                sg["track_render_index"] = i
                sg["render_index"] = rx[tr["type"]] + (i if tr["type"] in ("sticker", "text", "effect") else 0) if tr["type"] != "video" else 1
    end = max(sg["target_timerange"]["start"] + sg["target_timerange"]["duration"] for t in existing for sg in t["segments"])
    d["duration"] = end
    js = json.dumps(d, ensure_ascii=False)
    for t in targets:
        if t.exists() or t.name == "draft_info.json":
            t.write_text(js, encoding="utf-8")
    mp = folder / "draft_meta_info.json"
    meta = json.load(open(mp))
    meta["tm_duration"] = end
    meta["tm_draft_modified"] = int(time.time() * US)
    json.dump(meta, open(mp, "w"), ensure_ascii=False)
    rp = ROOT / "root_meta_info.json"
    shutil.copy(rp, ROOT / "root_meta_info.json.antes_claude")
    r = json.load(open(rp))
    for e in r["all_draft_store"]:
        if e.get("draft_fold_path") == str(folder):
            e["tm_duration"] = end
            e["tm_draft_modified"] = int(time.time() * US)
    json.dump(r, open(rp, "w"), ensure_ascii=False)
    print(f"Anexado em {folder.name}: {added} segmentos novos; faixas novas: {created or 'nenhuma'}; duração agora {end / US:.2f}s")


def write_project(folder, name, d, DUR, cover_src):
    ids = {"draft": uid(), "tl": uid(), "proj": uid()}
    d["id"] = ids["tl"]
    now_us = int(time.time() * US)
    shutil.copytree(TPL, folder, ignore=shutil.ignore_patterns("draft_info.json", "tl", "Timelines", "._*"), dirs_exist_ok=True)
    tld = folder / "Timelines" / ids["tl"]
    shutil.copytree(TPL / "tl", tld, ignore=shutil.ignore_patterns("._*"))
    for f in folder.rglob("*.json"):
        if "materials" in f.parts:
            continue
        s = f.read_text(encoding="utf-8")
        for k in OLD:
            s = s.replace(OLD[k], ids[k])
        s = s.replace(str(ROOT / "0909"), str(folder))
        f.write_text(s, encoding="utf-8")
    pj = json.load(open(TPL / "Timelines/project.json"))
    pj.update(id=ids["proj"], main_timeline_id=ids["tl"], create_time=now_us, update_time=now_us)
    pj["timelines"] = [{"create_time": now_us, "id": ids["tl"], "is_marked_delete": False,
                        "name": "Linha do tempo 01", "update_time": now_us}]
    for p in (folder / "Timelines/project.json", folder / "Timelines/project.json.bak"):
        json.dump(pj, open(p, "w"))
    js = json.dumps(d, ensure_ascii=False)
    for p in ["draft_info.json", "draft_info.json.bak", f"Timelines/{ids['tl']}/draft_info.json",
              f"Timelines/{ids['tl']}/draft_info.json.bak", f"Timelines/{ids['tl']}/draft_content.json"]:
        (folder / p).write_text(js, encoding="utf-8")
    (folder / "draft_settings").write_text(f"[General]\ncloud_last_modify_platform=mac\ndraft_create_time={now_us // US}\n"
                                           f"draft_last_edit_time={now_us // US}\nreal_edit_keys=0\nreal_edit_seconds=0\n")
    cover = folder / "draft_cover.jpg"
    if cover_src:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", cover_src, "-frames:v", "1", "-vf", "scale=-2:640", str(cover)])
    if cover.exists():
        shutil.copy(cover, folder / "Timelines/draft_cover.jpg")
        shutil.copy(cover, tld / "draft_cover.jpg")
    # meta: painel de mídia com os arquivos do projeto
    mp = folder / "draft_meta_info.json"
    meta = json.load(open(mp))
    for k in list(meta):
        if k.startswith("tm_draft_cloud") or k.startswith("cloud_package"):
            meta.pop(k)
    meta.update(draft_id=ids["draft"], draft_name=name, draft_fold_path=str(folder), draft_root_path=str(ROOT),
                draft_cover="draft_cover.jpg", tm_duration=DUR, tm_draft_create=now_us, tm_draft_modified=now_us,
                draft_cloud_last_action_download=False, draft_new_version="")
    grp = meta["draft_materials"][0]["value"]
    proto = grp[0]
    grp.clear()
    seen = set()
    for kind, mt in (("video", 0), ("audio", 0)):
        for m in d["materials"].get(kind + "s", []):
            pth = m.get("path", "")
            if not pth or pth in seen or not pth.startswith(str(folder)):
                continue
            seen.add(pth)
            e = copy.deepcopy(proto)
            e.update(id=uid(), file_Path=pth, extra_info=Path(pth).name, duration=m.get("duration", 0),
                     width=m.get("width", 0), height=m.get("height", 0), import_time=now_us // US,
                     metetype={"video": "photo" if m.get("type") == "photo" else "video", "audio": "music"}[kind])
            grp.append(e)
    json.dump(meta, open(mp, "w"), ensure_ascii=False)
    rp = ROOT / "root_meta_info.json"
    shutil.copy(rp, ROOT / "root_meta_info.json.antes_claude")
    r = json.load(open(rp))
    ent = copy.deepcopy(r["all_draft_store"][0])
    for k in list(ent):
        if k.startswith("tm_draft_cloud"):
            ent.pop(k)
    ent.update(draft_cover=str(cover), draft_fold_path=str(folder), draft_id=ids["draft"],
               draft_json_file=str(folder / "draft_info.json"), draft_name=name, draft_root_path=str(ROOT),
               draft_timeline_materials_size=0, tm_draft_create=now_us, tm_draft_modified=now_us,
               tm_draft_removed=0, tm_duration=DUR, cloud_draft_sync=False, draft_cloud_last_action_download=False)
    r["all_draft_store"].insert(0, ent)
    json.dump(r, open(rp, "w"), ensure_ascii=False)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    build(sys.argv[1])
