// Run state, chambers, rewards and shared combat helpers.
import {
  TAU, clamp, lerp, damp, rnd, chance, pick, shuffle, dist, angleTo, angleDiff,
  norm, mulberry32, roman,
} from './core.js';
import {
  GODS, BOONS, WEAPONS, HAMMERS, ENEMY_TYPES, chamberBiome, boonPower,
  META_UPGRADES, TOTAL_CHAMBERS, RARITY, MAX_BOON_LEVEL,
} from './data.js';
import {
  buildFloor, drawGlow, drawPlayer, drawEnemy, drawBoss, drawSlash, drawParticle,
  drawProjectileArt, drawPillar, drawRubble, drawBrazier, rgba,
} from './art.js';
import { simMethods } from './game-sim.js';
import { aiMethods } from './game-ai.js';
import { renderMethods } from './game-render.js';
import { ROOM_W, ROOM_H, WALL, MARGIN, PLAYER_BASE_SPEED } from './constants.js';

export { ROOM_W, ROOM_H, WALL, MARGIN, PLAYER_BASE_SPEED } from './constants.js';
const BOON_BY_ID = new Map(BOONS.map((b) => [b.id, b]));

export class Game {
  constructor({ canvas, input, audio, events }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.audio = audio;
    this.events = events || {};
    this.w = 1; this.h = 1; this.dpr = 1; this.scale = 1;
    this.cam = { x: ROOM_W / 2, y: ROOM_H / 2 };
    this.shakeAmount = 0;
    this.hitstop = 0;
    this.time = 0;
    this.run = null;
    this.state = 'hub';
    this.paused = false;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.slashes = [];
    this.bolts = [];
    this.zones = [];
    this.spawnQueue = [];
    this.obstacles = [];
    this.braziers = [];
    this.dust = [];
    this.floor = null;
    this.boss = null;
    this.decals = [];
    this.slowmo = 0;
    this.victoryEmitted = false;
    this.waveDelay = 0;
    this.clearDelay = 0;
    this.trailTick = 0;
    this.touchMove = { x: 0, y: 0 };
    this.touchAttack = false;
    this.pendingActions = new Set();
    this.mouseWorld = { x: ROOM_W / 2, y: ROOM_H / 2 };
    this.resize();
    for (let i = 0; i < 34; i++) this.dust.push(this.makeDust(true));
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(320, rect.width || window.innerWidth);
    this.h = Math.max(320, rect.height || window.innerHeight);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    let s = clamp(this.w / 1350, 0.72, 1.16);
    if (this.h / s < 560) s = this.h / 560;
    if (this.h / s > 1320) s = Math.max(0.62, this.h / 1320);
    this.scale = s;
    this.viewW = this.w / this.scale;
    this.viewH = this.h / this.scale;
  }

  // ============ run setup ============
  startRun({ weapon = 'blade', meta = {}, heat = 0 } = {}) {
    this.run = {
      chamber: 0, weapon, meta: { ...meta }, heat,
      hp: 100, maxHp: 100, shield: 0,
      obols: 40, darkEarned: 0, kills: 0, dmgDealt: 0, dmgTaken: 0,
      boons: [], hammers: [], hitCounter: 0,
      rage: 0, rageMax: 100, rageActive: 0,
      dashCharges: 1, dashRegen: 0, specialCd: 0, attackCd: 0, attackBuffer: 0,
      comboIdx: 0, comboTimer: 0, reviveUsed: false,
      wave: 0, wavesTotal: 0, waveCounts: [],
      gates: [], rerolls: 0, elapsed: 0, startTime: performance.now(),
      bossSeen: false, cleared: 0,
    };
    this.player = {
      x: ROOM_W / 2, y: ROOM_H / 2 + 80, vx: 0, vy: 0, radius: 15, face: -Math.PI / 2,
      walkPhase: 0, moving: false, invuln: 0, hurtFlash: 0, dashing: false,
      dashTime: 0, dashDir: { x: 0, y: -1 }, dashTrail: [], scarf: [], dashColor: '#7fe3d0',
      attackAnim: null, chargeFx: 0,
    };
    this.decals = [];
    this.slowmo = 0;
    this.victoryEmitted = false;
    this.boss = null;
    this.projectiles = [];
    this.zones = [];
    this.recompute();
    this.run.hp = this.run.maxHp;
    this.startChamber(1);
  }

  stopRun() {
    this.run = null;
    this.state = 'hub';
    this.enemies = []; this.projectiles = []; this.particles = []; this.slashes = [];
    this.bolts = []; this.zones = []; this.spawnQueue = []; this.boss = null;
    this.floor = null;
  }

  get weapon() { return WEAPONS[this.run?.weapon || 'blade']; }

  metaLevel(id) { return this.run?.meta?.[id] || 0; }
  hasBoon(id) { return this.run?.boons.find((b) => b.id === id); }
  boonValue(id, base) {
    const b = this.hasBoon(id);
    if (!b) return 0;
    return boonPower(base, b.level, b.rarity);
  }
  hammerStat(key) {
    const s = { dmgMult: 1, attackSpeed: 1, rangeMult: 1, specialMult: 1, specialCd: 1, specialRadius: 1, pierce: false, arrows: 1, spread: 0 };
    for (const id of this.run?.hammers || []) {
      const up = (HAMMERS[this.run.weapon] || []).find((h) => h.id === id);
      if (up) up.apply(s);
    }
    return s;
  }

  recompute() {
    const run = this.run;
    if (!run) return;
    const w = this.weapon;
    const meta = run.meta;
    const hs = this.hammerStat();
    const v = (id, base) => this.boonValue(id, base);
    const has = (id) => !!this.hasBoon(id);

    const oldMax = run.maxHp || 100;
    let maxHp = 100 + (meta.vitality || 0) * 22 + (meta.revive ? 0 : 0);
    if (has('aphrodite_love')) maxHp += v('aphrodite_love', 32);
    if (has('chaos_armor')) maxHp += v('chaos_armor', 26);
    if (has('aphrodite_passion')) maxHp += v('aphrodite_passion', 22);
    if (has('athena_aegis')) maxHp += 14;

    let dmgMult = 1 + (meta.might || 0) * 0.07;
    if (has('poseidon_wave')) dmgMult *= 1 + v('poseidon_wave', 20) / 100;
    if (has('chaos_gift')) dmgMult *= 1 + v('chaos_gift', 25) / 100;
    if (has('athena_strategy')) dmgMult *= 1 + v('athena_strategy', 14) / 100;
    if (has('aphrodite_passion')) dmgMult *= 1.06;
    if (has('ares_blood')) dmgMult *= 1.06;
    dmgMult *= hs.dmgMult;

    let moveMult = 1 + (meta.swift || 0) * 0.06;
    if (has('hermes_speed')) moveMult += v('hermes_speed', 12) / 100;
    if (has('athena_step')) moveMult += v('athena_step', 12) / 100;

    let dashCd = 1.15;
    if (has('athena_step')) dashCd *= 1 - clamp(v('athena_step', 12) * 0.8, 0, 60) / 100;
    if (has('hermes_speed')) dashCd *= 1 - clamp(v('hermes_speed', 12) * 1.3, 0, 60) / 100;
    if (has('hermes_shadow')) dashCd *= 0.92;
    if (has('hermes_wind')) dashCd *= 0.85;
    dashCd = clamp(dashCd, 0.42, 2);

    let attackSpeed = hs.attackSpeed;
    if (has('artemis_haste')) attackSpeed *= 1 + v('artemis_haste', 16) / 100;

    run.stats = {
      maxHp: Math.round(maxHp),
      dmgMult,
      moveSpeed: PLAYER_BASE_SPEED * moveMult,
      critChance: clamp(0.05 + (meta.crit || 0) * 0.05 + (has('artemis_crit') ? v('artemis_crit', 15) / 100 : 0) + (has('athena_strategy') ? v('athena_strategy', 14) * 0.004 : 0), 0, 0.85),
      critMult: 2.1,
      attackSpeed,
      rangeMult: hs.rangeMult,
      pierce: hs.pierce,
      specialMult: hs.specialMult * (1 + (has('chaos_mark') ? v('chaos_mark', 30) / 100 : 0)),
      specialCd: (w.attack.special.cd) * hs.specialCd,
      specialRadius: hs.specialRadius,
      dashMax: 1 + (meta.dash || 0) + (has('hermes_shadow') ? 1 : 0),
      dashCd,
      dashDist: 1 + (has('hermes_wind') ? v('hermes_wind', 20) / 100 : 0),
      shieldCharges: has('athena_aegis') ? Math.max(1, Math.round(v('athena_aegis', 1))) : 0,
      damageTaken: clamp(1 + (has('chaos_gift') ? 0.15 : 0) - (has('chaos_armor') ? 0.12 : 0), 0.6, 1.6),
      lifesteal: has('ares_blood') ? v('ares_blood', 1.4) : 0,
      arrows: hs.arrows,
      spread: hs.spread,
      // boon payloads
      lightningDmg: has('zeus_bolt') ? v('zeus_bolt', 26) : 0,
      lightningChance: 0.34,
      zeusStepDmg: has('zeus_step') ? v('zeus_step', 24) : 0,
      poseidonWave: has('poseidon_wave') > 0,
      poseidonSpecial: has('poseidon_special') ? v('poseidon_special', 42) : 0,
      poseidonTide: has('poseidon_tide') ? v('poseidon_tide', 30) : 0,
      zeusStorm: has('zeus_storm') ? v('zeus_storm', 42) : 0,
      artemisMark: has('artemis_mark') ? v('artemis_mark', 46) : 0,
      poisonDps: has('dionysus_poison') ? v('dionysus_poison', 8) : 0,
      poisonSlow: has('dionysus_daze') ? v('dionysus_daze', 22) : 0,
      doomDmg: has('ares_doom') ? v('ares_doom', 52) : 0,
      ruinDmg: has('ares_ruin') ? v('ares_ruin', 34) : 0,
      weakAmount: has('aphrodite_charm') ? v('aphrodite_charm', 32) / 100 : 0,
      healOnKill: has('dionysus_feast') ? v('dionysus_feast', 5) : 0,
      healOnKillChance: 0.38,
      critDmgBonus: has('artemis_crit') ? 0.6 : 0,
    };
    run.stats.critMult += run.stats.critDmgBonus;
    run.maxHp = run.stats.maxHp;
    if (run.hp > run.maxHp) run.hp = run.maxHp;
    if (run.hp < run.maxHp && run.maxHp > oldMax) run.hp += run.maxHp - oldMax;
    if (run.hp <= 0) run.hp = 1;
  }

  // ============ chambers ============
  startChamber(n) {
    const run = this.run;
    run.chamber = n;
    const biome = chamberBiome(n);
    this.biome = biome;
    this.floor = buildFloor(biome, 9001 + n * 733, ROOM_W, ROOM_H);
    this.buildRoom(n, biome);

    this.enemies = []; this.projectiles = []; this.particles = [];
    this.slashes = []; this.bolts = []; this.zones = []; this.spawnQueue = [];
    this.boss = null;
    this.decals = [];
    this.waveDelay = 0; this.clearDelay = 0;
    run.attackCd = 0; run.attackBuffer = 0; run.comboIdx = 0; run.comboTimer = 0;
    run.specialCd = 0; run.shield = run.stats.shieldCharges;
    run.dashCharges = run.stats.dashMax; run.dashRegen = 0;
    run.rageActive = 0;

    const p = this.player;
    p.x = ROOM_W / 2; p.y = ROOM_H / 2 + 110;
    p.vx = 0; p.vy = 0; p.invuln = 0.8; p.hurtFlash = 0; p.dashing = false;
    p.dashTime = 0; p.dashTrail = []; p.scarf = []; p.face = -Math.PI / 2;
    this.cam.x = p.x; this.cam.y = p.y;

    const bossRoom = n >= TOTAL_CHAMBERS;
    run.bossSeen = bossRoom;
    run.wave = 0;
    if (bossRoom) {
      run.wavesTotal = 1;
      run.waveCounts = [];
      this.emit('banner', { eyebrow: biome.chapter, title: 'ЦЕРБЕР', sub: 'СТРАЖ СТИКСА · ПОСЛЕДНИЙ РУБЕЖ', cls: 'blood' });
      this.audio.sfx('boss');
    } else {
      const total = Math.min(12, 3 + Math.floor(n * 0.95));
      const waves = n >= 7 ? 3 : 2;
      const counts = [];
      let left = total;
      for (let i = 0; i < waves; i++) {
        const c = i === waves - 1 ? left : Math.max(1, Math.round(total / waves * (0.82 + Math.random() * 0.3)));
        counts.push(c); left -= c;
      }
      if (left > 0) counts[counts.length - 1] += left;
      run.waveCounts = counts;
      run.wavesTotal = waves;
      this.emit('banner', { eyebrow: biome.chapter, title: biome.name, sub: `ЗАЛ ${roman(n)} · ${biome.sub}`, cls: '' });
    }
    this.state = 'intro';
    this.introT = bossRoom ? 2.4 : 1.55;
    this.emit('hud');
  }

  buildRoom(n, biome) {
    const R = mulberry32(4400 + n * 71);
    const bossRoom = n >= TOTAL_CHAMBERS;
    this.obstacles = [];
    this.braziers = [];
    const count = bossRoom ? 3 : 5 + ((R() * 3) | 0);
    let guard = 0;
    while (this.obstacles.length < count && guard++ < 80) {
      const x = MARGIN + 180 + R() * (ROOM_W - MARGIN * 2 - 360);
      const y = MARGIN + 170 + R() * (ROOM_H - MARGIN * 2 - 340);
      if (dist(x, y, ROOM_W / 2, ROOM_H / 2) < 260) continue;
      if (bossRoom && dist(x, y, ROOM_W / 2, ROOM_H / 2 - 260) < 260) continue;
      if (this.obstacles.some((o) => dist(x, y, o.x, o.y) < 220)) continue;
      const type = R() < 0.58 ? 'pillar' : 'rubble';
      const r = type === 'pillar' ? 33 : 25;
      this.obstacles.push({ x, y, r, type, seed: (R() * 1e6) | 0 });
    }
    const bxs = [MARGIN + 100, ROOM_W - MARGIN - 100];
    const bys = [MARGIN + 100, ROOM_H - MARGIN - 100];
    for (const x of bxs) for (const y of bys) this.braziers.push({ x, y });
    // extra wall braziers
    if (!bossRoom) {
      this.braziers.push({ x: ROOM_W / 2, y: MARGIN + 100 });
      this.braziers.push({ x: ROOM_W / 2, y: ROOM_H - MARGIN - 100 });
    }
  }

  addEnemy(typeId, x, y, opts = {}) {
    const base = ENEMY_TYPES[typeId];
    const n = this.run.chamber;
    const heat = this.run.heat || 0;
    const elite = !!opts.elite;
    const hpMul = (1 + (n - 1) * 0.15 + heat * 0.17) * (elite ? 2.1 : 1);
    const dmgMul = (1 + (n - 1) * 0.085 + heat * 0.1) * (elite ? 1.35 : 1);
    const e = {
      id: Math.random().toString(36).slice(2),
      type: typeId, kind: base.kind,
      x, y, vx: 0, vy: 0, knockVx: 0, knockVy: 0,
      radius: base.radius * (elite ? 1.24 : 1),
      hp: base.hp * hpMul, maxHp: base.hp * hpMul,
      speed: base.speed * (elite ? 1.06 : 1),
      dmg: base.dmg * dmgMul,
      elite, mass: base.mass * (elite ? 1.5 : 1),
      state: 'chase', stateT: 0, cooldown: rnd(1.2, 0.4), windup: 0,
      face: angleTo(x, y, this.player.x, this.player.y),
      walkPhase: rnd(TAU), hurtFlash: 0, showHp: 0, dead: false,
      poison: 0, poisonStacks: 0, poisonTick: 0, doom: 0, doomDmg: 0,
      weaken: 0, slow: 0, slowAmt: 0, orbitPhase: rnd(TAU),
      spawnT: 0.55, hitThisAttack: false, attackDir: 0, enraged: false,
      seed: Math.random() * 1000,
    };
    this.enemies.push(e);
    return e;
  }

  spawnWave() {
    const run = this.run;
    const n = run.chamber;
    const count = run.waveCounts[run.wave] || 3;
    const pool = ['skeleton', 'skeleton'];
    if (n >= 2) pool.push('shade', 'archer');
    if (n >= 3) pool.push('archer', 'shade');
    if (n >= 4) pool.push('brute');
    if (n >= 5) pool.push('witch');
    if (n >= 7) pool.push('brute', 'witch');
    const isLast = run.wave === run.wavesTotal - 1;
    const eliteAllowed = n >= 4;
    let eliteBudget = isLast && (n === 4 || n === 7) ? 1 : 0;
    for (let i = 0; i < count; i++) {
      const type = pick(pool);
      const elite = eliteAllowed && (eliteBudget > 0 || (isLast && Math.random() < 0.13));
      if (elite) eliteBudget--;
      const pos = this.findSpawnPoint(300, 620);
      const delay = 0.24 * i + Math.random() * 0.18;
      this.spawnQueue.push({
        delay, type, x: pos.x, y: pos.y, elite,
        marker: 0.62,
      });
    }
    this.emit('hud');
  }

  findSpawnPoint(minD = 300, maxD = 620) {
    const p = this.player;
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * TAU;
      const d = rnd(minD, maxD);
      const x = clamp(p.x + Math.cos(a) * d, MARGIN + 40, ROOM_W - MARGIN - 40);
      const y = clamp(p.y + Math.sin(a) * d, MARGIN + 40, ROOM_H - MARGIN - 40);
      if (this.obstacles.some((o) => dist(x, y, o.x, o.y) < o.r + 44)) continue;
      if (this.braziers.some((b) => dist(x, y, b.x, b.y) < 60)) continue;
      if (dist(x, y, p.x, p.y) < minD * 0.7) continue;
      return { x, y };
    }
    return { x: MARGIN + 200, y: MARGIN + 200 };
  }

  // ============ rewards ============
  makeGates(n) {
    const run = this.run;
    const ownedHammers = new Set(run.hammers);
    const hammerAvail = (HAMMERS[run.weapon] || []).some((h) => !ownedHammers.has(h.id));
    const pool = ['boon', 'boon', 'heal', 'treasure', 'dark'];
    if (hammerAvail) pool.push('hammer');
    // guarantee hammer around the middle of the run
    const forceHammer = hammerAvail && (n === 3 || n === 6) && !run.hammers.length;
    let types = [];
    if (forceHammer) types.push('hammer');
    types.push('boon');
    const rest = shuffle(pool.filter((t) => !types.includes(t) || (t === 'boon' && types.filter((x) => x === 'boon').length < 1)));
    while (types.length < 3) {
      const t = rest.find((x) => !types.includes(x)) || pick(pool);
      if (!types.includes(t)) types.push(t);
    }
    types = shuffle(types);
    const godIds = shuffle(Object.keys(GODS));
    const usedGods = new Set();
    run.gates = types.map((type, i) => {
      if (type === 'boon') {
        let godId = godIds.find((g) => !usedGods.has(g)) || godIds[0];
        usedGods.add(godId);
        const god = GODS[godId];
        return {
          type, godId, title: `ДАР ${god.name.toUpperCase()}`, color: god.color,
          icon: god.symbol, name: god.name, desc: god.line, tag: 'БЛАГОСЛОВЕНИЕ',
        };
      }
      if (type === 'heal') return { type, title: 'ИСТОЧНИК КРОВИ', color: '#e0736b', icon: 'heart', desc: `Восстанови <b>35%</b> здоровья и иди дальше.`, tag: 'ЛЕЧЕНИЕ' };
      if (type === 'treasure') return { type, title: 'СУНДУК ХАРОНА', color: '#e3bd7b', icon: 'coin', desc: `Получи <b>90 оболов</b> для обновления даров.`, tag: 'БОГАТСТВО' };
      if (type === 'dark') return { type, title: 'СГУСТОК ТЬМЫ', color: '#b48bea', icon: 'moon', desc: `Получи <b>28 Тьмы</b> для Зеркала ночи.`, tag: 'ТЬМА' };
      return { type: 'hammer', title: 'МОЛОТ ДЕДАЛА', color: '#9fd8e8', icon: 'hammer', desc: `Улучши <b>${this.weapon.name}</b> навсегда до конца спуска.`, tag: 'КУЗНЯ' };
    });
    return run.gates;
  }

  chooseGate(index) {
    const gate = this.run.gates[index];
    if (!gate) return;
    this.run.gates = [];
    this.audio.sfx('gate');
    if (gate.type === 'boon') {
      this.openBoon(gate.godId, false);
    } else if (gate.type === 'hammer') {
      this.openHammer();
    } else if (gate.type === 'heal') {
      const amount = Math.round(this.run.maxHp * 0.35);
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + amount);
      this.float(this.player.x, this.player.y - 54, `+${amount}`, 'heal');
      this.toast('Кровь возвращается в жилы');
      this.audio.sfx('heal');
      this.nextChamber();
    } else if (gate.type === 'treasure') {
      this.run.obols += 90;
      this.toast('+90 оболов');
      this.audio.sfx('pickup');
      this.nextChamber();
    } else if (gate.type === 'dark') {
      this.run.darkEarned += 28;
      this.toast('+28 Тьмы');
      this.audio.sfx('pickup');
      this.nextChamber();
    }
  }

  openBoon(godId, isReroll) {
    const run = this.run;
    let god = godId;
    let offers = this.rollBoonOffers(god);
    // if everything capped, switch to another god
    if (!offers.length) {
      const others = shuffle(Object.keys(GODS).filter((g) => g !== god));
      for (const g of others) {
        offers = this.rollBoonOffers(g);
        if (offers.length) { god = g; break; }
      }
    }
    this.pendingGod = god;
    this.pendingBoon = offers;
    if (!isReroll) run.rerolls = 0;
    const cost = 25 + run.rerolls * 15;
    this.emit('boon', {
      god: GODS[god], offers,
      rerollCost: cost, obols: run.obols,
      chamber: run.chamber,
    });
  }

  rollBoonOffers(godId) {
    const run = this.run;
    const defs = shuffle(BOONS.filter((b) => b.god === godId));
    const offers = [];
    for (const def of defs) {
      const owned = this.hasBoon(def.id);
      if (owned && owned.level >= MAX_BOON_LEVEL) continue;
      offers.push({
        def,
        rarity: this.rollRarity(),
        owned: owned || null,
      });
    }
    return offers.slice(0, 3);
  }

  rollRarity() {
    const n = this.run?.chamber || 1;
    const luck = Math.min(0.16, n * 0.015);
    const r = Math.random();
    if (r < 0.08 + luck) return 'epic';
    if (r < 0.38 + luck) return 'rare';
    return 'common';
  }

  rerollBoons() {
    const run = this.run;
    const cost = 25 + run.rerolls * 15;
    if (run.obols < cost) { this.audio.sfx('hit'); return; }
    run.obols -= cost;
    run.rerolls++;
    this.openBoon(this.pendingGod, true);
    this.audio.sfx('pickup');
  }

  takeBoon(index) {
    const offer = this.pendingBoon?.[index];
    if (!offer) return;
    const run = this.run;
    const existing = this.hasBoon(offer.def.id);
    if (existing) {
      existing.level = Math.min(MAX_BOON_LEVEL, existing.level + 1);
      existing.rarity = RARITY_ORDER_MAX(existing.rarity, offer.rarity);
    } else {
      run.boons.push({ id: offer.def.id, level: 1, rarity: offer.rarity });
    }
    this.recompute();
    const god = GODS[offer.def.god];
    this.toast(`${god.name}: ${offer.def.name}${existing ? ' · ур. ' + existing.level : ''}`);
    this.audio.sfx('boon');
    this.pendingBoon = null;
    this.emit('hud');
    this.nextChamber();
  }

  openHammer() {
    const run = this.run;
    const owned = new Set(run.hammers);
    const pool = (HAMMERS[run.weapon] || []).filter((h) => !owned.has(h.id));
    if (!pool.length) {
      this.run.obols += 60;
      this.toast('Кузня пуста · +60 оболов');
      this.nextChamber();
      return;
    }
    const offers = shuffle(pool).slice(0, 2);
    this.pendingHammer = offers;
    this.emit('hammer', { offers, weapon: this.weapon });
  }

  takeHammer(index) {
    const up = this.pendingHammer?.[index];
    if (!up) return;
    this.run.hammers.push(up.id);
    this.recompute();
    this.toast(`${this.weapon.name}: ${up.name}`);
    this.audio.sfx('boon');
    this.pendingHammer = null;
    this.emit('hud');
    this.nextChamber();
  }

  skipReward() {
    this.run.hp = Math.min(this.run.maxHp, this.run.hp + Math.round(this.run.maxHp * 0.08));
    this.pendingBoon = null;
    this.pendingHammer = null;
    this.nextChamber();
  }

  nextChamber() {
    const run = this.run;
    run.darkEarned += 3;
    run.cleared++;
    this.emit('hud');
    if (run.chamber >= TOTAL_CHAMBERS) {
      this.finishVictory();
      return;
    }
    this.startChamber(run.chamber + 1);
  }

  onRoomCleared() {
    if (this.state !== 'fight') return;
    this.state = 'cleared';
    this.run.hp = Math.min(this.run.maxHp, this.run.hp + 0);
    const gates = this.makeGates(this.run.chamber);
    this.audio.sfx('gate');
    this.emit('clear', { gates, chamber: this.run.chamber });
  }

  finishVictory() {
    if (this.state === 'victory') return;
    const run = this.run;
    this.state = 'victory';
    this.slowmo = 2.2;
    this.victoryT = 2.4;
    this.audio.sfx('victory');
    if (this.boss) {
      this.boss.dead = true;
    }
    // sweep remaining enemies
    for (const e of this.enemies) this.killEnemy(e, true);
    this.enemies = [];
    this.emit('banner', { eyebrow: 'ПОДЗЕМНЫЙ МИР', title: 'ТЫ СВОБОДЕН', sub: 'ЦЕРБЕР ПОВЕРЖЕН', cls: 'gold' });
  }

  emitVictory() {
    const run = this.run;
    const greed = 1 + (run.meta.greed || 0) * 0.3;
    const darkGain = Math.round((run.darkEarned + 60) * greed);
    const summary = this.summary(true, darkGain);
    this.emit('victory', summary);
  }

  summary(victory, darkGain) {
    const run = this.run;
    return {
      victory,
      chamber: run.chamber,
      chamberName: this.biome?.name || '',
      kills: run.kills,
      time: run.elapsed,
      obols: run.obols,
      darkGain: darkGain ?? Math.round(run.darkEarned * (1 + (run.meta.greed || 0) * 0.3)),
      boons: run.boons.map((b) => ({ ...BOON_BY_ID.get(b.id), ...b })),
      hammers: run.hammers.map((id) => (HAMMERS[run.weapon] || []).find((h) => h.id === id)).filter(Boolean),
      weapon: this.weapon,
      heat: run.heat,
    };
  }

  die() {
    if (this.state === 'dying' || this.state === 'victory' || this.state === 'dead') return;
    const run = this.run;
    if ((run.meta.revive || 0) > 0 && !run.reviveUsed) {
      run.reviveUsed = true;
      run.hp = Math.round(run.maxHp * 0.45);
      this.player.invuln = 2.4;
      this.audio.sfx('rage');
      this.shake(14);
      this.burst(this.player.x, this.player.y - 30, '#ffd28a', 46, 320, 'spark');
      this.ring(this.player.x, this.player.y - 20, 180, '#ffd28a');
      this.particles.push({ x: this.player.x, y: this.player.y, vx: 0, vy: 0, life: 1.4, t: 0, kind: 'ring', color: '#ffd28a', size: 10, grow: 190, w: 4 });
      this.emit('banner', { eyebrow: 'ВОЛЯ К ЖИЗНИ', title: 'ТЫ ВОЗРОЖДЁН', sub: 'УПОРСТВО ЗЕРКАЛА', cls: 'gold' });
      this.float(this.player.x, this.player.y - 60, 'ВОЗРОЖДЕНИЕ', 'heal');
      this.emit('hud');
      return;
    }
    this.state = 'dying';
    this.deathT = 1.7;
    this.slowmo = 1.9;
    this.audio.sfx('death');
    this.burst(this.player.x, this.player.y - 30, '#9e3a3a', 40, 220, 'blood');
    this.burst(this.player.x, this.player.y - 30, '#ff9a6a', 22, 180, 'spark');
    this.emit('hud');
  }

  finishDeath() {
    this.state = 'dead';
    const dark = Math.round(this.run.darkEarned * (1 + (this.run.meta.greed || 0) * 0.3));
    const summary = this.summary(false, dark);
    this.emit('death', summary);
  }

  // ============ callbacks ============
  emit(type, data) { const fn = this.events[type]; if (fn) fn(data); }
  toast(text) { this.emit('toast', text); }
  float(x, y, text, cls) { this.emit('float', { x, y, text, cls }); }

  press(action) {
    if (this.state !== 'fight') return;
    this.pendingActions.add(action);
  }
  setTouchMove(x, y) {
    const n = norm(x, y, );
    this.touchMove.x = n.x; this.touchMove.y = n.y;
    if (Math.hypot(x, y) < 0.12) { this.touchMove.x = 0; this.touchMove.y = 0; }
  }

  getHud() {
    const run = this.run;
    if (!run) return null;
    const stats = run.stats;
    return {
      biome: this.biome?.name || '', chapter: this.biome?.chapter || '', chamber: run.chamber,
      hp: Math.max(0, Math.round(run.hp)), maxHp: run.maxHp, shield: run.shield,
      obols: run.obols, dark: run.darkEarned,
      boons: run.boons.map((b) => ({ ...BOON_BY_ID.get(b.id), level: b.level, rarity: b.rarity })),
      rage: run.rage, rageMax: run.rageMax,
      dashCharges: run.dashCharges, dashMax: stats.dashMax,
      dashFrac: clamp(1 - run.dashRegen / stats.dashCd, 0, 1),
      specialFrac: clamp(1 - run.specialCd / stats.specialCd, 0, 1),
      boss: this.boss && !this.boss.dead ? { hp: Math.max(0, this.boss.hp), max: this.boss.maxHp, name: 'ЦЕРБЕР', tag: 'СТРАЖ СТИКСА' } : null,
      weapon: run.weapon,
      heat: run.heat,
    };
  }
}

const RARITY_INDEX = { common: 0, rare: 1, epic: 2 };
function RARITY_ORDER_MAX(a, b) { return RARITY_INDEX[a] >= RARITY_INDEX[b] ? a : b; }

Object.assign(Game.prototype, simMethods, aiMethods, renderMethods);
