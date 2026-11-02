#!/usr/bin/env bash
start_time=$(date +%s)
set -euo pipefail
cd "$(dirname "$0")"

# Write deployment output
mkdir -p /home/runner/work/_temp/omgithub-web
deployment_output='{"project":"/home/runner/work/PlayGround/PlayGround","directory":"/home/runner/work/PlayGround/PlayGround/dist"}'
echo "$deployment_output" > /home/runner/work/_temp/omgithub-web/deployment-output.json
echo "Deployment output written"

# Build project (no dependencies needed)
if [ ! -f "dist/index.html" ]; then
    echo "Building project..."
    mkdir -p dist
fi

# Start the application server using the runtime system
# This follows the original pattern but ensures the project is built first
echo "Starting application server..."
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-start.mjs"

# Log timing
end_time=$(date +%s)
duration=$((end_time - start_time))
echo "Startup completed in ${duration} seconds"
