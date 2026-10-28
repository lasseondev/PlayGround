import { Zombie } from '../entities/Zombie.js'

const FLAVOR = [
  'THE HORDE IS INSIDE THE BUILDING',
  'SOMETHING MOVING IN THE FOOD COURT',
  'THE CINEMA DOORS ARE OPEN',
  'THEY CAME UP FROM PARKING P2',
  'SECURITY FEED IS OFFLINE',
  'THE ESCALATORS ARE NOT A SAFE HAVEN',
  'DO NOT LET THEM REACH THE ATRIUM',
  'THE NIGHT SHIFT IS GETTING CROWDED'
]

export class Waves {
  constructor(game) {
    this.game = game
    this.number = 0
    this.total = 0
    this.toSpawn = 0
    this.spawnTimer = 0
    this.spawnInterval = 1
    this.maxAlive = 8
    this.state = 'idle'
    this.intermissionLeft = 0
    this.totalWaves = 0
  }

  reset() {
    this.number = 0
    this.total = 0
    this.toSpawn = 0
    this.state = 'idle'
    this.intermissionLeft = 0
    this.spawnTimer = 1.2
    this.startWave(1)
  }

  composition(n) {
    const list = []
    const walkers = 4 + Math.floor(n * 2.4)
    for (let i = 0; i < walkers; i++) list.push('walker')
    if (n >= 2) for (let i = 0; i < Math.floor(n * 0.9); i++) list.push('runner')
    if (n >= 4) for (let i = 0; i < Math.floor((n - 2) / 2); i++) list.push('brute')
    if (n >= 6 && n % 3 === 0) for (let i = 0; i < 2; i++) list.push('crawler')
    // shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list.slice(0, 48)
  }

  startWave(n) {
    this.number = n
    this.game.wave = n
    this.state = 'active'
    const comp = this.composition(n)
    this.queue = comp
    this.total = comp.length
    this.toSpawn = comp.length
    this.spawnTimer = 0.8
    this.spawnInterval = Math.max(0.42, 1.35 - n * 0.07)
    this.maxAlive = Math.min(20, 6 + n * 2)
    this.game.hud.waveBanner(`WAVE ${String(n).padStart(2, '0')}`, n === 1 ? 'THE HORDE IS INSIDE THE BUILDING' : FLAVOR[(n - 2) % FLAVOR.length], 2.8)
    this.game.audio.playWave()
    if (n > 1) this.game.player.addGrenade(1)
    this.game.hud.setWave(this.snapshot())
  }

  snapshot() {
    const alive = this.game.zombies.filter(z => !z.removed && z.state !== 'dead').length
    return {
      number: this.number,
      total: this.total,
      toSpawn: this.toSpawn,
      remaining: alive,
      intermission: this.state === 'intermission',
      intermissionLeft: this.intermissionLeft
    }
  }

  update(dt) {
    if (this.state === 'active') {
      const alive = this.game.zombies.filter(z => !z.removed && z.state !== 'dead').length
      this.spawnTimer -= dt
      if (this.toSpawn > 0 && this.spawnTimer <= 0 && alive < this.maxAlive) {
        this.spawn()
        this.spawnTimer = this.spawnInterval * (0.75 + Math.random() * 0.5)
      }
      if (this.toSpawn <= 0 && alive === 0 && this.game.state === 'playing') {
        this.completeWave()
      }
      this.game.hud.setWave(this.snapshot())
    } else if (this.state === 'intermission') {
      this.intermissionLeft -= dt
      this.game.hud.setWave(this.snapshot())
      if (this.intermissionLeft <= 0) {
        this.startWave(this.number + 1)
      }
    }
  }

  spawn() {
    const type = this.queue.pop() || 'walker'
    this.toSpawn--
    const point = this.game.mall.getSpawnPoint(this.game.player.pos, this.game.partner?.pos)
    const z = new Zombie(this.game, type, point)
    this.game.zombies.push(z)
    // spawn flash / distant dust
    this.game.audio.playZombie(point, type)
  }

  completeWave() {
    this.state = 'intermission'
    this.intermissionLeft = 8
    this.game.hud.waveBanner(`WAVE ${String(this.number).padStart(2, '0')} CLEARED`, 'CATCH YOUR BREATH — RESUPPLY IN THE ATRIUM', 3.2)
    this.game.audio.playWaveClear()
    this.game.addScore(250 + this.number * 125, false)
    if (this.game.partner && this.game.partner.down) {
      setTimeout(() => { if (this.game.state === 'playing') this.game.partner.revive() }, 1500)
    }
    this.game.spawnIntermissionPickups()
    this.game.hud.subtitle('ROOK', 'Wave clear. Grab what you can — they regroup fast.', 2.8)
  }
}
