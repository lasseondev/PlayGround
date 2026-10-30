#!/usr/bin/env bash
# Build the static game into PROJECT_DIR/dist and serve it in the foreground.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$SCRIPT_DIR}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
PORT="${PORT:-3000}"
BUILD_DIR="$PROJECT_DIR/dist"
SOURCE_DIR="$PROJECT_DIR/pairing-smoke-test"

cd "$PROJECT_DIR"

# Install and build a package project when one is present. This game is plain
# static HTML, so its build is a clean copy of the source folder.
/usr/bin/time -p rm -rf "$BUILD_DIR"
/usr/bin/time -p mkdir -p "$BUILD_DIR"

if [[ -f "$PROJECT_DIR/package.json" ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
  /usr/bin/time -p npm run build --if-present
  [[ -f "$BUILD_DIR/index.html" ]] || {
    echo 'Package build did not produce dist/index.html.' >&2
    exit 1
  }
else
  /usr/bin/time -p test -f "$SOURCE_DIR/index.html"
  /usr/bin/time -p test -f "$SOURCE_DIR/game.js"
  /usr/bin/time -p test -f "$SOURCE_DIR/style.css"
  /usr/bin/time -p cp -R "$SOURCE_DIR"/. "$BUILD_DIR"/
fi

/usr/bin/time -p test -f "$BUILD_DIR/index.html"
/usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
/usr/bin/time -p /usr/bin/printf '{"project":"%s","directory":"%s"}\n' \
  "$PROJECT_DIR" "$BUILD_DIR" > "$OPENCODE_WEB_DIR/deployment-output.json"
/usr/bin/time -p cat "$OPENCODE_WEB_DIR/deployment-output.json"

echo "Serving $BUILD_DIR on http://0.0.0.0:$PORT"
exec /usr/bin/time -p python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$BUILD_DIR"
