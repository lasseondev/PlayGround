import * as THREE from 'three'
import { clamp, damp, resolveCircle, rand, choice } from './utils.js'

const PAINT = [
  0xd9473f, 0x2f6fd0, 0xf0c341, 0x2fa36b, 0xe8e4da, 0x20232b, 0x8c4bd1,
  0xef7d32, 0x3aa7b8, 0x9b2d3f, 0x4a5a6b, 0xc8cbd1
]

const glassMat = new THREE.MeshStandardMaterial({
  color: 0x0e1620,
  roughness: 0.12,
  metalness: 0.75,
  emissive: 0x0a1522,
  emissiveIntensity: 0.6
})
const darkMat = new THREE.MeshStandardMaterial({ color: 0x121318, roughness: 0.6, metalness: 0.4 })
const tireMat = new THREE.MeshStandardMaterial({ color: 0x0d0e12, roughness: 0.92 })
const hubMat = new THREE.MeshStandardMaterial({ color: 0xa8adb8, roughness: 0.3, metalness: 0.9 })

function makeWheel(radius, width) {
  const group = new THREE.Group()
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 16), tireMat)
  tire.rotation.z = Math.PI / 2
  tire.castShadow = true
  group.add(tire)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.56, radius * 0.56, width + 0.015, 10), hubMat)
  hub.rotation.z = Math.PI / 2
  group.add(hub)
  return group
}

function makePoliceDecal() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 128)
  ctx.fillStyle = '#0a0d14'
  ctx.font = '900 86px "Arial Black", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('POLICE', 256, 66)
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 82px "Arial Black", Impact, sans-serif'
  ctx.fillText('POLICE', 256, 60)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createCarMesh(opts = {}) {
  const type = opts.type || 'sedan'
  const police = !!opts.police
  const color = police ? 0xe9ebf0 : opts.color ?? choice(PAINT)
  const paint = new THREE.MeshStandardMaterial({
    color,
    roughness: type === 'sports' ? 0.32 : 0.45,
    metalness: 0.55
  })
  const trim = new THREE.MeshStandardMaterial({ color: 0x1a1b20, roughness: 0.55, metalness: 0.35 })
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfff3d0,
    emissive: 0xffe9b0,
    emissiveIntensity: 2.6,
    roughness: 0.2
  })
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff2b2b,
    emissive: 0xff1a1a,
    emissiveIntensity: 2.2,
    roughness: 0.3
  })

  let L = 4.35
  let W = 1.88
  let bodyH = 0.56
  let cabinH = 0.52
  let cabinL = 2.0
  let wheelR = 0.35
  let wheelZ = 1.36
  let bodyY = 0.67
  let cabinY = 1.18
  let roofY = 1.45
  if (type === 'sports') {
    L = 4.55
    W = 2.0
    bodyH = 0.44
    cabinH = 0.4
    cabinL = 1.72
    wheelR = 0.34
    wheelZ = 1.44
    bodyY = 0.58
    cabinY = 1.0
    roofY = 1.21
  } else if (type === 'suv') {
    L = 4.65
    W = 1.98
    bodyH = 0.62
    cabinH = 0.68
    cabinL = 2.35
    wheelR = 0.42
    wheelZ = 1.45
    bodyY = 0.76
    cabinY = 1.4
    roofY = 1.75
  }

  const group = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(W, bodyH, L), paint)
  body.position.y = bodyY
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const skirt = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.2, L - 0.5), trim)
  skirt.position.y = bodyY - bodyH / 2 - 0.06
  skirt.castShadow = true
  group.add(skirt)

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.82, cabinH, cabinL), glassMat)
  cabin.position.set(0, cabinY, -0.16)
  cabin.castShadow = true
  group.add(cabin)

  const roof = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, 0.09, cabinL * 0.86), paint)
  roof.position.set(0, roofY, -0.16)
  roof.castShadow = true
  group.add(roof)

  const hood = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, 0.09, L * 0.26), paint)
  hood.position.set(0, bodyY + bodyH / 2 + 0.01, L * 0.28)
  group.add(hood)

  for (const side of [-1, 1]) {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.24), paint)
    mirror.position.set(side * (W / 2 + 0.07), cabinY + 0.06, cabinL * 0.35)
    group.add(mirror)
  }

  const bumperFront = new THREE.Mesh(new THREE.BoxGeometry(W + 0.05, 0.2, 0.22), trim)
  bumperFront.position.set(0, bodyY - 0.08, L / 2 + 0.03)
  group.add(bumperFront)
  const bumperRear = bumperFront.clone()
  bumperRear.position.z = -L / 2 - 0.03
  group.add(bumperRear)

  for (const side of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.08), headMat)
    head.position.set(side * W * 0.29, bodyY + 0.08, L / 2 + 0.06)
    group.add(head)
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.15, 0.08), tailMat)
    tail.position.set(side * W * 0.29, bodyY + 0.08, -L / 2 - 0.06)
    group.add(tail)
  }

  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.16),
    new THREE.MeshStandardMaterial({ color: 0xdadde4, roughness: 0.5 })
  )
  plate.position.set(0, bodyY - 0.1, L / 2 + 0.15)
  group.add(plate)

  if (type === 'sports') {
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, 0.07, 0.46), trim)
    spoiler.position.set(0, roofY + 0.03, -L / 2 + 0.32)
    spoiler.castShadow = true
    group.add(spoiler)
    for (const side of [-1, 1]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.12), trim)
      strut.position.set(side * W * 0.32, roofY - 0.11, -L / 2 + 0.32)
      group.add(strut)
    }
  }

  let lightBar = null
  let sirenLight = null
  let redMat = null
  let blueMat = null
  if (police) {
    const barBase = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.09, 0.3), trim)
    barBase.position.set(0, roofY + 0.09, -0.15)
    group.add(barBase)
    redMat = new THREE.MeshStandardMaterial({
      color: 0xff2020,
      emissive: 0xff1010,
      emissiveIntensity: 3,
      roughness: 0.2
    })
    blueMat = new THREE.MeshStandardMaterial({
      color: 0x2040ff,
      emissive: 0x1830ff,
      emissiveIntensity: 3,
      roughness: 0.2
    })
    const red = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.24), redMat)
    red.position.set(-0.29, roofY + 0.2, -0.15)
    group.add(red)
    const blue = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.24), blueMat)
    blue.position.set(0.29, roofY + 0.2, -0.15)
    group.add(blue)
    lightBar = { redMat, blueMat }

    sirenLight = new THREE.PointLight(0xff2020, 0, 20, 2)
    sirenLight.position.set(0, roofY + 0.5, -0.15)
    group.add(sirenLight)

    const decalTex = makePoliceDecal()
    const decalMat = new THREE.MeshBasicMaterial({
      map: decalTex,
      transparent: true,
      toneMapped: false,
      side: THREE.DoubleSide
    })
    for (const side of [-1, 1]) {
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), decalMat)
      decal.position.set(side * (W / 2 + 0.012), bodyY + 0.02, -0.2)
      decal.rotation.y = side * Math.PI / 2
      group.add(decal)
    }

    const push = new THREE.Mesh(new THREE.BoxGeometry(W * 0.7, 0.42, 0.14), trim)
    push.position.set(0, bodyY - 0.02, L / 2 + 0.16)
    group.add(push)
  }

  const wheels = []
  const frontWheels = []
  for (const sz of [-1, 1]) {
    for (const sx of [-1, 1]) {
      const wheel = makeWheel(wheelR, 0.3)
      wheel.position.set(sx * (W / 2 - 0.12), wheelR, sz * wheelZ)
      group.add(wheel)
      wheels.push(wheel)
      if (sz === 1) frontWheels.push(wheel)
    }
  }

  return {
    group,
    wheels,
    frontWheels,
    paint,
    headMat,
    tailMat,
    lightBar,
    sirenLight,
    dimensions: { L, W, wheelR, wheelZ },
    police
  }
}

export class Car {
  constructor(scene, opts = {}) {
    const mesh = createCarMesh(opts)
    this.meshData = mesh
    this.group = mesh.group
    this.group.userData.entity = this
    this.group.userData.kind = opts.police ? 'policeCar' : 'car'
    scene.add(this.group)

    this.pos = new THREE.Vector3(opts.position?.x ?? 0, 0, opts.position?.z ?? 0)
    this.heading = opts.heading ?? 0
    this.velocity = new THREE.Vector3()
    this.speed = 0
    this.steer = 0
    this.health = 100
    this.destroyed = false
    this.driver = opts.driver || 'parked'
    this.police = !!opts.police
    this.type = opts.type || 'sedan'
    this.color = opts.color
    this.radius = 1.55
    this.maxSpeed = opts.maxSpeed ?? (this.type === 'sports' ? 38 : this.type === 'suv' ? 27 : 31)
    this.accel = opts.accel ?? (this.type === 'sports' ? 24 : 17)
    this.brakePower = opts.brakePower ?? 30
    this.reverseAccel = 10
    this.maxReverse = 9
    this.turnRate = opts.turnRate ?? (this.type === 'sports' ? 0.047 : this.type === 'suv' ? 0.038 : 0.043)
    this.wheelSpin = 0
    this.headlight = null
    this.sirenPhase = rand(0, 10)
    this.traffic = null
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.heading
  }

  enableHeadlight() {
    if (this.headlight) {
      this.headlight.intensity = 620
      return
    }
    const light = new THREE.SpotLight(0xfff0c4, 620, 72, 0.46, 0.45, 1.35)
    const d = this.meshData.dimensions
    light.position.set(0, 0.9, d.L / 2 + 0.1)
    light.target.position.set(0, 0.2, d.L / 2 + 24)
    light.castShadow = false
    this.group.add(light)
    this.group.add(light.target)
    this.headlight = light
    this.meshData.headMat.emissiveIntensity = 4
  }

  disableHeadlight() {
    if (this.headlight) this.headlight.intensity = 0
    this.meshData.headMat.emissiveIntensity = 2.6
  }

  setPlayerControlled(on) {
    this.driver = on ? 'player' : 'parked'
    if (on) this.enableHeadlight()
    else this.disableHeadlight()
  }

  applyInput(dt, input, colliders) {
    if (this.destroyed) return
    const fwd = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading))
    const right = new THREE.Vector3(Math.cos(this.heading), 0, -Math.sin(this.heading))
    let fSpeed = this.velocity.dot(fwd)
    let lSpeed = this.velocity.dot(right)
    const throttle = input.throttle || 0
    const brake = input.brake || 0
    const steerInput = input.steer || 0
    const handbrake = !!input.handbrake

    if (throttle > 0) fSpeed += this.accel * throttle * dt
    if (brake > 0) {
      if (fSpeed > 0.4) fSpeed -= this.brakePower * brake * dt
      else fSpeed -= this.reverseAccel * brake * dt
    }
    if (throttle === 0 && brake === 0) fSpeed *= Math.exp(-1.15 * dt)
    if (handbrake) fSpeed *= Math.exp(-1.9 * dt)
    fSpeed = clamp(fSpeed, -this.maxReverse, this.maxSpeed)

    const targetSteer = steerInput * (0.55 + clamp(Math.abs(fSpeed) / 40, 0, 0.15))
    this.steer = damp(this.steer, targetSteer, 9, dt)
    if (Math.abs(fSpeed) > 0.25) {
      this.heading += this.steer * fSpeed * this.turnRate * dt
    }

    const grip = handbrake ? 1.4 : 7.2
    lSpeed *= Math.exp(-grip * dt)
    this.velocity.copy(fwd).multiplyScalar(fSpeed).add(right.clone().multiplyScalar(lSpeed))

    this.pos.x += this.velocity.x * dt
    this.pos.z += this.velocity.z * dt

    const solved = resolveCircle(this.pos.x, this.pos.z, this.radius, colliders)
    if (solved.hit) {
      this.pos.x = solved.x
      this.pos.z = solved.z
      const impact = Math.abs(fSpeed)
      this.velocity.multiplyScalar(0.18)
      if (impact > 12) {
        this.health -= (impact - 12) * 0.8
      }
      fSpeed *= 0.18
    }
    const b = 235
    this.pos.x = clamp(this.pos.x, -b, b)
    this.pos.z = clamp(this.pos.z, -b, b)
    this.speed = fSpeed
    this.updateVisual(dt)
    if (this.health <= 0) this.destroyed = true
  }

  driveTraffic(dt, speedTarget) {
    this.speed = damp(this.speed, speedTarget, 2.5, dt)
    const fwd = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading))
    this.pos.x += fwd.x * this.speed * dt
    this.pos.z += fwd.z * this.speed * dt
    this.velocity.copy(fwd).multiplyScalar(this.speed)
    this.updateVisual(dt)
  }

  updateVisual(dt) {
    this.wheelSpin += (this.speed * dt) / 0.34
    for (const wheel of this.meshData.wheels) wheel.rotation.x = this.wheelSpin
    for (const wheel of this.meshData.frontWheels) wheel.rotation.y = this.steer * 0.5
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.heading
    const roll = -this.steer * clamp(Math.abs(this.speed) / 34, 0, 1) * 0.055
    this.group.rotation.z = damp(this.group.rotation.z, roll, 6, dt)
    this.group.rotation.x = damp(this.group.rotation.x, clamp(-this.speed * 0.0012, -0.035, 0.035), 5, dt)
  }

  updateSiren(time, active) {
    if (!this.police || !this.meshData.lightBar) return
    const { redMat, blueMat } = this.meshData.lightBar
    if (!active) {
      redMat.emissiveIntensity = 0.2
      blueMat.emissiveIntensity = 0.2
      if (this.meshData.sirenLight) this.meshData.sirenLight.intensity = 0
      return
    }
    const p = Math.sin(time * 9 + this.sirenPhase)
    const redOn = p > 0
    redMat.emissiveIntensity = redOn ? 4.5 : 0.3
    blueMat.emissiveIntensity = redOn ? 0.3 : 4.5
    if (this.meshData.sirenLight) {
      this.meshData.sirenLight.color.setHex(redOn ? 0xff2020 : 0x2040ff)
      this.meshData.sirenLight.intensity = redOn ? 55 : 36
    }
  }

  damage(amount) {
    if (this.destroyed) return
    this.health -= amount
    if (this.health <= 0) {
      this.health = 0
      this.destroyed = true
    }
  }
}
