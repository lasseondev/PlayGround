// Keyboard + touch input. Actions expose held state and one-shot presses.
const KEY_MAP = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'attack',
  KeyJ: 'attack',
  KeyZ: 'attack',
  KeyE: 'interact',
  Enter: 'confirm',
  Escape: 'pause',
  KeyP: 'pause',
  KeyM: 'mute',
  KeyR: 'restart',
};

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.held = new Set();
    this.pressed = new Set();
    this.released = new Set();
    this.axis = { x: 0, y: 0 };
    this.virtual = { x: 0, y: 0 };
    this.pointerStart = null;
    this.anyGesture = false;
    this.gestureCallbacks = [];

    window.addEventListener('keydown', (e) => {
      const action = KEY_MAP[e.code];
      if (!action) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.anyGesture = true;
      if (!this.held.has(action)) this.pressed.add(action);
      this.held.add(action);
      if (action === 'confirm' || action === 'attack') this.fireGesture();
    });

    window.addEventListener('keyup', (e) => {
      const action = KEY_MAP[e.code];
      if (!action) return;
      this.held.delete(action);
      this.released.add(action);
    });

    window.addEventListener('blur', () => {
      this.held.clear();
      this.virtual.x = 0;
      this.virtual.y = 0;
    });

    canvas.addEventListener('pointerdown', () => {
      this.anyGesture = true;
      this.fireGesture();
    });

    this.setupTouch();
  }

  onGesture(fn) {
    this.gestureCallbacks.push(fn);
  }

  fireGesture() {
    for (const fn of this.gestureCallbacks) fn();
  }

  setupTouch() {
    const stick = document.getElementById('stick');
    const knob = document.getElementById('knob');
    const attack = document.getElementById('btn-attack');
    const use = document.getElementById('btn-use');
    if (!stick || !knob) return;

    let stickId = null;
    let center = { x: 0, y: 0 };
    const radius = () => stick.getBoundingClientRect().width * 0.34;

    const updateStick = (e) => {
      const r = radius();
      let dx = e.clientX - center.x;
      let dy = e.clientY - center.y;
      const len = Math.hypot(dx, dy);
      if (len > r) {
        dx = (dx / len) * r;
        dy = (dy / len) * r;
      }
      const nx = dx / r;
      const ny = dy / r;
      const dead = 0.18;
      this.virtual.x = Math.abs(nx) < dead ? 0 : nx;
      this.virtual.y = Math.abs(ny) < dead ? 0 : ny;
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    stick.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.anyGesture = true;
      this.fireGesture();
      stickId = e.pointerId;
      stick.setPointerCapture(e.pointerId);
      const r = stick.getBoundingClientRect();
      center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      updateStick(e);
    });

    stick.addEventListener('pointermove', (e) => {
      if (e.pointerId !== stickId) return;
      e.preventDefault();
      updateStick(e);
    });

    const endStick = (e) => {
      if (e.pointerId !== stickId) return;
      stickId = null;
      this.virtual.x = 0;
      this.virtual.y = 0;
      knob.style.transform = 'translate(-50%, -50%)';
    };
    stick.addEventListener('pointerup', endStick);
    stick.addEventListener('pointercancel', endStick);

    const bindButton = (el, action) => {
      if (!el) return;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.anyGesture = true;
        this.fireGesture();
        if (!this.held.has(action)) this.pressed.add(action);
        this.held.add(action);
      });
      const up = (e) => {
        e.preventDefault();
        this.held.delete(action);
        this.released.add(action);
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('pointerleave', up);
    };
    bindButton(attack, 'attack');
    bindButton(use, 'interact');
  }

  isDown(action) {
    return this.held.has(action);
  }

  justPressed(action) {
    return this.pressed.has(action);
  }

  readAxis() {
    let x = 0;
    let y = 0;
    if (this.isDown('left')) x -= 1;
    if (this.isDown('right')) x += 1;
    if (this.isDown('up')) y -= 1;
    if (this.isDown('down')) y += 1;
    if (this.virtual.x !== 0 || this.virtual.y !== 0) {
      x = this.virtual.x;
      y = this.virtual.y;
    }
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    this.axis.x = x;
    this.axis.y = y;
    return this.axis;
  }

  endFrame() {
    this.pressed.clear();
    this.released.clear();
  }
}
