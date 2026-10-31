#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0)"

# Per-command timing wrapper
timing() {
    echo "START: $(date +%s.%N)"
    "$@"
    echo "END: $(date +%s.%N)"
}

# Validate required environment variables
if [[ -z "${CAPTURE_URL:-}" || -z "${CAPTURE_DIR:-}" ]]; then
    echo "ERROR: CAPTURE_URL and CAPTURE_DIR environment variables are required" >&2
    exit 1
fi

# Create capture directory
timing mkdir -p "$CAPTURE_DIR"

# Execute capture using runtime script
timing /usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
