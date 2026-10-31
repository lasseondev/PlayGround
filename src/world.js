import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export const CITY = {
  blocks: 9,
  spacing: 76,
  block: 58,
  road: 18,
  extent: 342,
  half: 351,
  blockCenters: Array.from({ length: 9 }, (_, i) => -304 + i * 76),
  roadCenters: Array.from({ length: 10 }, (_, i) => -342 + i * 76),
}

const UNIT = 8
const tmpColor = new THREE.Color()

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canvas2d(size) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  return [canvas, canvas.getContext('2d')]
}

function makeTexture(canvas, { repeat = null, srgb = true } = {}) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  if (repeat) tex.repeat.set(repeat[0], repeat[1])
  return tex
}

function noiseTexture(base, spread, speckles, size = 256, seed = 3) {
  const [canvas, ctx] = canvas2d(size)
  const rng = mulberry32(seed)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < speckles; i++) {
    const v = Math.floor((rng() - 0.5) * spread)
    ctx.fillStyle = `rgba(${128 + v},${128 + v},${128 + v},${0.05 + rng() * 0.18})`
    const s = 0.6 + rng() * 2.6
    ctx.fillRect(rng() * size, rng() * size, s, s)
  }
  return canvas
}

function windowTextures() {
  const S = 512
  const T = 64
  const [mapCanvas, map] = canvas2d(S)
  const [emCanvas, em] = canvas2d(S)
  const rng = mulberry32(19)
  map.fillStyle = '#969ba4'
  map.fillRect(0, 0, S, S)
  em.fillStyle = '#000'
  em.fillRect(0, 0, S, S)
  for (let y = 0; y < S; y += T) {
    map.fillStyle = 'rgba(45,49,58,.28)'
    map.fillRect(0, y, S, 4)
    for (let x = 0; x < S; x += T) {
      const shade = 142 + Math.floor(rng() * 24)
      map.fillStyle = `rgb(${shade},${shade + 4},${shade + 11})`
      map.fillRect(x + 3, y + 5, T - 6, T - 9)
      map.fillStyle = `rgb(${32 + Math.floor(rng() * 14)},${40 + Math.floor(rng() * 14)},${53 + Math.floor(rng() * 18)})`
      map.fillRect(x + 10, y + 12, T - 20, T - 27)
      map.fillStyle = 'rgba(190,220,255,.16)'
      map.fillRect(x + 12, y + 14, T - 24, 7)
      map.fillStyle = 'rgba(8,11,17,.5)'
      map.fillRect(x + T / 2 - 1, y + 12, 2, T - 27)
      if (rng() < 0.24) {
        em.fillStyle = rng() < 0.72 ? '#ffb265' : '#8ed8ff'
        em.globalAlpha = 0.45 + rng() * 0.4
        em.fillRect(x + 10, y + 12, T - 20, T - 27)
        em.globalAlpha = 1
      }
    }
  }
  return { map: makeTexture(mapCanvas), emissive: makeTexture(emCanvas) }
}

function concreteTexture() {
  const S = 256
  const [canvas, ctx] = canvas2d(S)
  const rng = mulberry32(2)
  ctx.fillStyle = '#8e949d'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 3200; i++) {
    const v = 100 + Math.floor(rng() * 70)
    ctx.fillStyle = `rgba(${v},${v},${v},${0.05 + rng() * 0.12})`
    ctx.fillRect(rng() * S, rng() * S, 1 + rng() * 2, 1 + rng() * 2)
  }
  ctx.strokeStyle = 'rgba(54,58,66,.35)'
  ctx.lineWidth = 2
  for (let i = 0; i <= S; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke()
  }
  return makeTexture(canvas, { repeat: [5, 5] })
}

function grassTexture() {
  const [canvas, ctx] = canvas2d(256)
  const rng = mulberry32(11)
  ctx.fillStyle = '#2c5238'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 7000; i++) {
    const g = 55 + Math.floor(rng() * 55)
    ctx.fillStyle = `rgba(${28 + rng() * 20},${g},${40 + rng() * 20},${0.25 + rng() * 0.4})`
    ctx.fillRect(rng() * 256, rng() * 256, 1, 1 + rng() * 2)
  }
  return makeTexture(canvas, { repeat: [7, 7] })
}

function scaleBoxUV(geo, w, h, d) {
  const uv = geo.attributes.uv
  const normal = geo.attributes.normal
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(normal.getX(i))
    const ny = Math.abs(normal.getY(i))
    let su, sv
    if (ny > 0.5) { su = w / UNIT; sv = d / UNIT }
    else if (nx > 0.5) { su = d / UNIT; sv = h / UNIT }
    else { su = w / UNIT; sv = h / UNIT }
    uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
  }
}

function paintGeometry(geo, color) {
  const count = geo.attributes.position.count
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
}

function addBox(list, w, h, d, x, y, z, color = null) {
  const geo = new THREE.BoxGeometry(w, h, d)
  if (color) paintGeometry(geo, color)
  geo.translate(x, y, z)
  list.push(geo)
}

const SIGN_TEXTS = [
  ['NEON RIDER', '#31e6ff', 'SUNSET CITY'],
  ['24/7', '#ff3ba7', 'OPEN ALL NIGHT'],
  ['TURBO', '#ffb020', 'MOTOR CO.'],
  ['OMG FM', '#b06bff', '98.3 MHz'],
  ['MOTEL', '#ff5470', 'VACANCY'],
  ['PIZZA', '#ffcf4d', 'SLICE THE NIGHT'],
  ['VICE', '#ff3ba7', 'BEACH CLUB'],
  ['SUNSET', '#31e6ff', 'BLVD 09'],
  ['HANZO', '#8dffb5', 'NOODLE BAR'],
  ['NEON', '#ff7a45', 'ARCADE'],
  ['CHROME', '#7ddcff', 'CYCLE WORKS'],
  ['NIGHT', '#ff4d9d', 'SHIFT'],
]

function signCanvas(label, main, sub) {
  const W = 1024
  const H = 384
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)
  ctx.shadowColor = main
  ctx.shadowBlur = 34
  ctx.strokeStyle = main
  ctx.lineWidth = 9
  ctx.strokeRect(26, 26, W - 52, H - 52)
  ctx.globalAlpha = 0.75
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.globalAlpha = 1
  ctx.font = '700 40px "Trebuchet MS", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(sub.toUpperCase(), 64, 100)
  ctx.fillStyle = main
  ctx.shadowBlur = 46
  let size = 150
  ctx.font = `italic 900 ${size}px "Arial Black", Impact, sans-serif`
  while (ctx.measureText(label).width > W - 130 && size > 54) {
    size -= 6
    ctx.font = `italic 900 ${size}px "Arial Black", Impact, sans-serif`
  }
  ctx.fillText(label, 62, 224)
  ctx.shadowBlur = 18
  ctx.fillStyle = main
  ctx.fillRect(62, 306, 300, 5)
  ctx.fillStyle = '#ffe9b8'
  ctx.beginPath()
  ctx.arc(946, 88, 12, 0, Math.PI * 2)
  ctx.fill()
  return makeTexture(canvas)
}

export function makeGlowTexture() {
  const [canvas, ctx] = canvas2d(128)
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,.7)')
  grad.addColorStop(0.55, 'rgba(255,255,255,.18)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const PARK_BLOCKS = new Set(['2,6', '6,2', '4,7', '7,4', '1,1', '7,7', '1,6', '6,1'])
const PALETTE = ['#b9c1cc', '#a5aebc', '#cfc4b4', '#98a4b4', '#c4b4a4', '#8b97a9', '#d4cfc5']
const NEON_COLORS = ['#31e6ff', '#ff3ba7', '#ffb020', '#8dffb5', '#b06bff', '#ff7a45']

const PRESETS = {
  dusk: {
    top: '#1b2a55', bottom: '#ff9a6c', fog: '#e8a17f', fogNear: 110, fogFar: 720,
    sun: '#ffc08a', sunIntensity: 4.2, hemiSky: '#b8c4ef', hemiGround: '#6b4a42',
    hemiIntensity: 1.6, emissive: 0.72, lamp: 0.85, stars: 0.1, exposure: 1.3,
    sunDir: [0.45, 0.24, -0.6], sunGlow: 1.25,
  },
  night: {
    top: '#03050e', bottom: '#141d35', fog: '#0b1220', fogNear: 70, fogFar: 540,
    sun: '#9db8ff', sunIntensity: 0.7, hemiSky: '#2e4570', hemiGround: '#0b0d12',
    hemiIntensity: 0.55, emissive: 2.8, lamp: 1.0, stars: 1, exposure: 1.32,
    sunDir: [0.5, 0.55, -0.35], sunGlow: 0.4,
  },
  day: {
    top: '#2c6fd1', bottom: '#cfe4f7', fog: '#c6d9e8', fogNear: 140, fogFar: 850,
    sun: '#fff1cf', sunIntensity: 3.6, hemiSky: '#cfe3ff', hemiGround: '#8a745c',
    hemiIntensity: 1.95, emissive: 0.06, lamp: 0, stars: 0, exposure: 1.12,
    sunDir: [0.35, 0.78, -0.4], sunGlow: 1,
  },
}

export function createWorld(scene, renderer) {
  const rng = mulberry32(8848)
  const buildings = []
  const mapBlocks = []
  const wallGeos = []
  const roofGeos = []
  const slabGeos = []
  const plinthGeos = []
  const grassGeos = []
  const pathGeos = []
  const markingGeos = []
  const neonGeos = []
  const boundaryGeos = []
  const boundaryNeon = []
  const signs = []
  const palmSpots = []
  const treeSpots = []
  const lampSpots = []
  let wallMesh = null

  scene.fog = new THREE.Fog(0xd98468, 90, 640)

  const asphalt = makeTexture(noiseTexture('#464b55', 26, 14000, 256, 5), { repeat: [120, 120] })
  const concrete = concreteTexture()
  const grass = grassTexture()
  const win = windowTextures()

  const groundMat = new THREE.MeshStandardMaterial({ map: asphalt, roughness: 0.97, metalness: 0.02 })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1700, 1700), groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const skyUniforms = {
    topColor: { value: new THREE.Color(PRESETS.dusk.top) },
    bottomColor: { value: new THREE.Color(PRESETS.dusk.bottom) },
    sunColor: { value: new THREE.Color(PRESETS.dusk.sun) },
    sunDir: { value: new THREE.Vector3(...PRESETS.dusk.sunDir).normalize() },
    glow: { value: PRESETS.dusk.sunGlow },
  }
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: skyUniforms,
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform vec3 sunColor;
      uniform vec3 sunDir;
      uniform float glow;
      varying vec3 vDir;
      void main() {
        vec3 dir = normalize(vDir);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 col = mix(bottomColor, topColor, pow(h, 0.42));
        float sun = pow(max(dot(dir, sunDir), 0.0), 900.0);
        float halo = pow(max(dot(dir, sunDir), 0.0), 10.0);
        float low = pow(1.0 - h, 7.0);
        col += sunColor * (sun * 4.0 + halo * 0.55) * glow;
        col += sunColor * low * 0.12 * glow;
        col = mix(col, bottomColor, 0.12 * (1.0 - h));
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1600, 40, 24), skyMat)
  sky.frustumCulled = false
  scene.add(sky)

  const starGeo = new THREE.BufferGeometry()
  const starPos = new Float32Array(820 * 3)
  for (let i = 0; i < 820; i++) {
    const a = rng() * Math.PI * 2
    const y = 0.06 + rng() * 0.94
    const r = Math.sqrt(1 - y * y)
    starPos[i * 3] = Math.cos(a) * r * 1450
    starPos[i * 3 + 1] = y * 1450
    starPos[i * 3 + 2] = Math.sin(a) * r * 1450
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0xcfe2ff, size: 2.2, sizeAttenuation: false, transparent: true,
    opacity: 0, depthWrite: false, fog: false,
  })
  const stars = new THREE.Points(starGeo, starMat)
  stars.frustumCulled = false
  scene.add(stars)

  const hemi = new THREE.HemisphereLight(0x7c8fd0, 0x523636, 0.95)
  scene.add(hemi)
  const ambient = new THREE.AmbientLight(0x9aa8c8, 0.38)
  scene.add(ambient)
  const sun = new THREE.DirectionalLight(0xffb173, 3)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -115
  sun.shadow.camera.right = 115
  sun.shadow.camera.top = 115
  sun.shadow.camera.bottom = -115
  sun.shadow.camera.near = 20
  sun.shadow.camera.far = 520
  sun.shadow.bias = -0.0003
  sun.shadow.normalBias = 0.06
  scene.add(sun)
  scene.add(sun.target)
  const fill = new THREE.DirectionalLight(0x8fb6ff, 0.55)
  fill.position.set(-80, 60, 120)
  scene.add(fill)

  for (let bi = 0; bi < CITY.blocks; bi++) {
    for (let bj = 0; bj < CITY.blocks; bj++) {
      const cx = CITY.blockCenters[bi]
      const cz = CITY.blockCenters[bj]
      const dist = Math.hypot(cx, cz)
      const isPark = PARK_BLOCKS.has(`${bi},${bj}`)

      addBox(plinthGeos, 59.6, 0.24, 59.6, cx, 0.12, cz)
      addBox(slabGeos, 58, 0.14, 58, cx, 0.31, cz)
      const corners = rng() < 0.5 ? [[-1, -1], [1, 1]] : [[1, -1], [-1, 1]]
      for (const [sx, sz] of corners) lampSpots.push({ x: cx + sx * 26.3, z: cz + sz * 26.3 })
      mapBlocks.push({ x: cx, z: cz, park: isPark })

      if (isPark) {
        addBox(grassGeos, 55, 0.08, 55, cx, 0.42, cz)
        addBox(pathGeos, 3.8, 0.035, 55, cx, 0.465, cz)
        addBox(pathGeos, 55, 0.035, 3.8, cx, 0.465, cz)
        const treeCount = 3 + Math.floor(rng() * 4)
        for (let i = 0; i < treeCount; i++) {
          treeSpots.push({
            x: cx + (rng() - 0.5) * 44,
            z: cz + (rng() - 0.5) * 44,
            s: 0.75 + rng() * 0.55,
          })
        }
        const palmCount = 2 + Math.floor(rng() * 3)
        for (let i = 0; i < palmCount; i++) {
          palmSpots.push({
            x: cx + (rng() - 0.5) * 46,
            z: cz + (rng() - 0.5) * 46,
            s: 0.9 + rng() * 0.4,
          })
        }
        continue
      }

      const roll = rng()
      let lots
      if (roll < 0.46) {
        lots = [{ ox: 0, oz: 0, w: 35 + rng() * 13, d: 35 + rng() * 13 }]
      } else if (roll < 0.83) {
        if (rng() < 0.5) {
          const lw = 21 + rng() * 3
          const ld = 33 + rng() * 15
          lots = [
            { ox: -13.5, oz: 0, w: lw, d: ld },
            { ox: 13.5, oz: 0, w: lw, d: ld },
          ]
        } else {
          const lw = 21 + rng() * 3
          const ld = 33 + rng() * 15
          lots = [
            { ox: 0, oz: -13.5, w: ld, d: lw },
            { ox: 0, oz: 13.5, w: ld, d: lw },
          ]
        }
      } else {
        lots = []
        for (const ox of [-13.5, 13.5]) {
          for (const oz of [-13.5, 13.5]) {
            lots.push({ ox, oz, w: 21 + rng() * 2.6, d: 21 + rng() * 2.6 })
          }
        }
      }

      for (const lot of lots) {
        const w = lot.w
        const d = lot.d
        const bx = cx + lot.ox + (rng() - 0.5) * 1.5
        const bz = cz + lot.oz + (rng() - 0.5) * 1.5
        const central = Math.exp(-(dist * dist) / (2 * 135 * 135))
        let h = (10 + 104 * central) * (0.58 + rng() * 0.9)
        if (dist < 95) h = Math.max(h, 58 + rng() * 76)
        if (rng() < 0.055) h *= 1.3
        h = Math.min(142, Math.max(8.5, h))

        const geo = new THREE.BoxGeometry(w, h, d)
        scaleBoxUV(geo, w, h, d)
        const tint = new THREE.Color(PALETTE[Math.floor(rng() * PALETTE.length)])
        tint.offsetHSL((rng() - 0.5) * 0.03, 0, (rng() - 0.5) * 0.08)
        paintGeometry(geo, tint)
        geo.translate(bx, 0.38 + h / 2, bz)
        wallGeos.push(geo)
        buildings.push({
          minX: bx - w / 2 - 0.25,
          maxX: bx + w / 2 + 0.25,
          minZ: bz - d / 2 - 0.25,
          maxZ: bz + d / 2 + 0.25,
          height: h,
        })

        addBox(roofGeos, w + 0.6, 0.7, d + 0.6, bx, 0.38 + h + 0.35, bz)
        if (rng() < 0.72) {
          const acH = 0.8 + rng() * 1.6
          addBox(
            roofGeos, w * (0.16 + rng() * 0.12), acH, d * (0.16 + rng() * 0.12),
            bx + (rng() - 0.5) * w * 0.45, 0.38 + h + 0.7 + acH / 2,
            bz + (rng() - 0.5) * d * 0.45,
          )
        }
        if (h > 68) {
          const antH = 6 + rng() * 13
          const ax = bx + (rng() - 0.5) * w * 0.4
          const az = bz + (rng() - 0.5) * d * 0.4
          const antGeo = new THREE.CylinderGeometry(0.07, 0.13, antH, 5)
          antGeo.translate(ax, 0.38 + h + 0.7 + antH / 2, az)
          roofGeos.push(antGeo)
          const beacon = new THREE.SphereGeometry(0.23, 6, 5)
          beacon.translate(ax, 0.38 + h + 0.7 + antH, az)
          paintGeometry(beacon, new THREE.Color('#ff3344'))
          neonGeos.push(beacon)
        }

        if (rng() < 0.5) {
          const side = Math.floor(rng() * 4)
          const faceW = side < 2 ? w : d
          const len = faceW * (0.45 + rng() * 0.3)
          const col = new THREE.Color(NEON_COLORS[Math.floor(rng() * NEON_COLORS.length)])
          const strip = side < 2
            ? new THREE.BoxGeometry(len, 0.16, 0.18)
            : new THREE.BoxGeometry(0.18, 0.16, len)
          const along = (rng() - 0.5) * (faceW - len) * 0.7
          const off = 0.15
          if (side === 0) strip.translate(bx + along, 0.38 + 3.4, bz + d / 2 + off)
          else if (side === 1) strip.translate(bx + along, 0.38 + 3.4, bz - d / 2 - off)
          else if (side === 2) strip.translate(bx + w / 2 + off, 0.38 + 3.4, bz + along)
          else strip.translate(bx - w / 2 - off, 0.38 + 3.4, bz + along)
          paintGeometry(strip, col)
          neonGeos.push(strip)
        }

        if (signs.length < 24 && h > 20 && rng() < 0.19) {
          const side = Math.floor(rng() * 4)
          let sx = bx
          let sz = bz
          let rotY = 0
          const faceW = side < 2 ? w : d
          if (side === 0) { sz = bz + d / 2 + 0.1; rotY = 0 }
          else if (side === 1) { sz = bz - d / 2 - 0.1; rotY = Math.PI }
          else if (side === 2) { sx = bx + w / 2 + 0.1; rotY = Math.PI / 2 }
          else { sx = bx - w / 2 - 0.1; rotY = -Math.PI / 2 }
          const sw = Math.min(12, Math.max(6.6, faceW * 0.4))
          const sh = sw / 2.5
          const along = (rng() - 0.5) * Math.max(0, faceW - sw) * 0.75
          if (side < 2) sx += along
          else sz += along
          const y = 0.38 + 7 + rng() * Math.max(2, Math.min(15, h - 13))
          signs.push({ x: sx, y, z: sz, rotY, w: sw, h: sh, rng: rng() })
        }

        if (rng() < 0.78) {
          const edge = Math.floor(rng() * 4)
          const off = (rng() - 0.5) * 30
          const margin = 26.4
          const px = cx + (edge < 2 ? off : (edge === 2 ? margin : -margin))
          const pz = cz + (edge < 2 ? (edge === 0 ? margin : -margin) : off)
          palmSpots.push({ x: px, z: pz, s: 0.85 + rng() * 0.35 })
        }
      }
    }
  }

  let nearSigns = signs.filter((s) => Math.hypot(s.x - 38, s.z - 190) < 160).length
  if (nearSigns < 3) {
    const candidates = buildings.filter((b) => {
      const roadFacingNegX = b.minX > 38 && b.minX < 60
      const roadFacingPosX = b.maxX < 38 && b.maxX > 15
      return (roadFacingNegX || roadFacingPosX) && b.minZ < 270 && b.maxZ > 120
    })
    for (let i = 0; i < Math.min(3, candidates.length); i++) {
      const b = candidates[i]
      const negX = b.minX > 38
      const faceW = b.maxZ - b.minZ
      const sw = Math.min(11.5, Math.max(7, faceW * 0.36))
      signs.push({
        x: negX ? b.minX - 0.1 : b.maxX + 0.1,
        y: 9 + rng() * 9,
        z: (b.minZ + b.maxZ) / 2 + (rng() - 0.5) * 4,
        rotY: negX ? -Math.PI / 2 : Math.PI / 2,
        w: sw, h: sw / 2.5, fixed: i,
      })
    }
  }

  const wallMat = new THREE.MeshStandardMaterial({
    map: win.map,
    emissiveMap: win.emissive,
    emissive: new THREE.Color(0xffb477),
    emissiveIntensity: 1.15,
    vertexColors: true,
    roughness: 0.8,
    metalness: 0.06,
  })
  wallMesh = new THREE.Mesh(mergeGeometries(wallGeos, false), wallMat)
  wallMesh.castShadow = true
  wallMesh.receiveShadow = true
  scene.add(wallMesh)

  const roofMat = new THREE.MeshStandardMaterial({ color: 0x2b3039, roughness: 0.94, metalness: 0.08 })
  const roofs = new THREE.Mesh(mergeGeometries(roofGeos, false), roofMat)
  roofs.castShadow = true
  roofs.receiveShadow = true
  scene.add(roofs)

  const plinthMat = new THREE.MeshStandardMaterial({ map: concrete, color: 0x7a7f88, roughness: 0.95 })
  const plinths = new THREE.Mesh(mergeGeometries(plinthGeos, false), plinthMat)
  plinths.receiveShadow = true
  scene.add(plinths)

  const slabMat = new THREE.MeshStandardMaterial({ map: concrete, color: 0xb8bcc2, roughness: 0.92 })
  const slabs = new THREE.Mesh(mergeGeometries(slabGeos, false), slabMat)
  slabs.receiveShadow = true
  scene.add(slabs)

  const grassMat = new THREE.MeshStandardMaterial({ map: grass, roughness: 1 })
  if (grassGeos.length) {
    const parkMesh = new THREE.Mesh(mergeGeometries(grassGeos, false), grassMat)
    parkMesh.receiveShadow = true
    scene.add(parkMesh)
  }
  if (pathGeos.length) {
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xb3a98f, roughness: 1 })
    const paths = new THREE.Mesh(mergeGeometries(pathGeos, false), pathMat)
    paths.receiveShadow = true
    scene.add(paths)
  }

  const neonMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })
  if (neonGeos.length) {
    const neonMesh = new THREE.Mesh(mergeGeometries(neonGeos, false), neonMat)
    scene.add(neonMesh)
  }

  const addMark = (w, d, x, z) => {
    const g = new THREE.PlaneGeometry(w, d)
    g.rotateX(-Math.PI / 2)
    g.translate(x, 0.035, z)
    markingGeos.push(g)
  }
  const nearIntersection = (v) => CITY.roadCenters.some((c) => Math.abs(v - c) < 11.5)
  for (const c of CITY.roadCenters) {
    for (let x = -336; x <= 336; x += 10) {
      if (!nearIntersection(x)) addMark(4.6, 0.24, x, c)
    }
    for (let i = 0; i < CITY.roadCenters.length - 1; i++) {
      const a = CITY.roadCenters[i] + 11.5
      const b = CITY.roadCenters[i + 1] - 11.5
      addMark(b - a, 0.18, (a + b) / 2, c - CITY.road / 2 + 1.1)
      addMark(b - a, 0.18, (a + b) / 2, c + CITY.road / 2 - 1.1)
    }
    for (const xi of CITY.roadCenters) {
      for (const side of [-1, 1]) {
        const xw = xi + side * 10.4
        for (let k = -6; k <= 6; k++) addMark(3.6, 0.5, xw, c + k * 1.42)
        const zw = xi + side * 10.4
        for (let k = -6; k <= 6; k++) addMark(0.5, 3.6, c + k * 1.42, zw)
      }
    }
  }
  const markingMat = new THREE.MeshStandardMaterial({ color: 0xd8d2bd, roughness: 0.85, metalness: 0 })
  const markings = new THREE.Mesh(mergeGeometries(markingGeos, false), markingMat)
  markings.receiveShadow = true
  scene.add(markings)

  /* ---------- palms ---------- */
  const dummy = new THREE.Object3D()
  const palmTrunkGeo = new THREE.CylinderGeometry(0.16, 0.3, 5.6, 6)
  palmTrunkGeo.translate(0, 2.8, 0)
  const frondGeos = []
  for (let i = 0; i < 7; i++) {
    const f = new THREE.ConeGeometry(0.55, 3.1, 3, 1, true)
    f.rotateZ(Math.PI / 2)
    f.translate(1.5, 0, 0)
    f.scale(1, 0.55, 1)
    f.rotateY((i / 7) * Math.PI * 2)
    frondGeos.push(f)
  }
  const crownGeo = mergeGeometries(frondGeos, false)
  crownGeo.translate(0, 5.55, 0)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b4632, roughness: 0.96 })
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x2f6b4c, roughness: 0.9, flatShading: true })
  if (palmSpots.length) {
    const trunks = new THREE.InstancedMesh(palmTrunkGeo, trunkMat, palmSpots.length)
    const crowns = new THREE.InstancedMesh(crownGeo, crownMat, palmSpots.length)
    palmSpots.forEach((p, i) => {
      dummy.position.set(p.x, 0.38, p.z)
      dummy.rotation.set(0, rng() * Math.PI * 2, (rng() - 0.5) * 0.06)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      trunks.setMatrixAt(i, dummy.matrix)
      dummy.rotation.set(0, rng() * Math.PI * 2, 0)
      dummy.updateMatrix()
      crowns.setMatrixAt(i, dummy.matrix)
    })
    trunks.castShadow = true
    crowns.castShadow = true
    trunks.frustumCulled = false
    crowns.frustumCulled = false
    scene.add(trunks, crowns)
  }

  /* ---------- park trees ---------- */
  const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.34, 4.4, 6)
  treeTrunkGeo.translate(0, 2.2, 0)
  const canopyGeo = new THREE.IcosahedronGeometry(2.5, 0)
  canopyGeo.scale(1, 0.82, 1)
  canopyGeo.translate(0, 4.9, 0)
  if (treeSpots.length) {
    const trunks = new THREE.InstancedMesh(treeTrunkGeo, trunkMat, treeSpots.length)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true })
    const canopy = new THREE.InstancedMesh(canopyGeo, canopyMat, treeSpots.length)
    const green = new THREE.Color()
    treeSpots.forEach((p, i) => {
      dummy.position.set(p.x, 0.38, p.z)
      dummy.rotation.set(0, rng() * Math.PI * 2, 0)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      trunks.setMatrixAt(i, dummy.matrix)
      canopy.setMatrixAt(i, dummy.matrix)
      green.setHSL(0.3 + rng() * 0.07, 0.36, 0.2 + rng() * 0.12)
      canopy.setColorAt(i, green)
    })
    trunks.castShadow = true
    canopy.castShadow = true
    trunks.frustumCulled = false
    canopy.frustumCulled = false
    scene.add(trunks, canopy)
  }

  /* ---------- street lamps ---------- */
  const poleGeo = new THREE.CylinderGeometry(0.075, 0.13, 6.2, 6)
  poleGeo.translate(0, 3.1, 0)
  const lampHeadGeo = new THREE.BoxGeometry(0.58, 0.16, 0.34)
  lampHeadGeo.translate(0, 6.25, 0)
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x252b34, roughness: 0.6, metalness: 0.6 })
  const lampHeadMat = new THREE.MeshStandardMaterial({
    color: 0xffe6bd, emissive: new THREE.Color(0xffc27a), emissiveIntensity: 3.2, roughness: 0.35,
  })
  let lampGlowMat = null
  if (lampSpots.length) {
    const poles = new THREE.InstancedMesh(poleGeo, poleMat, lampSpots.length)
    const heads = new THREE.InstancedMesh(lampHeadGeo, lampHeadMat, lampSpots.length)
    const glowPos = new Float32Array(lampSpots.length * 3)
    lampSpots.forEach((p, i) => {
      dummy.position.set(p.x, 0.38, p.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      poles.setMatrixAt(i, dummy.matrix)
      heads.setMatrixAt(i, dummy.matrix)
      glowPos[i * 3] = p.x
      glowPos[i * 3 + 1] = 6.6
      glowPos[i * 3 + 2] = p.z
    })
    poles.castShadow = true
    poles.frustumCulled = false
    heads.frustumCulled = false
    scene.add(poles, heads)
    const glowGeo = new THREE.BufferGeometry()
    glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
    lampGlowMat = new THREE.PointsMaterial({
      map: makeGlowTexture(), color: 0xffc98a, size: 3.2, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    })
    const lampGlow = new THREE.Points(glowGeo, lampGlowMat)
    lampGlow.frustumCulled = false
    scene.add(lampGlow)
  }

  /* ---------- neon signs ---------- */
  const signMats = []
  for (const s of signs) {
    const idx = s.fixed !== undefined ? s.fixed % SIGN_TEXTS.length : Math.floor(s.rng * SIGN_TEXTS.length)
    if (!signMats[idx]) {
      const [label, main, sub] = SIGN_TEXTS[idx]
      signMats[idx] = new THREE.MeshBasicMaterial({
        map: signCanvas(label, main, sub),
        transparent: true,
        toneMapped: false,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.h), signMats[idx])
    mesh.position.set(s.x, s.y, s.z)
    mesh.rotation.y = s.rotY
    scene.add(mesh)
  }

  /* ---------- city limits ---------- */
  for (const s of [-1, 1]) {
    addBox(boundaryGeos, 700, 1.1, 0.8, 0, 0.55, s * 349.4)
    addBox(boundaryGeos, 0.8, 1.1, 700, s * 349.4, 0.55, 0)
    const sx = new THREE.BoxGeometry(700, 0.07, 0.1)
    sx.translate(0, 1.13, s * 349.4)
    paintGeometry(sx, new THREE.Color('#31e6ff'))
    boundaryNeon.push(sx)
    const sz = new THREE.BoxGeometry(0.1, 0.07, 700)
    sz.translate(s * 349.4, 1.13, 0)
    paintGeometry(sz, new THREE.Color('#31e6ff'))
    boundaryNeon.push(sz)
  }
  const boundaryMat = new THREE.MeshStandardMaterial({ color: 0x363b45, roughness: 0.8, metalness: 0.2 })
  const boundary = new THREE.Mesh(mergeGeometries(boundaryGeos, false), boundaryMat)
  boundary.receiveShadow = true
  scene.add(boundary)
  const boundaryStrip = new THREE.Mesh(
    mergeGeometries(boundaryNeon, false),
    new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
  )
  scene.add(boundaryStrip)

  /* ---------- distant hills ---------- */
  const mountainGeos = []
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2 + (rng() - 0.5) * 0.22
    const radius = 620 + rng() * 300
    const h = 60 + rng() * 150
    const g = new THREE.ConeGeometry(120 + rng() * 120, h, 5 + Math.floor(rng() * 3))
    g.rotateY(rng() * Math.PI)
    g.translate(Math.cos(angle) * radius, h / 2 - 8, Math.sin(angle) * radius)
    mountainGeos.push(g)
  }
  const mountains = new THREE.Mesh(
    mergeGeometries(mountainGeos, false),
    new THREE.MeshStandardMaterial({ color: 0x3a3450, roughness: 1, flatShading: true }),
  )
  scene.add(mountains)

  /* ---------- day / night ---------- */
  const parsed = {}
  for (const [name, p] of Object.entries(PRESETS)) {
    parsed[name] = {
      ...p,
      topC: new THREE.Color(p.top),
      bottomC: new THREE.Color(p.bottom),
      fogC: new THREE.Color(p.fog),
      sunC: new THREE.Color(p.sun),
      hemiSkyC: new THREE.Color(p.hemiSky),
      hemiGroundC: new THREE.Color(p.hemiGround),
      sunDirV: new THREE.Vector3(...p.sunDir).normalize(),
    }
  }
  let target = parsed.dusk
  let timeName = 'dusk'
  const cur = {
    top: parsed.dusk.topC.clone(),
    bottom: parsed.dusk.bottomC.clone(),
    fog: parsed.dusk.fogC.clone(),
    sun: parsed.dusk.sunC.clone(),
    hemiSky: parsed.dusk.hemiSkyC.clone(),
    hemiGround: parsed.dusk.hemiGroundC.clone(),
    sunDir: parsed.dusk.sunDirV.clone(),
    fogNear: parsed.dusk.fogNear,
    fogFar: parsed.dusk.fogFar,
    sunIntensity: parsed.dusk.sunIntensity,
    hemiIntensity: parsed.dusk.hemiIntensity,
    emissive: parsed.dusk.emissive,
    lamp: parsed.dusk.lamp,
    stars: parsed.dusk.stars,
    exposure: parsed.dusk.exposure,
    sunGlow: parsed.dusk.sunGlow,
  }

  function setTime(name) {
    if (!parsed[name]) return timeName
    target = parsed[name]
    timeName = name
    return timeName
  }

  function update(dt, camera, focus) {
    const k = 1 - Math.exp(-dt * 1.7)
    cur.top.lerp(target.topC, k)
    cur.bottom.lerp(target.bottomC, k)
    cur.fog.lerp(target.fogC, k)
    cur.sun.lerp(target.sunC, k)
    cur.hemiSky.lerp(target.hemiSkyC, k)
    cur.hemiGround.lerp(target.hemiGroundC, k)
    cur.sunDir.lerp(target.sunDirV, k).normalize()
    for (const key of ['fogNear', 'fogFar', 'sunIntensity', 'hemiIntensity', 'emissive', 'lamp', 'stars', 'exposure', 'sunGlow']) {
      cur[key] = THREE.MathUtils.lerp(cur[key], target[key], k)
    }

    sky.position.copy(camera.position)
    stars.position.copy(camera.position)
    skyUniforms.topColor.value.copy(cur.top)
    skyUniforms.bottomColor.value.copy(cur.bottom)
    skyUniforms.sunColor.value.copy(cur.sun)
    skyUniforms.sunDir.value.copy(cur.sunDir)
    skyUniforms.glow.value = cur.sunGlow

    scene.fog.color.copy(cur.fog)
    scene.fog.near = cur.fogNear
    scene.fog.far = cur.fogFar
    sun.color.copy(cur.sun)
    sun.intensity = cur.sunIntensity
    sun.position.set(
      focus.x + cur.sunDir.x * 300,
      cur.sunDir.y * 300,
      focus.z + cur.sunDir.z * 300,
    )
    sun.target.position.set(focus.x, 0, focus.z)
    sun.target.updateMatrixWorld()
    hemi.color.copy(cur.hemiSky)
    hemi.groundColor.copy(cur.hemiGround)
    hemi.intensity = cur.hemiIntensity
    wallMat.emissiveIntensity = cur.emissive
    lampHeadMat.emissiveIntensity = 1.2 + cur.lamp * 2.8
    if (lampGlowMat) lampGlowMat.opacity = cur.lamp * 0.9
    starMat.opacity = cur.stars
    renderer.toneMappingExposure = cur.exposure
  }

  function groundHeightAt(x, z) {
    const ix = Math.round((x + 304) / CITY.spacing)
    const iz = Math.round((z + 304) / CITY.spacing)
    if (ix < 0 || ix > 8 || iz < 0 || iz > 8) return 0
    const cx = -304 + ix * CITY.spacing
    const cz = -304 + iz * CITY.spacing
    if (Math.abs(x - cx) < 29 && Math.abs(z - cz) < 29) return 0.38
    return 0
  }

  function boxHit(ox, oy, oz, dx, dy, dz, b) {
    let tmin = 0.02
    let tmax = 1
    if (Math.abs(dx) < 1e-8) {
      if (ox < b.minX || ox > b.maxX) return Infinity
    } else {
      let a = (b.minX - ox) / dx
      let c = (b.maxX - ox) / dx
      if (a > c) [a, c] = [c, a]
      if (a > tmin) tmin = a
      if (c < tmax) tmax = c
    }
    if (Math.abs(dy) < 1e-8) {
      if (oy < 0.38 || oy > 0.38 + b.height) return Infinity
    } else {
      let a = (0.38 - oy) / dy
      let c = (0.38 + b.height - oy) / dy
      if (a > c) [a, c] = [c, a]
      if (a > tmin) tmin = a
      if (c < tmax) tmax = c
    }
    if (Math.abs(dz) < 1e-8) {
      if (oz < b.minZ || oz > b.maxZ) return Infinity
    } else {
      let a = (b.minZ - oz) / dz
      let c = (b.maxZ - oz) / dz
      if (a > c) [a, c] = [c, a]
      if (a > tmin) tmin = a
      if (c < tmax) tmax = c
    }
    return tmin <= tmax ? tmin : Infinity
  }

  function cameraClearance(from, to) {
    let best = 1
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dz = to.z - from.z
    for (const b of buildings) {
      const cx = (b.minX + b.maxX) * 0.5
      const cz = (b.minZ + b.maxZ) * 0.5
      if ((cx - from.x) * (cx - from.x) + (cz - from.z) * (cz - from.z) > 120 * 120) continue
      const t = boxHit(from.x, from.y, from.z, dx, dy, dz, b)
      if (t < best) best = t
    }
    return best
  }

  return {
    buildings,
    mapBlocks,
    roadCenters: CITY.roadCenters,
    bounds: CITY.extent,
    groundHeightAt,
    cameraClearance,
    setTime,
    getTime: () => timeName,
    update,
    sun,
    wallMesh,
  }
}





