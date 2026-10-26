export class CityAudio {
  constructor() {
    this.ctx = null
    this.ready = false
    this.noiseBuffer = null
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.55
    this.master.connect(this.ctx.destination)

    const len = this.ctx.sampleRate * 2
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = this.noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1

    this.engineGain = this.ctx.createGain()
    this.engineGain.gain.value = 0
    this.engineFilter = this.ctx.createBiquadFilter()
    this.engineFilter.type = 'lowpass'
    this.engineFilter.frequency.value = 420
    this.engineFilter.Q.value = 2.2
    this.engineGain.connect(this.engineFilter)
    this.engineFilter.connect(this.master)

    this.engineOsc1 = this.ctx.createOscillator()
    this.engineOsc1.type = 'sawtooth'
    this.engineOsc1.frequency.value = 50
    this.engineOsc2 = this.ctx.createOscillator()
    this.engineOsc2.type = 'square'
    this.engineOsc2.frequency.value = 76
    const g2 = this.ctx.createGain()
    g2.gain.value = 0.35
    this.engineOsc1.connect(this.engineGain)
    this.engineOsc2.connect(g2)
    g2.connect(this.engineGain)
    this.engineOsc1.start()
    this.engineOsc2.start()

    this.sirenGain = this.ctx.createGain()
    this.sirenGain.gain.value = 0
    this.sirenOsc = this.ctx.createOscillator()
    this.sirenOsc.type = 'square'
    this.sirenOsc.frequency.value = 680
    const sirenFilter = this.ctx.createBiquadFilter()
    sirenFilter.type = 'bandpass'
    sirenFilter.frequency.value = 760
    sirenFilter.Q.value = 1.4
    this.sirenOsc.connect(sirenFilter)
    sirenFilter.connect(this.sirenGain)
    this.sirenGain.connect(this.master)
    this.sirenOsc.start()

    this.ready = true
  }

  setEngine(speed, maxSpeed) {
    if (!this.ready) return
    const s = Math.min(Math.abs(speed), maxSpeed)
    const t = this.ctx.currentTime
    const freq = 46 + s * 3.1
    this.engineOsc1.frequency.setTargetAtTime(freq, t, 0.08)
    this.engineOsc2.frequency.setTargetAtTime(freq * 1.52, t, 0.08)
    this.engineFilter.frequency.setTargetAtTime(320 + s * 34, t, 0.1)
    const target = s > 0.4 ? 0.055 + Math.min(s / maxSpeed, 1) * 0.045 : 0
    this.engineGain.gain.setTargetAtTime(target, t, 0.12)
  }

  setSiren(active, time) {
    if (!this.ready) return
    const t = this.ctx.currentTime
    this.sirenGain.gain.setTargetAtTime(active ? 0.028 : 0, t, 0.15)
    if (active) {
      const hi = Math.sin(time * 5.2) > 0
      this.sirenOsc.frequency.setTargetAtTime(hi ? 780 : 540, t, 0.04)
    }
  }

  tone(freq, dur, type = 'sine', volume = 0.15, delay = 0) {
    if (!this.ready) return
    const t = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  noise(dur, volume, filterFreq = 1200, type = 'lowpass') {
    if (!this.ready) return
    const t = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.value = filterFreq
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    src.start(t)
    src.stop(t + dur)
  }

  shoot() {
    this.noise(0.18, 0.35, 2600)
    this.tone(150, 0.16, 'square', 0.18)
  }

  crash() {
    this.noise(0.3, 0.22, 900)
  }

  explosion() {
    this.noise(0.9, 0.55, 600)
    this.tone(60, 0.8, 'sawtooth', 0.25)
  }

  pickup() {
    this.tone(660, 0.12, 'sine', 0.12)
    this.tone(880, 0.14, 'sine', 0.12, 0.1)
    this.tone(1320, 0.22, 'sine', 0.1, 0.2)
  }

  horn() {
    this.tone(392, 0.28, 'square', 0.08)
    this.tone(494, 0.28, 'square', 0.06)
  }

  busted() {
    this.tone(220, 0.5, 'sawtooth', 0.2)
    this.tone(170, 0.7, 'sawtooth', 0.2, 0.18)
    this.tone(110, 1.0, 'sawtooth', 0.2, 0.4)
  }

  wantedUp() {
    this.tone(520, 0.1, 'square', 0.08)
    this.tone(700, 0.14, 'square', 0.08, 0.08)
  }
}
