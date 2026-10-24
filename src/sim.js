export const MAP_SIZE = 3200
export const MAX_LEVEL = 12

export const TEAM = Object.freeze({ AZURE: 'azure', CRIMSON: 'crimson' })

export const TEAM_COLORS = Object.freeze({
  azure: { primary: '#52d9ff', secondary: '#1b7fd6', glow: '#8ef0ff', dark: '#0d3b54' },
  crimson: { primary: '#ff5d7d', secondary: '#b8244c', glow: '#ff9bb0', dark: '#4d1022' }
})

export const LANE = Object.freeze([
  { x: 420, y: 2780 },
  { x: 820, y: 2380 },
  { x: 1240, y: 1960 },
  { x: 1600, y: 1600 },
  { x: 1960, y: 1240 },
  { x: 2380, y: 820 },
  { x: 2780, y: 420 }
])

export const STRUCTURE_SITES = Object.freeze([
  { team: 'azure', type: 'nexus', x: 420, y: 2780 },
  { team: 'azure', type: 'tower-inner', x: 820, y: 2380 },
  { team: 'azure', type: 'tower-outer', x: 1200, y: 2000 },
  { team: 'crimson', type: 'tower-outer', x: 2000, y: 1200 },
  { team: 'crimson', type: 'tower-inner', x: 2380, y: 820 },
  { team: 'crimson', type: 'nexus', x: 2780, y: 420 }
])

export const SUMMONERS = Object.freeze({
  d: { name: 'Renew', icon: 'heal', cooldown: 45, color: '#7dffb0', desc: 'Restore health and briefly gain movement speed.' },
  f: { name: 'Flash', icon: 'flash', cooldown: 26, color: '#ffe27a', desc: 'Blink a short distance toward the cursor.' }
})

export const ITEMS = Object.freeze([
  { id: 'dawnblade', name: 'Dawnblade', cost: 450, icon: 'sword', color: '#f3c96b', stats: { ad: 20, hp: 120 }, desc: '+20 Attack Damage<br>+120 Health' },
  { id: 'riftwalkers', name: 'Riftwalkers', cost: 300, icon: 'boots', color: '#8fd7ff', stats: { ms: 55 }, desc: '+55 Move Speed' },
  { id: 'codex', name: 'Arcane Codex', cost: 435, icon: 'tome', color: '#b78bff', stats: { ap: 35, mana: 120 }, desc: '+35 Ability Power<br>+120 Mana' },
  { id: 'belt', name: "Giant's Belt", cost: 900, icon: 'belt', color: '#ff9b6b', stats: { hp: 380 }, desc: '+380 Health' },
  { id: 'scepter', name: 'Blood Scepter', cost: 900, icon: 'scepter', color: '#ff6b86', stats: { ad: 25, lifesteal: 0.12 }, desc: '+25 Attack Damage<br>+12% Lifesteal' },
  { id: 'aegis', name: 'Aegis Plate', cost: 850, icon: 'aegis', color: '#83a8ff', stats: { armor: 35, mr: 25, hp: 120 }, desc: '+35 Armor<br>+25 Magic Resist<br>+120 Health' },
  { id: 'voidrod', name: 'Void Rod', cost: 1250, icon: 'rod', color: '#d28bff', stats: { ap: 75 }, desc: '+75 Ability Power' },
  { id: 'edge', name: 'Infinity Edge', cost: 1500, icon: 'edge', color: '#ffd66b', stats: { ad: 55, crit: 0.25 }, desc: '+55 Attack Damage<br>+25% Critical Strike' },
  { id: 'chrono', name: 'Chrono Prism', cost: 1100, icon: 'hourglass', color: '#7fffe2', stats: { haste: 0.2, ap: 25 }, desc: '+20% Cooldown Reduction<br>+25 Ability Power' }
])

const CHAMPION_DATA = {
  aurelia: {
    id: 'aurelia',
    name: 'Aurelia',
    title: 'Blade of Dawn',
    role: 'Fighter',
    difficulty: 'Medium',
    color: '#ffd36e',
    accent: '#ff8c42',
    cloak: '#d9482f',
    glyph: 'A',
    lore: 'A radiant duelist who carves the rift open one sunrise at a time.',
    stats: {
      hp: 680, hpGrowth: 98, mana: 320, manaGrowth: 34,
      ad: 64, adGrowth: 3.6, ap: 0, armor: 34, armorGrowth: 4.1,
      mr: 32, mrGrowth: 1.6, ms: 352, range: 132, attackSpeed: 0.8,
      attackSpeedGrowth: 0.022, hpRegen: 4.4, manaRegen: 5.2
    },
    abilities: {
      q: { name: 'Dawnstep', icon: 'dash', mana: 40, cooldown: 7, range: 250, color: '#ffd36e', desc: 'Dash forward, cutting every enemy in your path.' },
      w: { name: 'Bulwark', icon: 'shield', mana: 50, cooldown: 13, range: 0, color: '#ffe6a3', desc: 'Raise a solar shield that absorbs damage.' },
      e: { name: 'Sunwheel', icon: 'spin', mana: 55, cooldown: 9, range: 0, color: '#ffb347', desc: 'Spin your blade, damaging and slowing nearby enemies.' },
      r: { name: 'Sunfall', icon: 'meteor', mana: 100, cooldown: 58, range: 900, color: '#ff9b42', desc: 'Call down a sunlit blade that stuns and devastates an area.' }
    }
  },
  kael: {
    id: 'kael',
    name: 'Kael',
    title: 'Rift Marksman',
    role: 'Marksman',
    difficulty: 'Easy',
    color: '#7fe7d7',
    accent: '#37b6c9',
    cloak: '#164a5d',
    glyph: 'K',
    lore: 'A storm-eyed hunter who turns the whole lane into a firing range.',
    stats: {
      hp: 575, hpGrowth: 86, mana: 330, manaGrowth: 38,
      ad: 63, adGrowth: 3.9, ap: 0, armor: 26, armorGrowth: 3.4,
      mr: 30, mrGrowth: 1.4, ms: 342, range: 520, attackSpeed: 0.88,
      attackSpeedGrowth: 0.026, hpRegen: 3.4, manaRegen: 6
    },
    abilities: {
      q: { name: 'Piercing Shot', icon: 'bolt', mana: 45, cooldown: 6, range: 950, color: '#7fe7d7', desc: 'Fire a razor bolt that impales the first target.' },
      w: { name: 'Snare Rune', icon: 'trap', mana: 55, cooldown: 14, range: 700, color: '#7fd4ff', desc: 'Place a rune that roots the first enemy to cross it.' },
      e: { name: 'Tumble', icon: 'dash', mana: 40, cooldown: 8, range: 200, color: '#a5ffe8', desc: 'Roll through danger and gain a burst of speed.' },
      r: { name: 'Deadeye', icon: 'beam', mana: 100, cooldown: 55, range: 1400, color: '#b7fff1', desc: 'Charge and unleash a piercing beam across the battlefield.' }
    }
  },
  nyx: {
    id: 'nyx',
    name: 'Nyx',
    title: 'Umbral Oracle',
    role: 'Mage',
    difficulty: 'Hard',
    color: '#c49bff',
    accent: '#7c4dff',
    cloak: '#32165e',
    glyph: 'N',
    lore: 'A veiled seer who folds starlight into merciless shadow magic.',
    stats: {
      hp: 600, hpGrowth: 88, mana: 400, manaGrowth: 44,
      ad: 53, adGrowth: 3.1, ap: 12, armor: 27, armorGrowth: 3.5,
      mr: 34, mrGrowth: 1.8, ms: 340, range: 480, attackSpeed: 0.74,
      attackSpeedGrowth: 0.02, hpRegen: 3.6, manaRegen: 7.2
    },
    abilities: {
      q: { name: 'Void Nova', icon: 'nova', mana: 50, cooldown: 5.5, range: 650, color: '#c49bff', desc: 'Detonate a violet nova at the target location.' },
      w: { name: 'Shadow Chains', icon: 'root', mana: 55, cooldown: 13, range: 900, color: '#9a6bff', desc: 'Hurl chains that root the first enemy struck.' },
      e: { name: 'Phase Veil', icon: 'blink', mana: 45, cooldown: 10, range: 300, color: '#e0c8ff', desc: 'Blink toward the cursor and wrap yourself in a shield.' },
      r: { name: 'Umbral Meteor', icon: 'meteor', mana: 100, cooldown: 60, range: 950, color: '#8f5bff', desc: 'Summon a falling star that crushes and slows an area.' }
    }
  }
}

export const CHAMPIONS = Object.freeze(CHAMPION_DATA)
export const CHAMPION_LIST = Object.freeze(Object.values(CHAMPION_DATA))

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function distance(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay)
}

export function distanceSq(ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  return dx * dx + dy * dy
}

export function normalize(x, y) {
  const length = Math.hypot(x, y)
  return length > 0.0001 ? { x: x / length, y: y / length } : { x: 0, y: 0 }
}

export function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax
  const aby = by - ay
  const lengthSq = abx * abx + aby * aby
  if (lengthSq <= 0.0001) return distance(px, py, ax, ay)
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / lengthSq, 0, 1)
  return distance(px, py, ax + abx * t, ay + aby * t)
}

export function mulberry32(seed) {
  let value = seed >>> 0
  return function random() {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function xpNeeded(level) {
  return level >= MAX_LEVEL ? Infinity : 150 + (level - 1) * 95
}

export function damageAfterMitigation(amount, mitigation) {
  return amount * (100 / (100 + Math.max(0, mitigation)))
}

export function abilityRank(champion) {
  return clamp(1 + Math.floor((champion.level - 1) / 3), 1, 4)
}

export function ultimateRank(champion) {
  return clamp(1 + Math.floor((champion.level - 3) / 3), 1, 3)
}

export function isUltimateUnlocked(champion) {
  return champion.level >= 3
}

export function getStructure(match, team, type) {
  return match.structures.find(structure => structure.team === team && structure.type === type)
}

export function isNexusShielded(match, team) {
  return match.structures.some(structure => structure.team === team && structure.alive && structure.type.startsWith('tower'))
}

export function createMatch(options = {}) {
  const playerChampion = CHAMPIONS[options.playerChampion] ? options.playerChampion : 'aurelia'
  const seed = options.seed ?? ((Date.now() ^ 0x9e3779b9) >>> 0)
  const rng = mulberry32(seed)
  const pool = CHAMPION_LIST.filter(champion => champion.id !== playerChampion)
  const enemyChampion = CHAMPIONS[options.enemyChampion] && options.enemyChampion !== playerChampion
    ? options.enemyChampion
    : pool[Math.floor(rng() * pool.length)].id
  const match = {
    seed,
    rng,
    time: 0,
    state: 'playing',
    winner: null,
    nextId: 1,
    wave: 0,
    waveTimer: 2.5,
    champions: [],
    minions: [],
    structures: [],
    projectiles: [],
    traps: [],
    delayed: [],
    effects: [],
    events: [],
    score: { azure: 0, crimson: 0 },
    firstBlood: false,
    damage: { azure: 0, crimson: 0 },
    announcements: []
  }
  for (const site of STRUCTURE_SITES) {
    match.structures.push(createStructure(match, site))
  }
  match.player = createChampion(match, TEAM.AZURE, playerChampion, 1120, 2080)
  match.enemy = createChampion(match, TEAM.CRIMSON, enemyChampion, 2080, 1120)
  match.champions.push(match.player, match.enemy)
  spawnWave(match, 2)
  match.waveTimer = 19
  addEffect(match, { kind: 'spawn', x: match.player.x, y: match.player.y, radius: 90, team: TEAM.AZURE, ttl: 1.1 })
  addEffect(match, { kind: 'spawn', x: match.enemy.x, y: match.enemy.y, radius: 90, team: TEAM.CRIMSON, ttl: 1.1 })
  announce(match, 'RIFT CLASH', 'Break the enemy nexus', 'neutral')
  return match
}

function createStructure(match, site) {
  const isNexus = site.type === 'nexus'
  const isInner = site.type === 'tower-inner'
  const maxHp = isNexus ? 4600 : isInner ? 3000 : 2600
  return {
    id: match.nextId++,
    kind: 'structure',
    team: site.team,
    type: site.type,
    x: site.x,
    y: site.y,
    radius: isNexus ? 96 : 48,
    hp: maxHp,
    maxHp,
    armor: isNexus ? 55 : 40,
    mr: isNexus ? 55 : 40,
    range: isNexus ? 700 : isInner ? 580 : 540,
    damage: isNexus ? 170 : isInner ? 160 : 145,
    attackSpeed: 0.85,
    attackTimer: 0,
    alive: true,
    targetId: null,
    heat: 0,
    pulse: Math.random() * Math.PI * 2
  }
}

function createChampion(match, team, championId, x, y) {
  const data = CHAMPIONS[championId]
  const champion = {
    id: match.nextId++,
    kind: 'champion',
    team,
    championId,
    name: data.name,
    x,
    y,
    radius: 26,
    level: 1,
    xp: 0,
    xpToNext: xpNeeded(1),
    gold: 500,
    items: [],
    kills: 0,
    deaths: 0,
    cs: 0,
    cooldowns: { q: 0, w: 0, e: 0, r: 0, d: 0, f: 0 },
    summoners: { d: 0, f: 0 },
    attackTimer: 0,
    facing: team === TEAM.AZURE ? -Math.PI * 0.25 : Math.PI * 0.75,
    moveX: 0,
    moveY: 0,
    bob: Math.random() * Math.PI * 2,
    dead: false,
    respawnTimer: 0,
    shield: 0,
    shieldTime: 0,
    slow: 0,
    slowTime: 0,
    root: 0,
    stun: 0,
    haste: 0,
    hasteTime: 0,
    invulnerable: 0,
    lastDamagedBy: null,
    damageDealt: 0,
    damageTaken: 0,
    aiThink: 0,
    aiTargetId: null,
    recall: 0
  }
  recalculateChampion(champion)
  champion.hp = champion.maxHp
  champion.mana = champion.maxMana
  return champion
}

export function recalculateChampion(champion) {
  const base = CHAMPIONS[champion.championId].stats
  const level = champion.level - 1
  const bonus = { hp: 0, mana: 0, ad: 0, ap: 0, armor: 0, mr: 0, ms: 0, lifesteal: 0, crit: 0, haste: 0, attackSpeed: 0 }
  for (const owned of champion.items) {
    const item = ITEMS.find(candidate => candidate.id === owned)
    if (!item) continue
    for (const [key, value] of Object.entries(item.stats)) bonus[key] += value
  }
  champion.maxHp = Math.round(base.hp + base.hpGrowth * level + bonus.hp)
  champion.maxMana = Math.round(base.mana + base.manaGrowth * level + bonus.mana)
  champion.ad = base.ad + base.adGrowth * level + bonus.ad
  champion.ap = base.ap + bonus.ap
  champion.armor = base.armor + base.armorGrowth * level + bonus.armor
  champion.mr = base.mr + base.mrGrowth * level + bonus.mr
  champion.ms = base.ms + bonus.ms
  champion.range = base.range
  champion.attackSpeed = base.attackSpeed + base.attackSpeedGrowth * level + bonus.attackSpeed
  champion.lifesteal = bonus.lifesteal
  champion.crit = bonus.crit
  champion.haste = Math.min(0.4, bonus.haste)
  champion.hpRegen = base.hpRegen + level * 0.85
  champion.manaRegen = base.manaRegen + level * 0.7
  champion.hp = Math.min(champion.hp, champion.maxHp)
  champion.mana = Math.min(champion.mana, champion.maxMana)
  return champion
}

export function grantXp(match, champion, amount) {
  if (!champion || champion.dead || champion.level >= MAX_LEVEL) return
  champion.xp += amount
  while (champion.level < MAX_LEVEL && champion.xp >= champion.xpToNext) {
    champion.xp -= champion.xpToNext
    champion.level += 1
    const oldMaxHp = champion.maxHp
    const oldMaxMana = champion.maxMana
    recalculateChampion(champion)
    champion.hp += champion.maxHp - oldMaxHp
    champion.mana += champion.maxMana - oldMaxMana
    champion.xpToNext = xpNeeded(champion.level)
    addEffect(match, { kind: 'levelup', x: champion.x, y: champion.y, radius: 60, team: champion.team, ttl: 1.1, color: CHAMPIONS[champion.championId].color })
    match.events.push({ type: 'levelup', team: champion.team, champion: champion.championId, level: champion.level })
  }
  if (champion.level >= MAX_LEVEL) champion.xp = 0
}

export function buyItem(match, champion, itemId) {
  const item = ITEMS.find(candidate => candidate.id === itemId)
  if (!item || champion.dead || match.state !== 'playing') return false
  if (champion.items.length >= 6) {
    announce(match, 'INVENTORY FULL', 'Sell or combine an item', 'warning')
    return false
  }
  if (champion.gold < item.cost) {
    match.events.push({ type: 'reject', reason: 'gold', champion: champion.team })
    return false
  }
  champion.gold -= item.cost
  champion.items.push(item.id)
  const oldMaxHp = champion.maxHp
  const oldMaxMana = champion.maxMana
  recalculateChampion(champion)
  champion.hp += champion.maxHp - oldMaxHp
  champion.mana += champion.maxMana - oldMaxMana
  match.events.push({ type: 'buy', team: champion.team, item: item.id, name: item.name })
  return true
}

export function addEffect(match, effect) {
  match.effects.push({
    maxTtl: effect.ttl ?? 0.6,
    ttl: effect.ttl ?? 0.6,
    color: effect.color || TEAM_COLORS[effect.team]?.primary || '#8ef0ff',
    ...effect
  })
}

function announce(match, text, subtitle = '', tone = 'neutral') {
  match.announcements.push({ text, subtitle, tone, time: match.time })
  match.events.push({ type: 'announce', text, subtitle, tone })
}

function teamOf(team) {
  return team === TEAM.AZURE ? TEAM.CRIMSON : TEAM.AZURE
}

function aliveTarget(entity) {
  if (!entity) return false
  if (entity.kind === 'champion') return !entity.dead
  if (entity.kind === 'minion') return entity.alive
  if (entity.kind === 'structure') return entity.alive
  return false
}

export function findNearestEnemy(match, source, options = {}) {
  const enemyTeam = teamOf(source.team)
  const maxDistance = options.maxDistance ?? Infinity
  const includeMinions = options.includeMinions !== false
  const includeStructures = options.includeStructures !== false
  const includeChampions = options.includeChampions !== false
  let best = null
  let bestDistance = maxDistance
  const consider = entity => {
    if (entity.team !== enemyTeam || !aliveTarget(entity)) return
    const current = distance(source.x, source.y, entity.x, entity.y)
    if (current < bestDistance) {
      best = entity
      bestDistance = current
    }
  }
  if (includeChampions) for (const champion of match.champions) consider(champion)
  if (includeMinions) for (const minion of match.minions) consider(minion)
  if (includeStructures) for (const structure of match.structures) consider(structure)
  if (best && options.angle !== undefined && options.angle !== null) {
    const candidates = []
    const push = entity => {
      if (entity.team !== enemyTeam || !aliveTarget(entity)) return
      const current = distance(source.x, source.y, entity.x, entity.y)
      if (current <= maxDistance) candidates.push({ entity, current })
    }
    if (includeChampions) match.champions.forEach(push)
    if (includeMinions) match.minions.forEach(push)
    if (includeStructures) match.structures.forEach(push)
    const aligned = candidates.filter(candidate => {
      const angle = Math.atan2(candidate.entity.y - source.y, candidate.entity.x - source.x)
      let delta = Math.abs(angle - options.angle)
      delta = Math.min(delta, Math.PI * 2 - delta)
      return delta < (options.cone ?? 0.9)
    })
    if (aligned.length) {
      aligned.sort((a, b) => a.current - b.current)
      best = aligned[0].entity
    }
  }
  return best
}

function applySpeedModifiers(champion) {
  if (champion.root > 0 || champion.stun > 0) return 0
  if (champion.slowTime > 0) return champion.ms * (1 - champion.slow)
  return champion.ms
}

function moveUnit(unit, dx, dy, amount) {
  const normal = normalize(dx, dy)
  unit.x = clamp(unit.x + normal.x * amount, 110, MAP_SIZE - 110)
  unit.y = clamp(unit.y + normal.y * amount, 110, MAP_SIZE - 110)
  if (Math.abs(normal.x) + Math.abs(normal.y) > 0.01) unit.facing = Math.atan2(normal.y, normal.x)
}

function resolveStructureCollisions(unit) {
  for (const structure of unit.kind === 'champion' ? [] : []) void structure
}

function pushOutOfStructures(match, unit) {
  for (const structure of match.structures) {
    if (!structure.alive) continue
    const minimum = structure.radius + unit.radius * 0.75
    const current = distance(unit.x, unit.y, structure.x, structure.y)
    if (current < minimum && current > 0.001) {
      const nx = (unit.x - structure.x) / current
      const ny = (unit.y - structure.y) / current
      unit.x = structure.x + nx * minimum
      unit.y = structure.y + ny * minimum
    }
  }
}

function clampAim(champion, x, y, range) {
  if (x === undefined || y === undefined || Number.isNaN(x) || Number.isNaN(y)) {
    return { x: champion.x + Math.cos(champion.facing) * 200, y: champion.y + Math.sin(champion.facing) * 200 }
  }
  const dx = x - champion.x
  const dy = y - champion.y
  const current = Math.hypot(dx, dy)
  if (range <= 0 || current <= range) return { x, y }
  return { x: champion.x + (dx / current) * range, y: champion.y + (dy / current) * range }
}

function stagger(champion, key) {
  return 1 - Math.min(0.45, (champion.level - 1) * 0.035) - champion.haste
}

function abilityPowerFor(champion, key) {
  const ability = CHAMPIONS[champion.championId].abilities[key]
  if (key === 'r') {
    const base = ability.cooldown * stagger(champion, key)
    return base
  }
  return ability.cooldown * stagger(champion, key)
}

export function castAbility(match, champion, key, aimX, aimY) {
  if (!champion || match.state !== 'playing' || champion.dead) return false
  const data = CHAMPIONS[champion.championId]
  const ability = data.abilities[key]
  if (!ability) return false
  if (key === 'r' && !isUltimateUnlocked(champion)) {
    match.events.push({ type: 'locked', key, champion: champion.team })
    return false
  }
  if (champion.stun > 0) return false
  if (champion.cooldowns[key] > 0) return false
  if (champion.mana < ability.mana) {
    match.events.push({ type: 'oom', key, champion: champion.team })
    return false
  }
  champion.mana -= ability.mana
  champion.cooldowns[key] = Math.max(2, ability.cooldown * stagger(champion, key))
  const aim = clampAim(champion, aimX, aimY, ability.range)
  champion.facing = Math.atan2(aim.y - champion.y, aim.x - champion.x)
  match.events.push({ type: 'cast', team: champion.team, champion: champion.championId, key, name: ability.name })
  executeAbility(match, champion, key, aim.x, aim.y)
  return true
}

function executeAbility(match, champion, key, aimX, aimY) {
  const rank = key === 'r' ? ultimateRank(champion) : abilityRank(champion)
  const data = CHAMPIONS[champion.championId]
  const color = data.abilities[key].color
  if (champion.championId === 'aurelia') {
    if (key === 'q') {
      const angle = Math.atan2(aimY - champion.y, aimX - champion.x)
      const dx = Math.cos(angle)
      const dy = Math.sin(angle)
      const startX = champion.x
      const startY = champion.y
      const travel = 245 + rank * 12
      champion.x = clamp(champion.x + dx * travel, 120, MAP_SIZE - 120)
      champion.y = clamp(champion.y + dy * travel, 120, MAP_SIZE - 120)
      pushOutOfStructures(match, champion)
      const damage = 52 + rank * 34 + champion.ad * 0.72
      for (const target of hostileUnits(match, champion)) {
        if (pointSegmentDistance(target.x, target.y, startX, startY, champion.x, champion.y) <= target.radius + 42) {
          dealDamage(match, champion, target, damage, 'physical', { ability: 'Dawnstep' })
        }
      }
      addEffect(match, { kind: 'dash', x: startX, y: startY, x2: champion.x, y2: champion.y, width: 30, color, ttl: 0.4 })
      match.events.push({ type: 'shake', amount: 3 })
      return
    }
    if (key === 'w') {
      const shield = 95 + rank * 42 + champion.ap * 0.35 + champion.level * 8
      champion.shield += shield
      champion.shieldTime = Math.max(champion.shieldTime, 3.6)
      addEffect(match, { kind: 'shield', x: champion.x, y: champion.y, radius: 70, color, ttl: 0.7 })
      return
    }
    if (key === 'e') {
      const radius = 172
      const damage = 55 + rank * 31 + champion.ad * 0.62
      for (const target of hostileUnits(match, champion)) {
        if (distance(champion.x, champion.y, target.x, target.y) <= radius + target.radius) {
          dealDamage(match, champion, target, damage, 'physical', { ability: 'Sunwheel' })
          if (target.kind === 'champion') {
            target.slow = Math.max(target.slow, 0.35)
            target.slowTime = Math.max(target.slowTime, 1.6)
          }
        }
      }
      addEffect(match, { kind: 'aoe', x: champion.x, y: champion.y, radius, color, ttl: 0.55, width: 22 })
      addEffect(match, { kind: 'spin', x: champion.x, y: champion.y, radius, color, ttl: 0.42 })
      match.events.push({ type: 'shake', amount: 3 })
      return
    }
    if (key === 'r') {
      queueDelayed(match, {
        kind: 'meteor',
        source: champion,
        x: aimX,
        y: aimY,
        radius: 235,
        delay: 0.62,
        color,
        damage: 185 + rank * 95 + champion.ad * 1.05 + champion.ap * 0.35,
        damageType: 'physical',
        stun: 0.85,
        label: 'Sunfall'
      })
      addEffect(match, { kind: 'target', x: aimX, y: aimY, radius: 235, color, ttl: 0.62 })
      return
    }
  }
  if (champion.championId === 'kael') {
    if (key === 'q') {
      const angle = Math.atan2(aimY - champion.y, aimX - champion.x)
      spawnProjectile(match, champion, {
        x: champion.x,
        y: champion.y,
        vx: Math.cos(angle) * 1280,
        vy: Math.sin(angle) * 1280,
        radius: 15,
        range: 980,
        damage: 68 + rank * 43 + champion.ad * 0.92,
        damageType: 'physical',
        kind: 'bolt',
        color
      })
      return
    }
    if (key === 'w') {
      match.traps.push({
        id: match.nextId++,
        team: champion.team,
        sourceId: champion.id,
        x: aimX,
        y: aimY,
        radius: 72,
        ttl: 14,
        arm: 0.35,
        triggered: false,
        damage: 30 + rank * 18 + champion.ap * 0.2,
        color
      })
      addEffect(match, { kind: 'rune', x: aimX, y: aimY, radius: 72, color, ttl: 0.6 })
      return
    }
    if (key === 'e') {
      const startX = champion.x
      const startY = champion.y
      const angle = Math.atan2(aimY - champion.y, aimX - champion.x)
      champion.x = clamp(champion.x + Math.cos(angle) * 205, 120, MAP_SIZE - 120)
      champion.y = clamp(champion.y + Math.sin(angle) * 205, 120, MAP_SIZE - 120)
      pushOutOfStructures(match, champion)
      champion.haste = Math.max(champion.haste, 0)
      champion.hasteTime = Math.max(champion.hasteTime, 1.8)
      champion.bonusSpeed = 0.28
      champion.bonusSpeedTime = 1.8
      addEffect(match, { kind: 'dash', x: startX, y: startY, x2: champion.x, y2: champion.y, width: 20, color, ttl: 0.4 })
      return
    }
    if (key === 'r') {
      const angle = Math.atan2(aimY - champion.y, aimX - champion.x)
      const length = 1400
      queueDelayed(match, {
        kind: 'beam',
        source: champion,
        x: champion.x,
        y: champion.y,
        x2: champion.x + Math.cos(angle) * length,
        y2: champion.y + Math.sin(angle) * length,
        radius: 76,
        delay: 0.38,
        color,
        damage: 215 + rank * 115 + champion.ad * 1.2,
        damageType: 'physical',
        label: 'Deadeye'
      })
      addEffect(match, { kind: 'beamCharge', x: champion.x, y: champion.y, angle, length, width: 76, color, ttl: 0.38 })
      return
    }
  }
  if (champion.championId === 'nyx') {
    if (key === 'q') {
      const radius = 128
      const damage = 62 + rank * 38 + champion.ap * 0.78
      for (const target of hostileUnits(match, champion)) {
        if (distance(aimX, aimY, target.x, target.y) <= radius + target.radius) {
          dealDamage(match, champion, target, damage, 'magic', { ability: 'Void Nova' })
        }
      }
      addEffect(match, { kind: 'blast', x: aimX, y: aimY, radius, color, ttl: 0.5 })
      match.events.push({ type: 'shake', amount: 2 })
      return
    }
    if (key === 'w') {
      const angle = Math.atan2(aimY - champion.y, aimX - champion.x)
      spawnProjectile(match, champion, {
        x: champion.x,
        y: champion.y,
        vx: Math.cos(angle) * 960,
        vy: Math.sin(angle) * 960,
        radius: 16,
        range: 940,
        damage: 46 + rank * 27 + champion.ap * 0.5,
        damageType: 'magic',
        kind: 'chains',
        color,
        root: 1.65
      })
      return
    }
    if (key === 'e') {
      const startX = champion.x
      const startY = champion.y
      champion.x = clamp(aimX, 120, MAP_SIZE - 120)
      champion.y = clamp(aimY, 120, MAP_SIZE - 120)
      pushOutOfStructures(match, champion)
      const shield = 60 + rank * 34 + champion.ap * 0.28
      champion.shield += shield
      champion.shieldTime = Math.max(champion.shieldTime, 3)
      addEffect(match, { kind: 'blink', x: startX, y: startY, x2: champion.x, y2: champion.y, color, ttl: 0.55 })
      addEffect(match, { kind: 'shield', x: champion.x, y: champion.y, radius: 60, color, ttl: 0.55 })
      return
    }
    if (key === 'r') {
      queueDelayed(match, {
        kind: 'meteor',
        source: champion,
        x: aimX,
        y: aimY,
        radius: 245,
        delay: 0.95,
        color,
        damage: 195 + rank * 100 + champion.ap * 1.02,
        damageType: 'magic',
        slow: 0.5,
        slowTime: 2.2,
        label: 'Umbral Meteor'
      })
      addEffect(match, { kind: 'target', x: aimX, y: aimY, radius: 245, color, ttl: 0.95 })
      return
    }
  }
}

export function castSummoner(match, champion, key, aimX, aimY) {
  if (!champion || champion.dead || match.state !== 'playing') return false
  const spell = SUMMONERS[key]
  if (!spell || champion.cooldowns[key] > 0 || champion.stun > 0) return false
  champion.cooldowns[key] = spell.cooldown
  if (key === 'd') {
    const heal = 120 + champion.level * 26
    champion.hp = Math.min(champion.maxHp, champion.hp + heal)
    champion.bonusSpeed = Math.max(champion.bonusSpeed || 0, 0.3)
    champion.bonusSpeedTime = 1.4
    addEffect(match, { kind: 'heal', x: champion.x, y: champion.y, radius: 78, color: spell.color, ttl: 0.8 })
    match.events.push({ type: 'summoner', team: champion.team, key, name: spell.name })
    return true
  }
  if (key === 'f') {
    const aim = clampAim(champion, aimX, aimY, 420)
    const oldX = champion.x
    const oldY = champion.y
    champion.x = clamp(aim.x, 120, MAP_SIZE - 120)
    champion.y = clamp(aim.y, 120, MAP_SIZE - 120)
    pushOutOfStructures(match, champion)
    addEffect(match, { kind: 'blink', x: oldX, y: oldY, x2: champion.x, y2: champion.y, color: spell.color, ttl: 0.5 })
    match.events.push({ type: 'summoner', team: champion.team, key, name: spell.name })
    return true
  }
  return false
}

function hostileUnits(match, source) {
  const enemyTeam = teamOf(source.team)
  const units = []
  for (const champion of match.champions) if (champion.team === enemyTeam && !champion.dead) units.push(champion)
  for (const minion of match.minions) if (minion.team === enemyTeam && minion.alive) units.push(minion)
  for (const structure of match.structures) if (structure.team === enemyTeam && structure.alive) units.push(structure)
  return units
}

function spawnProjectile(match, source, details) {
  match.projectiles.push({
    id: match.nextId++,
    kind: details.kind || 'auto',
    team: source.team,
    sourceId: source.id,
    sourceKind: source.kind,
    x: details.x,
    y: details.y,
    vx: details.vx,
    vy: details.vy,
    radius: details.radius || 10,
    range: details.range || 700,
    traveled: 0,
    damage: details.damage,
    damageType: details.damageType || 'physical',
    color: details.color || TEAM_COLORS[source.team].primary,
    homing: details.homing || null,
    root: details.root || 0,
    slow: details.slow || 0,
    slowTime: details.slowTime || 0,
    pierce: details.pierce || false,
    hit: [],
    ttl: details.ttl || 3
  })
  match.events.push({ type: 'projectile', kind: details.kind || 'auto', team: source.team })
}

export function basicAttack(match, champion, target) {
  if (!champion || champion.dead || match.state !== 'playing' || !aliveTarget(target)) return false
  if (champion.attackTimer > 0 || champion.stun > 0) return false
  const reach = champion.range + target.radius
  if (distance(champion.x, champion.y, target.x, target.y) > reach) return false
  champion.attackTimer = 1 / Math.max(0.35, champion.attackSpeed)
  champion.facing = Math.atan2(target.y - champion.y, target.x - champion.x)
  const crit = match.rng() < champion.crit
  const damage = champion.ad * (crit ? 1.75 : 1)
  if (champion.range > 200) {
    const angle = Math.atan2(target.y - champion.y, target.x - champion.x)
    spawnProjectile(match, champion, {
      x: champion.x + Math.cos(angle) * 20,
      y: champion.y + Math.sin(angle) * 20,
      vx: Math.cos(angle) * 1180,
      vy: Math.sin(angle) * 1180,
      radius: 9,
      range: champion.range + 130,
      damage,
      damageType: 'physical',
      kind: 'auto',
      color: CHAMPIONS[champion.championId].color,
      homing: target.id
    })
  } else {
    dealDamage(match, champion, target, damage, 'physical', { basic: true, crit })
    addEffect(match, {
      kind: 'slash',
      x: champion.x,
      y: champion.y,
      angle: champion.facing,
      radius: 66,
      color: CHAMPIONS[champion.championId].color,
      ttl: 0.28,
      crit
    })
  }
  match.events.push({ type: 'attack', team: champion.team })
  return true
}

export function dealDamage(match, source, target, amount, damageType = 'physical', options = {}) {
  if (!aliveTarget(target) || amount <= 0) return 0
  if (target.kind === 'structure' && target.type === 'nexus' && isNexusShielded(match, target.team)) {
    match.events.push({ type: 'shielded', x: target.x, y: target.y, team: target.team })
    return 0
  }
  let mitigation = target.armor ?? 0
  if (damageType === 'magic') mitigation = target.mr ?? 0
  if (damageType === 'true') mitigation = 0
  if (target.kind === 'structure') mitigation = target.armor
  let final = damageAfterMitigation(amount, mitigation)
  if (options.crit) final *= 1
  if (target.kind === 'champion' && target.shield > 0) {
    const absorbed = Math.min(target.shield, final)
    target.shield -= absorbed
    final -= absorbed
    if (absorbed > 0) {
      addEffect(match, { kind: 'shieldHit', x: target.x, y: target.y, radius: 54, color: '#ffe6a3', ttl: 0.3 })
    }
    if (target.shield <= 0) target.shield = 0
  }
  target.hp -= final
  target.invulnerable = 0
  if (source && source.kind === 'champion') {
    source.lastDamagedBy = source.lastDamagedBy
    source.damageDealt += final
    if (source.lifesteal > 0 && final > 0) {
      source.hp = Math.min(source.maxHp, source.hp + final * source.lifesteal)
    }
  }
  if (target.kind === 'champion') {
    target.damageTaken += final
    target.lastDamagedBy = source?.id ?? null
    match.damage[source?.team || teamOf(target.team)] += final
  }
  match.events.push({
    type: 'hit',
    x: target.x,
    y: target.y - (target.kind === 'structure' ? 70 : 20),
    amount: Math.round(final),
    damageType,
    crit: Boolean(options.crit),
    sourceTeam: source?.team || null,
    targetTeam: target.team,
    targetKind: target.kind,
    ability: options.ability || '',
    basic: Boolean(options.basic)
  })
  if (target.kind === 'champion' && (options.root || options.slow || options.stun)) {
    if (options.root) target.root = Math.max(target.root, options.root)
    if (options.slow) {
      target.slow = Math.max(target.slow, options.slow)
      target.slowTime = Math.max(target.slowTime, options.slowTime || 1.5)
    }
    if (options.stun) target.stun = Math.max(target.stun, options.stun)
  }
  if (target.hp <= 0) {
    target.hp = 0
    killEntity(match, source, target)
  }
  return final
}

function killEntity(match, source, target) {
  if (target.kind === 'structure') {
    target.alive = false
    target.hp = 0
    target.heat = 0
    target.targetId = null
    addEffect(match, { kind: 'destroy', x: target.x, y: target.y, radius: target.radius * 2.2, team: target.team, ttl: 1.4 })
    const killerTeam = source?.team || teamOf(target.team)
    if (source?.kind === 'champion' && source.team !== target.team) {
      source.gold += target.type === 'nexus' ? 300 : 175
      grantXp(match, source, target.type === 'nexus' ? 300 : 150)
    }
    if (target.type === 'nexus') {
      match.state = killerTeam === TEAM.AZURE ? 'victory' : 'defeat'
      match.winner = killerTeam
      announce(match, match.state === 'victory' ? 'VICTORY' : 'DEFEAT', match.state === 'victory' ? 'The enemy nexus has fallen' : 'Your nexus has fallen', match.state === 'victory' ? 'gold' : 'danger')
      match.events.push({ type: 'gameover', winner: killerTeam })
      return
    }
    match.events.push({ type: 'structureDown', team: target.team, structure: target.type, x: target.x, y: target.y })
    if (isNexusShielded(match, target.team)) {
      announce(match, `${target.team === TEAM.CRIMSON ? 'ENEMY' : 'ALLIED'} TOWER DESTROYED`, 'The enemy nexus still holds', killerTeam === TEAM.AZURE ? 'gold' : 'danger')
    } else {
      announce(match, 'NEXUS EXPOSED', `${target.team === TEAM.CRIMSON ? 'Enemy' : 'Your'} nexus shield is down`, killerTeam === TEAM.AZURE ? 'gold' : 'danger')
    }
    return
  }
  if (target.kind === 'minion') {
    target.alive = false
    target.hp = 0
    const enemyTeam = target.team === TEAM.AZURE ? TEAM.CRIMSON : TEAM.AZURE
    for (const champion of match.champions) {
      if (champion.team !== enemyTeam || champion.dead) continue
      const proximity = distance(champion.x, champion.y, target.x, target.y)
      if (proximity < 950) {
        grantXp(match, champion, target.xp)
        const killer = source?.id === champion.id
        champion.gold += killer ? target.gold : Math.round(target.gold * 0.35)
        champion.cs += killer ? 1 : 0
      }
    }
    if (source?.kind === 'champion') {
      match.events.push({ type: 'lastHit', team: source.team, x: target.x, y: target.y })
    }
    addEffect(match, { kind: 'deathSmall', x: target.x, y: target.y, radius: target.radius * 2.4, team: target.team, ttl: 0.55 })
    return
  }
  if (target.kind === 'champion') {
    const killer = source?.kind === 'champion' ? source : null
    target.dead = true
    target.hp = 0
    target.shield = 0
    target.respawnTimer = 6.5 + target.level * 0.7
    target.deaths += 1
    target.buffsCleared = true
    const killerTeam = killer?.team || (target.team === TEAM.AZURE ? TEAM.CRIMSON : TEAM.AZURE)
    if (killer && killer.team !== target.team) {
      killer.kills += 1
      killer.gold += 300
      killer.cs += 0
      grantXp(match, killer, 210)
      match.score[killer.team] += 1
    } else if (killerTeam !== target.team) {
      match.score[killerTeam] += 1
    }
    addEffect(match, { kind: 'death', x: target.x, y: target.y, radius: 130, team: target.team, ttl: 1.2 })
    if (!match.firstBlood) {
      match.firstBlood = true
      announce(match, 'FIRST BLOOD', `${killer?.name || 'The rift'} draws first blood`, killerTeam === TEAM.AZURE ? 'gold' : 'danger')
    } else if (target.team === TEAM.CRIMSON) {
      announce(match, 'ENEMY SLAIN', `${match.player.name} has cut down ${target.name}`, 'gold')
    } else {
      announce(match, 'YOU HAVE BEEN SLAIN', `${target.name} will return in ${Math.ceil(target.respawnTimer)}s`, 'danger')
    }
    match.events.push({ type: 'championDeath', team: target.team, killerTeam, x: target.x, y: target.y })
    if (killerTeam === TEAM.AZURE && killer) {
      match.events.push({ type: 'killfeed', text: `${match.player.name} slew ${target.name}`, tone: 'azure' })
    } else {
      match.events.push({ type: 'killfeed', text: `${target.name} fell`, tone: 'crimson' })
    }
  }
}

function queueDelayed(match, details) {
  match.delayed.push({
    id: match.nextId++,
    time: 0,
    ...details
  })
  match.events.push({ type: 'castDelay', team: details.source.team, kind: details.kind })
}

function applyDelayed(match, details) {
  if (details.kind === 'meteor') {
    addEffect(match, { kind: 'meteorHit', x: details.x, y: details.y, radius: details.radius, color: details.color, ttl: 0.75 })
    for (const target of hostileUnits(match, details.source)) {
      if (distance(details.x, details.y, target.x, target.y) <= details.radius + target.radius) {
        dealDamage(match, details.source, target, details.damage, details.damageType, {
          ability: details.label,
          stun: details.stun || 0,
          slow: details.slow || 0,
          slowTime: details.slowTime || 0
        })
      }
    }
    match.events.push({ type: 'shake', amount: 10 })
  }
  if (details.kind === 'beam') {
    addEffect(match, { kind: 'beam', x: details.x, y: details.y, x2: details.x2, y2: details.y2, width: details.radius, color: details.color, ttl: 0.5 })
    for (const target of hostileUnits(match, details.source)) {
      if (pointSegmentDistance(target.x, target.y, details.x, details.y, details.x2, details.y2) <= details.radius + target.radius) {
        dealDamage(match, details.source, target, details.damage, details.damageType, { ability: details.label })
      }
    }
    match.events.push({ type: 'shake', amount: 8 })
  }
}

function updateProjectiles(match, dt) {
  for (const projectile of match.projectiles) {
    if (projectile.ttl <= 0) continue
    projectile.ttl -= dt
    if (projectile.homing) {
      const target = findById(match, projectile.homing)
      if (!target || !aliveTarget(target)) {
        projectile.homing = null
      } else {
        const speed = Math.hypot(projectile.vx, projectile.vy) || 1000
        const angle = Math.atan2(target.y - projectile.y, target.x - projectile.x)
        projectile.vx = Math.cos(angle) * speed
        projectile.vy = Math.sin(angle) * speed
      }
    }
    const stepX = projectile.vx * dt
    const stepY = projectile.vy * dt
    projectile.x += stepX
    projectile.y += stepY
    projectile.traveled += Math.hypot(stepX, stepY)
    if (projectile.traveled > projectile.range) {
      projectile.ttl = 0
      continue
    }
    const enemyTeam = teamOf(projectile.team)
    const candidates = []
    for (const champion of match.champions) if (champion.team === enemyTeam && !champion.dead) candidates.push(champion)
    for (const minion of match.minions) if (minion.team === enemyTeam && minion.alive) candidates.push(minion)
    for (const structure of match.structures) if (structure.team === enemyTeam && structure.alive) candidates.push(structure)
    for (const target of candidates) {
      if (projectile.hit.includes(target.id)) continue
      if (distance(projectile.x, projectile.y, target.x, target.y) <= projectile.radius + target.radius) {
        if (target.kind === 'structure' && target.type === 'nexus' && isNexusShielded(match, target.team)) {
          projectile.ttl = 0
          addEffect(match, { kind: 'shieldHit', x: target.x, y: target.y, radius: 120, color: TEAM_COLORS[target.team].primary, ttl: 0.35 })
          break
        }
        dealDamage(match, projectile.sourceKind === 'champion' ? findById(match, projectile.sourceId) : { team: projectile.team, kind: 'tower' }, target, projectile.damage, projectile.damageType, {
          basic: projectile.kind === 'auto',
          root: projectile.root,
          slow: projectile.slow,
          slowTime: projectile.slowTime,
          ability: projectile.kind === 'chains' ? 'Shadow Chains' : ''
        })
        addEffect(match, { kind: 'impact', x: target.x, y: target.y, radius: 22, color: projectile.color, ttl: 0.25 })
        projectile.hit.push(target.id)
        if (!projectile.pierce) {
          projectile.ttl = 0
          break
        }
      }
    }
  }
  match.projectiles = match.projectiles.filter(projectile => projectile.ttl > 0)
}

function findById(match, id) {
  for (const champion of match.champions) if (champion.id === id) return champion
  for (const minion of match.minions) if (minion.id === id) return minion
  for (const structure of match.structures) if (structure.id === id) return structure
  return null
}

function updateTraps(match, dt) {
  for (const trap of match.traps) {
    if (trap.triggered) continue
    trap.ttl -= dt
    trap.arm -= dt
    if (trap.ttl <= 0) {
      trap.triggered = true
      continue
    }
    if (trap.arm > 0) continue
    for (const target of hostileUnits(match, { team: trap.team })) {
      if (distance(trap.x, trap.y, target.x, target.y) <= trap.radius + target.radius) {
        trap.triggered = true
        const source = findById(match, trap.sourceId) || { team: trap.team, kind: 'champion', x: trap.x, y: trap.y }
        dealDamage(match, source, target, trap.damage, 'magic', { ability: 'Snare Rune', root: 1.65 })
        addEffect(match, { kind: 'runeBurst', x: trap.x, y: trap.y, radius: trap.radius, color: trap.color, ttl: 0.55 })
        break
      }
    }
  }
  match.traps = match.traps.filter(trap => !trap.triggered || trap.ttl > -0.4)
  if (match.traps.length > 30) match.traps.splice(0, match.traps.length - 30)
}

function updateDelayedEffects(match, dt) {
  for (const details of match.delayed) {
    details.time += dt
    if (details.time >= details.delay) {
      details.done = true
      applyDelayed(match, details)
    }
  }
  match.delayed = match.delayed.filter(details => !details.done)
}

function updateEffects(match, dt) {
  for (const effect of match.effects) effect.ttl -= dt
  match.effects = match.effects.filter(effect => effect.ttl > 0)
  if (match.effects.length > 240) match.effects.splice(0, match.effects.length - 240)
}

function updateChampionState(match, champion, dt) {
  if (champion.dead) {
    champion.respawnTimer -= dt
    if (champion.respawnTimer <= 0) {
      respawnChampion(match, champion)
    }
    return
  }
  for (const key of Object.keys(champion.cooldowns)) {
    champion.cooldowns[key] = Math.max(0, champion.cooldowns[key] - dt)
  }
  champion.attackTimer = Math.max(0, champion.attackTimer - dt)
  champion.stun = Math.max(0, champion.stun - dt)
  champion.root = Math.max(0, champion.root - dt)
  champion.slowTime = Math.max(0, champion.slowTime - dt)
  champion.shieldTime = Math.max(0, champion.shieldTime - dt)
  if (champion.shieldTime <= 0) champion.shield = 0
  champion.bonusSpeedTime = Math.max(0, (champion.bonusSpeedTime || 0) - dt)
  if (champion.bonusSpeedTime <= 0) champion.bonusSpeed = 0
  champion.hp = Math.min(champion.maxHp, champion.hp + champion.hpRegen * dt)
  champion.mana = Math.min(champion.maxMana, champion.mana + champion.manaRegen * dt)
  champion.gold += 2.4 * dt
}

function respawnChampion(match, champion) {
  const data = CHAMPIONS[champion.championId]
  champion.dead = false
  champion.hp = champion.maxHp
  champion.mana = champion.maxMana
  champion.shield = 0
  champion.root = 0
  champion.stun = 0
  champion.slow = 0
  champion.slowTime = 0
  champion.bonusSpeed = 0.35
  champion.bonusSpeedTime = 3.5
  champion.attackTimer = 0
  const base = champion.team === TEAM.AZURE ? { x: 420, y: 2700 } : { x: 2700, y: 420 }
  champion.x = base.x
  champion.y = base.y
  addEffect(match, { kind: 'spawn', x: champion.x, y: champion.y, radius: 90, team: champion.team, ttl: 1 })
  match.events.push({ type: 'respawn', team: champion.team, champion: champion.championId })
  void data
}

function updateChampionMovement(match, champion, dt, moveX, moveY, moveTo) {
  if (champion.dead || !champion || champion.stun > 0 || champion.root > 0) return
  const speed = applySpeedModifiers(champion) * (1 + (champion.bonusSpeed || 0))
  let dx = moveX
  let dy = moveY
  if (!dx && !dy && moveTo) {
    const current = distance(champion.x, champion.y, moveTo.x, moveTo.y)
    if (current > 16) {
      dx = moveTo.x - champion.x
      dy = moveTo.y - champion.y
    }
  }
  if (!dx && !dy) return
  const beforeX = champion.x
  const beforeY = champion.y
  moveUnit(champion, dx, dy, speed * dt)
  pushOutOfStructures(match, champion)
  champion.moving = distance(beforeX, beforeY, champion.x, champion.y) > 0.1
  if (champion.moving) champion.bob += dt * 7
}

function restoreMana(match, champion, amount) {
  champion.mana = Math.min(champion.maxMana, champion.mana + amount)
}

function nearestChampion(match, source, maxDistance = Infinity) {
  let best = null
  let bestDistance = maxDistance
  for (const champion of match.champions) {
    if (champion.team === source.team || champion.dead) continue
    const current = distance(source.x, source.y, champion.x, champion.y)
    if (current < bestDistance) {
      best = champion
      bestDistance = current
    }
  }
  return best
}

function updateEnemyAI(match, dt) {
  const enemy = match.enemy
  if (!enemy || enemy.dead) return
  enemy.aiThink -= dt
  const player = match.player
  const enemyTeam = teamOf(enemy.team)
  const ownNexus = getStructure(match, enemy.team, 'nexus')
  const enemyNexus = getStructure(match, teamOf(enemy.team), 'nexus')
  const lowHealth = enemy.hp / enemy.maxHp < 0.3
  const playerNear = player && !player.dead ? distance(enemy.x, enemy.y, player.x, player.y) : Infinity
  const nearbyAlly = match.minions.some(minion => minion.team === enemy.team && minion.alive && distance(enemy.x, enemy.y, minion.x, minion.y) < 380)
  const playerTower = match.structures.find(structure => structure.team === player.team && structure.alive && structure.type.startsWith('tower') && distance(enemy.x, enemy.y, structure.x, structure.y) < structure.range + 120)
  if (enemy.aiThink <= 0) {
    enemy.aiThink = 0.22
    if (enemy.gold >= 300) {
      const affordable = ITEMS.filter(item => item.cost <= enemy.gold && !enemy.items.includes(item.id) && enemy.items.length < 6)
      if (affordable.length) {
        affordable.sort((a, b) => b.cost - a.cost)
        buyItem(match, enemy, affordable[0].id)
      }
    }
  }
  if (lowHealth) {
    const base = enemy.team === TEAM.AZURE ? { x: 420, y: 2780 } : { x: 2780, y: 420 }
    const retreatAngle = Math.atan2(base.y - enemy.y, base.x - enemy.x)
    updateChampionMovement(match, enemy, dt, Math.cos(retreatAngle), Math.sin(retreatAngle))
    if (enemy.cooldowns.d <= 0 && enemy.hp / enemy.maxHp < 0.22) castSummoner(match, enemy, 'd', enemy.x, enemy.y)
    if (enemy.cooldowns.f <= 0 && playerNear < 260) castSummoner(match, enemy, 'f', base.x, base.y)
    if (enemy.cooldowns.e <= 0 && playerNear < 260) castAbility(match, enemy, 'e', base.x, base.y)
    if (enemy.cooldowns.w <= 0 && playerNear < 320) castAbility(match, enemy, 'w', player.x, player.y)
    const target = findNearestEnemy(match, enemy, { maxDistance: enemy.range + 60, includeMinions: true })
    if (target) basicAttack(match, enemy, target)
    return
  }
  let target = null
  if (player && !player.dead && playerNear < 760) target = player
  if (!target) {
    target = findNearestEnemy(match, enemy, { maxDistance: 620, includeMinions: true, includeStructures: false })
  }
  if (!target) {
    target = findNearestEnemy(match, enemy, { maxDistance: 240, includeMinions: true, includeStructures: true })
  }
  if (target && target.kind === 'champion') {
    const targetDistance = distance(enemy.x, enemy.y, target.x, target.y)
    const ideal = enemy.range > 200 ? enemy.range * 0.78 : 95
    if (targetDistance > ideal) {
      updateChampionMovement(match, enemy, dt, target.x - enemy.x, target.y - enemy.y)
    } else if (targetDistance < ideal * 0.62) {
      updateChampionMovement(match, enemy, dt, enemy.x - target.x, enemy.y - target.y)
    } else if (!enemy.moving) {
      updateChampionMovement(match, enemy, dt, 0, 0)
    }
    const castWindow = enemy.range > 200 ? 720 : 360
    if (targetDistance < castWindow) {
      if (enemy.cooldowns.q <= 0 && enemy.mana >= CHAMPIONS[enemy.championId].abilities.q.mana) castAbility(match, enemy, 'q', target.x, target.y)
      if (enemy.cooldowns.w <= 0 && targetDistance < 420 && enemy.mana >= CHAMPIONS[enemy.championId].abilities.w.mana) castAbility(match, enemy, 'w', target.x, target.y)
      if (enemy.cooldowns.e <= 0 && (targetDistance < 260 || enemy.hp / enemy.maxHp < 0.55) && enemy.mana >= CHAMPIONS[enemy.championId].abilities.e.mana) castAbility(match, enemy, 'e', target.x, target.y)
      if (enemy.level >= 3 && enemy.cooldowns.r <= 0 && targetDistance < 620 && enemy.mana >= CHAMPIONS[enemy.championId].abilities.r.mana) castAbility(match, enemy, 'r', target.x, target.y)
    }
    if (targetDistance <= enemy.range + target.radius + 20) basicAttack(match, enemy, target)
    return
  }
  if (target) {
    const targetDistance = distance(enemy.x, enemy.y, target.x, target.y)
    const ideal = Math.min(enemy.range * 0.8, 240)
    if (targetDistance > ideal) {
      updateChampionMovement(match, enemy, dt, target.x - enemy.x, target.y - enemy.y)
    }
    if (targetDistance <= enemy.range + target.radius + 20) basicAttack(match, enemy, target)
    if (target.kind === 'structure' && targetDistance <= 620) {
      if (enemy.cooldowns.q <= 0) castAbility(match, enemy, 'q', target.x, target.y)
      if (enemy.cooldowns.e <= 0 && targetDistance < 300) castAbility(match, enemy, 'e', target.x, target.y)
    }
    return
  }
  if (playerTower && !nearbyAlly && !playerNear) {
    const away = normalize(enemy.x - playerTower.x, enemy.y - playerTower.y)
    updateChampionMovement(match, enemy, dt, away.x, away.y)
    return
  }
  const laneTarget = enemyNexus
  if (laneTarget) {
    const angle = Math.atan2(laneTarget.y - enemy.y, laneTarget.x - enemy.x)
    updateChampionMovement(match, enemy, dt, Math.cos(angle), Math.sin(angle))
  }
  void enemyTeam
  void ownNexus
}

function updatePlayerInput(match, dt, input) {
  const player = match.player
  if (!player || player.dead) return
  const move = normalize(input.moveX || 0, input.moveY || 0)
  if (move.x || move.y) {
    input.moveTo = null
    updateChampionMovement(match, player, dt, move.x, move.y)
  } else if (input.moveTo) {
    updateChampionMovement(match, player, dt, 0, 0, input.moveTo)
    if (distance(player.x, player.y, input.moveTo.x, input.moveTo.y) < 24) input.moveTo = null
  }
  if (input.pressed?.q) castAbility(match, player, 'q', input.aimX, input.aimY)
  if (input.pressed?.w) castAbility(match, player, 'w', input.aimX, input.aimY)
  if (input.pressed?.e) castAbility(match, player, 'e', input.aimX, input.aimY)
  if (input.pressed?.r) castAbility(match, player, 'r', input.aimX, input.aimY)
  if (input.pressed?.d) castSummoner(match, player, 'd', input.aimX, input.aimY)
  if (input.pressed?.f) castSummoner(match, player, 'f', input.aimX, input.aimY)
  if (input.attack) {
    const target = choosePlayerTarget(match, player, input.aimX, input.aimY)
    if (target) basicAttack(match, player, target)
  }
}

function choosePlayerTarget(match, player, aimX, aimY) {
  const enemyTeam = teamOf(player.team)
  const candidates = []
  for (const champion of match.champions) if (champion.team === enemyTeam && !champion.dead) candidates.push(champion)
  for (const minion of match.minions) if (minion.team === enemyTeam && minion.alive) candidates.push(minion)
  for (const structure of match.structures) if (structure.team === enemyTeam && structure.alive) candidates.push(structure)
  let best = null
  let bestScore = Infinity
  for (const candidate of candidates) {
    const reach = player.range + candidate.radius + 28
    const current = distance(player.x, player.y, candidate.x, candidate.y)
    if (current > reach) continue
    let score = current
    if (Number.isFinite(aimX) && Number.isFinite(aimY)) {
      score = distance(aimX, aimY, candidate.x, candidate.y) + current * 0.15
    }
    if (candidate.kind === 'champion') score -= 45
    if (candidate.kind === 'structure' && candidate.type === 'nexus' && isNexusShielded(match, candidate.team)) continue
    if (score < bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

function updateMinion(match, minion, dt) {
  if (!minion.alive) return
  minion.attackTimer = Math.max(0, minion.attackTimer - dt)
  minion.root = Math.max(0, minion.root - dt)
  minion.slowTime = Math.max(0, minion.slowTime - dt)
  const enemyTeam = teamOf(minion.team)
  let target = null
  let bestDistance = minion.type === 'caster' ? 470 : 410
  for (const champion of match.champions) {
    if (champion.team !== enemyTeam || champion.dead) continue
    const current = distance(minion.x, minion.y, champion.x, champion.y)
    if (current < bestDistance) {
      target = champion
      bestDistance = current
    }
  }
  if (!target) {
    for (const other of match.minions) {
      if (other.team !== enemyTeam || !other.alive) continue
      const current = distance(minion.x, minion.y, other.x, other.y)
      if (current < bestDistance) {
        target = other
        bestDistance = current
      }
    }
  }
  if (!target) {
    for (const structure of match.structures) {
      if (structure.team !== enemyTeam || !structure.alive) continue
      if (structure.type === 'nexus' && isNexusShielded(match, structure.team)) continue
      const current = distance(minion.x, minion.y, structure.x, structure.y)
      if (current < bestDistance + structure.radius) {
        target = structure
        bestDistance = current
      }
    }
  }
  if (target) {
    const reach = minion.range + target.radius
    if (bestDistance <= reach) {
      if (minion.attackTimer <= 0 && minion.root <= 0) {
        minion.attackTimer = 1 / minion.attackSpeed
        minion.facing = Math.atan2(target.y - minion.y, target.x - minion.x)
        if (minion.range > 200) {
          const angle = Math.atan2(target.y - minion.y, target.x - minion.x)
          spawnProjectile(match, { id: minion.id, team: minion.team, kind: 'minion', x: minion.x, y: minion.y }, {
            x: minion.x,
            y: minion.y,
            vx: Math.cos(angle) * 760,
            vy: Math.sin(angle) * 760,
            radius: 8,
            range: 520,
            damage: minion.ad,
            damageType: 'physical',
            kind: 'minionBolt',
            color: TEAM_COLORS[minion.team].primary,
            homing: target.id
          })
        } else {
          dealDamage(match, { id: minion.id, team: minion.team, kind: 'minion' }, target, minion.ad, 'physical', {})
          addEffect(match, { kind: 'slash', x: minion.x, y: minion.y, angle: minion.facing, radius: 30, color: TEAM_COLORS[minion.team].primary, ttl: 0.2 })
        }
      }
    } else if (minion.root <= 0) {
      moveUnit(minion, target.x - minion.x, target.y - minion.y, minion.speed * dt * (minion.slowTime > 0 ? 0.65 : 1))
    }
    return
  }
  if (minion.root > 0) return
  const waypoint = LANE[minion.wpIndex]
  if (!waypoint) return
  const current = distance(minion.x, minion.y, waypoint.x, waypoint.y)
  if (current < 46) {
    minion.wpIndex += minion.team === TEAM.AZURE ? 1 : -1
    if (minion.wpIndex < 0 || minion.wpIndex >= LANE.length) {
      minion.wpIndex = clamp(minion.wpIndex, 0, LANE.length - 1)
    }
  } else {
    moveUnit(minion, waypoint.x - minion.x, waypoint.y - minion.y, minion.speed * dt * (minion.slowTime > 0 ? 0.65 : 1))
    minion.bob += dt * 6
  }
}

function separateUnits(match, dt) {
  const units = []
  for (const champion of match.champions) if (!champion.dead) units.push(champion)
  for (const minion of match.minions) if (minion.alive) units.push(minion)
  for (let i = 0; i < units.length; i += 1) {
    const a = units[i]
    for (let j = i + 1; j < units.length; j += 1) {
      const b = units[j]
      const minimum = (a.radius + b.radius) * 0.82
      const current = distance(a.x, a.y, b.x, b.y)
      if (current < minimum && current > 0.001) {
        const push = (minimum - current) * 0.5 * clamp(dt * 18, 0, 1)
        const nx = (a.x - b.x) / current
        const ny = (a.y - b.y) / current
        a.x = clamp(a.x + nx * push, 100, MAP_SIZE - 100)
        a.y = clamp(a.y + ny * push, 100, MAP_SIZE - 100)
        b.x = clamp(b.x - nx * push, 100, MAP_SIZE - 100)
        b.y = clamp(b.y - ny * push, 100, MAP_SIZE - 100)
      }
    }
  }
  for (const unit of units) pushOutOfStructures(match, unit)
}

function updateStructures(match, dt) {
  for (const structure of match.structures) {
    if (!structure.alive) continue
    structure.attackTimer = Math.max(0, structure.attackTimer - dt)
    const enemyTeam = teamOf(structure.team)
    const candidates = []
    for (const minion of match.minions) {
      if (minion.team === enemyTeam && minion.alive && distance(structure.x, structure.y, minion.x, minion.y) <= structure.range + minion.radius) candidates.push(minion)
    }
    for (const champion of match.champions) {
      if (champion.team === enemyTeam && !champion.dead && distance(structure.x, structure.y, champion.x, champion.y) <= structure.range + champion.radius) candidates.push(champion)
    }
    if (!candidates.length) {
      structure.targetId = null
      structure.heat = Math.max(0, structure.heat - dt * 0.5)
      continue
    }
    candidates.sort((a, b) => {
      const priority = entity => entity.kind === 'minion' ? 0 : 1
      if (priority(a) !== priority(b)) return priority(a) - priority(b)
      return distance(structure.x, structure.y, a.x, a.y) - distance(structure.x, structure.y, b.x, b.y)
    })
    const target = candidates[0]
    if (structure.attackTimer <= 0) {
      structure.attackTimer = 1 / structure.attackSpeed
      const damage = structure.damage * (1 + Math.min(1.5, structure.heat * 0.25))
      structure.heat = Math.min(6, structure.heat + 1)
      structure.targetId = target.id
      const angle = Math.atan2(target.y - structure.y, target.x - structure.x)
      spawnProjectile(match, { id: structure.id, team: structure.team, kind: 'structure', x: structure.x, y: structure.y }, {
        x: structure.x,
        y: structure.y - 50,
        vx: Math.cos(angle) * 920,
        vy: Math.sin(angle) * 920,
        radius: 13,
        range: structure.range + 120,
        damage,
        damageType: 'magic',
        kind: 'tower',
        color: TEAM_COLORS[structure.team].primary,
        homing: target.id
      })
      match.events.push({ type: 'towerShot', team: structure.team })
    }
  }
}

function spawnWave(match, advance = 0) {
  match.wave += 1
  for (const team of [TEAM.AZURE, TEAM.CRIMSON]) {
    const spawnIndex = team === TEAM.AZURE ? clamp(advance, 0, 2) : clamp(6 - advance, 4, 6)
    const base = LANE[spawnIndex]
    const direction = team === TEAM.AZURE ? 1 : -1
    const waypoint = 3
    const laneAngle = team === TEAM.AZURE ? -Math.PI * 0.25 : Math.PI * 0.75
    const perpX = -Math.sin(laneAngle)
    const perpY = Math.cos(laneAngle)
    const composition = ['melee', 'melee', 'melee', 'caster']
    if (match.wave % 3 === 0) composition.push('siege')
    composition.forEach((type, index) => {
      const offset = (index - (composition.length - 1) / 2) * 34
      const back = 34 + (index % 2) * 18
      const minion = createMinion(match, team, type, base.x + perpX * offset - Math.cos(laneAngle) * back, base.y + perpY * offset - Math.sin(laneAngle) * back)
      minion.wpIndex = waypoint
      minion.laneDirection = direction
      match.minions.push(minion)
    })
  }
  match.events.push({ type: 'wave', wave: match.wave })
  match.waveTimer = 24
}

function createMinion(match, team, type, x, y) {
  const base = {
    melee: { hp: 300, ad: 17, range: 78, speed: 92, radius: 15, xp: 34, gold: 24, attackSpeed: 1.1 },
    caster: { hp: 230, ad: 24, range: 390, speed: 88, radius: 13, xp: 40, gold: 28, attackSpeed: 0.9 },
    siege: { hp: 520, ad: 38, range: 330, speed: 76, radius: 22, xp: 62, gold: 48, attackSpeed: 0.7 }
  }[type]
  return {
    id: match.nextId++,
    kind: 'minion',
    type,
    team,
    x,
    y,
    radius: base.radius,
    hp: base.hp,
    maxHp: base.hp,
    ad: base.ad,
    range: base.range,
    speed: base.speed,
    xp: base.xp,
    gold: base.gold,
    attackSpeed: base.attackSpeed,
    attackTimer: Math.random() * 0.4,
    wpIndex: team === TEAM.AZURE ? 1 : 5,
    laneDirection: team === TEAM.AZURE ? 1 : -1,
    facing: team === TEAM.AZURE ? -Math.PI * 0.25 : Math.PI * 0.75,
    bob: Math.random() * Math.PI * 2,
    alive: true,
    root: 0,
    slowTime: 0
  }
}

function cleanup(match) {
  match.minions = match.minions.filter(minion => minion.alive || minion.deathFade > 0)
  for (const minion of match.minions) {
    if (!minion.alive) minion.deathFade = (minion.deathFade || 0.05) - 0.05
  }
  if (match.minions.length > 80) {
    const dead = match.minions.findIndex(minion => !minion.alive)
    if (dead >= 0) match.minions.splice(dead, 1)
  }
}

function checkWin(match) {
  if (match.state !== 'playing') return
  const enemyNexus = getStructure(match, TEAM.CRIMSON, 'nexus')
  const ownNexus = getStructure(match, TEAM.AZURE, 'nexus')
  if (!enemyNexus.alive) {
    match.state = 'victory'
    match.winner = TEAM.AZURE
  } else if (!ownNexus.alive) {
    match.state = 'defeat'
    match.winner = TEAM.CRIMSON
  }
}

export function updateMatch(match, delta, input = {}) {
  if (!match || match.state !== 'playing') return match
  const dt = clamp(delta, 0, 0.05)
  match.time += dt
  match.waveTimer -= dt
  if (match.waveTimer <= 0) spawnWave(match)
  updatePlayerInput(match, dt, input)
  for (const champion of match.champions) updateChampionState(match, champion, dt)
  updateEnemyAI(match, dt)
  for (const minion of match.minions) updateMinion(match, minion, dt)
  updateStructures(match, dt)
  updateProjectiles(match, dt)
  updateTraps(match, dt)
  updateDelayedEffects(match, dt)
  separateUnits(match, dt)
  updateEffects(match, dt)
  cleanup(match)
  checkWin(match)
  if (match.announcements.length > 8) match.announcements.splice(0, match.announcements.length - 8)
  if (match.events.length > 400) match.events.splice(0, match.events.length - 400)
  return match
}

export function matchSummary(match) {
  const player = match.player
  const enemy = match.enemy
  return {
    result: match.state,
    winner: match.winner,
    time: match.time,
    score: { ...match.score },
    player: {
      champion: player.championId,
      name: player.name,
      level: player.level,
      kills: player.kills,
      deaths: player.deaths,
      cs: player.cs,
      gold: Math.floor(player.gold),
      damage: Math.round(player.damageDealt),
      items: [...player.items]
    },
    enemy: {
      champion: enemy.championId,
      name: enemy.name,
      level: enemy.level,
      kills: enemy.kills,
      deaths: enemy.deaths,
      cs: enemy.cs,
      damage: Math.round(enemy.damageDealt)
    }
  }
}
