import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export const FIELD = {
  minX: -42,
  maxX: 42,
  minZ: -42,
  maxZ: 17.5,
  gate: new THREE.Vector3(0, 0, 21),
  altar: new THREE.Vector3(0, 0, 15.5),
  portal: new THREE.Vector3(0, 0, -38),
  sidePortals: [new THREE.Vector3(-26, 0, -34), new THREE.Vector3(26, 0, -34)]
}


function mergeStaticGroup(group) {
  if (!group) return
  group.updateWorldMatrix(true, true)
  const inverse = new THREE.Matrix4().copy(group.matrixWorld).invert()
  const meshes = []
  group.traverse((node) => {
    if (!node.isMesh || node.isInstancedMesh || !node.visible) return
    const material = node.material
    if (!material || Array.isArray(material) || material.transparent || material.map) return
    if (material.blending !== THREE.NormalBlending) return
    meshes.push(node)
  })
  if (meshes.length < 4) return
  const geometries = []
  for (const source of meshes) {
    const geometry = source.geometry.clone()
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, source.matrixWorld))
    const flat = geometry.index ? geometry.toNonIndexed() : geometry
    if (flat !== geometry) geometry.dispose()
    for (const name of Object.keys(flat.attributes)) {
      if (name !== 'position' && name !== 'normal') flat.deleteAttribute(name)
    }
    if (!flat.getAttribute('normal')) flat.computeVertexNormals()
    const count = flat.getAttribute('position').count
    const colors = new Float32Array(count * 3)
    const color = source.material.color || new THREE.Color('#ffffff')
    const emissive = source.material.emissive
    const glow = emissive ? Math.min(0.7, (source.material.emissiveIntensity || 0) * 0.3) : 0
    const r = Math.min(1, color.r + (emissive ? emissive.r * glow : 0))
    const g = Math.min(1, color.g + (emissive ? emissive.g * glow : 0))
    const b = Math.min(1, color.b + (emissive ? emissive.b * glow : 0))
    for (let i = 0; i < count; i++) {
      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    flat.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometries.push(flat)
  }
  if (geometries.length < 4) {
    for (const geometry of geometries) geometry.dispose()
    return
  }
  const merged = mergeGeometries(geometries, false)
  for (const geometry of geometries) geometry.dispose()
  if (!merged) return
  const mesh = new THREE.Mesh(merged, new THREE.MeshLambertMaterial({
    vertexColors: true,
    flatShading: true,
    side: THREE.DoubleSide
  }))
  for (const source of meshes) source.parent?.remove(source)
  group.add(mesh)
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function groundHeightAt(x, z) {
  const r = Math.hypot(x * 0.92, z * 0.78)
  const edge = Math.max(0, r - 38)
  const hills = Math.min(19, edge * edge * 0.022)
  const roll = Math.sin(x * 0.17 + 1.2) * Math.cos(z * 0.13 - 0.8) * 0.11
  return hills + roll * Math.min(1, edge / 6)
}

function glowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.8)')
  g.addColorStop(0.46, 'rgba(255,255,255,0.22)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function detailTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const rand = mulberry32(19)
  ctx.fillStyle = '#777'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 5200; i++) {
    const n = 70 + Math.floor(rand() * 90)
    ctx.fillStyle = `rgba(${n},${n},${n},${0.08 + rand() * 0.14})`
    const s = 1 + rand() * 5
    ctx.fillRect(rand() * size, rand() * size, s, s)
  }
  for (let i = 0; i < 34; i++) {
    ctx.strokeStyle = `rgba(40,40,40,${0.05 + rand() * 0.08})`
    ctx.lineWidth = 1 + rand() * 2
    ctx.beginPath()
    let x = rand() * size
    let y = rand() * size
    ctx.moveTo(x, y)
    for (let j = 0; j < 5; j++) {
      x += (rand() - 0.5) * 34
      y += (rand() - 0.5) * 34
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(14, 14)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function bannerTexture(enemy = false) {
  const w = 256
  const h = 384
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  if (enemy) {
    grad.addColorStop(0, '#431b1c')
    grad.addColorStop(0.55, '#2b1114')
    grad.addColorStop(1, '#160a0d')
  } else {
    grad.addColorStop(0, '#1e3b52')
    grad.addColorStop(0.55, '#14293d')
    grad.addColorStop(1, '#0a1726')
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = enemy ? 'rgba(169,93,67,.65)' : 'rgba(224,190,120,.68)'
  ctx.lineWidth = 5
  ctx.strokeRect(10, 8, w - 20, h - 16)
  ctx.strokeStyle = enemy ? 'rgba(169,93,67,.24)' : 'rgba(224,190,120,.24)'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 18, w - 40, h - 36)

  ctx.save()
  ctx.translate(w / 2, h * 0.39)
  ctx.strokeStyle = enemy ? '#a45a45' : '#e0bd78'
  ctx.fillStyle = enemy ? '#a45a45' : '#e0bd78'
  if (enemy) {
    ctx.beginPath()
    ctx.moveTo(0, -64)
    ctx.lineTo(48, -16)
    ctx.lineTo(31, 24)
    ctx.lineTo(0, 74)
    ctx.lineTo(-31, 24)
    ctx.lineTo(-48, -16)
    ctx.closePath()
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 2, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-32, 26)
    ctx.lineTo(0, 54)
    ctx.lineTo(32, 26)
    ctx.lineWidth = 4
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(0, 0, 48, 0, Math.PI * 2)
    ctx.lineWidth = 4
    ctx.stroke()
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * 56, Math.sin(a) * 56)
      ctx.lineTo(Math.cos(a) * (i % 2 ? 74 : 84), Math.sin(a) * (i % 2 ? 74 : 84))
      ctx.lineWidth = i % 2 ? 2 : 4
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(0, 0, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(0, -16)
    ctx.lineTo(12, 0)
    ctx.lineTo(0, 16)
    ctx.lineTo(-12, 0)
    ctx.closePath()
    ctx.fillStyle = enemy ? '#2b1114' : '#14293d'
    ctx.fill()
  }
  ctx.restore()

  for (let i = 0; i < 8; i++) {
    const notch = 10 + (i % 3) * 7
    ctx.clearRect((w / 8) * i, h - 2, w / 8, notch / 2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makeSky(scene) {
  const skyGeo = new THREE.SphereGeometry(260, 40, 24)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#060b1d') },
      midColor: { value: new THREE.Color('#182a4c') },
      horizonColor: { value: new THREE.Color('#a56552') },
      lowColor: { value: new THREE.Color('#1d171c') },
      sunColor: { value: new THREE.Color('#ffbf82') },
      sunDir: { value: new THREE.Vector3(-0.55, 0.22, -0.8).normalize() }
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = normalize(world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec3 vWorld;
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 horizonColor;
      uniform vec3 lowColor;
      uniform vec3 sunColor;
      uniform vec3 sunDir;
      void main() {
        float y = clamp(vWorld.y, -0.15, 1.0);
        vec3 col = mix(lowColor, horizonColor, smoothstep(-0.08, 0.12, y));
        col = mix(col, midColor, smoothstep(0.08, 0.42, y));
        col = mix(col, topColor, smoothstep(0.38, 0.95, y));
        float disc = pow(max(dot(vWorld, sunDir), 0.0), 48.0);
        float halo = pow(max(dot(vWorld, sunDir), 0.0), 5.0);
        col += sunColor * disc * 0.55 + sunColor * halo * 0.12;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  })
  const sky = new THREE.Mesh(skyGeo, skyMat)
  sky.frustumCulled = false
  scene.add(sky)

  const starGeo = new THREE.BufferGeometry()
  const count = 700
  const pos = new Float32Array(count * 3)
  const rand = mulberry32(71)
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(0.08 + rand() * 0.9)
    const r = 225
    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
    pos[i * 3 + 1] = Math.cos(phi) * r
    pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const starMat = new THREE.PointsMaterial({
    color: '#c9d8ff',
    size: 1.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  scene.add(new THREE.Points(starGeo, starMat))

  const glow = glowTexture()
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffe3b1', transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }))
  moon.position.set(-88, 74, -152)
  moon.scale.set(34, 34, 1)
  scene.add(moon)
  const moonCore = new THREE.Mesh(new THREE.SphereGeometry(5.5, 20, 16), new THREE.MeshBasicMaterial({ color: '#ffe8be' }))
  moonCore.position.copy(moon.position)
  scene.add(moonCore)

  return { sky, moon, glow }
}

function makeTerrain(scene) {
  const geo = new THREE.PlaneGeometry(170, 170, 84, 84)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  const rand = mulberry32(11)
  const moss = new THREE.Color('#4a5a35')
  const mossLight = new THREE.Color('#66794a')
  const ash = new THREE.Color('#57453b')
  const ashDark = new THREE.Color('#2c2420')
  const path = new THREE.Color('#8a7253')
  const stone = new THREE.Color('#736e63')
  const purple = new THREE.Color('#5b3f68')

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setY(i, groundHeightAt(x, z))
    const n = (Math.sin(x * 0.37 + z * 0.21) + Math.sin(x * 0.11 - z * 0.29) + rand() * 0.9) / 2.9
    c.copy(moss).lerp(mossLight, n * 0.75)
    if (z < -8) c.lerp(ash, THREE.MathUtils.smoothstep(-z, 8, 30) * 0.8)
    const pathMask = Math.max(0, 1 - Math.abs(x) / 7.5) * THREE.MathUtils.smoothstep(z, -34, 12)
    c.lerp(path, pathMask * 0.64)
    const gateMask = Math.max(0, 1 - Math.hypot(x / 24, (z - 24) / 10))
    c.lerp(stone, gateMask * 0.55)
    const portalDist = Math.hypot(x, z + 38)
    if (portalDist < 10) c.lerp(purple, (1 - portalDist / 10) * 0.65)
    if (Math.hypot(x + 26, z + 34) < 6) c.lerp(purple, 0.4)
    if (Math.hypot(x - 26, z + 34) < 6) c.lerp(purple, 0.4)
    c.lerp(ashDark, Math.max(0, rand() * 0.18 - 0.02))
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()

  const mat = new THREE.MeshLambertMaterial({
    vertexColors: true,
    map: detailTexture()
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}

function makeMountains(scene) {
  const rand = mulberry32(83)
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: '#202435', roughness: 1, metalness: 0, flatShading: true })
  const matFar = new THREE.MeshStandardMaterial({ color: '#272b3f', roughness: 1, metalness: 0, flatShading: true })
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 + rand() * 0.14
    const dist = 105 + rand() * 48
    const height = 26 + rand() * 48
    const radius = 16 + rand() * 22
    const geo = new THREE.ConeGeometry(radius, height, 5 + Math.floor(rand() * 3))
    geo.rotateY(rand() * Math.PI)
    geo.translate(0, height / 2, 0)
    const mesh = new THREE.Mesh(geo, dist > 125 ? matFar : mat)
    mesh.position.set(Math.cos(a) * dist, -3, Math.sin(a) * dist)
    mesh.scale.z = 0.7 + rand() * 0.6
    group.add(mesh)
  }
  mergeStaticGroup(group)
  scene.add(group)
  return group
}

function makeCastle(scene, glow) {
  const group = new THREE.Group()
  group.position.set(0, 0, 22)
  const stone = new THREE.MeshStandardMaterial({ color: '#6b675e', roughness: 0.88, metalness: 0.06, flatShading: true })
  const stoneDark = new THREE.MeshStandardMaterial({ color: '#4c4a45', roughness: 0.92, metalness: 0.05, flatShading: true })
  const stoneLight = new THREE.MeshStandardMaterial({ color: '#8b8578', roughness: 0.86, metalness: 0.04, flatShading: true })
  const wood = new THREE.MeshStandardMaterial({ color: '#4a2d18', roughness: 0.84, metalness: 0.04 })
  const iron = new THREE.MeshStandardMaterial({ color: '#2d2f33', roughness: 0.55, metalness: 0.75 })
  const roof = new THREE.MeshStandardMaterial({ color: '#31413c', roughness: 0.82, metalness: 0.08, flatShading: true })
  const gold = new THREE.MeshStandardMaterial({ color: '#b98f4a', roughness: 0.42, metalness: 0.72 })

  const platform = new THREE.Mesh(new THREE.BoxGeometry(46, 1.2, 9), stoneDark)
  platform.position.set(0, 0.6, 2.8)
  platform.receiveShadow = true
  platform.castShadow = true
  group.add(platform)

  const stepA = new THREE.Mesh(new THREE.BoxGeometry(17, 0.45, 2.4), stone)
  stepA.position.set(0, 0.22, -2.3)
  stepA.receiveShadow = true
  group.add(stepA)
  const stepB = new THREE.Mesh(new THREE.BoxGeometry(13, 0.28, 1.8), stoneLight)
  stepB.position.set(0, 0.36, -3.1)
  stepB.receiveShadow = true
  group.add(stepB)

  const wallL = new THREE.Mesh(new THREE.BoxGeometry(16.5, 4.3, 2.2), stone)
  wallL.position.set(-12.8, 2.75, 2.6)
  wallL.castShadow = true
  wallL.receiveShadow = true
  group.add(wallL)
  const wallR = wallL.clone()
  wallR.position.x = 12.8
  group.add(wallR)

  const wallTrimL = new THREE.Mesh(new THREE.BoxGeometry(17, 0.35, 2.6), stoneLight)
  wallTrimL.position.set(-12.8, 4.92, 2.6)
  wallTrimL.castShadow = true
  group.add(wallTrimL)
  const wallTrimR = wallTrimL.clone()
  wallTrimR.position.x = 12.8
  group.add(wallTrimR)

  for (const side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1, 2.4), stone)
      merlon.position.set(side * (5.1 + i * 1.93), 5.6, 2.6)
      merlon.castShadow = true
      group.add(merlon)
    }
  }

  const gatePillarGeo = new THREE.BoxGeometry(3.3, 8.6, 3.4)
  for (const x of [-4.7, 4.7]) {
    const tower = new THREE.Mesh(gatePillarGeo, stone)
    tower.position.set(x, 4.3, 2.2)
    tower.castShadow = true
    tower.receiveShadow = true
    group.add(tower)
    const towerTrim = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.45, 3.9), stoneLight)
    towerTrim.position.set(x, 8.65, 2.2)
    towerTrim.castShadow = true
    group.add(towerTrim)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i === 1 || i === 2) && (j === 1 || j === 2)) continue
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.9, 0.72), stone)
        m.position.set(x - 1.35 + i * 0.9, 9.3, 1.1 + j * 0.9)
        m.castShadow = true
        group.add(m)
      }
    }
    const roofCone = new THREE.Mesh(new THREE.ConeGeometry(2.7, 3.7, 4), roof)
    roofCone.position.set(x, 12.0, 2.2)
    roofCone.rotation.y = Math.PI / 4
    roofCone.castShadow = true
    group.add(roofCone)
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), gold)
    finial.position.set(x, 14.2, 2.2)
    group.add(finial)

    const bannerMat = new THREE.MeshStandardMaterial({ map: bannerTexture(false), roughness: 0.9, side: THREE.DoubleSide })
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 3.5), bannerMat)
    banner.position.set(x, 6.15, 0.42)
    banner.rotation.y = Math.PI
    banner.castShadow = true
    group.add(banner)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.6, 6), iron)
    rod.rotation.z = Math.PI / 2
    rod.position.set(x, 7.95, 0.35)
    group.add(rod)
  }

  const outerTowerGeo = new THREE.CylinderGeometry(3.2, 3.8, 10.5, 8)
  for (const x of [-21.6, 21.6]) {
    const t = new THREE.Mesh(outerTowerGeo, stone)
    t.position.set(x, 5.25, 2.2)
    t.castShadow = true
    t.receiveShadow = true
    group.add(t)
    const trim = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.55, 8), stoneLight)
    trim.position.set(x, 10.45, 2.2)
    trim.castShadow = true
    group.add(trim)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.05, 0.8), stone)
      m.position.set(x + Math.cos(a) * 2.7, 11.1, 2.2 + Math.sin(a) * 2.7)
      m.rotation.y = -a
      m.castShadow = true
      group.add(m)
    }
    const cap = new THREE.Mesh(new THREE.ConeGeometry(3.15, 4.2, 8), roof)
    cap.position.set(x, 13.9, 2.2)
    cap.castShadow = true
    group.add(cap)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), gold)
    tip.position.set(x, 16.4, 2.2)
    group.add(tip)
  }

  const gateArch = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.48, 8, 22, Math.PI), stone)
  gateArch.position.set(0, 4.25, 0.45)
  gateArch.rotation.z = 0
  group.add(gateArch)

  const doorGeo = new THREE.BoxGeometry(4.7, 4.55, 0.45)
  const door = new THREE.Mesh(doorGeo, wood)
  door.position.set(0, 2.4, 0.52)
  door.castShadow = true
  group.add(door)
  for (let i = 0; i < 6; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.1, 0.05), iron)
    plank.position.set(-1.95 + i * 0.78, 2.35, 0.79)
    group.add(plank)
  }
  for (const y of [1.0, 3.7]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(4.55, 0.22, 0.06), iron)
    band.position.set(0, y, 0.8)
    group.add(band)
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 6, 14), gold)
  ring.position.set(0, 2.35, 0.86)
  group.add(ring)

  const gateGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 6), new THREE.MeshBasicMaterial({ color: '#ffb469', transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }))
  gateGlow.position.set(0, 2.7, -0.35)
  group.add(gateGlow)

  const brazierMat = new THREE.MeshStandardMaterial({ color: '#38302a', roughness: 0.6, metalness: 0.4 })
  for (const x of [-8.7, 8.7]) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1.5, 6), iron)
    stem.position.set(x, 0.75, -0.2)
    group.add(stem)
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.3, 0.45, 8), brazierMat)
    bowl.position.set(x, 1.55, -0.2)
    group.add(bowl)
  }

  const campBanner = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 5.2), new THREE.MeshStandardMaterial({ map: bannerTexture(false), roughness: 0.9, side: THREE.DoubleSide }))
  campBanner.position.set(0, 7.4, 3.72)
  group.add(campBanner)
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 10.8, 6), iron)
  pole.position.set(0, 7.4, 3.8)
  group.add(pole)

  mergeStaticGroup(group)
  scene.add(group)

  const fires = []
  for (const x of [-8.7, 8.7]) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ff9c45', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }))
    sprite.position.set(x, 1.9, 21.8)
    sprite.scale.set(1.9, 1.9, 1)
    scene.add(sprite)
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffedb0', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }))
    core.position.set(x, 1.85, 21.8)
    core.scale.set(0.72, 0.72, 1)
    scene.add(core)
    fires.push({ sprite, core, x, phase: Math.random() * 10 })
  }

  return { group, fires }
}

function makePortal(scene, position, scale, glow, enemyBanner) {
  const group = new THREE.Group()
  group.position.copy(position)
  const stone = new THREE.MeshStandardMaterial({ color: '#29262f', roughness: 0.92, metalness: 0.05, flatShading: true })
  const crystal = new THREE.MeshStandardMaterial({ color: '#5b2f82', emissive: '#9e4cff', emissiveIntensity: 1.6, roughness: 0.25, metalness: 0.2, flatShading: true })
  const teal = new THREE.MeshStandardMaterial({ color: '#1f5b5e', emissive: '#39e0cf', emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.2, flatShading: true })

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 6.1, 0.55, 12), stone)
  platform.position.y = 0.27
  platform.receiveShadow = true
  group.add(platform)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 0.7), stone)
    slab.position.set(Math.cos(a) * 5.85, 0.18, Math.sin(a) * 5.85)
    slab.rotation.y = -a
    group.add(slab)
  }

  for (const side of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.95, 5.5, 5), stone)
    p.position.set(side * 3.5, 2.75, 0)
    p.rotation.z = side * 0.08
    p.castShadow = true
    group.add(p)
    const shard = new THREE.Mesh(new THREE.ConeGeometry(0.63, 2.4, 4), crystal)
    shard.position.set(side * 3.5, 6.2, 0)
    shard.rotation.z = side * 0.18
    group.add(shard)
  }

  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.32, 8, 36), stone)
  ring.position.y = 5.1
  group.add(ring)
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.12, 6, 40), crystal)
  innerRing.position.y = 5.1
  group.add(innerRing)

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 14), crystal)
  orb.position.y = 5.1
  group.add(orb)
  const orbGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#b266ff', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }))
  orbGlow.position.y = 5.1
  orbGlow.scale.set(6.4, 6.4, 1)
  group.add(orbGlow)

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 1.1, 24, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: '#8c47da', transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  )
  beam.position.y = 17
  group.add(beam)

  const groundRing = new THREE.Mesh(
    new THREE.RingGeometry(3.6, 4.35, 48),
    new THREE.MeshBasicMaterial({ color: '#b15cff', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  )
  groundRing.rotation.x = -Math.PI / 2
  groundRing.position.y = 0.57
  group.add(groundRing)
  const groundRing2 = new THREE.Mesh(
    new THREE.RingGeometry(1.7, 1.95, 32),
    new THREE.MeshBasicMaterial({ color: '#4df5df', transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  )
  groundRing2.rotation.x = -Math.PI / 2
  groundRing2.position.y = 0.59
  group.add(groundRing2)

  const shards = []
  const rand = mulberry32(Math.floor(position.x * 97 + position.z * 13) + 100)
  for (let i = 0; i < 4; i++) {
    const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.24 + rand() * 0.32), i % 2 ? teal : crystal)
    const a = rand() * Math.PI * 2
    const r = 2 + rand() * 2.4
    shard.position.set(Math.cos(a) * r, 1 + rand() * 4.4, Math.sin(a) * r)
    shard.userData.baseY = shard.position.y
    shard.userData.phase = rand() * Math.PI * 2
    shard.userData.radius = r
    shard.userData.angle = a
    group.add(shard)
    shards.push(shard)
  }

  if (enemyBanner) {
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.4), new THREE.MeshStandardMaterial({ map: bannerTexture(true), roughness: 0.9, side: THREE.DoubleSide }))
    banner.position.set(-5.4, 3.6, 0)
    banner.rotation.y = 0.3
    group.add(banner)
  }

  group.scale.setScalar(scale)
  scene.add(group)
  const light = new THREE.PointLight('#9f4dff', 8, 26, 1.7)
  light.position.copy(position).add(new THREE.Vector3(0, 5.1 * scale, 0))
  if (enemyBanner) scene.add(light)
  return { group, shards, orb, orbGlow, groundRing, groundRing2, innerRing, light, position: position.clone() }
}

function makeRuins(scene) {
  const group = new THREE.Group()
  const rand = mulberry32(29)
  const stone = new THREE.MeshLambertMaterial({ color: '#54514a', flatShading: true })
  const dark = new THREE.MeshLambertMaterial({ color: '#3b3935', flatShading: true })
  const positions = [
    [-15, 3, 2.8], [16, -4, 4.1], [-22, -13, 3.2], [23, -18, 2.2], [-9, -20, 1.8],
    [13, 8, 2.4], [-30, 4, 3.6], [31, -1, 2.9], [8, -29, 2.1], [-31, -26, 3.3]
  ]
  for (const [x, z, height] of positions) {
    const g = new THREE.Group()
    const y = groundHeightAt(x, z)
    const h = height * (0.65 + rand() * 0.7)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48 + rand() * 0.18, 0.6, h, 7), rand() > 0.5 ? stone : dark)
    shaft.position.y = h / 2
    shaft.rotation.z = (rand() - 0.5) * 0.16
    shaft.rotation.x = (rand() - 0.5) * 0.1
    shaft.castShadow = true
    shaft.receiveShadow = true
    g.add(shaft)
    if (rand() > 0.35) {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.4), stone)
      cap.position.y = h + 0.08
      cap.rotation.y = rand()
      cap.castShadow = true
      g.add(cap)
    }
    g.position.set(x, y, z)
    group.add(g)
  }

  const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 4.2, 7), stone)
  fallen.rotation.z = Math.PI / 2
  fallen.rotation.y = 0.45
  fallen.position.set(10, groundHeightAt(10, -13) + 0.55, -13)
  fallen.castShadow = true
  group.add(fallen)

  const archLeft = new THREE.Mesh(new THREE.BoxGeometry(1.1, 5.5, 1.4), stone)
  archLeft.position.set(-18, 2.75, -4)
  archLeft.castShadow = true
  group.add(archLeft)
  const archRight = archLeft.clone()
  archRight.position.x = -14.5
  group.add(archRight)
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.8, 1.5), stone)
  lintel.position.set(-16.25, 5.2, -4)
  lintel.rotation.z = 0.06
  lintel.castShadow = true
  group.add(lintel)

  mergeStaticGroup(group)
  scene.add(group)
  return group
}

function makeTrees(scene) {
  const rand = mulberry32(47)
  const positions = []
  for (let i = 0; i < 92; i++) {
    const a = rand() * Math.PI * 2
    const r = 34 + Math.pow(rand(), 0.75) * 30
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r * 0.92 - 3
    if (z > 12 && Math.abs(x) < 31) continue
    if (Math.abs(x) < 12 && z < 5 && z > -32) continue
    positions.push([x, z, 0.7 + rand() * 0.85])
  }

  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.3, 2.9, 5)
  trunkGeo.translate(0, 1.45, 0)
  const layers = []
  const layerData = [
    [1.75, 2.7, 2.25, 1.95],
    [1.32, 2.25, 3.45, 2.0],
    [0.88, 1.8, 4.5, 1.55]
  ]
  for (const [radius, height, y, segments] of layerData) {
    const g = new THREE.ConeGeometry(radius, height, 6)
    g.translate(0, y, 0)
    layers.push(g)
  }
  const foliageGeo = mergeGeometries(layers)
  const trunkMat = new THREE.MeshLambertMaterial({ color: '#3a2a20', flatShading: true })
  const leafMat = new THREE.MeshLambertMaterial({ color: '#233b2e', flatShading: true })

  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, positions.length)
  const foliage = new THREE.InstancedMesh(foliageGeo, leafMat, positions.length)
  trunks.castShadow = true
  foliage.castShadow = true
  foliage.receiveShadow = true
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  positions.forEach(([x, z, s], i) => {
    const y = groundHeightAt(x, z) - 0.1
    dummy.position.set(x, y, z)
    dummy.rotation.y = rand() * Math.PI * 2
    dummy.scale.set(s, s * (0.85 + rand() * 0.4), s)
    dummy.updateMatrix()
    trunks.setMatrixAt(i, dummy.matrix)
    foliage.setMatrixAt(i, dummy.matrix)
    color.setHSL(0.34 + rand() * 0.04, 0.23 + rand() * 0.12, 0.16 + rand() * 0.08)
    foliage.setColorAt(i, color)
  })
  scene.add(trunks, foliage)

  const deadGroup = new THREE.Group()
  const deadMat = new THREE.MeshLambertMaterial({ color: '#332a25', flatShading: true })
  const deadSpots = [[-24, -8], [21, 12], [-35, -19], [35, -24], [-7, -36], [18, -31], [-19, 9], [28, 3], [-32, -31]]
  for (const [x, z] of deadSpots) {
    const g = new THREE.Group()
    const h = 2.6 + rand() * 2.4
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.28, h, 5), deadMat)
    trunk.position.y = h / 2
    trunk.rotation.z = (rand() - 0.5) * 0.2
    trunk.castShadow = true
    g.add(trunk)
    for (let i = 0; i < 3; i++) {
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 1.5 + rand(), 4), deadMat)
      branch.position.set((rand() - 0.5) * 1.2, h * (0.55 + rand() * 0.35), (rand() - 0.5) * 1.2)
      branch.rotation.z = (rand() - 0.5) * 1.6
      branch.rotation.x = (rand() - 0.5) * 0.8
      branch.castShadow = true
      g.add(branch)
    }
    g.position.set(x, groundHeightAt(x, z), z)
    deadGroup.add(g)
  }
  mergeStaticGroup(deadGroup)
  scene.add(deadGroup)
  return { trunks, foliage, deadGroup }
}

function makeRocks(scene) {
  const rand = mulberry32(61)
  const geo = new THREE.DodecahedronGeometry(1, 0)
  const mat = new THREE.MeshLambertMaterial({ color: '#4a4741', flatShading: true })
  const count = 54
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.castShadow = true
  mesh.receiveShadow = true
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  for (let i = 0; i < count; i++) {
    let x, z
    if (i < 22) {
      const a = rand() * Math.PI * 2
      const r = 30 + rand() * 22
      x = Math.cos(a) * r
      z = Math.sin(a) * r * 0.9 - 3
    } else {
      x = (rand() - 0.5) * 68
      z = -34 + rand() * 48
    }
    const s = 0.3 + Math.pow(rand(), 2) * 2.2
    dummy.position.set(x, groundHeightAt(x, z) + s * 0.28, z)
    dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3)
    dummy.scale.set(s, s * (0.5 + rand() * 0.5), s * (0.7 + rand() * 0.5))
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    color.setHSL(0.09, 0.06, 0.2 + rand() * 0.12)
    mesh.setColorAt(i, color)
  }
  scene.add(mesh)
  return mesh
}

function makeGrass(scene) {
  const rand = mulberry32(37)
  const geo = new THREE.ConeGeometry(0.06, 0.5, 3)
  geo.translate(0, 0.25, 0)
  const mat = new THREE.MeshLambertMaterial({ color: '#3c4a29', flatShading: true })
  const count = 520
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const r = 12 + rand() * 42
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r * 0.95 - 5
    if (z > 13 && Math.abs(x) < 30) continue
    dummy.position.set(x, groundHeightAt(x, z), z)
    dummy.rotation.y = rand() * Math.PI
    const s = 0.5 + rand() * 1.1
    dummy.scale.set(s, s, s)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    color.setHSL(0.2 + rand() * 0.06, 0.2, 0.18 + rand() * 0.09)
    mesh.setColorAt(i, color)
  }
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}

function makeLavaCracks(scene, glow) {
  const rand = mulberry32(97)
  const group = new THREE.Group()
  const mat = new THREE.MeshBasicMaterial({ color: '#ff7b35', transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false })
  for (let i = 0; i < 14; i++) {
    const x = (rand() - 0.5) * 50
    const z = -16 - rand() * 22
    const length = 3 + rand() * 9
    const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.07 + rand() * 0.08, length), mat)
    crack.rotation.x = -Math.PI / 2
    crack.rotation.z = rand() * Math.PI
    crack.position.set(x, groundHeightAt(x, z) + 0.04, z)
    group.add(crack)
  }
  scene.add(group)
  const lights = []
  for (const [x, z] of [[-9, -27]]) {
    const light = new THREE.PointLight('#ff6d2d', 3.6, 13, 2)
    light.position.set(x, 0.9, z)
    scene.add(light)
    lights.push(light)
  }
  return { group, lights }
}

function makeProps(scene, glow) {
  const group = new THREE.Group()
  const rand = mulberry32(113)
  const metal = new THREE.MeshLambertMaterial({ color: '#4c4a43' })
  const wood = new THREE.MeshLambertMaterial({ color: '#39271c' })
  const bone = new THREE.MeshLambertMaterial({ color: '#a79c85' })
  for (let i = 0; i < 18; i++) {
    const x = (rand() - 0.5) * 62
    const z = -30 + rand() * 44
    if (z > 12 && Math.abs(x) < 27) continue
    const y = groundHeightAt(x, z)
    if (rand() > 0.5) {
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 1.5), metal)
      sword.position.set(x, y + 0.03, z)
      sword.rotation.y = rand() * Math.PI * 2
      sword.rotation.x = 0.1
      group.add(sword)
      const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.08), metal)
      hilt.position.set(x, y + 0.04, z)
      hilt.rotation.y = sword.rotation.y
      group.add(hilt)
    } else {
      const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), bone)
      skull.position.set(x, y + 0.15, z)
      skull.scale.set(1, 0.85, 1.15)
      group.add(skull)
    }
  }
  for (let i = 0; i < 7; i++) {
    const x = (rand() - 0.5) * 44
    const z = -24 + rand() * 34
    const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 2.2 + rand() * 1.4, 5), wood)
    stake.position.set(x, groundHeightAt(x, z) + 1.2, z)
    stake.rotation.z = (rand() - 0.5) * 0.3
    stake.castShadow = true
    group.add(stake)
    const rag = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), new THREE.MeshStandardMaterial({ color: '#4a1d1e', roughness: 1, side: THREE.DoubleSide }))
    rag.position.set(x, groundHeightAt(x, z) + 1.9, z + 0.02)
    rag.rotation.y = rand() * Math.PI
    group.add(rag)
  }
  mergeStaticGroup(group)
  scene.add(group)
  return group
}

function makeEmbers(scene, glow, { count = 420, color = '#ff9b54', height = 18, radius = 46, size = 0.22 } = {}) {
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const speeds = new Float32Array(count)
  const rand = mulberry32(131)
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.pow(rand(), 0.55) * radius
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = rand() * height
    positions[i * 3 + 2] = Math.sin(a) * r * 0.9 - 4
    seeds[i] = rand() * Math.PI * 2
    speeds[i] = 0.25 + rand() * 0.9
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color,
    size,
    map: glow,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  scene.add(points)
  return {
    points,
    update(dt, time) {
      const p = geo.attributes.position.array
      for (let i = 0; i < count; i++) {
        p[i * 3 + 1] += dt * speeds[i]
        p[i * 3] += Math.sin(time * 0.6 + seeds[i]) * dt * 0.45
        p[i * 3 + 2] += Math.cos(time * 0.45 + seeds[i]) * dt * 0.25
        if (p[i * 3 + 1] > height) {
          p[i * 3 + 1] = 0
          const a = seeds[i] + time * 1.7
          const r = 6 + (Math.sin(seeds[i] * 7.1) * 0.5 + 0.5) * radius
          p[i * 3] = Math.cos(a) * r
          p[i * 3 + 2] = Math.sin(a) * r * 0.9 - 4
        }
      }
      geo.attributes.position.needsUpdate = true
      mat.opacity = 0.58 + Math.sin(time * 0.8) * 0.08
    }
  }
}

function makeDust(scene, glow) {
  const geo = new THREE.BufferGeometry()
  const count = 90
  const pos = new Float32Array(count * 3)
  const rand = mulberry32(151)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 96
    pos[i * 3 + 1] = 0.25 + rand() * 1.6
    pos[i * 3 + 2] = -38 + rand() * 60
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ color: '#b7a58a', size: 0.5, map: glow, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending })
  const points = new THREE.Points(geo, mat)
  scene.add(points)
  return {
    update(time) {
      mat.opacity = 0.06 + Math.sin(time * 0.3) * 0.025
      points.position.x = Math.sin(time * 0.05) * 2
    }
  }
}

export function createWorld(scene) {
  const sky = makeSky(scene)
  makeTerrain(scene)
  makeMountains(scene)

  scene.fog = new THREE.Fog('#242334', 68, 190)

  const hemi = new THREE.HemisphereLight('#c4d8f6', '#5c4630', 2.05)
  scene.add(hemi)
  const ambient = new THREE.AmbientLight('#8f7fae', 1.15)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight('#ffd6a3', 2.9)
  sun.position.set(-32, 46, 24)
  sun.target.position.set(0, 0, -4)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -48
  sun.shadow.camera.right = 48
  sun.shadow.camera.top = 48
  sun.shadow.camera.bottom = -48
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 130
  sun.shadow.bias = -0.0005
  sun.shadow.normalBias = 0.035
  scene.add(sun, sun.target)



  const castle = makeCastle(scene, sky.glow)
  const mainPortal = makePortal(scene, FIELD.portal, 1.12, sky.glow, true)
  const sidePortals = FIELD.sidePortals.map((p) => makePortal(scene, p, 0.68, sky.glow, false))
  makeRuins(scene)
  makeTrees(scene)
  makeRocks(scene)
  makeGrass(scene)
  const lava = makeLavaCracks(scene, sky.glow)
  makeProps(scene, sky.glow)

  const embers = makeEmbers(scene, sky.glow)
  const portalEmbers = makeEmbers(scene, sky.glow, { count: 180, color: '#b578ff', height: 16, radius: 13, size: 0.16 })
  portalEmbers.points.position.set(0, 0, -38)
  const embers2 = makeEmbers(scene, sky.glow, { count: 160, color: '#ffbf72', height: 12, radius: 17, size: 0.14 })
  embers2.points.position.set(0, 0, 20)
  const dust = makeDust(scene, sky.glow)

  const portals = [mainPortal, ...sidePortals]

  return {
    sun,
    portals,
    castle,
    lava,
    sky: sky.sky,
    glow: sky.glow,
    update(dt, time) {
      sky.sky.position.copy(scene.position)
      embers.update(dt, time)
      portalEmbers.update(dt, time)
      embers2.update(dt, time)
      dust.update(time)

      for (const fire of castle.fires) {
        const flicker = 0.82 + Math.sin(time * 9 + fire.phase) * 0.12 + Math.sin(time * 21 + fire.phase * 3) * 0.06
        fire.sprite.scale.set(1.8 * flicker, 2.1 * flicker, 1)
        fire.core.scale.set(0.66 * flicker, 0.9 * flicker, 1)
      }

      for (const portal of portals) {
        const pulse = 0.82 + Math.sin(time * 1.9 + portal.position.z) * 0.13
        portal.orb.scale.setScalar(pulse)
        portal.orbGlow.scale.set(6.2 * pulse, 6.2 * pulse, 1)
        portal.orbGlow.material.opacity = 0.62 + Math.sin(time * 2.7) * 0.12
        portal.groundRing.rotation.z = time * 0.18
        portal.groundRing2.rotation.z = -time * 0.32
        portal.innerRing.rotation.z = time * 0.4
        portal.light.intensity = 6.8 + Math.sin(time * 2.2) * 1.6
        for (const shard of portal.shards) {
          shard.position.y = shard.userData.baseY + Math.sin(time * 1.2 + shard.userData.phase) * 0.35
          shard.rotation.y = time * 0.7 + shard.userData.phase
          shard.rotation.x = time * 0.4
        }
      }

      for (const light of lava.lights) {
        light.intensity = 3 + Math.sin(time * 3.1 + light.position.x) * 1.1
      }
    }
  }
}
