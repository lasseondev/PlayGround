#!/usr/bin/env bash
# Start script for OMGithub project - handles build and serve
set -euo pipefail

# Function to add timing to commands
run_with_timing() {
    /usr/bin/time -p "$@"
}

# Initialize project directory
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"
DIST_DIR="$PROJECT_DIR/dist"

# Create deployment output directory and write deployment output JSON
mkdir -p "/home/runner/work/_temp/omgithub-web"
run_with_timing /usr/bin/printf '%s' "{\"project\":\"$PROJECT_DIR\",\"directory\":\"$DIST_DIR\"}" > "/home/runner/work/_temp/omgithub-web/deployment-output.json"

# Change to project directory
cd "$(dirname "$0")"

# Check if we need to build (look for package.json or build system)
if [[ -f "package.json" ]]; then
    echo "Project has package.json - installing dependencies..."
    # Install dependencies using npm ci (clean install from lockfile)
    run_with_timing npm ci --no-audit --no-fund

    echo "Building project..."
    # Try to detect build system
    if [[ -f "package-lock.json" ]] || [[ -f "yarn.lock" ]]; then
        # Use npm run build if available, otherwise try vite
        if grep -q "\"scripts\"" package.json && grep -q "\"build\"" package.json; then
            run_with_timing npm run build
        else
            # Check if it's a vite project
            if grep -q "vite" package.json || grep -q "vite" package-lock.json 2>/dev/null; then
                run_with_timing npx vite build --base ./
            else
                # For other package projects, just copy index.html to dist
                echo "No supported build system detected. Copying static files to dist..."
                if [[ -f "index.html" ]]; then
                    cp -r index.html dist/
                fi
            fi
        fi
    fi

    # Create dist directory for static files if it doesn't exist
    mkdir -p dist
else
    # No package.json, just copy static files to dist
    echo "No package.json detected. Copying static files to dist..."
    if [[ -f "index.html" ]]; then
        cp -r index.html dist/
    fi
fi

# Serve the project on port 3000 in the foreground
# This script is intended to be run by the controller-owned tmux app-server
# The actual server startup logic is handled by the controller's start-project.sh

echo "Start script completed. Server startup should be handled by the controller."
echo "Project directory: $PROJECT_DIR"
echo "Dist directory: $DIST_DIR"
echo "Server ready to serve on port 3000"
echo "Deployment output written to /home/runner/work/_temp/omgithub-web/deployment-output.json"