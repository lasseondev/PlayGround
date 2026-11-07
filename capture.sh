#!/usr/bin/env bash
# Capture desktop and mobile screenshots of the deployed NEON HEAT preview.
set -euo pipefail

: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNNER_TEMP="${RUNNER_TEMP:-/tmp}"
CAPTURE_SCRIPT="$(mktemp "${RUNNER_TEMP%/}/neon-capture-XXXXXX.mjs")"

cleanup() {
  /usr/bin/time -p rm -f "$CAPTURE_SCRIPT" >/dev/null 2>&1 || true
}
trap cleanup EXIT

timed() {
  local label="$1"
  shift
  echo "[timing] $label"
  /usr/bin/time -p "$@"
}

timed "create capture directory" mkdir -p "$CAPTURE_DIR"

cat > "$CAPTURE_SCRIPT" <<'NODE'
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
if (!url || !output) {
  console.error('CAPTURE_URL and CAPTURE_DIR are required.')
  process.exit(1)
}

const projectDir = resolve(process.env.PROJECT_DIR || process.cwd())
const outDir = resolve(output)
if (outDir === projectDir || outDir.startsWith(projectDir + sep)) {
  console.error('CAPTURE_DIR must be outside the project source directory.')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

const playwrightRoot = join(process.env.HOME, '.local/share/omgithub-playwright')
const require = createRequire(join(playwrightRoot, 'package.json'))
const { chromium } = require('playwright')
const config = JSON.parse(readFileSync(join(playwrightRoot, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'))
if (process.platform === 'linux') {
  process.env.DISPLAY ||= ':' + readFileSync(join(playwrightRoot, 'display'), 'utf8').trim()
}

const now = () => performance.now()
async function timed(label, fn) {
  const start = now()
  try {
    return await fn()
  } finally {
    console.log(`[timing] ${label}: ${Math.round(now() - start)} ms`)
  }
}

const fail = (error, code) => Object.assign(
  error instanceof Error ? error : new Error(String(error)),
  { exitCode: code }
)
const transient = error => fail(error, 75)
const defect = error => fail(error, 1)
const isTransientStatus = status => !status || [408, 429, 500, 502, 503, 504].includes(status)

let browser
let exitCode = 0
try {
  browser = await timed('launch browser', () =>
    chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch(transient)
  )

  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await timed(`open ${name} page`, () =>
      browser.newPage({ viewport: { width, height } }).catch(transient)
    )
    page.setDefaultTimeout(30000)

    const failures = []
    page.on('pageerror', error => {
      console.error(`[pageerror] ${error.message}`)
      failures.push(error.message)
    })
    page.on('response', response => {
      try {
        if (response.status() >= 400 && new URL(response.url()).origin === new URL(url).origin) {
          failures.push(`HTTP ${response.status()}: ${response.url()}`)
        }
      } catch {}
    })

    const response = await timed(`navigate ${name}`, () =>
      page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(transient)
    )
    if (!response || !response.ok()) {
      const status = response?.status()
      throw fail(
        new Error(`HTTP ${status ?? 'no response'} loading ${url}`),
        isTransientStatus(status) ? 75 : 1
      )
    }

    await timed(`wait for game shell ${name}`, () =>
      page.waitForSelector('#scene', { state: 'visible', timeout: 15000 }).catch(defect)
    )
    await timed(`wait for game engine ${name}`, () =>
      page.waitForFunction(
        () => Boolean(window.NH && window.NH.G && window.NH.player),
        null,
        { timeout: 15000 }
      ).catch(defect)
    )

    const start = page.locator('#start-btn')
    await timed(`wait for start control ${name}`, () =>
      start.waitFor({ state: 'visible', timeout: 15000 }).catch(defect)
    )
    await timed(`start game ${name}`, () =>
      start.click({ timeout: 10000 }).catch(defect)
    )
    await timed(`wait for gameplay ${name}`, () =>
      page.waitForFunction(
        () => {
          const hud = document.getElementById('hud')
          return Boolean(
            window.NH &&
            window.NH.G &&
            window.NH.G.state === 'play' &&
            hud &&
            !hud.classList.contains('hidden')
          )
        },
        null,
        { timeout: 15000 }
      ).catch(defect)
    )
    await timed(`render frames ${name}`, () =>
      page.evaluate(() => new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      })).catch(transient)
    )

    // Move away from the spawn lamp post so the screenshot shows the car and
    // the open road rather than a pole crossing the camera. Software-rendered
    // capture can run at only a few frames per second, so wait for actual
    // movement instead of assuming a fixed wall-clock duration.
    await timed(`drive ${name}`, async () => {
      await page.locator('#scene').click({ position: { x: 8, y: 8 }, timeout: 5000 }).catch(() => {})
      await page.evaluate(() => {
        const car = window.NH?.player?.car
        window.__captureStart = car ? { x: car.pos.x, z: car.pos.z } : null
      })
      await page.keyboard.down('w')
      const deadline = Date.now() + 12000
      let moved = 0
      let speed = 0
      while (Date.now() < deadline) {
        await page.waitForTimeout(400)
        const sample = await page.evaluate(() => {
          const car = window.NH?.player?.car
          const start = window.__captureStart
          if (!car || !start) return { state: window.NH?.G?.state, moved: 0, speed: 0 }
          return {
            state: window.NH.G.state,
            moved: Math.hypot(car.pos.x - start.x, car.pos.z - start.z),
            speed: car.speed
          }
        })
        moved = sample.moved
        speed = sample.speed
        if (sample.state !== 'play' || moved >= 8) break
      }
      await page.keyboard.up('w')
      await page.waitForTimeout(900)
      console.log(`[drive] ${name}: moved ${moved.toFixed(1)} m, speed ${Math.round(speed * 3.6)} km/h`)
    })
    const state = await page.evaluate(() => window.NH?.G?.state)
    if (state !== 'play') throw defect(new Error(`Game state is ${state} after starting`))

    const path = join(outDir, `final-${name}.png`)
    await timed(`screenshot ${name}`, () =>
      page.screenshot({ path, timeout: 30000 }).catch(error => {
        const temporary = error.name === 'TimeoutError' || !browser.isConnected()
        throw fail(error, temporary ? 75 : 1)
      })
    )
    const size = statSync(path).size
    if (size < 1000) throw defect(new Error(`Screenshot ${path} is too small (${size} bytes)`))
    console.log(`[capture] ${path} (${size} bytes)`)

    if (failures.length) throw defect(new Error(`Rendering defects: ${failures.join('; ')}`))

    await timed(`close ${name} page`, () => page.close().catch(transient))
  }
} catch (error) {
  console.error(error?.stack || error)
  exitCode = error?.exitCode || 1
} finally {
  if (browser) {
    await timed('close browser', () => browser.close()).catch(error => {
      console.error(error)
      exitCode ||= 75
    })
  }
}
process.exit(exitCode)
NODE

status=0
timed "run browser capture" env \
  CAPTURE_URL="$CAPTURE_URL" \
  CAPTURE_DIR="$CAPTURE_DIR" \
  PROJECT_DIR="$PROJECT_DIR" \
  node "$CAPTURE_SCRIPT" || status=$?

if [[ "$status" -ne 0 ]]; then
  echo "Capture failed with exit code $status." >&2
  exit "$status"
fi

timed "verify desktop screenshot" test -s "$CAPTURE_DIR/final-desktop.png"
timed "verify mobile screenshot" test -s "$CAPTURE_DIR/final-mobile.png"
echo "Captured $CAPTURE_DIR/final-desktop.png and $CAPTURE_DIR/final-mobile.png"
