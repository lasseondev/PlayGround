#!/usr/bin/env bash
capture_start_time=$(date +%s)
set -euo pipefail
cd "$(dirname "$0")"

# Default to localhost:3000 if no URL is provided
CAPTURE_URL="${CAPTURE_URL:-http://localhost:3000}"
CAPTURE_DIR="${CAPTURE_DIR:-/home/runner/work/_temp/validation}"

echo "Capture started at ${capture_start_time}"
echo "CAPTURE_URL: ${CAPTURE_URL}"
echo "CAPTURE_DIR: ${CAPTURE_DIR}"

# Create capture directory
mkdir -p "$CAPTURE_DIR"

# Install puppeteer if not available
if [ ! -d "node_modules/puppeteer" ]; then
    echo "Installing puppeteer..."
    npm install puppeteer --silent || {
        echo "Error: Failed to install puppeteer" >&2
        exit 75
    }
fi

# Check if project is running and accessible
project_start_time=$(date +%s)
for i in {1..30}; do
    if curl -s -f "${CAPTURE_URL}" > /dev/null; then
        echo "Project is accessible at ${CAPTURE_URL}"
        project_status_time=$(date +%s)
        break
    fi
    echo "Waiting for project to be accessible... ($i/30)"
    sleep 2
    
    if [ $i -eq 30 ]; then
        echo "Error: Project failed to become accessible within 60 seconds" >&2
        exit 75
    fi
done

# Run the Node.js capture script
echo "Running screen capture..."
if node capture.js; then
    capture_end_time=$(date +%s)
    total_duration=$((capture_end_time - capture_start_time))
    echo "Capture completed successfully at ${capture_end_time}"
    echo "Total capture duration: ${total_duration} seconds"
    echo "Screenshots saved to: ${CAPTURE_DIR}/"
    
    # Verify screenshots exist
    if [ ! -f "${CAPTURE_DIR}/final-desktop.png" ] || [ ! -f "${CAPTURE_DIR}/final-mobile.png" ]; then
        echo "Error: Required screenshot files were not created" >&2
        exit 1
    fi
    
    exit 0
else
    echo "Error: Screen capture script failed" >&2
    exit 1
fi