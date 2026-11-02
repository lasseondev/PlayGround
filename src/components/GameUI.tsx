import React from 'react';
import { useGameStore } from '../store/gameStore';

interface GameUIProps {
  onRestart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ onRestart }) => {
  const { 
    health, 
    maxHealth, 
    gameOver, 
    victory,
    parryActive
  } = useGameStore();

  if (gameOver) {
    return (
      <div className="game-over">
        <h1>Game Over</h1>
        <p>You were defeated by the bosses</p>
        <button onClick={onRestart} className="restart-button">
          Try Again
        </button>
      </div>
    );
  }

  if (victory) {
    return (
      <div className="victory-screen">
        <h1>Victory!</h1>
        <p>You have conquered all bosses</p>
        <button onClick={onRestart} className="restart-button">
          Boss Rush Again
        </button>
      </div>
    );
  }

  return (
    <div className="ui-overlay">
      <div className="health-container">
        <div 
          className="health-bar" 
          style={{ width: `${(health / maxHealth) * 100}%` }}
        />
        <div className="health-text">
          Health: {health}/{maxHealth}
        </div>
      </div>
      
      <div className={`parry-indicator ${parryActive ? 'active' : ''}`}>
        {parryActive ? 'PARRY NOW!' : 'Ready to Parry'}
      </div>
      
      <div className="boss-progress">
        <div 
          className="progress-fill" 
          style={{ width: `${((useGameStore.getState().currentLevel || 1) / 5) * 100}%` }}
        />
      </div>
      
      <div className="instructions">
        <p>SPACE - Parry Attack</p>
        <p>A/D - Move</p>
        <p>W - Block</p>
      </div>
    </div>
  );
};