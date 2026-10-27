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

CAPTURE_URL="${CAPTURE_URL:-}"
CAPTURE_DIR="${CAPTURE_DIR:-}"
if [[ -z "$CAPTURE_URL" || -z "$CAPTURE_DIR" ]]; then
  echo 'Set CAPTURE_URL and CAPTURE_DIR before running capture.sh.' >&2
  exit 1
fi
case "$CAPTURE_URL" in
  http://* | https://*) ;;
  *)
    echo "CAPTURE_URL must be an http(s) URL (got: $CAPTURE_URL)." >&2
    exit 1
    ;;
esac

run_timed "prepare capture directory" mkdir -p "$CAPTURE_DIR"
CAPTURE_DIR="$(cd -- "$CAPTURE_DIR" && pwd -P)"
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR"/*)
    echo "CAPTURE_DIR must be outside the project source: $CAPTURE_DIR" >&2
    exit 1
    ;;
esac
export CAPTURE_URL CAPTURE_DIR PROJECT_DIR

status=0
run_timed "capture desktop and mobile" node --input-type=module - <<'NODE' || status=$?
import { createRequire } from 'node:module'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'

const captureUrl = process.env.CAPTURE_URL
const captureDir = process.env.CAPTURE_DIR
const runtime = join(process.env.HOME, '.local/share/omgithub-playwright')
const require = createRequire(join(runtime, 'package.json'))

function fail(exitCode, message) {
  const error = new Error(message)
  error.exitCode = exitCode
  throw error
}

let chromium
try {
  ;({ chromium } = require('playwright'))
} catch (error) {
  console.error(`Playwright is unavailable: ${error.message}`)
  process.exit(75)
}

const configName = process.platform === 'darwin' ? 'metal.json' : 'linux.json'
let launchOptions
try {
  launchOptions = JSON.parse(readFileSync(join(runtime, configName), 'utf8')).browser.launchOptions
  if (process.platform === 'linux' && !process.env.DISPLAY) {
    process.env.DISPLAY = ':' + readFileSync(join(runtime, 'display'), 'utf8').trim()
  }
} catch (error) {
  console.error(`Could not read browser configuration: ${error.message}`)
  process.exit(75)
}

const TEMPORARY_HTTP = new Set([408, 429, 500, 502, 503, 504])

async function captureView(browser, name, width, height) {
  const viewStart = performance.now()
  const page = await browser.newPage({ viewport: { width, height } }).catch((error) => {
    fail(75, `${name}: could not create page: ${error.message}`)
  })
  page.setDefaultTimeout(30000)
  page.on('pageerror', (error) => console.error(`[browser:${name}] ${error.message}`))

  try {
    const navigationStart = performance.now()
    let response
    try {
      response = await page.goto(captureUrl, { waitUntil: 'load', timeout: 45000 })
    } catch (error) {
      fail(75, `${name}: navigation failed: ${error.message}`)
    }
    const status = response?.status() ?? 0
    if (!response || !response.ok()) {
      const code = !response || TEMPORARY_HTTP.has(status) ? 75 : 1
      fail(code, `${name}: preview returned HTTP ${status || 'no response'} for ${captureUrl}`)
    }
    console.log(`[timing] ${name} navigation: ${Math.round(performance.now() - navigationStart)} ms`)

    await page.locator('body').waitFor({ state: 'visible', timeout: 15000 }).catch((error) => {
      fail(75, `${name}: body never became visible: ${error.message}`)
    })
    try {
      await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 10000 })
    } catch {
      console.warn(`${name}: font loading timed out; continuing`)
    }

    const startStart = performance.now()
    await page.waitForFunction(() => Boolean(window.__abyss), null, { timeout: 15000 }).catch(() => {
      fail(1, `${name}: app bundle did not initialize`)
    })
    const playButton = page.getByRole('button', { name: 'Play' })
    const playCount = await playButton.count()
    if (playCount === 1) {
      try {
        await playButton.click({ timeout: 10000 })
      } catch (error) {
        fail(1, `${name}: Play button was not actionable: ${error.message}`)
      }
    } else if (playCount > 1) {
      fail(1, `${name}: expected one Play button, found ${playCount}`)
    }
    await page.waitForFunction(() => window.__abyss?.state?.playing === true, null, { timeout: 15000 }).catch(() => {
      fail(1, `${name}: game did not enter the playing state`)
    })
    await page.waitForFunction(() => window.__abyss?.state?.loopStarted === true, null, { timeout: 15000 }).catch(() => {
      fail(1, `${name}: render loop did not start`)
    })
    await page.waitForFunction(() => {
      const overlay = document.getElementById('overlay')
      const hud = document.getElementById('hud')
      return Boolean(overlay?.classList.contains('hidden') && hud && getComputedStyle(hud).display !== 'none')
    }, null, { timeout: 15000 }).catch(() => {
      fail(1, `${name}: start overlay or HUD did not settle`)
    })
    console.log(`[timing] ${name} start: ${Math.round(performance.now() - startStart)} ms`)

    const renderStart = performance.now()
    await page.evaluate(() => new Promise((resolve, reject) => {
      let frames = 0
      const tick = () => {
        frames += 1
        if (frames >= 2) resolve()
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      setTimeout(() => reject(new Error('animation frames timed out')), 12000)
    })).catch((error) => {
      fail(75, `${name}: ${error.message}`)
    })
    const rendered = await page.evaluate(() => {
      const app = window.__abyss
      return Boolean(app?.state?.loopStarted && (app?.renderer?.info?.render?.frame ?? 0) > 0)
    })
    if (!rendered) fail(1, `${name}: no rendered WebGL frame was detected`)
    await page.waitForTimeout(900)
    console.log(`[timing] ${name} render: ${Math.round(performance.now() - renderStart)} ms`)

    const screenshotPath = join(captureDir, `final-${name}.png`)
    const screenshotStart = performance.now()
    try {
      await page.screenshot({ path: screenshotPath, timeout: 30000 })
    } catch (error) {
      const code = error.name === 'TimeoutError' || /closed|disconnected/i.test(error.message) ? 75 : 1
      fail(code, `${name}: screenshot failed: ${error.message}`)
    }
    const bytes = statSync(screenshotPath).size
    if (bytes < 10000) fail(1, `${name}: screenshot looks blank (${bytes} bytes)`)
    console.log(`[timing] ${name} screenshot: ${Math.round(performance.now() - screenshotStart)} ms`)
    console.log(`Captured ${screenshotPath} (${bytes} bytes)`)
  } finally {
    await page.close().catch((error) => console.warn(`${name}: could not close page: ${error.message}`))
    console.log(`[timing] ${name} total: ${Math.round(performance.now() - viewStart)} ms`)
  }
}

let browser
try {
  const launchStart = performance.now()
  try {
    browser = await chromium.launch({ ...launchOptions, timeout: 30000 })
  } catch (error) {
    fail(75, `Browser launch failed: ${error.message}`)
  }
  console.log(`[timing] browser launch: ${Math.round(performance.now() - launchStart)} ms`)
  await captureView(browser, 'desktop', 1440, 900)
  await captureView(browser, 'mobile', 390, 844)
} catch (error) {
  console.error(error.message)
  process.exitCode = error.exitCode || 1
} finally {
  if (browser) {
    try {
      await browser.close()
    } catch (error) {
      console.error(`Could not close browser: ${error.message}`)
      if (!process.exitCode) process.exitCode = 75
    }
  }
}
NODE
exit "$status"
