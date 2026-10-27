export class AudioFX {
  constructor() {
    this.ctx = null
    this.master = null
    this.noise = null
    this.ready = false
    this.muted = false
    this.ambientNodes = []
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.55
    this.master.connect(this.ctx.destination)
    const len = this.ctx.sampleRate * 1.2
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    this.noise = buffer
    this.ready = true
    this.startAmbient()
  }

  startAmbient() {
    if (!this.ready || this.ambientNodes.length) return
    const ctx = this.ctx
    const drone = ctx.createGain()
    drone.gain.value = 0.022
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 190
    filter.Q.value = 3
    const oscA = ctx.createOscillator()
    oscA.type = 'sawtooth'
    oscA.frequency.value = 43
    const oscB = ctx.createOscillator()
    oscB.type = 'sawtooth'
    oscB.frequency.value = 43.7
    const oscC = ctx.createOscillator()
    oscC.type = 'sine'
    oscC.frequency.value = 21.5
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.01
    oscA.connect(filter); oscB.connect(filter); oscC.connect(filter)
    filter.connect(drone)
    lfo.connect(lfoGain); lfoGain.connect(drone.gain)
    drone.connect(this.master)
    oscA.start(); oscB.start(); oscC.start(); lfo.start()

    const air = ctx.createBufferSource()
    air.buffer = this.noise
    air.loop = true
    const airFilter = ctx.createBiquadFilter()
    airFilter.type = 'bandpass'
    airFilter.frequency.value = 340
    airFilter.Q.value = 0.7
    const airGain = ctx.createGain()
    airGain.gain.value = 0.035
    air.connect(airFilter); airFilter.connect(airGain); airGain.connect(this.master)
    air.start()
    this.ambientNodes.push(oscA, oscB, oscC, lfo, air, drone, airGain)
  }

  get t() { return this.ctx.currentTime }

  noiseBurst(duration, gain, type, freq, freqEnd, q = 1) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.setValueAtTime(freq, this.t)
    filter.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), this.t + duration)
    filter.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, this.t)
    g.gain.exponentialRampToValueAtTime(0.0001, this.t + duration)
    src.connect(filter); filter.connect(g); g.connect(this.master)
    src.start()
    src.stop(this.t + duration + 0.02)
  }

  tone(freq, endFreq, duration, gain, type = 'sine', delay = 0) {
    const ctx = this.ctx
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, this.t + delay)
    o.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), this.t + delay + duration)
    g.gain.setValueAtTime(0.0001, this.t + delay)
    g.gain.exponentialRampToValueAtTime(gain, this.t + delay + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, this.t + delay + duration)
    o.connect(g); g.connect(this.master)
    o.start(this.t + delay)
    o.stop(this.t + delay + duration + 0.02)
  }

  shot(kind = 'rifle') {
    if (!this.ready) return
    if (kind === 'shotgun') {
      this.noiseBurst(0.34, 0.75, 'lowpass', 2600, 160, 0.6)
      this.tone(130, 40, 0.28, 0.5, 'triangle')
      this.tone(70, 30, 0.4, 0.4, 'sine')
    } else if (kind === 'ally') {
      this.noiseBurst(0.09, 0.2, 'bandpass', 2200, 700, 1.4)
      this.tone(180, 60, 0.08, 0.12, 'square')
    } else {
      this.noiseBurst(0.13, 0.5, 'highpass', 1400, 300, 0.7)
      this.tone(150, 48, 0.13, 0.32, 'triangle')
      this.tone(82, 34, 0.2, 0.22, 'sine')
    }
  }

  reload(stage = 0) {
    if (!this.ready) return
    if (stage === 0) { this.tone(900, 620, 0.05, 0.1, 'square'); this.tone(420, 210, 0.08, 0.12, 'square', 0.03) }
    else if (stage === 1) { this.noiseBurst(0.08, 0.12, 'bandpass', 900, 500, 2); this.tone(300, 180, 0.1, 0.1, 'square', 0.02) }
    else { this.tone(1000, 700, 0.05, 0.12, 'square'); this.tone(520, 320, 0.07, 0.12, 'square', 0.04) }
  }

  hit(headshot) {
    if (!this.ready) return
    if (headshot) {
      this.tone(1500, 900, 0.07, 0.16, 'square')
      this.tone(2300, 1400, 0.1, 0.08, 'sine', 0.02)
      this.noiseBurst(0.08, 0.16, 'highpass', 3000, 800, 1)
    } else {
      this.tone(1150, 780, 0.045, 0.08, 'sine')
    }
  }

  kill() {
    if (!this.ready) return
    this.tone(520, 260, 0.14, 0.07, 'sine')
    this.noiseBurst(0.16, 0.14, 'bandpass', 600, 180, 1.4)
  }

  groan(volume = 0.3, pan = 0) {
    if (!this.ready) return
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    const base = 62 + Math.random() * 34
    o.frequency.setValueAtTime(base, this.t)
    o.frequency.linearRampToValueAtTime(base * (0.75 + Math.random() * 0.4), this.t + 0.7)
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 5 + Math.random() * 5
    const lg = ctx.createGain(); lg.gain.value = 14
    lfo.connect(lg); lg.connect(o.frequency)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 480; filter.Q.value = 5
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, this.t)
    g.gain.exponentialRampToValueAtTime(volume, this.t + 0.12)
    g.gain.exponentialRampToValueAtTime(0.0001, this.t + 0.9)
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null
    if (panner) panner.pan.value = Math.max(-1, Math.min(1, pan))
    o.connect(filter); filter.connect(g)
    if (panner) { g.connect(panner); panner.connect(this.master) } else g.connect(this.master)
    o.start(); lfo.start()
    o.stop(this.t + 1); lfo.stop(this.t + 1)
  }

  explosion() {
    if (!this.ready) return
    this.noiseBurst(0.9, 0.9, 'lowpass', 1800, 90, 0.8)
    this.tone(90, 24, 0.85, 0.85, 'sine')
    this.tone(60, 18, 1.2, 0.5, 'triangle', 0.02)
  }

  hurt() {
    if (!this.ready) return
    this.noiseBurst(0.2, 0.25, 'lowpass', 700, 90, 1)
    this.tone(140, 60, 0.22, 0.25, 'triangle')
  }

  pickup() {
    if (!this.ready) return
    this.tone(620, 930, 0.1, 0.1, 'sine')
    this.tone(930, 1240, 0.12, 0.08, 'sine', 0.07)
  }

  siren() {
    if (!this.ready) return
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(240, this.t)
    o.frequency.linearRampToValueAtTime(520, this.t + 1.1)
    o.frequency.linearRampToValueAtTime(240, this.t + 2.2)
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900
    const g = ctx.createGain(); g.gain.value = 0.0001
    g.gain.exponentialRampToValueAtTime(0.12, this.t + 0.3)
    g.gain.exponentialRampToValueAtTime(0.0001, this.t + 2.3)
    o.connect(filter); filter.connect(g); g.connect(this.master)
    o.start(); o.stop(this.t + 2.4)
  }

  alarm() {
    if (!this.ready) return
    this.tone(720, 720, 0.16, 0.1, 'square')
    this.tone(520, 520, 0.16, 0.09, 'square', 0.2)
  }

  melee() {
    if (!this.ready) return
    this.noiseBurst(0.14, 0.25, 'bandpass', 1200, 200, 1.2)
    this.tone(220, 90, 0.16, 0.14, 'sawtooth')
  }

  empty() {
    if (!this.ready) return
    this.tone(320, 260, 0.04, 0.1, 'square')
  }

  ui() {
    if (!this.ready) return
    this.tone(880, 1200, 0.06, 0.06, 'sine')
  }

  setMuffle(low) {
    if (!this.ready) return
    this.master.gain.setTargetAtTime(low ? 0.22 : 0.55, this.t, 0.25)
  }
}
