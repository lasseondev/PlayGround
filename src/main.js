import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createWorld, terrainHeight, createLandingPad } from './world.js'
import {
  createCommandCenter, createBarracks, createSupplyDepot, createTurret,
  createMarine, createSCV, createTank, createZergling, createHydralisk, createHive,
  createHealthBar, glowSprite, MAT,
} from './models.js'
import { Effects } from './effects.js'
import { UI } from './ui.js'
import { SFX } from './audio.js'

/* ------------------------------------------------------------------ */
/*  renderer                                                           */
/* ------------------------------------------------------------------ */
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.16
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x081522, 0.0044)
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 900)

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.4

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.58, 0.48, 0.9)
composer.addPass(bloom)
const fxaa = new ShaderPass(FXAAShader)
composer.addPass(fxaa)
composer.addPass(new OutputPass())
const gradePass = new ShaderPass({
  uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `varying vec2 vUv; uniform sampler2D tDiffuse;
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = t.rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, 1.16);
      c = (c - 0.5) * 1.07 + 0.5;
      c *= vec3(1.015, 1.0, 1.03);
      float d = distance(vUv, vec2(0.5));
      c *= 1.0 - smoothstep(0.36, 0.9, d) * 0.3;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), t.a);
    }`,
})
composer.addPass(gradePass)

function resize() {
  const w = window.innerWidth, h = window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  composer.setSize(w, h)
  const pr = renderer.getPixelRatio()
  fxaa.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr))
}
function fitCamera() {
  const portrait = window.innerWidth / window.innerHeight < 0.85
  cam.dist = portrait ? 82 : 66
  cam.pitch = portrait ? 0.96 : 0.74
  cam.target.set(portrait ? 0 : 1, 0, portrait ? -7 : -7)
  cam.smooth.copy(cam.target)
}
window.addEventListener('resize', resize)
resize()

/* ------------------------------------------------------------------ */
/*  lighting                                                           */
/* ------------------------------------------------------------------ */
scene.add(new THREE.HemisphereLight(0x9cc4ff, 0x2c1a20, 1.4))
const moon = new THREE.DirectionalLight(0xc0dbff, 2.75)
moon.position.set(-48, 74, 36)
moon.castShadow = true
moon.shadow.mapSize.set(2048, 2048)
moon.shadow.camera.left = -64
moon.shadow.camera.right = 64
moon.shadow.camera.top = 64
moon.shadow.camera.bottom = -64
moon.shadow.camera.near = 10
moon.shadow.camera.far = 210
moon.shadow.bias = -0.0009
moon.shadow.normalBias = 0.035
scene.add(moon)
const warmFill = new THREE.DirectionalLight(0xff8a55, 0.9)
warmFill.position.set(-50, 18, -70)
scene.add(warmFill)
const rim = new THREE.DirectionalLight(0x4f92ff, 1.0)
rim.position.set(60, 28, -26)
scene.add(rim)
const cameraFill = new THREE.DirectionalLight(0x8fbcff, 0.82)
cameraFill.position.set(28, 30, 56)
scene.add(cameraFill)
const enemyLight = new THREE.PointLight(0x9a4bff, 30, 80, 2)
enemyLight.position.set(0, 14, -52)
scene.add(enemyLight)

/* ------------------------------------------------------------------ */
/*  world + ui                                                         */
/* ------------------------------------------------------------------ */
const world = createWorld(scene, camera)
createLandingPad(scene)

const wreck = new THREE.Group()
const wreckHull = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 4.6), MAT.hullDark)
wreckHull.position.y = 0.8; wreckHull.rotation.set(0.18, 0.4, 0.12); wreckHull.castShadow = wreckHull.receiveShadow = true; wreck.add(wreckHull)
const wreckPlate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 2.6), MAT.hull)
wreckPlate.position.set(0.4, 1.65, -0.3); wreckPlate.rotation.set(0.1, 0.4, 0.2); wreck.add(wreckPlate)
for (let i = 0; i < 3; i++) {
  const debris = new THREE.Mesh(new THREE.BoxGeometry(0.5 + Math.random() * 0.8, 0.25, 0.4 + Math.random() * 0.6), MAT.hullDark)
  debris.position.set(-3 + Math.random() * 6, 0.18, -2 + Math.random() * 5); debris.rotation.y = Math.random() * 3; debris.castShadow = true; wreck.add(debris)
}
wreck.position.set(17, terrainHeight(17, -18), -18)
wreck.rotation.y = -0.3
scene.add(wreck)
const wreckFire = glowSprite(0xff7a35, 8, 0.75); wreckFire.position.set(17, terrainHeight(17, -18) + 1.8, -18); scene.add(wreckFire)
const wreckLight = new THREE.PointLight(0xff6b2a, 30, 14, 2); wreckLight.position.set(17, 3, -18); scene.add(wreckLight)

const hazardMat = new THREE.MeshStandardMaterial({ color: 0x4a3218, emissive: 0xff9a3c, emissiveIntensity: 0.5, metalness: 0.35, roughness: 0.6 })
for (const [x, z, ry] of [[-8.5, -17, 0.2], [13, -13, -0.35], [-14, -3, 1.1]]) {
  const barrier = new THREE.Group()
  barrier.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.5), MAT.hullDark))
  barrier.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.18, 0.56), hazardMat))
  const foot = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.2, 0.9), MAT.rubber); foot.position.y = -0.6; barrier.add(foot)
  barrier.position.set(x, terrainHeight(x, z) + 0.65, z); barrier.rotation.y = ry
  barrier.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  scene.add(barrier)
}
for (const [x, z] of [[-14, 12], [18, 11], [-14, -6], [17, -2]]) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 2.6, 8), MAT.hullDark)
  pole.position.set(x, terrainHeight(x, z) + 1.3, z); scene.add(pole)
  const lamp = glowSprite(0x63f0ff, 1.7, 0.42); lamp.position.set(x, terrainHeight(x, z) + 2.7, z); scene.add(lamp)
}


const effects = new Effects(scene, camera)
const ui = new UI()
const audio = new SFX()
ui.setMinimapWorld(world)

/* ------------------------------------------------------------------ */
/*  state                                                              */
/* ------------------------------------------------------------------ */
const state = {
  minerals: 425, gas: 150, supply: 0, maxSupply: 20, supplyBonus: 0,
  wave: 1, wavesSpawned: 0, waveTimer: 38, waveDuration: 38,
  time: 0, kills: 0, scvs: 0, status: 'SYSTEMS NOMINAL',
  started: false, over: false, pendingCommand: null, victoryTimer: 0, alertTimer: 0,
}
const cooldowns = { stim: 0, scan: 0, repair: 0 }
const allUnits = []
const buildings = []
const projectiles = []
const interactive = []
let selection = []
let entityId = 0
let trainingQueue = []
let uiClock = 0, viewClock = 0, waveSpawnFx = 0

const UNIT_DEFS = {
  marine: { hp: 55, speed: 4.4, range: 8.6, dmg: 7, cd: 0.42, radius: 0.55, supply: 1, height: 2.35, sight: 13, ranged: true, projectile: 'tracer' },
  scv: { hp: 45, speed: 4.7, range: 0, dmg: 0, cd: 1, radius: 0.65, supply: 1, height: 2.3, sight: 10, ranged: false },
  tank: { hp: 175, speed: 2.6, range: 14, dmg: 30, cd: 1.75, radius: 1.5, supply: 3, height: 3.1, sight: 16, ranged: true, projectile: 'shell' },
  zergling: { hp: 35, speed: 6.2, range: 1.35, dmg: 6, cd: 0.68, radius: 0.66, supply: 0, height: 1.75, sight: 15, ranged: false },
  hydralisk: { hp: 85, speed: 3.3, range: 8.2, dmg: 11, cd: 1.25, radius: 0.8, supply: 0, height: 2.5, sight: 15, ranged: true, projectile: 'spine' },
}
const FACTORY = {
  marine: createMarine, scv: createSCV, tank: createTank,
  zergling: createZergling, hydralisk: createHydralisk,
  commandcenter: createCommandCenter, barracks: createBarracks, supply: createSupplyDepot,
  turret: createTurret, hive: createHive,
}
const BUILDING_DEFS = {
  commandcenter: { hp: 1500, height: 14, radius: 11, sight: 18 },
  barracks: { hp: 900, height: 7, radius: 6, sight: 12 },
  supply: { hp: 400, height: 6, radius: 3.6, sight: 8 },
  turret: { hp: 260, height: 4, radius: 2.6, sight: 15, range: 12.5, dmg: 10, cd: 0.5 },
  hive: { hp: 2200, height: 9, radius: 8, sight: 20 },
}

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */
const blobShadowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const x = c.getContext('2d')
  const g = x.createRadialGradient(64, 64, 2, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,0,0,.62)'); g.addColorStop(0.5, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
})()

const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3()
const raycaster = new THREE.Raycaster()
const ndc = new THREE.Vector2()
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

function updateSupply() {
  let used = 0
  for (const u of allUnits) if (u.team === 'player' && !u.dead) used += UNIT_DEFS[u.type].supply
  let depots = 0
  for (const b of buildings) if (b.team === 'player' && b.type === 'supply' && !b.dead) depots++
  state.supply = used
  state.maxSupply = 20 + depots * 8 + state.supplyBonus
  state.scvs = allUnits.filter(u => u.team === 'player' && u.type === 'scv' && !u.dead).length
}

function entityPos(e, out = v3) {
  const h = e.isBuilding ? e.height * 0.45 : e.height * 0.52
  return out.set(e.x, terrainHeight(e.x, e.z) + h, e.z)
}

function addEntity(type, team, x, z, rot = 0) {
  const def = FACTORY[type]()
  const group = def.group
  const BUILDING_SCALE = { commandcenter: 0.66, barracks: 0.72, supply: 0.78, turret: 0.84, hive: 0.72 }
  if (BUILDING_DEFS[type]) {
    const content = new THREE.Group()
    for (const child of [...group.children]) content.add(child)
    const sc = BUILDING_SCALE[type] || 1
    content.scale.setScalar(sc)
    group.add(content)
    def.radius *= sc
    def.height *= sc
  } else {
    const content = new THREE.Group()
    for (const child of [...group.children]) content.add(child)
    content.scale.setScalar(1.3)
    group.add(content)
    def.radius *= 1.3
    def.height *= 1.3
  }
  group.position.set(x, terrainHeight(x, z), z)
  group.rotation.y = rot
  scene.add(group)
  const building = !!BUILDING_DEFS[type]
  const bd = building ? BUILDING_DEFS[type] : null
  const ud = building ? null : UNIT_DEFS[type]
  const hp = building ? bd.hp : ud.hp
  const ent = {
    id: ++entityId, type, team, x, z, group, parts: def.parts,
    radius: building ? bd.radius : ud.radius,
    height: building ? bd.height : ud.height,
    hp, maxHp: hp, dead: false, selected: false, isBuilding: building,
    cd: Math.random() * 0.25, target: null, moveTo: null, attackMove: false,
    job: null, moving: false, phase: Math.random() * 8, stim: 0, recoil: 0,
    turretTimer: Math.random() * 0.4, retarget: Math.random() * 0.4,
  }
  group.userData.entity = ent
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(ent.radius * 2.6, ent.radius * 2.6), new THREE.MeshBasicMaterial({ map: blobShadowTex, transparent: true, depthWrite: false, opacity: building ? 0.5 : 0.62 }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.1
  shadow.renderOrder = 0
  group.add(shadow)
  ent.shadow = shadow
  const bar = createHealthBar(team)
  bar.sprite.position.y = ent.height + (building ? 1.1 : 0.55)
  bar.sprite.visible = !building || team === 'player'
  group.add(bar.sprite)
  ent.bar = bar
  if (building) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(ent.radius * 0.88, ent.radius, 48),
      new THREE.MeshBasicMaterial({ color: team === 'player' ? 0x63f4ff : 0xff5b45, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.12
    ring.visible = false
    group.add(ring)
    ent.ring = ring
    buildings.push(ent)
  } else {
    allUnits.push(ent)
    ent.ring = def.parts.ring
    ent.bar.sprite.visible = true
  }
  interactive.push(group)
  return ent
}

function removeEntity(e) {
  if (e.dead) return
  e.dead = true
  scene.remove(e.group)
  const i = interactive.indexOf(e.group)
  if (i >= 0) interactive.splice(i, 1)
  if (selection.includes(e)) selection = selection.filter(x => x !== e)
  const uiIndex = uiSelection().indexOf(e)
  if (uiIndex >= 0) ui.setSelection(uiSelection())
}

function uiSelection() { return selection.filter(e => !e.dead) }

/* ------------------------------------------------------------------ */
/*  spawn base                                                         */
/* ------------------------------------------------------------------ */
const commandCenter = addEntity('commandcenter', 'player', 2, 5, 0)
const barracks = addEntity('barracks', 'player', 15, 15, -0.42)
addEntity('supply', 'player', 19, 1.5, 0.2)
addEntity('supply', 'player', 20, -7, -0.15)
const turretA = addEntity('turret', 'player', 2, -16, 0)
const turretB = addEntity('turret', 'player', -17, -6, 0.4)
addEntity('hive', 'enemy', 0, -53, 0)

const marines = []
for (const [x, z] of [[-11, -10], [-5.5, -13], [0.5, -10.5], [6, -13.5], [11, -8.5], [-2, -16.5]]) {
  const m = addEntity('marine', 'player', x, z, Math.PI)
  marines.push(m)
}
const tank = addEntity('tank', 'player', 14, -6, Math.PI)
const scvs = []
for (const [x, z] of [[-3.5, 9.5], [0.5, 10.5], [19, 12]]) {
  const s = addEntity('scv', 'player', x, z, Math.PI)
  scvs.push(s)
}
for (const u of scvs) assignGather(u, nearestMineral(u.x, u.z))

const initialEnemies = []
for (const [x, z] of [[-9, -20], [-4, -22.5], [4, -18.5], [9.5, -22], [1, -27]]) {
  initialEnemies.push(addEntity(z === -27 ? 'hydralisk' : 'zergling', 'enemy', x, z, 0))
}

for (const node of world.mineralNodes) {
  node.group.userData.mineralNode = node
  interactive.push(node.group)
}
updateSupply()

/* ------------------------------------------------------------------ */
/*  selection                                                          */
/* ------------------------------------------------------------------ */
function setSelection(list) {
  for (const e of selection) {
    e.selected = false
    if (e.ring) e.ring.visible = false
  }
  selection = list.filter(e => e && !e.dead).slice(0, 24)
  for (const e of selection) {
    e.selected = true
    if (e.ring) e.ring.visible = true
  }
  ui.setSelection(selection)
}

function pickAt(clientX, clientY) {
  ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  const hits = raycaster.intersectObjects(interactive, true)
  for (const hit of hits) {
    let o = hit.object
    while (o) {
      if (o.userData.mineralNode) return { mineral: o.userData.mineralNode }
      if (o.userData.entity) return { entity: o.userData.entity }
      o = o.parent
    }
  }
  return {}
}

function groundPoint(clientX, clientY, out = new THREE.Vector3()) {
  ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  const hit = raycaster.ray.intersectPlane(groundPlane, out)
  return hit ? out : null
}

/* ------------------------------------------------------------------ */
/*  camera                                                             */
/* ------------------------------------------------------------------ */
const cam = {
  target: new THREE.Vector3(1, 0, -5),
  smooth: new THREE.Vector3(1, 0, -5),
  yaw: -0.54, pitch: 0.74, dist: 66,
}
fitCamera()
const keys = new Set()
let orbiting = false, lastPointer = { x: 0, y: 0 }
let dragStart = null, dragging = false, dragRect = null

const marquee = document.createElement('div')
marquee.style.cssText = 'position:absolute;display:none;border:1px solid rgba(99,244,255,.8);background:rgba(99,244,255,.08);z-index:15;pointer-events:none;box-shadow:0 0 20px rgba(99,244,255,.18) inset'
document.getElementById('app').appendChild(marquee)

function updateCamera(dt) {
  const speed = cam.dist * 0.52 * dt
  const fwd = v1.set(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw))
  const right = v2.set(Math.cos(cam.yaw), 0, -Math.sin(cam.yaw))
  let mx = 0, mz = 0
  if (keys.has('KeyW') || keys.has('ArrowUp')) { mx += fwd.x; mz += fwd.z }
  if (keys.has('KeyS') || keys.has('ArrowDown')) { mx -= fwd.x; mz -= fwd.z }
  if (keys.has('KeyD') || keys.has('ArrowRight')) { mx += right.x; mz += right.z }
  if (keys.has('KeyA') && !keys.has('KeyA_attack')) { mx -= right.x; mz -= right.z }
  if (keys.has('ArrowLeft')) { mx -= right.x; mz -= right.z }
  if (keys.has('KeyQ')) cam.yaw += dt * 1.35
  if (keys.has('KeyE')) cam.yaw -= dt * 1.35
  cam.target.x += mx * speed
  cam.target.z += mz * speed
  cam.target.x = THREE.MathUtils.clamp(cam.target.x, -58, 58)
  cam.target.z = THREE.MathUtils.clamp(cam.target.z, -62, 58)
  const k = 1 - Math.exp(-dt * 9)
  cam.smooth.lerp(cam.target, k)
  cam.smooth.y = terrainHeight(cam.smooth.x, cam.smooth.z) * 0.55
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch)
  const desired = v3.set(
    cam.smooth.x + Math.sin(cam.yaw) * cp * cam.dist,
    cam.smooth.y + sp * cam.dist,
    cam.smooth.z + Math.cos(cam.yaw) * cp * cam.dist
  )
  camera.position.lerp(desired, 1 - Math.exp(-dt * 12))
  if (effects.shakeAmount > 0) {
    camera.position.x += (Math.random() - 0.5) * effects.shakeAmount
    camera.position.y += (Math.random() - 0.5) * effects.shakeAmount * 0.7
    camera.position.z += (Math.random() - 0.5) * effects.shakeAmount
  }
  camera.lookAt(cam.smooth.x, cam.smooth.y + 1.5, cam.smooth.z)
}

function viewPolygon() {
  const pts = []
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    raycaster.setFromCamera({ x: sx, y: sy }, camera)
    const p = raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3())
    if (p) pts.push([p.x, p.z])
    else {
      const far = raycaster.ray.at(120, new THREE.Vector3())
      pts.push([far.x, far.z])
    }
  }
  return pts
}

/* ------------------------------------------------------------------ */
/*  movement / combat                                                  */
/* ------------------------------------------------------------------ */
function faceToward(u, tx, tz, dt, rate = 9) {
  const desired = Math.atan2(tx - u.x, tz - u.z)
  let diff = desired - u.group.rotation.y
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  u.group.rotation.y += diff * Math.min(1, dt * rate)
}

function moveToward(u, tx, tz, dt, speedMul = 1) {
  const dx = tx - u.x, dz = tz - u.z
  const d = Math.hypot(dx, dz)
  if (d < 0.12) { u.moving = false; return true }
  const sp = UNIT_DEFS[u.type].speed * speedMul * (u.stim > 0 ? 1.5 : 1)
  const step = Math.min(d, sp * dt)
  u.x += dx / d * step
  u.z += dz / d * step
  u.group.position.x = u.x
  u.group.position.z = u.z
  u.moving = true
  faceToward(u, tx, tz, dt)
  return d - step < 0.15
}

function nearestEnemyOf(u, maxDist) {
  let best = null, bd = maxDist * maxDist
  const team = u.team === 'player' ? 'enemy' : 'player'
  for (const e of allUnits) {
    if (e.dead || e.team !== team) continue
    const d = (e.x - u.x) ** 2 + (e.z - u.z) ** 2
    if (d < bd) { bd = d; best = e }
  }
  return best
}

function nearestEnemyBuilding(u, maxDist) {
  let best = null, bd = maxDist * maxDist
  const team = u.team === 'player' ? 'enemy' : 'player'
  for (const e of buildings) {
    if (e.dead || e.team !== team) continue
    const d = (e.x - u.x) ** 2 + (e.z - u.z) ** 2
    if (d < bd) { bd = d; best = e }
  }
  return best
}

function nearestPlayerTarget(u, maxDist) {
  let best = nearestEnemyOf(u, maxDist)
  let bd = best ? (best.x - u.x) ** 2 + (best.z - u.z) ** 2 : maxDist * maxDist
  for (const b of buildings) {
    if (b.dead || b.team !== 'player') continue
    const d = (b.x - u.x) ** 2 + (b.z - u.z) ** 2
    if (d < bd) { bd = d; best = b }
  }
  return best
}

function muzzlePosition(u) {
  const p = v1
  if (u.parts.muzzle) u.parts.muzzle.getWorldPosition(p)
  else if (u.parts.muzzles && u.parts.muzzles.length) u.parts.muzzles[0].getWorldPosition(p)
  else p.set(u.x, terrainHeight(u.x, u.z) + u.height * 0.6, u.z)
  return p.clone()
}

function fireProjectile(u, target, kind) {
  const color = kind === 'shell' ? 0xffb15e : kind === 'spine' ? 0xb8ff7a : 0x8ff8ff
  const speed = kind === 'shell' ? 42 : kind === 'spine' ? 26 : 95
  const dmg = UNIT_DEFS[u.type].dmg
  const geo = new THREE.SphereGeometry(kind === 'shell' ? 0.22 : kind === 'spine' ? 0.14 : 0.075, 6, 6)
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  const mesh = new THREE.Mesh(geo, mat)
  const from = muzzlePosition(u)
  mesh.position.copy(from)
  scene.add(mesh)
  let sprite = null
  if (kind === 'shell' || kind === 'spine') {
    sprite = glowSprite(color, kind === 'shell' ? 1.4 : 0.75, 0.85)
    mesh.add(sprite)
  }
  const p = { mesh, geo, mat, sprite, target, speed, dmg, kind, team: u.team, life: 4, last: new THREE.Vector3() }
  entityPos(target, p.last)
  projectiles.push(p)
  effects.tracer(from, p.last, color, kind === 'shell' ? 0.02 : 0.018, 0.07)
  if (kind === 'shell') { effects.muzzle(from, color, 1.6); audio.cannon() }
  else if (kind === 'spine') { effects.muzzle(from, color, 0.8); if (Math.random() < 0.45) audio.zerg() }
  else { effects.muzzle(from, 0x9ff8ff, 0.7); if (Math.random() < 0.32) audio.laser() }
}

function meleeStrike(u, target) {
  const from = muzzlePosition(u)
  entityPos(target, v2)
  effects.tracer(from, v2, u.team === 'player' ? 0x9ff8ff : 0xff7a52, 0.055, 0.08)
  effects.impact(v2, u.team === 'player' ? 0x9ff8ff : 0xff7a52, 0.55)
  damage(target, UNIT_DEFS[u.type].dmg, u)
  if (Math.random() < 0.15) audio.zerg()
}

function damage(target, amount, source) {
  if (!target || target.dead) return
  target.hp -= amount
  target.bar.draw(Math.max(0, target.hp / target.maxHp))
  if (target.hp <= 0) killEntity(target, source)
}

function killEntity(e, source) {
  if (e.dead) return
  const pos = new THREE.Vector3(e.x, terrainHeight(e.x, e.z) + (e.isBuilding ? e.height * 0.35 : e.height * 0.5), e.z)
  effects.death(pos, e.team, e.isBuilding ? 2.2 : 1)
  audio.explosion(e.isBuilding)
  removeEntity(e)
  if (e.team === 'enemy' && !e.isBuilding) {
    state.kills++
    state.minerals += 4
  }
  if (e.isBuilding && e.type === 'commandcenter' && e.team === 'player') {
    setTimeout(() => endGame(false), 800)
  }
  updateSupply()
  if (e.team === 'enemy' && source) {
    for (const u of allUnits) if (!u.dead && u.team === 'player' && UNIT_DEFS[u.type].ranged) u.target = null
  }
}
function U(u) { return UNIT_DEFS[u.type] }

function orderAttack(unit, target) {
  if (unit.isBuilding || unit.team !== 'player') return
  if (unit.type === 'scv') return
  unit.target = target
  unit.moveTo = null
  unit.attackMove = false
}

function orderMove(unit, x, z, attackMove = false) {
  if (unit.isBuilding || unit.team !== 'player') return
  if (unit.type === 'scv') unit.job = null
  unit.target = null
  unit.moveTo = new THREE.Vector3(x, 0, z)
  unit.attackMove = attackMove
}

function formationOffsets(n, spacing = 2.4) {
  const offs = []
  const cols = Math.ceil(Math.sqrt(n))
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols), col = i % cols
    offs.push([(col - (cols - 1) / 2) * spacing, (row - (Math.ceil(n / cols) - 1) / 2) * spacing])
  }
  return offs
}

/* ------------------------------------------------------------------ */
/*  scv economy                                                        */
/* ------------------------------------------------------------------ */
function nearestMineral(x, z) {
  let best = null, bd = Infinity
  for (const n of world.mineralNodes) {
    const d = (n.x - x) ** 2 + (n.z - z) ** 2
    if (d < bd) { bd = d; best = n }
  }
  return best
}

function assignGather(scv, node) {
  if (!scv || !node) return
  scv.job = { phase: 'to', node, timer: 0, beam: 0 }
  scv.target = null
  scv.moveTo = null
}

function updateScv(u, dt) {
  if (!u.job) return
  const job = u.job
  if (job.phase === 'to') {
    const node = job.node
    const near = moveToward(u, node.x + (u.id % 2 ? 2.2 : -1.8), node.z + 1.2, dt)
    if (near) { u.moving = false; job.phase = 'mine'; job.timer = 2.4 }
    u.group.position.y = terrainHeight(u.x, u.z) + Math.sin(u.phase) * 0.02
  } else if (job.phase === 'mine') {
    job.timer -= dt
    job.beam -= dt
    if (job.beam <= 0) {
      job.beam = 0.42
      const from = muzzlePosition(u)
      const to = new THREE.Vector3(job.node.x, terrainHeight(job.node.x, job.node.z) + 2.2, job.node.z)
      effects.tracer(from, to, 0x68f4ff, 0.045, 0.22)
      effects.impact(to, 0x68f4ff, 0.35)
      job.node.glow.material.opacity = 0.6
    }
    if (job.timer <= 0) { job.phase = 'return'; job.timer = 0 }
  } else if (job.phase === 'return') {
    const near = moveToward(u, commandCenter.x + 4 + (u.id % 3), commandCenter.z + 5, dt, 1.08)
    if (near) {
      state.minerals += 8
      effects.floatText(new THREE.Vector3(u.x, terrainHeight(u.x, u.z) + 3, u.z), '+8', '#ffd47a', 0.8)
      job.phase = 'to'
    }
  }
}

/* ------------------------------------------------------------------ */
/*  unit update                                                        */
/* ------------------------------------------------------------------ */
function updateUnit(u, dt) {
  if (u.dead) return
  u.phase += dt * (u.moving ? 9 : 2.2)
  u.stim = Math.max(0, u.stim - dt)
  if (u.team === 'player' && u.type === 'scv') {
    updateScv(u, dt)
    updateUnitVisual(u, dt)
    return
  }
  if (u.target && u.target.dead) u.target = null
  const def = UNIT_DEFS[u.type]

  if (u.team === 'enemy') {
    u.retarget -= dt
    if (!u.target || u.retarget <= 0) {
      u.retarget = 0.6 + Math.random() * 0.4
      const near = nearestPlayerTarget(u, 44)
      if (near) u.target = near
      else if (!u.target) u.target = commandCenter.dead ? null : commandCenter
    }
  } else {
    u.retarget -= dt
    if (!u.target && u.retarget <= 0) {
      u.retarget = 0.35
      const near = nearestEnemyOf(u, def.sight)
      if (near) u.target = near
    }
    if (u.target && !u.attackMove && !u.moveTo) {
      const d = Math.hypot(u.target.x - u.x, u.target.z - u.z)
      if (d > def.range + u.target.radius + 5) u.target = null
    }
  }

  if (u.target) {
    const target = u.target
    entityPos(target, v2)
    const d = Math.hypot(target.x - u.x, target.z - u.z) - target.radius
    if (d <= def.range) {
      u.moving = false
      faceToward(u, target.x, target.z, dt)
      u.cd -= dt
      if (u.cd <= 0) {
        u.cd = def.cd * (u.stim > 0 ? 0.72 : 1) * (0.92 + Math.random() * 0.16)
        if (def.ranged) fireProjectile(u, target, def.projectile)
        else meleeStrike(u, target)
        if (u.type === 'tank') u.recoil = 1
      }
    } else {
      if (u.team === 'enemy' || u.attackMove) {
        moveToward(u, target.x, target.z, dt)
      } else {
        u.moving = false
        u.cd = Math.max(0.15, u.cd - dt)
      }
    }
  } else if (u.moveTo) {
    const arrived = moveToward(u, u.moveTo.x, u.moveTo.z, dt)
    if (arrived) { u.moveTo = null; u.moving = false }
  } else {
    u.moving = false
    u.cd = Math.max(0.1, u.cd - dt)
  }
  updateUnitVisual(u, dt)
}

function updateUnitVisual(u, dt) {
  const moving = u.moving
  const p = u.parts
  const b = Math.abs(Math.sin(u.phase)) * (moving ? 0.055 : 0.018)
  u.group.position.y = terrainHeight(u.x, u.z) + b
  if (u.stim > 0) u.group.position.y += Math.sin(u.phase * 2.4) * 0.01

  if (u.type === 'marine') {
    const swing = moving ? Math.sin(u.phase) * 0.7 : Math.sin(u.phase * 0.4) * 0.04
    if (p.legs[0]) p.legs[0].rotation.x = swing
    if (p.legs[1]) p.legs[1].rotation.x = -swing
    if (p.torso) p.torso.position.y = 1.2 + Math.abs(Math.sin(u.phase * 2)) * (moving ? 0.035 : 0.01)
    if (p.gun) p.gun.position.z = 0.36 - Math.max(0, u.cd / (UNIT_DEFS.marine.cd * 1.6)) * 0.08
  } else if (u.type === 'scv') {
    const swing = moving ? Math.sin(u.phase) * 0.55 : Math.sin(u.phase * 0.5) * 0.06
    if (p.legs[0]) p.legs[0].rotation.x = swing
    if (p.legs[1]) p.legs[1].rotation.x = -swing
    if (p.arms[0]) p.arms[0].rotation.x = -swing * 0.8 + (u.job?.phase === 'mine' ? 0.5 : 0)
    if (p.arms[1]) p.arms[1].rotation.x = swing * 0.8 + (u.job?.phase === 'mine' ? 0.5 : 0)
    if (p.thruster) p.thruster.material.opacity = 0.45 + Math.sin(u.phase * 3) * 0.2
  } else if (u.type === 'tank') {
    if (p.turret && u.target) {
      const desired = Math.atan2(u.target.x - u.x, u.target.z - u.z) - u.group.rotation.y
      let diff = desired - p.turret.rotation.y
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      p.turret.rotation.y += diff * Math.min(1, dt * 4)
    }
    u.recoil = Math.max(0, u.recoil - dt * 4.5)
    if (p.barrel) p.barrel.position.z = 1.05 - u.recoil * 0.42
  } else if (u.type === 'zergling') {
    const swing = moving ? Math.sin(u.phase * 1.6) * 0.85 : Math.sin(u.phase * 0.7) * 0.08
    p.legs.forEach((leg, i) => leg.rotation.x = (i % 2 ? -swing : swing) * 0.9)
    p.arms.forEach((arm, i) => arm.rotation.x = (i % 2 ? -swing : swing) * 0.4)
  } else if (u.type === 'hydralisk') {
    const sway = Math.sin(u.phase * 0.8) * 0.06
    p.segments.forEach((s, i) => s.rotation.y = sway * (i + 1) * 0.5)
    if (p.head) p.head.rotation.y = Math.sin(u.phase * 0.5) * 0.15
    p.arms.forEach((a, i) => a.rotation.x = (i % 2 ? -1 : 1) * (moving ? Math.sin(u.phase + i) * 0.18 : 0.05))
  }
  if (u.ring) {
    u.ring.visible = u.selected
    if (u.selected) u.ring.rotation.z += dt * 0.7
  }
  if (u.bar) {
    u.bar.sprite.visible = u.hp < u.maxHp || u.selected
    u.bar.sprite.position.y = u.height + 0.55
  }
}

/* ------------------------------------------------------------------ */
/*  buildings update                                                   */
/* ------------------------------------------------------------------ */
function updateBuilding(b, dt, t) {
  if (b.dead) return
  const p = b.parts
  if (b.type === 'commandcenter') {
    if (p.radar) p.radar.rotation.y += dt * 0.55
    if (p.ring) { p.ring.rotation.z += dt * 0.22; p.ring.material.opacity = 0.35 + Math.sin(t * 1.7) * 0.12 }
    if (p.ring2) p.ring2.rotation.z -= dt * 0.3
    if (p.light) p.light.intensity = 70 + Math.sin(t * 2.2) * 18
    if (p.beacon) p.beacon.material.opacity = 0.4 + Math.sin(t * 2) * 0.14
  } else if (b.type === 'barracks') {
    if (p.lamp) p.lamp.material.opacity = 0.6 + Math.sin(t * 3.1) * 0.25
  } else if (b.type === 'turret') {
    let best = null, bd = (BUILDING_DEFS.turret.range) ** 2
    for (const e of allUnits) {
      if (e.dead || e.team !== 'enemy') continue
      const d = (e.x - b.x) ** 2 + (e.z - b.z) ** 2
      if (d < bd) { bd = d; best = e }
    }
    if (best) {
      const desired = Math.atan2(best.x - b.x, best.z - b.z) - b.group.rotation.y
      let diff = desired - p.head.rotation.y
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      p.head.rotation.y += diff * Math.min(1, dt * 6)
      b.cd -= dt
      if (b.cd <= 0 && Math.abs(diff) < 0.35) {
        b.cd = BUILDING_DEFS.turret.cd
        const idx = Math.random() > 0.5 ? 1 : 0
        p.muzzles[idx].getWorldPosition(v1)
        entityPos(best, v2)
        effects.tracer(v1, v2, 0x8ff8ff, 0.03, 0.09)
        effects.muzzle(v1, 0x9ff8ff, 0.55)
        damage(best, BUILDING_DEFS.turret.dmg, b)
        if (Math.random() < 0.3) audio.laser()
      }
    }
  } else if (b.type === 'hive') {
    const pulse = 1.6 + Math.sin(t * 2.2) * 0.6
    for (const s of p.sacs) s.scale.setScalar(1 + Math.sin(t * 2.2 + s.position.x) * 0.05)
    if (p.heart) p.heart.material.emissiveIntensity = pulse
    if (p.light) p.light.intensity = 40 + Math.sin(t * 2.2) * 14
  }
  if (b.ring) b.ring.visible = b.selected
  if (b.bar) b.bar.sprite.visible = b.hp < b.maxHp || b.selected
}

/* ------------------------------------------------------------------ */
/*  projectiles                                                        */
/* ------------------------------------------------------------------ */
function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i]
    p.life -= dt
    if (p.target && !p.target.dead) entityPos(p.target, p.last)
    const d = p.last.distanceTo(p.mesh.position)
    if (d < 0.6 || p.life <= 0) {
      entityPos(p.target && !p.target.dead ? p.target : { x: p.last.x, z: p.last.z, isBuilding: false, height: 0 }, v1)
      const hit = p.last.clone()
      scene.remove(p.mesh)
      p.geo.dispose()
      p.mat.dispose()
      if (p.sprite) p.sprite.material.dispose()
      projectiles.splice(i, 1)
      if (p.target && !p.target.dead) damage(p.target, p.dmg, null)
      effects.impact(hit, p.kind === 'shell' ? 0xffb15e : p.kind === 'spine' ? 0xb8ff7a : 0x8ff8ff, p.kind === 'shell' ? 1.5 : 0.8)
      if (p.kind === 'shell') {
        effects.explosion(hit, 0.95, 0xff9c4a)
        for (const e of allUnits) {
          if (e.dead || e.team === p.team) continue
          if (e.x === p.target?.x && e.z === p.target?.z) continue
          if (Math.hypot(e.x - hit.x, e.z - hit.z) < 3.8) damage(e, p.dmg * 0.45, null)
        }
      }
      continue
    }
    p.mesh.position.addScaledVector(v2.copy(p.last).sub(p.mesh.position).normalize(), Math.min(d, p.speed * dt))
  }
}

/* ------------------------------------------------------------------ */
/*  waves / victory                                                    */
/* ------------------------------------------------------------------ */
function spawnWave(n) {
  const zerglings = 4 + n * 3
  const hydras = n >= 2 ? Math.floor(n / 2) + 1 : 0
  for (let i = 0; i < zerglings; i++) {
    const x = -26 + Math.random() * 52
    const z = -66 + Math.random() * 7
    addEntity('zergling', 'enemy', x, z, 0)
  }
  for (let i = 0; i < hydras; i++) {
    const x = -20 + Math.random() * 40
    addEntity('hydralisk', 'enemy', x, -68 + Math.random() * 6, 0)
  }
  state.alertTimer = 7
  ui.toast(`SWARM WAVE ${n} INBOUND — ${zerglings + hydras} SIGNATURES`, 'bad')
  ui.flash(0.18)
  audio.alert()
  effects.scanPulse(new THREE.Vector3(0, 0, -58), 18)
}

function updateWaves(dt) {
  if (state.wave > 5) return
  state.waveTimer -= dt
  if (state.waveTimer <= 0) {
    spawnWave(state.wave)
    state.wavesSpawned = state.wave
    if (state.wave < 5) {
      state.wave++
      state.waveTimer = 52
      state.waveDuration = 52
    } else {
      state.wave = 6
      state.waveTimer = 0
      state.status = 'FINAL WAVE — CLEAR ALL HOSTILES'
    }
  }
}

function countEnemies() {
  let n = 0
  for (const u of allUnits) if (u.team === 'enemy' && !u.dead) n++
  return n
}

function endGame(victory) {
  if (state.over) return
  state.over = true
  ui.showEnd(victory, { wave: Math.min(state.wave, 5), kills: state.kills, minerals: Math.round(state.minerals) })
}

/* ------------------------------------------------------------------ */
/*  collision separation                                               */
/* ------------------------------------------------------------------ */
function separate() {
  for (let i = 0; i < allUnits.length; i++) {
    const a = allUnits[i]
    if (a.dead) continue
    for (let j = i + 1; j < allUnits.length; j++) {
      const b = allUnits[j]
      if (b.dead) continue
      const dx = b.x - a.x, dz = b.z - a.z
      const min = (a.radius + b.radius) * 0.86
      const d2 = dx * dx + dz * dz
      if (d2 > min * min || d2 < 0.0001) continue
      const d = Math.sqrt(d2)
      const push = (min - d) * 0.5
      const nx = dx / d, nz = dz / d
      a.x -= nx * push; a.z -= nz * push
      b.x += nx * push; b.z += nz * push
      a.group.position.x = a.x; a.group.position.z = a.z
      b.group.position.x = b.x; b.group.position.z = b.z
    }
  }
}

/* ------------------------------------------------------------------ */
/*  commands                                                           */
/* ------------------------------------------------------------------ */
function selectionPlayers() { return selection.filter(e => e.team === 'player' && !e.dead) }
function selectionUnits() { return selectionPlayers().filter(e => !e.isBuilding) }

function trainUnit(kind) {
  const costs = { marine: [50, 0, 1], scv: [50, 0, 1], tank: [150, 100, 3] }
  const [m, g, s] = costs[kind]
  if (!buildings.some(b => b.type === 'barracks' && b.team === 'player' && !b.dead)) { ui.toast('BARRACKS DESTROYED — PRODUCTION OFFLINE', 'bad'); return }
  if (state.minerals < m) { ui.toast('INSUFFICIENT MINERALS', 'warn'); return }
  if (g && state.gas < g) { ui.toast('INSUFFICIENT VESPENE GAS', 'warn'); return }
  if (state.supply + s > state.maxSupply) { ui.toast('SUPPLY LIMIT REACHED — CALL A SUPPLY DROP', 'warn'); return }
  state.minerals -= m
  state.gas -= g
  trainingQueue.push({ kind, time: kind === 'tank' ? 3.4 : 2.2, total: kind === 'tank' ? 3.4 : 2.2 })
  audio.train()
  ui.toast(`${kind.toUpperCase()} TRAINING`)
}

function updateTraining(dt) {
  if (!trainingQueue.length) return
  const item = trainingQueue[0]
  item.time -= dt
  if (item.time <= 0) {
    trainingQueue.shift()
    let x, z
    if (item.kind === 'scv') { x = commandCenter.x + 7; z = commandCenter.z + 2 }
    else { x = barracks.x + 2.5; z = barracks.z + 6 }
    const u = addEntity(item.kind, 'player', x + (Math.random() - 0.5) * 2, z + (Math.random() - 0.5) * 2, Math.PI)
    effects.scanPulse(new THREE.Vector3(x, 0, z), 4)
    effects.floatText(new THREE.Vector3(x, terrainHeight(x, z) + 3, z), 'READY', '#8dffb5', 0.8)
    updateSupply()
    if (item.kind === 'scv') assignGather(u, nearestMineral(u.x, u.z))
    ui.toast(`${item.kind.toUpperCase()} DEPLOYED`)
  }
}

function commandStim() {
  const marines = selection.filter(u => u.type === 'marine' && u.team === 'player' && !u.dead)
  if (!marines.length) { ui.toast('SELECT MARINES TO STIM', 'warn'); return }
  if (cooldowns.stim > 0) return
  cooldowns.stim = 13
  for (const m of marines) {
    if (m.hp > 8) { m.hp -= 8; m.bar.draw(m.hp / m.maxHp) }
    m.stim = 10
    effects.floatText(new THREE.Vector3(m.x, terrainHeight(m.x, m.z) + 3.2, m.z), 'STIM', '#ff8a63', 0.7)
    effects.impact(new THREE.Vector3(m.x, terrainHeight(m.x, m.z) + 1.4, m.z), 0xff5b45, 0.45)
  }
  audio.alert()
  ui.toast('STIM PACKS ADMINISTERED — +50% SPEED, +28% FIRE RATE')
}

function commandScan() {
  if (cooldowns.scan > 0) return
  cooldowns.scan = 20
  let cx = 0, cz = -50, n = 0
  for (const e of allUnits) if (e.team === 'enemy' && !e.dead) { cx += e.x; cz += e.z; n++ }
  if (n) { cx /= n; cz /= n } else { cx = cam.target.x; cz = cam.target.z }
  effects.scanPulse(new THREE.Vector3(cx, 0, cz), 34)
  ui.flash(0.3)
  audio.alert()
  setTimeout(() => ui.flash(0.15), 220)
  ui.toast('ORBITAL SCAN COMPLETE — SWARM SIGNATURES HIGHLIGHTED')
}

function commandRepair() {
  if (cooldowns.repair > 0) return
  if (state.minerals < 25) { ui.toast('INSUFFICIENT MINERALS FOR REPAIRS', 'warn'); return }
  const targets = selectionPlayers().filter(e => e.type === 'scv' || e.type === 'tank' || e.isBuilding).filter(e => e.hp < e.maxHp * 0.96)
  const pool = targets.length ? targets : selectionPlayers().filter(e => e.type === 'scv' || e.type === 'tank' || e.isBuilding)
  if (!pool.length) { ui.toast('SELECT A MECHANICAL UNIT OR STRUCTURE TO REPAIR', 'warn'); return }
  cooldowns.repair = 12
  state.minerals -= 25
  for (const e of pool) {
    const heal = Math.min(e.maxHp * 0.32, e.maxHp - e.hp)
    e.hp += heal
    e.bar.draw(e.hp / e.maxHp)
    const pos = new THREE.Vector3(e.x, terrainHeight(e.x, e.z) + e.height * 0.6, e.z)
    effects.beam(pos.clone().add(new THREE.Vector3(0, 4, 0)), pos, 0x78ffb3, 0.06, 0.5)
    effects.floatText(pos.clone().add(new THREE.Vector3(0, 1.2, 0)), `+${Math.round(heal)}`, '#8dffb5', 0.8)
  }
  audio.train()
  ui.toast('NANITE REPAIR COMPLETE')
}

function commandSupply() {
  if (state.minerals < 100) { ui.toast('INSUFFICIENT MINERALS — 100 REQUIRED', 'warn'); return }
  state.minerals -= 100
  state.supplyBonus += 8
  updateSupply()
  const p = new THREE.Vector3(commandCenter.x, terrainHeight(commandCenter.x, commandCenter.z) + 20, commandCenter.z)
  const beam = glowSprite(0x7ff2ff, 3, 0.9)
  beam.position.copy(p); scene.add(beam)
  let t = 0
  effects.items.push({ update: (dt) => { t += dt; beam.position.y -= dt * 34; beam.material.opacity = 0.9; beam.scale.setScalar(3 - Math.min(1.8, t * 3)); if (beam.position.y < terrainHeight(commandCenter.x, commandCenter.z) + 2) { scene.remove(beam); beam.material.dispose(); effects.explosion(new THREE.Vector3(commandCenter.x, 2, commandCenter.z), 0.6, 0x7ff2ff); return false } return true } })
  effects.floatText(new THREE.Vector3(commandCenter.x, 12, commandCenter.z), '+8 SUPPLY', '#7ff2ff', 1)
  audio.scanPulse?.()
  audio.alert()
  ui.toast('SUPPLY DROP INBOUND — +8 SUPPLY')
}

function toggleAttackMove() {
  const units = selectionUnits().filter(u => u.type !== 'scv')
  if (!units.length) { ui.toast('SELECT COMBAT UNITS FOR ATTACK-MOVE', 'warn'); return }
  state.pendingCommand = state.pendingCommand === 'attack' ? null : 'attack'
  if (state.pendingCommand) ui.toast('ATTACK-MOVE — RIGHT CLICK TARGET LOCATION')
}

function runCommand(id) {
  audio.click()
  if (state.over) return
  if (id === 'marine') trainUnit('marine')
  else if (id === 'scv') trainUnit('scv')
  else if (id === 'tank') trainUnit('tank')
  else if (id === 'supply') commandSupply()
  else if (id === 'stim') commandStim()
  else if (id === 'scan') commandScan()
  else if (id === 'repair') commandRepair()
  else if (id === 'attack') toggleAttackMove()
}
ui.onCommand = runCommand
ui.onAudio(() => audio.toggle())

/* ------------------------------------------------------------------ */
/*  order handling                                                     */
/* ------------------------------------------------------------------ */
function handleSelect(clientX, clientY, shift) {
  const hit = pickAt(clientX, clientY)
  if (hit.entity) {
    const e = hit.entity
    if (shift && e.team === 'player') {
      if (selection.includes(e)) setSelection(selection.filter(x => x !== e))
      else setSelection([...selection, e])
    } else setSelection([e])
    audio.select()
  } else if (hit.mineral) {
    const sel = selectionUnits().filter(u => u.type === 'scv')
    if (sel.length) {
      for (const s of sel) assignGather(s, hit.mineral)
      effects.orderMarker(new THREE.Vector3(hit.mineral.x, 0, hit.mineral.z), 0x63f4ff)
      audio.order()
      ui.toast('SCV — MINERAL FIELD ASSIGNED')
    } else {
      setSelection([])
    }
  } else {
    if (!shift) setSelection([])
  }
}

function handleTap(clientX, clientY) {
  const hit = pickAt(clientX, clientY)
  if (hit.entity && hit.entity.team === 'enemy' && selectionPlayers().length) { handleOrder(clientX, clientY); return }
  if (hit.entity || hit.mineral) { handleSelect(clientX, clientY, false); return }
  if (selectionPlayers().length) handleOrder(clientX, clientY)
  else setSelection([])
}

function handleOrder(clientX, clientY) {
  const players = selectionPlayers()
  if (!players.length) return
  const hit = pickAt(clientX, clientY)
  const attackMode = state.pendingCommand === 'attack'
  if (hit.entity && hit.entity.team === 'enemy') {
    const combat = players.filter(e => !e.isBuilding && e.type !== 'scv')
    for (const u of combat) orderAttack(u, hit.entity)
    effects.orderMarker(new THREE.Vector3(hit.entity.x, 0, hit.entity.z), 0xff6b52)
    audio.order()
    state.pendingCommand = null
    ui.toast('ATTACK ORDER CONFIRMED')
    return
  }
  if (hit.mineral) {
    const scvs = players.filter(e => !e.isBuilding && e.type === 'scv')
    if (scvs.length) {
      for (const s of scvs) assignGather(s, hit.mineral)
      effects.orderMarker(new THREE.Vector3(hit.mineral.x, 0, hit.mineral.z), 0x63f4ff)
      audio.order()
      state.pendingCommand = null
      return
    }
  }
  const p = groundPoint(clientX, clientY)
  if (!p) return
  const scvs = players.filter(e => !e.isBuilding && e.type === 'scv')
  const node = nearestMineral(p.x, p.z)
  if (scvs.length && node && Math.hypot(node.x - p.x, node.z - p.z) < 6) {
    for (const s of scvs) assignGather(s, node)
    effects.orderMarker(new THREE.Vector3(node.x, 0, node.z), 0x63f4ff)
    audio.order()
    state.pendingCommand = null
    return
  }
  const units = players.filter(e => !e.isBuilding)
  const offsets = formationOffsets(units.length, 2.2)
  units.forEach((u, i) => orderMove(u, p.x + offsets[i][0], p.z + offsets[i][1], attackMode))
  effects.orderMarker(p, attackMode ? 0xffb15e : 0x63f4ff)
  audio.order()
  if (attackMode) ui.toast('ATTACK-MOVE ORDER ISSUED')
  state.pendingCommand = null
}

/* ------------------------------------------------------------------ */
/*  input                                                              */
/* ------------------------------------------------------------------ */
canvas.addEventListener('contextmenu', (e) => e.preventDefault())
canvas.addEventListener('pointerdown', (e) => {
  if (!state.started) return
  if (e.button === 1) { orbiting = true; lastPointer = { x: e.clientX, y: e.clientY }; e.preventDefault(); return }
  if (e.button === 2) { handleOrder(e.clientX, e.clientY); return }
  if (e.button === 0) {
    dragStart = { x: e.clientX, y: e.clientY, shift: e.shiftKey }
    dragging = false
  }
})
window.addEventListener('pointermove', (e) => {
  if (orbiting) {
    cam.yaw -= (e.clientX - lastPointer.x) * 0.0055
    cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - lastPointer.y) * 0.004, 0.32, 1.28)
    lastPointer = { x: e.clientX, y: e.clientY }
    return
  }
  if (!dragStart) return
  const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y
  if (Math.abs(dx) > 7 || Math.abs(dy) > 7) dragging = true
  if (dragging) {
    const x = Math.min(e.clientX, dragStart.x), y = Math.min(e.clientY, dragStart.y)
    dragRect = { x, y, w: Math.abs(dx), h: Math.abs(dy) }
    marquee.style.display = 'block'
    marquee.style.left = x + 'px'; marquee.style.top = y + 'px'
    marquee.style.width = dragRect.w + 'px'; marquee.style.height = dragRect.h + 'px'
  }
})
window.addEventListener('pointerup', (e) => {
  if (orbiting && e.button === 1) { orbiting = false; return }
  if (e.button !== 0 || !dragStart) return
  if (dragging && dragRect) {
    const rect = dragRect
    const found = []
    for (const u of allUnits) {
      if (u.team !== 'player' || u.dead) continue
      v1.set(u.x, terrainHeight(u.x, u.z) + u.height * 0.5, u.z).project(camera)
      const sx = (v1.x * 0.5 + 0.5) * window.innerWidth
      const sy = (-v1.y * 0.5 + 0.5) * window.innerHeight
      if (sx >= rect.x && sx <= rect.x + rect.w && sy >= rect.y && sy <= rect.y + rect.h) found.push(u)
    }
    setSelection(found)
    if (found.length) { audio.select(); ui.toast(`${found.length} UNITS SELECTED`) }
  } else if (e.pointerType === 'touch') {
    handleTap(e.clientX, e.clientY)
  } else {
    handleSelect(e.clientX, e.clientY, dragStart.shift)
  }
  marquee.style.display = 'none'
  dragStart = null; dragRect = null; dragging = false
})
canvas.addEventListener('wheel', (e) => {
  cam.dist = THREE.MathUtils.clamp(cam.dist + e.deltaY * 0.055, 24, 112)
  e.preventDefault()
}, { passive: false })

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.pendingCommand) { state.pendingCommand = null; ui.toast('ORDER CANCELLED') }
    else setSelection([])
    return
  }
  if (!state.started || state.over) return
  if (e.code === 'KeyF') { cam.target.set(commandCenter.x, 0, commandCenter.z); }
  if (e.key >= '1' && e.key <= '8') { runCommand(['marine', 'scv', 'tank', 'supply', 'stim', 'scan', 'repair', 'attack'][Number(e.key) - 1]); return }
  if (e.code === 'Space') { cam.target.set(commandCenter.x, 0, commandCenter.z); e.preventDefault(); return }
  keys.add(e.code)
})
window.addEventListener('keyup', (e) => keys.delete(e.code))
window.addEventListener('blur', () => keys.clear())

/* ------------------------------------------------------------------ */
/*  deploy                                                             */
/* ------------------------------------------------------------------ */
let deployedInitialSelection = false
ui.onDeploy = () => {
  state.started = true
  audio.init()
  ui.setAudio(true)
  if (!deployedInitialSelection) {
    deployedInitialSelection = true
    setSelection([...marines.slice(0, 4), tank])
  }
  cam.target.set(1, 0, -9)
  ui.toast('COMMANDER ON DECK — HOLD THE LINE')
  setTimeout(() => ui.toast('SWARM PATROL DETECTED NORTH OF THE OUTPOST'), 1300)
  setTimeout(() => ui.toast('SCVs ARE HARVESTING — PROTECT THEM'), 3200)
}
ui.startLoading()

/* controls hint once */
setTimeout(() => {
  const p = groundPoint(window.innerWidth / 2, window.innerHeight / 2)
  if (p) p.y = 0
}, 600)

/* ------------------------------------------------------------------ */
/*  minimap click                                                      */
/* ------------------------------------------------------------------ */
ui.onJump = (x, z) => {
  cam.target.set(THREE.MathUtils.clamp(x, -58, 58), 0, THREE.MathUtils.clamp(z, -62, 58))
}

/* ------------------------------------------------------------------ */
/*  ui sync                                                            */
/* ------------------------------------------------------------------ */
function activeAndDisabled() {
  const sel = selection.filter(e => !e.dead)
  const units = sel.filter(e => !e.isBuilding && e.team === 'player')
  const hasBarracks = buildings.some(b => b.type === 'barracks' && b.team === 'player' && !b.dead)
  const marineSel = units.some(u => u.type === 'marine')
  const mechSel = units.some(u => u.type === 'scv' || u.type === 'tank') || sel.some(e => e.isBuilding && e.team === 'player')
  const noSupply = state.supply + 1 > state.maxSupply
  const d = {
    marine: !hasBarracks || state.minerals < 50 || noSupply,
    scv: !hasBarracks || state.minerals < 50 || noSupply,
    tank: !hasBarracks || state.minerals < 150 || state.gas < 100 || state.supply + 3 > state.maxSupply,
    supply: state.minerals < 100,
    stim: !marineSel || cooldowns.stim > 0,
    scan: cooldowns.scan > 0,
    repair: cooldowns.repair > 0 || state.minerals < 25 || !mechSel,
    attack: !units.some(u => u.type !== 'scv'),
  }
  const a = {
    attack: state.pendingCommand === 'attack',
    stim: cooldowns.stim > 0,
    scan: cooldowns.scan > 0,
    repair: cooldowns.repair > 0,
  }
  return { a, d }
}

function statusText() {
  if (trainingQueue.length) return `TRAINING ${trainingQueue[0].kind.toUpperCase()} — ${Math.max(0, trainingQueue[0].time).toFixed(1)}S`
  if (state.pendingCommand === 'attack') return 'ATTACK-MOVE: SELECT DESTINATION'
  if (state.wave <= 5 && state.waveTimer < 10) return 'WARNING — SWARM WAVE IMMINENT'
  return 'SYSTEMS NOMINAL'
}

function updateUI(dt) {
  uiClock -= dt
  viewClock -= dt
  if (viewClock <= 0) {
    viewClock = 0.25
    ui.viewPoly = viewPolygon()
  }
  if (uiClock > 0) return
  uiClock = 0.11
  const enemies = countEnemies()
  state.status = statusText()
  const { a, d } = activeAndDisabled()
  ui.updateHud({
    minerals: state.minerals, gas: state.gas, supply: state.supply, maxSupply: state.maxSupply,
    wave: Math.min(state.wave, 5), waveTimer: state.waveTimer, waveDuration: state.waveDuration,
    enemies, kills: state.kills, time: state.time, scvs: state.scvs, status: state.status,
  })
  ui.setSelection(uiSelection())
  ui.setCommandState(a, d)
  ui.drawMinimap({
    minerals: world.mineralNodes,
    buildings: buildings.filter(b => !b.dead),
    units: allUnits.filter(u => !u.dead).map(u => ({ x: u.x, z: u.z, team: u.team, selected: u.selected })),
    viewPoly: ui.viewPoly,
    time: state.time,
    alert: state.alertTimer > 0,
  })
  state.alertTimer = Math.max(0, state.alertTimer - 0.11)
}

/* ------------------------------------------------------------------ */
/*  main loop                                                          */
/* ------------------------------------------------------------------ */
const clock = new THREE.Clock()
let elapsed = 0

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  elapsed += dt

  if (state.started && !state.over) {
    state.time += dt
    updateWaves(dt)
    for (const u of allUnits) updateUnit(u, dt)
    for (const b of buildings) updateBuilding(b, dt, elapsed)
    separate()
    updateProjectiles(dt)
    updateTraining(dt)
    cooldowns.stim = Math.max(0, cooldowns.stim - dt)
    cooldowns.scan = Math.max(0, cooldowns.scan - dt)
    cooldowns.repair = Math.max(0, cooldowns.repair - dt)
    if (state.wavesSpawned >= 5 && countEnemies() === 0) {
      state.victoryTimer += dt
      if (state.victoryTimer > 2) endGame(true)
    }
    updateUI(dt)
  }

  world.update(dt, elapsed)
  wreckFire.material.opacity = 0.55 + Math.sin(elapsed * 7.3) * 0.18 + Math.sin(elapsed * 11.1) * 0.08
  wreckFire.scale.setScalar(7.5 + Math.sin(elapsed * 5.4) * 0.9)
  wreckLight.intensity = 24 + Math.sin(elapsed * 9.1) * 8
  effects.update(dt)
  updateCamera(dt)
  composer.render()
}
animate()
window.__SC = { state, allUnits, buildings, selection: () => selection, setSelection, cam, camera, scene }

/* small intro flourish: firefly-like scan light around base */
const introLight = new THREE.PointLight(0x6af0ff, 0, 40, 2)
introLight.position.set(14, 9, 4)
scene.add(introLight)
let introT = 0
setInterval(() => {
  introT += 0.5
  introLight.position.x = 14 + Math.cos(introT) * 10
  introLight.position.z = 4 + Math.sin(introT) * 10
  introLight.intensity = 9 + Math.sin(introT * 3) * 6
}, 500)
