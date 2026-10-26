import * as THREE from 'three'
import { clamp, lerp, smoothstep, makeRng, canvasTexture, formatTime } from './util.js'

export const WORLD_RADIUS = 138
export const STORM_START_RADIUS = 132

const POI_DEFS = [
  { name: 'MOSSY MILL', sector: 'SECTOR 04', x: -58, z: -38, theme: 'pine' },
  { name: 'SUNSET SHORES', sector: 'SECTOR 07', x: 62, z: 38, theme: 'sunset' },
  { name: 'COBALT CROSSING', sector: 'SECTOR 02', x: 8, z: -72, theme: 'cobalt' },
  { name: 'PINE GROVE', sector: 'SECTOR 05', x: -62, z: 52, theme: 'pine' },
  { name: 'RUSTY RIDGE', sector: 'SECTOR 09', x: 72, z: -58, theme: 'rust' }
]

const THEMES = {
  pine: { wall: 0xe6dfc9, trim: 0x6d7b5b, roof: 0x4c6c5a, accent: 0x9dbf6c },
  sunset: { wall: 0xf1d9bd, trim: 0xd47a54, roof: 0x9a4d45, accent: 0xffbd73 },
  cobalt: { wall: 0xd7e2e8, trim: 0x4d728c, roof: 0x355d78, accent: 0x7cc7e8 },
  rust: { wall: 0xd8c6ad, trim: 0x8a5e45, roof: 0x724237, accent: 0xd68d5e }
}

function rawHeight(x, z) {
  const d = Math.hypot(x, z)
  const hills =
    Math.sin(x * 0.045) * Math.cos(z * 0.052) * 2.2 +
    Math.sin(x * 0.09 + z * 0.06) * 1.05 +
    Math.cos(z * 0.11 - x * 0.04) * 0.8
  const beach = 1 - smoothstep(102, 138, d)
  return (hills + 1.35) * beach - (1 - beach) * 5.2
}

function makeSkyTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#4f91d8')
    g.addColorStop(0.42, '#96c8ec')
    g.addColorStop(0.67, '#f1d9b8')
    g.addColorStop(1, '#f7bf8c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    const glow = ctx.createRadialGradient(w * 0.78, h * 0.3, 4, w * 0.78, h * 0.3, w * 0.45)
    glow.addColorStop(0, 'rgba(255,244,204,.95)')
    glow.addColorStop(0.14, 'rgba(255,218,156,.45)')
    glow.addColorStop(0.55, 'rgba(255,188,130,.12)')
    glow.addColorStop(1, 'rgba(255,188,130,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 0.12
    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = i % 2 ? '#ffffff' : '#ffd6a2'
      ctx.beginPath()
      ctx.ellipse(w * (0.1 + Math.random() * 0.8), h * (0.1 + Math.random() * 0.5), 20 + Math.random() * 80, 3 + Math.random() * 8, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function makeWaterTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#2b7daf'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 52; i++) {
      ctx.strokeStyle = `rgba(190,236,255,${0.05 + Math.random() * 0.13})`
      ctx.lineWidth = 1 + Math.random() * 2
      const y = Math.random() * h
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.06 + i) * 4)
      ctx.stroke()
    }
  }, { repeat: [28, 28] })
}

function makeCloudTexture(seed) {
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    let n = seed * 97 + 11
    const rand = () => { n = (n * 16807) % 2147483647; return n / 2147483647 }
    for (let i = 0; i < 22; i++) {
      const x = w * (0.14 + rand() * 0.72)
      const y = h * (0.44 + (rand() - 0.5) * 0.3)
      const rx = 26 + rand() * 68
      const ry = rx * (0.55 + rand() * 0.3)
      const g = ctx.createRadialGradient(x, y, 0, x, y, rx)
      g.addColorStop(0, 'rgba(255,255,255,.62)')
      g.addColorStop(0.5, 'rgba(255,255,255,.4)')
      g.addColorStop(0.82, 'rgba(255,255,255,.13)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(1, ry / rx)
      ctx.beginPath()
      ctx.arc(0, 0, rx, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  })
}

let lootBeamTexture = null
function getLootBeamTexture() {
  if (lootBeamTexture) return lootBeamTexture
  lootBeamTexture = canvasTexture(64, 256, (ctx, w, h) => {
    const v = ctx.createLinearGradient(0, 0, 0, h)
    v.addColorStop(0, 'rgba(255,228,150,0)')
    v.addColorStop(0.4, 'rgba(255,214,104,.45)')
    v.addColorStop(0.78, 'rgba(255,198,80,.7)')
    v.addColorStop(1, 'rgba(255,198,80,0)')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, w, h)
    const hgrad = ctx.createLinearGradient(0, 0, w, 0)
    hgrad.addColorStop(0, 'rgba(0,0,0,0)')
    hgrad.addColorStop(0.5, 'rgba(0,0,0,1)')
    hgrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = hgrad
    ctx.fillRect(0, 0, w, h)
  })
  return lootBeamTexture
}

function makePlankTexture(base, line) {
  return canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 21) {
      ctx.fillStyle = line
      ctx.fillRect(0, y, w, 2)
      ctx.fillStyle = 'rgba(0,0,0,.08)'
      ctx.fillRect(0, y + 2, w, 1)
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 9, 1)
    }
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = 'rgba(49,30,14,.22)'
      ctx.beginPath()
      ctx.arc(10 + Math.random() * (w - 20), 10 + Math.random() * (h - 20), 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, { repeat: [1, 1] })
}

function makeSignTexture(text, sub) {
  return canvasTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#3a2a19'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#c9a36c'
    ctx.lineWidth = 7
    ctx.strokeRect(8, 8, w - 16, h - 16)
    ctx.fillStyle = '#f5e4be'
    ctx.font = 'bold 52px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2 - 12)
    ctx.fillStyle = '#c8a46c'
    ctx.font = 'bold 17px Arial, sans-serif'
    ctx.fillText(sub, w / 2, h / 2 + 33)
  })
}

export class Storm {
  constructor(scene) {
    this.group = new THREE.Group()
    this.group.renderOrder = 4
    scene.add(this.group)
    this.radius = STORM_START_RADIUS
    this.center = new THREE.Vector2(0, 0)
    this.nextCenter = new THREE.Vector2(0, 0)
    this.nextRadius = 90
    this.phase = 0
    this.timer = 55
    this.shrinking = false
    this.wait = 55
    this.shrink = 14
    this.damage = 1.5
    this.finished = false
    this.phaseIndex = 0

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#34146d') },
        uColorB: { value: new THREE.Color('#b68cff') },
        uAlpha: { value: 0.72 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorld;
        void main() {
          vUv = uv;
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uAlpha;
        varying vec2 vUv;
        varying vec3 vWorld;
        void main() {
          float bands = sin(vUv.x * 190.0 + uTime * 2.2) * 0.5 + 0.5;
          float bands2 = sin(vUv.x * 73.0 - uTime * 1.4 + vUv.y * 4.0) * 0.5 + 0.5;
          float pulse = sin(vUv.y * 13.0 - uTime * 2.0) * 0.5 + 0.5;
          float edge = smoothstep(0.0, 0.16, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.y));
          float alpha = (0.06 + bands * 0.18 + bands2 * 0.16 + pulse * 0.05) * edge * uAlpha;
          vec3 color = mix(uColorA, uColorB, bands * 0.7 + bands2 * 0.3);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    this.wall = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 90, 96, 1, true), this.material)
    this.wall.position.y = 33
    this.wall.frustumCulled = false
    this.group.add(this.wall)
    this.phases = [
      { wait: 55, shrink: 15, factor: 0.68, damage: 1.5 },
      { wait: 45, shrink: 13, factor: 0.64, damage: 2.5 },
      { wait: 38, shrink: 12, factor: 0.58, damage: 4 },
      { wait: 32, shrink: 11, factor: 0.5, damage: 6.5 },
      { wait: 26, shrink: 12, factor: 0.42, damage: 9 }
    ]
  }

  reset() {
    this.center.set(0, 0)
    this.radius = STORM_START_RADIUS
    this.phaseIndex = 0
    this.phase = this.phases[0]
    this.wait = this.phase.wait
    this.shrink = this.phase.shrink
    this.timer = this.wait
    this.shrinking = false
    this.finished = false
    this.damage = this.phase.damage
    this.pickNext()
    this.updateVisuals()
  }

  pickNext() {
    const p = this.phases[this.phaseIndex]
    const nr = Math.max(10, this.radius * p.factor)
    const maxOffset = Math.max(0, this.radius - nr - 3)
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * maxOffset
    this.nextCenter.set(this.center.x + Math.cos(angle) * dist, this.center.y + Math.sin(angle) * dist)
    this.nextRadius = nr
  }

  update(dt) {
    this.material.uniforms.uTime.value += dt
    this.timer -= dt
    if (!this.finished) {
      if (!this.shrinking) {
        if (this.timer <= 0) {
          this.shrinking = true
          this.timer = this.shrink
          this._shrinkStart = this.center.clone()
          this._shrinkStartRadius = this.radius
        }
      } else {
        const t = clamp(1 - this.timer / this.shrink, 0, 1)
        const ease = t * t * (3 - 2 * t)
        this.center.lerpVectors(this._shrinkStart, this.nextCenter, ease)
        this.radius = lerp(this._shrinkStartRadius, this.nextRadius, ease)
        if (this.timer <= 0) {
          this.center.copy(this.nextCenter)
          this.radius = this.nextRadius
          this.shrinking = false
          this.phaseIndex++
          if (this.phaseIndex >= this.phases.length) {
            this.finished = true
            this.timer = 0
            this.damage = 12
            this.nextCenter.copy(this.center)
            this.nextRadius = this.radius
          } else {
            this.phase = this.phases[this.phaseIndex]
            this.wait = this.phase.wait
            this.shrink = this.phase.shrink
            this.timer = this.wait
            this.damage = this.phase.damage
            this.pickNext()
          }
        }
      }
    }
    this.updateVisuals()
  }

  updateVisuals() {
    this.group.position.set(this.center.x, 0, this.center.y)
    this.wall.scale.set(this.radius, 1, this.radius)
  }

  contains(x, z) {
    return Math.hypot(x - this.center.x, z - this.center.y) <= this.radius
  }

  distanceOutside(x, z) {
    return Math.max(0, Math.hypot(x - this.center.x, z - this.center.y) - this.radius)
  }

  get label() {
    if (this.finished) return 'FINAL STORM'
    return this.shrinking ? 'STORM CLOSING' : 'STORM SHRINKING IN'
  }
}

export class World {
  constructor(scene, game) {
    this.scene = scene
    this.game = game
    this.rng = makeRng(80421)
    this.colliders = []
    this.occluders = []
    this.staticTargets = []
    this.floors = []
    this.ramps = []
    this.trees = []
    this.rocks = []
    this.barrels = []
    this.chests = []
    this.pickups = []
    this.treeMeshes = []
    this.poiSigns = []
    this.elapsed = 0

    this.pois = POI_DEFS.map(p => ({ ...p, h: rawHeight(p.x, p.z) }))
    this.materials = this._createMaterials()
    this._buildSky()
    this._buildLights()
    this._buildTerrain()
    this._buildWater()
    this._buildClouds()
    this._buildBattleBus()
    this._buildTrees()
    this._buildRocks()
    this._buildPOIs()
    this._buildBarrels()
    this._buildChests()
    this._buildPickups()
    this.storm = new Storm(scene)
    this.storm.reset()
  }

  _createMaterials() {
    this.tex = {
      sky: makeSkyTexture(),
      water: makeWaterTexture(),
      wood: makePlankTexture('#9b6a3c', 'rgba(54,31,12,.55)'),
      bark: makePlankTexture('#693f27', 'rgba(34,17,8,.5)')
    }
    this.mats = {
      leaf1: new THREE.MeshStandardMaterial({ color: 0x4f8c46, roughness: 0.95, flatShading: true }),
      leaf2: new THREE.MeshStandardMaterial({ color: 0x3e763a, roughness: 0.95, flatShading: true }),
      leaf3: new THREE.MeshStandardMaterial({ color: 0x5fa04d, roughness: 0.95, flatShading: true }),
      trunk: new THREE.MeshStandardMaterial({ map: this.tex.bark, color: 0x8a5f3c, roughness: 1 }),
      rock: new THREE.MeshStandardMaterial({ color: 0x8a9297, roughness: 0.95, flatShading: true }),
      rockDark: new THREE.MeshStandardMaterial({ color: 0x6d777c, roughness: 1, flatShading: true }),
      metal: new THREE.MeshStandardMaterial({ color: 0xa96f45, roughness: 0.55, metalness: 0.55 }),
      chest: new THREE.MeshStandardMaterial({ color: 0xd9a72e, roughness: 0.45, metalness: 0.3, emissive: 0x2d1b00 }),
      chestTrim: new THREE.MeshStandardMaterial({ color: 0x5d3f18, roughness: 0.6, metalness: 0.2 }),
      window: new THREE.MeshStandardMaterial({ color: 0x24455a, roughness: 0.3, metalness: 0.2, emissive: 0x0b2637 }),
      glassGlow: new THREE.MeshStandardMaterial({ color: 0xffca78, emissive: 0xb66a16, emissiveIntensity: 0.85, roughness: 0.5 }),
      roofDark: new THREE.MeshStandardMaterial({ color: 0x4c4f52, roughness: 0.9 }),
      woodFloor: new THREE.MeshStandardMaterial({ map: this.tex.wood, color: 0xb98b59, roughness: 0.9 }),
      signPole: new THREE.MeshStandardMaterial({ color: 0x5b4329, roughness: 0.9 })
    }
    return this.mats
  }

  _buildSky() {
    const skyMat = new THREE.MeshBasicMaterial({ map: this.tex.sky, side: THREE.BackSide, fog: false, depthWrite: false })
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 20), skyMat)
    this.sky.renderOrder = -10
    this.scene.add(this.sky)

    const sunTex = canvasTexture(256, 256, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, 'rgba(255,251,224,1)')
      g.addColorStop(0.12, 'rgba(255,236,178,.9)')
      g.addColorStop(0.36, 'rgba(255,203,126,.25)')
      g.addColorStop(1, 'rgba(255,190,110,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    })
    this.sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }))
    this.sunSprite.scale.set(100, 100, 1)
    this.sunSprite.position.set(220, 150, -260)
    this.scene.add(this.sunSprite)
  }

  _buildLights() {
    this.hemi = new THREE.HemisphereLight(0xcbe8ff, 0x5d6f3f, 1.12)
    this.scene.add(this.hemi)
    this.ambient = new THREE.AmbientLight(0xd5e4f2, 0.22)
    this.scene.add(this.ambient)
    this.sun = new THREE.DirectionalLight(0xffe2b0, 2.35)
    this.sun.position.set(62, 105, 44)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.left = -82
    this.sun.shadow.camera.right = 82
    this.sun.shadow.camera.top = 82
    this.sun.shadow.camera.bottom = -82
    this.sun.shadow.camera.near = 2
    this.sun.shadow.camera.far = 260
    this.sun.shadow.bias = -0.0009
    this.sun.shadow.normalBias = 0.03
    this.scene.add(this.sun)
    this.sun.target.position.set(0, 0, 0)
    this.scene.add(this.sun.target)
    const fill = new THREE.DirectionalLight(0x85b8ff, 0.34)
    fill.position.set(-70, 50, -60)
    this.scene.add(fill)
  }

  _buildTerrain() {
    const size = 320
    const seg = 128
    const geo = new THREE.PlaneGeometry(size, size, seg, seg)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const grassA = new THREE.Color(0x5f9e4c)
    const grassB = new THREE.Color(0x78b45a)
    const grassDark = new THREE.Color(0x477c3e)
    const sand = new THREE.Color(0xd7c491)
    const wetSand = new THREE.Color(0xb6a271)
    const rock = new THREE.Color(0x8a8c7c)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = this.terrainHeight(x, z)
      pos.setY(i, y)
      const d = Math.hypot(x, z)
      const slopeNoise = Math.sin(x * 0.3 + z * 0.2) * Math.cos(z * 0.17) * 0.5 + 0.5
      if (y < -1.4) c.copy(wetSand)
      else if (d > 106 || y < 0.35) c.copy(sand)
      else if (y > 3.4) c.copy(rock).lerp(grassDark, 0.38)
      else {
        c.copy(grassA).lerp(grassB, slopeNoise * 0.7)
        if (slopeNoise < 0.34) c.lerp(grassDark, 0.4)
      }
      const tint = 0.92 + Math.random() * 0.14
      colors[i * 3] = c.r * tint
      colors[i * 3 + 1] = c.g * tint
      colors[i * 3 + 2] = c.b * tint
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.98, metalness: 0, flatShading: true })
    this.terrain = new THREE.Mesh(geo, mat)
    this.terrain.receiveShadow = true
    this.terrain.name = 'terrain'
    this.scene.add(this.terrain)
    this.staticTargets.push(this.terrain)
    this.occluders.push(this.terrain)

    const seabed = new THREE.Mesh(new THREE.CircleGeometry(280, 64), new THREE.MeshBasicMaterial({ color: 0x1b4f6c }))
    seabed.rotation.x = -Math.PI / 2
    seabed.position.y = -6.2
    this.scene.add(seabed)

    this.scene.fog = new THREE.FogExp2(0xb8d8ef, 0.0036)
  }

  _buildWater() {
    this.tex.water.wrapS = this.tex.water.wrapT = THREE.RepeatWrapping
    const mat = new THREE.MeshStandardMaterial({
      map: this.tex.water,
      color: 0x8fd2ec,
      transparent: true,
      opacity: 0.84,
      roughness: 0.18,
      metalness: 0.15,
      depthWrite: false
    })
    this.water = new THREE.Mesh(new THREE.PlaneGeometry(620, 620, 1, 1), mat)
    this.water.rotation.x = -Math.PI / 2
    this.water.position.y = -2.25
    this.scene.add(this.water)
  }

  _buildClouds() {
    const textures = [makeCloudTexture(1), makeCloudTexture(2), makeCloudTexture(3)]
    this.clouds = new THREE.Group()
    this.clouds.renderOrder = -2
    for (let i = 0; i < 26; i++) {
      const mat = new THREE.SpriteMaterial({
        map: textures[i % textures.length],
        transparent: true,
        opacity: this.rng.range(0.4, 0.66),
        depthWrite: false,
        fog: false,
        color: 0xffffff
      })
      const sprite = new THREE.Sprite(mat)
      const angle = this.rng.range(0, Math.PI * 2)
      const rad = this.rng.range(150, 380)
      sprite.position.set(Math.cos(angle) * rad, this.rng.range(100, 175), Math.sin(angle) * rad)
      const scale = this.rng.range(55, 135)
      sprite.scale.set(scale, scale * this.rng.range(0.4, 0.58), 1)
      mat.rotation = this.rng.range(-0.12, 0.12)
      this.clouds.add(sprite)
    }
    this.scene.add(this.clouds)
  }

  _buildBattleBus() {
    this.bus = new THREE.Group()
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a8bd4, roughness: 0.55, metalness: 0.2 })
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xf2c94a, roughness: 0.6 })
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x173b55, roughness: 0.25, metalness: 0.4 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(14, 5.4, 5.4), bodyMat)
    this.bus.add(body)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(14.1, 0.7, 5.5), trimMat)
    stripe.position.y = -1.4
    this.bus.add(stripe)
    for (let i = -2; i <= 2; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.35, 0.1), glassMat)
      win.position.set(i * 2.3, 1.1, 2.73)
      this.bus.add(win)
      const win2 = win.clone()
      win2.position.z = -2.73
      this.bus.add(win2)
    }
    const balloon = new THREE.Mesh(new THREE.SphereGeometry(8.5, 16, 12), new THREE.MeshStandardMaterial({ color: 0x7f6bd8, roughness: 0.7 }))
    balloon.scale.set(1, 0.72, 0.72)
    balloon.position.y = 17
    this.bus.add(balloon)
    const ropeMat = new THREE.LineBasicMaterial({ color: 0x334255 })
    for (const x of [-4.6, 0, 4.6]) {
      const rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 2.7, 0), new THREE.Vector3(x * 0.68, 11.5, 0)]), ropeMat)
      this.bus.add(rope)
    }
    const propeller = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 6.5), trimMat)
    propeller.position.set(0, -3.2, 0)
    this.bus.add(propeller)
    this.bus.position.set(40, 67, -40)
    this.bus.rotation.y = -0.8
    this.bus.rotation.z = 0.04
    this.scene.add(this.bus)
    this.busStart = this.bus.position.clone()
  }

  _buildTrees() {
    const count = 112
    const trunkGeo = new THREE.CylinderGeometry(0.23, 0.42, 2.6, 6)
    trunkGeo.translate(0, 1.3, 0)
    const c1 = new THREE.ConeGeometry(2.45, 3.2, 7)
    c1.translate(0, 3.5, 0)
    const c2 = new THREE.ConeGeometry(1.95, 2.8, 7)
    c2.translate(0, 5.15, 0)
    const c3 = new THREE.ConeGeometry(1.35, 2.4, 7)
    c3.translate(0, 6.75, 0)
    const trunk = new THREE.InstancedMesh(trunkGeo, this.mats.trunk, count)
    const layer1 = new THREE.InstancedMesh(c1, this.mats.leaf1, count)
    const layer2 = new THREE.InstancedMesh(c2, this.mats.leaf2, count)
    const layer3 = new THREE.InstancedMesh(c3, this.mats.leaf3, count)
    trunk.castShadow = true
    trunk.receiveShadow = true
    layer1.castShadow = true
    layer2.castShadow = true
    layer3.castShadow = true
    this.treeMeshes = [trunk, layer1, layer2, layer3]
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const p = new THREE.Vector3()
    const col = new THREE.Color()
    let idx = 0
    let tries = 0
    while (idx < count && tries < 4000) {
      tries++
      const a = this.rng.range(0, Math.PI * 2)
      const r = Math.sqrt(this.rng.next()) * 124
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (this.pois.some(p2 => Math.hypot(x - p2.x, z - p2.z) < 25)) continue
      if (Math.hypot(x, z) > 128) continue
      const y = this.terrainHeight(x, z)
      if (y < 0.2) continue
      const scale = this.rng.range(0.72, 1.55)
      const rot = this.rng.range(0, Math.PI * 2)
      p.set(x, y - 0.05, z)
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot)
      s.set(scale, scale * this.rng.range(0.9, 1.18), scale)
      m.compose(p, q, s)
      for (const mesh of this.treeMeshes) mesh.setMatrixAt(idx, m)
      col.setHSL(0.29 + this.rng.range(-0.05, 0.03), 0.36, 0.44 + this.rng.range(-0.08, 0.08))
      layer1.setColorAt(idx, col)
      col.offsetHSL(0.01, 0.02, 0.04)
      layer2.setColorAt(idx, col)
      col.offsetHSL(-0.01, 0, -0.02)
      layer3.setColorAt(idx, col)
      const tree = {
        index: idx, x, z, y, scale, alive: true, hp: 100 + scale * 40, maxHp: 100 + scale * 40,
        kind: 'tree', resource: 'wood', amount: 12, radius: 0.55 * scale
      }
      this.trees.push(tree)
      const half = 0.55 * scale
      this.addCollider(x - half, y, z - half, x + half, y + 2.6 * scale, z + half, tree, this.colliders)
      idx++
    }
    for (const mesh of this.treeMeshes) {
      mesh.count = idx
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      this.scene.add(mesh)
      this.staticTargets.push(mesh)
    }
  }

  _buildRocks() {
    const count = 58
    const geo = new THREE.DodecahedronGeometry(1, 0)
    this.rockMesh = new THREE.InstancedMesh(geo, this.mats.rock, count)
    this.rockMesh.castShadow = true
    this.rockMesh.receiveShadow = true
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const p = new THREE.Vector3()
    const col = new THREE.Color()
    let idx = 0
    let tries = 0
    while (idx < count && tries < 3000) {
      tries++
      const a = this.rng.range(0, Math.PI * 2)
      const r = Math.sqrt(this.rng.next()) * 123
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (this.pois.some(p2 => Math.hypot(x - p2.x, z - p2.z) < 19)) continue
      const y = this.terrainHeight(x, z)
      if (y < 0.15) continue
      const scale = this.rng.range(0.55, 1.9)
      p.set(x, y + scale * 0.34, z)
      q.setFromEuler(new THREE.Euler(this.rng.range(0, 3), this.rng.range(0, 3), this.rng.range(0, 3)))
      s.set(scale * this.rng.range(0.8, 1.4), scale * this.rng.range(0.55, 0.9), scale * this.rng.range(0.8, 1.4))
      m.compose(p, q, s)
      this.rockMesh.setMatrixAt(idx, m)
      col.setHSL(0.55, 0.04, 0.46 + this.rng.range(-0.08, 0.1))
      this.rockMesh.setColorAt(idx, col)
      const rock = {
        index: idx, x, z, y, scale, alive: true, hp: 130 + scale * 45, maxHp: 130 + scale * 45,
        kind: 'rock', resource: 'brick', amount: 14, radius: scale * 0.8
      }
      this.rocks.push(rock)
      const half = scale * 0.8
      this.addCollider(x - half, y, z - half, x + half, y + scale * 1.2, z + half, rock, this.colliders)
      idx++
    }
    this.rockMesh.count = idx
    this.rockMesh.instanceMatrix.needsUpdate = true
    if (this.rockMesh.instanceColor) this.rockMesh.instanceColor.needsUpdate = true
    this.scene.add(this.rockMesh)
    this.staticTargets.push(this.rockMesh)
  }

  _buildPOIs() {
    let chestIndex = 0
    for (let pi = 0; pi < this.pois.length; pi++) {
      const poi = this.pois[pi]
      const theme = THEMES[poi.theme]
      const layout = [
        { x: -10.5, z: -7.5, rot: 0 },
        { x: 10.5, z: 7.5, rot: Math.PI },
        { x: 12, z: -11, rot: -Math.PI / 2 }
      ]
      const houseCount = pi === 2 ? 3 : 2
      for (let hi = 0; hi < houseCount; hi++) {
        const l = layout[hi]
        const hx = poi.x + l.x
        const hz = poi.z + l.z
        const hy = this.terrainHeight(hx, hz)
        this._buildHouse(hx, hy, hz, l.rot, theme, pi, hi)
      }
      this._buildSign(poi, theme)
      const chestSpots = [
        { x: poi.x - 4.5, z: poi.z + 2, y: this.terrainHeight(poi.x - 4.5, poi.z + 2) },
        { x: poi.x + 4.2, z: poi.z - 3.2, y: this.terrainHeight(poi.x + 4.2, poi.z - 3.2) }
      ]
      for (const spot of chestSpots) {
        this.chests.push(this._makeChest(spot.x, spot.y, spot.z, chestIndex++))
      }
    }
  }

  _buildHouse(x, y, z, rot, theme, poiIndex, houseIndex) {
    const g = new THREE.Group()
    g.position.set(x, y, z)
    g.rotation.y = rot
    const wallMat = new THREE.MeshStandardMaterial({ color: theme.wall, roughness: 0.88, flatShading: true })
    const trimMat = new THREE.MeshStandardMaterial({ color: theme.trim, roughness: 0.85 })
    const roofMat = new THREE.MeshStandardMaterial({ color: theme.roof, roughness: 0.82, flatShading: true })
    const accentMat = new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.8 })
    const add = (geo, mat, px, py, pz, cast = true) => {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(px, py, pz)
      mesh.castShadow = cast
      mesh.receiveShadow = true
      g.add(mesh)
      return mesh
    }
    const W = 9
    const D = 8
    const H = 3.6
    const floorTop = 0.45
    const wallT = 0.26
    const wallH = H
    const wallY = floorTop + wallH / 2
    const wallMeshes = []
    const floorMesh = add(new THREE.BoxGeometry(W, 0.9, D), this.mats.woodFloor, 0, -0.05, 0, false)
    wallMeshes.push(add(new THREE.BoxGeometry(2.9, wallH, wallT), wallMat, -3.0, wallY, D / 2))
    wallMeshes.push(add(new THREE.BoxGeometry(2.9, wallH, wallT), wallMat, 3.0, wallY, D / 2))
    wallMeshes.push(add(new THREE.BoxGeometry(3.1, 1.15, wallT), wallMat, 0, floorTop + wallH - 0.575, D / 2))
    wallMeshes.push(add(new THREE.BoxGeometry(W, wallH, wallT), wallMat, 0, wallY, -D / 2))
    wallMeshes.push(add(new THREE.BoxGeometry(wallT, wallH, D), wallMat, -W / 2, wallY, 0))
    wallMeshes.push(add(new THREE.BoxGeometry(wallT, wallH, D), wallMat, W / 2, wallY, 0))
    add(new THREE.BoxGeometry(W + 0.8, 0.28, D + 0.8), trimMat, 0, 0.36, 0, false)
    const roof = add(new THREE.ConeGeometry(6.9, 3.1, 4), roofMat, 0, floorTop + wallH + 1.5, 0)
    roof.rotation.y = Math.PI / 4
    const roofCap = add(new THREE.CylinderGeometry(0.1, 0.2, 1.1, 6), accentMat, 0, floorTop + wallH + 3.15, 0)
    roofCap.castShadow = false
    add(new THREE.BoxGeometry(0.9, 3.2, 0.9), trimMat, 2.9, floorTop + H / 2 + 1.2, -1.8)
    add(new THREE.BoxGeometry(1.15, 0.24, 1.15), this.mats.roofDark, 2.9, floorTop + H + 2.85, -1.8)
    for (const side of [-1, 1]) {
      const win = add(new THREE.BoxGeometry(1.5, 1.35, 0.08), this.mats.window, -2.8, floorTop + 2.1, side * (D / 2 + 0.02))
      win.castShadow = false
      const glow = add(new THREE.BoxGeometry(0.55, 0.55, 0.05), this.mats.glassGlow, -2.1, floorTop + 2.0, side * (D / 2 + 0.09))
      glow.castShadow = false
      const winSide = add(new THREE.BoxGeometry(0.08, 1.35, 1.55), this.mats.window, side * (W / 2 + 0.02), floorTop + 2.1, 1.4)
      winSide.castShadow = false
    }
    const doorPivot = new THREE.Group()
    doorPivot.position.set(-1.15, floorTop, D / 2 + 0.01)
    doorPivot.rotation.y = -1.75
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.25, 0.1), trimMat)
    doorMesh.position.set(1.15, 1.125, 0)
    doorMesh.castShadow = true
    doorPivot.add(doorMesh)
    g.add(doorPivot)
    const porch = add(new THREE.BoxGeometry(4.6, 0.22, 1.9), this.mats.woodFloor, 0, 0.34, D / 2 + 1.0, false)
    porch.receiveShadow = true
    add(new THREE.BoxGeometry(4.6, 2.7, 0.24), trimMat, 0, 1.75, D / 2 + 1.9)
    add(new THREE.BoxGeometry(5.2, 0.2, 2.3), roofMat, 0, 3.25, D / 2 + 1.0)
    const crateGeo = new THREE.BoxGeometry(1.15, 1.15, 1.15)
    for (let i = 0; i < 2; i++) {
      const crate = add(crateGeo, accentMat, -3.0 + i * 1.3, floorTop + 0.575, -2.3)
      crate.rotation.y = 0.2 * i
      wallMeshes.push(crate)
    }
    const table = add(new THREE.BoxGeometry(2.0, 0.18, 1.1), this.mats.woodFloor, 2.1, floorTop + 1.0, 0.7)
    table.castShadow = true
    this.occluders.push(table)
    add(new THREE.BoxGeometry(0.16, 1.0, 0.16), trimMat, 1.3, floorTop + 0.5, 0.2)
    add(new THREE.BoxGeometry(0.16, 1.0, 0.16), trimMat, 2.9, floorTop + 0.5, 0.2)
    add(new THREE.BoxGeometry(3.4, 0.03, 2.4), accentMat, 0, floorTop + 0.02, 1.7, false)

    this.scene.add(g)
    g.updateMatrixWorld(true)

    for (const mesh of g.children) {
      if (mesh.isMesh) {
        this.staticTargets.push(mesh)
        if (mesh.geometry.parameters && mesh.geometry.parameters.height > 0.3 && mesh.geometry.parameters.depth > 0.2) this.occluders.push(mesh)
      }
    }
    for (const mesh of wallMeshes) {
      const box = new THREE.Box3().setFromObject(mesh)
      this.addCollider(box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z, { kind: 'house' }, this.colliders)
    }
    const floorBox = new THREE.Box3().setFromObject(floorMesh)
    const porchBox = new THREE.Box3().setFromObject(porch)
    this.floors.push({ minX: floorBox.min.x, maxX: floorBox.max.x, minZ: floorBox.min.z, maxZ: floorBox.max.z, top: floorBox.max.y })
    this.floors.push({ minX: porchBox.min.x, maxX: porchBox.max.x, minZ: porchBox.min.z, maxZ: porchBox.max.z, top: porchBox.max.y })

    const chestLocal = [
      { x: 1.9, z: -2.5 },
      { x: -2.4, z: 2.0 }
    ][houseIndex % 2]
    const wx = x + Math.cos(rot) * chestLocal.x + Math.sin(rot) * chestLocal.z
    const wz = z - Math.sin(rot) * chestLocal.x + Math.cos(rot) * chestLocal.z
    const chest = this._makeChest(wx, y + floorTop + 0.02, wz, this.chests.length)
    chest.income = true
    this.chests.push(chest)
  }

  _buildSign(poi, theme) {
    const tex = makeSignTexture(poi.name, poi.sector)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 3.6, 6), this.mats.signPole)
    const y = this.terrainHeight(poi.x, poi.z)
    pole.position.set(poi.x + 3.8, y + 1.8, poi.z + 13)
    pole.castShadow = true
    this.scene.add(pole)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.35), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, side: THREE.DoubleSide }))
    sign.position.set(poi.x + 3.8, y + 3.65, poi.z + 13)
    sign.castShadow = true
    this.scene.add(sign)
    this.poiSigns.push(sign)
    this.addCollider(poi.x + 3.65, y, poi.z + 12.85, poi.x + 3.95, y + 3.6, poi.z + 13.15, { kind: 'sign' }, this.colliders)
  }

  _buildBarrels() {
    const mat = this.mats.metal
    const geo = new THREE.CylinderGeometry(0.55, 0.55, 1.35, 10)
    for (let i = 0; i < 20; i++) {
      const poi = this.pois[i % this.pois.length]
      const a = this.rng.range(0, Math.PI * 2)
      const r = this.rng.range(4, 16)
      const x = poi.x + Math.cos(a) * r
      const z = poi.z + Math.sin(a) * r
      const y = this.terrainHeight(x, z)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y + 0.675, z)
      mesh.rotation.y = this.rng.range(0, 3)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)
      const barrel = { mesh, x, z, y, alive: true, hp: 120, maxHp: 120, kind: 'barrel', resource: 'metal', amount: 15, radius: 0.55 }
      mesh.userData.static = barrel
      this.barrels.push(barrel)
      this.staticTargets.push(mesh)
      this.addCollider(x - 0.6, y, z - 0.6, x + 0.6, y + 1.35, z + 0.6, barrel, this.colliders)
    }
  }

  _buildChests() {
    for (const poi of this.pois) {
      for (let i = 0; i < 2; i++) {
        const a = (i / 2) * Math.PI * 2 + this.rng.range(-0.6, 0.6)
        const r = this.rng.range(15, 21)
        const x = poi.x + Math.cos(a) * r
        const z = poi.z + Math.sin(a) * r
        const y = this.terrainHeight(x, z)
        this.chests.push(this._makeChest(x, y, z, this.chests.length))
      }
    }
  }

  _makeChest(x, y, z, index) {
    const group = new THREE.Group()
    group.position.set(x, y, z)
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.66, 0.84), this.mats.chest)
    base.position.y = 0.33
    base.castShadow = true
    group.add(base)
    const trim1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.09, 0.9), this.mats.chestTrim)
    trim1.position.y = 0.08
    group.add(trim1)
    const trim2 = trim1.clone()
    trim2.position.y = 0.56
    group.add(trim2)
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.88), this.mats.chestTrim)
    band.position.set(0, 0.34, 0)
    group.add(band)
    const lidPivot = new THREE.Group()
    lidPivot.position.set(0, 0.63, -0.38)
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.32, 0.9), this.mats.chest)
    lid.position.set(0, 0.16, 0.44)
    lid.castShadow = true
    lidPivot.add(lid)
    group.add(lidPivot)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.78, 0.95, 32),
      new THREE.MeshBasicMaterial({ color: 0xffca4a, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    group.add(ring)
    const beamMat = new THREE.SpriteMaterial({ map: getLootBeamTexture(), color: 0xffdc88, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending })
    const beam = new THREE.Sprite(beamMat)
    beam.scale.set(1.05, 4.2, 1)
    beam.position.y = 2.1
    group.add(beam)
    this.scene.add(group)
    return { index, x, y, z, group, lidPivot, beam, ring, opened: false, openTime: 0, income: false, kind: 'chest' }
  }

  _buildPickups() {
    for (let i = 0; i < this.pois.length; i++) {
      const poi = this.pois[i]
      for (let j = 0; j < 4; j++) {
        const a = this.rng.range(0, Math.PI * 2)
        const r = this.rng.range(5, 18)
        const x = poi.x + Math.cos(a) * r
        const z = poi.z + Math.sin(a) * r
        if (Math.hypot(x - poi.x, z - poi.z) < 3) continue
        const y = this.terrainHeight(x, z)
        const type = j === 3 ? 'ammo' : (j === 2 ? 'shield' : (i + j) % 2 ? 'shield' : 'ammo')
        this.pickups.push(this._makePickup(x, y, z, type))
      }
    }
  }

  _makePickup(x, y, z, type) {
    const group = new THREE.Group()
    group.position.set(x, y + 0.4, z)
    if (type === 'shield') {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x4fc9ff, emissive: 0x14618e, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.1 }))
      bottle.position.y = 0.25
      group.add(bottle)
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshStandardMaterial({ color: 0x9be8ff, emissive: 0x2b82b5, emissiveIntensity: 0.8, roughness: 0.25 }))
      top.position.y = 0.55
      group.add(top)
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.48, 20), new THREE.MeshBasicMaterial({ color: 0x5bd7ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
      ring.rotation.x = -Math.PI / 2
      ring.position.y = -0.38
      group.add(ring)
    } else {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.36), new THREE.MeshStandardMaterial({ color: 0xc8a05a, roughness: 0.6 }))
      group.add(box)
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.07, 0.38), new THREE.MeshStandardMaterial({ color: 0x5d4526, roughness: 0.7 }))
      band.position.y = 0.05
      group.add(band)
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.43, 20), new THREE.MeshBasicMaterial({ color: 0xffc85a, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
      ring.rotation.x = -Math.PI / 2
      ring.position.y = -0.38
      group.add(ring)
    }
    this.scene.add(group)
    return { x, y, z, type, group, taken: false, baseY: y + 0.4 }
  }

  terrainHeight(x, z) {
    let h = rawHeight(x, z)
    for (const p of this.pois) {
      const d = Math.hypot(x - p.x, z - p.z)
      if (d < 31) {
        const t = smoothstep(16, 31, d)
        h = lerp(p.h, h, t)
      }
    }
    return h
  }

  addCollider(minX, minY, minZ, maxX, maxY, maxZ, owner = null, list = this.colliders) {
    const c = { minX, minY, minZ, maxX, maxY, maxZ, owner, active: true }
    list.push(c)
    if (owner) owner.collider = c
    return c
  }

  groundHeightAt(x, z, maxY = Infinity) {
    let h = this.terrainHeight(x, z)
    for (const f of this.floors) {
      if (x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ && f.top <= maxY + 0.25 && f.top > h) h = f.top
    }
    for (const r of this.ramps) {
      if (!r.active) continue
      const dx = x - r.x
      const dz = z - r.z
      const localX = dx * Math.cos(r.rot) - dz * Math.sin(r.rot)
      const localZ = dx * Math.sin(r.rot) + dz * Math.cos(r.rot)
      if (Math.abs(localX) <= 1.55 && localZ >= -1.6 && localZ <= 1.6) {
        const top = r.y + (localZ + 1.5) * 1.0 + 0.16
        if (top <= maxY + 0.45 && top > h) h = top
      }
    }
    return h
  }

  harvest(staticObj, damage, fromPlayer = false) {
    if (!staticObj || !staticObj.alive) return false
    staticObj.hp -= damage
    if (staticObj.hp > 0) return false
    staticObj.alive = false
    if (staticObj.collider) staticObj.collider.active = false
    if (staticObj.kind === 'tree') {
      const m = new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001)
      m.setPosition(staticObj.x, -50, staticObj.z)
      for (const mesh of this.treeMeshes) {
        mesh.setMatrixAt(staticObj.index, m)
        mesh.instanceMatrix.needsUpdate = true
      }
    } else if (staticObj.kind === 'rock') {
      const m = new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001)
      m.setPosition(staticObj.x, -50, staticObj.z)
      this.rockMesh.setMatrixAt(staticObj.index, m)
      this.rockMesh.instanceMatrix.needsUpdate = true
    } else if (staticObj.kind === 'barrel' && staticObj.mesh) {
      this.scene.remove(staticObj.mesh)
    }
    return true
  }

  update(dt, playerPos) {
    this.elapsed += dt
    this.tex.water.offset.x += dt * 0.004
    this.tex.water.offset.y += dt * 0.0025
    if (this.bus) {
      this.bus.position.x = this.busStart.x + Math.sin(this.elapsed * 0.045) * 26
      this.bus.position.z = this.busStart.z + Math.cos(this.elapsed * 0.045) * 26
      this.bus.position.y = this.busStart.y + Math.sin(this.elapsed * 0.3) * 0.7
      this.bus.rotation.z = 0.04 + Math.sin(this.elapsed * 0.2) * 0.02
    }
    for (const chest of this.chests) {
      if (chest.opened) {
        chest.openTime += dt
        const t = Math.min(1, chest.openTime * 3)
        chest.lidPivot.rotation.x = -1.6 * t
        chest.beam.material.opacity = Math.max(0, 0.34 - chest.openTime * 0.7)
      } else {
        chest.ring.material.opacity = 0.35 + Math.sin(this.elapsed * 2.2 + chest.index) * 0.16
        chest.beam.material.opacity = 0.27 + Math.sin(this.elapsed * 1.6 + chest.index) * 0.11
      }
    }
    for (const p of this.pickups) {
      if (p.taken) continue
      p.group.position.y = p.baseY + Math.sin(this.elapsed * 2 + p.x) * 0.12
      p.group.rotation.y += dt * 1.1
    }
    if (playerPos) {
      this.sun.position.set(playerPos.x + 62, 105, playerPos.z + 44)
      this.sun.target.position.set(playerPos.x, 0, playerPos.z)
      this.sun.target.updateMatrixWorld()
    }
    if (this.game.state === 'playing') this.storm.update(dt)
    else this.storm.material.uniforms.uTime.value += dt
  }
}
