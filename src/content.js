export const RECRUIT_OPTIONS = [
  { type: 'footman', name: 'Footman', cost: 28, key: 'Z' },
  { type: 'archer', name: 'Archer', cost: 36, key: 'X' },
  { type: 'knight', name: 'Knight', cost: 64, key: 'C' },
  { type: 'cleric', name: 'Cleric', cost: 80, key: 'V' }
]

export const HERO_INFO = {
  aelric: {
    name: 'Aelric',
    title: 'The Dawnblade',
    color: '#e8c176',
    abilities: [
      {
        id: 'sunder',
        name: 'Sunder',
        icon: 'blade',
        key: '1',
        cooldown: 8,
        target: 'direction',
        range: 8,
        desc: 'A sweeping blow of dawnfire that carves through every foe in front of Aelric.'
      },
      {
        id: 'aegis',
        name: 'Aegis of Dawn',
        icon: 'shield',
        key: '2',
        cooldown: 16,
        target: 'self',
        range: 9,
        desc: 'A golden ward heals Aelric and nearby allies, then shields them from harm.'
      },
      {
        id: 'dawnbreaker',
        name: 'Dawnbreaker',
        icon: 'sun',
        key: '3',
        cooldown: 34,
        target: 'self',
        range: 9.5,
        desc: 'The Dawnblade erupts in holy fire, scorching the horde and restoring the faithful.'
      }
    ]
  },
  ysolde: {
    name: 'Ysolde',
    title: 'The Stormcaller',
    color: '#79d6e7',
    abilities: [
      {
        id: 'emberstorm',
        name: 'Emberstorm',
        icon: 'flame',
        key: '1',
        cooldown: 9,
        target: 'point',
        range: 22,
        desc: 'Calls a pillar of living flame down upon the chosen ground, burning all within.'
      },
      {
        id: 'frostnova',
        name: 'Frost Nova',
        icon: 'snow',
        key: '2',
        cooldown: 14,
        target: 'point',
        range: 20,
        desc: 'Shatters the air with glacial force, damaging and slowing enemies in the blast.'
      },
      {
        id: 'starfall',
        name: 'Starfall',
        icon: 'comet',
        key: '3',
        cooldown: 38,
        target: 'point',
        range: 24,
        desc: 'Tears the heavens open. Five burning stars fall and break the enemy line.'
      }
    ]
  }
}

export const WAVE_INFO = [
  { kicker: 'Wave I', title: 'The Ashen Vanguard', subtitle: 'The first host spills from the rift.' },
  { kicker: 'Wave II', title: 'The Hollow Legion', subtitle: 'Wraiths and brutes answer the Ashen King.' },
  { kicker: 'Final Wave', title: 'The Ashen King', subtitle: 'Malgor himself enters the Sundered Field.' }
]

export const RECRUIT_INFO = {
  footman: { name: 'Dawn Footman', short: 'Footman', role: 'Shield line', hp: 155, damage: 15, cost: 28, icon: 'sword' },
  archer: { name: 'Dawn Archer', short: 'Archer', role: 'Ranged', hp: 95, damage: 19, cost: 36, icon: 'bow' },
  knight: { name: 'Dawn Knight', short: 'Knight', role: 'Shock cavalry', hp: 320, damage: 33, cost: 64, icon: 'helm' },
  cleric: { name: 'Dawn Cleric', short: 'Cleric', role: 'Healer', hp: 120, damage: 9, cost: 80, icon: 'staff' }
}
