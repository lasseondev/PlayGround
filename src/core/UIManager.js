"use strict";

class UIManager {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.panels = [];
    this.hudElements = {};
    this.gameStates = {};
    this.notifications = [];
    this.eventHandlers = {};

    this.initializeUI();
  }

  initializeUI() {
    // Initialize UI panels and elements
    this.hudElements = {
      topBar: { x: 0, y: 0, width: this.width, height: 40 },
      leftPanel: { x: 0, y: 40, width: 200, height: this.height - 40 },
      rightPanel: { x: this.width - 200, y: 40, width: 200, height: this.height - 40 },
      bottomPanel: { x: 0, y: this.height - 100, width: this.width, height: 100 }
    };

    this.setupDefaultUI();
  }

  setupDefaultUI() {
    // Setup default UI elements
    this.createTopBar();
    this.createLeftPanel();
    this.createRightPanel();
    this.createBottomPanel();
  }

  createTopBar() {
    this.topBar = {
      x: 0,
      y: 0,
      width: this.width,
      height: 40,
      backgroundColor: 'rgba(44, 62, 80, 0.9)',
      borderColor: '#3498db',
      borderWidth: 2
    };

    // Add turn indicator
    this.turnIndicator = {
      x: this.width / 2 - 100,
      y: 20,
      width: 200,
      height: 20,
      text: 'Player Turn',
      color: '#ecf0f1'
    };

    // Add resource display
    this.resourceDisplay = {
      x: this.width - 200,
      y: 10,
      width: 180,
      height: 30,
      items: []
    };
  }

  createLeftPanel() {
    this.leftPanel = {
      x: 0,
      y: 40,
      width: 200,
      height: this.height - 40,
      backgroundColor: 'rgba(52, 73, 94, 0.9)',
      borderColor: '#2980b9',
      borderWidth: 2
    };

    // Units section
    this.unitsSection = {
      x: 10,
      y: 60,
      width: 180,
      height: 200,
      title: 'Units',
      items: []
    };

    // Buildings section
    this.buildingsSection = {
      x: 10,
      y: 280,
      width: 180,
      height: 200,
      title: 'Buildings',
      items: []
    };
  }

  createRightPanel() {
    this.rightPanel = {
      x: this.width - 200,
      y: 40,
      width: 200,
      height: this.height - 40,
      backgroundColor: 'rgba(41, 128, 185, 0.9)',
      borderColor: '#1abc9c',
      borderWidth: 2
    };

    // Minimap
    this.minimap = {
      x: this.width - 190,
      y: 60,
      width: 180,
      height: 180,
      scale: 0.1,
      playerColors: {}
    };

    // Chat panel
    this.chatPanel = {
      x: this.width - 190,
      y: 260,
      width: 180,
      height: 200,
      messages: []
    };
  }

  createBottomPanel() {
    this.bottomPanel = {
      x: 0,
      y: this.height - 100,
      width: this.width,
      height: 100,
      backgroundColor: 'rgba(44, 62, 80, 0.9)',
      borderColor: '#e74c3c',
      borderWidth: 2
    };

    // Action buttons
    this.actionButtons = {
      build: { x: 20, y: 60, width: 80, height: 40, text: 'Build', color: '#27ae60' },
      train: { x: 110, y: 60, width: 80, height: 40, text: 'Train', color: '#2980b9' },
      attack: { x: 200, y: 60, width: 80, height: 40, text: 'Attack', color: '#e74c3c' },
      pause: { x: 290, y: 60, width: 80, height: 40, text: 'Pause', color: '#f39c12' }
    };

    // Selected unit info
    this.selectedUnitInfo = {
      x: 400,
      y: 60,
      width: 300,
      height: 40,
      visible: false,
      unit: null
    };
  }

  updateGameState(state) {
    this.gameStates = { ...this.gameStates, ...state };

    // Update UI based on game state
    if (state.currentPhase) {
      this.setGameState(state.currentPhase);
    }

    if (state.players) {
      this.updatePlayerInfo(state.players);
    }

    if (state.resources) {
      this.updateResources(state.resources);
    }

    if (state.selectedUnit) {
      this.updateSelectedUnit(state.selectedUnit);
    }

    if (state.selectedBuilding) {
      this.updateSelectedBuilding(state.selectedBuilding);
    }
  }

  setGameState(phase) {
    switch (phase) {
      case 'playing':
        this.updateTurnIndicator();
        this.showActionButtons(true);
        break;
      case 'paused':
        this.showActionButtons(false);
        this.turnIndicator.text = 'Paused';
        break;
      case 'gameover':
        this.showGameOverScreen();
        break;
      default:
        this.updateTurnIndicator();
    }
  }

  updatePlayerInfo(players) {
    // Update player info in UI
    Object.values(players).forEach(player => {
      const panelX = player.id === 'human' ? this.leftPanel.x : this.rightPanel.x;
      const panelY = player.id === 'human' ? this.leftPanel.y : this.rightPanel.y;

      // Update player color in minimap
      if (this.minimap.playerColors) {
        this.minimap.playerColors[player.name] = player.color;
      }
    });
  }

  updateResources(resources) {
    // Update resource display
    if (this.resourceDisplay.items) {
      this.resourceDisplay.items = [
        { label: 'Gold', value: resources.gold.amount, icon: '⚡' },
        { label: 'Wood', value: resources.wood.amount, icon: '🌳' },
        { label: 'Stone', value: resources.stone.amount, icon: '🪨' },
        { label: 'Food', value: resources.food.amount, icon: '🍖' }
      ];
    }
  }

  updateSelectedUnit(unit) {
    if (unit) {
      this.selectedUnitInfo.visible = true;
      this.selectedUnitInfo.unit = unit;

      // Update unit info panel
      if (this.unitsSection.items) {
        const unitInfo = {
          name: unit.type,
          health: `${unit.health}/${unit.maxHealth}`,
          attack: unit.attack,
          range: unit.range,
          cost: this.getUnitCost(unit.type)
        };

        const existingIndex = this.unitsSection.items.findIndex(item => item.name === unitInfo.name);
        if (existingIndex > -1) {
          this.unitsSection.items[existingIndex] = unitInfo;
        } else {
          this.unitsSection.items.push(unitInfo);
        }
      }
    } else {
      this.selectedUnitInfo.visible = false;
      this.selectedUnitInfo.unit = null;
    }
  }

  updateSelectedBuilding(building) {
    // Update building info
  }

  updateTurnIndicator() {
    if (this.turnIndicator) {
      this.turnIndicator.text = `Player Turn: ${this.gameStates.currentTurn || 'Human'}`;
    }
  }

  showActionButtons(show) {
    Object.values(this.actionButtons).forEach(button => {
      button.visible = show;
    });
  }

  showGameOverScreen() {
    // Show game over UI
    this.gameOverScreen = {
      visible: true,
      x: this.width / 2 - 200,
      y: this.height / 2 - 100,
      width: 400,
      height: 200,
      title: 'Game Over',
      message: 'Winner determined',
      buttons: [
        { text: 'Restart', x: 140, y: 150, width: 120, height: 40 },
        { text: 'Main Menu', x: 270, y: 150, width: 120, height: 40 }
      ]
    };
  }

  showNotification(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      duration,
      x: this.width - 300,
      y: this.height - 60,
      visible: true
    };

    this.notifications.push(notification);

    // Auto-hide notification
    setTimeout(() => {
      this.hideNotification(notification.id);
    }, duration);
  }

  hideNotification(id) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications[index].visible = false;
    }
  }

  render(ctx) {
    // Render UI panels
    this.renderTopBar(ctx);
    this.renderLeftPanel(ctx);
    this.renderRightPanel(ctx);
    this.renderBottomPanel(ctx);

    // Render notifications
    this.notifications.forEach(notification => {
      if (notification.visible) {
        this.renderNotification(ctx, notification);
      }
    });

    // Render game over screen
    if (this.gameOverScreen && this.gameOverScreen.visible) {
      this.renderGameOverScreen(ctx);
    }
  }

  renderTopBar(ctx) {
    ctx.save();

    // Draw top bar background
    ctx.fillStyle = this.topBar.backgroundColor;
    ctx.fillRect(this.topBar.x, this.topBar.y, this.topBar.width, this.topBar.height);

    // Draw border
    ctx.strokeStyle = this.topBar.borderColor;
    ctx.lineWidth = this.topBar.borderWidth;
    ctx.strokeRect(this.topBar.x, this.topBar.y, this.topBar.width, this.topBar.height);

    // Draw turn indicator
    ctx.fillStyle = this.turnIndicator.color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(
      this.turnIndicator.text,
      this.turnIndicator.x,
      this.turnIndicator.y
    );

    // Draw resource display
    if (this.resourceDisplay.items) {
      this.resourceDisplay.items.forEach((item, index) => {
        const x = this.resourceDisplay.x + index * 45;
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '12px Arial';
        ctx.fillText(`${item.icon} ${item.value}`, x, this.resourceDisplay.y);
        ctx.fillText(item.label, x, this.resourceDisplay.y + 15);
      });
    }

    ctx.restore();
  }

  renderLeftPanel(ctx) {
    ctx.save();

    // Draw left panel background
    ctx.fillStyle = this.leftPanel.backgroundColor;
    ctx.fillRect(this.leftPanel.x, this.leftPanel.y, this.leftPanel.width, this.leftPanel.height);

    // Draw border
    ctx.strokeStyle = this.leftPanel.borderColor;
    ctx.lineWidth = this.leftPanel.borderWidth;
    ctx.strokeRect(this.leftPanel.x, this.leftPanel.y, this.leftPanel.width, this.leftPanel.height);

    // Draw units section
    if (this.unitsSection.items) {
      ctx.fillStyle = '#ecf0f1';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(this.unitsSection.title, this.unitsSection.x, this.unitsSection.y);

      this.unitsSection.items.forEach((item, index) => {
        const y = this.unitsSection.y + 30 + index * 25;
        ctx.font = '12px Arial';
        ctx.fillText(`${item.name}: ${item.health}`, this.unitsSection.x, y);
      });
    }

    ctx.restore();
  }

  renderRightPanel(ctx) {
    ctx.save();

    // Draw right panel background
    ctx.fillStyle = this.rightPanel.backgroundColor;
    ctx.fillRect(this.rightPanel.x, this.rightPanel.y, this.rightPanel.width, this.rightPanel.height);

    // Draw border
    ctx.strokeStyle = this.rightPanel.borderColor;
    ctx.lineWidth = this.rightPanel.borderWidth;
    ctx.strokeRect(this.rightPanel.x, this.rightPanel.y, this.rightPanel.width, this.rightPanel.height);

    // Draw minimap
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);

    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);

    // Draw chat panel
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(this.chatPanel.x, this.chatPanel.y, this.chatPanel.width, this.chatPanel.height);

    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.chatPanel.x, this.chatPanel.y, this.chatPanel.width, this.chatPanel.height);

    ctx.restore();
  }

  renderBottomPanel(ctx) {
    ctx.save();

    // Draw bottom panel background
    ctx.fillStyle = this.bottomPanel.backgroundColor;
    ctx.fillRect(this.bottomPanel.x, this.bottomPanel.y, this.bottomPanel.width, this.bottomPanel.height);

    // Draw border
    ctx.strokeStyle = this.bottomPanel.borderColor;
    ctx.lineWidth = this.bottomPanel.borderWidth;
    ctx.strokeRect(this.bottomPanel.x, this.bottomPanel.y, this.bottomPanel.width, this.bottomPanel.height);

    // Draw action buttons
    Object.values(this.actionButtons).forEach(button => {
      if (button.visible) {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(button.text, button.x + button.width / 2 - 20, button.y + 25);
      }
    });

    // Draw selected unit info
    if (this.selectedUnitInfo.visible && this.selectedUnitInfo.unit) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        this.selectedUnitInfo.x,
        this.selectedUnitInfo.y,
        this.selectedUnitInfo.width,
        this.selectedUnitInfo.height
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(
        `Selected: ${this.selectedUnitInfo.unit.type}`,\n        this.selectedUnitInfo.x + 10,\n        this.selectedUnitInfo.y + 20
      );
    }

    ctx.restore();
  }

  renderNotification(ctx, notification) {
    ctx.save();

    const colors = {
      info: '#3498db',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c'
    };

    const color = colors[notification.type] || colors.info;

    ctx.fillStyle = color;
    ctx.fillRect(notification.x, notification.y, 290, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(notification.message, notification.x + 10, notification.y + 25);

    ctx.restore();
  }

  renderGameOverScreen(ctx) {
    if (!this.gameOverScreen) return;

    ctx.save();

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Game over panel
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(
      this.gameOverScreen.x,
      this.gameOverScreen.y,
      this.gameOverScreen.width,
      this.gameOverScreen.height
    );

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      this.gameOverScreen.x,
      this.gameOverScreen.y,
      this.gameOverScreen.width,
      this.gameOverScreen.height
    );

    // Title
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(
      this.gameOverScreen.title,
      this.gameOverScreen.x + 50,
      this.gameOverScreen.y + 50
    );

    // Message
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '16px Arial';
    ctx.fillText(
      this.gameOverScreen.message,
      this.gameOverScreen.x + 50,
      this.gameOverScreen.y + 90
    );

    // Buttons
    ctx.fillStyle = '#27ae60';
    this.gameOverScreen.buttons.forEach(button => {
      ctx.fillRect(button.x, button.y, button.width, button.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(button.text, button.x + button.width / 2 - 30, button.y + 25);
    });

    ctx.restore();
  }

  // Helper methods
  getUnitCost(type) {
    // Return unit cost based on type
    const costs = {
      worker: { gold: 50, wood: 30 },
      archer: { gold: 80, wood: 40 },
      swordsman: { gold: 100, wood: 50, stone: 30 },
      knight: { gold: 150, wood: 80, stone: 50, food: 20 },
      grunt: { gold: 60, wood: 30 },
      axeman: { gold: 90, wood: 50 },
      siege: { gold: 200, wood: 100, stone: 80 },
      skeleton: { souls: 30 },
      zombie: { souls: 40 },
      wraith: { souls: 60, wood: 20 }
    };

    return costs[type] || { gold: 0 };
  }

  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in UI handler for '${event}':`, error);
        }
      });
    }
  }

  destroy() {
    this.panels = [];
    this.hudElements = {};
    this.gameStates = {};
    this.notifications = [];
    this.eventHandlers = {};
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    // Update panel positions
    this.hudElements.topBar.width = this.width;
    this.hudElements.leftPanel.height = this.height - 40;
    this.hudElements.rightPanel.height = this.height - 40;
    this.hudElements.rightPanel.x = this.width - 200;
    this.hudElements.bottomPanel.width = this.width;
    this.hudElements.bottomPanel.y = this.height - 100;

    // Update UI elements
    this.updateUI();
  }
}

export default UIManager;