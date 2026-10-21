import * as THREE from './vendor/three.module.js';
window.THREE = THREE;
import { Game } from './game.js';

const container = document.getElementById('game');
const game = new Game(container);
game.start();
window.game = game;
