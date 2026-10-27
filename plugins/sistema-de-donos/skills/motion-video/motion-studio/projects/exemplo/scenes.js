// ============================================================
// Projeto claude-code-ad · cenas, cards e efeitos sonoros
// Engine fornece: E, prog, spring, cam, words, logo, smear, persp, layer, bg, penLine...
// ============================================================

// Efeitos sonoros: [nome, frame, ganho, pan, opções]. Transições ganham swoosh automático (style.sfx).
const SFX = [
  // A · abertura
  ['pop', 2, .55, 0, { f0: 900, f1: 220 }],
  ['shimmer', 6, .10, 0, { dur: 1.0 }],
  ['whoosh', 58, .55, 0, { dur: .62, f0: 300, f1: 5200, peak: .6, panFrom: .5, panTo: -.5 }],
  ['whoosh', 126, .14, 0, { dur: .4, f0: 600, f1: 3000, peak: .4 }],
  ['whoosh', 166, .32, 0, { dur: .55, f0: 120, f1: 900, peak: .5 }],
  ['typing', 190, .22, 0, { to: 226, step: 1.6 }],
  ['whoosh', 201, .42, 0, { dur: .75, f0: 200, f1: 7000, peak: .92 }],
  ['click', 238, .9, 0, { freq: 1800, dur: .04 }],
  ['boom', 240, .75, 0, { dur: 1.1 }],
  // B · código
  ...[0, 1, 2, 3, 4].map(i => ['typing', 268 + i * 7, .12, 0, { to: 282 + i * 7, step: 2.2 }]),
  ['click', 304, .25, 0, { freq: 3200, dur: .03 }],
  ['whoosh', 322, .38, 0, { dur: .5, f0: 120, f1: 1500, peak: .55 }],
  ['pop', 346, .6, 0, { f0: 520, f1: 140, dur: .16 }],
  // C · ajuste
  ['whoosh', 424, .3, 0, { dur: .55, f0: 120, f1: 900, peak: .5 }],
  ['clicks', 476, .12, .4, { to: 520, step: 5 }],
  ['whoosh', 508, .4, 0, { dur: .6, f0: 200, f1: 6500, peak: .9 }],
  ['pop', 532, .7, 0, { f0: 340, f1: 120, dur: .2 }],
  ['chime', 564, .5],
  ['shimmer', 566, .12, 0, { dur: .9 }],
  ['pop', 576, .45, 0, { f0: 760, f1: 300, dur: .1 }],
  // D · conversa
  ['whoosh', 681, .3, 0, { dur: .55, f0: 120, f1: 900, peak: .5 }],
  ...[0, 1, 2, 3].map(k => [['scribble', 717 + k * 19, .22, -.2 + k * .12, { dur: .3 }], ['click', 727 + k * 19, .3, .2, { freq: 2900, dur: .025 }]]).flat(),
  // E · assinatura
  ['pop', 813, .5, 0, { f0: 900, f1: 220 }],
  ['shimmer', 819, .12, 0, { dur: 1.4 }],
  ['boom', 813, .25, 0, { dur: 1.2 }],
];

// ---------- cards (desenhados em canvas próprios) ----------
const chat = mk(1240, 400), code = mk(1280, 460), panel = mk(1200, 480), talk = mk(1240, 580);

function drawChat(f) {
  const c = chat.getContext('2d'), w = chat.width, h = chat.height;
  c.clearRect(0, 0, w, h);
  rr(c, 1, 1, w - 2, h - 2, 36); c.fillStyle = CARD; c.fill();
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; c.stroke();
  c.textBaseline = 'alphabetic';
  c.font = font(400, 26, MONO); c.fillStyle = '#7d7d7d'; c.fillText('claude ›', 60, 82);
  c.fillStyle = O; circle(c, 1166, 72, 7); c.fill();
  c.fillStyle = '#7d7d7d'; c.textAlign = 'right'; c.fillText('opus 5.5', 1146, 82); c.textAlign = 'left';
  const L1 = 'Cria um vídeo de 15s em motion,', L2 = 'preto, branco e laranja.';
  const n = Math.floor(prog(f, 190, 226, E.lin) * (L1.length + L2.length));
  c.font = font(500, 50); c.letterSpacing = '-1px'; c.fillStyle = WH;
  const s1 = L1.slice(0, n), s2 = L2.slice(0, Math.max(0, n - L1.length));
  c.fillText(s1, 60, 176); c.fillText(s2, 60, 246);
  // cursor
  if (Math.floor(f / 16) % 2 === 0 || (n > 0 && n < L1.length + L2.length)) {
    const onL2 = n > L1.length, tw = c.measureText(onL2 ? s2 : s1).width;
    c.fillStyle = O; c.fillRect(60 + tw + 6, onL2 ? 206 : 136, 4, 52);
  }
  c.letterSpacing = '0px';
  // chips
  c.font = font(400, 22, MONO);
  [['1920×1080', 60], ['60 fps', 236], ['15 s', 358]].forEach(([t, x]) => {
    const tw = c.measureText(t).width;
    rr(c, x, 300, tw + 32, 44, 22); c.strokeStyle = 'rgba(255,255,255,.14)'; c.stroke();
    c.fillStyle = '#9a9a9a'; c.fillText(t, x + 16, 330);
  });
  // botão enviar (pressionado em f 240)
  const press = 1 - .14 * Math.sin(Math.PI * clamp((f - 238) / 12));
  c.save(); c.translate(1150, 320); c.scale(press, press);
  c.fillStyle = O; circle(c, 0, 0, 44); c.fill();
  c.strokeStyle = K; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-16, 0); c.lineTo(16, 0); c.moveTo(3, -13); c.lineTo(16, 0); c.lineTo(3, 13); c.stroke();
  c.restore();
}

const CODE = [
  [['const ', B], ['t = ', K], ['frame', O], [' / fps;', K]],
  [['const ', B], ['x = interpolate(t, [0, 1], [0, 1600]);', K]],
  [['const ', B], ['y = spring({ damping: 12 });', K]],
  [['draw', K], ['(scene, x, y);', K]],
  [['// 900 frames. zero keyframes.', '#A09C94']],
];
function drawCode(f, b) {
  const c = code.getContext('2d'), w = code.width, h = code.height;
  c.clearRect(0, 0, w, h);
  rr(c, 1, 1, w - 2, h - 2, 32); c.fillStyle = '#FFFFFF'; c.fill();
  c.strokeStyle = 'rgba(10,10,10,.07)'; c.lineWidth = 2; c.stroke();
  ['#E4E1DA', '#E4E1DA', '#E4E1DA'].forEach((col, i) => { c.fillStyle = col; circle(c, 44 + i * 26, 46, 8); c.fill(); });
  c.font = font(400, 22, MONO); c.fillStyle = '#A09C94'; c.textBaseline = 'middle';
  c.fillText('scene.js', 136, 47);
  c.textAlign = 'right'; c.font = font(700, 24, MONO); c.fillStyle = O;
  c.fillText('F ' + String(f).padStart(4, '0'), w - 40, 47); c.textAlign = 'left';
  // linha ativa
  const hl = clamp((b - 58) / 14, 0, 3), i0 = Math.floor(hl), fr = E.inOutC(hl - i0);
  const hy = 128 + lerp(i0, Math.min(i0 + 1, 4), fr) * 66;
  if (b > 52) {
    c.globalAlpha = prog(b, 52, 60);
    c.fillStyle = 'rgba(255,77,0,.10)'; c.fillRect(24, hy - 30, w - 48, 60);
    c.fillStyle = O; c.fillRect(24, hy - 30, 5, 60); c.globalAlpha = 1;
  }
  c.font = font(400, 34, MONO);
  CODE.forEach((line, i) => {
    const y = 128 + i * 66;
    c.fillStyle = '#C9C5BD'; c.fillText(String(i + 1).padStart(2, '0'), 52, y);
    const len = line.reduce((a, t) => a + t[0].length, 0);
    let n = Math.floor(prog(b, 22 + i * 7, 36 + i * 7, E.lin) * len), x = 124;
    for (const [t, col] of line) {
      if (n <= 0) break;
      const s = t.slice(0, n); n -= t.length;
      c.fillStyle = col; c.fillText(s, x, y); x += c.measureText(s).width;
    }
  });
}

function drawPanel(f, cc) {
  const c = panel.getContext('2d'), w = panel.width, h = panel.height;
  c.clearRect(0, 0, w, h);
  rr(c, 1, 1, w - 2, h - 2, 36); c.fillStyle = CARD; c.fill();
  c.strokeStyle = 'rgba(255,255,255,.11)'; c.lineWidth = 2; c.stroke();
  c.textBaseline = 'middle';
  const m = prog(cc, 58, 104, E.inOutC);
  const x1 = lerp(.33, .16, m), y1 = lerp(.33, 1, m), x2 = lerp(.67, .3, m), y2 = lerp(.67, 1, m);
  c.font = font(400, 22, MONO); c.fillStyle = '#7d7d7d';
  c.fillText('easing', 56, 60);
  c.textAlign = 'right';
  c.fillText(`(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)})`, 536, 60);
  c.textAlign = 'left';
  const bx = 56, by = 100, bw = 480, bh = 320, P = (x, y) => [bx + x * bw, by + bh - y * bh];
  c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    c.beginPath(); c.moveTo(bx + i * bw / 4, by); c.lineTo(bx + i * bw / 4, by + bh); c.stroke();
    c.beginPath(); c.moveTo(bx, by + i * bh / 4); c.lineTo(bx + bw, by + i * bh / 4); c.stroke();
  }
  const [ax, ay] = P(0, 0), [dx, dy] = P(1, 1), [h1x, h1y] = P(x1, y1), [h2x, h2y] = P(x2, y2);
  c.strokeStyle = 'rgba(245,243,238,.35)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(ax, ay); c.lineTo(h1x, h1y); c.moveTo(dx, dy); c.lineTo(h2x, h2y); c.stroke();
  c.strokeStyle = O; c.lineWidth = 7; c.lineCap = 'round';
  c.beginPath(); c.moveTo(ax, ay); c.bezierCurveTo(h1x, h1y, h2x, h2y, dx, dy); c.stroke();
  c.fillStyle = WH; [[h1x, h1y], [h2x, h2y]].forEach(([x, y]) => { circle(c, x, y, 11); c.fill(); });
  const U = k => clamp(((((cc - 16 - k * 5) % 76) + 76) % 76) / 56);
  const u = U(0), [px, py] = P(u, cubicY(u, x1, y1, x2, y2));
  c.fillStyle = WH; circle(c, px, py, 9); c.fill();
  // preview com onion skin (spacing)
  c.fillStyle = '#7d7d7d'; c.fillText('preview', 600, 60);
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(620, 150); c.lineTo(1140, 150); c.stroke();
  for (let k = 7; k >= 0; k--) {
    const uk = U(k), xx = 640 + cubicY(uk, x1, y1, x2, y2) * 480;
    c.globalAlpha = k === 0 ? 1 : .08 + (7 - k) * .03;
    c.fillStyle = O; circle(c, xx, 150, 22); c.fill();
  }
  c.globalAlpha = 1;
  // sliders
  const sl = (label, val, norm, y) => {
    c.fillStyle = '#7d7d7d'; c.textAlign = 'left'; c.fillText(label, 600, y);
    c.fillStyle = WH; c.textAlign = 'right'; c.fillText(String(Math.round(val)), 1000, y); c.textAlign = 'left';
    c.fillStyle = 'rgba(255,255,255,.12)'; rr(c, 600, y + 30, 400, 8, 4); c.fill();
    c.fillStyle = O; rr(c, 600, y + 30, 400 * norm, 8, 4); c.fill();
    c.fillStyle = WH; circle(c, 600 + 400 * norm, y + 34, 13); c.fill();
  };
  const dmp = lerp(30, 12, prog(cc, 70, 110)), stf = lerp(100, 170, prog(cc, 78, 116));
  sl('damping', dmp, dmp / 40, 250);
  sl('stiffness', stf, stf / 200, 340);
  // botão + → ponto laranja
  const mf = prog(cc, 126, 142, E.inOutC);
  c.save(); c.translate(1110, 400);
  c.globalAlpha = 1 - mf; c.strokeStyle = WH; c.lineWidth = 4; circle(c, 0, 0, 46); c.stroke();
  c.globalAlpha = 1; c.fillStyle = O; circle(c, 0, 0, 46 * mf); c.fill();
  c.rotate(mf * Math.PI / 2); c.globalAlpha = 1 - mf; c.strokeStyle = WH; c.lineWidth = 5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.moveTo(0, -18); c.lineTo(0, 18); c.stroke();
  c.restore();
}

const TALK = ['a entrada está lenta.', 'corta pela metade.', 'deixa o laranja mais forte.', 'e fecha em loop.'];
function drawTalk(f, d) {
  const c = talk.getContext('2d'), w = talk.width, h = talk.height;
  c.clearRect(0, 0, w, h);
  rr(c, 1, 1, w - 2, h - 2, 36); c.fillStyle = '#FFFFFF'; c.fill();
  c.strokeStyle = 'rgba(10,10,10,.07)'; c.lineWidth = 2; c.stroke();
  c.textBaseline = 'middle';
  c.font = font(400, 24, MONO); c.fillStyle = '#A09C94'; c.fillText('feedback', 64, 70);
  c.textAlign = 'right'; c.font = font(600, 26); c.fillStyle = K; c.fillText('Claude', w - 64, 70);
  c.fillStyle = O; circle(c, w - 64 - c.measureText('Claude').width - 20, 70, 9); c.fill();
  c.textAlign = 'left';
  c.fillStyle = 'rgba(10,10,10,.06)'; c.fillRect(64, 110, w - 128, 2);
  const kf = (d - 86) / 19, k = Math.floor(kf);
  TALK.forEach((t, i) => {
    const y = 180 + i * 96;
    c.font = font(600, 50); c.letterSpacing = '-1.5px';
    const tw = c.measureText(t).width;
    const appear = prog(d, 64 + i * 4, 84 + i * 4, E.outC);
    let a = i < k ? .42 : i === k ? 1 : .18;
    if (k < 0) a = .18;
    c.globalAlpha = a * appear; c.fillStyle = K; c.fillText(t, 64, y);
    c.letterSpacing = '0px'; c.globalAlpha = 1;
    if (i === k) penLine(c, 64, y + 34, tw, clamp((kf - k) * 1.7), i + 1);
    if (i < k || (i === k && kf - k > .62)) {
      const pa = i < k ? 1 : prog(kf - k, .62, .9);
      c.globalAlpha = pa * (i < k ? .7 : 1);
      c.font = font(700, 24, MONO); c.fillStyle = O;
      c.fillText('✓ aplicado', 64 + tw + 32 + (1 - pa) * 12, y + 2);
      c.globalAlpha = 1;
    }
  });
}

// ---------- miniaturas p/ parede de frames ----------
const THUMB_FRAMES = [30, 104, 160, 210, 236, 300, 470, 520, 560, 600, 690, 740, 780, 850];
let thumbs = [];
function makeThumbs() {
  BS = .2; THUMB = true;
  thumbs = THUMB_FRAMES.map(fr => {
    const c = mk(384, 216), x = c.getContext('2d');
    x.scale(.2, .2); render(x, fr); return c;
  });
  BS = 1; THUMB = false;
}
function drawWall(ctx, f, b) {
  const a = prog(b, 82, 100, E.outC), rise = 1 - spring(b, 82, { k: 90, c: 16 });
  const TW = 520, TH = 292, G = 34, period = (TW + G) * 9;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.translate(960, 540 + rise * 760); ctx.rotate(-.24);
  const z = 1.02 + b * .0009; ctx.scale(z, z);
  for (let r = -2; r <= 2; r++) {
    const dir = r % 2 ? 1 : -1, off = b * 3.4 * dir + r * 190;
    for (let j = -4; j <= 4; j++) {
      let x = j * (TW + G) + off;
      x = ((x + period / 2) % period + period) % period - period / 2;
      const y = r * (TH + G), idx = (r + 2) * 9 + j + 4;
      ctx.save(); ctx.translate(x - TW / 2, y - TH / 2);
      rr(ctx, 0, 0, TW, TH, 18); ctx.save(); ctx.clip();
      if (idx % 6 === 2) {
        ctx.fillStyle = O; ctx.fillRect(0, 0, TW, TH);
        ctx.fillStyle = K; ctx.font = font(600, 72); ctx.letterSpacing = '-2px'; ctx.textBaseline = 'middle';
        ctx.fillText('F ' + String((idx * 37) % 900).padStart(3, '0'), 36, TH / 2);
      } else if (idx % 7 === 4) {
        ctx.fillStyle = B; ctx.fillRect(0, 0, TW, TH);
        ctx.fillStyle = WH; circle(ctx, TW / 2, TH / 2, 56); ctx.fill();
      } else {
        ctx.drawImage(thumbs[idx % thumbs.length], 0, 0, TW, TH);
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(10,10,10,.10)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

// ============================================================
// CENAS
// ============================================================
// A · abertura + prompt (escuro) ------------------------------
function sceneA(ctx, f) {
  ctx.save(); bg(ctx, f, true); cam(ctx, f, 0, 260, 1, 1.12);
  const D = 1150, P = t => prog(t, 60, 122, E.push);
  const sh = P(f), vel = ((P(f + 1) - P(f - 1)) / 2) * D;
  if (f < 112) smear(ctx, vel * 1.1, am => logo(ctx, f, { start: 2, offset: -sh * D * 1.4, am }));
  if (f >= 58 && f < 138) {
    const ex = prog(f, 114, 136, E.inC), drift = prog(f, 90, 136, E.lin);
    smear(ctx, vel * 1.1, am => words(ctx, f, [['motion feito'], ['só com código.', O]],
      { x: 960 + D - sh * D - drift * 40 - ex * 160, start: -999, am, exit: ex, size: 74, drift: drift * 6 }));
  }
  const push = prog(f, 218, 246, E.inOutQ), z = lerp(1, 3.4, push);
  ctx.save();
  ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-lerp(960, 1490, push), -lerp(540, 720, push));
  if (f >= 124) {
    const mv = prog(f, 158, 214, E.smooth), s = lerp(1, .74, mv) * (1 + .03 * prog(f, 200, 246, E.lin));
    ctx.save(); ctx.translate(960, lerp(540, 200, mv)); ctx.scale(s, s);
    words(ctx, f, [['Tudo começa com'], ['um prompt.', O]], { x: 0, y: 0, start: 124, size: 84, exit: push, drift: prog(f, 150, 246, E.lin) * 5 });
    ctx.restore();
  }
  if (f >= 166) {
    const r = spring(f, 168, { k: 80, c: 14 });
    drawChat(f);
    const ry = lerp(-.34, -.15, r) + Math.sin(f / 45) * .025;
    ctx.globalAlpha = clamp(r * 1.6);
    persp(ctx, chat, 960, lerp(1000, 600, r), { ry: lerp(ry, 0, push), rz: lerp(-.035, 0, push) });
  }
  ctx.restore();
  if (f >= 240) {
    const p = prog(f, 240, 272, E.outC);
    ctx.save(); ctx.globalAlpha = 1 - p; ctx.strokeStyle = O; ctx.lineWidth = 8;
    circle(ctx, 960, 540, 160 + p * 300); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}

// B · código + parede de frames (claro) -----------------------
function sceneB(ctx, f) {
  const b = f - 246;
  ctx.save(); bg(ctx, f, false); cam(ctx, f, 246, 430, 1, 1.06);
  const ex = prog(b, 78, 100, E.inC);
  if (b < 104) {
    words(ctx, b, [['Que vira'], ['código.', O]], { y: lerp(235, 150, ex) - prog(b, 30, 80, E.lin) * 14, start: 10, size: 76, color: K, exit: ex, drift: prog(b, 30, 100, E.lin) * 6 });
    const r = spring(b, 16, { k: 80, c: 14 });
    drawCode(f, b);
    layer(ctx, clamp(r * 1.6) * (1 - ex), ex * 22, L =>
      persp(L, code, 960, lerp(1020, 650, r) - ex * 240 - prog(b, 40, 100, E.lin) * 18, { ry: .14 - prog(b, 20, 100, E.lin) * .08 + Math.sin(f / 50) * .03, rz: .022, light: true }));
  }
  if (b >= 80 && !THUMB) drawWall(ctx, f, b);
  if (b >= 98) {
    const s = spring(b, 100, { k: 210, c: 15 }) * (1 + .07 * prog(b, 112, 184, E.lin));
    ctx.save(); ctx.translate(960, 540); ctx.scale(s, s);
    ctx.save(); ctx.filter = blur(40); ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(ctx, -400, -60, 800, 190, 95); ctx.fill(); ctx.restore();
    ctx.fillStyle = K; rr(ctx, -420, -95, 840, 190, 95); ctx.fill();
    words(ctx, 0, [['Frame'], ['a frame.', O]], { x: 0, y: 4, start: -999, size: 86 });
    ctx.restore();
  }
  ctx.restore();
}

// C · ajuste → check → toast (escuro) -------------------------
function sceneC(ctx, f) {
  const c = f - 404;
  ctx.save(); bg(ctx, f, true); cam(ctx, f, 404, 655, 1, 1.07);
  const push = prog(c, 104, 142, E.smooth), z = lerp(1, 3.6, push);
  const fade = prog(c, 146, 166, E.inC);
  layer(ctx, 1 - fade, fade * 26, L => {
    L.save();
    L.translate(960, 540); L.scale(z, z); L.translate(-lerp(960, 1470, push), -lerp(540, 780, push));
    words(L, c, [['Ajuste até'], ['ficar perfeito.', O]], { y: 195 - prog(c, 40, 110, E.lin) * 16, start: 14, size: 72, exit: push, drift: prog(c, 40, 120, E.lin) * 6 });
    const r = spring(c, 22, { k: 80, c: 14 });
    drawPanel(f, c);
    L.globalAlpha = clamp(r * 1.6);
    const ry = lerp(-.22, -.12, r) + Math.sin(f / 48) * .025;
    persp(L, panel, 960, lerp(1060, 620, r) - prog(c, 40, 110, E.lin) * 20, { ry: lerp(ry + prog(c, 30, 110, E.lin) * .1, 0, push), rz: lerp(-.02, 0, push) });
    L.restore();
  });
  if (c >= 144) {
    const p = prog(c, 144, 184, E.smooth), R = lerp(46 * 3.6, 120, p) * (1 + .05 * prog(c, 180, 252, E.lin)), y = lerp(540, 420, p) - prog(c, 180, 252, E.lin) * 10;
    if (c >= 164) {
      const p2 = prog(c, 164, 204, E.outC);
      ctx.save(); ctx.globalAlpha = 1 - p2; ctx.strokeStyle = O; ctx.lineWidth = 5;
      circle(ctx, 960, y, 120 + p2 * 150); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = O; circle(ctx, 960, y, R); ctx.fill();
    const k = prog(c, 160, 180, E.outC);
    if (k > 0) {
      ctx.save(); ctx.translate(960, y); ctx.strokeStyle = K; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.setLineDash([158 * k, 400]);
      ctx.beginPath(); ctx.moveTo(-50, 4); ctx.lineTo(-14, 40); ctx.lineTo(56, -40); ctx.stroke(); ctx.restore();
    }
  }
  if (c >= 170) {
    const s = spring(c, 172, { k: 120, c: 14 }), y = lerp(860, 690, s) - prog(c, 190, 252, E.lin) * 12;
    ctx.save(); ctx.globalAlpha = clamp(s * 1.6);
    ctx.save(); ctx.filter = blur(40); ctx.fillStyle = 'rgba(0,0,0,.55)'; rr(ctx, 590, y - 30, 740, 124, 30); ctx.fill(); ctx.restore();
    rr(ctx, 550, y - 62, 820, 124, 30); ctx.fillStyle = WH; ctx.fill();
    rr(ctx, 586, y - 30, 60, 60, 14); ctx.fillStyle = B; ctx.fill();
    ctx.strokeStyle = WH; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(603, y + 1); ctx.lineTo(613, y + 11); ctx.lineTo(630, y - 10); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.font = font(600, 36); ctx.letterSpacing = '-.8px';
    ctx.fillStyle = K; ctx.fillText('Render concluído', 670, y + 1);
    const tw = ctx.measureText('Render concluído ').width;
    ctx.fillStyle = O; ctx.fillText('· 900 frames', 670 + tw, y + 1);
    ctx.letterSpacing = '0px'; ctx.font = font(400, 22, MONO); ctx.fillStyle = '#A09C94';
    ctx.textAlign = 'right'; ctx.fillText('15s · 60fps', 1336, y + 2);
    ctx.restore();
  }
  ctx.restore();
}

// D · feedback em conversa (claro) ----------------------------
function sceneD(ctx, f) {
  const d = f - 629;
  ctx.save(); bg(ctx, f, false); cam(ctx, f, 629, 827, 1, 1.06);
  const mv = prog(d, 30, 88, E.smooth), s = lerp(1, .72, mv);
  ctx.save(); ctx.translate(960, lerp(540, 165, mv)); ctx.scale(s, s);
  words(ctx, d, [['Sem timeline.'], ['Só conversa.', O]], { x: 0, y: 0, start: 10, size: 88, color: K, drift: prog(d, 20, 170, E.lin) * 5 });
  ctx.restore();
  if (d >= 52) {
    const r = spring(d, 54, { k: 80, c: 14 });
    drawTalk(f, d);
    ctx.globalAlpha = clamp(r * 1.6);
    persp(ctx, talk, 960, lerp(1120, 635, r) - prog(d, 80, 170, E.lin) * 16, { ry: .13 - prog(d, 60, 170, E.lin) * .07 + Math.sin(f / 50) * .025, rz: -.035 + prog(d, 60, 170, E.lin) * .015, light: true });
  }
  ctx.restore();
}

// E · assinatura (escuro) -------------------------------------
function sceneE(ctx, f) {
  const e = f - 799, ex = prog(f, 870, 898, E.inC);
  ctx.save(); bg(ctx, f, true); cam(ctx, f, 799, 900, 1, 1.18);
  logo(ctx, e, { start: 14, exit: ex });
  words(ctx, e, [['Vídeo feito 100% com código · Claude Opus 5.5']],
    { y: 640, size: 26, weight: 500, start: 38, stagger: 0, dur: 40, exit: ex, color: 'rgba(245,243,238,.55)', ls: 0 });
  ctx.restore();
}

// ============================================================
// MONTAGEM
// ============================================================
const SC = [
  { a: 0, fn: sceneA }, { a: 246, fn: sceneB }, { a: 404, fn: sceneC },
  { a: 629, fn: sceneD }, { a: 799, fn: sceneE },
];
// transições: círculo que nasce de um elemento em cena
const TR = [
  { a: 246, b: 274, x: 960, y: 540 },  // botão enviar
  { a: 404, b: 432, x: 960, y: 540 },  // pílula "Frame a frame"
  { a: 629, b: 657, x: 960, y: 690 },  // toast
  { a: 799, b: 827, x: 960, y: 540 },
];
