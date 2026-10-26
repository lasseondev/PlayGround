import * as THREE from 'three'

function additive(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
}

export class Effects {
  constructor(scene, glow, camera, damageLayer) {
    this.scene = scene
    this.glow = glow
    this.camera = camera
    this.damageLayer = damageLayer
    this.particles = []
    this.pool = []
    this.rings = []
    this.beams = []
    this.projectiles = []
    this.meteors = []
    this.timers = []
    this.numbers = []
    this.shakeStrength = 0
    this.shakeTime = 0
    this.onShake = null
    this.flashEl = document.getElementById('flash')
  }

  getParticle() {
    let p = this.pool.pop()
    if (!p) {
      const mat = new THREE.SpriteMaterial({
        map: this.glow,
        color: '#ffffff',
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
      p = new THREE.Sprite(mat)
      p.userData.particle = true
      this.scene.add(p)
    }
    p.visible = true
    return p
  }

  burst(position, opts = {}) {
    const {
      color = '#ffb15c',
      count = 12,
      speed = 5,
      size = 0.55,
      life = 0.7,
      gravity = 7,
      up = 0.5,
      spread = 1,
      drag = 0.9
    } = opts
    for (let i = 0; i < count; i++) {
      const p = this.getParticle()
      const a = Math.random() * Math.PI * 2
      const elevation = (Math.random() - 0.1) * Math.PI * 0.5
      const v = speed * (0.45 + Math.random() * 0.75)
      p.position.set(
        position.x + (Math.random() - 0.5) * 0.3 * spread,
        position.y + (Math.random() - 0.5) * 0.3 * spread,
        position.z + (Math.random() - 0.5) * 0.3 * spread
      )
      p.material.color.set(color)
      p.material.opacity = 1
      const start = size * (0.55 + Math.random() * 0.9)
      p.scale.setScalar(start)
      this.particles.push({
        sprite: p,
        vx: Math.cos(a) * Math.cos(elevation) * v,
        vy: Math.sin(elevation) * v + up * (0.3 + Math.random()),
        vz: Math.sin(a) * Math.cos(elevation) * v,
        gravity,
        drag: 1 - (1 - drag) * 0.02,
        life: life * (0.55 + Math.random() * 0.7),
        maxLife: life,
        start,
        end: start * 0.08,
        age: 0
      })
    }
  }

  soul(position, color = '#ffe2a0') {
    this.burst(position, { color, count: 14, speed: 2.2, size: 0.8, life: 1.3, gravity: -1.2, up: 2.4, spread: 0.5 })
    this.ring(position, { color, start: 0.2, end: 2.2, life: 0.8 })
  }

  ring(position, opts = {}) {
    const { color = '#ffce7a', start = 0.5, end = 4, life = 0.6, thickness = 0.6, y = 0.06, opacity = 0.85 } = opts
    const inner = 0.7
    const outer = 1
    const mat = additive(color, opacity)
    const mesh = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 48), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(position.x, y, position.z)
    mesh.scale.setScalar(start)
    mesh.renderOrder = 6
    this.scene.add(mesh)
    this.rings.push({ mesh, start, end, life, age: 0, thickness, baseOpacity: opacity })
  }

  shockwave(position, opts = {}) {
    const { color = '#ffb469', radius = 7, life = 0.75 } = opts
    this.ring(position, { color, start: 0.4, end: radius, life, opacity: 0.85, thickness: 1.3 })
    this.ring(position, { color: '#fff0c4', start: 0.2, end: radius * 0.72, life: life * 0.7, opacity: 0.55, thickness: 0.7 })
    this.burst(position, { color, count: 26, speed: radius * 1.1, size: 0.9, life: 0.9, gravity: 3, up: 2.2 })
  }

  slash(position, direction, color = '#ffe2a0', radius = 4.5) {
    const geo = new THREE.RingGeometry(radius * 0.45, radius, 40, 1, Math.PI * 0.18, Math.PI * 0.64)
    const mat = additive(color, 0.9)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.rotation.z = Math.atan2(direction.x, direction.z)
    mesh.position.set(position.x, 0.1, position.z)
    mesh.renderOrder = 7
    this.scene.add(mesh)
    this.rings.push({ mesh, start: 0.7, end: 1.15, life: 0.38, age: 0, thickness: 0.5, baseOpacity: 0.9, spin: 0.4, fadeFast: true })
    this.burst(new THREE.Vector3(position.x, position.y + 1, position.z), { color, count: 16, speed: 6, size: 0.5, life: 0.45, gravity: 5, up: 1.6 })
  }

  beam(from, to, color = '#8ff2ff', width = 0.55, life = 0.45) {
    const a = new THREE.Vector3(from.x, from.y, from.z)
    const b = new THREE.Vector3(to.x, to.y, to.z)
    const dir = b.clone().sub(a)
    const length = dir.length()
    if (length < 0.01) return
    const geo = new THREE.CylinderGeometry(width, width, length, 8, 1, true)
    const mesh = new THREE.Mesh(geo, additive(color, 0.9))
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    mesh.renderOrder = 8
    this.scene.add(mesh)
    this.beams.push({ mesh, life, age: 0, width })

    const coreGeo = new THREE.CylinderGeometry(width * 0.32, width * 0.32, length, 6, 1, true)
    const core = new THREE.Mesh(coreGeo, additive('#ffffff', 0.9))
    core.position.copy(mesh.position)
    core.quaternion.copy(mesh.quaternion)
    core.renderOrder = 9
    this.scene.add(core)
    this.beams.push({ mesh: core, life: life * 0.7, age: 0, width: width * 0.3 })

    const steps = Math.min(28, Math.floor(length * 1.6))
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const p = a.clone().lerp(b, t)
      this.burst(p, { color, count: 2, speed: 1.5, size: 0.45, life: 0.45 + Math.random() * 0.3, gravity: 0, up: 0.5, spread: 0.4 })
    }
  }

  meteor(target, opts = {}) {
    const { color = '#ff8a45', height = 24, duration = 1.15, radius = 5, onImpact = null, delay = 0 } = opts
    const group = new THREE.Group()
    const coreMat = new THREE.MeshBasicMaterial({ color })
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), coreMat)
    group.add(core)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.set(5, 5, 1)
    group.add(glow)
    const start = new THREE.Vector3(target.x + (Math.random() - 0.5) * 1.4, height, target.z + (Math.random() - 0.5) * 1.4)
    group.position.copy(start)
    this.scene.add(group)
    this.meteors.push({ group, core, glow, start, target: target.clone(), duration, age: -delay, radius, onImpact, color, trail: 0 })
  }

  telegraph(position, color = '#b15cff', radius = 3.4, duration = 1.2) {
    const mat = additive(color, 0.6)
    const mesh = new THREE.Mesh(new THREE.RingGeometry(radius * 0.82, radius, 48), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(position.x, 0.07, position.z)
    mesh.renderOrder = 7
    this.scene.add(mesh)
    const inner = new THREE.Mesh(new THREE.RingGeometry(radius * 0.2, radius * 0.28, 32), additive(color, 0.45))
    inner.rotation.x = -Math.PI / 2
    inner.position.set(position.x, 0.08, position.z)
    inner.renderOrder = 7
    this.scene.add(inner)
    this.rings.push({ mesh, start: 0.45, end: 1, life: duration, age: 0, thickness: 0.5, baseOpacity: 0.6, hold: true })
    this.rings.push({ mesh: inner, start: 0.8, end: 1.1, life: duration, age: 0, thickness: 0.5, baseOpacity: 0.45, hold: true, spin: -0.8 })
    this.burst(new THREE.Vector3(position.x, 0.4, position.z), { color, count: 10, speed: 1.2, size: 0.5, life: duration * 0.8, gravity: -1, up: 2, spread: radius * 0.4 })
  }

  commandMarker(position, color = '#ffe0a0') {
    this.ring(position, { color, start: 0.6, end: 2.2, life: 0.5, thickness: 0.4, opacity: 0.8 })
  }

  spawnProjectile(opts) {
    const { from, target, color = '#ffbe6b', kind = 'bolt', speed = 24, onHit = null, arc = 0, size = 0.22 } = opts
    const group = new THREE.Group()
    let mesh
    if (kind === 'arrow') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 4), new THREE.MeshBasicMaterial({ color: '#d9c8a4' }))
      shaft.rotation.x = Math.PI / 2
      group.add(shaft)
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), new THREE.MeshBasicMaterial({ color: '#f2e1b0' }))
      tip.position.z = 0.42
      tip.rotation.x = Math.PI / 2
      group.add(tip)
      mesh = group
    } else {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 6), new THREE.MeshBasicMaterial({ color }))
      group.add(mesh)
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }))
      sprite.scale.set(1.3, 1.3, 1)
      group.add(sprite)
    }
    const start = new THREE.Vector3(from.x, from.y, from.z)
    group.position.copy(start)
    this.scene.add(group)
    this.projectiles.push({ group, target, start, speed, onHit, kind, color, age: 0, lastPos: start.clone(), trail: 0, size })
  }

  damageNumber(position, value, kind = 'damage') {
    if (!this.damageLayer) return
    if (this.numbers.length > 42) return
    const el = document.createElement('div')
    el.className = `dmg ${kind}`
    el.textContent = value
    this.damageLayer.appendChild(el)
    this.numbers.push({ el, position: position.clone(), life: 0.95, age: 0 })
  }

  flash(strength = 1) {
    if (!this.flashEl) return
    this.flashEl.style.opacity = ''
    this.flashEl.classList.remove('fire')
    void this.flashEl.offsetWidth
    this.flashEl.style.setProperty('--flash-strength', strength)
    this.flashEl.classList.add('fire')
  }

  shake(amount = 0.5, time = 0.3) {
    this.shakeStrength = Math.max(this.shakeStrength, amount)
    this.shakeTime = Math.max(this.shakeTime, time)
    if (this.onShake) this.onShake(amount, time)
  }

  getShakeOffset(time) {
    if (this.shakeTime <= 0) return { x: 0, y: 0, z: 0 }
    const s = this.shakeStrength * (this.shakeTime / 0.4)
    return {
      x: Math.sin(time * 71) * s * 0.12,
      y: Math.cos(time * 63) * s * 0.09,
      z: Math.sin(time * 57) * s * 0.06
    }
  }

  disposeProjectile(projectile) {
    this.scene.remove(projectile.group)
    projectile.group.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose?.()
        child.material?.dispose?.()
      }
    })
  }

  update(dt, time) {
    this.shakeTime = Math.max(0, this.shakeTime - dt)
    if (this.shakeTime <= 0) this.shakeStrength = 0
    const maxLife = 1.4
    void maxLife

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.age += dt
      if (p.age >= p.life) {
        p.sprite.visible = false
        this.pool.push(p.sprite)
        this.particles.splice(i, 1)
        continue
      }
      const t = p.age / p.life
      p.vy -= p.gravity * dt
      p.vx *= 0.992
      p.vz *= 0.992
      p.sprite.position.x += p.vx * dt
      p.sprite.position.y += p.vy * dt
      p.sprite.position.z += p.vz * dt
      const scale = THREE.MathUtils.lerp(p.start, p.end, t)
      p.sprite.scale.setScalar(scale)
      p.sprite.material.opacity = Math.max(0, 1 - t * t)
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]
      r.age += dt
      if (r.age >= r.life) {
        this.scene.remove(r.mesh)
        r.mesh.geometry.dispose()
        r.mesh.material.dispose()
        this.rings.splice(i, 1)
        continue
      }
      const t = r.age / r.life
      const grow = r.hold ? THREE.MathUtils.lerp(r.start, r.end, Math.min(1, t * 4)) : THREE.MathUtils.lerp(r.start, r.end, t)
      r.mesh.scale.setScalar(grow)
      r.mesh.material.opacity = r.hold ? r.baseOpacity * (0.55 + Math.sin(time * 12) * 0.2) * (1 - t * 0.3) : r.baseOpacity * (1 - t)
      if (r.spin) r.mesh.rotation.z += r.spin * dt
    }

    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i]
      b.age += dt
      if (b.age >= b.life) {
        this.scene.remove(b.mesh)
        b.mesh.geometry.dispose()
        b.mesh.material.dispose()
        this.beams.splice(i, 1)
        continue
      }
      const t = b.age / b.life
      b.mesh.material.opacity = (1 - t) * 0.9
      b.mesh.scale.x = b.mesh.scale.z = 1 + t * 1.4
    }

    const tmp = new THREE.Vector3()
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.age += dt
      if (!p.target || p.target.dead || p.age > 4) {
        this.disposeProjectile(p)
        this.projectiles.splice(i, 1)
        continue
      }
      const tv = p.target.visual.group.position
      tmp.set(tv.x, tv.y + 1.35, tv.z)
      const dir = tmp.clone().sub(p.group.position)
      const dist = dir.length()
      if (dist < 0.7) {
        if (p.onHit) p.onHit(p.target)
        const impact = p.group.position.clone()
        this.burst(impact, { color: p.color, count: 7, speed: 2.5, size: 0.36, life: 0.35, gravity: 1, up: 0.4 })
        this.disposeProjectile(p)
        this.projectiles.splice(i, 1)
        continue
      }
      dir.normalize()
      p.group.position.addScaledVector(dir, Math.min(dist, p.speed * dt))
      if (p.kind === 'arrow') {
        p.group.lookAt(tmp)
      } else {
        p.trail += dt
        if (p.trail > 0.035) {
          p.trail = 0
          this.burst(p.group.position, { color: p.color, count: 1, speed: 0.6, size: p.size * 1.4, life: 0.35, gravity: -0.5, up: 0.2, spread: 0.2 })
        }
      }
    }

    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i]
      m.age += dt
      if (m.age < 0) continue
      const t = Math.min(1, m.age / m.duration)
      const ease = t * t
      m.group.position.x = THREE.MathUtils.lerp(m.start.x, m.target.x, ease)
      m.group.position.z = THREE.MathUtils.lerp(m.start.z, m.target.z, ease)
      m.group.position.y = THREE.MathUtils.lerp(m.start.y, 0.6, ease)
      m.group.rotation.x += dt * 6
      m.group.rotation.y += dt * 4
      m.glow.material.opacity = 0.9 - t * 0.2
      m.trail += dt
      if (m.trail > 0.025) {
        m.trail = 0
        this.burst(m.group.position, { color: m.color, count: 2, speed: 1.3, size: 0.8, life: 0.55, gravity: -0.4, up: 1.2, spread: 0.8 })
      }
      if (t >= 1) {
        const p = new THREE.Vector3(m.target.x, 0.15, m.target.z)
        this.shockwave(p, { color: m.color, radius: m.radius, life: 0.8 })
        this.burst(p, { color: m.color, count: 34, speed: 9, size: 1.1, life: 1.0, gravity: 8, up: 3, spread: 1.8 })
        this.burst(p, { color: '#ffe6b0', count: 16, speed: 5, size: 0.8, life: 0.7, gravity: 4, up: 4 })
        this.flash()
        this.shake(1.1, 0.5)
        if (m.onImpact) m.onImpact(p)
        this.scene.remove(m.group)
        m.group.traverse((child) => {
          child.geometry?.dispose?.()
          child.material?.dispose?.()
        })
        this.meteors.splice(i, 1)
      }
    }

    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const n = this.numbers[i]
      n.age += dt
      if (n.age >= n.life) {
        n.el.remove()
        this.numbers.splice(i, 1)
        continue
      }
      const p = n.position.clone()
      p.y += 0.5 + n.age * 1.5
      p.project(this.camera)
      const w = window.innerWidth
      const h = window.innerHeight
      if (p.z > 1) {
        n.el.style.opacity = '0'
        continue
      }
      n.el.style.left = `${(p.x * 0.5 + 0.5) * w}px`
      n.el.style.top = `${(-p.y * 0.5 + 0.5) * h}px`
    }
  }
}
