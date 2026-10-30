#!/usr/bin/env bash
# Once-per-worker prerequisites: install Playwright and its Chromium build.
set -euo pipefail

runtime="${PLAYWRIGHT_RUNTIME_DIR:-$HOME/.local/share/omgithub-playwright}"

/usr/bin/time -p mkdir -p "$runtime/output"

if [[ ! -x "$runtime/node_modules/.bin/playwright" ]]; then
  /usr/bin/time -p npm install --prefix "$runtime" --no-save --no-package-lock \
    @playwright/cli@0.1.19 playwright
fi

/usr/bin/time -p "$runtime/node_modules/.bin/playwright" install chromium
