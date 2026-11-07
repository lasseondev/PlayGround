// Enemy and boss behaviour, death resolution.
import { TAU, clamp, damp, rnd, chance, pick, dist, angleTo, angleDiff, approachAngle, norm } from './core.js';
import { ENEMY_TYPES } from './data.js';
import { ROOM_W, ROOM_H, MARGIN } from './constants.js';

export const aiMethods = {
  updateEnemies(dt) {
    const p = this.player;
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.spawnT > 0) { e.spawnT -= dt; continue; }
      if (e.hurtFlash > 0) e.hurtFlash -= dt;
      if (e.showHp > 0) e.showHp -= dt;

      // poison
      if (e.poison > 0) {
        e.poison -= dt;
        e.poisonTick += dt;
        while (e.poisonTick >= 0.5 && e.poison > 0) {
          e.poisonTick -= 0.5;
          const dmg = (e.poisonDps || 6) * (e.poisonStacks || 1) * 0.5;
          e.hp -= dmg;
          e.showHp = 1.4;
          this.float(e.x + rnd(8, -8), e.y - e.radius * 1.9, Math.round(dmg), 'poison');
          for (let i = 0; i < 2; i++) {
            this.particles.push({
              x: e.x + rnd(10, -10), y: e.y - e.radius * 1.2, vx: rnd(10, -10), vy: rnd(-30, -60),
              t: 0, life: 0.5, kind: 'spark', color: '#b6ff8a', size: 1.6,
            });
          }
          if (e.hp <= 0) { this.killEnemy(e); break; }
        }
      }
      if (e.dead) continue;

      // doom
      if (e.doom > 0) {
        e.doom -= dt;
        if (e.doom <= 0) {
          const dmg = e.doomDmg || 40;
          this.burst(e.x, e.y - e.radius, '#ff5040', 22, 230, 'spark');
          this.ring(e.x, e.y - 10, 110, '#ff5040');
          this.audio.sfx('thunder');
          this.shake(5);
          const others = this.enemies.filter((o) => o !== e && !o.dead && dist(o.x, o.y, e.x, e.y) < 135);
          for (const o of others) this.damageEnemy(o, dmg, { direct: false, raw: true });
          e.hp -= dmg;
          e.showHp = 2;
          this.float(e.x, e.y - e.radius * 2, Math.round(dmg), 'crit');
          if (e.hp <= 0) { this.killEnemy(e); continue; }
        }
      }
      if (e.weaken > 0) e.weaken -= dt;
      if (e.slow > 0) e.slow -= dt;

      const d = dist(e.x, e.y, p.x, p.y) || 1;
      e.face = angleTo(e.x, e.y, p.x, p.y);
      if (e.kind === 'melee') this.aiMelee(e, dt, d);
      else if (e.kind === 'dash') this.aiShade(e, dt, d);
      else if (e.kind === 'ranged') this.aiArcher(e, dt, d);
      else if (e.kind === 'slam') this.aiBrute(e, dt, d);
      else if (e.kind === 'caster') this.aiWitch(e, dt, d);

      e.x = clamp(e.x, MARGIN + e.radius, ROOM_W - MARGIN - e.radius);
      e.y = clamp(e.y, MARGIN + e.radius, ROOM_H - MARGIN - e.radius);
      this.resolveObstacles(e);
    }
    // separation
    for (let i = 0; i < this.enemies.length; i++) {
      const a = this.enemies[i];
      if (a.dead || a.spawnT > 0) continue;
      for (let j = i + 1; j < this.enemies.length; j++) {
        const b = this.enemies[j];
        if (b.dead || b.spawnT > 0) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dd = Math.hypot(dx, dy) || 1;
        const need = (a.radius + b.radius) * 0.92;
        if (dd < need) {
          const push = (need - dd) / dd * 0.5;
          const ma = a.mass || 1, mb = b.mass || 1;
          const wa = mb / (ma + mb), wb = ma / (ma + mb);
          a.x -= dx * push * wa; a.y -= dy * push * wa;
          b.x += dx * push * wb; b.y += dy * push * wb;
        }
      }
    }
    this.enemies = this.enemies.filter((e) => !e.dead);
  },

  resolveObstacles(e) {
    for (const o of this.obstacles) {
      const d = dist(e.x, e.y, o.x, o.y);
      const need = o.r + e.radius * 0.8;
      if (d < need && d > 0.01) {
        const nx = (e.x - o.x) / d, ny = (e.y - o.y) / d;
        e.x = o.x + nx * need;
        e.y = o.y + ny * need;
      }
    }
  },

  enemyMove(e, dx, dy, mult, dt) {
    const slow = e.slow > 0 ? clamp(1 - e.slowAmt, 0.35, 1) : 1;
    const sp = e.speed * mult * slow;
    e.vx = damp(e.vx, dx * sp, 7, dt);
    e.vy = damp(e.vy, dy * sp, 7, dt);
    e.x += (e.vx + e.knockVx) * dt;
    e.y += (e.vy + e.knockVy) * dt;
    e.knockVx *= Math.exp(-7 * dt);
    e.knockVy *= Math.exp(-7 * dt);
    if (Math.hypot(e.vx, e.vy) > 12) e.walkPhase += dt * 9;
  },

  contactDamage(e, range, dmg, angle) {
    const p = this.player;
    if (dist(e.x, e.y, p.x, p.y) < range + p.radius) {
      this.damagePlayer(dmg, angle ?? angleTo(e.x, e.y, p.x, p.y));
      return true;
    }
    return false;
  },

  aiMelee(e, dt, d) {
    e.cooldown -= dt;
    if (e.state === 'windup') {
      e.windup = Math.max(0, e.stateT);
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 10, dt); e.vy = damp(e.vy, 0, 10, dt);
      e.x += e.knockVx * dt; e.y += e.knockVy * dt;
      e.knockVx *= Math.exp(-7 * dt); e.knockVy *= Math.exp(-7 * dt);
      if (e.stateT <= 0) {
        e.state = 'attack'; e.stateT = 0.22; e.attackDir = e.face; e.hitThisAttack = false;
        this.audio.sfx('slash');
      }
      return;
    }
    if (e.state === 'attack') {
      e.stateT -= dt;
      e.x += Math.cos(e.attackDir) * 420 * dt;
      e.y += Math.sin(e.attackDir) * 420 * dt;
      if (!e.hitThisAttack) {
        e.hitThisAttack = this.contactDamage(e, e.radius + 15, e.dmg * (e.weaken > 0 ? 0.6 : 1), e.attackDir);
      }
      if (e.stateT <= 0) { e.state = 'recover'; e.stateT = 0.5; e.cooldown = 1.25 + rnd(0.5); }
      return;
    }
    e.windup = 0;
    if (e.state === 'recover') {
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 8, dt); e.vy = damp(e.vy, 0, 8, dt);
      if (e.stateT <= 0) e.state = 'chase';
      return;
    }
    if (d < e.radius + 48 && e.cooldown <= 0) {
      e.state = 'windup'; e.stateT = 0.52; e.windup = 0.52;
      e.audioPinged = true;
      return;
    }
    if (d > e.radius + 36) this.enemyMove(e, (this.player.x - e.x) / d, (this.player.y - e.y) / d, 1, dt);
    else this.enemyMove(e, 0, 0, 0, dt);
  },

  aiShade(e, dt, d) {
    e.cooldown -= dt;
    if (e.state === 'windup') {
      e.stateT -= dt;
      e.vx = 0; e.vy = 0;
      e.x += e.knockVx * dt; e.y += e.knockVy * dt;
      e.knockVx *= Math.exp(-7 * dt); e.knockVy *= Math.exp(-7 * dt);
      if (e.stateT <= 0) {
        e.state = 'attack'; e.stateT = 0.24; e.attackDir = e.face; e.hitThisAttack = false;
        this.audio.sfx('dash');
      }
      return;
    }
    if (e.state === 'attack') {
      e.stateT -= dt;
      e.x += Math.cos(e.attackDir) * 760 * dt;
      e.y += Math.sin(e.attackDir) * 760 * dt;
      if (!e.hitThisAttack) {
        e.hitThisAttack = this.contactDamage(e, e.radius + 8, e.dmg * (e.weaken > 0 ? 0.6 : 1), e.attackDir);
      }
      if (Math.random() < dt * 30) this.particles.push({ x: e.x, y: e.y - 20, vx: 0, vy: 0, t: 0, life: 0.3, kind: 'spark', color: '#79e8ff', size: 2 });
      if (e.stateT <= 0) { e.state = 'recover'; e.stateT = 0.65; e.cooldown = 1.5 + rnd(0.6); }
      return;
    }
    if (e.state === 'recover') {
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 8, dt); e.vy = damp(e.vy, 0, 8, dt);
      if (e.stateT <= 0) e.state = 'chase';
      return;
    }
    if (d < 210 && e.cooldown <= 0) {
      e.state = 'windup'; e.stateT = 0.42;
      return;
    }
    const perp = Math.sin(this.time * 2 + e.seed) * 0.5;
    const tx = (this.player.x - e.x) / d + -((this.player.y - e.y) / d) * perp;
    const ty = (this.player.y - e.y) / d + ((this.player.x - e.x) / d) * perp;
    this.enemyMove(e, norm(tx, ty).x, norm(tx, ty).y, d > 170 ? 1 : -0.5, dt);
  },

  aiArcher(e, dt, d) {
    e.cooldown -= dt;
    if (e.state === 'windup') {
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 8, dt); e.vy = damp(e.vy, 0, 8, dt);
      e.x += e.knockVx * dt; e.y += e.knockVy * dt;
      e.knockVx *= Math.exp(-7 * dt); e.knockVy *= Math.exp(-7 * dt);
      e.windup = e.stateT;
      if (e.stateT <= 0) {
        e.state = 'recover'; e.stateT = 0.3; e.windup = 0; e.cooldown = 2.0 + rnd(0.8);
        const a = angleTo(e.x, e.y - 28, this.player.x, this.player.y - 14);
        const sp = 400;
        this.addProjectile({
          x: e.x, y: e.y - 28, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          dmg: e.dmg * (e.weaken > 0 ? 0.6 : 1), radius: 6, enemy: true, type: 'arrow',
          color: '#ffb35a', life: 3,
        });
        this.audio.sfx('slash');
      }
      return;
    }
    if (e.state === 'recover') {
      e.stateT -= dt;
      if (e.stateT <= 0) e.state = 'chase';
      return;
    }
    e.windup = 0;
    if (e.cooldown <= 0 && d < 540) {
      e.state = 'windup'; e.stateT = 0.55; e.windup = 0.55;
      return;
    }
    let dx = 0, dy = 0;
    if (d < 230) { dx = (e.x - this.player.x) / d; dy = (e.y - this.player.y) / d; }
    else if (d > 360) { dx = (this.player.x - e.x) / d; dy = (this.player.y - e.y) / d; }
    else {
      const a = angleTo(e.x, e.y, this.player.x, this.player.y) + Math.PI / 2 * (e.seed % 2 > 1 ? 1 : -1);
      dx = Math.cos(a) * 0.6; dy = Math.sin(a) * 0.6;
    }
    this.enemyMove(e, dx, dy, 1, dt);
  },

  aiBrute(e, dt, d) {
    e.cooldown -= dt;
    if (e.state === 'windup') {
      e.stateT -= dt;
      e.windup = e.stateT;
      e.vx = damp(e.vx, 0, 8, dt); e.vy = damp(e.vy, 0, 8, dt);
      e.x += e.knockVx * dt; e.y += e.knockVy * dt;
      e.knockVx *= Math.exp(-7 * dt); e.knockVy *= Math.exp(-7 * dt);
      if (e.stateT <= 0) {
        e.state = 'recover'; e.stateT = 0.95; e.windup = 0; e.cooldown = 2.3 + rnd(0.7);
        e.state = 'recover';
        this.shake(7);
        this.audio.sfx('heavy');
        this.ring(e.x, e.y, 110, '#ff8a5a');
        this.burst(e.x, e.y, '#ff9a5a', 26, 240, 'spark');
        for (let i = 0; i < 6; i++) {
          this.particles.push({ x: e.x + rnd(80, -80), y: e.y + rnd(30, -30), vx: rnd(10, -10), vy: rnd(-40, -80), t: 0, life: rnd(0.8, 0.4), kind: 'ember', color: '#ff7a3a', size: rnd(3, 1) });
        }
        if (dist(e.x, e.y, this.player.x, this.player.y) < 112 + this.player.radius) {
          this.damagePlayer(e.dmg * (e.weaken > 0 ? 0.6 : 1), angleTo(e.x, e.y, this.player.x, this.player.y));
        }
      }
      return;
    }
    if (e.state === 'recover') {
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 6, dt); e.vy = damp(e.vy, 0, 6, dt);
      if (e.stateT <= 0) e.state = 'chase';
      return;
    }
    if (d < 120 && e.cooldown <= 0) { e.state = 'windup'; e.stateT = 0.85; e.windup = 0.85; return; }
    if (d > e.radius + 45) this.enemyMove(e, (this.player.x - e.x) / d, (this.player.y - e.y) / d, 1, dt);
    else this.enemyMove(e, 0, 0, 0, dt);
  },

  aiWitch(e, dt, d) {
    e.cooldown -= dt;
    if (e.state === 'windup') {
      e.stateT -= dt;
      e.vx = damp(e.vx, 0, 8, dt); e.vy = damp(e.vy, 0, 8, dt);
      e.x += e.knockVx * dt; e.y += e.knockVy * dt;
      e.knockVx *= Math.exp(-7 * dt); e.knockVy *= Math.exp(-7 * dt);
      if (e.stateT <= 0) {
        e.state = 'recover'; e.stateT = 0.5; e.cooldown = 2.4 + rnd(0.8);
        const base = angleTo(e.x, e.y - 30, this.player.x, this.player.y - 14);
        for (const off of [-0.26, 0, 0.26]) {
          this.addProjectile({
            x: e.x + Math.cos(base) * 16, y: e.y - 30 + Math.sin(base) * 16,
            vx: Math.cos(base + off) * 245, vy: Math.sin(base + off) * 245,
            dmg: e.dmg * (e.weaken > 0 ? 0.6 : 1) * 0.72, radius: 7, enemy: true, type: 'orb',
            color: '#c98aff', life: 4,
          });
        }
        this.audio.sfx('gate');
      }
      return;
    }
    if (e.state === 'recover') {
      e.stateT -= dt;
      if (e.stateT <= 0) e.state = 'chase';
      return;
    }
    if (d < 145 && e.cooldown < 0.4) {
      // blink away
      const pos = this.findSpawnPoint(260, 430);
      this.burst(e.x, e.y - 24, '#c98aff', 16, 150, 'spark');
      e.x = pos.x; e.y = pos.y;
      this.burst(e.x, e.y - 24, '#e0b0ff', 16, 150, 'spark');
      this.audio.sfx('dash');
      e.cooldown = Math.max(e.cooldown, 0.8);
      return;
    }
    if (e.cooldown <= 0 && d < 580) {
      e.state = 'windup'; e.stateT = 0.55;
      return;
    }
    let dx = 0, dy = 0;
    if (d < 250) { dx = (e.x - this.player.x) / d; dy = (e.y - this.player.y) / d; }
    else if (d > 400) { dx = (this.player.x - e.x) / d; dy = (this.player.y - e.y) / d; }
    else { const a = angleTo(e.x, e.y, this.player.x, this.player.y) + Math.PI / 2; dx = Math.cos(a) * 0.4; dy = Math.sin(a) * 0.4; }
    this.enemyMove(e, dx, dy, 1, dt);
  },

  // ================== BOSS ==================
  spawnBoss() {
    const run = this.run;
    const hp = Math.round(900 * (1 + (run.heat || 0) * 0.25));
    this.boss = {
      id: 'boss', isBoss: true, type: 'cerberus', name: 'ЦЕРБЕР',
      x: ROOM_W / 2, y: ROOM_H / 2 - 250,
      vx: 0, vy: 0, radius: 66, mass: 12,
      hp, maxHp: hp, dmg: 24 * (1 + (run.heat || 0) * 0.1),
      face: Math.PI / 2, state: 'chase', stateT: 0, cooldown: 1.6,
      attackDir: Math.PI / 2, pendingAttack: null, breathTick: 0,
      enraged: false, hurtFlash: 0, dead: false, spawnT: 1.1, hitThisAttack: false,
      walkPhase: 0, showHp: 0,
    };
    this.ring(this.boss.x, this.boss.y, 190, '#ff6a4a');
    this.shake(10);
    this.audio.sfx('boss');
    this.emit('hud');
  },

  updateBoss(dt) {
    const b = this.boss;
    if (!b || b.dead) return;
    const p = this.player;
    if (b.spawnT > 0) {
      b.spawnT -= dt;
      return;
    }
    if (b.hurtFlash > 0) b.hurtFlash -= dt;
    if (b.showHp > 0) b.showHp -= dt;
    if (!b.enraged && b.hp < b.maxHp * 0.5) {
      b.enraged = true;
      this.audio.sfx('boss');
      this.shake(14);
      this.ring(b.x, b.y, 220, '#ff4a2a');
      this.burst(b.x, b.y - 40, '#ff5a2a', 50, 300, 'ember');
      this.emit('banner', { eyebrow: 'ВТОРАЯ ЯРОСТЬ', title: 'ЗВЕРЬ РАЗЪЯРЁН', sub: 'ЦЕРБЕР НЕ ЗНАЕТ СТРАХА', cls: 'blood' });
    }
    const d = dist(b.x, b.y, p.x, p.y) || 1;
    const speedMul = b.enraged ? 1.35 : 1;
    // keep player outside the body
    if (d < b.radius * 0.7 + p.radius) {
      const nx = (p.x - b.x) / d, ny = (p.y - b.y) / d;
      p.x = b.x + nx * (b.radius * 0.7 + p.radius);
      p.y = b.y + ny * (b.radius * 0.7 + p.radius);
    }
    if (b.state === 'chase') {
      b.cooldown -= dt;
      b.face = approachAngle(b.face, angleTo(b.x, b.y, p.x, p.y), dt * 2.4);
      let dx = 0, dy = 0;
      if (d > 230) { dx = (p.x - b.x) / d; dy = (p.y - b.y) / d; }
      else { const a = angleTo(b.x, b.y, p.x, p.y) + Math.PI / 2; dx = Math.cos(a) * 0.3; dy = Math.sin(a) * 0.3; }
      const sp = (b.enraged ? 95 : 68);
      b.vx = damp(b.vx, dx * sp, 4, dt);
      b.vy = damp(b.vy, dy * sp, 4, dt);
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.x = clamp(b.x, MARGIN + b.radius, ROOM_W - MARGIN - b.radius);
      b.y = clamp(b.y, MARGIN + b.radius, ROOM_H - MARGIN - b.radius);
      if (b.cooldown <= 0) this.startBossAttack();
      return;
    }
    if (b.state === 'windup') {
      b.stateT -= dt;
      b.vx = damp(b.vx, 0, 6, dt); b.vy = damp(b.vy, 0, 6, dt);
      if (b.pendingAttack !== 'charge') b.face = approachAngle(b.face, angleTo(b.x, b.y, p.x, p.y), dt * 1.2);
      if (b.stateT <= 0) this.releaseBossAttack();
      return;
    }
    if (b.state === 'charge') {
      b.stateT -= dt;
      const sp = (b.enraged ? 1500 : 1250);
      const nx = b.x + Math.cos(b.attackDir) * sp * dt;
      const ny = b.y + Math.sin(b.attackDir) * sp * dt;
      const hitWall = nx < MARGIN + b.radius || nx > ROOM_W - MARGIN - b.radius || ny < MARGIN + b.radius || ny > ROOM_H - MARGIN - b.radius;
      b.x = clamp(nx, MARGIN + b.radius, ROOM_W - MARGIN - b.radius);
      b.y = clamp(ny, MARGIN + b.radius, ROOM_H - MARGIN - b.radius);
      if (Math.random() < dt * 40) {
        this.particles.push({ x: b.x + rnd(40, -40), y: b.y + rnd(20, -10), vx: rnd(20, -20), vy: rnd(-10, -60), t: 0, life: 0.5, kind: 'ember', color: '#ff8a4a', size: rnd(4, 1.5) });
      }
      if (!b.hitThisAttack && dist(b.x, b.y, p.x, p.y) < b.radius * 0.8 + p.radius) {
        b.hitThisAttack = true;
        this.damagePlayer(b.dmg, b.attackDir);
      }
      if (b.stateT <= 0 || hitWall) {
        b.state = 'stagger'; b.stateT = hitWall ? 1.2 : 0.8; b.cooldown = 2.6;
        if (hitWall) {
          this.shake(16); this.audio.sfx('heavy');
          this.burst(b.x, b.y - 20, '#c9b090', 26, 260, 'piece');
          this.ring(b.x, b.y, 120, '#ffcf8a');
        }
      }
      return;
    }
    if (b.state === 'breath') {
      b.stateT -= dt;
      b.face = approachAngle(b.face, angleTo(b.x, b.y, p.x, p.y), dt * 0.55);
      b.breathTick -= dt;
      if (b.breathTick <= 0) {
        b.breathTick = 0.16;
        const a = angleTo(b.x, b.y, p.x, p.y);
        const diff = Math.abs(angleDiff(a, b.face));
        if (diff < 0.62 && d < 340) this.damagePlayer(7.5 * (1 + (this.run.heat || 0) * 0.1), b.face);
        // flames
        for (let i = 0; i < 4; i++) {
          const aa = b.face + rnd(0.5, -0.5);
          const rr = rnd(280, 40);
          this.particles.push({
            x: b.x + Math.cos(aa) * rr, y: b.y - 30 + Math.sin(aa) * rr * 0.6,
            vx: Math.cos(aa) * 220, vy: Math.sin(aa) * 190 - 60,
            t: 0, life: rnd(0.7, 0.35), kind: 'ember', color: pick(['#ffd27a', '#ff8a3a', '#ff5a2a']), size: rnd(5, 2),
          });
        }
        if (Math.random() < 0.3) {
          const tx = b.x + Math.cos(b.face + rnd(0.3, -0.3)) * rnd(240, 80);
          const ty = b.y + Math.sin(b.face + rnd(0.3, -0.3)) * rnd(160, 50);
          this.zones.push({ x: tx, y: ty, r: 46, life: 4.5, tick: 0.2, dmg: 6, color: '#ff7a3a' });
        }
      }
      if (b.stateT <= 0) { b.state = 'recover'; b.stateT = 0.75; b.cooldown = 3.4; }
      return;
    }
    if (b.state === 'slam') {
      b.stateT -= dt;
      b.vx = 0; b.vy = 0;
      if (b.stateT <= 0) {
        const radius = 195;
        this.ring(b.x, b.y, radius, '#ff8a4a');
        this.burst(b.x, b.y, '#ff9a5a', 34, 300, 'spark');
        this.shake(18);
        this.audio.sfx('heavy');
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * TAU;
          this.zones.push({ x: b.x + Math.cos(a) * rnd(140, 40), y: b.y + Math.sin(a) * rnd(90, 20), r: 38, life: 3.2, tick: 0.3, dmg: 5, color: '#ff7a3a' });
        }
        if (dist(b.x, b.y, p.x, p.y) < radius + p.radius) this.damagePlayer(b.dmg * 1.1, angleTo(b.x, b.y, p.x, p.y));
        b.state = 'recover'; b.stateT = 1.0; b.cooldown = 3.1;
      }
      return;
    }
    if (b.state === 'summon') {
      b.stateT -= dt;
      if (b.stateT <= 0) {
        let spawned = 0;
        for (let i = 0; i < 2; i++) {
          const pos = this.findSpawnPoint(240, 420);
          const e = this.addEnemy(i === 0 ? 'shade' : 'skeleton', pos.x, pos.y, {});
          e.spawnT = 0.7;
          e.hp *= 0.9; e.maxHp *= 0.9;
          this.ring(pos.x, pos.y, 50, '#ff8a5a');
          spawned++;
        }
        this.audio.sfx('boss');
        b.state = 'recover'; b.stateT = 1.0; b.cooldown = 5.5;
      }
      return;
    }
    if (b.state === 'recover' || b.state === 'stagger') {
      b.stateT -= dt;
      b.vx = damp(b.vx, 0, 5, dt); b.vy = damp(b.vy, 0, 5, dt);
      if (b.stateT <= 0) b.state = 'chase';
      return;
    }
  },

  startBossAttack() {
    const b = this.boss, p = this.player;
    const d = dist(b.x, b.y, p.x, p.y);
    const r = Math.random();
    let attack;
    if (b.enraged) {
      if (d > 360) attack = r < 0.55 ? 'charge' : r < 0.85 ? 'breath' : 'summon';
      else attack = r < 0.34 ? 'slam' : r < 0.68 ? 'breath' : r < 0.9 ? 'charge' : 'summon';
    } else {
      if (d > 360) attack = r < 0.5 ? 'charge' : r < 0.82 ? 'breath' : 'summon';
      else attack = r < 0.32 ? 'slam' : r < 0.62 ? 'breath' : r < 0.86 ? 'charge' : 'summon';
    }
    if (attack === 'summon' && this.enemies.length >= 3) attack = 'slam';
    b.pendingAttack = attack;
    b.attackDir = angleTo(b.x, b.y, p.x, p.y);
    b.hitThisAttack = false;
    b.state = 'windup';
    b.stateT = attack === 'charge' ? 0.8 : attack === 'breath' ? 0.72 : attack === 'summon' ? 1.0 : 0.95;
    if (attack !== 'charge') b.face = b.attackDir;
    this.audio.sfx('boss');
    if (attack === 'summon') this.audio.sfx('rage');
  },

  releaseBossAttack() {
    const b = this.boss;
    if (b.pendingAttack === 'charge') {
      b.state = 'charge'; b.stateT = 0.52; b.hitThisAttack = false;
      this.audio.sfx('dash');
      this.shake(6);
    } else if (b.pendingAttack === 'breath') {
      b.state = 'breath'; b.stateT = 1.5; b.breathTick = 0;
      this.audio.sfx('rage');
    } else if (b.pendingAttack === 'summon') {
      b.state = 'summon'; b.stateT = 0.55;
    } else {
      b.state = 'slam'; b.stateT = 0.45;
    }
    b.pendingAttack = null;
  },

  // ================== DEATH ==================
  killEnemy(e, silent = false) {
    if (!e || e.dead) return;
    if (e === this.boss) {
      e.dead = true; e.hp = 0;
      this.run.kills++;
      this.run.darkEarned += 50;
      this.run.obols += 40;
      this.shake(22);
      this.burst(e.x, e.y - 40, '#ff8a4a', 70, 380, 'ember');
      this.burst(e.x, e.y - 40, '#ffd27a', 40, 320, 'spark');
      this.ring(e.x, e.y, 260, '#ffb06a');
      this.particles.push({ x: e.x, y: e.y, vx: 0, vy: 0, t: 0, life: 1.2, kind: 'ring', color: '#ffd28a', size: 30, grow: 380, w: 5 });
      this.audio.sfx('victory');
      this.finishVictory();
      return;
    }
    e.dead = true;
    const run = this.run;
    run.kills++;
    run.obols += e.elite ? 12 : 2;
    run.darkEarned += e.elite ? 8 : 1;
    run.rage = clamp(run.rage + 4, 0, run.rageMax);
    const colors = { skeleton: '#d8cbb2', shade: '#77e4ff', archer: '#ffb35a', brute: '#ff7a5a', witch: '#d0a0ff' };
    const color = colors[e.type] || '#ffcf8a';
    this.burst(e.x, e.y - e.radius, color, e.elite ? 26 : 14, e.elite ? 260 : 170, 'spark');
    this.burst(e.x, e.y - e.radius, '#8f2b32', 10, 150, 'blood');
    this.particles.push({ x: e.x, y: e.y - e.radius * 1.6, vx: rnd(15, -15), vy: -55, t: 0, life: 1.1, kind: 'soul', color, size: 4 });
    this.spawnDecal(e.x, e.y, '#5d1820', e.radius * 1.6);
    if (e.elite) {
      this.ring(e.x, e.y, 70, '#ffcf6a');
      for (let i = 0; i < 6; i++) this.particles.push({ x: e.x + rnd(20, -20), y: e.y + rnd(14, -14), vx: rnd(40, -40), vy: rnd(-30, -90), t: 0, life: 0.8, kind: 'ember', color: '#ffcf6a', size: 2.4 });
      this.shake(6);
    }
    if (!silent) this.audio.sfx(e.elite ? 'heavy' : 'hit');
    if (run.stats.ruinDmg) {
      this.ring(e.x, e.y, 100, '#ff6a4a');
      const others = this.enemies.filter((o) => o !== e && !o.dead && dist(o.x, o.y, e.x, e.y) < 120);
      for (const o of others) this.damageEnemy(o, run.stats.ruinDmg, { direct: false, raw: true });
      if (this.boss && !this.boss.dead && dist(this.boss.x, this.boss.y, e.x, e.y) < 140) {
        this.damageEnemy(this.boss, run.stats.ruinDmg, { direct: false, raw: true });
      }
    }
    if (run.stats.healOnKill && chance(run.stats.healOnKillChance)) {
      this.heal(run.stats.healOnKill);
      this.particles.push({ x: e.x, y: e.y - 10, vx: 0, vy: -40, t: 0, life: 0.7, kind: 'ember', color: '#9cf0a8', size: 3 });
    }
  },
};
