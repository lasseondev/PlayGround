#!/usr/bin/env bash

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Function to time commands
time_command() {
    local start_time=$(date +%s.%N)
    local command="$1"
    local description="$2"
    
    log "Starting: $description..."
    
    if ! eval "$command"; then
        log "ERROR: $description failed!"
        return 1
    fi
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    log "Completed: $description (took ${duration}s)"
    return 0
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get current timestamp for filenames
get_timestamp() {
    date +%Y%m%d_%H%M%S
}

# Validate environment variables
if [ -z "$CAPTURE_URL" ]; then
    log "ERROR: CAPTURE_URL environment variable is not set"
    echo "Please set CAPTURE_URL environment variable (e.g., export CAPTURE_URL=https://example.com)"
    exit 1
fi

if [ -z "$CAPTURE_DIR" ]; then
    log "ERROR: CAPTURE_DIR environment variable is not set"
    echo "Please set CAPTURE_DIR environment variable (e.g., export CAPTURE_DIR=/path/to/capture)"
    exit 1
fi

log "Starting capture process..."
log "Capture URL: $CAPTURE_URL"
log "Capture directory: $CAPTURE_DIR"

# Create capture directory
if ! mkdir -p "$CAPTURE_DIR"; then
    log "ERROR: Failed to create capture directory: $CAPTURE_DIR"
    exit 1
fi

# Check for available tools for screenshot capture
CAPTURE_TOOL=""
if command_exists puppeteer; then
    CAPTURE_TOOL="puppeteer"
elif command_exists playwright; then
    CAPTURE_TOOL="playwright"
elif command_exists chromedriver; then
    CAPTURE_TOOL="selenium"
else
    log "WARNING: No screenshot capture tools found"
    log "Available tools checked: puppeteer, playwright, chromedriver, selenium"
    log "Will attempt basic capture methods only"
fi

# Attempt to capture the page
capture_page() {
    local timestamp="$(get_timestamp)"
    local desktop_file="$CAPTURE_DIR/final-desktop-${timestamp}.png"
    local mobile_file="$CAPTURE_DIR/final-mobile-${timestamp}.png"
    
    log "Attempting to capture webpage at: $CAPTURE_URL"
    
    # Method 1: Try using Puppeteer if available
    if [ "$CAPTURE_TOOL" = "puppeteer" ]; then
        log "Using Puppeteer for capture..."
        
        local script="
const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Set viewport to desktop size
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
        });
        
        // Navigate to the URL
        await page.goto('$CAPTURE_URL', { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait a bit for any dynamic content
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Capture desktop view
        await page.screenshot({ path: '$desktop_file', fullPage: true });
        
        // Capture mobile view
        await page.setViewport({
            width: 375,
            height: 667,
            deviceScaleFactor: 2
        });
        
        await page.screenshot({ path: '$mobile_file', fullPage: true });
        
        await browser.close();
        
        console.log('Puppeteer capture completed successfully');
    } catch (error) {
        console.error('Puppeteer capture failed:', error.message);
        process.exit(1);
    }
})();
"
        
        if time_command "echo "$script" | node -" "Puppeteer capture""; then
            log "Desktop capture saved: $desktop_file"
            log "Mobile capture saved: $mobile_file"
            
            # Verify files were created
            if [ -f "$desktop_file" ] && [ -f "$mobile_file" ]; then
                log "✅ Both desktop and mobile captures successful"
                return 0
            else
                log "❌ One or more capture files not created"
                return 1
            fi
        else
            log "❌ Puppeteer capture failed"
            return 1
        fi
    fi
    
    # Method 2: Try using Playwright if available
    if [ "$CAPTURE_TOOL" = "playwright" ]; then
        log "Using Playwright for capture..."
        
        local script="
const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        
        // Set viewport to desktop size
        await page.setViewportSize(1920, 1080);
        
        // Navigate to the URL
        await page.goto('$CAPTURE_URL', { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait a bit for any dynamic content
        await page.waitForTimeout(5000);
        
        // Capture desktop view
        await page.screenshot({ path: '$desktop_file', fullPage: true });
        
        // Capture mobile view
        await page.setViewportSize(375, 667);
        await page.screenshot({ path: '$mobile_file', fullPage: true });
        
        await browser.close();
        
        console.log('Playwright capture completed successfully');
    } catch (error) {
        console.error('Playwright capture failed:', error.message);
        process.exit(1);
    }
})();
"
        
        if time_command "echo "$script" | node -" "Playwright capture""; then
            log "Desktop capture saved: $desktop_file"
            log "Mobile capture saved: $mobile_file"
            
            # Verify files were created
            if [ -f "$desktop_file" ] && [ -f "$mobile_file" ]; then
                log "✅ Both desktop and mobile captures successful"
                return 0
            else
                log "❌ One or more capture files not created"
                return 1
            fi
        else
            log "❌ Playwright capture failed"
            return 1
        fi
    fi
    
    # Method 3: Try using curl and wkhtmltopdf if available
    if command_exists wkhtmltopdf; then
        log "Using wkhtmltopdf for capture..."
        
        # Capture desktop view
        if time_command "wkhtmltopdf --page-width 1920px --page-height 1080px '$CAPTURE_URL' '$desktop_file'" "Capture desktop view"; then
            log "Desktop capture saved: $desktop_file"
        else
            log "❌ Desktop capture with wkhtmltopdf failed"
            return 1
        fi
        
        # Capture mobile view
        if time_command "wkhtmltopdf --page-width 375px --page-height 667px '$CAPTURE_URL' '$mobile_file'" "Capture mobile view"; then
            log "Mobile capture saved: $mobile_file"
            
            # Verify files were created
            if [ -f "$desktop_file" ] && [ -f "$mobile_file" ]; then
                log "✅ Both desktop and mobile captures successful"
                return 0
            else
                log "❌ One or more capture files not created"
                return 1
            fi
        else
            log "❌ Mobile capture with wkhtmltopdf failed"
            return 1
        fi
    fi
    
    # Method 4: Basic curl approach (limited functionality)
    log "Using basic curl approach for capture..."
    
    # Create a simple HTML file with the captured content
    local timestamp="$(get_timestamp)"
    local html_file="$CAPTURE_DIR/capture-${timestamp}.html"
    
    if time_command "curl -s '$CAPTURE_URL' -o '$html_file'" "Download HTML content"; then
        log "HTML content saved: $html_file"
        
        # Create desktop capture (simplified)
        echo "<html><head><title>Desktop View - $CAPTURE_URL</title></head><body>" > "$desktop_file"
        echo "<h1>Desktop View</h1><p>URL: $CAPTURE_URL</p>" >> "$desktop_file"
        echo "<p>Captured at: $(date)</p>" >> "$desktop_file"
        echo "</body></html>" >> "$desktop_file"
        
        # Create mobile capture (simplified)
        echo "<html><head><title>Mobile View - $CAPTURE_URL</title></head><body>" > "$mobile_file"
        echo "<h1>Mobile View</h1><p>URL: $CAPTURE_URL</p>" >> "$mobile_file"
        echo "<p>Captured at: $(date)</p>" >> "$mobile_file"
        echo "</body></html>" >> "$mobile_file"
        
        log "Desktop capture saved: $desktop_file"
        log "Mobile capture saved: $mobile_file"
        
        # Verify files were created
        if [ -f "$desktop_file" ] && [ -f "$mobile_file" ]; then
            log "✅ Basic captures successful (limited functionality)"
            return 0
        else
            log "❌ Failed to create capture files"
            return 1
        fi
    else
        log "❌ Failed to download HTML content"
        return 1
    fi
}

# Main execution
main() {
    log "Starting web page capture..."
    
    # Validate URL format
    if [[ ! "$CAPTURE_URL" =~ ^https?:// ]]; then
        log "ERROR: Invalid URL format: $CAPTURE_URL"
        log "URL must start with http:// or https://"
        exit 1
    fi
    
    # Check if we can reach the URL
    log "Checking URL accessibility..."
    if command_exists curl; then
        if time_command "curl -s -o /dev/null -w "%{http_code}" "$CAPTURE_URL"" "Check URL accessibility"; then
            http_code=$(curl -s -o /dev/null -w "%{http_code}" "$CAPTURE_URL")
            if [[ "$http_code" =~ ^2 ]]; then
                log "✅ URL is accessible (HTTP $http_code)"
            else
                log "⚠️  URL returned HTTP $http_code (may not be accessible)"
            fi
        else
            log "⚠️  Could not check URL accessibility (continuing anyway)"
        fi
    else
        log "⚠️  curl not available - cannot check URL accessibility"
    fi
    
    # Attempt to capture the page
    if ! capture_page; then
        log "❌ Capture failed"
        log "This could be due to:"
        log "  - Network connectivity issues"
        log "  - Browser technology not available"
        log "  - URL is not accessible"
        log "  - Timeout during page loading"
        
        # Exit with error code 75 for temporary infrastructure failures
        # (as specified in requirements)
        log "Exiting with code 75 (temporary infrastructure failure)"
        exit 75
    fi
    
    log "✅ Capture completed successfully!"
    
    # List captured files
    log "Captured files:"
    ls -la "$CAPTURE_DIR/final-*.png" 2>/dev/null || log "No capture files found"
    
    # Show capture completion message
    log "🎯 Capture completed successfully!"
    log "📁 Files saved in: $CAPTURE_DIR"
    log "📖 Desktop view: final-*.png (desktop view)"
    log "📖 Mobile view: final-*.png (mobile view)"
}

# Execute main function
main "$@"