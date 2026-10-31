import * as THREE from 'three';
import { rand, pick, glowTex, clamp, easeOutCubic } from './util.js';

const PARTICLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (620.0 / max(0.1, -mv.z)), 1.0, 100.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    float a = tex.a * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor * tex.rgb, a);
  }
`;

const MOTE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (500.0 / max(0.1, -mv.z)), 0.5, 16.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'effects';
    scene.add(this.group);
    this.rings = [];
    this.trails = [];
    this.initParticles();
    this.initMotes();
  }

  initParticles() {
    this.count = 900;
    const pos = new Float32Array(this.count * 3);
    const col = new Float32Array(this.count * 3);
    const size = new Float32Array(this.count);
    const alpha = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      pos[i * 3 + 1] = -1000;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: glowTex() } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    this.pPos = pos;
    this.pCol = col;
    this.pSize = size;
    this.pAlpha = alpha;
    this.pGeo = geo;
    this.particles = Array.from({ length: this.count }, () => ({
      life: 0,
      maxLife: 1,
      vx: 0,
      vy: 0,
      vz: 0,
      gravity: 0,
      drag: 0,
      baseAlpha: 1,
      baseSize: 0.1,
      shrink: 0,
    }));
    this.cursor = 0;
  }

  initMotes() {
    const count = 420;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const alpha = new Float32Array(count);
    const phase = new Float32Array(count);
    const base = new Float32Array(count * 3);
    const colors = [new THREE.Color('#d8c39a'), new THREE.Color('#7fded2'), new THREE.Color('#e8b878')];
    for (let i = 0; i < count; i++) {
      const x = rand(-50, 50);
      const z = rand(-88, 42);
      const y = rand(0.4, 7.2);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      const c = pick(colors);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      size[i] = rand(0.05, 0.14);
      alpha[i] = rand(0.1, 0.34);
      phase[i] = rand(0, Math.PI * 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: glowTex() } },
      vertexShader: MOTE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    this.motes = new THREE.Points(geo, mat);
    this.motes.frustumCulled = false;
    this.group.add(this.motes);
    this.moteBase = base;
    this.motePhase = phase;
    this.motePos = pos;
    this.moteAlpha = alpha;
  }

  spawn(opts = {}) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.count;
    const p = this.particles[i];
    const position = opts.position || { x: 0, y: 1, z: 0 };
    p.life = p.maxLife = opts.life ?? 0.8;
    p.vx = opts.vx ?? 0;
    p.vy = opts.vy ?? 0;
    p.vz = opts.vz ?? 0;
    p.gravity = opts.gravity ?? 0;
    p.drag = opts.drag ?? 1;
    p.baseAlpha = opts.alpha ?? 1;
    p.baseSize = opts.size ?? 0.15;
    p.shrink = opts.shrink ?? 0;
    this.pPos[i * 3] = position.x + (opts.jitter ?? 0) * rand(-1, 1);
    this.pPos[i * 3 + 1] = position.y + (opts.jitter ?? 0) * rand(-1, 1);
    this.pPos[i * 3 + 2] = position.z + (opts.jitter ?? 0) * rand(-1, 1);
    const c = opts.color instanceof THREE.Color ? opts.color : new THREE.Color(opts.color ?? '#ffffff');
    this.pCol[i * 3] = c.r;
    this.pCol[i * 3 + 1] = c.g;
    this.pCol[i * 3 + 2] = c.b;
    this.pSize[i] = p.baseSize;
    this.pAlpha[i] = p.baseAlpha;
    return i;
  }

  burst(position, color = '#ffcf8a', count = 16, opts = {}) {
    const spread = opts.spread ?? 0.4;
    const speed = opts.speed ?? 3;
    const up = opts.up ?? 1.5;
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(0.2, 1) * speed;
      this.spawn({
        position: {
          x: position.x + rand(-spread, spread),
          y: position.y + rand(-spread * 0.5, spread),
          z: position.z + rand(-spread, spread),
        },
        color,
        life: rand(0.35, 0.9) * (opts.lifeScale ?? 1),
        vx: Math.cos(a) * s,
        vy: rand(0.2, 1) * up * (opts.upScale ?? 1),
        vz: Math.sin(a) * s,
        gravity: opts.gravity ?? 7,
        drag: opts.drag ?? 1.8,
        size: rand(0.08, 0.24) * (opts.sizeScale ?? 1),
        alpha: opts.alpha ?? 0.85,
        shrink: 0.6,
      });
    }
  }

  ember(position, color = '#ff9b52') {
    this.spawn({
      position: { x: position.x + rand(-0.18, 0.18), y: position.y, z: position.z + rand(-0.18, 0.18) },
      color,
      life: rand(0.7, 1.5),
      vx: rand(-0.35, 0.35),
      vy: rand(0.6, 1.5),
      vz: rand(-0.35, 0.35),
      gravity: 0.4,
      drag: 0.7,
      size: rand(0.03, 0.09),
      alpha: rand(0.5, 0.9),
    });
  }

  dust(position, count = 8, color = '#c3ac82') {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      this.spawn({
        position: { x: position.x + rand(-0.5, 0.5), y: position.y + rand(0, 0.3), z: position.z + rand(-0.5, 0.5) },
        color,
        life: rand(0.45, 1.1),
        vx: Math.cos(a) * rand(0.4, 1.6),
        vy: rand(0.2, 0.8),
        vz: Math.sin(a) * rand(0.4, 1.6),
        gravity: -0.2,
        drag: 2.2,
        size: rand(0.16, 0.42),
        alpha: rand(0.12, 0.3),
      });
    }
  }

  spark(position, color = '#fff1c9', count = 6) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      this.spawn({
        position,
        color,
        life: rand(0.12, 0.3),
        vx: Math.cos(a) * rand(1, 3.4),
        vy: rand(-0.4, 1.4),
        vz: Math.sin(a) * rand(1, 3.4),
        gravity: 6,
        drag: 2.4,
        size: rand(0.03, 0.08),
        alpha: 1,
      });
    }
  }

  impact(position, color = '#ffe0a0', count = 12) {
    this.burst(position, color, count, { speed: 4, up: 3, gravity: 9, sizeScale: 0.9 });
    this.spark(position, color, 8);
  }

  soul(position, color = '#b897ff') {
    this.burst(position, color, 28, { speed: 2.4, up: 3.2, gravity: 1.2, drag: 1.4, sizeScale: 1.1, lifeScale: 1.3 });
    this.burst(position, '#e9dcff', 8, { speed: 1.2, up: 2.4, gravity: 0.4, drag: 1, sizeScale: 0.7 });
  }

  shockwave(position, { color = '#ff8a5c', maxRadius = 9, duration = 0.9, thickness = 0.18 } = {}) {
    const geo = new THREE.RingGeometry(0.9, 1, 72);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(position.x, (position.y ?? 0) + 0.09, position.z);
    mesh.scale.setScalar(0.2);
    this.group.add(mesh);
    this.rings.push({ mesh, age: 0, duration, maxRadius, thickness });
    // second, softer ring
    const mesh2 = new THREE.Mesh(geo.clone(), mat.clone());
    mesh2.material.opacity = 0.35;
    mesh2.rotation.x = -Math.PI / 2;
    mesh2.position.copy(mesh.position);
    mesh2.position.y += 0.02;
    mesh2.scale.setScalar(0.1);
    this.group.add(mesh2);
    this.rings[this.rings.length - 1].mesh2 = mesh2;
  }

  slash(position, yaw, color = '#b9fff2') {
    const geo = new THREE.RingGeometry(1.25, 2.9, 40, 1, -0.55, 2.25);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -yaw + Math.PI / 2;
    mesh.position.set(position.x, position.y + 1.05, position.z);
    this.group.add(mesh);
    this.trails.push({ mesh, age: 0, duration: 0.24 });
    for (let i = 0; i < 6; i++) {
      const a = yaw + rand(-0.6, 0.6);
      this.spark({ x: position.x - Math.sin(a) * 1.9, y: position.y + rand(0.7, 1.5), z: position.z - Math.cos(a) * 1.9 }, color, 1);
    }
  }

  dustRing(position, color = '#c9b087') {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      this.spawn({
        position: { x: position.x + Math.cos(a) * rand(0.3, 1.2), y: position.y + 0.1, z: position.z + Math.sin(a) * rand(0.3, 1.2) },
        color,
        life: rand(0.5, 1.2),
        vx: Math.cos(a) * rand(1, 2.8),
        vy: rand(0.1, 0.6),
        vz: Math.sin(a) * rand(1, 2.8),
        gravity: -0.1,
        drag: 2.0,
        size: rand(0.15, 0.4),
        alpha: rand(0.12, 0.36),
      });
    }
  }

  update(dt, elapsed) {
    // particles
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      if (p.life <= 0) {
        if (this.pAlpha[i] !== 0) this.pAlpha[i] = 0;
        continue;
      }
      p.life -= dt;
      if (p.life <= 0) {
        this.pAlpha[i] = 0;
        continue;
      }
      const damp = Math.exp(-p.drag * dt);
      p.vx *= damp;
      p.vz *= damp;
      p.vy = p.vy * damp - p.gravity * dt;
      this.pPos[i * 3] += p.vx * dt;
      this.pPos[i * 3 + 1] += p.vy * dt;
      this.pPos[i * 3 + 2] += p.vz * dt;
      const t = p.life / p.maxLife;
      this.pAlpha[i] = p.baseAlpha * Math.pow(t, 1.4);
      this.pSize[i] = p.baseSize * (1 + (1 - t) * p.shrink);
    }
    this.pGeo.attributes.position.needsUpdate = true;
    this.pGeo.attributes.aAlpha.needsUpdate = true;
    this.pGeo.attributes.aSize.needsUpdate = true;
    this.pGeo.attributes.color.needsUpdate = true;

    // motes
    for (let i = 0; i < this.motePhase.length; i++) {
      const ph = this.motePhase[i];
      this.motePos[i * 3] = this.moteBase[i * 3] + Math.sin(elapsed * 0.13 + ph) * 0.8;
      this.motePos[i * 3 + 1] = this.moteBase[i * 3 + 1] + Math.sin(elapsed * 0.21 + ph * 2) * 0.35;
      this.motePos[i * 3 + 2] = this.moteBase[i * 3 + 2] + Math.cos(elapsed * 0.17 + ph) * 0.8;
      this.moteAlpha[i] = (0.1 + 0.18 * (0.5 + 0.5 * Math.sin(elapsed * 1.2 + ph))) * 0.8;
    }
    this.motes.geometry.attributes.position.needsUpdate = true;
    this.motes.geometry.attributes.aAlpha.needsUpdate = true;

    // rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.age += dt;
      const t = clamp(r.age / r.duration, 0, 1);
      const e = easeOutCubic(t);
      const radius = 0.2 + e * r.maxRadius;
      r.mesh.scale.setScalar(radius);
      r.mesh.material.opacity = (1 - t) * 0.9;
      if (r.mesh2) {
        r.mesh2.scale.setScalar(radius * 0.94);
        r.mesh2.material.opacity = (1 - t) * 0.32;
      }
      if (t >= 1) {
        this.group.remove(r.mesh);
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
        if (r.mesh2) {
          this.group.remove(r.mesh2);
          r.mesh2.geometry.dispose();
          r.mesh2.material.dispose();
        }
        this.rings.splice(i, 1);
      }
    }

    // slash trails
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const tr = this.trails[i];
      tr.age += dt;
      const t = tr.age / tr.duration;
      tr.mesh.material.opacity = Math.max(0, 1 - t) * 0.75;
      tr.mesh.scale.setScalar(0.92 + t * 0.18);
      tr.mesh.rotation.z += dt * 3.5;
      if (t >= 1) {
        this.group.remove(tr.mesh);
        tr.mesh.geometry.dispose();
        tr.mesh.material.dispose();
        this.trails.splice(i, 1);
      }
    }
  }
}
