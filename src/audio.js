export class GameAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.engineGain = null
    this.engineFilter = null
    this.engineOsc = null
    this.engineSub = null
    this.boostGain = null
    this.crowdGain = null
    this.noiseBuffer = null
    this.muted = false
    this.started = false
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return true
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return false
    try {
      this.ctx = new Ctx()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.72
      this.master.connect(this.ctx.destination)

      this.noiseBuffer = this.makeNoiseBuffer(3)

      this.engineOsc = this.ctx.createOscillator()
      this.engineOsc.type = 'sawtooth'
      this.engineOsc.frequency.value = 52
      this.engineSub = this.ctx.createOscillator()
      this.engineSub.type = 'triangle'
      this.engineSub.frequency.value = 26
      this.engineFilter = this.ctx.createBiquadFilter()
      this.engineFilter.type = 'lowpass'
      this.engineFilter.frequency.value = 320
      this.engineFilter.Q.value = 3.2
      this.engineGain = this.ctx.createGain()
      this.engineGain.gain.value = 0
      this.engineOsc.connect(this.engineFilter)
      this.engineSub.connect(this.engineFilter)
      this.engineFilter.connect(this.engineGain)
      this.engineGain.connect(this.master)
      this.engineOsc.start()
      this.engineSub.start()

      const boostSource = this.ctx.createBufferSource()
      boostSource.buffer = this.noiseBuffer
      boostSource.loop = true
      const boostFilter = this.ctx.createBiquadFilter()
      boostFilter.type = 'bandpass'
      boostFilter.frequency.value = 1150
      boostFilter.Q.value = 0.8
      this.boostGain = this.ctx.createGain()
      this.boostGain.gain.value = 0
      boostSource.connect(boostFilter)
      boostFilter.connect(this.boostGain)
      this.boostGain.connect(this.master)
      boostSource.start()

      const crowdSource = this.ctx.createBufferSource()
      crowdSource.buffer = this.noiseBuffer
      crowdSource.loop = true
      const crowdFilter = this.ctx.createBiquadFilter()
      crowdFilter.type = 'bandpass'
      crowdFilter.frequency.value = 520
      crowdFilter.Q.value = 0.55
      this.crowdGain = this.ctx.createGain()
      this.crowdGain.gain.value = 0.035
      crowdSource.connect(crowdFilter)
      crowdFilter.connect(this.crowdGain)
      this.crowdGain.connect(this.master)
      crowdSource.start()

      this.started = true
      return true
    } catch {
      return false
    }
  }

  makeNoiseBuffer(seconds) {
    const length = Math.floor(this.ctx.sampleRate * seconds)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  setMuted(muted) {
    this.muted = muted
    if (this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.72, this.ctx.currentTime, 0.05)
    }
  }

  setEngine(speed, boosting, active = true) {
    if (!this.started || !this.engineGain) return
    const t = this.ctx.currentTime
    const norm = Math.min(1, speed / 55)
    this.engineOsc.frequency.setTargetAtTime(46 + norm * 120 + (boosting ? 20 : 0), t, 0.07)
    this.engineSub.frequency.setTargetAtTime(23 + norm * 52, t, 0.07)
    this.engineFilter.frequency.setTargetAtTime(210 + norm * 780, t, 0.08)
    this.engineGain.gain.setTargetAtTime(active ? 0.035 + norm * 0.055 : 0, t, 0.1)
    this.boostGain.gain.setTargetAtTime(boosting ? 0.10 : 0.0, t, 0.05)
  }

  tone({ freq = 440, to = null, type = 'sine', gain = 0.12, attack = 0.01, decay = 0.25, delay = 0 }) {
    if (!this.started) return
    const t = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + decay)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
    osc.connect(g)
    g.connect(this.master)
    osc.start(t)
    osc.stop(t + attack + decay + 0.05)
  }

  noise({ gain = 0.15, duration = 0.2, freq = 900, q = 1, type = 'bandpass', delay = 0 }) {
    if (!this.started) return
    const t = this.ctx.currentTime + delay
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.setValueAtTime(freq, t)
    filter.Q.value = q
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(filter)
    filter.connect(g)
    g.connect(this.master)
    src.start(t)
    src.stop(t + duration + 0.05)
  }

  ui() {
    this.tone({ freq: 680, to: 900, type: 'triangle', gain: 0.05, decay: 0.08 })
  }

  countdown(final = false) {
    this.tone({ freq: final ? 880 : 520, to: final ? 1200 : 560, type: 'square', gain: 0.06, decay: final ? 0.35 : 0.14 })
  }

  jump() {
    this.noise({ gain: 0.055, duration: 0.18, freq: 1600, q: 1.4 })
  }

  boostPad(big) {
    this.tone({ freq: big ? 520 : 760, to: big ? 1040 : 1220, type: 'triangle', gain: big ? 0.075 : 0.045, decay: 0.24 })
    if (big) this.tone({ freq: 780, to: 1560, type: 'sine', gain: 0.035, decay: 0.3, delay: 0.03 })
  }

  hit(power) {
    const p = Math.min(1, power / 32)
    this.noise({ gain: 0.07 + p * 0.15, duration: 0.1 + p * 0.12, freq: 260 + p * 400, q: 0.7 })
    this.tone({ freq: 150 + p * 55, to: 50, type: 'sine', gain: 0.10 + p * 0.12, decay: 0.18 + p * 0.12 })
    if (p > 0.55) this.tone({ freq: 820, to: 420, type: 'triangle', gain: 0.035, decay: 0.16 })
  }

  goal(team) {
    const base = team === 'blue' ? 220 : 246
    for (const [i, ratio] of [1, 1.25, 1.5, 2].entries()) {
      this.tone({
        freq: base * ratio,
        to: base * ratio * 0.98,
        type: 'sawtooth',
        gain: 0.045,
        attack: 0.02,
        decay: 1.15,
        delay: i * 0.035
      })
    }
    this.tone({ freq: 70, to: 42, type: 'sine', gain: 0.16, decay: 0.7 })
    this.noise({ gain: 0.09, duration: 1.5, freq: 780, q: 0.3, type: 'lowpass' })
  }

  whistle() {
    this.tone({ freq: 1450, to: 900, type: 'sine', gain: 0.05, decay: 0.7 })
    this.tone({ freq: 1820, to: 1100, type: 'sine', gain: 0.03, decay: 0.6, delay: 0.05 })
  }

  victory() {
    const notes = [392, 523, 659, 784]
    notes.forEach((freq, i) => {
      this.tone({ freq, type: 'triangle', gain: 0.075, decay: 0.4, delay: i * 0.15 })
      this.tone({ freq: freq * 2, type: 'sine', gain: 0.025, decay: 0.3, delay: i * 0.15 })
    })
  }
}
