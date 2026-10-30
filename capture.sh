#!/usr/bin/env bash
# Capture the deployed app at an exact public URL in desktop and mobile viewports.
# Exit 75 = temporary navigation/browser infrastructure failure; exit 1 = script or rendering defect.
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

: "${CAPTURE_URL:?Set CAPTURE_URL to the exact URL to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to an output directory outside the project.}"

CAPTURE_DIR="$(realpath -m -- "$CAPTURE_DIR")"

case "$CAPTURE_DIR/" in
  "$PROJECT_DIR"/*)
    printf '[capture] Error: CAPTURE_DIR must be outside the project source tree: %s\n' "$CAPTURE_DIR" >&2
    exit 1
    ;;
esac

mkdir -p "$CAPTURE_DIR"

PLAYWRIGHT_ROOT="${PLAYWRIGHT_ROOT:-$HOME/.local/share/omgithub-playwright}"
if [[ ! -d "$PLAYWRIGHT_ROOT/node_modules/playwright" ]]; then
  printf '[capture] Error: Playwright is not installed under %s\n' "$PLAYWRIGHT_ROOT" >&2
  exit 1
fi

export CAPTURE_URL CAPTURE_DIR PLAYWRIGHT_ROOT

printf '[capture] URL: %s\n' "$CAPTURE_URL"
printf '[capture] Output: %s\n' "$CAPTURE_DIR"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

/usr/bin/time -p node - <<'NODE'
"use strict";

(async () => {
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const url = process.env.CAPTURE_URL;
const outputDir = process.env.CAPTURE_DIR;
const playwrightRoot = process.env.PLAYWRIGHT_ROOT;
const { chromium } = require(path.join(playwrightRoot, "node_modules", "playwright"));

const configDir = playwrightRoot;
const configPath = path.join(configDir, process.platform === "darwin" ? "metal.json" : "linux.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
if (process.platform === "linux" && !process.env.DISPLAY) {
  process.env.DISPLAY = ":" + fs.readFileSync(path.join(configDir, "display"), "utf8").trim();
}

const VIEWS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

class CaptureError extends Error {
  constructor(message, exitCode) {
    super(message);
    this.exitCode = exitCode;
  }
}

function elapsed(start) {
  return ((performance.now() - start) / 1000).toFixed(2) + "s";
}

function timed(name, start) {
  console.log(`[capture] ${name}: ${elapsed(start)}`);
}

function looksTransient(error) {
  const text = `${error?.name || ""} ${error?.message || ""}`;
  return /timeout|timed out|ECONN|ENOTFOUND|EAI_AGAIN|net::|socket|target closed|browser has been closed|navigation failed|connection/i.test(text);
}

function transient(context, error) {
  return new CaptureError(`${context}: ${error?.message || error}`, 75);
}

function defect(context, detail) {
  return new CaptureError(`${context}: ${detail}`, 1);
}

async function auditRendering(page) {
  return page.evaluate(() => {
    const text = (document.body?.innerText || "").trim();
    const canvases = Array.from(document.querySelectorAll("canvas"));
    let paintedCanvas = canvases.length === 0;

    for (const canvas of canvases) {
      if (!canvas.width || !canvas.height) continue;
      if (typeof canvas.getContext !== "function") {
        paintedCanvas = true;
        break;
      }
      const context = canvas.getContext("2d");
      if (!context) {
        // A WebGL/WebGPU canvas: geometry cannot be read with getImageData.
        paintedCanvas = true;
        break;
      }
      try {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const stride = 4 * 257;
        for (let index = 0; index < pixels.length; index += stride) {
          if (pixels[index] + pixels[index + 1] + pixels[index + 2] > 24) {
            paintedCanvas = true;
            break;
          }
        }
      } catch {
        paintedCanvas = true;
      }
      if (paintedCanvas) break;
    }

    return {
      textLength: text.length,
      textSample: text.slice(0, 180).replace(/\s+/g, " "),
      canvasCount: canvases.length,
      paintedCanvas,
      readyState: document.readyState
    };
  });
}

function validateScreenshot(file, view) {
  const bytes = fs.readFileSync(file);
  if (bytes.length < 5000) {
    throw defect("render", `${path.basename(file)} is only ${bytes.length} bytes`);
  }
  if (bytes.length < 24 || bytes.toString("ascii", 1, 4) !== "PNG") {
    throw defect("render", `${path.basename(file)} is not a PNG`);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < view.width - 20 || height < view.height - 20) {
    throw defect("render", `${path.basename(file)} is ${width}x${height}, expected about ${view.width}x${view.height}`);
  }
  return { width, height, size: bytes.length };
}

let browser;
let exitCode = 0;

try {
  let started = performance.now();
  browser = await chromium.launch({
    ...config.browser.launchOptions,
    timeout: 30000
  }).catch((error) => {
    throw transient("browser launch failed", error);
  });
  timed("launch browser", started);

  for (const view of VIEWS) {
    started = performance.now();
    let page;
    try {
      page = await browser.newPage({
        viewport: { width: view.width, height: view.height },
        deviceScaleFactor: 1
      });
    } catch (error) {
      throw transient(`creating ${view.name} page failed`, error);
    }
    timed(`create ${view.name} page`, started);

    page.setDefaultTimeout(30000);
    const pageErrors = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
      console.warn(`[capture] ${view.name} page error: ${error.message}`);
    });

    started = performance.now();
    let response;
    try {
      response = await page.goto(url, { waitUntil: "load", timeout: 45000 });
    } catch (error) {
      if (looksTransient(error)) throw transient(`navigating ${view.name} to ${url} failed`, error);
      throw defect(`navigating ${view.name} to ${url} failed`, error.message);
    }
    timed(`navigate ${view.name}`, started);

    if (!response) {
      throw transient("navigation returned no response", new Error("empty response"));
    }
    if (!response.ok()) {
      const status = response.status();
      const code = status === 408 || status === 429 || status >= 500 ? 75 : 1;
      throw new CaptureError(`HTTP ${status} loading ${url}`, code);
    }

    started = performance.now();
    const readySelector = process.env.CAPTURE_READY_SELECTOR || "body";
    try {
      await page.locator(readySelector).first().waitFor({ state: "visible", timeout: 30000 });
      await page.waitForFunction(() => document.fonts.status === "loaded", null, { timeout: 15000 }).catch(() => {});
    } catch (error) {
      const message = `${error?.name || ""} ${error?.message || ""}`;
      if (/target closed|browser has been closed|crash/i.test(message)) {
        throw transient(`browser failed while waiting for ${readySelector}`, error);
      }
      throw defect("render", `selector ${readySelector} did not become visible (${error?.message || error})`);
    }
    await page.waitForTimeout(700);
    timed(`wait for rendered content (${view.name})`, started);

    started = performance.now();
    let audit = await auditRendering(page);
    if (audit.textLength === 0 && !audit.paintedCanvas) {
      await page.waitForTimeout(1200);
      audit = await auditRendering(page);
    }
    if (audit.textLength === 0 && !audit.paintedCanvas) {
      throw defect(
        "render",
        `page is blank (text=${audit.textLength}, canvases=${audit.canvasCount}, painted=${audit.paintedCanvas})`
      );
    }
    timed(`audit rendered content (${view.name})`, started);
    console.log(
      `[capture] ${view.name} content: ${audit.textLength} text chars, ` +
      `${audit.canvasCount} canvas(es), painted=${audit.paintedCanvas}, sample="${audit.textSample}"`
    );
    if (pageErrors.length) console.warn(`[capture] ${view.name} had ${pageErrors.length} page error(s)`);

    started = performance.now();
    const screenshotPath = path.join(outputDir, `final-${view.name}.png`);
    try {
      await page.screenshot({ path: screenshotPath, timeout: 30000, fullPage: false });
    } catch (error) {
      if (looksTransient(error) || !browser.isConnected()) {
        throw transient(`screenshot ${view.name} failed`, error);
      }
      throw defect("render", `screenshot ${view.name} failed: ${error.message}`);
    }
    timed(`screenshot ${view.name}`, started);

    const details = validateScreenshot(screenshotPath, view);
    console.log(
      `[capture] wrote ${screenshotPath} ` +
      `(${details.width}x${details.height}, ${Math.round(details.size / 1024)} KiB)`
    );

    started = performance.now();
    await page.close().catch((error) => console.warn(`[capture] closing ${view.name} page: ${error.message}`));
    timed(`close ${view.name} page`, started);
  }

  console.log("[capture] PASS: desktop and mobile screenshots captured");
} catch (error) {
  exitCode = error instanceof CaptureError ? error.exitCode : (looksTransient(error) ? 75 : 1);
  console.error(`[capture] ERROR (exit ${exitCode}): ${error?.message || error}`);
} finally {
  if (browser) {
    const started = performance.now();
    await browser.close().catch((error) => {
      console.error(`[capture] Error closing browser: ${error.message}`);
      if (!exitCode) exitCode = 75;
    });
    timed("close browser", started);
  }
}

process.exitCode = exitCode;
})().catch((error) => {
  console.error(`[capture] ERROR (exit 1): ${error?.stack || error}`);
  process.exitCode = 1;
});
NODE

exit $?
