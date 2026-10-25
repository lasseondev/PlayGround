import * as THREE from "three";
import { clamp, damp, rand } from "./utils.js";

const FORWARD = new THREE.Vector3();
const RIGHT = new THREE.Vector3();
const WISH = new THREE.Vector3();
const _shake = new THREE.Vector3();

export class Player {
  constructor(game) {
    this.game = game;
    this.camera = game.camera;
    this.arena = game.arena;
    this.camera.rotation.order = "YXZ";

    this.pos = new THREE.Vector3(0, 0, 38);
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
    this.height = 1.8;
    this.radius = 0.42;
    this.alive = true;
    this.onGround = true;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.jumpSpeed = 8.3;
    this.gravity = 25;
    this.walkSpeed = 9.8;
    this.maxSpeed = 30;

    this.health = 100;
    this.armor = 0;
    this.maxHealth = 100;
    this.maxArmor = 100;
    this.ammo = { rockets: 20, shells: 12, slugs: 8 };
    this.ammoMax = { rockets: 40, shells: 30, slugs: 20 };
    this.weapon = 0;

    this.keys = new Set();
    this.mouseDown = false;
    this.mouseHeld = false;
    this.pointerLocked = false;
    this.sensitivity = 0.0022;

    this.bobPhase = 0;
    this.bobAmount = 0;
    this.landDip = 0;
    this.pitchKick = 0;
    this.shake = 0;
    this.shakeLife = 0;
    this.speed = 0;
    this.footstepTimer = 0;
    this.dashCooldown = 0;
    this.hurtCooldown = 0;
    this.invuln = 0;
    this.lastDamageTime = -10;

    this.bindInput();
  }

  bindInput() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") return;
      if (this.game.state !== "playing") return;
      if (["Space", "ShiftLeft", "ShiftRight"].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (e.code === "Space") this.jumpBuffer = 0.14;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") this.tryDash();
      if (e.code === "Digit1") this.game.weapons.setWeapon(0);
      if (e.code === "Digit2") this.game.weapons.setWeapon(1);
      if (e.code === "Digit3") this.game.weapons.setWeapon(2);
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
    });

    window.addEventListener("blur", () => {
      this.keys.clear();
      this.mouseDown = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.pointerLocked || this.game.state !== "playing") return;
      const dx = e.movementX || 0;
      const dy = e.movementY || 0;
      this.yaw -= dx * this.sensitivity;
      this.pitch = clamp(this.pitch - dy * this.sensitivity, -1.48, 1.48);
      this.game.weapons.onLook(dx, dy);
      this.roll = damp(this.roll, clamp(-dx * 0.00055, -0.035, 0.035), 10, 0.016);
    });

    window.addEventListener("mousedown", (e) => {
      if (e.button === 0 && this.game.state === "playing") {
        this.mouseDown = true;
        this.mouseHeld = true;
        this.game.audio.unlock();
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.mouseDown = false;
        this.mouseHeld = false;
      }
    });

    window.addEventListener(
      "wheel",
      (e) => {
        if (this.game.state !== "playing") return;
        e.preventDefault();
        this.game.weapons.cycle(e.deltaY > 0 ? 1 : -1);
      },
      { passive: false },
    );

    window.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.game.renderer.domElement;
      if (!this.pointerLocked && this.game.state === "playing" && this.game.startedWithLock) {
        this.game.pause();
      }
    });
  }

  reset() {
    this.pos.set(0, 0, 38);
    this.vel.set(0, 0, 0);
    this.yaw = 0;
    this.pitch = -0.02;
    this.roll = 0;
    this.alive = true;
    this.onGround = true;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.health = 100;
    this.armor = 0;
    this.ammo = { rockets: 20, shells: 12, slugs: 8 };
    this.weapon = 0;
    this.bobPhase = 0;
    this.landDip = 0;
    this.pitchKick = 0;
    this.shake = 0;
    this.dashCooldown = 0;
    this.invuln = 0.8;
    this.hurtCooldown = 0;
    this.keys.clear();
    this.mouseDown = false;
    this.mouseHeld = false;
    this.camera.position.set(this.pos.x, this.pos.y + this.height * 0.92, this.pos.z);
    this.camera.fov = 80;
    this.camera.updateProjectionMatrix();
    this.updateCamera(0);
  }

  tryDash() {
    if (!this.alive || this.dashCooldown > 0) return;
    this.computeWish();
    if (WISH.lengthSq() < 0.1) return;
    this.dashCooldown = 1.7;
    this.vel.addScaledVector(WISH, 11.5);
    this.vel.y = Math.max(this.vel.y, 1.5);
    this.game.audio.dash();
    this.game.effects.burst(
      new THREE.Vector3(this.pos.x, this.pos.y + 0.3, this.pos.z),
      0x66f4ff,
      18,
      5,
      { size: 0.18, life: 0.4, up: 0.7 },
    );
    this.game.addShake(0.07, 0.14);
  }

  computeWish() {
    FORWARD.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    WISH.set(0, 0, 0);
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) WISH.add(FORWARD);
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) WISH.sub(FORWARD);
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) WISH.add(RIGHT);
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) WISH.sub(RIGHT);
    if (WISH.lengthSq() > 0) WISH.normalize();
    return WISH;
  }

  update(dt) {
    if (!this.alive) return;
    this.invuln = Math.max(0, this.invuln - dt);
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.hurtCooldown = Math.max(0, this.hurtCooldown - dt);

    const wish = this.computeWish();
    const hasWish = wish.lengthSq() > 0.001;

    if (this.onGround) {
      const friction = 9.5;
      this.vel.x *= Math.max(0, 1 - friction * dt);
      this.vel.z *= Math.max(0, 1 - friction * dt);
    }

    if (hasWish) {
      const wishSpeed = this.walkSpeed;
      const current = this.vel.x * wish.x + this.vel.z * wish.z;
      const add = Math.max(0, wishSpeed - current);
      const accel = this.onGround ? 62 : 13;
      this.vel.x += wish.x * add * accel * dt;
      this.vel.z += wish.z * add * accel * dt;
    }

    if (!this.onGround) {
      // A touch of air control keeps the arena flow forgiving.
      if (hasWish) {
        this.vel.x += wish.x * 5.2 * dt;
        this.vel.z += wish.z * 5.2 * dt;
      }
    }

    const horiz = Math.hypot(this.vel.x, this.vel.z);
    const cap = this.onGround ? 14 : this.maxSpeed;
    if (horiz > cap) {
      const k = cap / horiz;
      this.vel.x *= k;
      this.vel.z *= k;
    }

    this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.onGround ? 0.12 : Math.max(0, this.coyote - dt);

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vel.y = this.jumpSpeed;
      this.onGround = false;
      this.coyote = 0;
      this.jumpBuffer = 0;
      this.game.audio.jump();
      this.landDip = 0.04;
      this.game.effects.burst(
        new THREE.Vector3(this.pos.x, this.pos.y + 0.1, this.pos.z),
        0x8a8f9e,
        8,
        2.2,
        { size: 0.14, life: 0.35, gravity: 2 },
      );
    }

    this.vel.y -= this.gravity * dt;

    this.moveHorizontal(dt);

    const wasGround = this.onGround;
    this.pos.y += this.vel.y * dt;
    const support = this.arena.groundHeightAt(this.pos.x, this.pos.z, this.pos.y + 0.35);

    if (this.pos.y <= support || (this.vel.y <= 0 && this.pos.y - support < 0.04)) {
      if (!wasGround && this.vel.y < -7) {
        this.game.audio.land();
        this.landDip = clamp(this.vel.y * 0.014, -0.24, -0.06);
        this.game.effects.burst(
          new THREE.Vector3(this.pos.x, support + 0.1, this.pos.z),
          0x777d8a,
          10,
          2.6,
          { size: 0.15, life: 0.4, gravity: 2 },
        );
      }
      this.pos.y = support;
      this.vel.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.pos.y < -12) {
      this.kill();
      return;
    }

    if (this.arena.inHazard(this.pos.x, this.pos.z) && this.pos.y < 0.75) {
      this.hazardDamage(dt);
    }

    this.speed = Math.hypot(this.vel.x, this.vel.z);
    if (this.onGround && this.speed > 1.2) {
      this.footstepTimer -= dt;
      if (this.footstepTimer <= 0) {
        this.footstepTimer = clamp(0.62 - this.speed * 0.032, 0.24, 0.5);
        this.game.audio.footstep();
      }
      this.bobPhase += dt * (4.2 + this.speed * 0.62);
      this.bobAmount = damp(this.bobAmount, clamp(this.speed / 10, 0, 1), 8, dt);
    } else {
      this.bobAmount = damp(this.bobAmount, 0, 8, dt);
    }

    this.landDip = damp(this.landDip, 0, 12, dt);
    this.pitchKick = damp(this.pitchKick, 0, 8, dt);
    this.roll = damp(this.roll, 0, 8, dt);

    this.game.weapons.update(dt);
    this.updateCamera(dt);
    this.game.hud.update();
  }

  moveHorizontal(dt) {
    this.moveAxis("x", this.vel.x * dt);
    this.moveAxis("z", this.vel.z * dt);
  }

  moveAxis(axis, amount) {
    if (amount === 0) return;
    this.pos[axis] += amount;
    const feet = this.pos.y;
    const head = feet + this.height;
    for (const s of this.arena.solids) {
      if (head <= s.minY + 0.02 || feet >= s.maxY - 0.1) continue;
      if (
        this.pos.x + this.radius > s.minX &&
        this.pos.x - this.radius < s.maxX &&
        this.pos.z + this.radius > s.minZ &&
        this.pos.z - this.radius < s.maxZ
      ) {
        if (axis === "x") {
          if (amount > 0) this.pos.x = s.minX - this.radius;
          else this.pos.x = s.maxX + this.radius;
          this.vel.x = 0;
        } else {
          if (amount > 0) this.pos.z = s.minZ - this.radius;
          else this.pos.z = s.maxZ + this.radius;
          this.vel.z = 0;
        }
      }
    }
  }

  updateCamera(dt) {
    const bobX = Math.sin(this.bobPhase) * 0.026 * this.bobAmount;
    const bobY = Math.abs(Math.sin(this.bobPhase * 2)) * 0.035 * this.bobAmount;

    _shake.set(0, 0, 0);
    if (this.shake > 0.001) {
      _shake.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(this.shake * 0.08);
      this.shake = damp(this.shake, 0, 8, dt);
    }

    this.camera.position.set(
      this.pos.x + bobX * 0.5 + _shake.x,
      this.pos.y + this.height * 0.92 + bobY + this.landDip + _shake.y,
      this.pos.z + _shake.z,
    );
    this.camera.rotation.set(this.pitch + this.pitchKick, this.yaw, this.roll + this.landDip * 0.25);
  }

  addShake(amount, life = 0.25) {
    this.shake = Math.max(this.shake, amount);
    this.shakeLife = Math.max(this.shakeLife, life);
  }

  addPitchKick(amount) {
    this.pitchKick -= amount;
  }

  takeDamage(amount, source, { armorPierce = 0.45, knockback = null } = {}) {
    if (!this.alive || this.invuln > 0) return;
    let remaining = amount;
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, remaining * 0.6);
      this.armor -= absorbed;
      remaining -= absorbed * (1 - armorPierce);
    }
    this.health -= remaining;
    this.lastDamageTime = this.game.elapsed;
    this.hurtCooldown = 0.18;

    if (knockback) this.vel.add(knockback);

    this.game.audio.playerHurt();
    this.game.hud.damageFlash(Math.min(1, 0.35 + remaining / 60), source);
    this.game.addShake(Math.min(0.35, 0.12 + remaining / 220), 0.25);

    if (this.health <= 0) {
      this.health = 0;
      this.kill();
    }
    this.game.hud.update();
  }

  hazardDamage(dt) {
    if (this.hurtCooldown > 0) return;
    this.hurtCooldown = 0.32;
    this.health -= 7;
    this.lastDamageTime = this.game.elapsed;
    this.game.audio.playerHurt();
    this.game.hud.damageFlash(0.22, null);
    this.game.hud.toast("LAVA · MOVE!");
    this.game.effects.burst(
      new THREE.Vector3(this.pos.x, this.pos.y + 0.3, this.pos.z),
      0xff6a22,
      12,
      3.2,
      { size: 0.2, life: 0.5, up: 1.8 },
    );
    if (this.health <= 0) {
      this.health = 0;
      this.kill();
    }
    this.game.hud.update();
  }

  kill() {
    if (!this.alive) return;
    this.alive = false;
    this.health = 0;
    this.mouseDown = false;
    this.mouseHeld = false;
    this.game.audio.playerDeath();
    this.game.addShake(0.6, 0.7);
    this.game.onPlayerDeath();
  }

  addAmmo(kind, amount) {
    this.ammo[kind] = Math.min(this.ammoMax[kind], this.ammo[kind] + amount);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
}
