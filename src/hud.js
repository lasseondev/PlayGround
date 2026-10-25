import { formatScore, clamp } from "./utils.js";

export class Hud {
  constructor(game) {
    this.game = game;
    this.el = {
      hud: document.getElementById("hud"),
      health: document.getElementById("health"),
      armor: document.getElementById("armor"),
      ammo: document.getElementById("ammo"),
      ammoType: document.getElementById("ammoType"),
      ammoReserve: document.getElementById("ammoReserve"),
      weaponName: document.getElementById("weaponName"),
      weaponSlot: document.getElementById("weaponSlot"),
      weaponList: document.getElementById("weaponList"),
      score: document.getElementById("score"),
      waveLabel: document.getElementById("waveLabel"),
      enemiesLeft: document.getElementById("enemiesLeft"),
      enemyBar: document.getElementById("enemyBar"),
      killfeed: document.getElementById("killfeed"),
      crosshair: document.getElementById("crosshair"),
      hitmarker: document.getElementById("hitmarker"),
      damageFlash: document.getElementById("damageFlash"),
      pickupFlash: document.getElementById("pickupFlash"),
      waveBanner: document.getElementById("waveBanner"),
      bannerKicker: document.getElementById("bannerKicker"),
      bannerTitle: document.getElementById("bannerTitle"),
      bannerSub: document.getElementById("bannerSub"),
      toast: document.getElementById("toast"),
      vitalHealth: document.getElementById("health")?.closest(".vital"),
      vitalArmor: document.getElementById("armor")?.closest(".vital"),
      menu: document.getElementById("menu"),
      pause: document.getElementById("pause"),
      death: document.getElementById("death"),
      loading: document.getElementById("loading"),
      loadBar: document.getElementById("loadBar"),
      loadText: document.getElementById("loadText"),
      deathWave: document.getElementById("deathWave"),
      deathScore: document.getElementById("deathScore"),
      deathKills: document.getElementById("deathKills"),
      deathQuote: document.getElementById("deathQuote"),
      bestScore: document.getElementById("bestScore"),
    };
    this.slots = [...document.querySelectorAll(".wslot")];
    this.last = {};
    this.toastTimer = null;
    this.bannerTimer = null;
    this.hitTimer = null;
    this.damageTimer = null;
    this.best = 0;
    try {
      this.best = Number(localStorage.getItem("quake-arena-best") || 0);
    } catch {
      this.best = 0;
    }
    this.setBest(this.best);
  }

  setBest(value) {
    this.best = Math.max(this.best, value);
    if (this.el.bestScore) this.el.bestScore.textContent = formatScore(this.best);
  }

  setText(el, value) {
    if (!el) return;
    if (this.last[el.id] !== value) {
      this.last[el.id] = value;
      el.textContent = value;
    }
  }

  update() {
    const g = this.game;
    const p = g.player;
    if (!p) return;

    const health = Math.max(0, Math.ceil(p.health));
    const armor = Math.max(0, Math.ceil(p.armor));
    this.setText(this.el.health, String(health));
    this.setText(this.el.armor, String(armor));
    const def = g.weapons.defs[p.weapon];
    this.setText(this.el.weaponName, def.name);
    this.setText(this.el.weaponSlot, def.slot);
    this.setText(this.el.ammoType, def.ammoLabel);
    this.setText(this.el.ammo, String(p.ammo[def.ammo]));
    this.setText(this.el.ammoReserve, `MAX ${p.ammoMax[def.ammo]}`);
    this.setText(this.el.score, formatScore(g.score));
    this.setText(this.el.waveLabel, `WAVE ${String(g.wave).padStart(2, "0")}`);

    const alive = g.enemies.aliveCount + g.pendingSpawns;
    this.setText(this.el.enemiesLeft, String(alive));
    const total = Math.max(1, g.waveTotal);
    const ratio = clamp(alive / total, 0, 1);
    this.el.enemyBar.style.width = `${ratio * 100}%`;

    this.slots.forEach((slot, i) => {
      slot.classList.toggle("active", i === p.weapon);
    });

    if (this.el.vitalHealth) this.el.vitalHealth.classList.toggle("low", health <= 30);
    if (this.el.vitalArmor) this.el.vitalArmor.classList.toggle("low", armor > 0 && armor <= 25);

    const speed = p.speed || 0;
    const gap = clamp(7 + speed * 0.5 + (p.onGround ? 0 : 5), 6, 22);
    this.el.crosshair.style.setProperty("--gap", `${gap.toFixed(1)}px`);

    document.body.classList.toggle("low-health", health <= 30 && p.alive);
  }

  killFeed(source, victim, headshot) {
    const item = document.createElement("div");
    item.className = "kf";
    item.innerHTML = `<b>${source}</b><i>${headshot ? "HEADSHOT" : "ELIMINATED"}</i><span>${victim}</span>`;
    this.el.killfeed.appendChild(item);
    while (this.el.killfeed.children.length > 5) {
      this.el.killfeed.removeChild(this.el.killfeed.firstChild);
    }
    setTimeout(() => {
      item.classList.add("out");
      setTimeout(() => item.remove(), 420);
    }, 3600);
  }

  waveBanner(kicker, title, sub, duration = 2400) {
    this.el.bannerKicker.textContent = kicker;
    this.el.bannerTitle.textContent = title;
    this.el.bannerSub.textContent = sub;
    this.el.waveBanner.classList.add("show");
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      this.el.waveBanner.classList.remove("show");
    }, duration);
  }

  toast(text, duration = 1700) {
    if (!this.el.toast) return;
    this.el.toast.textContent = text;
    this.el.toast.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.el.toast.classList.remove("show");
    }, duration);
  }

  hitmarker(headshot = false) {
    this.el.hitmarker.classList.add("show");
    this.el.hitmarker.style.filter = headshot ? "drop-shadow(0 0 8px #ffcf4a)" : "";
    clearTimeout(this.hitTimer);
    this.hitTimer = setTimeout(() => this.el.hitmarker.classList.remove("show"), 130);
  }

  damageFlash(intensity = 0.5, source = null) {
    if (!this.el.damageFlash) return;
    this.el.damageFlash.style.opacity = String(clamp(intensity, 0.1, 1));
    clearTimeout(this.damageTimer);
    this.damageTimer = setTimeout(() => {
      this.el.damageFlash.style.opacity = "0";
    }, 140);
  }

  pickupFlash() {
    if (!this.el.pickupFlash) return;
    this.el.pickupFlash.style.opacity = "1";
    clearTimeout(this.pickupTimer);
    this.pickupTimer = setTimeout(() => {
      this.el.pickupFlash.style.opacity = "0";
    }, 220);
  }

  showHud(show) {
    this.el.hud.classList.toggle("hidden", !show);
  }

  showMenu(show) {
    this.el.menu.classList.toggle("hidden", !show);
  }

  showPause(show) {
    this.el.pause.classList.toggle("hidden", !show);
  }

  showDeath(show) {
    this.el.death.classList.toggle("hidden", !show);
  }

  showLoading(show, percent = 100, text = "FORGING THE SLAYGROUND…") {
    if (!this.el.loading) return;
    if (this.el.loadBar) this.el.loadBar.style.width = `${percent}%`;
    if (this.el.loadText) this.el.loadText.textContent = text;
    if (show) {
      this.el.loading.classList.remove("hidden", "done");
    } else {
      this.el.loading.classList.add("done");
      setTimeout(() => this.el.loading.classList.add("hidden"), 800);
    }
  }

  showDeathStats(wave, score, kills) {
    this.el.deathWave.textContent = String(wave);
    this.el.deathScore.textContent = formatScore(score);
    this.el.deathKills.textContent = String(kills);
    const quotes = [
      '"THE ARENA ALWAYS WINS."',
      '"YOU WERE ALMOST LEGEND."',
      '"THE HORDE REMEMBERS."',
      '"ANOTHER NAME FOR THE WALL."',
      '"RELOAD. RE-ENTER. REPEAT."',
    ];
    this.el.deathQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }
}
