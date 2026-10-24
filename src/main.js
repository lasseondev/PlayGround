import {
  CHAMPIONS,
  CHAMPION_LIST,
  ITEMS,
  SUMMONERS,
  TEAM,
  TEAM_COLORS,
  buyItem,
  createMatch,
  dealDamage,
  distance,
  getStructure,
  matchSummary,
  updateMatch
} from './sim.js'
import { Renderer } from './render.js'

const canvas = document.querySelector('#game')
const minimapCanvas = document.querySelector('#minimap')
const renderer = new Renderer(canvas, minimapCanvas)
const menu = document.querySelector('#menu')
const hud = document.querySelector('#hud')
const championCards = document.querySelector('#championCards')
const playButton = document.querySelector('#playButton')
const abilitySlots = document.querySelector('#abilitySlots')
const summonerSlots = document.querySelector('#summonerSlots')
const itemSlots = document.querySelector('#itemSlots')
const killfeed = document.querySelector('#killfeed')
const announce = document.querySelector('#announce')
const shop = document.querySelector('#shop')
const shopItems = document.querySelector('#shopItems')
const shopGold = document.querySelector('#shopGold')
const shopClose = document.querySelector('#shopClose')
const pause = document.querySelector('#pause')
const endScreen = document.querySelector('#endScreen')
const deathOverlay = document.querySelector('#deathOverlay')
const respawnTimer = document.querySelector('#respawnTimer')
const joystick = document.querySelector('#joystick')
const joystickKnob = document.querySelector('#joystickKnob')
const coach = document.createElement('div')

const preview = createMatch({ playerChampion: 'aurelia', enemyChampion: 'nyx', seed: 8675309 })
preview.champions = []
preview.minions = []
preview.effects = []
preview.projectiles = []
preview.traps = []
preview.delayed = []
preview.announcements = []
preview.events = []

const state = {
  mode: 'menu',
  selected: 'aurelia',
  match: null,
  animation: 0,
  camera: { x: 1600, y: 1600, zoom: 1 },
  mouse: { x: window.innerWidth / 2 + 260, y: window.innerHeight / 2 },
  aim: { x: 1600, y: 1600 },
  input: {
    moveX: 0,
    moveY: 0,
    aimX: 1600,
    aimY: 1600,
    attack: false,
    moveTo: null,
    pressed: {}
  },
  keys: new Set(),
  particles: [],
  floaters: [],
  shake: 0,
  lastHud: 0,
  itemSignature: '',
  abilityElements: {},
  summonerElements: {},
  announceTimer: 0,
  feedEntries: [],
  touch: window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  touchMove: { x: 0, y: 0 },
  joystickPointer: null,
  deathShown: false,
  endShown: false,
  sound: null,
  menuHint: 0
}

const POWER = {
  aurelia: { damage: 82, durability: 76, difficulty: 52 },
  kael: { damage: 92, durability: 38, difficulty: 28 },
  nyx: { damage: 96, durability: 42, difficulty: 82 }
}

const ICONS = {
  dash: '<path d="M3 12h10M9 7l5 5-5 5M15 7l5 5-5 5"/>',
  shield: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spin: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
  meteor: '<path d="M4 4l9 9M14 3l6 6M12 13l5 5"/><circle cx="16" cy="16" r="4"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 9-13h-6z"/>',
  trap: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M6 6l12 12M18 6L6 18"/>',
  beam: '<path d="M3 12h18M7 8l4 4-4 4M17 8l-4 4 4 4"/>',
  nova: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>',
  root: '<path d="M7 4v16M17 4v16M7 8h10M7 16h10M4 4l3 4M20 4l-3 4"/>',
  blink: '<path d="M4 12h16M6 8l4 4-4 4M18 8l-4 4 4 4"/>',
  heal: '<path d="M12 4v16M4 12h16"/>',
  flash: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  sword: '<path d="M14 4l6 6M9 15L4 20l-1-1 5-5M13 5l6 6-5 5-6-6z"/>',
  boots: '<path d="M5 4v10l4 4h9a2 2 0 0 0 2-2v-1c0-2-2-3-4-4l-4-1V4z"/>',
  tome: '<path d="M4 5a3 3 0 0 1 3-2h13v18H7a3 3 0 0 1-3-3zM8 7h8M8 11h8M8 15h5"/>',
  belt: '<rect x="3" y="9" width="18" height="6" rx="2"/><rect x="9" y="7" width="6" height="10" rx="1"/>',
  scepter: '<path d="M12 3v14M8 21h8M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
  aegis: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6zM9 12l2 2 4-4"/>',
  rod: '<path d="M12 3v18M8 6l4-3 4 3M6 21h12M9 12h6"/>',
  edge: '<path d="M4 20l4-4M8 16L20 4M12 8l4 4M6 18l-2 2M16 8l-3 3"/>',
  hourglass: '<path d="M7 3h10M7 21h10M8 3v4l4 4 4-4V3M8 21v-4l4-4 4 4v4"/>'
}

function icon(name, className = '') {
  const inner = ICONS[name] || ICONS.nova
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
}

function championData(id = state.selected) {
  return CHAMPIONS[id]
}

class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.enabled = true
    this.lastShot = 0
    this.ambient = null
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
      return
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    this.ctx = new AudioContext()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.enabled ? 0.34 : 0
    this.master.connect(this.ctx.destination)
    this.startAmbient()
  }

  startAmbient() {
    if (!this.ctx || this.ambient) return
    const gain = this.ctx.createGain()
    gain.gain.value = 0.022
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 220
    const first = this.ctx.createOscillator()
    first.type = 'sine'
    first.frequency.value = 49
    const second = this.ctx.createOscillator()
    second.type = 'triangle'
    second.frequency.value = 73.5
    first.connect(filter)
    second.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    first.start()
    second.start()
    this.ambient = { gain, first, second }
  }

  tone(frequency, duration, options = {}) {
    if (!this.ctx || !this.enabled) return
    const now = this.ctx.currentTime + (options.delay || 0)
    const oscillator = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    oscillator.type = options.type || 'sine'
    oscillator.frequency.setValueAtTime(frequency, now)
    if (options.slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, options.slide), now + duration)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, options.gain || 0.035), now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.03)
  }

  noise(duration, options = {}) {
    if (!this.ctx || !this.enabled) return
    const now = this.ctx.currentTime
    const length = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length)
    }
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = options.type || 'bandpass'
    filter.frequency.value = options.frequency || 1200
    filter.Q.value = options.q || 0.8
    const gain = this.ctx.createGain()
    gain.gain.value = options.gain || 0.05
    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    source.start(now)
  }

  play(name, detail = '') {
    if (!this.ctx || !this.enabled) return
    const now = performance.now()
    if (name === 'hit' && now - this.lastShot < 45) return
    if (name === 'hit') this.lastShot = now
    if (name === 'hit') {
      this.noise(0.07, { frequency: 1500, gain: 0.032 })
      this.tone(150, 0.08, { type: 'triangle', gain: 0.015, slide: 82 })
    } else if (name === 'crit') {
      this.noise(0.12, { frequency: 2100, gain: 0.045 })
      this.tone(520, 0.15, { type: 'square', gain: 0.018, slide: 300 })
    } else if (name === 'cast') {
      const map = { q: 430, w: 320, e: 540, r: 180, d: 620, f: 760 }
      this.tone(map[detail] || 400, 0.22, { type: 'sine', gain: 0.035, slide: (map[detail] || 400) * 1.8 })
      this.noise(0.12, { frequency: 900, gain: 0.025 })
    } else if (name === 'tower') {
      this.tone(110, 0.12, { type: 'sawtooth', gain: 0.018, slide: 70 })
    } else if (name === 'death') {
      this.noise(0.3, { frequency: 420, gain: 0.06 })
      this.tone(180, 0.4, { type: 'sawtooth', gain: 0.03, slide: 60 })
    } else if (name === 'levelup') {
      ;[440, 554, 660, 880].forEach((frequency, index) => {
        this.tone(frequency, 0.26, { type: 'triangle', gain: 0.025, delay: index * 0.07 })
      })
    } else if (name === 'victory') {
      ;[262, 330, 392, 523, 659].forEach((frequency, index) => {
        this.tone(frequency, 0.9, { type: 'triangle', gain: 0.028, delay: index * 0.13 })
      })
    } else if (name === 'defeat') {
      ;[220, 196, 165, 131].forEach((frequency, index) => {
        this.tone(frequency, 1.1, { type: 'sine', gain: 0.03, delay: index * 0.18 })
      })
    } else if (name === 'select') {
      this.tone(660, 0.08, { type: 'triangle', gain: 0.018, slide: 880 })
    } else if (name === 'buy') {
      this.tone(740, 0.1, { type: 'triangle', gain: 0.02, slide: 1180 })
      this.tone(1180, 0.12, { type: 'sine', gain: 0.014, delay: 0.05 })
    } else if (name === 'deny') {
      this.tone(180, 0.16, { type: 'square', gain: 0.014, slide: 120 })
    } else if (name === 'shield') {
      this.tone(760, 0.18, { type: 'sine', gain: 0.018, slide: 1050 })
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(enabled ? 0.34 : 0, this.ctx.currentTime, 0.03)
    }
  }
}

state.sound = new AudioEngine()

function buildChampionCards() {
  championCards.innerHTML = CHAMPION_LIST.map(champion => {
    const data = champion
    const power = POWER[data.id]
    return `
      <button class="champion-card${data.id === state.selected ? ' selected' : ''}" type="button" data-champion="${data.id}" style="--champ:${data.color};--champ-accent:${data.accent}">
        <div class="card-top"><span class="role">${data.role}</span><span>${data.difficulty}</span></div>
        <div class="card-portrait">
          <span class="halo"></span>
          <span class="glyph">${data.glyph}</span>
        </div>
        <h3>${data.name}</h3>
        <p class="champion-title">${data.title}</p>
        <p class="lore">${data.lore}</p>
        <div class="power-bars">
          <div><span>Power</span><i style="--power:${power.damage}%"></i></div>
          <div><span>Resolve</span><i style="--power:${power.durability}%"></i></div>
          <div><span>Mastery</span><i style="--power:${power.difficulty}%"></i></div>
        </div>
        <div class="ability-list">
          ${['q', 'w', 'e', 'r'].map(key => {
            const ability = data.abilities[key]
            return `<span class="ability-mini">${icon(ability.icon)}<span>${ability.name}</span></span>`
          }).join('')}
        </div>
      </button>
    `
  }).join('')
  championCards.querySelectorAll('.champion-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selected = card.dataset.champion
      championCards.querySelectorAll('.champion-card').forEach(candidate => candidate.classList.toggle('selected', candidate === card))
      state.sound.init()
      state.sound.play('select')
    })
  })
}

function portraitMarkup(champion, className) {
  return `<div class="portrait ${className || ''}" style="--champ:${champion.color}">${champion.glyph}</div>`
}

function buildAbilitySlots() {
  const champion = championData()
  abilitySlots.innerHTML = ['q', 'w', 'e', 'r'].map(key => {
    const ability = champion.abilities[key]
    return `
      <button class="ability-card" type="button" data-key="${key}" style="--ability-color:${ability.color}" title="${ability.name}: ${ability.desc}">
        <span class="key-badge">${key.toUpperCase()}</span>
        <span class="ability-icon">${icon(ability.icon)}</span>
        <span class="ability-name">${ability.name}</span>
        <span class="mana-cost">${ability.mana}</span>
        <span class="cooldown-mask hidden"></span>
      </button>
    `
  }).join('')
  state.abilityElements = {}
  abilitySlots.querySelectorAll('.ability-card').forEach(card => {
    state.abilityElements[card.dataset.key] = {
      card,
      mask: card.querySelector('.cooldown-mask'),
      cost: card.querySelector('.mana-cost')
    }
    card.addEventListener('pointerdown', event => {
      event.preventDefault()
      queueAbility(card.dataset.key)
    })
  })
  summonerSlots.innerHTML = ['d', 'f'].map(key => {
    const spell = SUMMONERS[key]
    return `
      <button class="summoner-card" type="button" data-summoner="${key}" style="--ability-color:${spell.color}" title="${spell.name}: ${spell.desc}">
        <span class="key-badge">${key.toUpperCase()}</span>
        <span class="ability-icon">${icon(spell.icon)}</span>
        <span class="mana-cost">${spell.cooldown}</span>
        <span class="cooldown-mask hidden"></span>
      </button>
    `
  }).join('')
  state.summonerElements = {}
  summonerSlots.querySelectorAll('.summoner-card').forEach(card => {
    state.summonerElements[card.dataset.summoner] = {
      card,
      mask: card.querySelector('.cooldown-mask')
    }
    card.addEventListener('pointerdown', event => {
      event.preventDefault()
      queueSummoner(card.dataset.summoner)
    })
  })
  itemSlots.innerHTML = Array.from({ length: 6 }, () => '<div class="item-slot"></div>').join('')
  state.itemSignature = ''
}

function buildShop() {
  shopItems.innerHTML = ITEMS.map((item, index) => `
    <button class="shop-item" type="button" data-item="${item.id}" style="--item-color:${item.color}">
      <span class="shop-icon">${icon(item.icon)}</span>
      <span class="shop-info"><strong>${index + 1}. ${item.name}</strong><small>${item.desc}</small></span>
      <span class="shop-cost">${item.cost}g</span>
    </button>
  `).join('')
  shopItems.querySelectorAll('.shop-item').forEach(button => {
    button.addEventListener('click', () => purchase(button.dataset.item))
  })
  refreshShop()
}

function refreshShop() {
  if (!state.match) return
  const player = state.match.player
  shopGold.textContent = Math.floor(player.gold)
  const full = player.items.length >= 6
  shopItems.querySelectorAll('.shop-item').forEach(button => {
    const item = ITEMS.find(candidate => candidate.id === button.dataset.item)
    button.disabled = !state.match || player.gold < item.cost || full
  })
}

function purchase(itemId) {
  if (!state.match || state.match.state !== 'playing') return
  const purchased = buyItem(state.match, state.match.player, itemId)
  if (purchased) {
    state.sound.play('buy')
    state.itemSignature = ''
    updateItemSlots()
    refreshShop()
    updateHud(0, true)
  } else {
    state.sound.play('deny')
  }
}

function updateItemSlots() {
  if (!state.match) return
  const player = state.match.player
  const signature = player.items.join('|')
  if (signature === state.itemSignature) return
  state.itemSignature = signature
  itemSlots.querySelectorAll('.item-slot').forEach((slot, index) => {
    const itemId = player.items[index]
    const item = itemId ? ITEMS.find(candidate => candidate.id === itemId) : null
    slot.className = 'item-slot'
    slot.innerHTML = ''
    if (item) {
      slot.classList.add('filled')
      slot.style.setProperty('--item-color', item.color)
      slot.innerHTML = icon(item.icon)
      slot.title = `${item.name}: ${item.desc.replace(/<br>/g, ' ')}`
    } else {
      slot.removeAttribute('style')
      slot.removeAttribute('title')
    }
  })
}

function resetCollections() {
  state.particles = []
  state.floaters = []
  state.feedEntries = []
  killfeed.innerHTML = ''
  state.shake = 0
  state.deathShown = false
  state.endShown = false
  deathOverlay.classList.add('hidden')
  endScreen.classList.add('hidden')
  shop.classList.add('hidden')
  pause.classList.add('hidden')
}

function startGame() {
  const champion = championData()
  state.match = createMatch({ playerChampion: champion.id, seed: (Date.now() ^ 0x51a7c0de) >>> 0 })
  state.mode = 'playing'
  state.animation = state.animation || 0
  resetCollections()
  state.sound.init()
  state.sound.play('select')
  document.body.classList.remove('is-menu')
  document.body.classList.add('is-playing')
  menu.classList.add('hidden')
  hud.classList.remove('hidden')
  hud.setAttribute('aria-hidden', 'false')
  const player = state.match.player
  state.camera.x = player.x
  state.camera.y = player.y
  state.camera.zoom = baseZoom()
  state.mouse.x = window.innerWidth / 2 + 220
  state.mouse.y = window.innerHeight / 2 - 100
  state.aim.x = player.x + 240
  state.aim.y = player.y - 180
  player.portrait = portraitMarkup(champion)
  document.querySelector('#playerPortrait').innerHTML = portraitMarkup(champion)
  document.querySelector('#playerPortrait').style.setProperty('--champ', champion.color)
  document.querySelector('#playerPortrait').className = 'portrait'
  const enemy = state.match.enemy
  const enemyData = CHAMPIONS[enemy.championId]
  document.querySelector('#enemyPortrait').innerHTML = portraitMarkup(enemyData, 'enemy')
  document.querySelector('#enemyPortrait').className = 'portrait enemy'
  document.querySelector('#enemyPortrait').style.setProperty('--champ', enemyData.color)
  document.querySelector('#playerName').textContent = champion.name
  document.querySelector('#enemyName').textContent = enemyData.name
  document.querySelector('#enemyRole').textContent = enemyData.role
  buildAbilitySlots()
  buildShop()
  updateItemSlots()
  state.lastHud = 0
  updateHud(0, true)
  if (state.touch) joystick.classList.remove('hidden')
  coach.className = 'coach-line'
  coach.textContent = state.touch
    ? 'Drag the joystick to move · Tap Strike to attack · Tap abilities to cast'
    : 'Right-click to move · Hold left mouse to strike · B opens the armory'
  hud.appendChild(coach)
  setTimeout(() => { coach.style.opacity = '0' }, 7000)
  document.activeElement?.blur()
}

function baseZoom() {
  return Math.max(0.54, Math.min(1.22, Math.min(window.innerWidth / 1500, window.innerHeight / 920)))
}

function returnToMenu() {
  state.mode = 'menu'
  state.match = null
  resetCollections()
  document.body.classList.add('is-menu')
  document.body.classList.remove('is-playing')
  menu.classList.remove('hidden')
  hud.classList.add('hidden')
  hud.setAttribute('aria-hidden', 'true')
  joystick.classList.add('hidden')
  if (coach.parentElement) coach.parentElement.removeChild(coach)
  state.camera.zoom = baseZoom()
  document.activeElement?.blur()
}

function openShop() {
  if (state.mode !== 'playing' || !state.match) return
  state.mode = 'shop'
  state.input.attack = false
  state.input.moveTo = null
  shop.classList.remove('hidden')
  refreshShop()
}

function closeShop() {
  if (state.mode !== 'shop') return
  state.mode = 'playing'
  shop.classList.add('hidden')
}

function openPause() {
  if (state.mode === 'shop') {
    closeShop()
    return
  }
  if (state.mode !== 'playing') return
  state.mode = 'paused'
  state.input.attack = false
  state.input.moveTo = null
  pause.classList.remove('hidden')
}

function closePause() {
  if (state.mode !== 'paused') return
  state.mode = 'playing'
  pause.classList.add('hidden')
}

function showAnnouncement(text, subtitle, tone) {
  announce.querySelector('strong').textContent = text
  announce.querySelector('span').textContent = subtitle || ''
  announce.className = `announcement ${tone || 'neutral'}`
  void announce.offsetWidth
  announce.classList.add('show')
  clearTimeout(state.announceTimer)
  state.announceTimer = setTimeout(() => announce.classList.remove('show'), 2800)
}

function addFeed(text, tone) {
  const entry = document.createElement('div')
  entry.textContent = text
  entry.className = tone || ''
  killfeed.appendChild(entry)
  state.feedEntries.push(entry)
  if (state.feedEntries.length > 5) {
    const old = state.feedEntries.shift()
    if (old.parentElement) old.parentElement.removeChild(old)
  }
  setTimeout(() => {
    entry.style.opacity = '0'
    entry.style.transition = 'opacity 0.4s ease'
    setTimeout(() => {
      if (entry.parentElement) entry.parentElement.removeChild(entry)
      state.feedEntries = state.feedEntries.filter(candidate => candidate !== entry)
    }, 420)
  }, 5600)
}

function addFloater(x, y, text, color, size = 14, crit = false) {
  if (state.floaters.length > 80) state.floaters.shift()
  state.floaters.push({
    x, y, text, color, size, crit,
    life: crit ? 1.05 : 0.82,
    maxLife: crit ? 1.05 : 0.82,
    vy: -32 - Math.random() * 18
  })
}

function addParticle(x, y, options = {}) {
  if (state.particles.length > 520) return
  state.particles.push({
    x,
    y,
    vx: options.vx ?? (Math.random() - 0.5) * 90,
    vy: options.vy ?? (Math.random() - 0.5) * 90,
    size: options.size ?? 2 + Math.random() * 3,
    color: options.color || '#8ef0ff',
    life: options.life ?? 0.4 + Math.random() * 0.5,
    maxLife: options.life ?? 0.4 + Math.random() * 0.5,
    drag: options.drag ?? 0.92,
    gravity: options.gravity ?? 0,
    glow: options.glow ?? true
  })
}

function burst(x, y, color, count, speed = 120, size = 3) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const power = speed * (0.25 + Math.random() * 0.85)
    addParticle(x, y, {
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - 20,
      size: size * (0.5 + Math.random()),
      color,
      life: 0.35 + Math.random() * 0.65,
      glow: Math.random() > 0.2
    })
  }
}

function consumeEvents() {
  if (!state.match) return
  const events = state.match.events.splice(0, state.match.events.length)
  for (const event of events) {
    if (event.type === 'hit') {
      const color = event.crit ? '#ffe17c' : event.damageType === 'magic' ? '#c690ff' : event.sourceTeam === TEAM.AZURE ? '#aef6ff' : '#ff9cb0'
      if (event.crit) addParticle(event.x, event.y, { size: 6, color: '#ffe17c', vy: -50, life: 0.6 })
      burst(event.x, event.y, color, event.crit ? 9 : 4, event.crit ? 170 : 110, event.crit ? 3.6 : 2.4)
      if (event.targetKind === 'champion' || event.targetKind === 'structure' || event.amount >= 45 || event.crit) {
        addFloater(event.x + (Math.random() - 0.5) * 18, event.y, String(event.amount), color, event.crit ? 18 : 14, event.crit)
      }
      if (event.targetKind === 'champion') state.sound.play(event.crit ? 'crit' : 'hit')
    }
    if (event.type === 'cast') {
      if (event.team === TEAM.AZURE) state.sound.play('cast', event.key)
      const champion = state.match.champions.find(candidate => candidate.championId === event.champion && candidate.team === event.team)
      if (champion) {
        burst(champion.x, champion.y - 15, CHAMPIONS[event.champion].color, event.key === 'r' ? 18 : 8, event.key === 'r' ? 180 : 100, 3)
      }
    }
    if (event.type === 'summoner') state.sound.play('cast', event.key)
    if (event.type === 'shake') state.shake = Math.max(state.shake, event.amount)
    if (event.type === 'announce') showAnnouncement(event.text, event.subtitle, event.tone)
    if (event.type === 'killfeed') addFeed(event.text, event.tone)
    if (event.type === 'championDeath') {
      const teamColor = TEAM_COLORS[event.team].primary
      burst(event.x, event.y, teamColor, 34, 230, 4)
      burst(event.x, event.y, '#ffe9a8', 14, 160, 3)
      state.shake = Math.max(state.shake, 9)
      state.sound.play('death')
    }
    if (event.type === 'levelup' && event.team === TEAM.AZURE) {
      state.sound.play('levelup')
      if (state.match.player) {
        addFloater(state.match.player.x, state.match.player.y - 90, 'LEVEL UP', '#ffe28a', 16)
        burst(state.match.player.x, state.match.player.y, '#ffe28a', 22, 150, 3)
      }
    }
    if (event.type === 'buy' && event.team === TEAM.AZURE) {
      state.itemSignature = ''
      updateItemSlots()
      refreshShop()
    }
    if (event.type === 'structureDown') {
      state.shake = Math.max(state.shake, 8)
      state.sound.play('death')
    }
    if (event.type === 'lastHit' && event.team === TEAM.AZURE) {
      addFloater(event.x, event.y, '+', '#ffd66b', 13)
    }
    if (event.type === 'shielded') {
      addFloater(event.x, event.y - 50, 'SHIELDED', '#9defff', 13)
    }
    if (event.type === 'oom' || event.type === 'locked') {
      const elements = state.abilityElements[event.key]
      if (elements) {
        elements.card.classList.add('pulse')
        setTimeout(() => elements.card.classList.remove('pulse'), 420)
      }
      state.sound.play('deny')
    }
    if (event.type === 'gameover') {
      finishMatch(event.winner)
    }
  }
}

function finishMatch(winner) {
  if (state.endShown || !state.match) return
  state.endShown = true
  state.mode = 'ended'
  state.input.attack = false
  const won = winner === TEAM.AZURE
  const summary = matchSummary(state.match)
  endScreen.classList.remove('hidden')
  endScreen.classList.toggle('defeat', !won)
  document.querySelector('#endEyebrow').innerHTML = `<span></span>${won ? 'Nexus Destroyed' : 'Your Nexus Has Fallen'}<span></span>`
  document.querySelector('#endTitle').textContent = won ? 'VICTORY' : 'DEFEAT'
  document.querySelector('#endSubtitle').textContent = won ? 'The enemy nexus shatters. The rift is yours.' : 'The enemy breaks through. The rift falls silent.'
  document.querySelector('#endStats').innerHTML = `
    <div class="end-stat"><b>${summary.player.kills} / ${summary.player.deaths}</b><span>K / D</span></div>
    <div class="end-stat"><b>${summary.player.cs}</b><span>Minions</span></div>
    <div class="end-stat"><b>${summary.player.damage.toLocaleString()}</b><span>Damage</span></div>
    <div class="end-stat"><b>${formatTime(summary.time)}</b><span>Duration</span></div>
  `
  deathOverlay.classList.add('hidden')
  announce.classList.remove('show')
  announce.classList.add('hidden')
  state.sound.play(won ? 'victory' : 'defeat')
  if (won) {
    for (let index = 0; index < 90; index += 1) {
      addParticle(
        state.match.enemy.x + (Math.random() - 0.5) * 500,
        state.match.enemy.y + (Math.random() - 0.5) * 500,
        { vx: (Math.random() - 0.5) * 330, vy: -80 - Math.random() * 300, color: Math.random() < 0.5 ? '#ffe28a' : '#8ef0ff', size: 2 + Math.random() * 4, life: 1.2 + Math.random() * 1.5 }
      )
    }
  }
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  const remaining = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

function queueAbility(key) {
  if (state.mode !== 'playing' || !state.match) return
  const touchAim = touchTarget()
  state.input.aimX = touchAim.x
  state.input.aimY = touchAim.y
  state.input.pressed[key] = true
}

function queueSummoner(key) {
  if (state.mode !== 'playing' || !state.match) return
  const touchAim = touchTarget()
  state.input.aimX = touchAim.x
  state.input.aimY = touchAim.y
  state.input.pressed[key] = true
}

function touchTarget() {
  if (!state.touch || !state.match) return state.aim
  const player = state.match.player
  let best = null
  let bestDistance = 900
  for (const champion of state.match.champions) {
    if (champion.team === player.team || champion.dead) continue
    const current = distance(player.x, player.y, champion.x, champion.y)
    if (current < bestDistance) {
      best = champion
      bestDistance = current
    }
  }
  if (!best) {
    for (const minion of state.match.minions) {
      if (minion.team === player.team || !minion.alive) continue
      const current = distance(player.x, player.y, minion.x, minion.y)
      if (current < bestDistance) {
        best = minion
        bestDistance = current
      }
    }
  }
  if (best) return { x: best.x, y: best.y }
  return { x: player.x + Math.cos(player.facing) * 220, y: player.y + Math.sin(player.facing) * 220 }
}

function updateHud(elapsed, force = false) {
  if (!state.match) return
  state.lastHud += elapsed
  if (!force && state.lastHud < 0.05) return
  state.lastHud = 0
  const player = state.match.player
  const enemy = state.match.enemy
  const data = championData(player.championId)
  const enemyData = CHAMPIONS[enemy.championId]
  document.querySelector('#playerName').textContent = player.name
  document.querySelector('#playerLevel').textContent = String(player.level)
  document.querySelector('#playerHpFill').style.width = `${Math.max(0, player.hp / player.maxHp) * 100}%`
  document.querySelector('#playerManaFill').style.width = `${Math.max(0, player.mana / player.maxMana) * 100}%`
  document.querySelector('#playerHpText').textContent = `${Math.ceil(player.hp)} / ${Math.round(player.maxHp)}`
  document.querySelector('#playerManaText').textContent = `${Math.ceil(player.mana)} / ${Math.round(player.maxMana)}`
  document.querySelector('#playerKda').textContent = `${player.kills} / ${player.deaths}`
  document.querySelector('#playerCs').textContent = String(player.cs)
  document.querySelector('#playerGold').textContent = String(Math.floor(player.gold))
  document.querySelector('#enemyName').textContent = enemy.name
  document.querySelector('#enemyLevel').textContent = String(enemy.level)
  document.querySelector('#enemyHpFill').style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`
  document.querySelector('#enemyManaFill').style.width = `${Math.max(0, enemy.mana / enemy.maxMana) * 100}%`
  document.querySelector('#enemyHpText').textContent = `${Math.ceil(enemy.hp)} / ${Math.round(enemy.maxHp)}`
  document.querySelector('#enemyManaText').textContent = `${Math.ceil(enemy.mana)} / ${Math.round(enemy.maxMana)}`
  document.querySelector('#enemyKda').textContent = `${enemy.kills} / ${enemy.deaths}`
  document.querySelector('#enemyRole').textContent = enemyData.role
  document.querySelector('#matchTimer').textContent = formatTime(state.match.time)
  document.querySelector('#scoreAzure').textContent = String(state.match.score.azure)
  document.querySelector('#scoreCrimson').textContent = String(state.match.score.crimson)
  const enemyTowers = state.match.structures.filter(structure => structure.team === TEAM.CRIMSON && structure.type.startsWith('tower') && structure.alive).length
  const ownTowers = state.match.structures.filter(structure => structure.team === TEAM.AZURE && structure.type.startsWith('tower') && structure.alive).length
  const objective = document.querySelector('#objectiveText')
  if (ownTowers === 0 && enemyTowers === 0) objective.textContent = 'BOTH NEXUSES EXPOSED · END IT'
  else if (enemyTowers === 0) objective.textContent = 'NEXUS EXPOSED · END IT'
  else if (ownTowers === 0) objective.textContent = 'YOUR NEXUS IS EXPOSED · DEFEND'
  else objective.textContent = `DESTROY ${enemyTowers} TOWER${enemyTowers === 1 ? '' : 'S'} TO EXPOSE THE NEXUS`
  objective.style.color = ownTowers === 0 ? '#ff8ea2' : ''
  for (const key of ['q', 'w', 'e', 'r']) {
    const elements = state.abilityElements[key]
    if (!elements) continue
    const ability = data.abilities[key]
    const cooldown = player.cooldowns[key]
    const locked = key === 'r' && player.level < 3
    elements.card.classList.toggle('locked', locked)
    elements.card.classList.toggle('unaffordable', !locked && player.mana < ability.mana)
    elements.card.classList.toggle('ready', !locked && cooldown <= 0 && player.mana >= ability.mana)
    elements.mask.classList.toggle('hidden', !locked && cooldown <= 0)
    elements.mask.textContent = locked ? 'LV 3' : cooldown > 0 ? String(Math.ceil(cooldown)) : ''
    elements.cost.textContent = locked ? '—' : String(ability.mana)
  }
  for (const key of ['d', 'f']) {
    const elements = state.summonerElements[key]
    if (!elements) continue
    const cooldown = player.cooldowns[key]
    elements.mask.classList.toggle('hidden', cooldown <= 0)
    elements.mask.textContent = cooldown > 0 ? String(Math.ceil(cooldown)) : ''
  }
  updateItemSlots()
  if (player.dead && state.mode !== 'ended') {
    state.deathShown = true
    deathOverlay.classList.remove('hidden')
    respawnTimer.textContent = String(Math.max(0, Math.ceil(player.respawnTimer)))
  } else if (state.deathShown) {
    state.deathShown = false
    deathOverlay.classList.add('hidden')
  }
  if (state.mode === 'shop') refreshShop()
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.life -= dt
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.vx *= particle.drag
    particle.vy = particle.vy * particle.drag + particle.gravity * dt
  }
  state.particles = state.particles.filter(particle => particle.life > 0)
  for (const floater of state.floaters) {
    floater.life -= dt
    floater.y -= floater.vy * dt * -1
    floater.y -= 26 * dt
  }
  state.floaters = state.floaters.filter(floater => floater.life > 0)
  state.shake = Math.max(0, state.shake - dt * 16)
}

function ambientParticles(dt) {
  if (state.mode === 'shop' || state.mode === 'paused') return
  const chance = state.mode === 'menu' ? dt * 16 : dt * 22
  if (Math.random() < chance && state.particles.length < 160) {
    const camera = state.camera
    const spreadX = window.innerWidth / camera.zoom
    const spreadY = window.innerHeight / camera.zoom
    const gold = Math.random() < 0.3
    addParticle(camera.x + (Math.random() - 0.5) * spreadX, camera.y + (Math.random() - 0.5) * spreadY, {
      vx: (Math.random() - 0.5) * 18,
      vy: -12 - Math.random() * 28,
      size: 1 + Math.random() * 2.4,
      color: gold ? '#f3ce7c' : Math.random() < 0.5 ? '#6fe8d8' : '#8fd8ff',
      life: 2 + Math.random() * 3,
      glow: true,
      drag: 0.995
    })
  }
}

function updateCamera(dt, snap = false) {
  if (!state.match) return
  const player = state.match.player
  const zoom = baseZoom()
  const targetZoom = zoom
  state.camera.zoom += (targetZoom - state.camera.zoom) * (snap ? 1 : Math.min(1, dt * 4))
  let targetX = player.x
  let targetY = player.y
  const leadX = (state.aim.x - player.x) * 0.045
  const leadY = (state.aim.y - player.y) * 0.045
  targetX += Math.max(-70, Math.min(70, leadX))
  targetY += Math.max(-70, Math.min(70, leadY))
  const halfWidth = window.innerWidth / 2 / state.camera.zoom
  const halfHeight = window.innerHeight / 2 / state.camera.zoom
  const clampAxis = (value, half, size) => {
    if (half * 2 >= size) return size / 2
    return Math.max(half + 40, Math.min(size - half - 40, value))
  }
  targetX = clampAxis(targetX, halfWidth, 3200)
  targetY = clampAxis(targetY, halfHeight, 3200)
  const factor = snap ? 1 : 1 - Math.exp(-dt * 6)
  state.camera.x += (targetX - state.camera.x) * factor
  state.camera.y += (targetY - state.camera.y) * factor
}

function menuCamera(dt) {
  state.animation += dt
  state.camera.zoom += (baseZoom() * 0.96 - state.camera.zoom) * Math.min(1, dt * 3)
  const t = state.animation * 0.055
  state.camera.x = 1600 + Math.sin(t) * 430
  state.camera.y = 1600 + Math.cos(t * 0.83) * 360
}

function screenToWorld(clientX, clientY) {
  const zoom = state.camera.zoom
  return {
    x: state.camera.x + (clientX - window.innerWidth / 2) / zoom,
    y: state.camera.y + (clientY - window.innerHeight / 2) / zoom
  }
}

function updateAim() {
  const world = screenToWorld(state.mouse.x, state.mouse.y)
  state.aim = world
  if (state.mode === 'playing' && state.match) {
    state.input.aimX = world.x
    state.input.aimY = world.y
  }
}

function tick(dt) {
  if (state.mode === 'menu') {
    menuCamera(dt)
    ambientParticles(dt)
    updateParticles(dt)
    return
  }
  if (state.mode === 'playing' && state.match) {
    state.animation += dt
    let moveX = 0
    let moveY = 0
    if (state.keys.has('ArrowUp')) moveY -= 1
    if (state.keys.has('ArrowDown')) moveY += 1
    if (state.keys.has('ArrowLeft')) moveX -= 1
    if (state.keys.has('ArrowRight')) moveX += 1
    if (state.touch) {
      moveX += state.touchMove.x
      moveY += state.touchMove.y
    }
    if (moveX || moveY) state.input.moveTo = null
    state.input.moveX = moveX
    state.input.moveY = moveY
    state.input.attack = state.input.attack || state.keys.has('Space')
    updateAim()
    let remaining = dt
    while (remaining > 0.0001 && state.match.state === 'playing') {
      const stepTime = Math.min(remaining, 0.05)
      updateMatch(state.match, stepTime, state.input)
      state.input.pressed = {}
      remaining -= stepTime
    }
    consumeEvents()
    updateCamera(dt)
    updateParticles(dt)
    ambientParticles(dt)
    updateHud(dt)
    if (state.match.state === 'victory') finishMatch(TEAM.AZURE)
    if (state.match.state === 'defeat') finishMatch(TEAM.CRIMSON)
    return
  }
  if (state.mode === 'ended' && state.match) {
    state.animation += dt
    updateCamera(dt, true)
    updateParticles(dt)
    ambientParticles(dt)
    updateHud(dt)
    return
  }
  if (state.mode === 'paused' || state.mode === 'shop') {
    updateAim()
    updateHud(dt)
    if (state.mode === 'shop') refreshShop()
  }
}

let lastFrame = performance.now()
function frame(now) {
  const dt = Math.min(0.4, Math.max(0, (now - lastFrame) / 1000))
  lastFrame = now
  tick(dt)
  const sceneMatch = state.mode === 'menu' ? preview : state.match
  const sceneTime = state.mode === 'menu' ? state.animation : state.match ? state.match.time : state.animation
  renderer.render({
    match: sceneMatch,
    menu: state.mode === 'menu',
    camera: state.camera,
    time: sceneTime,
    particles: state.particles,
    floaters: state.floaters,
    shake: state.shake
  })
  requestAnimationFrame(frame)
}

window.addEventListener('resize', () => {
  renderer.resize()
})

window.addEventListener('pointermove', event => {
  state.mouse.x = event.clientX
  state.mouse.y = event.clientY
})

canvas.addEventListener('pointerdown', event => {
  if (state.mode !== 'playing') return
  if (event.button === 0) {
    state.mouse.x = event.clientX
    state.mouse.y = event.clientY
    state.input.attack = true
  }
  if (event.button === 2) {
    const world = screenToWorld(event.clientX, event.clientY)
    state.input.moveTo = { x: world.x, y: world.y }
  }
})

window.addEventListener('pointerup', event => {
  if (event.button === 0) state.input.attack = false
})

canvas.addEventListener('contextmenu', event => event.preventDefault())

window.addEventListener('keydown', event => {
  if (event.repeat) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault()
    return
  }
  if (state.mode === 'menu') {
    if (event.code === 'Enter') startGame()
    return
  }
  if (state.mode === 'shop') {
    if (event.code === 'KeyB' || event.code === 'Escape') {
      event.preventDefault()
      closeShop()
      return
    }
    const number = Number(event.key)
    if (number >= 1 && number <= ITEMS.length) {
      event.preventDefault()
      purchase(ITEMS[number - 1].id)
      return
    }
  }
  if (state.mode === 'paused') {
    if (event.code === 'Escape' || event.code === 'KeyP') {
      event.preventDefault()
      closePause()
    }
    return
  }
  if (event.code === 'KeyB') {
    event.preventDefault()
    if (state.mode === 'playing') openShop()
    return
  }
  if (event.code === 'KeyP' || event.code === 'Escape') {
    event.preventDefault()
    if (state.mode === 'playing') openPause()
    return
  }
  if (event.code === 'KeyM') {
    event.preventDefault()
    toggleSound()
    return
  }
  if (state.mode !== 'playing') return
  const keyMap = { KeyQ: 'q', KeyW: 'w', KeyE: 'e', KeyR: 'r', KeyD: 'd', KeyF: 'f' }
  if (keyMap[event.code]) {
    event.preventDefault()
    state.keys.add(event.code)
    queueAbilityOrSummoner(keyMap[event.code])
    return
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
    state.keys.add(event.code)
    state.input.moveTo = null
    event.preventDefault()
  }
  if (event.code === 'Space') {
    state.keys.add(event.code)
    event.preventDefault()
  }
})

window.addEventListener('keyup', event => {
  state.keys.delete(event.code)
  if (event.code === 'Space') state.input.attack = false
})

function queueAbilityOrSummoner(key) {
  if (!state.match) return
  if (key === 'd' || key === 'f') queueSummoner(key)
  else queueAbility(key)
}

window.addEventListener('blur', () => {
  state.keys.clear()
  state.input.attack = false
  state.goal = null
  if (state.mode === 'playing') openPause()
})

playButton.addEventListener('click', startGame)
shopButton.addEventListener('click', openShop)
pauseButton.addEventListener('click', openPause)
shopClose.addEventListener('click', closeShop)
document.querySelector('#resumeButton').addEventListener('click', closePause)
document.querySelector('#restartButton').addEventListener('click', () => {
  closePause()
  startGame()
})
document.querySelector('#quitButton').addEventListener('click', returnToMenu)
document.querySelector('#playAgainButton').addEventListener('click', startGame)
document.querySelector('#menuButton').addEventListener('click', returnToMenu)
document.querySelector('#muteButton').addEventListener('click', toggleSound)

function toggleSound() {
  state.sound.setEnabled(!state.sound.enabled)
  const button = document.querySelector('#muteButton')
  button.textContent = state.sound.enabled ? 'Sound' : 'Muted'
  button.setAttribute('aria-pressed', String(!state.sound.enabled))
  if (state.sound.enabled) state.sound.play('select')
}

if (state.touch) {
  const touchAttack = document.querySelector('#touchAttack')
  touchAttack.addEventListener('pointerdown', event => {
    event.preventDefault()
    if (state.mode !== 'playing') return
    const target = touchTarget()
    state.input.aimX = target.x
    state.input.aimY = target.y
    state.input.attack = true
  })
  touchAttack.addEventListener('pointerup', () => { state.input.attack = false })
  document.querySelector('#touchQ').addEventListener('pointerdown', event => { event.preventDefault(); queueAbility('q') })
  document.querySelector('#touchW').addEventListener('pointerdown', event => { event.preventDefault(); queueAbility('w') })
  document.querySelector('#touchE').addEventListener('pointerdown', event => { event.preventDefault(); queueAbility('e') })
  document.querySelector('#touchR').addEventListener('pointerdown', event => { event.preventDefault(); queueAbility('r') })
  joystick.addEventListener('pointerdown', event => {
    event.preventDefault()
    state.joystickPointer = event.pointerId
    joystick.setPointerCapture(event.pointerId)
    updateJoystick(event)
  })
  joystick.addEventListener('pointermove', event => {
    if (state.joystickPointer !== event.pointerId) return
    event.preventDefault()
    updateJoystick(event)
  })
  joystick.addEventListener('pointerup', event => {
    if (state.joystickPointer !== event.pointerId) return
    state.joystickPointer = null
    state.touchMove = { x: 0, y: 0 }
    joystickKnob.style.transform = 'translate(0px, 0px)'
  })
  joystick.addEventListener('pointercancel', () => {
    state.joystickPointer = null
    state.touchMove = { x: 0, y: 0 }
    joystickKnob.style.transform = 'translate(0px, 0px)'
  })
}

function updateJoystick(event) {
  const rect = joystick.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  let dx = event.clientX - centerX
  let dy = event.clientY - centerY
  const max = 46
  const length = Math.hypot(dx, dy)
  if (length > max) {
    dx = dx / length * max
    dy = dy / length * max
  }
  state.touchMove = { x: dx / max, y: dy / max }
  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`
}

buildChampionCards()
state.camera.zoom = baseZoom()
window.__legendsArena = state
window.__legendsArena.renderer = renderer
window.__legendsArena.sim = { updateMatch, dealDamage, getStructure }
requestAnimationFrame(frame)
