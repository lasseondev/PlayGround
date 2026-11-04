import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Shared cartoon gradient for MeshToonMaterial (three soft steps).
let gradientMap = null;
export function toonGradient() {
  if (gradientMap) return gradientMap;
  const data = new Uint8Array([88, 150, 210, 255]);
  gradientMap = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;
  return gradientMap;
}

export function toon(color, extra = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), ...extra });
}

const OUTLINE_MAT = new THREE.MeshBasicMaterial({ color: 0x12213d, side: THREE.BackSide });
function addOutline(mesh, scale = 1.09) {
  const outline = new THREE.Mesh(mesh.geometry, OUTLINE_MAT);
  outline.scale.setScalar(scale);
  outline.castShadow = false;
  outline.receiveShadow = false;
  mesh.add(outline);
  return mesh;
}

function mesh(geo, mat, { outline = false, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow;
  m.receiveShadow = false;
  if (outline) addOutline(m);
  return m;
}

// Merge several primitive geometries into a single vertex-colored mesh.
// Used for enemies, where dozens of tiny parts would otherwise cost many draws.
const COLORED_TOON = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: toonGradient() });

function mergeColored(parts) {
  const geos = [];
  for (const part of parts) {
    let g = part.geo.clone();
    if (g.index) {
      const nonIndexed = g.toNonIndexed();
      g.dispose();
      g = nonIndexed;
    }
    const matrix = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const euler = part.rotation ? new THREE.Euler(part.rotation[0] || 0, part.rotation[1] || 0, part.rotation[2] || 0) : new THREE.Quaternion();
    if (part.rotation && !(part.rotation instanceof THREE.Euler)) {
      quat.setFromEuler(euler);
    } else if (part.rotation instanceof THREE.Euler) {
      quat.setFromEuler(part.rotation);
    }
    const pos = part.position || [0, 0, 0];
    const scl = part.scale || [1, 1, 1];
    matrix.compose(new THREE.Vector3(...pos), quat, new THREE.Vector3(...scl));
    g.applyMatrix4(matrix);
    const color = new THREE.Color(part.color);
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
  const m = new THREE.Mesh(merged, COLORED_TOON);
  m.castShadow = true;
  m.receiveShadow = false;
  return m;
}

// ------------------------------- Hero --------------------------------------

export function createHero() {
  const root = new THREE.Group();
  root.name = 'hero';

  const body = new THREE.Group();
  root.add(body);

  const skin = toon(0xffc58f);
  const skinDark = toon(0xe8a06b);
  const red = toon(0xe8333f);
  const redDark = toon(0xbb1f2e);
  const blue = toon(0x2c62d4);
  const blueDark = toon(0x1e47a3);
  const brown = toon(0x7a401e);
  const white = toon(0xfff8ea);
  const black = toon(0x1b2033);
  const gold = toon(0xffcf3f);

  // Legs (pivot at hip)
  const legs = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.17, 0.72, 0);
    const leg = mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.5, 8), blueDark, { outline: true });
    leg.position.y = -0.26;
    pivot.add(leg);
    const shoe = mesh(new THREE.BoxGeometry(0.27, 0.18, 0.42), brown, { outline: true });
    shoe.position.set(0, -0.56, 0.08);
    pivot.add(shoe);
    body.add(pivot);
    legs.push(pivot);
  }

  // Torso
  const torso = new THREE.Group();
  torso.position.y = 1.02;
  body.add(torso);

  const shirt = mesh(new THREE.BoxGeometry(0.6, 0.46, 0.4), red, { outline: true });
  shirt.position.y = 0.08;
  torso.add(shirt);

  const overalls = mesh(new THREE.BoxGeometry(0.64, 0.34, 0.44), blue, { outline: true });
  overalls.position.y = -0.17;
  torso.add(overalls);

  const bib = mesh(new THREE.BoxGeometry(0.34, 0.26, 0.06), blue, { outline: true });
  bib.position.set(0, 0.06, 0.22);
  torso.add(bib);

  // Overall buttons
  for (const side of [-1, 1]) {
    const button = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 10), gold, { shadow: false });
    button.rotation.x = Math.PI / 2;
    button.position.set(side * 0.15, 0.13, 0.255);
    torso.add(button);
  }

  // Arms (pivot at shoulder)
  const arms = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.36, 1.24, 0);
    const sleeve = mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.3, 8), red, { outline: true });
    sleeve.position.y = -0.14;
    pivot.add(sleeve);
    const glove = mesh(new THREE.SphereGeometry(0.13, 10, 8), white, { outline: true });
    glove.position.y = -0.33;
    pivot.add(glove);
    body.add(pivot);
    arms.push(pivot);
  }

  // Head
  const head = new THREE.Group();
  head.position.y = 1.7;
  body.add(head);

  const skull = mesh(new THREE.SphereGeometry(0.36, 18, 14), skin, { outline: true });
  skull.scale.set(1, 1.02, 0.96);
  head.add(skull);

  // Ears
  for (const side of [-1, 1]) {
    const ear = mesh(new THREE.SphereGeometry(0.1, 10, 8), skin, { shadow: false });
    ear.position.set(side * 0.34, -0.02, 0);
    head.add(ear);
  }

  // Eyes
  for (const side of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.09, 10, 8), white, { shadow: false });
    eye.scale.set(0.85, 1.2, 0.55);
    eye.position.set(side * 0.125, 0.07, 0.305);
    head.add(eye);
    const pupil = mesh(new THREE.SphereGeometry(0.045, 8, 8), black, { shadow: false });
    pupil.scale.set(0.9, 1.1, 0.5);
    pupil.position.set(side * 0.125, 0.07, 0.35);
    head.add(pupil);
  }

  // Nose
  const nose = mesh(new THREE.SphereGeometry(0.11, 12, 10), skinDark, { shadow: false });
  nose.scale.set(1.05, 0.9, 0.85);
  nose.position.set(0, -0.05, 0.355);
  head.add(nose);

  // Moustache
  for (const side of [-1, 1]) {
    const stache = mesh(new THREE.SphereGeometry(0.09, 10, 8), brown, { shadow: false });
    stache.scale.set(1.3, 0.55, 0.55);
    stache.position.set(side * 0.1, -0.16, 0.31);
    stache.rotation.z = side * 0.22;
    head.add(stache);
  }

  // Cap dome
  const cap = new THREE.Group();
  cap.position.set(0, 0.19, -0.01);
  head.add(cap);

  const dome = mesh(new THREE.SphereGeometry(0.385, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), red, { outline: true });
  dome.scale.set(1, 0.9, 1);
  cap.add(dome);

  const brim = mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.07, 18, 1, false, -Math.PI / 2, Math.PI), redDark, { outline: true });
  brim.scale.z = 1.15;
  brim.position.set(0, 0.005, 0.24);
  brim.rotation.x = -0.05;
  cap.add(brim);

  // Cap badge: white disc + gold gem
  const badge = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.035, 12), white, { shadow: false });
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0, 0.13, 0.33);
  cap.add(badge);
  const gem = mesh(new THREE.OctahedronGeometry(0.055), gold, { shadow: false });
  gem.position.set(0, 0.13, 0.36);
  gem.scale.z = 0.45;
  cap.add(gem);

  // Backpack for silhouette interest
  const pack = mesh(new THREE.BoxGeometry(0.3, 0.28, 0.16), blueDark, { outline: true });
  pack.position.set(0, 1.1, -0.27);
  body.add(pack);

  root.traverse((o) => {
    if (o.isMesh) o.frustumCulled = false;
  });

  return {
    root,
    body,
    torso,
    head,
    cap,
    legs,
    arms,
    materials: { red, redDark, blue, blueDark, skin, skinDark, brown, white, black, gold },
  };
}

// ------------------------------ Goomba -------------------------------------

export function createGoomba({ scale = 1, boss = false } = {}) {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const body = new THREE.Group();
  root.add(body);

  const capColor = boss ? 0x7b3fd4 : 0xd9343b;
  const capDarkColor = boss ? 0x55259a : 0x9f1f28;
  const skinColor = 0xf6d7a6;
  const footColor = 0x5a3217;
  const whiteColor = 0xfff8ea;
  const blackColor = 0x1a1c2c;

  // Head is a single merged, vertex-colored mesh (1 draw instead of ~20).
  const head = new THREE.Group();
  head.position.y = 0.6;
  body.add(head);

  const parts = [
    { geo: new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.9), color: capColor, scale: [1, 0.8, 1] },
    { geo: new THREE.SphereGeometry(0.48, 16, 12), color: skinColor, scale: [1, 0.68, 0.9], position: [0, -0.13, 0] },
  ];
  const spotPositions = [
    [0, 0.42, 0.24, 0.8],
    [-0.33, 0.26, 0.34, 0.58],
    [0.36, 0.3, 0.08, 0.5],
    [0.06, 0.26, -0.42, 0.6],
  ];
  for (const [x, y, z, s] of spotPositions) {
    parts.push({ geo: new THREE.SphereGeometry(0.16, 10, 8), color: whiteColor, position: [x, y, z], scale: [s, s, s] });
  }
  for (const side of [-1, 1]) {
    parts.push({ geo: new THREE.SphereGeometry(0.1, 8, 8), color: whiteColor, position: [side * 0.15, -0.05, 0.42], scale: [0.8, 1.1, 0.45] });
    parts.push({ geo: new THREE.SphereGeometry(0.05, 8, 8), color: blackColor, position: [side * 0.14, -0.07, 0.47], scale: [1, 1, 0.4] });
    parts.push({ geo: new THREE.BoxGeometry(0.18, 0.05, 0.05), color: capDarkColor, position: [side * 0.15, 0.07, 0.46], rotation: [0, 0, side * 0.35] });
    parts.push({ geo: new THREE.ConeGeometry(0.035, 0.1, 5), color: whiteColor, position: [side * 0.12, -0.26, 0.44], rotation: [Math.PI, 0, 0] });
  }
  const headMesh = mergeColored(parts);
  head.add(headMesh);

  // Feet stay separate so they can waddle.
  const feet = [];
  const footGeo = new THREE.SphereGeometry(0.22, 10, 8);
  const footMat = toon(footColor);
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(footGeo, footMat);
    foot.scale.set(1, 0.55, 1.25);
    foot.position.set(side * 0.28, 0.12, 0.06);
    foot.castShadow = true;
    body.add(foot);
    feet.push(foot);
  }

  // Crown for the boss
  let crown = null;
  if (boss) {
    crown = new THREE.Group();
    const gold = toon(0xffce3f);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.16, 10), gold);
    band.position.y = 0.5;
    band.castShadow = true;
    crown.add(band);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 5), gold);
      spike.position.set(Math.cos(a) * 0.24, 0.68, Math.sin(a) * 0.24);
      spike.castShadow = true;
      crown.add(spike);
    }
    const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), toon(0xff4a5a));
    jewel.position.set(0, 0.5, 0.31);
    crown.add(jewel);
    head.add(crown);
  }

  root.traverse((o) => {
    if (o.isMesh) o.frustumCulled = false;
  });

  return { root, body, head, feet, crown, scaleValue: scale };
}
