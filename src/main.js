import * as THREE from 'three'
import { World, STORM_START_RADIUS } from './world.js'
import { Player } from './player.js'
import { BuildingSystem } from './building.js'
import { BotManager } from './bots.js'
import { Effects } from './effects.js'
import { GameAudio } from './audio.js'
import { UI } from './ui.js'
import { WEAPONS, damageForDistance } from './weapons.js'
import { clamp, yawFromDir, projectToScreen } from './util.js'

class Game {
  constructor() {
    this.state = 'menu'
    this.buildMode = false
    this.stats = { eliminations: 0, damage: 0, built: 0, time: 0, place: 20 }
    this.startTime = 0
    this.aliveCount = 20
    this.stormTick = 0
    this.victoryAt = 0
    this.currentPoi = null
    this.everLocked = false
    this._pauseFromLock = false
    this._locationTimer = 0
    this.input = {
      forward: false, back: false, left: false, right: false, sprint: false,
      aim: false, fire: false, firePressed: false, jumpPressed: false,
      reloadPressed: false, interactPressed: false, buildTogglePressed: false
    }
    this.canvas = document.getElementById('scene')
    this.camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 0.1, 900)
    this.camera.position.set(70, 48, 70)
    this.renderer = null
    this.menuAngle = 0
    this.raycaster = new THREE.Raycaster()
    this.losRay = new THREE.Raycaster()
    this.clock = 0
    this.lastTime = performance.now()
    this._lastHudStorm = 0
    this._lastMap = 0
    this._activeChest = null
    this._mute = false
    this._gameOver = false
    this._init()
  }

  _init() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      })
    } catch (error) {
      document.getElementById('loading-screen').classList.add('done')
      const err = document.getElementById('webgl-error')
      err.classList.remove('hidden')
      err.textContent = 'This battle royale needs WebGL. Try a modern browser with hardware acceleration enabled.'
      console.error(error)
      return
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.06
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xb9d8ed)
    this.ui = new UI(this)
    this.audio = new GameAudio()
    this.world = new World(this.scene, this)
    this.effects = new Effects(this.scene, this.camera, this.renderer)
    this.occluders = [...this.world.occluders]
    this.losBlockers = this.occluders.filter(o => o !== this.world.terrain)
    this.bulletTargets = [...this.world.staticTargets]
    this.solidTargets = this.bulletTargets
    this.player = new Player(this, this.scene, this.camera)
    this.building = new BuildingSystem(this)
    this.bots = new BotManager(this)
    this.stats = { eliminations: 0, damage: 0, built: 0, time: 0, place: 20 }
    this._bindEvents()
    this.ui.showMenu()
    this.ui.updateVitals(100, 0)
    this.ui.updateResources(this.player.resources)
    this.ui.updateAmmo(this.player.loadout)
    this.ui.setWeaponSlot(2)
    this.ui.updateAlive(20)
    this.ui.updateStorm(this.world.storm)
    this.ui.updateMinimap(true)
    this.ui.loadingDone()
    this._resize()
    window.addEventListener('resize', () => this._resize())
    window.__stormfall = this
    this._loop = this._loop.bind(this)
    requestAnimationFrame(this._loop)
    const params = new URLSearchParams(location.search)
    if (params.get('autostart') === '1') {
      setTimeout(() => this.startMatch({ skipLock: true }), 450)
    }
  }

  _resize() {
    if (!this.renderer) return
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  _bindEvents() {
    window.addEventListener('keydown', e => this._onKeyDown(e))
    window.addEventListener('keyup', e => this._onKeyUp(e))
    window.addEventListener('mousemove', e => this._onMouseMove(e))
    window.addEventListener('mousedown', e => this._onMouseDown(e))
    window.addEventListener('mouseup', e => this._onMouseUp(e))
    window.addEventListener('wheel', e => this._onWheel(e), { passive: false })
    window.addEventListener('contextmenu', e => e.preventDefault())
    document.addEventListener('pointerlockchange', () => this._onPointerLockChange())
    document.addEventListener('pointerlockerror', () => {})
    document.getElementById('start-btn').addEventListener('click', () => this.startMatch())
    document.getElementById('resume-btn').addEventListener('click', () => this.resumeMatch())
    document.getElementById('quit-btn').addEventListener('click', () => location.reload())
    document.getElementById('again-btn').addEventListener('click', () => location.reload())
    document.getElementById('lobby-btn').addEventListener('click', () => location.reload())
    document.getElementById('mute-btn-pause').addEventListener('click', () => this.toggleMute())
    for (const el of document.querySelectorAll('.build-piece')) {
      el.addEventListener('click', () => {
        if (this.state !== 'playing') return
        if (!this.buildMode) this.setBuildMode(true)
        this.building.selectType(el.dataset.piece)
      })
    }
    for (const el of document.querySelectorAll('.mat-chip')) {
      el.addEventListener('click', () => {
        if (this.state !== 'playing') return
        this.building.selectedMaterial = el.dataset.mat
        this.ui.setBuildMaterial(el.dataset.mat)
        if (!this.buildMode) this.setBuildMode(true)
      })
    }
    this.canvas.addEventListener('click', () => {
      if (this.state === 'playing' && document.pointerLockElement !== this.canvas) this.requestLock()
    })
  }

  requestLock() {
    try {
      const req = this.canvas.requestPointerLock?.()
      if (req?.catch) req.catch(() => {})
    } catch {}
  }

  _onPointerLockChange() {
    if (document.pointerLockElement === this.canvas) {
      this.everLocked = true
      if (this.state === 'paused') this._resumeFromLock()
    } else if (this.state === 'playing' && this.everLocked && !this._pauseFromLock) {
      this.pauseMatch()
    }
  }

  _resumeFromLock() {
    this.ui.showPause(false)
    this.state = 'playing'
  }

  _onKeyDown(e) {
    const code = e.code
    if (code === 'KeyM') { this.toggleMute(); return }
    if (this.state === 'menu') {
      if (code === 'Enter') this.startMatch()
      return
    }
    if (this.state === 'paused') {
      if (code === 'Escape') this.resumeMatch()
      return
    }
    if (this.state === 'over') return
    if (code === 'Escape') {
      this.pauseMatch()
      return
    }
    if (code === 'KeyW') this.input.forward = true
    if (code === 'KeyS') this.input.back = true
    if (code === 'KeyA') this.input.left = true
    if (code === 'KeyD') this.input.right = true
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.input.sprint = true
    if (code === 'Space') {
      this.input.jumpPressed = true
      e.preventDefault()
    }
    if (e.repeat) return
    if (code === 'KeyQ') {
      if (!this.player.dead) this.setBuildMode(!this.buildMode)
    } else if (code === 'KeyE') {
      this.input.interactPressed = true
    } else if (code === 'KeyR') {
      if (this.buildMode) this.building.cycleMaterial()
      else this.player.startReload()
    } else if (code === 'KeyZ') {
      if (!this.buildMode) this.setBuildMode(true)
      this.building.selectType('wall')
    } else if (code === 'KeyX') {
      if (!this.buildMode) this.setBuildMode(true)
      this.building.selectType('floor')
    } else if (code === 'KeyC') {
      if (!this.buildMode) this.setBuildMode(true)
      this.building.selectType('ramp')
    } else if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3' || code === 'Digit4') {
      const slot = Number(code.slice(-1))
      if (this.buildMode) this.setBuildMode(false)
      this.player.selectSlot(slot)
    }
  }

  _onKeyUp(e) {
    const code = e.code
    if (code === 'KeyW') this.input.forward = false
    if (code === 'KeyS') this.input.back = false
    if (code === 'KeyA') this.input.left = false
    if (code === 'KeyD') this.input.right = false
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.input.sprint = false
  }

  _onMouseMove(e) {
    if (this.state !== 'playing') return
    if (document.pointerLockElement !== this.canvas) return
    const sens = 0.0022
    this.player.cameraYaw -= e.movementX * sens
    this.player.pitch -= e.movementY * sens
    this.player.pitch = clamp(this.player.pitch, -1.15, 1.05)
  }

  _onMouseDown(e) {
    if (this.state !== 'playing') return
    this.audio.init()
    this.audio.resume()
    if (e.button === 0) {
      this.input.fire = true
      this.input.firePressed = true
      if (this.buildMode) this.building.place()
    } else if (e.button === 2) {
      if (this.buildMode) this.building.removeAtAim(this.camera)
      else this.input.aim = true
    }
  }

  _onMouseUp(e) {
    if (e.button === 0) this.input.fire = false
    if (e.button === 2) this.input.aim = false
  }

  _onWheel(e) {
    if (this.state !== 'playing') return
    e.preventDefault()
    this.player.cycleSlot(e.deltaY > 0 ? 1 : -1)
  }

  toggleMute() {
    this._mute = !this._mute
    this.audio.setMuted(this._mute)
    this.ui.setMuted(this._mute)
    this.ui.toast(this._mute ? 'SOUND OFF' : 'SOUND ON')
  }

  setBuildMode(on) {
    if (this.state !== 'playing' || this.player.dead) return
    this.buildMode = on
    this.ui.setBuildMode(on)
    if (on) {
      this.ui.setBuildPiece(this.building.selectedType)
      this.ui.setBuildMaterial(this.building.selectedMaterial)
      this.ui.hidePrompt()
      this.ui.toast('BUILD MODE', 'gold')
    }
  }

  findSpawn() {
    const poi = this.world.pois[0]
    const candidates = [2.35, 1.55, 3.05, 0.7, 4.2, 5.05]
    for (const angle of candidates) {
      const x = poi.x + Math.cos(angle) * 27
      const z = poi.z + Math.sin(angle) * 27
      const y = this.world.terrainHeight(x, z)
      if (y < 0.2) continue
      let blocked = false
      for (const c of this.world.colliders) {
        if (!c.active) continue
        if (c.maxY < y + 0.2 || c.minY > y + 1.8) continue
        if (x > c.minX - 1.2 && x < c.maxX + 1.2 && z > c.minZ - 1.2 && z < c.maxZ + 1.2) { blocked = true; break }
      }
      if (blocked) continue
      const yaw = yawFromDir(poi.x - x, poi.z - z)
      return { x, y, z, yaw }
    }
    return { x: -40, y: this.world.terrainHeight(-40, -55), z: -55, yaw: 2.4 }
  }

  startMatch({ skipLock = false } = {}) {
    if (this.state !== 'menu') return
    this.audio.init()
    this.audio.resume()
    this.scene.fog.color.setHex(0xb8d8ef)
    this.scene.fog.density = 0.0036
    this.stats = { eliminations: 0, damage: 0, built: 0, time: 0, place: 20 }
    this._gameOver = false
    this.victoryAt = 0
    this.stormTick = 0
    this.currentPoi = null
    this.world.storm.reset()
    this.world.storm.material.uniforms.uAlpha.value = 0.72
    this.building.reset()
    const spawn = this.findSpawn()
    this.player.reset(spawn)
    this.bots.reset()
    this.aliveCount = 1 + this.bots.aliveCount
    this.state = 'playing'
    this.startTime = performance.now()
    this.buildMode = false
    this.ui.beginMatch()
    this.ui.setBuildMode(false)
    this.ui.updateAlive(this.aliveCount)
    this.ui.updateVitals(this.player.health, this.player.shield)
    this.ui.updateResources(this.player.resources)
    this.ui.updateAmmo(this.player.loadout)
    this.ui.setWeaponSlot(2)
    this.ui.updateElims(0)
    this.ui.updateStorm(this.world.storm)
    this.ui.updateMinimap(true)
    this.ui.showLocation(this.world.pois[0].name, this.world.pois[0].sector)
    this.currentPoi = this.world.pois[0].name
    this._locationTimer = 3.4
    this.ui.updateStormOverlay(this.player, this.world.storm)
    this.input.fire = false
    this.input.aim = false
    this.input.forward = this.input.back = this.input.left = this.input.right = false
    this.audio.setStorm(0)
    if (!skipLock) this.requestLock()
    setTimeout(() => { if (this.state === 'playing') this.ui.toast('Q TO BUILD COVER', 'gold') }, 1500)
    setTimeout(() => { if (this.state === 'playing') this.ui.toast('E TO OPEN CHESTS', 'gold') }, 3300)
    setTimeout(() => { if (this.state === 'playing') this.ui.toast('STAY INSIDE THE STORM', 'purple') }, 5200)
  }

  pauseMatch() {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this._pauseFromLock = true
    this.input.forward = this.input.back = this.input.left = this.input.right = false
    this.input.fire = false
    this.input.aim = false
    this.ui.showPause(true)
    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock?.()
      setTimeout(() => { this._pauseFromLock = false }, 50)
    } else {
      this._pauseFromLock = false
    }
  }

  resumeMatch() {
    if (this.state !== 'paused') return
    this.state = 'playing'
    this.ui.showPause(false)
    this.requestLock()
    this.lastTime = performance.now()
  }

  playerDied() {
    if (this._gameOver) return
    this._gameOver = true
    this.player.dead = true
    this.stats.place = Math.max(1, this.aliveCount)
    this.stats.time = (performance.now() - this.startTime) / 1000
    this.state = 'over'
    this.buildMode = false
    this.ui.hidePrompt()
    this.ui.hideReload()
    this.ui.showEnd(false, this.stats.place, this.stats)
    this.audio.defeat()
    this.ui.toggleStorm(false)
    document.exitPointerLock?.()
    const killer = this.player.lastAttacker
    if (killer?.storm) this.ui.killFeed('STORM', 'YOU', 'STORM', { storm: true })
    else if (killer?.name) this.ui.killFeed(killer.name, 'YOU', killer.weapon?.name || 'AR', {})
  }

  victory() {
    if (this._gameOver) return
    this._gameOver = true
    this.stats.place = 1
    this.stats.time = (performance.now() - this.startTime) / 1000
    this.state = 'over'
    this.buildMode = false
    this.ui.hidePrompt()
    this.ui.hideReload()
    this.ui.showEnd(true, 1, this.stats)
    this.audio.victory()
    document.exitPointerLock?.()
  }

  onBotEliminated() {
    this.aliveCount = 1 + this.bots.aliveCount
    this.ui.updateAlive(this.aliveCount)
    if (!this.player.dead && this.aliveCount <= 1 && this.state === 'playing' && !this.victoryAt) {
      this.victoryAt = performance.now() + 1000
    }
  }

  _resolveStatic(hit) {
    const obj = hit.object
    if (obj === this.world.treeMeshes[0] || obj === this.world.treeMeshes[1] || obj === this.world.treeMeshes[2] || obj === this.world.treeMeshes[3]) {
      return this.world.trees[hit.instanceId]
    }
    if (obj === this.world.rockMesh) return this.world.rocks[hit.instanceId]
    if (obj.userData?.static) return obj.userData.static
    return null
  }

  _impact(point, normal, color = 0xffd08a, count = 5) {
    this.effects.spawnParticles(point, color, count, { speed: 2.2, spread: 1.1, life: 0.35, gravity: 8, size: 0.1 })
  }

  _fireGun(def) {
    const pelletCount = def.pellets || 1
    const seenBots = new Set()
    for (let p = 0; p < pelletCount; p++) {
      const dir = new THREE.Vector3()
      this.camera.getWorldDirection(dir)
      const spread = this.player.spread() * (def.id === 'shotgun' ? 1 : 0.9)
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
      const up = new THREE.Vector3().crossVectors(right, dir).normalize()
      dir.addScaledVector(right, (Math.random() - 0.5) * spread * 2)
      dir.addScaledVector(up, (Math.random() - 0.5) * spread * 2)
      dir.normalize()
      this.raycaster.set(this.camera.position, dir)
      this.raycaster.far = def.range
      const hits = this.raycaster.intersectObjects(this.bulletTargets, false)
      let hit = null
      if (hits.length) hit = hits[0]
      const end = hit ? hit.point.clone() : this.camera.position.clone().addScaledVector(dir, def.range)
      const muzzle = this.player.muzzleWorld()
      if (p < (def.id === 'shotgun' ? 4 : 1)) this.effects.tracer(muzzle, end, 0xffe0a0, def.id === 'shotgun' ? 0.55 : 0.85)
      if (!hit) continue
      const obj = hit.object
      const staticObj = this._resolveStatic(hit)
      if (staticObj) {
        const dmg = def.damage * 0.5
        const destroyed = this.world.harvest(staticObj, dmg, true)
        if (destroyed) {
          this.effects.explosion(hit.point, staticObj.resource === 'brick' ? 0x9aa3a8 : 0xc09155, 14)
          this.audio.destroy()
        } else {
          this._impact(hit.point, hit.face?.normal, staticObj.resource === 'brick' ? 0xaab2b7 : 0xb78a55, 4)
        }
        continue
      }
      if (obj.userData?.bot) {
        const bot = obj.userData.bot
        if (!bot.alive) continue
        const distance = hit.distance
        const falloff = damageForDistance(def, distance)
        const crit = obj.userData.part === 'head'
        let dmg = def.damage * falloff * (crit ? def.headshot : 1)
        const shieldBefore = bot.shield
        bot.applyDamage(dmg, this.player)
        this.stats.damage += dmg
        const hitPoint = hit.point.clone().add(new THREE.Vector3(0, 0.06, 0))
        this.ui.damageNumber(hitPoint, dmg, { crit, shield: shieldBefore > 0 })
        if (!seenBots.has(bot)) {
          this.ui.hitmarker(crit)
          this.audio.hit(crit)
          seenBots.add(bot)
        }
        this.effects.spawnParticles(hitPoint, crit ? 0xffd447 : 0xff7a6f, crit ? 9 : 5, { speed: 2.4, life: 0.32, gravity: 7, size: 0.09 })
        continue
      }
      if (obj.userData?.structure) {
        this.building.damage(obj.userData.structure, def.structureDamage, hit.point)
        this._impact(hit.point, hit.face?.normal, 0xffc46b, 4)
        continue
      }
      const isWater = false
      this._impact(hit.point, hit.face?.normal, isWater ? 0x8bd8ff : 0xc9b082, 4)
    }
    const muzzle = this.player.muzzleWorld()
    this.effects.muzzle(muzzle, 0xffd27a, def.id === 'shotgun' ? 0.8 : 0.55)
    this.audio.shot(def.id, 0)
  }

  _melee() {
    const def = this.player.weaponDef
    const dir = new THREE.Vector3()
    this.camera.getWorldDirection(dir)
    this.raycaster.set(this.camera.position, dir)
    this.raycaster.far = def.range
    const hits = this.raycaster.intersectObjects(this.bulletTargets, false)
    this.audio.pickaxe()
    const muzzle = this.player.muzzleWorld()
    this.effects.muzzle(muzzle, 0xffe2a4, 0.32)
    if (!hits.length) return
    const hit = hits[0]
    const obj = hit.object
    const staticObj = this._resolveStatic(hit)
    if (staticObj) {
      const gain = Math.max(1, Math.round(staticObj.amount / 3))
      this.player.addResources(staticObj.resource, gain)
      const destroyed = this.world.harvest(staticObj, def.treeDamage, true)
      this.audio.harvest()
      if (destroyed) {
        this.effects.explosion(hit.point, staticObj.resource === 'brick' ? 0x9aa3a8 : staticObj.resource === 'metal' ? 0xa9c3d6 : 0xc09155, 22)
        this.audio.destroy()
        this.ui.toast(`+${staticObj.amount} ${staticObj.resource.toUpperCase()}`, 'gold')
      } else {
        this._impact(hit.point, hit.face?.normal, staticObj.resource === 'brick' ? 0xaab2b7 : staticObj.resource === 'metal' ? 0x9db8c9 : 0xb78a55, 8)
      }
      return
    }
    if (obj.userData?.bot) {
      const bot = obj.userData.bot
      if (!bot.alive) return
      const crit = obj.userData.part === 'head'
      const dmg = def.damage * (crit ? 1.55 : 1)
      bot.applyDamage(dmg, this.player)
      this.stats.damage += dmg
      this.ui.damageNumber(hit.point, dmg, { crit })
      this.ui.hitmarker(crit)
      this.audio.hit(crit)
      this.effects.spawnParticles(hit.point, 0xffd447, 10, { speed: 2.6, life: 0.35, gravity: 7, size: 0.1 })
      return
    }
    if (obj.userData?.structure) {
      this.building.damage(obj.userData.structure, def.structureDamage, hit.point)
      this._impact(hit.point, hit.face?.normal, 0xffc46b, 6)
      return
    }
    this._impact(hit.point, hit.face?.normal, 0xc9b082, 4)
  }

  _updateCombat(dt) {
    if (this.player.dead) return
    if (this.buildMode) {
      if (this.input.fire) this.building.place()
      return
    }
    const def = this.player.weaponDef
    if (!this.input.fire && !this.input.firePressed) return
    if (def.kind === 'melee') {
      if (this.player.canShoot()) {
        this.player.consumeShot()
        this._melee()
      }
      return
    }
    const shouldFire = def.auto ? this.input.fire : this.input.firePressed
    if (shouldFire && this.player.canShoot()) {
      this.player.consumeShot()
      this._fireGun(def)
    }
  }

  _updateInteractions(dt) {
    if (this.player.dead) return
    let nearest = null
    let nearestDist = 3.1
    for (const chest of this.world.chests) {
      if (chest.opened) continue
      const d = Math.hypot(chest.x - this.player.position.x, chest.z - this.player.position.z)
      if (d < nearestDist) { nearestDist = d; nearest = chest }
    }
    this._activeChest = nearest
    if (nearest) {
      this.ui.showPrompt('OPEN CHEST')
      if (this.input.interactPressed) this._openChest(nearest)
    } else {
      this.ui.hidePrompt()
    }
    for (const p of this.world.pickups) {
      if (p.taken) continue
      const d = Math.hypot(p.x - this.player.position.x, p.z - this.player.position.z)
      if (d > 1.9) continue
      p.taken = true
      this.gamePickup(p)
    }
  }

  gamePickup(p) {
    this.world.scene.remove(p.group)
    this.effects.spawnParticles(new THREE.Vector3(p.x, p.y + 0.6, p.z), p.type === 'shield' ? 0x5bd7ff : 0xffc85a, 12, { speed: 2.6, life: 0.5, gravity: -1, size: 0.09 })
    this.audio.pickup()
    if (p.type === 'shield') {
      const gained = this.player.addShield(25)
      if (gained > 0) this.ui.toast(`+${Math.round(gained)} SHIELD`, 'purple')
    } else {
      this.player.addAmmo('ar', 30)
      this.player.addAmmo('smg', 30)
      this.player.addAmmo('shotgun', 6)
      this.ui.toast('+ AMMO', 'gold')
    }
  }

  _openChest(chest) {
    chest.opened = true
    chest.openTime = 0
    this.audio.chest()
    this.ui.hidePrompt()
    this.effects.buildPulse(new THREE.Vector3(chest.x, chest.y + 0.2, chest.z), 0xffd447)
    this.effects.spawnParticles(new THREE.Vector3(chest.x, chest.y + 0.8, chest.z), 0xffd447, 26, { speed: 3.4, life: 0.8, gravity: -1.5, size: 0.13 })
    const pool = ['shield', 'materials', 'ammo', 'shield', 'materials']
    if (!this.player.loadout[3].unlocked) pool.push('shotgun')
    if (!this.player.loadout[4].unlocked) pool.push('smg')
    if (!this.player.loadout[3].unlocked && !this.player.loadout[4].unlocked) pool.push('shotgun', 'smg')
    const picks = []
    while (picks.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length)
      picks.push(pool.splice(i, 1)[0])
    }
    for (const reward of picks) {
      if (reward === 'shotgun') this.player.unlockWeapon('shotgun')
      else if (reward === 'smg') this.player.unlockWeapon('smg')
      else if (reward === 'shield') {
        const gained = this.player.addShield(50)
        if (gained > 0) this.ui.toast(`+${Math.round(gained)} SHIELD`, 'purple')
      } else if (reward === 'materials') {
        this.player.addResources('wood', 50)
        this.player.addResources('brick', 25)
        this.player.addResources('metal', 15)
        this.ui.toast('+ SUPPLY MATERIALS', 'gold')
      } else if (reward === 'ammo') {
        this.player.addAmmo('ar', 30)
        this.player.addAmmo('smg', 30)
        this.player.addAmmo('shotgun', 6)
        this.ui.toast('+ AMMO', 'gold')
      }
    }
  }

  _updateStormDamage(dt) {
    this.stormTick += dt
    if (this.stormTick < 1) return
    this.stormTick = 0
    const storm = this.world.storm
    if (!storm.contains(this.player.position.x, this.player.position.z) && !this.player.dead) {
      this.player.lastAttacker = { name: 'STORM', storm: true }
      this.player.applyDamage(storm.damage, null, { name: 'STORM', storm: true })
      this.audio.stormTick()
    }
  }

  _updateLocation(dt) {
    this._locationTimer -= dt
    if (this._locationTimer > 0) return
    this._locationTimer = 0.55
    for (const poi of this.world.pois) {
      if (Math.hypot(this.player.position.x - poi.x, this.player.position.z - poi.z) < 25) {
        if (this.currentPoi !== poi.name) {
          this.currentPoi = poi.name
          this.ui.showLocation(poi.name, poi.sector)
        }
        return
      }
    }
    this.currentPoi = null
  }

  hasLineOfSight(from, to) {
    const dist = from.distanceTo(to)
    if (dist < 0.2) return { clear: true, blocker: null }
    const dir = to.clone().sub(from).normalize()
    for (let t = 0.12; t < 0.9; t += 0.12) {
      const x = from.x + (to.x - from.x) * t
      const y = from.y + (to.y - from.y) * t
      const z = from.z + (to.z - from.z) * t
      if (y < this.world.terrainHeight(x, z) + 0.12) return { clear: false, blocker: null }
    }
    this.losRay.set(from, dir)
    this.losRay.far = Math.max(0.4, dist - 0.35)
    const hits = this.losRay.intersectObjects(this.losBlockers, false)
    if (hits.length) {
      return { clear: false, blocker: hits[0].object, point: hits[0].point }
    }
    return { clear: true, blocker: null }
  }

  _menuCamera(dt) {
    this.menuAngle += dt * 0.038
    const radius = 88
    const x = Math.cos(this.menuAngle) * radius
    const z = Math.sin(this.menuAngle) * radius
    const y = 45 + Math.sin(this.menuAngle * 0.64) * 4
    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 5, 0)
    this.camera.fov = 60
    this.camera.updateProjectionMatrix()
  }

  _loop(now) {
    requestAnimationFrame(this._loop)
    const raw = (now - this.lastTime) / 1000
    this.lastTime = now
    const dt = clamp(raw, 0, 0.05)
    this.clock += dt
    if (this.state === 'menu') {
      this._menuCamera(dt)
      this.world.update(dt, null)
      this.effects.update(dt)
      this.ui.updateMinimap()
      const pulse = 0.7 + Math.sin(this.clock * 1.2) * 0.2
      this.world.storm.material.uniforms.uAlpha.value = pulse
      this.renderer.render(this.scene, this.camera)
      return
    }
    if (this.state === 'playing') {
      this.world.update(dt, this.player.position)
      this.player.update(dt, this.input)
      this.bots.update(dt)
      this._updateCombat(dt)
      this._updateInteractions(dt)
      this.building.update(this.player, dt)
      this.building.updateEffects(dt)
      this.effects.update(dt)
      this._updateStormDamage(dt)
      this._updateLocation(dt)
      this.ui.updateStorm(this.world.storm)
      this.ui.updateAlive(this.aliveCount)
      this.ui.updateStormOverlay(this.player, this.world.storm)
      this.ui.updateMinimap()
      if (this.victoryAt && performance.now() >= this.victoryAt && this.state === 'playing' && !this.player.dead) {
        this.victory()
      }
      this.input.jumpPressed = false
      this.input.firePressed = false
      this.input.interactPressed = false
      this.input.reloadPressed = false
    } else if (this.state === 'paused') {
      this.renderer.render(this.scene, this.camera)
      return
    } else if (this.state === 'over') {
      this.world.update(dt, this.player.position)
      this.effects.update(dt)
      this.renderer.render(this.scene, this.camera)
      return
    }
    this.renderer.render(this.scene, this.camera)
  }
}

try {
  new Game()
} catch (error) {
  console.error(error)
  const loader = document.getElementById('loading-screen')
  if (loader) loader.classList.add('done')
  const err = document.getElementById('webgl-error')
  if (err) {
    err.classList.remove('hidden')
    err.textContent = 'Stormfall failed to load. Please refresh the page.'
  }
}
