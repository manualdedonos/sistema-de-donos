#!/bin/bash
# Extrai um trecho de vídeo para sequência JPG usada por FOOT()/footage().
#   tools/footage.sh <projeto> <nome> <video> [inicio_s] [dur_s] [fps=30]
# KEEP=1 mantém o aspecto original (vertical p/ cards/PiP)
# → projects/<projeto>/assets/<nome>/0001.jpg…  e imprime a contagem p/ project.js (footage: {nome: N})
set -e
cd "$(dirname "$0")/.."
D="projects/$1/assets/$2"; rm -rf "$D"; mkdir -p "$D"
if [ -n "$KEEP" ]; then VF="fps=${6:-30},scale=-2:1080"; else VF="fps=${6:-30},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"; fi
ffmpeg -v error -ss "${4:-0}" ${5:+-t $5} -i "$3" -vf "$VF" -q:v 3 "$D/%04d.jpg"
echo "$2: $(ls "$D" | wc -l | tr -d ' ')"
