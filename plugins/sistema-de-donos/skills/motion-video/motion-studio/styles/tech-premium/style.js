// Estilo: tech-premium — produto premium estilo Apple, UI em 3D, fundo líquido.
// Regras de linguagem visual em STYLE.md (ler antes de criar cenas).
window.STYLE = {
  name: 'tech-premium',
  colors: { dark: '#0A0A0A', light: '#F5F3EE', accent: '#FF4D00', contrast: '#2340C8', card: '#141414' },
  fonts: {
    display: 'Inter Tight', mono: 'JetBrains Mono',
    css: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=JetBrains+Mono:wght@400;700&display=swap',
    preload: ['600 80px "Inter Tight"', '500 40px "Inter Tight"', '400 30px "JetBrains Mono"', '700 30px "JetBrains Mono"'],
  },
  // blobs: x/y base, ax/ay amplitude, fx/fy frequência (inteiros → loop perfeito), px/py fase
  bg: {
    dark: { blobs: [
      { x: 1620, y: 1030, ax: 180, ay: 90, fx: 1, fy: 2, py: 1.5708, rx: 950, ry: 560, rgb: '255,77,0', a: .78 },
      { x: 140, y: 40, ax: 150, ay: 80, fx: 1, fy: 2, px: 1.5708, rx: 720, ry: 420, rgb: '255,77,0', a: .34 },
      { x: 860, y: 560, ax: 240, ay: 120, fx: 2, fy: 1, px: 1, py: 1.5708, rx: 640, ry: 380, rgb: '35,64,200', a: .22 },
    ] },
    light: { blobs: [
      { x: 1620, y: 960, ax: 170, ay: 80, fx: 1, fy: 2, px: 1.5708, rx: 950, ry: 540, rgb: '255,77,0', a: .30 },
      { x: 240, y: 110, ax: 160, ay: 60, fx: 1, fy: 2, py: 1.5708, rx: 760, ry: 420, rgb: '35,64,200', a: .13 },
    ] },
  },
  transition: 'circle',
  grain: .06,
  sfx: { transition: { name: 'whoosh', gain: .33, opts: { dur: .5, f0: 850, f1: 5500, peak: .28 } } },
};
