#!/usr/bin/env bash

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# PROJECT_DIR is the directory containing this script (the PlayGround project)
PROJECT_DIR="$SCRIPT_DIR"

# Set up variables for the build output directory
BUILD_DIR="$PROJECT_DIR/dist"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Function to time commands
time_command() {
    local start_time=$(date +%s.%N)
    local command="$1"
    local description="$2"
    
    log "Starting: $description..."
    
    if ! eval "$command"; then
        log "ERROR: $description failed!"
        return 1
    fi
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    log "Completed: $description (took ${duration}s)"
    return 0
}

# Create deployment output directory and file
create_deployment_output() {
    local deployment_output_dir="/home/runner/work/_temp/omgithub-web"
    mkdir -p "$deployment_output_dir"
    
    # Create deployment output JSON
    cat > "$deployment_output_dir/deployment-output.json" <<EOF
{
  "project": "$PROJECT_DIR",
  "directory": "$BUILD_DIR",
  "timestamp": "$TIMESTAMP",
  "status": "ready"
}
EOF
    
    log "Deployment output created: $deployment_output_dir/deployment-output.json"
}

# Install project dependencies
install_dependencies() {
    if [ -f "$PROJECT_DIR/package.json" ]; then
        log "Project has package.json - installing dependencies..."
        cd "$PROJECT_DIR"
        
        if time_command "npm install" "Install npm dependencies"; then
            log "Dependencies installed successfully"
            return 0
        else
            log "ERROR: Failed to install dependencies"
            return 1
        fi
    else
        log "No package.json found - skipping dependency installation"
        return 0
    fi
}

# Build the project if needed
build_project() {
    log "Building project..."
    
    cd "$PROJECT_DIR"
    
    # Check if we need to build
    if [ -f "$BUILD_DIR/index.html" ]; then
        log "Build directory exists - skipping build"
        return 0
    fi
    
    # Create build directory
    mkdir -p "$BUILD_DIR"
    
    # Try different build approaches
    if command -v npm >/dev/null 2>&1 && [ -f "package.json" ]; then
        if time_command "npm run build" "Run npm build script"; then
            log "Build completed successfully"
            
            # Verify build output
            if [ -f "$BUILD_DIR/index.html" ]; then
                log "Build verification successful - index.html found"
                return 0
            else
                log "WARNING: Build completed but index.html not found"
                return 0
            fi
        else
            log "ERROR: npm build failed"
            return 1
        fi
    else
        log "WARNING: No build script available, skipping build"
        return 0
    fi
}

# Serve the built project

 serve_project() {
    local port=${PORT:-3000}
    
    log "Starting project server on port $port..."
    log "Build directory: $BUILD_DIR"
    
    # Check if we have a simple HTML file to serve
    if [ -f "$BUILD_DIR/index.html" ]; then
        log "Serving HTML file directly..."
        
        # Use a simple HTTP server
        if command -v python3 >/dev/null 2>&1; then
            # Use Python's http.server
            cd "$BUILD_DIR"
            python3 -m http.server "$port" --bind 0.0.0.0 &
            local server_pid=$!
            log "Python HTTP server started with PID $server_pid"
            
            # Wait for server to start
            sleep 3
            
            # Check if server is still running
            if kill -0 "$server_pid" 2>/dev/null; then
                log "Server is running"
                # Keep server running in background
                echo $server_pid > "$BUILD_DIR/server.pid"
                return 0
            else
                log "ERROR: Server failed to start"
                return 1
            fi
        else
            log "ERROR: Python3 not available for serving"
            return 1
        fi
    else
        log "ERROR: No index.html found in build directory"
        log "Build directory contents:"
        ls -la "$BUILD_DIR" 2>/dev/null || log "Cannot list build directory"
        return 1
    fi
}

# Main execution
main() {
    log "Starting PlayGround 3D RTS Game..."
    log "Project directory: $PROJECT_DIR"
    log "Build directory: $BUILD_DIR"
    
    # Step 1: Create deployment output
    if ! create_deployment_output; then
        log "ERROR: Failed to create deployment output"
        exit 1
    fi
    
    # Step 2: Install dependencies
    if ! install_dependencies; then
        log "ERROR: Failed to install dependencies"
        exit 1
    fi
    
    # Step 3: Build project
    if ! build_project; then
        log "ERROR: Failed to build project"
        exit 1
    fi
    
    # Step 4: Serve the project
    if ! serve_project; then
        log "ERROR: Failed to serve project"
        exit 1
    fi
    
    log "🎮 Game server started successfully!"
    log "📁 Build directory: $BUILD_DIR"
    log "🌐 Visit http://localhost:$port to play"
    log "🛑 Press Ctrl+C to stop the server"
    
    # Wait for user interrupt
    trap 'log "🛑 Shutting down server..."; exit 0' INT TERM
    
    # Keep the script running
    while true; do
        sleep 60
    done
}

# Execute main function
main "$@"