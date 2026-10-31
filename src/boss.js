import * as THREE from 'three';
import {
  addBox, addCone, addSphere, addTorus, clamp, damp, lerp, makeGlowTexture, makeSparkTexture,
  pick, rand, standard,
} from './assets.js';

const BOSSES = {
  warden: {
    act: 1,
    name: 'THE ASHEN WARDEN',
    epithet: 'KEEPER OF THE FIRST GATE',
    maxHp: 720,
    speed: 2.35,
    radius: 1.25,
    scale: 1.04,
    color: 0xffbe6a,
    armor: 0x2b2d31,
    armorDark: 0x15171a,
    trim: 0x90743f,
    cloth: 0x42161b,
    eye: 0xffcf86,
    attacks: [
      { id: 'cleave', range: 5.8, min: 0, max: 7.2, windup: 0.82, active: 0.18, recovery: 0.62, damage: 24, arc: 2.45, parryable: true, cooldown: 0.7, weight: 3, kind: 'sweep' },
      { id: 'slam', range: 5.3, min: 0, max: 7.5, windup: 1.08, active: 0.2, recovery: 0.95, damage: 38, aoe: 5.4, parryable: true, cooldown: 1.25, weight: 2, kind: 'slam' },
      { id: 'charge', range: 18, min: 9.5, max: 19, windup: 0.78, active: 0.48, recovery: 0.82, damage: 28, arc: 1.3, parryable: false, cooldown: 1.2, weight: 2, kind: 'charge' },
      { id: 'backhand', range: 4.9, min: 0, max: 5.6, windup: 0.56, active: 0.14, recovery: 0.42, damage: 18, arc: 2.8, parryable: true, cooldown: 0.55, weight: 2, kind: 'sweep' },
    ],
  },
  chorister: {
    act: 2,
    name: 'THE PALE CHORISTER',
    epithet: 'VOICE BENEATH THE VAULT',
    maxHp: 860,
    speed: 3.15,
    radius: 1.0,
    scale: 0.96,
    hover: 0.28,
    color: 0x9fe3ff,
    armor: 0xa8a69d,
    armorDark: 0x56595f,
    trim: 0x9ea7b3,
    cloth: 0x6e6b64,
    eye: 0xa9eaff,
    attacks: [
      { id: 'twin', range: 5.2, min: 0, max: 6.4, windup: 0.5, active: 0.14, recovery: 0.4, damage: 15, arc: 2.7, parryable: true, cooldown: 0.42, weight: 3, kind: 'twin' },
      { id: 'blink', range: 22, min: 5.5, max: 23, windup: 0.62, active: 0.16, recovery: 0.5, damage: 27, arc: 2.1, parryable: true, cooldown: 0.9, weight: 2, kind: 'blink' },
      { id: 'fan', range: 24, min: 7.5, max: 25, windup: 0.82, active: 0.22, recovery: 0.72, damage: 13, parryable: false, cooldown: 1.0, weight: 2, kind: 'fan' },
      { id: 'lunge', range: 10, min: 3.8, max: 11, windup: 0.54, active: 0.28, recovery: 0.48, damage: 20, arc: 1.5, parryable: true, cooldown: 0.72, weight: 2, kind: 'lunge' },
    ],
  },
  king: {
    act: 3,
    name: 'THE HOLLOW KING',
    epithet: 'THE VOW THAT WOULD NOT DIE',
    maxHp: 1180,
    speed: 2.45,
    radius: 1.45,
    scale: 1.14,
    color: 0xff6b30,
    armor: 0x1a1b1f,
    armorDark: 0x0d0e11,
    trim: 0x8f5b32,
    cloth: 0x1d1013,
    eye: 0xff5a25,
    attacks: [
      { id: 'cleave', range: 6.6, min: 0, max: 8, windup: 0.74, active: 0.18, recovery: 0.6, damage: 30, arc: 2.35, parryable: true, cooldown: 0.65, weight: 3, kind: 'sweep' },
      { id: 'slam', range: 5.8, min: 0, max: 8, windup: 1.02, active: 0.2, recovery: 0.9, damage: 44, aoe: 6, parryable: true, cooldown: 1.1, weight: 2, kind: 'slam' },
      { id: 'flurry', range: 5.8, min: 0, max: 7, windup: 0.62, active: 0.56, recovery: 0.82, damage: 16, arc: 2.85, parryable: true, cooldown: 1.2, weight: 2, kind: 'flurry', hits: [0, 0.2, 0.4] },
      { id: 'eruption', range: 22, min: 8, max: 23, windup: 0.92, active: 0.2, recovery: 0.8, damage: 34, parryable: false, cooldown: 1.5, weight: 2, kind: 'eruption' },
    ],
  },
};

export class Boss {
  constructor(scene, effects, audio, game, kind) {
    this.scene = scene;
    this.effects = effects;
    this.audio = audio;
    this.game = game;
    this.kind = kind;
    this.config = BOSSES[kind];
    this.name = this.config.name;
    this.epithet = this.config.epithet;
    this.maxHp = this.config.maxHp;
    this.hp = this.maxHp;
    this.radius = this.config.radius;
    this.speed = this.config.speed;
    this.scale = this.config.scale;
    this.act = this.config.act;
    this.color = this.config.color;
    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.root.add(this.model);
    this.scene.add(this.root);
    this.pos = this.root.position;
    this.spawn = new THREE.Vector3(0, 0.36, -7.5);
    this.pos.copy(this.spawn);
    this.yaw = 0;
    this.root.rotation.y = this.yaw;
    this.state = 'idle';
    this.stateTime = 0;
    this.cooldown = 1.2;
    this.think = 1.5;
    this.attack = null;
    this.attackTime = 0;
    this.hitIndex = 0;
    this.attackHit = false;
    this.staggerMeter = 0;
    this.staggerTimer = 0;
    this.hitFlash = 0;
    this.weaponGlow = 0;
    this.parryCue = false;
    this.phase = 1;
    this.phaseTransition = false;
    this.projectiles = [];
    this.hazards = [];
    this.deadTime = 0;
    this.defeated = false;
    this.hover = 0;
    this.walkPhase = 0;
    this.blink = 0;
    this.tipFlash = 0;
    this.intro = 0;
    this.buildModel();
    this.root.scale.setScalar(this.scale * 1.08);
    this.root.position.y = 0.36;
  }

  get alive() { return this.hp > 0 && this.state !== 'dead'; }
  get isStaggered() { return this.state === 'stagger'; }
  get hpRatio() { return clamp(this.hp / this.maxHp, 0, 1); }

  forward(out = new THREE.Vector3()) {
    return out.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
  }

  buildModel() {
    const c = this.config;
    const armor = standard(this.kind === 'warden' ? 0x44474d : c.armor, { metalness: 0.64, roughness: 0.48 });
    const armorDark = standard(c.armorDark, { metalness: 0.7, roughness: 0.52 });
    const trim = standard(c.trim, { metalness: 0.85, roughness: 0.34 });
    const cloth = standard(c.cloth, { roughness: 0.92, side: THREE.DoubleSide });
    const eyeMat = new THREE.MeshBasicMaterial({ color: c.eye });
    const steel = standard(0xb0b8c0, { metalness: 0.95, roughness: 0.24, emissive: 0x111820, emissiveIntensity: 0.3 });
    this.armor = armor;
    this.armorDark = armorDark;
    this.trim = trim;
    this.eyeMat = eyeMat;
    this.weaponMat = steel;

    this.body = new THREE.Group();
    this.model.add(this.body);
    addBox(this.body, 1.05, 0.55, 0.62, armorDark, 0, 1.62, 0);
    addBox(this.body, 1.1, 0.16, 0.66, trim, 0, 1.88, 0);

    this.torso = new THREE.Group();
    this.torso.position.set(0, 1.86, 0);
    this.body.add(this.torso);
    const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.66, 5, 12), armor);
    chest.position.y = 0.5;
    chest.scale.set(1.22, 1, 0.82);
    chest.castShadow = true;
    this.torso.add(chest);
    addBox(this.torso, 1.3, 0.95, 0.42, armor, 0, 0.53, 0.26);
    addBox(this.torso, 1.0, 0.12, 0.48, trim, 0, 1.0, 0.24);
    addBox(this.torso, 0.88, 0.11, 0.46, trim, 0, 0.18, 0.24);

    this.chestGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.17, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(c.eye).multiplyScalar(0.68) }),
    );
    this.chestGlow.position.set(0, 0.58, 0.49);
    this.chestGlow.scale.setScalar(0.66);
    this.chestGlow.rotation.z = Math.PI / 6;
    this.torso.add(this.chestGlow);

    this.head = new THREE.Group();
    this.head.position.set(0, 1.14, 0.02);
    this.torso.add(this.head);

    if (this.kind === 'chorister') {
      this.buildChoristerHead(armor, armorDark, trim, eyeMat, cloth);
    } else {
      this.buildKnightHead(armor, armorDark, trim, eyeMat);
    }

    for (const side of [-1, 1]) {
      const pauldron = addSphere(this.torso, 0.38, armor, side * 0.82, 0.85, 0, 1.2, 0.8, 1.1);
      pauldron.castShadow = true;
      addBox(this.torso, 0.6, 0.12, 0.55, trim, side * 0.86, 1.1, 0);
      if (this.kind === 'king') {
        addCone(this.torso, 0.12, 0.55, trim, side * 1.05, 1.14, 0, 0, 0, side * 0.5);
        addCone(this.torso, 0.1, 0.38, armorDark, side * 0.95, 1.2, -0.12, -0.2, 0, side * 0.3);
      } else if (this.kind === 'warden') {
        addCone(this.torso, 0.1, 0.42, trim, side * 1.03, 1.14, 0, 0, 0, side * 0.5);
      }
    }

    this.armR = new THREE.Group();
    this.armR.position.set(0.82, 0.82, 0);
    this.torso.add(this.armR);
    const upperR = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.56, 3, 8), armorDark);
    upperR.position.y = -0.36;
    upperR.castShadow = true;
    this.armR.add(upperR);
    this.elbowR = new THREE.Group();
    this.elbowR.position.y = -0.73;
    this.armR.add(this.elbowR);
    const foreR = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.48, 3, 8), armor);
    foreR.position.y = -0.31;
    foreR.castShadow = true;
    this.elbowR.add(foreR);
    addBox(this.elbowR, 0.34, 0.26, 0.34, armorDark, 0, -0.64, 0);

    this.armL = new THREE.Group();
    this.armL.position.set(-0.82, 0.82, 0);
    this.torso.add(this.armL);
    const upperL = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.56, 3, 8), armorDark);
    upperL.position.y = -0.36;
    upperL.castShadow = true;
    this.armL.add(upperL);
    this.elbowL = new THREE.Group();
    this.elbowL.position.y = -0.73;
    this.armL.add(this.elbowL);
    const foreL = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.48, 3, 8), armor);
    foreL.position.y = -0.31;
    foreL.castShadow = true;
    this.elbowL.add(foreL);
    addBox(this.elbowL, 0.34, 0.26, 0.34, armorDark, 0, -0.64, 0);

    if (this.kind === 'chorister') {
      const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.1, 10, 1, true), cloth);
      skirt.position.y = 0.72;
      skirt.castShadow = true;
      this.body.add(skirt);
      this.robe = skirt;
      for (let i = 0; i < 5; i++) {
        const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 1.9), cloth);
        strip.position.set(Math.cos(i * 1.256) * 0.52, 0.5, Math.sin(i * 1.256) * 0.52);
        strip.rotation.y = i * 1.256;
        this.body.add(strip);
      }
    } else {
      for (const side of [-1, 1]) {
        const leg = new THREE.Group();
        leg.position.set(side * 0.38, 1.58, 0);
        this.body.add(leg);
        const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.58, 3, 8), armorDark);
        upper.position.y = -0.38;
        upper.castShadow = true;
        leg.add(upper);
        addSphere(leg, 0.18, armor, 0, -0.72, 0.04, 1, 0.8, 1.1);
        const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.56, 3, 8), armor);
        lower.position.y = -1.02;
        lower.castShadow = true;
        leg.add(lower);
        addBox(leg, 0.38, 0.2, 0.58, armorDark, 0, -1.36, 0.12);
        if (side === 1) this.legR = leg; else this.legL = leg;
      }
    }

    this.capePivot = new THREE.Group();
    this.capePivot.position.set(0, 0.98, -0.4);
    this.torso.add(this.capePivot);
    const cape = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 2.65, 6, 10), cloth);
    cape.position.y = -1.22;
    cape.rotation.x = 0.08;
    cape.castShadow = true;
    this.capePivot.add(cape);
    this.cape = cape;
    const capeEdge = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.12), trim);
    capeEdge.position.set(0, -2.48, 0.01);
    cape.add(capeEdge);

    this.weapon = new THREE.Group();
    this.weapon.position.set(0, -0.66, 0.05);
    this.elbowR.add(this.weapon);
    this.buildWeapon(steel, trim, armorDark);

    if (this.kind === 'chorister') {
      this.weaponL = new THREE.Group();
      this.weaponL.position.set(0, -0.66, 0.05);
      this.elbowL.add(this.weaponL);
      this.buildTwinBlade(this.weaponL, steel, trim);
      this.halo = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 4, 48), new THREE.MeshBasicMaterial({ color: c.eye, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }));
      this.halo.position.set(0, 1.5, -0.15);
      this.halo.rotation.x = 0.35;
      this.torso.add(this.halo);
    }

    if (this.kind === 'king') {
      const crown = new THREE.Group();
      crown.position.set(0, 1.45, 0);
      this.head.add(crown);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        addCone(crown, 0.075, 0.45 + (i % 2) * 0.25, trim, Math.cos(a) * 0.32, 0.2, Math.sin(a) * 0.32, 0, 0, Math.cos(a) * 0.3);
      }
      const crackMat = new THREE.MeshBasicMaterial({ color: 0xff5b22 });
      for (let i = 0; i < 5; i++) {
        const crack = addBox(this.torso, 0.045, rand(0.3, 0.7), 0.03, crackMat, rand(-0.42, 0.42), rand(0.2, 0.95), 0.5, 0, 0, rand(-0.5, 0.5));
        crack.castShadow = false;
      }
    }

    this.aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(256, 'rgba(255,255,255,0.75)', 'rgba(0,0,0,0)'), color: c.color, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.aura.position.set(0, 2.25, -1.1);
    this.aura.scale.set(4.6, 6.2, 1);
    this.model.add(this.aura);

    this.light = new THREE.PointLight(c.color, 5, 8, 2);
    this.light.position.set(0, 2.6, -1.1);
    this.model.add(this.light);

    this.weaponTipGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture(128, 'rgba(255,255,255,1)', 'rgba(255,210,140,0)'),
      color: 0xfff4d6,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    }));
    this.weaponTipGlow.position.set(0, this.kind === 'king' ? 2.55 : 3.15, 0);
    this.weaponTipGlow.renderOrder = 12;
    this.weapon.add(this.weaponTipGlow);

    this.root.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
  }

  buildKnightHead(armor, armorDark, trim, eyeMat) {
    const helm = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.26, 4, 12), armor);
    helm.position.y = 0.22;
    helm.castShadow = true;
    this.head.add(helm);
    addBox(this.head, 0.58, 0.16, 0.12, armorDark, 0, 0.25, 0.27);
    addBox(this.head, 0.42, 0.035, 0.02, eyeMat, 0, 0.26, 0.34);
    addCone(this.head, 0.1, 0.7, trim, -0.4, 0.55, 0, 0, 0, -0.55);
    addCone(this.head, 0.1, 0.7, trim, 0.4, 0.55, 0, 0, 0, 0.55);
    addCone(this.head, 0.08, 0.42, armorDark, 0, 0.55, -0.18, -0.2, 0, 0);
    addBox(this.head, 0.18, 0.22, 0.4, armorDark, 0, 0.06, -0.06);
  }

  buildChoristerHead(armor, armorDark, trim, eyeMat, cloth) {
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.95, 8), cloth);
    hood.position.y = 0.32;
    hood.rotation.x = 0.06;
    hood.castShadow = true;
    this.head.add(hood);
    const mask = new THREE.Mesh(new THREE.CircleGeometry(0.23, 16), standard(0xd8d3c4, { roughness: 0.5, metalness: 0.1 }));
    mask.position.set(0, 0.2, 0.31);
    this.head.add(mask);
    for (const side of [-1, 1]) {
      const eye = addBox(this.head, 0.07, 0.025, 0.02, eyeMat, side * 0.09, 0.25, 0.335);
      eye.rotation.z = side * 0.2;
    }
    addBox(this.head, 0.1, 0.28, 0.05, trim, 0, 0.08, 0.32);
  }

  buildWeapon(steel, trim, armorDark) {
    const kind = this.kind;
    if (kind === 'king') {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 2.2, 8), standard(0x241711, { roughness: 0.9 }));
      handle.position.y = 0.45;
      this.weapon.add(handle);
      addBox(this.weapon, 0.75, 0.14, 0.22, trim, 0, 1.55, 0);
      const blade = addBox(this.weapon, 0.85, 1.55, 0.1, steel, 0.12, 2.28, 0, 0, 0, -0.12);
      blade.castShadow = true;
      addBox(this.weapon, 0.26, 1.1, 0.08, armorDark, -0.34, 2.28, 0, 0, 0, 0.25);
      addCone(this.weapon, 0.24, 0.6, steel, 0.54, 2.98, 0, 0, 0, -0.3);
      this.blade = blade;
      this.bladeLen = 3.1;
    } else {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.55, 8), standard(0x241711, { roughness: 0.9 }));
      grip.position.y = 0.1;
      this.weapon.add(grip);
      addBox(this.weapon, 0.75, 0.1, 0.16, trim, 0, 0.36, 0);
      addSphere(this.weapon, 0.09, trim, 0, -0.2, 0);
      const blade = addBox(this.weapon, 0.2, 2.65, 0.07, steel, 0, 1.7, 0);
      blade.castShadow = true;
      addCone(this.weapon, 0.1, 0.48, steel, 0, 3.15, 0);
      addBox(this.weapon, 0.035, 2.1, 0.075, new THREE.MeshBasicMaterial({ color: this.config.eye }), 0, 1.7, 0.005);
      this.blade = blade;
      this.bladeLen = 3.3;
    }
  }

  buildTwinBlade(group, steel, trim) {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.45, 8), standard(0x241711, { roughness: 0.9 }));
    group.add(grip);
    addBox(group, 0.44, 0.07, 0.1, trim, 0, 0.24, 0);
    const blade = addBox(group, 0.1, 1.8, 0.04, steel, 0, 1.16, 0, 0, 0, 0.04);
    blade.castShadow = true;
    addCone(group, 0.05, 0.34, steel, 0.04, 2.16, 0, 0, 0, 0.04);
    addBox(group, 0.02, 1.4, 0.045, new THREE.MeshBasicMaterial({ color: this.config.eye }), 0.015, 1.15, 0.005);
  }

  clearHazards() {
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    }
    this.projectiles.length = 0;
    for (const h of this.hazards) {
      if (h.mesh) { this.scene.remove(h.mesh); h.mesh.geometry.dispose(); h.mesh.material.dispose(); }
      if (h.ring) { this.scene.remove(h.ring); h.ring.geometry.dispose(); h.ring.material.dispose(); }
    }
    this.hazards.length = 0;
  }

  spawnAt(pos) {
    this.clearHazards();
    this.pos.copy(pos);
    this.root.position.copy(pos);
    this.root.position.y = 0.36;
    this.state = 'idle';
    this.stateTime = 0;
    this.cooldown = 1.4;
    this.hp = this.maxHp;
    this.staggerMeter = 0;
    this.phase = 1;
    this.phaseTransition = false;
    this.defeated = false;
    this.attack = null;
    this.staggerTimer = 0;
    this.blink = 0;
    this.windupSound = false;
    this.blinked = false;
    this.model.visible = true;
    this.model.position.y = 0;
    this.root.rotation.set(0, 0, 0);
  }

  chooseAttack(player) {
    const dist = this.distanceTo(player.pos);
    const pool = this.config.attacks.filter((a) => dist >= a.min && dist <= a.max && (!a.phase2 || this.phase === 2));
    if (!pool.length) return null;
    const total = pool.reduce((s, a) => s + (a.weight || 1), 0);
    let r = Math.random() * total;
    for (const a of pool) {
      r -= (a.weight || 1);
      if (r <= 0) return a;
    }
    return pick(pool);
  }

  beginAttack(attack) {
    this.attack = attack;
    this.state = 'windup';
    this.stateTime = 0;
    this.attackTime = 0;
    this.hitIndex = 0;
    this.attackHit = false;
    this.parryCue = false;
    this.weaponGlow = 0;
    this.windupSound = false;
    this.blinked = false;
    this.game.bossTelegraph(this, attack);
    this.audio.whoosh();
  }

  update(dt, player) {
    this.stateTime += dt;
    this.attackTime += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt * 4);
    this.weaponGlow = Math.max(0, this.weaponGlow - dt * 3.2);
    this.tipFlash = Math.max(0, this.tipFlash - dt * 5);
    this.updateProjectiles(dt, player);
    this.updateHazards(dt, player);
    this.hover = this.config.hover ? this.config.hover + Math.sin(this.game.time * 1.8 + 2) * 0.09 : 0;

    if (this.state === 'dead') {
      this.deadTime += dt;
      this.animate(dt, player);
      this.updateGlow(dt);
      return;
    }

    if (this.hp <= this.maxHp * 0.5 && this.phase === 1 && this.kind === 'king') {
      this.enterPhaseTwo();
    }

    this.cooldown = Math.max(0, this.cooldown - dt);
    const dist = this.distanceTo(player.pos);
    this.parryCue = false;

    switch (this.state) {
      case 'idle': {
        this.face(player, dt, 3.2);
        this.think -= dt;
        if (this.think <= 0 && this.cooldown <= 0) {
          const attack = this.chooseAttack(player);
          if (attack) this.beginAttack(attack);
          else if (dist > 6) {
            this.state = 'approach';
            this.stateTime = 0;
            this.think = rand(0.6, 1.4);
          } else {
            this.think = rand(0.25, 0.6);
          }
        }
        break;
      }
      case 'approach': {
        this.face(player, dt, 5);
        const forward = this.forward();
        const step = this.speed * dt;
        if (dist > 4.8) {
          this.pos.x += forward.x * step;
          this.pos.z += forward.z * step;
        }
        this.walkPhase += dt * 7;
        if (this.stateTime > 1.6 || dist < 4.9) {
          this.state = 'idle';
          this.stateTime = 0;
          this.think = rand(0.05, 0.3);
        }
        break;
      }
      case 'windup': {
        const a = this.attack;
        this.face(player, dt, 1.6);
        const p = clamp(this.stateTime / a.windup, 0, 1);
        this.weaponGlow = p > 0.5 ? (p - 0.5) * 2 : 0;
        // Cue consistently 0.24s before impact so it lines up with the parry window.
        if (a.parryable && this.stateTime >= a.windup - 0.24) this.parryCue = true;
        if (a.kind === 'blink' && p > 0.38 && !this.blinked) {
          this.blinked = true;
          this.blink = 1;
          this.teleportBehind(player);
          this.effects.flash(new THREE.Vector3(this.pos.x, 1.6, this.pos.z), { color: 0xbdeeff, size: 4, life: 0.4 });
        }
        if (p > 0.7 && !this.windupSound) {
          this.windupSound = true;
          this.audio.whoosh();
          this.tipFlash = 1;
        }
        if (this.stateTime >= a.windup) {
          this.state = 'active';
          this.stateTime = 0;
          this.windupSound = false;
          this.blinked = false;
          this.doImpact(player);
        }
        break;
      }
      case 'active': {
        const a = this.attack;
        if (a.kind === 'charge') {
          const forward = this.forward();
          this.pos.x += forward.x * 14 * dt;
          this.pos.z += forward.z * 14 * dt;
          if (!this.attackHit) this.strikePlayer(player, a);
        }
        if (a.kind === 'lunge') {
          const forward = this.forward();
          this.pos.x += forward.x * 8 * dt;
          this.pos.z += forward.z * 8 * dt;
        }
        if (a.kind === 'flurry') {
          for (let i = this.hitIndex; i < a.hits.length; i++) {
            if (this.state !== 'active') break;
            if (this.stateTime >= a.hits[i]) {
              this.hitIndex = i + 1;
              this.strikePlayer(player, a, 0.05);
            }
          }
        }
        if (this.stateTime >= a.active) {
          this.state = 'recovery';
          this.stateTime = 0;
        }
        break;
      }
      case 'recovery': {
        this.face(player, dt, 1.2);
        if (this.stateTime >= this.attack.recovery) {
          this.state = 'idle';
          this.stateTime = 0;
          this.cooldown = this.attack.cooldown * (this.phase === 2 ? 0.65 : 1);
          this.think = rand(0.15, 0.55);
          this.attack = null;
          this.windupSound = false;
        }
        break;
      }
      case 'stagger': {
        this.staggerTimer -= dt;
        if (this.staggerTimer <= 0) {
          this.state = 'idle';
          this.stateTime = 0;
          this.cooldown = 0.4;
          this.staggerMeter = 0;
          this.game.bossRecovered(this);
        }
        break;
      }
      case 'phase': {
        if (this.stateTime > 2.1) {
          this.state = 'idle';
          this.stateTime = 0;
          this.cooldown = 0.6;
          this.think = 0.2;
        }
        break;
      }
    }

    if (this.state !== 'dead') {
      this.pos.x = clamp(this.pos.x, -21, 21);
      this.pos.z = clamp(this.pos.z, -21, 21);
      const centerDist = Math.hypot(this.pos.x, this.pos.z);
      if (centerDist > 21) {
        this.pos.x *= 21 / centerDist;
        this.pos.z *= 21 / centerDist;
      }
      this.root.position.set(this.pos.x, 0.36 + this.hover, this.pos.z);
      this.root.rotation.y = this.yaw;
      this.animate(dt, player);
      this.updateGlow(dt);
    }
  }

  updateGlow(dt) {
    const p = this.state === 'windup' ? clamp(this.stateTime / this.attack.windup, 0, 1) : 0;
    const active = this.state === 'active' ? 1 : 0;
    const glow = Math.max(this.weaponGlow * 2.5, this.tipFlash * 2.5, active * 0.6);
    if (this.weaponMat) this.weaponMat.emissiveIntensity = 0.3 + glow * 5.5;
    if (this.weaponMat) this.weaponMat.emissive.setHex(glow > 1.4 ? 0xfff0c0 : this.config.eye);
    if (this.weaponTipGlow) {
      this.weaponTipGlow.material.opacity = clamp(this.weaponGlow * 1.8 + this.tipFlash, 0, 1);
      this.weaponTipGlow.scale.setScalar(0.85 + this.tipFlash * 1.8 + this.weaponGlow * 0.5);
    }
    if (this.eyeMat) this.eyeMat.color.setHex(this.hitFlash > 0.2 ? 0xffffff : this.config.eye);
    if (this.aura) {
      this.aura.material.opacity = 0.055 + Math.sin(this.game.time * 2.2) * 0.015 + (this.phase === 2 ? 0.06 : 0) + this.weaponGlow * 0.08;
    }
    if (this.light) this.light.intensity = 5 + Math.sin(this.game.time * 3) * 1.2 + this.weaponGlow * 15 + (this.phase === 2 ? 8 : 0);
    if (this.chestGlow) this.chestGlow.scale.setScalar(1 + this.weaponGlow * 0.7 + Math.sin(this.game.time * 2.8) * 0.08);
    if (this.halo) {
      this.halo.rotation.z += dt * 0.4;
      this.halo.material.opacity = 0.45 + Math.sin(this.game.time * 2) * 0.15;
    }
  }

  face(player, dt, speed) {
    const target = Math.atan2(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    let diff = target - this.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.yaw += diff * Math.min(1, dt * speed);
  }

  distanceTo(pos) {
    return Math.hypot(pos.x - this.pos.x, pos.z - this.pos.z);
  }

  doImpact(player) {
    const a = this.attack;
    if (!a) return;
    this.tipFlash = 1;
    this.effects.flash(new THREE.Vector3(this.pos.x, 2.2, this.pos.z), { color: this.config.color, size: 2.4, life: 0.25 });
    if (a.kind === 'slam') {
      this.strikePlayer(player, a, 0);
      if (this.state === 'stagger') return;
      this.effects.ring(this.pos, { color: this.config.color, radius: a.aoe, life: 0.65, width: 0.2 });
      this.effects.burst(new THREE.Vector3(this.pos.x, 0.7, this.pos.z), { color: this.config.color, count: 36, speed: 7, size: 0.13, gravity: 4 });
      this.spawnShockwave(this.pos.clone(), a.aoe, 24, this.config.color);
    } else if (a.kind === 'sweep' || a.kind === 'twin' || a.kind === 'blink' || a.kind === 'lunge' || a.kind === 'flurry') {
      this.effects.slash(new THREE.Vector3(this.pos.x, this.pos.y || 0.36, this.pos.z), this.yaw, { radius: a.range || 4, arc: a.arc || 2.4, color: this.config.color, life: 0.2, y: 1.5, scale: 1.2 });
    } else if (a.kind === 'fan') {
      this.castFan(player);
    } else if (a.kind === 'eruption') {
      this.castEruption(player);
    }
    if (['sweep', 'twin', 'blink', 'lunge'].includes(a.kind)) {
      this.strikePlayer(player, a, 0);
    }
  }

  strikePlayer(player, a, grace = 0) {
    const dist = this.distanceTo(player.pos);
    const toPlayer = new THREE.Vector3(player.pos.x - this.pos.x, 0, player.pos.z - this.pos.z).normalize();
    const dot = this.forward().dot(toPlayer);
    const hitRange = a.aoe || (a.kind === 'charge' ? 2.8 : a.kind === 'lunge' ? 3.4 : (a.range || 5));
    const inRange = dist <= hitRange + player.radius;
    const inArc = a.aoe || !a.arc || dot > Math.cos(a.arc / 2);
    if (!inRange || !inArc) return;
    if (player.isParryActive && a.parryable) {
      this.game.bossParried(this, player);
      return;
    }
    if (player.state === 'roll' && player.invuln > 0) return;
    this.hitPlayer(player, a);
  }

  hitPlayer(player, a) {
    if (this.attackHit && this.attack && this.attack.kind !== 'flurry') return;
    if (this.attack && this.attack.kind !== 'flurry') this.attackHit = true;
    player.takeDamage(a.damage, this.pos, { unblockable: !a.parryable });
  }

  castFan(player) {
    const count = 5;
    const base = Math.atan2(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.18;
      this.spawnProjectile(base + spread);
    }
    this.audio.cast();
    this.effects.flash(new THREE.Vector3(this.pos.x, 2.4, this.pos.z), { color: 0xa9eaff, size: 3.4, life: 0.45 });
  }

  spawnProjectile(angle) {
    const geo = new THREE.SphereGeometry(0.18, 8, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xbcefff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(this.pos.x, 2.2, this.pos.z);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(128, 'rgba(190,240,255,0.9)', 'rgba(80,160,255,0)'), transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.setScalar(1.8);
    mesh.add(glow);
    this.scene.add(mesh);
    const speed = 11;
    this.projectiles.push({ mesh, vel: new THREE.Vector3(Math.sin(angle) * speed, 0, Math.cos(angle) * speed), life: 3.4, damage: 13, hit: false });
  }

  updateProjectiles(dt, player) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.y += dt * 8;
      const dx = p.mesh.position.x - player.pos.x;
      const dz = p.mesh.position.z - player.pos.z;
      if (!p.hit && Math.hypot(dx, dz) < 0.75 && Math.abs(p.mesh.position.y - (player.pos.y + 1.1)) < 1.4) {
        p.hit = true;
        if (!(player.state === 'roll' && player.invuln > 0)) player.takeDamage(p.damage, p.mesh.position, { unblockable: true });
        this.effects.burst(p.mesh.position, { color: 0xa9eaff, count: 16, speed: 4, size: 0.1, gravity: 2, life: 0.5 });
      }
      if (p.life <= 0 || p.hit || Math.hypot(p.mesh.position.x, p.mesh.position.z) > 26) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.projectiles.splice(i, 1);
      }
    }
  }

  spawnShockwave(pos, maxRadius, damage, color) {
    const geo = new THREE.RingGeometry(0.93, 1, 64);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, 0.45, pos.z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.scale.setScalar(0.6);
    this.scene.add(mesh);
    this.hazards.push({ type: 'wave', mesh, radius: 0.6, maxRadius, speed: 13, damage, hit: false, life: 1.3, color });
  }

  castEruption(player) {
    this.audio.cast();
    for (let i = 0; i < 2; i++) {
      const offset = i === 0 ? 0 : rand(-3, 3);
      const pos = new THREE.Vector3(player.pos.x + offset, 0.42, player.pos.z + (i === 0 ? 0 : rand(-3, 3)));
      const geo = new THREE.CircleGeometry(2.6, 32);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff4f1e, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.copy(pos);
      this.scene.add(mesh);
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.5, 2.7, 48), new THREE.MeshBasicMaterial({ color: 0xffa45e, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(pos);
      this.scene.add(ring);
      this.hazards.push({ type: 'eruption', mesh, ring, pos, timer: 0.95, radius: 2.7, damage: 34, exploded: false, life: 1.6 });
    }
  }

  updateHazards(dt, player) {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.life -= dt;
      if (h.type === 'wave') {
        h.radius += h.speed * dt;
        h.mesh.scale.setScalar(h.radius);
        h.mesh.material.opacity = clamp(1 - h.radius / h.maxRadius, 0, 1) * 0.85;
        const d = this.distanceTo(player.pos);
        if (!h.hit && Math.abs(d - h.radius) < 0.8 && player.invuln <= 0) {
          h.hit = true;
          player.takeDamage(h.damage, this.pos, { unblockable: true });
          this.effects.burst(new THREE.Vector3(player.pos.x, 0.6, player.pos.z), { color: h.color, count: 24, speed: 4, size: 0.12, gravity: 5 });
        }
        if (h.radius >= h.maxRadius || h.life <= 0) {
          this.scene.remove(h.mesh);
          h.mesh.geometry.dispose();
          h.mesh.material.dispose();
          this.hazards.splice(i, 1);
        }
      } else if (h.type === 'eruption') {
        h.timer -= dt;
        const p = clamp(1 - h.timer / 0.95, 0, 1);
        h.mesh.material.opacity = 0.12 + p * 0.22 + Math.sin(this.game.time * 20) * 0.05;
        h.mesh.scale.setScalar(0.5 + p * 0.5);
        if (!h.exploded && h.timer <= 0) {
          h.exploded = true;
          h.mesh.material.opacity = 0.7;
          this.effects.flash(h.pos, { color: 0xff6a22, size: 6, life: 0.6, y: 0.5 });
          this.effects.ring(h.pos, { color: 0xff6a22, radius: h.radius + 1, life: 0.6 });
          this.effects.burst(new THREE.Vector3(h.pos.x, 0.6, h.pos.z), { color: 0xff7a2e, count: 60, speed: 9, size: 0.15, gravity: 5, life: 1.1 });
          this.audio.hit(true);
          if (Math.hypot(player.pos.x - h.pos.x, player.pos.z - h.pos.z) < h.radius && player.invuln <= 0) {
            player.takeDamage(h.damage, h.pos, { unblockable: true });
          }
          h.mesh.material.opacity = 0.35;
        }
        if (h.life <= 0) {
          this.scene.remove(h.mesh);
          this.scene.remove(h.ring);
          h.mesh.geometry.dispose();
          h.mesh.material.dispose();
          h.ring.geometry.dispose();
          h.ring.material.dispose();
          this.hazards.splice(i, 1);
        }
      }
    }
  }

  teleportBehind(player) {
    const forward = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
    this.pos.set(player.pos.x - forward.x * 3.2, 0.36, player.pos.z - forward.z * 3.2);
    this.yaw = Math.atan2(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    this.blink = 1;
  }

  enterPhaseTwo() {
    this.phase = 2;
    this.state = 'phase';
    this.stateTime = 0;
    this.attack = null;
    this.weaponGlow = 1;
    this.audio.roar(true);
    this.game.bossPhaseTwo(this);
    this.effects.ring(this.pos, { color: 0xff5b22, radius: 10, life: 1.2 });
    this.effects.flash(new THREE.Vector3(this.pos.x, 2.4, this.pos.z), { color: 0xff6b30, size: 8, life: 0.8 });
    this.effects.burst(new THREE.Vector3(this.pos.x, 1.2, this.pos.z), { color: 0xff5b22, count: 100, speed: 11, size: 0.18, gravity: 2, life: 1.6 });
    this.game.cameraShake(0.8);
  }

  takeDamage(amount, poise = 0, player = null, kind = 'light') {
    if (!this.alive) return;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 1;
    this.staggerMeter += poise;
    this.game.updateBossUI(this);
    if (kind === 'riposte') {
      this.staggerTimer = Math.max(this.staggerTimer, 1.2);
      this.staggerMeter = 0;
    }
    if (this.hp <= 0) {
      this.die();
      return;
    }
    if (this.staggerMeter >= 100 && this.state !== 'stagger' && this.state !== 'phase') {
      this.stagger();
    }
  }

  stagger() {
    this.state = 'stagger';
    this.stateTime = 0;
    this.staggerTimer = 2.55;
    this.staggerMeter = 0;
    this.attack = null;
    this.parryCue = false;
    this.weaponGlow = 0;
    this.audio.roar(false);
    this.effects.ring(this.pos, { color: 0xffe0a0, radius: 6, life: 0.8 });
    this.effects.burst(new THREE.Vector3(this.pos.x, 2.1, this.pos.z), { color: 0xffe0a0, count: 45, speed: 7, size: 0.13, gravity: 3 });
    this.game.bossStaggered(this);
    this.game.cameraShake(0.35);
  }

  die() {
    if (this.defeated) return;
    this.defeated = true;
    this.state = 'dead';
    this.stateTime = 0;
    this.deadTime = 0;
    this.attack = null;
    this.parryCue = false;
    this.audio.bossDeath();
    this.effects.flash(new THREE.Vector3(this.pos.x, 2.2, this.pos.z), { color: this.config.color, size: 9, life: 0.9 });
    this.effects.ring(this.pos, { color: this.config.color, radius: 12, life: 1.3 });
    this.effects.burst(new THREE.Vector3(this.pos.x, 2.0, this.pos.z), { color: this.config.color, count: 120, speed: 10, size: 0.16, gravity: 2, life: 1.8 });
    this.game.cameraShake(0.9);
    this.game.bossDefeated(this);
  }

  animate(dt, player) {
    const t = this.game.time;
    this.walkPhase += dt * (this.state === 'approach' ? 8 : 2.2);
    const ph = this.walkPhase;
    const bob = Math.sin(t * 1.8) * 0.012;

    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.model.position.y = 0;
    this.torso.position.y = 1.86 + bob;
    this.torso.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);
    this.armR.rotation.set(-0.18, 0, 0.18);
    this.armL.rotation.set(-0.12, 0, -0.18);
    this.elbowR.rotation.set(0.12, 0, 0);
    this.elbowL.rotation.set(0.12, 0, 0);
    this.cape.rotation.set(0.08, 0, 0);
    this.capePivot.rotation.set(0, 0, 0);
    if (this.legR) this.legR.rotation.set(0, 0, 0);
    if (this.legL) this.legL.rotation.set(0, 0, 0);
    if (this.weapon) this.weapon.rotation.set(0, 0, 0);
    if (this.weaponL) this.weaponL.rotation.set(0, 0, 0);
    if (this.halo) this.halo.position.y = 1.5 + Math.sin(t * 1.2) * 0.05;

    if (this.state === 'approach' || this.state === 'idle') {
      const moving = this.state === 'approach';
      const amp = moving ? 1 : 0.12;
      if (this.legR) {
        this.legR.rotation.x = Math.sin(ph) * 0.48 * amp;
        this.legL.rotation.x = -Math.sin(ph) * 0.48 * amp;
      }
      this.armR.rotation.x = -0.18 - Math.sin(ph) * 0.2 * amp;
      this.armL.rotation.x = -0.12 + Math.sin(ph) * 0.2 * amp;
      this.torso.rotation.z = Math.sin(ph * 2) * 0.025 * amp;
      this.cape.rotation.x = 0.08 + (moving ? 0.16 : 0.02) + Math.sin(t * 1.4) * 0.03;
      this.model.position.y = moving ? Math.abs(Math.sin(ph)) * 0.03 : 0;
    }

    if (this.state === 'windup' && this.attack) {
      const a = this.attack;
      const p = clamp(this.stateTime / a.windup, 0, 1);
      const e = p * p * (3 - 2 * p);
      if (a.kind === 'slam') {
        this.armR.rotation.x = lerp(-0.2, -2.9, e);
        this.armR.rotation.z = lerp(0.18, 0.55, e);
        this.elbowR.rotation.x = lerp(0.12, 0.6, e);
        this.torso.rotation.x = lerp(0, -0.16, e);
        this.torso.rotation.y = lerp(0, -0.25, e);
        this.armL.rotation.x = lerp(-0.12, -0.9, e);
        this.cape.rotation.x = 0.1 + e * 0.3;
      } else if (a.kind === 'fan' || a.kind === 'eruption') {
        this.armR.rotation.x = lerp(-0.2, -2.6, e);
        this.armL.rotation.x = lerp(-0.12, -2.6, e);
        this.armR.rotation.z = lerp(0.18, 0.45, e);
        this.armL.rotation.z = lerp(-0.18, -0.45, e);
        this.torso.rotation.x = lerp(0, -0.12, e);
        this.head.rotation.x = lerp(0, -0.2, e);
      } else if (a.kind === 'charge') {
        this.armR.rotation.x = lerp(-0.2, -1.2, e);
        this.armR.rotation.z = lerp(0.18, 0.6, e);
        this.torso.rotation.x = lerp(0, 0.25, e);
        this.body.position.y = -e * 0.18;
        if (this.legR) { this.legR.rotation.x = 0.4 * e; this.legL.rotation.x = -0.5 * e; }
      } else if (a.kind === 'twin') {
        this.armR.rotation.x = lerp(-0.2, -1.9, e);
        this.armL.rotation.x = lerp(-0.12, -1.7, e);
        this.armR.rotation.z = lerp(0.18, 0.7, e);
        this.armL.rotation.z = lerp(-0.18, -0.7, e);
        this.torso.rotation.y = lerp(0, -0.55, e);
      } else {
        this.armR.rotation.x = lerp(-0.2, -2.45, e);
        this.armR.rotation.z = lerp(0.18, 0.7, e);
        this.elbowR.rotation.x = lerp(0.12, 0.4, e);
        this.torso.rotation.y = lerp(0, -0.75, e);
        this.torso.rotation.x = lerp(0, 0.12, e);
        this.armL.rotation.x = lerp(-0.12, -0.7, e);
        this.cape.rotation.x = 0.1 + e * 0.25;
      }
      this.head.rotation.y = -this.torso.rotation.y * 0.4;
    } else if (this.state === 'active' && this.attack) {
      const a = this.attack;
      const p = clamp(this.stateTime / a.active, 0, 1);
      const e = 1 - Math.pow(1 - p, 2);
      if (a.kind === 'slam') {
        this.armR.rotation.x = lerp(-2.9, 1.15, e);
        this.armR.rotation.z = lerp(0.55, -0.1, e);
        this.torso.rotation.x = lerp(-0.16, 0.55, e);
        this.torso.rotation.y = lerp(-0.25, 0.3, e);
        this.body.position.y = -Math.sin(p * Math.PI) * 0.12;
      } else if (a.kind === 'fan' || a.kind === 'eruption') {
        this.armR.rotation.x = lerp(-2.6, -0.2, e);
        this.armL.rotation.x = lerp(-2.6, -0.2, e);
        this.torso.rotation.x = lerp(-0.12, 0.18, e);
      } else if (a.kind === 'twin') {
        this.armR.rotation.x = lerp(-1.9, 0.7, e);
        this.armL.rotation.x = lerp(-1.7, 0.4, e);
        this.torso.rotation.y = lerp(-0.55, 0.65, e);
      } else if (a.kind === 'flurry') {
        const s = Math.sin(p * Math.PI * 3);
        this.armR.rotation.x = -1.4 + s * 1.9;
        this.armL.rotation.x = -1.3 - s * 1.6;
        this.torso.rotation.y = s * 0.7;
        this.torso.rotation.x = 0.2;
      } else if (a.kind === 'charge') {
        this.armR.rotation.x = -1.0;
        this.armR.rotation.z = 0.8;
        this.torso.rotation.x = 0.35;
        this.body.position.y = -0.1;
      } else {
        this.armR.rotation.x = lerp(-2.45, 0.85, e);
        this.armR.rotation.z = lerp(0.7, -0.15, e);
        this.torso.rotation.y = lerp(-0.75, 0.72, e);
        this.torso.rotation.x = lerp(0.12, 0.38, e);
        this.armL.rotation.x = lerp(-0.7, -0.15, e);
        this.cape.rotation.x = 0.3 + e * 0.3;
      }
      if (this.legR) this.legR.rotation.x = -0.25 * e;
      if (this.legL) this.legL.rotation.x = 0.3 * e;
    } else if (this.state === 'recovery') {
      const p = clamp(this.stateTime / this.attack.recovery, 0, 1);
      const e = 1 - p;
      this.armR.rotation.x = -0.2 - e * 0.8;
      this.torso.rotation.x = e * 0.2;
      this.torso.rotation.y = e * 0.15;
    } else if (this.state === 'stagger') {
      const p = Math.sin(clamp(this.stateTime / 0.45, 0, 1) * Math.PI / 2);
      this.body.position.y = -0.28 * p;
      this.torso.rotation.x = 0.55 * p;
      this.torso.rotation.z = -0.12 * p;
      this.head.rotation.x = 0.4 * p;
      this.armR.rotation.x = 0.35 * p;
      this.armL.rotation.x = 0.3 * p;
      this.armR.rotation.z = 0.45 * p;
      this.armL.rotation.z = -0.45 * p;
      if (this.legR) { this.legR.rotation.x = -0.4 * p; this.legL.rotation.x = -0.5 * p; }
      this.cape.rotation.x = 0.05;
    } else if (this.state === 'phase') {
      const p = Math.sin(clamp(this.stateTime / 2.1, 0, 1) * Math.PI);
      this.torso.rotation.x = -0.3 * p;
      this.head.rotation.x = -0.5 * p;
      this.armR.rotation.x = -2.4 * p;
      this.armL.rotation.x = -2.4 * p;
      this.armR.rotation.z = 0.6 * p;
      this.armL.rotation.z = -0.6 * p;
      this.body.position.y = 0.08 * p;
      this.cape.rotation.x = 0.5 * p;
      if (this.legR) { this.legR.rotation.x = -0.2 * p; this.legL.rotation.x = -0.2 * p; }
    } else if (this.state === 'dead') {
      const p = clamp(this.deadTime / 1.7, 0, 1);
      const e = p * p * (3 - 2 * p);
      this.body.rotation.z = e * 1.35;
      this.body.rotation.x = e * 0.25;
      this.body.position.y = -e * 0.45;
      this.armR.rotation.x = -0.8 * e;
      this.armL.rotation.x = -0.6 * e;
      this.armR.rotation.z = 0.5 * e;
      this.armL.rotation.z = -0.5 * e;
      if (this.legR) { this.legR.rotation.x = 0.2 * e; this.legL.rotation.x = -0.2 * e; }
      this.cape.rotation.x = 0.6 * e;
      this.model.position.y = -e * 0.1;
    }

    if (this.blink > 0) {
      this.blink = Math.max(0, this.blink - dt * 3);
      this.model.visible = this.blink < 0.65;
    } else if (this.state !== 'dead') {
      this.model.visible = true;
    }

    if (this.state === 'dead') {
      this.model.visible = this.deadTime < 3.6;
      this.root.position.y = 0.36;
    }
  }
}

export const BOSS_ORDER = ['warden', 'chorister', 'king'];
export { BOSSES };
