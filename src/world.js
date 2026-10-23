import * as THREE from 'three'
import { createCrystalCluster, createRock, createBeacon, glowSprite, MAT } from './models.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (t) => t * t * (3 - 2 * t)

function hash2(x, z) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z)
  const xf = x - xi, zf = z - zi
  const u = smooth(xf), v = smooth(zf)
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}
function fbm(x, z, oct = 4) {
  let v = 0, amp = 0.5, f = 1
  for (let i = 0; i < oct; i++) { v += amp * vnoise(x * f, z * f); f *= 2; amp *= 0.5 }
  return v
}

export function terrainHeight(x, z) {
  let h = (fbm(x * 0.035 + 11, z * 0.035 + 3, 4) - 0.5) * 8.5
  h += (fbm(x * 0.11 + 4, z * 0.11 + 9, 3) - 0.5) * 2.2
  h += (fbm(x * 0.32, z * 0.32, 2) - 0.5) * 0.35
  const dB = Math.hypot(x - 1, z - 5)
  const dH = Math.hypot(x, z + 53)
  const fB = smooth(clamp((dB - 13) / 27, 0, 1))
  const fH = smooth(clamp((dH - 11) / 22, 0, 1))
  const corridor = smooth(clamp((Math.abs(x) - 8) / 22, 0, 1))
  let flat = Math.min(fB, fH)
  flat = Math.min(1, flat + corridor * 0.12)
  h *= 0.045 + flat * 0.955
  const edge = Math.max(Math.abs(x), Math.abs(z))
  if (edge > 62) h += Math.pow(edge - 62, 1.5) * 0.16
  return h
}

function makeGroundTexture() {
  const s = 512
  const c = document.createElement('canvas'); c.width = c.height = s
  const x = c.getContext('2d')
  x.fillStyle = '#8b8f94'; x.fillRect(0, 0, s, s)
  const img = x.getImageData(0, 0, s, s)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 42
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n
  }
  x.putImageData(img, 0, 0)
  for (let i = 0; i < 220; i++) {
    x.strokeStyle = `rgba(${20 + Math.random() * 30},${24 + Math.random() * 30},${30 + Math.random() * 30},${0.12 + Math.random() * 0.22})`
    x.lineWidth = 0.5 + Math.random() * 2.2
    x.beginPath()
    let px = Math.random() * s, py = Math.random() * s
    x.moveTo(px, py)
    for (let j = 0; j < 5; j++) { px += (Math.random() - 0.5) * 60; py += (Math.random() - 0.5) * 60; x.lineTo(px, py) }
    x.stroke()
  }
  for (let i = 0; i < 650; i++) {
    x.fillStyle = `rgba(${50 + Math.random() * 80},${55 + Math.random() * 80},${55 + Math.random() * 80},${Math.random() * 0.35})`
    const r = Math.random() * 2.5
    x.beginPath(); x.arc(Math.random() * s, Math.random() * s, r, 0, 7); x.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(28, 28)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makeCreepTexture() {
  const s = 256
  const c = document.createElement('canvas'); c.width = c.height = s
  const x = c.getContext('2d')
  x.clearRect(0, 0, s, s)
  const g = x.createRadialGradient(128, 128, 20, 128, 128, 126)
  g.addColorStop(0, 'rgba(64,28,78,.92)')
  g.addColorStop(0.55, 'rgba(45,18,58,.72)')
  g.addColorStop(0.8, 'rgba(40,22,50,.3)')
  g.addColorStop(1, 'rgba(20,10,30,0)')
  x.fillStyle = g; x.fillRect(0, 0, s, s)
  for (let i = 0; i < 120; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 118
    const px = 128 + Math.cos(a) * r, py = 128 + Math.sin(a) * r
    x.fillStyle = Math.random() > 0.55 ? 'rgba(102,255,130,.16)' : 'rgba(160,70,190,.16)'
    x.beginPath(); x.arc(px, py, 1 + Math.random() * 6, 0, 7); x.fill()
  }
  x.strokeStyle = 'rgba(120,255,150,.2)'; x.lineWidth = 1.2
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2
    x.beginPath(); x.moveTo(128, 128)
    x.bezierCurveTo(128 + Math.cos(a) * 40, 128 + Math.sin(a) * 40, 128 + Math.cos(a + 0.4) * 80, 128 + Math.sin(a + 0.4) * 80, 128 + Math.cos(a) * 120, 128 + Math.sin(a) * 120)
    x.stroke()
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createWorld(scene, camera) {
  const group = new THREE.Group()
  scene.add(group)

  /* ---------- sky ---------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(700, 32, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new THREE.Color(0x03060d) },
        mid: { value: new THREE.Color(0x0a1a2b) },
        horizon: { value: new THREE.Color(0x173b4d) },
        glow: { value: new THREE.Color(0x2b7e9b) },
      },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vDir; uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 glow;
        void main(){
          float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 c = mix(horizon, mid, smoothstep(0.42, 0.58, h));
          c = mix(c, top, smoothstep(0.55, 1.0, h));
          float band = exp(-pow((vDir.y - 0.02) * 9.0, 2.0));
          c += glow * band * 0.5;
          float az = atan(vDir.z, vDir.x);
          c += vec3(0.05, 0.13, 0.17) * exp(-pow((az - 2.4) * 1.8, 2.0)) * (1.0 - smoothstep(0.0, 0.35, vDir.y));
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  )
  group.add(sky)

  const starGeo = new THREE.BufferGeometry()
  const starPos = []
  for (let i = 0; i < 2400; i++) {
    const a = Math.random() * Math.PI * 2
    const y = Math.random() * 0.95 + 0.02
    const r = Math.sqrt(1 - y * y)
    starPos.push(Math.cos(a) * r * 620, y * 620, Math.sin(a) * r * 620)
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xa9dcff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0.75, depthWrite: false, fog: false }))
  group.add(stars)

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(52, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x2c3550, emissive: 0x0a1024, emissiveIntensity: 0.55, roughness: 0.94, metalness: 0.05 })
  )
  planet.position.set(-215, 95, -330)
  group.add(planet)
  const atmo = glowSprite(0x3c69c8, 120, 0.16); atmo.position.copy(planet.position); group.add(atmo)
  const ring = new THREE.Mesh(new THREE.RingGeometry(64, 92, 80), new THREE.MeshBasicMaterial({ color: 0x8da7d8, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }))
  ring.position.copy(planet.position); ring.rotation.set(1.15, 0.2, 0.3); group.add(ring)

  /* ---------- terrain ---------- */
  const size = 260, seg = 190
  const geo = new THREE.PlaneGeometry(size, size, seg, seg)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors = []
  const cLow = new THREE.Color(0x1b2834)
  const cMid = new THREE.Color(0x384044)
  const cHigh = new THREE.Color(0x5a5046)
  const cRust = new THREE.Color(0x68473a)
  const cMoss = new THREE.Color(0x374d3c)
  const tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i)
    const h = terrainHeight(x, z)
    pos.setY(i, h)
    const t = clamp((h + 3) / 7, 0, 1)
    tmp.copy(cLow).lerp(cMid, smooth(clamp(t * 1.8, 0, 1)))
    if (t > 0.55) tmp.lerp(cHigh, (t - 0.55) * 1.9)
    const rust = fbm(x * 0.055 + 20, z * 0.055 + 8, 3)
    if (rust > 0.58) tmp.lerp(cRust, (rust - 0.58) * 1.7)
    const moss = fbm(x * 0.09 + 2, z * 0.09 + 40, 3)
    if (moss > 0.6) tmp.lerp(cMoss, (moss - 0.6) * 1.3)
    tmp.multiplyScalar(0.85 + fbm(x * 0.45, z * 0.45, 2) * 0.38)
    colors.push(tmp.r, tmp.g, tmp.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  const detail = makeGroundTexture()
  const groundMat = new THREE.MeshStandardMaterial({
    vertexColors: true, map: detail, bumpMap: detail, bumpScale: 0.55,
    roughness: 0.97, metalness: 0.03, color: 0xffffff,
  })
  const ground = new THREE.Mesh(geo, groundMat)
  ground.receiveShadow = true
  ground.position.y = -0.02
  group.add(ground)

  /* ---------- creep ---------- */
  const creep = new THREE.Mesh(new THREE.CircleGeometry(25, 48), new THREE.MeshBasicMaterial({ map: makeCreepTexture(), transparent: true, depthWrite: false, opacity: 0.95 }))
  creep.rotation.x = -Math.PI / 2
  creep.position.set(0, terrainHeight(0, -53) + 0.06, -53)
  group.add(creep)
  const creepGlow = new THREE.PointLight(0x8b3fd1, 50, 48, 2); creepGlow.position.set(0, 6, -52); group.add(creepGlow)

  /* ---------- glowing fissures ---------- */
  const fissureMat = new THREE.MeshBasicMaterial({ color: 0xff5c2a, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
  for (let i = 0; i < 5; i++) {
    const pts = []
    const startX = -60 + Math.random() * 110
    const startZ = -50 + Math.random() * 40
    for (let j = 0; j < 6; j++) {
      const x = startX + j * (3 + Math.random() * 4) - 8
      const z = startZ + (Math.random() - 0.5) * 12
      pts.push(new THREE.Vector3(x, terrainHeight(x, z) + 0.06, z))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.04, 4, false), fissureMat)
    group.add(tube)
  }

  /* ---------- props ---------- */
  const props = new THREE.Group(); group.add(props)
  for (let i = 0; i < 52; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 48 + Math.random() * 55
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    if (Math.hypot(x - 1, z - 5) < 27) continue
    const rock = createRock(0.8 + Math.random() * 2.6)
    rock.position.set(x, terrainHeight(x, z) - 0.2, z)
    props.add(rock)
  }
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 34 + Math.random() * 30
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    if (Math.hypot(x - 1, z - 5) < 26) continue
    const rk = createRock(0.5 + Math.random())
    rk.position.set(x, terrainHeight(x, z), z)
    props.add(rk)
  }

  const mineralNodes = []
  const mineralPositions = [[27, 18], [31, 12], [23, 9], [29, 24], [21, 20], [34, 19]]
  for (const [x, z] of mineralPositions) {
    const cl = createCrystalCluster(false)
    cl.group.position.set(x, terrainHeight(x, z), z)
    cl.group.rotation.y = Math.random() * Math.PI
    props.add(cl.group)
    mineralNodes.push({ x, z, group: cl.group, glow: cl.glow, amount: 2400, phase: Math.random() * 6 })
  }
  const goldCluster = createCrystalCluster(true)
  goldCluster.group.position.set(-29, terrainHeight(-29, 19), 19)
  props.add(goldCluster.group)

  const vent = new THREE.Group()
  vent.position.set(-27, terrainHeight(-27, 8), 8)
  const vrock = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.4, 1.1, 9), MAT.rock)
  vrock.position.y = 0.4; vrock.castShadow = vrock.receiveShadow = true; vent.add(vrock)
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.9, 24), new THREE.MeshBasicMaterial({ color: 0x74ff96, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }))
  pool.rotation.x = -Math.PI / 2; pool.position.y = 1.0; vent.add(pool)
  const vglow = glowSprite(0x64ff8f, 8, 0.4); vglow.position.y = 1.8; vent.add(vglow)
  const vlight = new THREE.PointLight(0x66ff95, 24, 18, 2); vlight.position.y = 2.5; vent.add(vlight)
  props.add(vent)

  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.6 + Math.random() * 0.5, 10, 8), MAT.carapaceDark)
    pod.position.set(Math.cos(a) * (23 + Math.random() * 4), terrainHeight(Math.cos(a) * 25, -53 + Math.sin(a) * 25) + 0.2, -53 + Math.sin(a) * 25)
    pod.scale.y = 0.7; pod.castShadow = true; props.add(pod)
    const pg = glowSprite(0x9bff7f, 2.4, 0.18); pg.position.copy(pod.position); pg.position.y += 0.5; props.add(pg)
  }

  const beacons = []
  const b1 = createBeacon(0x5eeaff); b1.group.position.set(17, terrainHeight(17, 2), 2); props.add(b1.group); beacons.push(b1)
  const b2 = createBeacon(0xffb35a); b2.group.position.set(-17, terrainHeight(-17, -7), -7); props.add(b2.group); beacons.push(b2)

  /* ---------- dust / spores ---------- */
  const dustCount = 900
  const dustGeo = new THREE.BufferGeometry()
  const dp = new Float32Array(dustCount * 3)
  const speeds = new Float32Array(dustCount)
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 170
    dp[i * 3 + 1] = Math.random() * 26 + 0.5
    dp[i * 3 + 2] = (Math.random() - 0.5) * 170
    speeds[i] = 0.2 + Math.random() * 0.8
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3))
  const dustMat = new THREE.PointsMaterial({ color: 0xa7d9ee, size: 0.26, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
  const dust = new THREE.Points(dustGeo, dustMat)
  group.add(dust)

  const sporeCount = 180
  const sporeGeo = new THREE.BufferGeometry()
  const sp = new Float32Array(sporeCount * 3)
  const spSeed = new Float32Array(sporeCount)
  for (let i = 0; i < sporeCount; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 28
    sp[i * 3] = Math.cos(a) * r
    sp[i * 3 + 1] = Math.random() * 14
    sp[i * 3 + 2] = -53 + Math.sin(a) * r
    spSeed[i] = Math.random() * 10
  }
  sporeGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  const spores = new THREE.Points(sporeGeo, new THREE.PointsMaterial({ color: 0x9bff8a, size: 0.42, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending }))
  group.add(spores)

  const world = {
    group, terrainHeight, mineralNodes, beacons,
    update(dt, t) {
      stars.rotation.y = t * 0.003
      ring.rotation.z = t * 0.004
      creepGlow.intensity = 42 + Math.sin(t * 1.3) * 12
      pool.scale.setScalar(1 + Math.sin(t * 2.1) * 0.06)
      vglow.material.opacity = 0.32 + Math.sin(t * 1.7) * 0.1
      for (const n of mineralNodes) {
        n.phase += dt
        n.glow.material.opacity = 0.24 + Math.sin(n.phase * 1.8) * 0.1
        n.group.children.forEach((c, i) => { if (i < 8) c.scale.y = c.scale.y * 0.98 + (1 + Math.sin(n.phase * 1.4 + i) * 0.02) * c.scale.y * 0.02 })
      }
      for (const b of beacons) { b.glow.material.opacity = 0.55 + Math.sin(t * 2.4 + b.group.position.x) * 0.2 }
      const p = dust.geometry.attributes.position
      for (let i = 0; i < dustCount; i++) {
        p.array[i * 3 + 1] -= speeds[i] * dt * 0.55
        p.array[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.06
        if (p.array[i * 3 + 1] < 0.3) p.array[i * 3 + 1] = 25
      }
      p.needsUpdate = true
      const q = spores.geometry.attributes.position
      for (let i = 0; i < sporeCount; i++) {
        q.array[i * 3 + 1] += (0.25 + (i % 7) * 0.05) * dt
        q.array[i * 3] += Math.sin(t * 0.7 + spSeed[i]) * dt * 0.18
        q.array[i * 3 + 2] += Math.cos(t * 0.5 + spSeed[i]) * dt * 0.14
        if (q.array[i * 3 + 1] > 15) q.array[i * 3 + 1] = 0.2
      }
      q.needsUpdate = true
      dust.rotation.y = t * 0.002
    },
  }
  return world
}

export function createLandingPad(scene) {
  const size = 44
  const geo = new THREE.PlaneGeometry(size, size, 64, 64)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + 2, z = pos.getZ(i) + 6
    pos.setY(i, terrainHeight(x, z) + 0.07)
  }
  const c = document.createElement('canvas'); c.width = c.height = 1024
  const x = c.getContext('2d')
  x.clearRect(0, 0, 1024, 1024)
  x.save(); x.translate(512, 512)
  const g = x.createRadialGradient(0, 0, 40, 0, 0, 500)
  g.addColorStop(0, 'rgba(21,34,45,.9)'); g.addColorStop(0.72, 'rgba(17,28,38,.86)'); g.addColorStop(0.94, 'rgba(12,20,28,.7)'); g.addColorStop(1, 'rgba(10,16,24,0)')
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, 500, 0, 7); x.fill()
  x.strokeStyle = 'rgba(120,235,255,.22)'; x.lineWidth = 2
  for (const r of [180, 300, 390, 470]) { x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke() }
  x.strokeStyle = 'rgba(120,235,255,.1)'; x.lineWidth = 1
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; x.beginPath(); x.moveTo(Math.cos(a) * 200, Math.sin(a) * 200); x.lineTo(Math.cos(a) * 470, Math.sin(a) * 470); x.stroke() }
  x.strokeStyle = 'rgba(255,180,80,.34)'; x.lineWidth = 12
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, a2 = (i + 0.45) / 60 * Math.PI * 2
    if (i % 2) continue
    x.beginPath(); x.arc(0, 0, 442, a, a2); x.stroke()
  }
  x.strokeStyle = 'rgba(120,235,255,.5)'; x.lineWidth = 4
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; x.beginPath(); x.arc(0, 0, 372, a, a + 0.6); x.stroke() }
  x.fillStyle = 'rgba(120,235,255,.2)'
  x.font = '700 22px Bahnschrift, Segoe UI, sans-serif'; x.textAlign = 'center'
  x.fillText('D O M I N I O N   O U T P O S T   C H A R - 9', 0, 330)
  x.font = '700 15px Bahnschrift, Segoe UI, sans-serif'
  x.fillText('SECTOR 7G  //  LANDING ZONE ALPHA', 0, 364)
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + 0.52
    x.save(); x.rotate(a); x.translate(0, -424)
    x.fillStyle = 'rgba(255,180,80,.55)'; x.fillRect(-26, -5, 52, 10)
    x.restore()
  }
  x.restore()
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const mat = new THREE.MeshStandardMaterial({ color: 0x6a7884, map: tex, transparent: true, roughness: 0.86, metalness: 0.18, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.renderOrder = 1
  scene.add(mesh)
  return mesh
}
