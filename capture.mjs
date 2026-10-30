import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright')
const require = createRequire(join(runtime, 'package.json'))
const { chromium } = require('playwright')

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
const selector = process.env.CAPTURE_READY_SELECTOR || '#game'

if (!url || !output) {
  console.error('Set CAPTURE_URL and CAPTURE_DIR.')
  process.exit(1)
}

mkdirSync(output, { recursive: true })

const config = JSON.parse(readFileSync(
  join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'),
  'utf8'
))
if (process.platform === 'linux') {
  process.env.DISPLAY ||= ':' + readFileSync(join(runtime, 'display'), 'utf8').trim()
}

const transient = (error) => {
  error.exitCode = 75
  return error
}

let browser
try {
  browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch((error) => {
    throw transient(error)
  })

  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const started = Date.now()
    const page = await browser.newPage({ viewport: { width, height } }).catch((error) => {
      throw transient(error)
    })
    page.setDefaultTimeout(30000)

    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch((error) => {
      throw transient(error)
    })
    if (!response?.ok()) {
      const status = response?.status()
      throw Object.assign(new Error(`HTTP ${status ?? 'unknown'} loading preview`), {
        exitCode: !response || [408, 429, 500, 502, 503, 504].includes(status) ? 75 : 1
      })
    }

    await page.locator(selector).waitFor({ state: 'visible', timeout: 30000 })
    await page.waitForFunction(() => document.fonts.status === 'loaded')
    await page.waitForFunction(() => {
      const state = window.__pairingSmokeTest?.getState()
      return Boolean(state && state.frameCount > 2)
    }, null, { timeout: 15000 })

    const rendered = await page.evaluate((target) => {
      const canvas = document.querySelector(target)
      if (!(canvas instanceof HTMLCanvasElement) || canvas.width < 300 || canvas.height < 200) {
        return { ok: false, reason: 'canvas is missing or too small' }
      }
      const context = canvas.getContext('2d')
      if (!context) return { ok: false, reason: 'canvas has no 2D context' }
      try {
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
        const colors = new Set()
        for (let i = 0; i < data.length; i += 4 * 61) {
          colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
          if (colors.size > 20) return { ok: true, colors: colors.size }
        }
        return { ok: colors.size > 20, colors: colors.size, reason: 'canvas looks blank' }
      } catch (error) {
        return { ok: false, reason: `canvas could not be read: ${error.message}` }
      }
    }, selector)

    if (!rendered.ok) {
      throw Object.assign(new Error(`Rendering defect at ${name}: ${rendered.reason}`), { exitCode: 1 })
    }
    if (pageErrors.length) {
      throw Object.assign(new Error(`Page errors at ${name}: ${pageErrors.join('; ')}`), { exitCode: 1 })
    }

    await page.waitForTimeout(800)
    await page.screenshot({
      path: join(output, `final-${name}.png`),
      timeout: 30000
    }).catch((error) => {
      if (error.name === 'TimeoutError' || !browser.isConnected()) throw transient(error)
      throw error
    })
    await page.close()
    console.log(`Capture ${name}: ${rendered.colors} sampled colors, ${Date.now() - started}ms`)
  }
} catch (error) {
  console.error(error)
  process.exitCode = error.exitCode || 1
} finally {
  await browser?.close().catch((error) => {
    console.error(error)
    process.exitCode ||= 75
  })
}
