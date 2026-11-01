import { clamp, rand, dist, COLORS, W, H } from './config.js';
import { drawPlayer, drawSlime, drawBat, drawSkeleton, drawWarden, drawBoss } from './sprites.js';

const TAU = Math.PI * 2;

export class Player {
  constructor(game, x, y, facing = 'down') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.r = 6;
    this.hp = 5;
    this.maxHp = 5;
    this.keys = 0;
    this.bossKey = false;
    this.attackTimer = 0;
    this.attackDuration = 0.26;
    this.attackCooldown = 0;
    this.hitSet = new Set();
    this.invuln = 0;
    this.walkTime = 0;
    this.moving = false;
    this.kbx = 0;
    this.kby = 0;
    this.dead = false;
    this.stepTimer = 0;
  }

  update(dt) {
    const g = this.game;
    const input = g.input;
    this.invuln = Math.max(0, this.invuln - dt);
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);

    const axis = g.canControl() ? input.readAxis() : { x: 0, y: 0 };
    const speed = this.attackTimer > 0 ? 46 : 104;
    let dx = axis.x * speed * dt;
    let dy = axis.y * speed * dt;

    this.moving = Math.abs(axis.x) + Math.abs(axis.y) > 0.15;
    if (this.moving) {
      if (Math.abs(axis.x) > Math.abs(axis.y) + 0.2) this.facing = axis.x < 0 ? 'left' : 'right';
      else if (Math.abs(axis.y) > Math.abs(axis.x) + 0.2) this.facing = axis.y < 0 ? 'up' : 'down';
      else if (this.facing === 'left' || this.facing === 'right') {
        if (Math.abs(axis.x) > 0.4) this.facing = axis.x < 0 ? 'left' : 'right';
      } else if (Math.abs(axis.y) > 0.4) {
        this.facing = axis.y < 0 ? 'up' : 'down';
      }
      this.walkTime += dt;
      this.stepTimer -= dt;
      if (this.stepTimer <= 0) {
        this.stepTimer = 0.3;
        g.audio.sfx('step');
        g.dust(this.x, this.y + 10, 1);
      }
    } else {
      this.walkTime = 0;
    }

    // knockback
    dx += this.kbx * dt;
    dy += this.kby * dt;
    this.kbx *= Math.pow(0.0025, dt);
    this.kby *= Math.pow(0.0025, dt);

    g.moveBody(this, dx, dy);

    if (g.canControl() && input.justPressed('attack') && this.attackCooldown <= 0 && this.attackTimer <= 0) {
      this.startAttack();
    }
    if (g.canControl() && input.justPressed('interact')) {
      g.tryInteract(this);
    }

    if (this.attackTimer > 0) {
      const elapsed = this.attackDuration - this.attackTimer;
      if (elapsed >= 0.04 && elapsed <= 0.19) this.resolveSwordHits();
    }

    if (this.invuln > 0 && this.invuln < 0.05) this.invuln = 0;
  }

  startAttack() {
    const g = this.game;
    this.attackTimer = this.attackDuration;
    this.attackCooldown = 0.34;
    this.hitSet.clear();
    g.audio.sfx('swing');
    // tiny lunge
    const v = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[this.facing];
    this.kbx += v[0] * 44;
    this.kby += v[1] * 44;
  }

  attackBox() {
    const x = this.x;
    const y = this.y;
    if (this.facing === 'right') return { x: x + 2, y: y - 11, w: 26, h: 22 };
    if (this.facing === 'left') return { x: x - 28, y: y - 11, w: 26, h: 22 };
    if (this.facing === 'down') return { x: x - 11, y: y + 2, w: 22, h: 26 };
    return { x: x - 11, y: y - 28, w: 22, h: 26 };
  }

  resolveSwordHits() {
    const g = this.game;
    const box = this.attackBox();

    for (const e of g.enemies) {
      if (e.dead || this.hitSet.has(e.id)) continue;
      const eb = { x: e.x - e.r, y: e.y - e.r, w: e.r * 2, h: e.r * 2 };
      if (box.x < eb.x + eb.w && box.x + box.w > eb.x && box.y < eb.y + eb.h && box.y + box.h > eb.y) {
        this.hitSet.add(e.id);
        const dirx = e.x - this.x;
        const diry = e.y - this.y;
        const len = Math.hypot(dirx, diry) || 1;
        if (e.type === 'boss') {
          if (e.exposed > 0) {
            e.hurt(1, (dirx / len) * 160, (diry / len) * 160);
          } else {
            g.audio.sfx('clang');
            g.spark(e.x, e.y, 7, '#cfd8e8');
            g.shake = Math.max(g.shake, 2);
          }
        } else {
          e.hurt(1, (dirx / len) * 120, (diry / len) * 120);
        }
        g.hitStop = Math.max(g.hitStop, 0.035);
      }
    }

    // break pots
    for (const pot of g.roomState.pots) {
      if (pot.broken) continue;
      if (box.x < pot.x + 7 && box.x + box.w > pot.x - 7 && box.y < pot.y + 7 && box.y + box.h > pot.y - 7) {
        g.breakPot(pot);
      }
    }

    // open chests
    for (const chest of g.roomState.chests) {
      if (chest.opened || chest.hidden) continue;
      if (box.x < chest.x + 10 && box.x + box.w > chest.x - 10 && box.y < chest.y + 9 && box.y + box.h > chest.y - 9) {
        g.openChest(chest);
      }
    }

    // deflect projectiles
    for (const pr of g.projectiles) {
      if (pr.owner !== 'enemy' || pr.dead) continue;
      if (pr.kind === 'shock') continue;
      if (pr.x + pr.r > box.x && pr.x - pr.r < box.x + box.w && pr.y + pr.r > box.y && pr.y - pr.r < box.y + box.h) {
        pr.dead = true;
        g.spark(pr.x, pr.y, 5, '#d8e8ff');
        g.audio.sfx('clang');
      }
    }
  }

  hurt(amount, fromX, fromY) {
    if (this.invuln > 0 || this.dead || this.game.mode !== 'playing') return;
    const g = this.game;
    this.hp -= amount;
    this.invuln = 1.25;
    g.audio.sfx('hurt');
    g.shake = Math.max(g.shake, 5);
    g.hitStop = Math.max(g.hitStop, 0.07);
    g.flashRed = 0.16;
    const dx = this.x - fromX;
    const dy = this.y - fromY;
    const len = Math.hypot(dx, dy) || 1;
    this.kbx = (dx / len) * 210;
    this.kby = (dy / len) * 210;
    g.spark(this.x, this.y - 4, 8, '#ff6b6b');
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  heal(n = 1) {
    this.hp = clamp(this.hp + n, 0, this.maxHp);
    this.game.audio.sfx('heart');
    this.game.spark(this.x, this.y - 6, 8, '#ff8fa3');
  }

  die() {
    this.dead = true;
    this.game.onPlayerDeath();
  }

  draw(ctx, t) {
    drawPlayer(ctx, this, t);
  }
}

// ---------------------------------------------------------------------------
// Enemies
// ---------------------------------------------------------------------------
let enemyId = 1;

export class Enemy {
  constructor(game, type, x, y) {
    this.game = game;
    this.type = type;
    this.id = enemyId++;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.kbx = 0;
    this.kby = 0;
    this.flash = 0;
    this.dead = false;
    this.seed = rand(0, 100);
    this.animTime = rand(0, 10);
    this.contactCooldown = 0;
    this.hp = 1;
    this.maxHp = 1;
    this.r = 8;
    this.speed = 40;
    this.state = 'idle';
    this.stateTimer = 0;
    this.configure();
  }

  configure() {
    if (this.type === 'slime') {
      this.hp = this.maxHp = 2;
      this.r = 8;
      this.speed = 72;
      this.hop = 0;
      this.hopTimer = rand(0.3, 1.2);
    } else if (this.type === 'bat') {
      this.hp = this.maxHp = 1;
      this.r = 6;
      this.speed = 58;
      this.orbit = rand(0, TAU);
    } else if (this.type === 'skeleton') {
      this.hp = this.maxHp = 3;
      this.r = 8;
      this.speed = 34;
      this.shootTimer = rand(0.8, 2.2);
      this.strafe = Math.random() < 0.5 ? 1 : -1;
    } else if (this.type === 'warden') {
      this.hp = this.maxHp = 12;
      this.r = 15;
      this.speed = 34;
      this.state = 'chase';
      this.stateTimer = 0;
      this.attackTimer = 2.2;
      this.chargeDir = { x: 0, y: 1 };
      this.isBoss = true;
    }
  }

  update(dt) {
    if (this.dead) return;
    this.flash = Math.max(0, this.flash - dt);
    this.animTime += dt;
    this.contactCooldown = Math.max(0, this.contactCooldown - dt);
    const g = this.game;
    const p = g.player;

    if (this.type === 'slime') this.updateSlime(dt, p);
    else if (this.type === 'bat') this.updateBat(dt, p);
    else if (this.type === 'skeleton') this.updateSkeleton(dt, p);
    else if (this.type === 'warden') this.updateWarden(dt, p);

    // knockback + movement
    const dx = this.vx * dt + this.kbx * dt;
    const dy = this.vy * dt + this.kby * dt;
    const blocked = g.moveBody(this, dx, dy);
    this.kbx *= Math.pow(0.002, dt);
    this.kby *= Math.pow(0.002, dt);

    if (this.type === 'warden' && this.state === 'charge' && blocked) {
      this.wallSlam();
    }

    // contact damage
    if (!p.dead && dist(this.x, this.y, p.x, p.y) < this.r + 7 && this.contactCooldown <= 0) {
      p.hurt(1, this.x, this.y);
      this.contactCooldown = 0.6;
    }
  }

  updateSlime(dt, p) {
    this.hopTimer -= dt;
    if (this.hop > 0) {
      this.hop -= dt;
      this.vx = this.hopVx;
      this.vy = this.hopVy;
    } else {
      this.vx = 0;
      this.vy = 0;
      if (this.hopTimer <= 0) {
        const d = dist(this.x, this.y, p.x, p.y);
        if (d < 300) {
          const dx = p.x - this.x;
          const dy = p.y - this.y;
          const len = Math.hypot(dx, dy) || 1;
          this.hopVx = (dx / len) * this.speed;
          this.hopVy = (dy / len) * this.speed;
          this.hop = 0.36;
          this.hopTimer = rand(1.0, 1.5);
          this.game.audio.sfx('step');
        } else {
          this.hopTimer = 0.8;
        }
      }
    }
  }

  updateBat(dt, p) {
    this.orbit += dt * 1.7;
    const d = dist(this.x, this.y, p.x, p.y);
    const tx = p.x + Math.cos(this.orbit) * 42;
    const ty = p.y + Math.sin(this.orbit * 1.3) * 30 - 12;
    let dx = tx - this.x;
    let dy = ty - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const speed = d > 180 ? this.speed * 1.5 : this.speed;
    this.vx = (dx / len) * speed;
    this.vy = (dy / len) * speed;
    if (this.x < 20) this.vx += 60;
    if (this.x > W - 20) this.vx -= 60;
    if (this.y < 22) this.vy += 60;
    if (this.y > H - 22) this.vy -= 60;
  }

  updateSkeleton(dt, p) {
    const d = dist(this.x, this.y, p.x, p.y);
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    let mx = 0;
    let my = 0;
    if (d < 90) {
      mx = -dx;
      my = -dy;
    } else if (d > 140) {
      mx = dx;
      my = dy;
    } else {
      mx = -dy * this.strafe;
      my = dx * this.strafe;
    }
    this.vx = mx * this.speed;
    this.vy = my * this.speed;
    this.shootTimer -= dt;
    if (this.shootTimer <= 0 && d < 300) {
      this.shootTimer = rand(1.9, 2.7);
      this.game.spawnArrow(this.x, this.y - 2, Math.atan2(p.y - this.y, p.x - this.x));
      this.game.audio.sfx('swing');
    }
  }

  updateWarden(dt, p) {
    const g = this.game;
    const d = dist(this.x, this.y, p.x, p.y);
    if (this.state === 'chase') {
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      const len = Math.hypot(dx, dy) || 1;
      this.vx = (dx / len) * this.speed;
      this.vy = (dy / len) * this.speed;
      this.attackTimer -= dt;
      if (this.attackTimer <= 0 && d < 260) {
        this.state = 'telegraph';
        this.stateTimer = 0.68;
        this.vx = 0;
        this.vy = 0;
        g.audio.sfx('clang');
      }
    } else if (this.state === 'telegraph') {
      this.vx = 0;
      this.vy = 0;
      this.stateTimer -= dt;
      this.chargeDir.x = p.x - this.x;
      this.chargeDir.y = p.y - this.y;
      const len = Math.hypot(this.chargeDir.x, this.chargeDir.y) || 1;
      this.chargeDir.x /= len;
      this.chargeDir.y /= len;
      if (this.stateTimer <= 0) {
        this.state = 'charge';
        this.stateTimer = 1.1;
        this.vx = this.chargeDir.x * 330;
        this.vy = this.chargeDir.y * 330;
        g.audio.sfx('swing');
      }
    } else if (this.state === 'charge') {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.state = 'recover';
        this.stateTimer = 0.3;
        this.vx = 0;
        this.vy = 0;
      }
    } else if (this.state === 'stunned') {
      this.vx = 0;
      this.vy = 0;
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.state = 'chase';
        this.attackTimer = 1.4;
      }
    } else if (this.state === 'recover') {
      this.vx = 0;
      this.vy = 0;
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.state = 'chase';
        this.attackTimer = 1.1;
      }
    }
  }

  wallSlam() {
    if (this.state !== 'charge') return;
    const g = this.game;
    this.state = 'stunned';
    this.stateTimer = 2.3;
    this.vx = 0;
    this.vy = 0;
    g.shake = Math.max(g.shake, 10);
    g.hitStop = 0.08;
    g.audio.sfx('explosion');
    g.dust(this.x, this.y + 12, 18);
    g.spark(this.x, this.y, 16, '#ffd27a');
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      g.projectiles.push(new Projectile(g, this.x, this.y, Math.cos(a) * 95, Math.sin(a) * 95, 'rock', 1, 'enemy'));
    }
  }

  hurt(amount, kx = 0, ky = 0) {
    if (this.dead) return;
    this.hp -= amount;
    this.flash = 0.12;
    this.kbx += kx;
    this.kby += ky;
    const g = this.game;
    g.audio.sfx('slashHit');
    g.spark(this.x, this.y - 4, 6, '#fff1b8');
    if (this.hp <= 0) this.die();
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    const g = this.game;
    g.audio.sfx('hit');
    g.burst(this.x, this.y, this.isBoss ? 30 : 14, this.type === 'bat' ? '#9a6bd8' : '#6fcf7f');
    if (this.type === 'warden') {
      g.shake = Math.max(g.shake, 12);
      g.audio.sfx('explosion');
      g.revealChest('vault-boss-key');
    }
    if (this.type !== 'warden' && Math.random() < 0.22) {
      g.spawnPickup(this.x, this.y, 'heart');
    }
    g.onEnemyDeath(this);
  }

  draw(ctx, t) {
    if (this.dead) return;
    if (this.type === 'slime') drawSlime(ctx, this, t);
    else if (this.type === 'bat') drawBat(ctx, this, t);
    else if (this.type === 'skeleton') drawSkeleton(ctx, this, t);
    else if (this.type === 'warden') drawWarden(ctx, this, t);
  }
}

// ---------------------------------------------------------------------------
// The boss
// ---------------------------------------------------------------------------
export class Boss {
  constructor(game, x, y) {
    this.game = game;
    this.type = 'boss';
    this.id = enemyId++;
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;
    this.r = 27;
    this.hp = 12;
    this.maxHp = 12;
    this.flash = 0;
    this.dead = false;
    this.seed = 1;
    this.state = 'intro';
    this.stateTimer = 2.0;
    this.exposed = 0;
    this.exposeAmount = 0;
    this.stunned = 0;
    this.phase = 1;
    this.attackCycle = 0;
    this.chargeDir = { x: 0, y: 1 };
    this.contactCooldown = 0;
    this.hoverTarget = { x: W / 2, y: 96 };
    this.vx = 0;
    this.vy = 0;
    this.intro = true;
    this.dying = 0;
    this.deathBurst = 0;
  }

  update(dt) {
    if (this.dead) return;
    const g = this.game;
    const p = g.player;
    this.flash = Math.max(0, this.flash - dt);
    this.contactCooldown = Math.max(0, this.contactCooldown - dt);
    this.exposeAmount = clamp(this.exposeAmount + (this.exposed > 0 ? dt * 4 : -dt * 3), 0, 1);
    this.phase = this.hp > 8 ? 1 : this.hp > 4 ? 2 : 3;

    if (this.dying > 0) {
      this.dying -= dt;
      this.deathBurst -= dt;
      this.y += Math.sin(g.time * 20) * 0.4;
      if (this.deathBurst <= 0) {
        this.deathBurst = 0.22;
        const a = rand(0, TAU);
        const r = rand(5, 34);
        g.burst(this.x + Math.cos(a) * r, this.y + Math.sin(a) * r, 10, '#ff8a5a');
        g.audio.sfx('explosion');
        g.shake = Math.max(g.shake, 7);
      }
      if (this.dying <= 0) {
        this.dead = true;
        g.onBossDefeated();
      }
      return;
    }

    if (this.state === 'intro') {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.state = 'hover';
        this.stateTimer = 1.1;
        this.intro = false;
        g.audio.sfx('roar');
        g.shake = Math.max(g.shake, 9);
      }
      return;
    }

    if (this.state === 'hover') {
      const dx = this.hoverTarget.x - this.x;
      const dy = this.hoverTarget.y - this.y;
      const len = Math.hypot(dx, dy) || 1;
      const sp = 44 + this.phase * 8;
      this.x += (dx / len) * Math.min(sp, len * 2) * dt;
      this.y += (dy / len) * Math.min(sp, len * 2) * dt;
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.attackCycle++;
        if (this.attackCycle % 3 === 0 && this.phase >= 2) this.startSummon();
        else if (this.attackCycle % 3 === 1) this.startSpray();
        else this.startTelegraph(p);
      }
    } else if (this.state === 'spray') {
      this.stateTimer -= dt;
      if (!this.sprayed && this.stateTimer <= 0.42) {
        this.sprayed = true;
        const n = 8 + this.phase * 2;
        const offset = rand(0, TAU);
        for (let i = 0; i < n; i++) {
          const a = offset + (i / n) * TAU;
          const speed = 72 + this.phase * 10;
          g.projectiles.push(new Projectile(g, this.x, this.y, Math.cos(a) * speed, Math.sin(a) * speed, 'orb', 1, 'enemy'));
        }
        g.audio.sfx('roar');
        g.shake = Math.max(g.shake, 5);
      }
      if (this.stateTimer <= 0) {
        this.state = 'hover';
        this.stateTimer = 0.9;
        this.hoverTarget = { x: rand(150, W - 150), y: rand(78, 132) };
      }
    } else if (this.state === 'summon') {
      this.stateTimer -= dt;
      if (!this.summoned && this.stateTimer <= 0.5) {
        this.summoned = true;
        const spots = [
          { x: 90, y: 100 },
          { x: W - 90, y: 100 },
          { x: 120, y: H - 90 },
          { x: W - 120, y: H - 90 },
        ];
        const count = this.phase >= 3 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const spot = spots[i];
          const bat = new Enemy(g, 'bat', spot.x, spot.y);
          g.enemies.push(bat);
          g.burst(spot.x, spot.y, 12, '#9a6bd8');
        }
        g.audio.sfx('roar');
      }
      if (this.stateTimer <= 0) {
        this.state = 'hover';
        this.stateTimer = 0.8;
      }
    } else if (this.state === 'telegraph') {
      this.stateTimer -= dt;
      this.chargeDir.x = p.x - this.x;
      this.chargeDir.y = p.y - this.y;
      const len = Math.hypot(this.chargeDir.x, this.chargeDir.y) || 1;
      this.chargeDir.x /= len;
      this.chargeDir.y /= len;
      if (this.stateTimer <= 0) {
        this.state = 'charge';
        this.stateTimer = 1.2;
        this.vx = this.chargeDir.x * (300 + this.phase * 22);
        this.vy = this.chargeDir.y * (300 + this.phase * 22);
        g.audio.sfx('roar');
      }
    } else if (this.state === 'charge') {
      this.stateTimer -= dt;
      const blocked = g.moveBody(this, this.vx * dt, this.vy * dt);
      if (blocked) {
        this.slam();
      } else if (this.stateTimer <= 0) {
        this.vx = 0;
        this.vy = 0;
        this.state = 'hover';
        this.stateTimer = 0.7;
        this.hoverTarget = { x: rand(160, W - 160), y: rand(80, 130) };
      }
    } else if (this.state === 'stunned') {
      this.stunned = Math.max(0, this.stunned - dt);
      this.exposed = this.stunned > 0 ? 1 : 0;
      if (this.stunned <= 0) {
        this.state = 'hover';
        this.stateTimer = 0.8;
        this.hoverTarget = { x: rand(150, W - 150), y: rand(78, 132) };
        this.attackCycle = 0;
        g.audio.sfx('clang');
      }
    }

    // contact
    if (!p.dead && dist(this.x, this.y, p.x, p.y) < this.r + 8 && this.contactCooldown <= 0) {
      p.hurt(1, this.x, this.y);
      this.contactCooldown = 0.7;
    }
  }

  startTelegraph(p) {
    this.state = 'telegraph';
    this.stateTimer = 0.72;
    this.sprayed = false;
    this.summoned = false;
    this.game.audio.sfx('clang');
    this.chargeDir.x = p.x - this.x;
    this.chargeDir.y = p.y - this.y;
  }

  startSpray() {
    this.state = 'spray';
    this.stateTimer = 1.1;
    this.sprayed = false;
    this.hoverTarget = { x: W / 2, y: 95 };
    this.game.audio.sfx('secret');
  }

  startSummon() {
    this.state = 'summon';
    this.stateTimer = 1.3;
    this.summoned = false;
  }

  slam() {
    const g = this.game;
    this.state = 'stunned';
    this.stunned = this.phase >= 3 ? 1.8 : 2.4;
    this.exposed = 1;
    this.vx = 0;
    this.vy = 0;
    g.shake = Math.max(g.shake, 13);
    g.hitStop = 0.09;
    g.audio.sfx('explosion');
    g.burst(this.x, this.y, 26, '#ffb35a');
    const n = 4 + this.phase;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rand(-0.1, 0.1);
      g.projectiles.push(new Projectile(g, this.x, this.y, Math.cos(a) * 100, Math.sin(a) * 100, 'rock', 1, 'enemy'));
    }
    g.projectiles.push(new Projectile(g, this.x, this.y, 0, 0, 'shock', 1, 'enemy'));
  }

  hurt(amount, kx = 0, ky = 0) {
    if (this.dead || this.dying > 0) return;
    if (this.exposed <= 0) {
      this.game.audio.sfx('clang');
      return;
    }
    this.hp -= amount;
    this.flash = 0.13;
    this.kbx += kx * 0.2;
    this.kby += ky * 0.2;
    const g = this.game;
    g.audio.sfx('slashHit');
    g.burst(this.x, this.y, 12, '#ff7b6b');
    g.shake = Math.max(g.shake, 5);
    if (this.hp <= 0) {
      this.hp = 0;
      this.dying = 3.2;
      this.exposed = 0;
      g.audio.sfx('roar');
      g.audio.setMusic(null);
      g.shake = Math.max(g.shake, 15);
    }
  }

  draw(ctx, t) {
    drawBoss(ctx, this, t, this.game.player);
  }
}

// ---------------------------------------------------------------------------
// Projectiles
// ---------------------------------------------------------------------------
export class Projectile {
  constructor(game, x, y, vx, vy, kind, damage, owner) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kind = kind;
    this.damage = damage;
    this.owner = owner;
    this.dead = false;
    this.r = kind === 'orb' ? 5 : kind === 'rock' ? 6 : kind === 'shock' ? 4 : 3;
    this.life = kind === 'shock' ? 0.9 : 5;
    this.maxLife = this.life;
    this.spin = rand(0, TAU);
    this.hitPlayer = false;
  }

  update(dt) {
    if (this.dead) return;
    this.life -= dt;
    this.spin += dt * 6;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }
    if (this.kind === 'shock') {
      this.r += dt * 190;
      const p = this.game.player;
      const d = dist(this.x, this.y, p.x, p.y);
      if (!this.hitPlayer && Math.abs(d - this.r) < 9) {
        p.hurt(this.damage, this.x, this.y);
        this.hitPlayer = true;
      }
      return;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.kind === 'rock') this.vy += 8 * dt;

    if (this.game.circleCollides(this.x, this.y, this.r, true)) {
      this.dead = true;
      this.game.spark(this.x, this.y, 4, '#cfc6ae');
      return;
    }
    if (this.owner === 'enemy') {
      const p = this.game.player;
      if (!p.dead && dist(this.x, this.y, p.x, p.y) < this.r + 6) {
        p.hurt(this.damage, this.x - this.vx, this.y - this.vy);
        this.dead = true;
      }
    }
  }

  draw(ctx, t) {
    // handled by sprite module in game render
  }
}

// ---------------------------------------------------------------------------
// Pickups & particles
// ---------------------------------------------------------------------------
export class Pickup {
  constructor(game, x, y, kind) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.kind = kind;
    this.seed = rand(0, 100);
    this.life = 14;
    this.dead = false;
    this.vy = -42;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
    // little pop then settle
    this.vy += 130 * dt;
    this.y += this.vy * dt;
    if (this.vy > 0 && this.life > 13.4) {
      this.vy = 0;
      this.y = Math.round(this.y);
    }
    const p = this.game?.player;
    if (p && dist(this.x, this.y, p.x, p.y) < 15) {
      this.collect(p);
    }
  }

  collect(p) {
    if (this.dead) return;
    this.dead = true;
    if (this.kind === 'heart') {
      p.heal(1);
    }
  }
}
