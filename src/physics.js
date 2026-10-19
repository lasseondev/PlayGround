export const ARENA = Object.freeze({
  halfWidth: 30,
  halfLength: 45,
  wallHeight: 13,
  cornerRadius: 8,
  goalWidth: 19,
  goalHeight: 9,
  goalDepth: 6,
  ceiling: 27,
  carY: 1.06,
  carRadius: 1.9
})

export const BALL = Object.freeze({
  radius: 2.2,
  gravity: 32,
  restitution: 0.62,
  wallRestitution: 0.72,
  airDrag: 0.055,
  rollFriction: 1.15
})

export const CAR = Object.freeze({
  radius: 1.55,
  halfWidth: 1.32,
  halfHeight: 0.78,
  halfLength: 2.3,
  accel: 31,
  reverseAccel: 17,
  boostAccel: 43,
  maxSpeed: 31,
  maxBoostSpeed: 54,
  maxReverse: 15,
  turnRate: 2.45,
  grip: 8.4,
  airGrip: 0.55,
  gravity: 37,
  jumpSpeed: 14.5,
  doubleJumpSpeed: 12,
  flipSpeed: 19,
  boostDrain: 33,
  boostRegenPad: 0
})

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
const len2 = (x, z) => Math.hypot(x, z)

export function wrapAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

export function forwardOf(yaw) {
  return { x: Math.sin(yaw), z: Math.cos(yaw) }
}

export function createBall() {
  return { x: 0, y: BALL.radius, z: 0, vx: 0, vy: 0, vz: 0, r: BALL.radius }
}

export function resetBall(ball) {
  ball.x = 0
  ball.y = BALL.radius
  ball.z = 0
  ball.vx = 0
  ball.vy = 0
  ball.vz = 0
}

export function createCar(team, yaw = 0, z = 0) {
  return {
    team,
    x: 0,
    y: ARENA.carY,
    z,
    vx: 0,
    vy: 0,
    vz: 0,
    yaw,
    boost: 100,
    onGround: true,
    jumps: 0,
    flip: 0,
    flipDir: 0,
    boosting: false,
    hitTimer: 0
  }
}

export function resetCar(car, z, yaw) {
  car.x = 0
  car.y = ARENA.carY
  car.z = z
  car.vx = 0
  car.vy = 0
  car.vz = 0
  car.yaw = yaw
  car.boost = 100
  car.onGround = true
  car.jumps = 0
  car.flip = 0
  car.boosting = false
  car.hitTimer = 0
}

function reflect(body, nx, nz, restitution) {
  const vn = body.vx * nx + body.vz * nz
  if (vn > 0) {
    body.vx -= (1 + restitution) * vn * nx
    body.vz -= (1 + restitution) * vn * nz
  }
}

export function collideBoundary(body, radius, { allowGoals = false } = {}) {
  const { halfWidth, halfLength, cornerRadius, goalWidth, goalHeight } = ARENA
  const ax = Math.abs(body.x)
  const az = Math.abs(body.z)
  const sx = Math.sign(body.x) || 1
  const sz = Math.sign(body.z) || 1
  const maxX = halfWidth - radius
  const maxZ = halfLength - radius
  const cornerX = halfWidth - cornerRadius
  const cornerZ = halfLength - cornerRadius

  if (ax > cornerX && az > cornerZ) {
    const cx = sx * cornerX
    const cz = sz * cornerZ
    const dx = body.x - cx
    const dz = body.z - cz
    const dist = Math.hypot(dx, dz)
    const maxDist = cornerRadius - radius
    if (maxDist > 0 && dist > maxDist) {
      const nx = dist > 1e-5 ? dx / dist : sx * 0.7071
      const nz = dist > 1e-5 ? dz / dist : sz * 0.7071
      body.x = cx + nx * maxDist
      body.z = cz + nz * maxDist
      reflect(body, nx, nz, BALL.wallRestitution)
    }
    return null
  }

  if (ax > maxX) {
    body.x = sx * maxX
    reflect(body, sx, 0, BALL.wallRestitution)
  }

  const inMouth =
    allowGoals &&
    Math.abs(body.x) < goalWidth / 2 - radius * 0.15 &&
    body.y < goalHeight - radius * 0.15

  if (az > maxZ && !inMouth) {
    body.z = sz * maxZ
    reflect(body, 0, sz, BALL.wallRestitution)
  }

  return null
}

function containGoal(ball) {
  const { halfLength, goalWidth, goalHeight, goalDepth } = ARENA
  const r = ball.r
  if (Math.abs(ball.z) <= halfLength - r * 0.5) return
  const sx = Math.sign(ball.z) || 1
  const limitX = goalWidth / 2 - r
  if (Math.abs(ball.x) > limitX) {
    ball.x = Math.sign(ball.x) * limitX
    reflect(ball, Math.sign(ball.x), 0, 0.35)
  }
  if (ball.y > goalHeight - r) {
    ball.y = goalHeight - r
    if (ball.vy > 0) ball.vy *= -0.3
  }
  if (Math.abs(ball.z) > halfLength + goalDepth - r) {
    ball.z = sx * (halfLength + goalDepth - r)
    reflect(ball, 0, sx, 0.28)
  }
}

export function detectGoal(ball) {
  const { halfLength, goalWidth, goalHeight } = ARENA
  const insideX = Math.abs(ball.x) < goalWidth / 2
  const insideY = ball.y < goalHeight
  if (!insideX || !insideY) return null
  if (ball.z < -halfLength - ball.r * 0.45) return 'orange'
  if (ball.z > halfLength + ball.r * 0.45) return 'blue'
  return null
}

export function stepBall(ball, dt) {
  const r = ball.r
  ball.vy -= BALL.gravity * dt
  const drag = Math.exp(-BALL.airDrag * dt)
  ball.vx *= drag
  ball.vz *= drag
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  ball.z += ball.vz * dt

  if (ball.y < r) {
    ball.y = r
    if (ball.vy < -1.4) {
      ball.vy = -ball.vy * BALL.restitution
    } else {
      ball.vy = 0
    }
    const friction = Math.exp(-BALL.rollFriction * dt)
    ball.vx *= friction
    ball.vz *= friction
  }

  if (ball.y > ARENA.ceiling - r) {
    ball.y = ARENA.ceiling - r
    if (ball.vy > 0) ball.vy *= -0.45
  }

  collideBoundary(ball, r, { allowGoals: true })
  containGoal(ball)

  const goal = detectGoal(ball)
  return { goal, speed: len2(ball.vx, ball.vz) }
}

export function stepCar(car, input, dt) {
  const throttle = clamp(input.throttle || 0, -1, 1)
  const steer = clamp(input.steer || 0, -1, 1)
  const wantsBoost = Boolean(input.boost)
  const jump = Boolean(input.jump)

  car.flip = Math.max(0, car.flip - dt)
  car.hitTimer = Math.max(0, car.hitTimer - dt)

  let forward = forwardOf(car.yaw)
  let right = { x: Math.cos(car.yaw), z: -Math.sin(car.yaw) }
  let vf = car.vx * forward.x + car.vz * forward.z
  let vr = car.vx * right.x + car.vz * right.z

  if (car.onGround) {
    const speed = Math.hypot(car.vx, car.vz)
    const authority = clamp(0.34 + speed / 13, 0.34, 1.12)
    const reverseSign = vf < -1 ? -1 : 1
    car.yaw += steer * CAR.turnRate * authority * reverseSign * dt

    forward = forwardOf(car.yaw)
    right = { x: Math.cos(car.yaw), z: -Math.sin(car.yaw) }

    if (throttle > 0) {
      vf += CAR.accel * throttle * dt
    } else if (throttle < 0 && vf > -CAR.maxReverse) {
      vf += CAR.reverseAccel * throttle * dt
    }

    car.boosting = wantsBoost && car.boost > 0
    if (car.boosting) {
      vf += CAR.boostAccel * dt
      car.boost = Math.max(0, car.boost - CAR.boostDrain * dt)
    }

    vr *= Math.exp(-CAR.grip * dt)
    if (!car.boosting && throttle === 0) vf *= Math.exp(-0.42 * dt)
    if (vf > CAR.maxBoostSpeed) vf = CAR.maxBoostSpeed + (vf - CAR.maxBoostSpeed) * Math.exp(-1.5 * dt)
    if (vf < -CAR.maxReverse) vf = -CAR.maxReverse

    car.vx = forward.x * vf + right.x * vr
    car.vz = forward.z * vf + right.z * vr
    car.vy = 0
  } else {
    car.boosting = wantsBoost && car.boost > 0
    if (car.boosting) {
      car.vx += forward.x * CAR.boostAccel * 0.72 * dt
      car.vz += forward.z * CAR.boostAccel * 0.72 * dt
      car.boost = Math.max(0, car.boost - CAR.boostDrain * 0.8 * dt)
    }
    car.yaw += steer * 1.05 * dt
    const airAccel = throttle * 7.5
    car.vx += forward.x * airAccel * dt
    car.vz += forward.z * airAccel * dt
    const airGrip = Math.exp(-CAR.airGrip * dt)
    car.vx *= airGrip
    car.vz *= airGrip
    car.vy -= CAR.gravity * dt
  }

  if (jump) {
    if (car.onGround) {
      car.vy = CAR.jumpSpeed
      car.onGround = false
      car.jumps = 1
    } else if (car.jumps < 2) {
      const ix = steer
      const iz = throttle
      if (Math.hypot(ix, iz) > 0.16) {
        let dx = forward.x * iz + right.x * ix
        let dz = forward.z * iz + right.z * ix
        const d = Math.hypot(dx, dz) || 1
        dx /= d
        dz /= d
        car.vx += dx * CAR.flipSpeed
        car.vz += dz * CAR.flipSpeed
        car.vy = Math.max(car.vy, 7.2)
        car.yaw = Math.atan2(dx, dz)
        car.flip = 0.62
        car.flipDir = steer
      } else {
        car.vy = Math.max(car.vy, CAR.doubleJumpSpeed)
        car.flip = 0.45
        car.flipDir = 0
      }
      car.jumps = 2
    }
  }

  car.x += car.vx * dt
  car.y += car.vy * dt
  car.z += car.vz * dt

  if (car.y <= ARENA.carY) {
    car.y = ARENA.carY
    if (car.vy < -8) {
      car.vy *= -0.16
    } else {
      car.vy = 0
    }
    if (car.vy <= 0) {
      car.onGround = true
      car.jumps = 0
      car.flip = 0
    }
  } else if (car.y > ARENA.ceiling - 2) {
    car.y = ARENA.ceiling - 2
    if (car.vy > 0) car.vy *= -0.2
  } else if (car.y > ARENA.carY + 0.02) {
    car.onGround = false
  }

  collideBoundary(car, CAR.radius, { allowGoals: false })

  const speed = Math.hypot(car.vx, car.vz)
  if (speed > CAR.maxBoostSpeed * 1.25) {
    car.vx *= 0.985
    car.vz *= 0.985
  }
  return car
}

export function collideBallCar(ball, car) {
  const forward = forwardOf(car.yaw)
  const right = { x: Math.cos(car.yaw), z: -Math.sin(car.yaw) }
  const dx = ball.x - car.x
  const dz = ball.z - car.z
  const local = {
    x: dx * right.x + dz * right.z,
    y: ball.y - car.y,
    z: dx * forward.x + dz * forward.z
  }
  const ex = CAR.halfWidth
  const ey = CAR.halfHeight
  const ez = CAR.halfLength
  const cx = clamp(local.x, -ex, ex)
  const cy = clamp(local.y, -ey, ey)
  const cz = clamp(local.z, -ez, ez)
  let nx = local.x - cx
  let ny = local.y - cy
  let nz = local.z - cz
  let dist = Math.hypot(nx, ny, nz)
  let penetration = 0

  if (dist < 1e-5) {
    const px = ex - Math.abs(local.x)
    const py = ey - Math.abs(local.y)
    const pz = ez - Math.abs(local.z)
    if (px <= py && px <= pz) {
      nx = Math.sign(local.x) || 1
      ny = 0
      nz = 0
      penetration = ball.r + px
    } else if (py <= px && py <= pz) {
      nx = 0
      ny = Math.sign(local.y) || 1
      nz = 0
      penetration = ball.r + py
    } else {
      nx = 0
      ny = 0
      nz = Math.sign(local.z) || 1
      penetration = ball.r + pz
    }
    dist = 0
  } else if (dist < ball.r) {
    penetration = ball.r - dist
    nx /= dist
    ny /= dist
    nz /= dist
  } else {
    return null
  }

  const wx = nx * right.x + nz * forward.x
  const wy = ny
  const wz = nx * right.z + nz * forward.z

  ball.x += wx * penetration
  ball.y += wy * penetration
  ball.z += wz * penetration

  const rel = (ball.vx - car.vx) * wx + (ball.vy - car.vy) * wy + (ball.vz - car.vz) * wz
  const carSpeed = Math.hypot(car.vx, car.vz)
  let power = 0
  if (rel < 0) {
    power = -rel * 1.16 + carSpeed * 0.34
    if (car.boosting) power += 2.6
    power = Math.max(power, 1.5)
    ball.vx += wx * power + car.vx * 0.14
    ball.vz += wz * power + car.vz * 0.14
    ball.vy += wy * power + Math.max(0, carSpeed - 14) * 0.16 + 0.5
    car.vx -= wx * power * 0.055
    car.vz -= wz * power * 0.055
    car.hitTimer = 0.18
  }

  if (ball.vy > 34) ball.vy = 34
  return { power, nx: wx, ny: wy, nz: wz }
}

export function collideCars(a, b) {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const dist = Math.hypot(dx, dz)
  const minDist = CAR.radius * 2.05
  if (dist >= minDist || dist < 1e-5) return null
  const nx = dx / dist
  const nz = dz / dist
  const overlap = minDist - dist
  a.x -= nx * overlap * 0.5
  a.z -= nz * overlap * 0.5
  b.x += nx * overlap * 0.5
  b.z += nz * overlap * 0.5
  const rel = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz
  if (rel < 0) {
    const impulse = -rel * 0.55
    a.vx -= nx * impulse
    a.vz -= nz * impulse
    b.vx += nx * impulse
    b.vz += nz * impulse
  }
  return { power: Math.abs(rel) }
}

export function computeAIInput(car, ball, attackGoalZ = -ARENA.halfLength, skill = 1) {
  const bx = ball.x
  const bz = ball.z
  const gx = bx - 0
  const gz = bz - attackGoalZ
  const gl = Math.hypot(gx, gz) || 1
  const behindX = bx + (gx / gl) * (7.4 + Math.min(4, Math.hypot(ball.vx, ball.vz) * 0.16))
  const behindZ = bz + (gz / gl) * (7.4 + Math.min(4, Math.hypot(ball.vx, ball.vz) * 0.16))
  const distBall = Math.hypot(bx - car.x, bz - car.z)
  const targetX = distBall < 12 ? bx : behindX
  const targetZ = distBall < 12 ? bz : behindZ
  let dx = targetX - car.x
  let dz = targetZ - car.z
  const distTarget = Math.hypot(dx, dz)
  const angle = Math.atan2(dx, dz)
  const diff = wrapAngle(angle - car.yaw)
  const absDiff = Math.abs(diff)
  let steer = clamp(diff * 2.15, -1, 1)
  const speed = Math.hypot(car.vx, car.vz)

  let throttle = absDiff < 1.28 ? 1 : 0.48
  if (absDiff > 2.35 && distTarget < 10) throttle = -1
  if (distTarget < 2.2) throttle = 0.55

  const ballGoalDistance = Math.abs(bz - attackGoalZ)
  const shootingLane = Math.abs(diff) < 0.34
  let boost = car.boost > 6 && shootingLane && (distBall > 13 || ballGoalDistance < 27) && speed < 48
  if (skill < 0.8 && distBall > 24) boost = boost && Math.random() < 0.55

  const ballHigh = ball.y > car.y + 2.4
  const jump = ballHigh && distBall < 6.4 && Math.random() < 0.16 * skill
  const reverse = throttle < 0 && distTarget < 8

  if (speed < 2.5 && distTarget > 13) throttle = Math.max(throttle, 0.8)
  if (Math.abs(car.x) > ARENA.halfWidth - 4) steer += -Math.sign(car.x) * 0.32
  steer = clamp(steer, -1, 1)

  return {
    throttle: reverse ? -1 : throttle,
    steer,
    boost,
    jump,
    skill
  }
}

export function speedOf(body) {
  return Math.hypot(body.vx, body.vy, body.vz)
}
