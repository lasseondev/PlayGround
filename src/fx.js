import * as THREE from 'three';
import { glowTexture } from './textures.js';

const MAX = 2600;

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.cursor = 0;
    this.parts = new Array(MAX);
    for (let i = 0; i < MAX; i++) this.parts[i] = { life: 0, max: 1 };
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX * 3);
    this.col = new Float32Array(MAX * 3);
    this.size = new Float32Array(MAX);
    this.alpha = new Float32Array(MAX);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uScale: { value: 1 } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize; attribute float aAlpha;
        varying vec3 vColor; varying float vAlpha;
        uniform float uScale;
        void main(){
          vColor = aColor; vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = aSize * uScale * (220.0 / max(0.5, -mv.z));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.05, d) * vAlpha;
          if (a < 0.01) discard;
          gl_FragColor = vec4(vColor, a);
        }`
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    scene.add(this.points);
    this.geo = geo;
    this.uScale = mat.uniforms.uScale;

    // beam pool
    this.beams = [];
    const beamGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 28; i++) {
      const m = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      m.visible = false;
      m.frustumCulled = false;
      scene.add(m);
      this.beams.push({ mesh: m, life: 0, max: 1, width: 0.04 });
    }
    this.beamCursor = 0;

    // explosion spheres
    this.blasts = [];
    const sphereGeo = new THREE.IcosahedronGeometry(1, 2);
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({
        color: 0xffc070, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      m.visible = false;
      scene.add(m);
      this.blasts.push({ mesh: m, life: 0, max: 0.45, size: 1 });
    }
    this.blastCursor = 0;

    this.rings = [];
    const ringGeo = new THREE.RingGeometry(0.7, 1, 40);
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: 0xffb060, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      m.visible = false;
      scene.add(m);
      this.rings.push({ mesh: m, life: 0, max: 0.5, size: 1 });
    }
    this.ringCursor = 0;

    this.flash = new THREE.PointLight(0xffa040, 0, 22, 2);
    scene.add(this.flash);
    this.flashLife = 0;

    this.gibPieces = [];
    this.gibGeo = new THREE.BoxGeometry(1, 1, 1);
    this.time = 0;
  }

  setViewport(height, fov) {
    this.uScale.value = height / 900 * 1.15;
  }

  particle(p) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % MAX;
    const s = this.parts[i];
    s.x = p.x; s.y = p.y; s.z = p.z;
    s.vx = p.vx || 0; s.vy = p.vy || 0; s.vz = p.vz || 0;
    s.r = p.r ?? 1; s.g = p.g ?? 1; s.b = p.b ?? 1;
    s.size = p.size ?? 0.2;
    s.life = s.max = p.life ?? 0.6;
    s.grav = p.grav ?? 0;
    s.drag = p.drag ?? 1.6;
    s.fade = p.fade ?? 1;
    s.growth = p.growth ?? 0;
  }

  burst(pos, count, { color = 0x3fe9ff, speed = 6, size = 0.22, life = 0.5, grav = 8, spread = 1, dir = null, drag = 2, growth = 0 } = {}) {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
      if (dir) v.lerp(dir, 0.35);
      v.normalize().multiplyScalar(speed * (0.3 + Math.random() * 0.8) * spread);
      const jitter = 0.8 + Math.random() * 0.5;
      this.particle({
        x: pos.x + (Math.random() - 0.5) * 0.15,
        y: pos.y + (Math.random() - 0.5) * 0.15,
        z: pos.z + (Math.random() - 0.5) * 0.15,
        vx: v.x, vy: v.y, vz: v.z,
        r: c.r * jitter, g: c.g * jitter, b: c.b * jitter,
        size: size * (0.7 + Math.random() * 0.7),
        life: life * (0.6 + Math.random() * 0.7),
        grav, drag, growth
      });
    }
  }

  spark(pos, normal, color = 0xffd27a, count = 7) {
    const n = normal || new THREE.Vector3(0, 1, 0);
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const v = n.clone().multiplyScalar(0.6).add(new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.6, (Math.random() - 0.5) * 2)).normalize().multiplyScalar(3 + Math.random() * 7);
      this.particle({
        x: pos.x, y: pos.y, z: pos.z, vx: v.x, vy: v.y, vz: v.z,
        r: c.r, g: c.g, b: c.b, size: 0.11 + Math.random() * 0.1,
        life: 0.18 + Math.random() * 0.3, grav: 16, drag: 0.8
      });
    }
  }

  beam(from, to, color = 0x66f6ff, width = 0.055, life = 0.14) {
    const b = this.beams[this.beamCursor];
    this.beamCursor = (this.beamCursor + 1) % this.beams.length;
    const dir = to.clone().sub(from);
    const len = dir.length();
    if (len < 0.01) return;
    const mesh = b.mesh;
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    mesh.lookAt(to);
    mesh.scale.set(width, width, len);
    mesh.material.color.set(color);
    mesh.material.opacity = 1;
    mesh.visible = true;
    b.life = b.max = life;
    b.width = width;
  }

  rail(from, to) {
    this.beam(from, to, 0x99fbff, 0.09, 0.28);
    this.beam(from, to, 0x3fe9ff, 0.2, 0.22);
    this.burst(from, 14, { color: 0x9dfbff, speed: 7, size: 0.18, life: 0.3, dir: to.clone().sub(from).normalize(), grav: 0 });
    const end = from.clone().lerp(to, 1);
    this.spark(end, to.clone().sub(from).normalize().negate(), 0x99fbff, 12);
  }

  explosion(pos, scale = 1) {
    const b = this.blasts[this.blastCursor];
    this.blastCursor = (this.blastCursor + 1) % this.blasts.length;
    b.mesh.position.copy(pos);
    b.mesh.material.color.set(0xffc46b);
    b.mesh.material.opacity = 1;
    b.mesh.visible = true;
    b.size = 2.2 * scale;
    b.life = b.max = 0.38;
    const r = this.rings[this.ringCursor];
    this.ringCursor = (this.ringCursor + 1) % this.rings.length;
    r.mesh.position.copy(pos);
    r.mesh.position.y = Math.max(0.1, pos.y - 0.2);
    r.mesh.rotation.x = -Math.PI / 2;
    r.mesh.material.opacity = 0.9;
    r.mesh.visible = true;
    r.size = 5 * scale;
    r.life = r.max = 0.5;

    this.burst(pos, 34, { color: 0xffb050, speed: 12 * scale, size: 0.34, life: 0.7, grav: 6, drag: 2.4 });
    this.burst(pos, 18, { color: 0xff5a2a, speed: 7 * scale, size: 0.5, life: 0.9, grav: 3, drag: 2 });
    this.burst(pos, 16, { color: 0xfff0c0, speed: 18 * scale, size: 0.13, life: 0.4, grav: 12, drag: 1 });
    this.flash.position.copy(pos);
    this.flash.color.set(0xffa050);
    this.flash.intensity = 90 * scale;
    this.flash.distance = 26;
    this.flashLife = 0.28;
  }

  gibs(pos, color = 0x8b95a8, dir = new THREE.Vector3(0, 1, 0)) {
    for (let i = 0; i < 11; i++) {
      const size = 0.12 + Math.random() * 0.26;
      const mat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.35 ? color : 0xff3b4e,
        roughness: 0.7, metalness: 0.2,
        transparent: true, opacity: 1
      });
      const m = new THREE.Mesh(this.gibGeo, mat);
      m.scale.set(size * (0.6 + Math.random()), size * (0.5 + Math.random() * 0.8), size * (0.6 + Math.random()));
      m.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.5, Math.random() * 1.2, (Math.random() - 0.5) * 0.5));
      this.scene.add(m);
      this.gibPieces.push({
        mesh: m,
        v: new THREE.Vector3((Math.random() - 0.5) * 11, 5 + Math.random() * 8, (Math.random() - 0.5) * 11).addScaledVector(dir, 3),
        spin: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9),
        life: 2.4 + Math.random() * 1.4, max: 3.8
      });
    }
  }

  jet(pos, dir, color = 0x66eaff) {
    for (let i = 0; i < 2; i++) {
      const c = new THREE.Color(color);
      this.particle({
        x: pos.x + (Math.random() - 0.5) * 0.16,
        y: pos.y + Math.random() * 0.1,
        z: pos.z + (Math.random() - 0.5) * 0.16,
        vx: -dir.x * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
        vy: -dir.y * (2 + Math.random() * 3) - 1 - Math.random() * 2,
        vz: -dir.z * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
        r: c.r, g: c.g, b: c.b,
        size: 0.3 + Math.random() * 0.22,
        life: 0.16 + Math.random() * 0.2,
        grav: -2, drag: 2.5
      });
    }
  }

  update(dt, time) {
    this.time = time;
    for (let i = 0; i < MAX; i++) {
      const p = this.parts[i];
      if (p.life > 0) {
        p.life -= dt;
        if (p.life <= 0) {
          this.alpha[i] = 0;
          this.size[i] = 0;
          continue;
        }
        const d = Math.max(0, 1 - p.drag * dt);
        p.vx *= d; p.vy *= d; p.vz *= d;
        p.vy -= p.grav * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (p.y < 0.05 && p.vy < 0) { p.y = 0.05; p.vy *= -0.3; p.vx *= 0.8; p.vz *= 0.8; }
        const k = p.life / p.max;
        this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
        this.col[i * 3] = p.r; this.col[i * 3 + 1] = p.g; this.col[i * 3 + 2] = p.b;
        this.size[i] = p.size * (1 + p.growth * (1 - k));
        this.alpha[i] = Math.min(1, k * 1.8) * 0.9;
      } else {
        this.alpha[i] = 0;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aColor.needsUpdate = true;
    this.geo.attributes.aSize.needsUpdate = true;
    this.geo.attributes.aAlpha.needsUpdate = true;

    for (const b of this.beams) {
      if (b.life > 0) {
        b.life -= dt;
        const k = Math.max(0, b.life / b.max);
        b.mesh.material.opacity = k;
        b.mesh.scale.x = b.width * (0.4 + k * 0.8);
        b.mesh.scale.y = b.width * (0.4 + k * 0.8);
        if (b.life <= 0) b.mesh.visible = false;
      }
    }
    for (const b of this.blasts) {
      if (b.life > 0) {
        b.life -= dt;
        const k = Math.max(0, b.life / b.max);
        b.mesh.material.opacity = k * 0.9;
        const s = b.size * (1 + (1 - k) * 1.7);
        b.mesh.scale.setScalar(s);
        if (b.life <= 0) b.mesh.visible = false;
      }
    }
    for (const r of this.rings) {
      if (r.life > 0) {
        r.life -= dt;
        const k = Math.max(0, r.life / r.max);
        r.mesh.material.opacity = k * 0.7;
        r.mesh.scale.setScalar(r.size * (1 + (1 - k) * 2.2) * 0.4);
        if (r.life <= 0) r.mesh.visible = false;
      }
    }
    if (this.flashLife > 0) {
      this.flashLife -= dt;
      this.flash.intensity = Math.max(0, this.flash.intensity * (1 - dt * 12));
    } else if (this.flash.intensity !== 0) {
      this.flash.intensity = 0;
    }

    for (let i = this.gibPieces.length - 1; i >= 0; i--) {
      const g = this.gibPieces[i];
      g.life -= dt;
      g.v.y -= 26 * dt;
      g.mesh.position.addScaledVector(g.v, dt);
      g.mesh.rotation.x += g.spin.x * dt;
      g.mesh.rotation.y += g.spin.y * dt;
      g.mesh.rotation.z += g.spin.z * dt;
      if (g.mesh.position.y < 0.1) {
        g.mesh.position.y = 0.1;
        g.v.y = Math.abs(g.v.y) * 0.35;
        g.v.x *= 0.7; g.v.z *= 0.7;
        g.spin.multiplyScalar(0.7);
      }
      if (g.life < 0.8) g.mesh.material.opacity = Math.max(0, g.life / 0.8);
      if (g.life <= 0) {
        this.scene.remove(g.mesh);
        g.mesh.material.dispose();
        this.gibPieces.splice(i, 1);
      }
    }
  }

  clearGibs() {
    for (const g of this.gibPieces) { this.scene.remove(g.mesh); g.mesh.material.dispose(); }
    this.gibPieces.length = 0;
  }
}
