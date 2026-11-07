class GameState {
  constructor() {
    // Game mode
    this.gameMode = 'MENU'; // MENU, PLAYING, PAUSED, GAME_OVER
    this.multiplayerMode = 'OFFLINE'; // OFFLINE, LAN, ONLINE

    // Player data
    this.players = [];
    this.currentPlayer = null;
    this.selectedPlayer = 0; // Index of currently selected player

    // Game world
    this.gameWorld = {
      map: {
        width: 1000,
        height: 1000,
        terrain: [],
        resources: [],
        structures: [],
        units: []
      },
      time: {
        dayNightCycle: 0,
        weather: 'clear',
        timeOfDay: 'morning'
      },
      economy: {
        wood: 500,
        gold: 500,
        magic: 500,
        food: 100,
        population: 10
      }
    };

    // Game settings
    this.settings = {
      soundVolume: 1.0,
      musicVolume: 1.0,
      cameraMode: 'Strategic', // Strategic, Base, Free
      unitIcons: true,
      resourceIndicators: true,
      pathfinding: true,
      autoSelect: false
    };

    // Tech tree data
    this.techTree = {
      human: [],
      nightElf: [],
      orc: []
    };

    // Save game data
    this.saveData = {
      lastSave: null,
      autoSaveInterval: 300000, // 5 minutes
      checkpoints: []
    };

    // Game statistics
    this.statistics = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      totalPlayTime: 0,
      unitsKilled: { human: 0, nightElf: 0, orc: 0 },
      resourcesCollected: { wood: 0, gold: 0, magic: 0, food: 0 }
    };
  }

  // Player management methods
  addPlayer(name, race, color) {
    const player = {
      id: this.players.length,
      name,
      race,
      color,
      civilization: {
        health: 100,
        foodProduction: 0,
        woodProduction: 0,
        goldProduction: 0,
        magicProduction: 0,
        buildings: [],
        units: [],
        technologies: []
      },
      startLocation: {
        x: Math.random() * 800 + 100,
        y: Math.random() * 800 + 100,
        z: 0
      },
      resources: {
        wood: 500,
        gold: 500,
        magic: 500,
        food: 100
      }
    };

    this.players.push(player);
    if (this.players.length === 1) {
      this.currentPlayer = player;
    }

    return player;
  }

  selectPlayer(index) {
    if (index >= 0 && index < this.players.length) {
      this.selectedPlayer = index;
      this.currentPlayer = this.players[index];
      return this.currentPlayer;
    }
    return null;
  }

  // Economy management methods
  addResources(type, amount) {
    this.gameWorld.economy[type] += amount;
    this.gameState.statistics.resourcesCollected[type] += amount;
    this.gameSystems.ui.updateResourceDisplay();
  }

  consumeResources(types) {
    for (const type of Object.keys(types)) {
      this.gameWorld.economy[type] -= types[type];
    }
    this.gameSystems.ui.updateResourceDisplay();
  }

  // Game state methods
  saveGame() {
    this.gameState.saveData.lastSave = new Date();
    // TODO: Implement save to file
  }

  loadGame() {
    // TODO: Implement load from file
    // TODO: Restore game state
  }

  resetGame() {
    this.players = [];
    this.currentPlayer = null;
    this.selectedPlayer = 0;
    this.gameMode = 'MENU';
    this.statistics = {
      gamesPlayed: this.statistics.gamesPlayed + 1,
      wins: this.statistics.wins + (this.currentPlayer?.civilization.health > 0 ? 1 : 0),
      losses: this.statistics.losses + (this.currentPlayer?.civilization.health <= 0 ? 1 : 0),
      totalPlayTime: 0,
      unitsKilled: { human: 0, nightElf: 0, orc: 0 },
      resourcesCollected: { wood: 0, gold: 0, magic: 0, food: 0 }
    };
    this.gameSystems.ui.updateStatisticsDisplay();
  }
}

module.exports = GameState;