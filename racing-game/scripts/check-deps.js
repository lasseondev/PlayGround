// Dependency checker for the Mario Kart 3D Racer game
const fs = require('fs');
const path = require('path');

function checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1));
    
    if (majorVersion < 18) {
        console.error('❌ Node.js version is too old. Please install Node.js 18 or higher.');
        console.log(`   Current version: ${version}`);
        return false;
    }
    
    console.log(`✅ Node.js version: ${version}`);
    return true;
}

function checkPackageJson() {
    const packagePath = path.join(__dirname, '../package.json');
    
    if (!fs.existsSync(packagePath)) {
        console.error('❌ package.json not found');
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        const requiredScripts = ['start', 'dev', 'build', 'test'];
        const missingScripts = [];
        
        requiredScripts.forEach(script => {
            if (!packageJson.scripts || !packageJson.scripts[script]) {
                missingScripts.push(script);
            }
        });
        
        if (missingScripts.length > 0) {
            console.error(`❌ Missing scripts in package.json: ${missingScripts.join(', ')}`);
            return false;
        }
        
        console.log('✅ package.json found with required scripts');
        return true;
    } catch (error) {
        console.error('❌ Failed to parse package.json:', error.message);
        return false;
    }
}

function checkSourceFiles() {
    const srcDir = path.join(__dirname, '../src');
    
    if (!fs.existsSync(srcDir)) {
        console.error('❌ src/ directory not found');
        return false;
    }
    
    const requiredFiles = [
        'Game.js',
        'scene.js',
        'ThreeUtils.js',
        'PhysicsUtils.js',
        'ControlHandler.js',
        'AudioSystem.js'
    ];
    
    const missingFiles = [];
    requiredFiles.forEach(file => {
        const filePath = path.join(srcDir, file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        console.error(`❌ Missing source files: ${missingFiles.join(', ')}`);
        return false;
    }
    
    console.log('✅ All required source files found');
    return true;
}

function checkScriptsDirectory() {
    const scriptsDir = path.join(__dirname, '..');
    
    const requiredScripts = [
        'scripts/build.js',
        'scripts/test.js',
        'scripts/dev.js',
        'scripts/serve.js',
        'scripts/check-deps.js'
    ];
    
    const missingScripts = [];
    requiredScripts.forEach(script => {
        const scriptPath = path.join(scriptsDir, script);
        if (!fs.existsSync(scriptPath)) {
            missingScripts.push(script);
        }
    });
    
    if (missingScripts.length > 0) {
        console.error(`❌ Missing script files: ${missingScripts.join(', ')}`);
        return false;
    }
    
    console.log('✅ All required script files found');
    return true;
}

function checkHTMLFile() {
    const htmlPath = path.join(__dirname, '../index.html');
    
    if (!fs.existsSync(htmlPath)) {
        console.error('❌ index.html not found');
        return false;
    }
    
    try {
        const html = fs.readFileSync(htmlPath, 'utf8');
        
        const requiredElements = ['Three.js', 'Cannon.js', 'game-container'];
        const missingElements = [];
        
        requiredElements.forEach(element => {
            if (!html.includes(element)) {
                missingElements.push(element);
            }
        });
        
        if (missingElements.length > 0) {
            console.error(`❌ index.html missing required elements: ${missingElements.join(', ')}`);
            return false;
        }
        
        console.log('✅ index.html found with required elements');
        return true;
    } catch (error) {
        console.error('❌ Failed to read index.html:', error.message);
        return false;
    }
}

function main() {
    console.log('🔍 Checking dependencies for Mario Kart 3D Racer...\n');
    
    const checks = [
        { name: 'Node.js version', check: checkNodeVersion },
        { name: 'package.json', check: checkPackageJson },
        { name: 'Source files', check: checkSourceFiles },
        { name: 'Script files', check: checkScriptsDirectory },
        { name: 'HTML file', check: checkHTMLFile }
    ];n    
    let passed = 0;
    let failed = 0;
    
    for (const check of checks) {
        console.log(`📋 Checking ${check.name}...`);
        const result = check.check();
        if (result) {
            passed++;
        } else {
            failed++;
        }
        console.log('');
    }
    
    console.log('='.repeat(50));
    console.log(`📊 Check Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
        console.error('\n❌ Dependency check failed. Please fix the issues above.');
        process.exit(1);
    } else {
        console.log('\n✅ All dependency checks passed! Your project is ready to run.');
        console.log('\n🚀 To start the game, run:');
        console.log('   npm start');
        console.log('   or');
        console.log('   npm run dev');
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };