// Small shared utilities: math, randomness, input, procedural audio.
export const TAU = Math.PI * 2;
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
export const rnd = (a = 1, b = 0) => b + Math.random() * (a - b);
export const chance = (p) => Math.random() < p;
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const dist2 = (ax, ay, bx, by) => {
  const dx = ax - bx, dy = ay - by;
  return dx * dx + dy * dy;
};
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
export const angleTo = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);
export const norm = (x, y) => {
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
};
export const angleDiff = (a, b) => {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
};
export const approachAngle = (a, b, step) => {
  const d = angleDiff(b, a);
  return Math.abs(d) < step ? b : a + Math.sign(d) * step;
};
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const roman = (n) => ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n);
export const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

export class Input {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();
    this.mouse = { x: -1, y: -1, down: false, active: false, lastMove: -1e9, inside: false };
    this.usingTouch = false;
    this.onKey = null;
    this._bind();
  }
  _bind() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      this.pressed.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
      if (this.onKey) this.onKey(e);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouse.down = false;
    });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
        this.mouse.inside = true;
        this.mouse.lastMove = performance.now();
      }
    });
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        this.mouse.down = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
        this.mouse.lastMove = performance.now();
      }
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) this.mouse.down = false;
    });
    window.addEventListener('pointercancel', () => { this.mouse.down = false; });
    document.addEventListener('mouseleave', () => { this.mouse.inside = false; this.mouse.down = false; });
    window.addEventListener('touchstart', () => { this.usingTouch = true; }, { passive: true });
  }
  key(...codes) { return codes.some((c) => this.keys.has(c) || this.pressed.has(c)); }
  hit(code) { return this.pressed.has(code); }
  endFrame() { this.pressed.clear(); }
  moveVector() {
    let x = 0, y = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y += 1;
    return norm(x, y);
  }
}

const sfxMap = {
  slash: { noise: [0.13, 0.13, 'highpass', 1800, 0.7], tone: [520, 180, 0.1, 'triangle', 0.05] },
  hit: { noise: [0.07, 0.16, 'bandpass', 900, 0.6], tone: [180, 70, 0.12, 'square', 0.06] },
  heavy: { noise: [0.18, 0.24, 'lowpass', 600, 0.4], tone: [110, 40, 0.24, 'sawtooth', 0.1] },
  hurt: { tone: [220, 70, 0.3, 'sawtooth', 0.12], noise: [0.12, 0.12, 'lowpass', 800, 0.4] },
  dash: { noise: [0.22, 0.1, 'bandpass', 500, 1.2, 1800] },
  pickup: { tone: [880, 1320, 0.13, 'sine', 0.07], tone2: [1320, 1760, 0.1, 'sine', 0.04] },
  boon: { tone: [392, 392, 0.4, 'sine', 0.06], tone2: [587, 587, 0.5, 'sine', 0.05], tone3: [784, 784, 0.7, 'sine', 0.04] },
  gate: { noise: [0.5, 0.1, 'bandpass', 300, 0.9, 1200], tone: [110, 82, 0.5, 'sine', 0.06] },
  death: { tone: [140, 40, 1.1, 'sawtooth', 0.1], noise: [1.0, 0.12, 'lowpass', 500, 0.3] },
  boss: { tone: [80, 42, 1.2, 'sawtooth', 0.16], tone2: [54, 38, 1.5, 'square', 0.1] },
  victory: { tone: [523, 523, 0.3, 'sine', 0.07], tone2: [659, 659, 0.3, 'sine', 0.06], tone3: [784, 784, 0.6, 'sine', 0.06] },
  thunder: { noise: [0.4, 0.22, 'highpass', 500, 0.5], tone: [90, 35, 0.5, 'sawtooth', 0.08] },
  shield: { tone: [660, 990, 0.25, 'triangle', 0.05] },
  heal: { tone: [440, 660, 0.35, 'sine', 0.05], tone2: [660, 880, 0.35, 'sine', 0.04] },
  rage: { tone: [90, 220, 0.7, 'sawtooth', 0.1], noise: [0.6, 0.18, 'lowpass', 700, 0.5] },
};

export class AudioKit {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    try { this.enabled = localStorage.getItem('shadow-hades-muted') !== '1'; } catch {}
    this.ambient = null;
  }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? 0.55 : 0;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 4;
      this.master.connect(comp).connect(this.ctx.destination);
      this._ambient();
    } catch { this.ctx = null; }
  }
  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem('shadow-hades-muted', this.enabled ? '0' : '1'); } catch {}
    if (this.master) this.master.gain.setTargetAtTime(this.enabled ? 0.55 : 0, this.ctx.currentTime, 0.08);
    return this.enabled;
  }
  _noiseBuffer() {
    if (this._nb) return this._nb;
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this._nb = buf;
    return buf;
  }
  _tone(freq, endFreq, dur, type, gain, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.master);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }
  _noise(dur, gain, type, freq, q, sweep = 0, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer();
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t0);
    if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(60, sweep), t0 + dur);
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }
  sfx(name) {
    if (!this.ctx || !this.enabled) return;
    const m = sfxMap[name];
    if (!m) return;
    if (m.noise) this._noise(...m.noise);
    if (m.tone) this._tone(...m.tone);
    if (m.tone2) this._tone(...m.tone2, 0.02);
    if (m.tone3) this._tone(...m.tone3, 0.04);
  }
  _ambient() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.value = 0.055;
    g.connect(this.master);
    const freqs = [55, 82.41, 110.02];
    const oscs = freqs.map((f, i) => {
      const o = this.ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1) * 4;
      const og = this.ctx.createGain();
      og.gain.value = i === 2 ? 0.18 : 0.5;
      o.connect(og).connect(g);
      o.start(t0);
      return o;
    });
    // slow breathing LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.055;
    const lg = this.ctx.createGain();
    lg.gain.value = 0.022;
    lfo.connect(lg).connect(g.gain);
    lfo.start(t0);
    // distant wind
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer();
    src.loop = true;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 240;
    bp.Q.value = 0.6;
    const ng = this.ctx.createGain();
    ng.gain.value = 0.035;
    src.connect(bp).connect(ng).connect(this.master);
    src.start(t0);
    this.ambient = { g, oscs, lfo, src };
  }
}
