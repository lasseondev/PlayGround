import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from './store/gameStore';
import { GameUI } from './components/GameUI';
import GameController from './game/GameController';
import './index.css';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GameController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 1000);

    // Camera with Dark Souls-style perspective
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 1.8, 5);

    // Renderer with anti-aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;

    containerRef.current.appendChild(renderer.domElement);

    // Lighting for Dark Souls atmosphere
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Initialize game controller
    controllerRef.current = new GameController();
    
    // Initialize game
    controllerRef.current.initialize(scene)
      .then(() => {
        console.log("🎮 Dark Souls Boss Rush Initialized Successfully!");
      })
      .catch((error) => {
        console.error("❌ Game initialization failed:", error);
      });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      if (controllerRef.current) {
        controllerRef.current.cleanup();
      }
    };
  }, []);

  const { gameOver, victory, resetGame } = useGameStore();

  return (
    <div className="game-container">
      <div ref={containerRef} className="canvas-container" />
      <GameUI onRestart={resetGame} />
      
      {(gameOver || victory) && (
        <div className="game-over-screen">
          <h1>{gameOver ? "Game Over" : "Victory"}</h1>
          <p>
            {gameOver 
              ? "You were defeated by the Dark Souls bosses!"
              : "You have conquered all bosses!"
            }
          </p>
          <button onClick={resetGame} className="restart-button">
            {gameOver ? "Try Again" : "Boss Rush Again"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;