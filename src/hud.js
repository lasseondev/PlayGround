import * as THREE from 'three'

const clamp = THREE.MathUtils.clamp

export class Hud {
  constructor(world) {
    this.world = world
    this.el = {
      hud: document.getElementById('hud'),
      cash: document.getElementById('cash'),
      stars: document.getElementById('stars'),
      starItems: Array.from(document.querySelectorAll('#stars i')),
      missionLabel: document.getElementById('missionLabel'),
      timer: document.getElementById('timer'),
      timerFill: document.getElementById('timerFill'),
      distance: document.getElementById('distance'),
      multiplier: document.getElementById('multiplier'),
      healthFill: document.getElementById('healthFill'),
      boostFill: document.getElementById('boostFill'),
      zone: document.getElementById('zone'),
      timeChip: document.getElementById('timeChip'),
      toast: document.getElementById('toast'),
      toastTitle: document.getElementById('toastTitle'),
      toastSub: document.getElementById('toastSub'),
      flash: document.getElementById('fx-flash'),
      speedFx: document.getElementById('fx-speed'),
      muteBtn: document.getElementById('muteBtn'),
      speedo: document.getElementById('speedo'),
      minimap: document.getElementById('minimap'),
    }
    this.mapCtx = this.el.minimap.getContext('2d')
    this.speedoCtx = this.el.speedo.getContext('2d')
    this.cashValue = 0
    this.heatValue = -1
    this.mapAcc = 1
    this.speedoAcc = 1
    this.toastTimeout = null
    this.base = document.createElement('canvas')
    this.base.width = this.base.height = 512
    this.mapScale = 512 / 720
    this.drawBase()
    this.muteBtn = this.el.muteBtn
  }

  drawBase() {
    const ctx = this.base.getContext('2d')
    const S = 512
    const scale = this.mapScale
    const toX = (x) => (x + 360) * scale
    const toY = (z) => (z + 360) * scale
    ctx.fillStyle = '#081019'
    ctx.fillRect(0, 0, S, S)
    const grad = ctx.createRadialGradient(S / 2, S / 2, 30, S / 2, S / 2, 280)
    grad.addColorStop(0, 'rgba(31,58,80,.25)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, S, S)

    // roads
    ctx.strokeStyle = '#233345'
    ctx.lineWidth = 3
    for (const c of this.world.roadCenters) {
      ctx.beginPath()
      ctx.moveTo(toX(c), 8)
      ctx.lineTo(toX(c), S - 8)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(8, toY(c))
      ctx.lineTo(S - 8, toY(c))
      ctx.stroke()
    }

    for (const b of this.world.mapBlocks) {
      const w = 58 * scale
      const h = 58 * scale
      ctx.fillStyle = b.park ? '#153a29' : '#111e2b'
      ctx.fillRect(toX(b.x) - w / 2, toY(b.z) - h / 2, w, h)
      ctx.strokeStyle = b.park ? 'rgba(77,191,162,.25)' : 'rgba(49,230,255,.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(toX(b.x) - w / 2, toY(b.z) - h / 2, w, h)
    }

    ctx.strokeStyle = 'rgba(49,230,255,.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(4, 4, S - 8, S - 8)
    ctx.fillStyle = 'rgba(49,230,255,.5)'
    ctx.font = '700 11px "DejaVu Sans Mono", monospace'
    ctx.fillText('N', S / 2 - 4, 16)
  }

  setStarted(started) {
    this.el.hud.classList.toggle('hidden', !started)
  }

  setTime(name) {
    this.el.timeChip.textContent = name.toUpperCase()
    this.el.timeChip.style.color = name === 'night' ? '#ffb3da' : name === 'day' ? '#ffe9b8' : '#bfeaff'
  }

  setMuted(muted) {
    this.el.muteBtn.textContent = muted ? '×' : '♪'
    this.el.muteBtn.classList.toggle('off', muted)
  }

  toast(title, sub = '', tone = '', duration = 2.4) {
    this.el.toastTitle.textContent = title
    this.el.toastSub.textContent = sub
    this.el.toast.className = `toast ${tone}`
    void this.el.toast.offsetWidth
    this.el.toast.classList.add('show')
    clearTimeout(this.toastTimeout)
    this.toastTimeout = setTimeout(() => this.el.toast.classList.remove('show'), duration * 1000)
  }

  flash(strength = 0.5) {
    const el = this.el.flash
    el.style.transition = 'none'
    el.style.opacity = String(strength)
    void el.offsetWidth
    el.style.transition = 'opacity .5s ease-out'
    el.style.opacity = '0'
  }

  setSpeedFx(ratio) {
    this.el.speedFx.style.opacity = String(clamp((ratio - 0.55) * 1.2, 0, 0.55))
  }

  update(state, dt) {
    if (Math.floor(state.cash) !== Math.floor(this.cashValue)) {
      this.cashValue = state.cash
      this.el.cash.textContent = '$' + Math.max(0, Math.floor(state.cash)).toLocaleString('en-US')
    }

    const wanted = Math.min(5, Math.floor(state.heat + 0.08))
    if (wanted !== this.heatValue) {
      this.heatValue = wanted
      this.el.starItems.forEach((item, i) => item.classList.toggle('on', i < wanted))
      this.el.stars.classList.toggle('hot', wanted >= 3)
    }

    this.el.missionLabel.textContent = `DELIVERY ${String(state.delivery + 1).padStart(2, '0')} / 10`
    this.el.timer.textContent = Math.max(0, state.missionTime).toFixed(1)
    this.el.timer.classList.toggle('low', state.missionTime < 10)
    this.el.timerFill.style.transform = `scaleX(${clamp(state.missionTime / state.missionMax, 0, 1)})`
    this.el.timerFill.classList.toggle('low', state.missionTime < 10)
    this.el.distance.textContent = String(Math.round(state.distance))
    this.el.multiplier.textContent = `PAYOUT x${state.multiplier.toFixed(1)}`

    this.el.healthFill.style.width = `${clamp(state.health, 0, 100)}%`
    this.el.healthFill.classList.toggle('low', state.health < 30)
    this.el.boostFill.style.width = `${clamp(state.boost, 0, 100)}%`

    const zone = Math.abs(state.pos.x) < 115 && Math.abs(state.pos.z) < 135
      ? 'DOWNTOWN'
      : state.pos.z < -110 ? 'NORTH SHORE' : state.pos.z > 110 ? 'SOUTH BEACH' : state.pos.x > 0 ? 'EAST SIDE' : 'WEST END'
    if (this.el.zone.textContent !== zone) this.el.zone.textContent = zone

    this.setSpeedFx(clamp(state.speed / 60, 0, 1))

    this.mapAcc += dt
    if (this.mapAcc > 0.075) {
      this.mapAcc = 0
      this.drawMinimap(state)
    }
    this.speedoAcc += dt
    if (this.speedoAcc > 0.04) {
      this.speedoAcc = 0
      this.drawSpeedo(state.speedKmh, state.boost, state.boosting)
    }
  }

  drawMinimap(state) {
    const ctx = this.mapCtx
    const S = 512
    const scale = this.mapScale
    const toX = (x) => (x + 360) * scale
    const toY = (z) => (z + 360) * scale
    ctx.clearRect(0, 0, S, S)
    ctx.drawImage(this.base, 0, 0)
    const px = toX(state.pos.x)
    const py = toY(state.pos.z)

    if (state.target) {
      const tx = toX(state.target.x)
      const ty = toY(state.target.z)
      ctx.save()
      ctx.setLineDash([5, 9])
      ctx.strokeStyle = 'rgba(255,59,167,.32)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(tx, ty)
      ctx.stroke()
      ctx.setLineDash([])
      const pulse = 1 + Math.sin(state.time * 4) * 0.12
      ctx.translate(tx, ty)
      ctx.rotate(Math.PI / 4)
      ctx.shadowColor = '#ff3ba7'
      ctx.shadowBlur = 18
      ctx.fillStyle = '#ff6fbe'
      ctx.fillRect(-6 * pulse, -6 * pulse, 12 * pulse, 12 * pulse)
      ctx.restore()
      ctx.strokeStyle = 'rgba(255,59,167,.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(tx, ty, 13 + Math.sin(state.time * 4) * 3, 0, Math.PI * 2)
      ctx.stroke()
    }

    if (state.cars) {
      ctx.fillStyle = 'rgba(155,176,196,.55)'
      for (const car of state.cars) {
        ctx.fillRect(toX(car.x) - 1.5, toY(car.z) - 1.5, 3, 3)
      }
    }

    if (state.cops) {
      state.cops.forEach((cop, i) => {
        ctx.fillStyle = i % 2 === 0 ? '#ff4455' : '#5599ff'
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(toX(cop.x), toY(cop.z), 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const fx = Math.sin(state.yaw)
    const fy = Math.cos(state.yaw)
    const sideX = -fy
    const sideY = fx
    ctx.save()
    ctx.translate(px, py)
    ctx.shadowColor = '#31e6ff'
    ctx.shadowBlur = 16
    ctx.fillStyle = '#a9f8ff'
    ctx.beginPath()
    ctx.moveTo(fx * 13, fy * 13)
    ctx.lineTo(-fx * 8 + sideX * 7, -fy * 8 + sideY * 7)
    ctx.lineTo(-fx * 8 - sideX * 7, -fy * 8 - sideY * 7)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }

  drawSpeedo(kmh, boost, boosting) {
    const ctx = this.speedoCtx
    const S = 320
    const cx = S / 2
    const cy = S / 2 + 4
    const R = 118
    const start = Math.PI * 0.75
    const end = Math.PI * 2.25
    const range = end - start
    ctx.clearRect(0, 0, S, S)

    ctx.beginPath()
    ctx.arc(cx, cy, R + 18, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(4,9,16,.52)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, cy, R, start, end)
    ctx.strokeStyle = 'rgba(255,255,255,.09)'
    ctx.lineWidth = 11
    ctx.lineCap = 'round'
    ctx.stroke()

    for (let v = 0; v <= 240; v += 20) {
      const a = start + (v / 240) * range
      const major = v % 60 === 0
      const r1 = R - (major ? 20 : 14)
      const r2 = R - 7
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
      ctx.strokeStyle = major ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.16)'
      ctx.lineWidth = major ? 2 : 1
      ctx.stroke()
      if (major) {
        ctx.fillStyle = 'rgba(174,203,220,.6)'
        ctx.font = '600 11px "DejaVu Sans Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(v), cx + Math.cos(a) * (R - 37), cy + Math.sin(a) * (R - 37))
      }
    }

    const frac = clamp(kmh / 240, 0, 1)
    if (frac > 0.003) {
      const grad = ctx.createLinearGradient(cx - R, cy + R, cx + R, cy - R)
      grad.addColorStop(0, '#31e6ff')
      grad.addColorStop(0.62, '#8df7ff')
      grad.addColorStop(0.86, '#ff3ba7')
      grad.addColorStop(1, '#ff7a45')
      ctx.save()
      ctx.shadowColor = frac > 0.8 ? '#ff3ba7' : '#31e6ff'
      ctx.shadowBlur = 20
      ctx.beginPath()
      ctx.arc(cx, cy, R, start, start + frac * range)
      ctx.strokeStyle = grad
      ctx.lineWidth = 11
      ctx.stroke()
      ctx.restore()
      const a = start + frac * range
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#8df7ff'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f4fdff'
    ctx.shadowColor = 'rgba(49,230,255,.55)'
    ctx.shadowBlur = 18
    ctx.font = 'italic 900 58px "Arial Black", Impact, sans-serif'
    ctx.fillText(String(Math.round(kmh)), cx, cy - 6)
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(160,198,218,.75)'
    ctx.font = '600 11px "DejaVu Sans Mono", monospace'
    ctx.letterSpacing = '2px'
    ctx.fillText('KM/H', cx, cy + 30)

    ctx.beginPath()
    ctx.arc(cx, cy, R + 9, start, end)
    ctx.strokeStyle = 'rgba(49,230,255,.18)'
    ctx.lineWidth = 3
    ctx.stroke()
    if (boost > 1) {
      const ba = start + (boost / 100) * range
      ctx.beginPath()
      ctx.arc(cx, cy, R + 9, start, ba)
      ctx.strokeStyle = boosting ? '#ff3ba7' : 'rgba(255,59,167,.5)'
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }
}
