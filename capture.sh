#!/usr/bin/env bash
set -euo pipefail

# capture.sh - captures desktop and mobile views of the deployed app

# Validate required environment variables
if [[ -z "${CAPTURE_URL:-}" || -z "${CAPTURE_DIR:-}" ]]; then
    echo "ERROR: Both CAPTURE_URL and CAPTURE_DIR must be set"
    echo "CAPTURE_URL: ${CAPTURE_URL:-}"
    echo "CAPTURE_DIR: ${CAPTURE_DIR:-}"
    exit 1
fi

echo "=== Starting capture process ==="
echo "Capture URL: $CAPTURE_URL"
echo "Capture directory: $CAPTURE_DIR"
echo "Worker PID: $$
"

# Create capture directory
mkdir -p "$CAPTURE_DIR"
cd "$CAPTURE_DIR"

# Verify playwright is available
if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js is required for capture"
    exit 1
fi

# Run the capture script
start_time=$(date +%s)

/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs" || capture_exit=$?

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "=== Capture process completed in ${duration}s ==="
exit ${capture_exit:-0}