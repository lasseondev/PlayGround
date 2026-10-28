import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { flashTexture } from '../world/textures.js'

const DATA = {
  rifle: {
    key: 'rifle', name: 'M4 · CARBINE', short: 'M4',
    mag: 30, reserve: 210, reserveMax: 300, interval: 0.082, damage: 27,
    headMult: 3.6, limbMult: 0.62, pellets: 1, spreadHip: 0.021, spreadAds: 0.0035,
    spreadMove: 0.024, reloadTime: 1.85, range: 140, auto: true,
    recoil: { pitch: 0.0125, yaw: 0.0042, kick: 0.028, shake: 0.12 }
  },
  shotgun: {
    key: 'shotgun', name: 'M870 · BREACHER', short: 'M870',
    mag: 8, reserve: 40, reserveMax: 56, interval: 0.78, damage: 16,
    headMult: 1.7, limbMult: 0.55, pellets: 9, spreadHip: 0.075, spreadAds: 0.048,
    spreadMove: 0.035, reloadTime: 2.65, range: 70, auto: false,
    recoil: { pitch: 0.042, yaw: 0.01, kick: 0.09, shake: 0.42 }
  }
}

const _quat = new THREE.Quaternion()
const _euler = new THREE.Euler()

export class Weapon {
  constructor(game) {
    this.game = game
    this.camera = game.camera
    this.root = new THREE.Group()
    this.root.name = 'viewmodel'
    this.root.renderOrder = 20
    this.root.scale.setScalar(0.8)
    this.camera.add(this.root)
    this.states = {}
    for (const k of Object.keys(DATA)) {
      this.states[k] = { mag: DATA[k].mag, reserve: DATA[k].reserve }
    }
    this.current = 'rifle'
    this.cooldown = 0
    this.reloading = 0
    this.reloadDuration = 0
    this.switchTimer = 0
    this.pendingSwitch = null
    this.adsTarget = 0
    this.ads = 0
    this.aiming = false
    this.triggerHeld = false
    this.wasTrigger = false
    this.kick = 0
    this.kickRot = 0
    this.swayX = 0
    this.swayY = 0
    this.bobTime = 0
    this.flashTime = 0
    this.shotCount = 0
    this.raycaster = new THREE.Raycaster()
    this.raycaster.far = 160
    this.build()
    this.equip('rifle', true)
  }

  get def() { return DATA[this.current] }
  get state() { return this.states[this.current] }
  get ammo() { return this.state.mag }
  get reserve() { return this.state.reserve }

  build() {
    const metal = new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.33, metalness: 0.86, envMapIntensity: 1.25 })
    const metalLight = new THREE.MeshStandardMaterial({ color: 0x2b2e33, roughness: 0.28, metalness: 0.9, envMapIntensity: 1.4 })
    const polymer = new THREE.MeshStandardMaterial({ color: 0x1e2126, roughness: 0.7, metalness: 0.12 })
    const tan = new THREE.MeshStandardMaterial({ color: 0x7b674c, roughness: 0.62, metalness: 0.08 })
    const glove = new THREE.MeshStandardMaterial({ color: 0x23221f, roughness: 0.85, metalness: 0.02 })
    const sleeve = new THREE.MeshStandardMaterial({ color: 0x242922, roughness: 0.98, metalness: 0 })
    const lens = new THREE.MeshPhysicalMaterial({ color: 0x4d7f96, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.55, envMapIntensity: 2 })
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xff2a1a, toneMapped: false })
    this.mats = { metal, metalLight, polymer, tan, glove, sleeve, lens, dotMat }

    this.models = {}
    this.models.rifle = this.buildRifle()
    this.models.shotgun = this.buildShotgun()
    for (const m of Object.values(this.models)) { m.visible = false; this.root.add(m) }

    this.flashTex = flashTexture()
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTex, color: 0xffd9a0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
    this.flash.scale.set(0.34, 0.34, 1)
    this.flash.visible = false
    this.root.add(this.flash)
    this.flashLight = new THREE.PointLight(0xffc078, 0, 12, 2)
    this.root.add(this.flashLight)
  }

  buildRifle() {
    const g = new THREE.Group()
    const { metal, metalLight, polymer, tan, glove, sleeve, lens, dotMat } = this.mats
    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = g) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m); return m
    }
    add(new RoundedBoxGeometry(0.072, 0.088, 0.34, 3, 0.012), metal, 0, 0, 0.02)
    add(new RoundedBoxGeometry(0.06, 0.036, 0.3, 2, 0.01), metalLight, 0, 0.058, -0.01)
    add(new RoundedBoxGeometry(0.058, 0.07, 0.31, 3, 0.014), polymer, 0, -0.004, -0.31)
    add(new RoundedBoxGeometry(0.062, 0.024, 0.31, 2, 0.008), tan, 0, 0.03, -0.31)
    add(new THREE.CylinderGeometry(0.0135, 0.0135, 0.26, 12).rotateX(Math.PI / 2), metal, 0, 0.012, -0.57)
    add(new THREE.CylinderGeometry(0.021, 0.019, 0.06, 12).rotateX(Math.PI / 2), metalLight, 0, 0.012, -0.7)
    add(new RoundedBoxGeometry(0.052, 0.075, 0.2, 2, 0.01), polymer, 0, -0.014, 0.26)
    add(new RoundedBoxGeometry(0.06, 0.095, 0.035, 2, 0.01), polymer, 0, -0.02, 0.37)
    add(new RoundedBoxGeometry(0.045, 0.115, 0.052, 2, 0.01), polymer, 0, -0.1, 0.085, 0.32)
    add(new RoundedBoxGeometry(0.05, 0.14, 0.075, 2, 0.012), metal, 0, -0.1, -0.055, 0.18)
    add(new RoundedBoxGeometry(0.054, 0.02, 0.075, 2, 0.006), tan, 0, -0.175, -0.038, 0.18)
    add(new RoundedBoxGeometry(0.052, 0.018, 0.28, 2, 0.006), metalLight, 0, 0.081, -0.01)
    // optic
    add(new RoundedBoxGeometry(0.058, 0.024, 0.1, 2, 0.006), metal, 0, 0.095, -0.025)
    const tube = add(new THREE.CylinderGeometry(0.023, 0.023, 0.088, 16).rotateX(Math.PI / 2), metal, 0, 0.122, -0.03)
    add(new THREE.CircleGeometry(0.021, 20), lens, 0, 0.122, -0.075)
    add(new THREE.CircleGeometry(0.019, 20), lens, 0, 0.122, 0.015, 0, Math.PI, 0)
    add(new THREE.CircleGeometry(0.0035, 10), dotMat, 0, 0.122, -0.0745)
    // rail covers
    for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(0.058, 0.006, 0.02), metal, 0, 0.09, -0.12 + i * 0.055)
    // foregrip
    add(new RoundedBoxGeometry(0.042, 0.12, 0.052, 2, 0.01), polymer, 0, -0.085, -0.3, 0.18)
    // flashlight
    add(new THREE.CylinderGeometry(0.021, 0.021, 0.1, 12).rotateX(Math.PI / 2), metal, -0.045, -0.005, -0.34)
    add(new THREE.CircleGeometry(0.019, 12), new THREE.MeshBasicMaterial({ color: 0xf4ead1, toneMapped: false }), -0.045, -0.005, -0.392, 0, Math.PI, 0)
    // muzzle brake
    add(new RoundedBoxGeometry(0.036, 0.036, 0.055, 2, 0.008), metal, 0, 0.012, -0.745)
    // hands
    const right = new THREE.Group()
    add(new RoundedBoxGeometry(0.055, 0.085, 0.085, 3, 0.02), glove, 0, -0.105, 0.1, 0.1, 0, 0.1, right)
    for (let i = 0; i < 4; i++) {
      add(new RoundedBoxGeometry(0.013, 0.04, 0.05, 2, 0.006), glove, -0.033, -0.09 - i * 0.012, 0.065 + i * 0.012, 0.2, 0.2, 0, right)
    }
    add(new RoundedBoxGeometry(0.06, 0.09, 0.085, 3, 0.02), glove, -0.005, -0.12, -0.06, 0.2, 0, -0.08, right)
    add(new THREE.CylinderGeometry(0.038, 0.047, 0.16, 10), sleeve, 0.05, -0.17, 0.18, 0.35, 0, -0.55, right)
    g.add(right)
    const left = new THREE.Group()
    add(new RoundedBoxGeometry(0.07, 0.06, 0.1, 3, 0.018), glove, -0.012, -0.075, -0.295, 0, 0, -0.02, left)
    for (let i = 0; i < 4; i++) add(new RoundedBoxGeometry(0.011, 0.045, 0.05, 2, 0.005), glove, 0.02, -0.07 + i * 0.011, -0.31 + i * 0.008, 0, 0.25, 0, left)
    add(new THREE.CylinderGeometry(0.036, 0.045, 0.12, 10), sleeve, -0.06, -0.11, -0.23, 0.18, 0, 0.5, left)
    g.add(left)
    g.userData.muzzle = new THREE.Vector3(0, 0.012, -0.78)
    g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false } })
    return g
  }

  buildShotgun() {
    const g = new THREE.Group()
    const { metal, metalLight, polymer, tan, glove, sleeve } = this.mats
    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m
    }
    add(new RoundedBoxGeometry(0.07, 0.085, 0.3, 3, 0.012), metal, 0, 0, 0.02)
    add(new RoundedBoxGeometry(0.06, 0.07, 0.18, 2, 0.01), metal, 0, -0.01, 0.24)
    add(new RoundedBoxGeometry(0.065, 0.1, 0.035, 2, 0.01), polymer, 0, -0.02, 0.34)
    add(new THREE.CylinderGeometry(0.017, 0.017, 0.44, 12).rotateX(Math.PI / 2), metal, 0, 0.025, -0.44)
    add(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 12).rotateX(Math.PI / 2), metalLight, 0, -0.018, -0.4)
    add(new RoundedBoxGeometry(0.07, 0.065, 0.22, 3, 0.014), tan, 0, -0.005, -0.31)
    add(new RoundedBoxGeometry(0.05, 0.11, 0.05, 2, 0.01), tan, 0, -0.09, -0.14, 0.15)
    add(new RoundedBoxGeometry(0.045, 0.11, 0.05, 2, 0.01), polymer, 0, -0.095, 0.09, 0.3)
    add(new RoundedBoxGeometry(0.052, 0.02, 0.28, 2, 0.006), metalLight, 0, 0.075, -0.02)
    add(new RoundedBoxGeometry(0.02, 0.028, 0.02), metal, 0, 0.092, -0.63)
    // beadsight
    add(new THREE.SphereGeometry(0.009, 8, 6), metalLight, 0, 0.066, -0.62)
    // hands
    add(new RoundedBoxGeometry(0.058, 0.085, 0.085, 3, 0.02), glove, 0, -0.105, 0.095, 0.1, 0, 0.1)
    add(new RoundedBoxGeometry(0.07, 0.06, 0.11, 3, 0.018), glove, -0.01, -0.075, -0.28, 0, 0, 0.02)
    add(new THREE.CylinderGeometry(0.038, 0.046, 0.16, 10), sleeve, 0.05, -0.16, 0.2, 0.4, 0, -0.5)
    add(new THREE.CylinderGeometry(0.035, 0.043, 0.14, 10), sleeve, -0.07, -0.11, -0.21, 0.15, 0, 0.55)
    // shells on side saddle
    for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.008, 0.008, 0.045, 8), new THREE.MeshStandardMaterial({ color: 0x9d2c26, roughness: 0.5, metalness: 0.3 }), 0.04, 0.02, 0.02 + i * 0.017, Math.PI / 2, 0, 0)
    g.userData.muzzle = new THREE.Vector3(0, 0.025, -0.68)
    g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false } })
    return g
  }

  equip(name, instant = false) {
    if (!DATA[name]) return
    if (!instant && this.current === name) return
    this.current = name
    for (const [k, m] of Object.entries(this.models)) m.visible = k === name
    this.reloading = 0
    if (instant) {
      this.ads = 0
      this.switchTimer = 0
      this.root.position.set(0.18, -0.175, -0.53)
      this.root.rotation.set(0, 0, 0)
    } else {
      this.switchTimer = 0.34
      this.pendingSwitch = name
    }
    this.game.hud?.setWeapon(this)
  }

  requestSwitch(name) {
    if (this.current === name || this.pendingSwitch) return
    this.pendingSwitch = name
    this.switchTimer = 0.34
    this.game.audio?.playSwitch()
  }

  reload() {
    const d = this.def
    if (this.reloading > 0 || this.state.mag >= d.mag || this.state.reserve <= 0) return
    this.reloading = d.reloadTime
    this.reloadDuration = d.reloadTime
    this.aiming = false
    this.adsTarget = 0
    this.game.audio?.playReload(this.current)
    if (this.current === 'shotgun') {
      this.game.hud?.subtitle('ROOK', 'Reloading — cover me!', 1.2)
    }
  }

  startReloadIfEmpty() {
    if (this.state.mag <= 0) this.reload()
  }

  update(dt, input, player) {
    const d = this.def
    this.cooldown = Math.max(0, this.cooldown - dt)
    this.flashTime = Math.max(0, this.flashTime - dt)
    this.kick = THREE.MathUtils.damp(this.kick, 0, 16, dt)
    this.kickRot = THREE.MathUtils.damp(this.kickRot, 0, 14, dt)

    if (this.switchTimer > 0) {
      this.switchTimer -= dt
      if (this.switchTimer <= 0 && this.pendingSwitch) {
        const target = this.pendingSwitch
        this.pendingSwitch = null
        for (const [k, m] of Object.entries(this.models)) m.visible = k === target
        this.current = target
        this.game.hud?.setWeapon(this)
        this.game.audio?.playSwitch()
      }
    }

    let reloadProgress = 0
    if (this.reloading > 0) {
      this.reloading -= dt
      reloadProgress = 1 - Math.max(0, this.reloading) / this.reloadDuration
      if (this.reloading <= 0) {
        this.reloading = 0
        const d = this.def, st = this.state
        const need = d.mag - st.mag
        const take = Math.min(need, st.reserve)
        st.mag += take; st.reserve -= take
        this.game.audio?.playReloadEnd()
        this.game.hud?.setWeapon(this)
      }
    }

    const canAds = !player.sprinting && this.reloading <= 0 && this.switchTimer <= 0 && this.state.mag > 0
    this.aiming = input.mouse.right && canAds
    this.adsTarget = this.aiming ? 1 : 0
    this.ads = THREE.MathUtils.damp(this.ads, this.adsTarget, 13, dt)
    player.ads = this.ads

    const trigger = input.mouse.left
    const canFire = d.auto ? trigger : (trigger && !this.wasTrigger)
    if (canFire && this.cooldown <= 0 && this.reloading <= 0 && this.switchTimer <= 0 && this.state.mag > 0 && this.game.state === 'playing') {
      this.fire(player)
    }
    this.wasTrigger = trigger
    if (this.state.mag <= 0 && this.reloading <= 0 && this.cooldown <= 0 && input.mouse.left && this.game.state === 'playing') {
      this.reload()
      if (this.state.reserve <= 0) this.game.audio?.playDryFire()
    }

    // sway from mouse look
    this.swayX = THREE.MathUtils.damp(this.swayX, THREE.MathUtils.clamp(-input.lookDX * 0.0016, -0.035, 0.035), 9, dt)
    this.swayY = THREE.MathUtils.damp(this.swayY, THREE.MathUtils.clamp(input.lookDY * 0.0016, -0.03, 0.03), 9, dt)
    input.lookDX = 0; input.lookDY = 0

    const speed = Math.hypot(player.velocity.x, player.velocity.z)
    if (speed > 0.4 && player.onGround) this.bobTime += dt * (6.4 + speed * 0.7)
    const bobAmp = THREE.MathUtils.clamp(speed / 6, 0, 1) * 0.012
    const bobX = Math.sin(this.bobTime) * bobAmp
    const bobY = Math.abs(Math.cos(this.bobTime)) * bobAmp * 0.8
    const adsBlend = this.ads

    const hipPos = new THREE.Vector3(0.18, -0.175, -0.53)
    const adsPos = new THREE.Vector3(0.0, -0.085, -0.50)
    const basePos = hipPos.lerp(adsPos, adsBlend)
    const swayScale = 1 - adsBlend * 0.6
    basePos.x += bobX * (1 - adsBlend * 0.75) + this.swayX * swayScale
    basePos.y += bobY * (1 - adsBlend * 0.75) + this.swayY * swayScale
    basePos.z += this.kick * 1.4

    let reloadRot = 0, reloadY = 0, reloadX = 0
    if (this.reloading > 0) {
      const p = reloadProgress
      const s = Math.sin(Math.PI * p)
      reloadRot = 0.55 * s
      reloadX = -0.35 * s
      reloadY = -0.11 * s
      basePos.x += 0.05 * s
    }
    if (this.switchTimer > 0) {
      const p = Math.min(1, (0.34 - this.switchTimer) / 0.17)
      const s = this.switchTimer > 0.17 ? p : (this.switchTimer / 0.17)
      basePos.y -= 0.25 * s
      reloadRot += 0.5 * s
    }
    if (player.state === 'dead') {
      basePos.y -= 0.4
      reloadRot += 0.6
    }
    this.root.position.copy(basePos)
    this.root.rotation.set(reloadX - this.kickRot * 0.55, 0.02 * Math.sin(this.bobTime * 0.5) - this.swayX * 0.5, reloadRot + this.swayX * 1.2)

    // reload mag animation
    const model = this.models[this.current]
    if (this.reloading > 0) {
      const p = reloadProgress
      const s = Math.sin(Math.PI * p)
      model.position.y = -0.03 * s
      model.rotation.z = 0.02 * s
    } else {
      model.position.y = 0; model.rotation.z = 0
    }

    const mz = model.userData.muzzle
    this.flash.position.copy(mz)
    this.flashLight.position.copy(mz)
    if (this.flashTime > 0) {
      this.flash.visible = true
      const s = this.flashTime / 0.045
      this.flash.scale.setScalar(0.28 + (1 - s) * 0.12 + Math.random() * 0.08)
      this.flash.material.rotation = Math.random() * Math.PI * 2
      this.flash.material.opacity = Math.min(1, s * 1.4)
      this.flashLight.intensity = 22 * s
    } else {
      this.flash.visible = false
      this.flashLight.intensity = 0
    }
  }

  fire(player) {
    const d = this.def, st = this.state
    st.mag--
    this.cooldown = d.interval
    this.flashTime = 0.045
    this.shotCount++
    player.shotsFired += d.pellets

    const moving = Math.hypot(player.velocity.x, player.velocity.z) > 1.2
    const spread = THREE.MathUtils.lerp(d.spreadHip, d.spreadAds, this.ads) + (moving ? d.spreadMove * (1 - this.ads * 0.7) : 0)
    const origin = new THREE.Vector3()
    this.camera.getWorldPosition(origin)
    const baseDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion)
    const muzzle = new THREE.Vector3()
    this.getMuzzleWorld(muzzle)

    let anyHit = false, anyHead = false, anyKill = false
    for (let p = 0; p < d.pellets; p++) {
      const dir = baseDir.clone()
      const spreadNow = d.pellets > 1 ? spread * (0.6 + Math.random() * 0.8) : spread
      const angle = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * spreadNow
      _euler.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      _quat.setFromEuler(_euler)
      dir.applyQuaternion(_quat)
      const result = this.game.fireHitscan(origin, dir, d, this)
      if (result.hit) {
        anyHit = true
        if (result.head) anyHead = true
        if (result.kill) anyKill = true
      }
      if (p === 0) this.game.effects.spawnTracer(muzzle, result.point || origin.clone().addScaledVector(dir, 60))
    }

    this.kick = Math.min(0.14, this.kick + d.recoil.kick)
    this.kickRot = Math.min(0.28, this.kickRot + d.recoil.pitch * 6)
    player.addRecoil(d.recoil.pitch, (Math.random() - 0.5) * 2 * d.recoil.yaw, d.recoil.shake)
    this.game.effects.spawnMuzzleSmoke(muzzle, d.pellets > 1 ? 1.6 : 1)
    this.game.effects.spawnCasing(muzzle, this.current)
    this.game.audio.playShot(this.current)
    if (anyHit) {
      this.game.hud.hitmarker(anyHead, anyKill)
      this.game.audio.playHit(anyHead, anyKill)
      player.hits += d.pellets
    }
    this.game.hud.setWeapon(this)
    this.game.player.stats.shots += d.pellets
    if (anyHit) this.game.player.stats.hits += 1
  }

  getMuzzleWorld(out) {
    const model = this.models[this.current]
    const mz = model.userData.muzzle
    out.copy(mz)
    model.localToWorld(out)
    return out
  }

  addAmmo(ratio = 1) {
    for (const k of Object.keys(this.states)) {
      const d = DATA[k], st = this.states[k]
      st.reserve = Math.min(d.reserveMax, st.reserve + Math.round(d.reserveMax * 0.42 * ratio))
    }
  }

  refillAll() {
    for (const k of Object.keys(this.states)) {
      const d = DATA[k], st = this.states[k]
      st.mag = d.mag; st.reserve = d.reserveMax
    }
    this.game.hud?.setWeapon(this)
  }
}

export { DATA as WEAPON_DATA }
