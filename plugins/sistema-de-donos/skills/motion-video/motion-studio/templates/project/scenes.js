// Template mínimo: 2 cenas + 1 transição, já seguindo as regras anti-dead-hold
// (cam contínua, entrada longa com drift, saída que continua o movimento).

const SFX = [
  ['pop', 4, .5],
  ['whoosh', 150, .3, 0, { dur: .5, f0: 120, f1: 900, peak: .5 }],
];

// Cena A (escuro): logo → headline
function sceneA(ctx, f) {
  ctx.save(); bg(ctx, f, true); cam(ctx, f, 0, 200, 1, 1.08);
  const ex = prog(f, 70, 92, E.inC);
  logo(ctx, f, { start: 4, exit: ex });
  words(ctx, f, [['Uma frase'], ['de impacto.', O]], { start: 88, size: 84, drift: prog(f, 110, 200, E.lin) * 6 });
  ctx.restore();
}

// Cena B (claro): headline sobe + card 3D
const card = mk(1200, 420);
function drawCard(f, b) {
  const c = card.getContext('2d');
  c.clearRect(0, 0, card.width, card.height);
  rr(c, 1, 1, card.width - 2, card.height - 2, 36); c.fillStyle = '#fff'; c.fill();
  c.font = font(600, 56); c.fillStyle = K; c.textBaseline = 'middle';
  c.fillText('Conteúdo do card', 64, 210);
}
function sceneB(ctx, f) {
  const b = f - 180;
  ctx.save(); bg(ctx, f, false); cam(ctx, f, 180, 360, 1, 1.06);
  const mv = prog(b, 40, 90, E.smooth);
  ctx.save(); ctx.translate(960, lerp(540, 180, mv)); ctx.scale(lerp(1, .74, mv), lerp(1, .74, mv));
  words(ctx, b, [['Prova'], ['visual.', O]], { x: 0, y: 0, start: 10, size: 86, color: K });
  ctx.restore();
  if (b >= 50) {
    const r = spring(b, 52, { k: 80, c: 14 });
    drawCard(f, b);
    ctx.globalAlpha = clamp(r * 1.6);
    persp(ctx, card, 960, lerp(1100, 640, r) - prog(b, 80, 180, E.lin) * 16,
      { ry: .14 - prog(b, 60, 180, E.lin) * .07 + Math.sin(f / 50) * .025, light: true });
  }
  ctx.restore();
}

const SC = [{ a: 0, fn: sceneA }, { a: 180, fn: sceneB }];
const TR = [{ a: 180, b: 208, x: 960, y: 540 }];
