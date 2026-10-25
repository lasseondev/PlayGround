export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.ambientNodes = [];
    this.enabled = true;
  }

  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 22;
      comp.ratio.value = 7;
      comp.attack.value = 0.003;
      comp.release.value = 0.22;

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.62;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);

      this.noiseBuffer = this.makeNoise(2.5);
      this.startAmbient();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  makeNoise(seconds) {
    const len = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i += 1) {
      const white = Math.random() * 2 - 1;
      last = 0.96 * last + 0.04 * white;
      data[i] = white * 0.7 + last * 0.6;
    }
    return buffer;
  }

  startAmbient() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bus = this.ctx.createGain();
    bus.gain.setValueAtTime(0, now);
    bus.gain.linearRampToValueAtTime(0.16, now + 3.5);
    bus.connect(this.master);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 220;
    droneFilter.Q.value = 2;
    droneFilter.connect(bus);

    const freqs = [41.2, 55, 82.4, 110.3];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 6;
      const g = this.ctx.createGain();
      g.gain.value = 0.16 / (i * 0.55 + 1);
      osc.connect(g);
      g.connect(droneFilter);
      osc.start();

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.045 + i * 0.018;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.06;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();

      this.ambientNodes.push(osc, lfo);
    });

    const wind = this.ctx.createBufferSource();
    wind.buffer = this.noiseBuffer;
    wind.loop = true;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 280;
    windFilter.Q.value = 0.7;
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.045;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.master);
    wind.start();

    const windLfo = this.ctx.createOscillator();
    windLfo.frequency.value = 0.07;
    const windLfoGain = this.ctx.createGain();
    windLfoGain.gain.value = 0.025;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windGain.gain);
    windLfo.start();

    this.ambientNodes.push(wind, windLfo);
  }

  noise(duration, { type = "bandpass", freq = 1000, endFreq = null, q = 1, gain = 0.4, attack = 0.002 } = {}) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, now);
    if (endFreq) filter.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + duration);
    filter.Q.value = q;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gain, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(now, Math.random() * 1.5, duration + 0.05);
    src.stop(now + duration + 0.06);
  }

  tone(duration, { type = "sine", from = 440, to = null, gain = 0.2, attack = 0.004 } = {}) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gain, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  rocket() {
    this.noise(0.42, { type: "lowpass", freq: 2600, endFreq: 190, q: 1.6, gain: 0.55 });
    this.tone(0.32, { type: "sine", from: 130, to: 38, gain: 0.5 });
    this.tone(0.16, { type: "sawtooth", from: 300, to: 90, gain: 0.12 });
  }

  shotgun() {
    this.noise(0.32, { type: "lowpass", freq: 4200, endFreq: 260, q: 1.2, gain: 0.7 });
    this.tone(0.2, { type: "square", from: 170, to: 45, gain: 0.28 });
  }

  rail() {
    this.tone(0.24, { type: "sawtooth", from: 1800, to: 240, gain: 0.18, attack: 0.002 });
    this.noise(0.3, { type: "highpass", freq: 1400, endFreq: 4600, q: 2, gain: 0.28 });
    this.tone(0.5, { type: "sine", from: 90, to: 55, gain: 0.24 });
  }

  explosion(scale = 1) {
    this.noise(0.9 * scale, { type: "lowpass", freq: 900, endFreq: 60, q: 1.4, gain: 0.75 });
    this.tone(0.7 * scale, { type: "sine", from: 90, to: 28, gain: 0.6 });
    this.noise(0.2, { type: "bandpass", freq: 2600, endFreq: 600, q: 0.8, gain: 0.3 });
  }

  enemyShoot(kind = "grunt") {
    if (kind === "wraith") {
      this.tone(0.18, { type: "sawtooth", from: 900, to: 1600, gain: 0.1 });
    } else if (kind === "brute") {
      this.tone(0.24, { type: "square", from: 220, to: 90, gain: 0.13 });
    } else {
      this.tone(0.16, { type: "square", from: 520, to: 190, gain: 0.1 });
    }
    this.noise(0.12, { type: "bandpass", freq: 1200, endFreq: 500, q: 1.5, gain: 0.09 });
  }

  enemyHit() {
    this.noise(0.09, { type: "bandpass", freq: 2200, endFreq: 900, q: 2, gain: 0.16 });
    this.tone(0.07, { type: "square", from: 320, to: 170, gain: 0.06 });
  }

  enemyDeath() {
    this.tone(0.6, { type: "sawtooth", from: 190, to: 38, gain: 0.16 });
    this.noise(0.45, { type: "lowpass", freq: 700, endFreq: 100, q: 1, gain: 0.25 });
  }

  hitmarker(head = false) {
    this.tone(0.06, { type: "square", from: head ? 1900 : 1250, to: head ? 1200 : 1000, gain: 0.09 });
  }

  playerHurt() {
    this.tone(0.22, { type: "sawtooth", from: 180, to: 60, gain: 0.2 });
    this.noise(0.16, { type: "lowpass", freq: 900, endFreq: 120, q: 1, gain: 0.22 });
  }

  playerDeath() {
    this.tone(1.4, { type: "sawtooth", from: 140, to: 24, gain: 0.3 });
    this.noise(1.2, { type: "lowpass", freq: 500, endFreq: 40, q: 1, gain: 0.35 });
  }

  pickup(kind = "health") {
    const base = kind === "health" ? 620 : kind === "armor" ? 500 : 380;
    this.tone(0.09, { type: "sine", from: base, to: base * 1.5, gain: 0.16 });
    setTimeout(() => this.tone(0.12, { type: "sine", from: base * 1.5, to: base * 2, gain: 0.13 }), 55);
  }

  jump() {
    this.noise(0.1, { type: "highpass", freq: 700, endFreq: 1600, q: 0.6, gain: 0.06 });
  }

  land() {
    this.noise(0.13, { type: "lowpass", freq: 500, endFreq: 120, q: 1, gain: 0.14 });
  }

  footstep() {
    this.noise(0.07, { type: "lowpass", freq: 420, endFreq: 180, q: 2, gain: 0.07 });
  }

  dash() {
    this.noise(0.22, { type: "bandpass", freq: 400, endFreq: 1600, q: 1.4, gain: 0.12 });
  }

  wave() {
    this.tone(0.3, { type: "sine", from: 60, to: 42, gain: 0.3 });
    this.tone(0.5, { type: "sawtooth", from: 110, to: 146, gain: 0.08 });
    setTimeout(() => this.tone(0.6, { type: "sawtooth", from: 146, to: 110, gain: 0.07 }), 220);
  }

  ui() {
    this.tone(0.06, { type: "square", from: 800, to: 1200, gain: 0.05 });
  }

  deny() {
    this.tone(0.14, { type: "square", from: 180, to: 120, gain: 0.1 });
  }

  empty() {
    this.tone(0.05, { type: "square", from: 260, to: 200, gain: 0.06 });
  }
}
