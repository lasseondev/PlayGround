import './style.css';
import * as THREE from 'three';
import { createWorld } from './world.js';
import { Game } from './game.js';
import { AudioEngine } from './audio.js';
import { Input } from './input.js';

// ------------------------------- Renderer ---------------------------------

const canvas = document.getElementById('game');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false,
  });
} catch (error) {
  document.body.innerHTML = '<div style="display:grid;place-items:center;height:100%;font-family:sans-serif;background:#62c8ff;color:#10274a;text-align:center;padding:24px"><div><h1>WebGL is required</h1><p>Please open this game in a modern browser with hardware acceleration enabled.</p></div></div>';
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 520);
camera.position.set(15, 9, 17);

const world = createWorld(scene);
const audio = new AudioEngine();

const $ = (id) => document.getElementById(id);
const el = {
  hud: $('hud'),
  hearts: [...document.querySelectorAll('#hearts .heart')],
  coinCount: $('coin-count'),
  coinTotal: $('coin-total'),
  coinCounter: $('coin-counter'),
  starCount: $('star-count'),
  timer: $('timer'),
  toast: $('toast'),
  bossBar: $('boss-bar'),
  bossFill: $('boss-fill'),
  title: $('title-screen'),
  pause: $('pause-screen'),
  win: $('win-screen'),
  lose: $('lose-screen'),
  touch: $('touch-controls'),
  hint: $('hint'),
  muteBtn: $('mute-btn'),
  pauseBtn: $('pause-btn'),
  playBtn: $('play-btn'),
  resumeBtn: $('resume-btn'),
  restartBtn: $('restart-btn'),
  againBtn: $('again-btn'),
  retryBtn: $('retry-btn'),
  loseRestartBtn: $('lose-restart-btn'),
  resultCoins: $('result-coins'),
  resultTime: $('result-time'),
  resultStars: $('result-stars'),
  resultRank: $('result-rank'),
  resultStarIcons: $('result-star-icons'),
  resultStarEls: [...document.querySelectorAll('#result-star-icons .result-star')],
};

let toastTimer = null;
let hintTimer = null;
let flashEl = null;
let previousHearts = 3;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${m}:${String(s).padStart(2, '0')}.${tenths}`;
}

function formatTimeShort(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function pulse(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), 500);
}

const ui = {
  setHearts(hearts, maxHearts) {
    el.hearts.forEach((heart, index) => {
      const active = index < hearts;
      heart.classList.toggle('is-empty', !active);
      if (!active && index < previousHearts) pulse(heart, 'is-hit');
    });
    previousHearts = hearts;
  },
  setCoins(count, total, animate = true) {
    el.coinCount.textContent = count;
    el.coinTotal.textContent = total;
    if (animate) {
      el.coinCounter.classList.remove('is-pop');
      void el.coinCounter.offsetWidth;
      el.coinCounter.classList.add('is-pop');
      setTimeout(() => el.coinCounter.classList.remove('is-pop'), 300);
    }
  },
  setStars(count, total) {
    el.starCount.textContent = `${count}/${total}`;
  },
  setTime(seconds) {
    el.timer.textContent = formatTime(seconds);
  },
  toast(text, gold = false, duration = 1.6) {
    if (toastTimer) clearTimeout(toastTimer);
    el.toast.textContent = text;
    el.toast.classList.remove('is-hidden', 'is-out');
    el.toast.classList.toggle('is-gold', gold);
    toastTimer = setTimeout(() => {
      el.toast.classList.add('is-out');
      toastTimer = setTimeout(() => el.toast.classList.add('is-hidden'), 300);
    }, duration * 1000);
  },
  showBoss(hp, maxHp) {
    el.bossBar.classList.remove('is-hidden');
    ui.bossHealth(hp, maxHp);
  },
  bossHealth(hp, maxHp) {
    el.bossFill.style.width = `${Math.max(0, (hp / maxHp) * 100)}%`;
  },
  hideBoss() {
    el.bossBar.classList.add('is-hidden');
  },
  flash(color = '#ffffff', strength = 0.4) {
    if (!flashEl) {
      flashEl = document.createElement('div');
      flashEl.className = 'screen-flash';
      document.getElementById('app').appendChild(flashEl);
    }
    flashEl.style.background = color;
    flashEl.style.transition = 'none';
    flashEl.style.opacity = String(strength);
    void flashEl.offsetWidth;
    flashEl.style.transition = 'opacity 420ms ease-out';
    flashEl.style.opacity = '0';
  },
  hideScreens() {
    el.title.classList.add('is-hidden');
    el.pause.classList.add('is-hidden');
    el.win.classList.add('is-hidden');
    el.lose.classList.add('is-hidden');
  },
  hidePause() {
    el.pause.classList.add('is-hidden');
  },
  showGameplay() {
    el.hud.classList.remove('is-hidden');
    if (input.usingTouch) el.touch.classList.remove('is-hidden');
    el.hint.classList.remove('is-faded');
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.hint.classList.add('is-faded'), 9000);
  },
  showPause() {
    el.pause.classList.remove('is-hidden');
  },
  showWin(stats) {
    el.resultCoins.textContent = `${stats.coins} / ${stats.coinTotal}`;
    el.resultTime.textContent = formatTimeShort(stats.time);
    el.resultStars.textContent = `${stats.stars} / ${stats.starTotal}`;
    el.resultRank.textContent = stats.rank;
    el.resultStarEls.forEach((star, index) => {
      star.classList.toggle('is-earned', index < stats.earned);
    });
    el.win.classList.remove('is-hidden');
    el.touch.classList.add('is-hidden');
  },
  showLose() {
    el.lose.classList.remove('is-hidden');
    el.touch.classList.add('is-hidden');
  },
};

const input = new Input(canvas, {
  onOrbit: (dx, dy) => game.orbit(dx, dy),
  onZoom: (dir) => game.zoom(dir),
  onPause: () => {
    if (game.status === 'playing') game.pause();
    else if (game.status === 'paused') game.resume();
  },
  onMute: () => toggleMute(),
  onRestart: () => {
    if (game.status === 'playing' || game.status === 'paused') {
      game.restart();
      el.touch.classList.add('is-hidden');
      if (input.usingTouch) el.touch.classList.remove('is-hidden');
    }
  },
  onEnter: () => {
    if (game.status === 'title') startGame();
    else if (game.status === 'paused') game.resume();
    else if (game.status === 'won') game.start();
    else if (game.status === 'lost') game.retryCheckpoint();
  },
});

const game = new Game({ scene, camera, renderer, world, audio, input, ui });

// ------------------------------- UI wiring --------------------------------

function startGame() {
  if (game.status === 'playing') return;
  audio.init();
  audio.click();
  game.start();
}

el.playBtn.addEventListener('click', startGame);
el.resumeBtn.addEventListener('click', () => { audio.click(); game.resume(); });
el.restartBtn.addEventListener('click', () => { audio.click(); game.restart(); });
el.againBtn.addEventListener('click', () => { audio.click(); game.start(); });
el.retryBtn.addEventListener('click', () => { audio.click(); game.retryCheckpoint(); });
el.loseRestartBtn.addEventListener('click', () => { audio.click(); game.restart(); });
el.pauseBtn.addEventListener('click', () => {
  if (game.status === 'playing') game.pause();
  else if (game.status === 'paused') game.resume();
});

function toggleMute() {
  audio.init();
  const muted = !audio.muted;
  audio.setMuted(muted);
  el.muteBtn.classList.toggle('is-muted', muted);
  el.muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  try { localStorage.setItem('cloudhop-muted', muted ? '1' : '0'); } catch { /* ignore */ }
}

el.muteBtn.addEventListener('click', toggleMute);

try {
  if (localStorage.getItem('cloudhop-muted') === '1') {
    audio.muted = true;
    el.muteBtn.classList.add('is-muted');
  }
} catch { /* ignore */ }

// Pause when the tab loses focus during play.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.status === 'playing') game.pause();
});

// -------------------------------- Resize ----------------------------------

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height);
}
window.addEventListener('resize', onResize);

// -------------------------------- Loop ------------------------------------

const clock = new THREE.Clock();
let firstFrame = true;

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (game.status !== 'paused') game.update(dt);
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    document.body.classList.add('is-ready');
  }
}

// Render one frame immediately so the title screen never shows a blank canvas.
game.update(1 / 60);
renderer.render(scene, camera);
frame();

// Expose a tiny debug handle for automated verification.
window.__cloudHop = {
  game,
  world,
  get state() {
    return {
      status: game.status,
      pos: game.player.pos.toArray(),
      grounded: game.player.grounded,
      coins: game.coins,
      hearts: game.hearts,
      stars: game.stars,
      time: game.timer,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    };
  },
  start: startGame,
  setInput: (keys) => {
    input.keys.clear();
    for (const key of keys) input.keys.add(key);
  },
  jump: () => { input.jumpQueued = true; },
  teleport: (x, y, z) => {
    game.player.pos.set(x, y, z);
    game.player.vel.set(0, 0, 0);
    game.player.grounded = false;
  },
};
