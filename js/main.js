import { Game } from './game.js';
import { Input } from './input.js';
import { AudioSys } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const input = new Input(canvas);
const audio = new AudioSys();
input.onGesture(() => audio.ensure());

const game = new Game(canvas, ctx, input, audio);
window.__game = game;

// Mouse / touch on the play area doubles as a confirm button.
canvas.addEventListener('pointerdown', () => {
  if (game.mode === 'title') {
    game.startRun();
  } else if (game.mode === 'dead' && game.deathTimer > 0.9) {
    game.respawn();
  } else if (game.mode === 'victory' && game.victoryTime > 1.4) {
    game.startRun();
  } else if (game.mode === 'message') {
    input.pressed.add('interact');
  } else if (game.mode === 'reward') {
    input.pressed.add('attack');
  } else if (game.mode === 'paused') {
    input.pressed.add('pause');
  }
});

const params = new URLSearchParams(window.location.search);
const debug = params.get('debug');
if (debug) {
  game.debugStart(debug);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.mode === 'playing') game.togglePause();
});

let last = performance.now();
function frame(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05;
  if (dt < 0) dt = 0;
  game.update(dt);
  game.render();
  input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
