import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ARENA,
  BALL,
  createBall,
  resetBall,
  createCar,
  resetCar,
  stepBall,
  stepCar,
  collideBallCar,
  detectGoal,
  computeAIInput
} from '../src/physics.js'

test('ball falls, bounces, and settles on the pitch', () => {
  const ball = createBall()
  ball.y = 14
  ball.vy = 1
  for (let i = 0; i < 600; i++) stepBall(ball, 1 / 120)
  assert.ok(ball.y >= BALL.radius - 0.01)
  assert.ok(ball.y < BALL.radius + 0.25)
  assert.ok(Math.abs(ball.vy) < 2.5)
})

test('ball bounces off the side wall', () => {
  const ball = createBall()
  ball.x = 20
  ball.z = 0
  ball.vx = 30
  for (let i = 0; i < 240; i++) stepBall(ball, 1 / 120)
  assert.ok(ball.x <= ARENA.halfWidth - BALL.radius + 0.02)
  assert.ok(ball.vx <= 0)
})

test('ball can enter the blue goal and reports an orange score', () => {
  const ball = createBall()
  ball.z = -ARENA.halfLength - 1
  ball.vz = -10
  const result = stepBall(ball, 1 / 120)
  assert.equal(result.goal, 'orange')
  assert.equal(detectGoal(ball), 'orange')
})

test('ball is blocked by the end wall outside the goal mouth', () => {
  const ball = createBall()
  ball.x = 20
  ball.z = ARENA.halfLength - 3
  ball.vz = 28
  for (let i = 0; i < 120; i++) stepBall(ball, 1 / 120)
  assert.ok(ball.z <= ARENA.halfLength - BALL.radius + 0.02)
  assert.ok(ball.vz <= 0)
})

test('throttle accelerates the car forward along its heading', () => {
  const car = createCar('blue', 0, -20)
  const input = { throttle: 1, steer: 0, boost: false, jump: false }
  for (let i = 0; i < 120; i++) stepCar(car, input, 1 / 120)
  assert.ok(car.z > -20 + 4)
  assert.ok(car.vz > 8)
  assert.ok(car.onGround)
})

test('boost accelerates harder and drains the tank', () => {
  const normal = createCar('blue', 0, -20)
  const boosted = createCar('blue', 0, -20)
  for (let i = 0; i < 120; i++) {
    stepCar(normal, { throttle: 1, steer: 0, boost: false, jump: false }, 1 / 120)
    stepCar(boosted, { throttle: 1, steer: 0, boost: true, jump: false }, 1 / 120)
  }
  assert.ok(boosted.vz > normal.vz)
  assert.ok(boosted.boost < 70)
})

test('jump leaves the ground and double jump can dodge', () => {
  const car = createCar('blue', 0, 0)
  stepCar(car, { throttle: 0, steer: 0, boost: false, jump: true }, 1 / 120)
  assert.equal(car.onGround, false)
  assert.ok(car.vy > 10)
  for (let i = 0; i < 8; i++) stepCar(car, { throttle: 1, steer: 1, boost: false, jump: false }, 1 / 120)
  const before = Math.hypot(car.vx, car.vz)
  stepCar(car, { throttle: 1, steer: 1, boost: false, jump: true }, 1 / 120)
  assert.equal(car.jumps, 2)
  assert.ok(Math.hypot(car.vx, car.vz) > before + 5)
})

test('car contact launches the ball forward', () => {
  const car = createCar('blue', 0, 0)
  car.vz = 24
  const ball = createBall()
  ball.z = 4.1
  const hit = collideBallCar(ball, car)
  assert.ok(hit)
  assert.ok(hit.power > 10)
  assert.ok(ball.vz > 20)
  assert.ok(ball.y > BALL.radius)
})

test('AI drives toward the play instead of its own goal', () => {
  const car = createCar('orange', Math.PI, 20)
  const ball = createBall()
  const input = computeAIInput(car, ball, -ARENA.halfLength, 1)
  assert.ok(input.throttle > 0.4)
  assert.ok(Math.abs(input.steer) < 0.2)
})

test('reset helpers return entities to regulation kickoff state', () => {
  const car = createCar('blue', 1, 18)
  car.boost = 4
  car.vx = 20
  resetCar(car, -27, 0)
  assert.equal(car.z, -27)
  assert.equal(car.yaw, 0)
  assert.equal(car.boost, 100)
  assert.equal(car.vx, 0)

  const ball = createBall()
  ball.x = 12
  ball.vz = 18
  resetBall(ball)
  assert.deepEqual([ball.x, ball.y, ball.z, ball.vz], [0, BALL.radius, 0, 0])
})
