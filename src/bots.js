import * as THREE from 'three'
import { createCharacter, animateCharacter, randomBotPalette, setCharacterWeapon } from './character.js'
import { WEAPONS } from './weapons.js'
import { clamp, damp, makeRng, yawFromDir, canvasTexture, formatTime } from './util.js'

const NAMES = [
  'Vex', 'Nova', 'Kodiak', 'Pixel', 'Rook', 'Blitz', 'Mako', 'Juno', 'Fable', 'Onyx',
  'Ripley', 'Sable', 'Echo', 'Kilo', 'Wisp', 'Talon', 'Drift', 'Nyx', 'Cinder'
]

function makeNameSprite(name, color) {
  const tex = canvasTexture(256, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.font = '700 30px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(0,0,0,.75)'
    ctx.strokeText(name, w / 2, h / 2)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(name, w / 2, h / 2)
    ctx.fillStyle = color
    ctx.fillRect(w / 2 - 34, h - 8, 68, 3)
  })
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: true, fog: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(2.25, 0.56, 1)
  sprite.position.y = 2.45
  return sprite
}

function makeBotName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)]
}

export class Bot {
  constructor(manager, index, name, palette, spawn, weaponId) {
    this.manager = manager
    this.game = manager.game
    this.id = `bot-${index}`
    this.index = index
    this.name = name
    this.rig = createCharacter(palette)
    this.group = this.rig.group
    this.group.position.copy(spawn)
    this.position = spawn.clone()
    this.velocity = new THREE.Vector3()
    this.yaw = Math.random() * Math.PI * 2
    this.health = 100
    this.maxHealth = 100
    this.shield = Math.random() < 0.35 ? Math.floor(Math.random() * 3) * 25 : 0
    this.maxShield = 100
    this.alive = true
    this.deadTime = 0
    this.weapon = WEAPONS[weaponId]
    this.weaponId = weaponId
    this.fireTimer = 1 + Math.random() * 2
    this.thinkTimer = Math.random() * 0.4
    this.reactionTimer = 1.0 + Math.random() * 0.8
    this.strafeDir = Math.random() < 0.5 ? -1 : 1
    this.strafeTimer = 1 + Math.random() * 2
    this.reactionTimer = 0
    this.target = null
    this.targetPos = new THREE.Vector3()
    this.waypoint = spawn.clone()
    this.waypointTimer = 0
    this.hurtTimer = 0
    this.buildCooldown = 4 + Math.random() * 6
    this.stuckTimer = 0
    this.lastPos = spawn.clone()
    this.kills = 0
    this.damageDealt = 0
    this.losBlock = null
    this.buildCooldown = 6
    this.reactionSeen = 0
    this.setWeapon()
    this.nameSprite = makeNameSprite(name, '#' + new THREE.Color(palette.accent).getHexString())
    this.group.add(this.nameSprite)
    this.hitMeshes = []
    this.group.traverse(obj => {
      if (!obj.isMesh) return
      let ancestor = obj
      while (ancestor && ancestor !== this.group) {
        if (ancestor === this.rig.weapon || ancestor === this.rig.pickaxe) return
        ancestor = ancestor.parent
      }
      if (obj.parent === this.rig.headGroup) obj.userData.part = 'head'
      else if (obj.parent === this.rig.leftLeg || obj.parent === this.rig.rightLeg || obj.parent === this.rig.leftArm || obj.parent === this.rig.rightArm) obj.userData.part = 'limb'
      else obj.userData.part = 'body'
      obj.userData.bot = this
      this.hitMeshes.push(obj)
    })
    this.muzzle = this.rig.muzzle
    this.game.scene.add(this.group)
    this.game.bulletTargets.push(...this.hitMeshes)
  }

  setWeapon() {
    setCharacterWeapon(this.rig, this.weaponId)
  }

  get eyePos() {
    return new THREE.Vector3(this.position.x, this.position.y + 1.45, this.position.z)
  }

  onDamaged(amount, sourcePos, sourceName = null, sourceBot = null) {
    if (!this.alive) return
    this.hurtTimer = 0.16
    this.lastAttacker = sourceName
    if (sourceBot) {
      this.target = sourceBot
      this.targetPos.copy(sourceBot.position)
    } else if (sourceName === 'player') {
      this.target = this.game.player
      this.targetPos.copy(this.game.player.position)
    }
    if (this.buildCooldown <= 0 && sourcePos && this.health > 30 && Math.random() < 0.62) {
      const dir = new THREE.Vector3(sourcePos.x - this.position.x, 0, sourcePos.z - this.position.z)
      if (dir.lengthSq() > 0.01) {
        dir.normalize()
        this.game.building.placeBotWall(this, dir)
        this.buildCooldown = 7 + Math.random() * 6
      }
    }
  }

  applyDamage(amount, source = null, sourceBot = null) {
    if (!this.alive) return
    let remaining = amount
    if (this.shield > 0) {
      const take = Math.min(this.shield, remaining)
      this.shield -= take
      remaining -= take
    }
    if (remaining > 0) this.health -= remaining
    const srcPos = source ? new THREE.Vector3(source.x, source.y, source.z) : null
    const srcName = sourceBot ? sourceBot.name : source?.isPlayer ? 'player' : source?.name ?? null
    this.onDamaged(amount, srcPos, srcName, sourceBot)
    if (this.health <= 0) {
      this.die(sourceBot ? sourceBot.name : source?.isPlayer ? 'player' : source?.name ?? 'STORM', sourceBot ? 'eliminated' : source?.isPlayer ? 'player' : 'storm', sourceBot, source?.isPlayer ? this.game.player : null)
    }
  }

  die(killerName, killerType, killerBot = null, killerPlayer = null) {
    if (!this.alive) return
    this.alive = false
    this.deadTime = 0
    this.rig.dead = true
    this.nameSprite.visible = false
    for (const mesh of this.hitMeshes) {
      const i = this.game.bulletTargets.indexOf(mesh)
      if (i >= 0) this.game.bulletTargets.splice(i, 1)
    }
    this.game.effects.explosion(new THREE.Vector3(this.position.x, this.position.y + 1.1, this.position.z), 0xffb15a, 24)
    const ground = this.game.world.terrainHeight(this.position.x, this.position.z)
    const dropX = this.position.x + (Math.random() - 0.5) * 1.8
    const dropZ = this.position.z + (Math.random() - 0.5) * 1.8
    const drop = this.game.world._makePickup(dropX, ground, dropZ, Math.random() < 0.6 ? 'shield' : 'ammo')
    drop.fromBot = true
    this.game.world.pickups.push(drop)
    if (Math.random() < 0.5) {
      const drop2 = this.game.world._makePickup(this.position.x + (Math.random() - 0.5) * 2, ground, this.position.z + (Math.random() - 0.5) * 2, 'ammo')
      drop2.fromBot = true
      this.game.world.pickups.push(drop2)
    }
    if (killerPlayer) {
      this.game.stats.eliminations++
      this.game.ui?.updateElims(this.game.stats.eliminations)
      this.game.ui?.toast(`ELIMINATED ${this.name}`, 'gold')
      this.game.audio.elimination()
      this.game.ui?.hitmarker(true)
    }
    this.game.ui?.killFeed(killerType === 'player' ? 'YOU' : killerName, this.name, this.weapon.name, {
      player: killerType === 'player',
      storm: killerType === 'storm'
    })
    this.game.onBotEliminated(this)
  }

  update(dt) {
    if (!this.alive) {
      this.deadTime += dt
      animateCharacter(this.rig, dt, { dead: true })
      if (this.deadTime > 2.4) this.group.visible = false
      for (const key of ['jacket', 'jacketDark', 'pants', 'skin']) {
        this.rig.mats[key].emissive?.setRGB(0, 0, 0)
      }
      return
    }
    this.hurtTimer = Math.max(0, this.hurtTimer - dt)
    this.buildCooldown = Math.max(0, this.buildCooldown - dt)
    this.fireTimer = Math.max(0, this.fireTimer - dt)
    this.thinkTimer -= dt
    this.strafeTimer -= dt
    this.reactionTimer = Math.max(0, this.reactionTimer - dt)
    if (this.strafeTimer <= 0) {
      this.strafeTimer = 1.2 + Math.random() * 2.5
      if (Math.random() < 0.7) this.strafeDir *= -1
    }

    const player = this.game.player
    const storm = this.game.world.storm
    const distToCenter = Math.hypot(this.position.x - storm.center.x, this.position.z - storm.center.y)
    const inStorm = distToCenter > storm.radius - 2
    const safeMargin = storm.radius - 4

    if (this.thinkTimer <= 0) {
      this.thinkTimer = 0.28 + Math.random() * 0.26
      this.chooseTarget()
    }

    let target = this.target
    if (target && target !== player && !target.alive) target = null
    if (target === player && (player.dead || this.game.state !== 'playing')) target = null
    let targetDistance = target ? this.position.distanceTo(target.position) : Infinity
    let los = false
    let blocker = null
    if (target && targetDistance < 62) {
      const res = this.game.hasLineOfSight(this.eyePos, target === player ? player.position.clone().add(new THREE.Vector3(0, 1.25, 0)) : target.eyePos)
      los = res.clear
      blocker = res.blocker
      if (!los && blocker) blocker = res.blocker
    }

    const move = new THREE.Vector3()
    let sprint = false
    if (inStorm && !this.game.world.storm.finished) {
      const dir = new THREE.Vector3(storm.center.x - this.position.x, 0, storm.center.y - this.position.z)
      if (dir.lengthSq() > 0.01) dir.normalize()
      move.copy(dir)
      sprint = true
    } else if (target && targetDistance < 40) {
      const toTarget = new THREE.Vector3(target.position.x - this.position.x, 0, target.position.z - this.position.z)
      const dist = toTarget.length()
      if (dist > 0.01) toTarget.multiplyScalar(1 / dist)
      const side = new THREE.Vector3(-toTarget.z, 0, toTarget.x).multiplyScalar(this.strafeDir)
      if (los) {
        const ideal = 12
        if (dist > ideal + 5) move.copy(toTarget)
        else if (dist < ideal - 4) move.copy(toTarget).multiplyScalar(-0.75)
        else move.copy(side).multiplyScalar(0.8)
        if (Math.random() < 0.02) move.addScaledVector(toTarget, 0.8)
      } else {
        move.copy(toTarget)
        if (blocker && blocker.userData?.structure) {
          if (this.fireTimer <= 0) {
            this.shootStructure(blocker)
            this.fireTimer = 0.55 + Math.random() * 0.35
          }
        }
      }
      this.faceTarget(target.position)
    } else {
      if (this.waypointTimer <= 0 || this.position.distanceTo(this.waypoint) < 2.4) {
        this.waypointTimer = 6 + Math.random() * 8
        const r = Math.max(8, safeMargin - 6)
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * r
        this.waypoint.set(storm.center.x + Math.cos(a) * rr, 0, storm.center.y + Math.sin(a) * rr)
        const d = Math.hypot(this.waypoint.x, this.waypoint.z)
        if (d > 128) {
          this.waypoint.x *= 128 / d
          this.waypoint.z *= 128 / d
        }
      }
      const dir = new THREE.Vector3(this.waypoint.x - this.position.x, 0, this.waypoint.z - this.position.z)
      const dist = dir.length()
      if (dist > 0.5) {
        dir.multiplyScalar(1 / dist)
        move.copy(dir)
        this.yaw = dampAngleSafe(this.yaw, yawFromDir(dir.x, dir.z), 6, dt)
      }
    }
    this.waypointTimer -= dt
    let speed = sprint ? 7.2 : 4.9
    if (los && targetDistance < 40) speed = 4.2
    if (move.lengthSq() > 0.001) {
      move.normalize()
      const desiredX = move.x * speed
      const desiredZ = move.z * speed
      this.velocity.x = damp(this.velocity.x, desiredX, this.game.state === 'playing' ? 8 : 0, dt)
      this.velocity.z = damp(this.velocity.z, desiredZ, 8, dt)
    } else {
      this.velocity.x = damp(this.velocity.x, 0, 10, dt)
      this.velocity.z = damp(this.velocity.z, 0, 10, dt)
    }
    this.position.x += this.velocity.x * dt
    this.position.z += this.velocity.z * dt
    this.resolveCollisions()
    this.position.y = this.game.world.groundHeightAt(this.position.x, this.position.z, this.position.y + 1.1)
    this.group.position.copy(this.position)
    if (target && targetDistance < 55 && los) this.faceTarget(target.position)
    else if (move.lengthSq() > 0.01) this.yaw = dampAngleSafe(this.yaw, yawFromDir(move.x, move.z), 6, dt)
    this.group.rotation.y = this.yaw

    if (target && targetDistance < 62 && this.reactionTimer <= 0) {
      if (los) {
        this.reactionTimer = 0.22 + Math.random() * 0.4
        if (this.fireTimer <= 0) this.shootTarget(target, targetDistance)
      } else if (blocker?.userData?.structure) {
        // shooting at cover is handled above
      }
    }
    if (target && this.position.distanceTo(this.lastPos) < 0.15) {
      this.stuckTimer += dt
      if (this.stuckTimer > 1.2) {
        this.strafeDir *= -1
        this.stuckTimer = 0
        this.waypoint.x += (Math.random() - 0.5) * 12
        this.waypoint.z += (Math.random() - 0.5) * 12
      }
    } else this.stuckTimer = 0
    this.lastPos.copy(this.position)

    animateCharacter(this.rig, dt, {
      speed: Math.hypot(this.velocity.x, this.velocity.z),
      aiming: !!target && los && targetDistance < 45,
      airborne: false
    })
    this.setWeapon()
    if (this.hurtTimer > 0) {
      for (const key of ['jacket', 'jacketDark', 'pants', 'skin']) this.rig.mats[key].emissive?.setRGB(0.6, 0.03, 0.03)
    } else {
      for (const key of ['jacket', 'jacketDark', 'pants', 'skin']) this.rig.mats[key].emissive?.setRGB(0, 0, 0)
    }
    const camDist = this.position.distanceTo(this.game.player.position)
    this.nameSprite.visible = camDist < 62
    this.nameSprite.material.opacity = camDist > 45 ? clamp(1 - (camDist - 45) / 17, 0, 1) : 1
  }

  chooseTarget() {
    const player = this.game.player
    let best = null
    let bestScore = Infinity
    if (!player.dead && this.game.state === 'playing') {
      const d = this.position.distanceTo(player.position)
      if (d < 58) {
        best = player
        bestScore = d * (d < 25 ? 0.7 : 1)
      }
    }
    for (const other of this.manager.bots) {
      if (other === this || !other.alive) continue
      const d = this.position.distanceTo(other.position)
      if (d < 50) {
        const score = d * (other.target === this ? 0.62 : 1)
        if (score < bestScore) {
          bestScore = score
          best = other
        }
      }
    }
    if (best) {
      if (this.target !== best) this.reactionTimer = 0.35 + Math.random() * 0.65
      this.target = best
      this.targetPos.copy(best.position)
    } else {
      this.target = null
    }
  }

  faceTarget(pos) {
    const dir = new THREE.Vector3(pos.x - this.position.x, 0, pos.z - this.position.z)
    if (dir.lengthSq() > 0.001) this.yaw = dampAngleSafe(this.yaw, yawFromDir(dir.x, dir.z), 8, 1 / 60)
  }

  resolveCollisions() {
    const colliders = this.game.world.colliders
    const radius = 0.38
    for (let pass = 0; pass < 2; pass++) {
      for (const c of colliders) {
        if (!c.active) continue
        if (c.maxY < this.position.y + 0.3 || c.minY > this.position.y + 1.6) continue
        const cx = clamp(this.position.x, c.minX, c.maxX)
        const cz = clamp(this.position.z, c.minZ, c.maxZ)
        const dx = this.position.x - cx
        const dz = this.position.z - cz
        const d2 = dx * dx + dz * dz
        if (d2 >= radius * radius || d2 < 1e-8) continue
        const d = Math.sqrt(d2)
        const push = radius - d + 0.001
        this.position.x += (dx / d) * push
        this.position.z += (dz / d) * push
      }
    }
    const dist = Math.hypot(this.position.x, this.position.z)
    if (dist > 130) {
      this.position.x *= 130 / dist
      this.position.z *= 130 / dist
    }
  }

  _muzzlePos() {
    const v = new THREE.Vector3()
    this.rig.muzzle.getWorldPosition(v)
    return v
  }

  _aimPoint(target) {
    if (target === this.game.player) return new THREE.Vector3(target.position.x, target.position.y + 1.25, target.position.z)
    return new THREE.Vector3(target.position.x, target.position.y + 1.3, target.position.z)
  }

  shootTarget(target, distance) {
    const def = this.weapon
    this.fireTimer = 1 / (def.rate * (def.id === 'shotgun' ? 0.9 : 0.8)) * (0.9 + Math.random() * 0.25)
    const from = this._muzzlePos()
    const targetPoint = this._aimPoint(target)
    const toTarget = targetPoint.clone().sub(from)
    const len = toTarget.length()
    if (len < 0.2) return
    toTarget.normalize()
    const isPlayer = target === this.game.player
    const moving = isPlayer ? Math.hypot(this.game.player.velocity.x, this.game.player.velocity.z) > 4 : false
    let accuracy = def.id === 'shotgun' ? 0.52 : def.id === 'smg' ? 0.4 : 0.47
    accuracy -= Math.min(0.24, (distance / def.range) * 0.32)
    if (moving) accuracy -= 0.1
    if (!isPlayer) accuracy += 0.06
    accuracy = clamp(accuracy, 0.12, 0.72)
    const hit = Math.random() < accuracy
    const side = new THREE.Vector3(-toTarget.z, 0, toTarget.x)
    const up = new THREE.Vector3(0, 1, 0)
    const missOffset = side.multiplyScalar((Math.random() - 0.5) * 2.4 * (1 - accuracy)).addScaledVector(up, (Math.random() - 0.3) * 1.1)
    const end = hit ? targetPoint.clone().addScaledVector(side, (Math.random() - 0.5) * 0.2) : targetPoint.clone().add(missOffset)
    this.game.effects.tracer(from, end, 0xffb36b, 0.75)
    this.game.effects.muzzle(from, 0xffbb66, 0.45)
    this.game.audio.shot(def.id, this.position.distanceTo(this.game.player.position))
    if (!hit) return
    const bodyDamage = def.id === 'shotgun' ? 22 : def.id === 'smg' ? 5.2 : 7.4
    const crit = Math.random() < 0.07
    const damage = bodyDamage * (crit ? 1.6 : 1)
    if (isPlayer) {
      this.game.player.applyDamage(damage, this.position, this)
      this.damageDealt += damage
    } else {
      target.applyDamage(damage, this, this)
      this.damageDealt += damage
    }
  }

  shootStructure(structureMesh) {
    const from = this._muzzlePos()
    const to = structureMesh.position.clone()
    this.game.effects.tracer(from, to, 0xffb36b, 0.6)
    this.game.effects.muzzle(from, 0xffbb66, 0.4)
    this.game.audio.shot('ar', this.position.distanceTo(this.game.player.position))
    const structure = structureMesh.userData?.structure
    if (structure) this.game.building.damage(structure, 16, to)
  }
}

function dampAngleSafe(a, b, lambda, dt) {
  let d = (b - a) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return a + d * (1 - Math.exp(-lambda * dt))
}

export class BotManager {
  constructor(game) {
    this.game = game
    this.bots = []
    this.rng = makeRng(4471)
    this.stormTick = 0
    this.playerPlace = 20
  }

  reset() {
    for (const bot of this.bots) {
      this.game.scene.remove(bot.group)
      for (const mesh of bot.hitMeshes) {
        const i = this.game.bulletTargets.indexOf(mesh)
        if (i >= 0) this.game.bulletTargets.splice(i, 1)
      }
      bot.rig.group.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose?.()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          for (const m of mats) m.dispose?.()
        }
      })
    }
    this.bots.length = 0
    this.stormTick = 0
    const pois = this.game.world.pois
    const names = [...NAMES].sort(() => Math.random() - 0.5)
    for (let i = 0; i < 19; i++) {
      let spawn = null
      let guard = 0
      while (!spawn && guard++ < 100) {
        const usePoi = Math.random() < 0.7
        let x, z
        if (usePoi) {
          const p = pois[Math.floor(Math.random() * pois.length)]
          const a = Math.random() * Math.PI * 2
          const r = 18 + Math.random() * 24
          x = p.x + Math.cos(a) * r
          z = p.z + Math.sin(a) * r
        } else {
          const a = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * 112
          x = Math.cos(a) * r
          z = Math.sin(a) * r
        }
        if (Math.hypot(x, z) > 124) continue
        const y = this.game.world.terrainHeight(x, z)
        if (y < 0.1) continue
        if (Math.hypot(x - this.game.player.position.x, z - this.game.player.position.z) < 20) continue
        spawn = new THREE.Vector3(x, y, z)
      }
      if (!spawn) spawn = new THREE.Vector3(this.rng.range(-80, 80), 2, this.rng.range(-80, 80))
      const palette = randomBotPalette(this.rng)
      const roll = Math.random()
      const weaponId = roll < 0.55 ? 'ar' : roll < 0.8 ? 'smg' : 'shotgun'
      const bot = new Bot(this, i, names[i], palette, spawn, weaponId)
      bot.yaw = Math.random() * Math.PI * 2
      bot.group.rotation.y = bot.yaw
      this.bots.push(bot)
    }
  }

  update(dt) {
    this.stormTick += dt
    const stormDamage = this.stormTick >= 1
    if (stormDamage) this.stormTick = 0
    for (const bot of this.bots) {
      bot.update(dt)
      if (bot.alive && stormDamage) {
        const storm = this.game.world.storm
        if (!storm.contains(bot.position.x, bot.position.z)) {
          bot.applyDamage(storm.damage, { name: 'STORM', isPlayer: false }, null)
        }
      }
    }
  }

  get aliveCount() {
    return this.bots.reduce((n, b) => n + (b.alive ? 1 : 0), 0)
  }

  applyStormToPlayer(dt) { /* handled by game */ }
}
