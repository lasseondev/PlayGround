// Entry point: wires the simulation to the DOM interface.
import { Game } from './game.js';
import { Input, AudioKit, clamp, roman } from './core.js';
import {
  WEAPONS, GODS, RARITY, META_UPGRADES, HAMMERS,
  MAX_BOON_LEVEL, TOTAL_CHAMBERS, boonPower, icon,
} from './data.js';
import { loadSave, writeSave } from './save.js';
import { drawMenu } from './art.js';

const $ = (id) => document.getElementById(id);
const UI = {
  canvas: $('view'),
  hud: $('hud'),
  hub: $('hub'),
  overlay: $('overlay'),
  banner: $('banner'),
  hint: $('hint'),
  toastWrap: $('toast-wrap'),
  dmgLayer: $('dmg-layer'),
  touch: $('touch'),
  start: $('btn-start'),
  startWeapon: $('start-weapon'),
  weapons: $('btn-weapons'),
  mirror: $('btn-mirror'),
  mirrorMobile: $('btn-mirror-mobile'),
  mirrorList: $('mirror-list'),
  darkness: $('darkness-count'),
  mirrorNote: $('mirror-foot-note'),
  hubStats: $('hub-stats'),
  mute: $('btn-mute'),
  pause: $('btn-pause'),
  hpText: $('hud-hp-text'),
  hpFill: $('hud-hp-fill'),
  hpShield: $('hud-hp-shield'),
  boons: $('hud-boons'),
  obols: $('hud-obols'),
  dark: $('hud-dark'),
  biome: $('hud-biome'),
  chamber: $('hud-chamber'),
  bossBar: $('boss-bar'),
  bossFill: $('boss-fill'),
  bossName: $('boss-name'),
  bossTag: $('boss-tag'),
  rageFill: $('rage-fill'),
  cdDash: $('cd-dash'),
  cdSpecial: $('cd-special'),
  cdRage: $('cd-rage'),
  chargesDash: $('charges-dash'),
  dashAbility: document.querySelector('[data-ability="dash"]'),
  specialAbility: document.querySelector('[data-ability="special"]'),
  rageAbility: document.querySelector('[data-ability="rage"]'),
};

const input = new Input();
const audio = new AudioKit();
const save = loadSave();

let game = null;
let overlayKind = null;
let lastBoonSig = '';
let lastHudAt = 0;
let hintTimer = 0;
let stickPointer = null;
let stickOrigin = { x: 0, y: 0 };
let stickRect = null;

// ============================================================
// Small helpers
// ============================================================
const fmtTime = (seconds) => {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const weaponOf = (id) => WEAPONS[id] || WEAPONS.blade;
const isTouchDevice = () => input.usingTouch
  || (window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches))
  || window.innerWidth <= 820;

function pips(level, max = MAX_BOON_LEVEL) {
  let html = '<span class="level-pips">';
  for (let i = 1; i <= max; i++) html += `<i class="${i <= level ? 'on' : ''}"></i>`;
  return html + '</span>';
}

function statBars(value, max = 5) {
  let html = '<span class="bars">';
  for (let i = 1; i <= max; i++) html += `<i class="${i <= value ? 'on' : ''}"></i>`;
  return html + '</span>';
}

// ============================================================
// Toasts, floats and banners
// ============================================================
function showToast(text) {
  if (!text) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  UI.toastWrap.appendChild(el);
  while (UI.toastWrap.children.length > 3) UI.toastWrap.firstElementChild.remove();
  setTimeout(() => el.remove(), 2800);
}

function showBanner(data = {}) {
  UI.banner.className = `banner ${data.cls || ''}`;
  UI.banner.innerHTML = `
    <div class="b-eyebrow">${esc(data.eyebrow || '')}</div>
    <div class="b-title">${esc(data.title || '')}</div>
    <div class="b-sub">${esc(data.sub || '')}</div>`;
  // Restart the CSS animation even when two banners fire quickly.
  void UI.banner.offsetWidth;
  UI.banner.classList.add('show');
}

function showFloat(data) {
  if (!data || !game || !game.run) return;
  const x = game.w / 2 + (data.x - game.cam.x) * game.scale;
  const y = game.h / 2 + (data.y - game.cam.y) * game.scale;
  const el = document.createElement('div');
  el.className = `dmg ${data.cls || ''}`;
  el.textContent = data.text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  UI.dmgLayer.appendChild(el);
  setTimeout(() => el.remove(), 900);
  while (UI.dmgLayer.children.length > 40) UI.dmgLayer.firstElementChild.remove();
}

// ============================================================
// Overlay plumbing
// ============================================================
function setOverlay(html, kind) {
  overlayKind = kind;
  UI.overlay.innerHTML = html;
  UI.overlay.classList.remove('hidden');
}

function closeOverlay() {
  if (overlayKind === 'pause') game.paused = false;
  overlayKind = null;
  UI.overlay.classList.add('hidden');
  UI.overlay.innerHTML = '';
}

function sheetHead(eyebrow, title, sub = '') {
  return `
    <div class="sheet-head">
      <div class="sheet-eyebrow">${esc(eyebrow)}</div>
      <h2 class="sheet-title">${esc(title)}</h2>
      ${sub ? `<p class="sheet-sub">${sub}</p>` : ''}
    </div>`;
}

// ============================================================
// HUD
// ============================================================
function updateHud(force = false) {
  if (!game || !game.run) return;
  const h = game.getHud();
  if (!h) return;

  UI.biome.textContent = h.biome;
  UI.chamber.textContent = `ЗАЛ ${roman(h.chamber)}`;

  const hpFrac = h.maxHp > 0 ? clamp(h.hp / h.maxHp, 0, 1) : 0;
  UI.hpText.textContent = `${h.hp} / ${h.maxHp}`;
  UI.hpFill.style.width = `${hpFrac * 100}%`;
  UI.hpFill.classList.toggle('low', hpFrac < 0.3);
  UI.hpShield.classList.toggle('hidden', !h.shield);
  UI.obols.textContent = String(h.obols);
  UI.dark.textContent = String(h.dark);

  const sig = h.boons.map((b) => `${b.id}:${b.level}:${b.rarity}`).join('|');
  if (force || sig !== lastBoonSig) {
    lastBoonSig = sig;
    UI.boons.innerHTML = h.boons.map((b) => {
      const god = GODS[b.god] || GODS.zeus;
      return `<span class="boon-chip" style="--c:${god.color}" title="${esc(b.name)} — ${esc(god.name)}">
        ${icon(b.icon)}<span class="lvl">${b.level}</span>
      </span>`;
    }).join('');
  }

  const dashCooling = h.dashCharges <= 0;
  UI.dashAbility.classList.toggle('cooling', dashCooling);
  UI.dashAbility.classList.toggle('ready', !dashCooling);
  UI.chargesDash.textContent = h.dashMax > 1 ? String(h.dashCharges) : '';

  const specialCooling = h.specialFrac < 0.995;
  UI.specialAbility.classList.toggle('cooling', specialCooling);
  UI.specialAbility.classList.toggle('ready', !specialCooling);

  const rageReady = h.rage >= h.rageMax;
  UI.rageAbility.classList.toggle('ready', rageReady);
  UI.rageFill.style.height = `${clamp((h.rage / h.rageMax) * 100, 0, 100)}%`;

  if (h.boss) {
    UI.bossBar.classList.remove('hidden');
    UI.bossName.textContent = h.boss.name;
    UI.bossTag.textContent = h.boss.tag;
    UI.bossFill.style.width = `${clamp((h.boss.hp / h.boss.max) * 100, 0, 100)}%`;
  } else {
    UI.bossBar.classList.add('hidden');
  }

  lastHudAt = performance.now();
}

// ============================================================
// Hub / mirror / arsenal
// ============================================================
function mirrorRow(upgrade, compact = false) {
  const level = save.meta[upgrade.id] || 0;
  const maxed = level >= upgrade.max;
  const cost = maxed ? 0 : upgrade.cost(level);
  const affordable = save.darkness >= cost;
  let pipsHtml = '<span class="pips">';
  for (let i = 0; i < upgrade.max; i++) pipsHtml += `<span class="pip ${i < level ? 'on' : ''}"></span>`;
  pipsHtml += '</span>';

  const buy = maxed
    ? '<button class="up-buy maxed" disabled>МАКС</button>'
    : `<button class="up-buy" data-buy="${upgrade.id}" ${affordable ? '' : 'disabled'} title="Стоимость: ${cost} Тьмы">
         <span class="mini-gem"></span>${cost}
       </button>`;

  return `
    <div class="up-row" data-upgrade="${upgrade.id}">
      <div class="up-icon">${icon(upgrade.icon)}</div>
      <div class="up-body">
        <div class="up-name">${esc(upgrade.name)}${pipsHtml}</div>
        <div class="up-desc">${esc(upgrade.desc)}${compact ? '' : ''}</div>
      </div>
      ${buy}
    </div>`;
}

function updateHub() {
  UI.darkness.textContent = String(save.darkness);
  UI.startWeapon.textContent = weaponOf(save.weapon).name.toUpperCase();
  UI.mirrorNote.textContent = save.meta.revive
    ? 'Тьма остаётся после смерти. Упорство уже выковано.'
    : 'Тьма остаётся после смерти.';

  const best = save.bestChamber ? `ЗАЛ ${roman(save.bestChamber)}` : '—';
  UI.hubStats.innerHTML = `
    <span>Спусков <b>${save.runs}</b></span>
    <span>Побед <b>${save.wins}</b></span>
    <span>Рекорд <b>${best}</b></span>
    <span>Убийств <b>${save.totalKills}</b></span>
    ${save.heat ? `<span>Жар <b>${save.heat}</b></span>` : ''}`;

  UI.mirrorList.innerHTML = META_UPGRADES.map((u) => mirrorRow(u)).join('');
}

function buyMeta(id) {
  const upgrade = META_UPGRADES.find((u) => u.id === id);
  if (!upgrade) return;
  const level = save.meta[id] || 0;
  if (level >= upgrade.max) return;
  const cost = upgrade.cost(level);
  if (save.darkness < cost) return;
  audio.init();
  audio.sfx('pickup');
  save.darkness -= cost;
  save.meta[id] = level + 1;
  writeSave(save);
  updateHub();
  if (overlayKind === 'mirror') openMirrorSheet(true);
  showToast(`${upgrade.name} · уровень ${level + 1}`);
}

function openMirrorSheet(keepOpen = false) {
  const html = `
    <div class="sheet">
      ${sheetHead('ДОМ АИДА', 'ЗЕРКАЛО НОЧИ', 'Тьма, собранная в спусках, навсегда усиливает тебя. Смерть её не отнимает.')}
      <div class="mirror-balance" style="max-width:640px;margin:0 auto 18px">
        <span class="dark-gem"></span>
        <span class="balance-num">${save.darkness}</span>
        <span class="balance-label">ТЬМА</span>
        <button class="btn tiny ghost" data-action="close" style="margin-left:auto">ЗАКРЫТЬ</button>
      </div>
      <div class="mirror-list" style="max-height:min(54vh,480px);max-width:720px;margin:0 auto">
        ${META_UPGRADES.map((u) => mirrorRow(u)).join('')}
      </div>
      <div class="panel-foot" style="max-width:720px;margin:16px auto 0">Улучшения зеркала действуют во всех будущих спусках.</div>
    </div>`;
  setOverlay(html, 'mirror');
}

function weaponCard(id, weapon) {
  const selected = save.weapon === id;
  return `
    <button class="card weapon ${selected ? 'selected' : ''}" data-weapon="${id}" style="--c:${weapon.color}">
      <span class="check">ВЫБРАНО</span>
      <div class="card-emblems">
        <div class="emblem-ring">${icon(weapon.icon)}</div>
        <div class="god-name">${esc(weapon.tag)}</div>
      </div>
      <h3>${esc(weapon.name)}</h3>
      <p class="card-desc">${esc(weapon.desc)}</p>
      <div class="weapon-stats">
        <div class="stat-line"><span>Урон</span>${statBars(weapon.stats.dmg)}</div>
        <div class="stat-line"><span>Скорость</span>${statBars(weapon.stats.speed)}</div>
        <div class="stat-line"><span>Дальность</span>${statBars(weapon.stats.range)}</div>
      </div>
      <div class="card-footer">
        <span class="upgrade-tag">${weapon.attack.type === 'ranged' ? 'ДАЛЬНИЙ БОЙ' : weapon.attack.type === 'thrust' ? 'ПРОНЗАЮЩИЙ' : 'БЛИЖНИЙ БОЙ'}</span>
      </div>
    </button>`;
}

function openWeaponsSheet() {
  const heat = save.heat || 0;
  const html = `
    <div class="sheet">
      ${sheetHead('АРСЕНАЛ АИДА', 'ВЫБЕРИ ОРУЖИЕ', 'Каждое оружие меняет ритм боя. Молоты Дедала усиливают выбранное оружие до конца спуска.')}
      <div class="cards">${Object.entries(WEAPONS).map(([id, w]) => weaponCard(id, w)).join('')}</div>
      <div class="reroll-row">
        <span style="font-size:9px;letter-spacing:.22em;color:#8c7f70;text-transform:uppercase">Жар подземья</span>
        <button class="reroll-btn" data-heat="-1" ${heat <= 0 ? 'disabled' : ''}>−</button>
        <b style="font-family:var(--serif);font-size:22px;color:#ffb08a;min-width:24px;text-align:center">${heat}</b>
        <button class="reroll-btn" data-heat="1" ${heat >= 20 ? 'disabled' : ''}>+</button>
        <span class="reroll-note">Враги крепче и злее. Для тех, кому мало.</span>
      </div>
      <div class="sheet-actions">
        <button class="btn ghost" data-action="close">НАЗАД</button>
        <button class="btn primary" data-action="start"><span class="btn-main">НАЧАТЬ СПУСК</span><span class="btn-sub">${esc(weaponOf(save.weapon).name.toUpperCase())}</span></button>
      </div>
    </div>`;
  setOverlay(html, 'weapons');
}

// ============================================================
// Run flow
// ============================================================
function beginRun() {
  audio.init();
  closeOverlay();
  game.paused = false;
  game.touchAttack = false;
  game.setTouchMove(0, 0);
  lastBoonSig = '';
  UI.hub.classList.add('hidden');
  UI.hud.classList.remove('hidden');
  UI.touch.classList.toggle('hidden', !isTouchDevice());
  UI.bossBar.classList.add('hidden');
  game.startRun({ weapon: save.weapon, meta: save.meta, heat: save.heat || 0 });
  updateHud(true);

  UI.hint.textContent = isTouchDevice()
    ? 'Джойстик — движение · кнопки справа — бой'
    : 'ЛКМ — удар · ПРОБЕЛ — рывок · E — спецудар · Q — ярость';
  UI.hint.classList.add('show');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => UI.hint.classList.remove('show'), 5200);
}

function returnHome(message = '') {
  game.paused = false;
  game.stopRun();
  closeOverlay();
  UI.hud.classList.add('hidden');
  UI.touch.classList.add('hidden');
  UI.hub.classList.remove('hidden');
  UI.banner.classList.remove('show');
  updateHub();
  if (message) showToast(message);
}

function recordRun(summary, victory) {
  const dark = Math.max(0, Math.round(summary.darkGain || 0));
  save.darkness += dark;
  save.runs = (save.runs || 0) + 1;
  save.totalKills = (save.totalKills || 0) + (summary.kills || 0);
  save.bestChamber = Math.max(save.bestChamber || 0, summary.chamber || 0);
  if (victory) {
    save.wins = (save.wins || 0) + 1;
    const t = Math.round(summary.time || 0);
    if (!save.bestTime || t < save.bestTime) save.bestTime = t;
  }
  writeSave(save);
  updateHub();
  return dark;
}

function buildChips(summary) {
  const boons = (summary.boons || []).map((b) => {
    const god = GODS[b.god] || GODS.zeus;
    return `<span class="boon-chip" style="--c:${god.color}" title="${esc(b.name)}">${icon(b.icon)}<span class="lvl">${b.level}</span></span>`;
  }).join('');
  const hammers = (summary.hammers || []).map((h) => (
    `<span class="boon-chip" style="--c:#9fd8e8" title="${esc(h.name)}">${icon(h.icon)}</span>`
  )).join('');
  return boons + hammers;
}

function resultsSheet(summary, victory) {
  const dark = recordRun(summary, victory);
  const built = buildChips(summary);
  const title = victory ? 'ТЫ СВОБОДЕН' : 'ТЕНЬ УГАСЛА';
  const sub = victory
    ? 'Цербер повержен. Врата подземного мира впервые распахнулись перед тобой. Но Тьма ещё зовёт.'
    : 'Смерть — не конец. Тьма осталась с тобой, а Зеркало ночи готово сделать следующий спуск иным.';
  const html = `
    <div class="results">
      <div class="sheet-eyebrow">${victory ? 'ПОБЕГ СОВЕРШЁН' : 'СПУСК ЗАВЕРШЁН'}</div>
      <h2 class="results-title ${victory ? 'win' : 'death'}">${title}</h2>
      <p class="results-sub">${sub}</p>
      <div class="result-stats">
        <div class="result-stat"><div class="rs-val">${victory ? TOTAL_CHAMBERS : summary.chamber}<span style="font-size:14px;color:#8f8172">/${TOTAL_CHAMBERS}</span></div><div class="rs-key">ЗАЛОВ</div></div>
        <div class="result-stat"><div class="rs-val">${summary.kills}</div><div class="rs-key">УБИЙСТВ</div></div>
        <div class="result-stat"><div class="rs-val">${fmtTime(summary.time)}</div><div class="rs-key">ВРЕМЯ</div></div>
      </div>
      <div class="result-dark"><span class="dark-gem"></span>ТЬМА <b>+${dark}</b></div>
      ${built ? `<div class="run-build">${built}</div>` : ''}
      <div class="sheet-actions">
        <button class="btn ghost" data-action="home">ВЕРНУТЬСЯ В ДОМ</button>
        <button class="btn primary" data-action="retry"><span class="btn-main">СНОВА В БОЙ</span><span class="btn-sub">${esc(weaponOf(save.weapon).name.toUpperCase())}</span></button>
      </div>
    </div>`;
  setOverlay(html, victory ? 'victory' : 'death');
}

// ============================================================
// Reward overlays
// ============================================================
function showGates(data) {
  const cards = (data.gates || []).map((gate, i) => `
    <button class="card gate" data-gate="${i}" style="--c:${gate.color}">
      <div class="card-emblems"><div class="emblem-ring">${icon(gate.icon)}</div></div>
      <div class="god-name">${esc(gate.tag)}</div>
      <h3>${esc(gate.title)}</h3>
      <p class="card-desc">${gate.desc}</p>
      <div class="card-footer"><span class="gate-meta">ВРАТА ${roman(i + 1)}</span><span class="key-hint">${i + 1}</span></div>
    </button>`).join('');
  const html = `
    <div class="sheet">
      ${sheetHead(`ЗАЛ ${roman(data.chamber)} ОЧИЩЕН`, 'ВЫБЕРИ ПУТЬ', 'За каждой дверью — сила, кровь или тьма. Выбор нельзя отменить.')}
      <div class="cards">${cards}</div>
    </div>`;
  setOverlay(html, 'gates');
  updateHud(true);
}

function showBoons(data) {
  const god = data.god;
  const cards = (data.offers || []).map((offer, i) => {
    const def = offer.def;
    const current = offer.owned ? offer.owned.level + 1 : 1;
    const value = boonPower(def.base, current, offer.rarity);
    const rarity = RARITY[offer.rarity] || RARITY.common;
    return `
      <button class="card" data-boon="${i}" style="--c:${god.color}">
        <div class="card-emblems">
          <div class="emblem-ring">${icon(def.icon)}</div>
          <div class="god-name">${esc(god.name.toUpperCase())} · ${esc(god.title)}</div>
          <div class="rarity ${offer.rarity}">${esc(rarity.name)}</div>
        </div>
        <h3>${esc(def.name)}</h3>
        <p class="card-desc">${def.desc(value)}</p>
        <div class="card-footer">
          <span class="upgrade-tag">${offer.owned ? 'УЛУЧШЕНИЕ' : 'НОВЫЙ ДАР'}</span>
          ${pips(current)}
          <span class="key-hint">${i + 1}</span>
        </div>
      </button>`;
  }).join('');
  const canReroll = data.obols >= data.rerollCost;
  const html = `
    <div class="sheet">
      ${sheetHead(`ДАР ${god.name.toUpperCase()}`, god.name.toUpperCase(), god.line)}
      <div class="cards">${cards}</div>
      <div class="reroll-row">
        <button class="reroll-btn" data-reroll ${canReroll ? '' : 'disabled'}>
          <span class="mini-gem"></span>ПЕРЕКАТЬ ДАРЫ · ${data.rerollCost}
        </button>
        <span class="reroll-note">Оболов: ${data.obols}</span>
        <button class="reroll-btn" data-skip>ОТКАЗАТЬСЯ · +8% ЖИЗНИ</button>
      </div>
    </div>`;
  setOverlay(html, 'boon');
}

function showHammers(data) {
  const cards = (data.offers || []).map((upgrade, i) => `
    <button class="card" data-hammer="${i}" style="--c:#9fd8e8">
      <div class="card-emblems">
        <div class="emblem-ring">${icon(upgrade.icon)}</div>
        <div class="god-name">МОЛОТ ДЕДАЛА</div>
        <div class="rarity rare">КУЗНЯ</div>
      </div>
      <h3>${esc(upgrade.name)}</h3>
      <p class="card-desc">${upgrade.desc}</p>
      <div class="card-footer">
        <span class="upgrade-tag">${esc(data.weapon.name)}</span>
        <span class="key-hint">${i + 1}</span>
      </div>
    </button>`).join('');
  const html = `
    <div class="sheet">
      ${sheetHead('МОЛОТ ДЕДАЛА', 'КУЗНЯ ГЕФЕСТА', 'Одно улучшение оружия. Действует до конца спуска.')}
      <div class="cards">${cards}</div>
      <div class="reroll-row">
        <button class="reroll-btn" data-skip>ОТКАЗАТЬСЯ · +8% ЖИЗНИ</button>
      </div>
    </div>`;
  setOverlay(html, 'hammer');
}

// ============================================================
// Pause
// ============================================================
function openPause() {
  if (!game || !game.run || !['intro', 'fight', 'cleared'].includes(game.state)) return;
  game.paused = true;
  const html = `
    <div class="sheet">
      ${sheetHead('ПОДЗЕМНЫЙ МИР ЖДЁТ', 'ПАУЗА')}
      <div class="pause-grid">
        <button class="btn primary" data-action="resume"><span class="btn-main">ПРОДОЛЖИТЬ</span></button>
        <button class="btn ghost" data-action="abandon">ПОКИНУТЬ СПУСК</button>
      </div>
      <div class="legend-grid">
        <div><b>WASD</b> движение</div>
        <div><b>ЛКМ</b> удар</div>
        <div><b>ПРОБЕЛ</b> рывок</div>
        <div><b>E</b> спецудар</div>
        <div><b>Q</b> ярость</div>
        <div><b>ESC</b> пауза</div>
      </div>
    </div>`;
  setOverlay(html, 'pause');
}

function resumePause() {
  closeOverlay();
}

function abandonRun() {
  if (!game || !game.run) return;
  const greed = 1 + ((game.run.meta && game.run.meta.greed) || 0) * 0.3;
  const dark = Math.round((game.run.darkEarned || 0) * greed);
  save.darkness += dark;
  save.runs = (save.runs || 0) + 1;
  save.totalKills = (save.totalKills || 0) + (game.run.kills || 0);
  save.bestChamber = Math.max(save.bestChamber || 0, game.run.chamber || 0);
  writeSave(save);
  returnHome(`Спуск прерван · +${dark} Тьмы`);
}

// ============================================================
// Game events
// ============================================================
const events = {
  hud: () => updateHud(true),
  banner: showBanner,
  toast: showToast,
  float: showFloat,
  clear: showGates,
  boon: showBoons,
  hammer: showHammers,
  death: (summary) => resultsSheet(summary, false),
  victory: (summary) => resultsSheet(summary, true),
};

game = new Game({ canvas: UI.canvas, input, audio, events });
// Small debug handle for local test automation; inert during normal play.
if (new URLSearchParams(location.search).has('debug')) window.__game = game;

// ============================================================
// Overlay interactions (event delegation)
// ============================================================
UI.overlay.addEventListener('click', (e) => {
  const target = e.target.closest('button, [data-action]');
  if (!target || !UI.overlay.contains(target)) return;

  const buy = target.closest('[data-buy]');
  if (buy) { buyMeta(buy.dataset.buy); return; }

  const gate = target.closest('[data-gate]');
  if (gate) {
    const index = Number(gate.dataset.gate);
    closeOverlay();
    game.chooseGate(index);
    return;
  }

  const boon = target.closest('[data-boon]');
  if (boon) {
    const index = Number(boon.dataset.boon);
    closeOverlay();
    game.takeBoon(index);
    return;
  }

  const hammer = target.closest('[data-hammer]');
  if (hammer) {
    const index = Number(hammer.dataset.hammer);
    closeOverlay();
    game.takeHammer(index);
    return;
  }

  if (target.closest('[data-reroll]')) {
    game.rerollBoons();
    return;
  }

  if (target.closest('[data-skip]')) {
    closeOverlay();
    game.skipReward();
    return;
  }

  const weapon = target.closest('[data-weapon]');
  if (weapon) {
    audio.init();
    audio.sfx('pickup');
    save.weapon = weapon.dataset.weapon;
    writeSave(save);
    updateHub();
    openWeaponsSheet();
    return;
  }

  const heat = target.closest('[data-heat]');
  if (heat) {
    save.heat = clamp((save.heat || 0) + Number(heat.dataset.heat), 0, 20);
    writeSave(save);
    updateHub();
    openWeaponsSheet();
    return;
  }

  const action = target.dataset.action;
  if (!action) return;
  if (action === 'close') {
    closeOverlay();
  } else if (action === 'start') {
    beginRun();
  } else if (action === 'resume') {
    resumePause();
  } else if (action === 'abandon') {
    abandonRun();
  } else if (action === 'home') {
    returnHome('Тьма сохранена в Зеркале');
  } else if (action === 'retry') {
    beginRun();
  }
});

// ============================================================
// Buttons and keyboard
// ============================================================
UI.start.addEventListener('click', () => beginRun());
UI.weapons.addEventListener('click', () => { audio.init(); openWeaponsSheet(); });
UI.mirror.addEventListener('click', () => { audio.init(); openMirrorSheet(); });
UI.mirrorMobile.addEventListener('click', () => { audio.init(); openMirrorSheet(); });

UI.mute.addEventListener('click', () => {
  audio.init();
  const enabled = audio.toggle();
  UI.mute.classList.toggle('muted', !enabled);
  showToast(enabled ? 'Звук включён' : 'Звук выключен');
});
UI.mute.classList.toggle('muted', !audio.enabled);

UI.pause.addEventListener('click', () => {
  if (overlayKind === 'pause') resumePause();
  else openPause();
});

input.onKey = (e) => {
  if (e.code === 'Escape') {
    e.preventDefault();
    if (overlayKind === 'pause') { resumePause(); return; }
    if (overlayKind === 'weapons' || overlayKind === 'mirror') { closeOverlay(); return; }
    if (!overlayKind) openPause();
    return;
  }
  if (e.code === 'KeyM') {
    UI.mute.click();
    return;
  }
  const digit = /^Digit([1-9])$/.exec(e.code);
  if (digit) {
    const index = Number(digit[1]) - 1;
    if (overlayKind === 'gates') {
      const card = UI.overlay.querySelector(`[data-gate="${index}"]`);
      if (card) card.click();
    } else if (overlayKind === 'boon') {
      const card = UI.overlay.querySelector(`[data-boon="${index}"]`);
      if (card) card.click();
    } else if (overlayKind === 'hammer') {
      const card = UI.overlay.querySelector(`[data-hammer="${index}"]`);
      if (card) card.click();
    }
    return;
  }
  if (overlayKind === 'boon' && e.code === 'KeyR') {
    const btn = UI.overlay.querySelector('[data-reroll]');
    if (btn && !btn.disabled) btn.click();
  }
  if ((overlayKind === 'boon' || overlayKind === 'hammer') && e.code === 'KeyX') {
    const btn = UI.overlay.querySelector('[data-skip]');
    if (btn) btn.click();
  }
};

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.run && !overlayKind && ['intro', 'fight', 'cleared'].includes(game.state)) openPause();
});

// ============================================================
// Touch controls
// ============================================================
function resetStick() {
  stickPointer = null;
  UI.touch.querySelector('#stick-base').classList.remove('active');
  const knob = $('stick-knob');
  knob.style.transform = 'translate(0px, 0px)';
  game.setTouchMove(0, 0);
}

const stickZone = $('stick-zone');
const stickBase = $('stick-base');
const stickKnob = $('stick-knob');

stickZone.addEventListener('pointerdown', (e) => {
  if (!game.run) return;
  e.preventDefault();
  audio.init();
  stickPointer = e.pointerId;
  stickZone.setPointerCapture?.(e.pointerId);
  stickRect = stickZone.getBoundingClientRect();
  stickOrigin = { x: e.clientX, y: e.clientY };
  stickBase.style.left = `${e.clientX - stickRect.left}px`;
  stickBase.style.bottom = `${stickRect.bottom - e.clientY}px`;
  stickBase.classList.add('active');
});

stickZone.addEventListener('pointermove', (e) => {
  if (e.pointerId !== stickPointer) return;
  e.preventDefault();
  let dx = e.clientX - stickOrigin.x;
  let dy = e.clientY - stickOrigin.y;
  const len = Math.hypot(dx, dy);
  const max = 42;
  if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
  stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  game.setTouchMove(dx / max, dy / max);
});

for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) {
  stickZone.addEventListener(ev, (e) => {
    if (stickPointer !== null && e.pointerId === stickPointer) resetStick();
  });
}

document.querySelectorAll('.tbtn').forEach((btn) => {
  const act = btn.dataset.act;
  const release = () => {
    btn.classList.remove('pressed');
    if (act === 'attack') game.touchAttack = false;
  };
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    audio.init();
    btn.setPointerCapture?.(e.pointerId);
    btn.classList.add('pressed');
    if (act === 'attack') game.touchAttack = true;
    else game.press(act);
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) btn.addEventListener(ev, release);
});

window.addEventListener('touchstart', () => {
  if (game.run) UI.touch.classList.remove('hidden');
}, { passive: true });

// ============================================================
// Resize + main loop
// ============================================================
let resizeRaf = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => game.resize());
});

function drawHub(time) {
  const ctx = game.ctx;
  ctx.setTransform(game.dpr, 0, 0, game.dpr, 0, 0);
  drawMenu(ctx, game.w, game.h, time, game.scale);
}

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  const time = now / 1000;

  game.update(dt);
  if (game.run && game.floor) game.render(time);
  else drawHub(time);

  if (game.run && now - lastHudAt > 90) updateHud();
  requestAnimationFrame(frame);
}

updateHub();
drawHub(performance.now() / 1000);
requestAnimationFrame(frame);
