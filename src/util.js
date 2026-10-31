import * as THREE from 'three';

/* ---------------------------------------------------------------- math */

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (v - a) / (b - a);
export const smoothstep = (t) => t * t * (3 - 2 * t);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
export const angleLerp = (a, b, t) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const mod = (a, n) => ((a % n) + n) % n;

export function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------ textures */

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finishTexture(c, { repeat = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  }
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

function speckle(ctx, w, h, count, minA, maxA, colors, minSize = 1, maxSize = 3) {
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = rand(minA, maxA);
    ctx.fillStyle = pick(colors);
    const s = rand(minSize, maxSize);
    ctx.fillRect(rand(0, w), rand(0, h), s, s);
  }
  ctx.globalAlpha = 1;
}

export function makeWallTexture() {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#93806a');
  g.addColorStop(0.5, '#86725c');
  g.addColorStop(1, '#78654f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // large stone blocks with irregular courses
  const courseH = 64;
  for (let row = 0; row < h / courseH; row++) {
    const y = row * courseH;
    const offset = (row % 2) * 70;
    for (let col = -1; col < 5; col++) {
      const x = col * 150 + offset + rand(-5, 5);
      const bw = rand(138, 158);
      const bh = courseH - rand(4, 8);
      const shade = rand(-16, 14);
      ctx.fillStyle = `rgb(${134 + shade}, ${115 + shade}, ${91 + shade})`;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 5);
      ctx.lineTo(x + bw - 3, y + 4);
      ctx.lineTo(x + bw, y + bh - 4);
      ctx.lineTo(x + 3, y + bh - 2);
      ctx.closePath();
      ctx.fill();
      // bevel
      ctx.strokeStyle = 'rgba(238, 219, 185, 0.13)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 6);
      ctx.lineTo(x + bw - 4, y + 5);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(35, 26, 18, 0.28)';
      ctx.beginPath();
      ctx.moveTo(x + 5, y + bh - 4);
      ctx.lineTo(x + bw - 2, y + bh - 6);
      ctx.stroke();
    }
  }

  // mortar / cracks
  for (let i = 0; i < 26; i++) {
    let x = rand(0, w), y = rand(0, h);
    ctx.strokeStyle = `rgba(36, 28, 21, ${rand(0.1, 0.3)})`;
    ctx.lineWidth = rand(0.6, 1.8);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      x += rand(-16, 16);
      y += rand(6, 22);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // sand drift at the bottom
  const sand = ctx.createLinearGradient(0, h * 0.62, 0, h);
  sand.addColorStop(0, 'rgba(176, 150, 108, 0)');
  sand.addColorStop(1, 'rgba(176, 150, 108, 0.22)');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 0, w, h);

  speckle(ctx, w, h, 2600, 0.04, 0.18, ['#e0caa2', '#5f4e3b', '#2c241b', '#a68b68'], 1, 2.5);

  // water stains
  for (let i = 0; i < 5; i++) {
    const rg = ctx.createRadialGradient(rand(0, w), rand(0, h), 2, rand(0, w), rand(0, h), rand(30, 90));
    rg.addColorStop(0, 'rgba(31, 36, 32, 0.14)');
    rg.addColorStop(1, 'rgba(31, 36, 32, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }
  return finishTexture(c);
}

export function makeFloorTexture() {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#6d5b47';
  ctx.fillRect(0, 0, w, h);

  const size = 128;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const shade = rand(-18, 12);
      ctx.fillStyle = `rgb(${105 + shade}, ${87 + shade}, ${68 + shade})`;
      ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
      ctx.strokeStyle = 'rgba(224, 203, 166, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, size - 8, size - 8);
      ctx.strokeStyle = 'rgba(31, 24, 17, 0.28)';
      ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
      // subtle diagonal wear
      ctx.strokeStyle = 'rgba(42, 33, 24, 0.12)';
      ctx.beginPath();
      ctx.moveTo(x + rand(10, 50), y + rand(60, 118));
      ctx.lineTo(x + rand(70, 118), y + rand(10, 60));
      ctx.stroke();
    }
  }

  // cracks
  for (let i = 0; i < 18; i++) {
    let x = rand(0, w), y = rand(0, h);
    ctx.strokeStyle = `rgba(28, 21, 15, ${rand(0.2, 0.5)})`;
    ctx.lineWidth = rand(0.8, 2.4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += rand(-24, 24);
      y += rand(-24, 24);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // sand pooled in the corners
  for (let i = 0; i < 8; i++) {
    const rg = ctx.createRadialGradient(rand(0, w), rand(0, h), 4, rand(0, w), rand(0, h), rand(40, 120));
    rg.addColorStop(0, 'rgba(163, 136, 95, 0.2)');
    rg.addColorStop(1, 'rgba(163, 136, 95, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  speckle(ctx, w, h, 2200, 0.04, 0.14, ['#c8ae83', '#3a2e22', '#8d7659'], 1, 2.5);
  return finishTexture(c);
}

export function makeBannerTexture(kind = 'sun') {
  const w = 256, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);

  // tattered cloth silhouette
  ctx.beginPath();
  ctx.moveTo(26, 8);
  ctx.lineTo(230, 8);
  ctx.lineTo(230, 440);
  for (let i = 0; i <= 8; i++) {
    const x = 230 - i * 25;
    ctx.lineTo(x, 440 + (i % 2 === 0 ? 34 : 8) + rand(-8, 8));
    ctx.lineTo(x - 12, 440 + (i % 2 === 0 ? 12 : 36));
  }
  ctx.closePath();
  const cloth = ctx.createLinearGradient(0, 0, 0, h);
  cloth.addColorStop(0, '#142c2f');
  cloth.addColorStop(0.5, '#18383a');
  cloth.addColorStop(1, '#0c2023');
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.clip();

  // weave
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = `rgba(255,255,255,${rand(0.005, 0.02)})`;
    ctx.fillRect(0, y, w, 1);
  }
  // folds
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 25;
    const grad = ctx.createLinearGradient(x, 0, x + 20, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.45, `rgba(0,0,0,${rand(0.08, 0.22)})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 22, h);
  }

  // borders
  ctx.strokeStyle = 'rgba(202, 166, 94, 0.72)';
  ctx.lineWidth = 3;
  ctx.strokeRect(38, 22, 180, 400);
  ctx.strokeStyle = 'rgba(202, 166, 94, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 32, 160, 380);

  // emblem
  ctx.save();
  ctx.translate(128, 208);
  ctx.strokeStyle = '#d9b972';
  ctx.fillStyle = 'rgba(217, 185, 114, 0.14)';
  ctx.lineWidth = 3;
  if (kind === 'sun') {
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 50, Math.sin(a) * 50);
      ctx.lineTo(Math.cos(a) * 64, Math.sin(a) * 64);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(243, 217, 150, 0.25)';
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'flame') {
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.bezierCurveTo(42, -16, 34, 10, 22, 28);
    ctx.bezierCurveTo(34, 44, 12, 56, 0, 56);
    ctx.bezierCurveTo(-12, 56, -34, 44, -22, 28);
    ctx.bezierCurveTo(-34, 10, -42, -16, 0, -56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.bezierCurveTo(16, 6, 12, 24, 0, 34);
    ctx.bezierCurveTo(-12, 24, -16, 6, 0, -16);
    ctx.fillStyle = 'rgba(243, 217, 150, 0.26)';
    ctx.fill();
  } else if (kind === 'stone') {
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(48, -14);
    ctx.lineTo(30, 48);
    ctx.lineTo(-30, 48);
    ctx.lineTo(-48, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(21, -2);
    ctx.lineTo(0, 34);
    ctx.lineTo(-21, -2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(87, 228, 210, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(87, 228, 210, 0.75)';
    ctx.stroke();
  } else {
    // courage — crossed blades
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.rect(-5, -58, 10, 76);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(-24, 14, 48, 7);
    ctx.fill();
    ctx.stroke();
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.rect(-5, -58, 10, 76);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(-24, 14, 48, 7);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // lower glyphs
  ctx.fillStyle = 'rgba(217, 185, 114, 0.5)';
  ctx.font = '18px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦  ✦  ✦', 128, 410);

  return finishTexture(c, { repeat: false });
}

export function makeMuralTexture() {
  const w = 640, h = 320;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  // stone panel
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#78634d');
  bg.addColorStop(1, '#5e4d3b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, 1200, 0.03, 0.12, ['#d0b385', '#32271d'], 1, 3);
  ctx.strokeStyle = 'rgba(28, 21, 15, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, w - 28, h - 28);

  // decorative recess
  ctx.fillStyle = 'rgba(18, 16, 14, 0.28)';
  ctx.fillRect(30, 30, w - 60, h - 60);

  ctx.save();
  ctx.translate(w / 2, h / 2 + 6);
  const glyphs = [
    { x: -190, color: '#f0c46a', label: 'I' },
    { x: 0, color: '#6fe3e2', label: 'II' },
    { x: 190, color: '#b99bff', label: 'III' },
  ];

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const g of glyphs) {
    ctx.strokeStyle = g.color;
    ctx.fillStyle = g.color + '22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(g.x, -16, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(g.x, -16, 48, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240, 230, 205, 0.14)';
    ctx.stroke();

    if (g.label === 'I') {
      ctx.beginPath();
      ctx.arc(g.x, -16, 23, 0, Math.PI * 2);
      ctx.fillStyle = g.color + 'aa';
      ctx.fill();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(g.x + Math.cos(a) * 30, -16 + Math.sin(a) * 30);
        ctx.lineTo(g.x + Math.cos(a) * 40, -16 + Math.sin(a) * 40);
        ctx.strokeStyle = g.color;
        ctx.stroke();
      }
    } else if (g.label === 'II') {
      ctx.beginPath();
      ctx.arc(g.x + 6, -16, 26, 0.5, Math.PI * 2 - 0.5);
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(g.x - 14, -24, 8, 0, Math.PI * 2);
      ctx.fillStyle = g.color + '66';
      ctx.fill();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
        const r = i % 2 === 0 ? 34 : 13;
        const px = g.x + Math.cos(a) * r;
        const py = -16 + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = g.color + '66';
      ctx.fill();
      ctx.strokeStyle = g.color;
      ctx.stroke();
    }

    ctx.fillStyle = '#e9dcc0';
    ctx.font = '26px Georgia, serif';
    ctx.fillText(g.label, g.x, 76);
    ctx.fillStyle = g.color;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('KINDL E  THE  FLAME', g.x, 110);
  }
  ctx.restore();

  // faint sand overlay
  const sand = ctx.createLinearGradient(0, h - 80, 0, h);
  sand.addColorStop(0, 'rgba(186, 158, 114, 0)');
  sand.addColorStop(1, 'rgba(186, 158, 114, 0.15)');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 0, w, h);

  return finishTexture(c, { repeat: false });
}

export function makeFloorGlyphTexture() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  ctx.strokeStyle = 'rgba(87, 228, 210, 0.9)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 222, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 206, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 158, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r1 = i % 3 === 0 ? 160 : 168;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a) * 200, Math.sin(a) * 200);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    ctx.translate(0, -185);
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(9, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-9, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  // central sun
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 48, Math.sin(a) * 48);
    ctx.lineTo(Math.cos(a) * 64, Math.sin(a) * 64);
    ctx.stroke();
  }
  const t = finishTexture(c, { repeat: false });
  return t;
}

export function makeCrackTexture() {
  const size = 512;
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  for (let i = 0; i < 15; i++) {
    const a = rand(0, Math.PI * 2);
    let x = Math.cos(a) * 12, y = Math.sin(a) * 12;
    ctx.strokeStyle = `rgba(14, 10, 8, ${rand(0.4, 0.85)})`;
    ctx.lineWidth = rand(1.5, 4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    let angle = a;
    for (let s = 0; s < 8; s++) {
      angle += rand(-0.5, 0.5);
      x += Math.cos(angle) * rand(12, 30);
      y += Math.sin(angle) * rand(12, 30);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return finishTexture(c, { repeat: false });
}

export function makeGlowTexture(size = 128) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.72)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return finishTexture(c, { repeat: false, srgb: false });
}

export function makeFlameTexture() {
  const w = 128, h = 256;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createRadialGradient(64, 170, 4, 64, 190, 120);
  g.addColorStop(0, 'rgba(255,255,235,1)');
  g.addColorStop(0.18, 'rgba(255,236,170,0.98)');
  g.addColorStop(0.45, 'rgba(255,176,80,0.9)');
  g.addColorStop(0.72, 'rgba(255,108,34,0.35)');
  g.addColorStop(1, 'rgba(255,80,20,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(64, 10);
  ctx.bezierCurveTo(112, 82, 99, 112, 91, 148);
  ctx.bezierCurveTo(84, 182, 100, 196, 88, 224);
  ctx.bezierCurveTo(78, 245, 50, 245, 40, 224);
  ctx.bezierCurveTo(28, 196, 44, 182, 37, 148);
  ctx.bezierCurveTo(29, 112, 16, 82, 64, 10);
  ctx.closePath();
  ctx.fill();

  const core = ctx.createRadialGradient(64, 190, 2, 64, 190, 52);
  core.addColorStop(0, 'rgba(255,255,255,0.95)');
  core.addColorStop(1, 'rgba(255,200,90,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(64, 190, 50, 0, Math.PI * 2);
  ctx.fill();

  return finishTexture(c, { repeat: false, srgb: false });
}

export function makeRuneSpriteTexture() {
  const size = 256;
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  ctx.translate(size / 2, size / 2);
  ctx.strokeStyle = 'rgba(120, 255, 235, 1)';
  ctx.fillStyle = 'rgba(120, 255, 235, 0.12)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 82, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 64, Math.sin(a) * 64);
    ctx.lineTo(Math.cos(a) * 98, Math.sin(a) * 98);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 100, Math.sin(a) * 100, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 255, 245, 0.9)';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(30, 0);
  ctx.lineTo(0, 34);
  ctx.lineTo(-30, 0);
  ctx.closePath();
  ctx.stroke();
  return finishTexture(c, { repeat: false, srgb: false });
}

export function makeBarrierTexture() {
  const w = 256, h = 256;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(87, 228, 210, 0.55)';
  ctx.lineWidth = 1.5;
  const s = 42;
  for (let y = -s; y < h + s; y += s) {
    for (let x = -s; x < w + s; x += s) {
      const ox = (Math.floor(y / s) % 2) * (s / 2);
      ctx.beginPath();
      ctx.moveTo(x + ox, y);
      ctx.lineTo(x + ox + s / 2, y + s / 4);
      ctx.lineTo(x + ox + s / 2, y + (3 * s) / 4);
      ctx.lineTo(x + ox, y + s);
      ctx.lineTo(x + ox - s / 2, y + (3 * s) / 4);
      ctx.lineTo(x + ox - s / 2, y + s / 4);
      ctx.closePath();
      ctx.stroke();
    }
  }
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(87, 228, 210, 0.2)');
  grad.addColorStop(0.6, 'rgba(87, 228, 210, 0.05)');
  grad.addColorStop(1, 'rgba(87, 228, 210, 0.24)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return finishTexture(c, { repeat: false, srgb: false });
}

export function makeWaterTexture() {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0d2d30';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) {
    const grad = ctx.createRadialGradient(rand(0, w), rand(0, h), 1, rand(0, w), rand(0, h), rand(16, 70));
    grad.addColorStop(0, `rgba(87, 228, 210, ${rand(0.03, 0.16)})`);
    grad.addColorStop(1, 'rgba(87, 228, 210, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.strokeStyle = 'rgba(120, 255, 235, 0.14)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    const y = rand(0, h);
    ctx.beginPath();
    ctx.ellipse(rand(0, w), y, rand(20, 70), rand(3, 10), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  return finishTexture(c);
}

let glowTexture = null;
let flameTexture = null;
export function glowTex() {
  if (!glowTexture) glowTexture = makeGlowTexture();
  return glowTexture;
}
export function flameTex() {
  if (!flameTexture) flameTexture = makeFlameTexture();
  return flameTexture;
}

/* ------------------------------------------------------------- geometry */

export function worldUVBox(w, h, d, scale = 2.4) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = Math.abs(norm.getX(i)), ny = Math.abs(norm.getY(i)), nz = Math.abs(norm.getZ(i));
    if (nx > 0.5) uv.setXY(i, z / scale, y / scale);
    else if (ny > 0.5) uv.setXY(i, x / scale, z / scale);
    else uv.setXY(i, x / scale, y / scale);
  }
  uv.needsUpdate = true;
  return geo;
}

export function meshBox(w, h, d, material, scale = 2.4) {
  const m = new THREE.Mesh(worldUVBox(w, h, d, scale), material);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function setShadow(group, cast = true, receive = true) {
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
}

export function makeSprite(texture, color, opacity = 1, blending = THREE.AdditiveBlending) {
  const mat = new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    blending,
    depthWrite: false,
    depthTest: true,
  });
  const s = new THREE.Sprite(mat);
  return s;
}

export function setMeshOpacity(root, opacity) {
  root.traverse((o) => {
    if (o.isMesh && o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        m.transparent = true;
        m.opacity = opacity;
      }
    }
    if (o.isSprite) o.material.opacity = opacity;
  });
}

/* draw a soft circle into a canvas for minimap markers */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
