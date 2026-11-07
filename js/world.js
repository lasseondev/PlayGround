/* NEON HEAT — procedural city world */
(function () {
  'use strict';

  const CITY = {
    step: 80,
    roads: [-240, -160, -80, 0, 80, 160, 240],
    roadHalf: 8,
    blockHalf: 32,
    lotHalf: 16,
    bound: 246,
    extent: 260
  };

  // deterministic city
  let seed = 0x9e3779b9;
  function rnd() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  const BUILDING_COLORS = [
    0x4a4f63, 0x5d5668, 0x6d5a55, 0x3f5560, 0x5f6a72,
    0x756a63, 0x463f52, 0x586b6b, 0x6a5560, 0x515c6e,
    0x7a6a58, 0x3d4a5c
  ];
  const WINDOW_COLORS = [0xffd18a, 0xffb45e, 0xffe6b0, 0xfff2d0, 0x9fe3ff, 0xffc46e];

  const colliders = [];
  const grid = new Map();
  const CELL = 40;
  let queryStamp = 0;

  function addCollider(minX, maxX, minZ, maxZ, h, tag) {
    const c = { minX, maxX, minZ, maxZ, h, tag: tag || 'building', _q: 0 };
    colliders.push(c);
    const x0 = Math.floor(minX / CELL), x1 = Math.floor(maxX / CELL);
    const z0 = Math.floor(minZ / CELL), z1 = Math.floor(maxZ / CELL);
    for (let ix = x0; ix <= x1; ix++) {
      for (let iz = z0; iz <= z1; iz++) {
        const k = ix + ',' + iz;
        let a = grid.get(k);
        if (!a) { a = []; grid.set(k, a); }
        a.push(c);
      }
    }
    return c;
  }

  const _qOut = [];
  function queryBuildings(x, z, r, out) {
    out = out || _qOut;
    out.length = 0;
    queryStamp++;
    const x0 = Math.floor((x - r) / CELL), x1 = Math.floor((x + r) / CELL);
    const z0 = Math.floor((z - r) / CELL), z1 = Math.floor((z + r) / CELL);
    for (let ix = x0; ix <= x1; ix++) {
      for (let iz = z0; iz <= z1; iz++) {
        const a = grid.get(ix + ',' + iz);
        if (!a) continue;
        for (let i = 0; i < a.length; i++) {
          const c = a[i];
          if (c._q !== queryStamp) { c._q = queryStamp; out.push(c); }
        }
      }
    }
    return out;
  }

  function segmentBlocked(x1, z1, x2, z2, pad) {
    // returns t in [0,1] of first building hit, or 1
    pad = pad || 0.4;
    const dx = x2 - x1, dz = z2 - z1;
    let best = 1;
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (c.tag !== 'building') continue;
      const minX = c.minX - pad, maxX = c.maxX + pad;
      const minZ = c.minZ - pad, maxZ = c.maxZ + pad;
      let tmin = 0, tmax = 1;
      if (Math.abs(dx) < 1e-6) {
        if (x1 < minX || x1 > maxX) continue;
      } else {
        let t1 = (minX - x1) / dx, t2 = (maxX - x1) / dx;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
        if (tmin > tmax) continue;
      }
      if (Math.abs(dz) < 1e-6) {
        if (z1 < minZ || z1 > maxZ) continue;
      } else {
        let t1 = (minZ - z1) / dz, t2 = (maxZ - z1) / dz;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
        if (tmin > tmax) continue;
      }
      if (tmin > 0 && tmin < best) best = tmin;
    }
    return best;
  }

  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.22, 'rgba(255,255,255,.7)');
    grad.addColorStop(0.55, 'rgba(255,255,255,.18)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function makeSignTexture(text, color) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 512, 128);
    g.font = 'italic 900 76px "Arial Black", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = color; g.shadowBlur = 26;
    g.fillStyle = color;
    g.fillText(text, 256, 66);
    g.shadowBlur = 10;
    g.fillStyle = '#fff';
    g.globalAlpha = 0.85;
    g.fillText(text, 256, 66);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    return t;
  }

  function mergeColored(items) {
    const positions = [], normals = [], colors = [];
    const col = new THREE.Color();
    for (let k = 0; k < items.length; k++) {
      const it = items[k];
      let g = it.g.index ? it.g.toNonIndexed() : it.g.clone();
      g.applyMatrix4(it.m);
      const p = g.attributes.position.array;
      const n = g.attributes.normal.array;
      col.set(it.c);
      for (let i = 0; i < p.length; i += 3) {
        positions.push(p[i], p[i + 1], p[i + 2]);
        normals.push(n[i], n[i + 1], n[i + 2]);
        colors.push(col.r, col.g, col.b);
      }
      g.dispose();
      if (it.g.index) it.g.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeBoundingSphere();
    return geo;
  }

  function m4(x, y, z, rx, ry, rz, sx, sy, sz) {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    o.rotation.set(rx || 0, ry || 0, rz || 0);
    o.scale.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz);
    o.updateMatrix();
    return o.matrix.clone();
  }

  function buildWorld(scene) {
    colliders.length = 0; grid.clear();

    const world = {
      colliders,
      queryBuildings,
      segmentBlocked,
      roadCenters: CITY.roads,
      bound: CITY.bound,
      spawn: { x: -4, z: 146, heading: Math.PI },
      parkedCars: [],
      pedRoutes: [],
      dropCandidates: []
    };

    // ---------- sky ----------
    const skyGeo = new THREE.SphereGeometry(760, 32, 20);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new THREE.Color(0x241d45) },
        mid: { value: new THREE.Color(0x7a4a6e) },
        horizon: { value: new THREE.Color(0xffa06a) },
        sunDir: { value: new THREE.Vector3(-0.62, 0.16, 0.5).normalize() }
      },
      vertexShader: `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 sunDir;
        varying vec3 vDir;
        void main(){
          vec3 d = normalize(vDir);
          float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(horizon, mid, smoothstep(0.0, 0.32, h));
          col = mix(col, top, smoothstep(0.22, 0.85, h));
          float sun = pow(max(dot(d, sunDir), 0.0), 28.0);
          float halo = pow(max(dot(d, sunDir), 0.0), 4.0);
          col += vec3(1.0, 0.62, 0.32) * sun * 0.85;
          col += vec3(1.0, 0.42, 0.25) * halo * 0.22;
          float below = smoothstep(0.0, -0.25, d.y);
          col = mix(col, vec3(0.13,0.10,0.18), below);
          gl_FragColor = vec4(col, 1.0);
        }`
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.frustumCulled = false;
    scene.add(sky);
    world.sky = sky;

    scene.fog = new THREE.Fog(0x7c5268, 130, 470);

    // ---------- lights ----------
    const hemi = new THREE.HemisphereLight(0xffb98a, 0x2b2946, 0.72);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffcf9e, 2.25);
    sun.position.set(-120, 78, 96);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 320;
    sun.shadow.camera.left = -105;
    sun.shadow.camera.right = 105;
    sun.shadow.camera.top = 105;
    sun.shadow.camera.bottom = -105;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.035;
    scene.add(sun);
    scene.add(sun.target);
    const fill = new THREE.DirectionalLight(0x5f7cff, 0.35);
    fill.position.set(80, 40, -100);
    scene.add(fill);
    world.sun = sun;
    world.hemi = hemi;

    // ---------- materials ----------
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x26242c, roughness: 0.94, metalness: 0.03 });
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0.02 });
    const lotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.1 });
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: true });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0.15 });

    // ---------- ground base ----------
    const base = new THREE.Mesh(
      new THREE.PlaneGeometry(1100, 1100),
      new THREE.MeshStandardMaterial({ color: 0x1b1920, roughness: 1 })
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.06;
    base.receiveShadow = true;
    scene.add(base);

    // ---------- roads ----------
    const roadGeoV = new THREE.PlaneGeometry(16, 520);
    const roadGeoH = new THREE.PlaneGeometry(520, 16);
    for (let i = 0; i < CITY.roads.length; i++) {
      const c = CITY.roads[i];
      const v = new THREE.Mesh(roadGeoV, asphaltMat);
      v.rotation.x = -Math.PI / 2;
      v.position.set(c, 0.012, 0);
      v.receiveShadow = true;
      scene.add(v);
      const h = new THREE.Mesh(roadGeoH, asphaltMat);
      h.rotation.x = -Math.PI / 2;
      h.position.set(0, 0.008, c);
      h.receiveShadow = true;
      scene.add(h);
    }

    // road markings
    const dashGeo = new THREE.BoxGeometry(0.22, 0.02, 3.0);
    const dashInstances = [];
    const crossInstances = [];
    for (let i = 0; i < CITY.roads.length; i++) {
      const c = CITY.roads[i];
      for (let j = 0; j < CITY.roads.length - 1; j++) {
        const a = CITY.roads[j] + 12, b = CITY.roads[j + 1] - 12;
        for (let t = a; t < b; t += 7.5) {
          // vertical road: center yellow + white edges
          dashInstances.push({ x: c, z: t, ry: 0, sx: 1, sy: 1, sz: 1, color: 0xffc23c });
          dashInstances.push({ x: c - 6.5, z: t, ry: 0, sx: 0.7, sy: 1, sz: 1, color: 0xbfc6d4 });
          dashInstances.push({ x: c + 6.5, z: t, ry: 0, sx: 0.7, sy: 1, sz: 1, color: 0xbfc6d4 });
          // horizontal
          dashInstances.push({ x: t, z: c, ry: Math.PI / 2, sx: 1, sy: 1, sz: 1, color: 0xffc23c });
          dashInstances.push({ x: t, z: c - 6.5, ry: Math.PI / 2, sx: 0.7, sy: 1, sz: 1, color: 0xbfc6d4 });
          dashInstances.push({ x: t, z: c + 6.5, ry: Math.PI / 2, sx: 0.7, sy: 1, sz: 1, color: 0xbfc6d4 });
        }
      }
    }
    // crosswalks around intersections
    for (let i = 0; i < CITY.roads.length; i++) {
      for (let j = 0; j < CITY.roads.length; j++) {
        const cx = CITY.roads[i], cz = CITY.roads[j];
        for (let s = 0; s < 6; s++) {
          const off = -5.5 + s * 2.2;
          // north & south approaches
          crossInstances.push({ x: cx + off, z: cz - 10.5, ry: 0, sx: 1, sy: 1, sz: 1 });
          crossInstances.push({ x: cx + off, z: cz + 10.5, ry: 0, sx: 1, sy: 1, sz: 1 });
          // east & west approaches
          crossInstances.push({ x: cx - 10.5, z: cz + off, ry: Math.PI / 2, sx: 1, sy: 1, sz: 1 });
          crossInstances.push({ x: cx + 10.5, z: cz + off, ry: Math.PI / 2, sx: 1, sy: 1, sz: 1 });
        }
      }
    }
    function buildInstanced(geo, mat, list, colorFn, y, shadow) {
      const mesh = new THREE.InstancedMesh(geo, mat, list.length);
      const d = new THREE.Object3D();
      const col = new THREE.Color();
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        d.position.set(it.x, it.y === undefined ? (y || 0.02) : it.y, it.z);
        d.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
        d.scale.set(it.sx === undefined ? 1 : it.sx, it.sy === undefined ? 1 : it.sy, it.sz === undefined ? 1 : it.sz);
        d.updateMatrix();
        mesh.setMatrixAt(i, d.matrix);
        if (colorFn) { colorFn(it, col); mesh.setColorAt(i, col); }
        else if (it.color !== undefined) { col.set(it.color); mesh.setColorAt(i, col); }
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.castShadow = !!shadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }
    buildInstanced(dashGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), dashInstances, null, 0.03, false);
    const crossGeo = new THREE.BoxGeometry(0.55, 0.02, 3.2);
    buildInstanced(crossGeo, new THREE.MeshStandardMaterial({ color: 0xd8dae0, roughness: 0.85 }), crossInstances, null, 0.031, false);

    // ---------- blocks ----------
    const sidewalkInstances = [];
    const lotInstances = [];
    const buildings = [];
    const windowList = [];
    const roofList = [];
    const antennaList = [];
    const treeSpots = [];
    const blockCenters = [];
    for (let bx = 0; bx < 6; bx++) {
      for (let bz = 0; bz < 6; bz++) {
        blockCenters.push({ x: -200 + bx * 80, z: -200 + bz * 80 });
      }
    }

    function addBuilding(x, z, w, d, h, color, isLandmark) {
      const b = { x, z, w, d, h, color };
      buildings.push(b);
      addCollider(x - w / 2, x + w / 2, z - d / 2, z + d / 2, h, 'building');
      // windows
      const rows = Math.max(1, Math.floor((h - 4) / 3.35));
      const sideData = [
        { len: w, nx: 0, nz: 1, rot: 0, px: x, pz: z + d / 2 },
        { len: w, nx: 0, nz: -1, rot: Math.PI, px: x, pz: z - d / 2 },
        { len: d, nx: 1, nz: 0, rot: Math.PI / 2, px: x + w / 2, pz: z },
        { len: d, nx: -1, nz: 0, rot: -Math.PI / 2, px: x - w / 2, pz: z }
      ];
      for (let s = 0; s < 4; s++) {
        const sd = sideData[s];
        const cols = Math.max(1, Math.floor((sd.len - 2.5) / 3.0));
        const spacing = sd.len / cols;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (rnd() > 0.36) continue;
            const along = -sd.len / 2 + spacing * (c + 0.5);
            let wx = sd.px, wz = sd.pz;
            if (sd.nx === 0) wx += along; else wz += along;
            const lit = rnd() < 0.9;
            const wc = lit ? pick(WINDOW_COLORS) : 0x2a2c38;
            windowList.push({
              x: wx + sd.nx * 0.075,
              y: 3.1 + r * 3.35,
              z: wz + sd.nz * 0.075,
              ry: sd.rot,
              sx: 1, sy: 1, sz: 1,
              color: wc
            });
          }
        }
        // ground-floor storefronts
        const gCols = Math.max(2, Math.floor((sd.len - 2) / 4.4));
        const gSpacing = sd.len / gCols;
        for (let c = 0; c < gCols; c++) {
          if (rnd() < 0.22) continue;
          const along = -sd.len / 2 + gSpacing * (c + 0.5);
          let wx = sd.px, wz = sd.pz;
          if (sd.nx === 0) wx += along; else wz += along;
          const wc = rnd() < 0.28 ? 0x9fe3ff : pick(WINDOW_COLORS);
          windowList.push({
            x: wx + sd.nx * 0.075,
            y: 1.62,
            z: wz + sd.nz * 0.075,
            ry: sd.rot,
            sx: 1.55, sy: 0.92, sz: 1,
            color: wc
          });
        }
      }
      if (rnd() < 0.55) {
        roofList.push({ x: x + (rnd() - 0.5) * w * 0.4, z: z + (rnd() - 0.5) * d * 0.4, y: h + 0.7, sx: w * 0.3, sy: 1.4, sz: d * 0.3, color: 0x3a3a44 });
      }
      if (isLandmark) {
        antennaList.push({ x, z, y: h + 4.5, h: 9 });
        if (rnd() < 0.55) addRoofSign(x, z, h, w);
      }
      // neon sign on some low buildings facing a street
      if (h > 9 && h < 40 && rnd() < 0.42 && !isLandmark) {
        addNeonSign(x, z, w, d, h);
      }
      return b;
    }

    const signWords = ['HOTEL', 'MOTEL', 'BAR', '24/7', 'NEON', 'CLUB', 'DINER', 'PAWN', 'LIQUOR', 'GARAGE'];
    const signColors = ['#ff2e79', '#41f5ff', '#ffc93c', '#b56bff', '#7dffb2'];
    function addNeonSign(x, z, w, d, h) {
      let nearestX = 0, ndx = Infinity;
      for (const r of CITY.roads) { const dd = Math.abs(x - r); if (dd < ndx) { ndx = dd; nearestX = r; } }
      let nearestZ = 0, ndz = Infinity;
      for (const r of CITY.roads) { const dd = Math.abs(z - r); if (dd < ndz) { ndz = dd; nearestZ = r; } }
      let facing;
      if (ndx < ndz) facing = x > nearestX ? 3 : 2;
      else facing = z > nearestZ ? 1 : 0;
      const word = pick(signWords);
      const col = pick(signColors);
      const tex = makeSignTexture(word, col);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide });
      const sw = Math.min(9.5, (facing < 2 ? w : d) * 0.62);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(sw, sw * 0.25), mat);
      const y = Math.min(h - 2.2, 7.2 + rnd() * 6);
      if (facing === 0) { mesh.position.set(x, y, z + d / 2 + 0.12); }
      else if (facing === 1) { mesh.position.set(x, y, z - d / 2 - 0.12); mesh.rotation.y = Math.PI; }
      else if (facing === 2) { mesh.position.set(x + w / 2 + 0.12, y, z); mesh.rotation.y = Math.PI / 2; }
      else { mesh.position.set(x - w / 2 - 0.12, y, z); mesh.rotation.y = -Math.PI / 2; }
      mesh.renderOrder = 2;
      scene.add(mesh);
      // soft glow backing
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(sw * 1.12, sw * 0.42), new THREE.MeshBasicMaterial({
        color: new THREE.Color(col), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      }));
      glow.position.copy(mesh.position);
      glow.rotation.copy(mesh.rotation);
      glow.translateZ(-0.02);
      scene.add(glow);
    }

    const roofWords = ['NEON', 'HEAT', 'NIGHT', 'VICE', 'CITY'];
    function addRoofSign(x, z, h, w) {
      const word = pick(roofWords);
      const col = pick(signColors);
      const tex = makeSignTexture(word, col);
      const sw = Math.min(20, Math.max(11, w * 0.9));
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(sw, sw * 0.24), new THREE.MeshBasicMaterial({
        map: tex, transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide
      }));
      let nearestX = 0, ndx = Infinity;
      for (const r of CITY.roads) { const dd = Math.abs(x - r); if (dd < ndx) { ndx = dd; nearestX = r; } }
      let nearestZ = 0, ndz = Infinity;
      for (const r of CITY.roads) { const dd = Math.abs(z - r); if (dd < ndz) { ndz = dd; nearestZ = r; } }
      let rot = 0;
      if (ndx < ndz) rot = x > nearestX ? -Math.PI / 2 : Math.PI / 2;
      else rot = z > nearestZ ? Math.PI : 0;
      plane.position.set(x, h + 3.4, z);
      plane.rotation.y = rot;
      plane.translateZ(0.4);
      scene.add(plane);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(sw * 1.04, sw * 0.28, 0.32), new THREE.MeshStandardMaterial({ color: 0x17151e, roughness: 0.8 }));
      frame.position.copy(plane.position);
      frame.rotation.y = rot;
      frame.translateZ(-0.2);
      scene.add(frame);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2730, roughness: 0.7, metalness: 0.4 });
      for (const s of [-1, 1]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 3.4, 6), poleMat);
        pole.position.set(x + Math.cos(rot) * s * sw * 0.36, h + 1.7, z - Math.sin(rot) * s * sw * 0.36);
        scene.add(pole);
      }
    }

    function splitRect(x, z, w, d, depth, out) {
      if (depth <= 0 || (w < 12 && d < 12) || out.length >= 4) { out.push({ x, z, w, d }); return; }
      if (rnd() < 0.36) { out.push({ x, z, w, d }); return; }
      const alongX = w >= d ? rnd() < 0.7 : rnd() < 0.3;
      const ratio = 0.35 + rnd() * 0.3;
      if (alongX) {
        const w1 = w * ratio, w2 = w - w1;
        splitRect(x - w / 2 + w1 / 2, z, w1 - 1.2, d, depth - 1, out);
        splitRect(x + w / 2 - w2 / 2, z, w2 - 1.2, d, depth - 1, out);
      } else {
        const d1 = d * ratio, d2 = d - d1;
        splitRect(x, z - d / 2 + d1 / 2, w, d1 - 1.2, depth - 1, out);
        splitRect(x, z + d / 2 - d2 / 2, w, d2 - 1.2, depth - 1, out);
      }
    }

    for (let bi = 0; bi < blockCenters.length; bi++) {
      const bc = blockCenters[bi];
      const distCenter = Math.hypot(bc.x, bc.z);
      const downtown = clamp(1 - distCenter / 300, 0, 1);
      const typeRoll = rnd();
      let type = 'city';
      if (typeRoll < 0.13) type = 'park';
      else if (typeRoll < 0.24) type = 'parking';

      sidewalkInstances.push({ x: bc.x, z: bc.z, y: 0.09, sx: 64, sy: 0.18, sz: 64, color: rnd() < 0.5 ? 0x5d5966 : 0x66616d });
      if (type === 'park') {
        lotInstances.push({ x: bc.x, z: bc.z, y: 0.2, sx: 32, sy: 0.04, sz: 32, color: 0x27402e });
        // paths
        lotInstances.push({ x: bc.x, z: bc.z, y: 0.225, sx: 32, sy: 0.02, sz: 4, color: 0x8a8272 });
        lotInstances.push({ x: bc.x, z: bc.z, y: 0.226, sx: 4, sy: 0.02, sz: 32, color: 0x8a8272 });
        // fountain
        const fountain = new THREE.Group();
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.3, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0x8e8a86, roughness: 0.8 }));
        basin.position.y = 0.35; basin.castShadow = true; basin.receiveShadow = true;
        fountain.add(basin);
        const water = new THREE.Mesh(new THREE.CylinderGeometry(2.75, 2.75, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x2f7f92, roughness: 0.15, metalness: 0.5, emissive: 0x0a3a44, emissiveIntensity: 0.7 }));
        water.position.y = 0.73; fountain.add(water);
        const statue = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x77706a, roughness: 0.7 }));
        statue.position.y = 1.7; statue.castShadow = true; fountain.add(statue);
        fountain.position.set(bc.x, 0.2, bc.z);
        scene.add(fountain);
        addCollider(bc.x - 3.3, bc.x + 3.3, bc.z - 3.3, bc.z + 3.3, 2.4, 'fountain');
        for (let t = 0; t < 7; t++) {
          treeSpots.push({ x: bc.x + (rnd() - 0.5) * 26, z: bc.z + (rnd() - 0.5) * 26, s: 0.85 + rnd() * 0.4 });
        }
        world.pedRoutes.push(makePedRoute(bc, true));
      } else if (type === 'parking') {
        lotInstances.push({ x: bc.x, z: bc.z, y: 0.2, sx: 32, sy: 0.04, sz: 32, color: 0x2b2932 });
        // parking lines
        for (let p = 0; p < 6; p++) {
          lotInstances.push({ x: bc.x - 13 + p * 5.2, z: bc.z - 11, y: 0.23, sx: 0.12, sy: 0.02, sz: 5.5, color: 0xb8b4aa });
          lotInstances.push({ x: bc.x - 13 + p * 5.2, z: bc.z + 11, y: 0.23, sx: 0.12, sy: 0.02, sz: 5.5, color: 0xb8b4aa });
        }
        for (let p = 0; p < 3; p++) {
          if (rnd() < 0.6) {
            world.parkedCars.push({
              x: bc.x - 10.5 + p * 5.2 + (rnd() - 0.5),
              z: bc.z - 11 + (rnd() - 0.5) * 1.5,
              heading: rnd() < 0.5 ? 0 : Math.PI,
              color: pick([0x2e6f8f, 0x8f3a4a, 0xd0c6b0, 0x3c5a3a, 0x6b5d8a, 0xb08a3a])
            });
          }
        }
        world.pedRoutes.push(makePedRoute(bc, false));
      } else {
        lotInstances.push({ x: bc.x, z: bc.z, y: 0.2, sx: 32, sy: 0.04, sz: 32, color: 0x39343d });
        const rects = [];
        const baseW = 26 + rnd() * 3, baseD = 26 + rnd() * 3;
        splitRect(bc.x, bc.z, baseW, baseD, 3, rects);
        let built = 0;
        for (let r = 0; r < rects.length; r++) {
          const rc = rects[r];
          if (r > 0 && rnd() < 0.18) continue;
          const inset = 0.5 + rnd() * 1.2;
          const w = Math.max(6, rc.w - inset * 2);
          const d = Math.max(6, rc.d - inset * 2);
          const landmark = downtown > 0.62 && rnd() < 0.14 && built === 0;
          let h = 8 + rnd() * 9 + Math.pow(downtown, 2.1) * (34 + rnd() * 32);
          if (landmark) h = 62 + rnd() * 28;
          const color = pick(BUILDING_COLORS);
          addBuilding(rc.x, rc.z, w, d, h, color, landmark);
          built++;
        }
        // a few palms along the block edge
        const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (let c = 0; c < 3; c++) {
          const co = pick(corners);
          treeSpots.push({ x: bc.x + co[0] * (27 + rnd() * 3), z: bc.z + co[1] * (27 + rnd() * 3), s: 0.8 + rnd() * 0.5 });
        }
        world.pedRoutes.push(makePedRoute(bc, false));
      }
    }

    // sidewalk + lot instancing
    const sideGeo = new THREE.BoxGeometry(1, 1, 1);
    buildInstanced(sideGeo, sidewalkMat, sidewalkInstances, null, 0, false).receiveShadow = true;
    buildInstanced(sideGeo, lotMat, lotInstances, null, 0, false).receiveShadow = true;

    // building bodies
    const bodyGeo = new THREE.BoxGeometry(1, 1, 1);
    const bodyMesh = new THREE.InstancedMesh(bodyGeo, buildingMat, buildings.length);
    {
      const d = new THREE.Object3D(), col = new THREE.Color();
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        d.position.set(b.x, b.h / 2 + 0.2, b.z);
        d.rotation.set(0, 0, 0);
        d.scale.set(b.w, b.h, b.d);
        d.updateMatrix();
        bodyMesh.setMatrixAt(i, d.matrix);
        col.set(b.color);
        bodyMesh.setColorAt(i, col);
      }
      bodyMesh.instanceMatrix.needsUpdate = true;
      if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
      bodyMesh.castShadow = true; bodyMesh.receiveShadow = true;
      scene.add(bodyMesh);
    }
    // roof clutter
    const roofGeo = new THREE.BoxGeometry(1, 1, 1);
    buildInstanced(roofGeo, trimMat, roofList, null, 0, true);

    // windows
    if (windowList.length) {
      const winGeo = new THREE.PlaneGeometry(1.35, 1.8);
      buildInstanced(winGeo, windowMat, windowList, (it, col) => {
        col.set(it.color);
        const b = 1 + (rnd() - 0.5) * 0.15;
        col.multiplyScalar(b);
      }, 0, false);
    }

    // antennas
    if (antennaList.length) {
      const poleGeo = new THREE.CylinderGeometry(0.09, 0.16, 1, 6);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x24242c, roughness: 0.7, metalness: 0.4 });
      const list = antennaList.map(a => ({ x: a.x, y: a.y, z: a.z, sx: 1, sy: a.h, sz: 1 }));
      buildInstanced(poleGeo, poleMat, list, null, 0, false);
      const beaconGeo = new THREE.SphereGeometry(0.28, 6, 5);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2e3c });
      const bl = antennaList.map(a => ({ x: a.x, y: a.y + a.h / 2 + 0.2, z: a.z }));
      buildInstanced(beaconGeo, beaconMat, bl, null, 0, false);
    }

    // ---------- street lamps ----------
    const lampPositions = [];
    for (let i = 0; i < CITY.roads.length; i++) {
      const c = CITY.roads[i];
      let side = 1;
      for (let z = -222; z <= 222; z += 44) {
        lampPositions.push({ x: c + side * 10.5, z, ry: side > 0 ? Math.PI : 0 });
        lampPositions.push({ x: z, z: c + side * 10.5, ry: side > 0 ? -Math.PI / 2 : Math.PI / 2 });
        side *= -1;
      }
    }
    const poleItems = [], headItems = [], glowItems = [], poolItems = [];
    for (let i = 0; i < lampPositions.length; i++) {
      const p = lampPositions[i];
      poleItems.push({ x: p.x, y: 3.5, z: p.z, ry: 0, sx: 1, sy: 1, sz: 1 });
      headItems.push({ x: p.x + Math.sin(p.ry) * 0.0, y: 7.05, z: p.z, ry: p.ry, sx: 1, sy: 1, sz: 1 });
      glowItems.push({ x: p.x, y: 7.05, z: p.z, sx: 1, sy: 1, sz: 1 });
      poolItems.push({ x: p.x, y: 0.04, z: p.z, rx: -Math.PI / 2, sx: 11, sy: 11, sz: 1 });
    }
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.13, 7, 6);
    buildInstanced(poleGeo, new THREE.MeshStandardMaterial({ color: 0x2a2a33, roughness: 0.55, metalness: 0.5 }), poleItems, null, 0, true);
    const headGeo = new THREE.BoxGeometry(0.55, 0.2, 1.9);
    buildInstanced(headGeo, new THREE.MeshBasicMaterial({ color: 0xffe0a8 }), headItems, null, 0, false);
    const glowTex = makeGlowTexture();
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffc98a, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    buildInstanced(new THREE.PlaneGeometry(1, 1), glowMat, glowItems.map(g => ({ ...g, rx: 0, ry: 0 })), null, 0, false).frustumCulled = false;
    const poolMat = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffb877, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false });
    buildInstanced(new THREE.PlaneGeometry(1, 1), poolMat, poolItems, null, 0, false);

    // ---------- palms ----------
    for (let i = 0; i < 44; i++) {
      const c = pick(CITY.roads);
      const along = (rnd() - 0.5) * 440;
      const side = rnd() < 0.5 ? -1 : 1;
      if (rnd() < 0.5) treeSpots.push({ x: c + side * (9.5 + rnd() * 2.5), z: along, s: 0.8 + rnd() * 0.5 });
      else treeSpots.push({ x: along, z: c + side * (9.5 + rnd() * 2.5), s: 0.8 + rnd() * 0.5 });
    }
    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.3, 6, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4634, roughness: 0.95 });
    const trunkItems = treeSpots.map(t => ({ x: t.x, y: 3, z: t.z, rz: (rnd() - 0.5) * 0.12, sx: t.s, sy: t.s, sz: t.s }));
    buildInstanced(trunkGeo, trunkMat, trunkItems, null, 0, true);
    // crown merged geometry
    const frondItems = [];
    for (let f = 0; f < 7; f++) {
      const ang = (f / 7) * Math.PI * 2;
      frondItems.push({
        g: new THREE.BoxGeometry(0.3, 0.09, 3.1),
        m: m4(Math.sin(ang) * 1.4, 6 + Math.cos(ang * 2) * 0.1, Math.cos(ang) * 1.4, 0.22, ang, 0.0),
        c: f % 2 ? 0x2f6b3c : 0x3f7f45
      });
      frondItems.push({
        g: new THREE.BoxGeometry(0.22, 0.08, 2.3),
        m: m4(Math.sin(ang) * 0.9, 5.95, Math.cos(ang) * 0.9, 0.5, ang + 0.3, 0.0),
        c: 0x2b5c35
      });
    }
    const crownGeo = mergeColored(frondItems);
    const crownMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
    const crownItems = treeSpots.map(t => ({ x: t.x, y: 0.15, z: t.z, ry: rnd() * 6.28, sx: t.s, sy: t.s, sz: t.s }));
    buildInstanced(crownGeo, crownMat, crownItems, null, 0, true);

    // ---------- perimeter ----------
    const barrierItems = [];
    const B = 250;
    for (let t = -B; t <= B; t += 8) {
      barrierItems.push({ x: t, y: 0.65, z: -B, ry: 0, sx: 3.6, sy: 1.3, sz: 0.7 });
      barrierItems.push({ x: t, y: 0.65, z: B, ry: 0, sx: 3.6, sy: 1.3, sz: 0.7 });
      barrierItems.push({ x: -B, y: 0.65, z: t, ry: Math.PI / 2, sx: 3.6, sy: 1.3, sz: 0.7 });
      barrierItems.push({ x: B, y: 0.65, z: t, ry: Math.PI / 2, sx: 3.6, sy: 1.3, sz: 0.7 });
    }
    buildInstanced(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x6a6460, roughness: 0.9 }), barrierItems, null, 0, true);

    // ---------- distant skyline ----------
    const skylineItems = [];
    for (let i = 0; i < 64; i++) {
      const ang = (i / 64) * Math.PI * 2 + rnd() * 0.06;
      const rad = 310 + rnd() * 120;
      const h = 28 + rnd() * 85;
      skylineItems.push({
        x: Math.cos(ang) * rad, z: Math.sin(ang) * rad, y: h / 2,
        sx: 18 + rnd() * 34, sy: h, sz: 18 + rnd() * 34,
        ry: rnd() * 3, color: 0x2c2638
      });
    }
    buildInstanced(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), skylineItems, null, 0, false);

    // ---------- minimap ----------
    const map = document.createElement('canvas');
    map.width = map.height = 520;
    const g = map.getContext('2d');
    g.fillStyle = '#111019'; g.fillRect(0, 0, 520, 520);
    const toMap = v => v + 260;
    // roads
    g.strokeStyle = '#3a3742'; g.lineWidth = 16;
    for (const c of CITY.roads) {
      g.beginPath(); g.moveTo(toMap(c), 0); g.lineTo(toMap(c), 520); g.stroke();
      g.beginPath(); g.moveTo(0, toMap(c)); g.lineTo(520, toMap(c)); g.stroke();
    }
    // blocks
    for (const bc of blockCenters) {
      const type = 'x';
      g.fillStyle = '#211e2a';
      g.fillRect(toMap(bc.x) - 32, toMap(bc.z) - 32, 64, 64);
      g.strokeStyle = 'rgba(120,110,140,.18)'; g.lineWidth = 1;
      g.strokeRect(toMap(bc.x) - 32, toMap(bc.z) - 32, 64, 64);
    }
    // highlight parks roughly
    g.fillStyle = 'rgba(60,120,80,.25)';
    for (const bc of blockCenters) {
      if ((Math.abs(bc.x) + Math.abs(bc.z)) % 160 === 0) g.fillRect(toMap(bc.x) - 14, toMap(bc.z) - 14, 28, 28);
    }
    g.strokeStyle = 'rgba(65,245,255,.35)'; g.lineWidth = 2; g.strokeRect(3, 3, 514, 514);
    world.mapCanvas = map;
    world.mapToMap = toMap;

    // ---------- helpers ----------
    world.randomRoadPoint = function (minDist, from, lane, maxDist) {
      for (let tries = 0; tries < 80; tries++) {
        const c = pick(CITY.roads);
        const t = (rnd() - 0.5) * 460;
        const vertical = rnd() < 0.5;
        let x, z;
        if (vertical) { x = c + (lane || 0) * (rnd() < 0.5 ? -1 : 1); z = t; }
        else { x = t; z = c + (lane || 0) * (rnd() < 0.5 ? -1 : 1); }
        if (Math.abs(x) > 236 || Math.abs(z) > 236) continue;
        const d = Math.hypot(x - from.x, z - from.z);
        if (d >= minDist && d <= (maxDist || 300)) return new THREE.Vector3(x, 0, z);
      }
      return new THREE.Vector3(0, 0, -180);
    };

    world.makePedRoute = makePedRoute;
    function makePedRoute(bc, small) {
      const r = small ? 20 : 27;
      return [
        new THREE.Vector3(bc.x - r, 0, bc.z - r),
        new THREE.Vector3(bc.x + r, 0, bc.z - r),
        new THREE.Vector3(bc.x + r, 0, bc.z + r),
        new THREE.Vector3(bc.x - r, 0, bc.z + r)
      ];
    }
    world.blockCenters = blockCenters;

    return world;
  }

  window.NeonWorld = { buildWorld, CITY, mergeColored, m4, makeGlowTexture };
})();
