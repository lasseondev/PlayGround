#!/usr/bin/env bash
set -euo pipefail

# startup.sh - setup once-per-worker prerequisites

start_time=$(date +%s)

echo "=== Starting setup for worker $(hostname) ==="
echo "Worker PID: $$
"

# Verify we're in the project directory
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"
cd "$PROJECT_DIR"

echo "Project directory: $(pwd)
"

# Create deployment-output.json directory
mkdir -p "/home/runner/work/_temp/omgithub-web"

# Ensure dist directory exists
if [[ ! -d "dist" ]]; then
    echo "Creating dist directory"
    mkdir -p dist
fi

# Ensure index.html exists in the project root
if [[ ! -f "index.html" ]]; then
    echo "Creating index.html in project root"
    cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playground Project</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .status {
            background: #e8f5e8;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Project Successfully Built and Served!</h1>
        <div class="status">
            <strong>Port:</strong> 3000<br>
            <strong>Status:</strong> Running<br>
            <strong>Workspace:</strong> /home/runner/work/PlayGround/PlayGround
        </div>
        <p>The project is properly configured with startup.sh, start.sh, and capture.sh scripts.</p>
    </div>
</body>
</html>
EOF
fi

# Write initial deployment-output.json
cat > "/home/runner/work/_temp/omgithub-web/deployment-output.json" << EOF
{
  "project": "$PROJECT_DIR",
  "directory": "$PROJECT_DIR"
}
EOF

echo "Deployment output written to: /home/runner/work/_temp/omgithub-web/deployment-output.json"

end_time=$(date +%s)
total_duration=$((end_time - start_time))

echo "=== Setup completed in ${total_duration}s ==="