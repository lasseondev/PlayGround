import * as THREE from 'three';
import EnemyModels from '../models/EnemyModels';

export interface BossArena {
  id: number;
  name: string;
  environment: {
    floor: string;
    walls: string;
    lighting: string;
    obstacles: string;
  };
  spawnPoints: THREE.Vector3[];
  cameraPosition: THREE.Vector3;
  difficulty: number;
  bossHealth: number;
}

export class LevelSystem {
  private arenas: BossArena[];
  private currentArena: number = 0;

  constructor() {
    this.initializeArenas();
  }

  private initializeArenas() {
    this.arenas = [
      {
        id: 1,
        name: "Lich Arena",
        environment: {
          floor: "ice_platforms",
          walls: "frosted_glass",
          lighting: "blue_cold",
          obstacles: "none"
        },
        spawnPoints: [
          new THREE.Vector3(10, 0, 5),
          new THREE.Vector3(-10, 0, 5),
          new THREE.Vector3(0, 0, 15)
        ],
        cameraPosition: new THREE.Vector3(0, 10, 20),
        difficulty: 1,
        bossHealth: 80
      },
      {
        id: 2,
        name: "Golem Court",
        environment: {
          floor: "stone_ruins",
          walls: "massive_stone",
          lighting: "yellow_warm",
          obstacles: "collapsing_columns"
        },
        spawnPoints: [
          new THREE.Vector3(15, 0, 0),
          new THREE.Vector3(-15, 0, 0),
          new THREE.Vector3(0, 0, 10)
        ],
        cameraPosition: new THREE.Vector3(0, 8, 25),
        difficulty: 2,
        bossHealth: 120
      },
      {
        id: 3,
        name: "Skeleton Crypt",
        environment: {
          floor: "bone_paved",
          walls: "dungeon_walls",
          lighting: "purple_glow",
          obstacles: "flying_skeletons"
        },
        spawnPoints: [
          new THREE.Vector3(8, 0, 8),
          new THREE.Vector3(-8, 0, 8),
          new THREE.Vector3(0, 0, 12)
        ],
        cameraPosition: new THREE.Vector3(0, 6, 18),
        difficulty: 3,
        bossHealth: 60
      },
      {
        id: 4,
        name: "Dragon Sanctum",
        environment: {
          floor: "lava_floors",
          walls: "dragon_scales",
          lighting: "red_fire",
          obstacles: "flying_creatures"
        },
        spawnPoints: [
          new THREE.Vector3(12, 0, -5),
          new THREE.Vector3(-12, 0, -5),
          new THREE.Vector3(0, 0, 10)
        ],
        cameraPosition: new THREE.Vector3(0, 15, 30),
        difficulty: 4,
        bossHealth: 150
      },
      {
        id: 5,
        name: "Great Lord Throne Room",
        environment: {
          floor: "marble_throne",
          walls: "darkness_emissive",
          lighting: "epic_battle",
          obstacles: "minions_and_trapdoors"
        },
        spawnPoints: [
          new THREE.Vector3(20, 0, 0),
          new THREE.Vector3(-20, 0, 0),
          new THREE.Vector3(0, 0, 25)
        ],
        cameraPosition: new THREE.Vector3(0, 20, 40),
        difficulty: 5,
        bossHealth: 200
      }
    ];
  }

  createArena(arenaId: number, scene: THREE.Scene): BossArena | null {
    const arena = this.arenas.find(a => a.id === arenaId);
    if (!arena) return null;

    this.setupEnvironment(scene, arena);
    this.spawnBoss(scene, arena);
    
    return arena;
  }

  private setupEnvironment(scene: THREE.Scene, arena: BossArena) {
    // Create environment based on arena type
    switch (arena.environment.floor) {
      case "ice_platforms":
        this.createIceFloor(scene);
        break;
      case "stone_ruins":
        this.createStoneFloor(scene);
        break;
      case "bone_paved":
        this.createBoneFloor(scene);
        break;
      case "lava_floors":
        this.createLavaFloor(scene);
        break;
      case "marble_throne":
        this.createMarbleFloor(scene);
        break;
    }

    // Add environment props
    this.addArenaObstacles(scene, arena);
    this.setupLighting(scene, arena);
  }

  private spawnBoss(scene: THREE.Scene, arena: BossArena) {
    const enemyModels = new EnemyModels(scene);
    const boss = enemyModels.createBossEnemy(arena.id);
    
    // Position boss
    const spawnPoint = arena.spawnPoints[0];
    boss.position.copy(spawnPoint);
    boss.position.y = 2; // Boss height
    
    scene.add(boss);
    boss.userData.arena = arena;
    boss.userData.health = arena.bossHealth;
  }

  private createIceFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.3
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add ice crystals
    for (let i = 0; i < 50; i++) {
      const crystalGeometry = new THREE.ConeGeometry(0.5, 2, 8);
      const crystalMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      crystal.position.x = (Math.random() - 0.5) * 40;
      crystal.position.z = (Math.random() - 0.5) * 40;
      crystal.rotation.y = Math.random() * Math.PI * 2;
      scene.add(crystal);
    }
  }

  private createStoneFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x708090,
      bumpScale: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
  }

  private createBoneFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x9e9e9e,
      emissive: 0x333333
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
  }

  private createLavaFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4500,
      emissive: 0x8b0000,
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add lava particles
    for (let i = 0; i < 30; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6347,
        transparent: true,
        opacity: 0.6
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.x = (Math.random() - 0.5) * 30;
      particle.position.z = (Math.random() - 0.5) * 30;
      particle.position.y = 1;
      scene.add(particle);
    }
  }

  private createMarbleFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xd3d3d3,
      shininess: 50,
      emissive: 0x666666
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
  }

  private addArenaObstacles(scene: THREE.Scene, arena: BossArena) {
    switch (arena.environment.obstacles) {
      case "collapsing_columns":
        this.createCollapsingColumns(scene);
        break;
      case "flying_skeletons":
        this.createFlyingSkeletons(scene);
        break;
      case "flying_creatures":
        this.createFlyingCreatures(scene);
        break;
      case "minions_and_trapdoors":
        this.createMinionsAndTrapdoors(scene);
        break;
    }
  }

  private createCollapsingColumns(scene: THREE.Scene) {
    for (let i = 0; i < 5; i++) {
      const columnGeometry = new THREE.CylinderGeometry(1, 1, 10, 8);
      const columnMaterial = new THREE.MeshPhongMaterial({
        color: 0x696969,
        emissive: 0x333333
      });
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.position.x = (i - 2.5) * 10;
      column.position.z = 20;
      column.castShadow = true;
      scene.add(column);
    }
  }

  private createFlyingSkeletons(scene: THREE.Scene) {
    // Will be added later with animation system
  }

  private createFlyingCreatures(scene: THREE.Scene) {
    // Will be added later with animation system
  }

  private createMinionsAndTrapdoors(scene: THREE.Scene) {
    // Will be added later with animation system
  }

  private setupLighting(scene: THREE.Scene, arena: BossArena) {
    switch (arena.environment.lighting) {
      case "blue_cold":
        scene.children.forEach(child => {
          if (child instanceof THREE.DirectionalLight) {
            child.color.setHex(0x87ceeb);
          }
        });
        break;
      case "yellow_warm":
        scene.children.forEach(child => {
          if (child instanceof THREE.DirectionalLight) {
            child.color.setHex(0xffd700);
          }
        });
        break;
      case "purple_glow":
        scene.children.forEach(child => {
          if (child instanceof THREE.DirectionalLight) {
            child.color.setHex(0x9370db);
          }
        });
        break;
      case "red_fire":
        scene.children.forEach(child => {
          if (child instanceof THREE.DirectionalLight) {
            child.color.setHex(0xff4500);
          }
        });
        break;
      case "epic_battle":
        scene.children.forEach(child => {
          if (child instanceof THREE.DirectionalLight) {
            child.color.setHex(0xff6347);
            child.intensity = 2;
          }
        });
        break;
    }
  }

  public getCurrentArena(): BossArena {
    return this.arenas[this.currentArena];
  }

  public nextArena(): boolean {
    if (this.currentArena < this.arenas.length - 1) {
      this.currentArena++;
      return true;
    }
    return false;
  }

  public reset(): void {
    this.currentArena = 0;
  }
}

export default LevelSystem;