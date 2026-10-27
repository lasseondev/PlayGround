import { MATERIALS, THEMES } from "./levels.js";

const TAU = Math.PI * 2;

export function hash(n) {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function rng(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU);
}

export function drawSky(ctx, w, h, themeName, time) {
  const theme = THEMES[themeName] || THEMES.day;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, theme.skyTop);
  grad.addColorStop(0.56, theme.skyMid);
  grad.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.79;
  const sunY = h * 0.16;
  const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, Math.min(w, h) * 0.32);
  glow.addColorStop(0, theme.sunGlow);
  glow.addColorStop(0.45, theme.sunGlow.replace(/[\d.]+\)$/, "0.18)"));
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.92;
  const sunR = Math.min(w, h) * 0.055;
  const sunGrad = ctx.createRadialGradient(sunX - sunR * 0.3, sunY - sunR * 0.3, 1, sunX, sunY, sunR);
  sunGrad.addColorStop(0, "#fffdf0");
  sunGrad.addColorStop(0.7, theme.sun);
  sunGrad.addColorStop(1, theme.sun);
  ctx.fillStyle = sunGrad;
  ellipse(ctx, sunX, sunY, sunR, sunR);
  ctx.fill();
  ctx.restore();

  if (themeName === "night") {
    const r = rng(99);
    for (let i = 0; i < 55; i++) {
      const x = r() * w;
      const y = r() * h * 0.55;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(time * 0.9 + i));
      ctx.globalAlpha = tw * 0.8;
      ctx.fillStyle = "#f5f8ff";
      ctx.beginPath();
      ctx.arc(x, y, 0.8 + r() * 1.5, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

export function drawClouds(ctx, w, h, themeName, time, parallax = 1) {
  const theme = THEMES[themeName] || THEMES.day;
  const scale = Math.max(0.55, Math.min(1.2, w / 1500));
  const cloudColor = themeName === "night" ? "rgba(186, 204, 232, 0.4)" : "rgba(255,255,255,0.72)";
  const shadeColor = themeName === "night" ? "rgba(130, 154, 194, 0.2)" : "rgba(190, 224, 248, 0.4)";
  const clouds = [
    { x: 0.08, y: 0.15, s: 1.15 },
    { x: 0.33, y: 0.09, s: 0.72 },
    { x: 0.56, y: 0.2, s: 1.35 },
    { x: 0.83, y: 0.12, s: 0.88 },
  ];
  for (let i = 0; i < clouds.length; i++) {
    const c = clouds[i];
    const drift = ((time * (5 + i * 2.4) + i * 290) % (w + 520)) - 260;
    const x = (c.x * w + drift * 0.36 * parallax + w * 0.1) % (w + 300);
    const y = c.y * h + Math.sin(time * 0.16 + i * 2) * 6;
    drawCloud(ctx, x - 150, y, scale * c.s, cloudColor, shadeColor);
  }
}

function drawCloud(ctx, x, y, s, color, shade) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = shade;
  ellipse(ctx, 146, 36, 92, 24);
  ctx.fill();
  ctx.fillStyle = color;
  ellipse(ctx, 46, 42, 48, 25);
  ctx.fill();
  ellipse(ctx, 106, 24, 55, 33);
  ctx.fill();
  ellipse(ctx, 158, 32, 46, 27);
  ctx.fill();
  ellipse(ctx, 198, 44, 34, 20);
  ctx.fill();
  roundRect(ctx, 10, 38, 224, 25, 12);
  ctx.fill();
  ctx.restore();
}

export function drawHillLayer(ctx, view, camera, themeName, layer) {
  const theme = THEMES[themeName] || THEMES.day;
  const colors = [theme.hillFar, theme.hillMid, theme.hillNear];
  const parallax = [0.16, 0.28, 0.42][layer];
  const baseY = view.h * (0.75 - layer * 0.035);
  const offset = (camera.x - 850) * parallax;
  const width = view.w + 320;
  ctx.save();
  ctx.translate(-offset * 0.18, 0);
  ctx.fillStyle = colors[layer];
  ctx.globalAlpha = layer === 0 ? 0.82 : 1;
  ctx.beginPath();
  ctx.moveTo(-200, view.h);
  const step = 170;
  for (let x = -200; x <= width + 200; x += step) {
    const seed = layer * 100 + Math.floor((x + 1000) / step);
    const hh = 60 + hash(seed) * (layer === 0 ? 95 : 75);
    ctx.quadraticCurveTo(x + step * 0.5, baseY - hh, x + step, baseY);
  }
  ctx.lineTo(width + 220, view.h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawTree(ctx, x, groundY, scale, themeName, near = true) {
  const theme = THEMES[themeName] || THEMES.day;
  const trunkW = 18 * scale;
  const h = 120 * scale;
  const r = rng(Math.floor(x * 13.7));
  ctx.save();
  ctx.translate(x, groundY);
  ctx.fillStyle = themeName === "sunset" ? "#6b4225" : "#7a4a22";
  roundRect(ctx, -trunkW / 2, -h, trunkW, h, trunkW * 0.32);
  ctx.fill();
  ctx.fillStyle = near ? theme.treeNear : theme.treeFar;
  const blobs = [
    [-34, -h - 20, 36],
    [2, -h - 42, 44],
    [42, -h - 18, 33],
    [4, -h + 8, 42],
  ];
  for (const [bx, by, br] of blobs) {
    ellipse(ctx, bx * scale + (r() - 0.5) * 6, by, br * scale, br * scale * 0.86);
    ctx.fill();
  }
  ctx.fillStyle = near ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.08)";
  ellipse(ctx, -16 * scale, -h - 46 * scale, 26 * scale, 18 * scale);
  ctx.fill();
  ctx.restore();
}

export function drawBush(ctx, x, groundY, scale, themeName) {
  const theme = THEMES[themeName] || THEMES.day;
  ctx.save();
  ctx.translate(x, groundY);
  ctx.fillStyle = theme.treeNear;
  ellipse(ctx, -24 * scale, -18 * scale, 28 * scale, 22 * scale);
  ctx.fill();
  ellipse(ctx, 6 * scale, -27 * scale, 34 * scale, 27 * scale);
  ctx.fill();
  ellipse(ctx, 38 * scale, -16 * scale, 25 * scale, 19 * scale);
  ctx.fill();
  ctx.fillStyle = theme.treeFar;
  ellipse(ctx, -12 * scale, -6 * scale, 50 * scale, 16 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ellipse(ctx, 4 * scale, -38 * scale, 17 * scale, 10 * scale);
  ctx.fill();
  ctx.restore();
}

export function drawRock(ctx, x, groundY, scale, themeName) {
  const theme = THEMES[themeName] || THEMES.day;
  ctx.save();
  ctx.translate(x, groundY);
  ctx.fillStyle = themeName === "night" ? "#4d5966" : "#8b8b8a";
  ctx.beginPath();
  ctx.moveTo(-30 * scale, 0);
  ctx.lineTo(-34 * scale, -16 * scale);
  ctx.lineTo(-16 * scale, -34 * scale);
  ctx.lineTo(12 * scale, -38 * scale);
  ctx.lineTo(32 * scale, -20 * scale);
  ctx.lineTo(34 * scale, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.moveTo(-16 * scale, -34 * scale);
  ctx.lineTo(12 * scale, -38 * scale);
  ctx.lineTo(2 * scale, -20 * scale);
  ctx.lineTo(-20 * scale, -17 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawFlowers(ctx, x, groundY, scale, themeName) {
  const theme = THEMES[themeName] || THEMES.day;
  const r = rng(Math.floor(x * 7.1) + 3);
  const colors = themeName === "sunset" ? ["#ffd166", "#ff9a76", "#fff1c1"] : ["#fff3a8", "#ff9fb5", "#fdfdfd"];
  for (let i = 0; i < 6; i++) {
    const fx = (r() - 0.5) * 120 * scale;
    const fh = (8 + r() * 15) * scale;
    ctx.strokeStyle = "rgba(53, 111, 36, 0.8)";
    ctx.lineWidth = 1.6 * scale;
    ctx.beginPath();
    ctx.moveTo(x + fx, groundY);
    ctx.quadraticCurveTo(x + fx + 2 * scale, groundY - fh * 0.6, x + fx, groundY - fh);
    ctx.stroke();
    ctx.fillStyle = colors[i % colors.length];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * TAU;
      ellipse(ctx, x + fx + Math.cos(a) * 2.3 * scale, groundY - fh + Math.sin(a) * 2.3 * scale, 2.2 * scale, 2.2 * scale);
      ctx.fill();
    }
    ctx.fillStyle = "#f7a31b";
    ellipse(ctx, x + fx, groundY - fh, 1.7 * scale, 1.7 * scale);
    ctx.fill();
  }
}

export function drawGround(ctx, view, camera, themeName, time) {
  const theme = THEMES[themeName] || THEMES.day;
  const left = camera.x - view.w / 2 - 200;
  const right = camera.x + view.w / 2 + 200;
  const bottom = camera.y + view.h / 2 + 400;
  const y = 880;
  const dirt = ctx.createLinearGradient(0, y, 0, y + 520);
  dirt.addColorStop(0, theme.groundSide);
  dirt.addColorStop(0.55, theme.groundDeep);
  dirt.addColorStop(1, themeName === "sunset" ? "#4a2a14" : "#4d3117");
  ctx.fillStyle = dirt;
  ctx.fillRect(left, y + 18, right - left, bottom - y);

  const grass = ctx.createLinearGradient(0, y - 4, 0, y + 34);
  grass.addColorStop(0, theme.groundTopLight);
  grass.addColorStop(0.35, theme.groundTop);
  grass.addColorStop(1, themeName === "sunset" ? "#8f7a35" : "#4d9a31");
  ctx.fillStyle = grass;
  ctx.beginPath();
  ctx.moveTo(left, y + 26);
  const step = 34;
  for (let x = left; x <= right; x += step) {
    const blade = hash(Math.floor(x / step) + 9) * 7;
    ctx.quadraticCurveTo(x + step * 0.5, y - 5 - blade, x + step, y + 1 + hash(x) * 3);
  }
  ctx.lineTo(right, y + 34);
  ctx.lineTo(left, y + 34);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = theme.groundTopLight;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  for (let x = left; x < right; x += 26) {
    const hh = 4 + hash(x * 0.31) * 8;
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x + 2, y + 12 - hh);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  const pebbleRng = rng(2024);
  for (let i = 0; i < 90; i++) {
    const px = left + pebbleRng() * (right - left);
    const py = y + 48 + pebbleRng() * 330;
    const pr = 2 + pebbleRng() * 5;
    ctx.fillStyle = pebbleRng() > 0.5 ? "rgba(255,255,255,0.13)" : "rgba(38,22,10,0.16)";
    ellipse(ctx, px, py, pr, pr * 0.7);
    ctx.fill();
  }

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#1a120a";
  for (let i = 0; i < 26; i++) {
    const px = left + hash(i * 4.7) * (right - left);
    const py = y + 80 + hash(i * 9.1) * 300;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 10 + hash(i) * 18, py + 4);
    ctx.lineTo(px + 5, py + 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (themeName === "sunset") {
    const haze = ctx.createLinearGradient(0, y, 0, y + 160);
    haze.addColorStop(0, "rgba(255,196,120,0.22)");
    haze.addColorStop(1, "rgba(255,196,120,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(left, y, right - left, 160);
  }
}

export function drawShadow(ctx, x, y, rx, ry, alpha = 0.22) {
  const grad = ctx.createRadialGradient(x, y, 1, x, y, Math.max(rx, ry));
  grad.addColorStop(0, `rgba(25, 40, 22, ${alpha})`);
  grad.addColorStop(1, "rgba(25, 40, 22, 0)");
  ctx.fillStyle = grad;
  ellipse(ctx, x, y, rx, ry);
  ctx.fill();
}

export function drawSlingBack(ctx, sling, birdPos, themeName) {
  const { x, baseY, anchorX, anchorY } = sling;
  const ground = baseY;
  ctx.save();
  const woodGrad = ctx.createLinearGradient(x - 18, 0, x + 18, 0);
  woodGrad.addColorStop(0, "#6b3a17");
  woodGrad.addColorStop(0.4, "#a8632b");
  woodGrad.addColorStop(0.72, "#c57e3c");
  woodGrad.addColorStop(1, "#6b3a17");
  ctx.strokeStyle = woodGrad;
  ctx.lineCap = "round";
  ctx.lineWidth = 23;
  ctx.beginPath();
  ctx.moveTo(x, ground - 6);
  ctx.quadraticCurveTo(x - 3, ground - 90, x - 2, anchorY + 60);
  ctx.stroke();
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(x - 4, anchorY + 68);
  ctx.quadraticCurveTo(x - 30, anchorY + 16, x - 27, anchorY - 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 4, anchorY + 68);
  ctx.quadraticCurveTo(x + 26, anchorY + 20, x + 27, anchorY - 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 219, 162, 0.35)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 7, ground - 30);
  ctx.quadraticCurveTo(x - 8, ground - 100, x - 6, anchorY + 70);
  ctx.stroke();

  const bandColor = themeName === "night" ? "#412512" : "#55301a";
  ctx.strokeStyle = bandColor;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  if (birdPos) {
    ctx.beginPath();
    ctx.moveTo(x - 28, anchorY - 9);
    ctx.quadraticCurveTo((x - 28 + birdPos.x) / 2, (anchorY + birdPos.y) / 2 - 8, birdPos.x, birdPos.y);
    ctx.stroke();
  }
  if (birdPos) {
    ctx.fillStyle = "#4f2a12";
    roundRect(ctx, birdPos.x - 14, birdPos.y - 17, 28, 34, 11);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 213, 154, 0.18)";
    ctx.lineWidth = 2;
    roundRect(ctx, birdPos.x - 12, birdPos.y - 15, 24, 30, 9);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawSlingFront(ctx, sling, birdPos, themeName) {
  const { x, anchorY } = sling;
  if (!birdPos) return;
  const bandColor = themeName === "night" ? "#5f3a1e" : "#7a4825";
  ctx.save();
  ctx.strokeStyle = bandColor;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sling.x + 28, anchorY - 7);
  ctx.quadraticCurveTo((sling.x + 28 + birdPos.x) / 2, (anchorY + birdPos.y) / 2 + 6, birdPos.x, birdPos.y);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 215, 157, 0.18)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(sling.x + 28, anchorY - 8);
  ctx.quadraticCurveTo((sling.x + 28 + birdPos.x) / 2, (anchorY + birdPos.y) / 2 + 5, birdPos.x, birdPos.y);
  ctx.stroke();

  ctx.restore();
}

export function drawBlock(ctx, body, damage = 0) {
  const p = body.plugin || {};
  const w = p.w || 40;
  const h = p.h || 40;
  const mat = MATERIALS[p.material] || MATERIALS.wood;
  const seed = p.seed || body.id || 1;
  const ratio = Math.max(0, Math.min(1, 1 - damage));
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);

  if (p.material === "tnt") {
    drawTnt(ctx, w, h, ratio, seed);
    ctx.restore();
    return;
  }

  ctx.shadowColor = "rgba(30, 24, 12, 0.22)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;

  const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  grad.addColorStop(0, mat.light);
  grad.addColorStop(0.36, mat.base);
  grad.addColorStop(1, mat.dark);
  ctx.fillStyle = grad;
  const radius = p.material === "ice" ? 5 : 6;
  roundRect(ctx, -w / 2, -h / 2, w, h, radius);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = mat.edge;
  ctx.lineWidth = 2.6;
  roundRect(ctx, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, radius * 0.8);
  ctx.stroke();

  if (p.material === "wood") {
    ctx.save();
    roundRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.clip();
    ctx.strokeStyle = "rgba(92, 46, 12, 0.32)";
    ctx.lineWidth = 1.6;
    const along = w > h;
    const count = Math.max(2, Math.floor((along ? h : w) / 12));
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      ctx.beginPath();
      if (along) {
        const yy = -h / 2 + t * h;
        ctx.moveTo(-w / 2 - 4, yy);
        ctx.bezierCurveTo(-w * 0.15, yy - 4 + hash(seed + i) * 8, w * 0.15, yy + 4 - hash(seed + i * 2) * 8, w / 2 + 4, yy);
      } else {
        const xx = -w / 2 + t * w;
        ctx.moveTo(xx, -h / 2 - 4);
        ctx.bezierCurveTo(xx - 4 + hash(seed + i) * 8, -h * 0.15, xx + 4 - hash(seed + i * 2) * 8, h * 0.15, xx, h / 2 + 4);
      }
      ctx.stroke();
    }
    const knot = rng(seed + 17);
    for (let i = 0; i < 2; i++) {
      const kx = (knot() - 0.5) * w * 0.55;
      const ky = (knot() - 0.5) * h * 0.5;
      ctx.strokeStyle = "rgba(88, 43, 10, 0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(kx, ky, 4.5, 3.2, knot() * 3, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "rgba(255, 241, 205, 0.22)";
    roundRect(ctx, -w / 2 + 4, -h / 2 + 3, Math.max(3, w - 8), Math.min(5, h * 0.18), 2);
    ctx.fill();
    if (w > 70 && h < 40) {
      ctx.fillStyle = "rgba(79, 40, 10, 0.5)";
      const nails = 3;
      for (let i = 0; i < nails; i++) {
        const nx = -w / 2 + 12 + (i * (w - 24)) / (nails - 1);
        for (const ny of [-h / 2 + 8, h / 2 - 8]) {
          ellipse(ctx, nx, ny, 2.3, 2.3);
          ctx.fill();
        }
      }
    }
  } else if (p.material === "ice") {
    ctx.save();
    roundRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.clip();
    ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2 + h * 0.28);
    ctx.lineTo(w / 2, -h / 2 + h * 0.06);
    ctx.lineTo(w / 2, -h / 2);
    ctx.lineTo(-w / 2, -h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + w * 0.18, h / 2);
    ctx.lineTo(-w / 2 + w * 0.52, -h / 2 + h * 0.2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(38, 121, 158, 0.32)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 4, h / 2 - 7);
    ctx.lineTo(w / 2 - 4, h / 2 - 7 - hash(seed) * h * 0.4);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.save();
    roundRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.clip();
    const speck = rng(seed + 3);
    for (let i = 0; i < 18; i++) {
      const sx = (speck() - 0.5) * w;
      const sy = (speck() - 0.5) * h;
      ctx.fillStyle = speck() > 0.5 ? "rgba(255,255,255,0.15)" : "rgba(36,36,44,0.16)";
      ellipse(ctx, sx, sy, 1 + speck() * 2.8, 1 + speck() * 2.2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(60, 61, 70, 0.4)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + w * 0.12, -h / 2 + 6);
    ctx.lineTo(-w / 2 + w * 0.28, -h * 0.05);
    ctx.lineTo(-w / 2 + w * 0.18, h * 0.18);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    roundRect(ctx, -w / 2 + 4, -h / 2 + 4, Math.max(3, w - 8), Math.min(5, h * 0.16), 2);
    ctx.fill();
  }

  if (ratio < 0.78) {
    ctx.save();
    roundRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.clip();
    const crackRng = rng(seed + 77);
    ctx.strokeStyle = p.material === "ice" ? "rgba(255,255,255,0.9)" : "rgba(48, 30, 16, 0.68)";
    ctx.lineWidth = p.material === "ice" ? 2.2 : 2;
    const cracks = ratio < 0.42 ? 5 : 3;
    for (let i = 0; i < cracks; i++) {
      let cx = (crackRng() - 0.5) * w;
      let cy = (crackRng() - 0.5) * h;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const segments = 2 + Math.floor(crackRng() * 3);
      for (let s = 0; s < segments; s++) {
        cx += (crackRng() - 0.5) * w * 0.5;
        cy += (crackRng() - 0.5) * h * 0.5;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

function drawTnt(ctx, w, h, ratio, seed) {
  const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  grad.addColorStop(0, "#ff7350");
  grad.addColorStop(0.45, "#d64125");
  grad.addColorStop(1, "#8f1e10");
  ctx.fillStyle = grad;
  roundRect(ctx, -w / 2, -h / 2, w, h, 5);
  ctx.fill();
  ctx.strokeStyle = "#5c1308";
  ctx.lineWidth = 3;
  roundRect(ctx, -w / 2 + 1.5, -h / 2 + 1.5, w - 3, h - 3, 4);
  ctx.stroke();

  ctx.fillStyle = "#f7c948";
  ctx.fillRect(-w / 2 + 3, -h * 0.22, w - 6, h * 0.2);
  ctx.fillRect(-w / 2 + 3, h * 0.14, w - 6, h * 0.16);
  ctx.fillStyle = "#5b1b08";
  ctx.font = `900 ${Math.max(12, w * 0.34)}px Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TNT", 0, h * 0.025);

  ctx.strokeStyle = "#3f2a1a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, -h / 2 + 2);
  ctx.quadraticCurveTo(w * 0.25, -h / 2 - 8, w * 0.36, -h / 2 - 4);
  ctx.stroke();
  ctx.fillStyle = "#ffd85d";
  ellipse(ctx, w * 0.37, -h / 2 - 5, 3.4, 3.4);
  ctx.fill();

  if (ratio < 0.7) {
    ctx.strokeStyle = "rgba(60, 10, 4, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, -h * 0.3);
    ctx.lineTo(-w * 0.1, -h * 0.05);
    ctx.lineTo(-w * 0.2, h * 0.2);
    ctx.stroke();
  }
}

export function drawPig(ctx, body, damageRatio = 1, time = 0) {
  const p = body.plugin || {};
  const r = p.r || 28;
  const ratio = Math.max(0, Math.min(1, damageRatio));
  const seed = p.seed || body.id || 1;
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle * 0.55);

  const squash = ratio < 0.4 ? 0.94 + Math.sin(time * 6 + seed) * 0.03 : 1;
  ctx.scale(1, squash);

  const bodyGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.15);
  bodyGrad.addColorStop(0, ratio < 0.45 ? "#c3d78b" : "#c8f08d");
  bodyGrad.addColorStop(0.5, ratio < 0.45 ? "#8fb75c" : "#7fc843");
  bodyGrad.addColorStop(1, ratio < 0.45 ? "#5b8432" : "#4b8c21");
  ctx.fillStyle = bodyGrad;
  ellipse(ctx, 0, 0, r, r * 0.97);
  ctx.fill();
  ctx.strokeStyle = "rgba(44, 91, 20, 0.55)";
  ctx.lineWidth = 2;
  ellipse(ctx, 0, 0, r - 1, r * 0.97 - 1);
  ctx.stroke();

  ctx.fillStyle = "#6db534";
  ellipse(ctx, -r * 0.62, -r * 0.7, r * 0.24, r * 0.25);
  ctx.fill();
  ellipse(ctx, r * 0.62, -r * 0.7, r * 0.24, r * 0.25);
  ctx.fill();
  ctx.fillStyle = "#4d8d22";
  ellipse(ctx, -r * 0.62, -r * 0.7, r * 0.12, r * 0.13);
  ctx.fill();
  ellipse(ctx, r * 0.62, -r * 0.7, r * 0.12, r * 0.13);
  ctx.fill();

  ctx.fillStyle = "#a8dd6c";
  ellipse(ctx, 0, r * 0.42, r * 0.56, r * 0.34);
  ctx.fill();
  ctx.strokeStyle = "rgba(62, 115, 27, 0.4)";
  ctx.lineWidth = 1.5;
  ellipse(ctx, 0, r * 0.42, r * 0.56, r * 0.34);
  ctx.stroke();
  ctx.fillStyle = "#4b8c21";
  ellipse(ctx, -r * 0.18, r * 0.42, r * 0.075, r * 0.11);
  ctx.fill();
  ellipse(ctx, r * 0.18, r * 0.42, r * 0.075, r * 0.11);
  ctx.fill();

  const eyeY = -r * 0.18;
  const eyeX = r * 0.32;
  const hurt = ratio < 0.55;
  if (hurt) {
    ctx.strokeStyle = "#253a12";
    ctx.lineWidth = r * 0.08;
    ctx.lineCap = "round";
    for (const sx of [-1, 1]) {
      const ex = sx * eyeX;
      ctx.beginPath();
      ctx.moveTo(ex - r * 0.14, eyeY - r * 0.12);
      ctx.lineTo(ex + r * 0.14, eyeY + r * 0.12);
      ctx.moveTo(ex + r * 0.14, eyeY - r * 0.12);
      ctx.lineTo(ex - r * 0.14, eyeY + r * 0.12);
      ctx.stroke();
    }
  } else {
    for (const sx of [-1, 1]) {
      ctx.fillStyle = "#fffdf2";
      ellipse(ctx, sx * eyeX, eyeY, r * 0.16, r * 0.19);
      ctx.fill();
      ctx.fillStyle = "#20160d";
      ellipse(ctx, sx * eyeX + r * 0.03, eyeY + r * 0.01, r * 0.07, r * 0.09);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ellipse(ctx, sx * eyeX + r * 0.055, eyeY - r * 0.05, r * 0.025, r * 0.03);
      ctx.fill();
    }
  }

  if (!hurt) {
    ctx.strokeStyle = "#31560f";
    ctx.lineWidth = r * 0.07;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-eyeX - r * 0.13, eyeY - r * 0.32);
    ctx.lineTo(-eyeX + r * 0.12, eyeY - r * 0.38);
    ctx.moveTo(eyeX - r * 0.12, eyeY - r * 0.38);
    ctx.lineTo(eyeX + r * 0.13, eyeY - r * 0.32);
    ctx.stroke();
  } else {
    ctx.fillStyle = "rgba(88, 39, 43, 0.3)";
    ellipse(ctx, r * 0.42, r * 0.08, r * 0.17, r * 0.12);
    ctx.fill();
  }

  drawPigHat(ctx, p.hat, r, time, seed);
  ctx.restore();
}

function drawPigHat(ctx, hat, r, time, seed) {
  if (!hat) return;
  if (hat === "helmet") {
    const g = ctx.createLinearGradient(0, -r * 1.32, 0, -r * 0.55);
    g.addColorStop(0, "#d9dde4");
    g.addColorStop(0.55, "#9aa2ad");
    g.addColorStop(1, "#656d78");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -r * 0.62, r * 0.86, Math.PI * 1.03, Math.PI * 1.97);
    ctx.lineTo(r * 0.86, -r * 0.52);
    ctx.lineTo(-r * 0.86, -r * 0.52);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4f5560";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.fillStyle = "#737b87";
    roundRect(ctx, -r * 0.9, -r * 0.66, r * 1.8, r * 0.15, 4);
    ctx.fill();
    ctx.fillStyle = "#c5ccd5";
    for (const sx of [-0.52, 0.52]) {
      ellipse(ctx, sx * r, -r * 0.58, r * 0.07, r * 0.07);
      ctx.fill();
    }
  } else if (hat === "leaf") {
    ctx.save();
    ctx.translate(0, -r * 0.92);
    ctx.rotate(-0.5);
    const g = ctx.createLinearGradient(0, -r * 0.5, 0, r * 0.15);
    g.addColorStop(0, "#9fdf55");
    g.addColorStop(1, "#3f8b20");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.12);
    ctx.quadraticCurveTo(-r * 0.65, -r * 0.2, 0, -r * 0.62);
    ctx.quadraticCurveTo(r * 0.65, -r * 0.2, 0, r * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#2e6917";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.1);
    ctx.lineTo(0, -r * 0.52);
    ctx.stroke();
    ctx.restore();
  } else if (hat === "crown") {
    ctx.save();
    ctx.translate(0, -r * 0.84);
    const g = ctx.createLinearGradient(0, -r * 0.55, 0, r * 0.1);
    g.addColorStop(0, "#ffe77a");
    g.addColorStop(0.6, "#f5b719");
    g.addColorStop(1, "#c48308");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, r * 0.1);
    ctx.lineTo(-r * 0.58, -r * 0.42);
    ctx.lineTo(-r * 0.25, -r * 0.12);
    ctx.lineTo(0, -r * 0.56);
    ctx.lineTo(r * 0.25, -r * 0.12);
    ctx.lineTo(r * 0.58, -r * 0.42);
    ctx.lineTo(r * 0.7, r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#986200";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#e24a3c";
    ellipse(ctx, 0, -r * 0.1, r * 0.09, r * 0.09);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.28);
    ctx.lineTo(-r * 0.3, -r * 0.18);
    ctx.lineTo(-r * 0.34, -r * 0.01);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export function drawBird(ctx, x, y, type, r, opts = {}) {
  const angle = opts.angle || 0;
  const blink = opts.blink || 0;
  const wing = opts.wing || Math.sin((opts.time || 0) * 0.2) * 0.2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (type === "chuck") {
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, "#ffe86f");
    g.addColorStop(0.55, "#f3c519");
    g.addColorStop(1, "#b77c06");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-r * 1.04, r * 0.5);
    ctx.quadraticCurveTo(-r * 1.1, -r * 0.7, 0, -r * 1.25);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.7, r * 1.04, r * 0.5);
    ctx.quadraticCurveTo(0, r * 1.08, -r * 1.04, r * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8d5a05";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.fillStyle = "#fff1b8";
    ellipse(ctx, 0, r * 0.52, r * 0.6, r * 0.38);
    ctx.fill();
    ctx.fillStyle = "#8d5a05";
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 1.22);
    ctx.lineTo(0, -r * 1.62);
    ctx.lineTo(r * 0.24, -r * 1.2);
    ctx.closePath();
    ctx.fill();
  } else if (type === "bomb") {
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    g.addColorStop(0, "#777782");
    g.addColorStop(0.5, "#3b3b46");
    g.addColorStop(1, "#16161d");
    ctx.fillStyle = g;
    ellipse(ctx, 0, 0, r, r * 0.98);
    ctx.fill();
    ctx.strokeStyle = "#0d0d12";
    ctx.lineWidth = 2.4;
    strokeCircle(ctx, 0, 0, r - 1);
    ctx.fillStyle = "#c7b48f";
    ellipse(ctx, 0, r * 0.48, r * 0.6, r * 0.36);
    ctx.fill();
    ctx.strokeStyle = "#3f2c14";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(r * 0.2, -r * 0.9);
    ctx.quadraticCurveTo(r * 0.46, -r * 1.22, r * 0.22, -r * 1.42);
    ctx.stroke();
    ctx.fillStyle = "#ffd85d";
    ellipse(ctx, r * 0.2, -r * 1.46, r * 0.12, r * 0.12);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 184, 38, 0.55)";
    ellipse(ctx, r * 0.2, -r * 1.46, r * 0.24, r * 0.24);
    ctx.fill();
  } else if (type === "blue") {
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    g.addColorStop(0, "#b8f0ff");
    g.addColorStop(0.5, "#46b6e8");
    g.addColorStop(1, "#1b6f9d");
    ctx.fillStyle = g;
    ellipse(ctx, 0, 0, r, r * 0.96);
    ctx.fill();
    ctx.strokeStyle = "#145a80";
    ctx.lineWidth = 2;
    strokeCircle(ctx, 0, 0, r - 1);
    ctx.fillStyle = "#e9fbff";
    ellipse(ctx, 0, r * 0.45, r * 0.55, r * 0.34);
    ctx.fill();
    ctx.fillStyle = "#1b6f9d";
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.9);
    ctx.lineTo(0, -r * 1.38);
    ctx.lineTo(r * 0.18, -r * 0.92);
    ctx.closePath();
    ctx.fill();
  } else {
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    g.addColorStop(0, "#ff8a72");
    g.addColorStop(0.48, "#e42f28");
    g.addColorStop(1, "#9b1119");
    ctx.fillStyle = g;
    ellipse(ctx, 0, 0, r, r * 0.98);
    ctx.fill();
    ctx.strokeStyle = "#7f0a12";
    ctx.lineWidth = 2.4;
    strokeCircle(ctx, 0, 0, r - 1);
    ctx.fillStyle = "#ffe9c4";
    ellipse(ctx, 0, r * 0.42, r * 0.55, r * 0.4);
    ctx.fill();
  }

  const eyeY = -r * 0.18;
  const eyeX = r * 0.3;
  const eyeR = r * 0.19;
  ctx.fillStyle = "#fffdf2";
  ellipse(ctx, -eyeX, eyeY, eyeR, eyeR * 1.14);
  ctx.fill();
  ellipse(ctx, eyeX, eyeY, eyeR, eyeR * 1.14);
  ctx.fill();
  if (blink > 0.5) {
    ctx.strokeStyle = "#1c130d";
    ctx.lineWidth = r * 0.07;
    ctx.beginPath();
    ctx.moveTo(-eyeX - eyeR * 0.7, eyeY);
    ctx.lineTo(-eyeX + eyeR * 0.7, eyeY);
    ctx.moveTo(eyeX - eyeR * 0.7, eyeY);
    ctx.lineTo(eyeX + eyeR * 0.7, eyeY);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#21150e";
    ellipse(ctx, -eyeX + r * 0.025, eyeY + r * 0.02, r * 0.075, r * 0.1);
    ctx.fill();
    ellipse(ctx, eyeX + r * 0.025, eyeY + r * 0.02, r * 0.075, r * 0.1);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ellipse(ctx, -eyeX + r * 0.05, eyeY - r * 0.04, r * 0.028, r * 0.033);
    ctx.fill();
    ellipse(ctx, eyeX + r * 0.05, eyeY - r * 0.04, r * 0.028, r * 0.033);
    ctx.fill();
  }

  ctx.strokeStyle = type === "chuck" || type === "blue" ? "#3c2b09" : "#3c090e";
  ctx.lineWidth = r * 0.11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-eyeX - r * 0.17, eyeY - r * 0.37);
  ctx.lineTo(-eyeX + r * 0.15, eyeY - r * 0.25);
  ctx.moveTo(eyeX - r * 0.15, eyeY - r * 0.25);
  ctx.lineTo(eyeX + r * 0.17, eyeY - r * 0.37);
  ctx.stroke();

  if (type === "chuck") {
    ctx.fillStyle = "#f39a17";
    ctx.beginPath();
    ctx.moveTo(r * 0.62, r * 0.02);
    ctx.lineTo(r * 1.42, r * 0.16);
    ctx.lineTo(r * 0.62, r * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#a95f06";
    ctx.lineWidth = 1.8;
    ctx.stroke();
  } else if (type === "bomb") {
    ctx.fillStyle = "#f39a17";
    ctx.beginPath();
    ctx.moveTo(r * 0.6, r * 0.04);
    ctx.lineTo(r * 1.1, r * 0.2);
    ctx.lineTo(r * 0.6, r * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#a95f06";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  } else if (type === "blue") {
    ctx.fillStyle = "#f39a17";
    ctx.beginPath();
    ctx.moveTo(r * 0.62, r * 0.04);
    ctx.lineTo(r * 1.12, r * 0.17);
    ctx.lineTo(r * 0.62, r * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#a95f06";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = "#f6b52b";
    ctx.beginPath();
    ctx.moveTo(r * 0.62, -r * 0.02);
    ctx.lineTo(r * 1.32, r * 0.12);
    ctx.lineTo(r * 0.62, r * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#a95f06";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.fillStyle = "#d47a11";
    ctx.beginPath();
    ctx.moveTo(r * 0.66, r * 0.24);
    ctx.lineTo(r * 1.1, r * 0.14);
    ctx.lineTo(r * 0.66, r * 0.34);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = type === "blue" ? "#1b6f9d" : type === "bomb" ? "#1d1d24" : "#8f0c15";
  const tailY = r * 0.1;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.86, tailY + i * r * 0.13);
    ctx.lineTo(-r * 1.5, tailY + i * r * 0.36 + wing * r * 0.15);
    ctx.lineTo(-r * 0.84, tailY + i * r * 0.24 + r * 0.1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ellipse(ctx, -r * 0.36, -r * 0.52, r * 0.34, r * 0.22);
  ctx.fill();
  ctx.restore();
}

function strokeCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.stroke();
}

export function drawTrajectory(ctx, points, time) {
  if (!points.length) return;
  ctx.save();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const fade = 1 - i / points.length;
    const pulse = 0.65 + Math.sin(time * 6 - i * 0.5) * 0.25;
    ctx.globalAlpha = fade * pulse;
    ctx.fillStyle = i < 4 ? "#fff9e4" : "#ffe372";
    ellipse(ctx, p.x, p.y, 4.2 - i * 0.07, 4.2 - i * 0.07);
    ctx.fill();
  }
  ctx.restore();
}

export function drawSunHaze(ctx, w, h, themeName, alpha = 1) {
  const theme = THEMES[themeName] || THEMES.day;
  const grad = ctx.createLinearGradient(0, h * 0.42, 0, h);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(1, theme.haze);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
}
