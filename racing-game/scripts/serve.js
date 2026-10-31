// Serve script for the Mario Kart 3D Racer game
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const distDir = path.join(__dirname, '../dist');

function getContentType(ext) {
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

function startServer(port = 3000) {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        let filePath = path.join(distDir, parsedUrl.pathname);
        
        if (parsedUrl.pathname === '/') {
            filePath = path.join(distDir, 'index.html');
        }
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // File not found, try to serve index.html for SPA
                if (parsedUrl.pathname.includes('.')) {
                    res.writeHead(404);
                    res.end('File not found');
                    return;
                }
                
                fs.readFile(path.join(distDir, 'index.html'), (err2, indexData) => {
                    if (err2) {
                        res.writeHead(500);
                        res.end('Internal server error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(indexData);
                });
                return;
            }
            
            const ext = path.extname(filePath);
            const contentType = getContentType(ext);
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
    
    server.listen(port, () => {
        console.log(`\n🚀 Mario Kart 3D Racer Server running at http://localhost:${port}`);
        console.log(`📁 Serving files from: ${distDir}`);
        console.log(`🎮 Open your browser and navigate to http://localhost:${port}`);
        console.log(`📝 Press Ctrl+C to stop the server\n`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${port} is already in use`);
            console.log('💡 Try a different port: node scripts/serve.js 3001');
            process.exit(1);
        } else {
            console.error('❌ Server error:', error.message);
            process.exit(1);
        }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        server.close(() => {
            console.log('✅ Server stopped gracefully');
            process.exit(0);
        });
    });
    
    return server;
}

// Run if this is the main module
if (require.main === module) {
    const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;
    startServer(port);
}

module.exports = { startServer };