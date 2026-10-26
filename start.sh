#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

PROJECT_DIR="$(pwd -P)"
DIST_DIR="$PROJECT_DIR/dist"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
PORT="${PORT:-3000}"
export PORT

/usr/bin/time -p printf 'Building static site in %s\n' "$DIST_DIR"
/usr/bin/time -p rm -rf "$DIST_DIR"
/usr/bin/time -p mkdir -p "$DIST_DIR"
/usr/bin/time -p cp -R "$PROJECT_DIR/src/." "$DIST_DIR/"
/usr/bin/time -p test -f "$DIST_DIR/index.html"

/usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
/usr/bin/time -p printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_DIR" "$DIST_DIR" > "$OPENCODE_WEB_DIR/deployment-output.json"

# The default server declares deployment output from its own working directory.
# Ours is already declared above, so keep it from overwriting the record.
unset OPENCODE_WEB_DIR
cd "$DIST_DIR"
exec /usr/bin/time -p node "${RUNTIME_DIR:?RUNTIME_DIR is required}/scripts/default-start.mjs"
