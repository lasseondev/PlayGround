import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { LevelSystem } from '../systems/LevelSystem';
import { RapierPhysics } from '@dimforge/rapier3d-compat';

export class GameController {
  private scene: THREE.Scene;
  private levelSystem: LevelSystem;
  private physics: RapierPhysics | null = null;
  private currentBoss: THREE.Group | null = null;
  private player: THREE.Group | null = null;
  private gameLoop: number | null = null;
  private lastTime: number = 0;

  constructor() {
    this.levelSystem = new LevelSystem();
  }

  public async initialize(scene: THREE.Scene): Promise<void> {
    console.log("🎮 Initializing Dark Souls Boss Rush...");
    
    this.scene = scene;
    
    // Initialize physics
    await this.initializePhysics();
    
    // Create player character
    this.createPlayer();
    
    // Start first boss encounter
    this.startBossRush();
    
    // Start game loop
    this.startGameLoop();
    
    console.log("✅ Game initialized successfully!");
  }

  private async initializePhysics(): Promise<void> {
    try {
      this.physics = await RapierPhysics();
      console.log("⚡ Physics system initialized");
    } catch (error) {
      console.error("❌ Physics initialization failed:", error);
      throw error;
    }
  }

  private createPlayer(): void {
    this.player = new THREE.Group();
    
    // Player body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a7c59,
      shininess: 20,
      emissive: 0x112211
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.position.y = 1;
    this.player.add(body);
    
    // Player weapon
    const weaponGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
    const weaponMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7355,
      shininess: 30
    });
    const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
    weapon.position.set(0.8, 0.5, 0);
    weapon.rotation.z = Math.PI / 4;
    this.player.add(weapon);
    
    // Player shield
    const shieldGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const shieldMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a7c59,
      shininess: 10,
      transparent: true,
      opacity: 0.7
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.set(0.3, 1.2, 0);
    shield.rotation.z = Math.PI / 6;
    this.player.add(shield);
    
    this.player.position.set(0, 0, 0);
    this.scene.add(this.player);
    
    console.log("👤 Player character created");
  }

  private startBossRush(): void {
    const currentLevel = useGameStore.getState().currentLevel;
    const arena = this.levelSystem.createArena(currentLevel, this.scene);
    
    if (arena) {
      console.log(`⚔️ Starting Boss Rush: Level ${currentLevel} - ${arena.name}`);
      console.log(`📊 Boss Health: ${arena.bossHealth}");
      
      // Update game store with current boss
      useGameStore.getState().updateLevel(currentLevel);
    }
  }

  private startGameLoop(): void {
    const animate = (currentTime: number) => {
      if (this.lastTime === 0) {
        this.lastTime = currentTime;
      }
      
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      
      this.update(deltaTime);
      this.render();
      
      this.gameLoop = requestAnimationFrame(animate);
    };
    
    this.gameLoop = requestAnimationFrame(animate);
  }

  private update(deltaTime: number): void {
    // Update player movement based on input
    this.updatePlayerMovement(deltaTime);
    
    // Update physics simulation
    if (this.physics) {
      // This would update the Rapier physics world
    }
    
    // Update enemy AI
    if (this.currentBoss) {
      this.updateEnemyAI(deltaTime);
    }
    
    // Update game state
    useGameStore.getState().updatePhysics();
  }

  private updatePlayerMovement(deltaTime: number): void {
    if (!this.player) return;
    
    // Simple WASD movement
    const speed = 5 * deltaTime;
    
    if (this.isKeyPressed('KeyW')) {
      this.player.position.z -= speed;
    }
    if (this.isKeyPressed('KeyS')) {
      this.player.position.z += speed;
    }
    if (this.isKeyPressed('KeyA')) {
      this.player.position.x -= speed;
    }
    if (this.isKeyPressed('KeyD')) {
      this.player.position.x += speed;
    }
    
    // Keep player in bounds
    this.player.position.x = Math.max(-20, Math.min(20, this.player.position.x));
    this.player.position.z = Math.max(-20, Math.min(20, this.player.position.z));
  }

  private isKeyPressed(keyCode: string): boolean {
    return false; // This would check actual keyboard input
  }

  private updateEnemyAI(deltaTime: number): void {
    if (!this.currentBoss) return;
    
    // Simple AI: patrol and attack
    const playerPosition = this.player?.position;
    if (!playerPosition) return;
    
    const bossPosition = this.currentBoss.position;
    const direction = new THREE.Vector3()
      .subVectors(playerPosition, bossPosition)
      .normalize();
    
    // Move towards player
    const moveSpeed = 2 * deltaTime;
    this.currentBoss.position.addScaledVector(direction, moveSpeed);
    
    // Check for attacks
    this.checkBossAttacks(deltaTime);
  }

  private checkBossAttacks(deltaTime: number): void {
    if (!this.currentBoss) return;
    
    const attackChance = Math.random() * deltaTime * 10; // Random attack chance
    
    if (attackChance < 0.02) { // 2% chance per frame
      this.performRandomAttack();
    }
  }

  private performRandomAttack(): void {
    const attacks = ['melee', 'ranged', 'magic', 'special'];
    const attackType = attacks[Math.floor(Math.random() * attacks.length)];
    
    console.log(`👹 Boss performs ${attackType} attack!`);
    
    // Trigger parry window
    useGameStore.getState().activateParryWindow();
  }

  private render(): void {
    // This will be handled by Three.js render loop
  }

  public cleanup(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
    
    if (this.scene) {
      // Remove all objects from scene
      this.scene.clear();
    }
    
    if (this.physics) {
      this.physics.free();
    }
    
    console.log("🧹 Game cleaned up");
  }
}

export default GameController;