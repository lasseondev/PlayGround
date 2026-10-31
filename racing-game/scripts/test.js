// Test script for the Mario Kart 3D Racer game
const TestRunner = {
  tests: [],
  results: { passed: 0, failed: 0 },
  
  // Add a test
  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  },
  
  // Run all tests
  async runAll() {
    console.log('Running tests for Mario Kart 3D Racer...');
    console.log('=' .repeat(50));
    
    for (const test of this.tests) {
      try {
        await test.testFn();
        console.log(`✓ ${test.name} - PASSED`);
        this.results.passed++;
      } catch (error) {
        console.log(`✗ ${test.name} - FAILED`);
        console.log(`  Error: ${error.message}`);
        this.results.failed++;
      }
    }
    
    console.log('=' .repeat(50));
    console.log(`Tests completed: ${this.results.passed + this.results.failed}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log('\n❌ Some tests failed');
    }
    
    return this.results;
  }
};

// Test functions
function testThreeJS() {
  return new Promise((resolve, reject) => {
    if (typeof THREE === 'undefined') {
      reject(new Error('Three.js not loaded'));
      return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    // Test basic Three.js functionality
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    if (scene.children.length !== 1) {
      throw new Error('Scene does not contain the cube');
    }
    
    if (!(cube.geometry instanceof THREE.BoxGeometry)) {
      throw new Error('Cube is not a BoxGeometry');
    }
    
    if (!(cube.material instanceof THREE.MeshBasicMaterial)) {
      throw new Error('Cube material is not MeshBasicMaterial');
    }
    
    resolve();
  });
}

function testCannonJS() {
  return new Promise((resolve, reject) => {
    if (typeof CANNON === 'undefined') {
      reject(new Error('Cannon.js not loaded'));
      return;
    }
    
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const body = new CANNON.Body({ mass: 1, shape: shape });
    body.position.set(0, 5, 0);
    world.add(body);
    
    if (body.mass !== 1) {
      throw new Error('Body mass is not 1');
    }
    
    if (body.position.x !== 0 || body.position.y !== 5 || body.position.z !== 0) {
      throw new Error('Body position is incorrect');
    }
    
    if (world.bodies.length !== 1) {
      throw new Error('World does not contain the body');
    }
    
    resolve();
  });
}

function testGameFiles() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'src/Game.js',
      'src/scene.js',
      'src/ThreeUtils.js',
      'src/PhysicsUtils.js',
      'src/ControlHandler.js',
      'src/AudioSystem.js',
      'index.html',
      'README.md'
    ];
    
    const missingFiles = [];
    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    });
    
    if (missingFiles.length > 0) {
      throw new Error(`Missing files: ${missingFiles.join(', ')}`);
    }
    
    resolve();
  });
}

function testHTMLStructure() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const path = require('path');
    
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    
    // Check for required HTML elements
    const requiredElements = [
      '<canvas',
      'id="game-container"',
      'id="start-screen"',
      'id="game-over"',
      'Three.js',
      'Cannon.js'
    ];
    
    for (const element of requiredElements) {
      if (!html.includes(element)) {
        throw new Error(`HTML does not contain required element: ${element}`);
      }
    }
    
    resolve();
  });
}

function testPackageJSON() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const path = require('path');
    
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredFields = ['name', 'version', 'main', 'scripts'];
    
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        throw new Error(`package.json missing field: ${field}`);
      }
    }
    
    if (!packageJson.scripts.start) {
      throw new Error('package.json missing start script');
    }
    
    resolve();
  });
}

// Add tests to the test runner
TestRunner.addTest('Three.js Library', testThreeJS);
TestRunner.addTest('Cannon.js Library', testCannonJS);
TestRunner.addTest('Required Game Files', testGameFiles);
TestRunner.addTest('HTML Structure', testHTMLStructure);
TestRunner.addTest('Package.json Configuration', testPackageJSON);

// Run tests if this is the main module
if (require.main === module) {
  TestRunner.runAll().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = TestRunner;