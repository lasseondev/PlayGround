import * as THREE from '../vendor/three.module.min.js';
import { VoxelWorld } from './world.js';
import { BLOCKS, BLOCK_BY_ID, ITEMS, RECIPES, STARTER_INVENTORY, SAVE_KEY, SEA_LEVEL } from './content.js';
import { GameUI } from './ui.js';

const canvas = document.getElementById('game');
const app = document.getElementById('app');
const ui = new GameUI();

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#9dd7ec');
scene.fog = new THREE.Fog('#bde8f2', 22, 64);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 260);
camera.rotation.order = 'YXZ';

const hemi = new THREE.HemisphereLight(0xdff4ff, 0x3f4c32, 1.05);
scene.add(hemi);
const sunLight = new THREE.DirectionalLight(0xfff0cf, 2.1);
sunLight.position.set(38, 62, 28);
scene.add(sunLight);
const fillLight = new THREE.DirectionalLight(0x8fb6c9, 0.35);
fillLight.position.set(-30, 20, -35);
scene.add(fillLight);

const skyUniforms = {
  topColor: { value: new THREE.Color('#4f92ca') },
  horizonColor: { value: new THREE.Color('#c9edf5') },
  bottomColor: { value: new THREE.Color('#8bb8c8') }
};
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(180, 32, 18),
  new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float height = normalize(vWorldPosition).y;
        vec3 lower = mix(bottomColor, horizonColor, smoothstep(-0.25, 0.02, height));
        vec3 upper = mix(horizonColor, topColor, pow(max(height, 0.0), 0.55));
        gl_FragColor = vec4(mix(lower, upper, step(0.0, height)), 1.0);
      }
    `
  })
);
sky.renderOrder = -10;
scene.add(sky);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3.4, 18, 12),
  new THREE.MeshBasicMaterial({ color: 0xfff2c4, fog: false })
);
scene.add(sun);
const sunGlowCanvas = document.createElement('canvas');
sunGlowCanvas.width = 128;
sunGlowCanvas.height = 128;
const glowContext = sunGlowCanvas.getContext('2d');
const gradient = glowContext.createRadialGradient(64, 64, 4, 64, 64, 64);
gradient.addColorStop(0, 'rgba(255,245,205,0.85)');
gradient.addColorStop(0.35, 'rgba(255,220,140,0.28)');
gradient.addColorStop(1, 'rgba(255,210,120,0)');
glowContext.fillStyle = gradient;
glowContext.fillRect(0, 0, 128, 128);
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(sunGlowCanvas), transparent: true, depthWrite: false, fog: false
}));
sunGlow.scale.set(44, 44, 1);
scene.add(sunGlow);

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(520, 520),
  new THREE.MeshBasicMaterial({ color: 0x3f8fc0, fog: true })
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = SEA_LEVEL + 0.92;
scene.add(ocean);

const clouds = new THREE.Group();
const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 });
const cloudRandom = (() => {
  let seed = 4242;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
})();
for (let i = 0; i < 13; i++) {
  const cloud = new THREE.Group();
  const parts = 3 + Math.floor(cloudRandom() * 3);
  for (let p = 0; p < parts; p++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(4 + cloudRandom() * 5, 1 + cloudRandom() * 0.8, 3 + cloudRandom() * 3), cloudMaterial);
    box.position.set(p * 3.2 - parts * 1.5, cloudRandom() * 0.8, cloudRandom() * 2.4);
    cloud.add(box);
  }
  cloud.position.set(-30 + cloudRandom() * 110, 34 + cloudRandom() * 10, -30 + cloudRandom() * 110);
  clouds.add(cloud);
}
scene.add(clouds);

const highlight = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1.006, 1.006, 1.006)),
  new THREE.LineBasicMaterial({ color: 0x10251d, transparent: true, opacity: 0.85 })
);
highlight.visible = false;
scene.add(highlight);

const dayTop = new THREE.Color('#4f92ca');
const dayHorizon = new THREE.Color('#c9edf5');
const dayBottom = new THREE.Color('#8bb8c8');
const nightTop = new THREE.Color('#060d21');
const nightHorizon = new THREE.Color('#1d2e4d');
const nightBottom = new THREE.Color('#0a1424');
const sunWarm = new THREE.Color('#ffdca0');
const sunCold = new THREE.Color('#9ec2e8');
const fogDay = new THREE.Color('#bde8f2');
const fogNight = new THREE.Color('#16233a');
const oceanDay = new THREE.Color('#3f8fc0');
const oceanNight = new THREE.Color('#0e2236');

const state = {
  world: null,
  inventory: STARTER_INVENTORY.map((item) => item ? { ...item } : null),
  selected: 0,
  started: false,
  dead: false,
  inventoryOpen: false,
  dayTime: 0.34,
  orbit: 0.55,
  elapsed: 0,
  fps: 60,
  hintTimer: 0,
  saveClock: 0,
  ready: false,
  lookGuard: 0
};

const player = {
  position: new THREE.Vector3(24, 12, 24),
  velocity: new THREE.Vector3(),
  yaw: Math.PI * 0.25,
  pitch: -0.1,
  onGround: false,
  health: 20,
  hunger: 20,
  bob: 0,
  fallStart: null
};

const keys = new Set();

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.seed !== 'number' || !parsed.inventory) return null;
    if (!Array.isArray(parsed.inventory)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSave() {
  if (!state.started || !state.world) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1,
      seed: state.world.seed,
      edits: state.world.edits,
      inventory: state.inventory,
      player: {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z,
        yaw: player.yaw,
        pitch: player.pitch
      },
      health: player.health,
      hunger: player.hunger,
      dayTime: state.dayTime,
      savedAt: Date.now()
    }));
  } catch {
    ui.showToast('Could not save this island');
  }
}

function addItem(id, count, durability) {
  const definition = ITEMS[id];
  if (!definition) return count;
  const stackLimit = definition.kind === 'tool' ? 1 : 64;
  let remaining = count;
  for (let i = 0; i < state.inventory.length && remaining > 0; i++) {
    const slot = state.inventory[i];
    if (!slot || slot.id !== id) continue;
    if (slot.durability !== undefined) continue;
    const room = stackLimit - slot.count;
    if (room <= 0) continue;
    const moved = Math.min(room, remaining);
    slot.count += moved;
    remaining -= moved;
  }
  for (let i = 0; i < state.inventory.length && remaining > 0; i++) {
    if (state.inventory[i]) continue;
    const moved = Math.min(stackLimit, remaining);
    state.inventory[i] = durability !== undefined
      ? { id, count: moved, durability }
      : { id, count: moved };
    remaining -= moved;
  }
  return remaining;
}

function countItem(id) {
  let count = 0;
  for (const slot of state.inventory) if (slot && slot.id === id) count += slot.count;
  return count;
}

function removeItem(id, count) {
  let remaining = count;
  for (let i = 0; i < state.inventory.length && remaining > 0; i++) {
    const slot = state.inventory[i];
    if (!slot || slot.id !== id) continue;
    const moved = Math.min(slot.count, remaining);
    slot.count -= moved;
    remaining -= moved;
    if (slot.count <= 0) state.inventory[i] = null;
  }
  return remaining === 0;
}

function rebuildWorld(seed, edits = {}) {
  if (state.world) state.world.disposeMeshes();
  state.world = new VoxelWorld(seed, edits);
  scene.add(state.world.buildMeshes());
  state.orbit = 0.55;
}

function resetToStarter() {
  state.inventory = STARTER_INVENTORY.map((item) => item ? { ...item } : null);
  state.selected = 0;
  player.health = 20;
  player.hunger = 20;
  player.position.set(state.world.spawn.x, state.world.spawn.y, state.world.spawn.z);
  player.velocity.set(0, 0, 0);
  const dx = player.position.x - state.world.size / 2;
  const dz = player.position.z - state.world.size / 2;
  player.yaw = state.world.vista?.yaw ?? (Math.hypot(dx, dz) < 0.5 ? Math.PI * 0.25 : Math.atan2(-dx, -dz));
  player.pitch = state.world.vista?.pitch ?? -0.12;
  state.dayTime = 0.34;
}

function startGame() {
  const seed = ui.getSeed();
  const saved = readSave();
  const resume = saved && saved.seed === seed;
  if (!state.world || state.world.seed !== seed) rebuildWorld(seed, resume ? saved.edits : {});
  if (resume) {
    state.inventory = saved.inventory.map((item) => item ? { ...item } : null);
    while (state.inventory.length < 36) state.inventory.push(null);
    state.selected = 0;
    player.health = Number.isFinite(saved.health) ? saved.health : 20;
    player.hunger = Number.isFinite(saved.hunger) ? saved.hunger : 20;
    player.position.set(saved.player?.x ?? state.world.spawn.x, saved.player?.y ?? state.world.spawn.y, saved.player?.z ?? state.world.spawn.z);
    player.velocity.set(0, 0, 0);
    player.yaw = Number.isFinite(saved.player?.yaw) ? saved.player.yaw : Math.PI * 0.25;
    player.pitch = Number.isFinite(saved.player?.pitch) ? saved.player.pitch : -0.1;
    state.dayTime = Number.isFinite(saved.dayTime) ? saved.dayTime : 0.34;
  } else {
    resetToStarter();
  }
  state.started = true;
  state.dead = false;
  state.inventoryOpen = false;
  state.saveClock = 0;
  ui.enterGame();
  ui.setLoading(false);
  ui.updateVitals(player.health, player.hunger);
  syncInventory();
  applyCamera();
  state.lookGuard = performance.now() + 700;
  try {
    canvas.requestPointerLock();
  } catch {
    ui.showToast('Click the world to look around');
  }
  ui.showToast(resume ? 'Island restored' : 'Welcome to Voxel Isle', 2400);
  writeSave();
}

function newIsland() {
  const seed = 1000 + Math.floor(Math.random() * 9000);
  localStorage.removeItem(SAVE_KEY);
  rebuildWorld(seed);
  ui.setSeed(seed);
  ui.setSaveHint(false);
  resetToStarter();
  ui.showToast('New island generated', 1600);
}

function respawn() {
  state.dead = false;
  player.health = 20;
  player.hunger = 20;
  player.position.set(state.world.spawn.x, state.world.spawn.y, state.world.spawn.z);
  player.velocity.set(0, 0, 0);
  ui.hideDeath();
  ui.updateVitals(player.health, player.hunger);
  ui.showToast('Back on your feet', 1600);
  try {
    canvas.requestPointerLock();
  } catch {}
  writeSave();
}

function syncInventory() {
  ui.renderHotbar(state.inventory, state.selected);
  if (state.inventoryOpen) ui.renderInventory(state.inventory, state.selected);
}

function openInventory() {
  if (!state.started || state.dead) return;
  state.inventoryOpen = true;
  ui.renderInventory(state.inventory, state.selected);
  ui.toggleInventory(true);
  ui.setPaused(false);
  document.exitPointerLock?.();
}

function closeInventory() {
  state.inventoryOpen = false;
  ui.toggleInventory(false);
  if (state.started && !state.dead) {
    try {
      canvas.requestPointerLock();
    } catch {}
    ui.setPaused(false);
  }
}

function selectSlot(index) {
  state.selected = ((index % 9) + 9) % 9;
  syncInventory();
}

function craft(recipeId) {
  const recipe = RECIPES.find((entry) => entry.id === recipeId);
  if (!recipe) return;
  if (!recipe.ingredients.every((ingredient) => countItem(ingredient.id) >= ingredient.count)) {
    ui.showToast('Missing ingredients');
    return;
  }
  for (const ingredient of recipe.ingredients) removeItem(ingredient.id, ingredient.count);
  addItem(recipe.out.id, recipe.out.count);
  syncInventory();
  ui.showToast(`Crafted ${recipe.name}${recipe.out.count > 1 ? ` x${recipe.out.count}` : ''}`);
  playSound('craft');
}

function intersectsPlayer(x, y, z) {
  const radius = 0.32;
  return x + 1 > player.position.x - radius && x < player.position.x + radius
    && z + 1 > player.position.z - radius && z < player.position.z + radius
    && y + 1 > player.position.y && y < player.position.y + 1.8;
}

function raycastVoxel(maxDistance = 6) {
  if (!state.world) return null;
  const direction = camera.getWorldDirection(new THREE.Vector3());
  const origin = camera.position;
  let previous = {
    x: Math.floor(origin.x),
    y: Math.floor(origin.y),
    z: Math.floor(origin.z)
  };
  const step = 0.028;
  for (let distance = 0; distance < maxDistance; distance += step) {
    const x = Math.floor(origin.x + direction.x * distance);
    const y = Math.floor(origin.y + direction.y * distance);
    const z = Math.floor(origin.z + direction.z * distance);
    if (x === previous.x && y === previous.y && z === previous.z) continue;
    const key = state.world.getKey(x, y, z);
    if (key !== 'air' && key !== 'water' && key !== 'bedrock' || key === 'bedrock') {
      if (key === 'air' || key === 'water') {
        previous = { x, y, z };
        continue;
      }
      return {
        x, y, z, key,
        normal: { x: previous.x - x, y: previous.y - y, z: previous.z - z }
      };
    }
    previous = { x, y, z };
  }
  return null;
}

function breakBlock() {
  const hit = raycastVoxel();
  if (!hit) return;
  const block = BLOCKS[hit.key];
  if (!block) return;
  if (block.unbreakable) {
    ui.showToast('Bedrock cannot be broken');
    return;
  }
  const held = state.inventory[state.selected];
  const heldItem = held ? ITEMS[held.id] : null;
  const hasPickaxe = heldItem && heldItem.kind === 'tool' && heldItem.tool === 'pickaxe';
  if (block.needsPick && !hasPickaxe) {
    ui.showToast(`${block.name} needs a pickaxe`);
    return;
  }
  if (hit.key === 'iron_ore' && (!hasPickaxe || heldItem.tier < 2)) {
    ui.showToast('Iron ore needs a stone pickaxe');
    return;
  }
  state.world.set(hit.x, hit.y, hit.z, 0);
  if (hit.key === 'leaves') {
    if (Math.random() < 0.35) {
      addItem('apple', 1);
      ui.showToast('+1 Apple');
    }
  } else if (block.drop) {
    addItem(block.drop, 1);
    const definition = ITEMS[block.drop];
    ui.showToast(`+1 ${definition ? definition.name : block.drop}`);
  }
  if (heldItem && heldItem.kind === 'tool' && held.durability !== undefined) {
    held.durability -= 1;
    if (held.durability <= 0) {
      state.inventory[state.selected] = null;
      ui.showToast(`${heldItem.name} broke`);
    }
  }
  if (state.world) {
    state.world.disposeMeshes();
    scene.add(state.world.buildMeshes());
  }
  syncInventory();
  playSound('break');
  state.saveClock = 4.5;
}

function placeBlock() {
  const hit = raycastVoxel();
  if (!hit) return;
  if (hit.key === 'crafting_table') {
    openInventory();
    return;
  }
  const held = state.inventory[state.selected];
  if (!held) {
    ui.showToast('Select a block in your hotbar');
    return;
  }
  const definition = ITEMS[held.id];
  if (!definition || definition.kind !== 'block') {
    ui.showToast(`${definition ? definition.name : held.id} cannot be placed`);
    return;
  }
  const block = BLOCKS[definition.block];
  if (!block) return;
  const x = hit.x + hit.normal.x;
  const y = hit.y + hit.normal.y;
  const z = hit.z + hit.normal.z;
  if (!state.world.inBounds(x, y, z)) return;
  const targetKey = state.world.getKey(x, y, z);
  if (targetKey !== 'air' && targetKey !== 'water') return;
  if (intersectsPlayer(x, y, z)) {
    ui.showToast('Too close to place');
    return;
  }
  state.world.set(x, y, z, block.id);
  held.count -= 1;
  if (held.count <= 0) state.inventory[state.selected] = null;
  state.world.disposeMeshes();
  scene.add(state.world.buildMeshes());
  syncInventory();
  playSound('place');
  state.saveClock = 4.5;
}

function hurt(amount, message) {
  if (state.dead) return;
  player.health = Math.max(0, player.health - amount);
  ui.updateVitals(player.health, player.hunger);
  if (message) ui.showToast(message);
  document.body.classList.remove('hurt');
  void document.body.offsetWidth;
  document.body.classList.add('hurt');
  playSound('hurt');
  if (player.health <= 0) {
    state.dead = true;
    state.inventoryOpen = false;
    ui.toggleInventory(false);
    ui.showDeath();
    document.exitPointerLock?.();
  }
}

function playerCollides(x, y, z) {
  const radius = 0.29;
  const minX = Math.floor(x - radius);
  const maxX = Math.floor(x + radius);
  const minZ = Math.floor(z - radius);
  const maxZ = Math.floor(z + radius);
  const minY = Math.floor(y + 0.02);
  const maxY = Math.floor(y + 1.78);
  for (let bx = minX; bx <= maxX; bx++) {
    for (let by = minY; by <= maxY; by++) {
      for (let bz = minZ; bz <= maxZ; bz++) {
        if (state.world.isSolid(bx, by, bz)) return true;
      }
    }
  }
  return false;
}

function moveAxis(axis, amount) {
  if (amount === 0) return false;
  const previous = player.position[axis];
  player.position[axis] += amount;
  if (playerCollides(player.position.x, player.position.y, player.position.z)) {
    player.position[axis] = previous;
    if (axis === 'y') {
      if (amount < 0) {
        if (player.velocity.y < -9.5) {
          hurt(Math.floor((-player.velocity.y - 9.5) * 1.4), 'Ouch, fall damage');
        }
        player.onGround = true;
      }
      player.velocity.y = 0;
    }
    return true;
  }
  return false;
}

function inWaterAt(x, y, z) {
  return state.world.isWater(Math.floor(x), Math.floor(y), Math.floor(z));
}

function updatePlayer(dt) {
  if (!state.started || state.dead || state.inventoryOpen) return;
  const feetWater = inWaterAt(player.position.x, player.position.y + 0.15, player.position.z);
  const headWater = inWaterAt(player.position.x, player.position.y + 1.55, player.position.z);
  const sprinting = keys.has('ShiftLeft') || keys.has('ShiftRight');
  const canSprint = sprinting && player.hunger > 6;
  const speed = (canSprint ? 6.1 : 4.2) * (feetWater ? 0.62 : 1);
  const forwardInput = (keys.has('KeyW') ? 1 : 0) - (keys.has('KeyS') ? 1 : 0);
  const strafeInput = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
  const sin = Math.sin(player.yaw);
  const cos = Math.cos(player.yaw);
  let wishX = -sin * forwardInput + cos * strafeInput;
  let wishZ = -cos * forwardInput - sin * strafeInput;
  const length = Math.hypot(wishX, wishZ);
  if (length > 0) {
    wishX = (wishX / length) * speed;
    wishZ = (wishZ / length) * speed;
  }
  player.velocity.x = wishX;
  player.velocity.z = wishZ;

  if (feetWater) {
    if (keys.has('Space')) player.velocity.y = 4.2;
    else player.velocity.y = Math.max(player.velocity.y - 11 * dt, -2.6);
  } else {
    player.velocity.y -= 26 * dt;
    if (keys.has('Space') && player.onGround) {
      player.velocity.y = 8.4;
      player.onGround = false;
    }
  }
  player.velocity.y = Math.max(player.velocity.y, -34);

  player.onGround = false;
  moveAxis('x', player.velocity.x * dt);
  moveAxis('z', player.velocity.z * dt);
  moveAxis('y', player.velocity.y * dt);

  if (player.position.y < -8) {
    respawn();
    return;
  }

  if (length > 0 && player.onGround) player.bob += dt * (canSprint ? 12 : 8.5);
  else player.bob += dt * 2;

  if (headWater) {
    state.hintTimer += dt;
    if (state.hintTimer > 6) {
      state.hintTimer = 0;
      ui.showToast('Swim with SPACE and reach the surface', 1800);
    }
  }

  const hungerDrain = (canSprint && (forwardInput || strafeInput) ? 0.075 : 0.009) * dt;
  player.hunger = Math.max(0, player.hunger - hungerDrain);
  if (player.hunger <= 0) player.health = Math.max(0, player.health - dt * 1.1);
  else if (player.hunger > 16 && player.health < 20) player.health = Math.min(20, player.health + dt * 0.22);
  if (player.health <= 0 && !state.dead) hurt(0.1);

  state.dayTime = (state.dayTime + dt / 300) % 1;
}

function applyCamera() {
  if (!state.started) return;
  camera.position.set(
    player.position.x,
    player.position.y + 1.62 + Math.sin(player.bob) * 0.022,
    player.position.z
  );
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
}

function updateOrbit(dt) {
  state.orbit += dt * 0.045;
  const centerX = state.world ? state.world.size / 2 : 24;
  const centerZ = state.world ? state.world.size / 2 : 24;
  const radius = 39;
  camera.position.set(
    centerX + Math.cos(state.orbit) * radius,
    24 + Math.sin(state.orbit * 0.7) * 4,
    centerZ + Math.sin(state.orbit) * radius
  );
  camera.lookAt(centerX, 9.5, centerZ);
}

function updateEnvironment(dt) {
  const angle = (state.dayTime - 0.25) * Math.PI * 2;
  const elevation = Math.sin(angle);
  const daylight = Math.max(0, Math.min(1, elevation * 1.7));
  const twilight = Math.max(0, 1 - Math.abs(elevation) * 3.4);
  const sunDirection = new THREE.Vector3(Math.cos(angle) * 70, elevation * 90, 38).normalize();
  sunLight.position.copy(sunDirection).multiplyScalar(90);
  sunLight.intensity = 0.12 + daylight * 2.05;
  sunLight.color.copy(sunCold).lerp(sunWarm, daylight);
  hemi.intensity = 0.16 + daylight * 0.92;
  fillLight.intensity = 0.05 + daylight * 0.3;

  skyUniforms.topColor.value.copy(nightTop).lerp(dayTop, daylight);
  skyUniforms.horizonColor.value.copy(nightHorizon).lerp(dayHorizon, daylight).lerp(new THREE.Color('#efa072'), twilight * 0.3);
  skyUniforms.bottomColor.value.copy(nightBottom).lerp(dayBottom, daylight);
  scene.fog.color.copy(fogNight).lerp(fogDay, daylight);
  ocean.material.color.copy(oceanNight).lerp(oceanDay, daylight);
  ocean.position.x = camera.position.x;
  ocean.position.z = camera.position.z;
  scene.background.copy(scene.fog.color);
  cloudMaterial.color.setRGB(0.3 + daylight * 0.7, 0.32 + daylight * 0.68, 0.4 + daylight * 0.6);
  cloudMaterial.opacity = 0.18 + daylight * 0.6;

  if (state.started) {
    sun.position.copy(camera.position).addScaledVector(sunDirection, 130);
    sunGlow.position.copy(sun.position);
    sunGlow.visible = daylight > 0.02;
    sun.visible = daylight > 0.02;
  } else {
    sun.position.set(55, 70, 35);
    sunGlow.position.copy(sun.position);
  }
  sky.position.copy(camera.position);
  for (const cloud of clouds.children) {
    cloud.position.x += dt * 0.35;
    if (cloud.position.x > 78) cloud.position.x = -30;
  }
}

function updateTarget() {
  const hit = state.started && !state.dead ? raycastVoxel() : null;
  if (hit) {
    highlight.visible = true;
    highlight.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
    const block = BLOCKS[hit.key];
    const suffix = block?.needsPick ? ' · pickaxe' : '';
    ui.setTarget(`${block ? block.name : hit.key}${suffix}`);
  } else {
    highlight.visible = false;
    ui.setTarget('');
  }
}

function updateHud(dt) {
  state.elapsed += dt;
  if (state.elapsed < 0.16) return;
  const fps = 1 / Math.max(dt, 0.0001);
  state.fps = state.fps * 0.82 + Math.min(fps, 240) * 0.18;
  const totalMinutes = Math.floor(state.dayTime * 24 * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const timeText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const coords = `${Math.floor(player.position.x)} / ${Math.floor(player.position.y)} / ${Math.floor(player.position.z)}`;
  ui.updateStatus(timeText, state.fps, coords);
  ui.updateVitals(player.health, player.hunger);
  state.elapsed = 0;
}

function playSound(kind) {
  try {
    if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
    const context = state.audio;
    if (context.state === 'suspended') context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    const now = context.currentTime;
    if (kind === 'break') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      oscillator.start(now);
      oscillator.stop(now + 0.12);
    } else if (kind === 'place') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(180, now);
      oscillator.frequency.exponentialRampToValueAtTime(260, now + 0.06);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } else if (kind === 'craft') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(380, now);
      oscillator.frequency.setValueAtTime(520, now + 0.07);
      oscillator.frequency.setValueAtTime(680, now + 0.14);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      oscillator.start(now);
      oscillator.stop(now + 0.26);
    } else {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(140, now);
      oscillator.frequency.exponentialRampToValueAtTime(55, now + 0.18);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      oscillator.start(now);
      oscillator.stop(now + 0.24);
    }
  } catch {}
}

ui.bind({
  onSelect: selectSlot,
  onStart: startGame,
  onReset: newIsland,
  onRespawn: respawn,
  onCloseInventory: closeInventory,
  onCraft: craft
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  if (event.code === 'KeyE' && !event.repeat) {
    if (state.inventoryOpen) closeInventory();
    else openInventory();
    return;
  }
  if (event.code === 'Escape' && state.inventoryOpen) {
    closeInventory();
    return;
  }
  if (/^Digit[1-9]$/.test(event.code)) {
    selectSlot(Number(event.code.slice(5)) - 1);
    return;
  }
  keys.add(event.code);
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.code);
});

window.addEventListener('blur', () => keys.clear());

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== canvas || state.inventoryOpen || !state.started) return;
  if (performance.now() < state.lookGuard) return;
  player.yaw -= event.movementX * 0.0024;
  player.pitch -= event.movementY * 0.0024;
  player.pitch = Math.max(-Math.PI * 0.49, Math.min(Math.PI * 0.49, player.pitch));
});

canvas.addEventListener('mousedown', (event) => {
  if (!state.started || state.dead || state.inventoryOpen) return;
  if (document.pointerLockElement !== canvas) {
    try {
      canvas.requestPointerLock();
    } catch {}
    return;
  }
  if (event.button === 0) breakBlock();
  if (event.button === 2) placeBlock();
});

document.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('pointerlockchange', () => {
  if (!state.started) return;
  const locked = document.pointerLockElement === canvas;
  if (locked) {
    ui.setPaused(false);
  } else if (!state.inventoryOpen && !state.dead) {
    ui.setPaused(true);
  }
});

ui.setLoading(true);
const initialSave = readSave();
rebuildWorld(initialSave ? initialSave.seed : 1337, initialSave ? initialSave.edits : {});
ui.setSeed(initialSave ? initialSave.seed : 1337);
ui.setSaveHint(Boolean(initialSave));
resetToStarter();
ui.renderHotbar(state.inventory, state.selected);
app.classList.remove('playing');

let previous = performance.now();
let firstFrame = true;

function frame(now) {
  const dt = Math.min(0.05, Math.max(0.001, (now - previous) / 1000));
  previous = now;
  updateEnvironment(dt);
  if (state.started && !state.dead) {
    updatePlayer(dt);
    applyCamera();
  } else if (!state.started) {
    updateOrbit(dt);
  }
  updateTarget();
  updateHud(dt);
  if (state.started && !state.dead && !state.inventoryOpen) {
    state.saveClock += dt;
    if (state.saveClock > 5) {
      state.saveClock = 0;
      writeSave();
    }
  }
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    ui.setLoading(false);
    state.ready = true;
    window.__VOXEL_READY__ = true;
    document.body.dataset.ready = 'true';
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

window.addEventListener('beforeunload', writeSave);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) writeSave();
});
