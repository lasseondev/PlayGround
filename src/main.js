import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Arena } from './arena.js';
import { Boss, BOSS_ORDER } from './boss.js';
import { Effects } from './effects.js';
import { Input } from './input.js';
import { Player } from './player.js';
import { Soundscape } from './audio.js';
import { clamp, damp, lerp, makeEnvironmentTexture } from './assets.js';

const $ = (id) => document.getElementById(id);
const formatTime = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

class Game {
  constructor() {
    this.canvas = $('scene');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    const gl = this.renderer.getContext();
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    this.softwareRenderer = /swiftshader|llvmpipe|software/i.test(debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : '');
    this.renderScale = this.softwareRenderer ? 0.8 : Math.min(window.devicePixelRatio || 1, 1.6);
    this.renderer.setPixelRatio(this.renderScale);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080a0f, 0.014);
    this.scene.environment = makeEnvironmentTexture();
    this.scene.environmentIntensity = 0.52;
    this.camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 240);
    this.camera.position.set(0, 4, 17);

    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(this.renderScale);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(Math.floor(window.innerWidth * 0.62), Math.floor(window.innerHeight * 0.62)), 0.5, 0.72, 0.86);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.clock = new THREE.Clock();
    this.time = 0;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.16;
    this.cameraDistance = 6.35;
    this.shake = 0;
    this.fovKick = 0;
    this.state = 'menu';
    this.runTime = 0;
    this.parryCount = 0;
    this.deaths = 0;
    this.act = 1;
    this.boss = null;
    this.bossKind = 'warden';
    this.toastTimer = 0;
    this.deathTimer = 0;
    this.transitionTimer = 0;
    this.introTimer = 0;
    this.timeScale = 1;
    this.hitstopTimer = 0;
    this.slowTimer = 0;
    this.slowScale = 1;
    this.menuTime = 0;
    this.hitFlashTimer = 0;
    this.parryFlashTimer = 0;
    this.lastDamage = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.bossMaxHp = 1;
    this._parryAnchor = new THREE.Vector3();
    this._parryCenter = new THREE.Vector3();

    this.ui = {
      hud: $('hud'), menu: $('menu'), intro: $('bossIntro'), death: $('deathScreen'), victory: $('victoryScreen'), pause: $('pauseScreen'),
      bossPlate: $('bossPlate'), bossName: $('bossName'), bossEpithet: $('bossEpithet'), bossHp: $('bossHp'), bossHpGhost: $('bossHpGhost'),
      bossPhase: $('bossPhase'), bossStagger: $('bossStagger'), actNumber: $('actNumber'), actName: $('actName'),
      timer: $('timer'), parryCount: $('parryCount'), hpBar: $('hpBar'), hpGhost: $('hpGhost'), hpText: $('hpText'),
      staminaBar: $('staminaBar'), flasks: $('flasks'), playerSigil: $('playerSigil'), reticle: $('reticle'),
      parryPrompt: $('parryPrompt'), toast: $('toast'), combo: $('combo'), comboNum: $('comboNum'),
      lockBadge: $('lockBadge'), bossOffscreen: $('bossOffscreen'), damageFlash: $('damageFlash'), parryFlash: $('parryFlash'),
      introAct: $('introAct'), introName: $('introName'), introEpithet: $('introEpithet'),
      finalTime: $('finalTime'), finalParries: $('finalParries'), finalDeaths: $('finalDeaths'), finalRank: $('finalRank'),
      deathTip: $('deathTip'), bestRun: $('bestRun'), boot: $('boot'),
    };

    this.setupLights();
    this.audio = new Soundscape();
    this.effects = new Effects(this.scene);
    this.arena = new Arena(this.scene);
    this.input = new Input(this.canvas);
    document.body.classList.toggle('touch', this.input.touchActive);
    const parryHint = this.ui.parryPrompt.querySelector('small');
    if (parryHint && this.input.touchActive) parryHint.textContent = 'TAP PARRY';
    const pauseHint = document.querySelector('.pause-hint');
    if (pauseHint && this.input.touchActive) pauseHint.textContent = 'TAP PARRY · TAP ROLL · TAP FLASK · DRAG TO LOOK';
    this.player = new Player(this.scene, this.effects, this.audio, this);
    this.spawnBoss('warden', true);
    this.boss.think = 999;
    this.boss.cooldown = 999;
    this.player.root.visible = true;
    this.bindUI();
    this.bindResize();
    this.updateHUD();
    this.updateBestRun();
    this.loadBestRun();

    this.state = 'menu';
    this.input.enabled = true;
    this.clock.start();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
    setTimeout(() => this.ui.boot.classList.add('is-done'), 500);
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0x6a7ba4, 0x17120f, 1.55);
    this.scene.add(hemi);
    const moon = new THREE.DirectionalLight(0xc1d2f2, 2.5);
    moon.position.set(-26, 34, -18);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.left = -34;
    moon.shadow.camera.right = 34;
    moon.shadow.camera.top = 38;
    moon.shadow.camera.bottom = -22;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 90;
    moon.shadow.bias = -0.0004;
    moon.shadow.normalBias = 0.04;
    this.scene.add(moon);
    this.moon = moon;

    const fill = new THREE.DirectionalLight(0x7e98c4, 1.35);
    fill.position.set(14, 16, 26);
    this.scene.add(fill);

    const warmFill = new THREE.DirectionalLight(0x9a6038, 0.75);
    warmFill.position.set(-16, 8, 14);
    this.scene.add(warmFill);

    const rim = new THREE.DirectionalLight(0x8fa8d6, 0.65);
    rim.position.set(0, 9, -28);
    this.scene.add(rim);

    const gateGlow = new THREE.PointLight(0x385b8f, 42, 34, 2);
    gateGlow.position.set(0, 13, -28);
    this.scene.add(gateGlow);

    // A soft camera-side key keeps the player's silhouette readable against the dark court.
    this.heroLight = new THREE.DirectionalLight(0xa9c2e8, 1.15);
    this.heroLight.position.set(0, 6, 18);
    this.heroLight.target.position.set(0, 1.2, 4);
    this.scene.add(this.heroLight);
    this.scene.add(this.heroLight.target);
  }

  spawnBoss(kind, initial = false) {
    if (this.boss) this.disposeBoss();
    this.bossKind = kind;
    this.boss = new Boss(this.scene, this.effects, this.audio, this, kind);
    this.boss.spawnAt(new THREE.Vector3(0, 0.36, -2.2));
    this.bossMaxHp = this.boss.maxHp;
    this.act = this.boss.act;
    this.ui.actNumber.textContent = ['', 'I', 'II', 'III'][this.act];
    this.ui.actName.textContent = ['', 'THE FIRST GATE', 'THE HOLLOW VAULT', 'THE LAST THRONE'][this.act];
    this.ui.bossName.textContent = this.boss.name;
    this.ui.bossEpithet.textContent = this.boss.epithet;
    this.ui.bossPhase.textContent = 'PHASE I';
    this.ui.bossStagger.classList.remove('is-on');
    this.ui.bossHp.style.transform = 'scaleX(1)';
    this.ui.bossHpGhost.style.transform = 'scaleX(1)';
    this.ui.bossPlate.classList.add('is-active');
    if (!initial) this.updateBossUI(this.boss);
  }

  disposeBoss() {
    if (!this.boss) return;
    const boss = this.boss;
    for (const p of boss.projectiles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    }
    for (const h of boss.hazards) {
      if (h.mesh) { this.scene.remove(h.mesh); h.mesh.geometry.dispose(); h.mesh.material.dispose(); }
      if (h.ring) { this.scene.remove(h.ring); h.ring.geometry.dispose(); h.ring.material.dispose(); }
    }
    this.scene.remove(boss.root);
    boss.root.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material?.dispose();
      }
    });
    this.boss = null;
  }

  bindUI() {
    $('startBtn').addEventListener('click', () => this.startRun());
    $('retryBtn').addEventListener('click', () => this.retryBoss());
    $('againBtn').addEventListener('click', () => this.startRun());
    $('quitBtn').addEventListener('click', () => this.returnToMenu());
    $('victoryQuitBtn').addEventListener('click', () => this.returnToMenu());
    $('pauseQuitBtn').addEventListener('click', () => this.returnToMenu());
    $('resumeBtn').addEventListener('click', () => this.resume());
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.state === 'playing') this.pause();
      else if (e.code === 'Escape' && this.state === 'paused') this.resume();
      else if (e.code === 'Enter' && this.state === 'menu') this.startRun();
      else if ((e.code === 'KeyR' || e.code === 'Enter') && this.state === 'dead') this.retryBoss();
      else if (e.code === 'Enter' && this.state === 'victory') this.startRun();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause();
    });
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.composer.setSize(w, h);
      this.bloom.setSize(Math.max(320, Math.floor(w * 0.62)), Math.max(180, Math.floor(h * 0.62)));
    });
  }

  async startRun() {
    await this.audio.init();
    this.audio.ui();
    this.input.enabled = true;
    this.ui.menu.classList.remove('is-active');
    this.ui.death.classList.remove('is-active');
    this.ui.victory.classList.remove('is-active');
    this.ui.pause.classList.remove('is-active');
    this.ui.hud.classList.remove('is-hidden');
    document.body.classList.add('playing');
    this.input.flush();
    this.runTime = 0;
    this.parryCount = 0;
    this.deaths = 0;
    this.combo = 0;
    this.player.reset();
    this.player.pos.set(0, 0.36, 7.0);
    this.player.yaw = Math.PI;
    this.player.root.visible = true;
    this.player.lockOn = false;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.14;
    this.spawnBoss('warden');
    this.boss.spawnAt(new THREE.Vector3(0, 0.36, -2.2));
    this.state = 'playing';
    this.ui.intro.classList.remove('is-active');
    this.boss.think = 1.0;
    this.boss.cooldown = 1.0;
    this.updateHUD();
    this.updateBossUI(this.boss);
    this.ui.bossPlate.classList.add('is-active');
    this.updateParryCount();
    this.setToast('ACT I — THE FIRST GATE', false, 1.6);
    this.audio.roar(false);
    if (!this.input.touchActive && !document.pointerLockElement) {
      try { this.canvas.requestPointerLock?.(); } catch { /* pointer lock needs a gesture in some browsers */ }
    }
  }

  beginIntro(duration = 1.7) {
    this.state = 'intro';
    this.introTimer = duration;
    this.ui.introAct.textContent = `ACT ${['', 'I', 'II', 'III'][this.act]}`;
    this.ui.introName.textContent = this.boss.name;
    this.ui.introEpithet.textContent = this.boss.epithet;
    this.ui.intro.classList.add('is-active');
    this.player.state = 'idle';
    this.player.stateTime = 0;
  }

  endIntro() {
    this.state = 'playing';
    this.ui.intro.classList.remove('is-active');
    if (this.boss) {
      this.boss.think = 0.8;
      this.boss.cooldown = 0.9;
      this.audio.roar(this.boss.kind === 'king');
    }
  }

  nextBoss() {
    const idx = BOSS_ORDER.indexOf(this.bossKind);
    if (idx >= BOSS_ORDER.length - 1) {
      this.victory();
      return;
    }
    this.audio.ui();
    this.player.restoreAfterBoss();
    this.player.pos.set(0, 0.36, 7.0);
    this.player.yaw = Math.PI;
    this.player.velocity.set(0, 0, 0);
    this.player.root.visible = true;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.14;
    this.spawnBoss(BOSS_ORDER[idx + 1]);
    this.boss.spawnAt(new THREE.Vector3(0, 0.36, -2.2));
    this.boss.think = 999;
    this.ui.bossHp.style.transform = 'scaleX(1)';
    this.ui.bossHpGhost.style.transform = 'scaleX(1)';
    this.beginIntro(1.8);
    this.setToast(`ACT ${['', 'I', 'II', 'III'][this.act]} — ${['', 'THE FIRST GATE', 'THE HOLLOW VAULT', 'THE LAST THRONE'][this.act]}`, false, 1.8);
    this.updateHUD();
    this.updateBossUI(this.boss);
  }

  retryBoss() {
    if (!this.boss) return;
    this.audio.init();
    this.deaths++;
    this.ui.death.classList.remove('is-active');
    this.ui.hud.classList.remove('is-hidden');
    document.body.classList.add('playing');
    this.player.reset();
    this.player.pos.set(0, 0.36, 7.0);
    this.player.yaw = Math.PI;
    this.player.root.visible = true;
    this.player.lockOn = false;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.14;
    this.boss.spawnAt(new THREE.Vector3(0, 0.36, -2.2));
    this.boss.think = 999;
    this.beginIntro(0.75);
    this.updateHUD();
    this.updateBossUI(this.boss);
    this.input.flush();
    this.setToast('RISE AGAIN', false, 1.0);
    if (!this.input.touchActive) {
      try { this.canvas.requestPointerLock?.(); } catch { /* ignore */ }
    }
  }

  returnToMenu() {
    this.input.releasePointer();
    this.input.flush();
    this.ui.death.classList.remove('is-active');
    this.ui.victory.classList.remove('is-active');
    this.ui.pause.classList.remove('is-active');
    this.ui.intro.classList.remove('is-active');
    this.ui.hud.classList.add('is-hidden');
    this.ui.menu.classList.add('is-active');
    this.ui.bossPlate.classList.remove('is-active');
    document.body.classList.remove('playing');
    this.state = 'menu';
    this.spawnBoss('warden');
    this.boss.think = 999;
    this.boss.cooldown = 999;
    this.player.reset();
    this.player.pos.set(0, 0.36, 7.0);
    this.player.yaw = Math.PI;
    this.player.root.visible = true;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.14;
    this.menuTime = 0;
    this.updateBestRun();
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.ui.pause.classList.add('is-active');
    this.input.releasePointer();
    this.input.flush();
    this.audio.ui();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.ui.pause.classList.remove('is-active');
    this.input.flush();
    if (!this.input.touchActive) {
      try { this.canvas.requestPointerLock?.(); } catch { /* ignore */ }
    }
  }

  playerDied() {
    if (this.state === 'dead') return;
    this.state = 'dying';
    this.deathTimer = 1.35;
    this.input.releasePointer();
    this.ui.hud.classList.remove('is-hidden');
    this.audio.death();
  }

  showDeath() {
    this.state = 'dead';
    this.ui.deathTip.textContent = this.parryCount === 0
      ? 'The white glint is the promise. Answer it sooner.'
      : 'Patience is a weapon. Raise your guard, then strike.';
    this.ui.death.classList.add('is-active');
    document.body.classList.remove('playing');
    this.updateBestRun();
  }

  victory() {
    this.state = 'victory';
    this.ui.hud.classList.add('is-hidden');
    this.ui.victory.classList.add('is-active');
    document.body.classList.remove('playing');
    this.input.releasePointer();
    this.audio.victory();
    this.ui.finalTime.textContent = formatTime(this.runTime);
    this.ui.finalParries.textContent = String(this.parryCount);
    this.ui.finalDeaths.textContent = String(this.deaths);
    this.ui.finalRank.textContent = this.rank();
    this.saveBestRun();
    this.updateBestRun();
  }

  rank() {
    const parries = this.parryCount;
    const deaths = this.deaths;
    if (deaths === 0 && parries >= 10) return 'S';
    if (deaths <= 1 && parries >= 6) return 'A';
    if (deaths <= 3) return 'B';
    return 'C';
  }

  hitBoss(damage, poise, player, kind) {
    if (!this.boss || !this.boss.alive) return false;
    this.boss.takeDamage(damage, poise, player, kind);
    this.updateBossUI(this.boss);
    return true;
  }

  bossParried(boss, player) {
    this.parryCount++;
    this.updateParryCount();
    player.stamina = Math.min(player.maxStamina, player.stamina + 18);
    player.parryGlow = 1;
    player.invuln = Math.max(player.invuln, 0.7);
    this.parryFlashTimer = 0.18;
    this.ui.parryFlash.classList.add('hit');
    this.hitStop(0.08);
    this.slowMotion(0.3, 0.35);
    this.cameraShake(0.5);
    this.audio.parry();
    this.effects.flash(new THREE.Vector3(boss.pos.x, 2.4, boss.pos.z), { color: 0xfff0c0, size: 5.2, life: 0.55 });
    this.effects.burst(new THREE.Vector3(boss.pos.x, 2.3, boss.pos.z), { color: 0xffe1a0, count: 60, speed: 8, size: 0.13, gravity: 2, life: 1.0 });
    this.effects.ring(boss.pos, { color: 0xffe1a0, radius: 7, life: 0.8 });
    this.setToast('PARRY', false, 0.8);
    boss.stagger();
    this.updateBossUI(boss);
  }

  bossStaggered(boss) {
    this.ui.bossStagger.classList.add('is-on');
    this.setToast('GUARD BROKEN — STRIKE TO RIPOSTE', false, 1.7);
  }

  bossRecovered(boss) {
    this.ui.bossStagger.classList.remove('is-on');
  }

  bossPhaseTwo(boss) {
    this.ui.bossPhase.textContent = 'PHASE II';
    this.ui.bossPhase.style.color = '#ffb18a';
    this.setToast('THE CROWN REMEMBERS', true, 2.0);
    this.audio.roar(true);
  }

  bossDefeated(boss) {
    this.ui.bossStagger.classList.remove('is-on');
    this.state = 'vanquish';
    this.transitionTimer = 3.2;
    this.setToast('VANQUISHED', false, 2.6);
    this.saveBestRun();
    this.updateBestRun();
  }

  setToast(text, danger = false, duration = 1.2) {
    this.ui.toast.textContent = text;
    this.ui.toast.classList.toggle('is-danger', danger);
    this.ui.toast.classList.add('is-on');
    this.toastTimer = duration;
  }

  updateCombo(n) {
    this.combo = n;
    this.comboTimer = 2.4;
    this.ui.comboNum.textContent = String(n);
    this.ui.combo.classList.toggle('is-on', n >= 2);
  }

  updateParryCount() {
    this.ui.parryCount.textContent = String(this.parryCount);
  }

  updateBossUI(boss) {
    if (!boss) return;
    const ratio = boss.hpRatio;
    this.ui.bossHp.style.transform = `scaleX(${ratio})`;
    this.ui.bossHpGhost.style.transform = `scaleX(${ratio})`;
    if (boss.phase === 2) this.ui.bossPhase.textContent = 'PHASE II';
    this.ui.bossStagger.classList.toggle('is-on', boss.isStaggered);
  }

  updateHUD() {
    const p = this.player;
    this.ui.hpBar.style.transform = `scaleX(${p.hpRatio})`;
    this.ui.hpGhost.style.transform = `scaleX(${p.hpRatio})`;
    this.ui.hpText.textContent = String(Math.ceil(p.hp));
    this.ui.staminaBar.style.transform = `scaleX(${p.staminaRatio})`;
    this.ui.staminaBar.classList.toggle('is-low', p.staminaRatio < 0.25);
    this.ui.playerSigil.classList.toggle('low', p.hpRatio < 0.32);
    const flasks = this.ui.flasks.querySelectorAll('.flask');
    flasks.forEach((f, i) => f.classList.toggle('full', i < p.flasks));
    this.ui.timer.textContent = formatTime(this.runTime);
  }

  playerAttackStarted(heavy) {
    this.fovKick = heavy ? 3.4 : 1.5;
  }

  playerParryStarted() {
    this.fovKick = 0.8;
  }

  playerRiposteStarted(boss) {
    this.fovKick = 4.5;
    this.cameraShake(0.25);
  }

  bossTelegraph(boss, attack) {
    this.fovKick = Math.max(this.fovKick, attack.kind === 'slam' ? 2.2 : 1.1);
  }

  damageFlash() {
    this.hitFlashTimer = 0.22;
    this.ui.damageFlash.classList.add('hit');
    this.lastDamage = this.player.lastDamage;
  }

  cameraShake(amount) {
    this.shake = Math.max(this.shake, amount);
  }

  hitStop(seconds) {
    this.hitstopTimer = Math.max(this.hitstopTimer, seconds);
  }

  slowMotion(scale, seconds) {
    this.slowScale = scale;
    this.slowTimer = Math.max(this.slowTimer, seconds);
  }

  loadBestRun() {
    try {
      this.best = JSON.parse(localStorage.getItem('ashen-vow-best') || 'null');
    } catch { this.best = null; }
  }

  saveBestRun() {
    if (this.state === 'menu') return;
    if (!this.best || this.runTime < this.best.time) {
      this.best = { time: this.runTime, parries: this.parryCount, rank: this.rank() };
      try { localStorage.setItem('ashen-vow-best', JSON.stringify(this.best)); } catch { /* ignore */ }
    }
  }

  updateBestRun() {
    this.loadBestRun();
    this.ui.bestRun.textContent = this.best ? `BEST VOW — ${formatTime(this.best.time)} · ${this.best.rank} RANK` : 'BEST VOW — UNWRITTEN';
  }

  processInput(dt) {
    if (this.state === 'menu') {
      if (this.input.consume('confirm')) this.startRun();
      this.input.flush();
      return;
    }
    if (this.state === 'paused') {
      if (this.input.consume('pause') || this.input.consume('confirm')) this.resume();
      this.input.flush();
      return;
    }
    if (this.state === 'dead') {
      if (this.input.consume('confirm') || this.input.consume('flask')) this.retryBoss();
      this.input.flush();
      return;
    }
    if (this.state === 'victory') {
      if (this.input.consume('confirm')) this.startRun();
      this.input.flush();
      return;
    }
    if (this.state === 'playing') {
      if (this.input.consume('pause')) { this.pause(); return; }
      for (const action of ['attack', 'heavy', 'parry', 'dodge', 'flask', 'lock']) {
        if (this.input.consume(action)) this.player.handleAction(action, this.boss);
      }
    }
  }

  updateCamera(dt) {
    if (this.state === 'menu') {
      this.menuTime += dt;
      const a = 0.45 + this.menuTime * 0.055;
      const r = 15.5;
      const target = new THREE.Vector3(0, 2.2, 0);
      const desired = new THREE.Vector3(Math.cos(a) * r, 4.6 + Math.sin(this.menuTime * 0.25) * 0.3, Math.sin(a) * r);
      this.camera.position.lerp(desired, 1 - Math.exp(-dt * 1.5));
      this.camera.lookAt(target);
      this.camera.fov = damp(this.camera.fov, 54, 3, dt);
      this.camera.updateProjectionMatrix();
      return;
    }

    const inp = this.lastInput || { lookX: 0, lookY: 0 };
    if (this.state === 'playing' || this.state === 'intro') {
      this.cameraYaw += inp.lookX;
      this.cameraPitch = clamp(this.cameraPitch + inp.lookY, -0.12, 0.72);
    }
    if (this.player.lockOn && this.boss && this.boss.alive) {
      const targetYaw = Math.atan2(this.boss.pos.x - this.player.pos.x, this.boss.pos.z - this.player.pos.z);
      let diff = targetYaw - this.cameraYaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.cameraYaw += diff * Math.min(1, dt * 3.5);
      this.cameraPitch = damp(this.cameraPitch, 0.18, 2.5, dt);
    }

    const target = new THREE.Vector3(this.player.pos.x, this.player.pos.y + 1.36, this.player.pos.z);
    const f = new THREE.Vector3(Math.sin(this.cameraYaw), 0, Math.cos(this.cameraYaw));
    const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));
    target.addScaledVector(right, 0.48);
    const horizontal = Math.cos(this.cameraPitch) * this.cameraDistance;
    const height = 1.55 + Math.sin(this.cameraPitch) * this.cameraDistance;
    const desired = target.clone().addScaledVector(f, -horizontal);
    desired.y = this.player.pos.y + height;
    if (this.state === 'intro') {
      const introTarget = this.boss ? this.boss.pos.clone().setY(2.2) : target;
      const introPos = introTarget.clone().add(new THREE.Vector3(Math.sin(this.cameraYaw + 0.18) * 10, 5.2, Math.cos(this.cameraYaw + 0.18) * 10));
      desired.lerp(introPos, 0.55);
    }
    this.camera.position.lerp(desired, 1 - Math.exp(-dt * 9));
    const look = target.clone();
    if (this.state === 'intro' && this.boss) look.lerp(this.boss.pos.clone().setY(2.2), 0.45);
    this.camera.lookAt(look);
    if (this.heroLight) {
      this.heroLight.position.set(this.camera.position.x, this.camera.position.y + 3.5, this.camera.position.z);
      this.heroLight.target.position.set(this.player.pos.x, this.player.pos.y + 1.25, this.player.pos.z);
    }
    this.camera.fov = damp(this.camera.fov, 56 + this.fovKick, 5, dt);
    this.camera.updateProjectionMatrix();

    if (this.shake > 0.001) {
      const s = this.shake * 0.13;
      this.camera.position.x += (Math.random() - 0.5) * s;
      this.camera.position.y += (Math.random() - 0.5) * s;
      this.camera.position.z += (Math.random() - 0.5) * s;
      this.camera.rotation.z += (Math.random() - 0.5) * s * 0.12;
    }
  }

  updateUI(dt) {
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.ui.toast.classList.remove('is-on');
    }
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
      if (this.hitFlashTimer <= 0) this.ui.damageFlash.classList.remove('hit');
    }
    if (this.parryFlashTimer > 0) {
      this.parryFlashTimer -= dt;
      if (this.parryFlashTimer <= 0) this.ui.parryFlash.classList.remove('hit');
    }
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.updateCombo(0);
    }
    if (this.state !== 'menu') {
      this.updateHUD();
      this.ui.timer.textContent = formatTime(this.runTime);
    }
    const p = this.player;
    const boss = this.boss;
    const showParry = this.state === 'playing' && boss && boss.alive && boss.parryCue && boss.state === 'windup';
    this.updateParryPrompt(showParry);
    this.ui.lockBadge.classList.toggle('is-on', p.lockOn && this.state === 'playing');
    this.ui.reticle.classList.toggle('is-target', p.lockOn || (boss && boss.alive && this.state === 'playing'));
    if (boss && boss.alive) {
      this.ui.bossStagger.classList.toggle('is-on', boss.isStaggered);
      this.ui.bossHpGhost.style.transform = `scaleX(${boss.hpRatio})`;
    }
    if (this.shake > 0.001) this.shake = Math.max(0, this.shake - dt * 3.5);
    this.fovKick = damp(this.fovKick, 0, 6, dt);
    this.ui.bossOffscreen.classList.remove('is-on');
  }

  updateParryPrompt(show) {
    const prompt = this.ui.parryPrompt;
    prompt.classList.toggle('is-active', show);
    if (!show) return;

    const boss = this.boss;
    const anchor = this._parryAnchor;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.59;

    if (boss && boss.weaponTipGlow) {
      const center = this._parryCenter;
      boss.weaponTipGlow.getWorldPosition(anchor);
      center.set(boss.pos.x, boss.pos.y + 2.1, boss.pos.z);
      anchor.project(this.camera);
      center.project(this.camera);
      if (anchor.z < 1 && Math.abs(anchor.x) < 1.15 && Math.abs(anchor.y) < 1.15) {
        const tipX = (anchor.x * 0.5 + 0.5) * window.innerWidth;
        const centerX = (center.x * 0.5 + 0.5) * window.innerWidth;
        const side = tipX >= centerX ? 1 : -1;
        x = tipX + side * 92;
        y = (-anchor.y * 0.5 + 0.5) * window.innerHeight + 6;
      }
    }

    const marginX = Math.min(88, window.innerWidth * 0.16);
    const marginTop = 92;
    const marginBottom = this.input.touchActive ? 176 : 112;
    x = clamp(x, marginX, window.innerWidth - marginX);
    y = clamp(y, marginTop, window.innerHeight - marginBottom);
    prompt.style.left = `${x}px`;
    prompt.style.top = `${y}px`;
  }

  animate() {
    requestAnimationFrame(this.animate);
    const raw = Math.min(this.clock.getDelta(), 0.05);
    this.time += raw;

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= raw;
      this.timeScale = 0.045;
    } else if (this.slowTimer > 0) {
      this.slowTimer -= raw;
      this.timeScale = this.slowScale;
    } else {
      this.timeScale = damp(this.timeScale, 1, 12, raw);
    }
    const dt = raw * this.timeScale;

    this.lastInput = this.input.update();
    this.processInput(raw);

    if (this.state === 'playing') {
      this.runTime += raw;
      this.player.update(dt, this.boss);
      if (this.boss) this.boss.update(dt, this.player);
      if (this.boss && this.boss.alive) {
        this.audio.update(raw, { active: true, intensity: 0.45 + (1 - this.boss.hpRatio) * 0.55, hp: this.player.hpRatio });
      }
    } else if (this.state === 'intro') {
      this.introTimer -= raw;
      this.player.update(dt, null);
      if (this.boss) this.boss.update(dt, this.player);
      if (this.introTimer <= 0) this.endIntro();
    } else if (this.state === 'vanquish') {
      this.transitionTimer -= raw;
      this.player.update(dt, null);
      if (this.boss) this.boss.update(dt, this.player);
      if (this.transitionTimer <= 0) this.nextBoss();
    } else if (this.state === 'dying') {
      this.deathTimer -= raw;
      this.player.update(dt, this.boss);
      if (this.boss) this.boss.update(dt, this.player);
      if (this.deathTimer <= 0) this.showDeath();
    } else if (this.state === 'paused' || this.state === 'dead' || this.state === 'victory') {
      this.player.update(dt, this.boss);
      if (this.boss && this.state !== 'paused') this.boss.update(dt, this.player);
    } else if (this.state === 'menu') {
      this.player.update(dt, null);
      if (this.boss) this.boss.update(dt, this.player);
    }

    this.effects.update(dt);
    this.arena.update(raw, this.time);
    this.updateCamera(raw);
    this.updateUI(raw);
    this.composer.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  window.__ASHEN_VOW__ = game;
});
