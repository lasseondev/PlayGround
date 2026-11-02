#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
STATIC_DIR="$PROJECT_DIR/dist"

run_timed() {
  /usr/bin/time -p "$@"
}

case "$PORT" in
  ''|*[!0-9]*) echo "PORT must be a valid port number: $PORT" >&2; exit 1 ;;
esac
if (( PORT < 1 || PORT > 65535 )); then
  echo "PORT must be between 1 and 65535: $PORT" >&2
  exit 1
fi

run_timed mkdir -p "$OPENCODE_WEB_DIR"

if [[ -f "$PROJECT_DIR/package.json" ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    run_timed npm ci --no-audit --no-fund
  else
    run_timed npm install --no-audit --no-fund
  fi
  run_timed npm run build
  if [[ ! -f "$STATIC_DIR/index.html" ]]; then
    for candidate in build out; do
      if [[ -f "$PROJECT_DIR/$candidate/index.html" ]]; then
        STATIC_DIR="$PROJECT_DIR/$candidate"
        break
      fi
    done
  fi
elif [[ -f "$PROJECT_DIR/index.html" ]]; then
  run_timed mkdir -p "$STATIC_DIR"
  run_timed cp "$PROJECT_DIR/index.html" "$STATIC_DIR/index.html"
  for asset_dir in assets css js images; do
    if [[ -d "$PROJECT_DIR/$asset_dir" ]]; then
      run_timed cp -R "$PROJECT_DIR/$asset_dir" "$STATIC_DIR/"
    fi
  done
else
  # This repository has no checked-in application source; provide a small,
  # generated static preview rather than letting the startup hook fail empty.
  run_timed mkdir -p "$STATIC_DIR"
  run_timed tee "$STATIC_DIR/index.html" >/dev/null <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#10131c">
  <title>PlayGround</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #10131c; color: #f3f5ff; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 28px; background: radial-gradient(ellipse at 50% 0%, #272a43 0, #10131c 62%); }
    main { width: min(680px, 100%); padding: clamp(28px, 7vw, 64px); border: 1px solid #ffffff1a; border-radius: 28px; background: #191c29d9; box-shadow: 0 28px 90px #0006; }
    .mark { display: inline-grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #a78bfa, #6d5dfc); font-size: 26px; }
    .eyebrow { margin: 28px 0 10px; color: #aaa4ff; font-size: 12px; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 0; font-size: clamp(40px, 9vw, 68px); letter-spacing: -.055em; line-height: 1; }
    p { max-width: 46ch; color: #b7bbcd; font-size: 17px; line-height: 1.7; }
    .status { display: inline-flex; align-items: center; gap: 9px; margin-top: 20px; padding: 10px 14px; border: 1px solid #ffffff1a; border-radius: 999px; color: #d7d9e7; font-size: 13px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #58df9b; box-shadow: 0 0 14px #58df9b99; }
  </style>
</head>
<body>
  <main>
    <div class="mark" aria-hidden="true">✦</div>
    <p class="eyebrow">A space to experiment</p>
    <h1>PlayGround</h1>
    <p>Your project preview is live. This repository currently contains no application source, so this generated page keeps the preview available until you add one.</p>
    <div class="status"><span class="dot" aria-hidden="true"></span> Preview ready</div>
  </main>
</body>
</html>
HTML
fi

if [[ ! -f "$STATIC_DIR/index.html" ]]; then
  echo "Build did not produce an index.html in $STATIC_DIR" >&2
  exit 1
fi
case "$(realpath "$STATIC_DIR")/" in
  "$PROJECT_DIR"/*) ;;
  *) echo "Static output must stay inside the project directory: $STATIC_DIR" >&2; exit 1 ;;
esac
STATIC_DIR="$(realpath "$STATIC_DIR")"
run_timed node - "$PROJECT_DIR" "$STATIC_DIR" "$OPENCODE_WEB_DIR/deployment-output.json" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [project, directory, metadata] = process.argv.slice(2);
fs.writeFileSync(metadata, JSON.stringify({ project: path.resolve(project), directory: path.resolve(directory) }));
NODE

export PORT STATIC_DIR
exec /usr/bin/time -p node - <<'NODE'
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(process.env.STATIC_DIR);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.wasm': 'application/wasm'
};
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  const target = path.resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(404).end('Not found'); return; }
  let file = target;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const body = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    if (!path.extname(pathname)) {
      try {
        const body = fs.readFileSync(path.join(root, 'index.html'));
        res.writeHead(200, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-cache' });
        res.end(body);
        return;
      } catch {}
    }
    res.writeHead(404).end('Not found');
  }
}).listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`Serving ${root} on port ${process.env.PORT}`);
});
NODE
