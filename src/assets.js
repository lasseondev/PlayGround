import * as THREE from 'three';

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function seeded(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}

export function makeEnvironmentTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const x = c.getContext('2d');
  const sky = x.createLinearGradient(0, 0, 0, c.height);
  sky.addColorStop(0, '#05070d');
  sky.addColorStop(0.42, '#111827');
  sky.addColorStop(0.58, '#2a2a30');
  sky.addColorStop(0.72, '#1a1512');
  sky.addColorStop(1, '#08090c');
  x.fillStyle = sky;
  x.fillRect(0, 0, c.width, c.height);

  const moon = x.createRadialGradient(300, 125, 0, 300, 125, 120);
  moon.addColorStop(0, 'rgba(240,244,255,0.95)');
  moon.addColorStop(0.18, 'rgba(190,208,240,0.5)');
  moon.addColorStop(1, 'rgba(80,110,170,0)');
  x.fillStyle = moon;
  x.fillRect(140, 0, 320, 280);

  for (const [px, py, radius, alpha] of [[700, 320, 95, 0.32], [90, 335, 70, 0.22], [920, 300, 85, 0.26]]) {
    const glow = x.createRadialGradient(px, py, 0, px, py, radius);
    glow.addColorStop(0, `rgba(255,160,82,${alpha})`);
    glow.addColorStop(0.45, `rgba(150,76,38,${alpha * 0.45})`);
    glow.addColorStop(1, 'rgba(40,20,12,0)');
    x.fillStyle = glow;
    x.fillRect(px - radius, py - radius, radius * 2, radius * 2);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeStoneTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const rng = seeded(73);
  x.fillStyle = '#202126';
  x.fillRect(0, 0, size, size);

  const rows = 8;
  const bh = size / rows;
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 ? -size / 10 : 0;
    for (let col = -1; col < 6; col++) {
      const bw = size / 5;
      const bx = col * bw + offset + (rng() - 0.5) * 4;
      const by = row * bh + (rng() - 0.5) * 2;
      const v = 38 + Math.floor(rng() * 28);
      x.fillStyle = `rgb(${v},${v + 1},${v + 4})`;
      x.fillRect(bx + 2, by + 2, bw - 4, bh - 4);
      x.strokeStyle = 'rgba(0,0,0,0.55)';
      x.lineWidth = 2;
      x.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
      x.strokeStyle = `rgba(${v + 26},${v + 24},${v + 20},0.15)`;
      x.lineWidth = 1;
      x.beginPath();
      x.moveTo(bx + 5, by + 5);
      x.lineTo(bx + bw - 5, by + 5);
      x.stroke();
      for (let k = 0; k < 16; k++) {
        const sx = bx + rng() * bw;
        const sy = by + rng() * bh;
        const sv = rng() > 0.5 ? 255 : 0;
        x.fillStyle = `rgba(${sv},${sv},${sv},${rng() * 0.035})`;
        x.fillRect(sx, sy, 1 + rng() * 2, 1 + rng() * 2);
      }
    }
  }

  x.strokeStyle = 'rgba(4,4,6,0.7)';
  for (let i = 0; i < 18; i++) {
    let px = rng() * size;
    let py = rng() * size;
    x.beginPath();
    x.moveTo(px, py);
    const segs = 2 + Math.floor(rng() * 4);
    for (let s = 0; s < segs; s++) {
      px += (rng() - 0.5) * 70;
      py += (rng() - 0.5) * 70;
      x.lineTo(px, py);
    }
    x.lineWidth = 0.6 + rng() * 1.5;
    x.stroke();
  }

  const img = x.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rng() - 0.5) * 13;
    img.data[i] = clamp(img.data[i] + n, 0, 255);
    img.data[i + 1] = clamp(img.data[i + 1] + n, 0, 255);
    img.data[i + 2] = clamp(img.data[i + 2] + n, 0, 255);
  }
  x.putImageData(img, 0, 0);
  return canvasTexture(c, 5, 5);
}

export function makeBrickTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const rng = seeded(19);
  x.fillStyle = '#101114';
  x.fillRect(0, 0, size, size);
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    const bw = size / 4;
    const off = r % 2 ? -bw / 2 : 0;
    for (let col = -1; col < 5; col++) {
      const v = 18 + Math.floor(rng() * 18);
      x.fillStyle = `rgb(${v},${v + 2},${v + 5})`;
      x.fillRect(col * bw + off + 2, r * (size / rows) + 2, bw - 4, size / rows - 4);
      x.strokeStyle = 'rgba(0,0,0,0.6)';
      x.lineWidth = 2;
      x.strokeRect(col * bw + off + 1, r * (size / rows) + 1, bw - 2, size / rows - 2);
    }
  }
  return canvasTexture(c, 3, 5);
}

export function makeRuneTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  x.clearRect(0, 0, size, size);
  x.translate(size / 2, size / 2);
  x.strokeStyle = 'rgba(210,185,128,0.85)';
  x.lineWidth = 2;
  x.shadowColor = 'rgba(220,190,120,0.8)';
  x.shadowBlur = 12;
  x.beginPath();
  x.arc(0, 0, size * 0.37, 0, Math.PI * 2);
  x.stroke();
  x.beginPath();
  x.arc(0, 0, size * 0.29, 0, Math.PI * 2);
  x.stroke();
  x.lineWidth = 1.2;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    x.beginPath();
    x.moveTo(Math.cos(a) * size * 0.3, Math.sin(a) * size * 0.3);
    x.lineTo(Math.cos(a) * size * 0.36, Math.sin(a) * size * 0.36);
    x.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const r = size * 0.22;
    x.beginPath();
    x.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    x.lineTo(Math.cos(a + 0.18) * r * 0.55, Math.sin(a + 0.18) * r * 0.55);
    x.lineTo(Math.cos(a + 0.35) * r, Math.sin(a + 0.35) * r);
    x.stroke();
  }
  x.shadowBlur = 0;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGlowTexture(size = 128, inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.22, 'rgba(255,255,255,0.65)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.16)');
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeSmokeTexture(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const rng = seeded(44);
  x.clearRect(0, 0, size, size);
  for (let i = 0; i < 24; i++) {
    const px = size / 2 + (rng() - 0.5) * size * 0.55;
    const py = size / 2 + (rng() - 0.5) * size * 0.55;
    const r = size * (0.12 + rng() * 0.28);
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `rgba(180,185,195,${0.05 + rng() * 0.07})`);
    g.addColorStop(1, 'rgba(120,125,140,0)');
    x.fillStyle = g;
    x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeMoonTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const rng = seeded(9);
  const g = x.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.48);
  g.addColorStop(0, 'rgba(255,250,230,0.95)');
  g.addColorStop(0.45, 'rgba(235,228,205,0.82)');
  g.addColorStop(0.68, 'rgba(190,195,205,0.25)');
  g.addColorStop(1, 'rgba(150,160,180,0)');
  x.fillStyle = g;
  x.beginPath();
  x.arc(size / 2, size / 2, size * 0.48, 0, Math.PI * 2);
  x.fill();
  for (let i = 0; i < 22; i++) {
    const a = rng() * Math.PI * 2;
    const r = rng() * size * 0.3;
    const px = size / 2 + Math.cos(a) * r;
    const py = size / 2 + Math.sin(a) * r;
    const rad = 3 + rng() * 16;
    x.fillStyle = `rgba(110,112,120,${0.04 + rng() * 0.09})`;
    x.beginPath();
    x.arc(px, py, rad, 0, Math.PI * 2);
    x.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeSparkTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,235,190,0.9)');
  g.addColorStop(1, 'rgba(255,180,90,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeTextSprite(text, { color = '#f1d69a', size = 64, font = '600 34px Cinzel, serif' } = {}) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const x = c.getContext('2d');
  x.font = font;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.shadowColor = 'rgba(0,0,0,0.9)';
  x.shadowBlur = 14;
  x.fillStyle = color;
  x.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4, 1, 1);
  return sprite;
}

export function standard(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metalness ?? 0.1,
    roughness: opts.roughness ?? 0.8,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    flatShading: opts.flatShading ?? false,
    side: opts.side ?? THREE.FrontSide,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    map: opts.map ?? null,
    alphaMap: opts.alphaMap ?? null,
    depthWrite: opts.depthWrite ?? true,
    blending: opts.blending ?? THREE.NormalBlending,
  });
}

export function addBox(parent, w, h, d, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function addCapsule(parent, r, len, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function addSphere(parent, r, material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), material);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function addCone(parent, r, h, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function addTorus(parent, r, tube, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 24), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
