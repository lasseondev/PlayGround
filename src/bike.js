import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeGlowTexture } from './world.js'

const clamp = THREE.MathUtils.clamp
const UP = new THREE.Vector3(0, 1, 0)
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _dir = new THREE.Vector3()

function tube(ax, ay, az, bx, by, bz, radius, material, segments = 8) {
  _a.set(ax, ay, az)
  _b.set(bx, by, bz)
  _dir.subVectors(_b, _a)
  const len = _dir.length()
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, segments), material)
  mesh.position.copy(_a).addScaledVector(_dir, 0.5)
  mesh.quaternion.setFromUnitVectors(UP, _dir.normalize())
  return mesh
}

function rounded(w, h, d, r, material) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), material)
}

export function createBikeMesh(options = {}) {
  const mainColor = new THREE.Color(options.main ?? '#20d9ee')
  const accentColor = new THREE.Color(options.accent ?? '#ff2f97')
  const police = Boolean(options.police)

  const root = new THREE.Group()
  const lean = new THREE.Group()
  const model = new THREE.Group()
  root.add(lean)
  lean.add(model)

  const bodyMat = new THREE.MeshStandardMaterial({
    color: police ? 0xe8edf7 : mainColor, metalness: 0.55, roughness: 0.28,
    emissive: police ? 0x0b1424 : mainColor, emissiveIntensity: 0.12,
  })
  const accentMat = new THREE.MeshStandardMaterial({
    color: police ? 0x11213a : accentColor, metalness: 0.5, roughness: 0.3,
    emissive: police ? 0x0a1120 : accentColor, emissiveIntensity: 0.45,
  })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x12151b, metalness: 0.42, roughness: 0.52 })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x9aa7b8, metalness: 0.95, roughness: 0.24 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.95, metalness: 0.02 })
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x08222c, metalness: 0.9, roughness: 0.06, emissive: 0x0d3c4a, emissiveIntensity: 0.85,
  })
  const jacketMat = new THREE.MeshStandardMaterial({ color: police ? 0x16213a : 0x1a1e27, metalness: 0.28, roughness: 0.62 })
  const jeansMat = new THREE.MeshStandardMaterial({ color: 0x232a35, roughness: 0.82 })
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xe8faff, emissive: 0xcfefff, emissiveIntensity: 5, roughness: 0.1,
  })
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0x4b0610, emissive: 0xff1f3c, emissiveIntensity: 4, roughness: 0.25,
  })

  const wheels = []
  const makeWheel = (z) => {
    const pivot = new THREE.Group()
    pivot.position.set(0, 0.53, z)
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.115, 10, 24), rubber)
    tire.rotation.y = Math.PI / 2
    pivot.add(tire)
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.12, 18), metalMat)
    rim.rotation.z = Math.PI / 2
    pivot.add(rim)
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.47, 0.045), metalMat)
      spoke.rotation.x = (i / 5) * Math.PI
      pivot.add(spoke)
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 10), darkMat)
    hub.rotation.z = Math.PI / 2
    pivot.add(hub)
    model.add(pivot)
    wheels.push(pivot)
    return pivot
  }
  const rearWheel = makeWheel(-1.02)
  const frontWheel = makeWheel(1.05)

  const engine = rounded(0.36, 0.42, 0.86, 0.08, darkMat)
  engine.position.set(0, 0.73, -0.02)
  model.add(engine)
  const swingArm = tube(0.12, 0.6, -0.05, 0.12, 0.53, -1.0, 0.05, metalMat)
  model.add(swingArm)
  const swingArmL = tube(-0.12, 0.6, -0.05, -0.12, 0.53, -1.0, 0.05, metalMat)
  model.add(swingArmL)

  const tank = rounded(0.42, 0.36, 0.8, 0.12, bodyMat)
  tank.position.set(0, 1.04, 0.1)
  tank.rotation.x = -0.06
  model.add(tank)
  const tankAccent = rounded(0.44, 0.08, 0.5, 0.035, accentMat)
  tankAccent.position.set(0, 1.14, 0.16)
  model.add(tankAccent)

  const fairing = rounded(0.4, 0.46, 0.6, 0.12, bodyMat)
  fairing.position.set(0, 0.99, 0.64)
  fairing.rotation.x = -0.24
  model.add(fairing)
  const beak = rounded(0.26, 0.12, 0.48, 0.05, accentMat)
  beak.position.set(0, 0.84, 0.74)
  beak.rotation.x = 0.2
  model.add(beak)

  const seat = rounded(0.34, 0.13, 0.66, 0.05, darkMat)
  seat.position.set(0, 1.15, -0.38)
  model.add(seat)
  const tail = rounded(0.27, 0.19, 0.52, 0.07, bodyMat)
  tail.position.set(0, 1.19, -0.83)
  tail.rotation.x = -0.14
  model.add(tail)
  const tailTip = rounded(0.2, 0.08, 0.18, 0.03, accentMat)
  tailTip.position.set(0, 1.27, -1.03)
  model.add(tailTip)

  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.025), new THREE.MeshStandardMaterial({ color: 0xc9d2dc, roughness: 0.6 }))
  plate.position.set(0, 0.9, -1.16)
  plate.rotation.x = -0.18
  model.add(plate)

  for (const s of [-1, 1]) {
    model.add(tube(s * 0.14, 0.53, 1.05, s * 0.14, 1.22, 0.6, 0.035, metalMat))
    const forkCap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 8), accentMat)
    forkCap.position.set(s * 0.14, 1.21, 0.59)
    forkCap.rotation.x = 0.45
    model.add(forkCap)
  }

  const handlebar = tube(-0.37, 1.33, 0.5, 0.37, 1.33, 0.5, 0.027, darkMat, 6)
  model.add(handlebar)
  for (const s of [-1, 1]) {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.13, 8), accentMat)
    grip.position.set(s * 0.36, 1.33, 0.5)
    grip.rotation.z = Math.PI / 2
    model.add(grip)
    const mirrorStem = tube(s * 0.28, 1.36, 0.52, s * 0.42, 1.5, 0.5, 0.014, metalMat, 5)
    model.add(mirrorStem)
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.03), visorMat)
    mirror.position.set(s * 0.44, 1.53, 0.5)
    mirror.rotation.z = s * 0.16
    model.add(mirror)
  }

  const headlight = rounded(0.26, 0.2, 0.1, 0.04, headlightMat)
  headlight.position.set(0, 1.13, 0.96)
  model.add(headlight)
  const tailLight = rounded(0.2, 0.06, 0.06, 0.02, tailMat)
  tailLight.position.set(0, 1.16, -1.08)
  model.add(tailLight)

  const exhaust = tube(0.2, 0.58, -0.18, 0.34, 0.72, -1.2, 0.055, metalMat)
  model.add(exhaust)
  const exhaustTip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.16, 10), darkMat)
  exhaustTip.position.set(0.345, 0.73, -1.26)
  exhaustTip.rotation.x = Math.PI / 2 - 0.15
  model.add(exhaustTip)

  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.6, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x7defff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  )
  flame.position.set(0.345, 0.73, -1.6)
  flame.rotation.x = -Math.PI / 2
  flame.scale.set(0.01, 0.01, 0.01)
  model.add(flame)

  /* rider */
  const rider = new THREE.Group()
  model.add(rider)

  const torso = rounded(0.46, 0.62, 0.32, 0.1, jacketMat)
  torso.position.set(0, 1.62, -0.18)
  torso.rotation.x = 0.27
  rider.add(torso)
  const backStripe = rounded(0.3, 0.09, 0.02, 0.015, accentMat)
  backStripe.position.set(0, 1.72, -0.355)
  backStripe.rotation.x = 0.27
  rider.add(backStripe)

  const hips = rounded(0.36, 0.22, 0.3, 0.08, jeansMat)
  hips.position.set(0, 1.27, -0.38)
  rider.add(hips)

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.205, 18, 14), new THREE.MeshStandardMaterial({
    color: police ? 0x16213a : mainColor, metalness: 0.5, roughness: 0.26,
  }))
  helmet.scale.set(1, 1.06, 1.12)
  helmet.position.set(0, 2.06, 0.02)
  rider.add(helmet)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.115, 0.12), visorMat)
  visor.position.set(0, 2.04, 0.19)
  visor.rotation.x = 0.1
  rider.add(visor)
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, 0.4), accentMat)
  stripe.position.set(0, 2.25, 0.01)
  rider.add(stripe)

  for (const s of [-1, 1]) {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), jacketMat)
    shoulder.position.set(s * 0.25, 1.82, -0.08)
    rider.add(shoulder)
    rider.add(tube(s * 0.25, 1.82, -0.04, s * 0.35, 1.35, 0.48, 0.055, jacketMat, 7))
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), darkMat)
    glove.position.set(s * 0.36, 1.34, 0.5)
    rider.add(glove)
    rider.add(tube(s * 0.14, 1.27, -0.33, s * 0.27, 0.88, 0.32, 0.085, jeansMat, 7))
    rider.add(tube(s * 0.27, 0.88, 0.32, s * 0.23, 0.56, -0.12, 0.07, jeansMat, 7))
    const boot = rounded(0.15, 0.13, 0.3, 0.04, darkMat)
    boot.position.set(s * 0.23, 0.5, -0.17)
    rider.add(boot)
  }

  const shadowTex = makeGlowTexture()
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 3.1),
    new THREE.MeshBasicMaterial({ map: shadowTex, color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.02
  root.add(shadow)

  const spot = new THREE.SpotLight(0xd8f4ff, 0, 55, 0.42, 0.55, 1.3)
  spot.position.set(0, 1.15, 0.9)
  spot.target.position.set(0, 0.1, 20)
  root.add(spot)
  root.add(spot.target)

  if (police) {
    const red = new THREE.MeshBasicMaterial({ color: 0xff2233, toneMapped: false })
    const blue = new THREE.MeshBasicMaterial({ color: 0x2277ff, toneMapped: false })
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.14), darkMat)
    bar.position.set(0, 1.34, -0.92)
    model.add(bar)
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), red)
    r.position.set(-0.14, 1.4, -0.92)
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), blue)
    b.position.set(0.14, 1.4, -0.92)
    model.add(r, b)
    root.userData.policeLights = [red, blue]
  }

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = false
    }
  })
  shadow.castShadow = false

  root.userData = {
    ...root.userData,
    lean,
    model,
    rider,
    wheels,
    frontWheel,
    flame,
    headlight: spot,
    headlightMat,
    tailMat,
    bodyMat,
    accentMat,
    handlebar,
  }
  return root
}

export class Bike {
  constructor(scene, options = {}) {
    this.root = createBikeMesh(options)
    this.parts = this.root.userData
    this.pos = new THREE.Vector3()
    this.vel = new THREE.Vector2()
    this.yaw = 0
    this.visualY = 0
    this.lean = 0
    this.pitch = 0
    this.spin = 0
    this.boostFuel = 100
    this.time = 0
    this.boosting = false
    this.drifting = false
    this.events = []
    this.wallCooldown = 0
    this.accel = 0
    this.lastSpeed = 0
    scene.add(this.root)
  }

  get speed() { return this.vel.length() }
  get kmh() { return Math.round(this.vel.length() * 3.6) }

  reset(x, z, yaw = 0, world = null) {
    this.pos.set(x, 0, z)
    this.vel.set(0, 0)
    this.yaw = yaw
    this.visualY = world ? world.groundHeightAt(x, z) : 0
    this.lean = 0
    this.pitch = 0
    this.spin = 0
    this.boostFuel = 100
    this.boosting = false
    this.drifting = false
    this.accel = 0
    this.events.length = 0
    this.root.position.set(x, this.visualY + 0.02, z)
    this.root.rotation.y = yaw
    this.parts.lean.rotation.set(0, 0, 0)
  }

  forwardVector(out = new THREE.Vector2()) {
    return out.set(Math.sin(this.yaw), Math.cos(this.yaw))
  }

  rearPosition(out = new THREE.Vector3()) {
    return out.set(
      this.pos.x - Math.sin(this.yaw) * 1.15,
      this.visualY + 0.35,
      this.pos.z - Math.cos(this.yaw) * 1.15,
    )
  }

  setNight(night) {
    this.parts.headlight.intensity = night * 55
    this.parts.headlightMat.emissiveIntensity = 2 + night * 4
  }

  update(dt, input, world) {
    this.time += dt
    this.wallCooldown = Math.max(0, this.wallCooldown - dt)
    this.events.length = 0

    const steer = clamp(input.steer || 0, -1, 1)
    const throttle = clamp(input.throttle || 0, 0, 1)
    const brake = clamp(input.brake || 0, 0, 1)
    const drift = Boolean(input.drift)

    let fwdX = Math.sin(this.yaw)
    let fwdZ = Math.cos(this.yaw)
    let signed = this.vel.x * fwdX + this.vel.y * fwdZ
    let speed = this.vel.length()

    const authority = clamp(0.34 + speed / 16, 0.34, 1.15) * (1 - clamp(speed / 78, 0, 0.4))
    const reverseSign = signed < -0.5 ? -1 : 1
    this.yaw -= steer * 1.72 * authority * reverseSign * dt
    fwdX = Math.sin(this.yaw)
    fwdZ = Math.cos(this.yaw)

    const wantBoost = Boolean(input.boost) && this.boostFuel > 0.5 && throttle > 0.05 && signed > -1
    this.boosting = wantBoost
    let accel = 0
    if (throttle > 0) accel += (wantBoost ? 33 : 19.5) * throttle
    if (brake > 0) accel -= signed > 1.5 ? 36 : 7.5
    if (speed > 0.2 && throttle < 0.05 && brake < 0.05) accel -= 2.3
    this.accel = accel
    this.vel.x += fwdX * accel * dt
    this.vel.y += fwdZ * accel * dt

    const along = this.vel.x * fwdX + this.vel.y * fwdZ
    const latX = this.vel.x - fwdX * along
    const latZ = this.vel.y - fwdZ * along
    const grip = drift ? 1.35 : speed > 30 ? 6.2 : 8.6
    const gripFactor = 1 - Math.exp(-grip * dt)
    this.vel.x -= latX * gripFactor
    this.vel.y -= latZ * gripFactor
    this.drifting = drift && speed > 6 && Math.hypot(latX, latZ) > 2.2

    const drag = Math.max(0.06, (drift ? 0.32 : 0.15) - (wantBoost ? 0.05 : 0))
    this.vel.multiplyScalar(Math.exp(-drag * dt))

    const maxSpeed = wantBoost ? 64 : 47
    if (this.vel.length() > maxSpeed) this.vel.setLength(maxSpeed)
    const signed2 = this.vel.x * fwdX + this.vel.y * fwdZ
    if (signed2 < -9) {
      this.vel.x += fwdX * (-9 - signed2)
      this.vel.y += fwdZ * (-9 - signed2)
    }

    if (wantBoost) this.boostFuel = Math.max(0, this.boostFuel - 29 * dt)
    else this.boostFuel = Math.min(100, this.boostFuel + (speed > 25 ? 9 : 15) * dt)

    this.pos.x += this.vel.x * dt
    this.pos.z += this.vel.y * dt

    const R = 0.72
    let worst = 0
    let hitX = 0
    let hitZ = 0
    let hitNx = 0
    let hitNz = 0
    for (const b of world.buildings) {
      if (this.pos.x < b.minX - 4 || this.pos.x > b.maxX + 4 || this.pos.z < b.minZ - 4 || this.pos.z > b.maxZ + 4) continue
      const cx = clamp(this.pos.x, b.minX, b.maxX)
      const cz = clamp(this.pos.z, b.minZ, b.maxZ)
      let dx = this.pos.x - cx
      let dz = this.pos.z - cz
      const d2 = dx * dx + dz * dz
      if (d2 >= R * R) continue
      let dist = Math.sqrt(d2)
      let nx
      let nz
      if (dist > 1e-5) {
        nx = dx / dist
        nz = dz / dist
        this.pos.x = cx + nx * R
        this.pos.z = cz + nz * R
      } else {
        const dl = this.pos.x - b.minX
        const dr = b.maxX - this.pos.x
        const db = this.pos.z - b.minZ
        const df = b.maxZ - this.pos.z
        const m = Math.min(dl, dr, db, df)
        if (m === dl) { nx = -1; nz = 0; this.pos.x = b.minX - R }
        else if (m === dr) { nx = 1; nz = 0; this.pos.x = b.maxX + R }
        else if (m === db) { nx = 0; nz = -1; this.pos.z = b.minZ - R }
        else { nx = 0; nz = 1; this.pos.z = b.maxZ + R }
      }
      const vn = this.vel.x * nx + this.vel.y * nz
      if (vn < 0) {
        this.vel.x -= nx * vn * 1.45
        this.vel.y -= nz * vn * 1.45
        const impact = -vn
        if (impact > worst) {
          worst = impact
          hitX = this.pos.x - nx * R
          hitZ = this.pos.z - nz * R
          hitNx = nx
          hitNz = nz
        }
      }
    }

    const limit = world.bounds - 3
    if (Math.abs(this.pos.x) > limit) {
      const s = Math.sign(this.pos.x)
      const impact = Math.abs(this.vel.x)
      this.pos.x = s * limit
      this.vel.x *= -0.22
      if (impact > 5) { worst = Math.max(worst, impact); hitX = this.pos.x; hitZ = this.pos.z; hitNx = -s; hitNz = 0 }
    }
    if (Math.abs(this.pos.z) > limit) {
      const s = Math.sign(this.pos.z)
      const impact = Math.abs(this.vel.y)
      this.pos.z = s * limit
      this.vel.y *= -0.22
      if (impact > 5) { worst = Math.max(worst, impact); hitX = this.pos.x; hitZ = this.pos.z; hitNx = 0; hitNz = -s }
    }

    if (worst > 6.5 && this.wallCooldown <= 0) {
      this.wallCooldown = 0.3
      this.events.push({ type: 'wall', impact: worst, x: hitX, z: hitZ, nx: hitNx, nz: hitNz })
    }

    const gh = world.groundHeightAt(this.pos.x, this.pos.z)
    this.visualY += (gh - this.visualY) * (1 - Math.exp(-dt * 11))
    speed = this.vel.length()
    signed = this.vel.x * fwdX + this.vel.y * fwdZ
    const speedRatio = clamp(speed / 50, 0, 1)

    const targetLean = steer * (0.08 + speedRatio * 0.46) * (this.drifting ? 1.16 : 1) * reverseSign
    this.lean = THREE.MathUtils.damp(this.lean, targetLean, 6.5, dt)
    const pitchTarget = clamp(-this.accel * 0.0042 - (wantBoost ? 0.03 : 0) + (brake > 0 && signed > 5 ? 0.035 : 0), -0.1, 0.1)
    this.pitch = THREE.MathUtils.damp(this.pitch, pitchTarget, 8, dt)

    const bob = Math.sin(this.time * 42) * 0.0025 * (0.35 + speedRatio)
    this.root.position.set(this.pos.x, this.visualY + 0.02 + bob, this.pos.z)
    this.root.rotation.y = this.yaw
    this.parts.lean.rotation.z = this.lean
    this.parts.lean.rotation.x = this.pitch

    this.spin += (signed * dt) / 0.52
    this.parts.wheels[0].rotation.x = this.spin
    this.parts.wheels[1].rotation.x = this.spin
    this.parts.frontWheel.rotation.y = -steer * 0.16
    this.parts.handlebar.rotation.y = -steer * 0.14

    const flameScale = wantBoost ? 0.75 + Math.random() * 0.55 : 0.01
    this.parts.flame.scale.set(0.8 * flameScale, 2.4 * flameScale, 0.8 * flameScale)
    this.parts.tailMat.emissiveIntensity = brake > 0.05 ? 8 : 3.2
    this.lastSpeed = speed

    return this.events
  }
}

