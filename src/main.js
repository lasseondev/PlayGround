import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createWorld } from './world.js';
import { Effects } from './effects.js';
import { AudioEngine } from './audio.js';
import { Player } from './player.js';
import { EnemyManager } from './enemies.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { clamp, damp } from './util.js';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05080c);
scene.fog = new THREE.FogExp2(0x070b10, 0.0165);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 280);
camera.position.set(0, 9, 17);

const composer = new EffectComposer(renderer);
composer.setPixelRatio(renderer.getPixelRatio());
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.55, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ------------------------------------------------------------------ light */

const hemi = new THREE.HemisphereLight(0x86aec8, 0x21170f, 1.05);
scene.add(hemi);
const ambient = new THREE.AmbientLight(0x3c4d5d, 0.78);
scene.add(ambient);
const moonLight = new THREE.DirectionalLight(0xbcd5ff, 1.42);
moonLight.position.set(-28, 42, -34);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(2048, 2048);
moonLight.shadow.camera.left = -58;
moonLight.shadow.camera.right = 58;
moonLight.shadow.camera.top = 58;
moonLight.shadow.camera.bottom = -58;
moonLight.shadow.camera.near = 1;
moonLight.shadow.camera.far = 150;
moonLight.shadow.bias = -0.0006;
moonLight.shadow.normalBias = 0.035;
scene.add(moonLight);
scene.add(moonLight.target);

const fountainLight = new THREE.PointLight(0x63e8d5, 10, 20, 1.8);
fountainLight.position.set(0, 4.2, 0);
scene.add(fountainLight);

/* ------------------------------------------------------------------- game */

const audio = new AudioEngine();
const effects = new Effects(scene);
const world = createWorld(scene, effects, audio);
const player = new Player(scene, world, effects, audio);
player.root.visible = false;
const heroLight = new THREE.PointLight(0xffd3a2, 7.5, 13, 2);
heroLight.position.set(0, 2.7, 0.4);
player.root.add(heroLight);

const game = {
  world,
  player,
  audio,
  effects,
  shake: (amount) => { shake = Math.max(shake, amount); },
  stone: world.stone,
  nearestEnemy: (pos, maxDist) => enemies.nearestEnemy(pos, maxDist),
  playerStrike: (damage, range, arc) => {
    const hits = enemies.hitArc(player.pos, player.yaw, range, arc, damage, player.pos);
    if (hits) shake = Math.max(shake, 0.05);
    return hits;
  },
  damagePlayer: (amount, source) => {
    if (state !== 'playing' || player.dead) return false;
    const hurt = player.damage(amount, source, game);
    if (hurt) updateHudHealth();
    return hurt;
  },
  onPlayerHurt: () => {
    ui.damageFlash();
    ui.setHearts(player.health, player.maxHealth);
    shake = Math.max(shake, 0.38);
  },
  onPlayerDeath: () => {
    if (state !== 'playing') return;
    state = 'dying';
    deathTimer = 1.9;
    input.setEnabled(false);
    input.releaseLock();
    ui.hidePrompt();
    ui.setTouch(false);
    ui.setPlaying(false);
    ui.setLockHint(false);
    ui.toast('The dark takes its due.', 'danger', 2600);
  },
  spawnOrb: (x, z, y, target, color) => enemies.spawnOrb(x, z, y, target, color),
  onEnemyKilled: () => { kills++; },
  showBossBar: () => ui.showBossBar(6),
  updateBossBar: (hp, max) => ui.updateBossBar(hp, max),
  hideBossBar: () => ui.hideBossBar(),
  bossStarted: () => {
    ui.setQuest('The Warden is awake. Bait its strike, then cut the exposed core.');
    ui.toast('The Hollow Warden rises.', 'danger', 4000);
  },
  onBossPhase: (n) => {
    ui.toast(n === 2 ? "The Warden's stone hardens. It moves faster." : 'The stone is breaking. Finish it.', 'danger', 3400);
  },
  onBossDefeated: () => {
    bossDefeated = true;
    ui.hideBossBar();
    ui.toast('The Hollow Warden falls. The seal is broken.', 'gold', 4400);
    refreshQuest();
  },
  onBossVanquished: () => {
    world.barrier.setActive(false);
    world.sunstone.reveal();
    ui.setQuest('Claim the Sunstone.');
    ui.toast('The Sunstone rises from the Warden’s ruin.', 'gold', 4600);
  },
};

const enemies = new EnemyManager(scene, world, effects, audio, game);
const ui = new UI(world);
const input = new Input(canvas);

const SIGILS = ['stone', 'flame', 'courage'];
const SIGIL_COLORS = { stone: 0x57e4d2, flame: 0xff9b52, courage: 0xa9d8ff };
const ROOM_SPAWNS = {
  entrance: new THREE.Vector3(0, 0, 35.5),
  hub: new THREE.Vector3(0, 0, 9.5),
  stone: new THREE.Vector3(26, 0, 0),
  flame: new THREE.Vector3(0, 0, -25.5),
  courage: new THREE.Vector3(-27.5, 0, 0),
  boss: new THREE.Vector3(0, 0, -50.5),
};

let state = 'title';
let paused = false;
let pauseCooldown = 0;
let started = false;
let deathTimer = 0;
let playTime = 0;
let kills = 0;
let shake = 0;
let torchFuel = 0;
let torchMax = 26;
let roomId = null;
let lastRoomId = null;
let hallId = null;
let lastPrompt = '';
let interaction = null;
let sigils = [];
let courageStarted = false;
let courageCleared = false;
let courageWave = 0;
let courageTimer = -1;
let bossTriggered = false;
let bossDefeated = false;
let sunstoneClaimed = false;
let victoryShown = false;
let checkpoint = ROOM_SPAWNS.entrance.clone();
const collected = { stone: false, flame: false, courage: false };

const cam = {
  yaw: 0,
  pitch: 0.22,
  dist: 7.4,
  pos: new THREE.Vector3(0, 9, 17),
  look: new THREE.Vector3(0, 2.4, 0),
  titleT: 0,
  intro: 0,
};
const _camTarget = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _camDesired = new THREE.Vector3();
const _lookDesired = new THREE.Vector3();
const _forward = new THREE.Vector3();

/* ----------------------------------------------------------------- wiring */

input.onLockLost = () => {
  if (state === 'playing' && !paused) pauseGame();
};

world.emit = (event) => {
  if (!event) return;
  if (event.type === 'stone-solved') {
    ui.toast('The rune gate grinds upward. The Sigil of Stone is revealed.', 'teal', 4200);
    refreshQuest();
  } else if (event.type === 'flame-solved') {
    ui.toast('The three flames answer as one. The Sigil of Flame is revealed.', 'gold', 4200);
    refreshQuest();
  } else if (event.type === 'flame-wrong') {
    ui.toast('The flames gutter out. The mural reads: sun, then moon, then star.', 'danger', 4400);
  } else if (event.type === 'boss-gate-open') {
    ui.toast('Three sigils blaze in the Warden’s gate. The way north is open.', 'gold', 4600);
    refreshQuest();
  } else if (event.type === 'sunstone-revealed') {
    refreshQuest();
  }
};

document.getElementById('start-btn').addEventListener('click', () => startGame());
document.getElementById('resume-btn').addEventListener('click', () => resumeGame());
document.getElementById('retry-btn').addEventListener('click', () => retryGame());
document.getElementById('again-btn').addEventListener('click', () => window.location.reload());
document.getElementById('restart-btn').addEventListener('click', () => window.location.reload());
document.getElementById('mute-btn').addEventListener('click', () => toggleMute());

window.addEventListener('resize', onResize);
window.addEventListener('blur', () => {
  if (state === 'playing' && !input.isTouch) pauseGame();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state === 'playing') pauseGame();
});

/* ------------------------------------------------------------------ flow */

function startGame() {
  if (state !== 'title' || started) return;
  audio.init();
  started = true;
  state = 'playing';
  playTime = 0;
  player.root.visible = true;
  player.reset(ROOM_SPAWNS.entrance.clone());
  player.root.visible = true;
  player.setTorch(false);
  torchFuel = 0;
  ui.setTorch(0, false);
  ui.hideScreens();
  ui.setHud(true);
  ui.setTouch(input.isTouch);
  ui.setPlaying(true);
  ui.setHearts(player.health, player.maxHealth, true);
  ui.setLockHint(!input.isTouch);
  input.setEnabled(true);
  input.pauseQueued = false;
  cam.yaw = 0;
  cam.pitch = 0.24;
  cam.dist = 6.8;
  cam.intro = 1;
  snapCamera();
  refreshQuest();
  ui.toast('Find the three sigils. The trials lie east, north, and west.', '', 4400);
  if (!input.isTouch) input.requestLock();
}

function pauseGame() {
  if (state !== 'playing') return;
  paused = true;
  state = 'paused';
  pauseCooldown = 0.35;
  input.setEnabled(false);
  input.pauseQueued = false;
  input.releaseLock();
  ui.showPause();
  ui.setPlaying(false);
  ui.setTouch(false);
  ui.setLockHint(false);
  ui.hidePrompt();
}

function resumeGame() {
  if (state !== 'paused') return;
  paused = false;
  state = 'playing';
  ui.hidePause();
  ui.setPlaying(true);
  ui.setTouch(input.isTouch);
  input.setEnabled(true);
  input.pauseQueued = false;
  pauseCooldown = 0.2;
  if (!input.isTouch) input.requestLock();
}

function retryGame() {
  if (state !== 'dead') return;
  ui.hideScreens();
  ui.setHud(true);
  ui.setTouch(input.isTouch);
  ui.setPlaying(true);
  enemies.clearArena();
  enemies.resetBoss();
  world.barrier.setActive(false);
  ui.hideBossBar();
  bossTriggered = false;
  if (!courageCleared) {
    courageStarted = false;
    courageWave = 0;
    courageTimer = -1;
    world.combatGate.setOpen(true, true);
    world.combatPedestal.setActive(false);
  }
  const spawn = checkpoint ? checkpoint.clone() : ROOM_SPAWNS.entrance.clone();
  player.reset(spawn);
  player.setTorch(false);
  player.root.visible = true;
  torchFuel = 0;
  ui.setTorch(0, false);
  ui.setHearts(player.health, player.maxHealth, true);
  state = 'playing';
  paused = false;
  playTime = 0;
  cam.yaw = 0;
  cam.pitch = 0.22;
  cam.dist = 7.2;
  snapCamera();
  input.setEnabled(true);
  input.pauseQueued = false;
  refreshQuest();
  ui.toast('The sanctum remembers what you have broken. Rise again.', '', 4000);
  if (!input.isTouch) input.requestLock();
}

function toggleMute() {
  audio.init();
  audio.setMuted(!audio.muted);
  ui.setMuted(audio.muted);
}

function stats() {
  return {
    time: formatTime(playTime),
    sigils: `${sigils.length} / 3`,
    kills: String(kills),
  };
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ------------------------------------------------------------- interaction */

function near(x, z, radius) {
  const dx = player.pos.x - x;
  const dz = player.pos.z - z;
  return dx * dx + dz * dz <= radius * radius;
}

function findInteraction() {
  if (player.dead) return null;
  if (world.sunstone.revealed && !sunstoneClaimed && near(0, -72, 3.4)) {
    return { text: 'Take the Sunstone', type: 'sunstone', key: 'E' };
  }

  for (const id of SIGILS) {
    if (collected[id]) continue;
    const ped = id === 'stone' ? world.stonePedestal : id === 'flame' ? world.flamePedestal : world.combatPedestal;
    if (ped && ped.active && near(ped.x, ped.z, 2.9)) {
      return { text: `Claim the ${ui.getSigilMeta(id).label}`, type: 'sigil', id, key: 'E' };
    }
  }

  if (!player.torchLit && near(world.eternal.worldPos.x, world.eternal.worldPos.z, 2.9)) {
    return { text: 'Kindle the eternal flame', type: 'kindle', key: 'E' };
  }
  if (player.torchLit && torchFuel < torchMax - 3 && near(world.eternal.worldPos.x, world.eternal.worldPos.z, 2.9)) {
    return { text: 'Refresh the eternal flame', type: 'refresh', key: 'E' };
  }

  if (player.torchLit && !world.flame.solved) {
    for (const id of ['sun', 'moon', 'star']) {
      const brazier = world.flameBraziers[id];
      if (!brazier || brazier.lit) continue;
      if (near(brazier.worldPos.x, brazier.worldPos.z, 2.8)) {
        return { text: `Light the brazier of the ${id}`, type: 'brazier', id, key: 'E' };
      }
    }
  }

  if (!world.stone.solved && near(27.2, 7.4, 2.5)) {
    return { text: 'Reset the rune block', type: 'lever', key: 'E' };
  }
  return null;
}

function doInteract(item) {
  if (!item) return;
  if (item.type === 'sigil') {
    collectSigil(item.id);
  } else if (item.type === 'kindle' || item.type === 'refresh') {
    torchFuel = torchMax;
    player.setTorch(true, 0xffc46a);
    ui.setTorch(1, true);
    audio.flame();
    effects.burst({ x: player.pos.x, y: 1.3, z: player.pos.z }, '#ffc46a', 14, { speed: 1.5, up: 2.2 });
    ui.toast(item.type === 'kindle' ? 'The eternal flame leaps to your torch. Its light will not last.' : 'The flame burns bright again.', 'gold', 3200);
  } else if (item.type === 'brazier') {
    const result = world.flame.lit(item.id);
    if (result === 'correct') {
      const label = world.flame.progress.length;
      ui.toast(`The ${item.id} brazier takes the flame. ${label < 3 ? 'The mural guides the next.' : ''}`.trim(), 'teal', 3000);
    }
  } else if (item.type === 'lever') {
    world.stone.reset();
    ui.toast('The rune block grinds back to its starting mark.', 'teal', 3000);
  } else if (item.type === 'sunstone') {
    claimSunstone();
  }
  interaction = null;
  lastPrompt = '';
  ui.hidePrompt();
  audio.ui();
}

function collectSigil(id) {
  if (collected[id]) return;
  collected[id] = true;
  sigils.push(id);
  const index = { stone: 0, flame: 1, courage: 2 }[id];
  world.setHubSigil(index, SIGIL_COLORS[id]);
  ui.setSigil(id);
  player.addMaxHealth(1);
  player.health = player.maxHealth;
  ui.setHearts(player.health, player.maxHealth);
  ui.healFlash();
  audio.sigil();
  const ped = id === 'stone' ? world.stonePedestal : id === 'flame' ? world.flamePedestal : world.combatPedestal;
  if (ped) {
    ped.setActive(false);
    effects.burst({ x: ped.x, y: 2.5, z: ped.z }, ui.getSigilMeta(id).css, 44, { speed: 3.2, up: 3.2, lifeScale: 1.2 });
    effects.shockwave({ x: ped.x, y: 0, z: ped.z }, { color: ui.getSigilMeta(id).css, maxRadius: 6, duration: 1 });
  }
  const meta = ui.getSigilMeta(id);
  ui.toast(`${meta.label} claimed. ${meta.toast}`, 'gold', 4600);
  refreshQuest();
  if (sigils.length === 3) {
    world.bossGate.open();
    setTimeout(() => ui.toast('The floor trembles. The way north opens.', 'gold', 4200), 1600);
  }
}

function claimSunstone() {
  if (sunstoneClaimed) return;
  sunstoneClaimed = true;
  state = 'victory';
  input.setEnabled(false);
  input.releaseLock();
  ui.hidePrompt();
  ui.setTouch(false);
  ui.setPlaying(false);
  ui.setQuest('The Sunstone is claimed.');
  audio.victory();
  effects.burst({ x: 0, y: 2.4, z: -72 }, '#ffe3a8', 90, { speed: 5, up: 5, lifeScale: 2 });
  effects.shockwave({ x: 0, y: 0, z: -72 }, { color: '#ffe3a8', maxRadius: 18, duration: 2.2 });
  effects.shockwave({ x: 0, y: 0, z: -72 }, { color: '#ff9b52', maxRadius: 11, duration: 1.6 });
  cameraShake(0.3);
  if (!victoryShown) {
    setTimeout(() => {
      if (state !== 'victory') return;
      victoryShown = true;
      ui.setHud(false);
      ui.showVictory(stats());
      document.getElementById('game').classList.remove('is-playing');
    }, 1500);
  }
}

function refreshQuest() {
  let text;
  if (sunstoneClaimed) {
    text = 'The Sunstone is claimed.';
  } else if (bossDefeated) {
    text = 'The Warden is broken. Claim the Sunstone.';
  } else if (sigils.length === 3) {
    text = bossTriggered ? 'The Warden is awake. Strike the exposed core.' : 'The Warden’s gate is open. Descend into the sanctum.';
  } else {
    const pending = [];
    if (!collected.stone) pending.push(world.stone.solved ? 'claim the Sigil of Stone' : 'the stone trial (east)');
    if (!collected.flame) pending.push(world.flame.solved ? 'claim the Sigil of Flame' : 'the flame trial (north)');
    if (!collected.courage) pending.push(courageCleared ? 'claim the Sigil of Courage' : 'the courage trial (west)');
    const anyProgress = world.stone.solved || world.flame.solved || courageCleared || courageStarted;
    text = sigils.length === 0 && !anyProgress
      ? 'Three sigils wait — stone east, flame north, courage west.'
      : `Remaining: ${pending.join(' · ')}.`;
  }
  if (courageStarted && !courageCleared && !bossTriggered && !bossDefeated) {
    text = 'Survive the trial of courage. The gate will open when the shades are gone.';
  }
  ui.setQuest(text);
}

/* --------------------------------------------------------------- gameplay */

function updateHudHealth() {
  ui.setHearts(player.health, player.maxHealth);
}

function updatePlaying(dt) {
  const look = input.consumeLook();
  cam.yaw += look.yaw;
  cam.pitch = clamp(cam.pitch + look.pitch, -0.16, 0.9);
  const zoom = input.consumeZoom();
  if (zoom) cam.dist = clamp(cam.dist + zoom * 0.62, 4.2, 12);

  if (player.torchLit) {
    torchFuel = Math.max(0, torchFuel - dt);
    if (torchFuel <= 0) {
      player.setTorch(false);
      ui.setTorch(0, false);
      ui.toast('The eternal flame dies. Return to the northern brazier.', 'danger', 3800);
    }
  }
  ui.setTorch(torchFuel / torchMax, player.torchLit);

  input.update();
  player.update(dt, input, cam.yaw, game);

  if (input.consumeInteract()) {
    const item = findInteraction();
    if (item) doInteract(item);
  }

  world.update(dt, player.pos);
  enemies.update(dt, player);

  updateRoomState();
  updateCourage(dt);
  updateBossFight();
  updateInteractionPrompt();
  updateCamera(dt);

  shake = Math.max(0, shake - dt * 2.6);
  effects.update(dt, playTime);
  playTime += dt;
  ui.updateMinimap(dt, player, roomId, hallId);

  ui.setLockHint(!input.isTouch && !input.locked && !input.isTouch);
}

function updateRoomState() {
  const room = world.roomAt(player.pos.x, player.pos.z);
  if (room) {
    roomId = room.id;
    hallId = null;
    world.markVisited(room.id);
    if (room.id !== lastRoomId) {
      lastRoomId = room.id;
      ui.roomBanner(room);
      if (ROOM_SPAWNS[room.id]) checkpoint.copy(ROOM_SPAWNS[room.id]);
    }
  } else {
    roomId = null;
    const hall = world.hallAt(player.pos.x, player.pos.z);
    if (hall) {
      hallId = hall.id;
      world.markVisited(hall.id);
    }
  }
}

function updateCourage(dt) {
  if (!courageStarted && !courageCleared && player.pos.x < -25.2 && Math.abs(player.pos.z) < 8.4) {
    courageStarted = true;
    world.combatGate.setOpen(false);
    audio.gate();
    ui.toast('The gate slams shut. The Trial of Courage begins.', 'danger', 3800);
    spawnCourageWave(0);
    refreshQuest();
    return;
  }
  if (!courageStarted || courageCleared) return;

  if (courageTimer >= 0) {
    courageTimer -= dt;
    if (courageTimer <= 0) {
      courageTimer = -1;
      if (courageWave < 1) {
        courageWave++;
        spawnCourageWave(courageWave);
        ui.toast('The shadows deepen. A Watcher opens its eye.', 'danger', 3200);
      } else {
        completeCourage();
      }
    }
  } else if (enemies.aliveCount() === 0) {
    courageTimer = 1.05;
  }
}

function spawnCourageWave(wave) {
  if (wave === 0) {
    enemies.spawnShade(-33, -3.5);
    enemies.spawnShade(-34, 4);
    effects.dustRing({ x: -33.5, y: 0, z: 0 }, 0xcf9dff);
  } else {
    enemies.spawnShade(-39, -5);
    enemies.spawnShade(-39, 5);
    enemies.spawnWatcher(-43.2, 0);
    effects.dustRing({ x: -40, y: 0, z: 0 }, 0xffa45e);
  }
}

function completeCourage() {
  courageCleared = true;
  courageTimer = -1;
  world.combatGate.setOpen(true);
  world.combatPedestal.setActive(true);
  world.combatPedestal.pop();
  audio.solve();
  effects.burst({ x: -35, y: 2.6, z: 0 }, '#a9d8ff', 46, { speed: 3.2, up: 3.4, lifeScale: 1.2 });
  effects.shockwave({ x: -35, y: 0, z: 0 }, { color: '#a9d8ff', maxRadius: 8, duration: 1.2 });
  ui.toast('The gate rises. The Sigil of Courage is revealed.', 'gold', 4400);
  refreshQuest();
}

function updateBossFight() {
  if (bossDefeated) return;
  if (!bossTriggered && world.bossGate.opened && player.pos.z < -59.0) {
    bossTriggered = true;
    world.barrier.setActive(true);
    enemies.boss.start();
    refreshQuest();
    return;
  }
  if (bossTriggered && !sunstoneClaimed) {
    if (world.sunstone.revealed) refreshQuest();
  }
}

function updateInteractionPrompt() {
  interaction = findInteraction();
  if (interaction) {
    const key = `${interaction.type}:${interaction.id ?? ''}:${interaction.text}`;
    if (key !== lastPrompt) {
      lastPrompt = key;
      ui.showPrompt(interaction.text, 'E');
    }
  } else if (lastPrompt) {
    lastPrompt = '';
    ui.hidePrompt();
  }
}

/* ------------------------------------------------------------------ camera */

function updateCamera(dt) {
  _camTarget.set(player.pos.x, player.pos.y + 1.7, player.pos.z);
  _forward.set(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw));
  _lookDesired.copy(_camTarget).addScaledVector(_forward, 1.15);
  _lookDesired.y += 0.1;

  const cp = Math.cos(cam.pitch);
  _camDir.set(Math.sin(cam.yaw) * cp, Math.sin(cam.pitch), Math.cos(cam.yaw) * cp).normalize();
  let dist = cam.dist;
  const hit = world.raycastCamera(_camTarget, _camDir, dist + 0.55);
  if (hit < dist + 0.55) dist = Math.max(2.0, hit - 0.4);
  _camDesired.copy(_camTarget).addScaledVector(_camDir, dist);
  _camDesired.y = Math.max(0.55, _camDesired.y + 0.18);

  if (cam.intro > 0) {
    cam.intro = Math.max(0, cam.intro - dt * 1.8);
    camera.position.lerp(_camDesired, 1 - Math.exp(-14 * dt));
  } else {
    camera.position.lerp(_camDesired, 1 - Math.exp(-9 * dt));
  }
  cam.look.lerp(_lookDesired, 1 - Math.exp(-12 * dt));
  camera.lookAt(cam.look);

  if (shake > 0.001) {
    const s = shake * 0.38;
    camera.position.x += (Math.random() - 0.5) * s;
    camera.position.y += (Math.random() - 0.5) * s;
    camera.position.z += (Math.random() - 0.5) * s;
  }
  cam.pos.copy(camera.position);
}

function snapCamera() {
  cam.intro = 0;
  _camTarget.set(player.pos.x, player.pos.y + 1.7, player.pos.z);
  _forward.set(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw));
  const cp = Math.cos(cam.pitch);
  _camDir.set(Math.sin(cam.yaw) * cp, Math.sin(cam.pitch), Math.cos(cam.yaw) * cp).normalize();
  const hit = world.raycastCamera(_camTarget, _camDir, cam.dist + 0.55);
  const dist = hit < cam.dist + 0.55 ? Math.max(2.0, hit - 0.4) : cam.dist;
  camera.position.copy(_camTarget).addScaledVector(_camDir, dist);
  camera.position.y = Math.max(0.55, camera.position.y + 0.18);
  cam.look.copy(_camTarget).addScaledVector(_forward, 1.15);
  cam.look.y += 0.1;
  camera.lookAt(cam.look);
}

function updateTitle(dt) {
  cam.titleT += dt * 0.1;
  const r = 13.5;
  const x = Math.sin(cam.titleT) * r;
  const z = Math.cos(cam.titleT) * r + 1.5;
  camera.position.set(x, 7.4 + Math.sin(cam.titleT * 1.7) * 0.7, z);
  camera.lookAt(0, 2.7, 0);
  cam.pos.copy(camera.position);
  world.update(dt, player.pos);
  effects.update(dt, playTime);
  playTime += dt * 0.3;
  shake = Math.max(0, shake - dt * 2);
}

function updateDying(dt) {
  deathTimer -= dt;
  shake = Math.max(0, shake - dt * 2.4);
  player.update(dt, input, cam.yaw, game);
  world.update(dt, player.pos);
  enemies.update(dt, player);
  effects.update(dt, playTime);
  ui.setHearts(player.health, player.maxHealth);
  ui.setTorch(torchFuel / torchMax, player.torchLit);
  updateCamera(dt);
  if (deathTimer <= 0) {
    state = 'dead';
    ui.setHud(true);
    ui.showDeath(stats());
    ui.setTouch(false);
    ui.setPlaying(false);
  }
}

function updateVictory(dt) {
  shake = Math.max(0, shake - dt * 2);
  world.update(dt, player.pos);
  enemies.update(dt, player);
  effects.update(dt, playTime);
  player.update(dt, input, cam.yaw, game);
  player.root.rotation.y += dt * 0.25;
  cam.pitch = damp(cam.pitch, 0.34, 1.5, dt);
  cam.dist = damp(cam.dist, 9.2, 1.4, dt);
  updateCamera(dt);
  ui.updateMinimap(dt, player, roomId, hallId);
}

/* ------------------------------------------------------------------- loop */

let last = performance.now();
let elapsed = 0;

function frame(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  elapsed += dt;

  if (input.consumeMute()) toggleMute();

  if (state === 'playing') {
    if (input.consumePause()) {
      pauseGame();
    } else {
      updatePlaying(dt);
    }
  } else if (state === 'paused') {
    pauseCooldown = Math.max(0, pauseCooldown - dt);
    if (input.consumePause() && pauseCooldown <= 0) resumeGame();
  } else if (state === 'title') {
    updateTitle(dt);
  } else if (state === 'dying') {
    updateDying(dt);
  } else if (state === 'dead') {
    effects.update(dt, elapsed);
  } else if (state === 'victory') {
    updateVictory(dt);
  }

  if (state !== 'paused') {
    const flicker = 0.92 + Math.sin(elapsed * 2.3) * 0.08;
    fountainLight.intensity = 9 * flicker;
  }
  composer.render();
}

renderer.setAnimationLoop(frame);

/* ------------------------------------------------------------------- debug */

window.__sunken = {
  get state() { return state; },
  get sigils() { return [...sigils]; },
  get torchFuel() { return torchFuel; },
  game,
  world,
  player,
  enemies,
  ui,
  camera,
  scene,
  start: () => startGame(),
  warp: (x, z) => {
    player.pos.set(x, 0, z);
    player.root.position.copy(player.pos);
    snapCamera();
  },
  look: (yaw, pitch = 0.22) => {
    cam.yaw = yaw;
    cam.pitch = pitch;
    snapCamera();
  },
  sigil: (id) => collectSigil(id),
  reveal: () => world.sunstone.reveal(),
  solveStone: () => {
    world.stone.block.x = world.stone.plate.x;
    world.stone.block.z = world.stone.plate.z;
    world.stone.block.group.position.set(world.stone.plate.x, world.stone.block.half, world.stone.plate.z);
    const b = world.stone.block;
    b.collider.minX = b.x - b.half; b.collider.maxX = b.x + b.half;
    b.collider.minZ = b.z - b.half; b.collider.maxZ = b.z + b.half;
  },
  solveFlame: () => { ['sun', 'moon', 'star'].forEach((id) => world.flame.lit(id)); },
  clearCourage: () => { enemies.clearArena(); if (courageStarted) completeCourage(); },
  openGate: () => world.bossGate.open(),
  startBoss: () => { bossTriggered = true; world.barrier.setActive(true); enemies.boss.start(); },
  killBoss: () => { enemies.boss.hp = 0; enemies.boss.exposed = true; enemies.boss.die(); },
  win: () => claimSunstone(),
  pause: () => pauseGame(),
  resume: () => resumeGame(),
  retry: () => { state = 'dead'; retryGame(); },
  stats,
};

ui.hideLoading();
ui.setHud(false);
ui.showTitle();
ui.setHearts(5, 5, true);

/* ------------------------------------------------------------------ resize */

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(w, h);
  bloom.setSize(w, h);
}

function cameraShake(amount) {
  shake = Math.max(shake, amount);
}
