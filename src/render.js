import {
  CHAMPIONS,
  LANE,
  MAP_SIZE,
  TEAM,
  TEAM_COLORS,
  clamp,
  distance,
  mulberry32,
  pointSegmentDistance
} from './sim.js'

const TAU = Math.PI * 2
const RIVER_AXIS = { x1: 120, y1: 80, x2: 3080, y2: 3040 }
const RIVER_HALF_WIDTH = 148
const BASE_GLOW = { azure: '#2cb9ff', crimson: '#ff4d79' }

function rgba(hex, alpha) {
  const value = hex.replace('#', '')
  const bigint = parseInt(value.length === 3 ? value.split('').map(character => character + character).join('') : value, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function laneDistance(x, y) {
  let best = Infinity
  for (let index = 0; index < LANE.length - 1; index += 1) {
    best = Math.min(best, pointSegmentDistance(x, y, LANE[index].x, LANE[index].y, LANE[index + 1].x, LANE[index + 1].y))
  }
  return best
}

function riverDistance(x, y) {
  return pointSegmentDistance(x, y, RIVER_AXIS.x1, RIVER_AXIS.y1, RIVER_AXIS.x2, RIVER_AXIS.y2)
}

function createDecorations() {
  const rng = mulberry32(0x51a7c0de)
  const decorations = []
  let attempts = 0
  while (decorations.length < 240 && attempts < 1800) {
    attempts += 1
    const x = 150 + rng() * (MAP_SIZE - 300)
    const y = 150 + rng() * (MAP_SIZE - 300)
    if (laneDistance(x, y) < 245) continue
    if (riverDistance(x, y) < 190) continue
    if (distance(x, y, 420, 2780) < 360) continue
    if (distance(x, y, 2780, 420) < 360) continue
    if (distance(x, y, 1600, 1600) < 260) continue
    const roll = rng()
    const type = roll < 0.46 ? 'tree' : roll < 0.63 ? 'rock' : roll < 0.72 ? 'crystal' : roll < 0.8 ? 'ruin' : roll < 0.92 ? 'grass' : 'mushroom'
    decorations.push({
      x,
      y,
      type,
      scale: 0.65 + rng() * 0.95,
      rotation: rng() * TAU,
      tone: rng(),
      glow: rng()
    })
  }
  const tufts = []
  for (let index = 0; index < 240; index += 1) {
    const segment = Math.floor(rng() * (LANE.length - 1))
    const start = LANE[segment]
    const end = LANE[segment + 1]
    const t = rng()
    const side = rng() < 0.5 ? -1 : 1
    const spread = 138 + rng() * 170
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.hypot(dx, dy) || 1
    const nx = -dy / length
    const ny = dx / length
    tufts.push({
      x: start.x + dx * t + nx * spread * side,
      y: start.y + dy * t + ny * spread * side,
      size: 3 + rng() * 8,
      rotation: rng() * TAU,
      tone: rng()
    })
  }
  return { decorations, tufts }
}

const decorationData = createDecorations()

export class Renderer {
  constructor(canvas, minimapCanvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: false })
    this.minimap = minimapCanvas
    this.minimapCtx = minimapCanvas.getContext('2d')
    this.width = 0
    this.height = 0
    this.dpr = 1
    this.noise = this.createNoise()
    this.glowCache = new Map()
    this.overlay = null
    this.overlayWidth = 0
    this.overlayHeight = 0
    this.worldLayer = null
    this.resize()
  }

  createNoise() {
    const size = 180
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const image = ctx.createImageData(size, size)
    const rng = mulberry32(0x9e3779b9)
    for (let index = 0; index < image.data.length; index += 4) {
      const value = 120 + Math.floor(rng() * 136)
      image.data[index] = value
      image.data[index + 1] = value
      image.data[index + 2] = value
      image.data[index + 3] = 255
    }
    ctx.putImageData(image, 0, 0)
    return canvas
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    if (width === this.width && height === this.height) return
    this.width = width
    this.height = height
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    this.overlay = null
    this.overlayWidth = 0
    this.overlayHeight = 0
    this.canvas.width = Math.floor(width * this.dpr)
    this.canvas.height = Math.floor(height * this.dpr)
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
    if (this.minimap) {
      const rect = this.minimap.getBoundingClientRect()
      const size = Math.max(120, rect.width || 180)
      this.minimap.width = Math.floor(size * this.dpr)
      this.minimap.height = Math.floor(size * this.dpr)
    }
  }

  render(scene) {
    this.resize()
    const { ctx, width, height, dpr } = this
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#040b10'
    ctx.fillRect(0, 0, width, height)
    const camera = scene.camera
    const shake = scene.shake || 0
    const shakeX = (Math.random() - 0.5) * shake * 2
    const shakeY = (Math.random() - 0.5) * shake * 2
    ctx.save()
    ctx.translate(width / 2 + shakeX, height / 2 + shakeY)
    ctx.scale(camera.zoom, camera.zoom)
    ctx.translate(-camera.x, -camera.y)
    this.drawWorld(scene, camera)
    this.drawParticles(scene)
    ctx.restore()
    this.drawAtmosphere(scene)
    if (!scene.menu && scene.match) this.drawMinimap(scene)
  }

  ensureWorldLayer() {
    if (this.worldLayer) return
    const layer = document.createElement('canvas')
    layer.width = MAP_SIZE
    layer.height = MAP_SIZE
    const ctx = layer.getContext('2d', { alpha: false })
    const view = { left: 0, right: MAP_SIZE, top: 0, bottom: MAP_SIZE }
    this.drawGround(ctx, view, 0)
    this.drawRiver(ctx, view, 0)
    this.drawLane(ctx, view, 0)
    this.drawLaneDetail(ctx, view, 0)
    this.drawBases(ctx, { match: null }, 0)
    this.drawDecorations(ctx, view, 0)
    this.worldLayer = layer
  }

  drawRiverShimmer(ctx, view, time) {
    const { x1, y1, x2, y2 } = RIVER_AXIS
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.hypot(dx, dy)
    const nx = -dy / length
    const ny = dx / length
    ctx.save()
    ctx.lineCap = 'round'
    for (let index = 0; index < 18; index += 1) {
      const t = ((index / 18 + time * 0.014) % 1)
      const offset = Math.sin(index * 2.7 + time * 0.3) * RIVER_HALF_WIDTH * 0.75
      const x = x1 + dx * t + nx * offset
      const y = y1 + dy * t + ny * offset
      if (!this.visible(view, x, y, 60)) continue
      ctx.strokeStyle = 'rgba(132, 241, 255, 0.14)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x - dx / length * 26, y - dy / length * 26)
      ctx.lineTo(x + dx / length * 30, y + dy / length * 30)
      ctx.stroke()
    }
    ctx.restore()
  }

  glowSprite(color) {
    let sprite = this.glowCache.get(color)
    if (sprite) return sprite
    const size = 128
    sprite = document.createElement('canvas')
    sprite.width = size
    sprite.height = size
    const ctx = sprite.getContext('2d')
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, rgba(color, 1))
    gradient.addColorStop(0.32, rgba(color, 0.55))
    gradient.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, TAU)
    ctx.fill()
    this.glowCache.set(color, sprite)
    return sprite
  }

  glow(ctx, x, y, radius, color, alpha = 1) {
    const sprite = this.glowSprite(color)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2)
    ctx.restore()
  }

  viewBounds(camera) {
    const halfWidth = this.width / 2 / camera.zoom
    const halfHeight = this.height / 2 / camera.zoom
    return {
      left: camera.x - halfWidth - 240,
      right: camera.x + halfWidth + 240,
      top: camera.y - halfHeight - 240,
      bottom: camera.y + halfHeight + 240
    }
  }

  visible(view, x, y, margin = 0) {
    return x > view.left - margin && x < view.right + margin && y > view.top - margin && y < view.bottom + margin
  }

  drawWorld(scene, camera) {
    const { ctx } = this
    const view = this.viewBounds(camera)
    const time = scene.time
    this.ensureWorldLayer()
    ctx.drawImage(this.worldLayer, 0, 0)
    this.drawRiverShimmer(ctx, view, time)
    this.drawSiteRunes(ctx, scene, time)
    if (scene.match) {
      const match = scene.match
      this.drawDelayed(ctx, match, time)
      this.drawTraps(ctx, match, time)
      this.drawStructures(ctx, match, time, view, !scene.menu)
      if (!scene.menu) {
        this.drawEffects(ctx, match, 'ground', time)
        this.drawMinions(ctx, match, time, view)
        this.drawChampions(ctx, match, time)
        this.drawProjectiles(ctx, match, time)
        this.drawEffects(ctx, match, 'top', time)
        this.drawFloaters(ctx, scene, time)
      }
    }
    this.drawFireflies(ctx, view, time)
  }

  drawGround(ctx, view, time) {
    const gradient = ctx.createLinearGradient(0, 0, MAP_SIZE, MAP_SIZE)
    gradient.addColorStop(0, '#0a1c1d')
    gradient.addColorStop(0.34, '#0a2021')
    gradient.addColorStop(0.7, '#0a1b20')
    gradient.addColorStop(1, '#0a151d')
    ctx.fillStyle = gradient
    ctx.fillRect(-300, -300, MAP_SIZE + 600, MAP_SIZE + 600)
    const glowA = ctx.createRadialGradient(420, 2780, 30, 420, 2780, 900)
    glowA.addColorStop(0, 'rgba(27, 127, 214, 0.16)')
    glowA.addColorStop(0.5, 'rgba(19, 96, 112, 0.07)')
    glowA.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glowA
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)
    const glowB = ctx.createRadialGradient(2780, 420, 30, 2780, 420, 900)
    glowB.addColorStop(0, 'rgba(184, 36, 76, 0.15)')
    glowB.addColorStop(0.5, 'rgba(89, 26, 58, 0.07)')
    glowB.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glowB
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)
    const center = ctx.createRadialGradient(1600, 1600, 40, 1600, 1600, 1050)
    center.addColorStop(0, 'rgba(44, 179, 177, 0.08)')
    center.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = center
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)
    const rng = mulberry32(0x1a2b3c)
    ctx.fillStyle = 'rgba(3, 10, 12, 0.32)'
    for (let index = 0; index < 160; index += 1) {
      const x = rng() * MAP_SIZE
      const y = rng() * MAP_SIZE
      if (!this.visible(view, x, y, 80)) continue
      const radius = 14 + rng() * 70
      ctx.beginPath()
      ctx.ellipse(x, y, radius, radius * (0.35 + rng() * 0.5), rng() * TAU, 0, TAU)
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(72, 125, 120, 0.16)'
    ctx.lineWidth = 2
    for (let index = 0; index < 26; index += 1) {
      const x = 160 + rng() * (MAP_SIZE - 320)
      const y = 160 + rng() * (MAP_SIZE - 320)
      if (!this.visible(view, x, y, 100)) continue
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.bezierCurveTo(x + 40, y + 18, x + 80, y - 22, x + 140, y + 4)
      ctx.stroke()
    }
  }

  drawRiver(ctx, view, time) {
    const { x1, y1, x2, y2 } = RIVER_AXIS
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.hypot(dx, dy)
    const nx = -dy / length
    const ny = dx / length
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, '#082b3c')
    gradient.addColorStop(0.35, '#0c4a5a')
    gradient.addColorStop(0.55, '#0a3f56')
    gradient.addColorStop(1, '#062432')
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(2, 8, 13, 0.72)'
    ctx.lineWidth = RIVER_HALF_WIDTH * 2 + 58
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.strokeStyle = gradient
    ctx.lineWidth = RIVER_HALF_WIDTH * 2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(66, 214, 226, 0.08)'
    ctx.lineWidth = RIVER_HALF_WIDTH * 1.68
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    const rng = mulberry32(0x4dd0cafe)
    ctx.lineCap = 'round'
    for (let index = 0; index < 100; index += 1) {
      const t = rng()
      const offset = (rng() - 0.5) * RIVER_HALF_WIDTH * 1.55
      const x = x1 + dx * t + nx * offset
      const y = y1 + dy * t + ny * offset
      if (!this.visible(view, x, y, 70)) continue
      const flow = Math.sin(time * 0.8 + index) * 10
      ctx.strokeStyle = `rgba(120, 236, 255, ${0.04 + rng() * 0.1})`
      ctx.lineWidth = 1 + rng() * 2
      ctx.beginPath()
      ctx.moveTo(x - dx / length * 22 + flow, y - dy / length * 22)
      ctx.lineTo(x + dx / length * (26 + rng() * 26) + flow, y + dy / length * (26 + rng() * 26))
      ctx.stroke()
    }
    for (let index = 0; index < 34; index += 1) {
      const t = (index / 34 + time * 0.012) % 1
      const offset = Math.sin(index * 2.7) * RIVER_HALF_WIDTH * 0.85
      const x = x1 + dx * t + nx * offset
      const y = y1 + dy * t + ny * offset
      if (!this.visible(view, x, y, 50)) continue
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 28)
      glow.addColorStop(0, 'rgba(147, 250, 255, 0.22)')
      glow.addColorStop(1, 'rgba(147, 250, 255, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, 28, 0, TAU)
      ctx.fill()
    }
  }

  drawLane(ctx, view, time) {
    const drawPath = () => {
      ctx.beginPath()
      ctx.moveTo(LANE[0].x, LANE[0].y)
      for (let index = 1; index < LANE.length; index += 1) ctx.lineTo(LANE[index].x, LANE[index].y)
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(1, 8, 10, 0.55)'
    ctx.lineWidth = 344
    drawPath()
    ctx.stroke()
    const gradient = ctx.createLinearGradient(LANE[0].x, LANE[0].y, LANE[6].x, LANE[6].y)
    gradient.addColorStop(0, '#263b3b')
    gradient.addColorStop(0.28, '#2b4140')
    gradient.addColorStop(0.5, '#304643')
    gradient.addColorStop(0.72, '#2c3f40')
    gradient.addColorStop(1, '#2a393d')
    ctx.strokeStyle = gradient
    ctx.lineWidth = 300
    drawPath()
    ctx.stroke()
    ctx.strokeStyle = 'rgba(111, 180, 166, 0.075)'
    ctx.lineWidth = 250
    drawPath()
    ctx.stroke()
    ctx.strokeStyle = 'rgba(142, 240, 255, 0.11)'
    ctx.lineWidth = 3
    ctx.setLineDash([7, 26])
    ctx.lineDashOffset = -time * 24
    drawPath()
    ctx.stroke()
    ctx.setLineDash([])
    const bridgeAngle = Math.atan2(LANE[4].y - LANE[2].y, LANE[4].x - LANE[2].x)
    const bx = Math.cos(bridgeAngle)
    const by = Math.sin(bridgeAngle)
    const px = -by
    const py = bx
    ctx.save()
    ctx.translate(1600, 1600)
    ctx.strokeStyle = 'rgba(14, 27, 28, 0.9)'
    ctx.lineWidth = 28
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-bx * 210 + px * 154 * side, -by * 210 + py * 154 * side)
      ctx.lineTo(bx * 210 + px * 154 * side, by * 210 + py * 154 * side)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(129, 186, 176, 0.32)'
    ctx.lineWidth = 4
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-bx * 210 + px * 152 * side, -by * 210 + py * 152 * side)
      ctx.lineTo(bx * 210 + px * 152 * side, by * 210 + py * 152 * side)
      ctx.stroke()
    }
    ctx.restore()
    const centerGlow = ctx.createRadialGradient(1600, 1600, 0, 1600, 1600, 420)
    centerGlow.addColorStop(0, 'rgba(92, 236, 224, 0.1)')
    centerGlow.addColorStop(1, 'rgba(92, 236, 224, 0)')
    ctx.fillStyle = centerGlow
    ctx.beginPath()
    ctx.arc(1600, 1600, 420, 0, TAU)
    ctx.fill()
    void view
  }

  drawLaneDetail(ctx, view, time) {
    const rng = mulberry32(0x77aa33)
    for (let index = 0; index < 250; index += 1) {
      const segment = Math.floor(rng() * (LANE.length - 1))
      const start = LANE[segment]
      const end = LANE[segment + 1]
      const t = rng()
      const side = (rng() - 0.5) * 250
      const dx = end.x - start.x
      const dy = end.y - start.y
      const length = Math.hypot(dx, dy)
      const x = start.x + dx * t - (dy / length) * side
      const y = start.y + dy * t + (dx / length) * side
      if (!this.visible(view, x, y, 40)) continue
      const size = 2 + rng() * 9
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rng() * TAU)
      ctx.fillStyle = rng() < 0.5 ? 'rgba(10, 23, 24, 0.45)' : 'rgba(100, 140, 132, 0.18)'
      ctx.beginPath()
      ctx.moveTo(-size, size * 0.4)
      ctx.lineTo(size * 1.4, 0)
      ctx.lineTo(-size * 0.4, -size)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    for (let index = 0; index < decorationData.tufts.length; index += 1) {
      const tuft = decorationData.tufts[index]
      if (!this.visible(view, tuft.x, tuft.y, 30)) continue
      const sway = Math.sin(time * 0.7 + index) * 2
      ctx.strokeStyle = tuft.tone < 0.5 ? 'rgba(74, 122, 104, 0.4)' : 'rgba(96, 142, 113, 0.34)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(tuft.x, tuft.y + 3)
      ctx.quadraticCurveTo(tuft.x + tuft.size * 0.3 + sway, tuft.y - tuft.size * 0.5, tuft.x + sway, tuft.y - tuft.size)
      ctx.moveTo(tuft.x, tuft.y + 3)
      ctx.quadraticCurveTo(tuft.x - tuft.size * 0.4 + sway, tuft.y - tuft.size * 0.35, tuft.x - tuft.size * 0.45 + sway, tuft.y - tuft.size * 0.8)
      ctx.stroke()
    }
  }

  drawBases(ctx, scene, time) {
    for (const team of [TEAM.AZURE, TEAM.CRIMSON]) {
      const base = team === TEAM.AZURE ? { x: 420, y: 2780 } : { x: 2780, y: 420 }
      const color = TEAM_COLORS[team]
      const glow = ctx.createRadialGradient(base.x, base.y, 0, base.x, base.y, 430)
      glow.addColorStop(0, rgba(BASE_GLOW[team], 0.24))
      glow.addColorStop(0.4, rgba(BASE_GLOW[team], 0.08))
      glow.addColorStop(1, rgba(BASE_GLOW[team], 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(base.x, base.y, 430, 0, TAU)
      ctx.fill()
      for (let ring = 0; ring < 4; ring += 1) {
        ctx.strokeStyle = rgba(color.primary, 0.1 + ring * 0.04)
        ctx.lineWidth = ring === 0 ? 4 : 2
        ctx.beginPath()
        ctx.arc(base.x, base.y, 150 + ring * 52, 0, TAU)
        ctx.stroke()
      }
      ctx.save()
      ctx.translate(base.x, base.y)
      ctx.rotate(time * 0.08 * (team === TEAM.AZURE ? 1 : -1))
      ctx.strokeStyle = rgba(color.primary, 0.24)
      ctx.lineWidth = 2
      ctx.setLineDash([26, 18, 6, 18])
      ctx.beginPath()
      ctx.arc(0, 0, 248, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
      for (let index = 0; index < 8; index += 1) {
        const angle = index / 8 * TAU
        ctx.save()
        ctx.rotate(angle)
        ctx.fillStyle = rgba(color.primary, 0.18)
        ctx.beginPath()
        ctx.moveTo(0, -256)
        ctx.lineTo(-13, -286)
        ctx.lineTo(13, -286)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()
      void scene
    }
  }

  drawDecorations(ctx, view, time) {
    for (const decoration of decorationData.decorations) {
      if (!this.visible(view, decoration.x, decoration.y, 120)) continue
      ctx.save()
      ctx.translate(decoration.x, decoration.y)
      ctx.scale(decoration.scale, decoration.scale)
      ctx.rotate(decoration.rotation * 0.08)
      if (decoration.type === 'tree') this.drawTree(ctx, decoration, time)
      if (decoration.type === 'rock') this.drawRock(ctx, decoration)
      if (decoration.type === 'crystal') this.drawCrystal(ctx, decoration, time)
      if (decoration.type === 'ruin') this.drawRuin(ctx, decoration)
      if (decoration.type === 'grass') this.drawBush(ctx, decoration)
      if (decoration.type === 'mushroom') this.drawMushroom(ctx, decoration, time)
      ctx.restore()
    }
  }

  drawTree(ctx, decoration, time) {
    const tint = decoration.tone
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.beginPath()
    ctx.ellipse(4, 30, 42, 15, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#1b2420'
    ctx.fillRect(-5, -4, 10, 36)
    const sway = Math.sin(time * 0.4 + decoration.rotation) * 2
    const colors = tint < 0.5
      ? ['#153b30', '#1c4a39', '#255943', '#2f6b4d']
      : ['#173a38', '#1d4a45', '#275b51', '#2f6b5c']
    for (let index = 0; index < 7; index += 1) {
      const angle = decoration.rotation + index * 1.9
      const radius = 18 + (index % 3) * 13
      const x = Math.cos(angle) * radius + sway
      const y = -34 - (index % 4) * 11
      const size = 22 + (index % 3) * 7
      ctx.fillStyle = colors[index % colors.length]
      ctx.beginPath()
      ctx.arc(x, y, size, 0, TAU)
      ctx.fill()
      ctx.fillStyle = 'rgba(120, 190, 148, 0.09)'
      ctx.beginPath()
      ctx.arc(x - size * 0.25, y - size * 0.28, size * 0.45, 0, TAU)
      ctx.fill()
    }
    if (decoration.glow > 0.72) {
      ctx.fillStyle = 'rgba(125, 255, 210, 0.16)'
      for (let index = 0; index < 4; index += 1) {
        ctx.beginPath()
        ctx.arc(-18 + index * 12, -22 - index * 5, 2, 0, TAU)
        ctx.fill()
      }
    }
  }

  drawRock(ctx, decoration) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.beginPath()
    ctx.ellipse(2, 13, 28, 10, 0, 0, TAU)
    ctx.fill()
    const gradient = ctx.createLinearGradient(-20, -25, 25, 20)
    gradient.addColorStop(0, '#3a4a48')
    gradient.addColorStop(0.5, '#263836')
    gradient.addColorStop(1, '#152522')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(-24, 9)
    ctx.lineTo(-13, -19)
    ctx.lineTo(7, -27)
    ctx.lineTo(25, -8)
    ctx.lineTo(21, 12)
    ctx.lineTo(-4, 20)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(126, 170, 158, 0.18)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    if (decoration.glow > 0.55) {
      ctx.strokeStyle = 'rgba(105, 230, 210, 0.22)'
      ctx.beginPath()
      ctx.moveTo(-4, -3)
      ctx.lineTo(8, 4)
      ctx.lineTo(3, 12)
      ctx.stroke()
    }
  }

  drawCrystal(ctx, decoration, time) {
    const glow = ctx.createRadialGradient(0, -8, 0, 0, -8, 52)
    glow.addColorStop(0, 'rgba(87, 239, 226, 0.26)')
    glow.addColorStop(1, 'rgba(87, 239, 226, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, -8, 52, 0, TAU)
    ctx.fill()
    const pulse = 0.85 + Math.sin(time * 1.6 + decoration.rotation) * 0.15
    ctx.save()
    ctx.scale(pulse, pulse)
    const gradient = ctx.createLinearGradient(0, -44, 0, 18)
    gradient.addColorStop(0, '#9dfff2')
    gradient.addColorStop(0.45, '#42c6c4')
    gradient.addColorStop(1, '#1b666f')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, -46)
    ctx.lineTo(14, -13)
    ctx.lineTo(7, 14)
    ctx.lineTo(-7, 18)
    ctx.lineTo(-15, -9)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(190, 255, 248, 0.4)'
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.restore()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(0, 22, 22, 8, 0, 0, TAU)
    ctx.fill()
  }

  drawRuin(ctx, decoration) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)'
    ctx.beginPath()
    ctx.ellipse(0, 16, 34, 12, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#273631'
    ctx.fillRect(-27, 2, 54, 10)
    ctx.fillStyle = '#34443e'
    for (let index = -1; index <= 1; index += 1) {
      const height = 20 + (index === 0 ? 24 : 10)
      ctx.fillRect(index * 18 - 6, 4 - height, 12, height)
      ctx.fillStyle = 'rgba(150, 186, 170, 0.12)'
      ctx.fillRect(index * 18 - 6, 4 - height, 3, height)
      ctx.fillStyle = '#34443e'
    }
    if (decoration.glow > 0.6) {
      ctx.fillStyle = 'rgba(112, 246, 189, 0.25)'
      ctx.beginPath()
      ctx.arc(0, -18, 3, 0, TAU)
      ctx.fill()
    }
  }

  drawBush(ctx, decoration) {
    ctx.fillStyle = 'rgba(24, 63, 47, 0.62)'
    for (let index = 0; index < 4; index += 1) {
      ctx.beginPath()
      ctx.arc(-14 + index * 9, -6 - (index % 2) * 6, 13 + (index % 3) * 3, 0, TAU)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(109, 172, 112, 0.16)'
    ctx.beginPath()
    ctx.arc(-8, -14, 7, 0, TAU)
    ctx.fill()
    void decoration
  }

  drawMushroom(ctx, decoration, time) {
    const glow = 0.5 + Math.sin(time * 1.8 + decoration.rotation) * 0.18
    ctx.fillStyle = `rgba(111, 255, 202, ${glow * 0.22})`
    ctx.beginPath()
    ctx.arc(0, -12, 40, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#d7f3dc'
    ctx.fillRect(-3, -10, 6, 17)
    ctx.fillStyle = '#5ff0b8'
    ctx.beginPath()
    ctx.ellipse(0, -13, 16, 9, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = 'rgba(230, 255, 245, 0.75)'
    ctx.beginPath()
    ctx.arc(-5, -15, 2, 0, TAU)
    ctx.arc(5, -12, 1.6, 0, TAU)
    ctx.fill()
  }

  drawSiteRunes(ctx, scene, time) {
    for (const site of scene.match?.structures || []) {
      if (site.type === 'nexus') continue
      if (!site.alive) continue
      const color = TEAM_COLORS[site.team]
      ctx.save()
      ctx.translate(site.x, site.y)
      ctx.rotate(time * 0.18 * (site.team === TEAM.AZURE ? 1 : -1))
      ctx.strokeStyle = rgba(color.primary, 0.24)
      ctx.lineWidth = 2
      ctx.setLineDash([12, 10])
      ctx.beginPath()
      ctx.arc(0, 0, 94, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }
  }

  drawStructures(ctx, match, time, view, showUi = true) {
    const uiView = { left: view.left + 240, right: view.right - 240, top: view.top + 240, bottom: view.bottom - 240 }
    for (const structure of match.structures) {
      if (!this.visible(view, structure.x, structure.y, 220)) continue
      const barOffset = structure.type === 'nexus' ? 290 : 152
      const barMargin = structure.type === 'nexus' ? 125 : 60
      const ui = showUi && this.visible(uiView, structure.x, structure.y - barOffset, -barMargin)
      if (structure.type === 'nexus') this.drawNexus(ctx, match, structure, time, ui)
      else this.drawTower(ctx, match, structure, time, ui)
    }
  }

  drawTower(ctx, match, tower, time, showUi = true) {
    const color = TEAM_COLORS[tower.team]
    const bob = Math.sin(time * 1.4 + tower.pulse) * 3
    ctx.save()
    ctx.translate(tower.x, tower.y)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)'
    ctx.beginPath()
    ctx.ellipse(0, 22, 64, 22, 0, 0, TAU)
    ctx.fill()
    if (!tower.alive) {
      ctx.fillStyle = '#1a2827'
      ctx.beginPath()
      ctx.moveTo(-52, 12)
      ctx.lineTo(-22, -20)
      ctx.lineTo(12, -8)
      ctx.lineTo(42, 4)
      ctx.lineTo(30, 20)
      ctx.lineTo(-14, 26)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#2b3a37'
      ctx.beginPath()
      ctx.moveTo(-18, 14)
      ctx.lineTo(-2, -8)
      ctx.lineTo(20, 6)
      ctx.lineTo(12, 20)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(120, 90, 90, 0.2)'
      ctx.stroke()
      ctx.restore()
      return
    }
    for (let index = 0; index < 3; index += 1) {
      ctx.strokeStyle = rgba(color.primary, 0.16 + index * 0.03)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, 16, 74 + index * 16, 26 + index * 5, 0, 0, TAU)
      ctx.stroke()
    }
    const glow = ctx.createRadialGradient(0, -78, 0, 0, -78, 126)
    glow.addColorStop(0, rgba(color.glow, 0.32))
    glow.addColorStop(0.35, rgba(color.primary, 0.15))
    glow.addColorStop(1, rgba(color.primary, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, -78, 126, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#1b2c2c'
    ctx.beginPath()
    ctx.moveTo(-38, 18)
    ctx.lineTo(-27, -58)
    ctx.lineTo(27, -58)
    ctx.lineTo(40, 18)
    ctx.closePath()
    ctx.fill()
    const stone = ctx.createLinearGradient(-28, 0, 34, 0)
    stone.addColorStop(0, '#243532')
    stone.addColorStop(0.45, '#425752')
    stone.addColorStop(1, '#1b2a29')
    ctx.fillStyle = stone
    ctx.beginPath()
    ctx.moveTo(-30, 16)
    ctx.lineTo(-21, -52)
    ctx.lineTo(21, -52)
    ctx.lineTo(30, 16)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = rgba(color.primary, 0.26)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-22, -22)
    ctx.lineTo(22, -22)
    ctx.moveTo(-25, -4)
    ctx.lineTo(25, -4)
    ctx.stroke()
    ctx.fillStyle = '#162523'
    ctx.beginPath()
    ctx.ellipse(0, -54, 30, 10, 0, 0, TAU)
    ctx.fill()
    ctx.save()
    ctx.translate(0, -92 + bob)
    ctx.rotate(time * 0.8)
    ctx.strokeStyle = rgba(color.primary, 0.42)
    ctx.lineWidth = 1.6
    ctx.setLineDash([8, 7])
    ctx.beginPath()
    ctx.ellipse(0, 0, 30, 12, 0, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
    ctx.save()
    ctx.translate(0, -94 + bob)
    const crystal = ctx.createLinearGradient(0, -34, 0, 24)
    crystal.addColorStop(0, '#f4ffff')
    crystal.addColorStop(0.3, color.glow)
    crystal.addColorStop(0.7, color.primary)
    crystal.addColorStop(1, color.dark)
    ctx.fillStyle = crystal
    ctx.beginPath()
    ctx.moveTo(0, -38)
    ctx.lineTo(17, -7)
    ctx.lineTo(10, 22)
    ctx.lineTo(-10, 22)
    ctx.lineTo(-17, -7)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(240, 255, 255, 0.55)'
    ctx.lineWidth = 1.4
    ctx.stroke()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    ctx.beginPath()
    ctx.moveTo(0, -35)
    ctx.lineTo(5, -8)
    ctx.lineTo(-3, 16)
    ctx.lineTo(-8, -6)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    if (showUi) this.drawHealthBar(ctx, 0, -152, 108, 10, tower.hp / tower.maxHp, color.primary, false, tower.type === 'tower-inner' ? 'INNER' : 'OUTER')
    ctx.restore()
    void match
  }

  drawNexus(ctx, match, nexus, time, showUi = true) {
    const color = TEAM_COLORS[nexus.team]
    const shielded = match.structures.some(structure => structure.team === nexus.team && structure.alive && structure.type.startsWith('tower'))
    const bob = Math.sin(time * 1.1 + nexus.pulse) * 6
    ctx.save()
    ctx.translate(nexus.x, nexus.y)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.48)'
    ctx.beginPath()
    ctx.ellipse(0, 42, 150, 46, 0, 0, TAU)
    ctx.fill()
    if (!nexus.alive) {
      ctx.fillStyle = '#162322'
      ctx.beginPath()
      ctx.moveTo(-120, 28)
      ctx.lineTo(-62, -24)
      ctx.lineTo(-10, -6)
      ctx.lineTo(44, -44)
      ctx.lineTo(120, 16)
      ctx.lineTo(64, 44)
      ctx.lineTo(-35, 52)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      return
    }
    const aura = ctx.createRadialGradient(0, -70, 0, 0, -70, 310)
    aura.addColorStop(0, rgba(color.glow, 0.3))
    aura.addColorStop(0.35, rgba(color.primary, 0.14))
    aura.addColorStop(1, rgba(color.primary, 0))
    ctx.fillStyle = aura
    ctx.beginPath()
    ctx.arc(0, -70, 310, 0, TAU)
    ctx.fill()
    for (let ring = 0; ring < 4; ring += 1) {
      ctx.strokeStyle = rgba(color.primary, 0.16 + ring * 0.04)
      ctx.lineWidth = ring === 0 ? 3 : 1.5
      ctx.beginPath()
      ctx.ellipse(0, 30 - ring * 4, 150 + ring * 24, 50 + ring * 9, 0, 0, TAU)
      ctx.stroke()
    }
    ctx.save()
    ctx.translate(0, 30)
    ctx.rotate(time * 0.14 * (nexus.team === TEAM.AZURE ? 1 : -1))
    ctx.strokeStyle = rgba(color.primary, 0.34)
    ctx.lineWidth = 2
    ctx.setLineDash([38, 24, 8, 24])
    ctx.beginPath()
    ctx.ellipse(0, 0, 205, 68, 0, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([])
    for (let index = 0; index < 12; index += 1) {
      ctx.save()
      ctx.rotate(index / 12 * TAU)
      ctx.fillStyle = rgba(color.primary, 0.2)
      ctx.beginPath()
      ctx.moveTo(0, -205)
      ctx.lineTo(-10, -228)
      ctx.lineTo(10, -228)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    ctx.restore()
    ctx.fillStyle = '#1d2f2c'
    ctx.beginPath()
    ctx.moveTo(-72, 44)
    ctx.lineTo(-42, -24)
    ctx.lineTo(42, -24)
    ctx.lineTo(72, 44)
    ctx.closePath()
    ctx.fill()
    const base = ctx.createLinearGradient(-52, 0, 62, 0)
    base.addColorStop(0, '#263b37')
    base.addColorStop(0.45, '#48615a')
    base.addColorStop(1, '#1a2a28')
    ctx.fillStyle = base
    ctx.beginPath()
    ctx.moveTo(-58, 42)
    ctx.lineTo(-32, -16)
    ctx.lineTo(32, -16)
    ctx.lineTo(58, 42)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = rgba(color.primary, 0.35)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-40, 8)
    ctx.lineTo(40, 8)
    ctx.stroke()
    ctx.save()
    ctx.translate(0, -100 + bob)
    ctx.rotate(time * 0.35)
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = rgba(color.glow, 0.5 - ring * 0.1)
      ctx.lineWidth = 2 - ring * 0.4
      ctx.beginPath()
      ctx.ellipse(0, 0, 86 + ring * 18, 28 + ring * 6, ring * 0.6, 0, TAU)
      ctx.stroke()
    }
    ctx.restore()
    ctx.save()
    ctx.translate(0, -116 + bob)
    const crystal = ctx.createLinearGradient(0, -96, 0, 60)
    crystal.addColorStop(0, '#ffffff')
    crystal.addColorStop(0.22, color.glow)
    crystal.addColorStop(0.6, color.primary)
    crystal.addColorStop(1, '#132c3a')
    ctx.fillStyle = crystal
    ctx.beginPath()
    ctx.moveTo(0, -118)
    ctx.lineTo(42, -34)
    ctx.lineTo(26, 58)
    ctx.lineTo(-26, 58)
    ctx.lineTo(-42, -34)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'
    ctx.beginPath()
    ctx.moveTo(0, -108)
    ctx.lineTo(12, -38)
    ctx.lineTo(-5, 46)
    ctx.lineTo(-17, -34)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    if (shielded) {
      const pulse = 0.55 + Math.sin(time * 2.2) * 0.12
      const shield = ctx.createRadialGradient(0, -50, 40, 0, -50, 260)
      shield.addColorStop(0, rgba(color.primary, 0.02))
      shield.addColorStop(0.75, rgba(color.primary, 0.06))
      shield.addColorStop(1, rgba(color.glow, pulse * 0.2))
      ctx.fillStyle = shield
      ctx.beginPath()
      ctx.ellipse(0, -40, 255, 235, 0, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = rgba(color.glow, pulse * 0.5)
      ctx.lineWidth = 2
      ctx.setLineDash([18, 16])
      ctx.beginPath()
      ctx.ellipse(0, -40, 255, 235, 0, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
    }
    if (showUi) this.drawHealthBar(ctx, 0, -290, 230, 13, nexus.hp / nexus.maxHp, color.primary, false, shielded ? 'NEXUS SHIELDED' : 'NEXUS')
    ctx.restore()
  }

  drawHealthBar(ctx, x, y, width, height, ratio, color, isPlayer, label) {
    const clamped = clamp(ratio, 0, 1)
    ctx.fillStyle = 'rgba(2, 7, 10, 0.82)'
    roundRect(ctx, x - width / 2 - 2, y - 2, width + 4, height + 4, height / 2 + 1)
    ctx.fill()
    const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y)
    gradient.addColorStop(0, rgba(color, 0.55))
    gradient.addColorStop(0.5, color)
    gradient.addColorStop(1, rgba(color, 0.65))
    ctx.fillStyle = gradient
    roundRect(ctx, x - width / 2, y, width * clamped, height, height / 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    roundRect(ctx, x - width / 2, y, width * clamped, Math.max(1, height * 0.36), height / 3)
    ctx.fill()
    ctx.strokeStyle = 'rgba(210, 246, 255, 0.22)'
    ctx.lineWidth = 1
    for (let index = 1; index < 4; index += 1) {
      const tickX = x - width / 2 + width * (index / 4)
      ctx.beginPath()
      ctx.moveTo(tickX, y)
      ctx.lineTo(tickX, y + height)
      ctx.stroke()
    }
    if (label) {
      ctx.font = `${isPlayer ? '700' : '600'} ${Math.max(9, height + 1)}px "Trebuchet MS", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(215, 240, 246, 0.68)'
      ctx.fillText(label, x, y - 6)
    }
  }

  drawChampions(ctx, match, time) {
    for (const champion of match.champions) {
      if (champion.id === match.player.id) continue
      if (!champion.dead) this.drawChampion(ctx, champion, time, false)
    }
    if (!match.player.dead) this.drawChampion(ctx, match.player, time, true)
  }

  drawChampion(ctx, champion, time, isPlayer) {
    const data = CHAMPIONS[champion.championId]
    const team = TEAM_COLORS[champion.team]
    const bob = champion.dead ? 0 : Math.sin(time * 3.4 + champion.bob) * 2
    ctx.save()
    ctx.translate(champion.x, champion.y)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.44)'
    ctx.beginPath()
    ctx.ellipse(0, 18, 30, 12, 0, 0, TAU)
    ctx.fill()
    if (isPlayer) {
      ctx.save()
      ctx.rotate(time * 0.5)
      ctx.strokeStyle = 'rgba(142, 240, 255, 0.7)'
      ctx.lineWidth = 2.4
      ctx.setLineDash([20, 12])
      ctx.beginPath()
      ctx.arc(0, 12, 42, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.strokeStyle = 'rgba(255, 221, 128, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 12, 50, 0, TAU)
      ctx.stroke()
      ctx.restore()
    } else {
      ctx.strokeStyle = rgba(team.primary, 0.42)
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.ellipse(0, 14, 36, 15, 0, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
    }
    const aura = ctx.createRadialGradient(0, -12, 0, 0, -12, 80)
    aura.addColorStop(0, rgba(data.color, isPlayer ? 0.2 : 0.12))
    aura.addColorStop(1, rgba(data.color, 0))
    ctx.fillStyle = aura
    ctx.beginPath()
    ctx.arc(0, -12, 80, 0, TAU)
    ctx.fill()
    ctx.save()
    ctx.translate(0, bob)
    ctx.rotate(champion.facing + Math.PI / 2)
    const cloakGradient = ctx.createLinearGradient(0, -10, 0, 54)
    cloakGradient.addColorStop(0, data.cloak)
    cloakGradient.addColorStop(1, rgba(data.cloak, 0.15))
    ctx.fillStyle = cloakGradient
    ctx.beginPath()
    ctx.moveTo(-18, -2)
    ctx.quadraticCurveTo(-34, 26, -20, 52)
    ctx.quadraticCurveTo(0, 40, 20, 52)
    ctx.quadraticCurveTo(34, 26, 18, -2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.translate(0, bob)
    const body = ctx.createRadialGradient(-7, -16, 2, 0, 0, 40)
    body.addColorStop(0, '#f6fbff')
    body.addColorStop(0.16, data.color)
    body.addColorStop(0.6, data.accent)
    body.addColorStop(1, data.cloak)
    ctx.fillStyle = body
    ctx.beginPath()
    ctx.ellipse(0, -8, 20, 26, 0, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = isPlayer ? 'rgba(200, 250, 255, 0.75)' : 'rgba(30, 0, 10, 0.65)'
    ctx.lineWidth = 1.6
    ctx.stroke()
    ctx.fillStyle = '#f2e4d0'
    ctx.beginPath()
    ctx.arc(0, -30, 10, 0, TAU)
    ctx.fill()
    ctx.fillStyle = rgba(data.color, 0.9)
    ctx.beginPath()
    ctx.arc(0, -35, 10, Math.PI, TAU)
    ctx.fill()
    ctx.fillStyle = 'rgba(20, 10, 18, 0.85)'
    ctx.beginPath()
    ctx.arc(-3.4, -29, 1.4, 0, TAU)
    ctx.arc(3.4, -29, 1.4, 0, TAU)
    ctx.fill()
    this.drawWeapon(ctx, champion, time)
    ctx.restore()
    if (champion.shield > 0) {
      ctx.strokeStyle = 'rgba(255, 232, 160, 0.75)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, -10, 34, 0, TAU)
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 232, 160, 0.09)'
      ctx.fill()
    }
    if (champion.root > 0) {
      ctx.strokeStyle = 'rgba(167, 127, 255, 0.8)'
      ctx.lineWidth = 2.5
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.ellipse(0, 16, 34, 13, 0, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
      for (let index = 0; index < 4; index += 1) {
        const angle = index / 4 * TAU + time
        ctx.beginPath()
        ctx.moveTo(Math.cos(angle) * 16, 8)
        ctx.lineTo(Math.cos(angle) * 30, -8)
        ctx.stroke()
      }
    }
    if (champion.stun > 0) {
      for (let index = 0; index < 3; index += 1) {
        const angle = time * 4 + index / 3 * TAU
        ctx.fillStyle = '#ffe68a'
        ctx.beginPath()
        ctx.arc(Math.cos(angle) * 18, -56 + Math.sin(angle) * 5, 2.6, 0, TAU)
        ctx.fill()
      }
    }
    const barY = -68
    this.drawHealthBar(ctx, 0, barY, 104, 9, champion.hp / champion.maxHp, isPlayer ? '#72f3a4' : '#ff6f89', true)
    ctx.fillStyle = 'rgba(2, 7, 12, 0.76)'
    roundRect(ctx, -52, barY + 11, 104, 5, 3)
    ctx.fill()
    ctx.fillStyle = isPlayer ? '#5ab8ff' : '#c06bff'
    roundRect(ctx, -52, barY + 11, 104 * clamp(champion.mana / champion.maxMana, 0, 1), 5, 3)
    ctx.fill()
    ctx.fillStyle = 'rgba(3, 9, 14, 0.88)'
    ctx.beginPath()
    ctx.arc(-60, barY + 8, 12, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = isPlayer ? 'rgba(142, 240, 255, 0.9)' : rgba(team.primary, 0.8)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#eefbff'
    ctx.font = '700 12px "Trebuchet MS", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(champion.level), -60, barY + 12)
    ctx.font = '600 12px "Trebuchet MS", sans-serif'
    ctx.fillStyle = isPlayer ? 'rgba(210, 250, 255, 0.92)' : 'rgba(255, 205, 214, 0.9)'
    ctx.fillText(isPlayer ? champion.name : `${champion.name} · ${data.role}`, 0, barY - 14)
    ctx.restore()
  }

  drawWeapon(ctx, champion, time) {
    const data = CHAMPIONS[champion.championId]
    if (champion.championId === 'aurelia') {
      ctx.save()
      ctx.translate(25, -14)
      ctx.rotate(-0.5 + Math.sin(time * 2.2 + champion.bob) * 0.08)
      const blade = ctx.createLinearGradient(0, -62, 0, 18)
      blade.addColorStop(0, '#fffbe5')
      blade.addColorStop(0.45, data.color)
      blade.addColorStop(1, '#a66328')
      ctx.fillStyle = blade
      ctx.beginPath()
      ctx.moveTo(0, -64)
      ctx.lineTo(7, -10)
      ctx.lineTo(0, 20)
      ctx.lineTo(-7, -10)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 252, 220, 0.85)'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#f3ce7c'
      ctx.fillRect(-8, 8, 16, 4)
      ctx.fillStyle = '#5c2d17'
      ctx.fillRect(-2, 12, 4, 12)
      ctx.restore()
      ctx.save()
      ctx.translate(-24, -6)
      ctx.rotate(-0.18)
      ctx.fillStyle = '#173445'
      ctx.beginPath()
      ctx.ellipse(0, 0, 9, 15, 0, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = rgba(data.color, 0.9)
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
      return
    }
    if (champion.championId === 'kael') {
      ctx.save()
      ctx.translate(16, -10)
      ctx.rotate(Math.sin(time * 2 + champion.bob) * 0.05)
      ctx.strokeStyle = data.color
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, 0, 27, -1.2, 1.2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(220, 255, 250, 0.65)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(9, -26)
      ctx.lineTo(9, 26)
      ctx.stroke()
      ctx.restore()
      return
    }
    ctx.save()
    ctx.translate(17, -12)
    ctx.rotate(-0.35)
    ctx.strokeStyle = '#7a5a3a'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, -34)
    ctx.lineTo(0, 24)
    ctx.stroke()
    const orb = ctx.createRadialGradient(0, -40, 0, 0, -40, 13)
    orb.addColorStop(0, '#ffffff')
    orb.addColorStop(0.35, data.color)
    orb.addColorStop(1, 'rgba(90, 40, 180, 0)')
    ctx.fillStyle = orb
    ctx.beginPath()
    ctx.arc(0, -40, 13, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  drawMinions(ctx, match, time, view) {
    for (const minion of match.minions) {
      if (!minion.alive || !this.visible(view, minion.x, minion.y, 60)) continue
      const color = TEAM_COLORS[minion.team]
      const bob = Math.sin(time * 5 + minion.bob) * 1.4
      ctx.save()
      ctx.translate(minion.x, minion.y)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
      ctx.beginPath()
      ctx.ellipse(0, 10, minion.radius * 1.25, minion.radius * 0.48, 0, 0, TAU)
      ctx.fill()
      ctx.translate(0, bob)
      if (minion.type === 'siege') {
        ctx.fillStyle = '#2f3b38'
        roundRect(ctx, -18, -20, 36, 28, 8)
        ctx.fill()
        ctx.fillStyle = color.secondary
        roundRect(ctx, -13, -16, 26, 15, 5)
        ctx.fill()
        ctx.strokeStyle = color.glow
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -18)
        ctx.lineTo(0, -35)
        ctx.stroke()
        ctx.fillStyle = color.primary
        ctx.beginPath()
        ctx.arc(0, -38, 5, 0, TAU)
        ctx.fill()
      } else if (minion.type === 'caster') {
        ctx.fillStyle = color.dark
        ctx.beginPath()
        ctx.moveTo(0, -30)
        ctx.lineTo(14, 8)
        ctx.lineTo(0, 16)
        ctx.lineTo(-14, 8)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = rgba(color.primary, 0.5)
        ctx.lineWidth = 1.2
        ctx.stroke()
        const orb = ctx.createRadialGradient(0, -26, 0, 0, -26, 12)
        orb.addColorStop(0, '#ffffff')
        orb.addColorStop(0.3, color.glow)
        orb.addColorStop(1, rgba(color.primary, 0))
        ctx.fillStyle = orb
        ctx.beginPath()
        ctx.arc(0, -27, 12, 0, TAU)
        ctx.fill()
      } else {
        ctx.fillStyle = color.dark
        ctx.beginPath()
        ctx.arc(0, -4, 12, 0, TAU)
        ctx.fill()
        ctx.fillStyle = color.secondary
        ctx.beginPath()
        ctx.arc(0, -7, 9, 0, TAU)
        ctx.fill()
        ctx.fillStyle = color.primary
        ctx.beginPath()
        ctx.arc(0, -15, 5, 0, TAU)
        ctx.fill()
        ctx.strokeStyle = '#c9ddd8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(9, -8)
        ctx.lineTo(18, -24)
        ctx.stroke()
      }
      this.drawHealthBar(ctx, 0, -42, minion.type === 'siege' ? 42 : 30, 4, minion.hp / minion.maxHp, minion.team === TEAM.AZURE ? '#7fe9b4' : '#ff8297', false)
      ctx.restore()
    }
  }

  drawProjectiles(ctx, match, time) {
    for (const projectile of match.projectiles) {
      const speed = Math.hypot(projectile.vx, projectile.vy) || 1
      const nx = projectile.vx / speed
      const ny = projectile.vy / speed
      const tail = projectile.kind === 'tower' ? 54 : projectile.kind === 'bolt' ? 44 : 25
      ctx.save()
      this.glow(ctx, projectile.x, projectile.y, projectile.radius * 3.4, projectile.color, 0.55)
      const gradient = ctx.createLinearGradient(projectile.x - nx * tail, projectile.y - ny * tail, projectile.x, projectile.y)
      gradient.addColorStop(0, rgba(projectile.color, 0))
      gradient.addColorStop(1, rgba(projectile.color, 0.8))
      ctx.strokeStyle = gradient
      ctx.lineWidth = projectile.radius * 1.3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(projectile.x - nx * tail, projectile.y - ny * tail)
      ctx.lineTo(projectile.x, projectile.y)
      ctx.stroke()
      ctx.fillStyle = '#f8ffff'
      ctx.beginPath()
      ctx.arc(projectile.x, projectile.y, projectile.radius * 0.55, 0, TAU)
      ctx.fill()
      if (projectile.kind === 'chains') {
        ctx.strokeStyle = rgba(projectile.color, 0.9)
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, projectile.radius + 5 + Math.sin(time * 12) * 2, 0, TAU)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  drawTraps(ctx, match, time) {
    for (const trap of match.traps) {
      if (trap.triggered) continue
      const pulse = 0.72 + Math.sin(time * 2.6 + trap.x) * 0.18
      ctx.save()
      ctx.translate(trap.x, trap.y)
      ctx.globalAlpha = trap.arm > 0 ? 0.4 : 1
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, trap.radius)
      glow.addColorStop(0, rgba(trap.color, 0.05))
      glow.addColorStop(0.7, rgba(trap.color, 0.14))
      glow.addColorStop(1, rgba(trap.color, 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, trap.radius, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = rgba(trap.color, pulse)
      ctx.lineWidth = 2
      ctx.setLineDash([9, 7])
      ctx.lineDashOffset = time * 18
      ctx.beginPath()
      ctx.arc(0, 0, trap.radius, 0, TAU)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.rotate(time * 0.3)
      ctx.strokeStyle = rgba(trap.color, 0.5)
      for (let index = 0; index < 4; index += 1) {
        ctx.beginPath()
        ctx.moveTo(0, -trap.radius + 12)
        ctx.lineTo(7, 0)
        ctx.lineTo(0, trap.radius - 12)
        ctx.lineTo(-7, 0)
        ctx.closePath()
        ctx.stroke()
        ctx.rotate(Math.PI / 2)
      }
      ctx.restore()
    }
  }

  drawDelayed(ctx, match, time) {
    for (const details of match.delayed) {
      const progress = clamp(details.time / details.delay, 0, 1)
      ctx.save()
      if (details.kind === 'meteor') {
        const pulse = 0.45 + progress * 0.5
        const glow = ctx.createRadialGradient(details.x, details.y, 0, details.x, details.y, details.radius)
        glow.addColorStop(0, rgba(details.color, 0.1 + progress * 0.16))
        glow.addColorStop(0.72, rgba(details.color, 0.05 + progress * 0.1))
        glow.addColorStop(1, rgba(details.color, 0))
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(details.x, details.y, details.radius, 0, TAU)
        ctx.fill()
        ctx.strokeStyle = rgba(details.color, 0.45 + progress * 0.4)
        ctx.lineWidth = 2
        ctx.setLineDash([16, 12])
        ctx.lineDashOffset = -time * 26
        ctx.beginPath()
        ctx.arc(details.x, details.y, details.radius * (1.06 - progress * 0.06), 0, TAU)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.strokeStyle = rgba(details.color, 0.22)
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(details.x, details.y, details.radius * progress, 0, TAU)
        ctx.stroke()
        const fall = 1 - progress
        const meteorY = details.y - 280 * fall
        const meteorX = details.x - 90 * fall
        const beam = ctx.createLinearGradient(meteorX, meteorY, details.x, details.y)
        beam.addColorStop(0, rgba(details.color, 0))
        beam.addColorStop(1, rgba(details.color, 0.3 * progress))
        ctx.strokeStyle = beam
        ctx.lineWidth = 16 * progress + 2
        ctx.beginPath()
        ctx.moveTo(meteorX, meteorY)
        ctx.lineTo(details.x, details.y)
        ctx.stroke()
        const meteorGlow = ctx.createRadialGradient(meteorX, meteorY, 0, meteorX, meteorY, 44)
        meteorGlow.addColorStop(0, '#ffffff')
        meteorGlow.addColorStop(0.3, details.color)
        meteorGlow.addColorStop(1, rgba(details.color, 0))
        ctx.fillStyle = meteorGlow
        ctx.beginPath()
        ctx.arc(meteorX, meteorY, 44, 0, TAU)
        ctx.fill()
        void pulse
      }
      if (details.kind === 'beam') {
        const gradient = ctx.createLinearGradient(details.x, details.y, details.x2, details.y2)
        gradient.addColorStop(0, rgba(details.color, 0.7))
        gradient.addColorStop(1, rgba(details.color, 0.04))
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2 + progress * 4
        ctx.setLineDash([18, 16])
        ctx.lineDashOffset = -time * 80
        ctx.beginPath()
        ctx.moveTo(details.x, details.y)
        ctx.lineTo(details.x2, details.y2)
        ctx.stroke()
        ctx.setLineDash([])
      }
      ctx.restore()
    }
  }

  drawEffects(ctx, match, layer, time) {
    const groundKinds = new Set(['aoe', 'target', 'rune', 'runeBurst', 'spawn', 'levelup', 'death', 'destroy', 'meteorHit', 'blast', 'heal'])
    for (const effect of match.effects) {
      const isGround = groundKinds.has(effect.kind)
      if (layer === 'ground' && !isGround) continue
      if (layer === 'top' && isGround) continue
      const progress = 1 - effect.ttl / effect.maxTtl
      const fade = clamp(effect.ttl / effect.maxTtl, 0, 1)
      ctx.save()
      if (effect.kind === 'aoe') this.drawAoe(ctx, effect, progress, fade)
      if (effect.kind === 'target' || effect.kind === 'rune') this.drawTarget(ctx, effect, progress, fade, time)
      if (effect.kind === 'runeBurst') this.drawRingBurst(ctx, effect, progress, fade)
      if (effect.kind === 'blast') this.drawBlast(ctx, effect, progress, fade)
      if (effect.kind === 'dash') this.drawDash(ctx, effect, progress, fade)
      if (effect.kind === 'slash') this.drawSlash(ctx, effect, progress, fade)
      if (effect.kind === 'shield') this.drawShield(ctx, effect, progress, fade)
      if (effect.kind === 'shieldHit') this.drawRingBurst(ctx, effect, progress, fade)
      if (effect.kind === 'levelup' || effect.kind === 'spawn') this.drawPillar(ctx, effect, progress, fade)
      if (effect.kind === 'death' || effect.kind === 'destroy') this.drawExplosion(ctx, effect, progress, fade)
      if (effect.kind === 'deathSmall') this.drawSmallDeath(ctx, effect, progress, fade)
      if (effect.kind === 'impact') this.drawImpact(ctx, effect, progress, fade)
      if (effect.kind === 'meteorHit') this.drawMeteorHit(ctx, effect, progress, fade)
      if (effect.kind === 'beam') this.drawBeam(ctx, effect, progress, fade)
      if (effect.kind === 'beamCharge') this.drawBeamCharge(ctx, effect, progress, fade)
      if (effect.kind === 'blink') this.drawBlink(ctx, effect, progress, fade)
      if (effect.kind === 'heal') this.drawHeal(ctx, effect, progress, fade)
      if (effect.kind === 'spin') this.drawSpin(ctx, effect, progress, fade)
      ctx.restore()
    }
  }

  drawAoe(ctx, effect, progress, fade) {
    const radius = effect.radius * (0.6 + progress * 0.4)
    ctx.strokeStyle = rgba(effect.color, fade * 0.45)
    ctx.lineWidth = 18 * fade + 2
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, TAU)
    ctx.stroke()
    ctx.strokeStyle = rgba('#ffffff', fade * 0.25)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius * (0.4 + progress * 0.6), 0, TAU)
    ctx.stroke()
  }

  drawTarget(ctx, effect, progress, fade, time) {
    ctx.fillStyle = rgba(effect.color, 0.06 + progress * 0.08)
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = rgba(effect.color, 0.35 + fade * 0.4)
    ctx.lineWidth = 2
    ctx.setLineDash([12, 8])
    ctx.lineDashOffset = -time * 20
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([])
  }

  drawRingBurst(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.9)
    ctx.lineWidth = 3 + progress * 5
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius * (0.2 + progress * 1.1), 0, TAU)
    ctx.stroke()
  }

  drawBlast(ctx, effect, progress, fade) {
    const radius = effect.radius * (0.15 + progress * 1.05)
    const glow = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, radius)
    glow.addColorStop(0, rgba('#ffffff', fade * 0.55))
    glow.addColorStop(0.3, rgba(effect.color, fade * 0.5))
    glow.addColorStop(1, rgba(effect.color, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = rgba(effect.color, fade * 0.85)
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, TAU)
    ctx.stroke()
  }

  drawDash(ctx, effect, progress, fade) {
    const gradient = ctx.createLinearGradient(effect.x, effect.y, effect.x2, effect.y2)
    gradient.addColorStop(0, rgba(effect.color, 0))
    gradient.addColorStop(0.5, rgba(effect.color, fade * 0.45))
    gradient.addColorStop(1, rgba(effect.color, fade * 0.8))
    ctx.strokeStyle = gradient
    ctx.lineWidth = (effect.width || 24) * fade
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x2, effect.y2)
    ctx.stroke()
    ctx.strokeStyle = rgba('#ffffff', fade * 0.45)
    ctx.lineWidth = 3
    ctx.setLineDash([10, 12])
    ctx.lineDashOffset = -progress * 120
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x2, effect.y2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  drawSlash(ctx, effect, progress, fade) {
    const arc = Math.PI * (0.4 + progress * 0.9)
    ctx.translate(effect.x, effect.y)
    ctx.rotate(effect.angle)
    ctx.strokeStyle = rgba(effect.crit ? '#fff2b0' : effect.color, fade * 0.95)
    ctx.lineWidth = (effect.crit ? 6 : 4) * fade
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, 0, effect.radius * (0.7 + progress * 0.4), -arc * 0.5, arc * 0.5)
    ctx.stroke()
    ctx.strokeStyle = rgba('#ffffff', fade * 0.45)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, effect.radius * (0.55 + progress * 0.5), -arc * 0.42, arc * 0.42)
    ctx.stroke()
  }

  drawShield(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.8)
    ctx.lineWidth = 2 + progress * 2
    ctx.beginPath()
    ctx.arc(effect.x, effect.y - 10, effect.radius * (0.55 + progress * 0.4), 0, TAU)
    ctx.stroke()
    ctx.fillStyle = rgba(effect.color, fade * 0.07)
    ctx.fill()
  }

  drawPillar(ctx, effect, progress, fade) {
    const width = effect.radius * 0.9
    const gradient = ctx.createLinearGradient(effect.x, effect.y - 280, effect.x, effect.y + 30)
    gradient.addColorStop(0, rgba(effect.color, 0))
    gradient.addColorStop(0.4, rgba(effect.color, fade * 0.28))
    gradient.addColorStop(1, rgba(effect.color, 0))
    ctx.fillStyle = gradient
    ctx.fillRect(effect.x - width / 2, effect.y - 280, width, 320)
    ctx.strokeStyle = rgba(effect.color, fade * 0.9)
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(effect.x, effect.y + 6, effect.radius * (0.5 + progress * 0.9), effect.radius * (0.18 + progress * 0.28), 0, 0, TAU)
    ctx.stroke()
  }

  drawExplosion(ctx, effect, progress, fade) {
    const radius = effect.radius * (0.2 + progress * 1.15)
    const glow = ctx.createRadialGradient(effect.x, effect.y - 18, 0, effect.x, effect.y - 18, radius)
    glow.addColorStop(0, rgba('#ffffff', fade * 0.55))
    glow.addColorStop(0.22, rgba(effect.color, fade * 0.42))
    glow.addColorStop(0.7, rgba(effect.color, fade * 0.12))
    glow.addColorStop(1, rgba(effect.color, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(effect.x, effect.y - 18, radius, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = rgba(effect.color, fade * 0.75)
    ctx.lineWidth = 4 * fade + 1
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius * 0.85, 0, TAU)
    ctx.stroke()
  }

  drawSmallDeath(ctx, effect, progress, fade) {
    ctx.fillStyle = rgba(effect.color, fade * 0.28)
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius * (0.2 + progress), 0, TAU)
    ctx.fill()
    ctx.strokeStyle = rgba(effect.color, fade * 0.5)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius * (0.3 + progress), 0, TAU)
    ctx.stroke()
  }

  drawImpact(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.8)
    ctx.lineWidth = 2
    for (let index = 0; index < 5; index += 1) {
      const angle = index / 5 * TAU + progress * 0.8
      ctx.beginPath()
      ctx.moveTo(effect.x + Math.cos(angle) * 4, effect.y + Math.sin(angle) * 4)
      ctx.lineTo(effect.x + Math.cos(angle) * (9 + progress * 18), effect.y + Math.sin(angle) * (9 + progress * 18))
      ctx.stroke()
    }
  }

  drawMeteorHit(ctx, effect, progress, fade) {
    const radius = effect.radius * (0.3 + progress * 1.2)
    ctx.fillStyle = rgba(effect.color, fade * 0.14)
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = rgba(effect.color, fade * 0.8)
    ctx.lineWidth = 6 * fade + 1
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius, 0, TAU)
    ctx.stroke()
    const core = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, radius * 0.55)
    core.addColorStop(0, rgba('#ffffff', fade * 0.7))
    core.addColorStop(0.4, rgba(effect.color, fade * 0.38))
    core.addColorStop(1, rgba(effect.color, 0))
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, radius * 0.6, 0, TAU)
    ctx.fill()
  }

  drawBeam(ctx, effect, progress, fade) {
    const width = effect.width * (0.6 + (1 - fade) * 0.5)
    const gradient = ctx.createLinearGradient(effect.x, effect.y, effect.x2, effect.y2)
    gradient.addColorStop(0, rgba('#ffffff', fade * 0.9))
    gradient.addColorStop(0.2, rgba(effect.color, fade * 0.85))
    gradient.addColorStop(1, rgba(effect.color, fade * 0.05))
    ctx.strokeStyle = gradient
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x2, effect.y2)
    ctx.stroke()
    ctx.strokeStyle = rgba('#ffffff', fade * 0.8)
    ctx.lineWidth = Math.max(2, width * 0.18)
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x2, effect.y2)
    ctx.stroke()
  }

  drawBeamCharge(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.5)
    ctx.lineWidth = 2
    ctx.setLineDash([12, 12])
    ctx.lineDashOffset = -progress * 160
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x + Math.cos(effect.angle) * effect.length, effect.y + Math.sin(effect.angle) * effect.length)
    ctx.stroke()
    ctx.setLineDash([])
  }

  drawBlink(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.6)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(effect.x, effect.y)
    ctx.lineTo(effect.x2, effect.y2)
    ctx.stroke()
    for (const point of [{ x: effect.x, y: effect.y }, { x: effect.x2, y: effect.y2 }]) {
      ctx.strokeStyle = rgba(effect.color, fade * 0.8)
      ctx.beginPath()
      ctx.arc(point.x, point.y, 10 + progress * 34, 0, TAU)
      ctx.stroke()
    }
  }

  drawHeal(ctx, effect, progress, fade) {
    ctx.strokeStyle = rgba(effect.color, fade * 0.8)
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(effect.x, effect.y, effect.radius * (0.4 + progress * 0.8), 0, TAU)
    ctx.stroke()
    for (let index = 0; index < 6; index += 1) {
      const angle = index / 6 * TAU + progress * 1.4
      ctx.fillStyle = rgba(effect.color, fade * 0.8)
      ctx.beginPath()
      ctx.arc(effect.x + Math.cos(angle) * effect.radius * 0.6, effect.y - progress * 40 + Math.sin(angle) * 18, 3, 0, TAU)
      ctx.fill()
    }
  }

  drawSpin(ctx, effect, progress, fade) {
    ctx.translate(effect.x, effect.y)
    ctx.rotate(progress * 4)
    ctx.strokeStyle = rgba(effect.color, fade * 0.8)
    ctx.lineWidth = 5 * fade
    for (let index = 0; index < 3; index += 1) {
      ctx.beginPath()
      ctx.arc(0, 0, effect.radius * (0.4 + index * 0.2), index * 2, index * 2 + 1.2)
      ctx.stroke()
    }
  }

  drawParticles(scene) {
    const { ctx } = this
    for (const particle of scene.particles || []) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1)
      if (alpha <= 0) continue
      if (particle.glow) this.glow(ctx, particle.x, particle.y, particle.size * 3.4, particle.color, alpha * 0.62)
      ctx.fillStyle = rgba(particle.color, alpha * 0.9)
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, TAU)
      ctx.fill()
    }
  }

  drawFloaters(ctx, scene, time) {
    for (const floater of scene.floaters || []) {
      const alpha = clamp(floater.life / floater.maxLife, 0, 1)
      if (alpha <= 0) continue
      const lift = (1 - alpha) * 38
      const scale = floater.crit ? 1.3 : 1
      ctx.font = `700 ${floater.size * scale}px "Trebuchet MS", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = rgba('#000000', alpha * 0.55)
      ctx.fillText(floater.text, floater.x + 2, floater.y - lift + 2)
      ctx.fillStyle = rgba(floater.color, alpha)
      ctx.fillText(floater.text, floater.x, floater.y - lift)
    }
    ctx.textBaseline = 'alphabetic'
    void time
  }

  drawFireflies(ctx, view, time) {
    const rng = mulberry32(0xabc123)
    for (let index = 0; index < 40; index += 1) {
      const baseX = rng() * MAP_SIZE
      const baseY = rng() * MAP_SIZE
      const driftX = Math.sin(time * 0.24 + index * 1.7) * 40
      const driftY = Math.cos(time * 0.19 + index * 2.3) * 32
      const x = baseX + driftX
      const y = baseY + driftY
      if (!this.visible(view, x, y, 30)) continue
      const alpha = 0.18 + Math.sin(time * 1.4 + index) * 0.12
      this.glow(ctx, x, y, 12, '#9effdc', alpha)
    }
  }

  buildOverlay() {
    const width = this.width
    const height = this.height
    if (this.overlay && this.overlayWidth === width && this.overlayHeight === height) return this.overlay
    const overlay = document.createElement('canvas')
    overlay.width = width
    overlay.height = height
    const ctx = overlay.getContext('2d')
    const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.28, width / 2, height / 2, Math.max(width, height) * 0.72)
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
    vignette.addColorStop(0.72, 'rgba(0, 4, 8, 0.18)')
    vignette.addColorStop(1, 'rgba(0, 3, 7, 0.68)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, width, height)
    const topGlow = ctx.createLinearGradient(0, 0, 0, height * 0.3)
    topGlow.addColorStop(0, 'rgba(4, 14, 22, 0.42)')
    topGlow.addColorStop(1, 'rgba(4, 14, 22, 0)')
    ctx.fillStyle = topGlow
    ctx.fillRect(0, 0, width, height * 0.3)
    ctx.save()
    ctx.globalAlpha = 0.028
    ctx.fillStyle = ctx.createPattern(this.noise, 'repeat')
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
    this.overlay = overlay
    this.overlayWidth = width
    this.overlayHeight = height
    return overlay
  }

  drawAtmosphere(scene) {
    const { ctx, width, height } = this
    const overlay = this.buildOverlay()
    ctx.drawImage(overlay, 0, 0, width, height)
    if (!scene.menu && scene.particles) {
      for (const particle of scene.particles) {
        if (particle.screenGlow) this.glow(ctx, particle.screenX, particle.screenY, particle.size * 4, particle.color, clamp(particle.life / particle.maxLife, 0, 1) * 0.12)
      }
    }
  }

  drawMinimap(scene) {
    const ctx = this.minimapCtx
    const size = this.minimap.width
    const dpr = this.dpr
    const scale = size / MAP_SIZE
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, size, size)
    const background = ctx.createRadialGradient(size * 0.5, size * 0.5, 10, size * 0.5, size * 0.5, size * 0.7)
    background.addColorStop(0, '#0f2729')
    background.addColorStop(1, '#061015')
    ctx.fillStyle = background
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = 'rgba(115, 190, 185, 0.16)'
    ctx.lineWidth = 2 * dpr
    ctx.beginPath()
    ctx.moveTo(RIVER_AXIS.x1 * scale, RIVER_AXIS.y1 * scale)
    ctx.lineTo(RIVER_AXIS.x2 * scale, RIVER_AXIS.y2 * scale)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(174, 211, 200, 0.34)'
    ctx.lineWidth = 5 * dpr
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(LANE[0].x * scale, LANE[0].y * scale)
    for (let index = 1; index < LANE.length; index += 1) ctx.lineTo(LANE[index].x * scale, LANE[index].y * scale)
    ctx.stroke()
    const match = scene.match
    for (const structure of match.structures) {
      if (!structure.alive) continue
      const color = TEAM_COLORS[structure.team]
      ctx.fillStyle = color.primary
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 1.5 * dpr
      const px = structure.x * scale
      const py = structure.y * scale
      if (structure.type === 'nexus') {
        ctx.beginPath()
        ctx.arc(px, py, 6 * dpr, 0, TAU)
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.fillRect(px - 4 * dpr, py - 4 * dpr, 8 * dpr, 8 * dpr)
      }
    }
    for (const minion of match.minions) {
      if (!minion.alive) continue
      ctx.fillStyle = minion.team === TEAM.AZURE ? 'rgba(112, 235, 255, 0.66)' : 'rgba(255, 112, 145, 0.66)'
      ctx.beginPath()
      ctx.arc(minion.x * scale, minion.y * scale, 1.5 * dpr, 0, TAU)
      ctx.fill()
    }
    for (const champion of match.champions) {
      if (champion.dead) continue
      const isPlayer = champion.id === match.player.id
      ctx.fillStyle = isPlayer ? '#ffe68a' : TEAM_COLORS[champion.team].primary
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)'
      ctx.lineWidth = 2 * dpr
      ctx.beginPath()
      ctx.arc(champion.x * scale, champion.y * scale, (isPlayer ? 4.5 : 3.8) * dpr, 0, TAU)
      ctx.fill()
      ctx.stroke()
    }
    const camera = scene.camera
    const halfWidth = this.width / 2 / camera.zoom
    const halfHeight = this.height / 2 / camera.zoom
    ctx.strokeStyle = 'rgba(235, 255, 255, 0.4)'
    ctx.lineWidth = 1.2 * dpr
    ctx.strokeRect(
      (camera.x - halfWidth) * scale,
      (camera.y - halfHeight) * scale,
      halfWidth * 2 * scale,
      halfHeight * 2 * scale
    )
    ctx.strokeStyle = 'rgba(142, 240, 255, 0.2)'
    ctx.lineWidth = 1.5 * dpr
    ctx.strokeRect(0.75, 0.75, size - 1.5, size - 1.5)
  }
}
