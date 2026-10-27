import Matter from "matter-js";
import {
  BIRDS,
  GROUND_Y,
  LEVELS,
  MATERIALS,
  SLINGSHOT,
  THEMES,
  blockHealth,
  levelScoreStars,
  pigHealth,
} from "./levels.js";
import {
  drawBird,
  drawBlock,
  drawBush,
  drawClouds,
  drawFlowers,
  drawGround,
  drawHillLayer,
  drawPig,
  drawRock,
  drawShadow,
  drawSky,
  drawSlingBack,
  drawSlingFront,
  drawSunHaze,
  drawTrajectory,
  drawTree,
  ellipse,
  roundRect,
} from "./art.js";

const { Engine, World, Bodies, Body, Composite, Events, Sleeping, Vector } = Matter;
const TAU = Math.PI * 2;
const STEP = 1000 / 60;
const PROGRESS_KEY = "angry-birds-slingbird-progress-v1";
const MAX_PARTICLES = 520;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { unlocked: 1, stars: {}, best: {} };
    const parsed = JSON.parse(raw);
    return {
      unlocked: clamp(Number(parsed.unlocked) || 1, 1, LEVELS.length),
      stars: parsed.stars && typeof parsed.stars === "object" ? parsed.stars : {},
      best: parsed.best && typeof parsed.best === "object" ? parsed.best : {},
    };
  } catch {
    return { unlocked: 1, stars: {}, best: {} };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

export class Game {
  constructor(canvas, audio, events = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.audio = audio;
    this.events = events;
    this.progress = loadProgress();

    this.dpr = 1;
    this.width = 1;
    this.height = 1;
    this.zoom = 1;
    this.camera = { x: 880, y: 590, zoom: 1 };

    this.engine = null;
    this.world = null;
    this.level = LEVELS[0];
    this.levelIndex = 0;
    this.state = "boot";
    this.time = 0;
    this.acc = 0;
    this.lastTs = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = 0;

    this.score = 0;
    this.queue = [];
    this.usedBirds = 0;
    this.readyBird = null;
    this.dragging = false;
    this.dragPos = null;
    this.flightBirds = [];
    this.primaryBird = null;
    this.phase = "idle";
    this.nextBirdTimer = 0;
    this.failTimer = 0;
    this.winTimer = 0;
    this.loseTimer = 0;
    this.settledTime = 0;
    this.lastMotion = 0;
    this.shake = 0;
    this.flash = 0;
    this.flashColor = "255, 210, 120";

    this.blocks = [];
    this.pigs = [];
    this.tnts = [];
    this.pendingRemove = new Set();
    this.pendingExplosions = [];
    this.particles = [];
    this.scorePopups = [];
    this.trail = [];
    this.ambientTimer = 0;
    this.pointerId = null;

    this.confettiSpawned = false;
    this.lastScoreShown = 0;
    this.debugShot = false;

    this._boundFrame = this.frame.bind(this);
    this._boundResize = this.resize.bind(this);
    this._boundDown = this.onPointerDown.bind(this);
    this._boundMove = this.onPointerMove.bind(this);
    this._boundUp = this.onPointerUp.bind(this);
    this._boundKey = this.onKeyDown.bind(this);

    this.resize();
    window.addEventListener("resize", this._boundResize);
    canvas.addEventListener("pointerdown", this._boundDown);
    canvas.addEventListener("pointermove", this._boundMove);
    canvas.addEventListener("pointerup", this._boundUp);
    canvas.addEventListener("pointercancel", this._boundUp);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("keydown", this._boundKey);

    this.buildLevel(0, true);
    requestAnimationFrame(this._boundFrame);
  }

  /* ------------------------------------------------------------------ */
  /* Setup                                                              */
  /* ------------------------------------------------------------------ */

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width || window.innerWidth);
    this.height = Math.max(1, rect.height || window.innerHeight);
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.updateCameraLayout();
  }

  updateCameraLayout() {
    const aspect = this.width / this.height;
    this.portrait = aspect < 0.82;
    if (this.portrait) {
      this.zoom = clamp(this.width / 1040, 0.34, 0.52);
      this.cameraBaseX = 790;
      this.groundAnchor = 0.84;
    } else if (aspect < 1.05) {
      this.zoom = Math.min(this.width / 1500, this.height / 1020);
      this.cameraBaseX = 880;
      this.groundAnchor = 0.78;
    } else {
      this.zoom = Math.min(this.width / 1520, this.height / 940);
      this.cameraBaseX = 885;
      this.groundAnchor = 0.78;
    }
    this.zoom = Math.max(0.12, this.zoom);
    const viewH = this.height / this.zoom;
    this.cameraBaseY = GROUND_Y - (1 - this.groundAnchor) * viewH;
    if (!this.cameraLocked) {
      this.camera.x = this.cameraBaseX;
      this.camera.y = this.cameraBaseY;
      this.camera.zoom = this.zoom;
    }
  }

  buildLevel(index, preview = false) {
    this.levelIndex = clamp(index, 0, LEVELS.length - 1);
    this.level = LEVELS[this.levelIndex];
    this.theme = THEMES[this.level.theme] || THEMES.day;

    this.engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
      enableSleeping: true,
    });
    this.engine.positionIterations = 10;
    this.engine.velocityIterations = 7;
    this.engine.constraintIterations = 4;
    this.world = this.engine.world;

    this.blocks = [];
    this.pigs = [];
    this.tnts = [];
    this.flightBirds = [];
    this.primaryBird = null;
    this.pendingRemove = new Set();
    this.pendingExplosions = [];
    this.particles = [];
    this.scorePopups = [];
    this.trail = [];
    this.score = 0;
    this.usedBirds = 0;
    this.queue = [...this.level.birds];
    this.readyBird = null;
    this.dragging = false;
    this.dragPos = null;
    this.phase = "idle";
    this.nextBirdTimer = 0;
    this.failTimer = 0;
    this.winTimer = 0;
    this.loseTimer = 0;
    this.settledTime = 0;
    this.lastMotion = 0;
    this.shake = 0;
    this.flash = 0;
    this.confettiSpawned = false;
    this.state = preview ? "menu" : "playing";
    this.cameraLocked = false;
    this.updateCameraLayout();
    this.camera.x = this.cameraBaseX;
    this.camera.y = this.cameraBaseY;
    this.camera.zoom = this.zoom;

    const ground = Bodies.rectangle(950, GROUND_Y + 260, 4200, 520, {
      isStatic: true,
      friction: 0.95,
      restitution: 0.02,
      label: "ground",
    });
    ground.plugin = { kind: "ground", material: "dirt", seed: 2 };
    Composite.add(this.world, ground);

    for (const data of this.level.blocks) {
      if (data.material === "tnt") this.createTnt(data);
      else this.createBlock(data);
    }
    for (const data of this.level.pigs) {
      this.createPig(data);
    }

    Events.on(this.engine, "collisionStart", (event) => this.onCollision(event));
    this.loadNextBird();
    this.emitStaticState();
    this.emitBirds();
    this.emitScore();
    if (!preview) {
      this.events.onLevelStart?.(this.level, this.levelIndex);
      this.audio.whoosh();
    }
  }

  createBlock(data) {
    const mat = MATERIALS[data.material];
    const hp = blockHealth(data);
    const body = Bodies.rectangle(data.x, data.y, data.w, data.h, {
      density: mat.density,
      friction: mat.friction,
      frictionStatic: 1.1,
      frictionAir: 0.004,
      restitution: mat.restitution,
      angle: data.angle || 0,
      slop: 0.02,
      label: "block",
      sleepThreshold: 45,
    });
    body.plugin = {
      kind: "block",
      w: data.w,
      h: data.h,
      material: data.material,
      tag: data.tag,
      hp,
      maxHp: hp,
      seed: Math.floor(body.id * 37 + data.x * 3.3 + data.y),
      dead: false,
    };
    this.blocks.push(body);
    Composite.add(this.world, body);
    return body;
  }

  createTnt(data) {
    const mat = MATERIALS.tnt;
    const body = Bodies.rectangle(data.x, data.y, data.w, data.h, {
      density: mat.density,
      friction: mat.friction,
      frictionStatic: 1,
      frictionAir: 0.005,
      restitution: mat.restitution,
      angle: data.angle || 0,
      label: "tnt",
      sleepThreshold: 45,
    });
    body.plugin = {
      kind: "block",
      w: data.w,
      h: data.h,
      material: "tnt",
      hp: 38,
      maxHp: 38,
      seed: Math.floor(body.id * 19 + data.x),
      dead: false,
      isTnt: true,
      fuse: 0,
    };
    this.blocks.push(body);
    this.tnts.push(body);
    Composite.add(this.world, body);
    return body;
  }

  createPig(data) {
    const hp = pigHealth(data);
    const body = Bodies.circle(data.x, data.y, data.r, {
      density: 0.00105,
      friction: 0.58,
      frictionStatic: 0.8,
      frictionAir: 0.006,
      restitution: 0.24,
      label: "pig",
      sleepThreshold: 40,
    });
    body.plugin = {
      kind: "pig",
      r: data.r,
      hat: data.hat,
      name: data.name,
      hp,
      maxHp: hp,
      seed: Math.floor(body.id * 29 + data.x * 1.7),
      dead: false,
      blinkOffset: Math.random() * 4,
      hurt: 0,
    };
    this.pigs.push(body);
    Composite.add(this.world, body);
    return body;
  }

  loadNextBird() {
    if (!this.queue.length) {
      this.readyBird = null;
      this.emitBirds();
      return null;
    }
    const type = this.queue.shift();
    const config = BIRDS[type] || BIRDS.red;
    this.readyBird = {
      type,
      x: SLINGSHOT.anchorX,
      y: SLINGSHOT.anchorY,
      radius: config.radius,
      bob: Math.random() * TAU,
    };
    this.phase = "ready";
    this.dragPos = null;
    this.dragging = false;
    this.primaryBird = null;
    this.flightBirds = [];
    this.trail = [];
    this.emitBirds();
    this.events.onAbility?.(false, "");
    return this.readyBird;
  }

  /* ------------------------------------------------------------------ */
  /* Input                                                              */
  /* ------------------------------------------------------------------ */

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x: (x - this.width / 2) / this.zoom + this.camera.x,
      y: (y - this.height / 2) / this.zoom + this.camera.y,
    };
  }

  onPointerDown(event) {
    if (this.state !== "playing") return;
    this.audio.unlock();
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const p = this.screenToWorld(event.clientX, event.clientY);

    if (this.phase === "flying" && this.primaryBird && !this.primaryBird.plugin.dead) {
      this.triggerAbility();
      return;
    }

    if (this.phase === "ready" && this.readyBird && !this.dragging) {
      const d = Math.hypot(p.x - this.readyBird.x, p.y - this.readyBird.y);
      const hitRadius = this.readyBird.radius + 48 / this.zoom;
      if (d < hitRadius) {
        this.dragging = true;
        this.pointerId = event.pointerId;
        this.canvas.setPointerCapture?.(event.pointerId);
        this.dragPos = { x: this.readyBird.x, y: this.readyBird.y };
        this.audio.stretch();
        event.preventDefault();
      }
    }
  }

  onPointerMove(event) {
    if (!this.dragging || this.state !== "playing") return;
    if (this.pointerId !== null && event.pointerId !== this.pointerId) return;
    const p = this.screenToWorld(event.clientX, event.clientY);
    const ax = SLINGSHOT.anchorX;
    const ay = SLINGSHOT.anchorY;
    let dx = p.x - ax;
    let dy = p.y - ay;
    const dist = Math.hypot(dx, dy);
    const maxPull = SLINGSHOT.maxPull;
    if (dist > maxPull) {
      dx = (dx / dist) * maxPull;
      dy = (dy / dist) * maxPull;
    }
    if (dy < -maxPull * 0.82) {
      const scale = (maxPull * 0.82) / -dy;
      dx *= scale;
      dy *= scale;
    }
    this.dragPos = { x: ax + dx, y: ay + dy };
    this.readyBird.x = this.dragPos.x;
    this.readyBird.y = this.dragPos.y;
    if (Math.random() < 0.16) {
      this.spawnParticle({
        x: this.dragPos.x,
        y: this.dragPos.y,
        vx: (Math.random() - 0.5) * 40,
        vy: -Math.random() * 40,
        life: 0.5,
        size: 2 + Math.random() * 2,
        color: "#ffe6a8",
        type: "dust",
        gravity: -40,
      });
    }
    event.preventDefault();
  }

  onPointerUp(event) {
    if (!this.dragging) return;
    if (this.pointerId !== null && event.pointerId !== this.pointerId) return;
    this.dragging = false;
    this.pointerId = null;
    this.canvas.releasePointerCapture?.(event.pointerId);
    if (!this.readyBird || !this.dragPos) {
      this.resetDrag();
      return;
    }
    const dx = SLINGSHOT.anchorX - this.dragPos.x;
    const dy = SLINGSHOT.anchorY - this.dragPos.y;
    const pull = Math.hypot(dx, dy);
    if (pull < 18) {
      this.resetDrag();
      return;
    }
    this.launchBird(dx, dy, pull);
  }

  resetDrag() {
    if (!this.readyBird) return;
    this.readyBird.x = SLINGSHOT.anchorX;
    this.readyBird.y = SLINGSHOT.anchorY;
    this.dragPos = null;
  }

  launchBird(dx, dy, pull = Math.hypot(dx, dy)) {
    if (!this.readyBird || this.phase !== "ready") return;
    const config = BIRDS[this.readyBird.type] || BIRDS.red;
    const power = clamp(pull / SLINGSHOT.maxPull, 0, 1);
    const speed = lerp(SLINGSHOT.minSpeed, SLINGSHOT.maxSpeed, power);
    const len = Math.max(0.001, pull);
    const vx = (dx / len) * speed;
    const vy = (dy / len) * speed;

    const body = Bodies.circle(this.readyBird.x, this.readyBird.y, config.radius, {
      density: config.density,
      friction: config.friction,
      frictionStatic: 0.8,
      frictionAir: config.frictionAir,
      restitution: config.restitution,
      label: "bird",
      slop: 0.02,
      sleepThreshold: 55,
    });
    body.plugin = {
      kind: "bird",
      birdType: this.readyBird.type,
      radius: config.radius,
      abilityUsed: false,
      launchedAt: this.time,
      landed: false,
      stillTime: 0,
      dead: false,
      seed: Math.floor(body.id * 13),
      ability: config.ability,
    };
    Body.setVelocity(body, { x: vx, y: vy });
    Body.setAngularVelocity(body, vx * 0.008);
    Composite.add(this.world, body);

    this.flightBirds.push(body);
    this.primaryBird = body;
    this.usedBirds += 1;
    this.phase = "flying";
    this.readyBird = null;
    this.dragPos = null;
    this.trail = [];
    this.shake = Math.max(this.shake, 3.5);
    this.audio.launch();
    if (body.plugin.ability) {
      const label = BIRDS[body.plugin.birdType].abilityLabel;
      this.events.onAbility?.(true, label);
    } else {
      this.events.onAbility?.(false, "");
    }
    this.addTrailPoint(body);
    this.emitBirds();
  }

  triggerAbility() {
    if (this.state !== "playing" || this.phase !== "flying") return;
    const body = this.primaryBird;
    if (!body || body.plugin.abilityUsed || body.plugin.dead || body.plugin.landed) return;
    const type = body.plugin.birdType;
    body.plugin.abilityUsed = true;
    this.events.onAbility?.(false, "");

    if (type === "chuck") {
      const speed = Math.max(14, Math.hypot(body.velocity.x, body.velocity.y));
      const dir = Vector.normalise(body.velocity);
      Body.setVelocity(body, { x: dir.x * speed * 1.72, y: dir.y * speed * 1.72 });
      this.audio.dash();
      this.shake = Math.max(this.shake, 5);
      this.spawnBurst(body.position.x, body.position.y, {
        count: 16,
        colors: ["#ffe372", "#ffb31f", "#fff6d0"],
        speed: 210,
        life: 0.55,
        size: 4,
        type: "spark",
        gravity: 120,
      });
      this.flash = Math.max(this.flash, 0.16);
      this.flashColor = "255, 226, 100";
    } else if (type === "bomb") {
      this.scheduleExplosion(body, 0.02, 220, 1.25);
      body.plugin.landed = true;
      body.plugin.dead = true;
      this.pendingRemove.add(body);
      this.flightBirds = this.flightBirds.filter((b) => b !== body);
      if (this.primaryBird === body) this.primaryBird = null;
    } else if (type === "blue") {
      this.audio.split();
      const v = body.velocity;
      const baseAngle = Math.atan2(v.y, v.x);
      for (const offset of [-0.26, 0.26]) {
        const cfg = BIRDS.blue;
        const child = Bodies.circle(body.position.x, body.position.y, cfg.radius * 0.88, {
          density: cfg.density,
          friction: cfg.friction,
          frictionAir: cfg.frictionAir,
          restitution: cfg.restitution,
          label: "bird",
          slop: 0.02,
        });
        child.plugin = {
          kind: "bird",
          birdType: "blue",
          radius: cfg.radius * 0.88,
          abilityUsed: true,
          launchedAt: this.time,
          landed: false,
          stillTime: 0,
          dead: false,
          seed: Math.floor(child.id * 17),
          ability: null,
        };
        const speed = Math.max(13, Math.hypot(v.x, v.y));
        const a = baseAngle + offset;
        Body.setVelocity(child, { x: Math.cos(a) * speed, y: Math.sin(a) * speed });
        Composite.add(this.world, child);
        this.flightBirds.push(child);
        this.spawnBurst(child.position.x, child.position.y, {
          count: 8,
          colors: ["#b8f0ff", "#46b6e8", "#ffffff"],
          speed: 160,
          life: 0.5,
          size: 3.5,
          type: "spark",
          gravity: 100,
        });
      }
    }
  }

  onKeyDown(event) {
    if (event.repeat) return;
    if (event.key === " " || event.key === "Spacebar") {
      if (this.state === "playing" && this.phase === "flying") {
        this.triggerAbility();
        event.preventDefault();
      }
      return;
    }
    const key = event.key.toLowerCase();
    if (key === "p") {
      if (this.state === "playing" || this.state === "paused") {
        this.events.onPauseRequest?.();
        event.preventDefault();
      }
    } else if (key === "m") {
      this.events.onMuteRequest?.();
    } else if (key === "r") {
      if (this.state === "playing" || this.state === "paused" || this.state === "win" || this.state === "lose") {
        this.events.onRestartRequest?.();
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Physics & game logic                                               */
  /* ------------------------------------------------------------------ */

  onCollision(event) {
    if (this.state !== "playing" && this.state !== "winning" && this.state !== "losing") return;
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      const pa = a.plugin || {};
      const pb = b.plugin || {};
      if (pa.dead || pb.dead) continue;
      const rel = Math.hypot(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
      if (rel < 2.1) continue;
      if (a.isStatic && b.isStatic) continue;

      const massA = a.isStatic ? b.mass : a.mass;
      const massB = b.isStatic ? a.mass : b.mass;
      const reduced = (massA * massB) / Math.max(0.0001, massA + massB);
      const birdHit = pa.kind === "bird" || pb.kind === "bird";
      const boost = birdHit ? 2.15 : 1;
      const baseDamage = 0.5 * reduced * rel * rel * 0.17 * boost;

      const contact = {
        x: (a.position.x + b.position.x) / 2,
        y: (a.position.y + b.position.y) / 2,
      };

      this.damageBody(a, b, baseDamage, rel, contact, birdHit);
      this.damageBody(b, a, baseDamage, rel, contact, birdHit);
      this.collisionEffects(a, b, rel, contact, baseDamage);
    }
  }

  damageBody(target, other, baseDamage, rel, contact, birdHit) {
    const p = target.plugin || {};
    if (p.dead || target.isStatic) return;
    if (p.kind === "bird" || p.kind === "ground") return;

    if (p.kind === "pig") {
      let dmg = baseDamage * 3.4;
      if (birdHit) dmg *= 1.18;
      if (rel < 4.5) return;
      p.hurt = Math.max(p.hurt, dmg);
      p.hp -= dmg;
      Sleeping.set?.(target, false);
      if (dmg > 7) {
        this.spawnBurst(contact.x, contact.y, {
          count: Math.min(9, 2 + Math.floor(dmg / 8)),
          colors: ["#8fd05c", "#5aa32c", "#c9f09a"],
          speed: 100 + dmg * 2,
          life: 0.5,
          size: 3.5,
          type: "dust",
          gravity: 340,
        });
      }
      if (p.hp <= 0) this.popPig(target);
      return;
    }

    if (p.kind === "block") {
      if (rel < 3.3) return;
      let dmg = baseDamage;
      if (p.isTnt && rel > 3.4) {
        this.scheduleExplosion(target, 0.03, 205, 1);
        return;
      }
      p.hp -= dmg;
      if (p.material === "ice" && dmg > 12) p.hp -= dmg * 0.25;
      if (dmg > 8) {
        const colors = MATERIALS[p.material]?.debris || ["#d99a4c"];
        this.spawnBurst(contact.x, contact.y, {
          count: Math.min(8, 2 + Math.floor(dmg / 12)),
          colors,
          speed: 90 + dmg * 2.4,
          life: 0.6,
          size: 3 + Math.random() * 3,
          type: "shard",
          gravity: 720,
        });
      }
      if (p.hp <= 0) this.destroyBlock(target);
    }
  }

  collisionEffects(a, b, rel, contact, dmg) {
    const pa = a.plugin || {};
    const pb = b.plugin || {};
    const material = pa.kind === "block" ? pa.material : pb.kind === "block" ? pb.material : pa.kind === "pig" || pb.kind === "pig" ? "pig" : "stone";
    if (rel > 5 && dmg > 2) {
      this.audio.impact(material === "tnt" ? "tnt" : material, Math.min(1.6, rel / 18));
      this.shake = Math.max(this.shake, Math.min(8, rel * 0.22));
      const count = Math.min(7, Math.floor(rel / 5));
      if (count > 0) {
        this.spawnBurst(contact.x, contact.y, {
          count,
          colors: material === "pig" ? ["#9ad86a", "#67b43a"] : MATERIALS[material]?.debris || ["#c9b48a"],
          speed: 50 + rel * 2.6,
          life: 0.4,
          size: 2.5,
          type: "dust",
          gravity: 260,
        });
      }
    }
    if (pa.kind === "bird" || pb.kind === "bird") {
      const bird = pa.kind === "bird" ? a : b;
      if (bird.plugin.birdType === "bomb" && !bird.plugin.abilityUsed && rel > 6) {
        bird.plugin.abilityUsed = true;
        this.scheduleExplosion(bird, 0.08, 200, 1.05);
        bird.plugin.dead = true;
        this.pendingRemove.add(bird);
        this.flightBirds = this.flightBirds.filter((x) => x !== bird);
        if (this.primaryBird === bird) this.primaryBird = null;
        this.events.onAbility?.(false, "");
      }
    }
  }

  scheduleExplosion(body, delay = 0, radius = 205, power = 1) {
    if (!body || body.plugin?.dead && body.plugin?.exploded) return;
    if (body.plugin) body.plugin.exploded = true;
    this.pendingExplosions.push({
      body,
      position: { x: body.position.x, y: body.position.y },
      delay,
      radius,
      power,
    });
    if (body.plugin && body.plugin.isTnt) {
      body.plugin.hp = 0;
      body.plugin.dead = true;
      this.pendingRemove.add(body);
    }
  }

  detonate(explosion) {
    const { position, radius, power } = explosion;
    this.audio.explosion();
    this.shake = Math.max(this.shake, 20 * power);
    this.flash = Math.max(this.flash, 0.5 * power);
    this.flashColor = "255, 180, 80";
    this.spawnBurst(position.x, position.y, {
      count: 34,
      colors: ["#fff1b0", "#ffd85d", "#ff9430", "#d94b2b", "#5a3326"],
      speed: 520,
      life: 0.95,
      size: 7,
      type: "spark",
      gravity: 220,
    });
    this.spawnBurst(position.x, position.y, {
      count: 16,
      colors: ["rgba(74,48,35,0.65)", "rgba(102,72,54,0.5)", "rgba(58,42,32,0.6)"],
      speed: 230,
      life: 1.5,
      size: 16,
      type: "smoke",
      gravity: -80,
    });
    this.particles.push({
      type: "ring",
      x: position.x,
      y: position.y,
      life: 0.48,
      maxLife: 0.48,
      radius: 20,
      maxRadius: radius,
      color: "255, 214, 118",
    });
    this.scorePopups.push({ x: position.x, y: position.y - 28, text: "BOOM!", life: 1, maxLife: 1, color: "#ffe372", size: 34 });

    for (const body of Composite.allBodies(this.world)) {
      if (body.isStatic || body === explosion.body) continue;
      const p = body.plugin || {};
      if (p.dead) continue;
      const dx = body.position.x - position.x;
      const dy = body.position.y - position.y;
      const dist = Math.hypot(dx, dy);
      if (dist > radius || dist < 0.001) continue;
      const falloff = 1 - dist / radius;
      Sleeping.set?.(body, false);
      const nx = dx / dist;
      const ny = dy / dist;
      const force = 23 * falloff * power;
      Body.setVelocity(body, {
        x: body.velocity.x + nx * force,
        y: body.velocity.y + ny * force - 3.5 * falloff,
      });
      Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.28 * falloff);
      if (p.kind === "pig") {
        p.hp -= (150 + 110 * falloff) * power;
        p.hurt = 999;
        if (p.hp <= 0) this.popPig(body);
      } else if (p.kind === "block") {
        if (p.isTnt && !p.exploded) {
          this.scheduleExplosion(body, 0.09 + Math.random() * 0.06, 200, 0.95);
        } else {
          p.hp -= (240 + 120 * falloff) * power;
          if (p.hp <= 0) this.destroyBlock(body);
        }
      }
    }
    if (explosion.body && explosion.body.plugin) explosion.body.plugin.dead = true;
    this.pendingRemove.add(explosion.body);
  }

  destroyBlock(body) {
    const p = body.plugin || {};
    if (p.dead) return;
    p.dead = true;
    this.pendingRemove.add(body);
    const colors = MATERIALS[p.material]?.debris || ["#d99a4c"];
    this.spawnBurst(body.position.x, body.position.y, {
      count: p.material === "ice" ? 18 : 14,
      colors,
      speed: 260,
      life: 0.9,
      size: 6,
      type: p.material === "ice" ? "shard" : "shard",
      gravity: 780,
    });
    this.audio.break(p.material);
    this.shake = Math.max(this.shake, 4);
    if (p.material !== "tnt") this.addScore(120, body.position.x, body.position.y, null);
    else this.addScore(300, body.position.x, body.position.y, null);
  }

  popPig(body) {
    const p = body.plugin || {};
    if (p.dead) return;
    p.dead = true;
    this.pendingRemove.add(body);
    this.spawnBurst(body.position.x, body.position.y, {
      count: 20,
      colors: ["#9fe06a", "#67bb3a", "#3f8b20", "#d6f7a8"],
      speed: 300,
      life: 0.9,
      size: 6,
      type: "dust",
      gravity: 560,
    });
    this.spawnBurst(body.position.x, body.position.y, {
      count: 6,
      colors: ["#fff6d0", "#ffe372", "#ffffff"],
      speed: 220,
      life: 0.7,
      size: 5,
      type: "spark",
      gravity: 80,
    });
    this.audio.pop();
    this.audio.oink();
    this.shake = Math.max(this.shake, 7);
    this.addScore(5000, body.position.x, body.position.y - 20, "PIG POPPED!");
    if (p.name) this.scorePopups.push({ x: body.position.x, y: body.position.y - 56, text: p.name.toUpperCase(), life: 1.2, maxLife: 1.2, color: "#ffe372", size: 22 });
    this.checkWin();
  }

  addScore(amount, x, y, label, color = "#ffe372") {
    this.score += amount;
    this.events.onScore?.(this.score);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      this.scorePopups.push({
        x,
        y,
        text: `+${amount.toLocaleString()}`,
        life: 1.05,
        maxLife: 1.05,
        color,
        size: label ? 20 : 27,
        label,
      });
    }
  }

  checkWin() {
    if (this.state !== "playing") return;
    const alive = this.pigs.filter((p) => !p.plugin?.dead);
    if (alive.length === 0) {
      this.state = "winning";
      this.winTimer = 0;
      this.confettiSpawned = false;
      this.events.onAbility?.(false, "");
    }
  }

  beginWin() {
    const remaining = this.level.birds.length - this.usedBirds;
    if (remaining > 0) {
      const bonus = remaining * 10000;
      this.score += bonus;
      this.events.onScore?.(this.score);
      this.scorePopups.push({
        x: SLINGSHOT.anchorX + 100,
        y: 560,
        text: `+${bonus.toLocaleString()}`,
        life: 2.2,
        maxLife: 2.2,
        color: "#ffe372",
        size: 34,
        label: `${remaining} BIRD${remaining === 1 ? "" : "S"} SAVED`,
      });
    }
    const stars = levelScoreStars(this.level, this.score);
    const id = this.level.id;
    const prevStars = Number(this.progress.stars[id]) || 0;
    this.progress.stars[id] = Math.max(prevStars, stars);
    const prevBest = Number(this.progress.best[id]) || 0;
    this.progress.best[id] = Math.max(prevBest, this.score);
    this.progress.unlocked = Math.max(this.progress.unlocked, Math.min(LEVELS.length, id + 1));
    saveProgress(this.progress);
    this.state = "win";
    this.audio.win();
    for (let i = 0; i < stars; i++) {
      setTimeout(() => this.audio.star(i), 260 + i * 210);
    }
    this.events.onWin?.({
      level: this.level,
      levelIndex: this.levelIndex,
      score: this.score,
      stars,
      best: this.progress.best[id],
      hasNext: this.levelIndex < LEVELS.length - 1,
      unlocked: this.progress.unlocked,
    });
    this.events.onProgress?.(this.progress);
  }

  beginLose() {
    this.state = "lose";
    this.audio.lose();
    this.events.onLose?.({
      level: this.level,
      levelIndex: this.levelIndex,
      score: this.score,
      pigs: this.pigs.filter((p) => !p.plugin?.dead).length,
    });
  }

  update(dt) {
    this.time += dt;
    this.updateAmbient(dt);
    if (this.state === "paused" || this.state === "win" || this.state === "lose" || this.state === "menu") {
      this.updateParticles(dt);
      this.decayVisuals(dt);
      return;
    }

    const live = this.state === "playing" || this.state === "winning" || this.state === "losing";
    if (!live) return;

    this.acc += Math.min(0.08, dt);
    let steps = 0;
    while (this.acc >= STEP / 1000 && steps < 4) {
      Engine.update(this.engine, STEP);
      this.acc -= STEP / 1000;
      steps += 1;
      this.processQueues();
    }

    this.updateBirds(dt);
    this.updateOutOfBounds();
    this.updateTrail(dt);
    this.updateParticles(dt);
    this.updateScorePopups(dt);
    this.decayVisuals(dt);

    if (this.state === "winning") {
      this.winTimer += dt;
      if (!this.confettiSpawned) {
        this.spawnConfetti();
        this.confettiSpawned = true;
      }
      if (this.winTimer > 1.15) this.beginWin();
      return;
    }
    if (this.state === "losing") {
      this.loseTimer += dt;
      if (this.loseTimer > 1.05) this.beginLose();
      return;
    }

    if (this.state === "playing") {
      this.checkMotion(dt);
      this.checkFail(dt);
    }

    if (this.primaryBird && !this.primaryBird.plugin.dead) {
      if (this.time - this.primaryBird.plugin.launchedAt > 0.03) this.addTrailPoint(this.primaryBird);
    }
    this.emitScoreThrottled();
  }

  processQueues() {
    if (this.pendingRemove.size) {
      for (const body of this.pendingRemove) {
        if (body && this.world) Composite.remove(this.world, body);
      }
      this.pendingRemove.clear();
    }
    if (this.pendingExplosions.length) {
      const due = [];
      for (const exp of this.pendingExplosions) {
        exp.delay -= STEP / 1000;
        if (exp.delay <= 0) due.push(exp);
      }
      this.pendingExplosions = this.pendingExplosions.filter((e) => e.delay > 0);
      for (const exp of due) this.detonate(exp);
      if (this.pendingRemove.size) {
        for (const body of this.pendingRemove) {
          if (body && this.world) Composite.remove(this.world, body);
        }
        this.pendingRemove.clear();
      }
    }
  }

  updateBirds(dt) {
    if (!this.flightBirds.length) {
      if (this.phase === "flying") {
        this.phase = "waiting";
        this.nextBirdTimer = 0.45;
      }
    }

    for (const body of [...this.flightBirds]) {
      const p = body.plugin || {};
      if (p.dead || p.landed) continue;
      const speed = Math.hypot(body.velocity.x, body.velocity.y);
      const spin = Math.abs(body.angularVelocity);
      if (body.position.y > 1240 || body.position.x > 2250 || body.position.x < -160) {
        p.landed = true;
        p.stillTime = 99;
        if (body.position.y > 1240) this.pendingRemove.add(body);
      } else if (speed < 0.72 && spin < 0.045 && this.time - p.launchedAt > 0.55) {
        p.stillTime += dt;
        if (p.stillTime > 0.85) p.landed = true;
      } else {
        p.stillTime = 0;
      }
      if (!p.landed && this.time - p.launchedAt > 5.5) {
        p.landed = true;
        p.stillTime = 99;
      }
      if (p.landed) {
        p.landedAt = this.time;
        if (this.primaryBird === body) {
          this.primaryBird = null;
          this.events.onAbility?.(false, "");
        }
      }
    }

    const active = this.flightBirds.filter((b) => !b.plugin?.landed && !b.plugin?.dead);
    if (this.phase === "flying" && active.length === 0) {
      this.phase = "waiting";
      this.nextBirdTimer = 0.75;
    } else if (this.phase === "flying" && this.primaryBird?.plugin?.landed) {
      const nextPrimary = active[0] || null;
      this.primaryBird = nextPrimary;
      if (nextPrimary && nextPrimary.plugin.ability && !nextPrimary.plugin.abilityUsed) {
        this.events.onAbility?.(true, BIRDS[nextPrimary.plugin.birdType].abilityLabel);
      }
    }

    if (this.phase === "waiting") {
      this.nextBirdTimer -= dt;
      const activeLeft = this.flightBirds.some((b) => !b.plugin?.landed && !b.plugin?.dead);
      if (this.nextBirdTimer <= 0 && !activeLeft && this.state === "playing") {
        this.flightBirds = [];
        if (this.queue.length) {
          this.loadNextBird();
        } else {
          this.phase = "done";
          this.failTimer = 0;
        }
      }
    }
  }

  checkMotion(dt) {
    let maxSpeed = 0;
    for (const body of Composite.allBodies(this.world)) {
      if (body.isStatic || body.plugin?.dead) continue;
      const s = Math.hypot(body.velocity.x, body.velocity.y);
      if (s > maxSpeed) maxSpeed = s;
      if (Math.abs(body.angularVelocity) * 20 > maxSpeed) maxSpeed = Math.abs(body.angularVelocity) * 20;
    }
    this.lastMotion = maxSpeed;
    if (maxSpeed < 0.4) this.settledTime += dt;
    else this.settledTime = 0;
  }

  checkFail(dt) {
    if (this.state !== "playing") return;
    if (this.pigs.every((p) => p.plugin?.dead)) return;
    if (this.phase !== "done") return;
    this.failTimer += dt;
    if ((this.settledTime > 1.4 && this.failTimer > 1.2) || this.failTimer > 7) {
      this.state = "losing";
      this.loseTimer = 0;
      this.events.onAbility?.(false, "");
    }
  }

  updateOutOfBounds() {
    for (const pig of this.pigs) {
      if (pig.plugin?.dead) continue;
      if (pig.position.y > 1180 || pig.position.x > 2300 || pig.position.x < -200) {
        this.popPig(pig);
      }
    }
    for (const block of this.blocks) {
      if (block.plugin?.dead) continue;
      if (block.position.y > 1320 || block.position.x > 2500 || block.position.x < -320) {
        block.plugin.dead = true;
        this.pendingRemove.add(block);
      }
    }
  }

  updateAmbient(dt) {
    this.ambientTimer -= dt;
    if (this.ambientTimer > 0) return;
    this.ambientTimer = 0.5 + Math.random() * 1.2;
    if (this.state === "menu" || this.state === "playing" || this.state === "winning") {
      const x = this.camera.x - this.width / this.zoom / 2 + Math.random() * (this.width / this.zoom);
      const y = this.camera.y - this.height / this.zoom / 2 + Math.random() * (this.height / this.zoom) * 0.7;
      this.spawnParticle({
        x,
        y,
        vx: 8 + Math.random() * 14,
        vy: -2 - Math.random() * 8,
        life: 3 + Math.random() * 3,
        size: 1.2 + Math.random() * 1.8,
        color: this.theme?.groundTopLight || "#fff3c0",
        type: "pollen",
        gravity: -4,
      });
    }
  }

  decayVisuals(dt) {
    this.shake *= Math.pow(0.001, dt);
    if (this.shake < 0.05) this.shake = 0;
    this.flash = Math.max(0, this.flash - dt * 2.4);
    if (this.primaryBird && !this.primaryBird.plugin.dead) {
      const angle = Math.atan2(this.primaryBird.velocity.y, this.primaryBird.velocity.x);
      this.primaryBird.plugin.flightAngle = angle;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Effects                                                            */
  /* ------------------------------------------------------------------ */

  spawnParticle(particle) {
    if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
    this.particles.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      gravity: 0,
      drag: 0.5,
      life: 1,
      maxLife: 1,
      size: 4,
      color: "#fff",
      type: "dust",
      rotation: 0,
      spin: 0,
      ...particle,
      maxLife: particle.life || 1,
    });
  }

  spawnBurst(x, y, opts) {
    const count = opts.count || 10;
    const colors = opts.colors || ["#fff"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU;
      const speed = (opts.speed || 200) * (0.35 + Math.random() * 0.85);
      this.spawnParticle({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (opts.lift || 0),
        gravity: opts.gravity ?? 600,
        drag: opts.drag ?? 1.2,
        life: (opts.life || 0.7) * (0.6 + Math.random() * 0.7),
        size: (opts.size || 4) * (0.55 + Math.random() * 0.9),
        color: colors[Math.floor(Math.random() * colors.length)],
        type: opts.type || "dust",
        rotation: Math.random() * TAU,
        spin: (Math.random() - 0.5) * 18,
      });
    }
  }

  spawnConfetti() {
    const colors = ["#ffe372", "#ff9d64", "#7fd3ff", "#9fe06a", "#ffffff", "#ff6b8a"];
    for (let i = 0; i < 80; i++) {
      this.spawnParticle({
        x: this.camera.x + (Math.random() - 0.5) * (this.width / this.zoom) * 0.7,
        y: this.camera.y - (this.height / this.zoom) * 0.35 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 260,
        vy: -60 - Math.random() * 210,
        gravity: 220,
        drag: 0.7,
        life: 2.6 + Math.random() * 2,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "confetti",
        rotation: Math.random() * TAU,
        spin: (Math.random() - 0.5) * 14,
      });
    }
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.life -= dt;
      if (p.type === "ring") {
        p.maxLife = p.maxLife || 0.48;
        const t = 1 - Math.max(0, p.life) / p.maxLife;
        p.radius = lerp(20, p.maxRadius || 200, easeOut(t));
        continue;
      }
      p.vy += (p.gravity || 0) * dt;
      p.vx *= Math.pow(0.16, dt * (p.drag || 0.5));
      p.vy *= Math.pow(0.3, dt * (p.drag || 0.5) * 0.35);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.spin * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  updateScorePopups(dt) {
    for (const p of this.scorePopups) {
      p.life -= dt;
      p.y -= 34 * dt;
    }
    this.scorePopups = this.scorePopups.filter((p) => p.life > 0);
  }

  addTrailPoint(body) {
    this.trail.push({ x: body.position.x, y: body.position.y, life: 1.1, maxLife: 1.1 });
    if (this.trail.length > 34) this.trail.shift();
  }

  updateTrail(dt) {
    for (const point of this.trail) point.life -= dt;
    this.trail = this.trail.filter((point) => point.life > 0);
  }

  emitScoreThrottled() {
    if (this.score !== this.lastScoreShown) {
      this.lastScoreShown = this.score;
      this.events.onScore?.(this.score);
    }
  }

  emitScore() {
    this.events.onScore?.(this.score);
  }

  emitBirds() {
    const total = this.level.birds.length;
    this.events.onBirds?.({
      types: this.level.birds,
      used: this.usedBirds,
      remaining: Math.max(0, total - this.usedBirds),
      ready: this.readyBird ? this.readyBird.type : null,
    });
  }

  emitStaticState() {
    this.events.onProgress?.(this.progress);
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */

  startLevel(index, preview = false) {
    this.buildLevel(index, preview);
  }

  startPreview(index = 0) {
    this.buildLevel(index, true);
  }

  restart() {
    this.buildLevel(this.levelIndex, false);
  }

  nextLevel() {
    if (this.levelIndex >= LEVELS.length - 1) {
      this.startPreview(0);
      return false;
    }
    this.buildLevel(this.levelIndex + 1, false);
    return true;
  }

  pause() {
    if (this.state !== "playing") return false;
    this.state = "paused";
    this.events.onAbility?.(false, "");
    return true;
  }

  resume() {
    if (this.state !== "paused") return false;
    this.state = "playing";
    this.acc = 0;
    return true;
  }

  goMenu() {
    this.buildLevel(this.levelIndex, true);
    this.state = "menu";
  }

  launchAt(angleDeg = -42, power = 0.9) {
    if (this.phase !== "ready" || !this.readyBird) return false;
    const p = clamp(power, 0, 1);
    const a = (angleDeg * Math.PI) / 180;
    const len = SLINGSHOT.maxPull * p;
    const dragX = SLINGSHOT.anchorX - Math.cos(a) * len;
    const dragY = SLINGSHOT.anchorY - Math.sin(a) * len;
    this.readyBird.x = dragX;
    this.readyBird.y = dragY;
    this.dragPos = { x: dragX, y: dragY };
    const dx = SLINGSHOT.anchorX - dragX;
    const dy = SLINGSHOT.anchorY - dragY;
    this.launchBird(dx, dy, len);
    return true;
  }

  killAllPigs() {
    for (const pig of this.pigs) {
      if (!pig.plugin?.dead) this.popPig(pig);
    }
    this.checkWin();
  }

  skipTurn() {
    if (this.phase !== "flying") return false;
    for (const bird of this.flightBirds) {
      if (bird.plugin) bird.plugin.landed = true;
    }
    this.updateBirds(1);
    return this.phase === "ready";
  }

  fastForward(seconds = 3) {
    const steps = Math.max(1, Math.round(clamp(seconds, 0.1, 12) * 60));
    for (let i = 0; i < steps; i++) {
      Engine.update(this.engine, STEP);
      this.processQueues();
      this.updateOutOfBounds();
    }
    this.checkMotion(seconds);
    this.updateTrail(seconds);
    if (this.pigs.every((pig) => pig.plugin?.dead)) this.checkWin();
    this.emitScoreThrottled();
    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      state: this.state,
      level: this.level.id,
      levelName: this.level.name,
      score: this.score,
      phase: this.phase,
      remainingBirds: this.level.birds.length - this.usedBirds,
      totalBirds: this.level.birds.length,
      pigs: this.pigs.filter((p) => !p.plugin?.dead).length,
      blocks: this.blocks.filter((b) => !b.plugin?.dead).length,
      flightBirds: this.flightBirds.filter((b) => !b.plugin?.dead).length,
      particles: this.particles.length,
      dragging: this.dragging,
      fps: Math.round(this.fps),
      progress: this.progress,
      camera: { ...this.camera },
      viewport: { width: this.width, height: this.height, zoom: this.zoom },
    };
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */

  frame(ts) {
    if (!this.lastTs) this.lastTs = ts;
    let dt = (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    dt = clamp(dt, 0, 0.05);
    this.frameCount += 1;
    this.fpsTimer += dt;
    if (this.fpsTimer > 0.5) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.frameCount = 0;
      this.fpsTimer = 0;
    }
    this.update(dt);
    this.render();
    requestAnimationFrame(this._boundFrame);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    this.updateCamera();

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const themeName = this.level?.theme || "day";
    drawSky(ctx, w, h, themeName, this.time);
    drawClouds(ctx, w, h, themeName, this.time, 1);
    drawHillLayer(ctx, { w, h }, this.camera, themeName, 0);
    drawHillLayer(ctx, { w, h }, this.camera, themeName, 1);
    drawHillLayer(ctx, { w, h }, this.camera, themeName, 2);
    drawSunHaze(ctx, w, h, themeName, 0.9);

    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake * 0.8 : 0;
    const z = this.zoom;
    const tx = w / 2 - this.camera.x * z + shakeX;
    const ty = h / 2 - this.camera.y * z + shakeY;

    ctx.save();
    ctx.setTransform(this.dpr * z, 0, 0, this.dpr * z, this.dpr * tx, this.dpr * ty);

    drawGround(ctx, { w: w / z, h: h / z }, this.camera, themeName, this.time);

    this.drawDecor(ctx);

    this.drawQueueBirds(ctx);

    if (this.readyBird) {
      drawSlingBack(ctx, SLINGSHOT, { x: this.readyBird.x, y: this.readyBird.y }, themeName);
    } else {
      drawSlingBack(ctx, SLINGSHOT, null, themeName);
    }

    this.drawShadows(ctx);
    this.drawBodies(ctx);
    this.drawBirds(ctx);
    this.drawTrail(ctx);

    if (this.readyBird && this.dragging) {
      const points = this.predictTrajectory();
      drawTrajectory(ctx, points, this.time);
      this.drawAimPower(ctx);
    }

    if (this.readyBird) {
      drawSlingFront(ctx, SLINGSHOT, { x: this.readyBird.x, y: this.readyBird.y }, themeName);
    }

    this.drawParticles(ctx);
    this.drawScorePopups(ctx);
    ctx.restore();

    if (this.flash > 0.005) {
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      grad.addColorStop(0, `rgba(${this.flashColor}, ${this.flash * 0.55})`);
      grad.addColorStop(0.6, `rgba(${this.flashColor}, ${this.flash * 0.18})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  updateCamera() {
    let targetX = this.cameraBaseX;
    if (this.portrait && this.phase === "flying" && this.primaryBird && !this.primaryBird.plugin?.dead) {
      targetX = clamp(this.primaryBird.position.x + 115, 620, 1400);
    }
    const targetY = this.cameraBaseY;
    this.camera.x = lerp(this.camera.x, targetX, this.portrait ? 0.18 : 0.08);
    this.camera.y = lerp(this.camera.y, targetY, 0.08);
    this.camera.zoom = this.zoom;
  }

  drawDecor(ctx) {
    if (!this.level?.decor) return;
    const items = [...this.level.decor].sort((a, b) => (a.layer || 1) - (b.layer || 1));
    for (const item of items) {
      const parallax = item.layer ?? 1;
      const offset = (this.camera.x - 860) * (1 - parallax);
      ctx.save();
      ctx.translate(offset, 0);
      if (item.type === "tree") drawTree(ctx, item.x, GROUND_Y, item.scale, this.level.theme, parallax > 0.5);
      else if (item.type === "bush") drawBush(ctx, item.x, GROUND_Y, item.scale, this.level.theme);
      else if (item.type === "rock") drawRock(ctx, item.x, GROUND_Y, item.scale, this.level.theme);
      else if (item.type === "flowers") drawFlowers(ctx, item.x, GROUND_Y, item.scale, this.level.theme);
      ctx.restore();
    }
  }

  drawQueueBirds(ctx) {
    if (!this.queue.length || this.state === "menu") return;
    const cfg = this.queue.map((t) => BIRDS[t] || BIRDS.red);
    for (let i = 0; i < Math.min(3, this.queue.length); i++) {
      const type = this.queue[i];
      const scale = 0.82 - i * 0.065;
      const x = this.portrait ? SLINGSHOT.x + 66 + i * 46 : SLINGSHOT.x - 58 - i * 44;
      const y = GROUND_Y - cfg[i].radius * scale + 1;
      drawBird(ctx, x, y + Math.sin(this.time * 2.2 + i) * 2, type, cfg[i].radius * scale, {
        time: this.time + i,
        angle: Math.sin(this.time * 1.6 + i) * 0.06,
        blink: Math.sin(this.time * 0.9 + i * 2.4) > 0.985 ? 1 : 0,
      });
    }
  }

  drawShadows(ctx) {
    for (const block of this.blocks) {
      if (block.plugin?.dead) continue;
      const p = block.plugin;
      const height = GROUND_Y - block.position.y;
      const alpha = clamp(0.24 - height / 2600, 0.05, 0.24);
      drawShadow(ctx, block.position.x, GROUND_Y + 11, Math.max(24, p.w * 0.62), 10, alpha);
    }
    for (const pig of this.pigs) {
      if (pig.plugin?.dead) continue;
      const height = GROUND_Y - pig.position.y;
      drawShadow(ctx, pig.position.x, GROUND_Y + 10, pig.plugin.r * 1.05, 9, clamp(0.22 - height / 2800, 0.04, 0.22));
    }
    for (const bird of this.flightBirds) {
      if (bird.plugin?.dead) continue;
      const height = GROUND_Y - bird.position.y;
      drawShadow(ctx, bird.position.x, GROUND_Y + 10, bird.plugin.radius * 1.02, 8, clamp(0.2 - height / 2600, 0.03, 0.2));
    }
  }

  drawBodies(ctx) {
    const bodies = [];
    for (const block of this.blocks) {
      if (!block.plugin?.dead) bodies.push({ body: block, y: block.position.y, kind: "block" });
    }
    for (const pig of this.pigs) {
      if (!pig.plugin?.dead) bodies.push({ body: pig, y: pig.position.y, kind: "pig" });
    }
    bodies.sort((a, b) => a.y - b.y);
    for (const item of bodies) {
      if (item.kind === "block") {
        const p = item.body.plugin;
        drawBlock(ctx, item.body, 1 - clamp(p.hp / p.maxHp, 0, 1));
      } else {
        const p = item.body.plugin;
        drawPig(ctx, item.body, clamp(p.hp / p.maxHp, 0, 1), this.time);
      }
    }
  }

  drawBirds(ctx) {
    for (const bird of this.flightBirds) {
      if (bird.plugin?.dead) continue;
      const p = bird.plugin;
      const vel = bird.velocity;
      const speed = Math.hypot(vel.x, vel.y);
      const angle = speed > 0.6 ? clamp(Math.atan2(vel.y, vel.x) * 0.24, -0.45, 0.45) : 0;
      drawBird(ctx, bird.position.x, bird.position.y, p.birdType, p.radius, {
        angle,
        time: this.time,
        blink: bird.plugin.landed && Math.sin(this.time * 1.5 + p.seed) > 0.99 ? 1 : 0,
        wing: p.landed ? 0 : Math.sin(this.time * 22) * 0.3,
      });
    }
    if (this.readyBird) {
      const bob = Math.sin(this.time * 2.4 + this.readyBird.bob) * 1.8;
      const cfg = BIRDS[this.readyBird.type] || BIRDS.red;
      let angle = 0;
      if (this.dragging && this.dragPos) {
        angle = clamp(Math.atan2(SLINGSHOT.anchorY - this.dragPos.y, SLINGSHOT.anchorX - this.dragPos.x) * 0.08, -0.3, 0.3);
      }
      const r = cfg.radius;
      drawBird(ctx, this.readyBird.x, this.readyBird.y + bob, this.readyBird.type, r, {
        angle,
        time: this.time,
        blink: Math.sin(this.time * 1.3 + this.readyBird.bob) > 0.99 ? 1 : 0,
        wing: this.dragging ? 0.3 : Math.sin(this.time * 2.2) * 0.16,
      });
    }
  }

  drawTrail(ctx) {
    if (!this.trail.length) return;
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const alpha = (i / this.trail.length) * 0.35 * Math.max(0, t.life / t.maxLife);
      ctx.fillStyle = `rgba(255, 249, 224, ${alpha})`;
      ellipse(ctx, t.x, t.y, 6 + i * 0.18, 5 + i * 0.14);
      ctx.fill();
    }
    ctx.restore();
  }

  predictTrajectory() {
    if (!this.readyBird || !this.dragPos) return [];
    const cfg = BIRDS[this.readyBird.type] || BIRDS.red;
    const dx = SLINGSHOT.anchorX - this.dragPos.x;
    const dy = SLINGSHOT.anchorY - this.dragPos.y;
    const pull = Math.hypot(dx, dy);
    if (pull < 10) return [];
    const power = clamp(pull / SLINGSHOT.maxPull, 0, 1);
    const speed = lerp(SLINGSHOT.minSpeed, SLINGSHOT.maxSpeed, power);
    let vx = (dx / pull) * speed;
    let vy = (dy / pull) * speed;
    let x = this.dragPos.x;
    let y = this.dragPos.y;
    const points = [];
    const friction = cfg.frictionAir;
    for (let i = 0; i < 150; i++) {
      vx *= 1 - friction;
      vy = vy * (1 - friction) + 0.2778;
      x += vx;
      y += vy;
      if (i % 4 === 0 && i > 3) points.push({ x, y });
      if (y > GROUND_Y - 4 || x > 1850 || x < -100) break;
    }
    return points;
  }

  drawAimPower(ctx) {
    const dx = SLINGSHOT.anchorX - this.dragPos.x;
    const dy = SLINGSHOT.anchorY - this.dragPos.y;
    const power = clamp(Math.hypot(dx, dy) / SLINGSHOT.maxPull, 0, 1);
    ctx.save();
    const bx = SLINGSHOT.anchorX - 54;
    const by = SLINGSHOT.anchorY - 130;
    ctx.fillStyle = "rgba(28, 22, 16, 0.42)";
    roundRect(ctx, bx - 7, by - 8, 122, 24, 12);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 249, 224, 0.22)";
    roundRect(ctx, bx, by, 108, 9, 4.5);
    ctx.fill();
    ctx.fillStyle = power > 0.85 ? "#ff7a3c" : power > 0.5 ? "#ffcf3f" : "#9fe06a";
    roundRect(ctx, bx, by, 108 * power, 9, 4.5);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 249, 224, 0.92)";
    ctx.font = "700 9px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POWER", SLINGSHOT.anchorX + 7, by - 18);
    ctx.restore();
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      const t = clamp(p.life / p.maxLife, 0, 1);
      ctx.save();
      if (p.type === "ring") {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.8})`;
        ctx.lineWidth = 6 * alpha + 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, TAU);
        ctx.stroke();
        ctx.restore();
        continue;
      }
      ctx.globalAlpha = t < 0.35 ? t / 0.35 : 1;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation || 0);
      const size = p.size * (0.6 + 0.4 * (p.life / p.maxLife));
      if (p.type === "smoke") {
        ctx.globalAlpha = t * 0.55;
        ctx.fillStyle = p.color;
        ellipse(ctx, 0, 0, size * (1.5 - t * 0.5), size * (1.5 - t * 0.5));
        ctx.fill();
      } else if (p.type === "confetti") {
        ctx.fillStyle = p.color;
        ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      } else if (p.type === "shard") {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, -size * 0.35);
        ctx.lineTo(size * 0.55, -size * 0.15);
        ctx.lineTo(size * 0.25, size * 0.5);
        ctx.lineTo(-size * 0.4, size * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === "spark") {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, TAU);
        ctx.fill();
        ctx.globalAlpha *= 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, TAU);
        ctx.fill();
      } else if (p.type === "pollen") {
        ctx.globalAlpha = t * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawScorePopups(ctx) {
    for (const p of this.scorePopups) {
      const t = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = t < 0.3 ? t / 0.3 : 1;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${p.size || 24}px Impact, "Arial Black", sans-serif`;
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(60, 24, 8, 0.75)";
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.color || "#ffe372";
      ctx.fillText(p.text, p.x, p.y);
      if (p.label) {
        ctx.font = `800 ${Math.max(11, (p.size || 24) * 0.44)}px "Trebuchet MS", sans-serif`;
        ctx.lineWidth = 4;
        ctx.strokeText(p.label, p.x, p.y + (p.size || 24) * 0.72);
        ctx.fillStyle = "#fff6d0";
        ctx.fillText(p.label, p.x, p.y + (p.size || 24) * 0.72);
      }
      ctx.restore();
    }
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}
