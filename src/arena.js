import * as THREE from "three";
import { rand, clamp } from "./utils.js";

const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();

export class Arena {
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.textures = game.textures;
    this.solids = [];
    this.ramps = [];
    this.groundBoxes = [];
    this.raycastTargets = [];
    this.hazards = [];
    this.torches = [];
    this.portals = [];
    this.jumpPads = [];
    this.portalTime = 0;
    this.lavaLights = [];
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 200;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildMaterials();
    this.buildSky();
    this.buildLights();
    this.buildFloor();
    this.buildPlatform();
    this.buildWalls();
    this.buildCatwalk();
    this.buildPillars();
    this.buildCover();
    this.buildLava();
    this.buildPortals();
    this.buildJumpPads();
    this.buildProps();
    this.pickups = new PickupManager(game, this);
    this.spawnPoints = this.portals.map((p) => p.spawn);
  }

  buildMaterials() {
    const t = this.textures;
    this.mat = {
      floor: new THREE.MeshStandardMaterial({
        map: t.floor,
        roughness: 0.9,
        metalness: 0.22,
        color: 0xbfc0c8,
      }),
      stone: new THREE.MeshStandardMaterial({
        map: t.wall,
        roughness: 0.95,
        metalness: 0.08,
        color: 0xa9aab2,
      }),
      stoneHigh: new THREE.MeshStandardMaterial({
        map: t.wallHigh,
        roughness: 0.96,
        metalness: 0.06,
        color: 0x91939d,
      }),
      metal: new THREE.MeshStandardMaterial({
        map: t.metal,
        roughness: 0.48,
        metalness: 0.82,
        color: 0xb4bac6,
      }),
      metalDark: new THREE.MeshStandardMaterial({
        map: t.metalCatwalk,
        roughness: 0.55,
        metalness: 0.78,
        color: 0x707784,
      }),
      blackStone: new THREE.MeshStandardMaterial({
        color: 0x0c0d11,
        roughness: 0.92,
        metalness: 0.14,
      }),
      orangeGlow: new THREE.MeshStandardMaterial({
        color: 0x2a1108,
        emissive: 0xff5a1f,
        emissiveIntensity: 4.2,
        roughness: 0.4,
        metalness: 0.3,
      }),
      cyanGlow: new THREE.MeshStandardMaterial({
        color: 0x071a1e,
        emissive: 0x52e8ff,
        emissiveIntensity: 3.4,
        roughness: 0.35,
        metalness: 0.4,
      }),
      lava: new THREE.MeshStandardMaterial({
        map: t.lava,
        emissiveMap: t.lava,
        emissive: 0xff5a12,
        emissiveIntensity: 2.6,
        color: 0xffffff,
        roughness: 0.65,
        metalness: 0,
      }),
      hazard: new THREE.MeshStandardMaterial({
        map: t.hazard,
        roughness: 0.6,
        metalness: 0.5,
      }),
      emblem: new THREE.MeshBasicMaterial({
        map: t.emblem,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
      banner: new THREE.MeshStandardMaterial({
        map: t.banner,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0,
        alphaTest: 0.15,
      }),
    };
  }

  buildSky() {
    const geo = new THREE.SphereGeometry(280, 48, 32);
    const mat = new THREE.MeshBasicMaterial({
      map: this.textures.sky,
      side: THREE.BackSide,
      fog: false,
      toneMapped: false,
      depthWrite: false,
    });
    const sky = new THREE.Mesh(geo, mat);
    sky.rotation.y = -0.85;
    sky.renderOrder = -10;
    this.scene.add(sky);
    this.sky = sky;

    const starGeo = new THREE.BufferGeometry();
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(rand(0.08, 1));
      const r = 245;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.cos(phi) * r + 20;
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xcfe4ff,
        size: 0.9,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        sizeAttenuation: true,
        fog: false,
        map: this.textures.glow,
      }),
    );
    this.scene.add(this.stars);
  }

  buildLights() {
    this.scene.add(new THREE.HemisphereLight(0x9eb2e6, 0x3a1c0d, 1.55));
    this.scene.add(new THREE.AmbientLight(0x3b4864, 1.5));

    const moon = new THREE.DirectionalLight(0xffb27a, 2.6);
    moon.position.set(-42, 62, 30);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -68;
    moon.shadow.camera.right = 68;
    moon.shadow.camera.top = 68;
    moon.shadow.camera.bottom = -68;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 180;
    moon.shadow.bias = -0.0006;
    moon.shadow.normalBias = 0.035;
    this.scene.add(moon);
    this.moon = moon;

    const rim = new THREE.DirectionalLight(0x3a7dff, 0.85);
    rim.position.set(38, 24, -44);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight(0x8fa2cc, 1.8);
    fill.position.set(0, 28, 70);
    this.scene.add(fill);

    this.scene.fog = new THREE.FogExp2(0x080a11, 0.0058);
  }

  addSolid(minX, maxX, minY, maxY, minZ, maxZ, walkable = false) {
    const box = { minX, maxX, minY, maxY, minZ, maxZ, walkable };
    this.solids.push(box);
    if (walkable) this.groundBoxes.push(box);
    return box;
  }

  addTarget(mesh) {
    this.raycastTargets.push(mesh);
    return mesh;
  }

  buildFloor() {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(108, 108), this.mat.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
    this.addTarget(floor);

    const under = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({ color: 0x07080c, roughness: 1 }),
    );
    under.rotation.x = -Math.PI / 2;
    under.position.y = -0.6;
    this.scene.add(under);

    // perimeter skirting
    for (const [x, z, w, d] of [
      [0, -52.5, 108, 1.2],
      [0, 52.5, 108, 1.2],
      [-52.5, 0, 1.2, 108],
      [52.5, 0, 1.2, 108],
    ]) {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(w, 1.6, d), this.mat.metalDark);
      skirt.position.set(x, 0.8, z);
      skirt.castShadow = true;
      skirt.receiveShadow = true;
      this.group.add(skirt);
      this.addTarget(skirt);
    }
  }

  buildPlatform() {
    const h = 2.2;
    const size = 32;
    const body = new THREE.Mesh(new THREE.BoxGeometry(size, h, size), this.mat.stoneHigh);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    body.material = this.mat.stoneHigh.clone();
    body.material.map = this.textures.wall.clone();
    body.material.map.repeat.set(3, 1);
    body.material.map.needsUpdate = true;
    this.group.add(body);
    this.addTarget(body);
    this.addSolid(-size / 2, size / 2, 0, h, -size / 2, size / 2, true);

    const top = new THREE.Mesh(new THREE.PlaneGeometry(size, size), this.textures.floorPlatform);
    top.rotation.x = -Math.PI / 2;
    top.position.y = h + 0.005;
    top.receiveShadow = true;
    top.material = new THREE.MeshStandardMaterial({
      map: this.textures.floorPlatform,
      roughness: 0.85,
      metalness: 0.3,
      color: 0xc2c4cc,
    });
    this.group.add(top);
    this.addTarget(top);

    // metal border
    const borderMat = this.mat.metal;
    for (const [x, z, w, d] of [
      [0, -size / 2, size + 1.2, 0.7],
      [0, size / 2, size + 1.2, 0.7],
      [-size / 2, 0, 0.7, size + 1.2],
      [size / 2, 0, 0.7, size + 1.2],
    ]) {
      const border = new THREE.Mesh(new THREE.BoxGeometry(w, 0.22, d), borderMat);
      border.position.set(x, h + 0.08, z);
      border.castShadow = true;
      border.receiveShadow = true;
      this.group.add(border);
      this.addTarget(border);
    }

    // emissive trim
    for (const [x, z, w, d] of [
      [0, -size / 2 - 0.52, size + 1.2, 0.1],
      [0, size / 2 + 0.52, size + 1.2, 0.1],
      [-size / 2 - 0.52, 0, 0.1, size + 1.2],
      [size / 2 + 0.52, 0, 0.1, size + 1.2],
    ]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), this.mat.cyanGlow);
      strip.position.set(x, h - 0.28, z);
      this.group.add(strip);
    }

    // central emblem
    const emblem = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), this.mat.emblem);
    emblem.rotation.x = -Math.PI / 2;
    emblem.position.y = h + 0.03;
    emblem.renderOrder = 3;
    this.group.add(emblem);
    this.emblem = emblem;

    const ringGeo = new THREE.RingGeometry(7.1, 7.35, 96);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xff6a22,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = h + 0.025;
    this.group.add(ring);
    this.emblemRing = ring;

    // four ramps
    const rampW = 7;
    const rampLen = 10;
    const edge = size / 2;
    const ramps = [
      { x: 0, z: edge + rampLen / 2, high: "minZ" },
      { x: 0, z: -edge - rampLen / 2, high: "maxZ" },
      { x: edge + rampLen / 2, z: 0, high: "minX" },
      { x: -edge - rampLen / 2, z: 0, high: "maxX" },
    ];

    for (const r of ramps) {
      const mesh = this.makeWedge(rampW, rampLen, h);
      mesh.position.set(r.x, 0, r.z);
      if (r.high === "minX") mesh.rotation.y = -Math.PI / 2;
      if (r.high === "maxX") mesh.rotation.y = Math.PI / 2;
      if (r.high === "minZ") mesh.rotation.y = Math.PI;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.addTarget(mesh);

      let minX = r.x - rampW / 2;
      let maxX = r.x + rampW / 2;
      let minZ = r.z - rampLen / 2;
      let maxZ = r.z + rampLen / 2;
      const ramp = { minX, maxX, minZ, maxZ, lowY: 0, highY: h, high: r.high };
      this.ramps.push(ramp);

      // hazard lip strips
      const lip = new THREE.Mesh(new THREE.BoxGeometry(rampW + 0.5, 0.08, 0.4), this.mat.hazard);
      if (r.high === "minZ" || r.high === "maxZ") {
        lip.position.set(r.x, 0.05, r.high === "minZ" ? r.z + rampLen / 2 - 0.3 : r.z - rampLen / 2 + 0.3);
      } else {
        lip.rotation.y = Math.PI / 2;
        lip.position.set(r.high === "minX" ? r.x + rampLen / 2 - 0.3 : r.x - rampLen / 2 + 0.3, 0.05, r.z);
      }
      this.group.add(lip);
    }
  }

  makeWedge(width, length, height) {
    const w = width / 2;
    const l = length / 2;
    const positions = new Float32Array([
      -w, 0, -l,
      w, 0, -l,
      w, 0, l,
      -w, 0, l,
      -w, height, l,
      w, height, l,
    ]);
    const uvs = new Float32Array([
      0, 0,
      width / 2, 0,
      width / 2, length / 2,
      0, length / 2,
      0, length / 2,
      width / 2, length / 2,
    ]);
    const idx = [
      0, 1, 5, 0, 5, 4,
      0, 4, 3,
      1, 2, 5,
      3, 4, 5, 3, 5, 2,
      0, 2, 1, 0, 3, 2,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mat = this.mat.metal.clone();
    mat.side = THREE.DoubleSide;
    mat.map = this.textures.metal;
    return new THREE.Mesh(geo, mat);
  }

  buildWalls() {
    const mat = this.mat.stone;
    const h = 21;
    const thickness = 2;
    const wallDefs = [
      { x: 0, z: -54, w: 110, d: thickness, rot: 0 },
      { x: 0, z: 54, w: 110, d: thickness, rot: Math.PI },
      { x: -54, z: 0, w: thickness, d: 110, rot: Math.PI / 2 },
      { x: 54, z: 0, w: thickness, d: 110, rot: -Math.PI / 2 },
    ];

    for (const def of wallDefs) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(def.w, h, def.d), mat);
      wall.position.set(def.x, h / 2 - 1, def.z);
      wall.receiveShadow = true;
      wall.castShadow = true;
      this.group.add(wall);
      this.addTarget(wall);
    }

    // wall trims & buttresses
    for (let side = 0; side < 4; side += 1) {
      const angle = (side * Math.PI) / 2;
      const nx = Math.sin(angle);
      const nz = Math.cos(angle);
      const tangentX = Math.cos(angle);
      const tangentZ = -Math.sin(angle);

      for (const y of [1.1, 7.7, 15.2]) {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(104, 0.45, 0.9), this.mat.metalDark);
        trim.position.set(nx * 52.2, y, nz * 52.2);
        trim.rotation.y = angle;
        trim.castShadow = true;
        trim.receiveShadow = true;
        this.group.add(trim);
        this.addTarget(trim);
      }

      const glow = new THREE.Mesh(new THREE.BoxGeometry(100, 0.09, 0.22), this.mat.orangeGlow);
      glow.position.set(nx * 52.7, 13.1, nz * 52.7);
      glow.rotation.y = angle;
      this.group.add(glow);

      for (const offset of [-45, -30, -15, 0, 15, 30, 45]) {
        const bx = tangentX * offset + nx * 52;
        const bz = tangentZ * offset + nz * 52;
        const buttress = new THREE.Mesh(new THREE.BoxGeometry(2.3, 16, 2.6), this.mat.stoneHigh);
        buttress.position.set(bx, 7.2, bz);
        buttress.rotation.y = angle;
        buttress.castShadow = true;
        buttress.receiveShadow = true;
        this.group.add(buttress);
        this.addTarget(buttress);
        this.addSolid(bx - 1.3, bx + 1.3, 0, 15.2, bz - 1.4, bz + 1.4);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.45, 3.3), this.mat.metalDark);
        cap.position.set(bx, 10.5, bz);
        cap.rotation.y = angle;
        cap.castShadow = true;
        this.group.add(cap);
      }

      // gothic arches
      for (const offset of [-37.5, -12.5, 12.5, 37.5]) {
        this.buildArch(
          tangentX * offset + nx * 52.94,
          tangentZ * offset + nz * 52.94,
          angle + Math.PI,
          offset,
        );
      }
    }

    // hanging banners
    for (let side = 0; side < 4; side += 1) {
      const angle = (side * Math.PI) / 2;
      const nx = Math.sin(angle);
      const nz = Math.cos(angle);
      const bx = nx * 52.9 + Math.cos(angle) * 0;
      const bz = nz * 52.9;
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 7.4), this.mat.banner);
      banner.position.set(bx, 11.2, bz);
      banner.rotation.y = angle;
      this.group.add(banner);
    }
  }

  buildArch(x, z, rot, offset) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rot;
    this.group.add(group);

    const dark = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 10.6),
      new THREE.MeshStandardMaterial({ color: 0x08090d, roughness: 1, metalness: 0 }),
    );
    dark.position.set(0, 6.5, 0.04);
    group.add(dark);

    const rune = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), this.mat.emblem);
    rune.position.set(0, 6.8, 0.08);
    rune.material = this.mat.emblem;
    group.add(rune);

    for (const side of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.62, 9.4, 0.7), this.mat.stoneHigh);
      col.position.set(side * 3.2, 4.7, 0.18);
      col.castShadow = true;
      col.receiveShadow = true;
      group.add(col);

      const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 1.2), this.mat.metalDark);
      base.position.set(side * 3.2, 0.3, 0.2);
      group.add(base);

      const arch = new THREE.Mesh(new THREE.BoxGeometry(0.55, 4.6, 0.7), this.mat.stoneHigh);
      arch.position.set(side * 1.7, 9.4, 0.18);
      arch.rotation.z = side * 0.55;
      arch.castShadow = true;
      group.add(arch);
    }

    const key = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.85, 0.9), this.mat.metalDark);
    key.position.set(0, 11.5, 0.2);
    key.castShadow = true;
    group.add(key);

    if (Math.abs(offset) > 1) {
      const torchY = 9.6;
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 1.2), this.mat.metalDark);
      bracket.position.set(0, torchY, 0.8);
      group.add(bracket);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.22, 0.55, 8), this.mat.blackStone);
      bowl.position.set(0, torchY + 0.45, 1.3);
      group.add(bowl);

      const flame = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.textures.glow,
          color: 0xff8a32,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      flame.position.set(0, torchY + 0.9, 1.3);
      flame.scale.setScalar(1.5);
      group.add(flame);

      group.updateMatrixWorld(true);
      const world = new THREE.Vector3();
      flame.getWorldPosition(world);
      let light = null;
      if (offset === 12.5) {
        light = new THREE.PointLight(0xff7a2a, 30, 26, 2);
        light.position.copy(world);
        this.scene.add(light);
      }
      this.torches.push({ flame, world, phase: Math.random() * 10, light });
    }
  }

  buildCatwalk() {
    const y = 7.5;
    const inner = 48;
    const outer = 53;
    const strips = [
      { x: 0, z: (inner + outer) / 2, w: outer * 2, d: outer - inner },
      { x: 0, z: -(inner + outer) / 2, w: outer * 2, d: outer - inner },
      { x: (inner + outer) / 2, z: 0, w: outer - inner, d: (inner + outer) / 2 * 2 },
      { x: -(inner + outer) / 2, z: 0, w: outer - inner, d: (inner + outer) / 2 * 2 },
    ];

    for (const s of strips) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.5, s.d), this.mat.metalDark);
      mesh.position.set(s.x, y - 0.25, s.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.addTarget(mesh);
      this.addSolid(s.x - s.w / 2, s.x + s.w / 2, y - 0.5, y, s.z - s.d / 2, s.z + s.d / 2, true);
    }

    // inner railings
    const railMat = this.mat.metal;
    const postGeo = new THREE.BoxGeometry(0.16, 1.15, 0.16);
    const postCount = 4 * 17;
    const posts = new THREE.InstancedMesh(postGeo, railMat, postCount);
    posts.castShadow = true;
    const m = new THREE.Matrix4();
    let idx = 0;
    const postRange = 44;
    for (let side = 0; side < 4; side += 1) {
      for (let i = 0; i < 17; i += 1) {
        const t = -postRange + (i / 16) * postRange * 2;
        let px = 0;
        let pz = 0;
        if (side === 0) { px = t; pz = -inner; }
        if (side === 1) { px = t; pz = inner; }
        if (side === 2) { px = -inner; pz = t; }
        if (side === 3) { px = inner; pz = t; }
        m.makeTranslation(px, y + 0.58, pz);
        posts.setMatrixAt(idx, m);
        idx += 1;
      }
    }
    posts.instanceMatrix.needsUpdate = true;
    this.group.add(posts);

    // horizontal rails
    const railY = [y + 0.35, y + 0.95];
    const railDefs = [
      { x: 0, z: -inner, w: 88, d: 0.12, ry: 0, skip: false },
      { x: 0, z: inner, w: 88, d: 0.12, ry: 0, skip: true },
      { x: -inner, z: 0, w: 96, d: 0.12, ry: Math.PI / 2, skip: false },
      { x: inner, z: 0, w: 96, d: 0.12, ry: Math.PI / 2, skip: false },
    ];
    for (const r of railDefs) {
      if (r.skip) {
        for (const yy of railY) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(84, 0.09, r.d), railMat);
          rail.position.set(0, yy, r.z);
          this.group.add(rail);
        }
        continue;
      }
      for (const yy of railY) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.09, r.d), railMat);
        rail.position.set(r.x, yy, r.z);
        rail.rotation.y = r.ry;
        this.group.add(rail);
        this.addTarget(rail);
      }
    }

    // railing collision (thin, prevents walking off)
    this.addSolid(-42, 42, y, y + 1.15, -inner - 0.1, -inner + 0.1);
    this.addSolid(-42, 42, y, y + 1.15, inner - 0.1, inner + 0.1);
    this.addSolid(-inner - 0.1, -inner + 0.1, y, y + 1.15, -48, 48);
    this.addSolid(inner - 0.1, inner + 0.1, y, y + 1.15, -48, 48);

    // under-catwalk braces
    const braceGeo = new THREE.BoxGeometry(0.22, 7, 0.22);
    const braces = new THREE.InstancedMesh(braceGeo, this.mat.metal, 4 * 11);
    braces.castShadow = true;
    let bi = 0;
    for (let side = 0; side < 4; side += 1) {
      for (let i = 0; i < 11; i += 1) {
        const t = -48 + (i / 10) * 96;
        let px;
        let pz;
        if (side === 0) { px = t; pz = -48; }
        else if (side === 1) { px = t; pz = 48; }
        else if (side === 2) { px = -48; pz = t; }
        else { px = 48; pz = t; }
        m.makeTranslation(px, 3.6, pz);
        braces.setMatrixAt(bi, m);
        bi += 1;
      }
    }
    braces.instanceMatrix.needsUpdate = true;
    this.group.add(braces);

    // access ramps to the catwalk
    this.buildCatwalkRamp(46, 21, 49, 5, y, "maxZ");
    this.buildCatwalkRamp(-46, 21, 49, 5, y, "maxZ");
  }

  buildCatwalkRamp(x, zStart, zEnd, width, height, high) {
    const len = zEnd - zStart;
    const mesh = this.makeWedge(width, len, height);
    mesh.position.set(x, 0, (zStart + zEnd) / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.addTarget(mesh);

    this.ramps.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: zStart,
      maxZ: zEnd,
      lowY: 0,
      highY: height,
      high,
    });

    const lip = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, 0.4), this.mat.hazard);
    lip.position.set(x, 0.05, zStart + 0.3);
    this.group.add(lip);
  }

  buildPillars() {
    const count = 8;
    const radius = 34;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      this.group.add(g);

      const base = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.7, 4.6), this.mat.stoneHigh);
      base.position.y = 0.35;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);
      this.addTarget(base);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.65, 15, 8), this.mat.stone);
      shaft.position.y = 8.1;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      g.add(shaft);
      this.addTarget(shaft);
      this.addSolid(x - 1.65, x + 1.65, 0, 15.6, z - 1.65, z + 1.65);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(4, 0.75, 4), this.mat.stoneHigh);
      cap.position.y = 15.9;
      cap.castShadow = true;
      g.add(cap);
      this.addTarget(cap);

      const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 1.1, 8), this.mat.metalDark);
      cap2.position.y = 16.8;
      cap2.castShadow = true;
      g.add(cap2);

      const band = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 0.18, 8), this.mat.orangeGlow);
      band.position.y = 6.2;
      g.add(band);

      const flame = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.textures.glow,
          color: 0xff7a28,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      flame.position.set(0, 17.9, 0);
      flame.scale.setScalar(2.2);
      g.add(flame);

      g.updateMatrixWorld(true);
      const world = new THREE.Vector3();
      flame.getWorldPosition(world);
      this.torches.push({ flame, world, phase: Math.random() * 10 });
    }
  }

  buildCover() {
    const crates = [
      { x: -35, z: -10, w: 5.2, h: 2.6, d: 1.6, ry: 0 },
      { x: 35, z: 10, w: 5.2, h: 2.6, d: 1.6, ry: 0 },
      { x: -10, z: -35, w: 1.6, h: 2.6, d: 5.2, ry: 0 },
      { x: 10, z: 35, w: 1.6, h: 2.6, d: 5.2, ry: 0 },
      { x: -39, z: 39, w: 3, h: 3, d: 3, ry: 0.2 },
      { x: 39, z: -39, w: 3, h: 3, d: 3, ry: -0.15 },
      { x: -39, z: -39, w: 2.6, h: 2.2, d: 2.6, ry: 0.4 },
      { x: 39, z: 39, w: 2.6, h: 2.2, d: 2.6, ry: -0.4 },
    ];

    for (const c of crates) {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, c.d), this.mat.metalDark.clone());
      crate.material.map = this.textures.metal.clone();
      crate.material.map.repeat.set(Math.max(1, c.w / 2), Math.max(1, c.h / 2));
      crate.material.map.needsUpdate = true;
      crate.position.set(c.x, c.h / 2, c.z);
      crate.rotation.y = c.ry;
      crate.castShadow = true;
      crate.receiveShadow = true;
      this.group.add(crate);
      this.addTarget(crate);
      const halfW = c.w / 2;
      const halfD = c.d / 2;
      const rad = Math.abs(Math.cos(c.ry)) * halfW + Math.abs(Math.sin(c.ry)) * halfD;
      const radZ = Math.abs(Math.sin(c.ry)) * halfW + Math.abs(Math.cos(c.ry)) * halfD;
      this.addSolid(c.x - rad, c.x + rad, 0, c.h, c.z - radZ, c.z + radZ, true);
    }

    // low barriers on platform corners
    for (const [x, z] of [
      [-11, -11],
      [11, -11],
      [-11, 11],
      [11, 11],
    ]) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, 1), this.mat.stoneHigh);
      barrier.position.set(x, 2.7, z);
      barrier.castShadow = true;
      barrier.receiveShadow = true;
      this.group.add(barrier);
      this.addTarget(barrier);
      this.addSolid(x - 1.2, x + 1.2, 2.2, 3.2, z - 0.5, z + 0.5, true);
    }
  }

  buildLava() {
    const pools = [
      { x: -37, z: 37, w: 9, d: 6 },
      { x: 37, z: 37, w: 9, d: 6 },
      { x: -37, z: -37, w: 9, d: 6 },
      { x: 37, z: -37, w: 9, d: 6 },
    ];

    for (const pool of pools) {
      const rim = new THREE.Mesh(
        new THREE.BoxGeometry(pool.w + 1.2, 0.45, pool.d + 1.2),
        this.mat.blackStone,
      );
      rim.position.set(pool.x, 0.2, pool.z);
      rim.receiveShadow = true;
      this.group.add(rim);
      this.addTarget(rim);

      const lava = new THREE.Mesh(new THREE.PlaneGeometry(pool.w, pool.d), this.mat.lava.clone());
      lava.rotation.x = -Math.PI / 2;
      lava.position.set(pool.x, 0.44, pool.z);
      this.group.add(lava);
      this.addTarget(lava);

      // containment bars
      const barMat = this.mat.metal;
      for (const [bx, bz, bw, bd] of [
        [pool.x, pool.z - pool.d / 2 - 0.7, pool.w + 1.2, 0.16],
        [pool.x, pool.z + pool.d / 2 + 0.7, pool.w + 1.2, 0.16],
        [pool.x - pool.w / 2 - 0.7, pool.z, 0.16, pool.d + 1.2],
        [pool.x + pool.w / 2 + 0.7, pool.z, 0.16, pool.d + 1.2],
      ]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.08, bd), barMat);
        bar.position.set(bx, 1.1, bz);
        this.group.add(bar);
      }
      for (const [px, pz] of [
        [pool.x - pool.w / 2 - 0.7, pool.z - pool.d / 2 - 0.7],
        [pool.x + pool.w / 2 + 0.7, pool.z - pool.d / 2 - 0.7],
        [pool.x - pool.w / 2 - 0.7, pool.z + pool.d / 2 + 0.7],
        [pool.x + pool.w / 2 + 0.7, pool.z + pool.d / 2 + 0.7],
      ]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.15, 0.16), barMat);
        post.position.set(px, 0.57, pz);
        this.group.add(post);
      }

      this.hazards.push({
        minX: pool.x - pool.w / 2,
        maxX: pool.x + pool.w / 2,
        minZ: pool.z - pool.d / 2,
        maxZ: pool.z + pool.d / 2,
      });

      const light = new THREE.PointLight(0xff4a0e, 26, 26, 2);
      light.position.set(pool.x, 1.8, pool.z);
      this.scene.add(light);
      this.lavaLights.push(light);
    }
  }

  buildPortals() {
    const defs = [
      { x: 43, z: 0, ry: -Math.PI / 2 },
      { x: -43, z: 0, ry: Math.PI / 2 },
      { x: 0, z: 43, ry: 0 },
      { x: 0, z: -43, ry: Math.PI },
    ];

    for (const def of defs) {
      const group = new THREE.Group();
      group.position.set(def.x, 0, def.z);
      group.rotation.y = def.ry;
      this.scene.add(group);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.14, 8, 48),
        new THREE.MeshStandardMaterial({
          color: 0x180806,
          emissive: 0xff4a16,
          emissiveIntensity: 4.2,
          roughness: 0.3,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.06;
      group.add(ring);

      const inner = new THREE.Mesh(
        new THREE.CircleGeometry(2.05, 48),
        new THREE.MeshBasicMaterial({
          color: 0xff5a1f,
          transparent: true,
          opacity: 0.1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      inner.rotation.x = -Math.PI / 2;
      inner.position.y = 0.07;
      group.add(inner);

      for (const side of [-1, 1]) {
        const obelisk = new THREE.Mesh(new THREE.ConeGeometry(0.55, 5.4, 4), this.mat.blackStone);
        obelisk.position.set(side * 3.1, 2.7, 0);
        obelisk.castShadow = true;
        group.add(obelisk);
        const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), this.mat.orangeGlow);
        tip.position.set(side * 3.1, 5.6, 0);
        group.add(tip);
      }

      group.updateMatrixWorld(true);
      const spawn = new THREE.Vector3(def.x, 0, def.z);
      this.portals.push({ group, ring, inner, spawn, phase: Math.random() * 10 });
    }
  }

  buildJumpPads() {
    const defs = [
      { x: -30, z: 30 },
      { x: 30, z: 30 },
      { x: -30, z: -30 },
      { x: 30, z: -30 },
    ];
    for (const def of defs) {
      const group = new THREE.Group();
      group.position.set(def.x, 0, def.z);
      this.scene.add(group);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.9, 0.22, 24), this.mat.metal);
      base.position.y = 0.11;
      base.receiveShadow = true;
      group.add(base);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 1.45, 32),
        new THREE.MeshBasicMaterial({
          color: 0x66f4ff,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.235;
      group.add(ring);

      const chevron = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.42, 3),
        new THREE.MeshBasicMaterial({
          color: 0xeaffff,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      chevron.rotation.x = -Math.PI / 2;
      chevron.rotation.z = Math.PI / 2;
      chevron.position.y = 0.24;
      group.add(chevron);

      this.jumpPads.push({
        position: new THREE.Vector3(def.x, 0.1, def.z),
        ring,
        chevron,
        cooldown: 0,
        phase: Math.random() * 10,
      });
    }
  }

  buildProps() {
    // hanging chains near the walls
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x2a2c33, metalness: 0.9, roughness: 0.5 });
    for (let i = 0; i < 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2 + 0.12;
      const r = 50.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const len = rand(2.4, 6);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 4), chainMat);
      chain.position.set(x, 17.5 - len / 2, z);
      this.group.add(chain);
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 5, 10), chainMat);
      hook.position.set(x, 17.5 - len, z);
      hook.rotation.x = Math.PI / 2;
      this.group.add(hook);
    }

    // scattered rubble
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x2b2c33, roughness: 0.95, metalness: 0.1 });
    for (let i = 0; i < 30; i += 1) {
      const size = rand(0.12, 0.45);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(size, 0), rubbleMat);
      const a = Math.random() * Math.PI * 2;
      const r = rand(20, 50);
      rock.position.set(Math.cos(a) * r, size / 2, Math.sin(a) * r);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.group.add(rock);
    }
  }

  groundHeightAt(x, z, feetY) {
    let height = 0;
    const step = 0.62;
    for (const box of this.groundBoxes) {
      if (x >= box.minX - 0.1 && x <= box.maxX + 0.1 && z >= box.minZ - 0.1 && z <= box.maxZ + 0.1) {
        if (box.maxY <= feetY + step && box.maxY > height) height = box.maxY;
      }
    }
    for (const ramp of this.ramps) {
      if (x >= ramp.minX && x <= ramp.maxX && z >= ramp.minZ && z <= ramp.maxZ) {
        let t;
        if (ramp.high === "maxZ" || ramp.high === "minZ") {
          t = (z - ramp.minZ) / (ramp.maxZ - ramp.minZ);
          if (ramp.high === "minZ") t = 1 - t;
        } else {
          t = (x - ramp.minX) / (ramp.maxX - ramp.minX);
          if (ramp.high === "minX") t = 1 - t;
        }
        const h = ramp.lowY + (ramp.highY - ramp.lowY) * clamp(t, 0, 1);
        if (h <= feetY + step && h > height) height = h;
      }
    }
    return height;
  }

  inHazard(x, z) {
    for (const h of this.hazards) {
      if (x >= h.minX && x <= h.maxX && z >= h.minZ && z <= h.maxZ) return true;
    }
    return false;
  }

  pointBlocked(x, y, z, margin = 0) {
    for (const s of this.solids) {
      if (
        x > s.minX - margin &&
        x < s.maxX + margin &&
        y > s.minY - margin &&
        y < s.maxY + margin &&
        z > s.minZ - margin &&
        z < s.maxZ + margin
      ) {
        return true;
      }
    }
    return false;
  }

  raycast(origin, dir, maxDist = 200) {
    this.raycaster.set(origin, dir);
    this.raycaster.far = maxDist;
    const hits = this.raycaster.intersectObjects(this.raycastTargets, false);
    return hits.length ? hits[0] : null;
  }

  hasLineOfSight(from, to) {
    _rayDir.subVectors(to, from);
    const dist = _rayDir.length();
    if (dist < 0.001) return true;
    _rayDir.divideScalar(dist);
    _rayOrigin.copy(from);
    const hit = this.raycast(_rayOrigin, _rayDir, dist);
    return !hit || hit.distance > dist - 0.55;
  }

  update(dt) {
    this.portalTime += dt;
    this.textures.lava.offset.x += dt * 0.012;
    this.textures.lava.offset.y += dt * 0.008;

    for (let i = 0; i < this.lavaLights.length; i += 1) {
      const t = this.portalTime * 1.7 + i * 1.3;
      this.lavaLights[i].intensity = 22 + Math.sin(t) * 5 + Math.sin(t * 2.7) * 2.4;
    }

    for (const torch of this.torches) {
      const flicker = 0.7 + Math.sin(this.portalTime * 8 + torch.phase) * 0.14 + Math.sin(this.portalTime * 21 + torch.phase * 2) * 0.08;
      torch.flame.scale.setScalar(1.3 + flicker * 0.55);
      torch.flame.material.opacity = 0.65 + flicker * 0.25;
      if (torch.light) torch.light.intensity = 24 + flicker * 12;
      if (Math.random() < dt * 16) {
        this.game.effects.ember(torch.world);
      }
    }

    for (const portal of this.portals) {
      const p = this.portalTime * 0.8 + portal.phase;
      portal.ring.rotation.z += dt * 0.2;
      portal.ring.scale.setScalar(1 + Math.sin(p) * 0.035);
      portal.inner.material.opacity = 0.07 + (Math.sin(p * 1.7) + 1) * 0.04;
      portal.inner.rotation.z -= dt * 0.35;
      if (Math.random() < dt * 5) {
        this.game.effects.ember(portal.spawn.clone().add(new THREE.Vector3(rand(-1.6, 1.6), 0.4, rand(-1.6, 1.6))));
      }
    }

    for (const pad of this.jumpPads) {
      pad.cooldown = Math.max(0, pad.cooldown - dt);
      pad.ring.rotation.z += dt * 0.9;
      pad.chevron.rotation.z -= dt * 1.4;
      const s = 1 + Math.sin(this.portalTime * 3 + pad.phase) * 0.08;
      pad.ring.scale.setScalar(s);
    }

    if (this.emblem) {
      this.emblem.material.opacity = 0.78 + Math.sin(this.portalTime * 1.1) * 0.12;
      this.emblemRing.material.opacity = 0.4 + Math.sin(this.portalTime * 1.4) * 0.2;
      this.emblemRing.rotation.z += dt * 0.02;
    }

    if (this.stars) this.stars.rotation.y += dt * 0.0015;

    this.pickups.update(dt);
    this.updateJumpPads(dt);
  }

  updateJumpPads(dt) {
    const player = this.game.player;
    if (!player || !player.alive) return;
    for (const pad of this.jumpPads) {
      if (pad.cooldown > 0) continue;
      const dx = player.pos.x - pad.position.x;
      const dz = player.pos.z - pad.position.z;
      if (dx * dx + dz * dz < 2.4 && player.pos.y < 0.6) {
        const dir = new THREE.Vector3(-pad.position.x, 0, -pad.position.z).normalize();
        player.vel.set(dir.x * 9, 17.5, dir.z * 9);
        player.onGround = false;
        pad.cooldown = 1.4;
        this.game.audio.dash();
        this.game.effects.burst(pad.position.clone().setY(0.4), 0x66f4ff, 22, 7, { size: 0.22, life: 0.5, up: 2 });
        this.game.addShake(0.12, 0.2);
      }
    }
  }
}

class PickupManager {
  constructor(game, arena) {
    this.game = game;
    this.arena = arena;
    this.scene = game.scene;
    this.textures = game.textures;
    this.items = [];

    this.defs = [
      { kind: "health", x: -24, y: 0, z: 0, respawn: 22 },
      { kind: "health", x: 24, y: 0, z: 0, respawn: 22 },
      { kind: "health", x: 0, y: 2.2, z: 0, respawn: 30 },
      { kind: "armor", x: 0, y: 0, z: 24, respawn: 24 },
      { kind: "armor", x: 0, y: 0, z: -24, respawn: 24 },
      { kind: "rockets", x: 12, y: 2.2, z: 12, respawn: 14 },
      { kind: "rockets", x: -12, y: 2.2, z: -12, respawn: 14 },
      { kind: "rockets", x: 0, y: 0, z: 42, respawn: 16 },
      { kind: "shells", x: -12, y: 2.2, z: 12, respawn: 14 },
      { kind: "shells", x: 12, y: 2.2, z: -12, respawn: 14 },
      { kind: "slugs", x: 30, y: 0, z: 30, respawn: 18 },
      { kind: "slugs", x: -30, y: 0, z: -30, respawn: 18 },
    ];

    for (const def of this.defs) this.addItem(def.kind, new THREE.Vector3(def.x, def.y, def.z), def.respawn);
  }

  makeMesh(kind) {
    const group = new THREE.Group();
    const color =
      kind === "health" ? 0xff3b2a : kind === "armor" ? 0x5ee9ff : kind === "rockets" ? 0xff8a2e : kind === "shells" ? 0xffc24a : 0x8d7bff;

    const light = new THREE.PointLight(color, 2.4, 6, 2);
    light.position.y = 0.9;
    group.add(light);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.78, 32),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    group.add(ring);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.textures.glow,
        color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.position.y = 0.85;
    glow.scale.setScalar(1.7);
    group.add(glow);

    const icon = new THREE.Group();
    icon.position.y = 0.9;
    group.add(icon);

    if (kind === "health") {
      const mat = new THREE.MeshStandardMaterial({ color: 0xf4efe4, emissive: 0xff2a12, emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.15 });
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.3), mat);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.95, 0.3), mat);
      icon.add(a, b);
    } else if (kind === "armor") {
      const mat = new THREE.MeshStandardMaterial({ color: 0x0f3740, emissive: 0x2fcde8, emissiveIntensity: 1.6, roughness: 0.2, metalness: 0.8 });
      const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.46), mat);
      icon.add(oct);
    } else if (kind === "rockets") {
      const mat = new THREE.MeshStandardMaterial({ color: 0x3b3f47, emissive: 0xff5a1f, emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.8 });
      for (let i = 0; i < 3; i += 1) {
        const rocket = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 8), mat);
        rocket.position.set((i - 1) * 0.28, 0, 0);
        rocket.rotation.z = 0.2 * (i - 1);
        icon.add(rocket);
      }
    } else if (kind === "shells") {
      const mat = new THREE.MeshStandardMaterial({ color: 0xb8862e, emissive: 0x6b3c08, emissiveIntensity: 0.4, roughness: 0.3, metalness: 0.9 });
      for (let i = 0; i < 3; i += 1) {
        const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.55, 8), mat);
        shell.position.set((i - 1) * 0.3, 0, 0);
        shell.rotation.z = Math.PI / 2;
        icon.add(shell);
      }
    } else {
      const mat = new THREE.MeshStandardMaterial({ color: 0x2d2450, emissive: 0x8d7bff, emissiveIntensity: 1.7, roughness: 0.2, metalness: 0.7 });
      for (let i = 0; i < 2; i += 1) {
        const slug = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.5, 4, 8), mat);
        slug.position.set((i - 0.5) * 0.3, 0, 0);
        slug.rotation.z = 0.2;
        icon.add(slug);
      }
    }

    group.userData.icon = icon;
    group.userData.ring = ring;
    group.userData.glow = glow;
    group.userData.color = color;
    return group;
  }

  addItem(kind, position, respawn = 18, temporary = false, life = 25) {
    const mesh = this.makeMesh(kind);
    mesh.position.copy(position);
    mesh.position.y += 0.02;
    this.scene.add(mesh);
    const item = {
      kind,
      mesh,
      baseY: position.y,
      active: true,
      timer: 0,
      respawn,
      temporary,
      life,
      spin: rand(0.6, 1.2),
      pulse: Math.random() * 10,
    };
    this.items.push(item);
    return item;
  }

  spawnDrop(kind, position) {
    const item = this.addItem(kind, new THREE.Vector3(position.x, Math.max(position.y, 0), position.z), 0, true, 24);
    item.mesh.position.y = Math.max(position.y, 0.1);
    item.baseY = item.mesh.position.y;
    return item;
  }

  update(dt) {
    const player = this.game.player;
    if (!player) return;
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      const mesh = item.mesh;

      if (!item.active) {
        item.timer -= dt;
        if (item.timer <= 0) {
          if (item.temporary) {
            this.scene.remove(mesh);
            this.items.splice(i, 1);
            continue;
          }
          item.active = true;
          mesh.visible = true;
        } else {
          continue;
        }
      }

      if (item.temporary) {
        item.life -= dt;
        if (item.life <= 0) {
          mesh.visible = false;
          item.active = false;
          item.timer = 0.001;
          continue;
        }
      }

      item.pulse += dt;
      const bob = Math.sin(item.pulse * 2) * 0.12;
      mesh.position.y = item.baseY + 0.04 + bob;
      mesh.userData.icon.rotation.y += dt * item.spin;
      mesh.userData.ring.rotation.z += dt * 0.7;
      const s = 1 + Math.sin(item.pulse * 3) * 0.12;
      mesh.userData.ring.scale.setScalar(s);
      mesh.userData.glow.material.opacity = 0.3 + (Math.sin(item.pulse * 3) + 1) * 0.08;

      if (!player.alive) continue;
      const dx = player.pos.x - mesh.position.x;
      const dz = player.pos.z - mesh.position.z;
      const dy = player.pos.y + 0.9 - mesh.position.y;
      if (dx * dx + dz * dz < 2.4 && Math.abs(dy) < 1.8) {
        if (this.collect(item, player)) {
          item.active = false;
          item.timer = item.respawn;
          mesh.visible = false;
          if (item.temporary) {
            this.scene.remove(mesh);
            this.items.splice(i, 1);
          }
        }
      }
    }
  }

  collect(item, player) {
    const game = this.game;
    if (item.kind === "health") {
      if (player.health >= 100) return false;
      player.health = Math.min(100, player.health + 35);
      game.audio.pickup("health");
      game.hud.pickupFlash();
      game.hud.toast("+35 HEALTH");
    } else if (item.kind === "armor") {
      if (player.armor >= 100) return false;
      player.armor = Math.min(100, player.armor + 50);
      game.audio.pickup("armor");
      game.hud.pickupFlash();
      game.hud.toast("+50 ARMOR");
    } else {
      const max = player.ammoMax[item.kind];
      if (player.ammo[item.kind] >= max) return false;
      const amount = item.kind === "rockets" ? 5 : item.kind === "shells" ? 6 : 3;
      player.ammo[item.kind] = Math.min(max, player.ammo[item.kind] + amount);
      game.audio.pickup("ammo");
      game.hud.pickupFlash();
      game.hud.toast(`+${amount} ${item.kind.toUpperCase()}`);
    }
    game.effects.burst(item.mesh.position.clone(), item.mesh.userData.color, 14, 3.5, {
      size: 0.2,
      life: 0.5,
      up: 1.5,
    });
    game.hud.update();
    return true;
  }

  reset() {
    for (const item of this.items) {
      this.scene.remove(item.mesh);
    }
    this.items.length = 0;
    for (const def of this.defs) {
      this.addItem(def.kind, new THREE.Vector3(def.x, def.y, def.z), def.respawn);
    }
  }
}
