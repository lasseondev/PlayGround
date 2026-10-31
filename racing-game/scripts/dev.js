// Development script for the Mario Kart 3D Racer game
const DevTools = {
  // Watch for file changes and reload browser
  watchFiles() {
    const fs = require('fs');
    const path = require('path');
    const chokidar = require('chokidar');
    
    const srcDir = path.join(__dirname, '../src');
    const distDir = path.join(__dirname, '../dist');
    
    // Watch source files
    const watcher = chokidar.watch([
      `${srcDir}/**/*.js`,
      `${srcDir}/**/*.css`,
      `${srcDir}/**/*.html`
    ], {
      ignored: /node_modules/,
      persistent: true
    });
    
    let rebuildTimer = null;
    
    watcher.on('change', (filePath) => {
      console.log(`File changed: ${path.relative(srcDir, filePath)}`);
      
      if (rebuildTimer) {
        clearTimeout(rebuildTimer);
      }
      
      rebuildTimer = setTimeout(() => {
        console.log('Rebuilding due to file changes...');
        this.rebuild();
      }, 500);
    });
    
    watcher.on('add', (filePath) => {
      console.log(`File added: ${path.relative(srcDir, filePath)}`);
    });
    
    watcher.on('unlink', (filePath) => {
      console.log(`File removed: ${path.relative(srcDir, filePath)}`);
      this.rebuild();
    });
    
    console.log('Watching for file changes...');
    return watcher;
  },
  
  // Build the project
  async rebuild() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Build JavaScript files
      await this.buildJS();
      
      // Copy other files
      this.copyStaticFiles();
      
      console.log('✓ Rebuild complete');
    } catch (error) {
      console.error('✗ Rebuild failed:', error.message);
    }
  },
  
  // Build JavaScript files
  async buildJS() {
    const fs = require('fs').promises;
    const path = require('path');
    const Terser = require('terser');
    
    const srcDir = path.join(__dirname, '../src');
    const distDir = path.join(__dirname, '../dist');
    
    // Ensure dist directory exists
    await fs.mkdir(distDir, { recursive: true });
    
    // Process each JavaScript file
    const files = [
      'Game.js',
      'scene.js',
      'ThreeUtils.js',
      'PhysicsUtils.js',
      'ControlHandler.js',
      'AudioSystem.js'
    ];
    
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const distPath = path.join(distDir, file);
      
      try {
        const content = await fs.readFile(srcPath, 'utf8');
        const minified = await Terser.minify(content, {
          mangle: true,
          compress: true,
          format: {
            comments: false
          }
        });
        
        await fs.writeFile(distPath, minified.code);
        console.log(`✓ Built ${file}`);
      } catch (error) {
        console.warn(`⚠ Failed to build ${file}: ${error.message}`);
      }
    }
  },
  
  // Copy static files
  copyStaticFiles() {
    const fs = require('fs');
    const path = require('path');
    
    const srcDir = path.join(__dirname, '..');
    const distDir = path.join(__dirname, '../dist');
    
    // Copy index.html
    const htmlSrc = path.join(srcDir, 'index.html');
    const htmlDest = path.join(distDir, 'index.html');
    
    if (fs.existsSync(htmlSrc)) {
      fs.copyFileSync(htmlSrc, htmlDest);
      console.log('✓ Copied index.html');
    }
    
    // Copy README.md
    const readmeSrc = path.join(srcDir, 'README.md');
    const readmeDest = path.join(distDir, 'README.md');
    
    if (fs.existsSync(readmeSrc)) {
      fs.copyFileSync(readmeSrc, readmeDest);
      console.log('✓ Copied README.md');
    }
  },
  
  // Start development server
  startDevServer() {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    
    const distDir = path.join(__dirname, '../dist');
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let filePath = path.join(distDir, parsedUrl.pathname);
      
      if (parsedUrl.pathname === '/') {
        filePath = path.join(distDir, 'index.html');
      }
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('File not found');
          return;
        }
        
        const ext = path.extname(filePath);
        const contentType = this.getContentType(ext);
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
    
    const port = 3000;
    server.listen(port, () => {
      console.log(`Development server running at http://localhost:${port}`);
      console.log('Press Ctrl+C to stop the server');
    });
    
    return server;
  },
  
  // Get content type based on file extension
  getContentType(ext) {
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    };
    
    return contentTypes[ext] || 'text/plain';
  }
};

// Run development mode
async function runDevMode() {
  console.log('Starting Mario Kart 3D Racer development mode...');
  
  // Check if required modules are installed
  try {
    require('chokidar');
  } catch (error) {
    console.log('Installing chokidar...');
    require('child_process').execSync('npm install chokidar', { stdio: 'inherit' });
  }
  
  try {
    require('terser');
  } catch (error) {
    console.log('Installing terser...');
    require('child_process').execSync('npm install terser', { stdio: 'inherit' });
  }
  
  // Build initially
  await DevTools.rebuild();
  
  // Start watching for changes
  const watcher = DevTools.watchFiles();
  
  // Start development server
  const server = DevTools.startDevServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    watcher.close();
    server.close();
    process.exit(0);
  });
}

// Run if this is the main module
if (require.main === module) {
  runDevMode().catch(console.error);
}

module.exports = DevTools;