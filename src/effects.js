import * as THREE from 'three'
import { canvasTexture } from './util.js'

function makeGlowTexture() {
  return canvasTexture(64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(255,246,200,.9)')
    g.addColorStop(0.55, 'rgba(255,196,80,.35)')
    g.addColorStop(1, 'rgba(255,170,40,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

export class Effects {
  constructor(scene, camera, renderer) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.glow = makeGlowTexture()
    this.maxParticles = 700
    this.particles = []
    this.tracers = []
    this.flashes = []
    this.rings = []
    this._initParticles()
  }

  _initParticles() {
    const geo = new THREE.BufferGeometry()
    this.pPos = new Float32Array(this.maxParticles * 3)
    this.pColor = new Float32Array(this.maxParticles * 3)
    this.pAlpha = new Float32Array(this.maxParticles)
    this.pSize = new Float32Array(this.maxParticles)
    for (let i = 0; i < this.maxParticles; i++) {
      this.pPos[i * 3 + 1] = -999
      this.pAlpha[i] = 0
      this.pSize[i] = 0.1
      this.particles.push({ life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, gravity: 8, drag: 0.98 })
    }
    geo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.pColor, 3))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.pAlpha, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.pSize, 1))
    this.pMat = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uMap: { value: this.glow }
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aAlpha;
        attribute float aSize;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uPixelRatio;
        void main() {
          vColor = aColor;
          vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (260.0 / max(1.0, -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          if (tex.a < 0.02) discard;
          gl_FragColor = vec4(vColor, vAlpha * tex.a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    this.points = new THREE.Points(geo, this.pMat)
    this.points.frustumCulled = false
    this.points.renderOrder = 6
    this.scene.add(this.points)
    this.pCursor = 0
  }

  spawnParticles(position, color, count = 10, opts = {}) {
    const {
      speed = 3,
      spread = 1,
      life = 0.5,
      gravity = 9,
      size = 0.12,
      drag = 0.98,
      upward = 1
    } = opts
    const c = new THREE.Color(color)
    for (let i = 0; i < count; i++) {
      const idx = this.pCursor
      this.pCursor = (this.pCursor + 1) % this.maxParticles
      const p = this.particles[idx]
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * spread
      p.vx = Math.cos(a) * r * speed
      p.vz = Math.sin(a) * r * speed
      p.vy = (Math.random() * upward + 0.15) * speed
      p.gravity = gravity
      p.drag = drag
      p.life = p.maxLife = life * (0.6 + Math.random() * 0.7)
      this.pPos[idx * 3] = position.x + (Math.random() - 0.5) * 0.15
      this.pPos[idx * 3 + 1] = position.y + (Math.random() - 0.5) * 0.15
      this.pPos[idx * 3 + 2] = position.z + (Math.random() - 0.5) * 0.15
      this.pColor[idx * 3] = c.r
      this.pColor[idx * 3 + 1] = c.g
      this.pColor[idx * 3 + 2] = c.b
      this.pAlpha[idx] = 1
      this.pSize[idx] = size * (0.7 + Math.random() * 0.8)
    }
    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.aColor.needsUpdate = true
    this.points.geometry.attributes.aAlpha.needsUpdate = true
    this.points.geometry.attributes.aSize.needsUpdate = true
  }

  tracer(from, to, color = 0xffe4a0, opacity = 0.95) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()])
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    line.frustumCulled = false
    line.renderOrder = 5
    this.scene.add(line)
    this.tracers.push({ line, life: 0.075, maxLife: 0.075, mat })
  }

  muzzle(position, color = 0xffd27a, scale = 0.7) {
    const mat = new THREE.SpriteMaterial({ map: this.glow, color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    const sprite = new THREE.Sprite(mat)
    sprite.position.copy(position)
    sprite.scale.setScalar(scale)
    sprite.renderOrder = 6
    this.scene.add(sprite)
    this.flashes.push({ sprite, mat, life: 0.06, maxLife: 0.06 })
  }

  buildPulse(position, color = 0xffd166) {
    const geo = new THREE.RingGeometry(0.3, 0.48, 20)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    const ring = new THREE.Mesh(geo, mat)
    ring.position.copy(position)
    ring.rotation.x = -Math.PI / 2
    this.scene.add(ring)
    this.rings.push({ ring, mat, life: 0.42, maxLife: 0.42, scale: 2.4 })
  }

  explosion(position, color = 0xffa54a, count = 26) {
    this.spawnParticles(position, 0xffc466, count, { speed: 7, spread: 1.4, life: 0.75, gravity: 4, size: 0.24, upward: 1.5 })
    this.spawnParticles(position, color, Math.floor(count * 0.6), { speed: 5, spread: 1.2, life: 0.55, gravity: 7, size: 0.19, upward: 1 })
  }

  update(dt) {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i]
      if (p.life <= 0) {
        if (this.pAlpha[i] !== 0) this.pAlpha[i] = 0
        continue
      }
      p.life -= dt
      p.vy -= p.gravity * dt
      p.vx *= p.drag
      p.vz *= p.drag
      this.pPos[i * 3] += p.vx * dt
      this.pPos[i * 3 + 1] += p.vy * dt
      this.pPos[i * 3 + 2] += p.vz * dt
      this.pAlpha[i] = Math.max(0, p.life / p.maxLife)
    }
    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.aAlpha.needsUpdate = true

    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i]
      t.life -= dt
      t.mat.opacity = Math.max(0, t.life / t.maxLife) * 0.95
      if (t.life <= 0) {
        this.scene.remove(t.line)
        t.line.geometry.dispose()
        t.mat.dispose()
        this.tracers.splice(i, 1)
      }
    }
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i]
      f.life -= dt
      const k = Math.max(0, f.life / f.maxLife)
      f.mat.opacity = k
      f.sprite.scale.setScalar(0.3 + (1 - k) * 0.7)
      if (f.life <= 0) {
        this.scene.remove(f.sprite)
        f.mat.dispose()
        this.flashes.splice(i, 1)
      }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]
      r.life -= dt
      const k = 1 - Math.max(0, r.life / r.maxLife)
      r.ring.scale.setScalar(1 + k * r.scale)
      r.mat.opacity = (1 - k) * 0.8
      if (r.life <= 0) {
        this.scene.remove(r.ring)
        r.ring.geometry.dispose()
        r.mat.dispose()
        this.rings.splice(i, 1)
      }
    }
  }

  clearTransient() {
    for (const t of this.tracers) { this.scene.remove(t.line); t.line.geometry.dispose(); t.mat.dispose() }
    for (const f of this.flashes) { this.scene.remove(f.sprite); f.mat.dispose() }
    for (const r of this.rings) { this.scene.remove(r.ring); r.ring.geometry.dispose(); r.mat.dispose() }
    this.tracers.length = 0
    this.flashes.length = 0
    this.rings.length = 0
  }
}
