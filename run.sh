#!/bin/sh
# Calctutor — start the local study server and open it.
#   ./run.sh [port]        (default 8142)
cd "$(dirname "$0")" || exit 1
PORT=${1:-8142}

command -v open >/dev/null && (sleep 1; open "http://localhost:$PORT") &

echo "Calctutor running at http://localhost:$PORT   (ctrl-C to stop)"
exec python3 tools/serve.py "$PORT"
