"use strict";

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ScreenCapture {
  constructor(captureUrl, captureDir) {
    this.captureUrl = captureUrl;
    this.captureDir = captureDir;
    this.browser = null;
    this.page = null;
    
    // Create capture directory if it doesn't exist
    if (!fs.existsSync(this.captureDir)) {
      fs.mkdirSync(this.captureDir, { recursive: true });
    }
  }

  async waitForPageLoad(url, timeout = 30000) {
    console.log(`Waiting for page load at ${url}...`);
    
    let lastError = null;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
        if (response && response.ok()) {
          console.log(`Page loaded successfully in ${Date.now() - startTime}ms`);
          return true;
        }
      } catch (error) {
        lastError = error;
        console.log(`Page load attempt failed: ${error.message}");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.error(`Page failed to load after ${timeout}ms: ${lastError?.message || 'Unknown error'}`);
    return false;
  }

  async captureViewport(width, height, filename) {
    console.log(`Capturing viewport ${width}x${height} to ${filename}...`);
    
    try {
      await this.page.setViewport({ width, height });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for layout
      
      await this.page.screenshot({
        path: filename,
        fullPage: false,
        type: 'png',
        quality: 90
      });
      
      console.log(`Screenshot saved to ${filename}`);
      return true;
    } catch (error) {
      console.error(`Failed to capture ${filename}: ${error.message}`);
      return false;
    }
  }

  async runCapture() {
    console.log('Starting screen capture process...');
    console.log(`URL: ${this.captureUrl}`);
    console.log(`Output directory: ${this.captureDir}`);
    
    try {
      // Launch browser with appropriate options
      console.log('Launching browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-popup-blocking',
          '--disable-default-app-menu',
          '--disable-background-networking',
          '--disable-sync',
          '--metrics-recording-only',
          '--disable-speech-api',
          '--disable-web-security'
        ]
      });
      
      this.page = await this.browser.newPage();
      
      // Set user agent to simulate real browser
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set default timeout
      this.page.setDefaultTimeout(30000);
      
      // Wait for page to load
      const pageLoaded = await this.waitForPageLoad(this.captureUrl);
      if (!pageLoaded) {
        throw new Error('Page failed to load within timeout period');
      }
      
      // Capture desktop view
      const desktopPath = path.join(this.captureDir, 'final-desktop.png');
      const desktopSuccess = await this.captureViewport(1920, 1080, desktopPath);
      if (!desktopSuccess) {
        throw new Error('Failed to capture desktop view');
      }
      
      // Capture mobile view
      const mobilePath = path.join(this.captureDir, 'final-mobile.png');
      const mobileSuccess = await this.captureViewport(375, 667, mobilePath);
      if (!mobileSuccess) {
        throw new Error('Failed to capture mobile view');
      }
      
      // Verify screenshots were created
      if (!fs.existsSync(desktopPath) || !fs.existsSync(mobilePath)) {
        throw new Error('Required screenshot files were not created');
      }
      
      console.log('All captures completed successfully');
      console.log(`Desktop screenshot: ${desktopPath}`);
      console.log(`Mobile screenshot: ${mobilePath}`);
      
      return true;
      
    } catch (error) {
      console.error('Capture failed:', error.message);
      return false;
    } finally {
      // Always close browser
      if (this.browser) {
        await this.browser.close();
        console.log('Browser closed');
      }
    }
  }
}

// Main execution
async function main() {
  const captureUrl = process.env.CAPTURE_URL;
  const captureDir = process.env.CAPTURE_DIR;
  
  if (!captureUrl) {
    console.error('Error: CAPTURE_URL environment variable is required');
    process.exit(75);
  }
  
  if (!captureDir) {
    console.error('Error: CAPTURE_DIR environment variable is required');
    process.exit(75);
  }
  
  console.log('Screen capture script starting...');
  console.log(`URL: ${captureUrl}`);
  console.log(`Directory: ${captureDir}`);
  
  const capture = new ScreenCapture(captureUrl, captureDir);
  const success = await capture.runCapture();
  
  if (!success) {
    console.error('Capture process failed');
    process.exit(1);
  }
  
  console.log('Capture process completed successfully');
  process.exit(0);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error.message);
    process.exit(75);
  });
}

module.exports = { ScreenCapture };