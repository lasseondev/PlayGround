// Shared constants and tiny math helpers.
export const W = 512;
export const H = 288;
export const TILE = 16;
export const COLS = 32;
export const ROWS = 18;

export const DOOR_CENTER = {
  n: { x: W / 2, y: 10 },
  s: { x: W / 2, y: H - 10 },
  w: { x: 10, y: H / 2 },
  e: { x: W - 10, y: H / 2 },
};

export const DIR_VEC = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE = { n: 's', s: 'n', e: 'w', w: 'e' };
export const DIR_TO_FACING = { n: 'up', s: 'down', e: 'right', w: 'left' };
export const FACING_TO_DOOR = { up: 'n', down: 's', left: 'w', right: 'e' };

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

export function hash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

export function aabb(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function circleRect(cx, cy, r, rx, ry, rw, rh) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  return (cx - nx) ** 2 + (cy - ny) ** 2 <= r * r;
}

export const COLORS = {
  ink: '#0b0910',
  outline: '#17121f',
  floor: '#1e1c2c',
  floorLight: '#28263a',
  floorDark: '#141320',
  grout: '#12111c',
  wall: '#2d2a42',
  wallLight: '#4a4665',
  wallDark: '#191724',
  gold: '#d8b45a',
  goldLight: '#f5df95',
  goldDark: '#8a6a2a',
  red: '#c9443f',
  redDark: '#7d242c',
  green: '#3f9b57',
  greenLight: '#6cc47a',
  greenDark: '#26653a',
  skin: '#f0c79b',
  skinDark: '#c58f66',
  bone: '#ded8c6',
  purple: '#7a5bb5',
  purpleLight: '#b58cff',
  teal: '#4fb9b0',
  white: '#f4f1e8',
};

export const FONT = '"Courier New", Courier, monospace';
