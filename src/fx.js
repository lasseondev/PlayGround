import * as THREE from '../vendor/three.module.js';

export function makeGlowTexture(core = 'rgba(255,255,255,1)', edge = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, core);
  g.addColorStop(0.22, core);
  g.addColorStop(0.5, edge);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.72)');
  g.addColorStop(0.45, 'rgba(0,0,0,0.42)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const particleVert = /* glsl */ `
  attribute float size;
  attribute float alpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = alpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = min(120.0, size * (330.0 / max(1.0, -mvPosition.z)));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

export class Particles {
  constructor(scene, max = 1600) {
    this.scene = scene;
    this.max = max;
    this.active = [];
    this.pool = [];
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    const mat = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.geometry = geo;
    scene.add(this.points);
  }

  _grab() {
    if (this.active.length >= this.max) return null;
    return this.pool.pop() || {
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      color: new THREE.Color(),
      size: 1,
      life: 0,
      maxLife: 1,
      gravity: 0,
      drag: 0,
    };
  }

  emit(position, color, opts = {}) {
    const p = this._grab();
    if (!p) return;
    p.pos.copy(position);
    const speed = opts.speed ?? 2;
    const up = opts.up ?? 1;
    p.vel.set(
      (Math.random() - 0.5) * speed + (opts.vx || 0),
      Math.random() * speed * 0.6 * up + (opts.vy || 0),
      (Math.random() - 0.5) * speed + (opts.vz || 0)
    );
    p.color.set(color);
    p.size = (opts.size ?? 0.5) * (0.7 + Math.random() * 0.6);
    p.life = p.maxLife = (opts.life ?? 0.6) * (0.75 + Math.random() * 0.5);
    p.gravity = opts.gravity ?? 0;
    p.drag = opts.drag ?? 1.2;
    this.active.push(p);
  }

  burst(position, color, count = 20, opts = {}) {
    for (let i = 0; i < count; i++) this.emit(position, color, opts);
  }

  update(dt) {
    let n = 0;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.pool.push(p);
        this.active.splice(i, 1);
        continue;
      }
      p.vel.y -= p.gravity * dt;
      p.vel.multiplyScalar(Math.exp(-p.drag * dt));
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0.05) {
        p.pos.y = 0.05;
        p.vel.y *= -0.25;
      }
    }
    for (const p of this.active) {
      if (n >= this.max) break;
      const t = p.life / p.maxLife;
      this.pos[n * 3] = p.pos.x;
      this.pos[n * 3 + 1] = p.pos.y;
      this.pos[n * 3 + 2] = p.pos.z;
      this.col[n * 3] = p.color.r;
      this.col[n * 3 + 1] = p.color.g;
      this.col[n * 3 + 2] = p.color.b;
      this.size[n] = p.size * (0.45 + t * 0.75);
      this.alpha[n] = Math.min(1, t * 1.8);
      n++;
    }
    this.geometry.setDrawRange(0, n);
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.alpha.needsUpdate = true;
  }

  clear() {
    for (const p of this.active) this.pool.push(p);
    this.active.length = 0;
    this.geometry.setDrawRange(0, 0);
  }
}

export class Shockwaves {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.geo = new THREE.RingGeometry(0.82, 1, 48);
  }

  spawn(position, color, opts = {}) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: opts.opacity ?? 0.7,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.position.copy(position);
    if (opts.horizontal) mesh.rotation.x = -Math.PI / 2;
    else if (opts.verticalX) mesh.rotation.y = Math.PI / 2;
    const start = opts.start ?? 0.5;
    mesh.scale.setScalar(start);
    this.scene.add(mesh);
    this.items.push({
      mesh,
      life: 0,
      maxLife: opts.life ?? 0.6,
      start,
      end: opts.end ?? 8,
      spin: opts.spin ?? 0,
    });
  }

  update(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.life += dt;
      const t = it.life / it.maxLife;
      if (t >= 1) {
        this.scene.remove(it.mesh);
        it.mesh.material.dispose();
        this.items.splice(i, 1);
        continue;
      }
      const e = 1 - Math.pow(1 - t, 3);
      it.mesh.scale.setScalar(it.start + (it.end - it.start) * e);
      it.mesh.material.opacity = (1 - t) * 0.72;
      if (it.spin) it.mesh.rotation.z += it.spin * dt;
    }
  }
}

export function makeSprite(texture, color, scale = 1, opacity = 1) {
  const mat = new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.setScalar(scale);
  return sprite;
}
