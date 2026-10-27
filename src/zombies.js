import * as THREE from 'three'
import { resolveCollisions } from './world.js'

const G = {
  torso: new THREE.BoxGeometry(0.62, 0.78, 0.36),
  head: new THREE.SphereGeometry(0.22, 14, 12),
  jaw: new THREE.BoxGeometry(0.18, 0.1, 0.16),
  arm: new THREE.BoxGeometry(0.15, 0.62, 0.16),
  hand: new THREE.BoxGeometry(0.14, 0.16, 0.13),
  leg: new THREE.BoxGeometry(0.19, 0.82, 0.21),
  foot: new THREE.BoxGeometry(0.2, 0.11, 0.32),
  eye: new THREE.SphereGeometry(0.032, 8, 6),
  blob: new THREE.CircleGeometry(0.55, 16)
}

const SKIN = [0x68765f, 0x747a67, 0x5d6c55, 0x797864, 0x647065, 0x59675d]
const SHIRT = [0x3c4852, 0x4d3e34, 0x3d4a3e, 0x55424a, 0x2f3d48, 0x4a4636, 0x5a3b33, 0x33424a]
const PANTS = [0x22282e, 0x2c3036, 0x272b31, 0x1f2429, 0x33302a]

const blobTex = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 32)
  g.addColorStop(0, 'rgba(0,0,0,.55)')
  g.addColorStop(0.6, 'rgba(0,0,0,.24)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
})()

const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false })

let decalMat = null
const decalGeo = new THREE.CircleGeometry(1, 16)

function makeZombie(type, rand) {
  const scale = type === 'brute' ? 1.42 : type === 'runner' ? 0.94 : 0.92 + rand() * 0.18
  const g = new THREE.Group()
  g.scale.setScalar(scale)
  g.rotation.y = rand() * Math.PI * 2

  const skinColor = type === 'brute' ? 0x6b5a52 : SKIN[Math.floor(rand() * SKIN.length)]
  const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.95, metalness: 0.01, emissive: 0x0a0f0a, emissiveIntensity: 0.3 })
  const shirt = new THREE.MeshStandardMaterial({ color: SHIRT[Math.floor(rand() * SHIRT.length)], roughness: 0.9, metalness: 0.0, emissive: 0x070a0c, emissiveIntensity: 0.4 })
  const pants = new THREE.MeshStandardMaterial({ color: PANTS[Math.floor(rand() * PANTS.length)], roughness: 0.9 })
  const eyeMat = new THREE.MeshBasicMaterial({ color: type === 'runner' ? 0xff3a1e : type === 'brute' ? 0xff8a2e : 0xd2f26a })
  const flashable = [skin, shirt, pants]

  const body = new THREE.Group()
  body.position.y = 0
  g.add(body)

  const torso = new THREE.Mesh(G.torso, shirt)
  torso.position.y = 1.12
  torso.castShadow = false
  body.add(torso)

  // ribs / chest gore
  const gore = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.03), new THREE.MeshStandardMaterial({ color: 0x4b0d0b, roughness: 1 }))
  gore.position.set(0.06, 1.1, 0.19)
  body.add(gore)

  const head = new THREE.Group()
  head.position.y = 1.62
  body.add(head)
  const skull = new THREE.Mesh(G.head, skin)
  skull.scale.set(0.94, 1.05, 0.98)
  head.add(skull)
  const jaw = new THREE.Mesh(G.jaw, skin)
  jaw.position.set(0, -0.13, 0.13)
  jaw.rotation.x = 0.5
  head.add(jaw)
  const eyeL = new THREE.Mesh(G.eye, eyeMat)
  eyeL.position.set(-0.075, 0.035, 0.2)
  head.add(eyeL)
  const eyeR = new THREE.Mesh(G.eye, eyeMat)
  eyeR.position.set(0.075, 0.035, 0.2)
  head.add(eyeR)

  function limb(geo, mat, x, y, z, offsetY) {
    const pivot = new THREE.Group()
    pivot.position.set(x, y, z)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.y = offsetY
    if (geo === G.leg) {
      const foot = new THREE.Mesh(G.foot, mat)
      foot.position.set(0, -0.44, 0.06)
      mesh.add(foot)
    }
    if (geo === G.arm) {
      const hand = new THREE.Mesh(G.hand, skin)
      hand.position.set(0, -0.37, 0)
      mesh.add(hand)
    }
    pivot.add(mesh)
    return { pivot, mesh }
  }

  const armL = limb(G.arm, skin, -0.39, 1.4, 0, -0.3)
  const armR = limb(G.arm, skin, 0.39, 1.4, 0, -0.3)
  const legL = limb(G.leg, pants, -0.17, 0.86, 0, -0.41)
  const legR = limb(G.leg, pants, 0.17, 0.86, 0, -0.41)
  body.add(armL.pivot, armR.pivot, legL.pivot, legR.pivot)
  armL.pivot.rotation.x = -1.15
  armR.pivot.rotation.x = -1.25

  if (type === 'brute') {
    torso.scale.set(1.25, 1.15, 1.25)
    head.scale.setScalar(1.1)
    armL.mesh.scale.set(1.4, 1.1, 1.4)
    armR.mesh.scale.set(1.4, 1.1, 1.4)
  }
  if (type === 'runner') {
    body.rotation.x = -0.12
    armL.pivot.rotation.x = -1.45
    armR.pivot.rotation.x = -1.35
  }
  if (rand() > 0.82 && type !== 'brute') {
    armL.pivot.visible = false
  }

  const blob = new THREE.Mesh(G.blob, blobMat)
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.02
  blob.scale.setScalar(1.0)
  g.add(blob)

  return { group: g, body, head, armL, armR, legL, legR, skin, shirt, pants, flashable, eyeMat, scale }
}

export class ZombieManager {
  constructor(scene, particles, audio, world, callbacks = {}) {
    this.scene = scene
    this.particles = particles
    this.audio = audio
    this.world = world
    this.callbacks = callbacks
    this.zombies = []
    this.decals = []
    if (!decalMat) decalMat = new THREE.MeshBasicMaterial({ color: 0x240604, transparent: true, opacity: 0.55, depthWrite: false })
  }

  spawn(type, point, rand = Math.random) {
    const model = makeZombie(type, rand)
    const z = {
      ...model,
      type,
      pos: model.group.position,
      hp: type === 'brute' ? 620 : type === 'runner' ? 72 : 108,
      maxHp: type === 'brute' ? 620 : type === 'runner' ? 72 : 108,
      speed: type === 'brute' ? 1.25 : type === 'runner' ? 3.75 : 1.95,
      damage: type === 'brute' ? 34 : type === 'runner' ? 9 : 14,
      radius: type === 'brute' ? 0.62 : 0.42,
      attackRange: type === 'brute' ? 2.0 : 1.45,
      state: 'spawning',
      spawnT: 0,
      attackCd: 0.4 + rand() * 0.8,
      phase: rand() * Math.PI * 2,
      hitFlash: 0,
      lunge: 0,
      deathT: 0,
      dyingT: 0,
      fallDir: rand() > 0.5 ? 1 : -1,
      target: null,
      retarget: 0,
      groanCd: 1 + rand() * 6,
      alive: true
    }
    z.manager = this
    z.group.position.set(point.x + (rand() - 0.5) * 1.8, -1.7, point.z + (rand() - 0.5) * 1.8)
    z.spawnBaseY = 0
    this.scene.add(z.group)
    this.zombies.push(z)
    this.particles.dust(new THREE.Vector3(z.pos.x, 0.15, z.pos.z), 8, 0x6c5a4a)
    return z
  }

  get alive() { return this.zombies.filter(z => z.alive) }

  countAlive() {
    let n = 0
    for (const z of this.zombies) if (z.alive) n++
    return n
  }

  restoreFlash(z) {
    for (const m of z.flashable) {
      if (!m.emissive) continue
      m.emissive.setHex(m.userData.baseEmissive ?? 0)
      m.emissiveIntensity = m.userData.baseIntensity ?? 1
    }
    z.hitFlash = 0
  }

  hurt(z, damage, headshot, dir, source) {
    if (!z.alive) return false
    z.hp -= damage
    z.hitFlash = 0.09
    for (const m of z.flashable) {
      if (m.userData.baseEmissive === undefined) {
        m.userData.baseEmissive = m.emissive ? m.emissive.getHex() : 0
        m.userData.baseIntensity = m.emissiveIntensity ?? 1
      }
      if (m.emissive) { m.emissive.setHex(0xff2200); m.emissiveIntensity = 1.2 }
    }
    const point = new THREE.Vector3(z.pos.x, 1.1 * z.scale, z.pos.z)
    this.particles.blood(point, dir || new THREE.Vector3(0, 0.4, 1), headshot ? 22 : 12, headshot ? 4.5 : 3)
    if (z.hp <= 0) {
      this.kill(z, headshot, dir, source)
      return true
    }
    if (z.type !== 'brute') {
      z.pos.x += dir.x * 0.12
      z.pos.z += dir.z * 0.12
    }
    return false
  }

  kill(z, headshot, dir, source) {
    this.restoreFlash(z)
    z.alive = false
    z.state = 'dying'
    z.dyingT = 0
    z.deathT = 0
    z.lunge = 0
    z.fallDir = dir && dir.x < 0 ? -1 : 1
    this.audio.kill()
    const point = new THREE.Vector3(z.pos.x, 0.9 * z.scale, z.pos.z)
    this.particles.blood(point, new THREE.Vector3(0, 1, 0), 26, 5)
    if (dir) {
      z.pos.x += dir.x * 0.5
      z.pos.z += dir.z * 0.5
    }
    this.addDecal(z.pos.x, z.pos.z, z.scale)
    if (this.callbacks.onKilled) this.callbacks.onKilled(z, headshot, source)
  }

  addDecal(x, z, scale) {
    const d = new THREE.Mesh(decalGeo, decalMat)
    d.rotation.x = -Math.PI / 2
    d.scale.set((0.34 + Math.random() * 0.5) * scale, (0.26 + Math.random() * 0.38) * scale, 1)
    d.position.set(x + (Math.random() - 0.5) * 0.8, 0.022 + this.decals.length * 0.0001, z + (Math.random() - 0.5) * 0.8)
    this.scene.add(d)
    this.decals.push(d)
    if (this.decals.length > 30) {
      const old = this.decals.shift()
      this.scene.remove(old)
    }
  }

  update(dt, targets, time) {
    const aliveTargets = targets.filter(t => t && t.alive)
    const list = this.zombies
    for (let i = list.length - 1; i >= 0; i--) {
      const z = list[i]
      if (z.state === 'dead') {
        this.scene.remove(z.group)
        z.flashable.forEach(m => m.dispose())
        z.eyeMat.dispose()
        list.splice(i, 1)
        continue
      }
      if (z.state === 'spawning') {
        z.spawnT += dt
        const t = Math.min(1, z.spawnT / 0.65)
        z.pos.y = -1.7 + 1.7 * (1 - Math.pow(1 - t, 3))
        if (t >= 1) { z.state = 'alive'; z.pos.y = 0 }
        continue
      }
      if (z.state === 'dying') {
        z.dyingT += dt
        const t = Math.min(1, z.dyingT / 0.75)
        z.body.rotation.x = -t * t * (Math.PI / 2) * 0.92 * z.fallDir
        z.body.position.y = -t * 0.12
        z.armL.pivot.rotation.x = -1.1 - t * 0.5
        z.armR.pivot.rotation.x = -1.2 - t * 0.4
        z.deathT += dt
        if (z.deathT > 1.4) {
          z.body.position.y -= dt * 0.35
          z.group.scale.setScalar(z.scale * Math.max(0.01, 1 - (z.deathT - 1.4) * 0.28))
          if (z.deathT > 3.4) z.state = 'dead'
        }
        continue
      }

      // hit flash decay
      if (z.hitFlash > 0) {
        z.hitFlash -= dt
        if (z.hitFlash <= 0) this.restoreFlash(z)
      }

      // retarget
      z.retarget -= dt
      if (z.retarget <= 0 || !z.target || !z.target.alive) {
        let best = null, bestD = Infinity
        for (const t of aliveTargets) {
          const d = (t.pos.x - z.pos.x) ** 2 + (t.pos.z - z.pos.z) ** 2
          const bias = t.isPlayer ? 0.8 : 1.1
          if (d * bias < bestD) { bestD = d * bias; best = t }
        }
        z.target = best
        z.retarget = 0.5 + Math.random() * 0.8
      }

      const target = z.target
      if (!target) { this.animate(z, dt, 0, time); continue }
      let dx = target.pos.x - z.pos.x
      let dz = target.pos.z - z.pos.z
      let dist = Math.hypot(dx, dz)
      const nx = dx / (dist || 1), nz = dz / (dist || 1)

      // steer around circles
      let steerX = 0, steerZ = 0
      for (const c of this.world.colliders) {
        if (c.type === 'circle') {
          const ox = z.pos.x - c.x, oz = z.pos.z - c.z
          const od = Math.hypot(ox, oz)
          const infl = c.r + z.radius + 2.2
          if (od < infl && od > 0.001) {
            const strength = (1 - od / infl) * 1.5
            steerX += (ox / od) * strength
            steerZ += (oz / od) * strength
            const cross = nx * (oz / od) - nz * (ox / od)
            const sign = cross > 0 ? 1 : -1
            steerX += (-oz / od) * sign * strength * 1.3
            steerZ += (ox / od) * sign * strength * 1.3
          }
        }
      }

      // separation
      for (const other of list) {
        if (other === z || !other.alive || other.state === 'spawning') continue
        const sx = z.pos.x - other.pos.x, sz = z.pos.z - other.pos.z
        const sd = Math.hypot(sx, sz)
        const min = z.radius + other.radius + 0.15
        if (sd < min && sd > 0.001) {
          const push = (1 - sd / min) * 1.6
          steerX += (sx / sd) * push
          steerZ += (sz / sd) * push
        }
      }

      let moveX = nx + steerX
      let moveZ = nz + steerZ
      const ml = Math.hypot(moveX, moveZ) || 1
      moveX /= ml; moveZ /= ml

      const inRange = dist < z.attackRange
      let speed = z.speed
      if (inRange) speed = 0
      if (z.lunge > 0) { z.lunge -= dt; speed *= 0.2 }

      if (speed > 0) {
        z.pos.x += moveX * speed * dt
        z.pos.z += moveZ * speed * dt
        resolveCollisions(z.pos, z.radius, this.world.colliders, this.world.bounds)
      }

      // face movement or target
      const faceX = inRange ? nx : moveX
      const faceZ = inRange ? nz : moveZ
      const targetRot = Math.atan2(faceX, faceZ)
      let diff = targetRot - z.group.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      z.group.rotation.y += diff * Math.min(1, dt * 7)

      z.attackCd -= dt
      if (inRange && z.attackCd <= 0 && target.alive) {
        z.attackCd = z.type === 'runner' ? 0.75 : z.type === 'brute' ? 1.7 : 1.15
        z.lunge = 0.32
        if (target.onZombieHit) target.onZombieHit(z.damage, z)
      }

      this.animate(z, dt, speed, time)
      z.groanCd -= dt
      if (z.groanCd <= 0) {
        z.groanCd = 4 + Math.random() * 9
      }
    }
  }

  animate(z, dt, speed, time) {
    const sp = z.type === 'runner' ? 11 : z.type === 'brute' ? 4.2 : 6.4
    z.phase += dt * (speed > 0.1 ? sp : 1.2)
    const swing = Math.sin(z.phase)
    const swing2 = Math.cos(z.phase)
    const amp = z.type === 'runner' ? 0.75 : z.type === 'brute' ? 0.34 : 0.5
    z.legL.pivot.rotation.x = swing * amp * (speed > 0.1 ? 1 : 0.12)
    z.legR.pivot.rotation.x = -swing * amp * (speed > 0.1 ? 1 : 0.12)
    z.armL.pivot.rotation.x = -1.15 + swing2 * 0.24 + (z.lunge > 0 ? -0.9 : 0)
    z.armR.pivot.rotation.x = -1.25 - swing2 * 0.24 + (z.lunge > 0 ? -0.9 : 0)
    z.armL.pivot.rotation.z = -0.08
    z.armR.pivot.rotation.z = 0.08
    z.body.position.y = Math.abs(swing) * 0.045 * (speed > 0.1 ? 1 : 0.2)
    z.head.rotation.z = Math.sin(time * 0.7 + z.phase) * 0.12
    z.head.rotation.x = 0.1 + Math.sin(time * 0.9 + z.phase) * 0.05
    if (z.lunge > 0) {
      const l = 1 - z.lunge / 0.32
      z.body.rotation.x = -Math.sin(l * Math.PI) * 0.3
    } else {
      z.body.rotation.x += (0 - z.body.rotation.x) * Math.min(1, dt * 6)
    }
  }

  clear() {
    for (const z of this.zombies) {
      this.scene.remove(z.group)
      z.flashable.forEach(m => m.dispose())
      z.eyeMat.dispose()
    }
    this.zombies.length = 0
    for (const d of this.decals) this.scene.remove(d)
    this.decals.length = 0
  }
}
