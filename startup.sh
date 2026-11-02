#!/usr/bin/env bash
set -euo pipefail

# Project startup configuration
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"

# Change to project directory
cd "${PROJECT_DIR}"

# Check for build system requirements
if [[ -f "package.json" ]]; then
    echo "📦 Checking project dependencies..."
    
    # Verify Node.js is available
    if ! command -v node >/dev/null 2>&1; then
        echo "❌ Error: Node.js is required but not found"
        echo "Please install Node.js to run this project"
        exit 1
    fi
    
    # Verify npm is available
    if ! command -v npm >/dev/null 2>&1; then
        echo "❌ Error: npm is required but not found"
        echo "Please install npm to run this project"
        exit 1
    fi
    
    echo "✅ Node.js and npm are available"
    echo "📋 Project scripts:"
    grep -A5 '"scripts"' package.json || echo "   No scripts defined in package.json"
else
    echo "⚠️  package.json not found - using static HTML mode"
fi

# Check for runtime environment
if [[ -z "${RUNTIME_DIR:-}" ]]; then
    echo "⚠️  RUNTIME_DIR not set - using default path"
    RUNTIME_DIR="/home/runner/work/_temp/omgithub-runtime"
fi

if [[ ! -d "${RUNTIME_DIR}/scripts" ]]; then
    echo "❌ Error: RUNTIME_DIR scripts not found at ${RUNTIME_DIR}/scripts"
    exit 1
fi

echo "✅ Runtime environment ready"

echo "🎮 Project startup complete!"
echo "📁 Project directory: ${PROJECT_DIR}"
echo "🔧 Runtime directory: ${RUNTIME_DIR}"
echo "🚀 Ready to start the application"