#!/usr/bin/env bash
set -euo pipefail

# start.sh - builds and serves the project in the foreground

start_time=$(date +%s)

echo "=== Starting project server ==="
echo "Worker PID: $$
"

# Set environment variables
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
export PORT

echo "Project directory: $(pwd)"
echo "Port: $PORT"
echo "Build directory: dist
"

# Write deployment-output.json as specified
DEPLOYMENT_OUTPUT="/home/runner/work/_temp/omgithub-web/deployment-output.json"
mkdir -p "$(dirname "$DEPLOYMENT_OUTPUT")"

# Determine the static directory (dist if it exists and contains index.html, otherwise project root)
if [[ -d "dist" && -f "dist/index.html" ]]; then
    STATIC_DIR="$(cd "$PROJECT_DIR" && pwd)/dist"
else
    STATIC_DIR="$(cd "$PROJECT_DIR" && pwd)"
fi

cat > "$DEPLOYMENT_OUTPUT" << EOF
{
  "project": "$PROJECT_DIR",
  "directory": "$STATIC_DIR"
}
EOF

echo "Deployment output written to: $DEPLOYMENT_OUTPUT"

# Run the default-start.mjs script in the foreground
if command -v node >/dev/null 2>&1; then
    echo "=== Starting server ==="
    start_server_time=$(date +%s)
    
    # Use the default-start.mjs from the runtime
    node "${RUNTIME_DIR:?}/scripts/default-start.mjs"
    
    end_server_time=$(date +%s)
    server_duration=$((end_server_time - start_server_time))
    echo "Server completed in ${server_duration}s"
else
    echo "ERROR: Node.js is required to run the server"
    exit 1
fi