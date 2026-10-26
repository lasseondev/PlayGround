export const ATLAS_COLS = 8;
export const ATLAS_TILE = 16;

export const TILE = {
  grassTop: 0,
  grassSide: 1,
  dirt: 2,
  stone: 3,
  cobble: 4,
  sand: 5,
  logSide: 6,
  logTop: 7,
  leaves: 8,
  planks: 9,
  water: 10,
  coalOre: 11,
  ironOre: 12,
  bedrock: 13,
  tableTop: 14,
  tableSide: 15,
  ironBlock: 16,
  glass: 17
};

export const BLOCKS = {
  grass: {
    id: 1, name: 'Grass Block', solid: true, opaque: true,
    tiles: { top: TILE.grassTop, side: TILE.grassSide, bottom: TILE.dirt },
    drop: 'dirt', needsPick: false
  },
  dirt: {
    id: 2, name: 'Dirt', solid: true, opaque: true,
    tiles: { top: TILE.dirt, side: TILE.dirt, bottom: TILE.dirt },
    drop: 'dirt'
  },
  stone: {
    id: 3, name: 'Stone', solid: true, opaque: true,
    tiles: { top: TILE.stone, side: TILE.stone, bottom: TILE.stone },
    drop: 'cobblestone', needsPick: true
  },
  cobblestone: {
    id: 4, name: 'Cobblestone', solid: true, opaque: true,
    tiles: { top: TILE.cobble, side: TILE.cobble, bottom: TILE.cobble },
    drop: 'cobblestone'
  },
  sand: {
    id: 5, name: 'Sand', solid: true, opaque: true,
    tiles: { top: TILE.sand, side: TILE.sand, bottom: TILE.sand },
    drop: 'sand'
  },
  log: {
    id: 6, name: 'Oak Log', solid: true, opaque: true,
    tiles: { top: TILE.logTop, side: TILE.logSide, bottom: TILE.logTop },
    drop: 'log'
  },
  leaves: {
    id: 7, name: 'Oak Leaves', solid: true, opaque: true,
    tiles: { top: TILE.leaves, side: TILE.leaves, bottom: TILE.leaves },
    drop: null
  },
  planks: {
    id: 8, name: 'Oak Planks', solid: true, opaque: true,
    tiles: { top: TILE.planks, side: TILE.planks, bottom: TILE.planks },
    drop: 'planks'
  },
  water: {
    id: 9, name: 'Water', solid: false, opaque: false, liquid: true,
    tiles: { top: TILE.water, side: TILE.water, bottom: TILE.water },
    drop: null
  },
  coal_ore: {
    id: 10, name: 'Coal Ore', solid: true, opaque: true,
    tiles: { top: TILE.coalOre, side: TILE.coalOre, bottom: TILE.coalOre },
    drop: 'coal', needsPick: true
  },
  iron_ore: {
    id: 11, name: 'Iron Ore', solid: true, opaque: true,
    tiles: { top: TILE.ironOre, side: TILE.ironOre, bottom: TILE.ironOre },
    drop: 'raw_iron', needsPick: true
  },
  bedrock: {
    id: 12, name: 'Bedrock', solid: true, opaque: true, unbreakable: true,
    tiles: { top: TILE.bedrock, side: TILE.bedrock, bottom: TILE.bedrock },
    drop: null
  },
  crafting_table: {
    id: 13, name: 'Crafting Table', solid: true, opaque: true,
    tiles: { top: TILE.tableTop, side: TILE.tableSide, bottom: TILE.planks },
    drop: 'crafting_table'
  },
  torch: {
    id: 14, name: 'Torch', solid: false, opaque: false, unbreakable: false,
    tiles: { top: TILE.planks, side: TILE.planks, bottom: TILE.planks },
    drop: 'torch'
  },
  iron_block: {
    id: 15, name: 'Iron Block', solid: true, opaque: true,
    tiles: { top: TILE.ironBlock, side: TILE.ironBlock, bottom: TILE.ironBlock },
    drop: 'iron_block'
  }
};

export const BLOCK_BY_ID = {};
for (const [key, value] of Object.entries(BLOCKS)) BLOCK_BY_ID[value.id] = key;

export const ITEMS = {
  grass: { name: 'Grass Block', kind: 'block', block: 'grass' },
  dirt: { name: 'Dirt', kind: 'block', block: 'dirt' },
  cobblestone: { name: 'Cobblestone', kind: 'block', block: 'cobblestone' },
  sand: { name: 'Sand', kind: 'block', block: 'sand' },
  log: { name: 'Oak Log', kind: 'block', block: 'log' },
  planks: { name: 'Oak Planks', kind: 'block', block: 'planks' },
  crafting_table: { name: 'Crafting Table', kind: 'block', block: 'crafting_table' },
  torch: { name: 'Torch', kind: 'block', block: 'torch' },
  iron_block: { name: 'Iron Block', kind: 'block', block: 'iron_block' },
  coal: { name: 'Coal', kind: 'material', color: '#26282b' },
  raw_iron: { name: 'Raw Iron', kind: 'material', color: '#c99a72' },
  iron_ingot: { name: 'Iron Ingot', kind: 'material', color: '#d9dde2' },
  stick: { name: 'Stick', kind: 'material', color: '#9b6a3c' },
  apple: { name: 'Apple', kind: 'food', hunger: 4, color: '#d94f3d' },
  wood_pickaxe: { name: 'Wooden Pickaxe', kind: 'tool', tool: 'pickaxe', tier: 1, durability: 60, color: '#b9874f' },
  wood_axe: { name: 'Wooden Axe', kind: 'tool', tool: 'axe', tier: 1, durability: 60, color: '#b9874f' },
  wood_shovel: { name: 'Wooden Shovel', kind: 'tool', tool: 'shovel', tier: 1, durability: 60, color: '#b9874f' },
  wood_sword: { name: 'Wooden Sword', kind: 'tool', tool: 'sword', tier: 1, durability: 60, color: '#b9874f' },
  stone_pickaxe: { name: 'Stone Pickaxe', kind: 'tool', tool: 'pickaxe', tier: 2, durability: 130, color: '#9a9a9a' },
  stone_axe: { name: 'Stone Axe', kind: 'tool', tool: 'axe', tier: 2, durability: 130, color: '#9a9a9a' },
  stone_shovel: { name: 'Stone Shovel', kind: 'tool', tool: 'shovel', tier: 2, durability: 130, color: '#9a9a9a' },
  stone_sword: { name: 'Stone Sword', kind: 'tool', tool: 'sword', tier: 2, durability: 130, color: '#9a9a9a' },
  iron_pickaxe: { name: 'Iron Pickaxe', kind: 'tool', tool: 'pickaxe', tier: 3, durability: 280, color: '#dfe3e8' },
  iron_axe: { name: 'Iron Axe', kind: 'tool', tool: 'axe', tier: 3, durability: 280, color: '#dfe3e8' },
  iron_shovel: { name: 'Iron Shovel', kind: 'tool', tool: 'shovel', tier: 3, durability: 280, color: '#dfe3e8' },
  iron_sword: { name: 'Iron Sword', kind: 'tool', tool: 'sword', tier: 3, durability: 280, color: '#dfe3e8' }
};

export const RECIPES = [
  { id: 'planks', name: 'Oak Planks', out: { id: 'planks', count: 4 }, ingredients: [{ id: 'log', count: 1 }], station: 'hand' },
  { id: 'sticks', name: 'Sticks', out: { id: 'stick', count: 4 }, ingredients: [{ id: 'planks', count: 2 }], station: 'hand' },
  { id: 'table', name: 'Crafting Table', out: { id: 'crafting_table', count: 1 }, ingredients: [{ id: 'planks', count: 4 }], station: 'hand' },
  { id: 'torches', name: 'Torches', out: { id: 'torch', count: 4 }, ingredients: [{ id: 'stick', count: 1 }, { id: 'coal', count: 1 }], station: 'hand' },
  { id: 'wood_pickaxe', name: 'Wooden Pickaxe', out: { id: 'wood_pickaxe', count: 1 }, ingredients: [{ id: 'planks', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'wood_axe', name: 'Wooden Axe', out: { id: 'wood_axe', count: 1 }, ingredients: [{ id: 'planks', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'wood_shovel', name: 'Wooden Shovel', out: { id: 'wood_shovel', count: 1 }, ingredients: [{ id: 'planks', count: 1 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'wood_sword', name: 'Wooden Sword', out: { id: 'wood_sword', count: 1 }, ingredients: [{ id: 'planks', count: 2 }, { id: 'stick', count: 1 }], station: 'table' },
  { id: 'stone_pickaxe', name: 'Stone Pickaxe', out: { id: 'stone_pickaxe', count: 1 }, ingredients: [{ id: 'cobblestone', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'stone_axe', name: 'Stone Axe', out: { id: 'stone_axe', count: 1 }, ingredients: [{ id: 'cobblestone', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'stone_shovel', name: 'Stone Shovel', out: { id: 'stone_shovel', count: 1 }, ingredients: [{ id: 'cobblestone', count: 1 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'stone_sword', name: 'Stone Sword', out: { id: 'stone_sword', count: 1 }, ingredients: [{ id: 'cobblestone', count: 2 }, { id: 'stick', count: 1 }], station: 'table' },
  { id: 'smelt_iron', name: 'Smelt Iron', out: { id: 'iron_ingot', count: 1 }, ingredients: [{ id: 'raw_iron', count: 1 }, { id: 'coal', count: 1 }], station: 'table' },
  { id: 'iron_pickaxe', name: 'Iron Pickaxe', out: { id: 'iron_pickaxe', count: 1 }, ingredients: [{ id: 'iron_ingot', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'iron_axe', name: 'Iron Axe', out: { id: 'iron_axe', count: 1 }, ingredients: [{ id: 'iron_ingot', count: 3 }, { id: 'stick', count: 2 }], station: 'table' },
  { id: 'iron_sword', name: 'Iron Sword', out: { id: 'iron_sword', count: 1 }, ingredients: [{ id: 'iron_ingot', count: 2 }, { id: 'stick', count: 1 }], station: 'table' }
];

export const STARTER_INVENTORY = [
  { id: 'wood_pickaxe', count: 1, durability: 60 },
  { id: 'log', count: 6 },
  { id: 'planks', count: 16 },
  { id: 'crafting_table', count: 1 },
  { id: 'torch', count: 8 },
  { id: 'apple', count: 3 },
  { id: 'cobblestone', count: 8 },
  { id: 'stick', count: 4 },
  { id: 'coal', count: 4 },
  null, null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null, null
];

export const SAVE_KEY = 'voxel-isle-save-v1';
export const WORLD_SIZE = 48;
export const WORLD_HEIGHT = 32;
export const SEA_LEVEL = 5;
