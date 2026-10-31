const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export class Soundscape {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.reverb = null;
    this.noise = null;
    this.started = false;
    this.musicClock = 0;
    this.heartClock = 0;
    this.intensity = 0;
    this._lastStep = 0;
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.72;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 18;
    comp.ratio.value = 5;
    comp.attack.value = 0.005;
    comp.release.value = 0.3;
    this.master.connect(comp);
    comp.connect(ctx.destination);

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.36;
    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.value = 0.82;
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.55;
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.ambientGain.connect(this.master);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this._impulse(3.4, 2.7);
    const wet = ctx.createGain();
    wet.gain.value = 0.24;
    this.reverb.connect(wet);
    wet.connect(this.master);

    this.noise = this._noiseBuffer(2.5);
    this._buildAmbient();
    if (ctx.state === 'suspended') await ctx.resume();
    this.started = true;
  }

  _impulse(duration, decay) {
    const rate = this.ctx.sampleRate;
    const len = rate * duration;
    const buffer = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buffer;
  }

  _noiseBuffer(duration) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * duration);
    const buffer = this.ctx.createBuffer(1, len, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  _noiseSource(loop = false) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = loop;
    return src;
  }

  _buildAmbient() {
    const ctx = this.ctx;
    const wind = this._noiseSource(true);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 280;
    windFilter.Q.value = 0.7;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.055;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.ambientGain);
    wind.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.055;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 160;
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    [43.65, 65.4, 87.3].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = [0.11, 0.055, 0.018][i];
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 220;
      osc.connect(filt);
      filt.connect(g);
      g.connect(this.ambientGain);
      osc.start();
    });
  }

  _env(node, time, attack, decay, peak = 0.5) {
    const g = node.gain;
    g.cancelScheduledValues(time);
    g.setValueAtTime(0.0001, time);
    g.exponentialRampToValueAtTime(Math.max(peak, 0.0002), time + attack);
    g.exponentialRampToValueAtTime(0.0001, time + attack + decay);
  }

  _tone({ freq = 220, type = 'sine', dur = 0.2, gain = 0.2, slide = 0, delay = 0, filter = 0, reverb = 0 }) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    const g = ctx.createGain();
    this._env(g, t, 0.006, dur, gain);
    let out = g;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      g.connect(f);
      out = f;
    }
    osc.connect(g);
    out.connect(this.sfxGain);
    if (reverb) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      out.connect(send);
      send.connect(this.reverb);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  _burst({ dur = 0.16, gain = 0.2, freq = 1200, q = 1.2, type = 'bandpass', delay = 0, reverb = 0.1, slide = 0 }) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const src = this._noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(60, freq + slide), t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    this._env(g, t, 0.004, dur, gain);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    if (reverb) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      g.connect(send);
      send.connect(this.reverb);
    }
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  swing(heavy = false) {
    this._burst({ dur: heavy ? 0.32 : 0.18, gain: heavy ? 0.34 : 0.22, freq: heavy ? 700 : 1500, slide: -520, q: 0.8, reverb: 0.08 });
    this._tone({ freq: heavy ? 88 : 140, type: 'sine', dur: 0.16, gain: heavy ? 0.12 : 0.06, slide: -40 });
  }

  hit(heavy = false) {
    this._burst({ dur: heavy ? 0.3 : 0.16, gain: heavy ? 0.55 : 0.34, freq: 520, q: 0.7, reverb: 0.22 });
    this._tone({ freq: heavy ? 52 : 76, type: 'sine', dur: heavy ? 0.38 : 0.2, gain: heavy ? 0.55 : 0.3, slide: -25 });
    this._tone({ freq: heavy ? 118 : 180, type: 'triangle', dur: 0.12, gain: 0.1, slide: -60, delay: 0.01 });
  }

  parry() {
    [880, 1320, 1760, 2640].forEach((f, i) => {
      this._tone({ freq: f, type: 'sine', dur: 0.9 - i * 0.12, gain: 0.2 - i * 0.03, delay: i * 0.006, reverb: 0.7 });
    });
    this._burst({ dur: 0.42, gain: 0.4, freq: 4200, q: 2.5, reverb: 0.6 });
    this._tone({ freq: 54, type: 'sine', dur: 0.6, gain: 0.35, slide: -15, reverb: 0.3 });
  }

  damage() {
    this._burst({ dur: 0.26, gain: 0.45, freq: 280, q: 0.6, reverb: 0.3 });
    this._tone({ freq: 92, type: 'sawtooth', dur: 0.22, gain: 0.14, slide: -45, filter: 340 });
  }

  dodge() {
    this._burst({ dur: 0.3, gain: 0.2, freq: 900, slide: -600, q: 0.7, reverb: 0.2 });
  }

  step() {
    this._burst({ dur: 0.07, gain: 0.07, freq: 210, q: 0.8, reverb: 0.05 });
  }

  heal() {
    [392, 523.25, 659.25, 783.99].forEach((f, i) => {
      this._tone({ freq: f, type: 'sine', dur: 0.7, gain: 0.12, delay: i * 0.06, reverb: 0.65 });
    });
  }

  roar(big = false) {
    this._tone({ freq: big ? 68 : 92, type: 'sawtooth', dur: 1.2, gain: 0.3, slide: -26, filter: 280, reverb: 0.55 });
    this._tone({ freq: big ? 34 : 46, type: 'sine', dur: 1.4, gain: 0.4, slide: -8, reverb: 0.4 });
    this._burst({ dur: 0.9, gain: 0.2, freq: 340, q: 0.5, reverb: 0.6 });
  }

  whoosh() {
    this._burst({ dur: 0.4, gain: 0.14, freq: 620, slide: -420, q: 0.5, reverb: 0.35 });
  }

  cast() {
    this._tone({ freq: 220, type: 'triangle', dur: 0.55, gain: 0.12, slide: 440, reverb: 0.6 });
    this._tone({ freq: 330, type: 'sine', dur: 0.8, gain: 0.08, slide: 660, delay: 0.08, reverb: 0.7 });
  }

  death() {
    this._tone({ freq: 55, type: 'sine', dur: 3.4, gain: 0.4, slide: -22, reverb: 0.7 });
    this._tone({ freq: 82.4, type: 'triangle', dur: 2.8, gain: 0.15, slide: -30, filter: 200, reverb: 0.6 });
    this._burst({ dur: 1.6, gain: 0.15, freq: 240, q: 0.4, reverb: 0.8 });
  }

  victory() {
    [130.8, 164.8, 196, 261.6, 329.6].forEach((f, i) => {
      this._tone({ freq: f, type: 'triangle', dur: 3.2, gain: 0.1, delay: i * 0.16, reverb: 0.75 });
    });
    this._tone({ freq: 65.4, type: 'sine', dur: 4, gain: 0.35, reverb: 0.5 });
  }

  bossDeath() {
    this._tone({ freq: 110, type: 'sawtooth', dur: 2.4, gain: 0.22, slide: -80, filter: 500, reverb: 0.6 });
    this._tone({ freq: 44, type: 'sine', dur: 3, gain: 0.5, slide: -18, reverb: 0.5 });
    this._burst({ dur: 1.8, gain: 0.28, freq: 900, slide: -780, q: 0.4, reverb: 0.6 });
  }

  ui() {
    this._tone({ freq: 620, type: 'sine', dur: 0.08, gain: 0.08, reverb: 0.15 });
  }

  update(dt, { active = false, intensity = 0, hp = 1 } = {}) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    this.intensity += (intensity - this.intensity) * Math.min(1, dt * 1.5);
    if (!active) return;

    this.musicClock += dt;
    const interval = 1.08 - this.intensity * 0.16;
    if (this.musicClock > interval) {
      this.musicClock = 0;
      const t = this.ctx.currentTime;
      const kick = this.ctx.createOscillator();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(74, t);
      kick.frequency.exponentialRampToValueAtTime(36, t + 0.26);
      const kg = this.ctx.createGain();
      this._env(kg, t, 0.006, 0.38, 0.34 + this.intensity * 0.18);
      kick.connect(kg);
      kg.connect(this.musicGain);
      kick.start(t);
      kick.stop(t + 0.45);
      this._lastStep = (this._lastStep + 1) % 4;
      if (this._lastStep === 2) {
        this._tone({ freq: 49, type: 'sine', dur: 0.7, gain: 0.16 + this.intensity * 0.08, filter: 160, reverb: 0.25 });
      }
    }

    if (hp < 0.32) {
      this.heartClock += dt;
      if (this.heartClock > 0.88) {
        this.heartClock = 0;
        this._tone({ freq: 46, type: 'sine', dur: 0.17, gain: 0.18, slide: -8 });
        this._tone({ freq: 42, type: 'sine', dur: 0.2, gain: 0.12, delay: 0.18, slide: -6 });
      }
    }
  }
}
