// Procedural WebAudio soundtrack + weapon SFX. No external assets.
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfx = null;
    this.music = null;
    this.muted = localStorage.getItem('tribes_muted') === '1';
    this.jetGain = null;
    this.jetFilter = null;
    this.step = 0;
    this.nextNote = 0;
    this.intensity = 0.35;
    this.running = false;
    this.musicOn = true;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 18;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.55;
    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.85;
    this.music = ctx.createGain();
    this.music.gain.value = 0.3;
    this.sfx.connect(comp);
    this.music.connect(comp);
    comp.connect(this.master);
    this.master.connect(ctx.destination);

    // noise buffer
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;

    // jetpack loop
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 460;
    f.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(f); f.connect(g); g.connect(this.sfx);
    src.start();
    this.jetGain = g;
    this.jetFilter = f;

    // menu ambient pad
    this.startMusic();
    this.nextNote = ctx.currentTime + 0.2;
    this.running = true;
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem('tribes_muted', m ? '1' : '0');
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.08);
  }

  setJet(on, fuel = 0) {
    if (!this.jetGain) return;
    const t = this.ctx.currentTime;
    this.jetGain.gain.setTargetAtTime(on ? 0.16 + 0.1 * fuel : 0, t, 0.055);
    if (on) this.jetFilter.frequency.setTargetAtTime(600 + 500 * fuel + Math.sin(t * 38) * 80, t, 0.06);
  }

  tone({ f = 440, to = null, dur = 0.15, type = 'sine', vol = 0.2, delay = 0, attack = 0.005, filter = null, bus = null }) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter) {
      const bq = ctx.createBiquadFilter();
      bq.type = filter.type || 'lowpass';
      bq.frequency.setValueAtTime(filter.f || 1200, t);
      if (filter.to) bq.frequency.exponentialRampToValueAtTime(filter.to, t + dur);
      bq.Q.value = filter.q ?? 1;
      node.connect(bq); node = bq;
    }
    node.connect(g); g.connect(bus || this.sfx);
    o.start(t); o.stop(t + dur + 0.02);
  }

  noise({ dur = 0.2, vol = 0.25, freq = 1200, to = null, type = 'lowpass', q = 0.8, delay = 0, bus = null }) {
    if (!this.ctx || this.muted || !this.noiseBuf) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.playbackRate.value = 1;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(Math.max(30, to), t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || this.sfx);
    s.start(t, Math.random() * 1.2); s.stop(t + dur + 0.02);
  }

  ui() { this.tone({ f: 1400, to: 900, dur: 0.04, type: 'square', vol: 0.035 }); }
  uiBig() { this.tone({ f: 220, to: 660, dur: 0.16, type: 'sawtooth', vol: 0.08, filter: { f: 900, to: 3000 } }); }

  shotgun() {
    this.noise({ dur: 0.28, vol: 0.5, freq: 3200, to: 220, q: 0.5 });
    this.tone({ f: 130, to: 52, dur: 0.2, type: 'square', vol: 0.22, filter: { f: 900, to: 200 } });
    this.noise({ dur: 0.06, vol: 0.25, freq: 5000, type: 'highpass' });
  }

  rocket() {
    this.tone({ f: 300, to: 90, dur: 0.32, type: 'sawtooth', vol: 0.16, filter: { f: 1800, to: 300 } });
    this.noise({ dur: 0.42, vol: 0.26, freq: 1600, to: 240, type: 'bandpass', q: 0.6 });
    this.tone({ f: 70, to: 40, dur: 0.3, type: 'sine', vol: 0.2 });
  }

  rail() {
    this.tone({ f: 2400, to: 260, dur: 0.32, type: 'sawtooth', vol: 0.14, filter: { f: 5000, to: 500, q: 4 } });
    this.tone({ f: 900, to: 1800, dur: 0.12, type: 'sine', vol: 0.1 });
    this.noise({ dur: 0.24, vol: 0.15, freq: 7000, to: 900, type: 'highpass' });
  }

  spin() {
    this.tone({ f: 520, to: 1300, dur: 0.22, type: 'triangle', vol: 0.16, filter: { f: 600, to: 3200, q: 3 } });
    this.noise({ dur: 0.2, vol: 0.12, freq: 2600, to: 900, type: 'bandpass', q: 2 });
  }

  explosion(big = 1) {
    this.noise({ dur: 0.7 * big, vol: 0.6, freq: 900, to: 70, q: 0.5 });
    this.tone({ f: 110, to: 28, dur: 0.55 * big, type: 'sine', vol: 0.42 });
    this.tone({ f: 60, to: 24, dur: 0.7 * big, type: 'triangle', vol: 0.3 });
    this.noise({ dur: 0.09, vol: 0.4, freq: 5000, type: 'highpass' });
  }

  hit() {
    this.tone({ f: 1800, to: 1200, dur: 0.05, type: 'square', vol: 0.09 });
    this.noise({ dur: 0.05, vol: 0.1, freq: 3200, type: 'highpass' });
  }

  hitKill() {
    this.tone({ f: 880, to: 1320, dur: 0.14, type: 'square', vol: 0.1 });
    this.tone({ f: 1320, to: 1760, dur: 0.16, type: 'square', vol: 0.07, delay: 0.06 });
    this.noise({ dur: 0.2, vol: 0.14, freq: 2000, to: 400, q: 1 });
  }

  hurt() {
    this.tone({ f: 90, to: 45, dur: 0.22, type: 'sawtooth', vol: 0.28, filter: { f: 500, to: 160 } });
    this.noise({ dur: 0.16, vol: 0.16, freq: 700, to: 200 });
  }

  jump() { this.tone({ f: 240, to: 460, dur: 0.12, type: 'sine', vol: 0.08 }); }
  land() { this.noise({ dur: 0.12, vol: 0.14, freq: 420, to: 100 }); }
  pickup() {
    [660, 880, 1320].forEach((f, i) => this.tone({ f, dur: 0.16, type: 'triangle', vol: 0.08, delay: i * 0.055 }));
  }
  armor() {
    [330, 440, 660].forEach((f, i) => this.tone({ f, dur: 0.22, type: 'sine', vol: 0.09, delay: i * 0.04 }));
  }
  quad() {
    [110, 165, 220, 330, 440].forEach((f, i) => this.tone({ f, dur: 0.9, type: 'sawtooth', vol: 0.06, delay: i * 0.05, filter: { f: 1400, to: 3200 } }));
    this.tone({ f: 55, to: 110, dur: 1.2, type: 'sine', vol: 0.18 });
  }
  death() {
    this.tone({ f: 300, to: 40, dur: 0.9, type: 'sawtooth', vol: 0.18, filter: { f: 1200, to: 100 } });
    this.noise({ dur: 0.7, vol: 0.2, freq: 800, to: 80 });
  }
  spawn() {
    this.tone({ f: 180, to: 720, dur: 0.35, type: 'triangle', vol: 0.07 });
    this.noise({ dur: 0.3, vol: 0.08, freq: 1200, to: 4200, type: 'bandpass', q: 1.6 });
  }
  pad() {
    this.tone({ f: 160, to: 900, dur: 0.35, type: 'sine', vol: 0.12 });
    this.noise({ dur: 0.4, vol: 0.14, freq: 600, to: 3200, type: 'bandpass', q: 1.4 });
  }
  tick() { this.tone({ f: 1100, dur: 0.03, type: 'square', vol: 0.04 }); }
  matchStart() {
    [220, 330, 440, 660].forEach((f, i) => this.tone({ f, dur: 0.34, type: 'sawtooth', vol: 0.09, delay: i * 0.11, filter: { f: 800, to: 2600 } }));
  }
  matchEnd(win) {
    const seq = win ? [330, 440, 550, 660, 880] : [330, 277, 220, 165];
    seq.forEach((f, i) => this.tone({ f, dur: 0.5, type: 'triangle', vol: 0.1, delay: i * 0.14 }));
  }

  startMusic() {
    if (!this.ctx || this.musicOn === false) return;
    this.musicOn = true;
    let padTimer = null;
    const ctx = this.ctx;
    // Dark drone pad
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 380;
    padFilter.Q.value = 3;
    padGain.connect(padFilter); padFilter.connect(this.music);
    [55, 82.4, 110, 164.8].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 6;
      const g = ctx.createGain();
      g.gain.value = i % 2 ? 0.12 : 0.2;
      o.connect(g); g.connect(padGain);
      o.start();
    });
    // slow filter LFO
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045;
    const lg = ctx.createGain();
    lg.gain.value = 180;
    lfo.connect(lg); lg.connect(padFilter.frequency);
    lfo.start();
    this.padGain = padGain;
  }

  setIntensity(v) {
    this.intensity = Math.max(0, Math.min(1, v));
    if (this.padGain) this.padGain.gain.setTargetAtTime(0.035 + this.intensity * 0.03, this.ctx.currentTime, 0.5);
  }

  update() {
    if (!this.ctx || !this.running || this.muted) return;
    const ctx = this.ctx;
    const stepDur = 60 / 128 / 4; // 16th
    while (this.nextNote < ctx.currentTime + 0.15) {
      const t = this.nextNote;
      const s = this.step % 32;
      const bar = Math.floor(this.step / 32) % 4;
      const bassRoot = [55, 55, 49, 58.27][bar];
      const energy = this.intensity;

      // kick
      if (s % 8 === 0 || (s === 22 && energy > 0.5)) this.kick(t, 0.22);
      // snare on 2 & 4
      if (s % 16 === 8) this.snare(t, 0.13);
      // hats
      if (s % 2 === 0) this.hat(t, 0.018 + energy * 0.02, s % 4 === 0);
      // bass 16th pattern
      if ([0, 3, 6, 8, 11, 14].includes(s % 16)) {
        this.bass(t, bassRoot * (s % 8 === 6 ? 2 : 1), stepDur * 1.4, 0.13 + energy * 0.06);
      }
      // arp sparkle when intense
      if (energy > 0.35 && s % 2 === 0 && s % 8 !== 0) {
        const notes = [440, 523.25, 659.25, 783.99, 587.33, 698.46];
        const n = notes[(this.step / 2 | 0) % notes.length] * (bar === 2 ? 0.5 : 1);
        this.pluck(t, n, stepDur * 0.8, 0.035 + energy * 0.03);
      }
      this.step++;
      this.nextNote += stepDur;
    }
  }

  kick(t, vol) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); g.connect(this.music);
    o.start(t); o.stop(t + 0.24);
  }
  snare(t, vol) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 1.2;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    s.connect(f); f.connect(g); g.connect(this.music);
    s.start(t, Math.random()); s.stop(t + 0.2);
  }
  hat(t, vol, open) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6500;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (open ? 0.1 : 0.04));
    s.connect(f); f.connect(g); g.connect(this.music);
    s.start(t, Math.random()); s.stop(t + 0.12);
  }
  bass(t, f, dur, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.setValueAtTime(520, t); fl.frequency.exponentialRampToValueAtTime(160, t + dur); fl.Q.value = 5;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(this.music);
    o.start(t); o.stop(t + dur + 0.02);
  }
  pluck(t, f, dur, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.music);
    o.start(t); o.stop(t + dur + 0.02);
  }
}
