import * as THREE from 'three';
import { createHero } from './character.js';

const P = {
  radius: 0.36,
  height: 1.62,
  walkSpeed: 6.6,
  runSpeed: 9.8,
  groundAccel: 58,
  airAccel: 36,
  groundFriction: 50,
  airDrag: 5,
  gravity: 34,
  jumpSpeed: 12.8,
  maxFall: 34,
  coyoteTime: 0.12,
  jumpBuffer: 0.16,
  stepHeight: 0.52,
};

const UP = new THREE.Vector3(0, 1, 0);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const approach = (value, target, delta) => {
  if (value < target) return Math.min(value + delta, target);
  if (value > target) return Math.max(value - delta, target);
  return value;
};

export class Game {
  constructor({ scene, camera, renderer, world, audio, input, ui }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.world = world;
    this.audio = audio;
    this.input = input;
    this.ui = ui;

    this.hero = createHero();
    scene.add(this.hero.root);

    this.player = {
      pos: new THREE.Vector3(world.spawn.x, world.spawn.y, world.spawn.z),
      vel: new THREE.Vector3(),
      facing: Math.PI,
      grounded: false,
      coyote: 0,
      jumpBuffer: 0,
      jumpCut: false,
      stompedThisAir: false,
      standingOn: null,
      wasGrounded: false,
    };

    this.status = 'title';
    this.timer = 0;
    this.animTime = 0;
    this.runPhase = 0;
    this.squash = 0;
    this.landSquash = 0;
    this.jumpBlend = 0;
    this.dying = 0;
    this.accumulator = 0;
    this.introTimer = 0;
    this.orbitHold = 0;
    this.shake = 0;
    this.flash = 0;
    this.time = 0;
    this.lastGrounded = false;
    this.stepDust = 0;
    this.standingFrameDelta = { x: 0, y: 0, z: 0 };

    this.cameraState = {
      yaw: 0,
      pitch: 0.4,
      distance: 7.8,
      target: new THREE.Vector3(world.spawn.x, world.spawn.y + 1.1, world.spawn.z),
      look: new THREE.Vector3(world.spawn.x, world.spawn.y + 1.1, world.spawn.z),
      position: new THREE.Vector3(12, 8, 15),
      initialized: false,
    };

    this.hearts = 3;
    this.maxHearts = 3;
    this.coins = 0;
    this.stars = 0;
    this.checkpointSpawn = { ...world.spawn };
    this.checkpointIndex = -1;
    this.bossActive = false;
    this.bossDefeated = false;
    this.bossToastShown = false;
    this.particles = [];
    this.particleGeos = {
      octa: new THREE.OctahedronGeometry(0.1, 0),
      box: new THREE.BoxGeometry(0.15, 0.15, 0.15),
      sphere: new THREE.SphereGeometry(0.09, 6, 5),
    };

    this.questionOriginals = this.world.questionBlocks.map((block) => ({
      block,
      materials: block.mesh.material.map((material) => ({
        material,
        color: material.color.clone(),
        emissive: material.emissive ? material.emissive.clone() : null,
        emissiveIntensity: material.emissiveIntensity,
      })),
    }));

    this.prepareCinematicCamera();
    this.ui.setHearts(this.hearts, this.maxHearts);
    this.ui.setCoins(this.coins, this.world.coinTotal, false);
    this.ui.setStars(this.stars, this.world.starTotal);
    this.ui.setTime(0);
    this.resetState({ keepCamera: true });
  }

  // ---------------------------- Lifecycle ---------------------------------

  prepareCinematicCamera() {
    const cs = this.cameraState;
    cs.position.set(15, 9, 17);
    cs.target.set(0, 2, -10);
    cs.look.copy(cs.target);
    cs.initialized = true;
    this.camera.position.copy(cs.position);
    this.camera.lookAt(cs.look);
  }

  start() {
    this.resetState({ keepCamera: true });
    this.status = 'playing';
    this.introTimer = 1.25;
    this.input.resetTransient();
    this.ui.showGameplay();
    this.ui.hideScreens();
    this.ui.setTime(0);
    this.audio.init();
    this.audio.click();
  }

  restart() {
    this.start();
    this.ui.toast('COURSE RESTARTED');
  }

  pause() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.input.resetTransient();
    this.ui.showPause();
  }

  resume() {
    if (this.status !== 'paused') return;
    this.status = 'playing';
    this.input.resetTransient();
    this.ui.hideScreens();
    this.ui.hidePause();
  }

  retryCheckpoint() {
    this.hearts = this.maxHearts;
    this.dying = 0;
    this.status = 'playing';
    this.player.pos.set(this.checkpointSpawn.x, this.checkpointSpawn.y + 0.05, this.checkpointSpawn.z);
    this.player.vel.set(0, 0, 0);
    this.player.invulnerable = 1.8;
    this.player.standingOn = null;
    this.player.stompedThisAir = false;
    this.hero.root.visible = true;
    this.hero.root.scale.set(1, 1, 1);
    this.hero.root.rotation.set(0, Math.PI, 0);
    this.cameraState.yaw = 0;
    this.ui.setHearts(this.hearts, this.maxHearts);
    this.ui.hideScreens();
    this.ui.showGameplay();
    this.ui.toast('BACK IN ACTION!');
    this.audio.checkpoint();
    this.snapCamera();
  }

  resetState({ keepCamera = false } = {}) {
    const p = this.player;
    p.pos.set(this.world.spawn.x, this.world.spawn.y + 0.05, this.world.spawn.z);
    p.vel.set(0, 0, 0);
    p.facing = Math.PI;
    p.grounded = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    p.standingOn = null;
    p.invulnerable = 0;
    p.wasGrounded = false;
    p.jumpCut = false;
    p.stompedThisAir = false;

    this.hearts = this.maxHearts;
    this.coins = 0;
    this.stars = 0;
    this.timer = 0;
    this.dying = 0;
    this.accumulator = 0;
    this.shake = 0;
    this.runPhase = 0;
    this.squash = 0;
    this.landSquash = 0;
    this.jumpBlend = 0;
    this.checkpointSpawn = { ...this.world.spawn };
    this.checkpointIndex = -1;
    this.bossActive = false;
    this.bossDefeated = false;
    this.bossToastShown = false;
    this.hero.root.visible = true;
    this.hero.root.scale.set(1, 1, 1);
    this.hero.root.rotation.set(0, Math.PI, 0);
    this.clearParticles();
    this.ui.hideBoss();

    for (const coin of this.world.coins) {
      coin.collected = false;
      coin.group.visible = true;
      coin.group.position.y = coin.baseY;
    }
    for (const star of this.world.stars) {
      star.collected = false;
      star.group.visible = true;
      star.group.position.y = star.baseY;
    }
    for (const cp of this.world.checkpoints) cp.deactivate();
    this.world.goal.active = true;
    this.world.goal.cloth.material.color.set(0xffc42e);
    this.world.goal.cloth.material.emissive.set(0x6b3f00);

    for (const block of this.world.questionBlocks) {
      block.used = false;
      block.bump = 0;
      block.mesh.position.y = block.baseY;
    }
    for (const { block, materials } of this.questionOriginals) {
      // restore question-block tint
      materials.forEach(({ material, color, emissive, emissiveIntensity }) => {
        material.color.copy(color);
        if (emissive && material.emissive) material.emissive.copy(emissive);
        if (typeof emissiveIntensity === 'number') material.emissiveIntensity = emissiveIntensity;
      });
      block.mesh.position.y = block.baseY;
    }

    for (const enemy of this.world.enemies) {
      enemy.alive = true;
      enemy.defeated = false;
      enemy.squash = 0;
      enemy.hitFlash = 0;
      enemy.hitCooldown = 0;
      enemy.hp = enemy.maxHp;
      enemy.x = enemy.home.x;
      enemy.y = enemy.home.y;
      enemy.z = enemy.home.z;
      enemy.dir = Math.random() > 0.5 ? 1 : -1;
      enemy.awake = !enemy.boss;
      enemy.walkPhase = Math.random() * 10;
      enemy.root.visible = true;
      enemy.root.position.set(enemy.x, enemy.y, enemy.z);
      enemy.root.scale.setScalar(enemy.scaleValue);
      enemy.body.scale.set(1, 1, 1);
      enemy.head.rotation.set(0, 0, 0);
      if (enemy.crown) enemy.crown.visible = true;
    }
    if (this.world.boss) this.world.boss.crown.visible = true;

    this.ui.setHearts(this.hearts, this.maxHearts);
    this.ui.setCoins(this.coins, this.world.coinTotal, false);
    this.ui.setStars(this.stars, this.world.starTotal);
    this.ui.setTime(0);
    this.ui.hideBoss();
    this.cameraState.yaw = 0;
    this.cameraState.pitch = 0.4;
    if (!keepCamera) this.snapCamera();
  }

  snapCamera() {
    const target = this.cameraState.target;
    target.set(this.player.pos.x, this.player.pos.y + 1.15, this.player.pos.z);
    const dist = this.cameraState.distance;
    const yaw = this.cameraState.yaw;
    const pitch = this.cameraState.pitch;
    const cp = Math.cos(pitch);
    this.cameraState.position.set(
      target.x + Math.sin(yaw) * cp * dist,
      target.y + Math.sin(pitch) * dist + 0.5,
      target.z + Math.cos(yaw) * cp * dist,
    );
    this.cameraState.look.copy(target);
    this.camera.position.copy(this.cameraState.position);
    this.camera.lookAt(this.cameraState.look);
    this.cameraState.initialized = true;
  }

  // ------------------------------ Input -----------------------------------

  orbit(dx, dy) {
    if (this.status === 'paused' || this.status === 'won' || this.status === 'lost') return;
    this.cameraState.yaw -= dx * 0.0052;
    this.cameraState.pitch = clamp(this.cameraState.pitch + dy * 0.0042, 0.02, 0.95);
    this.orbitHold = 1.6;
  }

  zoom(dir) {
    this.cameraState.distance = clamp(this.cameraState.distance + dir * 0.75, 4.6, 13.5);
  }

  // ------------------------------- Loop -----------------------------------

  update(dt) {
    dt = Math.min(dt, 0.05);
    this.time += dt;
    this.animTime += dt;

    if (this.status === 'playing') {
      // Ride moving platforms before stepping.
      if (this.player.standingOn?.type === 'moving') {
        const plat = this.world.movingPlatforms.find((m) => m.collider === this.player.standingOn);
        if (plat) {
          this.player.pos.x += plat.delta.x;
          this.player.pos.y += plat.delta.y;
          this.player.pos.z += plat.delta.z;
        }
      }
      this.accumulator += dt;
      let steps = 0;
      while (this.accumulator >= 1 / 60 && steps < 5) {
        this.stepPhysics(1 / 60);
        this.accumulator -= 1 / 60;
        steps++;
      }
      if (steps === 5) this.accumulator = 0;
      this.timer += dt;
      this.ui.setTime(this.timer);
    }

    this.updateWorld(dt);
    this.updateEnemies(dt);
    this.updateHero(dt);
    this.updateParticles(dt);
    this.updateCamera(dt);
  }

  updateWorld(dt) {
    this.world.update(dt, this.animTime, this.player.pos, this.camera.position);

    if (this.status === 'playing' && !this.dying) {
      this.collectPickups();
      this.checkCheckpoints();
      this.checkGoal();
      if (this.player.pos.y < -16) this.fallRespawn();
    }

    if (this.dying > 0) {
      this.dying -= dt;
      if (this.dying <= 0 && this.status === 'playing') {
        this.status = 'lost';
        this.ui.showLose();
        this.audio.gameOver();
      }
    }
  }

  stepPhysics(dt) {
    const p = this.player;
    const input = this.input;
    const cs = this.cameraState;
    const isDying = this.dying > 0;
    const canControl = !isDying && this.status === 'playing';

    this.lastGrounded = p.grounded;
    p.wasGrounded = p.grounded;

    const move = canControl ? input.getMove() : { x: 0, y: 0 };
    const run = canControl && input.getRun();
    const maxSpeed = run ? P.runSpeed : P.walkSpeed;
    const forwardX = -Math.sin(cs.yaw);
    const forwardZ = -Math.cos(cs.yaw);
    const rightX = Math.cos(cs.yaw);
    const rightZ = -Math.sin(cs.yaw);
    let dirX = rightX * move.x + forwardX * move.y;
    let dirZ = rightZ * move.x + forwardZ * move.y;
    const dirLen = Math.hypot(dirX, dirZ);
    if (dirLen > 1) { dirX /= dirLen; dirZ /= dirLen; }

    // Jump buffering
    if (canControl && input.consumeJump()) p.jumpBuffer = P.jumpBuffer;
    else p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);

    if (p.jumpBuffer > 0 && (p.grounded || p.coyote > 0) && canControl) {
      p.vel.y = P.jumpSpeed;
      p.grounded = false;
      p.coyote = 0;
      p.jumpBuffer = 0;
      p.jumpCut = true;
      this.squash = 0.16;
      this.audio.jump();
      this.spawnBurst(new THREE.Vector3(p.pos.x, p.pos.y + 0.08, p.pos.z), {
        color: 0xf3f9ff, count: 6, speed: 1.8, up: 1.2, size: 0.11, life: 0.38, gravity: 5,
      });
    }

    // Horizontal acceleration
    let accel;
    if (dirLen > 0.02) accel = p.grounded ? P.groundAccel : P.airAccel;
    else accel = p.grounded ? P.groundFriction : P.airDrag;
    p.vel.x = approach(p.vel.x, dirX * maxSpeed, accel * dt);
    p.vel.z = approach(p.vel.z, dirZ * maxSpeed, accel * dt);

    // Variable jump height (only cuts a jump the player started)
    if (p.jumpCut && !isDying && !input.getJumpHeld() && p.vel.y > 2.2) {
      p.vel.y -= 46 * dt;
    }
    if (p.vel.y <= 0 || p.grounded) p.jumpCut = false;

    // Horizontal movement + collision
    p.pos.x += p.vel.x * dt;
    this.resolveHorizontal('x', dt);
    p.pos.z += p.vel.z * dt;
    this.resolveHorizontal('z', dt);

    // Vertical movement
    const prevY = p.pos.y;
    p.vel.y = Math.max(-P.maxFall, p.vel.y - P.gravity * dt);
    p.pos.y += p.vel.y * dt;
    p.grounded = false;
    p.standingOn = null;

    if (p.vel.y <= 0) {
      let landing = null;
      let landingTop = -Infinity;
      for (const solid of this.world.solids) {
        if (!this.overlapXZ(solid, p.pos.x, p.pos.z, P.radius * 0.58)) continue;
        const top = solid.max.y;
        if (top <= prevY + 0.3 && top >= p.pos.y - 0.001 && top > landingTop) {
          landing = solid;
          landingTop = top;
        }
      }
      if (landing) {
        p.pos.y = landingTop;
        p.vel.y = 0;
        p.grounded = true;
        p.standingOn = landing;
        p.jumpCut = false;
        p.stompedThisAir = false;
        if (landing.type === 'spring') {
          p.vel.y = landing.power;
          p.grounded = false;
          p.standingOn = null;
          p.coyote = 0;
          p.jumpCut = false;
          p.stompedThisAir = false;
          const spring = this.world.springs.find((s) => Math.abs(s.x - landing.object.position.x) < 0.1 && Math.abs(s.z - landing.object.position.z) < 0.1);
          if (spring) spring.anim = 1;
          this.audio.spring();
          this.spawnBurst(new THREE.Vector3(p.pos.x, p.pos.y + 0.2, p.pos.z), {
            color: 0xffd85a, count: 12, speed: 3.5, up: 2, size: 0.13, life: 0.6, gravity: 9,
          });
          this.squash = -0.22;
        }
        if (!this.lastGrounded) {
          this.landSquash = 0.14;
          this.audio.land();
          this.spawnBurst(new THREE.Vector3(p.pos.x, p.pos.y + 0.06, p.pos.z), {
            color: 0xf1f7ff, count: 5, speed: 1.6, up: 0.7, size: 0.1, life: 0.32, gravity: 4,
          });
        }
      }
    } else {
      // Ceiling / underside of question blocks
      let ceiling = null;
      let ceilingY = Infinity;
      const headPrev = prevY + P.height;
      const headNow = p.pos.y + P.height;
      for (const solid of this.world.solids) {
        if (!this.overlapXZ(solid, p.pos.x, p.pos.z, P.radius * 0.5)) continue;
        if (solid.min.y >= headPrev - 0.12 && solid.min.y <= headNow + 0.05 && solid.min.y < ceilingY) {
          ceiling = solid;
          ceilingY = solid.min.y;
        }
      }
      if (ceiling) {
        p.pos.y = ceilingY - P.height - 0.001;
        p.vel.y = 0;
        if (ceiling.type === 'question') this.hitQuestionBlock(ceiling.block);
        else this.audio.bump();
      }
    }

    // Coyote time
    if (p.grounded) p.coyote = P.coyoteTime;
    else p.coyote = Math.max(0, p.coyote - dt);

    // Facing
    if (dirLen > 0.05 && canControl) {
      const targetFacing = Math.atan2(dirX, dirZ);
      let diff = ((targetFacing - p.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      p.facing += diff * Math.min(1, dt * 14);
    }

    // Enemy contact
    if (!isDying) this.checkEnemyContacts();

    // Invulnerability timer
    p.invulnerable = Math.max(0, (p.invulnerable || 0) - dt);
  }

  overlapXZ(solid, x, z, pad = 0) {
    const r = P.radius;
    return x + r > solid.min.x - pad && x - r < solid.max.x + pad && z + r > solid.min.z - pad && z - r < solid.max.z + pad;
  }

  resolveHorizontal(axis, dt) {
    const p = this.player;
    const r = P.radius;
    const h = P.height;
    for (const solid of this.world.solids) {
      // Standing exactly on top means no side collision.
      const vertOverlap = p.pos.y < solid.max.y - 0.002 && p.pos.y + h > solid.min.y + 0.002;
      if (!vertOverlap) continue;
      if (!this.overlapXZ(solid, p.pos.x, p.pos.z)) continue;

      const stepUp = solid.max.y - p.pos.y;
      if (p.wasGrounded && stepUp > 0 && stepUp <= P.stepHeight) {
        p.pos.y = solid.max.y + 0.002;
        continue;
      }

      if (axis === 'x') {
        if (p.vel.x > 0) p.pos.x = solid.min.x - r - 0.001;
        else if (p.vel.x < 0) p.pos.x = solid.max.x + r + 0.001;
        else {
          const left = Math.abs(p.pos.x + r - solid.min.x);
          const right = Math.abs(solid.max.x - (p.pos.x - r));
          p.pos.x = left < right ? solid.min.x - r - 0.001 : solid.max.x + r + 0.001;
        }
        p.vel.x = 0;
      } else {
        if (p.vel.z > 0) p.pos.z = solid.min.z - r - 0.001;
        else if (p.vel.z < 0) p.pos.z = solid.max.z + r + 0.001;
        else {
          const near = Math.abs(p.pos.z + r - solid.min.z);
          const far = Math.abs(solid.max.z - (p.pos.z - r));
          p.pos.z = near < far ? solid.min.z - r - 0.001 : solid.max.z + r + 0.001;
        }
        p.vel.z = 0;
      }
    }
  }

  // --------------------------- Interactions -------------------------------

  collectPickups() {
    const p = this.player;
    const cy = p.pos.y + 0.85;

    for (const coin of this.world.coins) {
      if (coin.collected) continue;
      const dx = coin.x - p.pos.x;
      const dz = coin.z - p.pos.z;
      const dy = coin.group.position.y - cy;
      if (dx * dx + dz * dz < 0.8 * 0.8 && Math.abs(dy) < 1.15) {
        coin.collected = true;
        coin.group.visible = false;
        this.addCoins(1, false);
        this.audio.coin();
        this.spawnBurst(new THREE.Vector3(coin.x, coin.group.position.y, coin.z), {
          color: 0xffd84a, count: 8, speed: 2.4, up: 2.4, size: 0.08, life: 0.52, gravity: 10,
        });
      }
    }

    for (const star of this.world.stars) {
      if (star.collected) continue;
      const dx = star.x - p.pos.x;
      const dz = star.z - p.pos.z;
      const dy = star.group.position.y - (p.pos.y + 0.9);
      if (dx * dx + dz * dz < 1.15 * 1.15 && Math.abs(dy) < 1.4) {
        star.collected = true;
        star.group.visible = false;
        this.stars++;
        this.hearts = Math.min(this.maxHearts, this.hearts + 1);
        this.addCoins(5, false);
        this.audio.star();
        this.ui.setStars(this.stars, this.world.starTotal);
        this.ui.setHearts(this.hearts, this.maxHearts);
        this.ui.toast('LUCKY STAR! +5 COINS', true, 1.8);
        for (let i = 0; i < 3; i++) {
          this.spawnBurst(new THREE.Vector3(star.x, star.group.position.y, star.z), {
            color: i === 0 ? 0xffe873 : i === 1 ? 0xff9a5a : 0xfffdf0,
            count: 9, speed: 4 + i, up: 3, size: 0.11, life: 0.8, gravity: 8,
          });
        }
        this.shake = Math.max(this.shake, 0.16);
      }
    }
  }

  addCoins(amount, animate = true) {
    this.coins += amount;
    this.ui.setCoins(this.coins, this.world.coinTotal, animate);
  }

  checkCheckpoints() {
    const p = this.player;
    for (let i = 0; i < this.world.checkpoints.length; i++) {
      const cp = this.world.checkpoints[i];
      if (cp.active) continue;
      const dx = cp.position.x - p.pos.x;
      const dz = cp.position.z - p.pos.z;
      const dy = cp.position.y - p.pos.y;
      if (dx * dx + dz * dz < 3 * 3 && Math.abs(dy) < 3) {
        cp.activate();
        this.checkpointIndex = i;
        this.checkpointSpawn = { x: cp.position.x, y: cp.position.y + 0.05, z: cp.position.z - 1.6 };
        this.hearts = Math.min(this.maxHearts, this.hearts + 1);
        this.ui.setHearts(this.hearts, this.maxHearts);
        this.ui.toast('CHECKPOINT!', false, 1.6);
        this.audio.checkpoint();
        this.spawnBurst(new THREE.Vector3(cp.position.x, cp.position.y + 1.6, cp.position.z), {
          color: 0x7dff9a, count: 12, speed: 3, up: 2.5, size: 0.1, life: 0.7, gravity: 6,
        });
      }
    }
  }

  hitQuestionBlock(block) {
    if (!block || block.used) return;
    block.used = true;
    block.bump = 1;
    this.addCoins(1, false);
    this.audio.bump();
    this.audio.coin();
    const pos = new THREE.Vector3(block.x, block.y + 0.9, block.z);
    this.spawnBurst(pos, { color: 0xffd84a, count: 10, speed: 2.8, up: 4, size: 0.09, life: 0.6, gravity: 12 });
    // Tint used block
    for (const mat of block.mesh.material) {
      mat.color.setHex(0x9c875f);
      if (mat.emissive) mat.emissiveIntensity = 0;
    }
  }

  checkGoal() {
    if (this.status !== 'playing') return;
    const g = this.world.goal;
    const p = this.player;
    const dx = g.position.x - p.pos.x;
    const dz = g.position.z - p.pos.z;
    if (dx * dx + dz * dz < 2.8 * 2.8 && p.pos.y > g.position.y - 0.5 && p.pos.y < g.position.y + 3) {
      this.win();
    }
  }

  win() {
    if (this.status !== 'playing') return;
    this.status = 'won';
    this.world.goal.activate();
    this.audio.win();
    this.player.vel.set(0, 0, 0);
    this.hero.root.rotation.set(0, Math.PI, 0);
    this.ui.setTime(this.timer);
    for (let i = 0; i < 8; i++) {
      const colors = [0xffe873, 0xff7b6b, 0x7dff9a, 0x7fd0ff, 0xff9ff0];
      this.spawnBurst(new THREE.Vector3(
        this.player.pos.x + (Math.random() - 0.5) * 3,
        this.player.pos.y + 2 + Math.random() * 3,
        this.player.pos.z + (Math.random() - 0.5) * 3,
      ), { color: colors[i % colors.length], count: 12, speed: 5, up: 3, size: 0.13, life: 1.8, gravity: 7 });
    }
    const coinRatio = this.coins / Math.max(1, this.world.coinTotal);
    const earned = 1 + (coinRatio >= 0.55 ? 1 : 0) + (this.stars >= this.world.starTotal ? 1 : 0);
    const rank = earned >= 3 ? 'S' : earned === 2 ? 'A' : 'B';
    this.ui.showWin({
      coins: this.coins,
      coinTotal: this.world.coinTotal,
      stars: this.stars,
      starTotal: this.world.starTotal,
      time: this.timer,
      earned,
      rank,
    });
  }

  fallRespawn() {
    if (this.dying > 0) return;
    const p = this.player;
    p.pos.set(this.checkpointSpawn.x, this.checkpointSpawn.y + 0.1, this.checkpointSpawn.z);
    p.vel.set(0, 0, 0);
    p.grounded = false;
    p.invulnerable = 1.6;
    p.standingOn = null;
    p.stompedThisAir = false;
    this.squash = 0;
    this.shake = 0.3;
    this.ui.flash('#ffffff', 0.35);
    this.ui.toast('WHOOPS! BACK TO THE CHECKPOINT');
    this.audio.hurt();
    this.snapCamera();
  }

  checkEnemyContacts() {
    const p = this.player;
    if (p.invulnerable > 0) return;
    for (const enemy of this.world.enemies) {
      if (!enemy.alive) continue;
      if (p.stompedThisAir) continue;
      const dx = enemy.x - p.pos.x;
      const dz = enemy.z - p.pos.z;
      const reach = enemy.radius + P.radius;
      if (dx * dx + dz * dz > reach * reach) continue;
      const enemyTop = enemy.y + enemy.height;
      const vertOverlap = p.pos.y < enemyTop && p.pos.y + P.height > enemy.y;
      if (!vertOverlap) continue;

      const stompHeight = enemy.y + enemy.height * 0.52;
      const falling = p.vel.y < -1;
      if (enemy.hitCooldown > 0) {
        if (falling && p.pos.y > stompHeight) p.vel.y = Math.max(p.vel.y, 9);
        continue;
      }
      if (falling && p.pos.y > stompHeight) {
        this.stompEnemy(enemy);
      } else {
        this.hurtPlayer(enemy);
        break;
      }
    }
  }

  stompEnemy(enemy) {
    const p = this.player;
    enemy.hp--;
    enemy.hitCooldown = enemy.boss ? 0.5 : 0.2;
    p.stompedThisAir = true;
    this.audio.stomp();
    this.shake = Math.max(this.shake, 0.18);
    const pos = new THREE.Vector3(enemy.x, enemy.y + enemy.height * 0.8, enemy.z);
    this.spawnBurst(pos, {
      color: enemy.boss ? 0xb887ff : 0xf6d7a6, count: enemy.boss ? 16 : 9, speed: 3.4, up: 2.4, size: 0.12, life: 0.55, gravity: 11,
    });

    if (enemy.hp <= 0) {
      enemy.alive = false;
      enemy.defeated = true;
      enemy.squash = enemy.boss ? 0.9 : 0.55;
      enemy.root.scale.set(enemy.scaleValue * 1.25, enemy.scaleValue * 0.16, enemy.scaleValue * 1.25);
      if (enemy.crown) enemy.crown.visible = false;
      p.vel.y = 13.5;
      this.addCoins(enemy.boss ? 5 : 1, false);
      if (enemy.boss) {
        this.bossDefeated = true;
        this.bossActive = false;
        this.ui.hideBoss();
        this.ui.toast('MEGA GOOMBA DEFEATED!', true, 2.2);
        for (let i = 0; i < 4; i++) {
          this.spawnBurst(new THREE.Vector3(enemy.x, enemy.y + 1.5, enemy.z), {
            color: [0xffe873, 0xb887ff, 0xff7b6b, 0x7dff9a][i], count: 10, speed: 5, up: 4, size: 0.13, life: 1.2, gravity: 8,
          });
        }
        this.audio.checkpoint();
        this.shake = 0.4;
      }
    } else {
      // Boss survived a hit.
      enemy.hitFlash = 0.4;
      enemy.squash = 0.22;
      p.vel.y = 12;
      this.audio.bossHit();
      this.ui.bossHealth(enemy.hp, enemy.maxHp);
      this.ui.toast(enemy.hp === 2 ? 'NICE HIT!' : 'ONE MORE!', true, 1.0);
      enemy.root.scale.set(enemy.scaleValue, enemy.scaleValue * 0.65, enemy.scaleValue);
    }
    p.pos.y = Math.max(p.pos.y, enemy.y + enemy.height * 0.4);
    p.jumpBuffer = 0;
    p.jumpCut = false;
  }

  hurtPlayer(enemy) {
    const p = this.player;
    this.hearts--;
    p.invulnerable = 1.8;
    this.ui.setHearts(this.hearts, this.maxHearts);
    this.ui.flash('#ff5d5d', 0.4);
    const dirX = p.pos.x - enemy.x;
    const dirZ = p.pos.z - enemy.z;
    const len = Math.hypot(dirX, dirZ) || 1;
    p.vel.x = (dirX / len) * 7.5;
    p.vel.z = (dirZ / len) * 7.5;
    p.vel.y = 7;
    this.shake = 0.35;
    this.audio.hurt();
    if (this.hearts <= 0) {
      this.dying = 1.0;
      p.vel.set((dirX / len) * 6, 10, (dirZ / len) * 6);
      this.ui.toast('OUCH!', false, 1.0);
    } else {
      this.ui.toast(this.hearts === 1 ? 'CAREFUL!' : 'OOF!', false, 1.0);
    }
  }

  // ------------------------------ Enemies ---------------------------------

  updateEnemies(dt) {
    const active = this.status === 'playing' || this.status === 'title';
    for (const enemy of this.world.enemies) {
      if (!enemy.alive) {
        if (enemy.squash > 0) {
          enemy.squash = Math.max(0, enemy.squash - dt);
          const t = 1 - enemy.squash / (enemy.boss ? 0.9 : 0.55);
          const base = enemy.scaleValue;
          enemy.root.scale.set(base * (1 + t * 0.35), base * Math.max(0.05, 0.16 * (1 - t) + 0.12), base * (1 + t * 0.35));
          if (enemy.squash <= 0) enemy.root.visible = false;
        }
        continue;
      }

      enemy.walkPhase += dt * (enemy.boss ? 4.5 : 7);
      if (enemy.hitCooldown > 0) enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);

      if (active) {
        if (enemy.boss) {
          const dx = this.player.pos.x - enemy.x;
          const dz = this.player.pos.z - enemy.z;
          const dist = Math.hypot(dx, dz);
          if (!enemy.awake && dist < 17 && this.status === 'playing') {
            enemy.awake = true;
            this.bossActive = true;
            this.ui.showBoss(enemy.hp, enemy.maxHp);
            if (!this.bossToastShown) {
              this.bossToastShown = true;
              this.ui.toast('MEGA GOOMBA!', true, 1.8);
              this.audio.bossHit();
            }
          }
          if (enemy.awake && this.status === 'playing') {
            const speed = (enemy.hp === 2 ? 1.7 : 1.35);
            enemy.dir = Math.sign(dx) || 1;
            enemy.x += clamp(dx, -speed * dt, speed * dt);
            enemy.z += clamp(dz, -speed * dt, speed * dt);
            // Stay on the arena
            enemy.x = clamp(enemy.x, enemy.home.x - enemy.range, enemy.home.x + enemy.range);
            enemy.z = clamp(enemy.z, enemy.home.z - enemy.range, enemy.home.z + enemy.range);
            enemy.root.rotation.y = Math.atan2(dx, dz);
            enemy.root.position.set(enemy.x, enemy.y + Math.abs(Math.sin(enemy.walkPhase)) * 0.1, enemy.z);
            this.animateEnemy(enemy);
            continue;
          }
        } else {
          const step = enemy.speed * enemy.dir * dt;
          if (enemy.axis === 'x') enemy.x += step;
          else enemy.z += step;
          if (enemy.x > enemy.home.x + enemy.range) { enemy.x = enemy.home.x + enemy.range; enemy.dir = -1; }
          if (enemy.x < enemy.home.x - enemy.range) { enemy.x = enemy.home.x - enemy.range; enemy.dir = 1; }
          if (enemy.z > enemy.home.z + enemy.range) { enemy.z = enemy.home.z + enemy.range; enemy.dir = -1; }
          if (enemy.z < enemy.home.z - enemy.range) { enemy.z = enemy.home.z - enemy.range; enemy.dir = 1; }
        }
      }

      if (enemy.hitFlash > 0) {
        enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
        const flash = Math.sin(enemy.hitFlash * 60) > 0;
        enemy.root.visible = flash || this.status !== 'playing';
      } else {
        enemy.root.visible = true;
      }

      enemy.root.position.set(enemy.x, enemy.y + Math.abs(Math.sin(enemy.walkPhase)) * 0.08, enemy.z);
      const faceX = enemy.axis === 'x' ? enemy.dir : 0;
      const faceZ = enemy.axis === 'z' ? enemy.dir : 0;
      if (!enemy.boss) {
        enemy.root.rotation.y = Math.atan2(faceX, faceZ);
      }
      this.animateEnemy(enemy);
    }
  }

  animateEnemy(enemy) {
    const walk = Math.sin(enemy.walkPhase);
    enemy.head.rotation.z = walk * 0.07;
    enemy.feet[0].position.z = 0.06 + walk * 0.12;
    enemy.feet[1].position.z = 0.06 - walk * 0.12;
    enemy.feet[0].position.y = 0.12 + Math.max(0, walk) * 0.05;
    enemy.feet[1].position.y = 0.12 + Math.max(0, -walk) * 0.05;
    enemy.body.rotation.z = walk * 0.04;
  }

  // ------------------------------- Hero -----------------------------------

  updateHero(dt) {
    const p = this.player;
    const hero = this.hero;
    hero.root.position.set(p.pos.x, p.pos.y, p.pos.z);
    hero.root.rotation.y = p.facing;

    if (p.invulnerable > 0 && this.status === 'playing') {
      hero.root.visible = Math.floor(p.invulnerable * 14) % 2 === 0;
    } else {
      hero.root.visible = true;
    }

    const horizontalSpeed = Math.hypot(p.vel.x, p.vel.z);
    const running = horizontalSpeed > 0.4 && p.grounded;
    if (running) this.runPhase += dt * (7 + horizontalSpeed * 1.15);
    else this.runPhase += dt * 1.6;

    const runAmount = clamp(horizontalSpeed / 7, 0, 1);
    this.jumpBlend += ((p.grounded ? 0 : 1) - this.jumpBlend) * Math.min(1, dt * 10);
    this.squash += (0 - this.squash) * Math.min(1, dt * 10);
    this.landSquash += (0 - this.landSquash) * Math.min(1, dt * 12);

    const jump = this.jumpBlend;
    const swing = Math.sin(this.runPhase) * 0.95 * runAmount;

    // Body bounce, lean and squash
    hero.body.position.y = Math.abs(Math.sin(this.runPhase)) * 0.055 * runAmount * (1 - jump);
    hero.body.rotation.x = 0.12 * runAmount * (1 - jump) + jump * 0.1;
    hero.body.rotation.z = Math.sin(this.runPhase) * 0.03 * runAmount;
    hero.root.scale.y = 1 + this.squash * 0.9 - this.landSquash * 0.7;
    hero.root.scale.x = 1 - this.squash * 0.45 + this.landSquash * 0.3;
    hero.root.scale.z = 1 - this.squash * 0.45 + this.landSquash * 0.3;

    if (this.status === 'won') {
      // Victory pose
      hero.arms[0].rotation.x = -2.5;
      hero.arms[1].rotation.x = -2.5;
      hero.arms[0].rotation.z = -0.45;
      hero.arms[1].rotation.z = 0.45;
      hero.legs[0].rotation.x = 0;
      hero.legs[1].rotation.x = 0;
      hero.body.position.y = Math.abs(Math.sin(this.animTime * 4)) * 0.07;
      hero.head.rotation.z = Math.sin(this.animTime * 3) * 0.05;
      return;
    }

    if (this.dying > 0) {
      hero.root.rotation.y += dt * 9;
      hero.arms[0].rotation.x = -2;
      hero.arms[1].rotation.x = -2;
      hero.legs[0].rotation.x = 0.5;
      hero.legs[1].rotation.x = -0.5;
      hero.head.rotation.z = Math.sin(this.dying * 20) * 0.2;
      return;
    }

    // Arms
    const armSwing = swing * 0.85;
    hero.arms[0].rotation.x = armSwing + jump * -2.3 + (1 - runAmount) * Math.sin(this.animTime * 2) * 0.05;
    hero.arms[1].rotation.x = -armSwing + jump * -2.3 + (1 - runAmount) * Math.sin(this.animTime * 2 + 1) * 0.05;
    hero.arms[0].rotation.z = jump * -0.55;
    hero.arms[1].rotation.z = jump * 0.55;

    // Legs
    hero.legs[0].rotation.x = swing + jump * 0.55;
    hero.legs[1].rotation.x = -swing + jump * -0.75;
    hero.legs[0].rotation.z = jump * 0.15;
    hero.legs[1].rotation.z = jump * -0.15;

    // Head / cap follow-through
    hero.head.rotation.z = -walkTilt(this.runPhase) * 0.04 * runAmount;
    hero.head.rotation.x = jump * -0.08 + Math.sin(this.animTime * 1.8) * 0.012;
    hero.cap.rotation.x = Math.sin(this.runPhase * 2) * 0.02 * runAmount;
    hero.torso.rotation.y = Math.sin(this.runPhase) * 0.09 * runAmount;
  }

  // ----------------------------- Particles --------------------------------

  spawnBurst(pos, { color = 0xffffff, count = 8, speed = 3, up = 2, size = 0.1, life = 0.6, gravity = 10, shape = 'octa' } = {}) {
    if (this.particles.length > 26) return;
    const geo = this.particleGeos[shape] || this.particleGeos.octa;
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, depthWrite: false });
    const group = new THREE.Group();
    group.position.copy(pos);
    const items = [];
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const horiz = Math.random() * speed;
      mesh.position.set(0, 0, 0);
      mesh.scale.setScalar((0.6 + Math.random() * 0.9) * (size / 0.1));
      group.add(mesh);
      items.push({
        mesh,
        vx: Math.cos(angle) * horiz,
        vy: up * (0.4 + Math.random()),
        vz: Math.sin(angle) * horiz,
        spin: (Math.random() - 0.5) * 10,
      });
    }
    this.scene.add(group);
    this.particles.push({ group, mat, items, life, maxLife: life, gravity });
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const burst = this.particles[i];
      burst.life -= dt;
      if (burst.life <= 0) {
        this.scene.remove(burst.group);
        burst.mat.dispose();
        this.particles.splice(i, 1);
        continue;
      }
      const k = burst.life / burst.maxLife;
      burst.mat.opacity = Math.min(1, k * 1.6);
      for (const item of burst.items) {
        item.vy -= burst.gravity * dt;
        item.mesh.position.x += item.vx * dt;
        item.mesh.position.y += item.vy * dt;
        item.mesh.position.z += item.vz * dt;
        item.mesh.rotation.x += item.spin * dt;
        item.mesh.rotation.y += item.spin * dt;
      }
    }
  }

  clearParticles() {
    for (const burst of this.particles) {
      this.scene.remove(burst.group);
      burst.mat.dispose();
    }
    this.particles.length = 0;
  }

  // ------------------------------ Camera ----------------------------------

  updateCamera(dt) {
    const cs = this.cameraState;
    if (this.status === 'title' || this.status === 'paused' && !cs.initialized) {
      this.cinematicCamera(dt);
      return;
    }
    if (this.status === 'paused' || this.status === 'lost') return;

    if (this.status === 'won') {
      cs.yaw += dt * 0.35;
      cs.pitch = 0.26;
      const dist = 8.4;
      const target = new THREE.Vector3(this.player.pos.x, this.player.pos.y + 1.25, this.player.pos.z);
      const cp = Math.cos(cs.pitch);
      const desired = new THREE.Vector3(
        target.x + Math.sin(cs.yaw) * cp * dist,
        target.y + Math.sin(cs.pitch) * dist + 0.6,
        target.z + Math.cos(cs.yaw) * cp * dist,
      );
      cs.position.lerp(desired, 1 - Math.exp(-dt * 4));
      cs.look.lerp(target, 1 - Math.exp(-dt * 6));
      this.applyCameraShake();
      this.camera.position.copy(cs.position);
      this.camera.lookAt(cs.look);
      return;
    }

    // Auto-align behind the player's heading when running forward.
    this.orbitHold = Math.max(0, this.orbitHold - dt);
    const move = this.input.getMove();
    const speed = Math.hypot(this.player.vel.x, this.player.vel.z);
    if (this.orbitHold <= 0 && move.y > 0.35 && Math.abs(move.x) < 0.35 && speed > 1) {
      const desiredYaw = Math.atan2(-this.player.vel.x, -this.player.vel.z);
      let diff = ((desiredYaw - cs.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      cs.yaw += diff * Math.min(1, dt * 0.9);
    }

    const target = new THREE.Vector3(
      this.player.pos.x + this.player.vel.x * 0.045,
      this.player.pos.y + 1.18,
      this.player.pos.z + this.player.vel.z * 0.045,
    );
    const dist = cs.distance;
    const cp = Math.cos(cs.pitch);
    const desired = new THREE.Vector3(
      target.x + Math.sin(cs.yaw) * cp * dist,
      target.y + Math.sin(cs.pitch) * dist + 0.45,
      target.z + Math.cos(cs.yaw) * cp * dist,
    );

    const smooth = this.introTimer > 0 ? 1 - Math.exp(-dt * 4.5) : 1 - Math.exp(-dt * 9);
    if (this.introTimer > 0) this.introTimer = Math.max(0, this.introTimer - dt);
    cs.target.lerp(target, 1 - Math.exp(-dt * 12));
    cs.position.lerp(desired, smooth);
    cs.look.lerp(cs.target, 1 - Math.exp(-dt * 16));

    this.applyCameraShake();
    this.camera.position.copy(cs.position);
    this.camera.lookAt(cs.look);
  }

  applyCameraShake() {
    const cs = this.cameraState;
    if (this.shake > 0.001) {
      cs.position.x += (Math.random() - 0.5) * this.shake * 0.7;
      cs.position.y += (Math.random() - 0.5) * this.shake * 0.7;
      cs.position.z += (Math.random() - 0.5) * this.shake * 0.7;
      this.shake = Math.max(0, this.shake - 0.016 * (1 + this.shake * 4));
    }
  }

  cinematicCamera(dt) {
    const t = this.time;
    const cs = this.cameraState;
    const target = new THREE.Vector3(0, 2.4, -16);
    const desired = new THREE.Vector3(
      13.5 + Math.sin(t * 0.16) * 3.2,
      8.6 + Math.sin(t * 0.32) * 0.7,
      17 + Math.cos(t * 0.16) * 2.4,
    );
    if (!cs.initialized) {
      cs.position.copy(desired);
      cs.look.copy(target);
      cs.initialized = true;
    } else {
      cs.position.lerp(desired, 1 - Math.exp(-dt * 2.5));
      cs.look.lerp(target, 1 - Math.exp(-dt * 2.5));
    }
    this.camera.position.copy(cs.position);
    this.camera.lookAt(cs.look);
  }
}

function walkTilt(phase) {
  return Math.sin(phase);
}
