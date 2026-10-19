import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { ARENA } from './physics.js'
import {
  makeFieldTexture,
  makeGlowTexture,
  makeSparkTexture,
  makeAdTexture,
  makeScreenTexture
} from './textures.js'

const BLUE = 0x35b4ff
const ORANGE = 0xff8a1f
const CYAN = 0x6cf5ff

function roundedRectShape(hw, hl, r) {
  const shape = new THREE.Shape()
  shape.moveTo(-hw + r, -hl)
  shape.lineTo(hw - r, -hl)
  shape.quadraticCurveTo(hw, -hl, hw, -hl + r)
  shape.lineTo(hw, hl - r)
  shape.quadraticCurveTo(hw, hl, hw - r, hl)
  shape.lineTo(-hw + r, hl)
  shape.quadraticCurveTo(-hw, hl, -hw, hl - r)
  shape.lineTo(-hw, -hl + r)
  shape.quadraticCurveTo(-hw, -hl, -hw + r, -hl)
  return shape
}

function perimeterPoints(hw, hl, r, sideSteps = 36, cornerSteps = 10) {
  const pts = []
  const add = (x, z) => {
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(last.x - x, last.z - z) > 0.01) pts.push(new THREE.Vector2(x, z))
  }
  for (let i = 0; i <= sideSteps; i++) {
    const z = -(hl - r) + (2 * (hl - r) * i) / sideSteps
    add(hw, z)
  }
  for (let i = 1; i <= cornerSteps; i++) {
    const a = (Math.PI / 2) * (i / cornerSteps)
    add(hw - r + Math.cos(a) * r, hl - r + Math.sin(a) * r)
  }
  for (let i = 1; i <= sideSteps; i++) {
    const x = hw - r - (2 * (hw - r) * i) / sideSteps
    add(x, hl)
  }
  for (let i = 1; i <= cornerSteps; i++) {
    const a = Math.PI / 2 + (Math.PI / 2) * (i / cornerSteps)
    add(-hw + r + Math.cos(a) * r, hl - r + Math.sin(a) * r)
  }
  for (let i = 1; i <= sideSteps; i++) {
    const z = hl - r - (2 * (hl - r) * i) / sideSteps
    add(-hw, z)
  }
  for (let i = 1; i <= cornerSteps; i++) {
    const a = Math.PI + (Math.PI / 2) * (i / cornerSteps)
    add(-hw + r + Math.cos(a) * r, -hl + r + Math.sin(a) * r)
  }
  for (let i = 1; i <= sideSteps; i++) {
    const x = -hw + r + (2 * (hw - r) * i) / sideSteps
    add(x, -hl)
  }
  for (let i = 1; i <= cornerSteps; i++) {
    const a = Math.PI * 1.5 + (Math.PI / 2) * (i / cornerSteps)
    add(hw - r + Math.cos(a) * r, -hl + r + Math.sin(a) * r)
  }
  return pts
}

function segmentInGoalGap(a, b) {
  const half = ARENA.goalWidth / 2
  const onEnd = Math.abs(Math.abs(a.y) - ARENA.halfLength) < 0.01 && Math.abs(Math.abs(b.y) - ARENA.halfLength) < 0.01
  if (!onEnd) return false
  const mid = (a.x + b.x) / 2
  return Math.abs(mid) < half
}

function buildWallGeometry(points, y0, y1, skipGoals = true) {
  const positions = []
  const colors = []
  const uvs = []
  const cBlue = new THREE.Color(BLUE)
  const cOrange = new THREE.Color(ORANGE)
  const cCyan = new THREE.Color(CYAN)
  let u = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    if (skipGoals && segmentInGoalGap(a, b)) continue
    const segLength = a.distanceTo(b)
    const color = a.y < -20 ? cBlue : a.y > 20 ? cOrange : cCyan
    positions.push(a.x, y0, a.y, b.x, y0, b.y, b.x, y1, b.y)
    positions.push(a.x, y0, a.y, b.x, y1, b.y, a.x, y1, a.y)
    uvs.push(u, 0, u + segLength, 0, u + segLength, 1, u, 0, u + segLength, 1, u, 1)
    for (let k = 0; k < 6; k++) colors.push(color.r, color.g, color.b)
    u += segLength
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function buildWallLines(points, y, skipGoals = true) {
  const positions = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    if (skipGoals && segmentInGoalGap(a, b)) continue
    positions.push(a.x, y, a.y, b.x, y, b.y)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geo
}

function addBox(scene, size, position, material, rotation = null) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material)
  mesh.position.set(position[0], position[1], position[2])
  if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2])
  scene.add(mesh)
  return mesh
}

function createGoal(scene, side, glowTexture) {
  const team = side < 0 ? 'blue' : 'orange'
  const color = side < 0 ? BLUE : ORANGE
  const z = side * ARENA.halfLength
  const backZ = side * (ARENA.halfLength + ARENA.goalDepth)
  const gw = ARENA.goalWidth
  const gh = ARENA.goalHeight
  const group = new THREE.Group()
  scene.add(group)

  const frameMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.15,
    metalness: 0.55,
    roughness: 0.22
  })
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x07111d,
    metalness: 0.7,
    roughness: 0.35,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  })

  for (const sx of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.65, gh, 0.65), frameMat)
    post.position.set((sx * gw) / 2, gh / 2, z)
    group.add(post)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }))
    glow.scale.set(3.4, gh * 1.1, 1)
    glow.position.set((sx * gw) / 2, gh / 2, z - side * 0.15)
    group.add(glow)
  }

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(gw + 0.65, 0.65, 0.65), frameMat)
  crossbar.position.set(0, gh, z)
  group.add(crossbar)

  const backPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(gw, gh),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  )
  backPanel.position.set(0, gh / 2, backZ - side * 0.12)
  group.add(backPanel)

  const sideWallA = new THREE.Mesh(new THREE.PlaneGeometry(ARENA.goalDepth, gh), darkMat)
  sideWallA.position.set(-gw / 2, gh / 2, z + side * ARENA.goalDepth / 2)
  sideWallA.rotation.y = Math.PI / 2
  group.add(sideWallA)
  const sideWallB = sideWallA.clone()
  sideWallB.position.x = gw / 2
  group.add(sideWallB)

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), darkMat)
  backWall.position.set(0, gh / 2, backZ)
  group.add(backWall)

  const netPositions = []
  const spacing = 1.35
  for (let x = -gw / 2; x <= gw / 2 + 0.01; x += spacing) {
    netPositions.push(x, 0, backZ, x, gh, backZ)
  }
  for (let y = 0; y <= gh + 0.01; y += spacing) {
    netPositions.push(-gw / 2, y, backZ, gw / 2, y, backZ)
  }
  for (let zz = z; side > 0 ? zz <= backZ : zz >= backZ; zz += side * spacing) {
    netPositions.push(-gw / 2, 0, zz, -gw / 2, gh, zz)
    netPositions.push(gw / 2, 0, zz, gw / 2, gh, zz)
  }
  const netGeo = new THREE.BufferGeometry()
  netGeo.setAttribute('position', new THREE.Float32BufferAttribute(netPositions, 3))
  const net = new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({
    color: team === 'blue' ? 0x9adfff : 0xffcfa2,
    transparent: true,
    opacity: 0.24
  }))
  group.add(net)

  const light = new THREE.PointLight(color, 170, 38, 2)
  light.position.set(0, 5.6, z + side * 1.5)
  group.add(light)

  const goalLine = new THREE.Mesh(
    new THREE.PlaneGeometry(gw, 0.24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
  )
  goalLine.rotation.x = -Math.PI / 2
  goalLine.position.set(0, 0.04, z - side * 0.5)
  group.add(goalLine)

  return { group, backPanel, light, color, team }
}

function createStands(scene, glowTexture) {
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x070d16,
    metalness: 0.5,
    roughness: 0.58
  })
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x143a56 })
  const crowdPositions = []
  const crowdColors = []
  const palette = [
    new THREE.Color(0x35b4ff),
    new THREE.Color(0xff8a1f),
    new THREE.Color(0xe8f7ff),
    new THREE.Color(0x7f93a8),
    new THREE.Color(0x9adfff),
    new THREE.Color(0xffcfa2)
  ]

  const addCrowd = (x, y, z, spreadX, spreadZ, count) => {
    for (let i = 0; i < count; i++) {
      crowdPositions.push(
        x + (Math.random() - 0.5) * spreadX,
        y + Math.random() * 0.6,
        z + (Math.random() - 0.5) * spreadZ
      )
      const c = palette[(Math.random() * palette.length) | 0]
      crowdColors.push(c.r, c.g, c.b)
    }
  }

  for (const side of [-1, 1]) {
    for (let tier = 0; tier < 5; tier++) {
      const x = side * (ARENA.halfWidth + 5.6 + tier * 4.3)
      const y = 1.1 + tier * 2.2
      const width = 4.5
      addBox(scene, [width, 1.5, 100], [x, y, 0], standMat)
      addBox(scene, [0.14, 0.14, 99], [x - side * (width / 2 - 0.1), y + 0.82, 0], edgeMat)
      addCrowd(x, y + 0.9, 0, 3.2, 98, 210)
    }
  }

  for (const side of [-1, 1]) {
    for (let tier = 0; tier < 4; tier++) {
      const z = side * (ARENA.halfLength + 6 + tier * 4.4)
      const y = 1.1 + tier * 2.2
      const depth = 4.5
      addBox(scene, [76, 1.5, depth], [0, y, z], standMat)
      addBox(scene, [75, 0.14, 0.14], [0, y + 0.82, z - side * (depth / 2 - 0.1)], edgeMat)
      addCrowd(0, y + 0.9, z, 74, 3.2, 170)
    }
  }

  const crowdGeo = new THREE.BufferGeometry()
  crowdGeo.setAttribute('position', new THREE.Float32BufferAttribute(crowdPositions, 3))
  crowdGeo.setAttribute('color', new THREE.Float32BufferAttribute(crowdColors, 3))
  const crowd = new THREE.Points(crowdGeo, new THREE.PointsMaterial({
    size: 0.72,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  }))
  scene.add(crowd)
  return crowd
}

function createLedBoards(scene) {
  const texture = makeAdTexture()
  const mat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  const boardH = 2.05
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const z = -36 + i * 18
      const board = new THREE.Mesh(new THREE.PlaneGeometry(16.8, boardH), mat)
      board.position.set(side * (ARENA.halfWidth + 2.4), 2.5, z)
      board.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(board)
    }
  }
  for (const side of [-1, 1]) {
    const board = new THREE.Mesh(new THREE.PlaneGeometry(44, boardH), mat)
    board.position.set(0, 2.5, side * (ARENA.halfLength + 3.3))
    board.rotation.y = side > 0 ? Math.PI : 0
    scene.add(board)
  }
}

function createLights(scene) {
  scene.add(new THREE.HemisphereLight(0x5a90c8, 0x1b130d, 0.72))

  const key = new THREE.DirectionalLight(0xd8efff, 2.5)
  key.position.set(26, 46, 18)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -68
  key.shadow.camera.right = 68
  key.shadow.camera.top = 74
  key.shadow.camera.bottom = -74
  key.shadow.camera.near = 2
  key.shadow.camera.far = 140
  key.shadow.bias = -0.0006
  key.shadow.normalBias = 0.035
  scene.add(key)

  const fill = new THREE.DirectionalLight(0x4c84c4, 0.8)
  fill.position.set(-30, 25, -24)
  scene.add(fill)

  const spots = [
    [-24, 23, -27, 0xbfe3ff],
    [24, 23, -27, 0xbfe3ff],
    [-24, 23, 27, 0xffe2c4],
    [24, 23, 27, 0xffe2c4]
  ]
  for (const [x, y, z, color] of spots) {
    const light = new THREE.PointLight(color, 260, 130, 2)
    light.position.set(x, y, z)
    scene.add(light)
  }
}

function createSky(scene) {
  const skyGeo = new THREE.SphereGeometry(260, 32, 20)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color(0x02050c) },
      mid: { value: new THREE.Color(0x071224) },
      bottom: { value: new THREE.Color(0x0b1c30) }
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = normalize(wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      varying vec3 vWorld;
      uniform vec3 top;
      uniform vec3 mid;
      uniform vec3 bottom;
      void main() {
        float h = clamp(vWorld.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 c = mix(bottom, mid, smoothstep(0.0, 0.52, h));
        c = mix(c, top, smoothstep(0.52, 1.0, h));
        float glow = pow(max(0.0, 1.0 - abs(vWorld.y - 0.08) * 4.2), 4.0);
        c += vec3(0.035, 0.09, 0.15) * glow;
        gl_FragColor = vec4(c, 1.0);
      }
    `
  })
  scene.add(new THREE.Mesh(skyGeo, skyMat))

  const starCount = 1300
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const color = new THREE.Color()
  for (let i = 0; i < starCount; i++) {
    const a = Math.random() * Math.PI * 2
    const h = Math.random() * 0.85 + 0.08
    const r = 225
    positions[i * 3] = Math.cos(a) * Math.sqrt(1 - h * h) * r
    positions[i * 3 + 1] = h * r
    positions[i * 3 + 2] = Math.sin(a) * Math.sqrt(1 - h * h) * r
    color.setHSL(0.56 + Math.random() * 0.08, 0.4, 0.55 + Math.random() * 0.4)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 1.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }))
  scene.add(stars)
  return stars
}

function createLightTowers(scene) {
  const truss = new THREE.MeshStandardMaterial({ color: 0x101d2c, metalness: 0.8, roughness: 0.4 })
  const lamp = new THREE.MeshBasicMaterial({ color: 0xe8f7ff, toneMapped: false })
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x8fd8ff,
    transparent: true,
    opacity: 0.035,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = sx * (ARENA.halfWidth + 24)
      const z = sz * (ARENA.halfLength + 15)
      addBox(scene, [1.4, 25, 1.4], [x, 12.5, z], truss)
      addBox(scene, [15, 1.1, 1.1], [x - sx * 5.5, 24.8, z], truss)
      for (let i = 0; i < 5; i++) {
        addBox(scene, [2.1, 1.4, 0.4], [x - sx * (1.5 + i * 2.8), 24.3, z - sz * 0.7], lamp)
      }
      const beam = new THREE.Mesh(new THREE.ConeGeometry(9, 23, 20, 1, true), beamMat)
      beam.position.set(x - sx * 3, 12.5, z)
      beam.rotation.z = sx * 0.22
      beam.rotation.x = -sz * 0.18
      scene.add(beam)
    }
  }
}

function createDust(scene) {
  const count = 420
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 70
    positions[i * 3 + 1] = 1 + Math.random() * 18
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    speeds[i] = 0.08 + Math.random() * 0.3
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dust = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.16,
    color: 0x8bd8ff,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }))
  scene.add(dust)
  return { dust, geo, speeds }
}

function createBoostPad(scene, x, z, big, glowTexture) {
  const group = new THREE.Group()
  group.position.set(x, 0.07, z)
  const radius = big ? 2.15 : 1.25
  const color = big ? 0xffb347 : 0x62e9ff
  const ringMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: big ? 2.3 : 1.5,
    metalness: 0.4,
    roughness: 0.3
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, big ? 0.16 : 0.1, 8, 44), ringMat)
  ring.rotation.x = -Math.PI / 2
  group.add(ring)

  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.64, 0.05, 6, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
  )
  inner.rotation.x = -Math.PI / 2
  group.add(inner)

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(big ? 0.47 : 0.3, 0),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 4,
      metalness: 0.3,
      roughness: 0.2
    })
  )
  core.position.y = 0.55
  group.add(core)

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color,
    transparent: true,
    opacity: big ? 0.5 : 0.38,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }))
  glow.scale.set(radius * 4.2, radius * 4.2, 1)
  glow.position.y = 0.2
  group.add(glow)

  scene.add(group)
  return {
    group,
    ring,
    inner,
    core,
    glow,
    x,
    z,
    amount: big ? 100 : 14,
    radius: big ? 3.1 : 2.0,
    big,
    active: true,
    respawn: 0,
    phase: Math.random() * Math.PI * 2
  }
}

function createJumbotron(scene, screen) {
  const group = new THREE.Group()
  group.position.set(0, 25.4, 16)
  group.scale.setScalar(0.9)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x08111c, metalness: 0.85, roughness: 0.32 })
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x17324a, emissive: 0x0f3550, emissiveIntensity: 1.2, metalness: 0.7, roughness: 0.3 })
  addBox(group, [17.4, 8.8, 2.3], [0, 0, 0], bodyMat)
  addBox(group, [18.2, 1, 2.7], [0, 4.7, 0], frameMat)
  addBox(group, [18.2, 1, 2.7], [0, -4.7, 0], frameMat)

  const screenMat = new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false })
  const front = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), screenMat)
  front.position.set(0, 0, 1.18)
  group.add(front)
  const back = front.clone()
  back.position.z = -1.18
  back.rotation.y = Math.PI
  group.add(back)

  const cableMat = new THREE.LineBasicMaterial({ color: 0x24445c, transparent: true, opacity: 0.5 })
  const cablePoints = []
  for (const [x, z] of [[-7, -36], [7, -36], [-7, 36], [7, 36]]) {
    cablePoints.push(0, 28.1, 0, x, 12.8, z)
  }
  const cableGeo = new THREE.BufferGeometry()
  cableGeo.setAttribute('position', new THREE.Float32BufferAttribute(cablePoints, 3))
  group.add(new THREE.LineSegments(cableGeo, cableMat))

  scene.add(group)
  return group
}

export function createWorld(scene, renderer) {
  scene.fog = new THREE.FogExp2(0x04080f, 0.0062)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new RoomEnvironment()
  const env = pmrem.fromScene(envScene, 0.03)
  scene.environment = env.texture
  scene.environmentIntensity = 0.46
  pmrem.dispose()

  const glowTexture = makeGlowTexture()
  const sparkTexture = makeSparkTexture()
  createSky(scene)
  createLights(scene)

  const hw = ARENA.halfWidth
  const hl = ARENA.halfLength
  const r = ARENA.cornerRadius

  const fieldShape = roundedRectShape(hw, hl, r)
  const fieldGeo = new THREE.ShapeGeometry(fieldShape, 30)
  fieldGeo.rotateX(-Math.PI / 2)
  const pos = fieldGeo.attributes.position
  const uv = fieldGeo.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + hw) / (hw * 2), (pos.getZ(i) + hl) / (hl * 2))
  }
  uv.needsUpdate = true
  const fieldMat = new THREE.MeshStandardMaterial({
    map: makeFieldTexture(),
    roughness: 0.58,
    metalness: 0.12,
    envMapIntensity: 0.4
  })
  const floor = new THREE.Mesh(fieldGeo, fieldMat)
  floor.receiveShadow = true
  scene.add(floor)

  const outerFloor = new THREE.Mesh(
    new THREE.CircleGeometry(220, 64),
    new THREE.MeshStandardMaterial({ color: 0x03060a, roughness: 0.92, metalness: 0.1 })
  )
  outerFloor.rotation.x = -Math.PI / 2
  outerFloor.position.y = -0.18
  outerFloor.receiveShadow = true
  scene.add(outerFloor)

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 1.2, 0.5, hl * 2 + 1.2),
    new THREE.MeshStandardMaterial({ color: 0x050a12, metalness: 0.4, roughness: 0.7 })
  )
  slab.position.y = -0.27
  scene.add(slab)

  const points = perimeterPoints(hw, hl, r)

  const glassGeo = buildWallGeometry(points, 1.15, ARENA.wallHeight)
  const glass = new THREE.Mesh(glassGeo, new THREE.MeshPhysicalMaterial({
    color: 0x6bb8e6,
    metalness: 0.55,
    roughness: 0.12,
    transparent: true,
    opacity: 0.145,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 1.4
  }))
  scene.add(glass)

  const solidGeo = buildWallGeometry(points, 0, 1.15)
  const solid = new THREE.Mesh(solidGeo, new THREE.MeshStandardMaterial({
    color: 0x06101d,
    metalness: 0.75,
    roughness: 0.35,
    emissive: 0x061c2c,
    emissiveIntensity: 0.9,
    side: THREE.DoubleSide
  }))
  scene.add(solid)

  const glowGeo = buildWallGeometry(points, 0.94, 1.3)
  const wallGlow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  }))
  scene.add(wallGlow)

  const topRail = new THREE.LineSegments(
    buildWallLines(points, ARENA.wallHeight),
    new THREE.LineBasicMaterial({ color: 0x6fe1ff, transparent: true, opacity: 0.5 })
  )
  scene.add(topRail)
  const midRail = new THREE.LineSegments(
    buildWallLines(points, 4.6),
    new THREE.LineBasicMaterial({ color: 0x2c7fa4, transparent: true, opacity: 0.24 })
  )
  scene.add(midRail)

  const ribPositions = []
  for (let i = 0; i < points.length; i += 4) {
    const p = points[i]
    ribPositions.push(p.x, 1.15, p.y, p.x, ARENA.wallHeight, p.y)
  }
  const ribGeo = new THREE.BufferGeometry()
  ribGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribPositions, 3))
  scene.add(new THREE.LineSegments(ribGeo, new THREE.LineBasicMaterial({
    color: 0x2b7195,
    transparent: true,
    opacity: 0.2
  })))

  const goals = {
    blue: createGoal(scene, -1, glowTexture),
    orange: createGoal(scene, 1, glowTexture)
  }

  createStands(scene, glowTexture)
  createLedBoards(scene)
  createLightTowers(scene)
  const dust = createDust(scene)

  const pads = []
  const bigPads = [
    [-22, -33], [22, -33], [-22, 33], [22, 33], [-27, 0], [27, 0]
  ]
  for (const [x, z] of bigPads) pads.push(createBoostPad(scene, x, z, true, glowTexture))
  const smallPads = [
    [0, -18], [0, 18], [-12, -22], [12, -22], [-12, 22], [12, 22],
    [-18, -8], [18, -8], [-18, 8], [18, 8], [-8, 0], [8, 0],
    [-16, -36], [16, -36], [-16, 36], [16, 36]
  ]
  for (const [x, z] of smallPads) pads.push(createBoostPad(scene, x, z, false, glowTexture))

  const screen = makeScreenTexture()
  createJumbotron(scene, screen)

  const flash = { blue: 0, orange: 0 }
  let elapsed = 0

  function animate(dt) {
    elapsed += dt
    const t = elapsed
    for (const pad of pads) {
      if (!pad.active) continue
      pad.group.position.y = 0.07 + Math.sin(t * 2.1 + pad.phase) * 0.07
      pad.ring.rotation.z = t * (pad.big ? 0.55 : 0.85) + pad.phase
      pad.inner.rotation.z = -t * 1.1 + pad.phase
      pad.core.rotation.y = t * 1.4 + pad.phase
      pad.core.rotation.x = Math.sin(t * 0.8 + pad.phase) * 0.4
      const pulse = 1 + Math.sin(t * 2.4 + pad.phase) * 0.055
      pad.glow.scale.setScalar((pad.big ? 9 : 5.2) * pulse)
    }

    const pos = dust.geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + dust.speeds[i] * dt
      if (y > 21) y = 1
      pos.setY(i, y)
    }
    pos.needsUpdate = true

    flash.blue = Math.max(0, flash.blue - dt * 1.7)
    flash.orange = Math.max(0, flash.orange - dt * 1.7)
    goals.blue.light.intensity = 170 + flash.blue * 900
    goals.orange.light.intensity = 170 + flash.orange * 900
    goals.blue.backPanel.material.opacity = 0.12 + flash.blue * 0.55
    goals.orange.backPanel.material.opacity = 0.12 + flash.orange * 0.55
  }

  function pulseGoal(team) {
    flash[team] = 1
  }

  function updateScreen(state) {
    screen.draw(state)
  }

  function resetPads() {
    for (const pad of pads) {
      pad.active = true
      pad.respawn = 0
      pad.group.visible = true
    }
  }

  return {
    floor,
    goals,
    pads,
    sparkTexture,
    glowTexture,
    screen,
    animate,
    pulseGoal,
    updateScreen,
    resetPads
  }
}
