import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createMall } from './world.js'
import { Particles } from './particles.js'
import { AudioFX } from './audio.js'
import { ZombieManager } from './zombies.js'
import { Player } from './player.js'
import { Ally } from './ally.js'

await document.fonts.ready

const $ = (id) => document.getElementById(id)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// ------------------------------------------------------------------ renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(1)
const RENDER_SCALE = 0.82
renderer.setSize(Math.floor(window.innerWidth * RENDER_SCALE), Math.floor(window.innerHeight * RENDER_SCALE), false)
renderer.domElement.style.width = '100%'
renderer.domElement.style.height = '100%'
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.35
$('app').appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x05080c)
scene.fog = new THREE.FogExp2(0x070c12, 0.0125)

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.03, 180)

let world
try {
  world = createMall(scene)
} catch (err) {
  console.error('Mall construction failed', err)
  world = { colliders: [], bounds: { minX: -34, maxX: 34, minZ: -43, maxZ: 43 }, spawnPoints: [{ x: 0, z: -40 }], storeRects: [], update: () => {}, lights: {} }
}

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth * 0.82, window.innerHeight * 0.82), 0.48, 0.45, 0.8)
composer.addPass(bloom)
composer.addPass(new OutputPass())

const particles = new Particles(scene)
const audio = new AudioFX()

// ------------------------------------------------------------------ state
const S = {
  mode: 'menu',
  started: false,
  wave: 0,
  active: false,
  intermission: 4.5,
  queue: [],
  spawnTimer: 0,
  score: 0,
  best: Number(localStorage.getItem('motd-best') || 0),
  combo: 0,
  comboTimer: 0,
  kills: 0,
  headshots: 0,
  over: false,
  time: 0,
  waveTotal: 0,
  suppressPause: true,
  reviveHold: 0,
  flash: 0,
  minimapTick: 0,
  calloutCd: 0,
  lastAllyCall: 0,
  stats: { waves: 0 }
}

const input = {
  forward: false, back: false, left: false, right: false,
  sprint: false, jump: false, fire: false, aim: false, revive: false
}

const player = new Player(camera, scene, audio, particles, world, {
  onHit: (info) => onHit(info),
  onDamage: (amount, from) => onPlayerDamage(amount, from),
  onDowned: () => onPlayerDowned(),
  onRevived: () => onPlayerRevived(),
  onDeath: () => onPlayerDeath(),
  onGrenade: (origin, dir) => spawnGrenade(origin, dir),
  getZombies: () => zombieManager.zombies
})
player.setActive(false)
player.camera.fov = 62

let zombieManager
const ally = new Ally(scene, audio, particles, world, {
  onDowned: () => onAllyDowned(),
  onRevived: () => onAllyRevived(),
  onDeath: () => onAllyDeath(),
  onRevivePlayer: () => onPlayerRevived(),
  onKill: () => {}
})
ally.setActive(false)

zombieManager = new ZombieManager(scene, particles, audio, world, {
  onKilled: (z, headshot, source) => onZombieKilled(z, headshot, source)
})

// ------------------------------------------------------------------ menu ambience
const menuZombies = [
  [0, -17, 'walker'], [-8, -10, 'walker'], [7, -14, 'runner'],
  [14, -22, 'walker'], [-15, -25, 'walker'], [3, 6, 'walker'], [-20, 4, 'brute']
]
for (const [x, z, type] of menuZombies) {
  const zz = zombieManager.spawn(type, { x, z })
  zz.state = 'alive'
  zz.pos.y = 0
  zz.group.rotation.y = Math.random() * Math.PI * 2
}

// ------------------------------------------------------------------ DOM
const dom = {
  hud: $('hud'), menu: $('menu'), pause: $('pause'), gameover: $('gameover'),
  hpFill: $('hp-fill'), hpNumber: $('hp-number'), stamina: $('stamina-fill'),
  allyFill: $('ally-fill'), novaState: $('nova-state'), allySub: $('ally-sub'),
  waveLabel: $('wave-label'), zombiesLeft: $('zombies-left'), waveProgress: $('wave-progress-fill'),
  score: $('score'), streak: $('streak'), best: $('best'),
  minimap: $('minimap'), ammoMag: $('ammo-mag'), ammoReserve: $('ammo-reserve'),
  weaponName: $('weapon-name'), reloadFill: $('reload-fill'),
  slot1: $('slot-1'), slot2: $('slot-2'), nadeCount: $('nade-count'),
  statusLine: $('status-line'), objective: $('objective-text'),
  killfeed: $('killfeed'), crosshair: $('crosshair'), hitmarker: $('hitmarker'),
  damageFlash: $('damage-flash'), lowHealth: $('low-health'),
  banner: $('banner'), bannerKicker: $('banner-kicker'), bannerTitle: $('banner-title'), bannerSub: $('banner-sub'),
  subtitle: $('subtitle'), speaker: $('speaker'), subtitleText: $('subtitle-text'),
  interact: $('interact'), interactLabel: $('interact-label'), interactFill: $('interact-fill'),
  downed: $('downed'), downedSub: $('downed-sub'),
  loading: $('loading'),
  overKicker: $('over-kicker'), overTitle: $('over-title'), overSub: $('over-sub'),
  statWave: $('stat-wave'), statKills: $('stat-kills'), statHeads: $('stat-heads'), statScore: $('stat-score')
}
$('best').textContent = String(S.best).padStart(6, '0')

const btnDeploy = $('deploy')
btnDeploy.addEventListener('click', () => {
  audio.init()
  audio.ui()
  startGame()
})
$('resume').addEventListener('click', () => resumeGame())
$('quit').addEventListener('click', () => { document.exitPointerLock?.(); location.reload() })
$('redeploy').addEventListener('click', () => { document.exitPointerLock?.(); location.reload() })

const canvas = renderer.domElement

function requestLock() {
  if (document.pointerLockElement === canvas) return
  try {
    const p = canvas.requestPointerLock?.()
    if (p && p.catch) p.catch(() => {})
  } catch (e) { /* pointer lock can be blocked by the host */ }
}

// ------------------------------------------------------------------ input
const keyMap = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  ShiftLeft: 'sprint', ShiftRight: 'sprint',
  Space: 'jump',
  KeyE: 'revive'
}
window.addEventListener('keydown', (e) => {
  if (e.repeat) {
    if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) e.preventDefault()
    return
  }
  const k = keyMap[e.code]
  if (k) { input[k] = true; if (e.code === 'Space') e.preventDefault() }
  if (S.mode === 'playing') {
    if (e.code === 'KeyR') player.startReload()
    if (e.code === 'KeyG') player.throwGrenade()
    if (e.code === 'KeyV') player.melee()
    if (e.code === 'Digit1') player.switchWeapon('rifle')
    if (e.code === 'Digit2') player.switchWeapon('shotgun')
  }
  if (e.code === 'Escape') {
    if (S.mode === 'playing') pauseGame()
    else if (S.mode === 'paused') resumeGame()
  }
})
window.addEventListener('keyup', (e) => {
  const k = keyMap[e.code]
  if (k) input[k] = false
})
window.addEventListener('blur', () => {
  for (const k in input) input[k] = false
})

document.addEventListener('mousemove', (e) => {
  if (S.mode !== 'playing' || document.pointerLockElement !== canvas) return
  player.mouseDX += e.movementX || 0
  player.mouseDY += e.movementY || 0
})
canvas.addEventListener('mousedown', (e) => {
  if (S.mode !== 'playing') return
  if (e.button === 0) {
    input.fire = true
    if (document.pointerLockElement !== canvas) requestLock()
  }
  if (e.button === 2) input.aim = true
})
window.addEventListener('mouseup', (e) => {
  if (e.button === 0) input.fire = false
  if (e.button === 2) input.aim = false
})
canvas.addEventListener('contextmenu', (e) => e.preventDefault())

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    S.suppressPause = false
  } else if (S.mode === 'playing' && !S.suppressPause) {
    pauseGame()
  }
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(1)
  renderer.setSize(Math.floor(window.innerWidth * RENDER_SCALE), Math.floor(window.innerHeight * RENDER_SCALE), false)
  composer.setSize(Math.floor(window.innerWidth * RENDER_SCALE), Math.floor(window.innerHeight * RENDER_SCALE))
  bloom.setSize(Math.floor(window.innerWidth * RENDER_SCALE), Math.floor(window.innerHeight * RENDER_SCALE))
})

// ------------------------------------------------------------------ game flow
function startGame() {
  if (S.started) return
  S.started = true
  S.mode = 'playing'
  S.suppressPause = true
  S.intermission = 4.5
  S.wave = 0
  S.active = false
  S.queue = []
  S.score = 0
  S.combo = 0
  S.kills = 0
  S.headshots = 0
  S.flash = 0
  S.reviveHold = 0

  dom.menu.classList.add('leaving')
  setTimeout(() => dom.menu.classList.add('hidden'), 780)
  dom.hud.classList.remove('hidden')
  dom.pause.classList.add('hidden')
  dom.gameover.classList.add('hidden')
  dom.loading.classList.add('done')
  setTimeout(() => dom.loading.classList.add('hidden'), 800)

  zombieManager.clear()
  for (let i = pickups.length - 1; i >= 0; i--) removePickup(pickups[i], false)
  for (let i = grenades.length - 1; i >= 0; i--) { scene.remove(grenades[i].mesh); grenades.splice(i, 1) }

  player.reset()
  player.setActive(true)
  ally.reset()
  ally.setActive(true)

  // a pair of stragglers already loose in the atrium
  for (const pt of [{ x: -9, z: 4 }, { x: 9, z: 4 }]) {
    const z = zombieManager.spawn('walker', pt)
    z.state = 'alive'
    z.spawnT = 1
    z.pos.y = 0
  }

  camera.fov = 76
  camera.updateProjectionMatrix()

  audio.init()
  audio.siren()
  requestLock()

  showBanner('OPERATION LAST LIGHT', 'WAVE 01', 'STRAYS IN THE ATRIUM · HOLD POSITION', 3200)
  say('NOVA', 'Squad link is green. I have the east lane — you take the atrium.', 3800)
  notify('STRAYS DETECTED · CLEAR THE ATRIUM')
}

function pauseGame() {
  if (S.mode !== 'playing') return
  S.mode = 'paused'
  input.fire = false
  input.aim = false
  dom.pause.classList.remove('hidden')
  dom.hud.classList.add('hidden')
  audio.setMuffle(true)
  document.exitPointerLock?.()
}
function resumeGame() {
  if (S.mode !== 'paused') return
  dom.pause.classList.add('hidden')
  dom.hud.classList.remove('hidden')
  S.mode = 'playing'
  S.suppressPause = true
  audio.setMuffle(false)
  requestLock()
}
function endGame(victory) {
  if (S.over) return
  S.over = true
  S.mode = 'over'
  input.fire = false
  document.exitPointerLock?.()
  audio.setMuffle(true)
  if (victory) {
    dom.overKicker.textContent = 'MISSION COMPLETE'
    dom.overTitle.textContent = 'EXTRACTED'
    dom.overSub.textContent = `Ten waves held. Westgate Plaza is quiet — for now.`
    audio.pickup()
    audio.siren()
  } else {
    dom.overKicker.textContent = 'SIGNAL LOST'
    dom.overTitle.textContent = 'SQUAD LOST'
    dom.overSub.textContent = ally.alive ? 'Nova could not reach you in time.' : 'The plaza claims another squad.'
  }
  dom.statWave.textContent = String(Math.max(1, S.wave)).padStart(2, '0')
  dom.statKills.textContent = String(S.kills)
  dom.statHeads.textContent = String(S.headshots)
  dom.statScore.textContent = String(S.score)
  if (S.score > S.best) {
    S.best = S.score
    localStorage.setItem('motd-best', String(S.best))
  }
  dom.gameover.classList.remove('hidden')
}

// ------------------------------------------------------------------ waves
function startWave() {
  S.wave++
  S.active = true
  S.stats.waves = S.wave
  const total = 5 + S.wave * 3
  const types = []
  for (let i = 0; i < total; i++) {
    if (S.wave >= 3 && i % 8 === 7) types.push('brute')
    else if (S.wave >= 2 && Math.random() < Math.min(0.46, 0.1 + S.wave * 0.055)) types.push('runner')
    else types.push('walker')
  }
  S.queue = types
  S.spawnTimer = 1.2
  S.waveTotal = total + zombieManager.countAlive()
  const sub = S.wave >= 3 ? 'BRUTE SIGNATURE DETECTED' : 'ESCALATING INFECTION'
  showBanner(`WAVE ${String(S.wave).padStart(2, '0')}`, 'INCOMING', sub, 2600)
  audio.siren()
  if (S.wave === 1) say('NOVA', 'Contact! North atrium, multiple infected. Weapons free.', 3200)
  else if (S.wave === 2) say('NOVA', 'They brought runners. Don\'t let them flank us.', 3000)
  else if (S.wave === 3) say('NOVA', 'Heavy signature — brutes inbound. Aim for the head.', 3200)
  else say('NOVA', `Wave ${S.wave}. Keep the lanes tight.`, 2600)
}

function spawnFromQueue() {
  if (!S.queue.length) return
  if (zombieManager.countAlive() >= Math.min(22, 10 + S.wave * 2)) return
  const type = S.queue.shift()
  let point = null
  for (let tries = 0; tries < 10; tries++) {
    const p = world.spawnPoints[Math.floor(Math.random() * world.spawnPoints.length)]
    const d = Math.hypot(p.x - player.pos.x, p.z - player.pos.z)
    if (d > 10 && (d < 30 || tries === 9)) { point = p; break }
  }
  zombieManager.spawn(type, point || world.spawnPoints[0])
  S.particlesDust = true
}

function waveCleared() {
  S.active = false
  S.intermission = 15
  S.score += 300 * S.wave
  const bonus = 300 * S.wave
  showBanner(`WAVE ${String(S.wave).padStart(2, '0')}`, 'CLEARED', `+${bonus} SQUAD BONUS · SUPPLIES INBOUND`, 3400)
  audio.pickup()
  spawnPickup(7, 12, 'supply')
  if (S.wave >= 10) {
    setTimeout(() => endGame(true), 2200)
    say('NOVA', 'That\'s the last of them. Extraction is on the roof. We made it.', 4200)
  } else {
    say('NOVA', 'Atrium secure. Grab the cache and reload — they will come again.', 3400)
  }
  notify('WAVE BONUS +' + bonus)
}

function updateWaves(dt) {
  if (!S.started || S.mode !== 'playing') return
  if (!S.active) {
    S.intermission -= dt
    if (S.intermission <= 0) {
      startWave()
    }
    return
  }
  const cap = Math.min(22, 10 + S.wave * 2)
  if (S.queue.length && zombieManager.countAlive() < cap) {
    S.spawnTimer -= dt
    if (S.spawnTimer <= 0) {
      spawnFromQueue()
      S.spawnTimer = Math.max(0.42, 1.5 - S.wave * 0.07) * (0.75 + Math.random() * 0.5)
    }
  }
  if (!S.queue.length && zombieManager.countAlive() === 0) waveCleared()
}

// ------------------------------------------------------------------ combat callbacks
function onHit(info) {
  dom.hitmarker.classList.remove('show')
  void dom.hitmarker.offsetWidth
  dom.hitmarker.classList.add('show')
  dom.hitmarker.classList.toggle('head', !!info.headshot)
  setTimeout(() => dom.hitmarker.classList.remove('show'), 240)
}

function onPlayerDamage(amount, from) {
  S.flash = Math.min(1, S.flash + 0.45 + amount * 0.02)
  audio.hurt()
}

function onPlayerDowned() {
  dom.downed.classList.remove('hidden')
  dom.downedSub.textContent = ally.alive && !ally.downed ? 'NOVA IS EN ROUTE — HOLD ON' : 'NO SQUADMATE IN RANGE'
  say('NOVA', ally.alive && !ally.downed ? 'Rivera is down! I\'m moving to you — hold on!' : 'Rivera is down. I can\'t reach you...', 3600)
  audio.alarm()
}

function onPlayerRevived() {
  dom.downed.classList.add('hidden')
  showBanner('SQUAD LINK', 'REVIVED', 'GET BACK IN THE FIGHT', 2000)
  say('NOVA', 'Up you go. Stay with me.', 2400)
  audio.pickup()
  player.inputFireGuard = true
}

function onPlayerDeath() {
  if (S.mode === 'over') return
  S.mode = 'dying'
  dom.downed.classList.add('hidden')
  say('NOVA', 'No... no, stay with me! Rivera!', 2600)
  setTimeout(() => endGame(false), 1700)
}

function onAllyDowned() {
  say('NOVA', 'I\'m hit — I\'m down! Get to me, Rivera!', 3400)
  notify('SQUADMATE DOWN · HOLD E TO REVIVE')
  audio.alarm()
}
function onAllyRevived() {
  showBanner('SQUAD LINK', 'NOVA ONLINE', 'BACK IN THE FIGHT', 2000)
  say('NOVA', 'Back on my feet. Let\'s move.', 2400)
  audio.pickup()
}
function onAllyDeath() {
  say('NOVA', 'Squad link... lost...', 2800)
  notify('SQUADMATE LOST · SURVIVE ALONE')
  audio.alarm()
}

function onZombieKilled(z, headshot, source) {
  S.combo++
  S.comboTimer = 4
  const mult = Math.min(3, 1 + (S.combo - 1) * 0.07)
  const base = z.type === 'brute' ? 600 : z.type === 'runner' ? 150 : 100
  const gained = Math.round(base * mult * (headshot ? 1.5 : 1))
  S.score += gained
  S.kills++
  if (headshot) S.headshots++
  if (S.score > S.best) { S.best = S.score; localStorage.setItem('motd-best', String(S.best)) }
  addKillfeed(z.type, headshot, source)
  if (source === player) player.registerKill(headshot)
  if (Math.random() < (z.type === 'brute' ? 0.6 : 0.16)) {
    spawnPickup(z.pos.x, z.pos.z, Math.random() < 0.55 ? 'ammo' : 'health')
  }
}

// ------------------------------------------------------------------ kill feed / HUD messages
function addKillfeed(type, headshot, source) {
  const item = document.createElement('div')
  item.className = 'kill-item' + (headshot ? ' hs' : '')
  const who = source === player ? 'RIVERA' : source === ally ? 'NOVA' : 'SQUAD'
  const label = type === 'brute' ? 'BRUTE' : type === 'runner' ? 'RUNNER' : 'WALKER'
  item.innerHTML = `<b>${who}</b><span>${label}</span>${headshot ? '<span class="hs-tag">HEADSHOT</span>' : '<span class="hs-tag" style="color:#8fa2ad">ELIMINATED</span>'}`
  dom.killfeed.appendChild(item)
  setTimeout(() => item.classList.add('out'), 3000)
  setTimeout(() => item.remove(), 3450)
  while (dom.killfeed.children.length > 5) dom.killfeed.firstChild.remove()
}

let bannerTimer = 0
function showBanner(kicker, title, sub, ms = 2600) {
  dom.bannerKicker.textContent = kicker
  dom.bannerTitle.textContent = title
  dom.bannerSub.textContent = sub
  dom.banner.classList.add('show')
  clearTimeout(bannerTimer)
  bannerTimer = setTimeout(() => dom.banner.classList.remove('show'), ms)
}

let subtitleTimer = 0
function say(speaker, text, ms = 2800) {
  dom.speaker.textContent = speaker
  dom.subtitleText.textContent = text
  dom.subtitle.classList.add('show')
  clearTimeout(subtitleTimer)
  subtitleTimer = setTimeout(() => dom.subtitle.classList.remove('show'), ms)
}

let notifyTimer = 0
function notify(text) {
  dom.statusLine.textContent = text
  notifyTimer = 4
}

// ------------------------------------------------------------------ pickups
const pickups = []
function spawnPickup(x, z, type) {
  if (pickups.length > 7) removePickup(pickups[0], false)
  const group = new THREE.Group()
  group.position.set(x, 0, z)
  const phase = Math.random() * 6
  let beacon = null
  if (type === 'ammo') {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.32, 0.36), new THREE.MeshStandardMaterial({ color: 0x353d35, roughness: 0.6, metalness: 0.4 }))
    box.position.y = 0.35
    group.add(box)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.06, 0.38), new THREE.MeshBasicMaterial({ color: 0xffb454, toneMapped: false }))
    stripe.position.y = 0.37
    group.add(stripe)
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.56, 22), new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.03
    group.add(ring)
  } else if (type === 'health') {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.34), new THREE.MeshStandardMaterial({ color: 0xd8ddd9, roughness: 0.55 }))
    box.position.y = 0.34
    group.add(box)
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, toneMapped: false })
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.36), crossMat)
    c1.position.y = 0.34
    group.add(c1)
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.24, 0.36), crossMat)
    c2.position.y = 0.34
    group.add(c2)
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.56, 22), new THREE.MeshBasicMaterial({ color: 0x8dff6a, transparent: true, opacity: 0.45, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.03
    group.add(ring)
  } else {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0x2d3a33, roughness: 0.5, metalness: 0.5 }))
    box.position.y = 0.32
    box.castShadow = true
    group.add(box)
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.99, 0.08, 0.74), new THREE.MeshBasicMaterial({ color: 0x8dff6a, toneMapped: false }))
    trim.position.y = 0.55
    group.add(trim)
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.2, 28), new THREE.MeshBasicMaterial({ color: 0x8dff6a, transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.03
    group.add(ring)
    beacon = new THREE.PointLight(0x8dff6a, 2.6, 5, 2)
    beacon.position.y = 1.6
    group.add(beacon)
  }
  scene.add(group)
  pickups.push({ group, type, phase, life: type === 'supply' ? 999 : 32, beacon })
}

function removePickup(p, notifyUser) {
  const i = pickups.indexOf(p)
  if (i >= 0) pickups.splice(i, 1)
  scene.remove(p.group)
  p.group.traverse((o) => {
    if (o.geometry) o.geometry.dispose?.()
  })
}

function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i]
    p.phase += dt
    p.life -= dt
    p.group.rotation.y += dt * 1.2
    p.group.position.y = Math.sin(p.phase * 2) * 0.05
    if (p.beacon) p.beacon.intensity = 2.2 + Math.sin(p.phase * 4) * 1.1
    const d = Math.hypot(player.pos.x - p.group.position.x, player.pos.z - p.group.position.z)
    if (d < (p.type === 'supply' ? 2.9 : 2.2) && player.alive && !player.downed) {
      if (p.type === 'ammo') {
        player.addAmmo(0.22)
        notify('AMMO RESUPPLY')
      } else if (p.type === 'health') {
        player.heal(35)
        notify('TRAUMA KIT · +35 VITALS')
      } else {
        player.addAmmo(1)
        player.heal(45)
        player.grenades = player.maxGrenades
        S.score += 150
        notify('SUPPLY CACHE SECURED · FULL RESUPPLY')
      }
      audio.pickup()
      removePickup(p, true)
      continue
    }
    if (p.life <= 0) removePickup(p, false)
  }
}

// ------------------------------------------------------------------ grenades
const grenades = []
const shockwaves = []
const flashLights = []

function spawnGrenade(origin, dir) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshStandardMaterial({ color: 0x2a3327, roughness: 0.5, metalness: 0.4, emissive: 0x2a3a1e, emissiveIntensity: 0.6 }))
  mesh.position.copy(origin)
  scene.add(mesh)
  grenades.push({
    mesh,
    vel: new THREE.Vector3(dir.x * 13.5, dir.y * 13.5 + 3.2, dir.z * 13.5),
    fuse: 2.3,
    spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8)
  })
}

function explode(pos) {
  audio.explosion()
  particles.explosion(pos)
  player.shake = Math.min(1.2, player.shake + 0.75)
  const light = new THREE.PointLight(0xffa246, 70, 32, 2)
  light.position.copy(pos)
  light.position.y += 0.6
  scene.add(light)
  flashLights.push({ light, t: 0.4 })
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.9, 36), new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2
  ring.position.set(pos.x, 0.12, pos.z)
  scene.add(ring)
  shockwaves.push({ mesh: ring, t: 0 })
  for (const z of zombieManager.zombies) {
    if (!z.alive) continue
    const dx = z.pos.x - pos.x, dz = z.pos.z - pos.z
    const d = Math.hypot(dx, dz)
    if (d > 8) continue
    const falloff = 1 - d / 8
    const dir = new THREE.Vector3(dx / (d || 1), 0.4, dz / (d || 1))
    zombieManager.hurt(z, 70 + 420 * falloff, false, dir, player)
  }
  if (zombieManager.countAlive() > 0) say('NOVA', 'Frag out! Check your lanes.', 1600)
}

function updateGrenades(dt) {
  for (let i = grenades.length - 1; i >= 0; i--) {
    const g = grenades[i]
    g.fuse -= dt
    g.vel.y -= 18 * dt
    g.mesh.position.addScaledVector(g.vel, dt)
    g.mesh.rotation.x += g.spin.x * dt
    g.mesh.rotation.y += g.spin.y * dt
    if (g.mesh.position.y < 0.14) {
      g.mesh.position.y = 0.14
      g.vel.y = Math.abs(g.vel.y) * 0.42
      g.vel.x *= 0.72
      g.vel.z *= 0.72
    }
    if (Math.abs(g.mesh.position.x) > 37) { g.mesh.position.x = Math.sign(g.mesh.position.x) * 37; g.vel.x *= -0.4 }
    if (Math.abs(g.mesh.position.z) > 46) { g.mesh.position.z = Math.sign(g.mesh.position.z) * 46; g.vel.z *= -0.4 }
    g.mesh.material.emissiveIntensity = g.fuse < 0.8 ? 1.5 + Math.sin(g.fuse * 40) * 1.5 : 0.6
    if (Math.random() < dt * 18) {
      particles.dust(g.mesh.position, 1, 0x6d7377)
    }
    if (g.fuse <= 0) {
      const pos = g.mesh.position.clone()
      scene.remove(g.mesh)
      g.mesh.geometry.dispose()
      g.mesh.material.dispose()
      grenades.splice(i, 1)
      explode(pos)
    }
  }
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const s = shockwaves[i]
    s.t += dt
    const p = s.t / 0.6
    s.mesh.scale.setScalar(1 + p * 9)
    s.mesh.material.opacity = Math.max(0, 0.9 * (1 - p))
    if (p >= 1) { scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); shockwaves.splice(i, 1) }
  }
  for (let i = flashLights.length - 1; i >= 0; i--) {
    const f = flashLights[i]
    f.t -= dt
    f.light.intensity = Math.max(0, f.t / 0.4) * 70
    if (f.t <= 0) { scene.remove(f.light); flashLights.splice(i, 1) }
  }
}

// ------------------------------------------------------------------ player/ally continuous state
function updateRevive(dt) {
  let showPrompt = false
  let label = ''
  let progress = 0
  const allyNear = Math.hypot(ally.pos.x - player.pos.x, ally.pos.z - player.pos.z)
  if (player.downed && ally.alive && !ally.downed) {
    if (allyNear < 2.2) {
      showPrompt = true
      label = 'NOVA IS REVIVING YOU'
      progress = ally.reviveProgress
    }
    dom.downed.classList.remove('hidden')
    dom.downedSub.textContent = allyNear < 2.2 ? 'NOVA HAS YOU — STAY WITH ME' : 'NOVA IS EN ROUTE — HOLD ON'
  } else if (ally.downed && ally.alive && !player.downed && allyNear < 2.8) {
    showPrompt = true
    label = 'HOLD E TO REVIVE NOVA'
    if (input.revive) {
      S.reviveHold += dt
      if (S.reviveHold >= 2.8) {
        S.reviveHold = 0
        ally.revive(60)
      }
    } else {
      S.reviveHold = Math.max(0, S.reviveHold - dt * 1.8)
    }
    progress = S.reviveHold / 2.8
  } else {
    S.reviveHold = 0
  }
  if (showPrompt) {
    dom.interact.classList.remove('hidden')
    dom.interactLabel.textContent = label
    dom.interactFill.style.width = `${clamp(progress, 0, 1) * 100}%`
  } else {
    dom.interact.classList.add('hidden')
  }
  if (!player.downed) dom.downed.classList.add('hidden')
}

// ------------------------------------------------------------------ minimap
const miniBase = document.createElement('canvas')
miniBase.width = miniBase.height = 200
const miniCtx = dom.minimap.getContext('2d')
const baseCtx = miniBase.getContext('2d')
const mapScale = 1.92
const toMap = (x, z) => [100 + x * mapScale, 100 + z * mapScale]

function buildMinimapBase() {
  baseCtx.clearRect(0, 0, 200, 200)
  baseCtx.fillStyle = 'rgba(6,12,18,.85)'
  baseCtx.fillRect(0, 0, 200, 200)
  baseCtx.strokeStyle = 'rgba(90,150,175,.18)'
  baseCtx.lineWidth = 1
  for (let i = -3; i <= 3; i++) {
    baseCtx.beginPath(); baseCtx.moveTo(100 + i * 25, 15); baseCtx.lineTo(100 + i * 25, 185); baseCtx.stroke()
    baseCtx.beginPath(); baseCtx.moveTo(15, 100 + i * 25); baseCtx.lineTo(185, 100 + i * 25); baseCtx.stroke()
  }
  for (const r of world.storeRects || []) {
    const x = 100 + r.x * mapScale
    const y = 100 + r.z * mapScale
    baseCtx.fillStyle = 'rgba(90,120,135,.15)'
    baseCtx.fillRect(x, y, r.w * mapScale, r.h * mapScale)
    baseCtx.strokeStyle = 'rgba(120,170,190,.22)'
    baseCtx.strokeRect(x, y, r.w * mapScale, r.h * mapScale)
  }
  baseCtx.fillStyle = 'rgba(20,40,50,.9)'
  baseCtx.beginPath()
  baseCtx.arc(...toMap(0, -5), 4.9 * mapScale, 0, Math.PI * 2)
  baseCtx.fill()
  baseCtx.strokeStyle = 'rgba(99,230,255,.35)'
  baseCtx.stroke()
  baseCtx.strokeStyle = 'rgba(255,180,84,.2)'
  baseCtx.lineWidth = 2
  baseCtx.strokeRect(...toMap(-34.5, -43.5), 69 * mapScale, 87 * mapScale)
}
buildMinimapBase()

function drawMinimap(t) {
  miniCtx.clearRect(0, 0, 200, 200)
  miniCtx.drawImage(miniBase, 0, 0)
  // radar sweep
  const angle = (t * 0.7) % (Math.PI * 2)
  const g = miniCtx.createRadialGradient(100, 100, 2, 100, 100, 92)
  g.addColorStop(0, 'rgba(99,230,255,.16)')
  g.addColorStop(1, 'rgba(99,230,255,0)')
  miniCtx.fillStyle = g
  miniCtx.beginPath()
  miniCtx.moveTo(100, 100)
  miniCtx.arc(100, 100, 92, angle - 0.5, angle)
  miniCtx.closePath()
  miniCtx.fill()
  miniCtx.strokeStyle = 'rgba(99,230,255,.35)'
  miniCtx.beginPath(); miniCtx.moveTo(100, 100)
  miniCtx.lineTo(100 + Math.cos(angle) * 92, 100 + Math.sin(angle) * 92)
  miniCtx.stroke()

  for (const p of pickups) {
    const [x, y] = toMap(p.group.position.x, p.group.position.z)
    miniCtx.fillStyle = p.type === 'health' ? '#8dff6a' : '#ffb454'
    miniCtx.fillRect(x - 1.5, y - 1.5, 3, 3)
  }
  for (const z of zombieManager.zombies) {
    if (!z.alive || z.state === 'spawning') continue
    const [x, y] = toMap(z.pos.x, z.pos.z)
    miniCtx.fillStyle = z.type === 'brute' ? '#ff9f43' : z.type === 'runner' ? '#ff3b30' : '#ff6b5a'
    const size = z.type === 'brute' ? 3.4 : 2.2
    miniCtx.beginPath(); miniCtx.arc(x, y, size, 0, Math.PI * 2); miniCtx.fill()
  }
  if (ally.alive) {
    const [x, y] = toMap(ally.pos.x, ally.pos.z)
    miniCtx.fillStyle = ally.downed ? '#ff3b30' : '#63e6ff'
    miniCtx.beginPath(); miniCtx.arc(x, y, 3.2, 0, Math.PI * 2); miniCtx.fill()
    miniCtx.strokeStyle = 'rgba(99,230,255,.5)'
    miniCtx.beginPath(); miniCtx.arc(x, y, 6.5, 0, Math.PI * 2); miniCtx.stroke()
  }
  const [px, py] = toMap(player.pos.x, player.pos.z)
  let fwdX = -Math.sin(player.yaw)
  let fwdZ = -Math.cos(player.yaw)
  const rot = Math.atan2(fwdX, -fwdZ)
  miniCtx.save()
  miniCtx.translate(px, py)
  miniCtx.rotate(rot)
  miniCtx.fillStyle = player.downed ? '#ff3b30' : '#ffffff'
  miniCtx.beginPath()
  miniCtx.moveTo(0, -6)
  miniCtx.lineTo(4.2, 4.5)
  miniCtx.lineTo(0, 2.4)
  miniCtx.lineTo(-4.2, 4.5)
  miniCtx.closePath()
  miniCtx.fill()
  miniCtx.restore()
}

// ------------------------------------------------------------------ HUD update
let hudAccum = 0
function updateHUD(dt) {
  const hp = clamp(player.health / player.maxHealth, 0, 1)
  dom.hpFill.style.transform = `scaleX(${hp})`
  dom.hpNumber.textContent = String(Math.round(player.health))
  dom.stamina.style.transform = `scaleX(${player.stamina / 100})`
  dom.allyFill.style.transform = `scaleX(${clamp(ally.health / ally.maxHealth, 0, 1)})`
  if (!ally.alive) { dom.novaState.textContent = 'OFFLINE'; dom.novaState.classList.add('down'); dom.allySub.textContent = 'SQUAD LINK LOST' }
  else if (ally.downed) { dom.novaState.textContent = 'DOWN'; dom.novaState.classList.add('down'); dom.allySub.textContent = `BLEEDOUT ${Math.ceil(ally.bleedout)}s · HOLD E TO REVIVE` }
  else { dom.novaState.textContent = 'AI'; dom.novaState.classList.remove('down'); dom.allySub.textContent = ally.target ? 'ENGAGING · OVERWATCH' : 'ONLINE · OVERWATCH' }

  const left = (S.active ? S.queue.length : 0) + zombieManager.countAlive()
  dom.zombiesLeft.textContent = String(left).padStart(2, '0')
  dom.waveLabel.textContent = `WAVE ${String(Math.max(1, S.wave)).padStart(2, '0')}`
  const progress = S.active ? clamp(1 - left / Math.max(1, S.waveTotal), 0, 1) : (S.intermission > 0 ? 0 : 1)
  dom.waveProgress.style.transform = `scaleX(${progress})`
  dom.score.textContent = String(S.score).padStart(6, '0')
  dom.best.textContent = String(Math.max(S.best, S.score)).padStart(6, '0')
  const mult = Math.min(3, 1 + Math.max(0, S.combo - 1) * 0.07)
  dom.streak.textContent = `x${mult.toFixed(1)}`

  const w = player.weapon
  dom.ammoMag.textContent = String(w.mag).padStart(2, '0')
  dom.ammoReserve.textContent = String(w.reserve)
  dom.weaponName.textContent = w.name
  dom.nadeCount.textContent = String(player.grenades)
  dom.reloadFill.style.transform = `scaleX(${player.reloadT > 0 ? 1 - player.reloadT / player.reloadTotal : 0})`
  dom.slot1.classList.toggle('active', player.current === 'rifle')
  dom.slot2.classList.toggle('active', player.current === 'shotgun')

  if (S.active) dom.objective.textContent = `CLEAR THE HORDE · ${left} HOSTILES`
  else if (S.started && zombieManager.countAlive() > 0) dom.objective.textContent = `CLEAR STRAYS · NEXT WAVE IN ${Math.max(0, Math.ceil(S.intermission))}s`
  else if (S.started) dom.objective.textContent = `REGROUP · NEXT WAVE IN ${Math.max(0, Math.ceil(S.intermission))}s`
  else dom.objective.textContent = 'HOLD THE ATRIUM'

  const spread = 9 + player.spread * 15 + Math.min(1, player.moveSpeed / 8) * 7
  dom.crosshair.style.setProperty('--spread', `${spread}px`)

  // low crosshair over enemy
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  const origin = camera.position
  let aimEnemy = false
  for (const z of zombieManager.zombies) {
    if (!z.alive || z.state !== 'alive') continue
    const cy = z.pos.y + 1.05 * z.scale
    const ox = origin.x - z.pos.x, oy = origin.y - cy, oz = origin.z - z.pos.z
    const t = -(ox * dir.x + oy * dir.y + oz * dir.z)
    if (t < 0 || t > 45) continue
    const px = origin.x + dir.x * t, py = origin.y + dir.y * t, pz = origin.z + dir.z * t
    const d = Math.hypot(px - z.pos.x, py - cy, pz - z.pos.z)
    if (d < 0.55 * z.scale) { aimEnemy = true; break }
  }
  dom.crosshair.classList.toggle('enemy', aimEnemy)

  S.flash = Math.max(0, S.flash - dt * 1.9)
  dom.damageFlash.style.opacity = String(S.flash * 0.9)
  dom.lowHealth.classList.toggle('active', (player.health < 36 && !player.downed) || player.downed)
  if (notifyTimer > 0) {
    notifyTimer -= dt
    if (notifyTimer <= 0) dom.statusLine.textContent = player.downed ? 'SQUADMATE INBOUND' : 'SECTOR SECURE'
  }

  S.minimapTick -= dt
  if (S.minimapTick <= 0) {
    S.minimapTick = 0.1
    drawMinimap(performance.now() / 1000)
  }
}

// ------------------------------------------------------------------ main loop
const clock = new THREE.Clock()
let elapsed = 0
let firstFrame = true

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(0.33, clock.getDelta())
  elapsed += dt

  if (S.mode === 'menu') {
    world.update(dt, elapsed)
    zombieManager.update(dt, [], elapsed)
    particles.update(dt)
    const t = elapsed * 0.045
    camera.position.set(Math.sin(t) * 25, 4.4 + Math.sin(elapsed * 0.23) * 0.5, Math.cos(t) * 26 + 1)
    camera.lookAt(0, 2.1, -6)
    camera.fov += (62 - camera.fov) * Math.min(1, dt * 3)
    camera.updateProjectionMatrix()
  } else if (S.mode === 'playing' || S.mode === 'dying') {
    updateGame(dt)
  } else if (S.mode === 'paused') {
    world.update(0, elapsed)
  } else if (S.over) {
    world.update(dt * 0.2, elapsed)
    particles.update(dt)
  }

  composer.render()
  if (firstFrame) {
    firstFrame = false
    dom.loading.classList.add('done')
    setTimeout(() => dom.loading.classList.add('hidden'), 700)
  }
}

function updateGame(dt) {
  S.time += dt
  world.update(dt, elapsed)
  updateWaves(dt)
  updatePickups(dt)
  updateGrenades(dt)

  const dtPlayer = S.mode === 'dying' ? dt : dt
  player.update(dtPlayer, input, elapsed, zombieManager)
  ally.update(dt, player, zombieManager, elapsed)
  zombieManager.update(dt, [player, ally], elapsed)
  particles.update(dt)
  updateRevive(dt)

  if (S.comboTimer > 0) {
    S.comboTimer -= dt
    if (S.comboTimer <= 0) S.combo = 0
  }

  // ambient zombie groans
  S.calloutCd -= dt
  if (S.calloutCd <= 0) {
    S.calloutCd = 1.6 + Math.random() * 2.4
    const alive = zombieManager.zombies.filter(z => z.alive && z.state === 'alive')
    if (alive.length) {
      const z = alive[Math.floor(Math.random() * alive.length)]
      const dx = z.pos.x - camera.position.x
      const dz = z.pos.z - camera.position.z
      const d = Math.hypot(dx, dz)
      if (d < 36) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        const pan = (dx / (d || 1)) * right.x + (dz / (d || 1)) * right.z
        audio.groan(Math.max(0.02, (1 - d / 36) * 0.25), pan)
      }
    }
  }

  updateHUD(dt)
}

// expose for smoke tests / debugging
window.__MOTD = {
  state: S,
  player,
  ally,
  zombies: zombieManager,
  renderer,
  start: startGame,
  spawnWave: () => { S.intermission = 0 },
  setWave: (n) => { S.wave = n - 1; S.intermission = 0 },
  giveAmmo: () => player.addAmmo(1),
  skip: (seconds) => { S.intermission = Math.max(0, S.intermission - seconds) }
}

animate()
