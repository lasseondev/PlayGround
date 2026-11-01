"use strict";

class MapManager {
  constructor(size, tileSize) {
    this.mapSize = size;
    this.tileSize = tileSize;
    this.terrain = [];
    this.buildings = [];
    this.units = [];
    this.resources = {};
    this.tileTypes = {
      grass: { walkable: true, renderable: true, color: '#2ECC71' },
      water: { walkable: false, renderable: true, color: '#3498DB' },
      mountain: { walkable: false, renderable: true, color: '#95A5A6' },
      forest: { walkable: true, renderable: true, color: '#27AE60' },
      building: { walkable: false, renderable: true, color: '#E67E22' },
      road: { walkable: true, renderable: true, color: '#ECF0F1' }
    };

    this.initializeMap();
  }

  initializeMap() {
    // Initialize empty terrain map
    this.terrain = Array(this.mapSize.height).fill().map(() =>
      Array(this.mapSize.width).fill(this.tileTypes.grass)
    );

    // Generate procedural terrain
    this.generateTerrain();
  }

  generateTerrain() {
    // Generate random terrain features
    const numWater = Math.floor(this.mapSize.width * this.mapSize.height * 0.2);
    const numMountains = Math.floor(this.mapSize.width * this.mapSize.height * 0.1);
    const numForests = Math.floor(this.mapSize.width * this.mapSize.height * 0.15);

    this.placeTerrainFeatures('water', numWater, 0.3);
    this.placeTerrainFeatures('mountain', numMountains, 0.4);
    this.placeTerrainFeatures('forest', numForests, 0.5);

    // Create roads between starting areas
    this.createStartingRoads();
  }

  placeTerrainFeatures(type, count, probability) {
    const tiles = this.mapSize.width * this.mapSize.height;
    const shuffled = Array(tiles).fill().map((_, i) => i);

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      if (Math.random() < probability) {
        const index = shuffled[i];
        const x = index % this.mapSize.width;
        const y = Math.floor(index / this.mapSize.width);

        if (this.mapSize && this.terrain && y >= 0 && y < this.terrain.length && x >= 0 && x < this.terrain[y].length) {
          this.terrain[y][x] = this.tileTypes[type];
        }
      }
    }
  }

  createStartingRoads() {
    // Create starting areas and connecting roads
    const startX1 = Math.floor(this.mapSize.width * 0.2);
    const startY1 = Math.floor(this.mapSize.height * 0.7);
    const startX2 = Math.floor(this.mapSize.width * 0.8);
    const startY2 = Math.floor(this.mapSize.height * 0.3);

    // Create starting areas
    this.createStartingArea(startX1, startY1, '#2ECC71', 8);
    this.createStartingArea(startX2, startY2, '#E74C3C', 8);

    // Create connecting road
    this.createRoad(startX1 + 4, startY1, startX2 - 4, startY2, 'road');
  }

  createStartingArea(centerX, centerY, color, size) {
    for (let dx = -size; dx <= size; dx++) {
      for (let dy = -size; dy <= size; dy++) {
        const x = centerX + dx;
        const y = centerY + dy;

        if (this.isInBounds(x, y)) {
          if (Math.random() > 0.3) {
            this.terrain[y][x] = this.tileTypes.grass;
          }
        }
      }
    }
  }

  createRoad(startX, startY, endX, endY, type) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance);

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = Math.round(startX + dx * t);
      const y = Math.round(startY + dy * t);

      if (this.isInBounds(x, y)) {
        this.terrain[y][x] = this.tileTypes[type];
      }
    }
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.mapSize.width && y >= 0 && y < this.mapSize.height;
  }

  isWalkable(x, y) {
    if (!this.isInBounds(x, y)) return false;
    return this.terrain[y][x].walkable;
  }

  setTerrain(x, y, type) {
    if (this.isInBounds(x, y)) {
      this.terrain[y][x] = this.tileTypes[type] || this.tileTypes.grass;
    }
  }

  getTerrain(x, y) {
    if (this.isInBounds(x, y)) {
      return this.terrain[y][x];
    }
    return this.tileTypes.grass;
  }

  render(ctx) {
    // Render terrain
    for (let y = 0; y < this.mapSize.height; y++) {
      for (let x = 0; x < this.mapSize.width; x++) {
        const tile = this.terrain[y][x];
        if (tile.renderable) {
          ctx.fillStyle = tile.color;
          ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

          // Add terrain-specific details
          if (tile.type === 'water') {
            ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.beginPath();
            ctx.arc(
              (x + 0.5) * this.tileSize,
              (y + 0.5) * this.tileSize,
              this.tileSize * 0.4,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }
    }

    // Render overlay objects (buildings, units, etc.)
    this.renderObjects(ctx);
  }

  renderObjects(ctx) {
    // Render buildings
    this.buildings.forEach(building => {
      const x = building.location.x;
      const y = building.location.y;
      ctx.save();

      // Building shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x * this.tileSize + 4, y * this.tileSize + 4, this.tileSize, this.tileSize);

      // Building body
      ctx.fillStyle = building.color || '#E67E22';
      ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

      // Building border
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

      ctx.restore();
    });

    // Render units
    this.units.forEach(unit => {
      const x = unit.location.x;
      const y = unit.location.y;
      ctx.save();

      // Unit shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x * this.tileSize + 4, y * this.tileSize + 4, this.tileSize, this.tileSize);

      // Unit body
      ctx.fillStyle = unit.color || '#3498DB';
      ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

      // Unit border
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

      ctx.restore();
    });
  }

  addBuilding(building) {
    this.buildings.push(building);
  }

  removeBuilding(building) {
    const index = this.buildings.indexOf(building);
    if (index > -1) {
      this.buildings.splice(index, 1);
    }
  }

  addUnit(unit) {
    this.units.push(unit);
  }

  removeUnit(unit) {
    const index = this.units.indexOf(unit);
    if (index > -1) {
      this.units.splice(index, 1);
    }
  }

  update(deltaTime) {
    // Update map logic
    // Regenerate resources based on terrain
    // Update fog of war if implemented
  }

  initializeTerrain(players) {
    // Initialize resources on map based on player positions
    players.forEach(player => {
      const radius = 5;
      const centerX = player.startLocation.x;
      const centerY = player.startLocation.y;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const x = centerX + dx;
          const y = centerY + dy;

          if (this.isInBounds(x, y)) {
            if (Math.random() > 0.7) {
              this.setTerrain(x, y, 'mine');
            }
          }
        }
      }
    });
  }

  destroy() {
    this.terrain = [];
    this.buildings = [];
    this.units = [];
    this.resources = {};
  }
}

export default MapManager;