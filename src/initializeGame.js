// Initialize game and create starting units for all three races
function initializeGame() {
  // Setup canvas and renderer
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);

  // Set up Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Initialize game state
  const gameState = new GameState();

  // Add three players with different races
  gameState.addPlayer('Player 1', 'human', '#4a90e2'); // Human Empire
  gameState.addPlayer('Player 2', 'nightElf', '#95e77e'); // Night Elf Alliance
  gameState.addPlayer('Player 3', 'orc', '#e74c3c'); // Orc Horde

  // Initialize game systems
  const graphicsSystem = new GraphicsSystem(scene, camera);
  const inputSystem = new InputSystem();
  const gameLogicSystem = new GameLogicSystem();
  const audioSystem = new AudioSystem();
  const uiSystem = new UISystem();

  // Set up world
  setupWorld(gameState);

  // Create initial structures and units for each player
  createStartingStructures(gameState, graphicsSystem);
  createStartingUnits(gameState, graphicsSystem);

  // Create initial resources
  createInitialResources(gameState, graphicsSystem);

  // Initialize game camera
  setupCamera(camera, gameState);

  // Start game loop
  startGameLoop(gameState, graphicsSystem, inputSystem, gameLogicSystem, audioSystem, uiSystem);

  // Set up UI event listeners
  setupUIEvents(uiSystem, gameState);

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    uiSystem.handleResize();
  });

  console.log('Game initialized successfully!');
}

function setupWorld(gameState) {
  // Create terrain
  const terrainGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
  const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  terrain.position.set(0, 0, 0);

  gameState.gameWorld.map.terrain = [terrain];

  // Create initial resource nodes
  gameState.gameWorld.map.resources = [];

  // Set up AI systems
  for (const player of gameState.players) {
    if (player.id !== 0) { // AI players
      player.ai = new AISystem(player);
    }
  }

  // Set current player to human player
  gameState.selectPlayer(0);
}

function setupCamera(camera, gameState) {
  // Position camera for strategic view
  camera.position.set(0, 50, 100);
  camera.lookAt(0, 0, 0);
}

function createStartingStructures(gameState, graphicsSystem) {
  // Create starting structures for each player
  const startingPositions = [
    { x: 100, z: 100 }, // Player 1 (Human)
    { x: -100, z: -100 }, // Player 2 (Night Elf)
    { x: 100, z: -100 } // Player 3 (Orc)
  ];

  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i];
    const position = startingPositions[i];

    if (player.race === 'human') {
      // Create barracks
      createStructure('barracks', position, player, graphicsSystem, '#3a5885');
    } else if (player.race === 'nightElf') {
      // Create forest lodge
      createStructure('forestLodge', position, player, graphicsSystem, '#2e7d32');
    } else if (player.race === 'orc') {
      // Create barracks
      createStructure('barracks', position, player, graphicsSystem, '#8b0000');
    }
  }
}

function createStartingUnits(gameState, graphicsSystem) {
  // Create starting units for each player
  const startingPositions = [
    { x: 120, z: 120 }, // Player 1 (Human)
    { x: -80, z: -80 }, // Player 2 (Night Elf)
    { x: 120, z: -120 } // Player 3 (Orc)
  ];

  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i];
    const position = startingPositions[i];

    if (player.race === 'human') {
      // Create 1 knight and 1 archer
      createUnit('knight', position, player, graphicsSystem);
      createUnit('archer', position, player, graphicsSystem);
    } else if (player.race === 'nightElf') {
      // Create 1 ranger and 1 druid
      createUnit('ranger', position, player, graphicsSystem);
      createUnit('druid', position, player, graphicsSystem);
    } else if (player.race === 'orc') {
      // Create 1 grunt and 1 shaman
      createUnit('grunt', position, player, graphicsSystem);
      createUnit('shaman', position, player, graphicsSystem);
    }
  }
}

function createInitialResources(gameState, graphicsSystem) {
  // Create resource nodes throughout the map
  const resourceTypes = [
    { type: 'wood', amount: 100, color: 0x2e7d32 },
    { type: 'gold', amount: 50, color: 0xffd700 },
    { type: 'magic', amount: 30, color: 0x9b30ff }
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
      id: generateId(),
      type: typeInfo.type,
      amount: typeInfo.amount,
      position: new THREE.Vector3(position.x, 0, position.z),
      mesh: null,
      color: typeInfo.color
    };

    gameState.gameWorld.map.resources.push(resource);

    // Create visual representation
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshLambertMaterial({ color: typeInfo.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(resource.position);
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    resource.mesh = mesh;
  }
}

function createStructure(type, position, player, graphicsSystem, color) {
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshLambertMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, 1.5, position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const structure = {
    id: generateId(),
    type,
    race: player.race,
    position: new THREE.Vector3(position.x, 1.5, position.z),
    mesh,
    health: 100,
    maxHealth: 100,
    owner: player.id,
    isBuilt: true
  };

  player.civilization.buildings.push(type);
  player.civilization.resources.wood -= 50;
  player.civilization.resources.gold -= 100;

  graphicsSystem.scene.add(mesh);
  gameState.gameWorld.map.structures.push(structure);

  return structure;
}

function createUnit(type, position, player, graphicsSystem) {
  const model = graphicsSystem.models.get(type);
  if (!model) return null;

  const unit = new THREE.Mesh(model.geometry.clone(), model.material.clone());
  unit.position.set(position.x, 1.5, position.z);
  unit.castShadow = true;
  unit.receiveShadow = true;

  const unitData = {
    id: generateId(),
    type,
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

  player.civilization.units.push(type);
  player.civilization.resources.gold -= 80;

  graphicsSystem.scene.add(unit);
  gameState.gameWorld.map.units.push(unitData);

  return unitData;
}

function startGameLoop(gameState, graphicsSystem, inputSystem, gameLogicSystem, audioSystem, uiSystem) {
  const animate = () => {
    requestAnimationFrame(animate);

    // Update game systems
    graphicsSystem.update();
    inputSystem.update();
    gameLogicSystem.update();
    audioSystem.update();
    uiSystem.update();

    // Render
    graphicsSystem.render();
  };

  animate();
}

function setupUIEvents(uiSystem, gameState) {
  // UI event setup
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      gameState.gameMode = gameState.gameMode === 'PLAYING' ? 'PAUSED' : 'PLAYING';
    }
  });
}

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Initialize Three.js
if (typeof THREE === 'undefined') {
  console.error('Three.js not loaded!');
} else {
  // Initialize game when page loads
  document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
  });
}

module.exports = initializeGame;