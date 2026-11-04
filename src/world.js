import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createGoomba } from './character.js';

// ----------------------------- Materials ----------------------------------

const M = {
  grass: new THREE.MeshStandardMaterial({ color: 0x74d96b, roughness: 0.92, flatShading: false }),
  grassDark: new THREE.MeshStandardMaterial({ color: 0x4fbf5e, roughness: 0.95 }),
  dirt: new THREE.MeshStandardMaterial({ color: 0xa86f45, roughness: 1 }),
  dirtDark: new THREE.MeshStandardMaterial({ color: 0x875534, roughness: 1 }),
  rock: new THREE.MeshStandardMaterial({ color: 0x8b9db0, roughness: 0.95, flatShading: true }),
  rockDark: new THREE.MeshStandardMaterial({ color: 0x6b7f97, roughness: 1, flatShading: true }),
  stone: new THREE.MeshStandardMaterial({ color: 0xb9c6d5, roughness: 0.92, flatShading: true }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x8d9fb4, roughness: 0.95, flatShading: true }),
  moss: new THREE.MeshStandardMaterial({ color: 0x6ccb69, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8b5a33, roughness: 1 }),
  woodDark: new THREE.MeshStandardMaterial({ color: 0x633e22, roughness: 1 }),
  cloud: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }),
  cloudShade: new THREE.MeshStandardMaterial({ color: 0xe4f4ff, roughness: 1, flatShading: true }),
  gold: new THREE.MeshStandardMaterial({ color: 0xffc93c, roughness: 0.28, metalness: 0.65, emissive: 0x7a4b00, emissiveIntensity: 0.24 }),
  goldDark: new THREE.MeshStandardMaterial({ color: 0xd8890d, roughness: 0.4, metalness: 0.5 }),
  red: new THREE.MeshStandardMaterial({ color: 0xe8414a, roughness: 0.6 }),
  redDark: new THREE.MeshStandardMaterial({ color: 0xa9212f, roughness: 0.7 }),
  white: new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.8 }),
  leaf: new THREE.MeshStandardMaterial({ color: 0x57bf5f, roughness: 1, flatShading: true }),
  leafLight: new THREE.MeshStandardMaterial({ color: 0x77dd74, roughness: 1, flatShading: true }),
  leafDark: new THREE.MeshStandardMaterial({ color: 0x359b4e, roughness: 1, flatShading: true }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x8a5731, roughness: 1 }),
  flagGreen: new THREE.MeshStandardMaterial({ color: 0x54d96d, roughness: 0.8, side: THREE.DoubleSide, emissive: 0x0c5a24, emissiveIntensity: 0.2 }),
  flagGray: new THREE.MeshStandardMaterial({ color: 0xcfdbe8, roughness: 0.85, side: THREE.DoubleSide }),
  flagGold: new THREE.MeshStandardMaterial({ color: 0xffc42e, roughness: 0.55, side: THREE.DoubleSide, emissive: 0x6b3f00, emissiveIntensity: 0.3 }),
  flowerPink: new THREE.MeshStandardMaterial({ color: 0xff87b7, roughness: 0.8 }),
  flowerYellow: new THREE.MeshStandardMaterial({ color: 0xffe05a, roughness: 0.8 }),
  flowerWhite: new THREE.MeshStandardMaterial({ color: 0xfff6e7, roughness: 0.8 }),
  stem: new THREE.MeshStandardMaterial({ color: 0x3e9d49, roughness: 1 }),
};

// Shared vertex-colored materials for merged scenery (fewer draw calls).
const VERTEX_MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
const CLOUD_VERTEX_MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });

// Merge parts ({geo, color, position, rotation, scale}) into one colored mesh.
function mergedColoredMesh(parts, material = VERTEX_MAT, { castShadow = true } = {}) {
  const geos = [];
  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  for (const part of parts) {
    let g = part.geo.clone();
    if (g.index) {
      const nonIndexed = g.toNonIndexed();
      g.dispose();
      g = nonIndexed;
    }
    const euler = new THREE.Euler(
      part.rotation?.[0] || 0,
      part.rotation?.[1] || 0,
      part.rotation?.[2] || 0,
    );
    quat.setFromEuler(euler);
    matrix.compose(
      new THREE.Vector3(...(part.position || [0, 0, 0])),
      quat,
      new THREE.Vector3(...(part.scale || [1, 1, 1])),
    );
    g.applyMatrix4(matrix);
    const color = new THREE.Color(part.color ?? 0xffffff);
    const count = g.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geos.push(g);
  }
  const merged = mergeGeometries(geos, false);
  geos.forEach((g) => g.dispose());
  const m = new THREE.Mesh(merged, material);
  m.castShadow = castShadow;
  m.receiveShadow = true;
  return m;
}

// ------------------------------ Textures ----------------------------------

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

let questionTexture = null;
function getQuestionTexture() {
  if (questionTexture) return questionTexture;
  questionTexture = canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#ffe26b');
    g.addColorStop(0.55, '#ffc42c');
    g.addColorStop(1, '#ec9311');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#8a4d05';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.fillStyle = '#7a4300';
    ctx.font = '900 84px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', w / 2, h / 2 + 5);
    // rivets
    for (const [x, y] of [[16, 16], [w - 16, 16], [16, h - 16], [w - 16, h - 16]]) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff3b0';
      ctx.fill();
      ctx.strokeStyle = '#8a4d05';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  return questionTexture;
}

let signTexture = null;
function getSignTexture() {
  if (signTexture) return signTexture;
  signTexture = canvasTexture(256, 160, (ctx, w, h) => {
    ctx.fillStyle = '#9b6435';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#6b4120';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, w - 10, h - 10);
    ctx.fillStyle = '#f8e6bd';
    ctx.font = '900 34px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLOUDTOP', w / 2, 62);
    ctx.font = '900 26px "Arial Black", sans-serif';
    ctx.fillStyle = '#ffd75a';
    ctx.fillText('CASCADE', w / 2, 98);
    ctx.fillStyle = '#fff6da';
    ctx.font = '900 30px sans-serif';
    ctx.fillText('↑', w / 2, 138);
  });
  return signTexture;
}

let glowTexture = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  glowTexture = canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,240,150,0.95)');
    g.addColorStop(0.35, 'rgba(255,200,60,0.5)');
    g.addColorStop(1, 'rgba(255,180,30,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  return glowTexture;
}

// ------------------------------- Helpers ----------------------------------

function addBox(scene, x, y, z, w, h, d, material, { shadow = true, radius = 0.12 } = {}) {
  const geo = radius > 0 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function cloudGeometry(seed = 1, puffCount = 5, spread = 3) {
  const geos = [];
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < puffCount; i++) {
    const r = 1 + rnd() * 1.2;
    const geo = new THREE.IcosahedronGeometry(r, 1);
    geo.translate((rnd() - 0.5) * spread, (rnd() - 0.5) * 0.9, (rnd() - 0.5) * spread * 0.55);
    geos.push(geo);
  }
  const merged = mergeGeometries(geos, false);
  geos.forEach((g) => g.dispose());
  return merged;
}

function makeTree(scene, world, x, y, z, scale = 1, variant = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.25, 1.5, 7), M.trunk);
  trunk.position.y = 0.75;
  trunk.castShadow = true;
  g.add(trunk);

  const leafMat = variant % 2 === 0 ? M.leaf : M.leafLight;
  const blobs = [
    [0, 1.9, 0, 1.1],
    [-0.55, 1.65, 0.1, 0.75],
    [0.5, 1.7, -0.1, 0.72],
    [0.05, 2.5, 0.02, 0.68],
  ];
  const leafGeos = [];
  for (const [bx, by, bz, r] of blobs) {
    const geo = new THREE.IcosahedronGeometry(r, 1);
    geo.translate(bx, by, bz);
    leafGeos.push(geo);
  }
  const leaves = new THREE.Mesh(mergeGeometries(leafGeos, false), leafMat);
  leaves.castShadow = true;
  leafGeos.forEach((g) => g.dispose());
  g.add(leaves);
  scene.add(g);
  world.decorations.push(g);
  return g;
}

function makeFlower(scene, world, x, y, z, colorMat) {
  const petalColor = colorMat.color.getHex();
  const parts = [
    { geo: new THREE.CylinderGeometry(0.025, 0.035, 0.34, 4), color: 0x3e9d49, position: [0, 0.17, 0] },
    { geo: new THREE.SphereGeometry(0.07, 8, 6), color: 0xffe05a, position: [0, 0.36, 0] },
  ];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    parts.push({
      geo: new THREE.SphereGeometry(0.075, 7, 5),
      color: petalColor,
      position: [Math.cos(a) * 0.1, 0.37, Math.sin(a) * 0.1],
      scale: [1, 0.55, 0.7],
    });
  }
  const flower = mergedColoredMesh(parts, VERTEX_MAT, { castShadow: false });
  flower.position.set(x, y, z);
  flower.rotation.z = Math.random() * 0.25 - 0.12;
  scene.add(flower);
  world.decorations.push(flower);
}

function makeRock(scene, world, x, y, z, scale = 1) {
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 * scale, 0), M.rockDark);
  rock.position.set(x, y + 0.28 * scale, z);
  rock.rotation.set(Math.random(), Math.random() * 3, Math.random() * 0.4);
  rock.castShadow = true;
  rock.receiveShadow = true;
  scene.add(rock);
  world.decorations.push(rock);
}

function makeSign(scene, world, x, y, z, rotation = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotation;
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 1.5, 6), M.woodDark);
    post.position.set(side * 0.58, 0.75, 0);
    post.castShadow = true;
    g.add(post);
  }
  const boardMat = new THREE.MeshStandardMaterial({ map: getSignTexture(), roughness: 0.9 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.94, 0.12), [
    M.wood, M.wood, M.wood, M.wood, boardMat, boardMat,
  ]);
  board.position.set(0, 1.58, 0);
  board.castShadow = true;
  g.add(board);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.1, 0.2), M.woodDark);
  cap.position.set(0, 2.12, 0);
  g.add(cap);
  scene.add(g);
  world.decorations.push(g);
  return g;
}

function makeFlag(scene, world, x, y, z, { goal = false } = {}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 0.24, 12), M.stone);
  base.position.y = 0.12;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, goal ? 6.6 : 3.4, 10), M.white);
  pole.position.y = goal ? 3.4 : 1.85;
  pole.castShadow = true;
  g.add(pole);

  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), M.gold);
  cap.position.y = goal ? 6.75 : 3.58;
  cap.castShadow = true;
  g.add(cap);

  // Waving cloth built as a segmented plane.
  const clothW = goal ? 2.4 : 1.35;
  const clothH = goal ? 1.5 : 0.85;
  const geo = new THREE.PlaneGeometry(clothW, clothH, 10, 5);
  geo.translate(clothW / 2, 0, 0);
  const mat = (goal ? M.flagGold : M.flagGray).clone();
  const cloth = new THREE.Mesh(geo, mat);
  cloth.position.set(0.06, goal ? 5.9 : 3.1, 0);
  cloth.castShadow = true;
  g.add(cloth);

  // A star emblem gives the flags a readable silhouette from any angle.
  const emblem = makeStarMesh(goal ? 0.36 : 0.26, goal ? 0x8a4e00 : 0x7a5d00, goal ? M.white : M.gold);
  emblem.position.set(goal ? 1.14 : 0.62, goal ? 5.9 : 3.1, 0.14);
  g.add(emblem);

  if (goal) {
    // gold star topper
    const star = makeStarMesh(0.55, 0x1a2a45);
    star.position.set(0, 7.05, 0);
    star.rotation.y = Math.PI / 2;
    g.add(star);
  }

  scene.add(g);
  world.decorations.push(g);

  return {
    group: g,
    cloth,
    clothGeo: geo,
    baseGeometry: geo,
    material: mat,
    active: goal,
    goal,
    height: goal ? 6.6 : 3.4,
    position: { x, y, z },
    activate() {
      this.active = true;
      cloth.material.color.set(goal ? 0xffc42e : 0x54d96d);
      cloth.material.emissive.set(goal ? 0x6b3f00 : 0x0c5a24);
      cloth.material.emissiveIntensity = 0.25;
    },
    deactivate() {
      if (goal) return;
      this.active = false;
      cloth.material.color.set(0xcfdbe8);
      cloth.material.emissive.set(0x000000);
      cloth.material.emissiveIntensity = 0;
    },
    update(t) {
      const pos = cloth.geometry.attributes.position;
      const amp = this.active ? 0.16 : 0.07;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        const k = px / clothW;
        pos.setZ(i, Math.sin(t * 4.2 + k * 5.5 + py) * amp * k);
      }
      pos.needsUpdate = true;
      cloth.geometry.computeVertexNormals();
    },
  };
}

function makeStarMesh(radius = 0.8, edge = 0x8a4e00, material = M.gold) {
  const shape = new THREE.Shape();
  const spikes = 5;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.46;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: radius * 0.32, bevelEnabled: true, bevelSize: radius * 0.06, bevelThickness: radius * 0.06, bevelSegments: 2, curveSegments: 4 });
  geo.center();
  const star = new THREE.Mesh(geo, material);
  star.castShadow = true;
  star.scale.z = 0.9;
  return star;
}

// ------------------------------- Sky --------------------------------------

function buildSky(scene) {
  const skyGeo = new THREE.SphereGeometry(420, 32, 18);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x2f9df5) },
      midColor: { value: new THREE.Color(0x7fd0ff) },
      bottomColor: { value: new THREE.Color(0xdff4ff) },
      sunDir: { value: new THREE.Vector3(0.5, 0.45, -0.7).normalize() },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPosition = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform vec3 sunDir;
      varying vec3 vWorldPosition;
      void main() {
        vec3 dir = normalize(vWorldPosition);
        float h = clamp(dir.y, -1.0, 1.0);
        vec3 col = mix(bottomColor, midColor, smoothstep(-0.02, 0.3, h));
        col = mix(col, topColor, smoothstep(0.22, 0.95, h));
        float sun = pow(max(dot(dir, sunDir), 0.0), 90.0);
        float halo = pow(max(dot(dir, sunDir), 0.0), 8.0);
        col += vec3(1.0, 0.92, 0.68) * sun * 0.9;
        col += vec3(1.0, 0.86, 0.55) * halo * 0.16;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  scene.add(sky);
  return sky;
}

function buildLighting(scene) {
  const hemi = new THREE.HemisphereLight(0xcdeeff, 0x6e9a55, 1.45);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x9fc4e8, 0.32);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff2d0, 2.6);
  sun.position.set(28, 52, 24);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 150;
  sun.shadow.camera.left = -34;
  sun.shadow.camera.right = 34;
  sun.shadow.camera.top = 34;
  sun.shadow.camera.bottom = -34;
  sun.shadow.bias = -0.0009;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  scene.add(sun.target);

  // Cool rim light from the opposite side.
  const rim = new THREE.DirectionalLight(0x9fd0ff, 0.65);
  rim.position.set(-30, 20, -35);
  scene.add(rim);

  return { sun, hemi, ambient, rim };
}

// --------------------------- Level building --------------------------------

export function createWorld(scene) {
  const world = {
    solids: [],
    coins: [],
    coinTotal: 0,
    enemies: [],
    boss: null,
    stars: [],
    starTotal: 3,
    springs: [],
    checkpoints: [],
    movingPlatforms: [],
    questionBlocks: [],
    decorations: [],
    goal: null,
    spawn: { x: 0, y: 0, z: 3.5 },
    clouds: [],
    sun: null,
    bounds: { minZ: -125, maxZ: 12 },
  };

  buildSky(scene);
  const lights = buildLighting(scene);
  world.sun = lights.sun;
  world.lights = lights;

  scene.fog = new THREE.Fog(0xa9dcff, 62, 175);

  // ---------- Platform factory ----------
  const platform = ({
    x, z, top, w, d, style = 'grass', depth = 2.4, rock = true, collider = true, decor = true,
  }) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);

    const topMat = style === 'grass' ? M.grass : style === 'stone' ? M.stone : M.grassDark;
    const bodyMat = style === 'grass' ? M.dirt : M.stoneDark;
    const edgeMat = style === 'grass' ? M.grassDark : M.stone;

    const grass = new THREE.Mesh(new RoundedBoxGeometry(w, 0.62, d, 3, Math.min(0.26, w * 0.08)), topMat);
    grass.position.y = top - 0.31;
    grass.castShadow = true;
    grass.receiveShadow = true;
    g.add(grass);

    const edge = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, 0.18, d + 0.1, 2, 0.16), edgeMat);
    edge.position.y = top - 0.64;
    edge.castShadow = true;
    edge.receiveShadow = true;
    g.add(edge);

    const body = new THREE.Mesh(new RoundedBoxGeometry(Math.max(0.8, w - 0.55), depth, Math.max(0.8, d - 0.55), 2, 0.3), bodyMat);
    body.position.y = top - 0.7 - depth / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);

    const smallParts = [];
    if (rock) {
      const spireGeo = new THREE.CylinderGeometry(Math.min(w, d) * 0.38, Math.min(w, d) * 0.06, 6.4, 7, 2);
      const spire = new THREE.Mesh(spireGeo, M.rock);
      spire.position.y = top - 0.7 - depth - 3.2;
      spire.rotation.y = Math.random() * 3;
      spire.castShadow = false;
      spire.receiveShadow = true;
      g.add(spire);
      // little hanging rock chunks (merged later)
      for (let i = 0; i < 2; i++) {
        smallParts.push({
          geo: new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5, 0),
          color: 0x6b7f97,
          position: [
            (Math.random() - 0.5) * w * 0.5,
            top - depth - 2 - Math.random() * 2.5,
            (Math.random() - 0.5) * d * 0.5,
          ],
          rotation: [Math.random() * 3, Math.random() * 3, 0],
        });
      }
    }

    // Mossy trim drips on the sides (merged into one mesh per platform)
    if (style === 'grass') {
      for (let i = 0; i < Math.min(10, Math.floor(w + d)); i++) {
        const onX = Math.random() > 0.5;
        const side = Math.random() > 0.5 ? 1 : -1;
        smallParts.push({
          geo: new THREE.ConeGeometry(0.22, 0.65, 5),
          color: i % 2 ? 0x4fbf5e : 0x74d96b,
          position: [
            onX ? (Math.random() - 0.5) * (w - 1) : side * (w / 2 + 0.02),
            top - 0.55,
            onX ? side * (d / 2 + 0.02) : (Math.random() - 0.5) * (d - 1),
          ],
          rotation: [Math.PI, 0, 0],
          scale: [0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.6],
        });
      }
    }
    if (smallParts.length) {
      const trims = mergedColoredMesh(smallParts, VERTEX_MAT, { castShadow: false });
      g.add(trims);
    }

    scene.add(g);
    world.decorations.push(g);

    if (collider) {
      world.solids.push({
        min: { x: x - w / 2, y: top - 3.4, z: z - d / 2 },
        max: { x: x + w / 2, y: top, z: z + d / 2 },
        type: 'ground',
        object: g,
      });
    }

    if (decor) {
      world.platformSpots = world.platformSpots || [];
      world.platformSpots.push({ x, z, top, w, d });
    }
    return g;
  };

  world.addPlatform = platform;

  // ---------- Coin factory ----------
  const coinInnerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.055, 16);
  coinInnerGeo.rotateX(Math.PI / 2);
  const coinGeo = mergeGeometries([new THREE.TorusGeometry(0.34, 0.105, 8, 18), coinInnerGeo], false);
  const coinSparkGeo = new THREE.OctahedronGeometry(0.06);

  const addCoin = (x, y, z) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const coinMesh = new THREE.Mesh(coinGeo, M.gold);
    coinMesh.castShadow = false;
    group.add(coinMesh);

    scene.add(group);
    world.coins.push({ group, x, y, z, baseY: y, phase: Math.random() * Math.PI * 2, collected: false });
    world.coinTotal++;
    return group;
  };
  world.addCoin = addCoin;

  const coinArc = (ax, ay, az, bx, by, bz, count, height = 1.4, dx = 0) => {
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const x = ax + (bx - ax) * t + Math.sin(t * Math.PI) * dx;
      const y = ay + (by - ay) * t + Math.sin(t * Math.PI) * height;
      const z = az + (bz - az) * t;
      addCoin(x, y, z);
    }
  };
  const coinRing = (cx, cy, cz, radius, count) => {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      addCoin(cx + Math.cos(a) * radius, cy, cz + Math.sin(a) * radius);
    }
  };
  world.coinArc = coinArc;
  world.coinRing = coinRing;

  // ---------- Question block ----------
  const addQuestionBlock = (x, y, z) => {
    const size = 1.35;
    const sideMat = M.gold.clone();
    sideMat.emissive = new THREE.Color(0x6f3d00);
    sideMat.emissiveIntensity = 0.25;
    const faceMat = new THREE.MeshStandardMaterial({ map: getQuestionTexture(), roughness: 0.45, emissive: 0x6b3e00, emissiveIntensity: 0.2 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), [sideMat, sideMat, sideMat, sideMat, faceMat, faceMat]);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const block = {
      mesh,
      x, y, z,
      size,
      used: false,
      bump: 0,
      baseY: y,
      box: { min: { x: x - size / 2, y: y - size / 2, z: z - size / 2 }, max: { x: x + size / 2, y: y + size / 2, z: z + size / 2 }, type: 'question', object: mesh, block: null },
    };
    block.box.block = block;
    world.solids.push(block.box);
    world.questionBlocks.push(block);
    return block;
  };
  world.addQuestionBlock = addQuestionBlock;

  // ---------- Spring ----------
  const addSpring = (x, y, z, power = 22) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.24, 14), M.stoneDark);
    base.position.y = 0.12;
    base.castShadow = true;
    base.receiveShadow = true;
    g.add(base);

    const coil = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.09, 6, 14), M.goldDark);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.3 + i * 0.2;
      coil.add(ring);
    }
    g.add(coil);

    const pad = new THREE.Group();
    const padBase = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.78, 0.2, 14), M.red);
    padBase.position.y = 0.95;
    padBase.castShadow = true;
    pad.add(padBase);
    const padTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.8, 0.12, 14), M.white);
    padTop.position.y = 1.08;
    pad.add(padTop);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.42, 4), M.gold);
    arrow.position.y = 1.34;
    arrow.rotation.y = Math.PI / 4;
    pad.add(arrow);
    g.add(pad);

    scene.add(g);
    world.springs.push({ group: g, coil, pad, x, y, z, power, anim: 0 });
    world.decorations.push(g);
    world.solids.push({
      min: { x: x - 0.9, y, z: z - 0.9 },
      max: { x: x + 0.9, y: y + 0.4, z: z + 0.9 },
      type: 'spring',
      power,
      object: g,
    });
    return g;
  };
  world.addSpring = addSpring;

  // ---------- Moving platform ----------
  const addMovingPlatform = (x, y, z, { axis = 'x', range = 3, speed = 0.9, phase = 0, w = 4, d = 4 } = {}) => {
    const g = new THREE.Group();
    g.position.set(x, y - 0.45, z);

    const slab = new THREE.Mesh(new RoundedBoxGeometry(w, 0.8, d, 3, 0.2), M.stone);
    slab.castShadow = true;
    slab.receiveShadow = true;
    g.add(slab);

    const moss = new THREE.Mesh(new RoundedBoxGeometry(w - 0.3, 0.18, d - 0.3, 2, 0.14), M.moss);
    moss.position.y = 0.4;
    moss.receiveShadow = true;
    g.add(moss);

    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), M.gold);
        stud.position.set(sx * (w / 2 - 0.25), 0.46, sz * (d / 2 - 0.25));
        stud.castShadow = true;
        g.add(stud);
      }
    }

    // Cloud puffs underneath
    const puffs = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), M.cloud);
      puff.position.set((Math.random() - 0.5) * w * 0.7, -0.7 - Math.random() * 0.3, (Math.random() - 0.5) * d * 0.7);
      puffs.add(puff);
    }
    g.add(puffs);
    scene.add(g);

    const collider = {
      min: { x: x - w / 2, y: y - 0.9, z: z - d / 2 },
      max: { x: x + w / 2, y, z: z + d / 2 },
      type: 'moving',
      object: g,
    };
    world.solids.push(collider);
    const plat = {
      group: g, collider, base: { x, y, z }, axis, range, speed, phase, w, d,
      delta: { x: 0, y: 0, z: 0 }, prev: { x, y, z }, colliderTop: y,
    };
    world.movingPlatforms.push(plat);
    return plat;
  };
  world.addMovingPlatform = addMovingPlatform;

  // ---------- Enemy ----------
  const addEnemy = (x, y, z, { axis = 'x', range = 3, speed = 1.5, scale = 1, boss = false } = {}) => {
    const model = createGoomba({ scale, boss });
    model.root.position.set(x, y, z);
    scene.add(model.root);
    const enemy = {
      ...model,
      home: { x, y, z },
      x, y, z,
      axis, range, speed, dir: Math.random() > 0.5 ? 1 : -1,
      alive: true, squash: 0, hitFlash: 0, boss,
      hp: boss ? 3 : 1,
      maxHp: boss ? 3 : 1,
      radius: boss ? 1.05 : 0.55,
      height: boss ? 2.0 : 1.15,
      walkPhase: Math.random() * 10,
      awake: !boss,
      defeated: false,
      hitCooldown: 0,
    };
    if (boss) {
      enemy.crown = model.crown;
      world.boss = enemy;
    }
    world.enemies.push(enemy);
    return enemy;
  };
  world.addEnemy = addEnemy;

  // ---------- Star ----------
  const addStar = (x, y, z) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const star = makeStarMesh(0.72, 0x8a4e00);
    star.rotation.z = -0.12;
    g.add(star);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: getGlowTexture(), color: 0xffe889, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.setScalar(3.4);
    g.add(glow);

    // little orbiting sparks
    const sparks = [];
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), M.white);
      g.add(s);
      sparks.push(s);
    }

    scene.add(g);
    world.stars.push({ group: g, star, glow, sparks, x, y, z, baseY: y, phase: Math.random() * 6, collected: false });
  };
  world.addStar = addStar;

  // ---------------------------- Layout ------------------------------------

  // Start island
  platform({ x: 0, z: 0, top: 0, w: 15, d: 15, style: 'grass', depth: 2.6 });
  makeTree(scene, world, -5.4, 0, -3.8, 1.15, 0);
  makeTree(scene, world, 5.3, 0, -4.6, 0.95, 1);
  makeFlower(scene, world, -3.2, 0, 3.6, M.flowerPink);
  makeFlower(scene, world, -2.6, 0, 4.4, M.flowerYellow);
  makeFlower(scene, world, 4.2, 0, 2.2, M.flowerWhite);
  makeFlower(scene, world, 5.1, 0, 0.4, M.flowerPink);
  makeRock(scene, world, -6.2, 0, 1.5, 0.8);
  makeSign(scene, world, 3.6, 0, 4.9, -0.35);
  coinArc(0, 1.2, -3.5, 0, 1.6, -8.2, 4, 0.7);
  world.addStar(-6.1, 1.1, -5.2);

  // Stepping stones
  platform({ x: -2, z: -10.7, top: 0.85, w: 3.7, d: 3.5, style: 'stone', depth: 1.8, rock: true });
  makeRock(scene, world, -2.8, 0.85, -10.4, 0.4);
  coinArc(-1.2, 2.1, -11.5, 1.5, 2.9, -14.2, 3, 0.9);
  platform({ x: 1.6, z: -15.6, top: 1.75, w: 3.3, d: 3.3, style: 'stone', depth: 1.8 });
  platform({ x: 5.1, z: -20.7, top: 2.65, w: 3.5, d: 3.5, style: 'grass', depth: 2 });
  coinArc(1.6, 3.0, -15.6, 5.1, 3.9, -20.7, 3, 1.1);
  makeFlower(scene, world, 5.9, 2.65, -20.0, M.flowerYellow);

  // Island 2 — first goombas
  platform({ x: 1, z: -28.3, top: 3, w: 10.5, d: 10.5, style: 'grass', depth: 2.4 });
  makeTree(scene, world, 4.9, 3, -30.8, 0.9, 0);
  makeFlower(scene, world, -2.2, 3, -26.0, M.flowerWhite);
  makeRock(scene, world, -3.4, 3, -31.3, 0.7);
  addEnemy(1.5, 3, -27.5, { axis: 'x', range: 3.2, speed: 1.35 });
  addEnemy(3.2, 3, -31.2, { axis: 'z', range: 2.1, speed: 1.1 });
  addQuestionBlock(1, 6.4, -28.4);
  coinRing(1, 4.9, -28.4, 2.3, 6);
  coinArc(1, 4.4, -32.4, 1, 5.2, -35.4, 3, 0.6);

  // Moving platform A
  world.addMovingPlatform(1, 4.25, -36.5, { axis: 'x', range: 2.4, speed: 1.1, phase: 0, w: 4.2, d: 3.8 });

  // Island 3 — checkpoint
  platform({ x: 0, z: -44.5, top: 4, w: 11, d: 11, style: 'grass', depth: 2.6 });
  world.checkpoints.push(makeFlag(scene, world, -2.6, 4, -42.2));
  makeTree(scene, world, 4.1, 4, -46.8, 1.05, 1);
  makeFlower(scene, world, -4.1, 4, -47.5, M.flowerPink);
  makeFlower(scene, world, -3.5, 4, -46.7, M.flowerYellow);
  makeRock(scene, world, 3.2, 4, -40.6, 0.65);
  addEnemy(-1.5, 4, -44.8, { axis: 'z', range: 2.4, speed: 1.4 });
  addEnemy(3.3, 4, -43.2, { axis: 'x', range: 2.4, speed: 1.2 });
  coinRing(0, 5.6, -44.5, 2.6, 5);
  coinArc(0, 5.1, -50.2, 0, 5.4, -51.6, 3, 0.5);

  // Bridge to the sky
  platform({ x: 0, z: -53.2, top: 4.6, w: 3.7, d: 3.7, style: 'stone', depth: 1.7 });
  platform({ x: -3.6, z: -58.4, top: 5.0, w: 3.5, d: 3.5, style: 'grass', depth: 1.8 });
  platform({ x: -1.3, z: -63.5, top: 5.4, w: 3.7, d: 3.7, style: 'stone', depth: 1.7 });
  // Star perch
  platform({ x: -8.1, z: -58.4, top: 5.9, w: 3.2, d: 3.2, style: 'stone', depth: 1.6 });
  world.addStar(-8.1, 7.05, -58.4);
  coinArc(-3.6, 6.2, -58.4, -8.1, 7.1, -58.4, 3, 0.7);
  coinArc(0, 5.2, -53.2, -3.6, 5.6, -58.4, 3, 0.8);
  coinArc(-3.6, 5.6, -63.5, -1.3, 6.0, -63.5, 2, 0.3);
  makeFlower(scene, world, -8.9, 5.9, -57.8, M.flowerWhite);

  // Island 4 — spring
  platform({ x: 0, z: -71, top: 5.5, w: 11.5, d: 11.5, style: 'grass', depth: 2.5 });
  world.addSpring(0, 5.5, -71, 24.5);
  makeTree(scene, world, 4.4, 5.5, -74.5, 1, 0);
  makeFlower(scene, world, -3.3, 5.5, -73.4, M.flowerPink);
  makeRock(scene, world, -4.5, 5.5, -68.2, 0.8);
  addEnemy(-3.4, 5.5, -69.2, { axis: 'x', range: 2.6, speed: 1.3 });
  coinRing(0, 9.2, -71, 2.5, 8);
  coinArc(0, 14.2, -74.5, 0, 14.8, -77.6, 3, 1.4);

  // High island
  platform({ x: 0, z: -82.5, top: 12, w: 9.5, d: 9.5, style: 'grass', depth: 2.2 });
  world.checkpoints.push(makeFlag(scene, world, 2.8, 12, -79.6));
  makeTree(scene, world, -3.2, 12, -85.0, 0.85, 1);
  makeFlower(scene, world, 3.4, 12, -80.2, M.flowerYellow);
  makeFlower(scene, world, 3.9, 12, -81.2, M.flowerPink);
  addEnemy(2.0, 12, -84.0, { axis: 'x', range: 2.3, speed: 1.5 });
  world.addStar(2.7, 13.4, -85.2);
  coinRing(0, 13.4, -82.5, 2.7, 6);

  // Descending stones
  platform({ x: 6.4, z: -89.8, top: 10.0, w: 4.2, d: 4.2, style: 'stone', depth: 2.0 });
  platform({ x: 13.4, z: -95.1, top: 8.6, w: 4.0, d: 4.0, style: 'grass', depth: 2.0 });
  platform({ x: 19.1, z: -100.6, top: 7.8, w: 4.1, d: 4.1, style: 'stone', depth: 1.8 });
  coinArc(6.4, 11.2, -89.8, 13.4, 9.8, -95.1, 3, 1.2);
  coinArc(13.4, 9.8, -95.1, 19.1, 9.0, -100.6, 3, 1.0);
  makeFlower(scene, world, 19.8, 7.8, -100.0, M.flowerWhite);

  // Final island — boss + goal
  platform({ x: 19, z: -112, top: 7, w: 17, d: 17, style: 'grass', depth: 2.8 });
  world.checkpoints.push(makeFlag(scene, world, 16.4, 7, -105.0));
  makeTree(scene, world, 12.6, 7, -109.4, 1.15, 0);
  makeTree(scene, world, 25.4, 7, -109.2, 1.05, 1);
  makeRock(scene, world, 13.4, 7, -117.0, 0.85);
  makeRock(scene, world, 25.0, 7, -104.8, 0.7);
  makeFlower(scene, world, 23.7, 7, -106.8, M.flowerPink);
  makeFlower(scene, world, 14.7, 7, -106.4, M.flowerYellow);
  world.addEnemy(19, 7, -113.5, { boss: true, scale: 1.9, axis: 'x', range: 4.5, speed: 1.0 });
  world.addEnemy(15.5, 7, -108.5, { axis: 'z', range: 2.0, speed: 1.4 });
  coinRing(19, 8.4, -111.8, 4.2, 8);
  coinRing(19, 8.9, -111.8, 2.4, 5);

  world.goal = makeFlag(scene, world, 19, 7, -119.3, { goal: true });
  coinRing(19, 8.6, -118.6, 2.0, 4);

  // Victory arch + banners behind the goal
  const arch = new THREE.Group();
  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(1.4, 5.4, 1.4, 2, 0.2), M.stone);
    pillar.position.set(19 + side * 3.1, 7 + 2.7, -122.4);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    arch.add(pillar);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.3, 4), M.red);
    cap.position.set(19 + side * 3.1, 12.4, -122.4);
    cap.rotation.y = Math.PI / 4;
    cap.castShadow = true;
    arch.add(cap);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.4), M.red);
    banner.position.set(19 + side * 3.1, 10.2, -121.6);
    arch.add(banner);
  }
  const lintel = new THREE.Mesh(new RoundedBoxGeometry(6.4, 1.1, 1.3, 2, 0.2), M.stone);
  lintel.position.set(19, 12.9, -122.4);
  lintel.castShadow = true;
  arch.add(lintel);
  const archStar = makeStarMesh(0.62, 0x8a4e00);
  archStar.position.set(19, 12.9, -121.65);
  archStar.rotation.y = 0;
  arch.add(archStar);
  scene.add(arch);
  world.decorations.push(arch);
  world.arch = arch;

  // ---------- Distant scenery ----------
  const islandSpots = [
    [-42, 16, -30, 12, 9, 1.3],
    [39, 22, -48, 10, 8, 1.1],
    [-38, 8, -80, 14, 10, 1.4],
    [46, 13, -95, 9, 9, 1.0],
    [-30, 26, -124, 11, 8, 1.2],
    [4, 30, -150, 16, 11, 1.5],
    [72, 24, -140, 14, 10, 1.3],
  ];
  const distantParts = [];
  for (const [x, y, z, w, d, s] of islandSpots) {
    distantParts.push({
      geo: new RoundedBoxGeometry(w * s, 1.3 * s, d * s, 2, 0.5),
      color: 0x74d96b,
      position: [x, y, z],
    });
    distantParts.push({
      geo: new THREE.CylinderGeometry(w * s * 0.48, 1.2 * s, 8 * s, 6, 1),
      color: 0x8b9db0,
      position: [x, y - 4.6 * s, z],
    });
    for (let i = 0; i < 3; i++) {
      distantParts.push({
        geo: new THREE.ConeGeometry(1.6 * s, 3.6 * s, 6),
        color: i % 2 ? 0x77dd74 : 0x57bf5f,
        position: [x + (Math.random() - 0.5) * w * 0.7, y + 2.8 * s, z + (Math.random() - 0.5) * d * 0.7],
      });
    }
  }
  const distant = mergedColoredMesh(distantParts, VERTEX_MAT, { castShadow: false });
  distant.receiveShadow = false;
  scene.add(distant);
  world.decorations.push(distant);

  // Cloud sea + drifting clouds
  const cloudGroup = new THREE.Group();
  const cloudParts = [];
  const cloudSpots = [];
  for (let i = 0; i < 34; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 24 + Math.random() * 85;
    const x = Math.cos(angle) * radius;
    const z = -58 + Math.sin(angle) * radius * 1.1;
    const y = -22 + Math.random() * 10;
    cloudSpots.push([x, y, z, 4 + Math.random() * 5]);
  }
  // Dense cloud sea beneath the course
  for (let i = 0; i < 22; i++) {
    cloudSpots.push([(Math.random() - 0.5) * 110, -20 + Math.random() * 5, -60 + (Math.random() - 0.5) * 150, 6 + Math.random() * 5]);
  }
  // Airy clouds around the course
  for (let i = 0; i < 20; i++) {
    cloudSpots.push([(Math.random() - 0.5) * 150, 6 + Math.random() * 30, -60 + (Math.random() - 0.5) * 160, 2.5 + Math.random() * 4]);
  }
  cloudSpots.forEach(([x, y, z, s], i) => {
    const geo = cloudGeometry(i + 7, i < 56 ? 4 : 6, 4.6);
    cloudParts.push({
      geo,
      color: i % 3 === 0 ? 0xe4f4ff : 0xffffff,
      position: [x, y, z],
      rotation: [0, Math.random() * Math.PI, 0],
      scale: [s * 0.6, s * 0.6, s * 0.6],
    });
    geo.dispose();
  });
  const allClouds = mergedColoredMesh(cloudParts, CLOUD_VERTEX_MAT, { castShadow: false });
  allClouds.receiveShadow = false;
  allClouds.frustumCulled = false;
  cloudGroup.add(allClouds);
  scene.add(cloudGroup);
  world.cloudGroup = cloudGroup;
  world.cloudSpots = cloudSpots;

  // Extra grass tufts on start island for framing
  const framingParts = [];
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 3 + Math.random() * 3.6;
    framingParts.push({
      geo: new THREE.ConeGeometry(0.12, 0.42, 4),
      color: i % 2 ? 0x4fbf5e : 0x74d96b,
      position: [Math.cos(a) * r * 0.9, 0.2, Math.sin(a) * r],
    });
  }
  const framingTufts = mergedColoredMesh(framingParts, VERTEX_MAT, { castShadow: false });
  scene.add(framingTufts);
  world.decorations.push(framingTufts);

  world.update = (dt, time, playerPos, cameraPos) => {
    // Coins bob/spin. Hide any coin the camera is about to clip through so a
    // single pick-up can never fill the screen.
    for (const coin of world.coins) {
      if (coin.collected) continue;
      coin.group.rotation.y += dt * 2.6;
      coin.group.position.y = coin.baseY + Math.sin(time * 2.2 + coin.phase) * 0.12;
      if (cameraPos) {
        coin.group.visible = coin.group.position.distanceToSquared(cameraPos) > 20.25;
      }
    }
    // Stars
    for (const star of world.stars) {
      if (star.collected) continue;
      star.group.rotation.y += dt * 1.4;
      star.group.position.y = star.baseY + Math.sin(time * 1.8 + star.phase) * 0.22;
      star.star.rotation.z = Math.sin(time * 1.2 + star.phase) * 0.12;
      star.glow.material.opacity = 0.65 + Math.sin(time * 3 + star.phase) * 0.15;
      star.sparks.forEach((s, i) => {
        const a = time * 1.8 + (i / 3) * Math.PI * 2;
        s.position.set(Math.cos(a) * 1.05, Math.sin(a * 1.7) * 0.4, Math.sin(a) * 1.05);
      });
    }
    // Flags
    for (const cp of world.checkpoints) cp.update(time);
    world.goal.update(time);
    // Question blocks bump
    for (const block of world.questionBlocks) {
      if (block.bump > 0) {
        block.bump = Math.max(0, block.bump - dt * 4);
        block.mesh.position.y = block.baseY + Math.sin((1 - block.bump) * Math.PI) * 0.35;
      }
      // The camera often sits right next to a floating block; don't let its
      // near face swallow the view.
      if (cameraPos) block.mesh.visible = block.mesh.position.distanceToSquared(cameraPos) > 10.9;
    }
    // Springs
    for (const spring of world.springs) {
      if (spring.anim > 0) {
        spring.anim = Math.max(0, spring.anim - dt * 3.2);
        const k = Math.sin(spring.anim * Math.PI * 2) * spring.anim;
        spring.coil.scale.y = 1 - k * 0.45;
        spring.pad.position.y = -k * 0.35;
      } else {
        spring.coil.scale.y += (1 - spring.coil.scale.y) * Math.min(1, dt * 12);
        spring.pad.position.y += (0 - spring.pad.position.y) * Math.min(1, dt * 12);
      }
    }
    // Moving platforms
    for (const plat of world.movingPlatforms) {
      const offset = Math.sin(time * plat.speed + plat.phase) * plat.range;
      const nx = plat.base.x + (plat.axis === 'x' ? offset : 0);
      const nz = plat.base.z + (plat.axis === 'z' ? offset : 0);
      const ny = plat.base.y + (plat.axis === 'y' ? offset : 0);
      plat.delta.x = nx - plat.prev.x;
      plat.delta.y = ny - plat.prev.y;
      plat.delta.z = nz - plat.prev.z;
      plat.prev.x = nx;
      plat.prev.y = ny;
      plat.prev.z = nz;
      plat.group.position.set(nx, ny - 0.45, nz);
      plat.collider.min.x = nx - plat.w / 2;
      plat.collider.max.x = nx + plat.w / 2;
      plat.collider.min.z = nz - plat.d / 2;
      plat.collider.max.z = nz + plat.d / 2;
      plat.collider.min.y = ny - 0.9;
      plat.collider.max.y = ny;
      plat.colliderTop = ny;
    }
    // Clouds drift
    if (world.cloudGroup) world.cloudGroup.position.x = Math.sin(time * 0.02) * 8;
    if (playerPos) {
      world.sun.position.set(playerPos.x + 28, playerPos.y + 52, playerPos.z + 24);
      world.sun.target.position.set(playerPos.x, playerPos.y, playerPos.z);
      world.sun.target.updateMatrixWorld();
    }
    // Boss crown bob
    if (world.boss && world.boss.crown && world.boss.alive) {
      world.boss.crown.rotation.y += dt * 0.7;
    }
  };

  return world;
}
