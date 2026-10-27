// Estilo: motion-apple — UI "Apple widgets" (objetos que se transformam, mão-cursor, blob colorido que vaza do card)
// com a paleta própria (preto/papel/laranja, Inter Tight). Gramática em STYLE.md.
window.STYLE = {
  name: 'motion-apple',
  colors: { dark: '#0A0A0A', light: '#F5F3EE', accent: '#FF4D00', contrast: '#2340C8', card: '#141414' },
  fonts: {
    display: 'Inter Tight', mono: 'JetBrains Mono',
    css: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800&family=JetBrains+Mono:wght@400;700&display=swap',
    preload: ['600 80px "Inter Tight"', '800 80px "Inter Tight"', '500 40px "Inter Tight"', '700 30px "JetBrains Mono"'],
  },
  // Base é o PAPEL (claro), quase chapado; cor só entra como blob atrás do card em foco.
  bg: {
    light: { blobs: [
      { x: 960, y: 1150, ax: 220, ay: 60, fx: 1, fy: 2, px: 1.5708, rx: 1100, ry: 380, rgb: '255,77,0', a: .14 },
      { x: 300, y: -60, ax: 140, ay: 50, fx: 1, fy: 2, py: 1.5708, rx: 700, ry: 300, rgb: '35,64,200', a: .06 },
    ] },
    dark: { blobs: [
      { x: 960, y: 1100, ax: 200, ay: 70, fx: 1, fy: 2, py: 1.5708, rx: 1000, ry: 420, rgb: '255,77,0', a: .45 },
      { x: 960, y: 540, ax: 240, ay: 100, fx: 2, fy: 1, px: 1, rx: 600, ry: 360, rgb: '35,64,200', a: .14 },
    ] },
  },
  vignette: { amt: .10, rgb: '120,110,100', inner: .55, breathe: .03, cycles: 1 },
  transition: 'none',
  grain: .03,
  sfx: { transition: { name: 'whoosh', gain: .25, opts: { dur: .35, f0: 1200, f1: 6000, peak: .2 } } },
};
