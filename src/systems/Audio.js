export class AudioSystem {
  constructor() {
    this.ctx = null
    this.ready = false
    this.volume = 0.8
    this.lastHeart = 0
    this.heartSide = 0
    this.droneNodes = []
    this.distantTimer = 8
  }

  init() {
    if (this.ready) { this.ctx.resume?.(); return }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    try { this.ctx = new AC() } catch { return }
    const ctx = this.ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.volume
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -18
    this.compressor.knee.value = 22
    this.compressor.ratio.value = 5
    this.compressor.attack.value = 0.004
    this.compressor.release.value = 0.22
    this.master.connect(this.compressor)
    this.compressor.connect(ctx.destination)

    this.reverb = ctx.createConvolver()
    this.reverb.buffer = this.makeImpulse(2.1, 2.9)
    this.reverbGain = ctx.createGain()
    this.reverbGain.gain.value = 0.55
    this.reverb.connect(this.reverbGain)
    this.reverbGain.connect(this.master)

    this.sfx = ctx.createGain()
    this.sfx.gain.value = 0.9
    this.sfx.connect(this.master)
    this.sfxSend = ctx.createGain()
    this.sfxSend.gain.value = 0.32
    this.sfx.connect(this.sfxSend)
    this.sfxSend.connect(this.reverb)

    this.noise = this.makeNoise(2)
    this.ready = true
    this.startAmbience()
  }

  makeNoise(seconds = 2) {
    const ctx = this.ctx
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    }
    return buf
  }

  makeImpulse(seconds, decay) {
    const ctx = this.ctx
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        const t = i / len
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (1 - t * 0.2)
      }
    }
    return buf
  }

  setVolume(v) {
    this.volume = v
    if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05)
  }

  startAmbience() {
    const ctx = this.ctx
    const amb = ctx.createGain()
    amb.gain.value = 0.2
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 210; lp.Q.value = 0.6
    amb.connect(lp); lp.connect(this.master)

    const freqs = [43.65, 55, 82.41]
    for (const f of freqs) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'; o.frequency.value = f
      const g = ctx.createGain(); g.gain.value = 0.035
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + Math.random() * 0.08
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.02
      lfo.connect(lfoGain); lfoGain.connect(g.gain)
      o.connect(g); g.connect(amb)
      o.start(); lfo.start()
      this.droneNodes.push(o, lfo)
    }
    const wind = ctx.createBufferSource(); wind.buffer = this.noise; wind.loop = true
    const windFilter = ctx.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 340; windFilter.Q.value = 0.7
    const windGain = ctx.createGain(); windGain.gain.value = 0.02
    wind.connect(windFilter); windFilter.connect(windGain); windGain.connect(amb)
    wind.start()
    const hum = ctx.createOscillator(); hum.type = 'sine'; hum.frequency.value = 118
    const humGain = ctx.createGain(); humGain.gain.value = 0.008
    hum.connect(humGain); humGain.connect(this.master); hum.start()
    this.droneNodes.push(hum)

    // slow filter sweep
    const sweep = ctx.createOscillator(); sweep.frequency.value = 0.03
    const sweepGain = ctx.createGain(); sweepGain.gain.value = 70
    sweep.connect(sweepGain); sweepGain.connect(lp.frequency); sweep.start()
    this.droneNodes.push(sweep)
    this.ambGain = amb
  }

  update(dt, game) {
    if (!this.ready) return
    this.distantTimer -= dt
    if (this.distantTimer <= 0) {
      this.distantTimer = 10 + Math.random() * 16
      this.playDistant()
    }
    const health = game.player?.health ?? 100
    if (health < 35 && game.state === 'playing') {
      this.lastHeart -= dt
      if (this.lastHeart <= 0) {
        this.lastHeart = 0.55 + (health / 35) * 0.6
        this.playHeartbeat(0.12 + (1 - health / 35) * 0.18)
      }
    }
    if (this.ambGain) {
      const tension = game.state === 'playing' ? 0.16 + Math.min(0.12, game.zombies.filter(z => z.state !== 'dead').length * 0.004) : 0.13
      this.ambGain.gain.setTargetAtTime(tension, this.ctx.currentTime, 1.5)
    }
  }

  panFor(pos, gainScale = 1) {
    if (!pos || !this.gameCamera) return { pan: 0, gain: 1 }
    const cam = this.gameCamera
    const dx = pos.x - cam.position.x, dz = pos.z - cam.position.z
    const dist = Math.hypot(dx, dz)
    const rightX = Math.cos(cam.rotation.y), rightZ = -Math.sin(cam.rotation.y)
    const pan = Math.max(-1, Math.min(1, (dx * rightX + dz * rightZ) / Math.max(1, dist) * 0.8))
    const gain = gainScale / (1 + dist * 0.06)
    return { pan, gain }
  }

  out(pan = 0) {
    const ctx = this.ctx
    const node = ctx.createGain()
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner(); p.pan.value = pan
      node.connect(p); p.connect(this.sfx)
    } else node.connect(this.sfx)
    return node
  }

  noiseHit({ duration = 0.12, freq = 1800, freqEnd = 400, gain = 0.5, type = 'lowpass', pan = 0, q = 0.8, send = true }) {
    if (!this.ready) return
    const ctx = this.ctx, now = ctx.currentTime
    const src = ctx.createBufferSource(); src.buffer = this.noise
    src.playbackRate.value = 0.9 + Math.random() * 0.2
    const filter = ctx.createBiquadFilter(); filter.type = type; filter.Q.value = q
    filter.frequency.setValueAtTime(freq, now)
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration)
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, now)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    const out = this.out(pan)
    src.connect(filter); filter.connect(g); g.connect(out)
    src.start(now); src.stop(now + duration + 0.02)
    if (send) this.sendToReverb(g, 0.7)
  }

  tone({ freq = 440, freqEnd = 220, duration = 0.2, gain = 0.2, type = 'sine', pan = 0, delay = 0, send = false }) {
    if (!this.ready) return
    const ctx = this.ctx, now = ctx.currentTime + delay
    const o = ctx.createOscillator(); o.type = type
    o.frequency.setValueAtTime(freq, now)
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(gain, now + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    const out = this.out(pan)
    o.connect(g); g.connect(out)
    o.start(now); o.stop(now + duration + 0.03)
    if (send) this.sendToReverb(g, 0.5)
  }

  sendToReverb(node, amount = 0.5) {
    if (!this.ready) return
    const send = this.ctx.createGain()
    send.gain.value = amount
    node.connect(send); send.connect(this.reverb)
  }

  playShot(type = 'rifle') {
    if (!this.ready) return
    if (type === 'shotgun') {
      this.noiseHit({ duration: 0.3, freq: 3200, freqEnd: 160, gain: 1.1, q: 0.5 })
      this.tone({ freq: 120, freqEnd: 34, duration: 0.35, gain: 0.55, type: 'sine', send: true })
      this.noiseHit({ duration: 0.08, freq: 6000, freqEnd: 2000, gain: 0.32, type: 'highpass', q: 0.6 })
    } else {
      this.noiseHit({ duration: 0.13, freq: 4200, freqEnd: 300, gain: 0.78, q: 0.7 })
      this.tone({ freq: 150, freqEnd: 48, duration: 0.16, gain: 0.42, type: 'triangle', send: true })
      this.noiseHit({ duration: 0.035, freq: 8000, freqEnd: 3000, gain: 0.32, type: 'highpass', q: 0.5 })
    }
  }

  playHit(head = false, kill = false) {
    if (!this.ready) return
    if (head) {
      this.tone({ freq: 2100, freqEnd: 1500, duration: 0.05, gain: 0.1, type: 'square' })
      this.noiseHit({ duration: 0.1, freq: 900, freqEnd: 160, gain: 0.3 })
    } else {
      this.tone({ freq: kill ? 1200 : 1500, freqEnd: 900, duration: 0.04, gain: 0.055, type: 'sine' })
    }
  }

  playHeadshot() {
    this.noiseHit({ duration: 0.18, freq: 1500, freqEnd: 120, gain: 0.5 })
    this.tone({ freq: 90, freqEnd: 40, duration: 0.25, gain: 0.3, type: 'sine' })
  }

  playReload(type = 'rifle') {
    if (!this.ready) return
    this.clickAt(0.0, 0.18)
    this.clickAt(type === 'shotgun' ? 0.25 : 0.35, 0.12)
    if (type === 'shotgun') { this.clickAt(0.7, 0.15); this.clickAt(1.15, 0.15) }
    else this.clickAt(1.35, 0.16)
  }
  playReloadEnd() { this.clickAt(0.02, 0.24); this.tone({ freq: 500, freqEnd: 300, duration: 0.06, gain: 0.06 }) }
  clickAt(delay, gain = 0.15) {
    if (!this.ready) return
    const ctx = this.ctx, now = ctx.currentTime + delay
    const src = ctx.createBufferSource(); src.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 800; f.Q.value = 2
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
    const out = this.out((Math.random() - .5) * 0.3)
    src.connect(f); f.connect(g); g.connect(out); src.start(now); src.stop(now + 0.06)
    this.tone({ freq: 2200, freqEnd: 1400, duration: 0.03, gain: gain * 0.3, type: 'square', delay })
  }

  playDryFire() { this.clickAt(0, 0.18); this.tone({ freq: 900, freqEnd: 500, duration: 0.05, gain: 0.05, type: 'square' }) }
  playSwitch() { this.clickAt(0, 0.12); this.tone({ freq: 700, freqEnd: 500, duration: 0.05, gain: 0.04 }) }
  playClick() { this.clickAt(0, 0.08) }
  playThrow() { this.noiseHit({ duration: 0.18, freq: 900, freqEnd: 300, gain: 0.15 }) }

  playFootstep(sprint = false, crouch = false) {
    if (!this.ready) return
    this.noiseHit({ duration: 0.09, freq: crouch ? 300 : 520, freqEnd: 120, gain: crouch ? 0.06 : sprint ? 0.2 : 0.13, send: false })
    this.tone({ freq: 90, freqEnd: 55, duration: 0.08, gain: crouch ? 0.03 : 0.07, type: 'sine' })
  }
  playJump() { this.noiseHit({ duration: 0.08, freq: 500, freqEnd: 200, gain: 0.1, send: false }) }
  playLand() { this.noiseHit({ duration: 0.14, freq: 320, freqEnd: 90, gain: 0.18 }); this.tone({ freq: 70, freqEnd: 40, duration: 0.12, gain: 0.1 }) }

  playHurt() {
    this.noiseHit({ duration: 0.22, freq: 700, freqEnd: 100, gain: 0.3 })
    this.tone({ freq: 160, freqEnd: 70, duration: 0.25, gain: 0.15, type: 'triangle' })
    this.tone({ freq: 3400, freqEnd: 2600, duration: 1.2, gain: 0.02, type: 'sine' })
  }
  playPartnerHurt() { this.noiseHit({ duration: 0.16, freq: 500, freqEnd: 150, gain: 0.16 }) }
  playPartnerDown() { this.tone({ freq: 240, freqEnd: 100, duration: 0.6, gain: 0.18, type: 'sawtooth' }); this.noiseHit({ duration: 0.5, freq: 800, freqEnd: 100, gain: 0.2 }) }

  playZombie(pos, type = 'walker') {
    if (!this.ready) return
    const { pan, gain } = this.panFor(pos, type === 'brute' ? 0.42 : 0.28)
    if (gain < 0.04) return
    const ctx = this.ctx, now = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sawtooth'
    const base = type === 'brute' ? 52 : type === 'runner' ? 96 : 68
    o.frequency.setValueAtTime(base + Math.random() * 20, now)
    o.frequency.linearRampToValueAtTime(base * 0.7, now + 0.8)
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = 5
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain * 0.5, now + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, now + 1)
    const out = this.out(pan)
    o.connect(f); f.connect(g); g.connect(out); o.start(now); o.stop(now + 1.1)
    this.noiseHit({ duration: 0.5, freq: 600, freqEnd: 180, gain: gain * 0.22, pan, send: true })
    this.sendToReverb(g, 0.6)
  }

  playZombieAttack(pos, type) {
    const { pan, gain } = this.panFor(pos, 0.34)
    this.noiseHit({ duration: 0.22, freq: 1200, freqEnd: 200, gain: gain * 0.5, pan })
    this.tone({ freq: 120, freqEnd: 60, duration: 0.15, gain: gain * 0.2, type: 'square', pan })
  }

  playDeath(pos, type) {
    const { pan, gain } = this.panFor(pos, 0.4)
    this.tone({ freq: 150, freqEnd: 40, duration: 0.7, gain: gain * 0.4, type: 'sawtooth', pan })
    this.noiseHit({ duration: 0.5, freq: 800, freqEnd: 60, gain: gain * 0.35, pan })
  }

  playPartnerShot(pos) {
    if (!this.ready) return
    const { pan } = this.panFor(pos, 1)
    this.noiseHit({ duration: 0.1, freq: 3000, freqEnd: 300, gain: 0.32, pan })
    this.tone({ freq: 130, freqEnd: 50, duration: 0.12, gain: 0.16, type: 'triangle', pan })
  }

  playExplosion(pos) {
    if (!this.ready) return
    const p = this.panFor(pos, 1)
    this.noiseHit({ duration: 1.1, freq: 2600, freqEnd: 40, gain: 1.2, pan: p.pan, q: 0.4 })
    this.tone({ freq: 90, freqEnd: 24, duration: 1, gain: 0.6, type: 'sine', pan: p.pan, send: true })
    this.noiseHit({ duration: 0.16, freq: 7000, freqEnd: 900, gain: 0.4, type: 'highpass', pan: p.pan })
  }

  playWave() {
    if (!this.ready) return
    this.tone({ freq: 110, freqEnd: 82, duration: 2.2, gain: 0.28, type: 'sawtooth', send: true })
    this.tone({ freq: 164, freqEnd: 123, duration: 2.2, gain: 0.17, type: 'triangle', send: true })
    this.tone({ freq: 55, freqEnd: 41, duration: 2.6, gain: 0.22, type: 'sine' })
    this.noiseHit({ duration: 1.6, freq: 400, freqEnd: 90, gain: 0.14, send: true })
  }
  playWaveClear() {
    if (!this.ready) return
    this.tone({ freq: 392, freqEnd: 392, duration: 0.2, gain: 0.12, type: 'triangle', send: true })
    this.tone({ freq: 523, freqEnd: 523, duration: 0.35, gain: 0.12, type: 'triangle', delay: 0.16, send: true })
    this.tone({ freq: 659, freqEnd: 659, duration: 0.6, gain: 0.1, type: 'triangle', delay: 0.32, send: true })
  }

  playPickup() {
    this.tone({ freq: 520, freqEnd: 780, duration: 0.12, gain: 0.12, type: 'triangle' })
    this.tone({ freq: 780, freqEnd: 1040, duration: 0.15, gain: 0.1, type: 'sine', delay: 0.08 })
  }
  playHeal() {
    this.tone({ freq: 300, freqEnd: 600, duration: 0.35, gain: 0.1, type: 'sine' })
    this.tone({ freq: 450, freqEnd: 900, duration: 0.4, gain: 0.07, type: 'triangle', delay: 0.1 })
  }
  playReviveTick() { this.tone({ freq: 700 + Math.random() * 100, freqEnd: 900, duration: 0.05, gain: 0.05, type: 'square' }) }
  playRevive() {
    this.tone({ freq: 440, freqEnd: 440, duration: 0.2, gain: 0.1, type: 'triangle' })
    this.tone({ freq: 660, freqEnd: 660, duration: 0.3, gain: 0.1, type: 'triangle', delay: 0.15 })
  }

  playHeartbeat(volume = 0.2) {
    this.tone({ freq: 58, freqEnd: 38, duration: 0.16, gain: volume, type: 'sine' })
    this.tone({ freq: 52, freqEnd: 34, duration: 0.18, gain: volume * 0.7, type: 'sine', delay: 0.18 })
  }

  playDistant() {
    if (!this.ready) return
    const pan = (Math.random() - .5) * 1.6
    const base = 50 + Math.random() * 40
    const ctx = this.ctx, now = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sawtooth'
    o.frequency.setValueAtTime(base, now); o.frequency.linearRampToValueAtTime(base * 0.8, now + 2)
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 200
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.02, now + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2)
    const out = this.out(pan)
    o.connect(f); f.connect(g); g.connect(out); o.start(now); o.stop(now + 2.3)
    this.sendToReverb(g, 1)
    if (Math.random() > 0.5) this.noiseHit({ duration: 0.3, freq: 3000, freqEnd: 400, gain: 0.02, pan, send: true })
  }
}
