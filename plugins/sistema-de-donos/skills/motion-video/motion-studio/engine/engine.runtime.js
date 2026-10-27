
// ============================================================
// MONTAGEM — SC (cenas) e TR (transições) vêm de scenes.js
// SC: [{ a: frameInicial, fn: (ctx, f) => ... }]
// TR: [{ a, b, x, y, type? }]  type: 'circle' | 'fade' | 'wipe' | 'zoomblur' | 'whip' (dir: -1 esquerda, 1 direita) (padrão: STYLE.transition)
// ============================================================
let grain = null;
function makeGrain() {
  grain = mk(256, 256);
  const g = grain.getContext('2d'), id = g.createImageData(256, 256);
  let s = 12345;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  g.putImageData(id, 0, 0);
}

const WHIP = [];
function whipBuf(i) {
  const c = WHIP[i] || (WHIP[i] = mk(W, H)), g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H);
  if (i === 2) { g.fillStyle = K; g.fillRect(0, 0, W, H); }
  return c;
}
function transition(ctx, f, t, from, to) {
  const type = t.type || S.transition || 'circle';
  const p = E.inOutQ((f - t.a) / (t.b - t.a));
  from.fn(ctx, f);
  if (type === 'zoomblur') {   // a cena sai crescendo (whip-zoom) e a nova chega de dentro, ambas com blur
    const x = t.x ?? W / 2, y = t.y ?? H / 2, e = E.inOutC((f - t.a) / (t.b - t.a));
    ctx.save(); ctx.fillStyle = S.colors.light; ctx.fillRect(0, 0, W, H); ctx.restore();
    layer(ctx, 1 - clamp((e - .35) / .5), e * 40, L => { L.translate(x, y); L.scale(1 + e * 2.2, 1 + e * 2.2); L.translate(-x, -y); from.fn(L, f); });
    layer(ctx, clamp((e - .3) / .5), (1 - e) * 36, L => { const s = .55 + .45 * e; L.translate(x, y); L.scale(s, s); L.translate(-x, -y); to.fn(L, f); });
    return;
  }
  if (type === 'whip') {   // whip pan horizontal (ref dnyx): as duas cenas lado a lado, borradas na direção do movimento
    const e = E.inOutC(clamp((f - t.a) / (t.b - t.a))), dir = t.dir || -1, sp = Math.sin(Math.PI * e);
    const A = whipBuf(0), Bf = whipBuf(1), C = whipBuf(2);
    from.fn(A.getContext('2d'), f); to.fn(Bf.getContext('2d'), f);
    const c = C.getContext('2d'); c.drawImage(A, dir * e * W, 0); c.drawImage(Bf, dir * (e - 1) * W, 0);
    const n = Math.round(1 + sp * 16), span = sp * W * .22;
    ctx.save();
    for (let i = 0; i < n; i++) { ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(C, n > 1 ? (i / (n - 1) - .5) * span : 0, 0); }
    ctx.restore();
    return;
  }
  if (type === 'paper') {   // folha de papel rasgado atravessa a tela (sai do lado de x/y); troca de cena por baixo no meio
    const e = clamp((f - t.a) / (t.b - t.a)), hor = t.dir ? true : Math.abs((t.x ?? W / 2) - W / 2) / W >= Math.abs((t.y ?? H / 2) - H / 2) / H;
    const sgn = t.dir || (hor ? ((t.x ?? 0) < W / 2 ? 1 : -1) : ((t.y ?? 0) < H / 2 ? 1 : -1));
    (e < .5 ? from : to).fn(ctx, f);
    const ext = hor ? W : H, pos = lerp(-ext * 1.35, ext * 1.35, E.inOutC(e)) * sgn;
    const sw = hor ? W * 1.4 : W * 1.3, sh = hor ? H * 1.3 : H * 1.4;
    const im = t.img && IMG(t.img);      // t.img: a folha é um documento (jornal, carta) em vez de papel liso
    if (im) scrap(ctx, f, im, { x: W / 2 + (hor ? pos : 0), y: H / 2 + (hor ? 0 : pos), w: Math.max(sw, sh * im.width / im.height), rot: hor ? .03 * sgn : -.02, inn: 'none', torn: 26, seg: 14, rim: 10, edges: hor ? 'lr' : 'tb', bw: t.bw ?? true, maxW: 1400, drift: [0, 0], jit: 0, lift: 1.6, seed: 7 + (t.a | 0) });
    else tornRect(ctx, (W - sw) / 2 + (hor ? pos : 0), (H - sh) / 2 + (hor ? 0 : pos), sw, sh, { seed: 7 + (t.a | 0), amp: 26, seg: 14, edges: hor ? 'lr' : 'tb', rot: hor ? .03 * sgn : -.02, lift: 1.6 });
    return;
  }
  if (type === 'fade') {
    layer(ctx, p, (1 - p) * 20, L => to.fn(L, f));
    return;
  }
  ctx.save();
  if (type === 'wipe') {
    ctx.beginPath(); ctx.rect(0, 0, W * p, H); ctx.clip(); to.fn(ctx, f); ctx.restore();
    ctx.save(); ctx.fillStyle = O; ctx.fillRect(W * p - 6, 0, 12 * (1 - p) + 2, H); ctx.restore();
    return;
  }
  const x = t.x ?? W / 2, y = t.y ?? H / 2;
  const R = p * (Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40);
  circle(ctx, x, y, R); ctx.clip(); to.fn(ctx, f); ctx.restore();
  ctx.save(); ctx.strokeStyle = O; ctx.lineWidth = 3 + 10 * (1 - p); circle(ctx, x, y, R); ctx.stroke(); ctx.restore();
}

function render(ctx, f) {
  if (STEP) f = Math.floor(f * STEP / FPS + 1e-6) * FPS / STEP;   // stop-motion: animação em degraus (STYLE.step fps)
  ctx.save();
  const ti = TR.findIndex(t => f >= t.a && f < t.b);
  if (ti >= 0) {
    const t = TR[ti];
    const from = SC.filter(s => s.a < t.a).pop();          // cena que está saindo
    const to = SC.filter(s => s.a <= Math.max(f, t.a)).pop(); // cena que entra (começa em t.a)
    transition(ctx, f, t, from, to);
  } else {
    SC.filter(s => f >= s.a).pop().fn(ctx, f);
  }
  if (S.vignette) { const v = S.vignette, k = v.breathe ? 1 + v.breathe * Math.sin(f / N * TAU * (v.cycles || 4)) : 1; vignette(ctx, v.amt * k, v.rgb, v.inner * (2 - k)); }
  if (!THUMB && grain && (S.grain ?? .06) > 0) {
    ctx.save(); ctx.globalAlpha = S.grain ?? .06; ctx.globalCompositeOperation = 'overlay';
    ctx.translate(-((f * 73) % 256), -((f * 151) % 256));
    ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W + 256, H + 256);
    ctx.restore();
  }
  ctx.restore();
}

// RÉGUA DE TEMPO (opcional): TIMEMAP = [[frameReal, frameDoDesenho], ...] em scenes.js, crescente.
// Sincroniza o vídeo com uma narração: cada trecho do desenho é acelerado/desacelerado para cair no frame
// real da fala, sem mexer na coreografia das cenas. SFX, TR e BOARD continuam escritos em frames do DESENHO.
function warp(x, from, to) {
  const M = TIMEMAP;
  if (x <= M[0][from]) return M[0][to] + (x - M[0][from]);
  for (let i = 1; i < M.length; i++) if (x <= M[i][from]) {
    const a = M[i - 1], b = M[i]; return a[to] + (x - a[from]) * (b[to] - a[to]) / (b[from] - a[from]);
  }
  const l = M[M.length - 1]; return l[to] + (x - l[from]);
}
const hasMap = () => typeof TIMEMAP !== 'undefined' && TIMEMAP.length > 1;
const toDesign = f => hasMap() ? warp(f, 0, 1) : f;   // frame real → desenho
const toReal = d => hasMap() ? warp(d, 1, 0) : d;     // frame do desenho → real

// efeitos sonoros: os declarados em scenes.js (SFX) + 1 swoosh automático por transição
function collectSfx() {
  const list = (typeof SFX !== 'undefined' ? SFX : []).map(e => Array.isArray(e)
    ? { name: e[0], frame: e[1], gain: e[2] ?? 1, pan: e[3] ?? 0, ...(e[4] || {}) } : e);
  const auto = S.sfx && S.sfx.transition;
  if (auto) TR.forEach(t => list.push({ name: auto.name, frame: t.a - 2, gain: auto.gain ?? .33, pan: 0, ...(auto.opts || {}) }));
  list.forEach(e => { e.frame = toReal(e.frame); if (e.to != null) e.to = toReal(e.to); });
  return list.sort((a, b) => a.frame - b.frame);
}

// ============================================================
// PLAYER / EXPORT
//   ?export                  → todos os frames em out/frames
//   ?export&step=30&scale=.33 → preview barato (storyboard) em out/preview
//   ?f=120                   → abre parado no frame 120
// ============================================================
const cv = document.getElementById('c'), cx = cv.getContext('2d');
let SCALE = 1;
function renderFrame(f) {
  cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height);
  cx.scale(SCALE, SCALE); BS = SCALE; render(cx, toDesign(f)); BS = 1;
}
window.renderFrame = renderFrame;

async function save(path, body) {
  const r = await fetch('/save/' + path, { method: 'POST', body });
  if (!r.ok) throw new Error('save failed ' + path);
}
// STORYBOARD numa imagem só: BOARD = [[frame, 'título', 'nota'], ...] em scenes.js → out/board.png
// renderiza o frame só depois de todo footage pedido estar carregado (determinístico no export)
async function renderReady(f) {
  for (let k = 0; k < 20; k++) {
    FOOT_MISS = false; FOOT_NOW = f; renderFrame(f);
    if (!FOOT_MISS) break;
    await Promise.all([...FOOT_PENDING.values()]);
  }
  footEvict(f);
}
async function exportBoard() {
  const list = typeof BOARD !== 'undefined' ? BOARD : SC.map((s, i) => [Math.min(N - 1, (s.a + (SC[i + 1] ? SC[i + 1].a : N)) >> 1), 'Cena ' + (i + 1), '']);
  const cols = 4, tw = 640, th = Math.round(tw * H / W), pad = 24, cap = 96, rows = Math.ceil(list.length / cols);
  const bd = mk(cols * (tw + pad) + pad, rows * (th + cap + pad) + pad + 90), b = bd.getContext('2d');
  b.fillStyle = '#161616'; b.fillRect(0, 0, bd.width, bd.height);
  b.fillStyle = '#fff'; b.font = font(400, 46); b.fillText((P.name || '').toUpperCase() + ' — STORYBOARD', pad, 62);
  SCALE = tw / W; cv.width = tw; cv.height = th;
  for (const [i, [f, t, n]] of list.entries()) {
    await renderReady(f);
    const x = pad + (i % cols) * (tw + pad), y = 90 + pad + Math.floor(i / cols) * (th + cap + pad);
    b.drawImage(cv, x, y);
    b.fillStyle = O; b.font = font(400, 30); b.fillText(`${i + 1}  ·  ${t}`, x, y + th + 36);
    b.fillStyle = '#bbb'; b.font = '400 20px Helvetica';
    b.fillText(`${(f / FPS).toFixed(1)}s (f${f})  ${n || ''}`.slice(0, 70), x, y + th + 68);
  }
  const u = bd.toDataURL('image/png');
  await save(P.dir + '/out/board.png', Uint8Array.from(atob(u.split(',')[1]), c => c.charCodeAt(0)));
}
async function exportFrames({ from = 0, to = N - 1, step = 1, dir = 'frames' } = {}) {
  const base = P.dir + '/out/' + dir + '/';
  for (let f = from; f <= to; f += step) {
    await renderReady(f);
    const u = cv.toDataURL('image/png');
    const bin = Uint8Array.from(atob(u.split(',')[1]), c => c.charCodeAt(0));
    await save(base + String(f).padStart(4, '0') + '.png', bin);
    if (f % 60 === 0) console.log('frame ' + f + '/' + (N - 1));
  }
  await save(P.dir + '/out/sfx.json', JSON.stringify(collectSfx(), null, 1));
}

window.addEventListener('motion:ready', async () => {
  try {
    await document.fonts.ready;
    await Promise.all((S.fonts.preload || []).map(s => document.fonts.load(s, 'Áç✓')));
    // trava de segurança: se uma fonte do estilo cair no fallback, o render FALHA (nunca sai com fonte errada)
    { const c = mk(10, 10).getContext('2d'), probe = 'Hamburgefonstiv ÁÇ 0123';
      const wd = f => { c.font = f; return c.measureText(probe).width; };
      for (const s of (S.fonts.preload || [])) {
        const fam = s.match(/"([^"]+)"/)[1], spec = s.replace(/"[^"]+"/, '');
        if (Math.abs(wd(s) - wd(spec + '"__nofont__"')) < .5)   // igual à fonte padrão do navegador (serifada) = não carregou
          throw new Error('FONTE NÃO CARREGOU: ' + fam);
      } }
    makeGrain();
    await loadAssets();
    if (P.init) P.init();
    const q = new URLSearchParams(location.search);
    SCALE = +(q.get('scale') || 1);
    cv.width = Math.round(W * SCALE); cv.height = Math.round(H * SCALE);
    window.READY = true;
    if (q.has('board')) { await exportBoard(); window.EXPORT_DONE = true; console.log('EXPORT_DONE'); return; }
    if (q.has('export')) {
      const step = +(q.get('step') || 1);
      await exportFrames({ from: +(q.get('from') || 0), to: +(q.get('to') || N - 1), step, dir: step > 1 ? 'preview' : 'frames' });
      window.EXPORT_DONE = true; console.log('EXPORT_DONE');
      return;
    }
    const seek = document.getElementById('seek'), lbl = document.getElementById('lbl'), btn = document.getElementById('play');
    seek.max = N - 1;
    let f = +(q.get('f') || 0), playing = !q.has('f'), last = performance.now();
    btn.textContent = playing ? 'pause' : 'play';
    btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'pause' : 'play'; last = performance.now(); };
    seek.oninput = () => { f = +seek.value; renderFrame(f); lbl.textContent = f; };
    renderFrame(f);
    const tick = now => {
      if (playing) {
        f = (f + Math.max(1, Math.round((now - last) / (1000 / FPS)))) % N; last = now;
        renderFrame(f); seek.value = f; lbl.textContent = f;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } catch (e) {
    window.EXPORT_ERR = String(e.stack || e); console.error('EXPORT_ERR ' + e.stack);
  }
});
