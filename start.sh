#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
[[ "$PORT" =~ ^[0-9]+$ ]] && (( PORT > 0 && PORT < 65536 )) || { echo 'PORT must be an integer from 1 to 65535.' >&2; exit 1; }
export PORT

# Deployment metadata belongs to the worker, never in the project source tree.
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
STATIC_DIR="$PROJECT_DIR/dist"

run_timed() {
  printf '+ '
  printf '%q ' "$@"
  printf '\n'
  /usr/bin/time -p "$@"
}

run_timed mkdir -p "$STATIC_DIR" "$WEB_DIR"

if [[ -f "$PROJECT_DIR/package.json" ]]; then
  command -v npm >/dev/null 2>&1 || { echo 'npm is required because package.json is present.' >&2; exit 1; }
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    run_timed npm ci --no-audit --no-fund
  else
    run_timed npm install --no-audit --no-fund
  fi
  if node -e 'process.exit(require(process.argv[1]).scripts?.build ? 0 : 1)' "$PROJECT_DIR/package.json"; then
    run_timed npm run build
  fi
fi

if [[ ! -f "$STATIC_DIR/index.html" && -f "$PROJECT_DIR/index.html" ]]; then
  run_timed cp "$PROJECT_DIR/index.html" "$STATIC_DIR/index.html"
  for asset_dir in assets css js images fonts; do
    if [[ -d "$PROJECT_DIR/$asset_dir" && ! -e "$STATIC_DIR/$asset_dir" ]]; then
      run_timed cp -R "$PROJECT_DIR/$asset_dir" "$STATIC_DIR/$asset_dir"
    fi
  done
fi

if [[ ! -f "$STATIC_DIR/index.html" ]]; then
  # This repository currently has no app source. Generate a small, responsive
  # static welcome screen so the preview remains useful instead of serving 404.
  write_fallback_page() {
    cat > "$STATIC_DIR/index.html" <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#10131c">
  <title>PlayGround — a space to explore</title>
  <style>
    :root{color-scheme:dark;--bg:#10131c;--panel:#191e2a;--text:#f4f5fb;--muted:#a5adc0;--accent:#a9f27e;--line:#303748}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 75% 4%,#29354a 0,transparent 38%),var(--bg);color:var(--text);font:16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
    main{width:min(1040px,calc(100% - 48px));margin:0 auto;padding:32px 0 64px}.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:76px}.brand{display:flex;gap:11px;align-items:center;font-weight:700;letter-spacing:.02em}.mark{width:34px;height:34px;border-radius:11px;background:var(--accent);color:#152018;display:grid;place-items:center;font-size:20px}.tag{border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:13px;padding:7px 12px}
    .hero{max-width:760px}.eyebrow{color:var(--accent);font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.hero h1{font-size:clamp(48px,8vw,88px);line-height:.98;letter-spacing:-.065em;margin:19px 0 24px}.hero h1 span{color:var(--accent)}.hero p{max-width:570px;color:var(--muted);font-size:18px;margin:0}
    .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:64px}.card{min-height:168px;background:linear-gradient(145deg,#1d2432,var(--panel));border:1px solid var(--line);border-radius:18px;padding:23px}.icon{font-size:23px}.card h2{font-size:16px;margin:18px 0 6px}.card p{color:var(--muted);font-size:14px;margin:0}.foot{margin-top:42px;padding-top:20px;border-top:1px solid var(--line);color:#788196;font-size:13px}
    @media(max-width:650px){main{width:min(100% - 36px,520px);padding-top:22px}.top{margin-bottom:66px}.tag{font-size:11px}.hero h1{font-size:clamp(48px,14vw,72px)}.hero p{font-size:16px}.cards{grid-template-columns:1fr;margin-top:42px;gap:11px}.card{min-height:0;padding:18px;display:grid;grid-template-columns:36px 1fr;column-gap:8px}.icon{grid-row:span 2}.card h2{margin:0 0 4px}.foot{margin-top:28px}}
  </style>
</head>
<body>
  <main>
    <header class="top"><div class="brand"><span class="mark" aria-hidden="true">✳</span> PlayGround</div><span class="tag">A space to explore</span></header>
    <section class="hero" aria-labelledby="title"><div class="eyebrow">Make room for ideas</div><h1 id="title">Curiosity<br>starts <span>here.</span></h1><p>A little corner of the web for trying things, following a hunch, and seeing where it leads. Welcome to your playground.</p></section>
    <section class="cards" aria-label="Ways to explore"><article class="card"><span class="icon" aria-hidden="true">✦</span><h2>Start anywhere</h2><p>No rules for the first step. Pick a thought and follow it.</p></article><article class="card"><span class="icon" aria-hidden="true">◈</span><h2>Try something new</h2><p>Experiment, make a small change, and see what happens.</p></article><article class="card"><span class="icon" aria-hidden="true">↗</span><h2>Keep exploring</h2><p>Good ideas grow when you give them space to play.</p></article></section>
    <footer class="foot">Built for curious minds.</footer>
  </main>
</body>
</html>
HTML
  }
  TIMEFORMAT='real %3R\nuser %3U\nsys %3S'
  time write_fallback_page
fi

[[ -f "$STATIC_DIR/index.html" ]] || { echo "Build did not produce $STATIC_DIR/index.html." >&2; exit 1; }
run_timed node -e 'const fs=require("node:fs");const path=require("node:path");const project=path.resolve(process.argv[1]);const directory=path.resolve(process.argv[2]);if(directory!==project&&!directory.startsWith(project+path.sep))throw Error("Static output must stay inside PROJECT_DIR");fs.writeFileSync(process.argv[3],JSON.stringify({project,directory}))' "$PROJECT_DIR" "$STATIC_DIR" "$WEB_DIR/deployment-output.json"

command -v python3 >/dev/null 2>&1 || { echo 'python3 is required to serve the built static site.' >&2; exit 1; }
echo "Serving $STATIC_DIR on 0.0.0.0:$PORT"
run_timed python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$STATIC_DIR"
