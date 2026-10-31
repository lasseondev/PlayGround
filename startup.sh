#!/usr/bin/env bash
set -euo pipefail

# Startup script for Tony Hawk Skate Park project
# Runs once-per-worker prerequisites

echo "🚀 Starting up Tony Hawk Skate Park project..."
echo "🕐 Startup time: $(date)"

echo "🔧 Setting up worker environment..."

# Create necessary directories
mkdir -p "/home/runner/work/_temp/omgithub-web"
mkdir -p "/home/runner/work/_temp/validation-*"

# Set up environment variables
export NODE_ENV="production"
export PROJECT_ROOT="/home/runner/work/PlayGround/PlayGround"

echo "📋 Project structure setup complete"
echo "✅ Worker prerequisites installed successfully"
echo "⏱️  Startup completed at $(date)"

# The actual project startup and serving is handled by start.sh
# This script only runs prerequisites
echo "⏸️  Startup complete. Use './start.sh' to start the application."
echo "🔄 This script runs only once per worker as requested."

# Keep script running if needed
# In most cases, this script exits quickly as it's for prerequisites only
if [ "${1:-}" = "--keep-alive" ]; then
    echo "🔄 Running with --keep-alive flag, keeping script alive..."
    while true; do
        sleep 300
    done
fi