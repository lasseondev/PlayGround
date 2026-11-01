// Tiny procedural chiptune + sound-effect engine. No audio files required.
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

const EXPLORE = {
  step: 0.185,
  bass: [38, 0, 0, 0, 38, 0, 0, 0, 34, 0, 0, 0, 36, 0, 0, 0],
  arp: [62, 65, 69, 65, 62, 65, 70, 65, 58, 62, 65, 62, 60, 64, 67, 64],
  pad: [50, 0, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 48, 0, 0, 0],
};

const BOSS = {
  step: 0.135,
  bass: [26, 26, 27, 26, 26, 26, 29, 26, 26, 26, 27, 26, 31, 30, 29, 28],
  arp: [62, 63, 62, 58, 62, 63, 67, 63, 62, 63, 62, 58, 69, 67, 63, 61],
  pad: [38, 0, 0, 0, 39, 0, 0, 0, 38, 0, 0, 0, 37, 0, 0, 0],
};

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.musicMode = null;
    this.musicTimer = null;
    this.nextTime = 0;
    this.stepIndex = 0;
    this._victory = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);

      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 18;
      comp.ratio.value = 5;
      comp.attack.value = 0.004;
      comp.release.value = 0.22;
      comp.connect(this.master);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15;
      this.musicGain.connect(comp);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.72;
      this.sfxGain.connect(comp);

      const len = this.ctx.sampleRate * 0.7;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.55, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  startMusic(mode = 'explore') {
    if (!this.ensure()) return;
    this.musicMode = mode;
    this.stepIndex = 0;
    this.nextTime = this.ctx.currentTime + 0.08;
    if (this.musicTimer) return;
    this.musicTimer = setInterval(() => this.scheduleMusic(), 90);
  }

  setMusic(mode) {
    if (this.musicMode === mode) return;
    this.musicMode = mode;
    this.stepIndex = 0;
    if (this.ctx) this.nextTime = this.ctx.currentTime + 0.06;
  }

  scheduleMusic() {
    if (!this.ctx || !this.musicMode || this.muted) return;
    const pattern = this.musicMode === 'boss' ? BOSS : EXPLORE;
    while (this.nextTime < this.ctx.currentTime + 0.3) {
      this.playStep(pattern, this.stepIndex, this.nextTime);
      this.nextTime += pattern.step;
      this.stepIndex = (this.stepIndex + 1) % 16;
    }
  }

  playStep(pattern, i, t) {
    const b = pattern.bass[i];
    if (b) this.tone(midi(b), t, pattern.step * 1.7, 'triangle', 0.26, this.musicGain);
    const a = pattern.arp[i];
    if (a) this.tone(midi(a), t, pattern.step * 0.72, 'square', 0.045, this.musicGain);
    const p = pattern.pad[i];
    if (p) {
      this.tone(midi(p), t, pattern.step * 5.5, 'sawtooth', 0.035, this.musicGain, 0, 700);
      this.tone(midi(p + 7), t, pattern.step * 5.5, 'sine', 0.05, this.musicGain);
    }
    if (this.musicMode === 'boss' && i % 4 === 0) this.noise(t, 0.045, 0.06, 2400, this.musicGain);
  }

  tone(freq, time, dur, type = 'square', vol = 0.2, dest = null, slideTo = 0, cutoff = 0) {
    if (!this.ctx) return;
    const out = dest || this.sfxGain;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), time);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), time + dur);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(vol, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    let node = osc;
    if (cutoff) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(cutoff * 2.2, time);
      f.frequency.exponentialRampToValueAtTime(cutoff, time + dur);
      node.connect(f);
      node = f;
    }
    node.connect(gain);
    gain.connect(out);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  noise(time, dur, vol = 0.2, cutoff = 1200, dest = null, sweepTo = 0) {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(cutoff, time);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(80, sweepTo), time + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(vol, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(f);
    f.connect(gain);
    gain.connect(dest || this.sfxGain);
    src.start(time);
    src.stop(time + dur + 0.02);
  }

  sfx(name) {
    if (!this.ensure() || this.muted) return;
    const t = this.ctx.currentTime + 0.005;
    switch (name) {
      case 'swing':
        this.noise(t, 0.16, 0.28, 5200, null, 500);
        this.tone(520, t, 0.09, 'triangle', 0.06, null, 240);
        break;
      case 'hit':
        this.noise(t, 0.09, 0.24, 1800);
        this.tone(180, t, 0.11, 'square', 0.16, null, 62);
        break;
      case 'slashHit':
        this.noise(t, 0.12, 0.32, 3200);
        this.tone(240, t, 0.1, 'sawtooth', 0.13, null, 70);
        break;
      case 'clang':
        this.tone(1180, t, 0.13, 'triangle', 0.13, null, 900);
        this.tone(1760, t + 0.012, 0.09, 'sine', 0.08, null, 1500);
        this.noise(t, 0.05, 0.1, 5000);
        break;
      case 'hurt':
        this.tone(210, t, 0.24, 'sawtooth', 0.18, null, 64);
        this.noise(t, 0.15, 0.2, 900);
        break;
      case 'key':
        [84, 88, 91, 96].forEach((n, i) => this.tone(midi(n), t + i * 0.07, 0.18, 'triangle', 0.1));
        break;
      case 'chest':
        this.tone(midi(72), t, 0.16, 'triangle', 0.09);
        this.tone(midi(79), t + 0.11, 0.2, 'triangle', 0.09);
        this.tone(midi(84), t + 0.22, 0.35, 'sine', 0.08);
        break;
      case 'unlock':
        this.tone(90, t, 0.12, 'square', 0.16, null, 60);
        this.noise(t, 0.08, 0.2, 1100);
        this.tone(720, t + 0.1, 0.13, 'triangle', 0.07, null, 480);
        break;
      case 'door':
        this.noise(t, 0.38, 0.26, 420, null, 120);
        this.tone(58, t, 0.4, 'sawtooth', 0.12, null, 34);
        break;
      case 'bossDoor':
        this.noise(t, 0.8, 0.3, 520, null, 90);
        this.tone(48, t, 0.9, 'sawtooth', 0.18, null, 26);
        this.tone(72, t + 0.1, 0.8, 'square', 0.07, null, 40);
        break;
      case 'roar':
        this.tone(92, t, 1.1, 'sawtooth', 0.2, null, 34);
        this.tone(61, t + 0.05, 1.2, 'square', 0.11, null, 26);
        this.noise(t, 1.0, 0.18, 700, null, 90);
        break;
      case 'explosion':
        this.noise(t, 0.6, 0.38, 1400, null, 70);
        this.tone(70, t, 0.5, 'sawtooth', 0.2, null, 28);
        break;
      case 'pickup':
        this.tone(880, t, 0.1, 'sine', 0.1);
        this.tone(1320, t + 0.06, 0.14, 'sine', 0.08);
        break;
      case 'heart':
        this.tone(midi(76), t, 0.12, 'sine', 0.1);
        this.tone(midi(83), t + 0.1, 0.24, 'sine', 0.09);
        break;
      case 'step':
        this.noise(t, 0.035, 0.055, 520);
        break;
      case 'pause':
        this.tone(midi(67), t, 0.1, 'triangle', 0.08);
        this.tone(midi(72), t + 0.08, 0.12, 'triangle', 0.07);
        break;
      case 'death':
        [64, 60, 57, 52].forEach((n, i) => this.tone(midi(n), t + i * 0.16, 0.34, 'triangle', 0.12));
        this.noise(t + 0.55, 0.6, 0.2, 500);
        break;
      case 'victory':
        [60, 64, 67, 72, 67, 72, 76, 79].forEach((n, i) => this.tone(midi(n), t + i * 0.13, 0.42, 'triangle', 0.12));
        this.tone(midi(48), t, 1.3, 'sine', 0.12);
        this.tone(midi(55), t, 1.3, 'sine', 0.09);
        break;
      case 'secret':
        [72, 75, 79, 84, 87].forEach((n, i) => this.tone(midi(n), t + i * 0.06, 0.2, 'sine', 0.08));
        break;
    }
  }
}
