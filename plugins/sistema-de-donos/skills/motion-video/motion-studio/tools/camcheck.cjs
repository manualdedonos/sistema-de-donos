// Mede a suavidade da câmera (CAM + camAt em scenes.js): aceleração máx do zoom (log) e do foco.
// Regra "câmera em onda": zoom ≲ 3 e foco ≲ 1500 px/s². uso: node tools/camcheck.cjs projects/<p>/scenes.js [...]
const fs = require('fs');
let src;
function load(p) {
  src = fs.readFileSync(p, 'utf8');
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t;
  const m = src.match(/camPath\(\s*CAM\s*(?:,\s*(\{[^}]*\}))?\s*\)/);
  if (m) {   // projeto usa a câmera da engine: camPath(CAM, {...})
    const eng = fs.readFileSync(require('path').join(__dirname, '../engine/engine.core.js'), 'utf8');
    eval(eng.slice(eng.indexOf('function camPath'), eng.indexOf('function applyCamPath')));
    const a = src.indexOf('const CAM = ['), CAM = eval(src.slice(a + 12, src.indexOf('];', a) + 1));
    return camPath(CAM, m[1] ? eval('(' + m[1] + ')') : {});
  }
  const a = src.indexOf('const CAM = ['), b = src.indexOf('function applyCam');   // projetos antigos: câmera local
  if (a < 0 || b < 0) throw new Error('scenes.js sem CAM (camPath ou applyCam): ' + p);
  let camAt; eval(src.slice(a, b).replace(/function camAt/, 'camAt = function')); return camAt;
}
for (const p of process.argv.slice(2)) {
  const c = load(p), dt = 1 / 120; let mz = 0, mp = 0, tz = 0, peak = 0;
  const T1 = (eval(src.slice(src.indexOf('const CAM = [') + 12, src.indexOf('];', src.indexOf('const CAM = [')) + 1)).slice(-1)[0][0]) - .65;
  for (let t = .05; t < T1; t += dt) {
    const a = c(t - dt), b = c(t), d = c(t + dt);
    const az = Math.abs(Math.log(d[0]) - 2 * Math.log(b[0]) + Math.log(a[0])) / dt / dt;
    const ap = Math.hypot(d[1] - 2 * b[1] + a[1], d[2] - 2 * b[2] + a[2]) / dt / dt;
    if (az > mz) { mz = az; tz = t; } mp = Math.max(mp, ap); peak = Math.max(peak, b[0]);
  }
  const ok = mz <= 3 && mp <= 1500;
  let still = 0, run = 0; for (let t = .05; t < T1; t += dt) { const a = c(t), b = c(t + dt); if (a[0] === b[0] && a[1] === b[1] && a[2] === b[2]) { run += dt; still = Math.max(still, run); } else run = 0; }
  if (still > .3) console.log(`  ⚠ câmera CONGELADA por ${still.toFixed(1)}s (tabela não cobre o vídeo?)`);
  console.log(`${p.split('/').slice(-2).join('/')}: acel. zoom ${mz.toFixed(1)} (${tz.toFixed(2)}s) · foco ${mp.toFixed(0)} px/s² · zoom máx ${peak.toFixed(2)} → ${ok ? 'suave ✓' : 'AGUDO — suavizar'}`);
}
