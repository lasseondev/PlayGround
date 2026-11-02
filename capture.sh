#!/usr/bin/env bash
set -euo pipefail

# Capture script with timing and error handling
start_time=$(date +%s)

# Validate required environment variables
if [[ -z "${CAPTURE_URL:-}" ]]; then
    echo "❌ Error: CAPTURE_URL environment variable is required"
    echo "Usage: CAPTURE_URL='...' CAPTURE_DIR='...' $0"
    exit 1
fi

if [[ -z "${CAPTURE_DIR:-}" ]]; then
    echo "❌ Error: CAPTURE_DIR environment variable is required"
    echo "Usage: CAPTURE_URL='...' CAPTURE_DIR='...' $0"
    exit 1
fi

# Create capture directory
mkdir -p "${CAPTURE_DIR}"
cd "${CAPTURE_DIR}"

# Function to measure execution time
measure_time() {
    local start=$1
    local end=$2
    local cmd=$3
    local duration=$((end - start))
    echo "⏱️  Command '${cmd}' took ${duration}s"
}

# Function to capture webpage
try_capture() {
    local url=$1
    local filename=$2
    local width=$3
    local height=$4
    local start=$5
    
    echo "🖼️  Capturing ${filename} (${width}x${height}) from ${url}"
    
    # Try multiple capture methods
    local capture_method=""
    local capture_available=0
    
    # Check for available tools
    if command -v wkhtmltopopup >/dev/null 2>&1; then
        capture_method="wkhtmltopopup"
    elif command -v puppeteer >/dev/null 2>&1; then
        capture_method="puppeteer"
    elif command -v playwright >/dev/null 2>&1; then
        capture_method="playwright"
    elif command -v selenium >/dev/null 2>&1; then
        capture_method="selenium"
    elif command -v xwd >/dev/null 2>&1 && command -v import >/dev/null 2>&1; then
        capture_method="desktop_screenshot"
    fi
    
    case $capture_method in
        "wkhtmltopopup")
            # Use wkhtmltopopup for PDF capture
            end=$(date +%s)
            wkhtmltopopup --page-width $width --page-height $height --quality 95 "$url" "${filename}.pdf" 2>/dev/null
            # Convert PDF to PNG
            if command -v pdftocairo >/dev/null 2>&1; then
                pdftocairo -png "${filename}.pdf" "${filename}"
                rm "${filename}.pdf"
            else
                echo "⚠️  pdftocairo not found, PDF saved as ${filename}.pdf"
            fi
            measure_time $start $(date +%s) "wkhtmltopopup capture"
            ;;
        
        "puppeteer")
            # Use Node.js with Puppeteer
            end=$(date +%s)
            node -e "
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: $width, height: $height });
    await page.goto('$url', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: '${filename}.png', fullPage: true });
    await browser.close();
})();
" 2>/dev/null
            measure_time $start $(date +%s) "Puppeteer capture"
            ;;
        
        "playwright")
            # Use Node.js with Playwright
            end=$(date +%s)
            node -e "
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: $width, height: $height });
    await page.goto('$url', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '${filename}.png', fullPage: true });
    await browser.close();
})();
" 2>/dev/null
            measure_time $start $(date +%s) "Playwright capture"
            ;;
        
        "selenium")
            # Use Node.js with Selenium
            end=$(date +%s)
            node -e "
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
(async () => {
    const options = new chrome.Options();
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    await driver.get('$url');
    await driver.manage().window().setSize({ width: $width, height: $height });
    await driver.takeScreenshot();
    await driver.quit();
})();
" 2>/dev/null
            measure_time $start $(date +%s) "Selenium capture"
            ;;
        
        "desktop_screenshot")
            # Use system tools for desktop screenshot
            end=$(date +%s)
            # This is a simple approach - more robust tools would be better
            echo "⚠️  Limited capture method available for ${filename}"
            echo "Falling back to URL screenshot if available"
            measure_time $start $(date +%s) "Desktop screenshot attempt"
            ;;
        
        *)
            echo "❌ Error: No supported capture tool found"
            echo "Please install wkhtmltopopup, puppeteer, playwright, selenium, or set up system screenshot tools"
            exit 75
            ;;
    esac
    
    # Check if capture was successful
    if [[ ! -f "${filename}.png" && ! -f "${filename}" && ! -f "${filename}.pdf" ]]; then
        echo "❌ Error: Capture failed for ${filename}"
        return 1
    fi
    
    return 0
}

# Main capture process
main_start=$(date +%s)

echo "🚀 Starting capture process..."
echo "📍 URL: ${CAPTURE_URL}"
echo "📁 Output directory: ${CAPTURE_DIR}"

# Capture desktop view (1920x1080)
desktop_start=$(date +%s)
if ! try_capture "${CAPTURE_URL}" "final-desktop" 1920 1080 "$desktop_start"; then
    echo "❌ Desktop capture failed - exiting"
    exit 1
fi

# Capture mobile view (375x667 - iPhone SE dimensions)
mobile_start=$(date +%s)
if ! try_capture "${CAPTURE_URL}" "final-mobile" 375 667 "$mobile_start"; then
    echo "❌ Mobile capture failed - exiting"
    exit 1
fi

main_end=$(date +%s)
measure_time "$main_start" "$main_end" "Full capture process"

# Verify captured files
if [[ ! -f "final-desktop.png" && ! -f "final-desktop" ]]; then
    echo "❌ Error: final-desktop.png or final-desktop not found"
    exit 1
fi

if [[ ! -f "final-mobile.png" && ! -f "final-mobile" ]]; then
    echo "❌ Error: final-mobile.png or final-mobile not found"
    exit 1
fi

# Create capture evidence file
echo "Capture completed successfully" > "capture-evidence.txt"
echo "Desktop: $(ls -la final-desktop* 2>/dev/null || echo 'Not found')" >> "capture-evidence.txt"
echo "Mobile: $(ls -la final-mobile* 2>/dev/null || echo 'Not found')" >> "capture-evidence.txt"

echo "✅ Capture completed successfully!"

# Keep the app running (as requested)
echo "🔄 Keeping app running..."
while true; do
    sleep 300  # Sleep for 5 minutes
    echo "💓 Heartbeat check - $(date)"
done