#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

: "${CAPTURE_URL:?Set CAPTURE_URL to the public preview URL.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the capture output directory.}"

CAPTURE_SCRIPT="${RUNNER_TEMP:-/tmp}/legends-arena-capture-$$.mjs"

timed() {
  local label="$1"
  shift
  local started finished status
  started="$(date +%s%3N)"
  set +e
  "$@"
  status=$?
  set -e
  finished="$(date +%s%3N)"
  printf '[capture] %s: %dms (exit %d)\n' "$label" "$((finished - started))" "$status" >&2
  return "$status"
}

prepare_output() {
  mkdir -p "$CAPTURE_DIR"
}

write_runner() {
  cat > "$CAPTURE_SCRIPT" <<'NODE'
import { createRequire } from 'node:module'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright')
const require = createRequire(join(runtime, 'package.json'))
const { chromium } = require('playwright')
const config = JSON.parse(readFileSync(join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'))
if (process.platform === 'linux') {
  process.env.DISPLAY ||= ':' + readFileSync(join(runtime, 'display'), 'utf8').trim()
}

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
if (!url || !output) {
  console.error('CAPTURE_URL and CAPTURE_DIR are required.')
  process.exit(1)
}
mkdirSync(output, { recursive: true })

const temporary = message => Object.assign(new Error(message), { exitCode: 75 })
const defect = message => Object.assign(new Error(message), { exitCode: 1 })

let browser
try {
  browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 })
    .catch(error => { throw temporary(`browser launch failed: ${error.message}`) })

  for (const [name, width, height, mobile] of [['desktop', 1440, 900, false], ['mobile', 390, 844, true]]) {
    let page
    try {
      page = await browser.newPage({
        viewport: { width, height },
        isMobile: mobile,
        hasTouch: mobile,
        deviceScaleFactor: mobile ? 2 : 1,
      })
    } catch (error) {
      throw temporary(`page creation failed: ${error.message}`)
    }

    page.setDefaultTimeout(30000)
    const pageErrors = []
    page.on('pageerror', error => pageErrors.push(error.message))

    let response
    try {
      response = await page.goto(url, { waitUntil: 'load', timeout: 45000 })
    } catch (error) {
      throw temporary(`navigation failed: ${error.message}`)
    }
    if (!response?.ok()) {
      const status = response?.status()
      if (!response || [408, 429, 500, 502, 503, 504].includes(status)) {
        throw temporary(`HTTP ${status ?? 'unknown'} loading ${url}`)
      }
      throw defect(`HTTP ${status} loading ${url}`)
    }

    try {
      await page.waitForSelector('#playButton', { state: 'visible', timeout: 20000 })
      await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 20000 })
      await page.waitForFunction(() => Boolean(window.__legendsArena), { timeout: 20000 })
      await page.waitForTimeout(700)

      const started = await page.evaluate(() => {
        const button = document.querySelector('#playButton')
        if (!button) return false
        button.click()
        return true
      })
      if (!started) throw new Error('Play button is missing.')

      await page.waitForFunction(() => window.__legendsArena?.mode === 'playing', { timeout: 15000 })

      if (!mobile) {
        await page.evaluate(() => {
          const app = window.__legendsArena
          if (!app?.input || !app?.match?.player) return
          app.input.moveTo = {
            x: app.match.player.x + 320,
            y: app.match.player.y - 320,
          }
        })
        await page.waitForTimeout(2800)
      } else {
        await page.waitForTimeout(1500)
      }

      if (pageErrors.length) {
        throw new Error(`Page errors: ${pageErrors.join(' | ')}`)
      }

      const file = join(output, `final-${name}.png`)
      try {
        await page.screenshot({ path: file, timeout: 30000 })
      } catch (error) {
        if (error.name === 'TimeoutError' || !browser.isConnected()) {
          throw temporary(`screenshot failed: ${error.message}`)
        }
        throw error
      }
      console.log(`Captured ${name}: ${file}`)
    } catch (error) {
      if (error.exitCode) throw error
      throw defect(`${name} capture failed: ${error.message}`)
    } finally {
      await page.close().catch(() => {})
    }
  }
} catch (error) {
  console.error(error.stack || error.message)
  process.exitCode = error.exitCode || 1
} finally {
  await browser?.close().catch(() => {})
}
NODE
}

timed "prepare capture output" prepare_output
timed "write capture runner" write_runner

set +e
timed "capture desktop and mobile" node "$CAPTURE_SCRIPT"
status=$?
set -e

rm -f "$CAPTURE_SCRIPT"
exit "$status"
