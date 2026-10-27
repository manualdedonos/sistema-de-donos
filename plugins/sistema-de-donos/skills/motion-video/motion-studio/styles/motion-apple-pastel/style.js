// Estilo: motion-apple-pastel — motion Apple SEM a paleta preto/papel/laranja: fundo off-white, cinzas e tons pastel.
// Gramática = motion-apple (STYLE.md) + referência Base44 (styles/motion-apple/refs/ref-base44-pastel.mp4).
window.STYLE = {
  name: 'motion-apple-pastel',
  colors: { dark: '#1D1D1F', light: '#F2F1EF', accent: '#1ED760', contrast: '#86868B', card: '#FFFFFF' },
  pastel: { mint: '#BFEBD4', lilac: '#D9D2F5', peach: '#FBD9C9', sky: '#CFE3F7', butter: '#F6EBB5', rose: '#F7D3DF', gray: '#E4E2DF' },
  fonts: {
    display: 'Inter', mono: 'JetBrains Mono',
    css: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap',
    preload: ['600 80px "Inter"', '700 80px "Inter"', '800 80px "Inter"', '500 40px "Inter"', '700 30px "JetBrains Mono"'],
  },
  bg: {
    light: { blobs: [
      { x: 540, y: 1700, ax: 160, ay: 60, fx: 1, fy: 2, px: 1.5708, rx: 900, ry: 420, rgb: '200,196,192', a: .22 },
      { x: 200, y: 100, ax: 120, ay: 50, fx: 1, fy: 2, py: 1.5708, rx: 700, ry: 380, rgb: '255,255,255', a: .6 },
    ] },
    dark: { blobs: [] },
  },
  vignette: { amt: .08, rgb: '150,145,140', inner: .6, breathe: .02, cycles: 1 },
  transition: 'none',
  grain: .02,
  sfx: { transition: { name: 'whoosh', gain: .2, opts: { dur: .35, f0: 1200, f1: 6000, peak: .2 } } },
};
