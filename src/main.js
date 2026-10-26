import * as THREE from 'three'
import { buildWorld, CITY } from './world.js'
import { Car } from './vehicles.js'
import { Player, Pedestrian, Officer } from './characters.js'
import { PoliceUnit, randomRoadSpawn } from './police.js'
import { CityAudio } from './audio.js'
import { clamp, damp, dampAngle, rand, randInt, choice, resolveCircle } from './utils.js'

const canvas = document.getElementById('scene')
const hud = document.getElementById('hud')
const menuEl = document.getElementById('menu')
const pauseEl = document.getElementById('pause')
const endEl = document.getElementById('endScreen')
const endTitle = document.getElementById('endTitle')
const endText = document.getElementById('endText')
const startBtn = document.getElementById('startBtn')
const resumeBtn = document.getElementById('resumeBtn')
const quitBtn = document.getElementById('quitBtn')
const respawnBtn = document.getElementById('respawnBtn')
const starsEl = document.getElementById('stars')
const cashEl = document.getElementById('cashText')
const healthFill = document.getElementById('healthFill')
const healthText = document.getElementById('healthText')
const missionText = document.getElementById('missionText')
const minimap = document.getElementById('minimap')
const mctx = minimap.getContext('2d')
const speedo = document.getElementById('speedo')
const speedText = document.getElementById('speedText')
const speedFill = document.getElementById('speedFill')
const carHealthFill = document.getElementById('carHealthFill')
const crosshair = document.getElementById('crosshair')
const promptEl = document.getElementById('prompt')
const toastsEl = document.getElementById('toasts')
const touchControls = document.getElementById('touchControls')
const joyBase = document.getElementById('joyBase')
const joyKnob = document.getElementById('joyKnob')
const touchEnter = document.getElementById('touchEnter')
const touchFire = document.getElementById('touchFire')
const touchJump = document.getElementById('touchJump')
const touchSprint = document.getElementById('touchSprint')
const touchHorn = document.getElementById('touchHorn')
const touchPause = document.getElementById('touchPause')
const touchParams = new URLSearchParams(window.location.search)
const touchEnabled =
  touchParams.get('touch') === '1' ||
  (touchParams.get('touch') !== '0' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(max-width: 780px)').matches))
const touch = {
  active: false,
  id: null,
  x: 0,
  y: 0,
  sprint: false,
  fire: false,
  lookId: null,
  lastX: 0,
  lastY: 0
}
if (touchEnabled) {
  document.body.classList.add('touch')
  const menuFoot = document.getElementById('menuFoot')
  if (menuFoot) menuFoot.textContent = 'Touch · Joystick + Action Buttons'
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.45
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x6d5568, 0.0017)

const camera = new THREE.PerspectiveCamera(61, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(120, 80, 120)

const sunDir = new THREE.Vector3(0.12, 0.46, 0.88).normalize()
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(950, 32, 18),
  new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x1c2247) },
      midColor: { value: new THREE.Color(0xa2607f) },
      bottomColor: { value: new THREE.Color(0xffa061) },
      sunColor: { value: new THREE.Color(0xffd9a0) },
      sunDir: { value: sunDir.clone() }
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform vec3 sunColor;
      uniform vec3 sunDir;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(bottomColor, midColor, smoothstep(0.02, 0.36, h));
        col = mix(col, topColor, smoothstep(0.34, 0.92, h));
        float sd = max(dot(d, normalize(sunDir)), 0.0);
        col += sunColor * (pow(sd, 380.0) * 2.6 + pow(sd, 14.0) * 0.28 + pow(sd, 3.0) * 0.07);
        col = mix(col, bottomColor, pow(1.0 - abs(d.y), 9.0) * 0.28);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
    toneMapped: false
  })
)
scene.add(sky)

const hemi = new THREE.HemisphereLight(0x9db6e8, 0x7a5848, 2.4)
scene.add(hemi)
scene.add(new THREE.AmbientLight(0x5f6070, 1.15))

const sun = new THREE.DirectionalLight(0xffc08a, 4.1)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.near = 1
sun.shadow.camera.far = 520
sun.shadow.camera.left = -155
sun.shadow.camera.right = 155
sun.shadow.camera.top = 155
sun.shadow.camera.bottom = -155
sun.shadow.bias = -0.0004
sun.shadow.normalBias = 0.025
scene.add(sun)
scene.add(sun.target)
const sunOffset = new THREE.Vector3(22, 128, 158)

const fill = new THREE.DirectionalLight(0x7282ff, 0.9)
fill.position.set(-120, 70, -110)
scene.add(fill)

const world = buildWorld(scene)
const audio = new CityAudio()

const lampLights = []
for (let i = 0; i < 5; i++) {
  const light = new THREE.PointLight(0xffb066, 0, 32, 2)
  light.position.set(0, 6.4, 0)
  scene.add(light)
  lampLights.push(light)
}
let lampTimer = 0

function updateLampLights(dt) {
  lampTimer -= dt
  if (lampTimer > 0) return
  lampTimer = 0.18
  const target = playerTargetPos()
  const sorted = world.streetLights
    .map((p) => ({ p, d: (p[0] - target.x) ** 2 + (p[1] - target.z) ** 2 }))
    .sort((a, b) => a.d - b.d)
  for (let i = 0; i < lampLights.length; i++) {
    const entry = sorted[i]
    if (!entry) continue
    lampLights[i].position.set(entry.p[0], 6.4, entry.p[1])
    lampLights[i].intensity = 210
  }
}

const player = new Player(scene, world)
player.pos.set(0, 0, 0)
player.root.position.copy(player.pos)

const cars = []
const peds = []
const officers = []
const policeUnits = []
const effects = []
const pickups = []

const starterCar = new Car(scene, {
  type: 'sports',
  color: 0x4fe0ff,
  position: { x: 0, z: 4.6 },
  heading: 0,
  driver: 'parked'
})
cars.push(starterCar)

for (let i = 0; i < CITY.GRID; i++) {
  for (let j = 0; j < CITY.GRID; j++) {
    const bx = -CITY.HALF + (i + 0.5) * CITY.CELL
    const bz = -CITY.HALF + (j + 0.5) * CITY.CELL
    if (Math.random() < 0.5) {
      const side = randInt(0, 3)
      const type = choice(['sedan', 'sedan', 'suv', 'sports'])
      let x = bx
      let z = bz
      let heading = 0
      if (side === 0) {
        z = bz - CITY.BLOCK / 2 - 2.4
        x = bx + rand(-17, 17)
        heading = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2
      } else if (side === 1) {
        z = bz + CITY.BLOCK / 2 + 2.4
        x = bx + rand(-17, 17)
        heading = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2
      } else if (side === 2) {
        x = bx - CITY.BLOCK / 2 - 2.4
        z = bz + rand(-17, 17)
        heading = Math.random() < 0.5 ? 0 : Math.PI
      } else {
        x = bx + CITY.BLOCK / 2 + 2.4
        z = bz + rand(-17, 17)
        heading = Math.random() < 0.5 ? 0 : Math.PI
      }
      if (Math.hypot(x - 0, z - 4.6) < 12) continue
      cars.push(new Car(scene, { type, position: { x, z }, heading, driver: 'parked' }))
    }
  }
}

function spawnTrafficCar() {
  for (let attempt = 0; attempt < 40; attempt++) {
    const axis = Math.random() < 0.5 ? 'x' : 'z'
    const r = randInt(0, CITY.ROAD_COORDS.length - 1)
    const dir = Math.random() < 0.5 ? 1 : -1
    const road = CITY.ROAD_COORDS[r]
    const lane = 4
    let x
    let z
    let heading
    if (axis === 'x') {
      x = rand(-CITY.HALF, CITY.HALF)
      z = road - dir * lane
      heading = dir > 0 ? Math.PI / 2 : -Math.PI / 2
    } else {
      z = rand(-CITY.HALF, CITY.HALF)
      x = road + dir * lane
      heading = dir > 0 ? 0 : Math.PI
    }
    if (Math.hypot(x, z) < 18) continue
    let clear = true
    for (const car of cars) {
      if (car.destroyed) continue
      if (Math.hypot(car.pos.x - x, car.pos.z - z) < 7) {
        clear = false
        break
      }
    }
    if (!clear) continue
    const type = choice(['sedan', 'sedan', 'sedan', 'suv', 'sports'])
    const car = new Car(scene, {
      type,
      position: { x, z },
      heading,
      driver: 'traffic'
    })
    car.traffic = { axis, dir, speed: rand(7.5, 12.5) }
    cars.push(car)
    return
  }
}
for (let i = 0; i < 17; i++) spawnTrafficCar()

for (let i = 0; i < CITY.GRID; i++) {
  for (let j = 0; j < CITY.GRID; j++) {
    const bx = -CITY.HALF + (i + 0.5) * CITY.CELL
    const bz = -CITY.HALF + (j + 0.5) * CITY.CELL
    const count = randInt(1, 2)
    for (let k = 0; k < count; k++) {
      peds.push(new Pedestrian(scene, world, bx, bz))
    }
  }
}

const coinGeo = new THREE.OctahedronGeometry(0.42, 0)
const coinMat = new THREE.MeshStandardMaterial({
  color: 0xffd75e,
  emissive: 0xffb01e,
  emissiveIntensity: 2.1,
  roughness: 0.25,
  metalness: 0.65
})
const ringGeo = new THREE.TorusGeometry(0.68, 0.035, 8, 26)
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xffcf5e,
  transparent: true,
  opacity: 0.55,
  toneMapped: false
})
for (const spot of world.cashSpots) {
  const group = new THREE.Group()
  const coin = new THREE.Mesh(coinGeo, coinMat)
  coin.rotation.x = 0.3
  group.add(coin)
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2
  group.add(ring)
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.55, 3.4, 10, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffc84d,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false
    })
  )
  beam.position.y = 1.0
  group.add(beam)
  group.position.set(spot.x, 1.15, spot.z)
  scene.add(group)
  pickups.push({ group, coin, ring, baseY: 1.15, phase: rand(0, 6.28), collected: false, pos: spot })
}

for (let i = 0; i < 5; i++) {
  const span = document.createElement('span')
  span.textContent = '★'
  starsEl.appendChild(span)
}

let state = 'menu'
let wanted = 0
let cash = 0
let collected = 0
let crimeTimer = 0
let decayTimer = 0
let spawnTimer = 0
let elapsed = 0
let menuTime = 0
let camYaw = 0
let camPitch = 0.3
let shake = 0
let sinceDamage = 10
let playerHitCooldown = 0
const keys = {}

const raycaster = new THREE.Raycaster()
raycaster.far = 150
let lastTime = performance.now()

function playerTargetPos() {
  return player.inCar ? player.inCar.pos : player.pos
}

function notify(text, kind = '') {
  const el = document.createElement('div')
  el.className = `toast ${kind}`.trim()
  el.textContent = text
  toastsEl.appendChild(el)
  while (toastsEl.children.length > 4) toastsEl.firstChild.remove()
  setTimeout(() => {
    el.classList.add('out')
    setTimeout(() => el.remove(), 400)
  }, 2600)
}

function updateStars() {
  const spans = starsEl.children
  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.toggle('lit', i < wanted)
  }
}

function addWanted(amount, reason) {
  if (state !== 'playing' || amount <= 0) return
  const prev = wanted
  wanted = clamp(wanted + amount, 0, 5)
  crimeTimer = 0
  decayTimer = 0
  if (wanted > prev) {
    updateStars()
    audio.wantedUp()
    if (reason) notify(reason, 'hot')
    spawnTimer = 0
  }
}

function damagePlayer(amount) {
  if (state !== 'playing' || !player.alive) return
  player.health = Math.max(0, player.health - amount)
  sinceDamage = 0
  shake = Math.max(shake, 0.45)
  if (player.health <= 0) {
    player.alive = false
    endGame('wasted')
  }
}

function startGame() {
  if (state !== 'menu') return
  audio.init()
  state = 'playing'
  menuEl.classList.add('hidden')
  hud.classList.remove('hidden')
  resetTouchInputs()
  camYaw = player.heading
  camPitch = 0.3
  updateStars()
  updateHud()
  updateCamera(1)
  notify('WELCOME TO SUNSET CITY', 'gold')
  setTimeout(() => {
    if (state === 'playing' && !player.inCar) {
      notify(
        touchEnabled ? 'DRAG TO LOOK · TAP ENTER TO STEAL THE CAR' : 'CLICK THE STREET TO LOOK · E TO STEAL THE CAR',
        'cyan'
      )
    }
  }, 1400)
}

function setPaused(paused) {
  if (paused && state === 'playing') {
    state = 'paused'
    pauseEl.classList.remove('hidden')
    if (document.pointerLockElement) document.exitPointerLock()
    resetTouchInputs()
    audio.setEngine(0, 30)
    audio.setSiren(false, elapsed)
  } else if (!paused && state === 'paused') {
    state = 'playing'
    pauseEl.classList.add('hidden')
  }
  updateTouchVisibility()
}

function endGame(kind) {
  if (state !== 'playing') return
  state = kind
  endTitle.textContent = kind === 'busted' ? 'BUSTED' : 'WASTED'
  endText.textContent =
    kind === 'busted'
      ? 'The cops got you. The city always wins.'
      : 'You went down hard. The city chewed you up.'
  endEl.classList.remove('hidden')
  crosshair.classList.add('hidden')
  if (document.pointerLockElement) document.exitPointerLock()
  resetTouchInputs()
  updateTouchVisibility()
  audio.setEngine(0, 30)
  audio.setSiren(false, elapsed)
  audio.busted()
}

function clearPolice() {
  for (const unit of policeUnits) {
    if (unit.car.group.parent) unit.car.group.removeFromParent()
    const idx = cars.indexOf(unit.car)
    if (idx >= 0) cars.splice(idx, 1)
  }
  policeUnits.length = 0
  for (const officer of officers) {
    officer.root.removeFromParent()
  }
  officers.length = 0
}

function respawn() {
  if (player.inCar) {
    const car = player.inCar
    car.setPlayerControlled(false)
    car.driver = 'parked'
    player.inCar = null
    player.root.visible = true
  }
  clearPolice()
  player.health = 100
  player.alive = true
  player.speed = 0
  player.velY = 0
  player.pos.set(0, 0, 0)
  player.heading = 0
  player.root.position.copy(player.pos)
  player.root.rotation.y = 0
  wanted = 0
  crimeTimer = 0
  decayTimer = 0
  sinceDamage = 10
  updateStars()
  endEl.classList.add('hidden')
  hud.classList.remove('hidden')
  crosshair.classList.remove('hidden')
  resetTouchInputs()
  state = 'playing'
  camYaw = 0
  camPitch = 0.3
  updateHud()
  updateCamera(1)
  notify('BACK ON THE STREET', 'cyan')
}

function enterVehicle() {
  touch.fire = false
  touch.sprint = false
  touch.lookId = null
  if (player.inCar) {
    const car = player.inCar
    const right = new THREE.Vector3(Math.cos(car.heading), 0, -Math.sin(car.heading))
    const spot = car.pos.clone().add(right.multiplyScalar(2.4))
    const solved = resolveCircle(spot.x, spot.z, player.radius, world.colliders)
    player.pos.set(solved.x, 0, solved.z)
    player.root.position.copy(player.pos)
    player.heading = car.heading
    player.root.rotation.y = player.heading
    player.root.visible = true
    player.inCar = null
    car.setPlayerControlled(false)
    car.driver = 'parked'
    car.velocity.multiplyScalar(0.2)
    camYaw = player.heading
    audio.setEngine(0, 30)
    updateCamera(1)
    notify('VEHICLE PARKED', 'cyan')
    return
  }

  let best = null
  let bestDist = 5.0
  const ppos = player.pos
  for (const car of cars) {
    if (car.destroyed) continue
    const d = car.pos.distanceTo(ppos)
    if (d < bestDist) {
      bestDist = d
      best = car
    }
  }
  if (!best) return

  if (best.driver === 'police') {
    for (let i = policeUnits.length - 1; i >= 0; i--) {
      if (policeUnits[i].car === best) policeUnits.splice(i, 1)
    }
    best.updateSiren(elapsed, false)
    addWanted(1, 'POLICE CRUISER STOLEN')
  } else if (best.driver === 'traffic') {
    addWanted(1, 'CARJACKING')
    best.traffic = null
  }

  player.inCar = best
  player.root.visible = false
  best.driver = 'player'
  best.setPlayerControlled(true)
  best.velocity.set(0, 0, 0)
  best.speed = 0
  camYaw = best.heading
  player.pos.copy(best.pos)
  audio.setEngine(0, best.maxSpeed)
  updateCamera(1)
  notify(`${best.type.toUpperCase()} ACQUIRED`, 'gold')
}

function shoot() {
  if (state !== 'playing' || player.inCar || !player.alive) return
  if (player.fireCooldown > 0) return
  player.fireCooldown = 0.22
  audio.shoot()
  const origin = player.getMuzzle()
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  raycaster.set(camera.position, dir)
  const hits = raycaster.intersectObjects(scene.children, true)
  let hitPoint = camera.position.clone().add(dir.clone().multiplyScalar(90))
  let hitEntity = null
  for (const hit of hits) {
    let obj = hit.object
    let entity = null
    while (obj) {
      if (obj.userData && obj.userData.entity) {
        entity = obj.userData.entity
        break
      }
      obj = obj.parent
    }
    if (entity === player) continue
    if (obj === sky) continue
    hitPoint = hit.point
    hitEntity = entity
    break
  }

  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0xffdf9a,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
  )
  flash.position.copy(origin)
  scene.add(flash)
  effects.push({ type: 'flash', mesh: flash, life: 0.06, max: 0.06 })

  const tracerGeo = new THREE.BufferGeometry().setFromPoints([origin, hitPoint])
  const tracer = new THREE.Line(
    tracerGeo,
    new THREE.LineBasicMaterial({
      color: 0xffe3a0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
  )
  scene.add(tracer)
  effects.push({ type: 'tracer', mesh: tracer, life: 0.09, max: 0.09 })

  if (hitEntity instanceof Pedestrian) {
    if (!hitEntity.dead) {
      hitEntity.die(dir)
      addWanted(1, 'CIVILIAN DOWN')
    }
  } else if (hitEntity instanceof Officer) {
    if (!hitEntity.dead) {
      hitEntity.die(dir)
      addWanted(2, 'OFFICER DOWN')
    }
  } else if (hitEntity instanceof Car) {
    hitEntity.damage(hitEntity.police ? 34 : 22)
    addWanted(hitEntity.police ? 1 : 1, 'RECKLESS DISCHARGE')
  } else {
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffc46b, transparent: true, opacity: 1, toneMapped: false })
    )
    spark.position.copy(hitPoint)
    scene.add(spark)
    effects.push({ type: 'flash', mesh: spark, life: 0.12, max: 0.12 })
  }
}

function explode(pos) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 18, 12),
    new THREE.MeshBasicMaterial({
      color: 0xff9a3c,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
  )
  mesh.position.copy(pos)
  mesh.position.y += 1.1
  scene.add(mesh)
  const light = new THREE.PointLight(0xff8833, 850, 60, 2)
  light.position.copy(mesh.position)
  scene.add(light)
  effects.push({ type: 'explosion', mesh, light, life: 0.75, max: 0.75 })
  shake = Math.max(shake, 0.85)
}

function spawnPolice() {
  const target = playerTargetPos()
  const spot = randomRoadSpawn(target, cars)
  if (!spot) return
  const car = new Car(scene, {
    police: true,
    type: 'sedan',
    position: { x: spot.x, z: spot.z },
    heading: 0,
    driver: 'police',
    maxSpeed: 26,
    turnRate: 0.16
  })
  cars.push(car)
  const unit = new PoliceUnit(scene, world, car, player)
  if (unit.path.length) {
    car.heading = Math.atan2(unit.path[0].x - car.pos.x, unit.path[0].z - car.pos.z)
    car.group.rotation.y = car.heading
  }
  policeUnits.push(unit)
}

function spawnOfficer(spot) {
  if (officers.length >= 8) return false
  officers.push(new Officer(scene, world, spot))
  return true
}

function setJoystickPosition(e) {
  if (!joyBase || !joyKnob) return
  const r = joyBase.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const max = r.width * 0.31
  let dx = e.clientX - cx
  let dy = e.clientY - cy
  const len = Math.hypot(dx, dy)
  if (len > max) {
    dx = (dx / len) * max
    dy = (dy / len) * max
  }
  joyKnob.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
  const nx = dx / max
  const ny = -dy / max
  if (Math.hypot(nx, ny) < 0.14) {
    touch.x = 0
    touch.y = 0
  } else {
    touch.x = nx
    touch.y = ny
  }
}

function resetJoystick() {
  touch.active = false
  touch.id = null
  touch.x = 0
  touch.y = 0
  if (joyKnob) joyKnob.style.transform = 'translate(-50%, -50%)'
}

function resetTouchInputs() {
  touch.fire = false
  touch.sprint = false
  touch.lookId = null
  resetJoystick()
  keys.Space = false
  for (const el of [touchEnter, touchFire, touchJump, touchSprint, touchHorn, touchPause]) {
    if (el) el.classList.remove('pressed')
  }
}

function updateTouchVisibility() {
  if (!touchEnabled || !touchControls) return
  const inCar = !!player.inCar
  touchControls.classList.toggle('hidden', state !== 'playing')
  touchControls.classList.toggle('incar', inCar)
  const enterLabel = touchEnter && touchEnter.querySelector('.touch-label')
  if (enterLabel) enterLabel.textContent = inCar ? 'EXIT' : 'ENTER'
  const jumpLabel = touchJump && touchJump.querySelector('.touch-label')
  if (jumpLabel) jumpLabel.textContent = inCar ? 'DRIFT' : 'JUMP'
  const jumpKey = touchJump && touchJump.querySelector('.touch-key')
  if (jumpKey) jumpKey.textContent = inCar ? '\u21c4' : '\u2191'
}

function updatePlayer(dt) {
  if (player.inCar) {
    const car = player.inCar
    if (car.destroyed) return
    const useTouch = touchEnabled && touch.active
    const input = {
      throttle: useTouch ? Math.max(0, touch.y) : keys.KeyW ? 1 : 0,
      brake: useTouch ? Math.max(0, -touch.y) : keys.KeyS ? 1 : 0,
      steer: useTouch ? touch.x : (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0),
      handbrake: !!keys.Space
    }
    car.applyInput(dt, input, world.colliders)
    player.pos.copy(car.pos)
    player.heading = car.heading
    if (car.health <= 0) car.destroyed = true
  } else {
    const analog =
      touchEnabled && touch.active && Math.hypot(touch.x, touch.y) > 0.12
        ? { x: touch.x, y: touch.y, sprint: touch.sprint }
        : null
    player.update(dt, keys, camYaw, world.colliders, analog)
  }
}

function updateTraffic(dt) {
  const ppos = playerTargetPos()
  const right = new THREE.Vector3()
  const fwd = new THREE.Vector3()
  for (const car of cars) {
    if (car.driver !== 'traffic' || car.destroyed) continue
    const tr = car.traffic
    if (!tr) continue
    fwd.set(Math.sin(car.heading), 0, Math.cos(car.heading))
    right.set(Math.cos(car.heading), 0, -Math.sin(car.heading))
    let targetSpeed = tr.speed

    for (const other of cars) {
      if (other === car || other.destroyed) continue
      if (other.driver !== 'traffic' && other.driver !== 'player' && other.driver !== 'police') continue
      const dx = other.pos.x - car.pos.x
      const dz = other.pos.z - car.pos.z
      const ahead = dx * fwd.x + dz * fwd.z
      if (ahead > 0 && ahead < 11) {
        const lat = Math.abs(dx * right.x + dz * right.z)
        if (lat < 2.8) targetSpeed = Math.min(targetSpeed, Math.max(0, (ahead - 3.2) * 1.3))
      }
    }

    if (!player.inCar) {
      const dx = ppos.x - car.pos.x
      const dz = ppos.z - car.pos.z
      const ahead = dx * fwd.x + dz * fwd.z
      const lat = Math.abs(dx * right.x + dz * right.z)
      if (ahead > 0 && ahead < 9 && lat < 2.4) targetSpeed = Math.min(targetSpeed, Math.max(0, (ahead - 3) * 1.4))
    }

    car.driveTraffic(dt, targetSpeed)

    if (tr.axis === 'x') {
      if (car.pos.x > CITY.HALF + 28) car.pos.x = -CITY.HALF - 28
      else if (car.pos.x < -CITY.HALF - 28) car.pos.x = CITY.HALF + 28
    } else {
      if (car.pos.z > CITY.HALF + 28) car.pos.z = -CITY.HALF - 28
      else if (car.pos.z < -CITY.HALF - 28) car.pos.z = CITY.HALF + 28
    }
  }
}

function updatePolice(dt) {
  for (const unit of policeUnits) {
    unit.update(dt, elapsed, world.colliders, wanted, spawnOfficer)
  }
  for (let i = policeUnits.length - 1; i >= 0; i--) {
    const unit = policeUnits[i]
    if (unit.remove) {
      if (unit.car.group.parent) unit.car.group.removeFromParent()
      const idx = cars.indexOf(unit.car)
      if (idx >= 0) cars.splice(idx, 1)
      policeUnits.splice(i, 1)
    }
  }
}

function updatePeds(dt) {
  for (const ped of peds) {
    ped.update(dt, player, wanted, world.colliders)
  }
  for (const officer of officers) {
    officer.update(dt, player, world.colliders)
  }
}

function handleCollisions(dt) {
  if (player.inCar && !player.inCar.destroyed) {
    const car = player.inCar
    if (Math.abs(car.speed) > 3) {
      for (const ped of peds) {
        if (ped.dead) continue
        const d = ped.pos.distanceTo(car.pos)
        if (d < 2.4) {
          const dir = ped.pos.clone().sub(car.pos).setY(0).normalize()
          ped.die(dir)
          addWanted(1, 'HIT AND RUN')
          audio.crash()
          shake = Math.max(shake, 0.3)
        }
      }
      for (const officer of officers) {
        if (officer.dead) continue
        const d = officer.pos.distanceTo(car.pos)
        if (d < 2.3) {
          const dir = officer.pos.clone().sub(car.pos).setY(0).normalize()
          officer.die(dir)
          addWanted(2, 'OFFICER DOWN')
          audio.crash()
        }
      }
    }

    for (const unit of policeUnits) {
      if (unit.ramCooldown > 0) continue
      const d = unit.car.pos.distanceTo(car.pos)
      if (d < 3.7) {
        const dir = car.pos.clone().sub(unit.car.pos).setY(0).normalize()
        car.velocity.add(dir.clone().multiplyScalar(7.5))
        car.health -= 4.5
        unit.car.velocity.add(dir.clone().multiplyScalar(-4.5))
        unit.ramCooldown = 1.2
        audio.crash()
        shake = Math.max(shake, 0.4)
      }
    }

    for (const other of cars) {
      if (other === car || other.destroyed) continue
      if (other.driver === 'traffic' || other.driver === 'police') {
        const d = other.pos.distanceTo(car.pos)
        if (d < 3.1) {
          const dir = car.pos.clone().sub(other.pos).setY(0).normalize()
          car.velocity.add(dir.multiplyScalar(2.5))
          car.health -= 1.2
          other.velocity.multiplyScalar(0.6)
          audio.crash()
        }
      }
    }
  } else if (!player.inCar) {
    playerHitCooldown -= dt
    for (const car of cars) {
      if (car.driver !== 'traffic' || car.destroyed) continue
      if (Math.abs(car.speed) < 4) continue
      const d = car.pos.distanceTo(player.pos)
      if (d < 2.5 && playerHitCooldown <= 0) {
        const dir = player.pos.clone().sub(car.pos).setY(0).normalize()
        player.pos.add(dir.multiplyScalar(2.2))
        const solved = resolveCircle(player.pos.x, player.pos.z, player.radius, world.colliders)
        player.pos.x = solved.x
        player.pos.z = solved.z
        playerHitCooldown = 1.2
        damagePlayer(26)
        audio.crash()
        notify('WATCH THE TRAFFIC', 'hot')
      }
    }

    for (const officer of officers) {
      if (officer.dead) continue
      if (officer.pos.distanceTo(player.pos) < 2.0) {
        endGame('busted')
        return
      }
    }
  }
}

function handleDestroyedCars() {
  for (const car of cars) {
    if (car.destroyed && !car.exploded) {
      car.exploded = true
      car.group.visible = false
      explode(car.pos)
      audio.explosion()
      if (player.inCar === car) {
        const right = new THREE.Vector3(Math.cos(car.heading), 0, -Math.sin(car.heading))
        const spot = car.pos.clone().add(right.multiplyScalar(2.6))
        const solved = resolveCircle(spot.x, spot.z, player.radius, world.colliders)
        player.pos.set(solved.x, 0, solved.z)
        player.root.position.copy(player.pos)
        player.root.visible = true
        player.inCar = null
        car.setPlayerControlled(false)
        damagePlayer(18)
      }
      if (car.police) addWanted(1, 'POLICE CAR WRECKED')
    }
  }
}

function updateWanted(dt) {
  if (wanted <= 0) return
  crimeTimer += dt
  spawnTimer -= dt
  if (wanted > 0 && policeUnits.length < Math.min(wanted, 4) && spawnTimer <= 0) {
    spawnPolice()
    spawnTimer = 3.2
  }
  if (crimeTimer > 16) {
    const target = playerTargetPos()
    let nearest = Infinity
    for (const unit of policeUnits) {
      nearest = Math.min(nearest, unit.car.pos.distanceTo(target))
    }
    if (nearest > 55) {
      decayTimer += dt
      if (decayTimer > 8) {
        wanted -= 1
        decayTimer = 0
        crimeTimer = 0
        updateStars()
        if (wanted === 0) {
          notify('YOU LOST THE COPS', 'cyan')
          spawnTimer = 0
        }
      }
    } else {
      decayTimer = 0
    }
  }
}

function updatePickups(dt) {
  const target = playerTargetPos()
  for (const p of pickups) {
    if (p.collected) continue
    p.phase += dt
    p.group.position.y = p.baseY + Math.sin(p.phase * 2.2) * 0.16
    p.coin.rotation.y += dt * 1.8
    p.ring.rotation.z += dt * 0.8
    const d = Math.hypot(p.pos.x - target.x, p.pos.z - target.z)
    if (d < 3.2) {
      p.collected = true
      p.group.visible = false
      cash += 250
      collected += 1
      audio.pickup()
      notify('CASH STASH +$250', 'gold')
      updateHud()
      if (collected >= pickups.length) {
        missionText.textContent = 'All stashes collected — free roam'
        notify('CITY CLEARED — FREE ROAM', 'gold')
      }
    }
  }
}

function updateEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i]
    e.life -= dt
    const k = Math.max(0, e.life / e.max)
    if (e.type === 'explosion') {
      const s = 1 + (1 - k) * 7
      e.mesh.scale.setScalar(s)
      e.mesh.material.opacity = k * 0.9
      e.light.intensity = 850 * k
    } else if (e.type === 'tracer') {
      e.mesh.material.opacity = k * 0.9
    } else {
      e.mesh.material.opacity = k
    }
    if (e.life <= 0) {
      if (e.mesh.parent) e.mesh.parent.remove(e.mesh)
      if (e.light && e.light.parent) e.light.parent.remove(e.light)
      if (e.mesh.geometry) e.mesh.geometry.dispose()
      if (e.mesh.material) e.mesh.material.dispose()
      effects.splice(i, 1)
    }
  }
}

function updateCamera(dt) {
  const targetPos = playerTargetPos()
  let target
  let desired
  if (player.inCar && !player.inCar.destroyed) {
    const car = player.inCar
    camYaw = dampAngle(camYaw, car.heading, 4.2, dt)
    target = car.pos.clone().add(new THREE.Vector3(0, 1.75, 0))
    const fwd = new THREE.Vector3(Math.sin(camYaw), 0, Math.cos(camYaw))
    desired = target.clone().sub(fwd.clone().multiplyScalar(8.4)).add(new THREE.Vector3(0, 3.5, 0))
    const clipped = clipCamera(target, desired)
    camera.position.lerp(clipped, 1 - Math.exp(-7.5 * dt))
    const look = target.clone().add(fwd.clone().multiplyScalar(6.5)).add(new THREE.Vector3(0, 0.5, 0))
    camera.lookAt(look)
  } else {
    target = player.pos.clone().add(new THREE.Vector3(0, 1.55, 0))
    const fwd = new THREE.Vector3(Math.sin(camYaw), 0, Math.cos(camYaw))
    const horiz = Math.cos(camPitch) * 5.8
    const vert = Math.sin(camPitch) * 5.8 + 0.45
    desired = target.clone().sub(fwd.clone().multiplyScalar(horiz)).add(new THREE.Vector3(0, vert, 0))
    const clipped = clipCamera(target, desired)
    camera.position.lerp(clipped, 1 - Math.exp(-12 * dt))
    const look = target.clone().add(fwd.clone().multiplyScalar(3.2))
    camera.lookAt(look)
  }

  if (shake > 0.001) {
    camera.position.x += rand(-1, 1) * shake
    camera.position.y += rand(-1, 1) * shake * 0.7
    camera.position.z += rand(-1, 1) * shake
    shake = damp(shake, 0, 9, dt)
  }

  const focus = player.inCar ? player.inCar.pos : player.pos
  sun.position.copy(focus).add(sunOffset)
  sun.target.position.copy(focus)
  sun.target.updateMatrixWorld()
}

function clipCamera(target, desired) {
  const steps = 14
  let last = target.clone()
  for (let i = 1; i <= steps; i++) {
    const p = target.clone().lerp(desired, i / steps)
    let blocked = false
    for (const c of world.colliders) {
      if (c.height && p.y > c.height + 0.5) continue
      if (p.x > c.minX && p.x < c.maxX && p.z > c.minZ && p.z < c.maxZ) {
        blocked = true
        break
      }
    }
    if (blocked) return last
    last = p
  }
  return desired
}

function updateMenuCamera(dt) {
  menuTime += dt
  const a = menuTime * 0.075
  camera.position.set(Math.cos(a) * 238, 104 + Math.sin(menuTime * 0.33) * 8, Math.sin(a) * 238)
  camera.lookAt(0, 24, 0)
  sun.position.copy(new THREE.Vector3(0, 0, 0)).add(sunOffset)
  sun.target.position.set(0, 0, 0)
  sun.target.updateMatrixWorld()
}

function updateHud() {
  const hp = clamp(player.health, 0, 100)
  healthFill.style.width = `${hp}%`
  healthText.textContent = Math.round(hp)
  cashEl.textContent = '$' + cash.toLocaleString('en-US')
  missionText.textContent =
    collected >= pickups.length
      ? 'All stashes collected — free roam'
      : `Collect the cash stashes · ${pickups.length - collected} left`

  if (player.inCar && !player.inCar.destroyed) {
    speedo.classList.remove('hidden')
    const kmh = Math.round(Math.abs(player.inCar.speed) * 3.6)
    speedText.textContent = kmh
    speedFill.style.width = `${clamp(Math.abs(player.inCar.speed) / player.inCar.maxSpeed, 0, 1) * 100}%`
    carHealthFill.style.width = `${clamp(player.inCar.health, 0, 100)}%`
  } else {
    speedo.classList.add('hidden')
  }

  if (state === 'playing' && !player.inCar) {
    crosshair.classList.remove('hidden')
  } else {
    crosshair.classList.add('hidden')
  }

  if (state === 'playing') {
    let prompt = ''
    let nearCar = false
    if (player.inCar) {
      prompt = '<b>E</b> — Exit vehicle'
      nearCar = true
    } else {
      let best = null
      let bestDist = 5.0
      for (const car of cars) {
        if (car.destroyed) continue
        const d = car.pos.distanceTo(player.pos)
        if (d < bestDist) {
          bestDist = d
          best = car
        }
      }
      if (best) {
        nearCar = true
        prompt = `<b>E</b> — Enter ${best.police ? 'police cruiser' : best.type}`
      }
    }
    if (touchEnabled) {
      prompt = ''
      if (touchEnter) touchEnter.classList.toggle('ready', nearCar)
    }
    if (prompt) {
      promptEl.innerHTML = prompt
      promptEl.classList.remove('hidden')
    } else {
      promptEl.classList.add('hidden')
    }
  } else {
    promptEl.classList.add('hidden')
    if (touchEnter) touchEnter.classList.remove('ready')
  }
  updateTouchVisibility()
}

function drawMinimap() {
  const size = minimap.width
  const c = size / 2
  const scale = (size * 0.47) / CITY.BOUND
  mctx.clearRect(0, 0, size, size)
  mctx.save()
  mctx.beginPath()
  mctx.arc(c, c, c - 2, 0, Math.PI * 2)
  mctx.clip()
  mctx.fillStyle = '#0a0d14'
  mctx.fillRect(0, 0, size, size)

  mctx.strokeStyle = '#343a48'
  mctx.lineWidth = CITY.ROAD * scale
  for (const r of CITY.ROAD_COORDS) {
    mctx.beginPath()
    mctx.moveTo(c + r * scale, 0)
    mctx.lineTo(c + r * scale, size)
    mctx.stroke()
    mctx.beginPath()
    mctx.moveTo(0, c + r * scale)
    mctx.lineTo(size, c + r * scale)
    mctx.stroke()
  }

  mctx.fillStyle = '#171b25'
  for (let i = 0; i < CITY.GRID; i++) {
    for (let j = 0; j < CITY.GRID; j++) {
      const bx = -CITY.HALF + (i + 0.5) * CITY.CELL
      const bz = -CITY.HALF + (j + 0.5) * CITY.CELL
      if (i === 2 && j === 2) {
        mctx.fillStyle = '#1f4030'
      } else {
        mctx.fillStyle = '#171b25'
      }
      const s = CITY.BLOCK * scale
      mctx.fillRect(c + bx * scale - s / 2, c + bz * scale - s / 2, s, s)
    }
  }

  for (const p of pickups) {
    if (p.collected) continue
    mctx.fillStyle = '#ffcf5e'
    mctx.beginPath()
    mctx.arc(c + p.pos.x * scale, c + p.pos.z * scale, 3.2, 0, Math.PI * 2)
    mctx.fill()
  }

  const blink = Math.sin(elapsed * 12) > 0
  for (const unit of policeUnits) {
    mctx.fillStyle = blink ? '#ff3d55' : '#4a7dff'
    mctx.beginPath()
    mctx.arc(c + unit.car.pos.x * scale, c + unit.car.pos.z * scale, 4.5, 0, Math.PI * 2)
    mctx.fill()
  }

  const t = playerTargetPos()
  const heading = player.inCar ? player.inCar.heading : player.heading
  mctx.save()
  mctx.translate(c + t.x * scale, c + t.z * scale)
  mctx.rotate(Math.PI - heading)
  mctx.fillStyle = '#ffffff'
  mctx.shadowColor = 'rgba(120, 220, 255, 0.9)'
  mctx.shadowBlur = 8
  mctx.beginPath()
  mctx.moveTo(0, -9)
  mctx.lineTo(-6, 7)
  mctx.lineTo(6, 7)
  mctx.closePath()
  mctx.fill()
  mctx.restore()

  mctx.restore()
}

function updatePlaying(dt) {
  sinceDamage += dt
  if (sinceDamage > 6 && player.health > 0 && player.health < 100) {
    player.health = Math.min(100, player.health + 2.2 * dt)
  }
  updatePlayer(dt)
  updateTraffic(dt)
  updatePolice(dt)
  updatePeds(dt)
  handleCollisions(dt)
  if (state !== 'playing') return
  handleDestroyedCars()
  updateWanted(dt)
  updatePickups(dt)
  updateEffects(dt)
  updateLampLights(dt)
  updateCamera(dt)
  if (touchEnabled && touch.fire) shoot()
  updateHud()
  drawMinimap()

  const target = playerTargetPos()
  let near = false
  for (const unit of policeUnits) {
    if (unit.car.pos.distanceTo(target) < 150) {
      near = true
      break
    }
  }
  audio.setSiren(wanted > 0 && near, elapsed)
  if (player.inCar && !player.inCar.destroyed) {
    audio.setEngine(player.inCar.speed, player.inCar.maxSpeed)
  } else {
    audio.setEngine(0, 30)
  }
}

function updateMenuWorld(dt) {
  updateTraffic(dt)
  updatePeds(dt)
  updatePickups(dt)
  updateLampLights(dt)
  for (const p of pickups) {
    if (p.collected) continue
    p.coin.rotation.y += dt * 1.4
  }
  updateMenuCamera(dt)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener('keydown', (e) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
  keys[e.code] = true
  if (e.code === 'Escape') {
    if (state === 'playing') setPaused(true)
    else if (state === 'paused') setPaused(false)
  }
  if (state === 'playing' && e.code === 'KeyE' && !e.repeat) enterVehicle()
  if (state === 'playing' && e.code === 'KeyH' && !e.repeat) audio.horn()
  if (state === 'menu' && (e.code === 'Enter' || e.code === 'Space')) startGame()
})

window.addEventListener('keyup', (e) => {
  keys[e.code] = false
})

window.addEventListener('blur', () => {
  for (const k in keys) keys[k] = false
  resetTouchInputs()
})

canvas.addEventListener('mousedown', (e) => {
  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return
  if (state !== 'playing') return
  if (document.pointerLockElement !== canvas) {
    if (canvas.requestPointerLock) {
      const p = canvas.requestPointerLock()
      if (p && p.catch) p.catch(() => {})
    }
    return
  }
  if (e.button === 0) shoot()
})

window.addEventListener('mousemove', (e) => {
  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return
  if (state !== 'playing') return
  if (document.pointerLockElement !== canvas) return
  if (player.inCar) return
  camYaw += e.movementX * 0.0024
  camPitch = clamp(camPitch - e.movementY * 0.0019, 0.03, 0.98)
})

function bindTouchButton(el, onDown, onUp) {
  if (!el) return
  const press = (e) => {
    if (!touchEnabled || state !== 'playing') return
    e.preventDefault()
    e.stopPropagation()
    el.classList.add('pressed')
    try {
      el.setPointerCapture(e.pointerId)
    } catch {}
    if (onDown) onDown(e)
  }
  const release = (e) => {
    if (!touchEnabled) return
    el.classList.remove('pressed')
    if (onUp) onUp(e)
  }
  el.addEventListener('pointerdown', press)
  el.addEventListener('pointerup', release)
  el.addEventListener('pointercancel', release)
  el.addEventListener('lostpointercapture', release)
}

if (touchEnabled) {
  if (joyBase) {
    joyBase.addEventListener('pointerdown', (e) => {
      if (state !== 'playing') return
      e.preventDefault()
      touch.active = true
      touch.id = e.pointerId
      try {
        joyBase.setPointerCapture(e.pointerId)
      } catch {}
      setJoystickPosition(e)
    })
    joyBase.addEventListener('pointermove', (e) => {
      if (!touch.active || e.pointerId !== touch.id) return
      e.preventDefault()
      setJoystickPosition(e)
    })
    const endJoy = (e) => {
      if (e.pointerId === touch.id) resetJoystick()
    }
    joyBase.addEventListener('pointerup', endJoy)
    joyBase.addEventListener('pointercancel', endJoy)
    joyBase.addEventListener('lostpointercapture', endJoy)
  }

  bindTouchButton(touchEnter, () => enterVehicle())
  bindTouchButton(
    touchFire,
    () => {
      touch.fire = true
      shoot()
    },
    () => {
      touch.fire = false
    }
  )
  bindTouchButton(
    touchSprint,
    () => {
      touch.sprint = true
    },
    () => {
      touch.sprint = false
    }
  )
  bindTouchButton(
    touchJump,
    () => {
      keys.Space = true
    },
    () => {
      keys.Space = false
    }
  )
  bindTouchButton(touchHorn, () => {
    if (state === 'playing') audio.horn()
  })
  bindTouchButton(touchPause, () => setPaused(true))

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || state !== 'playing') return
    e.preventDefault()
    if (player.inCar || touch.lookId !== null) return
    touch.lookId = e.pointerId
    touch.lastX = e.clientX
    touch.lastY = e.clientY
    try {
      canvas.setPointerCapture(e.pointerId)
    } catch {}
  })
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== touch.lookId) return
    e.preventDefault()
    const dx = e.clientX - touch.lastX
    const dy = e.clientY - touch.lastY
    touch.lastX = e.clientX
    touch.lastY = e.clientY
    camYaw += dx * 0.004
    camPitch = clamp(camPitch - dy * 0.003, 0.03, 0.98)
  })
  const endLook = (e) => {
    if (e.pointerId === touch.lookId) touch.lookId = null
  }
  canvas.addEventListener('pointerup', endLook)
  canvas.addEventListener('pointercancel', endLook)
  canvas.addEventListener('lostpointercapture', endLook)

  const blockMenu = (e) => {
    if (touchEnabled) e.preventDefault()
  }
  for (const el of [canvas, touchControls]) {
    if (el) el.addEventListener('contextmenu', blockMenu)
  }
}

startBtn.addEventListener('click', startGame)
resumeBtn.addEventListener('click', () => setPaused(false))
quitBtn.addEventListener('click', () => window.location.reload())
respawnBtn.addEventListener('click', respawn)

updateStars()
updateHud()
updateMenuCamera(0)
renderer.render(scene, camera)

renderer.setAnimationLoop(() => {
  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now
  elapsed += dt
  if (state === 'playing') {
    updatePlaying(dt)
  } else if (state === 'menu') {
    updateMenuWorld(dt)
  } else if (state === 'paused' || state === 'busted' || state === 'wasted') {
    updateEffects(dt)
  }
  renderer.render(scene, camera)
})
