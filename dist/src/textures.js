import { ATLAS_COLS, ATLAS_TILE, TILE, BLOCKS, ITEMS } from './content.js';

const cache = new Map();

function mulberry(seed) {
  let a = seed >>> 0;
  return function random() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToCss(rgb) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function shade(rgb, amount) {
  return rgb.map((channel) => Math.max(0, Math.min(255, Math.round(channel + amount))));
}

function paintPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function noiseFill(ctx, ox, oy, base, variants, density, random) {
  ctx.fillStyle = base;
  ctx.fillRect(ox, oy, ATLAS_TILE, ATLAS_TILE);
  for (let y = 0; y < ATLAS_TILE; y++) {
    for (let x = 0; x < ATLAS_TILE; x++) {
      if (random() < density) paintPixel(ctx, ox + x, oy + y, variants[Math.floor(random() * variants.length)]);
    }
  }
}

function drawGrassTop(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#67b84b', ['#5aa940', '#74c653', '#83d25e', '#4f9a3b'], 0.55, random);
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(random() * 14) + 1;
    const y = Math.floor(random() * 12) + 2;
    paintPixel(ctx, ox + x, oy + y, '#8fe268');
    paintPixel(ctx, ox + x, oy + y + 1, '#3f8a31');
  }
}

function drawGrassSide(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#8a5f3e', ['#7b5335', '#966a46', '#a5754d', '#6f4a2f'], 0.55, random);
  for (let x = 0; x < ATLAS_TILE; x++) {
    const depth = 3 + Math.floor(random() * 3);
    for (let y = 0; y < depth; y++) {
      paintPixel(ctx, ox + x, oy + y, y === depth - 1 ? '#4c9638' : '#65b648');
    }
    if (random() < 0.5) paintPixel(ctx, ox + x, oy + depth, '#58a53f');
  }
}

function drawStone(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#8d9093', ['#7f8285', '#9a9da0', '#74777a', '#a6a9ac'], 0.5, random);
  const cracks = [[2, 4, 5, 1], [11, 9, 3, 2], [5, 12, 4, 1], [12, 3, 1, 3]];
  for (const [x, y, w, h] of cracks) {
    ctx.fillStyle = '#63666a';
    ctx.fillRect(ox + x, oy + y, w, h);
  }
}

function drawCobble(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#6d7073', ['#626568', '#777a7d', '#585b5e'], 0.5, random);
  const stones = [
    [1, 1, 6, 5], [8, 1, 6, 4], [2, 7, 5, 4], [8, 6, 7, 5], [1, 12, 6, 3], [9, 12, 5, 3], [7, 10, 3, 2]
  ];
  for (const [x, y, w, h] of stones) {
    ctx.fillStyle = random() < 0.5 ? '#9a9da0' : '#8b8e91';
    ctx.fillRect(ox + x, oy + y, w, h);
    ctx.fillStyle = '#b0b3b6';
    ctx.fillRect(ox + x, oy + y, w, 1);
    ctx.fillStyle = '#7c7f82';
    ctx.fillRect(ox + x, oy + y + h - 1, w, 1);
  }
}

function drawSand(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#dcc88c', ['#d3bd80', '#e6d39a', '#c9b377', '#efe0ad'], 0.6, random);
}

function drawLogSide(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#7b5734', ['#6d4c2c', '#8a623c', '#5e4126', '#966c43'], 0.45, random);
  for (let x = 1; x < 16; x += 4) {
    ctx.fillStyle = '#563a22';
    ctx.fillRect(ox + x, oy, 1, 16);
    ctx.fillStyle = '#9b7048';
    ctx.fillRect(ox + x + 1, oy, 1, 16);
  }
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(random() * 16);
    const y = Math.floor(random() * 16);
    paintPixel(ctx, ox + x, oy + y, '#4a301b');
  }
}

function drawLogTop(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#b58a55', ['#a97f4c', '#c29560', '#99703f'], 0.4, random);
  ctx.strokeStyle = '#7a5731';
  ctx.lineWidth = 1;
  for (const inset of [2, 5, 8]) {
    ctx.strokeRect(ox + inset + 0.5, oy + inset + 0.5, 15 - inset * 2, 15 - inset * 2);
  }
  ctx.fillStyle = '#6e4d2a';
  ctx.fillRect(ox + 7, oy + 7, 2, 2);
}

function drawLeaves(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#3e7d34', ['#356e2c', '#4a8f3e', '#2d6126', '#58a148'], 0.7, random);
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(random() * 16);
    const y = Math.floor(random() * 16);
    paintPixel(ctx, ox + x, oy + y, random() < 0.5 ? '#6ab357' : '#25501f');
  }
}

function drawPlanks(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#ba8a52', ['#ad7f4a', '#c7965c', '#a07443', '#d0a066'], 0.4, random);
  for (let y = 0; y < 16; y += 4) {
    ctx.fillStyle = '#8b6339';
    ctx.fillRect(ox, oy + y, 16, 1);
    ctx.fillStyle = '#d7a86c';
    ctx.fillRect(ox, oy + y + 1, 16, 1);
    const seam = 3 + Math.floor(random() * 10);
    ctx.fillStyle = '#8b6339';
    ctx.fillRect(ox + seam, oy + y + 1, 1, 3);
  }
}

function drawWater(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#3e8fc4', ['#3785b8', '#4b9bd0', '#307cab', '#5aa8d8'], 0.45, random);
  for (let i = 0; i < 5; i++) {
    const y = Math.floor(random() * 16);
    ctx.fillStyle = '#7cc4e8';
    ctx.fillRect(ox + Math.floor(random() * 10), oy + y, 4 + Math.floor(random() * 4), 1);
  }
}

function drawCoalOre(ctx, ox, oy, random) {
  drawStone(ctx, ox, oy, random);
  const spots = [[3, 3, 3, 2], [10, 2, 3, 3], [5, 9, 4, 3], [11, 10, 3, 2], [2, 12, 2, 2]];
  for (const [x, y, w, h] of spots) {
    ctx.fillStyle = '#24272a';
    ctx.fillRect(ox + x, oy + y, w, h);
    ctx.fillStyle = '#3b3f43';
    ctx.fillRect(ox + x, oy + y, w, 1);
  }
}

function drawIronOre(ctx, ox, oy, random) {
  drawStone(ctx, ox, oy, random);
  const spots = [[3, 3, 3, 2], [10, 2, 2, 3], [5, 9, 3, 3], [11, 11, 3, 2], [2, 12, 2, 2]];
  for (const [x, y, w, h] of spots) {
    ctx.fillStyle = '#c08e63';
    ctx.fillRect(ox + x, oy + y, w, h);
    ctx.fillStyle = '#dfb28a';
    ctx.fillRect(ox + x, oy + y, w, 1);
  }
}

function drawBedrock(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#34363a', ['#282a2d', '#414347', '#4b4d51', '#1f2124'], 0.7, random);
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(random() * 13);
    const y = Math.floor(random() * 13);
    ctx.fillStyle = random() < 0.5 ? '#17181a' : '#56585c';
    ctx.fillRect(ox + x, oy + y, 2 + Math.floor(random() * 2), 2);
  }
}

function drawTableTop(ctx, ox, oy, random) {
  drawPlanks(ctx, ox, oy, random);
  ctx.fillStyle = '#5e4023';
  ctx.fillRect(ox, oy, 16, 1);
  ctx.fillRect(ox, oy + 15, 16, 1);
  ctx.fillRect(ox, oy, 1, 16);
  ctx.fillRect(ox + 15, oy, 1, 16);
  ctx.fillRect(ox + 5, oy + 2, 1, 12);
  ctx.fillRect(ox + 10, oy + 2, 1, 12);
  ctx.fillRect(ox + 2, oy + 5, 12, 1);
  ctx.fillRect(ox + 2, oy + 10, 12, 1);
}

function drawTableSide(ctx, ox, oy, random) {
  drawPlanks(ctx, ox, oy, random);
  ctx.fillStyle = '#5e4023';
  ctx.fillRect(ox, oy, 16, 2);
  ctx.fillRect(ox, oy + 13, 16, 3);
  ctx.fillStyle = '#8b6339';
  ctx.fillRect(ox + 2, oy + 4, 3, 7);
  ctx.fillRect(ox + 11, oy + 4, 3, 7);
  ctx.fillStyle = '#d7a86c';
  ctx.fillRect(ox + 2, oy + 4, 1, 7);
  ctx.fillRect(ox + 11, oy + 4, 1, 7);
}

function drawIronBlock(ctx, ox, oy, random) {
  noiseFill(ctx, ox, oy, '#cdd2d7', ['#c2c7cc', '#d9dee3', '#b6bbc0', '#e6ebef'], 0.4, random);
  ctx.fillStyle = '#9ba0a5';
  ctx.fillRect(ox, oy, 16, 1);
  ctx.fillRect(ox, oy + 15, 16, 1);
  ctx.fillRect(ox, oy, 1, 16);
  ctx.fillRect(ox + 15, oy, 1, 16);
  for (const [x, y] of [[3, 3], [11, 3], [3, 11], [11, 11]]) {
    ctx.fillStyle = '#9ba0a5';
    ctx.fillRect(ox + x, oy + y, 2, 2);
    ctx.fillStyle = '#eef3f7';
    ctx.fillRect(ox + x, oy + y, 1, 1);
  }
}

export function makeAtlasCanvas() {
  const size = ATLAS_COLS * ATLAS_TILE;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const draw = (tile, fn) => {
    const ox = (tile % ATLAS_COLS) * ATLAS_TILE;
    const oy = Math.floor(tile / ATLAS_COLS) * ATLAS_TILE;
    fn(ctx, ox, oy, mulberry(1000 + tile * 7919));
  };
  draw(TILE.grassTop, drawGrassTop);
  draw(TILE.grassSide, drawGrassSide);
  draw(TILE.dirt, (c, x, y, r) => noiseFill(c, x, y, '#8a5f3e', ['#7b5335', '#966a46', '#6f4a2f', '#a5754d'], 0.6, r));
  draw(TILE.stone, drawStone);
  draw(TILE.cobble, drawCobble);
  draw(TILE.sand, drawSand);
  draw(TILE.logSide, drawLogSide);
  draw(TILE.logTop, drawLogTop);
  draw(TILE.leaves, drawLeaves);
  draw(TILE.planks, drawPlanks);
  draw(TILE.water, drawWater);
  draw(TILE.coalOre, drawCoalOre);
  draw(TILE.ironOre, drawIronOre);
  draw(TILE.bedrock, drawBedrock);
  draw(TILE.tableTop, drawTableTop);
  draw(TILE.tableSide, drawTableSide);
  draw(TILE.ironBlock, drawIronBlock);
  draw(TILE.glass, (c, x, y, r) => noiseFill(c, x, y, '#b7d9e6', ['#c9e7f2', '#a6cbd9', '#dff4fa'], 0.2, r));
  return canvas;
}

function averageTile(atlas, tile) {
  const ctx = atlas.getContext('2d');
  const ox = (tile % ATLAS_COLS) * ATLAS_TILE;
  const oy = Math.floor(tile / ATLAS_COLS) * ATLAS_TILE;
  const data = ctx.getImageData(ox, oy, ATLAS_TILE, ATLAS_TILE).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 20) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (!count) return [120, 120, 120];
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

function polygon(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function speckle(ctx, points, color, random, count) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    ctx.fillRect(4 + Math.floor(random() * 56), 6 + Math.floor(random() * 50), 2, 2);
  }
  ctx.restore();
}

function drawBlockIcon(atlas, blockKey, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.scale(size / 64, size / 64);
  const block = BLOCKS[blockKey];
  const top = shade(averageTile(atlas, block.tiles.top), 20);
  const left = shade(averageTile(atlas, block.tiles.side), -8);
  const right = shade(averageTile(atlas, block.tiles.side), -34);
  const random = mulberry(block.id * 571);
  const topPoints = [[32, 5], [58, 18], [32, 31], [6, 18]];
  const leftPoints = [[6, 18], [32, 31], [32, 58], [6, 45]];
  const rightPoints = [[32, 31], [58, 18], [58, 45], [32, 58]];
  polygon(ctx, topPoints, rgbToCss(top));
  polygon(ctx, leftPoints, rgbToCss(left));
  polygon(ctx, rightPoints, rgbToCss(right));
  speckle(ctx, topPoints, rgbToCss(shade(top, 20)), random, 26);
  speckle(ctx, leftPoints, rgbToCss(shade(left, -18)), random, 34);
  speckle(ctx, rightPoints, rgbToCss(shade(right, -18)), random, 34);
  ctx.strokeStyle = 'rgba(20,22,18,0.75)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, 5);
  ctx.lineTo(58, 18);
  ctx.lineTo(58, 45);
  ctx.lineTo(32, 58);
  ctx.lineTo(6, 45);
  ctx.lineTo(6, 18);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, 18);
  ctx.lineTo(32, 31);
  ctx.lineTo(58, 18);
  ctx.moveTo(32, 31);
  ctx.lineTo(32, 58);
  ctx.stroke();
  return canvas;
}

function drawLump(ctx, colors, random) {
  const shapes = [[12, 30], [20, 18], [34, 14], [46, 21], [50, 36], [38, 48], [22, 46], [12, 38]];
  ctx.beginPath();
  ctx.moveTo(shapes[0][0], shapes[0][1]);
  for (let i = 1; i < shapes.length; i++) ctx.lineTo(shapes[i][0], shapes[i][1]);
  ctx.closePath();
  ctx.fillStyle = colors[0];
  ctx.fill();
  ctx.strokeStyle = colors[2];
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = colors[1];
  for (let i = 0; i < 9; i++) ctx.fillRect(14 + Math.floor(random() * 32), 18 + Math.floor(random() * 24), 4, 3);
}

function drawToolIcon(ctx, item) {
  const metal = item.color;
  ctx.fillStyle = 'rgba(40,28,18,0.35)';
  ctx.fillRect(17, 24, 7, 33);
  ctx.fillStyle = '#7a4c28';
  ctx.fillRect(14, 22, 7, 33);
  ctx.fillStyle = '#a9703e';
  ctx.fillRect(14, 22, 2, 33);
  ctx.fillStyle = '#5b371c';
  ctx.fillRect(19, 22, 2, 33);
  ctx.fillStyle = metal;
  if (item.tool === 'pickaxe') {
    ctx.fillRect(13, 12, 40, 7);
    ctx.fillRect(8, 16, 9, 7);
    ctx.fillRect(48, 11, 8, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(15, 13, 34, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(13, 18, 39, 2);
  } else if (item.tool === 'axe') {
    ctx.fillRect(30, 8, 22, 19);
    ctx.fillRect(26, 12, 8, 11);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(32, 10, 17, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(30, 24, 21, 3);
  } else if (item.tool === 'shovel') {
    ctx.beginPath();
    ctx.moveTo(30, 7);
    ctx.lineTo(47, 12);
    ctx.lineTo(45, 29);
    ctx.lineTo(31, 32);
    ctx.lineTo(27, 19);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(32, 10, 11, 3);
  } else {
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(-Math.PI / 4);
    ctx.fillRect(-4, -26, 8, 34);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(-3, -24, 2, 30);
    ctx.fillStyle = '#5b371c';
    ctx.fillRect(-10, 7, 20, 5);
    ctx.fillStyle = metal;
    ctx.fillRect(-4, -29, 8, 5);
    ctx.restore();
  }
}

function drawItemIcon(id, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.scale(size / 64, size / 64);
  const item = ITEMS[id];
  const random = mulberry(id.length * 977 + id.charCodeAt(0));
  if (item.kind === 'food') {
    ctx.fillStyle = '#7d3b1f';
    ctx.fillRect(30, 8, 4, 9);
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.arc(32, 35, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0745e';
    ctx.beginPath();
    ctx.arc(25, 28, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3f8a31';
    ctx.fillRect(35, 12, 10, 5);
    ctx.fillRect(42, 9, 7, 4);
    ctx.strokeStyle = 'rgba(60,20,10,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 35, 18, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.kind === 'tool') {
    drawToolIcon(ctx, item);
  } else if (id === 'stick') {
    ctx.fillStyle = '#6b4426';
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(-Math.PI / 4);
    ctx.fillRect(-4, -22, 8, 44);
    ctx.restore();
    ctx.fillStyle = '#a9703e';
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(-Math.PI / 4);
    ctx.fillRect(-3, -22, 2, 44);
    ctx.restore();
  } else if (id === 'coal') {
    drawLump(ctx, ['#2b2d30', '#494c50', '#141517'], random);
  } else if (id === 'raw_iron') {
    drawLump(ctx, ['#c18d64', '#dfb089', '#8c5d3c'], random);
  } else if (id === 'iron_ingot') {
    ctx.fillStyle = '#a9aeb3';
    ctx.fillRect(12, 28, 40, 7);
    ctx.fillStyle = '#d9dde2';
    ctx.fillRect(16, 21, 34, 10);
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(18, 22, 28, 3);
    ctx.strokeStyle = '#7f858b';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 21, 34, 10);
  } else if (id === 'torch') {
    ctx.fillStyle = '#7a4c28';
    ctx.fillRect(29, 24, 6, 30);
    ctx.fillStyle = '#a9703e';
    ctx.fillRect(29, 24, 2, 30);
    ctx.fillStyle = '#ffb347';
    ctx.fillRect(25, 13, 14, 12);
    ctx.fillStyle = '#ffe08a';
    ctx.fillRect(28, 9, 8, 12);
    ctx.fillStyle = '#ff7a1a';
    ctx.fillRect(27, 20, 10, 5);
  } else {
    ctx.fillStyle = item.color || '#8a8a8a';
    drawLump(ctx, [item.color || '#8a8a8a', '#ffffff', '#3a3a3a'], random);
  }
  return canvas;
}

export function itemIcon(id, size = 56) {
  const key = `${id}:${size}`;
  if (cache.has(key)) return cache.get(key);
  if (!atlasCanvas) atlasCanvas = makeAtlasCanvas();
  const item = ITEMS[id];
  if (!item) return '';
  let url;
  if (item.kind === 'block' && item.block !== 'torch') {
    url = drawBlockIcon(atlasCanvas, item.block, size).toDataURL();
  } else {
    url = drawItemIcon(id, size).toDataURL();
  }
  cache.set(key, url);
  return url;
}

let atlasCanvas = null;
export function getAtlasCanvas() {
  if (!atlasCanvas) atlasCanvas = makeAtlasCanvas();
  return atlasCanvas;
}
