import * as THREE from 'three';
import {
  clamp, lerp, damp, rand, easeOutCubic,
  makeWallTexture, makeFloorTexture, makeBannerTexture, makeMuralTexture,
  makeFloorGlyphTexture, makeBarrierTexture, makeWaterTexture, makeCrackTexture,
  glowTex, flameTex, makeSprite, worldUVBox,
} from './util.js';

const WALL_H = 6.2;
const WALL_T = 0.8;
const DOOR_H = 4.35;

const ROOMS = [
  { id: 'entrance', name: 'Threshold of Ash', kicker: 'The way behind', x: 0, z: 34, w: 18, d: 14, gaps: { north: [-2.5, 2.5] } },
  { id: 'hub', name: 'Hall of the Sun', kicker: 'Heart of the sanctum', x: 0, z: 0, w: 26, d: 26, gaps: { south: [-2.5, 2.5], east: [-2.5, 2.5], west: [-2.5, 2.5], north: [-2.5, 2.5] } },
  { id: 'stone', name: 'Trial of Stone', kicker: 'The first sigil', x: 35, z: 0, w: 22, d: 20, gaps: { west: [-2.5, 2.5] } },
  { id: 'flame', name: 'Trial of Flame', kicker: 'The second sigil', x: 0, z: -35, w: 22, d: 22, gaps: { south: [-2.5, 2.5], north: [-3, 3] } },
  { id: 'courage', name: 'Trial of Courage', kicker: 'The third sigil', x: -35, z: 0, w: 22, d: 20, gaps: { east: [-2.5, 2.5] } },
  { id: 'boss', name: "The Warden's Sanctum", kicker: 'The final seal', x: 0, z: -72, w: 30, d: 28, gaps: { south: [-3, 3] } },
];

const CORRIDORS = [
  { id: 'south-hall', dir: 'z', x: 0, z1: 13, z2: 27, width: 5 },
  { id: 'east-hall', dir: 'x', z: 0, x1: 13, x2: 24, width: 5 },
  { id: 'north-hall', dir: 'z', x: 0, z1: -24, z2: -13, width: 5 },
  { id: 'west-hall', dir: 'x', z: 0, x1: -24, x2: -13, width: 5 },
  { id: 'warden-hall', dir: 'z', x: 0, z1: -58, z2: -46, width: 6 },
];

export function createWorld(scene, effects, audio) {
  const world = new World(scene, effects, audio);
  world.build();
  return world;
}

class World {
  constructor(scene, effects, audio) {
    this.scene = scene;
    this.effects = effects;
    this.audio = audio;
    this.group = new THREE.Group();
    this.group.name = 'dungeon';
    this.colliders = [];
    this.torches = [];
    this.flames = [];
    this.gates = [];
    this.banners = [];
    this.pedestals = [];
    this.rooms = ROOMS;
    this.visited = new Set();
    this.time = 0;
    this.emit = () => {};
    this.minimap = { rooms: [], corridors: [] };
  }

  build() {
    this.makeMaterials();
    this.scene.add(this.group);
    for (const room of ROOMS) this.buildRoom(room);
    for (const hall of CORRIDORS) this.buildCorridor(hall);
    this.buildStoneRoom();
    this.buildFlameRoom();
    this.buildCourageRoom();
    this.buildEntrance();
    this.buildHub();
    this.buildBossSanctum();
    this.buildBossGate();
    this.buildSunstone();
    this.buildSky();
    this.buildMinimap();
  }

  /* --------------------------------------------------------- materials */

  makeMaterials() {
    this.wallTex = makeWallTexture();
    this.floorTex = makeFloorTexture();
    this.wallMat = new THREE.MeshStandardMaterial({
      map: this.wallTex, bumpMap: this.wallTex, bumpScale: 0.18,
      roughness: 0.94, metalness: 0.02, color: 0xe2d6c1,
    });
    this.floorMat = new THREE.MeshStandardMaterial({
      map: this.floorTex, bumpMap: this.floorTex, bumpScale: 0.12,
      roughness: 0.97, metalness: 0.0, color: 0xcbbc9f,
    });
    this.trimMat = new THREE.MeshStandardMaterial({ color: 0x6d5a43, roughness: 0.88, metalness: 0.05 });
    this.darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x5a4a38, roughness: 0.9 });
    this.ironMat = new THREE.MeshStandardMaterial({ color: 0x2b2a26, roughness: 0.45, metalness: 0.72 });
    this.bronzeMat = new THREE.MeshStandardMaterial({ color: 0x8a6631, roughness: 0.38, metalness: 0.82, emissive: 0x1a0d02, emissiveIntensity: 0.5 });
    this.goldMat = new THREE.MeshStandardMaterial({ color: 0xc7a15b, roughness: 0.3, metalness: 0.9, emissive: 0x2a1904, emissiveIntensity: 0.45 });
    this.runeMat = new THREE.MeshStandardMaterial({ color: 0x11322f, emissive: 0x3ddcc8, emissiveIntensity: 1.9, roughness: 0.38, metalness: 0.15 });
    this.emberRuneMat = new THREE.MeshStandardMaterial({ color: 0x351a0a, emissive: 0xff8438, emissiveIntensity: 1.5, roughness: 0.45 });
    this.waterMat = new THREE.MeshStandardMaterial({
      map: makeWaterTexture(), color: 0x7ff1e3, emissive: 0x1a9c94, emissiveIntensity: 1.0,
      transparent: true, opacity: 0.82, roughness: 0.18, metalness: 0.1,
    });
    this.barrierTex = makeBarrierTexture();
    this.glyphTex = makeFloorGlyphTexture();
    this.crackTex = makeCrackTexture();
    this.muralTex = makeMuralTexture();
    this.bannerTextures = {
      sun: makeBannerTexture('sun'), flame: makeBannerTexture('flame'),
      stone: makeBannerTexture('stone'), courage: makeBannerTexture('courage'),
    };
    this.waterMat.map.wrapS = THREE.RepeatWrapping;
    this.waterMat.map.wrapT = THREE.RepeatWrapping;
    this.waterMat.map.repeat.set(1.2, 1.2);
  }

  /* ------------------------------------------------------------ helpers */

  addBox(w, h, d, x, y, z, mat, opts = {}) {
    const geo = worldUVBox(w, h, d, opts.uvScale ?? 2.4);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    if (opts.rotY) mesh.rotation.y = opts.rotY;
    if (opts.rotZ) mesh.rotation.z = opts.rotZ;
    mesh.castShadow = opts.cast ?? true;
    mesh.receiveShadow = opts.receive ?? true;
    this.group.add(mesh);
    if (opts.collider) {
      const pad = opts.pad ?? 0;
      this.addCollider(x - w / 2 - pad, x + w / 2 + pad, z - d / 2 - pad, z + d / 2 + pad, {
        minY: opts.minY ?? 0, maxY: opts.maxY ?? y + h / 2, tag: opts.tag ?? 'prop',
      });
    }
    return mesh;
  }

  addCollider(minX, maxX, minZ, maxZ, opts = {}) {
    const c = {
      minX, maxX, minZ, maxZ,
      minY: opts.minY ?? 0,
      maxY: opts.maxY ?? WALL_H,
      tag: opts.tag ?? 'wall',
      active: true,
    };
    this.colliders.push(c);
    return c;
  }

  addFloor(w, d, cx, cz, uvScale = 3.2) {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / uvScale, pos.getZ(i) / uvScale);
    }
    const mesh = new THREE.Mesh(geo, this.floorMat);
    mesh.position.set(cx, 0.01, cz);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  addGlyph(x, z, size, color = 0x8ff9e9, opacity = 0.5, y = 0.03) {
    const mat = new THREE.MeshBasicMaterial({
      map: this.glyphTex, transparent: true, opacity, color,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    this.group.add(mesh);
    return mesh;
  }

  addCrack(x, z, size) {
    const mat = new THREE.MeshBasicMaterial({
      map: this.crackTex, transparent: true, opacity: 0.7, color: 0x2a1d13,
      depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rand(0, Math.PI * 2);
    mesh.position.set(x, 0.025, z);
    this.group.add(mesh);
    return mesh;
  }

  /* -------------------------------------------------------- architecture */

  buildRoom(room) {
    const { x, z, w, d } = room;
    const left = x - w / 2, right = x + w / 2;
    const near = z + d / 2, far = z - d / 2;
    this.addFloor(w, d, x, z);
    this.minimap.rooms.push({ id: room.id, x, z, w, d });

    const gapFor = (side) => {
      const g = room.gaps?.[side];
      if (!g) return [];
      return [{ min: g[0], max: g[1] }];
    };

    this.buildWall('x', far, left, right, WALL_T, gapFor('north'), 'north');
    this.buildWall('x', near, left, right, WALL_T, gapFor('south'), 'south');
    this.buildWall('z', left, far, near, WALL_T, gapFor('west'), 'west');
    this.buildWall('z', right, far, near, WALL_T, gapFor('east'), 'east');

    // low threshold plates at each doorway
    for (const side of Object.keys(room.gaps ?? {})) {
      const [a, b] = room.gaps[side];
      if (side === 'north' || side === 'south') {
        const zz = side === 'north' ? far : near;
        this.addBox(b - a + 0.4, 0.09, 1.0, (a + b) / 2, 0.04, zz, this.darkStoneMat, { cast: false });
      } else {
        const xx = side === 'west' ? left : right;
        this.addBox(1.0, 0.09, b - a + 0.4, xx, 0.04, (a + b) / 2, this.darkStoneMat, { cast: false });
      }
    }
  }

  buildWall(axis, fixed, from, to, thickness, gaps, side) {
    const sorted = [...gaps].sort((a, b) => a.min - b.min);
    let cursor = from;
    const segments = [];
    for (const gap of sorted) {
      if (gap.min > cursor) segments.push([cursor, gap.min]);
      cursor = Math.max(cursor, gap.max);
    }
    if (cursor < to) segments.push([cursor, to]);

    const horizontal = axis === 'x';
    for (const [a, b] of segments) {
      const len = b - a;
      if (len < 0.01) continue;
      const mid = (a + b) / 2;
      const bx = horizontal ? mid : fixed;
      const bz = horizontal ? fixed : mid;
      const w = horizontal ? len : thickness;
      const d = horizontal ? thickness : len;
      this.addBox(w, WALL_H, d, bx, WALL_H / 2, bz, this.wallMat, {
        collider: true, tag: 'wall', uvScale: 2.5,
      });
      // cornice and skirting
      this.addBox(horizontal ? len + 0.06 : thickness + 0.2, 0.26, horizontal ? thickness + 0.2 : len + 0.06,
        bx, WALL_H - 0.2, bz, this.trimMat, { cast: true, receive: true });
      this.addBox(horizontal ? len : thickness + 0.14, 0.34, horizontal ? thickness + 0.14 : len,
        bx, 0.17, bz, this.darkStoneMat, { cast: false });
    }

    // door frames and lintels
    for (const gap of sorted) {
      const mid = (gap.min + gap.max) / 2;
      const gw = gap.max - gap.min;
      const bx = horizontal ? mid : fixed;
      const bz = horizontal ? fixed : mid;
      const fw = horizontal ? 0.48 : 0.96;
      const fd = horizontal ? 0.96 : 0.48;
      for (const edge of [gap.min - 0.24, gap.max + 0.24]) {
        const ex = horizontal ? edge : fixed;
        const ez = horizontal ? fixed : edge;
        this.addBox(horizontal ? 0.48 : thickness + 0.22, DOOR_H + 0.35, horizontal ? thickness + 0.22 : 0.48,
          ex, (DOOR_H + 0.35) / 2, ez, this.trimMat);
      }
      const lintelW = horizontal ? gw + 1.0 : thickness + 0.28;
      const lintelD = horizontal ? thickness + 0.28 : gw + 1.0;
      this.addBox(lintelW, WALL_H - DOOR_H, lintelD, bx, (WALL_H + DOOR_H) / 2, bz, this.wallMat, { uvScale: 2.5 });
      this.addBox(horizontal ? gw + 0.86 : thickness + 0.36, 0.16, horizontal ? thickness + 0.36 : gw + 0.86,
        bx, DOOR_H - 0.02, bz, this.goldMat);
      this.addCollider(bx - lintelW / 2, bx + lintelW / 2, bz - lintelD / 2, bz + lintelD / 2, {
        minY: DOOR_H, maxY: WALL_H, tag: 'lintel',
      });
    }
  }

  buildCorridor(hall) {
    const { dir, width } = hall;
    if (dir === 'z') {
      const z1 = Math.min(hall.z1, hall.z2), z2 = Math.max(hall.z1, hall.z2);
      const len = z2 - z1, mid = (z1 + z2) / 2;
      this.addFloor(width, len, hall.x, mid);
      this.minimap.corridors.push({ x1: hall.x - width / 2, z1, x2: hall.x + width / 2, z2 });
      for (const side of [-1, 1]) {
        const x = hall.x + side * (width / 2 + 0.35);
        this.addBox(0.7, 5.7, len, x, 2.85, mid, this.wallMat, { collider: true, tag: 'wall', uvScale: 2.5 });
        this.addBox(0.9, 0.24, len, x, 5.58, mid, this.trimMat);
      }
      // ribs
      const ribCount = Math.max(1, Math.floor(len / 7));
      for (let i = 1; i <= ribCount; i++) {
        const z = z1 + (len * i) / (ribCount + 1);
        this.addBox(width + 0.7, 0.38, 0.5, hall.x, 4.95, z, this.trimMat);
        this.addBox(0.4, 0.7, 0.7, hall.x - width / 2 + 0.2, 4.45, z, this.trimMat);
        this.addBox(0.4, 0.7, 0.7, hall.x + width / 2 - 0.2, 4.45, z, this.trimMat);
      }
    } else {
      const x1 = Math.min(hall.x1, hall.x2), x2 = Math.max(hall.x1, hall.x2);
      const len = x2 - x1, mid = (x1 + x2) / 2;
      this.addFloor(len, width, mid, hall.z);
      this.minimap.corridors.push({ x1, z1: hall.z - width / 2, x2, z2: hall.z + width / 2 });
      for (const side of [-1, 1]) {
        const z = hall.z + side * (width / 2 + 0.35);
        this.addBox(len, 5.7, 0.7, mid, 2.85, z, this.wallMat, { collider: true, tag: 'wall', uvScale: 2.5 });
        this.addBox(len, 0.24, 0.9, mid, 5.58, z, this.trimMat);
      }
      const ribCount = Math.max(1, Math.floor(len / 6));
      for (let i = 1; i <= ribCount; i++) {
        const x = x1 + (len * i) / (ribCount + 1);
        this.addBox(0.5, 0.38, width + 0.7, x, 4.95, hall.z, this.trimMat);
        this.addBox(0.7, 0.7, 0.4, x, 4.45, hall.z - width / 2 + 0.2, this.trimMat);
        this.addBox(0.7, 0.7, 0.4, x, 4.45, hall.z + width / 2 - 0.2, this.trimMat);
      }
    }
  }

  /* ============================================================== props */

  addSconce(x, z, rotY = 0, opts = {}) {
    const group = new THREE.Group();
    group.position.set(x, opts.y ?? 3.1, z);
    group.rotation.y = rotY;
    this.group.add(group);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.7, 6), this.ironMat);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, -0.25, 0.28);
    group.add(arm);
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.5, 0.16), this.ironMat);
    bracket.position.set(0, 0, 0.04);
    group.add(bracket);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.16, 0.24, 8), this.bronzeMat);
    bowl.position.set(0, 0.06, 0.6);
    group.add(bowl);
    for (let i = 0; i < 3; i++) {
      const coal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 0), this.emberRuneMat);
      coal.position.set(rand(-0.13, 0.13), 0.14, 0.6 + rand(-0.1, 0.1));
      group.add(coal);
    }
    const flame = this.makeFlame(0, 0.36, 0.6, { scale: 0.85, intensity: 18, distance: 17, color: 0xffa257 });
    group.add(flame.group);
    this.torches.push(flame);
    return flame;
  }

  makeFlame(x, y, z, opts = {}) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const scale = opts.scale ?? 1;
    const outer = makeSprite(flameTex(), opts.color ?? 0xff7b32, 0.55);
    outer.scale.set(1.35 * scale, 2.5 * scale, 1);
    outer.position.y = 0.2 * scale;
    const core = makeSprite(flameTex(), 0xffe6a8, 0.9);
    core.scale.set(0.72 * scale, 1.65 * scale, 1);
    core.position.y = 0.06 * scale;
    group.add(outer, core);
    const light = new THREE.PointLight(opts.color ?? 0xff9a4a, 0, opts.distance ?? 16, 1.9);
    light.position.set(0, 0.4, 0);
    group.add(light);
    const handle = {
      group, outer, core, light,
      baseIntensity: opts.intensity ?? 20,
      phase: rand(0, Math.PI * 2),
      lit: opts.lit ?? true,
      emberTimer: rand(0, 0.3),
      lightOn: opts.light !== false,
      scale,
      setLit: (lit) => {
        handle.lit = lit;
        group.visible = lit;
      },
    };
    handle.setLit(handle.lit);
    if (!handle.lightOn) light.visible = false;
    this.flames.push(handle);
    return handle;
  }

  addBrazier(x, z, opts = {}) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(opts.scale ?? 1);
    this.group.add(group);
    this.addCollider(x - 0.62, x + 0.62, z - 0.62, z + 0.62, { maxY: 1.3, tag: 'brazier' });

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.46, 0.5, 12), this.darkStoneMat);
    bowl.position.y = 1.0;
    bowl.castShadow = true;
    group.add(bowl);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.07, 6, 20), this.bronzeMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.25;
    group.add(rim);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.1, 5), this.ironMat);
      leg.position.set(Math.cos(a) * 0.5, 0.55, Math.sin(a) * 0.5);
      leg.rotation.z = Math.cos(a) * 0.22;
      leg.rotation.x = -Math.sin(a) * 0.22;
      group.add(leg);
    }
    const coals = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.55, 0.12, 12), this.emberRuneMat);
    coals.position.y = 1.22;
    group.add(coals);

    const gemMat = new THREE.MeshStandardMaterial({
      color: opts.color ?? 0xffb454, emissive: opts.color ?? 0xffb454,
      emissiveIntensity: 0.18, roughness: 0.25, metalness: 0.4,
    });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), gemMat);
    gem.position.set(0, 1.08, 0.82);
    group.add(gem);
    const gemRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 5, 16), this.goldMat);
    gemRing.position.copy(gem.position);
    group.add(gemRing);

    const flame = this.makeFlame(0, 1.45, 0, {
      scale: (opts.scale ?? 1) * 1.35,
      intensity: opts.intensity ?? 34,
      distance: 19,
      color: opts.color ?? 0xff9b4a,
      lit: opts.lit ?? false,
    });
    flame.group.visible = flame.lit;
    group.add(flame.group);
    flame.gem = gem;
    flame.gemMat = gemMat;
    flame.setLit = (lit) => {
      flame.lit = lit;
      flame.group.visible = lit;
      gemMat.emissiveIntensity = lit ? 1.6 : 0.18;
    };
    flame.setLit(flame.lit);
    flame.id = opts.id ?? null;
    flame.worldPos = new THREE.Vector3(x, 1.45 * (opts.scale ?? 1), z);
    flame.baseColor = opts.color ?? 0xff9b4a;
    if (opts.registerTorch !== false) this.torches.push(flame);
    return flame;
  }

  addBanner(kind, x, y, z, rotY = 0, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;
    this.group.add(group);
    const tex = this.bannerTextures[kind] ?? this.bannerTextures.sun;
    const mat = new THREE.MeshStandardMaterial({
      map: tex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide,
      roughness: 0.92, metalness: 0.0, color: 0xdfe4dc, emissive: 0x0a1212,
      emissiveIntensity: 0.6,
    });
    const geo = new THREE.PlaneGeometry(2.1 * scale, 4.2 * scale, 8, 8);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yy = pos.getY(i);
      pos.setZ(i, Math.sin(yy * 1.4 + x) * 0.06 * scale);
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.4 * scale, 6), this.goldMat);
    rod.rotation.z = Math.PI / 2;
    rod.position.y = 2.12 * scale;
    group.add(rod);
    this.banners.push({ group, mesh, phase: rand(0, 6.2), baseRot: rotY });
    return group;
  }

  addMural(x, y, z, rotY = 0, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;
    this.group.add(group);
    const mat = new THREE.MeshStandardMaterial({
      map: this.muralTex, roughness: 0.9, metalness: 0.02,
      emissive: 0x6b512f, emissiveIntensity: 0.18,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5.2 * scale, 2.6 * scale), mat);
    plane.castShadow = false;
    plane.receiveShadow = true;
    group.add(plane);
    const w = 5.36 * scale, h = 2.76 * scale, t = 0.12;
    const frameMat = this.trimMat;
    for (const [px, py, pw, ph] of [[0, h / 2, w, t], [0, -h / 2, w, t], [-w / 2, 0, t, h], [w / 2, 0, t, h]]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.14), frameMat);
      bar.position.set(px, py, 0.03);
      group.add(bar);
    }
    return group;
  }

  addPillar(x, z, opts = {}) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    this.group.add(group);
    const broken = opts.broken ?? false;
    const h = broken ? (opts.height ?? 2.4) : (opts.height ?? 4.5);
    const r = opts.radius ?? 0.62;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.35, r * 1.5, 0.4, 8), this.darkStoneMat);
    base.position.y = 0.2;
    base.castShadow = base.receiveShadow = true;
    group.add(base);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r, h, 8), this.wallMat);
    shaft.position.y = 0.4 + h / 2;
    shaft.castShadow = shaft.receiveShadow = true;
    group.add(shaft);
    if (!broken) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.4, r * 1.05, 0.34, 8), this.darkStoneMat);
      cap.position.y = 0.4 + h + 0.17;
      cap.castShadow = true;
      group.add(cap);
      const capital = new THREE.Mesh(new THREE.BoxGeometry(r * 2.7, 0.22, r * 2.7), this.trimMat);
      capital.position.y = 0.4 + h + 0.42;
      group.add(capital);
    } else {
      const top = new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.95, 0), this.darkStoneMat);
      top.position.set(rand(-0.25, 0.25), 0.4 + h, rand(-0.25, 0.25));
      top.scale.set(1, 0.7, 1);
      top.rotation.set(rand(0, 1), rand(0, 2), rand(0, 1));
      top.castShadow = true;
      group.add(top);
    }
    this.addCollider(x - r * 1.3, x + r * 1.3, z - r * 1.3, z + r * 1.3, { maxY: h + 1, tag: 'pillar' });
    return group;
  }

  addRubble(x, z, count = 6, spread = 2) {
    for (let i = 0; i < count; i++) {
      const s = rand(0.18, 0.6);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), this.darkStoneMat);
      rock.position.set(x + rand(-spread, spread), s * 0.6, z + rand(-spread, spread));
      rock.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
      rock.castShadow = rock.receiveShadow = true;
      rock.material = this.darkStoneMat;
      this.group.add(rock);
    }
  }

  addLever(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    this.group.add(group);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.24, 8), this.darkStoneMat);
    base.position.y = 0.12;
    base.castShadow = base.receiveShadow = true;
    group.add(base);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.9, 7), this.bronzeMat);
    column.position.y = 0.65;
    group.add(column);
    const pivot = new THREE.Group();
    pivot.position.y = 1.05;
    group.add(pivot);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), this.ironMat);
    handle.position.y = 0.42;
    handle.castShadow = true;
    pivot.add(handle);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), this.emberRuneMat);
    knob.position.y = 0.9;
    pivot.add(knob);
    pivot.rotation.z = 0.55;
    this.addGlyph(x, z, 2.2, 0xff9b52, 0.3, 0.035);
    const obj = { group, pivot, pullT: 0, pull: () => { obj.pullT = 1; } };
    return obj;
  }

  addPedestal(x, z, opts = {}) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    this.group.add(group);
    const color = new THREE.Color(opts.color ?? 0x57e4d2);
    const glow = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.45, 0.38, 10), this.darkStoneMat);
    base.position.y = 0.19;
    base.castShadow = base.receiveShadow = true;
    group.add(base);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.82, 1.25, 8), this.wallMat);
    column.position.y = 1.0;
    column.castShadow = column.receiveShadow = true;
    group.add(column);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.68, 0.24, 8), this.trimMat);
    cap.position.y = 1.72;
    group.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 6, 24), glow);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.87;
    group.add(ring);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 2.4, roughness: 0.2, metalness: 0.3,
    }));
    gem.position.y = 2.55;
    gem.castShadow = true;
    group.add(gem);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.52, 2.6, 12, 1, true), new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    }));
    beam.position.y = 3.8;
    group.add(beam);
    const sprite = makeSprite(glowTex(), color, 0.75);
    sprite.scale.set(2.6, 2.6, 1);
    sprite.position.y = 2.55;
    group.add(sprite);
    this.addGlyph(x, z, 3.6, color, 0.42, 0.035);
    const obj = {
      group, gem, beam, sprite, ring, active: false, id: opts.id ?? null, color,
      x, z,
      setActive: (active) => {
        obj.active = active;
        gem.visible = active;
        beam.visible = active;
        sprite.visible = active;
        ring.visible = active;
      },
      pop: () => {
        obj.popT = 1;
      },
      popT: 0,
    };
    obj.setActive(opts.active ?? false);
    this.pedestals.push(obj);
    return obj;
  }

  addFountain() {
    const group = new THREE.Group();
    this.group.add(group);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.55, 0.85, 32), this.darkStoneMat);
    basin.position.y = 0.42;
    basin.castShadow = basin.receiveShadow = true;
    group.add(basin);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.24, 8, 40), this.trimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.88;
    rim.castShadow = true;
    group.add(rim);
    const water = new THREE.Mesh(new THREE.CircleGeometry(2.85, 48), this.waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.83;
    group.add(water);
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.78, 1.5, 8), this.wallMat);
    plinth.position.y = 1.25;
    plinth.castShadow = true;
    group.add(plinth);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.62, 0.22, 8), this.trimMat);
    cap.position.y = 2.02;
    group.add(cap);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x8ff8e8, emissive: 0x34d9c4, emissiveIntensity: 2.2,
      roughness: 0.18, metalness: 0.35,
    });
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), orbMat);
    orb.position.y = 2.75;
    orb.castShadow = true;
    group.add(orb);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 6, 32), this.runeMat);
    ring.position.y = 2.75;
    ring.rotation.x = 0.6;
    group.add(ring);
    const ring2 = ring.clone();
    ring2.rotation.set(1.2, 0.3, 0);
    ring2.scale.setScalar(0.8);
    group.add(ring2);
    const glow = makeSprite(glowTex(), 0x57e4d2, 0.65);
    glow.scale.set(4.2, 4.2, 1);
    glow.position.y = 2.75;
    group.add(glow);
    const light = new THREE.PointLight(0x4fe3cf, 15, 16, 1.8);
    light.position.set(0, 3.0, 0);
    group.add(light);
    this.addCollider(-2.7, 2.7, -2.7, 2.7, { maxY: 1.2, tag: 'fountain' });
    this.addGlyph(0, 0, 9.2, 0x57e4d2, 0.22, 0.028);
    const sockets = [];
    const colors = [0x57e4d2, 0xff9b52, 0xa9d8ff];
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
      const sock = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), new THREE.MeshStandardMaterial({
        color: 0x1c2b2a, emissive: 0x000000, emissiveIntensity: 0, roughness: 0.3, metalness: 0.4,
      }));
      sock.position.set(Math.cos(a) * 1.15, 2.45, Math.sin(a) * 1.15);
      group.add(sock);
      sockets.push({ mesh: sock, color: new THREE.Color(colors[i]), lit: false });
    }
    return { group, orb, rings: [ring, ring2], water, sockets, pos: { x: 0, z: 0 } };
  }

  addSealedDoor() {
    const z = 41.05;
    const mat = new THREE.MeshStandardMaterial({ map: this.wallTex, color: 0x9c8a70, roughness: 0.92 });
    const left = new THREE.Mesh(worldUVBox(2.4, 4.2, 0.4, 2.2), mat);
    left.position.set(-1.25, 2.1, z);
    this.group.add(left);
    const right = left.clone();
    right.position.x = 1.25;
    this.group.add(right);
    const sun = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.07, 8, 28), this.goldMat);
    sun.position.set(0, 2.5, z - 0.24);
    this.group.add(sun);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.72, 24), new THREE.MeshStandardMaterial({
      color: 0x2a1e10, emissive: 0x9a6b22, emissiveIntensity: 0.35, roughness: 0.6,
    }));
    disc.position.set(0, 2.5, z - 0.245);
    disc.rotation.y = Math.PI;
    this.group.add(disc);
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(7.6 - i * 0.4, 0.18, 1.2 - i * 0.18), this.wallMat);
      step.position.set(0, 0.09 + i * 0.18, 40.6 - i * 0.65);
      step.receiveShadow = true;
      this.group.add(step);
    }
  }

  addGuardianStatue(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    this.group.add(group);
    const stone = new THREE.MeshStandardMaterial({ color: 0x776550, roughness: 0.95, flatShading: true });
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 1.9), this.darkStoneMat);
    plinth.position.y = 0.65;
    plinth.castShadow = plinth.receiveShadow = true;
    group.add(plinth);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.2, 0.8), stone);
    body.position.y = 2.5;
    body.castShadow = true;
    group.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.8, 0.7), stone);
    head.position.y = 4.0;
    head.castShadow = true;
    group.add(head);
    const helm = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.7, 4), this.bronzeMat);
    helm.position.y = 4.6;
    helm.rotation.y = Math.PI / 4;
    group.add(helm);
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.7), stone);
      shoulder.position.set(side * 0.88, 3.4, 0);
      group.add(shoulder);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.5, 0.4), stone);
      arm.position.set(side * 0.92, 2.65, 0.06);
      group.add(arm);
    }
    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.2, 6), this.ironMat);
    spear.position.set(0.95, 2.5, 0.3);
    group.add(spear);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.6, 4), this.bronzeMat);
    tip.position.set(0.95, 4.9, 0.3);
    group.add(tip);
    this.addCollider(x - 1.2, x + 1.2, z - 1.2, z + 1.2, { maxY: 4.8, tag: 'statue' });
    return group;
  }

  makePortcullis(cx, cz, span, axis = 'z', opts = {}) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    this.group.add(group);
    const h = 4.25;
    const bars = Math.max(5, Math.floor(span / 0.85));
    for (let i = 0; i < bars; i++) {
      const off = -span / 2 + 0.3 + (i / (bars - 1)) * (span - 0.6);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, h, 6), this.ironMat);
      bar.position.set(axis === 'x' ? off : 0, h / 2, axis === 'z' ? off : 0);
      bar.castShadow = true;
      group.add(bar);
    }
    for (const y of [0.35, 2.05, 3.85]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(axis === 'x' ? span : 0.14, 0.14, axis === 'z' ? span : 0.14), this.ironMat);
      rail.position.y = y;
      group.add(rail);
    }
    for (const y of [0.35, 3.85]) {
      for (const side of [-1, 1]) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 4), this.bronzeMat);
        spike.position.set(axis === 'x' ? side * (span / 2 - 0.3) : 0, y - 0.25, axis === 'z' ? side * (span / 2 - 0.3) : 0);
        spike.rotation.x = Math.PI;
        group.add(spike);
      }
    }
    const collider = axis === 'z'
      ? this.addCollider(cx - 0.35, cx + 0.35, cz - span / 2, cz + span / 2, { maxY: 4.4, tag: 'gate' })
      : this.addCollider(cx - span / 2, cx + span / 2, cz - 0.35, cz + 0.35, { maxY: 4.4, tag: 'gate' });
    const gate = {
      group, collider, axis, span, cx, cz,
      y: opts.open ? -4.5 : 0,
      target: opts.open ? -4.5 : 0,
      open: opts.open ?? false,
      setOpen: (open, silent = false) => {
        gate.open = open;
        gate.target = open ? -4.5 : 0;
        if (!silent && open) this.audio.gate();
      },
      update: (dt) => {
        gate.y = damp(gate.y, gate.target, 5.5, dt);
        group.position.y = gate.y;
        collider.active = gate.y > -3.2;
      },
    };
    group.position.y = gate.y;
    collider.active = gate.y > -3.2;
    this.gates.push(gate);
    return gate;
  }

  /* ============================================================ rooms */

  buildEntrance() {
    this.addSealedDoor();
    this.addSconce(-6, 40.2, Math.PI);
    this.addSconce(6, 40.2, Math.PI);
    this.addBanner('sun', -6.4, 3.2, 27.45, 0, 0.85);
    this.addBanner('sun', 6.4, 3.2, 27.45, 0, 0.85);
    this.addRubble(-7.2, 29.2, 5, 1.4);
    this.addRubble(7, 38.5, 4, 1.2);
    this.addCrack(6.8, 32, 5);
  }

  buildHub() {
    this.fountain = this.addFountain();
    this.addSconce(-11.4, -9.5, Math.PI / 2);
    this.addSconce(11.4, 9.5, -Math.PI / 2);
    this.addSconce(-11.4, 9.5, Math.PI / 2);
    this.addSconce(11.4, -9.5, -Math.PI / 2);
    this.addBanner('sun', -6.6, 3.3, -12.4, 0, 1);
    this.addBanner('sun', 6.6, 3.3, -12.4, 0, 1);
    this.addBanner('sun', -6.6, 3.3, 12.4, Math.PI, 1);
    this.addBanner('sun', 6.6, 3.3, 12.4, Math.PI, 1);
    this.addBanner('stone', -12.4, 3.3, -5.5, Math.PI / 2, 0.8);
    this.addBanner('courage', 12.4, 3.3, 5.5, -Math.PI / 2, 0.8);
    this.addCrack(-8, -4.5, 7);
    this.addCrack(9.5, 8.5, 5);
    this.addRubble(-11.7, 12, 4, 0.9);
  }

  buildStoneRoom() {
    // sigil alcove behind a portcullis
    this.addBox(4.2, 4.55, 0.7, 44, 2.27, 4.25, this.wallMat, { collider: true, tag: 'wall', uvScale: 2.5 });
    this.addBox(4.2, 4.55, 0.7, 44, 2.27, -4.25, this.wallMat, { collider: true, tag: 'wall', uvScale: 2.5 });
    this.stoneGate = this.makePortcullis(42, 0, 8, 'z', { open: false });
    this.addPillar(29, -6.5);
    this.addPillar(29, 6.5);
    this.addPillar(40.5, 7.2, { broken: true, height: 2.2 });
    this.addPillar(40.5, -7.2, { broken: true, height: 1.7 });
    this.addSconce(26.5, -9.35, 0);
    this.addSconce(43.5, 9.35, Math.PI);
    this.addBanner('stone', 24.4, 3.3, -5.4, Math.PI / 2, 0.8);
    this.addBanner('stone', 24.4, 3.3, 5.4, Math.PI / 2, 0.8);
    this.addCrack(30.5, 1.5, 6);
    this.addRubble(45, 8, 5, 0.8);
    this.addRubble(26, -8, 4, 0.9);
    this.buildStonePuzzle();
    this.stonePedestal = this.addPedestal(44, 0, { color: 0x57e4d2, id: 'stone' });
  }

  buildFlameRoom() {
    this.eternal = this.addBrazier(0, -27.5, { color: 0xffc46a, scale: 1.12, lit: true, intensity: 38, id: 'eternal' });
    this.flameBraziers = {
      sun: this.addBrazier(-7, -37.6, { color: 0xffb454, id: 'sun', lit: false }),
      moon: this.addBrazier(7, -37.6, { color: 0x5fe6ff, id: 'moon', lit: false }),
      star: this.addBrazier(0, -41.8, { color: 0xb18cff, id: 'star', lit: false }),
    };
    this.flamePedestal = this.addPedestal(0, -34.6, { color: 0xff9b52, id: 'flame' });
    this.addMural(10.55, 3.25, -35, -Math.PI / 2, 1);
    this.addSconce(-10.4, -43.2, Math.PI / 2);
    this.addSconce(10.4, -43.2, -Math.PI / 2);
    this.addBanner('flame', -6.4, 3.25, -23.5, Math.PI, 0.9);
    this.addBanner('flame', 6.4, 3.25, -23.5, Math.PI, 0.9);
    this.addPillar(-8.6, -30.5, { broken: true, height: 2.6 });
    this.addPillar(8.6, -30.5, { broken: true, height: 2.3 });
    this.addCrack(-3.5, -30, 6);
    this.addCrack(4.5, -43, 5);
    this.addRubble(-9.8, -25.5, 3, 0.8);
    this.buildFlamePuzzle();
  }

  buildCourageRoom() {
    this.combatGate = this.makePortcullis(-24, 0, 5, 'z', { open: true });
    this.combatPedestal = this.addPedestal(-35, 0, { color: 0xa9d8ff, id: 'courage' });
    this.addGlyph(-35, 0, 10.5, 0xa9d8ff, 0.26, 0.032);
    this.addPillar(-41, -6.5);
    this.addPillar(-41, 6.5);
    this.addPillar(-29, -6.5);
    this.addPillar(-29, 6.5, { broken: true, height: 2.1 });
    this.addSconce(-44.4, -9.35, 0);
    this.addSconce(-25.6, 9.35, Math.PI);
    this.addBanner('courage', -45.4, 3.3, -5.4, Math.PI / 2, 0.85);
    this.addBanner('courage', -45.4, 3.3, 5.4, Math.PI / 2, 0.85);
    this.addCrack(-30.5, 3, 5);
    this.addCrack(-40, -8, 4.5);
    this.addRubble(-44.5, 8, 5, 0.9);
    this.addRubble(-27, -8.5, 4, 0.8);
  }

  buildBossSanctum() {
    this.addPillar(-10, -65, { height: 5.6, radius: 0.85 });
    this.addPillar(10, -65, { height: 5.6, radius: 0.85, broken: true });
    this.addPillar(-10, -79, { height: 5.6, radius: 0.85, broken: true });
    this.addPillar(10, -79, { height: 5.6, radius: 0.85 });
    this.addGuardianStatue(-6.2, -59.6, -0.3);
    this.addGuardianStatue(6.2, -59.6, 0.3);
    this.addSconce(-13.6, -80, Math.PI / 2);
    this.addSconce(13.6, -80, -Math.PI / 2);
    this.addSconce(0, -85.4, 0, { y: 4.3 });
    this.addGlyph(0, -72, 15, 0xff9b52, 0.18, 0.03);
    this.addCrack(-7, -70, 8);
    this.addCrack(8, -76, 7);
    this.addRubble(-13.5, -62, 6, 1);
    this.addRubble(13.5, -84, 5, 1);
    // dais at the far end
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.2, 0.5, 20), this.darkStoneMat);
    dais.position.set(0, 0.25, -83.5);
    dais.receiveShadow = true;
    this.group.add(dais);
    const altar = this.addBox(2.2, 1.4, 1.4, 0, 1.2, -84.6, this.darkStoneMat, {});
    const crown = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.1, 8, 30), this.goldMat);
    crown.position.set(0, 2.4, -84.6);
    crown.rotation.x = 0.3;
    this.group.add(crown);
    this.buildBarrier();
  }

  /* ========================================================== puzzles */

  buildStonePuzzle() {
    const start = { x: 34, z: 1.5 };
    const platePos = { x: 39, z: -4 };
    const half = 1.05;

    const blockGroup = new THREE.Group();
    blockGroup.position.set(start.x, half, start.z);
    this.group.add(blockGroup);
    const blockMat = new THREE.MeshStandardMaterial({
      map: this.wallTex, bumpMap: this.wallTex, bumpScale: 0.15,
      color: 0xb7beb3, roughness: 0.85, metalness: 0.08,
      emissive: 0x0e2f2c, emissiveIntensity: 0.65,
    });
    const blockMesh = new THREE.Mesh(worldUVBox(half * 2, half * 2, half * 2, 1.8), blockMat);
    blockMesh.castShadow = blockMesh.receiveShadow = true;
    blockGroup.add(blockMesh);
    for (const side of [-1, 1]) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.09, half * 2.02, 0.09), this.goldMat);
      edge.position.set(side * (half - 0.06), 0, half - 0.06);
      blockGroup.add(edge);
      const edge2 = edge.clone();
      edge2.position.z = -(half - 0.06);
      blockGroup.add(edge2);
    }
    const topRune = makeSprite(glowTex(), 0x57e4d2, 0.35);
    topRune.scale.set(1.4, 1.4, 1);
    topRune.position.y = half + 0.02;
    topRune.material.rotation = 0.4;
    blockGroup.add(topRune);
    const blockGlow = new THREE.PointLight(0x57e4d2, 3, 6, 2);
    blockGlow.position.y = half + 0.3;
    blockGroup.add(blockGlow);
    const blockCollider = this.addCollider(start.x - half, start.x + half, start.z - half, start.z + half, {
      maxY: half * 2, tag: 'block',
    });

    const plateGroup = new THREE.Group();
    plateGroup.position.set(platePos.x, 0, platePos.z);
    this.group.add(plateGroup);
    const plateBase = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.7, 0.18, 24), this.darkStoneMat);
    plateBase.position.y = 0.09;
    plateBase.receiveShadow = true;
    plateGroup.add(plateBase);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.24, 1.24, 0.16, 24), this.trimMat);
    disc.position.y = 0.24;
    disc.receiveShadow = true;
    plateGroup.add(disc);
    const plateRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.05, 6, 36), this.runeMat.clone());
    plateRing.rotation.x = Math.PI / 2;
    plateRing.position.y = 0.33;
    plateGroup.add(plateRing);
    const plateGlow = makeSprite(glowTex(), 0x57e4d2, 0.28);
    plateGlow.scale.set(3.4, 3.4, 1);
    plateGlow.position.y = 0.3;
    plateGlow.material.rotation = Math.PI / 2;
    plateGroup.add(plateGlow);
    this.addGlyph(platePos.x, platePos.z, 4.4, 0x57e4d2, 0.35, 0.04);

    const lever = this.addLever(27.2, 7.4);
    const stone = {
      block: { x: start.x, z: start.z, half, group: blockGroup, collider: blockCollider, glow: blockGlow },
      plate: { x: platePos.x, z: platePos.z, disc, ring: plateRing, glow: plateGlow, pressed: false },
      start: { ...start },
      solved: false,
      gate: this.stoneGate,
      lever,
      scrapeSound: 0,
      tryPush: (playerPos, move, dt) => {
        if (Math.abs(move.x) < 0.001 && Math.abs(move.z) < 0.001) return null;
        const b = stone.block;
        const dx = b.x - playerPos.x;
        const dz = b.z - playerPos.z;
        const reachX = half + 0.9;
        const reachZ = half + 0.9;
        let axis = null, sign = 0;
        if (Math.abs(move.x) > Math.abs(move.z)) {
          if (Math.abs(dz) > reachZ || Math.abs(dx) > half + 1.2) return null;
          sign = Math.sign(move.x);
          if (sign > 0 && dx > 0 && playerPos.x < b.x && Math.abs(dz) < half + 0.8) axis = 'x';
          if (sign < 0 && dx < 0 && playerPos.x > b.x && Math.abs(dz) < half + 0.8) axis = 'x';
        } else {
          if (Math.abs(dx) > reachX || Math.abs(dz) > half + 1.2) return null;
          sign = Math.sign(move.z);
          if (sign > 0 && dz > 0 && playerPos.z < b.z && Math.abs(dx) < half + 0.8) axis = 'z';
          if (sign < 0 && dz < 0 && playerPos.z > b.z && Math.abs(dx) < half + 0.8) axis = 'z';
        }
        if (!axis) return null;
        const step = 1.55 * dt * sign;
        const nx = b.x + (axis === 'x' ? step : 0);
        const nz = b.z + (axis === 'z' ? step : 0);
        if (nx - half < 24.9 || nx + half > 45.1 || nz - half < -9.1 || nz + half > 9.1) return null;
        if (!this.isBoxFree(nx - half, nx + half, nz - half, nz + half, blockCollider)) return null;
        b.x = nx; b.z = nz;
        blockGroup.position.x = nx;
        blockGroup.position.z = nz;
        blockCollider.minX = nx - half;
        blockCollider.maxX = nx + half;
        blockCollider.minZ = nz - half;
        blockCollider.maxZ = nz + half;
        stone.scrapeSound -= dt;
        if (stone.scrapeSound <= 0) {
          this.audio.noise({ dur: 0.16, gain: 0.035, f0: 240, f1: 160, type: 'lowpass', q: 1.2, send: 0.2 });
          stone.scrapeSound = 0.32;
        }
        return { axis, sign };
      },
      reset: () => {
        const b = stone.block;
        b.x = start.x; b.z = start.z;
        blockGroup.position.set(start.x, half, start.z);
        blockCollider.minX = start.x - half;
        blockCollider.maxX = start.x + half;
        blockCollider.minZ = start.z - half;
        blockCollider.maxZ = start.z + half;
        this.effects.dust({ x: start.x, y: 0.4, z: start.z }, 16);
        this.audio.gate();
        lever.pull();
      },
      update: (dt) => {
        const b = stone.block;
        const onPlate = Math.abs(b.x - platePos.x) < 1.0 && Math.abs(b.z - platePos.z) < 1.0;
        if (onPlate !== stone.plate.pressed) {
          stone.plate.pressed = onPlate;
          if (onPlate) {
            this.effects.dust({ x: platePos.x, y: 0.2, z: platePos.z }, 20);
            this.effects.spark({ x: platePos.x, y: 0.5, z: platePos.z }, '#8ffff0', 18);
            this.audio.gate();
          }
        }
        if (onPlate && !stone.solved) {
          stone.solved = true;
          stone.gate.setOpen(true, true);
          this.stonePedestal.setActive(true);
          this.stonePedestal.pop();
          this.effects.burst({ x: 44, y: 2.5, z: 0 }, '#7ff5e5', 34, { speed: 2.6, up: 3 });
          this.effects.shockwave({ x: platePos.x, y: 0, z: platePos.z }, { color: '#57e4d2', maxRadius: 5, duration: 0.8 });
          this.audio.solve();
          this.emit({ type: 'stone-solved' });
        }
        const target = onPlate ? 0.16 : 0.24;
        disc.position.y = damp(disc.position.y, target, 12, dt);
        plateRing.material.emissiveIntensity = damp(plateRing.material.emissiveIntensity, onPlate ? 3.2 : 1.8, 5, dt);
        plateGlow.material.opacity = damp(plateGlow.material.opacity, onPlate ? 0.55 : 0.2, 5, dt);
        blockGlow.intensity = damp(blockGlow.intensity, onPlate ? 7 : 3, 5, dt);
        topRune.material.rotation += dt * 0.4;
        // lever animation
        lever.pullT = Math.max(0, lever.pullT - dt * 1.3);
        lever.pivot.rotation.z = 0.55 - Math.sin(lever.pullT * Math.PI) * 1.15;
      },
    };
    this.stone = stone;
  }

  buildFlamePuzzle() {
    const sequence = ['sun', 'moon', 'star'];
    const flame = {
      sequence,
      progress: [],
      solved: false,
      lit: (id) => {
        if (flame.solved) return 'solved';
        if (!this.flameBraziers[id]) return 'missing';
        if (flame.progress.includes(id)) return 'already';
        const expected = sequence[flame.progress.length];
        if (id === expected) {
          this.flameBraziers[id].setLit(true);
          flame.progress.push(id);
          this.audio.flame();
          this.effects.burst(this.flameBraziers[id].worldPos, '#ffcf8a', 18, { speed: 1.8, up: 2.6 });
          if (flame.progress.length === sequence.length) {
            flame.solved = true;
            this.flamePedestal.setActive(true);
            this.flamePedestal.pop();
            this.effects.burst({ x: 0, y: 2.6, z: -34.6 }, '#ffd08a', 46, { speed: 3.2, up: 3.4, lifeScale: 1.2 });
            this.effects.shockwave({ x: 0, y: 0, z: -34.6 }, { color: '#ff9b52', maxRadius: 6, duration: 1.1 });
            this.audio.solve();
            this.emit({ type: 'flame-solved' });
          }
          return 'correct';
        }
        for (const key of sequence) this.flameBraziers[key].setLit(false);
        flame.progress = [];
        this.audio.wrong();
        this.emit({ type: 'flame-wrong' });
        return 'wrong';
      },
      reset: () => {
        for (const key of sequence) this.flameBraziers[key].setLit(false);
        flame.progress = [];
      },
    };
    this.flame = flame;
  }

  /* ======================================================= boss & end */

  buildBossGate() {
    const group = new THREE.Group();
    group.position.set(0, 0, -45.92);
    this.group.add(group);
    const doorMat = new THREE.MeshStandardMaterial({
      map: this.wallTex, color: 0x8d7b62, roughness: 0.9, metalness: 0.04,
      emissive: 0x0a0c0c, emissiveIntensity: 0.4,
    });
    const medallions = [];
    const colors = [0x57e4d2, 0xff9b52, 0xa9d8ff];
    const makeDoor = (side) => {
      const door = new THREE.Group();
      door.position.x = side * 1.5;
      group.add(door);
      const slab = new THREE.Mesh(worldUVBox(2.95, 4.25, 0.45, 2.1), doorMat);
      slab.position.y = 2.125;
      slab.castShadow = slab.receiveShadow = true;
      door.add(slab);
      for (const y of [0.45, 2.15, 3.85]) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.52), this.goldMat);
        band.position.y = y;
        door.add(band);
      }
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.04, 6, 28), this.bronzeMat);
      ring.position.set(0, 2.15, 0.25);
      door.add(ring);
      return door;
    };
    const left = makeDoor(-1);
    const right = makeDoor(1);
    const leftXs = [-0.7, 0.7];
    const rightXs = [0];
    for (let i = 0; i < 3; i++) {
      const parent = i < 2 ? left : right;
      const posX = i < 2 ? leftXs[i] : rightXs[0];
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1c2422, emissive: colors[i], emissiveIntensity: 0.05,
        roughness: 0.32, metalness: 0.45,
      });
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.08, 20), mat);
      disc.rotation.x = Math.PI / 2;
      disc.position.set(posX, 2.2, 0.26);
      parent.add(disc);
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.045, 6, 22), this.goldMat);
      torus.position.set(posX, 2.2, 0.27);
      parent.add(torus);
      medallions.push({ mesh: disc, mat, color: new THREE.Color(colors[i]) });
    }
    const collider = this.addCollider(-3, 3, -46.3, -45.55, { maxY: 4.4, tag: 'boss-gate' });
    const gate = {
      group, left, right, medallions, collider,
      progress: 0,
      opening: false,
      opened: false,
      setSigils: (n) => {
        medallions.forEach((m, i) => {
          m.mat.emissiveIntensity = i < n ? 2.3 : 0.05;
          m.mat.color.set(i < n ? m.color : new THREE.Color(0x1c2422));
        });
      },
      open: () => {
        if (gate.opening) return;
        gate.opening = true;
        this.audio.doorRumble();
        this.effects.dust({ x: 0, y: 1.2, z: -46 }, 26);
        this.effects.burst({ x: 0, y: 2.4, z: -46 }, '#ffcf8a', 30, { speed: 3.4, up: 2 });
        this.emit({ type: 'boss-gate-open' });
      },
      update: (dt) => {
        const target = gate.opening ? 1 : 0;
        gate.progress = damp(gate.progress, target, 2.2, dt);
        const e = easeOutCubic(gate.progress);
        left.position.x = -1.5 - e * 3.35;
        right.position.x = 1.5 + e * 3.35;
        collider.active = gate.progress < 0.82;
        if (gate.opening && gate.progress > 0.82 && !gate.opened) {
          gate.opened = true;
          this.effects.dust({ x: 0, y: 0.5, z: -46 }, 20);
        }
      },
    };
    gate.setSigils(0);
    this.bossGate = gate;
  }

  buildBarrier() {
    const mat = new THREE.MeshBasicMaterial({
      map: this.barrierTex, color: 0x6ff5e4, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 5.4), mat);
    mesh.position.set(0, 2.7, -58);
    mesh.rotation.y = Math.PI;
    this.group.add(mesh);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 5.8), new THREE.MeshBasicMaterial({
      color: 0x2f8f88, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
    }));
    glow.position.set(0, 2.7, -58.06);
    glow.rotation.y = Math.PI;
    this.group.add(glow);
    const collider = this.addCollider(-3, 3, -58.35, -57.7, { maxY: 5.4, tag: 'barrier' });
    collider.active = false;
    this.barrier = {
      mesh, glow, collider, active: false, target: 0,
      setActive: (active) => {
        this.barrier.active = active;
        this.barrier.target = active ? 0.5 : 0;
        collider.active = active;
        if (active) {
          this.audio.gate();
          this.effects.dust({ x: 0, y: 0.5, z: -58 }, 16);
        }
      },
      update: (dt, t) => {
        mat.opacity = damp(mat.opacity, this.barrier.target, 4, dt);
        glow.material.opacity = damp(glow.material.opacity, this.barrier.target * 0.22, 4, dt);
        if (mat.opacity > 0.01) {
          mat.map.offset.y = (mat.map.offset.y - dt * 0.13) % 1;
          mat.opacity = this.barrier.target * (0.82 + Math.sin(t * 3.2) * 0.18);
        }
      },
    };
  }

  buildSunstone() {
    const group = new THREE.Group();
    group.position.set(0, 1.4, -72);
    group.visible = false;
    this.group.add(group);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xfff3c4, emissive: 0xffc45e, emissiveIntensity: 2.0,
      roughness: 0.14, metalness: 0.5,
    });
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 2), orbMat);
    orb.castShadow = true;
    group.add(orb);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xe7c374, emissive: 0x8a5a13, emissiveIntensity: 1.2, metalness: 0.9, roughness: 0.25 });
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.045, 8, 36), ringMat);
    r1.rotation.x = 1.1;
    group.add(r1);
    const r2 = r1.clone();
    r2.rotation.set(0.3, 0.8, 0);
    r2.scale.setScalar(0.8);
    group.add(r2);
    const glow = makeSprite(glowTex(), 0xffd58a, 0.9);
    glow.scale.set(5, 5, 1);
    group.add(glow);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.75, 8, 16, 1, true), new THREE.MeshBasicMaterial({
      color: 0xffd58a, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    beam.position.y = 3.5;
    group.add(beam);
    const light = new THREE.PointLight(0xffc45e, 0, 18, 1.7);
    light.position.y = 0.4;
    group.add(light);
    this.sunstone = {
      group, orb, rings: [r1, r2], glow, beam, light,
      revealed: false, revealT: 0,
      reveal: () => {
        if (this.sunstone.revealed) return;
        this.sunstone.revealed = true;
        group.visible = true;
        group.position.y = -0.4;
        this.sunstone.revealT = 0;
        this.audio.sigil();
        this.effects.burst({ x: 0, y: 2, z: -72 }, '#ffd58a', 60, { speed: 4, up: 4, lifeScale: 1.6 });
        this.effects.shockwave({ x: 0, y: 0, z: -72 }, { color: '#ffcf8a', maxRadius: 9, duration: 1.5 });
        this.emit({ type: 'sunstone-revealed' });
      },
    };
  }

  buildSky() {
    const starCount = 720;
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const a = rand(0, Math.PI * 2);
      const y = rand(12, 150);
      const r = Math.sqrt(Math.max(0, 170 * 170 - y * y));
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      map: glowTex(), color: 0xb8d4ff, size: 2.2, transparent: true,
      opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending,
      fog: false, sizeAttenuation: true,
    });
    const stars = new THREE.Points(geo, mat);
    this.scene.add(stars);
    const moonGlow = makeSprite(glowTex(), 0xaec8ff, 0.75);
    moonGlow.scale.set(42, 42, 1);
    moonGlow.position.set(-60, 78, -118);
    moonGlow.material.fog = false;
    this.scene.add(moonGlow);
    const moon = makeSprite(glowTex(), 0xf3f7ff, 1);
    moon.scale.set(9, 9, 1);
    moon.position.set(-60, 78, -118);
    moon.material.fog = false;
    this.scene.add(moon);
    this.sky = { stars, moon, moonGlow };
  }

  buildMinimap() {
    this.minimap.rooms = ROOMS;
    this.minimap.corridors = CORRIDORS;
    this.minimap.markers = {
      stone: { x: 44, z: 0, color: '#57e4d2' },
      flame: { x: 0, z: -34.6, color: '#ff9b52' },
      courage: { x: -35, z: 0, color: '#a9d8ff' },
      boss: { x: 0, z: -72, color: '#e36a55' },
    };
  }

  /* ========================================================== systems */

  markVisited(id) { this.visited.add(id); }

  roomAt(x, z) {
    for (const room of this.rooms) {
      if (x >= room.x - room.w / 2 && x <= room.x + room.w / 2 && z >= room.z - room.d / 2 && z <= room.z + room.d / 2) {
        return room;
      }
    }
    return null;
  }

  hallAt(x, z) {
    for (const h of CORRIDORS) {
      const minX = h.dir === 'x' ? Math.min(h.x1, h.x2) : h.x - h.width / 2;
      const maxX = h.dir === 'x' ? Math.max(h.x1, h.x2) : h.x + h.width / 2;
      const minZ = h.dir === 'z' ? Math.min(h.z1, h.z2) : h.z - h.width / 2;
      const maxZ = h.dir === 'z' ? Math.max(h.z1, h.z2) : h.z + h.width / 2;
      if (x >= minX - 0.6 && x <= maxX + 0.6 && z >= minZ - 0.6 && z <= maxZ + 0.6) return h;
    }
    return null;
  }

  setHubSigil(index, color) {
    const sock = this.fountain?.sockets?.[index];
    if (!sock) return;
    sock.lit = true;
    sock.mesh.material.color.set(color);
    sock.mesh.material.emissive.set(color);
    sock.mesh.material.emissiveIntensity = 2.6;
    const p = new THREE.Vector3();
    sock.mesh.getWorldPosition(p);
    this.effects.burst(p, color, 18, { speed: 2, up: 2 });
  }

  isBoxFree(minX, maxX, minZ, maxZ, ignore = null) {
    for (const c of this.colliders) {
      if (!c.active || c === ignore) continue;
      if (c.maxY < 0.4 || c.minY > 1.8) continue;
      if (maxX <= c.minX || minX >= c.maxX || maxZ <= c.minZ || minZ >= c.maxZ) continue;
      return false;
    }
    return true;
  }

  resolveCircle(pos, radius) {
    let hit = false;
    for (let iter = 0; iter < 4; iter++) {
      let moved = false;
      for (const c of this.colliders) {
        if (!c.active) continue;
        if (c.minY > 1.7 || c.maxY < 0.25) continue;
        const cx = clamp(pos.x, c.minX, c.maxX);
        const cz = clamp(pos.z, c.minZ, c.maxZ);
        let dx = pos.x - cx;
        let dz = pos.z - cz;
        let d2 = dx * dx + dz * dz;
        if (d2 >= radius * radius) continue;
        moved = true;
        hit = true;
        if (d2 < 1e-8) {
          // deep inside — push out along the shortest axis
          const left = pos.x - c.minX, right = c.maxX - pos.x;
          const back = pos.z - c.minZ, front = c.maxZ - pos.z;
          const m = Math.min(left, right, back, front);
          if (m === left) pos.x = c.minX - radius;
          else if (m === right) pos.x = c.maxX + radius;
          else if (m === back) pos.z = c.minZ - radius;
          else pos.z = c.maxZ + radius;
        } else {
          const d = Math.sqrt(d2);
          const push = (radius - d) + 0.001;
          pos.x += (dx / d) * push;
          pos.z += (dz / d) * push;
        }
      }
      if (!moved) break;
    }
    return hit;
  }

  moveCircle(pos, dx, dz, radius) {
    pos.x += dx;
    pos.z += dz;
    this.resolveCircle(pos, radius);
  }

  raycastCamera(origin, dir, maxDist) {
    let best = maxDist;
    for (const c of this.colliders) {
      if (!c.active) continue;
      if (c.tag === 'barrier' || c.tag === 'boss-gate') continue;
      const t = rayBox(origin, dir, c.minX - 0.12, c.maxX + 0.12, c.minY - 0.1, c.maxY + 0.12, c.minZ - 0.12, c.maxZ + 0.12);
      if (t !== null && t > 0.25 && t < best) best = t;
    }
    return best;
  }

  update(dt, playerPos) {
    this.time += dt;
    const t = this.time;

    for (const f of this.flames) {
      if (!f.lit) {
        if (f.light) f.light.intensity = damp(f.light.intensity, 0, 8, dt);
        continue;
      }
      const flick = 0.82 + Math.sin(t * 11.3 + f.phase) * 0.09 + Math.sin(t * 23.7 + f.phase * 2.1) * 0.055 + rand(-0.02, 0.02);
      if (f.lightOn !== false) f.light.intensity = damp(f.light.intensity, f.baseIntensity * flick, 14, dt);
      const s = f.scale;
      f.core.scale.set(0.72 * s * (0.94 + flick * 0.08), 1.65 * s * (0.9 + flick * 0.14), 1);
      f.outer.scale.set(1.35 * s * (0.92 + flick * 0.1), 2.5 * s * (0.9 + flick * 0.12), 1);
      f.outer.material.rotation = Math.sin(t * 1.4 + f.phase) * 0.12;
      if (f.gem) {
        f.gem.rotation.y += dt * 1.4;
        f.gem.position.y = 1.08 + Math.sin(t * 1.6 + f.phase) * 0.03;
      }
      f.emberTimer -= dt;
      if (f.emberTimer <= 0) {
        f.emberTimer = rand(0.12, 0.34);
        const p = new THREE.Vector3();
        f.group.getWorldPosition(p);
        p.y += 0.25 * f.scale;
        this.effects.ember(p, f.baseColor ?? 0xff9b4a);
      }
    }

    for (const g of this.gates) g.update(dt);
    if (this.bossGate) this.bossGate.update(dt);
    if (this.barrier) this.barrier.update(dt, t);
    if (this.stone) this.stone.update(dt);

    this.waterMat.map.offset.x += dt * 0.012;
    this.waterMat.map.offset.y += dt * 0.006;

    if (this.fountain) {
      const orb = this.fountain.orb;
      orb.position.y = 2.75 + Math.sin(t * 1.3) * 0.12;
      orb.rotation.y += dt * 0.5;
      this.fountain.rings[0].rotation.z += dt * 0.32;
      this.fountain.rings[1].rotation.x += dt * 0.24;
      for (let i = 0; i < this.fountain.sockets.length; i++) {
        const s = this.fountain.sockets[i];
        s.mesh.rotation.y += dt * (s.lit ? 1.2 : 0.25);
        s.mesh.position.y = 2.45 + Math.sin(t * 1.4 + i * 2.1) * 0.07;
      }
    }

    for (const p of this.pedestals) {
      if (!p.active) continue;
      p.gem.rotation.y += dt * 0.9;
      p.gem.position.y = 2.55 + Math.sin(t * 1.5 + p.x) * 0.08;
      p.ring.rotation.z += dt * 0.3;
      p.sprite.material.opacity = 0.62 + Math.sin(t * 2.2) * 0.12;
      if (p.popT > 0) {
        p.popT = Math.max(0, p.popT - dt * 1.4);
        const s = 1 + Math.sin(p.popT * Math.PI) * 1.2;
        p.sprite.scale.set(2.6 * s, 2.6 * s, 1);
      }
    }

    for (const b of this.banners) {
      b.mesh.rotation.z = Math.sin(t * 0.65 + b.phase) * 0.022;
      b.mesh.rotation.x = Math.sin(t * 0.5 + b.phase) * 0.012;
    }

    if (this.sunstone) {
      const s = this.sunstone;
      if (s.revealed) {
        s.revealT = Math.min(4, s.revealT + dt);
        const e = easeOutCubic(Math.min(1, s.revealT / 2.2));
        s.group.position.y = lerp(-0.4, 1.4, e);
        s.orb.rotation.y += dt * 1.1;
        s.orb.rotation.x += dt * 0.4;
        s.rings[0].rotation.z += dt * 0.8;
        s.rings[1].rotation.x -= dt * 0.6;
        s.glow.material.opacity = 0.7 + Math.sin(t * 3) * 0.18;
        s.beam.material.opacity = 0.08 + Math.sin(t * 2.4) * 0.03;
        s.light.intensity = damp(s.light.intensity, 9.5, 3, dt);
      }
    }

    this.runeMat.emissiveIntensity = 1.75 + Math.sin(t * 1.8) * 0.25;
  }
}

function rayBox(origin, dir, minX, maxX, minY, maxY, minZ, maxZ) {
  let tmin = -Infinity;
  let tmax = Infinity;
  for (const [o, d, lo, hi] of [
    [origin.x, dir.x, minX, maxX],
    [origin.y, dir.y, minY, maxY],
    [origin.z, dir.z, minZ, maxZ],
  ]) {
    if (Math.abs(d) < 1e-8) {
      if (o < lo || o > hi) return null;
    } else {
      let t1 = (lo - o) / d;
      let t2 = (hi - o) / d;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
  }
  if (tmax < 0) return null;
  return tmin >= 0 ? tmin : tmax;
}
