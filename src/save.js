import { DEFAULT_SAVE } from './data.js';

const KEY = 'shadow-of-hades-save-v1';

export function loadSave() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
  const save = {
    ...DEFAULT_SAVE,
    meta: {},
    ...(data && typeof data === 'object' ? data : {}),
  };
  save.meta = { ...(data?.meta || {}) };
  for (const k of Object.keys(save.meta)) {
    if (!Number.isFinite(save.meta[k])) delete save.meta[k];
  }
  save.darkness = Number.isFinite(save.darkness) ? save.darkness : DEFAULT_SAVE.darkness;
  save.runs = Number(save.runs) || 0;
  save.wins = Number(save.wins) || 0;
  save.heat = Number(save.heat) || 0;
  save.bestChamber = Number(save.bestChamber) || 0;
  save.totalKills = Number(save.totalKills) || 0;
  if (!['blade', 'spear', 'bow'].includes(save.weapon)) save.weapon = 'blade';
  return save;
}

export function writeSave(save) {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch {}
}

export function resetSave() {
  try { localStorage.removeItem(KEY); } catch {}
}
