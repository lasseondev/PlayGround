import * as THREE from 'three'
import { glowTexture, sparkTexture, bloodTexture } from '../world/textures.js'

const BLOOD_GEO = new THREE.SphereGeometry(0.035, 5, 4)
const SPARK_GEO = new THREE.SphereGeometry(0.018, 4, 3)
const CASING_GEO = new THREE.CylinderGeometry(0.009, 0.009, 0.032, 6)
const HOLE_GEO = new THREE.CircleGeometry(0.035, 8)

export class Effects {
  constructor(game) {
    this.game = game
    this.group = new THREE.Group()
    this.group.name = 'effects'
    game.scene.add(this.group)
    this.particles = []
    this.tracers = []
    this.decals = []
    this.lights = []
    this.bloodMat = new THREE.MeshBasicMaterial({ color: 0x4a0809 })
    this.bloodMatDark = new THREE.MeshBasicMaterial({ color: 0x2a0405 })
    this.sparkMat = new THREE.MeshBasicMaterial({ color: 0xffc060, toneMapped: false })
    this.casingMat = new THREE.MeshStandardMaterial({ color: 0xb08a42, roughness: 0.3, metalness: 0.9 })
    this.holeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.85, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 })
    this.glowTex = glowTexture()
    this.sparkTex = sparkTexture()
    this.bloodTex = bloodTexture(7)
    this.smokeMats = []
    for (let i = 0; i < 4; i++) this.smokeMats.push(new THREE.SpriteMaterial({ map: this.glowTex, color: 0x8a8f93, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.NormalBlending }))
    this.shockGeo = new THREE.RingGeometry(0.4, 0.55, 32)
  }

  reset() {
    for (const p of this.particles) { this.group.remove(p.obj); p.obj.material?.dispose?.() }
    for (const t of this.tracers) this.group.remove(t.line)
    for (const d of this.decals) this.group.remove(d.mesh)
    for (const l of this.lights) this.group.remove(l.light)
    this.particles.length = 0
    this.tracers.length = 0
    this.lights.length = 0
    for (const d of this.decals) d.mesh.material.dispose()
    this.decals.length = 0
  }

  addParticle(obj, { vel, life, gravity = 9, scale = 1, shrink = 1, fade = 0, rot = null, bounce = false }) {
    this.group.add(obj)
    const p = { obj, vel: vel.clone(), life, maxLife: life, gravity, scale, shrink, fade, rot, bounce, baseOpacity: obj.material?.opacity ?? 1 }
    this.particles.push(p)
    if (this.particles.length > 420) {
      const old = this.particles.shift()
      this.group.remove(old.obj)
      old.obj.material?.dispose?.()
    }
    return p
  }

  spawnBlood(pos, dir, intensity = 1) {
    const count = Math.min(22, Math.floor(5 + intensity * 5 + Math.random() * 5))
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(BLOOD_GEO, Math.random() > 0.5 ? this.bloodMat : this.bloodMatDark)
      m.position.copy(pos)
      m.position.x += (Math.random() - 0.5) * 0.18
      m.position.y += (Math.random() - 0.5) * 0.18
      m.position.z += (Math.random() - 0.5) * 0.18
      const s = 0.5 + Math.random() * 1.4 * intensity
      m.scale.setScalar(s)
      const vel = new THREE.Vector3(
        dir.x * (1 + Math.random() * 3) + (Math.random() - 0.5) * 3.2,
        Math.random() * 3 + dir.y * 1.5 + 0.6,
        dir.z * (1 + Math.random() * 3) + (Math.random() - 0.5) * 3.2
      )
      this.addParticle(m, { vel, life: 0.8 + Math.random() * 0.9, gravity: 11, shrink: 1, bounce: true })
    }
    const mist = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.bloodTex, color: 0x9c1b1b, transparent: true, opacity: 0.5, depthWrite: false }))
    mist.position.copy(pos); mist.scale.setScalar(0.7 + intensity * 0.5)
    this.addParticle(mist, { vel: dir.clone().multiplyScalar(1.2).add(new THREE.Vector3(0, 0.5, 0)), life: 0.25, gravity: -1, scale: 1, fade: 1 })
  }

  spawnHead(pos, dir) {
    const head = new THREE.Group()
    const skin = new THREE.MeshStandardMaterial({ color: 0x7c8870, roughness: 0.85 })
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 9), skin)
    skull.scale.set(0.94, 1.08, 1)
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.15), skin)
    jaw.position.set(0, -0.12, 0.03); jaw.rotation.x = 0.3
    head.add(skull, jaw)
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 4), this.bloodMat)
      b.position.set((Math.random() - .5) * 0.2, (Math.random() - .5) * 0.2, (Math.random() - .5) * 0.2)
      head.add(b)
    }
    head.position.copy(pos)
    this.addParticle(head, {
      vel: dir.clone().multiplyScalar(3.2).add(new THREE.Vector3((Math.random() - .5) * 1.4, 3 + Math.random() * 2, (Math.random() - .5) * 1.4)),
      life: 4, gravity: 12, rot: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8), bounce: true
    })
    for (let i = 0; i < 3; i++) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), this.bloodMat)
      drop.position.copy(pos)
      this.addParticle(drop, { vel: new THREE.Vector3((Math.random() - .5) * 3, Math.random() * 2, (Math.random() - .5) * 3), life: 1.1, gravity: 10, bounce: true })
    }
  }

  spawnTracer(from, to, color = 0xffd9a0, thickness = 1) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()])
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
    const line = new THREE.Line(geo, mat)
    line.frustumCulled = false
    this.group.add(line)
    this.tracers.push({ line, life: 0.055, maxLife: 0.055 })
  }

  spawnImpact(point, normal, color = 0xffc060) {
    for (let i = 0; i < 6; i++) {
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.sparkTex, color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }))
      spark.position.copy(point); spark.scale.setScalar(0.06 + Math.random() * 0.08)
      const vel = normal.clone().multiplyScalar(2 + Math.random() * 3).add(new THREE.Vector3((Math.random() - .5) * 2.5, (Math.random() - .3) * 2.5, (Math.random() - .5) * 2.5))
      this.addParticle(spark, { vel, life: 0.2 + Math.random() * 0.25, gravity: 8, fade: 1 })
    }
    const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0x9a9a96, transparent: true, opacity: 0.2, depthWrite: false }))
    puff.position.copy(point).addScaledVector(normal, 0.03); puff.scale.setScalar(0.22)
    this.addParticle(puff, { vel: normal.clone().multiplyScalar(0.8), life: 0.3, gravity: 0.3, fade: 1 })
    if (Math.random() < 0.5) {
      const hole = new THREE.Mesh(HOLE_GEO, this.holeMat)
      hole.position.copy(point).addScaledVector(normal, 0.012)
      hole.lookAt(point.clone().add(normal))
      this.group.add(hole)
      this.decals.push({ mesh: hole, life: 8 })
      if (this.decals.length > 50) {
        const old = this.decals.shift()
        this.group.remove(old.mesh)
      }
    }
  }

  spawnBloodDecal(x, z, size = 2, y = 0.028) {
    const mat = new THREE.MeshBasicMaterial({ map: this.bloodTex, transparent: true, opacity: 0.7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, color: 0x8f2a2a })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.rotation.z = Math.random() * Math.PI * 2
    mesh.position.set(x, y, z)
    this.group.add(mesh)
    this.decals.push({ mesh, life: 999 })
    if (this.decals.length > 30) {
      const old = this.decals.shift()
      this.group.remove(old.mesh); old.mesh.material.dispose(); old.mesh.geometry.dispose()
    }
  }

  spawnMuzzleSmoke(pos, scale = 1) {
    for (let i = 0; i < 2; i++) {
      const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0x8b8b86, transparent: true, opacity: 0.3, depthWrite: false }))
      smoke.position.copy(pos)
      smoke.scale.setScalar(0.09 * scale)
      this.addParticle(smoke, { vel: new THREE.Vector3((Math.random() - .5) * 0.3, 0.25 + Math.random() * 0.3, (Math.random() - .5) * 0.3), life: 0.5 + Math.random() * 0.4, gravity: -0.4, scale: 1, fade: 1 })
    }
  }

  spawnCasing(from, type) {
    const m = new THREE.Mesh(CASING_GEO, this.casingMat)
    m.position.copy(from)
    const vel = new THREE.Vector3(1.2 + Math.random() * 1.4, 1.2 + Math.random() * 1.6, 0.7 + Math.random())
    if (type === 'shotgun') m.scale.setScalar(1.5)
    this.addParticle(m, { vel, life: 1.4, gravity: 12, rot: new THREE.Vector3(Math.random() * 14, Math.random() * 14, Math.random() * 14), bounce: true })
  }

  spawnExplosion(pos) {
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xffd27a, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
    flash.position.copy(pos); flash.scale.setScalar(1.5)
    this.addParticle(flash, { vel: new THREE.Vector3(), life: 0.28, gravity: 0, scale: 1, fade: 1 })
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.sparkTex, color: 0xff7b2a, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
    core.position.copy(pos); core.scale.setScalar(3)
    this.addParticle(core, { vel: new THREE.Vector3(), life: 0.22, gravity: 0, scale: 1, fade: 1 })
    for (let i = 0; i < 30; i++) {
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.sparkTex, color: i % 3 ? 0xffb24a : 0xff5a1e, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }))
      spark.position.copy(pos); spark.scale.setScalar(0.1 + Math.random() * 0.15)
      const dir = new THREE.Vector3(Math.random() - .5, Math.random() * 0.9, Math.random() - .5).normalize().multiplyScalar(5 + Math.random() * 9)
      this.addParticle(spark, { vel: dir, life: 0.5 + Math.random() * 0.7, gravity: 9, fade: 1, bounce: true })
    }
    for (let i = 0; i < 10; i++) {
      const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0x4a4844, transparent: true, opacity: 0.34, depthWrite: false }))
      smoke.position.copy(pos).add(new THREE.Vector3((Math.random() - .5) * 1.2, Math.random() * 1.2, (Math.random() - .5) * 1.2))
      smoke.scale.setScalar(0.8 + Math.random())
      this.addParticle(smoke, { vel: new THREE.Vector3((Math.random() - .5) * 2, 0.6 + Math.random() * 1.6, (Math.random() - .5) * 2), life: 1.4 + Math.random() * 1.2, gravity: -0.8, fade: 1, scale: 1.8 })
    }
    const ring = new THREE.Mesh(this.shockGeo, new THREE.MeshBasicMaterial({ color: 0xffc57a, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
    ring.rotation.x = -Math.PI / 2; ring.position.copy(pos); ring.position.y = 0.1
    this.addParticle(ring, { vel: new THREE.Vector3(), life: 0.4, gravity: 0, scale: 1, fade: 1 })
    ring.userData.grow = 14
    const light = new THREE.PointLight(0xffa04a, 130, 24, 2)
    light.position.copy(pos); light.position.y += 1
    this.group.add(light)
    this.lights.push({ light, life: 0.45, maxLife: 0.45, base: 130 })
    const decal = { x: pos.x, z: pos.z, size: 3.4 }
    this.spawnBloodDecal(decal.x, decal.z, decal.size, 0.026)
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= dt
      if (p.life <= 0) {
        this.group.remove(p.obj)
        p.obj.material?.dispose?.()
        this.particles.splice(i, 1)
        continue
      }
      const t = p.life / p.maxLife
      p.vel.y -= p.gravity * dt
      p.obj.position.addScaledVector(p.vel, dt)
      if (p.bounce && p.obj.position.y < 0.03) {
        p.obj.position.y = 0.03
        p.vel.y *= -0.32
        p.vel.x *= 0.55; p.vel.z *= 0.55
        if (Math.abs(p.vel.y) < 0.2) { p.vel.y = 0; p.gravity = 0 }
      }
      if (p.rot) {
        p.obj.rotation.x += p.rot.x * dt
        p.obj.rotation.y += p.rot.y * dt
        p.obj.rotation.z += p.rot.z * dt
      }
      if (p.obj.userData.grow) {
        const s = 1 + (1 - t) * p.obj.userData.grow
        p.obj.scale.setScalar(s)
      } else if (p.shrink && p.obj.scale) {
        const s = p.obj.scale.x
        if (p.obj.isSprite) p.obj.scale.setScalar(Math.max(0.001, s * (1 + dt * p.scale * 1.5)))
      }
      if (p.fade && p.obj.material) p.obj.material.opacity = p.baseOpacity * t
    }
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i]
      t.life -= dt
      t.line.material.opacity = Math.max(0, t.life / t.maxLife) * 0.9
      if (t.life <= 0) {
        this.group.remove(t.line)
        t.line.geometry.dispose(); t.line.material.dispose()
        this.tracers.splice(i, 1)
      }
    }
    for (let i = this.lights.length - 1; i >= 0; i--) {
      const l = this.lights[i]
      l.life -= dt
      l.light.intensity = l.base * Math.max(0, l.life / l.maxLife) ** 2
      if (l.life <= 0) {
        this.group.remove(l.light)
        this.lights.splice(i, 1)
      }
    }
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i]
      if (d.life < 900) {
        d.life -= dt
        if (d.life <= 0) {
          this.group.remove(d.mesh); d.mesh.material.dispose(); d.mesh.geometry.dispose()
          this.decals.splice(i, 1)
        }
      }
    }
  }
}
