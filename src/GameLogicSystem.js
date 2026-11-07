class GameLogicSystem {
  constructor() {
    this.gameWorld = null;
    this.aiSystems = new Map();
    this.unitManager = null;
    this.buildingManager = null;
    this.resourceManager = null;
    this.combatSystem = null;
    this.techTree = null;

    this.initializeSystems();
  }

  initializeSystems() {
    // Initialize sub-systems
    this.unitManager = new UnitManager(this);
    this.buildingManager = new BuildingManager(this);
    this.resourceManager = new ResourceManager(this);
    this.combatSystem = new CombatSystem(this);
    this.techTree = new TechTree(this);

    // Initialize AI for each player
    if (window.game) {
      for (const player of window.game.gameState.players) {
        const aiSystem = new AISystem(this, player);
        this.aiSystems.set(player.id, aiSystem);
      }
    }
  }

  update() {
    if (!window.game) return;

    // Update all systems
    this.unitManager.update();
    this.buildingManager.update();
    this.resourceManager.update();
    this.combatSystem.update();
    this.techTree.update();

    // Update AI
    for (const aiSystem of this.aiSystems.values()) {
      if (!aiSystem.isPlayerControlled) {
        aiSystem.update();
      }
    }

    // Update game world
    this.updateGameWorld();
  }

  updateGameWorld() {
    const gameState = window.game.gameState;

    // Update day/night cycle
    gameState.gameWorld.time.dayNightCycle += 0.01;
    if (gameState.gameWorld.time.dayNightCycle >= 1.0) {
      gameState.gameWorld.time.dayNightCycle = 0;
    }

    const cycle = gameState.gameWorld.time.dayNightCycle;
    if (cycle < 0.3) {
      gameState.gameWorld.time.timeOfDay = 'morning';
    } else if (cycle < 0.6) {
      gameState.gameWorld.time.timeOfDay = 'afternoon';
    } else if (cycle < 0.9) {
      gameState.gameWorld.time.timeOfDay = 'evening';
    } else {
      gameState.gameWorld.time.timeOfDay = 'night';
    }

    // Update weather
    gameState.gameWorld.time.weather = this.getWeatherForTimeOfDay(gameState.gameWorld.time.timeOfDay);

    // Update economy
    this.updateEconomy(gameState);

    // Update unit commands
    this.updateUnitCommands(gameState);

    // Check for game end conditions
    this.checkGameEnd(gameState);
  }

  updateEconomy(gameState) {
    // Update resource production for each civilization
    for (const player of gameState.players) {
      if (!player.civilization) continue;

      const civilization = player.civilization;

      // Update resource production
      const foodProduction = civilization.buildings.includes('barracks') ? 10 : 0;
      const woodProduction = civilization.buildings.includes('lumberMill') ? 15 : 0;
      const goldProduction = civilization.buildings.includes('mine') ? 8 : 0;
      const magicProduction = civilization.buildings.includes('arcaneWell') ? 5 : 0;

      civilization.foodProduction = foodProduction;
      civilization.woodProduction = woodProduction;
      civilization.goldProduction = goldProduction;
      civilization.magicProduction = magicProduction;

      // Update resources
      gameState.gameWorld.economy.food += foodProduction;
      gameState.gameWorld.economy.wood += woodProduction;
      gameState.gameWorld.economy.gold += goldProduction;
      gameState.gameWorld.economy.magic += magicProduction;

      // Check for resource starvation
      if (gameState.gameWorld.economy.food <= 0) {
        gameState.gameWorld.economy.food = 0;
        // Apply damage to civilization
        civilization.health = Math.max(0, civilization.health - 1);
      }

      // Cap food at reasonable level
      if (gameState.gameWorld.economy.food > 100) {
        gameState.gameWorld.economy.food = 100;
      }
    }
  }

  updateUnitCommands(gameState) {
    // Update unit commands and behaviors
    for (const unit of gameState.gameWorld.map.units) {
      if (unit.ai) {
        unit.ai.update();
      }
    }
  }

  getWeatherForTimeOfDay(timeOfDay) {
    const random = Math.random();
    switch (timeOfDay) {
      case 'morning':
        return random < 0.7 ? 'clear' : 'cloudy';
      case 'afternoon':
        return random < 0.5 ? 'clear' : random < 0.8 ? 'cloudy' : 'stormy';
      case 'evening':
        return random < 0.6 ? 'cloudy' : random < 0.9 ? 'stormy' : 'rainy';
      case 'night':
        return random < 0.7 ? 'clear' : random < 0.9 ? 'cloudy' : 'stormy';
      default:
        return 'clear';
    }
  }

  checkGameEnd(gameState) {
    // Check win/loss conditions
    let activePlayers = 0;
    let winner = null;

    for (const player of gameState.players) {
      if (player.civilization && player.civilization.health > 0) {
        activePlayers++;
      }
    }

    if (activePlayers === 0) {
      gameState.gameMode = 'GAME_OVER';
      gameState.gameState = 'DRAW';
    } else if (activePlayers === 1) {
      gameState.gameMode = 'GAME_OVER';
      for (const player of gameState.players) {
        if (player.civilization && player.civilization.health > 0) {
          winner = player;
          gameState.gameState = winner.race === 'Human' ? 'HUMAN_VICTORY' : winner.race === 'Night Elf' ? 'NIGHT_ELF_VICTORY' : 'ORC_VICTORY';
          break;
        }
      }
    }

    if (gameState.gameMode === 'GAME_OVER') {
      // Update statistics
      gameState.statistics.gamesPlayed++;
      if (winner) {
        gameState.statistics.wins++;
      } else {
        gameState.statistics.losses++;
      }

      // Show game over screen
      if (window.game && window.game.gameSystems.ui) {
        window.game.gameSystems.ui.showGameOverScreen(winner);
      }
    }
  }
}

class UnitManager {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.units = [];
    this.selection = [];
    this.pendingUnits = [];
  }

  createUnit(type, position, player, civilization) {
    const unitTemplate = this.getUnitTemplate(type, civilization);
    if (!unitTemplate) return null;

    const unit = {
      id: this.generateUnitId(),
      type,
      race: civilization,
      position: position.clone(),
      mesh: null,
      health: unitTemplate.health,
      maxHealth: unitTemplate.health,
      mana: unitTemplate.mana || 0,
      maxMana: unitTemplate.maxMana || 0,
      attack: unitTemplate.attack,
      defense: unitTemplate.defense,
      speed: unitTemplate.speed,
      range: unitTemplate.range,
      target: null,
      path: [],
      currentPathIndex: 0,
      isMoving: false,
      isAttacking: false,
      isDead: false,
      owner: player.id,
      citizen: false, // Can the unit build?
      gatherer: false, // Can the unit gather resources?
      worker: false, // Can the unit build structures?
      ai: null,
      lastAttackTime: 0
    };

    this.units.push(unit);
    this.updatePlayerUnits(player, unit);

    // Add to game world
    if (window.game && window.game.gameState) {
      window.game.gameState.gameWorld.map.units.push(unit);
    }

    // Play sound
    if (window.game && window.game.gameSystems.audio) {
      window.game.gameSystems.audio.playSound('unitCreated');
    }

    return unit;
  }

  getUnitTemplate(type, civilization) {
    const templates = {
      human: {
        knight: { health: 100, mana: 0, attack: 15, defense: 12, speed: 5, range: 1, citizen: false, gatherer: false, worker: false },
        archer: { health: 60, mana: 0, attack: 10, defense: 8, speed: 4, range: 6, citizen: false, gatherer: false, worker: false },
        wizard: { health: 50, mana: 100, attack: 5, defense: 5, speed: 3, range: 8, citizen: false, gatherer: false, worker: false }
      },
      nightElf: {
        ranger: { health: 70, mana: 20, attack: 12, defense: 10, speed: 5, range: 5, citizen: false, gatherer: false, worker: false },
        druid: { health: 80, mana: 80, attack: 8, defense: 10, speed: 3, range: 7, citizen: true, gatherer: true, worker: true },
        phoenix: { health: 90, mana: 60, attack: 20, defense: 15, speed: 6, range: 4, citizen: false, gatherer: false, worker: false }
      },
      orc: {
        grunt: { health: 120, mana: 0, attack: 18, defense: 15, speed: 4, range: 1, citizen: false, gatherer: false, worker: false },
        shaman: { health: 80, mana: 50, attack: 10, defense: 8, speed: 3, range: 7, citizen: true, gatherer: true, worker: true },
        warlock: { health: 60, mana: 100, attack: 8, defense: 5, speed: 3, range: 8, citizen: false, gatherer: false, worker: false }
      }
    };

    return templates[civilization] ? templates[civilization][type] : null;
  }

  updatePlayerUnits(player, unit) {
    if (!player.civilization) {
      player.civilization = {
        units: [],
        buildings: [],
        technologies: [],
        foodProduction: 0,
        woodProduction: 0,
        goldProduction: 0,
        magicProduction: 0,
        health: 100
      };
    }

    player.civilization.units.push(unit.type);
  }

  update() {
    // Update all units
    for (const unit of this.units) {
      if (unit.isDead) {
        this.removeUnit(unit);
        continue;
      }

      unit.ai?.update();
      this.updateUnitMovement(unit);
      this.updateUnitCombat(unit);
      this.updateUnitResources(unit);
    }
  }

  updateUnitMovement(unit) {
    if (unit.path && unit.currentPathIndex < unit.path.length && unit.isMoving) {
      const currentTarget = unit.path[unit.currentPathIndex];
      const direction = new THREE.Vector3().subVectors(currentTarget, unit.position);
      const distance = direction.length();

      if (distance > 0.5) {
        direction.normalize();
        direction.multiplyScalar(unit.speed * 16); // pixels per second
        unit.position.add(direction);

        // Rotate unit to face direction
        if (direction.x !== 0 || direction.z !== 0) {
          unit.rotation = Math.atan2(direction.x, direction.z);
        }
      } else {
        unit.currentPathIndex++;
      }
    } else {
      unit.isMoving = false;
    }
  }

  updateUnitCombat(unit) {
    if (unit.isDead || !unit.target) return;

    const distance = new THREE.Vector3().subVectors(unit.position, unit.target.position).length();

    if (distance <= unit.range) {
      unit.isAttacking = true;
      this.performAttack(unit, unit.target);
    } else {
      unit.isAttacking = false;
      unit.target = null;
    }
  }

  performAttack(attacker, target) {
    const currentTime = Date.now();
    if (currentTime - attacker.lastAttackTime < attacker.attackSpeed) {
      return;
    }

    const damage = attacker.attack - target.defense;
    if (damage > 0) {
      target.health -= damage;

      // Play impact sound
      if (window.game && window.game.gameSystems.audio) {
        window.game.gameSystems.audio.playSound('explosion');
      }

      // Create impact effect
      if (window.game && window.game.gameSystems.graphics) {
        window.game.gameSystems.graphics.createParticleSystem('explosion', target.position);
      }

      attacker.lastAttackTime = currentTime;

      if (target.health <= 0) {
        target.isDead = true;
        this.removeUnit(target);

        // Play death sound
        if (window.game && window.game.gameSystems.audio) {
          window.game.gameSystems.audio.playSound('unitDie');
        }
      }
    }
  }

  updateUnitResources(unit) {
    if (unit.gatherer && unit.position) {
      // Find nearest resource
      const resources = window.game.gameState.gameWorld.map.resources;
      let nearestResource = null;
      let nearestDistance = Infinity;

      for (const resource of resources) {
        const distance = new THREE.Vector3().subVectors(unit.position, resource.position).length();
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestResource = resource;
        }
      }

      if (nearestResource && nearestDistance < 10) {
        // Gather resource
        const resourceAmount = unit.type === 'druid' || unit.type === 'shaman' ? 2 : 1;
        nearestResource.amount -= resourceAmount;

        if (window.game && window.game.gameState.currentPlayer) {
          const player = window.game.gameState.currentPlayer;
          if (nearestResource.type === 'wood') {
            player.resources.wood += resourceAmount;
          } else if (nearestResource.type === 'gold') {
            player.resources.gold += resourceAmount;
          } else if (nearestResource.type === 'magic') {
            player.resources.magic += resourceAmount;
          }
        }

        // Play gather sound
        if (window.game && window.game.gameSystems.audio) {
          window.game.gameSystems.audio.playSound('resourceGather');
        }

        // Remove resource if depleted
        if (nearestResource.amount <= 0) {
          const index = resources.indexOf(nearestResource);
          if (index > -1) {
            resources.splice(index, 1);
          }
        }
      }
    }
  }

  removeUnit(unit) {
    const index = this.units.indexOf(unit);
    if (index > -1) {
      this.units.splice(index, 1);
    }

    const worldIndex = window.game.gameState.gameWorld.map.units.indexOf(unit);
    if (worldIndex > -1) {
      window.game.gameState.gameWorld.map.units.splice(worldIndex, 1);
    }

    // Remove from player civilization
    if (window.game) {
      const player = window.game.gameState.players.find(p => p.id === unit.owner);
      if (player && player.civilization) {
        const unitIndex = player.civilization.units.indexOf(unit.type);
        if (unitIndex > -1) {
          player.civilization.units.splice(unitIndex, 1);
        }
      }
    }
  }

  generateUnitId() {
    return 'unit_' + Math.random().toString(36).substr(2, 9);
  }

  selectUnit(unit) {
    this.selection.push(unit);
  }

  deselectUnit(unit) {
    const index = this.selection.indexOf(unit);
    if (index > -1) {
      this.selection.splice(index, 1);
    }
  }

  deselectAll() {
    this.selection = [];
  }
}

class BuildingManager {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.buildings = [];
    this.constructionQueue = [];
  }

  createBuilding(type, position, player, civilization) {
    const buildingTemplate = this.getBuildingTemplate(type, civilization);
    if (!buildingTemplate) return null;

    // Check if player has enough resources
    const playerResources = player.resources;
    if (playerResources.gold < buildingTemplate.cost || playerResources.wood < buildingTemplate.woodCost) {
      if (window.game && window.game.gameSystems.ui) {
        window.game.gameSystems.ui.addNotification('Not enough resources to build this structure!', 'error');
      }
      return null;
    }

    // Consume resources
    playerResources.gold -= buildingTemplate.cost;
    playerResources.wood -= buildingTemplate.woodCost;

    // Create building
    const building = {
      id: this.generateBuildingId(),
      type,
      race: civilization,
      position: position.clone(),
      mesh: null,
      health: buildingTemplate.health,
      maxHealth: buildingTemplate.health,
      buildTime: buildingTemplate.buildTime,
      isBuilt: false,
      constructionProgress: 0,
      owner: player.id,
      citizen: true, // Can build units
      worker: true, // Can build other buildings
      ai: null,
      lastAttackTime: 0
    };

    this.buildings.push(building);
    this.updatePlayerBuildings(player, building);

    // Add to game world
    if (window.game && window.game.gameState) {
      window.game.gameState.gameWorld.map.structures.push(building);
    }

    // Play build sound
    if (window.game && window.game.gameSystems.audio) {
      window.game.gameSystems.audio.playSound('buildComplete');
    }

    return building;
  }

  getBuildingTemplate(type, civilization) {
    const templates = {
      human: {
        barracks: { health: 200, cost: 200, woodCost: 50, buildTime: 10 },
        archeryRange: { health: 150, cost: 300, woodCost: 100, buildTime: 15 },
        wizardTower: { health: 180, cost: 400, woodCost: 150, buildTime: 20 }
      },
      nightElf: {
        forestLodge: { health: 180, cost: 180, woodCost: 50, buildTime: 10 },
        druidCircle: { health: 160, cost: 250, woodCost: 100, buildTime: 15 },
        towerOfElvens: { health: 200, cost: 350, woodCost: 150, buildTime: 20 }
      },
      orc: {
        barracks: { health: 220, cost: 180, woodCost: 50, buildTime: 10 },
        shamanHut: { health: 160, cost: 250, woodCost: 100, buildTime: 15 },
        warlockTower: { health: 200, cost: 350, woodCost: 150, buildTime: 20 }
      }
    };

    return templates[civilization] ? templates[civilization][type] : null;
  }

  updatePlayerBuildings(player, building) {
    if (!player.civilization) {
      player.civilization = {
        units: [],
        buildings: [],
        technologies: [],
        foodProduction: 0,
        woodProduction: 0,
        goldProduction: 0,
        magicProduction: 0,
        health: 100
      };
    }

    player.civilization.buildings.push(building.type);
  }

  update() {
    // Update construction progress for buildings under construction
    for (const building of this.buildings) {
      if (!building.isBuilt) {
        building.constructionProgress += 0.1; // Increment based on time delta

        if (building.constructionProgress >= 1.0) {
          building.isBuilt = true;
          building.constructionProgress = 1.0;

          // Play build complete sound
          if (window.game && window.game.gameSystems.audio) {
            window.game.gameSystems.audio.playSound('buildComplete');
          }
        }
      }
    }
  }

  generateBuildingId() {
    return 'building_' + Math.random().toString(36).substr(2, 9);
  }
}

class ResourceManager {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.resources = [];
    this.resourceSpawns = [];
  }

  initializeResources() {
    // Create initial resources
    const resourceTypes = [
      { type: 'wood', amount: 50, color: 0x2e7d32 },
      { type: 'gold', amount: 30, color: 0xffd700 },
      { type: 'magic', amount: 20, color: 0x9b30ff }
    ];

    for (let i = 0; i < 20; i++) {
      for (const typeInfo of resourceTypes) {
        const x = Math.random() * 800;
        const z = Math.random() * 800;
        const resource = {
          id: this.generateResourceId(),
          type: typeInfo.type,
          amount: typeInfo.amount,
          position: new THREE.Vector3(x, 0, z),
          mesh: null,
          color: typeInfo.color
        };

        this.resources.push(resource);
      }
    }
  }

  update() {
    // Regenerate resources slowly
    for (const resource of this.resources) {
      if (resource.type === 'wood') {
        resource.amount = Math.min(resource.amount + 0.1, 50);
      } else if (resource.type === 'gold') {
        resource.amount = Math.min(resource.amount + 0.05, 30);
      } else if (resource.type === 'magic') {
        resource.amount = Math.min(resource.amount + 0.03, 20);
      }
    }
  }

  generateResourceId() {
    return 'resource_' + Math.random().toString(36).substr(2, 9);
  }
}

class CombatSystem {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.combatLog = [];
  }

  update() {
    // Update combat calculations
  }
}

class TechTree {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.technologies = {
      human: [],
      nightElf: [],
      orc: []
    };
  }

  update() {
    // Update technology research
  }
}

class AISystem {
  constructor(gameLogic, player) {
    this.gameLogic = gameLogic;
    this.player = player;
    this.isPlayerControlled = player.id === 0; // First player is human-controlled
    this.state = 'IDLE'; // IDLE, EXPLORATION, ATTACKING, DEFENDING
    this.target = null;
    this.lastActionTime = 0;
  }

  update() {
    if (this.isPlayerControlled) return;

    const currentTime = Date.now();
    if (currentTime - this.lastActionTime < 1000) { // Action every second
      return;
    }

    switch (this.state) {
      case 'IDLE':
        this.explore();
        break;
      case 'EXPLORATION':
        this.explore();
        break;
      case 'ATTACKING':
        this.attack();
        break;
      case 'DEFENDING':
        this.defend();
        break;
    }

    this.lastActionTime = currentTime;
  }

  explore() {
    // AI exploration logic
    const enemyPlayers = window.game.gameState.players.filter(p => p.id !== this.player.id);
    if (enemyPlayers.length === 0) return;

    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDistance = Infinity;

    for (const enemyPlayer of enemyPlayers) {
      if (enemyPlayer.civilization && enemyPlayer.civilization.health > 0) {
        const enemyUnits = enemyPlayer.civilization.units || [];
        for (const unitType of enemyUnits) {
          // TODO: Get unit positions
        }
      }
    }

    // If no enemy found, explore random area
    const randomX = Math.random() * 800;
    const randomZ = Math.random() * 800;
    const position = new THREE.Vector3(randomX, 0, randomZ);

    // Move a unit to this location
    this.moveUnit(position);
  }

  attack() {
    // AI attack logic
    const enemyPlayers = window.game.gameState.players.filter(p => p.id !== this.player.id);
    let bestTarget = null;
    let bestValue = 0;

    for (const enemyPlayer of enemyPlayers) {
      if (!enemyPlayer.civilization || enemyPlayer.civilization.health <= 0) continue;

      const enemyUnits = enemyPlayer.civilization.units || [];
      for (const unitType of enemyUnits) {
        // TODO: Calculate unit value and distance
      }
    }

    if (bestTarget) {
      this.attackUnit(bestTarget);
    } else {
      this.state = 'IDLE';
    }
  }

  defend() {
    // AI defense logic
    // TODO: Implement defense logic
  }

  moveUnit(position) {
    // Move a random unit to position
    if (this.player.civilization && this.player.civilization.units.length > 0) {
      const unitType = this.player.civilization.units[0];
      const unitPosition = this.player.startLocation.clone();
      unitPosition.add(new THREE.Vector3(1, 0, 1)); // Offset from base

      if (window.game && window.game.gameLogic && window.game.gameLogic.unitManager) {
        const unit = window.game.gameLogic.unitManager.createUnit(unitType, unitPosition, this.player, this.player.race);
        if (unit) {
          unit.ai = this;
        }
      }
    }
  }

  attackUnit(target) {
    // TODO: Implement attack logic
  }
}

module.exports = GameLogicSystem;