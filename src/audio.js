// Tiny WebAudio sound engine: chiptune-ish SFX plus a gentle looping melody.
// All sound is generated at runtime, so the game needs no external assets.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxBus = null;
    this.musicBus = null;
    this.muted = false;
    this.musicTimer = null;
    this.nextNoteTime = 0;
    this.step = 0;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.7;
    this.master.connect(this.ctx.destination);

    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.55;
    this.sfxBus.connect(this.master);

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0.17;
    this.musicBus.connect(this.master);

    this.noiseBuffer = this.makeNoise(0.5);
    this.startMusic();
  }

  makeNoise(seconds) {
    const rate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, rate * seconds, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  setMuted(muted) {
    this.muted = muted;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(muted ? 0 : 0.7, now, 0.04);
  }

  tone({ freq = 440, endFreq = freq, type = 'square', duration = 0.12, volume = 0.2, delay = 0, attack = 0.005, bus = null }) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(bus || this.sfxBus);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  noise({ duration = 0.15, volume = 0.18, delay = 0, filterFreq = 900, q = 1, bus = null }) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, filterFreq * 0.4), t + duration);
    filter.Q.value = q;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(bus || this.sfxBus);
    src.start(t);
    src.stop(t + duration + 0.02);
  }

  jump() {
    this.tone({ freq: 300, endFreq: 720, type: 'square', duration: 0.16, volume: 0.16 });
    this.tone({ freq: 600, endFreq: 1100, type: 'triangle', duration: 0.1, volume: 0.08, delay: 0.02 });
  }

  doubleJump() {
    this.tone({ freq: 520, endFreq: 1080, type: 'triangle', duration: 0.18, volume: 0.14 });
  }

  land() {
    this.noise({ duration: 0.09, volume: 0.1, filterFreq: 700, q: 0.8 });
  }

  coin() {
    this.tone({ freq: 1046.5, type: 'square', duration: 0.07, volume: 0.12 });
    this.tone({ freq: 1568, type: 'square', duration: 0.16, volume: 0.12, delay: 0.06 });
  }

  star() {
    const notes = [784, 988, 1175, 1568, 1976];
    notes.forEach((f, i) => this.tone({ freq: f, type: 'triangle', duration: 0.18, volume: 0.16, delay: i * 0.07 }));
  }

  stomp() {
    this.tone({ freq: 260, endFreq: 90, type: 'square', duration: 0.16, volume: 0.22 });
    this.noise({ duration: 0.12, volume: 0.16, filterFreq: 500 });
  }

  hurt() {
    this.tone({ freq: 420, endFreq: 120, type: 'sawtooth', duration: 0.4, volume: 0.2 });
    this.tone({ freq: 300, endFreq: 90, type: 'square', duration: 0.5, volume: 0.12, delay: 0.05 });
  }

  spring() {
    this.tone({ freq: 220, endFreq: 1250, type: 'sine', duration: 0.3, volume: 0.2 });
    this.tone({ freq: 440, endFreq: 1800, type: 'triangle', duration: 0.28, volume: 0.1, delay: 0.03 });
  }

  checkpoint() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) => this.tone({ freq: f, type: 'triangle', duration: 0.28, volume: 0.14, delay: i * 0.09 }));
  }

  bump() {
    this.tone({ freq: 180, endFreq: 140, type: 'square', duration: 0.08, volume: 0.15 });
  }

  bossHit() {
    this.tone({ freq: 140, endFreq: 70, type: 'sawtooth', duration: 0.28, volume: 0.18 });
    this.noise({ duration: 0.2, volume: 0.16, filterFreq: 400 });
  }

  win() {
    const melody = [523, 659, 784, 1046, 1318, 1046, 1318, 1568];
    melody.forEach((f, i) => this.tone({ freq: f, type: 'triangle', duration: 0.32, volume: 0.16, delay: i * 0.13 }));
    melody.forEach((f, i) => this.tone({ freq: f / 2, type: 'square', duration: 0.26, volume: 0.06, delay: i * 0.13 }));
  }

  gameOver() {
    const melody = [392, 330, 262, 196];
    melody.forEach((f, i) => this.tone({ freq: f, type: 'triangle', duration: 0.4, volume: 0.16, delay: i * 0.18 }));
  }

  click() {
    this.tone({ freq: 660, endFreq: 880, type: 'triangle', duration: 0.06, volume: 0.12 });
  }

  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    this.nextNoteTime = this.ctx.currentTime + 0.2;
    this.step = 0;
    this.musicTimer = setInterval(() => this.scheduleMusic(), 40);
  }

  scheduleMusic() {
    if (!this.ctx) return;
    const stepDuration = 0.155;
    while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
      this.playStep(this.step, this.nextNoteTime);
      this.step = (this.step + 1) % 64;
      this.nextNoteTime += stepDuration;
    }
  }

  playStep(step, time) {
    if (this.muted) return;
    const bar = Math.floor(step / 16) % 4;
    const beat = step % 16;
    // Lead melody (two 4-bar phrases)
    const lead = [
      659, 0, 784, 0, 880, 784, 659, 0, 587, 0, 659, 0, 523, 0, 0, 0,
      659, 0, 784, 0, 988, 880, 784, 0, 698, 0, 784, 0, 659, 0, 0, 0,
      880, 0, 988, 0, 1046, 988, 880, 0, 784, 0, 880, 0, 698, 0, 0, 0,
      659, 784, 880, 0, 1046, 0, 988, 880, 784, 0, 659, 0, 523, 0, 0, 0,
    ];
    const note = lead[step];
    if (note) this.noteAt(note, time, 'triangle', 0.05, 0.16);
    if (note && step % 4 === 0) this.noteAt(note / 2, time, 'square', 0.024, 0.11);

    // Bass roots per bar: C, A minor, F, G
    const roots = [130.81, 110, 87.31, 98];
    if (beat === 0 || beat === 8) this.noteAt(roots[bar], time, 'triangle', 0.09, 0.2);
    if (beat === 4 || beat === 12) this.noteAt(roots[bar] * 1.5, time, 'triangle', 0.055, 0.16);

    // Soft percussion
    if (beat % 2 === 0) this.hatAt(time, beat % 4 === 0 ? 0.035 : 0.02);
    if (beat === 0 || beat === 8) this.kickAt(time);
  }

  noteAt(freq, time, type, volume, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(this.musicBus);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  hatAt(time, volume) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);
    src.connect(filter); filter.connect(gain); gain.connect(this.musicBus);
    src.start(time); src.stop(time + 0.05);
  }

  kickAt(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    osc.connect(gain); gain.connect(this.musicBus);
    osc.start(time); osc.stop(time + 0.14);
  }
}
