"""Analisa uma música: BPM, energia a cada 5s e DROPS (entrada do grave) com precisão de 30ms.
uso: python tools/music.py <arquivo>   → saída em texto (barata em tokens)"""
import subprocess
import sys

import numpy as np
from scipy.signal import butter, sosfilt

SR = 22050
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = 512
n = len(x) // hop
fr = x[: n * hop].reshape(n, hop)
fps = SR / hop
X = np.abs(np.fft.rfft(fr * np.hanning(hop), axis=1))
flux = np.r_[0, np.maximum(0, np.diff(np.log1p(X * 10), axis=0)).sum(1)]
f = flux - flux.mean()
ac = np.correlate(f, f, "full")[len(f) - 1:]
bpm = 60 / (np.arange(1, len(ac)) / fps)
m = (bpm > 60) & (bpm < 180)
print(f"duração {len(x) / SR:.1f}s | BPM ≈ {bpm[m][np.argmax(ac[1:][m])]:.1f}")

lo = sosfilt(butter(4, 100, "low", fs=SR, output="sos"), x)
w = int(.03 * SR)
L = np.sqrt(np.convolve(lo ** 2, np.ones(w) / w, "valid")[::w])   # grave a cada 30ms
rms = np.sqrt(np.convolve(x ** 2, np.ones(SR) / SR, "valid")[::SR // 1])
print("energia (5s):", " ".join(f"{s}s:{rms[s:s + 5].mean():.2f}" for s in range(0, len(rms), 5)))
# drop = seção em que o grave dos próximos 2s é >1.8x o dos 4s anteriores; refina p/ o 1º salto (30ms)
cands = []
for i in range(134, len(L) - 67, 3):
    ratio = L[i:i + 67].mean() / (L[i - 134:i].mean() + 1e-4)
    if ratio > 1.8:
        cands.append((ratio, i))
drops = []
for ratio, i in sorted(cands, reverse=True):
    if all(abs(i - j) > 200 for _, j in drops):          # 1 por janela de 6s
        base = L[i - 134:i].mean()
        k = next((k for k in range(i - 30, i + 60) if L[k] > 2 * base), i)
        drops.append((ratio, k))
drops.sort(key=lambda d: d[1])
print("drops (entrada do grave):", ", ".join(f"{k * .03:.2f}s (x{r:.1f})" for r, k in drops) or "nenhum")
