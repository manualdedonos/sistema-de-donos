"""Checagem de ritmo: detecta DEAD HOLDS e gera uma grade de frames (1 imagem só).
uso: python tools/check.py <video.mp4> <saida_dir> [fps_da_grade]
Saída em texto (barata em tokens) + sheet.jpg para revisão visual quando necessário."""
import os
import subprocess
import sys

import numpy as np

src, out = sys.argv[1], sys.argv[2]
sheet_fps = sys.argv[3] if len(sys.argv) > 3 else "2"
os.makedirs(out, exist_ok=True)

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", "scale=64:36:flags=area,format=gray",
                      "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.uint8).reshape(-1, 36, 64).astype(np.float32)
# limiares calibrados a 60fps → em fps maiores compara quadros a 1/60s de distância
fr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", src],
                    capture_output=True, text=True).stdout.strip().split("/")
fps = float(fr[0]) / float(fr[1] if len(fr) > 1 else 1)
st = max(1, round(fps / 60))
d = np.abs(v[st:] - v[:-st]).mean((1, 2))

# dead hold = trecho >= 12 frames com movimento abaixo do limiar
TH, MIN = 0.12, 12 * st
runs, s = [], None
for i, x in enumerate(np.r_[d < TH, False]):
    if x and s is None:
        s = i
    if not x and s is not None:
        if i - s >= MIN:
            runs.append((s, i, float(d[s:i].mean())))
        s = None
total = sum(b - a for a, b, _ in runs)
print(f"frames: {len(v)} | movimento médio: {d.mean():.3f} | frames parados: {total} ({100 * total / len(v):.0f}%)")
for a, b, m in runs:
    kind = "DRIFT LENTO (ok se intencional)" if m > 0.06 else "DEAD HOLD — corrigir"
    print(f"  {a:4d}–{b:4d} ({b - a:3d}f, mov {m:.3f})  {kind}")
if not runs:
    print("  nenhum dead hold ✓")

n = len(v) / 60
cols = 6
rows = int(np.ceil(n * float(sheet_fps) / cols))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf",
                f"fps={sheet_fps},scale=480:-1,tile={cols}x{rows}", "-frames:v", "1",
                os.path.join(out, "sheet.jpg")], check=True)
print("grade:", os.path.join(out, "sheet.jpg"))
