import * as THREE from "three";
import { mulberry32 } from "./utils.js";

function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function speckle(ctx, w, h, count, random, alpha = 0.05, size = 1) {
  for (let i = 0; i < count; i += 1) {
    const g = Math.floor(random() * 70);
    ctx.fillStyle = `rgba(${g},${g},${g + 4},${alpha * random()})`;
    ctx.fillRect(random() * w, random() * h, size * (0.4 + random()), size * (0.4 + random()));
  }
}

function rust(ctx, w, h, random, count = 12) {
  for (let i = 0; i < count; i += 1) {
    const x = random() * w;
    const y = random() * h;
    const r = 12 + random() * 64;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${90 + random() * 40},${36 + random() * 22},14,${0.08 + random() * 0.12})`);
    g.addColorStop(1, "rgba(40,16,6,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function cracks(ctx, w, h, random, count = 18) {
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  for (let i = 0; i < count; i += 1) {
    let x = random() * w;
    let y = random() * h;
    ctx.lineWidth = 0.7 + random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 3 + Math.floor(random() * 6);
    for (let s = 0; s < steps; s += 1) {
      x += (random() - 0.5) * 38;
      y += (random() - 0.5) * 38;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function finish(canvasEl, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvasEl);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeFloor() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const random = mulberry32(0x91ac3);

  ctx.fillStyle = "#2a2d36";
  ctx.fillRect(0, 0, size, size);

  const tiles = 4;
  const ts = size / tiles;

  for (let y = 0; y < tiles; y += 1) {
    for (let x = 0; x < tiles; x += 1) {
      const px = x * ts;
      const py = y * ts;
      const shade = 38 + Math.floor(random() * 20);
      const g = ctx.createLinearGradient(px, py, px + ts, py + ts);
      g.addColorStop(0, `rgb(${shade + 8},${shade + 9},${shade + 14})`);
      g.addColorStop(0.55, `rgb(${shade},${shade + 1},${shade + 5})`);
      g.addColorStop(1, `rgb(${shade - 7},${shade - 6},${shade - 2})`);
      ctx.fillStyle = g;
      ctx.fillRect(px + 3, py + 3, ts - 6, ts - 6);

      // bevel
      ctx.strokeStyle = "rgba(130,140,160,0.16)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 3, py + ts - 3);
      ctx.lineTo(px + 3, py + 3);
      ctx.lineTo(px + ts - 3, py + 3);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.moveTo(px + ts - 3, py + 3);
      ctx.lineTo(px + ts - 3, py + ts - 3);
      ctx.lineTo(px + 3, py + ts - 3);
      ctx.stroke();

      // rivets
      for (const [rx, ry] of [
        [14, 14],
        [ts - 14, 14],
        [14, ts - 14],
        [ts - 14, ts - 14],
      ]) {
        ctx.fillStyle = "rgba(8,9,12,0.9)";
        ctx.beginPath();
        ctx.arc(px + rx, py + ry, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(150,158,170,0.18)";
        ctx.beginPath();
        ctx.arc(px + rx - 0.7, py + ry - 0.7, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (random() > 0.55) {
        const gx = px + 22 + random() * (ts - 44);
        const gy = py + 20 + random() * (ts - 40);
        ctx.fillStyle = "rgba(255,106,36,0.10)";
        ctx.fillRect(gx, gy, 2 + random() * 20, 1);
      }
    }
  }

  // grid seams
  ctx.strokeStyle = "rgba(4,5,8,0.85)";
  ctx.lineWidth = 3;
  for (let i = 0; i <= tiles; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * ts, 0);
    ctx.lineTo(i * ts, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * ts);
    ctx.lineTo(size, i * ts);
    ctx.stroke();
  }

  cracks(ctx, size, size, random, 30);
  rust(ctx, size, size, random, 16);
  speckle(ctx, size, size, 26000, random, 0.07);

  // faint central hazard stripe
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 4);
  ctx.globalAlpha = 0.05;
  for (let i = -size; i < size; i += 42) {
    ctx.fillStyle = i % 84 === 0 ? "#ff5a1f" : "#000000";
    ctx.fillRect(i, -size, 18, size * 2);
  }
  ctx.restore();

  return c;
}

function makeWall() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const random = mulberry32(0x1f93a);

  ctx.fillStyle = "#1a1c23";
  ctx.fillRect(0, 0, size, size);

  const rows = 6;
  const bh = size / rows;
  const bw = size / 3;

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : -bw / 2;
    for (let col = -1; col < 4; col += 1) {
      const x = col * bw + offset;
      const y = row * bh;
      const shade = 44 + Math.floor(random() * 20);
      const g = ctx.createLinearGradient(x, y, x + bw, y + bh);
      g.addColorStop(0, `rgb(${shade + 7},${shade + 8},${shade + 13})`);
      g.addColorStop(0.6, `rgb(${shade},${shade + 1},${shade + 6})`);
      g.addColorStop(1, `rgb(${shade - 10},${shade - 9},${shade - 5})`);
      ctx.fillStyle = g;
      ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);

      ctx.fillStyle = "rgba(0,0,0,0.34)";
      ctx.fillRect(x, y + bh - 3, bw, 3);
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.fillRect(x + 2, y + 2, bw - 4, 2);

      // chisel marks
      ctx.strokeStyle = "rgba(0,0,0,0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i += 1) {
        const sx = x + 8 + random() * (bw - 16);
        const sy = y + 8 + random() * (bh - 16);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 8 + random() * 22, sy + (random() - 0.5) * 5);
        ctx.stroke();
      }
    }
  }

  // weather streaks
  for (let i = 0; i < 32; i += 1) {
    const x = random() * size;
    const y = random() * size * 0.6;
    const h = 40 + random() * 220;
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, 1 + random() * 4, h);
  }

  rust(ctx, size, size, random, 18);
  cracks(ctx, size, size, random, 12);
  speckle(ctx, size, size, 20000, random, 0.06);

  return c;
}

function makeMetal() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const random = mulberry32(0x77bd1);

  ctx.fillStyle = "#2a2d36";
  ctx.fillRect(0, 0, size, size);

  // brushed noise
  for (let i = 0; i < 9000; i += 1) {
    const v = 20 + Math.floor(random() * 60);
    ctx.fillStyle = `rgba(${v},${v + 3},${v + 8},${0.05 + random() * 0.08})`;
    ctx.fillRect(random() * size, random() * size, 1 + random() * 26, 1);
  }

  // panels
  const p = size / 2;
  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < 2; x += 1) {
      const px = x * p;
      const py = y * p;
      const g = ctx.createLinearGradient(px, py, px, py + p);
      g.addColorStop(0, "rgba(255,255,255,0.055)");
      g.addColorStop(0.5, "rgba(0,0,0,0.02)");
      g.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = g;
      ctx.fillRect(px + 3, py + 3, p - 6, p - 6);

      ctx.strokeStyle = "rgba(0,0,0,0.65)";
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 2, py + 2, p - 4, p - 4);

      ctx.strokeStyle = "rgba(150,160,180,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 5, py + 5, p - 10, p - 10);

      for (let i = 0; i < 8; i += 1) {
        const rx = px + 14 + (i % 4) * ((p - 28) / 3);
        const ry = py + 14 + Math.floor(i / 4) * (p - 28);
        ctx.fillStyle = "rgba(5,6,8,0.9)";
        ctx.beginPath();
        ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(190,200,215,0.22)";
        ctx.beginPath();
        ctx.arc(rx - 0.8, ry - 0.8, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // orange warning chevrons at edge
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = -size; i < size * 2; i += 34) {
    ctx.fillStyle = i % 68 === 0 ? "#ff5a1f" : "#0c0c10";
    ctx.beginPath();
    ctx.moveTo(i, size - 34);
    ctx.lineTo(i + 17, size - 34);
    ctx.lineTo(i + 17 + 30, size);
    ctx.lineTo(i + 30, size);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  cracks(ctx, size, size, random, 10);
  speckle(ctx, size, size, 14000, random, 0.07);
  return c;
}

function makeLava() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const random = mulberry32(0x3fa91);

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, "#390700");
  base.addColorStop(0.4, "#8f1604");
  base.addColorStop(0.7, "#d33505");
  base.addColorStop(1, "#4a0800");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const r = 10 + random() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const hot = random() > 0.5;
    g.addColorStop(0, hot ? "rgba(255,226,130,0.85)" : "rgba(255,120,20,0.7)");
    g.addColorStop(0.4, hot ? "rgba(255,150,30,0.5)" : "rgba(210,60,5,0.45)");
    g.addColorStop(1, "rgba(80,10,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // dark crust cracks
  ctx.strokeStyle = "rgba(24,4,2,0.85)";
  for (let i = 0; i < 44; i += 1) {
    let x = random() * size;
    let y = random() * size;
    ctx.lineWidth = 1 + random() * 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s += 1) {
      x += (random() - 0.5) * 70;
      y += (random() - 0.5) * 70;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // bright vents
  for (let i = 0; i < 26; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 20);
    g.addColorStop(0, "rgba(255,246,196,0.95)");
    g.addColorStop(0.3, "rgba(255,170,50,0.5)");
    g.addColorStop(1, "rgba(255,120,20,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  return c;
}

function makeSky() {
  const w = 1536;
  const h = 768;
  const c = canvas(w, h);
  const ctx = c.getContext("2d");
  const random = mulberry32(0xdead7);

  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#03040a");
  g.addColorStop(0.32, "#070b1a");
  g.addColorStop(0.55, "#131024");
  g.addColorStop(0.72, "#32141a");
  g.addColorStop(0.84, "#6b2317");
  g.addColorStop(0.92, "#161016");
  g.addColorStop(1, "#05060a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // nebula clouds
  for (let i = 0; i < 70; i += 1) {
    const x = random() * w;
    const y = random() * h * 0.7;
    const r = 40 + random() * 220;
    const ng = ctx.createRadialGradient(x, y, 0, x, y, r);
    const roll = random();
    if (roll > 0.72) {
      ng.addColorStop(0, "rgba(255,90,31,0.055)");
    } else if (roll > 0.4) {
      ng.addColorStop(0, "rgba(96,78,190,0.05)");
    } else {
      ng.addColorStop(0, "rgba(38,108,150,0.045)");
    }
    ng.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // stars
  for (let i = 0; i < 1600; i += 1) {
    const x = random() * w;
    const y = random() * h * 0.75;
    const s = random() * 1.8 + 0.2;
    const a = 0.15 + random() * 0.75;
    ctx.fillStyle = `rgba(${200 + random() * 55},${210 + random() * 40},255,${a})`;
    ctx.fillRect(x, y, s, s);
    if (random() > 0.985) {
      const sg = ctx.createRadialGradient(x, y, 0, x, y, 9);
      sg.addColorStop(0, "rgba(190,220,255,0.55)");
      sg.addColorStop(1, "rgba(120,160,255,0)");
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // red moon
  const mx = w * 0.71;
  const my = h * 0.29;
  const mr = 58;
  const halo = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4.2);
  halo.addColorStop(0, "rgba(255,120,60,0.24)");
  halo.addColorStop(0.4, "rgba(255,80,30,0.08)");
  halo.addColorStop(1, "rgba(255,60,20,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(mx, my, mr * 4.2, 0, Math.PI * 2);
  ctx.fill();

  const mg = ctx.createRadialGradient(mx - mr * 0.35, my - mr * 0.35, 2, mx, my, mr);
  mg.addColorStop(0, "#ffe4c2");
  mg.addColorStop(0.35, "#ffb276");
  mg.addColorStop(0.75, "#c85a2c");
  mg.addColorStop(1, "#7d2c12");
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fill();

  // moon craters
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 14; i += 1) {
    const a = random() * Math.PI * 2;
    const d = random() * mr * 0.78;
    const cr = 3 + random() * 13;
    ctx.fillStyle = "#5b1d0b";
    ctx.beginPath();
    ctx.arc(mx + Math.cos(a) * d, my + Math.sin(a) * d, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // horizon haze
  const hz = ctx.createLinearGradient(0, h * 0.62, 0, h * 0.9);
  hz.addColorStop(0, "rgba(255,90,31,0)");
  hz.addColorStop(0.5, "rgba(255,86,30,0.12)");
  hz.addColorStop(1, "rgba(255,60,20,0)");
  ctx.fillStyle = hz;
  ctx.fillRect(0, h * 0.62, w, h * 0.3);

  return c;
}

function makeGlow() {
  const size = 128;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,245,220,0.95)");
  g.addColorStop(0.42, "rgba(255,170,80,0.45)");
  g.addColorStop(1, "rgba(255,90,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeScorch() {
  const size = 128;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const random = mulberry32(0x51424);
  const g = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.42, "rgba(8,5,4,0.6)");
  g.addColorStop(0.75, "rgba(16,8,4,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 40; i += 1) {
    const a = random() * Math.PI * 2;
    const d = random() * size * 0.42;
    ctx.fillStyle = `rgba(0,0,0,${0.1 + random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(size / 2 + Math.cos(a) * d, size / 2 + Math.sin(a) * d, 1 + random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeEmblem() {
  const size = 1024;
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.translate(cx, cy);

  ctx.strokeStyle = "rgba(255,106,36,0.9)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "rgba(255,90,31,0.9)";
  ctx.shadowBlur = 30;

  ctx.beginPath();
  ctx.arc(0, 0, 430, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.setLineDash([10, 18]);
  ctx.beginPath();
  ctx.arc(0, 0, 390, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 320, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 210, 0, Math.PI * 2);
  ctx.stroke();

  // radial spikes
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(330, 0);
    ctx.lineTo(375, -14);
    ctx.lineTo(410, 0);
    ctx.lineTo(375, 14);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // Q ring
  ctx.lineWidth = 34;
  ctx.beginPath();
  ctx.arc(0, -20, 118, Math.PI * 0.18, Math.PI * 2.05);
  ctx.stroke();

  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(52, 46);
  ctx.lineTo(150, 152);
  ctx.stroke();

  // inner rune
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-70, 90);
  ctx.lineTo(0, -140);
  ctx.lineTo(70, 90);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-36, 30);
  ctx.lineTo(36, 30);
  ctx.stroke();

  ctx.shadowBlur = 0;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeBanner() {
  const w = 256;
  const h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#3d0c0a");
  g.addColorStop(0.4, "#5e100b");
  g.addColorStop(0.85, "#2b0706");
  g.addColorStop(1, "#160303");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(230,150,80,0.18)";
  ctx.lineWidth = 5;
  ctx.strokeRect(13, 13, w - 26, h - 26);

  ctx.strokeStyle = "rgba(255,110,40,0.55)";
  ctx.lineWidth = 4;
  ctx.save();
  ctx.translate(w / 2, h * 0.4);
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const r1 = 20;
    const r2 = 92;
    ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
  }
  ctx.stroke();
  ctx.restore();

  // tattered bottom
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 10; i += 1) {
    const x = (i / 10) * w;
    const d = 12 + Math.random() * 46;
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x + w / 10, h);
    ctx.lineTo(x + w / 20, h - d);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeHazard() {
  const w = 256;
  const h = 64;
  const c = canvas(w, h);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0a0a0d";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ff5a1f";
  for (let i = -h; i < w + h; i += 44) {
    ctx.beginPath();
    ctx.moveTo(i, h);
    ctx.lineTo(i + 22, h);
    ctx.lineTo(i + 22 + h, 0);
    ctx.lineTo(i + h, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  for (let i = 0; i < 700; i += 1) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
  }
  return finish(c, 4, 1);
}

export function createTextures(renderer) {
  const floor = finish(makeFloor(), 10, 10);
  const floorPlatform = finish(makeFloor(), 4, 4);
  const wall = finish(makeWall(), 5, 2.5);
  const wallHigh = finish(makeWall(), 3, 2);
  const metal = finish(makeMetal(), 4, 1);
  const metalCatwalk = finish(makeMetal(), 6, 1);
  const lava = finish(makeLava(), 2, 2);
  const sky = new THREE.CanvasTexture(makeSky());
  sky.colorSpace = THREE.SRGBColorSpace;
  sky.mapping = THREE.EquirectangularReflectionMapping;
  sky.anisotropy = 4;

  const glow = makeGlow();
  const scorch = makeScorch();
  const emblem = makeEmblem();
  const banner = makeBanner();
  const hazard = makeHazard();

  const max = renderer.capabilities.getMaxAnisotropy();
  for (const t of [floor, floorPlatform, wall, wallHigh, metal, metalCatwalk, lava, hazard]) {
    t.anisotropy = Math.min(max, 8);
  }

  return {
    floor,
    floorPlatform,
    wall,
    wallHigh,
    metal,
    metalCatwalk,
    lava,
    sky,
    glow,
    scorch,
    emblem,
    banner,
    hazard,
  };
}
