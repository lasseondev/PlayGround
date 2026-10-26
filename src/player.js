import * as THREE from 'three'
import { animateCharacter, createCharacter, setCharacterWeapon, PLAYER_PALETTE } from './character.js'
import { createLoadout, WEAPONS, weaponSpread } from './weapons.js'
import { clamp, damp, lerp, smoothstep } from './util.js'

const GRAVITY = 24
const RADIUS = 0.38

export class Player {
  constructor(game, scene, camera) {
    this.game = game
    this.scene = scene
    this.camera = camera
    this.isPlayer = true
    this.rig = createCharacter(PLAYER_PALETTE, { isPlayer: true })
    this.group = this.rig.group
    this.group.visible = false
    this.scene.add(this.group)
    this.position = new THREE.Vector3(0, 0, 0)
    this.velocity = new THREE.Vector3()
    this.cameraYaw = 0
    this.pitch = -0.06
    this.forward = new THREE.Vector3(0, 0, -1)
    this.right = new THREE.Vector3(1, 0, 0)
    this.onGround = true
    this.health = 100
    this.shield = 0
    this.maxHealth = 100
    this.maxShield = 100
    this.resources = { wood: 120, brick: 60, metal: 30 }
    this.loadout = createLoadout()
    this.selectedSlot = 2
    this.reloading = false
    this.reloadTimer = 0
    this.reloadTotal = 0
    this.fireCooldown = 0
    this.autoReload = 0
    this.ads = false
    this.cameraIntro = 0
    this.introFrom = new THREE.Vector3()
    this.recoil = 0
    this.shake = 0
    this.shakeTime = 0
    this.moveSpeed = 0
    this.dead = false
    this.damageTaken = 0
    this.walkDistance = 0
    this.cameraRay = new THREE.Raycaster()
    this._tmp = new THREE.Vector3()
    this._tmp2 = new THREE.Vector3()
    this._muzzle = new THREE.Vector3()
    this.spawnPos = new THREE.Vector3(-45, 0, -52)
    this.fillLight = new THREE.PointLight(0xffd9a8, 5, 9, 2)
    this.fillLight.castShadow = false
    this.scene.add(this.fillLight)
    setCharacterWeapon(this.rig, 'ar')
  }

  reset(spawn) {
    this.spawnPos.copy(spawn)
    this.position.set(spawn.x, spawn.y, spawn.z)
    this.velocity.set(0, 0, 0)
    this.health = 100
    this.shield = 0
    this.resources = { wood: 120, brick: 60, metal: 30 }
    this.loadout = createLoadout()
    this.selectedSlot = 2
    this.reloading = false
    this.reloadTimer = 0
    this.fireCooldown = 0
    this.autoReload = 0
    this.dead = false
    this.lastAttacker = null
    this.onGround = true
    this.cameraYaw = spawn.yaw ?? 0
    this.pitch = -0.05
    this.recoil = 0
    this.shake = 0
    this.damageTaken = 0
    this.walkDistance = 0
    this.cameraIntro = 0
    this.rig.walkPhase = 0
    this.rig.root.rotation.set(0, 0, 0)
    this.rig.root.position.set(0, 0, 0)
    this.rig.group.visible = true
    this.rig.hurtTimer = 0
    this._updateBasis()
    this.introFrom.copy(this.position).addScaledVector(this.right, 7).add(new THREE.Vector3(0, 15, 0)).addScaledVector(this.forward, -12)
    setCharacterWeapon(this.rig, 'ar')
    this.updateHud()
  }

  get weaponSlot() { return this.loadout[this.selectedSlot] }
  get weaponDef() { return this.weaponSlot.def }

  selectSlot(slot) {
    const ws = this.loadout[slot]
    if (!ws || !ws.unlocked || this.dead) return false
    if (this.selectedSlot === slot) return true
    this.selectedSlot = slot
    this.reloading = false
    this.reloadTimer = 0
    this.autoReload = 0
    this.fireCooldown = Math.max(this.fireCooldown, 0.15)
    setCharacterWeapon(this.rig, ws.id)
    this.game.ui?.setWeaponSlot(slot)
    this.game.ui?.hideReload()
    this.game.audio?.reload()
    return true
  }

  cycleSlot(dir = 1) {
    const order = [2, 3, 4, 1]
    let i = order.indexOf(this.selectedSlot)
    for (let n = 0; n < 4; n++) {
      i = (i + dir + 4) % 4
      const ws = this.loadout[order[i]]
      if (ws?.unlocked) { this.selectSlot(order[i]); return }
    }
  }

  unlockWeapon(id) {
    const ws = Object.values(this.loadout).find(w => w.id === id)
    if (!ws) return
    const wasLocked = !ws.unlocked
    ws.unlocked = true
    if (wasLocked) {
      ws.mag = ws.def.ammoStart || ws.def.mag
      ws.reserve = ws.def.reserveStart || 30
      this.game.ui?.unlockWeapon(ws.def)
    }
    this.game.ui?.updateAmmo(this.loadout)
  }

  addAmmo(id, amount) {
    const ws = Object.values(this.loadout).find(w => w.id === id)
    if (!ws) return
    ws.reserve = Math.min(ws.def.maxReserve, ws.reserve + amount)
    this.game.ui?.updateAmmo(this.loadout)
  }

  addResources(type, amount) {
    this.resources[type] = Math.min(999, this.resources[type] + amount)
    this.game.ui?.updateResources(this.resources)
  }

  addShield(amount) {
    const before = this.shield
    this.shield = Math.min(this.maxShield, this.shield + amount)
    this.updateHud()
    return this.shield - before
  }

  startReload() {
    const ws = this.weaponSlot
    if (!ws.def.kind || ws.def.kind !== 'gun' || this.reloading || ws.mag >= ws.def.mag || ws.reserve <= 0 || this.dead) return
    this.reloading = true
    this.reloadTotal = ws.def.reload
    this.reloadTimer = ws.def.reload
    this.game.ui?.showReload(ws.def.reload)
    this.game.audio?.reload()
  }

  finishReload() {
    const ws = this.weaponSlot
    if (!ws || ws.def.kind !== 'gun') { this.reloading = false; return }
    const need = ws.def.mag - ws.mag
    const take = Math.min(need, ws.reserve)
    ws.mag += take
    ws.reserve -= take
    this.reloading = false
    this.game.ui?.hideReload()
    this.game.ui?.updateAmmo(this.loadout)
  }

  canShoot() {
    const ws = this.weaponSlot
    if (this.dead || this.reloading || this.fireCooldown > 0) return false
    if (ws.def.kind === 'gun' && ws.mag <= 0) {
      this.startReload()
      return false
    }
    return true
  }

  consumeShot() {
    const ws = this.weaponSlot
    if (ws.def.kind === 'gun') {
      ws.mag = Math.max(0, ws.mag - 1)
      if (ws.mag === 0 && ws.reserve > 0) this.autoReload = 0.26
      this.game.ui?.updateAmmo(this.loadout)
    }
    this.fireCooldown = 1 / ws.def.rate
    this.rig.attackTimer = 0.16
    this.recoil = Math.min(0.06, this.recoil + (ws.def.id === 'shotgun' ? 0.038 : ws.def.id === 'pickaxe' ? 0.006 : 0.014))
    this.game.ui?.pulseCrosshair()
    return ws.def
  }

  spread() {
    const def = this.weaponDef
    if (def.kind !== 'gun') return 0
    return weaponSpread(def, this.ads, !this.onGround, this.moveSpeed)
  }

  applyDamage(amount, sourcePos = null, sourceInfo = null) {
    if (this.dead || this.game.state !== 'playing') return
    this.lastAttacker = sourceInfo
    let remaining = amount
    let shieldHit = 0
    if (this.shield > 0) {
      shieldHit = Math.min(this.shield, remaining)
      this.shield -= shieldHit
      remaining -= shieldHit
    }
    if (remaining > 0) {
      this.health = Math.max(0, this.health - remaining)
      this.damageTaken += remaining
    }
    this.rig.hurtTimer = 0.18
    this.shake = Math.min(1, this.shake + 0.3)
    this.game.audio?.playerHurt()
    this.game.ui?.damageFlash()
    if (sourcePos) this.game.ui?.damageArrow(sourcePos, this.position, this.camera)
    this.updateHud()
    if (this.health <= 0) {
      this.dead = true
      this.game.playerDied(sourcePos)
    }
  }

  healTo(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount)
    this.updateHud()
  }

  updateHud() {
    this.game.ui?.updateVitals(this.health, this.shield)
    this.game.ui?.updateResources(this.resources)
  }

  _updateBasis() {
    this.forward.set(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw))
    this.right.set(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw))
  }

  _resolveCollisions() {
    const colliders = this.game.world.colliders
    for (let pass = 0; pass < 2; pass++) {
      for (const c of colliders) {
        if (!c.active) continue
        if (c.maxY < this.position.y + 0.2 || c.minY > this.position.y + 1.62) continue
        const cx = clamp(this.position.x, c.minX, c.maxX)
        const cz = clamp(this.position.z, c.minZ, c.maxZ)
        let dx = this.position.x - cx
        let dz = this.position.z - cz
        let d2 = dx * dx + dz * dz
        if (d2 >= RADIUS * RADIUS) continue
        if (d2 < 1e-7) {
          const toLeft = Math.abs(this.position.x - c.minX)
          const toRight = Math.abs(c.maxX - this.position.x)
          const toBack = Math.abs(this.position.z - c.minZ)
          const toFront = Math.abs(c.maxZ - this.position.z)
          const min = Math.min(toLeft, toRight, toBack, toFront)
          if (min === toLeft) this.position.x = c.minX - RADIUS
          else if (min === toRight) this.position.x = c.maxX + RADIUS
          else if (min === toBack) this.position.z = c.minZ - RADIUS
          else this.position.z = c.maxZ + RADIUS
        } else {
          const dist = Math.sqrt(d2)
          const nx = dx / dist
          const nz = dz / dist
          const push = RADIUS - dist + 0.001
          this.position.x += nx * push
          this.position.z += nz * push
        }
      }
    }
    const distFromCenter = Math.hypot(this.position.x, this.position.z)
    if (distFromCenter > 130) {
      const k = 130 / distFromCenter
      this.position.x *= k
      this.position.z *= k
    }
  }

  update(dt, input) {
    if (this.game.state === 'menu' || this.game.state === 'over') {
      this.group.visible = false
      return
    }
    this.group.visible = true
    this.fireCooldown = Math.max(0, this.fireCooldown - dt)
    this.recoil = damp(this.recoil, 0, 9, dt)
    this.shake = damp(this.shake, 0, 8, dt)
    if (this.autoReload > 0) {
      this.autoReload -= dt
      if (this.autoReload <= 0) this.startReload()
    }
    if (this.reloading) {
      this.reloadTimer -= dt
      if (this.reloadTimer <= 0) this.finishReload()
    }

    this._updateBasis()
    this.ads = !!input.aim && !this.game.buildMode
    let speed = this.ads ? 4.4 : this.game.buildMode ? 5.5 : input.sprint ? 8.6 : 6.4
    if (this.reloading) speed *= 0.9
    let mx = 0
    let mz = 0
    if (input.forward) mz += 1
    if (input.back) mz -= 1
    if (input.right) mx += 1
    if (input.left) mx -= 1
    const mag = Math.hypot(mx, mz)
    const desired = new THREE.Vector3()
    if (mag > 0) {
      desired.addScaledVector(this.forward, mz / mag)
      desired.addScaledVector(this.right, mx / mag)
      desired.normalize().multiplyScalar(speed)
    }
    const accel = this.onGround ? 16 : 5
    this.velocity.x = damp(this.velocity.x, desired.x, accel, dt)
    this.velocity.z = damp(this.velocity.z, desired.z, accel, dt)
    this.moveSpeed = Math.hypot(this.velocity.x, this.velocity.z)

    if (input.jumpPressed && this.onGround && !this.dead) {
      this.velocity.y = 7.9
      this.onGround = false
      this.game.audio?.jump()
    }

    this.position.x += this.velocity.x * dt
    this.position.z += this.velocity.z * dt
    this._resolveCollisions()

    const ground = this.game.world.groundHeightAt(this.position.x, this.position.z, this.position.y + 0.95)
    if (this.velocity.y <= 0 && this.position.y - ground <= 0.55) {
      if (!this.onGround && this.position.y - ground > 0.25) this.game.audio?.land()
      this.position.y = ground
      this.velocity.y = 0
      this.onGround = true
    } else {
      this.velocity.y -= GRAVITY * dt
      this.position.y += this.velocity.y * dt
      if (this.position.y <= ground) {
        this.position.y = ground
        this.velocity.y = 0
        this.onGround = true
      } else {
        this.onGround = false
      }
    }

    this.walkDistance += this.moveSpeed * dt
    this.group.position.copy(this.position)
    this.group.rotation.y = this.cameraYaw
    this.fillLight.position.set(this.position.x, this.position.y + 2.5, this.position.z)
    const melee = this.weaponDef.kind === 'melee'
    if (!this.game.buildMode) {
      setCharacterWeapon(this.rig, melee ? 'pickaxe' : this.weaponDef.id)
    }
    animateCharacter(this.rig, dt, {
      speed: this.moveSpeed,
      aiming: this.ads && !melee && !this.game.buildMode,
      airborne: !this.onGround,
      buildMode: this.game.buildMode && !this.dead,
      dead: this.dead
    })
    if (this.rig.group.userData.glow) {
      this.rig.group.userData.glow.material.opacity = this.game.buildMode ? 0.12 : 0.24
    }
    if (this.rig.hurtTimer > 0) {
      const k = this.rig.hurtTimer / 0.18
      for (const key of ['jacket', 'jacketDark', 'pants', 'skin']) {
        const mat = this.rig.mats[key]
        if (mat) mat.emissive.setRGB(k * 0.5, 0, 0)
      }
    } else {
      for (const key of ['jacket', 'jacketDark', 'pants', 'skin']) {
        const mat = this.rig.mats[key]
        if (mat) mat.emissive.setRGB(0, 0, 0)
      }
    }
    this.updateCamera(dt, input)
  }

  updateCamera(dt, input) {
    const def = this.weaponDef
    const aiming = this.ads && def.kind === 'gun' && !this.game.buildMode
    const portrait = this.camera.aspect < 0.85
    const dist = (aiming ? 1.8 : 3.55) * (portrait && !aiming ? 1.3 : 1)
    const shoulder = aiming ? 0.55 : 0.62
    const target = this._tmp.copy(this.position)
    target.y += 1.52
    target.addScaledVector(this.right, shoulder)
    const pitch = clamp(this.pitch + this.recoil, -1.15, 1.05)
    const dir = this._tmp2.set(-Math.sin(this.cameraYaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(this.cameraYaw) * Math.cos(pitch))
    const desired = new THREE.Vector3().copy(target).addScaledVector(dir, -dist)
    let camDist = dist
    if (this.game.occluders?.length) {
      const toCam = desired.clone().sub(target)
      const len = toCam.length()
      toCam.normalize()
      this.cameraRay.set(target, toCam)
      this.cameraRay.far = len + 0.12
      const hits = this.cameraRay.intersectObjects(this.game.occluders, false)
      if (hits.length && hits[0].distance < len) camDist = Math.max(0.55, hits[0].distance - 0.18)
    }
    desired.copy(target).addScaledVector(dir, -camDist)
    if (this.cameraIntro > 0) {
      this.cameraIntro = Math.max(0, this.cameraIntro - dt / 0.9)
      const t = smoothstep(0, 1, 1 - this.cameraIntro)
      const pos = new THREE.Vector3().lerpVectors(this.introFrom, desired, t)
      this.camera.position.copy(pos)
    } else {
      this.camera.position.lerp(desired, 1 - Math.exp(-28 * dt))
    }
    const shakeAmt = this.shake * 0.11
    if (shakeAmt > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * shakeAmt
      this.camera.position.y += (Math.random() - 0.5) * shakeAmt
      this.camera.position.z += (Math.random() - 0.5) * shakeAmt
    }
    const look = target.clone().addScaledVector(dir, 12)
    this.camera.lookAt(look)
    const targetFov = aiming ? 52 : this.game.buildMode ? 76 : portrait ? 76 : 71
    this.camera.fov = damp(this.camera.fov, targetFov, 12, dt)
    this.camera.updateProjectionMatrix()
    this.game.ui?.setSpread(this.spread(), aiming)
    this.game.ui?.setCompass(this.cameraYaw)
    this.game.ui?.updateMapCoords(this.position)
  }

  muzzleWorld() {
    this.rig.muzzle.getWorldPosition(this._muzzle)
    return this._muzzle.clone()
  }

  forwardPoint(distance = 1) {
    return new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw)).multiplyScalar(distance).add(this.position)
  }
}
