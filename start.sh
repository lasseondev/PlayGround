#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
DIST_DIR="$PROJECT_DIR/dist"
META_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

timed() {
  local label="$1"
  shift
  local started finished status
  started="$(date +%s%3N)"
  set +e
  "$@"
  status=$?
  set -e
  finished="$(date +%s%3N)"
  printf '[start] %s: %dms (exit %d)\n' "$label" "$((finished - started))" "$status" >&2
  return "$status"
}

build_static() {
  rm -rf "$DIST_DIR"
  mkdir -p "$DIST_DIR"
  cp index.html styles.css "$DIST_DIR"/
  cp -r src "$DIST_DIR"/
}

write_metadata() {
  mkdir -p "$META_DIR"
  printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_DIR" "$DIST_DIR" > "$META_DIR/deployment-output.json"
}

timed "build static site" build_static
timed "write deployment metadata" write_metadata
timed "serve static site" python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$DIST_DIR"
