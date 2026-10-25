import * as THREE from "three";
import { clamp, damp, rand } from "./utils.js";

const WEAPONS = [
  {
    id: "rocket",
    name: "ROCKET LAUNCHER",
    slot: "01",
    ammo: "rockets",
    ammoLabel: "ROCKETS",
    fireRate: 0.78,
    auto: true,
    color: 0xff7a2a,
  },
  {
    id: "rail",
    name: "RAILGUN",
    slot: "02",
    ammo: "slugs",
    ammoLabel: "SLUGS",
    fireRate: 1.05,
    auto: false,
    color: 0x7ff5ff,
  },
  {
    id: "shotgun",
    name: "SHOTGUN",
    slot: "03",
    ammo: "shells",
    ammoLabel: "SHELLS",
    fireRate: 0.85,
    auto: false,
    color: 0xffc860,
  },
];

const _dir = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _muzzle = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _z = new THREE.Vector3(0, 0, 1);

export class Weapons {
  constructor(game) {
    this.game = game;
    this.player = game.player;
    this.camera = game.camera;
    this.scene = game.scene;
    this.arena = game.arena;
    this.defs = WEAPONS;

    this.viewRoot = new THREE.Group();
    this.viewRoot.position.set(0, 0, 0);
    this.camera.add(this.viewRoot);
    this.scene.add(this.camera);

    this.cooldown = 0;
    this.equipTimer = 0;
    this.recoil = 0;
    this.recoilZ = 0;
    this.flashTimer = 0;
    this.swayX = 0;
    this.swayY = 0;
    this.bobTime = 0;
    this.wasHeld = false;
    this.rockets = [];
    this.lastShot = -10;

    this.buildMaterials();
    this.models = [this.buildRocket(), this.buildRail(), this.buildShotgun()];
    for (const model of this.models) {
      this.viewRoot.add(model.group);
      model.group.visible = false;
    }
    this.models[0].group.visible = true;
  }

  buildMaterials() {
    this.mats = {
      gun: new THREE.MeshStandardMaterial({ color: 0x262a31, metalness: 0.55, roughness: 0.45 }),
      gunDark: new THREE.MeshStandardMaterial({ color: 0x101216, metalness: 0.8, roughness: 0.48 }),
      gunLight: new THREE.MeshStandardMaterial({ color: 0x22262d, metalness: 0.08, roughness: 0.82 }),
      edge: new THREE.MeshStandardMaterial({ color: 0x7d838e, metalness: 0.35, roughness: 0.45 }),
      glove: new THREE.MeshStandardMaterial({ color: 0x181a1e, metalness: 0.1, roughness: 0.92 }),
      gloveTrim: new THREE.MeshStandardMaterial({ color: 0x3b2a22, metalness: 0.3, roughness: 0.7 }),
      orange: new THREE.MeshStandardMaterial({
        color: 0x1e0a03,
        emissive: 0xff4a12,
        emissiveIntensity: 1.15,
        metalness: 0.4,
        roughness: 0.3,
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: 0x03181d,
        emissive: 0x5ceeff,
        emissiveIntensity: 1.6,
        metalness: 0.4,
        roughness: 0.25,
      }),
      wood: new THREE.MeshStandardMaterial({ color: 0x3d1f12, metalness: 0.05, roughness: 0.82 }),
    };
  }

  box(parent, w, h, d, x, y, z, mat, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  }

  cyl(parent, rTop, rBottom, h, x, y, z, mat, segments = 16, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  }

  torus(parent, radius, tube, x, y, z, mat, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 24), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  }

  makeMuzzle(group, x, y, z, color) {
    const flash = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.game.textures.glow,
        color,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    flash.position.set(x, y, z);
    flash.scale.setScalar(0.34);
    flash.renderOrder = 100;
    group.add(flash);
    return flash;
  }

  buildRocket() {
    const group = new THREE.Group();
    const base = new THREE.Vector3(0.37, -0.34, -0.62);
    group.position.copy(base);

    const model = new THREE.Group();
    group.add(model);

    this.cyl(model, 0.115, 0.135, 1.18, 0, 0, -0.12, this.mats.gun, 18, Math.PI / 2);
    this.cyl(model, 0.142, 0.142, 0.09, 0, 0, -0.7, this.mats.gunDark, 18, Math.PI / 2);
    this.cyl(model, 0.095, 0.095, 0.06, 0, 0, -0.755, this.mats.gunDark, 18, Math.PI / 2);

    // reinforcement shroud
    this.box(model, 0.22, 0.2, 0.58, 0, 0.01, -0.04, this.mats.gunDark);
    this.box(model, 0.16, 0.05, 0.72, 0, 0.14, -0.1, this.mats.gunLight);
    this.box(model, 0.05, 0.035, 0.5, 0, 0.18, -0.12, this.mats.orange);

    // coils
    for (let i = 0; i < 4; i += 1) {
      this.torus(model, 0.135, 0.018, 0, 0, -0.6 + i * 0.16, i % 2 ? this.mats.edge : this.mats.orange, 0, 0, 0);
    }

    // vents
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i += 1) {
        this.box(model, 0.025, 0.1, 0.06, side * 0.135, -0.02, -0.52 + i * 0.13, this.mats.gunDark);
      }
    }

    // rear vent
    this.cyl(model, 0.12, 0.1, 0.1, 0, 0, 0.48, this.mats.gunDark, 16, Math.PI / 2);
    this.torus(model, 0.11, 0.014, 0, 0, 0.52, this.mats.orange);

    // grip and stock
    this.box(model, 0.11, 0.27, 0.15, 0, -0.22, 0.12, this.mats.gunDark, 0.22);
    this.box(model, 0.12, 0.07, 0.32, 0, -0.08, 0.36, this.mats.gun);
    this.box(model, 0.1, 0.18, 0.13, 0, -0.16, 0.27, this.mats.gunDark, 0.3);

    // sight
    this.box(model, 0.07, 0.09, 0.13, 0, 0.22, -0.18, this.mats.gunDark);
    this.box(model, 0.035, 0.02, 0.07, 0, 0.27, -0.18, this.mats.orange);
    this.box(model, 0.03, 0.12, 0.03, 0, 0.2, -0.36, this.mats.gunLight);
    this.box(model, 0.06, 0.06, 0.06, 0, 0.2, -0.42, this.mats.gunDark);

    // hands
    this.box(model, 0.12, 0.13, 0.16, 0.01, -0.28, 0.09, this.mats.glove, 0.22);
    this.box(model, 0.13, 0.1, 0.17, -0.11, -0.12, -0.35, this.mats.glove, 0.1);
    this.box(model, 0.14, 0.05, 0.06, 0.01, -0.35, 0.055, this.mats.gloveTrim, 0.22);

    const flash = this.makeMuzzle(model, 0, 0, -0.82, 0xffa04a);

    return { group, model, base, flash, muzzle: new THREE.Vector3(0, 0, -0.84) };
  }

  buildRail() {
    const group = new THREE.Group();
    const base = new THREE.Vector3(0.34, -0.31, -0.66);
    group.position.copy(base);

    const model = new THREE.Group();
    group.add(model);

    this.box(model, 0.16, 0.2, 1.15, 0, 0, -0.1, this.mats.gun);
    this.box(model, 0.1, 0.05, 1.25, 0, 0.13, -0.14, this.mats.gunLight);
    this.box(model, 0.04, 0.035, 0.95, 0, 0.17, -0.12, this.mats.cyan);

    // rails
    for (const side of [-1, 1]) {
      this.box(model, 0.035, 0.05, 1.24, side * 0.085, 0.06, -0.16, this.mats.edge);
      for (let i = 0; i < 5; i += 1) {
        this.torus(model, 0.075, 0.012, side * 0.085, 0.06, -0.62 + i * 0.24, this.mats.gunDark);
      }
    }

    // energy cell
    this.box(model, 0.18, 0.1, 0.22, 0, -0.02, 0.3, this.mats.gunDark);
    this.box(model, 0.14, 0.035, 0.16, 0, 0.035, 0.3, this.mats.cyan);

    // muzzle assembly
    this.cyl(model, 0.06, 0.075, 0.14, 0, 0.06, -0.74, this.mats.gunDark, 12, Math.PI / 2);
    for (let i = 0; i < 3; i += 1) {
      this.torus(model, 0.073, 0.011, 0, 0.06, -0.77 + i * 0.035, i === 1 ? this.mats.cyan : this.mats.edge);
    }

    // scope
    this.cyl(model, 0.055, 0.055, 0.34, 0, 0.23, -0.08, this.mats.gunDark, 12, Math.PI / 2);
    this.cyl(model, 0.065, 0.05, 0.06, 0, 0.23, -0.26, this.mats.gunDark, 12, Math.PI / 2);
    this.box(model, 0.05, 0.06, 0.1, 0, 0.16, -0.08, this.mats.gunDark);
    this.box(model, 0.09, 0.012, 0.03, 0, 0.252, -0.29, this.mats.cyan);

    // grip + hands
    this.box(model, 0.1, 0.25, 0.14, 0, -0.2, 0.15, this.mats.gunDark, 0.2);
    this.box(model, 0.12, 0.13, 0.16, 0.01, -0.27, 0.12, this.mats.glove, 0.2);
    this.box(model, 0.12, 0.11, 0.2, -0.1, -0.1, -0.36, this.mats.glove, 0.06);
    this.box(model, 0.13, 0.05, 0.06, 0.01, -0.33, 0.09, this.mats.gloveTrim, 0.2);

    // side accents
    this.box(model, 0.02, 0.08, 0.55, -0.085, -0.04, -0.08, this.mats.cyan);
    this.box(model, 0.02, 0.08, 0.55, 0.085, -0.04, -0.08, this.mats.cyan);

    const flash = this.makeMuzzle(model, 0, 0.06, -0.82, 0x8ff7ff);

    return { group, model, base, flash, muzzle: new THREE.Vector3(0, 0.06, -0.84) };
  }

  buildShotgun() {
    const group = new THREE.Group();
    const base = new THREE.Vector3(0.36, -0.35, -0.64);
    group.position.copy(base);

    const model = new THREE.Group();
    group.add(model);

    this.cyl(model, 0.062, 0.068, 1.05, 0, 0.04, -0.2, this.mats.gun, 14, Math.PI / 2);
    this.cyl(model, 0.085, 0.085, 0.06, 0, 0.04, -0.71, this.mats.gunDark, 14, Math.PI / 2);
    this.cyl(model, 0.048, 0.048, 0.95, 0, -0.1, -0.16, this.mats.gunDark, 12, Math.PI / 2);

    // receiver
    this.box(model, 0.16, 0.24, 0.38, 0, 0.0, 0.1, this.mats.gun);
    this.box(model, 0.17, 0.08, 0.36, 0, 0.15, 0.08, this.mats.gunLight);
    this.box(model, 0.04, 0.03, 0.2, 0, 0.195, 0.05, this.mats.orange);

    // pump
    this.box(model, 0.14, 0.14, 0.26, 0, -0.11, -0.3, this.mats.wood);
    for (let i = 0; i < 4; i += 1) {
      this.box(model, 0.15, 0.02, 0.02, 0, -0.11, -0.42 + i * 0.08, this.mats.gunDark);
    }

    // stock
    this.box(model, 0.13, 0.17, 0.42, 0, -0.06, 0.46, this.mats.wood, -0.12);
    this.box(model, 0.15, 0.2, 0.06, 0, -0.1, 0.68, this.mats.gunDark, -0.12);

    // sight
    this.box(model, 0.03, 0.04, 0.04, 0, 0.23, -0.38, this.mats.gunLight);
    this.box(model, 0.06, 0.02, 0.05, 0, 0.22, 0.02, this.mats.gunDark);

    // hands
    this.box(model, 0.12, 0.12, 0.15, 0.01, -0.19, 0.13, this.mats.glove, 0.18);
    this.box(model, 0.14, 0.12, 0.18, -0.09, -0.2, -0.28, this.mats.glove, 0.1);
    this.box(model, 0.13, 0.05, 0.06, 0.01, -0.25, 0.115, this.mats.gloveTrim, 0.18);

    const flash = this.makeMuzzle(model, 0, 0.04, -0.78, 0xffc860);

    return { group, model, base, flash, muzzle: new THREE.Vector3(0, 0.04, -0.8) };
  }

  setWeapon(index) {
    if (index < 0 || index >= this.models.length) return;
    if (index === this.player.weapon && this.models[index].group.visible) return;
    this.player.weapon = index;
    this.equipTimer = 0.28;
    for (let i = 0; i < this.models.length; i += 1) {
      this.models[i].group.visible = i === index;
      this.models[i].flash.material.opacity = 0;
    }
    this.game.audio.ui();
    this.game.hud.update();
  }

  cycle(delta) {
    const next = (this.player.weapon + delta + this.models.length) % this.models.length;
    this.setWeapon(next);
  }

  onLook(dx, dy) {
    this.swayX = clamp(this.swayX - dx * 0.00022, -0.035, 0.035);
    this.swayY = clamp(this.swayY - dy * 0.00022, -0.03, 0.03);
  }

  update(dt) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.equipTimer = Math.max(0, this.equipTimer - dt);
    this.recoil = damp(this.recoil, 0, 11, dt);
    this.recoilZ = damp(this.recoilZ, 0, 12, dt);
    this.swayX = damp(this.swayX, 0, 7, dt);
    this.swayY = damp(this.swayY, 0, 7, dt);
    this.flashTimer = Math.max(0, this.flashTimer - dt);

    const player = this.player;
    const speed = player.speed || 0;
    const grounded = player.onGround ? 1 : 0.35;
    this.bobTime += dt * (3.6 + speed * 0.55) * grounded;

    const model = this.models[player.weapon];
    const group = model.group;
    const equip = this.equipTimer > 0 ? Math.sin((this.equipTimer / 0.28) * Math.PI) : 0;

    group.position.set(
      model.base.x + this.swayX + Math.sin(this.bobTime) * 0.012 * grounded,
      model.base.y + this.swayY - equip * 0.32 + Math.abs(Math.sin(this.bobTime * 2)) * 0.012 * grounded,
      model.base.z + this.recoilZ * 0.16,
    );
    group.rotation.set(
      -this.recoil * 0.11 - this.swayY * 0.4,
      this.swayX * 0.8,
      this.swayX * 0.5 + Math.sin(this.bobTime) * 0.006 * grounded,
    );

    if (this.flashTimer <= 0) {
      for (const m of this.models) m.flash.material.opacity = 0;
    }

    const held = player.mouseHeld && player.alive && this.game.state === "playing";
    const def = this.defs[player.weapon];
    if (held && (!this.wasHeld || def.auto)) this.tryFire();
    this.wasHeld = held;

    this.updateRockets(dt);
  }

  tryFire() {
    const player = this.player;
    if (!player.alive || this.game.state !== "playing") return;
    const def = this.defs[player.weapon];
    if (this.cooldown > 0) return;
    if (player.ammo[def.ammo] <= 0) {
      this.cooldown = 0.28;
      this.game.audio.empty();
      this.game.hud.toast("OUT OF AMMO");
      return;
    }

    player.ammo[def.ammo] -= 1;
    this.cooldown = def.fireRate;
    this.lastShot = this.game.elapsed;
    this.recoil = 1;
    this.recoilZ = 1;
    this.flashTimer = 0.065;
    this.game.audio[def.id]();

    const model = this.models[player.weapon];
    model.flash.material.opacity = 1;
    model.flash.material.rotation = Math.random() * Math.PI * 2;
    const scale = def.id === "shotgun" ? 0.5 : def.id === "rail" ? 0.4 : 0.36;
    model.flash.scale.setScalar(scale);

    this.camera.updateMatrixWorld();
    model.model.getWorldPosition(_muzzle);
    _muzzle.add(model.muzzle.clone().applyMatrix4(model.model.matrixWorld).sub(model.model.getWorldPosition(new THREE.Vector3())));

    this.camera.getWorldDirection(_dir);
    _right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
    _up.set(0, 1, 0).applyQuaternion(this.camera.quaternion);

    _origin.copy(this.camera.position);
    this.game.effects.flashLight(_muzzle, def.color, def.id === "shotgun" ? 2.6 : 3.4, 0.08, 8);
    player.addPitchKick(def.id === "rail" ? 0.006 : 0.014);
    this.game.addShake(def.id === "shotgun" ? 0.08 : 0.05, 0.12);

    if (def.id === "rocket") {
      this.spawnRocket(_muzzle.clone(), _dir.clone());
    } else if (def.id === "rail") {
      this.fireRail();
    } else {
      this.fireShotgun();
    }

    this.game.hud.update();
  }

  spawnRocket(position, dir) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.075, 0.5, 10),
      new THREE.MeshStandardMaterial({
        color: 0x3a3f47,
        metalness: 0.8,
        roughness: 0.35,
        emissive: 0xff5a1f,
        emissiveIntensity: 0.4,
      }),
    );
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.075, 0.18, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1e, emissive: 0xff7a2a, emissiveIntensity: 2, metalness: 0.5, roughness: 0.4 }),
    );
    tip.rotation.x = Math.PI / 2;
    tip.position.z = -0.32;
    group.add(tip);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.game.textures.glow,
        color: 0xff8a3a,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.setScalar(0.8);
    group.add(glow);

    const light = new THREE.PointLight(0xff6a22, 5, 8, 2);
    group.add(light);

    group.position.copy(position);
    group.quaternion.copy(_q.setFromUnitVectors(_z, dir));
    this.scene.add(group);

    this.rockets.push({
      group,
      light,
      vel: dir.clone().multiplyScalar(54).addScaledVector(this.player.vel, 0.25),
      life: 5,
      trailTimer: 0,
    });
  }

  updateRockets(dt) {
    for (let i = this.rockets.length - 1; i >= 0; i -= 1) {
      const r = this.rockets[i];
      r.life -= dt;
      const prev = r.group.position.clone();
      r.group.position.addScaledVector(r.vel, dt);
      r.vel.y -= 1.2 * dt;

      r.trailTimer += dt;
      if (r.trailTimer > 0.016) {
        r.trailTimer = 0;
        this.game.effects.rocketTrail(r.group.position);
      }

      const dist = r.vel.length() * dt;
      const dir = _tmp.copy(r.vel).normalize();
      let exploded = false;

      if (r.group.position.y <= 0.15) {
        this.explodeRocket(r.group.position.clone().setY(0.2));
        exploded = true;
      } else {
        const wallHit = this.arena.raycast(prev, dir, dist + 0.1);
        if (wallHit) {
          this.explodeRocket(wallHit.point);
          exploded = true;
        }
      }

      if (!exploded) {
        for (const enemy of this.game.enemies.list) {
          if (!enemy.alive) continue;
          const dx = enemy.pos.x - r.group.position.x;
          const dy = enemy.pos.y + 1.1 - r.group.position.y;
          const dz = enemy.pos.z - r.group.position.z;
          if (dx * dx + dy * dy + dz * dz < 1.55) {
            this.explodeRocket(r.group.position.clone());
            exploded = true;
            break;
          }
        }
      }

      if (exploded || r.life <= 0) {
        if (r.life <= 0) this.explodeRocket(r.group.position.clone());
        this.scene.remove(r.group);
        r.group.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            if (o.material.map && o.material.map !== this.game.textures.glow) o.material.map.dispose();
            o.material.dispose();
          }
        });
        this.rockets.splice(i, 1);
      }
    }
  }

  explodeRocket(position) {
    this.game.effects.explosion(position, 1);
    this.game.audio.explosion(1);
    this.game.enemies.damageRadius(position, 6.2, 105, "ROCKET", 0.15);

    const player = this.player;
    const dx = player.pos.x - position.x;
    const dy = player.pos.y + 0.7 - position.y;
    const dz = player.pos.z - position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 6.4 && player.alive) {
      const falloff = 1 - dist / 6.4;
      const force = 9 + falloff * 20;
      const k = new THREE.Vector3(dx, dy + 0.5, dz).normalize().multiplyScalar(force);
      player.vel.add(k);
      player.onGround = false;
      if (dist > 1.1 && this.game.elapsed - this.lastShot > 0.05) {
        player.takeDamage(8 + falloff * 18, position, { armorPierce: 0.9 });
      } else if (dist <= 1.1) {
        player.takeDamage(6 + falloff * 10, position, { armorPierce: 0.9 });
      }
    }
    this.game.addShake(0.32, 0.35);
  }

  fireRail() {
    this.camera.updateMatrixWorld();
    _origin.copy(this.camera.position);
    this.camera.getWorldDirection(_dir);
    const wallHit = this.arena.raycast(_origin, _dir, 160);
    const wallDist = wallHit ? wallHit.distance : 160;

    const hits = this.game.enemies.rayHits(_origin, _dir, wallDist);
    let end = wallHit ? wallHit.point.clone() : _origin.clone().addScaledVector(_dir, 160);
    let hitSomething = false;

    const count = Math.min(3, hits.length);
    for (let i = 0; i < count; i += 1) {
      const hit = hits[i];
      const damage = hit.head ? 135 : 95;
      hit.enemy.takeDamage(damage, hit.point, "RAILGUN", hit.head, _dir);
      hitSomething = true;
      this.game.effects.burst(hit.point, 0x9ff8ff, 12, 4, { size: 0.22, life: 0.45, up: 1.4 });
      if (i === 0) end = hit.point.clone().addScaledVector(_dir, 0.12);
    }

    const start = this.models[1].model.getWorldPosition(new THREE.Vector3());
    start.addScaledVector(_dir, 0.2);
    this.game.effects.railBeam(start, end, 0x7ff5ff);
    if (!hitSomething && wallHit) {
      this.game.effects.impact(wallHit.point, wallHit.face?.normal ?? _dir.clone().negate(), 0x7ff5ff);
    }
    if (hitSomething) {
      this.game.hud.hitmarker(hits[0].head);
      this.game.audio.hitmarker(hits[0].head);
    }
  }

  fireShotgun() {
    this.camera.updateMatrixWorld();
    _origin.copy(this.camera.position);
    this.camera.getWorldDirection(_dir);
    _right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
    _up.set(0, 1, 0).applyQuaternion(this.camera.quaternion);

    let anyHit = false;
    let anyHead = false;

    for (let i = 0; i < 10; i += 1) {
      const spreadX = rand(-0.055, 0.055);
      const spreadY = rand(-0.055, 0.055);
      const dir = _dir.clone().addScaledVector(_right, spreadX).addScaledVector(_up, spreadY).normalize();

      const wallHit = this.arena.raycast(_origin, dir, 110);
      const wallDist = wallHit ? wallHit.distance : 110;
      const hits = this.game.enemies.rayHits(_origin, dir, wallDist);
      if (hits.length) {
        const hit = hits[0];
        const falloff = clamp(1 - hit.distance / 70, 0.28, 1);
        const damage = Math.round((hit.head ? 26 : 13) * falloff);
        hit.enemy.takeDamage(damage, hit.point, "SHOTGUN", hit.head, dir);
        this.game.effects.burst(hit.point, hit.head ? 0xffc860 : 0xff7a4a, 5, 2.8, { size: 0.16, life: 0.35 });
        anyHit = true;
        anyHead = anyHead || hit.head;
        if (i % 2 === 0) {
          this.game.effects.burst(hit.point, 0x87220e, 3, 1.8, { size: 0.2, life: 0.5, gravity: -10 });
        }
      } else if (wallHit) {
        if (i < 5) {
          this.game.effects.impact(wallHit.point, wallHit.face?.normal ?? dir.clone().negate(), 0xffb060);
        }
      }
    }

    if (anyHit) {
      this.game.hud.hitmarker(anyHead);
      this.game.audio.hitmarker(anyHead);
    }
  }

  reset() {
    for (const r of this.rockets) {
      this.scene.remove(r.group);
    }
    this.rockets.length = 0;
    this.cooldown = 0;
    this.equipTimer = 0;
    this.recoil = 0;
    this.swayX = 0;
    this.swayY = 0;
    for (let i = 0; i < this.models.length; i += 1) {
      this.models[i].group.visible = i === this.player.weapon;
      this.models[i].flash.material.opacity = 0;
    }
    this.wasHeld = false;
  }
}
