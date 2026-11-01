import { W, H, COLORS, FONT, clamp } from './config.js';
import { ROOMS, MAP_CELLS } from './world.js';
import {
  drawPixelHeart, drawKeyIcon, drawBossKeyIcon, drawSparkle, drawFlame,
  drawTorchBracket, drawEmber, rect, shadow,
} from './sprites.js';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function label(ctx, text, x, y, size = 8, color = COLORS.white, align = 'left', weight = 'bold', spacing = 0) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function serif(ctx, text, x, y, size, fill, align = 'center', spacing = 0) {
  ctx.save();
  ctx.font = `700 ${size}px Georgia, "DejaVu Serif", "Times New Roman", serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill;
  ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Static overlays
// ---------------------------------------------------------------------------
export function makeVignette() {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const rad = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 330);
  rad.addColorStop(0, 'rgba(3,2,7,0)');
  rad.addColorStop(0.55, 'rgba(3,2,7,0.04)');
  rad.addColorStop(1, 'rgba(3,2,7,0.68)');
  g.fillStyle = rad;
  g.fillRect(0, 0, W, H);
  let lin = g.createLinearGradient(0, 0, 0, 34);
  lin.addColorStop(0, 'rgba(2,1,5,0.5)');
  lin.addColorStop(1, 'rgba(2,1,5,0)');
  g.fillStyle = lin;
  g.fillRect(0, 0, W, 34);
  lin = g.createLinearGradient(0, H, 0, H - 30);
  lin.addColorStop(0, 'rgba(2,1,5,0.5)');
  lin.addColorStop(1, 'rgba(2,1,5,0)');
  g.fillStyle = lin;
  g.fillRect(0, H - 30, W, 30);
  return cv;
}

export function makeTitleEmbers() {
  const arr = [];
  for (let i = 0; i < 34; i++) {
    arr.push({
      x: 30 + Math.random() * (W - 60),
      y: 80 + Math.random() * (H - 60),
      vy: 9 + Math.random() * 20,
      size: 0.6 + Math.random() * 1.7,
      life: 2 + Math.random() * 5,
      phase: Math.random() * 10,
    });
  }
  return arr;
}

function drawTitlePillar(g, x, top, bottom) {
  shadow(g, x + 10, bottom + 4, 20, 5, 0.5);
  rect(g, x, top, 20, bottom - top, '#171522');
  rect(g, x + 1, top + 2, 18, bottom - top - 2, '#332f4b');
  rect(g, x + 2, top + 2, 6, bottom - top - 2, '#413c5c');
  rect(g, x + 14, top + 2, 5, bottom - top - 2, '#28243c');
  rect(g, x - 3, top - 8, 26, 10, '#171522');
  rect(g, x - 2, top - 7, 24, 7, '#423d5e');
  rect(g, x - 2, top - 7, 24, 2, '#57517a');
  rect(g, x - 3, bottom - 6, 26, 9, '#171522');
  rect(g, x - 2, bottom - 5, 24, 7, '#3a3552');
  rect(g, x - 2, bottom - 5, 24, 2, '#4e496b');
}

export function buildTitleBackground() {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#07060c');
  bg.addColorStop(0.55, '#120e1c');
  bg.addColorStop(1, '#08060c');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // distant wall blocks
  for (let y = 0; y < 244; y += 18) {
    for (let x = (y / 18) % 2 === 0 ? -12 : 4; x < W; x += 34) {
      g.fillStyle = 'rgba(255,255,255,0.018)';
      g.fillRect(x, y, 32, 16);
      g.fillStyle = 'rgba(0,0,0,0.22)';
      g.fillRect(x, y + 16, 32, 2);
      g.fillRect(x + 32, y, 2, 18);
    }
  }
  // floor
  for (let y = 246; y < H; y += 14) {
    for (let x = (y / 14) % 2 === 0 ? -16 : 0; x < W; x += 32) {
      g.fillStyle = (x + y) % 3 === 0 ? '#151220' : '#12101b';
      g.fillRect(x, y, 30, 12);
      g.fillStyle = 'rgba(255,255,255,0.025)';
      g.fillRect(x, y, 30, 1);
    }
  }
  g.fillStyle = 'rgba(0,0,0,0.35)';
  g.fillRect(0, 242, W, 6);

  // door arch
  g.save();
  g.translate(W / 2, 0);
  g.beginPath();
  g.moveTo(-80, 250);
  g.lineTo(-80, 152);
  g.arc(0, 152, 80, Math.PI, 0);
  g.lineTo(80, 250);
  g.closePath();
  g.fillStyle = '#040308';
  g.fill();
  g.lineWidth = 18;
  g.strokeStyle = '#272338';
  g.stroke();
  g.lineWidth = 2;
  g.strokeStyle = '#4a4566';
  g.stroke();

  // door panels
  g.fillStyle = '#1c1218';
  g.fillRect(-68, 170, 136, 80);
  g.fillStyle = '#241820';
  g.fillRect(-64, 174, 60, 72);
  g.fillRect(4, 174, 60, 72);
  g.fillStyle = '#0c080e';
  g.fillRect(-2, 168, 4, 82);
  g.strokeStyle = 'rgba(120,94,48,0.55)';
  g.lineWidth = 1;
  g.strokeRect(-64, 174, 60, 72);
  g.strokeRect(4, 174, 60, 72);
  for (const y of [190, 216, 240]) {
    g.fillStyle = '#3a2c1c';
    g.fillRect(-66, y, 132, 3);
    g.fillStyle = 'rgba(180,146,74,0.5)';
    g.fillRect(-66, y, 132, 1);
  }
  // chains
  g.strokeStyle = 'rgba(90,82,104,0.55)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(-42, 0);
  g.lineTo(-58, 168);
  g.moveTo(42, 0);
  g.lineTo(58, 168);
  g.stroke();
  for (let i = 0; i < 9; i++) {
    const y = 12 + i * 18;
    g.fillStyle = 'rgba(120,110,135,0.4)';
    g.fillRect(-46 - i * 1.8, y, 5, 2);
    g.fillRect(41 + i * 1.8, y, 5, 2);
  }
  // eye socket
  g.fillStyle = '#08050b';
  g.beginPath();
  g.ellipse(0, 198, 31, 21, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(120,44,50,0.4)';
  g.lineWidth = 2;
  g.stroke();
  // studs
  g.fillStyle = COLORS.goldDark;
  for (const [sx, sy] of [[-62, 178], [58, 178], [-62, 238], [58, 238]]) {
    g.fillRect(sx, sy, 4, 4);
  }
  // floor shadow
  g.fillStyle = 'rgba(0,0,0,0.55)';
  g.beginPath();
  g.ellipse(0, 252, 98, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();

  drawTitlePillar(g, 138, 132, 250);
  drawTitlePillar(g, 354, 132, 250);
  drawTorchBracket(g, 112, 184, 'n');
  drawTorchBracket(g, 400, 184, 'n');

  // haze
  const haze = g.createLinearGradient(0, 210, 0, H);
  haze.addColorStop(0, 'rgba(30,20,46,0)');
  haze.addColorStop(1, 'rgba(40,26,56,0.18)');
  g.fillStyle = haze;
  g.fillRect(0, 200, W, H - 200);

  return cv;
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------
export function drawTitle(ctx, game) {
  ctx.drawImage(game.titleBg, 0, 0);
  const t = game.titleTime;

  // sconce flames
  drawFlame(ctx, 112, 176, t, 1.7, 1.05);
  drawFlame(ctx, 400, 176, t, 4.2, 1.05);

  // living eye
  const pulse = 0.7 + Math.sin(t * 2.1) * 0.25;
  const blink = Math.pow(Math.max(0, Math.sin(t * 0.47 + 1)), 26);
  const open = 1 - blink * 0.9;
  const grd = ctx.createRadialGradient(256, 198, 0, 256, 198, 58);
  grd.addColorStop(0, `rgba(210,46,58,${0.26 * pulse})`);
  grd.addColorStop(0.5, `rgba(150,30,50,${0.1 * pulse})`);
  grd.addColorStop(1, 'rgba(100,20,40,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(190, 132, 132, 132);
  ctx.save();
  ctx.translate(256, 198);
  ctx.scale(1, 0.28 + open * 0.72);
  ctx.fillStyle = '#e6d4b0';
  ctx.beginPath();
  ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7d1b28';
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d63b45';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#16070b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 3.2, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.arc(-4, -4, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // eyelids
  ctx.fillStyle = 'rgba(6,4,9,0.55)';
  ctx.fillRect(228, 181, 56, 2);
  ctx.fillRect(228, 213, 56, 2);

  // embers
  for (const e of game.titleEmbers) {
    const a = clamp(e.life / 2.2, 0, 1) * 0.8;
    drawEmber(ctx, e.x, e.y, e.size, a, Math.random() < 0.3 ? '#ffd27a' : '#ff9a4a');
  }

  // title
  const grad = ctx.createLinearGradient(0, 30, 0, 74);
  grad.addColorStop(0, '#fff6d4');
  grad.addColorStop(0.45, '#e3c274');
  grad.addColorStop(1, '#9b7832');
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 37px Georgia, "DejaVu Serif", "Times New Roman", serif';
  ctx.letterSpacing = '2px';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = grad;
  ctx.fillText('THE HOLLOW VAULT', W / 2, 50);
  ctx.restore();

  label(ctx, 'A  B O S S - K E Y  D U N G E O N', W / 2, 78, 8.5, '#e2cf9a', 'center', 'bold', 2);
  ctx.fillStyle = 'rgba(216,180,90,0.45)';
  ctx.fillRect(154, 92, 66, 1);
  ctx.fillRect(292, 92, 66, 1);
  drawSparkle(ctx, 256, 92.5, 3.2, '#d8b45a', 0.9);

  // prompt
  const p = 0.65 + Math.sin(t * 3.2) * 0.35;
  ctx.save();
  ctx.shadowColor = 'rgba(255,214,120,0.5)';
  ctx.shadowBlur = 8;
  label(ctx, 'PRESS ENTER TO DESCEND', W / 2, 258, 10, `rgba(245,223,149,${p})`, 'center', 'bold', 2);
  ctx.restore();
  label(
    ctx,
    'WASD / ARROWS  MOVE      SPACE  SWORD      E  INTERACT      M  MUTE',
    W / 2,
    276,
    6.5,
    'rgba(220,210,190,0.5)',
    'center',
    'bold',
    0.4
  );
  if (game.audio.muted) label(ctx, 'SOUND OFF', W - 12, 12, 7, 'rgba(255,120,120,0.8)', 'right');
}

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------
export function drawHUD(ctx, game) {
  const p = game.player;
  const showTransient = game.mode === 'playing';

  // heart backing
  roundRect(ctx, 8, 8, p.maxHp * 16 + 4, 18, 3);
  ctx.fillStyle = 'rgba(6,5,10,0.48)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,90,0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // hearts
  for (let i = 0; i < p.maxHp; i++) {
    drawPixelHeart(ctx, 12 + i * 16, 10, 2, '#ff5a6e', '#8a1f30', i >= p.hp);
  }

  // key + boss-key plate
  roundRect(ctx, 8, 28, 128, 22, 3);
  ctx.fillStyle = 'rgba(6,5,10,0.48)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,90,0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();
  const hasKeys = p.keys > 0;
  drawKeyIcon(ctx, 13, 31, 1.2, hasKeys ? COLORS.gold : '#5b5670', hasKeys);
  label(ctx, `× ${p.keys}`, 38, 34, 8, hasKeys ? COLORS.goldLight : 'rgba(255,255,255,0.4)');
  ctx.fillStyle = 'rgba(216,180,90,0.18)';
  ctx.fillRect(62, 32, 1, 14);

  // boss key slot
  if (p.bossKey) {
    drawBossKeyIcon(ctx, 68, 29, 1.12, true);
    label(ctx, 'BOSS', 96, 34, 7, COLORS.goldLight, 'left', 'bold', 1);
  } else {
    ctx.save();
    ctx.globalAlpha = 0.3;
    drawBossKeyIcon(ctx, 68, 29, 1.12, false);
    ctx.restore();
    label(ctx, 'BOSS', 96, 34, 7, 'rgba(255,255,255,0.28)', 'left', 'bold', 1);
  }

  // minimap
  const mx = W - 59;
  const my = 10;
  roundRect(ctx, mx, my, 49, 49, 3);
  ctx.fillStyle = 'rgba(6,5,10,0.66)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,90,0.28)';
  ctx.lineWidth = 1;
  ctx.stroke();
  for (let r = 0; r < 3; r++) {
    for (let col = 0; col < 3; col++) {
      const id = MAP_CELLS[r][col];
      if (!id) continue;
      const visited = game.visited.has(id);
      const current = id === game.roomId;
      const x = mx + 5 + col * 14;
      const y = my + 5 + r * 14;
      ctx.fillStyle = current
        ? 'rgba(216,180,90,0.92)'
        : visited
          ? 'rgba(92,82,124,0.88)'
          : 'rgba(255,255,255,0.045)';
      ctx.fillRect(x, y, 12, 12);
      ctx.strokeStyle = current
        ? '#fff3c4'
        : visited
          ? 'rgba(168,152,204,0.8)'
          : 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, 11, 11);
      if (id === '1,0' && visited) {
        ctx.fillStyle = '#d43a44';
        ctx.fillRect(x + 4, y + 5, 4, 2);
        ctx.fillRect(x + 5, y + 4, 2, 4);
      }
    }
  }
  // current-room pulse
  const cur = MAP_CELLS.flat().indexOf(game.roomId);
  if (cur >= 0) {
    const r = Math.floor(cur / 3);
    const col = cur % 3;
    const x = mx + 5 + col * 14;
    const y = my + 5 + r * 14;
    ctx.strokeStyle = `rgba(255,243,196,${0.35 + Math.sin(game.time * 4) * 0.25})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 1, y - 1, 14, 14);
  }

  // room banner
  if (game.roomBanner && showTransient) {
    const rb = game.roomBanner;
    const prog = 1 - rb.timer / rb.max;
    const alpha = clamp(Math.min(prog * 6, rb.timer * 2.2), 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    roundRect(ctx, W / 2 - 104, 31, 208, 20, 3);
    ctx.fillStyle = 'rgba(6,5,10,0.34)';
    ctx.fill();
    label(ctx, rb.name.toUpperCase(), W / 2, 35, 9, '#e9d493', 'center', 'bold', 3);
    ctx.fillStyle = 'rgba(216,180,90,0.5)';
    ctx.fillRect(W / 2 - 96, 47, 58, 1);
    ctx.fillRect(W / 2 + 38, 47, 58, 1);
    drawSparkle(ctx, W / 2, 47.5, 2.6, '#d8b45a', 0.9);
    ctx.restore();
  }

  // boss health
  const bossActive = showTransient && game.boss && !game.boss.dead && game.roomId === '1,0' && game.boss.state !== 'intro';
  if (bossActive) {
    const b = game.boss;
    const bw = 252;
    const bx = (W - bw) / 2;
    const by = H - 24;
    if (b.exposed > 0) {
      const a = 0.6 + Math.sin(game.time * 8) * 0.3;
      label(ctx, 'WEAK POINT EXPOSED — STRIKE', W / 2, by - 12, 7, `rgba(255,214,120,${a})`, 'center', 'bold', 2);
    } else {
      label(ctx, 'VAEL, THE HOLLOW EYE', W / 2, by - 12, 7, '#e7b7a7', 'center', 'bold', 2);
    }
    roundRect(ctx, bx - 3, by - 3, bw + 6, 15, 2);
    ctx.fillStyle = 'rgba(5,3,8,0.82)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(216,180,90,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    const segs = 12;
    const segW = (bw - 8 - (segs - 1) * 2) / segs;
    for (let i = 0; i < segs; i++) {
      const filled = i < Math.ceil((b.hp / b.maxHp) * segs);
      const sx = bx + 1 + i * (segW + 2);
      ctx.fillStyle = filled
        ? b.exposed > 0
          ? '#ff8a5a'
          : '#c23a44'
        : 'rgba(255,255,255,0.06)';
      ctx.fillRect(sx, by + 1, segW, 7);
      if (filled) {
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(sx, by + 1, segW, 1);
      }
    }
  }

  // toast
  if (game.toast && showTransient) {
    const toast = game.toast;
    const alpha = clamp(Math.min(toast.timer * 2.5, (toast.max - toast.timer) * 8 + 0.2), 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `bold 8px ${FONT}`;
    const tw = ctx.measureText(toast.text).width;
    const w = tw + 26;
    const y = bossActive ? H - 64 : H - 30;
    roundRect(ctx, W / 2 - w / 2, y, w, 18, 9);
    ctx.fillStyle = 'rgba(6,5,10,0.86)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(216,180,90,0.36)';
    ctx.lineWidth = 1;
    ctx.stroke();
    label(ctx, toast.text, W / 2, y + 5, 8, '#f0e6c8', 'center');
    ctx.restore();
  }

  // first-room controls hint
  if (showTransient && game.hintTimer > 0 && game.roomId === '1,2') {
    const a = clamp(game.hintTimer, 0, 1) * 0.7;
    label(
      ctx,
      'WASD MOVE   ·   SPACE SWORD   ·   E USE',
      W / 2,
      H - 46,
      6.5,
      `rgba(220,210,190,${a})`,
      'center',
      'bold',
      1
    );
  }

  // boss intro banner
  if (game.bossBanner > 0 && showTransient) {
    const t = game.bossBanner;
    const alpha = clamp(Math.min((3.2 - t) * 3.2, t * 2.2), 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(3,2,6,0.78)';
    ctx.fillRect(0, 0, W, 26);
    ctx.fillRect(0, H - 26, W, 26);
    serif(ctx, 'VAEL, THE HOLLOW EYE', W / 2, H / 2 - 12, 19, '#f0d9a0', 'center', 3);
    label(ctx, 'THE LAST DOOR', W / 2, H / 2 + 10, 7, '#c98f86', 'center', 'bold', 4);
    ctx.fillStyle = 'rgba(200,70,80,0.65)';
    ctx.fillRect(W / 2 - 60, H / 2 + 24, 120, 1);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Modal screens
// ---------------------------------------------------------------------------
function drawMessage(ctx, game) {
  const m = game.message;
  ctx.fillStyle = 'rgba(2,1,5,0.32)';
  ctx.fillRect(0, 0, W, H);
  const x = 28;
  const y = H - 86;
  const w = W - 56;
  const h = 68;
  roundRect(ctx, x, y, w, h, 4);
  ctx.fillStyle = 'rgba(8,6,12,0.94)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,90,0.7)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 3);
  ctx.strokeStyle = 'rgba(216,180,90,0.18)';
  ctx.lineWidth = 1;
  ctx.stroke();
  drawSparkle(ctx, x + w / 2, y, 3, '#d8b45a', 0.9);

  let remain = Math.floor(m.shown);
  const total = m.lines.join('').length;
  m.lines.forEach((line, i) => {
    if (remain <= 0) return;
    const part = line.slice(0, remain);
    remain -= line.length;
    label(
      ctx,
      part,
      x + 14,
      y + 12 + i * 14,
      i === 0 ? 10 : 8,
      i === 0 ? '#e9d493' : '#e7e0ce',
      'left',
      'bold',
      i === 0 ? 1.5 : 0.2
    );
  });
  if (m.shown >= total) {
    const a = 0.55 + Math.sin(game.time * 5) * 0.4;
    label(ctx, 'E ▸', x + w - 18, y + h - 18, 8, `rgba(245,223,149,${a})`, 'right');
  }
}

function drawReward(ctx, game) {
  const r = game.reward;
  ctx.fillStyle = 'rgba(3,2,7,0.74)';
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2 - 16;

  // rays
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(game.time * 0.25);
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.fillStyle = i % 2 ? 'rgba(216,180,90,0.05)' : 'rgba(216,180,90,0.09)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(160, -14);
    ctx.lineTo(160, 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
  glow.addColorStop(0, 'rgba(255,214,120,0.3)');
  glow.addColorStop(1, 'rgba(255,214,120,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 100, cy - 100, 200, 200);

  const bob = Math.sin(game.time * 2.4) * 3;
  if (r.kind === 'key') drawKeyIcon(ctx, cx - 22, cy - 18 + bob, 2.1, COLORS.gold, true);
  else if (r.kind === 'bossKey') drawBossKeyIcon(ctx, cx - 26, cy - 26 + bob, 2.2, true);
  else drawPixelHeart(ctx, cx - 18, cy - 16 + bob, 5, '#ff5a6e', '#8a1f30');

  for (let i = 0; i < 8; i++) {
    const a = game.time * 1.6 + (i / 8) * Math.PI * 2;
    const rad = 46 + Math.sin(game.time * 3 + i) * 7;
    drawSparkle(ctx, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.7, 2.2, '#ffe9a8', 0.7);
  }

  label(ctx, 'ITEM GET', cx, cy - 66, 7, 'rgba(216,180,90,0.7)', 'center', 'bold', 4);
  serif(ctx, r.title, cx, cy + 46, 22, '#f5df95', 'center', 3);
  label(ctx, r.subtitle, cx, cy + 66, 8, '#d9d0bb', 'center', 'bold', 0.5);
  if (r.timer < 2.0) {
    const a = 0.55 + Math.sin(game.time * 5) * 0.4;
    label(ctx, 'PRESS SPACE', cx, cy + 90, 7, `rgba(245,223,149,${a})`, 'center', 'bold', 1.5);
  }
}

function drawPause(ctx, game) {
  ctx.fillStyle = 'rgba(3,2,7,0.76)';
  ctx.fillRect(0, 0, W, H);
  const x = 88;
  const y = 40;
  const w = 336;
  const h = 208;
  roundRect(ctx, x, y, w, h, 5);
  ctx.fillStyle = 'rgba(10,8,15,0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,90,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  serif(ctx, 'PAUSED', W / 2, y + 26, 24, '#f5df95', 'center', 4);
  ctx.fillStyle = 'rgba(216,180,90,0.35)';
  ctx.fillRect(W / 2 - 44, y + 44, 88, 1);

  label(ctx, 'THE HOLLOW VAULT', W / 2, y + 54, 7, 'rgba(216,180,90,0.7)', 'center', 'bold', 2);
  label(ctx, ROOMS[game.roomId].name.toUpperCase(), W / 2, y + 66, 8, '#e7e0ce', 'center', 'bold', 1.5);

  const lines = [
    ['WASD / ARROWS', 'MOVE'],
    ['SPACE', 'SWORD'],
    ['E', 'INTERACT / READ'],
    ['P / ESC', 'RESUME'],
    ['M', 'MUTE'],
  ];
  lines.forEach(([k, v], i) => {
    const yy = y + 88 + i * 14;
    label(ctx, k, x + 24, yy, 8, '#e9d493', 'left', 'bold', 1);
    label(ctx, v, x + 118, yy, 8, '#cfc7b5', 'left');
  });

  // status column
  ctx.fillStyle = 'rgba(216,180,90,0.18)';
  ctx.fillRect(x + w - 126, y + 84, 1, 62);
  label(ctx, `KEYS ${game.player.keys}`, x + w - 20, y + 88, 8, COLORS.goldLight, 'right', 'bold', 1);
  label(ctx, game.player.bossKey ? 'BOSS KEY' : 'NO BOSS KEY', x + w - 20, y + 102, 7, game.player.bossKey ? '#ffd27a' : 'rgba(255,255,255,0.3)', 'right', 'bold', 1);
  label(ctx, `TIME ${formatTime(game.runTime)}`, x + w - 20, y + 116, 7, 'rgba(220,210,190,0.7)', 'right', 'bold', 0.5);
  label(ctx, `FOES ${game.kills}`, x + w - 20, y + 128, 7, 'rgba(220,210,190,0.7)', 'right', 'bold', 0.5);

  const a = 0.55 + Math.sin(game.time * 4) * 0.4;
  label(ctx, 'P / ESC TO RESUME', W / 2, y + h - 20, 8, `rgba(245,223,149,${a})`, 'center', 'bold', 2);
}

function drawDead(ctx, game) {
  const a = clamp((game.deathTimer - 0.45) / 0.7, 0, 1);
  if (a <= 0) return;
  ctx.fillStyle = `rgba(4,2,6,${0.76 * a})`;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = a;
  serif(ctx, 'YOU FELL', W / 2, H / 2 - 34, 32, '#e05a5a', 'center', 6);
  label(ctx, 'THE VAULT REMEMBERS', W / 2, H / 2 + 4, 8, 'rgba(220,190,180,0.75)', 'center', 'bold', 3);
  label(
    ctx,
    `KEYS RETAINED ${game.player.keys}   ·   FOES ${game.kills}`,
    W / 2,
    H / 2 + 24,
    7,
    'rgba(220,210,190,0.55)',
    'center',
    'bold',
    1
  );
  if (game.deathTimer > 1.1) {
    const p = 0.55 + Math.sin(game.time * 4) * 0.4;
    label(ctx, 'PRESS ENTER TO RISE', W / 2, H / 2 + 58, 9, `rgba(245,223,149,${p})`, 'center', 'bold', 2);
  }
  ctx.restore();
}

function drawVictory(ctx, game) {
  const a = clamp(game.victoryTime / 1.0, 0, 1);
  ctx.fillStyle = `rgba(4,3,8,${0.72 * a})`;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = a;

  // gold rays
  ctx.save();
  ctx.translate(W / 2, 82);
  ctx.rotate(game.time * 0.18);
  for (let i = 0; i < 16; i++) {
    ctx.rotate(Math.PI / 8);
    ctx.fillStyle = i % 2 ? 'rgba(216,180,90,0.04)' : 'rgba(216,180,90,0.08)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(210, -18);
    ctx.lineTo(210, 18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  serif(ctx, 'DUNGEON CLEARED', W / 2, 66, 28, '#f5df95', 'center', 4);
  label(ctx, 'THE HOLLOW EYE IS BLIND', W / 2, 94, 8, '#d8c9a8', 'center', 'bold', 3);
  ctx.fillStyle = 'rgba(216,180,90,0.4)';
  ctx.fillRect(W / 2 - 110, 110, 220, 1);

  const stats = [
    ['TIME', formatTime(game.runTime)],
    ['FOES FELLED', `${game.kills}`],
    ['DEATHS', `${game.deaths}`],
    ['HEARTS', `${game.player.maxHp}`],
  ];
  stats.forEach(([k, v], i) => {
    const y = 132 + i * 18;
    label(ctx, k, W / 2 - 20, y, 8, 'rgba(216,180,90,0.75)', 'right', 'bold', 1.5);
    label(ctx, v, W / 2 + 20, y, 8, '#eee6d3', 'left', 'bold', 1);
  });

  for (let i = 0; i < 10; i++) {
    const ang = game.time * 0.9 + (i / 10) * Math.PI * 2;
    const rad = 120 + Math.sin(game.time * 2 + i) * 12;
    drawSparkle(ctx, W / 2 + Math.cos(ang) * rad, 110 + Math.sin(ang) * 36, 2, '#ffe9a8', 0.55);
  }

  if (game.victoryTime > 1.4) {
    const p = 0.55 + Math.sin(game.time * 4) * 0.4;
    label(ctx, 'PRESS ENTER TO DESCEND AGAIN', W / 2, 236, 9, `rgba(245,223,149,${p})`, 'center', 'bold', 2);
  }
  ctx.restore();
}

export function drawOverlays(ctx, game) {
  if (game.mode === 'message') drawMessage(ctx, game);
  else if (game.mode === 'reward') drawReward(ctx, game);
  else if (game.mode === 'paused') drawPause(ctx, game);
  else if (game.mode === 'dead') drawDead(ctx, game);
  else if (game.mode === 'victory') drawVictory(ctx, game);
}
