import * as THREE from 'three'

const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.SphereGeometry(1, 16, 12),
  ico: new THREE.IcosahedronGeometry(1, 0),
  oct: new THREE.OctahedronGeometry(1, 0),
  cyl8: new THREE.CylinderGeometry(1, 1, 1, 8),
  cyl16: new THREE.CylinderGeometry(1, 1, 1, 16),
  cone: new THREE.ConeGeometry(1, 1, 7),
  torus: new THREE.TorusGeometry(1, 0.08, 8, 40),
}

export const MAT = {
  hull: new THREE.MeshStandardMaterial({ color: 0x39434d, metalness: 0.58, roughness: 0.46 }),
  hullDark: new THREE.MeshStandardMaterial({ color: 0x1b232a, metalness: 0.52, roughness: 0.58 }),
  hullLight: new THREE.MeshStandardMaterial({ color: 0x515c66, metalness: 0.46, roughness: 0.5 }),
  unitArmor: new THREE.MeshStandardMaterial({ color: 0x365873, metalness: 0.45, roughness: 0.46, emissive: 0x071c2b, emissiveIntensity: 0.55 }),
  unitLight: new THREE.MeshStandardMaterial({ color: 0x6489a4, metalness: 0.38, roughness: 0.42, emissive: 0x0a2334, emissiveIntensity: 0.5 }),
  scvPlate: new THREE.MeshStandardMaterial({ color: 0xb07630, metalness: 0.45, roughness: 0.5, emissive: 0x2a1604, emissiveIntensity: 0.45 }),
  panel: new THREE.MeshStandardMaterial({ color: 0x252e37, metalness: 0.48, roughness: 0.58 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x11161b, metalness: 0.2, roughness: 0.9 }),
  accent: new THREE.MeshStandardMaterial({ color: 0x0a2b36, emissive: 0x4ce7ff, emissiveIntensity: 1.55, metalness: 0.3, roughness: 0.28 }),
  accentWarm: new THREE.MeshStandardMaterial({ color: 0x3a1b08, emissive: 0xff8f39, emissiveIntensity: 1.8, metalness: 0.2, roughness: 0.3 }),
  accentRed: new THREE.MeshStandardMaterial({ color: 0x3a0b08, emissive: 0xff3b2a, emissiveIntensity: 2.0, metalness: 0.2, roughness: 0.3 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x123c4a, emissive: 0x2ad4ff, emissiveIntensity: 0.55, metalness: 0.6, roughness: 0.12, transparent: true, opacity: 0.9 }),
  gold: new THREE.MeshStandardMaterial({ color: 0x8a6a32, metalness: 0.95, roughness: 0.28 }),
  carapace: new THREE.MeshStandardMaterial({ color: 0x5c3164, metalness: 0.25, roughness: 0.65, emissive: 0x1c0724, emissiveIntensity: 0.45, flatShading: true }),
  carapaceDark: new THREE.MeshStandardMaterial({ color: 0x28162f, metalness: 0.2, roughness: 0.8, flatShading: true }),
  flesh: new THREE.MeshStandardMaterial({ color: 0x7a3358, metalness: 0.15, roughness: 0.62, flatShading: true }),
  fleshLight: new THREE.MeshStandardMaterial({ color: 0xa44d74, metalness: 0.1, roughness: 0.55, flatShading: true }),
  bio: new THREE.MeshStandardMaterial({ color: 0x123d27, emissive: 0x59ff8b, emissiveIntensity: 1.15, metalness: 0.1, roughness: 0.48 }),
  bioPurple: new THREE.MeshStandardMaterial({ color: 0x30113f, emissive: 0xbb4dff, emissiveIntensity: 1.05, metalness: 0.1, roughness: 0.5 }),
  crystal: new THREE.MeshStandardMaterial({ color: 0x1e9ec8, emissive: 0x0c86c4, emissiveIntensity: 0.85, metalness: 0.4, roughness: 0.08, transparent: true, opacity: 0.94 }),
  crystalGold: new THREE.MeshStandardMaterial({ color: 0xcf9b3c, emissive: 0xb87a12, emissiveIntensity: 0.8, metalness: 0.55, roughness: 0.1, transparent: true, opacity: 0.94 }),
  rock: new THREE.MeshStandardMaterial({ color: 0x2b3038, metalness: 0.08, roughness: 0.96, flatShading: true }),
  rockRed: new THREE.MeshStandardMaterial({ color: 0x3d2a29, metalness: 0.06, roughness: 0.98, flatShading: true }),
}

const glowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const x = c.getContext('2d')
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(190,250,255,.85)')
  g.addColorStop(0.5, 'rgba(90,210,255,.25)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
})()

export function glowSprite(color, size = 2, opacity = 1) {
  const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })
  const s = new THREE.Sprite(m)
  s.scale.setScalar(size)
  s.renderOrder = 5
  return s
}

function mesh(geo, mat, sx = 1, sy = 1, sz = 1, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}
const box = (w, h, d, mat, x = 0, y = 0, z = 0) => mesh(G.box, mat, w, h, d, x, y, z)
const sphere = (r, mat, x = 0, y = 0, z = 0, sy = 1) => mesh(G.sphere, mat, r, r * sy, r, x, y, z)
const cyl = (r, h, mat, x = 0, y = 0, z = 0, geo = G.cyl8) => mesh(geo, mat, r, h, r, x, y, z)
const cone = (r, h, mat, x = 0, y = 0, z = 0) => mesh(G.cone, mat, r, h, r, x, y, z)

function panelStrip(parent, mat, w, h, d, x, y, z, rotY = 0) {
  const m = box(w, h, d, mat, x, y, z); m.rotation.y = rotY; parent.add(m); return m
}

export function createHealthBar(team = 'player') {
  const c = document.createElement('canvas'); c.width = 128; c.height = 20
  const ctx = c.getContext('2d')
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: true })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(1.85, 0.28, 1)
  const color = team === 'player' ? '#67f4d1' : '#ff5f4d'
  let last = -1
  function draw(frac) {
    const f = Math.max(0, Math.min(1, frac))
    if (Math.abs(f - last) < 0.004) return
    last = f
    ctx.clearRect(0, 0, 128, 20)
    ctx.fillStyle = 'rgba(3,9,13,.82)'
    ctx.fillRect(0, 5, 128, 10)
    ctx.strokeStyle = 'rgba(150,225,255,.45)'; ctx.lineWidth = 1
    ctx.strokeRect(0.5, 5.5, 127, 9)
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(2, 7, 124, 6)
    ctx.fillStyle = color
    ctx.fillRect(2, 7, Math.max(0, 124 * f), 6)
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(2, 7, Math.max(0, 124 * f), 1.5)
    tex.needsUpdate = true
  }
  draw(1)
  return { sprite, draw }
}

function animateLight(mats, t, speed = 1, phase = 0) {
  const v = 1.6 + Math.sin(t * speed + phase) * 0.8
  for (const m of mats) m.emissiveIntensity = v
}

/* ---------------- TERRAN BUILDINGS ---------------- */
export function createCommandCenter() {
  const g = new THREE.Group()
  const parts = { lights: [], radar: null, ring: null }

  const platform = cyl(11, 1.6, MAT.hullDark, 0, 0.8, 0, new THREE.CylinderGeometry(1, 1.16, 1, 10))
  g.add(platform)
  const deck = cyl(9.6, 0.7, MAT.panel, 0, 1.9, 0, new THREE.CylinderGeometry(1, 1, 1, 10))
  g.add(deck)
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2
    const leg = box(2.4, 1.2, 2.4, MAT.hull, Math.cos(a) * 9.2, 1.1, Math.sin(a) * 9.2)
    leg.rotation.y = -a
    g.add(leg)
    const pad = cyl(0.45, 0.3, MAT.accent, Math.cos(a) * 10.3, 0.3, Math.sin(a) * 10.3)
    g.add(pad)
    parts.lights.push(pad.material)
  }

  const core = cyl(5.4, 3.4, MAT.hull, 0, 4.2, 0, new THREE.CylinderGeometry(1, 1.18, 1, 8))
  g.add(core)
  const band = cyl(5.6, 0.42, MAT.accent, 0, 4.8, 0, new THREE.CylinderGeometry(1, 1, 1, 8))
  g.add(band)

  const tower = box(6.4, 3.4, 6.4, MAT.panel, 0, 7.5, 0)
  tower.rotation.y = Math.PI / 8
  g.add(tower)
  const towerTop = box(5.4, 0.5, 5.4, MAT.panel, 0, 9.35, 0)
  towerTop.rotation.y = Math.PI / 8
  g.add(towerTop)
  for (let i = -1; i <= 1; i += 2) {
    g.add(box(0.6, 2.2, 0.4, MAT.accentWarm, i * 2.1, 8.1, 3.35))
    g.add(box(3.2, 0.35, 0.32, MAT.accent, i * 1.9, 7.0, 3.26))
  }
  const commandPod = box(4.4, 2.3, 3.6, MAT.hullDark, 0, 7.6, 4.3)
  g.add(commandPod)
  const window = box(3.4, 0.85, 0.12, MAT.glass, 0, 7.85, 6.15)
  g.add(window)

  for (let i = -1; i <= 1; i += 2) {
    g.add(box(3.4, 0.08, 0.12, MAT.accent, i * 0.02, 9.62, i * 2.1))
    g.add(box(0.12, 0.08, 3.4, MAT.accent, i * 2.1, 9.62, 0))
    g.add(box(1.2, 0.35, 0.8, MAT.hullDark, i * 1.6, 9.72, -1.5))
    g.add(box(0.8, 0.12, 0.06, MAT.accentWarm, i * 1.6, 9.9, -1.08))
  }
  const mast = cyl(0.18, 4.6, MAT.hullDark, 0, 11.4, 0, G.cyl8)
  g.add(mast)
  const radar = new THREE.Group()
  radar.position.set(0, 13.2, 0)
  const dish = cyl(1.9, 0.42, MAT.hullDark, 0, 0, 0, new THREE.CylinderGeometry(1, 0.22, 1, 16))
  dish.rotation.x = Math.PI / 2.4
  radar.add(dish)
  const dishGlow = cyl(0.6, 0.1, MAT.accent, 0, 0.35, -0.7, G.cyl16)
  dishGlow.rotation.x = Math.PI / 2.4
  radar.add(dishGlow)
  g.add(radar)
  parts.radar = radar

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(7.8, 0.07, 6, 64),
    new THREE.MeshBasicMaterial({ color: 0x5eefff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  ring.rotation.x = Math.PI / 2
  ring.position.y = 11.5
  g.add(ring)
  parts.ring = ring
  const ring2 = ring.clone(); ring2.scale.setScalar(0.72); ring2.material = ring.material.clone(); ring2.material.opacity = 0.3; g.add(ring2)
  parts.ring2 = ring2

  const beacon = glowSprite(0x7ef6ff, 0.9, 0.035)
  beacon.position.y = 11.6
  g.add(beacon)
  parts.beacon = beacon

  const light = new THREE.PointLight(0x45c4ff, 16, 28, 2)
  light.position.set(0, 12, 0)
  g.add(light)
  parts.light = light

  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2 + 0.4
    const r = 6.9
    g.add(box(0.22, 0.16, 1.6, MAT.accent, Math.cos(a) * r, 2.45, Math.sin(a) * r).rotateY(-a))
  }
  return { group: g, parts, radius: 11, height: 14 }
}

export function createBarracks() {
  const g = new THREE.Group()
  const parts = { lights: [], door: null }
  g.add(box(9, 1, 7.6, MAT.hullDark, 0, 0.5, 0))
  g.add(box(8.2, 3.8, 6.8, MAT.panel, 0, 2.7, 0))
  const roof = box(8.6, 0.55, 7.4, MAT.panel, 0, 4.75, 0)
  roof.rotation.z = 0.055
  g.add(roof)
  g.add(box(7.0, 1.5, 2.2, MAT.hull, 0, 3.0, 3.4))
  const door = box(3.6, 2.4, 0.18, MAT.hullDark, 0, 1.7, 3.55)
  g.add(door)
  parts.door = door
  const doorGlow = box(3.0, 0.18, 0.1, MAT.accent, 0, 2.8, 3.66); g.add(doorGlow)
  const doorGlow2 = box(0.18, 2.0, 0.1, MAT.accent, 0, 1.7, 3.66); g.add(doorGlow2)
  for (const side of [-1, 1]) {
    g.add(box(1.1, 2.4, 1.1, MAT.hull, side * 4.9, 2.4, -1.4))
    const cap = cyl(0.8, 0.5, MAT.hullLight, side * 4.9, 3.75, -1.4); g.add(cap)
    const pipe = cyl(0.18, 3.4, MAT.hullDark, side * 4.35, 2.9, 2.2); pipe.rotation.z = Math.PI / 2; g.add(pipe)
    for (let i = 0; i < 3; i++) g.add(box(0.3, 0.22, 0.22, MAT.accentWarm, side * 4.55, 1.2 + i * 0.8, 3.35))
  }
  const antenna = cyl(0.09, 3.4, MAT.hullLight, -2.6, 6.2, -1.4); g.add(antenna)
  g.add(box(0.9, 0.1, 0.1, MAT.accentWarm, -2.6, 7.8, -1.4))
  const strip = box(6.8, 0.15, 0.15, MAT.accent, 0, 4.4, 3.55); g.add(strip)
  parts.lights.push(strip.material)
  const lamp = glowSprite(0xff9f52, 1.7, 0.8); lamp.position.set(2.6, 3.6, 3.7); g.add(lamp); parts.lamp = lamp
  return { group: g, parts, radius: 6.2, height: 7 }
}

export function createSupplyDepot() {
  const g = new THREE.Group()
  const parts = { lights: [] }
  g.add(box(5.4, 0.5, 5, MAT.hullDark, 0, 0.25, 0))
  g.add(box(4.6, 2.2, 4.2, MAT.panel, 0, 1.6, 0))
  const c1 = box(4.0, 1.5, 3.2, MAT.hull, -0.2, 3.45, 0); c1.rotation.y = 0.16; g.add(c1)
  const c2 = box(3.4, 1.2, 2.7, MAT.hull, 0.35, 4.75, -0.25); c2.rotation.y = -0.22; g.add(c2)
  for (let i = 0; i < 3; i++) {
    const s = box(0.16, 1.1, 0.1, i === 1 ? MAT.accentWarm : MAT.accent, -1.2 + i * 1.2, 1.6, 2.14)
    g.add(s); parts.lights.push(s.material)
    g.add(box(1.0, 0.16, 0.1, MAT.accent, -1.1 + i * 1.1, 3.5, 1.66))
  }
  const glow = glowSprite(0x5eeaff, 3.4, 0.36); glow.position.set(0, 3.2, 0); g.add(glow)
  return { group: g, parts, radius: 3.6, height: 6 }
}

export function createTurret() {
  const g = new THREE.Group()
  const parts = { lights: [], head: null, muzzles: [], barrels: [] }
  g.add(cyl(2.4, 0.9, MAT.hullDark, 0, 0.45, 0))
  g.add(cyl(1.7, 0.8, MAT.panel, 0, 1.2, 0))
  g.add(box(2.5, 1.2, 2.5, MAT.hull, 0, 2.05, 0))
  const head = new THREE.Group(); head.position.set(0, 2.9, 0); g.add(head); parts.head = head
  head.add(box(2.4, 1.0, 2.4, MAT.hull, 0, 0, 0))
  head.add(sphere(0.62, MAT.glass, 0, 0.55, 0.2))
  for (const side of [-1, 1]) {
    const barrel = cyl(0.16, 3.0, MAT.hullDark, side * 0.42, 0, 1.9, G.cyl8)
    barrel.rotation.x = Math.PI / 2
    head.add(barrel); parts.barrels.push(barrel)
    const tip = new THREE.Object3D(); tip.position.set(side * 0.42, 0, 3.45); head.add(tip); parts.muzzles.push(tip)
    const stripe = box(0.12, 0.12, 1.4, MAT.accent, side * 0.42, 0.18, 1.7); head.add(stripe)
  }
  head.add(box(0.5, 0.18, 0.18, MAT.accentWarm, 0, 0.58, -0.95))
  const light = glowSprite(0x6ff2ff, 2.2, 0.5); light.position.set(0, 3.2, 0); g.add(light); parts.lamp = light
  return { group: g, parts, radius: 2.6, height: 4 }
}

/* ---------------- TERRAN UNITS ---------------- */
export function createMarine() {
  const g = new THREE.Group()
  const parts = { legs: [], arms: [], muzzle: null, torso: null, visor: null, gun: null }
  const torso = new THREE.Group(); torso.position.y = 1.1; g.add(torso); parts.torso = torso
  torso.add(box(0.66, 0.72, 0.44, MAT.unitArmor, 0, 0.1, 0))
  torso.add(box(0.56, 0.34, 0.12, MAT.unitLight, 0, 0.18, 0.26))
  torso.add(box(0.5, 0.07, 0.06, MAT.accent, 0, 0.3, 0.33))
  torso.add(box(0.68, 0.16, 0.48, MAT.panel, 0, 0.4, 0))
  const backpack = box(0.5, 0.56, 0.22, MAT.hullDark, 0, 0.08, -0.36); torso.add(backpack)
  backpack.add(box(0.3, 0.06, 0.04, MAT.accentWarm, 0, 0.14, -0.13))
  for (const side of [-1, 1]) {
    const pad = box(0.2, 0.24, 0.36, MAT.unitLight, side * 0.4, 0.34, 0)
    pad.rotation.z = side * 0.16
    torso.add(pad)
    torso.add(box(0.06, 0.1, 0.18, MAT.accent, side * 0.48, 0.42, 0.04))
    const arm = new THREE.Group(); arm.position.set(side * 0.42, 0.22, 0.06); torso.add(arm); parts.arms.push(arm)
    arm.add(box(0.15, 0.42, 0.16, MAT.unitArmor, side * 0.04, -0.18, 0.02))
    arm.add(box(0.16, 0.16, 0.4, MAT.hull, side * 0.04, -0.36, 0.22))
  }
  const head = new THREE.Group(); head.position.set(0, 0.68, 0.02); torso.add(head)
  const helmet = sphere(0.25, MAT.unitLight, 0, 0, 0, 0.92); head.add(helmet)
  helmet.scale.set(0.29, 0.22, 0.32)
  head.add(box(0.3, 0.12, 0.1, MAT.accent, 0, 0.015, 0.19)); parts.visor = head.children[1]
  head.add(box(0.36, 0.06, 0.18, MAT.hullDark, 0, 0.19, 0))
  const antenna = cyl(0.012, 0.4, MAT.hullLight, 0.16, 0.32, -0.05, G.cyl8); head.add(antenna)
  const gun = new THREE.Group(); gun.position.set(0.24, 0.08, 0.3); torso.add(gun); parts.gun = gun
  gun.add(box(0.14, 0.16, 0.72, MAT.unitArmor, 0, 0, 0.26))
  gun.add(box(0.1, 0.1, 0.3, MAT.hull, 0, 0.02, 0.66))
  gun.add(cyl(0.045, 0.6, MAT.hullLight, 0, 0.03, 0.95, G.cyl8).rotateX(Math.PI / 2))
  gun.add(box(0.05, 0.05, 0.28, MAT.accent, 0.06, 0.07, 0.4))
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.03, 1.3); gun.add(muzzle); parts.muzzle = muzzle
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(side * 0.2, 0.82, 0); g.add(leg); parts.legs.push(leg)
    leg.add(box(0.22, 0.5, 0.24, MAT.unitArmor, 0, -0.24, 0))
    leg.add(box(0.24, 0.2, 0.26, MAT.hull, 0, -0.48, 0.02))
    leg.add(box(0.24, 0.4, 0.22, MAT.panel, 0, -0.66, 0))
    leg.add(box(0.28, 0.14, 0.48, MAT.rubber, 0, -0.84, 0.1))
    leg.add(box(0.2, 0.08, 0.26, MAT.accent, 0, -0.6, 0.12))
  }
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.78, 0.94, 24), new THREE.MeshBasicMaterial({ color: 0x6af6ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07; ring.visible = false; g.add(ring); parts.ring = ring
  return { group: g, parts, radius: 0.6, height: 2.2 }
}

export function createSCV() {
  const g = new THREE.Group()
  const parts = { legs: [], arms: [], muzzles: [], muzzle: null, ring: null }
  const body = sphere(0.8, MAT.scvPlate, 0, 1.05, 0, 0.95); body.scale.set(0.84, 0.76, 0.8); g.add(body)
  g.add(box(1.1, 0.5, 1.2, MAT.panel, 0, 1.22, 0))
  const cockpit = sphere(0.38, MAT.glass, 0, 1.32, 0.62); cockpit.scale.set(0.47, 0.3, 0.23); g.add(cockpit)
  for (const side of [-1, 1]) {
    const shoulder = sphere(0.3, MAT.hullDark, side * 0.9, 1.1, 0); g.add(shoulder)
    const arm = new THREE.Group(); arm.position.set(side * 0.95, 1.02, 0); g.add(arm); parts.arms.push(arm)
    arm.add(box(0.2, 0.72, 0.22, MAT.hullLight, side * 0.16, -0.28, 0.05))
    arm.add(box(0.34, 0.22, 0.5, MAT.unitLight, side * 0.28, -0.62, 0.25))
    arm.add(box(0.12, 0.34, 0.12, MAT.hullLight, side * 0.42, -0.6, 0.46))
    const tip = new THREE.Object3D(); tip.position.set(side * 0.34, -0.7, 0.5); arm.add(tip); parts.muzzles.push(tip)
  }
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(side * 0.36, 0.55, 0); g.add(leg); parts.legs.push(leg)
    leg.add(box(0.28, 0.45, 0.3, MAT.hullDark, 0, -0.18, 0))
    leg.add(box(0.4, 0.2, 0.62, MAT.rubber, 0, -0.44, 0.1))
  }
  const thruster = glowSprite(0x67efff, 1.6, 0.65); thruster.position.set(0, 0.55, -0.2); g.add(thruster); parts.thruster = thruster
  g.add(box(0.7, 0.16, 0.12, MAT.accentWarm, 0, 1.55, -0.6))
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.82, 1.0, 24), new THREE.MeshBasicMaterial({ color: 0x6af6ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07; ring.visible = false; g.add(ring); parts.ring = ring
  return { group: g, parts, radius: 0.7, height: 2.3 }
}

export function createTank() {
  const g = new THREE.Group()
  const parts = { turret: null, barrel: null, muzzle: null, recoil: 0, tracks: [], ring: null }
  for (const side of [-1, 1]) {
    const track = box(1.1, 0.9, 4.4, MAT.rubber, side * 1.15, 0.55, 0); g.add(track); parts.tracks.push(track)
    for (let i = 0; i < 4; i++) {
      const wheel = cyl(0.44, 0.3, MAT.hullDark, side * 1.15, 0.46, -1.5 + i, G.cyl16)
      wheel.rotation.z = Math.PI / 2; g.add(wheel)
    }
    g.add(box(1.18, 0.22, 4.5, MAT.hull, side * 1.15, 0.98, 0))
  }
  g.add(box(2.2, 0.85, 3.9, MAT.unitArmor, 0, 1.22, 0))
  g.add(box(2.4, 0.28, 4.2, MAT.panel, 0, 1.55, 0))
  const turret = new THREE.Group(); turret.position.set(0, 1.95, -0.1); g.add(turret); parts.turret = turret
  turret.add(cyl(1.2, 0.62, MAT.hullLight, 0, 0, 0, G.cyl16))
  turret.add(box(1.9, 0.72, 2.0, MAT.hull, 0, 0.25, 0.18))
  turret.add(box(0.55, 0.35, 0.5, MAT.glass, -0.55, 0.52, 0.55))
  const barrelPivot = new THREE.Group(); barrelPivot.position.set(0, 0.34, 1.05); turret.add(barrelPivot); parts.barrel = barrelPivot
  barrelPivot.add(cyl(0.16, 2.9, MAT.hullDark, 0, 0, 1.5, G.cyl8).rotateX(Math.PI / 2))
  barrelPivot.add(cyl(0.26, 0.7, MAT.hullLight, 0, 0, 0.25, G.cyl8).rotateX(Math.PI / 2))
  barrelPivot.add(box(0.12, 0.12, 1.6, MAT.accent, 0, 0.25, 1.6))
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, 3.0); barrelPivot.add(muzzle); parts.muzzle = muzzle
  turret.add(box(0.4, 0.2, 0.25, MAT.accentWarm, 0.72, 0.35, -0.6))
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.5, 28), new THREE.MeshBasicMaterial({ color: 0x6af6ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.08; ring.visible = false; g.add(ring); parts.ring = ring
  return { group: g, parts, radius: 1.5, height: 3.2 }
}

/* ---------------- ZERG ---------------- */
export function createZergling() {
  const g = new THREE.Group()
  const parts = { legs: [], arms: [], ring: null, eyes: null }
  const body = sphere(0.62, MAT.carapace, 0, 0.9, 0, 0.72); body.scale.set(0.53, 0.45, 0.71); g.add(body)
  const back = new THREE.Group(); back.position.set(0, 1.12, -0.18); g.add(back)
  for (let i = 0; i < 4; i++) {
    const spike = cone(0.09, 0.6 - i * 0.08, MAT.carapaceDark, 0, 0.2, -i * 0.2)
    spike.rotation.x = -0.3; back.add(spike)
  }
  const head = sphere(0.36, MAT.carapaceDark, 0, 1.02, 0.66); head.scale.set(0.36, 0.29, 0.43); g.add(head)
  const jaw = cone(0.22, 0.5, MAT.flesh, 0, 0.9, 0.95); jaw.rotation.x = Math.PI / 2; g.add(jaw)
  for (const side of [-1, 1]) {
    const eye = sphere(0.07, MAT.accentWarm, side * 0.16, 1.12, 0.92); g.add(eye)
    const horn = cone(0.06, 0.38, MAT.carapaceDark, side * 0.24, 1.25, 0.55); horn.rotation.z = side * 0.35; g.add(horn)
    const arm = new THREE.Group(); arm.position.set(side * 0.42, 0.95, 0.42); g.add(arm); parts.arms.push(arm)
    arm.add(box(0.12, 0.45, 0.12, MAT.carapaceDark, side * 0.12, -0.12, 0.2))
    const claw = cone(0.09, 0.55, MAT.fleshLight, side * 0.2, -0.24, 0.5); claw.rotation.x = 1.2; arm.add(claw)
  }
  for (let i = 0; i < 4; i++) {
    const side = i < 2 ? -1 : 1
    const z = i % 2 === 0 ? 0.28 : -0.34
    const leg = new THREE.Group(); leg.position.set(side * 0.42, 0.72, z); g.add(leg); parts.legs.push(leg)
    leg.add(box(0.1, 0.5, 0.1, MAT.carapaceDark, side * 0.2, -0.2, 0))
    leg.add(box(0.1, 0.42, 0.1, MAT.carapaceDark, side * 0.38, -0.52, z * 0.2))
    const claw = cone(0.07, 0.3, MAT.fleshLight, side * 0.46, -0.72, z * 0.2); claw.rotation.x = Math.PI; leg.add(claw)
  }
  const veins = box(0.1, 0.06, 0.7, MAT.bio, 0, 1.24, 0.05); g.add(veins)
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.96, 22), new THREE.MeshBasicMaterial({ color: 0xff6048, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07; ring.visible = false; g.add(ring); parts.ring = ring
  return { group: g, parts, radius: 0.7, height: 1.8 }
}

export function createHydralisk() {
  const g = new THREE.Group()
  const parts = { segments: [], arms: [], muzzle: null, ring: null }
  const base = new THREE.Group(); g.add(base)
  for (let i = 0; i < 4; i++) {
    const seg = sphere(0.5 - i * 0.05, i % 2 ? MAT.carapaceDark : MAT.carapace, 0, 0.45 + i * 0.13, -0.7 + i * 0.28, 0.8)
    seg.scale.set((0.5 - i * 0.05) * (1.0 - i * 0.05), (0.5 - i * 0.05) * 0.8, (0.5 - i * 0.05) * 1.1)
    base.add(seg); parts.segments.push(seg)
  }
  const torso = new THREE.Group(); torso.position.set(0, 1.15, 0.5); g.add(torso); parts.torso = torso
  torso.add(sphere(0.58, MAT.carapace, 0, 0.42, 0, 1.15))
  torso.add(sphere(0.4, MAT.carapaceDark, 0, 0.96, 0.2))
  const head = new THREE.Group(); head.position.set(0, 1.15, 0.38); torso.add(head); parts.head = head
  head.add(sphere(0.3, MAT.flesh, 0, 0, 0.12))
  const crest = cone(0.28, 0.9, MAT.carapaceDark, 0, 0.35, -0.08); crest.rotation.x = -0.25; head.add(crest)
  for (const side of [-1, 1]) {
    const eye = sphere(0.055, MAT.bio, side * 0.16, 0.08, 0.34); head.add(eye)
    const tusk = cone(0.06, 0.55, MAT.fleshLight, side * 0.22, -0.1, 0.34); tusk.rotation.x = Math.PI / 2.5; tusk.rotation.z = side * 0.22; head.add(tusk)
    const arm = new THREE.Group(); arm.position.set(side * 0.52, 0.42, 0.2); torso.add(arm); parts.arms.push(arm)
    arm.add(box(0.13, 0.62, 0.13, MAT.carapaceDark, side * 0.18, -0.2, 0.18))
    const blade = cone(0.12, 0.85, MAT.fleshLight, side * 0.3, -0.5, 0.48); blade.rotation.x = 0.9; arm.add(blade)
    const spine = cone(0.05, 0.5, MAT.bioPurple, 0, 0.55, -0.35); spine.rotation.x = -0.45; torso.add(spine)
  }
  torso.add(box(0.28, 0.16, 0.7, MAT.bioPurple, 0, 0.16, -0.32))
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 1.75, 1.0); g.add(muzzle); parts.muzzle = muzzle
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.0, 24), new THREE.MeshBasicMaterial({ color: 0xff6048, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07; ring.visible = false; g.add(ring); parts.ring = ring
  return { group: g, parts, radius: 0.8, height: 2.5 }
}

export function createHive() {
  const g = new THREE.Group()
  const parts = { sacs: [], spires: [], lights: [] }
  const mound = sphere(7.5, MAT.carapaceDark, 0, 0.5, 0, 0.34); mound.scale.set(9.4, 2.55, 8.25); g.add(mound)
  const mound2 = sphere(5.4, MAT.carapace, 0, 1.5, 0, 0.5); g.add(mound2)
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2
    const r = 3 + (i % 3) * 1.6
    const spire = cone(0.7 + (i % 3) * 0.3, 5 + (i % 2) * 3, MAT.carapaceDark, Math.cos(a) * r, 3.6 + (i % 2) * 1.5, Math.sin(a) * r)
    spire.rotation.z = Math.cos(a) * 0.25; spire.rotation.x = Math.sin(a) * 0.25
    g.add(spire); parts.spires.push(spire)
    const tip = sphere(0.28, MAT.bioPurple, Math.cos(a) * r, 5.4 + (i % 2) * 1.5, Math.sin(a) * r); g.add(tip)
  }
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + 0.4
    const sac = sphere(0.85 + (i % 3) * 0.25, MAT.bio, Math.cos(a) * 3.5, 2.4 + (i % 2) * 1.1, Math.sin(a) * 3.2)
    sac.scale.set(0.85 + (i % 3) * 0.25, (0.85 + (i % 3) * 0.25) * 1.15, 0.85 + (i % 3) * 0.25); g.add(sac); parts.sacs.push(sac)
    const glow = glowSprite(0x7aff92, 3.6, 0.22); glow.position.copy(sac.position); g.add(glow)
  }
  const heart = sphere(1.5, MAT.fleshLight, 0, 4.2, 0); g.add(heart); parts.heart = heart
  const light = new THREE.PointLight(0x8dff7a, 22, 34, 2); light.position.set(0, 5, 2); g.add(light)
  parts.light = light
  return { group: g, parts, radius: 8, height: 8 }
}

/* ---------------- PROPS ---------------- */
export function createCrystalCluster(gold = false) {
  const g = new THREE.Group()
  const mat = gold ? MAT.crystalGold : MAT.crystal
  const n = 7 + Math.floor(Math.random() * 4)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const r = Math.random() * 2.6
    const h = 1.2 + Math.random() * 3.2
    const c = mesh(G.oct, mat, 0.28 + Math.random() * 0.45, h, 0.28 + Math.random() * 0.45, Math.cos(a) * r, h * 0.42, Math.sin(a) * r)
    c.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, (Math.random() - 0.5) * 0.5)
    c.castShadow = true
    g.add(c)
  }
  const rock = mesh(G.ico, MAT.rock, 2.6, 0.6, 2.2, 0, 0.2, 0); rock.rotation.y = Math.random() * Math.PI; g.add(rock)
  const glow = glowSprite(gold ? 0xffbd54 : 0x3bdcff, 6, 0.2); glow.position.y = 1.8; g.add(glow)
  return { group: g, glow }
}

export function createRock(scale = 1) {
  const g = new THREE.Group()
  const m = mesh(G.ico, Math.random() > 0.7 ? MAT.rockRed : MAT.rock, 1.6, 0.8, 1.4, 0, 0.25, 0)
  m.rotation.set(Math.random(), Math.random() * Math.PI, Math.random() * 0.4)
  m.scale.multiplyScalar(scale)
  g.add(m)
  const m2 = mesh(G.ico, MAT.rock, 0.7, 0.5, 0.6, 1.2 * scale, 0.2, 0.3)
  m2.rotation.set(0.4, 1.2, 0.2); m2.scale.multiplyScalar(scale); g.add(m2)
  return g
}

export function createBeacon(color = 0x5eeaff) {
  const g = new THREE.Group()
  g.add(cyl(0.5, 0.2, MAT.hullDark, 0, 0.1, 0))
  g.add(cyl(0.08, 1.8, MAT.hullLight, 0, 1, 0, G.cyl8))
  const l = glowSprite(color, 2.6, 0.8); l.position.y = 2; g.add(l)
  const light = new THREE.PointLight(color, 12, 12, 2); light.position.y = 2; g.add(light)
  return { group: g, glow: l, light }
}
