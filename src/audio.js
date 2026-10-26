export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.music = null
    this.sfx = null
    this.muted = false
    this.last = new Map()
    this.musicStarted = false
    this.droneNodes = []
  }

  start() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.42
    this.master.connect(this.ctx.destination)
    this.music = this.ctx.createGain()
    this.music.gain.value = 0.3
    this.music.connect(this.master)
    this.sfx = this.ctx.createGain()
    this.sfx.gain.value = 0.6
    this.sfx.connect(this.master)
    this.noise = this.makeNoise()
    this.startMusic()
  }

  makeNoise() {
    const len = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  startMusic() {
    if (this.musicStarted || !this.ctx) return
    this.musicStarted = true
    const now = this.ctx.currentTime
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 340
    filter.Q.value = 0.8
    filter.connect(this.music)
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.13, now + 4)
    gain.connect(filter)
    for (const [freq, type, detune, vol] of [[55, 'sawtooth', -8, 0.42], [82.5, 'sawtooth', 7, 0.28], [110, 'sine', 0, 0.18]]) {
      const osc = this.ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = detune
      const g = this.ctx.createGain()
      g.gain.value = vol
      osc.connect(g)
      g.connect(gain)
      osc.start()
      const lfo = this.ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.055 + Math.random() * 0.04
      const lfoGain = this.ctx.createGain()
      lfoGain.gain.value = 0.04
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      lfo.start()
      this.droneNodes.push(osc, lfo)
    }
    this.droneNodes.push(gain)
    this.scheduleDrums()
  }

  scheduleDrums() {
    if (!this.ctx) return
    const beat = () => {
      if (!this.ctx || this.muted) {
        setTimeout(beat, 2400)
        return
      }
      const t = this.ctx.currentTime
      const src = this.ctx.createBufferSource()
      src.buffer = this.noise
      const lp = this.ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 100
      lp.Q.value = 1.2
      const g = this.ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.52)
      src.connect(lp)
      lp.connect(g)
      g.connect(this.music)
      src.start(t)
      src.stop(t + 0.55)
      setTimeout(beat, 2300 + Math.random() * 500)
    }
    setTimeout(beat, 1600)
  }

  setMuted(value) {
    this.muted = value
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.linearRampToValueAtTime(value ? 0 : 0.42, t + 0.15)
  }

  canPlay(name, interval) {
    if (!this.ctx || this.muted) return false
    const now = performance.now()
    const last = this.last.get(name) || 0
    if (now - last < interval) return false
    this.last.set(name, now)
    return true
  }

  noiseBurst({ duration = 0.15, volume = 0.2, type = 'bandpass', frequency = 1200, q = 1, sweep = 0, delay = 0 } = {}) {
    if (!this.ctx) return
    const t = this.ctx.currentTime + delay
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.setValueAtTime(frequency, t)
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(40, frequency + sweep), t + duration)
    filter.Q.value = q
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(volume, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(filter)
    filter.connect(g)
    g.connect(this.sfx)
    src.start(t)
    src.stop(t + duration + 0.05)
  }

  tone({ frequency = 440, endFrequency = null, duration = 0.2, volume = 0.12, type = 'sine', delay = 0, attack = 0.01, filter = 0 } = {}) {
    if (!this.ctx) return
    const t = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, t)
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), t + duration)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(volume, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    if (filter) {
      const f = this.ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = filter
      osc.connect(f)
      f.connect(g)
    } else {
      osc.connect(g)
    }
    g.connect(this.sfx)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  }

  sword() {
    if (!this.canPlay('sword', 50)) return
    this.noiseBurst({ duration: 0.13, volume: 0.07, frequency: 2600, q: 1.4, sweep: -1800 })
    this.tone({ frequency: 1450 + Math.random() * 500, endFrequency: 800, duration: 0.12, volume: 0.035, type: 'triangle' })
  }

  arrow() {
    if (!this.canPlay('arrow', 65)) return
    this.noiseBurst({ duration: 0.18, volume: 0.034, frequency: 900, q: 0.7, sweep: 1400 })
  }

  magic() {
    if (!this.canPlay('magic', 90)) return
    this.tone({ frequency: 520, endFrequency: 1250, duration: 0.28, volume: 0.045, type: 'sine' })
    this.tone({ frequency: 780, endFrequency: 1650, duration: 0.24, volume: 0.02, type: 'triangle', delay: 0.03 })
  }

  heal() {
    if (!this.canPlay('heal', 180)) return
    this.tone({ frequency: 660, endFrequency: 880, duration: 0.4, volume: 0.035, type: 'sine' })
    this.tone({ frequency: 990, endFrequency: 1320, duration: 0.4, volume: 0.022, type: 'sine', delay: 0.07 })
  }

  explosion(big = false) {
    if (!this.canPlay('explosion', big ? 120 : 60)) return
    this.noiseBurst({ duration: big ? 0.7 : 0.34, volume: big ? 0.22 : 0.11, type: 'lowpass', frequency: big ? 900 : 1200, q: 0.6, sweep: -700 })
    this.tone({ frequency: big ? 110 : 170, endFrequency: 38, duration: big ? 0.7 : 0.35, volume: big ? 0.16 : 0.08, type: 'sine' })
  }

  horn(low = false) {
    if (!this.ctx || this.muted) return
    const base = low ? 110 : 164.81
    const notes = low ? [base, base * 1.5, base * 2] : [base, base * 1.25, base * 1.5]
    notes.forEach((f, i) => {
      this.tone({ frequency: f, duration: 1.4, volume: 0.025, type: 'sawtooth', delay: 0.13 * i, attack: 0.18, filter: 1200 })
    })
    this.noiseBurst({ duration: 0.3, volume: 0.025, frequency: 500, q: 0.7, delay: 0.15 })
  }

  click() {
    if (!this.canPlay('click', 30)) return
    this.tone({ frequency: 880, endFrequency: 620, duration: 0.055, volume: 0.025, type: 'triangle' })
  }

  command() {
    if (!this.canPlay('command', 45)) return
    this.tone({ frequency: 520, endFrequency: 700, duration: 0.09, volume: 0.035, type: 'sine' })
    this.tone({ frequency: 780, endFrequency: 980, duration: 0.09, volume: 0.02, type: 'sine', delay: 0.04 })
  }

  death() {
    if (!this.canPlay('death', 80)) return
    this.noiseBurst({ duration: 0.2, volume: 0.035, type: 'lowpass', frequency: 520, q: 0.6, sweep: -300 })
  }

  gateHit() {
    if (!this.canPlay('gate', 180)) return
    this.tone({ frequency: 84, endFrequency: 45, duration: 0.5, volume: 0.11, type: 'sine' })
    this.noiseBurst({ duration: 0.28, volume: 0.06, type: 'lowpass', frequency: 420, q: 0.8 })
  }

  ability(kind = 'cast') {
    if (!this.canPlay('ability', 100)) return
    if (kind === 'holy') {
      ;[523, 659, 784, 1046].forEach((f, i) => this.tone({ frequency: f, duration: 0.9, volume: 0.03, type: 'sine', delay: i * 0.05, attack: 0.02 }))
      this.noiseBurst({ duration: 0.5, volume: 0.05, frequency: 3200, q: 0.5, sweep: 900 })
    } else if (kind === 'frost') {
      this.tone({ frequency: 1240, endFrequency: 620, duration: 0.55, volume: 0.04, type: 'triangle' })
      this.noiseBurst({ duration: 0.3, volume: 0.04, frequency: 4300, q: 1.2, sweep: -2200 })
    } else if (kind === 'fire') {
      this.noiseBurst({ duration: 0.5, volume: 0.08, type: 'bandpass', frequency: 700, q: 0.7, sweep: 1400 })
      this.tone({ frequency: 210, endFrequency: 85, duration: 0.45, volume: 0.08, type: 'sawtooth' })
    } else {
      this.magic()
    }
  }

  victory() {
    if (!this.ctx) return
    ;[261.63, 329.63, 392, 523.25, 659.25].forEach((f, i) => this.tone({ frequency: f, duration: 2.4, volume: 0.035, type: 'sawtooth', delay: 0.12 * i, attack: 0.15, filter: 1500 }))
    this.horn(false)
  }

  defeat() {
    if (!this.ctx) return
    ;[196, 174.61, 146.83, 110].forEach((f, i) => this.tone({ frequency: f, duration: 2.2, volume: 0.04, type: 'sawtooth', delay: 0.25 * i, attack: 0.1, filter: 700 }))
  }
}
