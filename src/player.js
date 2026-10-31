import * as THREE from 'three';
import { angleLerp, clamp, damp, flameTex, makeSprite, glowTex, lerp } from './util.js';

const FORWARD = new THREE.Vector3(0, 0, -1);

export class Player {
  constructor(scene, world, effects, audio) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.audio = audio;

    this.pos = new THREE.Vector3(0, 0, 35.5);
    this.radius = 0.48;
    this.yaw = 0;
    this.targetYaw = 0;
    this.velocity = new THREE.Vector3();
    this.speed = 6.1;
    this.health = 5;
    this.maxHealth = 5;
    this.dead = false;
    this.invuln = 0;
    this.hurtT = 0;
    this.attackTime = 0;
    this.attackDur = 0.36;
    this.attackBuffer = 0;
    this.attackIndex = 0;
    this.comboTimer = 0;
    this.attackStruck = false;
    this.slashSpawned = false;
    this.rollT = 0;
    this.rollDur = 0.5;
    this.rollCooldown = 0;
    this.rollDir = new THREE.Vector3(0, 0, -1);
    this.pushing = false;
    this.stepDist = 0;
    this.walkPhase = 0;
    this.moving = false;
    this.torchLit = false;
    this.torchTime = 0;
    this.torchSpriteT = 0;
    this.attackAim = 0;

    this.build();
    this.reset(this.pos.clone());
  }

  build() {
    this.root = new THREE.Group();
    this.root.position.copy(this.pos);
    this.scene.add(this.root);

    this.pivot = new THREE.Group();
    this.pivot.position.y = 0.95;
    this.root.add(this.pivot);
    this.body = new THREE.Group();
    this.body.position.y = -0.95;
    this.pivot.add(this.body);

    this.tunicMat = new THREE.MeshStandardMaterial({ color: 0x2c6b5f, roughness: 0.85, metalness: 0.04 });
    this.tunicDark = new THREE.MeshStandardMaterial({ color: 0x1a443f, roughness: 0.9 });
    this.leatherMat = new THREE.MeshStandardMaterial({ color: 0x5b3b24, roughness: 0.78 });
    this.skinMat = new THREE.MeshStandardMaterial({ color: 0xd2ad80, roughness: 0.76 });
    this.hairMat = new THREE.MeshStandardMaterial({ color: 0x3a2518, roughness: 0.92 });
    this.metalMat = new THREE.MeshStandardMaterial({ color: 0xb9c8cc, roughness: 0.28, metalness: 0.9, emissive: 0x1a3a42, emissiveIntensity: 0.35 });
    this.goldMat = new THREE.MeshStandardMaterial({ color: 0xc5a35e, roughness: 0.32, metalness: 0.85, emissive: 0x231604, emissiveIntensity: 0.3 });
    this.capeMat = new THREE.MeshStandardMaterial({ color: 0x183b3a, roughness: 0.94, side: THREE.DoubleSide });
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x171410 });

    this.hurtMats = [this.tunicMat, this.tunicDark, this.skinMat, this.leatherMat, this.capeMat];
    for (const m of this.hurtMats) m.userData.baseEmissive = m.emissive ? m.emissive.getHex() : 0x000000;

    // legs
    this.legs = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.16, 0.92, 0);
      this.body.add(leg);
      const trouser = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.48, 3, 7), this.tunicDark);
      trouser.position.y = -0.34;
      trouser.castShadow = true;
      leg.add(trouser);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.2, 0.34), this.leatherMat);
      boot.position.set(0, -0.72, -0.05);
      boot.castShadow = true;
      leg.add(boot);
      const cuff = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.08, 0.23), this.goldMat);
      cuff.position.set(0, -0.61, -0.03);
      leg.add(cuff);
      this.legs.push(leg);
    }

    // torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.78, 7), this.tunicMat);
    torso.position.y = 1.4;
    torso.castShadow = true;
    this.body.add(torso);
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.12, 8), this.leatherMat);
    belt.position.y = 1.04;
    belt.castShadow = true;
    this.body.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.04), this.goldMat);
    buckle.position.set(0, 1.04, -0.365);
    this.body.add(buckle);
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.035), this.leatherMat);
    strap.position.set(0.1, 1.42, -0.33);
    strap.rotation.z = -0.55;
    this.body.add(strap);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.04), this.goldMat);
    chest.position.set(0.22, 1.58, -0.31);
    this.body.add(chest);

    // shoulders
    for (const side of [-1, 1]) {
      const pad = new THREE.Mesh(new THREE.SphereGeometry(0.17, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.62), this.goldMat);
      pad.position.set(side * 0.35, 1.76, 0);
      pad.rotation.z = side * -0.2;
      pad.castShadow = true;
      this.body.add(pad);
    }

    // head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.12, 6), this.skinMat);
    neck.position.y = 1.84;
    this.body.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.215, 9, 7), this.skinMat);
    head.position.set(0, 2.01, -0.01);
    head.castShadow = true;
    this.body.add(head);
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.255, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.72), this.tunicMat);
    hood.position.set(0, 2.04, 0.035);
    hood.rotation.x = 0.18;
    hood.castShadow = true;
    this.body.add(hood);
    const hoodTip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 6), this.tunicMat);
    hoodTip.position.set(0, 2.24, 0.1);
    hoodTip.rotation.x = 0.55;
    hoodTip.castShadow = true;
    this.body.add(hoodTip);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5), this.eyeMat);
      eye.position.set(side * 0.075, 2.01, -0.2);
      this.body.add(eye);
    }

    // cape
    this.capePivot = new THREE.Group();
    this.capePivot.position.set(0, 1.78, 0.18);
    this.body.add(this.capePivot);
    const capeGeo = new THREE.PlaneGeometry(0.62, 1.08, 5, 6);
    const cp = capeGeo.attributes.position;
    for (let i = 0; i < cp.count; i++) {
      const y = cp.getY(i);
      cp.setZ(i, -Math.abs(y) * 0.04 + Math.sin(y * 4) * 0.02);
    }
    capeGeo.computeVertexNormals();
    this.cape = new THREE.Mesh(capeGeo, this.capeMat);
    this.cape.position.y = -0.54;
    this.cape.castShadow = true;
    this.capePivot.add(this.cape);

    // arms
    this.arms = {};
    for (const [name, side] of [['left', -1], ['right', 1]]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.36, 1.7, 0);
      this.body.add(arm);
      const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.42, 3, 7), this.tunicMat);
      sleeve.position.y = -0.3;
      sleeve.castShadow = true;
      arm.add(sleeve);
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.13, 6), this.leatherMat);
      cuff.position.y = -0.53;
      arm.add(cuff);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 7, 5), this.skinMat);
      hand.position.y = -0.62;
      hand.castShadow = true;
      arm.add(hand);
      arm.rotation.x = 0.08;
      arm.rotation.z = side * -0.08;
      this.arms[name] = arm;
    }
    this.arms.right.rotation.x = -0.18;

    // sword
    this.sword = new THREE.Group();
    this.sword.position.set(0, -0.63, 0);
    this.arms.right.add(this.sword);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.2, 6), this.leatherMat);
    grip.position.y = 0.02;
    this.sword.add(grip);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.09), this.goldMat);
    guard.position.y = 0.12;
    guard.castShadow = true;
    this.sword.add(guard);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.085, 1.12, 0.022), this.metalMat);
    blade.position.y = 0.7;
    blade.castShadow = true;
    this.sword.add(blade);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.1, 0.026), new THREE.MeshBasicMaterial({ color: 0x9fe9f5 }));
    edge.position.set(0, 0.7, 0);
    this.sword.add(edge);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.17, 4), this.metalMat);
    tip.position.y = 1.34;
    this.sword.add(tip);
    this.sword.rotation.set(-0.5, 0, 0.18);

    // shield
    this.shield = new THREE.Group();
    this.shield.position.set(-0.1, -0.44, 0);
    this.arms.left.add(this.shield);
    const shieldDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 12), this.tunicDark);
    shieldDisc.rotation.z = Math.PI / 2;
    shieldDisc.position.x = -0.12;
    shieldDisc.castShadow = true;
    this.shield.add(shieldDisc);
    const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.028, 6, 18), this.goldMat);
    shieldRim.rotation.y = Math.PI / 2;
    shieldRim.position.x = -0.155;
    this.shield.add(shieldRim);
    const shieldBoss = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), this.goldMat);
    shieldBoss.position.x = -0.17;
    this.shield.add(shieldBoss);

    // carried torch
    this.torch = new THREE.Group();
    this.torch.position.set(-0.02, -0.62, -0.02);
    this.arms.left.add(this.torch);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.55, 6), this.leatherMat);
    stick.position.y = 0.18;
    this.torch.add(stick);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.055, 0.12, 7), this.goldMat);
    bowl.position.y = 0.48;
    this.torch.add(bowl);
    this.torchFlame = makeSprite(flameTex(), 0xffb45c, 0.9);
    this.torchFlame.scale.set(0.46, 0.9, 1);
    this.torchFlame.position.y = 0.82;
    this.torch.add(this.torchFlame);
    this.torchGlow = makeSprite(glowTex(), 0xff9b52, 0.5);
    this.torchGlow.scale.set(1.4, 1.4, 1);
    this.torchGlow.position.y = 0.65;
    this.torch.add(this.torchGlow);
    this.torchLight = new THREE.PointLight(0xff9b52, 0, 9, 2);
    this.torchLight.position.y = 0.7;
    this.torch.add(this.torchLight);
    this.torch.visible = false;

    // subtle contact shadow
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false });
    this.contact = new THREE.Mesh(new THREE.CircleGeometry(0.5, 20), shadowMat);
    this.contact.rotation.x = -Math.PI / 2;
    this.contact.position.y = 0.02;
    this.root.add(this.contact);

    this.root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  reset(pos) {
    this.pos.copy(pos);
    this.root.position.copy(pos);
    this.root.rotation.set(0, 0, 0);
    this.pivot.rotation.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.yaw = 0;
    this.targetYaw = 0;
    this.velocity.set(0, 0, 0);
    this.health = this.maxHealth;
    this.dead = false;
    this.invuln = 0;
    this.hurtT = 0;
    this.attackTime = 0;
    this.attackBuffer = 0;
    this.rollT = 0;
    this.rollCooldown = 0;
    this.torchLit = false;
    this.torchTime = 0;
    this.setTorch(false);
    this.root.visible = true;
  }

  faceDir(dx, dz) {
    if (Math.abs(dx) + Math.abs(dz) > 0.0001) this.targetYaw = Math.atan2(-dx, -dz);
  }

  forward() {
    return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }

  requestAttack() { this.attackBuffer = 0.34; }
  requestRoll() {
    if (this.rollT > 0 || this.rollCooldown > 0 || this.dead) return;
    this.startRoll();
  }

  startRoll() {
    this.rollT = this.rollDur;
    this.rollCooldown = 0.72;
    this.invuln = Math.max(this.invuln, 0.42);
    this.attackTime = 0;
    this.audio.roll();
    this.effects.dust(this.pos.clone().setY(0.12), 10);
  }

  startAttack(aimYaw = null) {
    if (this.dead) return;
    const chain = this.comboTimer > 0 ? (this.attackIndex + 1) % 3 : 0;
    this.attackIndex = chain;
    this.attackDur = chain === 2 ? 0.46 : 0.34;
    this.attackTime = this.attackDur;
    this.attackStruck = false;
    this.slashSpawned = false;
    this.comboTimer = 0.95;
    this.attackBuffer = 0;
    if (aimYaw !== null) this.targetYaw = aimYaw;
    this.audio.swing(chain);
    this.velocity.addScaledVector(this.forward(), 1.3);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addMaxHealth(amount) {
    this.maxHealth += amount;
    this.health = this.maxHealth;
  }

  damage(amount, sourcePos, game) {
    if (this.dead || this.invuln > 0 || this.rollT > 0) return false;
    this.health -= amount;
    this.invuln = 1.25;
    this.hurtT = 0.24;
    this.audio.hurt();
    const dir = new THREE.Vector3(this.pos.x - sourcePos.x, 0, this.pos.z - sourcePos.z);
    if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
    dir.normalize();
    this.velocity.addScaledVector(dir, 5.5);
    this.effects.impact({ x: this.pos.x, y: 1.1, z: this.pos.z }, '#ff8a70', 12);
    game.onPlayerHurt(amount);
    if (this.health <= 0) {
      this.health = 0;
      this.die(game);
    }
    return true;
  }

  die(game) {
    if (this.dead) return;
    this.dead = true;
    this.rollT = 0;
    this.attackTime = 0;
    this.audio.death();
    game.onPlayerDeath();
  }

  setTorch(lit, color = 0xffb45c) {
    this.torchLit = lit;
    this.torch.visible = lit;
    this.shield.visible = !lit;
    this.torchFlame.material.color.set(color);
    this.torchGlow.material.color.set(color);
    this.torchLight.color.set(color);
    this.torchLight.intensity = 0;
  }

  update(dt, input, camYaw, game) {
    this.invuln = Math.max(0, this.invuln - dt);
    this.rollCooldown = Math.max(0, this.rollCooldown - dt);
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    this.attackBuffer = Math.max(0, this.attackBuffer - dt);

    if (this.dead) {
      this.root.rotation.z = damp(this.root.rotation.z, 1.42, 4, dt);
      this.root.position.y = damp(this.root.position.y, -0.25, 3, dt);
      this.contact.material.opacity = damp(this.contact.material.opacity, 0, 3, dt);
      this.animateIdle(dt, 0);
      return;
    }

    if (input.consumeRoll()) this.requestRoll();
    if (input.consumeAttack()) this.requestAttack();
    if (this.attackBuffer > 0 && this.attackTime <= 0 && this.rollT <= 0) {
      let aim = null;
      const target = game.nearestEnemy(this.pos, 8.5);
      if (target) {
        const dx = target.x - this.pos.x, dz = target.z - this.pos.z;
        if (dx * dx + dz * dz < 64) aim = Math.atan2(-dx, -dz);
      }
      this.startAttack(aim);
    }

    // movement basis
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
    const rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
    let mx = input.moveX, mz = input.moveZ;
    const mag = Math.hypot(mx, mz);
    if (mag > 1) { mx /= mag; mz /= mag; }
    let wx = rx * mx + fx * mz;
    let wz = rz * mx + fz * mz;
    const inputLen = Math.hypot(wx, wz);
    this.moving = inputLen > 0.06 && this.rollT <= 0;
    if (this.attackTime > 0) {
      this.moving = false;
    }

    let displacementX = 0, displacementZ = 0;
    this.pushing = false;

    if (this.rollT > 0) {
      this.rollT = Math.max(0, this.rollT - dt);
      if (this.rollT <= 0) this.pivot.rotation.x = 0;
      const progress = 1 - this.rollT / this.rollDur;
      const speed = 12.5 * (1 - progress * 0.55);
      const dir = inputLen > 0.08 ? new THREE.Vector3(wx, 0, wz).normalize() : this.forward();
      this.rollDir.lerp(dir, 1 - Math.exp(-16 * dt)).normalize();
      displacementX = this.rollDir.x * speed * dt;
      displacementZ = this.rollDir.z * speed * dt;
      this.targetYaw = Math.atan2(-this.rollDir.x, -this.rollDir.z);
      if (Math.random() < 0.7) this.effects.dust(this.pos.clone().setY(0.08), 1, '#a58d67');
    } else if (inputLen > 0.06 && this.attackTime <= 0) {
      let sp = this.speed;
      if (this.attackTime > 0) sp *= 0.25;
      if (this.attackBuffer > 0.05 && this.attackTime <= 0) sp *= 1;
      // pushing rune blocks
      if (game.stone) {
        const push = game.stone.tryPush(this.pos, { x: wx, z: wz }, dt);
        if (push) {
          this.pushing = true;
          wx = push.axis === 'x' ? push.sign : 0;
          wz = push.axis === 'z' ? push.sign : 0;
          sp = 1.55;
        }
      }
      const norm = Math.hypot(wx, wz) || 1;
      wx /= norm; wz /= norm;
      this.velocity.x = damp(this.velocity.x, wx * sp, 16, dt);
      this.velocity.z = damp(this.velocity.z, wz * sp, 16, dt);
      this.targetYaw = Math.atan2(-wx, -wz);
    } else {
      this.velocity.x = damp(this.velocity.x, 0, 14, dt);
      this.velocity.z = damp(this.velocity.z, 0, 14, dt);
    }

    if (this.rollT > 0) {
      this.velocity.set(0, 0, 0);
    } else {
      displacementX = this.velocity.x * dt;
      displacementZ = this.velocity.z * dt;
    }
    const beforeX = this.pos.x, beforeZ = this.pos.z;
    this.world.moveCircle(this.pos, displacementX, displacementZ, this.radius);
    const moved = Math.hypot(this.pos.x - beforeX, this.pos.z - beforeZ);
    if (moved < Math.abs(displacementX) + Math.abs(displacementZ) - 0.01) {
      this.velocity.multiplyScalar(0.55);
    }

    if (this.moving && this.rollT <= 0 && !this.pushing) {
      this.stepDist += moved;
      if (this.stepDist > 1.85) {
        this.stepDist = 0;
        this.audio.step();
      }
    }

    this.yaw = angleLerp(this.yaw, this.targetYaw, 1 - Math.exp(-16 * dt));
    this.root.rotation.y = this.yaw;
    this.root.position.x = this.pos.x;
    this.root.position.z = this.pos.z;
    this.root.position.y = this.rollT > 0 ? Math.sin((1 - this.rollT / this.rollDur) * Math.PI) * 0.22 : 0;

    // attack state
    if (this.attackTime > 0) {
      this.attackTime = Math.max(0, this.attackTime - dt);
      const elapsed = this.attackDur - this.attackTime;
      if (!this.attackStruck && elapsed >= 0.1) {
        this.attackStruck = true;
        const dmg = this.attackIndex === 2 ? 2 : 1;
        game.playerStrike(dmg, 3.05, 1.15);
        this.effects.slash(this.pos.clone(), this.yaw, this.attackIndex === 2 ? '#ffe3a8' : '#b9fff2');
        game.shake(0.09 + this.attackIndex * 0.03);
      }
      if (this.attackTime <= 0 && this.attackBuffer > 0) {
        this.requestAttack();
      }
    }

    // torch fuel is owned by game, visuals by player
    if (this.torchLit) {
      this.torchSpriteT += dt;
      const flick = 0.86 + Math.sin(this.torchSpriteT * 14) * 0.1 + Math.sin(this.torchSpriteT * 29) * 0.05;
      this.torchFlame.scale.set(0.46 * (0.9 + flick * 0.12), 0.9 * (0.9 + flick * 0.13), 1);
      this.torchGlow.material.opacity = 0.38 + flick * 0.15;
      this.torchLight.intensity = damp(this.torchLight.intensity, 9 * flick, 12, dt);
    } else {
      this.torchLight.intensity = damp(this.torchLight.intensity, 0, 8, dt);
    }

    this.contact.position.y = this.rollT > 0 ? 0.02 + this.root.position.y : 0.02;
    this.contact.material.opacity = 0.28;

    this.animate(dt);
  }

  animate(dt) {
    const speed = Math.hypot(this.velocity.x, this.velocity.z);
    const walk = clamp(speed / this.speed, 0, 1);
    if (this.pushing) {
      this.walkPhase += dt * 5.5;
    } else if (this.moving) {
      this.walkPhase += dt * (5.5 + speed * 0.55);
    }
    const swing = Math.sin(this.walkPhase);
    const rollProgress = this.rollT > 0 ? 1 - this.rollT / this.rollDur : 0;

    // roll tumble
    if (this.rollT > 0) {
      this.pivot.rotation.x = -rollProgress * Math.PI * 2;
      this.pivot.position.y = 0.95;
      this.body.position.y = -0.95;
      this.legs[0].rotation.x = 0.4;
      this.legs[1].rotation.x = 0.4;
      this.arms.left.rotation.x = -0.4;
      this.arms.right.rotation.x = -0.4;
      this.capePivot.rotation.x = 0.8;
      return;
    }
    this.pivot.rotation.x = damp(this.pivot.rotation.x, 0, 14, dt);
    this.pivot.position.y = 0.95;
    this.body.position.y = -0.95;

    const breathe = Math.sin(performance.now() * 0.0016) * 0.012;
    this.body.position.y = -0.95 + breathe + (this.pushing ? 0.02 : 0);
    this.body.rotation.z = swing * 0.02 * walk;
    this.body.rotation.x = this.pushing ? -0.14 : this.attackTime > 0 ? 0 : 0;

    if (this.pushing) {
      this.legs[0].rotation.x = swing * 0.4;
      this.legs[1].rotation.x = -swing * 0.4;
      this.arms.left.rotation.x = -0.75;
      this.arms.right.rotation.x = -0.75;
      this.capePivot.rotation.x = 0.1;
      return;
    }

    if (walk > 0.05) {
      this.legs[0].rotation.x = swing * 0.55 * walk;
      this.legs[1].rotation.x = -swing * 0.55 * walk;
      this.arms.left.rotation.x = 0.2 - swing * 0.3 * walk;
      this.arms.right.rotation.x = 0.1 + swing * 0.3 * walk;
      this.capePivot.rotation.x = 0.12 + walk * 0.28 + Math.sin(this.walkPhase * 0.5) * 0.03;
    } else {
      this.legs[0].rotation.x = damp(this.legs[0].rotation.x, 0, 12, dt);
      this.legs[1].rotation.x = damp(this.legs[1].rotation.x, 0, 12, dt);
      this.arms.left.rotation.x = damp(this.arms.left.rotation.x, 0.08, 8, dt);
      this.arms.right.rotation.x = damp(this.arms.right.rotation.x, -0.18, 8, dt);
      this.capePivot.rotation.x = damp(this.capePivot.rotation.x, 0.06 + breathe * 2, 6, dt);
    }

    // attack animation
    if (this.attackTime > 0) {
      const p = 1 - this.attackTime / this.attackDur;
      const arc = Math.sin(clamp(p * 1.25, 0, 1) * Math.PI);
      if (this.attackIndex === 0) {
        this.arms.right.rotation.x = -0.3 - Math.sin(p * Math.PI) * 2.4;
        this.arms.right.rotation.z = -0.6 + p * 1.3;
        this.body.rotation.y = -arc * 0.35;
      } else if (this.attackIndex === 1) {
        this.arms.right.rotation.x = -1.1 + p * 1.8;
        this.arms.right.rotation.z = 0.9 - p * 1.7;
        this.body.rotation.y = arc * 0.5;
      } else {
        this.arms.right.rotation.x = -0.5 - Math.sin(p * Math.PI) * 2.2;
        this.arms.right.rotation.z = 0.5 - p * 1.6;
        this.body.rotation.y = arc * 0.8;
        this.sword.rotation.y = p * Math.PI * 1.7;
      }
      this.capePivot.rotation.x = 0.2 + arc * 0.25;
    } else {
      this.body.rotation.y = damp(this.body.rotation.y, 0, 10, dt);
      this.sword.rotation.y = damp(this.sword.rotation.y, 0, 12, dt);
    }

    // hurt flash
    if (this.hurtT > 0) {
      const k = this.hurtT / 0.24;
      for (const m of this.hurtMats) {
        if (m.emissive) {
          m.emissive.setRGB(0.65 * k, 0.06 * k, 0.02 * k);
          m.emissiveIntensity = 1;
        }
      }
    } else {
      for (const m of this.hurtMats) {
        if (m.emissive) {
          m.emissive.setHex(m.userData.baseEmissive ?? 0x000000);
          m.emissiveIntensity = m === this.tunicMat ? 0 : 1;
        }
      }
    }

    // blink during invulnerability
    if (this.invuln > 0.9) {
      this.body.visible = Math.floor(this.invuln * 22) % 2 === 0;
    } else {
      this.body.visible = true;
    }
  }

  animateIdle(dt, t) {
    this.pivot.rotation.x = damp(this.pivot.rotation.x, 0, 8, dt);
    this.body.visible = true;
  }
}
