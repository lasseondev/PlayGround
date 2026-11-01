#!/usr/bin/env bash
set -euo pipefail

# Record the absolute path of the project directory
PROJECT_DIR="$(pwd)"

# Record capture start time for timing metrics
CAPTURE_START_TIME="$(date +%s.%N)"

# Log capture start
echo "[capture] Starting capture at $CAPTURE_START_TIME"

# Check for required environment variables
if [ -z "$CAPTURE_URL" ]; then
    echo "[error] CAPTURE_URL environment variable is required" >&2
    exit 75
fi

if [ -z "$CAPTURE_DIR" ]; then
    echo "[error] CAPTURE_DIR environment variable is required" >&2
    exit 75
fi

# Create capture directory
CAPTURE_PREPARATION_START="$(date +%s.%N)"
mkdir -p "$CAPTURE_DIR"
CAPTURE_PREPARATION_DURATION="$(echo "$(date +%s.%N) - $CAPTURE_PREPARATION_START" | bc)"
echo "[timing] Capture preparation (directory setup): ${CAPTURE_PREPARATION_DURATION}s"

# Log capture information
echo "[capture] URL: $CAPTURE_URL"
echo "[capture] Capture directory: $CAPTURE_DIR"

# Open the URL in browser and capture screenshots
CAPTURE_EXECUTION_START="$(date +%s.%N)"
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
CAPTURE_RESULT=$?
CAPTURE_EXECUTION_DURATION="$(echo "$(date +%s.%N) - $CAPTURE_EXECUTION_START" | bc)"
echo "[timing] Capture execution (browser automation): ${CAPTURE_EXECUTION_DURATION}s"

# Calculate total capture time
CAPTURE_END_TIME="$(date +%s.%N)"
CAPTURE_TOTAL_DURATION="$(echo "$CAPTURE_END_TIME - $CAPTURE_START_TIME" | bc)"
echo "[timing] Total capture completed in ${CAPTURE_TOTAL_DURATION}s"

# Check if capture was successful
if [ $CAPTURE_RESULT -ne 0 ]; then
    echo "[error] Screenshot capture failed with exit code $CAPTURE_RESULT" >&2
    exit 1
fi

# Verify that screenshots were created
if [ ! -f "$CAPTURE_DIR/final-desktop.png" ] || [ ! -f "$CAPTURE_DIR/final-mobile.png" ]; then
    echo "[error] Screenshot capture failed - expected files not found" >&2
    echo "[error] Desktop screenshot found: $([ -f "$CAPTURE_DIR/final-desktop.png" ] && echo 'YES' || echo 'NO')"
    echo "[error] Mobile screenshot found: $([ -f "$CAPTURE_DIR/final-mobile.png" ] && echo 'YES' || echo 'NO')"
    exit 1
fi

# Log success
echo "[capture] Screenshot capture completed successfully"
echo "[capture] Desktop screenshot: $CAPTURE_DIR/final-desktop.png"
echo "[capture] Mobile screenshot: $CAPTURE_DIR/final-mobile.png"

# Calculate preparation time
CAPTURE_PREP_DURATION="$(echo "$CAPTURE_PREPARATION_START - $CAPTURE_START_TIME" | bc)"

# Log timing metrics
echo "[timing] Capture preparation: ${CAPTURE_PREP_DURATION}s"
echo "[timing] Capture execution: ${CAPTURE_EXECUTION_DURATION}s"
echo "[timing] Total capture: ${CAPTURE_TOTAL_DURATION}s"

# Keep app running and wait
echo "[capture] Capture completed successfully. App is running. Use Ctrl+C to stop."
wait