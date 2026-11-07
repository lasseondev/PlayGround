// Static game data: gods, boons, weapons, meta upgrades, biomes.
export const RARITY = {
  common: { id: 'common', name: 'Обычный', mult: 1, cls: '', weight: 56, color: '#b9ab97' },
  rare: { id: 'rare', name: 'Редкий', mult: 1.28, cls: 'rare', weight: 31, color: '#8fd4ff' },
  epic: { id: 'epic', name: 'Эпический', mult: 1.62, cls: 'epic', weight: 13, color: '#d9a3ff' },
};
export const RARITY_ORDER = ['common', 'rare', 'epic'];
export const MAX_BOON_LEVEL = 3;

export function boonPower(base, level, rarity) {
  return base * (1 + 0.42 * (level - 1)) * (RARITY[rarity]?.mult || 1);
}
export const pct = (v) => Math.round(v);
export const dec = (v) => Math.round(v * 10) / 10;

// ---------------- ICONS ----------------
export const ICONS = {
  sword: '<path d="M9 39l4-1 22-22-3-3L10 35l-1 4z" fill="currentColor"/><path d="M30 8l3-3 10 10-3 3-10-10z" fill="currentColor"/><path d="M8 31l9 9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  spear: '<path d="M8 40l22-22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M27 6l14 3-3 14-5-7-6 5L24 13z" fill="currentColor"/><path d="M8 34l6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  bow: '<path d="M12 8c14 6 22 18 24 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 8c8 16 18 24 34 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".6"/><path d="M10 40L38 12" stroke="currentColor" stroke-width="1.4"/><path d="M36 8l4 4-4 1-1-4z" fill="currentColor"/>',
  hammer: '<path d="M10 38l14-14" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><path d="M22 8l18 18-7 7-18-18z" fill="currentColor"/><path d="M30 4l14 14-4 4-14-14z" fill="currentColor" opacity=".75"/>',
  heart: '<path d="M24 41S7 31 7 19c0-7 9-11 17-3 8-8 17-4 17 3 0 12-17 22-17 22z" fill="currentColor"/>',
  boot: '<path d="M16 6h10v16l10 6c4 2 5 5 5 9v5H12c-3 0-4-2-4-5V22h8V6z" fill="currentColor"/>',
  coin: '<circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M28 14c-7-2-11 2-11 6 0 8 14 4 14 12 0 5-7 8-12 4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  skull: '<path d="M24 7c-9 0-15 6-15 15 0 5 2 9 6 11v6h18v-6c4-2 6-6 6-11 0-9-6-15-15-15z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="18" cy="23" r="3" fill="currentColor"/><circle cx="30" cy="23" r="3" fill="currentColor"/><path d="M24 28v5" stroke="currentColor" stroke-width="2"/>',
  shield: '<path d="M24 5l16 6v12c0 11-7 17-16 20C15 40 8 34 8 23V11l16-6z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M24 13v18M17 20h14" stroke="currentColor" stroke-width="1.6" opacity=".65"/>',
  dash: '<path d="M6 24h22M18 12l12 12-12 12M32 12l10 12-10 12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  flame: '<path d="M24 5c2 8 9 10 13 15 4 4 5 8 5 12a18 18 0 01-36 0c0-8 5-12 9-17 1 4 3 6 5 6 0-8-3-13 4-16z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 27c1 4 5 5 5 9a5 5 0 01-10 0c0-3 2-5 5-9z" fill="currentColor" opacity=".7"/>',
  moon: '<path d="M31 6a18 18 0 1 0 0 36c-8-4-12-11-12-18S23 10 31 6z" fill="currentColor"/>',
  star: '<path d="M24 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="currentColor"/>',
  eye: '<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="6" fill="currentColor"/>',
  hourglass: '<path d="M12 5h24M12 43h24M15 5c0 12 18 12 18 19s-18 7-18 19M33 5c0 12-18 12-18 19s18 7 18 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  // god emblems
  zeus: '<path d="M27 4L9 28h11l-3 16 19-25H24l3-15z" fill="currentColor"/>',
  poseidon: '<path d="M24 8v33M12 17c0 7 5 12 12 12s12-5 12-12M12 17v-6M24 15V7M36 17v-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M7 33c3 5 6 5 8 2M41 33c-3 5-6 5-8 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  athena: '<path d="M10 15c6-5 22-5 28 0v22H10V15z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="24" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="30" cy="24" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="24" r="1.6" fill="currentColor"/><circle cx="30" cy="24" r="1.6" fill="currentColor"/><path d="M24 28l-3 5h6l-3-5z" fill="currentColor"/><path d="M10 15l-4-5M38 15l4-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  artemis: '<path d="M32 7a17 17 0 100 34 14 14 0 010-34z" fill="currentColor"/><path d="M12 40L34 18M31 15l6-3 2 6-5 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  dionysus: '<path d="M24 10v10M24 10c5-4 10-2 11 2-4 3-8 2-11-2z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="24" r="4.2" fill="currentColor"/><circle cx="30" cy="24" r="4.2" fill="currentColor"/><circle cx="24" cy="32" r="4.2" fill="currentColor"/><circle cx="18" cy="38" r="3.4" fill="currentColor"/><circle cx="30" cy="38" r="3.4" fill="currentColor"/><circle cx="24" cy="43" r="3" fill="currentColor"/>',
  ares: '<path d="M12 42L36 12M8 36l8-2 2-8M28 8l8-2-2 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M36 6l6 2-2 6-4-4-4-2z" fill="currentColor"/>',
  aphrodite: '<path d="M24 42S6 31 6 18c0-8 10-12 18-3 8-9 18-5 18 3 0 13-18 24-18 24z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M24 18c3-3 7 0 4 4l-4 4-4-4c-3-4 1-7 4-4z" fill="currentColor"/>',
  hermes: '<path d="M9 33c9-1 17-7 22-19 4 9 2 19-5 26-5 4-12 2-17-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M15 31l9-9M19 36l8-8M26 39l6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  chaos: '<path d="M24 4c8 0 14 5 14 12 0 8-7 10-12 13-4 2-4 5-1 6 4 1 8-3 9-7 2 5 0 12-6 15-8 4-18-1-19-10-1-8 6-11 11-14 4-2 4-5 1-6-4-1-8 2-9 6-2-5 1-11 6-14 2-1 4-1 6-1z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  bolt: '<path d="M27 4L9 28h11l-3 16 19-25H24l3-15z" fill="currentColor"/>',
  trident: '<path d="M24 8v33M12 17c0 7 5 12 12 12s12-5 12-12M12 17v-6M24 15V7M36 17v-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
};

export function icon(name) {
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;
}

// ---------------- GODS ----------------
export const GODS = {
  zeus: { name: 'Зевс', title: 'ГРОМОВЕРЖЕЦ', color: '#8ed9ff', petal: '#bff0ff', symbol: 'zeus', line: 'Небо помнит твой гнев.' },
  poseidon: { name: 'Посейдон', title: 'КОЛЕБАТЕЛЬ ЗЕМЛИ', color: '#5fe3c6', symbol: 'poseidon', line: 'Море не прощает слабости.' },
  athena: { name: 'Афина', title: 'НЕСОКРУШИМАЯ', color: '#f5d78d', symbol: 'athena', line: 'Мудрость — тоже оружие.' },
  artemis: { name: 'Артемида', title: 'ЛУННАЯ ОХОТНИЦА', color: '#b8f77d', symbol: 'artemis', line: 'Ни одна цель не уйдёт.' },
  dionysus: { name: 'Дионис', title: 'БОГ ВИНА', color: '#c69bff', symbol: 'dionysus', line: 'Одурмань их всех.' },
  ares: { name: 'Арес', title: 'БОГ ВОЙНЫ', color: '#ff7a66', symbol: 'ares', line: 'Кровь требует крови.' },
  aphrodite: { name: 'Афродита', title: 'ПОКОРИТЕЛЬНИЦА', color: '#ff9dcc', symbol: 'aphrodite', line: 'Любовь ранит глубже стали.' },
  hermes: { name: 'Гермес', title: 'БЫСТРОНОГИЙ', color: '#ffcf70', symbol: 'hermes', line: 'Не дай себя поймать.' },
  chaos: { name: 'Хаос', title: 'ПЕРВОЗДАННЫЙ', color: '#d8c6ff', symbol: 'chaos', line: 'Всё имеет свою цену.' },
};

// ---------------- BOONS ----------------
// desc receives computed value v (rounded), plus level/rarity for convenience.
export const BOONS = [
  {
    id: 'zeus_bolt', god: 'zeus', name: 'Громовержец', icon: 'bolt',
    base: 26, desc: (v) => `Удар с шансом <b>34%</b> призывает молнию: <b>${pct(v)}</b> урона и разряд по ближайшему врагу.`,
  },
  {
    id: 'zeus_step', god: 'zeus', name: 'Небесный шаг', icon: 'dash',
    base: 24, desc: (v) => `Рывок сквозь врага бьёт его молнией на <b>${pct(v)}</b> урона и оглушает.`,
  },
  {
    id: 'poseidon_wave', god: 'poseidon', name: 'Прилив', icon: 'trident',
    base: 20, desc: (v) => `Удары наносят <b>+${pct(v)}%</b> урона и отбрасывают врагов к стенам.`,
  },
  {
    id: 'poseidon_special', god: 'poseidon', name: 'Волнорез', icon: 'star',
    base: 42, desc: (v) => `Спецудар создаёт волну: <b>${pct(v)}</b> урона по площади и мощный отброс.`,
  },
  {
    id: 'athena_aegis', god: 'athena', name: 'Эгида', icon: 'shield',
    base: 1, desc: (v) => `В начале каждого зала — щит, поглощающий <b>${Math.round(v)}</b> удар(а). <b>+14</b> к макс. жизни.`,
  },
  {
    id: 'athena_step', god: 'athena', name: 'Мудрость', icon: 'eye',
    base: 12, desc: (v) => `<b>+${pct(v)}%</b> к скорости и <b>−${pct(v * 0.8)}%</b> к перезарядке рывка.`,
  },
  {
    id: 'artemis_crit', god: 'artemis', name: 'Лунный выстрел', icon: 'moon',
    base: 15, desc: (v) => `<b>+${pct(v)}%</b> шанса крита. Криты наносят <b>+110%</b> урона.`,
  },
  {
    id: 'artemis_mark', god: 'artemis', name: 'Метка охоты', icon: 'star',
    base: 46, desc: (v) => `Каждый <b>4-й</b> удар наносит <b>+${pct(v)}</b> урона и оставляет метку.`,
  },
  {
    id: 'dionysus_poison', god: 'dionysus', name: 'Хмель', icon: 'dionysus',
    base: 8, desc: (v) => `Удары отравляют: <b>${dec(v)}</b> урона в секунду <b>4 сек</b>, до 3 слоёв.`,
  },
  {
    id: 'dionysus_feast', god: 'dionysus', name: 'Пир', icon: 'coin',
    base: 5, desc: (v) => `Побеждённые враги с шансом <b>38%</b> оставляют гроздь: <b>+${dec(v)}</b> жизни.`,
  },
  {
    id: 'ares_doom', god: 'ares', name: 'Обречение', icon: 'skull',
    base: 52, desc: (v) => `Каждый <b>3-й</b> удар накладывает обречение. Через <b>1.1 сек</b> — взрыв на <b>${pct(v)}</b> урона.`,
  },
  {
    id: 'ares_blood', god: 'ares', name: 'Кровожадность', icon: 'heart',
    base: 1.4, desc: (v) => `Удары восстанавливают <b>${dec(v)}</b> жизни и наносят <b>+6%</b> урона.`,
  },
  {
    id: 'aphrodite_charm', god: 'aphrodite', name: 'Очарование', icon: 'heart',
    base: 32, desc: (v) => `Удары ослабляют врага на <b>${pct(v)}%</b> урона на <b>4 сек</b>.`,
  },
  {
    id: 'aphrodite_love', god: 'aphrodite', name: 'Благословение', icon: 'star',
    base: 32, desc: (v) => `<b>+${pct(v)}</b> к максимальной жизни. Жизнь восстанавливается на столько же.`,
  },
  {
    id: 'hermes_speed', god: 'hermes', name: 'Быстрота', icon: 'boot',
    base: 12, desc: (v) => `<b>+${pct(v)}%</b> к скорости передвижения, <b>−${pct(v * 1.3)}%</b> к перезарядке рывка.`,
  },
  {
    id: 'hermes_shadow', god: 'hermes', name: 'Вторая тень', icon: 'dash',
    base: 1, desc: () => `<b>+1</b> заряд рывка. Рывок восстанавливается быстрее.`,
  },
  {
    id: 'chaos_gift', god: 'chaos', name: 'Дар Хаоса', icon: 'chaos',
    base: 25, desc: (v) => `<b>+${pct(v)}%</b> урона, но получаемый урон <b>+15%</b>.`,
  },
  {
    id: 'chaos_armor', god: 'chaos', name: 'Плоть Хаоса', icon: 'shield',
    base: 26, desc: (v) => `<b>+${pct(v)}</b> к максимальной жизни. Получаемый урон <b>−12%</b>.`,
  },
];

// ---------------- WEAPONS ----------------
export const WEAPONS = {
  blade: {
    id: 'blade', name: 'Клинок Стикса', tag: 'МЕЧ ПОДЗЕМНОГО СУДЬИ', icon: 'sword', color: '#e8b86a',
    desc: 'Три быстрых удара в дуге. Финальный удар бьёт сильнее и отбрасывает.',
    attack: {
      type: 'melee', cd: 0.2,
      combo: [
        { dmg: 14, range: 82, arc: 1.75, dur: 0.24, lunge: 20, knock: 110 },
        { dmg: 14, range: 84, arc: 1.8, dur: 0.23, lunge: 22, knock: 120 },
        { dmg: 24, range: 96, arc: 2.2, dur: 0.3, lunge: 26, knock: 260 },
      ],
      special: { type: 'spin', dmg: 34, radius: 132, cd: 3.4, knock: 260 },
    },
    stats: { dmg: 3, speed: 4, range: 2 },
  },
  spear: {
    id: 'spear', name: 'Копьё Аида', tag: 'ОРУЖИЕ ВЛАДЫКИ', icon: 'spear', color: '#8fd4e8',
    desc: 'Дальний колющий удар пробивает врагов насквозь. Медленнее, но беспощаднее.',
    attack: {
      type: 'thrust', cd: 0.34, dmg: 30, range: 150, arc: 0.52, dur: 0.2, lunge: 30, knock: 170,
      special: { type: 'spin', dmg: 42, radius: 158, cd: 4.0, knock: 300 },
    },
    stats: { dmg: 4, speed: 3, range: 4 },
  },
  bow: {
    id: 'bow', name: 'Лук Феба', tag: 'СВЕТ СРЕДИ ТЬМЫ', icon: 'bow', color: '#b8f77d',
    desc: 'Стреляй издалека. Спецудар выпускает веер из пяти стрел.',
    attack: {
      type: 'ranged', cd: 0.4, dmg: 21, speed: 1050, spread: 0.03,
      special: { type: 'volley', dmg: 17, count: 5, spread: 0.62, cd: 4.2, speed: 950 },
    },
    stats: { dmg: 2, speed: 5, range: 5 },
  },
};

// ---------------- HAMMER UPGRADES ----------------
export const HAMMERS = {
  blade: [
    { id: 'blade_heavy', name: 'Мясник', icon: 'hammer', desc: '<b>+45%</b> урона, но удары на <b>12%</b> медленнее.', apply: (s) => { s.dmgMult *= 1.45; s.attackSpeed *= 0.88; } },
    { id: 'blade_dance', name: 'Танец клинков', icon: 'sword', desc: 'Атаки на <b>22%</b> быстрее, дальность <b>+18%</b>.', apply: (s) => { s.attackSpeed *= 1.22; s.rangeMult *= 1.18; } },
    { id: 'blade_blood', name: 'Багровый вихрь', icon: 'flame', desc: 'Спецудар бьёт на <b>+50%</b> сильнее и перезаряжается на <b>30%</b> быстрее.', apply: (s) => { s.specialMult *= 1.5; s.specialCd *= 0.7; } },
  ],
  spear: [
    { id: 'spear_reach', name: 'Длинная тень', icon: 'spear', desc: 'Дальность <b>+30%</b>, урон <b>+12%</b>.', apply: (s) => { s.rangeMult *= 1.3; s.dmgMult *= 1.12; } },
    { id: 'spear_pierce', name: 'Пронзание', icon: 'star', desc: 'Удары пробивают всех врагов на линии. Урон <b>+18%</b>.', apply: (s) => { s.pierce = true; s.dmgMult *= 1.18; } },
    { id: 'spear_storm', name: 'Буря копий', icon: 'flame', desc: 'Спецудар на <b>+40%</b> дальше и наносит <b>+35%</b> урона.', apply: (s) => { s.specialMult *= 1.35; s.specialRadius *= 1.4; } },
  ],
  bow: [
    { id: 'bow_twin', name: 'Двойной залп', icon: 'bow', desc: 'Каждый выстрел выпускает <b>2</b> стрелы.', apply: (s) => { s.arrows = 2; s.spread += 0.07; } },
    { id: 'bow_pierce', name: 'Пронзающая стрела', icon: 'dash', desc: 'Стрелы пробивают <b>2</b> врагов. Урон <b>+15%</b>.', apply: (s) => { s.pierce = true; s.dmgMult *= 1.15; } },
    { id: 'bow_power', name: 'Гнев Феба', icon: 'flame', desc: 'Урон <b>+38%</b>, но выстрелы на <b>10%</b> медленнее.', apply: (s) => { s.dmgMult *= 1.38; s.attackSpeed *= 0.9; } },
  ],
};

// ---------------- META (MIRROR) ----------------
export const META_UPGRADES = [
  { id: 'vitality', name: 'Живучесть', icon: 'heart', desc: '+22 к максимальной жизни', max: 5, cost: (l) => 30 + l * 22 },
  { id: 'might', name: 'Мощь', icon: 'sword', desc: '+7% к наносимому урону', max: 5, cost: (l) => 36 + l * 24 },
  { id: 'swift', name: 'Быстрота', icon: 'boot', desc: '+6% к скорости', max: 3, cost: (l) => 26 + l * 18 },
  { id: 'dash', name: 'Прыть', icon: 'dash', desc: '+1 заряд рывка', max: 2, cost: (l) => 120 + l * 100 },
  { id: 'crit', name: 'Хищность', icon: 'eye', desc: '+5% к шансу крита', max: 3, cost: (l) => 52 + l * 34 },
  { id: 'revive', name: 'Упорство', icon: 'flame', desc: 'Одно воскрешение за спуск', max: 1, cost: () => 210 },
  { id: 'greed', name: 'Жадность', icon: 'coin', desc: '+30% Тьмы за спуск', max: 2, cost: (l) => 70 + l * 60 },
];

// ---------------- ENEMIES ----------------
export const ENEMY_TYPES = {
  skeleton: { name: 'Скелет-страж', hp: 44, speed: 98, dmg: 11, radius: 16, mass: 1, xp: 4, souls: 1, kind: 'melee' },
  shade: { name: 'Тень', hp: 30, speed: 158, dmg: 9, radius: 14, mass: 0.8, xp: 4, souls: 1, kind: 'dash' },
  archer: { name: 'Костяной лучник', hp: 34, speed: 78, dmg: 10, radius: 15, mass: 0.85, xp: 5, souls: 1, kind: 'ranged' },
  brute: { name: 'Громила', hp: 108, speed: 62, dmg: 19, radius: 23, mass: 1.7, xp: 9, souls: 2, kind: 'slam' },
  witch: { name: 'Ведьма Стикса', hp: 58, speed: 66, dmg: 11, radius: 16, mass: 0.9, xp: 8, souls: 2, kind: 'caster' },
};

export const BIOMES = [
  {
    id: 'tartarus', name: 'ТАРТАР', chapter: 'ГЛАВА I', sub: 'ПЕРВЫЙ КРУГ',
    bg: '#0a0712', floor: '#171125', floor2: '#221a33', accent: '#7d66bb', glow: '#a78bff', fog: '#160e22',
    detail: '#2d2342', ember: '#c9a4ff', wall: '#1d1729', wall2: '#2a2139', rune: '#8b6fd6',
  },
  {
    id: 'asphodel', name: 'АСФОДЕЛЬ', chapter: 'ГЛАВА II', sub: 'ПОЛЯ ПЕЧАЛИ',
    bg: '#0d0709', floor: '#1e1318', floor2: '#2a1a20', accent: '#c95b3a', glow: '#ff8a4c', fog: '#1a0c0d',
    detail: '#3a2229', ember: '#ff9a5c', wall: '#241519', wall2: '#332026', rune: '#e06a42',
  },
  {
    id: 'elysium', name: 'ЭЛИЗИУМ', chapter: 'ГЛАВА III', sub: 'САДЫ ГЕРОЕВ',
    bg: '#0b0a08', floor: '#1d1b14', floor2: '#292619', accent: '#c2a14e', glow: '#ffd88a', fog: '#171408',
    detail: '#3a3524', ember: '#ffd68a', wall: '#211e15', wall2: '#302b1c', rune: '#caa652',
  },
  {
    id: 'styx', name: 'СТИКС', chapter: 'ГЛАВА IV', sub: 'ХРАМ ЦЕРБЕРА',
    bg: '#050810', floor: '#0f1626', floor2: '#172135', accent: '#4f8fd6', glow: '#7fd0ff', fog: '#08101c',
    detail: '#1f2d48', ember: '#80c6ff', wall: '#101b2c', wall2: '#1b2a42', rune: '#5b9ee0',
  },
];

export const CHAPTERS = [
  { chambers: 2, biome: 0 },
  { chambers: 2, biome: 1 },
  { chambers: 2, biome: 2 },
  { chambers: 2, biome: 3 },
];

export const TOTAL_CHAMBERS = 9;
export function chamberBiome(chamber) {
  if (chamber >= 9) return BIOMES[3];
  if (chamber >= 7) return BIOMES[3];
  if (chamber >= 5) return BIOMES[2];
  if (chamber >= 3) return BIOMES[1];
  return BIOMES[0];
}

export const DEFAULT_SAVE = {
  darkness: 40,
  meta: {},
  weapon: 'blade',
  runs: 0,
  wins: 0,
  heat: 0,
  bestChamber: 0,
  bestTime: 0,
  totalKills: 0,
  seenIntro: false,
};
