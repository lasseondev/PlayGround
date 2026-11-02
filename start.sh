#!/usr/bin/env bash
set -euo pipefail

# Project configuration
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"
DIST_DIR="${PROJECT_DIR}/dist"
DEPLOYMENT_OUTPUT="/home/runner/work/_temp/omgithub-web/deployment-output.json"

# Change to project directory
cd "${PROJECT_DIR}"

# Install dependencies if package.json exists and node_modules is missing or outdated
if [[ -f "package.json" ]]; then
    echo "📦 Checking dependencies..."
    
    # Check if node_modules exists and is up to date with package.json
    if [[ ! -d "node_modules" ]] || [[ ! -f "node_modules/.updated" ]]; then
        echo "🔄 Installing dependencies..."
        npm install --no-audit --no-fund
        
        # Create marker file to indicate dependencies have been installed
        mkdir -p node_modules
        date +%s > node_modules/.updated
    else
        echo "✅ Dependencies already installed and up to date."
    fi

    # Build if dist directory doesn't exist or is outdated
    if [[ ! -d "${DIST_DIR}" ]] || [[ ! -f "${DIST_DIR}/.updated" ]] || [[ package.json -nt "${DIST_DIR}/.updated" ]]; then
        echo "🏗️ Building project..."
        npm run build
        
        # Create dist directory if it doesn't exist
        mkdir -p "${DIST_DIR}"
        
        # Update dist timestamp
        date +%s > "${DIST_DIR}/.updated"
    else
        echo "✅ Build already exists and is up to date."
    fi
else
    echo "⚠️  package.json not found, skipping dependency installation."
fi

# Write deployment output
mkdir -p "$(dirname "$DEPLOYMENT_OUTPUT")"
cat > "$DEPLOYMENT_OUTPUT" << EOF
{
    "project": "$PROJECT_DIR",
    "directory": "$DIST_DIR"
}
EOF

echo "✅ Deployment output written to ${DEPLOYMENT_OUTPUT}"

# Serve the built application
if [[ -d "${DIST_DIR}" ]]; then
    echo "🚀 Starting server on PORT ${PORT:-3000}..."
    # Use node to serve the static files
    if command -v node >/dev/null 2>&1; then
        node "${RUNTIME_DIR:?}/scripts/default-start.mjs"
    else
        echo "❌ Node.js not found. Please install Node.js to run the project."
        exit 1
    fi
else
    echo "❌ Build directory ${DIST_DIR} not found. Build may have failed."
    exit 1
fi