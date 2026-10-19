import * as THREE from 'three'

function canvasTexture(canvas, { repeat = null, color = true } = {}) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.anisotropy = 8
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeat[0], repeat[1])
  }
  texture.needsUpdate = true
  return texture
}

function hexPath(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function drawHexGrid(ctx, width, height, size, stroke, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.1
  const stepX = Math.sqrt(3) * size
  const stepY = size * 1.5
  for (let row = -1; row * stepY < height + size; row++) {
    for (let col = -1; col * stepX < width + stepX; col++) {
      const cx = col * stepX + (row % 2 ? stepX / 2 : 0)
      const cy = row * stepY
      hexPath(ctx, cx, cy, size)
      ctx.stroke()
    }
  }
  ctx.restore()
}

export function makeFieldTexture() {
  const width = 1024
  const height = 1536
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const base = ctx.createLinearGradient(0, 0, 0, height)
  base.addColorStop(0, '#07131f')
  base.addColorStop(0.16, '#0a2032')
  base.addColorStop(0.5, '#091924')
  base.addColorStop(0.84, '#20140d')
  base.addColorStop(1, '#180d07')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  const centerGlow = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.9)
  centerGlow.addColorStop(0, 'rgba(40, 150, 190, 0.20)')
  centerGlow.addColorStop(0.55, 'rgba(15, 60, 85, 0.06)')
  centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.28)')
  ctx.fillStyle = centerGlow
  ctx.fillRect(0, 0, width, height)

  drawHexGrid(ctx, width, height, 30, '#3aa9c6', 0.055)

  const pad = 42
  const fieldW = width - pad * 2
  const fieldH = height - pad * 2

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.font = '900 118px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(150, 225, 255, 0.045)'
  ctx.fillText('RUMBLE', 0, 0)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.3
  const blueZone = ctx.createLinearGradient(0, pad, 0, pad + 210)
  blueZone.addColorStop(0, 'rgba(24, 132, 255, 0.75)')
  blueZone.addColorStop(1, 'rgba(24, 132, 255, 0)')
  ctx.fillStyle = blueZone
  ctx.fillRect(pad, pad, fieldW, 245)

  const orangeZone = ctx.createLinearGradient(0, height - pad - 210, 0, height - pad)
  orangeZone.addColorStop(0, 'rgba(255, 112, 18, 0)')
  orangeZone.addColorStop(1, 'rgba(255, 112, 18, 0.78)')
  ctx.fillStyle = orangeZone
  ctx.fillRect(pad, height - pad - 245, fieldW, 245)
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = 'rgba(196, 240, 255, 0.84)'
  ctx.fillStyle = 'rgba(196, 240, 255, 0.84)'
  ctx.lineWidth = 4
  ctx.shadowColor = 'rgba(100, 220, 255, 0.85)'
  ctx.shadowBlur = 18

  ctx.strokeRect(pad, pad, fieldW, fieldH)

  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(pad, height / 2)
  ctx.lineTo(width - pad, height / 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(width / 2, height / 2, fieldW * 0.155, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, 9, 0, Math.PI * 2)
  ctx.fill()

  const goalAreaW = fieldW * 0.34
  const goalAreaH = 130
  ctx.strokeRect(width / 2 - goalAreaW / 2, pad, goalAreaW, goalAreaH)
  ctx.strokeRect(width / 2 - goalAreaW / 2, height - pad - goalAreaH, goalAreaW, goalAreaH)

  const boxW = fieldW * 0.64
  const boxH = 295
  ctx.lineWidth = 2.3
  ctx.strokeRect(width / 2 - boxW / 2, pad, boxW, boxH)
  ctx.strokeRect(width / 2 - boxW / 2, height - pad - boxH, boxW, boxH)

  ctx.beginPath()
  ctx.arc(width / 2, pad + boxH, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(width / 2, height - pad - boxH, 7, 0, Math.PI * 2)
  ctx.fill()

  ctx.lineWidth = 2
  for (const [x, y, sx, sy] of [
    [pad, pad, 1, 1],
    [width - pad, pad, -1, 1],
    [pad, height - pad, 1, -1],
    [width - pad, height - pad, -1, -1]
  ]) {
    ctx.beginPath()
    ctx.arc(x + sx * 8, y + sy * 8, 40, 0, Math.PI / 2 * (sx * sy > 0 ? 1 : 3), sx * sy > 0)
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.42
  ctx.font = '900 52px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#5ec8ff'
  ctx.fillText('BLUE', width / 2, pad + 355)
  ctx.fillStyle = '#ff9c3f'
  ctx.fillText('ORANGE', width / 2, height - pad - 355)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.24
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.fillStyle = Math.random() > 0.5 ? '#bdeaff' : '#ffffff'
    ctx.fillRect(x, y, 1.2, 1.2)
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.strokeStyle = '#86e6ff'
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const y = height * 0.2 + i * 22
    ctx.beginPath()
    ctx.moveTo(pad + 40, y)
    ctx.lineTo(width - pad - 40, y - 12)
    ctx.stroke()
  }
  ctx.restore()

  return canvasTexture(canvas)
}

export function makeBallTexture() {
  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const base = ctx.createLinearGradient(0, 0, 0, height)
  base.addColorStop(0, '#06111d')
  base.addColorStop(0.45, '#0c2235')
  base.addColorStop(0.55, '#1b160e')
  base.addColorStop(1, '#090c12')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.5, 20, width * 0.5, height * 0.5, width * 0.62)
  glow.addColorStop(0, 'rgba(110, 230, 255, 0.30)')
  glow.addColorStop(0.5, 'rgba(30, 120, 180, 0.10)')
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  const size = 47
  const stepX = Math.sqrt(3) * size
  const stepY = size * 1.5
  let index = 0
  for (let row = -1; row * stepY < height + size; row++) {
    for (let col = -1; col * stepX < width + stepX; col++) {
      const cx = col * stepX + (row % 2 ? stepX / 2 : 0)
      const cy = row * stepY
      ctx.save()
      ctx.shadowBlur = 12
      const warm = (col + row * 2) % 7 === 0
      ctx.strokeStyle = warm ? 'rgba(255, 148, 55, 0.95)' : 'rgba(94, 224, 255, 0.9)'
      ctx.shadowColor = ctx.strokeStyle
      ctx.lineWidth = index % 11 === 0 ? 5 : 2.4
      hexPath(ctx, cx, cy, size * 0.95)
      ctx.stroke()
      if (index % 17 === 0) {
        ctx.fillStyle = warm ? 'rgba(255, 148, 55, 0.20)' : 'rgba(94, 224, 255, 0.18)'
        ctx.fill()
      }
      ctx.restore()
      index++
    }
  }

  ctx.save()
  ctx.strokeStyle = 'rgba(240, 252, 255, 0.92)'
  ctx.lineWidth = 7
  ctx.shadowColor = 'rgba(160, 240, 255, 0.9)'
  ctx.shadowBlur = 16
  ctx.beginPath()
  ctx.ellipse(width / 2, height / 2, width * 0.46, height * 0.18, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, height * 0.5)
  ctx.lineTo(width, height * 0.5)
  ctx.stroke()
  ctx.restore()

  return canvasTexture(canvas)
}

export function makeGlowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.16, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.42, 'rgba(255,255,255,0.28)')
  grad.addColorStop(0.72, 'rgba(255,255,255,0.07)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return canvasTexture(canvas)
}

export function makeSparkTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.3, 'rgba(190,240,255,0.7)')
  grad.addColorStop(1, 'rgba(130,220,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return canvasTexture(canvas)
}

export function makeCrowdTexture() {
  const width = 256
  const height = 128
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#03070d'
  ctx.fillRect(0, 0, width, height)
  const colors = ['#35b4ff', '#ff8a1f', '#dff6ff', '#7b8fa3', '#ffcf9b', '#9bdcff']
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.fillStyle = colors[(Math.random() * colors.length) | 0]
    ctx.globalAlpha = 0.35 + Math.random() * 0.65
    ctx.beginPath()
    ctx.arc(x, y, 0.8 + Math.random() * 1.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  return canvasTexture(canvas)
}

export function makeAdTexture() {
  const width = 512
  const height = 128
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, width, 0)
  grad.addColorStop(0, '#08131f')
  grad.addColorStop(0.5, '#12314c')
  grad.addColorStop(1, '#08131f')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
  ctx.font = '900 44px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#6ce8ff'
  ctx.shadowColor = '#2da9ff'
  ctx.shadowBlur = 18
  ctx.fillText('ROCKET RUMBLE', width / 2, height / 2 - 8)
  ctx.font = '700 18px "Segoe UI", Arial, sans-serif'
  ctx.fillStyle = '#ffb15c'
  ctx.shadowColor = '#ff7a12'
  ctx.fillText('NEON LEAGUE // SEASON 01', width / 2, height / 2 + 30)
  return canvasTexture(canvas)
}

export function makeScreenTexture() {
  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = canvasTexture(canvas)

  function draw(state = {}) {
    const { blue = 0, orange = 0, clock = '3:00', stage = 'RANKED 1V1' } = state
    const bg = ctx.createLinearGradient(0, 0, 0, height)
    bg.addColorStop(0, '#081b2d')
    bg.addColorStop(0.5, '#05101c')
    bg.addColorStop(1, '#030810')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.strokeStyle = 'rgba(100, 220, 255, 0.12)'
    ctx.lineWidth = 2
    for (let x = 0; x <= width; x += 64) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += 64) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.restore()

    ctx.fillStyle = 'rgba(10, 28, 46, 0.88)'
    ctx.fillRect(0, 0, width, 92)
    ctx.fillStyle = '#8ddcff'
    ctx.font = '900 35px "Arial Black", Impact, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ROCKET RUMBLE', width / 2, 60)

    ctx.fillStyle = '#081726'
    ctx.fillRect(170, 128, 684, 270)
    ctx.strokeStyle = 'rgba(118, 218, 255, 0.34)'
    ctx.lineWidth = 3
    ctx.strokeRect(170, 128, 684, 270)

    ctx.fillStyle = 'rgba(53, 180, 255, 0.16)'
    ctx.fillRect(170, 128, 260, 270)
    ctx.fillStyle = 'rgba(255, 138, 31, 0.16)'
    ctx.fillRect(594, 128, 260, 270)

    ctx.textBaseline = 'middle'
    ctx.font = '900 96px "Arial Black", Impact, sans-serif'
    ctx.fillStyle = '#cdefff'
    ctx.fillText(String(blue), 300, 230)
    ctx.fillStyle = '#ffe0bf'
    ctx.fillText(String(orange), 724, 230)

    ctx.font = '800 24px "Segoe UI", Arial, sans-serif'
    ctx.fillStyle = '#7db8d8'
    ctx.fillText('BLUE', 300, 325)
    ctx.fillText('ORANGE', 724, 325)

    ctx.font = '900 66px "Arial Black", Impact, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(clock, 512, 230)
    ctx.font = '800 17px "Segoe UI", Arial, sans-serif'
    ctx.fillStyle = '#7fa8c0'
    ctx.fillText(stage, 512, 292)

    ctx.fillStyle = 'rgba(108, 245, 255, 0.9)'
    ctx.fillRect(0, height - 10, width / 2, 10)
    ctx.fillStyle = 'rgba(255, 138, 31, 0.9)'
    ctx.fillRect(width / 2, height - 10, width / 2, 10)

    texture.needsUpdate = true
  }

  draw()
  return { texture, draw, canvas }
}
