import * as THREE from './vendor/three.module.js';
export class InputManager {
  constructor(game) {
    this.game = game;
    this.isDragging = false;
    this.dragStart = null;
    this.dragCurrent = null;
    this.mouseDownPos = null;
    this.keys = {};
    const c = game.renderer.domElement;
    c.addEventListener('mousedown', e => this.onMouseDown(e));
    c.addEventListener('mousemove', e => this.onMouseMove(e));
    c.addEventListener('mouseup', e => this.onMouseUp(e));
    c.addEventListener('contextmenu', e => e.preventDefault());
    c.addEventListener('wheel', e => this.onWheel(e), {passive:false});
    window.addEventListener('keydown', e => { this.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', e => { this.keys[e.key.toLowerCase()] = false; });
    // build mode click handled in mouseup
  }

  updateCamera(dt) {
    const g = this.game;
    const cam = g.camera;
    const speed = 60 * dt;
    const k = this.keys;
    let dx=0, dz=0;
    if (k['w']) dz -= 1;
    if (k['s']) dz += 1;
    if (k['a']) dx -= 1;
    if (k['d']) dx += 1;
    if (dx||dz) {
      const len = Math.hypot(dx,dz);
      dx/=len; dz/=len;
      g.cameraTarget.x += dx*speed;
      g.cameraTarget.z += dz*speed;
    }
    if (k[' ']) {
      const sel = [...g.selected];
      if (sel.length) {
        const avg = sel.reduce((a,e)=>{a.x+=e.pos.x;a.z+=e.pos.z;return a;}, new THREE.Vector3(0,0,0)).divideScalar(sel.length);
        g.cameraTarget.x = avg.x; g.cameraTarget.z = avg.z;
      }
    }
    cam.position.copy(g.cameraTarget).add(g.cameraOffset);
    cam.lookAt(g.cameraTarget);
  }

  onMouseDown(e) {
    const g = this.game;
    if (e.button === 0) {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.mouseDownPos = { x: e.clientX, y: e.clientY };
      const box = document.getElementById('selectionbox');
      box.style.display = 'block';
      box.style.left = e.clientX + 'px';
      box.style.top = e.clientY + 'px';
      box.style.width = '0px';
      box.style.height = '0px';
    } else if (e.button === 2) {
      this.onRightClick(e);
    }
  }

  onMouseMove(e) {
    if (!this.isDragging) {
      // tooltip maybe
      return;
    }
    const s = this.dragStart;
    const x = Math.min(s.x, e.clientX), y = Math.min(s.y, e.clientY);
    const w = Math.abs(e.clientX - s.x), h = Math.abs(e.clientY - s.y);
    const box = document.getElementById('selectionbox');
    box.style.left = x + 'px';
    box.style.top = y + 'px';
    box.style.width = w + 'px';
    box.style.height = h + 'px';
  }

  onMouseUp(e) {
    const g = this.game;
    if (e.button !== 0) return;
    const box = document.getElementById('selectionbox');
    box.style.display = 'none';
    const start = this.dragStart;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    if (dx < 5 && dy < 5) {
      // single click selection
      const ent = g.entityAtScreen(e.clientX, e.clientY);
      if (g.buildMode) {
        // place building
        this.tryPlaceBuilding(e.clientX, e.clientY);
        return;
      }
      if (e.shiftKey) {
        if (ent && ent.faction === 0) {
          if (g.selected.has(ent)) g.selected.delete(ent); else g.selected.add(ent);
          ent.selected = g.selected.has(ent);
        }
      } else {
        // clear selection
        for (const s of g.selected) s.selected = false;
        g.selected.clear();
        if (ent && ent.faction === 0) {
          g.selected.add(ent); ent.selected = true;
        }
      }
    } else {
      // box select
      const ents = g.entitiesInBox(start.x, start.y, e.clientX, e.clientY);
      if (!e.shiftKey) {
        for (const s of g.selected) s.selected = false;
        g.selected.clear();
      }
      for (const ent of ents) {
        g.selected.add(ent); ent.selected = true;
      }
    }
    this.isDragging = false;
    this.dragStart = null;
  }

  onRightClick(e) {
    const g = this.game;
    const ent = g.entityAtScreen(e.clientX, e.clientY);
    const pt = g.screenToWorld(e.clientX, e.clientY);
    const units = [...g.selected].filter(x=>x.kind==='unit');

    if (g.buildMode) {
      // cancel build mode
      g.buildMode = null;
      g.ui.updateBuildMenu();
      return;
    }

    if (units.length === 0) return;

    if (ent && ent.faction !== 0 && ent.kind) {
      // attack
      g.issueAttack(units, ent);
    } else if (ent && ent.faction === 0 && ent.kind === 'building' && units.some(u=>u.cfg.isWorker) && ent.state!=='ready'===false) {
      // maybe repair? skip
      g.issueMove(units, pt);
    } else if (ent && (ent.type === 'tree' || ent.type === 'goldmine')) {
      g.issueGather(units, ent);
    } else if (ent && ent.faction === 0 && ent.kind === 'building') {
      // move to building
      g.issueMove(units, pt);
    } else {
      // if build mode? handled separately
      g.issueMove(units, pt);
    }
  }

  tryPlaceBuilding(cx, cy) {
    const g = this.game;
    if (!g.buildMode) return;
    const pt = g.screenToWorld(cx, cy);
    // find a worker in selection
    const workers = [...g.selected].filter(u=>u.kind==='unit' && u.cfg.isWorker);
    if (workers.length === 0) { g.buildMode = null; g.ui.updateBuildMenu(); return; }
    // snap pt to ground
    pt.y = g.groundHeight(pt.x, pt.z);
    const ok = g.issueBuild(workers[0], g.buildMode, pt);
    if (ok) {
      g.buildMode = null;
      g.ui.updateBuildMenu();
    }
  }

  onWheel(e) {
    e.preventDefault();
    const g = this.game;
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    g.cameraOffset.y = Math.max(20, Math.min(120, g.cameraOffset.y * factor));
    g.cameraOffset.z = Math.max(20, Math.min(120, g.cameraOffset.z * factor));
  }
}
