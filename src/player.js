import * as THREE from 'three'
import { resolveCollisions } from './world.js'

const WEAPONS = {
  rifle: {
    name: 'M4 VANGUARD',
    short: 'RIFLE',
    magSize: 30,
    reserveMax: 300,
    damage: 31,
    headMult: 2.6,
    interval: 0.092,
    spread: 0.0075,
    pellets: 1,
    recoil: 0.012,
    reloadTime: 1.7,
    auto: true,
    kick: 1
  },
  shotgun: {
    name: 'AA-12 BREACHER',
    short: 'BREACHER',
    magSize: 8,
    reserveMax: 64,
    damage: 15,
    headMult: 1.5,
    interval: 0.62,
    spread: 0.055,
    pellets: 9,
    recoil: 0.055,
    reloadTime: 2.15,
    auto: true,
    kick: 3.2
  }
}

function raySphere(o, d, cx, cy, cz, r) {
  const ox = o.x - cx, oy = o.y - cy, oz = o.z - cz
  const b = ox * d.x + oy * d.y + oz * d.z
  const c = ox * ox + oy * oy + oz * oz - r * r
  const disc = b * b - c
  if (disc < 0) return -1
  const t = -b - Math.sqrt(disc)
  return t > 0.05 ? t : -1
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  let g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,245,1)')
  g.addColorStop(0.18, 'rgba(255,225,150,.95)')
  g.addColorStop(0.45, 'rgba(255,140,40,.45)')
  g.addColorStop(1, 'rgba(255,90,10,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function box(mat, w, h, d, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  return m
}
function cyl(mat, r1, r2, h, x, y, z) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 10), mat)
  m.position.set(x, y, z)
  return m
}

function buildRifle() {
  const g = new THREE.Group()
  const dark = new THREE.MeshBasicMaterial({ color: 0x262d33 })
  const mid = new THREE.MeshBasicMaterial({ color: 0x3b444b })
  const accent = new THREE.MeshBasicMaterial({ color: 0x4c3523 })
  const glove = new THREE.MeshBasicMaterial({ color: 0x2c3236 })
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x9dff5a, toneMapped: false })

  g.add(box(dark, 0.11, 0.13, 0.44, 0, 0, 0))
  g.add(box(mid, 0.1, 0.09, 0.34, 0, 0.005, -0.34))
  const barrel = cyl(dark, 0.022, 0.022, 0.3, 0, 0.02, -0.52)
  barrel.rotation.x = Math.PI / 2
  g.add(barrel)
  g.add(box(dark, 0.075, 0.075, 0.2, 0, 0.028, -0.28))
  g.add(box(accent, 0.07, 0.1, 0.14, 0, -0.055, 0.21))
  g.add(box(accent, 0.06, 0.2, 0.09, 0, -0.14, 0.03))
  const mag = box(dark, 0.075, 0.26, 0.1, 0, -0.15, -0.06)
  mag.rotation.x = -0.18
  g.add(mag)
  g.add(box(dark, 0.05, 0.05, 0.2, 0, 0.095, -0.16))
  // optic
  g.add(box(mid, 0.085, 0.085, 0.13, 0, 0.115, -0.03))
  const lens = box(glowMat, 0.045, 0.045, 0.006, 0, 0.117, -0.098)
  g.add(lens)
  g.add(box(dark, 0.03, 0.05, 0.16, 0, 0.145, -0.03))
  // hands
  g.add(box(glove, 0.095, 0.11, 0.11, 0.005, -0.16, 0.04))
  g.add(box(glove, 0.09, 0.1, 0.13, 0, -0.085, -0.3))
  // sling
  const sling = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 4, 12), mid)
  sling.rotation.x = Math.PI / 2
  sling.position.set(0, -0.02, 0.12)
  g.add(sling)

  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0.02, -0.68)
  g.add(muzzle)
  return { group: g, muzzle, sight: lens }
}

function buildShotgun() {
  const g = new THREE.Group()
  const dark = new THREE.MeshBasicMaterial({ color: 0x23272a })
  const mid = new THREE.MeshBasicMaterial({ color: 0x3a4147 })
  const accent = new THREE.MeshBasicMaterial({ color: 0x442e1d })
  const glove = new THREE.MeshBasicMaterial({ color: 0x292e32 })
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff5a3a, toneMapped: false })

  g.add(box(dark, 0.13, 0.15, 0.42, 0, 0, 0))
  g.add(box(mid, 0.11, 0.11, 0.3, 0, 0.01, -0.33))
  const barrel = cyl(dark, 0.035, 0.035, 0.34, 0, 0.03, -0.52)
  barrel.rotation.x = Math.PI / 2
  g.add(barrel)
  const tube = cyl(mid, 0.022, 0.022, 0.32, 0, -0.03, -0.5)
  tube.rotation.x = Math.PI / 2
  g.add(tube)
  g.add(box(accent, 0.08, 0.11, 0.15, 0, -0.06, 0.2))
  g.add(box(accent, 0.07, 0.2, 0.09, 0, -0.14, 0.03))
  g.add(box(dark, 0.09, 0.09, 0.18, 0, -0.06, -0.27))
  g.add(box(mid, 0.06, 0.055, 0.15, 0, 0.1, -0.09))
  g.add(box(glowMat, 0.03, 0.03, 0.005, 0, 0.1, -0.17))
  g.add(box(glove, 0.095, 0.11, 0.11, 0.005, -0.16, 0.05))
  g.add(box(glove, 0.09, 0.1, 0.13, 0, -0.08, -0.31))
  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0.03, -0.71)
  g.add(muzzle)
  return { group: g, muzzle, sight: null }
}

export class Player {
  constructor(camera, scene, audio, particles, world, callbacks = {}) {
    this.camera = camera
    this.scene = scene
    this.audio = audio
    this.particles = particles
    this.world = world
    this.callbacks = callbacks

    camera.rotation.order = 'YXZ'
    scene.add(camera)

    this.pos = new THREE.Vector3(0, 0, 20)
    this.vel = new THREE.Vector3()
    this.vy = 0
    this.onGround = true
    this.yaw = 0
    this.pitch = -0.03
    this.radius = 0.42
    this.eyeHeight = 1.68
    this.heightBob = 0
    this.moveSpeed = 0
    this.sprinting = false
    this.stamina = 100
    this.staminaDelay = 0

    this.health = 100
    this.maxHealth = 100
    this.alive = true
    this.downed = false
    this.bleedout = 20
    this.invuln = 0
    this.sinceDamage = 99
    this.shake = 0
    this.damageRoll = 0

    this.weapons = {
      rifle: { ...WEAPONS.rifle, mag: 30, reserve: 240 },
      shotgun: { ...WEAPONS.shotgun, mag: 8, reserve: 40 }
    }
    this.current = 'rifle'
    this.fireCd = 0
    this.reloadT = 0
    this.reloadTotal = 0
    this.switchT = 0
    this.spread = 0
    this.recoil = 0
    this.recoilYaw = 0
    this.kickZ = 0
    this.grenades = 3
    this.maxGrenades = 3
    this.meleeCd = 0
    this.meleeT = 0
    this.grenadeCd = 0
    this.muzzleT = 0
    this.tracers = []
    this.shotsFired = 0
    this.shotsHit = 0
    this.kills = 0
    this.headshots = 0
    this.active = false
    this.isPlayer = true
    this.deadT = 0

    // view models
    this.rifle = buildRifle()
    this.shotgun = buildShotgun()
    this.vmRoot = new THREE.Group()
    this.vmRoot.position.set(0.33, -0.31, -0.73)
    this.vmRoot.scale.setScalar(0.74)
    this.vmRoot.add(this.rifle.group, this.shotgun.group)
    this.rifle.group.position.set(0, 0, 0)
    this.shotgun.group.position.set(0, 0.005, 0.03)
    this.shotgun.group.visible = false
    camera.add(this.vmRoot)
    this.vmRoot.visible = false
    this.torch = new THREE.SpotLight(0xffe9c9, 26, 45, 0.52, 0.72, 1.7)
    this.torch.position.set(0.14, -0.08, 0.05)
    this.torchTarget = new THREE.Object3D()
    this.torchTarget.position.set(0.06, -0.12, -14)
    camera.add(this.torchTarget)
    this.torch.target = this.torchTarget
    camera.add(this.torch)
    this.fill = new THREE.PointLight(0x9fc7dd, 9, 14, 1.7)
    this.fill.position.set(0.1, 0.15, 0.1)
    camera.add(this.fill)

    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffc070, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }))
    this.flash.scale.set(0.11, 0.11, 1)
    this.flash.position.set(0, 0.02, -0.7)
    this.flash.visible = false
    this.rifle.group.add(this.flash)
    this.flash2 = this.flash.clone()
    this.flash2.material = this.flash.material
    this.flash2.position.set(0, 0.03, -0.74)
    this.shotgun.group.add(this.flash2)
    this.flash2.visible = false

    this.flashLight = new THREE.PointLight(0xffb060, 0, 6, 2)
    this.flashLight.position.set(0, 0, -0.7)
    this.vmRoot.add(this.flashLight)

    // knife
    const knifeMat = new THREE.MeshBasicMaterial({ color: 0xaab8bd })
    this.knife = new THREE.Group()
    const blade = box(knifeMat, 0.03, 0.03, 0.3, 0, 0, -0.18)
    this.knife.add(blade)
    this.knife.add(box(new THREE.MeshBasicMaterial({ color: 0x22282d }), 0.035, 0.05, 0.12, 0, 0, 0.01))
    this.knife.position.set(0.34, -0.26, -0.5)
    this.knife.rotation.set(0.3, 0.4, -0.4)
    this.knife.visible = false
    camera.add(this.knife)

    this.mouseDX = 0
    this.mouseDY = 0
    this.tmp = new THREE.Vector3()
    this.tmp2 = new THREE.Vector3()
    this.camTarget = new THREE.Vector3()
  }

  get weapon() { return this.weapons[this.current] }

  setActive(active) {
    this.active = active
    this.vmRoot.visible = active
  }

  reset() {
    this.pos.set(0, 0, 20)
    this.vel.set(0, 0, 0)
    this.vy = 0
    this.yaw = 0
    this.pitch = -0.03
    this.health = 100
    this.alive = true
    this.downed = false
    this.bleedout = 20
    this.stamina = 100
    this.sinceDamage = 99
    this.weapons.rifle.mag = 30; this.weapons.rifle.reserve = 240
    this.weapons.shotgun.mag = 8; this.weapons.shotgun.reserve = 40
    this.current = 'rifle'
    this.rifle.group.visible = true
    this.shotgun.group.visible = false
    this.grenades = 3
    this.reloadT = 0
    this.kills = 0; this.headshots = 0; this.shotsFired = 0; this.shotsHit = 0
    this.camera.fov = 76
    this.camera.updateProjectionMatrix()
  }

  onZombieHit(damage, zombie) {
    this.takeDamage(damage, zombie.pos)
  }

  takeDamage(amount, fromPos) {
    if (!this.alive || this.invuln > 0) return
    if (this.downed) {
      this.bleedout -= amount * 0.35
      if (this.bleedout <= 0) this.die()
      return
    }
    this.health -= amount
    this.sinceDamage = 0
    this.shake = Math.min(1, this.shake + amount * 0.02)
    const dx = fromPos ? fromPos.x - this.pos.x : 0
    const dz = fromPos ? fromPos.z - this.pos.z : 0
    this.damageRoll = Math.atan2(dx, dz)
    if (this.callbacks.onDamage) this.callbacks.onDamage(amount, fromPos)
    if (this.health <= 0) {
      this.health = 0
      this.goDown()
    }
  }

  goDown() {
    if (this.downed || !this.alive) return
    this.downed = true
    this.bleedout = 22
    this.reloadT = 0
    this.meleeT = 0
    this.audio.hurt()
    if (this.callbacks.onDowned) this.callbacks.onDowned()
  }

  revive(health = 65) {
    if (!this.alive) return
    this.downed = false
    this.health = health
    this.invuln = 2
    this.sinceDamage = 0
    if (this.callbacks.onRevived) this.callbacks.onRevived()
  }

  die() {
    if (!this.alive) return
    this.alive = false
    this.downed = false
    this.audio.setMuffle(false)
    if (this.callbacks.onDeath) this.callbacks.onDeath()
  }

  heal(n) {
    this.health = Math.min(this.maxHealth, this.health + n)
  }

  addAmmo(amount = 0.5) {
    for (const key of ['rifle', 'shotgun']) {
      const w = this.weapons[key]
      w.reserve = Math.min(w.reserveMax, w.reserve + Math.ceil(w.reserveMax * amount))
    }
    this.grenades = Math.min(this.maxGrenades, this.grenades + 1)
  }

  switchWeapon(key) {
    if (!this.alive || this.downed || key === this.current) return
    this.current = key
    this.rifle.group.visible = key === 'rifle'
    this.shotgun.group.visible = key === 'shotgun'
    this.reloadT = 0
    this.switchT = 0.22
    this.fireCd = Math.max(this.fireCd, 0.22)
    this.audio.reload(0)
  }

  startReload() {
    const w = this.weapon
    if (this.reloadT > 0 || w.mag >= w.magSize || w.reserve <= 0 || !this.alive || this.downed) return
    this.reloadTotal = w.reloadTime
    this.reloadT = w.reloadTime
    this.audio.reload(0)
  }

  finishReload() {
    const w = this.weapon
    const need = w.magSize - w.mag
    const take = Math.min(need, w.reserve)
    w.mag += take
    w.reserve -= take
    this.audio.reload(2)
  }

  throwGrenade() {
    if (this.grenades <= 0 || !this.alive || this.downed || this.grenadeCd > 0) return
    this.grenades--
    this.grenadeCd = 0.8
    const origin = new THREE.Vector3()
    this.camera.getWorldPosition(origin)
    const dir = new THREE.Vector3()
    this.camera.getWorldDirection(dir)
    origin.addScaledVector(dir, 0.6)
    origin.y -= 0.12
    if (this.callbacks.onGrenade) this.callbacks.onGrenade(origin, dir)
    this.audio.melee()
  }

  melee() {
    if (!this.alive || this.downed || this.meleeCd > 0) return
    this.meleeCd = 0.8
    this.meleeT = 0.34
    this.knife.visible = true
    this.audio.melee()
    const origin = new THREE.Vector3()
    this.camera.getWorldPosition(origin)
    const dir = new THREE.Vector3()
    this.camera.getWorldDirection(dir)
    const zombies = this.callbacks.getZombies ? this.callbacks.getZombies() : []
    let hitAny = false
    for (const z of zombies) {
      if (!z.alive) continue
      const dx = z.pos.x - origin.x, dz = z.pos.z - origin.z
      const d = Math.hypot(dx, dz)
      if (d > 2.4) continue
      const dot = (dx / d) * dir.x + (dz / d) * dir.z
      if (dot < 0.55) continue
      const killed = z.manager.hurt(z, 95, false, dir, this)
      hitAny = true
      this.particles.blood(new THREE.Vector3(z.pos.x, 1.1 * z.scale, z.pos.z), dir, 18, 3.4)
    }
    if (hitAny) { this.audio.hit(false); if (this.callbacks.onHit) this.callbacks.onHit({ headshot: false, melee: true }) }
  }

  registerKill(headshot) {
    this.kills++
    if (headshot) this.headshots++
  }

  update(dt, input, time, zombieManager) {
    if (!this.active) return
    if (!this.alive) {
      this.deadT += dt
      const t = Math.min(1, this.deadT / 1.2)
      this.camera.position.set(this.pos.x, 0.35 + this.pos.y, this.pos.z)
      this.camera.rotation.set(-0.9 * t, this.yaw, 0.55 * t)
      return
    }

    this.invuln = Math.max(0, this.invuln - dt)
    this.sinceDamage += dt
    this.fireCd = Math.max(0, this.fireCd - dt)
    this.meleeCd = Math.max(0, this.meleeCd - dt)
    this.grenadeCd = Math.max(0, this.grenadeCd - dt)
    this.switchT = Math.max(0, this.switchT - dt)
    this.muzzleT = Math.max(0, this.muzzleT - dt)
    this.spread = Math.max(0, this.spread - dt * 0.055)

    if (this.downed) {
      this.bleedout -= dt
      if (this.bleedout <= 0) this.die()
    } else if (this.sinceDamage > 5.5 && this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + 16 * dt)
    }

    if (this.muzzleT <= 0) {
      this.flash.visible = false
      this.flash2.visible = false
      this.flashLight.intensity = 0
    }

    // look
    const sens = 0.0022
    this.yaw -= this.mouseDX * sens
    this.pitch -= this.mouseDY * sens
    this.pitch = Math.max(-1.35, Math.min(1.28, this.pitch))
    this.mouseDX = 0
    this.mouseDY = 0
    this.recoil += (0 - this.recoil) * Math.min(1, dt * 12)
    this.recoilYaw += (0 - this.recoilYaw) * Math.min(1, dt * 11)
    this.kickZ += (0 - this.kickZ) * Math.min(1, dt * 14)

    // movement
    const canMove = !this.downed
    const fwd = (input.forward ? 1 : 0) - (input.back ? 1 : 0)
    const strafe = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    this.sprinting = !!(input.sprint && fwd > 0 && !this.downed && this.stamina > 2)
    let targetSpeed = this.downed ? 0.9 : this.sprinting ? 8.2 : 5.1
    if (this.downed) targetSpeed = 1.0
    if (!canMove) targetSpeed = 0

    if (this.sprinting) {
      this.stamina -= dt * 26
      this.staminaDelay = 0.8
    } else {
      this.staminaDelay -= dt
      if (this.staminaDelay <= 0) this.stamina = Math.min(100, this.stamina + 20 * dt)
    }
    if (this.stamina <= 0) this.sprinting = false

    const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw)
    let wishX = 0, wishZ = 0
    if (canMove) {
      wishX = (-sinY * fwd + cosY * strafe)
      wishZ = (-cosY * fwd - sinY * strafe)
      const len = Math.hypot(wishX, wishZ)
      if (len > 1) { wishX /= len; wishZ /= len }
    }
    const accel = this.onGround ? 42 : 12
    this.vel.x += (wishX * targetSpeed - this.vel.x) * Math.min(1, accel * dt)
    this.vel.z += (wishZ * targetSpeed - this.vel.z) * Math.min(1, accel * dt)
    this.pos.x += this.vel.x * dt
    this.pos.z += this.vel.z * dt
    resolveCollisions(this.pos, this.radius, this.world.colliders, this.world.bounds)

    // jump
    if (input.jump && this.onGround && !this.downed) {
      this.vy = 6.4
      this.onGround = false
      this.audio.ui()
    }
    this.vy -= 22 * dt
    this.pos.y += this.vy * dt
    if (this.pos.y <= 0) { this.pos.y = 0; this.vy = 0; this.onGround = true }

    this.moveSpeed = Math.hypot(this.vel.x, this.vel.z)

    // footsteps
    this.stepT = (this.stepT ?? 0) - dt
    if (this.moveSpeed > 1.4 && this.onGround && this.stepT <= 0) {
      this.stepT = this.sprinting ? 0.27 : 0.4
      this.audio.tone(60 + Math.random() * 20, 30, 0.05, 0.045, 'triangle')
    }

    this.heightBob += dt * this.moveSpeed * 1.6
    const bobAmt = Math.min(1, this.moveSpeed / 5)
    const bobY = Math.sin(this.heightBob * 2) * 0.028 * bobAmt
    const bobX = Math.cos(this.heightBob) * 0.02 * bobAmt

    // camera
    this.shake = Math.max(0, this.shake - dt * 2.2)
    const shakeAmt = this.shake * 0.05
    const eyeBase = this.downed ? 0.62 : this.eyeHeight
    this.camera.position.set(
      this.pos.x + bobX + (Math.random() - 0.5) * shakeAmt,
      this.pos.y + eyeBase + bobY + (Math.random() - 0.5) * shakeAmt * 0.6,
      this.pos.z + (Math.random() - 0.5) * shakeAmt
    )
    this.camera.rotation.set(
      this.pitch + this.recoil + this.shake * 0.04 * Math.sin(time * 40),
      this.yaw + this.recoilYaw,
      this.downed ? 0.2 : this.shake * 0.02 * Math.cos(time * 37)
    )
    const targetFov = this.sprinting ? 83 : this.downed ? 66 : 76
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 6)
    this.camera.updateProjectionMatrix()

    // view model sway / bob / reload / recoil
    const vm = this.vmRoot
    const swayX = -this.mouseDX * 0.02
    const swayY = this.mouseDY * 0.02
    const baseX = 0.33 + bobX * 1.4
    const baseY = -0.31 + bobY * 2.2
    vm.position.x += (baseX - vm.position.x) * Math.min(1, dt * 10)
    vm.position.y += (baseY - vm.position.y) * Math.min(1, dt * 10)
    vm.position.z = -0.73 + this.kickZ * 0.05
    let vmRotX = this.kickZ * 0.09 + swayY
    let vmRotZ = -this.kickZ * 0.03 + swayX * 0.6
    let vmRotY = swayX
    if (this.reloadT > 0) {
      const p = 1 - this.reloadT / this.reloadTotal
      const swing = Math.sin(Math.min(1, p) * Math.PI)
      vmRotX += swing * 0.7
      vmRotZ += swing * 0.55
      vm.position.y -= swing * 0.09
    }
    if (this.switchT > 0) {
      const p = this.switchT / 0.22
      vm.position.y -= p * 0.25
      vmRotX += p * 0.4
    }
    if (this.downed) {
      vm.position.y = -0.66
      vmRotZ = 0.7
    }
    vm.rotation.x += (vmRotX - vm.rotation.x) * Math.min(1, dt * 14)
    vm.rotation.y += (vmRotY - vm.rotation.y) * Math.min(1, dt * 12)
    vm.rotation.z += (vmRotZ - vm.rotation.z) * Math.min(1, dt * 12)

    if (this.meleeT > 0) {
      this.meleeT -= dt
      const p = 1 - this.meleeT / 0.34
      this.knife.position.set(0.34 - p * 0.3, -0.26 + p * 0.12, -0.5 - Math.sin(p * Math.PI) * 0.3)
      this.knife.rotation.set(0.3, 0.4 - p * 0.9, -0.4 + p * 0.3)
      if (this.meleeT <= 0) this.knife.visible = false
    }

    // reload
    if (this.reloadT > 0) {
      this.reloadT -= dt
      if (this.reloadT <= 0) { this.reloadT = 0; this.finishReload() }
      else if (this.reloadT < this.reloadTotal * 0.45 && !this.reloadMid) { this.reloadMid = true; this.audio.reload(1) }
      if (this.reloadT > 0) this.reloadMid = this.reloadT < this.reloadTotal * 0.45 ? this.reloadMid : false
    } else this.reloadMid = false

    // firing
    if (input.fire && this.fireCd <= 0 && !this.downed && this.reloadT <= 0 && !this.knife.visible) {
      if (this.weapon.mag <= 0) {
        if (this.weapon.reserve > 0) this.startReload()
        else if (this.fireCd <= 0) { this.audio.empty(); this.fireCd = 0.3 }
      } else {
        this.fire(zombieManager)
      }
    }

    // tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i]
      tr.life -= dt
      tr.line.material.opacity = Math.max(0, tr.life / tr.maxLife) * 0.85
      if (tr.life <= 0) {
        this.scene.remove(tr.line)
        tr.line.geometry.dispose()
        tr.line.material.dispose()
        this.tracers.splice(i, 1)
      }
    }
  }

  fire(zombieManager) {
    const w = this.weapon
    w.mag--
    this.fireCd = w.interval
    this.shotsFired++
    this.audio.shot(this.current === 'shotgun' ? 'shotgun' : 'rifle')
    this.recoil += w.recoil * (0.85 + Math.random() * 0.3)
    this.recoilYaw += (Math.random() - 0.5) * w.recoil * 0.5
    this.kickZ = Math.min(1.6, this.kickZ + w.kick * 0.5)
    this.spread = Math.min(1, this.spread + (this.current === 'shotgun' ? 0.4 : 0.18))
    this.muzzleT = 0.05
    this.flash.visible = this.current === 'rifle'
    this.flash2.visible = this.current === 'shotgun'
    this.flash.material.rotation = Math.random() * Math.PI
    this.flash.scale.setScalar(0.09 + Math.random() * 0.06)
    this.flash2.scale.setScalar(0.12 + Math.random() * 0.07)
    this.flashLight.intensity = 2 + Math.random() * 1.5

    const origin = new THREE.Vector3()
    this.camera.getWorldPosition(origin)
    const baseDir = new THREE.Vector3()
    this.camera.getWorldDirection(baseDir)
    const muzzleWorld = new THREE.Vector3()
    ;(this.current === 'rifle' ? this.rifle.muzzle : this.shotgun.muzzle).getWorldPosition(muzzleWorld)
    this.particles.shell(muzzleWorld, baseDir)

    const zs = zombieManager ? zombieManager.zombies : []
    let anyHit = false
    let anyHead = false
    let anyKill = false
    let closestPoint = null
    const moveSpread = Math.min(1, this.moveSpeed / 8) * 0.012

    const pelletCount = w.pellets
    for (let p = 0; p < pelletCount; p++) {
      const dir = baseDir.clone()
      const spread = w.spread + moveSpread + this.spread * 0.008
      dir.x += (Math.random() - 0.5) * spread * 2
      dir.y += (Math.random() - 0.5) * spread * 2
      dir.z += (Math.random() - 0.5) * spread * 2
      dir.normalize()

      let bestZ = null, bestT = Infinity, bestHead = false
      for (const z of zs) {
        if (!z.alive || z.state === 'spawning' || z.state === 'dying') continue
        const headY = z.pos.y + 1.64 * z.scale
        const tHead = raySphere(origin, dir, z.pos.x, headY, z.pos.z, 0.24 * z.scale)
        const bodyY = z.pos.y + 1.02 * z.scale
        const tBody = raySphere(origin, dir, z.pos.x, bodyY, z.pos.z, 0.46 * z.scale)
        if (tHead > 0 && tHead < bestT) { bestT = tHead; bestZ = z; bestHead = true }
        if (tBody > 0 && tBody < bestT) { bestT = tBody; bestZ = z; bestHead = false }
      }

      if (bestZ && bestT < 80) {
        anyHit = true
        if (bestHead) anyHead = true
        const dmg = w.damage * (bestHead ? w.headMult : 1)
        const point = origin.clone().addScaledVector(dir, bestT)
        closestPoint = closestPoint || point
        const killed = zombieManager.hurt(bestZ, dmg, bestHead, dir, this)
        if (killed) anyKill = true
        this.particles.sparks(point, dir, bestHead ? 8 : 4, 0xff9a5a)
        if (this.current === 'rifle') {
          this.addTracer(muzzleWorld, point, 0xffd08a)
        }
      } else {
        let endT = 45
        if (dir.y < -0.02) {
          const tGround = -origin.y / dir.y
          if (tGround > 0 && tGround < endT) endT = tGround
        }
        const point = origin.clone().addScaledVector(dir, endT)
        if (p === 0) {
          this.particles.sparks(point, dir.clone().negate(), 4, 0xffcf7a)
          this.addTracer(muzzleWorld, point, 0xffe0a0)
        }
      }
    }

    if (anyHit) {
      this.shotsHit++
      this.audio.hit(anyHead)
      if (this.callbacks.onHit) this.callbacks.onHit({ headshot: anyHead, killed: anyKill })
    }
  }

  addTracer(from, to, color) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()])
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    const line = new THREE.Line(geo, mat)
    this.scene.add(line)
    this.tracers.push({ line, life: 0.055, maxLife: 0.055 })
    if (this.tracers.length > 24) {
      const old = this.tracers.shift()
      this.scene.remove(old.line)
      old.line.geometry.dispose()
      old.line.material.dispose()
    }
  }
}
