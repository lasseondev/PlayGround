import * as THREE from 'three';

export class EnemyModels {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createBossEnemy(bossId: number): THREE.Group {
    const boss = new THREE.Group();
    boss.userData.bossId = bossId;

    // Create boss body (Dark Souls style)
    const bodyGeometry = new THREE.BoxGeometry(2, 3, 1.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x404040,
      shininess: 30,
      emissive: 0x111111
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    boss.add(body);

    // Create boss head (helmet)
    const headGeometry = new THREE.BoxGeometry(1.8, 1.5, 1.2);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x606060,
      shininess: 20,
      emissive: 0x222222
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    head.castShadow = true;
    boss.add(head);

    // Create boss weapon (axe for melee, staff for ranged)
    const weaponGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
    const weaponMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      shininess: 40
    });
    const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
    weapon.position.set(1.5, 1, 0);
    boss.add(weapon);

    // Create boss armor plates
    this.createArmorPlates(boss);

    // Add boss-specific effects based on ID
    this.addBossSpecificEffects(boss, bossId);

    return boss;
  }

  private createArmorPlates(boss: THREE.Group) {
    // Create plate armor pieces
    const plateGeometry = new THREE.BoxGeometry(2.2, 0.5, 1.7);
    const plateMaterial = new THREE.MeshPhongMaterial({
      color: 0x505050,
      shininess: 15,
      emissive: 0x111111
    });

    const plates = [
      { position: new THREE.Vector3(0, 1.5, 0.8) },
      { position: new THREE.Vector3(0, 2.2, 0.8) },
      { position: new THREE.Vector3(0, 3, 0.8) }
    ];

    plates.forEach((plate) => {
      const armorPlate = new THREE.Mesh(plateGeometry, plateMaterial);
      armorPlate.position.copy(plate.position);
      armorPlate.castShadow = true;
      boss.add(armorPlate);
    });
  }

  private addBossSpecificEffects(boss: THREE.Group, bossId: number) {
    switch (bossId) {
      case 1: // Lich Lord
        this.addLichEffects(boss);
        break;
      case 2: // Golem
        this.addGolemEffects(boss);
        break;
      case 3: // Skeleton King
        this.addSkeletonEffects(boss);
        break;
      case 4: // Dragonlord
        this.addDragonEffects(boss);
        break;
      case 5: // The Great Lord
        this.addLordEffects(boss);
        break;
    }
  }

  private addLichEffects(boss: THREE.Group) {
    // Add ice particles around Lich
    const iceParticleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const iceMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < 10; i++) {
      const particle = new THREE.Mesh(iceParticleGeometry, iceMaterial);
      particle.position.x = (Math.random() - 0.5) * 3;
      particle.position.y = Math.random() * 2;
      particle.position.z = (Math.random() - 0.5) * 3;
      boss.add(particle);
    }
  }

  private addGolemEffects(boss: THREE.Group) {
    // Add stone texture and rust spots
    boss.children.forEach(child => {
      if (child instanceof THREE.Mesh && child !== boss.children[0]) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0x708090,
          shininess: 25,
          emissive: 0x222222
        });
      }
    });
  }

  private addSkeletonEffects(boss: THREE.Group) {
    // Make skeleton look undead
    boss.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0x556b2f,
          shininess: 10,
          emissive: 0x334411
        });
      }
    });
  }

  private addDragonEffects(boss: THREE.Group) {
    // Add flame particles
    const flameGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 15; i++) {
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.x = (Math.random() - 0.5) * 2;
      flame.position.y = 1 + Math.random() * 2;
      flame.position.z = (Math.random() - 0.5) * 2;
      boss.add(flame);
    }
  }

  private addLordEffects(boss: THREE.Group) {
    // Add dark energy aura
    const auraGeometry = new THREE.SphereGeometry(3, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a0e4e,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    boss.add(aura);
  }
}

export default EnemyModels;