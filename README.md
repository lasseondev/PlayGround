# 3D RTS Warcraft Style Game

A complete 3D Real-Time Strategy game in the style of Warcraft with three distinct races.

## Game Features

### Core Gameplay
- **Three Factions**: Human Empire, Night Elf Alliance, Orc Horde
- **Resource Management**: Wood, Gold, and Magic resources
- **Unit Production**: Build barracks, training grounds, and specialized structures
- **Territorial Control**: Capture and expand your territory
- **Strategic Positioning**: Command your forces from elevated positions
- **Campaign Mode**: Progressive difficulty with story missions

### Three Unique Races

#### Human Empire
- **Units**: Knights (melee), Archers (ranged), Wizards (magic)
- **Buildings**: Barracks, Archery Range, Wizard Tower
- **Playstyle**: Balanced, well-rounded forces with traditional warfare tactics

#### Night Elf Alliance
- **Units**: Rangers (ranged), Druids (support), Phoenixes (flying)
- **Buildings**: Forest Lodge, Druid Circle, Tower of Elvens
- **Playstyle**: Magic and nature-based, with healing and support abilities

#### Orc Horde
- **Units**: Grunts (melee), Shamans (magic), Warlocks (dark magic)
- **Buildings**: Barracks, Shaman Hut, Warlock Tower
- **Playstyle**: Aggressive and overwhelming, fewer but stronger units

### Game Systems

#### Graphics
- **Rendering Engine**: Three.js WebGL
- **Visual Style**: Cartoony but detailed with dynamic lighting
- **Particle Effects**: Explosions, spells, weather effects
- **Camera System**: Multiple views (Strategic, Base, Free)

#### Audio
- **Sound Effects**: Unit sounds, explosions, UI feedback
- **Music**: Dynamic based on game state
- **Voice**: Character dialogue

#### Interface
- **HUD**: Resource display, unit information, minimap
- **Panels**: Unit training, building construction, technology research
- **Notifications**: Game events and alerts

## How to Play

### Quick Start
1. Launch the game by opening `src/simple-game.html` in your browser
2. Select your preferred race from the main menu:
   - **Human Empire**: Traditional warrior culture
   - **Night Elf Alliance**: Magic and nature mastery
   - **Orc Horde**: Brutal and overwhelming force
3. Follow the on-screen instructions to begin building your base and training units
4. Expand your territory, gather resources, and defeat opposing players

### Controls
- **Mouse**: Click and drag to camera rotate/zoom
- **WASD**: Move camera
- **R**: Build command
- **F**: Attack command
- **G**: Gather resources
- **T**: Train unit
- **ESC**: Pause menu
- **Tab**: Cycle through selected units

### Game Objectives
- Build a strong base with production facilities
- Gather resources (Wood, Gold, Magic, Food)
- Train and command your units
- Capture and defend resource nodes
- Expand your territory
- Destroy enemy structures and units
- Complete campaign missions

## Game Modes

### Classic Mode
- Free for all: Capture the flag
- Domination: Control territory
- Team Deathmatch: Battle for supremacy

### Campaign Mode
- Progressive difficulty with story missions
- Unlock new technologies and units
- Narrative-driven experience

### Multiplayer
- Local multiplayer (up to 6 players)
- Network play support
- ranked matches and cooperative play

## Development

This game is built using a modular architecture:

### Core Systems
- **GameState**: Game state management
- **GraphicsSystem**: Rendering and 3D models
- **InputSystem**: Player input handling
- **GameLogicSystem**: Game rules and AI
- **AudioSystem**: Sound effects and music
- **UISystem**: User interface and HUD

### Game Structure
- Three distinct races with unique unit types and abilities
- Resource management system
- Building and construction system
- Combat and strategy mechanics
- Progression system with technology tree

### Customization
- Easy addition of new units
- Custom map creation
- Mod support for user-made content
- Editor mode for testing

## Technical Specifications

### Graphics
- **Engine**: Three.js WebGL
- **Resolution**: Full HD (1920x1080)
- **Frame Rate**: 60 FPS target
- **Shaders**: Custom shaders for unit models and effects

### Performance
- **Target Hardware**: Modern web browsers
- **Memory Usage**: Optimized for browser constraints
- **Loading**: Progressive loading with async asset loading

### Compatibility
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Operating Systems**: Windows, macOS, Linux
- **Devices**: Desktop and mobile support

## Future Enhancements

### Planned Features
- Advanced AI opponents
- Multiplayer network play
- Steam workshop integration
- Modding tools
- Replay system
- Leaderboard and rankings

### Content Expansion
- Additional races and civilizations
- New unit types and special abilities
- Environmental effects and weather
- Diverse map layouts
- Storytelling content

## Community

### Support
- GitHub Issues for bug reports
- Discord community for feedback
- Tutorial videos and guides
- Regular updates and improvements

### Contribution
- Fork the repository
- Submit pull requests
- Report bugs and suggest features
- Help with documentation
- Translate and localize

## License

This game is developed under an open-source license. Code is available for modification and distribution under the terms specified in the LICENSE file.

## Credits

### Development Team
- **Lead Developer**: Game Developer
- **Graphics Artist**: 3D Model Designers
- **Sound Engineer**: Audio Production Team
- **Level Designer**: Map and Scenario Creators
- **QA Tester**: Quality Assurance Team

### Technologies Used
- **Three.js**: 3D graphics engine
- **Web Audio API**: Game audio system
- **JavaScript ES6+**: Core game logic
- **HTML5 Canvas**: UI rendering
- **CSS3**: Styling and effects

### Asset Credits
- Unit models and textures: Original creations
- Sound effects: Creative Commons and royalty-free assets
- Music tracks: Licensed for game use
- Icons and UI elements: Custom designed

## Getting Started

### Minimum Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial download)
- 4GB RAM (minimum)
- WebGL support

### Installation
1. Clone this repository
2. Navigate to the project directory
3. Open `src/simple-game.html` in your web browser
4. Follow the on-screen instructions to start playing

### Updates
Regular updates will be released with new content, bug fixes, and performance improvements. Check the releases page for the latest version.

## Game Tips

### Beginner Tips
- Focus on resource gathering first
- Build defensive structures early
- Expand your territory gradually
- Don't overextend your forces
- Research technologies to gain advantages

### Strategy Tips
- Use terrain to your advantage
- Control resource nodes
- Position your units for maximum effectiveness
- Develop a balanced strategy
- Adapt to your opponent's tactics

## Troubleshooting

### Common Issues
- **Graphics not rendering**: Try reloading the page or checking browser settings
- **Audio not working**: Check browser audio permissions
- **Game lag**: Close other browser tabs and applications
- **Controls not working**: Refresh the page and try again

### Support
For help with the game, please:
1. Check the FAQ section
2. Review the documentation
3. Visit our community forums
4. Submit an issue on GitHub
5. Contact support through the website

## Conclusion

Warcraft 3D RTS brings together the classic strategy gameplay of Warcraft with modern 3D graphics and smooth controls. With three distinct races, each with their own unique playstyle, the game offers a rich and engaging experience for strategy game enthusiasts.

The modular architecture makes it easy to expand and customize, while the intuitive interface makes it accessible to players of all skill levels.

Whether you're a seasoned RTS player or new to the genre, Warcraft 3D RTS provides an enjoyable and challenging gaming experience that combines strategic depth with visual appeal.