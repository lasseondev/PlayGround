/* NEON HEAT — core: renderer, vehicles, effects */
(function () {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) {
    document.body.innerHTML = '<div style="color:#fff;font:16px sans-serif;padding:40px">Three.js failed to load.</div>';
    return;
  }

  const $ = id => document.getElementById(id);
  const isTouch = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window);
  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const wrapAngle = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------------- renderer ----------------
  const canvas = $('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1600);
  camera.position.set(10, 8, 160);

  const audio = new window.GameAudio();
  const world = window.NeonWorld.buildWorld(scene);
  const glowTexture = window.NeonWorld.makeGlowTexture();
  const m4 = window.NeonWorld.m4;
  const mergeColored = window.NeonWorld.mergeColored;

  // ---------------- state ----------------
  const G = {
    state: 'menu',            // menu | play | paused | wrecked
    heat: 2,
    cash: 0,
    deliveries: 0,
    best: 0,
    timer: 110,
    cooling: 0,
    nitro: 100,
    nitroActive: false,
    shake: 0,
    wreckTimer: 0,
    busted: false,
    menuAngle: 0,
    time: 0,
    lastCrashSound: 0,
    pedHeatCooldown: 0,
    drop: new THREE.Vector3(),
    deathPos: new THREE.Vector3(),
    copSpawnTimer: 0,
    pickupSpawnTimer: 0,
    trafficRespawn: 0,
    startTime: 0
  };

  const player = {
    mode: 'car',              // car | foot
    car: null,
    footPos: new THREE.Vector3(),
    footHeading: Math.PI,
    camYaw: Math.PI,
    camPitch: 0.34,
    walkPhase: 0,
    bustTimer: 0
  };

  const input = {
    throttle: 0, steer: 0, handbrake: false, nitro: false, brake: false,
    touchBrake: false, touchNitro: false, joyActive: false, joyX: 0, joyY: 0
  };

  const cars = { traffic: [], cops: [], parked: [] };
  const trafficSpawns = [];
  const cops = cars.cops;

  // ---------------- UI helpers ----------------
  const toastBox = $('toasts');
  function toast(text, cls) {
    const el = document.createElement('div');
    el.className = 'toast ' + (cls || '');
    el.textContent = text;
    toastBox.appendChild(el);
    while (toastBox.children.length > 3) toastBox.firstChild.remove();
    setTimeout(() => el.remove(), 2650);
  }
  let centerTimer = null;
  function showCenter(text, sub, color) {
    const el = $('center-msg');
    el.innerHTML = '';
    const main = document.createElement('div');
    main.textContent = text;
    if (color) main.style.color = color;
    el.appendChild(main);
    if (sub) {
      const s = document.createElement('small');
      s.textContent = sub;
      el.appendChild(s);
    }
    el.classList.add('show');
    clearTimeout(centerTimer);
    centerTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }
  let flashTimer = null;
  function flashDamage(strength) {
    const el = $('flash');
    el.style.opacity = strength || 0.55;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { el.style.opacity = 0; }, 90);
  }

  // ---------------- car geometry ----------------
  const CAR_GEO = {};
  const BODY_WHITE = 0xffffff;
  const TRIM_DARK = 0x16161c;
  const TIRE = 0x0a0a0e;
  const RIM = 0x8f95a3;

  function addBox(list, w, h, d, x, y, z, c, rx, ry, rz) {
    list.push({ g: new THREE.BoxGeometry(w, h, d), m: m4(x, y, z, rx || 0, ry || 0, rz || 0), c });
  }

  function taperedBox(wb, db, wt, dt, h, topZ) {
    const hb = wb / 2, hdb = db / 2, ht = wt / 2, hdt = dt / 2, oz = topZ || 0;
    const v = [
      -hb, 0, -hdb, hb, 0, -hdb, hb, 0, hdb, -hb, 0, hdb,
      -ht, h, -hdt + oz, ht, h, -hdt + oz, ht, h, hdt + oz, -ht, h, hdt + oz
    ];
    const idx = [
      0, 1, 2, 0, 2, 3,
      4, 6, 5, 4, 7, 6,
      0, 4, 5, 0, 5, 1,
      1, 5, 6, 1, 6, 2,
      2, 6, 7, 2, 7, 3,
      3, 7, 4, 3, 4, 0
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  function addTaper(list, wb, db, wt, dt, h, x, y, z, c, topZ) {
    list.push({ g: taperedBox(wb, db, wt, dt, h, topZ), m: m4(x, y, z), c });
  }

  function getCarGeo(type) {
    if (CAR_GEO[type]) return CAR_GEO[type];
    const body = [], glass = [], wheels = [], lights = [];
    let wheelR = 0.4, wheelX = 0.92, wheelZ = 1.42, wheelY = 0.42;

    if (type === 'van') {
      wheelR = 0.46; wheelX = 0.98; wheelZ = 1.55; wheelY = 0.46;
      addBox(body, 2.05, 0.92, 4.9, 0, 0.84, 0, BODY_WHITE);
      addBox(body, 1.9, 0.62, 2.7, 0, 1.5, -0.25, BODY_WHITE);
      addBox(body, 1.84, 0.12, 2.5, 0, 1.85, -0.25, BODY_WHITE);
      addBox(body, 2.08, 0.18, 0.32, 0, 0.5, 2.5, TRIM_DARK);
      addBox(body, 2.08, 0.18, 0.32, 0, 0.5, -2.5, TRIM_DARK);
      addBox(body, 0.14, 0.2, 4.2, 1.0, 0.46, 0, TRIM_DARK);
      addBox(body, 0.14, 0.2, 4.2, -1.0, 0.46, 0, TRIM_DARK);
      addBox(body, 0.2, 0.1, 0.26, 1.04, 1.55, 0.95, TRIM_DARK);
      addBox(body, 0.2, 0.1, 0.26, -1.04, 1.55, 0.95, TRIM_DARK);
      addTaper(glass, 1.96, 2.7, 1.8, 2.0, 0.8, 0, 1.24, -0.2, 0xffffff, -0.08);
    } else if (type === 'sport') {
      wheelR = 0.44; wheelX = 1.0; wheelZ = 1.44; wheelY = 0.45;
      addBox(body, 1.92, 0.5, 4.32, 0, 0.7, 0, BODY_WHITE);
      addBox(body, 1.82, 0.22, 1.45, 0, 0.95, 1.35, BODY_WHITE);
      addBox(body, 1.86, 0.24, 1.0, 0, 0.97, -1.6, BODY_WHITE);
      addBox(body, 1.52, 0.09, 1.42, 0, 1.57, -0.36, BODY_WHITE);
      addBox(body, 2.0, 0.2, 0.3, 0, 0.56, 2.15, TRIM_DARK);
      addBox(body, 2.0, 0.2, 0.3, 0, 0.56, -2.15, TRIM_DARK);
      addBox(body, 0.12, 0.16, 3.6, 0.98, 0.48, 0, TRIM_DARK);
      addBox(body, 0.12, 0.16, 3.6, -0.98, 0.48, 0, TRIM_DARK);
      addBox(body, 1.7, 0.07, 0.36, 0, 1.16, -2.02, TRIM_DARK);
      addBox(body, 0.08, 0.24, 0.08, 0.6, 1.02, -2.0, TRIM_DARK);
      addBox(body, 0.08, 0.24, 0.08, -0.6, 1.02, -2.0, TRIM_DARK);
      addBox(body, 0.22, 0.1, 0.3, 1.02, 1.14, 0.55, TRIM_DARK);
      addBox(body, 0.22, 0.1, 0.3, -1.02, 1.14, 0.55, TRIM_DARK);
      // racing stripe (dark trim)
      addBox(body, 0.36, 0.02, 1.4, 0, 1.07, 1.35, TRIM_DARK);
      addBox(body, 0.36, 0.02, 1.3, 0, 1.57, -0.36, TRIM_DARK);
      addTaper(glass, 1.7, 1.95, 1.32, 1.02, 0.55, 0, 1.0, -0.32, 0xffffff, -0.14);
    } else {
      // sedan / police base
      wheelR = 0.41; wheelX = 1.0; wheelZ = 1.45; wheelY = 0.43;
      addBox(body, 1.92, 0.58, 4.55, 0, 0.76, 0, BODY_WHITE);
      addBox(body, 1.8, 0.2, 1.3, 0, 1.02, 1.5, BODY_WHITE);
      addBox(body, 1.82, 0.22, 1.1, 0, 1.03, -1.6, BODY_WHITE);
      addBox(body, 1.5, 0.1, 1.5, 0, 1.6, -0.22, BODY_WHITE);
      addBox(body, 1.98, 0.22, 0.3, 0, 0.6, 2.24, TRIM_DARK);
      addBox(body, 1.98, 0.22, 0.3, 0, 0.6, -2.24, TRIM_DARK);
      addBox(body, 0.12, 0.18, 3.8, 0.98, 0.52, 0, TRIM_DARK);
      addBox(body, 0.12, 0.18, 3.8, -0.98, 0.52, 0, TRIM_DARK);
      addBox(body, 0.22, 0.1, 0.28, 1.01, 1.2, 0.62, TRIM_DARK);
      addBox(body, 0.22, 0.1, 0.28, -1.01, 1.2, 0.62, TRIM_DARK);
      addTaper(glass, 1.76, 2.1, 1.38, 1.12, 0.58, 0, 1.0, -0.22, 0xffffff, -0.1);
      if (type === 'police') {
        // black hood / trunk / doors for a black-and-white cruiser
        addBox(body, 1.8, 0.03, 1.25, 0, 1.13, 1.5, TRIM_DARK);
        addBox(body, 1.8, 0.03, 1.0, 0, 1.14, -1.62, TRIM_DARK);
        addBox(body, 0.04, 0.4, 1.6, 0.965, 0.82, 0.1, TRIM_DARK);
        addBox(body, 0.04, 0.4, 1.6, -0.965, 0.82, 0.1, TRIM_DARK);
        addBox(body, 1.5, 0.04, 1.5, 0, 1.66, -0.22, TRIM_DARK);
      }
    }

    const positions = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    for (const s of positions) {
      const x = s[0] * wheelX, z = s[1] * wheelZ;
      wheels.push({ g: new THREE.CylinderGeometry(wheelR, wheelR, 0.34, 12), m: m4(x, wheelY, z, 0, 0, Math.PI / 2), c: TIRE });
      wheels.push({ g: new THREE.CylinderGeometry(wheelR * 0.56, wheelR * 0.56, 0.36, 10), m: m4(x, wheelY, z, 0, 0, Math.PI / 2), c: RIM });
    }
    const len = type === 'van' ? 2.5 : (type === 'sport' ? 2.18 : 2.26);
    for (const s of [-1, 1]) {
      addBox(lights, 0.4, 0.15, 0.07, s * 0.6, 0.86, len, 0xfff0c8);
      addBox(lights, 0.46, 0.13, 0.07, s * 0.63, 0.9, -len, 0xff2030);
    }
    CAR_GEO[type] = {
      body: mergeColored(body),
      glass: mergeColored(glass),
      wheels: mergeColored(wheels),
      lights: mergeColored(lights)
    };
    return CAR_GEO[type];
  }

  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0a1220, metalness: 0.92, roughness: 0.12, transparent: true, opacity: 0.88 });
  const wheelMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.2, roughness: 0.78 });
  const lightMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });

  // ---------------- vehicle ----------------
  class Vehicle {
    constructor(o) {
      this.kind = o.kind || 'traffic';
      this.type = o.type || 'sedan';
      this.color = o.color === undefined ? 0x8a8f9a : o.color;
      this.pos = new THREE.Vector3(o.x || 0, 0.02, o.z || 0);
      this.vel = new THREE.Vector3();
      this.heading = o.heading || 0;
      this.steer = 0;
      this.steerTarget = 0;
      this.throttle = 0;
      this.brakeInput = 0;
      this.handbrake = false;
      this.nitroOn = false;
      this.health = o.health === undefined ? 100 : o.health;
      this.maxSpeed = o.maxSpeed === undefined ? (this.type === 'sport' ? 40 : this.type === 'van' ? 30 : 35) : o.maxSpeed;
      this.accel = o.accel === undefined ? (this.type === 'sport' ? 25 : this.type === 'van' ? 18 : 21) : o.accel;
      this.radius = this.type === 'van' ? 2.4 : 2.15;
      this.dead = false;
      this.ai = null;
      this.lateral = 0;
      this.speed = 0;
      this.forwardSpeed = 0;
      this.lastCrash = 0;
      this.smokeT = 0;
      this.skidT = 0;
      this.group = new THREE.Group();
      this.group.rotation.order = 'YXZ';
      this.build();
      this.group.position.copy(this.pos);
      this.group.rotation.y = this.heading;
      scene.add(this.group);
    }

    build() {
      const geo = getCarGeo(this.type);
      this.bodyMat = new THREE.MeshStandardMaterial({
        vertexColors: true, color: new THREE.Color(this.color), metalness: 0.55, roughness: 0.34
      });
      this.bodyMesh = new THREE.Mesh(geo.body, this.bodyMat);
      this.bodyMesh.castShadow = true;
      this.group.add(this.bodyMesh);
      this.group.add(new THREE.Mesh(geo.glass, glassMat));
      this.group.add(new THREE.Mesh(geo.wheels, wheelMat));
      this.group.add(new THREE.Mesh(geo.lights, lightMat));

      if (this.type === 'police') {
        const s = new THREE.Group();
        const rm = new THREE.MeshBasicMaterial({ color: 0xff2030, toneMapped: false });
        const bm = new THREE.MeshBasicMaterial({ color: 0x2060ff, toneMapped: false });
        const rb = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.17, 0.32), rm);
        const bb = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.17, 0.32), bm);
        rb.position.set(-0.38, 1.72, -0.25);
        bb.position.set(0.38, 1.72, -0.25);
        s.add(rb); s.add(bb);
        const rs = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color: 0xff2030, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
        rs.position.set(-0.38, 1.78, -0.25); rs.scale.set(1.8, 1.8, 1);
        const bs = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color: 0x2060ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
        bs.position.set(0.38, 1.78, -0.25); bs.scale.set(1.8, 1.8, 1);
        s.add(rs); s.add(bs);
        this.group.add(s);
        this.siren = { phase: Math.random() * 6.28, redMat: rm, blueMat: bm, redSprite: rs, blueSprite: bs };
      }
    }

    step(dt) {
      if (this.dead) return;
      const before = Math.sin(this.heading), beforeC = Math.cos(this.heading);
      let fwdSpeed = this.vel.x * before + this.vel.z * beforeC;

      this.steer += (this.steerTarget - this.steer) * Math.min(1, dt * 9);

      // engine
      if (this.throttle > 0.01) {
        const a = this.accel * this.throttle * (this.nitroOn ? 1.85 : 1);
        this.vel.x += before * a * dt;
        this.vel.z += beforeC * a * dt;
      } else if (this.throttle < -0.01) {
        if (fwdSpeed > 0.8) {
          const b = Math.min(fwdSpeed, 34 * -this.throttle * dt);
          this.vel.x -= before * b;
          this.vel.z -= beforeC * b;
        } else {
          const a = this.accel * 0.5 * this.throttle;
          this.vel.x += before * a * dt;
          this.vel.z += beforeC * a * dt;
        }
      }

      // brake
      if (this.brakeInput > 0.01) {
        const sp = Math.hypot(this.vel.x, this.vel.z);
        const b = Math.min(sp, 16 * this.brakeInput * dt);
        if (sp > 0.001) { this.vel.x *= (sp - b) / sp; this.vel.z *= (sp - b) / sp; }
      }

      // drag
      let sp = Math.hypot(this.vel.x, this.vel.z);
      const drag = Math.max(0, 1 - (0.24 + sp * 0.0078) * dt);
      this.vel.x *= drag; this.vel.z *= drag;

      // steering
      if (Math.abs(fwdSpeed) > 0.35) {
        const sf = Math.min(1, Math.abs(fwdSpeed) / 8.5);
        const rate = 1.9 - 0.85 * Math.min(1, Math.abs(fwdSpeed) / 42);
        this.heading += this.steer * rate * sf * Math.sign(fwdSpeed) * dt;
      }

      // grip / drift
      const sin = Math.sin(this.heading), cos = Math.cos(this.heading);
      const lat = this.vel.x * cos - this.vel.z * sin;
      this.lateral = lat;
      const grip = this.handbrake ? 1.5 : 8.2;
      const rem = lat * Math.min(1, grip * dt);
      this.vel.x -= cos * rem;
      this.vel.z += sin * rem;

      // speed limits
      sp = Math.hypot(this.vel.x, this.vel.z);
      const max = this.maxSpeed * (this.nitroOn ? 1.3 : 1);
      if (sp > max) { const k = max / sp; this.vel.x *= k; this.vel.z *= k; }
      fwdSpeed = this.vel.x * sin + this.vel.z * cos;
      if (fwdSpeed < -13) {
        const excess = fwdSpeed + 13;
        this.vel.x -= sin * excess;
        this.vel.z -= cos * excess;
      }

      this.pos.x += this.vel.x * dt;
      this.pos.z += this.vel.z * dt;
      this.pos.y = 0.02;
      this.forwardSpeed = fwdSpeed;
      this.speed = Math.hypot(this.vel.x, this.vel.z);

      this.resolveWorld();
      this.syncMesh(dt);
    }

    resolveWorld() {
      const sin = Math.sin(this.heading), cos = Math.cos(this.heading);
      const list = world.queryBuildings(this.pos.x, this.pos.z, 5.5, []);
      const probes = [
        { x: this.pos.x + sin * 1.3, z: this.pos.z + cos * 1.3 },
        { x: this.pos.x - sin * 1.3, z: this.pos.z - cos * 1.3 }
      ];
      const r = 1.16;
      let impact = 0;
      for (let p = 0; p < 2; p++) {
        const px = probes[p].x, pz = probes[p].z;
        for (let i = 0; i < list.length; i++) {
          const c = list[i];
          const cx = clamp(px, c.minX, c.maxX);
          const cz = clamp(pz, c.minZ, c.maxZ);
          const dx = px - cx, dz = pz - cz;
          const d2 = dx * dx + dz * dz;
          if (d2 >= r * r) continue;
          let nx, nz, push;
          if (d2 < 1e-7) {
            const pL = px - c.minX, pR = c.maxX - px, pB = pz - c.minZ, pT = c.maxZ - pz;
            const m = Math.min(pL, pR, pB, pT);
            if (m === pL) { nx = -1; nz = 0; push = pL + r; }
            else if (m === pR) { nx = 1; nz = 0; push = pR + r; }
            else if (m === pB) { nx = 0; nz = -1; push = pB + r; }
            else { nx = 0; nz = 1; push = pT + r; }
          } else {
            const d = Math.sqrt(d2);
            nx = dx / d; nz = dz / d; push = r - d;
          }
          this.pos.x += nx * push;
          this.pos.z += nz * push;
          const vn = this.vel.x * nx + this.vel.z * nz;
          if (vn < 0) {
            this.vel.x -= nx * vn * 1.35;
            this.vel.z -= nz * vn * 1.35;
            impact = Math.max(impact, -vn);
          }
        }
      }
      // world bounds
      const B = world.bound;
      if (this.pos.x > B) { this.pos.x = B; if (this.vel.x > 0) { impact = Math.max(impact, this.vel.x); this.vel.x *= -0.3; } }
      if (this.pos.x < -B) { this.pos.x = -B; if (this.vel.x < 0) { impact = Math.max(impact, -this.vel.x); this.vel.x *= -0.3; } }
      if (this.pos.z > B) { this.pos.z = B; if (this.vel.z > 0) { impact = Math.max(impact, this.vel.z); this.vel.z *= -0.3; } }
      if (this.pos.z < -B) { this.pos.z = -B; if (this.vel.z < 0) { impact = Math.max(impact, -this.vel.z); this.vel.z *= -0.3; } }
      if (impact > 3.5 && NH.onVehicleImpact) NH.onVehicleImpact(this, impact);
    }

    syncMesh(dt) {
      this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
      this.group.rotation.y = this.heading;
      this.group.rotation.z = -this.steer * 0.04 * Math.min(1, this.speed / 18);
      if (this.siren) {
        this.siren.phase += dt * 9;
        const on = Math.sin(this.siren.phase) > 0;
        this.siren.redMat.color.setHex(on ? 0xff2030 : 0x2a0008);
        this.siren.blueMat.color.setHex(on ? 0x101a44 : 0x2060ff);
        this.siren.redSprite.material.opacity = on ? 0.95 : 0.12;
        this.siren.blueSprite.material.opacity = on ? 0.12 : 0.95;
      }
    }

    dispose() {
      scene.remove(this.group);
      if (this.bodyMat) this.bodyMat.dispose();
      if (this.siren) {
        this.siren.redMat.dispose(); this.siren.blueMat.dispose();
        this.siren.redSprite.material.dispose(); this.siren.blueSprite.material.dispose();
      }
    }
  }

  // ---------------- particles ----------------
  function makeSpritePool(count, blending) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const mat = new THREE.SpriteMaterial({
        map: glowTexture, transparent: true, depthWrite: false,
        blending: blending, color: 0xffffff, opacity: 1
      });
      const sp = new THREE.Sprite(mat);
      sp.visible = false;
      scene.add(sp);
      arr.push({ sprite: sp, active: false, vel: new THREE.Vector3(), life: 0, maxLife: 1, size: 1, grow: 1, gravity: 0, opacity: 1, spin: 0 });
    }
    return arr;
  }
  const addPool = makeSpritePool(110, THREE.AdditiveBlending);
  const smokePool = makeSpritePool(70, THREE.NormalBlending);

  function spawnParticle(pool, x, y, z, opts) {
    let p = null;
    for (let i = 0; i < pool.length; i++) if (!pool[i].active) { p = pool[i]; break; }
    if (!p) return;
    p.active = true;
    p.sprite.visible = true;
    p.sprite.position.set(x, y, z);
    p.sprite.material.color.set(opts.color === undefined ? 0xffffff : opts.color);
    p.sprite.material.opacity = opts.opacity === undefined ? 1 : opts.opacity;
    p.sprite.material.rotation = Math.random() * 6.28;
    p.size = opts.size || 1;
    p.sprite.scale.setScalar(p.size);
    p.grow = opts.grow === undefined ? 1 : opts.grow;
    p.gravity = opts.gravity === undefined ? 0 : opts.gravity;
    p.opacity = opts.opacity === undefined ? 1 : opts.opacity;
    p.life = p.maxLife = opts.life || 0.8;
    p.vel.set(opts.vx || 0, opts.vy || 0, opts.vz || 0);
    p.spin = (Math.random() - 0.5) * 2;
  }

  function updateParticles(dt) {
    for (let poolIndex = 0; poolIndex < 2; poolIndex++) {
      const pool = poolIndex ? smokePool : addPool;
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;
        p.life -= dt;
        if (p.life <= 0) { p.active = false; p.sprite.visible = false; continue; }
        p.vel.y += p.gravity * dt;
        p.sprite.position.x += p.vel.x * dt;
        p.sprite.position.y += p.vel.y * dt;
        p.sprite.position.z += p.vel.z * dt;
        const t = 1 - p.life / p.maxLife;
        p.sprite.scale.setScalar(p.size * (1 + p.grow * t));
        p.sprite.material.opacity = p.opacity * (1 - t) * (1 - t);
        p.sprite.material.rotation += p.spin * dt;
      }
    }
  }

  function explosion(pos, big) {
    const n = big ? 30 : 20;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, sp = rand(5, 20);
      spawnParticle(addPool, pos.x, 1, pos.z, {
        color: pick([0xffdf8a, 0xff9a3c, 0xff4a22, 0xfff2c0]),
        size: rand(1.2, 2.8), grow: rand(1.5, 3.5), life: rand(0.35, 0.9),
        vx: Math.cos(a) * sp, vy: rand(3, 15), vz: Math.sin(a) * sp, gravity: -14, opacity: 1
      });
    }
    for (let i = 0; i < (big ? 16 : 9); i++) {
      const a = Math.random() * 6.28, sp = rand(1, 6);
      spawnParticle(smokePool, pos.x, 1.2, pos.z, {
        color: pick([0x2a2a30, 0x3a3a42, 0x1e1e24]),
        size: rand(2, 4.5), grow: rand(2, 4), life: rand(1.0, 2.4),
        vx: Math.cos(a) * sp, vy: rand(1, 6), vz: Math.sin(a) * sp, gravity: 1.2, opacity: 0.55
      });
    }
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * 6.28, sp = rand(8, 26);
      spawnParticle(addPool, pos.x, 1, pos.z, {
        color: 0xffe6a0, size: 0.35, grow: 0, life: rand(0.3, 0.8),
        vx: Math.cos(a) * sp, vy: rand(4, 14), vz: Math.sin(a) * sp, gravity: -25, opacity: 1
      });
    }
    spawnParticle(addPool, pos.x, 1.4, pos.z, { color: 0xfff1c0, size: 4, grow: 3, life: 0.28, opacity: 0.9 });
  }

  function sparks(pos, count) {
    for (let i = 0; i < (count || 8); i++) {
      const a = Math.random() * 6.28, sp = rand(3, 12);
      spawnParticle(addPool, pos.x, rand(0.4, 1.2), pos.z, {
        color: pick([0xffe6a0, 0xffb040, 0xfff8d0]), size: rand(0.12, 0.3), grow: 0, life: rand(0.25, 0.55),
        vx: Math.cos(a) * sp, vy: rand(1, 7), vz: Math.sin(a) * sp, gravity: -22, opacity: 1
      });
    }
  }

  function goldBurst(pos) {
    for (let i = 0; i < 22; i++) {
      const a = Math.random() * 6.28, sp = rand(2, 9);
      spawnParticle(addPool, pos.x, 0.6, pos.z, {
        color: pick([0xffd23c, 0xfff2a0, 0xffaa20]), size: rand(0.25, 0.7), grow: 0.5, life: rand(0.6, 1.4),
        vx: Math.cos(a) * sp, vy: rand(4, 12), vz: Math.sin(a) * sp, gravity: -10, opacity: 1
      });
    }
  }

  function tireSmoke(v) {
    const sin = Math.sin(v.heading), cos = Math.cos(v.heading);
    const rx = cos, rz = -sin;
    const bx = v.pos.x - sin * 1.4, bz = v.pos.z - cos * 1.4;
    for (const side of [-1, 1]) {
      spawnParticle(smokePool, bx + rx * side * 0.85, 0.25, bz + rz * side * 0.85, {
        color: 0x9a96a4, size: 0.9, grow: 2.6, life: 0.55, vx: rand(-1, 1), vy: rand(0.4, 1.2), vz: rand(-1, 1), gravity: 0.2, opacity: 0.35
      });
    }
  }

  // ---------------- skid marks ----------------
  const SKID_MAX = 300;
  const skidGeo = new THREE.PlaneGeometry(0.34, 1.35);
  skidGeo.rotateX(-Math.PI / 2);
  const skidMat = new THREE.MeshBasicMaterial({ color: 0x050409, transparent: true, opacity: 0.4, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const skidMesh = new THREE.InstancedMesh(skidGeo, skidMat, SKID_MAX);
  skidMesh.frustumCulled = false;
  skidMesh.renderOrder = 1;
  const skidDummy = new THREE.Object3D();
  for (let i = 0; i < SKID_MAX; i++) {
    skidDummy.position.set(0, -20, 0); skidDummy.scale.setScalar(0.001); skidDummy.updateMatrix();
    skidMesh.setMatrixAt(i, skidDummy.matrix);
  }
  skidMesh.instanceMatrix.needsUpdate = true;
  scene.add(skidMesh);
  let skidIndex = 0, skidDirty = false;

  function addSkid(v) {
    const sin = Math.sin(v.heading), cos = Math.cos(v.heading);
    const rx = cos, rz = -sin;
    for (const side of [-1, 1]) {
      skidDummy.position.set(v.pos.x - sin * 1.4 + rx * side * 0.86, 0.045, v.pos.z - cos * 1.4 + rz * side * 0.86);
      skidDummy.rotation.set(0, v.heading, 0);
      skidDummy.scale.set(1, 1, 1);
      skidDummy.updateMatrix();
      skidMesh.setMatrixAt(skidIndex, skidDummy.matrix);
      skidIndex = (skidIndex + 1) % SKID_MAX;
    }
    skidDirty = true;
  }

  function updateSkids() {
    if (skidDirty) { skidMesh.instanceMatrix.needsUpdate = true; skidDirty = false; }
  }

  // ---------------- player kit (headlights, nitro flames) ----------------
  function attachPlayerKit(v) {
    if (v.playerKit) { v.playerKit.visible = true; v.headSpot.intensity = 240; return; }
    const kit = new THREE.Group();
    const spot = new THREE.SpotLight(0xffe3b8, 240, 110, 0.5, 0.55, 1.15);
    spot.position.set(0, 1.1, 1.7);
    spot.target.position.set(0, 0.1, 30);
    kit.add(spot);
    kit.add(spot.target);
    v.group.add(kit);
    v.playerKit = kit;
    v.headSpot = spot;

    const flames = new THREE.Group();
    for (const s of [-1, 1]) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture, color: 0x53f6ff, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      sp.position.set(s * 0.55, 0.55, -2.3);
      sp.scale.set(1.1, 2.0, 1);
      flames.add(sp);
    }
    flames.visible = false;
    v.group.add(flames);
    v.flames = flames;
  }

  function setPlayerKit(v, on) {
    if (!v) return;
    if (on) {
      attachPlayerKit(v);
      v.playerKit.visible = true;
      v.headSpot.intensity = 240;
    } else {
      if (v.playerKit) v.playerKit.visible = false;
      if (v.headSpot) v.headSpot.intensity = 0;
      if (v.flames) v.flames.visible = false;
    }
  }

  // ---------------- UI build ----------------
  const wantedEl = $('wanted');
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.textContent = '★';
    wantedEl.appendChild(s);
  }
  const pipsEl = $('nitro-pips');
  for (let i = 0; i < 10; i++) pipsEl.appendChild(document.createElement('i'));

  const NH = {
    THREE, renderer, scene, camera, canvas, world, audio, glowTexture,
    G, player, input, cars, cops, trafficSpawns,
    clamp, lerp, wrapAngle, rand, pick, isTouch,
    toast, showCenter, flashDamage,
    Vehicle, getCarGeo,
    spawnParticle, updateParticles, explosion, sparks, goldBurst, tireSmoke,
    addPool, smokePool,
    addSkid, updateSkids,
    attachPlayerKit, setPlayerKit,
    cameraLook: new THREE.Vector3(),
    camInit: false,
    onVehicleImpact: null,
    hooks: {}
  };
  window.NH = NH;
})();
