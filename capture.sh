#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node scripts/capture.mjs
