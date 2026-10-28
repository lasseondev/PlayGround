#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$ROOT"

PORT="${PORT:-3000}"
[[ "$PORT" =~ ^[1-9][0-9]*$ ]] || { echo "PORT must be a positive integer." >&2; exit 1; }

WEB_DIR="${OPENCODE_WEB_DIR:-${RUNNER_TEMP:-/tmp}/omgithub-web}"
DIST="$ROOT/dist"
DEPLOYMENT_FILE="$WEB_DIR/deployment-output.json"
STAMP_FILE="$WEB_DIR/dependencies.sha256"

timed() {
  local label="$1"; shift
  local started ended rc=0
  started="$(date +%s%3N)"
  "$@" || rc=$?
  ended="$(date +%s%3N)"
  printf '[timing] %s: %d ms\n' "$label" "$((ended - started))" >&2
  return "$rc"
}

timed metadata-dir mkdir -p "$WEB_DIR"

dependency_hash() {
  if [[ -f package-lock.json ]]; then
    sha256sum package.json package-lock.json | sha256sum | cut -d' ' -f1
  else
    sha256sum package.json | cut -d' ' -f1
  fi
}

CURRENT_HASH="$(dependency_hash)"
PREVIOUS_HASH="$(cat "$STAMP_FILE" 2>/dev/null || true)"
if [[ ! -x node_modules/.bin/vite || "$PREVIOUS_HASH" != "$CURRENT_HASH" ]]; then
  if [[ -f package-lock.json ]]; then
    timed npm-ci npm ci --no-audit --no-fund
  else
    timed npm-install npm install --no-audit --no-fund
  fi
  printf '%s\n' "$CURRENT_HASH" > "$STAMP_FILE"
else
  echo '[timing] npm-ci: skipped (dependencies current)'
fi

timed vite-build npm run build
[[ -f "$DIST/index.html" ]] || { echo "Build did not produce $DIST/index.html" >&2; exit 1; }

printf '{"project":"%s","directory":"%s"}\n' "$ROOT" "$DIST" > "$DEPLOYMENT_FILE"
printf '[timing] deployment-output: wrote %s\n' "$DEPLOYMENT_FILE" >&2

printf '[timing] vite-preview: starting on 0.0.0.0:%s (foreground)\n' "$PORT" >&2
exec "$ROOT/node_modules/.bin/vite" preview --host 0.0.0.0 --port "$PORT" --strictPort
