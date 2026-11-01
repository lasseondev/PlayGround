"use strict";

class ResourceManager {
  constructor() {
    this.resources = {};
    this.resourceRates = {};
    this.resourceSources = {};
    this.events = {};

    this.initializeResources();
  }

  initializeResources() {
    // Initialize resources with default values
    this.resources = {
      gold: { amount: 0, rate: 0, sources: [], max: 10000 },
      wood: { amount: 0, rate: 0, sources: [], max: 10000 },
      stone: { amount: 0, rate: 0, sources: [], max: 10000 },
      food: { amount: 0, rate: 0, sources: [], max: 1000 }
    };

    this.resourceRates = {
      gold: 0,
      wood: 0,
      stone: 0,
      food: 0
    };

    this.resourceSources = {
      gold: [],
      wood: [],
      stone: [],
      food: []
    };
  }

  addResourceSource(type, source) {
    if (!this.resourceSources[type]) {
      this.resourceSources[type] = [];
    }

    this.resourceSources[type].push(source);

    // Calculate total rate for this resource type
    this.updateResourceRate(type);
  }

  removeResourceSource(type, source) {
    if (this.resourceSources[type]) {
      const index = this.resourceSources[type].indexOf(source);
      if (index > -1) {
        this.resourceSources[type].splice(index, 1);
      }
      this.updateResourceRate(type);
    }
  }

  updateResourceRate(type) {
    const sources = this.resourceSources[type] || [];
    const totalRate = sources.reduce((sum, source) => sum + (source.getProductionRate ? source.getProductionRate() : 0), 0);
    this.resourceRates[type] = totalRate;
    this.resources[type].rate = totalRate;
  }

  update(deltaTime) {
    // Update all resource amounts based on production rates
    Object.keys(this.resources).forEach(resourceType => {
      const resource = this.resources[resourceType];
      const rate = this.resourceRates[resourceType];

      if (rate > 0) {
        const oldAmount = resource.amount;
        resource.amount += rate * deltaTime;

        // Cap at max amount
        if (resource.max && resource.amount > resource.max) {
          resource.amount = resource.max;
        }

        // Check if amount changed significantly
        if (Math.abs(resource.amount - oldAmount) > 0.1) {
          this.emit('resourceChanged', { type: resourceType, amount: resource.amount });
        }
      }
    });
  }

  getAmount(type) {
    return this.resources[type] ? this.resources[type].amount : 0;
  }

  getRate(type) {
    return this.resourceRates[type] || 0;
  }

  spend(type, amount) {
    if (this.resources[type] && this.resources[type].amount >= amount) {
      this.resources[type].amount -= amount;
      this.emit('resourceSpent', { type, amount });
      return true;
    }
    return false;
  }

  add(type, amount) {
    if (this.resources[type]) {
      this.resources[type].amount += amount;
      if (this.resources[type].max && this.resources[type].amount > this.resources[type].max) {
        this.resources[type].amount = this.resources[type].max;
      }
      this.emit('resourceAdded', { type, amount: this.resources[type].amount });
    }
  }

  canAfford(cost) {
    return Object.entries(cost).every(([type, amount]) =>
      this.resources[type] && this.resources[type].amount >= amount
    );
  }

  spendMultiple(cost) {
    return Object.entries(cost).every(([type, amount]) =>
      this.spend(type, amount)
    );
  }

  // Event handling
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      const index = this.events[event].indexOf(callback);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in resource handler for '${event}':`, error);
        }
      });
    }
  }

  getAllResources() {
    const result = {};
    Object.keys(this.resources).forEach(type => {
      result[type] = {
        amount: this.resources[type].amount,
        rate: this.resourceRates[type],
        max: this.resources[type].max
      };
    });
    return result;
  }

  destroy() {
    this.resources = {};
    this.resourceRates = {};
    this.resourceSources = {};
    this.events = {};
  }
}

export default ResourceManager;