import { ITEMS, RECIPES } from './content.js';
import { itemIcon } from './textures.js';

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[character]));

export class GameUI {
  constructor() {
    this.app = document.getElementById('app');
    this.clock = document.getElementById('clock');
    this.fps = document.getElementById('fps');
    this.coords = document.getElementById('coords');
    this.target = document.getElementById('target-name');
    this.health = document.getElementById('health-bar');
    this.hunger = document.getElementById('hunger-bar');
    this.hotbar = document.getElementById('hotbar');
    this.toast = document.getElementById('toast');
    this.inventory = document.getElementById('inventory');
    this.inventoryGrid = document.getElementById('inventory-grid');
    this.inventoryCount = document.getElementById('inventory-count');
    this.recipeList = document.getElementById('recipe-list');
    this.detailIcon = document.querySelector('.detail-icon');
    this.detailName = document.getElementById('detail-name');
    this.detailText = document.getElementById('detail-text');
    this.startScreen = document.getElementById('start-screen');
    this.seedInput = document.getElementById('seed-input');
    this.saveHint = document.getElementById('save-hint');
    this.death = document.getElementById('death-screen');
    this.loading = document.getElementById('loading');
    this.pauseHint = document.getElementById('pause-hint');
    this.hotbarSlots = [];
    this.toastTimer = 0;
    this.buildVitals();
    this.buildHotbar();
  }

  buildVitals() {
    this.health.innerHTML = Array.from({ length: 10 }, () => '<span></span>').join('');
    this.hunger.innerHTML = Array.from({ length: 10 }, () => '<span></span>').join('');
  }

  buildHotbar() {
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('button');
      slot.className = 'slot';
      slot.type = 'button';
      slot.dataset.index = String(i);
      slot.setAttribute('aria-label', `Hotbar slot ${i + 1}`);
      slot.innerHTML = `<span class="key-num">${i + 1}</span><img alt="" draggable="false" /><span class="count"></span><span class="durability hidden"><i></i></span>`;
      slot.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.onSelect) this.onSelect(i);
      });
      this.hotbar.appendChild(slot);
      this.hotbarSlots.push(slot);
    }
  }

  bind({ onSelect, onStart, onReset, onRespawn, onCloseInventory, onCraft }) {
    this.onSelect = onSelect;
    this.onStart = onStart;
    this.onReset = onReset;
    this.onRespawn = onRespawn;
    this.onCloseInventory = onCloseInventory;
    this.onCraft = onCraft;
    document.getElementById('start-button').addEventListener('click', (event) => {
      event.stopPropagation();
      onStart();
    });
    document.getElementById('reset-button').addEventListener('click', (event) => {
      event.stopPropagation();
      if (window.confirm('Generate a brand new island? Your current save will be replaced.')) onReset();
    });
    document.getElementById('inventory-close').addEventListener('click', () => onCloseInventory());
    document.getElementById('respawn-button').addEventListener('click', () => onRespawn());
  }

  setSeed(value) {
    this.seedInput.value = String(value);
  }

  getSeed() {
    const parsed = Number.parseInt(this.seedInput.value.trim(), 10);
    return Number.isFinite(parsed) ? parsed : 1337;
  }

  setSaveHint(hasSave) {
    this.saveHint.textContent = hasSave
      ? 'Saved island found. Start Game continues where you left off.'
      : 'A fresh island awaits.';
  }

  enterGame() {
    this.app.classList.add('playing');
    this.startScreen.classList.add('leaving');
    this.pauseHint.classList.remove('hidden');
    this.app.classList.add('paused');
  }

  setPaused(paused) {
    this.app.classList.toggle('paused', paused);
    this.pauseHint.classList.toggle('hidden', !paused);
  }

  setLoading(visible) {
    this.loading.classList.toggle('hidden', !visible);
  }

  renderHotbar(inventory, selected) {
    this.hotbarSlots.forEach((slot, index) => {
      const item = inventory[index];
      const image = slot.querySelector('img');
      const count = slot.querySelector('.count');
      const durability = slot.querySelector('.durability');
      const bar = durability.querySelector('i');
      slot.classList.toggle('selected', index === selected);
      if (!item) {
        image.removeAttribute('src');
        image.style.display = 'none';
        count.textContent = '';
        durability.classList.add('hidden');
        slot.title = '';
        return;
      }
      image.style.display = 'block';
      image.src = itemIcon(item.id, 56);
      const definition = ITEMS[item.id];
      slot.title = definition ? definition.name : item.id;
      count.textContent = item.count > 1 ? String(item.count) : '';
      if (item.durability !== undefined && definition && definition.durability) {
        durability.classList.remove('hidden');
        bar.style.width = `${Math.max(0, Math.min(100, (item.durability / definition.durability) * 100))}%`;
        bar.style.background = item.durability / definition.durability < 0.25 ? '#e3604d' : '#a8e063';
      } else {
        durability.classList.add('hidden');
      }
    });
  }

  updateVitals(health, hunger) {
    const healthSegments = this.health.children;
    const hungerSegments = this.hunger.children;
    for (let i = 0; i < 10; i++) {
      healthSegments[i].classList.toggle('full', health > i * 2);
      hungerSegments[i].classList.toggle('full', hunger > i * 2);
    }
  }

  updateStatus(timeText, fps, coords) {
    this.clock.textContent = timeText;
    this.fps.textContent = String(Math.round(fps));
    this.coords.textContent = coords;
  }

  setTarget(name) {
    if (name) {
      this.target.textContent = name.toUpperCase();
      this.target.classList.add('visible');
    } else {
      this.target.classList.remove('visible');
    }
  }

  showToast(message, duration = 2100) {
    this.toast.textContent = message;
    this.toast.classList.add('visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('visible'), duration);
  }

  toggleInventory(force) {
    const shouldOpen = force === undefined ? this.inventory.classList.contains('hidden') : force;
    this.inventory.classList.toggle('hidden', !shouldOpen);
    return shouldOpen;
  }

  isInventoryOpen() {
    return !this.inventory.classList.contains('hidden');
  }

  renderInventory(inventory, selected) {
    this.inventoryGrid.innerHTML = '';
    let used = 0;
    for (let index = 0; index < 36; index++) {
      const item = inventory[index];
      if (item) used++;
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'inv-slot';
      if (index < 9) {
        slot.classList.add('hotkey');
        slot.dataset.key = String(index + 1);
      }
      if (index === selected && index < 9) slot.style.boxShadow = 'inset 0 0 0 2px #a8e063';
      if (item) {
        const definition = ITEMS[item.id];
        slot.title = definition ? definition.name : item.id;
        slot.innerHTML = `<img alt="" draggable="false" src="${itemIcon(item.id, 44)}" />`
          + (item.count > 1 ? `<span class="count">${item.count}</span>` : '')
          + (item.durability !== undefined && definition && definition.durability
            ? `<span class="durability"><i style="width:${Math.max(0, Math.min(100, (item.durability / definition.durability) * 100))}%"></i></span>`
            : '');
        slot.addEventListener('click', () => this.showItemDetail(item.id));
        slot.addEventListener('dblclick', () => {
          if (index < 9 && this.onSelect) this.onSelect(index);
        });
      } else {
        slot.disabled = true;
      }
      this.inventoryGrid.appendChild(slot);
    }
    this.inventoryCount.textContent = `${used} / 36 slots`;
    this.renderRecipes(inventory);
  }

  showItemDetail(id) {
    const item = ITEMS[id];
    if (!item) return;
    this.detailIcon.style.backgroundImage = `url(${itemIcon(id, 40)})`;
    this.detailName.textContent = item.name;
    if (item.kind === 'tool') {
      this.detailText.textContent = `${item.tool} · tier ${item.tier} · ${item.durability} uses`;
    } else if (item.kind === 'food') {
      this.detailText.textContent = `Food · restores ${item.hunger} hunger`;
    } else if (item.kind === 'block') {
      this.detailText.textContent = 'Placeable block · right-click to build';
    } else {
      this.detailText.textContent = 'Crafting material · combine it at the crafting panel';
    }
  }

  renderRecipes(inventory) {
    const counts = new Map();
    for (const item of inventory) {
      if (!item) continue;
      counts.set(item.id, (counts.get(item.id) || 0) + item.count);
    }
    this.recipeList.innerHTML = '';
    for (const recipe of RECIPES) {
      const canCraft = recipe.ingredients.every((ingredient) => (counts.get(ingredient.id) || 0) >= ingredient.count);
      const card = document.createElement('div');
      card.className = `recipe-card${canCraft ? ' can-craft' : ''}`;
      const ingredients = recipe.ingredients.map((ingredient) => {
        const enough = (counts.get(ingredient.id) || 0) >= ingredient.count;
        const item = ITEMS[ingredient.id];
        return `<span class="ingredient${enough ? '' : ' missing'}" title="${escapeHtml(item ? item.name : ingredient.id)}">`
          + `<img alt="" src="${itemIcon(ingredient.id, 18)}" />${ingredient.count}</span>`;
      }).join('');
      card.innerHTML = `
        <div class="recipe-out"><img alt="" src="${itemIcon(recipe.out.id, 38)}" /></div>
        <div class="recipe-info">
          <strong>${escapeHtml(recipe.name)}${recipe.out.count > 1 ? ` x${recipe.out.count}` : ''}</strong>
          <div class="recipe-ingredients">${ingredients}</div>
        </div>
        <button type="button" class="craft-button" ${canCraft ? '' : 'disabled'}>CRAFT</button>
      `;
      card.querySelector('.craft-button').addEventListener('click', () => {
        if (this.onCraft) this.onCraft(recipe.id);
      });
      this.recipeList.appendChild(card);
    }
  }

  showDeath() {
    this.death.classList.remove('hidden');
  }

  hideDeath() {
    this.death.classList.add('hidden');
  }
}
