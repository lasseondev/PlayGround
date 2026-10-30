#!/usr/bin/env bash
# Capture the exact preview URL at desktop and mobile widths.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
PROJECT_DIR="$(pwd)"

: "${CAPTURE_URL:?Set CAPTURE_URL to the preview URL}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to an output directory outside the project}"

case "$CAPTURE_DIR" in
  "$PROJECT_DIR"|"$PROJECT_DIR"/*)
    echo 'CAPTURE_DIR must be outside the project source tree.' >&2
    exit 1
    ;;
esac

/usr/bin/time -p test -f "$PROJECT_DIR/capture.mjs"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

# The game is a canvas with no start button. The helper waits for the canvas
# and verifies that the running game has drawn visible content.
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-#game}"

/usr/bin/time -p node "$PROJECT_DIR/capture.mjs"
