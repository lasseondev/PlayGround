export const FIELD = {
  halfX: 60,
  halfZ: 40,
  goalHalfZ: 12,
  goalHeight: 9,
  goalDepth: 8,
  wallHeight: 13,
  ballRadius: 2.05,
  ceiling: 30,
};

export const CAR = {
  halfLength: 2.65,
  halfWidth: 1.35,
  halfHeight: 0.95,
  groundY: 0.95,
  mass: 1,
  maxSpeed: 39,
  boostSpeed: 55,
  boostDrain: 33,
  boostAccel: 44,
  drag: 0.32,
  grip: 9.5,
  jumpSpeed: 13.5,
  gravity: 30,
};

export const COLORS = {
  blue: 0x24d7ff,
  blueDeep: 0x087e9c,
  orange: 0xff7a18,
  orangeDeep: 0xa33e00,
  white: 0xeafcff,
  ink: 0x040a10,
  pitch: 0x071b20,
  neon: 0x5ce8ff,
  gold: 0xffd166,
};

export const TEAM_NAMES = { blue: 'BLUE', orange: 'ORANGE' };

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

export function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}
