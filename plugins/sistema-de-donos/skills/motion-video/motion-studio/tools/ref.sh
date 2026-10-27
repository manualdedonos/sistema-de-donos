#!/bin/bash
# Prepara um vídeo de referência para análise barata: 1–2 grades de frames + cortes detectados.
# uso: tools/ref.sh <video> <saida_dir> [fps=4]
set -e
SRC="$1"; OUT="$2"; FPS="${3:-4}"
mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$SRC" | grep -v '^stream|$'
ffmpeg -v error -y -i "$SRC" -vf "fps=$FPS,scale=240:-1,tile=8x5" "$OUT/sheet_%02d.png"
echo "cortes (scene>0.3):"
ffmpeg -i "$SRC" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 | tr '\n' ' '; echo
ls "$OUT"/sheet_*.png
