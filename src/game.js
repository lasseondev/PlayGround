import * as THREE from 'three'
import {
  ARENA,
  createBall,
  resetBall,
  createCar,
  resetCar,
  stepBall,
  stepCar,
  collideBallCar,
  collideCars,
  computeAIInput,
  detectGoal,
  forwardOf
} from './physics.js'
import { createWorld } from './world.js'
import { createCarVisual } from './car.js'
import { createBallVisual, ParticleField } from './ball.js'
import { GameAudio } from './audio.js'

const $ = (id) => document.getElementById(id)
const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export class RocketRumble {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.02
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 420)
    this.camera.position.set(0, 26, 62)
    this.camera.lookAt(0, 2, 0)

    this.world = createWorld(this.scene, this.renderer)
    this.particles = new ParticleField(this.scene, this.world.sparkTexture, 300)

    this.ball = createBall()
    this.player = createCar('blue', 0, -27)
    this.ai = createCar('orange', Math.PI, 27)
    this.playerVisual = createCarVisual(this.scene, 'blue', true)
    this.aiVisual = createCarVisual(this.scene, 'orange', false)
    this.ballVisual = createBallVisual(this.scene, this.particles)
    this.audio = new GameAudio()

    this.ui = {
      hud: $('hud'),
      menu: $('menu'),
      howPanel: $('howPanel'),
      pause: $('pause'),
      results: $('results'),
      loading: $('loading'),
      announcer: $('announcer'),
      announceMain: $('announceMain'),
      announceSub: $('announceSub'),
      blueScore: $('blueScore'),
      orangeScore: $('orangeScore'),
      clock: $('clock'),
      stage: $('stage'),
      speed: $('speed'),
      boostRing: $('boostRing'),
      boostValue: $('boostValue'),
      cameraLabel: $('cameraLabel'),
      hint: $('hint'),
      pauseScore: $('pauseScore'),
      resultTitle: $('resultTitle'),
      resultScore: $('resultScore'),
      resultSub: $('resultSub'),
      goalFlash: $('goalFlash'),
      soundBtn: $('soundBtn'),
      soundOn: document.querySelector('#soundBtn .sound-on'),
      soundOff: document.querySelector('#soundBtn .sound-off'),
      touchControls: $('touchControls')
    }

    this.state = 'menu'
    this.prevState = 'menu'
    this.blueScore = 0
    this.orangeScore = 0
    this.matchTime = 180
    this.overtime = false
    this.otElapsed = 0
    this.goalTimer = 0
    this.countdownTimer = 0
    this.countdownIntro = 0
    this.lastAnnounced = 0
    this.pendingEnd = false
    this.ballCam = true
    this.muted = false
    this.shake = 0
    this.elapsed = 0
    this.last = performance.now()
    this.accum = 0
    this.hitCooldown = { blue: 0, orange: 0 }
    this.trailTimer = { blue: 0, orange: 0 }
    this.keys = new Set()
    this.touch = { throttle: false, brake: false, left: false, right: false, boost: false }
    this.jumpQueued = false
    this.gamepad = { steer: 0, throttle: 0, boost: false, jump: false }
    this.gamepadJumpPrev = false
    this.lastPlayerInput = { throttle: 0, steer: 0, boost: false, jump: false }
    this.lastAIInput = { throttle: 0, steer: 0, boost: false, jump: false }
    this.camPos = new THREE.Vector3(0, 26, 62)
    this.camLook = new THREE.Vector3(0, 2, 0)
    this.announceTimer = null
    this.screenKey = ''
    this.ready = false
    this.matchSerial = 0

    this.resetPositions()
    this.snapMenuCamera()
    this.bindEvents()
    this.resize()
    this.updateHUD()
    this.updateScreen(true)

    this.tick = this.tick.bind(this)
    requestAnimationFrame(this.tick)
  }

  resetPositions() {
    resetBall(this.ball)
    resetCar(this.player, -27, Math.atan2(5.5, 27))
    resetCar(this.ai, 27, Math.atan2(-5.5, -27))
    this.player.x = -5.5
    this.ai.x = 5.5
    this.player.boost = 100
    this.ai.boost = 100
  }

  snapMenuCamera() {
    const angle = this.elapsed * 0.105 + 0.6
    this.camPos.set(Math.sin(angle) * 61, 29.5, Math.cos(angle) * 66)
    this.camLook.set(0, 2.2, 0)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLook)
    this.camera.fov = 58
    this.camera.updateProjectionMatrix()
  }

  snapCamera() {
    const forward = forwardOf(this.player.yaw)
    const speed = Math.hypot(this.player.vx, this.player.vz)
    const back = 11.3 + speed * 0.052
    const height = 4.7 + Math.max(0, this.player.y - 1) * 0.26
    this.camPos.set(
      this.player.x - forward.x * back,
      this.player.y + height,
      this.player.z - forward.z * back
    )
    this.camLook.set(this.ball.x, this.ball.y, this.ball.z)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLook)
    this.camera.fov = 66
    this.camera.updateProjectionMatrix()
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize())

    window.addEventListener('keydown', (event) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault()
      }
      this.audio.ensure()

      if (event.code === 'Space' && !event.repeat) this.jumpQueued = true
      if (!event.repeat && event.code === 'KeyC') this.toggleCamera()
      if (!event.repeat && event.code === 'Escape') this.togglePause()
      if (!event.repeat && event.code === 'KeyR') {
        if (this.state === 'ended') this.startMatch()
        else if (['playing', 'countdown', 'goal', 'paused'].includes(this.state)) this.restartKickoff()
      }
      if (!event.repeat && event.code === 'Enter') {
        if (this.state === 'menu' || this.state === 'ended') this.startMatch()
        else if (this.state === 'paused') this.togglePause()
      }

      this.keys.add(event.code)
    })

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code)
    })

    window.addEventListener('blur', () => {
      this.keys.clear()
      this.touch = { throttle: false, brake: false, left: false, right: false, boost: false }
    })

    $('playBtn').addEventListener('click', () => this.startMatch())
    $('howBtn').addEventListener('click', () => {
      this.audio.ensure()
      this.audio.ui()
      this.ui.howPanel.classList.remove('is-hidden')
    })
    $('howClose').addEventListener('click', () => this.ui.howPanel.classList.add('is-hidden'))
    $('pauseBtn').addEventListener('click', () => this.togglePause())
    $('resumeBtn').addEventListener('click', () => this.togglePause())
    $('restartBtn').addEventListener('click', () => {
      this.ui.pause.classList.add('is-hidden')
      this.restartKickoff()
    })
    $('againBtn').addEventListener('click', () => this.startMatch())
    $('menuBtn').addEventListener('click', () => this.showMenu())
    $('soundBtn').addEventListener('click', () => this.toggleSound())

    const touchButtons = document.querySelectorAll('[data-action]')
    for (const button of touchButtons) {
      const action = button.dataset.action
      const press = (event) => {
        event.preventDefault()
        this.audio.ensure()
        button.classList.add('pressed')
        if (action === 'jump') this.jumpQueued = true
        else this.touch[action] = true
      }
      const release = (event) => {
        if (event) event.preventDefault()
        button.classList.remove('pressed')
        if (action !== 'jump') this.touch[action] = false
      }
      button.addEventListener('pointerdown', press)
      button.addEventListener('pointerup', release)
      button.addEventListener('pointercancel', release)
      button.addEventListener('pointerleave', release)
      button.addEventListener('contextmenu', (event) => event.preventDefault())
    }

    this.canvas.addEventListener('pointerdown', () => this.audio.ensure())
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  startMatch() {
    this.audio.ensure()
    this.audio.ui()
    this.matchSerial++
    this.blueScore = 0
    this.orangeScore = 0
    this.matchTime = 180
    this.overtime = false
    this.otElapsed = 0
    this.pendingEnd = false
    this.ui.menu.classList.add('is-hidden')
    this.ui.howPanel.classList.add('is-hidden')
    this.ui.results.classList.add('is-hidden')
    this.ui.pause.classList.add('is-hidden')
    this.ui.hud.classList.remove('is-hidden')
    this.updateScoreboard()
    this.updateScreen(true)
    this.kickoff(3.1, 'KICKOFF')
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }

  kickoff(seconds = 3, label = 'KICKOFF') {
    this.resetPositions()
    this.world.resetPads()
    this.particles.clear()
    this.playerVisual.update(this.player, { throttle: 0, steer: 0, boost: false }, 0.016)
    this.aiVisual.update(this.ai, { throttle: 0, steer: 0, boost: false }, 0.016)
    this.state = 'countdown'
    this.snapCamera()
    this.countdownTimer = seconds
    this.countdownIntro = label === 'OVERTIME' ? 1.25 : 0
    this.lastAnnounced = 0
    this.jumpQueued = false
    this.hitCooldown.blue = 0
    this.hitCooldown.orange = 0
    this.ui.pause.classList.add('is-hidden')
    if (label === 'OVERTIME') {
      this.showAnnounce('OVERTIME', 'NEXT GOAL WINS', 'orange', 1.35)
    } else {
      this.showAnnounce('3', 'KICKOFF', 'blue', 0.9)
      this.audio.countdown(false)
    }
    this.updateScreen(true)
  }

  restartKickoff() {
    if (!['playing', 'countdown', 'goal', 'paused'].includes(this.state)) return
    this.audio.ui()
    this.state = 'countdown'
    this.kickoff(2.7, 'KICKOFF')
  }

  showMenu() {
    this.state = 'menu'
    this.blueScore = 0
    this.orangeScore = 0
    this.matchTime = 180
    this.overtime = false
    this.otElapsed = 0
    this.ui.results.classList.add('is-hidden')
    this.ui.pause.classList.add('is-hidden')
    this.ui.hud.classList.add('is-hidden')
    this.ui.menu.classList.remove('is-hidden')
    this.resetPositions()
    this.world.resetPads()
    this.particles.clear()
    this.updateScoreboard()
    this.updateScreen(true)
    this.snapMenuCamera()
    this.audio.setEngine(0, false, false)
  }

  togglePause() {
    if (this.state === 'paused') {
      this.state = this.prevState
      this.ui.pause.classList.add('is-hidden')
      this.audio.ui()
      this.last = performance.now()
      return
    }
    if (!['playing', 'countdown', 'goal'].includes(this.state)) return
    this.prevState = this.state
    this.state = 'paused'
    this.ui.pauseScore.textContent = `BLUE ${this.blueScore} — ${this.orangeScore} ORANGE`
    this.ui.pause.classList.remove('is-hidden')
    this.audio.ui()
    this.audio.setEngine(0, false, false)
  }

  toggleCamera() {
    this.ballCam = !this.ballCam
    this.ui.cameraLabel.textContent = this.ballCam ? 'BALL CAM' : 'CHASE CAM'
    this.audio.ui()
  }

  toggleSound() {
    this.muted = !this.muted
    this.audio.ensure()
    this.audio.setMuted(this.muted)
    this.ui.soundOn.classList.toggle('is-hidden', this.muted)
    this.ui.soundOff.classList.toggle('is-hidden', !this.muted)
    this.ui.soundBtn.setAttribute('aria-label', this.muted ? 'Unmute sound' : 'Mute sound')
    this.ui.soundBtn.title = this.muted ? 'Unmute sound' : 'Mute sound'
    if (!this.muted) this.audio.ui()
  }

  pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : []
    const pad = [...pads].find((item) => item && item.connected)
    if (!pad) {
      this.gamepad.jump = false
      this.gamepadJumpPrev = false
      return
    }
    const axes = pad.axes || []
    const steer = Math.abs(axes[0] || 0) > 0.16 ? axes[0] : 0
    const throttleAxis = axes[1] || 0
    const throttle = Math.abs(throttleAxis) > 0.16 ? -throttleAxis : 0
    const boost = Boolean(pad.buttons?.[1]?.pressed) || (pad.buttons?.[7]?.value || 0) > 0.3
    const jump = Boolean(pad.buttons?.[0]?.pressed)
    if (jump && !this.gamepadJumpPrev) this.jumpQueued = true
    this.gamepadJumpPrev = jump
    this.gamepad = { steer, throttle, boost, jump }
  }

  readInput() {
    const key = (code) => this.keys.has(code)
    let throttle =
      (key('KeyW') || key('ArrowUp') || this.touch.throttle ? 1 : 0) -
      (key('KeyS') || key('ArrowDown') || this.touch.brake ? 1 : 0)
    let steer =
      (key('KeyD') || key('ArrowRight') || this.touch.right ? 1 : 0) -
      (key('KeyA') || key('ArrowLeft') || this.touch.left ? 1 : 0)
    let boost = key('ShiftLeft') || key('ShiftRight') || this.touch.boost
    let boostAxis = 0

    if (Math.abs(this.gamepad.steer) > 0) {
      steer = this.gamepad.steer
      boostAxis = 1
    }
    if (Math.abs(this.gamepad.throttle) > 0) {
      throttle = this.gamepad.throttle
      boostAxis = 1
    }
    if (this.gamepad.boost) boost = true
    if (boostAxis && !boost) boost = false

    const jump = this.jumpQueued
    this.jumpQueued = false
    return {
      throttle: clamp(throttle, -1, 1),
      steer: clamp(steer, -1, 1),
      boost,
      jump
    }
  }

  collectPads(dt) {
    for (const pad of this.world.pads) {
      if (!pad.active) {
        pad.respawn -= dt
        if (pad.respawn <= 0) {
          pad.active = true
          pad.group.visible = true
        }
        continue
      }
      for (const [car, team, isPlayer] of [
        [this.player, 'blue', true],
        [this.ai, 'orange', false]
      ]) {
        if (car.boost > 98 || car.y > 4) continue
        if (Math.hypot(car.x - pad.x, car.z - pad.z) < pad.radius) {
          car.boost = Math.min(100, car.boost + pad.amount)
          pad.active = false
          pad.respawn = pad.big ? 9 : 5
          pad.group.visible = false
          if (isPlayer) {
            this.audio.boostPad(pad.big)
            this.particles.emit(pad.x, 1.1, pad.z, pad.big ? 0xffc56b : 0x7df1ff, {
              count: pad.big ? 16 : 8,
              speed: pad.big ? 6.5 : 4,
              size: pad.big ? 1.6 : 1,
              life: 0.55,
              gravity: 2,
              spread: 1
            })
          }
          break
        }
      }
    }
  }

  fixedUpdate(dt) {
    if (this.state === 'playing') {
      const input = this.readInput()
      this.lastPlayerInput = input
      stepCar(this.player, input, dt)
      const aiInput = computeAIInput(this.ai, this.ball, -ARENA.halfLength, 0.84)
      aiInput.jump = aiInput.jump && Math.random() < 0.45
      this.lastAIInput = aiInput
      stepCar(this.ai, aiInput, dt)
      collideCars(this.player, this.ai)

      const ballState = stepBall(this.ball, dt)

      const hitPlayer = collideBallCar(this.ball, this.player)
      if (hitPlayer) this.registerHit('blue', hitPlayer)
      const hitAI = collideBallCar(this.ball, this.ai)
      if (hitAI) this.registerHit('orange', hitAI)

      this.collectPads(dt)

      const goal = ballState.goal || detectGoal(this.ball)
      if (goal) {
        this.handleGoal(goal)
        return
      }
      return
    }

    if (this.state === 'goal') {
      const idle = { throttle: 0, steer: 0, boost: false, jump: false }
      stepCar(this.player, idle, dt)
      stepCar(this.ai, idle, dt)
      stepBall(this.ball, dt)
      this.goalTimer -= dt
      if (this.goalTimer <= 0) this.resolveGoal()
    }
  }

  frameUpdate(dt) {
    this.elapsed += dt

    if (this.state === 'playing') {
      this.matchTime -= dt
      if (this.overtime) this.otElapsed += dt
      if (!this.overtime && this.matchTime <= 0) {
        this.matchTime = 0
        if (this.blueScore === this.orangeScore) this.startOvertime()
        else this.endMatch()
      }
    }

    if (this.state === 'countdown') {
      this.countdownTimer -= dt
      if (this.countdownIntro > 0) {
        this.countdownIntro -= dt
        if (this.countdownIntro <= 0) this.lastAnnounced = 0
      } else {
        const n = Math.ceil(this.countdownTimer)
        if (n > 0 && n !== this.lastAnnounced) {
          this.lastAnnounced = n
          this.showAnnounce(String(n), this.overtime ? 'OVERTIME' : 'KICKOFF', n === 1 ? 'orange' : 'blue', 0.85)
          this.audio.countdown(false)
        }
      }
      if (this.countdownTimer <= 0) {
        this.state = 'playing'
        this.lastAnnounced = 0
        this.showAnnounce('GO!', this.overtime ? 'GOLDEN GOAL' : 'RANKED 1V1', 'blue', 0.8)
        this.audio.countdown(true)
      }
    }

    if (this.state === 'menu') {
      this.playerVisual.update(this.player, { throttle: 0, steer: 0, boost: false }, dt)
      this.aiVisual.update(this.ai, { throttle: 0, steer: 0, boost: false }, dt)
    } else {
      this.playerVisual.update(this.player, this.lastPlayerInput, dt)
      this.aiVisual.update(this.ai, this.lastAIInput, dt)
    }

    this.ballVisual.update(this.ball, dt)
    this.emitTrails(dt)
    this.updateCamera(dt)
    this.updateHUD()
    this.updateScreen(false)

    const active = ['playing', 'countdown', 'goal'].includes(this.state)
    if (active) {
      const speed = Math.hypot(this.player.vx, this.player.vz)
      this.audio.setEngine(speed, this.player.boosting, true)
    } else if (this.state !== 'paused') {
      this.audio.setEngine(0, false, false)
    }
  }

  emitTrails(dt) {
    for (const [car, team, visualState] of [
      [this.player, 'blue', this.playerVisual],
      [this.ai, 'orange', this.aiVisual]
    ]) {
      if (!car.boosting) continue
      this.trailTimer[team] -= dt
      if (this.trailTimer[team] > 0) continue
      this.trailTimer[team] = 0.028
      const forward = forwardOf(car.yaw)
      const right = { x: Math.cos(car.yaw), z: -Math.sin(car.yaw) }
      for (const side of [-1, 1]) {
        const x = car.x - forward.x * 2.45 + right.x * side * 0.5
        const y = car.y - 0.04
        const z = car.z - forward.z * 2.45 + right.z * side * 0.5
        this.particles.emit(x, y, z, visualState.colors.trail, {
          count: 1,
          speed: 0.9,
          size: 1.05,
          life: 0.34,
          gravity: -1.6,
          drag: 3.2,
          spread: 0.55,
          direction: { x: -forward.x * 0.6, y: 0.1, z: -forward.z * 0.6 }
        })
      }
    }
  }

  registerHit(team, hit) {
    this.hitCooldown[team] = Math.max(0, this.hitCooldown[team] - 0.016)
    if (hit.power < 1.2 || this.hitCooldown[team] > 0) return
    this.hitCooldown[team] = 0.12
    const color = team === 'blue' ? 0x7fe8ff : 0xffb15c
    this.particles.emit(this.ball.x, this.ball.y, this.ball.z, color, {
      count: clamp(Math.round(hit.power / 2.4), 4, 20),
      speed: 4 + Math.min(18, hit.power * 0.5),
      size: 0.9 + Math.min(2.2, hit.power * 0.06),
      life: 0.5,
      gravity: 7,
      drag: 1.4,
      spread: 1
    })
    const distance = Math.hypot(this.ball.x - this.player.x, this.ball.z - this.player.z)
    if (team === 'blue' || distance < 32) this.audio.hit(hit.power)
    this.addShake(clamp(hit.power / 50, 0.06, 0.7))
    if (hit.power > 20 && team === 'blue') this.audio.boostPad(true)
  }

  addShake(amount) {
    this.shake = Math.min(1.1, this.shake + amount)
  }

  handleGoal(team) {
    if (this.state !== 'playing') return
    if (team === 'blue') this.blueScore++
    else this.orangeScore++

    this.state = 'goal'
    this.goalTimer = 2.7
    this.pendingEnd = this.overtime
    const color = team === 'blue' ? 0x6ce8ff : 0xff9a42
    this.audio.goal(team)
    this.addShake(0.9)
    this.world.pulseGoal(team)
    this.particles.emit(this.ball.x, this.ball.y + 0.5, this.ball.z, color, {
      count: 70,
      speed: 16,
      size: 2.2,
      life: 1.5,
      gravity: 13,
      drag: 1.1,
      spread: 1
    })
    this.ui.goalFlash.classList.remove('fire', 'orange')
    void this.ui.goalFlash.offsetWidth
    this.ui.goalFlash.classList.add('fire')
    if (team === 'orange') this.ui.goalFlash.classList.add('orange')
    this.showAnnounce('GOAL!', team === 'blue' ? 'BLUE SCORES' : 'ORANGE SCORES', team, 2.4)
    this.popScore(team)
    this.updateScoreboard()
    this.updateScreen(true)
  }

  resolveGoal() {
    if (this.pendingEnd) {
      this.endMatch()
      return
    }
    if (this.matchTime <= 0) {
      if (this.blueScore === this.orangeScore) {
        this.startOvertime()
      } else {
        this.endMatch()
      }
      return
    }
    this.kickoff(2.5, 'KICKOFF')
  }

  startOvertime() {
    this.overtime = true
    this.otElapsed = 0
    this.matchTime = 0
    this.pendingEnd = false
    this.kickoff(4.1, 'OVERTIME')
    this.updateScreen(true)
  }

  endMatch() {
    if (this.state === 'ended') return
    this.state = 'ended'
    this.pendingEnd = false
    this.audio.whistle()
    setTimeout(() => this.audio.victory(), 500)
    const blueWon = this.blueScore > this.orangeScore
    this.showAnnounce(blueWon ? 'BLUE WINS' : 'ORANGE WINS', this.overtime ? 'GOLDEN GOAL' : 'FINAL WHISTLE', blueWon ? 'blue' : 'orange', 4)
    this.ui.resultTitle.textContent = blueWon ? 'VICTORY' : 'DEFEAT'
    this.ui.resultScore.textContent = `${this.blueScore} — ${this.orangeScore}`
    this.ui.resultScore.classList.toggle('orange-win', !blueWon)
    this.ui.resultSub.textContent = blueWon ? 'Blue takes the arena.' : 'Orange takes the arena.'
    this.audio.setEngine(0, false, false)
    const serial = this.matchSerial
    setTimeout(() => {
      if (this.state === 'ended' && this.matchSerial === serial) {
        this.ui.results.classList.remove('is-hidden')
      }
    }, 1100)
  }

  updateCamera(dt) {
    if (this.state === 'menu') {
      const angle = this.elapsed * 0.105 + 0.6
      const desired = new THREE.Vector3(Math.sin(angle) * 61, 29.5 + Math.sin(this.elapsed * 0.32) * 1.6, Math.cos(angle) * 66)
      const factor = 1 - Math.exp(-dt * 1.6)
      this.camPos.lerp(desired, factor)
      this.camLook.lerp(new THREE.Vector3(0, 2.2, 0), factor)
      this.camera.position.copy(this.camPos)
      this.camera.lookAt(this.camLook)
      const targetFov = 58
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 2)
      this.camera.updateProjectionMatrix()
      return
    }

    const car = this.player
    const forward = forwardOf(car.yaw)
    const speed = Math.hypot(car.vx, car.vz)
    const back = 11.3 + speed * 0.052
    const height = 4.7 + Math.max(0, car.y - 1) * 0.26
    const desired = new THREE.Vector3(
      car.x - forward.x * back,
      car.y + height,
      car.z - forward.z * back
    )
    const factor = 1 - Math.exp(-dt * 6.8)
    this.camPos.lerp(desired, factor)

    let look
    if (this.ballCam) {
      look = new THREE.Vector3(this.ball.x + this.ball.vx * 0.045, this.ball.y + this.ball.vy * 0.02, this.ball.z + this.ball.vz * 0.045)
      if (this.state === 'ended') look.set(0, 2.6, 0)
    } else {
      look = new THREE.Vector3(
        car.x + forward.x * (6 + speed * 0.13),
        car.y + 1.1,
        car.z + forward.z * (6 + speed * 0.13)
      )
    }
    this.camLook.lerp(look, 1 - Math.exp(-dt * 9.5))

    this.shake = Math.max(0, this.shake - dt * 1.9)
    const shakeAmount = this.shake * this.shake * 0.55
    this.camera.position.copy(this.camPos)
    this.camera.position.x += (Math.random() - 0.5) * shakeAmount
    this.camera.position.y += (Math.random() - 0.5) * shakeAmount
    this.camera.position.z += (Math.random() - 0.5) * shakeAmount
    this.camera.lookAt(this.camLook)

    const targetFov = 66 + Math.min(20, speed * 0.24) + (car.boosting ? 4 : 0)
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 4)
    this.camera.updateProjectionMatrix()
  }

  updateHUD() {
    const speed = Math.round(Math.hypot(this.player.vx, this.player.vz) * 3.6)
    this.ui.speed.textContent = String(speed)
    this.ui.boostValue.textContent = String(Math.round(this.player.boost))
    this.ui.boostRing.style.setProperty('--boost', this.player.boost.toFixed(1))
    this.ui.boostRing.classList.toggle('boosting', this.player.boosting)

    let clockText
    if (this.overtime) clockText = `OT ${formatTime(this.otElapsed)}`
    else clockText = formatTime(this.matchTime)
    this.ui.clock.textContent = clockText
    this.ui.clock.classList.toggle('urgent', !this.overtime && this.matchTime <= 30 && this.state === 'playing')
    this.ui.stage.textContent = this.overtime
      ? 'OVERTIME'
      : this.state === 'countdown'
        ? 'KICKOFF'
        : 'RANKED 1V1'
    this.ui.cameraLabel.textContent = this.ballCam ? 'BALL CAM' : 'CHASE CAM'
  }

  updateScoreboard() {
    this.ui.blueScore.textContent = String(this.blueScore)
    this.ui.orangeScore.textContent = String(this.orangeScore)
  }

  popScore(team) {
    const el = team === 'blue' ? this.ui.blueScore : this.ui.orangeScore
    el.classList.remove('pop')
    void el.offsetWidth
    el.classList.add('pop')
    setTimeout(() => el.classList.remove('pop'), 300)
  }

  updateScreen(force = false) {
    const stage = this.overtime
      ? 'OVERTIME'
      : this.state === 'countdown'
        ? 'KICKOFF'
        : this.state === 'ended'
          ? 'FULL TIME'
          : 'RANKED 1V1'
    const clock = this.overtime ? `OT ${formatTime(this.otElapsed)}` : formatTime(this.matchTime)
    const key = `${this.blueScore}|${this.orangeScore}|${clock}|${stage}`
    if (!force && key === this.screenKey) return
    this.screenKey = key
    this.world.updateScreen({
      blue: this.blueScore,
      orange: this.orangeScore,
      clock,
      stage
    })
  }

  showAnnounce(main, sub = '', tone = '', duration = 1.2) {
    this.ui.announceMain.textContent = main
    this.ui.announceMain.className = 'announce-main' + (tone ? ` ${tone}` : '')
    this.ui.announceSub.textContent = sub
    this.ui.announcer.classList.add('show')
    this.ui.announcer.classList.toggle('goal', main === 'GOAL!')
    if (this.announceTimer) clearTimeout(this.announceTimer)
    this.announceTimer = setTimeout(() => {
      this.ui.announcer.classList.remove('show')
    }, duration * 1000)
  }

  tick(now) {
    const rawDt = (now - this.last) / 1000
    const dt = Math.min(0.05, rawDt)
    this.last = now
    this.pollGamepad()

    if (['playing', 'goal'].includes(this.state)) {
      this.accum = Math.min(this.accum + dt, 0.14)
      const step = 1 / 120
      let steps = 0
      while (this.accum >= step && steps < 18) {
        this.fixedUpdate(step)
        this.accum -= step
        steps++
      }
    } else {
      this.accum = 0
    }

    this.frameUpdate(Math.min(0.5, Math.max(0.001, rawDt)))
    this.world.animate(dt)
    this.particles.update(dt)
    this.renderer.render(this.scene, this.camera)

    if (!this.ready) {
      this.ready = true
      this.ui.loading.classList.add('is-done')
      window.__rocketReady = true
      window.__rocketState = () => ({
        state: this.state,
        blue: this.blueScore,
        orange: this.orangeScore,
        clock: this.ui.clock.textContent,
        boost: Math.round(this.player.boost)
      })
    }

    requestAnimationFrame(this.tick)
  }
}
