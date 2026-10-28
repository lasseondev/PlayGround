import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Mall } from '../world/Mall.js'
import { Input } from './Input.js'
import { Player } from '../player/Player.js'
import { Weapon } from '../player/Weapon.js'
import { Partner } from '../entities/Partner.js'
import { Effects } from '../systems/Effects.js'
import { AudioSystem } from '../systems/Audio.js'
import { Waves } from '../systems/Waves.js'
import { HUD } from '../ui/HUD.js'

const _v = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _q = new THREE.Quaternion()

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uGrain: { value: 0.032 },
    uVignette: { value: 0.85 },
    uAberration: { value: 0.0011 }
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uResolution;
    uniform float uGrain; uniform float uVignette; uniform float uAberration;
    varying vec2 vUv;
    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 uv = vUv;
      float ca = uAberration;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;
      float d = distance(uv, vec2(0.5));
      float vig = smoothstep(0.86, 0.28, d);
      col *= mix(1.0, vig, uVignette);
      float g = rand(uv * uResolution + fract(uTime) * 431.7) - 0.5;
      col += g * uGrain;
      col *= 0.985 + 0.015 * rand(vec2(uTime, 1.0));
      gl_FragColor = vec4(col, 1.0);
    }`
}

export class Game {
  constructor() {
    this.state = 'loading'
    this.time = 0
    this.menuTime = 0
    this.wave = 1
    this.score = 0
    this.kills = 0
    this.partnerKills = 0
    this.mode = 'coop'
    this.zombies = []
    this.pickups = []
    this.grenades = []
    this.settings = { sensitivity: 1, volume: 0.8, quality: 'auto', invertY: false }
    this.loadSettings()
    this.sensitivity = this.settings.sensitivity
    this.deathTimer = 0
    this.elapsed = 0
    this.shotsFired = 0
    this.shotsHit = 0
    this.qualityLevel = 'high'
    this.setupRenderer()
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x070a0f)
    this.scene.fog = new THREE.FogExp2(0x0a0e15, 0.0125)
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.045, 220)
    this.camera.rotation.order = 'YXZ'
    this.scene.add(this.camera)

    this.audio = new AudioSystem()
    this.audio.volume = this.settings.volume
    this.audio.gameCamera = this.camera
    this.hud = new HUD(this)
    this.input = new Input(this.renderer.domElement)
    this.input.enabled = false

    this.effects = new Effects(this)
    this.mall = new Mall(this)
    this.scene.add(this.mall.group)
    this.mall.group.traverse(o => { if (o.isMesh && o.userData.impact) this.mall.impactMeshes.push(o) })

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const envScene = new RoomEnvironment()
    this.scene.environment = pmrem.fromScene(envScene, 0.04).texture
    this.scene.environmentIntensity = 0.42
    pmrem.dispose()

    this.player = new Player(this)
    this.weapon = new Weapon(this)
    this.partnerObject = new Partner(this)
    this.partner = this.partnerObject
    this.waves = new Waves(this)

    this.setupComposer()
    this.setupUI()
    this.applyQuality(this.settings.quality, true)
    this.resetRun('coop')
    this.enterMenu(true)
    this.bindEvents()
    this.clock = new THREE.Clock()
    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem('motd-settings')
      if (raw) Object.assign(this.settings, JSON.parse(raw))
    } catch {}
  }
  saveSettings() {
    try { localStorage.setItem('motd-settings', JSON.stringify(this.settings)) } catch {}
    this.sensitivity = this.settings.sensitivity
    this.audio.setVolume(this.settings.volume)
  }

  setupRenderer() {
    const canvas = document.createElement('canvas')
    canvas.id = 'game-canvas'
    canvas.tabIndex = 0
    document.getElementById('viewport').appendChild(canvas)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6))
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const gl = this.renderer.getContext()
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const name = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : ''
    this.gpuName = String(name || '')
    this.softwareRenderer = /swiftshader|llvmpipe|software|basic render/i.test(this.gpuName)
  }

  setupComposer() {
    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(this.renderPass)
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.52, 0.62, 0.82)
    this.composer.addPass(this.bloom)
    this.vignette = new ShaderPass(VignetteShader)
    this.vignette.uniforms.uResolution.value.set(innerWidth, innerHeight)
    this.composer.addPass(this.vignette)
    this.output = new OutputPass()
    this.composer.addPass(this.output)
  }

  applyQuality(level, silent = false) {
    const auto = level === 'auto'
    const low = level === 'low' || (auto && this.softwareRenderer)
    this.qualityLevel = low ? 'low' : 'high'
    this.renderer.setPixelRatio(low ? 1 : Math.min(devicePixelRatio, 1.6))
    this.bloom.strength = low ? 0.34 : 0.52
    this.bloom.radius = low ? 0.5 : 0.62
    this.renderer.shadowMap.enabled = !low
    this.mall.moonLight.castShadow = !low
    if (this.mall.moonLight.shadow) this.mall.moonLight.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048)
    this.scene.traverse(o => { if (o.material) { const mats = Array.isArray(o.material) ? o.material : [o.material]; for (const m of mats) m.needsUpdate = true } })
    this.hud.setQuality(low ? (this.softwareRenderer ? 'SOFTWARE / PERFORMANCE' : 'PERFORMANCE') : 'HIGH')
    if (!silent) this.saveSettings()
  }

  setupUI() {
    const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn)
    on('btn-play', () => this.startGame('coop'))
    on('btn-solo', () => this.startGame('solo'))
    on('btn-help', () => this.openModal('help'))
    on('btn-help-close', () => this.closeModal('help'))
    on('help-done', () => this.closeModal('help'))
    on('btn-options', () => this.openModal('options'))
    on('options-close', () => this.closeModal('options'))
    on('options-done', () => this.closeModal('options'))
    on('btn-pause-help', () => this.openModal('help'))
    on('btn-resume', () => this.resume())
    on('btn-restart', () => { this.closeModal('pause'); this.startGame(this.mode) })
    on('btn-quit', () => { this.closeModal('pause'); this.enterMenu() })
    on('btn-redeploy', () => { document.getElementById('gameover').classList.add('hidden'); this.startGame(this.mode) })
    on('btn-gameover-quit', () => { document.getElementById('gameover').classList.add('hidden'); this.enterMenu() })

    const sens = document.getElementById('opt-sens')
    const sensOut = document.getElementById('opt-sens-out')
    sens.value = this.settings.sensitivity
    sensOut.textContent = Number(this.settings.sensitivity).toFixed(2)
    sens.addEventListener('input', () => {
      this.settings.sensitivity = Number(sens.value)
      sensOut.textContent = Number(sens.value).toFixed(2)
      this.sensitivity = Number(sens.value)
      this.saveSettings()
    })
    const vol = document.getElementById('opt-vol')
    const volOut = document.getElementById('opt-vol-out')
    vol.value = this.settings.volume
    volOut.textContent = `${Math.round(this.settings.volume * 100)}%`
    vol.addEventListener('input', () => {
      this.settings.volume = Number(vol.value)
      volOut.textContent = `${Math.round(vol.value * 100)}%`
      this.saveSettings()
    })
    const qual = document.getElementById('opt-quality')
    qual.value = this.settings.quality
    qual.addEventListener('change', () => {
      this.settings.quality = qual.value
      this.applyQuality(qual.value)
      this.saveSettings()
    })
    const inv = document.getElementById('opt-invert')
    inv.checked = Boolean(this.settings.invertY)
    inv.addEventListener('change', () => { this.settings.invertY = inv.checked; this.saveSettings() })

    document.getElementById('rotate')?.classList.add('hidden')
  }

  openModal(id) {
    document.getElementById(id)?.classList.remove('hidden')
    if (this.state === 'playing') { this.input.releaseLock() }
  }
  closeModal(id) {
    document.getElementById(id)?.classList.add('hidden')
    if (this.state === 'playing' && !this.input.pointerLocked) this.input.requestLock()
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize())
    document.addEventListener('pointerlockchange', () => {
      this.input.pointerLocked = document.pointerLockElement === this.renderer.domElement
      if (!this.input.pointerLocked && this.state === 'playing' && !this.starting) this.pause()
    })
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.state === 'playing') { this.pause() }
        else if (this.state === 'paused') { this.resume() }
        else {
          for (const id of ['help', 'options']) this.closeModal(id)
        }
      }
      if (e.code === 'KeyM' && this.state === 'playing') {
        this.audio.setVolume(this.settings.volume > 0 ? 0 : 0.8)
        this.settings.volume = this.audio.volume
        this.saveSettings()
      }
    })
    this.renderer.domElement.addEventListener('click', () => {
      if (this.state === 'playing' && !this.input.pointerLocked) this.input.requestLock()
    })
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause()
    })
  }

  onResize() {
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth, innerHeight)
    this.composer.setSize(innerWidth, innerHeight)
    this.vignette.uniforms.uResolution.value.set(innerWidth, innerHeight)
    this.bloom.setSize(innerWidth, innerHeight)
  }

  resetRun(mode) {
    this.mode = mode
    this.zombies.forEach(z => z.remove())
    this.zombies.length = 0
    this.pickups.forEach(p => this.scene.remove(p.group))
    this.pickups.length = 0
    this.grenades.forEach(g => this.scene.remove(g.mesh))
    this.grenades.length = 0
    this.effects.reset()
    this.score = 0
    this.kills = 0
    this.partnerKills = 0
    this.elapsed = 0
    this.shotsFired = 0
    this.shotsHit = 0
    this.deathTimer = 0
    this.player.reset()
    this.weapon.refillAll()
    this.weapon.equip('rifle', true)
    this.weapon.root.visible = true
    this.partner = mode === 'coop' ? this.partnerObject : null
    this.partnerObject.group.visible = mode === 'coop'
    if (mode === 'coop') this.partnerObject.reset()
    this.hud.reset()
    this.hud.setScore(0, 0)
    this.hud.setGrenades(this.player.grenades)
    this.hud.setWeapon(this.weapon)
    this.hud.updateVitals(this.player)
    this.hud.updatePartner(this.partner)
    this.waves.number = 0
    this.waves.state = 'idle'
    this.wave = 1
  }

  startGame(mode) {
    this.audio.init()
    this.audio.setVolume(this.settings.volume)
    this.resetRun(mode)
    this.menuEl = document.getElementById('menu')
    this.menuEl.classList.add('out')
    document.getElementById('help')?.classList.add('hidden')
    document.getElementById('options')?.classList.add('hidden')
    this.hud.show()
    this.hud.setScore(0, 0)
    this.state = 'playing'
    this.starting = true
    this.input.enabled = true
    this.player.applyCamera(0, true)
    this.camera.fov = 75
    this.camera.updateProjectionMatrix()
    this.input.requestLock()
    setTimeout(() => { this.starting = false }, 450)
    this.waves.reset()
    this.elapsed = 0
    setTimeout(() => {
      if (this.state === 'playing') {
        this.hud.subtitle('ROOK', this.mode === 'coop' ? 'On me. Keep the atrium clear and watch the escalators.' : 'No partner, no backup. Stay mobile.', 3.4)
      }
    }, 1400)
  }

  enterMenu(initial = false) {
    this.state = 'menu'
    this.input.enabled = false
    this.input.releaseLock()
    this.weapon.root.visible = false
    this.partnerObject.group.visible = false
    this.player.flashlight.visible = false
    this.hud.hide()
    document.getElementById('pause')?.classList.add('hidden')
    document.getElementById('gameover')?.classList.add('hidden')
    const menu = document.getElementById('menu')
    menu.classList.remove('out')
    this.menuTime = 0
    this.zombies.forEach(z => z.remove())
    this.zombies.length = 0
    this.pickups.forEach(p => this.scene.remove(p.group))
    this.pickups.length = 0
    if (!initial) {
      this.audio.setVolume(this.settings.volume)
      this.audio.ambGain && (this.audio.ambGain.gain.value = 0.13)
    }
  }

  pause() {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this.input.enabled = false
    this.input.mouse.left = this.input.mouse.right = false
    document.getElementById('pause').classList.remove('hidden')
    this.input.releaseLock()
  }

  resume() {
    if (this.state !== 'paused') return
    document.getElementById('pause').classList.add('hidden')
    this.state = 'playing'
    this.input.enabled = true
    this.input.requestLock()
    this.clock.getDelta()
  }

  onPlayerDeath() {
    if (this.state !== 'playing') return
    this.state = 'dying'
    this.deathTimer = 0
    this.input.enabled = false
    this.input.releaseLock()
    this.hud.subtitle('ROOK', 'No... no, get up!', 2.6)
    this.audio.playDeath(this.player.pos, 'brute')
    this.hud.hide()
    setTimeout(() => {
      if (this.state !== 'dying') return
      this.state = 'gameover'
      this.input.enabled = false
      const seconds = Math.floor(this.elapsed)
      const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
      this.hud.showGameover({
        wave: this.wave,
        kills: this.kills,
        headshots: this.player.stats.headshots,
        accuracy: this.shotsFired ? Math.round(this.shotsHit / this.shotsFired * 100) : 0,
        score: this.score,
        time,
        copy: this.mode === 'coop' ? 'Rook is still in there. The mall keeps its guests.' : 'No partner. No backup. The mall keeps its guests.'
      })
    }, 1900)
  }

  addKill(zombie, head, byPartner = false) {
    this.kills++
    if (byPartner) {
      this.partnerKills++
      this.addScore(Math.round(zombie.def.score * 0.6), false)
    } else {
      this.player.stats.kills++
      this.addScore(Math.round(zombie.def.score * (head ? 1.6 : 1)), false)
    }
    this.hud.setScore(this.score, this.kills)
  }

  addScore(amount, updateHud = true) {
    this.score += amount
    if (updateHud) this.hud.setScore(this.score, this.kills)
  }

  fireHitscan(origin, dir, def, weapon) {
    this.raycaster = this.raycaster || new THREE.Raycaster()
    this.raycaster.set(origin, dir)
    this.raycaster.far = def.range
    const roots = []
    for (const z of this.zombies) if (!z.removed && z.state !== 'dead') roots.push(z.group)
    const zhits = roots.length ? this.raycaster.intersectObjects(roots, true) : []
    const whits = this.mall.impactMeshes.length ? this.raycaster.intersectObjects(this.mall.impactMeshes, false) : []
    let zh = null
    for (const h of zhits) {
      const z = h.object.userData.zombie
      if (!z || z.state === 'dead' || z.removed) continue
      if (h.object.userData.part === 'head' && z.headless) continue
      zh = h
      break
    }
    const wh = whits[0]
    if (zh && (!wh || zh.distance < wh.distance)) {
      const z = zh.object.userData.zombie
      const part = zh.object.userData.part || 'torso'
      const mult = part === 'head' ? def.headMult : part === 'torso' ? 1 : def.limbMult
      const dmg = def.damage * mult * (0.92 + Math.random() * 0.16)
      this.shotsHit++
      const res = z.takeDamage(dmg, part, zh.point, dir, 'player')
      if (res.head) this.hud.hitmarker(true, res.dead)
      return { hit: true, head: res.head, kill: res.dead, point: zh.point, normal: zh.face?.normal || dir.clone().negate() }
    }
    if (wh) {
      this.effects.spawnImpact(wh.point, wh.face?.normal || dir.clone().negate())
      this.audio.noiseHit({ duration: 0.06, freq: 2600, freqEnd: 500, gain: 0.09, send: true })
      return { hit: false, point: wh.point }
    }
    return { hit: false, point: origin.clone().addScaledVector(dir, 80) }
  }

  spawnPickup(type, pos) {
    const group = new THREE.Group()
    const glowCol = type === 'health' ? 0x59ff9a : type === 'ammo' ? 0xffc15a : 0x7ad9ff
    let mesh
    if (type === 'health') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 0.34), new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.55 }))
      box.position.y = 0.25; group.add(box)
      const crossMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, toneMapped: false })
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.012), crossMat); c1.position.set(0, 0.25, 0.176); group.add(c1)
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.012), crossMat); c2.position.set(0, 0.25, 0.176); group.add(c2)
      mesh = box
    } else if (type === 'ammo') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.32), new THREE.MeshStandardMaterial({ color: 0x3c4a35, roughness: 0.7, metalness: 0.2 }))
      box.position.y = 0.22; group.add(box)
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.34), new THREE.MeshBasicMaterial({ color: 0xffb347, toneMapped: false }))
      band.position.y = 0.25; group.add(band)
      mesh = box
    } else {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0x405040, roughness: 0.45, metalness: 0.5 }))
      ball.position.y = 0.25; ball.scale.set(1, 1.2, 1); group.add(ball)
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.06, 10), new THREE.MeshBasicMaterial({ color: 0x7ad9ff, toneMapped: false }))
      band.position.y = 0.28; group.add(band)
      mesh = ball
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.effects.glowTex, color: glowCol, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.set(1.2, 1.2, 1); glow.position.y = 0.4; group.add(glow)
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.46, 24), new THREE.MeshBasicMaterial({ color: glowCol, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }))
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; group.add(ring)
    group.position.set(pos.x, 0, pos.z)
    this.scene.add(group)
    const pickup = { group, type, age: 0, baseY: 0, ring, glow }
    this.pickups.push(pickup)
    return pickup
  }

  spawnIntermissionPickups() {
    for (const p of this.pickups) this.scene.remove(p.group)
    this.pickups.length = 0
    const spots = [
      { type: 'ammo', x: 6.5, z: 22 },
      { type: 'health', x: -6.5, z: 16 },
      { type: 'ammo', x: -5, z: -14 },
      { type: 'health', x: 7, z: -20 },
      { type: 'grenade', x: 0, z: 9 }
    ]
    for (const s of spots) this.spawnPickup(s.type, s)
  }

  collectPickup(p) {
    const idx = this.pickups.indexOf(p)
    if (idx < 0) return
    this.pickups.splice(idx, 1)
    this.scene.remove(p.group)
    if (p.type === 'health') {
      const before = this.player.health
      this.player.heal(45)
      this.audio.playHeal()
      this.hud.subtitle('', `+${Math.round(this.player.health - before)} HEALTH`, 1.2)
    } else if (p.type === 'ammo') {
      this.weapon.addAmmo(1)
      this.audio.playPickup()
      this.hud.subtitle('', 'AMMO RESUPPLIED', 1.2)
      this.hud.setWeapon(this.weapon)
    } else {
      this.player.addGrenade(1)
      this.audio.playPickup()
      this.hud.subtitle('', '+1 FRAG GRENADE', 1.2)
    }
  }

  throwGrenade() {
    const geo = new THREE.SphereGeometry(0.09, 10, 8)
    const mat = new THREE.MeshStandardMaterial({ color: 0x3b4a38, roughness: 0.5, metalness: 0.35 })
    const mesh = new THREE.Mesh(geo, mat)
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion)
    mesh.position.copy(this.camera.position).addScaledVector(dir, 0.45)
    mesh.position.y -= 0.1
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 6, 14), new THREE.MeshBasicMaterial({ color: 0xff6a4a, toneMapped: false }))
    band.rotation.x = Math.PI / 2; mesh.add(band)
    const light = new THREE.PointLight(0xff6a4a, 3, 3, 2)
    mesh.add(light)
    this.scene.add(mesh)
    this.grenades.push({
      mesh,
      vel: dir.clone().multiplyScalar(13).add(new THREE.Vector3(0, 2.6, 0)).add(new THREE.Vector3(this.player.velocity.x * 0.5, 0, this.player.velocity.z * 0.5)),
      fuse: 2.3,
      light,
      bounces: 0
    })
  }

  updateGrenades(dt) {
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i]
      g.fuse -= dt
      g.vel.y -= 15 * dt
      const old = g.mesh.position.clone()
      g.mesh.position.addScaledVector(g.vel, dt)
      g.mesh.rotation.x += dt * 5
      g.mesh.rotation.z += dt * 7
      if (g.mesh.position.y < 0.1) {
        g.mesh.position.y = 0.1
        if (g.vel.y < -1) { g.vel.y *= -0.42; g.vel.x *= 0.72; g.vel.z *= 0.72; this.audio.playClick(); g.bounces++ }
        else { g.vel.y = 0; g.vel.x *= 0.92; g.vel.z *= 0.92 }
      }
      const test = g.mesh.position.clone()
      this.mall.collide(test, 0.1)
      if (test.distanceToSquared(g.mesh.position) > 1e-5) {
        g.mesh.position.x = test.x; g.mesh.position.z = test.z
        g.vel.x *= -0.45; g.vel.z *= -0.45
      }
      g.light.intensity = 2.2 + (Math.sin(this.time * 30) * 0.5 + 0.5) * 1.8
      if (g.fuse <= 0) {
        this.explodeGrenade(g)
        this.scene.remove(g.mesh)
        this.grenades.splice(i, 1)
      }
    }
  }

  explodeGrenade(g) {
    const pos = g.mesh.position.clone()
    this.effects.spawnExplosion(pos)
    this.audio.playExplosion(pos)
    this.player.addShake(0.9)
    for (const z of this.zombies) {
      if (z.state === 'dead' || z.removed) continue
      const d = Math.hypot(z.pos.x - pos.x, z.pos.z - pos.z)
      if (d < 7) {
        const falloff = Math.max(0.15, 1 - d / 7)
        const dir = new THREE.Vector3(z.pos.x - pos.x, 0.3, z.pos.z - pos.z).normalize()
        const res = z.takeDamage(200 * falloff, 'torso', new THREE.Vector3(z.pos.x, 1, z.pos.z), dir, 'player')
        this.shotsHit++
        if (res.dead) this.hud.hitmarker(false, true)
      }
    }
    const pd = Math.hypot(this.player.pos.x - pos.x, this.player.pos.z - pos.z)
    if (pd < 4.5) {
      this.player.addShake(1)
      this.player.damage(8 * (1 - pd / 4.5), pos)
    }
  }

  updatePickups(dt) {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i]
      p.age += dt
      p.group.position.y = Math.sin(this.time * 2 + i) * 0.05
      p.group.rotation.y += dt * 0.8
      p.ring.rotation.z += dt * 0.6
      p.glow.material.opacity = 0.42 + Math.sin(this.time * 4 + i) * 0.12
      if (p.age > 0.4 && this.player.state === 'alive') {
        const d = Math.hypot(this.player.pos.x - p.group.position.x, this.player.pos.z - p.group.position.z)
        if (d < 1.55) this.collectPickup(p)
      }
    }
  }

  updateInteract() {
    let show = false, label = ''
    if (this.partner && this.partner.down) {
      const d = Math.hypot(this.player.pos.x - this.partner.pos.x, this.player.pos.z - this.partner.pos.z)
      if (d < 2.4) { show = true; label = 'REVIVE ROOK' }
      else { show = true; label = 'ROOK IS DOWN' }
    }
    this.hud.interact(show, label)
  }

  update(dt) {
    this.time += dt
    if (this.state === 'menu') {
      this.menuTime += dt
      const t = this.menuTime
      const cam = this.camera
      const drift = Math.sin(t * 0.08)
      cam.position.set(5.6 + drift * 1.4, 4.15 + Math.sin(t * 0.13) * 0.12, 29 - Math.sin(t * 0.05) * 2.2)
      cam.lookAt(-3.2 + Math.sin(t * 0.045) * 2.4, 6.3 + Math.sin(t * 0.07) * 0.4, -30)
      cam.fov = 66
      cam.updateProjectionMatrix()
      this.mall.update(dt, this.time)
      this.effects.update(dt)
      this.audio.update(dt, this)
      this.render(dt)
      return
    }

    if (this.state === 'playing') {
      this.elapsed += dt
      this.mall.update(dt, this.time)
      this.player.update(dt, this.input)
      this.weapon.update(dt, this.input, this.player)
      if (this.partner) this.partner.update(dt, this.input)
      for (const z of this.zombies) z.update(dt)
      this.waves.update(dt)
      this.effects.update(dt)
      this.updateGrenades(dt)
      this.updatePickups(dt)
      this.audio.update(dt, this)
      this.hud.updateVitals(this.player)
      this.hud.updatePartner(this.partner)
      this.hud.updateCrosshair(this.player, this.weapon)
      this.hud.updateCompass(this.player.yaw)
      this.hud.setScore(this.score, this.kills)
      this.updateInteract()
      this.input.endFrame()
      this.starting = false
    } else if (this.state === 'paused') {
      this.mall.update(dt * 0.12, this.time)
      this.effects.update(dt * 0.12)
      this.audio.update(dt * 0.05, this)
    } else if (this.state === 'dying') {
      this.deathTimer += dt
      this.mall.update(dt, this.time)
      this.effects.update(dt)
      this.updateGrenades(dt)
      for (const z of this.zombies) z.update(dt * 0.35)
      this.audio.update(dt, this)
      const p = Math.min(1, this.deathTimer / 1.7)
      this.camera.rotation.z = THREE.MathUtils.lerp(0, 1.15, p * p)
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 0.55, p * 0.2)
      this.hud.updateVitals(this.player)
    } else if (this.state === 'gameover') {
      this.mall.update(dt, this.time)
      this.effects.update(dt)
      this.audio.update(dt * 0.4, this)
    }
    this.render(dt)
  }

  render(dt) {
    if (this.vignette) this.vignette.uniforms.uTime.value = this.time
    this.composer.render(dt)
  }

  loop() {
    requestAnimationFrame(this.loop)
    const dt = Math.min(0.05, this.clock.getDelta())
    this.update(dt)
  }
}
