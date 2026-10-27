import * as THREE from 'three'
import './style.css'
import { World, HOTBAR, WATER_Y } from './world.js'
import { OceanAudio } from './audio.js'

const canvas = document.getElementById('scene')
const overlay = document.getElementById('overlay')
const playBtn = document.getElementById('playBtn')
const resumeBtn = document.getElementById('resumeBtn')
const completePanel = document.getElementById('complete')
const toast = document.getElementById('toast')
const hintLine = document.getElementById('hintLine')
const targetTag = document.getElementById('targetTag')
const crosshair = document.querySelector('.crosshair')
const depthEl = document.getElementById('depth')
const airFill = document.getElementById('airFill')
const airNum = document.getElementById('airNum')
const zoneEl = document.getElementById('zone')
const relicCountEl = document.getElementById('relicCount')
const relicPips = document.getElementById('relicPips')
const radarBlips = document.getElementById('radarBlips')
const hotbarEl = document.getElementById('hotbar')
const completeBlocks = document.getElementById('completeBlocks')
const completeTime = document.getElementById('completeTime')

const BLOCK_LABELS = {
  sand: 'SAND',
  coral: 'CORAL',
  stone: 'REEF STONE',
  dark: 'BASALT',
  sandstone: 'SANDSTONE',
  pearl: 'PEARL',
}

function detectSoftwareRenderer() {
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) return { software: true, name: 'none' }
    const extension = gl.getExtension('WEBGL_debug_renderer_info')
    const name = extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : ''
    const vendor = extension ? gl.getParameter(extension.UNMASKED_VENDOR_WEBGL) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return {
      software: /llvmpipe|swiftshader|softpipe|software rasterizer|microsoft basic render/i.test(`${name} ${vendor}`),
      name,
    }
  } catch {
    return { software: true, name: 'unknown' }
  }
}

const query = new URLSearchParams(window.location.search)
const requestedQuality = query.get('quality')
const probe = detectSoftwareRenderer()
const lowQuality = requestedQuality === 'low' || (requestedQuality !== 'high' && probe.software)
const qualityScale = lowQuality ? 0.68 : Math.min(window.devicePixelRatio || 1, 1.65)

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !lowQuality,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(qualityScale)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 1.04

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(window.innerWidth / window.innerHeight < 0.9 ? 80 : 72, window.innerWidth / window.innerHeight, 0.1, 400)
camera.rotation.order = 'YXZ'
scene.add(camera)

const world = new World(scene, renderer, { low: lowQuality })
const audio = new OceanAudio()

const state = {
  started: false,
  playing: false,
  pointerLocked: false,
  lockFailed: false,
  blackout: false,
  yaw: 0,
  pitch: -0.06,
  pos: world.spawn.clone(),
  velocity: new THREE.Vector3(),
  keys: new Set(),
  dragging: false,
  lastPointerX: 0,
  lastPointerY: 0,
  selected: 0,
  air: 100,
  elapsed: 0,
  startTime: 0,
  handSwing: 0,
  hudTimer: 0,
  hint: '',
  nearRelic: false,
  completeShown: false,
  blocksPlaced: 0,
  loopStarted: false,
}

camera.position.copy(state.pos)

const aimDir = new THREE.Vector3()
const forward = new THREE.Vector3()
const right = new THREE.Vector3()
const desired = new THREE.Vector3()
const up = new THREE.Vector3(0, 1, 0)
const tempVec = new THREE.Vector3()

const highlightGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.006, 1.006, 1.006))
const highlight = new THREE.LineSegments(
  highlightGeo,
  new THREE.LineBasicMaterial({ color: 0xffd36e, transparent: true, opacity: 0.9, depthTest: true }),
)
highlight.visible = false
highlight.renderOrder = 5
scene.add(highlight)

const hand = createHand()
hand.group.visible = false

function createHand() {
  const group = new THREE.Group()
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x0d4349, roughness: 0.52, metalness: 0.18 })
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0x1a4f53, roughness: 0.5, metalness: 0.2 })
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xff9a5e, roughness: 0.55, metalness: 0.05 })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x9fb9bd, roughness: 0.28, metalness: 0.75 })
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0xb6fff4,
    emissive: 0x3cebd4,
    emissiveIntensity: 2.4,
    roughness: 0.14,
    metalness: 0.4,
  })

  const glove = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), gloveMat)
  glove.scale.set(1.05, 0.88, 1.3)
  glove.position.set(0, 0.22, -0.028)
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 6, 20), accentMat)
  band.position.set(0, 0.152, -0.02)
  band.rotation.x = Math.PI * 0.5
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.016, 0.3, 6), metalMat)
  handle.position.set(0.024, 0.37, -0.018)
  handle.rotation.x = 0.26
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.052, 0), glowMat)
  crystal.position.set(0.024, 0.54, -0.075)
  const crystalRing = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.009, 6, 20), glowMat)
  crystalRing.position.copy(crystal.position)
  crystalRing.rotation.x = Math.PI * 0.5

  group.add(glove, band, handle, crystal, crystalRing)
  group.position.set(0.54, -0.64, -0.95)
  group.rotation.set(-0.08, -0.5, -0.32)
  group.scale.setScalar(0.9)
  group.traverse((child) => {
    if (child.isMesh) {
      child.material.depthTest = false
      child.material.depthWrite = false
      child.renderOrder = 999
      child.frustumCulled = false
    }
  })
  camera.add(group)

  const lamp = new THREE.PointLight(0x9ffcf2, 5.5, 16, 2)
  lamp.position.set(0.3, -0.1, 0.2)
  camera.add(lamp)
  return { group, crystal, crystalRing }
}

function buildHotbar() {
  HOTBAR.forEach((item, index) => {
    const slot = document.createElement('div')
    slot.className = `slot${index === 0 ? ' selected' : ''}`
    slot.dataset.index = String(index)
    slot.innerHTML = `
      <span class="slot-key">${index + 1}</span>
      <span class="slot-icon ${item.icon}"></span>
      <span class="slot-name">${item.label}</span>
    `
    slot.addEventListener('click', () => selectSlot(index))
    hotbarEl.appendChild(slot)
  })
  for (let i = 0; i < 5; i += 1) {
    const pip = document.createElement('span')
    pip.className = 'pip'
    relicPips.appendChild(pip)
    const blip = document.createElement('span')
    blip.className = 'blip'
    radarBlips.appendChild(blip)
  }
}

function selectSlot(index) {
  state.selected = (index + HOTBAR.length) % HOTBAR.length
  const slots = hotbarEl.querySelectorAll('.slot')
  slots.forEach((slot, i) => slot.classList.toggle('selected', i === state.selected))
  setHint(`Selected ${HOTBAR[state.selected].label.toLowerCase()}`)
}

function setHint(text) {
  if (state.hint === text) return
  state.hint = text
  hintLine.innerHTML = text
}

function showToast(text, duration = 2400) {
  toast.textContent = text
  toast.classList.add('show')
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), duration)
}

function requestPointerLock() {
  if (state.pointerLocked || document.pointerLockElement === canvas) return
  try {
    const result = canvas.requestPointerLock()
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        state.lockFailed = true
      })
    }
  } catch {
    state.lockFailed = true
  }
}

function startGame() {
  if (state.started) return
  state.started = true
  state.playing = true
  state.startTime = performance.now()
  if (camera.aspect < 0.9) state.pitch = -0.17
  audio.init()
  audio.splash()
  overlay.classList.add('hidden')
  document.body.classList.add('playing')
  selectSlot(0)
  setHint('Move with <kbd>WASD</kbd> · collect the five relics')
  requestPointerLock()
  startLoop()
  window.setTimeout(() => {
    if (!state.pointerLocked && !state.lockFailed) requestPointerLock()
  }, 350)
}

function collectRelic() {
  const relic = world.tryCollect(camera.position)
  if (!relic) {
    const remaining = world.remainingRelics()
    if (remaining.length) {
      let nearest = Infinity
      for (const item of remaining) nearest = Math.min(nearest, item.position.distanceTo(camera.position))
      if (nearest < 8) setHint('Get closer to the relic to recover it')
    }
    return
  }
  audio.collect()
  state.blocksPlaced = world.blocksPlaced
  updateRelicHud()
  const total = world.collected
  showToast(total === 5 ? 'FINAL RELIC RECOVERED' : `RELIC RECOVERED · ${total} / 5`, 2200)
  setHint('Sonar updated · keep exploring the reef')
  if (total === 5 && !state.completeShown) {
    state.completeShown = true
    window.setTimeout(showComplete, 900)
  }
}

function showComplete() {
  completeBlocks.textContent = String(world.blocksPlaced)
  const seconds = Math.max(0, Math.floor((performance.now() - state.startTime) / 1000))
  completeTime.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  completePanel.classList.add('show')
  audio.complete()
}

function updateRelicHud() {
  relicCountEl.textContent = String(world.collected)
  const pips = relicPips.querySelectorAll('.pip')
  pips.forEach((pip, index) => pip.classList.toggle('on', index < world.collected))
  const blips = radarBlips.querySelectorAll('.blip')
  blips.forEach((blip, index) => {
    if (world.relics[index]) blip.style.display = world.relics[index].collected ? 'none' : ''
  })
}

function mineBlock() {
  const target = getTarget()
  if (!target) {
    setHint('Nothing in range · swim closer to the seabed')
    return
  }
  const block = world.removeBlock(target.key)
  if (!block) return
  audio.mine()
  world.spawnBurst(new THREE.Vector3(block.x, block.y, block.z), 0xcfffff, 18)
  state.handSwing = 1
  setHint(`Mined ${BLOCK_LABELS[block.type].toLowerCase()} · <kbd>RMB</kbd> place a block`)
  updateAim()
}

function placeBlock() {
  const target = getTarget()
  if (!target) {
    setHint('Aim at a block to build against it')
    return
  }
  const hit = target.block
  const nx = target.normal.x
  const ny = target.normal.y
  const nz = target.normal.z
  if (nx === 0 && ny === 0 && nz === 0) return
  const x = hit.x + nx
  const y = hit.y + ny
  const z = hit.z + nz
  const type = HOTBAR[state.selected].type
  tempVec.set(x, y, z)
  if (tempVec.distanceTo(camera.position) < 1.55) {
    setHint('Too close to place a block there')
    return
  }
  if (!world.addBlock(x, y, z, type)) {
    setHint('That space is already occupied')
    return
  }
  state.blocksPlaced = world.blocksPlaced
  audio.place()
  world.spawnBurst(new THREE.Vector3(x, y, z), 0xaffff4, 9)
  state.handSwing = 1
  setHint(`Placed ${BLOCK_LABELS[type].toLowerCase()}`)
  updateAim()
}

function getTarget() {
  camera.getWorldDirection(aimDir)
  const ox = camera.position.x + 0.5
  const oy = camera.position.y + 0.5
  const oz = camera.position.z + 0.5
  let ix = Math.floor(ox)
  let iy = Math.floor(oy)
  let iz = Math.floor(oz)
  const stepX = aimDir.x >= 0 ? 1 : -1
  const stepY = aimDir.y >= 0 ? 1 : -1
  const stepZ = aimDir.z >= 0 ? 1 : -1
  const tDeltaX = Math.abs(aimDir.x) < 1e-6 ? Infinity : Math.abs(1 / aimDir.x)
  const tDeltaY = Math.abs(aimDir.y) < 1e-6 ? Infinity : Math.abs(1 / aimDir.y)
  const tDeltaZ = Math.abs(aimDir.z) < 1e-6 ? Infinity : Math.abs(1 / aimDir.z)
  let tMaxX = Math.abs(aimDir.x) < 1e-6 ? Infinity : (aimDir.x >= 0 ? ix + 1 - ox : ox - ix) / Math.abs(aimDir.x)
  let tMaxY = Math.abs(aimDir.y) < 1e-6 ? Infinity : (aimDir.y >= 0 ? iy + 1 - oy : oy - iy) / Math.abs(aimDir.y)
  let tMaxZ = Math.abs(aimDir.z) < 1e-6 ? Infinity : (aimDir.z >= 0 ? iz + 1 - oz : oz - iz) / Math.abs(aimDir.z)
  let nx = 0
  let ny = 1
  let nz = 0
  let distance = 0
  for (let i = 0; i < 64; i += 1) {
    const key = `${ix},${iy},${iz}`
    const block = world.blocks.get(key)
    if (block) {
      return {
        block,
        key,
        distance,
        normal: new THREE.Vector3(nx, ny, nz),
      }
    }
    if (tMaxX > 7 && tMaxY > 7 && tMaxZ > 7) return null
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      ix += stepX
      distance = tMaxX
      tMaxX += tDeltaX
      nx = -stepX
      ny = 0
      nz = 0
    } else if (tMaxY < tMaxZ) {
      iy += stepY
      distance = tMaxY
      tMaxY += tDeltaY
      nx = 0
      ny = -stepY
      nz = 0
    } else {
      iz += stepZ
      distance = tMaxZ
      tMaxZ += tDeltaZ
      nx = 0
      ny = 0
      nz = -stepZ
    }
    if (distance > 7) return null
  }
  return null
}

function updateAim() {
  const target = getTarget()
  if (!target) {
    highlight.visible = false
    crosshair.classList.remove('hot')
    targetTag.classList.remove('show')
    return null
  }
  const block = target.block
  highlight.visible = true
  highlight.position.set(block.x, block.y, block.z)
  crosshair.classList.add('hot')
  targetTag.textContent = `${BLOCK_LABELS[block.type] || 'BLOCK'} · ${Math.round(target.distance * 10) / 10}m`
  targetTag.classList.add('show')
  return target
}

function updatePlayer(dt, elapsed) {
  const speedFactor = 1
  forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
  right.set(1, 0, 0).applyQuaternion(camera.quaternion)

  desired.set(0, 0, 0)
  if (state.keys.has('KeyW')) desired.add(forward)
  if (state.keys.has('KeyS')) desired.sub(forward)
  if (state.keys.has('KeyD')) desired.add(right)
  if (state.keys.has('KeyA')) desired.sub(right)
  if (state.keys.has('Space')) desired.y += 1
  if (state.keys.has('ShiftLeft') || state.keys.has('ShiftRight') || state.keys.has('ControlLeft')) desired.y -= 1

  if (desired.lengthSq() > 0) desired.normalize().multiplyScalar(34)
  state.velocity.addScaledVector(desired, dt)
  state.velocity.multiplyScalar(Math.exp(-3.1 * dt * speedFactor))
  const speed = state.velocity.length()
  if (speed > 7.4) state.velocity.multiplyScalar(7.4 / speed)

  state.pos.addScaledVector(state.velocity, dt)
  state.pos.x = THREE.MathUtils.clamp(state.pos.x, -25.5, 25.5)
  state.pos.z = THREE.MathUtils.clamp(state.pos.z, -25.5, 25.5)

  const cellX = Math.round(state.pos.x)
  const cellZ = Math.round(state.pos.z)
  let ground = -16
  for (let y = Math.floor(state.pos.y - 1); y >= -16; y -= 1) {
    if (world.blocks.has(`${cellX},${y},${cellZ}`)) {
      ground = y
      break
    }
  }
  const minY = ground + 1.8
  state.pos.y = Math.max(state.pos.y, minY)
  state.pos.y = Math.min(state.pos.y, WATER_Y + 1.25)
  if (state.pos.y === minY) state.velocity.y = Math.max(0, state.velocity.y)

  camera.position.copy(state.pos)
  const moving = Math.min(1, state.velocity.length() / 5)
  camera.position.y += Math.sin(elapsed * 5.2) * 0.016 * moving
  camera.position.x += Math.cos(elapsed * 3.7) * 0.01 * moving
  camera.rotation.y = state.yaw
  camera.rotation.x = state.pitch

  updateAir(dt)
}

function updateAir(dt) {
  if (state.blackout) return
  if (state.pos.y > WATER_Y - 1.3) {
    state.air = Math.min(100, state.air + 26 * dt)
  } else {
    state.air = Math.max(0, state.air - 1.5 * dt)
  }
  if (state.air <= 0) {
    state.blackout = true
    document.body.classList.add('blackout')
    showToast('AIR DEPLETED · RETURNING TO THE SURFACE', 2600)
    window.setTimeout(() => {
      state.pos.copy(world.spawn)
      state.velocity.set(0, 0, 0)
      state.air = 100
      state.blackout = false
      document.body.classList.remove('blackout')
      document.body.classList.remove('low-air')
      camera.position.copy(state.pos)
      showToast('You gasp back to life', 1800)
    }, 1100)
  }
  document.body.classList.toggle('low-air', state.air < 26 && state.air > 0.2 && !state.blackout)
}

function updateHud(elapsed) {
  const depth = Math.max(0, WATER_Y - camera.position.y)
  depthEl.textContent = depth.toFixed(1)
  airFill.style.width = `${state.air}%`
  airFill.classList.toggle('low', state.air < 30)
  airNum.textContent = String(Math.round(state.air))
  let zone = 'ABYSSAL TRENCH'
  if (depth < 3) zone = 'SUNLIT SHELF'
  else if (depth < 8) zone = 'CORAL SHELF'
  else if (depth < 14) zone = 'BLUE CHANNEL'
  zoneEl.textContent = zone

  const blips = radarBlips.querySelectorAll('.blip')
  const yaw = state.yaw
  const cos = Math.cos(yaw)
  const sin = Math.sin(yaw)
  world.relics.forEach((relic, index) => {
    const blip = blips[index]
    if (!blip) return
    if (relic.collected) {
      blip.style.display = 'none'
      return
    }
    blip.style.display = ''
    const dx = relic.position.x - camera.position.x
    const dz = relic.position.z - camera.position.z
    const rightDot = dx * cos - dz * sin
    const forwardDot = -dx * sin - dz * cos
    const dist = Math.hypot(dx, dz)
    const clamped = Math.min(1, dist / 26)
    const left = 50 + (rightDot / 26) * 50
    const top = 50 - (forwardDot / 26) * 50
    blip.style.left = `${THREE.MathUtils.clamp(left, 8, 92)}%`
    blip.style.top = `${THREE.MathUtils.clamp(top, 8, 92)}%`
    blip.classList.toggle('far', clamped > 0.78 || dist > 26)
  })

  updateNearRelicHint()
}

function updateNearRelicHint() {
  let nearest = null
  let nearestDist = Infinity
  for (const relic of world.remainingRelics()) {
    const dist = relic.position.distanceTo(camera.position)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = relic
    }
  }
  const near = nearest && nearestDist < 3.2
  if (near !== state.nearRelic) {
    state.nearRelic = near
    if (near) setHint('Press <kbd>E</kbd> to recover the relic')
    else setHint('Move with <kbd>WASD</kbd> · collect the five relics')
  }
  if (nearest && nearestDist < 9) {
    targetTag.textContent = `${nearestDist.toFixed(1)}m TO RELIC · PRESS E`
    targetTag.classList.add('show')
  }
}

function updateHand(dt, elapsed) {
  if (!state.playing) return
  const swing = Math.sin(Math.min(1, state.handSwing) * Math.PI)
  state.handSwing = Math.max(0, state.handSwing - dt * 4.2)
  const bob = Math.sin(elapsed * 1.6) * 0.006 + Math.sin(elapsed * 5.4) * 0.003 * Math.min(1, state.velocity.length() / 5)
  hand.group.position.set(0.54 - swing * 0.03, -0.64 + swing * 0.04 + bob, -0.95 + swing * 0.08)
  hand.group.rotation.set(-0.08 - swing * 0.42, -0.5 + swing * 0.06, -0.32 + swing * 0.16)
  hand.crystal.position.y = 0.54 + Math.sin(elapsed * 2.2) * 0.006
  hand.crystal.rotation.y += dt * 1.4
  hand.crystalRing.rotation.z += dt * 0.8
}

function onPointerDown(event) {
  if (!state.started) return
  if (event.pointerType === 'touch') {
    state.dragging = true
    state.lastPointerX = event.clientX
    state.lastPointerY = event.clientY
    return
  }
  if (event.button !== 0 && event.button !== 2) return
  const locked = document.pointerLockElement === canvas
  if (!locked && !state.lockFailed) {
    requestPointerLock()
    return
  }
  if (event.button === 0) mineBlock()
  else placeBlock()
}

function onPointerMove(event) {
  if (!state.started) return
  let dx = 0
  let dy = 0
  if (document.pointerLockElement === canvas) {
    dx = event.movementX || 0
    dy = event.movementY || 0
  } else if (state.dragging) {
    dx = event.clientX - state.lastPointerX
    dy = event.clientY - state.lastPointerY
    state.lastPointerX = event.clientX
    state.lastPointerY = event.clientY
  } else {
    return
  }
  state.yaw -= dx * 0.0023
  state.pitch -= dy * 0.0023
  state.pitch = THREE.MathUtils.clamp(state.pitch, -1.42, 1.42)
}

function onPointerUp() {
  state.dragging = false
}

function onKeyDown(event) {
  if (!state.started) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault()
      startGame()
    }
    return
  }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault()
  state.keys.add(event.code)
  if (event.code === 'KeyE') collectRelic()
  if (event.code.startsWith('Digit')) {
    const index = Number(event.code.slice(5)) - 1
    if (index >= 0 && index < HOTBAR.length) selectSlot(index)
  }
  if (event.code === 'KeyM') {
    audio.muted = !audio.muted
    showToast(audio.muted ? 'AUDIO MUTED' : 'AUDIO ON', 1200)
  }
}

function onKeyUp(event) {
  state.keys.delete(event.code)
}

function onWheel(event) {
  if (!state.started) return
  event.preventDefault()
  selectSlot(state.selected + (event.deltaY > 0 ? 1 : -1))
}

function onPointerLockChange() {
  state.pointerLocked = document.pointerLockElement === canvas
  if (!state.pointerLocked && state.playing) {
    state.dragging = false
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.fov = camera.aspect < 0.9 ? 80 : 72
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(lowQuality ? 0.68 : Math.min(window.devicePixelRatio || 1, 1.65))
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function createOverlayBubbles() {
  const container = document.getElementById('overlayBubbles')
  const random = (() => {
    let seed = 12345
    return () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
  })()
  for (let i = 0; i < 18; i += 1) {
    const bubble = document.createElement('i')
    const size = 2 + random() * 13
    bubble.style.left = `${random() * 100}%`
    bubble.style.setProperty('--s', `${size}px`)
    bubble.style.setProperty('--d', `${8 + random() * 13}s`)
    bubble.style.setProperty('--delay', `${-random() * 20}s`)
    bubble.style.setProperty('--drift', `${(random() - 0.5) * 70}px`)
    bubble.style.opacity = '0'
    container.appendChild(bubble)
  }
}

function idleCamera(elapsed) {
  state.yaw = Math.sin(elapsed * 0.11) * 0.07
  state.pitch = -0.07 + Math.sin(elapsed * 0.09) * 0.025
  camera.position.copy(state.pos)
  camera.position.x += Math.sin(elapsed * 0.17) * 0.18
  camera.position.y += Math.sin(elapsed * 0.23) * 0.06
  camera.rotation.y = state.yaw
  camera.rotation.x = state.pitch
}

const clock = new THREE.Clock()

function startLoop() {
  if (state.loopStarted) return
  state.loopStarted = true
  clock.start()
  requestAnimationFrame(animate)
}

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(0.05, clock.getDelta())
  const elapsed = clock.elapsedTime
  state.elapsed = elapsed

  world.update(dt, elapsed)

  if (state.started) {
    updatePlayer(dt, elapsed)
    updateAim()
    updateHand(dt, elapsed)
    state.hudTimer += dt
    if (state.hudTimer >= 0.05) {
      state.hudTimer = 0
      updateHud(elapsed)
    }
  } else {
    idleCamera(elapsed)
  }

  renderer.render(scene, camera)
}

buildHotbar()
updateRelicHud()
createOverlayBubbles()

playBtn.addEventListener('click', startGame)
resumeBtn.addEventListener('click', () => {
  completePanel.classList.remove('show')
  requestPointerLock()
})

function bindTouchControls() {
  const ui = document.getElementById('touchUI')
  ui.querySelectorAll('[data-hold]').forEach((button) => {
    const code = button.dataset.hold
    const press = (event) => {
      event.preventDefault()
      try { button.setPointerCapture(event.pointerId) } catch {}
      state.keys.add(code)
      button.classList.add('active')
    }
    const release = () => {
      state.keys.delete(code)
      button.classList.remove('active')
    }
    button.addEventListener('pointerdown', press)
    button.addEventListener('pointerup', release)
    button.addEventListener('pointercancel', release)
    button.addEventListener('lostpointercapture', release)
  })
  ui.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      const action = button.dataset.action
      if (action === 'mine') mineBlock()
      if (action === 'place') placeBlock()
      if (action === 'relic') collectRelic()
    })
  })
}

bindTouchControls()
canvas.addEventListener('pointerdown', onPointerDown)
window.addEventListener('pointermove', onPointerMove)
window.addEventListener('pointerup', onPointerUp)
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.addEventListener('wheel', onWheel, { passive: false })
window.addEventListener('resize', onResize)
window.addEventListener('blur', () => state.keys.clear())
window.addEventListener('contextmenu', (event) => event.preventDefault())
document.addEventListener('pointerlockchange', onPointerLockChange)

window.__abyss = {
  scene,
  world,
  camera,
  renderer,
  state,
  lowQuality,
  probe,
  THREE,
  actions: { mineBlock, placeBlock, collectRelic, startGame, selectSlot, getTarget, updateAim },
}

renderer.setClearColor(0x031d27, 1)
renderer.clear()
