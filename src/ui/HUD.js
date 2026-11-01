"use strict";

class HUD {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.animations = [];

    this.initializeHUD();
  }

  initializeHUD() {
    // Create health bar template
    this.healthBarTemplate = this.createHealthBar();

    // Create resource icon template
    this.resourceIconTemplate = this.createResourceIcon();

    // Create unit icon template
    this.unitIconTemplate = this.createUnitIcon();
  }

  createHealthBar() {
    return {
      container: { x: 0, y: 0, width: 100, height: 10 },
      fill: { x: 0, y: 0, width: 100, height: 10 },
      border: { x: 0, y: 0, width: 100, height: 10 },
      text: { x: 50, y: 5, width: 100, height: 10 }
    };
  }

  createResourceIcon() {
    return {
      icon: { x: 0, y: 0, width: 20, height: 20 },
      text: { x: 25, y: 15, width: 60, height: 20 },
      background: { x: 0, y: 0, width: 80, height: 30 }
    };
  }

  createUnitIcon() {
    return {
      icon: { x: 0, y: 0, width: 32, height: 32 },
      border: { x: 0, y: 0, width: 34, height: 34 },
      healthBar: { x: 0, y: 35, width: 34, height: 3 }
    };
  }

  update() {
    // Update HUD elements based on game state
    this.updateHealthBars();
    this.updateResourceDisplay();
    this.updateUnitDisplay();
    this.updateTurnIndicator();
  }

  updateHealthBars() {
    // Update player health bars
    Object.values(this.game.players).forEach(player => {
      if (player.townHall) {
        const healthPercent = player.townHall.health / player.townHall.maxHealth;
        // Update health bar display
      }
    });
  }

  updateResourceDisplay() {
    // Update resource display
    const resources = this.game.resources;
    Object.entries(resources).forEach(([type, resource]) => {
      // Update resource icon and amount display
    });
  }

  updateUnitDisplay() {
    // Update unit count display
    Object.values(this.game.players).forEach(player => {
      // Update unit count for each player
    });
  }

  updateTurnIndicator() {
    // Update turn indicator
    // Show which player's turn it is
  }

  render(ctx) {
    // Render HUD elements
    this.renderHealthBars(ctx);
    this.renderResourceDisplay(ctx);
    this.renderUnitDisplay(ctx);
    this.renderTurnIndicator(ctx);
    this.renderNotifications(ctx);
  }

  renderHealthBars(ctx) {
    Object.values(this.game.players).forEach((player, index) => {
      const y = 20 + index * 40;
      const health = player.townHall ? player.townHall.health / player.townHall.maxHealth : 0;

      // Draw health bar background
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(20, y, 100, 10);

      // Draw health
      ctx.fillStyle = health > 0.6 ? '#27ae60' : health > 0.3 ? '#f39c12' : '#e74c3c';
      ctx.fillRect(20, y, 100 * health, 10);

      // Draw border
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, y, 100, 10);

      // Draw player name
      ctx.fillStyle = player.color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(player.name, 130, y + 8);
    });
  }

  renderResourceDisplay(ctx) {
    const resources = this.game.resources;
    const startX = 20;
    const y = this.game.height - 30;

    Object.entries(resources).forEach(([type, resource], index) => {
      const x = startX + index * 80;

      // Draw resource icon
      ctx.fillStyle = this.getResourceColor(type);
      ctx.font = 'bold 16px Arial';
      ctx.fillText(this.getResourceIcon(type), x, y - 10);

      // Draw resource amount
      ctx.fillStyle = '#ecf0f1';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(resource.amount, x + 15, y - 10);
    });
  }

  renderUnitDisplay(ctx) {
    const startX = 20;
    const y = this.game.height - 10;

    Object.values(this.game.players).forEach((player, index) => {
      const x = startX + index * 120;
      const totalUnits = player.units.length;
      const buildings = player.buildings.length;

      ctx.fillStyle = player.color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${player.name}: ${totalUnits}U ${buildings}B`, x, y);
    });
  }

  renderTurnIndicator(ctx) {
    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Turn: ${this.game.currentTurn}`, 20, 50);
  }

  renderNotifications(ctx) {
    // Render notification system
  }

  showNotification(message, type = 'info') {
    // Add notification to display
  }

  getResourceColor(type) {
    const colors = {
      gold: '#f1c40f',
      wood: '#27ae60',
      stone: '#95a5a6',
      food: '#e67e22'
    };
    return colors[type] || '#ffffff';
  }

  getResourceIcon(type) {
    const icons = {
      gold: '⚡',
      wood: '🌳',
      stone: '🪨',
      food: '🍖'
    };
    return icons[type] || '?';
  }

  destroy() {
    this.game = null;
    this.elements = {};
    this.animations = [];
  }
}

export default HUD;