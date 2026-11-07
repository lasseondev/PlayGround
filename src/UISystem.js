class UISystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.hudElements = [];
    this.menuElements = [];
    this.notificationSystem = null;
    this.minimap = null;
    this.unitPanel = null;
    this.buildPanel = null;
    this.techPanel = null;

    this.initializeUI();
  }

  initializeUI() {
    // Create main canvas for 2D UI overlay
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'uiCanvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '100';

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Initialize UI elements
    this.initializeHUD();
    this.initializeMinimap();
    this.initializePanels();
    this.initializeNotificationSystem();
  }

  initializeHUD() {
    // Resource display
    this.resourceDisplay = {
      x: 20,
      y: 20,
      width: 300,
      height: 60,
      resources: ['wood', 'gold', 'magic', 'food']
    };

    // Player info
    this.playerInfo = {
      x: 340,
      y: 20,
      width: 200,
      height: 60,
      show: true
    };

    // Time display
    this.timeDisplay = {
      x: window.innerWidth - 200,
      y: 20,
      width: 180,
      height: 60
    };

    // Game status
    this.gameStatus = {
      x: window.innerWidth / 2 - 100,
      y: 20,
      width: 200,
      height: 40
    };
  }

  initializeMinimap() {
    this.minimap = {
      x: window.innerWidth - 220,
      y: window.innerHeight - 220,
      width: 200,
      height: 200,
      scale: 0.25,
      revealedAreas: [],
      playerPositions: []
    };
  }

  initializePanels() {
    // Unit panel
    this.unitPanel = {
      x: 20,
      y: 120,
      width: 260,
      height: 400,
      visible: false,
      selectedTab: 'units',
      units: {
        human: ['knight', 'archer', 'wizard'],
        nightElf: ['ranger', 'druid', 'phoenix'],
        orc: ['grunt', 'shaman', 'warlock']
      },
      cost: {
        human: { knight: 100, archer: 80, wizard: 150 },
        nightElf: { ranger: 90, druid: 120, phoenix: 200 },
        orc: { grunt: 80, shaman: 100, warlock: 180 }
      }
    };

    // Build panel
    this.buildPanel = {
      x: 300,
      y: 120,
      width: 260,
      height: 400,
      visible: false,
      buildings: {
        human: {
          barracks: { cost: 200, time: 10, icon: '🏰' },
          archeryRange: { cost: 300, time: 15, icon: '🏹' },
          wizardTower: { cost: 400, time: 20, icon: '🧙' }
        },
        nightElf: {
          forestLodge: { cost: 180, time: 10, icon: '🌲' },
          druidCircle: { cost: 250, time: 15, icon: '🔮' },
          towerOfElvens: { cost: 350, time: 20, icon: '🏰' }
        },
        orc: {
          barracks: { cost: 180, time: 10, icon: '🏰' },
          shamanHut: { cost: 250, time: 15, icon: '⛥' },
          warlockTower: { cost: 350, time: 20, icon: '🧙' }
        }
      }
    };

    // Tech panel
    this.techPanel = {
      x: 580,
      y: 120,
      width: 260,
      height: 400,
      visible: false,
      technologies: {
        human: [],
        nightElf: [],
        orc: []
      }
    };
  }

  initializeNotificationSystem() {
    this.notificationSystem = {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight - 100,
      width: 400,
      height: 60,
      notifications: [],
      maxNotifications: 5
    };
  }

  update() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw UI elements
    this.updateResourceDisplay();
    this.updatePlayerInfo();
    this.updateTimeDisplay();
    this.updateGameStatus();
    this.updateMinimap();
    this.updatePanels();
    this.updateNotifications();
  }

  updateResourceDisplay() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState) return;

    const resources = gameState.gameWorld.economy;
    const resourceColors = {
      wood: '#8B4513',
      gold: '#FFD700',
      magic: '#9B30FF',
      food: '#FF6347'
    };

    // Draw resource bar background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      this.resourceDisplay.x,
      this.resourceDisplay.y,
      this.resourceDisplay.width,
      this.resourceDisplay.height
    );

    // Draw each resource
    let currentX = this.resourceDisplay.x + 10;
    for (const resource of this.resourceDisplay.resources) {
      if (resources[resource] !== undefined) {
        // Draw resource icon/text
        this.ctx.fillStyle = resourceColors[resource];
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(
          `${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${resources[resource]}`,
          currentX,
          this.resourceDisplay.y + 30
        );

        // Draw resource bar
        const maxResource = resource === 'food' ? 100 : 500;
        const barWidth = 80;
        const barHeight = 8;
        const ratio = Math.min(resources[resource] / maxResource, 1.0);

        // Draw bar background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(currentX, this.resourceDisplay.y + 45, barWidth, barHeight);

        // Draw filled portion
        this.ctx.fillStyle = resourceColors[resource];
        this.ctx.fillRect(currentX, this.resourceDisplay.y + 45, barWidth * ratio, barHeight);

        currentX += 100;
      }
    }
  }

  updatePlayerInfo() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState || !gameState.currentPlayer) return;

    const player = gameState.currentPlayer;

    // Draw player info background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      this.playerInfo.x,
      this.playerInfo.y,
      this.playerInfo.width,
      this.playerInfo.height
    );

    // Draw player name and race
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText(
      player.name || 'Player',
      this.playerInfo.x + 10,
      this.playerInfo.y + 25
    );

    this.ctx.font = '16px Arial';
    this.ctx.fillText(
      player.race || 'Human',
      this.playerInfo.x + 10,
      this.playerInfo.y + 45
    );

    // Draw civilization health
    const health = player.civilization ? player.civilization.health : 100;
    const healthBarWidth = 120;
    const healthBarHeight = 15;

    // Draw health bar background
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    this.ctx.fillRect(
      this.playerInfo.x + 150,
      this.playerInfo.y + 20,
      healthBarWidth,
      healthBarHeight
    );

    // Draw health
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(
      this.playerInfo.x + 150,
      this.playerInfo.y + 20,
      healthBarWidth * (health / 100),
      healthBarHeight
    );
  }

  updateTimeDisplay() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState) return;

    const timeInfo = gameState.gameWorld.time;

    // Draw time display background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      this.timeDisplay.x,
      this.timeDisplay.y,
      this.timeDisplay.width,
      this.timeDisplay.height
    );

    // Draw time information
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 16px Arial';

    const dayNightText = timeInfo.timeOfDay.charAt(0).toUpperCase() + timeInfo.timeOfDay.slice(1);
    this.ctx.fillText(
      dayNightText,
      this.timeDisplay.x + 10,
      this.timeDisplay.y + 25
    );

    this.ctx.font = '14px Arial';
    this.ctx.fillText(
      `${Math.floor(timeInfo.dayNightCycle)}% Complete`,
      this.timeDisplay.x + 10,
      this.timeDisplay.y + 45
    );

    // Draw weather icon
    const weatherIcon = this.getWeatherIcon(timeInfo.weather);
    this.ctx.font = '24px Arial';
    this.ctx.fillText(
      weatherIcon,
      this.timeDisplay.x + this.timeDisplay.width - 40,
      this.timeDisplay.y + 35
    );
  }

  getWeatherIcon(weather) {
    const icons = {
      'clear': '☀️',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'snowy': '❄️',
      'stormy': '⛈️'
    };
    return icons[weather] || '☀️';
  }

  updateGameStatus() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState) return;

    // Draw game status background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      this.gameStatus.x,
      this.gameStatus.y,
      this.gameStatus.width,
      this.gameStatus.height
    );

    // Draw game mode text
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 16px Arial';

    let statusText = '';
    switch (gameState.gameMode) {
      case 'MENU':
        statusText = 'MAIN MENU';
        break;
      case 'PLAYING':
        statusText = 'PLAYING';
        break;
      case 'PAUSED':
        statusText = 'PAUSED';
        break;
      case 'GAME_OVER':
        statusText = 'GAME OVER';
        break;
    }

    this.ctx.fillText(
      statusText,
      this.gameStatus.x + this.gameStatus.width / 2 - 50,
      this.gameStatus.y + 25
    );
  }

  updateMinimap() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState) return;

    // Draw minimap background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      this.minimap.x,
      this.minimap.y,
      this.minimap.width,
      this.minimap.height
    );

    // Draw grid pattern
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.minimap.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.minimap.x + x, this.minimap.y);
      this.ctx.lineTo(this.minimap.x + x, this.minimap.y + this.minimap.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.minimap.height; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.minimap.x, this.minimap.y + y);
      this.ctx.lineTo(this.minimap.x + this.minimap.width, this.minimap.y + y);
      this.ctx.stroke();
    }

    // Draw revealed areas
    this.ctx.fillStyle = 'rgba(100, 100, 255, 0.2)';
    for (const area of this.minimap.revealedAreas) {
      this.ctx.fillRect(
        this.minimap.x + area.x * this.minimap.scale,
        this.minimap.y + area.y * this.minimap.scale,
        area.width * this.minimap.scale,
        area.height * this.minimap.scale
      );
    }

    // Draw player positions
    for (const player of gameState.players) {
      if (player.startLocation) {
        this.ctx.fillStyle = player.color || '#FF0000';
        const posX = this.minimap.x + player.startLocation.x * this.minimap.scale;
        const posY = this.minimap.y + player.startLocation.y * this.minimap.scale;

        this.ctx.beginPath();
        this.ctx.arc(posX, posY, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw player name
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(
          player.name || 'Player',
          posX + 8,
          posY - 8
        );
      }
    }

    // Draw current selection indicator
    if (gameState.currentPlayer && gameState.currentPlayer.startLocation) {
      this.ctx.strokeStyle = '#FFFF00';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      const posX = this.minimap.x + gameState.currentPlayer.startLocation.x * this.minimap.scale;
      const posY = this.minimap.y + gameState.currentPlayer.startLocation.y * this.minimap.scale;

      this.ctx.beginPath();
      this.ctx.arc(posX, posY, 10, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  updatePanels() {
    if (this.unitPanel.visible) {
      this.drawUnitPanel();
    }
    if (this.buildPanel.visible) {
      this.drawBuildPanel();
    }
    if (this.techPanel.visible) {
      this.drawTechPanel();
    }
  }

  drawUnitPanel() {
    // Draw panel background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(
      this.unitPanel.x,
      this.unitPanel.y,
      this.unitPanel.width,
      this.unitPanel.height
    );

    // Draw panel border
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.unitPanel.x,
      this.unitPanel.y,
      this.unitPanel.width,
      this.unitPanel.height
    );

    // Draw tab headers
    const tabY = this.unitPanel.y + 30;
    const tabWidth = 80;
    const tabHeight = 25;

    // Unit tab
    this.ctx.fillStyle = this.unitPanel.selectedTab === 'units' ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(this.unitPanel.x, tabY, tabWidth, tabHeight);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText('Units', this.unitPanel.x + 25, tabY + 18);

    // Build tab
    this.ctx.fillStyle = this.unitPanel.selectedTab === 'build' ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(this.unitPanel.x + tabWidth, tabY, tabWidth, tabHeight);
    this.ctx.fillText('Build', this.unitPanel.x + tabWidth + 25, tabY + 18);

    // Tech tab
    this.ctx.fillStyle = this.unitPanel.selectedTab === 'tech' ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(this.unitPanel.x + tabWidth * 2, tabY, tabWidth, tabHeight);
    this.ctx.fillText('Tech', this.unitPanel.x + tabWidth * 2 + 25, tabY + 18);

    // Draw units
    this.drawUnitsList();
  }

  drawBuildPanel() {
    // Similar implementation for build panel
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(
      this.buildPanel.x,
      this.buildPanel.y,
      this.buildPanel.width,
      this.buildPanel.height
    );

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.buildPanel.x,
      this.buildPanel.y,
      this.buildPanel.width,
      this.buildPanel.height
    );

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Build Menu', this.buildPanel.x + 10, this.buildPanel.y + 25);

    // TODO: Draw buildings list
  }

  drawTechPanel() {
    // Similar implementation for tech panel
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(
      this.techPanel.x,
      this.techPanel.y,
      this.techPanel.width,
      this.techPanel.height
    );

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.techPanel.x,
      this.techPanel.y,
      this.techPanel.width,
      this.techPanel.height
    );

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Technology', this.techPanel.x + 10, this.techPanel.y + 25);

    // TODO: Draw technologies list
  }

  drawUnitsList() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState || !gameState.currentPlayer) return;

    const player = gameState.currentPlayer;
    const race = player.race || 'human';
    const units = this.unitPanel.units[race] || [];

    // Draw units
    let currentY = this.unitPanel.y + 60;
    for (const unitName of units) {
      // Draw unit row
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(
        this.unitPanel.x + 10,
        currentY,
        this.unitPanel.width - 20,
        40
      );

      // Draw unit icon (placeholder)
      this.ctx.fillStyle = '#CCCCCC';
      this.ctx.fillRect(this.unitPanel.x + 15, currentY + 5, 30, 30);

      // Draw unit name
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillText(
        unitName.charAt(0).toUpperCase() + unitName.slice(1),
        this.unitPanel.x + 55,
        currentY + 20
      );

      // Draw unit cost
      const cost = this.unitPanel.cost[race] ? this.unitPanel.cost[race][unitName] : 0;
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(
        `Cost: ${cost} Gold`,
        this.unitPanel.x + 55,
        currentY + 40
      );

      currentY += 50;
    }
  }

  updateNotifications() {
    const gameState = window.game ? window.game.gameState : null;
    if (!gameState) return;

    // Draw notification background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(
      this.notificationSystem.x,
      this.notificationSystem.y,
      this.notificationSystem.width,
      this.notificationSystem.height
    );

    // Draw notifications
    let currentY = this.notificationSystem.y + 20;
    for (const notification of this.notificationSystem.notifications) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(
        notification.text,
        this.notificationSystem.x + 10,
        currentY
      );

      currentY += 20;
    }
  }

  // UI interaction methods
  handleMouseClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * this.canvas.width / rect.width;
    const y = (event.clientY - rect.top) * this.canvas.height / rect.height;

    // Check if click was on a panel
    if (this.unitPanel.visible && this.isPointInRect(x, y, this.unitPanel)) {
      this.handleUnitPanelClick(x, y);
    } else if (this.buildPanel.visible && this.isPointInRect(x, y, this.buildPanel)) {
      this.handleBuildPanelClick(x, y);
    } else if (this.techPanel.visible && this.isPointInRect(x, y, this.techPanel)) {
      this.handleTechPanelClick(x, y);
    } else if (this.isPointInRect(x, y, this.resourceDisplay)) {
      // Clicked on resources - select resource panel
      this.showResourcePanel();
    } else if (this.isPointInRect(x, y, this.playerInfo)) {
      // Clicked on player info - show player panel
      this.showPlayerPanel();
    }
  }

  isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  }

  handleUnitPanelClick(x, y) {
    const relativeX = x - this.unitPanel.x;
    const relativeY = y - this.unitPanel.y;

    // Check if clicked on a unit row
    const unitRows = Math.floor((relativeY - 60) / 50);
    if (unitRows >= 0 && unitRows < 3) { // Assuming 3 units max
      const race = window.game ? window.game.gameState.currentPlayer.race : 'human';
      const unitNames = this.unitPanel.units[race] || [];
      if (unitNames[unitRows]) {
        this.trainUnit(unitNames[unitRows]);
      }
    }
  }

  handleBuildPanelClick(x, y) {
    // TODO: Implement build panel click handling
  }

  handleTechPanelClick(x, y) {
    // TODO: Implement tech panel click handling
  }

  trainUnit(unitName) {
    if (window.game) {
      const gameState = window.game.gameState;
      const player = gameState.currentPlayer;

      if (player && player.resources.gold >= this.unitPanel.cost[player.race][unitName]) {
        player.resources.gold -= this.unitPanel.cost[player.race][unitName];
        player.civilization.units.push(unitName);

        // Play unit creation sound
        if (window.game.gameSystems.audio) {
          window.game.gameSystems.audio.playSound('unitCreated');
        }

        // Update UI
        window.game.gameSystems.ui.updateResourceDisplay();
      }
    }
  }

  showUnitPanel() {
    this.unitPanel.visible = true;
    this.buildPanel.visible = false;
    this.techPanel.visible = false;
  }

  showBuildPanel() {
    this.unitPanel.visible = false;
    this.buildPanel.visible = true;
    this.techPanel.visible = false;
  }

  showTechPanel() {
    this.unitPanel.visible = false;
    this.buildPanel.visible = false;
    this.techPanel.visible = true;
  }

  addNotification(text, type = 'info') {
    const notification = {
      text,
      type,
      timestamp: Date.now()
    };

    this.notificationSystem.notifications.push(notification);

    if (this.notificationSystem.notifications.length > this.notificationSystem.maxNotifications) {
      this.notificationSystem.notifications.shift();
    }
  }

  showPauseMenu() {
    // TODO: Implement pause menu
  }

  hidePauseMenu() {
    // TODO: Implement hide pause menu
  }

  selectStructure(structure) {
    // TODO: Implement structure selection
  }

  selectUnit(unit) {
    // TODO: Implement unit selection
  }

  deselectAll() {
    // TODO: Implement deselect all
  }

  updateResourceDisplay() {
    // Update resource display with current game state
  }

  updateStatisticsDisplay() {
    // TODO: Implement statistics display
  }

  handleResize() {
    // Resize canvas
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Update minimap position
    this.minimap.x = window.innerWidth - 220;
    this.minimap.y = window.innerHeight - 220;

    // Update notification system position
    this.notificationSystem.x = window.innerWidth / 2 - 200;
    this.notificationSystem.y = window.innerHeight - 100;
  }

  dispose() {
    // Clean up UI elements
    if (this.canvas && document.body.contains(this.canvas)) {
      document.body.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
    this.hudElements = [];
    this.menuElements = [];
    this.notificationSystem = null;
    this.minimap = null;
    this.unitPanel = null;
    this.buildPanel = null;
    this.techPanel = null;
  }
}

module.exports = UISystem;