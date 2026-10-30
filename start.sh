#!/usr/bin/env bash
# Build a static deployment inside PROJECT_DIR and serve it in the foreground.
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
export PORT
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
DIST_DIR="$PROJECT_DIR/dist"
DEPLOYMENT_OUTPUT="$OPENCODE_WEB_DIR/deployment-output.json"

log() {
  printf '[start] %s\n' "$*"
}

log "project directory: $PROJECT_DIR"
/usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"

BUILT_DIR=""

if [[ -f "$PROJECT_DIR/package.json" ]]; then
  log "package project detected; installing dependencies"
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi

  if /usr/bin/time -p node -e 'const p=require("./package.json"); process.exit(p.scripts && p.scripts.build ? 0 : 1)'; then
    log "running build script"
    /usr/bin/time -p npm run build
  fi

  if [[ -f "$DIST_DIR/index.html" ]]; then
    BUILT_DIR="$DIST_DIR"
  elif [[ -f "$PROJECT_DIR/build/index.html" ]]; then
    BUILT_DIR="$PROJECT_DIR/build"
  else
    printf '[start] Error: package build produced no static index.html (looked in dist/ and build/).\n' >&2
    exit 1
  fi
else
  # This repository is a plain static project. The playable app lives in its own
  # folder; copy it into an in-project build directory for deployment.
  if [[ -f "$PROJECT_DIR/opencode-v2-smoke-test/index.html" ]]; then
    SOURCE_DIR="$PROJECT_DIR/opencode-v2-smoke-test"
  elif [[ -f "$PROJECT_DIR/index.html" ]]; then
    SOURCE_DIR="$PROJECT_DIR"
  else
    printf '[start] Error: no index.html found in the project or opencode-v2-smoke-test/.\n' >&2
    exit 1
  fi

  log "static build: $SOURCE_DIR -> $DIST_DIR"
  /usr/bin/time -p rm -rf "$DIST_DIR"
  /usr/bin/time -p mkdir -p "$DIST_DIR"
  /usr/bin/time -p rsync -a \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude 'dist' \
    "$SOURCE_DIR"/ "$DIST_DIR"/
  BUILT_DIR="$DIST_DIR"
fi

if ! /usr/bin/time -p test -f "$BUILT_DIR/index.html"; then
  printf '[start] Error: build output is missing index.html: %s\n' "$BUILT_DIR" >&2
  exit 1
fi

log "writing deployment metadata: $DEPLOYMENT_OUTPUT"
/usr/bin/time -p node -e '
  const fs = require("node:fs");
  const path = require("node:path");
  const [project, directory, output] = process.argv.slice(1);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({ project, directory }) + "\n");
' "$PROJECT_DIR" "$BUILT_DIR" "$DEPLOYMENT_OUTPUT"

/usr/bin/time -p node -e '
  const fs = require("node:fs");
  const [project, directory, output] = process.argv.slice(1);
  const data = JSON.parse(fs.readFileSync(output, "utf8"));
  if (data.project !== project || data.directory !== directory) {
    throw new Error("deployment-output.json does not match the build paths");
  }
  if (!data.directory.startsWith(project + "/")) {
    throw new Error("deployment directory must live inside the project");
  }
' "$PROJECT_DIR" "$BUILT_DIR" "$DEPLOYMENT_OUTPUT"

log "deployment-output.json: $(cat "$DEPLOYMENT_OUTPUT")"
log "serving $BUILT_DIR on http://0.0.0.0:$PORT (foreground)"

exec python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$BUILT_DIR"
