#!/bin/bash
# Instalação do motion-studio (rodar uma vez): bash tools/setup.sh
# Funciona no macOS, no Linux e no Windows (Git Bash, que já vem com o Claude Code no Windows).
# Verifica Node, FFmpeg e Python 3; cria .venv com numpy/scipy; instala o Puppeteer (Chromium headless);
# e faz um render de teste (preview do projeto "exemplo").
set -e
cd "$(dirname "$0")/.."
source tools/env.sh
ok() { printf "  ✓ %s\n" "$1"; }
falta() { printf "  ✗ %s — instale com:  %s\n" "$1" "$2"; FALTOU=1; }
case $OS in
  mac)     H_NODE="brew install node";  H_FF="brew install ffmpeg";  H_PY="brew install python" ;;
  windows) H_NODE="winget install OpenJS.NodeJS.LTS"; H_FF="winget install Gyan.FFmpeg"; H_PY="winget install Python.Python.3.12" ;;
  *)       H_NODE="sudo apt install nodejs npm"; H_FF="sudo apt install ffmpeg"; H_PY="sudo apt install python3 python3-venv" ;;
esac

echo "Sistema: $OS — verificando dependências…"
command -v node   >/dev/null && ok "Node $(node -v)" || falta "Node.js" "$H_NODE"
command -v ffmpeg >/dev/null && ok "FFmpeg"          || falta "FFmpeg"  "$H_FF"
[ -n "$PYS" ]                && ok "Python ($PYS)"   || falta "Python 3" "$H_PY"
if [ -n "$FALTOU" ]; then
  echo "Instale o que falta, feche e abra o terminal (ou o Claude Code) e rode de novo."
  [ $OS = windows ] && echo "No Windows, depois do winget é preciso reabrir o terminal para o PATH atualizar."
  exit 1
fi

echo "Instalando bibliotecas…"
[ -n "$VENV_PY" ] || "$PYS" -m venv .venv
source tools/env.sh   # redetecta o Python da .venv recém-criada
"$VENV_PY" -m pip install -q --upgrade pip numpy scipy && ok "numpy + scipy (.venv)"
npm install --no-fund --no-audit --silent && ok "Puppeteer + Chromium headless"
chmod +x tools/*.sh 2>/dev/null || true

echo "Teste de render…"
bash tools/render.sh exemplo preview >/dev/null && ok "render funcionando → projects/exemplo/out/preview.jpg"
[ $OS != mac ] && echo "  obs.: no $OS o recorte de fundo (cutout.swift) e o render em blocos ficam indisponíveis; o resto funciona igual."
echo "Pronto! Peça ao Claude: \"faz um vídeo em motion…\""
