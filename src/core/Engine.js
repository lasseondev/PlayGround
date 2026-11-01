"use strict";

class Engine {
  constructor(canvasId, width, height) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.lastFrameTime = 0;
    this.deltaTime = 0;

    this.initializeCanvas();
  }

  initializeCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.imageRendering = '-webkit-optimize-contrast';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  render() {
    // This is called by the game loop
    // Subclasses or mixins can override for custom rendering
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  destroy() {
    this.ctx = null;
    this.canvas = null;
  }

  getDeltaTime() {
    return this.deltaTime;
  }

  updateDeltaTime(currentTime) {
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
  }
}

export default Engine;