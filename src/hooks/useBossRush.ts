import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export const useBossRush = () => {
  const { 
    currentLevel, 
    updateLevel, 
    updateHealth,
    score,
    startGame,
    resetGame
  } = useGameStore();

  const bosses = [
    {
      id: 1,
      name: "Lich Lord",
      health: 80,
      attackPattern: "Slow, powerful magic",
      parryWindow: 0.3, // 30% chance
      reward: 500
    },
    {
      id: 2,
      name: "Golem",
      health: 120,
      attackPattern: "Charge attacks, heavy armor",
      parryWindow: 0.2, // 20% chance
      reward: 800
    },
    {
      id: 3,
      name: "Skeleton King",
      health: 60,
      attackPattern: "Ranged attacks,召唤 minions",
      parryWindow: 0.25, // 25% chance
      reward: 600
    },
    {
      id: 4,
      name: "Dragonlord",
      health: 150,
      attackPattern: "Fire breath, flying attacks",
      parryWindow: 0.15, // 15% chance
      reward: 1000
    },
    {
      id: 5,
      name: "The Great Lord",
      health: 200,
      attackPattern: "Massive, unpredictable combos",
      parryWindow: 0.1, // 10% chance
      reward: 2000
    }
  ];

  const startBossEncounter = useCallback(() => {
    const boss = bosses[currentLevel - 1];
    if (!boss) return;

    // Initialize boss encounter
    updateHealth(boss.health);
    
    // Start parry system for this boss
    const parryInterval = setInterval(() => {
      // Simulate boss attack patterns
      const attackChance = Math.random();
      
      if (attackChance < boss.parryWindow) {
        // Boss is attacking, activate parry window
        // This would trigger in the parry system
        console.log(`${boss.name} attacks! Parry now!`);
      }
    }, 2000);

    return () => clearInterval(parryInterval);
  }, [currentLevel, updateHealth, bosses]);

  const nextLevel = useCallback(() => {
    if (currentLevel < bosses.length) {
      updateLevel(currentLevel + 1);
      startBossEncounter();
    } else {
      // Game completed
      console.log("Congratulations! You defeated all bosses!");
      // Update victory state in store
    }
  }, [currentLevel, updateLevel, startBossEncounter]);

  const takeDamage = useCallback((damage: number) => {
    const newHealth = Math.max(0, (useGameStore.getState().health || 100) - damage);
    updateHealth(newHealth);
    
    if (newHealth <= 0) {
      console.log("Game Over! You were defeated.");
      // Game over would be handled in store
    }
  }, [updateHealth]);

  useEffect(() => {
    if (currentLevel > 0 && currentLevel <= bosses.length) {
      startBossEncounter();
    }
  }, [currentLevel, startBossEncounter]);

  return {
    bosses,
    currentBoss: bosses[currentLevel - 1],
    nextLevel,
    takeDamage,
    startGame,
    resetGame
  };
};