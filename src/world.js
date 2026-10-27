import * as THREE from 'three'

export const BOUNDS = { minX: -34.5, maxX: 34.5, minZ: -43.5, maxZ: 43.5 }

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canvasTexture(size, draw, repeatX = 1, repeatY = 1) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  draw(ctx, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeatX, repeatY)
  tex.anisotropy = 4
  return tex
}

function makeFloorTexture() {
  const rand = rng(41)
  return canvasTexture(1024, (ctx, s) => {
    ctx.fillStyle = '#1b2025'
    ctx.fillRect(0, 0, s, s)
    const tile = s / 4
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const v = 66 + Math.floor(rand() * 18)
        ctx.fillStyle = `rgb(${v},${v + 3},${v + 5})`
        ctx.fillRect(x * tile + 3, y * tile + 3, tile - 6, tile - 6)
        ctx.globalAlpha = 0.12
        ctx.fillStyle = rand() > 0.5 ? '#c8d6dd' : '#05070a'
        for (let k = 0; k < 9; k++) {
          ctx.beginPath()
          ctx.ellipse(x * tile + rand() * tile, y * tile + rand() * tile, rand() * 26 + 2, rand() * 10 + 1, rand() * 6, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,.6)'
    ctx.lineWidth = 4
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * tile, 0); ctx.lineTo(i * tile, s); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * tile); ctx.lineTo(s, i * tile); ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(150,180,190,.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < 60; i++) {
      ctx.beginPath()
      const x = rand() * s, y = rand() * s
      ctx.moveTo(x, y)
      ctx.lineTo(x + rand() * 120 - 60, y + rand() * 120 - 60)
      ctx.stroke()
    }
  }, 10, 12)
}

function makeConcreteTexture() {
  const rand = rng(77)
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#3c464d'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 5200; i++) {
      const v = 38 + Math.floor(rand() * 42)
      ctx.fillStyle = `rgba(${v},${v + 4},${v + 6},${rand() * 0.5})`
      ctx.fillRect(rand() * s, rand() * s, rand() * 3 + 1, rand() * 3 + 1)
    }
    ctx.strokeStyle = 'rgba(0,0,0,.22)'
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      let x = rand() * s, y = rand() * s
      ctx.moveTo(x, y)
      for (let k = 0; k < 5; k++) { x += rand() * 50 - 25; y += rand() * 50 - 10; ctx.lineTo(x, y) }
      ctx.stroke()
    }
  }, 2, 1)
}

function makeSignTexture(title, sub, color, bg = '#0a0f14') {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 160
  const ctx = c.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 512, 160)
  const grd = ctx.createLinearGradient(0, 0, 0, 160)
  grd.addColorStop(0, 'rgba(255,255,255,.06)')
  grd.addColorStop(1, 'rgba(0,0,0,.18)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 512, 160)
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 3
  ctx.strokeRect(8, 8, 496, 144)
  ctx.globalAlpha = 1
  ctx.font = '600 74px "Teko", "Arial Narrow", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 34
  ctx.fillStyle = color
  ctx.fillText(title, 256, 66)
  ctx.shadowBlur = 0
  ctx.font = '600 20px "Rajdhani", sans-serif'
  ctx.fillStyle = 'rgba(220,235,240,.62)'
  ctx.letterSpacing = '8px'
  ctx.fillText(sub, 256, 121)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makePosterTexture(lines, accent) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 384
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#0b1015'
  ctx.fillRect(0, 0, 256, 384)
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.16
  ctx.fillRect(0, 0, 256, 384)
  ctx.globalAlpha = 1
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, 236, 364)
  ctx.fillStyle = accent
  ctx.font = '700 30px "Rajdhani", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(lines[0], 128, 74)
  ctx.fillStyle = '#e8f1f4'
  ctx.font = '600 46px "Teko", sans-serif'
  lines.slice(1).forEach((line, i) => ctx.fillText(line, 128, 140 + i * 48))
  ctx.fillStyle = 'rgba(200,220,230,.4)'
  ctx.font = '600 14px "Rajdhani", sans-serif'
  ctx.fillText('WESTGATE PLAZA', 128, 342)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeVendingTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#080d12'
  ctx.fillRect(0, 0, 256, 512)
  const grd = ctx.createLinearGradient(0, 0, 0, 512)
  grd.addColorStop(0, '#173244')
  grd.addColorStop(0.6, '#091119')
  grd.addColorStop(1, '#1a0d0d')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 256, 512)
  ctx.fillStyle = '#ff5a2a'
  ctx.font = '700 46px "Teko", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('COLD', 128, 64)
  ctx.fillText('FUEL', 128, 108)
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 4; x++) {
      ctx.fillStyle = ['#3ad6ff', '#ffd23a', '#ff4d4d', '#8dff6a', '#c47bff'][(x + y * 3) % 5]
      ctx.globalAlpha = 0.8
      ctx.fillRect(24 + x * 54, 160 + y * 76, 38, 54)
      ctx.globalAlpha = 1
    }
  }
  ctx.fillStyle = '#d6e6ee'
  ctx.fillRect(28, 424, 200, 46)
  ctx.fillStyle = '#0a0f14'
  ctx.font = '700 26px "Rajdhani", sans-serif'
  ctx.fillText('$2.50', 128, 456)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeSkyTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#050a12'
  ctx.fillRect(0, 0, 512, 512)
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const grd = ctx.createLinearGradient(x * 128, y * 128, x * 128 + 128, y * 128 + 128)
      grd.addColorStop(0, '#1b3a52')
      grd.addColorStop(0.45, '#6e9bb8')
      grd.addColorStop(1, '#132330')
      ctx.fillStyle = grd
      ctx.fillRect(x * 128 + 4, y * 128 + 4, 120, 120)
      ctx.strokeStyle = 'rgba(2,6,10,.95)'
      ctx.lineWidth = 8
      ctx.strokeRect(x * 128 + 4, y * 128 + 4, 120, 120)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,225,180,.85)')
  g.addColorStop(1, 'rgba(255,160,60,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function addBox(scene, mat, w, h, d, x, y, z, ry = 0, shadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y, z)
  mesh.rotation.y = ry
  if (shadow) { mesh.castShadow = true; mesh.receiveShadow = true }
  scene.add(mesh)
  return mesh
}

function addCollider(colliders, x, z, hw, hd) {
  colliders.push({ type: 'box', x, z, hw, hd })
}

function addCircle(colliders, x, z, r) {
  colliders.push({ type: 'circle', x, z, r })
}

export function createMall(scene) {
  const colliders = []
  const storeRects = []
  const animated = []
  const flickers = []
  const rand = rng(2029)
  const lights = {}

  const floorTex = makeFloorTexture()
  const concreteTex = makeConcreteTexture()
  const skyTex = makeSkyTexture()
  const glowTex = makeGlowTexture()
  const vendingTex = makeVendingTexture()

  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, color: 0xffffff, roughness: 0.3, metalness: 0.25 })
  const concreteMat = new THREE.MeshStandardMaterial({ map: concreteTex, color: 0xd2dade, roughness: 0.9, metalness: 0.04 })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0b1117, roughness: 0.65, metalness: 0.35 })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x39444c, roughness: 0.36, metalness: 0.8 })
  const railMat = new THREE.MeshStandardMaterial({ color: 0x1b2329, roughness: 0.3, metalness: 0.9 })
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x8fd6e8, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 0.72, metalness: 0.05 })
  const neonCyan = new THREE.MeshBasicMaterial({ color: 0x5fe6ff, toneMapped: false })
  const neonAmber = new THREE.MeshBasicMaterial({ color: 0xffb454, toneMapped: false })
  const neonRed = new THREE.MeshBasicMaterial({ color: 0xff3b30, toneMapped: false })

  // ------------------------------------------------------------- shell
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(76, 94), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const inlayMat = new THREE.MeshStandardMaterial({ color: 0x2b3338, roughness: 0.28, metalness: 0.5 })
  for (const [x, z, w, d] of [[0, 0, 26, 26], [0, -24, 12, 12], [0, 24, 12, 12], [-22, 0, 12, 12], [22, 0, 12, 12]]) {
    const inlay = new THREE.Mesh(new THREE.PlaneGeometry(w, d), inlayMat)
    inlay.rotation.x = -Math.PI / 2
    inlay.position.set(x, 0.012, z)
    scene.add(inlay)
  }

  // perimeter back walls
  addBox(scene, concreteMat, 92, 13, 1.2, 0, 6.5, -54.5)
  addBox(scene, concreteMat, 92, 13, 1.2, 0, 6.5, 54.5)
  addBox(scene, concreteMat, 1.2, 13, 110, -46.5, 6.5, 0)
  addBox(scene, concreteMat, 1.2, 13, 110, 46.5, 6.5, 0)

  // ------------------------------------------------------------- storefronts
  const stores = [
    { side: 'n', at: -27, name: 'GAME HAVEN', sub: 'ARCADE · LEVEL 1', color: '#5fe6ff' },
    { side: 'n', at: -9, name: 'VOLT', sub: 'ELECTRONICS', color: '#ffb454' },
    { side: 'n', at: 9, name: 'CINEMA 8', sub: 'NOW SHOWING · NIGHT OF THE DEAD', color: '#ff4d6d' },
    { side: 'n', at: 27, name: 'AURORA', sub: 'FASHION HOUSE', color: '#c47bff' },
    { side: 's', at: -27, name: 'FOOD COURT', sub: 'OPEN 24 HOURS', color: '#ff9f43' },
    { side: 's', at: -9, name: 'SPORTSWORKS', sub: 'PERFORMANCE OUTLET', color: '#8dff6a' },
    { side: 's', at: 9, name: 'TOY VAULT', sub: 'COLLECTIBLES', color: '#3ad6ff' },
    { side: 's', at: 27, name: 'STYLE CO', sub: 'MEN · WOMEN · KIDS', color: '#ff6b9d' },
    { side: 'w', at: -30, name: 'BOOK NOOK', sub: 'BOOKS & CAFE', color: '#ffd23a' },
    { side: 'w', at: -10, name: 'TECH DOME', sub: 'COMPUTERS · DRONES', color: '#3ad6ff' },
    { side: 'w', at: 10, name: 'CAFE 24', sub: 'COFFEE · BAKERY', color: '#ffb454' },
    { side: 'w', at: 30, name: 'PHARMACY', sub: 'HEALTH · BEAUTY', color: '#8dff6a' },
    { side: 'e', at: -30, name: 'SHOE PALACE', sub: 'SNEAKERS · FORMAL', color: '#ff6b9d' },
    { side: 'e', at: -10, name: 'JEWEL BOX', sub: 'FINE JEWELRY', color: '#ffd23a' },
    { side: 'e', at: 10, name: 'CINEMA 8', sub: 'SCREEN 4 · EXIT', color: '#ff4d6d' },
    { side: 'e', at: 30, name: 'ESCAPE', sub: 'ADVENTURE ROOMS', color: '#c47bff' }
  ]

  const productGeo = new THREE.BoxGeometry(0.55, 0.5, 0.45)
  const productMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.15 })
  const products = new THREE.InstancedMesh(productGeo, productMat, 144)
  products.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  const dummy = new THREE.Object3D()
  const productColors = [0xff6b6b, 0x5fe6ff, 0xffd23a, 0x8dff6a, 0xc47bff, 0xffb454, 0xffffff, 0x3a7bd5]
  let productIdx = 0

  function addStore(s) {
    const color = new THREE.Color(s.color)
    const signTex = makeSignTexture(s.name, s.sub, s.color)
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true, toneMapped: false })
    let wx = 0, wz = 0, rot = 0, span = 17.5, depth = 8
    if (s.side === 'n') { wx = s.at; wz = -50; rot = 0 }
    if (s.side === 's') { wx = s.at; wz = 50; rot = Math.PI }
    if (s.side === 'w') { wx = -42; wz = s.at; rot = Math.PI / 2 }
    if (s.side === 'e') { wx = 42; wz = s.at; rot = -Math.PI / 2 }

    const g = new THREE.Group()
    g.position.set(wx, 0, wz)
    g.rotation.y = rot
    scene.add(g)

    // interior floor, back wall, sides
    const insideFloor = new THREE.Mesh(new THREE.PlaneGeometry(span, depth), new THREE.MeshStandardMaterial({ color: 0x1b2227, roughness: 0.58, metalness: 0.12 }))
    insideFloor.rotation.x = -Math.PI / 2
    insideFloor.position.set(0, 0.02, -depth / 2 - 0.6)
    g.add(insideFloor)

    const back = addBox(g, concreteMat, span, 6.2, 0.5, 0, 3.1, -depth - 0.6, 0, false)
    back.receiveShadow = true
    addBox(g, darkMat, 0.5, 6.2, depth, -span / 2, 3.1, -depth / 2 - 0.6, 0, false)
    addBox(g, darkMat, 0.5, 6.2, depth, span / 2, 3.1, -depth / 2 - 0.6, 0, false)

    // glass facade with door gap
    const glassL = new THREE.Mesh(new THREE.PlaneGeometry(span / 2 - 2.2, 5.4), glassMat)
    glassL.position.set(-span / 4 - 1.1, 2.9, 0.1)
    g.add(glassL)
    const glassR = glassL.clone()
    glassR.position.x = span / 4 + 1.1
    g.add(glassR)
    addBox(g, railMat, span / 2 - 2.2, 0.1, 0.12, -span / 4 - 1.1, 5.6, 0.1, 0, false)
    addBox(g, railMat, span / 2 - 2.2, 0.1, 0.12, span / 4 + 1.1, 5.6, 0.1, 0, false)
    addBox(g, railMat, 0.18, 5.6, 0.18, -span / 2 + 0.3, 2.8, 0.1, 0, false)
    addBox(g, railMat, 0.18, 5.6, 0.18, span / 2 - 0.3, 2.8, 0.1, 0, false)
    addBox(g, railMat, 0.12, 5.6, 0.12, 0, 2.8, 0.1, 0, false)

    // sign band
    addBox(g, darkMat, span - 0.6, 1.6, 0.35, 0, 6.55, 0.16, 0, false)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(span - 1.6, 1.35), signMat)
    sign.position.set(0, 6.55, 0.35)
    g.add(sign)
    const lightPanel = new THREE.Mesh(new THREE.PlaneGeometry(span - 3.2, 0.8), new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.7 }))
    lightPanel.rotation.x = Math.PI / 2
    lightPanel.position.set(0, 5.86, -2.8)
    g.add(lightPanel)
    const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(span - 2.5, 3.4), new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false }))
    windowGlow.position.set(0, 2.7, -7.9)
    g.add(windowGlow)
    const lowStrip = new THREE.Mesh(new THREE.BoxGeometry(span - 2.4, 0.05, 0.06), new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.65 }))
    lowStrip.position.set(0, 0.22, 0.18)
    g.add(lowStrip)
    for (const sx of [-span / 2 + 1.0, span / 2 - 1.0]) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4.2, 0.05), new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.35 }))
      edge.position.set(sx, 2.4, 0.16)
      g.add(edge)
    }
    flickers.push({ mat: signMat, base: 1, phase: rand() * 10, speed: 0.7 + rand() * 0.8, chance: 0.0015 })

    // shelves + products
    for (let i = 0; i < 2; i++) {
      const shelf = addBox(g, metalMat, span - 4, 0.12, 1.1, 0, 0.9 + i * 1.5, -4.4, 0, false)
      shelf.receiveShadow = true
      for (let k = 0; k < 5; k++) {
        if (productIdx >= 144) break
        const px = -span / 2 + 2.6 + k * ((span - 5.2) / 4)
        dummy.position.set(px, 1.2 + i * 1.5, -4.4)
        dummy.rotation.set(0, rand() * 0.5, 0)
        dummy.scale.setScalar(0.8 + rand() * 0.8)
        dummy.updateMatrix()
        products.setMatrixAt(productIdx, dummy.matrix)
        products.setColorAt(productIdx, new THREE.Color(productColors[Math.floor(rand() * productColors.length)]))
        productIdx++
      }
    }

    // mannequin / display silhouettes
    if (rand() > 0.35) {
      const torso = addBox(g, new THREE.MeshStandardMaterial({ color: 0x2a3238, roughness: 0.7 }), 0.5, 1.1, 0.32, span * 0.22, 2.3, -2.2, 0, false)
      torso.rotation.z = 0.06
      addBox(g, new THREE.MeshStandardMaterial({ color: 0x22282d, roughness: 0.8 }), 0.16, 1.1, 0.16, span * 0.22, 0.75, -2.2)
    }

    // shutter half down on some stores
    if (rand() > 0.6) {
      const shutter = addBox(g, new THREE.MeshStandardMaterial({ color: 0x353d42, roughness: 0.45, metalness: 0.7 }), span - 1.5, 2.4, 0.1, 0, 6.7, 0.3, 0, false)
      shutter.scale.y = 1
    }

    const rect = s.side === 'n' || s.side === 's'
      ? { x: wx - span / 2, z: wz < 0 ? wz - depth : wz, w: span, h: depth }
      : { x: wx < 0 ? wx - depth : wx, z: wz - span / 2, w: depth, h: span }
    storeRects.push({ ...rect, color: s.color, name: s.name })
  }
  stores.forEach(addStore)
  if (productIdx > 0) {
    products.count = productIdx
    products.instanceColor.needsUpdate = true
    scene.add(products)
  }

  // ------------------------------------------------------------- mezzanine (open atrium ring)
  const mezzMat = new THREE.MeshStandardMaterial({ color: 0x3d474f, roughness: 0.4, metalness: 0.3 })
  const mezzSlabs = [
    [76, 0.7, 16, 0, 5.1, -39],
    [76, 0.7, 16, 0, 5.1, 39],
    [13, 0.7, 62, -31.5, 5.1, 0],
    [13, 0.7, 62, 31.5, 5.1, 0]
  ]
  for (const [w, h, d, x, y, z] of mezzSlabs) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mezzMat)
    m.position.set(x, y, z)
    m.receiveShadow = true
    m.castShadow = true
    scene.add(m)
  }
  // warm underside accents on the balcony edge
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffb454, toneMapped: false, transparent: true, opacity: 0.5 })
  addBox(scene, edgeMat, 50, 0.05, 0.05, 0, 4.72, -31, 0, false)
  addBox(scene, edgeMat, 50, 0.05, 0.05, 0, 4.72, 31, 0, false)
  addBox(scene, edgeMat, 0.05, 0.05, 62, -25, 4.72, 0, 0, false)
  addBox(scene, edgeMat, 0.05, 0.05, 62, 25, 4.72, 0, 0, false)

  // railings around the atrium opening
  const railPostGeo = new THREE.BoxGeometry(0.1, 1.1, 0.1)
  const railPostMat = railMat
  const posts = []
  for (let x = -25; x <= 25; x += 2.5) { posts.push([x, -31, 0]); posts.push([x, 31, 0]) }
  for (let z = -31; z <= 31; z += 2.5) { posts.push([-25, z, 0]); posts.push([25, z, 0]) }
  const railPosts = new THREE.InstancedMesh(railPostGeo, railPostMat, posts.length)
  posts.forEach((p, i) => {
    dummy.position.set(p[0], 5.65, p[1])
    dummy.rotation.set(0, 0, 0)
    dummy.scale.set(1, 1, 1)
    dummy.updateMatrix()
    railPosts.setMatrixAt(i, dummy.matrix)
  })
  scene.add(railPosts)
  addBox(scene, railMat, 50.2, 0.08, 0.08, 0, 6.18, -31, 0, false)
  addBox(scene, railMat, 50.2, 0.08, 0.08, 0, 6.18, 31, 0, false)
  addBox(scene, railMat, 0.08, 0.08, 62.2, -25, 6.18, 0, 0, false)
  addBox(scene, railMat, 0.08, 0.08, 62.2, 25, 6.18, 0, 0, false)
  const railGlow = new THREE.MeshBasicMaterial({ color: 0x2f6675, toneMapped: false })
  addBox(scene, railGlow, 50, 0.03, 0.03, 0, 6.24, -31, 0, false)
  addBox(scene, railGlow, 50, 0.03, 0.03, 0, 6.24, 31, 0, false)
  addBox(scene, railGlow, 0.03, 0.03, 62, -25, 6.24, 0, 0, false)
  addBox(scene, railGlow, 0.03, 0.03, 62, 25, 6.24, 0, 0, false)

  // upper storefront glow bands
  for (let i = -3; i <= 3; i++) {
    addBox(scene, neonAmber, 6, 0.06, 0.06, i * 9, 7.8, -45.3, 0, false)
    addBox(scene, neonCyan, 6, 0.06, 0.06, i * 9, 7.8, 45.3, 0, false)
  }
  for (let i = -3; i <= 3; i++) {
    addBox(scene, neonCyan, 0.06, 0.06, 6, -39.3, 7.8, i * 11, 0, false)
    addBox(scene, neonAmber, 0.06, 0.06, 6, 39.3, 7.8, i * 11, 0, false)
  }

  // ------------------------------------------------------------- skylight + beams
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(46, 56), new THREE.MeshBasicMaterial({ map: skyTex, color: 0x9fbacc, toneMapped: false, transparent: true, opacity: 0.62 }))
  sky.rotation.x = Math.PI / 2
  sky.position.set(0, 11.4, 0)
  scene.add(sky)
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x11171c, roughness: 0.5, metalness: 0.6 })
  for (let i = -3; i <= 3; i++) {
    addBox(scene, beamMat, 48, 0.5, 0.35, 0, 10.9, i * 8, 0, false)
    addBox(scene, beamMat, 0.35, 0.5, 58, i * 6.8, 10.9, 0, 0, false)
  }
  // distant ceiling
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0a0f14, roughness: 0.9 })
  addBox(scene, ceilMat, 92, 0.6, 20, 0, 11.7, -46, 0, false)
  addBox(scene, ceilMat, 92, 0.6, 20, 0, 11.7, 46, 0, false)
  addBox(scene, ceilMat, 20, 0.6, 78, -38, 11.7, 0, 0, false)
  addBox(scene, ceilMat, 20, 0.6, 78, 38, 11.7, 0, 0, false)

  // hanging banners
  const bannerTex1 = makePosterTexture(['WESTGATE', 'HOLIDAY', 'BLOWOUT', 'UP TO 70% OFF'], '#ffb454')
  const bannerTex2 = makePosterTexture(['SECURITY', 'SHELTER', 'IN PLACE', 'LEVEL 1 ATRIUM'], '#5fe6ff')
  for (const [tex, x, z, ry] of [[bannerTex1, -8, -18, 0.14], [bannerTex2, 9, 14, -0.2], [bannerTex1, 22, -6, 0.1], [bannerTex2, -21, 10, 0.16]]) {
    const b = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 5.1), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false }))
    b.position.set(x, 7.6, z)
    b.rotation.y = ry
    scene.add(b)
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.6, 4), railMat)
    wire.position.set(x, 9.9, z)
    scene.add(wire)
  }

  // ------------------------------------------------------------- columns
  const columnGeo = new THREE.CylinderGeometry(0.85, 1.0, 10.4, 12)
  const columnMat = new THREE.MeshStandardMaterial({ map: concreteTex, color: 0x8a959b, roughness: 0.7, metalness: 0.1 })
  for (const [x, z] of [[-16, -18], [16, -18], [-16, 18], [16, 18], [-30, -32], [30, -32], [-30, 32], [30, 32]]) {
    const c = new THREE.Mesh(columnGeo, columnMat)
    c.position.set(x, 5.2, z)
    c.castShadow = true
    c.receiveShadow = true
    scene.add(c)
    addCircle(colliders, x, z, 1.15)
    const trim = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.06, 6, 18), neonCyan)
    trim.rotation.x = Math.PI / 2
    trim.position.set(x, 1.4, z)
    scene.add(trim)
  }

  // ------------------------------------------------------------- fountain
  const fx = 0, fz = -5
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x3a4449, roughness: 0.55, metalness: 0.35, map: concreteTex })
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.7, 0.75, 40), basinMat)
  basin.position.set(fx, 0.37, fz)
  basin.castShadow = true
  basin.receiveShadow = true
  scene.add(basin)
  addCircle(colliders, fx, fz, 4.9)
  const waterTex = canvasTexture(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s)
    g.addColorStop(0, '#0a2630'); g.addColorStop(0.5, '#123c46'); g.addColorStop(1, '#071a22')
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
    ctx.strokeStyle = 'rgba(140,230,255,.18)'; ctx.lineWidth = 2
    for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(128, 128, i * 9 + 3, 0, Math.PI * 2); ctx.stroke() }
  }, 2, 2)
  const water = new THREE.Mesh(new THREE.CircleGeometry(4.15, 48), new THREE.MeshStandardMaterial({ map: waterTex, color: 0x8fdfe8, roughness: 0.12, metalness: 0.4, transparent: true, opacity: 0.85, emissive: 0x0b3d4a, emissiveIntensity: 0.7 }))
  water.rotation.x = -Math.PI / 2
  water.position.set(fx, 0.76, fz)
  scene.add(water)
  animated.push((t) => { waterTex.offset.set(t * 0.008, t * 0.012) })

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 1.8, 16), new THREE.MeshStandardMaterial({ color: 0x2e383d, roughness: 0.4, metalness: 0.7 }))
  plinth.position.set(fx, 1.7, fz)
  plinth.castShadow = true
  scene.add(plinth)
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 18), new THREE.MeshStandardMaterial({ color: 0x1b2b32, roughness: 0.15, metalness: 0.95, emissive: 0x0e5666, emissiveIntensity: 0.6 }))
  orb.position.set(fx, 3.25, fz)
  scene.add(orb)
  animated.push((t) => { orb.rotation.y = t * 0.35 })
  const fountainLight = new THREE.PointLight(0x4fd8ee, 22, 22, 2)
  fountainLight.position.set(fx, 2.4, fz)
  scene.add(fountainLight)
  lights.fountain = fountainLight
  const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x3cc8e6, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }))
  glowSprite.scale.set(3.6, 3.6, 1)
  glowSprite.position.set(fx, 3.2, fz)
  scene.add(glowSprite)

  // floating debris in water
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2, r = 1.3 + rand() * 2.6
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.5 + rand(), 0.12, 0.4 + rand()), rand() > 0.5 ? woodMat : darkMat)
    d.position.set(fx + Math.cos(a) * r, 0.8, fz + Math.sin(a) * r)
    d.rotation.set(0, rand() * 3, 0.08)
    scene.add(d)
  }

  // ------------------------------------------------------------- escalators
  function addEscalator(x, z, dir) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    const angle = dir === 'up' ? -0.36 : 0.36
    const run = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 13), new THREE.MeshStandardMaterial({ color: 0x2b3339, roughness: 0.4, metalness: 0.7 }))
    run.position.set(0, 2.5, 0)
    run.rotation.x = angle
    run.castShadow = true
    g.add(run)
    const glass1 = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.3), glassMat)
    glass1.rotation.y = Math.PI / 2
    glass1.rotation.z = angle
    glass1.position.set(-1.35, 3.5, 0)
    g.add(glass1)
    const glass2 = glass1.clone()
    glass2.position.x = 1.35
    g.add(glass2)
    for (let i = 0; i < 16; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 0.62), railMat)
      const p = -6 + i * 0.78
      step.position.set(0, 2.55 + p * angle * -1, p)
      step.rotation.x = angle
      g.add(step)
    }
    scene.add(g)
    addCollider(colliders, x, z, 1.7, 6.7)
  }
  addEscalator(-28, -13, 'up')
  addEscalator(28, 13, 'down')

  // ------------------------------------------------------------- props
  function addBench(x, z, ry) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.rotation.y = ry
    for (let i = 0; i < 4; i++) addBox(g, woodMat, 2.8, 0.09, 0.16, 0, 0.55, -0.28 + i * 0.2, 0, true)
    for (let i = 0; i < 3; i++) addBox(g, woodMat, 2.8, 0.14, 0.09, 0, 0.85 + i * 0.18, 0.42, 0, true)
    addBox(g, railMat, 0.08, 0.55, 0.8, -1.2, 0.28, 0.05, 0, true)
    addBox(g, railMat, 0.08, 0.55, 0.8, 1.2, 0.28, 0.05, 0, true)
    scene.add(g)
    addCollider(colliders, x, z, 1.6, 0.7)
  }
  addBench(-11, 6, 0.1)
  addBench(11, 6, -0.1)
  addBench(-11, -17, Math.PI)
  addBench(11, -17, Math.PI)
  addBench(-23, 22, Math.PI / 2)
  addBench(23, -22, -Math.PI / 2)

  function addPlanter(x, z, scale = 1) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.9, 0.95, 14), concreteMat)
    pot.position.y = 0.48
    pot.castShadow = true
    pot.receiveShadow = true
    g.add(pot)
    const dirt = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.03, 0.06, 14), new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 1 }))
    dirt.position.y = 0.96
    g.add(dirt)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 2.4 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x5b4327, roughness: 0.9 }))
    trunk.position.y = 2.1 * scale
    trunk.rotation.z = 0.06
    trunk.castShadow = true
    g.add(trunk)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x24502f, roughness: 0.8, side: THREE.DoubleSide })
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5 * scale, 2.4 * scale, 4), leafMat)
      leaf.position.set(0, 3.2 * scale, 0)
      leaf.rotation.set(0.9, (i / 7) * Math.PI * 2, 0.3)
      leaf.rotation.z = 0.5
      g.add(leaf)
    }
    scene.add(g)
    addCircle(colliders, x, z, 1.25)
  }
  addPlanter(-21, -4)
  addPlanter(21, -4)
  addPlanter(-21, 16)
  addPlanter(21, 16)
  addPlanter(-7, 30)
  addPlanter(7, 30)
  addPlanter(-7, -32)
  addPlanter(7, -32)

  function addKiosk(x, z, name, color) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    addBox(g, darkMat, 4.6, 1.1, 2.2, 0, 0.55, 0, 0, true)
    addBox(g, metalMat, 4.8, 0.12, 2.4, 0, 1.16, 0, 0, true)
    const tex = makeSignTexture(name, 'KIOSK · OPEN LATE', color)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.0), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }))
    sign.position.set(0, 2.6, 0.3)
    g.add(sign)
    addBox(g, railMat, 0.1, 2.2, 0.1, -2.1, 2.2, 0.9, 0, false)
    addBox(g, railMat, 0.1, 2.2, 0.1, 2.1, 2.2, 0.9, 0, false)
    addBox(g, railMat, 4.3, 0.12, 0.12, 0, 3.3, 0.9, 0, false)
    scene.add(g)
    addCollider(colliders, x, z, 2.4, 1.2)
  }
  addKiosk(-11, 19, 'PRETZEL', '#ffb454')
  addKiosk(12, -27, 'PHONE FIX', '#5fe6ff')

  function addVending(x, z, ry) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.rotation.y = ry
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.1, 0.85), new THREE.MeshStandardMaterial({ color: 0x141a1f, roughness: 0.35, metalness: 0.7 }))
    body.position.y = 1.05
    body.castShadow = true
    g.add(body)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.9), new THREE.MeshBasicMaterial({ map: vendingTex, toneMapped: false }))
    face.position.set(0, 1.08, 0.435)
    g.add(face)
    scene.add(g)
    addCollider(colliders, x, z, 0.6, 0.5)
  }
  addVending(-16.5, 26, 0.2)
  addVending(16.5, 26, -0.2)
  addVending(-33, 12, Math.PI / 2)

  // food court tables
  for (const [x, z] of [[24, 8], [29, 6], [24, 0], [29, -2]]) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.09, 20), new THREE.MeshStandardMaterial({ color: 0x4a5359, roughness: 0.4, metalness: 0.6 }))
    top.position.y = 0.95
    top.castShadow = true
    g.add(top)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.95, 8), railMat)
    leg.position.y = 0.48
    g.add(leg)
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1 + 0.4
      const chair = addBox(g, darkMat, 0.55, 0.09, 0.55, Math.cos(a) * 1.45, 0.52, Math.sin(a) * 1.45, -a, true)
      addBox(g, darkMat, 0.55, 0.55, 0.08, Math.cos(a) * 1.72, 0.8, Math.sin(a) * 1.72, -a, true)
      chair.receiveShadow = true
    }
    scene.add(g)
    addCircle(colliders, x, z, 1.25)
  }

  // barricades near south entrance
  for (let i = 0; i < 4; i++) {
    const x = 8 + i * 2.6
    const b = addBox(scene, new THREE.MeshStandardMaterial({ color: [0x5a3b2a, 0x39444c, 0x4b3226][i % 3], roughness: 0.85 }), 2.3, 1.1, 0.65, x, 0.56, 38 + (i % 2) * 0.8, 0.08 * i, true)
    b.rotation.z = (i % 2 ? -1 : 1) * 0.02
    addCollider(colliders, x, 38 + (i % 2) * 0.8, 1.2, 0.4)
  }
  // scattered chairs
  for (let i = 0; i < 5; i++) {
    const a = rand() * Math.PI * 2, r = 6 + rand() * 20
    const c = addBox(scene, darkMat, 0.5, 0.08, 0.5, Math.cos(a) * r, 0.42, Math.sin(a) * r, rand() * 3, true)
    c.rotation.z = 0.12
  }

  // papers / debris
  const paperMat = new THREE.MeshStandardMaterial({ color: 0x8f948e, roughness: 0.9, side: THREE.DoubleSide })
  for (let i = 0; i < 40; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.25 + rand() * 0.3, 0.35 + rand() * 0.3), paperMat)
    p.rotation.x = -Math.PI / 2 + (rand() - 0.5) * 0.15
    p.position.set((rand() - 0.5) * 60, 0.025, (rand() - 0.5) * 76)
    p.rotation.z = rand() * Math.PI
    scene.add(p)
  }
  // blood stains
  const bloodMat = new THREE.MeshBasicMaterial({ color: 0x160302, transparent: true, opacity: 0.42, depthWrite: false })
  const bloodGeo = new THREE.CircleGeometry(1, 18)
  for (let i = 0; i < 14; i++) {
    const b = new THREE.Mesh(bloodGeo, bloodMat)
    b.rotation.x = -Math.PI / 2
    b.scale.set(0.3 + rand() * 0.6, 0.28 + rand() * 0.45, 1)
    b.position.set((rand() - 0.5) * 52, 0.018 + i * 0.0002, (rand() - 0.5) * 66)
    scene.add(b)
  }

  // exit signs above spawn doors
  for (const p of [
    [0, -45.2, 0], [-20, -45.2, 0], [20, -45.2, 0],
    [0, 45.2, Math.PI], [-20, 45.2, Math.PI], [20, 45.2, Math.PI],
    [-37.2, 0, Math.PI / 2], [37.2, 0, -Math.PI / 2],
    [-37.2, -26, Math.PI / 2], [37.2, 26, -Math.PI / 2]
  ]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ color: 0x7dffb0, toneMapped: false }))
    sign.position.set(p[0], 4.2, p[1])
    sign.rotation.y = p[2]
    scene.add(sign)
  }

  // ------------------------------------------------------------- lighting
  const ambient = new THREE.AmbientLight(0x7fa9c0, 0.5)
  scene.add(ambient)
  const hemi = new THREE.HemisphereLight(0x5d8aa8, 0x141a1e, 1.55)
  scene.add(hemi)

  const moon = new THREE.DirectionalLight(0xc9ddff, 2.6)
  moon.position.set(18, 32, 8)
  moon.castShadow = true
  moon.shadow.mapSize.set(2048, 2048)
  moon.shadow.camera.near = 2
  moon.shadow.camera.far = 90
  moon.shadow.camera.left = -52
  moon.shadow.camera.right = 52
  moon.shadow.camera.top = 52
  moon.shadow.camera.bottom = -52
  moon.shadow.bias = -0.0007
  moon.shadow.normalBias = 0.03
  scene.add(moon)
  scene.add(moon.target)

  const atrium = new THREE.SpotLight(0xd6ecff, 110, 46, 0.9, 0.5, 1.25)
  atrium.position.set(0, 11, 0)
  atrium.target.position.set(0, 0, -2)
  scene.add(atrium)
  scene.add(atrium.target)

  const emergency = new THREE.PointLight(0xff2a18, 7, 24, 2)
  emergency.position.set(0, 7, 34)
  scene.add(emergency)
  flickers.push({ light: emergency, base: 7, phase: 1.4, speed: 0.9, chance: 0.004 })
  const emergency2 = new THREE.PointLight(0xff2a18, 5, 20, 2)
  emergency2.position.set(-30, 6, -28)
  scene.add(emergency2)
  flickers.push({ light: emergency2, base: 5, phase: 3.1, speed: 1.2, chance: 0.003 })

  for (const [x, z, col] of [[-27, -38, 0xffb454], [27, 38, 0xc47bff]]) {
    const pl = new THREE.PointLight(col, 22, 30, 2)
    pl.position.set(x, 4.4, z)
    scene.add(pl)
  }

  // floor guide lights
  for (let i = -8; i <= 8; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 1.6), i % 2 ? neonAmber : neonCyan)
    strip.position.set(i * 3.6, 0.03, -38)
    scene.add(strip)
    const strip2 = strip.clone()
    strip2.position.z = 38
    scene.add(strip2)
  }

  // ------------------------------------------------------------- ambient dust
  const dustCount = 260
  const dustPos = new Float32Array(dustCount * 3)
  const dustSeed = []
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (rand() - 0.5) * 66
    dustPos[i * 3 + 1] = 0.5 + rand() * 9
    dustPos[i * 3 + 2] = (rand() - 0.5) * 80
    dustSeed.push(rand() * Math.PI * 2)
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xbdd8e6, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
  scene.add(dust)

  // ------------------------------------------------------------- spawn points
  const spawnPoints = [
    { x: 0, z: -41.5, name: 'NORTH ATRIUM' },
    { x: -20, z: -41.5, name: 'CINEMA CORRIDOR' },
    { x: 20, z: -41.5, name: 'EAST CONCOURSE' },
    { x: 0, z: 41.5, name: 'SOUTH ENTRANCE' },
    { x: -20, z: 41.5, name: 'FOOD COURT' },
    { x: 20, z: 41.5, name: 'SPORTS WING' },
    { x: -32, z: 0, name: 'WEST GALLERY' },
    { x: 32, z: 0, name: 'EAST GALLERY' },
    { x: -32, z: -26, name: 'SERVICE HALL' },
    { x: 32, z: 26, name: 'PARKING LINK' },
    { x: -12, z: 7, name: 'WEST ARCADE' },
    { x: 12, z: 7, name: 'EAST ARCADE' },
    { x: -12, z: -7, name: 'WEST ATRIUM' },
    { x: 12, z: -7, name: 'EAST ATRIUM' },
    { x: 0, z: -16, name: 'NORTH ATRIUM' }
  ]

  function update(dt, t) {
    for (const fn of animated) fn(t, dt)
    for (const f of flickers) {
      const n = Math.sin(t * f.speed * 14 + f.phase) * Math.sin(t * 2.3 + f.phase * 2)
      const flick = n > 0.86 ? 0.18 : 1
      if (f.light) f.light.intensity = f.base * (0.85 + 0.15 * Math.sin(t * 0.7 + f.phase)) * flick
      if (f.mat) {
        const m = 0.9 + 0.1 * Math.sin(t * 1.3 + f.phase)
        if (!f.mat.userData.baseOpacity) f.mat.userData.baseOpacity = f.mat.opacity ?? 1
        f.mat.opacity = f.mat.userData.baseOpacity * m * (n > 0.9 ? 0.4 : 1)
      }
    }
    // dust drift
    const pos = dustGeo.attributes.position.array
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3 + 1] += dt * (0.05 + (i % 5) * 0.012)
      pos[i * 3] += Math.sin(t * 0.2 + dustSeed[i]) * dt * 0.05
      if (pos[i * 3 + 1] > 10.2) pos[i * 3 + 1] = 0.3
    }
    dustGeo.attributes.position.needsUpdate = true
    dust.material.opacity = 0.35 + Math.sin(t * 0.6) * 0.12
  }

  return { colliders, bounds: BOUNDS, spawnPoints, storeRects, update, lights, moon }
}

export function resolveCollisions(pos, radius, colliders, bounds) {
  for (const c of colliders) {
    if (c.type === 'circle') {
      const dx = pos.x - c.x, dz = pos.z - c.z
      const dist = Math.hypot(dx, dz)
      const min = c.r + radius
      if (dist < min && dist > 1e-5) {
        const push = (min - dist)
        pos.x += (dx / dist) * push
        pos.z += (dz / dist) * push
      }
    } else {
      const nx = Math.max(c.x - c.hw, Math.min(pos.x, c.x + c.hw))
      const nz = Math.max(c.z - c.hd, Math.min(pos.z, c.z + c.hd))
      const dx = pos.x - nx, dz = pos.z - nz
      const dist = Math.hypot(dx, dz)
      if (dist < radius) {
        if (dist > 1e-5) {
          const push = radius - dist
          pos.x += (dx / dist) * push
          pos.z += (dz / dist) * push
        } else {
          const pl = pos.x - (c.x - c.hw)
          const pr = (c.x + c.hw) - pos.x
          const pt = pos.z - (c.z - c.hd)
          const pb = (c.z + c.hd) - pos.z
          const m = Math.min(pl, pr, pt, pb)
          if (m === pl) pos.x = c.x - c.hw - radius
          else if (m === pr) pos.x = c.x + c.hw + radius
          else if (m === pt) pos.z = c.z - c.hd - radius
          else pos.z = c.z + c.hd + radius
        }
      }
    }
  }
  if (bounds) {
    pos.x = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, pos.x))
    pos.z = Math.max(bounds.minZ + radius, Math.min(bounds.maxZ - radius, pos.z))
  }
}
