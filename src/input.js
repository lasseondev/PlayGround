export class Input {
  constructor(canvas, { onPause, onLockChange, onWeapon, onScoreboard } = {}) {
    this.canvas = canvas;
    this.onPause = onPause;
    this.onLockChange = onLockChange;
    this.onWeapon = onWeapon;
    this.onScoreboard = onScoreboard;
    this.keys = new Set();
    this.pressed = new Set();
    this.look = { x: 0, y: 0 };
    this.mouseFire = false;
    this.locked = false;
    this.dragging = false;
    this.dragLast = { x: 0, y: 0 };
    this.enabled = false;
    this.sensitivity = 1;
    this.wheel = 0;
    this.touch = {
      active: false,
      moveX: 0, moveY: 0,
      lookX: 0, lookY: 0,
      fire: false, jet: false,
      lookId: null, lookLast: { x: 0, y: 0 },
      joyId: null,
    };
    this.bind();
  }

  get isTouch() {
    return matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }

  bind() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') e.preventDefault();
      if (e.code === 'Space' && this.enabled) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      this.pressed.add(e.code);
      if (e.code === 'Escape' && this.onPause) this.onPause();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouseFire = false;
      this.touch.fire = false;
      this.touch.jet = false;
    });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      this.onLockChange?.(this.locked);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || !this.enabled) return;
      if (!this.locked && !this.isTouch) {
        this.requestLock();
        this.dragging = true;
        this.dragLast = { x: e.clientX, y: e.clientY };
        return;
      }
      this.mouseFire = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) { this.mouseFire = false; this.dragging = false; }
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (this.locked) {
        this.look.x += e.movementX || 0;
        this.look.y += e.movementY || 0;
      } else if (this.dragging) {
        this.look.x += (e.clientX - this.dragLast.x) * 1.25;
        this.look.y += (e.clientY - this.dragLast.y) * 1.25;
        this.dragLast = { x: e.clientX, y: e.clientY };
      }
    });
    this.canvas.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.wheel += Math.sign(e.deltaY);
    }, { passive: false });

    // ---- Touch controls ----
    this.bindTouch();
  }

  bindTouch() {
    const stickZone = document.getElementById('stickZone');
    const knob = document.getElementById('stickKnob');
    const lookZone = document.getElementById('lookZone');
    const fire = document.getElementById('tFire');
    const jump = document.getElementById('tJump');
    const weapon = document.getElementById('tWeapon');
    const pause = document.getElementById('tPause');
    if (!stickZone) return;
    this.touch.active = true;

    const setKnob = (dx, dy) => {
      knob.style.transform = `translate(${dx * 42}px, ${dy * 42}px)`;
    };
    const onStick = (e) => {
      e.preventDefault();
      const r = stickZone.getBoundingClientRect();
      let dx = (e.clientX - (r.left + r.width / 2)) / (r.width * 0.42);
      let dy = (e.clientY - (r.top + r.height / 2)) / (r.height * 0.42);
      const len = Math.hypot(dx, dy);
      if (len > 1) { dx /= len; dy /= len; }
      const dead = 0.12;
      const mag = Math.hypot(dx, dy);
      if (mag < dead) { this.touch.moveX = 0; this.touch.moveY = 0; setKnob(dx, dy); return; }
      const s = (mag - dead) / (1 - dead);
      this.touch.moveX = (dx / mag) * s;
      this.touch.moveY = (dy / mag) * s;
      setKnob(dx, dy);
    };
    stickZone.addEventListener('pointerdown', (e) => {
      this.touch.joyId = e.pointerId;
      stickZone.setPointerCapture(e.pointerId);
      onStick(e);
    });
    stickZone.addEventListener('pointermove', (e) => {
      if (this.touch.joyId === e.pointerId) onStick(e);
    });
    const endStick = (e) => {
      if (this.touch.joyId !== e.pointerId) return;
      this.touch.joyId = null;
      this.touch.moveX = 0; this.touch.moveY = 0;
      setKnob(0, 0);
    };
    stickZone.addEventListener('pointerup', endStick);
    stickZone.addEventListener('pointercancel', endStick);

    lookZone.addEventListener('pointerdown', (e) => {
      this.touch.lookId = e.pointerId;
      this.touch.lookLast = { x: e.clientX, y: e.clientY };
      lookZone.setPointerCapture(e.pointerId);
    });
    lookZone.addEventListener('pointermove', (e) => {
      if (this.touch.lookId !== e.pointerId) return;
      this.touch.lookX += (e.clientX - this.touch.lookLast.x) * 1.9;
      this.touch.lookY += (e.clientY - this.touch.lookLast.y) * 1.9;
      this.touch.lookLast = { x: e.clientX, y: e.clientY };
    });
    const endLook = (e) => { if (this.touch.lookId === e.pointerId) this.touch.lookId = null; };
    lookZone.addEventListener('pointerup', endLook);
    lookZone.addEventListener('pointercancel', endLook);

    const holdBtn = (el, set) => {
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); set(true); el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointerup', () => set(false));
      el.addEventListener('pointercancel', () => set(false));
      el.addEventListener('pointerleave', () => set(false));
    };
    holdBtn(fire, (v) => { this.touch.fire = v; });
    holdBtn(jump, (v) => { this.touch.jet = v; if (v) this.pressed.add('Space'); });
    weapon.addEventListener('pointerdown', (e) => { e.preventDefault(); this.onWeapon?.(); });
    pause.addEventListener('pointerdown', (e) => { e.preventDefault(); this.onPause?.(); });
  }

  requestLock() {
    if (this.isTouch) return;
    try {
      const p = this.canvas.requestPointerLock?.();
      if (p?.catch) p.catch(() => {});
    } catch { /* pointer lock can be denied in embeds */ }
  }

  releaseLock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  isDown(code) { return this.keys.has(code); }
  wasPressed(code) { return this.pressed.has(code); }

  consumeLook() {
    const x = this.look.x + this.touch.lookX;
    const y = this.look.y + this.touch.lookY;
    this.look.x = 0; this.look.y = 0;
    this.touch.lookX = 0; this.touch.lookY = 0;
    return { x, y };
  }

  consumeWheel() {
    const w = this.wheel;
    this.wheel = 0;
    return w;
  }

  get move() {
    let x = 0, z = 0;
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1;
    if (this.isDown('KeyA') || this.isDown('ArrowLeft')) x -= 1;
    if (this.isDown('KeyW') || this.isDown('ArrowUp')) z += 1;
    if (this.isDown('KeyS') || this.isDown('ArrowDown')) z -= 1;
    x += this.touch.moveX;
    z -= this.touch.moveY;
    const len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    return { x, z };
  }

  get firing() { return this.mouseFire || this.touch.fire; }

  get jetHeld() {
    return this.isDown('Space') || this.touch.jet;
  }

  endFrame() { this.pressed.clear(); }
}
