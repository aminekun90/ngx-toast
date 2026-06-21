#!/usr/bin/env bash
#
# Runs both demo apps (Angular + React) side by side with hot reload.
#
#   ./run-demos.sh          # start both demos
#   ./run-demos.sh angular  # start only the Angular demo
#   ./run-demos.sh react    # start only the React demo
#
# Angular demo: http://localhost:4200
# React demo:   http://localhost:5173
#
set -euo pipefail

cd "$(dirname "$0")"

ANGULAR_PORT=4200
REACT_PORT=5173
TARGET="${1:-both}"

# Keep the generated shared core in sync before serving.
echo "🔄 Syncing shared core…"
node ./sync-core.js

pids=()
cleanup() {
  echo ""
  echo "🛑 Stopping demos…"
  for pid in "${pids[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
}
trap cleanup EXIT INT TERM

start_angular() {
  echo "🅰️  Angular demo → http://localhost:${ANGULAR_PORT}"
  yarn ng serve demo-app --port "${ANGULAR_PORT}" &
  pids+=("$!")
}

start_react() {
  echo "⚛️  React demo → http://localhost:${REACT_PORT}"
  yarn workspace demo-react dev --port "${REACT_PORT}" --strictPort &
  pids+=("$!")
}

case "${TARGET}" in
  angular) start_angular ;;
  react)   start_react ;;
  both)    start_angular; start_react ;;
  *)
    echo "Unknown target '${TARGET}'. Use: angular | react | both" >&2
    exit 1
    ;;
esac

echo "✅ Demos starting. Press Ctrl+C to stop."
wait
