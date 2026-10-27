export class OceanAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.muted = false
    this.timer = 0
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    try {
      const ctx = new AudioContext()
      this.ctx = ctx
      const master = ctx.createGain()
      master.gain.value = 0.32
      master.connect(ctx.destination)
      this.master = master

      const drone = ctx.createGain()
      drone.gain.value = 0.055
      drone.connect(master)
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 220
      filter.Q.value = 2
      filter.connect(drone)

      for (const [freq, gain, detune] of [
        [48, 0.55, 0],
        [72.4, 0.28, 4],
        [96.5, 0.16, -6],
      ]) {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        osc.detune.value = detune
        const g = ctx.createGain()
        g.gain.value = gain
        osc.connect(g)
        g.connect(filter)
        osc.start()
      }

      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.07
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 70
      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      lfo.start()

      this.startNoise(master)
      this.scheduleBubble(1.5)
    } catch {
      this.ctx = null
    }
  }

  startNoise(master) {
    const ctx = this.ctx
    const length = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 2.4
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 340
    const gain = ctx.createGain()
    gain.gain.value = 0.1
    source.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    source.start()
  }

  scheduleBubble(delay) {
    if (!this.ctx || this.ctx.state === 'closed') return
    this.timer = window.setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running') this.bubble()
      this.scheduleBubble(0.7 + Math.random() * 2.6)
    }, delay * 1000)
  }

  bubble() {
    const ctx = this.ctx
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    const start = 260 + Math.random() * 420
    osc.frequency.setValueAtTime(start, now)
    osc.frequency.exponentialRampToValueAtTime(start * 2.2 + 300, now + 0.09)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(now)
    osc.stop(now + 0.16)
  }

  tone(freq, duration, type = 'sine', volume = 0.05, slide = 0) {
    if (!this.ctx || this.muted) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(now)
    osc.stop(now + duration + 0.02)
  }

  mine() {
    this.tone(150, 0.16, 'triangle', 0.06, -70)
    this.tone(420, 0.07, 'sine', 0.022, -160)
  }

  place() {
    this.tone(330, 0.1, 'sine', 0.045, 110)
    this.tone(660, 0.06, 'sine', 0.02, 90)
  }

  collect() {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((note, i) => {
      window.setTimeout(() => this.tone(note, 0.5, 'sine', 0.05, 8), i * 85)
    })
  }

  complete() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
    notes.forEach((note, i) => {
      window.setTimeout(() => this.tone(note, 1.1, 'sine', 0.045, 4), i * 150)
    })
  }

  splash() {
    this.tone(190, 0.5, 'sine', 0.06, 260)
  }
}
