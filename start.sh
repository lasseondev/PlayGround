#!/usr/bin/env bash
set -euo pipefail

# Record the absolute path of the project directory
PROJECT_DIR="$(pwd)"

# Set default port
PORT="${PORT:-3000}"

# Record start time for timing metrics
START_TIME="$(date +%s.%N)"

# Log the startup process
echo "[startup] Starting project in $PROJECT_DIR at $START_TIME"

# Change to the project directory
cd "$PROJECT_DIR"

# Check if build directory exists and contains necessary files
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "[startup] Building project..."
    
    # Record installation time
    INSTALL_START="$(date +%s.%N)"
    
    # Install dependencies
    /usr/bin/time -p npm install
    INSTALL_DURATION="$(echo "$(date +%s.%N) - $INSTALL_START" | bc)"
    echo "[timing] npm install completed in ${INSTALL_DURATION}s"
    
    # Build the project
    BUILD_START="$(date +%s.%N)"
    /usr/bin/time -p npm run build
    BUILD_RESULT=$?
    BUILD_DURATION="$(echo "$(date +%s.%N) - $BUILD_START" | bc)"
    
    if [ $BUILD_RESULT -ne 0 ]; then
        echo "[error] Build failed with exit code $BUILD_RESULT after ${BUILD_DURATION}s"
        exit $BUILD_RESULT
    fi
    
    echo "[timing] npm run build completed in ${BUILD_DURATION}s"
else
    echo "[startup] Build directory already exists, skipping build"
fi

# Write deployment output JSON to the specified location
DEPLOYMENT_OUTPUT_DIR="/home/runner/work/_temp/omgithub-web"
DEPLOYMENT_OUTPUT_PATH="$DEPLOYMENT_OUTPUT_DIR/deployment-output.json"

# Create the directory if it doesn't exist
mkdir -p "$DEPLOYMENT_OUTPUT_DIR"

# Write the deployment output JSON
echo "{
  \"project\": \"$PROJECT_DIR\",
  \"directory\": \"$PROJECT_DIR/dist\",
  \"timestamp\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"
}" > "$DEPLOYMENT_OUTPUT_PATH"

echo "[startup] Deployment output written to $DEPLOYMENT_OUTPUT_PATH"

# Calculate total startup time
TOTAL_DURATION="$(echo "$(date +%s.%N) - $START_TIME" | bc)"
echo "[timing] Total startup completed in ${TOTAL_DURATION}s"

# Start the development server using the runtime script
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-start.mjs"