/* Turbo Trophy — Sunset Circuit
   A self-contained pseudo-3D kart racer with drift boosts, item boxes,
   shells, bananas, stars and five very competitive opponents. */

(() => {
  'use strict';

  // ---------------------------------------------------------------- helpers
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
  const wrapAngle = (a) => {
    while (a > Math.PI) a -= TAU;
    while (a < -Math.PI) a += TAU;
    return a;
  };
  const fmtTime = (t) => {
    if (!isFinite(t)) return '--:--.-';
    const m = Math.floor(t / 60);
    const s = t - m * 60;
    return `${m}:${s < 10 ? '0' : ''}${s.toFixed(1)}`;
  };
  const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const near = (a, b, range, len) => {
    let d = ((a - b) % len + len) % len;
    if (d > len / 2) d -= len;
    return Math.abs(d) <= range;
  };

  // ---------------------------------------------------------------- canvas
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  const minimap = document.getElementById('minimap');
  const mctx = minimap.getContext('2d');
  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(320, canvas.clientWidth || window.innerWidth);
    H = Math.max(240, canvas.clientHeight || window.innerHeight);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------------------------------------------------------------- DOM
  const hud = document.getElementById('hud');
  const overlay = document.getElementById('overlay');
  const titlePanel = document.getElementById('titlePanel');
  const resultsPanel = document.getElementById('resultsPanel');
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againBtn');
  const menuBtn = document.getElementById('menuBtn');
  const muteBtn = document.getElementById('muteBtn');
  const touchWrap = document.getElementById('touch');
  const countdownEl = document.getElementById('countdown');
  const toastEl = document.getElementById('toast');
  const lapNum = document.getElementById('lapNum');
  const posNum = document.getElementById('posNum');
  const posSuf = document.getElementById('posSuf');
  const raceTimeEl = document.getElementById('raceTime');
  const speedNum = document.getElementById('speedNum');
  const speedFill = document.getElementById('speedFill');
  const driftFill = document.getElementById('driftFill');
  const itemSlot = document.getElementById('itemSlot');
  const itemIcon = document.getElementById('itemIcon');
  const itemLabel = document.getElementById('itemLabel');
  const resultPlace = document.getElementById('resultPlace');
  const resultTitle = document.getElementById('resultTitle');
  const resultSub = document.getElementById('resultSub');
  const resultsKicker = document.getElementById('resultsKicker');
  const standingsEl = document.getElementById('standings');

  // ---------------------------------------------------------------- audio
  let AC = null, master = null, engineGain = null, engineFilter = null;
  let engA = null, engB = null;
  let muted = false;

  function initAudio() {
    if (AC) {
      if (AC.state === 'suspended') AC.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    AC = new AudioCtx();
    master = AC.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(AC.destination);

    engineFilter = AC.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 520;
    engineFilter.Q.value = 3;

    engineGain = AC.createGain();
    engineGain.gain.value = 0;
    engineFilter.connect(engineGain);
    engineGain.connect(master);

    engA = AC.createOscillator();
    engA.type = 'sawtooth';
    engA.frequency.value = 62;
    engB = AC.createOscillator();
    engB.type = 'square';
    engB.frequency.value = 31;
    engA.connect(engineFilter);
    engB.connect(engineFilter);
    engA.start();
    engB.start();
  }

  function updateEngine(speed, gas, boost) {
    if (!AC || !engA) return;
    const t = AC.currentTime;
    const f = 55 + speed * 1.45 + (boost > 0 ? 70 : 0);
    engA.frequency.setTargetAtTime(f, t, 0.07);
    engB.frequency.setTargetAtTime(f * 0.502, t, 0.07);
    engineFilter.frequency.setTargetAtTime(380 + speed * 8 + (gas ? 260 : 0), t, 0.1);
    const target = muted ? 0 : (game.state === 'race' ? 0.026 + (gas ? 0.014 : 0) : 0);
    engineGain.gain.setTargetAtTime(target, t, 0.14);
  }

  function tone(freq, dur, type = 'sine', vol = 0.15, slide = 0, delay = 0) {
    if (!AC || muted) return;
    const t0 = AC.currentTime + delay;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, freq), t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(25, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.06);
  }

  const sfx = {
    pickup() {
      tone(760, 0.07, 'square', 0.1);
      tone(1140, 0.09, 'square', 0.09, 0, 0.06);
      tone(1520, 0.14, 'triangle', 0.08, 0, 0.12);
    },
    boost() {
      tone(150, 0.42, 'sawtooth', 0.1, 520);
      tone(320, 0.3, 'triangle', 0.05, 900, 0.02);
    },
    throwIt() {
      tone(520, 0.09, 'triangle', 0.09, 260);
    },
    hit() {
      tone(240, 0.34, 'square', 0.13, -170);
      tone(90, 0.4, 'sawtooth', 0.08, -40, 0.02);
    },
    lap() {
      tone(620, 0.12, 'triangle', 0.09);
      tone(830, 0.16, 'triangle', 0.09, 0, 0.1);
    },
    beep(high) {
      tone(high ? 880 : 440, high ? 0.4 : 0.16, 'square', 0.1);
    },
    finish() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, 'triangle', 0.11, 0, i * 0.13));
    }
  };

  function updateMute() {
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.classList.toggle('off', muted);
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.5, AC.currentTime, 0.05);
  }

  // ---------------------------------------------------------------- track
  // Hand-tuned circuit: long opening straight, a technical infield,
  // a climbing hairpin and a wide final sweeper.
  const CTRL = [
    [0, 0], [0, -150], [35, -250], [110, -310], [190, -320], [255, -275],
    [275, -195], [245, -120], [255, -45], [315, -10], [380, -40], [410, -115],
    [445, -185], [505, -205], [550, -150], [545, -65], [500, -5], [445, 40],
    [430, 115], [470, 180], [450, 260], [385, 300], [310, 285], [260, 235],
    [210, 225], [170, 270], [110, 300], [50, 275], [15, 215], [-10, 145], [-35, 75]
  ];

  function catmull(p0, p1, p2, p3, t) {
    const t2 = t * t, t3 = t2 * t;
    const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
    const z = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
    return { x, z };
  }

  const dense = [];
  for (let i = 0; i < CTRL.length; i++) {
    const p0 = CTRL[(i - 1 + CTRL.length) % CTRL.length];
    const p1 = CTRL[i];
    const p2 = CTRL[(i + 1) % CTRL.length];
    const p3 = CTRL[(i + 2) % CTRL.length];
    for (let j = 0; j < 32; j++) dense.push(catmull(p0, p1, p2, p3, j / 32));
  }
  dense.push({ x: dense[0].x, z: dense[0].z });

  const cum = [0];
  for (let i = 1; i < dense.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].z - dense[i - 1].z));
  }
  const totalLen = cum[cum.length - 1];
  const N = Math.round(totalLen / 3.6);
  const ds = totalLen / N;
  const L = ds * N;
  const samples = [];
  let segPtr = 0;
  for (let k = 0; k < N; k++) {
    const target = k * ds;
    while (segPtr < cum.length - 2 && cum[segPtr + 1] < target) segPtr++;
    const segLen = Math.max(1e-5, cum[segPtr + 1] - cum[segPtr]);
    const t = clamp((target - cum[segPtr]) / segLen, 0, 1);
    const a = dense[segPtr], b = dense[segPtr + 1] || dense[0];
    samples.push({ x: lerp(a.x, b.x, t), z: lerp(a.z, b.z, t), y: 0, half: 15, ang: 0, curv: 0 });
  }

  for (let k = 0; k < N; k++) {
    const u = k / N;
    samples[k].y = 7.5 * Math.sin(u * TAU * 2 + 0.5) + 3.2 * Math.sin(u * TAU * 3 + 2.2) +
      1.6 * Math.sin(u * TAU * 5 + 4.0);
    samples[k].half = 15.4 + 2.4 * Math.sin(u * TAU * 3 + 0.9) + 1.1 * Math.sin(u * TAU * 5 + 2.1);
  }
  for (let k = 0; k < N; k++) {
    const a = samples[(k + 1) % N], b = samples[(k - 1 + N) % N];
    samples[k].ang = Math.atan2(a.x - b.x, a.z - b.z);
  }
  const rawCurv = [];
  for (let k = 0; k < N; k++) {
    rawCurv.push(wrapAngle(samples[(k + 1) % N].ang - samples[(k - 1 + N) % N].ang) / (2 * ds));
  }
  for (let k = 0; k < N; k++) {
    samples[k].curv = (rawCurv[(k - 1 + N) % N] + rawCurv[k] * 2 + rawCurv[(k + 1) % N]) / 4;
  }

  function sampleInfo(s) {
    s = ((s % L) + L) % L;
    const f = s / ds;
    const i = Math.floor(f) % N;
    const j = (i + 1) % N;
    const t = f - Math.floor(f);
    const a = samples[i], b = samples[j];
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      z: lerp(a.z, b.z, t),
      ang: a.ang + wrapAngle(b.ang - a.ang) * t,
      half: lerp(a.half, b.half, t),
      curv: lerp(a.curv, b.curv, t)
    };
  }

  function trackPos(s, lat) {
    const info = sampleInfo(s);
    const nx = Math.cos(info.ang), nz = -Math.sin(info.ang);
    return { x: info.x + nx * lat, y: info.y, z: info.z + nz * lat, info };
  }

  // Scenery
  const trees = [];
  for (let i = 0; i < 44; i++) {
    const s = (i / 44) * L + rand(-14, 14);
    const info = sampleInfo(s);
    const side = i % 2 === 0 ? 1 : -1;
    const lat = side * (info.half + rand(8, 20));
    const wp = trackPos(s, lat);
    trees.push({ x: wp.x, y: wp.y, z: wp.z, scale: rand(1.05, 1.9), seed: rand(0, 10) });
  }

  const bushes = [];
  for (let i = 0; i < 38; i++) {
    const s = (i / 38) * L + rand(-18, 18);
    const info = sampleInfo(s);
    const side = i % 2 === 0 ? -1 : 1;
    const lat = side * (info.half + rand(3.2, 7.5));
    const wp = trackPos(s, lat);
    bushes.push({ x: wp.x, y: wp.y, z: wp.z, scale: rand(0.7, 1.5), seed: rand(0, 10) });
  }

  // Mini-map bounds
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const s of samples) {
    minX = Math.min(minX, s.x); maxX = Math.max(maxX, s.x);
    minZ = Math.min(minZ, s.z); maxZ = Math.max(maxZ, s.z);
  }
  const miniPad = 16;
  const miniScale = Math.min((180 - miniPad * 2) / (maxX - minX), (180 - miniPad * 2) / (maxZ - minZ));
  const miniOffX = (180 - (maxX - minX) * miniScale) / 2 - minX * miniScale;
  const miniOffZ = (180 - (maxZ - minZ) * miniScale) / 2 - minZ * miniScale;
  const miniPos = (p) => ({ x: p.x * miniScale + miniOffX, y: p.z * miniScale + miniOffZ });
  const miniPath = samples.filter((_, i) => i % 3 === 0).map(miniPos);

  // ---------------------------------------------------------------- items
  const ITEMS = {
    mushroom: {
      label: 'MUSHROOM',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="46" rx="13" ry="12" fill="#ffeacb"/><path d="M9 33C9 19.7 19.3 10 32 10s23 9.7 23 23c0 3.8-2.8 6-6.6 6H15.6C11.8 39 9 36.8 9 33z" fill="#f0413f"/><ellipse cx="32" cy="45" rx="12" ry="10" fill="#ffeacb"/><circle cx="22" cy="23" r="5.6" fill="#fff7e8"/><circle cx="43" cy="21" r="4.4" fill="#fff7e8"/><circle cx="32" cy="32" r="4.2" fill="#fff7e8"/><circle cx="16" cy="35" r="3.6" fill="#fff7e8"/><circle cx="48" cy="34" r="3.6" fill="#fff7e8"/><ellipse cx="27.5" cy="43" rx="2.1" ry="3.2" fill="#463025"/><ellipse cx="36.5" cy="43" rx="2.1" ry="3.2" fill="#463025"/></svg>'
    },
    shell: {
      label: 'RED SHELL',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 42c0-15.5 10.3-27 23-27s23 11.5 23 27c0 3.4-2.6 5.6-6 5.6H15c-3.4 0-6-2.2-6-5.6z" fill="#e8384f"/><path d="M11.5 41.5h41" stroke="#fff6e8" stroke-width="7" stroke-linecap="round"/><path d="M21 19l7 11M43 19l-7 11" stroke="#ffb3bc" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="27" r="6" fill="#fff6e8"/><circle cx="32" cy="27" r="3" fill="#e8384f"/><ellipse cx="20" cy="33" rx="4" ry="2.2" fill="#ff8b98" opacity=".75"/></svg>'
    },
    banana: {
      label: 'BANANA',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M52 11c-2 23-15 36-36 37-4 .1-7-2.7-7-6.6 0-6 3.2-11.4 8.4-15.2 2.6 5.6 8 9.4 14.6 9.4 8.8 0 14.4-7 16-19.2.3-2.6 4-5.8 4-5.4z" fill="#ffd23f" stroke="#e09a15" stroke-width="3" stroke-linejoin="round"/><path d="M15.5 26.2c2.4 5.2 7.7 8.8 14.2 8.8" stroke="#fff0a8" stroke-width="2.4" stroke-linecap="round" opacity=".8"/><path d="M50.6 11.3l2.6-3.1" stroke="#6b4a1c" stroke-width="4" stroke-linecap="round"/><circle cx="11.6" cy="42" r="3.2" fill="#7a521f"/></svg>'
    },
    star: {
      label: 'STAR',
      svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6l7.7 16.5 18.1 2.4-13.2 12.7 3.3 18-16.2-9.1L15.5 55.6l3.3-18L5.6 24.9l18.1-2.4z" fill="#ffe45e" stroke="#ff9f1c" stroke-width="3.2" stroke-linejoin="round"/><path d="M32 15l4.4 9.4 10.3 1.4-7.5 7.2 1.9 10.3-9.2-5.2-9.2 5.2 1.9-10.3-7.5-7.2 10.3-1.4z" fill="#fff8c9" opacity=".7"/><circle cx="24" cy="32" r="2" fill="#5b3a10"/><circle cx="40" cy="32" r="2" fill="#5b3a10"/><path d="M27 39c3 2 7 2 10 0" stroke="#5b3a10" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    }
  };
  // ---------------------------------------------------------------- state
  const game = {
    state: 'title',
    time: 0,
    raceTime: 0,
    countdown: 0,
    goFade: 0,
    lastLabel: '',
    playerPlace: 6,
    shake: 0,
    finishDelay: 0,
    resultsShown: false,
    camH: Math.PI,
    prevCamH: Math.PI,
    bgOffset: 0,
    demoIdx: 1,
    lastView: null,
    toastTimer: 0,
    bestLap: null,
    lapStart: 0,
    muted: false
  };

  let karts = [];
  let player = null;
  let boxes = [];
  let bananas = [];
  let shells = [];
  let particles = [];
  let confetti = [];
  let toastTimer = 0;
  let itemQueued = false;
  let isCoarse = false;
  try { isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches; } catch (e) {}

  const BOX_FRACS = [0.018, 0.24, 0.45, 0.66, 0.86];
  const PADS = [{ f: 0.295, len: 26 }, { f: 0.735, len: 26 }];

  function makeBoxes() {
    boxes = [];
    for (const f of BOX_FRACS) {
      for (const lat of [-9, 0, 9]) {
        boxes.push({ s: f * L, lat, alive: true, t: 0, seed: rand(0, TAU) });
      }
    }
  }

  const AI_DEFS = [
    { name: 'Rosso', color: '#ff4d5e', accent: '#ffd9dd', maxSpeed: 107, phase: 0.4 },
    { name: 'Bolt', color: '#ffd23f', accent: '#fff3bd', maxSpeed: 105, phase: 2.1 },
    { name: 'Mint', color: '#35e0b0', accent: '#d6fff1', maxSpeed: 109, phase: 4.0 },
    { name: 'Violet', color: '#a97cff', accent: '#ebdfff', maxSpeed: 106, phase: 5.4 },
    { name: 'Blaze', color: '#ff8a3d', accent: '#ffe0c9', maxSpeed: 108, phase: 1.2 }
  ];

  function makeKart(def) {
    return {
      name: def.name,
      color: def.color,
      accent: def.accent,
      isPlayer: !!def.isPlayer,
      s: def.s,
      lat: def.lat,
      speed: 0,
      latVel: 0,
      maxSpeed: def.maxSpeed,
      accel: def.accel || 58,
      steerVis: 0,
      drifting: false,
      driftTime: 0,
      boost: 0,
      star: 0,
      spin: 0,
      spinTotal: 1.15,
      item: null,
      itemTimer: 0,
      laps: 0,
      finished: false,
      finishTime: 0,
      lapStart: 0,
      bestLap: null,
      padCooldown: 0,
      phase: def.phase || rand(0, TAU),
      bias: rand(-2.4, 2.4),
      tilt: 0
    };
  }

  function resetRace() {
    karts = [];
    AI_DEFS.forEach((d, i) => {
      karts.push(makeKart({
        ...d,
        s: 110 - i * 15,
        lat: i % 2 === 0 ? -7 : 7
      }));
    });
    player = makeKart({
      name: 'You', color: '#45e0ff', accent: '#e9fdff', isPlayer: true,
      s: 35, lat: 7, maxSpeed: 111, accel: 64, phase: 0
    });
    karts.push(player);
    makeBoxes();
    bananas = [];
    shells = [];
    particles = [];
    confetti = [];
    game.raceTime = 0;
    game.playerPlace = 6;
    game.shake = 0;
    game.goFade = 0;
    game.finishDelay = 0;
    game.resultsShown = false;
    game.bestLap = null;
    game.camH = sampleInfo(player.s).ang;
    game.prevCamH = game.camH;
    updateItemHUD();
    countdownEl.className = 'countdown';
    countdownEl.textContent = '';
  }

  // ---------------------------------------------------------------- input
  const keys = Object.create(null);
  const touchState = { left: false, right: false, gas: false, drift: false };

  function readInput() {
    return {
      gas: !!(keys.KeyW || keys.ArrowUp || touchState.gas),
      brake: !!(keys.KeyS || keys.ArrowDown),
      left: !!(keys.KeyA || keys.ArrowLeft || touchState.left),
      right: !!(keys.KeyD || keys.ArrowRight || touchState.right),
      drift: !!(keys.ShiftLeft || keys.ShiftRight || touchState.drift)
    };
  }

  window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    initAudio();
    if (e.repeat) return;
    keys[e.code] = true;
    if (e.code === 'Space') itemQueued = true;
    if (e.code === 'KeyM') { muted = !muted; updateMute(); }
    if (e.code === 'Enter') {
      if (game.state === 'title') startRace();
      else if (!resultsPanel.classList.contains('is-hidden')) startRace();
    }
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
    touchState.left = touchState.right = touchState.gas = touchState.drift = false;
  });

  document.querySelectorAll('[data-control]').forEach((btn) => {
    const c = btn.dataset.control;
    const set = (v) => {
      if (c === 'item') {
        if (v) itemQueued = true;
      } else {
        touchState[c] = v;
      }
      btn.classList.toggle('active', v);
    };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      initAudio();
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
      set(true);
    });
    const off = (e) => { e.preventDefault(); set(false); };
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('lostpointercapture', off);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  // ---------------------------------------------------------------- items
  function rollItem(k) {
    const r = Math.random();
    if (k.isPlayer && game.playerPlace >= 5) {
      if (r < 0.3) return 'mushroom';
      if (r < 0.6) return 'shell';
      if (r < 0.82) return 'star';
      return 'banana';
    }
    if (!k.isPlayer) {
      if (r < 0.3) return 'mushroom';
      if (r < 0.66) return 'shell';
      if (r < 0.94) return 'banana';
      return 'star';
    }
    if (r < 0.26) return 'mushroom';
    if (r < 0.62) return 'shell';
    if (r < 0.88) return 'banana';
    return 'star';
  }

  function useItem(k) {
    if (!k.item || k.spin > 0 || k.finished) return;
    const item = k.item;
    k.item = null;
    k.itemTimer = 0;
    if (item === 'mushroom') {
      k.boost = Math.max(k.boost, 1.75);
      sfx.boost();
      if (k.isPlayer) { toast('TURBO!'); game.shake = Math.max(game.shake, 0.25); }
    } else if (item === 'star') {
      k.star = 4.6;
      k.boost = Math.max(k.boost, 1.1);
      sfx.boost();
      if (k.isPlayer) { toast('STAR POWER!'); game.shake = Math.max(game.shake, 0.3); }
    } else if (item === 'shell') {
      shells.push({ s: k.s + 5, lat: k.lat, speed: 250, owner: k, life: 3, seed: rand(0, TAU) });
      sfx.throwIt();
    } else if (item === 'banana') {
      bananas.push({ s: k.s - 9, lat: k.lat, owner: k, age: 0, life: 40, seed: rand(0, TAU) });
      sfx.throwIt();
    }
    if (k.isPlayer) updateItemHUD();
  }

  function tryAIItem(k) {
    if (!k.item) return;
    if (k.item === 'star') { useItem(k); return; }
    if (k.item === 'mushroom') {
      const info = sampleInfo(k.s);
      if (Math.abs(info.curv) < 0.005 && k.speed > 55) useItem(k);
      else k.itemTimer = 0.7;
      return;
    }
    if (k.item === 'shell') {
      let ahead = false;
      for (const o of karts) {
        if (o === k || o.finished) continue;
        const d = ((o.s - k.s) % L + L) % L;
        if (d < 170 && d > 0 && Math.abs(o.lat - k.lat) < 9) { ahead = true; break; }
      }
      if (ahead) useItem(k);
      else k.itemTimer = 0.9;
      return;
    }
    useItem(k);
  }

  function spinOut(k, source) {
    if (k.star > 0 || k.spin > 0 || k.finished) return;
    k.spin = k.spinTotal;
    k.speed = Math.min(k.speed * 0.3, 34);
    k.latVel *= 0.15;
    k.drifting = false;
    k.driftTime = 0;
    k.item = null;
    if (k.isPlayer) {
      game.shake = Math.max(game.shake, 0.85);
      sfx.hit();
      toast('SPUN OUT!');
      updateItemHUD();
    } else if (source && source.isPlayer) {
      sfx.hit();
      toast('DIRECT HIT!');
      game.shake = Math.max(game.shake, 0.35);
    }
    spawnBurst(k, source && source.isPlayer ? '#ffe45e' : '#ff8a3d');
  }

  function updateItemHUD() {
    const item = player ? player.item : null;
    if (!item) {
      itemIcon.innerHTML = '?';
      itemLabel.textContent = 'ITEM BOX';
      itemSlot.classList.remove('has-item', 'star-item');
      return;
    }
    const meta = ITEMS[item];
    itemIcon.innerHTML = meta.svg;
    itemLabel.textContent = meta.label;
    itemSlot.classList.add('has-item');
    itemSlot.classList.toggle('star-item', item === 'star');
  }

  // ---------------------------------------------------------------- physics
  function advanceKart(k, dt) {
    k.s += k.speed * dt;
    if (k.s >= L) {
      k.s -= L;
      if (k.laps < 3) {
        k.laps++;
        const lt = game.raceTime - k.lapStart;
        k.lapStart = game.raceTime;
        if (k.bestLap === null || lt < k.bestLap) k.bestLap = lt;
        if (k.laps >= 3) {
          k.finished = true;
          k.finishTime = game.raceTime;
          if (k.isPlayer) finishRace();
        } else if (k.isPlayer) {
          toast(`LAP ${k.laps + 1} / 3`);
          sfx.lap();
        }
      }
    }
  }

  function updatePlayer(k, dt) {
    if (k.boost > 0) k.boost = Math.max(0, k.boost - dt);
    if (k.star > 0) k.star = Math.max(0, k.star - dt);
    if (k.padCooldown > 0) k.padCooldown -= dt;
    const inp = readInput();

    if (k.spin > 0) {
      k.spin = Math.max(0, k.spin - dt);
      k.speed = Math.max(0, k.speed - 140 * dt);
      k.latVel *= Math.pow(0.02, dt);
      k.steerVis *= Math.pow(0.02, dt);
      k.drifting = false;
      k.driftTime = 0;
      advanceKart(k, dt);
      return;
    }

    const info = sampleInfo(k.s);
    const offroad = Math.abs(k.lat) > info.half - 1.6;
    let top = k.maxSpeed;
    if (k.star > 0) top *= 1.16;
    if (k.boost > 0) top *= 1.42;
    if (offroad) top = Math.min(top, 46);

    if (inp.gas) k.speed += k.accel * dt * (k.boost > 0 ? 1.7 : 1);
    else k.speed -= 15 * dt;
    if (inp.brake) k.speed -= 115 * dt;
    if (offroad) k.speed -= 55 * dt;
    if (k.star > 0) k.speed += 12 * dt;
    k.speed = clamp(k.speed, 0, top);

    const steer = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const canDrift = inp.drift && Math.abs(steer) > 0 && k.speed > 52 && !offroad;
    if (canDrift) {
      if (!k.drifting) { k.drifting = true; k.driftTime = 0; }
      k.driftTime += dt;
      if (k.driftTime > 1.5 && Math.random() < dt * 34) spawnSpark(k, '#ff7a3d');
      else if (Math.random() < dt * 34) spawnSpark(k, '#63f0ff');
    } else if (k.drifting) {
      if (k.driftTime > 1.45) {
        k.boost = Math.max(k.boost, 1.05);
        toast('SUPER MINI-TURBO');
        sfx.boost();
      } else if (k.driftTime > 0.72) {
        k.boost = Math.max(k.boost, 0.55);
        toast('MINI-TURBO');
        sfx.boost();
      }
      k.drifting = false;
      k.driftTime = 0;
    }

    const grip = offroad ? 0.35 : 1;
    const steerPower = (k.drifting ? 82 : 52) * grip;
    k.latVel += steer * steerPower * dt * clamp(k.speed / 42, 0, 1.35);
    k.latVel -= info.curv * k.speed * k.speed * 0.26 * dt;
    const damp = k.drifting ? 0.07 : 0.06;
    k.latVel *= Math.pow(damp, dt);
    k.lat += k.latVel * dt;

    const limit = info.half + 13;
    if (Math.abs(k.lat) > limit) {
      k.lat = clamp(k.lat, -limit, limit);
      k.latVel *= -0.2;
    }

    k.steerVis = lerp(k.steerVis, steer * (k.drifting ? 1.7 : 1), Math.min(1, dt * 9));
    k.tilt = k.steerVis;

    if (offroad && k.speed > 24) {
      game.shake = Math.max(game.shake, 0.26);
      if (Math.random() < dt * 26) spawnDust(k);
    }
    if (k.boost > 0 && Math.random() < dt * 46) spawnFlame(k);
    if (k.star > 0 && Math.random() < dt * 40) spawnStar(k, k);

    advanceKart(k, dt);
    if (itemQueued) useItem(k);
    if (k.speed > 6 && k.isPlayer) updateEngine(k.speed, inp.gas, k.boost);
  }

  function updateAI(k, dt) {
    if (k.boost > 0) k.boost = Math.max(0, k.boost - dt);
    if (k.star > 0) k.star = Math.max(0, k.star - dt);
    if (k.padCooldown > 0) k.padCooldown -= dt;
    if (k.spin > 0) {
      k.spin = Math.max(0, k.spin - dt);
      k.speed = Math.max(0, k.speed - 130 * dt);
      advanceKart(k, dt);
      return;
    }
    const info = sampleInfo(k.s);
    const attract = game.state === 'title';
    const offroad = Math.abs(k.lat) > info.half - 1.6;

    let targetLat = Math.sin(k.s * 0.011 + k.phase) * info.half * 0.34 + k.bias;
    targetLat = clamp(targetLat, -info.half + 4, info.half - 4);
    if (k.finished) targetLat = info.half + 9;

    const err = targetLat - k.lat;
    const desiredVel = clamp(err * 2.6, -21, 21);
    k.latVel += (desiredVel - k.latVel) * Math.min(1, dt * 2.4);
    k.latVel -= info.curv * k.speed * k.speed * 0.19 * dt;
    k.lat += k.latVel * dt;
    const limit = info.half + 13;
    if (Math.abs(k.lat) > limit) { k.lat = clamp(k.lat, -limit, limit); k.latVel *= -0.2; }

    let targetSpeed = k.maxSpeed;
    if (!attract && player) {
      const gap = (player.laps * L + player.s) - (k.laps * L + k.s);
      targetSpeed += clamp(gap * 0.05, -6, 14);
    }
    if (Math.abs(info.curv) > 0.004) targetSpeed *= 0.93;
    if (offroad) targetSpeed *= 0.5;
    if (k.boost > 0) targetSpeed *= 1.35;
    if (k.star > 0) targetSpeed *= 1.1;
    if (k.finished) targetSpeed = 68;
    k.speed += clamp(targetSpeed - k.speed, -78 * dt, 52 * dt);
    k.steerVis = lerp(k.steerVis, clamp(err * 0.16, -1, 1), Math.min(1, dt * 4));
    k.tilt = k.steerVis;

    if (k.boost > 0 && Math.random() < dt * 30) spawnFlame(k);
    if (k.star > 0 && Math.random() < dt * 26) spawnStar(k, k);

    k.itemTimer -= dt;
    if (k.item && k.itemTimer <= 0 && !attract) tryAIItem(k);

    advanceKart(k, dt);
  }

  function kartCollisions() {
    for (let i = 0; i < karts.length; i++) {
      for (let j = i + 1; j < karts.length; j++) {
        const a = karts[i], b = karts[j];
        if (a.finished || b.finished) continue;
        if (!near(a.s, b.s, 6.2, L)) continue;
        const d = b.lat - a.lat;
        if (Math.abs(d) >= 5.2) continue;
        const push = (5.2 - Math.abs(d)) * 0.5;
        const sgn = d >= 0 ? 1 : -1;
        a.lat -= push * sgn * 0.55;
        b.lat += push * sgn * 0.55;
        const avg = (a.speed + b.speed) * 0.5;
        a.speed = lerp(a.speed, avg, 0.15);
        b.speed = lerp(b.speed, avg, 0.15);
        if (a.star > 0 && b.star <= 0) spinOut(b, a);
        if (b.star > 0 && a.star <= 0) spinOut(a, b);
        if (a.isPlayer || b.isPlayer) {
          game.shake = Math.max(game.shake, 0.18);
        }
      }
    }
  }

  function checkBoxes() {
    for (const box of boxes) {
      if (!box.alive) continue;
      for (const k of karts) {
        if (k.item || k.finished) continue;
        if (near(k.s, box.s, 4.2, L) && Math.abs(k.lat - box.lat) < 4.4) {
          box.alive = false;
          box.t = 4.5;
          k.item = rollItem(k);
          k.itemTimer = k.isPlayer ? 0 : rand(1.4, 3.4);
          spawnPickup(k, box);
          if (k.isPlayer) {
            sfx.pickup();
            updateItemHUD();
            toast(ITEMS[k.item].label + ' GET!');
          }
          break;
        }
      }
    }
  }

  function checkPads(k) {
    if (k.padCooldown > 0 || k.finished) return;
    for (const pad of PADS) {
      const center = pad.f * L;
      if (near(k.s, center, pad.len / 2, L) && Math.abs(k.lat) < 11) {
        k.boost = Math.max(k.boost, 0.95);
        k.padCooldown = 1.1;
        if (k.isPlayer) {
          sfx.boost();
          game.shake = Math.max(game.shake, 0.16);
        }
        spawnPadBurst(k);
        break;
      }
    }
  }

  function updateItems(dt) {
    for (const box of boxes) {
      if (!box.alive) {
        box.t -= dt;
        if (box.t <= 0) box.alive = true;
      }
    }

    for (let i = bananas.length - 1; i >= 0; i--) {
      const b = bananas[i];
      b.age += dt;
      b.life -= dt;
      if (b.life <= 0) { bananas.splice(i, 1); continue; }
      for (const k of karts) {
        if (k.finished) continue;
        if (b.owner === k && b.age < 0.7) continue;
        if (near(k.s, b.s, 4.2, L) && Math.abs(k.lat - b.lat) < 4.2) {
          spinOut(k, b.owner);
          bananas.splice(i, 1);
          sfx.throwIt();
          break;
        }
      }
    }

    for (let i = shells.length - 1; i >= 0; i--) {
      const sh = shells[i];
      sh.s = (sh.s + sh.speed * dt) % L;
      sh.life -= dt;
      let target = null, best = 260;
      for (const k of karts) {
        if (k === sh.owner || k.finished) continue;
        let d = ((k.s - sh.s) % L + L) % L;
        if (d > 0 && d < best) { best = d; target = k; }
      }
      if (target) sh.lat += clamp(target.lat - sh.lat, -30 * dt, 30 * dt);
      let hit = false;
      for (const k of karts) {
        if (k === sh.owner || k.finished) continue;
        if (near(k.s, sh.s, 5.4, L) && Math.abs(k.lat - sh.lat) < 4.8) {
          spinOut(k, sh.owner);
          spawnBurst(k, sh.owner && sh.owner.isPlayer ? '#ffe45e' : '#ff5a3d');
          hit = true;
          break;
        }
      }
      if (hit || sh.life <= 0) {
        shells.splice(i, 1);
      }
    }
  }

  function computeOrder() {
    const finished = karts.filter((k) => k.finished).sort((a, b) => a.finishTime - b.finishTime);
    const running = karts.filter((k) => !k.finished).sort((a, b) => (b.laps * L + b.s) - (a.laps * L + a.s));
    return finished.concat(running);
  }

  function computePlace() {
    const order = computeOrder();
    const idx = order.indexOf(player);
    return idx < 0 ? 6 : idx + 1;
  }

  function finishRace() {
    if (game.state !== 'race') return;
    game.state = 'finished';
    game.finishDelay = 1.25;
    game.playerPlace = computePlace();
    game.bestLap = player.bestLap;
    sfx.finish();
    burstConfetti();
  }
  // ---------------------------------------------------------------- particles
  function addParticle(p) {
    if (particles.length > 280) particles.shift();
    particles.push(p);
  }

  function kartScreen(k) {
    if (!game.lastView) return null;
    const p = trackPos(k.s, k.lat);
    const pr = projectPoint(p.x, p.y, p.z, game.lastView);
    if (pr.depth < 3 || pr.depth > 520) return null;
    return pr;
  }

  function spawnSpark(k, color) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 1.5, 26);
    addParticle({
      x: pr.x + rand(-0.6, 0.6) * s * 2, y: pr.y - rand(0, 0.3) * s,
      vx: rand(-30, 30), vy: rand(-60, 5), grav: 130, life: rand(0.22, 0.42),
      max: 0.42, size: rand(0.8, 2.2) * (s * 0.14 + 1), color, mode: 'spark'
    });
  }

  function spawnFlame(k) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 30);
    addParticle({
      x: pr.x + rand(-0.35, 0.35) * s * 2, y: pr.y - s * rand(0.05, 0.35),
      vx: rand(-18, 18), vy: rand(20, 70), grav: -40, life: rand(0.18, 0.34),
      max: 0.34, size: rand(0.8, 1.8) * (s * 0.12 + 1.2), color: Math.random() < 0.5 ? '#ffd23f' : '#ff6a3d', mode: 'flame'
    });
  }

  function spawnDust(k) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 30);
    addParticle({
      x: pr.x + rand(-1, 1) * s * 2, y: pr.y - rand(0, 0.25) * s,
      vx: rand(-40, 40), vy: rand(-40, -4), grav: 60, life: rand(0.35, 0.7),
      max: 0.7, size: rand(1, 2.6) * (s * 0.15 + 1), color: Math.random() < 0.5 ? '#c99a5b' : '#8e6b3f', mode: 'dust'
    });
  }

  function spawnStar(k, src) {
    const pr = kartScreen(src);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 30);
    addParticle({
      x: pr.x + rand(-1.4, 1.4) * s * 2, y: pr.y - rand(0.2, 1.1) * s,
      vx: rand(-35, 35), vy: rand(-70, 0), grav: 30, life: rand(0.3, 0.6),
      max: 0.6, size: rand(1.4, 3) * (s * 0.12 + 1), color: `hsl(${(game.time * 200 + rand(0, 90)) % 360},100%,65%)`, mode: 'star'
    });
  }

  function spawnBurst(k, color) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 30);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU;
      addParticle({
        x: pr.x, y: pr.y - s * 0.5,
        vx: Math.cos(a) * rand(60, 180) * (s / 18), vy: Math.sin(a) * rand(40, 130) * (s / 18),
        grav: 160, life: rand(0.3, 0.6), max: 0.6,
        size: rand(2, 4.5), color, mode: 'spark'
      });
    }
  }

  function spawnPickup(k, box) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 26);
    for (let i = 0; i < 16; i++) {
      const a = rand(0, TAU);
      addParticle({
        x: pr.x, y: pr.y - s * 0.7,
        vx: Math.cos(a) * rand(30, 120), vy: Math.sin(a) * rand(30, 110),
        grav: 90, life: rand(0.3, 0.65), max: 0.65,
        size: rand(2, 4), color: Math.random() < 0.5 ? '#63f0ff' : '#ffe45e', mode: 'spark'
      });
    }
    spawnBurst(k, '#63f0ff');
  }

  function spawnPadBurst(k) {
    const pr = kartScreen(k);
    if (!pr) return;
    const s = clamp(pr.scale, 2, 26);
    for (let i = 0; i < 10; i++) {
      addParticle({
        x: pr.x + rand(-1.5, 1.5) * s, y: pr.y,
        vx: rand(-50, 50), vy: rand(-130, -20), grav: 120, life: rand(0.25, 0.5),
        max: 0.5, size: rand(1.5, 3), color: '#56e8d8', mode: 'spark'
      });
    }
  }

  function burstConfetti() {
    const colors = ['#ffd23f', '#ff4d8d', '#45e0ff', '#45f0b0', '#fff6e8', '#a97cff'];
    for (let i = 0; i < 110; i++) {
      confetti.push({
        x: rand(-40, W + 40), y: rand(-H * 0.4, H * 0.05),
        vx: rand(-50, 50), vy: rand(70, 240), rot: rand(0, TAU), vr: rand(-8, 8),
        size: rand(4, 9), color: colors[(Math.random() * colors.length) | 0], life: rand(2.4, 4)
      });
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.grav * dt;
    }
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.life -= dt;
      if (c.life <= 0) { confetti.splice(i, 1); continue; }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 55 * dt;
      c.rot += c.vr * dt;
      c.vx *= Math.pow(0.7, dt);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const a = clamp(p.life / p.max, 0, 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.mode === 'dust') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1.4 - a * 0.4), 0, TAU);
        ctx.fill();
      } else if (p.mode === 'flame') {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.7, p.size * 1.5, 0, 0, TAU);
        ctx.fill();
      } else if (p.mode === 'star') {
        const s = p.size;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * TAU - Math.PI / 2;
          const r = i % 2 ? s * 0.42 : s;
          const x = p.x + Math.cos(ang) * r;
          const y = p.y + Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    for (const c of confetti) {
      const a = clamp(c.life / 1.2, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size * 0.28, c.size, c.size * 0.56);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- view
  function projectPoint(x, y, z, v) {
    const dx = x - v.x, dy = y - v.y, dz = z - v.z;
    const sin = Math.sin(v.h), cos = Math.cos(v.h);
    const depth = dx * sin + dz * cos;
    if (depth < 0.4) return { x: 0, y: 0, depth, scale: 0 };
    const lateral = dx * cos - dz * sin;
    const scale = v.focal / depth;
    return {
      x: W / 2 + lateral * scale + v.shakeX,
      y: v.horizon - dy * scale + v.shakeY,
      depth,
      scale
    };
  }

  function computeView(dt) {
    let s, lat, steer = 0;
    if (game.state === 'title') {
      const k = karts[game.demoIdx] || karts[0] || { s: 60, lat: 0 };
      s = k.s;
      lat = 0;
    } else {
      s = player.s;
      lat = player.lat;
      steer = player.steerVis;
    }
    const p = trackPos(s, lat);
    const targetH = p.info.ang + (game.state === 'title' ? 0 : steer * 0.12);
    game.camH += wrapAngle(targetH - game.camH) * Math.min(1, dt * 8.5);
    game.bgOffset += wrapAngle(game.camH - game.prevCamH) * W * 0.55;
    game.bgOffset = ((game.bgOffset % RIDGE_W) + RIDGE_W) % RIDGE_W;
    game.prevCamH = game.camH;

    const back = 26.5, up = 11.5;
    const shake = game.shake;
    return {
      x: p.x - Math.sin(game.camH) * back,
      y: p.y + up,
      z: p.z - Math.cos(game.camH) * back,
      h: game.camH,
      focal: H * 0.95,
      horizon: H * 0.43,
      shakeX: shake > 0 ? rand(-1, 1) * shake * 9 : 0,
      shakeY: shake > 0 ? rand(-1, 1) * shake * 7 : 0
    };
  }

  // ---------------------------------------------------------------- sky
  const RIDGE_W = 2600;
  function makeRidge(seed) {
    const arr = [];
    for (let i = 0; i < 520; i++) {
      const x = i / 520;
      arr.push(0.5 +
        0.27 * Math.sin(TAU * 3 * x + seed) +
        0.15 * Math.sin(TAU * 7 * x + seed * 1.7) +
        0.08 * Math.sin(TAU * 13 * x + seed * 2.3) +
        0.04 * Math.sin(TAU * 23 * x + seed * 3.1));
    }
    return arr;
  }
  const ridgeFar = makeRidge(0.7);
  const ridgeNear = makeRidge(2.9);

  const CLOUDS = [
    { x: 0.12, y: 0.34, s: 1.2, drift: 3 },
    { x: 0.42, y: 0.2, s: 0.8, drift: 2 },
    { x: 0.68, y: 0.42, s: 1.5, drift: 4 },
    { x: 0.88, y: 0.26, s: 0.9, drift: 3 },
    { x: 0.28, y: 0.5, s: 0.7, drift: 2 },
    { x: 0.78, y: 0.55, s: 1.1, drift: 3 }
  ];

  function drawRidge(arr, offset, baseY, amp, color) {
    ctx.beginPath();
    ctx.moveTo(-20, H);
    const step = Math.max(10, W / 90);
    for (let x = -20; x <= W + 20; x += step) {
      let u = (x + offset) % RIDGE_W;
      if (u < 0) u += RIDGE_W;
      const f = (u / RIDGE_W) * arr.length;
      const i = Math.floor(f) % arr.length;
      const j = (i + 1) % arr.length;
      const t = f - Math.floor(f);
      const v = lerp(arr[i], arr[j], t);
      ctx.lineTo(x, baseY - v * amp);
    }
    ctx.lineTo(W + 20, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawSky(v) {
    const hz = v.horizon;
    const sky = ctx.createLinearGradient(0, 0, 0, hz + 4);
    sky.addColorStop(0, '#171a48');
    sky.addColorStop(0.38, '#4a2a67');
    sky.addColorStop(0.68, '#a8416d');
    sky.addColorStop(0.88, '#e4635f');
    sky.addColorStop(1, '#ffa066');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, hz + 4);

    const sunX = W * 0.5 - Math.sin(game.camH - Math.PI) * W * 0.56;
    const sunY = hz - H * 0.045;
    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.4);
    glow.addColorStop(0, 'rgba(255,232,160,0.72)');
    glow.addColorStop(0.35, 'rgba(255,168,96,0.22)');
    glow.addColorStop(1, 'rgba(255,140,80,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, hz + 20);

    const sunR = H * 0.078;
    const sg = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
    sg.addColorStop(0, '#fff8d8');
    sg.addColorStop(0.55, '#ffd977');
    sg.addColorStop(1, '#ff9d55');
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, TAU);
    ctx.fillStyle = sg;
    ctx.fill();

    for (const c of CLOUDS) {
      const span = W + 600;
      let x = (c.x * W - game.bgOffset * 0.2 + game.time * c.drift) % span;
      if (x < 0) x += span;
      x -= 300;
      const y = c.y * hz;
      const s = c.s * H * 0.028;
      ctx.fillStyle = 'rgba(255,196,170,0.13)';
      ctx.beginPath();
      ctx.ellipse(x, y, s * 3.4, s * 0.95, 0, 0, TAU);
      ctx.ellipse(x - s * 2, y + s * 0.2, s * 1.8, s * 0.65, 0, 0, TAU);
      ctx.ellipse(x + s * 2.1, y + s * 0.1, s * 2, s * 0.7, 0, 0, TAU);
      ctx.fill();
    }

    drawRidge(ridgeFar, game.bgOffset * 0.35, hz + H * 0.008, H * 0.155, '#553a72');
    drawRidge(ridgeNear, game.bgOffset * 0.62, hz + H * 0.016, H * 0.105, '#33234f');

    const haze = ctx.createLinearGradient(0, hz - H * 0.06, 0, hz + H * 0.05);
    haze.addColorStop(0, 'rgba(255,150,110,0)');
    haze.addColorStop(0.7, 'rgba(255,150,110,0.22)');
    haze.addColorStop(1, 'rgba(255,150,110,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, hz - H * 0.06, W, H * 0.11);
  }

  function drawGround(v) {
    const hz = v.horizon;
    const g = ctx.createLinearGradient(0, hz, 0, H);
    g.addColorStop(0, '#1a5b43');
    g.addColorStop(0.32, '#1e714c');
    g.addColorStop(1, '#2f9c60');
    ctx.fillStyle = g;
    ctx.fillRect(0, hz, W, H - hz);

    const sheen = ctx.createRadialGradient(W * 0.5, hz, 0, W * 0.5, hz, H * 0.7);
    sheen.addColorStop(0, 'rgba(255,186,120,0.13)');
    sheen.addColorStop(1, 'rgba(255,186,120,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, hz, W, H - hz);

    // low tree line hiding the horizon seam
    ctx.fillStyle = 'rgba(13,52,39,0.9)';
    ctx.beginPath();
    ctx.moveTo(0, hz + 4);
    const step = Math.max(8, W / 70);
    for (let x = 0; x <= W + step; x += step) {
      const y = hz + 2 - (3 + 2.4 * Math.sin(x * 0.021 + game.bgOffset * 0.001) + 1.6 * Math.sin(x * 0.047 + 1.7));
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, hz + 10);
    ctx.lineTo(0, hz + 10);
    ctx.closePath();
    ctx.fill();
  }

  // ---------------------------------------------------------------- road
  const VIEW_COUNT = 126;

  function quad(a, b, c, d, fill) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function buildPoints(v) {
    const focusS = game.state === 'title'
      ? (karts[game.demoIdx] ? karts[game.demoIdx].s : 60)
      : player.s;
    const baseS = focusS - 30;
    const baseIdx = Math.floor((((baseS % L) + L) % L) / ds);
    const pts = [];
    for (let i = 0; i < VIEW_COUNT; i++) {
      const idx = (baseIdx + i) % N;
      const smp = samples[idx];
      const nx = Math.cos(smp.ang), nz = -Math.sin(smp.ang);
      const hOut = smp.half + 7;
      pts.push({
        smp,
        sVal: baseS + i * ds,
        Lr: projectPoint(smp.x - nx * smp.half, smp.y, smp.z - nz * smp.half, v),
        Rr: projectPoint(smp.x + nx * smp.half, smp.y, smp.z + nz * smp.half, v),
        Lo: projectPoint(smp.x - nx * hOut, smp.y, smp.z - nz * hOut, v),
        Ro: projectPoint(smp.x + nx * hOut, smp.y, smp.z + nz * hOut, v)
      });
    }
    return pts;
  }

  function drawRoad(v) {
    const pts = buildPoints(v);
    for (let i = pts.length - 2; i >= 0; i--) {
      const a = pts[i], b = pts[i + 1];
      if (a.Lr.depth < 1 || a.Rr.depth < 1 || b.Lr.depth < 1 || b.Rr.depth < 1) continue;
      if (a.Lo.depth < 1 || a.Ro.depth < 1) continue;
      if (a.Lr.depth > 520 || b.Lr.depth > 520) continue;

      const sCol = ((a.sVal % L) + L) % L;
      const band = Math.floor(sCol / 13) % 2;
      const roadCol = band ? '#3e414e' : '#454856';
      const shoulderCol = band ? '#2a8a58' : '#247f51';

      quad(a.Lo, a.Ro, b.Ro, b.Lo, shoulderCol);
      quad(a.Lr, a.Rr, b.Rr, b.Lr, roadCol);

      let onPad = false;
      for (const pad of PADS) {
        const center = pad.f * L;
        if (near(sCol, center, pad.len / 2, L)) {
          onPad = true;
          const pb = Math.floor(sCol / 5) % 2;
          quad(a.Lr, a.Rr, b.Rr, b.Lr, pb ? '#56e8d8' : '#2f9ba6');
          break;
        }
      }

      if (sCol < 9.5) {
        const cols = 10;
        for (let c = 0; c < cols; c++) {
          const t0 = c / cols, t1 = (c + 1) / cols;
          const aL = { x: lerp(a.Lr.x, a.Rr.x, t0), y: lerp(a.Lr.y, a.Rr.y, t0) };
          const aR = { x: lerp(a.Lr.x, a.Rr.x, t1), y: lerp(a.Lr.y, a.Rr.y, t1) };
          const bL = { x: lerp(b.Lr.x, b.Rr.x, t0), y: lerp(b.Lr.y, b.Rr.y, t0) };
          const bR = { x: lerp(b.Lr.x, b.Rr.x, t1), y: lerp(b.Lr.y, b.Rr.y, t1) };
          quad(aL, aR, bR, bL, c % 2 ? '#f4efe2' : '#22242f');
        }
      }

      const nearDetail = a.Lr.depth < 300;
      if (!onPad) {
        if (Math.floor(sCol / 11) % 2 === 0) {
          const cw = 0.006;
          const a0 = { x: lerp(a.Lr.x, a.Rr.x, 0.5 - cw), y: lerp(a.Lr.y, a.Rr.y, 0.5 - cw) };
          const a1 = { x: lerp(a.Lr.x, a.Rr.x, 0.5 + cw), y: lerp(a.Lr.y, a.Rr.y, 0.5 + cw) };
          const b0 = { x: lerp(b.Lr.x, b.Rr.x, 0.5 - cw), y: lerp(b.Lr.y, b.Rr.y, 0.5 - cw) };
          const b1 = { x: lerp(b.Lr.x, b.Rr.x, 0.5 + cw), y: lerp(b.Lr.y, b.Rr.y, 0.5 + cw) };
          quad(a0, a1, b1, b0, 'rgba(255,246,232,0.28)');
        }
        const edge = 0.013;
        if (nearDetail) quad(
          a.Lr, { x: lerp(a.Lr.x, a.Rr.x, edge), y: lerp(a.Lr.y, a.Rr.y, edge) },
          { x: lerp(b.Lr.x, b.Rr.x, edge), y: lerp(b.Lr.y, b.Rr.y, edge) }, b.Lr,
          'rgba(248,242,226,0.82)'
        );
        if (nearDetail) quad(
          { x: lerp(a.Lr.x, a.Rr.x, 1 - edge), y: lerp(a.Lr.y, a.Rr.y, 1 - edge) }, a.Rr,
          b.Rr, { x: lerp(b.Lr.x, b.Rr.x, 1 - edge), y: lerp(b.Lr.y, b.Rr.y, 1 - edge) },
          'rgba(248,242,226,0.82)'
        );
      }

      if (Math.abs(a.smp.curv) > 0.0042 && nearDetail) {
        const curbCol = Math.floor(sCol / 5.5) % 2 ? '#f7f0e2' : '#ff5a5f';
        const cw = 0.42;
        quad(a.Lr, { x: lerp(a.Lr.x, a.Lo.x, cw), y: lerp(a.Lr.y, a.Lo.y, cw) },
          { x: lerp(b.Lr.x, b.Lo.x, cw), y: lerp(b.Lr.y, b.Lo.y, cw) }, b.Lr, curbCol);
        quad({ x: lerp(a.Rr.x, a.Ro.x, cw), y: lerp(a.Rr.y, a.Ro.y, cw) }, a.Rr,
          b.Rr, { x: lerp(b.Rr.x, b.Ro.x, cw), y: lerp(b.Rr.y, b.Ro.y, cw) }, curbCol);
      }
    }
  }
  // ---------------------------------------------------------------- sprites
  const FONT = '"Arial Black", Impact, "Helvetica Neue", sans-serif';

  function roundRectPath(c, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawKartSprite(x, y, scale, k) {
    const boostScale = k.isPlayer ? 1.1 : 1;
    const w = Math.min(scale * 3.6 * boostScale, 265);
    if (w < 5) {
      ctx.fillStyle = k.color;
      ctx.fillRect(x - 2, y - 4, 4, 4);
      return;
    }
    const h = w * 0.82;

    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.55, h * 0.1, 0, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    let rot = k.tilt * 0.05;
    if (k.spin > 0) rot += (1 - k.spin / k.spinTotal) * TAU * 2.2;
    ctx.rotate(rot);

    if (k.star > 0) {
      const hue = (game.time * 320) % 360;
      ctx.fillStyle = `hsla(${hue},100%,65%,0.24)`;
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.42, w * 0.82, h * 0.72, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `hsl(${hue},100%,70%)`;
      ctx.lineWidth = Math.max(1.5, w * 0.028);
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.42, w * 0.5, h * 0.62, 0, 0, TAU);
      ctx.stroke();
    }

    if (k.boost > 0) {
      const flick = 1 + Math.sin(game.time * 42 + k.phase) * 0.24;
      for (const ox of [-0.14, 0.14]) {
        const cx = w * ox;
        ctx.fillStyle = 'rgba(255,130,40,0.88)';
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.055, -h * 0.11);
        ctx.quadraticCurveTo(cx - w * 0.022, h * 0.05, cx, h * 0.135 * flick);
        ctx.quadraticCurveTo(cx + w * 0.022, h * 0.05, cx + w * 0.055, -h * 0.11);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,246,190,0.95)';
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.024, -h * 0.11);
        ctx.quadraticCurveTo(cx - w * 0.01, h * 0.02, cx, h * 0.065 * flick);
        ctx.quadraticCurveTo(cx + w * 0.01, h * 0.02, cx + w * 0.024, -h * 0.11);
        ctx.closePath();
        ctx.fill();
      }
    }

    const wheelW = w * 0.17, wheelH = h * 0.46;
    ctx.fillStyle = '#15141c';
    roundRectPath(ctx, -w * 0.52, -h * 0.52, wheelW, wheelH, wheelW * 0.4);
    ctx.fill();
    roundRectPath(ctx, w * 0.35, -h * 0.52, wheelW, wheelH, wheelW * 0.4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.fillRect(-w * 0.49, -h * 0.43, wheelW * 0.22, wheelH * 0.6);
    ctx.fillRect(w * 0.67, -h * 0.43, wheelW * 0.22, wheelH * 0.6);

    ctx.fillStyle = k.color;
    roundRectPath(ctx, -w * 0.33, -h * 0.64, w * 0.66, h * 0.52, w * 0.1);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    roundRectPath(ctx, -w * 0.33, -h * 0.3, w * 0.66, h * 0.18, w * 0.08);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    roundRectPath(ctx, -w * 0.26, -h * 0.61, w * 0.52, h * 0.11, w * 0.05);
    ctx.fill();
    ctx.fillStyle = k.accent;
    roundRectPath(ctx, -w * 0.055, -h * 0.5, w * 0.11, h * 0.28, w * 0.04);
    ctx.fill();

    ctx.fillStyle = k.accent;
    ctx.beginPath();
    ctx.arc(0, -h * 0.71, w * 0.105, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#22222f';
    roundRectPath(ctx, -w * 0.075, -h * 0.745, w * 0.15, h * 0.06, w * 0.026);
    ctx.fill();

    ctx.fillStyle = '#1b1a26';
    roundRectPath(ctx, -w * 0.36, -h * 0.81, w * 0.72, h * 0.08, w * 0.03);
    ctx.fill();
    ctx.fillStyle = '#2a2936';
    ctx.fillRect(-w * 0.24, -h * 0.74, w * 0.045, h * 0.1);
    ctx.fillRect(w * 0.195, -h * 0.74, w * 0.045, h * 0.1);

    ctx.fillStyle = '#d9dbe4';
    roundRectPath(ctx, -w * 0.4, -h * 0.17, w * 0.8, h * 0.075, w * 0.03);
    ctx.fill();
    ctx.fillStyle = '#7c8090';
    ctx.fillRect(-w * 0.17, -h * 0.15, w * 0.06, h * 0.06);
    ctx.fillRect(w * 0.11, -h * 0.15, w * 0.06, h * 0.06);

    ctx.restore();
  }

  function drawBoxSprite(x, y, scale, box) {
    const size = Math.min(scale * 2.75, 96);
    if (size < 3) return;
    const bob = Math.sin(game.time * 3.2 + box.seed) * size * 0.18;
    const cy = y - size * 0.95 + bob;
    const sx = Math.cos(game.time * 1.7 + box.seed);

    const glow = ctx.createRadialGradient(x, cy, 0, x, cy, size * 1.7);
    glow.addColorStop(0, 'rgba(99,240,255,0.30)');
    glow.addColorStop(1, 'rgba(99,240,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, cy, size * 1.7, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.translate(x, cy);
    ctx.scale(0.3 + Math.abs(sx) * 0.7, 1);
    ctx.rotate(Math.PI / 4);
    const g = ctx.createLinearGradient(-size, -size, size, size);
    g.addColorStop(0, '#63f0ff');
    g.addColorStop(0.5, '#ffe45e');
    g.addColorStop(1, '#ff4d8d');
    ctx.fillStyle = g;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(1, size * 0.06);
    roundRectPath(ctx, -size * 0.5, -size * 0.5, size, size, size * 0.16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#171a48';
    ctx.font = `900 ${Math.max(9, size * 0.95)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', x, cy + size * 0.03);
  }

  function drawBananaSprite(x, y, scale, b) {
    const w = Math.min(scale * 1.5, 46);
    if (w < 2.5) return;
    ctx.save();
    ctx.translate(x, y - w * 0.3);
    ctx.rotate(Math.sin(game.time * 2 + b.seed) * 0.16);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, w * 0.3, w * 0.6, w * 0.14, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.68, -0.35, Math.PI + 0.35);
    ctx.arc(0, -w * 0.3, w * 0.6, Math.PI + 0.35, -0.35, true);
    ctx.closePath();
    ctx.fillStyle = '#ffd23f';
    ctx.fill();
    ctx.strokeStyle = '#b97912';
    ctx.lineWidth = Math.max(1, w * 0.09);
    ctx.stroke();
    ctx.fillStyle = '#6b4a1c';
    ctx.beginPath();
    ctx.arc(w * 0.02, w * 0.55, w * 0.1, 0, TAU);
    ctx.arc(w * 0.45, w * 0.02, w * 0.09, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawShellSprite(x, y, scale, sh) {
    const r = Math.min(scale * 1.15, 34);
    if (r < 2.5) return;
    ctx.save();
    ctx.translate(x, y - r * 0.75);
    ctx.rotate(game.time * 7 + sh.seed);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.75, r * 1.05, r * 0.25, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fillStyle = '#e8384f';
    ctx.fill();
    ctx.fillStyle = '#fff6e8';
    ctx.fillRect(-r * 0.95, -r * 0.16, r * 1.9, r * 0.32);
    ctx.strokeStyle = '#9e1f32';
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = '#fff6e8';
    ctx.beginPath();
    ctx.arc(0, -r * 0.36, r * 0.26, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawPalmSprite(x, y, scale, tree) {
    const h = scale * 8.2 * tree.scale;
    if (h < 9) {
      ctx.fillStyle = '#0e4a35';
      ctx.fillRect(x - 1, y - 8, 2, 8);
      return;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath();
    ctx.ellipse(x, y, h * 0.26, h * 0.05, 0, 0, TAU);
    ctx.fill();

    const sway = Math.sin(game.time * 1.1 + tree.seed) * h * 0.022;
    const topX = x + sway;
    const topY = y - h;
    ctx.strokeStyle = '#6b4630';
    ctx.lineWidth = Math.max(1.2, h * 0.045);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + h * 0.05, y - h * 0.55, topX, topY);
    ctx.stroke();

    const len = h * 0.52;
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i - 3.5) * 0.5;
      const ex = topX + Math.cos(a) * len;
      const ey = topY + Math.sin(a) * len * 0.5 + len * 0.3;
      ctx.strokeStyle = i % 2 ? '#2a9a60' : '#146b41';
      ctx.lineWidth = Math.max(1.2, h * 0.042);
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(
        (topX + ex) / 2, (topY + ey) / 2 - len * 0.3,
        ex, ey
      );
      ctx.stroke();
    }
    ctx.fillStyle = '#50341e';
    ctx.beginPath();
    ctx.arc(topX - h * 0.02, topY + h * 0.02, Math.max(1, h * 0.025), 0, TAU);
    ctx.arc(topX + h * 0.03, topY + h * 0.04, Math.max(1, h * 0.022), 0, TAU);
    ctx.fill();
  }

  function drawBushSprite(x, y, scale, bush) {
    const r = Math.max(1.5, scale * 1.6 * bush.scale);
    if (r < 2) return;
    ctx.fillStyle = '#15583c';
    ctx.beginPath();
    ctx.arc(x - r * 0.8, y - r * 0.55, r * 0.8, 0, TAU);
    ctx.arc(x + r * 0.7, y - r * 0.5, r * 0.75, 0, TAU);
    ctx.arc(x, y - r * 0.9, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#1d714b';
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 1.1, r * 0.55, 0, TAU);
    ctx.arc(x + r * 0.5, y - r * 0.7, r * 0.45, 0, TAU);
    ctx.fill();
  }

  function drawGantry(sp) {
    const { lb, lt, rb, rt, l2b, r2b } = sp;
    ctx.strokeStyle = '#1c1e38';
    ctx.lineWidth = Math.max(2, sp.scale * 1.3);
    ctx.beginPath();
    ctx.moveTo(lb.x, lb.y);
    ctx.lineTo(lt.x, lt.y);
    ctx.moveTo(rb.x, rb.y);
    ctx.lineTo(rt.x, rt.y);
    ctx.stroke();

    ctx.strokeStyle = '#ffd76c';
    ctx.lineWidth = Math.max(1, sp.scale * 0.32);
    ctx.beginPath();
    ctx.moveTo(lb.x, lb.y);
    ctx.lineTo(lt.x, lt.y);
    ctx.moveTo(rb.x, rb.y);
    ctx.lineTo(rt.x, rt.y);
    ctx.stroke();

    quad(lt, rt, r2b, l2b, '#1b1e3c');
    ctx.strokeStyle = 'rgba(255,215,108,0.8)';
    ctx.lineWidth = Math.max(1, sp.scale * 0.25);
    ctx.beginPath();
    ctx.moveTo(lt.x, lt.y);
    ctx.lineTo(rt.x, rt.y);
    ctx.moveTo(l2b.x, l2b.y);
    ctx.lineTo(r2b.x, r2b.y);
    ctx.stroke();

    const mx = (lt.x + rt.x) / 2;
    const my = (lt.y + rt.y + l2b.y + r2b.y) / 4;
    const ang = Math.atan2(rt.y - lt.y, rt.x - lt.x);
    const width = Math.hypot(rt.x - lt.x, rt.y - lt.y);
    if (width > 30 && width < W * 2) {
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(ang);
      ctx.fillStyle = '#ffd76c';
      ctx.font = `900 ${Math.max(6, width * 0.085)}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SUNSET CIRCUIT', 0, 0);
      ctx.restore();
    }
  }

  function collectSprites(v) {
    const out = [];
    const focusS = game.state === 'title'
      ? (karts[game.demoIdx] ? karts[game.demoIdx].s : 60)
      : player.s;

    for (const k of karts) {
      if (k.isPlayer && game.state === 'title') continue;
      const p = trackPos(k.s, k.lat);
      const pr = projectPoint(p.x, p.y, p.z, v);
      if (pr.depth < 3 || pr.depth > 540) continue;
      if (pr.x < -W * 0.5 || pr.x > W * 1.5) continue;
      out.push({ kind: 'kart', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, kart: k });
    }

    for (const box of boxes) {
      if (!box.alive) continue;
      const p = trackPos(box.s, box.lat);
      const pr = projectPoint(p.x, p.y, p.z, v);
      if (pr.depth < 3 || pr.depth > 460) continue;
      out.push({ kind: 'box', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, box });
    }

    for (const b of bananas) {
      const p = trackPos(b.s, b.lat);
      const pr = projectPoint(p.x, p.y, p.z, v);
      if (pr.depth < 3 || pr.depth > 440) continue;
      out.push({ kind: 'banana', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, banana: b });
    }

    for (const s of shells) {
      const p = trackPos(s.s, s.lat);
      const pr = projectPoint(p.x, p.y, p.z, v);
      if (pr.depth < 3 || pr.depth > 460) continue;
      out.push({ kind: 'shell', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, shell: s });
    }

    for (const t of trees) {
      const pr = projectPoint(t.x, t.y, t.z, v);
      if (pr.depth < 3 || pr.depth > 520) continue;
      if (pr.x < -W * 0.6 || pr.x > W * 1.6) continue;
      out.push({ kind: 'palm', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, tree: t });
    }

    for (const b of bushes) {
      const pr = projectPoint(b.x, b.y, b.z, v);
      if (pr.depth < 3 || pr.depth > 420) continue;
      if (pr.x < -W * 0.6 || pr.x > W * 1.6) continue;
      out.push({ kind: 'bush', depth: pr.depth, x: pr.x, y: pr.y, scale: pr.scale, bush: b });
    }

    if (near(focusS, 0, 300, L)) {
      const info = sampleInfo(0);
      const nx = Math.cos(info.ang), nz = -Math.sin(info.ang);
      const half = info.half + 3;
      const lp = trackPos(0, -half), rp = trackPos(0, half);
      const lb = projectPoint(lp.x, lp.y, lp.z, v);
      const rb = projectPoint(rp.x, rp.y, rp.z, v);
      const lt = projectPoint(lp.x, lp.y + 10.8, lp.z, v);
      const rt = projectPoint(rp.x, rp.y + 10.8, rp.z, v);
      const l2b = projectPoint(lp.x, lp.y + 8.4, lp.z, v);
      const r2b = projectPoint(rp.x, rp.y + 8.4, rp.z, v);
      if (lb.depth > 2 && rb.depth > 2 && lt.depth > 2 && rt.depth > 2) {
        out.push({
          kind: 'gantry', depth: (lb.depth + rb.depth) / 2,
          lb, rb, lt, rt, l2b, r2b, scale: v.focal / ((lb.depth + rb.depth) / 2)
        });
      }
    }

    out.sort((a, b) => b.depth - a.depth);
    return out;
  }

  function drawSprites(v) {
    const list = collectSprites(v);
    for (const sp of list) {
      if (sp.x < -300 || sp.x > W + 300) continue;
      if (sp.kind === 'kart') drawKartSprite(sp.x, sp.y, sp.scale, sp.kart);
      else if (sp.kind === 'box') drawBoxSprite(sp.x, sp.y, sp.scale, sp.box);
      else if (sp.kind === 'banana') drawBananaSprite(sp.x, sp.y, sp.scale, sp.banana);
      else if (sp.kind === 'shell') drawShellSprite(sp.x, sp.y, sp.scale, sp.shell);
      else if (sp.kind === 'palm') drawPalmSprite(sp.x, sp.y, sp.scale, sp.tree);
      else if (sp.kind === 'bush') drawBushSprite(sp.x, sp.y, sp.scale, sp.bush);
      else if (sp.kind === 'gantry') drawGantry(sp);
    }
  }

  // ---------------------------------------------------------------- render
  function drawFog(v) {
    const hz = v.horizon;
    const g = ctx.createLinearGradient(0, hz - 8, 0, hz + H * 0.22);
    g.addColorStop(0, 'rgba(255,156,112,0.30)');
    g.addColorStop(0.5, 'rgba(255,156,112,0.10)');
    g.addColorStop(1, 'rgba(255,156,112,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, hz - 8, W, H * 0.22 + 8);
  }

  function drawSpeedLines() {
    const boosting = game.state === 'race' && player && (player.boost > 0 || player.speed > 138);
    if (!boosting) return;
    const n = 18;
    ctx.save();
    ctx.globalAlpha = player.boost > 0 ? 0.16 : 0.07;
    ctx.strokeStyle = '#fff8e0';
    ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      const r0 = Math.min(W, H) * rand(0.5, 0.62);
      const r1 = r0 + rand(35, 110);
      const cx = W / 2, cy = H * 0.55;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.6);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(W / 2, H * 0.52, Math.min(W, H) * 0.32, W / 2, H * 0.52, Math.max(W, H) * 0.78);
    g.addColorStop(0, 'rgba(5,7,22,0)');
    g.addColorStop(0.72, 'rgba(5,7,22,0.12)');
    g.addColorStop(1, 'rgba(5,7,22,0.46)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.14);
    top.addColorStop(0, 'rgba(5,7,22,0.28)');
    top.addColorStop(1, 'rgba(5,7,22,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, H * 0.14);
  }

  function render(dt) {
    const v = computeView(dt);
    game.lastView = v;
    drawSky(v);
    drawGround(v);
    drawRoad(v);
    drawSprites(v);
    drawFog(v);
    drawParticles();
    drawSpeedLines();
    drawVignette();
  }
  // ---------------------------------------------------------------- hud
  function setText(el, txt) {
    if (el.textContent !== String(txt)) el.textContent = String(txt);
  }

  function updateHUD() {
    if (!player) return;
    setText(lapNum, Math.min(player.laps + 1, 3));
    const place = game.playerPlace;
    setText(posNum, place);
    setText(posSuf, place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th');
    const t = game.state === 'finished' ? player.finishTime : game.raceTime;
    setText(raceTimeEl, fmtTime(t));
    const kmh = Math.round(player.speed * 1.9);
    setText(speedNum, kmh);
    speedFill.style.width = clamp((player.speed / 168) * 100, 0, 100) + '%';
    const drift = player.drifting ? clamp(player.driftTime / 1.5, 0, 1) : 0;
    driftFill.style.width = (drift * 100) + '%';
    driftFill.style.background = player.driftTime > 1.45
      ? 'linear-gradient(90deg,#ff5a3d,#ffb03d)'
      : player.driftTime > 0.72
        ? 'linear-gradient(90deg,#63f0ff,#ffe45e)'
        : 'linear-gradient(90deg,#45e0ff,#ffc84a,#ff4d8d)';
  }

  function drawMinimap() {
    mctx.clearRect(0, 0, 180, 180);
    mctx.lineCap = 'round';
    mctx.lineJoin = 'round';
    mctx.beginPath();
    for (let i = 0; i < miniPath.length; i++) {
      const p = miniPath[i];
      if (i === 0) mctx.moveTo(p.x, p.y);
      else mctx.lineTo(p.x, p.y);
    }
    mctx.closePath();
    mctx.strokeStyle = 'rgba(5,8,24,0.55)';
    mctx.lineWidth = 11;
    mctx.stroke();
    mctx.strokeStyle = 'rgba(255,246,232,0.9)';
    mctx.lineWidth = 4.5;
    mctx.stroke();
    mctx.strokeStyle = 'rgba(69,224,255,0.35)';
    mctx.lineWidth = 2;
    mctx.stroke();

    const start = miniPath[0];
    mctx.fillStyle = '#ff4d8d';
    mctx.beginPath();
    mctx.arc(start.x, start.y, 3.2, 0, TAU);
    mctx.fill();

    for (const k of karts) {
      if (k.isPlayer && game.state === 'title') continue;
      const info = sampleInfo(k.s);
      const p = miniPos(info);
      mctx.beginPath();
      mctx.arc(p.x, p.y, k.isPlayer ? 4.6 : 3.3, 0, TAU);
      mctx.fillStyle = k.color;
      mctx.fill();
      mctx.strokeStyle = k.isPlayer ? '#fff6e8' : 'rgba(5,8,24,0.7)';
      mctx.lineWidth = k.isPlayer ? 2.4 : 1.3;
      mctx.stroke();
      if (k.isPlayer && game.state !== 'title') {
        mctx.beginPath();
        mctx.arc(p.x, p.y, 8 + Math.sin(game.time * 4) * 1.5, 0, TAU);
        mctx.strokeStyle = 'rgba(69,224,255,0.5)';
        mctx.lineWidth = 1.2;
        mctx.stroke();
      }
    }
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = 1.9;
  }

  // ---------------------------------------------------------------- flow
  function showCountdown(label) {
    countdownEl.textContent = label;
    countdownEl.className = 'countdown';
    void countdownEl.offsetWidth;
    countdownEl.classList.add('pop');
    if (label === 'GO!') countdownEl.classList.add('go');
  }

  function updateCountdown(dt) {
    game.countdown -= dt;
    const c = game.countdown;
    let label = '';
    if (c > 0.8) label = String(Math.ceil(c - 0.8));
    else if (c > 0) label = 'GO!';

    if (label && label !== game.lastLabel) {
      game.lastLabel = label;
      showCountdown(label);
      sfx.beep(label === 'GO!');
      if (label === 'GO!') {
        game.state = 'race';
        game.goFade = 0.85;
        game.raceTime = 0;
        game.playerPlace = computePlace();
        for (const k of karts) { k.lapStart = 0; k.bestLap = null; }
        if (readInput().gas) {
          player.boost = 0.95;
          toast('ROCKET START!');
          sfx.boost();
        }
      }
    }
    updateEngine(0, readInput().gas, 0);
    updateParticles(dt);
    game.shake = Math.max(0, game.shake - dt * 3);
  }

  function updateRace(dt) {
    if (game.goFade > 0) {
      game.goFade -= dt;
      if (game.goFade <= 0) countdownEl.className = 'countdown';
    }
    game.raceTime += dt;
    const p = player;
    updatePlayer(p, dt);
    for (const k of karts) if (!k.isPlayer) updateAI(k, dt);
    kartCollisions();
    checkBoxes();
    for (const k of karts) checkPads(k);
    updateItems(dt);
    if (game.state === 'race') game.playerPlace = computePlace();
    updateParticles(dt);
    game.shake = Math.max(0, game.shake - dt * 2.8);
  }

  function updateAttract(dt) {
    for (const k of karts) if (!k.isPlayer) updateAI(k, dt);
    updateParticles(dt);
    game.shake = Math.max(0, game.shake - dt * 3);
    updateEngine(0, false, 0);
  }

  function updateFinished(dt) {
    if (game.finishDelay > 0) {
      game.finishDelay -= dt;
      if (game.finishDelay <= 0) showResults();
    }
    for (const k of karts) k.speed *= Math.pow(0.25, dt);
    updateParticles(dt);
    game.shake = Math.max(0, game.shake - dt * 3);
    updateEngine(0, false, 0);
  }

  function showResults() {
    if (game.resultsShown) return;
    game.resultsShown = true;
    game.playerPlace = computePlace();
    const place = game.playerPlace;
    const order = computeOrder();

    hud.classList.add('is-hidden');
    overlay.classList.remove('is-hidden');
    titlePanel.classList.add('is-hidden');
    resultsPanel.classList.remove('is-hidden');

    resultPlace.textContent = ordinal(place);
    resultsKicker.textContent = `Race complete · ${fmtTime(player.finishTime)} · Best lap ${fmtTime(player.bestLap)}`;

    const copy = {
      1: ['Trophy secured!', 'The item boxes fear you.'],
      2: ['So close!', 'One more mushroom would have done it.'],
      3: ['On the podium.', 'Style points for the drifting.'],
      4: ['Just off the podium.', 'The banana got its revenge.'],
      5: ['Mid-pack hero.', 'At least the sunset was nice.'],
      6: ['Character building.', 'Try holding the gas at GO next time.']
    }[place] || ['Race complete.', 'What a race.'];
    resultTitle.textContent = copy[0];
    resultSub.textContent = copy[1];

    const progress = (k) => k.laps * L + k.s;
    const playerProgress = progress(player);
    standingsEl.innerHTML = order.map((k, i) => {
      let time;
      if (k.finished) {
        time = fmtTime(k.finishTime);
      } else {
        const gap = Math.max(0, playerProgress - progress(k));
        time = `+${Math.max(0.1, gap / Math.max(60, player.speed || 100)).toFixed(1)}s`;
      }
      return `<div class="standing ${k.isPlayer ? 'you' : ''}">
        <span class="rank">${i + 1}</span>
        <span class="chip" style="background:${k.color};color:${k.color}"></span>
        <span class="who">${k.isPlayer ? 'YOU' : k.name}</span>
        <span class="time">${time}</span>
      </div>`;
    }).join('');
  }

  function startRace() {
    initAudio();
    updateMute();
    resetRace();
    game.state = 'countdown';
    game.countdown = 3.8;
    game.lastLabel = '';
    overlay.classList.add('is-hidden');
    resultsPanel.classList.add('is-hidden');
    titlePanel.classList.remove('is-hidden');
    hud.classList.remove('is-hidden');
    hud.setAttribute('aria-hidden', 'false');
    if (isCoarse) {
      touchWrap.classList.remove('is-hidden');
      touchWrap.setAttribute('aria-hidden', 'false');
    }
    countdownEl.className = 'countdown';
    countdownEl.textContent = '';
    game.camH = sampleInfo(player.s).ang;
    game.prevCamH = game.camH;
    lastFrame = performance.now();
  }

  function showMenu() {
    resetRace();
    game.state = 'title';
    overlay.classList.remove('is-hidden');
    titlePanel.classList.remove('is-hidden');
    resultsPanel.classList.add('is-hidden');
    hud.classList.add('is-hidden');
    touchWrap.classList.add('is-hidden');
    countdownEl.className = 'countdown';
    countdownEl.textContent = '';
  }

  // ---------------------------------------------------------------- boot
  startBtn.addEventListener('click', () => { initAudio(); startRace(); });
  againBtn.addEventListener('click', () => startRace());
  menuBtn.addEventListener('click', () => showMenu());
  muteBtn.addEventListener('click', () => {
    initAudio();
    muted = !muted;
    updateMute();
  });

  let lastFrame = performance.now();
  let paused = false;

  function frame(now) {
    const dt = Math.min(0.045, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    game.time += dt;

    if (!paused) {
      if (game.state === 'title') updateAttract(dt);
      else if (game.state === 'countdown') updateCountdown(dt);
      else if (game.state === 'race') updateRace(dt);
      else if (game.state === 'finished') updateFinished(dt);
    }

    itemQueued = false;
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toastEl.classList.remove('show');
    }

    render(dt);
    if (game.state !== 'title') updateHUD();
    drawMinimap();
    requestAnimationFrame(frame);
  }

  showMenu();
  updateMute();
  drawMinimap();
  requestAnimationFrame(frame);

  function debugSim(dt = 1 / 60, steps = 1) {
    for (let i = 0; i < steps; i++) {
      game.time += dt;
      if (game.state === 'title') updateAttract(dt);
      else if (game.state === 'countdown') updateCountdown(dt);
      else if (game.state === 'race') updateRace(dt);
      else if (game.state === 'finished') updateFinished(dt);
      itemQueued = false;
      if (toastTimer > 0) {
        toastTimer -= dt;
        if (toastTimer <= 0) toastEl.classList.remove('show');
      }
    }
  }

  function debugTick(dt = 1 / 60, steps = 1) {
    debugSim(dt, steps);
    render(dt);
    if (game.state !== 'title') updateHUD();
    drawMinimap();
  }

  // Debug / test hooks
  window.__turbo = {
    tick: debugTick,
    sim: debugSim,
    setKey: (code, down) => { keys[code] = !!down; },
    queueItem: () => { itemQueued = true; },
    renderNow: () => render(1 / 60),
    setPaused: (v) => { paused = !!v; lastFrame = performance.now(); },
    projectPoint,
    trackPos,
    sampleAt: sampleInfo,
    trackLength: L,
    game,
    startRace,
    showMenu,
    get player() { return player; },
    get karts() { return karts; },
    get boxes() { return boxes; },
    get bananas() { return bananas; },
    get shells() { return shells; },
    useItem,
    spinOut
  };
})();
