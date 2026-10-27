#!/usr/bin/env bash
set -euo pipefail

run_timed() {
  local label="$1"
  shift
  local started_ns finished_ns status
  started_ns="$(date +%s%N)"
  set +e
  "$@"
  status=$?
  set -e
  finished_ns="$(date +%s%N)"
  printf '[timing] %s: %d ms\n' "$label" "$(((finished_ns - started_ns) / 1000000))" >&2
  return "$status"
}

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
if [[ ! "$PORT" =~ ^[0-9]+$ ]] || ((PORT < 1 || PORT > 65535)); then
  printf 'PORT must be an integer between 1 and 65535 (got %q).\n' "$PORT" >&2
  exit 1
fi

WEB_DIR="${OPENCODE_WEB_DIR:-${RUNNER_TEMP:-/home/runner/work/_temp}/omgithub-web}"
DIST_DIR="$PROJECT_DIR/dist"
OUTPUT_FILE="$WEB_DIR/deployment-output.json"

if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
  echo "package.json not found in $PROJECT_DIR" >&2
  exit 1
fi

need_install=false
if [[ ! -x "$PROJECT_DIR/node_modules/.bin/vite" ]]; then
  need_install=true
elif [[ -f "$PROJECT_DIR/package-lock.json" && (! -f "$PROJECT_DIR/node_modules/.package-lock.json" || "$PROJECT_DIR/package-lock.json" -nt "$PROJECT_DIR/node_modules/.package-lock.json") ]]; then
  need_install=true
elif [[ "$PROJECT_DIR/package.json" -nt "$PROJECT_DIR/node_modules/.package-lock.json" ]]; then
  need_install=true
fi

if [[ "$need_install" == true ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    run_timed "npm ci" npm ci --no-audit --no-fund
  else
    run_timed "npm install" npm install --no-audit --no-fund
  fi
fi

need_build=false
if [[ "${FORCE_BUILD:-false}" == true || ! -f "$DIST_DIR/index.html" ]]; then
  need_build=true
else
  sources=("$PROJECT_DIR/index.html" "$PROJECT_DIR/package.json")
  [[ ! -d "$PROJECT_DIR/src" ]] || sources+=("$PROJECT_DIR/src")
  [[ ! -d "$PROJECT_DIR/public" ]] || sources+=("$PROJECT_DIR/public")
  for config_file in "$PROJECT_DIR"/vite.config.*; do
    [[ ! -e "$config_file" ]] || sources+=("$config_file")
  done
  newer_source="$(find "${sources[@]}" -newer "$DIST_DIR/index.html" -print -quit 2>/dev/null || true)"
  [[ -z "$newer_source" ]] || need_build=true
fi

if [[ "$need_build" == true ]]; then
  run_timed "npm run build" npm run build
fi

if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "Build did not produce $DIST_DIR/index.html" >&2
  exit 1
fi

run_timed "mkdir deployment metadata" mkdir -p "$WEB_DIR"
run_timed "write deployment output" node -e '
const fs = require("node:fs");
const path = require("node:path");
const [project, directory, output] = process.argv.slice(1);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ project, directory }) + "\n");
' "$PROJECT_DIR" "$(cd "$DIST_DIR" && pwd -P)" "$OUTPUT_FILE"

echo "Deployment output: $OUTPUT_FILE"
cat "$OUTPUT_FILE"

echo "Serving $DIST_DIR on http://0.0.0.0:$PORT"
run_timed "vite preview" node "$PROJECT_DIR/node_modules/vite/bin/vite.js" preview --host 0.0.0.0 --port "$PORT" --strictPort
