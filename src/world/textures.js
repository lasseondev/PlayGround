import * as THREE from 'three'

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let anisotropy = 8
export function setTextureAnisotropy(value) { anisotropy = value }

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  return canvas
}

export function canvasTexture(w, h, draw, { repeat = [1, 1], srgb = true, wrap = THREE.RepeatWrapping } = {}) {
  const canvas = makeCanvas(w, h)
  const ctx = canvas.getContext('2d')
  draw(ctx, w, h)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = wrap
  texture.repeat.set(repeat[0], repeat[1])
  texture.anisotropy = anisotropy
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function floorTextures() {
  const rnd = mulberry32(34191)
  const size = 1024, tiles = 4, tile = size / tiles
  const drawBase = (ctx) => {
    ctx.fillStyle = '#22252c'; ctx.fillRect(0, 0, size, size)
    for (let ty = 0; ty < tiles; ty++) {
      for (let tx = 0; tx < tiles; tx++) {
        const x = tx * tile, y = ty * tile
        const shade = 30 + Math.floor(rnd() * 16)
        ctx.fillStyle = `rgb(${shade + 2},${shade + 4},${shade + 9})`
        ctx.fillRect(x + 3, y + 3, tile - 6, tile - 6)
        const grad = ctx.createLinearGradient(x, y, x + tile, y + tile)
        grad.addColorStop(0, 'rgba(255,255,255,0.055)')
        grad.addColorStop(0.48, 'rgba(255,255,255,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.18)')
        ctx.fillStyle = grad; ctx.fillRect(x + 3, y + 3, tile - 6, tile - 6)
        for (let v = 0; v < 7; v++) {
          ctx.beginPath()
          const sx = x + rnd() * tile, sy = y + rnd() * tile
          ctx.moveTo(sx, sy)
          ctx.bezierCurveTo(sx + (rnd() - .5) * 110, sy + rnd() * 90, sx + (rnd() - .5) * 140, sy + rnd() * 160, sx + (rnd() - .5) * 180, sy + rnd() * 210)
          ctx.strokeStyle = rnd() > .5 ? 'rgba(190,196,208,0.06)' : 'rgba(4,6,10,0.2)'
          ctx.lineWidth = 0.6 + rnd() * 1.6
          ctx.stroke()
        }
        for (let s = 0; s < 3; s++) {
          ctx.beginPath()
          ctx.ellipse(x + rnd() * tile, y + rnd() * tile, 10 + rnd() * 48, 8 + rnd() * 30, rnd() * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(8,10,12,${0.04 + rnd() * 0.08})`; ctx.fill()
        }
      }
    }
    ctx.strokeStyle = 'rgba(7,9,12,0.9)'; ctx.lineWidth = 5
    for (let i = 0; i <= tiles; i++) {
      const p = i * tile
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke()
    }
  }
  const map = canvasTexture(size, size, drawBase, { repeat: [7, 10.5] })
  const rough = canvasTexture(size, size, (ctx) => {
    ctx.fillStyle = '#5c5c5c'; ctx.fillRect(0, 0, size, size)
    const r2 = mulberry32(999)
    for (let i = 0; i < 9000; i++) {
      const v = 60 + Math.floor(r2() * 100)
      ctx.fillStyle = `rgba(${v},${v},${v},${0.2 + r2() * 0.4})`
      ctx.fillRect(r2() * size, r2() * size, 1 + r2() * 8, 1 + r2() * 8)
    }
    ctx.strokeStyle = 'rgba(220,220,220,0.9)'; ctx.lineWidth = 6
    for (let i = 0; i <= tiles; i++) {
      const p = i * tile
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke()
    }
  }, { repeat: [7, 10.5], srgb: false })
  return { map, rough }
}

export function concreteTexture(repeat = [2, 1]) {
  const rnd = mulberry32(7712)
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#35373b'; ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 16000; i++) {
      const v = 30 + rnd() * 40
      ctx.fillStyle = `rgba(${v},${v},${v + 3},${0.12 + rnd() * 0.25})`
      ctx.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3)
    }
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, 'rgba(255,255,255,0.05)'); grad.addColorStop(1, 'rgba(0,0,0,0.24)')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(12,14,17,0.5)'; ctx.lineWidth = 2
    ctx.strokeRect(1, 1, w - 2, h - 2)
    for (let i = 0; i < 16; i++) {
      ctx.beginPath()
      const x = rnd() * w, y = rnd() * h
      ctx.moveTo(x, y)
      let cx = x, cy = y
      for (let s = 0; s < 7; s++) { cx += (rnd() - .5) * 70; cy += rnd() * 32; ctx.lineTo(cx, cy) }
      ctx.strokeStyle = `rgba(8,9,11,${0.16 + rnd() * 0.2})`; ctx.lineWidth = 0.8 + rnd(); ctx.stroke()
    }
  }, { repeat })
}

export function carpetTexture() {
  const rnd = mulberry32(51)
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#4a2224'; ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 9000; i++) {
      const c = rnd() > .5 ? 'rgba(255,150,140,0.04)' : 'rgba(20,4,6,0.16)'
      ctx.fillStyle = c; ctx.fillRect(rnd() * w, rnd() * h, 2, 2)
    }
    ctx.strokeStyle = 'rgba(189,140,90,0.18)'; ctx.lineWidth = 3
    ctx.strokeRect(22, 22, w - 44, h - 44)
    ctx.strokeRect(34, 34, w - 68, h - 68)
  }, { repeat: [3, 26] })
}

export function tileWallTexture(repeat = [4, 2]) {
  const rnd = mulberry32(1201)
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#1d2429'; ctx.fillRect(0, 0, w, h)
    const tw = 64, th = 64
    for (let y = 0; y < h / th; y++) {
      for (let x = 0; x < w / tw; x++) {
        const v = 26 + rnd() * 12
        ctx.fillStyle = `rgb(${v},${v + 5},${v + 8})`
        ctx.fillRect(x * tw + 2, y * th + 2, tw - 4, th - 4)
      }
    }
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, 'rgba(120,170,180,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0.3)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  }, { repeat })
}

export function signTexture(text, { color = '#ff5a4d', sub = '', background = 'rgba(6,8,12,0.92)', border = true, font = 'Archivo Black', fontSize = 116, letterSpacing = 4, width = 1024, height = 256 } = {}) {
  return canvasTexture(width, height, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, w, h) }
    if (border) {
      ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 3
      ctx.strokeRect(9, 9, w - 18, h - 18)
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = `${fontSize}px "${font}", "Arial Black", sans-serif`
    ctx.shadowColor = color; ctx.shadowBlur = 42
    ctx.fillStyle = color
    let x = w / 2
    if (letterSpacing) {
      const chars = text.split('')
      const widths = chars.map(c => ctx.measureText(c).width)
      const total = widths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1)
      x = w / 2 - total / 2
      ctx.textAlign = 'left'
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], x, sub ? h * 0.42 : h * 0.5)
        x += widths[i] + letterSpacing
      }
    } else {
      ctx.fillText(text, w / 2, sub ? h * 0.42 : h * 0.5)
    }
    ctx.shadowBlur = 8
    ctx.fillStyle = color
    if (letterSpacing) {
      let xx = w / 2
      const chars = text.split('')
      const widths = chars.map(c => ctx.measureText(c).width)
      const total = widths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1)
      xx = w / 2 - total / 2
      ctx.textAlign = 'left'
      for (let i = 0; i < chars.length; i++) { ctx.fillText(chars[i], xx, sub ? h * 0.42 : h * 0.5); xx += widths[i] + letterSpacing }
    } else {
      ctx.textAlign = 'center'
      ctx.fillText(text, w / 2, sub ? h * 0.42 : h * 0.5)
    }
    if (sub) {
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(239,233,223,0.6)'
      ctx.font = '600 24px Rajdhani, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(sub, w / 2, h * 0.76)
    }
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function posterTexture(kind = 0) {
  const rnd = mulberry32(100 + kind * 17)
  const themes = [
    ['NOIR', '#0a1a24', '#52d6c9', '#d9e6df'],
    ['NIGHT', '#1b0b16', '#f0497c', '#f6e8d8'],
    ['SALE', '#241a07', '#f0a13c', '#f6efdf'],
    ['LOST', '#08131c', '#8ab4ff', '#e8eef5']
  ]
  const [word, bg, accent, text] = themes[kind % themes.length]
  return canvasTexture(384, 560, (ctx, w, h) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
    const g = ctx.createRadialGradient(w * .6, h * .28, 10, w * .5, h * .4, h * .8)
    g.addColorStop(0, accent + '55'); g.addColorStop(1, 'transparent')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.05})`
      ctx.fillRect(rnd() * w, rnd() * h, rnd() * 90, 1 + rnd() * 2)
    }
    ctx.save(); ctx.translate(w / 2, h * .46)
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.globalAlpha = .8
    ctx.beginPath(); ctx.arc(0, 0, 92, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(0, 0, 64, 0, Math.PI * 2); ctx.stroke()
    ctx.globalAlpha = 1
    ctx.restore()
    ctx.fillStyle = text; ctx.textAlign = 'center'
    ctx.font = '400 58px "Archivo Black", sans-serif'
    ctx.fillText(word, w / 2, h * .75)
    ctx.font = '600 17px Rajdhani, sans-serif'
    ctx.fillStyle = accent
    ctx.fillText(kind % 2 ? 'NOW SHOWING · LEVEL 2' : 'ATRIUM · TONIGHT', w / 2, h * .82)
    ctx.fillStyle = 'rgba(239,233,223,0.35)'; ctx.font = '500 13px Rajdhani, sans-serif'
    ctx.fillText('OMNICORP MALL', w / 2, h * .9)
    ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2
    ctx.strokeRect(12, 12, w - 24, h - 24)
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function bloodTexture(seed = 1) {
  const rnd = mulberry32(seed * 991 + 7)
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    const cx = w / 2, cy = h / 2
    for (let i = 0; i < 28; i++) {
      const x = cx + (rnd() - .5) * 260, y = cy + (rnd() - .5) * 230
      const r = 12 + rnd() * 85
      const g = ctx.createRadialGradient(x, y, 1, x, y, r)
      g.addColorStop(0, 'rgba(104,8,10,0.95)'); g.addColorStop(0.6, 'rgba(74,5,8,0.75)'); g.addColorStop(1, 'rgba(40,2,4,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.fillStyle = 'rgba(70,4,7,0.75)'
    for (let i = 0; i < 16; i++) {
      const x = cx + (rnd() - .5) * 210
      ctx.fillRect(x, cy + (rnd() - .5) * 60, 1 + rnd() * 4, 20 + rnd() * 100)
    }
    for (let i = 0; i < 80; i++) {
      ctx.beginPath(); ctx.arc(cx + (rnd() - .5) * 430, cy + (rnd() - .5) * 400, .8 + rnd() * 3.2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(80,5,8,${0.3 + rnd() * 0.5})`; ctx.fill()
    }
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function grimeTexture(repeat = [1, 1]) {
  const rnd = mulberry32(8821)
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    for (let i = 0; i < 240; i++) {
      const x = rnd() * w, y = rnd() * h, r = 4 + rnd() * 42
      const g = ctx.createRadialGradient(x, y, 1, x, y, r)
      g.addColorStop(0, `rgba(10,12,10,${0.1 + rnd() * 0.35})`); g.addColorStop(1, 'rgba(10,12,10,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
  }, { repeat })
}

export function glowTexture() {
  return canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.18, 'rgba(255,240,210,0.75)')
    g.addColorStop(0.5, 'rgba(255,190,130,0.16)')
    g.addColorStop(1, 'rgba(255,160,100,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function sparkTexture() {
  return canvasTexture(64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,210,150,0.85)'); g.addColorStop(1, 'rgba(255,120,40,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function flashTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.translate(w / 2, h / 2)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 70)
    g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(0.35, 'rgba(255,214,140,0.9)'); g.addColorStop(1, 'rgba(255,140,50,0)')
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill()
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < 9; i++) {
      ctx.rotate(Math.PI * 2 / 9 + 0.12)
      const lg = ctx.createLinearGradient(0, 0, 116, 0)
      lg.addColorStop(0, 'rgba(255,250,225,0.95)'); lg.addColorStop(1, 'rgba(255,170,70,0)')
      ctx.fillStyle = lg
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(116, 0); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill()
    }
  }, { wrap: THREE.ClampToEdgeWrapping })
}

export function hazardTexture() {
  const rnd = mulberry32(414)
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#c9a227'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#17181a'
    for (let i = -h; i < w + h; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 32, 0); ctx.lineTo(i + 32 - h, h); ctx.lineTo(i - h, h); ctx.closePath(); ctx.fill()
    }
    for (let i = 0; i < 6000; i++) { ctx.fillStyle = `rgba(0,0,0,${rnd() * 0.14})`; ctx.fillRect(rnd() * w, rnd() * h, 2, 2) }
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0.15)'); g.addColorStop(1, 'rgba(0,0,0,0.42)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  }, { repeat: [1, 1] })
}

export function directoryTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#0b1014'; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(87,216,208,0.5)'; ctx.lineWidth = 3; ctx.strokeRect(14, 14, w - 28, h - 28)
    ctx.fillStyle = '#57d8d0'; ctx.font = '700 24px Rajdhani, sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('ATRIUM DIRECTORY', w / 2, 52)
    ctx.strokeStyle = 'rgba(87,216,208,0.25)'; ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(w - 40, 70); ctx.stroke()
    const rows = [['CINEMA 8', 'LEVEL 2'], ['GAME OVER ARCADE', 'LEVEL 2'], ['FOOD COURT', 'LEVEL 1'], ['SPORTSWORLD', 'LEVEL 1'], ['PHARMACY', 'LEVEL 1'], ['TOYBOX', 'LEVEL 1'], ['PARKING', 'P2'], ['EXIT', 'SEALED']]
    ctx.textAlign = 'left'; ctx.font = '600 22px Rajdhani, sans-serif'
    rows.forEach(([a, b], i) => {
      const y = 112 + i * 48
      ctx.fillStyle = i === rows.length - 1 ? '#e23b32' : '#cfe6e2'
      ctx.fillText(a, 46, y)
      ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(207,230,226,0.45)'; ctx.fillText(b, w - 46, y); ctx.textAlign = 'left'
      ctx.strokeStyle = 'rgba(87,216,208,0.1)'; ctx.beginPath(); ctx.moveTo(46, y + 13); ctx.lineTo(w - 46, y + 13); ctx.stroke()
    })
  }, { wrap: THREE.ClampToEdgeWrapping })
}
