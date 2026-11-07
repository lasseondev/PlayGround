#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
: "${CAPTURE_URL:?Set CAPTURE_URL to the exact page to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to an evidence directory outside the project.}"
RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
CAPTURE_HELPER="$RUNTIME_DIR/scripts/default-capture.mjs"
[[ -f "$CAPTURE_HELPER" ]] || { echo "Capture runtime not found: $CAPTURE_HELPER" >&2; exit 1; }
[[ "$CAPTURE_URL" =~ ^https?:// ]] || { echo 'CAPTURE_URL must be an HTTP(S) URL.' >&2; exit 1; }

# Keep evidence out of the source tree and avoid clicking the game control during
# capture: the initial hub is the intended rendered landing view.
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR/"*) echo 'CAPTURE_DIR must be outside the project source tree.' >&2; exit 1 ;;
esac
/usr/bin/time -p mkdir -p -- "$CAPTURE_DIR"
export CAPTURE_AUTO_START=false
export CAPTURE_STRICT=1
export CAPTURE_READY_SELECTOR='#hub:not(.hidden)'
/usr/bin/time -p node "$CAPTURE_HELPER"
