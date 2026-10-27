import "./styles.css";
import { Game } from "./game/game.js";
import { AudioManager } from "./game/audio.js";
import { LEVELS } from "./game/levels.js";

const $ = (selector) => document.querySelector(selector);

const ui = {
  canvas: $("#game"),
  hud: $("#hud"),
  hudLevel: $("#hud-level"),
  hudScore: $("#hud-score"),
  hudBirds: $("#hud-birds"),
  pause: $("#btn-pause"),
  sound: $("#btn-sound"),
  title: $("#screen-title"),
  levels: $("#screen-levels"),
  levelGrid: $("#level-grid"),
  play: $("#btn-play"),
  levelsBtn: $("#btn-levels"),
  levelsBack: $("#btn-levels-back"),
  bestScore: $("#best-score"),
  abilityHint: $("#ability-hint"),
  abilityText: $("#ability-text"),
  modalRoot: $("#modal-root"),
  modalCard: $("#modal-card"),
  toast: $("#toast"),
  boot: $("#boot"),
};

const audio = new AudioManager();
let toastTimer = 0;
let hintTimer = 0;
let modalType = null;
let lastModalButton = null;

const game = new Game(ui.canvas, audio, {
  onLevelStart: (level) => {
    ui.hudLevel.textContent = String(level.id);
    showHud(true);
    updateSoundIcon();
    showToast(`LEVEL ${level.id} · ${level.name.toUpperCase()}`, 1500);
    window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (game.state === "playing" && level.id === 1 && !localStorage.getItem("angry-birds-tutorial-seen")) {
        showToast("DRAG THE BIRD BACK · AIM · LET GO", 2600);
        try {
          localStorage.setItem("angry-birds-tutorial-seen", "1");
        } catch {}
      }
    }, 1700);
  },
  onScore: (score) => {
    ui.hudScore.textContent = Math.round(score).toLocaleString();
    ui.hudScore.classList.remove("bump");
    void ui.hudScore.offsetWidth;
    ui.hudScore.classList.add("bump");
    window.clearTimeout(ui.hudScore._bumpTimer);
    ui.hudScore._bumpTimer = window.setTimeout(() => ui.hudScore.classList.remove("bump"), 140);
  },
  onBirds: ({ types, used, ready }) => {
    renderBirdCount(types, used, ready);
  },
  onAbility: (show, label) => {
    if (show) {
      ui.abilityText.textContent = label || "TAP FOR ABILITY";
      ui.abilityHint.classList.remove("hidden");
    } else {
      ui.abilityHint.classList.add("hidden");
    }
  },
  onProgress: (progress) => {
    updateBest(progress);
    if (!ui.levels.classList.contains("hidden")) renderLevelGrid(progress);
  },
  onWin: (result) => showWin(result),
  onLose: (result) => showLose(result),
  onPauseRequest: () => togglePause(),
  onRestartRequest: () => restartLevel(),
  onMuteRequest: () => toggleMute(),
});

window.__angryBirds = {
  game,
  audio,
  startLevel: (index) => startLevel(index),
  restart: () => restartLevel(),
  launchAt: (angle, power) => game.launchAt(angle, power),
  skipTurn: () => game.skipTurn(),
  killAllPigs: () => game.killAllPigs(),
  forceLevel: (index) => beginLevel(index),
  snapshot: () => game.getSnapshot(),
  pause: () => game.pause(),
  resume: () => game.resume(),
  showTitle,
  ui,
};

renderLevelGrid(game.progress);
updateBest(game.progress);
ui.sound.classList.toggle("muted", audio.muted);
updateSoundIcon();

window.setTimeout(() => ui.boot.classList.add("done"), 420);

/* -------------------------------------------------------------------- */
/* Title / screens                                                      */
/* -------------------------------------------------------------------- */

function clearModal() {
  modalType = null;
  ui.modalRoot.classList.add("hidden");
  ui.modalCard.innerHTML = "";
}

function hideAllScreens() {
  for (const screen of [ui.title, ui.levels]) {
    screen.classList.add("hidden");
    screen.classList.remove("leaving");
  }
}

function showTitle() {
  audio.click();
  clearModal();
  showHud(false);
  ui.abilityHint.classList.add("hidden");
  ui.levels.classList.add("hidden");
  ui.title.classList.remove("hidden", "leaving");
  game.startPreview(Math.max(0, game.progress.unlocked - 1));
  updateBest(game.progress);
  renderLevelGrid(game.progress);
}

function showLevels() {
  audio.click();
  if (game.state !== "menu") game.startPreview(Math.max(0, game.progress.unlocked - 1));
  showHud(false);
  ui.abilityHint.classList.add("hidden");
  renderLevelGrid(game.progress);
  ui.title.classList.add("hidden");
  ui.levels.classList.remove("hidden");
  ui.levels.classList.remove("leaving");
}

function hideLevels() {
  ui.levels.classList.add("leaving");
  window.setTimeout(() => {
    ui.levels.classList.add("hidden");
    ui.levels.classList.remove("leaving");
    ui.title.classList.remove("hidden");
    ui.title.classList.remove("leaving");
  }, 280);
}

function beginLevel(index) {
  clearModal();
  ui.abilityHint.classList.add("hidden");
  ui.title.classList.add("leaving");
  ui.levels.classList.add("leaving");
  showHud(true);
  window.setTimeout(() => {
    ui.title.classList.add("hidden");
    ui.title.classList.remove("leaving");
    ui.levels.classList.add("hidden");
    ui.levels.classList.remove("leaving");
  }, 300);
  game.startLevel(index, false);
}

function startLevel(index) {
  if (index < 0 || index >= LEVELS.length) return;
  if (index + 1 > game.progress.unlocked) {
    showToast("CLEAR THE PREVIOUS LEVEL FIRST", 1800);
    return;
  }
  audio.unlock();
  audio.click();
  beginLevel(index);
}

function restartLevel() {
  audio.unlock();
  audio.click();
  clearModal();
  showHud(true);
  game.startLevel(game.levelIndex, false);
}

function showHud(visible) {
  ui.hud.classList.toggle("hidden", !visible);
}

function togglePause() {
  if (modalType === "pause") {
    closePause();
    return;
  }
  if (modalType) return;
  if (game.state === "paused") {
    game.resume();
    clearModal();
    updateSoundIcon();
    return;
  }
  if (game.state !== "playing") return;
  audio.click();
  game.pause();
  ui.abilityHint.classList.add("hidden");
  showPause();
}

function closePause() {
  if (modalType !== "pause") return;
  game.resume();
  clearModal();
  audio.click();
}

function toggleMute() {
  audio.unlock();
  const muted = audio.toggleMuted();
  ui.sound.classList.toggle("muted", muted);
  updateSoundIcon();
  showToast(muted ? "SOUND OFF" : "SOUND ON", 1100);
}

function updateSoundIcon() {
  ui.sound.setAttribute("aria-label", audio.muted ? "Unmute sound" : "Mute sound");
  ui.sound.title = audio.muted ? "Sound off (M)" : "Sound on (M)";
}

/* -------------------------------------------------------------------- */
/* HUD                                                                  */
/* -------------------------------------------------------------------- */

function renderBirdCount(types, used, ready) {
  ui.hudBirds.innerHTML = "";
  types.forEach((type, index) => {
    const dot = document.createElement("span");
    dot.className = "bird-dot";
    dot.dataset.type = type;
    if (index < used) dot.classList.add("spent");
    if (index === used && ready === type) dot.classList.add("ready");
    dot.title = `${type} bird${index === used && ready === type ? " — ready" : ""}`;
    ui.hudBirds.appendChild(dot);
  });
  ui.hudBirds.setAttribute("aria-label", `${Math.max(0, types.length - used)} birds remaining`);
}

function updateBest(progress) {
  const best = Math.max(0, ...Object.values(progress.best || {}).map((value) => Number(value) || 0));
  ui.bestScore.textContent = best.toLocaleString();
}

/* -------------------------------------------------------------------- */
/* Level select                                                         */
/* -------------------------------------------------------------------- */

function renderLevelGrid(progress) {
  ui.levelGrid.innerHTML = "";
  LEVELS.forEach((level, index) => {
    const unlocked = level.id <= progress.unlocked;
    const stars = Number(progress.stars[level.id]) || 0;
    const card = document.createElement("button");
    card.className = "level-card";
    card.type = "button";
    card.dataset.level = String(index);
    card.setAttribute("aria-label", `Level ${level.id}: ${level.name}${unlocked ? "" : " (locked)"}`);
    if (!unlocked) card.disabled = true;
    card.innerHTML = `
      <div class="level-preview theme-${level.theme}">
        <span class="preview-hill h1"></span>
        <span class="preview-hill h2"></span>
        <span class="preview-ground"></span>
        <span class="preview-sling"></span>
        <span class="preview-bird"></span>
        <span class="preview-fort"><span></span><span></span><span></span></span>
        <span class="preview-pig"></span>
      </div>
      <div class="level-meta">
        <span class="level-num">${level.id}</span>
        <span class="level-stars">${[0, 1, 2].map((i) => `<span class="star${i < stars ? " on" : ""}"></span>`).join("")}</span>
      </div>
      ${unlocked ? "" : '<span class="level-lock" aria-hidden="true"></span>'}
    `;
    if (unlocked) {
      card.addEventListener("click", () => startLevel(index));
    }
    ui.levelGrid.appendChild(card);
  });
}

ui.levelGrid.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const cards = [...ui.levelGrid.querySelectorAll(".level-card:not([disabled])")];
  if (!cards.length) return;
  const current = document.activeElement;
  let index = cards.indexOf(current);
  index = event.key === "ArrowRight" ? (index + 1) % cards.length : (index - 1 + cards.length) % cards.length;
  cards[index].focus();
  event.preventDefault();
});

/* -------------------------------------------------------------------- */
/* Modals                                                               */
/* -------------------------------------------------------------------- */

function openModal(type, html) {
  modalType = type;
  lastModalButton = document.activeElement;
  ui.modalCard.innerHTML = html;
  ui.modalCard.dataset.modal = type;
  ui.modalRoot.classList.remove("hidden");
  const focusButton = ui.modalCard.querySelector("button");
  if (focusButton) window.setTimeout(() => focusButton.focus({ preventScroll: true }), 80);
}

function showPause() {
  openModal(
    "pause",
    `
    <p class="modal-kicker">THE FLOCK IS WAITING</p>
    <h2 class="modal-title">PAUSED</h2>
    <p class="modal-sub">Take a breath. The pigs aren't going anywhere.</p>
    <div class="modal-actions">
      <button class="btn btn-play" data-action="resume"><span>RESUME</span></button>
      <button class="btn btn-ghost" data-action="restart">RESTART</button>
      <button class="btn btn-ghost" data-action="levels">LEVELS</button>
      <button class="btn btn-ghost" data-action="title">TITLE</button>
    </div>
  `,
  );
}

function showWin(result) {
  showHud(true);
  ui.abilityHint.classList.add("hidden");
  const stars = [0, 1, 2].map((i) => `<span class="star${i < result.stars ? " on" : ""}"></span>`).join("");
  openModal(
    "win",
    `
    <p class="modal-kicker">${result.stars === 3 ? "UTTERLY SMASHING" : "FORT DEMOLISHED"}</p>
    <h2 class="modal-title win">LEVEL CLEARED!</h2>
    <div class="big-stars">${stars}</div>
    <div class="result-grid">
      <div class="result-cell"><span>SCORE</span><strong>${result.score.toLocaleString()}</strong></div>
      <div class="result-cell"><span>BEST</span><strong>${result.best.toLocaleString()}</strong></div>
    </div>
    <div class="modal-actions">
      ${result.hasNext ? '<button class="btn btn-play" data-action="next"><span>NEXT LEVEL</span></button>' : '<button class="btn btn-play" data-action="levels"><span>ALL LEVELS</span></button>'}
      <button class="btn btn-ghost" data-action="restart">REPLAY</button>
      <button class="btn btn-ghost" data-action="levels">LEVELS</button>
    </div>
  `,
  );
  updateBest(game.progress);
  renderLevelGrid(game.progress);
}

function showLose(result) {
  ui.abilityHint.classList.add("hidden");
  openModal(
    "lose",
    `
    <p class="modal-kicker">THE PIGS ARE STILL OINKING</p>
    <h2 class="modal-title lose">OUT OF BIRDS</h2>
    <p class="modal-sub">${result.pigs} pig${result.pigs === 1 ? "" : "s"} survived. Adjust your aim and bring the whole fort down.</p>
    <div class="result-grid">
      <div class="result-cell"><span>SCORE</span><strong>${result.score.toLocaleString()}</strong></div>
      <div class="result-cell"><span>PIGS LEFT</span><strong>${result.pigs}</strong></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-play" data-action="restart"><span>TRY AGAIN</span></button>
      <button class="btn btn-ghost" data-action="levels">LEVELS</button>
      <button class="btn btn-ghost" data-action="title">TITLE</button>
    </div>
  `,
  );
}

ui.modalCard.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  audio.unlock();
  audio.click();
  if (action === "resume") {
    closePause();
  } else if (action === "restart") {
    restartLevel();
  } else if (action === "levels") {
    clearModal();
    showHud(false);
    showLevels();
  } else if (action === "title") {
    clearModal();
    showHud(false);
    showTitle();
  } else if (action === "next") {
    clearModal();
    if (game.levelIndex < LEVELS.length - 1) {
      beginLevel(game.levelIndex + 1);
    } else {
      showLevels();
    }
  }
});

ui.modalRoot.addEventListener("click", (event) => {
  if (event.target === ui.modalRoot && modalType === "pause") closePause();
});

/* -------------------------------------------------------------------- */
/* Buttons & keys                                                       */
/* -------------------------------------------------------------------- */

ui.play.addEventListener("click", () => {
  audio.unlock();
  audio.click();
  const start = Math.min(game.progress.unlocked - 1, LEVELS.length - 1);
  startLevel(Math.max(0, start));
});

ui.levelsBtn.addEventListener("click", () => {
  audio.unlock();
  showLevels();
});

ui.levelsBack.addEventListener("click", () => {
  audio.click();
  hideLevels();
});

ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleMute);

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  if (key === "escape") {
    if (!ui.modalRoot.classList.contains("hidden")) {
      if (modalType === "pause") closePause();
      return;
    }
    if (!ui.levels.classList.contains("hidden")) {
      hideLevels();
      return;
    }
    if (ui.title.classList.contains("hidden")) {
      togglePause();
      return;
    }
  }
  if (key === "enter" && !ui.title.classList.contains("hidden")) {
    ui.play.click();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && game.state === "playing") {
    game.pause();
    showPause();
  }
});

/* -------------------------------------------------------------------- */
/* Toast                                                                */
/* -------------------------------------------------------------------- */

function showToast(message, duration = 1800) {
  window.clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  void ui.toast.offsetWidth;
  toastTimer = window.setTimeout(() => ui.toast.classList.add("hidden"), duration);
}
