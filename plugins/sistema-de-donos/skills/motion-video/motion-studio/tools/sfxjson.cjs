// Regrava out/sfx.json direto do array SFX do scenes.js (sem renderizar quadros) → permite "render.sh <p> audio" após mudar só os sons.
// Suporta F(seg) e FPS. Não aplica TIMEMAP (projetos com narração continuam usando o export normal).
const fs = require('fs'), path = require('path');
const dir = process.argv[2], src = fs.readFileSync(path.join(dir, 'scenes.js'), 'utf8');
global.window = {}; eval(fs.readFileSync(path.join(dir, 'project.js'), 'utf8'));
const FPS = window.PROJECT.fps || 60, F = s => Math.round(s * FPS);
const a = src.indexOf('const SFX = ['); if (a < 0) { console.log('sem SFX'); process.exit(0); }
let depth = 0, b = a + 'const SFX = '.length;
for (; b < src.length; b++) { if (src[b] === '[') depth++; if (src[b] === ']' && --depth === 0) break; }
const SFX = eval(src.slice(a + 'const SFX = '.length, b + 1));
if (/TIMEMAP\s*=/.test(src)) { console.log('TIMEMAP presente: use o export normal'); process.exit(0); }
const list = SFX.map(e => Array.isArray(e) ? { name: e[0], frame: e[1], gain: e[2] ?? 1, pan: e[3] ?? 0, ...(e[4] || {}) } : e).sort((x, y) => x.frame - y.frame);
fs.writeFileSync(path.join(dir, 'out', 'sfx.json'), JSON.stringify(list, null, 1));
console.log('sfx.json: ' + list.length + ' eventos');
