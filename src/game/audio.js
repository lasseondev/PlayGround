const STORAGE_KEY = "angry-birds-muted";

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.lastPlayed = new Map();
    try {
      this.muted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      this.muted = false;
    }
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.52;
    this.master.connect(this.ctx.destination);

    const length = Math.floor(this.ctx.sampleRate * 1.2);
    this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.32 + white * 0.68;
      data[i] = last;
    }
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {}
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(muted ? 0 : 0.52, now, 0.02);
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  canPlay(key, gap = 0.045) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    const last = this.lastPlayed.get(key) || 0;
    if (now - last < gap) return false;
    this.lastPlayed.set(key, now);
    return true;
  }

  tone({ freq = 440, endFreq = freq, type = "sine", duration = 0.2, gain = 0.12, attack = 0.006, delay = 0 }) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + duration);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  }

  noise({ duration = 0.2, gain = 0.12, filter = "lowpass", freq = 900, q = 0.8, delay = 0, sweepTo = null }) {
    if (!this.ctx || this.muted || !this.noiseBuffer) return;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filterNode = this.ctx.createBiquadFilter();
    filterNode.type = filter;
    filterNode.frequency.setValueAtTime(freq, t0);
    filterNode.Q.value = q;
    if (sweepTo) filterNode.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t0 + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(filterNode);
    filterNode.connect(g);
    g.connect(this.master);
    src.start(t0);
    src.stop(t0 + duration + 0.03);
  }

  click() {
    if (!this.canPlay("click", 0.035)) return;
    this.tone({ freq: 620, endFreq: 420, type: "triangle", duration: 0.07, gain: 0.075 });
  }

  launch() {
    if (!this.canPlay("launch", 0.05)) return;
    this.tone({ freq: 240, endFreq: 780, type: "triangle", duration: 0.16, gain: 0.12 });
    this.noise({ duration: 0.09, gain: 0.05, filter: "bandpass", freq: 1500, q: 1.2 });
  }

  stretch() {
    if (!this.canPlay("stretch", 0.12)) return;
    this.tone({ freq: 120, endFreq: 90, type: "sine", duration: 0.06, gain: 0.03 });
  }

  impact(material = "wood", strength = 1) {
    if (!this.canPlay(`impact-${material}`, 0.05)) return;
    const s = Math.min(1.6, Math.max(0.2, strength));
    if (material === "ice") {
      this.noise({ duration: 0.13, gain: 0.075 * s, filter: "highpass", freq: 2100, q: 0.7 });
      this.tone({ freq: 1500 + Math.random() * 500, endFreq: 900, type: "triangle", duration: 0.09, gain: 0.035 * s });
    } else if (material === "stone") {
      this.noise({ duration: 0.18, gain: 0.11 * s, filter: "lowpass", freq: 420, q: 0.7 });
      this.tone({ freq: 92, endFreq: 58, type: "sine", duration: 0.16, gain: 0.11 * s });
    } else if (material === "pig") {
      this.oink();
    } else if (material === "tnt") {
      this.explosion();
    } else {
      this.noise({ duration: 0.12, gain: 0.08 * s, filter: "bandpass", freq: 520, q: 0.9 });
      this.tone({ freq: 150, endFreq: 84, type: "triangle", duration: 0.11, gain: 0.07 * s });
    }
  }

  break(material = "wood") {
    if (!this.canPlay(`break-${material}`, 0.06)) return;
    if (material === "ice") {
      this.noise({ duration: 0.24, gain: 0.11, filter: "highpass", freq: 2600, q: 0.6 });
      this.tone({ freq: 2200, endFreq: 900, type: "sawtooth", duration: 0.13, gain: 0.035 });
    } else if (material === "stone") {
      this.noise({ duration: 0.3, gain: 0.15, filter: "lowpass", freq: 620, q: 0.7 });
      this.tone({ freq: 118, endFreq: 42, type: "sine", duration: 0.24, gain: 0.13 });
    } else {
      this.noise({ duration: 0.22, gain: 0.12, filter: "bandpass", freq: 680, q: 0.8, sweepTo: 220 });
      this.tone({ freq: 220, endFreq: 68, type: "triangle", duration: 0.15, gain: 0.07 });
    }
  }

  oink() {
    if (!this.canPlay("oink", 0.12)) return;
    this.tone({ freq: 330, endFreq: 210, type: "sawtooth", duration: 0.11, gain: 0.065 });
    this.tone({ freq: 290, endFreq: 180, type: "sawtooth", duration: 0.09, gain: 0.05, delay: 0.1 });
  }

  pop() {
    if (!this.canPlay("pop", 0.06)) return;
    this.tone({ freq: 700, endFreq: 1600, type: "triangle", duration: 0.1, gain: 0.06 });
    this.noise({ duration: 0.07, gain: 0.05, filter: "highpass", freq: 1200 });
  }

  explosion() {
    if (!this.canPlay("explosion", 0.15)) return;
    this.noise({ duration: 0.65, gain: 0.26, filter: "lowpass", freq: 1400, q: 0.6, sweepTo: 180 });
    this.tone({ freq: 90, endFreq: 32, type: "sine", duration: 0.55, gain: 0.24 });
    this.tone({ freq: 240, endFreq: 60, type: "sawtooth", duration: 0.3, gain: 0.08 });
  }

  dash() {
    if (!this.canPlay("dash", 0.1)) return;
    this.tone({ freq: 380, endFreq: 1350, type: "sawtooth", duration: 0.2, gain: 0.075 });
    this.noise({ duration: 0.16, gain: 0.06, filter: "bandpass", freq: 900, q: 1, sweepTo: 2400 });
  }

  split() {
    if (!this.canPlay("split", 0.1)) return;
    [0, 0.04, 0.08].forEach((delay, i) => {
      this.tone({ freq: 500 + i * 140, endFreq: 1100 + i * 140, type: "triangle", duration: 0.12, gain: 0.05, delay });
    });
  }

  win() {
    if (!this.ctx || this.muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.tone({ freq, endFreq: freq, type: "triangle", duration: 0.34, gain: 0.11, delay: i * 0.12 });
      this.tone({ freq: freq / 2, endFreq: freq / 2, type: "sine", duration: 0.34, gain: 0.05, delay: i * 0.12 });
    });
  }

  lose() {
    if (!this.ctx || this.muted) return;
    [392, 329.63, 261.63, 196].forEach((freq, i) => {
      this.tone({ freq, endFreq: freq * 0.94, type: "triangle", duration: 0.34, gain: 0.1, delay: i * 0.15 });
    });
  }

  star(index = 0) {
    if (!this.ctx || this.muted) return;
    const freq = [880, 1108.7, 1318.5][index] || 880;
    this.tone({ freq, endFreq: freq, type: "triangle", duration: 0.28, gain: 0.075 });
    this.tone({ freq: freq * 2, endFreq: freq * 2, type: "sine", duration: 0.2, gain: 0.03 });
  }

  whoosh() {
    if (!this.canPlay("whoosh", 0.2)) return;
    this.noise({ duration: 0.34, gain: 0.07, filter: "bandpass", freq: 380, q: 1, sweepTo: 1800 });
  }

  tick() {
    if (!this.canPlay("tick", 0.05)) return;
    this.tone({ freq: 1100, endFreq: 900, type: "square", duration: 0.035, gain: 0.025 });
  }
}
