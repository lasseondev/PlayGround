"use strict";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GameBuilder {
  constructor() {
    this.projectDir = '/home/runner/work/PlayGround/PlayGround';
    this.distDir = path.join(this.projectDir, 'dist');
    this.deploymentOutputPath = '/home/runner/work/_temp/omgithub-web/deployment-output.json';
  }

  writeDeploymentOutput() {
    const deploymentOutput = {
      project: this.projectDir,
      directory: this.distDir
    };
    
    // Ensure directory exists
    const tempDir = path.dirname(this.deploymentOutputPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(this.deploymentOutputPath, JSON.stringify(deploymentOutput, null, 2));
    console.log(`Deployment output written to ${this.deploymentOutputPath}`);
  }

  buildProject() {
    console.log('Building project...');
    
    // Install dependencies
    try {
      execSync('npm install', { stdio: 'inherit', cwd: this.projectDir });
    } catch (error) {
      console.error('Failed to install dependencies:', error);
      process.exit(1);
    }
    
    // Build the project
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: this.projectDir });
    } catch (error) {
      console.error('Failed to build project:', error);
      process.exit(1);
    }
  }

  serveProject(port = 3000) {
    console.log(`Serving project on port ${port}...`);
    
    // Simple HTTP server
    const http = require('http');
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.distDir, req.url === '/' ? 'index.html' : req.url);
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml'
        }[ext] || 'text/plain';
        
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Project accessible at http://localhost:${port}`);
    });
  }

  start() {
    console.log('Starting game project...');
    
    // Write deployment output
    this.writeDeploymentOutput();
    
    // Build project
    this.buildProject();
    
    // Serve project
    this.serveProject();
  }
}

// Start the game
const gameBuilder = new GameBuilder();
gameBuilder.start();