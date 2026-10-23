export class SFX {
  constructor() {
    this.ctx = null
    this.master = null
    this.enabled = true
    this.ambient = null
  }

  init() {
    if (this.ctx) { this.ctx.resume(); return }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.16
    this.master.connect(this.ctx.destination)
    this._startAmbient()
  }

  toggle() {
    this.enabled = !this.enabled
    if (this.master) this.master.gain.setTargetAtTime(this.enabled ? 0.16 : 0, this.ctx.currentTime, 0.05)
    return this.enabled
  }

  _startAmbient() {
    const ctx = this.ctx
    const g = ctx.createGain(); g.gain.value = 0.22; g.connect(this.master)
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240; lp.Q.value = 2; lp.connect(g)
    for (const [f, t] of [[41, 'sawtooth'], [55, 'sine'], [82, 'triangle'], [110, 'sine']]) {
      const o = ctx.createOscillator(); o.type = t; o.frequency.value = f
      const og = ctx.createGain(); og.gain.value = 0.08 + Math.random() * 0.05
      o.connect(og); og.connect(lp); o.start()
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + Math.random() * 0.12
      const lg = ctx.createGain(); lg.gain.value = 2 + Math.random() * 4
      lfo.connect(lg); lg.connect(o.frequency); lfo.start()
    }
    const nb = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const d = nb.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.35
    const noise = ctx.createBufferSource(); noise.buffer = nb; noise.loop = true
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 380; nf.Q.value = 0.7
    const ng = ctx.createGain(); ng.gain.value = 0.035
    noise.connect(nf); nf.connect(ng); ng.connect(this.master); noise.start()
    this.ambient = g
  }

  _tone(freq, dur, type = 'sine', vol = 0.2, slide = 0) {
    if (!this.ctx || !this.enabled) return
    const t = this.ctx.currentTime
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t)
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02)
  }

  _noise(dur = 0.25, freq = 700, vol = 0.24, q = 0.8) {
    if (!this.ctx || !this.enabled) return
    const ctx = this.ctx, t = ctx.currentTime
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const src = ctx.createBufferSource(); src.buffer = buf
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(90, t + dur); f.Q.value = q
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(this.master); src.start(t)
  }

  click() { this._tone(880, 0.05, 'square', 0.06, -300) }
  select() { this._tone(520, 0.08, 'triangle', 0.08, 240); setTimeout(() => this._tone(760, 0.06, 'sine', 0.05, 120), 45) }
  order() { this._tone(420, 0.1, 'sine', 0.1, 180) }
  laser() { this._tone(1500 + Math.random() * 500, 0.055, 'sawtooth', 0.075, -1100) }
  cannon() { this._noise(0.32, 900, 0.4); this._tone(95, 0.4, 'sine', 0.32, -55) }
  zerg() { this._tone(150, 0.2, 'sawtooth', 0.06, 90); this._tone(80, 0.24, 'square', 0.04, -20) }
  explosion(big = false) { this._noise(big ? 0.85 : 0.35, big ? 1200 : 700, big ? 0.5 : 0.24); if (big) this._tone(60, 0.7, 'sine', 0.4, -30) }
  alert() { this._tone(660, 0.12, 'square', 0.1); setTimeout(() => this._tone(880, 0.18, 'square', 0.1), 140) }
  train() { this._tone(330, 0.12, 'triangle', 0.09, 110); setTimeout(() => this._tone(550, 0.18, 'triangle', 0.08, 90), 130) }
}
