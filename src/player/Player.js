import * as THREE from 'three'

export class Player {
  constructor(game) {
    this.game = game
    this.camera = game.camera
    this.radius = 0.36
    this.eyeHeight = 1.68
    this.pos = new THREE.Vector3(0, 0, 34)
    this.velocity = new THREE.Vector3()
    this.yaw = 0
    this.pitch = 0
    this.recoilPitch = 0
    this.recoilYaw = 0
    this.shake = 0
    this.health = 100
    this.maxHealth = 100
    this.stamina = 100
    this.grenades = 2
    this.maxGrenades = 3
    this.state = 'alive'
    this.sprinting = false
    this.crouching = false
    this.onGround = true
    this.vertical = 0
    this.bob = 0
    this.landDip = 0
    this.stepDist = 0
    this.lastDamage = 99
    this.ads = 0
    this.flashlightOn = true
    this.hits = 0
    this.shotsFired = 0
    this.stats = { shots: 0, hits: 0, kills: 0, headshots: 0 }
    this.throwCooldown = 0
    this.damageDirections = []
    this.triggerHeld = false
    this.createFlashlight()
    this.applyCamera(0, true)
  }

  createFlashlight() {
    const spot = new THREE.SpotLight(0xffe9c8, 120, 36, 0.48, 0.6, 1.55)
    spot.position.set(0.12, -0.06, -1.15)
    spot.target.position.set(0.02, -0.02, -12)
    this.camera.add(spot)
    this.camera.add(spot.target)
    this.flashlight = spot
    const fill = new THREE.PointLight(0xd6e4f0, 1.35, 3.4, 2)
    fill.position.set(0.1, 0.15, 0.2)
    this.camera.add(fill)
  }

  reset() {
    this.pos.set(0, 0, 34)
    this.velocity.set(0, 0, 0)
    this.yaw = 0; this.pitch = 0
    this.recoilPitch = 0; this.recoilYaw = 0; this.shake = 0
    this.health = this.maxHealth
    this.stamina = 100
    this.grenades = 2
    this.state = 'alive'
    this.sprinting = false
    this.crouching = false
    this.vertical = 0
    this.lastDamage = 99
    this.hits = 0; this.shotsFired = 0
    this.stats = { shots: 0, hits: 0, kills: 0, headshots: 0 }
    this.throwCooldown = 0
    this.flashlight.intensity = 120
    this.flashlightOn = true
    this.flashlight.visible = true
    this.applyCamera(0, true)
  }

  get alive() { return this.state === 'alive' }

  update(dt, input) {
    const sensitivity = this.game.sensitivity
    if (this.state === 'dead') {
      this.recoilPitch = THREE.MathUtils.damp(this.recoilPitch, 0, 4, dt)
      this.applyCamera(dt)
      return
    }
    this.yaw -= input.lookDX * 0.0022 * sensitivity
    this.pitch -= input.lookDY * 0.0022 * sensitivity
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.42, 1.42)
    if (this.game.settings.invertY) this.pitch += input.lookDY * 0.0044 * sensitivity

    this.lastDamage += dt
    this.throwCooldown = Math.max(0, this.throwCooldown - dt)

    const fwdX = -Math.sin(this.yaw), fwdZ = -Math.cos(this.yaw)
    const rightX = Math.cos(this.yaw), rightZ = -Math.sin(this.yaw)
    let ix = 0, iz = 0
    if (input.down('KeyW')) iz += 1
    if (input.down('KeyS')) iz -= 1
    if (input.down('KeyD')) ix += 1
    if (input.down('KeyA')) ix -= 1
    const moving = ix !== 0 || iz !== 0
    const len = moving ? Math.hypot(ix, iz) : 1
    ix /= len; iz /= len

    this.crouching = input.down('ControlLeft') || input.down('KeyC')
    const wantsSprint = (input.down('ShiftLeft') || input.down('ShiftRight')) && iz > 0.2 && !this.crouching && this.stamina > 4 && this.ads < 0.5
    this.sprinting = wantsSprint && moving
    if (this.sprinting) {
      this.stamina = Math.max(0, this.stamina - dt * 18)
    } else {
      const recover = this.crouching ? 15 : 22
      this.stamina = Math.min(100, this.stamina + dt * recover)
    }
    if (this.stamina <= 0) this.sprinting = false

    let speed = this.crouching ? 2.7 : 5.1
    if (this.sprinting) speed = 7.8
    if (this.ads > 0.2) speed *= 1 - this.ads * 0.36
    if (this.crouching && this.ads > 0.2) speed *= 0.8

    const targetX = (fwdX * iz + rightX * ix) * speed
    const targetZ = (fwdZ * iz + rightZ * ix) * speed
    const accel = this.onGround ? 14 : 3.5
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, targetX, accel, dt)
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, targetZ, accel, dt)

    if (input.hit('Space') && this.onGround) {
      this.vertical = 4.6
      this.onGround = false
      this.game.audio.playJump()
    }
    if (!this.onGround) {
      this.vertical -= 14.5 * dt
      this.pos.y += this.vertical * dt
      if (this.pos.y <= 0) {
        this.pos.y = 0
        this.onGround = true
        if (this.vertical < -4) { this.landDip = 0.09; this.game.audio.playLand() }
        this.vertical = 0
      }
    }

    const oldX = this.pos.x, oldZ = this.pos.z
    this.pos.x += this.velocity.x * dt
    this.pos.z += this.velocity.z * dt
    this.game.mall.collide(this.pos, this.radius)
    this.game.mall.collide(this.pos, this.radius)

    if (this.onGround) {
      const moved = Math.hypot(this.pos.x - oldX, this.pos.z - oldZ)
      this.stepDist += moved
      const stepEvery = this.sprinting ? 2.1 : this.crouching ? 3.4 : 2.7
      if (this.stepDist > stepEvery && moved > 0.002) {
        this.stepDist = 0
        this.game.audio.playFootstep(this.sprinting, this.crouching)
      }
      if (moved > 0.01) this.bob += dt * (this.sprinting ? 12.5 : 8.4)
    }

    this.flashlight.intensity = 120 * (0.9 + Math.sin(this.game.time * 31) * 0.015)
    if (input.hit('KeyF')) this.toggleFlashlight()
    if (input.hit('KeyR')) this.game.weapon.reload()
    if (input.hit('Digit1')) this.game.weapon.requestSwitch('rifle')
    if (input.hit('Digit2')) this.game.weapon.requestSwitch('shotgun')
    if (input.hit('KeyG')) this.throwGrenade()

    this.recoilPitch = THREE.MathUtils.damp(this.recoilPitch, 0, 7, dt)
    this.recoilYaw = THREE.MathUtils.damp(this.recoilYaw, 0, 7, dt)
    this.shake = THREE.MathUtils.damp(this.shake, 0, 9, dt)
    this.landDip = THREE.MathUtils.damp(this.landDip, 0, 12, dt)

    if (this.health < this.maxHealth && this.lastDamage > 6.5) {
      this.health = Math.min(this.maxHealth, this.health + dt * 9)
    }

    this.applyCamera(dt)
  }

  applyCamera(dt, instant = false) {
    const bobSpeed = this.sprinting ? 1.6 : 1
    const speed = Math.hypot(this.velocity.x, this.velocity.z)
    const bobAmt = Math.min(speed / 5, 1.4) * (this.crouching ? 0.4 : 1)
    const bobY = Math.abs(Math.sin(this.bob * 0.5)) * 0.032 * bobAmt
    const bobX = Math.sin(this.bob) * 0.024 * bobAmt
    const crouchOffset = this.crouching ? -0.42 : 0
    const shakeX = (Math.random() - 0.5) * this.shake * 0.02
    const shakeY = (Math.random() - 0.5) * this.shake * 0.02
    const shakeRoll = (Math.random() - 0.5) * this.shake * 0.03

    const eye = this.eyeHeight + crouchOffset - this.landDip
    this.camera.position.set(this.pos.x + bobX + shakeX, this.pos.y + eye + bobY + shakeY, this.pos.z)
    this.camera.rotation.order = 'YXZ'
    this.camera.rotation.set(
      this.pitch + this.recoilPitch + (Math.random() - 0.5) * this.shake * 0.006,
      this.yaw + this.recoilYaw + (Math.random() - 0.5) * this.shake * 0.004,
      shakeRoll + (this.sprinting ? -0.012 : 0)
    )
    const targetFov = 75 - this.ads * 23 + (this.sprinting ? 4 : 0)
    this.camera.fov = instant ? targetFov : THREE.MathUtils.damp(this.camera.fov, targetFov, 10, dt)
    this.camera.updateProjectionMatrix()
  }

  addRecoil(pitch, yaw, shake = 0.1) {
    this.recoilPitch += pitch
    this.recoilYaw += yaw
    this.shake = Math.min(1.6, this.shake + shake)
  }

  addShake(amount) { this.shake = Math.min(2, this.shake + amount) }

  damage(amount, source) {
    if (this.state !== 'alive') return
    this.health -= amount
    this.lastDamage = 0
    this.addShake(Math.min(0.9, amount * 0.055))
    this.game.hud.damageFlash(amount)
    this.game.hud.damageArrow(source)
    this.game.audio.playHurt()
    if (this.health <= 0) {
      this.health = 0
      this.die()
    }
    this.game.hud.updateVitals(this)
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount)
    this.game.hud.updateVitals(this)
    this.game.hud.healFlash()
  }

  die() {
    if (this.state === 'dead') return
    this.state = 'dead'
    this.game.onPlayerDeath()
  }

  toggleFlashlight() {
    this.flashlightOn = !this.flashlightOn
    this.flashlight.visible = this.flashlightOn
    this.game.audio.playClick()
    this.game.hud.subtitle('', this.flashlightOn ? 'Flashlight on' : 'Flashlight off', 0.8)
  }

  throwGrenade() {
    if (this.grenades <= 0 || this.throwCooldown > 0 || this.state !== 'alive') return
    this.grenades--
    this.throwCooldown = 0.9
    this.game.hud.setGrenades(this.grenades)
    this.game.throwGrenade()
    this.game.audio.playThrow()
    this.addShake(0.12)
  }

  addGrenade(n = 1) {
    this.grenades = Math.min(this.maxGrenades, this.grenades + n)
    this.game.hud.setGrenades(this.grenades)
  }
}
