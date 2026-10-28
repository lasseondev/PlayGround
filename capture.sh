#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$ROOT"

: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"
[[ "$CAPTURE_URL" =~ ^https?:// ]] || { echo "CAPTURE_URL must be an http(s) URL." >&2; exit 1; }
[[ "$CAPTURE_DIR" = /* ]] || { echo "CAPTURE_DIR must be absolute." >&2; exit 1; }

ROOT_REAL="$(realpath -m "$ROOT")"
CAPTURE_REAL="$(realpath -m "$CAPTURE_DIR")"
case "$CAPTURE_REAL/" in
  "$ROOT_REAL/"*) echo "CAPTURE_DIR must stay outside the project source." >&2; exit 1 ;;
esac

timed() {
  local label="$1"; shift
  local started ended rc=0
  started="$(date +%s%3N)"
  "$@" || rc=$?
  ended="$(date +%s%3N)"
  printf '[timing] %s: %d ms\n' "$label" "$((ended - started))" >&2
  return "$rc"
}

timed capture-dir mkdir -p "$CAPTURE_DIR"
timed browser-capture node --input-type=commonjs - <<'NODE'
const { createRequire } = require('node:module')
const { readFileSync, statSync } = require('node:fs')
const { join } = require('node:path')
const { inflateSync } = require('node:zlib')
const { performance } = require('node:perf_hooks')

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright')
const requireFromRuntime = createRequire(join(runtime, 'package.json'))
const { chromium } = requireFromRuntime('playwright')
const config = JSON.parse(readFileSync(join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'))
if (process.platform === 'linux') {
  try { process.env.DISPLAY ||= ':' + readFileSync(join(runtime, 'display'), 'utf8').trim() } catch {}
}

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
const startSelector = process.env.CAPTURE_START_SELECTOR || '#btn-play'
const autoStartDesktop = process.env.CAPTURE_AUTO_START !== 'false'
const autoStartMobile = process.env.CAPTURE_MOBILE_AUTO_START === 'true'

function mark(label, started) {
  console.error(`[timing] ${label}: ${Math.round(performance.now() - started)} ms`)
}

async function step(label, fn) {
  const started = performance.now()
  try { return await fn() } finally { mark(label, started) }
}

function transient(error) {
  error.exitCode = 75
  return error
}

function classifyNavigation(error) {
  if (/Timeout|net::|ECONN|ENOTFOUND|EAI_AGAIN|socket hang up/i.test(String(error && error.message))) return transient(error)
  return error
}

function pngStats(buffer) {
  if (buffer.length < 32 || buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Screenshot is not a PNG.')
  let pos = 8
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0
  const idat = []
  while (pos + 8 <= buffer.length) {
    const length = buffer.readUInt32BE(pos)
    const type = buffer.toString('ascii', pos + 4, pos + 8)
    const data = buffer.subarray(pos + 8, pos + 8 + length)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlace = data[12]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    pos += 12 + length
  }
  if (!width || !height || !idat.length) throw new Error('Screenshot PNG has no image data.')
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6) || interlace !== 0) {
    throw new Error(`Unsupported screenshot PNG format (depth ${bitDepth}, color ${colorType}, interlace ${interlace}).`)
  }
  const bpp = colorType === 6 ? 4 : 3
  const stride = width * bpp
  const raw = inflateSync(Buffer.concat(idat))
  if (raw.length < height * (stride + 1)) throw new Error('Screenshot PNG is truncated.')
  const pixels = Buffer.alloc(height * stride)
  let offset = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[offset++]
    const row = raw.subarray(offset, offset + stride)
    offset += stride
    const rowStart = y * stride
    const previousStart = (y - 1) * stride
    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? pixels[rowStart + x - bpp] : 0
      const up = y > 0 ? pixels[previousStart + x] : 0
      const upLeft = y > 0 && x >= bpp ? pixels[previousStart + x - bpp] : 0
      let value = row[x]
      if (filter === 1) value = (value + left) & 255
      else if (filter === 2) value = (value + up) & 255
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255
      else if (filter === 4) {
        const p = left + up - upLeft
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft)
        value = (value + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter ${filter}.`)
      }
      pixels[rowStart + x] = value
    }
  }
  let count = 0, sum = 0, sumSquares = 0, min = 255, max = 0
  const sampleStep = Math.max(1, Math.floor(width / 180))
  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const index = y * stride + x * bpp
      const luminance = 0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2]
      count++
      sum += luminance
      sumSquares += luminance * luminance
      if (luminance < min) min = luminance
      if (luminance > max) max = luminance
    }
  }
  const mean = sum / count
  const variance = Math.max(0, sumSquares / count - mean * mean)
  return { width, height, mean, variance, range: max - min, bytes: buffer.length }
}

function assertRendered(stats, name) {
  console.error(`[render] ${name}: ${stats.width}x${stats.height} mean=${stats.mean.toFixed(1)} variance=${stats.variance.toFixed(1)} range=${stats.range.toFixed(1)} bytes=${stats.bytes}`)
  if (stats.bytes < 4000 || stats.variance < 1 || stats.range < 8) {
    throw Object.assign(new Error(`${name} screenshot appears blank or unrendered.`), { exitCode: 1 })
  }
}

async function capture(browser, name, width, height, shouldStart) {
  const page = await browser.newPage({ viewport: { width, height } })
  page.setDefaultTimeout(120000)
  const pageErrors = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
    console.error(`[pageerror] ${name}: ${error.message}`)
  })
  try {
    const response = await step(`navigate-${name}`, () => page.goto(url, { waitUntil: 'load', timeout: 120000 })).catch(error => { throw classifyNavigation(error) })
    if (!response) throw transient(new Error(`No HTTP response for ${name}.`))
    const status = response.status()
    if (status >= 500 || status === 408 || status === 429) throw transient(new Error(`HTTP ${status} loading ${name}.`))
    if (status >= 400) throw Object.assign(new Error(`HTTP ${status} loading ${name}.`), { exitCode: 1 })

    await step(`ready-${name}`, () => page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 }))
    await step(`fonts-${name}`, () => page.evaluate(() => document.fonts.ready).then(() => true))

    if (shouldStart) {
      const started = performance.now()
      try {
        const button = page.locator(startSelector).first()
        await button.waitFor({ state: 'visible', timeout: 90000 })
        await button.click({ timeout: 90000 })
        console.error(`[capture] ${name}: clicked ${startSelector}`)
      } catch (error) {
        console.error(`[capture] ${name}: direct click skipped (${error.message}); trying DOM click`)
        await page.evaluate(selector => document.querySelector(selector)?.click(), startSelector)
      }
      await page.waitForFunction(() => window.__game?.state === 'playing', null, { timeout: 45000 }).catch(() => {})
      await page.waitForFunction(() => (window.__game?.time ?? 0) >= 1.2, null, { timeout: 60000 }).catch(() => {})
      mark(`auto-start-${name}`, started)
    } else {
      await page.waitForFunction(() => (window.__game?.time ?? 0) >= 0.8, null, { timeout: 60000 }).catch(() => {})
    }

    await page.waitForTimeout(1200)
    const file = join(output, `final-${name}.png`)
    let stats
    for (let attempt = 1; attempt <= 2; attempt++) {
      await step(`screenshot-${name}-${attempt}`, () => page.screenshot({ path: file, timeout: 120000 }))
      stats = pngStats(readFileSync(file))
      try {
        assertRendered(stats, name)
        break
      } catch (error) {
        if (attempt === 2) throw error
        console.error(`[capture] ${name}: blank frame, waiting for another render`)
        await page.waitForTimeout(5000)
      }
    }
    console.error(`[capture] ${name}: saved ${file} (${statSync(file).size} bytes)`)
    if (pageErrors.length) throw Object.assign(new Error(`${name} produced ${pageErrors.length} page error(s).`), { exitCode: 1 })
  } finally {
    await page.close().catch(error => console.error(`[capture] ${name}: close failed: ${error.message}`))
  }
}

async function main() {
  const browser = await step('browser-launch', () => chromium.launch({ ...config.browser.launchOptions, timeout: 60000 })).catch(error => { throw transient(error) })
  try {
    await capture(browser, 'desktop', 1440, 900, autoStartDesktop)
    await capture(browser, 'mobile', 390, 844, autoStartMobile)
  } finally {
    await step('browser-close', () => browser.close()).catch(error => console.error(`[capture] browser close failed: ${error.message}`))
  }
}

main().catch(error => {
  console.error(error && error.stack || error)
  process.exitCode = error && error.exitCode || 1
})
NODE
