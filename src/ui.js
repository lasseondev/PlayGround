import * as THREE from 'three'
import { formatTime, projectToScreen, clamp } from './util.js'

const SLOT_LABELS = {
  1: { name: 'PICKAXE', sub: 'HARVEST', rarity: '' },
  2: { name: 'RIFLE', sub: 'UNCOMMON', rarity: 'rarity-u' },
  3: { name: 'PUMP', sub: 'RARE', rarity: 'rarity-r' },
  4: { name: 'SMG', sub: 'RARE', rarity: 'rarity-r' }
}

export class UI {
  constructor(game) {
    this.game = game
    this.$ = id => document.getElementById(id)
    this.cache()
    this._locationTimer = null
    this._stormOn = false
    this._buildTimer = null
    this._setupCompass()
    this._lastMap = 0
    this._lastCompass = 999
    this.selectedBuild = 'wall'
  }

  cache() {
    const ids = [
      'hud', 'alive-count', 'storm-time', 'storm-label', 'storm-pill', 'shield-fill', 'shield-value',
      'health-fill', 'health-value', 'wood-count', 'brick-count', 'metal-count', 'elim-count',
      'crosshair', 'hitmarker', 'action-prompt', 'prompt-text', 'reload-indicator', 'weapon-panel',
      'build-panel', 'materials', 'build-indicator', 'killfeed', 'location-banner', 'location-name',
      'location-sub', 'toasts', 'damage-numbers', 'damage-arrows', 'storm-warning', 'storm-vignette',
      'damage-flash', 'minimap', 'map-coords', 'compass-labels', 'compass-ticks', 'start-screen',
      'pause-screen', 'end-screen', 'end-title', 'end-eyebrow', 'end-place', 'stat-elim', 'stat-damage',
      'stat-built', 'stat-time', 'loading-screen', 'build-hint', 'mute-btn-pause', 'end-card', 'fade-layer',
      'menu-atmosphere', 'start-btn', 'resume-btn', 'quit-btn', 'again-btn', 'lobby-btn'
    ]
    this.el = {}
    for (const id of ids) this.el[id] = this.$(id)
    this.el.endCard = document.querySelector('.end-card')
    this.el.healthRow = document.querySelector('.health-row')
    this.el.slots = [...document.querySelectorAll('.slot')]
    this.el.buildPieces = [...document.querySelectorAll('.build-piece')]
    this.el.matChips = [...document.querySelectorAll('.mat-chip')]
    this.minimapCtx = this.el.minimap.getContext('2d')
    this.buildTimer = null
  }

  _setupCompass() {
    const labels = [
      ['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]
    ]
    let html = ''
    for (let cycle = -1; cycle <= 2; cycle++) {
      for (const [label, deg] of labels) {
        const cls = label.length === 1 ? '' : 'minor'
        html += `<span class="${cls}" data-deg="${deg + cycle * 360}">${label}</span>`
      }
    }
    this.el['compass-labels'].innerHTML = html
    this.compassLabels = [...this.el['compass-labels'].children]
    const tickHtml = []
    for (let cycle = -1; cycle <= 2; cycle++) {
      for (let deg = 0; deg < 360; deg += 5) {
        const big = deg % 45 === 0 ? 'big' : ''
        tickHtml.push(`<i class="${big}"></i>`)
      }
    }
    this.el['compass-ticks'].innerHTML = tickHtml.join('')
    this.compassTickWidth = 11
    this.compassLabelWidth = 55
  }

  loadingDone() {
    this.el['loading-screen'].classList.add('done')
  }

  showMenu() {
    this.el['start-screen'].classList.remove('gone')
    this.el.hud.classList.add('inactive')
    this.el['menu-atmosphere'].classList.remove('off')
    this.el['pause-screen'].classList.add('hidden')
    this.el['end-screen'].classList.add('hidden')
  }

  beginMatch() {
    this.el['start-screen'].classList.add('gone')
    this.el['menu-atmosphere'].classList.add('off')
    this.el.hud.classList.remove('inactive')
    this.el['pause-screen'].classList.add('hidden')
    this.el['end-screen'].classList.add('hidden')
    this.el['storm-vignette'].classList.remove('on')
    this.el['storm-warning'].classList.remove('on')
    this._stormOn = false
  }

  showPause(show) {
    this.el['pause-screen'].classList.toggle('hidden', !show)
    if (this.el['mute-btn-pause']) this.el['mute-btn-pause'].textContent = `SOUND: ${this.game.audio?.muted ? 'OFF' : 'ON'}`
  }

  showEnd(victory, place, stats) {
    this.el['pause-screen'].classList.add('hidden')
    this.el['end-screen'].classList.remove('hidden')
    this.el.endCard.classList.toggle('victory', victory)
    this.el.endCard.classList.toggle('defeat', !victory)
    this.el['end-eyebrow'].textContent = victory ? 'LAST ONE STANDING' : 'MATCH COMPLETE'
    this.el['end-title'].textContent = victory ? 'VICTORY ROYALE' : 'ELIMINATED'
    this.el['end-place'].textContent = `#${place}`
    this.el['stat-elim'].textContent = stats.eliminations
    this.el['stat-damage'].textContent = Math.round(stats.damage)
    this.el['stat-built'].textContent = stats.built
    this.el['stat-time'].textContent = formatTime(stats.time)
  }

  updateAlive(count) {
    this.el['alive-count'].textContent = count
  }

  updateStorm(storm) {
    this.el['storm-time'].textContent = storm.finished ? 'FINAL' : formatTime(storm.timer)
    this.el['storm-label'].textContent = storm.label
    if (storm.shrinking || storm.finished) this.el['storm-pill'].style.borderLeftColor = '#c084ff'
    else this.el['storm-pill'].style.borderLeftColor = ''
  }

  updateVitals(health, shield) {
    this.el['health-fill'].style.width = `${clamp(health, 0, 100)}%`
    this.el['shield-fill'].style.width = `${clamp(shield, 0, 100)}%`
    this.el['health-value'].textContent = Math.ceil(health)
    this.el['shield-value'].textContent = Math.ceil(shield)
    this.el.healthRow.classList.toggle('low', health <= 30)
  }

  updateResources(resources) {
    this.el['wood-count'].textContent = resources.wood
    this.el['brick-count'].textContent = resources.brick
    this.el['metal-count'].textContent = resources.metal
  }

  updateAmmo(loadout) {
    for (const slot of [1, 2, 3, 4]) {
      const ws = loadout[slot]
      const el = this.el.slots.find(s => Number(s.dataset.slot) === slot)
      if (!el) continue
      const ammo = el.querySelector('.slot-ammo')
      if (!ws.unlocked) {
        el.classList.add('locked')
        ammo.textContent = '—'
        continue
      }
      el.classList.remove('locked')
      if (ws.def.kind === 'melee') ammo.textContent = '∞'
      else ammo.innerHTML = `<b>${ws.mag}</b><small>${ws.reserve}</small>`
    }
    this.setWeaponSlot(this.game.player.selectedSlot)
  }

  unlockWeapon(def) {
    const el = this.el.slots.find(s => Number(s.dataset.slot) === def.slot)
    if (!el) return
    el.classList.remove('locked')
    const meta = el.querySelector('.slot-meta')
    meta.innerHTML = `<b>${SLOT_LABELS[def.slot].name}</b><small class="${def.rarityClass || ''}">${def.rarity}</small>`
    this.toast(`${def.name} ACQUIRED`, 'gold')
  }

  setWeaponSlot(slot) {
    for (const el of this.el.slots) el.classList.toggle('selected', Number(el.dataset.slot) === slot)
  }

  updateElims(n) {
    this.el['elim-count'].textContent = `${n} ELIM${n === 1 ? '' : 'S'}`
  }

  setBuildMode(on) {
    this.el.hud.classList.toggle('build-mode', on)
    if (on) this.setBuildPiece(this.game.building?.selectedType || 'wall')
    this.game.ui?.setBuildMaterial(this.game.building?.selectedMaterial || 'wood')
  }

  setBuildPiece(type) {
    this.selectedBuild = type
    for (const el of this.el.buildPieces) el.classList.toggle('selected', el.dataset.piece === type)
  }

  setBuildMaterial(mat) {
    for (const el of this.el.matChips) el.classList.toggle('selected', el.dataset.mat === mat)
  }

  setBuildValidity(valid) {
    this.el['build-indicator'].style.color = valid ? '#ffd447' : '#ff7b88'
  }

  setSpread(spread, ads) {
    const px = clamp(5 + spread * 430, 5, 28)
    this.el.crosshair.style.setProperty('--spread', `${px.toFixed(1)}px`)
    this.el.crosshair.classList.toggle('ads', ads)
  }

  setCompass(yaw) {
    const heading = ((-yaw * 180 / Math.PI) % 360 + 360) % 360
    if (Math.abs(heading - this._lastCompass) < 0.2) return
    this._lastCompass = heading
    const labelIndex = heading / 45
    const labelOffset = -this.compassLabelWidth / 2 - labelIndex * this.compassLabelWidth
    this.el['compass-labels'].style.transform = `translateX(${labelOffset}px)`
    const tickOffset = -this.compassTickWidth / 2 - (heading / 5) * this.compassTickWidth
    this.el['compass-ticks'].style.transform = `translateX(${tickOffset}px)`
  }

  updateMapCoords(pos) {
    const north = Math.round(-pos.z)
    const east = Math.round(pos.x)
    this.el['map-coords'].textContent = `N ${String(Math.abs(north)).padStart(2, '0')} • E ${String(Math.abs(east)).padStart(2, '0')}`
  }

  updateMinimap(force = false) {
    const now = performance.now()
    if (!force && now - this._lastMap < 90) return
    this._lastMap = now
    const ctx = this.minimapCtx
    const W = this.el.minimap.width
    const H = this.el.minimap.height
    const cx = W / 2
    const cy = H / 2
    const R = W / 2 - 4
    const scale = (W / 2) / 145
    const world = this.game.world
    const player = this.game.player
    const storm = world.storm
    ctx.clearRect(0, 0, W, H)
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.clip()
    const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, R)
    bg.addColorStop(0, '#2b6d83')
    bg.addColorStop(0.55, '#275d70')
    bg.addColorStop(1, '#173c54')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
    ctx.beginPath()
    ctx.arc(cx, cy, 132 * scale, 0, Math.PI * 2)
    ctx.fillStyle = '#6b9457'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, 124 * scale, 0, Math.PI * 2)
    ctx.fillStyle = '#577f48'
    ctx.fill()
    ctx.strokeStyle = 'rgba(226,205,150,.45)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, 128 * scale, 0, Math.PI * 2)
    ctx.stroke()
    for (const p of world.pois) {
      const mx = cx + p.x * scale
      const my = cy + p.z * scale
      ctx.fillStyle = 'rgba(255,240,196,.9)'
      ctx.beginPath()
      ctx.arc(mx, my, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = '600 13px "Barlow Condensed", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(226,244,255,.58)'
      ctx.fillText(p.name, mx, my - 8)
    }
    const scx = cx + storm.center.x * scale
    const scy = cy + storm.center.y * scale
    if (!storm.finished) {
      ctx.beginPath()
      ctx.arc(scx, scy, storm.nextRadius * scale, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(235,220,255,.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([7, 6])
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.arc(scx, scy, storm.radius * scale, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(183,132,255,.95)'
    ctx.lineWidth = 4
    ctx.shadowColor = 'rgba(147,88,255,.8)'
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(122,68,210,.2)'
    ctx.beginPath()
    ctx.rect(0, 0, W, H)
    ctx.arc(scx, scy, storm.radius * scale, 0, Math.PI * 2, true)
    ctx.fill()
    for (const bot of this.game.bots.bots) {
      if (!bot.alive) continue
      const d = bot.position.distanceTo(player.position)
      if (d > 34) continue
      const bx = cx + bot.position.x * scale
      const by = cy + bot.position.z * scale
      ctx.fillStyle = d < 18 ? 'rgba(255,91,99,.95)' : 'rgba(255,152,90,.75)'
      ctx.beginPath()
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }
    const px = cx + player.position.x * scale
    const py = cy + player.position.z * scale
    const heading = player.cameraYaw
    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(-heading)
    ctx.beginPath()
    ctx.moveTo(0, -12)
    ctx.lineTo(8, 8)
    ctx.lineTo(0, 4)
    ctx.lineTo(-8, 8)
    ctx.closePath()
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,.7)'
    ctx.shadowBlur = 4
    ctx.fill()
    ctx.restore()
    ctx.restore()
    ctx.strokeStyle = 'rgba(126,202,255,.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, R - 1, 0, Math.PI * 2)
    ctx.stroke()
  }

  updateStormOverlay(player, storm) {
    const outside = !storm.contains(player.position.x, player.position.z)
    const near = storm.distanceOutside(player.position.x, player.position.z) < 10
    if (outside !== this._stormOn) {
      this._stormOn = outside
      this.el['storm-vignette'].classList.toggle('on', outside)
      this.el['storm-warning'].classList.toggle('on', outside)
    }
    this.game.audio?.setStorm(storm.damage, near || outside)
  }

  showLocation(name, sub) {
    this.el['location-name'].textContent = name
    this.el['location-sub'].textContent = sub
    this.el['location-banner'].classList.add('show')
    clearTimeout(this._locationTimer)
    this._locationTimer = setTimeout(() => this.el['location-banner'].classList.remove('show'), 3400)
  }

  showPrompt(text = 'OPEN CHEST') {
    this.el['prompt-text'].textContent = text
    this.el['action-prompt'].classList.add('show')
  }

  hidePrompt() {
    this.el['action-prompt'].classList.remove('show')
  }

  toast(text, kind = '') {
    const node = document.createElement('div')
    node.className = `toast ${kind}`
    node.textContent = text
    this.el.toasts.appendChild(node)
    while (this.el.toasts.children.length > 5) this.el.toasts.firstChild.remove()
    setTimeout(() => node.remove(), 2700)
  }

  killFeed(killer, victim, weapon, { player = false, storm = false } = {}) {
    const item = document.createElement('div')
    item.className = `feed-item${player ? ' player' : ''}`
    if (storm) item.innerHTML = `<b>STORM</b><span class="storm-tag">ELIMINATED</span><b>${victim}</b>`
    else item.innerHTML = `<b>${killer}</b><span class="weapon-tag">${weapon.replace('ASSAULT RIFLE', 'AR').replace('PUMP SHOTGUN', 'SHOTGUN').replace('RAPID SMG', 'SMG')}</span><b>${victim}</b>`
    this.el.killfeed.prepend(item)
    while (this.el.killfeed.children.length > 5) this.el.killfeed.lastChild.remove()
    setTimeout(() => {
      item.classList.add('out')
      setTimeout(() => item.remove(), 450)
    }, 5200)
  }

  hitmarker(crit = false) {
    const el = this.el.hitmarker
    el.classList.remove('show', 'crit')
    void el.offsetWidth
    el.classList.add('show')
    if (crit) el.classList.add('crit')
    this.el.crosshair.classList.add('hit')
    clearTimeout(this._hitTimer)
    this._hitTimer = setTimeout(() => this.el.crosshair.classList.remove('hit'), 120)
  }

  pulseCrosshair() {
    this.el.crosshair.classList.add('hit')
    clearTimeout(this._hitTimer)
    this._hitTimer = setTimeout(() => this.el.crosshair.classList.remove('hit'), 90)
  }

  damageFlash() {
    const el = this.el['damage-flash']
    el.classList.remove('flash')
    void el.offsetWidth
    el.classList.add('flash')
  }

  damageNumber(position, amount, { crit = false, shield = false } = {}) {
    const size = new THREE.Vector2()
    this.game.renderer.getSize(size)
    const screen = projectToScreen(position, this.game.camera, size.x, size.y)
    if (!screen.visible || screen.x < -40 || screen.x > size.x + 40 || screen.y < -40 || screen.y > size.y + 40) return
    const node = document.createElement('div')
    node.className = `dmg-num${crit ? ' crit' : ''}${shield ? ' shield' : ''}`
    node.textContent = Math.round(amount)
    node.style.left = `${screen.x}px`
    node.style.top = `${screen.y}px`
    this.el['damage-numbers'].appendChild(node)
    setTimeout(() => node.remove(), 820)
  }

  damageArrow(sourcePos, playerPos, camera) {
    const dx = sourcePos.x - playerPos.x
    const dz = sourcePos.z - playerPos.z
    const a = this.game.player.cameraYaw
    const fwd = { x: -Math.sin(a), z: -Math.cos(a) }
    const right = { x: Math.cos(a), z: -Math.sin(a) }
    const ahead = dx * fwd.x + dz * fwd.z
    const side = dx * right.x + dz * right.z
    const angle = Math.atan2(-ahead, side) * 180 / Math.PI
    const node = document.createElement('div')
    node.className = 'dmg-arrow'
    node.style.transform = `rotate(${angle}deg)`
    this.el['damage-arrows'].appendChild(node)
    setTimeout(() => node.remove(), 950)
  }

  showReload(duration) {
    const el = this.el['reload-indicator']
    el.style.setProperty('--reload-time', `${duration}s`)
    el.classList.remove('show', 'loading')
    void el.offsetWidth
    el.classList.add('show', 'loading')
  }

  hideReload() {
    this.el['reload-indicator'].classList.remove('show', 'loading')
  }

  toggleStorm(on) {
    this.el['storm-vignette'].classList.toggle('on', on)
    this.el['storm-warning'].classList.toggle('on', on)
  }

  setMuted(muted) {
    if (this.el['mute-btn-pause']) this.el['mute-btn-pause'].textContent = `SOUND: ${muted ? 'OFF' : 'ON'}`
  }

  fade(on) {
    this.el['fade-layer'].classList.toggle('on', on)
  }
}
