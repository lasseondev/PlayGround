import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { glowTexture } from '../world/textures.js'

const GEO = {
  torso: new RoundedBoxGeometry(0.62, 0.78, 0.34, 3, 0.1),
  pelvis: new RoundedBoxGeometry(0.48, 0.28, 0.3, 2, 0.06),
  head: new THREE.SphereGeometry(0.19, 14, 12),
  jaw: new RoundedBoxGeometry(0.2, 0.11, 0.16, 2, 0.03),
  shoulder: new THREE.SphereGeometry(0.11, 10, 8),
  upperArm: new THREE.CapsuleGeometry(0.085, 0.3, 3, 8),
  lowerArm: new THREE.CapsuleGeometry(0.07, 0.28, 3, 8),
  hand: new RoundedBoxGeometry(0.11, 0.18, 0.08, 2, 0.02),
  upperLeg: new THREE.CapsuleGeometry(0.105, 0.34, 3, 8),
  lowerLeg: new THREE.CapsuleGeometry(0.085, 0.34, 3, 8),
  foot: new RoundedBoxGeometry(0.16, 0.1, 0.32, 2, 0.02),
  eye: new THREE.SphereGeometry(0.021, 6, 5),
  blood: new THREE.BoxGeometry(0.16, 0.1, 0.02)
}

const SKINS = [0x7c8870, 0x8b9277, 0x6d7a63, 0x94a084, 0x7f8a7d, 0x6a7560]
const SHIRTS = [0x5c2b2b, 0x33404a, 0x3d4a34, 0x5b4a34, 0x4a3c52, 0x2f3338, 0x6b5c48, 0x7a3a2a]
const PANTS = [0x2a2e35, 0x36302a, 0x2b3430, 0x232a36, 0x3a3a3c]
const TYPES = {
  walker: { hp: 75, speed: 1.35, damage: 9, score: 100, scale: 1, attackCd: 1.15 },
  runner: { hp: 55, speed: 3.15, damage: 7, score: 150, scale: 0.94, attackCd: 0.85 },
  brute: { hp: 260, speed: 1.05, damage: 22, score: 500, scale: 1.36, attackCd: 1.45 },
  crawler: { hp: 40, speed: 1.9, damage: 6, score: 80, scale: 0.8, attackCd: 1 }
}

let nextId = 1

export class Zombie {
  constructor(game, type, position) {
    this.game = game
    this.type = type
    this.def = TYPES[type] || TYPES.walker
    this.id = nextId++
    this.hp = this.def.hp * (1 + Math.min(0.4, (game.wave - 1) * 0.035))
    this.maxHp = this.hp
    this.speed = this.def.speed * (0.9 + Math.random() * 0.25)
    this.damage = this.def.damage
    this.radius = 0.36 * this.def.scale
    this.pos = position.clone()
    this.pos.y = 0
    this.velocity = new THREE.Vector3()
    this.yaw = Math.random() * Math.PI * 2
    this.state = 'spawning'
    this.stateTime = 0
    this.attackCd = Math.random() * 0.6
    this.walkPhase = Math.random() * Math.PI * 2
    this.attackAnim = 0
    this.stagger = 0
    this.flash = 0
    this.deathTimer = 0
    this.groanTimer = 2 + Math.random() * 8
    this.target = null
    this.removed = false
    this.headless = false
    this.build()
  }

  build() {
    const rnd = Math.random()
    const skinColor = SKINS[Math.floor(Math.random() * SKINS.length)]
    const shirtColor = this.type === 'runner' ? 0x7a2b25 : SHIRTS[Math.floor(Math.random() * SHIRTS.length)]
    const pantColor = PANTS[Math.floor(Math.random() * PANTS.length)]
    const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.82, metalness: 0.02, emissive: 0x000000 })
    const shirt = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.92, metalness: 0.02, emissive: 0x000000 })
    const pants = new THREE.MeshStandardMaterial({ color: pantColor, roughness: 0.94, metalness: 0.02, emissive: 0x000000 })
    const shoe = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.7, metalness: 0.1 })
    const blood = new THREE.MeshStandardMaterial({ color: 0x4b0809, roughness: 0.65, metalness: 0.05 })
    const eye = new THREE.MeshBasicMaterial({ color: this.type === 'runner' ? 0xff2a14 : this.type === 'brute' ? 0xff6a12 : 0xd8ff6a, toneMapped: false })
    this.mats = [skin, shirt, pants]
    this.flashMats = [skin, shirt, pants]

    this.group = new THREE.Group()
    this.group.name = `zombie-${this.id}`
    this.body = new THREE.Group()
    this.group.add(this.body)

    const add = (geo, mat, x, y, z, parent = this.body, part = 'limb') => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.castShadow = true; m.receiveShadow = true
      m.userData.zombie = this
      m.userData.part = part
      parent.add(m)
      return m
    }

    this.hips = new THREE.Group(); this.hips.position.y = 0.96; this.body.add(this.hips)
    this.torso = add(GEO.torso, shirt, 0, 0.38, 0, this.hips, 'torso')
    this.torso.scale.set(1, 1, 1)
    if (this.type === 'brute') this.torso.scale.set(1.18, 1.12, 1.16)
    add(GEO.pelvis, pants, 0, -0.08, 0, this.hips, 'torso')

    this.headPivot = new THREE.Group(); this.headPivot.position.set(0, 0.9, 0.015); this.hips.add(this.headPivot)
    this.head = add(GEO.head, skin, 0, 0, 0, this.headPivot, 'head')
    this.head.scale.set(0.94, 1.08, 1)
    this.jaw = add(GEO.jaw, skin, 0, -0.13, 0.03, this.headPivot, 'head')
    this.jaw.rotation.x = 0.35 + Math.random() * 0.25
    const eyeL = add(GEO.eye, eye, -0.065, 0.02, 0.17, this.headPivot, 'head')
    const eyeR = add(GEO.eye, eye, 0.065, 0.02, 0.17, this.headPivot, 'head')
    eyeL.scale.setScalar(1); eyeR.scale.setScalar(1)
    const eyeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: eye.color, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
    eyeGlow.scale.set(0.4, 0.4, 1); eyeGlow.position.set(0, 0.02, 0.2); this.headPivot.add(eyeGlow)
    // wounds / blood
    for (let i = 0; i < 2; i++) {
      const b = add(GEO.blood, blood, (Math.random() - .5) * .3, 0.35 + Math.random() * .3, 0.17, this.hips, 'torso')
      b.rotation.z = Math.random() * 2
      b.scale.set(0.5 + Math.random(), 0.4 + Math.random(), 1)
    }
    if (rnd > 0.55) {
      const rip = add(new THREE.BoxGeometry(0.18, 0.24, 0.02), skin, (Math.random() - .5) * 0.3, 0.25 + Math.random() * .2, 0.178, this.hips, 'torso')
      rip.rotation.z = Math.random()
    }

    // arms
    this.armL = this.buildArm(skin, shirt, -1)
    this.armR = this.buildArm(skin, shirt, 1)
    // legs
    this.legL = this.buildLeg(pants, shoe, -1)
    this.legR = this.buildLeg(pants, shoe, 1)
    this.body.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
    this.group.scale.setScalar(this.def.scale)
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.yaw

    this.game.scene.add(this.group)
  }

  buildArm(skin, shirt, side) {
    const shoulder = new THREE.Group()
    shoulder.position.set(side * 0.37, 0.64, 0)
    this.hips.add(shoulder)
    const ball = new THREE.Mesh(GEO.shoulder, shirt); ball.userData.zombie = this; ball.userData.part = 'limb'; shoulder.add(ball)
    const upper = new THREE.Mesh(GEO.upperArm, Math.random() > 0.4 ? shirt : skin)
    upper.position.y = -0.2; upper.userData.zombie = this; upper.userData.part = 'limb'; shoulder.add(upper)
    const elbow = new THREE.Group(); elbow.position.y = -0.4; shoulder.add(elbow)
    const lower = new THREE.Mesh(GEO.lowerArm, skin)
    lower.position.y = -0.16
    lower.userData.zombie = this; lower.userData.part = 'limb'; elbow.add(lower)
    const hand = new THREE.Mesh(GEO.hand, skin)
    hand.position.y = -0.36; hand.userData.zombie = this; hand.userData.part = 'limb'
    elbow.add(hand)
    shoulder.rotation.x = -1.05 - Math.random() * 0.5
    shoulder.rotation.z = side * 0.13
    elbow.rotation.x = -0.25 - Math.random() * 0.35
    return { shoulder, elbow, side }
  }

  buildLeg(pants, shoe, side) {
    const hip = new THREE.Group()
    hip.position.set(side * 0.17, -0.12, 0)
    this.hips.add(hip)
    const upper = new THREE.Mesh(GEO.upperLeg, pants)
    upper.position.y = -0.22; upper.userData.zombie = this; upper.userData.part = 'limb'; hip.add(upper)
    const knee = new THREE.Group(); knee.position.y = -0.46; hip.add(knee)
    const lower = new THREE.Mesh(GEO.lowerLeg, pants)
    lower.position.y = -0.18; lower.userData.zombie = this; lower.userData.part = 'limb'; knee.add(lower)
    const foot = new THREE.Mesh(GEO.foot, shoe)
    foot.position.set(0, -0.38, 0.06); foot.userData.zombie = this; foot.userData.part = 'limb'; knee.add(foot)
    return { hip, knee, side }
  }

  get headWorld() {
    const p = new THREE.Vector3(); this.head.getWorldPosition(p); return p
  }

  update(dt) {
    if (this.removed) return
    this.stateTime += dt
    this.flash = Math.max(0, this.flash - dt)
    this.stagger = Math.max(0, this.stagger - dt)
    this.attackCd = Math.max(0, this.attackCd - dt)
    this.groanTimer -= dt
    this.attackAnim = Math.max(0, this.attackAnim - dt * 3.4)

    const flashOn = this.flash > 0
    for (const m of this.flashMats) {
      if (flashOn) m.emissive.setRGB(0.55, 0.05, 0.04)
      else m.emissive.setRGB(0, 0, 0)
    }

    if (this.state === 'dead') { this.updateDeath(dt); return }

    if (this.state === 'spawning') {
      this.body.position.y = -1.2 + Math.min(1, this.stateTime / 0.5) * 1.2
      if (this.stateTime > 0.5) { this.state = 'chase'; this.body.position.y = 0 }
      return
    }

    if (this.groanTimer <= 0) {
      this.groanTimer = 3 + Math.random() * 9
      if (this.pos.distanceTo(this.game.player.pos) < 26) this.game.audio.playZombie(this.pos, this.type)
    }

    this.chooseTarget()
    const target = this.target
    if (!target || target.state === 'dead' || (target.isPartner && target.down)) {
      this.idle(dt)
      return
    }

    const dx = target.pos.x - this.pos.x
    const dz = target.pos.z - this.pos.z
    const dist = Math.hypot(dx, dz)
    const desiredYaw = Math.atan2(dx, dz)
    let yawDiff = desiredYaw - this.yaw
    while (yawDiff > Math.PI) yawDiff -= Math.PI * 2
    while (yawDiff < -Math.PI) yawDiff += Math.PI * 2
    this.yaw += THREE.MathUtils.clamp(yawDiff, -dt * 5, dt * 5)

    const staggered = this.stagger > 0
    const attackRange = (this.type === 'brute' ? 1.9 : 1.45) + this.def.scale * 0.3
    if (dist > attackRange * 0.9 && !staggered) {
      const moveSpeed = this.speed * (this.stagger > 0 ? 0.2 : 1)
      const nx = dx / (dist || 1), nz = dz / (dist || 1)
      const wobble = Math.sin(this.walkPhase * 0.9 + this.id) * 0.22
      const px = nx * Math.cos(wobble) - nz * Math.sin(wobble)
      const pz = nx * Math.sin(wobble) + nz * Math.cos(wobble)
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, px * moveSpeed, 6, dt)
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, pz * moveSpeed, 6, dt)
    } else {
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, 0, 10, dt)
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, 0, 10, dt)
    }

    // separation
    let sx = 0, sz = 0
    for (const other of this.game.zombies) {
      if (other === this || other.state === 'dead' || other.removed) continue
      const ox = this.pos.x - other.pos.x, oz = this.pos.z - other.pos.z
      const d2 = ox * ox + oz * oz
      const min = (this.radius + other.radius) * 0.94
      if (d2 < min * min && d2 > 1e-4) {
        const d = Math.sqrt(d2)
        sx += (ox / d) * (min - d) * 3.2
        sz += (oz / d) * (min - d) * 3.2
      }
    }
    this.pos.x += (this.velocity.x + sx) * dt
    this.pos.z += (this.velocity.z + sz) * dt
    this.game.mall.collide(this.pos, this.radius)

    if (dist <= attackRange && this.attackCd <= 0 && !staggered) {
      this.attackCd = this.def.attackCd * (0.85 + Math.random() * 0.3)
      this.attackAnim = 1
      this.attackTarget = target
      this.game.audio.playZombieAttack(this.pos, this.type)
      setTimeout(() => {
        if (this.state === 'dead' || this.removed) return
        if (this.game.state !== 'playing') return
        if (!this.attackTarget) return
        const t = this.attackTarget
        if (t.state === 'dead' || (t.isPartner && t.down)) return
        const d = Math.hypot(t.pos.x - this.pos.x, t.pos.z - this.pos.z)
        if (d < attackRange + 0.5) {
          t.damage(this.damage, this.pos)
        }
      }, 260)
    }

    this.animate(dt, dist, staggered)
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.group.rotation.y = this.yaw
  }

  idle(dt) {
    this.velocity.multiplyScalar(0.9)
    this.animate(dt, 10, false)
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.group.rotation.y = this.yaw
  }

  chooseTarget() {
    const p = this.game.player
    const partner = this.game.partner
    const candidates = []
    if (p.state === 'alive') candidates.push(p)
    if (partner && !partner.down && partner.state === 'alive') candidates.push(partner)
    if (!candidates.length) { this.target = null; return }
    let best = null, bestD = Infinity
    for (const c of candidates) {
      const d = c.pos.distanceToSquared(this.pos)
      if (d < bestD) { bestD = d; best = c }
    }
    this.target = best
  }

  animate(dt, dist, staggered) {
    const moving = Math.hypot(this.velocity.x, this.velocity.z)
    if (moving > 0.1) this.walkPhase += dt * (2.2 + this.speed * 1.6)
    const walk = this.state === 'chase' || this.state === 'spawning'
    const lunge = this.attackAnim
    const stride = moving > 0.1 ? 0.58 : 0.08
    const s = Math.sin(this.walkPhase)
    this.legL.hip.rotation.x = s * stride
    this.legR.hip.rotation.x = -s * stride
    this.legL.knee.rotation.x = Math.max(0, -s) * 0.7 + 0.16
    this.legR.knee.rotation.x = Math.max(0, s) * 0.7 + 0.16
    this.body.position.y = Math.abs(Math.sin(this.walkPhase * 2)) * 0.045 * (moving > 0.1 ? 1 : 0.2)
    this.body.position.x = Math.sin(this.walkPhase) * 0.02 * (moving > 0.1 ? 1 : 0.2)
    this.body.rotation.z = Math.sin(this.walkPhase) * 0.045
    this.body.rotation.x = (this.type === 'runner' ? 0.16 : 0.08) + (staggered ? -0.25 : 0)
    this.hips.rotation.y = Math.sin(this.walkPhase) * 0.05

    const armBase = this.type === 'runner' ? -1.25 : -0.95
    const armSwing = Math.sin(this.walkPhase + Math.PI) * 0.16
    this.armL.shoulder.rotation.x = armBase + armSwing - lunge * 0.7 + (staggered ? 0.4 : 0)
    this.armR.shoulder.rotation.x = armBase - armSwing - lunge * 0.7 + (staggered ? 0.4 : 0)
    this.armL.shoulder.rotation.z = -0.14 - lunge * 0.18
    this.armR.shoulder.rotation.z = 0.14 + lunge * 0.18
    this.armL.elbow.rotation.x = -0.3 - lunge * 0.3
    this.armR.elbow.rotation.x = -0.3 - lunge * 0.3
    this.headPivot.rotation.x = -0.15 + Math.sin(this.walkPhase * 0.5) * 0.08 - lunge * 0.2
    this.headPivot.rotation.z = Math.sin(this.walkPhase * 0.43) * 0.12
    this.jaw.rotation.x = 0.35 + Math.sin(this.walkPhase * 0.7) * 0.1
    if (this.headless) this.headPivot.visible = false
  }

  takeDamage(amount, part, point, dir, weapon) {
    if (this.state === 'dead' || this.state === 'spawning') return { dead: false, head: false }
    this.hp -= amount
    this.lastAttacker = weapon
    this.flash = 0.11
    this.stagger = Math.min(0.45, this.stagger + (this.type === 'brute' ? 0.05 : 0.18))
    this.velocity.x += dir.x * (this.type === 'brute' ? 0.4 : 1.2)
    this.velocity.z += dir.z * (this.type === 'brute' ? 0.4 : 1.2)
    if (weapon === 'player') {
      if (part === 'head') this.game.player.stats.headshots++
      this.game.player.stats.hits++
    }
    this.game.effects.spawnBlood(point, dir, part === 'head' ? 1.6 : 1)
    if (this.hp <= 0) {
      this.die(part, dir)
      return { dead: true, head: part === 'head' }
    }
    return { dead: false, head: part === 'head' }
  }

  die(part, dir) {
    this.state = 'dead'
    this.deathTimer = 0
    this.velocity.set(dir.x * 1.6, 0, dir.z * 1.6)
    this.game.addKill(this, part === 'head', this.lastAttacker === 'partner')
    if (part === 'head') {
      this.headless = true
      this.headPivot.visible = false
      this.game.effects.spawnHead(this.headWorld, dir)
      this.game.audio.playHeadshot()
    }
    this.game.effects.spawnBlood(this.headWorld, new THREE.Vector3(dir.x, 0.6, dir.z), 3)
    this.game.effects.spawnBlood(new THREE.Vector3(this.pos.x, 1.2, this.pos.z), new THREE.Vector3(dir.x, 0.2, dir.z), 2)
    this.game.effects.spawnBloodDecal(this.pos.x + dir.x * 1.1, this.pos.z + dir.z * 1.1, 1.7 + Math.random() * 1.4)
    this.game.audio.playDeath(this.pos, this.type)
    this.deathTilt = (Math.random() - 0.5) * 0.6
    this.deathSpeed = 2.6 + Math.random()
    this.game.hud.killfeed(this.type, part === 'head')
    // drop supplies
    const roll = Math.random()
    if (roll < 0.17) this.game.spawnPickup('health', this.pos)
    else if (roll < 0.42) this.game.spawnPickup('ammo', this.pos)
  }

  updateDeath(dt) {
    this.deathTimer += dt
    const t = Math.min(1, this.deathTimer / 0.7)
    this.body.rotation.x = this.body.rotation.x + (this.deathTilt - this.body.rotation.x) * Math.min(1, dt * 8)
    const fall = t * t
    this.body.position.y = -fall * 0.85
    this.body.rotation.z = THREE.MathUtils.lerp(this.body.rotation.z, this.deathTilt * 0.8, Math.min(1, dt * 6))
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z)
    if (this.deathTimer > 4.5) {
      this.group.position.y = -(this.deathTimer - 4.5) * 0.5
      if (this.deathTimer > 7) this.remove()
    }
  }

  remove() {
    if (this.removed) return
    this.removed = true
    this.game.scene.remove(this.group)
    for (const m of this.mats) m.dispose()
  }
}
