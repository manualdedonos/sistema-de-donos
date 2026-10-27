# Detecção de ambiente compartilhada (macOS, Linux e Windows/Git Bash). Use: source tools/env.sh
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) OS=windows ;;
  Darwin) OS=mac ;;
  *) OS=linux ;;
esac
# ajustes locais desta máquina (não vão para o kit): ex. PY=/caminho/do/python
[ -f tools/local.env ] && source tools/local.env
# Python do sistema: python3 ou python (Windows costuma ter só "python"; ignora o atalho falso da Microsoft Store)
PYS=""
for c in python3 python; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)" >/dev/null 2>&1; then PYS="$c"; break; fi
done
# Python do kit (.venv): bin/ no Mac/Linux, Scripts/ no Windows
VENV_PY=""
for c in .venv/bin/python .venv/Scripts/python.exe .venv/Scripts/python; do [ -x "$c" ] && { VENV_PY="$c"; break; }; done
PY="${PY:-${VENV_PY:-$PYS}}"
# sobe o servidor local se não estiver rodando
start_server() {
  curl -s -o /dev/null "http://127.0.0.1:$1/engine/player.html" || { ("$PYS" tools/server.py "$1" >/dev/null 2>&1 &); sleep 1; }
}
