import { HERO_INFO, RECRUIT_OPTIONS, WAVE_INFO } from './content.js'

const ICONS = {
  blade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 20 17 7"/><path d="M14 4h6v6"/><path d="m7 14-3 3 3 3 3-3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3 20 6v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z"/><path d="m12 8 1.4 2.8 3.1.4-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.4Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 21c4 0 7-2.6 7-6.5 0-4-3-7-5-9.5.2 3-1.4 4.2-2.2 5.1-.5-1.6-1.4-3.1-2.4-4.1.1 2.2-1.5 3.2-2.4 5.1C6 12.4 5 13.7 5 14.5 5 18.4 8 21 12 21Z"/><path d="M12 21c-1.8 0-3-1.2-3-2.8 0-1.5 1.2-2.5 2-3.7.3 1.2.9 1.8 1.4 2.4.5-.5.9-1.1 1.1-1.9 1 1.1 1.5 2 1.5 3.2 0 1.6-1.2 2.8-3 2.8Z"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10M9 4.5 12 7l3-2.5M9 19.5l3-2.5 3 2.5M4.6 10.5 8.2 12l-.4 3.7M19.4 10.5 15.8 12l.4 3.7"/></svg>',
  comet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="8" r="3.5"/><path d="M13 11 3 21M11 7 3 10M17 12l-1 8"/></svg>',
  sword: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m14 4 6 6-9 9H5v-6Z"/><path d="m13 5 6 6M4 20l2.5-2.5M9 11l4 4"/><path d="M2.5 21.5 5 19"/></svg>',
  bow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 3c8 3 13 8 16 16"/><path d="M5 3 19 19"/><path d="m8 3-1 2M3 8l2-1M19 15l2 1M15 19l1 2"/><path d="M9 15l6-6"/></svg>',
  helm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M5 12V8c0-3 3-5 7-5s7 2 7 5v4Z"/><path d="M5 12h14v4c0 3-3 5-7 5s-7-2-7-5Z"/><path d="M9 9h6M9 13h6"/><path d="M12 2V1"/></svg>',
  staff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 21 15 6"/><circle cx="17" cy="3.5" r="2.2"/><path d="M15 6c1.5 1 3 1.5 4.5 1.5"/></svg>'
}

function icon(key) {
  return ICONS[key] || ICONS.sun
}

function roman(n) {
  return ['I', 'II', 'III', 'IV', 'V'][n - 1] || String(n)
}

export class UI {
  constructor(game) {
    this.game = game
    this.el = {}
    for (const id of [
      'menu', 'start-button', 'hud', 'gate-fill', 'gate-text', 'wave-kicker', 'wave-title',
      'wave-status', 'wave-progress-fill', 'aether-value', 'aether-rate', 'unit-cap',
      'ability-bar', 'ability-owner', 'recruit-grid', 'minimap', 'announce', 'feed',
      'damage-layer', 'selection-box', 'end-screen', 'end-kicker', 'end-title', 'end-subtitle',
      'end-stats', 'replay-button', 'mute-button', 'loading', 'hp-aelric', 'hp-ysolde',
      'state-aelric', 'state-ysolde'
    ]) {
      this.el[id] = document.getElementById(id)
    }
    this.activeHero = 'aelric'
    this.abilityEls = []
    this.feedTimers = new Set()
    this.lastMinimap = 0
    this.menuLeaving = false
    this.buildRecruit()
    this.buildHero('aelric')
    this.bind()
  }

  bind() {
    this.el['start-button'].addEventListener('click', () => this.game.begin())
    this.el['replay-button'].addEventListener('click', () => window.location.reload())
    this.el['mute-button'].addEventListener('click', () => {
      const muted = !this.game.audio.muted
      this.game.audio.setMuted(muted)
      this.el['mute-button'].textContent = muted ? 'Sound Off' : 'Sound On'
    })
    for (const card of document.querySelectorAll('.hero-card')) {
      card.addEventListener('click', () => {
        this.game.selectHero(card.dataset.hero)
        this.game.audio.click()
      })
    }
    this.el.minimap.addEventListener('pointerdown', (event) => {
      const rect = this.el.minimap.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      this.game.setCameraFromMinimap(x, y)
    })
  }

  buildRecruit() {
    this.el['recruit-grid'].innerHTML = RECRUIT_OPTIONS.map((opt, index) => `
      <button class="recruit" type="button" data-type="${opt.type}" data-index="${index}" title="Recruit ${opt.name} — ${opt.cost} Aether">
        <span class="recruit-key">${opt.key}</span>
        <span class="recruit-icon">${icon(opt.type === 'footman' ? 'sword' : opt.type === 'archer' ? 'bow' : opt.type === 'knight' ? 'helm' : 'staff')}</span>
        <span class="recruit-name">${opt.name}</span>
        <span class="recruit-cost">◈ ${opt.cost}</span>
      </button>
    `).join('')
    this.recruitEls = [...this.el['recruit-grid'].querySelectorAll('.recruit')]
    for (const btn of this.recruitEls) {
      btn.addEventListener('click', () => {
        this.game.recruit(btn.dataset.type)
      })
    }
  }

  buildHero(key) {
    this.activeHero = key
    const info = HERO_INFO[key]
    this.el['ability-owner'].textContent = `${info.name} · ${info.title}`
    this.el['ability-bar'].innerHTML = info.abilities.map((ability, index) => `
      <button class="ability" type="button" data-index="${index}" title="${ability.name} — ${ability.desc}">
        <span class="art-icon">${icon(ability.icon)}</span>
        <span class="art-copy">
          <span class="art-name">${ability.name}</span>
          <span class="art-cost">${ability.target === 'self' ? 'Self' : 'Targeted'}</span>
        </span>
        <span class="art-key">${ability.key}</span>
        <span class="art-cd"></span>
      </button>
    `).join('')
    this.abilityEls = [...this.el['ability-bar'].querySelectorAll('.ability')]
    for (const btn of this.abilityEls) {
      btn.addEventListener('click', () => {
        this.game.castAbility(Number(btn.dataset.index))
      })
    }
    for (const card of document.querySelectorAll('.hero-card')) {
      card.classList.toggle('selected', card.dataset.hero === key)
    }
  }

  setHero(key) {
    if (key && key !== this.activeHero) this.buildHero(key)
  }

  begin() {
    if (this.menuLeaving) return
    this.menuLeaving = true
    this.el.menu.classList.add('leaving')
    this.el.hud.classList.remove('hidden')
    this.el.hud.classList.add('entering')
    setTimeout(() => this.el.menu.classList.add('hidden'), 460)
    setTimeout(() => this.el.hud.classList.remove('entering'), 850)
  }

  hideLoading() {
    this.el.loading.classList.add('done')
    setTimeout(() => this.el.loading.classList.add('hidden'), 700)
  }

  announce(kicker, title, subtitle = '', duration = 3.4) {
    const el = this.el.announce
    el.innerHTML = `<span class="ann-kicker">${kicker}</span><span class="ann-title">${title}</span>${subtitle ? `<span class="ann-sub">${subtitle}</span>` : ''}`
    el.classList.remove('show')
    void el.offsetWidth
    el.style.animationDuration = `${duration}s`
    el.classList.add('show')
  }

  feed(text, tone = '') {
    const item = document.createElement('div')
    item.className = `feed-item ${tone}`
    item.textContent = text
    this.el.feed.appendChild(item)
    while (this.el.feed.children.length > 4) this.el.feed.firstElementChild.remove()
    const timer = setTimeout(() => {
      item.style.opacity = '0'
      item.style.transition = 'opacity .4s ease'
      setTimeout(() => item.remove(), 420)
      this.feedTimers.delete(timer)
    }, 5400)
    this.feedTimers.add(timer)
  }

  showSelectionBox(rect) {
    const box = this.el['selection-box']
    if (!rect) {
      box.classList.add('hidden')
      return
    }
    box.classList.remove('hidden')
    box.style.left = `${rect.x}px`
    box.style.top = `${rect.y}px`
    box.style.width = `${rect.w}px`
    box.style.height = `${rect.h}px`
  }

  update(game, dt, camera) {
    this.el['gate-fill'].style.width = `${Math.max(0, (game.gateHp / game.gateMax) * 100)}%`
    this.el['gate-text'].textContent = `${Math.ceil(game.gateHp)} / ${game.gateMax}`
    this.el['aether-value'].textContent = Math.floor(game.aether)
    this.el['aether-rate'].textContent = `+${game.aetherRate} / s`
    this.el['unit-cap'].textContent = `${game.playerUnits.filter((u) => !u.dead).length} / ${game.unitCap}`

    const wave = WAVE_INFO[Math.min(game.wave - 1, WAVE_INFO.length - 1)]
    this.el['wave-kicker'].textContent = game.waveState === 'victory' ? 'Victory' : wave.kicker
    this.el['wave-title'].textContent = wave.title
    if (game.waveState === 'prep') {
      const seconds = Math.max(0, Math.ceil(game.waveCountdown))
      this.el['wave-status'].textContent = `The next host arrives in ${seconds}s · rally now`
      this.el['wave-progress-fill'].style.width = `${Math.min(100, (1 - game.waveCountdown / game.wavePrep) * 100)}%`
    } else if (game.waveState === 'active' || game.waveState === 'boss') {
      this.el['wave-status'].textContent = `Enemies remaining · ${game.enemiesRemaining}`
      this.el['wave-progress-fill'].style.width = `${Math.min(100, (game.waveKilled / Math.max(1, game.waveTotal)) * 100)}%`
    } else if (game.waveState === 'cleared') {
      this.el['wave-status'].textContent = 'Wave broken — the Dawn holds'
      this.el['wave-progress-fill'].style.width = '100%'
    } else {
      this.el['wave-status'].textContent = 'The Ashen Crown is broken'
      this.el['wave-progress-fill'].style.width = '100%'
    }

    if (game.gateUnderAttack) this.el['wave-kicker'].style.color = '#f08b70'
    else this.el['wave-kicker'].style.color = ''

    for (const key of ['aelric', 'ysolde']) {
      const unit = game.heroUnits[key]
      const hp = unit ? Math.max(0, unit.hp / unit.maxHp) : 0
      this.el[`hp-${key}`].style.width = `${hp * 100}%`
      const state = this.el[`state-${key}`]
      const card = document.querySelector(`.hero-card[data-hero="${key}"]`)
      if (unit && unit.dead) {
        state.textContent = `Fallen ${Math.ceil(unit.respawnTimer)}s`
        card.classList.add('fallen')
      } else {
        state.textContent = ''
        card.classList.remove('fallen')
      }
      card.classList.toggle('selected', game.selectedHero === key)
    }

    const info = HERO_INFO[this.activeHero]
    const cooldowns = game.abilityCooldowns[this.activeHero]
    const heroUnit = game.heroUnits[this.activeHero]
    this.abilityEls.forEach((el, index) => {
      const cd = cooldowns[index]
      const cooling = cd > 0.15
      el.classList.toggle('cooling', cooling)
      el.classList.toggle('unavailable', !heroUnit || heroUnit.dead)
      const cdEl = el.querySelector('.art-cd')
      if (cooling) cdEl.textContent = Math.ceil(cd)
      else cdEl.textContent = ''
    })
    this.el['ability-owner'].textContent = `${info.name} · ${info.title}`

    for (const btn of this.recruitEls) {
      const opt = RECRUIT_OPTIONS[Number(btn.dataset.index)]
      const living = game.playerUnits.filter((u) => !u.dead).length
      btn.disabled = game.aether < opt.cost || living >= game.unitCap || game.ended
    }

    if (this.lastMinimap + 0.08 < performance.now()) {
      this.drawMinimap(game)
      this.lastMinimap = performance.now()
    }
  }

  drawMinimap(game) {
    const canvas = this.el.minimap
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const minX = -46
    const maxX = 46
    const minZ = -46
    const maxZ = 26
    const mapX = (x) => ((x - minX) / (maxX - minX)) * w
    const mapY = (z) => ((z - minZ) / (maxZ - minZ)) * h

    ctx.clearRect(0, 0, w, h)
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#17101d')
    grad.addColorStop(0.45, '#101712')
    grad.addColorStop(0.75, '#1b2017')
    grad.addColorStop(1, '#25231c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.globalAlpha = 0.55
    ctx.strokeStyle = 'rgba(215,179,108,.1)'
    ctx.lineWidth = 1
    for (let i = 1; i < 8; i++) {
      const x = (i / 8) * w
      const y = (i / 8) * h
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.restore()

    ctx.fillStyle = 'rgba(120,105,78,.24)'
    ctx.beginPath()
    ctx.moveTo(mapX(-7), mapY(12))
    ctx.lineTo(mapX(7), mapY(12))
    ctx.lineTo(mapX(4), mapY(-34))
    ctx.lineTo(mapX(-4), mapY(-34))
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(110,98,76,.46)'
    ctx.fillRect(mapX(-23), mapY(21), mapX(23) - mapX(-23), mapY(26) - mapY(21))
    ctx.fillStyle = 'rgba(215,179,108,.55)'
    ctx.fillRect(mapX(-3), mapY(21), mapX(3) - mapX(-3), mapY(26) - mapY(21))

    ctx.fillStyle = 'rgba(177,92,255,.35)'
    for (const p of game.portalPositions) {
      ctx.beginPath()
      ctx.arc(mapX(p.x), mapY(p.z), 7, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const unit of game.units) {
      if (unit.dead) continue
      const size = unit.isHero || unit.isBoss ? 3.4 : 2.1
      ctx.beginPath()
      ctx.fillStyle = unit.team === 'player' ? (unit.isHero ? '#ffe3a0' : '#d8c38f') : (unit.isBoss ? '#ff8b69' : '#dc6651')
      ctx.arc(mapX(unit.position.x), mapY(unit.position.z), size, 0, Math.PI * 2)
      ctx.fill()
      if (unit.isHero || unit.isBoss) {
        ctx.strokeStyle = unit.team === 'player' ? 'rgba(255,235,185,.6)' : 'rgba(255,130,95,.55)'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const cam = game.cameraTarget
    ctx.save()
    ctx.strokeStyle = 'rgba(255,229,164,.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(mapX(cam.x), mapY(cam.z), 7 + (game.cameraDistance - 24) * 0.16, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(mapX(cam.x) - 8, mapY(cam.z))
    ctx.lineTo(mapX(cam.x) + 8, mapY(cam.z))
    ctx.moveTo(mapX(cam.x), mapY(cam.z) - 8)
    ctx.lineTo(mapX(cam.x), mapY(cam.z) + 8)
    ctx.stroke()
    ctx.restore()

    ctx.strokeStyle = 'rgba(215,179,108,.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1)
  }

  showEnd(result, stats) {
    const screen = this.el['end-screen']
    screen.classList.remove('hidden')
    screen.classList.toggle('defeat', result === 'defeat')
    const sigil = document.getElementById('end-sigil')
    if (sigil) sigil.textContent = result === 'victory' ? '✦' : '✖'
    this.el['end-kicker'].textContent = result === 'victory' ? 'The field is won' : 'The gate has fallen'
    this.el['end-title'].textContent = result === 'victory' ? 'The Dawn Endures' : 'The Ashen Crown'
    this.el['end-subtitle'].textContent = result === 'victory'
      ? 'Malgor is broken. The Sunspire burns bright, and the horde scatters into embers.'
      : 'The Sunspire Gate is lost. The Sundered Field falls silent beneath the ash.'
    const minutes = Math.floor(stats.time / 60)
    const seconds = Math.floor(stats.time % 60).toString().padStart(2, '0')
    this.el['end-stats'].innerHTML = `
      <div class="end-stat"><b>${minutes}:${seconds}</b><span>Battle Time</span></div>
      <div class="end-stat"><b>${stats.kills}</b><span>Foes Broken</span></div>
      <div class="end-stat"><b>${stats.lost}</b><span>Dawn Fallen</span></div>
      <div class="end-stat"><b>${Math.max(0, Math.ceil(stats.gate))}</b><span>Gate Remaining</span></div>
    `
  }
}
