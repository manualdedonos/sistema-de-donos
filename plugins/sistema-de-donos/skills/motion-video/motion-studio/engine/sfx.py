"""Sound design sintetizado + trilha.
uso: python engine/sfx.py projects/<nome> <fps> <frames>
Lê out/sfx.json (gerado pelo render a partir de SFX + transições) e audio.json (música, ducking).
Gera out/mix.wav. Biblioteca de sons: GEN abaixo — para um som novo, adicione uma função e registre em GEN."""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

proj, FPS, FRAMES = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
SR = 48000
DUR = FRAMES / FPS
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2), np.float32)


def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    return (np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * np.maximum(0, t - a) / max(d, 1e-4))).astype(np.float32)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def sweep_noise(dur, f0, f1, q=0.6):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    fc = np.geomspace(f0, f1, n)
    y = np.zeros(n)
    low = band = 0.0
    k = 1 / q
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        high = x[i] - low - k * band
        band += f * high
        low += f * band
        y[i] = band
    return y / (np.abs(y).max() + 1e-9)


# ---------------- biblioteca ----------------
def whoosh(dur=.5, f0=300, f1=5000, peak=.55, **_):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    e = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.6)
    return (sweep_noise(dur, f0, f1) * e).astype(np.float32)


def pop(f0=700, f1=160, dur=.12, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-t * 40)
    return (np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, .002, .035)).astype(np.float32)


def click(freq=2400, dur=.03, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 2000, 9000) * env(n, .0005, .004, 6)
    return (nz * .6 + np.sin(2 * np.pi * freq * t) * env(n, .0005, .008, 5) * .5).astype(np.float32)


def tick(**_):
    n = int(.018 * SR)
    t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 3000, 10000) * env(n, .0003, .002, 6) * .7
    s += np.sin(2 * np.pi * rng.uniform(3200, 5200) * t) * env(n, .0003, .003, 6) * .25
    return s.astype(np.float32)


def chime(notes=(1318.5, 1975.5), gap=.07, dur=1.4, **_):
    n = int(dur * SR)
    out = np.zeros(n, np.float32)
    t = np.arange(n) / SR
    for k, f in enumerate(notes):
        s = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.01 * t) + .12 * np.sin(2 * np.pi * f * 3.98 * t)
        s = (s * env(n, .002, .45, 3)).astype(np.float32)
        o = int(k * gap * SR)
        out[o:] += s[: n - o] * (.8 if k else 1)
    return out / np.abs(out).max()


def boom(dur=1.0, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = 38 + 60 * np.exp(-t * 18)
    return (np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * env(n, .003, .35, 3)).astype(np.float32)


def scribble(dur=.32, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 1800, 6000)
    am = .55 + .45 * np.sin(2 * np.pi * 22 * t + rng.uniform(0, 6)) ** 2
    e = np.minimum(1, t / .03) * np.minimum(1, (dur - t) / .08)
    return (s * am * e / (np.abs(s).max() + 1e-9)).astype(np.float32)


def shimmer(dur=1.2, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in (2637, 3136, 3951, 5274))
    e = np.minimum(1, t / (dur * .45)) * np.exp(-np.maximum(0, t - dur * .45) * 5)
    return (s / 4 * e).astype(np.float32)


# ---- família "Apple UI" (ref.: áudio TikTok plazfxx) — ataque macio, sub grave, cliques cristalinos, pings puros ----
def lp(x, fc):
    return sosfilt(butter(2, fc, "low", fs=SR, output="sos"), x)


def hp(x, fc):
    return sosfilt(butter(2, fc, "high", fs=SR, output="sos"), x)


def swell(attack=.38, release=.32, f0=160, f1=1600, sub=.7, **_):
    """ar que CRESCE até o evento (o pico cai exatamente no frame dado: o place antecipa pelo attack)."""
    n = int((attack + release) * SR)
    t = np.arange(n) / SR
    e = np.where(t < attack, (t / attack) ** 2.4, np.exp(-(t - attack) / (release * .35)))
    air = sweep_noise((attack + release), f0, f1, .9) * .55
    fr = 52 + 26 * np.minimum(1, t / attack)
    s = (air + sub * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * e
    s = lp(s, 2600)
    return (s / (np.abs(s).max() + 1e-9)).astype(np.float32)


def haptic(f=88, dur=.34, **_):
    """batida sub macia, tipo vibração do iPhone: sem estalo, só corpo."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f * (1 + .18 * np.exp(-t * 30))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    s = (np.sin(ph) + .22 * np.sin(2 * ph)) * env(n, .006, dur * .55, 3.2)
    return (np.tanh(1.4 * s) / np.tanh(1.4)).astype(np.float32)


def glass(freq=3600, **_):
    """clique cristalino de vidro/UI: transiente curtíssimo + ressonância aguda breve."""
    n = int(.06 * SR)
    t = np.arange(n) / SR
    s = hp(bp(rng.standard_normal(n), 2500, 12000), 2000) * env(n, .0003, .004, 6) * .7
    s += np.sin(2 * np.pi * freq * t) * env(n, .0004, .02, 5) * .45
    s += np.sin(2 * np.pi * freq * 1.52 * t) * env(n, .0004, .012, 5) * .2
    return (s / (np.abs(s).max() + 1e-9)).astype(np.float32)


def ping(f=2350, dur=.9, **_):
    """tom puro agudo de confirmação (Apple): ataque suave, cauda limpa."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + .14 * np.sin(2 * np.pi * f * 2.0 * t) + .05 * np.sin(2 * np.pi * f * 2.76 * t)
    s = s * env(n, .008, dur * .42, 3.4)
    return (s / (np.abs(s).max() + 1e-9)).astype(np.float32)


def air(dur=.9, **_):
    """brilho de ar (6–16 kHz) que entra e sai em sino — acompanha pings e revelações."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = hp(bp(rng.standard_normal(n), 5500, 16000), 5000)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return (s * e / (np.abs(s).max() + 1e-9)).astype(np.float32)


# amostras REAIS: motion-studio/sfx/<pasta>/<nome>.wav → ["sample", frame, ganho, pan, {file:"rony/sub_hit", rate?, align?}]
# align="peak" (padrão) põe o PICO do som no frame (risers/whooshes chegam no evento); align="start" começa no frame.
STUDIO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_smp = {}


def _load(file):
    if file not in _smp:
        sr, x = wavfile.read(os.path.join(STUDIO, "sfx", file + ".wav"))
        x = x.astype(np.float32) / (32768 if x.dtype == np.int16 else 1)
        if x.ndim > 1:
            x = x.mean(1)
        if sr != SR:
            x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x).astype(np.float32)
        e = np.convolve(np.abs(x), np.ones(480) / 480, "same")
        _smp[file] = (x, e.argmax() / SR)
    return _smp[file]


def sample(file, rate=1.0, **_):
    x = _load(file)[0]
    return x if rate == 1 else np.interp(np.arange(0, len(x) - 1, rate), np.arange(len(x)), x).astype(np.float32)


LEAD = {"swell": lambda ev: ev.get("attack", .38), "sample": lambda ev: 0 if ev.get("align") == "start" else _load(ev["file"])[1] / ev.get("rate", 1)}   # sons que precisam chegar ao pico NO frame indicado

# ---------------- PAPEL (estilo paper-vox) ----------------
def rustle(dur=.28, bright=1.0, **_):
    """papel deslizando sobre papel: ruído de banda média com grão de estalinhos (fibra)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 900 * bright, 7000 * bright)
    grit = (rng.random(n) < 900 / SR) * rng.standard_normal(n) * 4
    s = s + bp(grit, 2500, 9000)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** .8
    return (s * e / (np.abs(s).max() + 1e-9)).astype(np.float32)


def slap(body=1.0, **_):
    """folha/recorte batendo na mesa: estalo seco + corpo grave curto."""
    n = int(.16 * SR)
    t = np.arange(n) / SR
    snap = bp(rng.standard_normal(n), 1200, 8000) * env(n, .0004, .012, 5)
    thud = np.sin(2 * np.pi * (90 + 60 * np.exp(-t * 60)) * t) * env(n, .001, .05, 4) * .8 * body
    s = snap + thud
    return (s / (np.abs(s).max() + 1e-9)).astype(np.float32)


def crinkle(dur=.35, **_):
    """papel amassando/rasgando: rajada irregular de estalos."""
    n = int(dur * SR)
    s = np.zeros(n)
    for _ in range(int(dur * 70)):
        i = int(rng.uniform(0, n - 400)); k = int(rng.uniform(80, 400))
        s[i:i + k] += bp(rng.standard_normal(k), 1500, 9000) * np.exp(-np.arange(k) / (k / 4)) * rng.uniform(.3, 1)
    e = np.minimum(1, np.arange(n) / (.02 * SR)) * np.minimum(1, (n - np.arange(n)) / (.06 * SR))
    return (s * e / (np.abs(s).max() + 1e-9)).astype(np.float32)


GEN = dict(whoosh=whoosh, pop=pop, click=click, tick=tick, chime=chime, boom=boom, scribble=scribble, shimmer=shimmer,
           swell=swell, haptic=haptic, glass=glass, ping=ping, air=air, sample=sample, rustle=rustle, slap=slap, crinkle=crinkle)

# ---------------- posicionamento ----------------
audio = json.load(open(os.path.join(proj, "audio.json"))) if os.path.exists(os.path.join(proj, "audio.json")) else {}
boost = audio.get("sfxBoost", {})


def place(sig, frame, gain=1.0, pan=0.0, panFrom=None, panTo=None):
    if frame >= boost.get("fromFrame", 1e9):
        gain *= boost.get("gain", 1)
    if panFrom is not None:
        p = np.linspace(panFrom, panTo, len(sig))
    else:
        p = np.full(len(sig), pan)
    st = np.stack([sig * np.cos((p + 1) * np.pi / 4), sig * np.sin((p + 1) * np.pi / 4)], 1) * np.sqrt(2)
    i = int(frame / FPS * SR)
    j = min(N, i + len(st))
    if i < N:
        mix[i:j] += st[: j - i] * gain


for ev in json.load(open(os.path.join(proj, "out", "sfx.json"))):
    name, fr, g, pan = ev.pop("name"), ev.pop("frame"), ev.pop("gain", 1), ev.pop("pan", 0)
    pf, pt = ev.pop("panFrom", None), ev.pop("panTo", None)
    if name in ("typing", "clicks", "glasstaps"):   # rajadas: um som a cada `step` frames até `to`
        to, step = ev.pop("to"), ev.pop("step", 2)
        for f in np.arange(fr, to, step):
            s = tick() if name == "typing" else glass(rng.uniform(3200, 4600)) if name == "glasstaps" else click(rng.uniform(2600, 3400), .02)
            place(s, float(f) + rng.uniform(-.3, .3), g * rng.uniform(.6, 1), pan + rng.uniform(-.3, .3))
        continue
    if name in LEAD:
        fr -= LEAD[name](ev) * FPS
    place(GEN[name](**ev), fr, g, pan, pf, pt)

# ---------------- clipes de voz/áudio (narração, falas) ----------------
# audio.json "clips": [{path, frame, gain?, start?, dur?}] — start/dur em segundos dentro do arquivo
# "voiceDuck": 0..1 → a música abaixa sob a voz dos clipes (sidechain pelo envelope da voz)
pre_clips = mix.copy()
for c in audio.get("clips", []):
    tmp = os.path.join(proj, "out", "clip_tmp.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(c.get("start", 0))] + (["-t", str(c["dur"])] if "dur" in c else []) +
                   ["-i", c["path"], "-ar", str(SR), "-ac", "1", tmp], check=True)
    place(wavfile.read(tmp)[1].astype(np.float32) / 32768, c["frame"], c.get("gain", 1.0))

# ---------------- trilha ----------------
out = mix
m = audio.get("music")
if m:
    start = m.get("start", 0)
    if "align" in m:                              # alinha um momento da música (ex.: drop) a um frame
        start = m["align"]["musicTime"] - m["align"]["frame"] / FPS
    tmp = os.path.join(proj, "out", "music_seg.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(DUR), "-i", m["path"],
                    "-ar", str(SR), "-ac", "2", tmp], check=True)
    song = wavfile.read(tmp)[1].astype(np.float32) / 32768
    song = np.pad(song, ((0, max(0, N - len(song))), (0, 0)))[:N]
    t = np.arange(N) / SR
    song *= (np.minimum(1, t / m.get("fadeIn", .25)) * np.clip((DUR - t) / m.get("fadeOut", 1.6), 0, 1) ** 1.5)[:, None]
    duck = np.ones(N, np.float32)
    for fr, d in audio.get("duck", []):
        i, k = int(fr / FPS * SR), int(d * SR)
        duck[i:i + k] = np.minimum(duck[i:i + k], 1 - .35 * np.sin(np.linspace(0, np.pi, len(duck[i:i + k]))))
    lv = audio.get("musicLevel")                  # automação de volume: [[frame, nível], ...] interpolada (rampa de 0,25s)
    if lv:
        fr_ = np.arange(N) / SR * FPS
        pts = sorted(lv)
        xs, ys = [], []
        for f0, v in pts:
            if xs:
                xs.append(f0 - .25 * FPS); ys.append(ys[-1])
            xs.append(f0); ys.append(v)
        duck *= np.interp(fr_, xs, ys).astype(np.float32)
    vd = audio.get("voiceDuck", 0)
    if vd and audio.get("clips"):
        vox = np.abs(mix - pre_clips).max(1)
        win = int(.03 * SR)
        envv = np.sqrt(np.convolve(vox ** 2, np.ones(win) / win, "same"))
        envv = np.clip(envv / (np.percentile(envv[envv > 1e-4], 90) + 1e-9), 0, 1)
        rel = int(.35 * SR)                       # release lento: a música volta suave entre frases
        envv = np.convolve(envv, np.ones(rel) / rel, "same")
        duck *= 1 - vd * np.clip(envv * 1.6, 0, 1)
    out = song * duck[:, None] * m.get("gain", .56) + mix

# STEMS=1 → também salva as camadas separadas (mesma escala relativa da mixagem) para editar em outro programa
if os.environ.get("STEMS"):
    sfx_l = pre_clips
    vox_l = mix - pre_clips
    mus_l = (song * duck[:, None] * m.get("gain", .56)) if m else np.zeros_like(mix)
    k = .95 / max(1e-9, np.abs(sfx_l + vox_l + mus_l).max())
    for nome, buf in (("1-voz", vox_l), ("2-musica", mus_l), ("3-efeitos", sfx_l)):
        wavfile.write(os.path.join(proj, "out", f"stem_{nome}.wav"), SR, (np.clip(buf * k, -1, 1) * 32767).astype(np.int16))
    print("stems ok")
out = np.tanh(out * 1.1) / np.tanh(1.1)
out = np.clip(out / max(1.0, np.abs(out).max()), -1, 1)
wavfile.write(os.path.join(proj, "out", "mix.wav"), SR, (out * 32767 * .95).astype(np.int16))
print("mix ok")
