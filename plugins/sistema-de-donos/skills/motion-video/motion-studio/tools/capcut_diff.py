"""Compara o que o Claude entregou no CapCut × o que o editor deixou depois de mexer à mão.
Acompanha cada segmento pelo id e lista: apagados, criados pelo editor, movidos/cortados, escala/posição/rotação,
volume/velocidade, keyframes, animações, efeitos, máscaras, texto (conteúdo, fonte, tamanho, cor, fundo), mídia trocada.

uso: python3 tools/capcut_diff.py <entregue.json> <editado.json>
"""
import json, sys, os
US = 1e6


def load(p):
    d = json.load(open(p))
    idx = {}
    for k, v in d["materials"].items():
        if isinstance(v, list):
            for x in v:
                if isinstance(x, dict) and "id" in x:
                    idx[x["id"]] = (k, x)
    segs = {}
    for ti, t in enumerate(d["tracks"]):
        for s in t["segments"]:
            segs[s["id"]] = (ti, t, s)
    return d, idx, segs


def tx(mat):
    try:
        c = json.loads(mat["content"])
        st = c["styles"][0]
        col = st.get("fill", {}).get("content", {}).get("solid", {}).get("color")
        return dict(text=c["text"], font=os.path.basename(st.get("font", {}).get("path", "")), size=st.get("size"),
                    color=tuple(round(v, 3) for v in col) if col else None, bold=st.get("bold"),
                    stroke=bool(st.get("strokes")), shadow=bool(st.get("shadows")),
                    bg=(mat.get("background_color"), mat.get("background_alpha"), mat.get("background_round_radius")),
                    ls=mat.get("letter_spacing"), lh=mat.get("line_spacing"), styles=len(c["styles"]))
    except Exception:
        return {}


def hexc(c):
    return "#%02x%02x%02x" % tuple(int(v * 255) for v in c) if c else None


def desc(idx, s):
    k, m = idx.get(s["material_id"], (None, {}))
    if k == "texts":
        return f'texto "{tx(m).get("text", "")[:40]}"'
    if k in ("videos", "audios"):
        return f'{m.get("type")} {os.path.basename(m.get("path", ""))[:45]}'
    if k in ("effects", "video_effects"):
        return f'efeito {m.get("name")}'
    if k == "shapes":
        return f'forma {m.get("name")}'
    return f"{k}"


def refs(idx, s):
    out = {}
    for r in s.get("extra_material_refs", []):
        k, x = idx.get(r, (None, {}))
        if k == "material_animations":
            out["anim"] = sorted(f'{a.get("type")}:{a.get("name")}:{a.get("duration", 0) / US:.2f}s' for a in x.get("animations", []))
        elif k in ("video_effects", "effects", "filters"):
            m = (x.get("effect_mask") or [{}])[0].get("config") if x.get("effect_mask") else None
            out.setdefault("efeitos", []).append(f'{x.get("name")}' + (f' máscara(y={m["centerY"]:.2f},inv={m["invert"]})' if m else ""))
        elif k in ("masks", "common_mask"):
            out.setdefault("mascaras", []).append(f'{x.get("name")}{json.dumps({a: round(b, 2) for a, b in (x.get("config") or {}).items() if isinstance(b, float)})}')
        elif k == "speeds":
            out["speed"] = round(x.get("speed", 1), 3)
        elif k == "transitions":
            out["transicao"] = f'{x.get("name")} {x.get("duration", 0) / US:.2f}s'
        elif k == "audio_fades":
            out["fade"] = f'{x.get("fade_in_duration", 0) / US:.2f}/{x.get("fade_out_duration", 0) / US:.2f}'
        elif k == "canvases" and x.get("type") not in (None, "canvas_color"):
            out["fundo"] = f'{x.get("type")} blur={x.get("blur")}'
    for k in ("efeitos", "mascaras"):
        if k in out:
            out[k] = sorted(out[k])
    return out


def kfs(s):
    out = {}
    for k in s.get("common_keyframes", []):
        L = k["keyframe_list"]
        out[k["property_type"].replace("KFType", "")] = [(round(x["time_offset"] / US, 2), round(x["values"][0], 3) if x["values"] else None) for x in L]
    return out


def geo(s):
    c = s.get("clip") or {}
    return dict(sc=round(c.get("scale", {}).get("x", 1), 3), x=round(c.get("transform", {}).get("x", 0), 3),
                y=round(c.get("transform", {}).get("y", 0), 3), rot=round(c.get("rotation", 0), 1), a=round(c.get("alpha", 1), 2))


def main(a, b):
    da, ia, sa = load(a)
    db, ib, sb = load(b)
    print(f"ENTREGUE {da['duration'] / US:.2f}s · {len(sa)} segs  →  EDITADO {db['duration'] / US:.2f}s · {len(sb)} segs\n")
    ta = [(t.get("name"), t["type"]) for t in da["tracks"]]
    tb = [(t.get("name"), t["type"]) for t in db["tracks"]]
    if ta != tb:
        print("FAIXAS antes:", ta, "\nFAIXAS depois:", tb, "\n")
    dels = [i for i in sa if i not in sb]
    adds = [i for i in sb if i not in sa]
    print(f"== APAGADOS pelo editor ({len(dels)})")
    for i in sorted(dels, key=lambda i: sa[i][2]["target_timerange"]["start"]):
        ti, t, s = sa[i]
        print(f'  [{t.get("name") or t["type"]}] {s["target_timerange"]["start"] / US:6.2f}+{s["target_timerange"]["duration"] / US:5.2f}  {desc(ia, s)}')
    print(f"\n== CRIADOS pelo editor ({len(adds)})")
    for i in sorted(adds, key=lambda i: sb[i][2]["target_timerange"]["start"]):
        ti, t, s = sb[i]
        k, m = ib.get(s["material_id"], (None, {}))
        extra = ""
        if k == "texts":
            T = tx(m); extra = f' fonte={T.get("font")} tam={T.get("size")} cor={hexc(T.get("color"))} fundo={T.get("bg")}'
        print(f'  [{t.get("name") or t["type"]}] {s["target_timerange"]["start"] / US:6.2f}+{s["target_timerange"]["duration"] / US:5.2f}  {desc(ib, s)} {geo(s)} vol={s.get("volume")} {refs(ib, s)} {kfs(s) or ""}{extra}')
    print("\n== ALTERADOS")
    n = 0
    for i in sorted([i for i in sa if i in sb], key=lambda i: sa[i][2]["target_timerange"]["start"]):
        (_, t0, s0), (_, t1, s1) = sa[i], sb[i]
        ch = []
        A, B = s0["target_timerange"], s1["target_timerange"]
        if A != B:
            ch.append(f'tempo {A["start"] / US:.2f}+{A["duration"] / US:.2f} → {B["start"] / US:.2f}+{B["duration"] / US:.2f}')
        if (s0.get("source_timerange") or {}).get("start") != (s1.get("source_timerange") or {}).get("start"):
            ch.append(f'trecho da mídia {s0["source_timerange"]["start"] / US:.2f} → {s1["source_timerange"]["start"] / US:.2f}')
        if t0.get("name") != t1.get("name"):
            ch.append(f'faixa {t0.get("name")} → {t1.get("name") or t1["type"]}')
        g0, g1 = geo(s0), geo(s1)
        if g0 != g1:
            ch.append("geo " + " ".join(f"{k} {g0[k]}→{g1[k]}" for k in g0 if g0[k] != g1[k]))
        if round(s0.get("volume", 1), 3) != round(s1.get("volume", 1), 3):
            ch.append(f'volume {s0.get("volume"):.3f} → {s1.get("volume"):.3f}')
        r0, r1 = refs(ia, s0), refs(ib, s1)
        if r0 != r1:
            ch.append("refs " + "; ".join(f"{k}: {r0.get(k)} → {r1.get(k)}" for k in set(r0) | set(r1) if r0.get(k) != r1.get(k)))
        k0, k1 = kfs(s0), kfs(s1)
        if k0 != k1:
            ch.append(f"keyframes {k0} → {k1}")
        m0 = ia.get(s0["material_id"], (None, {}))[1]
        m1 = ib.get(s1["material_id"], (None, {}))[1]
        if ia.get(s0["material_id"], (None,))[0] == "texts":
            T0, T1 = tx(m0), tx(m1)
            for k in T0:
                if T0[k] != T1.get(k):
                    v0, v1 = (hexc(T0[k]), hexc(T1[k])) if k == "color" else (T0[k], T1.get(k))
                    ch.append(f"texto.{k} {v0!r} → {v1!r}")
        elif m0.get("path") != m1.get("path"):
            ch.append(f'mídia {os.path.basename(m0.get("path", ""))} → {os.path.basename(m1.get("path", ""))}')
        if ch:
            n += 1
            print(f'  [{t0.get("name") or t0["type"]}] {A["start"] / US:6.2f} {desc(ia, s0)}\n      ' + "\n      ".join(ch))
    print(f"\n({n} alterados)")


if __name__ == "__main__":
    main(*sys.argv[1:3])
