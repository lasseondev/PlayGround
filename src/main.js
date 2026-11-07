// Main entry point for the 3D RTS game
const THREE = require('three');
const gsap = require('gsap');
const io = require('socket.io-client');

class GameEngine {
  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.canvas = document.getElementById('gameCanvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

    // Initialize game systems
    this.gameSystems = {
      graphics: new GraphicsSystem(this.scene, this.camera),
      input: new InputSystem(),
      gameLogic: new GameLogicSystem(),
      audio: new AudioSystem(),
      ui: new UISystem()
    };

    // Initialize game state
    this.gameState = new GameState();

    // Start game loop
    this.startGameLoop();
  }

  startGameLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      // Update game systems
      this.gameSystems.graphics.update();
      this.gameSystems.input.update();
      this.gameLogic.update();
      this.gameSystems.ui.update();

      // Render frame
      this.gameSystems.graphics.render();
    };

    animate();
  }
}

// Global game instance
window.game = new GameEngine();