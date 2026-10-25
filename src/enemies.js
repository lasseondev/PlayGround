import * as THREE from "three";
import { clamp, damp, lerp, rand, randInt, pick, shortestAngle } from "./utils.js";

const TYPES = {
  grunt: {
    name: "GRUNT",
    health: 95,
    speed: 4.6,
    scale: 1,
    body: 0x4c5a4c,
    dark: 0x232b24,
    trim: 0xff8a2a,
    range: 32,
    preferred: 11,
    fireDelay: [1.35, 2.1],
    projSpeed: 25,
    damage: 11,
    score: 100,
    radius: 0.52,
  },
  wraith: {
    name: "WRAITH",
    health: 65,
    speed: 6.3,
    scale: 0.9,
    body: 0x2c3c54,
    dark: 0x151b28,
    trim: 0x5ceeff,
    range: 30,
    preferred: 8,
    fireDelay: [1.0, 1.6],
    projSpeed: 31,
    damage: 9,
    score: 140,
    radius: 0.45,
  },
  brute: {
    name: "BRUTE",
    health: 235,
    speed: 3.4,
    scale: 1.32,
    body: 0x5b241c,
    dark: 0x2a100c,
    trim: 0xff3a12,
    range: 34,
    preferred: 9,
    fireDelay: [1.8, 2.6],
    projSpeed: 21,
    damage: 20,
    score: 220,
    radius: 0.68,
  },
};

const _ray = new THREE.Ray();
const _headSphere = new THREE.Sphere();
const _box = new THREE.Box3();
const _hitPoint = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();
const _move = new THREE.Vector3();
const _muzzle = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _target = new THREE.Vector3();

let nextId = 1;

class Enemy {
  constructor(game, typeName, position, ambient = false) {
    this.game = game;
    this.type = TYPES[typeName];
    this.typeName = typeName;
    this.ambient = ambient;
    this.id = nextId++;
    this.pos = position.clone();
    this.vel = new THREE.Vector3();
    this.health = this.type.health;
    this.maxHealth = this.type.health;
    this.scale = this.type.scale;
    this.alive = true;
    this.state = ambient ? "ambient" : "spawning";
    this.spawnTimer = ambient ? 0 : 0.75;
    this.deadTimer = 0;
    this.fireTimer = rand(0.8, 2);
    this.losTimer = 0;
    this.hasLos = false;
    this.strafeDir = Math.random() > 0.5 ? 1 : -1;
    this.strafeTimer = rand(1, 2.4);
    this.walkPhase = Math.random() * 10;
    this.moving = 0;
    this.hitFlash = 0;
    this.deathSpin = new THREE.Vector3();
    this.aimYaw = 0;
    this.targetYaw = 0;
    this.invuln = ambient ? 0 : 0.6;
    this.hazardTimer = 0;

    this.buildModel();
    this.root.position.copy(this.pos);
    this.root.scale.setScalar(ambient ? this.scale : 0.25 * this.scale);
    this.game.scene.add(this.root);

    if (!ambient) this.spawnEffect();
  }

  buildModel() {
    const cfg = this.type;
    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.root.add(this.model);

    this.mats = {
      body: new THREE.MeshStandardMaterial({
        color: cfg.body,
        metalness: 0.62,
        roughness: 0.48,
        emissive: cfg.trim,
        emissiveIntensity: 0.05,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: cfg.dark,
        metalness: 0.7,
        roughness: 0.55,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: 0x140805,
        emissive: cfg.trim,
        emissiveIntensity: 3.2,
        metalness: 0.5,
        roughness: 0.3,
      }),
      eye: new THREE.MeshBasicMaterial({ color: cfg.trim, toneMapped: false }),
    };
    this.baseEmissive = [];
    for (const key of ["body", "dark", "trim"]) {
      this.baseEmissive.push({ mat: this.mats[key], value: this.mats[key].emissiveIntensity });
    }

    const s = this.scale;
    const body = this.mats.body;
    const dark = this.mats.dark;
    const trim = this.mats.trim;

    // hips
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.32, 0.42), dark);
    hips.position.y = 1.02;
    hips.castShadow = true;
    this.model.add(hips);

    // torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.92, 0.56), body);
    torso.position.y = 1.58;
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.model.add(torso);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.5, 0.14), dark);
    chest.position.set(0, 1.65, 0.32);
    chest.castShadow = true;
    this.model.add(chest);

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.08), trim);
    core.position.set(0, 1.62, 0.42);
    this.model.add(core);

    for (const side of [-1, 1]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.54, 0.1), trim);
      rib.position.set(side * 0.27, 1.65, 0.41);
      this.model.add(rib);

      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.44), dark);
      shoulder.position.set(side * 0.62, 1.92, 0);
      shoulder.rotation.z = side * 0.12;
      shoulder.castShadow = true;
      this.model.add(shoulder);

      if (this.typeName === "brute") {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.58), body);
        plate.position.set(side * 0.68, 2.08, 0);
        plate.rotation.z = side * 0.18;
        plate.castShadow = true;
        this.model.add(plate);
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.48, 5), trim);
        spike.position.set(side * 0.82, 2.24, 0);
        spike.rotation.z = side * -0.55;
        this.model.add(spike);
      }
    }

    // head
    this.head = new THREE.Group();
    this.head.position.y = 2.2;
    this.model.add(this.head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.42), body);
    skull.castShadow = true;
    this.head.add(skull);

    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.16, 0.48), dark);
    helmet.position.y = 0.2;
    this.head.add(helmet);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.075, 0.03), this.mats.eye);
    visor.position.set(0, 0.03, 0.22);
    this.head.add(visor);

    if (this.typeName === "brute") {
      for (const side of [-1, 1]) {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 5), trim);
        horn.position.set(side * 0.18, 0.32, -0.03);
        horn.rotation.z = side * 0.35;
        this.head.add(horn);
      }
    }

    if (this.typeName === "wraith") {
      const hood = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.7, 5, 1, true), dark);
      hood.position.set(0, 0.18, -0.04);
      hood.rotation.x = 0.1;
      hood.material = this.mats.dark;
      hood.material.side = THREE.DoubleSide;
      this.head.add(hood);

      const cape = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), new THREE.MeshStandardMaterial({ color: 0x0d1622, side: THREE.DoubleSide, roughness: 0.9, metalness: 0.1 }));
      cape.position.set(0, 1.45, -0.38);
      cape.rotation.x = 0.1;
      this.model.add(cape);
    }

    // arms
    this.arms = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.63, 1.82, 0);
      this.model.add(pivot);
      this.arms.push(pivot);

      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.58, 0.22), dark);
      upper.position.y = -0.28;
      upper.castShadow = true;
      pivot.add(upper);

      const fore = new THREE.Group();
      fore.position.y = -0.58;
      pivot.add(fore);

      const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.52, 0.2), body);
      forearm.position.y = -0.25;
      forearm.castShadow = true;
      fore.add(forearm);

      if (side === 1) {
        this.arm = pivot;
        this.forearm = fore;
        this.blaster = new THREE.Group();
        this.blaster.position.set(0.02, -0.48, 0.04);
        fore.add(this.blaster);

        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.62, 10), this.mats.dark);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = 0.18;
        this.blaster.add(barrel);

        const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 6, 12), trim);
        muzzleRing.position.z = 0.5;
        this.blaster.add(muzzleRing);

        const glow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: this.game.textures.glow,
            color: this.type.trim,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        glow.position.z = 0.54;
        glow.scale.setScalar(0.36);
        this.blaster.add(glow);
        this.muzzleGlow = glow;
        this.muzzleObject = new THREE.Object3D();
        this.muzzleObject.position.set(0, 0, 0.58);
        this.blaster.add(this.muzzleObject);
      } else {
        this.leftForearm = fore;
      }
    }

    // legs
    this.legs = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.24, 0.95, 0);
      this.model.add(pivot);

      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.62, 0.3), body);
      thigh.position.y = -0.3;
      thigh.castShadow = true;
      pivot.add(thigh);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.26), dark);
      shin.position.set(0, -0.82, 0.02);
      shin.castShadow = true;
      pivot.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.46), dark);
      boot.position.set(0, -1.14, 0.08);
      boot.castShadow = true;
      pivot.add(boot);

      this.legs.push(pivot);
    }

    // spine glow
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), trim);
    spine.position.set(0, 1.6, -0.34);
    this.model.add(spine);

    this.root.scale.setScalar(this.scale);
    this.model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
      }
    });
  }

  spawnEffect() {
    const pos = this.pos.clone();
    this.game.effects.burst(pos.clone().setY(1), this.type.trim, 26, 5.5, {
      size: 0.28,
      life: 0.8,
      up: 2,
    });
    this.game.effects.flashLight(pos.clone().setY(1.4), this.type.trim, 8, 0.5, 12);
    this.game.effects.ring(pos, this.type.trim);

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.9, 14, 12, 1, true),
      new THREE.MeshBasicMaterial({
        color: this.type.trim,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    beam.position.copy(pos).setY(7);
    this.game.scene.add(beam);
    this.game.effects.transients.push({ object: beam, life: 0.55, max: 0.55, type: "beam" });
  }

  setState(state) {
    this.state = state;
  }

  update(dt, gameState) {
    if (!this.alive) {
      this.updateDeath(dt);
      return;
    }
    this.invuln = Math.max(0, this.invuln - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 4);
    this.fireTimer -= dt;
    this.losTimer -= dt;
    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeTimer = rand(1.2, 2.8);
      this.strafeDir *= -1;
    }

    if (this.state === "spawning") {
      this.spawnTimer -= dt;
      const t = clamp(1 - this.spawnTimer / 0.75, 0, 1);
      const s = (0.25 + t * 0.75) * this.scale;
      this.root.scale.setScalar(s);
      this.model.position.y = (1 - t) * -0.5 + Math.sin(t * Math.PI) * 0.3;
      this.muzzleGlow.material.opacity = 0.2 + t * 0.5;
      if (this.spawnTimer <= 0) {
        this.state = "chase";
        this.root.scale.setScalar(this.scale);
        this.model.position.y = 0;
      }
      return;
    }

    if (this.state === "ambient") {
      this.updateAmbient(dt);
      return;
    }

    const player = this.game.player;
    if (!player || !player.alive) {
      this.idle(dt);
      return;
    }

    _toPlayer.set(player.pos.x - this.pos.x, player.pos.y + 1.2 - (this.pos.y + 1.6), player.pos.z - this.pos.z);
    const dist = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    this.targetYaw = Math.atan2(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
    const dyaw = shortestAngle(this.root.rotation.y, this.targetYaw);
    this.root.rotation.y += dyaw * Math.min(1, dt * 7);

    if (this.losTimer <= 0) {
      this.losTimer = rand(0.16, 0.32);
      const eye = _muzzle.set(this.pos.x, this.pos.y + 1.9 * this.scale, this.pos.z);
      _target.set(player.pos.x, player.pos.y + 1.1, player.pos.z);
      this.hasLos = this.game.arena.hasLineOfSight(eye, _target);
    }

    const inHazard = this.game.arena.inHazard(this.pos.x, this.pos.z);
    let moveX = 0;
    let moveZ = 0;
    let speed = this.type.speed;
    let firing = false;

    if (inHazard) {
      moveX = -this.pos.x;
      moveZ = -this.pos.z;
      speed = 5.5;
      this.hazardTimer -= dt;
      if (this.hazardTimer <= 0) {
        this.hazardTimer = 0.5;
        this.health -= 6;
        this.game.effects.burst(this.pos.clone().setY(0.6), 0xff5a22, 6, 2.4, { size: 0.18, life: 0.4, up: 2 });
        if (this.health <= 0) {
          this.die("LAVA", false, _toPlayer.clone().normalize());
          return;
        }
      }
    } else if (this.hasLos && dist < this.type.range) {
      const preferred = this.type.preferred;
      if (dist > preferred + 2.5) {
        moveX = player.pos.x - this.pos.x;
        moveZ = player.pos.z - this.pos.z;
      } else if (dist < preferred - 3.5) {
        moveX = this.pos.x - player.pos.x;
        moveZ = this.pos.z - player.pos.z;
      } else {
        moveX = (player.pos.z - this.pos.z) * this.strafeDir * 0.9;
        moveZ = -(player.pos.x - this.pos.x) * this.strafeDir * 0.9;
      }
      firing = true;
    } else {
      this.resolveNavigation(player, moveVec => {
        moveX = moveVec.x;
        moveZ = moveVec.z;
      });
    }

    if (this.game.arena.inHazard(this.pos.x + moveX * 0.6, this.pos.z + moveZ * 0.6)) {
      const tmp = moveX;
      moveX = -moveZ;
      moveZ = tmp;
    }

    // separation
    for (const other of this.game.enemies.list) {
      if (other === this || !other.alive) continue;
      const dx = this.pos.x - other.pos.x;
      const dz = this.pos.z - other.pos.z;
      const d2 = dx * dx + dz * dz;
      if (d2 > 0.001 && d2 < 5) {
        const d = Math.sqrt(d2);
        moveX += (dx / d) * 1.6;
        moveZ += (dz / d) * 1.6;
      }
    }

    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0.001) {
      moveX /= moveLen;
      moveZ /= moveLen;
      this.moving = damp(this.moving, 1, 8, dt);
      this.moveWithCollision(moveX * speed * dt, moveZ * speed * dt);
    } else {
      this.moving = damp(this.moving, 0, 8, dt);
    }

    const support = this.game.arena.groundHeightAt(this.pos.x, this.pos.z, this.pos.y + 0.5);
    this.pos.y = damp(this.pos.y, support, 16, dt);
    this.root.position.copy(this.pos);

    this.animate(dt, firing);

    if (firing && this.fireTimer <= 0 && this.hasLos && dist < this.type.range) {
      this.fire(player);
    }
  }

  resolveNavigation(player, apply) {
    const playerOnPlatform = player.pos.y > 1.5 && Math.abs(player.pos.x) < 16 && Math.abs(player.pos.z) < 16;
    const selfOnPlatform = this.pos.y > 1.5 && Math.abs(this.pos.x) < 17 && Math.abs(this.pos.z) < 17;

    if (playerOnPlatform && !selfOnPlatform) {
      const ramps = [
        { x: 0, z: 28 },
        { x: 0, z: -28 },
        { x: 28, z: 0 },
        { x: -28, z: 0 },
      ];
      let best = ramps[0];
      let bestD = Infinity;
      for (const r of ramps) {
        const d = (r.x - this.pos.x) ** 2 + (r.z - this.pos.z) ** 2;
        if (d < bestD) {
          bestD = d;
          best = r;
        }
      }
      const dBase = Math.hypot(best.x - this.pos.x, best.z - this.pos.z);
      if (dBase > 3.2) {
        apply({ x: best.x - this.pos.x, z: best.z - this.pos.z });
      } else {
        apply({ x: -best.x, z: -best.z });
      }
      return;
    }

    if (!playerOnPlatform && selfOnPlatform) {
      const ramps = [
        { x: 0, z: 26 },
        { x: 0, z: -26 },
        { x: 26, z: 0 },
        { x: -26, z: 0 },
      ];
      let best = ramps[0];
      let bestD = Infinity;
      for (const r of ramps) {
        const d = (r.x - this.pos.x) ** 2 + (r.z - this.pos.z) ** 2;
        if (d < bestD) {
          bestD = d;
          best = r;
        }
      }
      apply({ x: best.x - this.pos.x, z: best.z - this.pos.z });
      return;
    }

    apply({ x: player.pos.x - this.pos.x, z: player.pos.z - this.pos.z });
  }

  idle(dt) {
    this.moving = damp(this.moving, 0, 5, dt);
    this.animate(dt, false);
    this.root.position.copy(this.pos);
  }

  updateAmbient(dt) {
    this.walkPhase += dt * 1.6;
    this.moving = damp(this.moving, 0.45, 2, dt);
    this.model.position.y = Math.abs(Math.sin(this.walkPhase)) * 0.025;
    const sway = Math.sin(this.walkPhase * 0.3) * 0.4;
    this.root.rotation.y = sway;
    this.animate(dt, false);
  }

  animate(dt, aiming) {
    const phase = this.walkPhase;
    const swing = Math.sin(phase) * 0.55 * this.moving;
    const swing2 = Math.sin(phase + Math.PI) * 0.55 * this.moving;

    this.legs[0].rotation.x = swing;
    this.legs[1].rotation.x = swing2;
    this.arms[0].rotation.x = aiming ? -0.55 : swing * 0.55;
    this.arm.rotation.x = aiming ? -1.12 : swing2 * 0.55;
    this.arm.rotation.z = aiming ? 0.05 : -0.06;
    if (this.leftForearm) this.leftForearm.rotation.x = aiming ? -0.75 : 0;

    this.model.position.y = Math.abs(Math.sin(phase * 2)) * 0.035 * this.moving;
    this.root.position.copy(this.pos);

    const pulse = 1.8 + Math.sin(this.game.elapsed * 3.2 + this.id) * 0.6;
    if (this.muzzleGlow) this.muzzleGlow.scale.setScalar(0.28 + Math.sin(this.game.elapsed * 5 + this.id) * 0.08);

    const flash = this.hitFlash;
    for (const entry of this.baseEmissive) {
      entry.mat.emissiveIntensity = entry.value + flash * 5;
    }
    this.mats.trim.emissiveIntensity = pulse + flash * 7;

    // subtle aim tracking for the head
    if (this.aimYaw) {
      this.head.rotation.y = damp(this.head.rotation.y, clamp(shortestAngle(this.root.rotation.y, this.targetYaw), -0.4, 0.4), 6, dt);
    }
  }

  updateDeath(dt) {
    this.deadTimer -= dt;
    this.model.position.y = Math.max(-1.4, this.model.position.y - dt * 1.1);
    this.root.rotation.z = damp(this.root.rotation.z, 1.35, 3, dt);
    this.root.rotation.y += dt * 0.6;
    this.root.scale.multiplyScalar(Math.max(0.0, 1 - dt * 0.12));
    if (this.deadTimer <= 0) {
      this.remove();
    }
  }

  moveWithCollision(dx, dz) {
    this.pos.x += dx;
    this.collideAxis("x", dx);
    this.pos.z += dz;
    this.collideAxis("z", dz);
    this.walkPhase += Math.hypot(dx, dz) * 6.5;
  }

  collideAxis(axis, amount) {
    const r = this.type.radius;
    const feet = this.pos.y;
    const head = feet + 1.8 * this.scale;
    for (const s of this.game.arena.solids) {
      if (head <= s.minY + 0.02 || feet >= s.maxY - 0.04) continue;
      if (
        this.pos.x + r > s.minX &&
        this.pos.x - r < s.maxX &&
        this.pos.z + r > s.minZ &&
        this.pos.z - r < s.maxZ
      ) {
        if (axis === "x") {
          if (amount > 0) this.pos.x = s.minX - r;
          else this.pos.x = s.maxX + r;
        } else {
          if (amount > 0) this.pos.z = s.minZ - r;
          else this.pos.z = s.maxZ + r;
        }
      }
    }
  }

  fire(player) {
    const cfg = this.type;
    this.fireTimer = rand(cfg.fireDelay[0], cfg.fireDelay[1]);
    this.muzzleObject.getWorldPosition(_muzzle);
    this.game.camera.updateMatrixWorld();
    this.game.scene.updateMatrixWorld();

    const speed = cfg.projSpeed;
    const lead = clamp(Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z) / speed, 0, 0.55);
    _target.set(
      player.pos.x + player.vel.x * lead * 0.55,
      player.pos.y + 1.05 + player.vel.y * lead * 0.2,
      player.pos.z + player.vel.z * lead * 0.55,
    );
    _dir.subVectors(_target, _muzzle).normalize();
    _dir.x += rand(-0.035, 0.035);
    _dir.y += rand(-0.025, 0.03);
    _dir.z += rand(-0.035, 0.035);
    _dir.normalize();

    this.game.enemies.spawnProjectile(_muzzle.clone(), _dir.clone().multiplyScalar(speed), cfg, this);
    this.game.audio.enemyShoot(this.typeName);
    if (this.muzzleGlow) {
      this.muzzleGlow.material.opacity = 1;
      this.muzzleGlow.scale.setScalar(0.8);
      setTimeout(() => {
        if (this.muzzleGlow) this.muzzleGlow.scale.setScalar(0.3);
      }, 80);
    }
  }

  takeDamage(amount, point, source = "SHOTGUN", headshot = false, dir = null) {
    if (!this.alive || this.invuln > 0) return;
    this.health -= amount;
    this.hitFlash = 1;
    this.game.audio.enemyHit();

    if (dir) {
      const kb = 0.18 * (headshot ? 1.3 : 1);
      this.pos.x += dir.x * kb;
      this.pos.z += dir.z * kb;
    }

    this.game.effects.burst(point, this.typeName === "wraith" ? 0x5ceeff : 0x8f2410, headshot ? 10 : 6, 3, {
      size: 0.16,
      life: 0.4,
      gravity: -10,
    });

    if (this.health <= 0) {
      this.die(source, headshot, dir);
    }
  }

  die(source, headshot, dir) {
    if (!this.alive) return;
    this.alive = false;
    this.deadTimer = 2.3;
    this.state = "dead";
    this.root.rotation.z = 0;
    this.health = 0;
    this.game.audio.enemyDeath();

    const center = this.pos.clone().setY(this.pos.y + 1.1);
    this.game.effects.burst(center, this.type.trim, 34, 8, { size: 0.34, life: 0.9, up: 1.6 });
    this.game.effects.burst(center, 0x8f2410, 22, 5, { size: 0.3, life: 0.8, up: 1.2 });
    this.game.effects.gibs(center, this.type.body, this.typeName === "brute" ? 14 : 9);
    this.game.effects.flashLight(center, this.type.trim, 7, 0.35, 12);
    this.game.enemies.onKill(this, source, headshot);
  }

  remove() {
    this.game.scene.remove(this.root);
    this.model.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    for (const key of Object.keys(this.mats)) {
      this.mats[key].dispose();
    }
  }
}

class Projectile {
  constructor(game, position, velocity, cfg, owner) {
    this.game = game;
    this.vel = velocity;
    this.owner = owner;
    this.life = 4;
    this.damage = cfg.damage;
    this.color = cfg.trim;
    this.removeMe = false;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 10, 8),
      new THREE.MeshBasicMaterial({ color: cfg.trim, toneMapped: false }),
    );
    this.mesh.add(core);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: game.textures.glow,
        color: cfg.trim,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.setScalar(0.9);
    this.mesh.add(glow);

    this.light = new THREE.PointLight(cfg.trim, 1.6, 5, 2);
    this.mesh.add(this.light);

    game.scene.add(this.mesh);
  }

  update(dt) {
    if (this.removeMe) return;
    this.life -= dt;
    const prev = this.mesh.position.clone();
    this.mesh.position.addScaledVector(this.vel, dt);
    this.mesh.scale.setScalar(1 + Math.sin(this.life * 28) * 0.08);

    const player = this.game.player;
    if (player.alive) {
      const dx = this.mesh.position.x - player.pos.x;
      const dy = this.mesh.position.y - (player.pos.y + 1.0);
      const dz = this.mesh.position.z - player.pos.z;
      if (dx * dx + dy * dy + dz * dz < 0.62) {
        const kb = this.vel.clone().normalize().multiplyScalar(1.6);
        player.takeDamage(this.damage, this.mesh.position, { knockback: kb });
        this.game.effects.burst(this.mesh.position, this.color, 14, 4.5, { size: 0.2, life: 0.45 });
        this.destroy();
        return;
      }
    }

    const dir = this.vel.clone().normalize();
    const dist = this.vel.length() * dt;
    const hit = this.game.arena.raycast(prev, dir, dist + 0.2);
    if (hit) {
      this.game.effects.impact(hit.point, hit.face?.normal ?? dir.clone().negate(), this.color);
      this.destroy();
      return;
    }
    if (this.mesh.position.y < 0.12 || this.life <= 0) {
      this.game.effects.burst(this.mesh.position, this.color, 8, 2.5, { size: 0.16, life: 0.3 });
      this.destroy();
    }
  }

  destroy() {
    this.removeMe = true;
    this.game.scene.remove(this.mesh);
    this.mesh.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
  }
}

export class Enemies {
  constructor(game) {
    this.game = game;
    this.list = [];
    this.projectiles = [];
  }

  spawn(typeName, position, ambient = false) {
    const enemy = new Enemy(this.game, typeName, position, ambient);
    this.list.push(enemy);
    return enemy;
  }

  spawnWave(count, wave) {
    const points = this.game.arena.spawnPoints;
    for (let i = 0; i < count; i += 1) {
      const point = points[(i + Math.floor(Math.random() * points.length)) % points.length];
      const offset = new THREE.Vector3(rand(-3.5, 3.5), 0, rand(-3.5, 3.5));
      let type = "grunt";
      if (wave >= 5 && Math.random() < 0.22) type = "brute";
      else if (wave >= 3 && Math.random() < 0.4) type = "wraith";
      const pos = point.clone().add(offset);
      if (Math.hypot(pos.x - this.game.player.pos.x, pos.z - this.game.player.pos.z) < 12) {
        pos.multiplyScalar(-1);
      }
      this.spawn(type, pos);
    }
  }

  spawnAmbient() {
    const spots = [
      new THREE.Vector3(-8, 2.2, -5),
      new THREE.Vector3(7, 2.2, 4),
      new THREE.Vector3(-28, 0, 12),
      new THREE.Vector3(25, 0, -20),
    ];
    const types = ["grunt", "wraith", "brute"];
    for (let i = 0; i < spots.length; i += 1) {
      this.spawn(types[i % types.length], spots[i], true);
    }
  }

  update(dt, gameState) {
    for (let i = this.list.length - 1; i >= 0; i -= 1) {
      const e = this.list[i];
      e.update(dt, gameState);
      if (e.state === "dead" && e.deadTimer <= 0) {
        this.list.splice(i, 1);
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const p = this.projectiles[i];
      p.update(dt);
      if (p.removeMe) this.projectiles.splice(i, 1);
    }
  }

  spawnProjectile(position, velocity, cfg, owner) {
    this.projectiles.push(new Projectile(this.game, position, velocity, cfg, owner));
  }

  rayHits(origin, dir, maxDist) {
    _ray.origin.copy(origin);
    _ray.direction.copy(dir);
    const results = [];

    for (const enemy of this.list) {
      if (!enemy.alive) continue;
      const s = enemy.scale;
      const centerX = enemy.pos.x;
      const centerZ = enemy.pos.z;
      const footY = enemy.pos.y;

      _headSphere.center.set(centerX, footY + 2.2 * s, centerZ);
      _headSphere.radius = 0.3 * s + 0.06;
      const headHit = _ray.intersectSphere(_headSphere, _hitPoint);
      if (headHit) {
        const d = headHit.distanceTo(origin);
        if (d <= maxDist) {
          results.push({ enemy, distance: d, head: true, point: headHit.clone() });
          continue;
        }
      }

      _box.min.set(centerX - 0.5 * s, footY + 0.15 * s, centerZ - 0.45 * s);
      _box.max.set(centerX + 0.5 * s, footY + 1.95 * s, centerZ + 0.45 * s);
      const bodyHit = _ray.intersectBox(_box, _hitPoint);
      if (bodyHit) {
        const d = bodyHit.distanceTo(origin);
        if (d <= maxDist) {
          results.push({ enemy, distance: d, head: false, point: bodyHit.clone() });
        }
      }
    }

    results.sort((a, b) => a.distance - b.distance);
    return results;
  }

  damageRadius(position, radius, maxDamage, source, minFalloff = 0.1) {
    for (const enemy of this.list) {
      if (!enemy.alive) continue;
      const dx = enemy.pos.x - position.x;
      const dy = enemy.pos.y + 1.1 - position.y;
      const dz = enemy.pos.z - position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < radius) {
        const falloff = Math.max(minFalloff, 1 - dist / radius);
        const dir = new THREE.Vector3(dx, dy + 0.35, dz).normalize();
        enemy.pos.addScaledVector(dir, 0.45 * falloff);
        enemy.takeDamage(maxDamage * falloff, new THREE.Vector3(enemy.pos.x, enemy.pos.y + 1.1, enemy.pos.z), source, false, dir);
      }
    }
  }

  onKill(enemy, source, headshot) {
    this.game.onEnemyKilled(enemy, source, headshot);
  }

  clear() {
    for (const e of this.list) {
      this.game.scene.remove(e.root);
      e.model.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      for (const key of Object.keys(e.mats)) e.mats[key].dispose();
    }
    this.list.length = 0;
    for (const p of this.projectiles) {
      this.game.scene.remove(p.mesh);
    }
    this.projectiles.length = 0;
  }

  get aliveCount() {
    return this.list.filter((e) => e.alive).length;
  }
}
