const $ = (s) => document.querySelector(s)
const fmt = (v) => Math.max(0, Math.round(v)).toLocaleString('en-US')

const COMMANDS = [
  { id: 'marine', key: '1', label: 'MARINE', icon: 'i-marine', cost: '50' },
  { id: 'scv', key: '2', label: 'SCV', icon: 'i-scv', cost: '50' },
  { id: 'tank', key: '3', label: 'SIEGE TANK', icon: 'i-tank', cost: '150·100' },
  { id: 'supply', key: '4', label: 'SUPPLY DROP', icon: 'i-supply', cost: '100' },
  { id: 'stim', key: '5', label: 'STIM', icon: 'i-stim', cost: 'HP' },
  { id: 'scan', key: '6', label: 'SCAN', icon: 'i-scan', cost: '—' },
  { id: 'repair', key: '7', label: 'REPAIR', icon: 'i-repair', cost: '—' },
  { id: 'attack', key: '8', label: 'ATTACK-MOVE', icon: 'i-attack', cost: '—' },
]

const UNIT_INFO = {
  marine: { name: 'DOMINION MARINE', desc: 'Heavy infantry. Rapid-fire C-14 gauss rifle. Effective against light Swarm.', hp: 55, stats: [['ARMOR', '1'], ['RANGE', '9'], ['DPS', '14']] },
  scv: { name: 'SCV', desc: 'Resource harvester and field engineer. Mines minerals and repairs mechanical units.', hp: 45, stats: [['ARMOR', '0'], ['RANGE', '—'], ['CARRY', '8']] },
  tank: { name: 'SIEGE TANK', desc: 'Main battle tank. Long-range plasma cannon. Devastating against armored targets.', hp: 175, stats: [['ARMOR', '2'], ['RANGE', '14'], ['DPS', '26']] },
  zergling: { name: 'ZERGLING', desc: 'Fast melee Swarm organism. Attacks in packs. Fragile alone.', hp: 35, stats: [['ARMOR', '0'], ['RANGE', 'MELEE'], ['SPEED', 'FAST']] },
  hydralisk: { name: 'HYDRALISK', desc: 'Ranged Swarm bioform. Fires armor-piercing spines from range.', hp: 85, stats: [['ARMOR', '1'], ['RANGE', '8'], ['DPS', '11']] },
  commandcenter: { name: 'COMMAND CENTER', desc: 'Colonial command hub. Trains SCVs. Loss of this structure ends the mission.', hp: 1500, stats: [['ARMOR', '2'], ['SUPPLY', '+10'], ['STATUS', 'CRITICAL']] },
  barracks: { name: 'BARRACKS', desc: 'Infantry production facility. Trains Marines and Siege Tanks.', hp: 900, stats: [['ARMOR', '2'], ['QUEUE', '0'], ['STATUS', 'ONLINE']] },
  supply: { name: 'SUPPLY DEPOT', desc: 'Command logistics node. Increases available supply by 8.', hp: 400, stats: [['ARMOR', '1'], ['SUPPLY', '+8'], ['STATUS', 'ONLINE']] },
  turret: { name: 'MISSILE TURRET', desc: 'Automated defense platform. Tracks and eliminates Swarm flyers and ground targets.', hp: 260, stats: [['ARMOR', '1'], ['RANGE', '12'], ['STATUS', 'AUTO']] },
  hive: { name: 'SWARM HIVE', desc: 'Primary Swarm spawning structure. Destroy it to stop the assault permanently.', hp: 2000, stats: [['ARMOR', '3'], ['THREAT', 'SEVERE'], ['STATUS', 'ACTIVE']] },
}

export class UI {
  constructor() {
    this.el = {
      hud: $('#hud'), splash: $('#splash'), deploy: $('#deploy'), loadFill: $('#load-fill'), loadLabel: $('#load-label'), loadPct: $('#load-pct'),
      minerals: $('#res-minerals'), gas: $('#res-gas'), supply: $('#res-supply'), clock: $('#clock'),
      waveNum: $('#wave-num'), waveTimer: $('#wave-timer'), waveProgress: $('#wave-progress'), enemyCount: $('#enemy-count'), killCount: $('#kill-count'),
      threatFill: $('#threat-fill'), threatLabel: $('#threat-label'), scvCount: $('#scv-count'), objPrimary: $('#obj-primary'), objEconomy: $('#obj-economy'),
      selName: $('#sel-name'), selDesc: $('#sel-desc'), selHp: $('#sel-hp'), selHpText: $('#sel-hp-text'), selStats: $('#sel-stats'), selCount: $('#sel-count'),
      portrait: $('#portrait'), cmdGrid: $('#cmd-grid'), buildStatus: $('#build-status'), toasts: $('#toasts'),
      minimap: $('#minimap'), audio: $('#audio-toggle'), flash: $('#flash'),
    }
    this.onCommand = null
    this.onDeploy = null
    this.onJump = null
    this.selectedSig = ''
    this.buttons = {}
    this.minimapBg = null
    this.minimapRect = null
    this.buildCommands()
    this.bind()
  }

  buildCommands() {
    this.el.cmdGrid.innerHTML = COMMANDS.map((c) => `
      <button class="cmd-btn" data-id="${c.id}" aria-label="${c.label}" title="${c.label}">
        <span class="key">${c.key}</span><span class="cost">${c.cost}</span>
        <svg><use href="#${c.icon}"></use></svg><span>${c.label}</span>
      </button>`).join('')
    for (const c of COMMANDS) {
      const b = this.el.cmdGrid.querySelector(`[data-id="${c.id}"]`)
      b.addEventListener('click', () => this.onCommand?.(c.id))
      this.buttons[c.id] = b
    }
  }

  bind() {
    this.el.deploy.addEventListener('click', () => {
      if (this.el.deploy.disabled) return
      this.el.splash.classList.add('hidden')
      this.el.splash.style.display = 'none'
      this.el.hud.classList.remove('hidden')
      this.onDeploy?.()
    })
    this.el.audio.addEventListener('click', () => {
      const on = this.onAudioToggle?.() !== false
      this.el.audio.textContent = on ? '◈' : '◇'
      this.el.audio.style.color = on ? '' : '#5d7f91'
    })
    const mm = this.el.minimap
    const jump = (e) => {
      const r = mm.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      this.onJump?.(x * 180 - 90, y * 180 - 90)
    }
    mm.addEventListener('pointerdown', (e) => { mm.setPointerCapture(e.pointerId); jump(e) })
    mm.addEventListener('pointermove', (e) => { if (e.buttons) jump(e) })
  }

  startLoading() {
    this.el.deploy.disabled = false
    this.el.deploy.classList.add('pulse')
    this.el.loadLabel.textContent = 'ALL SYSTEMS ONLINE — AWAITING COMMANDER'
    this.el.loadPct.textContent = '100%'
    this.el.loadFill.style.transition = 'width 1.1s cubic-bezier(.2,.7,.2,1)'
    requestAnimationFrame(() => { this.el.loadFill.style.width = '100%' })
  }

  setAudio(on) { this.el.audio.textContent = on ? '◈' : '◇'; this.el.audio.style.color = on ? '' : '#5d7f91' }
  onAudio(fn) { this.onAudioToggle = fn }

  toast(text, kind = '') {
    const d = document.createElement('div')
    d.className = 'toast ' + kind
    d.textContent = text
    this.el.toasts.appendChild(d)
    setTimeout(() => d.remove(), 3800)
  }

  flash(strength = 0.55) {
    this.el.flash.style.transition = 'none'
    this.el.flash.style.opacity = strength
    requestAnimationFrame(() => {
      this.el.flash.style.transition = 'opacity .7s ease'
      this.el.flash.style.opacity = 0
    })
  }

  updateHud(s) {
    this.el.minerals.textContent = fmt(s.minerals)
    this.el.gas.textContent = fmt(s.gas)
    this.el.supply.textContent = `${s.supply}/${s.maxSupply}`
    this.el.supply.parentElement.style.opacity = s.supply >= s.maxSupply ? 0.55 : 1
    this.el.waveNum.textContent = Math.min(s.wave, 5)
    this.el.killCount.textContent = s.kills
    this.el.enemyCount.textContent = s.enemies
    const total = s.waveDuration || 60
    const t = Math.max(0, s.waveTimer)
    this.el.waveTimer.textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`
    this.el.waveProgress.style.width = (t / total * 100) + '%'
    const threat = Math.min(1, (s.wave - 1) / 4 + Math.min(0.35, s.enemies * 0.035))
    this.el.threatFill.style.width = (18 + threat * 82) + '%'
    this.el.threatLabel.textContent = threat > 0.78 ? 'SEVERE' : threat > 0.52 ? 'HIGH' : threat > 0.3 ? 'ELEVATED' : 'LOW'
    this.el.threatLabel.style.color = threat > 0.7 ? '#ff5b45' : threat > 0.4 ? '#ffd47a' : '#8dffb5'
    this.el.scvCount.textContent = s.scvs
    this.el.objPrimary.classList.toggle('done', s.wave > 5)
    this.el.objEconomy.classList.toggle('done', s.scvs > 0)
    const mm = Math.floor(s.time / 60), ss = Math.floor(s.time % 60)
    this.el.clock.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    this.el.buildStatus.textContent = s.status || 'SYSTEMS NOMINAL'
  }

  setCommandState(active, disabled) {
    for (const c of COMMANDS) {
      const b = this.buttons[c.id]
      if (!b) continue
      b.disabled = !!disabled[c.id]
      b.classList.toggle('active', !!active[c.id])
    }
  }

  setSelection(units) {
    const first = units[0]
    const sig = units.length + ':' + (first ? first.type : '') + ':' + (units.length === 1 ? first.id : '')
    this.el.selCount.textContent = units.length ? String(units.length) : ''
    if (sig === this.selectedSig) { this.updateSelectionBars(units); return }
    this.selectedSig = sig
    if (!units.length) {
      this.el.selName.textContent = 'NO UNIT SELECTED'
      this.el.selDesc.textContent = 'Select units with left click. Issue orders with right click.'
      this.el.selHp.style.width = '0%'; this.el.selHpText.textContent = '—'
      this.el.selStats.innerHTML = ''
      this.drawPortrait(null)
      return
    }
    const info = UNIT_INFO[first.type] || { name: first.type.toUpperCase(), desc: '', stats: [] }
    if (units.length > 1) {
      this.el.selName.textContent = first.team === 'enemy' ? 'SWARM GROUP' : 'STRIKE GROUP'
      this.el.selDesc.textContent = `${units.length} units under command. ${first.team === 'player' ? 'Right click to move or attack.' : 'Hostile formation detected.'}`
    } else {
      this.el.selName.textContent = info.name
      this.el.selDesc.textContent = info.desc
    }
    this.el.selStats.innerHTML = (units.length > 1
      ? [['UNITS', units.length], ['TEAM', first.team === 'player' ? 'DOMINION' : 'SWARM'], ['STATUS', 'ENGAGED']]
      : info.stats).map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join('')
    this.drawPortrait(units.length > 1 ? 'group' : first.type, first.team)
    this.updateSelectionBars(units)
  }

  updateSelectionBars(units) {
    if (!units.length) return
    let hp = 0, max = 0
    for (const u of units) { hp += Math.max(0, u.hp); max += u.maxHp }
    const f = max ? hp / max : 0
    this.el.selHp.style.width = (f * 100) + '%'
    this.el.selHp.style.background = f < 0.3 ? 'linear-gradient(90deg,#ff3d25,#ff8a63)' : f < 0.6 ? 'linear-gradient(90deg,#e5b340,#ffe08b)' : 'linear-gradient(90deg,#25cfa8,#7dffd0)'
    this.el.selHpText.textContent = `${Math.ceil(hp)}/${Math.round(max)}`
  }

  drawPortrait(type, team = 'player') {
    const c = this.el.portrait
    const x = c.getContext('2d')
    x.clearRect(0, 0, 128, 128)
    const bg = x.createLinearGradient(0, 0, 128, 128)
    bg.addColorStop(0, '#0b1d2b'); bg.addColorStop(1, '#040b12')
    x.fillStyle = bg; x.fillRect(0, 0, 128, 128)
    x.strokeStyle = 'rgba(99,244,255,.14)'; x.lineWidth = 1
    for (let i = 0; i < 128; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke() }
    x.strokeStyle = 'rgba(99,244,255,.5)'; x.lineWidth = 2
    x.beginPath(); x.moveTo(8, 26); x.lineTo(8, 8); x.lineTo(26, 8); x.stroke()
    x.beginPath(); x.moveTo(120, 102); x.lineTo(120, 120); x.lineTo(102, 120); x.stroke()
    const col = team === 'enemy' ? '#ff785f' : '#6af0ff'
    const dim = team === 'enemy' ? 'rgba(255,120,95,.18)' : 'rgba(99,244,255,.16)'
    x.save(); x.translate(64, 66)
    x.shadowColor = col; x.shadowBlur = 16; x.strokeStyle = col; x.fillStyle = dim; x.lineWidth = 2.4
    if (type === 'marine' || type === 'group') {
      x.beginPath(); x.arc(0, -18, 22, Math.PI, 0); x.lineTo(22, 14); x.lineTo(-22, 14); x.closePath(); x.fill(); x.stroke()
      x.fillStyle = team === 'enemy' ? '#ffd2c8' : '#bdfaff'; x.fillRect(-17, -18, 34, 8)
      x.beginPath(); x.moveTo(-30, 14); x.lineTo(-20, 2); x.lineTo(-16, 30); x.lineTo(-30, 34); x.closePath(); x.fill(); x.stroke()
      x.beginPath(); x.moveTo(30, 14); x.lineTo(20, 2); x.lineTo(16, 30); x.lineTo(30, 34); x.closePath(); x.fill(); x.stroke()
      x.strokeRect(-12, 18, 24, 24)
      if (type === 'group') { x.strokeStyle = col; x.globalAlpha = 0.65; x.strokeRect(-40, 36, 18, 12); x.strokeRect(22, 36, 18, 12) }
    } else if (type === 'scv') {
      x.beginPath(); x.roundRect(-24, -24, 48, 42, 8); x.fill(); x.stroke()
      x.beginPath(); x.arc(0, -6, 12, 0, 7); x.fillStyle = '#bdfaff'; x.fill(); x.stroke()
      x.strokeRect(-30, 22, 14, 22); x.strokeRect(16, 22, 14, 22)
      x.beginPath(); x.moveTo(-24, 4); x.lineTo(-40, 20); x.lineTo(-34, 28); x.stroke()
      x.beginPath(); x.moveTo(24, 4); x.lineTo(40, 20); x.lineTo(34, 28); x.stroke()
    } else if (type === 'tank') {
      x.beginPath(); x.roundRect(-42, 8, 84, 22, 6); x.fill(); x.stroke()
      x.beginPath(); x.moveTo(-30, 8); x.lineTo(-22, -20); x.lineTo(24, -20); x.lineTo(34, 8); x.closePath(); x.fill(); x.stroke()
      x.strokeRect(-10, -28, 24, 10)
      x.beginPath(); x.moveTo(8, -24); x.lineTo(62, -24); x.lineWidth = 5; x.stroke()
      for (let i = -34; i < 40; i += 16) { x.beginPath(); x.arc(i, 30, 6, 0, 7); x.stroke() }
    } else if (type === 'zergling' || type === 'hydralisk') {
      x.beginPath(); x.moveTo(-36, 4); x.quadraticCurveTo(-10, -34, 28, -10); x.quadraticCurveTo(44, 2, 20, 12); x.quadraticCurveTo(-8, 24, -36, 4); x.fill(); x.stroke()
      x.fillStyle = col; x.beginPath(); x.arc(10, -10, 4, 0, 7); x.fill(); x.beginPath(); x.arc(-2, -13, 3, 0, 7); x.fill()
      x.beginPath(); x.moveTo(-36, 4); x.lineTo(-52, 18); x.lineTo(-34, 18); x.fill(); x.stroke()
      x.beginPath(); x.moveTo(28, -10); x.lineTo(48, -26); x.lineTo(48, -4); x.fill(); x.stroke()
      for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-20 + i * 16, 16); x.lineTo(-28 + i * 16, 46); x.stroke() }
    } else if (type === 'commandcenter' || type === 'barracks' || type === 'supply' || type === 'turret' || type === 'hive') {
      x.beginPath(); x.moveTo(-42, 32); x.lineTo(-30, -6); x.lineTo(-16, -18); x.lineTo(20, -18); x.lineTo(38, 4); x.lineTo(42, 32); x.closePath(); x.fill(); x.stroke()
      x.fillStyle = '#bdfaff'; x.fillRect(-18, -6, 36, 8)
      x.strokeRect(-22, 8, 44, 20)
      x.beginPath(); x.moveTo(0, -18); x.lineTo(0, -42); x.stroke()
      x.beginPath(); x.arc(0, -42, 6, 0, 7); x.fill(); x.stroke()
    } else {
      x.beginPath(); x.arc(0, 0, 30, 0, 7); x.fill(); x.stroke()
      x.beginPath(); x.moveTo(-18, 0); x.lineTo(18, 0); x.moveTo(0, -18); x.lineTo(0, 18); x.stroke()
    }
    x.restore()
    x.globalAlpha = 0.18; x.fillStyle = col
    for (let y = 0; y < 128; y += 4) x.fillRect(0, y, 128, 1)
    x.globalAlpha = 1
  }

  setMinimapWorld(world) {
    const W = 220, H = 180
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const x = c.getContext('2d')
    x.fillStyle = '#061019'; x.fillRect(0, 0, W, H)
    for (let py = 0; py < H; py += 5) {
      for (let px = 0; px < W; px += 5) {
        const wx = px / W * 180 - 90
        const wz = py / H * 180 - 90
        const h = world.terrainHeight(wx, wz)
        const l = Math.round(16 + Math.max(-1, Math.min(1, h / 6)) * 16)
        x.fillStyle = `rgb(${l},${l + 4},${l + 7})`
        x.fillRect(px, py, 5, 5)
      }
    }
    const cx = (0 + 90) / 180 * W, cy = (-53 + 90) / 180 * H
    const g = x.createRadialGradient(cx, cy, 4, cx, cy, 34)
    g.addColorStop(0, 'rgba(123,54,160,.75)'); g.addColorStop(0.7, 'rgba(74,28,94,.42)'); g.addColorStop(1, 'rgba(40,15,55,0)')
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 34, 0, 7); x.fill()
    const bx = (2 + 90) / 180 * W, by = (6 + 90) / 180 * H
    const g2 = x.createRadialGradient(bx, by, 2, bx, by, 22)
    g2.addColorStop(0, 'rgba(80,200,230,.2)'); g2.addColorStop(1, 'rgba(80,200,230,0)')
    x.fillStyle = g2; x.beginPath(); x.arc(bx, by, 22, 0, 7); x.fill()
    x.strokeStyle = 'rgba(99,244,255,.1)'; x.lineWidth = 1
    for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(i * W / 6, 0); x.lineTo(i * W / 6, H); x.stroke(); x.beginPath(); x.moveTo(0, i * H / 6); x.lineTo(W, i * H / 6); x.stroke() }
    x.strokeStyle = 'rgba(99,244,255,.35)'; x.strokeRect(0.5, 0.5, W - 1, H - 1)
    this.minimapBg = c
    this.minimapRect = { W, H }
  }

  drawMinimap(state) {
    const c = this.el.minimap
    const x = c.getContext('2d')
    const W = 220, H = 180
    if (this.minimapBg) x.drawImage(this.minimapBg, 0, 0)
    else { x.fillStyle = '#061019'; x.fillRect(0, 0, W, H) }
    const toMap = (wx, wz) => [((wx + 90) / 180) * W, ((wz + 90) / 180) * H]
    if (state.minerals) {
      x.fillStyle = '#66e6ff'; x.shadowColor = '#66e6ff'; x.shadowBlur = 4
      for (const m of state.minerals) { const [px, py] = toMap(m.x, m.z); x.fillRect(px - 1.5, py - 1.5, 3, 3) }
      x.shadowBlur = 0
    }
    for (const b of state.buildings) {
      const [px, py] = toMap(b.x, b.z)
      x.fillStyle = b.team === 'player' ? '#67f4d1' : '#c06bff'
      x.fillRect(px - 3, py - 3, 6, 6)
      x.strokeStyle = 'rgba(0,0,0,.5)'; x.strokeRect(px - 3, py - 3, 6, 6)
    }
    for (const u of state.units) {
      const [px, py] = toMap(u.x, u.z)
      x.fillStyle = u.team === 'player' ? (u.selected ? '#ffffff' : '#67f4d1') : '#ff6b52'
      x.beginPath(); x.arc(px, py, u.selected ? 2.4 : 1.7, 0, 7); x.fill()
    }
    if (state.viewPoly && state.viewPoly.length === 4) {
      x.beginPath()
      state.viewPoly.forEach(([wx, wz], i) => { const [px, py] = toMap(wx, wz); i ? x.lineTo(px, py) : x.moveTo(px, py) })
      x.closePath()
      x.strokeStyle = 'rgba(99,244,255,.75)'; x.lineWidth = 1
      x.stroke(); x.fillStyle = 'rgba(99,244,255,.06)'; x.fill()
    }
    if (state.alert) {
      x.strokeStyle = 'rgba(255,90,69,.8)'; x.lineWidth = 1.5
      x.beginPath(); x.arc(W / 2, H * 0.3, 10 + Math.sin(state.time * 6) * 4, 0, 7); x.stroke()
    }
  }

  showEnd(victory, stats) {
    const d = document.createElement('div')
    d.style.cssText = 'position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 45%,rgba(10,30,45,.84),rgba(2,6,10,.96));text-align:center;letter-spacing:.16em;'
    d.innerHTML = `<div style="font-size:10px;color:#6f9caf;margin-bottom:12px">OPERATION DARK EXPANSE</div>
      <div style="font-size:38px;font-weight:800;color:${victory ? '#8dffb5' : '#ff6b52'};text-shadow:0 0 32px ${victory ? 'rgba(100,255,160,.4)' : 'rgba(255,80,60,.4)'}">${victory ? 'SECTOR SECURED' : 'OUTPOST LOST'}</div>
      <div style="font-size:11px;color:#8fb2c3;max-width:430px;line-height:1.8;margin:14px 0 18px">${victory ? 'The Swarm offensive has been broken. Dominion reinforcements are inbound. Your command record has been transmitted to High Command.' : 'The command center has fallen. Char-9 is lost to the Swarm. Regroup and redeploy.'}</div>
      <div style="display:flex;gap:28px;margin-bottom:24px;color:#d8f6ff;font-size:10px"><span>WAVES <b>${stats.wave}</b></span><span>KILLS <b>${stats.kills}</b></span><span>MINERALS <b>${stats.minerals}</b></span></div>
      <button id="restart" style="padding:14px 44px;font-family:inherit;font-size:11px;font-weight:700;letter-spacing:.26em;background:linear-gradient(180deg,#a8f8ff,#4fd8ee,#1fa3c0);border:0;color:#071018;cursor:pointer;clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)">REDEPLOY</button>`
    document.getElementById('app').appendChild(d)
    d.querySelector('#restart').addEventListener('click', () => location.reload())
  }
}
