// Main entry point for the Mario Kart 3D Racer game
// This file serves as the TypeScript entry point for the project

// Import main game modules
import Game from './Game.js';
import { Scene } from './scene.js';
import { ThreeUtils } from './ThreeUtils.js';
import { PhysicsUtils } from './PhysicsUtils.js';
import { ControlHandler } from './ControlHandler.js';
import { AudioSystem } from './AudioSystem.js';

// Export all game components for easy access
export {
    Game,
    Scene,
    ThreeUtils,
    PhysicsUtils,
    ControlHandler,
    AudioSystem
};

// Game initialization function
function initializeGame() {
    console.log('Initializing Mario Kart 3D Racer...');
    
    // Check for required modules
    const requiredModules = {
        Game,
        Scene,
        ThreeUtils,
        PhysicsUtils,
        ControlHandler,
        AudioSystem
    };
    
    for (const [name, module] of Object.entries(requiredModules)) {
        if (module === null || module === undefined) {
            throw new Error(`Required module ${name} is not available`);
        }
    }
    
    // Initialize audio system
    AudioSystem.init();
    
    // Create and start the game
    const game = new Game();
    
    console.log('Mario Kart 3D Racer initialized successfully!');
    return game;
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const game = initializeGame();
            
            // Store game instance globally for debugging
            window.game = game;
            
            console.log('🎮 Mario Kart 3D Racer is ready!');
        } catch (error) {
            console.error('❌ Failed to initialize game:', error.message);
            
            // Display error message on screen
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                max-width: 80%;
                text-align: center;
                z-index: 9999;
            `;
            errorDiv.innerHTML = `
                <h2>Game Error</h2>
                <p>${error.message}</p>
                <button onclick="this.parentElement.remove()" style="
                    padding: 10px 20px;
                    background: white;
                    color: red;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">Dismiss</button>
            `;
            document.body.appendChild(errorDiv);
        }
    });
}

// Export initialization function
export { initializeGame };

// Development helper functions
if (process.env.NODE_ENV === 'development') {
    // Development mode helpers
    window.debugGame = {
        getGame: () => window.game,
        getScene: () => window.game?.sceneManager?.getScene(),
        getKarts: () => window.game?.karts || [],
        resetGame: () => {
            if (window.game) {
                console.log('Resetting game...');
                // Game reset logic would go here
            }
        },
        toggleDebug: () => {
            console.log('Debug mode toggled');
            // Debug mode toggle logic would go here
        }
    };
    
    console.log('🔧 Development mode enabled. Use window.debugGame for debugging.');
}

// Performance monitoring
if (typeof performance !== 'undefined') {
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'Game') {
                console.log('📊 Game Performance:', entry);
            }
        }
    });
    
    try {
        performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
        console.log('Performance monitoring not available');
    }
}

console.log('🎮 Mario Kart 3D Racer TypeScript module loaded successfully');