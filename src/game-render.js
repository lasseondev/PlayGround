// World rendering.
import { TAU, clamp, lerp, damp, rnd, angleTo, angleDiff } from './core.js';
import {
  drawGlow, drawPlayer, drawEnemy, drawBoss, drawSlash, drawParticle,
  drawProjectileArt, drawPillar, drawRubble, drawBrazier, rgba,
} from './art.js';
import { ROOM_W, ROOM_H, MARGIN } from './constants.js';
import { drawMenu } from './art.js';

export const renderMethods = {
  render(t) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    if (!this.run || !this.floor) return;
    const biome = this.biome;
    ctx.fillStyle = biome.bg;
    ctx.fillRect(0, 0, this.w, this.h);

    const sh = this.shakeAmount;
    const shx = sh ? rnd(sh, -sh) : 0;
    const shy = sh ? rnd(sh, -sh) : 0;
    const p = this.player;

    ctx.save();
    ctx.translate(this.w / 2, this.h / 2);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.cam.x + shx, -this.cam.y + shy);

    ctx.drawImage(this.floor, 0, 0);

    // blood / scorch decals
    if (this.decals && this.decals.length) {
      for (const d of this.decals) {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, d.size);
        grd.addColorStop(0, rgba(d.color, 0.5));
        grd.addColorStop(1, rgba(d.color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.ellipse(0, 0, d.size, d.size * 0.55, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    this.drawAmbientDust(ctx, t);
    this.drawBrazierLight(ctx);
    this.drawZones(ctx, t);
    this.drawSpawnMarkers(ctx, t);
    this.drawTelegraphs(ctx, t);

    // movement ring under player
    if (p) {
      ctx.strokeStyle = 'rgba(227,189,123,.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 2, 22, 8, 0, 0, TAU);
      ctx.stroke();
    }
    if (this.boss && !this.boss.dead) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, this.boss.enraged ? '#ff3a1a' : '#ff7a3a', this.boss.x, this.boss.y - 30, 160, 0.16);
      ctx.restore();
      ctx.strokeStyle = this.boss.enraged ? 'rgba(255,80,50,.35)' : 'rgba(255,140,80,.22)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(this.boss.x, this.boss.y + 6, 100, 30, 0, 0, TAU); ctx.stroke();
    }

    // y-sorted props and actors
    const drawables = [];
    for (const o of this.obstacles) drawables.push({ y: o.y, kind: 'obstacle', o });
    for (const b of this.braziers) drawables.push({ y: b.y, kind: 'brazier', o: b });
    for (const e of this.enemies) if (!e.dead) drawables.push({ y: e.y, kind: 'enemy', e });
    if (this.boss && !this.boss.dead) drawables.push({ y: this.boss.y + 20, kind: 'boss', b: this.boss });
    if (p && this.state !== 'dead') drawables.push({ y: p.y + 2, kind: 'player' });
    drawables.sort((a, b) => a.y - b.y);

    for (const d of drawables) {
      if (d.kind === 'obstacle') {
        if (d.o.type === 'pillar') drawPillar(ctx, d.o, biome, t);
        else drawRubble(ctx, d.o, biome);
      } else if (d.kind === 'brazier') drawBrazier(ctx, d.o, biome.ember, t);
      else if (d.kind === 'enemy') {
        const e = d.e;
        const alpha = e.spawnT > 0 ? clamp(1 - e.spawnT / 0.55, 0, 1) : 1;
        if (alpha < 1) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(0, (1 - alpha) * 20);
          drawEnemy(ctx, e, t);
          ctx.restore();
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ctx, e.elite ? '#ffcf6a' : '#b98cf0', e.x, e.y - 10, 55 * alpha, 0.4);
          ctx.restore();
        } else drawEnemy(ctx, e, t);
      } else if (d.kind === 'boss') {
        const b = d.b;
        if (b.spawnT > 0) {
          const a = clamp(1 - b.spawnT, 0.15, 1);
          ctx.save(); ctx.globalAlpha = a; drawBoss(ctx, b, t); ctx.restore();
        } else drawBoss(ctx, b, t);
      } else if (d.kind === 'player') {
        drawPlayer(ctx, p, t, this.run.weapon);
      }
    }

    // projectiles
    for (const pr of this.projectiles) {
      ctx.save();
      if (pr.type === 'arrow' || pr.type === 'orb' || pr.type === 'spear') {
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(ctx, pr.enemy ? (pr.color || '#ff9a5a') : '#d8ffa0', pr.x, pr.y, 18, 0.25);
        ctx.globalCompositeOperation = 'source-over';
      }
      drawProjectileArt(ctx, pr, t);
      ctx.restore();
    }

    // particles (world)
    for (const pa of this.particles) drawParticle(ctx, pa);
    // slashes
    for (const s of this.slashes) drawSlash(ctx, s);
    // bolts
    this.drawBolts(ctx, t);

    // aim reticle
    if (p && this.state === 'fight' && !this.input.usingTouch && performance.now() - this.input.mouse.lastMove < 2800) {
      const wx = this.cam.x + (this.input.mouse.x - this.w / 2) / this.scale;
      const wy = this.cam.y + (this.input.mouse.y - this.h / 2) / this.scale;
      ctx.save();
      ctx.strokeStyle = 'rgba(247,230,189,.55)';
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(wx, wy, 7, 0, TAU); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(wx + Math.cos(a) * 10, wy + Math.sin(a) * 10);
        ctx.lineTo(wx + Math.cos(a) * 15, wy + Math.sin(a) * 15);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(247,230,189,.8)';
      ctx.beginPath(); ctx.arc(wx, wy, 1.4, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // player warm light
    if (p) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, '#ffd7a0', p.x, p.y - 30, 180, 0.1);
      ctx.restore();
    }
    ctx.restore();

    // ---------- screen space ----------
    this.drawScreenAtmosphere(ctx, t);
  },

  drawAmbientDust(ctx, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const d of this.dust) {
      const a = 0.08 + 0.1 * (0.5 + Math.sin(d.phase) * 0.5);
      ctx.fillStyle = rgba(this.biome.ember, a);
      ctx.beginPath();
      ctx.arc(d.x, d.y + Math.sin(d.phase + t) * 6, d.size, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },

  drawBrazierLight(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const b of this.braziers) {
      drawGlow(ctx, this.biome.ember, b.x, b.y - 30, 130, 0.22);
    }
    ctx.restore();
  },

  drawZones(ctx, t) {
    for (const z of this.zones) {
      const a = clamp(z.life / 1.2, 0, 1);
      ctx.save();
      const grd = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.r);
      grd.addColorStop(0, rgba('#ff5a2a', 0.28 * a));
      grd.addColorStop(0.6, rgba('#ff3a1a', 0.18 * a));
      grd.addColorStop(1, rgba('#ff3a1a', 0));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.ellipse(z.x, z.y, z.r, z.r * 0.55, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#ff8a4a', (0.35 + Math.sin(t * 8 + z.x) * 0.12) * a);
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(z.x, z.y, z.r * 0.8, z.r * 0.44, 0, 0, TAU); ctx.stroke();
      ctx.restore();
    }
  },

  drawSpawnMarkers(ctx, t) {
    for (const s of this.spawnQueue) {
      if (s.spawned) continue;
      const prog = 1 - clamp(s.delay / 0.62, 0, 1);
      const color = s.elite ? '#ffcf6a' : '#c08cff';
      const a = 0.4 + Math.sin(t * 8) * 0.2;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, color, s.x, s.y - 10, 46, a);
      ctx.strokeStyle = rgba(color, 0.65);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(s.x, s.y, 34, 14, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = rgba(color, 0.9);
      ctx.beginPath(); ctx.arc(s.x, s.y - 6, 26, -Math.PI / 2, -Math.PI / 2 + prog * TAU); ctx.stroke();
      ctx.strokeStyle = rgba(color, 0.4);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + 20); ctx.lineTo(s.x, s.y - 70);
      ctx.stroke();
      ctx.restore();
    }
  },

  drawTelegraphs(ctx, t) {
    const p = this.player;
    for (const e of this.enemies) {
      if (e.dead || e.spawnT > 0) continue;
      const progress = e.state === 'windup' ? 1 - clamp(e.stateT / (e.kind === 'slam' ? 0.85 : 0.55), 0, 1) : 1;
      const pulse = 0.45 + Math.sin(t * 12) * 0.18;
      ctx.save();
      if (e.state === 'windup') {
        if (e.kind === 'melee' || e.kind === 'dash') {
          const range = e.kind === 'dash' ? 260 : e.radius + 60;
          ctx.translate(e.x, e.y);
          ctx.rotate(e.face);
          ctx.fillStyle = `rgba(220,50,40,${0.1 + progress * 0.16})`;
          ctx.beginPath();
          ctx.moveTo(0, -e.radius * 0.6);
          ctx.lineTo(range, -range * 0.25);
          ctx.lineTo(range, range * 0.25);
          ctx.lineTo(0, e.radius * 0.6);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = `rgba(255,90,70,${pulse})`; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(0, -e.radius * 0.6); ctx.lineTo(range, -range * 0.25); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, e.radius * 0.6); ctx.lineTo(range, range * 0.25); ctx.stroke();
        } else if (e.kind === 'ranged') {
          ctx.strokeStyle = `rgba(255,140,60,${pulse * 0.7})`;
          ctx.setLineDash([8, 7]); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(e.x, e.y - 28); ctx.lineTo(p.x, p.y - 12); ctx.stroke();
          ctx.setLineDash([]);
        } else if (e.kind === 'slam') {
          ctx.fillStyle = `rgba(220,50,40,${0.08 + progress * 0.14})`;
          ctx.strokeStyle = `rgba(255,100,60,${pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(e.x, e.y, 112, 50, 0, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(e.x, e.y, 112 * progress, 50 * progress, 0, 0, TAU); ctx.stroke();
        } else if (e.kind === 'caster') {
          ctx.strokeStyle = `rgba(200,140,255,${pulse})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(e.x, e.y - 30, 22 + progress * 8, 0, TAU); ctx.stroke();
        }
      }
      ctx.restore();
    }
    const b = this.boss;
    if (b && !b.dead && b.spawnT <= 0) {
      const pulse = 0.5 + Math.sin(t * 10) * 0.2;
      ctx.save();
      if (b.state === 'windup' && b.pendingAttack === 'charge') {
        ctx.translate(b.x, b.y);
        ctx.rotate(b.attackDir);
        const len = 1100;
        ctx.fillStyle = `rgba(230,60,35,${0.14 + pulse * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 0.7);
        ctx.lineTo(len, -b.radius * 0.9);
        ctx.lineTo(len, b.radius * 0.9);
        ctx.lineTo(0, b.radius * 0.7);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(255,120,80,${pulse})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(b.radius, 0); ctx.lineTo(len, 0); ctx.stroke();
      } else if (b.state === 'windup' && b.pendingAttack === 'breath') {
        ctx.translate(b.x, b.y - 20);
        ctx.rotate(angleTo(b.x, b.y, p.x, p.y));
        const len = 340, spread = 0.62;
        ctx.fillStyle = `rgba(230,80,40,${0.1 + pulse * 0.1})`;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, len, -spread, spread);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(255,140,80,${pulse})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-spread) * len, Math.sin(-spread) * len); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(spread) * len, Math.sin(spread) * len); ctx.stroke();
      } else if (b.state === 'windup' && b.pendingAttack === 'slam') {
        ctx.strokeStyle = `rgba(255,100,60,${pulse})`;
        ctx.fillStyle = `rgba(220,50,40,${0.12})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(b.x, b.y, 195, 90, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(b.x, b.y, 195 * (1 - b.stateT / 0.95), 90 * (1 - b.stateT / 0.95), 0, 0, TAU); ctx.stroke();
      } else if (b.state === 'windup' && b.pendingAttack === 'summon') {
        ctx.strokeStyle = `rgba(255,120,80,${pulse})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(b.x, b.y - 20, 90 + Math.sin(t * 6) * 8, 0, TAU); ctx.stroke();
      } else if (b.state === 'breath') {
        ctx.translate(b.x, b.y - 20);
        ctx.rotate(b.face);
        const len = 340, spread = 0.62;
        const grd = ctx.createRadialGradient(0, 0, 20, 0, 0, len);
        grd.addColorStop(0, 'rgba(255,150,60,.28)');
        grd.addColorStop(0.7, 'rgba(255,90,30,.12)');
        grd.addColorStop(1, 'rgba(255,60,20,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, len, -spread, spread); ctx.closePath(); ctx.fill();
      } else if (b.state === 'slam') {
        const prog = 1 - b.stateT / 0.45;
        ctx.strokeStyle = `rgba(255,110,60,${pulse})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(b.x, b.y, 195 * prog, 90 * prog, 0, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
  },

  drawBolts(ctx, t) {
    for (const b of this.bolts) {
      const a = 1 - b.t / b.life;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(b.color, 0.25 * a);
      ctx.lineWidth = 8;
      ctx.beginPath();
      b.pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.strokeStyle = rgba('#ffffff', 0.9 * a);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  },

  drawScreenAtmosphere(ctx, t) {
    const w = this.w, h = this.h;
    const p = this.player;
    // low hp vignette
    const hpFrac = this.run ? this.run.hp / this.run.maxHp : 1;
    if (hpFrac < 0.36 && this.state !== 'dead') {
      const pulse = 0.55 + Math.sin(t * 5) * 0.25;
      const grd = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
      grd.addColorStop(0, 'rgba(120,10,14,0)');
      grd.addColorStop(1, `rgba(130,14,18,${0.28 * pulse})`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }
    if (this.run && this.run.rageActive > 0) {
      const grd = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
      grd.addColorStop(0, 'rgba(255,110,60,0)');
      grd.addColorStop(1, `rgba(210,70,30,${0.14 + Math.sin(t * 9) * 0.04})`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }
    // drifting fog
    const biome = this.biome;
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const sx = ((t * (8 + i * 5) + i * 640) % (w + 700)) - 350;
      const sy = h * (0.25 + i * 0.22);
      const rr = w * (0.35 + i * 0.08);
      const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, rr);
      grd.addColorStop(0, rgba(biome.fog, 0.16));
      grd.addColorStop(1, rgba(biome.fog, 0));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(sx, sy, rr, 0, TAU); ctx.fill();
    }
    ctx.restore();
    // intro / death dim
    let dim = 0;
    if (this.state === 'intro') dim = clamp(this.introT * 0.22, 0, 0.4);
    if (this.state === 'dying' || this.state === 'dead') dim = 0.45;
    if (dim > 0) {
      ctx.fillStyle = `rgba(5,2,7,${dim})`;
      ctx.fillRect(0, 0, w, h);
    }
    // cinematic letterbox feel
    const top = ctx.createLinearGradient(0, 0, 0, h * 0.16);
    top.addColorStop(0, 'rgba(2,1,4,.45)'); top.addColorStop(1, 'rgba(2,1,4,0)');
    ctx.fillStyle = top; ctx.fillRect(0, 0, w, h * 0.16);
    const bot = ctx.createLinearGradient(0, h * 0.84, 0, h);
    bot.addColorStop(0, 'rgba(2,1,4,0)'); bot.addColorStop(1, 'rgba(2,1,4,.5)');
    ctx.fillStyle = bot; ctx.fillRect(0, h * 0.84, w, h * 0.16);
  },

  drawMenu(ctx, t) {
    drawMenu(ctx, this.w, this.h, t);
  },
};
