import * as THREE from 'three';
import { World } from './world.js';
import { Player } from './player.js';
import { createBots } from './bots.js';
import { Effects } from './fx.js';
import { AudioEngine } from './audio.js';
import { Input } from './input.js';
import { HUD } from './hud.js';
import { ViewModel, WEAPONS } from './weapons.js';
import { glowTexture } from './textures.js';

const $ = (id) => document.getElementById(id);
const UP = new THREE.Vector3(0, 1, 0);

class Game {
  constructor() {
    this.canvas = $('game');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.08, 900);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.world = new World(this.scene);
    this.effects = new Effects(this.scene);
    this.audio = new AudioEngine();
    this.hud = new HUD();
    this.player = new Player();
    this.bots = createBots(this.scene);
    this.combatants = [this.player, ...this.bots];
    this.viewModel = new ViewModel(window.innerWidth / window.innerHeight);
    this.viewModel.setAspect(this.camera.aspect);
    this.effects.setViewport(window.innerHeight, 68);

    this.state = 'menu';
    this.time = 0;
    this.timeLeft = 300;
    this.fragLimit = 20;
    this.respawnTimer = 0;
    this.over = false;
    this.firstBlood = true;
    this.projectiles = [];
    this.recoil = 0;
    this.sensitivity = Number(localStorage.getItem('tribes_sens') || 1);
    this.reducedMotion = false;
    this.deathCam = 0;
    this.aimTarget = null;
    this.menuAngle = 0.5;
    this.playerKills = [];
    this.lastTab = false;
    this.pointerHintTimer = 0;
    this.shake = 0;
    this.quadWasActive = false;
    this.menuBotsReady = false;

    this.input = new Input(this.canvas, {
      onPause: () => this.handleEscape(),
      onLockChange: (locked) => {
        if (this.state === 'playing') this.hud.showPointerHint(!locked && !this.input.isTouch);
      },
      onWeapon: () => {
        if (this.state === 'playing' && this.player.alive) {
          this.player.selectWeapon((this.player.weaponIndex + 1) % WEAPONS.length, this);
        }
      }
    });
    this.hud.onSlot = (i) => {
      if (this.state === 'playing' && this.player.alive) this.player.selectWeapon(i, this);
    };

    this.projectileMats = {
      rocket: new THREE.MeshBasicMaterial({ color: 0xffb060 }),
      rocketGlow: glowTexture('rgba(255,250,220,1)', 'rgba(255,160,60,.7)', 'rgba(255,80,0,0)'),
      spin: new THREE.MeshBasicMaterial({ color: 0x7de8ff }),
      spinGlow: glowTexture('rgba(220,255,255,1)', 'rgba(70,200,255,.6)', 'rgba(0,120,255,0)'),
    };

    this.bindUI();
    this.arrangeMenu();
    this.hideBoot();
    this.addEventListeners();
  }

  hideBoot() {
    setTimeout(() => {
      const b = $('boot');
      b.classList.add('done');
      setTimeout(() => b.classList.add('hidden'), 550);
    }, 500);
  }

  bindUI() {
    $('playBtn').addEventListener('click', () => {
      this.audio.init();
      this.audio.uiBig();
      this.startMatch();
    });
    $('controlsBtn').addEventListener('click', () => {
      this.audio.init(); this.audio.ui();
      $('controlsPanel').classList.toggle('hidden');
    });
    $('controlsClose').addEventListener('click', () => $('controlsPanel').classList.add('hidden'));

    $('resumeBtn').addEventListener('click', () => { this.audio.init(); this.audio.ui(); this.resume(); });
    $('restartBtn').addEventListener('click', () => { this.audio.init(); this.audio.ui(); this.startMatch(); });
    $('quitBtn').addEventListener('click', () => this.quitToMenu());
    $('againBtn').addEventListener('click', () => { this.audio.init(); this.audio.ui(); this.startMatch(); });
    $('menuBtn').addEventListener('click', () => this.quitToMenu());

    const sens = $('sensSlider');
    const sensVal = $('sensVal');
    const pauseSens = $('pauseSens');
    const pauseSensVal = $('pauseSensVal');
    const applySens = (v) => {
      this.sensitivity = v;
      localStorage.setItem('tribes_sens', v);
      sens.value = v; pauseSens.value = v;
      sensVal.textContent = Number(v).toFixed(2);
      pauseSensVal.textContent = Number(v).toFixed(2);
    };
    applySens(this.sensitivity);
    sens.addEventListener('input', () => applySens(Number(sens.value)));
    pauseSens.addEventListener('input', () => applySens(Number(pauseSens.value)));

    const soundLabel = (b) => b.textContent = 'SOUND: ' + (this.audio.muted ? 'OFF' : 'ON');
    const toggleSound = () => {
      this.audio.init();
      this.audio.setMuted(!this.audio.muted);
      soundLabel($('soundBtn')); soundLabel($('pauseSoundBtn'));
      this.hud.toast(this.audio.muted ? 'AUDIO MUTED' : 'AUDIO ONLINE');
    };
    $('soundBtn').addEventListener('click', toggleSound);
    $('pauseSoundBtn').addEventListener('click', toggleSound);
    soundLabel($('soundBtn')); soundLabel($('pauseSoundBtn'));

    // mobile detection
    this.isTouch = this.input.isTouch;
    if (this.isTouch) document.body.classList.add('touch');

    this.canvas.addEventListener('pointerdown', () => {
      this.audio.init();
      if (this.state === 'playing' && this.player.alive && !this.input.isTouch) this.input.requestLock();
    });

    // icon rendering of ammo etc.
    this.hud.setVisible(false);
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.viewModel.setAspect(w / h);
      this.effects.setViewport(h, 68);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause();
    });
  }

  arrangeMenu() {
    this.state = 'menu';
    this.hud.setVisible(false);
    this.input.enabled = false;
    this.input.releaseLock();
    $('menu').classList.remove('hidden');
    $('pause').classList.add('hidden');
    $('gameover').classList.add('hidden');
    $('controlsPanel').classList.add('hidden');
    this.world.resetPickups();
    // pose bots around arena for the attract shot
    const spots = [14, 22, 6, 10];
    this.bots.forEach((b, i) => {
      const sp = this.world.spawnPoints[spots[i] % this.world.spawnPoints.length];
      b.spawn(this.world, sp);
      b.protection = 999;
      b.tag.material.opacity = 0;
      b.aura.material.opacity = 0.1;
    });
    this.player.alive = false;
    this.menuAngle = 0.55;
    this.camera.position.set(38, 17, 34);
    this.camera.lookAt(0, 4, 0);
  }

  startMatch() {
    this.audio.init();
    this.audio.setIntensity(0.75);
    $('menu').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('gameover').classList.add('hidden');
    $('controlsPanel').classList.add('hidden');
    this.hud.hideGameOver();
    this.hud.setVisible(true);
    this.hud.hideRespawn();
    this.hud.toggleScoreboard(false);
    this.state = 'playing';
    this.input.enabled = true;
    this.timeLeft = 300;
    this.fragLimit = 20;
    this.respawnTimer = 0;
    this.over = false;
    this.firstBlood = true;
    this.deathCam = 0;
    this.recoil = 0;
    this.shake = 0;
    this.playerKills = [];
    this.projectiles.forEach(p => this.removeProjectile(p));
    this.projectiles.length = 0;
    this.effects.clearGibs();
    this.world.resetPickups();

    this.player.reset();
    const start = { pos: new THREE.Vector3(-3, 0.06, 24), yaw: Math.atan2(3, 24) };
    this.player.spawn(this.world, start);
    this.player.pitch = -0.025;
    this.player.yaw = start.yaw;
    this.viewModel.show(0, true);

    // spawn bots far from player
    const sorted = [...this.world.spawnPoints].sort((a, b) => b.pos.distanceTo(this.player.position) - a.pos.distanceTo(this.player.position));
    this.bots.forEach((b, i) => {
      b.resetScores();
      b.spawn(this.world, sorted[(i + 1) % sorted.length]);
      b.tag.material.opacity = 0.9;
      this.spawnFlash(b.position, b.color);
    });
    // one rival spawned just ahead for an immediate read of scale + intent
    const closeSpawn = {
      pos: new THREE.Vector3(4.2, 0.06, 10.5),
      yaw: Math.atan2(-(this.player.position.x - 4.2), -(this.player.position.z - 10.5)),
    };
    this.bots[0].spawn(this.world, closeSpawn);

    this.camera.position.copy(this.player.eyePosition);
    this.camera.rotation.set(this.player.pitch, this.player.yaw, 0);
    this.hud.announce('FIGHT', 'gold', 1900);
    if (!this.input.isTouch) {
      this.input.requestLock();
      this.hud.showPointerHint(true);
      this.pointerHintTimer = 2.5;
    }
  }

  spawnFlash(pos, color) {
    this.effects.burst(pos.clone().setY(pos.y + 0.4), 20, { color, speed: 4.5, size: 0.24, life: 0.6, grav: 2 });
    this.effects.ring?.(pos, color);
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.input.enabled = false;
    this.input.releaseLock();
    this.audio.setJet(false);
    const sorted = [...this.combatants].sort((a, b) => b.score - a.score);
    $('pauseFrags').textContent = this.player.score;
    $('pauseLeader').textContent = sorted[0] ? sorted[0].name : '—';
    const tips = [
      'TIP: JETPACK UP, CUT THE JETS, AND FIRE ON THE WAY DOWN.',
      'TIP: HOLD SHIFT TO SKI — KEEP YOUR SPEED THROUGH THE LANES.',
      'TIP: A ROCKET AT YOUR FEET IS FASTER THAN WALKING.',
      'TIP: THE QUAD CORE RESPAWNS 38 SECONDS AFTER PICKUP.',
      'TIP: FALLING OFF THE ARENA COUNTS AS A DEATH. THE VOID IS PATIENT.'
    ];
    $('pauseTip').textContent = tips[(Math.random() * tips.length) | 0];
    $('pause').classList.remove('hidden');
    this.hud.showPointerHint(false);
  }

  resume() {
    if (this.state !== 'paused') return;
    $('pause').classList.add('hidden');
    this.state = 'playing';
    this.input.enabled = true;
    this.input.requestLock();
    this.hud.showPointerHint(!this.input.locked && !this.input.isTouch);
  }

  handleEscape() {
    if (this.state === 'playing') this.pause();
    else if (this.state === 'paused') this.resume();
  }

  quitToMenu() {
    this.state = 'menu';
    this.input.enabled = false;
    this.input.releaseLock();
    this.audio.setJet(false);
    this.audio.setIntensity(0.35);
    this.hud.setVisible(false);
    this.hud.toggleScoreboard(false);
    $('pause').classList.add('hidden');
    $('gameover').classList.add('hidden');
    $('menu').classList.remove('hidden');
    this.projectiles.forEach(p => this.removeProjectile(p));
    this.projectiles.length = 0;
    this.effects.clearGibs();
    this.arrangeMenu();
  }

  // ---------------- combat ----------------
  raySphere(origin, dir, center, radius) {
    const ox = center.x - origin.x, oy = center.y - origin.y, oz = center.z - origin.z;
    const t = ox * dir.x + oy * dir.y + oz * dir.z;
    if (t < 0) return null;
    const d2 = ox * ox + oy * oy + oz * oz - t * t;
    const r2 = radius * radius;
    if (d2 > r2) return null;
    return t - Math.sqrt(r2 - d2);
  }

  entityCenter(e) {
    return new THREE.Vector3(e.position.x, e.position.y + (e.isPlayer ? 1.05 : 1.05), e.position.z);
  }

  firePlayerWeapon(player, w) {
    player.lastWeaponId = w.id;
    this.audio[w.id === 'scatter' ? 'shotgun' : w.id === 'rocket' ? 'rocket' : w.id === 'rail' ? 'rail' : 'spin']();
    this.viewModel.fire();
    this.recoil = Math.min(1.2, this.recoil + (w.kick || 1));
    if (!w.infinite) player.ammo[w.id] = Math.max(0, player.ammo[w.id] - 1);

    const origin = player.eyePosition;
    const forward = player.forward;
    const muzzle = origin.clone().addScaledVector(forward, 0.75).addScaledVector(player.flatRight, 0.26).add(new THREE.Vector3(0, -0.14, 0));
    const quadMult = player.quad > 0 ? 4 : 1;

    if (w.id === 'scatter') {
      let anyHit = false;
      for (let i = 0; i < w.pellets; i++) {
        const spread = w.spread;
        const rx = (Math.random() - 0.5) * 2 * spread;
        const ry = (Math.random() - 0.5) * 2 * spread;
        const dir = forward.clone().addScaledVector(player.flatRight, rx).addScaledVector(UP, ry).normalize();
        const res = this.hitscan(origin, dir, w.range, w.damage * quadMult, player, w.id, false);
        if (i % 3 === 0) {
          this.effects.beam(muzzle, res.point, 0xffcf8a, 0.018, 0.055);
        }
        if (res.target) anyHit = true;
      }
      if (anyHit) this.hud.hitmarker(false);
    } else if (w.id === 'rail') {
      const res = this.hitscan(origin, forward, w.range, w.damage * quadMult, player, w.id, true);
      const end = res.point.clone().addScaledVector(forward, -0.15);
      this.effects.rail(muzzle, end);
      if (res.target) {
        this.hud.hitmarker(false);
        this.effects.burst(res.point, 14, { color: 0x9dfbff, speed: 5, size: 0.18, life: 0.35, grav: 3 });
      }
      this.shake = Math.max(this.shake, 0.4);
    } else {
      this.spawnProjectile(player, w, origin, forward, muzzle, quadMult);
    }
    // tiny camera kick
    this.cameraKick = (this.cameraKick || 0) + 0.02 * (w.kick || 1);
  }

  hitscan(origin, dir, range, damage, owner, weaponId, strong) {
    const wall = this.world.raycast(origin, dir, range);
    let wallDist = wall ? wall.distance : range;
    let point = wall ? wall.point.clone() : origin.clone().addScaledVector(dir, range);
    let closest = null, closestDist = wallDist;
    for (const e of this.combatants) {
      if (e === owner || !e.alive) continue;
      const center = this.entityCenter(e);
      const t = this.raySphere(origin, dir, center, e.isPlayer ? 0.62 : 0.82);
      if (t !== null && t < closestDist) {
        closestDist = t;
        closest = e;
        point = origin.clone().addScaledVector(dir, t);
      }
    }
    if (closest) {
      closest.hurt(damage, owner, this, weaponId);
      this.effects.spark(point, dir.clone().negate(), weaponId === 'rail' ? 0x99fbff : 0xffc080, strong ? 16 : 6);
      this.audio.hit();
    } else if (wall) {
      const n = wall.face ? wall.face.normal.clone().transformDirection(wall.object.matrixWorld) : dir.clone().negate();
      this.effects.spark(point, n, 0xffc080, 5);
    }
    return { point, target: closest };
  }

  spawnProjectile(owner, w, origin, forward, muzzle, quadMult) {
    const isRocket = w.id === 'rocket';
    const g = new THREE.Group();
    if (isRocket) {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.6, 10), this.projectileMats.rocket);
      body.rotation.x = Math.PI / 2;
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 10), new THREE.MeshBasicMaterial({ color: 0xfff0c0 }));
      tip.rotation.x = -Math.PI / 2;
      tip.position.z = -0.42;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 4, 14), new THREE.MeshBasicMaterial({ color: 0xff6a00 }));
      ring.position.z = 0.1;
      g.add(body, tip, ring);
    } else {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.055, 20), this.projectileMats.spin);
      disc.rotation.x = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.03, 4, 22), new THREE.MeshBasicMaterial({ color: 0xbefaff }));
      g.add(disc, rim);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: isRocket ? this.projectileMats.rocketGlow : this.projectileMats.spinGlow,
      color: isRocket ? 0xffb060 : 0x66ddff,
      transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    glow.scale.setScalar(isRocket ? 2.6 : 1.8);
    g.add(glow);
    const start = origin.clone().addScaledVector(forward, 0.85);
    if (this.world.collideSphere(start, 0.2)) start.copy(origin).addScaledVector(forward, 0.35);
    g.position.copy(start);
    this.scene.add(g);
    const proj = {
      owner, weapon: w, pos: start.clone(), prev: start.clone(),
      vel: forward.clone().multiplyScalar(w.speed),
      gravity: isRocket ? 1.1 : 2.0,
      damage: w.damage * quadMult, splash: w.splash * quadMult, radius: w.splashRadius,
      life: 6, mesh: g, type: isRocket ? 'rocket' : 'spin',
      trailTimer: 0, directHit: null,
    };
    this.projectiles.push(proj);
  }

  botFire(bot, dir, dist) {
    const origin = bot.eyePosition;
    const start = origin.clone().addScaledVector(dir, 0.9);
    const g = new THREE.Group();
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: bot.color }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 4, 14), new THREE.MeshBasicMaterial({ color: bot.color, transparent: true, opacity: 0.8 }));
    g.add(orb, ring);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.projectileMats.spinGlow, color: bot.color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    glow.scale.setScalar(1.7);
    g.add(glow);
    g.position.copy(start);
    this.scene.add(g);
    const proj = {
      owner: bot, weapon: null, pos: start.clone(), prev: start.clone(),
      vel: dir.clone().multiplyScalar(40),
      gravity: 3.4,
      damage: 22, splash: 20, radius: 3.1,
      life: 5, mesh: g, type: 'bot', color: bot.color,
      trailTimer: 0, directHit: null,
    };
    this.projectiles.push(proj);
    this.audio.tone({ f: 760, to: 300, dur: 0.18, type: 'triangle', vol: 0.035, filter: { f: 2200, to: 600, q: 2 } });
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      if (p.life <= 0) { this.removeProjectile(p); this.projectiles.splice(i, 1); continue; }
      p.prev.copy(p.pos);
      p.vel.y -= p.gravity * dt;
      const speed = p.vel.length();
      const steps = Math.max(1, Math.ceil(speed * dt / 0.45));
      let exploded = false;
      for (let s = 0; s < steps; s++) {
        p.pos.addScaledVector(p.vel, dt / steps);
        // world
        if (this.world.collideSphere(p.pos, 0.18)) {
          this.explodeProjectile(p, p.pos.clone());
          exploded = true;
          break;
        }
        // entities
        for (const e of this.combatants) {
          if (!e.alive || e === p.owner) continue;
          const c = this.entityCenter(e);
          const r = e.isPlayer ? 0.75 : 0.95;
          if (p.pos.distanceToSquared(c) < r * r) {
            p.directHit = e;
            this.explodeProjectile(p, p.pos.clone());
            exploded = true;
            break;
          }
        }
        if (exploded) break;
      }
      if (exploded) {
        this.removeProjectile(p);
        this.projectiles.splice(i, 1);
        continue;
      }
      p.mesh.position.copy(p.pos);
      p.mesh.lookAt(p.pos.clone().add(p.vel));
      if (p.type === 'spin') p.mesh.rotation.z += dt * 22;
      // trail
      p.trailTimer -= dt;
      if (p.trailTimer <= 0) {
        p.trailTimer = 0.025;
        const isBot = p.type === 'bot';
        this.effects.particle({
          x: p.pos.x + (Math.random() - 0.5) * 0.2, y: p.pos.y + (Math.random() - 0.5) * 0.2, z: p.pos.z + (Math.random() - 0.5) * 0.2,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, vz: (Math.random() - 0.5) * 0.4,
          r: isBot ? ((p.color >> 16) & 255) / 255 : 1,
          g: isBot ? ((p.color >> 8) & 255) / 255 : 0.65,
          b: isBot ? (p.color & 255) / 255 : 0.3,
          size: isBot ? 0.18 : 0.24, life: isBot ? 0.3 : 0.55, grav: -1, drag: 2
        });
      }
    }
  }

  removeProjectile(p) {
    this.scene.remove(p.mesh);
    p.mesh.traverse(o => { if (o.isMesh) { o.geometry.dispose(); if (o.material.dispose) o.material.dispose(); } });
  }

  explodeProjectile(p, pos) {
    const big = p.type === 'rocket' ? 1.5 : p.type === 'spin' ? 1.1 : 0.85;
    this.effects.explosion(pos, big);
    this.audio.explosion(big);
    const owner = p.owner;
    if (p.directHit) {
      let dmg = p.damage * (owner && owner.quad > 0 ? 1 : 1);
      p.directHit.hurt(dmg, owner, this, p.type === 'rocket' ? 'rocket' : p.type === 'spin' ? 'spin' : 'plasma');
      if (owner && owner.isPlayer) this.hud.hitmarker(false);
    }
    // splash + knockback
    for (const e of this.combatants) {
      if (!e.alive) continue;
      const c = this.entityCenter(e);
      const d = c.distanceTo(pos);
      if (d > p.radius + 0.8) continue;
      const falloff = Math.max(0, 1 - d / p.radius);
      const self = e === owner;
      let dmg = p.splash * (0.35 + 0.65 * falloff);
      if (self) dmg *= 0.42;
      if (dmg > 1) e.hurt(dmg, owner, this, p.type === 'bot' ? 'plasma' : p.type);
      // knockback
      const dir = c.clone().sub(pos);
      if (dir.lengthSq() < 0.01) dir.set(0, 1, 0);
      dir.normalize();
      const power = (p.type === 'rocket' ? 8.6 : p.type === 'spin' ? 6.4 : 4.6) * (0.35 + falloff) * (self ? 1.35 : 1);
      e.velocity.x += dir.x * power;
      e.velocity.z += dir.z * power;
      e.velocity.y += Math.max(2.5, dir.y * power + (self ? 8.2 : 3.4) * falloff);
      if (e.isPlayer) {
        this.shake = Math.min(1.2, this.shake + falloff * (self ? 0.8 : 0.55));
      }
    }
  }

  collectPickup(p, entity) {
    if (!p.active) return;
    const isPlayer = entity.isPlayer;
    let msg = '';
    if (p.type === 'health') {
      if (entity.health >= entity.maxHealth) return;
      entity.addHealth(25);
      msg = '+25 HEALTH';
    } else if (p.type === 'mega') {
      if (entity.health >= entity.maxHealth) return;
      entity.addHealth(100);
      msg = 'MEGA HEALTH';
    } else if (p.type === 'armor') {
      if (entity.armor >= 150) return;
      entity.addArmor(50);
      msg = '+50 ARMOR';
    } else if (p.type === 'rockets') {
      if (!isPlayer) return;
      if (entity.ammo.rocket >= 12) return;
      entity.ammo.rocket = Math.min(12, entity.ammo.rocket + 4);
      msg = '+4 ROCKETS';
    } else if (p.type === 'rails') {
      if (!isPlayer) return;
      if (entity.ammo.rail >= 10) return;
      entity.ammo.rail = Math.min(10, entity.ammo.rail + 3);
      msg = '+3 RAIL SLUGS';
    } else if (p.type === 'discs') {
      if (!isPlayer) return;
      if (entity.ammo.spin >= 10) return;
      entity.ammo.spin = Math.min(10, entity.ammo.spin + 3);
      msg = '+3 SPINFUSOR DISCS';
    } else if (p.type === 'quad') {
      if (!isPlayer) return;
      entity.quad = 30;
      msg = 'QUAD DAMAGE';
      this.hud.announce('QUAD DAMAGE', 'gold', 2400);
      this.hud.toast('QUAD DAMAGE — 4× OUTPUT FOR 30s');
      this.audio.quad();
      this.quadWasActive = true;
    }
    p.active = false;
    p.timer = p.respawn;
    p.group.visible = false;
    this.effects.burst(p.position.clone(), 16, {
      color: p.type === 'health' || p.type === 'mega' ? 0xff5c7a : p.type === 'quad' ? 0xffb02e : p.type === 'armor' ? 0x51ffb0 : 0x7de8ff,
      speed: 5, size: 0.2, life: 0.5, grav: 2
    });
    if (isPlayer) {
      this.audio[p.type === 'health' || p.type === 'mega' ? 'pickup' : p.type === 'armor' ? 'armor' : 'pickup']();
      this.hud.toast(msg);
      if (p.type !== 'quad') this.hud.hitmarker(false);
    }
  }

  // ---------------- match flow ----------------
  kill(victim, source, cause = 'fragged') {
    if (!victim.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.deaths++;
    victim.streak = 0;
    victim.quad = 0;
    if (victim.isPlayer) {
      victim.deathCause = cause;
      victim.killerName = source ? source.name : 'THE VOID';
      this.playerKills = [];
      this.respawnTimer = 3.0;
      this.deathCam = 0;
      this.hud.showRespawn(source ? source.name : null, cause);
      this.audio.death();
      this.hud.announce('YOU WERE FRIED', 'danger', 2000);
      this.viewModel.scene.visible = false;
      this.audio.setJet(false);
    } else {
      victim.model.visible = false;
      victim.respawnTimer = 3.2 + Math.random() * 1.2;
      victim.killerName = source ? source.name : 'THE VOID';
      this.effects.gibs(victim.position.clone().setY(victim.position.y + 1.1), victim.color, victim.velocity.clone().normalize());
      this.effects.explosion(victim.position.clone().setY(victim.position.y + 1.0), 0.8);
      this.audio.explosion(0.8);
    }

    let killerName = source ? source.name : 'THE VOID';
    if (source && source !== victim) {
      source.score++;
      source.streak++;
      source.bestStreak = Math.max(source.bestStreak || 0, source.streak);
      if (source.isPlayer) {
        this.hud.hitmarker(true);
        this.audio.hitKill();
        this.playerKills.push(this.time);
        this.playerKills = this.playerKills.filter(t => this.time - t < 4);
        const n = this.playerKills.length;
        if (n >= 2) {
          const names = ['', '', 'DOUBLE KILL', 'MULTI KILL', 'MEGA KILL', 'MONSTER KILL'];
          this.hud.announce(names[Math.min(5, n)], 'gold', 1700);
        }
        if (source.streak === 3) this.hud.announce('KILLING SPREE', '', 1800);
        if (source.streak === 5) this.hud.announce('RAMPAGE', 'gold', 1900);
        if (source.streak === 8) this.hud.announce('UNSTOPPABLE', 'gold', 2000);
      }
    } else if (source === victim) {
      victim.score = Math.max(0, victim.score - 1);
      killerName = victim.name;
    }

    if (this.firstBlood) {
      this.firstBlood = false;
      this.hud.announce('FIRST BLOOD', 'danger', 1600);
    }
    this.hud.killfeed(killerName, victim.name, cause, victim.quad > 0 || (source && source.quad > 0));

    // check frag limit
    const maxScore = Math.max(...this.combatants.map(e => e.score));
    if (maxScore >= this.fragLimit && !this.over) {
      this.endMatch(this.player.score >= this.fragLimit || this.player.score >= maxScore);
    }
  }

  endMatch(victory) {
    if (this.over) return;
    this.over = true;
    this.state = 'gameover';
    this.input.enabled = false;
    this.input.releaseLock();
    this.audio.setJet(false);
    this.audio.setIntensity(0.25);
    this.audio.matchEnd(victory);
    this.hud.setVisible(false);
    this.hud.hideRespawn();
    this.hud.toggleScoreboard(false);
    this.viewModel.scene.visible = false;
    this.hud.showGameOver(this, victory);
  }

  respawnPlayer() {
    // pick spawn farthest from living bots
    let best = this.world.spawnPoints[0], bestScore = -Infinity;
    for (const sp of this.world.spawnPoints) {
      let closest = Infinity;
      for (const b of this.bots) if (b.alive) closest = Math.min(closest, sp.pos.distanceTo(b.position));
      if (closest > bestScore) { bestScore = closest; best = sp; }
    }
    this.player.spawn(this.world, best);
    this.player.alive = true;
    this.player.protection = 1.8;
    this.respawnTimer = 0;
    this.deathCam = 0;
    this.viewModel.scene.visible = true;
    this.viewModel.show(0, true);
    this.hud.hideRespawn();
    this.effects.burst(this.player.position.clone().setY(this.player.position.y + 0.5), 28, {
      color: 0x66f0ff, speed: 6, size: 0.26, life: 0.8, grav: 1
    });
    this.audio.spawn();
    this.hud.announce('REDEPLOYED', '', 1400);
    if (!this.input.isTouch) this.hud.showPointerHint(!this.input.locked);
  }

  respawnBot(bot) {
    const player = this.player;
    const sorted = [...this.world.spawnPoints].sort((a, b) => b.pos.distanceTo(player.position) - a.pos.distanceTo(player.position));
    const sp = sorted[Math.floor(Math.random() * Math.min(5, sorted.length))];
    bot.spawn(this.world, sp);
    bot.tag.material.opacity = 0.9;
    this.spawnFlash(bot.position, bot.color);
  }

  // ---------------- frame ----------------
  frame(dt) {
    this.time += dt;
    if (this.state === 'playing') this.updatePlaying(dt);
    else if (this.state === 'paused') {
      // keep subtle ambience alive but freeze the simulation
    } else if (this.state === 'menu') {
      this.updateMenu(dt);
    } else if (this.state === 'gameover') {
      this.world.update(dt, this.time);
      this.effects.update(dt, this.time);
    }
    if (this.audio.ctx) this.audio.update();
    this.render();
    this.input.endFrame();
  }

  updateMenu(dt) {
    this.menuAngle += dt * 0.045;
    const a = this.menuAngle;
    const r = 36;
    this.camera.position.set(Math.cos(a) * r, 16 + Math.sin(this.time * 0.3) * 1.8, Math.sin(a) * r);
    this.camera.lookAt(0, 5.2, 0);
    this.camera.rotation.z = Math.sin(this.time * 0.2) * 0.01;
    this.world.update(dt, this.time);
    this.effects.update(dt, this.time);
    this.bots.forEach((b, i) => {
      if (!b.model.visible) return;
      b.model.position.y = 0.02 + Math.sin(this.time * 1.4 + i) * 0.02;
      b.bodyGroup.rotation.y = Math.sin(this.time * 0.7 + i) * 0.15;
      b.tag.material.opacity = 0;
    });
  }

  updatePlaying(dt) {
    // timers
    if (!this.over) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        const sorted = [...this.combatants].sort((a, b) => b.score - a.score);
        this.endMatch(sorted[0] && sorted[0].isPlayer);
        return;
      }
    }
    this.recoil = Math.max(0, this.recoil - dt * 5);
    this.shake = Math.max(0, this.shake - dt * 3.2);
    this.cameraKick = Math.max(0, (this.cameraKick || 0) - dt * 4);
    this.pointerHintTimer = Math.max(0, this.pointerHintTimer - dt);
    if (this.pointerHintTimer <= 0 && this.input.locked) this.hud.showPointerHint(false);

    if (this.player.alive) {
      this.player.update(dt, this.input, this.world, this, this.camera);
      // void death
      if (this.player.position.y < -20) this.kill(this.player, null, 'void');
    }
    // bots
    for (const b of this.bots) {
      if (b.alive) {
        b.update(dt, this);
      } else {
        b.respawnTimer -= dt;
        if (b.respawnTimer <= 0) this.respawnBot(b);
      }
    }
    // player respawn
    if (!this.player.alive) {
      this.respawnTimer -= dt;
      this.deathCam += dt;
      this.updateDeathCamera(dt);
      if (this.respawnTimer <= 0) this.respawnPlayer();
    }

    this.updateProjectiles(dt);
    this.world.update(dt, this.time);
    this.effects.update(dt, this.time);

    // quad expiry
    const quadNow = this.player.quad > 0;
    if (this.quadWasActive && !quadNow) {
      this.quadWasActive = false;
      this.hud.announce('QUAD EXPIRED', '', 1200);
    }

    // camera shake / recoil
    if (this.player.alive) {
      this.camera.rotation.x += (this.recoil * 0.008) + (this.cameraKick || 0) * 0.02;
      if (!this.reducedMotion) {
        this.camera.position.x += (Math.random() - 0.5) * this.shake * 0.06;
        this.camera.position.y += (Math.random() - 0.5) * this.shake * 0.06;
        this.camera.rotation.z += (Math.random() - 0.5) * this.shake * 0.008;
      }
    }

    // aim target + HUD
    this.aimTarget = this.findAimTarget();
    this.hud.update(dt, this);

    // scoreboard
    const showTab = this.input.isDown('Tab');
    if (showTab !== this.lastTab) {
      this.lastTab = showTab;
      this.hud.toggleScoreboard(showTab);
    }
    if (this.input.wasPressed('KeyM')) {
      this.audio.init();
      this.audio.setMuted(!this.audio.muted);
      this.hud.toast(this.audio.muted ? 'AUDIO MUTED' : 'AUDIO ONLINE');
      $('soundBtn').textContent = 'SOUND: ' + (this.audio.muted ? 'OFF' : 'ON');
      $('pauseSoundBtn').textContent = 'SOUND: ' + (this.audio.muted ? 'OFF' : 'ON');
    }
    if (this.input.wasPressed('KeyV')) {
      this.reducedMotion = !this.reducedMotion;
      this.hud.toast(this.reducedMotion ? 'REDUCED MOTION ON' : 'REDUCED MOTION OFF');
    }

    // pointer hint
    if (!this.input.isTouch && !this.input.locked && this.player.alive) {
      this.hud.showPointerHint(true);
    } else {
      this.hud.showPointerHint(false);
    }

    // viewmodel
    if (this.player.alive) {
      this.viewModel.scene.visible = true;
      this.viewModel.update(dt, {
        moving: Math.hypot(this.player.velocity.x, this.player.velocity.z) > 1 ? 1 : 0,
        grounded: this.player.grounded,
        speed: Math.hypot(this.player.velocity.x, this.player.velocity.z),
        lookX: this.player.lastLook.x,
        lookY: this.player.lastLook.y,
        time: this.time
      });
    } else {
      this.viewModel.scene.visible = false;
    }

    // music intensity
    this.audio.setIntensity(this.player.alive ? Math.min(1, 0.55 + this.player.streak * 0.05) : 0.35);
  }

  updateDeathCamera(dt) {
    const k = Math.min(1, this.deathCam * 1.6);
    const eye = this.player.eyePosition;
    this.camera.position.set(eye.x, eye.y - k * 1.1 + this.deathCam * 0.05, eye.z);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.player.yaw + Math.sin(this.deathCam * 0.8) * 0.15 * k;
    this.camera.rotation.x = this.player.pitch - k * 0.45;
    this.camera.rotation.z = k * 0.55;
  }

  findAimTarget() {
    if (!this.player.alive) return null;
    const origin = this.player.eyePosition;
    const dir = this.player.forward;
    const wall = this.world.raycast(origin, dir, 120);
    const maxT = wall ? wall.distance : 120;
    let best = null, bestT = maxT;
    for (const b of this.bots) {
      if (!b.alive) continue;
      const t = this.raySphere(origin, dir, this.entityCenter(b), 0.9);
      if (t !== null && t < bestT) { bestT = t; best = b; }
    }
    return best;
  }

  render() {
    const r = this.renderer;
    r.clear();
    r.render(this.scene, this.camera);
    if (this.viewModel.scene.visible && this.state === 'playing' && this.player.alive) {
      r.clearDepth();
      r.render(this.viewModel.scene, this.viewModel.camera);
    }
  }
}

const game = new Game();
window.__game = game;
let last = performance.now();
function loop(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
  dt = Math.min(dt, 0.05);
  try {
    game.frame(dt);
  } catch (error) {
    console.error(error);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
