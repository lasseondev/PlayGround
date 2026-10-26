import { CITY } from './world.js'
import { angleDiff, clamp, rand } from './utils.js'

const N = CITY.GRID + 1
const COORDS = CITY.ROAD_COORDS

function nearestNode(pos) {
  let bi = 0
  let bj = 0
  let best = Infinity
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const dx = pos.x - COORDS[i]
      const dz = pos.z - COORDS[j]
      const d = dx * dx + dz * dz
      if (d < best) {
        best = d
        bi = i
        bj = j
      }
    }
  }
  return [bi, bj]
}

function bfs(start, goal) {
  const key = (i, j) => i * N + j
  const prev = new Map()
  const queue = [start]
  const seen = new Set([key(start[0], start[1])])
  while (queue.length) {
    const cur = queue.shift()
    if (cur[0] === goal[0] && cur[1] === goal[1]) {
      const path = []
      let k = key(cur[0], cur[1])
      let node = cur
      while (node) {
        path.unshift({ x: COORDS[node[0]], z: COORDS[node[1]] })
        node = prev.get(k)
        if (node) k = key(node[0], node[1])
      }
      path.shift()
      return path
    }
    const neighbors = [
      [cur[0] + 1, cur[1]],
      [cur[0] - 1, cur[1]],
      [cur[0], cur[1] + 1],
      [cur[0], cur[1] - 1]
    ]
    for (const nb of neighbors) {
      if (nb[0] < 0 || nb[0] >= N || nb[1] < 0 || nb[1] >= N) continue
      const k = key(nb[0], nb[1])
      if (seen.has(k)) continue
      seen.add(k)
      prev.set(k, cur)
      queue.push(nb)
    }
  }
  return []
}

export class PoliceUnit {
  constructor(scene, world, car, player) {
    this.scene = scene
    this.world = world
    this.car = car
    this.player = player
    this.path = []
    this.stuck = 0
    this.reverseTimer = 0
    this.despawnTimer = 0
    this.officerCooldown = 0.8
    this.officersSpawned = 0
    this.repathTimer = 0
    this.remove = false
    this.ramCooldown = 0
    this.setPathTo(this.playerTarget())
  }

  playerTarget() {
    return this.player.inCar ? this.player.inCar.pos : this.player.pos
  }

  setPathTo(target) {
    const start = nearestNode(this.car.pos)
    const goal = nearestNode(target)
    this.path = bfs(start, goal)
  }

  update(dt, elapsed, colliders, wanted, spawnOfficer) {
    const car = this.car
    if (car.destroyed) {
      this.remove = true
      return
    }
    const targetPos = this.playerTarget()
    const dx = targetPos.x - car.pos.x
    const dz = targetPos.z - car.pos.z
    const dist = Math.hypot(dx, dz)
    const onFoot = !this.player.inCar

    if (wanted <= 0) {
      this.despawnTimer += dt
      car.updateSiren(elapsed, false)
      const away = Math.atan2(-dx, -dz)
      const diff = angleDiff(car.heading, away)
      car.applyInput(
        dt,
        { throttle: 0.35, brake: 0, steer: clamp(diff * 1.4, -1, 1) },
        colliders
      )
      if (this.despawnTimer > 7 || dist > 320) this.remove = true
      return
    }

    this.despawnTimer = 0
    car.updateSiren(elapsed, true)
    if (this.repathTimer <= 0) {
      this.setPathTo(targetPos)
      this.repathTimer = 4.5
    }
    this.repathTimer -= dt

    if (onFoot && dist < 40) {
      this.officerCooldown -= dt
      if (this.officerCooldown <= 0 && this.officersSpawned < 2) {
        const right = { x: Math.cos(car.heading), z: -Math.sin(car.heading) }
        const spot = car.pos.clone().add({ x: right.x * 2.4, y: 0, z: right.z * 2.4 })
        if (spawnOfficer(spot)) {
          this.officersSpawned++
          this.officerCooldown = 3.5
        }
      }
    }

    if (onFoot && dist < 32) {
      const stopDiff = angleDiff(car.heading, Math.atan2(dx, dz))
      if (Math.abs(car.speed) > 0.8) {
        car.applyInput(
          dt,
          { throttle: 0, brake: 1, steer: clamp(stopDiff * 0.8, -0.5, 0.5) },
          colliders
        )
      } else {
        car.applyInput(dt, { throttle: 0, brake: 0, steer: 0 }, colliders)
      }
      return
    }

    while (this.path.length) {
      const node = this.path[0]
      const nd = Math.hypot(node.x - car.pos.x, node.z - car.pos.z)
      if (nd < 7) this.path.shift()
      else break
    }

    let target = this.path.length ? this.path[0] : targetPos
    if (dist < 34) target = targetPos

    const tdx = target.x - car.pos.x
    const tdz = target.z - car.pos.z
    const tdist = Math.hypot(tdx, tdz)
    const desired = Math.atan2(tdx, tdz)
    const diff = angleDiff(car.heading, desired)
    let steer = clamp(diff * 1.9, -1, 1)
    let throttle = Math.abs(diff) > 1.35 ? 0.3 : 1
    let brake = 0
    if (dist < 11) {
      throttle = 0
      brake = 1
    } else if (tdist < 6 && !this.path.length) {
      throttle = 0.4
    }
    if (this.path.length >= 2 && tdist < 38) {
      const next = this.path[1]
      const turn = Math.abs(angleDiff(car.heading, Math.atan2(next.x - this.path[0].x, next.z - this.path[0].z)))
      const speed = Math.abs(car.speed)
      if (turn > 0.55 && speed > 11) {
        throttle = 0
        brake = 1
      } else if (turn > 0.55) {
        throttle = Math.min(throttle, 0.35)
      }
    }
    if (Math.abs(diff) > 0.7 && Math.abs(car.speed) > 14) {
      throttle = 0
      brake = 1
    }

    if (this.reverseTimer > 0) {
      this.reverseTimer -= dt
      throttle = 0
      brake = 1
      steer = -steer
    } else {
      if (Math.abs(car.speed) < 1.2 && throttle > 0) this.stuck += dt
      else this.stuck = 0
      if (this.stuck > 2.2) {
        this.reverseTimer = 1.1
        this.stuck = 0
        this.repathTimer = 0
      }
    }

    car.applyInput(dt, { throttle, brake, steer, handbrake: false }, colliders)
    if (this.ramCooldown > 0) this.ramCooldown -= dt
  }
}

export function randomRoadSpawn(playerPos, existingCars) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const i = Math.floor(rand(0, N))
    const j = Math.floor(rand(0, N))
    const x = COORDS[i]
    const z = COORDS[j]
    const dx = x - playerPos.x
    const dz = z - playerPos.z
    const d = Math.hypot(dx, dz)
    if (d < 50 || d > 105) continue
    let clear = true
    for (const car of existingCars) {
      if (car.destroyed) continue
      if (Math.hypot(car.pos.x - x, car.pos.z - z) < 14) {
        clear = false
        break
      }
    }
    if (!clear) continue
    return { x, z }
  }
  return null
}
