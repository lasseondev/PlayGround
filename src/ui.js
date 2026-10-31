/* Interface layer: HUD, minimap, banners, prompts, screens and toasts. */

const SIGIL_META = {
  stone: { label: 'Sigil of Stone', color: 0x57e4d2, css: '#57e4d2', toast: 'The stone remembers its shape.' },
  flame: { label: 'Sigil of Flame', color: 0xff9b52, css: '#ff9b52', toast: 'The eternal fire bends its knee.' },
  courage: { label: 'Sigil of Courage', color: 0xa9d8ff, css: '#a9d8ff', toast: 'The dark could not break you.' },
};

const HEART_PATH = 'M16 28.2S3.1 20.2 3.1 11.7C3.1 7.1 6.7 3.9 10.8 3.9c2.4 0 4.4 1.1 5.2 2.9.8-1.8 2.8-2.9 5.2-2.9 4.1 0 7.7 3.2 7.7 7.8 0 8.5-12.9 16.5-12.9 16.5z';

export class UI {
  constructor(world) {
    this.world = world;
    this.refs = {
      hud: document.getElementById('hud'),
      hearts: document.getElementById('hearts'),
      sigilTrack: document.getElementById('sigil-track'),
      sigils: [...document.querySelectorAll('.sigil')],
      torchFuel: document.getElementById('torch-fuel'),
      torchRing: document.getElementById('torch-ring'),
      minimap: document.getElementById('minimap'),
      roomBanner: document.getElementById('room-banner'),
      bannerKicker: document.querySelector('#room-banner .banner-kicker'),
      bannerTitle: document.querySelector('#room-banner .banner-title'),
      bossbar: document.getElementById('bossbar'),
      bossFill: document.getElementById('bossbar-fill'),
      bossPips: document.getElementById('bossbar-pips'),
      quest: document.getElementById('quest'),
      questText: document.getElementById('quest-text'),
      prompt: document.getElementById('prompt'),
      promptKey: document.getElementById('prompt-key'),
      promptText: document.getElementById('prompt-text'),
      toasts: document.getElementById('toasts'),
      lockHint: document.getElementById('lock-hint'),
      title: document.getElementById('title-screen'),
      pause: document.getElementById('pause-screen'),
      death: document.getElementById('death-screen'),
      victory: document.getElementById('victory-screen'),
      deathStats: document.getElementById('death-stats'),
      victoryStats: document.getElementById('victory-stats'),
      loading: document.getElementById('loading'),
      touch: document.getElementById('touch-controls'),
      damage: document.getElementById('damage-flash'),
      heal: document.getElementById('heal-flash'),
      muteBtn: document.getElementById('mute-btn'),
      restartBtn: document.getElementById('restart-btn'),
      resumeBtn: document.getElementById('resume-btn'),
      startBtn: document.getElementById('start-btn'),
      retryBtn: document.getElementById('retry-btn'),
      againBtn: document.getElementById('again-btn'),
    };
    this.ctx = this.refs.minimap.getContext('2d');
    this.maxHearts = 0;
    this.hp = 0;
    this.bannerTimer = 0;
    this.toastTimers = new Map();
    this.mapTimer = 0;
    this.mapPulse = 0;
    this.lastQuest = '';
    this.torchVisible = false;
    this.touchMode = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (this.touchMode) document.body.classList.add('touch-mode');
    this.setHearts(5, 5, true);
    this.setQuest('Recover the three sigils.', true);
  }

  /* ------------------------------------------------------------- hearts */

  buildHearts(max) {
    const old = this.refs.hearts.children.length;
    this.refs.hearts.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const el = document.createElement('div');
      el.className = 'heart' + (i >= old ? ' is-new' : '');
      el.innerHTML = `<svg viewBox="0 0 32 30" aria-hidden="true">
        <path class="shell" d="${HEART_PATH}"/>
        <path class="fill" d="${HEART_PATH}"/>
      </svg>`;
      this.refs.hearts.appendChild(el);
      if (i >= old) setTimeout(() => el.classList.remove('is-new'), 800);
    }
    this.maxHearts = max;
  }

  setHearts(hp, max = this.maxHearts, silent = false) {
    hp = Math.max(0, Math.min(max, hp));
    if (max !== this.maxHearts) this.buildHearts(max);
    const hearts = [...this.refs.hearts.children];
    const previous = this.hp;
    hearts.forEach((el, i) => {
      const lit = i < hp;
      el.classList.toggle('is-empty', !lit);
      if (!silent && i >= hp && i < previous) {
        el.classList.add('is-lost');
        setTimeout(() => el.classList.remove('is-lost'), 620);
      }
    });
    this.hp = hp;
    this.refs.hearts.setAttribute('aria-label', `Health ${hp} of ${max}`);
  }

  /* ------------------------------------------------------------- sigils */

  setSigil(id) {
    const el = this.refs.sigils.find((s) => s.dataset.sigil === id);
    if (!el) return;
    el.classList.add('is-lit', 'is-new');
    setTimeout(() => el.classList.remove('is-new'), 1100);
  }

  resetSigils() {
    for (const el of this.refs.sigils) el.classList.remove('is-lit', 'is-new');
  }

  getSigilMeta(id) { return SIGIL_META[id] ?? SIGIL_META.stone; }

  /* --------------------------------------------------------------- quest */

  setQuest(text, immediate = false) {
    if (!text || text === this.lastQuest) return;
    this.lastQuest = text;
    this.refs.questText.textContent = text;
    if (!immediate) {
      this.refs.quest.classList.remove('flash');
      void this.refs.quest.offsetWidth;
      this.refs.quest.classList.add('flash');
    }
  }

  /* --------------------------------------------------------------- toast */

  toast(text, kind = '', ttl = 3400) {
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ` kind-${kind}` : '');
    el.textContent = text;
    this.refs.toasts.appendChild(el);
    while (this.refs.toasts.children.length > 4) this.refs.toasts.removeChild(this.refs.toasts.firstChild);
    const fadeTimer = setTimeout(() => {
      el.classList.add('fade');
    }, ttl);
    const removeTimer = setTimeout(() => el.remove(), ttl + 600);
    this.toastTimers.set(el, [fadeTimer, removeTimer]);
  }

  clearToasts() {
    for (const [, timers] of this.toastTimers) for (const t of timers) clearTimeout(t);
    this.toastTimers.clear();
    this.refs.toasts.innerHTML = '';
  }

  /* -------------------------------------------------------------- banner */

  roomBanner(room) {
    if (!room) return;
    const { bannerKicker, bannerTitle, roomBanner } = this.refs;
    bannerKicker.textContent = room.kicker ?? '';
    bannerTitle.textContent = room.name ?? '';
    roomBanner.classList.add('is-visible');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => roomBanner.classList.remove('is-visible'), 3600);
  }

  /* -------------------------------------------------------------- prompt */

  showPrompt(text, key = 'E') {
    this.refs.promptText.textContent = text;
    this.refs.promptKey.textContent = this.touchMode ? '✦' : key;
    this.refs.prompt.classList.add('is-visible');
    this.refs.prompt.classList.remove('is-hidden');
  }

  hidePrompt() {
    this.refs.prompt.classList.remove('is-visible');
    this.refs.prompt.classList.add('is-hidden');
  }

  /* --------------------------------------------------------------- torch */

  setTorch(fraction, visible) {
    const el = this.refs.torchFuel;
    if (visible !== this.torchVisible) {
      this.torchVisible = visible;
      el.classList.toggle('is-hidden', !visible);
    }
    if (!visible) return;
    const f = Math.max(0, Math.min(1, fraction));
    this.refs.torchRing.style.strokeDashoffset = String(113 * (1 - f));
    el.classList.toggle('is-low', f < 0.24);
  }

  /* --------------------------------------------------------------- boss */

  showBossBar(maxHp = 6) {
    this.refs.bossPips.innerHTML = '';
    for (let i = 0; i < maxHp; i++) this.refs.bossPips.appendChild(document.createElement('span'));
    this.updateBossBar(maxHp, maxHp);
    this.refs.bossbar.classList.remove('is-hidden');
  }

  updateBossBar(hp, max) {
    const f = Math.max(0, Math.min(1, max > 0 ? hp / max : 0));
    this.refs.bossFill.style.transform = `scaleX(${f})`;
  }

  hideBossBar() {
    this.refs.bossbar.classList.add('is-hidden');
  }

  /* --------------------------------------------------------------- flash */

  damageFlash() {
    this.refs.damage.classList.add('flash');
    setTimeout(() => this.refs.damage.classList.remove('flash'), 90);
  }

  healFlash() {
    this.refs.heal.classList.add('flash');
    setTimeout(() => this.refs.heal.classList.remove('flash'), 120);
  }

  /* -------------------------------------------------------------- screens */

  hideScreens() {
    for (const s of [this.refs.title, this.refs.pause, this.refs.death, this.refs.victory]) s.classList.add('is-hidden');
  }

  showTitle() {
    this.hideScreens();
    this.refs.title.classList.remove('is-hidden');
  }

  showPause() {
    this.refs.pause.classList.remove('is-hidden');
  }

  hidePause() {
    this.refs.pause.classList.add('is-hidden');
  }

  showDeath(stats) {
    this.hideScreens();
    this.refs.deathStats.innerHTML = this.statMarkup(stats);
    this.refs.death.classList.remove('is-hidden');
  }

  showVictory(stats) {
    this.hideScreens();
    this.refs.victoryStats.innerHTML = this.statMarkup(stats);
    this.refs.victory.classList.remove('is-hidden');
  }

  statMarkup(stats = {}) {
    const rows = [
      ['Time', stats.time ?? '—'],
      ['Sigils', stats.sigils ?? '0 / 3'],
      ['Foes felled', stats.kills ?? '0'],
    ];
    return rows.map(([label, value]) => `<div class="end-stat"><span class="value">${value}</span><span class="label">${label}</span></div>`).join('');
  }

  setHud(visible) {
    this.refs.hud.classList.toggle('is-hidden', !visible);
  }

  setTouch(visible) {
    this.refs.touch.classList.toggle('is-hidden', !visible);
  }

  setPlaying(playing) {
    document.getElementById('game').classList.toggle('is-playing', playing);
  }

  setLockHint(visible) {
    this.refs.lockHint.classList.toggle('is-hidden', !visible);
  }

  setMuted(muted) {
    this.refs.muteBtn.querySelector('.btn-label').textContent = muted ? 'Sound: Off' : 'Sound: On';
  }

  hideLoading() {
    this.refs.loading.classList.add('is-hidden');
  }

  /* -------------------------------------------------------------- minimap */

  updateMinimap(dt, player, roomId, visitedHallId) {
    this.mapTimer -= dt;
    this.mapPulse += dt;
    if (this.mapTimer > 0) return;
    this.mapTimer = 0.09;
    const ctx = this.ctx;
    const size = 240;
    const world = this.world;
    const rooms = world.rooms;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const r of rooms) {
      minX = Math.min(minX, r.x - r.w / 2);
      maxX = Math.max(maxX, r.x + r.w / 2);
      minZ = Math.min(minZ, r.z - r.d / 2);
      maxZ = Math.max(maxZ, r.z + r.d / 2);
    }
    const pad = 18;
    const scale = Math.min((size - pad * 2) / (maxX - minX), (size - pad * 2) / (maxZ - minZ));
    const cx = minX + (maxX - minX) / 2;
    const cz = minZ + (maxZ - minZ) / 2;
    const tx = (x) => size / 2 + (x - cx) * scale;
    const ty = (z) => size / 2 + (z - cz) * scale;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(5, 9, 12, 0.22)';
    ctx.fillRect(0, 0, size, size);

    // graph paper
    ctx.strokeStyle = 'rgba(217, 185, 114, 0.055)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const p = (i / 7) * size;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
    }

    // corridors
    const halls = world.minimap.corridors ?? [];
    ctx.lineCap = 'square';
    for (const h of halls) {
      const visited = world.visited.has(h.id);
      const x = h.dir === 'x' ? Math.min(h.x1, h.x2) : h.x - h.width / 2;
      const z = h.dir === 'z' ? Math.min(h.z1, h.z2) : h.z - h.width / 2;
      const w = h.dir === 'x' ? Math.abs(h.x2 - h.x1) : h.width;
      const d = h.dir === 'z' ? Math.abs(h.z2 - h.z1) : h.width;
      ctx.fillStyle = visited ? 'rgba(110, 196, 177, 0.2)' : 'rgba(90, 104, 101, 0.09)';
      ctx.strokeStyle = visited ? 'rgba(122, 210, 189, 0.34)' : 'rgba(217, 185, 114, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(tx(x), ty(z), w * scale, d * scale);
      ctx.fill();
      ctx.stroke();
    }

    // rooms
    for (const r of rooms) {
      const visited = world.visited.has(r.id);
      const active = r.id === roomId;
      const x = tx(r.x - r.w / 2);
      const z = ty(r.z - r.d / 2);
      const w = r.w * scale;
      const d = r.d * scale;
      ctx.fillStyle = active ? 'rgba(217, 185, 114, 0.16)' : visited ? 'rgba(110, 196, 177, 0.12)' : 'rgba(70, 78, 74, 0.06)';
      ctx.strokeStyle = active ? 'rgba(243, 217, 150, 0.85)' : visited ? 'rgba(122, 210, 189, 0.46)' : 'rgba(217, 185, 114, 0.14)';
      ctx.lineWidth = active ? 1.6 : 1;
      ctx.beginPath();
      ctx.rect(x, z, w, d);
      ctx.fill();
      ctx.stroke();
    }

    // markers for trials
    const markers = world.minimap.markers ?? {};
    for (const [id, m] of Object.entries(markers)) {
      const discovered = id === 'boss'
        ? world.visited.has('boss') || world.bossGate?.opened
        : world.visited.has(id);
      if (!discovered) continue;
      const mx = tx(m.x), my = ty(m.z);
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = id === 'boss' ? 'rgba(227, 106, 85, 0.85)' : m.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(-2.7, -2.7, 5.4, 5.4);
      ctx.restore();
    }

    // player marker + view cone
    const px = tx(player.pos.x);
    const py = ty(player.pos.z);
    const heading = player.yaw;
    const dx = -Math.sin(heading), dz = -Math.cos(heading);
    const angle = Math.atan2(dz, dx);
    ctx.save();
    ctx.translate(px, py);
    const pulse = 7 + Math.sin(this.mapPulse * 3.4) * 1.6;
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, 17);
    grad.addColorStop(0, 'rgba(243, 217, 150, 0.32)');
    grad.addColorStop(1, 'rgba(243, 217, 150, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(angle + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -pulse);
    ctx.lineTo(pulse * 0.66, pulse * 0.72);
    ctx.lineTo(0, pulse * 0.34);
    ctx.lineTo(-pulse * 0.66, pulse * 0.72);
    ctx.closePath();
    ctx.fillStyle = '#f3d996';
    ctx.shadowColor = 'rgba(243, 217, 150, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.strokeStyle = 'rgba(8, 11, 13, 0.9)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // compass ticks
    ctx.strokeStyle = 'rgba(217, 185, 114, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size / 2, 7); ctx.lineTo(size / 2, 13);
    ctx.moveTo(size / 2, size - 7); ctx.lineTo(size / 2, size - 13);
    ctx.moveTo(7, size / 2); ctx.lineTo(13, size / 2);
    ctx.moveTo(size - 7, size / 2); ctx.lineTo(size - 13, size / 2);
    ctx.stroke();
  }
}
