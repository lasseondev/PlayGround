import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { glowTexture, signTexture } from '../world/textures.js'

const _v = new THREE.Vector3()
const _v2 = new THREE.Vector3()

export class Partner {
  constructor(game) {
    this.game = game
    this.isPartner = true
    this.pos = new THREE.Vector3(-1.45, 0, 30.7)
    this.velocity = new THREE.Vector3()
    this.yaw = 0
    this.state = 'alive'
    this.down = false
    this.hp = 100
    this.maxHp = 100
    this.lastDamage = 99
    this.fireCd = 0
    this.reviveProgress = 0
    this.speed = 4.4
    this.target = null
    this.aimTimer = 0
    this.walkPhase = Math.random() * 6
    this.talkCd = 12
    this.groanCd = 0
    this.downedTime = 0
    this.radius = 0.36
    this.muzzleFlash = 0
    this.build()
  }

  build() {
    const cloth = new THREE.MeshStandardMaterial({ color: 0x2c332f, roughness: 0.9, metalness: 0.02 })
    const vest = new THREE.MeshStandardMaterial({ color: 0x1c201e, roughness: 0.72, metalness: 0.14 })
    const skin = new THREE.MeshStandardMaterial({ color: 0x9a7158, roughness: 0.78 })
    const gear = new THREE.MeshStandardMaterial({ color: 0x3a3f3a, roughness: 0.65, metalness: 0.2 })
    const metal = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.35, metalness: 0.8 })
    const teal = new THREE.MeshBasicMaterial({ color: 0x57d8d0, toneMapped: false })
    this.mats = [cloth, vest, skin, gear]

    this.group = new THREE.Group()
    this.body = new THREE.Group()
    this.group.add(this.body)
    const add = (geo, mat, x, y, z, parent = this.body) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m
    }

    this.hips = new THREE.Group(); this.hips.position.y = 0.98; this.body.add(this.hips)
    add(new RoundedBoxGeometry(0.52, 0.72, 0.32, 3, 0.08), cloth, 0, 0.38, 0, this.hips)
    const vestMesh = add(new RoundedBoxGeometry(0.58, 0.58, 0.4, 3, 0.07), vest, 0, 0.4, 0.0, this.hips)
    // vest pouches
    for (let i = 0; i < 3; i++) add(new RoundedBoxGeometry(0.13, 0.15, 0.09, 2, 0.02), gear, -0.16 + i * 0.16, 0.3, -0.21, this.hips)
    add(new RoundedBoxGeometry(0.36, 0.24, 0.22, 2, 0.05), gear, 0, 0.36, 0.24, this.hips)
    add(new RoundedBoxGeometry(0.56, 0.16, 0.34, 2, 0.04), gear, 0, 0.02, 0, this.hips)
    // shoulder light
    add(new THREE.SphereGeometry(0.035, 8, 6), teal, -0.3, 0.66, 0.14, this.hips)
    const shoulderGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x57d8d0, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
    shoulderGlow.scale.set(0.24, 0.24, 1); shoulderGlow.position.set(-0.3, 0.66, 0.18); this.hips.add(shoulderGlow)

    this.headPivot = new THREE.Group(); this.headPivot.position.y = 0.88; this.hips.add(this.headPivot)
    add(new THREE.SphereGeometry(0.18, 14, 12), skin, 0, 0, 0, this.headPivot).scale.set(0.92, 1.04, 0.95)
    const helmet = add(new THREE.SphereGeometry(0.2, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), gear, 0, 0.05, 0, this.headPivot)
    helmet.scale.set(1, 0.85, 1.02)
    add(new RoundedBoxGeometry(0.28, 0.08, 0.1, 2, 0.02), metal, 0, 0.02, 0.15, this.headPivot)
    add(new RoundedBoxGeometry(0.05, 0.035, 0.06, 2, 0.01), metal, 0.08, 0.03, -0.19, this.headPivot)

    // arms
    this.armL = this.buildArm(cloth, skin, gear, -1)
    this.armR = this.buildArm(cloth, skin, gear, 1)
    this.legL = this.buildLeg(cloth, gear, -1)
    this.legR = this.buildLeg(cloth, gear, 1)

    // rifle held in hands
    this.rifle = new THREE.Group()
    add(new RoundedBoxGeometry(0.07, 0.09, 0.46, 2, 0.012), metal, 0, 0, 0, this.rifle)
    add(new THREE.CylinderGeometry(0.014, 0.014, 0.26, 8).rotateX(Math.PI / 2), metal, 0, 0.02, -0.34, this.rifle)
    add(new RoundedBoxGeometry(0.055, 0.12, 0.08, 2, 0.01), gear, 0, -0.11, -0.04, this.rifle)
    add(new RoundedBoxGeometry(0.06, 0.07, 0.18, 2, 0.012), cloth, 0, -0.01, 0.3, this.rifle)
    add(new RoundedBoxGeometry(0.035, 0.05, 0.1, 2, 0.008), metal, 0, 0.09, 0.02, this.rifle)
    this.rifle.userData.muzzle = new THREE.Vector3(0, 0.02, -0.48)
    this.rifle.position.set(0.09, 0.32, -0.28)
    this.hips.add(this.rifle)
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffcf87, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
    this.flash.scale.set(0.3, 0.3, 1); this.flash.visible = false; this.rifle.add(this.flash)
    this.flashLight = new THREE.PointLight(0xffc27a, 0, 9, 2); this.rifle.add(this.flashLight)

    // marker
    this.marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTexture('ROOK', { color: '#57d8d0', fontSize: 120, background: 'rgba(0,0,0,0)', border: false, width: 512, height: 128 }), transparent: true, opacity: 0.66, depthTest: false, depthWrite: false, toneMapped: false }))
    this.marker.scale.set(0.58, 0.145, 1)
    this.marker.position.set(0, 2.3, 0)
    this.group.add(this.marker)
    this.marker.renderOrder = 30

    this.group.scale.setScalar(1)
    this.group.position.copy(this.pos)
    this.game.scene.add(this.group)
  }

  buildArm(cloth, skin, gear, side) {
    const shoulder = new THREE.Group(); shoulder.position.set(side * 0.35, 0.62, 0); this.hips.add(shoulder)
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.26, 3, 8), cloth)
    upper.position.y = -0.18; shoulder.add(upper)
    const elbow = new THREE.Group(); elbow.position.y = -0.36; shoulder.add(elbow)
    const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.24, 3, 8), cloth)
    lower.position.y = -0.14; elbow.add(lower)
    const glove = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.16, 0.08, 2, 0.02), gear)
    glove.position.y = -0.32; elbow.add(glove)
    shoulder.rotation.x = -0.85; shoulder.rotation.z = side * 0.2
    elbow.rotation.x = -1.05
    return { shoulder, elbow, side }
  }

  buildLeg(cloth, gear, side) {
    const hip = new THREE.Group(); hip.position.set(side * 0.16, -0.12, 0); this.hips.add(hip)
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.3, 3, 8), cloth)
    upper.position.y = -0.2; hip.add(upper)
    const knee = new THREE.Group(); knee.position.y = -0.44; hip.add(knee)
    const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.3, 3, 8), cloth)
    lower.position.y = -0.16; knee.add(lower)
    const boot = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.14, 0.3, 2, 0.02), gear)
    boot.position.set(0, -0.36, 0.05); knee.add(boot)
    return { hip, knee, side }
  }

  reset() {
    this.pos.set(-1.45, 0, 30.7)
    this.velocity.set(0, 0, 0)
    this.hp = this.maxHp
    this.state = 'alive'
    this.down = false
    this.reviveProgress = 0
    this.lastDamage = 99
    this.fireCd = 0.5
    this.group.visible = true
    this.hips.rotation.set(0, 0, 0)
    this.body.position.y = 0
    this.body.rotation.set(0, 0, 0)
    this.marker.material.opacity = 0.66
    this.game.hud?.updatePartner(this)
  }

  update(dt, input) {
    if (!this.group.visible) return
    this.lastDamage += dt
    this.fireCd = Math.max(0, this.fireCd - dt)
    this.talkCd -= dt
    this.muzzleFlash = Math.max(0, this.muzzleFlash - dt)
    if (this.muzzleFlash <= 0) { this.flash.visible = false; this.flashLight.intensity = 0 }
    else {
      this.flash.visible = true
      const s = this.muzzleFlash / 0.05
      this.flash.material.opacity = s
      this.flash.scale.setScalar(0.22 + (1 - s) * 0.1)
      this.flashLight.intensity = 12 * s
    }

    if (this.state === 'down') {
      this.downedTime += dt
      this.updateDown(dt, input)
      this.group.position.copy(this.pos)
      return
    }

    if (this.hp < this.maxHp && this.lastDamage > 7) this.hp = Math.min(this.maxHp, this.hp + dt * 7)

    const player = this.game.player
    let moveTarget = null
    let distPlayer = this.pos.distanceTo(player.pos)
    this.findTarget()

    const combat = this.target && this.target.state !== 'dead' && !this.target.removed && this.target.pos.distanceTo(this.pos) < 30
    if (combat) {
      const t = this.target
      const d = t.pos.distanceTo(this.pos)
      const desiredYaw = Math.atan2(t.pos.x - this.pos.x, t.pos.z - this.pos.z)
      this.turnToward(desiredYaw, dt, 9)
      if (d > 6 && d < 9.5 && distPlayer < 7.5) {
        moveTarget = { x: t.pos.x, z: t.pos.z, stop: 6.5 }
      } else if (distPlayer > 6.5) {
        moveTarget = { x: player.pos.x + 1.7, z: player.pos.z - 0.8, stop: 2.4 }
      }
      if (this.fireCd <= 0 && d < 28) this.shoot(t)
      if (this.talkCd <= 0) {
        this.talkCd = 14 + Math.random() * 16
        this.game.hud.subtitle('ROOK', this.pickLine(), 2.2)
      }
    } else {
      this.target = null
      if (distPlayer > 3.2) {
        const side = Math.sin(this.game.time * 0.6) * 0.45
        const fwdX = -Math.sin(player.yaw), fwdZ = -Math.cos(player.yaw)
        const rightX = Math.cos(player.yaw), rightZ = -Math.sin(player.yaw)
        const bx = player.pos.x + fwdX * 2.8 + rightX * (-2.1 + side)
        const bz = player.pos.z + fwdZ * 2.8 + rightZ * (-2.1 + side)
        moveTarget = { x: bx, z: bz, stop: 1.9 }
      } else if (distPlayer < 1.7) {
        const ax = this.pos.x - player.pos.x, az = this.pos.z - player.pos.z
        const d = Math.hypot(ax, az) || 1
        moveTarget = { x: this.pos.x + (ax / d) * 1.6, z: this.pos.z + (az / d) * 1.6, stop: 0.2 }
      }
      if (!moveTarget) this.turnToward(player.yaw, dt, 4)
      if (this.talkCd <= 0 && distPlayer < 6 && Math.random() < 0.5) {
        this.talkCd = 22 + Math.random() * 24
        this.game.hud.subtitle('ROOK', ['Stay sharp.', 'I hear them in the vents.', 'Ammo check?', 'This place gives me the creeps.'][Math.floor(Math.random() * 4)], 2)
      }
    }

    if (moveTarget) {
      const dx = moveTarget.x - this.pos.x, dz = moveTarget.z - this.pos.z
      const d = Math.hypot(dx, dz)
      if (d > moveTarget.stop) {
        const sp = this.speed * (combat ? 0.72 : 1)
        this.velocity.x = THREE.MathUtils.damp(this.velocity.x, (dx / d) * sp, 8, dt)
        this.velocity.z = THREE.MathUtils.damp(this.velocity.z, (dz / d) * sp, 8, dt)
        if (!combat) this.turnToward(Math.atan2(dx, dz), dt, 6)
      } else {
        this.velocity.x = THREE.MathUtils.damp(this.velocity.x, 0, 10, dt)
        this.velocity.z = THREE.MathUtils.damp(this.velocity.z, 0, 10, dt)
      }
    } else {
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, 0, 10, dt)
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, 0, 10, dt)
    }

    // keep out of the player's body
    const pdx = this.pos.x - player.pos.x, pdz = this.pos.z - player.pos.z
    const pd = Math.hypot(pdx, pdz)
    if (pd < 1.25 && pd > 0.001) {
      this.pos.x += (pdx / pd) * (1.25 - pd) * 0.7
      this.pos.z += (pdz / pd) * (1.25 - pd) * 0.7
    }
    this.pos.x += this.velocity.x * dt
    this.pos.z += this.velocity.z * dt
    this.game.mall.collide(this.pos, this.radius)
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.group.rotation.y = this.yaw
    this.animate(dt, combat)
    this.game.hud?.updatePartner(this)
  }

  updateDown(dt, input) {
    this.velocity.set(0, 0, 0)
    this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, 0.15, 5, dt)
    this.body.position.y = THREE.MathUtils.damp(this.body.position.y, -0.58, 6, dt)
    this.body.rotation.z = THREE.MathUtils.damp(this.body.rotation.z, 0.2, 4, dt)
    this.headPivot.rotation.x = 0.35
    this.marker.material.opacity = 0.28 + Math.sin(this.game.time * 6) * 0.2
    this.marker.material.color.setHex(0xff3b2f)
    this.flash.visible = false; this.flashLight.intensity = 0

    const player = this.game.player
    const d = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z)
    if (d < 2.4 && player.state === 'alive') {
      if (input.down('KeyE')) {
        this.reviveProgress += dt / 2.4
        this.game.audio.playReviveTick()
        if (this.reviveProgress >= 1) this.revive()
      } else {
        this.reviveProgress = Math.max(0, this.reviveProgress - dt * 0.6)
      }
    } else {
      this.reviveProgress = Math.max(0, this.reviveProgress - dt * 0.8)
    }
    this.game.hud?.updatePartner(this)
  }

  revive() {
    this.state = 'alive'
    this.down = false
    this.hp = 55
    this.reviveProgress = 0
    this.body.position.y = 0
    this.body.rotation.set(0, 0, 0)
    this.hips.rotation.set(0, 0, 0)
    this.headPivot.rotation.set(0, 0, 0)
    this.marker.material.color.setHex(0x57d8d0)
    this.marker.material.opacity = 0.66
    this.game.hud.subtitle('ROOK', "I owe you one. Let's finish this.", 2.4)
    this.game.audio.playRevive()
    this.game.hud.updatePartner(this)
  }

  damage(amount, source) {
    if (this.state !== 'alive' || this.down) return
    this.hp -= amount
    this.lastDamage = 0
    this.game.audio.playPartnerHurt()
    if (this.hp <= 0) {
      this.hp = 0
      this.goDown(source)
    }
    this.game.hud.updatePartner(this)
  }

  goDown(source) {
    this.state = 'down'
    this.down = true
    this.reviveProgress = 0
    this.downedTime = 0
    this.target = null
    this.game.hud.subtitle('ROOK', "I'm hit — I'm down! Get to me!", 3)
    this.game.audio.playPartnerDown()
    this.game.hud.updatePartner(this)
  }

  findTarget() {
    let best = null, bestD = 30 * 30
    for (const z of this.game.zombies) {
      if (z.state === 'dead' || z.removed) continue
      const d = z.pos.distanceToSquared(this.pos)
      if (d < bestD) { bestD = d; best = z }
    }
    this.target = best
  }

  shoot(target) {
    this.fireCd = 0.48 + Math.random() * 0.22
    this.muzzleFlash = 0.05
    const muzzle = new THREE.Vector3()
    this.rifle.updateWorldMatrix(true, false)
    muzzle.copy(this.rifle.userData.muzzle)
    this.rifle.localToWorld(muzzle)
    const hitChance = 0.82
    const hit = Math.random() < hitChance
    const aimPoint = new THREE.Vector3(target.pos.x, 1.15 + Math.random() * 0.4, target.pos.z)
    if (!hit) aimPoint.add(new THREE.Vector3((Math.random() - .5) * 1.6, Math.random() * 0.7, (Math.random() - .5) * 1.6))
    this.game.effects.spawnTracer(muzzle, aimPoint, 0x9fe6dd)
    this.game.audio.playPartnerShot(this.pos)
    if (hit) {
      const dir = aimPoint.clone().sub(this.pos).normalize()
      target.takeDamage(15 + Math.random() * 8, 'torso', aimPoint, dir, 'partner')
    }
  }

  pickLine() {
    const lines = ['Contact, left side!', 'Dropping them.', 'Reloading soon — cover me.', 'They keep coming.', 'Headshots, make them count.']
    return lines[Math.floor(Math.random() * lines.length)]
  }

  turnToward(yaw, dt, speed) {
    let d = yaw - this.yaw
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    this.yaw += THREE.MathUtils.clamp(d, -dt * speed, dt * speed)
  }

  animate(dt, combat) {
    const moving = Math.hypot(this.velocity.x, this.velocity.z)
    if (moving > 0.2) this.walkPhase += dt * (5.4 + moving * 0.4)
    const s = Math.sin(this.walkPhase)
    const stride = moving > 0.2 ? 0.5 : 0.03
    this.legL.hip.rotation.x = s * stride
    this.legR.hip.rotation.x = -s * stride
    this.legL.knee.rotation.x = Math.max(0, -s) * 0.55 + 0.08
    this.legR.knee.rotation.x = Math.max(0, s) * 0.55 + 0.08
    this.body.position.y = Math.abs(Math.sin(this.walkPhase * 2)) * 0.035 * (moving > 0.2 ? 1 : 0.2) + Math.sin(this.game.time * 1.7) * 0.005
    this.body.rotation.z = Math.sin(this.walkPhase) * 0.02
    if (combat) {
      this.armL.shoulder.rotation.x = -1.35
      this.armR.shoulder.rotation.x = -1.15
      this.armL.elbow.rotation.x = -0.7
      this.armR.elbow.rotation.x = -0.95
      this.rifle.rotation.x = 0
      this.rifle.rotation.z = 0.02
    } else {
      this.armL.shoulder.rotation.x = -0.85 + Math.sin(this.walkPhase) * 0.12
      this.armR.shoulder.rotation.x = -0.85 - Math.sin(this.walkPhase) * 0.12
      this.armL.elbow.rotation.x = -1.05
      this.armR.elbow.rotation.x = -1.05
      this.rifle.rotation.x = 0.15
    }
    this.headPivot.rotation.y = Math.sin(this.game.time * 0.4) * 0.18
    this.headPivot.rotation.x = combat ? -0.06 : 0
  }
}
