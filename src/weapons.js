import * as THREE from 'three'

export const WEAPONS = {
  pickaxe: {
    id: 'pickaxe', name: 'PICKAXE', slot: 1, kind: 'melee',
    damage: 20, structureDamage: 48, treeDamage: 55, rate: 1.75, range: 3.3,
    mag: 0, reload: 0, color: '#c8d6e5', rarity: 'COMMON', rarityClass: 'rarity-c'
  },
  ar: {
    id: 'ar', name: 'ASSAULT RIFLE', slot: 2, kind: 'gun',
    damage: 23, headshot: 1.7, structureDamage: 20, rate: 5.4, range: 145,
    mag: 30, reload: 2.1, spreadHip: 0.021, spreadAds: 0.0055, pellets: 1, auto: true,
    color: '#67e88d', rarity: 'UNCOMMON', rarityClass: 'rarity-u', ammoStart: 30, reserveStart: 90, maxReserve: 180
  },
  shotgun: {
    id: 'shotgun', name: 'PUMP SHOTGUN', slot: 3, kind: 'gun',
    damage: 11, headshot: 1.55, structureDamage: 9, rate: 0.95, range: 32,
    mag: 5, reload: 2.7, spreadHip: 0.075, spreadAds: 0.052, pellets: 9, auto: false,
    color: '#d9a066', rarity: 'RARE', rarityClass: 'rarity-r', ammoStart: 5, reserveStart: 20, maxReserve: 40
  },
  smg: {
    id: 'smg', name: 'RAPID SMG', slot: 4, kind: 'gun',
    damage: 14, headshot: 1.5, structureDamage: 13, rate: 12.5, range: 78,
    mag: 32, reload: 2.0, spreadHip: 0.033, spreadAds: 0.014, pellets: 1, auto: true,
    color: '#6fc8ff', rarity: 'RARE', rarityClass: 'rarity-r', ammoStart: 32, reserveStart: 96, maxReserve: 192
  }
}

export function createLoadout() {
  const loadout = {}
  for (const [id, def] of Object.entries(WEAPONS)) {
    loadout[def.slot] = {
      id,
      def,
      unlocked: id === 'pickaxe' || id === 'ar',
      mag: def.mag ? (id === 'ar' ? def.ammoStart : 0) : 0,
      reserve: def.reserveStart ? (id === 'ar' ? def.reserveStart : 0) : 0
    }
  }
  return loadout
}

export function weaponSpread(def, ads, moving, speed) {
  const base = ads ? def.spreadAds : def.spreadHip
  const move = Math.min(1, speed / 7) * (ads ? 0.006 : 0.024)
  const jump = moving ? 0.006 : 0
  return base + move + jump
}

export function damageForDistance(def, distance) {
  if (def.id !== 'shotgun') return 1
  const max = def.range
  if (distance <= max * 0.25) return 1
  const t = Math.min(1, (distance - max * 0.25) / (max * 0.75))
  return THREE.MathUtils.lerp(1, 0.22, t)
}
