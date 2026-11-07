import * as THREE from 'three';
import { moveBody } from './world.js';
import { nameTexture, glowTexture } from './textures.js';

const BOT_GLOW = glowTexture('rgba(255,255,255,1)', 'rgba(180,240,255,.55)', 'rgba(80,200,255,0)');

const BOT_DEFS = [
  { name: 'RANGER', color: 0x3fe9ff, trim: 0x0a7f9a, skill: 0.9, aggro: 0.8, rate: 1.18, spread: 0.035 },
  { name: 'VISOR', color: 0xff2e8a, trim: 0x8c1146, skill: 0.82, aggro: 1.0, rate: 1.32, spread: 0.045 },
  { name: 'KLESK', color: 0xffb02e, trim: 0x995c0a, skill: 0.76, aggro: 0.7, rate: 1.42, spread: 0.06 },
  { name: 'SARGE', color: 0x51ffb0, trim: 0x117a52, skill: 0.86, aggro: 0.9, rate: 1.26, spread: 0.04 },
];

let idCounter = 0;

function mat(color, metal = 0.75, rough = 0.4, emissive = 0x000000, ei = 0) {
  return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, emissive, emissiveIntensity: ei });
}

export class Bot {
  constructor(def, index) {
    this.id = ++idCounter;
    this.name = def.name;
    this.color = def.color;
    this.trim = def.trim;
    this.skill = def.skill;
    this.aggro = def.aggro;
    this.rate = def.rate;
    this.spread = def.spread;
    this.index = index;
    this.isPlayer = false;
    this.radius = 0.48;
    this.height = 2.0;
    this.eye = 1.7;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.yaw = Math.PI;
    this.health = 100;
    this.armor = 0;
    this.alive = false;
    this.grounded = false;
    this.fuel = 100;
    this.jetting = false;
    this.score = 0;
    this.deaths = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.protection = 0;
    this.quad = 0;
    this.fireTimer = 1 + Math.random();
    this.thinkTimer = Math.random() * 0.3;
    this.strafeTimer = 0;
    this.strafeDir = Math.random() > 0.5 ? 1 : -1;
    this.jetTimer = 0;
    this.jumpTimer = 0;
    this.target = null;
    this.lastKnown = new THREE.Vector3();
    this.wander = new THREE.Vector3();
    this.wanderTimer = 0;
    this.stuckTimer = 0;
    this.stuck = false;
    this.flash = 0;
    this.respawnTimer = 0;
    this.killerName = '';
    this.trailTimer = 0;
    this.aimError = new THREE.Vector3();
    this.aimTimer = 0;
    this.buildModel();
  }

  buildModel() {
    const col = this.color;
    const dark = mat(0x1a2030, 0.8, 0.45);
    const armor = mat(0x2a3247, 0.72, 0.42);
    const accent = mat(this.trim, 0.6, 0.4, this.trim, 0.35);
    const skin = mat(0x8d7b6a, 0.1, 0.85);
    const glow = new THREE.MeshBasicMaterial({ color: col });
    const glowSoft = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    this.mats = [dark, armor, accent, skin];

    const g = new THREE.Group();
    this.model = g;
    const body = new THREE.Group();
    g.add(body);
    this.bodyGroup = body;

    // legs
    this.legs = [];
    for (const s of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(s * 0.19, 0.94, 0);
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 0.26), armor);
      thigh.position.y = -0.22; thigh.castShadow = true;
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.48, 0.22), dark);
      shin.position.y = -0.68; shin.castShadow = true;
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.16, 0.38), accent);
      boot.position.set(0, -0.94, 0.05); boot.castShadow = true;
      const knee = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.24), glow);
      knee.position.set(0, -0.48, 0.02);
      leg.add(thigh, shin, boot, knee);
      body.add(leg);
      this.legs.push(leg);
    }

    // torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.72, 0.4), armor);
    torso.position.y = 1.34; torso.castShadow = true;
    body.add(torso);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.34, 0.1), accent);
    chest.position.set(0, 1.42, 0.24);
    body.add(chest);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.14, 0.34), dark);
    belt.position.y = 0.98;
    body.add(belt);
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.06), glow);
    core.position.set(0, 1.48, 0.3);
    body.add(core);

    // head
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.2), dark);
    neck.position.y = 1.74;
    body.add(neck);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.34, 0.36), armor);
    head.position.y = 1.98; head.castShadow = true;
    body.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.06), glow);
    visor.position.set(0, 2.0, 0.19);
    body.add(visor);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.3), accent);
    crest.position.set(0, 2.18, -0.02);
    body.add(crest);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 5), glow);
    antenna.position.set(-0.14, 2.3, -0.1); antenna.rotation.z = 0.2;
    body.add(antenna);

    // shoulders + arms
    this.arms = [];
    for (const s of [-1, 1]) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.34), accent);
      shoulder.position.set(s * 0.46, 1.58, 0);
      shoulder.castShadow = true;
      body.add(shoulder);
      const arm = new THREE.Group();
      arm.position.set(s * 0.46, 1.5, 0);
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.42, 0.18), dark);
      upper.position.y = -0.24; upper.castShadow = true;
      const fore = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.36, 0.16), armor);
      fore.position.set(0, -0.58, 0.03);
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.14), glow);
      hand.position.set(0, -0.78, 0.05);
      arm.add(upper, fore, hand);
      body.add(arm);
      this.arms.push(arm);
    }

    // jetpack
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.24), dark);
    pack.position.set(0, 1.38, -0.3); pack.castShadow = true;
    body.add(pack);
    this.nozzles = [];
    for (const s of [-1, 1]) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.5, 8), armor);
      tank.position.set(s * 0.18, 1.38, -0.42);
      body.add(tank);
      const noz = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 8), dark);
      noz.position.set(s * 0.18, 1.06, -0.42);
      noz.rotation.x = Math.PI;
      body.add(noz);
      this.nozzles.push(noz);
      const flame = new THREE.Sprite(new THREE.SpriteMaterial({
        map: BOT_GLOW, color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      flame.position.set(s * 0.18, 0.96, -0.42);
      flame.scale.setScalar(0.5);
      body.add(flame);
      this[`flame${s > 0 ? 'R' : 'L'}`] = flame;
    }

    // weapon (held to the right)
    const weapon = new THREE.Group();
    weapon.position.set(0.38, 1.28, 0.2);
    weapon.rotation.set(0.05, 0, 0);
    const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.62), dark);
    gunBody.position.z = 0.16;
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.44, 8), armor);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 0.58;
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 5, 12), glow);
    coil.position.z = 0.45;
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 16), glowSoft);
    disc.rotation.x = Math.PI / 2;
    disc.position.z = 0.62;
    weapon.add(gunBody, barrel, coil, disc);
    body.add(weapon);
    this.weaponModel = weapon;
    this.weaponGlow = disc;

    // name tag
    const tex = nameTexture(this.name, '#' + this.color.toString(16).padStart(6, '0'));
    this.tag = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0.9, depthWrite: false
    }));
    this.tag.position.y = 2.72;
    this.tag.scale.set(2.3, 0.575, 1);
    g.add(this.tag);

    // team light aura
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({
      map: BOT_GLOW, color: col, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    aura.position.y = 1.2;
    aura.scale.setScalar(2.4);
    g.add(aura);
    this.aura = aura;

    // hit sphere marker (invisible-ish white flash sphere)
    const flash = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 8), new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    flash.position.y = 1.2;
    flash.scale.set(0.7, 1.2, 0.7);
    g.add(flash);
    this.flashMesh = flash;

    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.visible = false;
    this.scene = null;
  }

  addTo(scene) {
    if (!this.scene) { this.scene = scene; scene.add(this.model); }
  }

  spawn(world, spawn) {
    const s = spawn || world.spawnPoints[Math.floor(Math.random() * world.spawnPoints.length)];
    this.position.copy(s.pos);
    this.position.x += (Math.random() - 0.5) * 1.2;
    this.position.z += (Math.random() - 0.5) * 1.2;
    this.velocity.set(0, 0, 0);
    this.health = 100;
    this.armor = 0;
    this.alive = true;
    this.fuel = 100;
    this.protection = 1.5;
    this.target = null;
    this.fireTimer = 0.8 + Math.random() * 0.8;
    this.thinkTimer = 0.1;
    this.wanderTimer = 0;
    this.jetTimer = 0;
    this.streak = 0;
    this.killerName = '';
    this.model.visible = true;
    this.model.position.copy(this.position);
    this.yaw = s.yaw;
    this.model.rotation.y = this.yaw;
  }

  get eyePosition() {
    return new THREE.Vector3(this.position.x, this.position.y + this.eye, this.position.z);
  }

  get center() {
    return new THREE.Vector3(this.position.x, this.position.y + 1.0, this.position.z);
  }

  hurt(amount, source, game, cause = 'fragged') {
    if (!this.alive || this.protection > 0) return;
    this.health -= amount;
    this.flash = 1;
    this.flashMesh.material.opacity = 0.35;
    if (this.health <= 0) {
      this.health = 0;
      game.kill(this, source, cause);
    }
  }

  update(dt, game) {
    if (!this.alive) return;
    const world = game.world;
    this.protection = Math.max(0, this.protection - dt);
    this.fireTimer -= dt;
    this.thinkTimer -= dt;
    this.strafeTimer -= dt;
    this.wanderTimer -= dt;
    this.jetTimer = Math.max(0, this.jetTimer - dt);
    this.jumpTimer -= dt;
    this.flash = Math.max(0, this.flash - dt * 5);
    this.flashMesh.material.opacity = this.flash * 0.3;
    this.aimTimer -= dt;

    // ---------- targeting ----------
    if (this.thinkTimer <= 0) {
      this.thinkTimer = 0.35 + Math.random() * 0.3;
      const candidates = game.combatants.filter(e => e !== this && e.alive);
      let best = null, bestScore = -Infinity;
      const eye = this.eyePosition;
      for (const c of candidates) {
        const d = c.position.distanceTo(this.position);
        if (d > 62) continue;
        let score = 30 - d * 0.3;
        if (c.isPlayer) score += 7; // player draws attention, keeps action centered
        const visible = !world.segmentBlocked(eye, c.eyePosition);
        if (visible) score += 26;
        if (c === this.target) score += 8;
        if (c.health < 40) score += 5;
        if (score > bestScore) { bestScore = score; best = c; }
      }
      this.target = best;
      if (best && (!world.segmentBlocked(this.eyePosition, best.eyePosition))) {
        this.lastKnown.copy(best.position);
      }
    }

    const t = this.target;
    const tDist = t ? this.position.distanceTo(t.position) : 0;
    const canSee = t && t.alive && !world.segmentBlocked(this.eyePosition, t.eyePosition) && tDist < 62;

    // ---------- choose movement intention ----------
    let wishX = 0, wishZ = 0;
    let wishSpeed = 8.4;
    let wantJet = false;
    let wantJump = false;

    if (t && t.alive) {
      const dx = t.position.x - this.position.x;
      const dz = t.position.z - this.position.z;
      const dist = Math.hypot(dx, dz) || 0.001;
      const nx = dx / dist, nz = dz / dist;
      const ideal = 13 + (1 - this.skill) * 8;
      let forwardAmt = 0;
      if (dist > ideal + 5) forwardAmt = 1;
      else if (dist < ideal - 4) forwardAmt = -0.9;
      else forwardAmt = 0.05;

      if (this.strafeTimer <= 0) {
        this.strafeTimer = 0.7 + Math.random() * 1.1;
        this.strafeDir *= -1;
        if (Math.random() < 0.35) this.strafeDir = 0;
      }
      const strafe = canSee ? this.strafeDir * 0.85 : 0;
      wishX = nx * forwardAmt - nz * strafe;
      wishZ = nz * forwardAmt + nx * strafe;

      // elevation / jet use
      const dy = t.position.y - this.position.y;
      if ((dy > 2.2 && dist > 6) || (this.stuck && canSee)) wantJet = true;
      if (canSee && Math.random() < dt * (0.22 + this.aggro * 0.3)) wantJet = true;
      // retreat with jets when badly hurt
      if (this.health < 32 && Math.random() < dt * 0.5) wantJet = true;
      // hop while strafing
      if (this.grounded && Math.random() < dt * 0.5) wantJump = true;
      if (this.grounded && dist > 23 && Math.random() < dt * 0.7) wantJet = true;
    } else {
      // wander
      if (this.wanderTimer <= 0 || this.position.distanceTo(this.wander) < 2.5) {
        const pts = world.navPoints;
        this.wander.copy(pts[Math.floor(Math.random() * pts.length)]);
        this.wanderTimer = 5 + Math.random() * 4;
      }
      const dx = this.wander.x - this.position.x;
      const dz = this.wander.z - this.position.z;
      const d = Math.hypot(dx, dz) || 1;
      wishX = dx / d; wishZ = dz / d;
      if (this.wander.y > this.position.y + 1.5) wantJet = true;
      if (this.grounded && Math.random() < dt * 0.2) wantJet = true;
    }

    // separation from other bots
    for (const b of game.bots) {
      if (b === this || !b.alive) continue;
      const dx = this.position.x - b.position.x;
      const dz = this.position.z - b.position.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < 9 && d2 > 0.001) {
        const d = Math.sqrt(d2);
        wishX += (dx / d) * (1.4 - d * 0.12);
        wishZ += (dz / d) * (1.4 - d * 0.12);
      }
    }

    const wl = Math.hypot(wishX, wishZ);
    if (wl > 1) { wishX /= wl; wishZ /= wl; }
    const accel = this.grounded ? 34 : 24;
    this.velocity.x += wishX * accel * dt;
    this.velocity.z += wishZ * accel * dt;
    const hs = Math.hypot(this.velocity.x, this.velocity.z);
    const cap = 8.8;
    if (hs > cap) {
      const k = Math.max(cap, hs - 24 * dt) / hs;
      this.velocity.x *= k; this.velocity.z *= k;
    }
    if (this.grounded && wl < 0.1) {
      this.velocity.x *= Math.max(0, 1 - 8 * dt);
      this.velocity.z *= Math.max(0, 1 - 8 * dt);
    }

    if (wantJump && this.grounded && this.jumpTimer <= 0) {
      this.velocity.y = 9.5;
      this.grounded = false;
      this.jumpTimer = 1.1 + Math.random();
      this.jetTimer = 0.3;
    }
    this.jetting = false;
    if ((wantJet || this.jetTimer > 0) && !this.grounded && this.fuel > 0.5) {
      this.velocity.y += 40 * dt;
      if (this.velocity.y > 7.6) this.velocity.y = 7.6;
      this.fuel -= 25 * dt;
      this.jetting = true;
      this.trailTimer -= dt;
      if (this.trailTimer <= 0) {
        this.trailTimer = 0.045;
        const p = this.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.5, 0.9, (Math.random() - 0.5) * 0.5));
        game.effects.jet(p, new THREE.Vector3(0, -1, 0), Math.random() > 0.4 ? this.color : 0xffa040);
      }
    }
    if (this.grounded) this.fuel = Math.min(100, this.fuel + 22 * dt);

    // stuck detection
    const beforeX = this.position.x, beforeZ = this.position.z;
    moveBody(this, world, dt, { stepHeight: 0.7, gravity: 26 });
    if (wl > 0.3) {
      const moved = Math.hypot(this.position.x - beforeX, this.position.z - beforeZ);
      if (moved < 0.15 * dt * 60 * 0.016) {
        this.stuckTimer += dt;
        if (this.stuckTimer > 0.35) {
          this.stuck = true;
          this.jetTimer = 0.5;
          this.strafeDir *= -1;
          this.stuckTimer = 0;
        }
      } else {
        this.stuckTimer = Math.max(0, this.stuckTimer - dt);
        this.stuck = false;
      }
    }

    if (this.position.y < -20) {
      game.kill(this, null, 'void');
      return;
    }

    // pickups (health / armor only; ammo irrelevant for bots)
    for (const p of world.pickups) {
      if (!p.active) continue;
      if (p.type === 'quad') continue;
      const dx = p.position.x - this.position.x;
      const dz = p.position.z - this.position.z;
      const dy = p.position.y - (this.position.y + 1.0);
      if (dx * dx + dz * dz < 2.3 * 2.3 && Math.abs(dy) < 2.2) game.collectPickup(p, this);
    }

    // ---------- shoot ----------
    if (t && t.alive && canSee && this.fireTimer <= 0 && tDist < 52 && this.protection < 0.1) {
      const aim = this.aimAt(t, tDist);
      const angleOk = true;
      if (angleOk) {
        game.botFire(this, aim, tDist);
        this.fireTimer = this.rate * (0.85 + Math.random() * 0.4);
        // recoil lean
        this.model.position.z -= 0.02;
      }
    }

    // ---------- animate / orient ----------
    const desiredYaw = t && t.alive && tDist < 55
      ? Math.atan2(-(t.position.x - this.position.x), -(t.position.z - this.position.z))
      : (hs > 0.5 ? Math.atan2(-this.velocity.x, -this.velocity.z) : this.yaw);
    let dy = desiredYaw - this.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * Math.min(1, dt * 7);
    this.model.rotation.y = this.yaw;
    this.model.position.copy(this.position);

    const walk = Math.min(1, hs / 7);
    const swing = Math.sin(game.time * 9 + this.id) * walk;
    this.legs[0].rotation.x = swing * 0.6;
    this.legs[1].rotation.x = -swing * 0.6;
    this.arms[0].rotation.x = -swing * 0.25;
    this.arms[1].rotation.x = swing * 0.25 - 0.15;
    this.bodyGroup.position.y = Math.abs(Math.cos(game.time * 9 + this.id)) * 0.04 * walk;
    this.bodyGroup.rotation.x = THREE.MathUtils.lerp(this.bodyGroup.rotation.x, this.jetting ? 0.22 : walk * 0.06, Math.min(1, dt * 5));
    this.bodyGroup.rotation.z = this.jetting ? Math.sin(game.time * 6) * 0.05 : 0;

    // jet flames
    const flameScale = this.jetting ? 0.55 + Math.random() * 0.35 : 0;
    for (const f of [this.flameL, this.flameR]) {
      f.material.opacity = this.jetting ? 0.85 : 0;
      f.scale.setScalar(flameScale);
    }
    // tag fade with distance
    if (game.player) {
      const d = this.position.distanceTo(game.player.position);
      this.tag.material.opacity = THREE.MathUtils.clamp(1.4 - d / 55, 0, 0.95);
      this.tag.scale.set(2.0 + d * 0.012, (2.0 + d * 0.012) * 0.25, 1);
    }
    this.aura.material.opacity = 0.14 + (this.protection > 0 ? 0.3 : 0) + Math.sin(game.time * 3 + this.id) * 0.05;
    this.weaponGlow.rotation.z += dt * 8;
    if (this.aimTimer <= 0) {
      this.aimTimer = 0.2;
      this.aimError.set((Math.random() - 0.5) * this.spread, (Math.random() - 0.5) * this.spread * 0.6, (Math.random() - 0.5) * this.spread);
    }
  }

  aimAt(target, dist) {
    const eye = this.eyePosition;
    const tp = target.eyePosition;
    const speed = 40;
    const lead = Math.min(0.75, dist / speed);
    const predicted = tp.clone().addScaledVector(target.velocity, lead * 0.85);
    // gravity compensation for projectile arc
    predicted.y += 0.5 * 3.4 * (dist / speed) * (dist / speed);
    const dir = predicted.sub(eye).normalize();
    const err = 0.02 + (1 - this.skill) * 0.05 + dist * 0.0009;
    dir.x += (Math.random() - 0.5) * err * 2;
    dir.y += (Math.random() - 0.5) * err;
    dir.z += (Math.random() - 0.5) * err * 2;
    return dir.normalize();
  }

  addHealth(n) {
    this.health = Math.min(125, this.health + n);
  }
  addArmor(n) {
    this.armor = Math.min(75, this.armor + n);
  }

  resetScores() {
    this.score = 0; this.deaths = 0; this.streak = 0; this.bestStreak = 0; this.quad = 0;
  }
}

export function createBots(scene) {
  return BOT_DEFS.map((d, i) => {
    const b = new Bot(d, i);
    b.addTo(scene);
    return b;
  });
}
