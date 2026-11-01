import { TILE, W, H, OPPOSITE, DIR_TO_FACING } from './config.js';

const c = (n) => n * TILE + TILE / 2;

// ---------------------------------------------------------------------------
// Room definitions. Doors: open | locked | boss | sealed
// The dungeon is a 3x3 map:
//   [Warden's Vault] [The Hollow Eye] [Reliquary]
//   [West Gallery]   [Grand Hall]     [East Gallery]
//                    [Entrance]
// ---------------------------------------------------------------------------
export const ROOMS = {
  '1,2': {
    name: 'Sealed Entrance',
    doors: { n: 'open', s: 'sealed' },
    carpet: 'vertical',
    torches: [
      { tx: 5, ty: 1, dir: 'n' },
      { tx: 26, ty: 1, dir: 'n' },
      { tx: 1, ty: 5, dir: 'w' },
      { tx: 1, ty: 12, dir: 'w' },
      { tx: 30, ty: 5, dir: 'e' },
      { tx: 30, ty: 12, dir: 'e' },
    ],
    banners: [{ tx: 9, ty: 1 }, { tx: 22, ty: 1 }],
    props: [
      { type: 'pillar', tx: 7, ty: 4 },
      { type: 'pillar', tx: 23, ty: 4 },
      { type: 'brazier', tx: 10, ty: 3 },
      { type: 'brazier', tx: 21, ty: 3 },
      { type: 'pot', tx: 6, ty: 12 },
      { type: 'pot', tx: 25, ty: 12 },
      { type: 'rubble', tx: 5, ty: 8 },
      { type: 'rubble', tx: 27, ty: 9 },
    ],
    signs: [
      {
        tx: 16,
        ty: 12,
        text: [
          'THE HOLLOW VAULT',
          'Two small keys sleep in the west and east galleries.',
          'A warden guards the Boss Key. Only it can open the great door.',
        ],
      },
    ],
    enemies: [],
    chests: [],
  },

  '1,1': {
    name: 'Grand Hall',
    doors: { n: 'boss', s: 'open', w: 'open', e: 'open' },
    carpet: 'cross',
    torches: [
      { tx: 4, ty: 1, dir: 'n' },
      { tx: 27, ty: 1, dir: 'n' },
      { tx: 1, ty: 4, dir: 'w' },
      { tx: 1, ty: 13, dir: 'w' },
      { tx: 30, ty: 4, dir: 'e' },
      { tx: 30, ty: 13, dir: 'e' },
    ],
    banners: [{ tx: 8, ty: 1 }, { tx: 23, ty: 1 }],
    props: [
      { type: 'pillar', tx: 6, ty: 4 },
      { type: 'pillar', tx: 24, ty: 4 },
      { type: 'pillar', tx: 6, ty: 12 },
      { type: 'pillar', tx: 24, ty: 12 },
      { type: 'brazier', tx: 10, ty: 3 },
      { type: 'brazier', tx: 21, ty: 3 },
      { type: 'pot', tx: 5, ty: 8 },
      { type: 'pot', tx: 26, ty: 8 },
      { type: 'rubble', tx: 9, ty: 14 },
      { type: 'rubble', tx: 22, ty: 14 },
    ],
    mosaic: { tx: 16, ty: 9, r: 42 },
    signs: [
      {
        tx: 19,
        ty: 3,
        text: ['THE GREAT DOOR', 'It is bound to the Boss Key.', 'The warden in the north-west vault keeps it.'],
      },
    ],
    enemies: [
      { type: 'slime', tx: 10, ty: 8 },
      { type: 'slime', tx: 21, ty: 9 },
      { type: 'bat', tx: 16, ty: 5 },
    ],
    chests: [],
  },

  '0,1': {
    name: 'West Gallery',
    doors: { e: 'open', n: 'locked' },
    torches: [
      { tx: 4, ty: 1, dir: 'n' },
      { tx: 27, ty: 1, dir: 'n' },
      { tx: 30, ty: 5, dir: 'e' },
      { tx: 30, ty: 12, dir: 'e' },
    ],
    banners: [{ tx: 12, ty: 1 }],
    props: [
      { type: 'pillar', tx: 9, ty: 7 },
      { type: 'pillar', tx: 21, ty: 7 },
      { type: 'pot', tx: 26, ty: 12 },
      { type: 'pot', tx: 27, ty: 5 },
      { type: 'rubble', tx: 6, ty: 13 },
    ],
    signs: [
      { tx: 16, ty: 13, text: ['WEST GALLERY', 'A small key is kept here.', 'The north door is locked.'] },
    ],
    enemies: [
      { type: 'slime', tx: 11, ty: 10 },
      { type: 'slime', tx: 18, ty: 11 },
      { type: 'bat', tx: 20, ty: 4 },
    ],
    chests: [{ id: 'west-key', tx: 5, ty: 4, content: 'key' }],
  },

  '2,1': {
    name: 'East Gallery',
    doors: { w: 'open', n: 'locked' },
    torches: [
      { tx: 4, ty: 1, dir: 'n' },
      { tx: 27, ty: 1, dir: 'n' },
      { tx: 1, ty: 5, dir: 'w' },
      { tx: 1, ty: 12, dir: 'w' },
    ],
    banners: [{ tx: 20, ty: 1 }],
    props: [
      { type: 'pillar', tx: 9, ty: 11 },
      { type: 'pillar', tx: 22, ty: 11 },
      { type: 'pot', tx: 5, ty: 12 },
      { type: 'pot', tx: 6, ty: 13 },
      { type: 'rubble', tx: 25, ty: 8 },
    ],
    signs: [
      { tx: 16, ty: 13, text: ['EAST GALLERY', 'A small key is kept here.', 'Beware the archers.'] },
    ],
    enemies: [
      { type: 'skeleton', tx: 11, ty: 5 },
      { type: 'skeleton', tx: 19, ty: 10 },
      { type: 'slime', tx: 16, ty: 8 },
    ],
    chests: [{ id: 'east-key', tx: 26, ty: 4, content: 'key' }],
  },

  '0,0': {
    name: "Warden's Vault",
    doors: { s: 'locked' },
    carpet: 'vertical',
    torches: [
      { tx: 4, ty: 1, dir: 'n' },
      { tx: 27, ty: 1, dir: 'n' },
      { tx: 1, ty: 5, dir: 'w' },
      { tx: 1, ty: 12, dir: 'w' },
      { tx: 30, ty: 5, dir: 'e' },
      { tx: 30, ty: 12, dir: 'e' },
    ],
    banners: [{ tx: 8, ty: 1 }, { tx: 23, ty: 1 }],
    props: [
      { type: 'pillar', tx: 5, ty: 5 },
      { type: 'pillar', tx: 25, ty: 5 },
      { type: 'brazier', tx: 9, ty: 3 },
      { type: 'brazier', tx: 22, ty: 3 },
      { type: 'rubble', tx: 5, ty: 13 },
      { type: 'rubble', tx: 26, ty: 13 },
      { type: 'bones', tx: 8, ty: 11 },
      { type: 'bones', tx: 24, ty: 10 },
    ],
    mosaic: { tx: 16, ty: 9, r: 38 },
    signs: [],
    enemies: [{ type: 'warden', tx: 16, ty: 7 }],
    chests: [{ id: 'vault-boss-key', tx: 16, ty: 3, content: 'bossKey', hidden: true }],
  },

  '2,0': {
    name: 'Reliquary',
    doors: { s: 'locked' },
    torches: [
      { tx: 4, ty: 1, dir: 'n' },
      { tx: 27, ty: 1, dir: 'n' },
      { tx: 1, ty: 5, dir: 'w' },
      { tx: 1, ty: 12, dir: 'w' },
      { tx: 30, ty: 5, dir: 'e' },
      { tx: 30, ty: 12, dir: 'e' },
    ],
    banners: [{ tx: 10, ty: 1 }, { tx: 21, ty: 1 }],
    props: [
      { type: 'statue', tx: 6, ty: 5 },
      { type: 'statue', tx: 24, ty: 5 },
      { type: 'pot', tx: 7, ty: 12 },
      { type: 'pot', tx: 24, ty: 12 },
      { type: 'rubble', tx: 13, ty: 4 },
      { type: 'rubble', tx: 18, ty: 4 },
    ],
    mosaic: { tx: 16, ty: 8, r: 40 },
    signs: [],
    enemies: [
      { type: 'slime', tx: 10, ty: 10 },
      { type: 'slime', tx: 22, ty: 10 },
      { type: 'bat', tx: 16, ty: 4 },
    ],
    chests: [{ id: 'reliquary-heart', tx: 16, ty: 7, content: 'heartContainer' }],
  },

  '1,0': {
    name: 'The Hollow Eye',
    doors: { s: 'boss' },
    carpet: 'vertical',
    torches: [
      { tx: 3, ty: 1, dir: 'n' },
      { tx: 28, ty: 1, dir: 'n' },
      { tx: 1, ty: 4, dir: 'w' },
      { tx: 1, ty: 13, dir: 'w' },
      { tx: 30, ty: 4, dir: 'e' },
      { tx: 30, ty: 13, dir: 'e' },
    ],
    banners: [{ tx: 6, ty: 1 }, { tx: 25, ty: 1 }],
    props: [
      { type: 'pillar', tx: 5, ty: 4 },
      { type: 'pillar', tx: 25, ty: 4 },
      { type: 'brazier', tx: 9, ty: 3 },
      { type: 'brazier', tx: 22, ty: 3 },
      { type: 'bones', tx: 7, ty: 12 },
      { type: 'bones', tx: 24, ty: 12 },
      { type: 'bones', tx: 10, ty: 14 },
      { type: 'bones', tx: 21, ty: 14 },
      { type: 'rubble', tx: 22, ty: 14 },
      { type: 'rubble', tx: 12, ty: 6 },
      { type: 'rubble', tx: 20, ty: 6 },
    ],
    mosaic: { tx: 16, ty: 9, r: 58 },
    boss: true,
    signs: [],
    enemies: [],
    chests: [],
  },
};

export const MAP_CELLS = [
  ['0,0', '1,0', '2,0'],
  ['0,1', '1,1', '2,1'],
  ['', '1,2', ''],
];

export function roomId(cx, cy) {
  return `${cx},${cy}`;
}

export function parseRoomId(id) {
  const [x, y] = id.split(',').map(Number);
  return { x, y };
}

export function neighborId(id, dir) {
  const { x, y } = parseRoomId(id);
  if (dir === 'n') return roomId(x, y - 1);
  if (dir === 's') return roomId(x, y + 1);
  if (dir === 'w') return roomId(x - 1, y);
  if (dir === 'e') return roomId(x + 1, y);
  return null;
}

// Static solid tiles for a room. Door openings are punched out.
export function buildSolid(room) {
  const solid = Array.from({ length: 18 }, () => Array(32).fill(false));
  for (let y = 0; y < 18; y++) {
    for (let x = 0; x < 32; x++) {
      if (x === 0 || x === 31 || y === 0 || y === 17) solid[y][x] = true;
    }
  }
  if (room.doors.n) {
    solid[0][15] = false;
    solid[0][16] = false;
  }
  if (room.doors.s) {
    solid[17][15] = false;
    solid[17][16] = false;
  }
  if (room.doors.w) {
    solid[8][0] = false;
    solid[9][0] = false;
  }
  if (room.doors.e) {
    solid[8][31] = false;
    solid[9][31] = false;
  }
  for (const p of room.props || []) {
    if (p.type === 'pillar' || p.type === 'statue') {
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const x = p.tx + dx;
          const y = p.ty + dy;
          if (solid[y]) solid[y][x] = true;
        }
      }
    }
    if (p.type === 'brazier' || p.type === 'sign') {
      if (solid[p.ty]) solid[p.ty][p.tx] = true;
    }
  }
  return solid;
}

// Solid rectangles for dynamic objects and doors, in room pixel space.
export function doorRect(dir, state) {
  if (!state || state === 'open' || state === 'sealed') {
    if (state === 'sealed') {
      if (dir === 'n') return { x: 240, y: 0, w: 32, h: 16 };
      if (dir === 's') return { x: 240, y: H - 16, w: 32, h: 16 };
      if (dir === 'w') return { x: 0, y: 128, w: 16, h: 32 };
      if (dir === 'e') return { x: W - 16, y: 128, w: 16, h: 32 };
    }
    return null;
  }
  if (dir === 'n') return { x: 240, y: 0, w: 32, h: 14 };
  if (dir === 's') return { x: 240, y: H - 14, w: 32, h: 14 };
  if (dir === 'w') return { x: 0, y: 128, w: 14, h: 32 };
  if (dir === 'e') return { x: W - 14, y: 128, w: 14, h: 32 };
  return null;
}

export function doorTiles(dir) {
  if (dir === 'n') return [{ x: 15, y: 0 }, { x: 16, y: 0 }];
  if (dir === 's') return [{ x: 15, y: 17 }, { x: 16, y: 17 }];
  if (dir === 'w') return [{ x: 0, y: 8 }, { x: 0, y: 9 }];
  return [{ x: 31, y: 8 }, { x: 31, y: 9 }];
}

export function doorStateFor(runtime, roomIdValue, dir) {
  return runtime.doorStates[roomIdValue]?.[dir] || null;
}

export function roomSpawn(id, fromDir) {
  // Where the player appears when entering `id` from direction `fromDir`.
  const entry = OPPOSITE[fromDir];
  if (entry === 'n') return { x: W / 2, y: 26, facing: 'down' };
  if (entry === 's') return { x: W / 2, y: H - 26, facing: 'up' };
  if (entry === 'w') return { x: 26, y: H / 2, facing: 'right' };
  if (entry === 'e') return { x: W - 26, y: H / 2, facing: 'left' };
  return { x: W / 2, y: H / 2, facing: 'down' };
}

export function facingForDir(dir) {
  return DIR_TO_FACING[dir];
}

export { c as tileCenter };
