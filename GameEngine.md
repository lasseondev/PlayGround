# 3D RTS Game Engine - Warcraft Style

This is a 3D Real-Time Strategy game in the style of Warcraft with three distinct races:

- **Human Empire**: Knights, Archers, and magical units
- **Night Elf Alliance**: Druids, Rangers, and mystical creatures
- **Orc Horde**: Warriors, Shaman, and warlock minions

## Game Features

### Core Mechanics
- **Territory Control**: Capture and expand your territory through resource gathering and base construction
- **Unit Management**: Recruit, train, and command three unique races with distinct abilities
- **Resource Management**: Gather and manage wood, gold, and magic resources
- **Base Building**: Construct buildings, upgrades, and defenses
- **Strategic Positioning**: Command your forces from hilltops and natural barriers
- **Campaign Mode**: Progressive difficulty with story missions

### Three Races

#### Human Empire
- **Units**: Knights (melee), Archers (ranged), Wizards (magic)
- **Buildings**: Barracks, Archery Range, Wizard Tower
- **Strength**: Traditional warrior culture with balanced capabilities
- **Resources**: Gold-heavy, wood-light

#### Night Elf Alliance
- **Units**: Rangers (ranged), Druids (support), Phoenixes (flying)
- **Buildings**: Forest Lodge, Druid Circle, Tower of Elvens
- **Strength**: Magic and nature-based, healing capabilities
- **Resources**: Magic-heavy, gold-light

#### Orc Horde
- **Units**: Grunts (melee), Shamans (magic), Warlocks (dark magic)
- **Buildings**: Barracks, Shaman Hut, Warlock Tower
- **Strength**: Brutal and overwhelming, fewer but stronger units
- **Resources**: Wood-heavy, gold-medium

### Gameplay Systems

#### Camera System
- **Base View**: Over-the-shoulder tactical view
- **Map View**: 45-degree angled view showing territory
- **Strategic View**: Bird's-eye view for overall positioning

#### Control System
- **Unit Selection**: Click and drag selection
- **Queue Commands**: Set multiple orders for units
- **Group Commands**: Pre-configured group actions
- **Formation Control**: Organize units into battle formations

#### Battle System
- **Real-time Combat**: Fast-paced tactical battles
- **Unit Morale**: Units fight better when close to their base
- **Cover System**: Units can use terrain for protection
- **Resource Battle**: Defense of resource nodes

#### Economic System
- **Resource Nodes**: Gold mines, Lumber camps, Mana wells
- **Trading**: Exchange resources between players
- **Production**: Build and upgrade production facilities
- **Efficiency**: Better buildings produce faster

### Technical Specifications

#### Graphics
- **Rendering Engine**: WebGL/Three.js
- **Style**: Cartoony but detailed
- **Lighting**: Dynamic with weather effects
- **Particle Effects**: Explosions, spells, weather

#### Audio
- **Music**: Dynamic based on game state
- **Sound Effects**: Unit sounds, explosions, UI feedback
- **Voice**: Character dialogue

#### Performance
- **Target Platform**: Web browser
- **Minimum Spec**: Modern browser, 4GB RAM
- **Optimization**: Level of Detail (LOD) systems

## Build Instructions

### Prerequisites
- Node.js v18+
- WebGL-enabled browser

### Running
```bash
npm install
git submodule update --init --recursive
npm start
```

### Customizing
This is a boilerplate project - modify the source code to add your own features, content, and gameplay mechanics.

## Race Balance

The three races are intentionally balanced but have different playstyles:
- **Humans**: Well-rounded, easy to learn
- **Night Elves**: Magic and support focused
- **Orcs**: Aggressive and powerful

## Development Notes

This game is built using a modular approach allowing for:
- Easy addition of new units
- Custom map creation
- Mod support
- Editor mode for testing

The game follows Warcraft's intuitive interface design with modern graphics and responsive controls.