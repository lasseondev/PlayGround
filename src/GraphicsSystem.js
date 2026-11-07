class GraphicsSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = null;
    this.lights = [];
    this.models = new Map();
    this.textures = new Map();
    this.particleSystems = [];

    // Initialize graphics
    this.initializeGraphics();
  }

  initializeGraphics() {
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    // Configure renderer
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Setup scene
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);

    // Setup lighting
    this.setupLighting();

    // Setup camera
    this.setupCamera();

    // Initialize models
    this.initializeModels();
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);

    // Point lights for special effects
    const pointLight1 = new THREE.PointLight(0xff6b6b, 0.5, 100);
    pointLight1.position.set(50, 30, 20);
    this.scene.add(pointLight1);
    this.lights.push(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.5, 100);
    pointLight2.position.set(-50, 30, 20);
    this.scene.add(pointLight2);
    this.lights.push(pointLight2);
  }

  setupCamera() {
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
  }

  initializeModels() {
    // Create unit models
    this.createHumanUnits();
    this.createNightElfUnits();
    this.createOrcUnits();

    // Create structure models
    this.createStructures();

    // Create environment models
    this.createEnvironment();
  }

  createHumanUnits() {
    // Knight model
    const knightGeometry = new THREE.BoxGeometry(0.8, 2.0, 0.8);
    const knightMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
    const knight = new THREE.Mesh(knightGeometry, knightMaterial);
    knight.castShadow = true;
    knight.receiveShadow = true;
    this.models.set('knight', knight);

    // Archer model
    const archerGeometry = new THREE.BoxGeometry(0.6, 1.8, 0.6);
    const archerMaterial = new THREE.MeshLambertMaterial({ color: 0x7fdb8d });
    const archer = new THREE.Mesh(archerGeometry, archerMaterial);
    archer.castShadow = true;
    archer.receiveShadow = true;
    this.models.set('archer', archer);

    // Wizard model
    const wizardGeometry = new THREE.BoxGeometry(0.7, 2.2, 0.7);
    const wizardMaterial = new THREE.MeshLambertMaterial({ color: 0xd65381 });
    const wizard = new THREE.Mesh(wizardGeometry, wizardMaterial);
    wizard.castShadow = true;
    wizard.receiveShadow = true;
    this.models.set('wizard', wizard);
  }

  createNightElfUnits() {
    // Ranger model
    const rangerGeometry = new THREE.BoxGeometry(0.7, 2.0, 0.7);
    const rangerMaterial = new THREE.MeshLambertMaterial({ color: 0x95e77e });
    const ranger = new THREE.Mesh(rangerGeometry, rangerMaterial);
    ranger.castShadow = true;
    ranger.receiveShadow = true;
    this.models.set('ranger', ranger);

    // Druid model
    const druidGeometry = new THREE.BoxGeometry(0.8, 2.2, 0.8);
    const druidMaterial = new THREE.MeshLambertMaterial({ color: 0x56cfe1 });
    const druid = new THREE.Mesh(druidGeometry, druidMaterial);
    druid.castShadow = true;
    druid.receiveShadow = true;
    this.models.set('druid', druid);

    // Phoenix model
    const phoenixGeometry = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const phoenixMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b35 });
    const phoenix = new THREE.Mesh(phoenixGeometry, phoenixMaterial);
    phoenix.castShadow = true;
    phoenix.receiveShadow = true;
    this.models.set('phoenix', phoenix);
  }

  createOrcUnits() {
    // Grunt model
    const gruntGeometry = new THREE.BoxGeometry(0.9, 2.0, 0.9);
    const gruntMaterial = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
    const grunt = new THREE.Mesh(gruntGeometry, gruntMaterial);
    grunt.castShadow = true;
    grunt.receiveShadow = true;
    this.models.set('grunt', grunt);

    // Shaman model
    const shamanGeometry = new THREE.BoxGeometry(0.8, 2.1, 0.8);
    const shamanMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const shaman = new THREE.Mesh(shamanGeometry, shamanMaterial);
    shaman.castShadow = true;
    shaman.receiveShadow = true;
    this.models.set('shaman', shaman);

    // Warlock model
    const warlockGeometry = new THREE.BoxGeometry(0.7, 2.3, 0.7);
    const warlockMaterial = new THREE.MeshLambertMaterial({ color: 0x8e44ad });
    const warlock = new THREE.Mesh(warlockGeometry, warlockMaterial);
    warlock.castShadow = true;
    warlock.receiveShadow = true;
    this.models.set('warlock', warlock);
  }

  createStructures() {
    // Human structures
    const humanBarracksGeometry = new THREE.BoxGeometry(4, 3, 4);
    const humanBarracksMaterial = new THREE.MeshLambertMaterial({ color: 0x3a5885 });
    const humanBarracks = new THREE.Mesh(humanBarracksGeometry, humanBarracksMaterial);
    humanBarracks.castShadow = true;
    humanBarracks.receiveShadow = true;
    this.models.set('humanBarracks', humanBarracks);

    const humanArcheryRangeGeometry = new THREE.BoxGeometry(5, 3, 6);
    const humanArcheryRangeMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    const humanArcheryRange = new THREE.Mesh(humanArcheryRangeGeometry, humanArcheryRangeMaterial);
    humanArcheryRange.castShadow = true;
    humanArcheryRange.receiveShadow = true;
    this.models.set('humanArcheryRange', humanArcheryRange);

    // Night Elf structures
    const elfLodgeGeometry = new THREE.BoxGeometry(4, 3, 4);
    const elfLodgeMaterial = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
    const elfLodge = new THREE.Mesh(elfLodgeGeometry, elfLodgeMaterial);
    elfLodge.castShadow = true;
    elfLodge.receiveShadow = true;
    this.models.set('elfLodge', elfLodge);

    // Orc structures
    const orcBarracksGeometry = new THREE.BoxGeometry(4, 3, 4);
    const orcBarracksMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const orcBarracks = new THREE.Mesh(orcBarracksGeometry, orcBarracksMaterial);
    orcBarracks.castShadow = true;
    orcBarracks.receiveShadow = true;
    this.models.set('orcBarracks', orcBarracks);
  }

  createEnvironment() {
    // Tree geometry
    const treeGeometry = new THREE.ConeGeometry(0.5, 3, 4);
    const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
    const tree = new THREE.Mesh(treeGeometry, treeMaterial);
    tree.castShadow = true;
    this.models.set('tree', tree);

    // Rock geometry
    const rockGeometry = new THREE.IcosahedronGeometry(1, 1);
    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x546a7b });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.castShadow = true;
    this.models.set('rock', rock);
  }

  update() {
    // Update lights
    this.updateLighting();

    // Update particle systems
    for (const particleSystem of this.particleSystems) {
      particleSystem.update();
    }
  }

  updateLighting() {
    // Update sun position based on time of day
    const sunLight = this.lights[1]; // Directional light
    if (sunLight) {
      const timeOfDay = window.game.gameState.gameWorld.time.timeOfDay;
      if (timeOfDay === 'morning') {
        sunLight.position.set(100, 80, 50);
        sunLight.intensity = 0.8;
      } else if (timeOfDay === 'afternoon') {
        sunLight.position.set(50, 100, 0);
        sunLight.intensity = 1.0;
      } else if (timeOfDay === 'evening') {
        sunLight.position.set(-50, 60, -50);
        sunLight.intensity = 0.6;
      } else if (timeOfDay === 'night') {
        sunLight.position.set(-20, 20, -20);
        sunLight.intensity = 0.3;

        // Add night effects
        this.scene.fog.color.setHex(0x0a0a2e);
        this.scene.background = new THREE.Color(0x0a0a2e);
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  createParticleSystem(type, position, options) {
    // Import ParticleSystem from external file
    const externalParticleSystem = new ParticleSystem(this.scene, this.camera);
    
    // Create appropriate particle effect based on type
    switch (type) {
      case 'explosion':
        return externalParticleSystem.createExplosion(position, options);
      case 'fire':
        return externalParticleSystem.createFire(position, options);
      case 'smoke':
        return externalParticleSystem.createSmoke(position, options);
      default:
        return null;
    }
  }

  dispose() {
    // Clean up resources
    this.renderer.dispose();

    for (const model of this.models.values()) {
      if (model.geometry) model.geometry.dispose();
      if (model.material) {
        if (Array.isArray(model.material)) {
          for (const material of model.material) {
            material.dispose();
          }
        } else {
          model.material.dispose();
        }
      }
    }

    for (const texture of this.textures.values()) {
      texture.dispose();
    }
  }
}

class ParticleSystem {
  constructor(type, position, options = {}) {
    this.type = type;
    this.position = position.clone();
    this.options = options;
    this.particles = [];
    this.lifetime = 0;
    this.duration = options.duration || 5000;
    this.particleCount = options.particleCount || 100;

    this.initializeParticles();
  }

  initializeParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    const lifespans = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = this.position.x;
      positions[i3 + 1] = this.position.y;
      positions[i3 + 2] = this.position.z;

      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;

      sizes[i] = Math.random() * 0.5 + 0.5;
      lifespans[i] = Math.random() * this.duration;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifespans, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        center: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.mesh = new THREE.Points(geometry, material);
    this.mesh.position.copy(this.position);

    return this.mesh;
  }

  update() {
    this.lifetime += 16; // Assuming 60fps

    const geometry = this.mesh.geometry;
    const positions = geometry.getAttribute('position');
    const colors = geometry.getAttribute('color');
    const sizes = geometry.getAttribute('size');
    const lifespans = geometry.getAttribute('lifespan');

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Update particle position based on type
      if (this.type === 'explosion') {
        const age = this.lifespan % this.duration;
        const factor = age / this.duration;

        positions[i3] = this.position.x + (Math.random() - 0.5) * factor * 10;
        positions[i3 + 1] = this.position.y + factor * 5 + Math.sin(factor * Math.PI * 2) * 2;
        positions[i3 + 2] = this.position.z + (Math.random() - 0.5) * factor * 10;
      }

      // Update colors based on age
      const age = this.lifetime % this.duration;
      const lifeRatio = 1.0 - (age / this.duration);

      colors[i3] = lifeRatio * 1.0;
      colors[i3 + 1] = lifeRatio * 1.0;
      colors[i3 + 2] = lifeRatio * 1.0;

      // Update sizes
      sizes[i] = (Math.random() * 0.5 + 0.5) * lifeRatio;
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    sizes.needsUpdate = true;

    // Update shader uniforms
    this.mesh.material.uniforms.time.value = this.lifetime;

    // Remove particle system if expired
    if (this.lifetime > this.duration && window.game) {
      window.game.gameSystems.graphics.particleSystems = window.game.gameSystems.graphics.particleSystems.filter(
        system => system !== this
      );
    }
  }

  getVertexShader() {
    return `
      attribute float size;
      attribute float lifespan;
      varying vec3 vColor;

      uniform float time;
      uniform vec3 center;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (300.0 / length(mvPosition.xyz));
      }
    `;
  }

  getFragmentShader() {
    return `
      varying vec3 vColor;
      uniform float time;

      void main() {
        float alpha = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - vec2(0.5)));
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `;
  }
}

module.exports = { GraphicsSystem };