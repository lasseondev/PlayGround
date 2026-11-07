import * as THREE from 'three';

function canvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}

function noise(ctx, size, amount = 12, alpha = 0.16) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = alpha;
  ctx.globalAlpha = 1;
}

function finish(c, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}

export function floorTexture() {
  const S = 512;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#0b0d17';
  ctx.fillRect(0, 0, S, S);
  // large plates
  const cells = 4;
  const cs = S / cells;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = 28 + Math.random() * 16;
      ctx.fillStyle = `rgb(${v},${v + 4},${v + 14})`;
      ctx.fillRect(x * cs + 3, y * cs + 3, cs - 6, cs - 6);
    }
  }
  // seams
  ctx.strokeStyle = 'rgba(0,0,0,.75)';
  ctx.lineWidth = 5;
  for (let i = 0; i <= cells; i++) {
    ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(S, i * cs); ctx.stroke();
  }
  // inner panel bevels
  ctx.strokeStyle = 'rgba(120,190,230,.12)';
  ctx.lineWidth = 1;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      ctx.strokeRect(x * cs + 10, y * cs + 10, cs - 20, cs - 20);
    }
  }
  // cyan service lines
  ctx.strokeStyle = 'rgba(45,190,215,.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, cs * 1.5); ctx.lineTo(cs * 1.1, cs * 1.5); ctx.lineTo(cs * 1.1, cs * 2.8); ctx.lineTo(S, cs * 2.8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,46,138,.28)';
  ctx.fillRect(cs * 2.1, 8, 3, cs - 16);
  // bolts
  ctx.fillStyle = 'rgba(160,200,220,.25)';
  for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
    for (const [bx, by] of [[18, 18], [cs - 18, 18], [18, cs - 18], [cs - 18, cs - 18]]) {
      ctx.beginPath(); ctx.arc(x * cs + bx, y * cs + by, 2, 0, 7); ctx.fill();
    }
  }
  noise(ctx, S, 20, 0.1);
  return finish(c, 1);
}

export function wallTexture() {
  const S = 512;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#0a0c16';
  ctx.fillRect(0, 0, S, S);
  const plank = S / 4;
  for (let i = 0; i < 4; i++) {
    const g = ctx.createLinearGradient(i * plank, 0, (i + 1) * plank, 0);
    g.addColorStop(0, '#1a2030');
    g.addColorStop(0.5, '#242c42');
    g.addColorStop(1, '#131824');
    ctx.fillStyle = g;
    ctx.fillRect(i * plank + 4, 0, plank - 8, S);
  }
  ctx.strokeStyle = 'rgba(0,0,0,.7)';
  ctx.lineWidth = 6;
  for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * plank, 0); ctx.lineTo(i * plank, S); ctx.stroke(); }
  // horizontal ribs
  for (let y = 40; y < S; y += 110) {
    ctx.fillStyle = 'rgba(63,233,255,.07)';
    ctx.fillRect(0, y, S, 4);
    ctx.fillStyle = 'rgba(0,0,0,.4)';
    ctx.fillRect(0, y + 4, S, 2);
  }
  // emissive strip marks
  ctx.fillStyle = 'rgba(255,46,138,.4)';
  ctx.fillRect(0, S * 0.62, S, 2);
  ctx.fillStyle = 'rgba(63,233,255,.25)';
  ctx.fillRect(plank * 0.5, 0, 2, S);
  noise(ctx, S, 26, 0.12);
  return finish(c, 1);
}

export function hazardTexture() {
  const S = 256;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#14100a';
  ctx.fillRect(0, 0, S, S);
  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.rotate(-0.6);
  ctx.fillStyle = '#ffb02e';
  for (let i = -8; i < 10; i++) ctx.fillRect(i * 46, -S, 20, S * 2);
  ctx.restore();
  ctx.globalAlpha = 0.18;
  noise(ctx, S, 30, 0.1);
  ctx.globalAlpha = 1;
  const t = finish(c, 1);
  t.repeat.set(2, 1);
  return t;
}

export function glowTexture(inner = 'rgba(255,255,255,1)', mid = 'rgba(120,240,255,.5)', outer = 'rgba(40,180,255,0)') {
  const S = 128;
  const [c, ctx] = canvas(S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, mid);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function planetTexture() {
  const W = 1024, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const bands = [
    ['#29133f', '#3b1b5f', '#1a0d2d'],
    ['#5a1e52', '#8c2f6d', '#3a133f'],
    ['#b94a5c', '#e27b63', '#7c2f46'],
    ['#2b1a4d', '#4d2a6e', '#1c1038'],
    ['#c96b4f', '#f0a06a', '#8a3d43'],
    ['#3c1b5b', '#6a2c7e', '#241040'],
    ['#7e2a5c', '#b84a72', '#4c1a42'],
    ['#1c1238', '#352154', '#130a26'],
  ];
  let y = 0;
  let i = 0;
  while (y < H) {
    const h = 18 + Math.random() * 46;
    const [a, b, d] = bands[i % bands.length];
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, a); g.addColorStop(0.5, b); g.addColorStop(1, d);
    ctx.fillStyle = g;
    ctx.fillRect(0, y, W, h + 1);
    // swirl detail
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = i % 2 ? '#ffd0b0' : '#7ce8ff';
    ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      const yy = y + Math.random() * h;
      ctx.moveTo(0, yy);
      for (let x = 0; x <= W; x += 32) ctx.lineTo(x, yy + Math.sin(x * 0.02 + i) * 6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    y += h;
    i++;
  }
  // storm eye
  const cx = W * 0.62, cy = H * 0.44;
  const rg = ctx.createRadialGradient(cx, cy, 4, cx, cy, 56);
  rg.addColorStop(0, 'rgba(255,180,140,.5)');
  rg.addColorStop(0.5, 'rgba(255,120,90,.2)');
  rg.addColorStop(1, 'rgba(255,80,80,0)');
  ctx.fillStyle = rg;
  ctx.beginPath(); ctx.ellipse(cx, cy, 70, 26, 0.1, 0, 7); ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

export function padTexture() {
  const S = 256;
  const [c, ctx] = canvas(S);
  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(63,233,255,.85)';
  ctx.lineWidth = 3;
  for (let r = 30; r < 120; r += 26) {
    ctx.beginPath(); ctx.arc(S / 2, S / 2, r, 0, 7); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(63,233,255,.22)';
  ctx.beginPath(); ctx.arc(S / 2, S / 2, 118, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(160,250,255,.95)';
  for (let i = 0; i < 3; i++) {
    const y = 70 + i * 42;
    ctx.beginPath();
    ctx.moveTo(S / 2 - 34, y); ctx.lineTo(S / 2, y - 20); ctx.lineTo(S / 2 + 34, y);
    ctx.lineTo(S / 2 + 34, y + 12); ctx.lineTo(S / 2, y - 8); ctx.lineTo(S / 2 - 34, y + 12);
    ctx.closePath(); ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function hologramTexture(title = 'VOID', sub = 'ARENA 04') {
  const W = 512, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(63,233,255,.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.fillStyle = 'rgba(63,233,255,.12)';
  ctx.fillRect(10, 10, W - 20, H - 20);
  ctx.font = '900 88px Orbitron, Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#bff8ff';
  ctx.shadowColor = '#3fe9ff';
  ctx.shadowBlur = 22;
  ctx.fillText(title, W / 2, 118);
  ctx.font = '600 22px Rajdhani, Arial';
  ctx.fillStyle = '#ff7bb0';
  ctx.shadowColor = '#ff2e8a';
  ctx.fillText(sub, W / 2, 165);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,.2)';
  ctx.beginPath(); ctx.moveTo(60, 190); ctx.lineTo(W - 60, 190); ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function nameTexture(name, color = '#cfeaff') {
  const W = 256, H = 64;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.font = '700 28px Orbitron, Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.fillRect(0, 14, W, 36);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillText(name, W / 2, 41);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
