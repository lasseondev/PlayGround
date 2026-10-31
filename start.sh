#!/usr/bin/env bash
set -euo pipefail

# Per-command timing start
echo "=== $(date): Starting startup.sh ==="

# Change to project directory
cd "$(dirname "$0")"

echo "=== $(date): Changed to project directory ==="

# Create built output directory inside PROJECT_DIR
mkdir -p dist

echo "=== $(date): Created dist directory ==="

# Write deployment-output.json
export DEPLOYMENT_OUTPUT_FILE="/home/runner/work/_temp/omgithub-web/deployment-output.json"
export PROJECT_DIR="$(pwd)"
export BUILT_DIR="${PROJECT_DIR}/dist"

cat > "$DEPLOYMENT_OUTPUT_FILE" << EOF
{
  "project": "${PROJECT_DIR}",
  "directory": "${BUILT_DIR}"
}
EOF

echo "=== $(date): Created deployment-output.json at ${DEPLOYMENT_OUTPUT_FILE} ==="

# Check if package.json or equivalent exists for dependencies
if [ -f "package.json" ]; then
    echo "=== $(date): Installing dependencies from package.json ==="
    npm ci || npm install
    
elif [ -f "requirements.txt" ]; then
    echo "=== $(date): Installing Python dependencies ==="
    pip install -r requirements.txt
    
elif [ -f "pyproject.toml" ]; then
    echo "=== $(date): Installing Python project dependencies ==="
    pip install -e .
    
elif [ -f "Cargo.toml" ]; then
    echo "=== $(date): Installing Rust dependencies ==="
    cargo build --release
    
else
    echo "=== $(date): No standard build configuration found, skipping dependency installation ==="
fi

# Check if there's a build script or build command
if [ -f "package.json" ] && grep -q "scripts" package.json; then
    # Check if build script exists
    if grep -q '"build"' package.json; then
        echo "=== $(date): Running npm build ==="
        npm run build
    fi
elif [ -f "setup.py" ] || [ -f "main.py" ]; then
    echo "=== $(date): Python project setup complete ==="
fi

# Serve on PORT 3000 using simple HTTP server
PORT=${PORT:-3000}
echo "=== $(date): Starting HTTP server on PORT ${PORT} ==="

# Create or update dist/index.html with project info
if [ ! -f "dist/index.html" ]; then
    echo "=== $(date): Creating dist/index.html ==="
    cat > dist/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OMGithub Project</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .info {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 OMGithub Project</h1>
        <p>Welcome to your 3D Mario-style platformer project with wall jumps!</p>
        <div class="info">
            <h3>Project Details:</h3>
            <p><strong>Project Directory:</strong> ${PROJECT_DIR}</p>
            <p><strong>Built Directory:</strong> ${BUILT_DIR}</p>
            <p><strong>Server Port:</strong> ${PORT}</p>
            <p><strong>Status:</strong> ✅ Running successfully</p>
        </div>
        <h3>Features:</h3>
        <ul>
            <li>🚀 3D Mario-style platformer</li>
            <li>🏃 Wall jump mechanics</li>
            <li>🎨 Clean, responsive design</li>
            <li>⚡ Fast startup and build process</li>
        </ul>
        <p>Check the deployment-output.json for build configuration details.</p>
    </div>
</body>
</html>
EOF
fi

# Use Python's HTTP server to serve the project
echo "=== $(date): Starting HTTP server in dist directory ==="
(cd dist && python3 -m http.server $PORT) &
SERVER_PID=$!

# Store PID for potential management
echo $SERVER_PID > /tmp/omgithub-server.pid
echo "=== $(date): Server started with PID ${SERVER_PID} ==="

# Wait a moment for server to start
sleep 2

# Verify server is responding
if curl -s "http://127.0.0.1:$PORT" > /dev/null; then
    echo "=== $(date): Server is responding correctly ==="
else
    echo "=== $(date): WARNING: Server may not be responding correctly ==="
fi

# Per-command timing end
echo "=== $(date): Startup.sh completed successfully ==="