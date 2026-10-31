# 3D Mario Kart Style Racer

A physics-based 3D racing game inspired by Mario Kart with realistic drifting mechanics and competitive gameplay.

## Overview

Experience the thrill of 3D kart racing with advanced physics simulation, smooth drifting controls, and exciting competition against AI opponents. The game features realistic physics, beautiful graphics, and an immersive arcade racing experience.

## Key Features

- **Advanced Physics System**: Real-world kart dynamics with accurate handling and physics
- **Drift Mechanics**: Turn while moving to build up drift and boost speed
- **Multiple Karts**: Choose from different karts with unique characteristics
- **AI Opponents**: Compete against intelligent AI with varying difficulty levels
- **Smooth Graphics**: Real-time rendering with Three.js and Cannon.js physics
- **Responsive Controls**: Full keyboard support with intuitive controls
- **Power-ups**: Collect power-ups for temporary advantages (coming soon)
- **Score System**: Track your progress and compete for high scores

## Controls

- **W/A/S/D** or **Arrow Keys**: Move the kart forward/backward and steering
- **Space**: Nitro Boost (hold for instant boost)
- **Drift**: Automatic when turning while moving (hold to build drift)

## Game Modes

- **Arcade**: Quick race with all karts
- **Time Trial**: Race against the clock for best time
- **Single Player**: Challenge against AI opponents
- **Multiplayer**: Up to 4 players (upcoming)

## Technical Details

- **Engine**: Three.js (3D rendering) + Cannon.js (physics)
- **Physics**: Real-world car dynamics with drift simulation
- **Graphics**: Real-time shadows, lighting, and smooth animations
- **Platform**: Web-based (works on desktop browsers)

## Installation

```bash
cd racing-game
npm install
npm start
```

## Running the Game

Open `index.html` in your browser to play the game directly, or use the development server:

```bash
npm run dev
```

## Development

- **Source files**: `src/`
- **Build output**: `dist/`
- **Documentation**: See `docs/`

## Future Improvements

- [x] Basic kart physics with drifting
- [x] AI opponents with simple behavior
- [x] Smooth 3D graphics with Three.js
- [x] Responsive keyboard controls
- [ ] Add power-ups (stars, shells, bananas)
- [ ] Implement multiplayer support
- [ ] Add more tracks and karts
- [ ] Create multiplayer lobby system
- [ ] Add achievement system
- [ ] Include sound effects and music
- [ ] Add particle effects and visual effects
- [ ] Implement online leaderboards
- [ ] Create mobile-friendly controls

## Technical Architecture

### Core Systems

1. **Game.js**: Main game class managing game loop, physics, and rendering
2. **Scene.js**: 3D scene management with lighting and environment
3. **ThreeUtils.js**: Three.js utility functions for 3D objects
4. **PhysicsUtils.js**: Physics calculations and drift mechanics
5. **ControlHandler.js**: Input handling and player controls
6. **AudioSystem.js**: Sound effects and background music

### Physics Engine

- **Cannon.js**: Rigid body physics simulation
- **Drift Simulation**: Advanced drift mechanics with friction and momentum
- **Collision Detection**: Realistic collision handling
- **Wheel Physics**: Basic wheel rotation and contact

### 3D Rendering

- **Three.js**: 3D graphics rendering
- **Lighting**: Dynamic lighting with shadows
- **Environment**: Dynamic skybox and terrain
- **Particle Effects**: Visual effects for drifting and boosts

### Game Logic

- **AI Behavior**: Simple path following and steering AI
- **Score System**: Track progress and achievements
- **Game States**: Start screen, gameplay, and game over
- **Input Handling**: Keyboard input with responsive controls

## Credits

- **Game Engine**: Three.js, Cannon.js, GSAP
- **Physics Simulation**: Custom kart dynamics with drift
- **AI**: Basic path following and steering behavior
- **Graphics**: Real-time 3D rendering with shadows and lighting
- **Sound**: Integrated audio system with sound effects

## License

MIT License - Feel free to modify and distribute!

## Support

This project uses OpenCode and the load-sketchfab-threejs skill for 3D asset management and browser-based verification.

## Development Notes

### Build Process

1. **Development**: Use `npm run dev` to start the development server with hot reload
2. **Build**: Use `npm run build` to create production-ready files
3. **Test**: Use `npm test` to run unit tests
4. **Lint**: Use `npm run lint` to check code quality (when configured)

### Dependencies

- `three`: 3D rendering engine
- `cannon-es`: Physics engine
- `gsap`: Animation library
- `vite`: Development server (optional)
- `terser`: JavaScript minifier

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+
- Mobile browsers with WebGL support

### Performance Optimization

- Object pooling for particles and effects
- Level-of-detail (LOD) system
- Shadow quality settings
- GPU instancing for repeated objects
- Efficient collision detection

## Future Roadmap

### Phase 1 (Complete)
- [x] Basic kart physics
- [x] Drift mechanics
- [x] AI opponents
- [x] 3D graphics
- [x] Sound system
- [x] Responsive controls

### Phase 2 (In Progress)
- [ ] Power-ups system
- [ ] Multiplayer support
- [ ] More tracks
- [ ] Visual effects
- [ ] Soundtracks

### Phase 3 (Future)
- [ ] Online multiplayer
- [ ] Leaderboards
- [ ] Game save states
- [ ] Steam achievements
- [ ] Mobile optimization