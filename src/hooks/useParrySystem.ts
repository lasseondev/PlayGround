import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export const useParrySystem = () => {
  const { 
    activateParryWindow, 
    triggerParry, 
    updateHealth,
    score,
    currentLevel
  } = useGameStore();

  // Parry input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Parry key (Space bar)
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        
        // Check if parry window is active
        const parryWindowActive = Math.random() < 0.3; // 30% chance for parry window
        
        if (parryWindowActive) {
          // Successful parry
          triggerParry();
          
          // Parried attack - reduce damage taken
          const parryDamageReduction = 0.7; // 70% damage reduction
          const newHealth = Math.max(0, 100 - (currentLevel * 5 * parryDamageReduction));
          updateHealth(newHealth);
          
          // Increase score for successful parry
          const newScore = score + 100;
          // Note: score update would be handled in the store
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activateParryWindow, triggerParry, updateHealth, score, currentLevel]);

  // Parry window system (enemy attacks)
  useEffect(() => {
    const parryInterval = setInterval(() => {
      if (Math.random() < 0.02) { // 2% chance per frame
        activateParryWindow();
      }
    }, 1000); // Check every second

    return () => clearInterval(parryInterval);
  }, [activateParryWindow]);

  return {
    // Parry system functions
  };
};