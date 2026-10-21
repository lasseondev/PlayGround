import { BUILDING_TYPES, UNIT_TYPES, FACTION_PLAYER, MAP_SIZE } from './config.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.buildMenuEl = document.getElementById('buildmenu');
    this.cmdEl = document.getElementById('cmd');
    this.msgEl = document.getElementById('msg');
    this.goldEl = document.getElementById('gold');
    this.woodEl = document.getElementById('wood');
    this.supplyEl = document.getElementById('supply');
    this.minimap = document.getElementById('minimap');
    this.minimapCtx = this.minimap.getContext('2d');
    this.minimap.width = 180; this.minimap.height = 180;
    this.minimap.addEventListener('click', (e) => {
      const rect = this.minimap.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const size = MAP_SIZE;
      const scale = 180/size;
      const off = size/2;
      this.game.cameraTarget.x = mx/scale - off;
      this.game.cameraTarget.z = my/scale - off;
    });
    this.updateBuildMenu();
  }

  update() {
    const g = this.game;
    this.goldEl.textContent = Math.floor(g.resources[0].gold);
    this.woodEl.textContent = Math.floor(g.resources[0].wood);
    this.supplyEl.textContent = `${g.supply[0].used}/${g.supply[0].cap}`;
    this.updateCmd();
    this.drawMinimap();
  }

  updateBuildMenu() {
    const g = this.game;
    const types = ['farm','barracks','lumbermill'];
    this.buildMenuEl.innerHTML = '';
    for (const t of types) {
      const cfg = BUILDING_TYPES[t];
      const btn = document.createElement('div');
      btn.className = 'btn';
      btn.textContent = cfg.name;
      btn.onclick = () => {
        // enter build mode if a worker selected
        const workers = [...g.selected].filter(u=>u.kind==='unit' && u.cfg.isWorker);
        if (workers.length === 0) { this.showMessage('Select a peasant first'); return; }
        g.buildMode = t;
        this.updateBuildMenu();
      };
      if (g.buildMode === t) btn.style.borderColor = '#0f0';
      this.buildMenuEl.appendChild(btn);
    }
    // train buttons handled in cmd panel
  }

  updateCmd() {
    const g = this.game;
    const sel = [...g.selected];
    this.cmdEl.innerHTML = '';
    if (sel.length === 0) {
      this.cmdEl.innerHTML = '<div style="opacity:.6">No selection</div>';
      return;
    }
    if (sel.length === 1) {
      const e = sel[0];
      let html = `<div><b>${e.kind==='unit'?e.cfg.name:e.cfg.name}</b>  HP ${Math.floor(e.hp)}/${e.maxHp}</div>`;
      if (e.kind === 'building') {
        if (e.state === 'constructing') html += `<div>Building... ${Math.floor(e.buildProgress*100)}%</div>`;
        if (e.state === 'ready' && e.cfg.trains && e.cfg.trains.length) {
          html += '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">';
          for (const t of e.cfg.trains) {
            const uc = UNIT_TYPES[t];
            html += `<button class="btn" data-train="${t}" style="flex:1">${uc.name}<br><small>${uc.cost.gold}g ${uc.cost.wood}w</small></button>`;
          }
          html += '</div>';
        }
        if (e.queue.length) html += `<div>Training: ${e.queue[0].type} ${Math.floor(e.queue[0].progress/e.queue[0].time*100)}%</div>`;
      }
      if (e.kind === 'unit' && e.cfg.isWorker) {
        html += '<div style="margin-top:6px;opacity:.8">Right-click gold/tree to gather. Build menu uses selected peasant.</div>';
      }
      this.cmdEl.innerHTML = html;
      // attach train handlers
      this.cmdEl.querySelectorAll('[data-train]').forEach(btn => {
        btn.onclick = () => g.trainUnit(e, btn.dataset.train);
      });
    } else {
      this.cmdEl.innerHTML = `<div>${sel.length} units selected</div>`;
    }
  }

  showMessage(msg, duration=2500) {
    this.msgEl.textContent = msg;
    this.msgEl.style.display = 'block';
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => { this.msgEl.style.display = 'none'; }, duration);
  }

  drawMinimap() {
    const ctx = this.minimapCtx;
    const g = this.game;
    const size = MAP_SIZE;
    ctx.fillStyle = '#112211';
    ctx.fillRect(0,0,180,180);
    const scale = 180/size;
    const off = size/2;
    for (const e of g.entities) {
      const x = (e.pos.x + off) * scale;
      const y = (e.pos.z + off) * scale;
      if (e.kind === 'building') {
        ctx.fillStyle = e.faction===0?'#4488ff':(e.faction===1?'#ff4444':'#888');
        ctx.fillRect(x-2,y-2,4,4);
      } else {
        ctx.fillStyle = e.faction===0?'#88aaff':(e.faction===1?'#ff8888':'#aaa');
        ctx.fillRect(x-1,y-1,2,2);
      }
    }
    // camera view
    const ct = g.cameraTarget;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect((ct.x-20+off)*scale, (ct.z-20+off)*scale, 40*scale, 40*scale);
    // selected
    ctx.fillStyle = '#0f0';
    for (const e of g.selected) {
      const x = (e.pos.x + off) * scale;
      const y = (e.pos.z + off) * scale;
      ctx.fillRect(x-2,y-2,4,4);
    }
  }
}
