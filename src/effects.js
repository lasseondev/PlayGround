import * as THREE from "three";
import { rand, clamp } from "./utils.js";

const PARTICLE_VERT = `
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (420.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAG = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(1.0, 0.0, d);
    float hot = smoothstep(0.6, 0.0, d);
    vec3 col = vColor + hot * 0.35;
    gl_FragColor = vec4(col, core * core * vAlpha);
  }
`;

class ParticleField {
  constructor(scene, count, additive = true) {
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);
    this.alphas = new Float32Array(count);
    this.vel = new Float32Array(count * 3);
    this.life = new Float32Array(count);
    this.maxLife = new Float32Array(count);
    this.baseSize = new Float32Array(count);
    this.grow = new Float32Array(count);
    this.gravity = new Float32Array(count);
    this.drag = new Float32Array(count);
    this.fade = new Float32Array(count);
    this.cursor = 0;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(this.sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(this.alphas, 1));
    geo.setDrawRange(0, count);
    this.geo = geo;

    this.material = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    scene.add(this.points);

    for (let i = 0; i < count; i += 1) {
      this.alphas[i] = 0;
      this.positions[i * 3 + 1] = -9999;
    }
  }

  spawn(x, y, z, vx, vy, vz, color, size, life, { gravity = 0, drag = 0, grow = 0, fade = 1 } = {}) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.count;
    const i3 = i * 3;
    this.positions[i3] = x;
    this.positions[i3 + 1] = y;
    this.positions[i3 + 2] = z;
    this.vel[i3] = vx;
    this.vel[i3 + 1] = vy;
    this.vel[i3 + 2] = vz;
    this.colors[i3] = color.r;
    this.colors[i3 + 1] = color.g;
    this.colors[i3 + 2] = color.b;
    this.sizes[i] = size;
    this.baseSize[i] = size;
    this.alphas[i] = 1;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.gravity[i] = gravity;
    this.drag[i] = drag;
    this.grow[i] = grow;
    this.fade[i] = fade;
    return i;
  }

  update(dt) {
    const { positions, vel, life, maxLife, alphas, sizes, baseSize, gravity, drag, grow } = this;
    for (let i = 0; i < this.count; i += 1) {
      if (life[i] <= 0) continue;
      life[i] -= dt;
      if (life[i] <= 0) {
        alphas[i] = 0;
        positions[i * 3 + 1] = -9999;
        continue;
      }
      const i3 = i * 3;
      const d = Math.max(0, 1 - drag[i] * dt);
      vel[i3] *= d;
      vel[i3 + 1] = vel[i3 + 1] * d + gravity[i] * dt;
      vel[i3 + 2] *= d;
      positions[i3] += vel[i3] * dt;
      positions[i3 + 1] += vel[i3 + 1] * dt;
      positions[i3 + 2] += vel[i3 + 2] * dt;

      sizes[i] = Math.max(0.01, baseSize[i] * (1 + (grow[i] * (1 - life[i] / maxLife[i]))));
      const t = life[i] / maxLife[i];
      alphas[i] = Math.pow(t, 0.7);
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.geo.attributes.aSize.needsUpdate = true;
    this.geo.attributes.aAlpha.needsUpdate = true;
  }
}

const _v = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

export class Effects {
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.textures = game.textures;
    this.sparks = new ParticleField(this.scene, 2200, true);
    this.smoke = new ParticleField(this.scene, 900, false);
    this.decals = [];
    this.transients = [];
    this.lights = [];
    this.gibBodies = [];
    this.rings = [];

    this.decalGeo = new THREE.PlaneGeometry(1, 1);
    this.decalMat = new THREE.MeshBasicMaterial({
      map: this.textures.scorch,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
      color: 0x161616,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });

    this.glowSpriteMat = new THREE.SpriteMaterial({
      map: this.textures.glow,
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.smokeSpriteMat = new THREE.SpriteMaterial({
      map: this.textures.glow,
      color: 0x5a4038,
      transparent: true,
      depthWrite: false,
      opacity: 0.35,
      blending: THREE.NormalBlending,
    });

    this.lightPool = [];
    for (let i = 0; i < 6; i += 1) {
      const light = new THREE.PointLight(0xff7a2f, 0, 18, 2);
      light.visible = false;
      this.scene.add(light);
      this.lightPool.push({ light, life: 0, max: 0, power: 0 });
    }
    this.lightCursor = 0;

    this.buildAmbientDust();
  }

  buildAmbientDust() {
    const count = 420;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      pos[i * 3] = rand(-52, 52);
      pos[i * 3 + 1] = rand(0.4, 22);
      pos[i * 3 + 2] = rand(-52, 52);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xff9a5c,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: this.textures.glow,
    });
    this.dust = new THREE.Points(geo, mat);
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
    this.dustPhase = 0;
  }

  burst(position, color, count = 16, speed = 5, opts = {}) {
    const colorObj = new THREE.Color(color);
    const size = opts.size ?? 0.24;
    const life = opts.life ?? 0.6;
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const s = speed * (0.25 + Math.random() * 0.75);
      const vx = Math.sin(phi) * Math.cos(theta) * s;
      const vy = Math.cos(phi) * s * (opts.up ?? 1);
      const vz = Math.sin(phi) * Math.sin(theta) * s;
      this.sparks.spawn(
        position.x,
        position.y,
        position.z,
        vx,
        vy,
        vz,
        colorObj,
        size * (0.6 + Math.random() * 0.9),
        life * (0.5 + Math.random()),
        {
          gravity: opts.gravity ?? -9,
          drag: opts.drag ?? 1.4,
          grow: opts.grow ?? -0.2,
          fade: 1,
        },
      );
    }
  }

  smokePuff(position, count = 8, color = 0x3d2a22, size = 0.9, life = 1.2, speed = 1.6) {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i += 1) {
      this.smoke.spawn(
        position.x + rand(-0.4, 0.4),
        position.y + rand(-0.2, 0.5),
        position.z + rand(-0.4, 0.4),
        rand(-speed, speed),
        rand(0.3, speed),
        rand(-speed, speed),
        c,
        size * (0.6 + Math.random() * 0.8),
        life * (0.7 + Math.random() * 0.7),
        { gravity: 0.5, drag: 1.1, grow: 2.4 },
      );
    }
  }

  muzzle(position, color = 0xffa04a) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.textures.glow,
        color,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sprite.position.copy(position);
    const s = rand(0.8, 1.15);
    sprite.scale.set(s, s, 1);
    this.scene.add(sprite);
    this.transients.push({ object: sprite, life: 0.07, max: 0.07, type: "sprite" });

    this.flashLight(position, color, 3.4, 0.09, 9);
    this.burst(position, color, 5, 3.2, { size: 0.12, life: 0.14, drag: 2 });
  }

  flashLight(position, color, power, duration, distance = 16) {
    const entry = this.lightPool[this.lightCursor];
    this.lightCursor = (this.lightCursor + 1) % this.lightPool.length;
    entry.light.position.copy(position);
    entry.light.color.set(color);
    entry.light.distance = distance;
    entry.light.intensity = power;
    entry.light.visible = true;
    entry.life = duration;
    entry.max = duration;
    entry.power = power;
  }

  explosion(position, scale = 1) {
    const color = new THREE.Color(0xff6a22);
    this.burst(position, 0xffb04a, Math.floor(42 * scale), 13 * scale, {
      size: 0.55,
      life: 0.75,
      drag: 2.1,
      up: 1.2,
    });
    this.burst(position, 0xff3a0a, Math.floor(30 * scale), 8 * scale, {
      size: 0.8,
      life: 1.1,
      drag: 1.6,
      up: 1.4,
    });
    this.smokePuff(position, Math.floor(16 * scale), 0x2d211d, 1.8 * scale, 1.7, 2.6 * scale);
    this.flashLight(position, 0xff7a2f, 14 * scale, 0.5, 26 * scale);

    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0xffd6a0,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    flash.position.copy(position);
    flash.scale.setScalar(0.8 * scale);
    this.scene.add(flash);
    this.transients.push({ object: flash, life: 0.22, max: 0.22, type: "flash", grow: 7 * scale });

    const ringGeo = new THREE.RingGeometry(0.6, 0.84, 48);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xff9a4a,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ring.position.copy(position);
    ring.position.y = Math.max(position.y, 0.08);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);
    this.rings.push({ mesh: ring, life: 0.5, max: 0.5, scale: 9 * scale });

    const smokeSprite = new THREE.Sprite(this.smokeSpriteMat.clone());
    smokeSprite.position.copy(position);
    smokeSprite.scale.setScalar(1.5 * scale);
    this.scene.add(smokeSprite);
    this.transients.push({ object: smokeSprite, life: 1.5, max: 1.5, type: "smoke", grow: 4 * scale });

    if (position.y < 3) {
      this.scorch(position, scale);
    }
    this.game.addShake(0.5 * scale, 0.4);
  }

  ring(position, color = 0xff6a22, size = 1.6) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.78, 40),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    ring.position.copy(position);
    ring.position.y = Math.max(position.y + 0.05, 0.08);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);
    this.rings.push({ mesh: ring, life: 0.7, max: 0.7, scale: size * 3.2 });
  }

  railBeam(from, to, color = 0x8ff7ff) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    if (length < 0.01) return;
    dir.normalize();

    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, length, 6, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xeaffff,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const glow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, length, 8, 1, true),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    group.add(core, glow);
    group.position.copy(from).add(to).multiplyScalar(0.5);
    group.quaternion.setFromUnitVectors(_up, dir);
    this.scene.add(group);
    this.transients.push({ object: group, life: 0.22, max: 0.22, type: "beam" });
    this.flashLight(to, color, 5, 0.16, 14);
    this.burst(to, color, 18, 7, { size: 0.22, life: 0.4, drag: 2.6 });
    this.burst(to, 0xffffff, 6, 3, { size: 0.3, life: 0.25, drag: 3 });
    this.game.addShake(0.09, 0.12);
  }

  impact(position, normal, color = 0xffb060) {
    const n = normal ? normal.clone().normalize() : _up.clone();
    this.burst(position, color, 9, 5.5, { size: 0.16, life: 0.35, drag: 2.2, up: 1 });
    this.burst(position, 0xfff0c0, 3, 4, { size: 0.24, life: 0.22, drag: 2.5 });
    this.smokePuff(position, 3, 0x30302f, 0.5, 0.7, 0.7);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.textures.glow,
        color,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sprite.position.copy(position).addScaledVector(n, 0.05);
    sprite.scale.setScalar(0.55);
    this.scene.add(sprite);
    this.transients.push({ object: sprite, life: 0.09, max: 0.09, type: "sprite" });

    this.decal(position, n);
  }

  decal(position, normal) {
    const mesh = new THREE.Mesh(this.decalGeo, this.decalMat.clone());
    mesh.position.copy(position).addScaledVector(normal, 0.02);
    mesh.lookAt(position.clone().add(normal));
    mesh.rotateZ(Math.random() * Math.PI * 2);
    const s = rand(0.7, 1.35);
    mesh.scale.set(s, s, s);
    mesh.renderOrder = 2;
    this.scene.add(mesh);
    this.decals.push({ mesh, life: 18, max: 18 });
    if (this.decals.length > 36) {
      const old = this.decals.shift();
      this.scene.remove(old.mesh);
      old.mesh.material.dispose();
    }
  }

  scorch(position, scale = 1) {
    const mesh = new THREE.Mesh(this.decalGeo, this.decalMat.clone());
    mesh.material.opacity = 0.85;
    mesh.position.copy(position);
    mesh.position.y = Math.max(0.035, position.y - 0.4);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.random() * Math.PI;
    mesh.scale.setScalar(1.6 * scale);
    mesh.renderOrder = 2;
    this.scene.add(mesh);
    this.decals.push({ mesh, life: 22, max: 22 });
    if (this.decals.length > 36) {
      const old = this.decals.shift();
      this.scene.remove(old.mesh);
      old.mesh.material.dispose();
    }
  }

  rocketTrail(position, color = 0xff8a3a) {
    if (Math.random() < 0.85) {
      this.sparks.spawn(
        position.x + rand(-0.08, 0.08),
        position.y + rand(-0.08, 0.08),
        position.z + rand(-0.08, 0.08),
        rand(-0.5, 0.5),
        rand(-0.2, 0.8),
        rand(-0.5, 0.5),
        new THREE.Color(color),
        rand(0.24, 0.44),
        rand(0.35, 0.6),
        { gravity: 1.5, drag: 2.2, grow: 1.4 },
      );
    }
    if (Math.random() < 0.5) {
      this.smoke.spawn(
        position.x,
        position.y,
        position.z,
        rand(-0.3, 0.3),
        rand(0.1, 0.5),
        rand(-0.3, 0.3),
        new THREE.Color(0x4a423d),
        rand(0.3, 0.6),
        rand(0.45, 0.9),
        { gravity: 0.6, drag: 1.4, grow: 2.6 },
      );
    }
  }

  ember(position) {
    this.sparks.spawn(
      position.x + rand(-0.4, 0.4),
      position.y + rand(0, 0.3),
      position.z + rand(-0.4, 0.4),
      rand(-0.35, 0.35),
      rand(0.7, 2),
      rand(-0.35, 0.35),
      new THREE.Color().setHSL(rand(0.04, 0.09), 1, rand(0.5, 0.7)),
      rand(0.06, 0.16),
      rand(0.7, 1.8),
      { gravity: 0.5, drag: 0.2, grow: -0.5 },
    );
  }

  gibs(position, color, count = 8) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.45,
      emissive: new THREE.Color(color).multiplyScalar(0.18),
    });
    for (let i = 0; i < count; i += 1) {
      const size = rand(0.07, 0.2);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size * rand(0.5, 1.4)), mat);
      mesh.position.copy(position);
      mesh.position.y += rand(0, 1.2);
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(2.5, 7);
      const body = {
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * speed, rand(2, 7), Math.sin(angle) * speed),
        spin: new THREE.Vector3(rand(-9, 9), rand(-9, 9), rand(-9, 9)),
        life: rand(1.2, 2.4),
      };
      this.scene.add(mesh);
      this.gibBodies.push(body);
    }
  }

  update(dt) {
    this.sparks.update(dt);
    this.smoke.update(dt);

    this.dustPhase += dt;
    if (this.dust) {
      this.dust.rotation.y += dt * 0.008;
      this.dust.material.opacity = 0.45 + Math.sin(this.dustPhase * 0.6) * 0.12;
    }

    for (let i = this.transients.length - 1; i >= 0; i -= 1) {
      const t = this.transients[i];
      t.life -= dt;
      const k = clamp(t.life / t.max, 0, 1);
      if (t.type === "flash") {
        t.object.scale.setScalar(1 + (1 - k) * t.grow);
        t.object.material.opacity = k * 0.95;
      } else if (t.type === "sprite") {
        t.object.material.opacity = k;
        t.object.scale.multiplyScalar(1 + dt * 0.8);
      } else if (t.type === "smoke") {
        t.object.scale.setScalar(1.5 + (1 - k) * t.grow);
        t.object.material.opacity = k * 0.35;
      } else if (t.type === "beam") {
        t.object.children.forEach((child) => {
          child.material.opacity = k;
        });
      }
      if (t.life <= 0) {
        this.scene.remove(t.object);
        t.object.traverse?.((o) => {
          if (o.material) {
            if (o.geometry) o.geometry.dispose();
            o.material.dispose();
          }
        });
        this.transients.splice(i, 1);
      }
    }

    for (let i = this.rings.length - 1; i >= 0; i -= 1) {
      const r = this.rings[i];
      r.life -= dt;
      const k = clamp(r.life / r.max, 0, 1);
      r.mesh.scale.setScalar(1 + (1 - k) * r.scale);
      r.mesh.material.opacity = k * 0.8;
      if (r.life <= 0) {
        this.scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
        this.rings.splice(i, 1);
      }
    }

    for (let i = this.lightPool.length - 1; i >= 0; i -= 1) {
      const entry = this.lightPool[i];
      if (!entry.light.visible) continue;
      entry.life -= dt;
      const k = clamp(entry.life / entry.max, 0, 1);
      entry.light.intensity = entry.power * k * k;
      if (entry.life <= 0) {
        entry.light.visible = false;
        entry.light.intensity = 0;
      }
    }

    for (let i = this.gibBodies.length - 1; i >= 0; i -= 1) {
      const g = this.gibBodies[i];
      g.life -= dt;
      g.vel.y -= 24 * dt;
      g.mesh.position.addScaledVector(g.vel, dt);
      if (g.mesh.position.y < 0.15) {
        g.mesh.position.y = 0.15;
        g.vel.y *= -0.32;
        g.vel.x *= 0.7;
        g.vel.z *= 0.7;
        g.spin.multiplyScalar(0.6);
      }
      g.mesh.rotation.x += g.spin.x * dt;
      g.mesh.rotation.y += g.spin.y * dt;
      g.mesh.rotation.z += g.spin.z * dt;
      if (g.life <= 0) {
        this.scene.remove(g.mesh);
        g.mesh.geometry.dispose();
        if (i === 0) g.mesh.material.dispose();
        this.gibBodies.splice(i, 1);
      }
    }

    for (let i = this.decals.length - 1; i >= 0; i -= 1) {
      const d = this.decals[i];
      d.life -= dt;
      if (d.life < 3) d.mesh.material.opacity = Math.max(0, d.life / 3) * 0.75;
      if (d.life <= 0) {
        this.scene.remove(d.mesh);
        d.mesh.material.dispose();
        this.decals.splice(i, 1);
      }
    }
  }

  clear() {
    for (const t of this.transients) {
      this.scene.remove(t.object);
    }
    this.transients.length = 0;
    for (const d of this.decals) {
      this.scene.remove(d.mesh);
      d.mesh.material.dispose();
    }
    this.decals.length = 0;
    for (const g of this.gibBodies) {
      this.scene.remove(g.mesh);
      g.mesh.geometry.dispose();
    }
    this.gibBodies.length = 0;
    for (const r of this.rings) {
      this.scene.remove(r.mesh);
      r.mesh.geometry.dispose();
      r.mesh.material.dispose();
    }
    this.rings.length = 0;
  }
}
