// Setup script for the Mario Kart 3D Racer game
const fs = require('fs');
const path = require('path');

function logSuccess(message) {
    console.log(`✅ ${message}`);
}

function logError(message) {
    console.log(`❌ ${message}`);
}

function createDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            logSuccess(`Created directory: ${dirPath}`);
        }
    } catch (error) {
        logError(`Failed to create directory ${dirPath}: ${error.message}`);
        return false;
    }
    return true;
}

function createFile(filePath, content) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, content);
        logSuccess(`Created file: ${filePath}`);
    } catch (error) {
        logError(`Failed to create file ${filePath}: ${error.message}`);
        return false;
    }
    return true;
}

function setupProject() {
    console.log('🚀 Setting up Mario Kart 3D Racer project...\n');
    
    const projectRoot = path.join(__dirname, '..');
    const filesToCreate = [
        {
            path: path.join(projectRoot, 'README.md'),
            content: `# 3D Mario Kart Style Racer

A physics-based 3D racing game inspired by Mario Kart with realistic drifting mechanics.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the game:
   ```bash
   npm start
   ```

3. Open your browser to: http://localhost:3000

## Features

- 3D kart racing with realistic physics
- Drift mechanics for enhanced gameplay
- AI opponents with varying difficulty
- Smooth graphics with Three.js
- Responsive controls

## Game Controls

- WASD or Arrow Keys: Move
- Space: Boost
- Drift: Automatic when turning while moving

## Development

- Run `npm run build` to build the project
- Run `npm test` to run tests
- Run `npm run dev` for development mode

This project uses OpenCode and Three.js for 3D rendering.
`
        }
    ];n    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of filesToCreate) {
        if (createFile(file.path, file.content)) {
            successCount++;
        } else {
            errorCount++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Setup Results: ${successCount} files created, ${errorCount} errors`);
    
    if (errorCount === 0) {
        console.log('\n✅ Project setup complete!');
        console.log('\n🎮 Next Steps:');
        console.log('   1. Run: npm install');
        console.log('   2. Run: npm start');
        console.log('   3. Open your browser to http://localhost:3000');
        console.log('\n📖 For more information, see README.md');
    } else {
        console.log('\n❌ Project setup completed with errors.');
        console.log('Please check the errors above and try again.');
        process.exit(1);
    }
}

if (require.main === module) {
    setupProject();
}

module.exports = { setupProject };