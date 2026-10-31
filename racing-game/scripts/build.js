const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function minifyJs(file) {
    const content = fs.readFileSync(file, 'utf8');
    const result = await minify(content, {
        mangle: true,
        compress: true,
        format: {
            comments: false
        }
    });
    return result.code;
}

async function build() {
    console.log('Building Mario Kart 3D Racer...');
    
    ensureDir(distDir);
    
    // Copy and minify main game files
    const files = ['Game.js'];
    
    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        
        if (fs.existsSync(srcPath)) {
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // Add minification
            if (file.endsWith('.js')) {
                content = await minifyJs(srcPath);
            }
            
            fs.writeFileSync(distPath, content);
            console.log(`✓ Built ${file}`);
        }
    }
    
    // Copy HTML file
    const htmlSrc = path.join(__dirname, '../index.html');
    const htmlDest = path.join(distDir, 'index.html');
    if (fs.existsSync(htmlSrc)) {
        fs.copyFileSync(htmlSrc, htmlDest);
        console.log('✓ Copied index.html');
    }
    
    // Create a simple index.js for the main game entry
    const gameEntry = `// Mario Kart 3D Racer - Game Entry Point
import './Game.js';

// Game is automatically instantiated when DOM is loaded
console.log('Mario Kart 3D Racer loaded successfully!');
`;
    
    fs.writeFileSync(path.join(distDir, 'index.js'), gameEntry);
    console.log('✓ Created game entry point');
    
    console.log('\nBuild complete! Files are in the dist/ directory.');
}

if (require.main === module) {
    build().catch(console.error);
}

module.exports = { build };