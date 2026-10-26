import '@fontsource-variable/cinzel'
import '@fontsource-variable/cormorant-garamond'
import './style.css'
import * as THREE from 'three'
import { createWorld, FIELD, groundHeightAt } from './world.js'
import { createUnitModel, attachUnit, animateUnit, setUnitOpacity } from './units.js'
import { Effects } from './effects.js'
import { AudioEngine } from './audio.js'
import { UI } from './ui.js'
import { HERO_INFO, RECRUIT_OPTIONS, RECRUIT_INFO, WAVE_INFO } from './content.js'

const UNIT_STATS = {
  footman: { hp: 155, damage: 15, range: 1.95, speed: 4.5, attack: 1.05, aggro: 16, radius: 0.58, bounty: 0 },
  archer: { hp: 95, damage: 19, range: 15.5, speed: 4.1, attack: 1.5, aggro: 19, radius: 0.55, bounty: 0, projectile: 'arrow' },
  knight: { hp: 330, damage: 34, range: 2.25, speed: 5.0, attack: 1.2, aggro: 17, radius: 0.66, bounty: 0, cleave: true },
  cleric: { hp: 120, damage: 9, range: 9, speed: 3.9, attack: 1.7, aggro: 14, radius: 0.56, bounty: 0, healer: true, healRange: 9, healAmount: 38 },
  aelric: { hp: 980, damage: 48, range: 2.5, speed: 5.8, attack: 0.88, aggro: 18, radius: 0.82, bounty: 0, hero: true, regen: 7 },
  ysolde: { hp: 780, damage: 33, range: 11, speed: 5.2, attack: 1.35, aggro: 20, radius: 0.78, bounty: 0, hero: true, regen: 4.5, projectile: 'arcane' },
  skeleton: { hp: 84, damage: 11, range: 1.75, speed: 4.15, attack: 1.15, aggro: 16, radius: 0.55, bounty: 5 },
  ghoul: { hp: 138, damage: 16, range: 1.55, speed: 5.6, attack: 0.95, aggro: 17, radius: 0.58, bounty: 6 },
  wraith: { hp: 112, damage: 23, range: 9, speed: 4.6, attack: 1.75, aggro: 16, radius: 0.57, bounty: 8, projectile: 'shadow' },
  brute: { hp: 660, damage: 40, range: 2.6, speed: 3.4, attack: 1.7, aggro: 18, radius: 1.08, bounty: 24 },
  boss: { hp: 3300, damage: 82, range: 3.2, speed: 3.75, attack: 1.45, aggro: 24, radius: 1.55, bounty: 250, hero: true, boss: true }
}

const ENEMY_NAMES = {
  skeleton: 'Ashen Skeleton',
  ghoul: 'Ashen Ghoul',
  wraith: 'Ashen Wraith',
  brute: 'Ashen Brute',
  boss: 'Malgor, the Ashen King'
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}

function distXZ(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

function angleLerp(current, target, amount) {
  let diff = target - current
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  return current + diff * amount
}

function screenProject(position, camera) {
  const v = position.clone()
  v.project(camera)
  return {
    x: (v.x * 0.5 + 0.5) * window.innerWidth,
    y: (-v.y * 0.5 + 0.5) * window.innerHeight,
    behind: v.z > 1
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('scene')
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#080b12')
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 420)
    this.camera.position.set(30, 24, 46)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.36
    this.renderer.shadowMap.enabled = false

    this.world = createWorld(this.scene)
    const frontLight = new THREE.DirectionalLight('#b8d0ff', 0.75)
    frontLight.position.set(8, 22, 46)
    this.scene.add(frontLight)
    this.effects = new Effects(this.scene, this.world.glow, this.camera, document.getElementById('damage-layer'))
    this.audio = new AudioEngine()
    this.ui = new UI(this)

    this.units = []
    this.playerUnits = []
    this.enemyUnits = []
    this.heroUnits = {}
    this.selection = []
    this.spawnQueue = []
    this.timers = []
    this.towerShots = []
    this.portalPositions = [FIELD.portal, ...FIELD.sidePortals]

    this.gateMax = 3000
    this.gateHp = this.gateMax
    this.gateUnderAttack = false
    this.unitCap = 26
    this.aether = 240
    this.aetherRate = 14

    this.started = false
    this.ended = false
    this.wave = 1
    this.waveState = 'menu'
    this.waveCountdown = 0
    this.wavePrep = 9
    this.waveKilled = 0
    this.waveTotal = 9
    this.enemiesRemaining = 0
    this.victoryTimer = 0
    this.bossDown = false

    this.selectedHero = 'aelric'
    this.abilityCooldowns = { aelric: [0, 0, 0], ysolde: [0, 0, 0] }
    this.stats = { time: 0, kills: 0, lost: 0 }

    this.cameraTarget = new THREE.Vector3(0, 0, 2)
    this.smoothedLook = new THREE.Vector3(0, 1.4, 2)
    this.cameraYaw = -0.18
    this.cameraPitch = 0.76
    this.cameraDistance = 46
    this.menuAngle = 0.55
    this.shakeOffset = new THREE.Vector3()

    this.keys = new Set()
    this.pointerNdc = new THREE.Vector2(0, 0)
    this.pointerClient = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.42)
    this.mouseGround = new THREE.Vector3(0, 0, 0)
    this.raycaster = new THREE.Raycaster()
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    this.drag = null
    this.middleDrag = null
    this.lastFrame = performance.now()
    this.elapsed = 0
    this.shakeAmount = 0
    this.shakeTime = 0

    this.effects.onShake = (amount, time) => {
      this.shakeAmount = Math.max(this.shakeAmount, amount)
      this.shakeTime = Math.max(this.shakeTime, time)
    }

    this.createInitialArmy()
    this.createTowers()
    this.bindInput()
    this.bindResize()

    this.renderer.setAnimationLoop(() => this.frame())
    this.ui.hideLoading()
    document.fonts?.ready?.then(() => this.ui.hideLoading())
  }

  createInitialArmy() {
    const layout = [
      ['aelric', -2.4, 8.2],
      ['ysolde', 3.1, 8.9],
      ['footman', -7, 3.1],
      ['footman', -3.2, 3.6],
      ['footman', 3.4, 3.6],
      ['footman', 7, 3.1],
      ['knight', 0, 4.8],
      ['archer', -10.5, 7.2],
      ['archer', 10.5, 7.2],
      ['cleric', -5.4, 8.8]
    ]
    for (const [type, x, z] of layout) {
      this.spawnUnit(type, 'player', new THREE.Vector3(x, 0, z), { silent: true, instant: true })
    }
    this.selectHero('aelric', true)
  }

  createTowers() {
    this.towerShots = [
      { position: new THREE.Vector3(-21.6, 13.4, 24.2), timer: 0 },
      { position: new THREE.Vector3(21.6, 13.4, 24.2), timer: 0 }
    ]
  }

  spawnUnit(type, team, position, opts = {}) {
    const stats = UNIT_STATS[type]
    if (!stats) throw new Error(`Unknown unit type ${type}`)
    const visual = createUnitModel(type, team, this.world.glow)
    const unit = {
      id: Math.random().toString(36).slice(2),
      type,
      team,
      name: type === 'boss' ? ENEMY_NAMES[type] : type,
      hp: stats.hp,
      maxHp: stats.hp,
      damage: stats.damage,
      range: stats.range,
      speed: stats.speed,
      attack: stats.attack,
      aggro: stats.aggro,
      radius: stats.radius,
      bounty: stats.bounty || 0,
      projectile: stats.projectile || null,
      healer: !!stats.healer,
      healRange: stats.healRange || 9,
      healAmount: stats.healAmount || 0,
      cleave: !!stats.cleave,
      isHero: !!stats.hero,
      isBoss: !!stats.boss,
      regen: stats.regen || 0,
      visual,
      position: new THREE.Vector3(position.x, groundHeightAt(position.x, position.z), position.z),
      attackTimer: Math.random() * stats.attack,
      acquireTimer: Math.random() * 0.3,
      attackAnim: 0,
      animOffset: Math.random() * Math.PI * 2,
      animTime: Math.random() * 10,
      moving: false,
      target: null,
      command: null,
      shield: 0,
      slowTimer: 0,
      slowFactor: 1,
      stunTimer: 0,
      burnTimer: 0,
      burnDps: 0,
      dead: false,
      selected: false,
      deathTimer: 0,
      respawnTimer: 0,
      gateOffsetX: (Math.random() - 0.5) * 8,
      spawnT: opts.instant ? 0 : 0.5,
      baseScale: 1,
      bossSlamTimer: 7,
      bossSummoned: false
    }
    visual.group.position.copy(unit.position)
    visual.group.rotation.y = team === 'player' ? Math.PI : 0
    this.scene.add(visual.group)
    attachUnit(visual, unit)
    unit.baseScale = visual.group.scale.x
    visual.radius = unit.radius
    unit.visual = visual
    if (unit.spawnT > 0) visual.group.scale.setScalar(unit.baseScale * 0.08)
    this.units.push(unit)
    if (team === 'player') {
      this.playerUnits.push(unit)
      if (type === 'aelric' || type === 'ysolde') this.heroUnits[type] = unit
    } else {
      this.enemyUnits.push(unit)
    }
    if (!opts.silent) {
      const color = team === 'player' ? '#ffe0a0' : '#b76bff'
      this.effects.ring(unit.position, { color, start: 0.3, end: 2.2, life: 0.5, opacity: 0.55 })
      this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 0.5, unit.position.z), {
        color,
        count: team === 'player' ? 10 : 14,
        speed: 2.4,
        size: 0.55,
        life: 0.65,
        gravity: -1,
        up: 1.4
      })
    }
    return unit
  }

  spawnWaveUnit(item) {
    const unit = this.spawnUnit(item.type, 'enemy', item.position, { instant: true })
    unit.attackTimer = Math.random() * unit.attack
    this.effects.ring(unit.position, { color: '#b76bff', start: 0.4, end: 3, life: 0.7, opacity: 0.7 })
    this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 0.8, unit.position.z), {
      color: '#a14dff',
      count: item.type === 'boss' ? 34 : 14,
      speed: item.type === 'boss' ? 8 : 4,
      size: item.type === 'boss' ? 1.2 : 0.7,
      life: 1.1,
      gravity: -0.5,
      up: 2
    })
    if (item.type === 'boss') {
      this.effects.flash()
      this.effects.shake(1.2, 0.7)
      this.audio.explosion(true)
      this.ui.announce('The Ashen King', 'Malgor Has Entered The Field', 'Break the crown. Break the tide.', 4.6)
      this.ui.feed('Malgor, the Ashen King, has entered the field.', 'warn')
      this.audio.horn(true)
    }
    return unit
  }

  begin() {
    if (this.started) return
    this.started = true
    this.audio.start()
    this.audio.horn(false)
    this.ui.begin()
    this.wave = 1
    this.waveState = 'prep'
    this.waveCountdown = 0.01
    this.cameraTarget.set(0, 0, 2)
    this.ui.feed('The Ashen host is sighted beyond the ridge.', 'warn')
    this.startWave()
  }

  startWave() {
    const wave = this.wave
    const info = WAVE_INFO[Math.min(wave - 1, WAVE_INFO.length - 1)]
    const plans = {
      1: [['skeleton', 7], ['ghoul', 3], ['wraith', 1], ['brute', 1]],
      2: [['skeleton', 8], ['ghoul', 5], ['wraith', 2], ['brute', 3]],
      3: [['skeleton', 8], ['ghoul', 6], ['wraith', 3], ['brute', 4], ['boss', 1]]
    }
    const entries = []
    let index = 0
    for (const [type, count] of plans[wave]) {
      for (let i = 0; i < count; i++) {
        let position
        if (wave === 1) {
          position = new THREE.Vector3(-10 + Math.random() * 20, 0, -5 - Math.random() * 6)
        } else if (wave === 2) {
          const portal = i % 3 === 1 ? FIELD.sidePortals[0] : i % 3 === 2 ? FIELD.sidePortals[1] : FIELD.portal
          position = new THREE.Vector3(portal.x + (Math.random() - 0.5) * 7, 0, portal.z + 2 + Math.random() * 5)
        } else {
          const portal = type === 'boss' ? FIELD.portal : this.portalPositions[index % this.portalPositions.length]
          position = new THREE.Vector3(portal.x + (Math.random() - 0.5) * (type === 'boss' ? 2 : 9), 0, portal.z + 3 + Math.random() * 7)
        }
        const delay = type === 'boss' ? 5.2 : (wave === 1 ? 0.05 : 0.15) + index * (wave === 1 ? 0.28 : 0.48) + Math.random() * 0.2
        entries.push({ type, position, time: delay })
        index++
      }
    }
    this.spawnQueue = entries
    this.wavePending = entries.length
    this.waveTotal = entries.length
    this.waveKilled = 0
    this.enemiesRemaining = entries.length
    this.waveState = wave === 3 ? 'boss' : 'active'
    this.ui.announce(info.kicker, info.title, info.subtitle, 4.4)
    this.ui.feed(`${info.title} has entered the Sundered Field.`, 'warn')
    if (wave === 3) {
      this.audio.horn(true)
      this.effects.flash()
    } else {
      this.audio.horn(false)
    }
  }

  processSpawnQueue(dt) {
    if (!this.spawnQueue.length) return
    for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
      const entry = this.spawnQueue[i]
      entry.time -= dt
      if (entry.time <= 0) {
        this.spawnWaveUnit(entry)
        this.spawnQueue.splice(i, 1)
        this.wavePending = Math.max(0, this.wavePending - 1)
      }
    }
    this.updateWaveCount()
  }

  updateWaveCount() {
    const living = this.enemyUnits.filter((unit) => !unit.dead).length
    this.enemiesRemaining = living + this.wavePending
    this.waveTotal = Math.max(this.waveTotal, this.waveKilled + this.enemiesRemaining)
  }

  grantReinforcements() {
    this.aether = Math.min(999, this.aether + 65)
    for (const unit of this.playerUnits) {
      if (unit.dead) continue
      unit.hp = Math.min(unit.maxHp, unit.hp + unit.maxHp * 0.28)
    }
    const living = this.playerUnits.filter((unit) => !unit.dead).length
    if (living + 2 <= this.unitCap) {
      for (let i = 0; i < 2; i++) {
        const unit = this.spawnUnit('footman', 'player', new THREE.Vector3(-4 + i * 4, 0, 13), { silent: true, instant: true })
        unit.visual.group.scale.setScalar(unit.baseScale * 0.1)
        unit.spawnT = 0.6
      }
    }
    this.effects.ring(FIELD.altar, { color: '#ffe0a0', start: 0.4, end: 8, life: 1.4, opacity: 0.6 })
    this.effects.burst(new THREE.Vector3(0, 1, 15.5), { color: '#ffe0a0', count: 24, speed: 3.5, size: 0.7, life: 1.2, gravity: -1, up: 3 })
    this.ui.feed('Dawn reinforcements arrive at the altar.', 'good')
    this.audio.heal()
  }

  recruit(type) {
    if (!this.started || this.ended) return
    const option = RECRUIT_OPTIONS.find((item) => item.type === type)
    if (!option) return
    const living = this.playerUnits.filter((unit) => !unit.dead).length
    if (living >= this.unitCap) {
      this.ui.feed('The Dawn ranks are at capacity.', 'warn')
      this.audio.click()
      return
    }
    if (this.aether < option.cost) {
      this.ui.feed('Not enough Aether to rally that warrior.', 'warn')
      this.audio.click()
      return
    }
    this.aether -= option.cost
    const position = new THREE.Vector3((Math.random() - 0.5) * 8, 0, 12.4 + Math.random() * 2)
    const unit = this.spawnUnit(type, 'player', position, { instant: true })
    unit.visual.group.scale.setScalar(unit.baseScale * 0.1)
    unit.spawnT = 0.55
    this.ui.feed(`${RECRUIT_INFO[type].name} joins the Dawn.`, 'good')
    this.audio.command()
  }

  selectHero(key, silent = false) {
    if (!HERO_INFO[key]) return
    this.selectedHero = key
    this.ui.setHero(key)
    const hero = this.heroUnits[key]
    if (hero && !hero.dead) {
      this.setSelection([hero])
      if (!silent) this.cameraTarget.set(hero.position.x, 0, hero.position.z)
    }
    if (!silent) this.audio.click()
  }

  setSelection(units) {
    for (const unit of this.selection) unit.selected = false
    this.selection = units.filter((unit) => unit && !unit.dead && unit.team === 'player')
    for (const unit of this.selection) unit.selected = true
    const hero = this.selection.find((unit) => unit.isHero && HERO_INFO[unit.type])
    if (hero) {
      this.selectedHero = hero.type
      this.ui.setHero(hero.type)
    }
  }

  addToSelection(unit) {
    if (!unit || unit.dead || unit.team !== 'player') return
    if (this.selection.includes(unit)) return
    this.selection.push(unit)
    unit.selected = true
    if (unit.isHero && HERO_INFO[unit.type]) {
      this.selectedHero = unit.type
      this.ui.setHero(unit.type)
    }
  }

  pickUnit(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect()
    this.raycaster.setFromCamera(new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    ), this.camera)
    const meshes = []
    for (const unit of this.units) {
      if (!unit.dead && unit.visual?.group) meshes.push(unit.visual.group)
    }
    const hits = this.raycaster.intersectObjects(meshes, true)
    if (!hits.length) return null
    let object = hits[0].object
    while (object && !object.userData.unit) object = object.parent
    return object?.userData.unit || null
  }

  handleClick(clientX, clientY, shift = false) {
    const unit = this.pickUnit(clientX, clientY)
    if (unit && unit.team === 'player' && !unit.dead) {
      if (shift) this.addToSelection(unit)
      else this.setSelection([unit])
      this.audio.click()
      return
    }
    if (unit && unit.team === 'enemy' && !unit.dead && this.selection.length) {
      this.updatePointerFromClient(clientX, clientY)
      this.commandSelected(this.mouseGround.clone(), unit)
      return
    }
    if (!shift) this.setSelection([])
  }

  selectInBox(rect, shift = false) {
    const picked = []
    for (const unit of this.playerUnits) {
      if (unit.dead) continue
      const p = screenProject(new THREE.Vector3(unit.position.x, unit.position.y + 0.9, unit.position.z), this.camera)
      if (!p.behind && p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h) {
        picked.push(unit)
      }
    }
    if (shift) {
      for (const unit of picked) this.addToSelection(unit)
    } else {
      this.setSelection(picked)
    }
    if (picked.length) this.audio.click()
  }

  updatePointerFromClient(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect()
    this.pointerNdc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    this.pointerClient.set(clientX, clientY)
    this.raycaster.setFromCamera(this.pointerNdc, this.camera)
    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.mouseGround)) {
      this.mouseGround.x = clamp(this.mouseGround.x, FIELD.minX, FIELD.maxX)
      this.mouseGround.z = clamp(this.mouseGround.z, FIELD.minZ, FIELD.maxZ)
      this.mouseGround.y = groundHeightAt(this.mouseGround.x, this.mouseGround.z)
    }
  }

  commandSelected(position, target = null, silent = false) {
    const living = this.selection.filter((unit) => !unit.dead)
    if (!living.length) return
    if (target && (target.dead || target.team !== 'enemy')) target = null
    const cols = Math.ceil(Math.sqrt(living.length))
    const spacing = 2.25
    living.forEach((unit, index) => {
      if (target) {
        unit.command = { type: 'attack', target }
        unit.target = target
      } else {
        const row = Math.floor(index / cols)
        const col = index % cols
        const offsetX = (col - (cols - 1) / 2) * spacing
        const offsetZ = row * spacing
        const dest = new THREE.Vector3(
          clamp(position.x + offsetX, FIELD.minX + 1, FIELD.maxX - 1),
          0,
          clamp(position.z + offsetZ, FIELD.minZ + 1, FIELD.maxZ - 1)
        )
        dest.y = groundHeightAt(dest.x, dest.z)
        unit.command = { type: 'move', position: dest }
        unit.target = null
      }
      unit.attackTimer = Math.min(unit.attackTimer, 0.15)
    })
    if (!silent) {
      this.effects.commandMarker(target ? target.position : position, target ? '#ff8a6a' : '#ffe0a0')
      this.audio.command()
    }
  }

  centerArmy() {
    const living = this.playerUnits.filter((unit) => !unit.dead)
    if (!living.length) {
      this.cameraTarget.set(0, 0, 6)
      return
    }
    let x = 0
    let z = 0
    for (const unit of living) {
      x += unit.position.x
      z += unit.position.z
    }
    this.cameraTarget.set(x / living.length, 0, z / living.length)
    this.audio.click()
  }

  setCameraFromMinimap(nx, ny) {
    if (!this.started) return
    this.cameraTarget.set(
      clamp(-46 + nx * 92, FIELD.minX, FIELD.maxX),
      0,
      clamp(-46 + ny * 72, FIELD.minZ, FIELD.maxZ)
    )
  }

  schedule(delay, fn) {
    this.timers.push({ time: delay, fn })
  }

  castAbility(index) {
    if (!this.started || this.ended) return
    const hero = this.heroUnits[this.selectedHero]
    const info = HERO_INFO[this.selectedHero]
    const ability = info.abilities[index]
    if (!ability) return
    if (!hero || hero.dead) {
      this.ui.feed(`${info.name} cannot answer the call.`, 'warn')
      this.audio.click()
      return
    }
    if (this.abilityCooldowns[this.selectedHero][index] > 0) {
      this.audio.click()
      return
    }
    const point = this.mouseGround.clone()
    if (ability.target === 'self') {
      point.copy(hero.position)
    } else {
      const delta = point.clone().sub(hero.position)
      delta.y = 0
      const distance = delta.length()
      if (distance < 0.2) {
        delta.set(0, 0, hero.team === 'player' ? -1 : 1)
      } else if (distance > ability.range) {
        delta.setLength(ability.range)
      }
      point.copy(hero.position).add(delta)
      point.y = groundHeightAt(point.x, point.z)
    }
    hero.visual.group.rotation.y = Math.atan2(point.x - hero.position.x, point.z - hero.position.z)
    hero.attackAnim = 0.36
    this.abilityCooldowns[this.selectedHero][index] = ability.cooldown
    this.heroCastEffect(this.selectedHero, ability.id, hero, point)
    this.audio.ability(ability.id === 'starfall' || ability.id === 'dawnbreaker' ? 'ultimate' : 'cast')
  }

  heroCastEffect(heroKey, abilityId, hero, point) {
    const enemies = this.enemyUnits.filter((unit) => !unit.dead)
    const allies = this.playerUnits.filter((unit) => !unit.dead)
    if (abilityId === 'sunder') {
      const direction = point.clone().sub(hero.position)
      direction.y = 0
      if (direction.lengthSq() < 0.01) direction.set(0, 0, -1)
      direction.normalize()
      this.effects.slash(hero.position, direction, '#ffd88b', 8.2)
      this.effects.shockwave(hero.position, { color: '#ffbd63', radius: 7.6, life: 0.55 })
      this.effects.burst(new THREE.Vector3(hero.position.x, hero.position.y + 1.2, hero.position.z), { color: '#ffe2a0', count: 28, speed: 7, size: 0.7, life: 0.7, gravity: 4, up: 2.2 })
      for (const enemy of enemies) {
        const to = enemy.position.clone().sub(hero.position)
        const distance = to.length()
        if (distance > 8.2) continue
        to.y = 0
        if (to.normalize().dot(direction) < -0.13) continue
        this.damageUnit(enemy, 118 + Math.random() * 28, hero, 'crit')
        enemy.stunTimer = Math.max(enemy.stunTimer, 0.35)
      }
      this.effects.shake(0.55, 0.3)
      this.audio.sword()
    } else if (abilityId === 'aegis') {
      this.effects.ring(hero.position, { color: '#ffe0a0', start: 0.5, end: 9, life: 1.1, opacity: 0.75 })
      this.effects.ring(hero.position, { color: '#fff4d2', start: 0.2, end: 6.2, life: 1.4, opacity: 0.6 })
      this.effects.burst(new THREE.Vector3(hero.position.x, hero.position.y + 1, hero.position.z), { color: '#ffe6a8', count: 38, speed: 4.2, size: 0.65, life: 1.3, gravity: -1.5, up: 4.2, spread: 1.2 })
      for (const ally of allies) {
        if (distXZ(ally.position, hero.position) > 9) continue
        this.healUnit(ally, ally.maxHp * 0.24, false)
        ally.shield = Math.max(ally.shield || 0, 110)
        ally.shieldTimer = 6
        this.effects.beam(new THREE.Vector3(hero.position.x, hero.position.y + 1.8, hero.position.z), new THREE.Vector3(ally.position.x, ally.position.y + 1.2, ally.position.z), '#ffe0a0', 0.1, 0.4)
      }
      this.audio.heal()
    } else if (abilityId === 'dawnbreaker') {
      this.effects.shockwave(hero.position, { color: '#ffd26f', radius: 10.5, life: 0.95 })
      this.effects.ring(hero.position, { color: '#fff2c8', start: 0.3, end: 12, life: 1.3, opacity: 0.8 })
      this.effects.burst(new THREE.Vector3(hero.position.x, hero.position.y + 2, hero.position.z), { color: '#ffe8a8', count: 72, speed: 11, size: 1.15, life: 1.5, gravity: 2.5, up: 6, spread: 2 })
      this.effects.flash(1)
      this.effects.shake(1.3, 0.6)
      for (const enemy of enemies) {
        if (distXZ(enemy.position, hero.position) > 9.6) continue
        this.damageUnit(enemy, 145 + Math.random() * 35, hero, 'crit')
        enemy.burnTimer = 4
        enemy.burnDps = 13
        enemy.stunTimer = Math.max(enemy.stunTimer, 0.5)
      }
      for (const ally of allies) {
        if (distXZ(ally.position, hero.position) > 9.6) continue
        this.healUnit(ally, ally.maxHp * 0.34, false)
        ally.shield = Math.max(ally.shield || 0, 70)
        ally.shieldTimer = 5
      }
      this.audio.explosion(true)
    } else if (abilityId === 'emberstorm') {
      this.effects.telegraph(point, '#ff8a45', 5.5, 1.1)
      this.effects.meteor(point, {
        color: '#ff7b3b',
        radius: 5.8,
        duration: 1.1,
        height: 27,
        onImpact: (impact) => {
          for (const enemy of this.enemyUnits) {
            if (enemy.dead) continue
            if (distXZ(enemy.position, impact) > 5.8) continue
            this.damageUnit(enemy, 115 + Math.random() * 25, hero, 'crit')
            enemy.burnTimer = 5
            enemy.burnDps = 15
          }
          this.audio.explosion(true)
        }
      })
      this.effects.shake(0.7, 0.4)
    } else if (abilityId === 'frostnova') {
      this.effects.telegraph(point, '#79d6e7', 6.4, 0.48)
      this.effects.shockwave(point, { color: '#8ff2ff', radius: 7, life: 0.8 })
      this.effects.ring(point, { color: '#d8ffff', start: 0.3, end: 8.2, life: 0.9, opacity: 0.8 })
      this.effects.burst(new THREE.Vector3(point.x, point.y + 0.8, point.z), { color: '#bff8ff', count: 46, speed: 8, size: 0.8, life: 1.1, gravity: 3, up: 4 })
      for (const enemy of enemies) {
        if (distXZ(enemy.position, point) > 6.4) continue
        this.damageUnit(enemy, 72 + Math.random() * 22, hero, 'crit')
        enemy.slowTimer = Math.max(enemy.slowTimer, 4.5)
        enemy.slowFactor = 0.42
        enemy.stunTimer = Math.max(enemy.stunTimer, 0.9)
      }
      this.audio.magic()
    } else if (abilityId === 'starfall') {
      this.effects.telegraph(point, '#ffcf7a', 8.8, 2.4)
      for (let i = 0; i < 5; i++) {
        const delay = i * 0.42
        this.schedule(delay, () => {
          if (!this.started) return
          const target = new THREE.Vector3(
            point.x + (Math.random() - 0.5) * 11,
            0,
            point.z + (Math.random() - 0.5) * 11
          )
          target.y = groundHeightAt(target.x, target.z)
          this.effects.telegraph(target, '#ffbd63', 3.6, 0.6)
          this.effects.meteor(target, {
            color: '#ffcf7a',
            radius: 4.2,
            duration: 0.8,
            height: 30,
            onImpact: (impact) => {
              for (const enemy of this.enemyUnits) {
                if (enemy.dead) continue
                if (distXZ(enemy.position, impact) > 4.3) continue
                this.damageUnit(enemy, 82 + Math.random() * 30, hero, 'crit')
                enemy.stunTimer = Math.max(enemy.stunTimer, 0.3)
              }
              this.audio.explosion(false)
            }
          })
        })
      }
      this.effects.flash(0.7)
    }
  }

  healUnit(unit, amount, showNumber = true) {
    if (!unit || unit.dead) return 0
    const before = unit.hp
    unit.hp = Math.min(unit.maxHp, unit.hp + amount)
    const healed = unit.hp - before
    if (healed > 1 && showNumber) {
      this.effects.damageNumber(new THREE.Vector3(unit.position.x, unit.position.y + 2.3, unit.position.z), `+${Math.round(healed)}`, 'heal')
    }
    if (healed > 1) {
      this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 1, unit.position.z), { color: '#a9e89f', count: 6, speed: 1.2, size: 0.35, life: 0.6, gravity: -1, up: 1.5 })
    }
    return healed
  }

  damageUnit(unit, amount, source = null, kind = 'hurt') {
    if (!unit || unit.dead) return
    let damage = amount
    if (unit.shield > 0) {
      const absorbed = Math.min(unit.shield, damage)
      unit.shield -= absorbed
      damage -= absorbed
      if (unit.shield <= 0) unit.shieldTimer = 0
    }
    if (damage <= 0) {
      this.effects.damageNumber(new THREE.Vector3(unit.position.x, unit.position.y + 2.1, unit.position.z), 'Ward', 'heal')
      return
    }
    unit.hp -= damage
    const display = Math.round(damage)
    this.effects.damageNumber(
      new THREE.Vector3(unit.position.x + (Math.random() - 0.5) * 0.6, unit.position.y + 2.1, unit.position.z),
      display,
      kind === 'crit' ? 'crit' : 'hurt'
    )
    this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 1.2, unit.position.z), {
      color: unit.team === 'enemy' ? '#ff8a6a' : '#ffd8a0',
      count: kind === 'crit' ? 12 : 5,
      speed: 2.2,
      size: 0.36,
      life: 0.45,
      gravity: 3,
      up: 1
    })
    if (unit.isHero) this.audio.heal()
    if (unit.hp <= 0) this.killUnit(unit, source)
  }

  killUnit(unit, source = null) {
    if (unit.dead) return
    unit.dead = true
    unit.hp = 0
    unit.selected = false
    unit.moving = false
    unit.target = null
    unit.command = null
    unit.deathTimer = 0
    unit.visual.selectionRing.visible = false
    unit.visual.bar.visible = false
    if (unit.team === 'enemy') {
      this.stats.kills++
      this.waveKilled++
      this.aether = Math.min(999, this.aether + unit.bounty)
      this.effects.soul(new THREE.Vector3(unit.position.x, unit.position.y + 1.2, unit.position.z), unit.isBoss ? '#ffca7a' : '#c48cff')
      this.audio.death()
      if (unit.isBoss) {
        this.bossDown = true
        this.effects.flash(1)
        this.effects.shake(1.6, 1.2)
        this.effects.shockwave(unit.position, { color: '#ffbd63', radius: 18, life: 1.6 })
        this.ui.announce('The Crown Is Broken', 'Malgor Has Fallen', 'The Ashen host scatters into embers.', 5)
        this.ui.feed('Malgor, the Ashen King, has fallen.', 'good')
        this.schedule(3.1, () => this.beginVictory())
      } else if (unit.type === 'brute') {
        this.ui.feed('An Ashen Brute is broken.', 'good')
      }
    } else {
      this.stats.lost++
      this.effects.soul(new THREE.Vector3(unit.position.x, unit.position.y + 1.2, unit.position.z), '#ffe0a0')
      this.audio.death()
      if (unit.isHero) {
        unit.respawnTimer = 20
        this.ui.feed(`${HERO_INFO[unit.type]?.name || 'A hero'} has fallen. The Dawn calls them back in 20s.`, 'warn')
        this.ui.announce('A Light Extinguished', `${HERO_INFO[unit.type]?.name || 'A Hero'} Has Fallen`, 'The Sunspire altar will call them home.', 3.5)
      } else {
        this.ui.feed(`A ${RECRUIT_INFO[unit.type]?.short || 'Dawn warrior'} has fallen.`, 'warn')
      }
      if (this.selection.includes(unit)) this.selection = this.selection.filter((item) => item !== unit)
    }
    this.updateWaveCount()
    this.checkWaveState()
  }

  beginVictory() {
    if (this.ended) return
    this.ended = true
    this.waveState = 'victory'
    this.stats.gate = this.gateHp
    this.audio.victory()
    this.effects.flash(1)
    this.effects.shake(0.8, 0.6)
    this.ui.showEnd('victory', this.stats)
  }

  beginDefeat() {
    if (this.ended) return
    this.ended = true
    this.waveState = 'defeat'
    this.gateHp = 0
    this.stats.gate = 0
    this.audio.defeat()
    this.effects.flash(0.8)
    this.effects.shake(1.4, 0.9)
    this.ui.showEnd('defeat', this.stats)
  }

  checkWaveState() {
    if (this.ended || this.waveState === 'cleared' || this.waveState === 'victory' || this.waveState === 'defeat') return
    const living = this.enemyUnits.filter((unit) => !unit.dead).length
    if (living > 0 || this.wavePending > 0) return
    if (this.wave >= 3) {
      if (this.bossDown) this.beginVictory()
      return
    }
    this.waveState = 'cleared'
    this.ui.announce('Wave Broken', 'The Dawn Holds', 'Reinforcements reach the altar. Ready the next stand.', 4)
    this.ui.feed('The wave is broken. The Dawn regroups.', 'good')
    this.grantReinforcements()
    this.schedule(4.2, () => {
      if (this.ended) return
      this.wave++
      this.waveState = 'prep'
      this.waveCountdown = 8
      this.ui.feed('A greater host gathers beyond the rift.', 'warn')
      this.audio.horn(false)
    })
  }

  reviveHero(unit) {
    unit.dead = false
    unit.hp = unit.maxHp
    unit.position.set(FIELD.altar.x + (unit.type === 'aelric' ? -2 : 2), 0, FIELD.altar.z + 1)
    unit.position.y = groundHeightAt(unit.position.x, unit.position.z)
    unit.visual.group.position.copy(unit.position)
    unit.visual.group.rotation.set(0, 0, 0)
    unit.visual.group.visible = true
    unit.visual.group.scale.setScalar(unit.baseScale * 0.1)
    unit.spawnT = 0.8
    unit.deathTimer = 0
    unit.respawnTimer = 0
    unit.shield = 80
    unit.shieldTimer = 4
    unit.burnTimer = 0
    unit.slowTimer = 0
    unit.slowFactor = 1
    unit.stunTimer = 0
    setUnitOpacity(unit.visual, 1)
    this.effects.ring(unit.position, { color: '#ffe0a0', start: 0.4, end: 6, life: 1.2, opacity: 0.75 })
    this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 1, unit.position.z), { color: '#ffe6a8', count: 30, speed: 4, size: 0.7, life: 1.2, gravity: -1, up: 3.5 })
    this.ui.announce('The Dawn Answers', `${HERO_INFO[unit.type]?.name || 'A Hero'} Returns`, "The altar's light restores the fallen.", 3)
    this.ui.feed(`${HERO_INFO[unit.type]?.name || 'A hero'} has returned to the field.`, 'good')
    this.audio.heal()
  }

  updateTimers(dt) {
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const timer = this.timers[i]
      timer.time -= dt
      if (timer.time <= 0) {
        this.timers.splice(i, 1)
        timer.fn()
      }
    }
  }

  updateCooldowns(dt) {
    for (const key of ['aelric', 'ysolde']) {
      const list = this.abilityCooldowns[key]
      for (let i = 0; i < list.length; i++) list[i] = Math.max(0, list[i] - dt)
    }
  }

  updateWaves(dt) {
    if (this.ended) return
    this.aether = Math.min(999, this.aether + this.aetherRate * dt)
    if (this.waveState === 'prep') {
      this.waveCountdown -= dt
      if (this.waveCountdown <= 0) {
        this.waveCountdown = 0
        this.startWave()
      }
    }
    if (this.waveState === 'active' || this.waveState === 'boss') {
      this.updateWaveCount()
      if (!this.enemyUnits.some((unit) => !unit.dead) && this.wavePending === 0) {
        this.checkWaveState()
      }
    }
  }

  updateTowers(dt) {
    if (this.ended) return
    for (const tower of this.towerShots) {
      tower.timer -= dt
      if (tower.timer > 0) continue
      let nearest = null
      let best = 34
      for (const enemy of this.enemyUnits) {
        if (enemy.dead) continue
        const distance = distXZ(enemy.position, tower.position)
        if (distance < best) {
          best = distance
          nearest = enemy
        }
      }
      if (!nearest) {
        tower.timer = 0.3
        continue
      }
      tower.timer = 1.15 + Math.random() * 0.2
      const from = tower.position.clone()
      this.effects.spawnProjectile({
        from,
        target: nearest,
        color: '#ffd88b',
        kind: 'bolt',
        speed: 36,
        size: 0.2,
        onHit: (target) => {
          this.damageUnit(target, 40 + Math.random() * 10, null, 'crit')
          this.effects.burst(new THREE.Vector3(target.position.x, target.position.y + 1.2, target.position.z), { color: '#ffe0a0', count: 8, speed: 2.5, size: 0.4, life: 0.4, gravity: 2, up: 1 })
        }
      })
      this.audio.arrow()
    }
  }

  updateUnits(dt) {
    this.gateUnderAttack = false
    for (const unit of this.units) {
      if (unit.dead) {
        this.updateDeath(unit, dt)
        continue
      }
      if (unit.spawnT > 0) {
        unit.spawnT = Math.max(0, unit.spawnT - dt)
        const k = 1 - unit.spawnT / 0.6
        unit.visual.group.scale.setScalar(unit.baseScale * (0.1 + 0.9 * Math.min(1, k + 0.1)))
      } else if (unit.visual.group.scale.x !== unit.baseScale) {
        unit.visual.group.scale.setScalar(unit.baseScale)
      }
      if (unit.shieldTimer > 0) {
        unit.shieldTimer -= dt
        if (unit.shieldTimer <= 0) unit.shield = 0
      }
      if (unit.burnTimer > 0) {
        unit.burnTimer -= dt
        unit.hp -= unit.burnDps * dt
        if (Math.random() < dt * 5) {
          this.effects.burst(new THREE.Vector3(unit.position.x, unit.position.y + 1 + Math.random(), unit.position.z), { color: '#ff8a45', count: 1, speed: 0.8, size: 0.4, life: 0.4, gravity: -1, up: 1 })
        }
        if (unit.hp <= 0) {
          this.killUnit(unit, null)
          continue
        }
      }
      if (unit.slowTimer > 0) {
        unit.slowTimer -= dt
        if (unit.slowTimer <= 0) unit.slowFactor = 1
      }
      if (unit.stunTimer > 0) unit.stunTimer -= dt
      if (unit.regen > 0 && unit.hp < unit.maxHp) {
        unit.hp = Math.min(unit.maxHp, unit.hp + unit.regen * dt)
      }
      unit.attackTimer = Math.max(0, unit.attackTimer - dt)
      unit.moving = false
      if (!this.ended && unit.spawnT <= 0) this.updateUnitAI(unit, dt)
      unit.position.y = groundHeightAt(unit.position.x, unit.position.z)
      unit.visual.group.position.copy(unit.position)
      animateUnit(unit, dt, this.elapsed, this.camera)
    }
    this.applySeparation()
  }

  updateDeath(unit, dt) {
    unit.deathTimer += dt
    const t = unit.deathTimer
    if (t < 1.1) {
      unit.visual.group.rotation.z = Math.min(1.45, t * 4.2)
      unit.visual.group.position.y = unit.position.y - Math.min(0.35, t * 0.4)
      unit.visual.group.scale.setScalar(unit.baseScale * Math.max(0.35, 1 - t * 0.45))
    } else {
      unit.visual.group.visible = false
    }
    if (unit.isHero) {
      unit.respawnTimer = Math.max(0, unit.respawnTimer - dt)
      if (unit.respawnTimer <= 0) this.reviveHero(unit)
    }
  }

  moveUnitToward(unit, destination, dt) {
    const dx = destination.x - unit.position.x
    const dz = destination.z - unit.position.z
    const distance = Math.hypot(dx, dz)
    if (distance < 0.12) return true
    const step = unit.speed * (unit.slowFactor || 1) * dt
    const nx = dx / distance
    const nz = dz / distance
    const travel = Math.min(distance, step)
    unit.position.x = clamp(unit.position.x + nx * travel, FIELD.minX + 0.8, FIELD.maxX - 0.8)
    unit.position.z = clamp(unit.position.z + nz * travel, FIELD.minZ + 0.8, FIELD.maxZ)
    unit.visual.group.rotation.y = angleLerp(unit.visual.group.rotation.y, Math.atan2(nx, nz), 1 - Math.exp(-11 * dt))
    unit.moving = true
    return distance <= step + 0.12
  }

  faceTarget(unit, target, dt) {
    const dx = target.position.x - unit.position.x
    const dz = target.position.z - unit.position.z
    if (Math.abs(dx) + Math.abs(dz) > 0.01) {
      unit.visual.group.rotation.y = angleLerp(unit.visual.group.rotation.y, Math.atan2(dx, dz), 1 - Math.exp(-14 * dt))
    }
  }

  findNearest(unit, list, radius) {
    let nearest = null
    let best = radius
    for (const other of list) {
      if (other.dead) continue
      const distance = distXZ(unit.position, other.position)
      if (distance < best) {
        best = distance
        nearest = other
      }
    }
    return nearest
  }

  updateUnitAI(unit, dt) {
    if (unit.target && unit.target.dead) {
      unit.target = null
      if (unit.command?.type === 'attack') unit.command = null
    }
    if (unit.command?.type === 'attack' && unit.command.target?.dead) unit.command = null
    if (unit.stunTimer > 0) return

    if (unit.healer) {
      unit.acquireTimer -= dt
      let patient = null
      let bestRatio = 0.98
      for (const ally of this.playerUnits) {
        if (ally.dead || ally === unit) continue
        const ratio = ally.hp / ally.maxHp
        if (ratio < bestRatio && distXZ(ally.position, unit.position) <= unit.healRange) {
          bestRatio = ratio
          patient = ally
        }
      }
      if (patient) {
        this.faceTarget(unit, patient, dt)
        if (unit.attackTimer <= 0) {
          this.healUnit(patient, unit.healAmount)
          unit.attackTimer = unit.attack
          unit.attackAnim = 0.36
          this.effects.beam(
            new THREE.Vector3(unit.position.x, unit.position.y + 1.6, unit.position.z),
            new THREE.Vector3(patient.position.x, patient.position.y + 1.2, patient.position.z),
            '#b8f5a4', 0.12, 0.4
          )
          this.audio.heal()
        }
        return
      }
    }

    if (unit.command?.type === 'move') {
      const arrived = this.moveUnitToward(unit, unit.command.position, dt)
      if (arrived) unit.command = null
      return
    }

    if (unit.command?.type === 'attack' && unit.command.target) {
      unit.target = unit.command.target
    }

    if (!unit.target) {
      unit.acquireTimer -= dt
      if (unit.acquireTimer <= 0) {
        unit.acquireTimer = 0.22 + Math.random() * 0.16
        const enemies = unit.team === 'player' ? this.enemyUnits : this.playerUnits
        unit.target = this.findNearest(unit, enemies, unit.aggro)
      }
    }

    if (unit.target && !unit.target.dead) {
      const target = unit.target
      const distance = distXZ(unit.position, target.position)
      if (unit.team === 'player' && !unit.isHero && distance > unit.aggro * 2.1 && unit.command?.type !== 'attack') {
        unit.target = null
        return
      }
      if (distance <= unit.range + target.radius * 0.35) {
        this.faceTarget(unit, target, dt)
        if (unit.attackTimer <= 0) {
          unit.attackTimer = unit.attack
          this.executeAttack(unit, target)
        }
      } else {
        this.moveUnitToward(unit, target.position, dt)
      }
      return
    }

    if (unit.team === 'enemy') {
      const gateDistance = distXZ(unit.position, FIELD.gate)
      if (gateDistance <= 4.3) {
        unit.visual.group.rotation.y = angleLerp(unit.visual.group.rotation.y, 0, 1 - Math.exp(-10 * dt))
        if (unit.attackTimer <= 0) {
          unit.attackTimer = unit.attack
          this.attackGate(unit)
        }
      } else {
        const destination = new THREE.Vector3(unit.gateOffsetX, 0, FIELD.gate.z - 2.2)
        this.moveUnitToward(unit, destination, dt)
      }
    }
  }

  executeAttack(unit, target) {
    unit.attackAnim = 0.36
    const direction = target.position.clone().sub(unit.position)
    direction.y = 0
    if (direction.lengthSq() < 0.01) direction.set(0, 0, 1)
    direction.normalize()
    if (unit.projectile) {
      const colors = {
        arrow: '#ffe2a0',
        arcane: '#8ff2ff',
        shadow: '#c48cff'
      }
      const color = colors[unit.projectile] || '#ffe2a0'
      this.effects.spawnProjectile({
        from: new THREE.Vector3(unit.position.x, unit.position.y + 1.5, unit.position.z),
        target,
        color,
        kind: unit.projectile === 'arrow' ? 'arrow' : 'bolt',
        speed: unit.projectile === 'arrow' ? 32 : 22,
        size: unit.type === 'ysolde' ? 0.3 : 0.2,
        onHit: (hit) => {
          this.damageUnit(hit, unit.damage, unit, unit.isHero ? 'crit' : 'hurt')
          if (unit.type === 'ysolde') {
            hit.burnTimer = Math.max(hit.burnTimer, 1.6)
            hit.burnDps = 6
          }
          if (unit.type === 'wraith') {
            hit.slowTimer = Math.max(hit.slowTimer, 1.4)
            hit.slowFactor = 0.72
          }
        }
      })
      if (unit.projectile === 'arrow') this.audio.arrow()
      else this.audio.magic()
    } else {
      const color = unit.team === 'player' ? '#ffe0a0' : '#ff7d5f'
      this.effects.slash(unit.position, direction, color, unit.isBoss ? 4.8 : unit.cleave ? 3.4 : 2.2)
      this.damageUnit(target, unit.damage, unit, unit.isHero ? 'crit' : 'hurt')
      if (unit.cleave) {
        const enemies = unit.team === 'player' ? this.enemyUnits : this.playerUnits
        for (const enemy of enemies) {
          if (enemy === target || enemy.dead) continue
          if (distXZ(enemy.position, target.position) < 2.7) {
            this.damageUnit(enemy, unit.damage * 0.55, unit, 'hurt')
          }
        }
      }
      this.audio.sword()
    }
  }

  attackGate(unit) {
    unit.attackAnim = 0.36
    this.gateHp = Math.max(0, this.gateHp - unit.damage * 0.78)
    this.gateUnderAttack = true
    const impact = new THREE.Vector3(unit.position.x, 2.4, FIELD.gate.z - 1)
    this.effects.burst(impact, { color: '#ffb469', count: 10, speed: 3, size: 0.5, life: 0.55, gravity: 3, up: 1.5 })
    if (Math.random() < 0.35) this.effects.damageNumber(impact, Math.round(unit.damage * 0.78), 'hurt')
    if (Math.random() < 0.5) this.effects.shake(0.25, 0.18)
    this.audio.gateHit()
    if (this.gateHp <= 0) this.beginDefeat()
  }

  applySeparation() {
    const units = this.units
    for (let i = 0; i < units.length; i++) {
      const a = units[i]
      if (a.dead || a.spawnT > 0) continue
      for (let j = i + 1; j < units.length; j++) {
        const b = units[j]
        if (b.dead || b.spawnT > 0 || a.team !== b.team) continue
        const dx = b.position.x - a.position.x
        const dz = b.position.z - a.position.z
        const distance = Math.hypot(dx, dz)
        const min = (a.radius + b.radius) * 0.82
        if (distance >= min || distance < 0.001) continue
        const push = (min - distance) * 0.5
        const nx = dx / distance
        const nz = dz / distance
        a.position.x -= nx * push
        a.position.z -= nz * push
        b.position.x += nx * push
        b.position.z += nz * push
      }
    }
    for (const unit of units) {
      if (unit.dead) continue
      unit.position.x = clamp(unit.position.x, FIELD.minX + 0.8, FIELD.maxX - 0.8)
      unit.position.z = clamp(unit.position.z, FIELD.minZ + 0.8, FIELD.maxZ)
      unit.position.y = groundHeightAt(unit.position.x, unit.position.z)
      unit.visual.group.position.x = unit.position.x
      unit.visual.group.position.z = unit.position.z
      unit.visual.group.position.y = unit.position.y
    }
  }

  updateCamera(dt) {
    if (!this.started) {
      const yaw = Math.PI - 0.55 + Math.sin(this.elapsed * 0.055) * 0.22
      const pitch = 0.4
      const distance = 76
      const target = new THREE.Vector3(0, 3.2, 8.5)
      const offset = new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitch) * distance,
        Math.sin(pitch) * distance,
        Math.cos(yaw) * Math.cos(pitch) * distance
      )
      this.camera.position.copy(target).add(offset)
      this.camera.lookAt(target.x, target.y + 1.2, target.z + 2)
      return
    }

    const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw))
    const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw))
    const pan = new THREE.Vector3()
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) pan.add(forward)
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) pan.sub(forward)
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) pan.add(right)
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) pan.sub(right)
    if (pan.lengthSq() > 0) {
      pan.normalize().multiplyScalar((this.keys.has('ShiftLeft') ? 36 : 23) * dt)
      this.cameraTarget.add(pan)
      this.cameraTarget.x = clamp(this.cameraTarget.x, FIELD.minX + 3, FIELD.maxX - 3)
      this.cameraTarget.z = clamp(this.cameraTarget.z, FIELD.minZ + 3, FIELD.maxZ + 2)
    }
    if (this.keys.has('KeyQ')) this.cameraYaw += dt * 1.15
    if (this.keys.has('KeyE')) this.cameraYaw -= dt * 1.15

    const desiredLook = new THREE.Vector3(this.cameraTarget.x, 1.5, this.cameraTarget.z)
    this.smoothedLook.lerp(desiredLook, 1 - Math.exp(-7.5 * dt))
    const offset = new THREE.Vector3(
      Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance,
      Math.sin(this.cameraPitch) * this.cameraDistance,
      Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance
    )
    const shake = this.effects.getShakeOffset(this.elapsed)
    this.camera.position.copy(this.smoothedLook).add(offset)
    this.camera.position.x += shake.x
    this.camera.position.y += shake.y
    this.camera.position.z += shake.z
    this.camera.lookAt(this.smoothedLook)
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
      if (!this.started && event.code === 'Enter') {
        this.begin()
        return
      }
      this.keys.add(event.code)
      if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault()
      if (!this.started) return
      if (event.code === 'Digit1') this.castAbility(0)
      else if (event.code === 'Digit2') this.castAbility(1)
      else if (event.code === 'Digit3') this.castAbility(2)
      else if (event.code === 'KeyZ') this.recruit('footman')
      else if (event.code === 'KeyX') this.recruit('archer')
      else if (event.code === 'KeyC') this.recruit('knight')
      else if (event.code === 'KeyV') this.recruit('cleric')
      else if (event.code === 'KeyR') this.centerArmy()
      else if (event.code === 'KeyM') {
        const muted = !this.audio.muted
        this.audio.setMuted(muted)
        this.ui.el['mute-button'].textContent = muted ? 'Sound Off' : 'Sound On'
      } else if (event.code === 'Space') {
        this.selectHero(this.selectedHero, true)
        this.centerArmy()
      } else if (event.code === 'Escape') {
        this.setSelection([])
      }
    })
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code)
    })
    window.addEventListener('blur', () => this.keys.clear())

    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.started) return
      this.updatePointerFromClient(event.clientX, event.clientY)
      if (event.button === 0) {
        this.drag = {
          startX: event.clientX,
          startY: event.clientY,
          x: event.clientX,
          y: event.clientY,
          shift: event.shiftKey
        }
      } else if (event.button === 2) {
        event.preventDefault()
        const unit = this.pickUnit(event.clientX, event.clientY)
        if (unit && unit.team === 'enemy' && !unit.dead) this.commandSelected(this.mouseGround.clone(), unit)
        else this.commandSelected(this.mouseGround.clone())
      } else if (event.button === 1) {
        event.preventDefault()
        this.middleDrag = { x: event.clientX, y: event.clientY, yaw: this.cameraYaw, pitch: this.cameraPitch }
      }
    })

    window.addEventListener('pointermove', (event) => {
      if (event.target === this.canvas || this.drag || this.middleDrag) {
        this.updatePointerFromClient(event.clientX, event.clientY)
      }
      if (this.drag) {
        this.drag.x = event.clientX
        this.drag.y = event.clientY
        const x = Math.min(this.drag.startX, this.drag.x)
        const y = Math.min(this.drag.startY, this.drag.y)
        const w = Math.abs(this.drag.x - this.drag.startX)
        const h = Math.abs(this.drag.y - this.drag.startY)
        if (w > 5 || h > 5) this.ui.showSelectionBox({ x, y, w, h })
      }
      if (this.middleDrag) {
        this.cameraYaw = this.middleDrag.yaw - (event.clientX - this.middleDrag.x) * 0.006
        this.cameraPitch = clamp(this.middleDrag.pitch + (event.clientY - this.middleDrag.y) * 0.004, 0.5, 1.25)
      }
    })

    window.addEventListener('pointerup', (event) => {
      if (this.drag && event.button === 0) {
        const drag = this.drag
        this.drag = null
        this.ui.showSelectionBox(null)
        const moved = Math.hypot(drag.x - drag.startX, drag.y - drag.startY)
        if (moved > 7) {
          this.selectInBox({
            x: Math.min(drag.startX, drag.x),
            y: Math.min(drag.startY, drag.y),
            w: Math.abs(drag.x - drag.startX),
            h: Math.abs(drag.y - drag.startY)
          }, drag.shift)
        } else {
          this.handleClick(event.clientX, event.clientY, drag.shift)
        }
      }
      if (event.button === 1) this.middleDrag = null
    })

    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault())
    this.canvas.addEventListener('wheel', (event) => {
      if (!this.started) return
      event.preventDefault()
      this.cameraDistance = clamp(this.cameraDistance + event.deltaY * 0.035, 34, 94)
    }, { passive: false })
  }

  bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(1)
      this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    })
  }

  frame() {
    const now = performance.now()
    const dt = Math.min(0.35, (now - this.lastFrame) / 1000)
    this.lastFrame = now
    this.elapsed += dt
    if (this.started && !this.ended) this.stats.time += dt
    this.world.update(dt, this.elapsed)
    if (this.started) {
      this.updateTimers(dt)
      this.processSpawnQueue(dt)
      this.updateCooldowns(dt)
      this.updateWaves(dt)
      if (!this.ended) this.updateTowers(dt)
    }
    this.updateUnits(dt)
    this.effects.update(dt, this.elapsed)
    this.updateCamera(dt)
    if (this.started) this.ui.update(this, dt, this.camera)
    this.renderer.render(this.scene, this.camera)
  }
}

const game = new Game()
window.__emberfall = game

