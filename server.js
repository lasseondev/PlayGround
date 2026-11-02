"use strict";

const fs = require('fs');
const path = require('path');
const http = require('http');

class GameServer {
  constructor() {
    this.projectDir = '/home/runner/work/PlayGround/PlayGround';
    this.port = process.env.PORT || 3000;
    this.server = null;
    
    // Write deployment output on server start
    this.writeDeploymentOutput();
    
    // Start the server
    this.start();
  }

  writeDeploymentOutput() {
    const deploymentOutput = {
      project: this.projectDir,
      directory: path.join(this.projectDir, 'dist')
    };
    
    const tempDir = '/home/runner/work/_temp/omgithub-web';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const deploymentOutputPath = path.join(tempDir, 'deployment-output.json');
    fs.writeFileSync(deploymentOutputPath, JSON.stringify(deploymentOutput, null, 2));
    console.log(`Deployment output written to ${deploymentOutputPath}`);
  }

  start() {
    console.log(`Starting game server on port ${this.port}...`);
    
    this.server = http.createServer((req, res) => {
      // Handle API routes
      if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'running',
          port: this.port,
          timestamp: new Date().toISOString()
        }));
        return;
      }
      
      // Serve static files
      const filePath = path.join(this.projectDir, 'dist', req.url === '/' ? 'index.html' : req.url);
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon'
        }[ext] || 'text/plain';
        
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      console.log(`Game accessible at http://localhost:${this.port}`);
      console.log(`API status available at http://localhost:${this.port}/api/status`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Server stopped');
      });
    }
  }
}

// Start the game server
const gameServer = new GameServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  gameServer.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  gameServer.stop();
  process.exit(0);
});

console.log('Game server initialized');