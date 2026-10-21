export const FACTION_PLAYER = 0;
export const FACTION_AI = 1;

export const MAP_SIZE = 160;

export const UNIT_TYPES = {
  peasant: { name:'Peasant', cost:{gold:50,wood:0}, supply:1, hp:25, speed:4.5, range:1.5, dmg:3, attackRate:1.2, gatherRate:8, buildRate:1, isWorker:true, color:0xcccccc, radius:0.6, sight:12 },
  footman: { name:'Footman', cost:{gold:80,wood:10}, supply:2, hp:60, speed:4, range:1.6, dmg:8, attackRate:1.0, isWorker:false, color:0x3366ff, radius:0.7, sight:14 },
  archer: { name:'Archer', cost:{gold:70,wood:30}, supply:2, hp:40, speed:4.2, range:8, dmg:6, attackRate:1.1, isWorker:false, color:0x66aaff, radius:0.6, sight:16, projectile:true },
  grunt: { name:'Grunt', cost:{gold:80,wood:0}, supply:2, hp:80, speed:3.8, range:1.6, dmg:10, attackRate:1.1, isWorker:false, color:0xcc3333, radius:0.8, sight:14 },
};

export const BUILDING_TYPES = {
  townhall: { name:'Town Hall', cost:{gold:0,wood:0}, hp:1200, size:4, color:0x886633, supply:0, isDropoff:true, trains:['peasant'], buildTime:0 },
  farm: { name:'Farm', cost:{gold:50,wood:20}, hp:400, size:2.5, color:0x558833, supply:6, trains:[], buildTime:15 },
  barracks: { name:'Barracks', cost:{gold:100,wood:50}, hp:600, size:3, color:0x666666, supply:0, trains:['footman','archer'], buildTime:20 },
  lumbermill: { name:'Lumber Mill', cost:{gold:60,wood:20}, hp:500, size:2.5, color:0x8b5a2b, supply:0, isDropoff:true, trains:[], buildTime:15 },
  goldmine: { name:'Gold Mine', cost:{gold:0,wood:0}, hp:99999, size:2, color:0xffd700, supply:0, isMine:true, trains:[], buildTime:0, neutral:true },
  tree: { name:'Tree', cost:{gold:0,wood:0}, hp:200, size:0.8, color:0x1f6b2f, supply:0, isTree:true, trains:[], buildTime:0, neutral:true },
};
