import { WEAPONS } from './weapons.js';

const $ = (id) => document.getElementById(id);

export class HUD {
  constructor() {
    this.root = $('hud');
    this.healthVal = $('healthVal');
    this.healthBar = $('healthBar');
    this.armorVal = $('armorVal');
    this.armorBar = $('armorBar');
    this.fuelBar = $('fuelBar');
    this.weaponName = $('weaponName');
    this.weaponHint = $('weaponHint');
    this.ammoVal = $('ammoVal');
    this.ammoLabel = $('ammoLabel');
    this.clock = $('clock');
    this.fragLimit = $('fragLimit');
    this.killfeedEl = $('killfeed');
    this.announceEl = $('announce');
    this.crosshair = $('crosshair');
    this.hitmarkerEl = $('hitmarker');
    this.hitmarkerKillEl = $('hitmarkerKill');
    this.targetTag = $('targetTag');
    this.targetName = $('targetName');
    this.targetHp = $('targetHp');
    this.vignette = $('vignette');
    this.damageFx = $('damageFx');
    this.quadFx = $('quadFx');
    this.quadTimer = $('quadTimer');
    this.quadState = $('quadState');
    this.objective = document.querySelector('.objective');
    this.playerFrags = $('playerFrags');
    this.playerDeaths = $('playerDeaths');
    this.playerStreak = $('playerStreak');
    this.respawnOverlay = $('respawnOverlay');
    this.respawnTitle = $('respawnTitle');
    this.respawnSub = $('respawnSub');
    this.respawnCount = $('respawnCount');
    this.scoreboardEl = $('scoreboard');
    this.sbClock = $('sbClock');
    this.sbRows = $('sbRows');
    this.radar = $('radar');
    this.radarCount = $('radarCount');
    this.radarCtx = this.radar.getContext('2d');
    this.pointerHint = $('pointerHint');
    this.touchControls = $('touchControls');
    this.slots = Array.from(document.querySelectorAll('.slot'));
    this.weaponPanel = document.querySelector('.weapon-panel');
    this.vitals = document.querySelector('.vitals');
    this.announceTimer = null;
    this.killRows = [];
    this.scoreboardTimer = 0;
    this.radarAngle = 0;
    this.lastAim = null;
    this.toastEl = $('toast');
    this.toastTimer = null;
    this.weaponFlash = 0;
    this.slotButtons = [];
    this.bindSlotButtons();
  }

  bindSlotButtons() {
    this.slots.forEach((s) => {
      s.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.onSlot?.(Number(s.dataset.slot));
      });
    });
  }

  setVisible(v) {
    this.root.classList.toggle('hidden', !v);
  }

  flashWeapon() {
    this.weaponFlash = 1;
    this.weaponPanel.style.transition = 'none';
    this.weaponPanel.style.transform = 'translateY(6px)';
    requestAnimationFrame(() => {
      this.weaponPanel.style.transition = 'transform .22s cubic-bezier(.2,.9,.3,1.4)';
      this.weaponPanel.style.transform = '';
    });
  }

  update(dt, game) {
    const p = game.player;
    this.weaponFlash = Math.max(0, this.weaponFlash - dt * 4);

    // vitals
    const hp = Math.max(0, Math.round(p.health));
    const ar = Math.max(0, Math.round(p.armor));
    this.healthVal.textContent = hp;
    this.armorVal.textContent = ar;
    this.healthBar.style.width = Math.min(100, hp / 100 * 100) + '%';
    this.armorBar.style.width = Math.min(100, ar / 100 * 100) + '%';
    this.vitals.classList.toggle('low', hp <= 30);

    // fuel
    const fuelPct = p.fuel / p.maxFuel * 100;
    this.fuelBar.style.width = fuelPct + '%';
    this.fuelBar.classList.toggle('low', fuelPct < 28);
    const skiTag = $('skiTag');
    skiTag.textContent = p.jetting ? 'JET ACTIVE' : p.skiing ? 'SKIING' : p.grounded && Math.hypot(p.velocity.x, p.velocity.z) > 8 ? 'MOMENTUM' : p.fuel < 25 ? 'FUEL LOW' : 'SKI READY';
    skiTag.classList.toggle('hot', p.jetting || p.skiing || Math.hypot(p.velocity.x, p.velocity.z) > 8);

    // weapon
    const w = WEAPONS[p.weaponIndex];
    this.weaponName.textContent = w.name;
    this.weaponHint.textContent = w.infinite ? '∞ AMMO · ' + w.desc : w.desc;
    const ammo = p.ammo[w.id];
    this.ammoVal.textContent = w.infinite ? '∞' : ammo;
    this.ammoLabel.textContent = w.ammoLabel;
    this.ammoVal.style.color = !w.infinite && ammo <= 2 ? '#ff6b7a' : '';
    const reloadTag = $('reloadTag');
    reloadTag.textContent = !w.infinite && ammo <= 0 ? 'EMPTY' : '';
    this.slots.forEach((s, i) => {
      const sw = WEAPONS[i];
      const a = p.ammo[sw.id];
      const full = sw.maxAmmo || 1;
      s.classList.toggle('active', i === p.weaponIndex);
      s.classList.toggle('empty', !sw.infinite && a <= 0);
      s.style.setProperty('--f', sw.infinite ? 1 : Math.max(0, Math.min(1, a / full)));
    });

    // crosshair
    const speed = Math.hypot(p.velocity.x, p.velocity.z);
    const spread = 5 + speed * 0.7 + (p.grounded ? 0 : 5) + (p.jetting ? 3 : 0);
    this.crosshair.style.setProperty('--spread', spread.toFixed(1) + 'px');
    this.crosshair.classList.toggle('quad', p.quad > 0);

    // quad objective
    const quadPickup = game.world.pickups.find(x => x.type === 'quad');
    if (p.quad > 0) {
      this.objective.classList.add('live');
      this.quadState.textContent = 'ACTIVE · ' + Math.ceil(p.quad) + 's';
      this.quadTimer.style.width = (p.quad / 30 * 100) + '%';
      this.quadFx.classList.add('on');
    } else {
      this.quadFx.classList.remove('on');
      if (quadPickup) {
        if (quadPickup.active) {
          this.objective.classList.add('live');
          this.quadState.textContent = 'AVAILABLE · CENTER';
          this.quadTimer.style.width = '100%';
        } else {
          this.objective.classList.remove('live');
          this.quadState.textContent = 'RESPAWN ' + Math.ceil(quadPickup.timer) + 's';
          this.quadTimer.style.width = '0%';
        }
      }
    }

    // damage flash
    this.damageFx.style.opacity = (p.damageFlash * 0.85).toFixed(2);
    const lowHp = p.health < 35 && p.alive ? (0.12 + Math.sin(game.time * 6) * 0.05) : 0;
    this.vignette.style.boxShadow = p.quad > 0 ? 'inset 0 0 140px rgba(255,176,46,.35)' : lowHp ? `inset 0 0 130px rgba(255,20,50,${lowHp})` : '';

    // scores
    this.playerFrags.textContent = p.score;
    this.playerDeaths.textContent = p.deaths;
    this.playerStreak.textContent = p.streak;

    // clock
    const t = Math.max(0, game.timeLeft);
    const mm = Math.floor(t / 60).toString().padStart(2, '0');
    const ss = Math.floor(t % 60).toString().padStart(2, '0');
    this.clock.textContent = mm + ':' + ss;
    this.sbClock.textContent = mm + ':' + ss;
    this.fragLimit.textContent = game.fragLimit;

    // aim target tag
    const aim = game.aimTarget;
    if (aim && aim.alive && aim !== p) {
      this.targetTag.classList.remove('hidden');
      this.targetName.textContent = aim.name;
      this.targetHp.style.width = Math.max(0, (aim.health / 100) * 100) + '%';
    } else {
      this.targetTag.classList.add('hidden');
    }

    // scoreboard interval
    this.scoreboardTimer -= dt;
    if (this.scoreboardTimer <= 0) {
      this.scoreboardTimer = 0.4;
      if (!this.scoreboardEl.classList.contains('hidden')) this.renderScoreboard(game);
      this.radarAngle += 0.5;
    }

    this.drawRadar(game);

    // respawn overlay countdown
    if (!p.alive && game.respawnTimer > 0) {
      this.respawnCount.textContent = Math.ceil(game.respawnTimer);
    }

    // weapon switch flash
    if (this.weaponFlash > 0) {
      this.weaponPanel.style.filter = `brightness(${1 + this.weaponFlash * 0.5})`;
    } else this.weaponPanel.style.filter = '';
  }

  drawRadar(game) {
    const ctx = this.radarCtx;
    const W = this.radar.width, H = this.radar.height;
    const cx = W / 2, cy = H / 2;
    const p = game.player;
    const scale = 1.65;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, W / 2 - 2, 0, Math.PI * 2);
    ctx.clip();

    // background
    const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, W / 2);
    bg.addColorStop(0, 'rgba(12,30,44,.82)');
    bg.addColorStop(1, 'rgba(4,7,16,.7)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const yaw = p.yaw;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
    const rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const tp = (x, z) => {
      const dx = (x - p.position.x), dz = (z - p.position.z);
      return [cx + (dx * rx + dz * rz) * scale, cy - (dx * fx + dz * fz) * scale];
    };

    // grid
    ctx.strokeStyle = 'rgba(63,233,255,.08)';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i * 22, 0); ctx.lineTo(cx + i * 22, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i * 22); ctx.lineTo(W, cy + i * 22); ctx.stroke();
    }

    // map structures
    ctx.strokeStyle = 'rgba(120,195,225,.26)';
    ctx.fillStyle = 'rgba(40,80,110,.2)';
    ctx.lineWidth = 1;
    for (const b of game.world.colliders) {
      const w = b.max.x - b.min.x, d = b.max.z - b.min.z;
      if (w * d < 4 || b.min.y > 12) continue;
      const pts = [
        tp(b.min.x, b.min.z), tp(b.max.x, b.min.z), tp(b.max.x, b.max.z), tp(b.min.x, b.max.z)
      ];
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // pickups
    for (const pu of game.world.pickups) {
      if (!pu.active) continue;
      const [x, y] = tp(pu.position.x, pu.position.z);
      if (Math.hypot(x - cx, y - cy) > W / 2 - 4) continue;
      ctx.fillStyle = pu.type === 'quad' ? '#ffb02e' : pu.type === 'health' || pu.type === 'mega' ? '#ff4c6a' : pu.type === 'armor' ? '#51ffb0' : '#8bb8d8';
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }

    // enemies
    let count = 0;
    for (const b of game.bots) {
      if (!b.alive) continue;
      count++;
      const [x, y] = tp(b.position.x, b.position.z);
      const d = Math.hypot(x - cx, y - cy);
      if (d > W / 2 - 6) continue;
      ctx.fillStyle = '#' + b.color.toString(16).padStart(6, '0');
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    this.radarCount.textContent = count + ' HOSTILES';

    // sweep
    const a = this.radarAngle;
    const grad = ctx.createConicGradient ? ctx.createConicGradient(a, cx, cy) : null;
    ctx.strokeStyle = 'rgba(63,233,255,.25)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * W / 2, cy + Math.sin(a) * W / 2);
    ctx.stroke();

    // player arrow
    ctx.translate(cx, cy);
    ctx.fillStyle = '#c9fbff';
    ctx.shadowColor = '#3fe9ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(5, 5); ctx.lineTo(0, 2); ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ring
    ctx.strokeStyle = 'rgba(63,233,255,.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, W / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  killfeed(killer, victim, weaponId, quad = false) {
    const row = document.createElement('div');
    row.className = 'kf-row' + (quad ? ' quad' : '');
    const w = WEAPONS.find(x => x.id === weaponId);
    const names = { plasma: 'PLASMA', rocket: 'ROCKET', spin: 'SPIN', scatter: 'SCATTER', rail: 'RAIL', void: 'VOID' };
    const icon = weaponId === 'rail' ? '⌁' : weaponId === 'rocket' ? '✸' : weaponId === 'spin' ? '◎' : weaponId === 'plasma' ? '◉' : '✶';
    row.innerHTML = `<b class="${killer === 'YOU' ? 'you' : ''}">${killer}</b><i>${icon}</i><b class="${victim === 'YOU' ? 'you' : ''}">${victim}</b><span class="wep">${w ? w.short : (names[weaponId] || 'FRAG')}</span>`;
    this.killfeedEl.appendChild(row);
    this.killRows.push({ el: row, t: 7 });
    if (this.killRows.length > 5) {
      const old = this.killRows.shift();
      old.el.remove();
    }
    // purge
    const now = performance.now();
    for (let i = this.killRows.length - 1; i >= 0; i--) {
      const k = this.killRows[i];
      if (!k.start) k.start = now;
      if (now - k.start > 7000) {
        k.el.style.transition = 'opacity .4s';
        k.el.style.opacity = '0';
        setTimeout(() => k.el.remove(), 420);
        this.killRows.splice(i, 1);
      }
    }
  }

  announce(text, variant = '', dur = 2200) {
    const el = this.announceEl;
    el.textContent = text;
    el.className = 'announce ' + variant;
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(() => el.classList.remove('show'), dur);
  }

  hitmarker(kill) {
    const el = kill ? this.hitmarkerKillEl : this.hitmarkerEl;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  damage(sourcePos, player) {
    const wrap = document.getElementById('damageDirs');
    const el = document.createElement('div');
    el.className = 'dmg-dir';
    let angle = 0;
    if (sourcePos) {
      const dx = sourcePos.x - player.position.x;
      const dz = sourcePos.z - player.position.z;
      const worldAngle = Math.atan2(dx, dz);
      // relative to camera forward (-sin yaw, -cos yaw)
      angle = worldAngle - (player.yaw + Math.PI);
    }
    el.style.setProperty('--r', angle + 'rad');
    el.style.transform = `rotate(${angle + Math.PI}rad) translateY(-110px)`;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  toast(text) {
    this.toastEl.textContent = text;
    this.toastEl.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastEl.classList.add('hidden'), 1600);
  }

  showRespawn(killer, cause) {
    this.respawnOverlay.classList.remove('hidden');
    this.respawnTitle.textContent = cause === 'void' ? 'LOST TO THE VOID' : 'YOU WERE FRIED';
    this.respawnSub.textContent = killer ? 'BY ' + killer : (cause === 'void' ? 'NOBODY HEARD YOU' : 'BY THE ARENA');
  }
  hideRespawn() { this.respawnOverlay.classList.add('hidden'); }

  toggleScoreboard(show) {
    this.scoreboardEl.classList.toggle('hidden', !show);
  }

  renderScoreboard(game) {
    const list = [...game.combatants].sort((a, b) => b.score - a.score || a.deaths - b.deaths);
    const colors = ['#3fe9ff', '#ff2e8a', '#ffb02e', '#51ffb0', '#d9e8ff'];
    this.sbRows.innerHTML = list.map((e, i) => {
      const color = e.isPlayer ? '#3fe9ff' : '#' + e.color.toString(16).padStart(6, '0');
      return `<div class="sb-row ${e.isPlayer ? 'you' : ''}">
        <span class="sb-rank">${String(i + 1).padStart(2, '0')}</span>
        <span class="sb-name"><i style="color:${color};background:${color}"></i>${e.name}${e.isPlayer ? ' <em style="font-style:normal;color:#658399">(YOU)</em>' : ''}</span>
        <span class="sb-frags">${e.score}</span>
        <span>${e.deaths}</span>
        <span>${e.streak || 0}</span>
      </div>`;
    }).join('');
  }

  showPointerHint(show) {
    this.pointerHint.classList.toggle('hidden', !show);
  }

  showGameOver(game, victory) {
    const el = document.getElementById('gameover');
    const card = el.querySelector('.go-card');
    card.classList.toggle('lost', !victory);
    const title = document.getElementById('goTitle');
    const eyebrow = document.getElementById('goEyebrow');
    const sub = document.getElementById('goSub');
    const sorted = [...game.combatants].sort((a, b) => b.score - a.score || a.deaths - b.deaths);
    const rank = sorted.findIndex(e => e.isPlayer) + 1;
    title.textContent = victory ? 'VICTORY' : (rank <= 2 ? 'SO CLOSE' : 'DEFEAT');
    eyebrow.innerHTML = `<i></i> MATCH COMPLETE · RANK ${rank} / ${sorted.length}`;
    sub.textContent = victory
      ? 'Frag limit reached. The arena remembers.'
      : `The match slipped away. ${game.player.score} frags, ${game.player.deaths} deaths.`;
    document.getElementById('goScore').innerHTML = `
      <div><b>${game.player.score}</b>YOUR FRAGS</div>
      <div><b>${game.player.deaths}</b>DEATHS</div>
      <div><b>${game.player.bestStreak}</b>BEST STREAK</div>
      <div><b>${sorted[0] ? sorted[0].name : '—'}</b>LEADER</div>`;
    document.getElementById('goRows').innerHTML = sorted.map((e, i) => {
      const color = e.isPlayer ? '#3fe9ff' : '#' + e.color.toString(16).padStart(6, '0');
      return `<div class="go-row ${e.isPlayer ? 'you' : ''}"><span>${i + 1}</span><span style="color:${e.isPlayer ? '#eafcff' : color}">${e.name}</span><b>${e.score}</b><span>${e.deaths}</span></div>`;
    }).join('');
    el.classList.remove('hidden');
  }
  hideGameOver() { document.getElementById('gameover').classList.add('hidden'); }
}
