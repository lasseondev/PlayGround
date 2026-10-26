import * as THREE from '../vendor/three.module.min.js';
import { BLOCKS, BLOCK_BY_ID, ATLAS_COLS, ATLAS_TILE, WORLD_SIZE, WORLD_HEIGHT, SEA_LEVEL } from './content.js';
import { getAtlasCanvas } from './textures.js';

const FACES = [
  {
    dir: [1, 0, 0], shade: 0.78, tile: 'side', normal: [1, 0, 0],
    corners: [[1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [1, 1, 0, 1, 1], [1, 1, 1, 0, 1]]
  },
  {
    dir: [-1, 0, 0], shade: 0.68, tile: 'side', normal: [-1, 0, 0],
    corners: [[0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 1, 1, 1], [0, 1, 0, 0, 1]]
  },
  {
    dir: [0, 1, 0], shade: 1.0, tile: 'top', normal: [0, 1, 0],
    corners: [[0, 1, 1, 0, 0], [1, 1, 1, 1, 0], [1, 1, 0, 1, 1], [0, 1, 0, 0, 1]]
  },
  {
    dir: [0, -1, 0], shade: 0.5, tile: 'bottom', normal: [0, -1, 0],
    corners: [[0, 0, 0, 0, 0], [1, 0, 0, 1, 0], [1, 0, 1, 1, 1], [0, 0, 1, 0, 1]]
  },
  {
    dir: [0, 0, 1], shade: 0.88, tile: 'side', normal: [0, 0, 1],
    corners: [[1, 0, 1, 0, 0], [0, 0, 1, 1, 0], [0, 1, 1, 1, 1], [1, 1, 1, 0, 1]]
  },
  {
    dir: [0, 0, -1], shade: 0.6, tile: 'side', normal: [0, 0, -1],
    corners: [[0, 0, 0, 0, 0], [1, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 1, 0, 0, 1]]
  }
];

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

function hash3(x, y, z, seed) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647) + Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smooth(t) {
  return t * t * (3 - 2 * t);
}

function noise2(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash3(xi, yi, 0, seed);
  const b = hash3(xi + 1, yi, 0, seed);
  const c = hash3(xi, yi + 1, 0, seed);
  const d = hash3(xi + 1, yi + 1, 0, seed);
  const u = smooth(xf);
  const v = smooth(yf);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

function fbm(x, y, seed, octaves) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise2(x * frequency, y * frequency, seed + i * 101) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / total;
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class VoxelWorld {
  constructor(seed, edits = {}) {
    this.size = WORLD_SIZE;
    this.height = WORLD_HEIGHT;
    this.seaLevel = SEA_LEVEL;
    this.seed = seed;
    this.edits = edits;
    this.data = new Uint8Array(this.size * this.height * this.size);
    this.atlas = getAtlasCanvas();
    this.trees = [];
    this.generate();
    this.applyEdits(edits);
  }

  index(x, y, z) {
    return (y * this.size + z) * this.size + x;
  }

  inBounds(x, y, z) {
    return x >= 0 && x < this.size && z >= 0 && z < this.size && y >= 0 && y < this.height;
  }

  get(x, y, z) {
    if (y < 0) return BLOCKS.bedrock.id;
    if (!this.inBounds(x, y, z)) return 0;
    return this.data[this.index(x, y, z)];
  }

  getKey(x, y, z) {
    return BLOCK_BY_ID[this.get(x, y, z)] || 'air';
  }

  isSolid(x, y, z) {
    const block = BLOCKS[this.getKey(x, y, z)];
    return Boolean(block && block.solid);
  }

  isWater(x, y, z) {
    return this.getKey(x, y, z) === 'water';
  }

  set(x, y, z, id, record = true) {
    if (!this.inBounds(x, y, z)) return false;
    this.data[this.index(x, y, z)] = id;
    if (record) this.edits[`${x},${y},${z}`] = id;
    return true;
  }

  applyEdits(edits) {
    for (const [key, id] of Object.entries(edits || {})) {
      const [x, y, z] = key.split(',').map(Number);
      if (this.inBounds(x, y, z)) this.data[this.index(x, y, z)] = id;
    }
  }

  surfaceHeight(x, z) {
    for (let y = this.height - 1; y >= 0; y--) {
      const key = this.getKey(x, y, z);
      if (key !== 'air' && key !== 'water' && key !== 'torch' && key !== 'leaves' && key !== 'log') return y;
    }
    return 0;
  }

  generate() {
    const size = this.size;
    const half = size / 2;
    const rng = mulberry(this.seed);
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        const nx = (x - half + 0.5) / half;
        const nz = (z - half + 0.5) / half;
        const distance = Math.sqrt(nx * nx + nz * nz);
        const broad = fbm((x + 31.7) * 0.052, (z + 17.3) * 0.052, this.seed, 4);
        const detail = fbm((x + 9.1) * 0.14, (z + 27.5) * 0.14, this.seed + 77, 3);
        const ridge = Math.abs(fbm(x * 0.085, z * 0.085, this.seed + 131, 2) - 0.5) * 2;
        let height = Math.round(7.4 + broad * 10 + detail * 3.2 + ridge * 2.4 - Math.pow(distance, 2.5) * 13);
        height = clamp(height, 1, this.height - 5);
        const beach = height <= this.seaLevel + 1;
        for (let y = 0; y <= height; y++) {
          let key = 'stone';
          if (y === 0) key = 'bedrock';
          else if (y === height) key = beach ? 'sand' : 'grass';
          else if (y > height - 3) key = beach ? 'sand' : 'dirt';
          if (y > 1 && y < height - 2 && key === 'stone') {
            const ore = hash3(x, y, z, this.seed + 900);
            if (ore > 0.976) key = 'coal_ore';
            else if (ore > 0.962) key = 'iron_ore';
          }
          this.data[this.index(x, y, z)] = BLOCKS[key].id;
        }
        for (let y = height + 1; y <= this.seaLevel; y++) {
          this.data[this.index(x, y, z)] = BLOCKS.water.id;
        }
      }
    }
    this.spawn = this.findSpawn();
    this.plantTrees(rng, this.spawn);
    this.vista = this.findVista();
    if (this.vista) {
      this.spawn = { x: this.vista.x, y: this.vista.y, z: this.vista.z };
    }
  }

  scoreView(x, z, top, yaw, pitch) {
    const eyeY = top + 1.62;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    let water = 0;
    let flora = 0;
    let sky = 0;
    let terrain = 0;
    let penalty = 0;
    let centerKind = 'sky';
    for (let spread = -0.4; spread <= 0.401; spread += 0.2) {
      const angle = yaw + spread;
      const dx = -Math.sin(angle) * cosPitch;
      const dz = -Math.cos(angle) * cosPitch;
      let hit = null;
      for (let distance = 1; distance < 52; distance += 1) {
        const bx = Math.floor(x + 0.5 + dx * distance);
        const by = Math.floor(eyeY + sinPitch * distance);
        const bz = Math.floor(z + 0.5 + dz * distance);
        const key = this.getKey(bx, by, bz);
        if (key !== 'air') {
          hit = { key, distance };
          break;
        }
      }
      if (!hit) {
        sky++;
        if (Math.abs(spread) < 0.01) centerKind = 'sky';
        continue;
      }
      if (Math.abs(spread) < 0.01) centerKind = hit.key;
      if (hit.key === 'water') water++;
      else if (hit.key === 'leaves' || hit.key === 'log') {
        flora++;
        if (hit.distance < 6) penalty += 9;
        else if (hit.distance < 12) penalty += 3;
      } else {
        terrain++;
        if (hit.distance < 5) penalty += 7;
        else if (hit.distance < 10) penalty += 2;
      }
    }
    let score = Math.min(water, 4) * 3.1 + Math.min(flora, 4) * 1.5
      + Math.min(terrain, 4) * 0.8 + Math.min(sky, 3) * 0.3 - penalty + top * 0.24;
    if (centerKind === 'water') score += 9;
    else if (centerKind === 'leaves' || centerKind === 'log') score -= 8;
    else if (centerKind === 'sky') score -= 2;
    if (!water) score -= 6;
    if (!flora) score -= 5;
    if (terrain < 2) score -= 2;
    return score;
  }

  findVista() {
    const center = this.size / 2;
    let best = null;
    for (let z = 3; z < this.size - 3; z += 3) {
      for (let x = 3; x < this.size - 3; x += 3) {
        const top = this.surfaceHeight(x, z);
        if (top < this.seaLevel + 4) continue;
        if (this.getKey(x, top, z) !== 'grass') continue;
        if (this.get(x, top + 1, z) !== 0 || this.get(x, top + 2, z) !== 0) continue;
        let overhead = false;
        for (let dx = -3; dx <= 3 && !overhead; dx++) {
          for (let dz = -3; dz <= 3 && !overhead; dz++) {
            if (dx * dx + dz * dz > 9) continue;
            for (let dy = 2; dy <= 7; dy++) {
              const key = this.getKey(x + dx, top + dy, z + dz);
              if (key !== 'air' && key !== 'water' && key !== 'torch') { overhead = true; break; }
            }
          }
        }
        if (overhead) continue;
        for (let step = 0; step < 12; step++) {
          const yaw = (step / 12) * Math.PI * 2;
          for (const pitch of [-0.1, -0.24]) {
            const score = this.scoreView(x, z, top, yaw, pitch) + Math.hypot(x - center, z - center) * 0.08;
            if (!best || score > best.score) best = { x: x + 0.5, z: z + 0.5, y: top + 1.02, yaw, pitch, score };
          }
        }
      }
    }
    return best;
  }

  plantTrees(rng, spawn) {
    const attempts = 150;
    const placed = [];
    for (let i = 0; i < attempts; i++) {
      const x = 4 + Math.floor(rng() * (this.size - 8));
      const z = 4 + Math.floor(rng() * (this.size - 8));
      if (spawn && Math.hypot(x + 0.5 - spawn.x, z + 0.5 - spawn.z) < 7.5) continue;
      const top = this.surfaceHeight(x, z);
      if (this.getKey(x, top, z) !== 'grass') continue;
      if (top <= this.seaLevel + 1) continue;
      if (placed.some((tree) => Math.abs(tree.x - x) + Math.abs(tree.z - z) < 6)) continue;
      if (this.get(x, top + 1, z) !== 0 || this.get(x, top + 2, z) !== 0) continue;
      const trunk = 4 + Math.floor(rng() * 3);
      for (let y = 1; y <= trunk; y++) this.data[this.index(x, top + y, z)] = BLOCKS.log.id;
      const crown = top + trunk;
      for (let dy = -2; dy <= 1; dy++) {
        const radius = dy < 0 ? 2 : 1;
        for (let dz = -radius; dz <= radius; dz++) {
          for (let dx = -radius; dx <= radius; dx++) {
            if (Math.abs(dx) === radius && Math.abs(dz) === radius && rng() < 0.55) continue;
            const px = x + dx;
            const py = crown + dy;
            const pz = z + dz;
            if (!this.inBounds(px, py, pz)) continue;
            if (this.get(px, py, pz) !== 0) continue;
            if (dx === 0 && dz === 0 && dy < 1) continue;
            this.data[this.index(px, py, pz)] = BLOCKS.leaves.id;
          }
        }
      }
      this.data[this.index(x, crown + 1, z)] = BLOCKS.leaves.id;
      placed.push({ x, z, top });
    }
    this.trees = placed;
  }

  findSpawn() {
    const center = this.size / 2;
    let best = null;
    for (let angle = 0; angle < Math.PI * 2; angle += 0.14) {
      for (let radius = 0; radius <= 16; radius += 1) {
        const x = Math.floor(center + Math.cos(angle) * radius);
        const z = Math.floor(center + Math.sin(angle) * radius);
        const top = this.surfaceHeight(x, z);
        if (top < this.seaLevel + 2) continue;
        if (this.getKey(x, top, z) !== 'grass') continue;
        let clear = true;
        for (let dy = 1; dy <= 4 && clear; dy++) {
          for (let ox = -1; ox <= 1 && clear; ox++) {
            for (let oz = -1; oz <= 1; oz++) {
              if (this.get(x + ox, top + dy, z + oz) !== 0) {
                clear = false;
                break;
              }
            }
          }
        }
        if (!clear) continue;
        if (this.trees.some((tree) => Math.abs(tree.x - x) < 3 && Math.abs(tree.z - z) < 3)) continue;
        const dx = x + 0.5 - center;
        const dz = z + 0.5 - center;
        const length = Math.hypot(dx, dz) || 1;
        const yaw = Math.atan2(-dx / length, -dz / length);
        let blocked = 0;
        for (let spread = -0.28; spread <= 0.28; spread += 0.28) {
          const angle = yaw + spread;
          const fx = -Math.sin(angle);
          const fz = -Math.cos(angle);
          for (let distance = 1; distance <= 15; distance++) {
            const bx = Math.floor(x + 0.5 + fx * distance);
            const bz = Math.floor(z + 0.5 + fz * distance);
            const key = this.getKey(bx, top + 1, bz);
            if (key !== 'air' && key !== 'water') {
              blocked += 1 + (15 - distance) * 0.18;
              break;
            }
          }
        }
        const score = top * 1.6 + radius * 0.35 + hash3(x, 0, z, this.seed + 5) * 2 - blocked * 9;
        if (!best || score > best.score) best = { x, z, top, score };
      }
    }
    if (!best) {
      const x = Math.floor(center);
      const z = Math.floor(center);
      return { x: x + 0.5, y: this.surfaceHeight(x, z) + 1.05, z: z + 0.5 };
    }
    return { x: best.x + 0.5, y: best.top + 1.05, z: best.z + 0.5 };
  }

  buildMeshes() {
    const group = new THREE.Group();
    group.name = 'voxel-world';
    const positions = [];
    const normals = [];
    const uvs = [];
    const colors = [];
    const indices = [];
    const waterPositions = [];
    const waterNormals = [];
    const waterUvs = [];
    const waterColors = [];
    const waterIndices = [];
    const torches = [];
    const inset = 0.0008;

    const pushFace = (target, face, tile, x, y, z, shade, tint) => {
      const u0 = (tile % ATLAS_COLS) / ATLAS_COLS + inset;
      const u1 = ((tile % ATLAS_COLS) + 1) / ATLAS_COLS - inset;
      const v1 = 1 - Math.floor(tile / ATLAS_COLS) / ATLAS_COLS - inset;
      const v0 = 1 - (Math.floor(tile / ATLAS_COLS) + 1) / ATLAS_COLS + inset;
      const start = target.positions.length / 3;
      for (const [cx, cy, cz, u, v] of face.corners) {
        target.positions.push(x + cx, y + cy, z + cz);
        target.normals.push(face.normal[0], face.normal[1], face.normal[2]);
        target.uvs.push(u0 + u * (u1 - u0), v0 + v * (v1 - v0));
        const value = shade * tint;
        target.colors.push(value, value, value);
      }
      target.indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    };

    const terrain = { positions, normals, uvs, colors, indices };
    const water = { positions: waterPositions, normals: waterNormals, uvs: waterUvs, colors: waterColors, indices: waterIndices };

    for (let y = 0; y < this.height; y++) {
      for (let z = 0; z < this.size; z++) {
        for (let x = 0; x < this.size; x++) {
          const id = this.get(x, y, z);
          if (!id) continue;
          const key = BLOCK_BY_ID[id];
          const block = BLOCKS[key];
          if (!block) continue;
          if (key === 'torch') {
            torches.push({ x, y, z });
            continue;
          }
          const isWater = key === 'water';
          const tint = 0.93 + hash3(x, y, z, this.seed + 33) * 0.07;
          for (const face of FACES) {
            const nx = x + face.dir[0];
            const ny = y + face.dir[1];
            const nz = z + face.dir[2];
            const neighborId = this.get(nx, ny, nz);
            const neighborKey = BLOCK_BY_ID[neighborId] || 'air';
            const neighbor = BLOCKS[neighborKey];
            if (!isWater) {
              if (neighbor && neighbor.opaque) continue;
              const tile = block.tiles[face.tile];
              pushFace(terrain, face, tile, x, y, z, face.shade, tint);
            } else {
              if (neighborId !== 0) continue;
              pushFace(water, face, block.tiles[face.tile], x, y, z, face.shade, tint);
            }
          }
        }
      }
    }

    const makeGeometry = (target) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(target.positions, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(target.normals, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(target.uvs, 2));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(target.colors, 3));
      geometry.setIndex(target.indices);
      geometry.computeBoundingSphere();
      return geometry;
    };

    const texture = new THREE.CanvasTexture(this.atlas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.texture = texture;

    const terrainMaterial = new THREE.MeshLambertMaterial({ map: texture, vertexColors: true, side: THREE.DoubleSide });
    const terrainMesh = new THREE.Mesh(makeGeometry(terrain), terrainMaterial);
    terrainMesh.name = 'terrain';
    group.add(terrainMesh);

    if (waterPositions.length) {
      const waterMaterial = new THREE.MeshLambertMaterial({
        map: texture, vertexColors: true, transparent: true, opacity: 0.68,
        depthWrite: false, side: THREE.DoubleSide
      });
      const waterMesh = new THREE.Mesh(makeGeometry(water), waterMaterial);
      waterMesh.name = 'water';
      waterMesh.position.y = -0.08;
      waterMesh.renderOrder = 2;
      group.add(waterMesh);
    }

    if (torches.length) {
      const torchMaterial = new THREE.MeshBasicMaterial({ color: 0xffc35a });
      const emberMaterial = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
      const torchGeometry = new THREE.BoxGeometry(0.12, 0.58, 0.12);
      const emberGeometry = new THREE.BoxGeometry(0.2, 0.16, 0.2);
      torches.slice(0, 140).forEach((torch, index) => {
        const post = new THREE.Mesh(torchGeometry, torchMaterial);
        post.position.set(torch.x + 0.5, torch.y + 0.29, torch.z + 0.5);
        group.add(post);
        const ember = new THREE.Mesh(emberGeometry, emberMaterial);
        ember.position.set(torch.x + 0.5, torch.y + 0.62, torch.z + 0.5);
        group.add(ember);
        if (index < 6) {
          const light = new THREE.PointLight(0xffa64d, 7, 8, 2);
          light.position.set(torch.x + 0.5, torch.y + 0.7, torch.z + 0.5);
          group.add(light);
        }
      });
    }

    this.group = group;
    return group;
  }

  disposeMeshes() {
    if (!this.group) return;
    this.group.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (object.material.map && object.material.map !== this.texture) object.material.map.dispose();
        object.material.dispose();
      }
    });
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
    if (this.group.parent) this.group.parent.remove(this.group);
    this.group = null;
  }
}
