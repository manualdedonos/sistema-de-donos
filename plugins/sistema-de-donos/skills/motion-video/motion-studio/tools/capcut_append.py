"""Acrescenta camadas ao FINAL da timeline de um projeto EXISTENTE do CapCut (desktop Mac), cada uma na sua faixa.

uso: python3 tools/capcut_append.py "<Projeto>" v:"Nome da faixa"=arquivo.mov  v:"Outra"=arq.mp4  a:"Voz"=voz.wav ...
     v: = faixa de vídeo (sobreposição, sem áudio; a ordem dá a camada: a última v: fica por cima)
     a: = faixa de áudio
     START=<segundos> opcional (padrão: fim atual da timeline)

Feche o CapCut antes. Faz backup de todos os draft_info.json (*.antes_claude_<ts>) antes de gravar.
Mídia é copiada para ~/Movies/CapCut/Midia Claude/<Projeto>/ (pasta que o CapCut sandboxed consegue ler).
"""
import copy, json, os, shutil, subprocess, sys, time, uuid
from pathlib import Path

ROOT = Path.home() / "Movies/CapCut/User Data/Projects/com.lveditor.draft"
MEDIA = Path.home() / "Movies/CapCut/Midia Claude"
HERE = Path(__file__).parent / "capcut"
US = 1_000_000


def uid():
    return str(uuid.uuid4()).upper()


def probe(path):
    return json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
                      "stream=codec_type,width,height:format=duration", "-of", "json", path]))


def main(name, *layers):
    if subprocess.run(["pgrep", "-x", "CapCut"], capture_output=True).stdout:
        sys.exit("Feche o CapCut antes.")
    folder = ROOT / name
    tl_files = [folder / "draft_info.json", folder / "draft_info.json.bak"]
    for t in (folder / "Timelines").glob("*/draft_info.json*"):
        tl_files.append(t)
    d = json.load(open(folder / "draft_info.json"))
    ts = time.strftime("%Y%m%d-%H%M%S")
    for f in tl_files:
        shutil.copy2(f, str(f) + f".antes_claude_{ts}")
    M = d["materials"]
    idx = {x["id"]: (k, x) for k, l in M.items() if isinstance(l, list) for x in l}
    start = int(float(os.environ["START"]) * US) if "START" in os.environ else d["duration"]

    # molde de vídeo: primeiro segmento de uma faixa de sobreposição (ou da principal)
    vtracks = [t for t in d["tracks"] if t["type"] == "video" and t["segments"]]
    ex_seg = (vtracks[1] if len(vtracks) > 1 else vtracks[0])["segments"][0]
    ex_track = {k: v for k, v in (vtracks[1] if len(vtracks) > 1 else vtracks[0]).items() if k != "segments"}
    ex_mat = idx[ex_seg["material_id"]][1]
    aex = json.load(open(HERE / "audio_exemplar.json"))
    rmax = max([s.get("render_index", 0) for t in d["tracks"] if t["type"] == "video" for s in t["segments"]] + [0])
    trmax = max([s.get("track_render_index", 0) for t in d["tracks"] for s in t["segments"]] + [0])
    dest = MEDIA / name
    dest.mkdir(parents=True, exist_ok=True)
    end = d["duration"]
    vins = next(i for i, t in enumerate(d["tracks"]) if t["type"] != "video") if any(t["type"] != "video" for t in d["tracks"]) else len(d["tracks"])
    for spec in layers:
        kind, rest = spec.split(":", 1)
        label, path = rest.split("=", 1)
        src = Path(path).resolve()
        dst = dest / src.name
        shutil.copy2(src, dst)
        pr = probe(str(dst))
        dur = round(float(pr["format"]["duration"]) * 30) * US // 30
        trmax += 1
        if kind == "v":
            vs = next(s for s in pr["streams"] if s["codec_type"] == "video")
            rmax += 1
            mat = copy.deepcopy(ex_mat)
            mat.update(id=uid(), path=str(dst), material_name=dst.name, duration=dur, width=vs["width"], height=vs["height"],
                       has_audio=any(s["codec_type"] == "audio" for s in pr["streams"]), local_material_id="", unique_id="",
                       media_path="", local_id="")
            M["videos"].append(mat)
            refs = []
            for r in ex_seg["extra_material_refs"]:
                k, x = idx[r]
                x = copy.deepcopy(x)
                x["id"] = uid()
                M[k].append(x)
                refs.append(x["id"])
            seg = copy.deepcopy(ex_seg)
            seg.update(id=uid(), material_id=mat["id"], extra_material_refs=refs, volume=0.0, last_nonzero_volume=1.0,
                       source_timerange={"start": 0, "duration": dur}, target_timerange={"start": start, "duration": dur},
                       render_index=rmax, track_render_index=trmax, keyframe_refs=[], common_keyframes=[])
            seg["clip"] = {"scale": {"x": 1.0, "y": 1.0}, "rotation": 0.0, "transform": {"x": 0.0, "y": 0.0},
                           "flip": {"vertical": False, "horizontal": False}, "alpha": 1.0}
            tr = copy.deepcopy(ex_track)
            tr.update(id=uid(), segments=[seg], name=label, is_default_name=False)
            d["tracks"].insert(vins, tr)
            vins += 1
        else:
            mat = copy.deepcopy(aex["material"])
            mat.update(id=uid(), name=dst.name, path=str(dst), duration=dur, unique_id="", local_material_id="",
                       music_id=str(uuid.uuid4()), wave_points=[])
            refs = []
            for k, r in aex["refs"]:
                r = copy.deepcopy(r)
                r["id"] = uid()
                M.setdefault(k, []).append(r)
                refs.append(r["id"])
            M.setdefault("audios", []).append(mat)
            seg = copy.deepcopy(aex["segment"])
            seg.update(id=uid(), material_id=mat["id"], extra_material_refs=refs, volume=1.0, last_nonzero_volume=1.0,
                       source_timerange={"start": 0, "duration": dur}, target_timerange={"start": start, "duration": dur},
                       render_index=0, track_render_index=trmax, keyframe_refs=[], common_keyframes=[])
            tr = copy.deepcopy(aex["track"])
            tr.update(id=uid(), segments=[seg], name=label, is_default_name=False)
            d["tracks"].append(tr)
        end = max(end, start + dur)
        print(f"+ {label}: {dst.name} ({dur / US:.2f}s) em {start / US:.2f}s")
    d["duration"] = end
    js = json.dumps(d, ensure_ascii=False)
    for f in tl_files:
        f.write_text(js, encoding="utf-8")
    mp = folder / "draft_meta_info.json"
    meta = json.load(open(mp))
    meta["tm_duration"] = end
    json.dump(meta, open(mp, "w"), ensure_ascii=False)
    print(f"timeline agora com {end / US:.2f}s · backups: *.antes_claude_{ts}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
