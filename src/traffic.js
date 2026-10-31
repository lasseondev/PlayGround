import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { CITY } from './world.js'

const clamp = THREE.MathUtils.clamp

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CAR_COLORS = ['#d94f4f', '#3c74d6', '#e3b447', '#4dbfa2', '#d7dee8', '#8a63d2', '#e6e9ef', '#2f3946', '#c96d3c']

export class Traffic {
  constructor(scene, focus) {
    this.scene = scene
    this.rng = mulberry32(4242)
    this.cars = []
    this.peds = []
    this.time = 0
    this.carMesh = null
    this.buildCars(focus)
    this.buildPeds(focus)
  }

  buildCars(focus) {
    const rng = this.rng
    const count = 28
    const bodyGeo = new RoundedBoxGeometry(1.86, 0.62, 4.15, 2, 0.14)
    const cabinGeo = new RoundedBoxGeometry(1.5, 0.56, 1.95, 2, 0.12)
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.28, 10)
    const lightGeo = new THREE.BoxGeometry(0.32, 0.14, 0.07)

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.55, roughness: 0.35 })
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x131a24, metalness: 0.7, roughness: 0.18 })
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 0.95 })
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })

    this.carsBody = new THREE.InstancedMesh(bodyGeo, bodyMat, count)
    this.carsCabin = new THREE.InstancedMesh(cabinGeo, cabinMat, count)
    this.carsWheels = new THREE.InstancedMesh(wheelGeo, wheelMat, count * 4)
    this.carsLights = new THREE.InstancedMesh(lightGeo, lightMat, count * 4)
    for (const m of [this.carsBody, this.carsCabin, this.carsWheels, this.carsLights]) {
      m.frustumCulled = false
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    this.carsBody.castShadow = true
    this.carsCabin.castShadow = true
    this.scene.add(this.carsBody, this.carsCabin, this.carsWheels, this.carsLights)

    const palette = CAR_COLORS.map((c) => new THREE.Color(c))
    const white = new THREE.Color('#fff2ce')
    const red = new THREE.Color('#ff2d3f')
    for (let i = 0; i < count; i++) {
      const nearCars = [
        ['z', 38, 150, -1],
        ['z', 38, 238, 1],
        ['z', 38, 104, -1],
        ['x', 190, -24, 1],
        ['x', 190, 104, -1],
        ['x', 114, 24, 1],
        ['z', 38, 292, 1],
      ]
      let axis
      let dir
      let road
      let along
      if (i < nearCars.length) {
        [axis, road, along, dir] = nearCars[i]
      } else {
        axis = rng() < 0.5 ? 'x' : 'z'
        dir = rng() < 0.5 ? 1 : -1
        road = CITY.roadCenters[Math.floor(rng() * CITY.roadCenters.length)]
        along = (rng() - 0.5) * 660
      }
      const car = {
        axis,
        dir,
        road,
        along,
        speed: 8 + rng() * 9,
        lane: -dir * 4.6,
        hit: 0,
        cooldown: 0,
        color: palette[Math.floor(rng() * palette.length)],
      }
      this.cars.push(car)
      this.carsBody.setColorAt(i, car.color)
      this.carsBody.instanceColor.needsUpdate = true
    }

    for (let i = 0; i < count; i++) {
      const o = i * 4
      this.carsLights.setColorAt(o, white)
      this.carsLights.setColorAt(o + 1, white)
      this.carsLights.setColorAt(o + 2, red)
      this.carsLights.setColorAt(o + 3, red)
    }
    this.carsLights.instanceColor.needsUpdate = true
  }

  buildPeds(focus) {
    const rng = this.rng
    const count = 44
    const bodyGeo = new THREE.CapsuleGeometry(0.23, 0.72, 3, 6)
    const headGeo = new THREE.SphereGeometry(0.18, 8, 6)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    this.pedBodies = new THREE.InstancedMesh(bodyGeo, bodyMat, count)
    this.pedHeads = new THREE.InstancedMesh(headGeo, headMat, count)
    for (const m of [this.pedBodies, this.pedHeads]) {
      m.frustumCulled = false
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      m.castShadow = true
    }
    this.scene.add(this.pedBodies, this.pedHeads)
    const clothing = ['#e8e2d4', '#cf4747', '#3f7fc9', '#e1ba55', '#54a67b', '#8b5bb5', '#d9803d', '#dfe3ea']
    const skin = ['#f1c6a0', '#d9a273', '#a76b45', '#7c4a2d', '#f0d3b8']
    for (let i = 0; i < count; i++) {
      const nearStart = i < 8
      const bi = nearStart ? (i % 2 === 0 ? 4 : 5) : Math.floor(rng() * 9)
      const bj = nearStart ? (i % 2 === 0 ? 2 : 3) : Math.floor(rng() * 9)
      const ped = {
        bi, bj,
        side: Math.floor(rng() * 4),
        t: rng(),
        dir: rng() < 0.5 ? 1 : -1,
        speed: 0.85 + rng() * 0.8,
        phase: rng() * Math.PI * 2,
        knocked: 0,
        flee: 0,
      }
      this.peds.push(ped)
      this.pedBodies.setColorAt(i, new THREE.Color(clothing[Math.floor(rng() * clothing.length)]))
      this.pedHeads.setColorAt(i, new THREE.Color(skin[Math.floor(rng() * skin.length)]))
    }
    this.pedBodies.instanceColor.needsUpdate = true
    this.pedHeads.instanceColor.needsUpdate = true
    this.pedFocus = focus
  }

  pedPosition(ped) {
    const S = 26.2
    const cx = CITY.blockCenters[ped.bi]
    const cz = CITY.blockCenters[ped.bj]
    let x, z
    if (ped.side === 0) { x = cx - S + ped.t * 2 * S; z = cz + S }
    else if (ped.side === 1) { x = cx + S; z = cz + S - ped.t * 2 * S }
    else if (ped.side === 2) { x = cx + S - ped.t * 2 * S; z = cz - S }
    else { x = cx - S; z = cz - S + ped.t * 2 * S }
    let dx = 0, dz = 0
    if (ped.side === 0) dx = 1
    else if (ped.side === 1) dz = -1
    else if (ped.side === 2) dx = -1
    else dz = 1
    return { x, z, yaw: Math.atan2(dx * ped.dir, dz * ped.dir) }
  }

  update(dt, playerPos, playerSpeed) {
    this.time += dt
    const rng = this.rng
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scale = new THREE.Vector3(1, 1, 1)
    const wheelQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))

    this.cars.forEach((car, i) => {
      car.cooldown = Math.max(0, car.cooldown - dt)
      car.hit = Math.max(0, car.hit - dt)
      car.along += car.dir * car.speed * dt * (car.hit > 0 ? 0.55 : 1)
      if (car.along > 352) car.along = -352
      if (car.along < -352) car.along = 352
      const wobble = car.hit > 0 ? Math.sin(this.time * 26) * car.hit * 0.5 : 0
      const lane = car.lane + wobble
      let x, z, yaw
      if (car.axis === 'z') {
        x = car.road + lane
        z = car.along
        yaw = car.dir > 0 ? 0 : Math.PI
      } else {
        x = car.along
        z = car.road + lane
        yaw = car.dir > 0 ? Math.PI / 2 : -Math.PI / 2
      }
      car.x = x
      car.z = z
      q.setFromEuler(new THREE.Euler(0, yaw, 0))
      pos.set(x, 0.56, z)
      m.compose(pos, q, scale)
      this.carsBody.setMatrixAt(i, m)

      pos.set(x, 1.02, z)
      m.compose(pos, q, scale)
      this.carsCabin.setMatrixAt(i, m)

      const forwardX = Math.sin(yaw)
      const forwardZ = Math.cos(yaw)
      const rightX = Math.cos(yaw)
      const rightZ = -Math.sin(yaw)
      const wheelOffsets = [[-1, 1], [1, 1], [-1, -1], [1, -1]]
      wheelOffsets.forEach(([sx, sz], k) => {
        const wx = x + rightX * sx * 0.82 + forwardX * sz * 1.32
        const wz = z + rightZ * sx * 0.82 + forwardZ * sz * 1.32
        pos.set(wx, 0.35, wz)
        q.setFromEuler(new THREE.Euler(0, yaw, 0)).multiply(wheelQ)
        m.compose(pos, q, scale)
        this.carsWheels.setMatrixAt(i * 4 + k, m)
      })

      const lights = [[-0.62, 2.08], [0.62, 2.08], [-0.62, -2.08], [0.62, -2.08]]
      lights.forEach(([lx, lz], k) => {
        const wx = x + rightX * lx + forwardX * lz
        const wz = z + rightZ * lx + forwardZ * lz
        pos.set(wx, 0.63, wz)
        q.setFromEuler(new THREE.Euler(0, yaw, 0))
        m.compose(pos, q, scale)
        this.carsLights.setMatrixAt(i * 4 + k, m)
      })
    })
    this.carsBody.instanceMatrix.needsUpdate = true
    this.carsCabin.instanceMatrix.needsUpdate = true
    this.carsWheels.instanceMatrix.needsUpdate = true
    this.carsLights.instanceMatrix.needsUpdate = true

    this.peds.forEach((ped, i) => {
      if (ped.knocked > 0) {
        ped.knocked -= dt
        if (ped.knocked <= 0) {
          ped.bi = Math.floor(rng() * 9)
          ped.bj = Math.floor(rng() * 9)
          ped.side = Math.floor(rng() * 4)
          ped.t = rng()
          ped.dir = rng() < 0.5 ? 1 : -1
        }
      }
      const p = this.pedPosition(ped)
      const dist = Math.hypot(playerPos.x - p.x, playerPos.z - p.z)
      ped.flee = Math.max(0, ped.flee - dt)
      if (dist < 7 && playerSpeed > 3) ped.flee = Math.max(ped.flee, 0.8)
      let speed = ped.speed
      if (ped.flee > 0) speed = 3.6
      if (ped.knocked <= 0) {
        ped.t += (ped.dir * speed * dt) / 52.4
        if (ped.t > 1) {
          ped.t -= 1
          ped.side = (ped.side + 1) % 4
        } else if (ped.t < 0) {
          ped.t += 1
          ped.side = (ped.side + 3) % 4
        }
      }
      const p2 = this.pedPosition(ped)
      ped.x = p2.x
      ped.z = p2.z
      let bodyY = 0.38 + 0.6 + Math.sin(this.time * 9 + ped.phase) * 0.025
      let rotZ = 0
      if (ped.knocked > 0) {
        bodyY = 0.38 + 0.25
        rotZ = Math.PI / 2
      }
      q.setFromEuler(new THREE.Euler(0, p2.yaw, rotZ))
      pos.set(p2.x, bodyY, p2.z)
      m.compose(pos, q, scale)
      this.pedBodies.setMatrixAt(i, m)
      pos.set(p2.x, bodyY + 0.68, p2.z)
      m.compose(pos, q, scale)
      this.pedHeads.setMatrixAt(i, m)
    })
    this.pedBodies.instanceMatrix.needsUpdate = true
    this.pedHeads.instanceMatrix.needsUpdate = true
  }

  collideBike(bike) {
    const events = []
    const R = 0.78
    for (const car of this.cars) {
      if (car.cooldown > 0) continue
      const hw = car.axis === 'x' ? 2.2 : 1.15
      const hd = car.axis === 'x' ? 1.15 : 2.2
      const cx = clamp(bike.pos.x, car.x - hw, car.x + hw)
      const cz = clamp(bike.pos.z, car.z - hd, car.z + hd)
      let dx = bike.pos.x - cx
      let dz = bike.pos.z - cz
      const d2 = dx * dx + dz * dz
      if (d2 >= R * R) continue
      let dist = Math.sqrt(d2)
      let nx, nz
      if (dist > 1e-4) {
        nx = dx / dist
        nz = dz / dist
      } else {
        nx = bike.pos.x < car.x ? -1 : 1
        nz = 0
        dist = 0
      }
      bike.pos.x = cx + nx * R
      bike.pos.z = cz + nz * R
      const vn = bike.vel.x * nx + bike.vel.y * nz
      if (vn < 0) {
        bike.vel.x -= nx * vn * 1.35
        bike.vel.y -= nz * vn * 1.35
      }
      car.hit = 0.9
      car.speed = Math.max(5, car.speed * 0.8)
      car.cooldown = 0.6
      events.push({ type: 'car', impact: Math.max(2, -vn), x: cx, z: cz })
    }
    const PR = 1.05
    for (const ped of this.peds) {
      if (ped.knocked > 0 || ped.x === undefined) continue
      const dx = bike.pos.x - ped.x
      const dz = bike.pos.z - ped.z
      if (dx * dx + dz * dz > PR * PR) continue
      if (bike.vel.length() > 2.5) {
        ped.knocked = 5
        bike.vel.multiplyScalar(0.94)
        events.push({ type: 'ped', x: ped.x, z: ped.z })
      }
    }
    return events
  }
}
