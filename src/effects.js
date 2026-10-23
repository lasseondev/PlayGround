import * as THREE from 'three'
import { glowSprite } from './models.js'

const tmpV = new THREE.Vector3()

function ringMesh(color) {
  const g = new THREE.RingGeometry(0.82, 1, 40)
  const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  const mesh = new THREE.Mesh(g, m)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

export class Effects {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.items = []
    this.shakeAmount = 0
    this.lightBudget = 0
  }

  add(item) { this.items.push(item); return item }

  _light(pos, color, intensity, distance, life) {
    if (this.lightBudget > 7) return null
    this.lightBudget++
    const light = new THREE.PointLight(color, intensity, distance, 2)
    light.position.copy(pos)
    this.scene.add(light)
    let t = 0
    return this.add({
      update: (dt) => {
        t += dt
        const k = Math.max(0, 1 - t / life)
        light.intensity = intensity * k * k
        if (t >= life) { this.scene.remove(light); this.lightBudget--; return false }
        return true
      },
    })
  }

  muzzle(pos, color = 0xffcf7a, size = 1.1) {
    const s = glowSprite(color, size, 1)
    s.position.copy(pos)
    this.scene.add(s)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        s.material.opacity = Math.max(0, 1 - t / 0.11)
        s.scale.setScalar(size * (1 + t * 7))
        if (t > 0.11) { this.scene.remove(s); s.material.dispose(); return false }
        return true
      },
    })
    this._light(pos, color, 18, 9, 0.14)
  }

  tracer(from, to, color = 0x76f4ff, width = 0.035, life = 0.1) {
    const dir = tmpV.copy(to).sub(from)
    const len = dir.length()
    if (len < 0.001) return
    const geo = new THREE.CylinderGeometry(width, width * 0.3, len, 5, 1, true)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
    const m = new THREE.Mesh(geo, mat)
    m.position.copy(from).addScaledVector(dir, 0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    this.scene.add(m)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        mat.opacity = Math.max(0, 1 - t / life) * 0.95
        if (t > life) { this.scene.remove(m); geo.dispose(); mat.dispose(); return false }
        return true
      },
    })
  }

  beam(from, to, color = 0x62f4ff, width = 0.09, life = 0.25) {
    this.tracer(from, to, color, width, life)
    const s = glowSprite(color, 1.4, 0.9)
    s.position.copy(to); this.scene.add(s)
    let t = 0
    this.add({ update: (dt) => { t += dt; s.material.opacity = Math.max(0, 1 - t / life); if (t > life) { this.scene.remove(s); s.material.dispose(); return false } return true } })
  }

  impact(pos, color = 0xffb066, scale = 1) {
    const s = glowSprite(color, 2.4 * scale, 0.95)
    s.position.copy(pos); this.scene.add(s)
    const ring = ringMesh(color)
    ring.position.copy(pos); ring.position.y += 0.06
    this.scene.add(ring)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        const k = Math.min(1, t / 0.35)
        s.material.opacity = Math.max(0, 0.95 - t * 3)
        s.scale.setScalar(2.4 * scale * (1 + t * 3))
        ring.scale.setScalar(1 + t * 5 * scale)
        ring.material.opacity = Math.max(0, 0.9 * (1 - k))
        if (t > 0.35) { this.scene.remove(s); this.scene.remove(ring); s.material.dispose(); ring.geometry.dispose(); ring.material.dispose(); return false }
        return true
      },
    })
    this._light(pos, color, 14 * scale, 10, 0.28)
  }

  explosion(pos, scale = 1, color = 0xff8a3d) {
    const core = glowSprite(color, 6 * scale, 1)
    core.position.copy(pos)
    this.scene.add(core)
    const white = glowSprite(0xfff2d0, 3 * scale, 1)
    white.position.copy(pos); this.scene.add(white)
    const ring = ringMesh(color)
    ring.position.copy(pos); ring.position.y += 0.1
    this.scene.add(ring)
    const count = 22
    const geo = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3)
    const vel = []
    for (let i = 0; i < count; i++) {
      p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z
      const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI
      const sp = (4 + Math.random() * 11) * scale
      vel.push(new THREE.Vector3(Math.cos(a) * Math.sin(b) * sp, Math.abs(Math.cos(b)) * sp * 0.9 + 2, Math.sin(a) * Math.sin(b) * sp))
    }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffc07a, size: 0.55 * scale, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending })
    const pts = new THREE.Points(geo, mat)
    this.scene.add(pts)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        const k = Math.min(1, t / 0.75)
        core.material.opacity = Math.max(0, 1 - t * 2.4)
        core.scale.setScalar(6 * scale * (1 + t * 2))
        white.material.opacity = Math.max(0, 1 - t * 6)
        white.scale.setScalar(3 * scale * (1 + t * 4))
        ring.scale.setScalar(1 + t * 12 * scale)
        ring.material.opacity = Math.max(0, 0.85 * (1 - k))
        const arr = geo.attributes.position.array
        for (let i = 0; i < count; i++) {
          vel[i].y -= 9 * dt
          arr[i * 3] += vel[i].x * dt
          arr[i * 3 + 1] += vel[i].y * dt
          arr[i * 3 + 2] += vel[i].z * dt
        }
        geo.attributes.position.needsUpdate = true
        mat.opacity = Math.max(0, 1 - k * 1.3)
        if (t > 0.8) {
          this.scene.remove(core); this.scene.remove(white); this.scene.remove(ring); this.scene.remove(pts)
          core.material.dispose(); white.material.dispose(); ring.geometry.dispose(); ring.material.dispose(); geo.dispose(); mat.dispose()
          return false
        }
        return true
      },
    })
    this._light(pos, color, 90 * scale, 26 * scale, 0.5)
    this.shakeAmount = Math.min(1.4, this.shakeAmount + 0.5 * scale)
  }

  death(pos, team, scale = 1) {
    this.explosion(pos, 0.75 * scale, team === 'player' ? 0x7fdfff : 0xb45cff)
    if (team === 'enemy') {
      const splat = new THREE.Mesh(new THREE.CircleGeometry(1.5 * scale, 16), new THREE.MeshBasicMaterial({ color: 0x2c0f34, transparent: true, opacity: 0.65, depthWrite: false }))
      splat.rotation.x = -Math.PI / 2
      splat.position.copy(pos); splat.position.y = 0.06
      this.scene.add(splat)
      let t = 0
      this.add({ update: (dt) => { t += dt; splat.material.opacity = 0.65 * (1 - t / 12); if (t > 12) { this.scene.remove(splat); splat.geometry.dispose(); splat.material.dispose(); return false } return true } })
    }
  }

  orderMarker(pos, color = 0x63f4ff) {
    const ring = ringMesh(color)
    ring.position.copy(pos); ring.position.y += 0.1
    this.scene.add(ring)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        const k = Math.min(1, t / 0.5)
        ring.scale.setScalar(0.5 + k * 1.8)
        ring.material.opacity = Math.max(0, 0.9 * (1 - k))
        if (t > 0.5) { this.scene.remove(ring); ring.geometry.dispose(); ring.material.dispose(); return false }
        return true
      },
    })
  }

  scanPulse(pos, radius = 30) {
    const ring = ringMesh(0x63f4ff)
    ring.position.copy(pos); ring.position.y += 0.2
    this.scene.add(ring)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        const k = Math.min(1, t / 1.4)
        ring.scale.setScalar(1 + k * radius)
        ring.material.opacity = Math.max(0, 0.8 * (1 - k))
        if (t > 1.4) { this.scene.remove(ring); ring.geometry.dispose(); ring.material.dispose(); return false }
        return true
      },
    })
    this._light(pos, 0x63f4ff, 55, 50, 1.2)
  }

  floatText(pos, text, color = '#9ffbff', scale = 1) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 64
    const x = c.getContext('2d')
    x.font = '700 30px Bahnschrift, Segoe UI, sans-serif'
    x.textAlign = 'center'; x.textBaseline = 'middle'
    x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowBlur = 6
    x.fillStyle = color; x.fillText(text, 128, 34)
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })
    const s = new THREE.Sprite(mat)
    s.position.copy(pos)
    s.scale.set(3.4 * scale, 0.85 * scale, 1)
    s.renderOrder = 20
    this.scene.add(s)
    let t = 0
    this.add({
      update: (dt) => {
        t += dt
        s.position.y += dt * 1.8
        s.material.opacity = Math.max(0, 1 - t / 1.3)
        if (t > 1.3) { this.scene.remove(s); tex.dispose(); mat.dispose(); return false }
        return true
      },
    })
  }

  update(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (!this.items[i].update(dt)) this.items.splice(i, 1)
    }
    this.shakeAmount *= Math.exp(-dt * 5)
    if (this.shakeAmount < 0.002) this.shakeAmount = 0
  }
}
