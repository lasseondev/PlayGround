import * as THREE from './vendor/three.module.js';
import { BUILDING_TYPES, UNIT_TYPES, FACTION_AI } from './config.js';

export class AIController {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.attackTimer = 0;
    this.buildTimer = 0;
  }

  update(dt) {
    const g = this.game;
    if (g.over) return;
    this.timer += dt;
    this.buildTimer += dt;
    this.attackTimer += dt;

    // assign idle workers to gather
    for (const u of g.entities) {
      if (u.kind!=='unit' || u.faction!==FACTION_AI || !u.cfg.isWorker) continue;
      if (u.state === 'idle') {
        // find nearest gold mine or tree
        const target = this.findGatherTarget(u);
        if (target) g.issueGather([u], target);
      }
    }

    // build economy periodically
    if (this.buildTimer > 6) {
      this.buildTimer = 0;
      this.tryBuild();
    }

    // train units
    this.tryTrain();

    // attack
    if (this.attackTimer > 25) {
      this.attackTimer = 0;
      this.tryAttack();
    }
  }

  findGatherTarget(u) {
    const g = this.game;
    let best=null, bd=Infinity;
    // prefer gold if low gold
    const res = g.resources[FACTION_AI];
    const wantGold = res.gold < 200;
    for (const e of g.entities) {
      if (e.faction !== 2) continue;
      if (wantGold && e.type !== 'goldmine') continue;
      if (!wantGold && e.type !== 'tree') continue;
      const d = e.pos.distanceTo(u.pos);
      if (d < bd) { bd=d; best=e; }
    }
    if (!best) {
      // any resource
      for (const e of g.entities) {
        if (e.faction !== 2) continue;
        const d = e.pos.distanceTo(u.pos);
        if (d < bd) { bd=d; best=e; }
      }
    }
    return best;
  }

  tryBuild() {
    const g = this.game;
    const workers = g.entities.filter(e=>e.kind==='unit' && e.faction===FACTION_AI && e.cfg.isWorker);
    const idleWorker = workers.find(w=>w.state==='idle' || w.state==='gathering');
    if (!idleWorker) return;
    const r = g.resources[FACTION_AI];
    const s = g.supply[FACTION_AI];
    // build farm if supply low
    if (s.used + 2 > s.cap && r.gold >= 50 && r.wood >= 20) {
      const pos = this.findBuildSpot(idleWorker, 'farm');
      if (pos) g.issueBuild(idleWorker, 'farm', pos);
      return;
    }
    // build barracks if none
    const barracks = g.entities.find(e=>e.kind==='building' && e.faction===FACTION_AI && e.type==='barracks' && e.state==='ready');
    if (!barracks && r.gold >= 100 && r.wood >= 50) {
      const pos = this.findBuildSpot(idleWorker, 'barracks');
      if (pos) g.issueBuild(idleWorker, 'barracks', pos);
      return;
    }
    // lumber mill
    const lm = g.entities.find(e=>e.kind==='building' && e.faction===FACTION_AI && e.type==='lumbermill' && e.state==='ready');
    if (!lm && r.gold >= 60 && r.wood >= 20) {
      const pos = this.findBuildSpot(idleWorker, 'lumbermill');
      if (pos) g.issueBuild(idleWorker, 'lumbermill', pos);
      return;
    }
  }

  findBuildSpot(worker, type) {
    const g = this.game;
    // near townhall
    const th = g.entities.find(e=>e.kind==='building' && e.faction===FACTION_AI && e.type==='townhall');
    if (!th) return null;
    const angle = Math.random()*Math.PI*2;
    const dist = 8 + Math.random()*6;
    const x = th.pos.x + Math.cos(angle)*dist;
    const z = th.pos.z + Math.sin(angle)*dist;
    // bounds
    const half = 70;
    if (Math.abs(x)>half || Math.abs(z)>half) return null;
    return new THREE.Vector3(x,0,z);
  }

  tryTrain() {
    const g = this.game;
    const r = g.resources[FACTION_AI];
    const th = g.entities.find(e=>e.kind==='building' && e.faction===FACTION_AI && e.type==='townhall' && e.state==='ready');
    // train peasants from townhall if supply allows and few workers
    const workers = g.entities.filter(e=>e.kind==='unit' && e.faction===FACTION_AI && e.cfg.isWorker).length;
    if (th && th.queue.length === 0 && r.gold >= 50 && workers < 8) {
      const s = g.supply[FACTION_AI];
      if (s.used + 1 <= s.cap) g.trainUnit(th, 'peasant');
    }
    // train military from all barracks
    for (const barracks of g.entities.filter(e=>e.kind==='building' && e.faction===FACTION_AI && e.type==='barracks' && e.state==='ready')) {
      if (barracks.queue.length > 0) continue;
      if (r.gold < 80) continue;
      const s = g.supply[FACTION_AI];
      if (s.used + 2 > s.cap) continue;
      const type = (r.wood >= 30 && Math.random() < 0.4) ? 'archer' : 'footman';
      if (barracks.cfg.trains.includes(type)) g.trainUnit(barracks, type);
      else if (barracks.cfg.trains.length) g.trainUnit(barracks, barracks.cfg.trains[0]);
    }
  }

  tryAttack() {
    const g = this.game;
    const units = g.entities.filter(e=>e.kind==='unit' && e.faction===FACTION_AI && !e.cfg.isWorker);
    if (units.length < 4) return;
    // target player townhall or units
    const target = g.entities.find(e=>e.kind==='building' && e.faction===0 && e.type==='townhall');
    if (!target) return;
    g.issueMove(units, target.pos.clone());
    // set attack after move? issueMove sets moving; units will move then idle. Need attack. Use issueAttack with target.
    g.issueAttack(units, target);
  }
}
