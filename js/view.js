import { W, H, TILE, COLORS, hash, rand, clamp } from './config.js';
import { ROOMS } from './world.js';
import {
  drawChest, drawPot, drawSign, drawFlame, drawTorchBracket, drawPickup,
  drawProjectile, drawParticle, rect, shadow,
} from './sprites.js';

const c = (n) => n * TILE + TILE / 2;

export class WorldView {
  constructor() {
    this.bgCache = new Map();
  }

  // -------------------------------------------------------------------------
  // Room background cache
  // -------------------------------------------------------------------------
  getBackground(roomId) {
    if (this.bgCache.has(roomId)) return this.bgCache.get(roomId);
    const room = ROOMS[roomId];
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#0a0810';
    g.fillRect(0, 0, W, H);

    // floor
    for (let y = 1; y <= 16; y++) {
      for (let x = 1; x <= 30; x++) this.drawFloorTile(g, x * TILE, y * TILE, x, y);
    }

    // thresholds beneath every door
    if (room.doors.n) {
      this.drawFloorTile(g, 15 * TILE, 0, 15, 0);
      this.drawFloorTile(g, 16 * TILE, 0, 16, 0);
    }
    if (room.doors.s) {
      this.drawFloorTile(g, 15 * TILE, 17 * TILE, 15, 17);
      this.drawFloorTile(g, 16 * TILE, 17 * TILE, 16, 17);
    }
    if (room.doors.w) {
      this.drawFloorTile(g, 0, 8 * TILE, 0, 8);
      this.drawFloorTile(g, 0, 9 * TILE, 0, 9);
    }
    if (room.doors.e) {
      this.drawFloorTile(g, 31 * TILE, 8 * TILE, 31, 8);
      this.drawFloorTile(g, 31 * TILE, 9 * TILE, 31, 9);
    }

    if (room.carpet) this.drawCarpet(g, room.carpet);
    if (room.mosaic) this.drawMosaic(g, room.mosaic, room.boss);

    // walls
    const doorTiles = new Set();
    for (const dir of Object.keys(room.doors)) {
      if (dir === 'n') { doorTiles.add('15,0'); doorTiles.add('16,0'); }
      if (dir === 's') { doorTiles.add('15,17'); doorTiles.add('16,17'); }
      if (dir === 'w') { doorTiles.add('0,8'); doorTiles.add('0,9'); }
      if (dir === 'e') { doorTiles.add('31,8'); doorTiles.add('31,9'); }
    }
    for (let x = 0; x < 32; x++) {
      for (const y of [0, 17]) {
        if (!doorTiles.has(`${x},${y}`)) this.drawWallTile(g, x * TILE, y * TILE, x, y, y === 0 ? 'n' : 's');
      }
    }
    for (let y = 1; y < 17; y++) {
      if (!doorTiles.has(`0,${y}`)) this.drawWallTile(g, 0, y * TILE, 0, y, 'w');
      if (!doorTiles.has(`31,${y}`)) this.drawWallTile(g, 31 * TILE, y * TILE, 31, y, 'e');
    }

    // inner shadow around the room
    let grad = g.createLinearGradient(0, TILE, 0, TILE + 34);
    grad.addColorStop(0, 'rgba(3,2,7,0.62)');
    grad.addColorStop(1, 'rgba(3,2,7,0)');
    g.fillStyle = grad;
    g.fillRect(TILE, TILE, W - TILE * 2, 34);
    grad = g.createLinearGradient(0, H - TILE, 0, H - TILE - 30);
    grad.addColorStop(0, 'rgba(3,2,7,0.55)');
    grad.addColorStop(1, 'rgba(3,2,7,0)');
    g.fillStyle = grad;
    g.fillRect(TILE, H - TILE - 30, W - TILE * 2, 30);
    grad = g.createLinearGradient(TILE, 0, TILE + 30, 0);
    grad.addColorStop(0, 'rgba(3,2,7,0.5)');
    grad.addColorStop(1, 'rgba(3,2,7,0)');
    g.fillStyle = grad;
    g.fillRect(TILE, TILE, 30, H - TILE * 2);
    grad = g.createLinearGradient(W - TILE, 0, W - TILE - 30, 0);
    grad.addColorStop(0, 'rgba(3,2,7,0.5)');
    grad.addColorStop(1, 'rgba(3,2,7,0)');
    g.fillStyle = grad;
    g.fillRect(W - TILE - 30, TILE, 30, H - TILE * 2);

    for (const b of room.banners || []) this.drawBanner(g, b);
    if (room.boss) this.drawChains(g);
    for (const p of room.props || []) {
      if (p.type === 'pillar') this.drawPillar(g, p);
      else if (p.type === 'statue') this.drawStatue(g, p);
      else if (p.type === 'brazier') this.drawBrazier(g, p);
      else if (p.type === 'rubble') this.drawRubble(g, p);
      else if (p.type === 'bones') this.drawBones(g, p);
    }

    for (const t of room.torches || []) this.drawTorchBracketFor(g, t);

    // faint wall grime
    g.globalAlpha = 0.1;
    g.fillStyle = '#000';
    for (let i = 0; i < 20; i++) {
      const x = hash(i, 3) * W;
      const y = hash(i, 7) * H;
      g.fillRect(x, y, 1, 1);
    }
    g.globalAlpha = 1;

    this.bgCache.set(roomId, cv);
    return cv;
  }

  drawFloorTile(g, px, py, x, y) {
    const n = hash(x, y);
    const base = n > 0.66 ? '#201e2f' : n > 0.3 ? '#1c1a29' : '#191725';
    g.fillStyle = base;
    g.fillRect(px, py, TILE, TILE);
    // bevel
    g.fillStyle = 'rgba(255,255,255,0.035)';
    g.fillRect(px, py, TILE, 1);
    g.fillRect(px, py, 1, TILE);
    g.fillStyle = 'rgba(0,0,0,0.24)';
    g.fillRect(px, py + TILE - 1, TILE, 1);
    g.fillRect(px + TILE - 1, py, 1, TILE);
    // seams
    g.fillStyle = 'rgba(6,5,10,0.45)';
    g.fillRect(px, py + 8, TILE, 1);
    g.fillRect(px + 8, py, 1, TILE);
    if (n > 0.88) {
      g.strokeStyle = 'rgba(0,0,0,0.4)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(px + 4, py + 3);
      g.lineTo(px + 8, py + 7);
      g.lineTo(px + 6, py + 12);
      g.stroke();
    }
    if (n < 0.035) {
      g.fillStyle = 'rgba(70,105,66,0.22)';
      g.beginPath();
      g.arc(px + 5, py + 11, 2.2, 0, Math.PI * 2);
      g.arc(px + 9, py + 9, 1.4, 0, Math.PI * 2);
      g.fill();
    }
  }

  drawWallTile(g, px, py, x, y, side) {
    const n = hash(x * 2 + 11, y * 3 + 7);
    g.fillStyle = '#2b2840';
    g.fillRect(px, py, TILE, TILE);
    g.fillStyle = n > 0.5 ? '#322e4a' : '#2e2a45';
    g.fillRect(px + 1, py + 2, TILE - 2, TILE - 4);
    // top face
    g.fillStyle = '#484463';
    g.fillRect(px, py, TILE, 2);
    g.fillStyle = '#3c3856';
    g.fillRect(px, py + 2, TILE, 2);
    // bottom shadow
    g.fillStyle = '#171522';
    g.fillRect(px, py + TILE - 3, TILE, 3);
    // brick seams
    g.fillStyle = 'rgba(8,7,14,0.55)';
    g.fillRect(px, py + 8, TILE, 1);
    const seamX = y % 2 === 0 ? px + 5 : px + 11;
    g.fillRect(seamX, py + 2, 1, 6);
    g.fillRect(y % 2 === 0 ? px + 12 : px + 3, py + 9, 1, 5);
    // highlights
    g.fillStyle = 'rgba(255,255,255,0.05)';
    g.fillRect(px + 1, py + 3, TILE - 2, 1);
    if (n > 0.82) {
      g.strokeStyle = 'rgba(10,8,16,0.65)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(px + 3, py + 4);
      g.lineTo(px + 6, py + 7);
      g.lineTo(px + 5, py + 12);
      g.stroke();
    }
    if (n < 0.07) {
      g.fillStyle = 'rgba(72,104,66,0.32)';
      g.fillRect(px + 2, py + 11, 3, 2);
      g.fillRect(px + 4, py + 9, 2, 3);
    }
    if (side === 'n' && y === 0) {
      g.fillStyle = 'rgba(4,3,8,0.9)';
      g.fillRect(px, py, TILE, 1);
    }
  }

  drawCarpet(g, kind) {
    const left = W / 2 - 24;
    const right = W / 2 + 24;
    const drawStrip = (x, y, w, h) => {
      g.fillStyle = '#4d1923';
      g.fillRect(x, y, w, h);
      g.fillStyle = '#5c202b';
      g.fillRect(x + 3, y + 3, w - 6, h - 6);
      g.strokeStyle = 'rgba(200,164,74,0.45)';
      g.lineWidth = 2;
      g.strokeRect(x + 1, y + 1, w - 2, h - 2);
      g.strokeStyle = 'rgba(30,10,14,0.6)';
      g.lineWidth = 1;
      g.strokeRect(x + 5, y + 5, w - 10, h - 10);
      // diamond pattern
      g.fillStyle = 'rgba(216,180,90,0.1)';
      for (let yy = y + 12; yy < y + h - 8; yy += 22) {
        for (let xx = x + 12; xx < x + w - 8; xx += 22) {
          g.beginPath();
          g.moveTo(xx, yy - 4);
          g.lineTo(xx + 4, yy);
          g.lineTo(xx, yy + 4);
          g.lineTo(xx - 4, yy);
          g.closePath();
          g.fill();
        }
      }
    };
    if (kind === 'vertical') drawStrip(left, TILE, right - left, H - TILE * 2);
    if (kind === 'cross') {
      drawStrip(left, TILE, right - left, H - TILE * 2);
      drawStrip(TILE, H / 2 - 24, W - TILE * 2, 48);
    }
  }

  drawMosaic(g, mosaic, boss) {
    const x = c(mosaic.tx);
    const y = c(mosaic.ty);
    const r = mosaic.r;
    g.save();
    g.translate(x, y);
    g.globalAlpha = 0.62;
    g.strokeStyle = boss ? 'rgba(190,72,86,0.55)' : 'rgba(94,178,170,0.4)';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 1;
    g.strokeStyle = 'rgba(216,180,90,0.34)';
    g.beginPath();
    g.arc(0, 0, r - 7, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(0, 0, r - 18, 0, Math.PI * 2);
    g.stroke();
    // rune marks
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.save();
      g.rotate(a);
      g.fillStyle = boss ? 'rgba(200,78,88,0.4)' : 'rgba(216,180,90,0.32)';
      g.beginPath();
      g.moveTo(r - 14, -3);
      g.lineTo(r - 8, 0);
      g.lineTo(r - 14, 3);
      g.closePath();
      g.fill();
      g.restore();
    }
    // central motif
    g.strokeStyle = boss ? 'rgba(210,88,92,0.62)' : 'rgba(79,185,176,0.5)';
    g.lineWidth = 2;
    if (boss) {
      g.beginPath();
      g.ellipse(0, 0, 20, 11, 0, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = 'rgba(210,88,92,0.55)';
      g.beginPath();
      g.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(10,6,12,0.9)';
      g.fillRect(-1.5, -8, 3, 16);
    } else {
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
        g.beginPath();
        g.moveTo(Math.cos(a) * 17, Math.sin(a) * 17);
        g.lineTo(Math.cos(a + 2.2) * 17, Math.sin(a + 2.2) * 17);
        g.lineTo(Math.cos(a + 1.1) * 8, Math.sin(a + 1.1) * 8);
        g.closePath();
        g.stroke();
      }
    }
    g.restore();
    g.globalAlpha = 1;
  }

  drawBanner(g, b) {
    const x = b.tx * TILE + 8;
    const top = 3;
    g.fillStyle = 'rgba(4,3,8,0.5)';
    g.fillRect(x - 9, top + 3, 18, 2);
    rect(g, x - 9, top, 18, 2, '#3a2a1a');
    rect(g, x - 9, top, 2, 2, COLORS.gold);
    rect(g, x + 7, top, 2, 2, COLORS.gold);
    g.fillStyle = '#17121f';
    g.beginPath();
    g.moveTo(x - 8, top + 2);
    g.lineTo(x + 8, top + 2);
    g.lineTo(x + 8, top + 25);
    g.lineTo(x, top + 21);
    g.lineTo(x - 8, top + 25);
    g.closePath();
    g.fill();
    g.fillStyle = '#6c1f2c';
    g.beginPath();
    g.moveTo(x - 6, top + 3);
    g.lineTo(x + 6, top + 3);
    g.lineTo(x + 6, top + 23);
    g.lineTo(x, top + 19);
    g.lineTo(x - 6, top + 23);
    g.closePath();
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.08)';
    g.fillRect(x - 5, top + 4, 2, 17);
    g.strokeStyle = 'rgba(216,180,90,0.6)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x - 6, top + 3);
    g.lineTo(x + 6, top + 3);
    g.stroke();
    g.fillStyle = COLORS.gold;
    g.beginPath();
    g.moveTo(x, top + 8);
    g.lineTo(x + 4, top + 13);
    g.lineTo(x, top + 18);
    g.lineTo(x - 4, top + 13);
    g.closePath();
    g.fill();
    g.fillStyle = '#5b1d29';
    g.beginPath();
    g.moveTo(x, top + 10);
    g.lineTo(x + 2, top + 13);
    g.lineTo(x, top + 16);
    g.lineTo(x - 2, top + 13);
    g.closePath();
    g.fill();
  }

  drawPillar(g, p) {
    const x = p.tx * TILE;
    const y = p.ty * TILE;
    shadow(g, x + 16, y + 32, 17, 5, 0.45);
    // base
    rect(g, x + 1, y + 22, 30, 9, '#171522');
    rect(g, x + 2, y + 21, 28, 7, '#3b3652');
    rect(g, x + 2, y + 21, 28, 2, '#555070');
    rect(g, x + 4, y + 27, 24, 2, '#252236');
    // column
    rect(g, x + 5, y - 10, 22, 33, '#171522');
    rect(g, x + 6, y - 9, 20, 31, '#3f3a59');
    rect(g, x + 7, y - 8, 7, 29, '#4b4668');
    rect(g, x + 17, y - 6, 8, 26, '#332f4b');
    // bands
    rect(g, x + 6, y + 2, 20, 2, '#2a2640');
    rect(g, x + 6, y + 14, 20, 2, '#2a2640');
    // capital
    rect(g, x + 1, y - 16, 30, 8, '#171522');
    rect(g, x + 2, y - 15, 28, 6, '#4a4566');
    rect(g, x + 2, y - 15, 28, 2, '#5e587d');
    // highlight
    rect(g, x + 7, y - 6, 2, 24, 'rgba(255,255,255,0.06)');
    if (hash(p.tx, p.ty) > 0.5) {
      g.strokeStyle = 'rgba(10,8,16,0.5)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x + 15, y - 2);
      g.lineTo(x + 18, y + 4);
      g.lineTo(x + 16, y + 8);
      g.stroke();
    }
  }

  drawStatue(g, p) {
    const x = p.tx * TILE + 16;
    const y = p.ty * TILE + 16;
    shadow(g, x, y + 18, 16, 5, 0.42);
    rect(g, x - 14, y + 10, 28, 9, '#171522');
    rect(g, x - 13, y + 9, 26, 7, '#3a3650');
    rect(g, x - 13, y + 9, 26, 2, '#4d4868');
    // figure
    rect(g, x - 8, y - 8, 16, 18, '#171522');
    rect(g, x - 7, y - 7, 14, 16, '#4a5a5e');
    rect(g, x - 6, y - 6, 12, 4, '#5d7376');
    rect(g, x - 5, y - 15, 10, 9, '#171522');
    rect(g, x - 4, y - 14, 8, 7, '#5d7376');
    rect(g, x - 3, y - 12, 6, 2, '#1b2a2a');
    // sword
    rect(g, x + 7, y - 12, 2, 22, '#171522');
    rect(g, x + 7, y - 11, 1, 18, '#8b9a9e');
    rect(g, x + 5, y + 5, 6, 1, COLORS.goldDark);
    // shield
    rect(g, x - 12, y - 5, 6, 10, '#171522');
    rect(g, x - 11, y - 4, 4, 8, '#5b4a32');
    rect(g, x - 10, y - 2, 2, 3, COLORS.goldDark);
    // moss
    g.fillStyle = 'rgba(80,120,90,0.25)';
    g.fillRect(x - 6, y + 2, 4, 2);
    g.fillRect(x + 2, y - 14, 3, 2);
  }

  drawRubble(g, p) {
    const x = p.tx * TILE + 8;
    const y = p.ty * TILE + 8;
    const n = hash(p.tx, p.ty);
    for (let i = 0; i < 4; i++) {
      const ox = (hash(p.tx + i, p.ty) - 0.5) * 16;
      const oy = (hash(p.tx, p.ty + i) - 0.5) * 12;
      const s = 2 + hash(i, p.tx) * 3;
      rect(g, x + ox - s / 2, y + oy - s / 2, s, s * 0.8, i % 2 ? '#3a3550' : '#2b2740');
      rect(g, x + ox - s / 2, y + oy - s / 2, s, 1, 'rgba(255,255,255,0.07)');
    }
    if (n > 0.6) {
      g.fillStyle = 'rgba(74,106,70,0.25)';
      g.fillRect(x - 2, y + 3, 4, 2);
    }
  }

  drawChains(g) {
    const chains = [
      [86, 42],
      [126, 64],
      [386, 50],
      [426, 34],
    ];
    for (const [x, len] of chains) {
      g.strokeStyle = 'rgba(80,72,96,0.42)';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + 4, len);
      g.stroke();
      for (let y = 6; y < len; y += 10) {
        g.fillStyle = 'rgba(122,112,138,0.32)';
        g.fillRect(x + (y / len) * 4 - 2, y, 4, 2);
      }
    }
  }

  drawBrazier(g, p) {
    const x = p.tx * TILE + 8;
    const y = p.ty * TILE + 8;
    shadow(g, x, y + 7, 7, 2.4, 0.36);
    rect(g, x - 4, y - 1, 8, 8, '#171522');
    rect(g, x - 3, y, 6, 6, '#3d3a52');
    rect(g, x - 3, y, 6, 1, '#565170');
    rect(g, x - 7, y - 5, 14, 4, '#171522');
    rect(g, x - 6, y - 4, 12, 2, '#5a4a2e');
    rect(g, x - 5, y - 5, 10, 1, '#8a6f3a');
    rect(g, x - 4, y - 3, 8, 1, '#ff8a3a');
  }

  drawBones(g, p) {
    const x = p.tx * TILE + 8;
    const y = p.ty * TILE + 8;
    g.save();
    g.translate(x, y);
    g.fillStyle = '#bdb6a4';
    g.strokeStyle = '#17121f';
    g.lineWidth = 1;
    // skull
    g.beginPath();
    g.ellipse(-2, -1, 4.5, 4, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.fillStyle = '#17121f';
    g.fillRect(-4, -2, 1.5, 2);
    g.fillRect(-0.5, -2, 1.5, 2);
    // bones
    g.strokeStyle = '#bdb6a4';
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(4, 3);
    g.lineTo(10, -3);
    g.moveTo(5, 6);
    g.lineTo(9, 8);
    g.stroke();
    g.fillStyle = '#bdb6a4';
    g.fillRect(9, -4, 2, 2);
    g.fillRect(9, 7, 2, 2);
    g.restore();
  }

  drawTorchBracketFor(g, t) {
    const pos = { n: [t.tx * TILE + 8, 10], s: [t.tx * TILE + 8, H - 11], w: [14, t.ty * TILE + 8], e: [W - 14, t.ty * TILE + 8] }[t.dir];
    // scorch mark
    const grd = g.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], 18);
    grd.addColorStop(0, 'rgba(0,0,0,0.45)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(pos[0] - 18, pos[1] - 18, 36, 36);
    drawTorchBracket(g, pos[0], pos[1], t.dir);
  }

  // -------------------------------------------------------------------------
  // Doors
  // -------------------------------------------------------------------------
  drawDoor(ctx, dir, state, game) {
    ctx.save();
    if (dir === 'n') ctx.translate(240, 0);
    else if (dir === 's') { ctx.translate(272, H); ctx.rotate(Math.PI); }
    else if (dir === 'w') { ctx.translate(0, 160); ctx.rotate(-Math.PI / 2); }
    else { ctx.translate(W, 128); ctx.rotate(Math.PI / 2); }

    // stone jambs
    ctx.fillStyle = '#171522';
    ctx.fillRect(-6, 0, 6, 24);
    ctx.fillRect(32, 0, 6, 24);
    ctx.fillStyle = '#474263';
    ctx.fillRect(-5, 0, 4, 22);
    ctx.fillRect(32, 0, 4, 22);
    ctx.fillStyle = '#625c85';
    ctx.fillRect(-5, 0, 1, 22);
    ctx.fillRect(32, 0, 1, 22);
    ctx.fillStyle = '#211e30';
    ctx.fillRect(-6, 20, 44, 4);
    ctx.fillStyle = '#3a3550';
    ctx.fillRect(-6, 20, 44, 1);
    // lintel
    ctx.fillStyle = '#211e30';
    ctx.fillRect(-2, 0, 36, 4);
    ctx.fillStyle = '#4c4768';
    ctx.fillRect(-2, 0, 36, 1);
    ctx.fillStyle = '#2f2b45';
    ctx.fillRect(-2, 3, 36, 1);
    ctx.fillStyle = '#6a648c';
    ctx.fillRect(5, 0, 2, 1);
    ctx.fillRect(25, 0, 2, 1);

    if (state === 'open') {
      const grd = ctx.createLinearGradient(0, 0, 0, 20);
      grd.addColorStop(0, '#030207');
      grd.addColorStop(0.55, '#0a0812');
      grd.addColorStop(1, '#171324');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 32, 20);
      // faint corridor light
      const glow = ctx.createRadialGradient(16, 18, 0, 16, 18, 22);
      glow.addColorStop(0, 'rgba(120,150,200,0.09)');
      glow.addColorStop(1, 'rgba(120,150,200,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 32, 20);
      // threshold stones
      ctx.fillStyle = '#2f2b45';
      ctx.fillRect(0, 13, 32, 7);
      ctx.fillStyle = '#5a5478';
      ctx.fillRect(0, 13, 32, 1);
      ctx.fillStyle = '#211e30';
      ctx.fillRect(0, 18, 32, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(2, 14, 28, 1);
      ctx.fillStyle = COLORS.goldDark;
      ctx.fillRect(1, 13, 2, 2);
      ctx.fillRect(29, 13, 2, 2);
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, 2, 20);
      ctx.fillRect(30, 0, 2, 20);
    } else if (state === 'locked') {
      ctx.fillStyle = '#080610';
      ctx.fillRect(0, 0, 32, 20);
      // portcullis
      for (let x = 3; x < 30; x += 6) {
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(x, 1, 3, 17);
        ctx.fillStyle = '#8a7448';
        ctx.fillRect(x + 1, 2, 1, 15);
      }
      for (const y of [5, 11, 17]) {
        ctx.fillStyle = '#3a2e1c';
        ctx.fillRect(2, y, 28, 2);
        ctx.fillStyle = '#9d824d';
        ctx.fillRect(2, y, 28, 1);
      }
      // lock plate
      const hasKey = game.player.keys > 0;
      const pulse = 0.55 + Math.sin(game.time * 3) * 0.2;
      ctx.fillStyle = hasKey ? `rgba(216,180,90,${pulse})` : '#5b4a2a';
      ctx.fillRect(12, 7, 8, 8);
      ctx.fillStyle = '#2a1c08';
      ctx.fillRect(15, 10, 2, 3);
      ctx.beginPath();
      ctx.arc(16, 9, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (state === 'boss') {
      // ornate double door
      ctx.fillStyle = '#080610';
      ctx.fillRect(0, 0, 32, 20);
      const grd = ctx.createLinearGradient(0, 0, 0, 20);
      grd.addColorStop(0, '#2b2020');
      grd.addColorStop(1, '#1a1218');
      ctx.fillStyle = grd;
      ctx.fillRect(1, 1, 30, 19);
      // panels
      ctx.fillStyle = '#171018';
      ctx.fillRect(3, 3, 11, 15);
      ctx.fillRect(18, 3, 11, 15);
      ctx.strokeStyle = '#9a7938';
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, 11, 15);
      ctx.strokeRect(18, 3, 11, 15);
      // center seam + chains
      ctx.fillStyle = '#0c080e';
      ctx.fillRect(15, 0, 2, 20);
      ctx.strokeStyle = '#5e4a2a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(13, 11);
      ctx.moveTo(30, 2);
      ctx.lineTo(19, 11);
      ctx.stroke();
      // eye
      const pulse = 0.7 + Math.sin(game.time * 4) * 0.25;
      const glow = ctx.createRadialGradient(16, 10, 0, 16, 10, 11);
      glow.addColorStop(0, `rgba(255,80,70,${0.45 * pulse})`);
      glow.addColorStop(1, 'rgba(255,80,70,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(5, -1, 22, 22);
      ctx.fillStyle = '#e8d8b0';
      ctx.beginPath();
      ctx.ellipse(16, 10, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c02e34';
      ctx.beginPath();
      ctx.arc(16, 10, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#160a0c';
      ctx.fillRect(15.2, 8.4, 1.6, 3.2);
      // gold studs
      ctx.fillStyle = COLORS.gold;
      for (const [sx, sy] of [[5, 5], [27, 5], [5, 17], [27, 17]]) ctx.fillRect(sx, sy, 2, 2);
    } else if (state === 'sealed') {
      ctx.fillStyle = '#2a2740';
      ctx.fillRect(0, 0, 32, 20);
      ctx.fillStyle = '#34304d';
      ctx.fillRect(1, 1, 30, 18);
      ctx.fillStyle = 'rgba(10,8,16,0.55)';
      ctx.fillRect(0, 9, 32, 1);
      ctx.fillRect(10, 0, 1, 20);
      ctx.fillRect(21, 0, 1, 20);
      const pulse = 0.5 + Math.sin(game.time * 2.4) * 0.2;
      ctx.strokeStyle = `rgba(200,70,80,${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(16, 10, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 5);
      ctx.lineTo(19, 10);
      ctx.lineTo(16, 15);
      ctx.lineTo(13, 10);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // Scene
  // -------------------------------------------------------------------------
  drawScene(ctx, game, snapshot = false) {
    const room = ROOMS[game.roomId];
    const shake = snapshot ? 0 : game.shake;
    ctx.save();
    if (shake > 0.2) ctx.translate(Math.round(rand(-shake, shake)), Math.round(rand(-shake, shake)));

    ctx.drawImage(this.getBackground(game.roomId), 0, 0);

    for (const dir of ['n', 's', 'w', 'e']) {
      const state = game.doorStates[game.roomId]?.[dir];
      if (state) this.drawDoor(ctx, dir, state, game);
    }

    for (let i = 0; i < (room.torches || []).length; i++) {
      const t = room.torches[i];
      const pos = game.torchFlamePos(t);
      const sc = t.dir === 'n' || t.dir === 's' ? 1 : 0.86;
      drawFlame(ctx, pos.x, pos.y, game.time, i * 3.1, sc);
    }
    for (const p of room.props || []) {
      if (p.type === 'brazier') {
        drawFlame(ctx, p.tx * TILE + 8, p.ty * TILE + 4, game.time, p.tx * 1.7, 0.92);
      }
    }

    for (const sign of room.signs || []) {
      drawSign(ctx, { x: c(sign.tx), y: c(sign.ty) });
    }
    for (const pot of game.roomState.pots) drawPot(ctx, pot, game.time);
    for (const chest of game.roomState.chests) drawChest(ctx, chest, game.time);
    for (const p of game.pickups) drawPickup(ctx, p, game.time);

    const entities = [...game.enemies.filter((e) => !e.dead), game.player];
    entities.sort((a, b) => a.y - b.y);
    for (const e of entities) {
      if (e === game.player && game.player.dead) ctx.globalAlpha = 0.55;
      e.draw(ctx, game.time);
      ctx.globalAlpha = 1;
    }

    for (const pr of game.projectiles) drawProjectile(ctx, pr, game.time);
    for (const p of game.particles) drawParticle(ctx, p);

    // warm torch light + boss aura
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (room.torches || []).length; i++) {
      const t = room.torches[i];
      const pos = game.torchFlamePos(t);
      const flicker = 0.82 + Math.sin(game.time * 9 + i * 2.3) * 0.18;
      const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 74);
      grd.addColorStop(0, `rgba(255,166,76,${0.12 * flicker})`);
      grd.addColorStop(0.5, `rgba(255,120,48,${0.045 * flicker})`);
      grd.addColorStop(1, 'rgba(255,100,40,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(pos.x - 80, pos.y - 80, 160, 160);
    }
    for (const p of room.props || []) {
      if (p.type !== 'brazier') continue;
      const bx = p.tx * TILE + 8;
      const by = p.ty * TILE + 4;
      const flicker = 0.84 + Math.sin(game.time * 8 + p.tx) * 0.16;
      const grd = ctx.createRadialGradient(bx, by, 0, bx, by, 62);
      grd.addColorStop(0, `rgba(255,160,70,${0.13 * flicker})`);
      grd.addColorStop(0.5, `rgba(255,110,45,${0.05 * flicker})`);
      grd.addColorStop(1, 'rgba(255,90,40,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(bx - 68, by - 68, 136, 136);
    }
    if (game.boss && !game.boss.dead) {
      const exposed = game.boss.exposed > 0;
      const grd = ctx.createRadialGradient(game.boss.x, game.boss.y, 0, game.boss.x, game.boss.y, 90);
      grd.addColorStop(0, exposed ? 'rgba(255,72,62,0.1)' : 'rgba(140,80,255,0.05)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(game.boss.x - 95, game.boss.y - 95, 190, 190);
    }
    ctx.restore();

    ctx.restore();

    if (game.vignette) ctx.drawImage(game.vignette, 0, 0);
    if (game.flashRed > 0) {
      ctx.fillStyle = `rgba(190,24,38,${game.flashRed * 0.55})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (game.flashWhite > 0) {
      ctx.fillStyle = `rgba(255,245,220,${game.flashWhite * 0.45})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}
