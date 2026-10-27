import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { fbm, hash2, smoothstep, mulberry32 } from './noise.js'

export const WATER_Y = 16
export const WORLD_SIZE = 52
const HALF = WORLD_SIZE / 2

const BLOCK_DEFS = {
  sand: { label: 'Sand', capacity: 9000, roughness: 1, bump: 0.05, texture: 'sand' },
  coral: { label: 'Coral', capacity: 5200, roughness: 0.82, bump: 0.04, texture: 'coral' },
  stone: { label: 'Reef stone', capacity: 5200, roughness: 0.9, bump: 0.06, texture: 'rock' },
  dark: { label: 'Basalt', capacity: 9000, roughness: 0.95, bump: 0.05, texture: 'dark' },
  sandstone: { label: 'Sandstone', capacity: 6480, roughness: 0.95, bump: 0.04, texture: 'sandstone' },
  pearl: {
    label: 'Pearl block',
    capacity: 1200,
    roughness: 0.35,
    bump: 0.02,
    texture: 'pearl',
    emissive: '#3ee8c8',
    emissiveIntensity: 0.9,
  },
}

export const HOTBAR = [
  { type: 'sand', label: 'SAND', icon: 'sand' },
  { type: 'coral', label: 'CORAL', icon: 'coral' },
  { type: 'stone', label: 'STONE', icon: 'stone' },
  { type: 'dark', label: 'BASALT', icon: 'dark' },
  { type: 'pearl', label: 'PEARL', icon: 'pearl' },
  { type: 'sandstone', label: 'SANDSTONE', icon: 'coral2' },
]

const RELIC_SPOTS = [
  [7, 7, null],
  [-10, -4, null],
  [3, 14, null],
  [-15, -15, null],
  [0, -11, 11.8],
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function makeTexture(kind, renderer) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const random = mulberry32(kind.length * 977 + 31)

  const grain = (count, alpha, palette) => {
    for (let i = 0; i < count; i += 1) {
      ctx.globalAlpha = alpha * (0.4 + random() * 0.6)
      ctx.fillStyle = palette[Math.floor(random() * palette.length)]
      const size = 0.6 + random() * 2.4
      ctx.fillRect(random() * 128, random() * 128, size, size)
    }
    ctx.globalAlpha = 1
  }

  if (kind === 'sand') {
    ctx.fillStyle = '#d9c387'
    ctx.fillRect(0, 0, 128, 128)
    for (let y = 0; y < 128; y += 4) {
      ctx.strokeStyle = `rgba(122, 95, 48, ${0.04 + random() * 0.08})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= 128; x += 8) {
        const yy = y + Math.sin(x * 0.09 + y * 0.4) * 2.4
        if (x === 0) ctx.moveTo(x, yy)
        else ctx.lineTo(x, yy)
      }
      ctx.stroke()
    }
    grain(420, 0.28, ['#f4e3ae', '#bda469', '#ead694', '#9c8347'])
  } else if (kind === 'coral') {
    ctx.fillStyle = '#c85f70'
    ctx.fillRect(0, 0, 128, 128)
    for (let i = 0; i < 50; i += 1) {
      ctx.fillStyle = ['#e37a83', '#a94b63', '#f29695', '#d1677b'][Math.floor(random() * 4)]
      ctx.globalAlpha = 0.35 + random() * 0.4
      ctx.beginPath()
      ctx.arc(random() * 128, random() * 128, 4 + random() * 13, 0, Math.PI * 2)
      ctx.fill()
    }
    grain(260, 0.4, ['#ffe0d2', '#8f3e58', '#f3a69e'])
  } else if (kind === 'rock') {
    ctx.fillStyle = '#667981'
    ctx.fillRect(0, 0, 128, 128)
    grain(520, 0.4, ['#8a9aa0', '#4d5f68', '#a4b1b5', '#3f515b'])
    ctx.strokeStyle = 'rgba(36, 51, 58, 0.5)'
    for (let i = 0; i < 8; i += 1) {
      ctx.lineWidth = 1 + random() * 1.4
      ctx.beginPath()
      let x = random() * 128
      let y = random() * 128
      ctx.moveTo(x, y)
      for (let s = 0; s < 4; s += 1) {
        x += (random() - 0.5) * 30
        y += random() * 18
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  } else if (kind === 'dark') {
    ctx.fillStyle = '#243a44'
    ctx.fillRect(0, 0, 128, 128)
    grain(430, 0.38, ['#3b535e', '#172a32', '#4a626b', '#20343d'])
    ctx.strokeStyle = 'rgba(7, 18, 24, 0.45)'
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath()
      ctx.moveTo(random() * 128, 0)
      ctx.lineTo(random() * 128, 128)
      ctx.stroke()
    }
  } else if (kind === 'sandstone') {
    ctx.fillStyle = '#bea56b'
    ctx.fillRect(0, 0, 128, 128)
    for (let y = 0; y < 128; y += 11) {
      ctx.fillStyle = y % 22 === 0 ? 'rgba(154, 126, 65, 0.4)' : 'rgba(231, 207, 145, 0.28)'
      ctx.fillRect(0, y + random() * 3, 128, 5 + random() * 4)
    }
    grain(280, 0.24, ['#e2ca92', '#9c834e', '#d0b678'])
  } else {
    ctx.fillStyle = '#5fe4cd'
    ctx.fillRect(0, 0, 128, 128)
    const gradient = ctx.createRadialGradient(42, 38, 4, 64, 64, 82)
    gradient.addColorStop(0, '#fbfffd')
    gradient.addColorStop(0.28, '#a8fff0')
    gradient.addColorStop(0.7, '#37c9b8')
    gradient.addColorStop(1, '#0d7b80')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.lineWidth = 1
    for (let r = 18; r < 70; r += 12) {
      ctx.beginPath()
      ctx.arc(45, 42, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    grain(120, 0.2, ['#ffffff', '#c7fff4'])
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() ?? 1)
  return texture
}

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 240, 1)')
  gradient.addColorStop(0.16, 'rgba(255, 236, 176, 0.9)')
  gradient.addColorStop(0.42, 'rgba(255, 186, 92, 0.28)')
  gradient.addColorStop(1, 'rgba(255, 160, 60, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function bubbleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(26, 22, 1, 32, 32, 30)
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
  gradient.addColorStop(0.35, 'rgba(190,255,250,0.35)')
  gradient.addColorStop(0.78, 'rgba(120,235,230,0.12)')
  gradient.addColorStop(1, 'rgba(120,235,230,0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(32, 32, 31, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(220,255,250,0.55)'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(32, 32, 26, 0.2, Math.PI * 1.35)
  ctx.stroke()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function environmentTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, '#c8fff5')
  gradient.addColorStop(0.16, '#65e4dd')
  gradient.addColorStop(0.4, '#138c96')
  gradient.addColorStop(0.72, '#064651')
  gradient.addColorStop(1, '#021820')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 256)
  const sun = ctx.createRadialGradient(150, 32, 2, 150, 32, 90)
  sun.addColorStop(0, 'rgba(255,255,235,1)')
  sun.addColorStop(0.25, 'rgba(185,255,244,0.5)')
  sun.addColorStop(1, 'rgba(120,230,220,0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, 512, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export class World {
  constructor(scene, renderer, options = {}) {
    this.scene = scene
    this.renderer = renderer
    this.low = Boolean(options.low)
    this.blocks = new Map()
    this.meshes = {}
    this.timeUniform = { value: 0 }
    this.spawn = new THREE.Vector3(0, 10.6, 22)
    this.relics = []
    this.collected = 0
    this.bursts = []
    this.blocksPlaced = 0
    this.random = mulberry32(1337)
    this._dummy = new THREE.Object3D()
    this._color = new THREE.Color()

    this.rebuildCounts = {}
    this.buildEnvironment()
    this.buildMaterials()
    this.buildTerrain()
    this.buildBlockMeshes()
    this.buildFoliage()
    this.buildCorals()
    this.buildFish()
    this.buildJellyfish()
    this.buildRelics()
    this.buildWater()
    this.buildLightShafts()
    this.buildParticles()
    this.rebuild()
  }

  buildEnvironment() {
    this.scene.background = new THREE.Color(0x031d27)
    this.scene.fog = new THREE.FogExp2(0x07434f, 0.024)
    if (!this.low) {
      this.scene.environment = environmentTexture()
      this.scene.environmentIntensity = 0.55
    }

    const hemi = new THREE.HemisphereLight(0x7ff4e8, 0x051a21, 0.62)
    this.scene.add(hemi)

    const sun = new THREE.DirectionalLight(0xfff0d2, 2.15)
    sun.position.set(-14, 38, 12)
    this.scene.add(sun)

    const fill = new THREE.DirectionalLight(0x2ab4c0, 0.72)
    fill.position.set(18, 2, -20)
    this.scene.add(fill)

    const warm = new THREE.PointLight(0xff8a58, 9, 22, 2)
    warm.position.set(9, 4.5, 6)
    this.scene.add(warm)
  }

  buildMaterials() {
    this.materials = {}
    for (const [type, def] of Object.entries(BLOCK_DEFS)) {
      const map = makeTexture(def.texture, this.renderer)
      const material = new THREE.MeshStandardMaterial({
        map,
        bumpMap: map,
        bumpScale: def.bump,
        roughness: def.roughness,
        metalness: type === 'pearl' ? 0.35 : 0.02,
        color: 0xffffff,
      })
      if (def.emissive) {
        material.emissive = new THREE.Color(def.emissive)
        material.emissiveIntensity = def.emissiveIntensity
        material.emissiveMap = map
      }
      this.applyCaustics(material)
      this.materials[type] = material
    }
  }

  applyCaustics(material) {
    const uniforms = this.timeUniform
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms
      shader.vertexShader = `varying vec3 vCausticPos;\n${shader.vertexShader}`
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
#ifdef USE_INSTANCING
  vCausticPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
#else
  vCausticPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif
`,
      )
      shader.fragmentShader = `varying vec3 vCausticPos;\nuniform float uTime;\n${shader.fragmentShader}`
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `float abyssCaustic(vec2 p, float t) {
  vec2 q = p * 0.7;
  float c = sin(q.x * 1.1 + t * 0.7) * sin(q.y * 1.4 - t * 0.55);
  c += sin(q.x * 0.63 - t * 0.48 + 1.6) * sin(q.y * 0.87 + t * 0.63);
  c += sin(q.x * 2.1 + q.y * 1.7 + t * 0.9) * 0.5;
  return pow(max(0.0, c * 0.36 + 0.5), 2.5);
}
void main() {`,
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `float ca = abyssCaustic(vCausticPos.xz, uTime);
outgoingLight += ca * 0.32 * vec3(0.42, 0.98, 0.86);
#include <opaque_fragment>`,
      )
    }
    material.customProgramCacheKey = () => 'abyss-caustics-v2'
  }

  heightAt(x, z) {
    const n = fbm(x * 0.048, z * 0.048, 4)
    const broad = fbm(x * 0.016 + 13.1, z * 0.016 - 7.7, 3)
    const ridge = 1 - Math.abs(fbm(x * 0.03 - 3.3, z * 0.03 + 9.1, 3) * 2 - 1)
    let h = -5.5 + n * 9.5 + broad * 4 + ridge * 1.6
    const depthFromSpawn = Math.hypot(x, z - 22)
    const flat = smoothstep(clamp((depthFromSpawn - 3.5) / 8, 0, 1))
    h = h * flat + 1.2 * (1 - flat)
    return Math.floor(clamp(h, -13, 7))
  }

  surfaceType(x, z, h) {
    if (h > 5) return 'stone'
    const coral = fbm(x * 0.115 + 100, z * 0.115 - 40, 3)
    if (coral > 0.61) return 'coral'
    if (hash2(x + 50, z - 20) > 0.9945) return 'pearl'
    return 'sand'
  }

  addBlockRaw(x, y, z, type) {
    const key = `${x},${y},${z}`
    if (this.blocks.has(key)) return
    const random = this.random
    let tint
    if (type === 'coral') tint = [0.9 + random() * 0.14, 0.82 + random() * 0.16, 0.84 + random() * 0.16]
    else if (type === 'pearl') tint = [0.92 + random() * 0.08, 0.96 + random() * 0.04, 0.95 + random() * 0.05]
    else if (type === 'sand') tint = [0.93 + random() * 0.1, 0.91 + random() * 0.1, 0.86 + random() * 0.1]
    else tint = [0.86 + random() * 0.16, 0.88 + random() * 0.14, 0.89 + random() * 0.13]
    this.blocks.set(key, { x, y, z, type, tint })
  }

  buildTerrain() {
    for (let x = -HALF; x < HALF; x += 1) {
      for (let z = -HALF; z < HALF; z += 1) {
        const h = this.heightAt(x, z)
        const top = this.surfaceType(x, z, h)
        this.addBlockRaw(x, h, z, top)
        for (let depth = 1; depth <= 3; depth += 1) {
          let type = 'dark'
          if (depth === 1) type = top === 'sand' || top === 'coral' || top === 'pearl' ? 'sandstone' : 'stone'
          if (depth === 2) type = top === 'stone' ? 'dark' : 'sandstone'
          this.addBlockRaw(x, h - depth, z, type)
        }
      }
    }

    for (let x = -8; x <= 8; x += 1) {
      const t = x / 8
      const archY = Math.round(3 + 5.2 * Math.cos(t * Math.PI * 0.5))
      for (let yy = archY; yy <= archY + 1; yy += 1) {
        for (let z = -12; z <= -11; z += 1) this.addBlockRaw(x, yy, z, 'stone')
      }
      if (Math.abs(x) >= 6) {
        const floor = this.heightAt(x, -11)
        for (let yy = floor; yy < archY; yy += 1) {
          for (let z = -12; z <= -11; z += 1) this.addBlockRaw(x, yy, z, 'stone')
        }
      }
    }
    this.addBlockRaw(0, 10, -12, 'pearl')
    this.addBlockRaw(-8, 4, -12, 'pearl')
    this.addBlockRaw(8, 4, -11, 'pearl')

    for (let i = 0; i < 8; i += 1) {
      const x = Math.round(Math.cos((i / 8) * Math.PI * 2) * 5.5)
      const z = Math.round(Math.sin((i / 8) * Math.PI * 2) * 5.5)
      const floor = this.heightAt(x, z)
      if (this.blocks.has(`${x},${floor + 1},${z}`)) continue
      this.addBlockRaw(x, floor + 1, z, i % 3 === 0 ? 'pearl' : 'coral')
    }
  }

  buildBlockMeshes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    for (const [type, def] of Object.entries(BLOCK_DEFS)) {
      const mesh = new THREE.InstancedMesh(geometry, this.materials[type], def.capacity)
      mesh.count = 0
      mesh.frustumCulled = false
      mesh.userData.type = type
      mesh.userData.keys = []
      this.scene.add(mesh)
      this.meshes[type] = mesh
    }
  }

  rebuild() {
    for (const mesh of Object.values(this.meshes)) {
      mesh.count = 0
      mesh.userData.keys = []
    }
    const counts = {}
    const dummy = this._dummy
    const color = this._color
    for (const [key, block] of this.blocks) {
      const mesh = this.meshes[block.type]
      if (!mesh) continue
      const index = counts[block.type] ?? 0
      if (index >= mesh.instanceMatrix.count) continue
      counts[block.type] = index + 1
      dummy.position.set(block.x, block.y, block.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      color.setRGB(block.tint[0], block.tint[1], block.tint[2])
      mesh.setColorAt(index, color)
      mesh.userData.keys[index] = key
    }
    for (const [type, mesh] of Object.entries(this.meshes)) {
      mesh.count = counts[type] ?? 0
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    this.rebuildCounts = counts
  }

  addBlock(x, y, z, type) {
    if (y < -18 || y > 30) return false
    if (Math.abs(x) > 36 || Math.abs(z) > 36) return false
    const key = `${x},${y},${z}`
    if (this.blocks.has(key)) return false
    const tint = type === 'pearl'
      ? [0.94, 0.98, 0.97]
      : [0.9 + Math.random() * 0.12, 0.9 + Math.random() * 0.1, 0.88 + Math.random() * 0.12]
    this.blocks.set(key, { x, y, z, type, tint })
    this.blocksPlaced += 1
    this.rebuild()
    return true
  }

  removeBlock(key) {
    const block = this.blocks.get(key)
    if (!block) return null
    this.blocks.delete(key)
    this.rebuild()
    return block
  }

  blockMeshes() {
    return Object.values(this.meshes)
  }

  buildFoliage() {
    const random = mulberry32(90210)
    const geometries = []
    const baseColor = new THREE.Color()
    const tipColor = new THREE.Color()

    const paint = (geo, c, amount) => {
      const count = geo.attributes.position.count
      const colors = new Float32Array(count * 3)
      const sway = new Float32Array(count)
      for (let v = 0; v < count; v += 1) {
        colors[v * 3] = c.r
        colors[v * 3 + 1] = c.g
        colors[v * 3 + 2] = c.b
        sway[v] = amount
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geo.setAttribute('sway', new THREE.BufferAttribute(sway, 1))
      geometries.push(geo)
    }

    const addBlade = (x, z, h, height, width, swayScale, palette, crossed = false, leafy = false) => {
      const segments = Math.max(2, Math.ceil(height / 0.58))
      const phase = random() * Math.PI * 2
      const facing = random() * Math.PI
      for (let s = 0; s < segments; s += 1) {
        const f = s / segments
        const taper = 1 - f * 0.55
        const px = x + 0.5 + Math.sin(s * 0.55 + phase) * 0.14
        const pz = z + 0.5 + Math.cos(s * 0.4 + phase) * 0.11
        const py = h + 0.45 + s * 0.59
        const amount = Math.pow((s + 1) / segments, 1.65) * swayScale
        baseColor.set(palette[0])
        tipColor.set(palette[1])
        const c = baseColor.clone().lerp(tipColor, f)

        if (leafy) {
          const stem = new THREE.BoxGeometry(0.05 * taper, 0.64, 0.05 * taper)
          stem.translate(px, py, pz)
          paint(stem, c, amount)
          const leaves = random() > 0.35 ? 2 : 1
          for (let leaf = 0; leaf < leaves; leaf += 1) {
            const leafWidth = width * taper * (0.85 + random() * 0.4)
            const geo = new THREE.BoxGeometry(leafWidth, 0.5 + random() * 0.2, 0.022)
            geo.translate(leafWidth * 0.42, 0.06, 0)
            geo.rotateY(facing + (s % 2 === 0 ? 0 : Math.PI) + (leaf === 1 ? Math.PI * 0.75 : 0) + (random() - 0.5) * 0.4)
            geo.translate(px, py, pz)
            paint(geo, c, Math.min(1.2, amount + 0.18))
          }
        } else {
          for (let blade = 0; blade < (crossed ? 2 : 1); blade += 1) {
            const geo = new THREE.BoxGeometry(width * taper, 0.64, Math.max(0.018, width * 0.2))
            geo.rotateY(facing + (blade === 1 ? Math.PI * 0.5 : 0) + (random() - 0.5) * 0.3)
            geo.translate(px, py, pz)
            paint(geo, c, amount)
          }
        }
      }
    }

    const kelpCount = this.low ? 80 : 150
    for (let i = 0; i < kelpCount; i += 1) {
      const x = Math.floor((random() * 2 - 1) * (HALF - 3))
      const z = Math.floor((random() * 2 - 1) * (HALF - 3))
      if (Math.hypot(x, z - 22) < 8) continue
      const h = this.heightAt(x, z)
      if (h < -6) continue
      const spot = fbm(x * 0.09 - 20, z * 0.09 + 10, 2)
      if (spot < 0.35) continue
      const height = 3.5 + random() * 9
      addBlade(x, z, h, height, 0.38 + random() * 0.24, 0.7 + random() * 0.5, ['#155e50', '#7cf0b8'], false, true)
    }

    addBlade(-9, 20, this.heightAt(-9, 20), 8.6, 0.5, 1.0, ['#115346', '#8dffc6'], false, true)
    addBlade(9, 18, this.heightAt(9, 18), 7.2, 0.48, 0.9, ['#125a4b', '#79f7b4'], false, true)
    addBlade(-11, 17, this.heightAt(-11, 17), 5.4, 0.42, 0.8, ['#166655', '#a7ffd0'], false, true)
    addBlade(11, 21, this.heightAt(11, 21), 4.6, 0.4, 0.8, ['#166655', '#a7ffd0'], false, true)

    const grassCount = this.low ? 280 : 520
    for (let i = 0; i < grassCount; i += 1) {
      const x = Math.floor((random() * 2 - 1) * (HALF - 2))
      const z = Math.floor((random() * 2 - 1) * (HALF - 2))
      if (Math.hypot(x, z - 22) < 3.5) continue
      const h = this.heightAt(x, z)
      if (h < -7) continue
      const height = 0.45 + random() * 1.5
      addBlade(x, z, h, height, 0.045 + random() * 0.04, 0.35 + random() * 0.4, ['#1e6e59', '#9dffc9'])
    }

    for (let i = 0; i < 70; i += 1) {
      const angle = random() * Math.PI * 2
      const radius = 1.5 + random() * 4.8
      const x = Math.round(Math.cos(angle) * radius)
      const z = Math.round(18 + Math.sin(angle) * radius * 0.85)
      const h = this.heightAt(x, z)
      const height = 0.7 + random() * 1.7
      addBlade(x, z, h, height, 0.05 + random() * 0.04, 0.4 + random() * 0.35, ['#1e6e59', '#9dffc9'])
    }

    const merged = mergeGeometries(geometries, false)
    geometries.forEach((geo) => geo.dispose())
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.78,
      metalness: 0.02,
      side: THREE.DoubleSide,
    })
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.timeUniform
      shader.vertexShader = `attribute float sway;\nuniform float uTime;\n${shader.vertexShader}`
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
transformed.x += sin(uTime * 1.15 + transformed.x * 0.7 + transformed.z * 0.52) * sway * 0.5;
transformed.z += cos(uTime * 0.92 + transformed.x * 0.42 - transformed.z * 0.61) * sway * 0.34;
`,
      )
    }
    material.customProgramCacheKey = () => 'abyss-foliage'
    this.foliage = new THREE.Mesh(merged, material)
    this.foliage.frustumCulled = false
    this.scene.add(this.foliage)
  }

  buildCorals() {
    const random = mulberry32(4242)
    const palette = ['#ff7f96', '#ff9f5a', '#c88bff', '#4fe3c1', '#ffd36e', '#ff6f61']
    const headGeo = new THREE.IcosahedronGeometry(1, 1)
    const headMat = new THREE.MeshStandardMaterial({
      roughness: 0.62,
      metalness: 0.04,
      flatShading: true,
      emissive: new THREE.Color(0x103b39),
      emissiveIntensity: 0.35,
    })
    const headCount = this.low ? 230 : 320
    const heads = new THREE.InstancedMesh(headGeo, headMat, headCount)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    let index = 0

    const heroCorals = [
      [-5, 18, 0.85, 1.45, '#ff6f8c'],
      [5.2, 19, 0.7, 1.15, '#ff9f5a'],
      [-3.2, 15, 0.55, 0.8, '#c88bff'],
      [3.8, 16, 0.62, 0.95, '#4fe3c1'],
      [-7.5, 17, 0.5, 0.7, '#ffd36e'],
    ]
    for (const [hx, hz, hs, ht, hc] of heroCorals) {
      const h = this.heightAt(Math.floor(hx), Math.floor(hz))
      dummy.position.set(hx, h + 0.45 + ht * 0.5, hz)
      dummy.rotation.set(random() * 0.35, random() * Math.PI * 2, random() * 0.25)
      dummy.scale.set(hs * 1.1, ht, hs)
      dummy.updateMatrix()
      heads.setMatrixAt(index, dummy.matrix)
      color.set(hc)
      heads.setColorAt(index, color)
      index += 1
    }

    for (let i = 0; i < 1400 && index < headCount; i += 1) {
      const x = Math.floor((random() * 2 - 1) * (HALF - 2))
      const z = Math.floor((random() * 2 - 1) * (HALF - 2))
      if (Math.hypot(x, z - 22) < 4.5) continue
      const h = this.heightAt(x, z)
      if (h < -4) continue
      const scale = 0.18 + random() * 0.62
      const tall = scale * (0.6 + random() * 0.9)
      dummy.position.set(x + 0.5 + (random() - 0.5) * 0.7, h + 0.45 + tall * 0.5, z + 0.5 + (random() - 0.5) * 0.7)
      dummy.rotation.set(random() * 0.4, random() * Math.PI * 2, random() * 0.3)
      dummy.scale.set(scale * (0.7 + random() * 0.7), tall, scale * (0.7 + random() * 0.7))
      dummy.updateMatrix()
      heads.setMatrixAt(index, dummy.matrix)
      color.set(palette[Math.floor(random() * palette.length)])
      color.offsetHSL((random() - 0.5) * 0.03, 0, (random() - 0.5) * 0.1)
      heads.setColorAt(index, color)
      index += 1
    }
    heads.count = index
    heads.instanceMatrix.needsUpdate = true
    if (heads.instanceColor) heads.instanceColor.needsUpdate = true
    heads.computeBoundingSphere()
    heads.frustumCulled = false
    this.scene.add(heads)

    const fingerGeo = new THREE.CylinderGeometry(0.11, 0.22, 1, 6, 1)
    const fingerMat = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.02,
      flatShading: true,
      emissive: new THREE.Color(0x1a4b42),
      emissiveIntensity: 0.3,
    })
    const fingerCount = this.low ? 300 : 460
    const fingers = new THREE.InstancedMesh(fingerGeo, fingerMat, fingerCount)
    index = 0
    for (let i = 0; i < 1400 && index < fingerCount; i += 1) {
      const x = Math.floor((random() * 2 - 1) * (HALF - 2))
      const z = Math.floor((random() * 2 - 1) * (HALF - 2))
      if (Math.hypot(x, z - 22) < 4) continue
      const h = this.heightAt(x, z)
      if (h < -4) continue
      if (fbm(x * 0.12 + 4, z * 0.12 - 8, 2) < 0.47) continue
      const height = 0.5 + random() * 1.9
      dummy.position.set(x + 0.5 + (random() - 0.5) * 0.8, h + 0.35 + height * 0.5, z + 0.5 + (random() - 0.5) * 0.8)
      dummy.rotation.set((random() - 0.5) * 0.35, random() * Math.PI, (random() - 0.5) * 0.35)
      dummy.scale.set(0.7 + random() * 0.9, height, 0.7 + random() * 0.9)
      dummy.updateMatrix()
      fingers.setMatrixAt(index, dummy.matrix)
      color.set(palette[Math.floor(random() * palette.length)])
      color.offsetHSL((random() - 0.5) * 0.04, 0, (random() - 0.5) * 0.12)
      fingers.setColorAt(index, color)
      index += 1
    }
    fingers.count = index
    fingers.instanceMatrix.needsUpdate = true
    if (fingers.instanceColor) fingers.instanceColor.needsUpdate = true
    fingers.computeBoundingSphere()
    fingers.frustumCulled = false
    this.scene.add(fingers)

    const rockGeo = new THREE.DodecahedronGeometry(1, 0)
    const rockMat = new THREE.MeshStandardMaterial({ roughness: 0.96, flatShading: true })
    const rockCount = this.low ? 44 : 70
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount)
    for (let i = 0; i < rockCount; i += 1) {
      const x = (random() * 2 - 1) * (HALF - 3)
      const z = (random() * 2 - 1) * (HALF - 3)
      const h = this.heightAt(Math.floor(x), Math.floor(z))
      const scale = 0.4 + random() * 2.2
      dummy.position.set(x, h + scale * 0.28, z)
      dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI)
      dummy.scale.set(scale * (0.8 + random() * 0.6), scale * (0.5 + random() * 0.6), scale * (0.8 + random() * 0.6))
      dummy.updateMatrix()
      rocks.setMatrixAt(i, dummy.matrix)
      color.setRGB(0.55 + random() * 0.2, 0.62 + random() * 0.18, 0.64 + random() * 0.16)
      rocks.setColorAt(i, color)
    }
    rocks.instanceMatrix.needsUpdate = true
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true
    rocks.computeBoundingSphere()
    rocks.frustumCulled = false
    this.scene.add(rocks)
  }

  buildFish() {
    const random = mulberry32(777)
    const bodyGeo = new THREE.SphereGeometry(1, 8, 6)
    bodyGeo.scale(0.42, 0.29, 0.82)
    const tailGeo = new THREE.ConeGeometry(0.32, 0.55, 4)
    tailGeo.rotateX(-Math.PI * 0.5)
    const palettes = ['#6bdfea', '#ffd36e', '#ff8f76', '#93a8ff', '#93f2c2', '#e8f7ff']
    const materials = palettes.map((hex) => {
      const mat = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.38,
        metalness: 0.22,
        emissive: new THREE.Color(hex),
        emissiveIntensity: 0.08,
      })
      return mat
    })

    this.fish = []
    const count = this.low ? 16 : 28
    for (let i = 0; i < count; i += 1) {
      const group = new THREE.Group()
      const material = materials[i % materials.length]
      const body = new THREE.Mesh(bodyGeo, material)
      body.scale.set(1, 1, 1)
      const tailPivot = new THREE.Group()
      tailPivot.position.z = -0.65
      const tail = new THREE.Mesh(tailGeo, material)
      tail.position.z = -0.16
      tail.scale.set(0.22, 1, 1)
      tailPivot.add(tail)
      group.add(body, tailPivot)
      const scale = 0.7 + random() * 1.2
      group.scale.setScalar(scale)
      this.scene.add(group)
      this.fish.push({
        group,
        tail: tailPivot,
        centerX: (random() * 2 - 1) * 9,
        centerZ: (random() * 2 - 1) * 9 - 3,
        radius: 5 + random() * 15,
        baseY: 4.5 + random() * 6.5,
        speed: (0.12 + random() * 0.2) * (random() > 0.5 ? 1 : -1),
        phase: random() * Math.PI * 2,
        wobble: random() * Math.PI * 2,
      })
    }
  }

  buildJellyfish() {
    const random = mulberry32(2024)
    const palettes = ['#ff9fd8', '#94f7ff', '#c7a5ff', '#ffd0a8']
    this.jellyfish = []
    const jellyCount = this.low ? 4 : 7
    for (let i = 0; i < jellyCount; i += 1) {
      const hex = palettes[i % palettes.length]
      const material = new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const bellGeo = new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.56)
      const group = new THREE.Group()
      const bell = new THREE.Mesh(bellGeo, material)
      group.add(bell)

      const lineMat = new THREE.LineBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      for (let t = 0; t < 5; t += 1) {
        const points = []
        const angle = (t / 5) * Math.PI * 2
        const len = 1.4 + random() * 1.6
        for (let s = 0; s < 8; s += 1) {
          const f = s / 7
          points.push(new THREE.Vector3(
            Math.cos(angle) * (0.32 + f * 0.36) + Math.sin(f * 6 + t) * 0.08,
            -0.1 - f * len,
            Math.sin(angle) * (0.32 + f * 0.36) + Math.cos(f * 5 + t) * 0.08,
          ))
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
        group.add(new THREE.Line(lineGeo, lineMat))
      }
      const scale = 0.34 + random() * 0.72
      group.scale.setScalar(scale)
      const angle = random() * Math.PI * 2
      const radius = 7 + random() * 13
      group.position.set(Math.cos(angle) * radius, 6 + random() * 8, Math.sin(angle) * radius - 2)
      this.scene.add(group)
      const light = new THREE.PointLight(hex, 6 * scale, 8, 2)
      group.add(light)
      this.jellyfish.push({ group, bell, baseY: group.position.y, phase: random() * Math.PI * 2, drift: random() * Math.PI * 2, scale })
    }
  }

  buildRelics() {
    const glow = glowTexture()
    const random = mulberry32(5150)
    for (let i = 0; i < RELIC_SPOTS.length; i += 1) {
      const [x, z, forcedY] = RELIC_SPOTS[i]
      const y = forcedY ?? this.heightAt(x, z) + 2.6
      const group = new THREE.Group()
      group.position.set(x + 0.5, y, z + 0.5)

      const coreGeo = new THREE.OctahedronGeometry(0.42, 0)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffe3a0,
        emissive: 0xff9f2e,
        emissiveIntensity: 1.7,
        roughness: 0.18,
        metalness: 0.45,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      group.add(core)

      const cageMat = new THREE.MeshBasicMaterial({
        color: 0xffd36e,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const cage = new THREE.Mesh(new THREE.OctahedronGeometry(0.74, 0), cageMat)
      group.add(cage)

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffd36e,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.024, 6, 48), ringMat)
      ring.rotation.x = Math.PI * 0.5
      group.add(ring)

      const spriteMat = new THREE.SpriteMaterial({
        map: glow,
        color: 0xffd88a,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.setScalar(5.6)
      group.add(sprite)

      const light = new THREE.PointLight(0xffb84d, 16, 13, 2)
      group.add(light)

      this.scene.add(group)
      this.relics.push({
        group,
        core,
        cage,
        ring,
        sprite,
        light,
        baseY: y,
        phase: random() * Math.PI * 2,
        collected: false,
        position: new THREE.Vector3(x + 0.5, y, z + 0.5),
      })
    }
  }

  buildWater() {
    const uniforms = {
      uTime: this.timeUniform,
      uDeep: { value: new THREE.Color(0x0e7f8c) },
      uBright: { value: new THREE.Color(0xb9fff7) },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorldPosition = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uDeep;
        uniform vec3 uBright;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(vWorldPosition - cameraPosition);
          float up = clamp(viewDir.y, 0.0, 1.0);
          vec2 p = vWorldPosition.xz * 0.32;
          float c = sin(p.x * 1.3 + uTime * 0.7) * sin(p.y * 1.1 - uTime * 0.52);
          c += sin(p.x * 0.71 - uTime * 0.4 + 2.0) * sin(p.y * 1.7 + uTime * 0.61);
          c += sin((p.x + p.y) * 2.1 + uTime * 1.1) * 0.55;
          float caustic = pow(max(0.0, c * 0.32 + 0.5), 2.4);
          float window = smoothstep(0.15, 1.0, up);
          float fresnel = pow(1.0 - up, 2.0);
          vec3 color = mix(uDeep, uBright, window * 0.88 + caustic * 0.26);
          color += vec3(0.32, 0.9, 0.84) * caustic * 0.24;
          float alpha = 0.5 + window * 0.28 + fresnel * 0.12 + caustic * 0.12;
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.94));
        }
      `,
    })
    const surface = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), material)
    surface.rotation.x = -Math.PI * 0.5
    surface.position.y = WATER_Y
    surface.renderOrder = 3
    surface.frustumCulled = false
    this.scene.add(surface)
    this.waterSurface = surface

    const sunMat = new THREE.SpriteMaterial({
      map: glowTexture(),
      color: 0xbafff5,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const sun = new THREE.Sprite(sunMat)
    sun.scale.setScalar(82)
    sun.position.set(-34, 20, -52)
    sun.renderOrder = 1
    this.scene.add(sun)
  }

  buildLightShafts() {
    const random = mulberry32(31415)
    const count = this.low ? 5 : 8
    const group = new THREE.Group()
    for (let i = 0; i < count; i += 1) {
      const uniforms = { uTime: this.timeUniform, uPhase: { value: random() * 10 } }
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uPhase;
          varying vec2 vUv;
          void main() {
            float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
            float top = smoothstep(0.42, 1.0, vUv.y);
            float shimmer = 0.55 + 0.45 * sin(vUv.y * 10.0 + uTime * 0.9 + uPhase + vUv.x * 4.0);
            float pulse = 0.75 + 0.25 * sin(uTime * 0.35 + uPhase);
            float alpha = edge * top * shimmer * pulse * 0.2;
            vec3 color = mix(vec3(0.4, 0.95, 0.9), vec3(0.95, 1.0, 0.98), vUv.y);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      })
      const width = 2.5 + random() * 5.5
      const height = 22 + random() * 10
      const geometry = new THREE.PlaneGeometry(width, height)
      for (let cross = 0; cross < 2; cross += 1) {
        const beam = new THREE.Mesh(geometry, material)
        beam.position.set((random() * 2 - 1) * 23, WATER_Y - height * 0.42, (random() * 2 - 1) * 23)
        beam.rotation.y = random() * Math.PI
        if (cross === 1) beam.rotation.y += Math.PI * 0.5
        beam.rotation.z = (random() - 0.5) * 0.16
        beam.renderOrder = 2
        beam.frustumCulled = false
        group.add(beam)
      }
    }
    this.scene.add(group)
  }

  buildParticles() {
    const random = mulberry32(8080)

    const bubbles = this.low ? 130 : 220
    const bubblePositions = new Float32Array(bubbles * 3)
    this.bubbleData = []
    for (let i = 0; i < bubbles; i += 1) {
      const x = (random() * 2 - 1) * 30
      const z = (random() * 2 - 1) * 30
      const y = random() * (WATER_Y + 4) - 6
      bubblePositions[i * 3] = x
      bubblePositions[i * 3 + 1] = y
      bubblePositions[i * 3 + 2] = z
      this.bubbleData.push({ speed: 0.35 + random() * 1.1, drift: random() * Math.PI * 2 })
    }
    const bubbleGeo = new THREE.BufferGeometry()
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3))
    const bubbleMat = new THREE.PointsMaterial({
      map: bubbleTexture(),
      color: 0xbffff8,
      size: 0.16,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    this.bubbles = new THREE.Points(bubbleGeo, bubbleMat)
    this.bubbles.frustumCulled = false
    this.scene.add(this.bubbles)
    this.bubbleArray = bubblePositions

    const plankton = this.low ? 420 : 900
    const planktonPositions = new Float32Array(plankton * 3)
    for (let i = 0; i < plankton; i += 1) {
      planktonPositions[i * 3] = (random() * 2 - 1) * 34
      planktonPositions[i * 3 + 1] = random() * 22 - 8
      planktonPositions[i * 3 + 2] = (random() * 2 - 1) * 34
    }
    const planktonGeo = new THREE.BufferGeometry()
    planktonGeo.setAttribute('position', new THREE.BufferAttribute(planktonPositions, 3))
    const planktonMat = new THREE.PointsMaterial({
      color: 0xd2fff8,
      size: 0.055,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    this.plankton = new THREE.Points(planktonGeo, planktonMat)
    this.plankton.frustumCulled = false
    this.scene.add(this.plankton)

    this.bubbleTexture = bubbleTexture()
  }

  spawnBurst(position, color = 0xbffff6, strength = 18) {
    const random = mulberry32(Math.floor(performance.now()) % 100000)
    const positions = new Float32Array(strength * 3)
    const velocities = []
    for (let i = 0; i < strength; i += 1) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      velocities.push(new THREE.Vector3(
        (random() - 0.5) * 2.6,
        (random() - 0.2) * 2.4,
        (random() - 0.5) * 2.6,
      ))
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      map: this.bubbleTexture,
      color,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geometry, material)
    points.frustumCulled = false
    this.scene.add(points)
    this.bursts.push({ points, velocities, age: 0, life: 1.1 })
  }

  tryCollect(position) {
    for (const relic of this.relics) {
      if (relic.collected) continue
      if (position.distanceTo(relic.position) < 3.2) {
        relic.collected = true
        relic.group.visible = false
        this.collected += 1
        this.spawnBurst(relic.position, 0xffd88a, 34)
        return relic
      }
    }
    return null
  }

  remainingRelics() {
    return this.relics.filter((relic) => !relic.collected)
  }

  update(dt, elapsed) {
    this.timeUniform.value = elapsed

    if (this.bubbles) {
      const array = this.bubbleArray
      for (let i = 0; i < this.bubbleData.length; i += 1) {
        const data = this.bubbleData[i]
        let y = array[i * 3 + 1] + data.speed * dt
        let x = array[i * 3] + Math.sin(elapsed * 0.6 + data.drift) * dt * 0.18
        let z = array[i * 3 + 2] + Math.cos(elapsed * 0.5 + data.drift) * dt * 0.18
        if (y > WATER_Y + 1) {
          y = -7
          x = (Math.random() * 2 - 1) * 30
          z = (Math.random() * 2 - 1) * 30
        }
        array[i * 3] = x
        array[i * 3 + 1] = y
        array[i * 3 + 2] = z
      }
      this.bubbles.geometry.attributes.position.needsUpdate = true
    }

    if (this.plankton) {
      this.plankton.position.y = Math.sin(elapsed * 0.12) * 0.4
      this.plankton.rotation.y = Math.sin(elapsed * 0.02) * 0.05
    }

    for (const fish of this.fish) {
      const angle = elapsed * fish.speed + fish.phase
      const x = fish.centerX + Math.cos(angle) * fish.radius
      const z = fish.centerZ + Math.sin(angle) * fish.radius * 0.82
      const y = fish.baseY + Math.sin(elapsed * 0.6 + fish.wobble) * 0.7 + Math.sin(angle * 2.3) * 0.22
      fish.group.position.set(x, y, z)
      fish.group.rotation.y = Math.atan2(-Math.sin(angle) * fish.speed, Math.cos(angle) * 0.82 * fish.speed)
      fish.group.rotation.z = Math.sin(elapsed * 1.4 + fish.phase) * 0.09
      fish.tail.rotation.y = Math.sin(elapsed * 9 + fish.phase) * 0.5
    }

    for (const jelly of this.jellyfish) {
      jelly.group.position.y = jelly.baseY + Math.sin(elapsed * 0.32 + jelly.phase) * 0.9
      jelly.group.position.x += Math.sin(elapsed * 0.11 + jelly.drift) * dt * 0.08
      jelly.group.position.z += Math.cos(elapsed * 0.13 + jelly.drift) * dt * 0.08
      jelly.group.rotation.y += dt * 0.05
      const pulse = 1 + Math.sin(elapsed * 1.15 + jelly.phase) * 0.09
      jelly.bell.scale.set(pulse, 1 / pulse * 1.03, pulse)
    }

    for (const relic of this.relics) {
      if (relic.collected) continue
      relic.group.position.y = relic.baseY + Math.sin(elapsed * 1.1 + relic.phase) * 0.2
      relic.core.rotation.y += dt * 0.8
      relic.core.rotation.x = Math.sin(elapsed * 0.7 + relic.phase) * 0.3
      relic.cage.rotation.y -= dt * 0.45
      relic.cage.rotation.z += dt * 0.3
      relic.ring.rotation.z += dt * 0.6
      const glow = 0.82 + Math.sin(elapsed * 2.1 + relic.phase) * 0.18
      relic.light.intensity = 16 * glow
      relic.sprite.material.opacity = 0.62 + glow * 0.2
    }

    for (let i = this.bursts.length - 1; i >= 0; i -= 1) {
      const burst = this.bursts[i]
      burst.age += dt
      const positions = burst.points.geometry.attributes.position.array
      for (let p = 0; p < burst.velocities.length; p += 1) {
        const vel = burst.velocities[p]
        vel.y += 0.9 * dt
        vel.multiplyScalar(1 - dt * 0.8)
        positions[p * 3] += vel.x * dt
        positions[p * 3 + 1] += vel.y * dt
        positions[p * 3 + 2] += vel.z * dt
      }
      burst.points.geometry.attributes.position.needsUpdate = true
      burst.points.material.opacity = Math.max(0, 1 - burst.age / burst.life) * 0.9
      if (burst.age >= burst.life) {
        this.scene.remove(burst.points)
        burst.points.geometry.dispose()
        burst.points.material.dispose()
        this.bursts.splice(i, 1)
      }
    }

    if (this.waterSurface) {
      this.waterSurface.position.y = WATER_Y + Math.sin(elapsed * 0.7) * 0.04
    }
  }
}
