import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(-mv.z, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha;
    vColor = aColor;
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float a = smoothstep(0.5, 0.04, d) * vAlpha;
    if (a < 0.012) discard;
    gl_FragColor = vec4(vColor, a);
  }
`

class ParticleSystem {
  constructor(scene, max, blending) {
    this.max = max
    this.cursor = 0
    this.pool = Array.from({ length: max }, () => ({
      active: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
      life: 0, maxLife: 1, size: 1, grow: 0, gravity: 0, drag: 0, r: 1, g: 1, b: 1,
    }))
    this.positions = new Float32Array(max * 3)
    this.colors = new Float32Array(max * 3)
    this.sizes = new Float32Array(max)
    this.alphas = new Float32Array(max)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage))
    this.geo = geo
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uScale: { value: 700 } },
      transparent: true,
      depthWrite: false,
      blending,
    })
    this.points = new THREE.Points(geo, this.material)
    this.points.frustumCulled = false
    scene.add(this.points)
  }

  setViewport(height, fov) {
    this.material.uniforms.uScale.value = height / (2 * Math.tan((fov * Math.PI) / 360))
  }

  spawn(x, y, z, count, opts = {}) {
    const {
      speed = 5, spread = 0.4, size = 0.2, life = 0.7, grow = 0,
      gravity = 0, drag = 0.9, up = 3, color = new THREE.Color(1, 1, 1), alpha = 1,
    } = opts
    for (let i = 0; i < count; i++) {
      const p = this.pool[this.cursor]
      this.cursor = (this.cursor + 1) % this.max
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * speed
      p.active = true
      p.x = x + (Math.random() - 0.5) * spread
      p.y = y + (Math.random() - 0.5) * spread
      p.z = z + (Math.random() - 0.5) * spread
      p.vx = Math.cos(a) * r
      p.vz = Math.sin(a) * r
      p.vy = up * (0.3 + Math.random())
      p.life = p.maxLife = life * (0.6 + Math.random() * 0.8)
      p.size = size * (0.6 + Math.random() * 0.8)
      p.grow = grow
      p.gravity = gravity
      p.drag = drag
      p.r = color.r
      p.g = color.g
      p.b = color.b
      p.alpha = alpha
    }
  }

  update(dt) {
    const pos = this.positions
    const col = this.colors
    const sizes = this.sizes
    const alphas = this.alphas
    for (let i = 0; i < this.max; i++) {
      const p = this.pool[i]
      const idx = i * 3
      if (!p.active) {
        alphas[i] = 0
        continue
      }
      p.life -= dt
      if (p.life <= 0) {
        p.active = false
        alphas[i] = 0
        continue
      }
      const damp = Math.exp(-p.drag * dt)
      p.vx *= damp
      p.vz *= damp
      p.vy = p.vy * damp - p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      if (p.y < 0.05 && p.gravity > 0) {
        p.y = 0.05
        p.vy *= -0.32
      }
      const t = p.life / p.maxLife
      pos[idx] = p.x
      pos[idx + 1] = p.y
      pos[idx + 2] = p.z
      col[idx] = p.r
      col[idx + 1] = p.g
      col[idx + 2] = p.b
      sizes[i] = p.size * (1 + (1 - t) * p.grow)
      alphas[i] = t * p.alpha
    }
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.aColor.needsUpdate = true
    this.geo.attributes.aSize.needsUpdate = true
    this.geo.attributes.aAlpha.needsUpdate = true
  }
}

export class Particles {
  constructor(scene) {
    this.sparks = new ParticleSystem(scene, 500, THREE.AdditiveBlending)
    this.smoke = new ParticleSystem(scene, 260, THREE.NormalBlending)
    this.smokeColor = new THREE.Color('#b9c6d4')
    this.sparkColor = new THREE.Color('#ffb54b')
    this.pink = new THREE.Color('#ff3ba7')
    this.cyan = new THREE.Color('#7defff')
  }

  setViewport(height, fov) {
    this.sparks.setViewport(height, fov)
    this.smoke.setViewport(height, fov)
  }

  burst(x, y, z, color = this.sparkColor, count = 18) {
    this.sparks.spawn(x, y, z, count, {
      speed: 11, spread: 0.35, size: 0.16, life: 0.65, gravity: 20, drag: 1.4, up: 4.5, color,
    })
  }

  smokePuff(x, y, z, count = 3) {
    this.smoke.spawn(x, y, z, count, {
      speed: 1.7, spread: 0.4, size: 0.65, life: 1.5, grow: 2.4, gravity: -0.6, drag: 1.4, up: 1.2,
      color: this.smokeColor, alpha: 0.32,
    })
  }

  pickup(x, y, z) {
    this.sparks.spawn(x, y, z, 46, {
      speed: 9, spread: 0.6, size: 0.2, life: 1.1, gravity: 5, drag: 1.1, up: 5, color: this.pink, alpha: 1,
    })
    this.sparks.spawn(x, y, z, 30, {
      speed: 6, spread: 0.4, size: 0.15, life: 0.9, gravity: 3, drag: 1.2, up: 4, color: this.cyan,
    })
  }

  update(dt) {
    this.sparks.update(dt)
    this.smoke.update(dt)
  }
}
