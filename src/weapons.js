import * as THREE from 'three';
import { glowTexture } from './textures.js';

export const WEAPONS = [
  {
    id: 'scatter', name: 'SCATTERGUN', short: 'SCATTER', slot: 1, ammoLabel: 'SHELLS', infinite: true,
    rate: 0.78, damage: 11, pellets: 8, spread: 0.055, range: 62, kick: 1.15,
    color: 0xffd27a, botUse: false, desc: 'CLOSE RANGE · 8 PELLETS'
  },
  {
    id: 'rocket', name: 'ROCKET LAUNCHER', short: 'ROCKET', slot: 2, ammoLabel: 'ROCKETS',
    rate: 1.02, damage: 82, splash: 72, splashRadius: 4.6, speed: 58, kick: 2.2, maxAmmo: 12,
    color: 0xff8a3d, desc: 'SPLASH · ROCKET JUMP'
  },
  {
    id: 'rail', name: 'RAILGUN', short: 'RAIL', slot: 3, ammoLabel: 'SLUGS',
    rate: 1.28, damage: 92, range: 160, kick: 1.8, maxAmmo: 10,
    color: 0x8ff8ff, desc: 'HITSCAN · ONE SHOT KILL ON WEAK TARGETS'
  },
  {
    id: 'spin', name: 'SPINFUSOR', short: 'SPIN', slot: 4, ammoLabel: 'DISCS',
    rate: 0.92, damage: 68, splash: 40, splashRadius: 3.6, speed: 46, kick: 1.6, maxAmmo: 10,
    color: 0x59c8ff, desc: 'TRIBE CLASSIC · EXPLOSIVE DISC'
  },
];

const MAT = {
  gunmetal: new THREE.MeshStandardMaterial({ color: 0x303c52, roughness: 0.32, metalness: 0.88 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x10141f, roughness: 0.55, metalness: 0.75 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8fa3bd, roughness: 0.24, metalness: 0.95 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb08a4a, roughness: 0.35, metalness: 0.9 }),
  grip: new THREE.MeshStandardMaterial({ color: 0x191c26, roughness: 0.85, metalness: 0.1 }),
};
const glow = (color) => new THREE.MeshBasicMaterial({ color });
const cyan = glow(0x51efff), mag = glow(0xff2e8a), amber = glow(0xffb02e);

function bx(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
function cy(r1, r2, h, mat, x = 0, y = 0, z = 0, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
  m.position.set(x, y, z);
  return m;
}
function tor(r, t, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 6, 20), mat);
  m.position.set(x, y, z);
  return m;
}

const gloveMat = new THREE.MeshStandardMaterial({ color: 0x2b3341, roughness: 0.82, metalness: 0.18 });
const cuffMat = new THREE.MeshStandardMaterial({ color: 0x1b5a6a, roughness: 0.5, metalness: 0.55, emissive: 0x0d4a58, emissiveIntensity: 1.2 });

function addHand(g, x, y, z) {
  const palm = bx(0.095, 0.1, 0.14, gloveMat, x, y, z);
  palm.rotation.x = -0.12;
  const fingers = bx(0.1, 0.045, 0.1, MAT.dark, x, y - 0.03, z - 0.06);
  fingers.rotation.x = 0.25;
  const cuff = bx(0.12, 0.055, 0.16, cuffMat, x + 0.01, y - 0.09, z + 0.07);
  const arm = bx(0.12, 0.34, 0.15, gloveMat, x + 0.05, y - 0.25, z + 0.16);
  arm.rotation.set(-0.32, 0, -0.16);
  g.add(palm, fingers, cuff, arm);
}

function buildScatter() {
  const g = new THREE.Group();
  const body = bx(0.16, 0.14, 0.52, MAT.gunmetal, 0, 0, 0);
  g.add(body);
  const top = bx(0.12, 0.05, 0.4, MAT.steel, 0, 0.1, 0.02);
  g.add(top);
  for (const x of [-0.045, 0.045]) {
    const barrel = cy(0.033, 0.033, 0.52, MAT.dark, x, 0.045, -0.34);
    barrel.rotation.x = Math.PI / 2;
    g.add(barrel);
    const ring = tor(0.043, 0.011, amber, x, 0.045, -0.57);
    ring.rotation.y = 0;
    g.add(ring);
  }
  const pump = bx(0.14, 0.09, 0.16, MAT.grip, 0, -0.055, -0.18);
  g.add(pump);
  const grip = bx(0.08, 0.19, 0.09, MAT.grip, 0, -0.14, 0.16);
  grip.rotation.x = -0.28;
  g.add(grip);
  const stock = bx(0.13, 0.12, 0.2, MAT.dark, 0, -0.015, 0.32);
  g.add(stock);
  const stripe = bx(0.165, 0.012, 0.28, cyan, 0, 0.075, 0.1);
  g.add(stripe);
  const sight = bx(0.02, 0.03, 0.02, mag, 0, 0.14, -0.2);
  g.add(sight);
  addHand(g, 0, -0.12, -0.16);
  g.userData.muzzle = new THREE.Vector3(0, 0.045, -0.64);
  g.userData.kick = 0.09;
  return g;
}

function buildRocket() {
  const g = new THREE.Group();
  const tube = cy(0.095, 0.105, 0.8, MAT.gunmetal, 0, 0.01, -0.08);
  tube.rotation.x = Math.PI / 2;
  g.add(tube);
  const front = cy(0.12, 0.095, 0.16, MAT.dark, 0, 0.01, -0.54);
  front.rotation.x = Math.PI / 2;
  g.add(front);
  const rim = tor(0.12, 0.018, amber, 0, 0.01, -0.6);
  g.add(rim);
  const rear = cy(0.12, 0.105, 0.08, MAT.steel, 0, 0.01, 0.34);
  rear.rotation.x = Math.PI / 2;
  g.add(rear);
  const band = tor(0.1, 0.02, mag, 0, 0.01, 0.06);
  g.add(band);
  const grip = bx(0.07, 0.2, 0.1, MAT.grip, 0, -0.15, 0.12);
  grip.rotation.x = -0.2;
  g.add(grip);
  const trigger = bx(0.04, 0.06, 0.03, MAT.steel, 0, -0.09, 0.02);
  g.add(trigger);
  const sight = bx(0.05, 0.06, 0.14, MAT.dark, 0.09, 0.11, 0.06);
  g.add(sight);
  const lens = bx(0.045, 0.025, 0.01, cyan, 0.09, 0.115, -0.01);
  g.add(lens);
  // side fins
  for (const s of [-1, 1]) {
    const fin = bx(0.02, 0.14, 0.18, MAT.steel, s * 0.11, 0.01, 0.28);
    g.add(fin);
  }
  const warn = bx(0.02, 0.03, 0.3, amber, -0.1, 0.06, 0.08);
  g.add(warn);
  addHand(g, 0, -0.17, 0.1);
  g.userData.muzzle = new THREE.Vector3(0, 0.01, -0.66);
  g.userData.kick = 0.14;
  return g;
}

function buildRail() {
  const g = new THREE.Group();
  const body = bx(0.14, 0.13, 0.52, MAT.gunmetal, 0, 0, 0.02);
  g.add(body);
  const barrel = bx(0.055, 0.055, 0.9, MAT.steel, 0, 0.015, -0.5);
  g.add(barrel);
  for (let i = 0; i < 4; i++) {
    const coil = tor(0.075, 0.012, cyan, 0, 0.015, -0.26 - i * 0.16);
    g.add(coil);
  }
  const scope = bx(0.09, 0.09, 0.3, MAT.dark, 0, 0.13, -0.02);
  g.add(scope);
  const lensF = cy(0.035, 0.035, 0.02, cyan, 0, 0.13, -0.18);
  lensF.rotation.x = Math.PI / 2;
  g.add(lensF);
  const stock = bx(0.12, 0.1, 0.22, MAT.dark, 0, -0.01, 0.34);
  g.add(stock);
  const grip = bx(0.07, 0.18, 0.08, MAT.grip, 0, -0.14, 0.12);
  grip.rotation.x = -0.3;
  g.add(grip);
  const breech = bx(0.16, 0.16, 0.14, MAT.gunmetal, 0, 0.01, -0.2);
  g.add(breech);
  const strip = bx(0.015, 0.09, 0.26, mag, 0.075, 0.01, 0.02);
  g.add(strip);
  addHand(g, 0, -0.16, 0.1);
  g.userData.muzzle = new THREE.Vector3(0, 0.015, -0.98);
  g.userData.kick = 0.11;
  return g;
}

function buildSpin() {
  const g = new THREE.Group();
  const body = bx(0.17, 0.15, 0.34, MAT.gunmetal, 0, 0, 0.02);
  g.add(body);
  const barrel = cy(0.06, 0.075, 0.3, MAT.dark, 0, 0.01, -0.22);
  barrel.rotation.x = Math.PI / 2;
  g.add(barrel);
  // disc
  const disc = cy(0.24, 0.24, 0.055, MAT.steel, 0, 0.02, -0.42, 28);
  disc.rotation.x = Math.PI / 2;
  g.add(disc);
  const rim = tor(0.245, 0.02, cyan, 0, 0.02, -0.42);
  g.add(rim);
  const hub = cy(0.07, 0.07, 0.09, mag, 0, 0.02, -0.42, 16);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  const bracket = bx(0.06, 0.2, 0.07, MAT.dark, 0, -0.06, -0.28);
  g.add(bracket);
  const grip = bx(0.075, 0.19, 0.1, MAT.grip, 0, -0.15, 0.1);
  grip.rotation.x = -0.25;
  g.add(grip);
  const stock = bx(0.12, 0.12, 0.18, MAT.dark, 0, 0, 0.28);
  g.add(stock);
  const light = bx(0.03, 0.03, 0.2, mag, 0.1, 0.06, -0.04);
  g.add(light);
  addHand(g, 0, -0.17, 0.08);
  g.userData.muzzle = new THREE.Vector3(0, 0.02, -0.7);
  g.userData.kick = 0.13;
  g.userData.spinDisc = disc;
  return g;
}

export class ViewModel {
  constructor(aspect) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(68, aspect, 0.01, 10);
    this.camera.position.set(0, 0, 0);
    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x160a26, 2.4);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(-1.2, 2.2, 1.4);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x35d8ff, 2.4);
    rim.position.set(2.2, 0.4, -1.5);
    this.scene.add(rim);
    const warm = new THREE.PointLight(0xff7040, 4, 4);
    warm.position.set(0.4, -0.4, 0.4);
    this.scene.add(warm);
    const cool = new THREE.PointLight(0x4fd8ff, 6, 3);
    cool.position.set(-0.5, 0.2, -0.3);
    this.scene.add(cool);

    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.models = [buildScatter(), buildRocket(), buildRail(), buildSpin()];
    for (const m of this.models) {
      m.visible = false;
      m.scale.setScalar(0.72);
      this.root.add(m);
    }
    this.index = 0;
    this.models[0].visible = true;
    this.phase = 0;
    this.kick = 0;
    this.swap = 0;
    this.bobAmt = 0;
    this.modelScale = 0.72;
    this.basePos = new THREE.Vector3(0.35, -0.38, -1.08);
    this.root.position.copy(this.basePos);
    this.root.rotation.set(0.02, 0.15, 0);
    this.swing = { x: 0, y: 0 };

    const flashTex = glowTexture('rgba(255,250,220,1)', 'rgba(255,170,60,.7)', 'rgba(255,80,0,0)');
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({
      map: flashTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false
    }));
    this.flash.scale.setScalar(0.5);
    this.scene.add(this.flash);
    this.flashLife = 0;

    this.discSpin = 0;
  }

  setAspect(aspect) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  show(index, instant = false) {
    if (index === this.index && !instant) return;
    this.models[this.index].visible = false;
    this.index = index;
    this.models[index].visible = true;
    if (!instant) this.swap = 1;
  }

  fire() {
    this.kick = 1;
    this.flashLife = 0.075;
    const m = this.models[this.index];
    const muzzle = m.userData.muzzle;
    // flash position in view scene: root offset + local muzzle (scaled)
    this.flash.position.copy(this.root.position).add(muzzle.clone().multiplyScalar(this.modelScale));
    this.flash.position.x += 0.02;
    this.flash.position.y += 0.03;
    const s = 0.35 + Math.random() * 0.25;
    this.flash.scale.setScalar(s * (this.index === 0 ? 1.2 : 1.6));
    this.flash.material.rotation = Math.random() * 6.28;
    this.flash.material.opacity = 1;
  }

  update(dt, { moving = 0, grounded = true, speed = 0, lookX = 0, lookY = 0, time = 0, spread = 0 } = {}) {
    this.phase += dt * (grounded ? Math.max(1.2, speed * 1.15) : 2.2);
    const moveAmt = Math.min(1, speed / 9) * (grounded ? 1 : 0.35);
    this.bobAmt += (moveAmt - this.bobAmt) * Math.min(1, dt * 8);
    const bobX = Math.sin(this.phase) * 0.016 * this.bobAmt;
    const bobY = Math.abs(Math.cos(this.phase)) * 0.014 * this.bobAmt;

    // sway from look delta (clamped)
    this.swing.x += ((THREE.MathUtils.clamp(-lookX * 0.0009, -0.05, 0.05)) - this.swing.x) * Math.min(1, dt * 9);
    this.swing.y += ((THREE.MathUtils.clamp(lookY * 0.0007, -0.04, 0.04)) - this.swing.y) * Math.min(1, dt * 9);

    this.kick = Math.max(0, this.kick - dt * 8);
    this.swap = Math.max(0, this.swap - dt * 6);
    const kick = this.kick * this.kick;
    const swapDown = this.swap * 0.22;

    this.root.position.set(
      this.basePos.x + bobX + this.swing.x,
      this.basePos.y + bobY + this.swing.y - swapDown - kick * 0.02,
      this.basePos.z + kick * (this.models[this.index].userData.kick || 0.1) + swapDown * 0.5
    );
    this.root.rotation.set(
      0.02 - this.swing.y * 0.6 + kick * 0.06 + swapDown * 0.4,
      0.15 + this.swing.x * 1.1,
      -this.swing.x * 0.3 + kick * 0.02
    );
    // muzzle flash
    if (this.flashLife > 0) {
      this.flashLife -= dt;
      this.flash.material.opacity = Math.max(0, this.flashLife / 0.075);
    } else {
      this.flash.material.opacity = 0;
    }
    // spin disc
    const m = this.models[this.index];
    if (m.userData.spinDisc) {
      this.discSpin += dt * 8;
      m.userData.spinDisc.rotation.z = this.discSpin;
    }
    // subtle idle breathing
    this.root.position.y += Math.sin(time * 1.4) * 0.002;
  }
}
