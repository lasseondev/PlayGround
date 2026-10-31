#!/usr/bin/env bash
set -euo pipefail

# Per-command timing start
echo "=== $(date): Starting startup.sh for once-per-worker prerequisites ==="

# Check if we need to install any global dependencies
if command -v npm >/dev/null 2>&1; then
    echo "=== $(date): npm is available ==="
fi

if command -v pip >/dev/null 2>&1; then
    echo "=== $(date): pip is available ==="
fi

if command -v python3 >/dev/null 2>&1; then
    echo "=== $(date): python3 is available ==="
fi

if command -v cargo >/dev/null 2>&1; then
    echo "=== $(date): cargo is available ==="
fi

# Check for required system packages
REQUIRED_COMMANDS=(curl node python3 chromium-browser)
MISSING_COMMANDS=()

for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if ! command -v $cmd >/dev/null 2>&1; then
        MISSING_COMMANDS+=($cmd)
    fi
done

if [ ${#MISSING_COMMANDS[@]} -gt 0 ]; then
    echo "=== $(date): WARNING: Missing commands: ${MISSING_COMMANDS[*]} ==="
    echo "=== $(date): This may affect startup or capture functionality ==="
fi

# Create temporary directories for evidence and metadata
mkdir -p /home/runner/work/_temp/omgithub-web
mkdir -p /home/runner/work/_temp/omgithub-runtime

echo "=== $(date): Created temporary directories ==="

# Set up environment variables for the project
export PROJECT_DIR="$(pwd)"
echo "=== $(date): PROJECT_DIR set to: ${PROJECT_DIR} ==="

# Verify workspace structure
if [ ! -d "${PROJECT_DIR}" ]; then
    echo "=== $(date): ERROR: Project directory ${PROJECT_DIR} does not exist ===" >&2
    exit 1
fi

echo "=== $(date): Workspace structure verified ==="

# Per-command timing end
echo "=== $(date): Startup.sh completed successfully ==="