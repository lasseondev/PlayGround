#!/usr/bin/env bash
# Capture desktop and mobile screenshots of a running preview.
# Exit 75 for temporary navigation/browser failures, 1 for script or rendering defects.
set -euo pipefail

cd "$(dirname "$0")"
PROJECT_DIR="$(pwd -P)"

: "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the screenshot output directory.}"

runtime="${PLAYWRIGHT_RUNTIME_DIR:-$HOME/.local/share/omgithub-playwright}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
capture_abs="$(/usr/bin/time -p realpath "$CAPTURE_DIR")"
case "$capture_abs" in
  "$PROJECT_DIR"|"$PROJECT_DIR"/*)
    echo 'CAPTURE_DIR must be outside the project source tree.' >&2
    exit 1
    ;;
esac

if [[ ! -d "$runtime/node_modules/playwright" ]]; then
  echo "Playwright is not installed under $runtime; run startup.sh first." >&2
  exit 75
fi

CAPTURE_RUNTIME="$runtime" /usr/bin/time -p node --input-type=module <<'NODE'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'

const runtime = process.env.CAPTURE_RUNTIME
const require = createRequire(join(runtime, 'package.json'))
const { chromium } = require('playwright')

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
const viewports = [['desktop', 1440, 900], ['mobile', 390, 844]]

async function timed(label, action) {
  const start = performance.now()
  try {
    return await action()
  } finally {
    console.log(`[capture] ${label}: ${Math.round(performance.now() - start)}ms`)
  }
}

function transient(error) {
  error.exitCode = 75
  return error
}

function rendering(error) {
  error.exitCode = 1
  return error
}

let browser
try {
  browser = await timed('launch browser', () =>
    chromium.launch({ headless: true, timeout: 30000 }).catch((error) => { throw transient(error) })
  )

  for (const [name, width, height] of viewports) {
    const context = await timed(`new ${name} context`, () =>
      browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 }).catch((error) => { throw transient(error) })
    )
    try {
      const page = await timed(`new ${name} page`, () =>
        context.newPage().catch((error) => { throw transient(error) })
      )
      page.setDefaultTimeout(30000)
      page.on('pageerror', (error) => console.error(`[capture] page error: ${error.message}`))

      const response = await timed(`navigate ${name}`, () =>
        page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch((error) => { throw transient(error) })
      )
      if (!response) throw transient(new Error(`No HTTP response for ${url}`))
      if (!response.ok()) {
        const status = response.status()
        const temporary = status === 408 || status === 429 || status >= 500
        throw Object.assign(new Error(`HTTP ${status} loading ${url}`), { exitCode: temporary ? 75 : 1 })
      }

      await timed(`wait for rendered content ${name}`, () =>
        page.waitForFunction(() => {
          const canvas = document.querySelector('canvas')
          return Boolean(canvas && window.__pong && document.fonts.status === 'loaded')
        }, null, { timeout: 30000 }).catch((error) => {
          throw browser.isConnected() ? rendering(error) : transient(error)
        })
      )

      const paint = await timed(`verify canvas paint ${name}`, () =>
        page.evaluate(async () => {
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          const canvas = document.querySelector('canvas')
          if (!canvas) return { ok: false, reason: 'missing canvas' }
          const context = canvas.getContext('2d')
          const { width, height } = canvas
          if (!context || !width || !height) return { ok: false, reason: 'canvas has no drawable size' }
          const pixels = context.getImageData(0, 0, width, height).data
          let bright = 0
          let varied = 0
          for (let index = 0; index < pixels.length; index += 64) {
            const sum = pixels[index] + pixels[index + 1] + pixels[index + 2]
            if (sum > 240) bright++
            if (sum > 90) varied++
          }
          return { ok: bright > 20 && varied > 100, bright, varied, width, height }
        }).catch((error) => { throw browser.isConnected() ? rendering(error) : transient(error) })
      )
      if (!paint.ok) throw rendering(new Error(`Canvas did not render: ${JSON.stringify(paint)}`))

      await timed(`screenshot ${name}`, () =>
        page.screenshot({ path: join(output, `final-${name}.png`), timeout: 30000 }).catch((error) => {
          if (error.name === 'TimeoutError' || !browser.isConnected()) throw transient(error)
          throw rendering(error)
        })
      )
    } finally {
      await timed(`close ${name} context`, () => context.close().catch((error) => { throw transient(error) }))
    }
  }
} catch (error) {
  console.error(`[capture] failed: ${error?.message || error}`)
  process.exitCode = error?.exitCode || 1
} finally {
  if (browser) {
    await timed('close browser', () => browser.close()).catch((error) => {
      console.error(`[capture] failed to close browser: ${error?.message || error}`)
      process.exitCode ||= 75
    })
  }
}
NODE
