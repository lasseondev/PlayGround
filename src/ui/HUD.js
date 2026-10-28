const $ = (id) => document.getElementById(id)

export class HUD {
  constructor(game) {
    this.game = game
    this.root = $('hud')
    this.el = {
      waveNum: $('wave-num'), waveProgress: $('wave-progress'), waveSub: $('wave-sub'), hostiles: $('hostiles'),
      score: $('score'), killTotal: $('kill-total'), killfeed: $('killfeed'),
      healthBar: $('health-bar'), healthNum: $('health-num'), staminaBar: $('stamina-bar'),
      partnerPanel: $('partner-panel'), partnerHp: $('partner-hp'), partnerState: $('partner-state'), partnerRevive: $('partner-revive'), reviveProgress: $('revive-progress'),
      grenades: $('grenades'), weaponName: $('weapon-name'), ammoMag: $('ammo-mag'), ammoReserve: $('ammo-reserve'), slot1: $('slot-1'), slot2: $('slot-2'),
      crosshair: $('crosshair'), hitmarker: $('hitmarker'), subtitle: $('subtitle'), interact: $('interact'), interactLabel: $('interact-label'),
      waveBanner: $('wave-banner'), wbTitle: $('wb-title'), wbSub: $('wb-sub'), lowHealth: $('low-health'),
      fxDamage: $('fx-damage'), fxHeal: $('fx-heal'), compassTape: $('compass-tape'), compassDeg: $('compass-deg'),
      damageArrows: $('damage-arrows')
    }
    this.killfeedItems = []
    this.subtitleTimer = null
    this.damageTimer = null
    this.bannerTimer = null
    this.quality = $('quality-label')
    this.lowHealthOn = false
  }

  show() { this.root.classList.remove('hidden') }
  hide() { this.root.classList.add('hidden') }

  reset() {
    this.el.killfeed.innerHTML = ''
    this.killfeedItems.length = 0
    this.el.subtitle.classList.remove('on')
    this.el.waveBanner.classList.add('hidden')
    this.el.waveBanner.classList.remove('out')
    this.el.interact.classList.add('hidden')
    this.el.lowHealth.classList.add('hidden')
    this.lowHealthOn = false
    this.el.crosshair.classList.remove('ads', 'hidden')
    this.el.damageArrows.innerHTML = ''
    this.el.fxDamage.classList.remove('on')
    this.el.fxHeal.classList.remove('on')
    this.el.partnerPanel.classList.remove('down')
  }

  setWave(wave) {
    this.el.waveNum.textContent = String(wave.number).padStart(2, '0')
    const total = Math.max(1, wave.total)
    const remaining = wave.remaining + wave.toSpawn
    const progress = Math.max(0, Math.min(1, 1 - remaining / total))
    this.el.waveProgress.style.width = `${progress * 100}%`
    this.el.hostiles.textContent = remaining
    if (wave.intermission) {
      this.el.waveSub.innerHTML = `NEXT WAVE IN <b>${Math.ceil(wave.intermissionLeft)}</b>`
    } else {
      this.el.waveSub.innerHTML = `HOSTILES REMAINING <b>${remaining}</b>`
    }
  }

  setScore(score, kills) {
    this.el.score.textContent = score.toLocaleString('en-US')
    this.el.killTotal.textContent = `${kills} KILL${kills === 1 ? '' : 'S'}`
  }

  setWeapon(weapon) {
    const d = weapon.def
    this.el.weaponName.textContent = d.name
    this.el.ammoMag.textContent = String(weapon.state.mag).padStart(2, '0')
    this.el.ammoReserve.textContent = weapon.state.reserve
    this.el.ammoMag.classList.toggle('low', weapon.state.mag <= Math.ceil(d.mag * 0.25))
    this.el.slot1.classList.toggle('active', weapon.current === 'rifle')
    this.el.slot2.classList.toggle('active', weapon.current === 'shotgun')
  }

  updateVitals(player) {
    const hp = Math.max(0, Math.round(player.health))
    this.el.healthBar.style.width = `${(player.health / player.maxHealth) * 100}%`
    this.el.healthNum.textContent = hp
    this.el.staminaBar.style.width = `${player.stamina}%`
    const low = player.health <= 32 && player.state === 'alive'
    if (low !== this.lowHealthOn) {
      this.lowHealthOn = low
      this.el.lowHealth.classList.toggle('hidden', !low)
    }
    if (player.state === 'dead') this.el.healthNum.textContent = '0'
  }

  setGrenades(n) { this.el.grenades.textContent = n }

  updatePartner(partner) {
    if (!partner) { this.el.partnerPanel.classList.add('hidden'); return }
    this.el.partnerPanel.classList.remove('hidden')
    const down = partner.down
    this.el.partnerPanel.classList.toggle('down', down)
    this.el.partnerHp.style.width = `${Math.max(0, partner.hp / partner.maxHp) * 100}%`
    this.el.partnerState.textContent = down ? 'DOWN' : partner.hp < 100 ? 'WOUNDED' : 'LINKED'
    this.el.partnerRevive.classList.toggle('hidden', !down)
    if (down) this.el.reviveProgress.style.width = `${Math.min(100, partner.reviveProgress * 100)}%`
  }

  hitmarker(head = false, kill = false) {
    const el = this.el.hitmarker
    el.classList.remove('on', 'head')
    void el.offsetWidth
    el.classList.add('on')
    if (head) el.classList.add('head')
    if (kill) el.style.transform = 'scale(1.3)'
    else el.style.transform = ''
  }

  damageFlash(amount) {
    const el = this.el.fxDamage
    el.classList.add('on')
    clearTimeout(this.damageTimer)
    this.damageTimer = setTimeout(() => el.classList.remove('on'), 140)
  }

  damageArrow(source) {
    if (!source) return
    const p = this.game.player
    const dx = source.x - p.pos.x, dz = source.z - p.pos.z
    const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw)
    const rightX = Math.cos(p.yaw), rightZ = -Math.sin(p.yaw)
    const angle = Math.atan2(dx * rightX + dz * rightZ, dx * fwdX + dz * fwdZ) * 180 / Math.PI
    const wrap = document.createElement('div')
    wrap.className = 'dmg-arrow'
    wrap.style.transform = `rotate(${angle - 90}deg)`
    const i = document.createElement('i')
    wrap.appendChild(i)
    this.el.damageArrows.appendChild(wrap)
    setTimeout(() => wrap.remove(), 750)
  }

  healFlash() {
    const el = this.el.fxHeal
    el.classList.add('on')
    setTimeout(() => el.classList.remove('on'), 240)
  }

  subtitle(speaker, text, duration = 2) {
    clearTimeout(this.subtitleTimer)
    this.el.subtitle.innerHTML = speaker ? `<b>${speaker}</b> ${text}` : text
    this.el.subtitle.classList.add('on')
    this.subtitleTimer = setTimeout(() => this.el.subtitle.classList.remove('on'), duration * 1000)
  }

  interact(show, label = '') {
    this.el.interact.classList.toggle('hidden', !show)
    if (label) this.el.interactLabel.textContent = label
  }

  killfeed(type, head) {
    const names = { walker: 'WALKER', runner: 'RUNNER', brute: 'BRUTE', crawler: 'CRAWLER' }
    const div = document.createElement('div')
    div.className = 'kill-line'
    div.innerHTML = `<b>${names[type] || 'INFECTED'}</b> ${head ? '<span class="hs">HEADSHOT</span>' : 'DOWN'} · <b>M4</b>`
    this.el.killfeed.appendChild(div)
    this.killfeedItems.push(div)
    if (this.killfeedItems.length > 4) {
      const old = this.killfeedItems.shift()
      old.remove()
    }
    setTimeout(() => {
      div.style.transition = 'opacity .4s'
      div.style.opacity = '0'
      setTimeout(() => div.remove(), 400)
    }, 3600)
  }

  waveBanner(title, sub, duration = 2.8) {
    const banner = this.el.waveBanner
    clearTimeout(this.bannerTimer)
    this.el.wbTitle.textContent = title
    this.el.wbSub.textContent = sub
    banner.classList.remove('hidden', 'out')
    void banner.offsetWidth
    this.bannerTimer = setTimeout(() => {
      banner.classList.add('out')
      setTimeout(() => banner.classList.add('hidden'), 500)
    }, duration * 1000)
  }

  updateCrosshair(player, weapon) {
    const d = weapon.def
    const moving = Math.hypot(player.velocity.x, player.velocity.z) > 1.5
    const base = THREE_lerp(6, 20, 1 - weapon.ads)
    const spread = 4 + (moving ? 7 : 0) + (weapon.reloading > 0 ? 14 : 0) + (player.sprinting ? 8 : 0)
    this.el.crosshair.style.setProperty('--spread', `${spread}px`)
    this.el.crosshair.classList.toggle('ads', weapon.ads > 0.6)
  }

  updateCompass(yaw) {
    let deg = ((-yaw * 180 / Math.PI) % 360 + 360) % 360
    this.el.compassDeg.textContent = String(Math.round(deg)).padStart(3, '0')
    const offset = (deg / 360) * 320
    this.el.compassTape.style.backgroundPosition = `${-offset}px 0`
    this.el.compassTape.style.transform = 'none'
  }

  setQuality(label) { if (this.quality) this.quality.textContent = label }

  showGameover(stats) {
    $('stat-wave').textContent = stats.wave
    $('stat-kills').textContent = stats.kills
    $('stat-heads').textContent = stats.headshots
    $('stat-acc').textContent = `${stats.accuracy}%`
    $('stat-score').textContent = stats.score.toLocaleString('en-US')
    $('stat-time').textContent = stats.time
    $('gameover-copy').textContent = stats.copy || 'The mall keeps its guests.'
    $('gameover').classList.remove('hidden')
  }
}

function THREE_lerp(a, b, t) { return a + (b - a) * t }
