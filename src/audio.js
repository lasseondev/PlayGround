/* Procedural audio for The Sunken Sanctum. No external assets. */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverb = null;
    this.muted = false;
    this.started = false;
    this.stepFlip = false;
    this.bellTimer = 0;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 16;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.8, 2.2);
    const wet = this.ctx.createGain();
    wet.gain.value = 0.24;
    this.reverb.connect(wet);
    wet.connect(this.master);

    this.noiseBuffer = this.makeNoise(2.0);
    this.startAmbience();
    this.started = true;
  }

  makeImpulse(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  makeNoise(seconds) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 2.2;
    }
    return buf;
  }

  now() { return this.ctx ? this.ctx.currentTime : 0; }

  startAmbience() {
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // low wind
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer;
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 420;
    windFilter.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.022;
    wind.connect(windFilter).connect(windGain).connect(this.master);
    wind.start(t);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(windGain.gain);
    lfo.start(t);

    // cavern drone
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.028;
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 260;
    droneFilter.Q.value = 1.2;
    droneGain.connect(droneFilter);
    droneFilter.connect(this.master);
    const send = ctx.createGain();
    send.gain.value = 0.4;
    droneFilter.connect(send).connect(this.reverb);

    [55, 82.5, 110, 164.8].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? 'sine' : 'triangle';
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = i === 3 ? 0.12 : 0.35;
      o.connect(g).connect(droneGain);
      o.start(t + i * 0.2);
      const slow = ctx.createOscillator();
      slow.frequency.value = 0.03 + i * 0.011;
      const slowGain = ctx.createGain();
      slowGain.gain.value = 3 + i;
      slow.connect(slowGain).connect(o.detune);
      slow.start(t);
    });

    this.scheduleBell();
  }

  scheduleBell() {
    if (!this.ctx) return;
    const delay = 5000 + Math.random() * 9000;
    this.bellTimer = setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running' && !this.muted) {
        const notes = [220, 261.63, 293.66, 349.23, 392];
        const f = notes[(Math.random() * notes.length) | 0];
        this.bell(f, 0.012, 3.8);
        if (Math.random() < 0.4) this.bell(f * 1.5, 0.007, 3.2, 0.6);
      }
      this.scheduleBell();
    }, delay);
  }

  bell(freq, gain = 0.02, duration = 3, delay = 0) {
    if (!this.ctx) return;
    const t = this.now() + delay;
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(this.master);
    const send = this.ctx.createGain();
    send.gain.value = 0.8;
    g.connect(send).connect(this.reverb);
    o.start(t);
    o.stop(t + duration + 0.1);
  }

  tone({ type = 'sine', f0 = 440, f1 = 440, dur = 0.2, gain = 0.15, delay = 0, filter = 0, q = 1, send = 0.2, attack = 0.005 }) {
    if (!this.ctx || this.muted) return;
    const t = this.now() + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, f0), t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      f.Q.value = q;
      o.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(this.master);
    if (send > 0) {
      const s = this.ctx.createGain();
      s.gain.value = send;
      g.connect(s).connect(this.reverb);
    }
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  noise({ dur = 0.2, gain = 0.2, f0 = 1200, f1 = 400, type = 'bandpass', q = 0.8, delay = 0, send = 0.25, attack = 0.004 }) {
    if (!this.ctx || this.muted) return;
    const t = this.now() + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.playbackRate.value = 1;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(Math.max(40, f0), t);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g);
    g.connect(this.master);
    if (send > 0) {
      const s = this.ctx.createGain();
      s.gain.value = send;
      g.connect(s).connect(this.reverb);
    }
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) {
      const t = this.now();
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(muted ? 0 : 0.55, t, 0.08);
    }
  }

  /* ------------------------------------------------------------ sfx */

  step() {
    this.stepFlip = !this.stepFlip;
    this.noise({ dur: 0.075, gain: this.stepFlip ? 0.055 : 0.042, f0: this.stepFlip ? 520 : 430, f1: 180, type: 'lowpass', q: 1.2, send: 0.12 });
    this.tone({ type: 'sine', f0: 78, f1: 52, dur: 0.08, gain: 0.04, send: 0.05 });
  }

  swing(combo = 0) {
    this.noise({ dur: 0.19, gain: 0.16, f0: 2400 + combo * 300, f1: 320, type: 'bandpass', q: 1.4, send: 0.35 });
    this.tone({ type: 'triangle', f0: 900 + combo * 120, f1: 260, dur: 0.14, gain: 0.035, send: 0.4 });
  }

  hit() {
    this.tone({ type: 'square', f0: 150, f1: 52, dur: 0.15, gain: 0.13, filter: 900, send: 0.18 });
    this.noise({ dur: 0.12, gain: 0.16, f0: 2800, f1: 500, type: 'highpass', q: 0.7, send: 0.2 });
    this.tone({ type: 'sine', f0: 92, f1: 42, dur: 0.22, gain: 0.15, send: 0.15 });
  }

  clank() {
    this.tone({ type: 'square', f0: 1100, f1: 720, dur: 0.16, gain: 0.045, send: 0.5 });
    this.tone({ type: 'sine', f0: 2100, f1: 1700, dur: 0.28, gain: 0.03, send: 0.55 });
    this.noise({ dur: 0.1, gain: 0.08, f0: 4200, f1: 2000, type: 'highpass', q: 0.7, send: 0.3 });
  }

  hurt() {
    this.tone({ type: 'sawtooth', f0: 170, f1: 62, dur: 0.28, gain: 0.12, filter: 800, send: 0.15 });
    this.noise({ dur: 0.22, gain: 0.13, f0: 900, f1: 250, type: 'bandpass', q: 0.6, send: 0.2 });
  }

  roll() {
    this.noise({ dur: 0.28, gain: 0.1, f0: 700, f1: 180, type: 'bandpass', q: 0.8, send: 0.2 });
  }

  pickup() {
    [523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f, dur: 0.42, gain: 0.055, delay: i * 0.075, send: 0.5 });
    });
  }

  sigil() {
    const chord = [261.63, 329.63, 392, 523.25, 659.25];
    chord.forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f, dur: 2.4, gain: 0.035, delay: i * 0.08, send: 0.7, attack: 0.02 });
      this.tone({ type: 'triangle', f0: f * 2, f1: f * 2, dur: 1.2, gain: 0.012, delay: i * 0.08 + 0.1, send: 0.7 });
    });
    this.noise({ dur: 1.1, gain: 0.04, f0: 5000, f1: 1500, type: 'highpass', q: 0.5, send: 0.6, attack: 0.1 });
  }

  gate() {
    this.noise({ dur: 1.6, gain: 0.11, f0: 260, f1: 90, type: 'lowpass', q: 1.6, send: 0.35, attack: 0.08 });
    this.tone({ type: 'sine', f0: 48, f1: 32, dur: 1.5, gain: 0.1, send: 0.3, attack: 0.05 });
    this.noise({ dur: 0.4, gain: 0.06, f0: 1500, f1: 400, type: 'bandpass', q: 1.2, send: 0.3, delay: 0.95 });
  }

  doorRumble() {
    this.noise({ dur: 2.2, gain: 0.13, f0: 180, f1: 60, type: 'lowpass', q: 1.2, send: 0.4, attack: 0.15 });
    this.tone({ type: 'sine', f0: 36, f1: 28, dur: 2, gain: 0.12, send: 0.35, attack: 0.1 });
  }

  flame() {
    this.noise({ dur: 0.45, gain: 0.09, f0: 300, f1: 1600, type: 'bandpass', q: 0.9, send: 0.3 });
    this.tone({ type: 'sine', f0: 300, f1: 140, dur: 0.3, gain: 0.02, send: 0.2 });
  }

  solve() {
    [392, 523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f, dur: 1.8, gain: 0.05, delay: i * 0.1, send: 0.7, attack: 0.01 });
    });
    this.noise({ dur: 1.4, gain: 0.045, f0: 4000, f1: 900, type: 'highpass', q: 0.5, send: 0.7, attack: 0.2 });
  }

  wrong() {
    this.tone({ type: 'sawtooth', f0: 116, f1: 104, dur: 0.6, gain: 0.06, filter: 500, send: 0.4 });
    this.tone({ type: 'sawtooth', f0: 123, f1: 110, dur: 0.6, gain: 0.05, filter: 500, send: 0.4, delay: 0.04 });
  }

  heal() {
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f, dur: 1.2, gain: 0.04, delay: i * 0.06, send: 0.7 });
    });
  }

  slam() {
    this.tone({ type: 'sine', f0: 62, f1: 28, dur: 0.7, gain: 0.22, send: 0.4 });
    this.noise({ dur: 0.6, gain: 0.18, f0: 420, f1: 100, type: 'lowpass', q: 1.1, send: 0.45 });
    this.noise({ dur: 0.9, gain: 0.07, f0: 1800, f1: 400, type: 'bandpass', q: 0.6, send: 0.5, delay: 0.05 });
  }

  roar() {
    this.tone({ type: 'sawtooth', f0: 92, f1: 42, dur: 1.5, gain: 0.11, filter: 520, send: 0.55, attack: 0.12 });
    this.tone({ type: 'square', f0: 47, f1: 34, dur: 1.4, gain: 0.07, filter: 240, send: 0.55, attack: 0.12 });
    this.noise({ dur: 1.4, gain: 0.1, f0: 700, f1: 200, type: 'bandpass', q: 0.5, send: 0.6, attack: 0.15 });
  }

  bossHit() {
    this.tone({ type: 'square', f0: 120, f1: 48, dur: 0.2, gain: 0.15, filter: 700, send: 0.3 });
    this.noise({ dur: 0.18, gain: 0.12, f0: 2200, f1: 600, type: 'bandpass', q: 0.8, send: 0.3 });
  }

  charge() {
    this.noise({ dur: 0.7, gain: 0.1, f0: 200, f1: 1400, type: 'bandpass', q: 0.7, send: 0.4, attack: 0.1 });
  }

  death() {
    [220, 174.61, 146.83, 110].forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f * 0.6, dur: 1.6, gain: 0.07, delay: i * 0.18, send: 0.6 });
    });
    this.noise({ dur: 1.2, gain: 0.05, f0: 600, f1: 120, type: 'lowpass', q: 0.8, send: 0.5 });
  }

  victory() {
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this.tone({ type: 'sine', f0: f, f1: f, dur: 3.2, gain: 0.05, delay: i * 0.16, send: 0.8, attack: 0.03 });
      this.tone({ type: 'triangle', f0: f / 2, f1: f / 2, dur: 2.4, gain: 0.015, delay: i * 0.16, send: 0.8 });
    });
    this.noise({ dur: 2.5, gain: 0.04, f0: 6000, f1: 1200, type: 'highpass', q: 0.5, send: 0.8, attack: 0.6 });
  }

  ui() {
    this.tone({ type: 'sine', f0: 660, f1: 880, dur: 0.12, gain: 0.025, send: 0.3 });
  }
}
