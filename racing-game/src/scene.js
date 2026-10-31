class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.lights = [];
    this.particles = [];
    this.environment = 'day';
  }
  
  setup() {
    this.setupBackground();
    this.setupLights();
    this.createEnvironment();
    this.createParticles();
  }
  
  setupBackground() {
    // Sky gradient
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x87CEEB) },
        bottomColor: { value: new THREE.Color(0xE0F7FA) },
        offset: { value: 0.5 },
        exponent: { value: 0.5 }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          h = max(h, 0.0);
          h = offset + exponent * h;
          gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
        }`,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.y = -100;
    this.scene.add(sky);
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
    
    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff6600, 0.5, 100);
    pointLight1.position.set(-50, 20, 30);
    this.scene.add(pointLight1);
    this.lights.push(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00ffff, 0.3, 80);
    pointLight2.position.set(50, 20, -30);
    this.scene.add(pointLight2);
    this.lights.push(pointLight2);
  }
  
  createEnvironment() {
    // Create a simple landscape with hills
    const hillGeometry = new THREE.SphereGeometry(20, 16, 16);
    const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x45a049 });
    
    const hills = [];
    for (let i = 0; i < 10; i++) {
      const hill = new THREE.Mesh(hillGeometry, hillMaterial);
      hill.position.x = (i - 5) * 40;
      hill.position.z = -Math.random() * 100 - 50;
      hill.position.y = Math.random() * 15;
      hill.scale.set(2, 1.5, 2);
      this.scene.add(hill);
      hills.push(hill);
    }
    
    // Create some trees
    for (let i = 0; i < 15; i++) {
      this.createTree(i * 30 - 150, Math.random() * 60 - 30);
    }
  }
  
  createTree(x, z) {
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 4, z);
    this.scene.add(trunk);
    
    // Tree foliage
    const foliageGeometry = new THREE.ConeGeometry(6, 12, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, 10, z);
    this.scene.add(foliage);
  }
  
  createParticles() {
    // Create dust particles for kart movement
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0x888888,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particles);
    this.particles.push(particles);
    
    // Create dust trail at specific positions
    this.dustTrails = [];
    for (let i = 0; i < 5; i++) {
      const trailGeometry = new THREE.BufferGeometry();
      const trailMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xcccccc,
        transparent: true,
        opacity: 0.4
      });
      const trail = new THREE.Points(trailGeometry, trailMaterial);
      this.scene.add(trail);
      this.dustTrails.push(trail);
    }
  }
  
  updateDust(kart) {
    if (kart && kart.physics) {
      const pos = kart.mesh.position;
      // Add dust particles at kart position
      for (let i = 0; i < this.dustTrails.length; i++) {
        // This would be updated in the main game loop
        const trail = this.dustTrails[i];
        // In a real implementation, we'd add particles to trails
      }
    }
  }
  
  changeEnvironment(type) {
    this.environment = type;
    
    // Adjust lighting based on environment
    if (type === 'night') {
      this.lights.forEach(light => {
        if (light.isAmbientLight) {
          light.intensity = 0.1;
        } else if (light.isDirectionalLight) {
          light.intensity = 0.3;
          light.color.setHex(0x222222);
        } else if (light.isPointLight) {
          light.intensity = 0;
        }
      });
      
      // Add moon
      if (!this.moon) {
        const moonGeometry = new THREE.SphereGeometry(5, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffaa,
          emissive: 0xffffaa,
          emissiveIntensity: 0.5
        });
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.moon.position.set(100, 50, -100);
        this.scene.add(this.moon);
      }
    } else {
      // Restore day lighting
      this.lights.forEach(light => {
        if (light.isAmbientLight) {
          light.intensity = 0.3;
        } else if (light.isDirectionalLight) {
          light.intensity = 1.0;
          light.color.setHex(0xffffff);
        } else if (light.isPointLight) {
          light.intensity = 0.5;
          light.color.setHex(0xff6600);
        }
      });
      
      if (this.moon) {
        this.scene.remove(this.moon);
        this.moon = null;
      }
    }
  }
  
  updateTimeOfDay(hours) {
    const time = hours % 24;
    
    if (time >= 6 && time < 18) {
      this.changeEnvironment('day');
    } else {
      this.changeEnvironment('night');
    }
  }
  
  animateDust() {
    // Animate dust particles
    this.particles.forEach(particles => {
      particles.rotation.y += 0.001;
    });
  }
  
  getScene() {
    return this.scene;
  }
}}

export { Scene };