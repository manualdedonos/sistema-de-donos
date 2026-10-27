#!/bin/bash
# Render em LOTES (padrão para TODO render final): cada lote → PNGs → MP4 do lote → apaga PNGs → no fim junta e mixa o áudio.
# Vigia DISCO (SSD do projeto e disco interno) e RAM (macOS); mata Chromes órfãos de renders anteriores; retoma de onde parou.
# uso: bash tools/render_chunks.sh <projeto> [lote=120] [inicio=auto]
#   inicio=auto → pula os lotes que já têm MP4 em out/chunks (retomar depois de queda/pausa)
#   MIN_SSD_MB (2048) · MIN_INT_MB (1024) · MIN_RAM_MB (1024) ajustáveis por variável de ambiente
set -e
cd "$(dirname "$0")/.."
source tools/env.sh
NAME=$1; CH=${2:-120}; START=${3:-auto}; PROJ=projects/$NAME; OUT=$PROJ/out; PORT=8777
[ -f "$PROJ/project.js" ] || { echo "uso: bash tools/render_chunks.sh <projeto> [lote] [inicio]"; exit 1; }
MIN_SSD_MB=${MIN_SSD_MB:-2048}; MIN_INT_MB=${MIN_INT_MB:-1024}; MIN_RAM_MB=${MIN_RAM_MB:-1024}

# projetos montados a partir de partes (scenes.src.js) → gera o scenes.js antes
if [ -f "$PROJ/scenes.src.js" ]; then
  if [ -f "$PROJ/data.js" ]; then cat "$PROJ/data.js" "$PROJ/scenes.src.js" > "$PROJ/scenes.js"; else node tools/build.cjs "$PROJ"; fi
fi
read FPS FRAMES < <(node -e "global.window={};eval(require('fs').readFileSync('$PROJ/project.js','utf8'));console.log(window.PROJECT.fps||60, window.PROJECT.frames)")
export TMPDIR="$PWD/.tmp"; mkdir -p "$TMPDIR" "$OUT/chunks"          # Chrome usa a pasta do estúdio, não o disco interno

free_mb() { df -m "$1" | awk 'NR==2{print $4}'; }
ram_mb() {   # RAM disponível (macOS); em outros sistemas não vigia
  if command -v vm_stat >/dev/null 2>&1; then
    vm_stat | awk '/page size/{ps=$8} /Pages free/{f=$3} /Pages inactive/{i=$3} /Pages speculative/{s=$3} /Pages purgeable/{p=$3} END{printf "%d", (f+i+s+p)*ps/1048576}'
  else echo 999999; fi
}

# checklist antes de começar: Chromes órfãos de renders mortos comem RAM
pkill -f "Google Chrome for Testing" 2>/dev/null || true
pkill -f "chrome-headless-shell" 2>/dev/null || true
command -v memory_pressure >/dev/null 2>&1 && memory_pressure | grep -i "free percentage" || true
echo "disco: projeto $(free_mb "$PWD") MB · interno $(free_mb /) MB · RAM $(ram_mb) MB"
start_server $PORT

END=${END:-$FRAMES}
[ "$START" = "auto" ] && START=0
for ((a=START; a<END; a+=CH)); do
  b=$((a+CH)); [ $b -gt $END ] && b=$END
  chunk="$OUT/chunks/$(printf %05d $a).mp4"
  [ -s "$chunk" ] && { echo "lote $a–$((b-1)) já existe, pulando"; continue; }
  s=$(free_mb "$PWD"); i=$(free_mb /)
  if [ "$s" -lt "$MIN_SSD_MB" ] || [ "$i" -lt "$MIN_INT_MB" ]; then
    echo "PAUSA: pouco espaço (projeto ${s}MB, interno ${i}MB). Libere espaço e retome com: bash $0 $NAME $CH"; exit 2; fi
  w=0; while [ "$(ram_mb)" -lt "$MIN_RAM_MB" ]; do
    [ $w -ge 18 ] && { echo "PAUSA: RAM baixa ($(ram_mb)MB). Feche programas e retome com: bash $0 $NAME $CH"; exit 3; }
    echo "RAM baixa ($(ram_mb)MB), aguardando…"; sleep 10; w=$((w+1)); done
  tries=0
  while :; do
    rm -rf "$OUT/frames"; mkdir -p "$OUT/frames"
    if FROM=$a TO=$((b-1)) node tools/render.mjs "$PROJ" full $PORT > /dev/null 2>&1; then break; fi
    tries=$((tries+1)); pkill -f "Google Chrome for Testing" 2>/dev/null || true
    [ $tries -ge 3 ] && { echo "falha no lote $a (3 tentativas). Retome com: bash $0 $NAME $CH"; exit 1; }
    echo "lote $a falhou, tentando de novo ($tries/3)…"; sleep 5
  done
  ffmpeg -v error -y -framerate "$FPS" -start_number $a -i "$OUT/frames/%04d.png" -frames:v $((b-a)) \
    -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p "$chunk"
  rm -rf "$OUT/frames" "$TMPDIR"/puppeteer_dev_* 2>/dev/null || true
  echo "lote $a–$((b-1)) ok · projeto ${s}MB · interno ${i}MB · RAM $(ram_mb)MB"
done
(cd "$OUT/chunks" && ls *.mp4 | sed "s|^|file '|;s|$|'|" > list.txt)
ffmpeg -v error -y -f concat -safe 0 -i "$OUT/chunks/list.txt" -c copy -movflags +faststart "$OUT/video.mp4"
bash tools/render.sh "$NAME" audio
rm -rf "$OUT/chunks"   # vídeo final montado: lotes não são mais necessários
