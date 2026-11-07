// Simulation: player control, attacks, damage, projectiles, effects.
import {
  TAU, clamp, lerp, damp, rnd, chance, pick, dist, angleTo, angleDiff, norm, mulberry32,
} from './core.js';
import { WEAPONS, TOTAL_CHAMBERS } from './data.js';
import { ROOM_W, ROOM_H, MARGIN } from './constants.js';

export const simMethods = {
  // ================== MAIN LOOP ==================
  update(rawDt) {
    this.time += rawDt;
    this.shakeAmount = damp(this.shakeAmount, 0, 9, rawDt);
    let dt = Math.min(rawDt, 0.033);
    if (this.hitstop > 0) { this.hitstop -= rawDt; dt *= 0.08; }
    this.updateDust(rawDt);
    if (this.paused || !this.run) return;
    this.run.elapsed += rawDt;

    if (this.state === 'intro') {
      this.introT -= rawDt;
      this.updatePlayerVisual(dt);
      this.updateEffects(dt);
      this.updateCamera(rawDt);
      if (this.introT <= 0) {
        this.state = 'fight';
        this.clearDelay = 0;
        if (this.run.chamber >= TOTAL_CHAMBERS) this.spawnBoss();
        else this.spawnWave();
      }
      return;
    }

    if (this.state === 'fight') {
      this.updatePlayer(dt);
      this.updateEnemies(dt);
      this.updateBoss(dt);
      this.updateProjectiles(dt);
      this.updateZones(dt);
      this.updateSpawnQueue(dt);
      this.updateEffects(dt);
      this.checkClear(dt);
    } else if (this.state === 'cleared') {
      this.updatePlayerVisual(dt);
      this.updateEffects(dt);
      this.updateZones(dt);
    } else if (this.state === 'dying') {
      this.deathT -= rawDt;
      this.updatePlayerVisual(dt);
      this.updateEnemies(dt);
      this.updateEffects(dt);
      if (this.deathT <= 0) this.finishDeath();
    } else if (this.state === 'victory') {
      this.victoryT -= rawDt;
      this.updatePlayerVisual(dt);
      this.updateEffects(dt);
      if (this.victoryT <= 0 && !this.victoryEmitted) {
        this.victoryEmitted = true;
        this.emitVictory();
      }
    }
    this.updateCamera(rawDt);
  },

  updateDust(dt) {
    for (const d of this.dust) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.x < -40) d.x = ROOM_W + 40; else if (d.x > ROOM_W + 40) d.x = -40;
      if (d.y < -40) d.y = ROOM_H + 40; else if (d.y > ROOM_H + 40) d.y = -40;
      d.phase += dt * (0.6 + d.size * 0.2);
    }
  },

  makeDust(initial) {
    return {
      x: rnd(ROOM_W), y: rnd(ROOM_H),
      vx: rnd(14, -14), vy: rnd(-4, -22),
      size: rnd(2.4, 0.6), phase: rnd(TAU),
    };
  },

  updateCamera(dt) {
    const p = this.player;
    if (!p) return;
    const halfW = this.viewW / 2, halfH = this.viewH / 2;
    let tx = p.x + p.vx * 0.12 + Math.cos(p.face) * 20;
    let ty = p.y + p.vy * 0.1 - 18;
    // In the boss arena keep both combatants framed.
    if (this.boss && !this.boss.dead) {
      tx = (tx + this.boss.x) * 0.5;
      ty = (ty + this.boss.y) * 0.5;
    }
    if (this.viewW < ROOM_W - 20) tx = clamp(tx, halfW, ROOM_W - halfW); else tx = ROOM_W / 2;
    if (this.viewH < ROOM_H - 20) ty = clamp(ty, halfH, ROOM_H - halfH); else ty = ROOM_H / 2;
    this.cam.x = damp(this.cam.x, tx, 7.5, dt);
    this.cam.y = damp(this.cam.y, ty, 7.5, dt);
  },

  // ================== INPUT ==================
  moveInput() {
    if (!this.run) return { x: 0, y: 0 };
    const keyboard = this.input.moveVector();
    const touchMag = Math.hypot(this.touchMove.x, this.touchMove.y);
    if (touchMag > 0.14) return { x: this.touchMove.x, y: this.touchMove.y };
    return keyboard;
  },

  aimAngle() {
    const p = this.player, inp = this.input;
    if (!p) return 0;
    const now = performance.now();
    if (!inp.usingTouch && inp.mouse.active && now - inp.mouse.lastMove < 2800) {
      const wx = this.cam.x + (inp.mouse.x - this.w / 2) / this.scale;
      const wy = this.cam.y + (inp.mouse.y - this.h / 2) / this.scale;
      return Math.atan2(wy - p.y, wx - p.x);
    }
    let best = null, bd = 640 * 640;
    for (const e of this.enemies) {
      if (e.dead || e.spawnT > 0) continue;
      const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
      if (d < bd) { bd = d; best = e; }
    }
    if (this.boss && !this.boss.dead) {
      const d = (this.boss.x - p.x) ** 2 + (this.boss.y - p.y) ** 2;
      if (d < bd) { bd = d; best = this.boss; }
    }
    if (best) return angleTo(p.x, p.y, best.x, best.y);
    const mv = this.moveInput();
    if (mv.x || mv.y) return Math.atan2(mv.y, mv.x);
    return p.face;
  },

  snapAngle(angle, range, limit) {
    const p = this.player;
    let best = null, bd = Infinity;
    const targets = this.enemies.concat(this.boss && !this.boss.dead ? [this.boss] : []);
    for (const e of targets) {
      if (e.dead || e.spawnT > 0) continue;
      const d = dist(p.x, p.y, e.x, e.y);
      if (d > range + e.radius) continue;
      const a = angleTo(p.x, p.y, e.x, e.y);
      const diff = Math.abs(angleDiff(a, angle));
      if (diff > limit) continue;
      const score = diff * 120 + d;
      if (score < bd) { bd = score; best = a; }
    }
    return best ?? angle;
  },

  // ================== PLAYER ==================
  updatePlayerVisual(dt) {
    const p = this.player;
    if (!p) return;
    p.walkPhase += dt * (p.moving ? 13 : 3);
    if (p.hurtFlash > 0) p.hurtFlash -= dt;
    if (p.invuln > 0) p.invuln -= dt;
    if (p.attackAnim) {
      p.attackAnim.t += dt;
      if (p.attackAnim.t >= p.attackAnim.dur) p.attackAnim = null;
    }
    // scarf trail
    this.trailTick += dt;
    if (this.trailTick > 0.035) {
      this.trailTick = 0;
      const last = p.scarf[0];
      if (!last || dist(last.x, last.y, p.x, p.y - 30) > 2.5) {
        p.scarf.unshift({ x: p.x, y: p.y - 30 });
        if (p.scarf.length > 7) p.scarf.pop();
      }
    }
    if (p.dashTrail && p.dashTrail.length) {
      for (const d of p.dashTrail) d.life -= dt;
      p.dashTrail = p.dashTrail.filter((d) => d.life > 0);
    }
  },

  updatePlayer(dt) {
    const run = this.run, p = this.player, st = run.stats, inp = this.input;
    const move = this.moveInput();
    p.moving = Math.hypot(move.x, move.y) > 0.12;
    if (!p.dashing) p.face = this.aimAngle();

    // timers
    if (run.attackCd > 0) run.attackCd -= dt;
    if (run.specialCd > 0) run.specialCd -= dt;
    if (run.rageActive > 0) run.rageActive -= dt;
    if (run.comboTimer > 0) { run.comboTimer -= dt; if (run.comboTimer <= 0) run.comboIdx = 0; }
    if (run.attackBuffer > 0) run.attackBuffer -= dt;
    if (run.dashRegen > 0) {
      run.dashRegen -= dt;
      if (run.dashRegen <= 0) {
        if (run.dashCharges < st.dashMax) {
          run.dashCharges++;
          if (run.dashCharges < st.dashMax) run.dashRegen = st.dashCd;
          else run.dashRegen = 0;
        }
      }
    }
    if (inp.mouse.down || this.touchAttack) run.attackBuffer = 0.18;

    // actions
    const actions = this.pendingActions;
    if (inp.hit('Space') || inp.hit('ShiftLeft') || inp.hit('ShiftRight') || actions.has('dash')) this.tryDash(move);
    if (inp.hit('KeyE') || actions.has('special')) this.castSpecial();
    if (inp.hit('KeyQ') || actions.has('rage')) this.castRage();
    actions.clear();

    if (p.dashTime > 0) {
      p.dashTime -= dt;
      const spd = 860 * st.dashDist;
      p.vx = p.dashDir.x * spd;
      p.vy = p.dashDir.y * spd;
      this.movePlayer(p.vx * dt, p.vy * dt);
      p.dashTrail.unshift({ x: p.x, y: p.y, life: 0.22 });
      if (p.dashTrail.length > 10) p.dashTrail.pop();
      // dash boons
      for (const e of this.enemies) {
        if (e.dead || e.spawnT > 0 || (p.dashHits && p.dashHits.has(e.id))) continue;
        if (dist(e.x, e.y, p.x, p.y) < e.radius + 34) {
          if (p.dashHits) p.dashHits.add(e.id);
          if (st.zeusStepDmg) {
            this.damageEnemy(e, st.zeusStepDmg, { direct: false });
            this.bolt(e.x, e.y - 260, e.x, e.y, '#9fe6ff');
            this.audio.sfx('thunder');
          }
        }
      }
      if (p.dashTime <= 0) {
        p.dashing = false;
        if (st.poseidonTide) {
          this.aoeDamage(p.x, p.y, 130, st.poseidonTide, 220);
          this.ring(p.x, p.y, 130, '#6fe8d0');
          this.slashes.push({ x: p.x, y: p.y - 14, angle: 0, range: 135, arc: TAU, dur: 0.35, t: 0, color: '#7ff0e0', alpha: 0.6 });
          this.audio.sfx('dash');
        }
      }
    } else {
      const speed = st.moveSpeed * (run.rageActive > 0 ? 1.12 : 1);
      p.vx = damp(p.vx, move.x * speed, 17, dt);
      p.vy = damp(p.vy, move.y * speed, 17, dt);
      this.movePlayer(p.vx * dt, p.vy * dt);
    }

    if (run.attackBuffer > 0 && run.attackCd <= 0) this.performAttack();
    if (run.rageActive > 0) {
      if (Math.random() < dt * 22) {
        this.particles.push({
          x: p.x + rnd(26, -26), y: p.y + rnd(8, -54),
          vx: rnd(30, -30), vy: rnd(-40, -110), t: 0, life: 0.7,
          kind: 'ember', color: '#ff8a5a', size: rnd(2.6, 1),
        });
      }
    }
    this.updatePlayerVisual(dt);
  },

  movePlayer(dx, dy) {
    const p = this.player;
    p.x += dx; p.y += dy;
    const minX = MARGIN + p.radius, maxX = ROOM_W - MARGIN - p.radius;
    const minY = MARGIN + p.radius, maxY = ROOM_H - MARGIN - p.radius;
    p.x = clamp(p.x, minX, maxX);
    p.y = clamp(p.y, minY, maxY);
    for (const o of this.obstacles) {
      const d = dist(p.x, p.y, o.x, o.y);
      const need = o.r + p.radius;
      if (d < need && d > 0.01) {
        const nx = (p.x - o.x) / d, ny = (p.y - o.y) / d;
        p.x = o.x + nx * need;
        p.y = o.y + ny * need;
      }
    }
  },

  // ================== ATTACKS ==================
  performAttack() {
    const run = this.run, p = this.player, st = run.stats, w = this.weapon;
    const atk = w.attack;
    const aim = this.aimAngle();
    p.face = aim;
    run.attackBuffer = 0;
    if (atk.type === 'ranged') {
      run.attackCd = atk.cd / st.attackSpeed;
      const count = st.arrows;
      for (let i = 0; i < count; i++) {
        const off = (i - (count - 1) / 2) * (st.spread + 0.075);
        this.shootPlayerArrow(aim + off, atk.dmg, atk.speed);
      }
      p.chargeFx = 0.12;
      this.audio.sfx('slash');
      this.burst(p.x + Math.cos(aim) * 24, p.y - 34 + Math.sin(aim) * 24, '#d8ffa0', 5, 90, 'spark');
      this.slashes.push({ x: p.x, y: p.y - 32, angle: aim, range: 26, arc: 0.7, dur: 0.16, t: 0, color: '#d9ff9f', alpha: 0.5 });
      return;
    }
    let def, angle = aim;
    if (atk.type === 'melee') {
      def = atk.combo[run.comboIdx];
      run.comboIdx = (run.comboIdx + 1) % atk.combo.length;
      run.comboTimer = 1.05;
      angle = this.snapAngle(aim, def.range * 1.2, def.arc * 0.65);
    } else {
      def = atk;
      angle = this.snapAngle(aim, def.range * 1.15, def.arc * 0.8);
    }
    run.attackCd = def.dur / st.attackSpeed + 0.035;
    const range = def.range * st.rangeMult;
    this.meleeHit(angle, range, def.arc, def.dmg, def.knock, def);
    this.slashes.push({
      x: p.x, y: p.y - 20, angle, range, arc: def.arc,
      dur: def.dur * 1.25, t: 0, color: atk.type === 'melee' ? '#ffe6b0' : '#c8f4ff', alpha: 0.9,
    });
    if (run.comboIdx === 0) this.slashes.push({
      x: p.x, y: p.y - 20, angle: angle - 0.2, range: range * 1.04, arc: def.arc,
      dur: def.dur * 1.5, t: 0.04, color: '#ffd277', alpha: 0.45,
    });
    this.movePlayer(Math.cos(angle) * def.lunge, Math.sin(angle) * def.lunge);
    this.audio.sfx(atk.type === 'melee' ? 'slash' : 'heavy');
    if (run.comboIdx === 0) this.shake(2);
    this.burst(p.x + Math.cos(angle) * range * 0.7, p.y - 24 + Math.sin(angle) * range * 0.7, '#ffdca0', 4, 120, 'spark');
  },

  meleeHit(angle, range, arc, baseDmg, knock, def = {}) {
    const p = this.player, run = this.run;
    const targets = this.enemies.concat(this.boss && !this.boss.dead ? [this.boss] : []);
    const poseidon = run.stats.poseidonWave;
    const arcBonus = poseidon ? 0.18 : 0;
    for (const e of targets) {
      if (e.dead || e.spawnT > 0) continue;
      const d = dist(p.x, p.y, e.x, e.y);
      if (d > range + e.radius) continue;
      const a = angleTo(p.x, p.y, e.x, e.y);
      const diff = Math.abs(angleDiff(a, angle));
      const slack = Math.min(0.5, (e.radius + 12) / Math.max(30, d));
      if (diff > arc / 2 + slack + arcBonus) continue;
      let kb = knock;
      if (poseidon) kb *= 1.9;
      this.damageEnemy(e, baseDmg, { angle: a, knock: kb, direct: true });
      if (poseidon && e !== this.boss) {
        e.knockVx += Math.cos(a) * kb * 0.6;
        e.knockVy += Math.sin(a) * kb * 0.6;
      }
    }
    this.hitstop = Math.max(this.hitstop, def.dmg >= 20 ? 0.045 : 0.022);
  },

  shootPlayerArrow(angle, dmg, speed) {
    const p = this.player;
    this.projectiles.push({
      x: p.x + Math.cos(angle) * 22, y: p.y - 34 + Math.sin(angle) * 22,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      angle, dmg, radius: 7, enemy: false, type: 'arrow',
      pierce: this.run.stats.pierce ? 2 : 0, life: 2.2, t: 0, hit: new Set(),
    });
  },

  castSpecial() {
    const run = this.run, p = this.player, st = run.stats, w = this.weapon;
    if (!run || run.specialCd > 0 || run.rageActive > 0 && false) return;
    const aim = this.aimAngle();
    const sp = w.attack.special;
    run.specialCd = st.specialCd;
    p.face = aim;
    if (sp.type === 'volley') {
      for (let i = 0; i < sp.count; i++) {
        const off = (i - (sp.count - 1) / 2) * (sp.spread / sp.count);
        this.shootPlayerArrow(aim + off, sp.dmg, sp.speed);
      }
      this.slashes.push({ x: p.x, y: p.y - 30, angle: aim, range: 60, arc: 1.1, dur: 0.25, t: 0, color: '#d9ffa0', alpha: 0.8 });
      this.audio.sfx('heavy');
    } else {
      const radius = sp.radius * st.specialRadius;
      this.aoeDamage(p.x, p.y - 10, radius, sp.dmg, sp.knock, true);
      this.slashes.push({ x: p.x, y: p.y - 16, angle: 0, range: radius * 1.06, arc: TAU, dur: 0.34, t: 0, color: '#ffe6b0', alpha: 0.8 });
      this.slashes.push({ x: p.x, y: p.y - 16, angle: 1.3, range: radius * 0.9, arc: TAU, dur: 0.48, t: 0.05, color: '#ffb06a', alpha: 0.45 });
      this.ring(p.x, p.y - 10, radius, '#ffcf8a');
      this.shake(7);
      this.audio.sfx('heavy');
      this.hitstop = Math.max(this.hitstop, 0.05);
    }
    if (st.poseidonSpecial) {
      const r = 170;
      this.aoeDamage(p.x, p.y, r, st.poseidonSpecial, 420, true);
      this.ring(p.x, p.y, r, '#62e6cf');
      this.slashes.push({ x: p.x, y: p.y - 14, angle: 0, range: r, arc: TAU, dur: 0.5, t: 0, color: '#62e6cf', alpha: 0.65 });
      this.audio.sfx('dash');
    }
    if (st.zeusStorm) {
      const targets = this.enemies.filter((e) => !e.dead && e.spawnT <= 0)
        .sort((a, b) => dist(a.x, a.y, p.x, p.y) - dist(b.x, b.y, p.x, p.y)).slice(0, 3);
      for (const e of targets) {
        this.bolt(e.x, e.y - 300, e.x, e.y, '#9fe6ff');
        this.damageEnemy(e, st.zeusStorm, { direct: false });
        this.burst(e.x, e.y - 20, '#9fe6ff', 12, 180, 'spark');
      }
      if (targets.length) this.audio.sfx('thunder');
    }
  },

  castRage() {
    const run = this.run, p = this.player;
    if (!run || run.rage < run.rageMax || run.rageActive > 0) return;
    run.rage = 0;
    run.rageActive = 5.2;
    p.invuln = Math.max(p.invuln, 0.85);
    this.aoeDamage(p.x, p.y - 10, 225, 110, 480, true);
    this.heal(Math.round(run.maxHp * 0.22));
    this.ring(p.x, p.y - 10, 225, '#ff9a6a');
    this.slashes.push({ x: p.x, y: p.y - 16, angle: 0, range: 235, arc: TAU, dur: 0.6, t: 0, color: '#ff8a5a', alpha: 0.9 });
    this.burst(p.x, p.y - 30, '#ff9a5a', 60, 300, 'spark');
    this.audio.sfx('rage');
    this.shake(16);
    this.hitstop = 0.09;
    this.toast('ЯРОСТЬ СТИКСА');
    this.emit('banner', { eyebrow: 'СИЛА ПРЕДКОВ', title: 'ЯРОСТЬ', sub: '5 СЕКУНД БЕЗУМИЯ', cls: 'blood' });
  },

  tryDash(move) {
    const run = this.run, p = this.player, st = run.stats;
    if (!run || p.dashing || run.dashCharges <= 0) return;
    let dir = { x: move.x, y: move.y };
    if (Math.hypot(dir.x, dir.y) < 0.2) dir = { x: Math.cos(p.face), y: Math.sin(p.face) };
    dir = norm(dir.x, dir.y);
    run.dashCharges--;
    if (run.dashRegen <= 0) run.dashRegen = st.dashCd;
    p.dashing = true; p.dashTime = 0.17; p.dashDir = dir;
    p.dashHits = new Set();
    p.invuln = Math.max(p.invuln, 0.3);
    p.face = Math.atan2(dir.y, dir.x);
    this.audio.sfx('dash');
    this.burst(p.x, p.y - 16, '#9fe8dc', 8, 150, 'spark');
    this.emit('hud');
  },

  aoeDamage(x, y, radius, dmg, knock, includeBoss = true) {
    const targets = this.enemies.concat(includeBoss && this.boss && !this.boss.dead ? [this.boss] : []);
    for (const e of targets) {
      if (e.dead || e.spawnT > 0) continue;
      const d = dist(x, y, e.x, e.y);
      if (d > radius + e.radius) continue;
      const a = angleTo(x, y, e.x, e.y);
      this.damageEnemy(e, dmg, { angle: a, knock, direct: true });
      if (e !== this.boss) {
        e.knockVx += Math.cos(a) * knock;
        e.knockVy += Math.sin(a) * knock;
      }
    }
  },

  // ================== DAMAGE ==================
  damageEnemy(e, base, opts = {}) {
    if (!e || e.dead || e.spawnT > 0) return 0;
    const run = this.run, st = run.stats;
    const crit = opts.crit !== false && chance(st.critChance);
    let dmg = base * st.dmgMult * (crit ? st.critMult : 1) * (run.rageActive > 0 ? 1.35 : 1);
    if (opts.raw) dmg = base;
    // artemis mark
    if (opts.direct !== false) {
      run.hitCounter++;
      if (st.artemisMark && run.hitCounter % 4 === 0) {
        dmg += st.artemisMark;
        this.float(e.x, e.y - e.radius * 2.2, 'МЕТКА', 'crit');
      }
    }
    e.hp -= dmg;
    e.hurtFlash = 0.12;
    e.showHp = 2.4;
    if (opts.knock && e !== this.boss) {
      e.knockVx += Math.cos(opts.angle || 0) * opts.knock;
      e.knockVy += Math.sin(opts.angle || 0) * opts.knock;
    }
    run.dmgDealt += dmg;
    run.rage = clamp(run.rage + dmg * 0.055, 0, run.rageMax);
    if (st.lifesteal && opts.direct !== false) this.heal(st.lifesteal, true);

    const fy = e.y - (e.isBoss ? e.radius * 1.5 : e.radius * 1.8);
    this.float(e.x + rnd(12, -12), fy, Math.round(dmg), crit ? 'crit' : '');
    this.burst(e.x, e.y - e.radius * 0.8, crit ? '#ffd479' : '#ffb08a', crit ? 9 : 4, crit ? 210 : 120, 'spark');
    if (e !== this.boss) {
      this.particles.push({
        x: e.x + rnd(10, -10), y: e.y - e.radius, vx: rnd(60, -60), vy: rnd(-30, -120),
        t: 0, life: 0.6, kind: 'blood', color: e.type === 'skeleton' ? '#8f2b32' : '#6d2740', size: rnd(3, 1),
      });
    }
    if (crit) this.shake(2.5);

    // status effects
    if (opts.direct !== false && e !== this.boss) {
      if (st.poisonDps) {
        e.poison = Math.max(e.poison, 4);
        e.poisonStacks = Math.min(3, (e.poisonStacks || 0) + 1);
        e.poisonDps = st.poisonDps;
      }
      if (st.poisonSlow) { e.slow = 2; e.slowAmt = st.poisonSlow / 100; }
      if (st.doomDmg) {
        e.doomCounter = (e.doomCounter || 0) + 1;
        if (e.doomCounter % 3 === 0 && e.doom <= 0) { e.doom = 1.15; e.doomDmg = st.doomDmg; }
      }
      if (st.weakAmount) e.weaken = Math.max(e.weaken || 0, 4);
    }
    // zeus chain
    if (st.lightningDmg && chance(st.lightningChance)) {
      this.bolt(e.x + rnd(40, -40), e.y - 330, e.x, e.y, '#9fe6ff');
      const chain = this.enemies
        .filter((o) => o !== e && !o.dead && o.spawnT <= 0 && dist(o.x, o.y, e.x, e.y) < 280)
        .sort((a, b) => dist(a.x, a.y, e.x, e.y) - dist(b.x, b.y, e.x, e.y))[0];
      if (chain) {
        this.damageEnemy(chain, st.lightningDmg, { direct: false, raw: true });
        this.bolt(e.x, e.y - 20, chain.x, chain.y - 20, '#bff4ff');
      }
      this.damageEnemy(e, st.lightningDmg, { direct: false, raw: true });
      this.audio.sfx('thunder');
      this.shake(3);
    }
    if (e.hp <= 0) this.killEnemy(e);
    return dmg;
  },

  damagePlayer(amount, sourceAngle) {
    const run = this.run, p = this.player, st = run.stats;
    if (!run || this.state !== 'fight' || p.invuln > 0 || p.dashing) return false;
    if (run.shield > 0) {
      run.shield--;
      p.invuln = Math.max(p.invuln, 0.45);
      this.audio.sfx('shield');
      this.float(p.x, p.y - 64, 'ЩИТ', 'heal');
      this.ring(p.x, p.y - 26, 44, '#9fd8ff');
      this.emit('hud');
      return false;
    }
    const dmg = amount * st.damageTaken;
    run.hp -= dmg;
    run.dmgTaken += dmg;
    p.invuln = 0.82;
    p.hurtFlash = 0.32;
    run.rage = clamp(run.rage + dmg * 0.45, 0, run.rageMax);
    this.float(p.x, p.y - 62, Math.round(dmg), 'player');
    this.burst(p.x, p.y - 30, '#a32832', 14, 190, 'blood');
    this.burst(p.x, p.y - 30, '#ff6a50', 8, 150, 'spark');
    this.audio.sfx('hurt');
    this.shake(7);
    this.hitstop = Math.max(this.hitstop, 0.03);
    this.emit('hud');
    if (run.hp <= 0) { run.hp = 0; this.die(); }
    return true;
  },

  heal(amount, silent = false) {
    const run = this.run;
    if (!run || amount <= 0) return;
    const before = run.hp;
    run.hp = Math.min(run.maxHp, run.hp + amount);
    if (!silent && run.hp > before) {
      this.float(this.player.x, this.player.y - 58, `+${Math.round(run.hp - before)}`, 'heal');
      this.burst(this.player.x, this.player.y - 30, '#9cf0a8', 8, 90, 'spark');
    }
    this.emit('hud');
  },

  // ================== PROJECTILES / ZONES ==================
  addProjectile(o) {
    this.projectiles.push({
      ...o, life: o.life || 3, t: 0, hit: new Set(), pierce: o.pierce || 0,
    });
  },

  updateProjectiles(dt) {
    const p = this.player;
    for (const pr of this.projectiles) {
      pr.t += dt; pr.life -= dt;
      pr.x += pr.vx * dt; pr.y += pr.vy * dt;
      pr.angle = Math.atan2(pr.vy, pr.vx);
      if (pr.type === 'orb' && Math.random() < dt * 30) {
        this.particles.push({ x: pr.x, y: pr.y, vx: rnd(20, -20), vy: rnd(20, -20), t: 0, life: 0.35, kind: 'spark', color: pr.color || '#c98aff', size: 1.6 });
      }
      if (pr.life <= 0 || pr.x < MARGIN || pr.x > ROOM_W - MARGIN || pr.y < MARGIN || pr.y > ROOM_H - MARGIN) {
        pr.dead = true; continue;
      }
      for (const o of this.obstacles) {
        if (dist(pr.x, pr.y, o.x, o.y) < o.r) {
          pr.dead = true;
          this.burst(pr.x, pr.y, pr.enemy ? '#ff9a60' : '#ffe0a0', 5, 100, 'spark');
          break;
        }
      }
      if (pr.dead) continue;
      if (pr.enemy) {
        if (dist(pr.x, pr.y, p.x, p.y - 14) < pr.radius + p.radius) {
          if (this.damagePlayer(pr.dmg, pr.angle)) pr.dead = true;
        }
      } else {
        const targets = this.enemies.concat(this.boss && !this.boss.dead ? [this.boss] : []);
        for (const e of targets) {
          if (e.dead || e.spawnT > 0 || pr.hit.has(e.id)) continue;
          if (dist(pr.x, pr.y, e.x, e.y - (e.isBoss ? 60 : 12)) < pr.radius + e.radius) {
            pr.hit.add(e.id);
            this.damageEnemy(e, pr.dmg, { angle: pr.angle, knock: 80, direct: true });
            this.burst(pr.x, pr.y, '#ffe6a8', 6, 120, 'spark');
            if (pr.pierce > 0) pr.pierce--; else { pr.dead = true; break; }
          }
        }
      }
    }
    this.projectiles = this.projectiles.filter((pr) => !pr.dead);
  },

  updateZones(dt) {
    const p = this.player;
    for (const z of this.zones) {
      z.life -= dt;
      if (z.life <= 0) { z.dead = true; continue; }
      if (Math.random() < dt * 18) {
        const a = rnd(TAU), rr = rnd(z.r, 0);
        this.particles.push({
          x: z.x + Math.cos(a) * rr, y: z.y + Math.sin(a) * rr * 0.6,
          vx: rnd(12, -12), vy: rnd(-18, -50), t: 0, life: rnd(0.7, 0.3), kind: 'ember',
          color: z.color || '#ff7a3a', size: rnd(3, 1),
        });
      }
      if (this.state === 'fight') {
        z.tick -= dt;
        if (z.tick <= 0 && dist(p.x, p.y, z.x, z.y) < z.r) {
          z.tick = 0.55;
          this.damagePlayer(z.dmg || 6, 0);
        }
        if (z.tick <= 0) z.tick = 0.55;
      }
    }
    this.zones = this.zones.filter((z) => !z.dead);
  },

  // ================== EFFECTS ==================
  updateSpawnQueue(dt) {
    for (const s of this.spawnQueue) {
      s.delay -= dt;
      s.marker -= dt;
      if (s.delay <= 0 && !s.spawned) {
        s.spawned = true;
        const e = this.addEnemy(s.type, s.x, s.y, { elite: s.elite });
        this.ring(s.x, s.y, 40, s.elite ? '#ffcf6a' : '#d98aff');
        this.burst(s.x, s.y - 10, s.elite ? '#ffcf6a' : '#b98cf0', 14, 160, 'ember');
      }
    }
    this.spawnQueue = this.spawnQueue.filter((s) => !s.spawned);
  },

  checkClear(dt) {
    if (this.state !== 'fight' || this.boss) return;
    if (this.enemies.length === 0 && this.spawnQueue.length === 0) {
      this.clearDelay += dt;
      if (this.clearDelay > 0.85) {
        if (this.run.wave < this.run.wavesTotal - 1) {
          this.run.wave++;
          this.clearDelay = 0;
          this.spawnWave();
          this.toast(`Волна ${this.run.wave + 1} из ${this.run.wavesTotal}`);
        } else {
          this.onRoomCleared();
        }
      }
    } else {
      this.clearDelay = 0;
    }
  },

  updateEffects(dt) {
    for (const p of this.particles) {
      p.t += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const f = Math.exp(-2.2 * dt);
      p.vx *= f; p.vy *= f;
      if (p.kind === 'blood') p.vy += 380 * dt;
      if (p.kind === 'piece') { p.vy += 500 * dt; p.rot = (p.rot || 0) + dt * 8; }
      if (p.kind === 'soul') p.vy -= 30 * dt;
      if (p.kind === 'ember') p.vy -= 24 * dt;
    }
    this.particles = this.particles.filter((p) => p.t < p.life);
    if (this.particles.length > 460) this.particles.splice(0, this.particles.length - 460);
    for (const s of this.slashes) s.t += dt;
    this.slashes = this.slashes.filter((s) => s.t < s.dur);
    for (const b of this.bolts) b.t += dt;
    this.bolts = this.bolts.filter((b) => b.t < b.life);
  },

  burst(x, y, color, count, speed, kind) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, sp = rnd(speed, speed * 0.2);
      this.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (kind === 'ember' ? 40 : 0),
        t: 0, life: rnd(0.9, 0.35) * (kind === 'ember' ? 1.6 : 1),
        kind: kind || 'spark', color, size: rnd(3.4, 1),
        rot: rnd(TAU),
      });
    }
  },

  ring(x, y, radius, color) {
    this.particles.push({ x, y, vx: 0, vy: 0, t: 0, life: 0.45, kind: 'ring', color, size: radius * 0.25, grow: radius * 0.9, w: 3 });
  },

  bolt(x1, y1, x2, y2, color = '#9fe6ff') {
    const pts = [];
    const segs = 7;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      pts.push({
        x: lerp(x1, x2, t) + (i === 0 || i === segs ? 0 : rnd(26, -26)),
        y: lerp(y1, y2, t) + (i === 0 || i === segs ? 0 : rnd(14, -14)),
      });
    }
    this.bolts.push({ pts, t: 0, life: 0.28, color });
  },

  shake(amount) {
    this.shakeAmount = Math.min(22, this.shakeAmount + amount);
  },

  spawnDecal(x, y, color, size) {
    this.decals = this.decals || [];
    this.decals.push({ x, y, color, size, rot: rnd(TAU) });
    if (this.decals.length > 70) this.decals.shift();
  },

  float(x, y, text, cls) {
    this.emit('float', { x, y, text, cls });
  },
};
