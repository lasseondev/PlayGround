# Warcraft 2D RTS Game

A browser-based 2D RTS game inspired by Warcraft, featuring three unique races: Human, Orc, and Undead.

## Overview

Warcraft 2D RTS combines the strategic depth of real-time strategy games with the classic Warcraft aesthetic and gameplay mechanics. Players command three distinct races, each with unique units, buildings, and abilities, competing for territory and victory.

## Features

### Three Unique Races

**Human**
- Specialized in balanced units and defensive structures
- Focus on technological advancement
- Access to cavalry and ranged units

**Orc**
- Aggressive melee-focused units
- Strong combat abilities and berserker units
- emphasis on raw power

**Undead**
- Control over death and decay
- Unique necrotic units and infrastructure
- Haunted abilities and resource manipulation

### Core Gameplay

- **Territory Control**: Capture and expand your territory
- **Resource Management**: Gather gold, wood, stone, and food
- **Unit Production**: Build barracks, townhalls, and specialized facilities
- **Strategic Combat**: Tactical unit deployment and combat
- **Tech Tree**: Unlock advanced units and buildings
- **Multiplayer**: Online battles against other players

### Visual & Audio

- **2D Pixel Art Style**: Warcraft-inspired graphics
- **Dynamic Lighting**: Shadow effects and atmosphere
- **Sound Design**: Immersive audio for combat, building, and victory
- **Responsive UI**: Clean, intuitive interface

## Game Mechanics

### Resources

- **Gold**: Used for unit training and building construction
- **Wood**: Required for certain buildings and upgrades
- **Stone**: Used for defensive structures and upgrades
- **Food**: Sustains your population and units

### Units

Each race has unique unit types:
- **Worker Units**: Gather resources and build structures
- **Combat Units**: Engage in battles and defend territory
- **Special Units**: Unique abilities and tactical advantages

### Buildings

- **Town Hall/Stronghold/Crypt**: Core structure for race identity
- **Barracks/Workshop**: Unit production facilities
- **Farms/Mines**: Resource gathering points
- **Defensive Structures**: Walls, towers, and fortifications

## Controls

- **Mouse**: Select units, build structures, issue commands
- **Keyboard**: Camera movement, game pause, UI shortcuts
- **Touch**: Mobile-friendly controls for touch devices

## Technical Features

### Engine Architecture

- **WebGL**: Hardware-accelerated rendering
- **Modular Design**: Extensible component system
- **State Management**: Efficient game state handling
- **Responsive Design**: Works on desktop, tablet, and mobile

### Development

- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast development server and bundling
- **CSS3**: Modern styling with animations
- **Web Audio API**: Rich audio experiences

## How to Play

1. **Choose Your Race**: Select Human, Orc, or Undead
2. **Secure Your Base**: Protect your starting territory
3. **Gather Resources**: Send workers to collect gold, wood, and stone
4. **Build Infrastructure**: Construct townhalls, barracks, and resource buildings
5. **Train Units**: Produce soldiers and specialists
6. **Expand Territory**: Attack and capture enemy resources
7. **Defend Against Attacks**: Fortify your bases and deploy defenses
8. **Victory**: Destroy enemy townhalls or achieve other victory conditions

## Development

### Prerequisites

- Node.js (v14+)
- Modern web browser with WebGL support

### Installation

```bash
git clone <repository-url>
cd warcraft-2d-rts
npm install
```

### Running the Game

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Verification

```bash
npm run verify
```

## Project Structure

```
warcraft-2d-rts/
├── src/
│   ├── core/              # Core game engine
│   │   ├── Game.js        # Main game class
│   │   ├── Engine.js      # Rendering engine
│   │   ├── InputManager.js # Input handling
│   │   ├── MapManager.js   # Map and terrain
│   │   ├── UIManager.js    # User interface
│   │   ├── AudioManager.js # Audio system
│   │   └── ResourceManager.js # Resource management
│   ├── ui/              # UI components
│   │   └── HUD.js        # Heads-up display
│   └── main.js          # Game entry point
├── scripts/            # Build and verification scripts
├── assets/            # Game assets (sprites, sounds, maps)
├── tests/             # Test suite
├── package.json       # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md          # This file
```

## Skills and Tools Used

This project leverages the OMGithub/OpenCode ecosystem:

- **OMGithub Workflow**: Automated testing and deployment
- **OpenCode Engine**: AI-assisted development
- **Gauntlet-Loop**: Iterative quality improvement
- **Three.js Skills**: For 3D asset management (if needed)

## Credits

- **Inspired by**: Warcraft series by Blizzard Entertainment
- **Developed with**: OMGithub/OpenCode platform
- **Technology**: WebGL, TypeScript, Modern JavaScript
- **Design**: Pixel art style and classic RTS mechanics

## Future Enhancements

- **Multiplayer**: Online battles and tournaments
- **Campaign Mode**: Story-driven missions
- **Custom Maps**: Player-created scenarios
- **Mod Support**: Community-created content
- **Progression**: Player leveling and achievements
- **Esports**: Competitive matchmaking and leaderboards

## License

This project is part of the OMGithub ecosystem and is licensed under the MIT License.

## Support

For issues and support, please visit the OMGithub repository or GitHub issues page.

---

*Created with ❤️ using the OMGithub/OpenCode platform for building browser games from GitHub issues.*