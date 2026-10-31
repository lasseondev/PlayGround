export class GameAudio {
  constructor() {
    this.ctx = null
    this.muted = false
    this.ready = false
  }

  start() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    try {
      const ctx = new Ctx()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.5
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -18
      comp.knee.value = 24
      comp.ratio.value = 6
      this.master.connect(comp)
      comp.connect(ctx.destination)

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      this.noiseBuffer = noiseBuffer

      this.engineGain = ctx.createGain()
      this.engineGain.gain.value = 0
      this.engineFilter = ctx.createBiquadFilter()
      this.engineFilter.type = 'lowpass'
      this.engineFilter.frequency.value = 500
      this.engineFilter.Q.value = 1.1
      this.engineFilter.connect(this.engineGain)
      this.engineGain.connect(this.master)

      this.osc1 = ctx.createOscillator()
      this.osc1.type = 'sawtooth'
      this.osc1.frequency.value = 52
      this.osc2 = ctx.createOscillator()
      this.osc2.type = 'sawtooth'
      this.osc2.frequency.value = 52.6
      this.osc2.detune.value = 8
      this.sub = ctx.createOscillator()
      this.sub.type = 'square'
      this.sub.frequency.value = 26
      const subGain = ctx.createGain()
      subGain.gain.value = 0.35
      this.osc1.connect(this.engineFilter)
      this.osc2.connect(this.engineFilter)
      this.sub.connect(subGain)
      subGain.connect(this.engineFilter)
      this.osc1.start()
      this.osc2.start()
      this.sub.start()

      const wind = ctx.createBufferSource()
      wind.buffer = noiseBuffer
      wind.loop = true
      const windFilter = ctx.createBiquadFilter()
      windFilter.type = 'bandpass'
      windFilter.frequency.value = 900
      windFilter.Q.value = 0.6
      this.windGain = ctx.createGain()
      this.windGain.gain.value = 0
      wind.connect(windFilter)
      windFilter.connect(this.windGain)
      this.windGain.connect(this.master)
      wind.start()

      const tire = ctx.createBufferSource()
      tire.buffer = noiseBuffer
      tire.loop = true
      const tireFilter = ctx.createBiquadFilter()
      tireFilter.type = 'highpass'
      tireFilter.frequency.value = 2600
      this.tireGain = ctx.createGain()
      this.tireGain.gain.value = 0
      tire.connect(tireFilter)
      tireFilter.connect(this.tireGain)
      this.tireGain.connect(this.master)
      tire.start()

      this.siren = ctx.createOscillator()
      this.siren.type = 'triangle'
      this.siren.frequency.value = 780
      this.sirenGain = ctx.createGain()
      this.sirenGain.gain.value = 0
      this.siren.connect(this.sirenGain)
      this.sirenGain.connect(this.master)
      this.siren.start()

      this.ready = true
      if (ctx.state === 'suspended') ctx.resume()
    } catch {
      this.ready = false
    }
  }

  setMuted(muted) {
    this.muted = muted
    if (!this.ctx) return
    this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.05)
  }

  update(ratio, drifting, wanted, copDistance) {
    if (!this.ctx || !this.ready) return
    const now = this.ctx.currentTime
    const freq = 46 + ratio * 162
    this.osc1.frequency.setTargetAtTime(freq, now, 0.06)
    this.osc2.frequency.setTargetAtTime(freq * 1.012, now, 0.06)
    this.sub.frequency.setTargetAtTime(freq * 0.5, now, 0.08)
    this.engineFilter.frequency.setTargetAtTime(360 + ratio * 1900, now, 0.08)
    this.engineGain.gain.setTargetAtTime(0.022 + ratio * 0.055, now, 0.1)
    this.windGain.gain.setTargetAtTime(Math.pow(ratio, 1.7) * 0.16, now, 0.12)
    this.tireGain.gain.setTargetAtTime(drifting ? 0.12 : 0, now, 0.06)
    if (this.sirenGain) {
      const active = wanted >= 3
      const near = Math.max(0, 1 - (copDistance ?? 999) / 140)
      this.sirenGain.gain.setTargetAtTime(active ? 0.018 + near * 0.045 : 0, now, 0.2)
      if (active) {
        const flip = Math.sin(now * 7.4) > 0 ? 690 : 980
        this.siren.frequency.setTargetAtTime(flip, now, 0.03)
      }
    }
  }

  crash(strength = 1) {
    if (!this.ctx || !this.ready) return
    const now = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    const gain = this.ctx.createGain()
    const vol = Math.min(0.4, 0.1 + strength * 0.025)
    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    src.start(now)
    src.stop(now + 0.5)

    const thump = this.ctx.createOscillator()
    const thumpGain = this.ctx.createGain()
    thump.type = 'sine'
    thump.frequency.setValueAtTime(90, now)
    thump.frequency.exponentialRampToValueAtTime(38, now + 0.25)
    thumpGain.gain.setValueAtTime(vol * 0.9, now)
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
    thump.connect(thumpGain)
    thumpGain.connect(this.master)
    thump.start(now)
    thump.stop(now + 0.32)
  }

  pickup() {
    if (!this.ctx || !this.ready) return
    const now = this.ctx.currentTime
    ;[660, 880, 1175].forEach((f, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, now + i * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.16, now + i * 0.07 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.22)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(now + i * 0.07)
      osc.stop(now + i * 0.07 + 0.25)
    })
  }

  yelp() {
    if (!this.ctx || !this.ready) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.18)
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(now)
    osc.stop(now + 0.22)
  }
}
