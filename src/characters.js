import * as THREE from 'three'
import { clamp, damp, dampAngle, resolveCircle, rand, choice } from './utils.js'

const SKIN = [0xc98d6b, 0xa86a4a, 0xe0b090, 0x7c4f38, 0xd8a17e]
const SHIRT = [0x3b4b6b, 0x7a2f38, 0x2f5a4c, 0x6b5a8f, 0xb58a3a, 0x2e2e36]
const PANTS = [0x25303f, 0x33313a, 0x4a3f35, 0x1f2b33]

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

export function createCharacter(opts = {}) {
  const root = new THREE.Group()
  const skin = new THREE.MeshStandardMaterial({
    color: opts.skin ?? choice(SKIN),
    roughness: 0.82
  })
  const shirt = new THREE.MeshStandardMaterial({
    color: opts.shirt ?? choice(SHIRT),
    roughness: 0.86
  })
  const pants = new THREE.MeshStandardMaterial({
    color: opts.pants ?? choice(PANTS),
    roughness: 0.9
  })
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x17181d, roughness: 0.7 })
  const hairMat = new THREE.MeshStandardMaterial({ color: opts.hair ?? 0x1b1512, roughness: 0.9 })

  const torso = box(0.64, 0.76, 0.36, shirt, 0, 1.24, 0)
  root.add(torso)

  const hips = box(0.6, 0.24, 0.34, pants, 0, 0.82, 0)
  root.add(hips)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 14, 12), skin)
  head.position.set(0, 1.79, 0)
  head.castShadow = true
  root.add(head)

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.235, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat)
  hair.position.set(0, 1.8, -0.015)
  root.add(hair)

  if (opts.cap) {
    const capMat = new THREE.MeshStandardMaterial({ color: opts.cap, roughness: 0.75 })
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.25, 0.11, 14), capMat)
    cap.position.set(0, 1.97, 0)
    root.add(cap)
    const brim = box(0.3, 0.05, 0.2, capMat, 0, 1.93, 0.22)
    root.add(brim)
  }

  const armGeo = new THREE.BoxGeometry(0.17, 0.64, 0.19)
  const leftArm = new THREE.Group()
  leftArm.position.set(-0.41, 1.53, 0)
  const leftArmMesh = new THREE.Mesh(armGeo, shirt)
  leftArmMesh.position.y = -0.31
  leftArmMesh.castShadow = true
  leftArm.add(leftArmMesh)
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skin)
  leftHand.position.y = -0.64
  leftArm.add(leftHand)
  root.add(leftArm)

  const rightArm = new THREE.Group()
  rightArm.position.set(0.41, 1.53, 0)
  const rightArmMesh = new THREE.Mesh(armGeo, shirt)
  rightArmMesh.position.y = -0.31
  rightArmMesh.castShadow = true
  rightArm.add(rightArmMesh)
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skin)
  rightHand.position.y = -0.64
  rightArm.add(rightHand)
  root.add(rightArm)

  let gun = null
  if (opts.gun) {
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.35, metalness: 0.75 })
    gun = box(0.09, 0.13, 0.4, gunMat, 0, -0.7, 0.16)
    rightArm.add(gun)
  }

  const legGeo = new THREE.BoxGeometry(0.25, 0.8, 0.27)
  const leftLeg = new THREE.Group()
  leftLeg.position.set(-0.17, 0.86, 0)
  const leftLegMesh = new THREE.Mesh(legGeo, pants)
  leftLegMesh.position.y = -0.4
  leftLegMesh.castShadow = true
  leftLeg.add(leftLegMesh)
  leftLeg.add(box(0.27, 0.12, 0.37, shoeMat, 0, -0.78, 0.05))
  root.add(leftLeg)

  const rightLeg = new THREE.Group()
  rightLeg.position.set(0.17, 0.86, 0)
  const rightLegMesh = new THREE.Mesh(legGeo, pants)
  rightLegMesh.position.y = -0.4
  rightLegMesh.castShadow = true
  rightLeg.add(rightLegMesh)
  rightLeg.add(box(0.27, 0.12, 0.37, shoeMat, 0, -0.78, 0.05))
  root.add(rightLeg)

  const parts = {
    torso,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    gun
  }
  let phase = rand(0, Math.PI * 2)
  let idle = 0

  function animate(dt, speed, mode = 'walk') {
    const moving = speed > 0.15
    if (moving) {
      phase += dt * (3.2 + speed * 1.25)
      const amp = clamp(speed / 6, 0.12, 1) * 0.85
      const swing = Math.sin(phase) * amp
      parts.leftLeg.rotation.x = swing
      parts.rightLeg.rotation.x = -swing
      parts.leftArm.rotation.x = -swing * 0.9
      parts.rightArm.rotation.x = swing * 0.9
      parts.torso.rotation.z = Math.sin(phase) * 0.025
      if (mode === 'aim') {
        parts.rightArm.rotation.x = -1.5
      }
    } else {
      idle += dt
      const breathe = Math.sin(idle * 1.6) * 0.02
      parts.leftLeg.rotation.x = damp(parts.leftLeg.rotation.x, 0, 8, dt)
      parts.rightLeg.rotation.x = damp(parts.rightLeg.rotation.x, 0, 8, dt)
      parts.leftArm.rotation.x = damp(parts.leftArm.rotation.x, breathe, 8, dt)
      parts.rightArm.rotation.x = damp(parts.rightArm.rotation.x, -breathe, 8, dt)
      parts.torso.rotation.z = damp(parts.torso.rotation.z, 0, 8, dt)
    }
    if (mode === 'aim' && !moving) {
      parts.rightArm.rotation.x = damp(parts.rightArm.rotation.x, -1.45, 10, dt)
    }
  }

  return { root, parts, animate, materials: { skin, shirt, pants } }
}

export class Player {
  constructor(scene, world) {
    this.world = world
    this.char = createCharacter({
      shirt: 0x22252d,
      pants: 0x2b3542,
      skin: 0xc98d6b,
      hair: 0x18120f,
      gun: true
    })
    this.root = this.char.root
    this.root.userData.entity = this
    this.root.userData.kind = 'player'
    scene.add(this.root)
    this.pos = new THREE.Vector3(0, 0, 0)
    this.heading = 0
    this.speed = 0
    this.radius = 0.48
    this.velY = 0
    this.onGround = true
    this.health = 100
    this.inCar = null
    this.alive = true
    this.fireCooldown = 0
    this.root.position.copy(this.pos)
  }

  update(dt, keys, camYaw, colliders, analog = null) {
    if (this.inCar || !this.alive) return
    const fwd = new THREE.Vector3(Math.sin(camYaw), 0, Math.cos(camYaw))
    const right = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw))
    const move = new THREE.Vector3()
    let magnitude = 0
    if (analog) {
      move.addScaledVector(fwd, analog.y).addScaledVector(right, analog.x)
      magnitude = Math.min(1, Math.hypot(analog.x, analog.y))
      if (magnitude > 0.12) move.normalize()
      else {
        move.set(0, 0, 0)
        magnitude = 0
      }
    } else {
      if (keys.KeyW) move.add(fwd)
      if (keys.KeyS) move.sub(fwd)
      if (keys.KeyD) move.add(right)
      if (keys.KeyA) move.sub(right)
      magnitude = move.lengthSq() > 0 ? 1 : 0
    }

    const sprint = analog ? analog.sprint : keys.ShiftLeft || keys.ShiftRight
    const targetSpeed = magnitude > 0 ? magnitude * (sprint ? 8.2 : 4.6) : 0
    this.speed = damp(this.speed, targetSpeed, 10, dt)

    if (move.lengthSq() > 0) {
      this.heading = dampAngle(this.heading, Math.atan2(move.x, move.z), 13, dt)
    }

    const step = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading)).multiplyScalar(this.speed * dt)
    this.pos.x += step.x
    this.pos.z += step.z
    const solved = resolveCircle(this.pos.x, this.pos.z, this.radius, colliders)
    this.pos.x = solved.x
    this.pos.z = solved.z
    const b = this.world.city.BOUND
    this.pos.x = clamp(this.pos.x, -b, b)
    this.pos.z = clamp(this.pos.z, -b, b)

    if (keys.Space && this.onGround) {
      this.velY = 7.4
      this.onGround = false
    }
    this.velY -= 22 * dt
    this.pos.y += this.velY * dt
    if (this.pos.y <= 0) {
      this.pos.y = 0
      this.velY = 0
      this.onGround = true
    }

    this.root.position.copy(this.pos)
    this.root.rotation.y = this.heading
    this.char.animate(dt, this.speed)
    if (this.fireCooldown > 0) this.fireCooldown -= dt
  }

  getMuzzle() {
    const fwd = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading))
    const right = new THREE.Vector3(Math.cos(this.heading), 0, -Math.sin(this.heading))
    return this.pos
      .clone()
      .add(new THREE.Vector3(0, 1.3, 0))
      .add(fwd.multiplyScalar(0.45))
      .add(right.multiplyScalar(0.28))
  }
}

export class Pedestrian {
  constructor(scene, world, bx, bz) {
    this.world = world
    this.char = createCharacter({})
    this.root = this.char.root
    this.root.userData.entity = this
    this.root.userData.kind = 'ped'
    scene.add(this.root)
    this.waypoints = this.makeWaypoints(bx, bz)
    this.targetIndex = Math.floor(rand(0, 4))
    this.pos = this.waypoints[this.targetIndex].clone().add(new THREE.Vector3(rand(-1.4, 1.4), 0, rand(-1.4, 1.4)))
    this.targetIndex = (this.targetIndex + 1) % 4
    this.heading = rand(0, Math.PI * 2)
    this.speed = rand(1.0, 1.7)
    this.baseSpeed = this.speed
    this.radius = 0.42
    this.dead = false
    this.deathTimer = 0
    this.fleeing = false
    this.root.position.copy(this.pos)
    this.root.rotation.y = this.heading
  }

  makeWaypoints(bx, bz) {
    const o = 26.5
    return [
      new THREE.Vector3(bx - o, 0, bz - o),
      new THREE.Vector3(bx + o, 0, bz - o),
      new THREE.Vector3(bx + o, 0, bz + o),
      new THREE.Vector3(bx - o, 0, bz + o)
    ]
  }

  die(dir) {
    if (this.dead) return
    this.dead = true
    this.deathTimer = 0
    this.deathDir = dir || new THREE.Vector3(0, 0, 1)
  }

  update(dt, player, wanted, colliders) {
    if (this.dead) {
      this.deathTimer += dt
      this.root.rotation.x = damp(this.root.rotation.x, -Math.PI / 2, 7, dt)
      this.root.position.y = damp(this.root.position.y, 0.26, 7, dt)
      this.root.position.x += this.deathDir.x * dt * 1.5
      this.root.position.z += this.deathDir.z * dt * 1.5
      return
    }

    const toPlayer = new THREE.Vector3().subVectors(player.pos, this.pos)
    toPlayer.y = 0
    const dist = toPlayer.length()
    const playerInCar = !!player.inCar
    const threat = wanted > 0 || (playerInCar && player.inCar.speed > 9 && dist < 18)
    this.fleeing = threat && dist < 26

    let target
    if (this.fleeing) {
      const away = toPlayer.clone().multiplyScalar(-1).normalize()
      target = this.pos.clone().add(away.multiplyScalar(20))
      this.speed = damp(this.speed, 5.0, 4, dt)
    } else {
      target = this.waypoints[this.targetIndex]
      if (this.pos.distanceTo(target) < 2.2) {
        this.targetIndex = (this.targetIndex + 1) % this.waypoints.length
        target = this.waypoints[this.targetIndex]
      }
      this.speed = damp(this.speed, this.baseSpeed, 3, dt)
    }

    const dir = new THREE.Vector3().subVectors(target, this.pos)
    dir.y = 0
    if (dir.lengthSq() > 0.001) {
      dir.normalize()
      this.heading = dampAngle(this.heading, Math.atan2(dir.x, dir.z), 6, dt)
      this.pos.x += dir.x * this.speed * dt
      this.pos.z += dir.z * this.speed * dt
    }
    const solved = resolveCircle(this.pos.x, this.pos.z, this.radius, colliders)
    this.pos.x = solved.x
    this.pos.z = solved.z
    const b = this.world.city.BOUND
    this.pos.x = clamp(this.pos.x, -b, b)
    this.pos.z = clamp(this.pos.z, -b, b)

    this.root.position.copy(this.pos)
    this.root.rotation.y = this.heading
    this.char.animate(dt, this.speed)
  }
}

export class Officer {
  constructor(scene, world, position) {
    this.world = world
    this.char = createCharacter({
      shirt: 0x1c2d52,
      pants: 0x16203a,
      skin: choice(SKIN),
      cap: 0x14213d
    })
    this.root = this.char.root
    this.root.userData.entity = this
    this.root.userData.kind = 'officer'
    scene.add(this.root)
    this.pos = position.clone()
    this.pos.y = 0
    this.heading = 0
    this.speed = 0
    this.radius = 0.45
    this.dead = false
    this.deathTimer = 0
    this.root.position.copy(this.pos)
  }

  die(dir) {
    if (this.dead) return
    this.dead = true
    this.deathTimer = 0
    this.deathDir = dir || new THREE.Vector3(0, 0, 1)
  }

  update(dt, player, colliders) {
    if (this.dead) {
      this.deathTimer += dt
      this.root.rotation.x = damp(this.root.rotation.x, -Math.PI / 2, 7, dt)
      this.root.position.y = damp(this.root.position.y, 0.26, 7, dt)
      return
    }
    const toPlayer = new THREE.Vector3().subVectors(player.pos, this.pos)
    toPlayer.y = 0
    const dist = toPlayer.length()
    if (dist > 1.9) {
      const dir = toPlayer.normalize()
      this.heading = dampAngle(this.heading, Math.atan2(dir.x, dir.z), 9, dt)
      this.speed = damp(this.speed, 6.2, 5, dt)
      this.pos.x += dir.x * this.speed * dt
      this.pos.z += dir.z * this.speed * dt
      const solved = resolveCircle(this.pos.x, this.pos.z, this.radius, colliders)
      this.pos.x = solved.x
      this.pos.z = solved.z
    } else {
      this.speed = damp(this.speed, 0, 8, dt)
    }
    this.root.position.copy(this.pos)
    this.root.rotation.y = this.heading
    this.char.animate(dt, this.speed, 'aim')
  }
}
