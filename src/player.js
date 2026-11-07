import * as THREE from 'three';
import { moveBody } from './world.js';
import { WEAPONS } from './weapons.js';

const UP = new THREE.Vector3(0, 1, 0);

export class Player {
  constructor() {
    this.name = 'YOU';
    this.isPlayer = true;
    this.color = 0x3fe9ff;
    this.radius = 0.4;
    this.height = 1.8;
    this.eye = 1.62;
    this.position = new THREE.Vector3(0, 0.05, 28);
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.health = 100;
    this.armor = 50;
    this.maxHealth = 100;
    this.maxArmor = 100;
    this.alive = true;
    this.grounded = false;
    this.fuel = 100;
    this.maxFuel = 100;
    this.skiing = false;
    this.jetting = false;
    this.score = 0;
    this.deaths = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.protection = 0;
    this.quad = 0;
    this.weaponIndex = 0;
    this.lastWeapon = 1;
    this.ammo = { scatter: Infinity, rocket: 8, rail: 6, spin: 8 };
    this.fireTimer = 0;
    this.switchTimer = 0;
    this.landDip = 0;
    this.bob = 0;
    this.stepTimer = 0;
    this.fellOut = false;
    this.damageFlash = 0;
    this.hitFlash = 0;
    this.respawnTimer = 0;
    this.killerName = '';
    this.deathCause = '';
    this.padCooldown = 0;
    this.lastLook = { x: 0, y: 0 };
    this.onGroundImpact = null;
  }

  reset() {
    this.alive = true;
    this.health = this.maxHealth;
    this.armor = 50;
    this.fuel = this.maxFuel;
    this.velocity.set(0, 0, 0);
    this.score = 0;
    this.deaths = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.quad = 0;
    this.protection = 0;
    this.weaponIndex = 0;
    this.lastWeapon = 1;
    this.ammo = { scatter: Infinity, rocket: 8, rail: 6, spin: 8 };
    this.fireTimer = 0;
    this.switchTimer = 0;
    this.fellOut = false;
    this.respawnTimer = 0;
  }

  spawn(world, spawn) {
    const s = spawn || world.spawnPoints[Math.floor(Math.random() * world.spawnPoints.length)];
    this.position.copy(s.pos);
    this.velocity.set(0, 0, 0);
    this.yaw = s.yaw;
    this.pitch = 0;
    this.alive = true;
    this.health = 100;
    this.armor = 50;
    this.fuel = 100;
    this.protection = 2.5;
    this.quad = 0;
    this.streak = 0;
    this.fellOut = false;
    this.fireTimer = 0;
    this.weaponIndex = 0;
    this.ammo.rocket = Math.max(this.ammo.rocket, 8);
    this.ammo.rail = Math.max(this.ammo.rail, 4);
    this.ammo.spin = Math.max(this.ammo.spin, 6);
    this.landDip = 0;
  }

  get eyePosition() {
    return new THREE.Vector3(this.position.x, this.position.y + this.eye - this.landDip, this.position.z);
  }

  get forward() {
    return new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
  }

  get flatForward() {
    return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }

  get flatRight() {
    return new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  update(dt, input, world, game, camera) {
    if (!this.alive) return;
    this.protection = Math.max(0, this.protection - dt);
    this.quad = Math.max(0, this.quad - dt);
    this.landDip = Math.max(0, this.landDip - dt * 5);
    this.damageFlash = Math.max(0, this.damageFlash - dt * 2.5);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 4);
    this.padCooldown = Math.max(0, this.padCooldown - dt);
    this.switchTimer = Math.max(0, this.switchTimer - dt);
    this.fireTimer = Math.max(0, this.fireTimer - dt);

    // look
    const look = input.consumeLook();
    const sens = 0.0022 * (game.sensitivity || 1);
    this.yaw -= look.x * sens;
    this.pitch -= look.y * sens;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.45, 1.45);
    this.lastLook.x = look.x;
    this.lastLook.y = look.y;

    // weapon selection
    for (let i = 0; i < WEAPONS.length; i++) {
      if (input.wasPressed(`Digit${i + 1}`) || input.wasPressed(`Numpad${i + 1}`)) this.selectWeapon(i, game);
    }
    const wheel = input.consumeWheel();
    if (wheel !== 0) this.selectWeapon((this.weaponIndex + (wheel > 0 ? 1 : WEAPONS.length - 1)) % WEAPONS.length, game);
    if (input.wasPressed('KeyQ')) this.selectWeapon(this.lastWeapon, game);
    if (input.wasPressed('KeyR')) this.selectWeapon(0, game);

    // movement
    const move = input.move;
    const ski = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
    this.skiing = ski && this.grounded && this.velocity.lengthSq() > 1.5;

    const wish = this.flatForward.multiplyScalar(move.z).add(this.flatRight.multiplyScalar(move.x));
    const wishLen = wish.length();
    if (wishLen > 1) wish.divideScalar(wishLen);
    const wishSpeed = ski && this.grounded ? 13.4 : 9.6;
    const maxSpeed = ski ? 20 : 15;

    if (this.grounded) {
      // friction
      const hs = Math.hypot(this.velocity.x, this.velocity.z);
      if (hs > 0.01) {
        const friction = ski ? 0.6 : 7.2;
        const drop = Math.max(hs * friction * dt, friction * dt * 0.6);
        const k = Math.max(0, hs - drop) / hs;
        this.velocity.x *= k;
        this.velocity.z *= k;
      }
      this.accelerate(wish, wishSpeed, 68, dt, maxSpeed);
    } else {
      this.accelerate(wish, Math.min(wishSpeed * 1.05, 10.2), 42, dt, 23);
    }

    // jump + jetpack
    const jetHeld = input.jetHeld;
    if (input.wasPressed('Space') && this.grounded) {
      this.velocity.y = 10.6;
      this.grounded = false;
      this.fuel = Math.max(0, this.fuel - 3);
      game.audio.jump();
      game.effects.burst(this.position.clone().setY(this.position.y + 0.1), 6, {
        color: 0x7ddcff, speed: 3.2, size: 0.18, life: 0.3, grav: 4
      });
    }
    this.jetting = false;
    if (jetHeld && !this.grounded && this.fuel > 0.5) {
      this.velocity.y += 44 * dt;
      if (this.velocity.y > 9.0) this.velocity.y = 9.0;
      this.fuel = Math.max(0, this.fuel - 24 * dt);
      this.jetting = true;
      // flame from feet
      if (Math.random() < 0.9) {
        const down = new THREE.Vector3((Math.random() - 0.5) * 0.4, -1, (Math.random() - 0.5) * 0.4).normalize();
        const p = this.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.0, (Math.random() - 0.5) * 0.4));
        game.effects.jet(p, down, Math.random() > 0.5 ? 0x66eaff : 0xffa040);
      }
    }
    if (this.grounded && !this.jetting) {
      this.fuel = Math.min(this.maxFuel, this.fuel + 26 * dt);
    }
    game.audio.setJet(this.jetting, this.fuel / this.maxFuel);

    // integrate with collisions
    const wasGrounded = this.grounded;
    const velYBefore = this.velocity.y;
    this.fellOut = false;
    moveBody(this, world, dt, { stepHeight: 0.7, gravity: 26 });
    if (!wasGrounded && this.grounded && velYBefore < -5) {
      this.landDip = Math.min(0.28, Math.abs(velYBefore) * 0.018);
      game.audio.land();
      game.effects.burst(this.position.clone().setY(this.position.y + 0.08), 8, {
        color: 0x93a9bb, speed: 2.4, size: 0.16, life: 0.35, grav: 5
      });
    }
    if (this.grounded) this.grounded = true;
    this.position.y = Math.max(this.position.y, -30);

    // jump pads
    for (const pad of world.jumpPads) {
      const dx = this.position.x - pad.position.x;
      const dz = this.position.z - pad.position.z;
      if (this.padCooldown <= 0 && Math.abs(this.position.y - pad.position.y) < 1.2 && dx * dx + dz * dz < pad.radius * pad.radius) {
        this.velocity.copy(pad.launch);
        this.padCooldown = 1.3;
        this.grounded = false;
        this.fuel = Math.min(this.maxFuel, this.fuel + 18);
        game.audio.pad();
        game.effects.burst(this.position.clone(), 24, { color: pad.color, speed: 9, size: 0.3, life: 0.6, grav: 2 });
        game.hud.toast('JUMP PAD — AIRBORNE');
      }
    }

    // pickups
    for (const p of world.pickups) {
      if (!p.active) continue;
      const dx = p.position.x - this.position.x;
      const dz = p.position.z - this.position.z;
      const dy = p.position.y - (this.position.y + 1.0);
      if (dx * dx + dz * dz < 2.2 * 2.2 && Math.abs(dy) < 2.1) {
        game.collectPickup(p, this);
      }
    }

    if (this.fellOut) this.fellOut = false;

    // footsteps
    const hspeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (this.grounded && hspeed > 3.5) {
      this.stepTimer -= dt * hspeed;
      if (this.stepTimer <= 0) {
        this.stepTimer = 4.2;
        game.audio.noise({ dur: 0.055, vol: 0.05, freq: 640, to: 220, type: 'bandpass' });
      }
    }

    // weapons
    if (input.firing && this.fireTimer <= 0 && this.switchTimer <= 0) {
      const w = WEAPONS[this.weaponIndex];
      if (this.ammo[w.id] > 0 || w.infinite) {
        game.firePlayerWeapon(this, w);
        this.fireTimer = w.rate;
      } else {
        // dry click + auto switch to scatter
        if (this.fireTimer <= 0) {
          game.audio.tone({ f: 260, to: 180, dur: 0.05, type: 'square', vol: 0.05 });
          this.selectWeapon(0, game);
          this.fireTimer = 0.25;
        }
      }
    }

    // camera
    const hspeedNorm = Math.min(1, hspeed / 10);
    this.bob += dt * (this.grounded ? hspeed * 1.1 : 0.6);
    const bobY = Math.sin(this.bob * 2) * 0.026 * hspeedNorm * (this.grounded ? 1 : 0.3);
    const bobX = Math.cos(this.bob) * 0.018 * hspeedNorm;
    const strafe = move.x;
    const roll = -strafe * 0.022 + Math.sin(this.bob) * 0.003 * hspeedNorm;

    camera.position.set(this.position.x + bobX * 0.4, this.position.y + this.eye + bobY - this.landDip, this.position.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = this.yaw;
    camera.rotation.x = this.pitch;
    camera.rotation.z = roll;
    this.viewBob = { bobY, bobX, hspeed, strafe };
  }

  accelerate(wish, wishSpeed, accel, dt, maxSpeed) {
    if (wish.lengthSq() < 0.0001) return;
    const hs = Math.hypot(this.velocity.x, this.velocity.z);
    if (hs >= maxSpeed) return;
    const add = Math.min(accel * dt, wishSpeed);
    this.velocity.x += wish.x * add;
    this.velocity.z += wish.z * add;
    // soft cap
    if (hs > maxSpeed) {
      const k = maxSpeed / hs;
      this.velocity.x *= k;
      this.velocity.z *= k;
    }
  }

  selectWeapon(i, game) {
    i = ((i % WEAPONS.length) + WEAPONS.length) % WEAPONS.length;
    if (i === this.weaponIndex) return;
    const w = WEAPONS[i];
    if (!w.infinite && this.ammo[w.id] <= 0) {
      game.hud.toast('OUT OF AMMO — FIND A CRATE');
      return;
    }
    this.lastWeapon = this.weaponIndex;
    this.weaponIndex = i;
    this.switchTimer = 0.18;
    game.audio.ui();
    game.viewModel.show(i);
    game.hud.flashWeapon();
  }

  hurt(amount, source, game, cause = 'fragged') {
    this.takeDamage(amount, source, game, cause);
  }

  takeDamage(amount, source, game, cause = 'fragged') {
    if (!this.alive || this.protection > 0) return;
    let dmg = amount;
    if (this.quad > 0) dmg *= 0.82;
    const armorAbsorb = Math.min(this.armor, dmg * 0.64);
    this.armor -= armorAbsorb;
    const hpDmg = dmg - armorAbsorb;
    this.health -= hpDmg;
    this.damageFlash = 1;
    game.audio.hurt();
    game.hud.damage(source ? source.position : null, this);
    if (this.health <= 0) {
      this.health = 0;
      game.kill(this, source, cause);
    }
  }

  addHealth(n) {
    this.health = Math.min(140, this.health + n);
  }
  addArmor(n) {
    this.armor = Math.min(150, this.armor + n);
  }
}
