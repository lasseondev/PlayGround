export class GameAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.muted = false
    this._noise = null
    this._ambient = null
    this._storm = null
    this._stormGain = null
  }

  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.34
    this.master.connect(this.ctx.destination)
    this._buildNoise()
    this._startAmbient()
    this._startStorm()
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
  }

  _buildNoise() {
    const len = Math.floor(this.ctx.sampleRate * 2)
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    this._noise = buffer
  }

  _startAmbient() {
    const src = this.ctx.createBufferSource()
    src.buffer = this._noise
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 340
    const gain = this.ctx.createGain()
    gain.gain.value = 0.035
    src.connect(filter).connect(gain).connect(this.master)
    src.start()
    this._ambient = { src, filter, gain }
  }

  _startStorm() {
    const src = this.ctx.createBufferSource()
    src.buffer = this._noise
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 220
    filter.Q.value = 1.1
    const gain = this.ctx.createGain()
    gain.gain.value = 0
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 46
    const oscGain = this.ctx.createGain()
    oscGain.gain.value = 0.05
    osc.connect(oscGain).connect(gain)
    src.connect(filter).connect(gain).connect(this.master)
    src.start()
    osc.start()
    this._storm = { src, osc, filter }
    this._stormGain = gain
  }

  setStorm(intensity, near = false) {
    if (!this._stormGain) return
    const t = this.ctx.currentTime
    const target = this.muted ? 0 : Math.min(0.19, intensity * 0.055 + (near ? 0.05 : 0.012))
    this._stormGain.gain.cancelScheduledValues(t)
    this._stormGain.gain.setTargetAtTime(target, t, 0.5)
  }

  setMuted(muted) {
    this.muted = muted
    if (!this.master) return
    const t = this.ctx.currentTime
    this.master.gain.setTargetAtTime(muted ? 0 : 0.34, t, 0.08)
  }

  _now() { return this.ctx ? this.ctx.currentTime : 0 }

  _noiseBurst({ duration = 0.14, gain = 0.35, type = 'lowpass', freq = 1200, q = 0.8, when = 0, pitch = 1 } = {}) {
    if (!this.ctx || this.muted) return
    const t = this._now() + when
    const src = this.ctx.createBufferSource()
    src.buffer = this._noise
    src.playbackRate.value = pitch
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.value = freq
    filter.Q.value = q
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(filter).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + duration + 0.02)
  }

  _tone({ freq = 440, to = null, duration = 0.1, gain = 0.12, type = 'sine', when = 0 } = {}) {
    if (!this.ctx || this.muted) return
    const t = this._now() + when
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + duration)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.connect(g).connect(this.master)
    osc.start(t)
    osc.stop(t + duration + 0.02)
  }

  shot(kind = 'ar', distance = 0) {
    const near = Math.max(0.18, 1 - distance / 150)
    if (kind === 'shotgun') {
      this._noiseBurst({ duration: 0.3, gain: 0.5 * near, freq: 620, pitch: 0.8 })
      this._tone({ freq: 92, to: 42, duration: 0.24, gain: 0.25 * near, type: 'triangle' })
    } else if (kind === 'smg') {
      this._noiseBurst({ duration: 0.08, gain: 0.22 * near, freq: 1900, pitch: 1.2 })
      this._tone({ freq: 170, to: 72, duration: 0.07, gain: 0.08 * near, type: 'square' })
    } else {
      this._noiseBurst({ duration: 0.13, gain: 0.4 * near, freq: 1050, pitch: 1 })
      this._tone({ freq: 130, to: 52, duration: 0.11, gain: 0.16 * near, type: 'triangle' })
    }
  }

  hit(crit = false) {
    this._tone({ freq: crit ? 1560 : 980, to: crit ? 2100 : 760, duration: crit ? 0.13 : 0.07, gain: 0.08, type: 'sine' })
  }

  playerHurt() {
    this._noiseBurst({ duration: 0.16, gain: 0.16, freq: 340, type: 'lowpass' })
    this._tone({ freq: 160, to: 80, duration: 0.16, gain: 0.1, type: 'sawtooth' })
  }

  pickaxe() {
    this._noiseBurst({ duration: 0.11, gain: 0.25, freq: 2500, type: 'bandpass', q: 1.8, pitch: 1.4 })
    this._tone({ freq: 240, to: 130, duration: 0.08, gain: 0.06, type: 'triangle' })
  }

  harvest() {
    this._tone({ freq: 420, to: 620, duration: 0.1, gain: 0.06, type: 'triangle' })
  }

  build(material = 'wood') {
    const base = material === 'metal' ? 720 : material === 'brick' ? 260 : 190
    this._noiseBurst({ duration: 0.1, gain: 0.2, freq: material === 'metal' ? 2600 : 900 })
    this._tone({ freq: base, to: base * 0.62, duration: 0.12, gain: 0.09, type: 'triangle' })
  }

  destroy() {
    this._noiseBurst({ duration: 0.32, gain: 0.3, freq: 700, pitch: 0.7 })
    this._tone({ freq: 120, to: 42, duration: 0.28, gain: 0.12, type: 'sawtooth' })
  }

  jump() { this._tone({ freq: 300, to: 390, duration: 0.06, gain: 0.035, type: 'sine' }) }
  land() { this._noiseBurst({ duration: 0.09, gain: 0.1, freq: 260 }) }

  reload() {
    this._tone({ freq: 620, to: 400, duration: 0.07, gain: 0.05, type: 'square' })
    this._tone({ freq: 400, to: 620, duration: 0.06, gain: 0.05, type: 'square', when: 0.12 })
  }

  chest() {
    const notes = [523, 659, 784, 1046]
    notes.forEach((f, i) => this._tone({ freq: f, duration: 0.16, gain: 0.06, type: 'triangle', when: i * 0.07 }))
  }

  pickup() {
    this._tone({ freq: 740, to: 1180, duration: 0.14, gain: 0.055, type: 'sine' })
  }

  elimination() {
    this._tone({ freq: 440, to: 880, duration: 0.1, gain: 0.07, type: 'triangle' })
    this._tone({ freq: 880, to: 1320, duration: 0.16, gain: 0.06, type: 'triangle', when: 0.08 })
  }

  victory() {
    const notes = [523, 659, 784, 1046, 1318]
    notes.forEach((f, i) => this._tone({ freq: f, duration: 0.5, gain: 0.075, type: 'triangle', when: i * 0.16 }))
    this._tone({ freq: 261, duration: 1.6, gain: 0.05, type: 'sine', when: 0.34 })
  }

  defeat() {
    this._tone({ freq: 300, to: 120, duration: 0.9, gain: 0.08, type: 'sawtooth' })
  }

  stormTick() {
    this._tone({ freq: 96, to: 60, duration: 0.3, gain: 0.06, type: 'sine' })
  }
}
