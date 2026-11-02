#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
: "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR outside the project for screenshot output.}"

case "$CAPTURE_URL" in
  http://*|https://*) ;;
  *) echo 'CAPTURE_URL must be an HTTP(S) URL.' >&2; exit 1 ;;
esac

RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
CAPTURE_HELPER="$RUNTIME_DIR/scripts/default-capture.mjs"
[[ -f "$CAPTURE_HELPER" ]] || { echo "Capture helper not found: $CAPTURE_HELPER" >&2; exit 1; }

# Normalize only the output path; the requested navigation URL is passed verbatim.
CAPTURE_DIR="$(realpath -m -- "$CAPTURE_DIR")"
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR/"*) echo 'CAPTURE_DIR must be outside the project source tree.' >&2; exit 1 ;;
esac

RUNNER_TEMP="${RUNNER_TEMP:-/home/runner/work/_temp}"
OMGITHUB_CAPTURE_WEB_DIR="${OMGITHUB_CAPTURE_WEB_DIR:-$RUNNER_TEMP/omgithub-capture-evidence}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
APP_URL="${APP_URL:-$CAPTURE_URL}"
export CAPTURE_URL CAPTURE_DIR RUNNER_TEMP OMGITHUB_CAPTURE_WEB_DIR OPENCODE_WEB_DIR APP_URL RUNTIME_DIR

printf 'Capturing exact URL: %s\n' "$CAPTURE_URL"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR" "$OMGITHUB_CAPTURE_WEB_DIR"
/usr/bin/time -p node "$CAPTURE_HELPER"

for image in final-desktop.png final-mobile.png; do
  [[ -s "$CAPTURE_DIR/$image" ]] || { echo "Capture did not produce $CAPTURE_DIR/$image" >&2; exit 1; }
done
