// Keyboard + pointer + touch input. Keeps the game loop free of DOM details.

export class Input {
  constructor(canvas, handlers = {}) {
    this.canvas = canvas;
    this.handlers = handlers;
    this.keys = new Set();
    this.move = { x: 0, y: 0 };
    this.jumpQueued = false;
    this.jumpHeld = false;
    this.run = false;
    this.dragging = false;
    this.pointerId = null;
    this.lastX = 0;
    this.lastY = 0;
    this.everInteracted = false;
    this.usingTouch = window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onBlur = this.onBlur.bind(this);

    window.addEventListener('keydown', this.onKeyDown, { passive: false });
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.setupTouch();
  }

  setupTouch() {
    const joystick = document.getElementById('joystick');
    const stick = document.getElementById('joystick-stick');
    const jumpBtn = document.getElementById('jump-btn');
    if (!joystick || !stick || !jumpBtn) return;

    let stickId = null;
    const radius = 44;
    const updateStick = (clientX, clientY) => {
      const rect = joystick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > radius) {
        dx = (dx / len) * radius;
        dy = (dy / len) * radius;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      this.move.x = dx / radius;
      this.move.y = -dy / radius;
      this.run = Math.hypot(this.move.x, this.move.y) > 0.92;
      this.everInteracted = true;
    };
    const resetStick = () => {
      stickId = null;
      stick.style.transform = 'translate(0px, 0px)';
      this.move.x = 0;
      this.move.y = 0;
      this.run = false;
    };

    joystick.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      stickId = e.pointerId;
      joystick.setPointerCapture(e.pointerId);
      updateStick(e.clientX, e.clientY);
    });
    joystick.addEventListener('pointermove', (e) => {
      if (e.pointerId !== stickId) return;
      e.preventDefault();
      updateStick(e.clientX, e.clientY);
    });
    joystick.addEventListener('pointerup', (e) => {
      if (e.pointerId === stickId) resetStick();
    });
    joystick.addEventListener('pointercancel', resetStick);

    jumpBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      jumpBtn.setPointerCapture(e.pointerId);
      this.jumpQueued = true;
      this.jumpHeld = true;
      this.everInteracted = true;
    });
    const release = () => { this.jumpHeld = false; };
    jumpBtn.addEventListener('pointerup', release);
    jumpBtn.addEventListener('pointercancel', release);
    jumpBtn.addEventListener('pointerleave', release);
  }

  onKeyDown(e) {
    if (e.code === 'Tab') return;
    const code = e.code;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) e.preventDefault();
    if (this.keys.has(code)) return;
    this.keys.add(code);
    this.everInteracted = true;

    if (code === 'Space' || code === 'KeyZ') {
      this.jumpQueued = true;
      this.jumpHeld = true;
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.run = true;
    if (code === 'KeyM') this.handlers.onMute?.();
    if (code === 'Escape' || code === 'KeyP') this.handlers.onPause?.();
    if (code === 'KeyR') this.handlers.onRestart?.();
    if (code === 'Enter' && this.handlers.onEnter) this.handlers.onEnter();
  }

  onKeyUp(e) {
    this.keys.delete(e.code);
    if (e.code === 'Space' || e.code === 'KeyZ') this.jumpHeld = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.run = false;
  }

  onBlur() {
    this.keys.clear();
    this.run = false;
    this.jumpHeld = false;
    this.move.x = 0;
    this.move.y = 0;
  }

  onPointerDown(e) {
    if (e.target !== this.canvas) return;
    if (e.pointerType === 'touch' && e.clientX > window.innerWidth * 0.55) return; // right side reserved for jump
    this.dragging = true;
    this.pointerId = e.pointerId;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.canvas.setPointerCapture?.(e.pointerId);
    this.everInteracted = true;
  }

  onPointerMove(e) {
    if (!this.dragging || e.pointerId !== this.pointerId) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.handlers.onOrbit?.(dx, dy);
  }

  onPointerUp(e) {
    if (e.pointerId === this.pointerId) {
      this.dragging = false;
      this.pointerId = null;
    }
  }

  onWheel(e) {
    e.preventDefault();
    this.handlers.onZoom?.(Math.sign(e.deltaY));
  }

  getMove() {
    let x = this.move.x;
    let y = this.move.y;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1;
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    return { x, y };
  }

  getRun() {
    return this.run;
  }

  consumeJump() {
    const q = this.jumpQueued;
    this.jumpQueued = false;
    return q;
  }

  getJumpHeld() {
    return this.jumpHeld;
  }

  resetTransient() {
    this.jumpQueued = false;
    this.jumpHeld = false;
    this.move.x = 0;
    this.move.y = 0;
  }
}
