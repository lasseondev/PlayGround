const STORAGE_KEY = "mood-tracker.entries.v1";

const MOODS = [
  { value: 1, emoji: "😖", label: "Awful", color: "#d95d5d" },
  { value: 2, emoji: "😕", label: "Low", color: "#e0834b" },
  { value: 3, emoji: "😐", label: "Okay", color: "#d3a92f" },
  { value: 4, emoji: "🙂", label: "Good", color: "#4fa878" },
  { value: 5, emoji: "😄", label: "Great", color: "#4f8fd8" },
];

const TAGS = [
  { name: "Work", emoji: "💼" },
  { name: "Exercise", emoji: "🏃" },
  { name: "Friends", emoji: "👥" },
  { name: "Family", emoji: "🏠" },
  { name: "Sleep", emoji: "😴" },
  { name: "Food", emoji: "🍜" },
  { name: "Nature", emoji: "🌿" },
  { name: "Music", emoji: "🎧" },
  { name: "Reading", emoji: "📖" },
  { name: "Rest", emoji: "🛋️" },
  { name: "Travel", emoji: "✈️" },
  { name: "Creative", emoji: "🎨" },
];

const HINTS = {
  1: "That sounds heavy. Want to talk it out in a note?",
  2: "Not your best moment. A few words might help.",
  3: "Steady is good. Anything worth noting?",
  4: "Nice. What made it good?",
  5: "Love that. Capture what went right.",
};

const DEFAULT_HINT = "Pick the face that fits right now.";
const moodButtons = [];
let selectedMood = null;
let selectedTags = new Set();
let entries = loadEntries();
let toastTimer = null;

const todayLabel = document.getElementById("todayLabel");
const moodPicker = document.getElementById("moodPicker");
const checkinHint = document.getElementById("checkinHint");
const noteInput = document.getElementById("note");
const noteCount = document.getElementById("noteCount");
const tagPicker = document.getElementById("tagPicker");
const saveBtn = document.getElementById("saveBtn");
const streakValue = document.getElementById("streakValue");
const streakUnit = document.getElementById("streakUnit");
const avgValue = document.getElementById("avgValue");
const avgUnit = document.getElementById("avgUnit");
const totalValue = document.getElementById("totalValue");
const chart = document.getElementById("chart");
const weekAvg = document.getElementById("weekAvg");
const insightsEl = document.getElementById("insights");
const insightPill = document.getElementById("insightPill");
const historyEl = document.getElementById("history");
const historyCount = document.getElementById("historyCount");
const exportBtn = document.getElementById("exportBtn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const toastAction = document.getElementById("toastAction");

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});
const weekdayLongFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

function pad(value) {
  return String(value).padStart(2, "0");
}

function dayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function moodFor(value) {
  return MOODS.find((mood) => mood.value === value) || MOODS[2];
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.id === "string" &&
    Number.isInteger(entry.mood) &&
    entry.mood >= 1 &&
    entry.mood <= 5 &&
    typeof entry.ts === "string" &&
    !Number.isNaN(Date.parse(entry.ts))
  );
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry).map((entry) => ({
      id: entry.id,
      mood: entry.mood,
      note: typeof entry.note === "string" ? entry.note.slice(0, 280) : "",
      tags: Array.isArray(entry.tags)
        ? entry.tags.filter((tag) => typeof tag === "string")
        : [],
      ts: new Date(entry.ts).toISOString(),
    }));
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    showToast("Couldn't save on this device.");
  }
}

function buildMoodPicker() {
  MOODS.forEach((mood, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mood";
    button.dataset.mood = String(mood.value);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.setAttribute("aria-label", mood.label);
    button.tabIndex = index === 0 ? 0 : -1;
    button.style.setProperty("--mood-color", mood.color);

    const face = document.createElement("span");
    face.className = "mood-face";
    face.setAttribute("aria-hidden", "true");
    face.textContent = mood.emoji;

    const name = document.createElement("span");
    name.className = "mood-name";
    name.textContent = mood.label;

    button.append(face, name);
    button.addEventListener("click", () => selectMood(mood.value));
    button.addEventListener("keydown", (event) =>
      handleMoodKeydown(event, index)
    );
    moodPicker.append(button);
    moodButtons.push(button);
  });
}

function handleMoodKeydown(event, index) {
  const keys = {
    ArrowRight: (index + 1) % MOODS.length,
    ArrowDown: (index + 1) % MOODS.length,
    ArrowLeft: (index - 1 + MOODS.length) % MOODS.length,
    ArrowUp: (index - 1 + MOODS.length) % MOODS.length,
    Home: 0,
    End: MOODS.length - 1,
  };

  if (!(event.key in keys)) return;
  event.preventDefault();
  const nextIndex = keys[event.key];
  selectMood(MOODS[nextIndex].value);
  moodButtons[nextIndex].focus();
}

function selectMood(value) {
  selectedMood = value;
  moodButtons.forEach((button) => {
    const isSelected = Number(button.dataset.mood) === value;
    button.setAttribute("aria-checked", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });
  checkinHint.textContent = HINTS[value];
  updateSaveState();
}

function buildTagPicker() {
  TAGS.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag";
    button.dataset.tag = tag.name;
    button.setAttribute("aria-pressed", "false");
    button.textContent = `${tag.emoji} ${tag.name}`;
    button.addEventListener("click", () => toggleTag(tag.name, button));
    tagPicker.append(button);
  });
}

function toggleTag(name, button) {
  if (selectedTags.has(name)) {
    selectedTags.delete(name);
    button.setAttribute("aria-pressed", "false");
  } else {
    selectedTags.add(name);
    button.setAttribute("aria-pressed", "true");
  }
}

function updateSaveState() {
  saveBtn.disabled = selectedMood === null;
}

function updateNoteCounter() {
  noteCount.textContent = `${noteInput.value.length} / 280`;
}

function saveEntry() {
  if (selectedMood === null) return;

  const entry = {
    id:
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    mood: selectedMood,
    note: noteInput.value.trim(),
    tags: [...selectedTags],
    ts: new Date().toISOString(),
  };

  entries.push(entry);
  persist();
  clearForm();
  renderAll();
  showToast("Check-in saved. Thanks for being honest.");
  moodButtons[0]?.focus({ preventScroll: true });
}

function clearForm() {
  selectedMood = null;
  selectedTags = new Set();
  noteInput.value = "";
  updateNoteCounter();
  checkinHint.textContent = DEFAULT_HINT;
  moodButtons.forEach((button, index) => {
    button.setAttribute("aria-checked", "false");
    button.tabIndex = index === 0 ? 0 : -1;
  });
  tagPicker.querySelectorAll(".tag").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  updateSaveState();
}

function deleteEntry(id) {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) return;

  const [removed] = entries.splice(index, 1);
  persist();
  renderAll();
  showToast("Check-in deleted", "Undo", () => {
    entries.push(removed);
    entries.sort((a, b) => a.ts.localeCompare(b.ts));
    persist();
    renderAll();
    showToast("Check-in restored");
  });
}

function calculateStreak() {
  const days = new Set(
    entries.map((entry) => dayKey(new Date(entry.ts)))
  );
  let cursor = startOfDay(new Date());

  if (!days.has(dayKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function lastSevenDays() {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const key = dayKey(date);
    const dayEntries = entries.filter(
      (entry) => dayKey(new Date(entry.ts)) === key
    );
    const average =
      dayEntries.length > 0
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) /
          dayEntries.length
        : null;
    return { date, key, average, count: dayEntries.length };
  });
}

function renderStats() {
  const streak = calculateStreak();
  streakValue.textContent = String(streak);
  streakUnit.textContent = streak === 1 ? "day" : "days";

  const week = lastSevenDays().filter((day) => day.average !== null);
  if (week.length === 0) {
    avgValue.textContent = "—";
    avgUnit.textContent = "no data";
    weekAvg.textContent = "—";
  } else {
    const average =
      week.reduce((sum, day) => sum + day.average, 0) / week.length;
    avgValue.textContent = average.toFixed(1);
    const checkins = week.reduce((sum, day) => sum + day.count, 0);
    avgUnit.textContent = `${checkins} check-in${checkins === 1 ? "" : "s"}`;
    weekAvg.textContent = `${average.toFixed(1)} avg`;
  }

  totalValue.textContent = String(entries.length);
  historyCount.textContent = String(entries.length);
  exportBtn.disabled = entries.length === 0;
}

function renderChart() {
  const days = lastSevenDays();
  chart.replaceChildren();

  const descriptions = [];

  days.forEach((day, index) => {
    const isToday = index === days.length - 1;
    const column = document.createElement("div");
    column.className = `chart-day${isToday ? " today" : ""}`;

    const value = document.createElement("span");
    value.className = "chart-value";
    value.textContent = day.average === null ? "" : day.average.toFixed(1);

    const track = document.createElement("div");
    track.className = "chart-track";

    const bar = document.createElement("div");
    bar.className = `chart-bar${day.average === null ? " empty" : ""}`;
    bar.style.setProperty("--i", String(index));
    bar.style.height =
      day.average === null ? "5px" : `${(day.average / 5) * 100}%`;

    if (day.average !== null) {
      bar.style.setProperty(
        "--bar-color",
        moodFor(Math.round(day.average)).color
      );
    }

    const label = document.createElement("span");
    label.className = "chart-label";
    label.textContent = weekdayFormatter.format(day.date);

    const dayName = shortDateFormatter.format(day.date);
    const description =
      day.average === null
        ? `${dayName}: no check-ins`
        : `${dayName}: ${day.average.toFixed(1)} average across ${
            day.count
          } check-in${day.count === 1 ? "" : "s"}`;
    descriptions.push(description);
    column.title = description;

    track.append(bar);
    column.append(value, track, label);
    chart.append(column);
  });

  chart.setAttribute(
    "aria-label",
    `Mood over the last seven days. ${descriptions.join(". ")}.`
  );
}

function createInsightRow(icon, label, value) {
  const row = document.createElement("div");
  row.className = "insight-row";

  const iconEl = document.createElement("span");
  iconEl.className = "insight-icon";
  iconEl.setAttribute("aria-hidden", "true");
  iconEl.textContent = icon;

  const text = document.createElement("div");
  text.className = "insight-text";

  const labelEl = document.createElement("span");
  labelEl.className = "insight-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("strong");
  valueEl.className = "insight-value";
  valueEl.textContent = value;

  text.append(labelEl, valueEl);
  row.append(iconEl, text);
  insightsEl.append(row);
}

function renderInsights() {
  const week = lastSevenDays();
  const logged = week.filter((day) => day.average !== null);
  insightsEl.replaceChildren();

  if (logged.length === 0) {
    insightPill.textContent = "waiting";
    const empty = document.createElement("p");
    empty.className = "insight-empty";
    empty.textContent =
      "A few check-ins and gentle patterns will start showing up here.";
    insightsEl.append(empty);
    return;
  }

  insightPill.textContent = `${logged.length} of 7 days`;
  const best = logged.reduce((top, day) =>
    day.average >= top.average ? day : top
  );
  const bestMood = moodFor(Math.round(best.average));

  createInsightRow(
    "☀️",
    "Brightest day",
    `${weekdayLongFormatter.format(best.date)} · ${best.average.toFixed(1)} ${
      bestMood.emoji
    }`
  );
  createInsightRow(
    "📅",
    "Days logged",
    `${logged.length} of the last 7`
  );

  const weekKeys = new Set(week.map((day) => day.key));
  const tagCounts = new Map();
  let noteCount = 0;

  entries.forEach((entry) => {
    if (!weekKeys.has(dayKey(new Date(entry.ts)))) return;
    if (entry.note) noteCount += 1;
    entry.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const rankedTags = [...tagCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  if (rankedTags.length > 0) {
    const [topName, topCount] = rankedTags[0];
    const isPattern = topCount > 1;
    const value = isPattern
      ? `${topName} · ${topCount}×`
      : rankedTags
          .slice(0, 2)
          .map(([name]) => name)
          .join(" · ");

    createInsightRow(
      tagEmoji(topName) || "🏷️",
      isPattern ? "Most logged" : "Tags this week",
      value
    );
  } else {
    createInsightRow("📝", "Notes written", `${noteCount} this week`);
  }
}

function groupLabel(key, date) {
  const today = dayKey(new Date());
  const yesterday = dayKey(addDays(new Date(), -1));
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return shortDateFormatter.format(date);
}

function tagEmoji(name) {
  return TAGS.find((tag) => tag.name === name)?.emoji || "";
}

function renderHistory() {
  historyEl.replaceChildren();

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    const emoji = document.createElement("span");
    emoji.className = "empty-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = "🌱";
    const message = document.createElement("p");
    message.textContent =
      "No check-ins yet. Your first one takes a few seconds, and it's just for you.";
    empty.append(emoji, message);
    historyEl.append(empty);
    return;
  }

  const sorted = [...entries].sort((a, b) => b.ts.localeCompare(a.ts));
  const groups = new Map();

  sorted.forEach((entry) => {
    const key = dayKey(new Date(entry.ts));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });

  groups.forEach((groupEntries, key) => {
    const date = new Date(groupEntries[0].ts);
    const average =
      groupEntries.reduce((sum, entry) => sum + entry.mood, 0) /
      groupEntries.length;

    const section = document.createElement("section");
    section.className = "history-group";

    const head = document.createElement("div");
    head.className = "group-head";

    const heading = document.createElement("h3");
    heading.textContent = groupLabel(key, date);

    const meta = document.createElement("span");
    meta.className = "group-meta";
    meta.textContent = `${moodFor(Math.round(average)).emoji} ${average.toFixed(
      1
    )} avg · ${groupEntries.length} check-in${
      groupEntries.length === 1 ? "" : "s"
    }`;

    head.append(heading, meta);

    const list = document.createElement("ul");
    list.className = "entries";

    groupEntries.forEach((entry) => {
      const mood = moodFor(entry.mood);
      const timeText = timeFormatter.format(new Date(entry.ts));

      const item = document.createElement("li");
      item.className = "entry";
      item.style.setProperty("--mood-color", mood.color);

      const face = document.createElement("span");
      face.className = "entry-face";
      face.setAttribute("aria-hidden", "true");
      face.textContent = mood.emoji;

      const body = document.createElement("div");
      body.className = "entry-body";

      const top = document.createElement("div");
      top.className = "entry-top";

      const moodLabel = document.createElement("span");
      moodLabel.className = "entry-mood";
      moodLabel.textContent = mood.label;

      const time = document.createElement("time");
      time.className = "entry-time";
      time.dateTime = entry.ts;
      time.textContent = timeText;

      top.append(moodLabel, time);
      body.append(top);

      if (entry.note) {
        const note = document.createElement("p");
        note.className = "entry-note";
        note.textContent = entry.note;
        body.append(note);
      }

      if (entry.tags.length > 0) {
        const tags = document.createElement("div");
        tags.className = "entry-tags";
        entry.tags.forEach((name) => {
          const chip = document.createElement("span");
          chip.className = "entry-tag";
          chip.textContent = `${tagEmoji(name)} ${name}`.trim();
          tags.append(chip);
        });
        body.append(tags);
      }

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "entry-delete";
      remove.setAttribute(
        "aria-label",
        `Delete ${mood.label} check-in from ${timeText}`
      );
      remove.textContent = "×";
      remove.addEventListener("click", () => deleteEntry(entry.id));

      item.append(face, body, remove);
      list.append(item);
    });

    section.append(head, list);
    historyEl.append(section);
  });
}

function renderAll() {
  renderStats();
  renderChart();
  renderInsights();
  renderHistory();
}

function exportEntries() {
  if (entries.length === 0) return;
  const payload = {
    app: "mood-tracker",
    exportedAt: new Date().toISOString(),
    entries,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mood-tracker-${dayKey(new Date())}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Check-ins exported as JSON.");
}

function hideToast() {
  toast.classList.remove("show");
  clearTimeout(toastTimer);
}

function showToast(text, actionLabel, action) {
  toastText.textContent = text;

  if (actionLabel) {
    toastAction.hidden = false;
    toastAction.textContent = actionLabel;
    toastAction.onclick = () => {
      hideToast();
      action();
    };
  } else {
    toastAction.hidden = true;
    toastAction.onclick = null;
  }

  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, actionLabel ? 5000 : 2800);
}

function init() {
  todayLabel.textContent = dateFormatter.format(new Date());
  buildMoodPicker();
  buildTagPicker();
  updateNoteCounter();
  updateSaveState();

  noteInput.addEventListener("input", updateNoteCounter);
  saveBtn.addEventListener("click", saveEntry);
  exportBtn.addEventListener("click", exportEntries);

  noteInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      saveEntry();
    }
  });

  renderAll();
}

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  entries = loadEntries();
  renderAll();
});

init();
