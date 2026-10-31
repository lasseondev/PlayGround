import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  addBox, addCone, addSphere, addTorus, makeBrickTexture, makeGlowTexture,
  makeMoonTexture, makeRuneTexture, makeSmokeTexture, makeSparkTexture, makeStoneTexture, rand,
  seeded, standard,
} from './assets.js';

export class Arena {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;
    this.torches = [];
    this.fogs = [];
    this.banners = [];
    this.rune = null;
    this.ash = null;
    this.ashData = [];
    this.stoneTex = makeStoneTexture(512);
    this.brickTex = makeBrickTexture(512);
    this.smokeTex = makeSmokeTexture(256);
    this.sparkTex = makeSparkTexture(64);
    this.glowTex = makeGlowTexture(128, 'rgba(255,180,90,1)', 'rgba(255,80,20,0)');
    this.materials = {
      stone: standard(0x55575e, { roughness: 0.94, metalness: 0.02, map: this.stoneTex }),
      stoneDark: standard(0x303237, { roughness: 0.96, metalness: 0.02, map: this.brickTex }),
      stoneLight: standard(0x6b6c70, { roughness: 0.92, map: this.stoneTex }),
      iron: standard(0x1d1e21, { roughness: 0.48, metalness: 0.8 }),
      gold: standard(0x8f7342, { roughness: 0.38, metalness: 0.85 }),
      cloth: standard(0x3b1419, { roughness: 0.95, side: THREE.DoubleSide }),
      bone: standard(0xb0a68f, { roughness: 0.8 }),
      ember: new THREE.MeshBasicMaterial({ color: 0xff8a35 }),
    };
    this.buildSky();
    this.buildGround();
    this.buildColonnade();
    this.buildGate();
    this.buildProps();
    this.buildAtmosphere();
    this.mergeStatic();
  }

  mergeStatic() {
    const groups = new Map();
    const remove = [];
    this.scene.updateMatrixWorld(true);
    this.scene.traverse((o) => {
      if (!o.isMesh || o.userData.noMerge) return;
      if (o.material?.transparent || o.material?.isMeshBasicMaterial) return;
      if (o === this.rune) return;
      const key = o.material.uuid;
      if (!groups.has(key)) groups.set(key, { material: o.material, geos: [] });
      const g = o.geometry.clone().applyMatrix4(o.matrixWorld);
      const geo = g.index ? g.toNonIndexed() : g;
      groups.get(key).geos.push(geo);
      remove.push(o);
    });
    for (const o of remove) o.parent?.remove(o);
    for (const { material, geos } of groups.values()) {
      if (!geos.length) continue;
      const merged = mergeGeometries(geos, false);
      geos.forEach((g) => g.dispose());
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, material);
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      this.scene.add(mesh);
    }
  }

  buildSky() {
    const geo = new THREE.SphereGeometry(150, 32, 24);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x06080f) },
        midColor: { value: new THREE.Color(0x111827) },
        bottomColor: { value: new THREE.Color(0x1b1512) },
      },
      vertexShader: `
        varying vec3 vWorld;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorld;
        void main() {
          float h = normalize(vWorld).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.15, 0.28, h));
          col = mix(col, topColor, smoothstep(0.28, 0.9, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.scene.add(new THREE.Mesh(geo, mat));

    const rng = seeded(1234);
    const positions = [];
    for (let i = 0; i < 1800; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(0.05 + rng() * 0.95);
      const r = 120;
      positions.push(Math.sin(phi) * Math.cos(theta) * r, Math.cos(phi) * r, Math.sin(phi) * Math.sin(theta) * r);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xcfd8ea, size: 0.32, transparent: true, opacity: 0.55, depthWrite: false, sizeAttenuation: true });
    this.scene.add(new THREE.Points(starGeo, starMat));

    const moonTex = makeMoonTexture(512);
    const moonMat = new THREE.SpriteMaterial({ map: moonTex, color: 0xf3efdb, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
    const moon = new THREE.Sprite(moonMat);
    moon.position.set(-46, 48, -92);
    moon.scale.setScalar(28);
    this.scene.add(moon);

    const haloMat = new THREE.SpriteMaterial({ map: makeGlowTexture(256, 'rgba(220,225,240,0.7)', 'rgba(100,120,180,0)'), transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending });
    const halo = new THREE.Sprite(haloMat);
    halo.position.copy(moon.position);
    halo.scale.setScalar(74);
    this.scene.add(halo);
  }

  buildGround() {
    const outer = new THREE.Mesh(new THREE.CircleGeometry(75, 64), standard(0x0a0b0e, { roughness: 1 }));
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = -2.4;
    outer.receiveShadow = true;
    this.scene.add(outer);

    const step = new THREE.Mesh(new THREE.CylinderGeometry(24.5, 25.5, 0.5, 64), this.materials.stoneDark);
    step.position.y = -0.3;
    step.receiveShadow = true;
    this.scene.add(step);

    const step2 = new THREE.Mesh(new THREE.CylinderGeometry(22.5, 24.2, 0.55, 64), this.materials.stone);
    step2.position.y = 0.06;
    step2.receiveShadow = true;
    this.scene.add(step2);

    const groundTex = this.stoneTex.clone();
    groundTex.repeat.set(13, 13);
    groundTex.needsUpdate = true;
    const groundMat = standard(0x686a71, { roughness: 0.94, metalness: 0.02, map: groundTex });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(22, 96), groundMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.36;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const inlay = new THREE.Mesh(new THREE.RingGeometry(15.9, 16.12, 96), standard(0x7b643b, { metalness: 0.7, roughness: 0.45, emissive: 0x241506, emissiveIntensity: 0.4 }));
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.y = 0.38;
    this.scene.add(inlay);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(22.2, 0.22, 8, 96), this.materials.gold);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.38;
    this.scene.add(rim);

    const runeTex = makeRuneTexture(512);
    const runeMat = new THREE.MeshBasicMaterial({ map: runeTex, transparent: true, opacity: 0.19, color: 0xd6b878, blending: THREE.AdditiveBlending, depthWrite: false });
    this.rune = new THREE.Mesh(new THREE.PlaneGeometry(13, 13), runeMat);
    this.rune.rotation.x = -Math.PI / 2;
    this.rune.position.y = 0.39;
    this.scene.add(this.rune);

    const rune2Mat = new THREE.MeshBasicMaterial({ map: runeTex, transparent: true, opacity: 0.1, color: 0x9db2c4, blending: THREE.AdditiveBlending, depthWrite: false });
    const rune2 = new THREE.Mesh(new THREE.PlaneGeometry(19, 19), rune2Mat);
    rune2.rotation.x = -Math.PI / 2;
    rune2.position.y = 0.385;
    this.scene.add(rune2);

    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + rand(-0.04, 0.04);
      const r = rand(6.5, 21);
      const crack = new THREE.Mesh(new THREE.PlaneGeometry(rand(0.05, 0.12), rand(1.5, 5)), standard(0x08090b, { roughness: 1 }));
      crack.rotation.x = -Math.PI / 2;
      crack.rotation.z = a + rand(-0.5, 0.5);
      crack.position.set(Math.cos(a) * r, 0.395, Math.sin(a) * r);
      this.scene.add(crack);
    }
  }

  buildColonnade() {
    const rng = seeded(88);
    const count = 18;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const radius = 25.5;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      if (Math.abs(x) < 8 && z < -18) continue;
      const broken = rng() > 0.64;
      const height = broken ? 2.4 + rng() * 5 : 9.5 + rng() * 2.2;
      const group = new THREE.Group();
      group.position.set(x, 0.35, z);
      group.rotation.y = -a + Math.PI / 2;

      addBox(group, 2.8, 0.42, 2.8, this.materials.stoneDark, 0, 0.2, 0);
      addBox(group, 2.15, 0.5, 2.15, this.materials.stone, 0, 0.65, 0);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, height, 10), this.materials.stone);
      shaft.position.y = 0.9 + height / 2;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      group.add(shaft);
      for (let f = 0; f < 4; f++) {
        const flute = addBox(group, 0.08, height * 0.94, 0.08, this.materials.stoneDark, Math.cos(f * Math.PI / 2) * 0.66, 0.9 + height / 2, Math.sin(f * Math.PI / 2) * 0.66);
        flute.castShadow = false;
      }
      if (!broken) {
        addBox(group, 2.3, 0.55, 2.3, this.materials.stone, 0, height + 1.08, 0);
        addBox(group, 2.7, 0.35, 2.7, this.materials.stoneDark, 0, height + 1.5, 0);
        if (rng() > 0.35) addBox(group, 1.8, 0.3, 1.8, this.materials.stone, 0, height + 1.85, 0);
      } else {
        const jag = addCone(group, 0.72, 1.1, this.materials.stone, 0, height + 0.95, 0, 0, rng() * 3, 0);
        jag.rotation.x = rand(-0.2, 0.2);
      }
      this.scene.add(group);

      if (!broken && i % 3 === 0) this.addTorch(x * 0.93, z * 0.93, -a + Math.PI / 2);
    }

    const ring = new THREE.Mesh(new THREE.TorusGeometry(25.5, 0.14, 5, 128), this.materials.gold);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.36;
    this.scene.add(ring);
  }

  addTorch(x, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0.35, z);
    group.rotation.y = rotation;
    addBox(group, 0.25, 1.1, 0.25, this.materials.iron, 0, 0.55, 0);
    addCone(group, 0.42, 0.75, this.materials.iron, 0, 1.25, 0, Math.PI, 0, 0);
    addSphere(group, 0.33, this.materials.ember, 0, 1.55, 0, 0.8, 1.5, 0.8);
    const glowMat = new THREE.SpriteMaterial({ map: this.glowTex, color: 0xff8a3a, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    const glow = new THREE.Sprite(glowMat);
    glow.position.set(0, 1.62, 0);
    glow.scale.setScalar(2.3);
    group.add(glow);
    const light = new THREE.PointLight(0xff8a42, 26, 13, 2);
    light.position.set(0, 1.8, 0);
    group.add(light);
    this.scene.add(group);
    this.torches.push({ group, light, glow, base: 26, phase: rand(0, 10) });
  }

  buildGate() {
    const gate = new THREE.Group();
    gate.position.set(0, 0, -30);
    this.scene.add(gate);
    const towerMat = this.materials.stoneDark;
    for (const side of [-1, 1]) {
      addBox(gate, 5, 20, 5, towerMat, side * 10, 10, 0);
      addBox(gate, 6, 1.1, 6, this.materials.stone, side * 10, 20.4, 0);
      addBox(gate, 5.6, 0.6, 5.6, this.materials.stoneDark, side * 10, 21.2, 0);
      for (let i = 0; i < 4; i++) addBox(gate, 0.7, 1.3, 0.7, towerMat, side * 10 + (i - 1.5) * 1.3, 21.9, -1.2);
      for (let i = 0; i < 3; i++) {
        const slit = addBox(gate, 0.3, 2.4, 0.06, new THREE.MeshBasicMaterial({ color: 0x2c1b0d }), side * 10, 10 + i * 3.2, 2.52);
        slit.castShadow = false;
      }
    }
    const arch = new THREE.Mesh(new THREE.TorusGeometry(10, 0.65, 8, 28, Math.PI), this.materials.stoneDark);
    arch.position.set(0, 14, 0);
    arch.castShadow = true;
    gate.add(arch);
    const archInner = new THREE.Mesh(new THREE.TorusGeometry(8.7, 0.24, 6, 24, Math.PI), this.materials.gold);
    archInner.position.set(0, 14, 0.4);
    gate.add(archInner);
    for (let i = 0; i < 9; i++) {
      const a = Math.PI - (i / 8) * Math.PI;
      addCone(gate, 0.4, 1.2, this.materials.stone, Math.cos(a) * 10, 14 + Math.sin(a) * 10 + 0.7, 0.2, 0, 0, -a + Math.PI / 2);
    }
    const rose = new THREE.Mesh(new THREE.CircleGeometry(5.1, 32), new THREE.MeshBasicMaterial({ color: 0x111a2a, transparent: true, opacity: 0.85 }));
    rose.position.set(0, 14.2, -0.8);
    gate.add(rose);
    const roseRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.18, 6, 48), this.materials.gold);
    roseRing.position.copy(rose.position);
    gate.add(roseRing);
    const roseGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(256, 'rgba(130,165,215,0.9)', 'rgba(40,70,130,0)'), transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }));
    roseGlow.position.set(0, 14.2, 0);
    roseGlow.scale.setScalar(13);
    gate.add(roseGlow);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 6.3;
      addBox(gate, 0.5, 0.1, 0.1, this.materials.gold, Math.cos(a) * r, 14.2 + Math.sin(a) * r, 0.1, 0, 0, a);
    }
  }

  buildProps() {
    const rng = seeded(55);
    for (let i = 0; i < 26; i++) {
      const a = rng() * Math.PI * 2;
      const r = rand(18.8, 22.2);
      const group = new THREE.Group();
      group.position.set(Math.cos(a) * r, 0.35, Math.sin(a) * r);
      group.rotation.y = rng() * Math.PI * 2;
      const bladeLen = rand(1.2, 2.8);
      addBox(group, 0.09, bladeLen, 0.035, this.materials.iron, 0, bladeLen / 2 - 0.2, 0, rand(-0.35, 0.35), 0, rand(-0.35, 0.35));
      addBox(group, 0.55, 0.07, 0.09, this.materials.iron, 0, 0.18, 0, 0, 0, rand(-0.2, 0.2));
      addBox(group, 0.08, 0.38, 0.08, this.materials.iron, 0, -0.04, 0);
      this.scene.add(group);
    }

    for (let i = 0; i < 16; i++) {
      const a = rng() * Math.PI * 2;
      const r = rand(22.5, 26);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rand(0.3, 1.1), 0), this.materials.stoneDark);
      rock.position.set(Math.cos(a) * r, rand(0.1, 0.7), Math.sin(a) * r);
      rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
      rock.castShadow = true;
      this.scene.add(rock);
    }

    const bannerMat = this.materials.cloth;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const r = 20.5;
      const group = new THREE.Group();
      group.position.set(Math.cos(a) * r, 7.2, Math.sin(a) * r);
      group.rotation.y = -a + Math.PI / 2;
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 5.4, 6, 10), bannerMat);
      banner.position.y = -2.7;
      banner.castShadow = true;
      banner.userData.noMerge = true;
      group.add(banner);
      addBox(group, 2.2, 0.12, 0.12, this.materials.gold, 0, 0.05, 0);
      addTorus(group, 0.2, 0.025, this.materials.gold, 0, -5.2, 0);
      const sigil = new THREE.Mesh(new THREE.CircleGeometry(0.4, 3), new THREE.MeshBasicMaterial({ color: 0x9a7638, transparent: true, opacity: 0.5 }));
      sigil.position.set(0, -2.7, 0.03);
      group.add(sigil);
      this.scene.add(group);
      this.banners.push({ mesh: banner, phase: rng() * 6 });
    }

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const r = 16.9;
      const brazier = new THREE.Group();
      brazier.position.set(Math.cos(a) * r, 0.36, Math.sin(a) * r);
      addBox(brazier, 0.45, 1.1, 0.45, this.materials.iron, 0, 0.55, 0);
      addCone(brazier, 0.5, 0.55, this.materials.iron, 0, 1.2, 0, Math.PI, 0, 0);
      const ember = addSphere(brazier, 0.25, this.materials.ember, 0, 1.45, 0, 0.8, 1.2, 0.8);
      ember.castShadow = false;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xff762c, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.position.set(0, 1.55, 0);
      glow.scale.setScalar(1.5);
      brazier.add(glow);
      this.scene.add(brazier);
      this.torches.push({ group: brazier, light: null, glow, base: 0, phase: rand(0, 10) });
    }
  }

  buildAtmosphere() {
    const rng = seeded(202);
    const count = 2600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * 34;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = rng() * 26;
      pos[i * 3 + 2] = Math.sin(a) * r;
      this.ashData.push({ speed: 0.18 + rng() * 0.55, drift: 0.25 + rng() * 0.8, phase: rng() * 10 });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xc7bba7, size: 0.055, transparent: true, opacity: 0.58, map: this.sparkTex, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.ash = new THREE.Points(geo, mat);
    this.ash.frustumCulled = false;
    this.scene.add(this.ash);

    for (let i = 0; i < 10; i++) {
      const mat2 = new THREE.MeshBasicMaterial({ map: this.smokeTex, color: 0x6d7482, transparent: true, opacity: 0.11, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
      const fog = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), mat2);
      fog.rotation.x = -Math.PI / 2;
      fog.position.set(rand(-14, 14), 0.42 + rand(0, 0.25), rand(-14, 14));
      fog.rotation.z = rand(0, Math.PI);
      this.scene.add(fog);
      this.fogs.push({ mesh: fog, speed: rand(0.02, 0.08), phase: rand(0, 10), baseX: fog.position.x, baseZ: fog.position.z });
    }

    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      dustPos[i * 3] = rand(-22, 22);
      dustPos[i * 3 + 1] = rand(0.4, 9);
      dustPos[i * 3 + 2] = rand(-22, 22);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffbd72, size: 0.09, transparent: true, opacity: 0.35, map: this.sparkTex, depthWrite: false, blending: THREE.AdditiveBlending });
    this.dust = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dust);
  }

  update(dt, time) {
    this.time = time;
    for (const t of this.torches) {
      const flick = 0.82 + Math.sin(time * 7.3 + t.phase) * 0.08 + Math.sin(time * 13.7 + t.phase * 2) * 0.05 + Math.random() * 0.03;
      t.glow.scale.setScalar((t.base ? 2.3 : 1.5) * flick);
      if (t.light) t.light.intensity = t.base * flick;
    }
    if (this.rune) {
      this.rune.material.opacity = 0.14 + Math.sin(time * 0.8) * 0.035;
      this.rune.rotation.z += dt * 0.008;
    }
    if (this.ash) {
      const arr = this.ash.geometry.attributes.position.array;
      for (let i = 0; i < this.ashData.length; i++) {
        const d = this.ashData[i];
        arr[i * 3 + 1] -= d.speed * dt;
        arr[i * 3] += Math.sin(time * 0.4 + d.phase) * d.drift * dt;
        arr[i * 3 + 2] += Math.cos(time * 0.33 + d.phase) * d.drift * dt;
        if (arr[i * 3 + 1] < 0) {
          arr[i * 3 + 1] = 26;
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * 34;
          arr[i * 3] = Math.cos(a) * r;
          arr[i * 3 + 2] = Math.sin(a) * r;
        }
      }
      this.ash.geometry.attributes.position.needsUpdate = true;
    }
    for (const f of this.fogs) {
      f.mesh.position.x = f.baseX + Math.sin(time * f.speed + f.phase) * 2.2;
      f.mesh.position.z = f.baseZ + Math.cos(time * f.speed * 0.7 + f.phase) * 2.2;
      f.mesh.rotation.z += dt * 0.008;
    }
    for (const b of this.banners) {
      b.mesh.rotation.z = Math.sin(time * 0.9 + b.phase) * 0.035;
      b.mesh.rotation.x = Math.sin(time * 0.6 + b.phase) * 0.02;
    }
    if (this.dust) this.dust.rotation.y = time * 0.01;
  }
}
