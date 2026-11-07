#!/usr/bin/env bash
# Build the static NEON HEAT deployment and serve it in the foreground.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
BUILD_DIR="$PROJECT_DIR/dist"
DEPLOYMENT_OUTPUT="$OPENCODE_WEB_DIR/deployment-output.json"

timed() {
  local label="$1"
  shift
  echo "[timing] $label"
  /usr/bin/time -p "$@"
}

# Keep the build output inside PROJECT_DIR. Rebuild it on every server start so
# the preview always serves a complete, self-contained static tree.
timed "clean build directory" rm -rf "$BUILD_DIR"
timed "create build directory" mkdir -p "$BUILD_DIR"

if [[ -f "$PROJECT_DIR/package.json" ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    timed "install dependencies" npm ci --no-audit --no-fund
  else
    timed "install dependencies" npm install --no-audit --no-fund
  fi
  timed "build project" npm run build --if-present
  if [[ -f "$PROJECT_DIR/dist/index.html" ]]; then
    BUILD_DIR="$PROJECT_DIR/dist"
  elif [[ -f "$PROJECT_DIR/build/index.html" ]]; then
    BUILD_DIR="$PROJECT_DIR/build"
  fi
else
  timed "copy index.html" cp "$PROJECT_DIR/index.html" "$BUILD_DIR/index.html"
  timed "copy js" cp -R "$PROJECT_DIR/js" "$BUILD_DIR/js"
  timed "copy vendor" cp -R "$PROJECT_DIR/vendor" "$BUILD_DIR/vendor"
fi

timed "verify build" test -f "$BUILD_DIR/index.html"
timed "create metadata directory" mkdir -p "$OPENCODE_WEB_DIR"
timed "write deployment-output.json" node -e '
  const fs = require("node:fs");
  const path = require("node:path");
  const [project, directory, output] = process.argv.slice(1);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({ project, directory }) + "\n");
' "$PROJECT_DIR" "$BUILD_DIR" "$DEPLOYMENT_OUTPUT"

echo "Serving $BUILD_DIR on 0.0.0.0:$PORT"
exec /usr/bin/time -p python3 -u -m http.server --bind 0.0.0.0 --directory "$BUILD_DIR" "$PORT"
