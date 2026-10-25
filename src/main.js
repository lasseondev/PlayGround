import "@fontsource/orbitron/500.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/800.css";
import "@fontsource/orbitron/900.css";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import "./styles.css";
import { createTextures } from "./textures.js";
import { AudioEngine } from "./audio.js";
import { Effects } from "./effects.js";
import { Arena } from "./arena.js";
import { Player } from "./player.js";
import { Weapons } from "./weapons.js";
import { Enemies } from "./enemies.js";
import { Hud } from "./hud.js";
import { formatScore, pick, rand } from "./utils.js";

class QuakeArena {
  constructor() {
    this.state = "loading";
    this.elapsed = 0;
    this.score = 0;
    this.kills = 0;
    this.wave = 0;
    this.waveTotal = 0;
    this.pendingSpawns = 0;
    this.waveState = "intermission";
    this.waveTimer = 0;
    this.spawnTimer = 0;
    this.waveClearTimer = 0;
    this.deathTimer = 0;
    this.deathShown = false;
    this.startedWithLock = false;
    this.attractAngle = 0.6;

    this.app = document.getElementById("app");
    this.setupRenderer();
    this.textures = createTextures(this.renderer);

    this.audio = new AudioEngine();
    this.hud = new Hud(this);
    this.effects = new Effects(this);
    this.arena = new Arena(this);
    this.player = new Player(this);
    this.weapons = new Weapons(this);
    this.enemies = new Enemies(this);

    this.hud.showLoading(true, 70, "LIGHTING THE FORGE…");
    this.arena.emblem.material.opacity = 0.9;

    this.lastTime = performance.now();
    this.bindUi();
    this.enemies.spawnAmbient();
    this.weapons.viewRoot.visible = false;
    this.camera.position.set(31, 10.5, 24);
    this.camera.lookAt(0, 3, 0);

    requestAnimationFrame(() => {
      this.hud.showLoading(false);
      this.state = "menu";
      this.hud.setBest(this.hud.best);
    });

    window.__QUAKE__ = this;
    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("keydown", (e) => {
      if (e.code !== "Escape") return;
      if (this.state === "playing") this.pause();
      else if (this.state === "paused") this.resume();
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.app.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.05, 450);
    this.scene.add(this.camera);

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.26,
      0.35,
      1.35,
    );
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  bindUi() {
    const on = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", () => {
        this.audio.unlock();
        fn();
      });
    };
    on("startBtn", () => this.startGame(true));
    on("resumeBtn", () => this.resume());
    on("quitBtn", () => this.returnToMenu());
    on("retryBtn", () => this.startGame(true));
    on("menuBtn", () => this.returnToMenu());
  }

  startGame(lockPointer = false) {
    this.audio.unlock();
    this.state = "playing";
    this.startedWithLock = lockPointer;
    this.elapsed = 0;
    this.score = 0;
    this.kills = 0;
    this.wave = 0;
    this.waveTotal = 0;
    this.pendingSpawns = 0;
    this.waveState = "intermission";
    this.waveTimer = 1.5;
    this.spawnTimer = 0;
    this.deathTimer = 0;
    this.deathShown = false;
    this.attractAngle = 0.6;

    this.enemies.clear();
    this.effects.clear();
    this.arena.pickups.reset();
    this.player.reset();
    this.weapons.reset();
    this.player.weapon = 0;
    this.weapons.setWeapon(0);
    this.weapons.models[0].group.visible = true;
    this.weapons.viewRoot.visible = true;

    this.hud.showMenu(false);
    this.hud.showPause(false);
    this.hud.showDeath(false);
    this.hud.showHud(true);
    this.hud.update();
    this.hud.waveBanner("INCOMING", "SURVIVE", "THE GATES ARE OPEN", 1500);

    if (lockPointer) {
      const el = this.renderer.domElement;
      if (el.requestPointerLock) {
        const request = el.requestPointerLock();
        if (request && request.catch) request.catch(() => {});
      }
    }
  }

  pause() {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.player.mouseHeld = false;
    this.player.mouseDown = false;
    this.hud.showPause(true);
    if (document.pointerLockElement) document.exitPointerLock();
  }

  resume() {
    if (this.state !== "paused") return;
    this.state = "playing";
    this.hud.showPause(false);
    const el = this.renderer.domElement;
    if (el.requestPointerLock) {
      const request = el.requestPointerLock();
      if (request && request.catch) request.catch(() => {});
    }
  }

  returnToMenu() {
    this.state = "menu";
    this.startedWithLock = false;
    this.player.mouseHeld = false;
    this.player.mouseDown = false;
    this.player.alive = true;
    this.weapons.viewRoot.visible = false;
    this.enemies.clear();
    this.effects.clear();
    this.arena.pickups.reset();
    this.player.reset();
    this.player.alive = true;
    this.player.pos.set(0, 0, 40);
    this.enemies.spawnAmbient();
    this.hud.showMenu(true);
    this.hud.showPause(false);
    this.hud.showDeath(false);
    this.hud.showHud(false);
    this.hud.setBest(this.score);
    if (document.pointerLockElement) document.exitPointerLock();
    document.body.classList.remove("low-health");
    this.wave = 0;
    this.score = 0;
    this.kills = 0;
  }

  startWave() {
    this.wave += 1;
    this.waveTotal = Math.min(4 + (this.wave - 1) * 2, 16);
    this.pendingSpawns = this.waveTotal;
    this.waveState = "spawning";
    this.spawnTimer = 0.85;
    this.hud.waveBanner(
      "INCOMING",
      `WAVE ${String(this.wave).padStart(2, "0")}`,
      this.wave >= 5 ? "BRUTES AND WRAITHS DETECTED" : this.wave >= 3 ? "WRAITHS DETECTED" : "THEY ARE COMING FOR YOU",
      2300,
    );
    this.audio.wave();
    this.hud.update();
  }

  updateWaves(dt) {
    if (this.state !== "playing") return;
    if (this.waveState === "intermission") {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.startWave();
      return;
    }

    if (this.waveState === "spawning" || this.waveState === "active") {
      if (this.pendingSpawns > 0) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
          this.spawnTimer = this.wave >= 6 ? 0.38 : 0.58;
          this.enemies.spawnWave(1, this.wave);
          this.pendingSpawns -= 1;
          if (this.pendingSpawns === 0) this.waveState = "active";
        }
      }

      if (this.pendingSpawns === 0 && this.enemies.aliveCount === 0) {
        this.waveState = "cleared";
        this.waveTimer = 4.2;
        const bonus = 200 * this.wave;
        this.score += bonus;
        this.player.heal(12);
        this.hud.waveBanner("AREA CLEARED", `WAVE ${String(this.wave).padStart(2, "0")} COMPLETE`, `+${bonus} BONUS · PATCHING ARMOR`, 3000);
        this.hud.toast(`+${bonus} WAVE BONUS`);
        this.audio.pickup("health");
        this.hud.update();
      }
      return;
    }

    if (this.waveState === "cleared") {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) {
        this.waveState = "intermission";
        this.waveTimer = 1.2;
      }
    }
  }

  onEnemyKilled(enemy, source, headshot) {
    const score = Math.round(enemy.type.score * (headshot ? 2 : 1) * (1 + this.wave * 0.04));
    this.score += score;
    this.kills += 1;
    this.hud.killFeed(source, enemy.type.name, headshot);
    this.hud.update();

    if (Math.random() < 0.34) {
      const kinds = ["health", "rockets", "shells", "slugs"];
      const kind = pick(kinds);
      const drop = this.arena.pickups.spawnDrop(kind, enemy.pos.clone());
      drop.baseY = Math.max(0.15, drop.mesh.position.y);
      this.effects.burst(drop.mesh.position.clone().setY(0.7), drop.mesh.userData.color, 10, 2.4, {
        size: 0.18,
        life: 0.5,
        up: 1.4,
      });
    }
  }

  onPlayerDeath() {
    if (this.state !== "playing") return;
    this.state = "dead";
    this.startedWithLock = false;
    this.deathTimer = 0;
    this.deathShown = false;
    this.player.mouseHeld = false;
    this.player.mouseDown = false;
    if (document.pointerLockElement) document.exitPointerLock();
    this.deathCameraBase = this.camera.position.clone();
    this.deathCameraRot = this.camera.rotation.z;
    this.hud.setBest(this.score);
    try {
      if (this.score > Number(localStorage.getItem("quake-arena-best") || 0)) {
        localStorage.setItem("quake-arena-best", String(this.score));
      }
    } catch {}
  }

  debugFight() {
    this.startGame(false);
    this.enemies.clear();
    this.effects.clear();
    this.score = 0;
    this.kills = 0;
    this.wave = 3;
    this.waveTotal = 6;
    this.pendingSpawns = 0;
    this.waveState = "active";
    this.player.pos.set(0, 2.2, 29);
    this.player.yaw = 0;
    this.player.pitch = -0.03;
    this.player.health = 84;
    this.player.armor = 50;
    this.player.ammo = { rockets: 17, shells: 9, slugs: 6 };
    this.player.alive = true;
    this.player.onGround = true;
    this.weapons.viewRoot.visible = true;
    this.enemies.spawn("brute", new THREE.Vector3(-6, 2.2, 4));
    this.enemies.spawn("grunt", new THREE.Vector3(6, 2.2, 2));
    this.enemies.spawn("wraith", new THREE.Vector3(-11, 2.2, -2));
    this.enemies.spawn("grunt", new THREE.Vector3(11, 2.2, -4));
    this.enemies.list.forEach((e) => {
      e.invuln = 0;
      e.state = "chase";
      e.root.scale.setScalar(e.scale);
    });
    this.hud.showMenu(false);
    this.hud.showHud(true);
    this.hud.waveBanner("INCOMING", "WAVE 03", "THEY ARE COMING FOR YOU", 2000);
    this.hud.update();
    this.player.updateCamera(0.016);
    this.camera.updateMatrixWorld();
  }

  addShake(amount, life = 0.25) {
    if (this.player) this.player.addShake(amount, life);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.bloom.setSize(w, h);
  }

  updateMenu(dt) {
    this.elapsed += dt;
    this.attractAngle += dt * 0.055;
    const radius = 33 + Math.sin(this.attractAngle * 1.7) * 2.5;
    const height = 10.5 + Math.sin(this.attractAngle * 2.3) * 1.4;
    this.camera.position.set(
      Math.cos(this.attractAngle) * radius,
      height,
      Math.sin(this.attractAngle) * radius,
    );
    this.camera.lookAt(0, 3.6, 0);
    this.weapons.viewRoot.visible = false;
    this.arena.update(dt);
    this.enemies.update(dt, "menu");
    this.effects.update(dt);
  }

  updatePlaying(dt) {
    this.elapsed += dt;
    this.player.update(dt);
    if (!this.player.alive) return;
    this.enemies.update(dt, "playing");
    this.arena.update(dt);
    this.effects.update(dt);
    this.updateWaves(dt);
    this.hud.update();
  }

  updateDead(dt) {
    this.elapsed += dt;
    this.deathTimer += dt;
    this.arena.update(dt);
    this.enemies.update(dt, "dead");
    this.effects.update(dt);

    if (this.deathCameraBase) {
      this.camera.position.y = Math.max(0.6, this.deathCameraBase.y - this.deathTimer * 0.75);
      this.camera.rotation.z = this.deathCameraRot + this.deathTimer * 0.22;
    }

    if (!this.deathShown && this.deathTimer > 0.85) {
      this.deathShown = true;
      this.hud.showHud(false);
      this.hud.showDeath(true);
      this.hud.showDeathStats(this.wave, this.score, this.kills);
      this.hud.setBest(this.score);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (this.state === "menu") {
      this.updateMenu(dt);
    } else if (this.state === "playing") {
      this.updatePlaying(dt);
    } else if (this.state === "dead") {
      this.updateDead(dt);
    } else if (this.state === "paused") {
      this.elapsed += dt * 0.15;
    } else if (this.state === "loading") {
      this.elapsed += dt;
    }

    if (this.state !== "paused") {
      this.gameplayTime = (this.gameplayTime || 0) + dt;
    }

    this.composer.render();
  }
}

new QuakeArena();
