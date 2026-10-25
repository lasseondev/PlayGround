#!/usr/bin/env bash
# startup.sh: once-per-worker prerequisites only. Runs on the next worker
# start via the saved hook; each newly added setup command is verified below.
set -euo pipefail

t() { /usr/bin/time -p "$@"; }

PROJECT_DIR="${PROJECT_DIR:-/home/runner/work/PlayGround/PlayGround}"

# ---- required tooling for start.sh / capture.sh ----
t bash -n "$PROJECT_DIR/start.sh"
for bin in node tmux python3 playwright-cli curl; do
  t bash -c "command -v $bin >/dev/null" || { echo "missing prerequisite: $bin" >&2; exit 1; }
done

# ---- Xvfb display for headed playwright capture (idempotent) ----
runtime="$HOME/.local/share/omgithub-playwright"
runtime_dir="$HOME/.local/share/omgithub-playwright"
pw_node_modules="$runtime_dir/node_modules"
if [[ -d "$pw_node_modules" ]]; then
  # version-matched browser install (playwright-core in the CLI pins a build)
  t playwright-cli install-browser chromium
  t "$pw_node_modules/.bin/playwright" install --with-deps chromium
else
  echo "[startup.sh] $runtime_dir/node_modules not present; skipping browser install" >&2
fi
if command -v Xvfb >/dev/null && { [[ ! -s "$runtime/display" ]] ||
    ! t kill -0 "$(t cat "$runtime/xvfb.pid" 2>/dev/null)" 2>/dev/null; }; then
  : > "$runtime/display"
  t bash -c 'nohup Xvfb -displayfd 3 -screen 0 1440x900x24 -nolisten tcp 3>"$1/display" >"$1/xvfb.log" 2>&1 </dev/null & echo $! >"$1/xvfb.pid"' _ "$runtime"
  t timeout 15 bash -c 'until test -s "$1/display"; do sleep 0.1; done' _ "$runtime"
fi

echo "[startup.sh] prerequisites ok"
