// Main game entry point - brings all systems together
const GameState = require('./GameState.js');
const { GraphicsSystem, ParticleSystem } = require('./GraphicsSystem.js');
const InputSystem = require('./InputSystem.js');
const GameLogicSystem = require('./GameLogicSystem.js');
const AudioSystem = require('./AudioSystem.js');
const UISystem = require('./UISystem.js');

class WarcraftRTSGame {
  constructor() {
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.gameState = null;
    this.graphicsSystem = null;
    this.inputSystem = null;
    this.gameLogicSystem = null;
    this.audioSystem = null;
    this.uiSystem = null;

    this.lastTime = 0;
    this.isRunning = false;
    this.isPaused = false;

    this.initializeGame();
  }

  initializeGame() {
    // Create game canvas
    this.createCanvas();

    // Initialize Three.js scene
    this.initializeThree.js();

    // Initialize game state
    this.gameState = new GameState();

    // Initialize game systems
    this.graphicsSystem = new GraphicsSystem(this.scene, this.camera);
    this.inputSystem = new InputSystem();
    this.gameLogicSystem = new GameLogicSystem();
    this.audioSystem = new AudioSystem();
    this.uiSystem = new UISystem();

    // Set up world
    this.setupWorld();

    // Create initial game content
    this.createInitialContent();

    // Set up event listeners
    this.setupEventListeners();

    // Start game loop
    this.startGameLoop();

    console.log('Warcraft RTS Game initialized successfully!');
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'gameCanvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    document.body.appendChild(this.canvas);

    document.body.appendChild(this.uiSystem.canvas);
  }

  initializeThree.js() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
      console.error('Three.js is not loaded!');
      return;
    }

    // Set up scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  setupWorld() {
    // Create terrain
    this.createTerrain();

    // Create initial resources
    this.createResources();

    // Set up lighting
    this.setupLighting();

    // Initialize game world
    this.gameState.gameWorld.map.terrain = [];
    this.gameState.gameWorld.map.resources = [];
    this.gameState.gameWorld.map.structures = [];
    this.gameState.gameWorld.map.units = [];

    // Create initial players
    this.createPlayers();

    // Set current player to first player
    this.gameState.selectPlayer(0);
  }

  createTerrain() {
    // Create simple terrain plane
    const terrainGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    terrain.position.set(0, 0, 0);

    this.scene.add(terrain);
    this.gameState.gameWorld.map.terrain.push(terrain);
  }

  createResources() {
    // Create resource nodes
    const resourceTypes = [
      { type: 'wood', amount: 100, color: 0x2e7d32, icon: '🌳' },
      { type: 'gold', amount: 50, color: 0xffd700, icon: '💰' },
      { type: 'magic', amount: 30, color: 0x9b30ff, icon: '🔮' }
    ];

    // Create resource nodes at strategic locations
    const resourcePositions = [
      { x: 300, z: 300 },
      { x: 500, z: 200 },
      { x: 200, z: 500 },
      { x: -300, z: -300 },
      { x: -500, z: -200 },
      { x: -200, z: -500 },
      { x: 300, z: -300 },
      { x: 500, z: -200 },
      { x: 200, z: -500 }
    ];

    for (let i = 0; i < Math.min(resourcePositions.length, 15); i++) {
      const position = resourcePositions[i];
      const typeInfo = resourceTypes[i % resourceTypes.length];

      const resource = {
        id: this.generateId(),
        type: typeInfo.type,
        amount: typeInfo.amount,
        position: new THREE.Vector3(position.x, 0, position.z),
        mesh: null,
        color: typeInfo.color,
        icon: typeInfo.icon
      };

      this.gameState.gameWorld.map.resources.push(resource);

      // Create visual representation
      const geometry = new THREE.SphereGeometry(0.5, 8, 8);
      const material = new THREE.MeshLambertMaterial({ color: typeInfo.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(resource.position);
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      resource.mesh = mesh;
      this.scene.add(mesh);
    }
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point lights for special effects
    const pointLight1 = new THREE.PointLight(0xff6b6b, 0.5, 100);
    pointLight1.position.set(50, 30, 20);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.5, 100);
    pointLight2.position.set(-50, 30, 20);
    this.scene.add(pointLight2);
  }

  createPlayers() {
    // Create three players with different races
    const races = ['human', 'nightElf', 'orc'];
    const colors = {
      human: '#4a90e2',
      nightElf: '#95e77e',
      orc: '#e74c3c'
    };

    for (let i = 0; i < 3; i++) {
      const race = races[i];
      const color = colors[race];

      this.gameState.addPlayer(
        `Player ${i + 1}`, // Name
        race,               // Race
        color              // Color
      );
    }

    // Set starting positions
    const startingPositions = [
      { x: 100, z: 100 },   // Player 1 (Human)
      { x: -100, z: -100 }, // Player 2 (Night Elf)
      { x: 100, z: -100 }   // Player 3 (Orc)
    ];

    for (let i = 0; i < this.gameState.players.length; i++) {
      const player = this.gameState.players[i];
      const position = startingPositions[i];
      player.startLocation = position;
    }
  }

  createInitialContent() {
    // Create starting structures for each player
    const startingPositions = [
      { x: 120, z: 120 },   // Player 1 (Human)
      { x: -80, z: -80 },   // Player 2 (Night Elf)
      { x: 120, z: -120 }   // Player 3 (Orc)
    ];

    for (let i = 0; i < this.gameState.players.length; i++) {
      const player = this.gameState.players[i];
      const position = startingPositions[i];

      this.createStartingStructure(player, position);
      this.createStartingUnits(player, position);
    }
  }

  createStartingStructure(player, position) {
    const race = player.race;
    let structureType = 'barracks';
    let color = '#3a5885';

    if (race === 'nightElf') {
      structureType = 'forestLodge';
      color = '#2e7d32';
    } else if (race === 'orc') {
      structureType = 'barracks';
      color = '#8b0000';
    }

    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshLambertMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, 1.5, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const structure = {
      id: this.generateId(),
      type: structureType,
      race: race,
      position: new THREE.Vector3(position.x, 1.5, position.z),
      mesh: mesh,
      health: 100,
      maxHealth: 100,
      owner: player.id,
      isBuilt: true
    };

    this.scene.add(mesh);
    this.gameState.gameWorld.map.structures.push(structure);
    player.civilization.buildings.push(structureType);

    // Cost resources
    player.civilization.resources.wood -= 50;
    player.civilization.resources.gold -= 100;

    return structure;
  }

  createStartingUnits(player, position) {
    const race = player.race;
    const unitTypes = this.getStartingUnits(race);

    for (const unitType of unitTypes) {
      this.createUnit(unitType, position, player);
    }
  }

  getStartingUnits(race) {
    const units = {
      human: ['knight', 'archer'],
      nightElf: ['ranger', 'druid'],
      orc: ['grunt', 'shaman']
    };

    return units[race] || [];
  }

  createUnit(type, position, player) {
    const model = this.graphicsSystem.models.get(type);
    if (!model) return null;

    const unit = new THREE.Mesh(model.geometry.clone(), model.material.clone());
    unit.position.set(position.x, 1.5, position.z);
    unit.castShadow = true;
    unit.receiveShadow = true;

    const unitData = {
      id: this.generateId(),
      type: type,
      race: player.race,
      position: new THREE.Vector3(position.x, 1.5, position.z),
      mesh: unit,
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5,
      speed: 3,
      range: 5,
      owner: player.id,
      isActive: true
    };

    this.scene.add(unit);
    this.gameState.gameWorld.map.units.push(unitData);
    player.civilization.units.push(type);

    // Cost resources
    player.civilization.resources.gold -= 80;

    return unitData;
  }

  setupEventListeners() {
    // Input system events
    this.inputSystem.addEventListener('mouseClick', (event) => {
      this.handleMouseClick(event);
    });

    this.inputSystem.addEventListener('keyPress', (event) => {
      this.handleKeyPress(event);
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Game menu events
    this.setupUIEventListeners();
  }

  handleMouseClick(event) {
    // Convert mouse coordinates to world coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    // Create raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // Check for terrain clicks
    const terrainIntersection = raycaster.intersectObjects(this.gameState.gameWorld.map.terrain);
    if (terrainIntersection.length > 0) {
      const point = terrainIntersection[0].point;

      // Check for structure clicks
      const structureIntersections = raycaster.intersectObjects(
        this.gameState.gameWorld.map.structures.map(s => s.mesh)
      );

      if (structureIntersections.length > 0) {
        const structureMesh = structureIntersections[0].object;
        const structure = this.gameState.gameWorld.map.structures.find(s => s.mesh === structureMesh);

        if (structure) {
          this.uiSystem.selectStructure(structure);
        }
      } else {
        this.uiSystem.deselectAll();
      }
    }
  }

  handleKeyPress(event) {
    switch (event.key) {
      case 'Escape':
        this.handleEscape();
        break;
      case 'Tab':
        event.preventDefault();
        this.uiSystem.cycleUnitSelection();
        break;
      case 'r':
        // Build command
        this.handleBuildCommand();
        break;
      case 'f':
        // Attack command
        this.handleAttackCommand();
        break;
      case 'g':
        // Gather command
        this.handleGatherCommand();
        break;
      case 't':
        // Train unit command
        this.handleTrainCommand();
        break;
    }
  }

  handleEscape() {
    if (this.gameState.gameMode === 'PLAYING') {
      this.gameState.gameMode = 'PAUSED';
      this.uiSystem.showPauseMenu();
    } else if (this.gameState.gameMode === 'PAUSED') {
      this.gameState.gameMode = 'PLAYING';
      this.uiSystem.hidePauseMenu();
    }
  }

  handleBuildCommand() {
    // TODO: Implement build command
    this.uiSystem.addNotification('Build command not yet implemented');
  }

  handleAttackCommand() {
    // TODO: Implement attack command
    this.uiSystem.addNotification('Attack command not yet implemented');
  }

  handleGatherCommand() {
    // TODO: Implement gather command
    this.uiSystem.addNotification('Gather command not yet implemented');
  }

  handleTrainCommand() {
    // TODO: Implement train command
    this.uiSystem.addNotification('Train command not yet implemented');
  }

  setupUIEventListeners() {
    // UI event listeners
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.handleEscape();
      }
    });
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uiSystem.handleResize();
  }

  startGameLoop() {
    const animate = (time) => {
      if (!this.isRunning) {
        return;
      }

      const deltaTime = time - this.lastTime;
      this.lastTime = time;

      // Update game systems
      this.update(deltaTime);

      // Render
      this.render();

      requestAnimationFrame(animate);
    };

    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(animate);
  }

  update(deltaTime) {
    if (this.gameState.gameMode !== 'PLAYING') {
      return;
    }

    // Update all game systems
    this.graphicsSystem.update();
    this.inputSystem.update();
    this.gameLogicSystem.update();
    this.audioSystem.update();
    this.uiSystem.update();

    // Update game world
    this.updateGameWorld(deltaTime);
  }

  updateGameWorld(deltaTime) {
    // Update day/night cycle
    this.gameState.gameWorld.time.dayNightCycle += deltaTime / 60000; // Update based on real time
    if (this.gameState.gameWorld.time.dayNightCycle >= 1.0) {
      this.gameState.gameWorld.time.dayNightCycle = 0;
    }

    const cycle = this.gameState.gameWorld.time.dayNightCycle;
    if (cycle < 0.3) {
      this.gameState.gameWorld.time.timeOfDay = 'morning';
    } else if (cycle < 0.6) {
      this.gameState.gameWorld.time.timeOfDay = 'afternoon';
    } else if (cycle < 0.9) {
      this.gameState.gameWorld.time.timeOfDay = 'evening';
    } else {
      this.gameState.gameWorld.time.timeOfDay = 'night';
    }

    // Update weather
    this.gameState.gameWorld.time.weather = this.getWeatherForTimeOfDay(this.gameState.gameWorld.time.timeOfDay);

    // Update economy
    this.updateEconomy(deltaTime);

    // Update units
    this.updateUnits(deltaTime);

    // Update structures
    this.updateStructures(deltaTime);

    // Check for game end conditions
    this.checkGameEnd();
  }

  updateEconomy(deltaTime) {
    // Update resource production for each civilization
    for (const player of this.gameState.players) {
      if (!player.civilization) continue;

      const civilization = player.civilization;

      // Calculate production per second
      const foodProduction = civilization.buildings.includes('barracks') ? 10 : 0;
      const woodProduction = civilization.buildings.includes('lumberMill') ? 15 : 0;
      const goldProduction = civilization.buildings.includes('mine') ? 8 : 0;
      const magicProduction = civilization.buildings.includes('arcaneWell') ? 5 : 0;

      civilization.foodProduction = foodProduction;
      civilization.woodProduction = woodProduction;
      civilization.goldProduction = goldProduction;
      civilization.magicProduction = magicProduction;

      // Update resources based on delta time
      const deltaSeconds = deltaTime / 1000;
      this.gameState.gameWorld.economy.food += foodProduction * deltaSeconds;
      this.gameState.gameWorld.economy.wood += woodProduction * deltaSeconds;
      this.gameState.gameWorld.economy.gold += goldProduction * deltaSeconds;
      this.gameState.gameWorld.economy.magic += magicProduction * deltaSeconds;

      // Update player resources
      for (const player of this.gameState.players) {
        if (!player.civilization) continue;

        player.civilization.resources.food += civilization.foodProduction * deltaSeconds;
        player.civilization.resources.wood += civilization.woodProduction * deltaSeconds;
        player.civilization.resources.gold += civilization.goldProduction * deltaSeconds;
        player.civilization.resources.magic += civilization.magicProduction * deltaSeconds;
      }

      // Check for resource starvation
      if (this.gameState.gameWorld.economy.food <= 0) {
        this.gameState.gameWorld.economy.food = 0;
        civilization.health = Math.max(0, civilization.health - 1 * deltaSeconds);
      }

      // Cap food at reasonable level
      if (this.gameState.gameWorld.economy.food > 100) {
        this.gameState.gameWorld.economy.food = 100;
      }
    }
  }

  updateUnits(deltaTime) {
    // Update all units
    for (const unit of this.gameState.gameWorld.map.units) {
      if (unit.isDead) {
        this.removeUnit(unit);
        continue;
      }

      // Update unit health regeneration
      if (unit.health < unit.maxHealth) {
        unit.health = Math.min(unit.health + deltaTime / 1000, unit.maxHealth);
      }

      // Update unit position (simplified)
      if (unit.isMoving && unit.path && unit.currentPathIndex < unit.path.length) {
        const target = unit.path[unit.currentPathIndex];
        const direction = new THREE.Vector3().subVectors(target, unit.position);
        const distance = direction.length();

        if (distance > 0.5) {
          direction.normalize();
          direction.multiplyScalar(unit.speed * 16 * (deltaTime / 1000)); // pixels per second
          unit.position.add(direction);
        } else {
          unit.currentPathIndex++;
        }

        // Update mesh position
        if (unit.mesh) {
          unit.mesh.position.copy(unit.position);
        }
      }
    }
  }

  updateStructures(deltaTime) {
    // Update all structures
    for (const structure of this.gameState.gameWorld.map.structures) {
      if (structure.health < structure.maxHealth) {
        structure.health = Math.min(structure.health + deltaTime / 1000, structure.maxHealth);
      }
    }
  }

  removeUnit(unit) {
    const index = this.gameState.gameWorld.map.units.indexOf(unit);
    if (index > -1) {
      this.gameState.gameWorld.map.units.splice(index, 1);
    }

    if (unit.mesh && this.scene) {
      this.scene.remove(unit.mesh);
      unit.mesh.geometry.dispose();
      unit.mesh.material.dispose();
    }

    // Remove from player civilization
    const player = this.gameState.players.find(p => p.id === unit.owner);
    if (player && player.civilization) {
      const unitIndex = player.civilization.units.indexOf(unit.type);
      if (unitIndex > -1) {
        player.civilization.units.splice(unitIndex, 1);
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

  checkGameEnd() {
    // Check win/loss conditions
    let activePlayers = 0;
    let winner = null;

    for (const player of this.gameState.players) {
      if (player.civilization && player.civilization.health > 0) {
        activePlayers++;
      }
    }

    if (activePlayers === 0) {
      this.gameState.gameMode = 'GAME_OVER';
      this.gameState.gameState = 'DRAW';
      this.uiSystem.showGameOverScreen(null);
    } else if (activePlayers === 1) {
      this.gameState.gameMode = 'GAME_OVER';
      for (const player of this.gameState.players) {
        if (player.civilization && player.civilization.health > 0) {
          winner = player;
          this.gameState.gameState = winner.race === 'Human' ? 'HUMAN_VICTORY' : winner.race === 'Night Elf' ? 'NIGHT_ELF_VICTORY' : 'ORC_VICTORY';
          break;
        }
      }

      if (winner) {
        this.uiSystem.showGameOverScreen(winner);
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  // Public methods

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.startGameLoop();
  }

  pause() {
    this.isPaused = true;
    this.gameState.gameMode = 'PAUSED';
    this.uiSystem.showPauseMenu();
  }

  resume() {
    this.isPaused = false;
    this.gameState.gameMode = 'PLAYING';
    this.uiSystem.hidePauseMenu();
  }

  stop() {
    this.isRunning = false;
    this.gameState.gameMode = 'MENU';
  }

  destroy() {
    // Clean up game
    this.stop();

    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Clean up Three.js
    if (this.renderer) {
      this.renderer.dispose();
    }

    // Clean up game systems
    if (this.graphicsSystem) {
      this.graphicsSystem.dispose();
    }
    if (this.audioSystem) {
      this.audioSystem.dispose();
    }
    if (this.uiSystem) {
      this.uiSystem.dispose();
    }

    // Clear game state
    this.gameState = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.graphicsSystem = null;
    this.inputSystem = null;
    this.gameLogicSystem = null;
    this.audioSystem = null;
    this.uiSystem = null;
  }
}

module.exports = WarcraftRTSGame;