#!/bin/bash
# Pipeline em UM comando.
#   bash tools/render.sh <projeto> preview   → storyboard barato (1 frame a cada 30, 1/3 da resolução) → out/preview.jpg
#   bash tools/render.sh <projeto> board     → storyboard numa imagem (quadros-chave de BOARD) → out/board.png
#   bash tools/render.sh <projeto>           → render final EM LOTES (tools/render_chunks.sh) → MP4 → sons → mix → checagem
#   bash tools/render.sh <projeto> audio     → só refaz sons/mix sobre o vídeo já renderizado (segundos)
#   DIRECT=1 bash tools/render.sh <projeto>  → render direto, sem lotes (só para vídeos curtos e máquina folgada)
set -e
STUDIO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$STUDIO"
source tools/env.sh
PROJ="projects/$1"; MODE="${2:-full}"; PORT=8777
[ -f "$PROJ/project.js" ] || { echo "projeto não encontrado: $PROJ"; exit 1; }
read FPS FRAMES < <(node -e "global.window={};eval(require('fs').readFileSync('$PROJ/project.js','utf8'));console.log(window.PROJECT.fps||60, window.PROJECT.frames)")
OUT="$PROJ/out"; mkdir -p "$OUT"
start_server $PORT

if [ "$MODE" = "board" ]; then
  node tools/render.mjs "$PROJ" board $PORT && echo "storyboard: $OUT/board.png"; exit 0
fi
if [ "$MODE" = "preview" ]; then
  rm -rf "$OUT/preview"
  node tools/render.mjs "$PROJ" preview $PORT
  # lista em vez de glob (o FFmpeg do Windows não aceita *.png); nomes relativos à própria lista
  (cd "$OUT/preview" && for f in *.png; do echo "file '$f'"; done > list.txt)
  ffmpeg -v error -y -f concat -safe 0 -i "$OUT/preview/list.txt" -vf "scale=480:-1,tile=6x$(( ($(ls "$OUT/preview"/*.png | wc -l) + 5) / 6 ))" -frames:v 1 "$OUT/preview.jpg"
  echo "preview: $OUT/preview.jpg (cada quadro = 30 frames)"
  exit 0
fi

if [ "$MODE" = "full" ] && [ -z "$DIRECT" ]; then
  exec bash tools/render_chunks.sh "$1"          # padrão: lotes (render inteiro já derrubou a máquina)
fi
if [ "$MODE" = "full" ]; then
  find "$OUT/frames" -type f -delete 2>/dev/null || true; rm -rf "$OUT/frames"
  node tools/render.mjs "$PROJ" full $PORT
  ffmpeg -v error -y -framerate "$FPS" -i "$OUT/frames/%04d.png" -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -movflags +faststart "$OUT/video.mp4"
fi

if [ "$MODE" = "audio" ]; then   # sons mudaram sem re-render: regrava out/sfx.json
  if grep -q "^const TIMEMAP" "$PROJ/scenes.js" 2>/dev/null; then
    # com régua de tempo (narração) o sfx.json precisa do export do player (aplica TIMEMAP): renderiza só 1 quadro
    FROM=0 TO=0 node tools/render.mjs "$PROJ" full $PORT >/dev/null && rm -f "$OUT/frames/0000.png"
  else
    node tools/sfxjson.cjs "$PROJ"
  fi
fi
"$PY" engine/sfx.py "$PROJ" "$FPS" "$FRAMES"
LUFS=$(node -e "try{console.log(require('./$PROJ/audio.json').loudness??-14)}catch(e){console.log(-14)}")
ffmpeg -v error -y -i "$OUT/video.mp4" -i "$OUT/mix.wav" -map 0:v -map 1:a -c:v copy -af "loudnorm=I=$LUFS:TP=-1.0:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/final.mp4"
"$PY" tools/check.py "$OUT/video.mp4" "$OUT"
echo "pronto: $OUT/final.mp4 (sem som: $OUT/video.mp4)"
