import { create } from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  // Game state
  isGameStarted: boolean;
  currentLevel: number;
  currentBoss: number;
  score: number;
  health: number;
  maxHealth: number;
  
  // Parry system
  parryActive: boolean;
  parryCooldown: number;
  lastParryTime: number;
  
  // Physics
  physicsInitialized: boolean;
  
  // UI
  gameOver: boolean;
  victory: boolean;
  
  // Actions
  startGame: () => void;
  updateLevel: (level: number) => void;
  updateHealth: (health: number) => void;
  triggerParry: () => void;
  activateParryWindow: () => void;
  initializePhysics: () => Promise<void>;
  updatePhysics: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  isGameStarted: false,
  currentLevel: 1,
  currentBoss: 1,
  score: 0,
  health: 100,
  maxHealth: 100,
  parryActive: false,
  parryCooldown: 0,
  lastParryTime: 0,
  physicsInitialized: false,
  gameOver: false,
  victory: false,

  // Actions
  startGame: () => set({ 
    isGameStarted: true, 
    health: 100, 
    currentLevel: 1, 
    score: 0,
    gameOver: false,
    victory: false
  }),

  updateLevel: (level) => set({ 
    currentLevel: level,
    currentBoss: level,
    health: 100
  }),

  updateHealth: (health) => set({ 
    health,
    ...(health <= 0 && { gameOver: true })
  }),

  triggerParry: () => set((state) => ({
    parryActive: true,
    lastParryTime: Date.now(),
    parryCooldown: 2000 // 2 second cooldown
  })),

  activateParryWindow: () => set({ 
    parryActive: true,
    parryCooldown: 0
  }),

  initializePhysics: async () => {
    // This will be called when the physics engine is ready
    set({ physicsInitialized: true });
  },

  updatePhysics: () => {
    const state = get();
    
    // Update parry cooldown
    if (state.parryCooldown > 0) {
      set({ 
        parryCooldown: Math.max(0, state.parryCooldown - 16) // 60fps update
      });
    }
    
    // Auto-deactivate parry after timing
    if (state.parryActive && Date.now() - state.lastParryTime > 500) {
      set({ parryActive: false });
    }
  },

  resetGame: () => set({
    isGameStarted: false,
    currentLevel: 1,
    currentBoss: 1,
    score: 0,
    health: 100,
    parryActive: false,
    parryCooldown: 0,
    lastParryTime: 0,
    gameOver: false,
    victory: false
  })
}));