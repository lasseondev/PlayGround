import * as THREE from 'three';
import { clamp, damp, rand, angleLerp, easeOutCubic, glowTex, makeSprite, worldUVBox } from './util.js';

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

export class EnemyManager {
  constructor(scene, world, effects, audio, game) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.shades = [];
    this.watchers = [];
    this.projectiles = [];
    this.boss = new Boss(scene, world, effects, audio, game);
  }

  spawnShade(x, z) {
    const s = new Shade(this.scene, this.world, this.effects, this.audio, this.game, x, z);
    this.shades.push(s);
    return s;
  }

  spawnWatcher(x, z) {
    const w = new Watcher(this.scene, this.world, this.effects, this.audio, this.game, x, z);
    this.watchers.push(w);
    return w;
  }

  spawnOrb(x, z, y, target, color = 0xffa45e) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.2, roughness: 0.3 });
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.23, 1), mat);
    group.add(orb);
    const glow = makeSprite(glowTex(), color, 0.75);
    glow.scale.set(1.35, 1.35, 1);
    group.add(glow);
    const light = new THREE.PointLight(color, 3, 4, 2);
    group.add(light);
    group.position.set(x, y, z);
    this.scene.add(group);
    const dx = target.x - x, dz = target.z - z;
    const len = Math.hypot(dx, dz) || 1;
    this.projectiles.push({
      group, orb, glow, light, alive: true,
      vx: (dx / len) * 7.2, vz: (dz / len) * 7.2,
      x, z, y, life: 4.5, radius: 0.32,
    });
  }

  update(dt, player) {
    for (const s of this.shades) s.update(dt, player);
    for (const w of this.watchers) w.update(dt, player);
    this.updateProjectiles(dt, player);
    this.boss.update(dt, player);

    for (let i = this.shades.length - 1; i >= 0; i--) {
      if (this.shades[i].removed) this.shades.splice(i, 1);
    }
    for (let i = this.watchers.length - 1; i >= 0; i--) {
      if (this.watchers[i].removed) this.watchers.splice(i, 1);
    }
  }

  updateProjectiles(dt, player) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.group.position.set(p.x, p.y + Math.sin(p.life * 9) * 0.06, p.z);
      p.orb.rotation.x += dt * 6;
      p.orb.rotation.y += dt * 5;
      p.glow.material.opacity = 0.6 + Math.sin(p.life * 18) * 0.18;
      if (Math.random() < 0.5) this.effects.ember({ x: p.x, y: p.y, z: p.z }, 0xffa45e);
      const temp = { x: p.x, z: p.z };
      if (this.world.resolveCircle(temp, p.radius)) {
        p.x = temp.x; p.z = temp.z;
        this.destroyProjectile(p, i);
        continue;
      }
      const dx = player.pos.x - p.x, dz = player.pos.z - p.z;
      if (dx * dx + dz * dz < 0.78 * 0.78) {
        this.game.damagePlayer(1, { x: p.x, z: p.z });
        this.effects.impact({ x: p.x, y: p.y, z: p.z }, 0xffa45e, 10);
        this.destroyProjectile(p, i);
        continue;
      }
      if (p.life <= 0) this.destroyProjectile(p, i);
    }
  }

  destroyProjectile(p, index) {
    this.scene.remove(p.group);
    p.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    this.projectiles.splice(index, 1);
  }

  nearestEnemy(pos, maxDist = 99) {
    let best = null;
    let bestD = maxDist * maxDist;
    for (const s of this.shades) {
      if (s.dead) continue;
      const d = (s.pos.x - pos.x) ** 2 + (s.pos.z - pos.z) ** 2;
      if (d < bestD) { bestD = d; best = { x: s.pos.x, z: s.pos.z, ref: s, boss: false }; }
    }
    for (const w of this.watchers) {
      if (w.dead) continue;
      const d = (w.pos.x - pos.x) ** 2 + (w.pos.z - pos.z) ** 2;
      if (d < bestD) { bestD = d; best = { x: w.pos.x, z: w.pos.z, ref: w, boss: false }; }
    }
    if (this.boss.active && !this.boss.dead && !this.boss.dying) {
      const d = (this.boss.pos.x - pos.x) ** 2 + (this.boss.pos.z - pos.z) ** 2;
      if (d < bestD) best = { x: this.boss.pos.x, z: this.boss.pos.z, ref: this.boss, boss: true };
    }
    return best;
  }

  hitArc(origin, yaw, range, arc, damage, playerPos) {
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
    const cosArc = Math.cos(arc);
    let hits = 0;
    for (const s of this.shades) {
      if (s.dead) continue;
      const dx = s.pos.x - origin.x, dz = s.pos.z - origin.z;
      const dist = Math.hypot(dx, dz);
      if (dist > range + 0.55) continue;
      const dot = dist < 0.01 ? 1 : (dx / dist) * fx + (dz / dist) * fz;
      if (dot < cosArc) continue;
      s.hit(damage, origin);
      hits++;
    }
    for (const w of this.watchers) {
      if (w.dead) continue;
      const dx = w.pos.x - origin.x, dz = w.pos.z - origin.z;
      const dist = Math.hypot(dx, dz);
      if (dist > range + 0.5) continue;
      const dot = dist < 0.01 ? 1 : (dx / dist) * fx + (dz / dist) * fz;
      if (dot < cosArc) continue;
      w.hit(damage, origin);
      hits++;
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const dx = p.x - origin.x, dz = p.z - origin.z;
      const dist = Math.hypot(dx, dz);
      if (dist > range) continue;
      const dot = dist < 0.01 ? 1 : (dx / dist) * fx + (dz / dist) * fz;
      if (dot < cosArc) continue;
      this.effects.impact({ x: p.x, y: p.y, z: p.z }, 0xffe0a0, 12);
      this.destroyProjectile(p, i);
      hits++;
    }
    const bossResult = this.boss.tryHit(origin, yaw, range, arc, damage, playerPos);
    if (bossResult) hits++;
    return hits;
  }

  aliveCount() {
    return this.shades.filter((s) => !s.dead).length + this.watchers.filter((w) => !w.dead).length;
  }

  clearArena() {
    for (const s of this.shades) s.forceRemove();
    for (const w of this.watchers) w.forceRemove();
    for (let i = this.projectiles.length - 1; i >= 0; i--) this.destroyProjectile(this.projectiles[i], i);
    this.shades.length = 0;
    this.watchers.length = 0;
  }

  resetBoss() {
    this.boss.reset();
  }
}

/* =============================================================== shade */

class Shade {
  constructor(scene, world, effects, audio, game, x, z) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.pos = new THREE.Vector3(x, 0, z);
    this.spawn = this.pos.clone();
    this.hp = 3;
    this.maxHp = 3;
    this.dead = false;
    this.removed = false;
    this.deadT = 0;
    this.state = 'chase';
    this.cooldown = rand(0.4, 1.2);
    this.windup = 0;
    this.lungeT = 0;
    this.recover = 0;
    this.flash = 0;
    this.bobPhase = rand(0, 6.2);
    this.hitCooldown = 0;
    this.lungeDir = new THREE.Vector3();
    this.lunged = false;
    this.build();
  }

  build() {
    this.group = new THREE.Group();
    this.group.position.copy(this.pos);
    this.scene.add(this.group);
    this.body = new THREE.Group();
    this.group.add(this.body);

    this.cloakMat = new THREE.MeshStandardMaterial({
      color: 0x241b36, roughness: 0.9, metalness: 0.05,
      emissive: 0x0b0714, emissiveIntensity: 1,
    });
    const cloak = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.5, 7), this.cloakMat);
    cloak.position.y = 0.78;
    cloak.castShadow = true;
    this.body.add(cloak);

    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.34, 7, 6), this.cloakMat);
    hood.position.y = 1.48;
    hood.scale.set(1, 1.08, 0.9);
    hood.castShadow = true;
    this.body.add(hood);

    const voidMat = new THREE.MeshBasicMaterial({ color: 0x08060c });
    const voidFace = new THREE.Mesh(new THREE.SphereGeometry(0.21, 7, 6), voidMat);
    voidFace.position.set(0, 1.49, -0.22);
    this.body.add(voidFace);

    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0xff5d78 });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 5, 4), this.eyeMat);
      eye.position.set(side * 0.085, 1.52, -0.39);
      this.body.add(eye);
    }

    this.eyes = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.62, 3, 6), this.cloakMat);
      arm.position.set(side * 0.52, 0.82, -0.08);
      arm.rotation.z = side * 0.35;
      arm.rotation.x = -0.3;
      arm.castShadow = true;
      this.body.add(arm);
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 4), this.cloakMat);
      claw.position.set(side * 0.66, 0.44, -0.22);
      claw.rotation.z = side * 0.2;
      claw.rotation.x = Math.PI;
      this.body.add(claw);
    }

    const stripMat = this.cloakMat;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const strip = new THREE.Mesh(new THREE.ConeGeometry(0.09, rand(0.35, 0.6), 4), stripMat);
      strip.position.set(Math.cos(a) * 0.45, 0.12, Math.sin(a) * 0.45);
      strip.rotation.x = Math.PI;
      strip.rotation.z = rand(-0.2, 0.2);
      this.body.add(strip);
    }

    this.glow = makeSprite(glowTex(), 0x8f63ff, 0.22);
    this.glow.scale.set(2.2, 2.2, 1);
    this.glow.position.y = 1.1;
    this.body.add(this.glow);

    this.eyesGlow = makeSprite(glowTex(), 0xff5d78, 0.4);
    this.eyesGlow.scale.set(0.6, 0.6, 1);
    this.eyesGlow.position.set(0, 1.52, -0.35);
    this.body.add(this.eyesGlow);
  }

  update(dt, player) {
    if (this.dead) {
      this.deadT += dt;
      this.group.scale.multiplyScalar(1 - dt * 1.6);
      this.group.rotation.y += dt * 5;
      this.group.position.y += dt * 1.4;
      this.eyesGlow.material.opacity = Math.max(0, 0.4 - this.deadT);
      if (this.deadT > 0.6) {
        this.group.visible = false;
        this.removed = true;
      }
      return;
    }
    this.cooldown -= dt;
    this.hitCooldown = Math.max(0, this.hitCooldown - dt);
    this.flash = Math.max(0, this.flash - dt);
    const t = performance.now() * 0.001 + this.bobPhase;
    const dx = player.pos.x - this.pos.x, dz = player.pos.z - this.pos.z;
    const dist = Math.hypot(dx, dz);
    const targetYaw = Math.atan2(-dx, -dz);

    if (this.state === 'chase') {
      if (dist > 2.1) {
        const sp = 3.15;
        this.world.moveCircle(this.pos, (dx / dist) * sp * dt, (dz / dist) * sp * dt, 0.5);
        this.group.rotation.y = angleLerp(this.group.rotation.y, targetYaw, 1 - Math.exp(-8 * dt));
      }
      if (dist < 2.55 && this.cooldown <= 0) {
        this.state = 'windup';
        this.windup = 0.5;
        this.cooldown = 1.2;
        this.audio.noise({ dur: 0.2, gain: 0.04, f0: 900, f1: 300, type: 'bandpass', send: 0.3 });
      }
    } else if (this.state === 'windup') {
      this.windup -= dt;
      this.group.rotation.y = angleLerp(this.group.rotation.y, targetYaw, 1 - Math.exp(-14 * dt));
      this.body.position.y = Math.sin((0.5 - this.windup) * 28) * 0.04;
      this.eyeMat.color.setRGB(1, 0.2, 0.25);
      this.eyesGlow.scale.setScalar(0.6 + (0.5 - this.windup) * 1.2);
      if (this.windup <= 0) {
        this.state = 'lunge';
        this.lungeT = 0.22;
        this.lunged = false;
        this.lungeDir.set(dx / (dist || 1), 0, dz / (dist || 1));
        this.audio.noise({ dur: 0.25, gain: 0.07, f0: 400, f1: 1200, type: 'bandpass', send: 0.25 });
      }
    } else if (this.state === 'lunge') {
      this.lungeT -= dt;
      this.world.moveCircle(this.pos, this.lungeDir.x * 9.5 * dt, this.lungeDir.z * 9.5 * dt, 0.5);
      if (!this.lunged) {
        const d2x = player.pos.x - this.pos.x, d2z = player.pos.z - this.pos.z;
        if (Math.hypot(d2x, d2z) < 1.25) {
          this.lunged = true;
          this.game.damagePlayer(1, { x: this.pos.x, z: this.pos.z });
          this.effects.slash({ x: this.pos.x, y: 0.3, z: this.pos.z }, targetYaw, '#ff6a86');
        }
      }
      if (this.lungeT <= 0) {
        this.state = 'recover';
        this.recover = 0.65;
      }
    } else if (this.state === 'recover') {
      this.recover -= dt;
      this.body.position.y = 0;
      if (this.recover <= 0) {
        this.state = 'chase';
        this.eyeMat.color.setHex(0xff5d78);
        this.eyesGlow.scale.set(0.6, 0.6, 1);
      }
    }

    this.group.position.x = this.pos.x;
    this.group.position.z = this.pos.z;
    this.group.position.y = Math.sin(t * 2.2) * 0.14 + 0.15;
    this.body.rotation.x = this.state === 'windup' ? -0.28 : this.state === 'lunge' ? 0.45 : Math.sin(t * 1.7) * 0.04;
    this.glow.material.opacity = 0.18 + Math.sin(t * 3) * 0.06;
    this.eyesGlow.material.opacity = 0.3 + Math.sin(t * 5) * 0.12;

    if (this.flash > 0) {
      this.cloakMat.emissive.setRGB(this.flash * 1.6, this.flash * 1.6, this.flash * 1.8);
      this.cloakMat.emissiveIntensity = 1;
    } else {
      this.cloakMat.emissive.setHex(0x0b0714);
    }
  }

  hit(damage, from) {
    if (this.dead) return;
    this.hp -= damage;
    this.flash = 0.16;
    const dx = this.pos.x - from.x, dz = this.pos.z - from.z;
    const len = Math.hypot(dx, dz) || 1;
    this.world.moveCircle(this.pos, (dx / len) * 0.55, (dz / len) * 0.55, 0.5);
    this.effects.impact({ x: this.pos.x, y: 1.0, z: this.pos.z }, 0xcf9dff, 10);
    this.audio.hit();
    this.game.shake(0.08);
    if (this.hp <= 0) {
      this.dead = true;
      this.deadT = 0;
      this.effects.soul({ x: this.pos.x, y: 1.2, z: this.pos.z }, 0xa97dff);
      this.audio.tone({ type: 'sawtooth', f0: 220, f1: 60, dur: 0.5, gain: 0.06, filter: 800, send: 0.4 });
      this.game.onEnemyKilled(this);
    }
  }

  forceRemove() {
    this.scene.remove(this.group);
    this.removed = true;
    this.dead = true;
  }
}

/* ============================================================= watcher */

class Watcher {
  constructor(scene, world, effects, audio, game, x, z) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.pos = new THREE.Vector3(x, 0, z);
    this.hp = 3;
    this.maxHp = 3;
    this.dead = false;
    this.removed = false;
    this.deadT = 0;
    this.flash = 0;
    this.fireCd = rand(1.2, 2.4);
    this.charge = 0;
    this.bob = rand(0, 6.2);
    this.build();
  }

  build() {
    this.group = new THREE.Group();
    this.group.position.set(this.pos.x, 2.15, this.pos.z);
    this.scene.add(this.group);
    this.body = new THREE.Group();
    this.group.add(this.body);

    this.stoneMat = new THREE.MeshStandardMaterial({
      color: 0x6e6357, roughness: 0.8, metalness: 0.25,
      emissive: 0x1c0e03, emissiveIntensity: 1,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), this.stoneMat);
    core.castShadow = true;
    this.body.add(core);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffb45c }));
    iris.position.z = -0.32;
    this.body.add(iris);
    this.irisMat = iris.material;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 6), new THREE.MeshBasicMaterial({ color: 0x1a0803 }));
    pupil.position.z = -0.48;
    this.body.add(pupil);
    this.ringMat = new THREE.MeshStandardMaterial({ color: 0x8c6a33, metalness: 0.9, roughness: 0.3, emissive: 0x2a1804, emissiveIntensity: 1 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.055, 6, 36), this.ringMat);
    ring.rotation.x = 0.35;
    this.ring = ring;
    this.body.add(ring);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), this.stoneMat);
      spike.position.set(Math.cos(a) * 0.6, Math.sin(a) * 0.25, Math.sin(a) * 0.5);
      spike.rotation.z = -a;
      this.body.add(spike);
    }
    this.glow = makeSprite(glowTex(), 0xffa45e, 0.5);
    this.glow.scale.set(2.1, 2.1, 1);
    this.glow.position.z = -0.1;
    this.body.add(this.glow);
    this.telegraph = makeSprite(glowTex(), 0xff6a3c, 0);
    this.telegraph.scale.set(1.2, 1.2, 1);
    this.telegraph.position.z = -0.5;
    this.body.add(this.telegraph);
  }

  update(dt, player) {
    if (this.dead) {
      this.deadT += dt;
      this.group.position.y -= dt * 5.5;
      this.group.rotation.z += dt * 3;
      this.group.rotation.x += dt * 2;
      this.group.scale.multiplyScalar(1 - dt * 1.1);
      if (this.deadT > 0.8) {
        this.group.visible = false;
        this.removed = true;
      }
      return;
    }
    const t = performance.now() * 0.001 + this.bob;
    this.flash = Math.max(0, this.flash - dt);
    const dx = player.pos.x - this.pos.x, dz = player.pos.z - this.pos.z;
    const dist = Math.hypot(dx, dz);
    this.group.rotation.y = angleLerp(this.group.rotation.y, Math.atan2(-dx, -dz), 1 - Math.exp(-6 * dt));
    this.group.position.y = 2.15 + Math.sin(t * 1.8) * 0.13;
    this.ring.rotation.z += dt * 1.1;
    this.ring.rotation.x = 0.35 + Math.sin(t * 1.3) * 0.15;
    this.glow.material.opacity = 0.38 + Math.sin(t * 4) * 0.1;

    if (dist < 22) {
      this.fireCd -= dt;
      if (this.charge > 0) {
        this.charge -= dt;
        this.irisMat.color.setRGB(1, 0.35 + Math.sin(t * 30) * 0.2, 0.15);
        this.telegraph.material.opacity = 0.35 + Math.sin(t * 24) * 0.2;
        this.telegraph.scale.setScalar(1.2 + (0.65 - this.charge) * 1.8);
        if (this.charge <= 0) {
          this.managerSpawn(player);
          this.fireCd = rand(2.3, 3.4);
          this.telegraph.material.opacity = 0;
        }
      } else if (this.fireCd <= 0) {
        this.charge = 0.65;
        this.audio.tone({ type: 'sine', f0: 300, f1: 700, dur: 0.5, gain: 0.03, send: 0.5 });
      }
    }
    if (this.flash > 0) {
      this.stoneMat.emissive.setRGB(1, 0.9, 0.7);
    } else {
      this.stoneMat.emissive.setHex(0x1c0e03);
    }
  }

  managerSpawn(player) {
    this.game.spawnOrb(this.pos.x, this.pos.z, 1.55, player.pos);
    this.effects.impact({ x: this.pos.x, y: 1.8, z: this.pos.z }, 0xffa45e, 8);
    this.irisMat.color.setHex(0xffb45c);
  }

  hit(damage, from) {
    if (this.dead) return;
    this.hp -= damage;
    this.flash = 0.16;
    this.effects.impact({ x: this.pos.x, y: 2.1, z: this.pos.z }, 0xffd0a0, 10);
    this.audio.hit();
    this.game.shake(0.06);
    if (this.hp <= 0) {
      this.dead = true;
      this.deadT = 0;
      this.effects.soul({ x: this.pos.x, y: 2, z: this.pos.z }, 0xffa45e);
      this.game.onEnemyKilled(this);
    }
  }

  forceRemove() {
    this.scene.remove(this.group);
    this.removed = true;
    this.dead = true;
  }
}

/* =============================================================== boss */

class Boss {
  constructor(scene, world, effects, audio, game) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.pos = new THREE.Vector3(0, 0, -72);
    this.spawn = this.pos.clone();
    this.maxHp = 6;
    this.hp = 6;
    this.active = false;
    this.awake = false;
    this.dying = false;
    this.dead = false;
    this.state = 'dormant';
    this.stateT = 0;
    this.attackCd = 2.5;
    this.exposed = false;
    this.exposeT = 0;
    this.flash = 0;
    this.wave = null;
    this.phase = 1;
    this.slamCount = 0;
    this.chargeDir = new THREE.Vector3();
    this.chargeHit = false;
    this.yaw = Math.PI;
    this.build();
  }

  build() {
    this.group = new THREE.Group();
    this.group.position.copy(this.pos);
    this.group.rotation.y = this.yaw;
    this.scene.add(this.group);
    this.model = new THREE.Group();
    this.group.add(this.model);

    this.stoneMat = new THREE.MeshStandardMaterial({
      map: this.world.wallTex, bumpMap: this.world.wallTex, bumpScale: 0.2,
      color: 0x7f7160, roughness: 0.92, metalness: 0.04,
      emissive: 0x0c1515, emissiveIntensity: 0.7,
    });
    this.darkMat = new THREE.MeshStandardMaterial({ color: 0x4a4136, roughness: 0.95 });
    this.mossMat = new THREE.MeshStandardMaterial({
      color: 0x395148, roughness: 0.9, emissive: 0x0e2a24, emissiveIntensity: 0.8,
    });
    this.goldMat = new THREE.MeshStandardMaterial({ color: 0xa8864b, metalness: 0.85, roughness: 0.4, emissive: 0x241502, emissiveIntensity: 0.5 });

    // legs
    for (const side of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(side * 1.05, 2.3, 0);
      this.model.add(hip);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 1.5, 6), this.stoneMat);
      thigh.position.y = -0.7;
      thigh.castShadow = true;
      hip.add(thigh);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.46, 1.4, 6), this.darkMat);
      shin.position.y = -1.9;
      shin.castShadow = true;
      hip.add(shin);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 1.5), this.stoneMat);
      foot.position.set(0, -2.55, -0.2);
      foot.castShadow = true;
      hip.add(foot);
      if (side === -1) this.legL = hip; else this.legR = hip;
    }

    // torso
    this.torso = new THREE.Group();
    this.torso.position.y = 3.35;
    this.model.add(this.torso);
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.05, 1.7, 7), this.stoneMat);
    chest.position.y = 0.35;
    chest.castShadow = true;
    this.torso.add(chest);
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.3), this.darkMat);
    pelvis.position.y = -0.75;
    this.torso.add(pelvis);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.16, 6, 20), this.goldMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.15;
    this.torso.add(collar);
    // ribs / cracked plates
    for (let i = 0; i < 4; i++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.2), this.mossMat);
      plate.position.set(-0.55 + i * 0.36, 0.7 - i * 0.18, -1.07);
      plate.rotation.z = rand(-0.2, 0.2);
      this.torso.add(plate);
    }

    // core
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(0, 0.45, -1.05);
    this.torso.add(this.coreGroup);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x3a1d0b, emissive: 0xff8a3c, emissiveIntensity: 0.3,
      roughness: 0.3, metalness: 0.3,
    });
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.44, 1), this.coreMat);
    this.coreGroup.add(this.core);
    this.coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.06, 6, 20), this.goldMat);
    this.coreRing.rotation.x = 0.3;
    this.coreGroup.add(this.coreRing);
    this.coreGlow = makeSprite(glowTex(), 0xff9b52, 0);
    this.coreGlow.scale.set(2.2, 2.2, 1);
    this.coreGroup.add(this.coreGlow);

    // shoulders + arms
    this.arms = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 0), this.stoneMat);
      shoulder.position.set(side * 1.55, 0.95, 0);
      shoulder.castShadow = true;
      this.torso.add(shoulder);
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 1.68, 0.75, 0);
      this.torso.add(armPivot);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 1.5, 6), this.stoneMat);
      upper.position.y = -0.7;
      upper.castShadow = true;
      armPivot.add(upper);
      const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 1.2, 6), this.darkMat);
      fore.position.y = -1.9;
      fore.castShadow = true;
      armPivot.add(fore);
      const fist = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), this.stoneMat);
      fist.position.y = -2.55;
      fist.castShadow = true;
      armPivot.add(fist);
      armPivot.rotation.z = side * 0.12;
      this.arms.push(armPivot);
    }

    // head
    this.head = new THREE.Group();
    this.head.position.y = 1.75;
    this.torso.add(this.head);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.9, 0.85), this.stoneMat);
    skull.castShadow = true;
    this.head.add(skull);
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.6), this.darkMat);
    jaw.position.set(0, -0.5, -0.2);
    this.head.add(jaw);
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.7, 5), this.goldMat);
      horn.position.set(side * 0.42, 0.62, 0.1);
      horn.rotation.z = side * -0.45;
      this.head.add(horn);
    }
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0xff7a3a });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), this.eyeMat);
      eye.position.set(side * 0.22, 0.1, -0.44);
      this.head.add(eye);
    }
    this.eyeGlow = makeSprite(glowTex(), 0xff7a3a, 0.4);
    this.eyeGlow.scale.set(1.1, 1.1, 1);
    this.eyeGlow.position.set(0, 0.1, -0.48);
    this.head.add(this.eyeGlow);

    this.aura = new THREE.PointLight(0xff8a3c, 0, 14, 1.8);
    this.aura.position.y = 3.6;
    this.group.add(this.aura);

    // telegraph ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff4d36, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    });
    this.telegraph = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 64), ringMat);
    this.telegraph.rotation.x = -Math.PI / 2;
    this.telegraph.position.set(0, 0.06, 0);
    this.group.add(this.telegraph);

    this.group.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  reset() {
    this.pos.copy(this.spawn);
    this.group.position.copy(this.pos);
    this.group.visible = true;
    this.group.scale.setScalar(1);
    this.hp = this.maxHp;
    this.active = false;
    this.awake = false;
    this.dying = false;
    this.dead = false;
    this.state = 'dormant';
    this.stateT = 0;
    this.attackCd = 2.5;
    this.exposed = false;
    this.exposeT = 0;
    this.phase = 1;
    this.slamCount = 0;
    this.wave = null;
    this.telegraph.material.opacity = 0;
    this.coreMat.emissiveIntensity = 0.3;
    this.coreGlow.material.opacity = 0;
    this.eyeGlow.material.opacity = 0.25;
    this.aura.intensity = 0;
    this.model.rotation.set(0, 0, 0);
    this.torso.rotation.set(0, 0, 0);
    this.arms[0].rotation.set(0, 0, -0.12);
    this.arms[1].rotation.set(0, 0, 0.12);
    this.game.hideBossBar();
  }

  start() {
    if (this.active || this.dead) return;
    this.active = true;
    this.state = 'awaken';
    this.stateT = 2.6;
    this.audio.roar();
    this.game.shake(0.5);
    this.game.showBossBar();
    this.game.bossStarted();
  }

  tryHit(origin, yaw, range, arc, damage) {
    if (!this.active || this.dying || this.dead) return false;
    if (this.state === 'awaken' || this.state === 'phase') return false;
    const dx = this.pos.x - origin.x, dz = this.pos.z - origin.z;
    const dist = Math.hypot(dx, dz);
    if (dist > range + 2.1) return false;
    const dot = dist < 0.01 ? 1 : (dx / dist) * -Math.sin(yaw) + (dz / dist) * -Math.cos(yaw);
    if (dot < Math.cos(arc + 0.25)) return false;
    if (this.exposed) {
      this.hp = Math.max(0, this.hp - damage);
      this.flash = 0.2;
      this.effects.impact({ x: this.pos.x, y: 2.4, z: this.pos.z }, 0xffd08a, 18);
      this.audio.bossHit();
      this.game.shake(0.16);
      this.game.updateBossBar(this.hp, this.maxHp);
      if (this.hp <= 0) {
        this.die();
      } else if (this.hp === 4 && this.phase === 1) {
        this.enterPhase(2);
      } else if (this.hp === 2 && this.phase === 2) {
        this.enterPhase(3);
      }
      return true;
    }
    this.effects.spark({ x: origin.x + dx * 0.4, y: 2.2, z: origin.z + dz * 0.4 }, 0xffd0a0, 8);
    this.audio.clank();
    return true;
  }

  enterPhase(n) {
    this.phase = n;
    this.state = 'phase';
    this.stateT = 1.3;
    this.audio.roar();
    this.game.shake(0.38);
    this.effects.shockwave({ x: this.pos.x, y: 0, z: this.pos.z }, { color: '#ff8a5c', maxRadius: 12, duration: 1.1 });
    this.game.onBossPhase(n);
  }

  die() {
    this.dying = true;
    this.state = 'dying';
    this.stateT = 3.6;
    this.exposed = false;
    this.audio.roar();
    this.game.shake(1);
    this.game.hideBossBar();
    this.game.onBossDefeated();
  }

  update(dt, player) {
    if (this.dead) return;
    const t = performance.now() * 0.001;
    this.flash = Math.max(0, this.flash - dt);
    if (this.dying) {
      this.stateT -= dt;
      this.model.rotation.z += dt * (0.2 + (3.6 - this.stateT) * 0.18);
      this.group.position.y = Math.max(-1.4, this.group.position.y - dt * 0.75);
      this.group.scale.y = Math.max(0.45, this.group.scale.y - dt * 0.12);
      if (Math.random() < 0.35) {
        this.effects.dust({ x: this.pos.x + rand(-2, 2), y: rand(0.5, 4), z: this.pos.z + rand(-2, 2) }, 2);
        this.effects.spark({ x: this.pos.x + rand(-1.5, 1.5), y: rand(1, 4.5), z: this.pos.z + rand(-1.5, 1.5) }, 0xffb45c, 3);
      }
      if (this.stateT <= 0) {
        this.dead = true;
        this.group.visible = false;
        this.effects.burst({ x: this.pos.x, y: 2, z: this.pos.z }, 0xffd58a, 90, { speed: 6, up: 6, lifeScale: 2 });
        this.effects.shockwave({ x: this.pos.x, y: 0, z: this.pos.z }, { color: '#ffcf8a', maxRadius: 14, duration: 1.6 });
        this.audio.slam();
        this.game.onBossVanquished();
      }
      return;
    }
    if (!this.active) {
      this.model.position.y = Math.sin(t * 0.8) * 0.03;
      return;
    }

    const dx = player.pos.x - this.pos.x, dz = player.pos.z - this.pos.z;
    const dist = Math.hypot(dx, dz);
    const targetYaw = Math.atan2(-dx, -dz);

    if (this.state === 'awaken') {
      this.stateT -= dt;
      this.yaw = angleLerp(this.yaw, targetYaw, 1 - Math.exp(-4 * dt));
      this.group.rotation.y = this.yaw;
      const p = clamp(1 - this.stateT / 2.6, 0, 1);
      this.model.position.y = -1.1 * (1 - easeOutCubic(p)) + Math.sin(t * 30) * 0.05 * (1 - p);
      this.coreMat.emissiveIntensity = 0.3 + p * 1.4;
      this.eyeGlow.material.opacity = 0.25 + p * 0.5;
      this.aura.intensity = p * 10;
      if (this.stateT <= 0) {
        this.state = 'chase';
        this.attackCd = 1.4;
        this.model.position.y = 0;
      }
      return;
    }

    if (this.state === 'phase') {
      this.stateT -= dt;
      this.model.rotation.z = Math.sin(this.stateT * 28) * 0.05;
      this.aura.intensity = 10 + Math.sin(t * 20) * 6;
      if (this.stateT <= 0) {
        this.state = 'chase';
        this.model.rotation.z = 0;
        this.attackCd = 1.2;
      }
      this.group.position.x = this.pos.x;
      this.group.position.z = this.pos.z;
      return;
    }

    this.yaw = angleLerp(this.yaw, targetYaw, 1 - Math.exp(-3.2 * dt));
    this.group.rotation.y = this.yaw;
    this.attackCd -= dt;

    if (this.state === 'chase') {
      const sp = this.phase === 3 ? 2.4 : this.phase === 2 ? 2.0 : 1.7;
      if (dist > 4.2) {
        this.world.moveCircle(this.pos, (dx / dist) * sp * dt, (dz / dist) * sp * dt, 1.5);
        this.clampPos();
      }
      this.model.position.y = Math.sin(t * 2) * 0.03;
      this.arms[0].rotation.x = Math.sin(t * 1.5) * 0.06;
      this.arms[1].rotation.x = -Math.sin(t * 1.5) * 0.06;
      if (this.attackCd <= 0) {
        if (dist < 7.5) {
          this.state = 'slamWind';
          this.stateT = this.phase === 3 ? 0.72 : 0.92;
          this.telegraph.material.opacity = 0.5;
          this.telegraph.scale.setScalar(0.8);
        } else {
          this.state = 'chargeWind';
          this.stateT = 0.65;
          this.audio.charge();
        }
      }
    } else if (this.state === 'slamWind') {
      this.stateT -= dt;
      const p = 1 - this.stateT / (this.phase === 3 ? 0.72 : 0.92);
      this.arms[0].rotation.x = -2.4 * Math.min(1, p * 2);
      this.arms[1].rotation.x = -2.4 * Math.min(1, p * 2);
      this.model.position.y = 0.3 * p;
      this.telegraph.material.opacity = 0.32 + Math.sin(t * 20) * 0.2;
      this.telegraph.scale.setScalar(1 + p * 2.2);
      if (this.stateT <= 0) {
        this.impact(player);
      }
    } else if (this.state === 'recover') {
      this.stateT -= dt;
      this.arms[0].rotation.x = damp(this.arms[0].rotation.x, 0, 5, dt);
      this.arms[1].rotation.x = damp(this.arms[1].rotation.x, 0, 5, dt);
      this.telegraph.material.opacity = 0;
      if (this.stateT <= 0) {
        this.state = 'chase';
        this.attackCd = this.phase === 3 ? 0.9 : 1.5;
      }
    } else if (this.state === 'chargeWind') {
      this.stateT -= dt;
      this.model.position.y = damp(this.model.position.y, -0.25, 8, dt);
      this.arms[0].rotation.x = 0.8;
      this.arms[1].rotation.x = 0.8;
      this.eyeGlow.material.opacity = 0.8;
      if (this.stateT <= 0) {
        this.state = 'charge';
        this.stateT = 1.15;
        this.chargeDir.set(dx / (dist || 1), 0, dz / (dist || 1));
        this.chargeHit = false;
        this.audio.charge();
      }
    } else if (this.state === 'charge') {
      this.stateT -= dt;
      const speed = this.phase === 3 ? 13.5 : 10.5;
      const oldX = this.pos.x, oldZ = this.pos.z;
      this.world.moveCircle(this.pos, this.chargeDir.x * speed * dt, this.chargeDir.z * speed * dt, 1.5);
      this.clampPos();
      this.model.position.y = 0;
      if (!this.chargeHit) {
        const d2 = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
        if (d2 < 2.1) {
          this.chargeHit = true;
          this.game.damagePlayer(2, { x: this.pos.x, z: this.pos.z });
          this.effects.shockwave({ x: this.pos.x, y: 0, z: this.pos.z }, { color: '#ff7a50', maxRadius: 3, duration: 0.45 });
        }
      }
      const moved = Math.hypot(this.pos.x - oldX, this.pos.z - oldZ);
      if (this.stateT <= 0 || moved < speed * dt * 0.25) {
        this.state = 'stunned';
        this.stateT = 1.0;
        this.exposed = true;
        this.exposeT = 2.6;
        this.audio.slam();
        this.game.shake(0.3);
        this.effects.dustRing({ x: this.pos.x, y: 0, z: this.pos.z }, 0xc9b087);
      }
    } else if (this.state === 'stunned') {
      this.stateT -= dt;
      this.model.rotation.z = Math.sin(this.stateT * 16) * 0.04;
      this.arms[0].rotation.x = 0.3;
      this.arms[1].rotation.x = 0.3;
      if (this.stateT <= 0) {
        this.model.rotation.z = 0;
        this.state = 'chase';
        this.attackCd = 1.1;
      }
    }

    if (this.exposed) {
      this.exposeT -= dt;
      if (this.exposeT <= 0) {
        this.exposed = false;
      }
    }

    // shockwave damage
    if (this.wave) {
      this.wave.r += this.wave.speed * dt;
      const p = this.wave.r / this.wave.max;
      this.wave.mesh.scale.setScalar(this.wave.r);
      this.wave.mesh.material.opacity = (1 - clamp(p, 0, 1)) * 0.9;
      const pd = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
      if (!this.wave.hit && Math.abs(pd - this.wave.r) < 0.85) {
        this.wave.hit = true;
        this.game.damagePlayer(2, { x: this.pos.x, z: this.pos.z });
      }
      if (p >= 1) {
        this.group.remove(this.wave.mesh);
        this.wave.mesh.geometry.dispose();
        this.wave.mesh.material.dispose();
        this.wave = null;
      }
    }

    // integrate visuals
    this.group.position.x = this.pos.x;
    this.group.position.z = this.pos.z;
    this.group.position.y = damp(this.group.position.y, 0, 6, dt);
    this.model.position.y += 0;
    const hurt = this.flash > 0;
    if (hurt) {
      this.stoneMat.emissive.setRGB(1.4, 1.2, 1);
      this.stoneMat.emissiveIntensity = 1;
    } else {
      this.stoneMat.emissive.setHex(0x0c1515);
      this.stoneMat.emissiveIntensity = 0.7;
    }
    this.coreMat.emissiveIntensity = this.exposed ? 3.2 + Math.sin(t * 12) * 1.1 : 0.25 + Math.sin(t * 2) * 0.1;
    this.coreGlow.material.opacity = this.exposed ? 0.75 + Math.sin(t * 9) * 0.2 : 0;
    this.coreRing.rotation.z += dt * (this.exposed ? 3.2 : 0.4);
    this.aura.intensity = this.state === 'awaken' ? this.aura.intensity : 7 + Math.sin(t * 3) * 2 + (this.exposed ? 9 : 0);
    this.eyeGlow.material.opacity = 0.32 + Math.sin(t * 4) * 0.1;
    this.core.scale.setScalar(this.exposed ? 1.18 + Math.sin(t * 10) * 0.06 : 1);
  }

  clampPos() {
    this.pos.x = clamp(this.pos.x, -12.6, 12.6);
    this.pos.z = clamp(this.pos.z, -84, -60.4);
  }

  impact(player) {
    this.state = 'recover';
    this.stateT = 1.4;
    this.exposed = true;
    this.exposeT = this.phase === 3 ? 3.8 : 3.2;
    this.telegraph.material.opacity = 0;
    this.audio.slam();
    this.game.shake(0.65);
    this.effects.dustRing({ x: this.pos.x, y: 0, z: this.pos.z }, 0xd0b58a);
    const maxR = this.phase === 3 ? 12 : 9.5;
    const geo = new THREE.RingGeometry(0.92, 1, 72);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff7a45, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, 0.08, 0);
    mesh.scale.setScalar(0.4);
    this.group.add(mesh);
    this.wave = { mesh, r: 0.6, max: maxR, speed: 13, hit: false };
    const pd = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    if (pd < 4.6) this.game.damagePlayer(2, { x: this.pos.x, z: this.pos.z });
    this.slamCount++;
    if (this.phase >= 2 && this.slamCount % 2 === 0) {
      // follow-up slam after a short beat
      this.state = 'slamWind';
      this.stateT = 0.55;
      this.telegraph.material.opacity = 0.4;
    }
  }
}
