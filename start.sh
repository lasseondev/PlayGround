#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
PORT="${PORT:-3000}"
export PORT
mkdir -p "$WEB_DIR"
/usr/bin/time -p node -e 'const fs=require("fs"),path=require("path");const [project,web]=process.argv.slice(1);fs.mkdirSync(web,{recursive:true});fs.writeFileSync(path.join(web,"deployment-output.json"),JSON.stringify({project,directory:path.join(project,"dist")}));' "$PROJECT_DIR" "$WEB_DIR"
if [[ -f package.json ]]; then
  if [[ -f package-lock.json ]]; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
fi
/usr/bin/time -p node scripts/build.mjs
/usr/bin/time -p node scripts/serve.mjs
