#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
[[ "$PORT" =~ ^[0-9]+$ ]] && (( PORT > 0 && PORT < 65536 )) || { echo "PORT must be between 1 and 65535." >&2; exit 1; }
time_cmd() { /usr/bin/time -p "$@"; }

STATIC_DIR="$PROJECT_DIR"
if [[ -f "$PROJECT_DIR/package.json" ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    time_cmd npm ci --no-audit --no-fund
  else
    time_cmd npm install --no-audit --no-fund
  fi
  HAS_BUILD="$(time_cmd node -e "const p=require('./package.json'); process.stdout.write(p.scripts?.build ? 'yes' : 'no')")"
  if [[ "$HAS_BUILD" == yes ]]; then
    time_cmd npm run build
    [[ -f "$PROJECT_DIR/dist/index.html" ]] || { echo "Build completed without dist/index.html." >&2; exit 1; }
    STATIC_DIR="$PROJECT_DIR/dist"
  fi
else
  echo "No package manifest; static source is the ready-to-serve build (no install/build required)."
fi

OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
export PROJECT_DIR STATIC_DIR PORT OPENCODE_WEB_DIR
time_cmd mkdir -p "$OPENCODE_WEB_DIR"
time_cmd node --input-type=module <<'NODE'
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const project = resolve(process.env.PROJECT_DIR);
const directory = resolve(process.env.STATIC_DIR);
if (!directory.startsWith(project + '/') && directory !== project) {
  throw new Error(`Static output must stay inside the project: ${directory}`);
}
writeFileSync(resolve(process.env.OPENCODE_WEB_DIR, 'deployment-output.json'), JSON.stringify({ project, directory }));
NODE

# The dependency-free app is served directly from its source directory; keep the
# server in the foreground so the controller can supervise it in tmux.
time_cmd node --input-type=module - "$STATIC_DIR" <<'NODE'
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
const root = resolve(process.argv[2]);
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
const started = performance.now();
const server = createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
    const body = readFileSync(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});
server.listen(port, '0.0.0.0', () => {
  console.log(`Static app ready at http://0.0.0.0:${port}/ (${(performance.now() - started).toFixed(1)} ms startup)`);
});
NODE
