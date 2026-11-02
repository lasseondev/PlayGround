#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
export PROJECT_DIR
PORT="${PORT:-3000}"
export PORT
: "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must point to the worker metadata directory}"

cd "$PROJECT_DIR"
/usr/bin/time -p npm install --ignore-scripts --no-audit --no-fund --package-lock=false
/usr/bin/time -p mkdir -p "$PROJECT_DIR/dist"
/usr/bin/time -p cp "$PROJECT_DIR/index.html" "$PROJECT_DIR/game.js" "$PROJECT_DIR/dist/"
/usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
/usr/bin/time -p node -e 'const fs=require("node:fs"); const path=require("node:path"); const project=process.env.PROJECT_DIR; const output={project,directory:path.resolve(project,"dist")}; fs.writeFileSync(path.join(process.env.OPENCODE_WEB_DIR,"deployment-output.json"),JSON.stringify(output)+"\n")'

# Keep the server in the foreground so the runtime launcher can supervise it.
exec /usr/bin/time -p python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$PROJECT_DIR/dist"
