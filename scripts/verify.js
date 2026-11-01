"use strict";

import fs from 'fs';
import path from 'path';

class OMGithubVerifier {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.errors = [];
    this.startTime = Date.now();
  }

  log(message, level = 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`);

    if (level === 'error') {
      this.errors.push(message);
    } else if (level === 'warning') {
      this.warnings.push(message);
    } else {
      this.issues.push(message);
    }
  }

  async verifyBuild() {
    this.log('Starting OMGithub verification...');

    // Check if build directory exists
    const buildPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(buildPath)) {
      this.log('Build directory does not exist', 'error');
      return false;
    }

    // Check for essential files
    const essentialFiles = [
      'index.html',
      'game.js',
      'main.js',
      'style.css'
    ];

    const missingFiles = [];
    for (const file of essentialFiles) {
      const filePath = path.join(buildPath, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      this.log(`Missing essential files: ${missingFiles.join(', ')}`, 'error');
      return false;
    }

    // Check for canvas element
    const htmlContent = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');
    if (!htmlContent.includes('game-canvas')) {
      this.log('Canvas element with id "game-canvas" not found', 'warning');
    }

    // Check for basic game functionality
    if (!htmlContent.includes('game.js') && !htmlContent.includes('main.js')) {
      this.log('No game script found', 'error');
      return false;
    }

    // Check for dependencies
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!packageJson.dependencies) {
        this.log('No dependencies found in package.json', 'warning');
      }
    }

    // Check for browser compatibility
    const hasAudioSupport = htmlContent.includes('AudioContext') || htmlContent.includes('webkitAudioContext');
    const hasCanvasSupport = htmlContent.includes('getContext') && htmlContent.includes('canvas');

    if (!hasAudioSupport) {
      this.log('AudioContext not detected - audio may not work', 'warning');
    }

    if (!hasCanvasSupport) {
      this.log('Canvas rendering not detected', 'warning');
    }

    // Check for game initialization
    if (!htmlContent.includes('DOMContentLoaded') && !htmlContent.includes('initGame')) {
      this.log('No game initialization detected', 'warning');
    }

    // Check build performance
    const buildTime = (Date.now() - this.startTime) / 1000;
    if (buildTime > 60) {
      this.log(`Build time is slow: ${buildTime.toFixed(2)} seconds`, 'warning');
    }

    // Final verification
    if (this.errors.length === 0) {
      this.log('Verification completed successfully!', 'info');
      return true;
    } else {
      this.log('Verification failed!', 'error');
      return false;
    }
  }

  async verifyGameplay() {
    this.log('Starting gameplay verification...');

    // Check if game files are present
    const gamePath = path.join(process.cwd(), 'src', 'core', 'Game.js');
    if (!fs.existsSync(gamePath)) {
      this.log('Game.js not found', 'error');
      return false;
    }

    // Check for core classes
    const coreFiles = [
      'Game.js',
      'Engine.js',
      'InputManager.js',
      'MapManager.js',
      'UIManager.js',
      'AudioManager.js',
      'ResourceManager.js'
    ];

    const missingCoreFiles = [];
    for (const file of coreFiles) {
      const filePath = path.join(process.cwd(), 'src', 'core', file);
      if (!fs.existsSync(filePath)) {
        missingCoreFiles.push(file);
      }
    }

    if (missingCoreFiles.length > 0) {
      this.log(`Missing core files: ${missingCoreFiles.join(', ')}`, 'error');
      return false;
    }

    // Check for race definitions
    const mainPath = path.join(process.cwd(), 'src', 'main.js');
    if (fs.existsSync(mainPath)) {
      const content = fs.readFileSync(mainPath, 'utf8');
      if (!content.includes('races') || !content.includes('Human') || !content.includes('Orc') || !content.includes('Undead')) {
        this.log('Race definitions not found', 'warning');
      }
    }

    this.log('Gameplay verification completed!', 'info');
    return true;
  }

  async run() {
    const buildOk = await this.verifyBuild();
    const gameplayOk = await this.verifyGameplay();

    if (buildOk && gameplayOk) {
      this.log('All verifications passed!', 'info');
      this.printReport();
      return true;
    } else {
      this.log('Some verifications failed!', 'error');
      this.printReport();
      return false;
    }
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('OMGithub Verification Report');
    console.log('='.repeat(60));

    if (this.issues.length > 0) {
      console.log('\n✅ Issues Found:');
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Total issues: ${this.issues.length}`);
    console.log(`Total warnings: ${this.warnings.length}`);
    console.log(`Total errors: ${this.errors.length}`);
    console.log('='.repeat(60));
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  const verifier = new OMGithubVerifier();
  verifier.run()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Verification failed with error:', error);
      process.exit(1);
    });
}

export default OMGithubVerifier;