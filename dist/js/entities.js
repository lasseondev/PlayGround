/* NEON HEAT — traffic, police, pedestrians, pickups, mission marker */
(function () {
  'use strict';
  const NH = window.NH;
  const { THREE, scene, world, G, player, cars, cops, clamp, wrapAngle, rand, pick, toast, audio } = NH;

  const DIRS = [{ x: 0, z: 1 }, { x: 1, z: 0 }, { x: 0, z: -1 }, { x: -1, z: 0 }];
  const TRAFFIC_COLORS = [0x2e6f8f, 0x8f3a4a, 0xd0c6b0, 0x3c5a3a, 0x6b5d8a, 0xb08a3a, 0x4a5568, 0x9c3d2e, 0x2f5f5a, 0xcfd3d8];

  function laneOffset(dir) {
    return dir === 0 ? 4 : dir === 1 ? -4 : dir === 2 ? -4 : 4;
  }

  function focusPos() {
    return player.mode === 'car' && player.car ? player.car.pos : player.footPos;
  }
  NH.focusPos = focusPos;

  function removeVehicle(v) {
    if (!v || v.dead) return;
    v.dead = true;
    v.dispose();
    const lists = [cars.traffic, cars.cops, cars.parked];
    for (const list of lists) {
      const i = list.indexOf(v);
      if (i >= 0) list.splice(i, 1);
    }
    if (player.car === v) player.car = null;
  }
  NH.removeVehicle = removeVehicle;

  // ---------------- traffic ----------------
  function nextTarget(x, z, dir) {
    const d = DIRS[dir];
    if (d.x !== 0) {
      const roadZ = Math.round((z - laneOffset(dir)) / 80) * 80;
      let cx = Math.round(x / 80) * 80;
      if (d.x > 0 && cx <= x + 2) cx += 80;
      if (d.x < 0 && cx >= x - 2) cx -= 80;
      return { x: cx, z: roadZ + laneOffset(dir), node: { x: cx, z: roadZ } };
    }
    const roadX = Math.round((x - laneOffset(dir)) / 80) * 80;
    let cz = Math.round(z / 80) * 80;
    if (d.z > 0 && cz <= z + 2) cz += 80;
    if (d.z < 0 && cz >= z - 2) cz -= 80;
    return { x: roadX + laneOffset(dir), z: cz, node: { x: roadX, z: cz } };
  }

  function spawnTrafficCar(atX, atZ, dir) {
    const vertical = dir === 0 || dir === 2;
    const c = vertical ? Math.round(atX / 80) * 80 : Math.round(atZ / 80) * 80;
    let x, z;
    if (vertical) { x = c + laneOffset(dir); z = atZ; }
    else { z = c + laneOffset(dir); x = atX; }
    if (Math.abs(x) > 236 || Math.abs(z) > 236) return null;
    const t = Math.random();
    const type = t < 0.68 ? 'sedan' : t < 0.86 ? 'sport' : 'van';
    const heading = Math.atan2(DIRS[dir].x, DIRS[dir].z);
    const v = new NH.Vehicle({
      x, z, heading, type,
      color: pick(TRAFFIC_COLORS),
      kind: 'traffic',
      maxSpeed: type === 'van' ? 27 : type === 'sport' ? 34 : 31,
      accel: type === 'van' ? 15 : 19
    });
    const nt = nextTarget(x, z, dir);
    v.ai = { dir, target: new THREE.Vector3(nt.x, 0, nt.z), node: nt.node, stuck: 0, reverse: 0, seed: Math.random() * 10 };
    cars.traffic.push(v);
    return v;
  }
  NH.spawnTrafficCar = spawnTrafficCar;

  function spawnRandomTraffic() {
    const focus = focusPos();
    for (let tries = 0; tries < 24; tries++) {
      const vertical = Math.random() < 0.5;
      const c = pick(world.roadCenters);
      const dir = Math.floor(Math.random() * 4);
      // Bias new cars into the area around the player so the streets feel alive.
      const center = vertical ? focus.z : focus.x;
      const along = clamp(center + rand(-115, 115), -215, 215);
      const v = vertical ? spawnTrafficCar(c, along, dir % 2 === 0 ? dir : 0) : spawnTrafficCar(along, c, dir % 2 === 1 ? dir : 1);
      if (v) return v;
    }
    return null;
  }

  function initTraffic() {
    for (let i = 0; i < 20; i++) spawnRandomTraffic();
  }

  function updateTraffic(dt) {
    for (let i = 0; i < cars.traffic.length; i++) {
      const v = cars.traffic[i];
      if (v.dead) continue;
      updateTrafficAI(v, dt);
      v.step(dt);
      updateVehicleFx(v, dt);
    }
  }

  function updateTrafficAI(v, dt) {
    const ai = v.ai;
    if (!ai) return;
    if (ai.reverse > 0) {
      ai.reverse -= dt;
      v.throttle = -1;
      v.brakeInput = 0;
      v.handbrake = false;
      v.steerTarget = 0.3;
      return;
    }
    const dx = ai.target.x - v.pos.x, dz = ai.target.z - v.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 9) {
      const node = ai.node;
      let newDir = ai.dir;
      const roll = Math.random();
      if (roll < 0.52) newDir = ai.dir;
      else if (roll < 0.76) newDir = (ai.dir + 1) % 4;
      else newDir = (ai.dir + 3) % 4;
      let nx = node.x + DIRS[newDir].x * 80;
      let nz = node.z + DIRS[newDir].z * 80;
      if (Math.abs(nx) > 240 || Math.abs(nz) > 240) {
        newDir = (ai.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        nx = node.x + DIRS[newDir].x * 80;
        nz = node.z + DIRS[newDir].z * 80;
        if (Math.abs(nx) > 240 || Math.abs(nz) > 240) newDir = (ai.dir + 2) % 4;
      }
      ai.dir = newDir;
      ai.node = { x: node.x + DIRS[newDir].x * 80, z: node.z + DIRS[newDir].z * 80 };
      const tx = node.x + DIRS[newDir].x * 80 + (DIRS[newDir].x === 0 ? laneOffset(newDir) : 0);
      const tz = node.z + DIRS[newDir].z * 80 + (DIRS[newDir].z === 0 ? laneOffset(newDir) : 0);
      ai.target.set(tx, 0, tz);
    }
    const tdx = ai.target.x - v.pos.x, tdz = ai.target.z - v.pos.z;
    const desired = Math.atan2(tdx, tdz);
    const diff = wrapAngle(desired - v.heading);
    v.steerTarget = clamp(diff * 1.9, -1, 1);
    const speed = v.speed;

    // obstacle ahead
    let obstacle = false;
    const f = { x: Math.sin(v.heading), z: Math.cos(v.heading) };
    const pc = player.car;
    if (pc && pc !== v) {
      const ox = pc.pos.x - v.pos.x, oz = pc.pos.z - v.pos.z;
      const od = Math.hypot(ox, oz);
      if (od < 11 && od > 0.1) {
        const dot = (ox / od) * f.x + (oz / od) * f.z;
        if (dot > 0.72) obstacle = true;
      }
    }

    if (Math.abs(diff) > 1.1) { v.throttle = 0.12; v.brakeInput = 0.8; }
    else if (obstacle) { v.throttle = 0; v.brakeInput = 0.9; }
    else if (speed > 12.5) { v.throttle = 0; v.brakeInput = 0.2; }
    else if (speed < 9) { v.throttle = 0.55; v.brakeInput = 0; }
    else { v.throttle = 0.15; v.brakeInput = 0; }
    v.handbrake = false;

    if (speed < 0.5) ai.stuck += dt; else ai.stuck = 0;
    if (ai.stuck > 2.4) { ai.reverse = 1.1; ai.stuck = 0; }
    if (dist > 150) {
      const nt = nextTarget(v.pos.x, v.pos.z, ai.dir);
      ai.target.set(nt.x, 0, nt.z);
      ai.node = nt.node;
    }
  }

  // ---------------- police ----------------
  function spawnCop() {
    const focus = focusPos();
    const p = world.randomRoadPoint(165, focus, 4, 245);
    const v = new NH.Vehicle({
      x: p.x, z: p.z,
      heading: Math.atan2(focus.x - p.x, focus.z - p.z),
      type: 'police', color: 0xf2f4f7, kind: 'cop',
      maxSpeed: 35.5 + Math.random() * 2.5, accel: 24, health: 130
    });
    v.ai = { stuck: 0, reverse: 0, seed: Math.random() * 10 };
    cops.push(v);
    return v;
  }
  NH.spawnCop = spawnCop;

  function updateCops(dt) {
    const focus = focusPos();
    for (let i = cops.length - 1; i >= 0; i--) {
      const v = cops[i];
      if (v.dead) { cops.splice(i, 1); continue; }
      const distToPlayer = Math.hypot(v.pos.x - focus.x, v.pos.z - focus.z);
      if (distToPlayer > 360) { removeVehicle(v); continue; }
      updateCopAI(v, dt, focus, distToPlayer);
      v.step(dt);
      updateVehicleFx(v, dt);
    }
  }

  function updateCopAI(v, dt, focus, distToPlayer) {
    const ai = v.ai;
    if (ai.reverse > 0) {
      ai.reverse -= dt;
      v.throttle = -1;
      v.brakeInput = 0;
      v.steerTarget = 0.35;
      v.handbrake = false;
      return;
    }
    let tx = focus.x, tz = focus.z;
    if (player.car && player.mode === 'car') {
      tx += player.car.vel.x * 0.35;
      tz += player.car.vel.z * 0.35;
    }
    const desired = Math.atan2(tx - v.pos.x, tz - v.pos.z);
    const diff = wrapAngle(desired - v.heading);
    v.steerTarget = clamp(diff * 2.3, -1, 1);
    v.handbrake = false;
    if (Math.abs(diff) > 1.35 && distToPlayer < 30) {
      v.throttle = 0.2;
      v.brakeInput = 0.9;
    } else if (distToPlayer > 7) {
      v.throttle = 1;
      v.brakeInput = Math.abs(diff) > 0.9 ? 0.5 : 0;
    } else {
      v.throttle = 0.55;
      v.brakeInput = 0;
    }
    if (v.speed < 0.6) ai.stuck += dt; else ai.stuck = 0;
    if (ai.stuck > 2.0) { ai.reverse = 1.15; ai.stuck = 0; }
  }

  function clearCops() {
    for (let i = cops.length - 1; i >= 0; i--) removeVehicle(cops[i]);
    cops.length = 0;
  }
  NH.clearCops = clearCops;

  function updateCopSpawning(dt) {
    if (G.state !== 'play') return;
    const target = G.heat <= 0 ? 0 : Math.min(6, G.heat + (G.heat >= 4 ? 1 : 0));
    if (cops.length < target) {
      G.copSpawnTimer -= dt;
      if (G.copSpawnTimer <= 0) {
        spawnCop();
        G.copSpawnTimer = 1.6;
      }
    } else {
      G.copSpawnTimer = Math.max(G.copSpawnTimer, 0.8);
    }
    if (G.heat <= 0) clearCops();
  }

  function maintainTraffic(dt) {
    if (cars.traffic.length < 20) {
      G.trafficRespawn -= dt;
      if (G.trafficRespawn <= 0) {
        spawnRandomTraffic();
        G.trafficRespawn = 2.8;
      }
    }
  }

  // ---------------- vehicle fx ----------------
  function updateVehicleFx(v, dt) {
    if (v.speed > 8 && (Math.abs(v.lateral) > 4.2 || v.handbrake)) {
      v.skidT -= dt;
      if (v.skidT <= 0) {
        NH.addSkid(v);
        NH.tireSmoke(v);
        v.skidT = 0.055;
      }
    }
    if (v.health < 38) {
      v.smokeT -= dt;
      if (v.smokeT <= 0) {
        const sin = Math.sin(v.heading), cos = Math.cos(v.heading);
        NH.spawnParticle(NH.smokePool, v.pos.x + sin * 1.6, 1.1, v.pos.z + cos * 1.6, {
          color: 0x55525e, size: 0.7, grow: 2.4, life: 0.9,
          vx: rand(-0.5, 0.5), vy: rand(0.8, 2), vz: rand(-0.5, 0.5), gravity: 0.4, opacity: 0.4
        });
        v.smokeT = 0.16;
      }
    }
    if (v.flames) {
      const on = v.kind === 'player' && v.nitroOn && v.speed > 2;
      v.flames.visible = on;
      if (on) {
        const s = 0.8 + Math.random() * 0.6;
        v.flames.children[0].scale.set(1.1 * s, 2.1 * s, 1);
        v.flames.children[1].scale.set(1.1 * s, 2.1 * s, 1);
      }
    }
  }
  NH.updateVehicleFx = updateVehicleFx;

  // ---------------- parked cars ----------------
  function initParked() {
    for (const p of world.parkedCars) {
      const type = Math.random() < 0.8 ? 'sedan' : 'van';
      const v = new NH.Vehicle({
        x: p.x, z: p.z, heading: p.heading, type,
        color: p.color, kind: 'parked',
        maxSpeed: type === 'van' ? 28 : 33, accel: 17
      });
      cars.parked.push(v);
    }
  }

  // ---------------- pedestrians ----------------
  const PED_N = 46;
  const pedBodies = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.5, 0.68, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    PED_N
  );
  const pedHeads = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.19, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xd8a07a, roughness: 0.85 }),
    PED_N
  );
  const legGeo = new THREE.BoxGeometry(0.17, 0.62, 0.2);
  legGeo.translate(0, -0.31, 0);
  const pedLegs = new THREE.InstancedMesh(
    legGeo,
    new THREE.MeshStandardMaterial({ color: 0x24242c, roughness: 0.9 }),
    PED_N * 2
  );
  pedBodies.castShadow = false; pedHeads.castShadow = false; pedLegs.castShadow = false;
  pedBodies.frustumCulled = false; pedHeads.frustumCulled = false; pedLegs.frustumCulled = false;
  scene.add(pedBodies); scene.add(pedHeads); scene.add(pedLegs);

  const pedDummy = new THREE.Object3D();
  pedDummy.rotation.order = 'YXZ';
  const peds = [];
  const PED_COLORS = [0x41f5ff, 0xff2e79, 0xffc93c, 0xb56bff, 0x7dffb2, 0xe8e8f0, 0xff7a3c, 0x3c8cff];

  function initPeds() {
    const routes = world.pedRoutes;
    for (let i = 0; i < PED_N; i++) {
      const route = routes[i % routes.length];
      const offX = rand(-2, 2), offZ = rand(-2, 2);
      peds.push({
        route: route.map(p => new THREE.Vector3(p.x + offX, 0, p.z + offZ)),
        seg: Math.floor(Math.random() * 4),
        pos: new THREE.Vector3(),
        speed: rand(1.0, 1.6),
        phase: Math.random() * 6.28,
        hidden: 0,
        flee: 0,
        heading: 0
      });
      const ped = peds[i];
      ped.pos.copy(ped.route[ped.seg]);
      pedBodies.setColorAt(i, new THREE.Color(pick(PED_COLORS)));
    }
    if (pedBodies.instanceColor) pedBodies.instanceColor.needsUpdate = true;
  }

  function updatePeds(dt) {
    const car = player.car;
    for (let i = 0; i < peds.length; i++) {
      const p = peds[i];
      if (p.hidden > 0) {
        p.hidden -= dt;
        pedDummy.position.set(0, -30, 0);
        pedDummy.scale.setScalar(0.001);
        pedDummy.rotation.set(0, 0, 0);
        pedDummy.updateMatrix();
        pedBodies.setMatrixAt(i, pedDummy.matrix);
        pedHeads.setMatrixAt(i, pedDummy.matrix);
        pedLegs.setMatrixAt(i * 2, pedDummy.matrix);
        pedLegs.setMatrixAt(i * 2 + 1, pedDummy.matrix);
        continue;
      }
      const target = p.route[p.seg];
      let dx = target.x - p.pos.x, dz = target.z - p.pos.z;
      let dist = Math.hypot(dx, dz);
      if (dist < 1.4) {
        p.seg = (p.seg + 1) % 4;
        const nt = p.route[p.seg];
        dx = nt.x - p.pos.x; dz = nt.z - p.pos.z;
        dist = Math.hypot(dx, dz) || 1;
      }
      let moveSpeed = p.speed;
      let mx = dx / (dist || 1), mz = dz / (dist || 1);
      if (car && car.speed > 3.5) {
        const cdx = p.pos.x - car.pos.x, cdz = p.pos.z - car.pos.z;
        const cd = Math.hypot(cdx, cdz);
        if (cd < 3.6) {
          p.flee = 0.7;
          mx = cdx / (cd || 1); mz = cdz / (cd || 1);
          moveSpeed = 3.4;
          if (cd < 1.8) {
            p.hidden = 7;
            if (NH.addHeat) NH.addHeat(1, 'RECKLESS DRIVING');
            NH.sparks(new THREE.Vector3(p.pos.x, 0.8, p.pos.z), 4);
            audio.bad();
          }
        }
      }
      if (p.flee > 0) { p.flee -= dt; moveSpeed = 3.2; }
      p.pos.x += mx * moveSpeed * dt;
      p.pos.z += mz * moveSpeed * dt;
      p.heading = Math.atan2(mx, mz);
      p.phase += moveSpeed * dt * 3.2;
      const bob = Math.sin(p.phase * 2) * 0.025;

      pedDummy.position.set(p.pos.x, 0.22 + 1.15 + bob, p.pos.z);
      pedDummy.rotation.set(0, p.heading, 0);
      pedDummy.scale.setScalar(1);
      pedDummy.updateMatrix();
      pedBodies.setMatrixAt(i, pedDummy.matrix);

      pedDummy.position.set(p.pos.x, 0.22 + 1.66 + bob, p.pos.z);
      pedDummy.rotation.set(0, p.heading, 0);
      pedDummy.updateMatrix();
      pedHeads.setMatrixAt(i, pedDummy.matrix);

      const rx = Math.cos(p.heading), rz = -Math.sin(p.heading);
      for (let l = 0; l < 2; l++) {
        const side = l === 0 ? -1 : 1;
        pedDummy.position.set(p.pos.x + rx * side * 0.12, 0.22 + 0.78, p.pos.z + rz * side * 0.12);
        pedDummy.rotation.set(Math.sin(p.phase + l * Math.PI) * 0.62, p.heading, 0);
        pedDummy.scale.setScalar(1);
        pedDummy.updateMatrix();
        pedLegs.setMatrixAt(i * 2 + l, pedDummy.matrix);
      }
    }
    pedBodies.instanceMatrix.needsUpdate = true;
    pedHeads.instanceMatrix.needsUpdate = true;
    pedLegs.instanceMatrix.needsUpdate = true;
  }

  // ---------------- pickups ----------------
  function makeIconTexture(char, color) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.font = '900 92px "Arial Black", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = color; g.shadowBlur = 24;
    g.fillStyle = color;
    g.fillText(char, 64, 68);
    g.shadowBlur = 6;
    g.fillStyle = '#ffffff';
    g.globalAlpha = 0.92;
    g.fillText(char, 64, 68);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const cashTex = makeIconTexture('$', '#5dff9a');
  const repairTex = makeIconTexture('+', '#41f5ff');

  const pickups = [];
  NH.pickups = pickups;

  function makePickup(type) {
    const group = new THREE.Group();
    const tex = type === 'cash' ? cashTex : repairTex;
    const color = type === 'cash' ? 0x5dff9a : 0x41f5ff;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    sp.scale.set(2.4, 2.4, 1);
    sp.position.y = 1.8;
    group.add(sp);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.05, 1.55, 28),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.07;
    group.add(ring);
    group.visible = false;
    scene.add(group);
    const p = { type, group, sprite: sp, ring, active: false, respawn: 0, phase: Math.random() * 6.28, pos: new THREE.Vector3() };
    pickups.push(p);
    return p;
  }

  function placePickup(p, minDist) {
    const focus = focusPos();
    const pos = world.randomRoadPoint(minDist || 55, focus, 2, 265);
    p.pos.copy(pos);
    p.group.position.copy(pos);
    p.group.visible = true;
    p.active = true;
  }

  function initPickups() {
    for (let i = 0; i < 5; i++) {
      const p = makePickup('cash');
      placePickup(p, 45);
    }
    for (let i = 0; i < 3; i++) {
      const p = makePickup('repair');
      placePickup(p, 65);
    }
  }

  function updatePickups(dt) {
    const focus = focusPos();
    for (const p of pickups) {
      if (!p.active) {
        p.respawn -= dt;
        if (p.respawn <= 0) placePickup(p, 70);
        continue;
      }
      p.phase += dt * 2.2;
      p.sprite.position.y = 1.8 + Math.sin(p.phase) * 0.22;
      p.ring.rotation.z += dt * 1.4;
      p.ring.scale.setScalar(1 + Math.sin(p.phase * 1.7) * 0.09);
      const d = Math.hypot(focus.x - p.pos.x, focus.z - p.pos.z);
      if (d < 5.2) {
        if (p.type === 'cash') {
          G.cash += 350;
          toast('CASH +$350', 'gold');
          audio.pickup();
          NH.goldBurst(p.pos);
          p.active = false; p.group.visible = false; p.respawn = 12;
        } else {
          if (player.car && player.car.health < 98) {
            player.car.health = Math.min(100, player.car.health + 35);
            toast('ARMOR REPAIRED +35', 'cyan');
            audio.repair();
            NH.goldBurst(p.pos);
            p.active = false; p.group.visible = false; p.respawn = 20;
          }
        }
      }
    }
  }
  NH.updatePickups = updatePickups;

  // ---------------- mission marker ----------------
  let marker = null;
  const markerGroup = new THREE.Group();
  {
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 60, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffc93c, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    );
    beam.position.y = 30;
    markerGroup.add(beam);
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 60, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffe7a0, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    );
    core.position.y = 30;
    markerGroup.add(core);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.9, 4.7, 44),
      new THREE.MeshBasicMaterial({ color: 0xffc93c, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    markerGroup.add(ring);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(3.7, 32),
      new THREE.MeshBasicMaterial({ color: 0xffc93c, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.06;
    markerGroup.add(disc);
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.05, 0),
      new THREE.MeshBasicMaterial({ color: 0xffd45c, toneMapped: false })
    );
    gem.position.y = 3.8;
    markerGroup.add(gem);
    marker = { group: markerGroup, ring, gem, beam };
    markerGroup.visible = false;
    scene.add(markerGroup);
  }

  function newDrop() {
    const focus = focusPos();
    const pos = world.randomRoadPoint(155, focus, 0, 300);
    G.drop.copy(pos);
    markerGroup.position.copy(pos);
    markerGroup.visible = true;
    return pos;
  }
  NH.newDrop = newDrop;
  NH.hideDrop = () => { markerGroup.visible = false; };
  NH.showDrop = () => { markerGroup.visible = true; };

  function updateMarker(dt) {
    if (!markerGroup.visible) return;
    marker.ring.rotation.z += dt * 0.8;
    marker.ring.scale.setScalar(1 + Math.sin(G.time * 2.4) * 0.08);
    marker.gem.rotation.y += dt * 1.6;
    marker.gem.position.y = 3.8 + Math.sin(G.time * 2) * 0.35;
    marker.beam.material.opacity = 0.09 + Math.sin(G.time * 1.8) * 0.025;
  }

  // ---------------- init ----------------
  initParked();
  initTraffic();
  initPeds();
  initPickups();

  NH.updateTraffic = updateTraffic;
  NH.updateCops = updateCops;
  NH.updateCopSpawning = updateCopSpawning;
  NH.maintainTraffic = maintainTraffic;
  NH.updatePeds = updatePeds;
  NH.updateMarker = updateMarker;
  NH.allVehicles = function () {
    const arr = [];
    if (player.car) arr.push(player.car);
    for (const v of cars.traffic) arr.push(v);
    for (const v of cops) arr.push(v);
    for (const v of cars.parked) arr.push(v);
    return arr;
  };
})();
