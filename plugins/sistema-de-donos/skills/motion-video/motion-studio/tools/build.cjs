// Monta projects/<p>/scenes.js = WORDS (words.json) + kit do estilo + scenes.src.js (conteúdo do vídeo).
// O SFX é gerado por sfxGen() (âncoras na fala) e gravado como array LITERAL (tools/sfxjson.cjs lê literal).
// uso: node tools/build.cjs projects/<p>
const fs = require('fs'), path = require('path');
const studio = path.resolve(__dirname, '..'), dir = path.resolve(studio, process.argv[2] || '.');
global.window = {}; eval(fs.readFileSync(path.join(dir, 'project.js'), 'utf8'));
const P = window.PROJECT; eval(fs.readFileSync(path.join(studio, 'styles', P.style, 'style.js'), 'utf8'));
const kitPath = path.join(studio, 'styles', P.style, 'kit.js');
const kit = fs.existsSync(kitPath) ? fs.readFileSync(kitPath, 'utf8') : '';
const words = fs.readFileSync(path.join(dir, 'words.json'), 'utf8'), src = fs.readFileSync(path.join(dir, 'scenes.src.js'), 'utf8');
Object.assign(global, { S: window.STYLE, WORDS: JSON.parse(words), __SFX__: [], W: P.w, H: P.h, FPS: P.fps, N: P.frames, TAU: Math.PI * 2 });
let sfx = [];
try { sfx = eval(kit + '\n' + src + '\n;typeof sfxGen === "function" ? sfxGen() : []'); }
catch (e) { console.error('ERRO no scenes.src.js/kit: ' + e.message); process.exit(1); }
const out = 'window.WORDS=' + words.trim() + ';\nconst WORDS = window.WORDS;\n' + kit + '\n' +
  src.replace('const SFX = __SFX__;', 'const SFX = [' + sfx.map(e => JSON.stringify(e)).join(',\n  ') + '];');
fs.writeFileSync(path.join(dir, 'scenes.js'), out);
console.log('scenes.js ok · ' + sfx.length + ' sfx');
