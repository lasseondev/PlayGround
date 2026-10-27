import * as THREE from 'three'
import { resolveCollisions } from './world.js'

const blobTex = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 32)
  g.addColorStop(0, 'rgba(0,0,0,.5)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
})()

function buildNova() {
  const g = new THREE.Group()
  const body = new THREE.Group()
  g.add(body)
  const skin = new THREE.MeshStandardMaterial({ color: 0x9d7a60, roughness: 0.72 })
  const suit = new THREE.MeshStandardMaterial({ color: 0x2c3942, roughness: 0.64, metalness: 0.2 })
  const vest = new THREE.MeshStandardMaterial({ color: 0x3c4c55, roughness: 0.7, metalness: 0.25 })
  const helmet = new THREE.MeshStandardMaterial({ color: 0x202b31, roughness: 0.5, metalness: 0.35 })
  const cyan = new THREE.MeshBasicMaterial({ color: 0x63e6ff, toneMapped: false })
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x14181c, roughness: 0.4, metalness: 0.7 })

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.34), suit)
  torso.position.y = 1.15
  body.add(torso)
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.44, 0.38), vest)
  chest.position.set(0, 1.24, 0.01)
  body.add(chest)
  const patch = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.09), cyan)
  patch.position.set(-0.15, 1.27, 0.21)
  body.add(patch)
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.16), new THREE.MeshStandardMaterial({ color: 0x1b252b, roughness: 0.8 }))
  pack.position.set(0, 1.16, -0.24)
  body.add(pack)
  const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.03), cyan)
  beacon.position.set(0, 1.34, -0.33)
  body.add(beacon)

  const head = new THREE.Group()
  head.position.y = 1.68
  body.add(head)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 12), skin)
  skull.scale.set(0.92, 1.05, 0.98)
  head.add(skull)
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.215, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), helmet)
  helm.position.y = 0.05
  head.add(helm)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.055, 0.04), cyan)
  visor.position.set(0, 0.0, 0.185)
  head.add(visor)

  function arm(x, y) {
    const pivot = new THREE.Group()
    pivot.position.set(x, y, 0)
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.56, 0.15), suit)
    m.position.y = -0.28
    pivot.add(m)
    const glove = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.15, 0.14), helmet)
    glove.position.y = -0.6
    pivot.add(glove)
    body.add(pivot)
    return pivot
  }
  function leg(x) {
    const pivot = new THREE.Group()
    pivot.position.set(x, 0.82, 0)
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.78, 0.2), suit)
    m.position.y = -0.39
    pivot.add(m)
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.13, 0.31), helmet)
    boot.position.set(0, -0.8, 0.05)
    pivot.add(boot)
    body.add(pivot)
    return pivot
  }
  const armL = arm(-0.35, 1.42)
  const armR = arm(0.35, 1.42)
  const legL = leg(-0.16)
  const legR = leg(0.16)
  armL.rotation.x = -1.2
  armR.rotation.x = -1.3

  const rifle = new THREE.Group()
  rifle.add(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.5), gunMat))
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.3, 6), gunMat)
  barrel.rotation.x = Math.PI / 2
  barrel.position.z = -0.38
  rifle.add(barrel)
  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.18, 0.09), gunMat)
  mag.position.set(0, -0.13, -0.02)
  rifle.add(mag)
  const optic = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.1), cyan)
  optic.position.set(0, 0.08, -0.1)
  rifle.add(optic)
  rifle.position.set(0.18, 1.22, -0.32)
  rifle.rotation.y = 0.05
  body.add(rifle)
  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0, -0.55)
  rifle.add(muzzle)

  const blob = new THREE.Mesh(new THREE.CircleGeometry(0.5, 16), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }))
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.02
  g.add(blob)

  const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.7, 24), new THREE.MeshBasicMaterial({ color: 0x36c8e0, transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.03
  g.add(ring)

  return { group: g, body, head, armL, armR, legL, legR, muzzle, rifle, ring, suit }
}

export class Ally {
  constructor(scene, audio, particles, world, callbacks = {}) {
    this.scene = scene
    this.audio = audio
    this.particles = particles
    this.world = world
    this.callbacks = callbacks
    const m = buildNova()
    Object.assign(this, m)
    this.pos = this.group.position
    this.pos.set(-3.4, 0, 24)
    this.radius = 0.42
    this.health = 100
    this.maxHealth = 100
    this.alive = true
    this.downed = false
    this.bleedout = 28
    this.isPlayer = false
    this.sinceDamage = 99
    this.phase = 0
    this.moveSpeed = 0
    this.fireCd = 1.2
    this.burst = 0
    this.burstCd = 0
    this.aimT = 0
    this.target = null
    this.retarget = 0
    this.reviveProgress = 0
    this.muzzleT = 0
    this.tracers = []
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x9feaff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, map: (() => {
      const c = document.createElement('canvas'); c.width = c.height = 64
      const x = c.getContext('2d'); const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32)
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(140,230,255,.7)'); gr.addColorStop(1, 'rgba(80,200,255,0)')
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    })() }))
    this.flash.scale.set(0.3, 0.3, 1)
    this.flash.visible = false
    this.muzzle.add(this.flash)
    this.flashLight = new THREE.PointLight(0x8fdcff, 0, 6, 2)
    this.muzzle.add(this.flashLight)
    this.scene.add(this.group)
    this.group.visible = false
  }

  setActive(v) { this.group.visible = v }

  reset() {
    this.pos.set(-3.4, 0, 24)
    this.health = 100
    this.alive = true
    this.downed = false
    this.bleedout = 28
    this.sinceDamage = 99
    this.reviveProgress = 0
    this.target = null
    this.group.rotation.set(0, 0, 0)
    this.group.visible = true
  }

  onZombieHit(damage) {
    if (!this.alive || this.downed) return
    this.health -= damage
    this.sinceDamage = 0
    if (this.health <= 0) {
      this.health = 0
      this.downed = true
      this.bleedout = 30
      this.reviveProgress = 0
      this.audio.groan(0.18, 0.2)
      if (this.callbacks.onDowned) this.callbacks.onDowned()
    }
  }

  revive(health = 60) {
    this.downed = false
    this.health = health
    this.bleedout = 28
    this.reviveProgress = 0
    this.sinceDamage = 0
    this.group.rotation.set(0, this.group.rotation.y, 0)
    if (this.callbacks.onRevived) this.callbacks.onRevived()
  }

  update(dt, player, zombieManager, time) {
    if (!this.alive) return
    this.sinceDamage += dt
    this.fireCd = Math.max(0, this.fireCd - dt)
    this.burstCd = Math.max(0, this.burstCd - dt)
    this.retarget -= dt
    this.muzzleT -= dt
    if (this.muzzleT <= 0) { this.flash.visible = false; this.flashLight.intensity = 0 }
    this.ring.rotation.z = time * 0.6
    this.ring.material.opacity = 0.3 + Math.sin(time * 2) * 0.1

    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i]
      tr.life -= dt
      tr.line.material.opacity = Math.max(0, tr.life / tr.maxLife)
      if (tr.life <= 0) {
        this.scene.remove(tr.line)
        tr.line.geometry.dispose()
        tr.line.material.dispose()
        this.tracers.splice(i, 1)
      }
    }

    if (this.downed) {
      this.bleedout -= dt
      if (this.bleedout <= 0) {
        this.alive = false
        this.group.visible = false
        if (this.callbacks.onDeath) this.callbacks.onDeath()
        return
      }
      this.group.rotation.z = 1.45
      this.group.position.y = 0.28
      this.legL.rotation.x = 0.2
      this.legR.rotation.x = -0.1
      this.armL.rotation.x = -0.2
      this.armR.rotation.x = -0.3
      return
    }

    this.group.rotation.z = 0
    this.group.position.y = 0

    if (this.health < this.maxHealth && this.sinceDamage > 6) {
      this.health = Math.min(this.maxHealth, this.health + 7 * dt)
    }

    let targetX = player.pos.x, targetZ = player.pos.z
    let desiredDist = 4.2
    let moving = false
    let speed = 0

    if (player.downed && player.alive) {
      // rush to revive the player
      const dx = player.pos.x - this.pos.x
      const dz = player.pos.z - this.pos.z
      const d = Math.hypot(dx, dz)
      if (d > 1.8) {
        targetX = player.pos.x
        targetZ = player.pos.z
        desiredDist = 1.2
      } else {
        this.reviveProgress += dt / 3.2
        if (this.reviveProgress >= 1) {
          this.reviveProgress = 0
          player.revive(65)
          if (this.callbacks.onRevivePlayer) this.callbacks.onRevivePlayer()
        }
      }
      if (d > 1.8) this.reviveProgress = 0
    } else {
      this.reviveProgress = 0
      const alive = zombieManager ? zombieManager.zombies.filter(z => z.alive && z.state === 'alive') : []
      let best = null, bestD = Infinity
      for (const z of alive) {
        const d = Math.hypot(z.pos.x - this.pos.x, z.pos.z - this.pos.z)
        if (d < 26 && d < bestD) { bestD = d; best = z }
      }
      this.target = best
      if (best) {
        const dx = best.pos.x - this.pos.x
        const dz = best.pos.z - this.pos.z
        const d = Math.hypot(dx, dz) || 1
        // hold a firing lane
        if (d > 12) { targetX = best.pos.x; targetZ = best.pos.z; desiredDist = 9 }
        else if (d < 5) { targetX = this.pos.x - dx / d * 4; targetZ = this.pos.z - dz / d * 4; desiredDist = 0 }
        else {
          const strafe = Math.sin(time * 1.3) > 0 ? 1 : -1
          targetX = this.pos.x - dz / d * 2.2 * strafe
          targetZ = this.pos.z + dx / d * 2.2 * strafe
          desiredDist = 0
        }
        // shoot
        if (this.fireCd <= 0) {
          this.shoot(best, zombieManager)
        }
      } else {
        this.target = null
        const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw)
        targetX = player.pos.x + cy * 2.2 + sy * 1.4
        targetZ = player.pos.z - sy * 2.2 + cy * 1.4
        desiredDist = 0.5
      }
    }

    // move toward target point if needed
    const dx = targetX - this.pos.x
    const dz = targetZ - this.pos.z
    const dist = Math.hypot(dx, dz)
    if (dist > Math.max(0.2, desiredDist)) {
      const nx = dx / dist, nz = dz / dist
      speed = player.downed ? 5.4 : this.target ? (dist > 8 ? 4.6 : 3.4) : 4.2
      this.pos.x += nx * speed * dt
      this.pos.z += nz * speed * dt
      resolveCollisions(this.pos, this.radius, this.world.colliders, this.world.bounds)
      moving = true
      const targetRot = Math.atan2(nx, nz)
      let diff = targetRot - this.group.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      this.group.rotation.y += diff * Math.min(1, dt * 8)
    } else if (this.target) {
      const tdx = this.target.pos.x - this.pos.x
      const tdz = this.target.pos.z - this.pos.z
      const targetRot = Math.atan2(tdx, tdz)
      let diff = targetRot - this.group.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      this.group.rotation.y += diff * Math.min(1, dt * 9)
    } else {
      const targetRot = Math.atan2(dx, dz)
      let diff = targetRot - this.group.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      this.group.rotation.y += diff * Math.min(1, dt * 6)
    }

    // hard camera clearance after movement
    if (!player.downed) {
      const pdx = this.pos.x - player.pos.x
      const pdz = this.pos.z - player.pos.z
      const pd = Math.hypot(pdx, pdz)
      if (pd < 3.3) {
        const nx = pd > 0.001 ? pdx / pd : 0
        const nz = pd > 0.001 ? pdz / pd : 1
        this.pos.x += nx * (3.3 - pd)
        this.pos.z += nz * (3.3 - pd)
      }
      const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw)
      const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw)
      const along = pdx * fx + pdz * fz
      const lateral = pdx * rx + pdz * rz
      if (along > 0.3 && pd < 6.0 && Math.abs(lateral) < 3.0) {
        const side = lateral >= 0 ? 1 : -1
        this.pos.x += rx * side * (3.0 - Math.abs(lateral))
        this.pos.z += rz * side * (3.0 - Math.abs(lateral))
      }
      resolveCollisions(this.pos, this.radius, this.world.colliders, this.world.bounds)
    }

    this.moveSpeed = moving ? speed : 0
    this.phase += dt * (moving ? 7.2 : 1.2)
    const swing = Math.sin(this.phase)
    this.legL.rotation.x = swing * (moving ? 0.55 : 0.05)
    this.legR.rotation.x = -swing * (moving ? 0.55 : 0.05)
    this.body.position.y = Math.abs(swing) * 0.03
    this.armL.rotation.x = -1.15 + Math.cos(this.phase) * 0.06
    this.armR.rotation.x = -1.28 - Math.cos(this.phase) * 0.05

    if (this.burst > 0 && this.burstCd <= 0 && this.target) {
      this.burst--
      this.burstCd = 0.11
      this.shoot(this.target, zombieManager)
    }
  }

  shoot(target, zombieManager) {
    if (!target || !target.alive) return
    if (this.fireCd > 0) return
    this.fireCd = 0.16
    if (this.burst <= 0) {
      this.burst = 3 + Math.floor(Math.random() * 3)
      this.burstCd = 0.16
    }
    const origin = new THREE.Vector3()
    this.muzzle.getWorldPosition(origin)
    const chest = new THREE.Vector3(target.pos.x, 1.0 * target.scale, target.pos.z)
    const dir = chest.clone().sub(origin).normalize()
    const hit = Math.random() < 0.82
    const dmg = 17
    let point = chest
    if (hit) {
      const killed = zombieManager.hurt(target, dmg, false, dir, this)
      if (killed && this.callbacks.onKill) this.callbacks.onKill(target)
      this.particles.sparks(chest, dir.clone().negate(), 3, 0x9feaff)
    } else {
      point = chest.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.4))
    }
    const geo = new THREE.BufferGeometry().setFromPoints([origin.clone(), point.clone()])
    const mat = new THREE.LineBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    this.scene.add(line)
    this.tracers.push({ line, life: 0.06, maxLife: 0.06 })
    if (this.tracers.length > 20) {
      const old = this.tracers.shift()
      this.scene.remove(old.line)
      old.line.geometry.dispose()
      old.line.material.dispose()
    }
    this.audio.shot('ally')
    this.muzzleT = 0.045
    this.flash.visible = true
    this.flash.material.rotation = Math.random() * 6
    this.flashLight.intensity = 3
  }
}
