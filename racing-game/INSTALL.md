# Installation and Usage Guide

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Web browser with WebGL support
- Internet connection (for initial dependency installation)

### Step 1: Clone the Repository

```bash
# If you have the repository cloned already
cd /path/to/your/workspace/PlayGround/racing-game

# Clone the repository
# (assuming you're in /path/to/your/workspace)
git clone https://github.com/lasseondev/PlayGround.git

# Navigate to the racing-game directory
cd PlayGround/racing-game
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - three.js (3D rendering)
# - cannon-es (physics engine)
# - gsap (animation library)
# - devDependencies for development
```

### Step 3: Run the Game

```bash
# Option 1: Start the development server (recommended for development)
npm run dev

# Option 2: Start the production server
npm start

# Option 3: Build the project first
npm run build
npm run serve

# The game will be available at:
# http://localhost:3000
```

### Step 4: Play the Game

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. Click the "Start Racing!" button to begin
4. Use the controls to race against AI opponents

## Development Workflow

### Building the Project

```bash
# Build for production
npm run build

# This will:
# - Minify JavaScript files
# - Copy static assets
# - Create optimized distribution files
# - Output to the dist/ directory
```

### Running Tests

```bash
# Run all tests
npm test

# This will run:
# - Library compatibility tests
# - File structure validation
# - HTML structure checks
# - Configuration validation
```

### Development Server

```bash
# Start development server with hot reload
npm run dev

# Features:
# - Automatic file watching
# - Hot module replacement
# - Browser auto-reload
# - Real-time feedback
```

### Using the Server

```bash
# Start the static file server
npm run serve

# Available options:
# npm run serve 3001    # Use custom port
# Press Ctrl+C to stop
```

## Game Controls

### Keyboard Controls

- **W/A/S/D** or **Arrow Keys**: Move the kart
  - W/Up: Accelerate forward
  - S/Down: Brake/Reverse
  - A/Left: Steer left
  - D/Right: Steer right

- **Space**: Nitro Boost
  - Hold to activate instant boost
  - Consumes boost meter

- **Drift**: Automatic
  - Turn while moving to build drift
  - Drift increases speed
  - Hold drift for longer boosts

### Game Interface

- **Score**: Display at top-left shows your progress
- **Controls Panel**: Shows active controls (top-left)
- **Game Info**: Provides game instructions (top-right)
- **Start Screen**: Initial menu to begin racing
- **Game Over Screen**: Shows final score and restart option

## Project Structure

```
racing-game/
├── src/
│   ├── Game.js              # Main game class
│   ├── scene.js             # 3D scene management
│   ├── ThreeUtils.js        # Three.js utilities
│   ├── PhysicsUtils.js      # Physics calculations
│   ├── ControlHandler.js    # Input handling
│   ├── AudioSystem.js       # Sound system
│   └── styles.css           # Game styles
├── scripts/
│   ├── build.js            # Build script
│   ├── test.js              # Test script
│   ├── dev.js               # Development script
│   ├── serve.js             # Server script
│   ├── check-deps.js        # Dependency checker
│   └── setup.js             # Setup script
├── dist/                    # Distribution output (after build)
├── index.html              # Game HTML file
├── package.json            # Project configuration
├── README.md               # Project documentation
├── INSTALL.md              # Installation guide
└── package-lock.json       # Dependency lock file
```

## Troubleshooting

### Common Issues

#### Node.js Version Too Old
```bash
# Check your Node.js version
node --version

# If version < 18, upgrade:
# Ubuntu/Debian:
sudo apt update
sudo apt install nodejs npm

# macOS:
brew install node

# Verify installation
node --version
```

#### "npm: command not found"
```bash
# Install npm if not available
# macOS:
brew install npm

# Ubuntu/Debian:
sudo apt install npm

# Verify installation
npm --version
```

#### Browser Won't Load the Game
```bash
# Clear browser cache
# Chrome: DevTools → Application → Clear storage
# Firefox: Ctrl+Shift+Delete

# Check console for JavaScript errors
# Open DevTools (F12) and check Console tab
```

#### Game Runs But Nothing Happens
```bash
# Ensure browser has WebGL support
# Most modern browsers support WebGL2
# If issues persist, try:
# - Chrome: chrome://gpu/
# - Firefox: about:support
```

#### Build Fails
```bash
# Clean and rebuild
rm -rf dist/
npm run build

# If specific module errors:
npm install three cannon-es gsap
```

## Technical Specifications

### Engine Requirements

- **Rendering**: Three.js 0.184.0+
- **Physics**: Cannon.js 0.20.0+
- **Animation**: GSAP 3.13.0+
- **Browser**: WebGL 2.0 support

### Performance

- **Target Frame Rate**: 60 FPS
- **Resolution**: Responsive (100vw × 100vh)
- **Shadow Quality**: Medium
- **Particle Effects**: Limited for performance
- **Memory Usage**: Optimized for modern browsers

### Features

- **3D Kart Physics**: Realistic kart dynamics
- **Drift System**: Advanced drift mechanics
- **AI Opponents**: Three levels of AI difficulty
- **Score Tracking**: Progress tracking and high scores
- **Smooth Animations**: GSAP-powered animations
- **Responsive Design**: Mobile-friendly interface

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+
- ✅ Opera 47+

### Known Limitations

- **Internet Explorer**: Not supported
- **Mobile Safari**: May require specific configuration
- **Older Hardware**: Graphics quality may be reduced

## Game Development Features

### Physics System

- **Rigid Body Dynamics**: Real-world physics simulation
- **Friction Models**: Realistic tire friction
- **Collision Detection**: Accurate collision handling
- **Drift Mechanics**: Advanced drift simulation
- **Momentum Conservation**: Physics-based movement

### 3D Graphics

- **Three.js Rendering**: 3D graphics engine
- **WebGL Shaders**: Custom shaders for visual effects
- **Lighting System**: Dynamic shadows and lighting
- **Particle Effects**: Visual effects for game events
- **Model Loading**: GLTF/GLB asset support

### Game Logic

- **State Management**: Game state and transitions
- **Input Handling**: Keyboard and mouse input
- **AI Behavior**: Simple but effective AI
- **Scoring System**: Progress tracking
- **Save System**: Local storage for high scores

## Contributing

### Prerequisites

- Node.js 18+
- Git
- Text editor (VS Code recommended)

### Contribution Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test your changes**
5. **Commit your changes**
6. **Push to your branch**
7. **Create a pull request**

### Code Style

- **Use ES6+ JavaScript**
- **Follow prettier formatting**
- **Include proper error handling**
- **Write descriptive comments**
- **Add JSDoc documentation**

## License

MIT License

Copyright (c) 2025 OpenCode Agent

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgements

- **Three.js**: 3D rendering engine
- **Cannon.js**: Physics simulation
- **GSAP**: Animation library
- **OpenCode**: Development platform
- **OMGithub**: Project hosting
- **GitHub Actions**: CI/CD pipeline

## Support

### Issues and Bug Reports

- **GitHub Issues**: Submit bug reports and feature requests
- **Bug Report Template**: Use the provided bug report template
- **Feature Requests**: Suggest new features and improvements

### Getting Help

- **Documentation**: README.md and INSTALL.md
- **Community**: Project forums (if available)
- **Direct Contact**: OpenCode support

### Feedback

- **Game Feedback**: Share your experience and suggestions
- **Technical Issues**: Report bugs and technical problems
- **Feature Requests**: Request new features and improvements

## Updates and Releases

### Version History

- **v1.0.0**: Initial release
- **Features**: Basic 3D kart physics with drift
- **Status**: Stable

### Future Updates

- **v1.1.0**: Power-ups system
- **v1.2.0**: Multiplayer support
- **v1.3.0**: Online features
- **v2.0.0**: Major feature updates

## Credits

### Development Team

- **Lead Developer**: OpenCode Agent
- **3D Graphics**: Three.js engine
- **Physics**: Cannon.js engine
- **Animation**: GSAP library

### Special Thanks

- **OpenCode Community**: For inspiration and support
- **3D Asset Contributors**: For game assets
- **Testers**: For feedback and testing
- **Contributors**: For code contributions

## Copyright

This project is created and maintained by OpenCode Agent as part of the OpenCode ecosystem. All rights reserved.

## Disclaimer

This is a demo project created for demonstration purposes. The game mechanics and features are simplified for educational and development purposes. The actual gameplay may differ from traditional Mario Kart gameplay.

## Contact

For questions, suggestions, or collaboration opportunities:

- **Email**: agent@opencode.ai
- **GitHub**: [Issues and Pull Requests]
- **Project Page**: OpenCode ecosystem

---

*Project created with ❤️ by OpenCode Agent*
*Powered by Three.js, Cannon.js, and GSAP*
*Part of the OpenCode ecosystem*