#!/usr/bin/env bash
# Build the static game into PROJECT_DIR/dist and serve it on PORT in the foreground.
set -euo pipefail

cd "$(dirname "$0")"
PROJECT_DIR="$(pwd -P)"
BUILT_DIR="$PROJECT_DIR/dist"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
PORT="${PORT:-3000}"

[[ "$PORT" =~ ^[1-9][0-9]*$ ]] || { echo 'PORT must be a positive integer.' >&2; exit 1; }
export PORT

# The game is a dependency-free static site, so the build is a clean copy of
# the source game folder into a project-local deploy directory.
/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p rm -rf "$BUILT_DIR"
/usr/bin/time -p mkdir -p "$BUILT_DIR"
/usr/bin/time -p cp -R "$PROJECT_DIR/version-choice-v2-test/." "$BUILT_DIR/"
/usr/bin/time -p test -f "$BUILT_DIR/index.html"

/usr/bin/time -p /usr/bin/printf '{"project":"%s","directory":"%s"}\n' \
  "$PROJECT_DIR" "$BUILT_DIR" > "$WEB_DIR/deployment-output.json"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"

echo "Serving $BUILT_DIR on http://0.0.0.0:$PORT"
/usr/bin/time -p python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$BUILT_DIR"
