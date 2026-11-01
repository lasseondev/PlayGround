"use strict";

import Engine from './Engine.js';
import InputManager from './InputManager.js';
import ResourceManager from './ResourceManager.js';
import MapManager from './MapManager.js';
import UIManager from './UIManager.js';
import AudioManager from './AudioManager.js';

class Game {
  constructor(config, races) {
    this.config = config;
    this.races = races;
    this.engine = null;
    this.inputManager = null;
    this.resourceManager = null;
    this.mapManager = null;
    this.uiManager = null;
    this.audioManager = null;
    this.gameLoop = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    this.currentPhase = 'lobby'; // lobby, playing, paused, gameover
    this.players = {};
    this.currentTurn = 'human';
    this.resources = {};

    this.initializeComponents();
  }

  initializeComponents() {
    // Initialize core systems
    this.engine = new Engine(this.config.canvas, this.config.width, this.config.height);
    this.inputManager = new InputManager();
    this.resourceManager = new ResourceManager();
    this.mapManager = new MapManager(this.config.mapSize, this.config.tileSize);
    this.uiManager = new UIManager(this.config.width, this.config.height);
    this.audioManager = new AudioManager();

    // Setup event listeners
    this.setupEventListeners();

    // Initialize players and resources
    this.initializePlayers();
    this.initializeResources();
  }

  setupEventListeners() {
    this.inputManager.on('unitSelected', (unit) => {
      this.uiManager.updateUnitPanel(unit);
    });

    this.inputManager.on('buildingConstructed', (building) => {
      this.uiManager.updateBuildingPanel(building);
    });

    this.inputManager.on('resourceGathered', (resource) => {
      this.uiManager.updateResourcePanel(resource);
    });
  }

  initializePlayers() {
    Object.entries(this.races).forEach(([key, race]) => {
      this.players[race.name.toLowerCase()] = {
        id: key,
        name: race.name,
        race: race.name.toLowerCase(),
        color: race.color,
        resources: {
          gold: 100,
          wood: 50,
          stone: 50
        },
        units: [],
        buildings: [],
        townHall: null,
        startLocation: race.startLocation
      };
    });
  }

  initializeResources() {
    this.resources = {
      gold: { amount: 0, rate: 0, sources: [] },
      wood: { amount: 0, rate: 0, sources: [] },
      stone: { amount: 0, rate: 0, sources: [] }
    };
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.currentPhase = 'playing';

    // Start game loop
    this.gameLoop = this.gameLoop.bind(this);
    this.gameLoop(this.lastTime);

    // Initialize map with terrain
    this.mapManager.initializeTerrain(this.players);

    // Start AI for opponents
    this.startAI();

    // Notify UI
    this.uiManager.setGameState(this.currentPhase);
    this.audioManager.play('music', { loop: true });
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Update game systems
    this.updateGameSystems();
    this.updateUI();
    this.checkWinConditions();

    // Schedule next frame
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  updateGameSystems() {
    // Update engine (rendering)
    this.engine.clear();

    // Update game systems
    this.mapManager.update(this.deltaTime);
    this.inputManager.update(this.deltaTime);
    this.resourceManager.update(this.deltaTime, this.resources);

    // Update all players
    Object.values(this.players).forEach(player => {
      this.updatePlayer(player, this.deltaTime);
    });

    // Update units and buildings
    this.updateUnits();
    this.updateBuildings();

    // Render
    this.render();
  }

  updatePlayer(player, deltaTime) {
    // AI behavior for non-human players
    if (player.id !== 'human') {
      this.updateAI(player, deltaTime);
    } else {
      // Human player actions handled via input
      this.updateHumanPlayer(player, deltaTime);
    }
  }

  updateHumanPlayer(player, deltaTime) {
    // Handle human player input and actions
    // This would integrate with the input manager
    // For now, it's a placeholder
  }

  updateUnits() {
    const allUnits = [];
    Object.values(this.players).forEach(player => {
      allUnits.push(...player.units);
    });

    allUnits.forEach(unit => {
      unit.update(this.deltaTime);
      unit.checkCollisions(allUnits);
    });
  }

  updateBuildings() {
    const allBuildings = [];
    Object.values(this.players).forEach(player => {
      allBuildings.push(...player.buildings);
    });

    allBuildings.forEach(building => building.update(this.deltaTime));
  }

  updateAI(player, deltaTime) {
    // Simple AI behavior - can be enhanced
    // For now, just basic resource gathering and unit production

    // Build if needed
    if (this.canBuild(player)) {
      this.buildStructure(player);
    }

    // Train units if needed
    if (this.canTrainUnits(player)) {
      this.trainUnits(player);
    }

    // Attack if enemy in range
    this.attackEnemies(player);
  }

  canBuild(player) {
    // Check resources and building queue
    return player.resources.gold >= 100 && player.resources.wood >= 50;
  }

  buildStructure(player) {
    // Find location to build
    const location = this.findBuildLocation(player);
    if (location && location.valid) {
      const buildingType = this.selectBuildingType(player);
      if (buildingType) {
        // Deduct resources
        player.resources.gold -= 100;
        player.resources.wood -= 50;

        // Create building
        const building = {
          type: buildingType,
          location: location,
          owner: player.name,
          health: 100,
          maxHealth: 100,
          update: () => {},
          takeDamage: (amount) => {},
          isDestroyed: () => false
        };

        player.buildings.push(building);
        this.mapManager.setTerrain(location.x, location.y, 'building');
      }
    }
  }

  canTrainUnits(player) {
    // Check if can train units
    return player.resources.gold >= 50 && player.townHall?.operational;
  }

  trainUnits(player) {
    // Select unit type based on building
    const building = player.townHall;
    if (!building) return;

    const unitType = this.selectUnitType(player, building.type);
    if (unitType && player.resources.gold >= 50) {
      // Create unit
      const unit = this.createUnit(player, unitType);

      player.units.push(unit);
      player.resources.gold -= 50;
    }
  }

  attackEnemies(player) {
    // Simple AI attack behavior
    Object.values(this.players).forEach(otherPlayer => {
      if (otherPlayer.name !== player.name) {
        player.units.forEach(unit => {
          if (unit.canAttack()) {
            const target = this.findTarget(unit, otherPlayer);
            if (target && unit.attack(target)) {
              this.audioManager.play('attack');
            }
          }
        });
      }
    });
  }

  createUnit(player, unitType) {
    const startPos = { ...player.startLocation };
    const unit = {
      type: unitType,
      owner: player.name,
      location: startPos,
      health: 100,
      maxHealth: 100,
      attack: 10,
      range: 64,
      speed: 100,
      isMoving: false,
      target: null,

      update: (deltaTime) => {
        if (this.isMoving && this.target) {
          const dx = this.target.location.x - this.location.x;
          const dy = this.target.location.y - this.location.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > this.range) {
            const angle = Math.atan2(dy, dx);
            this.location.x += Math.cos(angle) * this.speed * deltaTime;
            this.location.y += Math.sin(angle) * this.speed * deltaTime;
          } else {
            this.isMoving = false;
          }
        }
      },

      canAttack: () => !this.isMoving && this.target && this.target.health > 0,

      attack: (target) => {
        target.takeDamage(this.attack);
        return true;
      },

      takeDamage: (amount) => {
        this.health -= amount;
        if (this.health <= 0) {
          this.health = 0;
        }
      },

      isDead: () => this.health <= 0
    };

    return unit;
  }

  findBuildLocation(player) {
    // Find valid location to build
    const radius = 3;
    const attempts = 20;

    for (let i = 0; i < attempts; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = player.startLocation.x + Math.cos(angle) * distance;
      const y = player.startLocation.y + Math.sin(angle) * distance;

      if (this.mapManager.isWalkable(x, y)) {
        return { x, y, valid: true };
      }
    }

    return { valid: false };
  }

  selectBuildingType(player) {
    // Simple building selection based on what's missing
    if (!player.townHall) return 'townhall';

    const buildingCounts = {};
    player.buildings.forEach(building => {
      buildingCounts[building.type] = (buildingCounts[building.type] || 0) + 1;
    });

    if (!buildingCounts.barracks || buildingCounts.barracks < 2) {
      return 'barracks';
    } else if (!buildingCounts.farm) {
      return 'farm';
    } else if (!buildingCounts.mine) {
      return 'mine';
    }

    return null;
  }

  selectUnitType(player, buildingType) {
    const unitTypes = this.races[player.race].units;

    if (buildingType === 'barracks') {
      return unitTypes[0] || null;
    } else if (buildingType === 'townhall') {
      return unitTypes[1] || unitTypes[0] || null;
    }

    return unitTypes[0] || null;
  }

  findTarget(unit, enemyPlayer) {
    // Find nearest enemy unit
    let closest = null;
    let closestDistance = Infinity;

    enemyPlayer.units.forEach(enemyUnit => {
      if (!enemyUnit.isDead()) {
        const dx = unit.location.x - enemyUnit.location.x;
        const dy = unit.location.y - enemyUnit.location.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance) {
          closest = enemyUnit;
          closestDistance = distance;
        }
      }
    });

    return closest;
  }

  updateAI() {
    // Update AI for all players
    Object.values(this.players).forEach(player => {
      if (player.id !== 'human') {
        this.updateAI(player, this.deltaTime);
      }
    });
  }

  startAI() {
    // Simple AI initialization
    // Could be enhanced with more sophisticated AI behavior
  }

  render() {
    // Render game state
    this.mapManager.render(this.engine.ctx);

    // Render all players' units and buildings
    Object.values(this.players).forEach(player => {
      player.units.forEach(unit => {
        if (!unit.isDead()) {
          this.renderUnit(unit, player.color);
        }
      });

      player.buildings.forEach(building => {
        this.renderBuilding(building, player.color);
      });
    });

    // Render UI
    this.uiManager.render(this.engine.ctx);

    // Render debug info
    this.renderDebugInfo();
  }

  renderUnit(unit, color) {
    const ctx = this.engine.ctx;
    ctx.save();

    ctx.fillStyle = color || '#ffffff';
    ctx.fillRect(unit.location.x - 16, unit.location.y - 16, 32, 32);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(unit.location.x - 16, unit.location.y - 16, 32, 32);

    ctx.restore();
  }

  renderBuilding(building, color) {
    const ctx = this.engine.ctx;
    ctx.save();

    ctx.fillStyle = color || '#ffffff';
    ctx.fillRect(building.location.x - 32, building.location.y - 32, 64, 64);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(building.location.x - 32, building.location.y - 32, 64, 64);

    ctx.restore();
  }

  renderDebugInfo() {
    const ctx = this.engine.ctx;
    ctx.save();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Phase: ${this.currentPhase}`, 10, 20);
    ctx.fillText(`Turn: ${this.currentTurn}`, 10, 40);
    ctx.fillText(`Delta: ${this.deltaTime.toFixed(3)}s`, 10, 60);

    ctx.restore();
  }

  updateUI() {
    this.uiManager.updateGameState({
      currentPhase: this.currentPhase,
      players: this.players,
      resources: this.resources,
      selectedUnit: this.inputManager.getSelectedUnit(),
      selectedBuilding: this.inputManager.getSelectedBuilding()
    });
  }

  checkWinConditions() {
    const alivePlayers = Object.values(this.players).filter(p => p.townHall && p.townHall.health > 0);

    if (alivePlayers.length <= 1) {
      this.currentPhase = 'gameover';
      this.isRunning = false;

      if (this.gameLoopId) {
        cancelAnimationFrame(this.gameLoopId);
      }

      this.audioManager.stop('music');
      this.audioManager.play('gameover');

      this.uiManager.showGameOver(alivePlayers[0] || null);
    }
  }

  pause() {
    this.isRunning = false;
    this.currentPhase = 'paused';
    this.uiManager.setGameState(this.currentPhase);
  }

  resume() {
    if (this.currentPhase === 'paused') {
      this.isRunning = true;
      this.currentPhase = 'playing';
      this.lastTime = performance.now();
      this.gameLoop(this.lastTime);
      this.uiManager.setGameState(this.currentPhase);
    }
  }

  destroy() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }

    this.isRunning = false;
    this.engine.destroy();
    this.inputManager.destroy();
    this.audioManager.destroy();
  }

  resize(width, height) {
    this.config.width = width;
    this.config.height = height;
    this.engine.resize(width, height);
    this.uiManager.resize(width, height);
  }
}

export default Game;