#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"
: "${RUNTIME_DIR:?RUNTIME_DIR is required}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

status=0
/usr/bin/time -p node "$RUNTIME_DIR/scripts/default-capture.mjs" || status=$?
if (( status != 0 )); then
  exit "$status"
fi

for name in final-desktop.png final-mobile.png; do
  if [[ ! -s "$CAPTURE_DIR/$name" ]]; then
    printf 'Capture did not produce %s\n' "$name" >&2
    exit 1
  fi
done
