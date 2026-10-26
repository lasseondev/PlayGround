import * as THREE from 'three'

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a)
export const randInt = (a, b) => Math.floor(rand(a, b + 1))
export const choice = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt))

export function angleDiff(a, b) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

export function dampAngle(current, target, lambda, dt) {
  return current + angleDiff(current, target) * (1 - Math.exp(-lambda * dt))
}

export function circleVsAABB(x, z, r, box) {
  const cx = clamp(x, box.minX, box.maxX)
  const cz = clamp(z, box.minZ, box.maxZ)
  const dx = x - cx
  const dz = z - cz
  const d2 = dx * dx + dz * dz
  if (d2 > r * r) return null
  const d = Math.sqrt(d2) || 0.0001
  return { nx: dx / d, nz: dz / d, depth: r - d, cx, cz }
}

export function resolveCircle(x, z, r, colliders) {
  let px = x
  let pz = z
  let hit = false
  for (let i = 0; i < colliders.length; i++) {
    const c = colliders[i]
    if (px + r < c.minX || px - r > c.maxX || pz + r < c.minZ || pz - r > c.maxZ) continue
    const contact = circleVsAABB(px, pz, r, c)
    if (contact) {
      px += contact.nx * contact.depth
      pz += contact.nz * contact.depth
      hit = true
    }
  }
  return { x: px, z: pz, hit }
}

export function pointInBox(x, z, box) {
  return x > box.minX && x < box.maxX && z > box.minZ && z < box.maxZ
}

export function makeCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  return canvas
}

export function canvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function makeSignTexture(text, color = '#ff4d9d', accent = '#59e6ff') {
  const canvas = makeCanvas(512, 160)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 160)
  ctx.fillStyle = 'rgba(8, 10, 18, 0.82)'
  ctx.fillRect(6, 6, 500, 148)
  ctx.strokeStyle = color
  ctx.lineWidth = 5
  ctx.shadowColor = color
  ctx.shadowBlur = 22
  ctx.strokeRect(12, 12, 488, 136)
  ctx.font = '900 92px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.shadowBlur = 30
  ctx.fillText(text, 256, 84)
  ctx.shadowBlur = 0
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(44, 34)
  ctx.lineTo(468, 34)
  ctx.stroke()
  return canvasTexture(canvas)
}

export function makeWindowTextures(base, litWarm, litCool) {
  const W = 256
  const H = 512
  const cols = 4
  const rows = 8
  const mapCanvas = makeCanvas(W, H)
  const emitCanvas = makeCanvas(W, H)
  const map = mapCanvas.getContext('2d')
  const emit = emitCanvas.getContext('2d')

  map.fillStyle = base
  map.fillRect(0, 0, W, H)
  const grad = map.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, 'rgba(255,255,255,0.10)')
  grad.addColorStop(0.5, 'rgba(0,0,0,0.0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.32)')
  map.fillStyle = grad
  map.fillRect(0, 0, W, H)

  emit.fillStyle = '#000000'
  emit.fillRect(0, 0, W, H)

  const padX = 8
  const padY = 8
  const cw = (W - padX * 2) / cols
  const ch = (H - padY * 2) / rows
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const wx = padX + x * cw + 5
      const wy = padY + y * ch + 5
      const ww = cw - 10
      const wh = ch - 11
      const lit = Math.random() < 0.32
      const warm = Math.random() < 0.72
      map.fillStyle = lit ? (warm ? litWarm : litCool) : '#0b111c'
      map.fillRect(wx, wy, ww, wh)
      map.fillStyle = 'rgba(255,255,255,0.12)'
      map.fillRect(wx, wy, ww, 2)
      if (lit) {
        emit.fillStyle = warm ? litWarm : litCool
        emit.fillRect(wx, wy, ww, wh)
        emit.fillStyle = 'rgba(255,255,255,0.65)'
        emit.fillRect(wx, wy, ww, Math.max(2, wh * 0.16))
      }
      map.strokeStyle = 'rgba(0,0,0,0.5)'
      map.lineWidth = 2
      map.strokeRect(wx, wy, ww, wh)
    }
  }
  map.fillStyle = 'rgba(0,0,0,0.22)'
  for (let x = 0; x <= cols; x++) {
    map.fillRect(padX + x * cw - 2, 0, 4, H)
  }
  const mapTex = canvasTexture(mapCanvas)
  const emitTex = canvasTexture(emitCanvas)
  mapTex.wrapS = mapTex.wrapT = THREE.RepeatWrapping
  emitTex.wrapS = emitTex.wrapT = THREE.RepeatWrapping
  return { map: mapTex, emissive: emitTex }
}
