/* NEON HEAT — player, chase loop, HUD */
(function () {
  'use strict';
  const NH = window.NH;
  const {
    THREE, scene, camera, renderer, canvas, world, G, player, input, cars, cops, audio,
    clamp, lerp, wrapAngle, rand, pick, toast, showCenter, flashDamage, isTouch
  } = NH;

  const $ = id => document.getElementById(id);

  // ---------------- character ----------------
  const character = new THREE.Group();
  const charParts = {};
  {
    const jacket = new THREE.MeshStandardMaterial({ color: 0x24c9dd, roughness: 0.65, metalness: 0.1 });
    const jacket2 = new THREE.MeshStandardMaterial({ color: 0x15222c, roughness: 0.7 });
    const pants = new THREE.MeshStandardMaterial({ color: 0x1c1d26, roughness: 0.9 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xc98f68, roughness: 0.8 });
    const hair = new THREE.MeshStandardMaterial({ color: 0x16131a, roughness: 0.9 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.7, 0.32), jacket);
    torso.position.y = 1.17; torso.castShadow = true;
    character.add(torso);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.2, 0.34), jacket2);
    chest.position.y = 1.38; character.add(chest);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 9), skin);
    head.position.y = 1.69; head.castShadow = true; character.add(head);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.11, 0.38), hair);
    cap.position.y = 1.84; character.add(cap);

    function limb(mat, w, h, d, x, y, pivotDown) {
      const g = new THREE.BoxGeometry(w, h, d);
      g.translate(0, -pivotDown, 0);
      const m = new THREE.Mesh(g, mat);
      m.position.set(x, y, 0);
      m.castShadow = true;
      character.add(m);
      return m;
    }
    charParts.legL = limb(pants, 0.18, 0.68, 0.2, -0.14, 0.82, 0.34);
    charParts.legR = limb(pants, 0.18, 0.68, 0.2, 0.14, 0.82, 0.34);
    charParts.armL = limb(jacket, 0.14, 0.58, 0.16, -0.35, 1.42, 0.29);
    charParts.armR = limb(jacket, 0.14, 0.58, 0.16, 0.35, 1.42, 0.29);
    charParts.torso = torso;
    charParts.head = head;
    character.visible = false;
    scene.add(character);
  }

  // ---------------- player car ----------------
  function createPlayerCar(x, z, heading) {
    const car = new NH.Vehicle({
      x, z, heading, type: 'sport', color: 0xe8263f, kind: 'player',
      maxSpeed: 42, accel: 26, health: 100
    });
    NH.attachPlayerKit(car);
    NH.setPlayerKit(car, true);
    return car;
  }

  const hero = createPlayerCar(world.spawn.x, world.spawn.z, world.spawn.heading);
  player.car = hero;
  player.mode = 'car';
  player.footPos.set(world.spawn.x + 3, 0.22, world.spawn.z);
  player.footHeading = world.spawn.heading;
  player.camYaw = world.spawn.heading;
  character.visible = false;
  NH.setPlayerKit(hero, true);

  // ---------------- collisions ----------------
  function damageVehicle(v, amount) {
    if (!v || v.dead) return;
    v.health -= amount;
    if (v.health <= 0) { v.health = 0; destroyVehicle(v); }
  }

  function destroyVehicle(v) {
    if (!v || v.dead) return;
    if (v === player.car && v.kind === 'player') { playerWrecked(v); return; }
    const kind = v.kind;
    const pos = v.pos.clone();
    NH.removeVehicle(v);
    NH.explosion(pos, kind === 'cop');
    audio.explosion();
    if (kind === 'cop') {
      G.cash += 250;
      toast('COP WRECKED  +$250', 'gold');
    }
  }

  function collideCars() {
    const list = NH.allVehicles();
    const now = performance.now();
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (a.dead) continue;
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        if (b.dead) continue;
        if (a.kind === 'parked' && b.kind === 'parked') continue;
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz) || 0.001;
        const minD = a.radius + b.radius;
        if (d >= minD) continue;
        const nx = dx / d, nz = dz / d;
        const overlap = minD - d;
        const aStatic = a.kind === 'parked';
        const bStatic = b.kind === 'parked';
        const wa = aStatic ? 0 : (bStatic ? 1 : 0.5);
        const wb = bStatic ? 0 : (aStatic ? 1 : 0.5);
        a.pos.x -= nx * overlap * wa; a.pos.z -= nz * overlap * wa;
        b.pos.x += nx * overlap * wb; b.pos.z += nz * overlap * wb;
        a.group.position.x = a.pos.x; a.group.position.z = a.pos.z;
        b.group.position.x = b.pos.x; b.group.position.z = b.pos.z;
        const rvx = b.vel.x - a.vel.x, rvz = b.vel.z - a.vel.z;
        const closing = -(rvx * nx + rvz * nz);
        if (closing > 0) {
          const imp = closing * 0.55;
          if (!aStatic) { a.vel.x -= nx * imp; a.vel.z -= nz * imp; }
          if (!bStatic) { b.vel.x += nx * imp; b.vel.z += nz * imp; }
          if (closing > 5 && now - a.lastCrash > 220) {
            a.lastCrash = now; b.lastCrash = now;
            const dmg = (closing - 5) * 2.1;
            damageVehicle(a, dmg);
            damageVehicle(b, dmg);
            const mx = (a.pos.x + b.pos.x) / 2, mz = (a.pos.z + b.pos.z) / 2;
            NH.sparks(new THREE.Vector3(mx, 0.8, mz), Math.min(14, Math.round(closing)));
            if (now - G.lastCrashSound > 130) { audio.crash(Math.min(12, closing)); G.lastCrashSound = now; }
            if (a === player.car || b === player.car) {
              G.shake = Math.min(1.7, G.shake + closing * 0.03);
              flashDamage(Math.min(0.65, closing * 0.035));
            }
          }
        }
      }
    }
  }

  NH.onVehicleImpact = function (v, impact) {
    if (impact < 5 || v.dead) return;
    const now = performance.now();
    if (now - (v.lastHit || 0) < 240) return;
    v.lastHit = now;
    damageVehicle(v, (impact - 5) * 1.55);
    NH.sparks(v.pos, Math.min(12, Math.round(impact)));
    if (now - G.lastCrashSound > 120) { audio.crash(Math.min(10, impact)); G.lastCrashSound = now; }
    if (v === player.car && player.mode === 'car') {
      G.shake = Math.min(1.7, G.shake + impact * 0.03);
      flashDamage(Math.min(0.7, impact * 0.04));
    }
  };

  // ---------------- player update ----------------
  function focusPos() {
    return player.mode === 'car' && player.car ? player.car.pos : player.footPos;
  }

  function readInput() {
    const k = keys;
    let th = (k['w'] || k['arrowup'] ? 1 : 0) + (k['s'] || k['arrowdown'] ? -1 : 0);
    let st = (k['d'] || k['arrowright'] ? 1 : 0) + (k['a'] || k['arrowleft'] ? -1 : 0);
    if (input.joyActive) { th = input.joyY; st = input.joyX; }
    input.throttle = clamp(th, -1, 1);
    input.steer = clamp(st, -1, 1);
    input.handbrake = !!k[' '] || input.touchBrake;
    input.nitro = !!k['shift'] || input.touchNitro;
    if (input.touchBrake) input.throttle = Math.min(input.throttle, 0);
  }

  function updatePlayer(dt) {
    if (player.mode === 'car' && player.car) {
      const car = player.car;
      car.throttle = input.throttle;
      car.steerTarget = input.steer;
      car.handbrake = input.handbrake;
      car.brakeInput = input.touchBrake ? 1 : (input.handbrake ? 0.65 : 0);
      const wantNitro = input.nitro && G.nitro > 2 && car.speed > 2;
      G.nitroActive = wantNitro;
      if (wantNitro) G.nitro = Math.max(0, G.nitro - 30 * dt);
      else G.nitro = Math.min(100, G.nitro + 8 * dt);
      car.nitroOn = wantNitro;
      car.step(dt);
      NH.updateVehicleFx(car, dt);
      if (car.health < 35 && Math.random() < dt * 6) flashDamage(0.08);
    } else {
      G.nitroActive = false;
      G.nitro = Math.min(100, G.nitro + 12 * dt);
      updateFoot(dt);
    }
  }

  function updateFoot(dt) {
    const f = { x: Math.sin(player.camYaw), z: Math.cos(player.camYaw) };
    const r = { x: Math.cos(player.camYaw), z: -Math.sin(player.camYaw) };
    let mx = f.x * input.throttle + r.x * input.steer;
    let mz = f.z * input.throttle + r.z * input.steer;
    const len = Math.hypot(mx, mz);
    const sprint = input.nitro;
    if (len > 0.12) {
      mx /= len; mz /= len;
      const spd = sprint ? 9.5 : 6.2;
      player.footPos.x += mx * spd * dt;
      player.footPos.z += mz * spd * dt;
      player.footHeading = Math.atan2(mx, mz);
      player.walkPhase += spd * dt * 2.4;
      if (!dragging && performance.now() - lastDrag > 900) {
        player.camYaw += wrapAngle(player.footHeading - player.camYaw) * Math.min(1, dt * 1.5);
      }
    }
    // building collision
    const list = world.queryBuildings(player.footPos.x, player.footPos.z, 1.2, []);
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      const cx = clamp(player.footPos.x, c.minX, c.maxX);
      const cz = clamp(player.footPos.z, c.minZ, c.maxZ);
      const dx = player.footPos.x - cx, dz = player.footPos.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < 0.36 && d2 > 1e-7) {
        const d = Math.sqrt(d2);
        player.footPos.x += (dx / d) * (0.6 - d);
        player.footPos.z += (dz / d) * (0.6 - d);
      }
    }
    const B = world.bound - 1;
    player.footPos.x = clamp(player.footPos.x, -B, B);
    player.footPos.z = clamp(player.footPos.z, -B, B);
    player.footPos.y = 0.22;

    const moving = len > 0.12;
    if (moving) player.walkPhase += 0;
    const swing = moving ? Math.sin(player.walkPhase) * 0.62 : 0;
    charParts.legL.rotation.x = swing;
    charParts.legR.rotation.x = -swing;
    charParts.armL.rotation.x = -swing * 0.75;
    charParts.armR.rotation.x = swing * 0.75;
    character.position.set(player.footPos.x, 0.22 + (moving ? Math.abs(Math.sin(player.walkPhase)) * 0.03 : 0), player.footPos.z);
    character.rotation.y = player.footHeading;
  }

  // ---------------- enter / exit ----------------
  function nearestVehicle(maxD) {
    let best = null, bd = maxD;
    const list = NH.allVehicles();
    for (const v of list) {
      if (v.dead) continue;
      const d = Math.hypot(v.pos.x - player.footPos.x, v.pos.z - player.footPos.z);
      if (d < bd) { bd = d; best = v; }
    }
    return best;
  }

  function isFreeFoot(x, z) {
    if (Math.abs(x) > world.bound - 1 || Math.abs(z) > world.bound - 1) return false;
    const list = world.queryBuildings(x, z, 1.2, []);
    for (const c of list) {
      const cx = clamp(x, c.minX, c.maxX), cz = clamp(z, c.minZ, c.maxZ);
      if ((x - cx) * (x - cx) + (z - cz) * (z - cz) < 0.8) return false;
    }
    return true;
  }

  function enterVehicle(v) {
    if (!v || v.dead) return;
    const old = player.car;
    if (old && old !== v) {
      old.kind = 'parked';
      old.throttle = 0; old.brakeInput = 1; old.nitroOn = false;
      NH.setPlayerKit(old, false);
      if (!cars.parked.includes(old)) cars.parked.push(old);
    }
    const ti = cars.traffic.indexOf(v);
    if (ti >= 0) cars.traffic.splice(ti, 1);
    const ci = cops.indexOf(v);
    if (ci >= 0) cops.splice(ci, 1);
    const pi = cars.parked.indexOf(v);
    if (pi >= 0) cars.parked.splice(pi, 1);

    const stolen = v !== old && v !== hero;
    v.kind = 'player';
    v.ai = null;
    v.dead = false;
    v.parked = false;
    v.health = Math.max(v.health, 55);
    v.vel.set(0, 0, 0);
    v.throttle = 0;
    player.car = v;
    player.mode = 'car';
    character.visible = false;
    NH.setPlayerKit(v, true);
    if (stolen) {
      G.heat = Math.min(5, G.heat + 1);
      G.cooling = 0;
      toast(v.type === 'police' ? 'CRUISER STOLEN  ·  HEAT UP' : 'GRAND THEFT AUTO  ·  HEAT UP', 'red');
      audio.bad();
    } else {
      audio.click();
    }
    NH.camInit = false;
    G.shake = 0;
  }

  function exitVehicle() {
    const car = player.car;
    if (!car) return;
    const sin = Math.sin(car.heading), cos = Math.cos(car.heading);
    const rx = cos, rz = -sin;
    let fx = car.pos.x + rx * 3.1, fz = car.pos.z + rz * 3.1;
    if (!isFreeFoot(fx, fz)) { fx = car.pos.x - rx * 3.1; fz = car.pos.z - rz * 3.1; }
    if (!isFreeFoot(fx, fz)) { fx = car.pos.x - sin * 3.6; fz = car.pos.z - cos * 3.6; }
    if (!isFreeFoot(fx, fz)) { fx = car.pos.x; fz = car.pos.z; }
    player.footPos.set(fx, 0.22, fz);
    player.footHeading = car.heading;
    player.camYaw = car.heading;
    player.mode = 'foot';
    character.visible = true;
    character.position.set(fx, 0.22, fz);
    car.kind = 'parked';
    car.throttle = 0; car.brakeInput = 1; car.handbrake = false; car.nitroOn = false;
    car.vel.multiplyScalar(0.25);
    NH.setPlayerKit(car, false);
    audio.click();
  }

  function toggleEnterExit() {
    if (G.state !== 'play') return;
    if (player.mode === 'car') exitVehicle();
    else {
      const v = nearestVehicle(5.6);
      if (v) enterVehicle(v);
      else toast('NO CAR CLOSE ENOUGH', 'cyan');
    }
  }

  // ---------------- heat / mission ----------------
  function addHeat(n, reason) {
    if (G.state !== 'play') return;
    if (reason === 'RECKLESS DRIVING') {
      if (G.pedHeatCooldown > 0) return;
      G.pedHeatCooldown = 5;
    }
    G.heat = Math.min(5, G.heat + n);
    G.cooling = 0;
    if (reason) toast(reason + '  ·  HEAT UP', 'red');
  }
  NH.addHeat = addHeat;

  function deliver() {
    const reward = 1200 + G.heat * 450 + Math.floor(G.timer) * 12;
    G.cash += reward;
    G.deliveries++;
    G.best = Math.max(G.best, G.deliveries);
    if (player.car) player.car.health = Math.min(100, player.car.health + 20);
    G.heat = Math.min(5, G.heat + 1);
    G.timer = 105;
    G.cooling = 0;
    G.nitro = Math.min(100, G.nitro + 25);
    NH.goldBurst(G.drop);
    NH.newDrop();
    G.copSpawnTimer = 0;
    audio.delivery();
    showCenter('DELIVERED', '+$' + reward.toLocaleString('en-US'), '#ffd45c');
    toast('DROP COMPLETE  +$' + reward.toLocaleString('en-US'), 'gold');
  }

  function failDelivery() {
    G.heat = Math.min(5, G.heat + 1);
    G.timer = 105;
    G.cooling = 0;
    NH.newDrop();
    toast('TIME UP  ·  HEAT RISES', 'red');
    audio.bad();
    flashDamage(0.5);
  }

  function updateMission(dt) {
    G.timer -= dt;
    if (G.timer <= 0) failDelivery();
    G.pedHeatCooldown = Math.max(0, G.pedHeatCooldown - dt);

    const focus = focusPos();
    const d = Math.hypot(focus.x - G.drop.x, focus.z - G.drop.z);
    if (player.mode === 'car' && d < 10.5) deliver();

    let nearest = Infinity;
    for (const c of cops) {
      const cd = Math.hypot(c.pos.x - focus.x, c.pos.z - focus.z);
      if (cd < nearest) nearest = cd;
    }
    if (nearest > 70) G.cooling += dt;
    else G.cooling = Math.max(0, G.cooling - dt * 1.7);
    if (G.cooling >= 14 && G.heat > 0) {
      G.heat--;
      G.cooling = 0;
      if (G.heat <= 0) {
        NH.clearCops();
        toast('COPS LOST  ·  HEAT CLEARED', 'cyan');
        showCenter('HEAT LOST', 'THE CITY FORGETS... FOR NOW', '#41f5ff');
      } else {
        toast('HEAT COOLING  ·  LOST A STAR', 'cyan');
      }
    }

    // busted on foot
    if (player.mode === 'foot') {
      let near = Infinity;
      for (const c of cops) near = Math.min(near, Math.hypot(c.pos.x - player.footPos.x, c.pos.z - player.footPos.z));
      if (near < 4) player.bustTimer += dt;
      else player.bustTimer = Math.max(0, player.bustTimer - dt * 2);
      if (player.bustTimer > 2.2) playerBusted();
    } else {
      player.bustTimer = 0;
    }
  }

  // ---------------- wreck / respawn ----------------
  function playerWrecked(car) {
    if (G.state === 'wrecked') return;
    G.state = 'wrecked';
    G.busted = false;
    G.wreckTimer = 4.6;
    G.deathPos.copy(car.pos);
    NH.explosion(car.pos, true);
    audio.explosion();
    flashDamage(1);
    G.shake = 1.7;
    player.car = null;
    player.mode = 'foot';
    character.visible = false;
    NH.removeVehicle(car);
    $('wreck-title').textContent = 'WRECKED';
    $('wreck-sub').textContent = 'YOUR RIDE IS SCRAP METAL';
    showWrecked();
  }

  function playerBusted() {
    if (G.state === 'wrecked') return;
    const car = player.car;
    G.state = 'wrecked';
    G.busted = true;
    G.wreckTimer = 4.2;
    if (car) {
      G.deathPos.copy(car.pos);
      car.kind = 'parked';
      car.throttle = 0; car.brakeInput = 1; car.nitroOn = false;
      NH.setPlayerKit(car, false);
      if (!cars.parked.includes(car)) cars.parked.push(car);
      player.car = null;
    } else {
      G.deathPos.copy(player.footPos);
    }
    player.mode = 'foot';
    character.visible = false;
    audio.bad();
    flashDamage(0.6);
    $('wreck-title').textContent = 'BUSTED';
    $('wreck-sub').textContent = 'THE COPS GOT YOU';
    showWrecked();
  }

  function showWrecked() {
    $('wreck-cash').textContent = '$' + G.cash.toLocaleString('en-US');
    $('wreck-deliv').textContent = String(G.deliveries);
    $('wreck-best').textContent = String(G.best);
    $('wrecked').classList.remove('hidden');
    $('hud').classList.add('hidden');
    syncTouchUI();
    audio.setEngine(0, 0, false, false);
    audio.setSiren(999, 0);
  }

  function respawn() {
    if (G.state !== 'wrecked') return;
    $('wrecked').classList.add('hidden');
    G.state = 'play';
    G.busted = false;
    G.best = Math.max(G.best, G.deliveries);
    G.cash = Math.max(0, G.cash - 500);
    G.heat = 1;
    G.timer = 110;
    G.cooling = 0;
    G.nitro = 100;
    NH.clearCops();
    if (player.car) {
      const old = player.car;
      old.kind = 'parked';
      if (!cars.parked.includes(old)) cars.parked.push(old);
      player.car = null;
    }
    const car = createPlayerCar(world.spawn.x, world.spawn.z, world.spawn.heading);
    player.car = car;
    player.mode = 'car';
    character.visible = false;
    NH.setPlayerKit(car, true);
    NH.newDrop();
    NH.camInit = false;
    $('hud').classList.remove('hidden');
    syncTouchUI();
    showCenter('BACK IN THE SEAT', '-$500  ·  NEW RIDE', '#41f5ff');
    toast('RESPAWNED  -$500', 'cyan');
    audio.delivery();
    input.joyActive = false;
  }

  function restartRun() {
    $('wrecked').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('start').classList.add('hidden');
    G.state = 'play';
    G.busted = false;
    NH.clearCops();
    if (player.car) {
      const old = player.car;
      old.kind = 'parked';
      if (!cars.parked.includes(old)) cars.parked.push(old);
      player.car = null;
    }
    // clear leftover parked player cars for a clean run
    for (let i = cars.parked.length - 1; i >= 0; i--) {
      const p = cars.parked[i];
      if (p.kind === 'parked' && p.type === 'sport' && p.color === 0xe8263f) {
        NH.removeVehicle(p);
      }
    }
    G.cash = 0;
    G.deliveries = 0;
    G.best = 0;
    G.heat = 2;
    G.timer = 110;
    G.cooling = 0;
    G.nitro = 100;
    G.pedHeatCooldown = 0;
    const car = createPlayerCar(world.spawn.x, world.spawn.z, world.spawn.heading);
    player.car = car;
    player.mode = 'car';
    character.visible = false;
    NH.setPlayerKit(car, true);
    NH.newDrop();
    NH.spawnCop();
    NH.spawnCop();
    NH.camInit = false;
    $('hud').classList.remove('hidden');
    syncTouchUI();
    showCenter('RUN RESTARTED', 'THE HEAT IS ON', '#ff2e79');
    audio.click();
    input.joyActive = false;
  }

  // ---------------- camera ----------------
  const camLook = NH.cameraLook;
  let camFov = 62;

  function snapCamera() {
    const focus = focusPos();
    const sin = Math.sin(player.mode === 'car' && player.car ? player.car.heading : player.footHeading);
    const cos = Math.cos(player.mode === 'car' && player.car ? player.car.heading : player.footHeading);
    camera.position.set(focus.x - sin * 9, 4.4, focus.z - cos * 9);
    camLook.set(focus.x + sin * 4, 1.5, focus.z + cos * 4);
    camera.lookAt(camLook);
    NH.camInit = true;
  }

  function updateCamera(dt) {
    if (G.state === 'menu') {
      G.menuAngle += dt * 0.12;
      const focus = player.car ? player.car.pos : new THREE.Vector3(0, 0, 0);
      const r = 16;
      const dx = focus.x + Math.cos(G.menuAngle) * r;
      const dz = focus.z + Math.sin(G.menuAngle) * r;
      camera.position.x += (dx - camera.position.x) * Math.min(1, dt * 2.5);
      camera.position.y += (7.2 - camera.position.y) * Math.min(1, dt * 2.5);
      camera.position.z += (dz - camera.position.z) * Math.min(1, dt * 2.5);
      camera.lookAt(focus.x, 1.0, focus.z);
      camLook.set(focus.x, 1, focus.z);
      camFov += (58 - camFov) * Math.min(1, dt * 3);
      camera.fov = camFov;
      camera.updateProjectionMatrix();
      return;
    }
    if (G.state === 'wrecked') {
      G.menuAngle += dt * 0.22;
      const focus = G.deathPos;
      const r = 13;
      const dx = focus.x + Math.cos(G.menuAngle) * r;
      const dz = focus.z + Math.sin(G.menuAngle) * r;
      camera.position.x += (dx - camera.position.x) * Math.min(1, dt * 2);
      camera.position.y += (6 - camera.position.y) * Math.min(1, dt * 2);
      camera.position.z += (dz - camera.position.z) * Math.min(1, dt * 2);
      camera.lookAt(focus.x, 1, focus.z);
      camera.fov = 60; camera.updateProjectionMatrix();
      return;
    }

    let desired = new THREE.Vector3();
    let targetFov = 62;
    let focus;
    if (player.mode === 'car' && player.car) {
      const v = player.car;
      focus = v.pos;
      const sin = Math.sin(v.heading), cos = Math.cos(v.heading);
      const rx = cos, rz = -sin;
      const sp = v.speed;
      const back = 8.4 + sp * 0.06;
      const height = 4.05 + sp * 0.014;
      desired.set(
        v.pos.x - sin * back + rx * v.steer * 0.55,
        height,
        v.pos.z - cos * back + rz * v.steer * 0.55
      );
      const t = world.segmentBlocked(v.pos.x, v.pos.z, desired.x, desired.z, 0.8);
      if (t < 1) {
        desired.x = v.pos.x + (desired.x - v.pos.x) * Math.max(0.25, t - 0.06);
        desired.z = v.pos.z + (desired.z - v.pos.z) * Math.max(0.25, t - 0.06);
        desired.y = Math.max(desired.y, height + 1.2);
      }
      const look = new THREE.Vector3(v.pos.x + sin * 7, 1.6, v.pos.z + cos * 7);
      camera.position.lerp(desired, 1 - Math.exp(-dt * 7));
      camLook.lerp(look, 1 - Math.exp(-dt * 9));
      camera.lookAt(camLook);
      targetFov = 62 + Math.min(1, sp / 52) * 9 + (v.nitroOn ? 7 : 0);
    } else {
      focus = player.footPos;
      const yaw = player.camYaw;
      const pitch = player.camPitch;
      const dist = 6.2;
      const cp = Math.cos(pitch);
      desired.set(
        player.footPos.x - Math.sin(yaw) * dist * cp,
        1.4 + Math.sin(pitch) * dist,
        player.footPos.z - Math.cos(yaw) * dist * cp
      );
      const t = world.segmentBlocked(player.footPos.x, player.footPos.z, desired.x, desired.z, 0.6);
      if (t < 1) {
        desired.x = player.footPos.x + (desired.x - player.footPos.x) * Math.max(0.3, t - 0.05);
        desired.z = player.footPos.z + (desired.z - player.footPos.z) * Math.max(0.3, t - 0.05);
      }
      const look = new THREE.Vector3(
        player.footPos.x + Math.sin(yaw) * 2.2,
        1.45,
        player.footPos.z + Math.cos(yaw) * 2.2
      );
      camera.position.lerp(desired, 1 - Math.exp(-dt * 8));
      camLook.lerp(look, 1 - Math.exp(-dt * 9));
      camera.lookAt(camLook);
      targetFov = 64;
    }

    // shake
    if (G.shake > 0.001) {
      const s = G.shake;
      camera.position.x += (Math.random() - 0.5) * s * 0.55;
      camera.position.y += (Math.random() - 0.5) * s * 0.4;
      camera.position.z += (Math.random() - 0.5) * s * 0.55;
      camera.rotation.z += (Math.random() - 0.5) * s * 0.012;
      G.shake = Math.max(0, G.shake - dt * 2.4);
    }
    camFov += (targetFov - camFov) * Math.min(1, dt * 4);
    camera.fov = camFov;
    camera.updateProjectionMatrix();
  }

  // ---------------- HUD ----------------
  const ui = {
    hud: $('hud'), health: $('health-fill'), nitro: $('nitro-fill'), speed: $('speed'),
    gear: $('gear'), mode: $('speed-mode'), cash: $('cash'), deliveries: $('deliveries'),
    wanted: $('wanted'), cooling: $('cooling'), coolingFill: $('cooling-fill'),
    objDist: $('obj-dist'), timer: $('timer-fill'), objSub: $('obj-sub'),
    hint: $('hint'), respawnNote: $('respawn-note')
  };
  let lastHud = { speed: -1, gear: '', mode: '', cash: -1, deliv: -1, dist: -1, health: -1, nitro: -1, pips: -1, heat: -1, timer: -1, cooling: -1 };
  const starEls = Array.from(ui.wanted.children);
  const pipEls = Array.from(document.querySelectorAll('#nitro-pips i'));

  function updateHUD(dt) {
    const car = player.car;
    const focus = focusPos();
    const speed = player.mode === 'car' && car ? Math.round(car.speed * 3.6) : 0;
    if (speed !== lastHud.speed) { ui.speed.textContent = speed; lastHud.speed = speed; }
    let gear = 'N';
    if (player.mode === 'car' && car) gear = car.forwardSpeed < -0.5 ? 'R' : (car.speed < 0.4 ? 'N' : 'D');
    if (gear !== lastHud.gear) { ui.gear.textContent = gear; lastHud.gear = gear; }
    let mode = 'CRUISE';
    if (player.mode === 'foot') mode = 'ON FOOT';
    else if (!car || car.speed < 0.4) mode = 'IDLE';
    else if (car.nitroOn) mode = 'NITRO';
    else if (Math.abs(car.lateral) > 4.2 && car.speed > 8) mode = 'DRIFT';
    if (mode !== lastHud.mode) { ui.mode.textContent = mode; lastHud.mode = mode; }

    const health = car ? Math.round(clamp(car.health, 0, 100)) : 100;
    if (health !== lastHud.health) { ui.health.style.width = health + '%'; lastHud.health = health; }
    const nitro = Math.round(G.nitro);
    if (nitro !== lastHud.nitro) { ui.nitro.style.width = nitro + '%'; lastHud.nitro = nitro; }
    const pips = Math.ceil(G.nitro / 10);
    if (pips !== lastHud.pips) {
      for (let i = 0; i < pipEls.length; i++) pipEls[i].classList.toggle('on', i < pips);
      lastHud.pips = pips;
    }
    if (G.cash !== lastHud.cash) { ui.cash.textContent = '$' + G.cash.toLocaleString('en-US'); lastHud.cash = G.cash; }
    if (G.deliveries !== lastHud.deliv) { ui.deliveries.textContent = String(G.deliveries); lastHud.deliv = G.deliveries; }
    const heat = Math.round(G.heat);
    if (heat !== lastHud.heat) {
      for (let i = 0; i < starEls.length; i++) starEls[i].classList.toggle('on', i < heat);
      lastHud.heat = heat;
    }
    const dist = Math.round(Math.hypot(focus.x - G.drop.x, focus.z - G.drop.z));
    if (dist !== lastHud.dist) { ui.objDist.textContent = String(dist); lastHud.dist = dist; }
    const tPct = Math.round(clamp(G.timer / 110, 0, 1) * 100);
    if (tPct !== lastHud.timer) {
      ui.timer.style.width = tPct + '%';
      ui.timer.style.background = G.timer < 20 ? 'linear-gradient(90deg,#ff2e79,#ff7a3c)' : '';
      lastHud.timer = tPct;
    }
    const cw = Math.round(clamp(G.cooling / 14, 0, 1) * 100);
    if (cw !== lastHud.cooling) {
      ui.coolingFill.style.width = cw + '%';
      ui.cooling.classList.toggle('hidden', !(G.heat > 0 && G.cooling > 0.05));
      lastHud.cooling = cw;
    }
    let sub = 'FOLLOW THE YELLOW MARKER';
    if (player.mode === 'foot') sub = 'GET BACK IN A CAR';
    else if (G.timer < 20) sub = 'HURRY — TIME RUNNING OUT';
    if (sub !== lastHud.sub) { ui.objSub.textContent = sub; lastHud.sub = sub; }

    let showHint = false;
    if (player.mode === 'foot' && G.state === 'play') {
      const v = nearestVehicle(5.6);
      showHint = !!v;
      if (showHint) ui.hint.innerHTML = 'PRESS <b>E</b> TO ENTER';
    }
    ui.hint.classList.toggle('hidden', !showHint);
  }

  // ---------------- minimap ----------------
  const mm = $('minimap');
  const mmCtx = mm.getContext('2d');
  const MM_SIZE = 240;
  const MM_VIEW = 300;
  let mmAcc = 0;

  function drawMinimap() {
    const focus = focusPos();
    const px = focus.x, pz = focus.z;
    mmCtx.clearRect(0, 0, MM_SIZE, MM_SIZE);
    mmCtx.save();
    mmCtx.beginPath();
    mmCtx.arc(MM_SIZE / 2, MM_SIZE / 2, MM_SIZE / 2 - 2, 0, Math.PI * 2);
    mmCtx.clip();
    mmCtx.fillStyle = '#0a0d15';
    mmCtx.fillRect(0, 0, MM_SIZE, MM_SIZE);
    const sx = px + 260 - MM_VIEW / 2;
    const sy = pz + 260 - MM_VIEW / 2;
    mmCtx.drawImage(world.mapCanvas, sx, sy, MM_VIEW, MM_VIEW, 0, 0, MM_SIZE, MM_SIZE);

    const toMM = (x, z) => ({
      x: (x - (px - MM_VIEW / 2)) / MM_VIEW * MM_SIZE,
      y: (z - (pz - MM_VIEW / 2)) / MM_VIEW * MM_SIZE
    });

    // pickups
    for (const p of NH.pickups) {
      if (!p.active) continue;
      const m = toMM(p.pos.x, p.pos.z);
      mmCtx.fillStyle = p.type === 'cash' ? '#5dff9a' : '#41f5ff';
      mmCtx.beginPath(); mmCtx.arc(m.x, m.y, 2.6, 0, Math.PI * 2); mmCtx.fill();
    }
    // cops
    for (const c of cops) {
      const m = toMM(c.pos.x, c.pos.z);
      mmCtx.fillStyle = '#ff2e4e';
      mmCtx.beginPath(); mmCtx.arc(m.x, m.y, 4, 0, Math.PI * 2); mmCtx.fill();
      mmCtx.strokeStyle = 'rgba(255,46,78,.5)'; mmCtx.lineWidth = 1.5;
      mmCtx.beginPath(); mmCtx.arc(m.x, m.y, 6.5, 0, Math.PI * 2); mmCtx.stroke();
    }
    // drop
    let dm = toMM(G.drop.x, G.drop.z);
    const cxm = MM_SIZE / 2, cym = MM_SIZE / 2;
    const ddx = dm.x - cxm, ddy = dm.y - cym;
    const dlen = Math.hypot(ddx, ddy);
    if (dlen > MM_SIZE / 2 - 10) {
      const k = (MM_SIZE / 2 - 10) / dlen;
      dm = { x: cxm + ddx * k, y: cym + ddy * k };
      mmCtx.save();
      mmCtx.translate(dm.x, dm.y);
      mmCtx.rotate(Math.atan2(ddy, ddx) + Math.PI / 2);
      mmCtx.fillStyle = '#ffc93c';
      mmCtx.beginPath(); mmCtx.moveTo(0, -7); mmCtx.lineTo(5, 4); mmCtx.lineTo(-5, 4); mmCtx.closePath(); mmCtx.fill();
      mmCtx.restore();
    } else {
      mmCtx.save();
      mmCtx.translate(dm.x, dm.y);
      mmCtx.rotate(Math.PI / 4);
      mmCtx.fillStyle = '#ffc93c';
      mmCtx.shadowColor = '#ffc93c'; mmCtx.shadowBlur = 8;
      mmCtx.fillRect(-4, -4, 8, 8);
      mmCtx.restore();
    }
    mmCtx.restore();

    // player arrow
    const h = player.mode === 'car' && player.car ? player.car.heading : player.footHeading;
    const fx = Math.sin(h), fz = Math.cos(h);
    const rx = Math.cos(h), rz = -Math.sin(h);
    const cx = MM_SIZE / 2, cy = MM_SIZE / 2;
    mmCtx.beginPath();
    mmCtx.moveTo(cx + fx * 10, cy + fz * 10);
    mmCtx.lineTo(cx - fx * 5 + rx * 6, cy - fz * 5 + rz * 6);
    mmCtx.lineTo(cx - fx * 2, cy - fz * 2);
    mmCtx.lineTo(cx - fx * 5 - rx * 6, cy - fz * 5 - rz * 6);
    mmCtx.closePath();
    mmCtx.fillStyle = '#ffffff';
    mmCtx.shadowColor = '#41f5ff'; mmCtx.shadowBlur = 7;
    mmCtx.fill();
  }

  // ---------------- audio ----------------
  function updateAudio() {
    if (G.state === 'play' && player.mode === 'car' && player.car) {
      audio.setEngine(player.car.speed * 3.6, input.throttle, player.car.nitroOn, true);
    } else {
      audio.setEngine(0, 0, false, false);
    }
    let nearest = Infinity, nc = null;
    const focus = focusPos();
    for (const c of cops) {
      const d = Math.hypot(c.pos.x - focus.x, c.pos.z - focus.z);
      if (d < nearest) { nearest = d; nc = c; }
    }
    if (nc && G.state === 'play') {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const to = new THREE.Vector3(nc.pos.x - camera.position.x, 0, nc.pos.z - camera.position.z);
      const len = to.length() || 1;
      const pan = to.dot(right) / len;
      audio.setSiren(nearest, pan);
    } else {
      audio.setSiren(999, 0);
    }
  }

  // ---------------- sun / sky ----------------
  function updateSun() {
    const focus = focusPos();
    const sun = world.sun;
    sun.position.set(focus.x - 120, 78, focus.z + 96);
    sun.target.position.set(focus.x, 0, focus.z);
    sun.target.updateMatrixWorld();
    world.sky.position.copy(camera.position);
  }

  // ---------------- input ----------------
  const keys = {};
  let dragging = false, lastDrag = 0, dragX = 0, dragY = 0;

  function keyDown(e) {
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    if (k === 'enter' && G.state === 'menu') { startGame(); return; }
    if (k === 'escape') { togglePause(); return; }
    if (e.repeat) return;
    if (k === 'e') { toggleEnterExit(); return; }
    if (k === 'r') { resetCar(); return; }
    if (k === 'm') { toggleMute(); return; }
    keys[k] = true;
  }
  function keyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  function resetCar() {
    if (G.state !== 'play') return;
    if (player.mode === 'car' && player.car) {
      const p = world.randomRoadPoint(25, player.car.pos, 4, 90);
      player.car.pos.copy(p);
      player.car.vel.set(0, 0, 0);
      player.car.heading = Math.atan2(focusPos().x - p.x, focusPos().z - p.z) + Math.PI;
      player.car.group.position.copy(player.car.pos);
      player.car.group.rotation.y = player.car.heading;
      NH.camInit = false;
      toast('VEHICLE RESET', 'cyan');
    } else {
      const car = player.car;
      if (car) {
        player.footPos.set(car.pos.x + 3, 0.22, car.pos.z);
        player.footHeading = car.heading;
        player.camYaw = car.heading;
        character.position.copy(player.footPos);
      }
    }
  }

  function togglePause() {
    if (G.state === 'play') {
      G.state = 'paused';
      $('pause').classList.remove('hidden');
      syncTouchUI();
      audio.setEngine(0, 0, false, false);
      audio.setSiren(999, 0);
      keys['w'] = keys['a'] = keys['s'] = keys['d'] = false;
    } else if (G.state === 'paused') {
      G.state = 'play';
      $('pause').classList.add('hidden');
      syncTouchUI();
    }
  }

  function toggleMute() {
    const m = audio.toggleMute();
    $('mute-btn').textContent = 'SOUND: ' + (m ? 'OFF' : 'ON');
  }

  // mouse orbit on foot
  canvas.addEventListener('pointerdown', e => {
    if (isTouch || G.state !== 'play' || player.mode !== 'foot') return;
    dragging = true; dragX = e.clientX; dragY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - dragX, dy = e.clientY - dragY;
    dragX = e.clientX; dragY = e.clientY;
    player.camYaw -= dx * 0.006;
    player.camPitch = clamp(player.camPitch + dy * 0.004, 0.04, 1.0);
    lastDrag = performance.now();
  });
  canvas.addEventListener('pointerup', () => { dragging = false; lastDrag = performance.now(); });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  // ---------------- touch ----------------
  const stick = $('stick');
  const knob = $('stick-knob');
  let stickId = null;
  function setStick(e) {
    const r = stick.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const max = r.width * 0.33;
    const len = Math.hypot(dx, dy);
    if (len > max) { dx *= max / len; dy *= max / len; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    input.joyX = clamp(dx / max, -1, 1);
    input.joyY = clamp(-dy / max, -1, 1);
    input.joyActive = Math.hypot(input.joyX, input.joyY) > 0.12;
  }
  stick.addEventListener('pointerdown', e => {
    e.preventDefault();
    stickId = e.pointerId;
    stick.setPointerCapture(e.pointerId);
    setStick(e);
  });
  stick.addEventListener('pointermove', e => { if (e.pointerId === stickId) { e.preventDefault(); setStick(e); } });
  function releaseStick(e) {
    if (e && e.pointerId !== stickId) return;
    stickId = null;
    knob.style.transform = 'translate(0px, 0px)';
    input.joyX = 0; input.joyY = 0; input.joyActive = false;
  }
  stick.addEventListener('pointerup', releaseStick);
  stick.addEventListener('pointercancel', releaseStick);
  stick.addEventListener('lostpointercapture', releaseStick);

  function holdButton(id, on, off) {
    const el = $(id);
    el.addEventListener('pointerdown', e => { e.preventDefault(); el.classList.add('active'); on(); });
    const up = e => { if (e) e.preventDefault(); el.classList.remove('active'); off(); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  }
  holdButton('btn-nitro', () => { input.touchNitro = true; }, () => { input.touchNitro = false; });
  holdButton('btn-brake', () => { input.touchBrake = true; }, () => { input.touchBrake = false; });
  $('btn-enter').addEventListener('pointerdown', e => { e.preventDefault(); toggleEnterExit(); });

  function syncTouchUI() {
    $('mobile-controls').classList.toggle('hidden', !(isTouch && G.state === 'play'));
  }

  // ---------------- start / pause / buttons ----------------
  function startGame() {
    if (G.state !== 'menu') return;
    audio.init();
    audio.click();
    G.state = 'play';
    G.heat = 2;
    G.cash = 0;
    G.deliveries = 0;
    G.best = 0;
    G.timer = 110;
    G.cooling = 0;
    G.nitro = 100;
    G.startTime = performance.now();
    player.car = hero;
    player.mode = 'car';
    hero.kind = 'player';
    hero.health = 100;
    hero.pos.set(world.spawn.x, 0.02, world.spawn.z);
    hero.vel.set(0, 0, 0);
    hero.heading = world.spawn.heading;
    hero.group.position.copy(hero.pos);
    hero.group.rotation.y = hero.heading;
    NH.setPlayerKit(hero, true);
    character.visible = false;
    NH.clearCops();
    NH.newDrop();
    NH.spawnCop();
    NH.spawnCop();
    G.copSpawnTimer = 1.6;
    $('start').classList.add('hidden');
    $('hud').classList.remove('hidden');
    syncTouchUI();
    showCenter('GO', 'FOLLOW THE YELLOW MARKER', '#41f5ff');
    toast('DELIVER THE RIDE  ·  LOSE THE COPS', 'gold');
    NH.camInit = true;
    input.joyActive = false;
  }

  $('start-btn').addEventListener('click', startGame);
  $('resume-btn').addEventListener('click', togglePause);
  $('restart-btn').addEventListener('click', restartRun);
  $('mute-btn').addEventListener('click', toggleMute);
  $('respawn-btn').addEventListener('click', respawn);

  // ---------------- loop ----------------
  let last = performance.now();
  let mmTime = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    G.time += dt;

    if (G.state === 'play') {
      readInput();
      updatePlayer(dt);
      NH.updateTraffic(dt);
      NH.updateCops(dt);
      collideCars();
      NH.updateCopSpawning(dt);
      NH.maintainTraffic(dt);
      NH.updatePeds(dt);
      NH.updatePickups(dt);
      updateMission(dt);
      NH.updateMarker(dt);
      updateAudio();
      updateCamera(dt);
      updateHUD(dt);
      mmTime += dt;
      if (mmTime > 0.05) { drawMinimap(); mmTime = 0; }
    } else if (G.state === 'menu') {
      NH.updateTraffic(dt);
      NH.updatePeds(dt);
      NH.updateMarker(dt);
      updateCamera(dt);
      updateAudio();
    } else if (G.state === 'wrecked') {
      G.wreckTimer -= dt;
      ui.respawnNote.textContent = 'RESPAWNING IN ' + Math.max(0, Math.ceil(G.wreckTimer)) + '…';
      if (G.wreckTimer <= 0) respawn();
      NH.updateTraffic(dt);
      NH.updatePeds(dt);
      NH.updateMarker(dt);
      updateCamera(dt);
    }

    NH.updateParticles(dt);
    NH.updateSkids();
    updateSun();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  window.addEventListener('contextmenu', e => e.preventDefault());

  snapCamera();
  NH.camInit = true;
  requestAnimationFrame(frame);
})();
