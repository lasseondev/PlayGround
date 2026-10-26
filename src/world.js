import * as THREE from 'three'
import {
  makeCanvas,
  canvasTexture,
  makeWindowTextures,
  makeSignTexture,
  rand,
  randInt,
  choice,
  clamp
} from './utils.js'

export const CITY = {
  GRID: 6,
  CELL: 72,
  BLOCK: 56,
  ROAD: 16,
  HALF: 216
}
CITY.ROAD_COORDS = Array.from({ length: CITY.GRID + 1 }, (_, i) => -CITY.HALF + i * CITY.CELL)
CITY.BOUND = CITY.HALF + CITY.ROAD / 2 + 10

function scaleBoxUV(geometry, w, h, d) {
  const uv = geometry.attributes.uv
  const reps = [
    [d / 9, h / 17],
    [d / 9, h / 17],
    [w / 9, d / 9],
    [w / 9, d / 9],
    [w / 9, h / 17],
    [w / 9, h / 17]
  ]
  for (let f = 0; f < 6; f++) {
    const ru = reps[f][0]
    const rv = reps[f][1]
    for (let i = 0; i < 4; i++) {
      const idx = f * 4 + i
      uv.setXY(idx, uv.getX(idx) * ru, uv.getY(idx) * rv)
    }
  }
  uv.needsUpdate = true
}

function makeAsphaltTexture() {
  const canvas = makeCanvas(256, 256)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#2b2c33'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 9000; i++) {
    const v = randInt(30, 72)
    ctx.fillStyle = `rgba(${v},${v},${v + 4},${rand(0.05, 0.22)})`
    ctx.fillRect(Math.random() * 256, Math.random() * 256, rand(1, 2.4), rand(1, 2.4))
  }
  const tex = canvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 26)
  return tex
}

function makeSidewalkTexture() {
  const canvas = makeCanvas(256, 256)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#6d6a70'
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = 'rgba(30,30,36,0.42)'
  ctx.lineWidth = 3
  for (let i = 0; i <= 4; i++) {
    const p = i * 64
    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, 256)
    ctx.moveTo(0, p)
    ctx.lineTo(256, p)
    ctx.stroke()
  }
  for (let i = 0; i < 2500; i++) {
    const v = randInt(70, 120)
    ctx.fillStyle = `rgba(${v},${v},${v},${rand(0.03, 0.1)})`
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
  }
  const tex = canvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

function makeStorefrontTexture(name, color, accent) {
  const canvas = makeCanvas(512, 160)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0a0c12'
  ctx.fillRect(0, 0, 512, 160)
  const panels = 4
  for (let i = 0; i < panels; i++) {
    const x = 14 + i * 124
    const grad = ctx.createLinearGradient(0, 20, 0, 138)
    grad.addColorStop(0, i % 2 === 0 ? color : accent)
    grad.addColorStop(1, 'rgba(20,18,26,0.95)')
    ctx.fillStyle = grad
    ctx.globalAlpha = 0.72
    ctx.fillRect(x, 18, 100, 122)
    ctx.globalAlpha = 1
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 5
    ctx.strokeRect(x, 18, 100, 122)
  }
  ctx.fillStyle = 'rgba(8,9,14,0.9)'
  ctx.fillRect(0, 0, 512, 18)
  ctx.font = '900 44px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.fillText(name, 256, 146)
  ctx.shadowBlur = 0
  const tex = canvasTexture(canvas)
  return tex
}

export function buildWorld(scene) {
  const root = new THREE.Group()
  root.name = 'city'
  scene.add(root)

  const colliders = []
  const cashSpots = []
  const roadCoords = CITY.ROAD_COORDS
  const { HALF, BLOCK, ROAD, GRID, CELL } = CITY

  const asphaltTex = makeAsphaltTexture()
  const sidewalkTex = makeSidewalkTexture()

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2200, 2200),
    new THREE.MeshStandardMaterial({ color: 0x0b0c11, roughness: 0.98 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.03
  ground.receiveShadow = true
  root.add(ground)

  const asphaltMat = new THREE.MeshStandardMaterial({
    map: asphaltTex,
    color: 0xd6d6de,
    roughness: 0.88,
    metalness: 0.05
  })
  const roadLen = HALF * 2 + ROAD
  for (const c of roadCoords) {
    const alongZ = new THREE.Mesh(new THREE.BoxGeometry(ROAD, 0.12, roadLen), asphaltMat)
    alongZ.position.set(c, 0.04, 0)
    alongZ.receiveShadow = true
    root.add(alongZ)

    const alongX = new THREE.Mesh(new THREE.BoxGeometry(roadLen, 0.12, ROAD), asphaltMat)
    alongX.position.set(0, 0.045, c)
    alongX.receiveShadow = true
    root.add(alongX)
  }

  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    color: 0xb9b5bd,
    roughness: 0.94
  })
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const bx = -HALF + (i + 0.5) * CELL
      const bz = -HALF + (j + 0.5) * CELL
      const slab = new THREE.Mesh(new THREE.BoxGeometry(BLOCK, 0.24, BLOCK), sidewalkMat)
      slab.position.set(bx, 0.1, bz)
      slab.receiveShadow = true
      root.add(slab)
    }
  }

  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xffc44d,
    emissive: 0xffa51e,
    emissiveIntensity: 0.35,
    roughness: 0.6
  })
  const dashGeo = new THREE.BoxGeometry(0.2, 0.025, 3)
  const dashCount = (GRID + 1) * GRID * 10 * 2
  const dashes = new THREE.InstancedMesh(dashGeo, lineMat, dashCount)
  const dummy = new THREE.Object3D()
  let di = 0
  for (let r = 0; r <= GRID; r++) {
    const c = roadCoords[r]
    for (let s = 0; s < GRID; s++) {
      const z0 = roadCoords[s] + ROAD / 2
      const z1 = roadCoords[s + 1] - ROAD / 2
      const seg = z1 - z0
      const n = Math.max(1, Math.floor(seg / 7))
      for (let k = 0; k < n; k++) {
        dummy.position.set(c, 0.09, z0 + (k + 0.5) * (seg / n))
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        dashes.setMatrixAt(di++, dummy.matrix)

        dummy.position.set(z0 + (k + 0.5) * (seg / n), 0.09, c)
        dummy.rotation.set(0, Math.PI / 2, 0)
        dummy.updateMatrix()
        dashes.setMatrixAt(di++, dummy.matrix)
      }
    }
  }
  dashes.count = di
  dashes.receiveShadow = true
  root.add(dashes)

  const crossMat = new THREE.MeshStandardMaterial({ color: 0xd9d9df, roughness: 0.75 })
  const crossGeo = new THREE.BoxGeometry(0.55, 0.025, 2.5)
  const crosswalks = new THREE.InstancedMesh(crossGeo, crossMat, 49 * 4 * 6)
  let ci = 0
  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const cx = roadCoords[i]
      const cz = roadCoords[j]
      for (const side of [-1, 1]) {
        for (let k = 0; k < 6; k++) {
          const off = -6 + k * 2.4
          dummy.position.set(cx + off, 0.085, cz + side * (ROAD / 2 + 1.8))
          dummy.rotation.set(0, 0, 0)
          dummy.scale.set(1, 1, 1)
          dummy.updateMatrix()
          crosswalks.setMatrixAt(ci++, dummy.matrix)

          dummy.position.set(cx + side * (ROAD / 2 + 1.8), 0.085, cz + off)
          dummy.rotation.set(0, Math.PI / 2, 0)
          dummy.updateMatrix()
          crosswalks.setMatrixAt(ci++, dummy.matrix)
        }
      }
    }
  }
  crosswalks.count = ci
  root.add(crosswalks)

  const windowSets = [
    makeWindowTextures('#222c3a', '#ffd48a', '#a6d8ff'),
    makeWindowTextures('#5a4038', '#ffcf87', '#9fd0ff'),
    makeWindowTextures('#3b3f45', '#ffe0a3', '#b6e0ff')
  ]
  const buildingMats = windowSets.map((set) => {
    return new THREE.MeshStandardMaterial({
      map: set.map,
      emissiveMap: set.emissive,
      emissive: 0xffffff,
      emissiveIntensity: 0.55,
      roughness: 0.72,
      metalness: 0.2
    })
  })
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x24262d, roughness: 0.9 })
  const acMat = new THREE.MeshStandardMaterial({ color: 0x4d515a, roughness: 0.8, metalness: 0.3 })
  const antennaMat = new THREE.MeshStandardMaterial({ color: 0x9aa1ad, roughness: 0.4, metalness: 0.8 })
  const awningMats = [0xb5374a, 0x2d7a6b, 0xc4782a, 0x3c4f9a].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 })
  )
  const signTextures = [
    makeSignTexture('NEON', '#ff4d9d', '#59e6ff'),
    makeSignTexture('SUNSET', '#ffb347', '#ff4d6d'),
    makeSignTexture('MOTEL', '#59e6ff', '#ff4d9d'),
    makeSignTexture('24/7', '#7dff9a', '#59e6ff'),
    makeSignTexture('PIZZA', '#ffd447', '#ff5a36'),
    makeSignTexture('ARCADE', '#c07dff', '#59e6ff')
  ]
  const storefronts = [
    makeStorefrontTexture('CAFE', '#ffb35c', '#ff5d73'),
    makeStorefrontTexture('LIQUOR', '#7dffb0', '#57e3ff'),
    makeStorefrontTexture('NOODLES', '#ffd75e', '#ff6b4a'),
    makeStorefrontTexture('TATTOO', '#c07dff', '#ff5d9e'),
    makeStorefrontTexture('OPEN 24H', '#57e3ff', '#ffd75e')
  ]

  const acGeo = new THREE.BoxGeometry(1.6, 0.8, 1.2)
  const antennaGeo = new THREE.CylinderGeometry(0.05, 0.07, 6, 6)
  const roofGeoCache = new Map()

  function addBuilding(bx, bz, w, d, h, variant) {
    const geo = new THREE.BoxGeometry(w, h, d)
    scaleBoxUV(geo, w, h, d)
    const mesh = new THREE.Mesh(geo, buildingMats[variant])
    mesh.position.set(bx, 0.22 + h / 2, bz)
    mesh.castShadow = true
    mesh.receiveShadow = true
    root.add(mesh)

    const key = `${w.toFixed(1)}x${d.toFixed(1)}`
    let roofGeo = roofGeoCache.get(key)
    if (!roofGeo) {
      roofGeo = new THREE.BoxGeometry(w + 0.35, 0.55, d + 0.35)
      roofGeoCache.set(key, roofGeo)
    }
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.position.set(bx, 0.22 + h + 0.22, bz)
    roof.castShadow = true
    root.add(roof)

    if (h > 26 && Math.random() < 0.7) {
      const ac = new THREE.Mesh(acGeo, acMat)
      ac.position.set(bx + rand(-w * 0.2, w * 0.2), 0.22 + h + 0.9, bz + rand(-d * 0.2, d * 0.2))
      ac.castShadow = true
      root.add(ac)
    }
    if (h > 44 && Math.random() < 0.6) {
      const ant = new THREE.Mesh(antennaGeo, antennaMat)
      ant.position.set(bx + rand(-w * 0.15, w * 0.15), 0.22 + h + 3.2, bz + rand(-d * 0.15, d * 0.15))
      root.add(ant)
    }
    if (Math.random() < 0.42) {
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(8.4, 2.6),
        new THREE.MeshBasicMaterial({
          map: choice(signTextures),
          transparent: true,
          toneMapped: false,
          side: THREE.DoubleSide
        })
      )
      const side = randInt(0, 3)
      const y = Math.min(0.22 + h * 0.62, 0.22 + h - 3)
      if (side === 0) {
        sign.position.set(bx, y, bz + d / 2 + 0.08)
        sign.rotation.y = 0
      } else if (side === 1) {
        sign.position.set(bx, y, bz - d / 2 - 0.08)
        sign.rotation.y = Math.PI
      } else if (side === 2) {
        sign.position.set(bx + w / 2 + 0.08, y, bz)
        sign.rotation.y = Math.PI / 2
      } else {
        sign.position.set(bx - w / 2 - 0.08, y, bz)
        sign.rotation.y = -Math.PI / 2
      }
      root.add(sign)
    }
    if (Math.random() < 0.55) {
      const awning = new THREE.Mesh(new THREE.BoxGeometry(w * 0.56, 0.14, 1.1), choice(awningMats))
      const side = randInt(0, 3)
      const y = 3.05
      if (side === 0) {
        awning.position.set(bx, y, bz + d / 2 + 0.55)
      } else if (side === 1) {
        awning.position.set(bx, y, bz - d / 2 - 0.55)
      } else if (side === 2) {
        awning.position.set(bx + w / 2 + 0.55, y, bz)
        awning.rotation.y = Math.PI / 2
      } else {
        awning.position.set(bx - w / 2 - 0.55, y, bz)
        awning.rotation.y = Math.PI / 2
      }
      awning.castShadow = true
      root.add(awning)
    }

    if (Math.random() < 0.68) {
      const side = randInt(0, 3)
      const width = side < 2 ? w : d
      const shopTex = choice(storefronts)
      const shop = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.82, 2.5),
        new THREE.MeshStandardMaterial({
          map: shopTex,
          emissiveMap: shopTex,
          emissive: 0xffffff,
          emissiveIntensity: 0.9,
          roughness: 0.55,
          metalness: 0.05
        })
      )
      shop.position.y = 1.72
      if (side === 0) {
        shop.position.set(bx, 1.72, bz + d / 2 + 0.07)
      } else if (side === 1) {
        shop.position.set(bx, 1.72, bz - d / 2 - 0.07)
        shop.rotation.y = Math.PI
      } else if (side === 2) {
        shop.position.set(bx + w / 2 + 0.07, 1.72, bz)
        shop.rotation.y = Math.PI / 2
      } else {
        shop.position.set(bx - w / 2 - 0.07, 1.72, bz)
        shop.rotation.y = -Math.PI / 2
      }
      root.add(shop)
    }

    colliders.push({
      minX: bx - w / 2,
      maxX: bx + w / 2,
      minZ: bz - d / 2,
      maxZ: bz + d / 2,
      height: 0.22 + h
    })
  }

  const treeSpots = []
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const bx = -HALF + (i + 0.5) * CELL
      const bz = -HALF + (j + 0.5) * CELL
      const isPark = i === 2 && j === 2
      if (isPark) {
        buildPark(root, bx, bz, colliders, treeSpots)
        cashSpots.push(new THREE.Vector3(bx + 24, 0.6, bz + 26.6))
        cashSpots.push(new THREE.Vector3(bx - 24, 0.6, bz - 26.6))
        continue
      }
      const central = 1 - Math.min(1, Math.hypot(bx, bz) / (HALF * 0.95))
      const pattern = Math.random()
      if (pattern < 0.2 && central > 0.25) {
        const w = rand(34, 44)
        const d = rand(34, 44)
        const h = rand(34, 78) * (0.55 + central * 0.9)
        addBuilding(bx + rand(-2, 2), bz + rand(-2, 2), w, d, h, randInt(0, 2))
      } else if (pattern < 0.62) {
        const alongX = Math.random() < 0.5
        const w = alongX ? rand(40, 45) : rand(20, 24)
        const d = alongX ? rand(20, 24) : rand(40, 45)
        const h1 = rand(12, 46) * (0.65 + central * 0.75)
        const h2 = rand(12, 52) * (0.65 + central * 0.75)
        if (alongX) {
          addBuilding(bx, bz - d / 2 - 1.6, w, d, h1, randInt(0, 2))
          addBuilding(bx, bz + d / 2 + 1.6, w, d, h2, randInt(0, 2))
        } else {
          addBuilding(bx - w / 2 - 1.6, bz, w, d, h1, randInt(0, 2))
          addBuilding(bx + w / 2 + 1.6, bz, w, d, h2, randInt(0, 2))
        }
      } else {
        const hBase = rand(10, 34) * (0.7 + central * 0.7)
        const sizes = [
          [-12.3, -12.3],
          [12.3, -12.3],
          [-12.3, 12.3],
          [12.3, 12.3]
        ]
        for (const [ox, oz] of sizes) {
          addBuilding(
            bx + ox,
            bz + oz,
            rand(19, 22),
            rand(19, 22),
            hBase * rand(0.75, 1.4),
            randInt(0, 2)
          )
        }
      }

      for (let s = 0; s < 2; s++) {
        const side = randInt(0, 3)
        const t = rand(-20, 20)
        if (side === 0) treeSpots.push([bx + t, bz + BLOCK / 2 - 2.2])
        else if (side === 1) treeSpots.push([bx + t, bz - BLOCK / 2 + 2.2])
        else if (side === 2) treeSpots.push([bx + BLOCK / 2 - 2.2, bz + t])
        else treeSpots.push([bx - BLOCK / 2 + 2.2, bz + t])
      }
      if (Math.random() < 0.7) {
        const side = randInt(0, 3)
        const off = rand(-18, 18)
        if (side === 0) cashSpots.push(new THREE.Vector3(bx + off, 0.6, bz + 26.6))
        else if (side === 1) cashSpots.push(new THREE.Vector3(bx + off, 0.6, bz - 26.6))
        else if (side === 2) cashSpots.push(new THREE.Vector3(bx + 26.6, 0.6, bz + off))
        else cashSpots.push(new THREE.Vector3(bx - 26.6, 0.6, bz + off))
      }
    }
  }

  const streetLights = addStreetLights(root)
  addTrees(root, treeSpots)
  addDistantSkyline(root)
  addBoundary(colliders)

  return {
    root,
    colliders,
    cashSpots,
    roadCoords,
    streetLights,
    city: CITY
  }
}

function buildPark(root, bx, bz, colliders, treeSpots) {
  const grass = new THREE.Mesh(
    new THREE.BoxGeometry(CITY.BLOCK - 2, 0.2, CITY.BLOCK - 2),
    new THREE.MeshStandardMaterial({ color: 0x2f5c38, roughness: 1 })
  )
  grass.position.set(bx, 0.25, bz)
  grass.receiveShadow = true
  root.add(grass)

  const pathMat = new THREE.MeshStandardMaterial({ color: 0x8d7f6c, roughness: 0.95 })
  const pathA = new THREE.Mesh(new THREE.BoxGeometry(6, 0.06, CITY.BLOCK - 4), pathMat)
  pathA.position.set(bx, 0.36, bz)
  pathA.receiveShadow = true
  root.add(pathA)
  const pathB = new THREE.Mesh(new THREE.BoxGeometry(CITY.BLOCK - 4, 0.06, 6), pathMat)
  pathB.position.set(bx, 0.365, bz)
  pathB.receiveShadow = true
  root.add(pathB)

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9d968c, roughness: 0.85 })
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.6, 1.1, 24), stoneMat)
  basin.position.set(bx, 0.85, bz)
  basin.castShadow = true
  basin.receiveShadow = true
  root.add(basin)

  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(5.7, 5.7, 0.2, 24),
    new THREE.MeshStandardMaterial({
      color: 0x3fb6d9,
      emissive: 0x1b6f8c,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.4
    })
  )
  water.position.set(bx, 1.44, bz)
  root.add(water)

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 3.2, 12), stoneMat)
  pillar.position.set(bx, 2.4, bz)
  pillar.castShadow = true
  root.add(pillar)

  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 12),
    new THREE.MeshStandardMaterial({
      color: 0x8fe6ff,
      emissive: 0x2e9fc4,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3
    })
  )
  top.position.set(bx, 4.25, bz)
  root.add(top)

  colliders.push({ minX: bx - 6.6, maxX: bx + 6.6, minZ: bz - 6.6, maxZ: bz + 6.6, height: 5 })

  const benchMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.85 })
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    const r = 15
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.35, 1.1), benchMat)
    bench.position.set(bx + Math.cos(a) * r, 0.75, bz + Math.sin(a) * r)
    bench.rotation.y = -a + Math.PI / 2
    bench.castShadow = true
    bench.receiveShadow = true
    root.add(bench)
  }

  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + 0.3
    const r = rand(10, 22)
    treeSpots.push([bx + Math.cos(a) * r, bz + Math.sin(a) * r])
  }
}

function addStreetLights(root) {
  const { HALF, CELL, BLOCK, GRID } = CITY
  const positions = []
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const bx = -HALF + (i + 0.5) * CELL
      const bz = -HALF + (j + 0.5) * CELL
      const corners = [
        [bx + BLOCK / 2 - 1.4, bz + BLOCK / 2 - 1.4, 1, 1],
        [bx - BLOCK / 2 + 1.4, bz + BLOCK / 2 - 1.4, -1, 1],
        [bx + BLOCK / 2 - 1.4, bz - BLOCK / 2 + 1.4, 1, -1],
        [bx - BLOCK / 2 + 1.4, bz - BLOCK / 2 + 1.4, -1, -1]
      ]
      for (const c of corners) positions.push(c)
    }
  }

  const poleGeo = new THREE.CylinderGeometry(0.085, 0.12, 7, 7)
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2d3138, roughness: 0.55, metalness: 0.7 })
  const poles = new THREE.InstancedMesh(poleGeo, poleMat, positions.length)
  const armGeo = new THREE.BoxGeometry(0.12, 0.1, 1.5)
  const arms = new THREE.InstancedMesh(armGeo, poleMat, positions.length)
  const lampGeo = new THREE.BoxGeometry(0.5, 0.16, 0.3)
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xffd9a0,
    emissive: 0xffbe6b,
    emissiveIntensity: 3.2,
    roughness: 0.3
  })
  const lamps = new THREE.InstancedMesh(lampGeo, lampMat, positions.length)
  const d = new THREE.Object3D()
  positions.forEach((p, idx) => {
    const [x, z, sx, sz] = p
    const len = Math.hypot(sx, sz)
    const dx = sx / len
    const dz = sz / len
    d.position.set(x, 3.5, z)
    d.rotation.set(0, 0, 0)
    d.scale.set(1, 1, 1)
    d.updateMatrix()
    poles.setMatrixAt(idx, d.matrix)

    d.position.set(x + dx * 0.72, 6.9, z + dz * 0.72)
    d.rotation.set(0, Math.atan2(dx, dz), 0)
    d.updateMatrix()
    arms.setMatrixAt(idx, d.matrix)

    d.position.set(x + dx * 1.4, 6.86, z + dz * 1.4)
    d.rotation.set(0, Math.atan2(dx, dz), 0)
    d.updateMatrix()
    lamps.setMatrixAt(idx, d.matrix)
  })
  poles.castShadow = true
  arms.castShadow = true
  root.add(poles, arms, lamps)

  const glowCanvas = makeCanvas(64, 64)
  const gctx = glowCanvas.getContext('2d')
  const grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,214,150,0.95)')
  grad.addColorStop(0.28, 'rgba(255,180,90,0.45)')
  grad.addColorStop(1, 'rgba(255,150,60,0)')
  gctx.fillStyle = grad
  gctx.fillRect(0, 0, 64, 64)
  const glowTex = canvasTexture(glowCanvas)
  const glowPositions = new Float32Array(positions.length * 3)
  positions.forEach((p, idx) => {
    const [x, z, sx, sz] = p
    const len = Math.hypot(sx, sz)
    glowPositions[idx * 3] = x + (sx / len) * 1.4
    glowPositions[idx * 3 + 1] = 6.86
    glowPositions[idx * 3 + 2] = z + (sz / len) * 1.4
  })
  const glowGeo = new THREE.BufferGeometry()
  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
  const glow = new THREE.Points(
    glowGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      color: 0xffc27a,
      size: 3.4,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false
    })
  )
  root.add(glow)

  return positions
}

function addTrees(root, spots) {
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 3.2, 6)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4c3423, roughness: 0.95 })
  const leafGeo = new THREE.IcosahedronGeometry(1.85, 0)
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f6b3a, roughness: 0.92 })
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, spots.length)
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, spots.length)
  const d = new THREE.Object3D()
  const color = new THREE.Color()
  spots.forEach((p, idx) => {
    const s = rand(0.8, 1.35)
    d.position.set(p[0], 1.6 * s + 0.2, p[1])
    d.rotation.set(0, rand(0, Math.PI), 0)
    d.scale.set(s, s, s)
    d.updateMatrix()
    trunks.setMatrixAt(idx, d.matrix)

    d.position.set(p[0], 4.0 * s + 0.2, p[1])
    d.rotation.set(rand(0, 0.4), rand(0, Math.PI), rand(0, 0.4))
    d.scale.set(s * rand(0.85, 1.2), s * rand(0.9, 1.3), s * rand(0.85, 1.2))
    d.updateMatrix()
    leaves.setMatrixAt(idx, d.matrix)
    color.setHSL(rand(0.27, 0.36), rand(0.3, 0.5), rand(0.22, 0.34))
    leaves.setColorAt(idx, color)
  })
  if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true
  trunks.castShadow = true
  leaves.castShadow = true
  leaves.receiveShadow = true
  root.add(trunks, leaves)
}

function addDistantSkyline(root) {
  const count = 110
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshStandardMaterial({
    color: 0x141826,
    emissive: 0x131c30,
    emissiveIntensity: 0.5,
    roughness: 0.9,
    metalness: 0.1
  })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  const d = new THREE.Object3D()
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand(-0.04, 0.04)
    const r = rand(330, 640)
    const w = rand(18, 56)
    const dep = rand(18, 56)
    const h = rand(26, 150) * (r < 430 ? 1.2 : 1)
    d.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r)
    d.rotation.set(0, a, 0)
    d.scale.set(w, h, dep)
    d.updateMatrix()
    mesh.setMatrixAt(i, d.matrix)
  }
  mesh.castShadow = false
  mesh.receiveShadow = false
  root.add(mesh)
}

function addBoundary(colliders) {
  const b = CITY.BOUND
  const t = 40
  colliders.push({ minX: b, maxX: b + t, minZ: -2000, maxZ: 2000, height: 999 })
  colliders.push({ minX: -b - t, maxX: -b, minZ: -2000, maxZ: 2000, height: 999 })
  colliders.push({ minX: -2000, maxX: 2000, minZ: b, maxZ: b + t, height: 999 })
  colliders.push({ minX: -2000, maxX: 2000, minZ: -b - t, maxZ: -b, height: 999 })
}
