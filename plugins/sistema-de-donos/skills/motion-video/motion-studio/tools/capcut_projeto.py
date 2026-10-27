"""Cria um projeto na tela inicial do CapCut (desktop Mac): vídeo numa faixa + cada áudio na sua própria faixa.

uso: python3 tools/capcut_projeto.py "<Nome>" <video.mp4> <audio1.wav> [audio2.wav ...]
     (cada áudio vira uma faixa separada, começando em 0:00, volume 100%)

Feche o CapCut antes (ele reescreve root_meta_info.json ao sair).
Molde: tools/capcut/template (CapCut 9.4 / draft 185) + tools/capcut/audio_exemplar.json.
Nunca altera projetos existentes; faz backup do root_meta_info.json antes de registrar.
"""
import copy, json, os, shutil, subprocess, sys, time, uuid
from pathlib import Path

ROOT = Path.home() / "Movies/CapCut/User Data/Projects/com.lveditor.draft"
HERE = Path(__file__).parent / "capcut"
TPL = HERE / "template"
OLD = {"draft": "C50CF1BD-31C0-46b9-B43E-D7E00DC9F92D", "tl": "44E68289-B5B2-4da7-A4C5-E1290A9BD307",
       "proj": "4802CD9A-058B-4558-AAF6-6F57C7B11E64"}
US = 1_000_000


def uid():
    return str(uuid.uuid4()).upper()


def probe(path):
    return json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
                      "stream=codec_type,width,height:format=duration", "-of", "json", path]))


def main(name, video, *audios):
    if subprocess.run(["pgrep", "-x", "CapCut"], capture_output=True).stdout:
        sys.exit("Feche o CapCut antes de gerar o projeto.")
    video = str(Path(video).resolve())
    audios = [str(Path(a).resolve()) for a in audios]
    pr = probe(video)
    vs = next(s for s in pr["streams"] if s["codec_type"] == "video")
    W, H = vs["width"], vs["height"]
    DUR = round(float(pr["format"]["duration"]) * 10) * 100_000   # grade 0,1s
    folder = ROOT / name
    n = 1
    while folder.exists():
        n += 1
        folder = ROOT / f"{name} ({n})"
    name = folder.name
    ids = {"draft": uid(), "tl": uid(), "proj": uid()}
    # mídia COPIADA para dentro do projeto (materials/): o CapCut é sandboxed e pode não ter
    # permissão para ler pastas externas (SSD), mas sempre lê a própria pasta de projetos
    (folder / "materials/video").mkdir(parents=True)
    (folder / "materials/audio").mkdir(parents=True)
    shutil.copy2(video, folder / "materials/video" / os.path.basename(video))
    video = str(folder / "materials/video" / os.path.basename(video))
    for i, a in enumerate(audios):
        shutil.copy2(a, folder / "materials/audio" / os.path.basename(a))
        audios[i] = str(folder / "materials/audio" / os.path.basename(a))
    now_us = int(time.time() * US)

    # ---- timeline: vídeo do molde, sem faixa de texto
    d = json.load(open(TPL / "draft_info.json"))
    d["id"] = ids["tl"]
    d["duration"] = DUR
    d["canvas_config"] = {"ratio": "9:16" if H > W else "16:9", "width": 1080 if H > W else 1920,
                          "height": 1920 if H > W else 1080, "background": None}
    d["tracks"] = [t for t in d["tracks"] if t["type"] == "video"]
    vtr = d["tracks"][0]
    vtr["id"] = uid()
    M = d["materials"]
    M["texts"], M["material_animations"] = [], []
    remap = {}
    for k, lst in M.items():
        if isinstance(lst, list):
            for x in lst:
                remap[x["id"]] = x["id"] = uid()
    vm, vseg = M["videos"][0], vtr["segments"][0]
    vm.update(path=video, material_name=os.path.basename(video), width=W, height=H, duration=DUR,
              local_material_id="", unique_id="")
    vseg["id"] = uid()
    vseg["material_id"] = remap[vseg["material_id"]]
    vseg["extra_material_refs"] = [remap[r] for r in vseg["extra_material_refs"] if r in remap]
    vseg["source_timerange"] = {"start": 0, "duration": DUR}
    vseg["target_timerange"] = {"start": 0, "duration": DUR}

    # ---- áudios: uma faixa por arquivo
    ex = json.load(open(HERE / "audio_exemplar.json"))
    M.setdefault("audios", [])
    meta_audio = []
    for i, ap in enumerate(audios):
        adur = min(DUR, round(float(probe(ap)["format"]["duration"]) * 10) * 100_000)
        mat = copy.deepcopy(ex["material"])
        mat.update(id=uid(), name=os.path.basename(ap), path=ap, duration=adur, unique_id="",
                   local_material_id="", music_id=str(uuid.uuid4()), wave_points=[])
        refs = []
        for kind, r in ex["refs"]:
            r = copy.deepcopy(r)
            r["id"] = uid()
            M.setdefault(kind, []).append(r)
            refs.append(r["id"])
        M["audios"].append(mat)
        seg = copy.deepcopy(ex["segment"])
        seg.update(id=uid(), material_id=mat["id"], extra_material_refs=refs, volume=1.0, last_nonzero_volume=1.0,
                   source_timerange={"start": 0, "duration": adur}, target_timerange={"start": 0, "duration": adur},
                   render_index=0, track_render_index=i + 1, keyframe_refs=[], common_keyframes=[])
        tr = copy.deepcopy(ex["track"])
        tr.update(id=uid(), segments=[seg], name=Path(ap).stem, is_default_name=False)
        d["tracks"].append(tr)
        meta_audio.append({"ai_group_type": "", "create_time": 0, "duration": adur, "enter_from": 0,
                           "extra_info": os.path.basename(ap), "file_Path": ap, "height": 0, "id": uid(),
                           "import_time": now_us // US, "import_time_ms": -1, "item_source": 1,
                           "material_color_tag": "", "md5": "", "metetype": "music",
                           "roughcut_time_range": {"duration": adur, "start": 0},
                           "sub_time_range": {"duration": -1, "start": -1}, "type": 0, "width": 0})

    # ---- pasta do projeto
    shutil.copytree(TPL, folder, ignore=shutil.ignore_patterns("draft_info.json", "tl", "Timelines", "._*"), dirs_exist_ok=True)
    tld = folder / "Timelines" / ids["tl"]
    shutil.copytree(TPL / "tl", tld, ignore=shutil.ignore_patterns("._*"))
    for f in folder.rglob("*.json"):
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
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", video, "-frames:v", "1", "-vf", "scale=-2:640", str(cover)])
    shutil.copy(cover, folder / "Timelines/draft_cover.jpg")
    shutil.copy(cover, tld / "draft_cover.jpg")

    # ---- meta (painel de mídia: vídeo + áudios)
    mp = folder / "draft_meta_info.json"
    meta = json.load(open(mp))
    for k in list(meta):
        if k.startswith("tm_draft_cloud") or k.startswith("cloud_package"):
            meta.pop(k)
    meta.update(draft_id=ids["draft"], draft_name=name, draft_fold_path=str(folder), draft_root_path=str(ROOT),
                draft_cover="draft_cover.jpg", tm_duration=DUR, tm_draft_create=now_us, tm_draft_modified=now_us,
                draft_cloud_last_action_download=False, draft_new_version="")
    grp = meta["draft_materials"][0]["value"]
    grp[0].update(duration=DUR, extra_info=os.path.basename(video), file_Path=video, width=W, height=H, id=uid(),
                  import_time=now_us // US)
    del grp[1:]
    grp.extend(meta_audio)
    json.dump(meta, open(mp, "w"), ensure_ascii=False)

    # ---- registro na tela inicial
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
    print(f"Projeto CapCut criado: {folder}  (1 vídeo + {len(audios)} faixas de áudio)")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
