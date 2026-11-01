import {
  W, H, COLORS, clamp, rand, dist, circleRect, OPPOSITE, DOOR_CENTER,
} from './config.js';
import {
  ROOMS, MAP_CELLS, buildSolid, doorRect, roomSpawn, neighborId, tileCenter,
} from './world.js';
import { Player, Enemy, Boss, Projectile, Pickup } from './entities.js';
import { WorldView } from './view.js';
import {
  drawHUD, drawTitle, drawOverlays, makeVignette, buildTitleBackground, makeTitleEmbers,
} from './ui.js';

const DIRECTIONS = ['n', 's', 'w', 'e'];

export class Game {
  constructor(canvas, ctx, input, audio) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = input;
    this.audio = audio;
    this.time = 0;
    this.mode = 'title';
    this.shake = 0;
    this.hitStop = 0;
    this.flashRed = 0;
    this.flashWhite = 0;
    this.bgCache = new Map();
    this.solidCache = new Map();
    this.titleTime = 0;
    this.titleEmbers = makeTitleEmbers();
    this.titleBg = buildTitleBackground();
    this.vignette = makeVignette();
    this.view = new WorldView();

    this.resetRunState();
    this.mode = 'title';
  }

  // -------------------------------------------------------------------------
  // Run setup
  // -------------------------------------------------------------------------
  resetRunState() {
    this.player = new Player(this, W / 2, H - 70, 'up');
    this.roomRuntimes = new Map();
    this.doorStates = {};
    for (const [id, room] of Object.entries(ROOMS)) {
      this.doorStates[id] = { ...room.doors };
    }
    this.roomId = '1,2';
    this.roomState = this.getRuntime('1,2');
    this.enemies = [];
    this.boss = null;
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.visited = new Set(['1,2']);
    this.toast = null;
    this.message = null;
    this.reward = null;
    this.transition = null;
    this.roomBanner = null;
    this.bossBanner = 0;
    this.cinematic = 0;
    this.deathTimer = 0;
    this.victoryTime = 0;
    this.runTime = 0;
    this.kills = 0;
    this.deaths = 0;
    this.hintTimer = 7;
    this.doorHintCooldown = 0;
    this.ambientTimer = 0;
    this.shake = 0;
    this.hitStop = 0;
    this.flashRed = 0;
    this.flashWhite = 0;
    this.player.dead = false;
  }

  startRun() {
    this.resetRunState();
    this.mode = 'playing';
    this.enterRoom('1,2', null);
    this.player.x = W / 2;
    this.player.y = H - 70;
    this.player.facing = 'up';
    this.roomBanner = { name: ROOMS['1,2'].name, timer: 2.8, max: 2.8 };
    this.hintTimer = 9;
    this.audio.ensure();
    this.audio.startMusic('explore');
    this.showToast('Find the two small keys. The warden keeps the Boss Key.', 4.2);
  }

  debugStart(kind) {
    this.startRun();
    this.hintTimer = 0;
    const open = (id, dir) => {
      if (this.doorStates[id]) this.doorStates[id][dir] = 'open';
    };
    const clear = (...ids) => ids.forEach((id) => { this.getRuntime(id).cleared = true; });
    if (kind === 'boss') {
      clear('0,0', '0,1', '1,1', '2,1', '2,0');
      this.player.keys = 2;
      this.player.bossKey = true;
      ['0,0', '0,1', '1,1', '2,1', '2,0'].forEach((id) => this.visited.add(id));
      open('1,1', 'n');
      this.enterRoom('1,0', 's');
      this.player.x = W / 2;
      this.player.y = H - 66;
      this.player.facing = 'up';
      this.roomBanner = null;
      this.bossBanner = 0;
      this.cinematic = 0;
      if (this.boss) {
        this.boss.state = 'hover';
        this.boss.intro = false;
        this.boss.stateTimer = 0.7;
        this.boss.x = W / 2;
        this.boss.y = 92;
      }
      this.showToast('DEBUG: Boss arena', 1.5);
    } else if (kind === 'vault') {
      clear('0,1', '1,1', '2,1');
      this.player.keys = 2;
      ['0,1', '1,1', '2,1'].forEach((id) => this.visited.add(id));
      open('0,1', 'n');
      this.enterRoom('0,0', 's');
      this.player.x = W / 2;
      this.player.y = H - 66;
      this.player.facing = 'up';
      this.roomBanner = null;
      this.showToast('DEBUG: Warden arena', 1.5);
    } else if (kind === 'hub') {
      clear('0,1', '2,1');
      this.player.keys = 2;
      this.enterRoom('1,1', 's');
      this.player.x = W / 2;
      this.player.y = H - 70;
      this.roomBanner = null;
      this.showToast('DEBUG: Grand Hall', 1.5);
    } else if (kind === 'map') {
      this.player.keys = 2;
      this.player.bossKey = true;
      this.player.maxHp = 6;
      this.player.hp = 6;
      Object.keys(ROOMS).forEach((id) => this.visited.add(id));
      this.showToast('DEBUG: All doors visible', 1.5);
    }
  }

  getRuntime(id) {
    if (!this.roomRuntimes.has(id)) {
      const def = ROOMS[id];
      const pots = (def.props || [])
        .filter((p) => p.type === 'pot')
        .map((p) => ({ x: tileCenter(p.tx), y: tileCenter(p.ty), broken: false }));
      const chests = (def.chests || []).map((ch) => ({
        ...ch,
        x: tileCenter(ch.tx),
        y: tileCenter(ch.ty),
        opened: false,
        hidden: !!ch.hidden,
      }));
      this.roomRuntimes.set(id, { pots, chests, cleared: false });
    }
    return this.roomRuntimes.get(id);
  }

  getSolid(id) {
    if (!this.solidCache.has(id)) this.solidCache.set(id, buildSolid(ROOMS[id]));
    return this.solidCache.get(id);
  }

  enterRoom(id, fromDir) {
    const def = ROOMS[id];
    if (!def) return;
    this.roomId = id;
    this.visited.add(id);
    this.roomState = this.getRuntime(id);
    this.enemies = [];
    this.boss = null;
    this.projectiles = [];
    this.pickups = [];

    if (!this.roomState.cleared) {
      for (const e of def.enemies || []) {
        this.enemies.push(new Enemy(this, e.type, tileCenter(e.tx), tileCenter(e.ty)));
      }
    }

    const spawn = roomSpawn(id, fromDir);
    this.player.x = spawn.x;
    this.player.y = spawn.y;
    this.player.facing = spawn.facing;
    this.player.kbx = 0;
    this.player.kby = 0;

    if (def.boss && !this.roomState.cleared) {
      this.boss = new Boss(this, W / 2, 100);
      this.enemies.push(this.boss);
      this.bossBanner = 3.2;
      this.cinematic = 2.3;
      if (this.doorStates[id]) this.doorStates[id].s = 'sealed';
      if (this.doorStates['1,1']) this.doorStates['1,1'].n = 'sealed';
      this.audio.setMusic('boss');
    } else {
      this.audio.setMusic('explore');
    }

    this.roomBanner = { name: def.name, timer: 2.7, max: 2.7 };
  }

  // -------------------------------------------------------------------------
  // Update
  // -------------------------------------------------------------------------
  update(dt) {
    this.time += dt;
    this.shake = Math.max(0, this.shake - dt * 28);
    this.flashRed = Math.max(0, this.flashRed - dt * 3.2);
    this.flashWhite = Math.max(0, this.flashWhite - dt * 1.7);

    if (this.input.justPressed('mute')) {
      const muted = this.audio.toggleMute();
      if (this.mode === 'playing' || this.mode === 'paused') {
        this.showToast(muted ? 'Sound off.' : 'Sound on.', 1.2);
      }
    }

    if (this.mode === 'title') {
      this.updateTitle(dt);
      return;
    }
    if (this.mode === 'playing') {
      if (this.input.justPressed('pause')) {
        this.togglePause();
        return;
      }
      this.updatePlaying(dt);
      return;
    }
    if (this.mode === 'paused') {
      if (this.input.justPressed('pause') || this.input.justPressed('confirm')) this.togglePause();
      return;
    }
    if (this.mode === 'reward') {
      this.updateReward(dt);
      return;
    }
    if (this.mode === 'message') {
      this.updateMessage(dt);
      return;
    }
    if (this.mode === 'dead') {
      this.updateDead(dt);
      return;
    }
    if (this.mode === 'victory') {
      this.updateVictory(dt);
    }
  }

  updateTitle(dt) {
    this.titleTime += dt;
    for (const e of this.titleEmbers) {
      e.y -= e.vy * dt;
      e.x += Math.sin(this.titleTime * 0.8 + e.phase) * 5 * dt;
      e.life -= dt;
      if (e.life <= 0) {
        e.x = rand(30, W - 30);
        e.y = rand(H * 0.5, H + 20);
        e.vy = rand(9, 26);
        e.life = rand(2.5, 7);
        e.size = rand(0.7, 2);
      }
    }
    if (
      this.input.justPressed('confirm') ||
      this.input.justPressed('attack') ||
      this.input.justPressed('interact')
    ) {
      this.startRun();
    }
  }

  updatePlaying(dt) {
    this.runTime += dt;
    this.updateTimers(dt);

    if (this.transition) {
      this.transition.t += dt;
      this.updateParticles(dt);
      if (this.transition.t >= this.transition.dur) this.transition = null;
      return;
    }

    if (this.cinematic > 0) {
      this.cinematic -= dt;
      this.updateAmbient(dt);
      this.updateParticles(dt);
      if (this.boss && !this.boss.dead) this.boss.update(dt);
      return;
    }

    if (this.hitStop > 0) {
      this.hitStop -= dt;
      return;
    }

    if (this.player.dead) return;

    this.player.update(dt);
    for (const e of this.enemies) {
      if (!e.dead) e.update(dt);
    }
    this.enemies = this.enemies.filter((e) => !e.dead);
    if (this.mode !== 'playing') return;

    this.updateProjectiles(dt);
    if (this.mode !== 'playing') return;
    this.updatePickups(dt);
    this.updateParticles(dt);
    this.updateAmbient(dt);

    this.checkDoors();
    if (this.transition) return;
    this.checkRoomClear();
  }

  updateTimers(dt) {
    if (this.toast) {
      this.toast.timer -= dt;
      if (this.toast.timer <= 0) this.toast = null;
    }
    if (this.roomBanner) {
      this.roomBanner.timer -= dt;
      if (this.roomBanner.timer <= 0) this.roomBanner = null;
    }
    if (this.bossBanner > 0) this.bossBanner -= dt;
    if (this.hintTimer > 0) this.hintTimer -= dt;
    this.doorHintCooldown = Math.max(0, this.doorHintCooldown - dt);
  }

  updateProjectiles(dt) {
    for (const pr of this.projectiles) {
      if (!pr.dead) pr.update(dt);
      if (this.mode !== 'playing') return;
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }

  updatePickups(dt) {
    for (const p of this.pickups) p.update(dt);
    this.pickups = this.pickups.filter((p) => !p.dead);
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;
      p.vx *= Math.pow(p.drag ?? 0.12, dt);
      p.vy *= Math.pow(p.drag ?? 0.12, dt);
      p.rot = (p.rot || 0) + (p.spin || 0) * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  updateAmbient(dt) {
    this.ambientTimer -= dt;
    if (this.ambientTimer > 0) return;
    this.ambientTimer = rand(0.1, 0.26);
    const room = ROOMS[this.roomId];
    if (!room) return;
    const sources = (room.torches || []).map((t) => this.torchFlamePos(t));
    for (const p of room.props || []) {
      if (p.type === 'brazier') sources.push({ x: p.tx * 16 + 8, y: p.ty * 16 + 2 });
    }
    if (!sources.length) return;
    const pos = sources[Math.floor(rand(0, sources.length))];
    this.addParticle({
      kind: 'spark',
      x: pos.x + rand(-4, 4),
      y: pos.y + rand(-2, 2),
      vx: rand(-5, 5),
      vy: rand(-30, -14),
      gravity: -3,
      drag: 0.7,
      life: rand(0.7, 1.6),
      maxLife: 1.6,
      size: rand(0.8, 1.8),
      color: Math.random() < 0.4 ? '#ffd27a' : '#ff9a4a',
      alpha: 0.85,
    });
  }

  torchFlamePos(t) {
    if (t.dir === 'n') return { x: t.tx * 16 + 8, y: 14 };
    if (t.dir === 's') return { x: t.tx * 16 + 8, y: H - 18 };
    if (t.dir === 'w') return { x: 19, y: t.ty * 16 + 8 };
    return { x: W - 19, y: t.ty * 16 + 8 };
  }

  togglePause() {
    if (this.mode === 'playing') {
      this.mode = 'paused';
      this.audio.sfx('pause');
    } else if (this.mode === 'paused') {
      this.mode = 'playing';
      this.audio.sfx('pause');
    }
  }

  // -------------------------------------------------------------------------
  // Doors, transitions, keys
  // -------------------------------------------------------------------------
  nearDoor(dir) {
    const p = this.player;
    if (dir === 'n') return Math.abs(p.x - W / 2) < 22 && p.y < 40;
    if (dir === 's') return Math.abs(p.x - W / 2) < 22 && p.y > H - 40;
    if (dir === 'w') return Math.abs(p.y - H / 2) < 24 && p.x < 40;
    return Math.abs(p.y - H / 2) < 24 && p.x > W - 40;
  }

  pastThreshold(dir) {
    const p = this.player;
    if (dir === 'n') return p.y < 10;
    if (dir === 's') return p.y > H - 10;
    if (dir === 'w') return p.x < 10;
    return p.x > W - 10;
  }

  checkDoors() {
    for (const dir of DIRECTIONS) {
      const state = this.doorStates[this.roomId]?.[dir];
      if (!state) continue;
      if (this.nearDoor(dir)) {
        if (state === 'locked') {
          if (this.doorHintCooldown > 0) return;
          if (this.player.keys > 0) {
            this.unlockDoor(dir, false);
          } else {
            this.showToast('Locked tight. A small key is needed.', 2.3);
            this.doorHintCooldown = 2.3;
          }
          return;
        }
        if (state === 'boss') {
          if (this.doorHintCooldown > 0) return;
          if (this.player.bossKey) {
            this.unlockDoor(dir, true);
          } else {
            this.showToast('The great door is bound to a Boss Key.', 2.7);
            this.doorHintCooldown = 2.7;
          }
          return;
        }
        if (state === 'sealed') {
          if (this.doorHintCooldown <= 0) {
            this.showToast(
              ROOMS[this.roomId].boss ? 'Sealed until the Hollow Eye falls.' : 'Sealed from the other side.',
              2.4
            );
            this.doorHintCooldown = 2.4;
          }
          return;
        }
      }
      if (state === 'open' && this.pastThreshold(dir)) {
        this.startTransition(dir);
        return;
      }
    }
  }

  unlockDoor(dir, isBoss) {
    const nd = neighborId(this.roomId, dir);
    if (isBoss) {
      this.player.bossKey = false;
      this.audio.sfx('bossDoor');
      this.shake = Math.max(this.shake, 9);
      this.flashWhite = 0.25;
      this.showToast('The Boss Key turns. The great door opens.', 3);
      this.cinematic = Math.max(this.cinematic, 0.55);
    } else {
      this.player.keys--;
      this.audio.sfx('unlock');
      this.showToast('The lock clicks open.', 1.8);
      this.shake = Math.max(this.shake, 2.5);
    }
    if (this.doorStates[this.roomId]) this.doorStates[this.roomId][dir] = 'open';
    if (nd && this.doorStates[nd]) this.doorStates[nd][OPPOSITE[dir]] = 'open';
    const c = DOOR_CENTER[dir];
    this.spark(c.x, c.y, 10, '#ffd27a');
    this.doorHintCooldown = 1.2;
  }

  startTransition(dir) {
    const target = neighborId(this.roomId, dir);
    if (!target || !ROOMS[target]) {
      this.showToast('A dead end.', 1.2);
      return;
    }
    const snap = document.createElement('canvas');
    snap.width = W;
    snap.height = H;
    const sctx = snap.getContext('2d');
    const oldShake = this.shake;
    this.shake = 0;
    this.view.drawScene(sctx, this, true);
    this.shake = oldShake;
    this.transition = { dir, t: 0, dur: 0.32, snap };
    this.enterRoom(target, dir);
  }

  // -------------------------------------------------------------------------
  // Interaction and items
  // -------------------------------------------------------------------------
  tryInteract(player) {
    const def = ROOMS[this.roomId];
    for (const sign of def.signs || []) {
      const x = tileCenter(sign.tx);
      const y = tileCenter(sign.ty);
      if (dist(player.x, player.y, x, y) < 31) {
        this.showMessage(sign.text);
        return;
      }
    }
    for (const chest of this.roomState.chests) {
      if (chest.hidden) continue;
      if (dist(player.x, player.y, chest.x, chest.y) < 31) {
        if (chest.opened) this.showToast('Empty.', 1.0);
        else this.openChest(chest);
        return;
      }
    }
  }

  openChest(chest) {
    if (chest.opened || chest.hidden) return;
    chest.opened = true;
    this.audio.sfx('chest');
    this.burst(chest.x, chest.y - 6, 14, '#ffd27a');
    let reward = null;
    if (chest.content === 'key') {
      this.player.keys++;
      reward = {
        kind: 'key',
        title: 'SMALL KEY',
        subtitle: this.player.keys > 1 ? 'Two locks now answer to you.' : 'One lock now answers to you.',
      };
    } else if (chest.content === 'bossKey') {
      this.player.bossKey = true;
      reward = {
        kind: 'bossKey',
        title: 'BOSS KEY',
        subtitle: 'The great door in the Grand Hall will yield.',
      };
      this.shake = Math.max(this.shake, 6);
    } else if (chest.content === 'heartContainer') {
      this.player.maxHp++;
      this.player.hp = this.player.maxHp;
      reward = {
        kind: 'heartContainer',
        title: 'HEART CONTAINER',
        subtitle: 'Your life force grows.',
      };
      this.audio.sfx('heart');
    }
    if (reward) {
      this.reward = { ...reward, timer: 2.8 };
      this.mode = 'reward';
      this.flashWhite = 0.22;
    }
  }

  revealChest(id) {
    for (const runtime of this.roomRuntimes.values()) {
      for (const chest of runtime.chests) {
        if (chest.id === id && chest.hidden) {
          chest.hidden = false;
          if (this.roomState === runtime) {
            this.burst(chest.x, chest.y, 22, '#ffd27a');
            this.spark(chest.x, chest.y, 14, '#fff3c4');
          }
          this.showToast('The Warden falls. A Boss Key chest appears.', 3.2);
          this.audio.sfx('secret');
          this.shake = Math.max(this.shake, 5);
        }
      }
    }
  }

  showMessage(lines) {
    this.message = { lines, shown: 0 };
    this.mode = 'message';
    this.audio.sfx('pickup');
  }

  updateMessage(dt) {
    const total = this.message.lines.join('').length;
    this.message.shown += dt * 52;
    const advance =
      this.input.justPressed('interact') ||
      this.input.justPressed('confirm') ||
      this.input.justPressed('attack');
    if (advance) {
      if (this.message.shown < total) {
        this.message.shown = total;
      } else {
        this.message = null;
        this.mode = 'playing';
      }
    }
  }

  updateReward(dt) {
    this.reward.timer -= dt;
    this.updateParticles(dt);
    const advance =
      this.input.justPressed('attack') ||
      this.input.justPressed('confirm') ||
      this.input.justPressed('interact');
    if ((advance && this.reward.timer < 2.1) || this.reward.timer <= 0) {
      this.reward = null;
      this.mode = 'playing';
      this.player.attackCooldown = 0.12;
    }
  }

  // -------------------------------------------------------------------------
  // Death and victory
  // -------------------------------------------------------------------------
  onPlayerDeath() {
    this.deaths++;
    this.mode = 'dead';
    this.deathTimer = 0;
    this.player.dead = true;
    this.player.kbx = 0;
    this.player.kby = 0;
    this.audio.sfx('death');
    this.audio.setMusic(null);
    this.shake = Math.max(this.shake, 9);
    this.flashRed = 0.5;
  }

  updateDead(dt) {
    this.deathTimer += dt;
    this.updateParticles(dt);
    if (this.deathTimer > 0.9 && (this.input.justPressed('confirm') || this.input.justPressed('attack'))) {
      this.respawn();
    }
  }

  respawn() {
    this.player.dead = false;
    this.player.hp = this.player.maxHp;
    this.player.invuln = 1.4;
    this.player.kbx = 0;
    this.player.kby = 0;
    this.player.attackTimer = 0;
    this.player.attackCooldown = 0;
    this.transition = null;
    this.reward = null;
    this.message = null;
    this.cinematic = 0;
    this.bossBanner = 0;
    this.boss = null;
    if (!this.getRuntime('1,0').cleared) {
      if (this.doorStates['1,1']) this.doorStates['1,1'].n = 'open';
      if (this.doorStates['1,0']) this.doorStates['1,0'].s = 'open';
    }
    this.enterRoom('1,2', null);
    this.player.x = W / 2;
    this.player.y = H - 70;
    this.player.facing = 'up';
    this.mode = 'playing';
    this.roomBanner = { name: 'Sealed Entrance', timer: 2.2, max: 2.2 };
    this.audio.startMusic('explore');
    this.showToast('You rise again. Your keys remain.', 3.2);
  }

  onBossDefeated() {
    this.getRuntime('1,0').cleared = true;
    if (this.doorStates['1,0']) this.doorStates['1,0'].s = 'open';
    if (this.doorStates['1,1']) this.doorStates['1,1'].n = 'open';
    this.mode = 'victory';
    this.victoryTime = 0;
    this.flashWhite = 1;
    this.audio.setMusic(null);
    this.audio.sfx('victory');
    this.burst(this.player.x, this.player.y - 10, 40, '#ffd27a');
  }

  updateVictory(dt) {
    this.victoryTime += dt;
    this.updateParticles(dt);
    if (this.victoryTime > 1.4 && (this.input.justPressed('confirm') || this.input.justPressed('attack'))) {
      this.startRun();
    }
  }

  // -------------------------------------------------------------------------
  // Collision & movement
  // -------------------------------------------------------------------------
  circleCollides(x, y, r) {
    if (x - r < 0 || x + r > W || y - r < 0 || y + r > H) return true;
    const solid = this.getSolid(this.roomId);
    const tx0 = Math.max(0, Math.floor((x - r) / 16));
    const tx1 = Math.min(31, Math.floor((x + r) / 16));
    const ty0 = Math.max(0, Math.floor((y - r) / 16));
    const ty1 = Math.min(17, Math.floor((y + r) / 16));
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (solid[ty]?.[tx] && circleRect(x, y, r, tx * 16, ty * 16, 16, 16)) return true;
      }
    }
    for (const pot of this.roomState.pots) {
      if (!pot.broken && circleRect(x, y, r, pot.x - 6, pot.y - 6, 12, 12)) return true;
    }
    for (const chest of this.roomState.chests) {
      if (!chest.hidden && circleRect(x, y, r, chest.x - 9, chest.y - 7, 18, 16)) return true;
    }
    for (const dir of DIRECTIONS) {
      const state = this.doorStates[this.roomId]?.[dir];
      const dr = doorRect(dir, state);
      if (dr && circleRect(x, y, r, dr.x, dr.y, dr.w, dr.h)) return true;
    }
    return false;
  }

  moveBody(body, dx, dy) {
    let blocked = false;
    if (dx !== 0) {
      body.x += dx;
      if (this.circleCollides(body.x, body.y, body.r)) {
        body.x -= dx;
        blocked = true;
      }
    }
    if (dy !== 0) {
      body.y += dy;
      if (this.circleCollides(body.x, body.y, body.r)) {
        body.y -= dy;
        blocked = true;
      }
    }
    return blocked;
  }

  canControl() {
    return this.mode === 'playing' && !this.transition && this.cinematic <= 0 && !this.player.dead;
  }

  // -------------------------------------------------------------------------
  // Combat helpers, particles, pickups
  // -------------------------------------------------------------------------
  spawnArrow(x, y, angle) {
    const speed = 148;
    this.projectiles.push(
      new Projectile(this, x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 'arrow', 1, 'enemy')
    );
  }

  spawnPickup(x, y, kind) {
    this.pickups.push(new Pickup(this, x, y, kind));
  }

  onEnemyDeath(enemy) {
    this.kills++;
    if (this.mode !== 'playing') return;
    const def = ROOMS[this.roomId];
    if (def.boss) return;
    if ((def.enemies || []).length === 0) return;
    if (this.enemies.every((e) => e.dead)) {
      this.roomState.cleared = true;
      if (this.roomId !== '0,0') this.showToast('The room falls silent.', 1.6);
    }
  }

  checkRoomClear() {
    const def = ROOMS[this.roomId];
    if (def.boss || this.roomState.cleared) return;
    if (!(def.enemies || []).length) return;
    if (this.enemies.every((e) => e.dead)) {
      this.roomState.cleared = true;
      if (this.roomId !== '0,0') this.showToast('The room falls silent.', 1.6);
    }
  }

  breakPot(pot) {
    if (pot.broken) return;
    pot.broken = true;
    this.audio.sfx('hit');
    this.burst(pot.x, pot.y, 10, '#8fb0c4');
    this.shake = Math.max(this.shake, 1.2);
    if (Math.random() < 0.32) this.spawnPickup(pot.x, pot.y - 4, 'heart');
  }

  addParticle(p) {
    this.particles.push({
      life: 1,
      maxLife: 1,
      vx: 0,
      vy: 0,
      size: 2,
      color: '#fff',
      kind: 'spark',
      gravity: 0,
      drag: 0.15,
      alpha: 1,
      ...p,
    });
  }

  spark(x, y, n, color) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(30, 130);
      this.addParticle({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        gravity: 80,
        drag: 0.05,
        life: rand(0.2, 0.55),
        maxLife: 0.55,
        size: rand(1, 2.4),
        color,
      });
    }
  }

  dust(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.addParticle({
        kind: 'dust',
        x: x + rand(-6, 6),
        y: y + rand(-2, 2),
        vx: rand(-24, 24),
        vy: rand(-28, -6),
        gravity: -8,
        drag: 0.4,
        life: rand(0.3, 0.75),
        maxLife: 0.75,
        size: rand(1.5, 3.4),
        color: '#6b6278',
        alpha: 0.5,
      });
    }
  }

  burst(x, y, n, color) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(30, 170);
      this.addParticle({
        kind: Math.random() < 0.6 ? 'spark' : 'shard',
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 30,
        gravity: 150,
        drag: 0.08,
        life: rand(0.35, 0.9),
        maxLife: 0.9,
        size: rand(1.2, 3.4),
        color,
        rot: rand(0, 6),
        spin: rand(-8, 8),
      });
    }
    this.addParticle({
      kind: 'ring',
      x,
      y,
      life: 0.35,
      maxLife: 0.35,
      size: 8,
      color,
    });
  }

  showToast(text, duration = 2) {
    this.toast = { text, timer: duration, max: duration };
  }

  // -------------------------------------------------------------------------
  // Render entry point
  // -------------------------------------------------------------------------
  render() {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (this.mode === 'title') {
      drawTitle(ctx, this);
      return;
    }

    this.view.drawScene(ctx, this, false);

    if (this.transition) {
      const tr = this.transition;
      const p = clamp(tr.t / tr.dur, 0, 1);
      const ease = 1 - Math.pow(1 - p, 2);
      let ox = 0;
      let oy = 0;
      if (tr.dir === 'n') oy = ease * H;
      else if (tr.dir === 's') oy = -ease * H;
      else if (tr.dir === 'e') ox = -ease * W;
      else if (tr.dir === 'w') ox = ease * W;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.clip();
      ctx.drawImage(tr.snap, ox, oy);
      ctx.restore();
    }

    if (this.mode !== 'dead' && this.mode !== 'victory') drawHUD(ctx, this);
    drawOverlays(ctx, this);
  }
}
