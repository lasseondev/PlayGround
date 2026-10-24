import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CHAMPION_LIST,
  CHAMPIONS,
  ITEMS,
  MAP_SIZE,
  MAX_LEVEL,
  TEAM,
  basicAttack,
  buyItem,
  castAbility,
  createMatch,
  damageAfterMitigation,
  dealDamage,
  getStructure,
  grantXp,
  isNexusShielded,
  matchSummary,
  recalculateChampion,
  updateMatch,
  xpNeeded
} from '../src/sim.js'

const step = (match, seconds, input = {}) => {
  const frames = Math.ceil(seconds * 60)
  for (let index = 0; index < frames; index += 1) updateMatch(match, 1 / 60, input)
  return match
}

test('all champions expose a complete, playable kit', () => {
  assert.equal(CHAMPION_LIST.length, 3)
  for (const champion of CHAMPION_LIST) {
    assert.ok(champion.name)
    assert.ok(champion.title)
    assert.ok(champion.lore)
    assert.ok(champion.stats.hp > 0)
    assert.ok(champion.stats.mana > 0)
    for (const key of ['q', 'w', 'e', 'r']) {
      const ability = champion.abilities[key]
      assert.ok(ability, `${champion.id} is missing ${key}`)
      assert.ok(ability.name)
      assert.ok(ability.cooldown > 0)
      assert.ok(ability.mana > 0)
      assert.ok(ability.desc)
    }
  }
})

test('match creation builds both bases, champions and an opening wave', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 42 })
  assert.equal(match.state, 'playing')
  assert.equal(match.player.championId, 'aurelia')
  assert.equal(match.enemy.championId, 'kael')
  assert.equal(match.structures.length, 6)
  assert.ok(match.minions.length >= 8)
  assert.ok(match.minions.every(minion => minion.alive))
  assert.equal(match.wave, 1)
  assert.ok(getStructure(match, TEAM.AZURE, 'nexus'))
  assert.ok(getStructure(match, TEAM.CRIMSON, 'nexus'))
  assert.equal(match.player.hp, match.player.maxHp)
  assert.equal(match.player.mana, match.player.maxMana)
})

test('experience grants levels and increases derived stats', () => {
  const match = createMatch({ playerChampion: 'nyx', enemyChampion: 'aurelia', seed: 7 })
  const player = match.player
  const startHp = player.maxHp
  const startAp = player.ap
  grantXp(match, player, xpNeeded(1))
  assert.equal(player.level, 2)
  assert.ok(player.maxHp > startHp)
  assert.ok(player.xpToNext > xpNeeded(1))
  grantXp(match, player, 100000)
  assert.equal(player.level, MAX_LEVEL)
  assert.equal(player.xp, 0)
  assert.ok(player.ap >= startAp)
})

test('ability casts spend mana and start cooldowns', () => {
  for (const champion of CHAMPION_LIST) {
    const match = createMatch({ playerChampion: champion.id, enemyChampion: 'aurelia', seed: 11 })
    const player = match.player
    const ability = CHAMPIONS[champion.id].abilities.q
    const mana = player.mana
    const cast = castAbility(match, player, 'q', player.x + 200, player.y - 200)
    assert.equal(cast, true, `${champion.id} could not cast Q`)
    assert.ok(player.cooldownCheck === undefined)
    assert.ok(player.cooldowns.q > 0)
    assert.ok(player.mana < mana)
    assert.ok(ability)
  }
})

test('ultimate is gated until level 3 and respects cooldown and mana', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 13 })
  const player = match.player
  assert.equal(castAbility(match, player, 'r', player.x + 100, player.y), false)
  player.level = 3
  recalculateChampion(player)
  player.mana = player.maxMana
  assert.equal(castAbility(match, player, 'r', player.x + 100, player.y), true)
  assert.ok(player.cooldowns.r > 0)
  assert.equal(castAbility(match, player, 'r', player.x + 100, player.y), false)
  player.cooldowns.r = 0
  player.mana = 0
  assert.equal(castAbility(match, player, 'r', player.x + 100, player.y), false)
})

test('basic attacks respect range and damage mitigation', () => {
  const match = createMatch({ playerChampion: 'kael', enemyChampion: 'aurelia', seed: 17 })
  const player = match.player
  const target = match.enemy
  player.x = 1600
  player.y = 1600
  target.x = 1600 + player.range + 200
  target.y = 1600
  assert.equal(basicAttack(match, player, target), false)
  target.x = 1600 + player.range - 20
  assert.equal(basicAttack(match, player, target), true)
  assert.ok(match.projectiles.length > 0)
  assert.ok(player.attackTimer > 0)
  const hp = target.hp
  dealDamage(match, player, target, 100, 'true')
  assert.ok(target.hp < hp)
  assert.equal(damageAfterMitigation(100, 100), 50)
  assert.equal(damageAfterMitigation(100, 0), 100)
})

test('item purchases spend gold and improve champion stats', () => {
  const match = createMatch({ playerChampion: 'kael', enemyChampion: 'nyx', seed: 19 })
  const player = match.player
  player.gold = 2000
  const boots = ITEMS.find(item => item.id === 'riftwalkers')
  const belt = ITEMS.find(item => item.id === 'belt')
  const ms = player.ms
  const hp = player.maxHp
  assert.equal(buyItem(match, player, boots.id), true)
  assert.ok(player.ms > ms)
  assert.ok(player.gold <= 2000 - boots.cost)
  assert.equal(buyItem(match, player, belt.id), true)
  assert.ok(player.maxHp > hp)
  player.gold = 0
  assert.equal(buyItem(match, player, 'edge'), false)
})

test('towers fire on enemies in range', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 23 })
  match.minions = []
  match.projectiles = []
  match.champions.forEach(champion => { champion.dead = true })
  const tower = getStructure(match, TEAM.AZURE, 'tower-outer')
  const minion = {
    id: 9999,
    kind: 'minion',
    type: 'melee',
    team: TEAM.CRIMSON,
    x: tower.x + 100,
    y: tower.y,
    radius: 15,
    hp: 300,
    maxHp: 300,
    ad: 10,
    range: 78,
    speed: 0,
    xp: 20,
    gold: 20,
    attackSpeed: 1,
    attackTimer: 0,
    wpIndex: 3,
    laneDirection: -1,
    facing: 0,
    bob: 0,
    alive: true,
    root: 0,
    slowTime: 0
  }
  match.minions.push(minion)
  step(match, 1.2)
  assert.ok(minion.hp < minion.maxHp)
})

test('destroying both towers exposes and destroys the nexus for victory', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'nyx', seed: 29 })
  assert.equal(isNexusShielded(match, TEAM.CRIMSON), true)
  const nexus = getStructure(match, TEAM.CRIMSON, 'nexus')
  const before = dealDamage(match, match.player, nexus, 99999, 'true')
  assert.equal(before, 0)
  assert.equal(match.state, 'playing')
  for (const structure of match.structures) {
    if (structure.team === TEAM.CRIMSON && structure.type.startsWith('tower')) structure.alive = false
  }
  assert.equal(isNexusShielded(match, TEAM.CRIMSON), false)
  dealDamage(match, match.player, nexus, 99999, 'true')
  assert.equal(match.state, 'victory')
  assert.equal(match.winner, TEAM.AZURE)
  const frozen = match.time
  updateMatch(match, 1, {})
  assert.equal(match.time, frozen)
  assert.equal(matchSummary(match).result, 'victory')
})

test('waves path past allied towers and reach the lane', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 33 })
  match.minions = []
  let azureProgress = -Infinity
  let crimsonProgress = -Infinity
  for (let frame = 0; frame < 50 * 60; frame += 1) {
    updateMatch(match, 1 / 60)
    for (const minion of match.minions) {
      if (minion.team === TEAM.AZURE) azureProgress = Math.max(azureProgress, minion.x - minion.y)
      else crimsonProgress = Math.max(crimsonProgress, minion.y - minion.x)
    }
  }
  assert.ok(azureProgress > -500, `azure stalled at lane progress ${azureProgress}`)
  assert.ok(crimsonProgress > -500, `crimson stalled at lane progress ${crimsonProgress}`)
})

test('minions damage enemy towers when uncontested', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 35 })
  match.minions = []
  match.projectiles = []
  match.champions.forEach(champion => { champion.dead = true })
  const tower = getStructure(match, TEAM.CRIMSON, 'tower-outer')
  const minion = {
    id: 9998, kind: 'minion', type: 'melee', team: TEAM.AZURE,
    x: tower.x - 100, y: tower.y + 100, radius: 15, hp: 300, maxHp: 300,
    ad: 17, range: 78, speed: 92, xp: 20, gold: 20, attackSpeed: 1.1,
    attackTimer: 0, wpIndex: 3, laneDirection: 1, facing: 0, bob: 0,
    alive: true, root: 0, slowTime: 0
  }
  match.minions.push(minion)
  const before = tower.hp
  step(match, 2)
  assert.ok(tower.hp < before)
})

test('champions gain experience from nearby minion deaths', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 36 })
  match.minions = []
  const player = match.player
  player.x = 1600
  player.y = 1600
  const minion = {
    id: 9997, kind: 'minion', type: 'melee', team: TEAM.CRIMSON,
    x: 1620, y: 1600, radius: 15, hp: 1, maxHp: 300,
    ad: 17, range: 78, speed: 92, xp: 200, gold: 24, attackSpeed: 1.1,
    attackTimer: 0, wpIndex: 3, laneDirection: -1, facing: 0, bob: 0,
    alive: true, root: 0, slowTime: 0
  }
  match.minions.push(minion)
  dealDamage(match, player, minion, 999, 'true')
  assert.ok(player.xp > 0 || player.level > 1)
})

test('player attacks can damage enemy structures', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 38 })
  match.minions = []
  match.champions.forEach(champion => { if (champion !== match.player) champion.dead = true })
  const tower = getStructure(match, TEAM.CRIMSON, 'tower-outer')
  match.player.x = tower.x - 150
  match.player.y = tower.y
  match.player.hp = 99999
  match.player.maxHp = 99999
  const before = tower.hp
  step(match, 4, { attack: true, aimX: tower.x, aimY: tower.y })
  assert.ok(tower.hp < before)
})

test('a long unattended simulation remains finite and stable', () => {
  const match = createMatch({ playerChampion: 'nyx', enemyChampion: 'kael', seed: 31 })
  for (let second = 0; second < 75; second += 1) {
    step(match, 1)
    if (match.state !== 'playing') break
    for (const champion of match.champions) {
      assert.ok(Number.isFinite(champion.x) && Number.isFinite(champion.y))
      assert.ok(champion.x >= 0 && champion.x <= MAP_SIZE)
      assert.ok(champion.y >= 0 && champion.y <= MAP_SIZE)
      assert.ok(champion.hp <= champion.maxHp + 0.001)
      assert.ok(champion.mana <= champion.maxMana + 0.001)
    }
    for (const minion of match.minions) {
      assert.ok(Number.isFinite(minion.x) && Number.isFinite(minion.y))
      assert.ok(minion.hp <= minion.maxHp + 0.001)
    }
  }
  assert.ok(match.time > 10)
  assert.ok(match.events.length <= 400)
})

test('player input can move and fight', () => {
  const match = createMatch({ playerChampion: 'aurelia', enemyChampion: 'kael', seed: 37 })
  const player = match.player
  const startX = player.x
  const startY = player.y
  step(match, 0.5, { moveX: 1, moveY: -1, pressed: {} })
  assert.ok(player.x > startX)
  assert.ok(player.y < startY)
  player.cooldowns.q = 0
  player.mana = player.maxMana
  step(match, 0.1, { pressed: { q: true }, aimX: player.x + 200, aimY: player.y - 200 })
  assert.ok(player.cooldowns.q > 0)
})
