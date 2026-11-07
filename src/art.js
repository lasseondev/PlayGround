// Procedural artwork. Everything is drawn with canvas — no external images.
import { TAU, clamp, lerp, rnd, mulberry32, pick } from './core.js';

const glowCache = new Map();
function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const r = Math.round(lerp(ar, br, t)), g = Math.round(lerp(ag, bg, t)), bl = Math.round(lerp(ab, bb, t));
  return `rgb(${r},${g},${bl})`;
}
function rgba(hex, a) {
  const p = parseInt(hex.slice(1), 16);
  return `rgba(${(p >> 16) & 255},${(p >> 8) & 255},${p & 255},${a})`;
}
export { mixHex, rgba };

export function glowSprite(color, size = 96) {
  const key = color + size;
  if (glowCache.has(key)) return glowCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, rgba(color, 0.85));
  grd.addColorStop(0.28, rgba(color, 0.35));
  grd.addColorStop(0.62, rgba(color, 0.1));
  grd.addColorStop(1, rgba(color, 0));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  glowCache.set(key, c);
  return c;
}
export function drawGlow(ctx, color, x, y, radius, alpha = 1) {
  const s = glowSprite(color);
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = prev * alpha;
  ctx.drawImage(s, x - radius, y - radius, radius * 2, radius * 2);
  ctx.globalAlpha = prev;
}

// ============================================================
//  ROOM FLOOR
// ============================================================
export function buildFloor(biome, seed, W, H) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const R = mulberry32(seed);
  const wall = 74;

  // base
  let base = g.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, biome.floor);
  base.addColorStop(0.55, mixHex(biome.floor, biome.floor2, 0.45));
  base.addColorStop(1, biome.floor2);
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  // flagstones
  const size = 104;
  for (let y = wall; y < H - wall; y += size) {
    const rowOff = ((y / size) | 0) % 2 ? size * 0.5 : 0;
    for (let x = wall; x < W - wall; x += size) {
      const jx = (R() - 0.5) * 6, jy = (R() - 0.5) * 6;
      const w = size - 7 + (R() - 0.5) * 8, h = size - 7 + (R() - 0.5) * 8;
      const t = R();
      g.fillStyle = mixHex(biome.floor, biome.floor2, 0.18 + t * 0.68);
      g.beginPath();
      const px = x + rowOff + jx, py = y + jy;
      g.moveTo(px + 3, py);
      g.lineTo(px + w - 3, py);
      g.quadraticCurveTo(px + w, py, px + w, py + 3);
      g.lineTo(px + w, py + h - 3);
      g.quadraticCurveTo(px + w, py + h, px + w - 3, py + h);
      g.lineTo(px + 3, py + h);
      g.quadraticCurveTo(px, py + h, px, py + h - 3);
      g.lineTo(px, py + 3);
      g.quadraticCurveTo(px, py, px + 3, py);
      g.fill();
      // bevel
      g.strokeStyle = rgba('#ffffff', 0.028 + R() * 0.03);
      g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(px + 4, py + 2); g.lineTo(px + w - 4, py + 2); g.stroke();
      // speckles
      const n = 3 + ((R() * 5) | 0);
      for (let i = 0; i < n; i++) {
        g.fillStyle = rgba(R() > 0.5 ? biome.detail : '#000000', 0.12 + R() * 0.22);
        const sx = px + R() * w, sy = py + R() * h;
        g.fillRect(sx, sy, 1 + R() * 2.2, 1 + R() * 1.4);
      }
      if (R() < 0.11) {
        // crack
        g.strokeStyle = rgba('#000000', 0.32);
        g.lineWidth = 1.1;
        g.beginPath();
        let cx = px + R() * w, cy = py + R() * h;
        g.moveTo(cx, cy);
        for (let k = 0; k < 3; k++) { cx += (R() - 0.5) * 26; cy += (R() - 0.5) * 26; g.lineTo(cx, cy); }
        g.stroke();
      }
    }
  }

  // large dark stains
  for (let i = 0; i < 26; i++) {
    const x = wall + R() * (W - wall * 2), y = wall + R() * (H - wall * 2);
    const r = 40 + R() * 150;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, rgba('#000000', 0.1 + R() * 0.1));
    grd.addColorStop(1, rgba('#000000', 0));
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }

  // central sigil
  const cx = W / 2, cy = H / 2;
  g.save();
  g.translate(cx, cy);
  g.strokeStyle = rgba(biome.rune, 0.2);
  g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 280, 0, TAU); g.stroke();
  g.beginPath(); g.arc(0, 0, 252, 0, TAU); g.stroke();
  g.lineWidth = 1;
  g.beginPath(); g.arc(0, 0, 300, 0, TAU); g.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    g.save(); g.rotate(a);
    g.strokeStyle = rgba(biome.rune, i % 3 === 0 ? 0.32 : 0.14);
    g.beginPath(); g.moveTo(252, 0); g.lineTo(280, 0); g.stroke();
    if (i % 3 === 0) { g.beginPath(); g.moveTo(266, -8); g.lineTo(274, 0); g.lineTo(266, 8); g.stroke(); }
    g.restore();
  }
  // inner rune star
  g.strokeStyle = rgba(biome.rune, 0.22);
  g.lineWidth = 1.6;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    const r2 = i % 2 ? 130 : 220;
    const x = Math.cos(a) * r2, y = Math.sin(a) * r2;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath(); g.stroke();
  g.fillStyle = rgba(biome.rune, 0.28);
  g.beginPath(); g.arc(0, 0, 5, 0, TAU); g.fill();
  g.restore();

  // biome details
  if (biome.id === 'asphodel') {
    for (let i = 0; i < 12; i++) {
      let x = wall + 80 + R() * (W - wall * 2 - 160);
      let y = wall + 80 + R() * (H - wall * 2 - 160);
      g.strokeStyle = rgba('#ff7a35', 0.55);
      g.lineWidth = 2.4;
      g.shadowColor = '#ff6a2a'; g.shadowBlur = 18;
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (R() - 0.5) * 90; y += (R() - 0.5) * 90; g.lineTo(x, y); }
      g.stroke();
      g.shadowBlur = 0;
      g.strokeStyle = rgba('#ffd28a', 0.5); g.lineWidth = 0.9; g.stroke();
    }
  } else if (biome.id === 'elysium') {
    for (let i = 0; i < 9; i++) {
      const x = wall + R() * (W - wall * 2), y = wall + R() * (H - wall * 2);
      g.strokeStyle = rgba('#e8c987', 0.1 + R() * 0.12);
      g.lineWidth = 1 + R() * 2;
      g.beginPath();
      let px = x, py = y;
      g.moveTo(px, py);
      for (let k = 0; k < 4; k++) { px += (R() - 0.5) * 120; py += (R() - 0.5) * 120; g.lineTo(px, py); }
      g.stroke();
    }
    // laurel mosaic
    for (let i = 0; i < 46; i++) {
      const a = R() * TAU, rr = 330 + R() * 50;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.62;
      g.fillStyle = rgba('#e6c079', 0.12 + R() * 0.15);
      g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2);
      g.beginPath(); g.ellipse(0, 0, 8, 3, 0, 0, TAU); g.fill(); g.restore();
    }
  } else if (biome.id === 'styx') {
    for (let i = 0; i < 60; i++) {
      const x = wall + R() * (W - wall * 2), y = wall + R() * (H - wall * 2);
      g.fillStyle = rgba('#8fd6ff', 0.05 + R() * 0.12);
      const w = 10 + R() * 60;
      g.fillRect(x, y, w, 1);
    }
    for (let i = 0; i < 7; i++) {
      const x = wall + 90 + R() * (W - wall * 2 - 180), y = wall + 90 + R() * (H - wall * 2 - 180);
      const rr = 30 + R() * 60;
      const grd = g.createRadialGradient(x, y, 0, x, y, rr);
      grd.addColorStop(0, rgba('#4ba6e6', 0.2)); grd.addColorStop(1, rgba('#4ba6e6', 0));
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
    }
  } else {
    // tartarus crystals
    for (let i = 0; i < 20; i++) {
      const x = wall + 30 + R() * (W - wall * 2 - 60), y = wall + 30 + R() * (H - wall * 2 - 60);
      g.fillStyle = rgba(biome.glow, 0.05 + R() * 0.1);
      g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + 5, y); g.lineTo(x, y + 12); g.lineTo(x - 5, y); g.fill();
    }
  }

  // scattered bones / pebbles
  for (let i = 0; i < 38; i++) {
    const x = wall + 30 + R() * (W - wall * 2 - 60), y = wall + 30 + R() * (H - wall * 2 - 60);
    g.strokeStyle = rgba('#cbbda6', 0.1 + R() * 0.16);
    g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + R() * 12, y + (R() - 0.5) * 6); g.stroke();
  }

  // ---- walls ----
  g.fillStyle = biome.wall;
  g.fillRect(0, 0, W, wall);
  g.fillRect(0, H - wall, W, wall);
  g.fillRect(0, 0, wall, H);
  g.fillRect(W - wall, 0, wall, H);
  const blockW = 112;
  for (let side = 0; side < 4; side++) {
    const horizontal = side < 2;
    const len = horizontal ? W : H;
    for (let i = 0; i < len; i += blockW) {
      const bw = blockW - 4, bh = wall - 6;
      let x, y;
      if (side === 0) { x = i; y = 3; }
      else if (side === 1) { x = i; y = H - wall + 3; }
      else if (side === 2) { x = 3; y = i; }
      else { x = W - wall + 3; y = i; }
      const shade = 0.2 + R() * 0.5;
      g.fillStyle = mixHex(biome.wall, biome.wall2, shade);
      if (horizontal) {
        g.fillRect(x, y, bw, bh);
        g.fillStyle = rgba('#ffffff', 0.035); g.fillRect(x, y, bw, 2);
        g.fillStyle = rgba('#000000', 0.35); g.fillRect(x, y + bh - 2, bw, 2);
      } else {
        g.fillRect(x, y, bh, bw);
        g.fillStyle = rgba('#ffffff', 0.035); g.fillRect(x, y, 2, bw);
        g.fillStyle = rgba('#000000', 0.35); g.fillRect(x + bh - 2, y, 2, bw);
      }
    }
  }
  // wall inner shadow onto floor
  const shadows = [
    [0, wall, W, 46, 0, 1], [0, H - wall - 46, W, 46, 0, -1],
    [wall, 0, 46, H, 1, 0], [W - wall - 46, 0, 46, H, -1, 0],
  ];
  for (const [x, y, w, h, dx, dy] of shadows) {
    const grd = dx ? g.createLinearGradient(x + (dx > 0 ? 0 : w), y, x + (dx > 0 ? w : 0), y)
      : g.createLinearGradient(x, y + (dy > 0 ? 0 : h), x, y + (dy > 0 ? h : 0));
    grd.addColorStop(0, 'rgba(0,0,0,.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(x, y, w, h);
  }
  // gold inlay line along inner wall
  g.strokeStyle = rgba('#d8b06a', 0.2);
  g.lineWidth = 2;
  g.strokeRect(wall + 15, wall + 15, W - wall * 2 - 30, H - wall * 2 - 30);
  g.strokeStyle = rgba(biome.rune, 0.18);
  g.lineWidth = 1;
  g.strokeRect(wall + 23, wall + 23, W - wall * 2 - 46, H - wall * 2 - 46);

  return c;
}

// ============================================================
//  ROOM PROPS
// ============================================================
export function drawPillar(ctx, p, biome, t) {
  const { x, y, r } = p;
  ctx.save();
  ctx.translate(x, y);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.beginPath(); ctx.ellipse(6, 6, r * 1.35, r * 0.5, 0, 0, TAU); ctx.fill();
  // base
  ctx.fillStyle = mixHex(biome.wall, '#000000', 0.45);
  ctx.beginPath(); ctx.ellipse(0, 0, r * 1.25, r * 0.5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(biome.wall2, '#ffffff', 0.08);
  ctx.beginPath(); ctx.ellipse(-2, -5, r * 1.1, r * 0.42, 0, 0, TAU); ctx.fill();
  // shaft
  const grd = ctx.createLinearGradient(-r, 0, r, 0);
  grd.addColorStop(0, mixHex(biome.wall, '#000000', 0.55));
  grd.addColorStop(0.35, biome.wall2);
  grd.addColorStop(0.55, mixHex(biome.wall2, '#ffffff', 0.1));
  grd.addColorStop(1, mixHex(biome.wall, '#000000', 0.6));
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(-r * 0.82, -4); ctx.lineTo(-r * 0.7, -r * 3.5);
  ctx.lineTo(r * 0.7, -r * 3.5); ctx.lineTo(r * 0.82, -4);
  ctx.closePath(); ctx.fill();
  // flutes
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(i * r * 0.26, -8); ctx.lineTo(i * r * 0.22, -r * 3.4); ctx.stroke();
  }
  // capital
  ctx.fillStyle = mixHex(biome.wall2, '#ffffff', 0.12);
  ctx.fillRect(-r * 0.95, -r * 3.85, r * 1.9, r * 0.4);
  ctx.fillStyle = mixHex(biome.wall, '#000000', 0.3);
  ctx.fillRect(-r * 0.95, -r * 3.5, r * 1.9, r * 0.14);
  // rune
  ctx.strokeStyle = rgba(biome.glow, 0.5 + Math.sin(t * 2 + x) * 0.15);
  ctx.lineWidth = 1.5; ctx.shadowColor = biome.glow; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, -r * 2.7); ctx.lineTo(r * 0.3, -r * 2.2); ctx.lineTo(0, -r * 1.7); ctx.lineTo(-r * 0.3, -r * 2.2);
  ctx.closePath(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}
export function drawRubble(ctx, p, biome) {
  const { x, y, r } = p;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.beginPath(); ctx.ellipse(4, 4, r * 1.4, r * 0.55, 0, 0, TAU); ctx.fill();
  const R = mulberry32((x * 13 + y * 7) | 0);
  for (let i = 0; i < 6; i++) {
    const a = R() * TAU, rr = R() * r * 0.8;
    const s = r * (0.25 + R() * 0.5);
    ctx.fillStyle = mixHex(biome.wall2, biome.floor2, R());
    ctx.save(); ctx.translate(Math.cos(a) * rr, Math.sin(a) * rr * 0.5); ctx.rotate(R() * TAU);
    ctx.beginPath();
    ctx.moveTo(-s, s * 0.4); ctx.lineTo(-s * 0.5, -s * 0.7); ctx.lineTo(s * 0.6, -s * 0.5); ctx.lineTo(s, s * 0.5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(-s * 0.4, -s * 0.6, s * 0.7, 1.5);
    ctx.restore();
  }
  ctx.restore();
}
export function drawBrazier(ctx, p, color, t) {
  const { x, y } = p;
  ctx.save(); ctx.translate(x, y);
  const flick = 0.85 + Math.sin(t * 9 + x) * 0.1 + Math.sin(t * 17 + x * 2) * 0.05;
  drawGlow(ctx, color, 0, -46, 80 * flick, 0.5);
  // bowl
  ctx.fillStyle = '#241a1a';
  ctx.beginPath(); ctx.ellipse(0, -20, 17, 7, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3b2a22';
  ctx.beginPath(); ctx.ellipse(0, -22, 15, 5.5, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#74573a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-10, -18); ctx.lineTo(-4, -2); ctx.moveTo(10, -18); ctx.lineTo(4, -2); ctx.stroke();
  // flame
  const h = 34 * flick;
  const grd = ctx.createLinearGradient(0, -22, 0, -22 - h);
  grd.addColorStop(0, '#ffe9a8'); grd.addColorStop(0.4, color); grd.addColorStop(1, 'rgba(255,60,20,0)');
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(-9, -20);
  ctx.bezierCurveTo(-16, -32, -2, -36, -3 + Math.sin(t * 7) * 2, -24 - h);
  ctx.bezierCurveTo(8, -35, 14, -30, 8, -20);
  ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

// ============================================================
//  PLAYER
// ============================================================
export function drawPlayer(ctx, p, t, weapon) {
  const { x, y } = p;
  const moving = p.moving;
  const walk = p.walkPhase;
  const bob = moving ? Math.sin(walk * 2) * 2.2 : Math.sin(t * 1.8) * 1.2;
  const face = p.face || 0;
  const flip = Math.cos(face) < 0 ? -1 : 1;
  const hurt = p.hurtFlash > 0;

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.beginPath(); ctx.ellipse(x, y + 1, 20, 7.5, 0, 0, TAU); ctx.fill();

  // dash afterimages
  if (p.dashTrail && p.dashTrail.length) {
    for (let i = 0; i < p.dashTrail.length; i++) {
      const d = p.dashTrail[i];
      ctx.globalAlpha = (i / p.dashTrail.length) * 0.25;
      ctx.fillStyle = p.dashColor || '#7fe3d0';
      ctx.beginPath(); ctx.ellipse(d.x, d.y - 30, 12, 30, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.save();
  ctx.translate(x, y + bob);
  if (p.invuln > 0 && !p.dashing) ctx.globalAlpha = 0.82 + Math.sin(t * 40) * 0.15;
  const lean = moving ? Math.cos(face) * 2 : 0;

  // ---- scarf trail ----
  if (p.scarf && p.scarf.length > 1) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      ctx.moveTo(0, -44);
      for (let i = 0; i < p.scarf.length; i++) {
        const s = p.scarf[i];
        const sx = s.x - x, sy = s.y - y - bob;
        ctx.lineTo(sx * (pass ? 0.8 : 1), sy * (pass ? 0.8 : 1));
      }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = pass ? 'rgba(240,110,75,.5)' : 'rgba(165,35,38,.92)';
      ctx.lineWidth = pass ? 2.5 : 6.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---- cape ----
  const capeSway = Math.sin(t * 3 + walk) * 3 + (moving ? -Math.sin(face) * 4 : 0);
  ctx.beginPath();
  ctx.moveTo(-13, -42);
  ctx.quadraticCurveTo(-24 + capeSway, -22, -17 + capeSway, 2);
  ctx.quadraticCurveTo(-6, -2, 0, -4);
  ctx.quadraticCurveTo(6, -2, 17 - capeSway, 2);
  ctx.quadraticCurveTo(24 - capeSway, -22, 13, -42);
  ctx.closePath();
  const capeGrd = ctx.createLinearGradient(0, -42, 0, 4);
  capeGrd.addColorStop(0, '#2b2138');
  capeGrd.addColorStop(0.5, '#1a1424');
  capeGrd.addColorStop(1, '#0d0912');
  ctx.fillStyle = capeGrd; ctx.fill();
  ctx.strokeStyle = 'rgba(120,98,140,.35)'; ctx.lineWidth = 1; ctx.stroke();
  // cape red inside glow
  ctx.strokeStyle = 'rgba(179,48,44,.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-11, -38); ctx.quadraticCurveTo(-18 + capeSway, -16, -12 + capeSway, -2); ctx.stroke();

  // ---- legs ----
  const swing = moving ? Math.sin(walk) * 8 : 0;
  const legGrad = ctx.createLinearGradient(0, -18, 0, 0);
  legGrad.addColorStop(0, '#31263a'); legGrad.addColorStop(1, '#16111e');
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 6 + lean, -16);
    ctx.rotate(side * swing * 0.018);
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8, 15 + side * swing * 0.12, 3);
    ctx.fill();
    // greave
    ctx.fillStyle = '#6f5432';
    ctx.fillRect(-4.5, 7, 9, 3);
    ctx.fillStyle = '#241a1a';
    ctx.beginPath(); ctx.ellipse(side * 1, 16, 6, 3.4, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- torso ----
  ctx.save();
  ctx.translate(0, -31);
  ctx.rotate(lean * 0.02);
  const torso = ctx.createLinearGradient(-12, -10, 12, 10);
  torso.addColorStop(0, '#4a3b2f'); torso.addColorStop(0.5, '#33291f'); torso.addColorStop(1, '#1c1512');
  ctx.fillStyle = torso;
  ctx.beginPath();
  ctx.moveTo(-11, -12); ctx.quadraticCurveTo(-14, 2, -7, 12);
  ctx.lineTo(7, 12); ctx.quadraticCurveTo(14, 2, 11, -12);
  ctx.quadraticCurveTo(0, -17, -11, -12);
  ctx.fill();
  // armor plates
  ctx.strokeStyle = 'rgba(190,150,90,.5)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(9, -6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-7, 4); ctx.lineTo(7, 4); ctx.stroke();
  ctx.fillStyle = 'rgba(227,189,123,.65)';
  ctx.beginPath(); ctx.arc(0, -9, 2.2, 0, TAU); ctx.fill();
  // leather strap
  ctx.strokeStyle = 'rgba(120,76,45,.85)'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(6, 6); ctx.stroke();
  // shoulder pauldrons
  for (const s of [-1, 1]) {
    const pg = ctx.createRadialGradient(s * 10, -11, 1, s * 10, -11, 9);
    pg.addColorStop(0, '#7b6039'); pg.addColorStop(1, '#2a2018');
    ctx.fillStyle = pg;
    ctx.beginPath(); ctx.ellipse(s * 11, -10, 7, 5.5, s * 0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(227,189,123,.35)'; ctx.lineWidth = 1; ctx.stroke();
  }
  // neck
  ctx.fillStyle = '#241a1a'; ctx.fillRect(-3, -18, 6, 5);
  ctx.restore();

  // ---- head ----
  const hy = -52 + bob * 0.3;
  ctx.save();
  ctx.translate(leaning(face) ? Math.cos(face) * 1.5 : 0, hy);
  // hair/helmet
  const hg = ctx.createRadialGradient(-2, -2, 1, 0, 0, 11);
  hg.addColorStop(0, '#3a2e2b'); hg.addColorStop(1, '#141018');
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 9, 0, 0, TAU); ctx.fill();
  // face plate
  ctx.fillStyle = '#0e0a0c';
  ctx.beginPath(); ctx.ellipse(flip * 1.6, 1, 6.6, 7.2, 0, 0, TAU); ctx.fill();
  // eyes
  ctx.shadowColor = '#ffcf6a'; ctx.shadowBlur = 6;
  ctx.fillStyle = '#ffe1a0';
  ctx.beginPath(); ctx.ellipse(flip * 1.5 - 2.3, 0.5, 1.5, 1.1, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(flip * 1.5 + 2.3, 0.5, 1.5, 1.1, 0, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // helm crest / laurel
  ctx.strokeStyle = 'rgba(227,189,123,.6)'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(0, -2, 8.5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  // red plume
  ctx.fillStyle = 'rgba(179,48,44,.7)';
  ctx.beginPath(); ctx.moveTo(-2, -9); ctx.quadraticCurveTo(-2, -16, 6, -15); ctx.quadraticCurveTo(1, -12, 3, -8); ctx.fill();
  ctx.restore();

  // ---- arm + weapon ----
  if (p.attackAnim && p.attackAnim.alpha !== undefined) ctx.globalAlpha *= p.attackAnim.alpha;
  drawWeapon(ctx, p, weapon, face, t);
  ctx.restore();

  if (hurt) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, '#ff5a45', x, y - 32, 46, 0.35);
    ctx.restore();
  }
  // dash streak
  if (p.dashing) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, p.dashColor || '#7fe3d0', x - Math.cos(face) * 22, y - 24, 55, 0.2);
    ctx.restore();
  }
}
function leaning(face) { return Math.cos(face) !== 0; }

function drawWeapon(ctx, p, weapon, face, t) {
  const w = weapon || 'blade';
  ctx.save();
  ctx.translate(0, -36);
  // shoulder behind
  ctx.rotate(face);
  // arm
  const armGrad = ctx.createLinearGradient(0, 0, 18, 0);
  armGrad.addColorStop(0, '#30252b'); armGrad.addColorStop(1, '#1a1217');
  ctx.strokeStyle = 'rgba(20,14,20,.95)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(15, 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,160,100,.35)'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(9, -2); ctx.lineTo(15, 4); ctx.stroke();

  if (w === 'blade') {
    ctx.save();
    ctx.translate(15, 2);
    drawGlow(ctx, '#ffd88a', 28, 0, 42, 0.22);
    ctx.rotate(-0.12);
    // hilt
    ctx.fillStyle = '#4c3520';
    ctx.fillRect(-7, -2.6, 12, 5.2);
    ctx.fillStyle = '#d8b06a';
    ctx.fillRect(4, -5.5, 4, 11);
    // blade
    const bg = ctx.createLinearGradient(8, 0, 60, 0);
    bg.addColorStop(0, '#f6e3b0'); bg.addColorStop(0.5, '#e0b970'); bg.addColorStop(1, '#fff6dd');
    ctx.fillStyle = bg;
    ctx.shadowColor = '#ffcf7a'; ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(8, -3.2); ctx.lineTo(56, -1.6); ctx.lineTo(63, 0); ctx.lineTo(56, 1.9); ctx.lineTo(8, 3.4);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(57, 0); ctx.stroke();
    ctx.restore();
  } else if (w === 'spear') {
    ctx.save();
    ctx.translate(18, 0);
    drawGlow(ctx, '#9fe6ff', 30, 0, 40, 0.18);
    const sg = ctx.createLinearGradient(0, 0, 106, 0);
    sg.addColorStop(0, '#5c4a38'); sg.addColorStop(0.7, '#8b7554'); sg.addColorStop(1, '#d9c08a');
    ctx.strokeStyle = sg; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(92, 0); ctx.stroke();
    ctx.fillStyle = '#cfe9f2';
    ctx.shadowColor = '#8fdcff'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(90, -5); ctx.lineTo(114, 0); ctx.lineTo(90, 5); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(227,189,123,.8)';
    ctx.beginPath(); ctx.arc(86, 0, 3, 0, TAU); ctx.fill();
    ctx.restore();
  } else {
    // bow
    ctx.save();
    ctx.translate(16, 0);
    ctx.strokeStyle = '#a9814b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 28, -1.15, 1.15); ctx.stroke();
    ctx.strokeStyle = '#e3d6b0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(11, -26); ctx.lineTo(11, 26); ctx.stroke();
    if (p.chargeFx) {
      drawGlow(ctx, '#d7ff9a', 12, 0, 22, 0.5);
    }
    ctx.strokeStyle = '#cfe3a0'; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(44, 0); ctx.stroke();
    ctx.fillStyle = '#e9ffc0';
    ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(42, -3); ctx.lineTo(42, 3); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// ============================================================
//  ENEMIES
// ============================================================
export function drawEnemy(ctx, e, t) {
  const { x, y, radius } = e;
  const hurt = e.hurtFlash > 0;
  const scale = radius / 16;
  const bob = e.type === 'shade' || e.type === 'witch' ? Math.sin(t * 2.4 + x) * 4 : Math.sin(e.walkPhase) * 1.5;
  ctx.save();
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.48)';
  ctx.beginPath(); ctx.ellipse(x, y + 2, radius * 1.18, radius * 0.42, 0, 0, TAU); ctx.fill();
  // elite aura
  if (e.elite) {
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, '#ffcf6a', x, y - radius * 1.3, radius * 2.5, 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(255,218,140,${0.4 + Math.sin(t * 4) * 0.15})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(x, y + 2, radius * 1.5, radius * 0.55, 0, 0, TAU); ctx.stroke();
  }
  ctx.translate(x, y + bob);
  ctx.scale(scale, scale);
  const flip = e.face !== undefined && Math.cos(e.face) < 0 ? -1 : 1;

  if (e.type === 'skeleton') drawSkeleton(ctx, e, t, flip);
  else if (e.type === 'shade') drawShade(ctx, e, t, flip);
  else if (e.type === 'archer') drawArcher(ctx, e, t, flip);
  else if (e.type === 'brute') drawBrute(ctx, e, t, flip);
  else if (e.type === 'witch') drawWitch(ctx, e, t, flip);

  if (hurt) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(0, -22, 20, 28, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // status bubbles
  if (e.poison > 0) {
    ctx.fillStyle = `rgba(160,255,120,${0.5 + Math.sin(t * 6) * 0.2})`;
    for (let i = 0; i < 3; i++) {
      const a = t * 1.5 + i * 2.1;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 14, -34 + Math.sin(a * 1.3) * 6, 2, 0, TAU); ctx.fill();
    }
  }
  if (e.doom > 0) {
    ctx.strokeStyle = `rgba(255,80,60,${0.5 + Math.sin(t * 9) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -26, 20, 0, TAU); ctx.stroke();
  }
  ctx.restore();

  // hp bar
  if (e.showHp > 0 && !e.dead) {
    const w = Math.max(30, radius * 2.6);
    const hp = clamp(e.hp / e.maxHp, 0, 1);
    ctx.globalAlpha = clamp(e.showHp, 0, 1);
    ctx.fillStyle = 'rgba(5,3,8,.8)';
    ctx.fillRect(x - w / 2, y - radius * 3.1, w, 4);
    ctx.fillStyle = e.elite ? '#ffcf6a' : '#c34a45';
    ctx.fillRect(x - w / 2 + 1, y - radius * 3.1 + 1, (w - 2) * hp, 2);
    ctx.globalAlpha = 1;
  }
}

function drawSkeleton(ctx, e, t, flip) {
  const swing = Math.sin(e.walkPhase) * 0.5;
  // legs
  ctx.strokeStyle = '#cfc3a8'; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(-7 + swing * 5, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, -10); ctx.lineTo(7 - swing * 5, 0); ctx.stroke();
  // pelvis
  ctx.fillStyle = '#b8ac92';
  ctx.beginPath(); ctx.ellipse(0, -12, 8, 4, 0, 0, TAU); ctx.fill();
  // ribcage
  ctx.save(); ctx.translate(0, -22);
  ctx.fillStyle = '#a99d84';
  ctx.beginPath(); ctx.ellipse(0, 0, 9, 12, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#e2d7bd'; ctx.lineWidth = 1.6;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.arc(0, i * 3, 8, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
  // arms
  ctx.strokeStyle = '#cbbfa6'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-6, -26); ctx.lineTo(-13, -14 + swing * 4); ctx.stroke();
  // sword arm
  ctx.save(); ctx.translate(7, -26); ctx.rotate(e.windup > 0 ? -1.6 : 0.4);
  ctx.strokeStyle = '#cfc3a8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, 2); ctx.stroke();
  ctx.strokeStyle = '#6b5842'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(10, 2); ctx.lineTo(28, 2); ctx.stroke();
  ctx.fillStyle = '#9c8a6d';
  ctx.beginPath(); ctx.moveTo(28, 1); ctx.lineTo(38, 2); ctx.lineTo(28, 4); ctx.fill();
  ctx.restore();
  // skull
  ctx.save(); ctx.translate(0, -38);
  ctx.fillStyle = '#e0d6bf';
  ctx.beginPath(); ctx.ellipse(0, 0, 8.5, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#cfc4ac';
  ctx.beginPath(); ctx.roundRect(-5.5, 5, 11, 5, 2); ctx.fill();
  // eye sockets
  ctx.fillStyle = '#1a1014';
  ctx.beginPath(); ctx.ellipse(flip * -2.6, -1.5, 2.6, 3, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(flip * 2.6, -1.5, 2.6, 3, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff5a42'; ctx.shadowColor = '#ff4a32'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(flip * -2.6, -1.5, 1.2, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(flip * 2.6, -1.5, 1.2, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // jaw teeth
  ctx.strokeStyle = '#8b806e'; ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 2, 6); ctx.lineTo(i * 2, 9); ctx.stroke(); }
  // helmet
  ctx.fillStyle = '#3d3334';
  ctx.beginPath(); ctx.arc(0, -3, 9, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.fillStyle = 'rgba(180,70,60,.5)';
  ctx.fillRect(-1, -12, 2, 5);
  ctx.restore();
}

function drawShade(ctx, e, t, flip) {
  const sway = Math.sin(t * 2 + e.x) * 3;
  // wispy tail
  const grd = ctx.createLinearGradient(0, -52, 0, 8);
  grd.addColorStop(0, '#2a3846'); grd.addColorStop(0.6, '#141f2a'); grd.addColorStop(1, 'rgba(8,12,18,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(-15, -30);
  ctx.quadraticCurveTo(-22 + sway, -8, -12 + sway, 4);
  ctx.quadraticCurveTo(-4, -2, 0, 2);
  ctx.quadraticCurveTo(5, -4, 12 - sway, 4);
  ctx.quadraticCurveTo(22 - sway, -8, 15, -30);
  ctx.quadraticCurveTo(8, -42, 0, -44);
  ctx.quadraticCurveTo(-8, -42, -15, -30);
  ctx.fill();
  // hood
  ctx.fillStyle = '#1d2b38';
  ctx.beginPath(); ctx.ellipse(0, -44, 13, 15, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#090d13';
  ctx.beginPath(); ctx.ellipse(flip * 1, -42, 8, 10, 0, 0, TAU); ctx.fill();
  // eyes
  ctx.fillStyle = '#79e8ff'; ctx.shadowColor = '#48d4ff'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.ellipse(flip * -2.6 - 1, -43, 1.8, 2.6, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(flip * -2.6 + 4, -43, 1.8, 2.6, 0, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // claws
  ctx.strokeStyle = '#5f7a86'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(s * (11 + i * 1.5), -24 + i * 2);
      ctx.lineTo(s * (18 + i * 2), -17 + i * 3);
      ctx.stroke();
    }
  }
}

function drawArcher(ctx, e, t, flip) {
  // robe
  const grd = ctx.createLinearGradient(0, -36, 0, 0);
  grd.addColorStop(0, '#3f3a2c'); grd.addColorStop(1, '#181510');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(-10, -34); ctx.quadraticCurveTo(-15, -8, -12, 0);
  ctx.lineTo(12, 0); ctx.quadraticCurveTo(15, -8, 10, -34);
  ctx.closePath(); ctx.fill();
  // hood
  ctx.fillStyle = '#2c2a20';
  ctx.beginPath(); ctx.ellipse(0, -40, 11, 13, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#0b0a08';
  ctx.beginPath(); ctx.ellipse(flip * 1, -39, 7, 8.5, 0, 0, TAU); ctx.fill();
  // eyes
  ctx.fillStyle = '#ffb35a'; ctx.shadowColor = '#ff9a3c'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(flip * 2.4, -39, 1.6, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // bow
  ctx.save(); ctx.translate(flip * 13, -28);
  ctx.strokeStyle = '#8e7448'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(0, 0, 16, -1.2, 1.2); ctx.stroke();
  ctx.strokeStyle = 'rgba(230,220,190,.6)'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(6, -15); ctx.lineTo(6, 15); ctx.stroke();
  if (e.windup > 0) {
    drawGlow(ctx, '#ffb35a', 8, 0, 16, 0.5);
    ctx.strokeStyle = '#ffcf8a'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(22, 0); ctx.stroke();
  }
  ctx.restore();
  // quiver
  ctx.strokeStyle = '#6e5a3c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-8, -28); ctx.lineTo(-13, -14); ctx.stroke();
}

function drawBrute(ctx, e, t, flip) {
  const breathe = Math.sin(t * 2 + e.x) * 1.2;
  // legs
  ctx.fillStyle = '#2b201f';
  ctx.beginPath(); ctx.roundRect(-17, -14, 12, 16, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(5, -14, 12, 16, 3); ctx.fill();
  // body
  ctx.save(); ctx.translate(0, -32 + breathe);
  const grd = ctx.createLinearGradient(-20, -10, 20, 14);
  grd.addColorStop(0, '#4c3a33'); grd.addColorStop(1, '#241817');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.ellipse(0, 0, 23, 20, 0, 0, TAU); ctx.fill();
  // armor plate
  ctx.fillStyle = '#332624';
  ctx.beginPath(); ctx.ellipse(0, -2, 18, 14, 0, 0, TAU); ctx.fill();
  // glowing cracks
  ctx.strokeStyle = `rgba(255,110,60,${0.55 + Math.sin(t * 5) * 0.25})`;
  ctx.lineWidth = 1.6; ctx.shadowColor = '#ff5a2a'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(-3, -2); ctx.lineTo(-7, 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, -10); ctx.lineTo(3, -1); ctx.lineTo(10, 6); ctx.stroke();
  ctx.shadowBlur = 0;
  // arms
  const lift = e.windup > 0 ? -10 : 0;
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#3a2b27';
    ctx.beginPath(); ctx.ellipse(s * 24, 2 + lift, 8, 12, s * 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = '#241817';
    ctx.beginPath(); ctx.arc(s * 26, 12 + lift, 8, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#5a443c'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(s * 26, 12 + lift, 5, 0, TAU); ctx.stroke();
  }
  // head
  ctx.fillStyle = '#2d2020';
  ctx.beginPath(); ctx.ellipse(flip * 2, -24, 11, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff6a3a'; ctx.shadowColor = '#ff4a1a'; ctx.shadowBlur = 9;
  ctx.beginPath(); ctx.arc(flip * 2 - 4, -25, 1.8, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(flip * 2 + 4, -25, 1.8, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // horns
  ctx.fillStyle = '#b9a488';
  ctx.beginPath(); ctx.moveTo(-8, -31); ctx.lineTo(-14, -42); ctx.lineTo(-3, -34); ctx.fill();
  ctx.beginPath(); ctx.moveTo(8, -31); ctx.lineTo(14, -42); ctx.lineTo(3, -34); ctx.fill();
  ctx.restore();
}

function drawWitch(ctx, e, t, flip) {
  const hover = Math.sin(t * 2 + e.x) * 3;
  // lower robe
  const grd = ctx.createLinearGradient(0, -40, 0, 6);
  grd.addColorStop(0, '#3c2a55'); grd.addColorStop(1, 'rgba(14,8,22,.2)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(-13, -34); ctx.quadraticCurveTo(-20, -6, -9, 6);
  ctx.quadraticCurveTo(0, 10, 9, 6); ctx.quadraticCurveTo(20, -6, 13, -34);
  ctx.closePath(); ctx.fill();
  // veil / hood
  ctx.fillStyle = '#2a1c3d';
  ctx.beginPath(); ctx.ellipse(0, -42, 12, 14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#0d0714';
  ctx.beginPath(); ctx.ellipse(flip * 1, -41, 7.5, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#dca8ff'; ctx.shadowColor = '#b266ff'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(flip * 2.5, -41, 1.8, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  // crown
  ctx.strokeStyle = '#b98ce0'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -52, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const a = Math.PI * (1.2 + i * 0.3);
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, -52 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * 12, -52 + Math.sin(a) * 12); ctx.stroke();
  }
  // orbiting orbs
  for (let i = 0; i < 2; i++) {
    const a = t * 1.8 + i * Math.PI + e.orbitPhase;
    const ox = Math.cos(a) * 22, oy = -30 + Math.sin(a) * 8;
    drawGlow(ctx, '#c48aff', ox, oy, 12, 0.6);
    ctx.fillStyle = '#f0d8ff';
    ctx.beginPath(); ctx.arc(ox, oy, 2.6, 0, TAU); ctx.fill();
  }
  // hands
  ctx.fillStyle = '#c9b6a4';
  ctx.beginPath(); ctx.arc(-11, -26, 3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(11, -26, 3, 0, TAU); ctx.fill();
}

// ============================================================
//  BOSS — CERBERUS
// ============================================================
export function drawBoss(ctx, b, t) {
  const { x, y } = b;
  const s = 1.9;
  const bob = Math.sin(t * 1.6) * 2;
  const dir = Math.cos(b.face || 0) < 0 ? -1 : 1;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  ctx.beginPath(); ctx.ellipse(x, y + 6, 95, 26, 0, 0, TAU); ctx.fill();
  // fire aura
  ctx.globalCompositeOperation = 'lighter';
  drawGlow(ctx, b.enraged ? '#ff4520' : '#ff7a3a', x, y - 50, 150, 0.24 + Math.sin(t * 3) * 0.04);
  ctx.globalCompositeOperation = 'source-over';
  ctx.translate(x, y + bob);
  ctx.scale(s, s);
  // legs
  const step = Math.sin(t * 6) * 3;
  ctx.fillStyle = '#171115';
  for (const [lx, ly, sw] of [[-32, -8, step], [-14, -6, -step], [22, -6, step], [38, -8, -step]]) {
    ctx.beginPath(); ctx.roundRect(lx + sw * 0.4, ly, 11, 20, 4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lx + 5 + sw * 0.4, ly + 20, 9, 5, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#4b3530'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(lx + 1 + sw * 0.4, ly + 10); ctx.lineTo(lx + 9 + sw * 0.4, ly + 10); ctx.stroke();
  }
  // body
  const bg = ctx.createLinearGradient(-40, -45, 40, 5);
  bg.addColorStop(0, '#2a1b20'); bg.addColorStop(0.5, '#170f14'); bg.addColorStop(1, '#0d080b');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.ellipse(0, -20, 45, 26, 0, 0, TAU); ctx.fill();
  // ribs
  ctx.strokeStyle = 'rgba(120,78,70,.4)'; ctx.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.arc(i * 9, -20, 16, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
  }
  // mane / spikes
  ctx.fillStyle = '#20141a';
  ctx.beginPath();
  for (let i = 0; i < 11; i++) {
    const a = Math.PI * (0.95 + i * 0.1);
    const rr = 46 + (i % 2) * 6;
    ctx.lineTo(Math.cos(a) * rr, -40 + Math.sin(a) * rr * 0.7);
    ctx.lineTo(Math.cos(a + 0.06) * (rr - 14), -40 + Math.sin(a + 0.06) * (rr - 14) * 0.7);
  }
  ctx.closePath(); ctx.fill();
  // chain collar
  ctx.strokeStyle = '#b08a4e'; ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.ellipse(dir * 20, -34, 24, 12, -0.2 * dir, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#e3bd7b';
  for (let i = 0; i < 5; i++) {
    const a = -0.2 * dir + i * 0.3;
    ctx.beginPath(); ctx.arc(dir * 20 + Math.cos(a) * 24, -34 + Math.sin(a) * 12, 2.2, 0, TAU); ctx.fill();
  }
  // three necks + heads
  const headDefs = [
    { hx: -18 * dir, hy: -54, tilt: -0.35 * dir, ph: 0 },
    { hx: 2 * dir, hy: -62, tilt: 0, ph: 1.4 },
    { hx: 24 * dir, hy: -52, tilt: 0.3 * dir, ph: 2.8 },
  ];
  for (const hd of headDefs) {
    const sway = Math.sin(t * 2 + hd.ph) * 2;
    ctx.save();
    ctx.translate(hd.hx + sway, hd.hy);
    ctx.rotate(hd.tilt);
    // neck
    ctx.strokeStyle = '#21151c'; ctx.lineWidth = 13; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(dir * 2, 2); ctx.stroke();
    ctx.strokeStyle = '#2d1e25'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(dir * 2, 2); ctx.stroke();
    // head
    const hg = ctx.createLinearGradient(-12, -12, 12, 12);
    hg.addColorStop(0, '#332229'); hg.addColorStop(1, '#120c10');
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 11, 0.1, 0, TAU); ctx.fill();
    // snout
    ctx.fillStyle = '#1a1116';
    ctx.beginPath(); ctx.ellipse(dir * 12, 4, 9, 6, 0.1 * dir, 0, TAU); ctx.fill();
    // ears
    ctx.fillStyle = '#2a1b22';
    ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(-13, -20); ctx.lineTo(-2, -10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, -9); ctx.lineTo(10, -20); ctx.lineTo(13, -6); ctx.fill();
    // eyes
    const blink = Math.sin(t * 1.3 + hd.ph) > 0.96 ? 0.15 : 1;
    ctx.fillStyle = '#ff3b2a'; ctx.shadowColor = '#ff2a1a'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.ellipse(dir * 2 - 4, -2, 2.4, 2.2 * blink, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dir * 2 + 4, -2, 2.4, 2.2 * blink, 0, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    // teeth
    ctx.fillStyle = '#d9cbb2';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(dir * (8 + i * 3), 8); ctx.lineTo(dir * (9 + i * 3), 12); ctx.lineTo(dir * (10 + i * 3), 8); ctx.fill();
    }
    if (b.attack === 'breath' && b.attackT < 0.5) {
      drawGlow(ctx, '#ff7a2a', dir * 18, 6, 24, 0.5);
    }
    ctx.restore();
  }
  ctx.restore();
}

// ============================================================
//  FX
// ============================================================
export function drawSlash(ctx, fx, weapon) {
  const p = fx.t / fx.dur;
  if (p >= 1) return;
  const ease = 1 - Math.pow(1 - p, 3);
  const alpha = (1 - p) * (fx.alpha ?? 0.9);
  const color = fx.color || '#ffe0a0';
  ctx.save();
  ctx.translate(fx.x, fx.y);
  ctx.rotate(fx.angle);
  ctx.globalCompositeOperation = 'lighter';
  const start = -fx.arc / 2 + fx.arc * (1 - ease) * 0.45;
  const end = start + fx.arc * Math.min(1, 0.35 + ease * 1.2);
  const inner = fx.range * 0.32;
  const outer = fx.range * (0.85 + ease * 0.22);
  ctx.beginPath();
  ctx.arc(0, 0, inner, start, end);
  ctx.arc(0, 0, outer, end, start, true);
  ctx.closePath();
  const grd = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
  grd.addColorStop(0, rgba(color, 0));
  grd.addColorStop(0.55, rgba(color, alpha * 0.28));
  grd.addColorStop(0.9, rgba(color, alpha * 0.8));
  grd.addColorStop(1, rgba('#ffffff', alpha * 0.95));
  ctx.fillStyle = grd;
  ctx.fill();
  // leading edge
  ctx.strokeStyle = rgba('#ffffff', alpha);
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(0, 0, outer, start, end); ctx.stroke();
  ctx.restore();
}

export function drawParticle(ctx, p) {
  const a = clamp(1 - p.t / p.life, 0, 1);
  if (p.kind === 'spark') {
    ctx.strokeStyle = rgba(p.color, a * 0.9);
    ctx.lineWidth = p.size * 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
    ctx.stroke();
  } else if (p.kind === 'ring') {
    const rr = p.size + (1 - a) * p.grow;
    ctx.strokeStyle = rgba(p.color, a * 0.7);
    ctx.lineWidth = p.w || 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, TAU); ctx.stroke();
  } else if (p.kind === 'soul') {
    ctx.fillStyle = rgba(p.color, a * 0.7);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, TAU); ctx.fill();
  } else if (p.kind === 'ember') {
    ctx.fillStyle = rgba(p.color, a * 0.8);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.6 + a * 0.6), 0, TAU); ctx.fill();
  } else if (p.kind === 'blood') {
    ctx.fillStyle = rgba(p.color || '#8a1e26', a * 0.8);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.5 + a), 0, TAU); ctx.fill();
  } else if (p.kind === 'piece') {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0);
    ctx.fillStyle = rgba(p.color, a * 0.9);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
}

export function drawProjectileArt(ctx, pr, t) {
  if (pr.type === 'arrow') {
    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(pr.angle);
    ctx.strokeStyle = pr.enemy ? '#d98a5a' : '#e8ffc0';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(10, 0); ctx.stroke();
    ctx.fillStyle = pr.enemy ? '#ffb06a' : '#f0ffcf';
    ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(8, -3.4); ctx.lineTo(8, 3.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = pr.enemy ? '#8a4a3a' : '#9acb6a';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-22, -4); ctx.moveTo(-16, 0); ctx.lineTo(-22, 4); ctx.stroke();
    ctx.restore();
  } else if (pr.type === 'orb') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, pr.color || '#c98aff', pr.x, pr.y, 26, 0.55);
    ctx.fillStyle = '#fff0ff';
    ctx.beginPath(); ctx.arc(pr.x, pr.y, 4.6, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(pr.color || '#c98aff', 0.8);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(pr.x, pr.y, 7 + Math.sin(t * 10 + pr.x) * 1.4, 0, TAU); ctx.stroke();
    ctx.restore();
  } else if (pr.type === 'spear') {
    ctx.save();
    ctx.translate(pr.x, pr.y); ctx.rotate(pr.angle);
    ctx.strokeStyle = '#c9dddf'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(26, 0); ctx.stroke();
    ctx.fillStyle = '#e9fbff';
    ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(24, -4); ctx.lineTo(24, 4); ctx.fill();
    ctx.restore();
  }
}

// ============================================================
//  MENU BACKDROP
// ============================================================
export function drawMenu(ctx, w, h, t, scale = 1) {
  const R = mulberry32(1337);
  // sky
  let bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#060409');
  bg.addColorStop(0.45, '#100a17');
  bg.addColorStop(0.8, '#1a0e16');
  bg.addColorStop(1, '#08050a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // red moon halo
  const mx = w * 0.7, my = h * 0.34, mr = Math.min(w, h) * 0.19;
  ctx.globalCompositeOperation = 'lighter';
  drawGlow(ctx, '#a13a32', mx, my, mr * 2.6, 0.38);
  drawGlow(ctx, '#e06a44', mx, my, mr * 1.5, 0.2);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#170d12';
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(224,150,90,.22)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(mx, my, mr * 0.86, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(mx, my, mr * 1.06, 0, TAU); ctx.stroke();

  // god rays
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const a = -1.3 + i * 0.42 + Math.sin(t * 0.08 + i) * 0.04;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(a);
    const grd = ctx.createLinearGradient(0, 0, 0, h * 0.8);
    grd.addColorStop(0, 'rgba(200,120,70,.06)'); grd.addColorStop(1, 'rgba(200,120,70,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(120, h); ctx.lineTo(-120, h); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // distant columns
  const colXs = [-0.06, 0.09, 0.22, 0.35, 0.48, 0.82, 0.94, 1.04];
  for (let i = 0; i < colXs.length; i++) {
    const x = colXs[i] * w;
    const cw = w * (0.028 + (i % 3) * 0.006);
    const top = h * (0.16 + (i % 2) * 0.04);
    const shaft = ctx.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0);
    shaft.addColorStop(0, 'rgba(9,6,12,.85)');
    shaft.addColorStop(0.45, 'rgba(34,24,34,.6)');
    shaft.addColorStop(1, 'rgba(7,4,9,.9)');
    ctx.fillStyle = shaft;
    ctx.fillRect(x - cw / 2, top, cw, h * 0.74);
    ctx.fillStyle = 'rgba(58,42,46,.32)';
    ctx.fillRect(x - cw * 0.68, top - h * 0.013, cw * 1.36, h * 0.02);
    ctx.fillRect(x - cw * 0.62, top + h * 0.72, cw * 1.24, h * 0.022);
    ctx.strokeStyle = 'rgba(120,86,70,.12)'; ctx.lineWidth = 1;
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath(); ctx.moveTo(x + k * cw * 0.22, top + 8); ctx.lineTo(x + k * cw * 0.22, top + h * 0.72); ctx.stroke();
    }
  }

  // the gate to the underworld
  const gx = w * 0.66, gy = h * 0.9, gw = Math.min(w * 0.34, h * 0.62), gh = Math.min(h * 0.58, w * 0.44);
  ctx.save();
  ctx.translate(gx, gy);
  // steps
  ctx.fillStyle = '#0e090e';
  for (let i = 0; i < 4; i++) {
    const sw = gw * (0.6 + i * 0.16);
    ctx.fillRect(-sw / 2, -i * (gh * 0.045), sw, gh * 0.05);
    ctx.fillStyle = i % 2 ? '#120b10' : '#171014';
  }
  // arch silhouette
  ctx.beginPath();
  ctx.moveTo(-gw * 0.5, 0);
  ctx.lineTo(-gw * 0.5, -gh * 0.5);
  ctx.quadraticCurveTo(-gw * 0.5, -gh, 0, -gh);
  ctx.quadraticCurveTo(gw * 0.5, -gh, gw * 0.5, -gh * 0.5);
  ctx.lineTo(gw * 0.5, 0);
  ctx.closePath();
  ctx.fillStyle = '#0b070c';
  ctx.fill();
  // inner portal glow
  const portal = ctx.createRadialGradient(0, -gh * 0.5, 4, 0, -gh * 0.5, gw * 0.55);
  portal.addColorStop(0, 'rgba(255,90,42,.5)');
  portal.addColorStop(0.4, 'rgba(150,32,30,.24)');
  portal.addColorStop(1, 'rgba(20,8,12,0)');
  ctx.fillStyle = portal;
  ctx.beginPath();
  ctx.moveTo(-gw * 0.4, 0); ctx.lineTo(-gw * 0.4, -gh * 0.48);
  ctx.quadraticCurveTo(-gw * 0.4, -gh * 0.86, 0, -gh * 0.86);
  ctx.quadraticCurveTo(gw * 0.4, -gh * 0.86, gw * 0.4, -gh * 0.48);
  ctx.lineTo(gw * 0.4, 0); ctx.closePath(); ctx.fill();
  // arch stone bands
  ctx.strokeStyle = 'rgba(104,78,64,.35)'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-gw * 0.5, 0); ctx.lineTo(-gw * 0.5, -gh * 0.5);
  ctx.quadraticCurveTo(-gw * 0.5, -gh, 0, -gh);
  ctx.quadraticCurveTo(gw * 0.5, -gh, gw * 0.5, -gh * 0.5);
  ctx.lineTo(gw * 0.5, 0);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(204,160,100,.16)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-gw * 0.44, 0); ctx.lineTo(-gw * 0.44, -gh * 0.5);
  ctx.quadraticCurveTo(-gw * 0.44, -gh * 0.93, 0, -gh * 0.93);
  ctx.quadraticCurveTo(gw * 0.44, -gh * 0.93, gw * 0.44, -gh * 0.5);
  ctx.lineTo(gw * 0.44, 0);
  ctx.stroke();
  // meander along arch
  ctx.strokeStyle = 'rgba(196,148,86,.2)'; ctx.lineWidth = 1.4;
  for (let i = 0; i < 22; i++) {
    const a = Math.PI + (i / 21) * Math.PI;
    const rx = gw * 0.47, ry = gh * 0.94;
    const px = Math.cos(a) * rx, py = -gh * 0.06 + Math.sin(a) * ry;
    const px2 = Math.cos(a + 0.06) * rx, py2 = -gh * 0.06 + Math.sin(a + 0.06) * ry;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px2, py2); ctx.stroke();
  }
  // eyes in the dark
  ctx.globalCompositeOperation = 'lighter';
  const blink = Math.max(0.12, Math.abs(Math.sin(t * 0.7 - 1.2)));
  for (let i = 0; i < 3; i++) {
    const ex = (i - 1) * gw * 0.13;
    const ey = -gh * 0.38 + (i % 2) * gh * 0.05;
    ctx.globalAlpha = blink * (0.5 + Math.sin(t * 2 + i) * 0.2);
    drawGlow(ctx, '#ff3d26', ex, ey, 20, 0.9);
    ctx.fillStyle = '#ff6a4a';
    ctx.beginPath(); ctx.arc(ex - 5, ey, 1.8, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(ex + 5, ey, 1.8, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // chains
  ctx.strokeStyle = 'rgba(120,96,70,.22)'; ctx.lineWidth = 2;
  for (const off of [-0.33, 0.3]) {
    ctx.beginPath();
    let cx = gw * off, cy = -gh * 0.86;
    ctx.moveTo(cx, cy);
    for (let k = 0; k < 7; k++) { cx += (k % 2 ? 1 : -1) * 3; cy += gh * 0.1; ctx.lineTo(cx, cy); }
    ctx.stroke();
  }
  ctx.restore();

  // floor haze
  const hz = ctx.createLinearGradient(0, h * 0.6, 0, h);
  hz.addColorStop(0, 'rgba(12,7,10,0)');
  hz.addColorStop(1, 'rgba(8,5,9,.9)');
  ctx.fillStyle = hz; ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // drifting smoke
  for (let i = 0; i < 4; i++) {
    const sx = (w * (0.1 + i * 0.3) + Math.sin(t * 0.05 + i) * 80) % (w + 400) - 200;
    const sy = h * (0.68 + i * 0.07);
    const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.28);
    grd.addColorStop(0, 'rgba(94,64,76,.06)'); grd.addColorStop(1, 'rgba(94,64,76,0)');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(sx, sy, w * 0.28, 0, TAU); ctx.fill();
  }

  // embers
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i++) {
    const seedX = R(), seedY = R(), speed = 0.3 + R() * 0.6;
    const ey = (h + 40 - ((t * 22 * speed + seedY * h * 1.3) % (h + 80)));
    const ex = seedX * w + Math.sin(t * 0.7 + i) * 18;
    const a = 0.18 + 0.5 * (1 - ey / h) * (0.5 + Math.sin(t * 3 + i) * 0.5);
    ctx.fillStyle = `rgba(255,150,86,${a})`;
    ctx.beginPath(); ctx.arc(ex, ey, 0.8 + (i % 3) * 0.7, 0, TAU); ctx.fill();
    if (i % 5 === 0) drawGlow(ctx, '#ff8a4a', ex, ey, 9, a * 0.5);
  }
  ctx.restore();

  // bottom fade for text legibility
  const bf = ctx.createLinearGradient(0, h * 0.55, 0, h);
  bf.addColorStop(0, 'rgba(5,3,8,0)'); bf.addColorStop(1, 'rgba(5,3,8,.55)');
  ctx.fillStyle = bf; ctx.fillRect(0, h * 0.55, w, h * 0.45);
}
