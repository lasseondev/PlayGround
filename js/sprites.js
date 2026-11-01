import { COLORS, clamp, rand } from './config.js';

// ---------------------------------------------------------------------------
// Low-level pixel helpers
// ---------------------------------------------------------------------------
export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function shadow(ctx, x, y, rx, ry, alpha = 0.35) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#050408';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function outlineEllipse(ctx, x, y, rx, ry, fill, outline, lw = 2) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = outline;
    ctx.stroke();
  }
}

const HEART_ROWS = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

export function drawPixelHeart(ctx, x, y, scale, color, dark = '#4a1620', empty = false) {
  for (let row = 0; row < HEART_ROWS.length; row++) {
    for (let col = 0; col < 7; col++) {
      if (HEART_ROWS[row][col] !== 'X') continue;
      const px = x + col * scale;
      const py = y + row * scale;
      ctx.fillStyle = empty ? 'rgba(255,255,255,0.09)' : row < 2 ? color : row > 3 ? dark : color;
      ctx.fillRect(px, py, scale, scale);
    }
  }
  if (!empty) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(x + scale, y + scale, scale, scale);
  }
}

export function drawKeyIcon(ctx, x, y, scale = 1, color = COLORS.gold, glow = false) {
  if (glow) {
    const g = ctx.createRadialGradient(x + 9 * scale, y + 6 * scale, 0, x + 9 * scale, y + 6 * scale, 16 * scale);
    g.addColorStop(0, 'rgba(255,220,120,0.45)');
    g.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 10 * scale, y - 12 * scale, 38 * scale, 36 * scale);
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#3a2a10';
  // bow
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(4.5, 5, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3a2a10';
  ctx.beginPath();
  ctx.arc(4.5, 5, 1.7, 0, Math.PI * 2);
  ctx.fill();
  // shaft
  ctx.fillStyle = color;
  ctx.fillRect(7.5, 3.9, 9.5, 2.2);
  ctx.strokeRect(7.5, 3.9, 9.5, 2.2);
  // teeth
  ctx.fillRect(12.5, 6, 1.8, 4.6);
  ctx.fillRect(15.8, 6, 1.8, 3.4);
  // highlight
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(8.5, 3.9, 6.5, 0.8);
  ctx.restore();
}

export function drawBossKeyIcon(ctx, x, y, scale = 1, glow = true) {
  if (glow) {
    const g = ctx.createRadialGradient(x + 10 * scale, y + 10 * scale, 0, x + 10 * scale, y + 10 * scale, 22 * scale);
    g.addColorStop(0, 'rgba(255,200,90,0.5)');
    g.addColorStop(0.5, 'rgba(255,120,80,0.15)');
    g.addColorStop(1, 'rgba(255,120,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 14 * scale, y - 14 * scale, 48 * scale, 48 * scale);
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  // ornate skull-ish bow
  ctx.fillStyle = COLORS.gold;
  ctx.strokeStyle = '#2a1c08';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(2, 8);
  ctx.lineTo(2, 4);
  ctx.quadraticCurveTo(2, 0, 6, 0);
  ctx.quadraticCurveTo(10, 0, 10, 4);
  ctx.lineTo(10, 8);
  ctx.lineTo(7, 10);
  ctx.lineTo(7, 13);
  ctx.lineTo(5, 13);
  ctx.lineTo(5, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // eye hole
  ctx.fillStyle = '#3a1608';
  ctx.beginPath();
  ctx.arc(6, 4.5, 2.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd66e';
  ctx.fillRect(5.2, 4, 1.6, 1.2);
  // shaft
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(10, 4, 12, 2.8);
  ctx.strokeRect(10, 4, 12, 2.8);
  ctx.fillRect(16, 6.5, 2.4, 5.5);
  ctx.fillRect(20, 6.5, 2.2, 3.5);
  ctx.strokeRect(16, 6.5, 2.4, 5.5);
  ctx.strokeRect(20, 6.5, 2.2, 3.5);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(11, 4.4, 7, 0.8);
  ctx.restore();
}

export function drawSparkle(ctx, x, y, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.24, y - size * 0.24);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.24, y + size * 0.24);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.24, y + size * 0.24);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.24, y - size * 0.24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------
export function drawPlayer(ctx, p, t) {
  const blink = p.invuln > 0 && Math.floor(t * 22) % 2 === 0;
  if (blink) ctx.globalAlpha = 0.5;

  const walking = p.moving;
  const bob = walking ? Math.sin(p.walkTime * 15) * 1 : Math.sin(t * 2.2) * 0.5;
  const x = Math.round(p.x);
  const y = Math.round(p.y + bob);
  const face = p.facing;
  const step = walking ? Math.sin(p.walkTime * 15) : 0;

  shadow(ctx, x, y + 12, 9, 3.2, 0.4);

  // Legs
  const legOff = Math.round(step * 1.5);
  rect(ctx, x - 4, y + 6 + (face === 'up' ? -legOff : legOff), 3, 5, '#17121f');
  rect(ctx, x + 1, y + 6 - (face === 'up' ? -legOff : legOff), 3, 5, '#17121f');
  rect(ctx, x - 4, y + 9 + (face === 'up' ? -legOff : legOff), 3, 2, '#5b3a24');
  rect(ctx, x + 1, y + 9 - (face === 'up' ? -legOff : legOff), 3, 2, '#5b3a24');

  // Back arm / shield
  if (face === 'up' || face === 'right') {
    drawShield(ctx, x - 8, y - 5, face);
  }

  // Torso outline + tunic
  rect(ctx, x - 6, y - 6, 12, 13, '#17121f');
  rect(ctx, x - 5, y - 5, 10, 10, COLORS.greenDark);
  rect(ctx, x - 5, y - 5, 10, 7, COLORS.green);
  rect(ctx, x - 4, y - 5, 8, 2, COLORS.greenLight);
  rect(ctx, x - 5, y + 2, 10, 2, '#6a4325');
  rect(ctx, x - 1, y + 2, 2, 2, COLORS.gold);

  // Arms
  const armY = y - 3;
  if (face === 'left' || face === 'right') {
    rect(ctx, x - 2, armY, 3, 5, COLORS.skinDark);
    rect(ctx, x - 1, armY, 2, 3, COLORS.skin);
  } else {
    rect(ctx, x - 7, armY, 2, 5, COLORS.skinDark);
    rect(ctx, x + 5, armY, 2, 5, COLORS.skinDark);
    rect(ctx, x - 7, armY, 2, 3, COLORS.skin);
    rect(ctx, x + 5, armY, 2, 3, COLORS.skin);
  }

  // Head
  rect(ctx, x - 5, y - 15, 10, 10, '#17121f');
  rect(ctx, x - 4, y - 14, 8, 8, COLORS.skin);
  if (face === 'down') {
    rect(ctx, x - 3, y - 8, 6, 2, COLORS.skinDark);
  }
  // Hair / hood
  rect(ctx, x - 5, y - 16, 10, 4, '#17121f');
  rect(ctx, x - 4, y - 15, 8, 3, COLORS.green);
  rect(ctx, x - 4, y - 14, 8, 2, COLORS.greenLight);
  // pointed cap
  rect(ctx, x + 1, y - 18, 4, 3, '#17121f');
  rect(ctx, x + 1, y - 17, 3, 2, COLORS.green);
  rect(ctx, x + 3, y - 19, 3, 2, '#17121f');
  rect(ctx, x + 3, y - 18, 2, 1, COLORS.greenLight);

  if (face === 'down') {
    // fringe + face
    rect(ctx, x - 4, y - 11, 8, 2, '#d9a94e');
    rect(ctx, x - 3, y - 10, 2, 1, '#d9a94e');
    rect(ctx, x + 2, y - 10, 2, 1, '#d9a94e');
    rect(ctx, x - 2, y - 9, 1, 2, '#201826');
    rect(ctx, x + 1, y - 9, 1, 2, '#201826');
    rect(ctx, x - 1, y - 6, 2, 1, COLORS.skinDark);
    // ears
    rect(ctx, x - 5, y - 9, 1, 2, COLORS.skin);
    rect(ctx, x + 4, y - 9, 1, 2, COLORS.skin);
  } else if (face === 'up') {
    rect(ctx, x - 4, y - 12, 8, 4, COLORS.greenDark);
    rect(ctx, x - 3, y - 13, 6, 2, '#d9a94e');
    rect(ctx, x - 4, y - 9, 8, 1, COLORS.greenDark);
  } else {
    const dir = face === 'left' ? -1 : 1;
    // profile
    rect(ctx, x + dir * 2, y - 9, 2, 2, '#201826');
    rect(ctx, x + dir * 4, y - 8, 1, 2, COLORS.skin);
    rect(ctx, x - 4, y - 12, 6, 3, '#d9a94e');
    rect(ctx, x - 5, y - 8, 2, 2, COLORS.skin);
  }

  // Shield in front
  if (face === 'down' || face === 'left') {
    drawShield(ctx, x - 8, y - 5, face);
  }

  // Idle sword hilt
  if (p.attackTimer <= 0) {
    if (face === 'right') {
      rect(ctx, x + 6, y - 2, 2, 6, '#17121f');
      rect(ctx, x + 6, y - 1, 1, 4, '#c8d2df');
      rect(ctx, x + 5, y + 3, 4, 1, COLORS.gold);
    } else {
      rect(ctx, x + 6, y + 1, 1, 5, '#17121f');
      rect(ctx, x + 6, y + 2, 1, 3, '#c8d2df');
      rect(ctx, x + 5, y, 3, 1, COLORS.gold);
    }
  }

  if (p.attackTimer > 0) drawSwordArc(ctx, p, t);

  ctx.globalAlpha = 1;
}

function drawShield(ctx, x, y, face) {
  ctx.save();
  ctx.translate(x, y);
  if (face === 'left') ctx.scale(-1, 1);
  rect(ctx, 0, 0, 5, 8, '#17121f');
  rect(ctx, 1, 1, 3, 6, '#7b8fa6');
  rect(ctx, 1, 1, 3, 2, '#aebfd2');
  rect(ctx, 2, 3, 1, 3, COLORS.gold);
  ctx.restore();
}

function drawSwordArc(ctx, p, t) {
  const elapsed = p.attackDuration - p.attackTimer;
  const prog = clamp(elapsed / p.attackDuration, 0, 1);
  const base = {
    right: 0,
    down: Math.PI / 2,
    left: Math.PI,
    up: -Math.PI / 2,
  }[p.facing];
  const sweep = 1.9;
  const a = base - sweep / 2 + sweep * prog;
  const x = p.x;
  const y = p.y - 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.lineCap = 'round';
  // after-image
  ctx.globalAlpha = 0.28 * (1 - prog * 0.35);
  ctx.strokeStyle = '#9fe7ff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 17, base - sweep / 2, a);
  ctx.stroke();
  // bright edge
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = '#f4fbff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 18, Math.max(base - sweep / 2, a - 0.55), a);
  ctx.stroke();
  // blade
  const bx = Math.cos(a);
  const by = Math.sin(a);
  ctx.strokeStyle = '#dfe9f5';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(bx * 7, by * 7);
  ctx.lineTo(bx * 21, by * 21);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(bx * 9, by * 9);
  ctx.lineTo(bx * 20, by * 20);
  ctx.stroke();
  // hilt glint
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(bx * 7 - 1.5, by * 7 - 1.5, 3, 3);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Enemies
// ---------------------------------------------------------------------------
export function drawSlime(ctx, e, t) {
  const hop = Math.abs(Math.sin(e.animTime * 4.2)) * 3;
  const squash = e.hop > 0 ? 0.86 : 1 + Math.sin(t * 6 + e.seed) * 0.03;
  const x = e.x;
  const y = e.y - hop;
  shadow(ctx, e.x, e.y + 8, 9, 3, 0.32);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 / Math.max(0.8, squash), squash);
  outlineEllipse(ctx, 0, 0, 9, 8, e.flash > 0 ? '#d8ffe0' : '#4c9e58', '#1a2d1c', 2);
  ctx.globalAlpha = 0.7;
  outlineEllipse(ctx, -3, -3, 3.4, 2.6, '#93df8e', null, 0);
  ctx.globalAlpha = 1;
  // eyes
  rect(ctx, -4, -2, 2, 3, '#121019');
  rect(ctx, 2, -2, 2, 3, '#121019');
  rect(ctx, -4, -2, 1, 1, '#f4f1e8');
  rect(ctx, 2, -2, 1, 1, '#f4f1e8');
  rect(ctx, -1, 3, 2, 1, '#1a2d1c');
  ctx.restore();
}

export function drawBat(ctx, e, t) {
  const flap = Math.sin(t * 16 + e.seed) * 4;
  const x = e.x;
  const y = e.y + Math.sin(t * 4 + e.seed) * 3;
  shadow(ctx, e.x, e.y + 11, 7, 2.4, 0.22);
  ctx.save();
  ctx.translate(x, y);
  // wings
  ctx.fillStyle = e.flash > 0 ? '#e7c9ff' : '#5c3f86';
  ctx.strokeStyle = '#17121f';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(-13, -3 - flap);
  ctx.lineTo(-10, 3);
  ctx.lineTo(-5, 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3, 0);
  ctx.lineTo(13, -3 - flap);
  ctx.lineTo(10, 3);
  ctx.lineTo(5, 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // body
  outlineEllipse(ctx, 0, 0, 5, 5.5, e.flash > 0 ? '#f0dcff' : '#7550a8', '#17121f', 1.5);
  // ears
  ctx.fillStyle = '#5c3f86';
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-3, -9);
  ctx.lineTo(0, -5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(3, -9);
  ctx.lineTo(0, -5);
  ctx.closePath();
  ctx.fill();
  rect(ctx, -2.5, -1, 1.5, 2, '#ffdf6b');
  rect(ctx, 1, -1, 1.5, 2, '#ffdf6b');
  ctx.restore();
}

export function drawSkeleton(ctx, e, t) {
  const x = Math.round(e.x);
  const y = Math.round(e.y);
  const bob = Math.sin(t * 5 + e.seed) * 1;
  shadow(ctx, x, y + 12, 8, 3, 0.3);
  ctx.save();
  ctx.translate(x, y + bob);
  const bone = e.flash > 0 ? '#ffffff' : COLORS.bone;
  // legs
  rect(ctx, -4, 6, 3, 6, '#17121f');
  rect(ctx, 1, 6, 3, 6, '#17121f');
  rect(ctx, -4, 7, 2, 4, bone);
  rect(ctx, 2, 7, 2, 4, bone);
  // ribcage
  rect(ctx, -5, -4, 10, 10, '#17121f');
  rect(ctx, -4, -4, 8, 8, '#3b3540');
  rect(ctx, -4, -4, 8, 2, bone);
  rect(ctx, -3, -1, 6, 1, bone);
  rect(ctx, -3, 1, 6, 1, bone);
  rect(ctx, -2, 3, 4, 1, bone);
  // arms
  rect(ctx, -7, -3, 2, 6, bone);
  rect(ctx, 5, -3, 2, 6, bone);
  // skull
  rect(ctx, -5, -14, 10, 9, '#17121f');
  rect(ctx, -4, -13, 8, 7, bone);
  rect(ctx, -3, -10, 2, 2, '#1a1420');
  rect(ctx, 1, -10, 2, 2, '#1a1420');
  rect(ctx, -1, -7, 2, 1, '#1a1420');
  rect(ctx, -4, -13, 8, 1, '#f1ecdd');
  // bow
  ctx.strokeStyle = '#7a4a2a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(7, -1, 6, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.strokeStyle = '#cfc6ae';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(7, -7);
  ctx.lineTo(7, 5);
  ctx.stroke();
  if (e.shootTimer > 1.4) {
    ctx.strokeStyle = '#e8dcc0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(7, -1);
    ctx.lineTo(13, -1);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawWarden(ctx, e, t) {
  const x = Math.round(e.x);
  const y = Math.round(e.y);
  const shake = e.state === 'telegraph' ? Math.sin(t * 60) * 1.5 : 0;
  shadow(ctx, x, y + 17, 15, 4.5, 0.42);
  ctx.save();
  ctx.translate(x + shake, y);
  const flash = e.flash > 0;
  const steel = flash ? '#ffffff' : '#5c6175';
  const steelDark = flash ? '#e0e0e0' : '#343848';
  const gold = '#c8a44a';
  // legs
  rect(ctx, -8, 8, 6, 10, '#17121f');
  rect(ctx, 2, 8, 6, 10, '#17121f');
  rect(ctx, -7, 9, 4, 8, steelDark);
  rect(ctx, 3, 9, 4, 8, steelDark);
  // body
  rect(ctx, -11, -8, 22, 18, '#17121f');
  rect(ctx, -10, -7, 20, 16, steelDark);
  rect(ctx, -9, -7, 18, 4, steel);
  rect(ctx, -9, 4, 18, 3, gold);
  rect(ctx, -2, -6, 4, 12, '#232631');
  // pauldrons
  rect(ctx, -15, -7, 6, 6, '#17121f');
  rect(ctx, 9, -7, 6, 6, '#17121f');
  rect(ctx, -14, -6, 4, 4, steel);
  rect(ctx, 10, -6, 4, 4, steel);
  // head / helm
  rect(ctx, -8, -20, 16, 12, '#17121f');
  rect(ctx, -7, -19, 14, 10, steel);
  rect(ctx, -7, -19, 14, 3, '#7b8299');
  rect(ctx, -5, -13, 10, 2, '#101018');
  const eyeGlow = e.state === 'telegraph' ? '#ffd25a' : '#ff5a4a';
  rect(ctx, -4, -13, 3, 2, eyeGlow);
  rect(ctx, 1, -13, 3, 2, eyeGlow);
  // horns
  ctx.fillStyle = '#c8b18a';
  ctx.beginPath();
  ctx.moveTo(-7, -19);
  ctx.lineTo(-12, -25);
  ctx.lineTo(-9, -18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(7, -19);
  ctx.lineTo(12, -25);
  ctx.lineTo(9, -18);
  ctx.closePath();
  ctx.fill();
  // shield
  rect(ctx, -21, -6, 8, 15, '#17121f');
  rect(ctx, -20, -5, 6, 13, '#6f4b2c');
  rect(ctx, -19, -4, 4, 11, '#8d6338');
  rect(ctx, -18, 0, 2, 4, gold);
  // mace
  rect(ctx, 13, -5, 3, 16, '#5b3a24');
  rect(ctx, 11, -12, 7, 7, '#17121f');
  rect(ctx, 12, -11, 5, 5, steel);
  rect(ctx, 13, -10, 3, 3, gold);
  if (e.state === 'telegraph') {
    ctx.globalAlpha = 0.25 + Math.sin(t * 30) * 0.12;
    ctx.strokeStyle = '#ff7b5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24 + Math.sin(t * 20) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (e.state === 'stunned') {
    for (let i = 0; i < 3; i++) {
      const a = t * 4 + (i * Math.PI * 2) / 3;
      drawSparkle(ctx, Math.cos(a) * 13, -23 + Math.sin(a) * 4, 2.2, '#ffe28a', 0.9);
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Boss — the Hollow Eye
// ---------------------------------------------------------------------------
export function drawBoss(ctx, b, t, player) {
  const x = b.x;
  const y = b.y + Math.sin(t * 2.2) * 3;
  const exposed = b.exposed > 0;
  const phase = b.phase;
  const flash = b.flash > 0;

  shadow(ctx, b.x, b.y + 34, 34, 9, 0.45);

  // tendrils
  ctx.save();
  ctx.strokeStyle = '#241a33';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const off = (i - 1.5) * 15;
    const wob = Math.sin(t * 3 + i * 1.7) * 6;
    ctx.beginPath();
    ctx.moveTo(x + off * 0.6, y + 20);
    ctx.quadraticCurveTo(x + off + wob, y + 36, x + off * 1.3 - wob * 0.5, y + 45);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  const pulse = 1 + Math.sin(t * 3) * 0.02;
  ctx.scale(pulse, pulse);

  // outer armored shell
  ctx.fillStyle = flash ? '#f4eaff' : '#2a2038';
  ctx.strokeStyle = '#100c16';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 39 : 32;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r * 0.86;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // inner shell ring
  outlineEllipse(ctx, 0, 0, 30, 26, flash ? '#d9c4ff' : '#352a48', '#15101e', 2.5);

  const plateColor = phase === 1 ? '#3a2c52' : phase === 2 ? '#47263d' : '#4d2330';
  const trim = phase === 1 ? '#8f76c9' : '#c06a7a';

  // four plates
  const open = exposed ? clamp(b.exposeAmount, 0, 1) : 0;
  const plateDist = 4 + open * 17;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const px = Math.cos(a) * plateDist;
    const py = Math.sin(a) * plateDist;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a);
    ctx.fillStyle = plateColor;
    ctx.strokeStyle = '#100c16';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -13);
    ctx.lineTo(12, -9);
    ctx.lineTo(15, 6);
    ctx.lineTo(0, 13);
    ctx.lineTo(-13, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-9, -6);
    ctx.lineTo(7, -3);
    ctx.lineTo(9, 6);
    ctx.stroke();
    ctx.restore();
  }

  // eye
  const eyeR = 18;
  const eyeOpen = exposed ? 1 : 0.06;
  ctx.save();
  ctx.scale(1, eyeOpen);
  outlineEllipse(ctx, 0, 0, eyeR, eyeR * 0.92, flash ? '#ffffff' : '#e8ddc8', '#1a1420', 2);
  // iris tracks the player
  let dx = 0;
  let dy = 0;
  if (player) {
    const d = Math.hypot(player.x - b.x, player.y - b.y) || 1;
    dx = ((player.x - b.x) / d) * 4;
    dy = ((player.y - b.y) / d) * 3;
  }
  const irisColor = exposed ? (phase >= 2 ? '#ff4a3d' : '#ff6a3d') : '#7a2a2a';
  outlineEllipse(ctx, dx, dy, 9, 9, irisColor, '#3a0d10', 1.5);
  outlineEllipse(ctx, dx, dy, 4.2, 4.6, '#120a12', null, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.arc(dx - 3, dy - 3, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // closed lid seam when armored
  if (!exposed) {
    ctx.strokeStyle = '#100c16';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.quadraticCurveTo(0, 5, 22, 0);
    ctx.stroke();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-17, 0.5);
    ctx.quadraticCurveTo(0, 3.6, 17, 0.5);
    ctx.stroke();
  }

  // phase glow
  ctx.globalAlpha = 0.22 + Math.sin(t * 4) * 0.06;
  ctx.fillStyle = phase >= 2 ? '#ff3b4a' : '#9a5bff';
  ctx.beginPath();
  ctx.arc(0, 0, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (b.stunned > 0) {
    for (let i = 0; i < 4; i++) {
      const a = t * 3 + (i * Math.PI) / 2;
      drawSparkle(ctx, Math.cos(a) * 30, -34 + Math.sin(a) * 5, 2.6, '#ffe28a', 0.9);
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Props / items / effects
// ---------------------------------------------------------------------------
export function drawChest(ctx, chest, t) {
  if (chest.hidden) return;
  const x = Math.round(chest.x);
  const y = Math.round(chest.y);
  const opened = chest.opened;
  shadow(ctx, x, y + 9, 10, 3, 0.35);
  // body
  rect(ctx, x - 9, y - 6, 18, 15, '#17121f');
  rect(ctx, x - 8, y - 5, 16, 13, '#6b4326');
  rect(ctx, x - 8, y - 5, 16, 3, '#8a5a32');
  rect(ctx, x - 8, y + 3, 16, 2, '#c8a44a');
  rect(ctx, x - 2, y + 1, 4, 6, '#d8b45a');
  rect(ctx, x - 1, y + 3, 2, 2, '#3a2a10');
  if (opened) {
    // open lid
    ctx.save();
    ctx.translate(x, y - 5);
    ctx.rotate(-0.55);
    rect(ctx, -9, -5, 18, 6, '#17121f');
    rect(ctx, -8, -4, 16, 4, '#7a4a2a');
    rect(ctx, -8, -4, 16, 1, '#a06a3a');
    rect(ctx, -8, -1, 16, 1, '#c8a44a');
    ctx.restore();
    const g = ctx.createRadialGradient(x, y - 4, 0, x, y - 4, 22);
    g.addColorStop(0, 'rgba(255,220,120,0.4)');
    g.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 24, y - 28, 48, 48);
    if (chest.content !== 'heartContainer' && chest.content !== 'key' && chest.content !== 'bossKey') {
      drawSparkle(ctx, x + Math.sin(t * 2) * 4, y - 6, 2.4, '#ffe28a', 0.8);
    }
  } else {
    // locked bands
    rect(ctx, x - 8, y - 6, 2, 14, '#c8a44a');
    rect(ctx, x + 6, y - 6, 2, 14, '#c8a44a');
    rect(ctx, x - 9, y - 7, 18, 2, '#3a2a10');
  }
}

export function drawPot(ctx, pot, t) {
  if (pot.broken) return;
  const x = Math.round(pot.x);
  const y = Math.round(pot.y);
  shadow(ctx, x, y + 7, 6, 2.5, 0.32);
  rect(ctx, x - 5, y - 5, 10, 12, '#17121f');
  rect(ctx, x - 4, y - 4, 8, 10, '#4a6170');
  rect(ctx, x - 4, y - 4, 8, 2, '#7d98a8');
  rect(ctx, x - 5, y - 6, 10, 3, '#2f414c');
  rect(ctx, x - 3, y - 2, 2, 5, '#66808f');
  rect(ctx, x + 1, y + 1, 2, 3, '#344a56');
  ctx.fillStyle = '#c8a44a';
  ctx.fillRect(x - 2, y - 1, 4, 1);
}

export function drawSign(ctx, sign) {
  const x = Math.round(sign.x);
  const y = Math.round(sign.y);
  shadow(ctx, x, y + 8, 7, 2.4, 0.3);
  rect(ctx, x - 1, y - 2, 3, 11, '#5b3a24');
  rect(ctx, x - 1, y - 2, 1, 10, '#7a4f31');
  rect(ctx, x - 8, y - 12, 16, 11, '#17121f');
  rect(ctx, x - 7, y - 11, 14, 9, '#8a5a32');
  rect(ctx, x - 6, y - 10, 12, 1, '#b07a45');
  rect(ctx, x - 6, y - 7, 9, 1, '#5b3a24');
  rect(ctx, x - 6, y - 5, 11, 1, '#5b3a24');
}

export function drawFlame(ctx, x, y, t, seed = 0, scale = 1) {
  const flick = Math.sin(t * 13 + seed * 7) * 0.5 + Math.sin(t * 7.3 + seed) * 0.5;
  const h = (8 + flick * 2) * scale;
  const w = (4.4 + flick * 0.6) * scale;
  // glow
  const g = ctx.createRadialGradient(x, y - h * 0.4, 0, x, y - h * 0.4, 26 * scale);
  g.addColorStop(0, 'rgba(255,170,70,0.34)');
  g.addColorStop(0.45, 'rgba(255,120,40,0.12)');
  g.addColorStop(1, 'rgba(255,100,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - 30 * scale, y - 32 * scale, 60 * scale, 50 * scale);
  ctx.save();
  ctx.translate(x, y);
  // outer
  ctx.fillStyle = '#ff6a2e';
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.quadraticCurveTo(w, -h * 0.45, w * 0.6, 1);
  ctx.quadraticCurveTo(0, 4, -w * 0.6, 1);
  ctx.quadraticCurveTo(-w, -h * 0.45, 0, -h);
  ctx.fill();
  // inner
  ctx.fillStyle = '#ffcf5e';
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.65);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.25, w * 0.3, 1);
  ctx.quadraticCurveTo(0, 2, -w * 0.3, 1);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.25, 0, -h * 0.65);
  ctx.fill();
  // core
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath();
  ctx.ellipse(0, -1, w * 0.18, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawTorchBracket(ctx, x, y, dir) {
  ctx.save();
  ctx.translate(x, y);
  if (dir === 'e') ctx.rotate(-Math.PI / 2);
  if (dir === 's') ctx.rotate(Math.PI);
  if (dir === 'w') ctx.rotate(Math.PI / 2);
  rect(ctx, -2, 0, 4, 7, '#17121f');
  rect(ctx, -1, 1, 2, 5, '#5a5a6e');
  rect(ctx, -4, 5, 8, 3, '#17121f');
  rect(ctx, -3, 6, 6, 1, '#8a8a9e');
  rect(ctx, -4, 0, 8, 2, '#3a3a4a');
  ctx.restore();
}

export function drawPickup(ctx, p, t) {
  const y = p.y + Math.sin(t * 5 + p.seed) * 2;
  if (p.kind === 'heart') {
    const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, 12);
    g.addColorStop(0, 'rgba(255,90,110,0.35)');
    g.addColorStop(1, 'rgba(255,90,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(p.x - 14, y - 14, 28, 28);
    drawPixelHeart(ctx, p.x - 5, y - 6, 1.5, '#ff5a6e', '#8a1f30');
  } else if (p.kind === 'key') {
    drawKeyIcon(ctx, p.x - 8, y - 8, 1, COLORS.gold, true);
  } else if (p.kind === 'bossKey') {
    drawBossKeyIcon(ctx, p.x - 10, y - 10, 1.1, true);
  }
}

export function drawProjectile(ctx, pr, t) {
  if (pr.kind === 'arrow') {
    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(Math.atan2(pr.vy, pr.vx));
    ctx.fillStyle = '#17121f';
    ctx.fillRect(-7, -1.5, 14, 3);
    ctx.fillStyle = '#cfc6ae';
    ctx.fillRect(-6, -1, 10, 2);
    ctx.fillStyle = '#e8dcc0';
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(3, -3);
    ctx.lineTo(3, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#8a5a32';
    ctx.fillRect(-6, -2.5, 3, 5);
    ctx.restore();
  } else if (pr.kind === 'orb') {
    const g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, pr.r * 3.4);
    g.addColorStop(0, 'rgba(255,220,255,0.85)');
    g.addColorStop(0.3, 'rgba(200,90,255,0.6)');
    g.addColorStop(1, 'rgba(120,40,180,0)');
    ctx.fillStyle = g;
    ctx.fillRect(pr.x - pr.r * 4, pr.y - pr.r * 4, pr.r * 8, pr.r * 8);
    outlineEllipse(ctx, pr.x, pr.y, pr.r, pr.r, '#d79bff', '#4a1760', 1);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(pr.x - pr.r * 0.3, pr.y - pr.r * 0.3, pr.r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (pr.kind === 'shock') {
    const a = clamp(pr.life / pr.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = a * 0.9;
    ctx.strokeStyle = '#ffb35a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = a * 0.35;
    ctx.strokeStyle = '#fff2c8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, pr.r - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (pr.kind === 'rock') {
    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(pr.spin || 0);
    ctx.fillStyle = '#6b5a52';
    ctx.strokeStyle = '#241c20';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(4, -5);
    ctx.lineTo(6, 2);
    ctx.lineTo(1, 6);
    ctx.lineTo(-5, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export function drawParticle(ctx, p) {
  const a = clamp(p.life / p.maxLife, 0, 1);
  ctx.save();
  ctx.globalAlpha = a * (p.alpha ?? 1);
  if (p.kind === 'spark') {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  } else if (p.kind === 'dust') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1.2 - a * 0.3), 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === 'ring') {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1.6 - a), 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.kind === 'shard') {
    ctx.fillStyle = p.color;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot || 0);
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }
  ctx.restore();
}

export function drawEmber(ctx, x, y, size, alpha, color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
