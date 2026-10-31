export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.queue = [];
    this.lookX = 0;
    this.lookY = 0;
    this.moveX = 0;
    this.moveZ = 0;
    this.touchMove = { x: 0, y: 0 };
    this.pointerLocked = false;
    this.dragging = false;
    this.lastPointer = { x: 0, y: 0 };
    this.enabled = false;
    this.touchActive = false;
    this.joystick = document.getElementById('joystick');
    this.knob = document.getElementById('joystickKnob');
    this.cameraZone = document.getElementById('cameraZone');
    this._bind();
  }

  _bind() {
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.add('KeyW');
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.add('KeyA');
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.add('KeyS');
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.add('KeyD');
      this._keyAction(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.delete('KeyW');
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.delete('KeyA');
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.delete('KeyS');
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.delete('KeyD');
    });
    window.addEventListener('blur', () => this.keys.clear());

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      if (e.button === 0) {
        this.press('attack');
        if (!this.pointerLocked) this.canvas.requestPointerLock?.();
      } else if (e.button === 2) {
        e.preventDefault();
        this.press('parry');
      }
    });
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
      document.body.classList.toggle('pointer-locked', this.pointerLocked);
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (this.pointerLocked) {
        this.lookX += e.movementX * 0.0022;
        this.lookY += e.movementY * 0.0019;
      } else if (this.dragging) {
        this.lookX += (e.clientX - this.lastPointer.x) * 0.0032;
        this.lookY += (e.clientY - this.lastPointer.y) * 0.0027;
        this.lastPointer = { x: e.clientX, y: e.clientY };
      }
    });
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 1 || (e.button === 0 && !this.pointerLocked)) {
        this.dragging = true;
        this.lastPointer = { x: e.clientX, y: e.clientY };
      }
    });
    window.addEventListener('mouseup', () => { this.dragging = false; });

    this._bindTouch();
  }

  _keyAction(code) {
    if (code === 'KeyJ') this.press('attack');
    else if (code === 'KeyK') this.press('heavy');
    else if (code === 'KeyF') this.press('parry');
    else if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'Space') this.press('dodge');
    else if (code === 'KeyR') this.press('flask');
    else if (code === 'KeyQ') this.press('lock');
    else if (code === 'Escape') this.press('pause');
    else if (code === 'Enter') this.press('confirm');
  }

  _bindTouch() {
    const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    this.touchActive = isTouch;

    if (this.joystick) {
      let id = null;
      const rect = () => this.joystick.getBoundingClientRect();
      const move = (e) => {
        if (e.pointerId !== id) return;
        const r = rect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let dx = (e.clientX - cx) / (r.width * 0.36);
        let dy = (e.clientY - cy) / (r.height * 0.36);
        const len = Math.hypot(dx, dy);
        if (len > 1) { dx /= len; dy /= len; }
        this.touchMove.x = dx;
        this.touchMove.y = dy;
        if (this.knob) this.knob.style.transform = `translate(${dx * r.width * 0.3}px, ${dy * r.height * 0.3}px)`;
      };
      const end = (e) => {
        if (e.pointerId !== id) return;
        id = null;
        this.touchMove.x = 0;
        this.touchMove.y = 0;
        if (this.knob) this.knob.style.transform = '';
      };
      this.joystick.addEventListener('pointerdown', (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        id = e.pointerId;
        try { this.joystick.setPointerCapture(e.pointerId); } catch { /* synthetic pointers */ }
        move(e);
      });
      this.joystick.addEventListener('pointermove', move);
      this.joystick.addEventListener('pointerup', end);
      this.joystick.addEventListener('pointercancel', end);
    }

    if (this.cameraZone) {
      let id = null;
      let lx = 0, ly = 0;
      this.cameraZone.addEventListener('pointerdown', (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        id = e.pointerId;
        lx = e.clientX; ly = e.clientY;
        try { this.cameraZone.setPointerCapture(e.pointerId); } catch { /* synthetic pointers */ }
      });
      this.cameraZone.addEventListener('pointermove', (e) => {
        if (e.pointerId !== id) return;
        this.lookX += (e.clientX - lx) * 0.0045;
        this.lookY += (e.clientY - ly) * 0.0038;
        lx = e.clientX; ly = e.clientY;
      });
      const end = (e) => { if (e.pointerId === id) id = null; };
      this.cameraZone.addEventListener('pointerup', end);
      this.cameraZone.addEventListener('pointercancel', end);
    }

    document.querySelectorAll('[data-action]').forEach((btn) => {
      const action = btn.dataset.action;
      btn.addEventListener('pointerdown', (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        e.stopPropagation();
        this.press(action);
        btn.classList.add('is-down');
      });
      const up = () => btn.classList.remove('is-down');
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointercancel', up);
      btn.addEventListener('pointerleave', up);
    });
  }

  press(action) {
    if (!this.enabled) return;
    this.queue.push(action);
  }

  consume(action) {
    const i = this.queue.indexOf(action);
    if (i === -1) return false;
    this.queue.splice(i, 1);
    return true;
  }

  flush() {
    this.queue.length = 0;
    this.lookX = 0;
    this.lookY = 0;
  }

  update() {
    let x = 0, z = 0;
    if (this.keys.has('KeyA')) x -= 1;
    if (this.keys.has('KeyD')) x += 1;
    if (this.keys.has('KeyW')) z += 1;
    if (this.keys.has('KeyS')) z -= 1;
    if (this.touchActive && (Math.abs(this.touchMove.x) > 0.05 || Math.abs(this.touchMove.y) > 0.05)) {
      x = this.touchMove.x;
      z = -this.touchMove.y;
    }
    this.moveX = x;
    this.moveZ = z;
    const lx = this.lookX;
    const ly = this.lookY;
    this.lookX = 0;
    this.lookY = 0;
    return { x, z, lookX: lx, lookY: ly };
  }

  releasePointer() {
    if (document.pointerLockElement) document.exitPointerLock?.();
  }
}
