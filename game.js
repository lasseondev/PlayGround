import * as THREE from './vendor/three.module.js';
import { UNIT_TYPES, BUILDING_TYPES, FACTION_PLAYER, FACTION_AI, MAP_SIZE } from './config.js';
import { InputManager } from './input.js';
import { UIManager } from './ui.js';
import { AIController } from './ai.js';

let nextId = 1;

export class Game {
  constructor(container) {
    this.container = container;
    this.entities = [];
    this.resources = { [FACTION_PLAYER]: { gold: 200, wood: 100 }, [FACTION_AI]: { gold: 300, wood: 150 } };
    this.supply = { [FACTION_PLAYER]: { used: 0, cap: 10 }, [FACTION_AI]: { used: 0, cap: 10 } };
    this.selected = new Set();
    this.buildMode = null; // building type to place
    this.paused = false;
    this.over = false;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
    this.terrain = null;
    this.terrainMesh = null;
  }

  start() {
    this.setupScene();
    this.setupTerrain();
    this.setupBases();
    this.setupTrees();
    this.setupGoldMines();
    this.ui = new UIManager(this);
    this.input = new InputManager(this);
    this.ai = new AIController(this);
    this.animate();
  }

  setupScene() {
    const w = window.innerWidth, h = window.innerHeight;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 80, 220);
    this.camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 500);
    this.cameraTarget = new THREE.Vector3(0,0,0);
    this.cameraOffset = new THREE.Vector3(0, 60, 60);
    this.camera.position.copy(this.cameraTarget).add(this.cameraOffset);
    this.camera.lookAt(this.cameraTarget);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w,h);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(50,80,30);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048,2048);
    dir.shadow.camera.left=-100;dir.shadow.camera.right=100;dir.shadow.camera.top=100;dir.shadow.camera.bottom=-100;
    this.scene.add(dir);

    window.addEventListener('resize', () => {
      const w=window.innerWidth,h=window.innerHeight;
      this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
      this.renderer.setSize(w,h);
    });
  }

  setupTerrain() {
    const size = MAP_SIZE;
    const geo = new THREE.PlaneGeometry(size, size, 40, 40);
    geo.rotateX(-Math.PI/2);
    // slight height variation
    const pos = geo.attributes.position;
    for (let i=0;i<pos.count;i++){
      const x=pos.getX(i), z=pos.getZ(i);
      let y = Math.sin(x*0.05)*1.2 + Math.cos(z*0.07)*1.0 + Math.sin((x+z)*0.03)*0.8;
      // keep flat-ish
      y *= 0.6;
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color:0x3a7a3a, roughness:0.9 });
    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);
    this.terrain = geo;
  }

  groundHeight(x,z) {
    // approximate
    return Math.sin(x*0.05)*1.2*0.6 + Math.cos(z*0.07)*1.0*0.6 + Math.sin((x+z)*0.03)*0.8*0.6;
  }

  setupBases() {
    // player base left, ai base right
    this.spawnBuilding('townhall', FACTION_PLAYER, new THREE.Vector3(-60,0,-60));
    this.spawnBuilding('townhall', FACTION_AI, new THREE.Vector3(60,0,60));
    // starting peasants
    for (let i=0;i<3;i++){
      this.spawnUnit('peasant', FACTION_PLAYER, new THREE.Vector3(-58+i*1.5,0,-56));
      this.spawnUnit('peasant', FACTION_AI, new THREE.Vector3(58-i*1.5,0,56));
    }
    // starting gold mine near bases
    this.spawnBuilding('goldmine', 2, new THREE.Vector3(-50,0,-50));
    this.spawnBuilding('goldmine', 2, new THREE.Vector3(50,0,50));
  }

  setupTrees() {
    // scatter trees
    const rng = (a,b)=>a+Math.random()*(b-a);
    for (let i=0;i<80;i++){
      const x = rng(-MAP_SIZE/2+5, MAP_SIZE/2-5);
      const z = rng(-MAP_SIZE/2+5, MAP_SIZE/2-5);
      // avoid bases
      if (Math.hypot(x+60,z+60)<15 || Math.hypot(x-60,z-60)<15) continue;
      this.spawnBuilding('tree', 2, new THREE.Vector3(x,0,z));
    }
  }

  setupGoldMines() {
    // already in bases; add a couple central
    this.spawnBuilding('goldmine', 2, new THREE.Vector3(0,0,-20));
    this.spawnBuilding('goldmine', 2, new THREE.Vector3(0,0,20));
  }

  spawnUnit(type, faction, pos) {
    const cfg = UNIT_TYPES[type];
    const e = {
      id: nextId++, type, kind:'unit', faction, cfg,
      hp: cfg.hp, maxHp: cfg.hp,
      pos: pos.clone(), target: null, state:'idle',
      moveTarget: null, attackTarget: null, gatherTarget: null, buildTarget: null,
      cooldown: 0, gatherCooldown: 0, buildProgress:0,
      selected: false, mesh: null, ring: null, hpBar: null,
    };
    e.mesh = this.createUnitMesh(type, faction, cfg);
    e.mesh.userData.entityId = e.id;
    e.mesh.position.copy(pos);
    e.mesh.position.y = this.groundHeight(pos.x,pos.z);
    this.scene.add(e.mesh);
    e.ring = this.createSelectionRing(cfg.radius);
    e.ring.visible = false;
    e.mesh.add(e.ring);
    e.hpBar = this.createHpBar(cfg.radius*2);
    e.mesh.add(e.hpBar);
    this.entities.push(e);
    this.updateSupply(faction, cfg.supply, true);
    return e;
  }

  spawnBuilding(type, faction, pos) {
    const cfg = BUILDING_TYPES[type];
    const e = {
      id: nextId++, type, kind:'building', faction, cfg,
      hp: (faction===2?cfg.hp: (type==='townhall'?cfg.hp:0)), maxHp: cfg.hp,
      pos: pos.clone(), state: (faction===2||type==='townhall'||type==='goldmine'||type==='tree')?'ready':'constructing',
      buildProgress: (faction===2||type==='townhall'||type==='goldmine'||type==='tree')?1:0,
      queue: [], rally: null, mesh: null, ring: null, hpBar: null,
      selected:false, isNeutral: faction===2,
      gatherers: [],
    };
    if (faction===2) e.faction = 2;
    e.mesh = this.createBuildingMesh(type, faction, cfg);
    e.mesh.userData.entityId = e.id;
    e.mesh.position.copy(pos);
    e.mesh.position.y = this.groundHeight(pos.x,pos.z);
    this.scene.add(e.mesh);
    e.ring = this.createSelectionRing(Math.max(cfg.size,1.5));
    e.ring.visible = false;
    e.mesh.add(e.ring);
    e.hpBar = this.createHpBar(cfg.size*1.2);
    e.mesh.add(e.hpBar);
    if (e.state==='constructing') { e.mesh.scale.y = 0.01; }
    if (e.state==='ready') e.rally = e.pos.clone().add(new THREE.Vector3(6,0,6));
    this.entities.push(e);
    if (!e.isNeutral && cfg.supply) {
      this.supply[faction].cap += cfg.supply;
    }
    // townhall supply base already set in init; but add for built ones
    return e;
  }

  createUnitMesh(type, faction, cfg) {
    const group = new THREE.Group();
    const bodyColor = faction===FACTION_PLAYER ? cfg.color : (faction===FACTION_AI ? 0xcc3333 : cfg.color);
    // adjust for ai units maybe red tint
    let color = cfg.color;
    if (faction===FACTION_AI) {
      color = 0xcc3333;
    }
    const mat = new THREE.MeshStandardMaterial({ color, roughness:0.6 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(cfg.radius*0.9, cfg.radius*1.1, 1.6, 8), mat);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(cfg.radius*0.6, 8, 8), new THREE.MeshStandardMaterial({color:0xffcc99}));
    head.position.y = 1.9;
    group.add(head);
    // weapon indicator for archer
    if (type==='archer') {
      const bow = new THREE.Mesh(new THREE.BoxGeometry(0.1,1.2,0.1), new THREE.MeshStandardMaterial({color:0x8b4513}));
      bow.position.set(cfg.radius+0.1,1.2,0); bow.rotation.z=Math.PI/2;
      group.add(bow);
    }
    if (type==='footman' || type==='grunt') {
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.1,1.4,0.15), new THREE.MeshStandardMaterial({color:0xaaaaaa}));
      sword.position.set(cfg.radius+0.2,1.2,0);
      group.add(sword);
    }
    // faction flag
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.4), new THREE.MeshBasicMaterial({color: faction===FACTION_PLAYER?0x0044ff:0xff0000, side:THREE.DoubleSide}));
    flag.position.set(0,2.6,0);
    group.add(flag);
    return group;
  }

  createBuildingMesh(type, faction, cfg) {
    const group = new THREE.Group();
    let color = cfg.color;
    if (faction===FACTION_AI && !cfg.neutral) color = this.tintRed(cfg.color);
    if (type==='tree') {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.3,1.5,6), new THREE.MeshStandardMaterial({color:0x5a3a1a}));
      trunk.position.y=0.75; group.add(trunk);
      const leaves = new THREE.Mesh(new THREE.ConeGeometry(cfg.size,2.5,8), new THREE.MeshStandardMaterial({color:cfg.color}));
      leaves.position.y=2.5; group.add(leaves);
      return group;
    }
    if (type==='goldmine') {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(cfg.size), new THREE.MeshStandardMaterial({color:0xffd700, metalness:0.6, roughness:0.3}));
      rock.position.y=cfg.size*0.6; group.add(rock);
      return group;
    }
    const mat = new THREE.MeshStandardMaterial({color, roughness:0.7});
    const base = new THREE.Mesh(new THREE.BoxGeometry(cfg.size*1.6, cfg.size*1.2, cfg.size*1.6), mat);
    base.position.y = cfg.size*0.6;
    base.castShadow=true; base.receiveShadow=true;
    group.add(base);
    if (type==='townhall') {
      const roof = new THREE.Mesh(new THREE.ConeGeometry(cfg.size*1.3, cfg.size*1.2, 4), new THREE.MeshStandardMaterial({color:0x553311}));
      roof.position.y = cfg.size*1.2+cfg.size*0.6; roof.rotation.y=Math.PI/4;
      group.add(roof);
    }
    if (type==='farm') {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(cfg.size*1.6,0.3,cfg.size*1.6), new THREE.MeshStandardMaterial({color:0x996633}));
      roof.position.y=cfg.size*1.2+0.2; group.add(roof);
    }
    return group;
  }

  tintRed(c) {
    const col = new THREE.Color(c);
    col.r = Math.min(1, col.r+0.3);
    col.g *= 0.6; col.b *= 0.6;
    return col.getHex();
  }

  createSelectionRing(r) {
    const geo = new THREE.RingGeometry(r, r+0.15, 32);
    geo.rotateX(-Math.PI/2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent:true, opacity:0.9 });
    const m = new THREE.Mesh(geo, mat);
    m.position.y = 0.05;
    return m;
  }

  createHpBar(width) {
    const group = new THREE.Group();
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.2), new THREE.MeshBasicMaterial({color:0x222222, side:THREE.DoubleSide}));
    bg.position.y = 2.6;
    group.add(bg);
    const fg = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.2), new THREE.MeshBasicMaterial({color:0x00ff00, side:THREE.DoubleSide}));
    fg.position.y = 2.6;
    fg.userData.isHpFg = true;
    group.add(fg);
    group.position.y = 0;
    return group;
  }

  updateHpBar(e) {
    if (!e.hpBar) return;
    const fg = e.hpBar.children.find(c=>c.userData.isHpFg);
    if (!fg) return;
    const width = (e.kind==='unit' ? e.cfg.radius*2 : e.cfg.size*1.2);
    const pct = Math.max(0, e.hp/e.maxHp);
    fg.scale.x = pct;
    fg.position.x = -(width*(1-pct))/2;
    fg.material.color.setHex(pct>0.5?0x00ff00:(pct>0.25?0xffff00:0xff0000));
    // hide if full hp and not selected? keep visible
  }

  updateSupply(faction, amount, add) {
    if (faction===2) return;
    if (add) this.supply[faction].used += amount;
    else this.supply[faction].used -= amount;
  }

  getEntities(faction=null, kind=null) {
    return this.entities.filter(e => (faction===null||e.faction===faction) && (kind===null||e.kind===kind));
  }

  findEntity(id) { return this.entities.find(e=>e.id===id); }

  removeEntity(e) {
    if (e.kind==='unit') this.updateSupply(e.faction, e.cfg.supply, false);
    if (e.kind==='building' && !e.isNeutral && e.cfg.supply) this.supply[e.faction].cap -= e.cfg.supply;
    this.scene.remove(e.mesh);
    const idx = this.entities.indexOf(e);
    if (idx>=0) this.entities.splice(idx,1);
    this.selected.delete(e);
  }

  // ---------- main loop ----------
  animate() {
    requestAnimationFrame(()=>this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.1);
    if (!this.paused && !this.over) {
      this.update(dt);
    }
    this.renderer.render(this.scene, this.camera);
    this.ui.update();
  }

  update(dt) {
    // camera pan with WASD
    this.input.updateCamera(dt);
    // update entities
    for (const e of [...this.entities]) {
      if (e.hp <= 0) {
        // death
        if (e.kind==='building' && e.type==='tree') {
          // remove
        }
        this.removeEntity(e);
        continue;
      }
      if (e.kind==='unit') this.updateUnit(e, dt);
      else this.updateBuilding(e, dt);
      // position mesh
      e.mesh.position.x = e.pos.x;
      e.mesh.position.z = e.pos.z;
      e.mesh.position.y = this.groundHeight(e.pos.x, e.pos.z);
      this.updateHpBar(e);
      // selection ring
      if (e.ring) e.ring.visible = e.selected;
    }
    // projectiles? handled inline
    this.ai.update(dt);
    this.checkWin();
  }

  updateUnit(e, dt) {
    // state machine
    if (e.state === 'moving' || e.state === 'attacking' || e.state === 'gathering' || e.state === 'building' || e.state === 'returning') {
      // movement toward moveTarget
      if (e.moveTarget) {
        const dir = new THREE.Vector3().subVectors(e.moveTarget, e.pos);
        dir.y = 0;
        const dist = dir.length();
        if (dist < 0.3) {
          e.pos.copy(e.moveTarget);
          e.moveTarget = null;
          if (e.state==='moving') e.state='idle';
        } else {
          dir.normalize();
          const step = e.cfg.speed * dt;
          if (step >= dist) { e.pos.copy(e.moveTarget); e.moveTarget=null; if(e.state==='moving')e.state='idle'; }
          else e.pos.addScaledVector(dir, step);
        }
      }
    }
    // attacking
    if (e.state === 'attacking' && e.attackTarget) {
      const t = e.attackTarget;
      if (!t || t.hp <= 0) { e.attackTarget=null; e.state='idle'; return; }
      const d = e.pos.distanceTo(t.pos);
      if (d > e.cfg.range + (t.cfg?t.cfg.radius||0: t.cfg?t.cfg.size:0)) {
        // move closer
        e.moveTarget = t.pos.clone();
        e.state = 'moving';
        // keep attack intent
        e._attackAfterMove = true;
      } else {
        e.moveTarget = null;
        e.cooldown -= dt;
        if (e.cooldown <= 0) {
          e.cooldown = e.cfg.attackRate;
          this.applyDamage(e, t, e.cfg.dmg);
          if (e.cfg.projectile) this.spawnProjectile(e.pos, t.pos);
        }
      }
    }
    // if moving and had attack intent, switch back when close
    if (e._attackAfterMove && e.moveTarget === null) {
      e._attackAfterMove = false;
      if (e.attackTarget && e.attackTarget.hp>0) e.state='attacking';
    }

    // gathering
    if (e.state === 'gathering' && e.gatherTarget) {
      const t = e.gatherTarget;
      if (!t || t.hp <= 0) { e.gatherTarget=null; e.state='idle'; return; }
      const d = e.pos.distanceTo(t.pos);
      const gatherRange = 2.5;
      if (d > gatherRange) {
        e.moveTarget = t.pos.clone();
        e.state = 'moving';
        e._gatherAfterMove = true;
      } else {
        e.moveTarget = null;
        e.gatherCooldown -= dt;
        if (e.gatherCooldown <= 0) {
          e.gatherCooldown = 2.0;
          // extract resource
          let amount = 0;
          if (t.type === 'tree') { amount = 10; t.hp -= 10; }
          else if (t.type === 'goldmine') { amount = 12; }
          if (t.type==='tree') this.resources[e.faction].wood += amount;
          else this.resources[e.faction].gold += amount;
          // carry limit: when carrying enough, return to dropoff
          e.carry = (e.carry||0) + amount;
          if (e.carry >= 40) {
            // find nearest dropoff
            const drop = this.nearestDropoff(e);
            if (drop) {
              e.state = 'returning';
              e.moveTarget = drop.pos.clone();
              e._dropoff = drop;
            }
          }
        }
      }
    }
    if (e._gatherAfterMove && e.moveTarget === null) {
      e._gatherAfterMove = false;
      if (e.gatherTarget && e.gatherTarget.hp>0) e.state='gathering';
    }

    // returning resources
    if (e.state === 'returning') {
      if (!e.moveTarget) {
        // arrived at dropoff
        // resources already added during gather? We added incrementally; carry just tracking. Reset.
        e.carry = 0;
        e.state = 'idle';
        // resume gathering same target if still exists
        if (e.gatherTarget && e.gatherTarget.hp>0) e.state='gathering';
      }
    }

    // building construction
    if (e.state === 'building' && e.buildTarget) {
      const b = e.buildTarget;
      if (!b || b.state==='ready') { e.buildTarget=null; e.state='idle'; return; }
      const d = e.pos.distanceTo(b.pos);
      if (d > 3) {
        e.moveTarget = b.pos.clone();
        e.state='moving';
        e._buildAfterMove = true;
      } else {
        e.moveTarget = null;
        b.buildProgress += dt * 0.05; // worker contribution
        if (b.buildProgress >= 1) {
          b.buildProgress = 1;
          b.state = 'ready';
          b.hp = b.maxHp;
          b.rally = b.pos.clone().add(new THREE.Vector3(6,0,6));
          b.mesh.scale.y = 1;
          // supply
          if (b.cfg.supply) this.supply[b.faction].cap += b.cfg.supply;
        } else {
          b.mesh.scale.y = 0.01 + b.buildProgress*0.99;
        }
      }
    }
    if (e._buildAfterMove && e.moveTarget === null) {
      e._buildAfterMove = false;
      if (e.buildTarget && e.buildTarget.state!=='ready') e.state='building';
    }
  }

  updateBuilding(e, dt) {
    if (e.state === 'constructing') {
      // constructed by workers; if no worker, slow auto? skip
      if (e.buildProgress >= 1) {
        e.state='ready'; e.hp=e.maxHp; e.mesh.scale.y=1;
        if (e.cfg.supply) this.supply[e.faction].cap += e.cfg.supply;
      }
    }
    // production queue
    if (e.state==='ready' && e.queue.length>0) {
      const q = e.queue[0];
      q.progress += dt;
      if (q.progress >= q.time) {
        // spawn unit at rally
        const spawnPos = e.pos.clone().add(new THREE.Vector3( (Math.random()-0.5)*2, 0, (Math.random()-0.5)*2 + e.cfg.size+1 ));
        const u = this.spawnUnit(q.type, e.faction, spawnPos);
        if (e.rally) {
          u.state='moving'; u.moveTarget = e.rally.clone();
        }
        e.queue.shift();
      }
    }
    // neutral tree regen? no
  }

  applyDamage(attacker, target, dmg) {
    target.hp -= dmg;
    // aggro: if unit attacked, maybe set attack target if idle
  }

  nearestDropoff(e) {
    let best=null, bd=Infinity;
    for (const b of this.entities) {
      if (b.kind!=='building' || b.faction!==e.faction || !b.cfg.isDropoff || b.state!=='ready') continue;
      const d = b.pos.distanceTo(e.pos);
      if (d < bd) { bd=d; best=b; }
    }
    if (!best) {
      // townhall
      for (const b of this.entities) {
        if (b.kind==='building' && b.faction===e.faction && b.type==='townhall') { best=b; break; }
      }
    }
    return best;
  }

  spawnProjectile(from, to) {
    const geo = new THREE.SphereGeometry(0.15,6,6);
    const mat = new THREE.MeshBasicMaterial({color:0xffff00});
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(from); m.position.y += 1.2;
    this.scene.add(m);
    const start = m.position.clone();
    const end = to.clone(); end.y += 1;
    const dur = 0.25;
    let t = 0;
    const tick = () => {
      t += 0.016;
      if (t >= dur) { this.scene.remove(m); return; }
      m.position.lerpVectors(start, end, t/dur);
      requestAnimationFrame(tick);
    };
    tick();
  }

  checkWin() {
    if (this.over) return;
    const playerTH = this.entities.find(e=>e.kind==='building' && e.type==='townhall' && e.faction===FACTION_PLAYER);
    const aiTH = this.entities.find(e=>e.kind==='building' && e.type==='townhall' && e.faction===FACTION_AI);
    if (!playerTH) { this.endGame('DEFEAT'); }
    else if (!aiTH) { this.endGame('VICTORY'); }
  }

  endGame(msg) {
    this.over = true;
    this.ui.showMessage(msg);
  }

  // ---------- commands ----------
  issueMove(units, point) {
    for (const u of units) {
      if (u.kind!=='unit') continue;
      u.state = 'moving';
      u.moveTarget = point.clone();
      u.attackTarget = null;
      u.gatherTarget = null;
      u.buildTarget = null;
      u._attackAfterMove=false; u._gatherAfterMove=false; u._buildAfterMove=false;
    }
  }

  issueAttack(units, target) {
    for (const u of units) {
      if (u.kind!=='unit') continue;
      u.state = 'attacking';
      u.attackTarget = target;
      u.moveTarget = null;
      u.gatherTarget = null;
      u.buildTarget = null;
    }
  }

  issueGather(units, target) {
    for (const u of units) {
      if (u.kind!=='unit' || !u.cfg.isWorker) continue;
      u.state = 'gathering';
      u.gatherTarget = target;
      u.moveTarget = null;
      u.attackTarget = null;
      u.buildTarget = null;
    }
  }

  issueBuild(worker, type, point) {
    // place building foundation
    const cfg = BUILDING_TYPES[type];
    // cost check
    const r = this.resources[worker.faction];
    if (r.gold < cfg.cost.gold || r.wood < cfg.cost.wood) return false;
    r.gold -= cfg.cost.gold; r.wood -= cfg.cost.wood;
    const b = this.spawnBuilding(type, worker.faction, point);
    b.state = 'constructing';
    b.buildProgress = 0;
    b.hp = 1;
    b.mesh.scale.y = 0.01;
    worker.state = 'building';
    worker.buildTarget = b;
    worker.moveTarget = null;
    return true;
  }

  trainUnit(building, type) {
    const cfg = UNIT_TYPES[type];
    const r = this.resources[building.faction];
    if (r.gold < cfg.cost.gold || r.wood < cfg.cost.wood) return false;
    // supply check
    const s = this.supply[building.faction];
    if (s.used + cfg.supply > s.cap) return false;
    r.gold -= cfg.cost.gold; r.wood -= cfg.cost.wood;
    const time = 8 + (type==='archer'?4:0);
    building.queue.push({ type, progress:0, time });
    return true;
  }

  // ---------- selection helpers ----------
  screenToWorld(mx, my) {
    this.mouse.set((mx/window.innerWidth)*2-1, -(my/window.innerHeight)*2+1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const pt = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.groundPlane, pt);
    return pt;
  }

  entitiesInBox(x1,y1,x2,y2) {
    const a = this.screenToWorld(x1,y1);
    const b = this.screenToWorld(x2,y2);
    const minx=Math.min(a.x,b.x), maxx=Math.max(a.x,b.x);
    const minz=Math.min(a.z,b.z), maxz=Math.max(a.z,b.z);
    return this.entities.filter(e => e.kind==='unit' && e.faction===FACTION_PLAYER &&
      e.pos.x>=minx && e.pos.x<=maxx && e.pos.z>=minz && e.pos.z<=maxz);
  }

  entityAtScreen(mx, my) {
    this.mouse.set((mx/window.innerWidth)*2-1, -(my/window.innerHeight)*2+1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // test meshes
    const meshes = this.entities.map(e=>e.mesh);
    const hits = this.raycaster.intersectObjects(meshes, true);
    if (hits.length===0) return null;
    // find entity whose mesh contains hit object
    for (const h of hits) {
      let obj = h.object;
      while (obj && !obj.userData.entityId) obj = obj.parent;
      if (obj) return this.findEntity(obj.userData.entityId);
    }
    return null;
  }

  // tag meshes with entityId
  // done in spawn? need to set userData. Add here:
}
