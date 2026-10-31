import * as THREE from 'three';
import {
  addBox, addCone, addSphere, addTorus, clamp, damp, lerp, makeGlowTexture, rand, standard,
} from './assets.js';

const ATTACKS = [
  { duration: 0.5, active: 0.17, end: 0.28, comboAt: 0.24, damage: 42, poise: 18, stamina: 17, range: 3.4, arc: 1.85, lunge: 2.2 },
  { duration: 0.52, active: 0.18, end: 0.3, comboAt: 0.25, damage: 48, poise: 20, stamina: 19, range: 3.5, arc: 1.95, lunge: 2.3 },
  { duration: 0.72, active: 0.24, end: 0.38, comboAt: 0.36, damage: 68, poise: 30, stamina: 23, range: 3.7, arc: 1.7, lunge: 2.8 },
];

const HEAVY = { duration: 1.0, active: 0.42, end: 0.58, damage: 105, poise: 55, stamina: 34, range: 4.1, arc: 1.75, lunge: 3.2 };

export class Player {
  constructor(scene, effects, audio, game) {
    this.scene = scene;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.root.add(this.model);
    this.scene.add(this.root);
    this.pos = this.root.position;
    this.radius = 0.55;
    this.maxHp = 100;
    this.maxStamina = 100;
    this.reset();
    this.buildModel();
    this.root.position.set(0, 0.36, 7.0);
    this.yaw = Math.PI;
    this.root.rotation.y = this.yaw;
  }

  reset() {
    this.hp = this.maxHp;
    this.stamina = this.maxStamina;
    this.flasks = 3;
    this.state = 'idle';
    this.stateTime = 0;
    this.attackIndex = 0;
    this.attackQueued = false;
    this.attackDef = null;
    this.attackHit = false;
    this.healed = false;
    this.invuln = 0;
    this.staminaDelay = 0;
    this.velocity = new THREE.Vector3();
    this.rollDir = new THREE.Vector3(0, 0, -1);
    this.combo = 0;
    this.comboTimer = 0;
    this.lockOn = false;
    this.walkPhase = 0;
    this.footClock = 0;
    this.deadTime = 0;
    this.hitFlash = 0;
    this.parryGlow = 0;
    this.riposteHit = false;
    this.lastDamage = 0;
    this.time = 0;
    if (this.root) this.root.rotation.x = 0;
    if (this.body) {
      this.body.rotation.set(0, 0, 0);
      this.body.position.set(0, 0, 0);
    }
  }

  get alive() { return this.hp > 0 && this.state !== 'dead'; }
  get hpRatio() { return clamp(this.hp / this.maxHp, 0, 1); }
  get staminaRatio() { return clamp(this.stamina / this.maxStamina, 0, 1); }
  get isParryActive() { return this.state === 'parry' && this.stateTime >= 0.045 && this.stateTime <= 0.33; }

  forward(out = new THREE.Vector3()) {
    return out.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
  }

  distanceToBoss(boss) {
    if (!boss) return 999;
    return Math.hypot(boss.pos.x - this.pos.x, boss.pos.z - this.pos.z);
  }

  buildModel() {
    const armor = standard(0x414853, { metalness: 0.62, roughness: 0.48 });
    const armorDark = standard(0x1d2229, { metalness: 0.6, roughness: 0.52 });
    const trim = standard(0x8d7a52, { metalness: 0.82, roughness: 0.36 });
    const cloth = standard(0x2b3b50, { metalness: 0.05, roughness: 0.94, side: THREE.DoubleSide });
    const clothTrim = standard(0x6d5c3a, { metalness: 0.35, roughness: 0.7, side: THREE.DoubleSide });
    const steel = standard(0xb8c0c7, { metalness: 0.95, roughness: 0.22, emissive: 0x15242e, emissiveIntensity: 0.45 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x9fd4ea });
    this.glowMat = glowMat;
    this.armorMat = armor;

    this.body = new THREE.Group();
    this.model.add(this.body);

    addBox(this.body, 0.55, 0.3, 0.33, armorDark, 0, 1.0, 0);
    addBox(this.body, 0.58, 0.1, 0.35, trim, 0, 1.15, 0);
    addBox(this.body, 0.14, 0.14, 0.36, trim, 0, 1.0, 0);

    this.torso = new THREE.Group();
    this.torso.position.set(0, 1.18, 0);
    this.body.add(this.torso);

    const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 0.34, 4, 10), armor);
    chest.position.y = 0.28;
    chest.scale.set(1.15, 1, 0.72);
    chest.castShadow = true;
    this.torso.add(chest);
    addBox(this.torso, 0.62, 0.46, 0.18, armor, 0, 0.31, 0.14);
    addBox(this.torso, 0.5, 0.07, 0.2, trim, 0, 0.52, 0.13);
    addBox(this.torso, 0.38, 0.05, 0.2, trim, 0, 0.08, 0.14);

    const emblem = new THREE.Mesh(new THREE.CircleGeometry(0.09, 4), glowMat);
    emblem.position.set(0, 0.3, 0.245);
    emblem.rotation.z = Math.PI / 4;
    this.torso.add(emblem);

    this.head = new THREE.Group();
    this.head.position.set(0, 0.66, 0);
    this.torso.add(this.head);
    const helm = new THREE.Mesh(new THREE.CapsuleGeometry(0.155, 0.12, 4, 10), armor);
    helm.position.y = 0.12;
    helm.castShadow = true;
    this.head.add(helm);
    addBox(this.head, 0.28, 0.07, 0.08, armorDark, 0, 0.13, 0.14);
    const visor = addBox(this.head, 0.2, 0.022, 0.02, glowMat, 0, 0.14, 0.19);
    visor.castShadow = false;
    addCone(this.head, 0.045, 0.28, trim, -0.16, 0.28, 0, 0, 0, -0.45);
    addCone(this.head, 0.045, 0.28, trim, 0.16, 0.28, 0, 0, 0, 0.45);
    addBox(this.head, 0.05, 0.2, 0.25, armorDark, 0, 0.05, -0.04);

    for (const side of [-1, 1]) {
      const pauldron = addSphere(this.torso, 0.2, armor, side * 0.4, 0.45, 0, 1.2, 0.72, 1.05);
      addCone(this.torso, 0.08, 0.24, trim, side * 0.53, 0.55, 0, 0, 0, side * 0.5);
      pauldron.castShadow = true;
    }

    this.armR = new THREE.Group();
    this.armR.position.set(0.42, 0.45, 0);
    this.torso.add(this.armR);
    const upperR = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.3, 3, 8), armorDark);
    upperR.position.y = -0.21;
    upperR.castShadow = true;
    this.armR.add(upperR);
    this.elbowR = new THREE.Group();
    this.elbowR.position.y = -0.43;
    this.armR.add(this.elbowR);
    const foreR = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.25, 3, 8), armor);
    foreR.position.y = -0.18;
    foreR.castShadow = true;
    this.elbowR.add(foreR);
    addBox(this.elbowR, 0.17, 0.14, 0.18, armorDark, 0, -0.35, 0);

    this.weapon = new THREE.Group();
    this.weapon.position.set(0, -0.38, 0.02);
    this.elbowR.add(this.weapon);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.26, 8), standard(0x241a13, { roughness: 0.9 }));
    grip.position.y = 0.03;
    this.weapon.add(grip);
    addBox(this.weapon, 0.34, 0.055, 0.08, trim, 0, 0.15, 0);
    addSphere(this.weapon, 0.055, trim, 0, -0.12, 0);
    const blade = addBox(this.weapon, 0.075, 1.12, 0.026, steel, 0, 0.73, 0);
    blade.castShadow = true;
    const tip = addCone(this.weapon, 0.038, 0.22, steel, 0, 1.39, 0, 0, 0, 0);
    tip.castShadow = true;
    const fuller = addBox(this.weapon, 0.018, 0.9, 0.03, glowMat, 0, 0.72, 0.002);
    fuller.castShadow = false;
    this.blade = blade;

    this.armL = new THREE.Group();
    this.armL.position.set(-0.42, 0.45, 0);
    this.torso.add(this.armL);
    const upperL = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.3, 3, 8), armorDark);
    upperL.position.y = -0.21;
    upperL.castShadow = true;
    this.armL.add(upperL);
    this.elbowL = new THREE.Group();
    this.elbowL.position.y = -0.43;
    this.armL.add(this.elbowL);
    const foreL = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.25, 3, 8), armor);
    foreL.position.y = -0.18;
    foreL.castShadow = true;
    this.elbowL.add(foreL);

    this.shield = new THREE.Group();
    this.shield.position.set(-0.09, -0.22, 0.14);
    this.shield.rotation.z = 0.08;
    this.elbowL.add(this.shield);
    const shieldPlate = addBox(this.shield, 0.52, 0.64, 0.07, armor, 0, 0, 0);
    shieldPlate.castShadow = true;
    addBox(this.shield, 0.54, 0.06, 0.08, trim, 0, 0.26, 0.01);
    addBox(this.shield, 0.54, 0.06, 0.08, trim, 0, -0.26, 0.01);
    const shieldEmblem = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.1, 6), glowMat);
    shieldEmblem.position.set(0, 0, 0.042);
    shieldEmblem.rotation.z = Math.PI / 6;
    this.shield.add(shieldEmblem);

    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.18, 1.0, 0);
      this.body.add(leg);
      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.135, 0.36, 3, 8), armorDark);
      upper.position.y = -0.23;
      upper.castShadow = true;
      leg.add(upper);
      const knee = addSphere(leg, 0.115, armor, 0, -0.43, 0.03, 1, 0.8, 1.1);
      knee.castShadow = true;
      const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.34, 3, 8), armor);
      lower.position.y = -0.61;
      lower.castShadow = true;
      leg.add(lower);
      addBox(leg, 0.22, 0.14, 0.34, armorDark, 0, -0.83, 0.06);
      if (side === 1) this.legR = leg; else this.legL = leg;
    }

    this.capePivot = new THREE.Group();
    this.capePivot.position.set(0, 0.55, -0.18);
    this.torso.add(this.capePivot);
    const capeGeo = new THREE.PlaneGeometry(0.68, 1.12, 5, 8);
    const capePos = capeGeo.attributes.position;
    for (let i = 0; i < capePos.count; i++) {
      const y = capePos.getY(i);
      const taper = 0.56 + 0.44 * ((y + 0.56) / 1.12);
      capePos.setX(i, capePos.getX(i) * taper);
      if (y < -0.42) capePos.setX(i, capePos.getX(i) + Math.sin(y * 9) * 0.025);
    }
    capeGeo.computeVertexNormals();
    this.cape = new THREE.Mesh(capeGeo, cloth);
    this.cape.position.y = -0.58;
    this.cape.rotation.x = 0.12;
    this.cape.castShadow = true;
    this.capePivot.add(this.cape);
    const capeTrim = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.05, 5, 1), clothTrim);
    capeTrim.position.set(0, -1.07, 0.01);
    this.cape.add(capeTrim);

    this.parryAura = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(128, 'rgba(255,248,225,1)', 'rgba(255,220,150,0)'), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.parryAura.scale.setScalar(2.2);
    this.shield.add(this.parryAura);
    this.parryAura.position.set(0, 0, 0.2);

    this.root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  handleAction(action, boss) {
    if (!this.alive || this.game.state !== 'playing') return;
    if (action === 'lock') {
      if (boss && boss.alive) {
        this.lockOn = !this.lockOn;
        this.game.audio.ui();
        this.game.setToast(this.lockOn ? 'LOCKED ON' : 'LOCK RELEASED', false, 0.7);
      }
      return;
    }
    if (this.state === 'roll' || this.state === 'hurt' || this.state === 'dead' || this.state === 'riposte' || this.state === 'heal') return;

    // A parry's reward should be immediately cashable, even during the parry recovery.
    if ((action === 'attack' || action === 'heavy') && boss && boss.isStaggered && this.distanceToBoss(boss) < 4.4) {
      this.startRiposte(boss);
      return;
    }

    if (action === 'attack') {
      if (this.state === 'attack') {
        if (this.stateTime > this.attackDef.comboAt * 0.65) this.attackQueued = true;
        return;
      }
      if (this.state === 'parry') return;
      this.startAttack(false, boss);
    } else if (action === 'heavy') {
      if (this.state === 'attack') {
        if (this.stateTime > 0.28) this.attackQueued = true;
        return;
      }
      if (this.state === 'parry') return;
      this.startAttack(true, boss);
    } else if (action === 'dodge') {
      if (this.state === 'attack' && this.stateTime < this.attackDef.duration * 0.72) return;
      this.startDodge();
    } else if (action === 'parry') {
      if (this.state === 'attack' && this.stateTime < this.attackDef.duration * 0.78) return;
      this.startParry();
    } else if (action === 'flask') {
      this.startHeal();
    }
  }

  startAttack(heavy, boss) {
    const cost = heavy ? HEAVY.stamina : ATTACKS[this.attackIndex].stamina;
    if (this.stamina < cost) {
      this.game.setToast('EXHAUSTED', true, 0.5);
      this.game.audio.ui();
      return;
    }
    this.stamina -= cost;
    this.staminaDelay = 0.55;
    this.state = heavy ? 'heavy' : 'attack';
    this.stateTime = 0;
    this.attackHit = false;
    this.attackQueued = false;
    this.attackDef = heavy ? HEAVY : ATTACKS[this.attackIndex];
    this.heavyAttack = heavy;
    if (!heavy) this.attackIndex = (this.attackIndex + 1) % 3;
    if (boss && !this.lockOn) {
      const dx = boss.pos.x - this.pos.x;
      const dz = boss.pos.z - this.pos.z;
      if (Math.hypot(dx, dz) < 6) this.yaw = Math.atan2(dx, dz);
    }
    this.audio.swing(heavy);
    this.velocity.multiplyScalar(0.3);
    this.game.playerAttackStarted(heavy);
  }

  startDodge() {
    if (this.stamina < 22) {
      this.game.setToast('EXHAUSTED', true, 0.5);
      this.game.audio.ui();
      return;
    }
    this.stamina -= 22;
    this.staminaDelay = 0.6;
    this.state = 'roll';
    this.stateTime = 0;
    this.attackQueued = false;
    const inp = this.game.input;
    let x = inp.moveX;
    let z = inp.moveZ;
    if (Math.hypot(x, z) < 0.1) { x = 0; z = -1; }
    const cam = this.game.cameraYaw;
    const f = new THREE.Vector3(Math.sin(cam), 0, Math.cos(cam));
    const r = new THREE.Vector3(Math.cos(cam), 0, -Math.sin(cam));
    this.rollDir.copy(f).multiplyScalar(z).addScaledVector(r, x).normalize();
    this.yaw = Math.atan2(this.rollDir.x, this.rollDir.z);
    this.audio.dodge();
    this.effects.dust(this.pos, { count: 12, radius: 0.8 });
  }

  startParry() {
    if (this.stamina < 16) {
      this.game.setToast('EXHAUSTED', true, 0.5);
      this.game.audio.ui();
      return;
    }
    this.stamina -= 16;
    this.staminaDelay = 0.6;
    this.state = 'parry';
    this.stateTime = 0;
    this.attackQueued = false;
    this.parryGlow = 1;
    this.audio.whoosh();
    this.game.playerParryStarted();
  }

  startHeal() {
    if (this.flasks <= 0) {
      this.game.setToast('NO EMBERS LEFT', true, 0.8);
      this.game.audio.ui();
      return;
    }
    if (this.state === 'attack' || this.state === 'heavy') return;
    this.state = 'heal';
    this.stateTime = 0;
    this.healed = false;
    this.velocity.multiplyScalar(0.1);
    this.game.audio.cast();
  }

  startRiposte(boss) {
    this.state = 'riposte';
    this.stateTime = 0;
    this.riposteHit = false;
    this.riposteTarget = boss;
    this.yaw = Math.atan2(boss.pos.x - this.pos.x, boss.pos.z - this.pos.z);
    this.velocity.set(0, 0, 0);
    this.game.setToast('RIPOSTE', false, 1.0);
    this.game.playerRiposteStarted(boss);
  }

  update(dt, boss) {
    this.time += dt;
    if (this.state === 'dead') {
      this.deadTime += dt;
      this.animate(dt, 0);
      return;
    }
    this.stateTime += dt;
    this.invuln = Math.max(0, this.invuln - dt);
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if (this.comboTimer <= 0) this.combo = 0;
    this.staminaDelay = Math.max(0, this.staminaDelay - dt);
    if (this.staminaDelay <= 0 && this.state !== 'roll' && this.state !== 'attack' && this.state !== 'heavy') {
      this.stamina = Math.min(this.maxStamina, this.stamina + 31 * dt);
    }
    if (this.parryGlow > 0) this.parryGlow = Math.max(0, this.parryGlow - dt * 2.8);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 3.5);

    if (boss && boss.alive && this.lockOn) {
      const targetYaw = Math.atan2(boss.pos.x - this.pos.x, boss.pos.z - this.pos.z);
      let diff = targetYaw - this.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.yaw += diff * Math.min(1, dt * 8);
    }

    switch (this.state) {
      case 'idle':
      case 'run':
        this.updateMovement(dt, boss);
        break;
      case 'attack':
      case 'heavy':
        this.updateAttack(dt, boss);
        break;
      case 'roll':
        this.updateRoll(dt);
        break;
      case 'parry':
        this.updateParry(dt);
        break;
      case 'heal':
        this.updateHeal(dt);
        break;
      case 'riposte':
        this.updateRiposte(dt);
        break;
      case 'hurt':
        this.updateHurt(dt);
        break;
    }

    this.pos.x = clamp(this.pos.x, -20.6, 20.6);
    this.pos.z = clamp(this.pos.z, -20.6, 20.6);
    const dist = Math.hypot(this.pos.x, this.pos.z);
    if (dist > 20.6) {
      this.pos.x *= 20.6 / dist;
      this.pos.z *= 20.6 / dist;
    }

    this.root.rotation.y = this.yaw;
    this.root.position.y = 0.36;
    this.animate(dt, this.velocity.length());
  }

  updateMovement(dt, boss) {
    const inp = this.game.input;
    const x = inp.moveX;
    const z = inp.moveZ;
    const cam = this.game.cameraYaw;
    const f = new THREE.Vector3(Math.sin(cam), 0, Math.cos(cam));
    const r = new THREE.Vector3(Math.cos(cam), 0, -Math.sin(cam));
    const desired = f.multiplyScalar(z).addScaledVector(r, x);
    const len = desired.length();
    const moving = len > 0.08;
    if (moving) desired.normalize().multiplyScalar(5.25);
    const accel = moving ? 15 : 20;
    this.velocity.x = damp(this.velocity.x, desired.x, accel, dt);
    this.velocity.z = damp(this.velocity.z, desired.z, accel, dt);
    if (this.velocity.lengthSq() > 0.04) {
      this.pos.x += this.velocity.x * dt;
      this.pos.z += this.velocity.z * dt;
    }
    if (!this.lockOn && moving) {
      const target = Math.atan2(this.velocity.x, this.velocity.z);
      let diff = target - this.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.yaw += diff * Math.min(1, dt * 12);
    }
    const newState = moving ? 'run' : 'idle';
    if (newState !== this.state) {
      this.state = newState;
      this.stateTime = 0;
    }
    if (moving) {
      this.footClock -= dt;
      if (this.footClock <= 0) {
        this.footClock = 0.34;
        this.audio.step();
      }
    }
    if (boss && boss.alive) {
      const dx = this.pos.x - boss.pos.x;
      const dz = this.pos.z - boss.pos.z;
      const d = Math.hypot(dx, dz);
      const min = 1.15 + this.radius;
      if (d < min && d > 0.001) {
        this.pos.x = boss.pos.x + (dx / d) * min;
        this.pos.z = boss.pos.z + (dz / d) * min;
      }
    }
  }

  updateAttack(dt, boss) {
    const def = this.attackDef;
    const t = this.stateTime;
    const forward = this.forward();
    if (!this.attackHit && t >= def.active) {
      this.attackHit = true;
      const dist = this.distanceToBoss(boss);
      const dot = forward.dot(new THREE.Vector3(boss.pos.x - this.pos.x, 0, boss.pos.z - this.pos.z).normalize());
      if (dist <= def.range + (boss.radius || 0) && dot > Math.cos(def.arc / 2)) {
        this.game.hitBoss(def.damage, def.poise, this, this.heavyAttack ? 'heavy' : 'light');
        this.audio.hit(this.heavyAttack);
        this.effects.burst(new THREE.Vector3(boss.pos.x, 1.5, boss.pos.z), { color: 0xffd28a, count: this.heavyAttack ? 32 : 18, speed: this.heavyAttack ? 7 : 5, size: 0.1, gravity: 6 });
        this.effects.slash(this.pos, this.yaw, { radius: def.range + 0.5, arc: def.arc, color: this.heavyAttack ? 0xffc46b : 0xc7d8df, life: 0.18, y: this.heavyAttack ? 1.3 : 1.15, tilt: 0.12 });
        this.game.cameraShake(this.heavyAttack ? 0.34 : 0.18);
        this.game.hitStop(this.heavyAttack ? 0.075 : 0.045);
        this.combo++;
        this.comboTimer = 2.4;
        this.game.updateCombo(this.combo);
      } else if (dist < 5) {
        this.effects.slash(this.pos, this.yaw, { radius: def.range, arc: def.arc, color: 0x9daeb8, life: 0.14, y: 1.1 });
      }
    }
    if (t > def.active - 0.04 && t < def.end) {
      this.pos.x += forward.x * def.lunge * dt;
      this.pos.z += forward.z * def.lunge * dt;
    }
    if (t >= def.duration) {
      if (this.attackQueued && !this.heavyAttack) {
        this.attackQueued = false;
        this.state = 'idle';
        this.stateTime = 0;
        this.startAttack(false, boss);
      } else {
        this.state = 'idle';
        this.stateTime = 0;
        this.attackQueued = false;
      }
    }
  }

  updateRoll(dt) {
    const t = this.stateTime / 0.52;
    const speed = 11.5 * (1 - Math.pow(t, 1.6)) + 1.5;
    this.pos.x += this.rollDir.x * speed * dt;
    this.pos.z += this.rollDir.z * speed * dt;
    this.invuln = Math.max(this.invuln, t > 0.06 && t < 0.62 ? 0.08 : 0);
    if (t > 0.25 && t < 0.7 && Math.random() < dt * 35) {
      this.effects.burst(new THREE.Vector3(this.pos.x, 0.5, this.pos.z), { color: 0x8b8172, count: 4, speed: 1.2, size: 0.12, gravity: -0.2, life: 0.5 });
    }
    if (this.stateTime >= 0.52) {
      this.state = 'idle';
      this.stateTime = 0;
    }
  }

  updateParry(dt) {
    if (this.stateTime > 0.3 && this.parryGlow > 0) this.parryGlow = Math.max(0, this.parryGlow - dt * 2);
    if (this.stateTime >= 0.58) {
      this.state = 'idle';
      this.stateTime = 0;
    }
  }

  updateHeal(dt) {
    if (!this.healed && this.stateTime >= 0.55) {
      this.healed = true;
      this.flasks--;
      this.hp = Math.min(this.maxHp, this.hp + 38);
      this.effects.flash(new THREE.Vector3(this.pos.x, 1.2, this.pos.z), { color: 0xffc46b, size: 2.2, life: 0.5 });
      this.effects.burst(new THREE.Vector3(this.pos.x, 1.1, this.pos.z), { color: 0xffb45e, count: 30, speed: 3, size: 0.12, gravity: -1, life: 1.1, upward: 1.2 });
      this.audio.heal();
      this.game.setToast('EMBER RESTORED', false, 1.0);
    }
    if (this.stateTime >= 1.15) {
      this.state = 'idle';
      this.stateTime = 0;
    }
  }

  updateRiposte(dt) {
    const t = this.stateTime;
    const boss = this.riposteTarget;
    if (boss) this.yaw = Math.atan2(boss.pos.x - this.pos.x, boss.pos.z - this.pos.z);
    if (!this.riposteHit && t >= 0.58) {
      this.riposteHit = true;
      if (boss && boss.alive) {
        this.game.hitBoss(260, 120, this, 'riposte');
        this.audio.hit(true);
        this.audio.parry();
        this.effects.flash(new THREE.Vector3(boss.pos.x, 2.2, boss.pos.z), { color: 0xffe6a8, size: 4.5, life: 0.55 });
        this.effects.burst(new THREE.Vector3(boss.pos.x, 2.0, boss.pos.z), { color: 0xffd27a, count: 70, speed: 10, size: 0.16, gravity: 4, life: 1.1 });
        this.effects.slash(this.pos, this.yaw, { radius: 4, arc: 1.5, color: 0xffe1a1, life: 0.32, y: 1.4, scale: 1.3 });
        this.game.cameraShake(0.7);
        this.game.hitStop(0.14);
        this.game.slowMotion(0.25, 0.5);
      }
    }
    if (t >= 1.28) {
      this.state = 'idle';
      this.stateTime = 0;
    }
  }

  updateHurt(dt) {
    this.pos.x += this.velocity.x * dt;
    this.pos.z += this.velocity.z * dt;
    this.velocity.multiplyScalar(Math.pow(0.03, dt));
    if (this.stateTime >= 0.34) {
      this.state = 'idle';
      this.stateTime = 0;
    }
  }

  takeDamage(amount, source, { unblockable = false } = {}) {
    if (!this.alive || this.invuln > 0 || this.state === 'riposte') return false;
    const dx = this.pos.x - source.x;
    const dz = this.pos.z - source.z;
    const len = Math.hypot(dx, dz) || 1;
    this.hp = Math.max(0, this.hp - amount);
    this.lastDamage = amount;
    this.hitFlash = 1;
    this.invuln = 0.72;
    this.combo = 0;
    this.comboTimer = 0;
    this.game.updateCombo(0);
    this.game.cameraShake(0.55);
    this.game.damageFlash();
    this.game.hitStop(0.06);
    this.effects.burst(new THREE.Vector3(this.pos.x, 1.1, this.pos.z), { color: 0x9d2329, count: 26, speed: 4.5, size: 0.11, gravity: 9, life: 0.7 });
    this.audio.damage();
    this.velocity.set((dx / len) * 5.5, 0, (dz / len) * 5.5);
    if (this.hp <= 0) {
      this.die();
    } else {
      this.state = 'hurt';
      this.stateTime = 0;
      this.game.setToast(unblockable ? 'UNBLOCKABLE' : 'WOUNDED', true, 0.6);
    }
    return true;
  }

  die() {
    this.state = 'dead';
    this.stateTime = 0;
    this.deadTime = 0;
    this.velocity.set(0, 0, 0);
    this.audio.death();
    this.game.playerDied();
  }

  animate(dt, speed) {
    const t = this.time;
    const running = this.state === 'run';
    this.walkPhase += dt * (running ? 10.2 : 2.0);
    const ph = this.walkPhase;
    const breath = Math.sin(t * 2.1) * 0.008;

    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.torso.position.y = 1.18 + breath;
    this.torso.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);
    this.armR.rotation.set(-0.16, 0, 0.12);
    this.armL.rotation.set(-0.12, 0, -0.15);
    this.elbowR.rotation.set(0.08, 0, 0);
    this.elbowL.rotation.set(0.12, 0, 0);
    this.legR.rotation.set(0, 0, 0);
    this.legL.rotation.set(0, 0, 0);
    this.cape.rotation.set(0.12, 0, 0);
    this.shield.rotation.set(0, 0, 0.08);
    this.weapon.rotation.set(0, 0, 0);

    if (running) {
      const amp = clamp(speed / 5.25, 0, 1);
      this.legR.rotation.x = Math.sin(ph) * 0.68 * amp;
      this.legL.rotation.x = -Math.sin(ph) * 0.68 * amp;
      this.armR.rotation.x = -0.1 - Math.sin(ph) * 0.3 * amp;
      this.armL.rotation.x = -0.1 + Math.sin(ph) * 0.3 * amp;
      this.torso.rotation.z = Math.sin(ph * 2) * 0.035 * amp;
      this.body.position.y = Math.abs(Math.sin(ph)) * 0.045 * amp;
      this.cape.rotation.x = 0.3 + Math.sin(ph * 2) * 0.08;
      this.capePivot.rotation.x = -0.08 * amp;
    } else {
      this.armR.rotation.x += Math.sin(t * 2.1) * 0.015;
      this.armL.rotation.x += Math.sin(t * 2.1 + 1) * 0.015;
      this.cape.rotation.x = 0.12 + Math.sin(t * 1.3) * 0.025;
      this.capePivot.rotation.x = 0;
    }

    if (this.state === 'attack' || this.state === 'heavy') {
      const def = this.attackDef;
      const raw = clamp(this.stateTime / def.duration, 0, 1);
      const t1 = clamp(raw / 0.38, 0, 1);
      const t2 = clamp((raw - 0.38) / 0.3, 0, 1);
      const wind = 1 - Math.pow(1 - t1, 3);
      const swing = t2 * t2 * (3 - 2 * t2);
      const heavy = this.heavyAttack;
      this.armR.rotation.x = heavy ? lerp(-0.2, -2.75, wind) - swing * 3.3 : lerp(-0.2, -2.35, wind) - swing * 2.9;
      this.armR.rotation.z = heavy ? lerp(0.15, 0.45, wind) - swing * 0.35 : lerp(0.15, 0.5, wind) - swing * 0.8;
      this.elbowR.rotation.x = lerp(0.1, 0.55, wind) - swing * 0.2;
      this.torso.rotation.y = lerp(0, heavy ? -0.65 : -0.55, wind) + swing * (heavy ? 1.1 : 0.95);
      this.torso.rotation.x = swing * (heavy ? 0.35 : 0.2);
      this.armL.rotation.x = lerp(-0.2, -0.7, wind) + swing * 0.5;
      this.armL.rotation.z = -0.3;
      this.legR.rotation.x = lerp(0, -0.25, swing);
      this.legL.rotation.x = lerp(0, 0.3, swing);
      this.cape.rotation.x = 0.25 + swing * 0.45;
      this.capePivot.rotation.x = -0.1 - swing * 0.2;
    } else if (this.state === 'roll') {
      const p = clamp(this.stateTime / 0.52, 0, 1);
      this.body.rotation.x = -p * Math.PI * 2;
      this.body.position.y = Math.sin(p * Math.PI) * 0.35;
      this.armR.rotation.x = -1.1;
      this.armL.rotation.x = -1.1;
      this.elbowR.rotation.x = 1.2;
      this.elbowL.rotation.x = 1.2;
      this.legR.rotation.x = -1.0;
      this.legL.rotation.x = -0.8;
      this.cape.rotation.x = 0.6;
    } else if (this.state === 'parry') {
      const p = clamp(this.stateTime / 0.2, 0, 1);
      this.armL.rotation.x = lerp(-0.12, -1.35, Math.min(1, p * 2.2));
      this.armL.rotation.z = lerp(-0.15, 0.55, Math.min(1, p * 2.2));
      this.elbowL.rotation.x = lerp(0.12, 0.9, Math.min(1, p * 2.2));
      this.armR.rotation.x = -0.55;
      this.armR.rotation.z = -0.2;
      this.torso.rotation.y = -0.25;
      this.torso.rotation.x = -0.05;
      this.shield.rotation.z = 0.6;
    } else if (this.state === 'heal') {
      const p = Math.sin(clamp(this.stateTime / 1.15, 0, 1) * Math.PI);
      this.armL.rotation.x = lerp(-0.12, -1.45, p);
      this.armL.rotation.z = lerp(-0.15, 0.65, p);
      this.elbowL.rotation.x = 1.1 * p;
      this.armR.rotation.x = -0.5;
      this.torso.rotation.x = -0.12 * p;
      this.head.rotation.x = 0.15 * p;
    } else if (this.state === 'riposte') {
      const t0 = clamp((this.stateTime - 0.28) / 0.32, 0, 1);
      const thrust = t0 * t0 * (3 - 2 * t0);
      this.armR.rotation.x = lerp(-2.3, 0.55, thrust);
      this.armR.rotation.z = lerp(0.5, 0.05, thrust);
      this.elbowR.rotation.x = lerp(0.9, 0.0, thrust);
      this.torso.rotation.y = lerp(-0.6, 0.35, thrust);
      this.torso.rotation.x = 0.18 * thrust;
      this.armL.rotation.x = -0.9;
      this.legR.rotation.x = -0.3;
      this.legL.rotation.x = 0.2;
      this.cape.rotation.x = 0.45;
    } else if (this.state === 'hurt') {
      const p = clamp(this.stateTime / 0.34, 0, 1);
      this.body.rotation.x = -0.18 * Math.sin(p * Math.PI);
      this.torso.rotation.x = 0.25 * Math.sin(p * Math.PI);
      this.armR.rotation.x = -0.8;
      this.armL.rotation.x = -0.9;
      this.head.rotation.x = -0.2;
    } else if (this.state === 'dead') {
      const p = clamp(this.deadTime / 1.3, 0, 1);
      const ease = p * p * (3 - 2 * p);
      this.body.rotation.z = ease * 1.45;
      this.body.position.y = -ease * 0.15;
      this.armR.rotation.x = -0.5;
      this.armL.rotation.x = -0.4;
      this.legR.rotation.x = 0.15;
      this.legL.rotation.x = -0.15;
    }

    this.parryAura.material.opacity = this.parryGlow * 0.85;
    this.parryAura.scale.setScalar(1.9 + (1 - this.parryGlow) * 0.8);
    this.glowMat.color.setHex(this.hitFlash > 0 ? 0xff5f55 : 0x9fd4ea);
  }

  restoreAfterBoss() {
    this.hp = Math.min(this.maxHp, this.hp + 32);
    this.flasks = Math.min(3, this.flasks + 1);
    this.stamina = this.maxStamina;
    this.lockOn = false;
    this.state = 'idle';
    this.stateTime = 0;
    this.invuln = 1.2;
  }
}
