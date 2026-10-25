#!/usr/bin/env bash
# start.sh: build the static site into PROJECT_DIR/dist and serve it in the
# foreground on PORT (default 3000). Every significant command is timed.
set -euo pipefail
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
PORT="${PORT:-3000}"
WEB_META_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
DIST_DIR="$PROJECT_DIR/dist"

t() { /usr/bin/time -p "$@"; }

echo "[start.sh] project=$PROJECT_DIR port=$PORT"

# ---- build: copy the static app into dist/ ----
t mkdir -p "$DIST_DIR"
t cp -f "$PROJECT_DIR/rocket-league-3d.html" "$DIST_DIR/index.html"
t ls -la "$DIST_DIR"

# ---- worker metadata: deployment-output.json (outside source) ----
t mkdir -p "$WEB_META_DIR"
t tee "$WEB_META_DIR/deployment-output.json" >/dev/null <<JSON
{"project": "$PROJECT_DIR", "directory": "$DIST_DIR"}
JSON
cat "$WEB_META_DIR/deployment-output.json"

# ---- install dependencies (static app: none required) ----
echo "[start.sh] no package dependencies to install (plain static app)"

# ---- serve dist/ in the foreground ----
cd "$DIST_DIR"
echo "[start.sh] serving $DIST_DIR on http://127.0.0.1:$PORT/"
exec /usr/bin/time -p python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$DIST_DIR"
