"""Extrai um KIT de camadas-modelo de projetos reais do CapCut (segmento + material + todas as refs:
animações, efeitos, máscaras, keyframes) para o capcut_build.py montar projetos novos idênticos ao jeito do editor.

uso: python3 tools/capcut_kit.py styles/<estilo>/capcut_kit.py
O arquivo de definição traz SOURCES (projetos) e PIECES {nome: (projeto, tipo_faixa, predicado)}.
Saída: styles/<estilo>/capcut_kit.json
"""
import json, sys, runpy
from pathlib import Path

ROOT = Path.home() / "Movies/CapCut/User Data/Projects/com.lveditor.draft"


def text_of(mat):
    try:
        return json.loads(mat["content"])["text"]
    except Exception:
        return ""


def walk(d, idx, graphs, out):
    """percorre a timeline e os clipes compostos; idx/graphs acumulam materiais e curvas de todos os níveis"""
    for k, v in d["materials"].items():
        if isinstance(v, list):
            for x in v:
                if isinstance(x, dict) and "id" in x:
                    idx[x["id"]] = (k, x)
    for g in d.get("keyframe_graph_list", []):
        graphs[g["id"]] = g
    for t in d["tracks"]:
        for s in t["segments"]:
            out.append((t, s))
    for dr in d["materials"].get("drafts", []):
        if dr.get("draft"):
            walk(dr["draft"], idx, graphs, out)


def piece(t, s, idx, graphs):
    kind, mat = idx.get(s["material_id"], (None, None))
    refs = [list(idx[r]) for r in s.get("extra_material_refs", []) if r in idx]
    gids = {x["graphID"] for k in s.get("common_keyframes", []) for x in k["keyframe_list"] if x["graphID"]}
    return {"track": {k: v for k, v in t.items() if k != "segments"}, "segment": s, "material": [kind, mat],
            "refs": refs, "graphs": [graphs[g] for g in gids if g in graphs]}


def main(defpath):
    D = runpy.run_path(defpath)
    cache, kit = {}, {}
    for name, (proj, ttype, pred) in D["PIECES"].items():
        if proj not in cache:
            idx, graphs, segs = {}, {}, []
            walk(json.load(open(ROOT / proj / "draft_info.json")), idx, graphs, segs)
            cache[proj] = (idx, graphs, segs)
        idx, graphs, segs = cache[proj]
        hit = None
        for t, s in segs:
            if t["type"] != ttype:
                continue
            kind, mat = idx.get(s["material_id"], (None, {}))
            if pred(s, mat or {}, text_of(mat or {})):
                hit = piece(t, s, idx, graphs)
                break
        if not hit:
            sys.exit(f"peça não encontrada: {name}")
        kit[name] = hit
        print(f"ok  {name:16s} <- {proj} [{ttype}] {hit['material'][0]} refs={len(hit['refs'])} kf={len(hit['segment'].get('common_keyframes', []))}")
    out = Path(defpath).with_suffix(".json")
    out.write_text(json.dumps(kit, ensure_ascii=False))
    print("kit:", out, f"{out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main(sys.argv[1])
