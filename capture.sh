#!/usr/bin/env bash
# Capture script for OMGithub project - captures desktop and mobile views
set -euo pipefail

# Function to add timing to commands
run_with_timing() {
    /usr/bin/time -p "$@"
}

# Validate required environment variables
if [[ -z "${CAPTURE_URL:-}" ]]; then
    echo "CAPTURE_URL environment variable is required" >&2
    exit 1
fi

if [[ -z "${CAPTURE_DIR:-}" ]]; then
    echo "CAPTURE_DIR environment variable is required" >&2
    exit 1
fi

# Change to project directory
cd "$(dirname "$0")"

# Create capture directory
run_with_timing mkdir -p "$CAPTURE_DIR"

# Run the default capture script with environment variables
export CAPTURE_URL="$CAPTURE_URL"
export CAPTURE_DIR="$CAPTURE_DIR"

# Attempt capture with retries
try_count=0
max_attempts=3

capture_with_retry() {
    local attempt=$1
    
    echo "Capture attempt $attempt of $max_attempts..."
    
    if run_with_timing node "${RUNTIME_DIR:?}/scripts/default-capture.mjs" > "$CAPTURE_DIR/capture.log" 2>&1; then
        echo "Capture completed successfully."
        return 0
    else
        local exit_code=${PIPESTATUS[0]}
        echo "Capture failed with exit code $exit_code."
        return $exit_code
    fi
}

# Attempt capture with retries
capture_success=false
for attempt in $(seq 1 $max_attempts); do
    if capture_with_retry $attempt; then
        capture_success=true
        break
    fi
    
    if [[ $attempt -lt $max_attempts ]]; then
        echo "Retrying in 5 seconds..."
        sleep 5
    fi
done

if [[ "$capture_success" != true ]]; then
    echo "Capture failed after $max_attempts attempts." >&2
    exit 75
fi

# Verify screenshots were created
if [[ ! -f "$CAPTURE_DIR/final-desktop.png" ]]; then
    echo "Desktop screenshot was not created." >&2
    exit 1
fi

if [[ ! -f "$CAPTURE_DIR/final-mobile.png" ]]; then
    echo "Mobile screenshot was not created." >&2
    exit 1
fi

# Check screenshot file sizes
if [[ $(stat -f%z "$CAPTURE_DIR/final-desktop.png" 2>/dev/null || stat -c%s "$CAPTURE_DIR/final-desktop.png") -lt 1000 ]]; then
    echo "Desktop screenshot appears to be empty or corrupted." >&2
    exit 1
fi

if [[ $(stat -f%z "$CAPTURE_DIR/final-mobile.png" 2>/dev/null || stat -c%s "$CAPTURE_DIR/final-mobile.png") -lt 1000 ]]; then
    echo "Mobile screenshot appears to be empty or corrupted." >&2
    exit 1
fi

echo "Capture completed successfully:"
echo "  Desktop screenshot: $CAPTURE_DIR/final-desktop.png"
echo "  Mobile screenshot: $CAPTURE_DIR/final-mobile.png"

# Keep the app running (no exit)
while true; do
    sleep 3600
done