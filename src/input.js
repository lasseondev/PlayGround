import { clamp } from './util.js';

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.moveX = 0;
    this.moveZ = 0;
    this.attackQueued = false;
    this.rollQueued = false;
    this.interactQueued = false;
    this.pauseQueued = false;
    this.muteQueued = false;
    this.lookYaw = 0;
    this.lookPitch = 0;
    this.zoom = 0;
    this.locked = false;
    this.dragging = false;
    this.touchMoveX = 0;
    this.touchMoveZ = 0;
    this.touchId = null;
    this.camTouch = null;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    this.enabled = false;
    this.onLockLost = null;

    this.bindKeyboard();
    this.bindMouse();
    this.bindTouch();
  }

  setEnabled(value) {
    this.enabled = value;
    if (!value) {
      this.keys.clear();
      this.moveX = this.moveZ = 0;
      this.attackQueued = this.rollQueued = this.interactQueued = false;
      this.dragging = false;
    }
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (e.code === 'KeyJ') this.attackQueued = true;
      if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.rollQueued = true;
      if (e.code === 'KeyE') this.interactQueued = true;
      if (e.code === 'Escape') this.pauseQueued = true;
      if (e.code === 'KeyM') this.muteQueued = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    window.addEventListener('blur', () => this.keys.clear());
  }

  bindMouse() {
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      if (e.button === 0) {
        if (document.pointerLockElement === this.canvas) {
          this.attackQueued = true;
        } else {
          this.requestLock();
          this.attackQueued = true;
        }
      } else if (e.button === 2) {
        this.dragging = true;
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) this.dragging = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (document.pointerLockElement === this.canvas) {
        this.lookYaw -= e.movementX * 0.0024;
        this.lookPitch -= e.movementY * 0.0021;
      } else if (this.dragging) {
        this.lookYaw -= e.movementX * 0.0035;
        this.lookPitch -= e.movementY * 0.003;
      }
    });
    this.canvas.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.zoom += Math.sign(e.deltaY) * 0.5;
    }, { passive: false });
    document.addEventListener('pointerlockchange', () => {
      const wasLocked = this.locked;
      this.locked = document.pointerLockElement === this.canvas;
      if (wasLocked && !this.locked && this.enabled && this.onLockLost) this.onLockLost();
    });
  }

  bindTouch() {
    if (!this.isTouch) return;
    document.body.classList.add('touch-mode');
    const zone = document.getElementById('joystick-zone');
    const knob = document.getElementById('joystick-knob');
    if (zone && knob) {
      const update = (e) => {
        const rect = zone.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const max = rect.width * 0.34;
        const len = Math.hypot(dx, dy);
        if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
        knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        this.touchMoveX = clamp(dx / max, -1, 1);
        this.touchMoveZ = clamp(-dy / max, -1, 1);
      };
      zone.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.touchId = e.pointerId;
        zone.setPointerCapture(e.pointerId);
        update(e);
      });
      zone.addEventListener('pointermove', (e) => {
        if (this.touchId !== e.pointerId) return;
        e.preventDefault();
        update(e);
      });
      const end = (e) => {
        if (this.touchId !== e.pointerId) return;
        this.touchId = null;
        this.touchMoveX = 0;
        this.touchMoveZ = 0;
        knob.style.transform = 'translate(-50%, -50%)';
      };
      zone.addEventListener('pointerup', end);
      zone.addEventListener('pointercancel', end);
    }

    const attack = document.getElementById('touch-attack');
    const roll = document.getElementById('touch-roll');
    const interact = document.getElementById('touch-interact');
    for (const [el, fn] of [[attack, () => { this.attackQueued = true; }], [roll, () => { this.rollQueued = true; }], [interact, () => { this.interactQueued = true; }]]) {
      if (!el) continue;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.enabled) fn();
      });
    }

    let lastCam = null;
    this.canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      lastCam = { id: e.pointerId, x: e.clientX, y: e.clientY };
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (!lastCam || lastCam.id !== e.pointerId) return;
      const dx = e.clientX - lastCam.x;
      const dy = e.clientY - lastCam.y;
      lastCam.x = e.clientX;
      lastCam.y = e.clientY;
      this.lookYaw -= dx * 0.005;
      this.lookPitch -= dy * 0.004;
    });
    const camEnd = (e) => {
      if (lastCam && lastCam.id === e.pointerId) lastCam = null;
    };
    this.canvas.addEventListener('pointerup', camEnd);
    this.canvas.addEventListener('pointercancel', camEnd);
  }

  requestLock() {
    if (this.isTouch) return;
    try {
      const p = this.canvas.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) p.catch(() => {
        try { this.canvas.requestPointerLock(); } catch {}
      });
    } catch {
      try { this.canvas.requestPointerLock(); } catch {}
    }
  }

  releaseLock() {
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
  }

  update() {
    if (this.isTouch && (this.touchMoveX || this.touchMoveZ)) {
      this.moveX = this.touchMoveX;
      this.moveZ = this.touchMoveZ;
    } else {
      let x = 0, z = 0;
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z += 1;
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z -= 1;
      const len = Math.hypot(x, z);
      if (len > 1) { x /= len; z /= len; }
      this.moveX = x;
      this.moveZ = z;
    }
  }

  consumeAttack() { const v = this.attackQueued; this.attackQueued = false; return v; }
  consumeRoll() { const v = this.rollQueued; this.rollQueued = false; return v; }
  consumeInteract() { const v = this.interactQueued; this.interactQueued = false; return v; }
  consumePause() { const v = this.pauseQueued; this.pauseQueued = false; return v; }
  consumeMute() { const v = this.muteQueued; this.muteQueued = false; return v; }
  consumeLook() {
    const v = { yaw: this.lookYaw, pitch: this.lookPitch };
    this.lookYaw = 0;
    this.lookPitch = 0;
    return v;
  }
  consumeZoom() { const v = this.zoom; this.zoom = 0; return v; }
}
