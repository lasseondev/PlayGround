#!/usr/bin/env bash
set -euo pipefail

# Per-command timing start
echo "=== $(date): Starting capture.sh ==="

# Check for required environment variables
if [ -z "${CAPTURE_URL:-}" ]; then
    echo "=== $(date): ERROR: CAPTURE_URL environment variable is required ===" >&2
    exit 1
fi

if [ -z "${CAPTURE_DIR:-}" ]; then
    echo "=== $(date): ERROR: CAPTURE_DIR environment variable is required ===" >&2
    exit 1
fi

# Create capture directory
mkdir -p "$CAPTURE_DIR"
echo "=== $(date): Created capture directory: $CAPTURE_DIR ==="

# Open URL in browser (using headless Chrome for automation)
export BROWSER_PATH=${BROWSER_PATH:-chromium-browser}

echo "=== $(date): Launching browser to capture ${CAPTURE_URL} ==="

# Start browser and capture desktop view
 echo "=== $(date): Starting browser process ==="
$BROWSER_PATH --headless --disable-gpu --screenshot="$CAPTURE_DIR/final-desktop.png" "$CAPTURE_URL" 2>&1

if [ $? -ne 0 ]; then
    echo "=== $(date): ERROR: Failed to capture desktop view ===" >&2
    exit 75
fi

echo "=== $(date): Desktop view captured successfully ==="

# Close browser
echo "=== $(date): Browser process completed ==="

# Capture mobile view by simulating mobile viewport
echo "=== $(date): Capturing mobile view ==="
$BROWSER_PATH --headless --disable-gpu --window-size=375,667 --screenshot="$CAPTURE_DIR/final-mobile.png" "$CAPTURE_URL" 2>&1

if [ $? -ne 0 ]; then
    echo "=== $(date): ERROR: Failed to capture mobile view ===" >&2
    exit 1
fi

echo "=== $(date): Mobile view captured successfully ==="

# Verify that both screenshots were created
if [ ! -f "$CAPTURE_DIR/final-desktop.png" ]; then
    echo "=== $(date): ERROR: Desktop screenshot was not created ===" >&2
    exit 1
fi

if [ ! -f "$CAPTURE_DIR/final-mobile.png" ]; then
    echo "=== $(date): ERROR: Mobile screenshot was not created ===" >&2
    exit 1
fi

echo "=== $(date): Both screenshots verified ==="

# Keep the app running if needed (leave app running per requirements)
echo "=== $(date): Capture completed, keeping app running ==="

# Per-command timing end
echo "=== $(date): Capture.sh completed successfully ==="