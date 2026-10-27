import * as THREE from 'three'

const vertexShader = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / max(0.1, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */`
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`

class Pool {
  constructor(scene, max, blending) {
    this.max = max
    this.count = 0
    this.parts = []
    this.positions = new Float32Array(max * 3)
    this.colors = new Float32Array(max * 3)
    this.sizes = new Float32Array(max)
    this.alphas = new Float32Array(max)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1))
    this.geo = geo
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending
    })
    this.points = new THREE.Points(geo, mat)
    this.points.frustumCulled = false
    scene.add(this.points)
    this.color = new THREE.Color()
  }

  spawn(pos, opts = {}) {
    if (this.count >= this.max) return
    const i = this.count++
    const live = {
      index: i,
      x: pos.x, y: pos.y, z: pos.z,
      vx: opts.vx ?? 0, vy: opts.vy ?? 0, vz: opts.vz ?? 0,
      gravity: opts.gravity ?? 9,
      drag: opts.drag ?? 0.5,
      life: opts.life ?? 1,
      maxLife: opts.life ?? 1,
      size: opts.size ?? 0.08,
      sizeEnd: opts.sizeEnd ?? 0.02,
      r: 0, g: 0, b: 0,
      floor: opts.floor ?? 0.02
    }
    this.color.set(opts.color ?? 0xffffff)
    live.r = this.color.r; live.g = this.color.g; live.b = this.color.b
    this.parts.push(live)
    return live
  }

  update(dt) {
    const parts = this.parts
    let write = 0
    for (let read = 0; read < this.count; read++) {
      const p = parts[read]
      p.life -= dt
      if (p.life <= 0) continue
      p.vy -= p.gravity * dt
      const drag = Math.max(0, 1 - p.drag * dt)
      p.vx *= drag; p.vy *= drag; p.vz *= drag
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt
      if (p.y < p.floor) { p.y = p.floor; p.vy *= -0.25; p.vx *= 0.6; p.vz *= 0.6 }
      const t = 1 - p.life / p.maxLife
      this.positions[write * 3] = p.x
      this.positions[write * 3 + 1] = p.y
      this.positions[write * 3 + 2] = p.z
      this.colors[write * 3] = p.r
      this.colors[write * 3 + 1] = p.g
      this.colors[write * 3 + 2] = p.b
      this.sizes[write] = p.size + (p.sizeEnd - p.size) * t
      this.alphas[write] = Math.max(0, (1 - t) * (t < 0.1 ? t / 0.1 : 1))
      if (write !== read) {
        parts[write] = p
        p.index = write
      }
      write++
    }
    this.count = write
    this.parts.length = write
    const n = Math.max(1, write)
    this.geo.setDrawRange(0, write)
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.aColor.needsUpdate = true
    this.geo.attributes.aSize.needsUpdate = true
    this.geo.attributes.aAlpha.needsUpdate = true
  }
}

export class Particles {
  constructor(scene) {
    this.normal = new Pool(scene, 900, THREE.NormalBlending)
    this.additive = new Pool(scene, 700, THREE.AdditiveBlending)
  }

  blood(pos, dir, amount = 14, power = 3.4) {
    for (let i = 0; i < amount; i++) {
      this.normal.spawn(pos, {
        vx: dir.x * power * (0.4 + Math.random()) + (Math.random() - 0.5) * 2.4,
        vy: dir.y * power * 0.5 + Math.random() * 2.6,
        vz: dir.z * power * (0.4 + Math.random()) + (Math.random() - 0.5) * 2.4,
        life: 0.5 + Math.random() * 0.8,
        size: 0.05 + Math.random() * 0.09,
        sizeEnd: 0.01,
        color: Math.random() > 0.4 ? 0x8c0e0c : 0x5a0806,
        gravity: 11,
        drag: 1.1
      })
    }
  }

  mist(pos, color = 0x8c0e0c) {
    for (let i = 0; i < 5; i++) {
      this.normal.spawn(pos, {
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * 0.7,
        vz: (Math.random() - 0.5) * 1.2,
        life: 0.7 + Math.random() * 0.6,
        size: 0.16,
        sizeEnd: 0.5,
        color,
        gravity: -0.2,
        drag: 2
      })
    }
  }

  sparks(pos, dir, amount = 10, color = 0xffb454) {
    for (let i = 0; i < amount; i++) {
      this.additive.spawn(pos, {
        vx: dir.x * 5 + (Math.random() - 0.5) * 6,
        vy: Math.random() * 4.6,
        vz: dir.z * 5 + (Math.random() - 0.5) * 6,
        life: 0.2 + Math.random() * 0.35,
        size: 0.035 + Math.random() * 0.04,
        sizeEnd: 0.005,
        color,
        gravity: 14,
        drag: 0.6
      })
    }
  }

  dust(pos, amount = 10, color = 0x9fb0b8) {
    for (let i = 0; i < amount; i++) {
      this.normal.spawn(pos, {
        vx: (Math.random() - 0.5) * 3.4,
        vy: Math.random() * 2.2,
        vz: (Math.random() - 0.5) * 3.4,
        life: 0.7 + Math.random() * 0.9,
        size: 0.12 + Math.random() * 0.2,
        sizeEnd: 0.45,
        color,
        gravity: 1.2,
        drag: 1.8
      })
    }
  }

  explosion(pos) {
    for (let i = 0; i < 46; i++) {
      const a = Math.random() * Math.PI * 2
      const up = Math.random() * 0.9
      const sp = 4 + Math.random() * 12
      this.additive.spawn(pos, {
        vx: Math.cos(a) * sp,
        vy: up * sp * 0.8 + 1,
        vz: Math.sin(a) * sp,
        life: 0.35 + Math.random() * 0.6,
        size: 0.1 + Math.random() * 0.2,
        sizeEnd: 0.01,
        color: Math.random() > 0.5 ? 0xffcc66 : 0xff5a1a,
        gravity: 6,
        drag: 1.2
      })
    }
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2
      this.normal.spawn(pos, {
        vx: Math.cos(a) * (2 + Math.random() * 5),
        vy: Math.random() * 5,
        vz: Math.sin(a) * (2 + Math.random() * 5),
        life: 1 + Math.random() * 1.4,
        size: 0.2 + Math.random() * 0.35,
        sizeEnd: 1.2,
        color: 0x4a4f52,
        gravity: -0.6,
        drag: 1.6
      })
    }
  }

  shell(pos, dir) {
    this.additive.spawn(pos, {
      vx: dir.x * 3 + 1.4 + Math.random(),
      vy: 2.2,
      vz: dir.z * 3 + (Math.random() - 0.5) * 1.5,
      life: 0.5,
      size: 0.03,
      sizeEnd: 0.02,
      color: 0xffcf7a,
      gravity: 12,
      drag: 0.2
    })
  }

  splinter(pos) {
    for (let i = 0; i < 8; i++) {
      this.normal.spawn(pos, {
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3,
        vz: (Math.random() - 0.5) * 4,
        life: 0.4 + Math.random() * 0.4,
        size: 0.02 + Math.random() * 0.03,
        sizeEnd: 0.01,
        color: 0x3a2c22,
        gravity: 13
      })
    }
  }

  update(dt) {
    this.normal.update(dt)
    this.additive.update(dt)
  }
}
