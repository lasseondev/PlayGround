import * as THREE from 'three'
import { createWorld, makeGlowTexture } from './world.js'
import { Bike } from './bike.js'
import { Traffic } from './traffic.js'
import { Police } from './police.js'
import { Particles } from './particles.js'
import { GameAudio } from './audio.js'
import { Hud } from './hud.js'

const clamp = THREE.MathUtils.clamp
const START = { x: 38, z: 190, yaw: Math.PI }

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.12
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 2200)
camera.position.set(START.x + 12, 6, START.z + 14)

const world = createWorld(scene, renderer)
const traffic = new Traffic(scene, new THREE.Vector3(START.x, 0, START.z))
const bike = new Bike(scene, { main: '#20d9ee', accent: '#ff2f97' })
bike.reset(START.x, START.z, START.yaw, world)
const police = new Police(scene, world)
const particles = new Particles(scene)
particles.setViewport(window.innerHeight, camera.fov)
const audio = new GameAudio()
const hud = new Hud(world)

const heroLight = new THREE.PointLight(0xa8ecff, 42, 18, 2)
heroLight.position.set(0, 3.2, -1.2)
bike.root.add(heroLight)

const state = {
  mode: 'menu',
  cash: 0,
  health: 100,
  heat: 0,
  cops: [],
  delivery: 0,
  multiplier: 1,
  missionTime: 60,
  missionMax: 60,
  distance: 76,
  target: { x: 38, z: 114 },
  targetAxis: 'z',
  invuln: 0,
  calm: 0,
  shake: 0,
  wreckTimer: 0,
  wreckReason: 'wrecked',
  timeName: 'dusk',
  muted: false,
  boosting: false,
  speed: 0,
  speedKmh: 0,
  boost: 100,
  pos: bike.pos,
  yaw: bike.yaw,
  time: 0,
}

let bestCash = 0
try {
  bestCash = Number(localStorage.getItem('neon-rider-best') || 0)
  document.getElementById('bestCash').textContent = '$' + bestCash.toLocaleString('en-US')
} catch {}

/* ---------- delivery gate ---------- */
function beamTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.72, 'rgba(255,255,255,.22)')
  grad.addColorStop(1, 'rgba(255,255,255,.85)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const gate = new THREE.Group()
gate.visible = false
scene.add(gate)
const gateMat = new THREE.MeshBasicMaterial({ color: 0xff3ba7, toneMapped: false })
const gateTorus = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.16, 10, 56), gateMat)
gateTorus.position.y = 3.45
gate.add(gateTorus)
const gateInnerMat = new THREE.MeshBasicMaterial({
  color: 0x9df6ff, transparent: true, opacity: 0.7, toneMapped: false,
  blending: THREE.AdditiveBlending, depthWrite: false,
})
const gateInner = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.045, 8, 48), gateInnerMat)
gateInner.position.y = 3.45
gate.add(gateInner)
const beamMat = new THREE.MeshBasicMaterial({
  map: beamTexture(),
  color: 0xff3ba7,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
})
const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 110, 16, 1, true), beamMat)
beam.position.y = 55
gate.add(beam)
const gateGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeGlowTexture(), color: 0xff5fb8, transparent: true, opacity: 0.45,
  blending: THREE.AdditiveBlending, depthWrite: false,
}))
gateGlow.position.y = 3.45
gateGlow.scale.setScalar(10.5)
gate.add(gateGlow)
for (const s of [-1, 1]) {
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.16, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x1d2734, emissive: 0xff3ba7, emissiveIntensity: 1.4, roughness: 0.4 }),
  )
  post.position.set(s * 3.5, 0.75, 0)
  gate.add(post)
}

/* ---------- state helpers ---------- */
function placeGate(x, z, axis, initial = false) {
  state.target = { x, z }
  state.targetAxis = axis
  gate.position.set(x, 0, z)
  gate.rotation.y = axis === 'z' ? 0 : Math.PI / 2
  gate.visible = true
  state.missionMax = initial ? 62 : Math.max(30, 58 - state.delivery * 2)
  state.missionTime = state.missionMax
  state.distance = Math.hypot(bike.pos.x - x, bike.pos.z - z)
}

function chooseTarget(initial = false) {
  if (initial) {
    placeGate(38, 114, 'z', true)
    return
  }
  let best = null
  for (let i = 0; i < 50; i++) {
    const x = world.roadCenters[Math.floor(Math.random() * world.roadCenters.length)]
    const z = world.roadCenters[Math.floor(Math.random() * world.roadCenters.length)]
    const d = Math.hypot(x - bike.pos.x, z - bike.pos.z)
    if (d > 85 && d < 265) {
      best = { x, z, d }
      break
    }
  }
  if (!best) best = { x: 38, z: -38 }
  placeGate(best.x, best.z, Math.random() < 0.5 ? 'z' : 'x')
}

function collectDelivery() {
  state.delivery += 1
  const reward = Math.round((140 + state.delivery * 18) * state.multiplier)
  state.cash += reward
  state.health = Math.min(100, state.health + 12)
  state.invuln = Math.max(state.invuln, 1.2)
  audio.pickup()
  particles.pickup(state.target.x, 3.4, state.target.z)
  hud.flash(0.16)
  if (state.delivery >= 10) {
    state.cash += 2000
    hud.toast('CONTRACT COMPLETE', `+$2,000 BONUS · +$${reward} DROP`, 'green', 3.6)
    state.delivery = 0
    state.multiplier = 1
  } else {
    state.multiplier = Math.min(3, 1 + Math.floor(state.delivery / 2) * 0.25)
    hud.toast(`+$${reward}`, `DROP ${state.delivery} / 10 · PAYOUT x${state.multiplier.toFixed(2)}`, 'green', 2.2)
  }
  if (state.cash > bestCash) {
    bestCash = state.cash
    try { localStorage.setItem('neon-rider-best', String(bestCash)) } catch {}
  }
  chooseTarget()
}

function timeoutDelivery() {
  hud.toast('TIME UP', 'PAYOUT RESET · NEW DROP MARKED', 'red', 2.6)
  state.multiplier = 1
  chooseTarget()
}

function addHeat(amount) {
  state.heat = clamp(state.heat + amount, 0, 5)
  state.calm = 0
}

function takeDamage(amount, reason) {
  if (state.mode !== 'playing' || state.invuln > 0) return
  state.health = Math.max(0, state.health - amount)
  state.invuln = 0.4
  hud.flash(clamp(0.18 + amount * 0.025, 0.15, 0.65))
  if (state.health <= 0) wreck(reason)
}

function wreck(reason) {
  if (state.mode !== 'playing') return
  state.mode = 'wrecked'
  state.wreckTimer = 0
  state.wreckReason = reason
  state.health = 0
  bike.vel.set(0, 0)
  bike.parts.lean.rotation.z = 1.15
  particles.burst(bike.pos.x, 0.8, bike.pos.z, new THREE.Color('#ff7a45'), 40)
  particles.smokePuff(bike.pos.x, 0.6, bike.pos.z, 12)
  audio.crash(3)
  hud.flash(0.7)
  document.getElementById('wreck').classList.remove('hidden')
  document.getElementById('wreckSub').textContent = reason === 'cop'
    ? 'Busted by the SCPD. Lost $150 and the drop clock reset.'
    : 'You lost $150 and your pride. The city keeps moving.'
}

function respawn() {
  document.getElementById('wreck').classList.add('hidden')
  state.mode = 'playing'
  state.health = 100
  state.heat = 0
  state.invuln = 2.2
  state.cash = Math.max(0, state.cash - 150)
  const nx = world.roadCenters.reduce((a, c) => Math.abs(c - bike.pos.x) < Math.abs(a - bike.pos.x) ? c : a, 0)
  const nz = world.roadCenters.reduce((a, c) => Math.abs(c - bike.pos.z) < Math.abs(a - bike.pos.z) ? c : a, 0)
  bike.reset(nx, nz, START.yaw, world)
  if (state.target) {
    state.missionTime = state.missionMax
  }
  hud.toast('BACK ON THE ROAD', '-$150 · CLOCK RESET · KEEP MOVING', 'pink', 2.6)
  state.shake = 0
}

/* ---------- menu / flow ---------- */
function begin() {
  if (state.mode !== 'menu') return
  state.mode = 'playing'
  state.cash = 0
  state.health = 100
  state.heat = 0
  state.delivery = 0
  state.multiplier = 1
  state.invuln = 1.6
  state.calm = 0
  state.shake = 0
  bike.reset(START.x, START.z, START.yaw, world)
  chooseTarget(true)
  hud.setStarted(true)
  hud.setTime(world.getTime())
  audio.start()
  audio.setMuted(state.muted)
  document.getElementById('overlay').classList.add('leaving')
  setTimeout(() => document.getElementById('overlay').classList.add('hidden'), 700)
  if (isTouch) document.getElementById('touch').classList.remove('hidden')
  hud.toast('NIGHT SHIFT', 'DELIVER 10 PACKAGES · FOLLOW THE PINK BEAM', 'pink', 3.4)
}

function toMenu() {
  state.mode = 'menu'
  state.cash = Math.max(state.cash, 0)
  hud.setStarted(false)
  document.getElementById('hud').classList.add('fade')
  document.getElementById('overlay').classList.remove('hidden', 'leaving')
  document.getElementById('pause').classList.add('hidden')
  document.getElementById('wreck').classList.add('hidden')
  document.getElementById('touch').classList.add('hidden')
  bike.reset(START.x, START.z, START.yaw, world)
  chooseTarget(true)
  setTimeout(() => document.getElementById('hud').classList.remove('fade'), 500)
}

function togglePause(force) {
  if (state.mode === 'playing') {
    state.mode = 'paused'
    document.getElementById('pause').classList.remove('hidden')
  } else if (state.mode === 'paused' && force !== true) {
    state.mode = 'playing'
    document.getElementById('pause').classList.add('hidden')
  }
}

function cycleTime() {
  const order = ['dusk', 'night', 'day']
  const next = order[(order.indexOf(state.timeName) + 1) % order.length]
  state.timeName = world.setTime(next)
  hud.setTime(state.timeName)
  if (state.mode === 'playing') {
    hud.toast(state.timeName.toUpperCase(), state.timeName === 'night' ? 'THE CITY COMES ALIVE' : state.timeName === 'day' ? 'SUNSET CITY, UNFILTERED' : 'GOLDEN HOUR RUN', '', 1.8)
  }
}

function toggleMute() {
  state.muted = !state.muted
  audio.start()
  audio.setMuted(state.muted)
  hud.setMuted(state.muted)
}

/* ---------- input ---------- */
const keys = new Set()
const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0 || window.innerWidth < 760
const touchState = { steer: 0, gas: false, brake: false, boost: false }
const NEUTRAL = { throttle: 0, brake: 0, steer: 0, drift: false, boost: false }

window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault()
  keys.add(event.code)
  if (event.repeat) return
  if (event.code === 'Enter' && state.mode === 'menu') begin()
  if (event.code === 'Escape' && (state.mode === 'playing' || state.mode === 'paused')) togglePause()
  if (event.code === 'KeyT') cycleTime()
  if (event.code === 'KeyM') toggleMute()
})
window.addEventListener('keyup', (event) => keys.delete(event.code))
window.addEventListener('blur', () => {
  keys.clear()
  if (state.mode === 'playing') togglePause(true)
})

function getInput() {
  let throttle = (keys.has('KeyW') || keys.has('ArrowUp')) ? 1 : 0
  let brake = (keys.has('KeyS') || keys.has('ArrowDown')) ? 1 : 0
  let steer = ((keys.has('KeyD') || keys.has('ArrowRight')) ? 1 : 0) - ((keys.has('KeyA') || keys.has('ArrowLeft')) ? 1 : 0)
  if (touchState.gas) throttle = 1
  if (touchState.brake) brake = 1
  steer += touchState.steer
  return {
    throttle,
    brake,
    steer: clamp(steer, -1, 1),
    drift: keys.has('Space'),
    boost: keys.has('ShiftLeft') || keys.has('ShiftRight') || touchState.boost,
  }
}

if (isTouch) {
  const pad = document.getElementById('steerPad')
  const stick = document.getElementById('stick')
  let padId = null
  const moveStick = (event) => {
    const rect = pad.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5)
    touchState.steer = clamp(dx, -1, 1)
    stick.style.transform = `translateX(${touchState.steer * 30}px)`
  }
  pad.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    padId = event.pointerId
    pad.setPointerCapture(padId)
    moveStick(event)
  })
  pad.addEventListener('pointermove', (event) => {
    if (event.pointerId === padId) moveStick(event)
  })
  const endPad = (event) => {
    if (event.pointerId !== padId) return
    padId = null
    touchState.steer = 0
    stick.style.transform = 'translateX(0)'
  }
  pad.addEventListener('pointerup', endPad)
  pad.addEventListener('pointercancel', endPad)

  const hold = (id, key) => {
    const el = document.getElementById(id)
    el.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      touchState[key] = true
      el.classList.add('down')
      el.setPointerCapture(event.pointerId)
    })
    const off = () => {
      touchState[key] = false
      el.classList.remove('down')
    }
    el.addEventListener('pointerup', off)
    el.addEventListener('pointercancel', off)
    el.addEventListener('lostpointercapture', off)
  }
  hold('btnGas', 'gas')
  hold('btnBrake', 'brake')
  hold('btnBoost', 'boost')
}

/* ---------- camera ---------- */
const camDesired = new THREE.Vector3()
const camFrom = new THREE.Vector3()
const camSafe = new THREE.Vector3()
const camLook = new THREE.Vector3()
let currentFov = 64

function updateCamera(dt) {
  if (state.mode === 'menu') {
    const sway = Math.sin(state.time * 0.22) * 0.9
    camDesired.set(
      bike.pos.x - 3.9 + sway,
      bike.visualY + 3.6,
      bike.pos.z + 12.5,
    )
    camFrom.set(bike.pos.x, bike.visualY + 1.5, bike.pos.z)
    const clearance = world.cameraClearance(camFrom, camDesired)
    camSafe.copy(camFrom).lerp(camDesired, Math.max(0.3, clearance - 0.02))
    camera.position.lerp(camSafe, 1 - Math.exp(-dt * 2.2))
    camLook.set(bike.pos.x + sway * 0.5, bike.visualY + 1.75, bike.pos.z - 24)
    camera.lookAt(camLook)
  } else {
    const ratio = clamp(bike.speed / 62, 0, 1)
    const fwdX = Math.sin(bike.yaw)
    const fwdZ = Math.cos(bike.yaw)
    const dist = 7.2 + ratio * 1.9
    const height = 3.3 + ratio * 0.65
    camDesired.set(bike.pos.x - fwdX * dist, bike.visualY + height, bike.pos.z - fwdZ * dist)
    camFrom.set(bike.pos.x, bike.visualY + 1.1, bike.pos.z)
    const clearance = world.cameraClearance(camFrom, camDesired)
    camSafe.copy(camFrom).lerp(camDesired, Math.max(0.28, clearance - 0.02))
    camera.position.lerp(camSafe, 1 - Math.exp(-dt * (state.mode === 'wrecked' ? 2.4 : 6)))
    camLook.set(
      bike.pos.x + fwdX * (4 + ratio * 3),
      bike.visualY + 1.35,
      bike.pos.z + fwdZ * (4 + ratio * 3),
    )
    camera.lookAt(camLook)
    camera.rotateZ(-bike.lean * 0.1)
  }

  if (state.shake > 0.001) {
    camera.position.x += (Math.random() - 0.5) * state.shake * 0.4
    camera.position.y += (Math.random() - 0.5) * state.shake * 0.3
    camera.position.z += (Math.random() - 0.5) * state.shake * 0.4
  }
  const fovTarget = 62 + clamp(bike.speed / 62, 0, 1) * 10 + (state.boosting ? 2 : 0)
  currentFov = THREE.MathUtils.damp(currentFov, fovTarget, 4, dt)
  if (Math.abs(camera.fov - currentFov) > 0.02) {
    camera.fov = currentFov
    camera.updateProjectionMatrix()
    particles.setViewport(window.innerHeight, camera.fov)
  }
}

/* ---------- game feel helpers ---------- */
const sparkColor = new THREE.Color('#ffb54b')
const copSpark = new THREE.Color('#ff5f7a')

function handleBikeEvents(events) {
  for (const event of events) {
    if (event.type !== 'wall') continue
    const strength = event.impact
    state.shake = Math.min(1.2, state.shake + 0.08 + strength * 0.02)
    particles.burst(event.x, 0.75, event.z, sparkColor, Math.min(30, 6 + Math.floor(strength)))
    if (strength > 8) {
      audio.crash(strength / 9)
      takeDamage(clamp((strength - 7) * 1.25, 1, 24), 'wall')
      addHeat(0.1)
    }
  }
}

function handleTrafficEvents(events) {
  for (const event of events) {
    if (event.type === 'car') {
      const strength = event.impact
      state.shake = Math.min(1.2, state.shake + 0.1 + strength * 0.02)
      particles.burst(event.x, 0.8, event.z, sparkColor, Math.min(34, 10 + Math.floor(strength * 2)))
      audio.crash(clamp(strength / 9, 0.4, 3))
      takeDamage(clamp((strength - 2) * 1.6, 1, 20), 'car')
      addHeat(0.55)
    } else if (event.type === 'ped') {
      audio.yelp()
      audio.crash(0.5)
      state.shake = Math.min(1, state.shake + 0.12)
      particles.smokePuff(event.x, 0.8, event.z, 5)
      addHeat(0.65)
      hud.flash(0.12)
    }
  }
}

function handleCopEvents(events) {
  for (const event of events) {
    if (event.type !== 'cop') continue
    state.shake = Math.min(1.3, state.shake + 0.4)
    particles.burst(event.x, 1, event.z, copSpark, 30)
    audio.crash(2.4)
    addHeat(0.1)
    hud.flash(0.45)
    takeDamage(14, 'cop')
    hud.toast('COP CONTACT', 'BREAK AWAY · SHAKE THE TAIL', 'red', 1.4)
  }
  return events.currentDistance ?? 999
}

function animateGate(dt) {
  if (!gate.visible) return
  gateTorus.rotation.z += dt * 0.55
  gateInner.rotation.z -= dt * 1.1
  const pulse = 1 + Math.sin(state.time * 3.2) * 0.035
  gateTorus.scale.setScalar(pulse)
  gateGlow.scale.setScalar(9.5 + Math.sin(state.time * 2.6) * 1.2)
  beamMat.opacity = 0.26 + Math.sin(state.time * 2.2) * 0.07
}

/* ---------- main loop ---------- */
function tick(dt) {
  state.time += dt
  state.invuln = Math.max(0, state.invuln - dt)
  state.shake *= Math.exp(-dt * 3.4)

  world.update(dt, camera, bike.pos)
  traffic.update(dt, bike.pos, bike.speed)
  bike.setNight(state.timeName === 'day' ? 0 : state.timeName === 'night' ? 1 : 0.55)

  if (state.mode === 'menu') {
    bike.update(dt, NEUTRAL, world)
    audio.update(0, false, 0, 999)
  } else if (state.mode === 'playing') {
    bike.update(dt, getInput(), world)
    handleBikeEvents(bike.events)
    handleTrafficEvents(traffic.collideBike(bike))

    state.distance = Math.hypot(bike.pos.x - state.target.x, bike.pos.z - state.target.z)
    if (state.distance < 4.6) collectDelivery()
    if (state.mode === 'playing') {
      state.missionTime -= dt
      if (state.missionTime <= 0) timeoutDelivery()
    }

    state.calm += dt
    if (state.calm > 6) state.heat = Math.max(0, state.heat - dt * 0.055)

    const copDistance = handleCopEvents(police.update(dt, bike.pos, bike.speed, state.heat, state.time))

    state.speed = bike.speed
    state.speedKmh = bike.kmh
    state.boost = bike.boostFuel
    state.boosting = bike.boosting
    state.pos = bike.pos
    state.yaw = bike.yaw
    state.cars = traffic.cars
    state.cops = police.units.filter((u) => u.active).map((u) => ({ x: u.x, z: u.z }))
    hud.update(state, dt)
    audio.update(clamp(bike.speed / 60, 0, 1), bike.drifting, state.heat, copDistance)
  } else if (state.mode === 'wrecked') {
    state.wreckTimer += dt
    state.speed = 0
    state.speedKmh = 0
    state.pos = bike.pos
    state.yaw = bike.yaw
    audio.update(0, false, 0, 999)
    if (state.wreckTimer > 3.1) respawn()
  }

  animateGate(dt)
  particles.update(dt)
}

const clock = new THREE.Clock()
function frame() {
  requestAnimationFrame(frame)
  const dt = Math.min(clock.getDelta(), 0.05)
  if (state.mode !== 'paused') {
    tick(dt)
    updateCamera(dt)
  }
  renderer.render(scene, camera)
}

/* ---------- wiring ---------- */
document.getElementById('startBtn').addEventListener('click', begin)
document.getElementById('resumeBtn').addEventListener('click', () => togglePause())
document.getElementById('quitBtn').addEventListener('click', toMenu)
document.getElementById('muteBtn').addEventListener('click', toggleMute)

window.addEventListener('resize', () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  particles.setViewport(window.innerHeight, camera.fov)
})

window.addEventListener('beforeunload', () => {
  bestCash = Math.max(bestCash, state.cash)
  try { localStorage.setItem('neon-rider-best', String(bestCash)) } catch {}
})

hud.setMuted(state.muted)
hud.setTime('dusk')
chooseTarget(true)
frame()

window.__GAME__ = {
  THREE, scene, camera, renderer, world, bike, traffic, police, particles, audio, state, hud,
  begin, toMenu, togglePause, cycleTime, placeGate,
}
window.__READY__ = true


