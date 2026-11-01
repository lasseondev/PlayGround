"use strict";

class InputManager {
  constructor() {
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      buttons: { left: false, right: false },
      wheel: 0
    };
    this.pointers = [];

    this.eventHandlers = {};

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.emit('keyDown', e.code);
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.emit('keyUp', e.code);
    });

    // Mouse events
    this.canvas = document.getElementById('game-canvas');
    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.emit('mouseMove', { x: this.mouse.x, y: this.mouse.y });
      });

      this.canvas.addEventListener('mousedown', (e) => {
        this.mouse.buttons[Object.keys(this.mouse.buttons)[e.button]] = true;
        this.emit('mouseDown', {
          button: e.button,
          x: this.mouse.x,
          y: this.mouse.y
        });
      });

      this.canvas.addEventListener('mouseup', (e) => {
        this.mouse.buttons[Object.keys(this.mouse.buttons)[e.button]] = false;
        this.emit('mouseUp', {
          button: e.button,
          x: this.mouse.x,
          y: this.mouse.y
        });
      });

      this.canvas.addEventListener('wheel', (e) => {
        this.mouse.wheel = e.deltaY;
        this.emit('mouseWheel', { deltaY: e.deltaY });
      });
    }

    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.pointers = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      }));
      this.emit('touchStart', this.pointers);
    });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.pointers = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      }));
      this.emit('touchMove', this.pointers);
    });

    document.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.pointers = this.pointers.filter(p =>
        !Array.from(e.changedTouches).some(t => t.identifier === p.id)
      );
      this.emit('touchEnd', this.pointers);
    });
  }

  update(deltaTime) {
    // Update input state
    // Handle input combinations (Ctrl+A, etc.)
    // Process queued inputs
  }

  isKeyPressed(code) {
    return this.keys[code] || false;
  }

  isMouseButtonPressed(button) {
    return this.mouse.buttons[button] || false;
  }

  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  getTouchPointers() {
    return this.pointers;
  }

  // Event handling
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  off(event, callback) {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(callback);
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in input handler for '${event}':`, error);
        }
      });
    }
  }

  destroy() {
    // Clean up event listeners
    this.keys = {};
    this.mouse = { x: 0, y: 0, buttons: { left: false, right: false }, wheel: 0 };
    this.pointers = [];
    this.eventHandlers = {};
  }

  // Unit selection utilities
  getSelectedUnit() {
    // Implementation would integrate with game selection system
    return null;
  }

  getSelectedBuilding() {
    // Implementation would integrate with game selection system
    return null;
  }
}

export default InputManager;