import * as THREE from 'three';
import {
  floorTexture, wallTexture, hazardTexture, glowTexture, planetTexture,
  padTexture, hologramTexture
} from './textures.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export class World {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.meshes = [];
    this.decor = [];
    this.pickups = [];
    this.jumpPads = [];
    this.spawnPoints = [];
    this.navPoints = [];
    this.time = 0;
    this.raycaster = new THREE.Raycaster();
    this.buildMaterials();
    this.buildSky();
    this.buildLights();
    this.buildArena();
    this.buildPickups();
    this.buildPads();
    this.buildSpawns();
    this.buildDust();
  }

  buildMaterials() {
    const floorTex = floorTexture();
    floorTex.repeat.set(11, 11);
    const wallTex = wallTexture();
    wallTex.repeat.set(2, 2);
    const hazardTex = hazardTexture();

    this.mats = {
      floor: new THREE.MeshStandardMaterial({ map: floorTex, color: 0xe2edff, roughness: 0.62, metalness: 0.22 }),
      wall: new THREE.MeshStandardMaterial({ map: wallTex, color: 0xd4e0f0, roughness: 0.55, metalness: 0.3 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x1b2336, roughness: 0.5, metalness: 0.55 }),
      darker: new THREE.MeshStandardMaterial({ color: 0x0d1322, roughness: 0.72, metalness: 0.45 }),
      hull: new THREE.MeshStandardMaterial({ color: 0x384567, roughness: 0.42, metalness: 0.6 }),
      hazard: new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.7, metalness: 0.3 }),
      cyan: new THREE.MeshBasicMaterial({ color: 0x42eaff }),
      mag: new THREE.MeshBasicMaterial({ color: 0xff2e8a }),
      amber: new THREE.MeshBasicMaterial({ color: 0xffb02e }),
      green: new THREE.MeshBasicMaterial({ color: 0x51ffb0 }),
      white: new THREE.MeshBasicMaterial({ color: 0xdffbff }),
      holo: new THREE.MeshBasicMaterial({ color: 0x66eeff, transparent: true, opacity: 0.32, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      holoMag: new THREE.MeshBasicMaterial({ color: 0xff5fae, transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      glass: new THREE.MeshStandardMaterial({ color: 0x1a3450, emissive: 0x0b2b3a, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.9, transparent: true, opacity: 0.55 }),
      rock: new THREE.MeshStandardMaterial({ color: 0x171226, roughness: 0.95, metalness: 0.15 }),
    };
    this.glowCyan = glowTexture('rgba(220,255,255,1)', 'rgba(63,233,255,.45)', 'rgba(0,180,255,0)');
    this.glowMag = glowTexture('rgba(255,230,245,1)', 'rgba(255,46,138,.5)', 'rgba(255,0,80,0)');
    this.glowAmber = glowTexture('rgba(255,250,220,1)', 'rgba(255,176,46,.55)', 'rgba(255,100,0,0)');
  }

  buildSky() {
    const scene = this.scene;
    scene.fog = new THREE.FogExp2(0x08040f, 0.0085);
    scene.background = new THREE.Color(0x05020b);

    const skyGeo = new THREE.SphereGeometry(700, 32, 24);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {},
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vDir;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        void main(){
          float h = vDir.y;
          vec3 zenith = vec3(0.014,0.006,0.045);
          vec3 upper = vec3(0.055,0.018,0.13);
          vec3 horizon = vec3(0.23,0.045,0.22);
          vec3 low = vec3(0.02,0.005,0.03);
          vec3 col = mix(low, horizon, smoothstep(-0.35,0.03,h));
          col = mix(col, upper, smoothstep(0.0,0.35,h));
          col = mix(col, zenith, smoothstep(0.3,0.9,h));
          // magenta bloom band near horizon
          col += vec3(0.32,0.03,0.16) * pow(max(0.0, 1.0 - abs(h - 0.015) * 5.0), 3.0) * 0.55;
          // faint nebula
          float n = hash(floor(vDir.xz*160.0)) * 0.5 + hash(floor(vDir.xz*57.0)) * 0.5;
          col += vec3(0.03,0.015,0.06) * n * smoothstep(-0.1,0.5,h);
          gl_FragColor = vec4(col, 1.0);
        }`
    });
    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.sky.frustumCulled = false;
    scene.add(this.sky);

    // stars
    const N = 1800;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = 430 + Math.random() * 160;
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(th) * s * r;
      pos[i * 3 + 1] = u * r * 0.85 + 40;
      pos[i * 3 + 2] = Math.sin(th) * s * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({
      color: 0xbfeaff, size: 1.6, sizeAttenuation: true, transparent: true, opacity: 0.9, fog: false, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    scene.add(stars);

    // gas giant
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(92, 48, 32),
      new THREE.MeshBasicMaterial({ map: planetTexture(), fog: false })
    );
    planet.position.set(-250, 92, -450);
    scene.add(planet);

    const ringGeo = new THREE.RingGeometry(110, 186, 110);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0xd29ab4, transparent: true, opacity: 0.22, side: THREE.DoubleSide, fog: false, depthWrite: false
    }));
    ring.position.copy(planet.position);
    ring.rotation.set(1.32, 0.18, 0.35);
    scene.add(ring);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.glowMag, color: 0xff6a9e, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    }));
    glow.position.set(-250, 92, -490);
    glow.scale.setScalar(380);
    scene.add(glow);

    // moons
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xb6c9de, fog: false });
    for (const [x, y, z, r] of [[220, 120, -300, 12], [160, 30, 240, 7], [-120, 170, 200, 5]]) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), moonMat);
      m.position.set(x, y, z);
      scene.add(m);
    }

    // drifting rocks around arena
    const rockGeos = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
    ];
    for (let i = 0; i < 14; i++) {
      const geo = rockGeos[i % rockGeos.length];
      const r = new THREE.Mesh(geo, this.mats.rock);
      const ang = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const rad = 62 + Math.random() * 55;
      r.position.set(Math.cos(ang) * rad, -24 + Math.random() * 50, Math.sin(ang) * rad);
      const s = 2.5 + Math.random() * 7;
      r.scale.set(s * (0.7 + Math.random() * 0.7), s * (0.5 + Math.random() * 0.5), s * (0.7 + Math.random() * 0.6));
      r.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      r.userData.spin = (Math.random() - 0.5) * 0.04;
      this.decor.push(r);
      scene.add(r);
    }

    // distant orbital debris / broken ring
    const debrisMat = new THREE.MeshBasicMaterial({ color: 0x2a3350, fog: false });
    for (let i = 0; i < 26; i++) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), debrisMat);
      const a = Math.random() * Math.PI * 2;
      const rad = 140 + Math.random() * 120;
      d.position.set(Math.cos(a) * rad, -50 + Math.random() * 150, Math.sin(a) * rad);
      d.scale.set(1 + Math.random() * 9, 1 + Math.random() * 3, 1 + Math.random() * 8);
      d.rotation.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
      scene.add(d);
    }
  }

  buildLights() {
    const scene = this.scene;
    scene.add(new THREE.HemisphereLight(0x8f7bff, 0x241026, 2.05));
    scene.add(new THREE.AmbientLight(0x544a86, 0.7));

    const key = new THREE.DirectionalLight(0xffd9e8, 3.3);
    key.position.set(-38, 58, 26);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -52;
    key.shadow.camera.right = 52;
    key.shadow.camera.top = 52;
    key.shadow.camera.bottom = -52;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 160;
    key.shadow.bias = -0.0008;
    key.shadow.normalBias = 0.03;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xff3f8f, 2.1);
    rim.position.set(40, 26, -44);
    scene.add(rim);

    const cyanFill = new THREE.DirectionalLight(0x3fe9ff, 1.15);
    cyanFill.position.set(30, 12, 30);
    scene.add(cyanFill);

    const gateFill = new THREE.DirectionalLight(0xd7ecff, 0.85);
    gateFill.position.set(-8, 28, 55);
    scene.add(gateFill);

    const pts = [
      [0, 10, 0, 0xffb02e, 300, 34],
      [25, 9, 0, 0x3fe9ff, 185, 28],
      [-25, 9, 0, 0xff2e8a, 185, 28],
      [0, 8, 26, 0xff2e8a, 120, 26],
      [0, 8, -26, 0x3fe9ff, 120, 26],
      [-30, 7, -25, 0x8a6aff, 90, 22],
      [30, 7, 25, 0x3fe9ff, 90, 22],
    ];
    this.lights = [];
    for (const [x, y, z, c, i, d] of pts) {
      const l = new THREE.PointLight(c, i, d, 2);
      l.position.set(x, y, z);
      scene.add(l);
      this.lights.push(l);
    }
  }

  box(x, y, z, w, h, d, mat, { solid = true, cast = true, receive = true, ray = true } = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    this.scene.add(mesh);
    if (solid) {
      this.colliders.push(new THREE.Box3(V(x - w / 2, y - h / 2, z - d / 2), V(x + w / 2, y + h / 2, z + d / 2)));
    }
    if (ray) this.meshes.push(mesh);
    return mesh;
  }

  trim(x, y, z, w, h, d, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    this.scene.add(m);
    this.decor.push(m);
    return m;
  }

  cyl(x, y, z, r, h, mat, { solid = false, seg = 32, cast = true } = {}) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    this.scene.add(m);
    if (solid) this.colliders.push(new THREE.Box3(V(x - r, y - h / 2, z - r), V(x + r, y + h / 2, z + r)));
    this.meshes.push(m);
    return m;
  }

  buildArena() {
    const M = this.mats;

    // main deck
    this.box(0, -1, 0, 74, 2, 74, M.floor, { cast: true });
    // understructure
    this.box(0, -2.4, 0, 66, 1.4, 66, M.darker, { cast: false });
    for (let i = -3; i <= 3; i++) {
      this.box(i * 10, -4.4, 0, 2.2, 2.8, 62, M.dark, { cast: false });
      this.box(0, -4.4, i * 10, 62, 2.8, 2.2, M.dark, { cast: false });
    }
    this.trim(0, -6.2, 0, 40, 1.2, 40, M.hull);
    // edge trims + hazard corners
    for (const s of [-1, 1]) {
      this.trim(0, 0.045, s * 36.8, 74, 0.09, 0.24, s > 0 ? M.mag : M.cyan);
      this.trim(s * 36.8, 0.045, 0, 0.24, 0.09, 74, s > 0 ? M.cyan : M.mag);
      for (let i = -3; i <= 3; i++) {
        this.trim(i * 9.5, 0.05, s * 33.5, 4.2, 0.08, 0.5, M.hazard);
        this.trim(s * 33.5, 0.05, i * 9.5, 0.5, 0.08, 4.2, M.hazard);
      }
    }
    // deck inset glow strips
    for (const s of [-1, 1]) {
      this.trim(s * 12, 0.03, 0, 0.12, 0.06, 46, M.cyan);
      this.trim(0, 0.03, s * 12, 46, 0.06, 0.12, M.mag);
    }

    // ---- central platform ----
    this.box(0, 3.85, 0, 15.4, 1.1, 15.4, M.wall);
    this.cyl(0, 4.0, 0, 8.2, 0.7, M.hull, { cast: true });
    this.cyl(0, 4.44, 0, 7.95, 0.14, M.dark, { cast: false, seg: 48 });
    // platform face lights
    for (const s of [-1, 1]) {
      this.trim(0, 4.32, s * 7.73, 14.6, 0.11, 0.05, M.cyan, { cast: false });
      this.trim(0, 3.42, s * 7.73, 14.6, 0.08, 0.05, s > 0 ? M.mag : M.amber, { cast: false });
      this.trim(s * 7.73, 3.87, 0, 0.05, 0.9, 14.6, M.mag, { cast: false });
      for (let i = -2; i <= 2; i++) {
        this.trim(i * 2.9, 3.87, s * 7.74, 0.12, 0.64, 0.03, i % 2 ? M.mag : M.cyan, { cast: false });
      }
      // hazard chevrons on the face
      this.trim(0, 3.6, s * 7.75, 3.2, 0.18, 0.02, M.hazard, { cast: false });
    }
    // under-platform glow
    const underGlow = new THREE.PointLight(0x3fe9ff, 130, 22, 2);
    underGlow.position.set(0, 2.4, 5);
    this.scene.add(underGlow);
    this.lights.push(underGlow);
    // legs
    for (const [x, z] of [[-5.6, -5.6], [5.6, -5.6], [-5.6, 5.6], [5.6, 5.6]]) {
      this.box(x, 1.75, z, 1.5, 3.5, 1.5, M.dark);
      this.trim(x, 0.25, z, 1.9, 0.5, 1.9, M.cyan);
    }
    // platform rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.05, 0.075, 6, 64), M.cyan);
    ring1.rotation.x = Math.PI / 2; ring1.position.y = 4.46; this.scene.add(ring1); this.decor.push(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.05, 6, 64), M.mag);
    ring2.rotation.x = Math.PI / 2; ring2.position.y = 4.49; this.scene.add(ring2); this.decor.push(ring2);
    // staircases (+x and -x)
    for (const s of [-1, 1]) {
      const steps = 7;
      for (let i = 0; i < steps; i++) {
        const top = 4.44 * (i + 1) / steps;
        const x = s * (8.0 + (steps - i - 0.5) * 0.82);
        this.box(x, top / 2, 0, 0.82, top, 3.9, M.wall);
        this.trim(x, top + 0.015, 0, 0.82, 0.03, 3.9, M.cyan, { cast: false });
      }
      // side rails for stair
      for (let i = 0; i < steps; i += 2) {
        const top = 4.44 * (i + 1) / steps;
        const x = s * (8.0 + (steps - i - 0.5) * 0.82);
        this.trim(x, top + 0.45, 1.95, 0.6, 0.06, 0.06, M.cyan);
        this.trim(x, top + 0.45, -1.95, 0.6, 0.06, 0.06, M.cyan);
      }
    }
    // under-platform cover ring
    for (const [x, z, w, d] of [[0, -6.6, 7, 1.2], [0, 6.6, 7, 1.2], [-6.6, 0, 1.2, 7], [6.6, 0, 1.2, 7]]) {
      this.box(x, 1.1, z, w, 2.2, d, M.dark);
    }
    // central pedestal + emblem
    this.cyl(0, 4.62, 0, 1.5, 0.36, M.dark, { cast: false, seg: 24 });
    const emblem = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.35, 6), M.amber);
    emblem.rotation.x = -Math.PI / 2; emblem.position.y = 4.82; this.scene.add(emblem); this.decor.push(emblem);

    // hologram above center
    const holoTex = hologramTexture('VOID', 'ARENA 04');
    this.holoMat = new THREE.MeshBasicMaterial({ map: holoTex, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const holo = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), this.holoMat);
    holo.position.set(0, 9.6, 0);
    this.scene.add(holo);
    this.holo = holo;
    const holoRing = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.05, 5, 48), M.cyan);
    holoRing.position.y = 9.6;
    this.scene.add(holoRing);
    this.holoRing = holoRing;

    // ---- side bastions ----
    for (const s of [-1, 1]) {
      this.box(s * 25, 2.8, 0, 11, 5.6, 11, M.wall);
      this.box(s * 25, 5.75, 0, 12, 0.3, 12, M.hull);
      this.trim(s * 25, 5.93, 0, 11.4, 0.06, 0.18, M.cyan);
      // vertical columns
      for (const zz of [-4.6, 4.6]) {
        this.box(s * 25 + (s > 0 ? 4.9 : -4.9), 2.8, zz, 0.55, 5.6, 0.55, M.dark);
        this.trim(s * 25 + (s > 0 ? 4.9 : -4.9), 3.1, zz, 0.62, 3.3, 0.08, s > 0 ? M.cyan : M.mag);
      }
      // roof cover
      this.box(s * 25, 6.4, -3.7, 3.4, 1.1, 1.1, M.dark);
      this.box(s * 25, 6.4, 3.7, 3.4, 1.1, 1.1, M.dark);
      this.trim(s * 25, 7.0, 0, 0.7, 0.6, 0.7, s > 0 ? M.cyan : M.mag);
      // side holo stripe
      this.trim(s * 19.42, 2.8, 0, 0.06, 5.0, 8.8, s > 0 ? M.mag : M.cyan, { cast: false });
      // ground glow base
      this.trim(s * 25, 0.06, 0, 12.6, 0.08, 0.35, s > 0 ? M.cyan : M.mag);
    }

    // ---- corner cover blocks ----
    for (const [x, z] of [[-17, -17], [17, -17], [-17, 17], [17, 17]]) {
      this.box(x, 1.6, z, 5.2, 3.2, 5.2, M.wall);
      this.box(x, 3.3, z, 5.4, 0.25, 5.4, M.dark);
      this.trim(x, 3.47, z, 5.0, 0.06, 0.16, (x * z > 0) ? M.cyan : M.mag);
      this.trim(x, 0.25, z - 2.62 * Math.sign(z || 1), 4.2, 0.4, 0.03, M.hazard, { cast: false });
      this.trim(x + 2.62 * Math.sign(x || 1), 0.25, z, 0.03, 0.4, 4.2, M.hazard, { cast: false });
      // corner light spike
      this.box(x + 2.4 * Math.sign(x || 1), 4.1, z + 2.4 * Math.sign(z || 1), 0.4, 1.6, 0.4, M.dark);
      this.trim(x + 2.4 * Math.sign(x || 1), 5.0, z + 2.4 * Math.sign(z || 1), 0.5, 0.1, 0.5, M.amber);
    }

    // ---- mid-field pillars ----
    for (const [x, z] of [[-10.5, -10.5], [10.5, -10.5], [-10.5, 10.5], [10.5, 10.5]]) {
      this.box(x, 2.5, z, 1.5, 5, 1.5, M.dark);
      this.trim(x, 5.05, z, 1.7, 0.12, 1.7, this.mats.cyan);
      this.trim(x, 0.15, z, 1.7, 0.3, 1.7, this.mats.mag);
    }

    // ---- outer lane walls ----
    for (const s of [-1, 1]) {
      this.box(-29, 1.15, s * 18, 1.3, 2.3, 9, M.wall);
      this.box(29, 1.15, s * 18, 1.3, 2.3, 9, M.wall);
      this.trim(-29, 2.35, s * 18, 1.4, 0.08, 9, s > 0 ? M.mag : M.cyan);
      this.trim(29, 2.35, s * 18, 1.4, 0.08, 9, s > 0 ? M.cyan : M.mag);
      // low barricades
      this.box(-13, 0.65, s * 26, 6.5, 1.3, 1.1, M.dark);
      this.box(13, 0.65, s * 26, 6.5, 1.3, 1.1, M.dark);
      this.trim(-13, 1.33, s * 26, 6.5, 0.05, 0.16, s > 0 ? M.cyan : M.mag);
      this.trim(13, 1.33, s * 26, 6.5, 0.05, 0.16, s > 0 ? M.mag : M.cyan);
    }

    // ---- foreground spawn cover ----
    for (const s of [-1, 1]) {
      this.box(s * 5.6, 0.62, 17.4, 2.4, 1.24, 2.6, M.wall);
      this.trim(s * 5.6, 1.26, 17.4, 2.5, 0.05, 2.7, s > 0 ? M.cyan : M.mag);
      this.trim(s * 5.6, 0.5, 16.1, 1.8, 0.22, 0.03, M.hazard, { cast: false });
      // barrel cluster
      for (let i = 0; i < 2; i++) {
        this.cyl(s * (8.2 + i * 0.7), 0.5, 20 + i * 0.6, 0.42, 1.0, M.dark, { cast: true, seg: 12 });
        this.trim(s * (8.2 + i * 0.7), 1.02, 20 + i * 0.6, 0.86, 0.05, 0.86, i ? M.mag : M.amber);
      }
      // spawn pylon
      this.box(s * 9.5, 2.4, 25.5, 0.7, 4.8, 0.7, M.dark);
      this.trim(s * 9.5, 4.7, 25.5, 0.8, 0.16, 0.8, s > 0 ? M.mag : M.cyan);
    }

    // ---- floor lane guides ----
    for (const s of [-1, 1]) {
      this.trim(s * 5.2, 0.025, 19, 0.1, 0.05, 22, s > 0 ? M.cyan : M.mag, { cast: false });
      this.trim(s * 13.2, 0.025, 15, 0.07, 0.05, 26, s > 0 ? M.mag : M.cyan, { cast: false });
    }

    // ---- entry arch (-z) ----
    const gateZ = -33.5;
    this.box(-10.5, 6.5, gateZ, 2.6, 13, 2.6, M.wall);
    this.box(10.5, 6.5, gateZ, 2.6, 13, 2.6, M.wall);
    this.box(0, 12.2, gateZ, 23.6, 2.4, 2.8, M.hull);
    this.trim(0, 11.05, gateZ + 1.42, 18, 0.18, 0.05, M.cyan);
    this.trim(-10.5, 3.2, gateZ + 1.32, 0.12, 9.4, 0.05, M.mag);
    this.trim(10.5, 3.2, gateZ + 1.32, 0.12, 9.4, 0.05, M.cyan);
    // gate sign
    const signTex = hologramTexture('TRIBES', 'VOID ARENA');
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 4.75), new THREE.MeshBasicMaterial({
      map: signTex, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    }));
    sign.position.set(0, 9.4, gateZ + 1.5);
    this.scene.add(sign);
    this.sign = sign;
    // arch lights
    for (const x of [-10.5, 10.5]) {
      this.trim(x, 12.2, gateZ + 1.5, 0.25, 2.4, 0.08, x > 0 ? M.cyan : M.mag);
    }

    // ---- hanging banners on sides ----
    for (const [x, z, c] of [[-36, 14, 0], [-36, -14, 1], [36, 14, 1], [36, -14, 0]]) {
      const banner = this.box(x, 6.0, z, 0.25, 8.5, 5.4, M.dark, { solid: false, cast: false });
      const strip = this.trim(x + (x > 0 ? -0.14 : 0.14), 6.0, z, 0.02, 8.1, 0.18, c ? M.cyan : M.mag);
      this.trim(x, 10.3, z, 0.3, 0.3, 5.8, c ? M.cyan : M.mag, { cast: false });
    }

    // ---- floating support drones / lights ----
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.25;
      const r = 41;
      const drone = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 0.7), M.dark);
      body.castShadow = true;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), i % 2 ? M.mag : M.cyan);
      eye.position.z = 0.36;
      drone.add(body, eye);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({
        map: i % 2 ? this.glowMag : this.glowCyan, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      spr.scale.setScalar(2.4);
      drone.add(spr);
      drone.position.set(Math.cos(a) * r, 11 + (i % 3) * 3, Math.sin(a) * r);
      drone.userData = { a, r, baseY: drone.position.y, i };
      this.scene.add(drone);
      this.decor.push(drone);
      this.drones = this.drones || [];
      this.drones.push(drone);
    }

    // horizon arena spires (decor only)
    for (const [x, z, h] of [[-70, -80, 40], [80, -60, 30], [90, 60, 46], [-85, 70, 26]]) {
      this.box(x, h / 2 - 12, z, 8, h, 8, M.dark, { solid: false, cast: false });
      this.trim(x, h - 12, z, 9, 0.4, 9, M.cyan);
    }
  }

  buildPickups() {
    const defs = [
      ['quad', 0, 5.05, 0],
      ['mega', 0, 0.95, 0],
      ['health', -20, 0.95, 20],
      ['health', 20, 0.95, -20],
      ['health', 0, 0.95, 27],
      ['armor', 20, 0.95, 20],
      ['armor', -20, 0.95, -20],
      ['armor', 0, 0.95, -27],
      ['rockets', -18, 0.95, 0],
      ['rockets', 18, 0.95, 0],
      ['rails', 0, 0.95, 20],
      ['rails', 0, 0.95, -20],
      ['discs', 14, 0.95, 14],
      ['discs', -14, 0.95, -14],
    ];
    // pickups on bastion roofs
    defs.push(['rails', 25, 6.95, 0]);
    defs.push(['rockets', -25, 6.95, 0]);
    for (const [type, x, y, z] of defs) this.addPickup(type, V(x, y, z));
  }

  addPickup(type, pos) {
    const M = this.mats;
    const g = new THREE.Group();
    g.position.copy(pos);
    const spin = new THREE.Group();
    g.add(spin);
    let lightColor = 0x51ffb0;
    let lightScale = 2.1;
    let respawn = 18;
    let label = type;

    if (type === 'health') {
      const mat = new THREE.MeshBasicMaterial({ color: 0xff3b5c });
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.3), mat);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.95, 0.3), mat);
      spin.add(a, b);
      lightColor = 0xff3b5c;
    } else if (type === 'mega') {
      const mat = new THREE.MeshBasicMaterial({ color: 0x8affd0 });
      const a = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.45), mat);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.5, 0.45), mat);
      spin.add(a, b);
      const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), new THREE.MeshBasicMaterial({ color: 0x51ffb0, wireframe: true, transparent: true, opacity: 0.6 }));
      orb.scale.setScalar(1.5);
      spin.add(orb);
      lightColor = 0x51ffb0; lightScale = 3.4; respawn = 32;
    } else if (type === 'armor') {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), new THREE.MeshStandardMaterial({ color: 0x58ffe0, emissive: 0x1a9a7a, emissiveIntensity: 2, metalness: 0.3, roughness: 0.25 }));
      m.scale.set(0.85, 1.25, 0.55);
      spin.add(m);
      const w = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, 0), new THREE.MeshBasicMaterial({ color: 0xacfff0, wireframe: true, transparent: true, opacity: 0.55 }));
      w.scale.set(0.85, 1.25, 0.55);
      spin.add(w);
      lightColor = 0x51ffb0; lightScale = 2.4;
    } else if (type === 'rockets') {
      for (let i = -1; i <= 1; i++) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.85, 8), new THREE.MeshStandardMaterial({ color: 0xffb02e, emissive: 0xff6a00, emissiveIntensity: 1.4, roughness: 0.4, metalness: 0.6 }));
        m.position.set(i * 0.3, 0, 0);
        m.rotation.z = i * 0.2;
        spin.add(m);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 8), new THREE.MeshBasicMaterial({ color: 0xffe0a0 }));
        tip.position.set(i * 0.3, 0.55, 0);
        spin.add(tip);
      }
      lightColor = 0xffb02e; respawn = 14;
    } else if (type === 'rails') {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.15, 6), new THREE.MeshStandardMaterial({ color: 0x65f4ff, emissive: 0x22c7ff, emissiveIntensity: 2.4, metalness: 0.7, roughness: 0.2 }));
      spin.add(m);
      for (const yy of [-0.32, 0.32]) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 5, 16), M.cyan);
        r.rotation.x = Math.PI / 2; r.position.y = yy; spin.add(r);
      }
      lightColor = 0x3fe9ff; respawn = 16;
    } else if (type === 'discs') {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 22), new THREE.MeshStandardMaterial({ color: 0x8fe9ff, emissive: 0x2a9fc4, emissiveIntensity: 1.8, metalness: 0.75, roughness: 0.25 }));
      disc.rotation.x = Math.PI / 2;
      spin.add(disc);
      for (const d of [0, Math.PI / 2]) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.02, 4, 24), M.cyan);
        r.rotation.y = d;
        spin.add(r);
      }
      lightColor = 0x59c8ff; respawn = 15;
    } else if (type === 'quad') {
      const mat = new THREE.MeshStandardMaterial({ color: 0xffc24d, emissive: 0xff6a00, emissiveIntensity: 2.5, metalness: 0.6, roughness: 0.22 });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), mat);
      spin.add(core);
      const w = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), new THREE.MeshBasicMaterial({ color: 0xffe0a0, wireframe: true, transparent: true, opacity: 0.7 }));
      spin.add(w);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25 + i * 0.24, 0.035, 5, 48), i === 1 ? M.mag : M.amber);
        ring.rotation.set(i * 0.9, i * 1.4, 0);
        spin.add(ring);
      }
      lightColor = 0xffb02e; lightScale = 4.4; respawn = 38; label = 'quad';
    }

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: type === 'quad' || type === 'rockets' ? this.glowAmber : type === 'health' ? this.glowMag : this.glowCyan,
      transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    glow.scale.setScalar(lightScale);
    g.add(glow);

    // ground ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(type === 'quad' ? 1.65 : 1.0, 0.045, 4, 32), new THREE.MeshBasicMaterial({
      color: lightColor, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending
    }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -(pos.y - 0.08);
    g.add(ring);

    const light = new THREE.PointLight(lightColor, type === 'quad' ? 22 : 7, 7, 2);
    light.position.y = 0.6;
    g.add(light);

    this.scene.add(g);
    const pickup = {
      type, label, group: g, spin, glow, ring, light,
      position: pos.clone(), baseY: pos.y,
      active: true, timer: 0, respawn, phase: Math.random() * 6,
      bob: 0.16,
    };
    this.pickups.push(pickup);
    return pickup;
  }

  buildPads() {
    const defs = [
      { x: -14, z: 0, launch: V(-9.8, 20.5, 0), color: 0xff2e8a },
      { x: 14, z: 0, launch: V(9.8, 20.5, 0), color: 0x3fe9ff },
      { x: 0, z: 16, launch: V(0, 18.5, -8.2), color: 0x3fe9ff },
      { x: 0, z: -16, launch: V(0, 18.5, 8.2), color: 0xff2e8a },
    ];
    for (const d of defs) {
      const g = new THREE.Group();
      g.position.set(d.x, 0.02, d.z);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.55, 0.22, 32), this.mats.dark);
      base.receiveShadow = true; base.position.y = 0.11;
      const topMat = new THREE.MeshBasicMaterial({
        map: padTexture(), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
        color: d.color
      });
      const top = new THREE.Mesh(new THREE.CircleGeometry(2.15, 40), topMat);
      top.rotation.x = -Math.PI / 2; top.position.y = 0.235;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.07, 6, 48), new THREE.MeshBasicMaterial({ color: d.color }));
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.24;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.035, 4, 32), new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
      ring.rotation.x = Math.PI / 2; ring.position.y = 1.1;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.glowCyan, color: d.color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      glow.position.y = 0.5; glow.scale.setScalar(4.2);
      g.add(base, top, rim, ring, glow);
      this.scene.add(g);
      this.jumpPads.push({
        position: V(d.x, 0.2, d.z), radius: 2.2, launch: d.launch,
        group: g, ring, top, glow, cooldown: 0, color: d.color
      });
      // danger marking around pad
      this.trim(d.x, 0.04, d.z, 6.4, 0.05, 0.12, new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.3 }), { cast: false });
    }
  }

  buildSpawns() {
    const pts = [
      [0, 22], [0, 29], [0, -29], [29, 0], [-29, 0],
      [22, 22], [-22, 22], [22, -22], [-22, -22],
      [15, 0], [-15, 0], [0, 15], [0, -15],
    ];
    for (const [x, z] of pts) {
      if (Math.abs(x) < 9 && Math.abs(z) < 9) continue;
      const yaw = Math.atan2(-(0 - x), -(0 - z));
      this.spawnPoints.push({ pos: V(x, 0.06, z), yaw });
      // spawn marker decal
      this.trim(x, 0.04, z, 1.5, 0.04, 1.5, new THREE.MeshBasicMaterial({ color: 0x3fe9ff, transparent: true, opacity: 0.22 }), { cast: false });
    }
    // nav points
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.navPoints.push(V(Math.cos(a) * 26, 0.1, Math.sin(a) * 26));
    }
    this.navPoints.push(V(0, 0.1, 10), V(0, 0.1, -10), V(10, 0.1, 0), V(-10, 0.1, 0));
    this.navPoints.push(V(25, 6.0, 0), V(-25, 6.0, 0), V(0, 4.6, 0));
  }

  buildDust() {
    const N = 240;
    const pos = new Float32Array(N * 3);
    const seeds = [];
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      seeds.push(0.2 + Math.random() * 0.8);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dust = new THREE.Points(g, new THREE.PointsMaterial({
      map: this.glowCyan, color: 0x7cdfff, size: 0.28, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    this.dust.userData.seeds = seeds;
    this.scene.add(this.dust);
  }

  resetPickups() {
    for (const p of this.pickups) {
      p.active = true; p.timer = 0;
      p.group.visible = true;
    }
  }

  update(dt, time) {
    this.time = time;
    // pickups
    for (const p of this.pickups) {
      if (!p.active) {
        p.timer -= dt;
        if (p.timer <= 0) {
          p.active = true;
          p.group.visible = true;
          if (p.type === 'quad') { /* handled by game */ }
        }
        continue;
      }
      p.spin.rotation.y += dt * (p.type === 'quad' ? 0.9 : 1.6);
      p.spin.rotation.x = Math.sin(time * 0.7 + p.phase) * 0.18;
      p.spin.position.y = Math.sin(time * 1.5 + p.phase) * (p.bob + (p.type === 'quad' ? 0.14 : 0));
      p.ring.rotation.z += dt * 0.5;
      if (p.glow) p.glow.material.opacity = 0.55 + Math.sin(time * 2.4 + p.phase) * 0.18;
      if (p.light) p.light.intensity = (p.type === 'quad' ? 20 : 6) + Math.sin(time * 3 + p.phase) * 2;
    }
    // jump pads
    for (const pad of this.jumpPads) {
      pad.cooldown = Math.max(0, pad.cooldown - dt);
      pad.ring.rotation.z += dt * 1.7;
      pad.ring.position.y = 0.8 + Math.sin(time * 2 + pad.position.x) * 0.3;
      pad.top.material.opacity = 0.72 + Math.sin(time * 5 + pad.position.z) * 0.18;
      const s = 4.2 + Math.sin(time * 2.2 + pad.position.x) * 0.5;
      pad.glow.scale.setScalar(s);
    }
    // hologram
    if (this.holo) {
      this.holo.rotation.y = Math.sin(time * 0.18) * 0.55 + 0.2;
      this.holo.position.y = 9.6 + Math.sin(time * 0.8) * 0.15;
      this.holoMat.opacity = 0.55 + Math.sin(time * 7) * 0.08 + Math.sin(time * 1.6) * 0.1;
    }
    if (this.holoRing) {
      this.holoRing.rotation.x = 0.3 + Math.sin(time * 0.4) * 0.15;
      this.holoRing.rotation.z += dt * 0.3;
    }
    if (this.sign) this.sign.material.opacity = 0.7 + Math.sin(time * 2.2) * 0.12;
    // drones
    if (this.drones) for (const d of this.drones) {
      const a = d.userData.a + time * 0.08;
      d.position.x = Math.cos(a) * d.userData.r;
      d.position.z = Math.sin(a) * d.userData.r;
      d.position.y = d.userData.baseY + Math.sin(time * 0.9 + d.userData.i) * 1.2;
      d.lookAt(0, d.position.y, 0);
    }
    // dust
    if (this.dust) {
      const arr = this.dust.geometry.attributes.position.array;
      const seeds = this.dust.userData.seeds;
      for (let i = 0; i < seeds.length; i++) {
        arr[i * 3 + 1] += dt * (0.25 + seeds[i] * 0.4);
        if (arr[i * 3 + 1] > 32) arr[i * 3 + 1] = 0;
      }
      this.dust.geometry.attributes.position.needsUpdate = true;
    }
    // sky slowly rotates
    this.sky.rotation.y += dt * 0.0015;
    for (const r of this.decor) if (r.userData.spin) r.rotation.y += r.userData.spin * dt * 10;
  }

  // --------- physics helpers ----------
  overlaps(pos, radius, height) {
    const minY = pos.y, maxY = pos.y + height;
    for (const b of this.colliders) {
      if (pos.x + radius > b.min.x && pos.x - radius < b.max.x &&
          pos.z + radius > b.min.z && pos.z - radius < b.max.z &&
          maxY > b.min.y + 0.02 && minY < b.max.y - 0.02) return b;
    }
    return null;
  }

  groundHeight(x, z, y) {
    let top = -Infinity;
    for (const b of this.colliders) {
      if (x > b.min.x && x < b.max.x && z > b.min.z && z < b.max.z) {
        if (b.max.y <= y + 0.12 && b.max.y > top) top = b.max.y;
      }
    }
    return top;
  }

  collideSphere(point, radius) {
    for (const b of this.colliders) {
      const cx = Math.max(b.min.x, Math.min(point.x, b.max.x));
      const cy = Math.max(b.min.y, Math.min(point.y, b.max.y));
      const cz = Math.max(b.min.z, Math.min(point.z, b.max.z));
      const dx = point.x - cx, dy = point.y - cy, dz = point.z - cz;
      if (dx * dx + dy * dy + dz * dz < radius * radius) return true;
    }
    return false;
  }

  raycast(origin, dir, far = 200) {
    this.raycaster.set(origin, dir);
    this.raycaster.far = far;
    const hits = this.raycaster.intersectObjects(this.meshes, false);
    return hits.length ? hits[0] : null;
  }

  segmentBlocked(a, b) {
    const d = b.clone().sub(a);
    const len = d.length();
    if (len < 0.001) return false;
    const hit = this.raycast(a, d.normalize(), len - 0.1);
    return !!hit;
  }
}

// Shared capsule-ish movement for player and bots.
export function moveBody(body, world, dt, { stepHeight = 0.55, gravity = 26 } = {}) {
  const pos = body.position;
  const vel = body.velocity;
  const radius = body.radius;
  const height = body.height;
  let grounded = false;

  // horizontal, axis separated with step-up
  for (const axis of ['x', 'z']) {
    if (Math.abs(vel[axis]) < 0.0001) continue;
    const amount = vel[axis] * dt;
    const old = pos[axis];
    pos[axis] += amount;
    if (world.overlaps(pos, radius, height)) {
      // try step up
      const oldY = pos.y;
      pos.y += stepHeight;
      if (!world.overlaps(pos, radius, height)) {
        // keep lifted position, will settle on the step
      } else {
        pos.y = oldY;
        pos[axis] = old;
        // step out a hair to avoid sticking
        pos[axis] += Math.sign(amount) * 0.001;
        vel[axis] = 0;
      }
    }
  }

  // vertical
  vel.y -= gravity * dt;
  if (vel.y < -60) vel.y = -60;
  const oldY = pos.y;
  pos.y += vel.y * dt;
  const hit = world.overlaps(pos, radius, height);
  if (hit) {
    if (vel.y <= 0) {
      pos.y = hit.max.y;
      grounded = true;
      if (body.onLand && vel.y < -3) body.onLand(-vel.y);
    } else {
      pos.y = hit.min.y - height;
    }
    vel.y = 0;
  }
  // ground probe (standing still / step edges)
  if (!grounded && Math.abs(vel.y) < 0.5) {
    const top = world.groundHeight(pos.x, pos.z, pos.y + 0.12);
    if (top > -Infinity && pos.y - top < 0.12) {
      pos.y = top;
      grounded = true;
    }
  }

  // world bounds / kill floor
  body.grounded = grounded;
  if (pos.y < -24) body.fellOut = true;
  return grounded;
}
