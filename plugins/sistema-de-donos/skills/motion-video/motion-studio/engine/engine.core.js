// ============================================================
// motion-studio · ENGINE (genérico — não editar por projeto)
// Ordem de carga: project.js → style.js → engine.js → scenes.js
// Tudo é função pura do frame. API documentada em SKILL.md.
// ============================================================
const P = window.PROJECT, S = window.STYLE;
const W = P.w || S.w || 1920, H = P.h || S.h || 1080, FPS = P.fps || S.fps || 60, N = P.frames;
const K = S.colors.dark, WH = S.colors.light, O = S.colors.accent, B = S.colors.contrast, CARD = S.colors.card;
const DISPLAY = S.fonts.display, MONO = S.fonts.mono;
const TAU = Math.PI * 2;
let BS = 1;          // escala do blur (miniaturas / preview em escala reduzida)
let THUMB = false;   // true enquanto renderiza miniaturas (evita recursão)

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  inC: t => t * t * t,
  outC: t => 1 - Math.pow(1 - t, 3),
  inOutC: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQ: t => (t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
};
const cb = (x1, y1, x2, y2) => t => cubicY(t, x1, y1, x2, y2);
E.out5 = t => 1 - Math.pow(1 - t, 5);
E.smooth = cb(.45, 0, .12, 1);   // arranque suave, chegada longa
E.push = cb(.72, 0, .1, 1);      // acelera forte, desacelera devagar (whip)
E.cam = cb(.33, 0, .67, 1);      // deriva de câmera quase constante
const prog = (f, a, b, e = E.inOutC) => e(clamp((f - a) / (b - a)));
// câmera contínua: zoom lento em torno do centro → nunca há quadro parado
function cam(ctx, f, a, b, s0, s1) {
  const s = lerp(s0, s1, E.cam(clamp((f - a) / (b - a))));
  ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
}
function spring(f, start, { k = 170, c = 20, m = 1 } = {}) {
  const t = (f - start) / FPS;
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}
const blur = px => (px > 0.05 ? `blur(${(px * BS).toFixed(2)}px)` : 'none');
const font = (w, s, fam = DISPLAY) => `${w} ${s}px "${fam}"`;
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); }

// bezier p/ curva de easing
const bz = (t, a, b) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3;
function cubicY(x, x1, y1, x2, y2) {
  let t = x;
  for (let i = 0; i < 10; i++) {
    const d = 3 * (1 - t) ** 2 * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
    if (Math.abs(d) < 1e-6) break;
    t = clamp(t - (bz(t, x1, x2) - x) / d);
  }
  return bz(t, y1, y2);
}

// ---------- camadas (alpha / blur de grupo) ----------
const pool = {}; let depth = 0;
function layer(ctx, alpha, bl, draw) {
  if (alpha <= 0.002) return;
  if (alpha >= 0.999 && bl < 0.3) { draw(ctx); return; }
  const w = ctx.canvas.width, h = ctx.canvas.height, key = `${w}x${h}_${depth}`;
  const c = pool[key] || (pool[key] = mk(w, h));
  const l = c.getContext('2d');
  l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, w, h);
  l.setTransform(ctx.getTransform()); l.globalAlpha = 1; l.filter = 'none';
  depth++; draw(l); depth--;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha *= alpha; ctx.filter = blur(bl); ctx.drawImage(c, 0, 0);
  ctx.restore();
}

// ---------- fundo ----------
function blob(ctx, x, y, rx, ry, rgb, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(.45, `rgba(${rgb},${a * .5})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
}
// fundo do estilo: blobs periódicos em N frames → loop perfeito
function bg(ctx, f, dark) {
  const p = (f / N) * TAU, cfg = dark ? S.bg.dark : S.bg.light;
  ctx.fillStyle = dark ? K : WH; ctx.fillRect(0, 0, W, H);
  for (const b of cfg.blobs)
    blob(ctx, b.x + Math.sin(p * b.fx + (b.px || 0)) * b.ax, b.y + Math.sin(p * b.fy + (b.py || 0)) * b.ay, b.rx, b.ry, b.rgb, b.a);
  const gr = S.bg.grid;   // papel quadriculado opcional (style.bg.grid = {light, dark, step}), desliza devagar e fecha o loop
  if (gr && (dark ? gr.dark : gr.light)) {
    const st = gr.step || 54, off = (f / N) * st;
    ctx.save(); ctx.strokeStyle = dark ? gr.dark : gr.light; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let x = -st + off % st; x < W + st; x += st) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = -st + off % st; y < H + st; y += st) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke(); ctx.restore();
  }
}

// ---------- tipografia ----------
// parts: [[texto, cor?], ...] — anima palavra por palavra (blur-in + sobe)
function words(ctx, f, parts, o = {}) {
  const { x = 960, y = 540, size = 80, weight = 600, start = 0, stagger = 4, dur = 34,
    align = 'center', color = WH, exit = 0, am = 1, ls = -1.5, drift = 0, fam = DISPLAY } = o;
  ctx.save();
  ctx.font = font(weight, size, fam); ctx.letterSpacing = `${ls}px`; ctx.textBaseline = 'middle';
  const ws = [];
  parts.forEach(([t, c]) => t.split(' ').filter(Boolean).forEach(w => ws.push([w, c || color])));
  const sp = ctx.measureText(' ').width;
  const widths = ws.map(w => ctx.measureText(w[0]).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = align === 'center' ? x - total / 2 : x;
  ws.forEach(([w, c], i) => {
    const p = E.out5(clamp((f - start - i * stagger) / dur));
    const a = p * (1 - exit) * am;
    if (a > 0.003) {
      ctx.globalAlpha = a;
      ctx.filter = blur((1 - p) * 18 + exit * 26);
      ctx.fillStyle = c;
      ctx.fillText(w, cx + (i - (ws.length - 1) / 2) * drift, y + (1 - p) * 26 - exit * 14);
    }
    cx += widths[i] + sp;
  });
  ctx.restore();
  return total;
}
// motion blur horizontal (várias cópias deslocadas)
function smear(ctx, amt, draw) {
  const n = Math.abs(amt) < 1.5 ? 1 : Math.min(48, Math.ceil(Math.abs(amt) / 4) + 2);
  const a = n > 1 ? 1 - Math.pow(.06, 1 / n) : 1;
  for (let i = 0; i < n; i++) {
    ctx.save();
    if (n > 1) { ctx.translate((i / (n - 1) - .5) * amt, 0); ctx.filter = blur(2.5); }
    draw(a);
    ctx.restore();
  }
}
// logo: ponto na cor de acento + texto da marca (PROJECT.brand)
function logo(ctx, f, { x = 960, y = 540, start = 0, exit = 0, am = 1, offset = 0, text = P.brand || '' } = {}) {
  ctx.save();
  ctx.font = font(600, 64); ctx.letterSpacing = `${-1.5 + E.smooth(clamp((f - start) / 110)) * 5}px`; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width, gw = 52 + 22 + tw, x0 = x - gw / 2 + offset;
  const ps = spring(f, start, { k: 180, c: 13 });
  const pt = E.out5(clamp((f - start - 8) / 44));
  const a = (1 - exit) * am;
  ctx.globalAlpha = a; ctx.filter = blur(exit * 22);
  ctx.fillStyle = O; circle(ctx, x0 + 26, y, 26 * ps); ctx.fill();
  ctx.globalAlpha = a * pt; ctx.filter = blur((1 - pt) * 22 + exit * 22);
  ctx.fillStyle = WH; ctx.fillText(text, x0 + 74 + (1 - pt) * 34, y + 2);
  ctx.restore();
}
// sublinhado "caneta" azul
function penLine(ctx, x, y, w, p, seed = 1, lw = 7) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = B; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  const n = 48, m = Math.max(1, Math.floor(n * p));
  for (let i = 0; i <= m; i++) {
    const t = i / n, px = x + t * w;
    const py = y + Math.sin(t * 7 + seed) * 3 + Math.sin(t * 19 + seed * 2) * 1.4 + t * 5;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.stroke(); ctx.restore();
}

// ---------- perspectiva 3D (rotateY por fatias) ----------
function persp(ctx, src, cx, cy, { ry = 0, rz = 0, s = 1, light = false, shadow = true } = {}) {
  // com alpha < 1 as fatias sobrepostas criam listras → desenha opaco numa camada e aplica o alpha no grupo
  if (ctx.globalAlpha < .999) {
    const ga = ctx.globalAlpha; ctx.globalAlpha = 1;
    layer(ctx, ga, 0, L => persp(L, src, cx, cy, { ry, rz, s, light, shadow }));
    ctx.globalAlpha = ga; return;
  }
  const w = src.width, h = src.height, F = 2200, sw = 3, sn = Math.sin(ry), cs = Math.cos(ry);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rz); ctx.scale(s, s);
  if (shadow) {
    ctx.save(); ctx.filter = blur(48);
    ctx.fillStyle = light ? 'rgba(10,10,10,.16)' : 'rgba(0,0,0,.62)';
    rr(ctx, (-w / 2) * cs * .94, -h / 2 + 56, w * cs * .94, h * .96, 40); ctx.fill();
    ctx.restore();
  }
  ctx.filter = 'none';
  for (let x = 0; x < w; x += sw) {
    const a = x - w / 2, b = Math.min(x + sw, w) - w / 2;
    const pa = F / (F + a * sn), pb = F / (F + b * sn);
    const xa = a * cs * pa, xb = b * cs * pb, dh = h * (pa + pb) / 2;
    ctx.drawImage(src, x, 0, Math.min(sw, w - x), h, xa, -dh / 2, xb - xa + .7, dh);
  }
  ctx.restore();
}


// ============================================================
// ASSETS (fotos, PNGs recortados, footage) — pré-carregados antes do render
// project.js:  assets: ['tenis.png', ...]  → projects/<p>/assets/<arquivo>
//              footage: { jogo: 90, ... }  → projects/<p>/assets/jogo/0001.jpg.. (gerado por tools/footage.sh)
const ASSETS = {};
function loadAssets() {
  const base = '../' + P.dir + '/assets/', jobs = [];
  const one = (key, src) => jobs.push(new Promise(r => { const i = new Image(); i.onload = () => { ASSETS[key] = i; r(); }; i.onerror = () => { console.error('asset faltando: ' + src); r(); }; i.src = src; }));
  (P.assets || []).forEach(a => one(a, base + a));
  // footage NÃO é pré-carregado (1000+ quadros full HD estouram a memória): FOOT carrega sob demanda
  return Promise.all(jobs);
}
const IMG = k => ASSETS[k];
// quadro do footage no frame local lf (loop se passar do fim; speed 1 = tempo real)
// footage sob demanda: FOOT pede o quadro; se ainda não chegou, marca FOOT_MISS e devolve o último quadro carregado
// do mesmo clipe. renderReady(f) (runtime) espera os pedidos e re-renderiza; quadros não usados há 45f são liberados.
const FOOT_PENDING = new Map(), FOOT_USED = new Map(), FOOT_LAST = {};
let FOOT_MISS = false, FOOT_NOW = 0;
function FOOT(name, lf, speed = 1) {
  const c = (P.footage || {})[name] || 1, ff = P.footageFps || 30;
  const i = Math.floor(Math.max(0, lf) * speed * ff / FPS) % c, key = name + '#' + (i + 1);
  FOOT_USED.set(key, FOOT_NOW);
  if (ASSETS[key]) return (FOOT_LAST[name] = ASSETS[key]);
  FOOT_MISS = true;
  if (!FOOT_PENDING.has(key)) FOOT_PENDING.set(key, new Promise(r => {
    const im = new Image();
    im.onload = () => im.decode().catch(() => {}).then(() => { ASSETS[key] = im; FOOT_PENDING.delete(key); r(); });
    im.onerror = () => { console.error('footage faltando: ' + key); ASSETS[key] = FOOT_LAST[name] || null; FOOT_PENDING.delete(key); r(); };
    im.src = '../' + P.dir + '/assets/' + name + '/' + String(i + 1).padStart(4, '0') + '.' + ((P.footageExt || {})[name] || 'jpg');
  }));
  return FOOT_LAST[name];
}
function footEvict(f) {
  for (const [k, u] of FOOT_USED) if (Math.abs(f - u) > 45) { const im = ASSETS[k]; if (im && /\/assets\/[^/]+\/\d+\.(jpg|png|webp)$/.test(im.src)) { im.onload = im.onerror = null; im.src = ''; } delete ASSETS[k]; FOOT_USED.delete(k); }
}
// desenha imagem em "cover" num retângulo (zoom s em torno do centro, ox/oy = foco 0..1)
function cover(ctx, img, x, y, w, h, { s = 1, ox = .5, oy = .5 } = {}) {
  if (!img) return;
  const k = Math.max(w / img.width, h / img.height) * s, iw = img.width * k, ih = img.height * k;
  ctx.drawImage(img, x + (w - iw) * ox, y + (h - ih) * oy, iw, ih);
}
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// footage em tela cheia: zoom contínuo, P&B opcional, borda com blur radial (look "lente")
function footage(ctx, f, img, { s0 = 1.04, s1 = 1.14, a = 0, b = N, bw = false, contrast = 1.15, edgeBlur = 14, dim = 0 } = {}) {
  const s = lerp(s0, s1, prog(f, a, b, E.lin));
  const flt = (bw ? 'grayscale(1) ' : '') + `contrast(${contrast})`;
  if (edgeBlur <= 0) { ctx.save(); ctx.filter = flt; cover(ctx, img, 0, 0, W, H, { s }); ctx.restore(); }
  else {
    ctx.save(); ctx.filter = flt + ' ' + blur(edgeBlur); cover(ctx, img, 0, 0, W, H, { s: s * 1.03 }); ctx.restore();
    layer(ctx, .998, 0, L => {                           // (.998 força camada própria) centro nítido, sumindo para as bordas
      L.save(); L.filter = flt; cover(L, img, 0, 0, W, H, { s }); L.restore();
      L.globalCompositeOperation = 'destination-in';
      const g = L.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .7);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      L.fillStyle = g; L.fillRect(0, 0, W, H);
    });
  }
  if (dim > 0) { ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fillRect(0, 0, W, H); }
}
// vinheta de borda (no estilo kreo: cinza sobre o branco)
function vignette(ctx, amt = .5, rgb = '0,0,0', inner = .42) {
  if (amt <= 0) return;
  const cw = ctx.canvas.width, ch = ctx.canvas.height;
  const g = ctx.createRadialGradient(cw / 2, ch / 2, ch * inner, cw / 2, ch / 2, Math.hypot(cw, ch) / 2);
  g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${amt})`);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
}

// texto condensado EMPILHADO, palavra a palavra com glitch (pop de escala + jitter + blur)
// lines: [[texto, frameInicio?, cor?], ...] — sem frame, segue o stagger da linha anterior
function stackText(ctx, f, lines, o = {}) {
  const { x = 120, y = 200, size = 96, lh = .98, color = O, start = 0, stagger = 5, gap = 6, align = 'left',
    fam = DISPLAY, weight = 400, exit = 0, drift = 0, glitch = 1, ls = 0 } = o;
  ctx.save(); ctx.font = font(weight, size, fam); ctx.textBaseline = 'top'; ctx.letterSpacing = `${ls}px`;
  let t0 = start, k = 0;
  lines.forEach((ln, li) => {
    const [txt, st, col] = ln; if (st != null) t0 = st;
    const ws = txt.split(' ').filter(Boolean), sp = ctx.measureText(' ').width;
    const wd = ws.map(w => ctx.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
    const ly = y + li * size * lh - drift * prog(f, start, start + 600, E.lin);
    ws.forEach((w, i) => {
      const ws0 = t0 + i * stagger, p = clamp((f - ws0) / 16);
      if (p > 0) {
        const e = E.out5(p), ph = spring(f, ws0, { k: 260, c: 18 });
        const jit = glitch * (1 - clamp((f - ws0) / 7)), sd = ++k * 7.3 + Math.floor(f / 2);
        const a = clamp(p * 3) * (1 - exit);
        ctx.save();
        ctx.translate(cx + wd[i] / 2 + (hash(sd) - .5) * 40 * jit, ly + size / 2 + (hash(sd + 1) - .5) * 24 * jit);
        const sc = lerp(1.6, 1, ph) * (1 + exit * .3);
        ctx.scale(sc, sc * lerp(1, 1.0, ph)); ctx.rotate((hash(sd + 2) - .5) * .25 * jit);
        ctx.globalAlpha = a; ctx.filter = blur((1 - e) * 14 + exit * 24);
        ctx.fillStyle = col || color; ctx.fillText(w, -wd[i] / 2, -size / 2);
        if (jit > .2) { ctx.globalAlpha = a * .5; ctx.fillText(w, -wd[i] / 2 + 14 * jit, -size / 2 - 6 * jit); }
        ctx.restore();
      }
      cx += wd[i] + sp;
    });
    t0 += ws.length * stagger + gap;
  });
  ctx.restore();
}
// legenda pequena (Helvetica) — palavra por palavra, sem glitch
function caption(ctx, f, text, { x = 960, y = 540, size = 30, color = '#111', start = 0, stagger = 3, exit = 0, weight = 400, fam = S.fonts.caption || 'Helvetica', shadow = false } = {}) {
  ctx.save(); if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 12; }
  words(ctx, f, [[text, color]], { x, y, size, weight, start, stagger, dur: 14, exit, ls: 0, fam });
  ctx.restore();
}
// PNG recortado / logo flutuando: pop com mola + rotação, órbita contínua, sombra suave
function cutout(ctx, f, img, { x = 960, y = 540, w = 300, start = 0, exit = 0, rot = 0, orbit = 14, seed = 1, shadow = .25, k = 170, c = 15, from = null } = {}) {
  if (!img) return;
  const p = spring(f, start, { k, c }); if (p <= 0.001) return;
  const h = w * img.height / img.width, t = (f - start) / FPS;
  let px = x + Math.sin(t * 1.3 + seed) * orbit, py = y + Math.cos(t * 1.1 + seed * 2) * orbit;
  if (from) { px = lerp(from[0], px, E.out5(clamp((f - start) / 24))); py = lerp(from[1], py, E.out5(clamp((f - start) / 24))); }
  const s = p * (1 + (f - start) * .0007) * (1 + exit * .6);
  ctx.save(); ctx.translate(px, py); ctx.rotate(rot + (1 - p) * .5 + Math.sin(t * .9 + seed) * .03); ctx.scale(s, s);
  ctx.globalAlpha = clamp(p * 2) * (1 - exit); ctx.filter = blur(exit * 30);
  if (shadow) { ctx.shadowColor = `rgba(0,0,0,${shadow})`; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; }
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}
// card de foto (retângulo com raio, cor de fundo opcional) — base dos cards vermelhos e da colagem
function photoCard(ctx, img, cx, cy, w, h, { r = 18, fill = null, rot = 0, s = 1, shadow = .3, inset = 0, foc = [.5, .5], zoom = 1 } = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
  if (shadow) { ctx.save(); ctx.shadowColor = `rgba(0,0,0,${shadow})`; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; ctx.fillStyle = fill || '#000'; rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fill(); ctx.restore(); }
  rr(ctx, -w / 2, -h / 2, w, h, r); ctx.clip();
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(-w / 2, -h / 2, w, h); }
  cover(ctx, img, -w / 2 + inset, -h / 2 + inset, w - inset * 2, h - inset * 2, { s: zoom, ox: foc[0], oy: foc[1] });
  ctx.restore();
}


// ============================================================
// OBJETOS REAIS (ref dnyx): objeto fotográfico, ancorado e cortado pela borda; o conteúdo troca por corte seco.
// ============================================================
// deslocamento de entrada por uma borda: from 'bottom' | 'top' | 'left' | 'right'
function edgeIn(f, start, from = 'bottom', dist = 1100, k = 80, c = 14) {
  const r = spring(f, start, { k, c }), d = (1 - r) * dist;
  return { r, dx: from === 'left' ? -d : from === 'right' ? d : 0, dy: from === 'top' ? -d : from === 'bottom' ? d : 0 };
}
// iPhone realista. screen(g, w, h, f) desenha a tela (troque o conteúdo por frame = corte seco).
// x,y = centro do aparelho · w = largura · exit 0..1 continua o movimento para exitDir com blur
const PHONE_CV = {};
function phone(ctx, f, { x = W / 2, y = H * .62, w = 680, start = 0, from = 'bottom', dist = 1300, rot = 0, s = 1,
  screen = null, exit = 0, exitDir = 'top', frame = '#2b2c30', shadow = .55, light = true } = {}) {
  const h = w * 2.06, R = w * .165, bz = w * .03, sw = w - bz * 2, sh = h - bz * 2, sr = R - bz;
  const { r, dx, dy } = edgeIn(f, start, from, dist);
  if (r <= 0.001 && f < start) return;
  const drift = prog(f, start, start + 900, E.lin);
  const ex = E.inC(exit), exd = ex * H * .9;
  const ox = dx + (exitDir === 'left' ? -exd : exitDir === 'right' ? exd : 0);
  const oy = dy - drift * 26 + (exitDir === 'top' ? -exd : exitDir === 'bottom' ? exd : 0);
  const key = Math.round(sw) + 'x' + Math.round(sh);
  const cv = PHONE_CV[key] || (PHONE_CV[key] = mk(Math.round(sw), Math.round(sh)));
  const g = cv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#000'; g.fillRect(0, 0, cv.width, cv.height);
  if (screen) { g.save(); screen(g, cv.width, cv.height, f); g.restore(); }
  ctx.save();
  ctx.translate(x + ox, y + oy); ctx.rotate(rot + Math.sin(f / 70) * .006 + (1 - r) * .05); ctx.scale(s * (1 + drift * .03), s * (1 + drift * .03));
  ctx.filter = blur(ex * 26);
  if (shadow > 0) {   // sombra longa e macia
    ctx.save(); ctx.filter = blur(60 + ex * 20); ctx.fillStyle = `rgba(0,0,0,${shadow * (light ? .45 : 1)})`;
    rr(ctx, -w / 2 + 30, -h / 2 + 70, w - 20, h, R); ctx.fill(); ctx.restore(); ctx.filter = blur(ex * 26);
  }
  // botões laterais
  ctx.fillStyle = frame;
  rr(ctx, -w / 2 - w * .012, -h * .28, w * .02, h * .07, 4); ctx.fill();
  rr(ctx, -w / 2 - w * .012, -h * .19, w * .02, h * .07, 4); ctx.fill();
  rr(ctx, w / 2 - w * .008, -h * .23, w * .02, h * .11, 4); ctx.fill();
  // moldura de titânio (gradiente metálico)
  const mg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  mg.addColorStop(0, '#6d6e73'); mg.addColorStop(.06, frame); mg.addColorStop(.5, '#3a3b40'); mg.addColorStop(.94, frame); mg.addColorStop(1, '#8a8b90');
  rr(ctx, -w / 2, -h / 2, w, h, R); ctx.fillStyle = mg; ctx.fill();
  rr(ctx, -w / 2 + bz * .35, -h / 2 + bz * .35, w - bz * .7, h - bz * .7, R - bz * .35); ctx.fillStyle = '#050505'; ctx.fill();
  // tela
  ctx.save(); rr(ctx, -sw / 2, -sh / 2, sw, sh, sr); ctx.clip();
  ctx.drawImage(cv, -sw / 2, -sh / 2, sw, sh);
  const gl = ctx.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2);   // reflexo do vidro
  gl.addColorStop(0, 'rgba(255,255,255,.10)'); gl.addColorStop(.38, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(255,255,255,.03)');
  ctx.fillStyle = gl; ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
  ctx.restore();
  // Dynamic Island
  ctx.fillStyle = '#000'; rr(ctx, -w * .15, -sh / 2 + w * .035, w * .3, w * .085, w * .045); ctx.fill();
  ctx.restore();
}
// barra de status do iOS dentro de screen()
function statusBar(g, w, { color = '#000', time = '9:41' } = {}) {
  const u = w / 390;
  g.save(); g.fillStyle = color; g.font = font(600, 17 * u, 'Inter Tight'); g.textBaseline = 'middle';
  g.fillText(time, 34 * u, 30 * u);
  rr(g, w - 64 * u, 23 * u, 26 * u, 13 * u, 4 * u); g.strokeStyle = color; g.lineWidth = 1.4 * u; g.stroke();
  rr(g, w - 62 * u, 25 * u, 19 * u, 9 * u, 2 * u); g.fill();
  for (let i = 0; i < 4; i++) { rr(g, w - 104 * u + i * 6 * u, (34 - 3 * i) * u, 4 * u, (3 + 3 * i) * u, 1 * u); g.fill(); }
  g.restore();
}
// produto real (PNG recortado): entra por uma borda, gira devagar, sombra de contato e reflexo opcional no chão
function product(ctx, f, img, { x = W / 2, y = H / 2, w = 800, start = 0, from = 'bottom', dist = 1200, rot = 0, spin = .05,
  s = 1, exit = 0, exitDir = 'top', contact = .35, reflect = 0, k = 80, c = 14 } = {}) {
  if (!img) return;
  const { r, dx, dy } = edgeIn(f, start, from, dist, k, c);
  if (r <= 0.001 && f < start) return;
  const drift = prog(f, start, start + 900, E.lin), ex = E.inC(exit), exd = ex * H * .9;
  const h = w * img.height / img.width;
  ctx.save();
  ctx.translate(x + dx + (exitDir === 'left' ? -exd : exitDir === 'right' ? exd : 0), y + dy - drift * 18 + (exitDir === 'top' ? -exd : exitDir === 'bottom' ? exd : 0));
  const sc = s * (1 + drift * .05) * (.9 + .1 * r);
  if (contact > 0) {   // sombra de contato (elipse)
    ctx.save(); ctx.filter = blur(28 + ex * 20); ctx.globalAlpha = contact * r * (1 - ex);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, h * .62 * sc, w * .38 * sc, h * .07 * sc, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.rotate(rot + (1 - r) * .12 + Math.sin(f / 80) * spin * .3 - drift * spin);
  ctx.scale(sc, sc); ctx.filter = blur(ex * 26);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  if (reflect > 0) {
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); ctx.globalAlpha = reflect;
    ctx.drawImage(img, -w / 2, -h / 2 - h * .02, w, h); ctx.restore();
  }
  ctx.restore();
}
// peças → fileira → para dentro do objeto. items: [{draw(ctx), sc:[x,y,rot], row:[x,y], to:[x,y,s]?}]
// t: {in, row, go} frames (início de cada fase). Entrada com mola macia, flutuação contínua.
function assemble(ctx, f, items, { t = { in: 0, row: 70, go: 150 }, stagger = 4, rowDur = 50, goDur = 30, size = 1 } = {}) {
  items.forEach((it, i) => {
    const r = spring(f, t.in + i * stagger, { k: 80, c: 14 });
    if (r <= .001) return;
    const pr = prog(f, t.row + i * 2, t.row + i * 2 + rowDur, E.smooth);
    const pg = it.to ? prog(f, t.go + i * 2, t.go + i * 2 + goDur, E.inC) : 0;
    const [sx, sy, sr = 0] = it.sc, [rx, ry] = it.row || it.sc;
    const fl = Math.sin(f / 40 + i * 1.7) * (1 - pr) * 14;
    let x = lerp(sx, rx, pr), y = lerp(sy + (1 - r) * 260, ry, pr) + fl, s = size * r * (1 - pg * .0);
    if (it.to) { x = lerp(x, it.to[0], pg); y = lerp(y, it.to[1], pg); s *= lerp(1, it.to[2] ?? .3, pg); }
    ctx.save(); ctx.globalAlpha = clamp(r * 1.5) * (1 - clamp((pg - .85) / .15)); ctx.filter = blur((1 - r) * 16 + pg * 6);
    ctx.translate(x, y); ctx.rotate(lerp(sr, 0, pr) + Math.sin(f / 55 + i) * .02 * (1 - pr)); ctx.scale(s, s);
    it.draw(ctx, f); ctx.restore();
  });
}
// campo de prompt que digita no meio de uma frase. Retorna a largura (para posicionar as palavras ao redor).
function promptPill(ctx, f, text, { x = W / 2, y = H / 2, w = 380, h = 64, start = 0, cps = .7, dark = false, am = 1 } = {}) {
  const r = spring(f, start, { k: 120, c: 15 });
  const n = Math.floor(clamp((f - start - 10) * cps, 0, text.length));
  ctx.save(); ctx.globalAlpha = am * clamp(r * 1.4); ctx.translate(x, y); ctx.scale(.85 + .15 * r, .85 + .15 * r);
  rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = dark ? '#1c1c1e' : '#fff'; ctx.fill();
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = font(500, h * .36); ctx.textBaseline = 'middle'; ctx.fillStyle = dark ? '#ddd' : '#333';
  const s = text.slice(0, n); ctx.fillText(s, -w / 2 + h * .45, 1);
  if ((f >> 4) % 2 === 0) { const cw = ctx.measureText(s).width; ctx.fillRect(-w / 2 + h * .45 + cw + 3, -h * .2, 3, h * .4); }
  rr(ctx, w / 2 - h * .82, -h * .32, h * .64, h * .64, h * .32); ctx.fillStyle = O; ctx.fill();
  ctx.strokeStyle = K; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2 - h * .5, h * .1); ctx.lineTo(w / 2 - h * .5, -h * .12);
  ctx.moveTo(w / 2 - h * .59, -h * .03); ctx.lineTo(w / 2 - h * .5, -h * .13); ctx.lineTo(w / 2 - h * .41, -h * .03); ctx.stroke();
  ctx.restore();
  return w;
}
// palavra gigante (Anton) cortada pela borda, sobe com mola — "RONY" da IDV
function bigWord(ctx, f, text, { x = W / 2, y = H, size = 460, color = K, start = 0, exit = 0, ls = -4, fam = S.fonts.impact || DISPLAY } = {}) {
  const r = spring(f, start, { k: 70, c: 14 });
  ctx.save(); ctx.font = font(400, size, fam); ctx.letterSpacing = `${ls}px`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = clamp(r * 2) * (1 - exit); ctx.filter = blur((1 - r) * 20 + exit * 24);
  ctx.fillStyle = color; ctx.fillText(text, x, y + (1 - r) * size * .8 - prog(f, start, start + 900, E.lin) * 20 - E.inC(exit) * 200);
  ctx.restore();
}

// ---------- LIQUID GLASS (genérico) ----------
// Desenha um painel de vidro em (cx,cy) w×h raio r no espaço ATUAL do ctx: amostra o que já está
// pintado atrás, desfoca e amplia (refração), borda mais ampliada (lente), tinta, aro especular e sombra.
// o: { blur=22, mag=1.08, edge=.10, tint='rgba(255,255,255,.22)', rim=1, shadow=.18, dark=false, alpha=1 }
const _gl = {};
function glass(ctx, cx, cy, w, h, r, o = {}) {
  const { blur: bl = 22, mag = 1.08, edge = .10, tint = 'rgba(255,255,255,.22)', rim = 1, shadow = .18, alpha = 1 } = o;
  if (alpha <= .002 || w < 2 || h < 2) return;
  r = Math.min(r, w / 2, h / 2);
  const cv = ctx.canvas, key = cv.width + 'x' + cv.height;
  const src = _gl[key] || (_gl[key] = mk(cv.width, cv.height));
  const s = src.getContext('2d'); s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, cv.width, cv.height); s.drawImage(cv, 0, 0);
  const m = ctx.getTransform(), dc = m.transformPoint(new DOMPoint(cx, cy));
  const ds = Math.hypot(m.a, m.b);
  const zoomAt = (z, bb) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = blur(bb / BS * ds);
    ctx.translate(dc.x, dc.y); ctx.scale(z, z); ctx.translate(-dc.x, -dc.y); ctx.drawImage(src, 0, 0); ctx.restore(); };
  ctx.save(); ctx.globalAlpha *= alpha;
  // sombra macia
  if (shadow > 0) { ctx.save(); ctx.shadowColor = `rgba(20,15,10,${shadow})`; ctx.shadowBlur = 60 * ds; ctx.shadowOffsetY = 26 * ds;
    rr(ctx, cx - w / 2, cy - h / 2, w, h, r); ctx.fillStyle = 'rgba(0,0,0,.01)'; ctx.fill(); ctx.restore(); }
  // corpo: lente (borda) + miolo desfocado
  ctx.save(); rr(ctx, cx - w / 2, cy - h / 2, w, h, r); ctx.clip();
  zoomAt(1 / (1 - edge), bl * .6);
  const ib = Math.min(w, h) * .14;
  ctx.save(); rr(ctx, cx - w / 2 + ib, cy - h / 2 + ib, w - ib * 2, h - ib * 2, Math.max(2, r - ib)); ctx.clip(); ctx.filter = blur(ib * .5); zoomAt(mag, bl); ctx.restore();
  ctx.fillStyle = tint; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const g = ctx.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
  g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.10)');
  ctx.fillStyle = g; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  // aro especular (claro em cima-esquerda, sutil embaixo-direita)
  if (rim > 0) { const lw = Math.max(1.5, Math.min(w, h) * .018);
    const rg = ctx.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
    rg.addColorStop(0, `rgba(255,255,255,${.95 * rim})`); rg.addColorStop(.35, `rgba(255,255,255,${.15 * rim})`);
    rg.addColorStop(.7, `rgba(255,255,255,${.08 * rim})`); rg.addColorStop(1, `rgba(255,255,255,${.6 * rim})`);
    rr(ctx, cx - w / 2 + lw / 2, cy - h / 2 + lw / 2, w - lw, h - lw, Math.max(1, r - lw / 2)); ctx.strokeStyle = rg; ctx.lineWidth = lw; ctx.stroke(); }
  ctx.restore();
}
// mola com velocidade → squash & stretch: devolve [sx, sy] a partir da derivada de uma curva v(f)
function squash(vf, f, amt = .004, max = .22) { const d = clamp((vf(f + 1) - vf(f - 1)) * .5 * amt, -max, max); return [1 + Math.abs(d), 1 - Math.abs(d) * .7]; }

// ============================================================
// PAPEL / COLAGEM (ref "Paper VOX") — genérico, qualquer estilo pode usar.
// Stop-motion: STYLE.step (ou PROJECT.step) = fps da ANIMAÇÃO (ex.: 12). O runtime quantiza o frame,
// então spring/prog/FOOT/câmera já saem "em degraus". boil() mantém tudo vivo entre os degraus.
// ============================================================
const STEP = P.step || S.step || 0;
const tick = f => STEP ? Math.floor(f * STEP / FPS + 1e-6) : f;            // nº do desenho
const rng = seed => { let s = (seed * 9973 + 17) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
// tremor de papel/tinta: troca de pose a cada `every` desenhos (12fps/2 = 6 poses por segundo)
function boil(f, seed = 1, amt = 1, every = 2) {
  const k = Math.floor(tick(f) / every) * 1.618 + seed * 31.7;
  return { x: (hash(k) - .5) * 2 * amt, y: (hash(k + 7.3) - .5) * 2 * amt, r: (hash(k + 3.1) - .5) * .014 * amt };
}
// polígono rasgado em volta de um retângulo w×h. amp = altura do rasgo, seg = passo (pequeno = rasgado, grande = tesoura)
function tornPoly(w, h, { amp = 10, seg = 9, seed = 1, edges = 'trbl' } = {}) {
  const r = rng(seed), pts = [], side = (x0, y0, x1, y1, on, nx, ny) => {
    const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / seg));
    let drift = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n; drift = drift * .6 + (r() - .5) * amp * .9;
      const d = on ? drift + (r() - .5) * amp * .5 : 0;
      pts.push([lerp(x0, x1, t) + nx * d, lerp(y0, y1, t) + ny * d]);
    }
  };
  side(0, 0, w, 0, edges.includes('t'), 0, 1); side(w, 0, w, h, edges.includes('r'), -1, 0);
  side(w, h, 0, h, edges.includes('b'), 0, -1); side(0, h, 0, 0, edges.includes('l'), 1, 0);
  return pts;
}
function polyPath(g, pts, ox = 0, oy = 0) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x + ox, y + oy) : g.moveTo(x + ox, y + oy)); g.closePath(); }

// textura de papel (cacheada): manchas, fibras, grão fino, vincos/amassado
const _paper = {};
function paperTex(tone = S.colors.paper || '#ECE7DC', { seed = 1, w = W, h = H, crumple = .5, fiber = 1 } = {}) {
  const key = [tone, seed, w, h, crumple, fiber].join('|'); if (_paper[key]) return _paper[key];
  const c = mk(w, h), g = c.getContext('2d'), r = rng(seed);
  g.fillStyle = tone; g.fillRect(0, 0, w, h);
  g.save(); g.filter = `blur(${Math.round(Math.min(w, h) * .05)}px)`;
  for (let i = 0; i < 36; i++) { g.fillStyle = `rgba(${r() < .55 ? '70,55,35' : '255,255,250'},${.02 + r() * .035})`; g.beginPath(); g.ellipse(r() * w, r() * h, 60 + r() * w * .3, 60 + r() * h * .2, r() * 3, 0, TAU); g.fill(); }
  g.restore();
  for (let i = 0; i < 2600 * fiber * (w * h) / (1080 * 1920); i++) {
    const x = r() * w, y = r() * h, a = r() * TAU, L = 5 + r() * 22;
    g.strokeStyle = `rgba(${r() < .5 ? '90,75,55' : '255,255,255'},${.05 + r() * .09})`; g.lineWidth = .5 + r() * 1.1;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 1) * L * .5, y + Math.sin(a + 1) * L * .5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  if (crumple > 0) for (let i = 0; i < 14; i++) {         // amassado: semiplanos claro/escuro ao longo de vincos
    const x = r() * w, y = r() * h, a = r() * TAU, dx = Math.cos(a), dy = Math.sin(a), D = w + h;
    g.save(); g.beginPath(); g.moveTo(x - dx * D, y - dy * D); g.lineTo(x + dx * D, y + dy * D); g.lineTo(x + dx * D - dy * D, y + dy * D + dx * D); g.lineTo(x - dx * D - dy * D, y - dy * D + dx * D); g.closePath();
    g.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},${(.012 + r() * .03) * crumple})`; g.fill();
    g.strokeStyle = `rgba(255,255,255,${.25 * crumple})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - dx * D, y - dy * D); g.lineTo(x + dx * D, y + dy * D); g.stroke();
    g.strokeStyle = `rgba(60,50,40,${.10 * crumple})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x - dx * D + 1.5, y - dy * D + 1.5); g.lineTo(x + dx * D + 1.5, y + dy * D + 1.5); g.stroke();
    g.restore();
  }
  const id = g.getImageData(0, 0, w, h), d = id.data;           // grão fino
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(id, 0, 0);
  return (_paper[key] = c);
}
// fundo de papel em tela cheia: a folha "respira" em degraus (desloca poucos px a cada 3 desenhos)
function paper(ctx, f, { tone, seed = 1, crumple = S.paperCrumple ?? .5, shift = 5 } = {}) {
  const b = boil(f, seed, shift, 3), t = paperTex(tone, { seed, crumple, w: W + 24, h: H + 24 });
  ctx.drawImage(t, -12 + b.x, -12 + b.y);
}

// RECORTE processado (cacheado, LRU): P&B + contraste, borda branca de adesivo (silhueta) ou papel rasgado (foto retangular)
//   bw, contrast, bright, tint (multiplica cor), border (px de borda na silhueta; cor = paperTone → use amarelo/rosa p/ contorno Vox), torn (amp do rasgo; 0 = sem),
//   seg (passo do rasgo: 8 rasgado · 120 tesoura), edges ('trbl'), crop [x,y,w,h] em 0..1, maxW (resolução), rim (largura da fibra branca)
const _scrap = new Map();
function scrapCanvas(img, o = {}) {
  if (!img || !img.width || !img.height) return null;   // footage ainda não carregado / já liberado
  const { bw = true, contrast = 1.3, bright = 1.03, tint = null, border = 0, torn = 0, seg = 9, edges = 'trbl', crop = null, maxW = 1200, seed = 1, rim = 0, paperTone = '#F4F1EA', key = '' } = o;
  const k = [img.src || img._id || '', key, bw, contrast, bright, tint, border, torn, seg, edges, crop, maxW, seed, rim, paperTone].join('|');
  if (_scrap.has(k)) { const v = _scrap.get(k); _scrap.delete(k); _scrap.set(k, v); return v; }
  const [cx, cy, cw, ch] = crop ? [crop[0] * img.width, crop[1] * img.height, crop[2] * img.width, crop[3] * img.height] : [0, 0, img.width, img.height];
  const sc = Math.min(1, maxW / cw), w = Math.round(cw * sc), h = Math.round(ch * sc), pad = Math.ceil(border + torn + rim + 4);
  const c = mk(w + pad * 2, h + pad * 2), g = c.getContext('2d');
  const base = mk(w, h), bg = base.getContext('2d');
  bg.filter = `${bw ? 'grayscale(1) ' : ''}contrast(${contrast}) brightness(${bright})`;
  bg.drawImage(img, cx, cy, cw, ch, 0, 0, w, h); bg.filter = 'none';
  if (tint) { bg.globalCompositeOperation = 'multiply'; bg.fillStyle = tint; bg.fillRect(0, 0, w, h); bg.globalCompositeOperation = 'destination-in'; bg.drawImage(img, cx, cy, cw, ch, 0, 0, w, h); bg.globalCompositeOperation = 'source-over'; }
  if (torn > 0) {
    const outer = tornPoly(w + rim * 2, h + rim * 2, { amp: torn, seg, seed, edges });
    g.save(); polyPath(g, outer, pad - rim, pad - rim); g.fillStyle = paperTone; g.fill(); g.restore();      // fibra branca do rasgo
    const inner = tornPoly(w, h, { amp: torn * .8, seg: seg * 1.3, seed: seed + 5, edges });
    g.save(); polyPath(g, inner, pad, pad); g.clip(); g.drawImage(base, pad, pad); g.restore();
  } else if (border > 0) {
    const s = mk(c.width, c.height), sg = s.getContext('2d');
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; sg.drawImage(base, pad + Math.cos(a) * border, pad + Math.sin(a) * border); }
    sg.globalCompositeOperation = 'source-in'; sg.fillStyle = paperTone; sg.fillRect(0, 0, s.width, s.height);
    g.drawImage(s, 0, 0); g.drawImage(base, pad, pad);
  } else g.drawImage(base, pad, pad);
  c._pad = pad; _scrap.set(k, c);
  if (_scrap.size > (S.scrapCache || 40)) _scrap.delete(_scrap.keys().next().value);
  return c;
}
// entrada stop-motion de um recorte. inn: 'pop' | 'slide' | 'drop' | 'cut' | 'flip' | 'none'
//   from: 'left'|'right'|'top'|'bottom' (slide), dist; exit 0..1 (continua a deriva e acelera: passe prog(...,E.inC)), exitTo [dx,dy]
//   drift [dx,dy] px por segundo depois de chegar · jit = amplitude do boil (px) · lift = sombra (0 = sem)
function scrap(ctx, f, img, o = {}) {
  const { x = W / 2, y = H / 2, w = 600, rot = 0, start = 0, inn = 'pop', from = 'bottom', dist = 900, exit = 0, exitTo = [0, 1400],
    drift = [0, -6], jit = 2, lift = 1, seed = 1, k = S.spring?.k ?? 110, c = S.spring?.c ?? 12, alpha = 1, anchor = [.5, .5] } = o;
  if (f < start) return null;
  const cv = scrapCanvas(img, o); if (!cv) return null;
  const pad = cv._pad, sc = w / (cv.width - pad * 2), t = (f - start) / FPS;
  const p = inn === 'cut' || inn === 'none' ? 1 : spring(f, start, { k, c });
  let px = x + drift[0] * t, py = y + drift[1] * t, s = 1, r = rot, sx = 1;
  if (inn === 'pop') { s = .55 + .45 * p; r += (1 - p) * .35; }
  if (inn === 'cut') s = tick(f) - tick(start) < 1 ? 1.07 : 1;
  if (inn === 'slide') { const d = (1 - p) * dist; px += from === 'left' ? -d : from === 'right' ? d : 0; py += from === 'top' ? -d : from === 'bottom' ? d : 0; r += (1 - p) * (from === 'left' ? -.25 : .25); }
  if (inn === 'drop') { py -= (1 - p) * dist; s = 1 + (1 - p) * .25; }
  if (inn === 'flip') sx = Math.cos((1 - clamp(p)) * Math.PI * 2.5);
  if (exit > 0) { px += exitTo[0] * exit; py += exitTo[1] * exit; r += exit * .3 * Math.sign(exitTo[0] || 1); }
  const b = boil(f, seed, jit);
  ctx.save(); ctx.globalAlpha = alpha * (inn === 'pop' ? clamp(p * 3) : 1);
  ctx.translate(px + b.x, py + b.y); ctx.rotate(r + b.r); ctx.scale(s * sx * sc, s * sc);
  const ax = -(cv.width - pad * 2) * anchor[0] - pad, ay = -(cv.height - pad * 2) * anchor[1] - pad;
  if (lift > 0) { ctx.shadowColor = `rgba(30,22,12,${.30 * lift})`; ctx.shadowBlur = 22 * lift / sc * BS; ctx.shadowOffsetX = 6 * lift / sc; ctx.shadowOffsetY = 12 * lift / sc; }
  ctx.drawImage(cv, ax, ay);
  ctx.restore();
  return { x: px, y: py, w, h: w * (cv.height - pad * 2) / (cv.width - pad * 2) };
}
// forma de cor chapada atrás dos recortes: 'circle' | 'half' | 'quarter' | 'rect' | 'burst' (spikes) — cresce em degraus (mola), grid opcional (papel quadriculado)
function shape(ctx, f, { type = 'circle', x = W / 2, y = H / 2, r = 300, w = 0, h = 0, rot = 0, color = O, start = 0, grid = 0, alpha = 1, seed = 1, jit = 1.5, k = S.spring?.k ?? 120, c = S.spring?.c ?? 13, exit = 0, spikes = 13 } = {}) {
  if (f < start) return;
  const p = spring(f, start, { k, c }) * (1 - E.inC(clamp(exit))), b = boil(f, seed, jit);
  if (p <= .001) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x + b.x, y + b.y); ctx.rotate(rot + b.r); ctx.scale(p, p);
  ctx.beginPath();
  if (type === 'circle') ctx.arc(0, 0, r, 0, TAU);
  else if (type === 'half') { ctx.arc(0, 0, r, Math.PI, TAU); ctx.closePath(); }
  else if (type === 'quarter') { ctx.moveTo(0, 0); ctx.arc(0, 0, r, Math.PI, Math.PI * 1.5); ctx.closePath(); }
  else if (type === 'burst') {        // explosão estrelada irregular atrás do herói (ref Vox): pontas de tamanhos diferentes
    const n = spikes * 2;
    for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2, k = i % 2 ? .58 + hash(seed * 7 + i) * .08 : .82 + hash(seed * 3 + i) * .3; ctx.lineTo(Math.cos(a) * r * k, Math.sin(a) * r * k); }
    ctx.closePath();
  }
  else ctx.rect(-(w || r) / 2, -(h || r) / 2, w || r, h || r);
  ctx.fillStyle = color; ctx.fill();
  if (grid > 0) {
    ctx.clip(); ctx.strokeStyle = `rgba(255,255,255,${.35 * grid})`; ctx.lineWidth = 1.6;
    const R = Math.max(r, w, h) * 1.1;
    for (let v = -R; v < R; v += 22) { ctx.beginPath(); ctx.moveTo(v, -R); ctx.lineTo(v, R); ctx.moveTo(-R, v); ctx.lineTo(R, v); ctx.stroke(); }
  }
  ctx.restore();
}
// tira/folha de papel rasgado (sem imagem): esconde bordas retas de recortes, vira fundo de rótulos, transição 'paper'
function tornRect(ctx, x, y, w, h, { tone = S.colors.paper || '#ECE7DC', seed = 1, amp = 12, seg = 10, edges = 'tb', rot = 0, lift = 1, tex = true } = {}) {
  const key = ['torn', w | 0, h | 0, tone, seed, amp, seg, edges, tex].join('|');   // posição fora da chave: a tira pode andar
  let cv = _paper[key];
  if (!cv) {
    const pad = amp + 4; cv = mk(Math.ceil(w + pad * 2), Math.ceil(h + pad * 2)); const g = cv.getContext('2d');
    polyPath(g, tornPoly(w, h, { amp, seg, seed, edges }), pad, pad); g.clip();
    if (tex) g.drawImage(paperTex(tone, { seed: seed + 3, w: Math.ceil(w + pad * 2), h: Math.ceil(h + pad * 2), crumple: .35 }), 0, 0);
    else { g.fillStyle = tone; g.fillRect(0, 0, cv.width, cv.height); }
    cv._pad = pad; _paper[key] = cv;
  }
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
  if (lift > 0) { ctx.shadowColor = `rgba(30,22,12,${.22 * lift})`; ctx.shadowBlur = 16 * lift * BS; ctx.shadowOffsetY = 6 * lift; }
  ctx.drawImage(cv, -w / 2 - cv._pad, -h / 2 - cv._pad); ctx.restore();
}
// fita adesiva translúcida com pontas serrilhadas
function tape(ctx, x, y, w, h = 46, rot = 0, { color = 'rgba(236,228,200,.78)', seed = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  polyPath(ctx, tornPoly(w, h, { amp: 5, seg: 6, seed, edges: 'lr' }), -w / 2, -h / 2);
  ctx.fillStyle = color; ctx.shadowColor = 'rgba(0,0,0,.12)'; ctx.shadowBlur = 6 * BS; ctx.fill(); ctx.restore();
}

// TINTA À MÃO: traço que se desenha em degraus e treme (boil). pts = polilinha [[x,y],...]
//   ink(ctx,f,pts,{start,dur,color,width,head}) — head: ponta de seta no fim
function ink(ctx, f, pts, { start = 0, dur = 10, color = S.colors.ink || '#151515', width = 7, head = false, seed = 1, jit = 1.6, exit = 0, alpha = 1 } = {}) {
  if (f < start || pts.length < 2) return;
  const p = prog(f, start, start + dur, E.outC) * (1 - clamp(exit)); if (p <= 0) return;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(tot); }
  const lim = tot * p, b = boil(f, seed, jit, 2);
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let pass = 0; pass < 2; pass++) {
    const o = boil(f, seed + pass * 13, jit * .6, 2);
    ctx.lineWidth = width * (pass ? .55 : 1);
    ctx.beginPath(); ctx.moveTo(pts[0][0] + b.x + o.x, pts[0][1] + b.y + o.y);
    let last = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const l0 = L[i - 2] || 0;
      if (L[i - 1] <= lim) { ctx.lineTo(pts[i][0] + b.x + o.x, pts[i][1] + b.y + o.y); last = pts[i]; }
      else { const t = (lim - l0) / (L[i - 1] - l0); last = [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]; ctx.lineTo(last[0] + b.x + o.x, last[1] + b.y + o.y); break; }
    }
    ctx.stroke();
  }
  if (head && p > .97) {
    const n = pts.length, a = Math.atan2(pts[n - 1][1] - pts[n - 4 < 0 ? 0 : n - 4][1], pts[n - 1][0] - pts[n - 4 < 0 ? 0 : n - 4][0]), hx = pts[n - 1][0] + b.x, hy = pts[n - 1][1] + b.y, s = width * 4.2;
    ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(hx - Math.cos(a - .5) * s, hy - Math.sin(a - .5) * s); ctx.lineTo(hx, hy); ctx.lineTo(hx - Math.cos(a + .5) * s, hy - Math.sin(a + .5) * s); ctx.stroke();
  }
  ctx.restore();
}
// caminhos prontos para ink(): elipse de marca-texto (não fecha, passa do ponto), seta com laço, sublinhado, X
function pathEllipse(cx, cy, rx, ry, { turns = 1.12, a0 = -2.2, seed = 1, wob = .06 } = {}) {
  const r = rng(seed), n = 64, pts = [], ph = r() * 9;
  for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * TAU, k = 1 + Math.sin(t * 7 + ph) * wob + t * .05; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return pts;
}
function pathArrow(x0, y0, x1, y1, { loop = true, bend = .25, seed = 1 } = {}) {
  const pts = [], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, n = 60;
  for (let i = 0; i <= n; i++) {
    const t = i / n; let x = x0 + dx * t + nx * Math.sin(t * Math.PI) * L * bend, y = y0 + dy * t + ny * Math.sin(t * Math.PI) * L * bend;
    if (loop) { const w = Math.exp(-((t - .38) ** 2) / .006), a = (t - .38) * 26; x += (Math.cos(a) - 1) * L * .09 * w + Math.sin(a) * L * .06 * w; y += Math.sin(a) * L * .09 * w; }
    pts.push([x, y]);
  }
  return pts;
}
const pathUnder = (x, y, w, { seed = 1, wav = 6 } = {}) => { const r = rng(seed), p = []; for (let i = 0; i <= 24; i++) p.push([x + w * i / 24, y + Math.sin(i * .9 + r() * 2) * wav * (r() * .6 + .4)]); return p; };
// marca-texto atrás de uma palavra (multiply), revela da esquerda p/ direita em degraus
function marker(ctx, f, x, y, w, h, { start = 0, dur = 5, color = S.colors.marker || '#F6D33C', rot = -.012, seed = 1, alpha = .92 } = {}) {
  if (f < start) return;
  const p = prog(f, start, start + dur, E.outC), b = boil(f, seed, 1.2);
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'multiply'; ctx.translate(x + b.x, y + b.y); ctx.rotate(rot + b.r);
  ctx.beginPath(); ctx.rect(-6, -h / 2 - 8, (w + 12) * p, h + 16); ctx.clip();
  polyPath(ctx, tornPoly(w + 12, h, { amp: 4, seg: 7, seed, edges: 'tblr' }), -6, -h / 2);
  ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
// tarja de censura (marcador preto grosso) — revela em degraus
function redact(ctx, f, x, y, w, h, { start = 0, dur = 6, color = '#111', seed = 2, rot = -.01 } = {}) {
  marker(ctx, f, x, y + h / 2, w, h, { start, dur, color, seed, rot, alpha: 1 });
}

// TIPOGRAFIA de papel
const fontI = (s, fam) => `italic 400 ${s}px "${fam}"`;
// palavras que entram uma a uma por CORTE (sem blur — stop-motion). parts: [[txt, {i: itálico, hl: cor marca-texto, c: cor, at: frame}], ...]
function ptext(ctx, f, parts, { x = W / 2, y = H / 2, size = 90, fam = S.fonts.serif || DISPLAY, color = S.colors.ink || '#151515', align = 'center', start = 0, stagger = 3, ls = 0, exit = 0, weight = 400, seed = 1 } = {}) {
  if (f < start) return;
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = ls + 'px';
  const fnt = pt => pt.i ? fontI(size, fam) : `${weight} ${size}px "${fam}"`, sp = size * .26;
  const ws = parts.map(([t, o = {}]) => { ctx.font = fnt(o); return ctx.measureText(t).width; });
  const tw = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1);
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  const b = boil(f, seed, 1.2);
  parts.forEach(([t, o = {}], i) => {
    const st = o.at ?? start + i * stagger;      // o.at = frame absoluto da palavra (casar com a fala)
    if (f >= st && exit < 1) {
      if (o.hl) marker(ctx, f, cx - 4, y - size * .32, ws[i] + 8, size * .78, { start: st + 1, dur: 4, color: o.hl, seed: seed + i });
      ctx.font = fnt(o); ctx.fillStyle = o.c || color;
      const s = tick(f) - tick(st) < 1 ? 1.08 : 1;
      ctx.save(); ctx.translate(cx + ws[i] / 2 + b.x, y + b.y + exit * 60); ctx.scale(s, s); ctx.globalAlpha = 1 - exit; ctx.fillText(t, -ws[i] / 2, 0); ctx.restore();
    }
    cx += ws[i] + sp;
  });
  ctx.restore();
  return { w: tw };
}
// datilografia (Courier): cps = caracteres por segundo, \n quebra linha, cursor piscando a 12fps
function typeText(ctx, f, txt, { x = 100, y = 200, size = 44, fam = S.fonts.type || MONO, color = S.colors.ink || '#151515', start = 0, cps = 22, lh = 1.3, caret = true, weight = 400, align = 'left' } = {}) {
  if (f < start) return;
  const n = Math.floor((f - start) / FPS * cps), lines = txt.split('\n');
  ctx.save(); ctx.font = `${weight} ${size}px "${fam}"`; ctx.fillStyle = color; ctx.textAlign = align;
  let left = n, cy = y, lastX = x, lastY = y;
  for (const L of lines) {
    if (left < 0) break;
    const s = L.slice(0, Math.max(0, left)); ctx.fillText(s, x, cy);
    lastX = x + (align === 'left' ? ctx.measureText(s).width : align === 'center' ? ctx.measureText(s).width / 2 : 0); lastY = cy;
    left -= L.length + 1; cy += size * lh;
  }
  if (caret && tick(f) % 6 < 3) ctx.fillRect(lastX + 3, lastY - size * .78, size * .08, size * .92);
  ctx.restore();
}
// rótulo grotesco com quadradinho de cor (ref "■ Joseph Nicephore"): digita em degraus
function label(ctx, f, txt, { x = 80, y = 200, size = 34, fam = S.fonts.label || DISPLAY, color = S.colors.ink || '#151515', square = O, start = 0, cps = 30, weight = S.fonts.labelWeight || 800 } = {}) {
  if (f < start) return;
  const n = Math.min(txt.length, Math.floor((f - start) / FPS * cps) + 1);
  ctx.save(); ctx.fillStyle = square; ctx.fillRect(x, y - size * .62, size * .62, size * .62);
  ctx.font = `${weight} ${size}px "${fam}"`; ctx.fillStyle = color; ctx.letterSpacing = (-size * .02) + 'px';
  ctx.fillText(txt.slice(0, n), x + size * .85, y); ctx.restore();
}

// poses de um elemento ao longo do tempo: [[frame,{x,y,w,...}],...] → interpola com mola (em degraus se STEP). Ex.: herói que encolhe p/ o canto.
function poses(f, keys, o = S.spring || { k: 80, c: 13 }) {
  let i = 0; while (i + 1 < keys.length && keys[i + 1][0] <= f) i++;
  const cur = keys[i][1], prev = (keys[i - 1] || keys[i])[1], p = i ? spring(f, keys[i][0], o) : 1, r = {};
  for (const k in cur) r[k] = lerp(prev[k], cur[k], p);
  return r;
}
// desenha fn(ctx) no sistema de coordenadas de um scrap (centro + deriva + saída + rotação) — p/ riscar/circular algo DENTRO do documento.
// Passe o MESMO objeto de opções usado no scrap(). Coordenadas locais: (0,0) = centro do recorte, em px da tela (w do scrap).
function onScrap(ctx, f, o, fn) {
  const t = Math.max(0, f - (o.start || 0)) / FPS, d = o.drift || [0, -6], ex = o.exit || 0, to = o.exitTo || [0, 0];
  ctx.save(); ctx.translate(o.x + d[0] * t + to[0] * ex, o.y + d[1] * t + to[1] * ex); ctx.rotate((o.rot || 0) + ex * .3 * Math.sign(to[0] || 1)); fn(ctx); ctx.restore();
}

// ---------- CÂMERA EM ONDA (genérica) ----------
// alvos [t(s), escala, focoX, focoY, rotação] → caminho linear → filtro GAUSSIANO (σ): todo canto vira curva em S.
// Zoom interpolado em escala log. Nunca passa pelos alvos "em bico". Meça com: node tools/camcheck.cjs projects/<p>/scenes.js
//   const cam = camPath(CAM, { sigma: .28 });            // uma vez, no topo do scenes.js
//   applyCamPath(ctx, cam, t, { cx: W / 2, cy: H / 2 });  // dentro da cena (t em segundos)
//   camBlurPath(ctx, cam, t);                             // opcional, depois de desenhar: zoom-blur pela velocidade
function camPath(targets, { sigma = .28, dt = 1 / 240, t0 = targets[0][0] } = {}) {
  const lin = t => {
    let i = 0; while (i < targets.length - 2 && t > targets[i + 1][0]) i++;
    const A = targets[i], Bk = targets[i + 1], k = clamp((t - A[0]) / (Bk[0] - A[0]));
    return [lerp(Math.log(A[1]), Math.log(Bk[1]), k), lerp(A[2], Bk[2], k), lerp(A[3], Bk[3], k), lerp(A[4] || 0, Bk[4] || 0, k)];
  };
  const n = Math.ceil((targets[targets.length - 1][0] - t0) / dt) + 1, raw = [];
  for (let i = 0; i < n; i++) raw.push(lin(t0 + i * dt));
  const R = Math.ceil(sigma * 3 / dt), w = []; let ws = 0;
  for (let j = -R; j <= R; j++) { const v = Math.exp(-.5 * (j * dt / sigma) ** 2); w.push(v); ws += v; }
  const tab = raw.map((_, i) => { const o = [0, 0, 0, 0];
    for (let j = -R; j <= R; j++) { const r = raw[Math.min(n - 1, Math.max(0, i + j))], q = w[j + R] / ws; for (let c = 0; c < 4; c++) o[c] += r[c] * q; }
    return o; });
  return t => {
    const x = clamp((t - t0) / dt, 0, tab.length - 1.001), i = Math.floor(x), k = x - i, A = tab[i], Bk = tab[i + 1];
    return [Math.exp(lerp(A[0], Bk[0], k)), lerp(A[1], Bk[1], k), lerp(A[2], Bk[2], k), lerp(A[3], Bk[3], k)];
  };
}
function applyCamPath(ctx, cam, t, { cx = W / 2, cy = H / 2, drift = .004 } = {}) {
  const [s, fx, fy, r] = cam(t), dr = 1 + t * drift;   // drift: aproximação lenta e contínua (zero dead hold)
  ctx.translate(cx, cy); ctx.rotate(r); ctx.scale(s * dr, s * dr); ctx.translate(-fx, -fy);
}
const _zbp = {};
function camBlurPath(ctx, cam, t) {
  const a = cam(t - .01), b = cam(t + .01);
  const v = Math.abs(Math.log(b[0] / a[0])) * 50 + Math.hypot(b[1] - a[1], b[2] - a[2]) * b[0] * .02;
  if (v < .6) return;
  const cv = ctx.canvas, key = cv.width + 'x' + cv.height, c = _zbp[key] || (_zbp[key] = mk(cv.width, cv.height));
  const g2 = c.getContext('2d'); g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, c.width, c.height); g2.drawImage(cv, 0, 0);
  const amt = Math.min(.04, (v - .6) * .01), n = 5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 1; i <= n; i++) { const z = 1 + amt * i / n; ctx.globalAlpha = .5 / i;
    ctx.drawImage(c, cv.width / 2 * (1 - z), cv.height / 2 * (1 - z), cv.width * z, cv.height * z); }
  ctx.restore();
}
