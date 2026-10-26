import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const started = performance.now();
const marks = [];
const mark = (name) => {
  marks.push({ name, at: Math.round(performance.now() - started) });
};

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;
if (!url || !output) {
  console.error('CAPTURE_URL and CAPTURE_DIR are required.');
  process.exit(1);
}

const project = resolve(new URL('..', import.meta.url).pathname);
const captureDirectory = resolve(output);
const relativeOutput = relative(project, captureDirectory);
if (relativeOutput && !relativeOutput.startsWith('..') && !relativeOutput.startsWith('/')) {
  console.error('CAPTURE_DIR must be outside the project source tree.');
  process.exit(1);
}
mkdirSync(captureDirectory, { recursive: true });

class CaptureFailure extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const transient = (error) => new CaptureFailure(error.message || String(error), 75);

const runtime = join(homedir(), '.local/share/omgithub-playwright');
const require = createRequire(join(runtime, 'package.json'));
const { chromium } = require('playwright');
const config = JSON.parse(readFileSync(join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'));
if (process.platform === 'linux') {
  const displayFile = join(runtime, 'display');
  if (existsSync(displayFile)) process.env.DISPLAY ||= ':' + readFileSync(displayFile, 'utf8').trim();
}
mark('playwright-loaded');

let browser;
const pageErrors = [];
const consoleErrors = [];

async function captureViewport(name, width, height) {
  let page;
  try {
    page = await browser.newPage({ viewport: { width, height } });
  } catch (error) {
    throw transient(error);
  }
  page.setDefaultTimeout(30000);
  page.on('pageerror', (error) => {
    pageErrors.push(`${name}: ${error.message}`);
    console.error(`Page error (${name}): ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    consoleErrors.push(`${name}: ${text}`);
    console.error(`Console error (${name}): ${text}`);
  });

  let response;
  try {
    response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  } catch (error) {
    await page.close().catch(() => {});
    throw transient(error);
  }
  if (!response) {
    await page.close().catch(() => {});
    throw new CaptureFailure('Navigation returned no response', 75);
  }
  if (!response.ok()) {
    const status = response.status();
    await page.close().catch(() => {});
    const code = [408, 425, 429, 500, 502, 503, 504].includes(status) ? 75 : 1;
    throw new CaptureFailure(`HTTP ${status} loading ${url}`, code);
  }
  mark(`${name}-navigated`);

  try {
    await page.locator('body').waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 });
  } catch (error) {
    await page.close().catch(() => {});
    throw new CaptureFailure(`Page shell did not become visible: ${error.message}`, 1);
  }

  const startButton = page.locator('#start-button');
  try {
    if (await startButton.isVisible()) {
      await startButton.click({ timeout: 10000 });
      mark(`${name}-started`);
    } else {
      console.log(`Capture ${name}: no start button, continuing with the current view.`);
    }
  } catch (error) {
    await page.close().catch(() => {});
    throw new CaptureFailure(`Could not start the game: ${error.message}`, 1);
  }

  try {
    await page.waitForFunction(() => window.__VOXEL_READY__ === true, null, { timeout: 45000 });
  } catch (error) {
    await page.close().catch(() => {});
    throw new CaptureFailure(`Renderer did not signal ready: ${error.message}`, 1);
  }

  const canvas = await page.evaluate(() => {
    const element = document.querySelector('#game');
    if (!element) return null;
    const gl = element.getContext('webgl2') || element.getContext('webgl');
    return {
      width: element.width,
      height: element.height,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      webgl: Boolean(gl)
    };
  });
  if (!canvas || !canvas.webgl || canvas.width < 32 || canvas.height < 32) {
    await page.close().catch(() => {});
    throw new CaptureFailure(`WebGL canvas is not rendering (${JSON.stringify(canvas)})`, 1);
  }

  await page.waitForFunction(() => {
    const loading = document.querySelector('#loading');
    const start = document.querySelector('#start-screen');
    if (!start) return true;
    return start.classList.contains('leaving') || start.offsetParent === null;
  }, null, { timeout: 15000 }).catch(async (error) => {
    await page.close().catch(() => {});
    throw new CaptureFailure(`Game shell did not settle: ${error.message}`, 1);
  });

  await page.waitForTimeout(2600);
  const file = join(captureDirectory, `final-${name}.png`);
  try {
    await page.screenshot({ path: file, timeout: 30000 });
  } catch (error) {
    await page.close().catch(() => {});
    if (error.name === 'TimeoutError' || !browser.isConnected()) throw transient(error);
    throw new CaptureFailure(`Screenshot failed: ${error.message}`, 1);
  }
  if (!existsSync(file) || statSync(file).size < 8000) {
    await page.close().catch(() => {});
    throw new CaptureFailure(`Screenshot ${file} is missing or blank`, 1);
  }
  mark(`${name}-captured`);
  console.log(`Captured ${name} ${width}x${height} -> ${file} (${Math.round(statSync(file).size / 1024)} KB)`);
  await page.close();
}

let exitCode = 0;
try {
  try {
    browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 });
  } catch (error) {
    throw transient(error);
  }
  mark('browser-launched');
  await captureViewport('desktop', 1440, 900);
  await captureViewport('mobile', 390, 844);
  if (pageErrors.length) throw new CaptureFailure(`Page errors: ${pageErrors.join(' | ')}`, 1);
  if (consoleErrors.length) console.log(`Capture completed with ${consoleErrors.length} console error(s).`);
} catch (error) {
  exitCode = error instanceof CaptureFailure ? error.code : 1;
  console.error(error.stack || error.message || String(error));
} finally {
  if (browser) {
    try {
      await browser.close();
      mark('browser-closed');
    } catch (error) {
      console.error(`Browser close failed: ${error.message}`);
      if (!exitCode) exitCode = 75;
    }
  }
  console.log(`Capture timing: ${JSON.stringify(marks)}`);
}

process.exitCode = exitCode;
