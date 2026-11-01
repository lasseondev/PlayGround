"use strict";

import Game from './core/Game.js';
import { setupAudio, preloadAssets } from './core/Assets.js';

// Game configuration
const config = {
  canvas: 'game-canvas',
  width: 1280,
  height: 720,
  tileSize: 32,
  fps: 60,
  mapSize: { width: 50, height: 50 },
  playerColor: '#3498db',
  enemyColor: '#e74c3c'
};

// Race definitions
const races = {
  human: {
    name: 'Human',
    color: '#3498db',
    primaryResource: 'gold',
    units: ['worker', 'archer', 'swordsman', 'knight'],
    buildings: ['townhall', 'barracks', 'farm', 'mine'],
    startLocation: { x: 100, y: 100 }
  },
  orc: {
    name: 'Orc',
    color: '#e67e22',
    primaryResource: 'guldan',
    units: ['grunt', 'axeman', 'siege'],
    buildings: ['stronghold', 'workshop', 'lumber mill', 'foundry'],
    startLocation: { x: 1100, y: 500 }
  },
  undead: {
    name: 'Undead',
    color: '#95a5a6',
    primaryResource: 'souls',
    units: ['skeleton', 'zombie', 'wraith'],
    buildings: ['crypt', 'necropolis', 'catacomb', 'graveyard'],
    startLocation: { x: 1100, y: 100 }
  }
};

// Game state
let game = null;
let currentPlayer = 'human';
let isGameRunning = false;

// Initialize game
function initGame() {
  if (game) {
    game.destroy();
  }

  setupAudio();
  preloadAssets()
    .then(() => {
      game = new Game(config, races);
      game.start();
      isGameRunning = true;
      console.log('2D RTS Game initialized successfully!');
    })
    .catch(error => {
      console.error('Failed to initialize game:', error);
      // Retry after delay
      setTimeout(initGame, 2000);
    });
}

// Game loop integration
function updateGame(deltaTime) {
  if (game && isGameRunning) {
    game.update(deltaTime);
  }
}

// Handle window resize
function handleResize() {
  const canvas = document.getElementById(config.canvas);
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (game) {
      game.resize(window.innerWidth, window.innerHeight);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Create canvas if it doesn't exist
  const existingCanvas = document.getElementById(config.canvas);
  if (!existingCanvas) {
    const canvas = document.createElement('canvas');
    canvas.id = config.canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
  }

  // Initialize game
  initGame();

  // Setup window resize handler
  window.addEventListener('resize', handleResize);
});

// Export for testing and debugging
export { config, races, game, currentPlayer, updateGame, initGame };