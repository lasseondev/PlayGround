/* NEON HEAT — procedural audio (WebAudio, no assets) */
(function () {
  'use strict';

  class GameAudio {
    constructor() {
      this.ctx = null;
      this.ready = false;
      this.muted = false;
      this.musicOn = true;
      this.noiseBuffer = null;
      this.nextNote = 0;
      this.step = 0;
      this.timer = null;
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
      } catch (e) { return; }

      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.85;
      this.master.connect(ctx.destination);

      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 0.17;
      this.musicGain.connect(this.master);

      this.sfxGain = ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.master);

      // shared noise buffer
      const len = Math.floor(ctx.sampleRate * 1.2);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;

      this.buildEngine();
      this.buildSiren();
      this.ready = true;
      this.startMusic();
    }

    buildEngine() {
      const ctx = this.ctx;
      this.engineGain = ctx.createGain();
      this.engineGain.gain.value = 0;
      this.engineFilter = ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 320;
      this.engineFilter.Q.value = 4;
      this.engineGain.connect(this.engineFilter);
      this.engineFilter.connect(this.sfxGain);

      this.eng1 = ctx.createOscillator();
      this.eng1.type = 'sawtooth';
      this.eng1.frequency.value = 52;
      this.eng2 = ctx.createOscillator();
      this.eng2.type = 'square';
      this.eng2.frequency.value = 26.5;
      const g2 = ctx.createGain(); g2.gain.value = 0.35;
      this.eng1.connect(this.engineGain);
      this.eng2.connect(g2); g2.connect(this.engineGain);
      this.eng1.start(); this.eng2.start();

      this.engineNoise = ctx.createBufferSource();
      this.engineNoise.buffer = this.noiseBuffer;
      this.engineNoise.loop = true;
      this.engineNoiseGain = ctx.createGain();
      this.engineNoiseGain.gain.value = 0;
      const nf = ctx.createBiquadFilter();
      nf.type = 'bandpass'; nf.frequency.value = 180; nf.Q.value = 0.8;
      this.engineNoise.connect(nf); nf.connect(this.engineNoiseGain); this.engineNoiseGain.connect(this.sfxGain);
      this.engineNoise.start();
    }

    setEngine(kmh, throttle, nitro, driving) {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      const sp = Math.min(kmh, 220);
      const f = 44 + sp * 1.35 + Math.max(0, throttle) * 16;
      this.eng1.frequency.setTargetAtTime(f, t, 0.06);
      this.eng2.frequency.setTargetAtTime(f * 0.505, t, 0.06);
      this.engineFilter.frequency.setTargetAtTime(260 + sp * 15 + (nitro ? 500 : 0), t, 0.08);
      const target = driving ? (0.035 + Math.max(0, throttle) * 0.03 + sp * 0.00055 + (nitro ? 0.03 : 0)) : 0;
      this.engineGain.gain.setTargetAtTime(target, t, 0.1);
      this.engineNoiseGain.gain.setTargetAtTime(driving ? (0.012 + sp * 0.0004) : 0, t, 0.12);
    }

    buildSiren() {
      const ctx = this.ctx;
      this.sirenGain = ctx.createGain();
      this.sirenGain.gain.value = 0;
      this.sirenPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      this.sirenOsc = ctx.createOscillator();
      this.sirenOsc.type = 'triangle';
      this.sirenOsc.frequency.value = 720;
      this.sirenLfo = ctx.createOscillator();
      this.sirenLfo.type = 'sine';
      this.sirenLfo.frequency.value = 0.42;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 170;
      this.sirenLfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc.frequency);
      this.sirenOsc.connect(this.sirenGain);
      if (this.sirenPan) { this.sirenGain.connect(this.sirenPan); this.sirenPan.connect(this.sfxGain); }
      else this.sirenGain.connect(this.sfxGain);
      this.sirenOsc.start();
      this.sirenLfo.start();
    }

    setSiren(dist, pan) {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      const vol = Math.max(0, Math.min(1, 1 - dist / 150));
      this.sirenGain.gain.setTargetAtTime(vol * vol * 0.085, t, 0.15);
      if (this.sirenPan) this.sirenPan.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)) * 0.85, t, 0.15);
    }

    tone(freq, dur, type, vol, when, dest) {
      if (!this.ready) return;
      const ctx = this.ctx;
      const t = when || ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest || this.sfxGain);
      o.start(t); o.stop(t + dur + 0.02);
    }

    crash(intensity) {
      if (!this.ready) return;
      const ctx = this.ctx, t = ctx.currentTime;
      const s = ctx.createBufferSource();
      s.buffer = this.noiseBuffer;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 700 + intensity * 900;
      const g = ctx.createGain();
      const v = Math.min(0.5, 0.12 + intensity * 0.05);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      s.connect(f); f.connect(g); g.connect(this.sfxGain);
      s.start(t); s.stop(t + 0.32);
      this.tone(70 + intensity * 3, 0.22, 'sine', Math.min(0.3, 0.08 + intensity * 0.02), t);
    }

    explosion() {
      if (!this.ready) return;
      const ctx = this.ctx, t = ctx.currentTime;
      const s = ctx.createBufferSource();
      s.buffer = this.noiseBuffer;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.setValueAtTime(1800, t);
      f.frequency.exponentialRampToValueAtTime(120, t + 0.9);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      s.connect(f); f.connect(g); g.connect(this.sfxGain);
      s.start(t); s.stop(t + 1.05);
      this.tone(48, 0.9, 'sine', 0.35, t);
      this.tone(96, 0.5, 'sawtooth', 0.12, t);
    }

    pickup() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      this.tone(880, 0.09, 'square', 0.07, t);
      this.tone(1320, 0.13, 'square', 0.06, t + 0.07);
    }

    repair() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      this.tone(523, 0.1, 'triangle', 0.09, t);
      this.tone(659, 0.1, 'triangle', 0.09, t + 0.08);
      this.tone(784, 0.16, 'triangle', 0.09, t + 0.16);
    }

    delivery() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      const notes = [523, 659, 784, 1046];
      notes.forEach((n, i) => this.tone(n, 0.22, 'triangle', 0.11, t + i * 0.09));
      this.tone(1568, 0.5, 'sine', 0.06, t + 0.38);
    }

    bad() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      this.tone(180, 0.2, 'sawtooth', 0.09, t);
      this.tone(130, 0.3, 'sawtooth', 0.08, t + 0.14);
    }

    click() {
      if (!this.ready) return;
      this.tone(660, 0.06, 'square', 0.04);
    }

    toggleMute() {
      this.muted = !this.muted;
      if (!this.ready) return;
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
      return this.muted;
    }

    // ------- synthwave loop -------
    startMusic() {
      if (!this.ready || this.timer) return;
      const ctx = this.ctx;
      // dotted-eighth delay for the arp
      this.delay = ctx.createDelay(1.0);
      this.delay.delayTime.value = 0.36;
      this.delayGain = ctx.createGain();
      this.delayGain.gain.value = 0.3;
      this.delay.connect(this.delayGain);
      this.delayGain.connect(this.delay);
      this.delayGain.connect(this.musicGain);

      this.nextNote = ctx.currentTime + 0.1;
      this.step = 0;
      this.timer = setInterval(() => this.schedule(), 25);
    }

    schedule() {
      if (!this.ready) return;
      const ctx = this.ctx;
      const bpm = 102;
      const sixteenth = 60 / bpm / 4;
      while (this.nextNote < ctx.currentTime + 0.22) {
        this.playStep(this.step, this.nextNote, sixteenth);
        this.nextNote += sixteenth;
        this.step = (this.step + 1) % 64;
      }
    }

    playStep(step, t, sixteenth) {
      const ctx = this.ctx;
      // 4 bars, one chord per bar
      const chords = [
        { root: 55.0, notes: [220.0, 261.63, 329.63, 392.0] },   // Am
        { root: 43.65, notes: [174.61, 220.0, 261.63, 349.23] }, // F
        { root: 65.41, notes: [261.63, 329.63, 392.0, 523.25] }, // C
        { root: 49.0, notes: [196.0, 246.94, 293.66, 392.0] }    // G
      ];
      const bar = Math.floor(step / 16);
      const s = step % 16;
      const chord = chords[bar];
      const beat = Math.floor(s / 4);
      const off = s % 4;

      // kick every beat, snare on 2 & 4
      if (off === 0) this.kick(t);
      if ((beat === 1 || beat === 3) && off === 0) this.snare(t);
      if (off === 2) this.hat(t);

      // bass 8ths
      if (off === 0 || off === 2) {
        const seq = [0, 0, 7, 0, 0, 5, 7, 3];
        const semi = seq[(s >> 1) % 8];
        const f = chord.root * Math.pow(2, semi / 12);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const fl = ctx.createBiquadFilter();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, t);
        fl.type = 'lowpass'; fl.frequency.setValueAtTime(420, t);
        fl.frequency.exponentialRampToValueAtTime(180, t + 0.2);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.11, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.21);
        o.connect(fl); fl.connect(g); g.connect(this.musicGain);
        o.start(t); o.stop(t + 0.24);
      }

      // arp 16ths, sparse at some steps for groove
      if (s % 2 === 0) {
        const notes = chord.notes;
        const n = notes[(s + bar * 2) % notes.length] * 2;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(n, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.038, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(g);
        g.connect(this.musicGain);
        g.connect(this.delay);
        o.start(t); o.stop(t + 0.2);
      }

      // pad at bar start
      if (s === 0) {
        for (let i = 0; i < 3; i++) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const fl = ctx.createBiquadFilter();
          o.type = 'sawtooth';
          o.frequency.value = chord.notes[i] * 0.5;
          o.detune.value = (i - 1) * 7;
          fl.type = 'lowpass'; fl.frequency.value = 900;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.022, t + 0.5);
          g.gain.linearRampToValueAtTime(0.0001, t + sixteenth * 16 * 0.98);
          o.connect(fl); fl.connect(g); g.connect(this.musicGain);
          o.start(t); o.stop(t + sixteenth * 16);
        }
      }
    }

    kick(t) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(135, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g); g.connect(this.musicGain);
      o.start(t); o.stop(t + 0.25);
    }

    snare(t) {
      const ctx = this.ctx;
      const s = ctx.createBufferSource();
      s.buffer = this.noiseBuffer;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 1400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.075, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      s.connect(f); f.connect(g); g.connect(this.musicGain);
      s.start(t); s.stop(t + 0.16);
    }

    hat(t) {
      const ctx = this.ctx;
      const s = ctx.createBufferSource();
      s.buffer = this.noiseBuffer;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.028, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      s.connect(f); f.connect(g); g.connect(this.musicGain);
      s.start(t); s.stop(t + 0.06);
    }
  }

  window.GameAudio = GameAudio;
})();
