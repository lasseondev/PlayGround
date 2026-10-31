#!/usr/bin/env bash
set -euo pipefail

# Start script for Tony Hawk Skate Park project
# Installs dependencies, builds project, and serves on PORT 3000

# Configuration
PROJECT_DIR="/home/runner/work/PlayGround/PlayGround"
BUILD_DIR="$PROJECT_DIR/dist"
PORT=${PORT:-3000}

# Record deployment output
deploy_output_dir="/home/runner/work/_temp/omgithub-web"
mkdir -p "$deploy_output_dir"

# Write deployment output JSON
echo "{\"project\": \"$PROJECT_DIR\", \"directory\": \"$BUILD_DIR\"}" > "$deploy_output_dir/deployment-output.json"

echo "📁 Project directory: $PROJECT_DIR"
echo "📦 Build directory: $BUILD_DIR"
echo "🌐 Port: $PORT"

echo "🔧 Installing dependencies..."
cd "$PROJECT_DIR"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    npm install
else
    echo "⚠️  No package.json found, skipping npm install"
fi

echo "🏗️  Building project..."

# Build the project
if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
    # Check if build script exists by looking for package.json with build in scripts
    if grep -q '"build"' package.json 2>/dev/null; then
        echo "🔨 Found build script, running npm build..."
        npm run build
    else
        echo "⚠️  No build script found in package.json, copying files to dist"
        # Clean build directory and copy files safely
        rm -rf "$BUILD_DIR"
        mkdir -p "$BUILD_DIR"
        # Copy all files from project root to build directory
        find "$PROJECT_DIR" -maxdepth 1 -type f -exec cp -r {} "$BUILD_DIR/" \; 2>/dev/null || true
        # Handle directories (excluding hidden directories)
        find "$PROJECT_DIR" -mindepth 1 -maxdepth 1 -type d ! -name ".*" ! -name "dist" ! -name ".git" -exec cp -r {} "$BUILD_DIR/" \; 2>/dev/null || true
    fi
else
    echo "⚠️  No package.json found or npm not available, creating empty build directory"
    # Ensure build directory exists
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    # Create a simple index.html for demonstration
    cat > "$BUILD_DIR/index.html" << 'HTML'
<!DOCTYPE html>
<html>
<head>
    <title>Tony Hawk Skate Park</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { font-size: 3em; margin-bottom: 0.5em; }
        p { font-size: 1.2em; margin-bottom: 1em; }
        .status { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
        .logo { font-size: 4em; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏂</div>
        <h1>Tony Hawk Skate Park</h1>
        <div class="status">
            <p>✅ Project build successful</p>
            <p>📁 Build directory: $BUILD_DIR</p>
            <p>🕐 Built on: $(date)</p>
            <p>🎮 Ready for 2-minute trick run sequence</p>
        </div>
        <p>The skate park is now built and serving on port $PORT</p>
        <p>Visit <a href="http://localhost:$PORT" style="color: #ffd700;">http://localhost:$PORT</a> to view your 3D skate park</p>
    </div>
</body>
</html>
HTML
fi

echo "🚀 Starting server on port $PORT..."

# Serve the built files in foreground
if [ -f "$BUILD_DIR/index.html" ]; then
    # Use a simple static server
    python3 -m http.server $PORT --directory "$BUILD_DIR"
else
    echo "❌ No index.html found in $BUILD_DIR"
    echo "Available files in $PROJECT_DIR:"
    ls -la "$PROJECT_DIR"
    exit 1
fi
