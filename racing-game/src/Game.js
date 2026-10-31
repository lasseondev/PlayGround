class Game {
  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.container.appendChild(this.renderer.domElement);
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 30);
    this.camera.lookAt(0, 0, 0);
    
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.autoUpdate = false;
    
    this.clock = new THREE.Clock();
    
    this.karts = [];
    this.track = null;
    this.playerKart = null;
    this.keys = {};
    this.sceneManager = new Scene();
    
    this.init();
  }
  
  init() {
    this.sceneManager.setup();
    this.scene.add(this.sceneManager.getScene());
    this.setupControls();
    this.createTrack();
    this.createKart('player', 0, 0, 0, true);
    this.createKart('ai1', 10, 0, 10, false);
    this.createKart('ai2', -10, 0, 10, false);
    this.createKart('ai3', 0, 0, 20, false);
    
    // Import control handler and physics utilities
    if (typeof ControlHandler !== 'undefined') {
      this.controlHandler = new ControlHandler();
      this.controlHandler.init();
    }
    
    if (typeof PhysicsUtils !== 'undefined') {
      this.physicsUtils = PhysicsUtils;
    }
    
    this.animate();
  }
  
  setupLights() {
    // Lights are now handled by the scene manager
    // This method is kept for backward compatibility
  }
  
  createTrack() {
    // Simple track geometry
    const trackGeometry = new THREE.BoxGeometry(100, 2, 100);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    this.track = new THREE.Mesh(trackGeometry, trackMaterial);
    this.track.receiveShadow = true;
    this.track.position.y = -1;
    this.sceneManager.getScene().add(this.track);
    
    // Track edges
    const edgeGeometry = new THREE.BoxGeometry(102, 0.5, 102);
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const edges = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edges.position.y = -1.25;
    this.sceneManager.getScene().add(edges);
  }
  
  createKart(name, x, z, rotation, isPlayer) {
    const kartGroup = new THREE.Group();
    
    // Kart body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: this.getRandomColor() });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.position.y = 1;
    kartGroup.add(body);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const positions = [
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(1, 0, -1)
    ];
    
    const wheels = [];
    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.copy(pos);
      wheel.rotation.x = Math.PI / 2;
      wheel.castShadow = true;
      kartGroup.add(wheel);
      wheels.push(wheel);
    });
    
    kartGroup.position.set(x, 1, z);
    kartGroup.rotation.y = rotation;
    this.sceneManager.getScene().add(kartGroup);
    
    // Physics body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 1.5));
    const body = new CANNON.Body({
      mass: isPlayer ? 100 : 50,
      position: new CANNON.Vec3(x, 1, z),
      shape: shape
    });
    this.world.add(body);
    
    const kart = {
      name: name,
      mesh: kartGroup,
      physics: body,
      wheels: wheels,
      velocity: new THREE.Vector3(),
      boost: 0,
      isPlayer: isPlayer,
      drift: 0,
      getDrift() {
        return this.drift;
      },
      setDrift(value) {
        this.drift = Math.max(0, Math.min(100, value));
      }
    };
    
    if (isPlayer) {
      this.playerKart = kart;
    }
    
    this.karts.push(kart);
  }
  
  getRandomColor() {
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  setupEnvironment() {
    // Create ground for physics
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.add(groundBody);
  }
  
  updatePhysics(dt) {
    this.world.step(dt);
    
    // Update kart positions from physics
    this.karts.forEach(kart => {
      const mesh = kart.mesh;
      const physics = kart.physics;
      
      mesh.position.copy(physics.position);
      mesh.quaternion.copy(physics.quaternion);
      
      // Apply drift effect using physics utilities
      if (this.physicsUtils && kart.drift > 0) {
        const driftFactor = kart.drift / 100;
        const driftDirection = new CANNON.Vec3(0, 0, 1);
        driftDirection.applyQuaternion(physics.quaternion);
        
        physics.velocity.x += driftDirection.x * driftFactor * 2;
        physics.velocity.z += driftDirection.z * driftFactor * 2;
      }
      
      // Update wheels rotation based on speed
      const speed = Math.sqrt(physics.velocity.x ** 2 + physics.velocity.z ** 2);
      const rotationSpeed = speed * 0.1;
      
      kart.wheels.forEach((wheel, index) => {
        wheel.rotation.x = Math.PI / 2;
        if (speed > 0.1) {
          wheel.rotation.x += rotationSpeed * (index < 2 ? -1 : 1);
        }
      });
    });
  }
  
  updateControls(dt) {
    if (!this.playerKart) return;
    
    const kart = this.playerKart;
    const physics = kart.physics;
    const speed = Math.sqrt(physics.velocity.x ** 2 + physics.velocity.z ** 2);
    
    // Get input from control handler
    let input = { forward: 0, backward: 0, steering: 0, boost: false, drift: kart.getDrift() };
    
    if (this.controlHandler) {
      input = this.controlHandler.getPhysicsInput(dt);
      
      // Apply steering to physics
      if (input.steering !== 0) {
        physics.applyTorque(new CANNON.Vec3(0, input.steering * 100, 0));
        // Increase drift when turning and moving
        if (speed > 2) {
          kart.setDrift(kart.getDrift() + input.steering * 10 * dt);
        }
      }
    } else {
      // Fallback to direct key handling
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
        physics.applyTorque(new CANNON.Vec3(0, -50, 0));
        if (speed > 2) {
          kart.setDrift(kart.getDrift() + 10 * dt);
        }
      }
      if (this.keys['KeyD'] || this.keys['ArrowRight']) {
        physics.applyTorque(new CANNON.Vec3(0, 50, 0));
        if (speed > 2) {
          kart.setDrift(kart.getDrift() + 10 * dt);
        }
      }
    }
    
    // Forward/backward
    if (input.forward > 0) {
      physics.applyForce(new CANNON.Vec3(0, 0, input.forward * 100), physics.position);
    }
    if (input.backward < 0) {
      physics.applyForce(new CANNON.Vec3(0, 0, input.backward * 100), physics.position);
    }
    
    // Drift boost (reduce drift for speed boost)
    if (input.drift > 30 && (input.steering !== 0)) {
      const boostAmount = input.drift * 0.05 * dt;
      kart.boost = Math.min(100, kart.boost + boostAmount);
      kart.setDrift(input.drift - boostAmount * 2);
    }
    
    // Apply boost to physics
    if (kart.boost > 0) {
      const boostForce = input.drift > 50 ? 300 : 150;
      physics.velocity.x += Math.cos(physics.quaternion.y) * boostForce * dt;
      physics.velocity.z += Math.sin(physics.quaternion.y) * boostForce * dt;
      kart.boost *= 0.95;
    }
    
    // Drift decay when not turning
    if (input.drift > 0) {
      const decay = speed > 5 ? 20 : 5;
      kart.setDrift(input.drift - decay * dt);
    }
  }
  
  updateCamera() {
    if (!this.playerKart) return;
    
    const targetPosition = new THREE.Vector3()
      .copy(this.playerKart.mesh.position)
      .add(new THREE.Vector3(0, 15, 30));
    
    this.camera.position.lerp(targetPosition, 0.1);
    this.camera.lookAt(this.playerKart.mesh.position);
  }
  
  updateAI(dt) {
    this.karts.forEach(kart => {
      if (kart.isPlayer) return;
      
      const physics = kart.physics;
      const playerPos = this.playerKart.mesh.position;
      const kartPos = kart.mesh.position;
      
      const direction = new THREE.Vector3()
        .subVectors(playerPos, kartPos)
        .normalize();
      
      const distance = kartPos.distanceTo(playerPos);
      
      if (distance > 10) {
        // Move towards player
        const forceMagnitude = Math.min(50, distance / 2);
        const force = new CANNON.Vec3(direction.x * forceMagnitude, 0, direction.z * forceMagnitude);
        physics.applyForce(force, physics.position);
        
        // AI steering - better AI behavior
        const angle = Math.atan2(direction.z, direction.x);
        const currentAngle = physics.quaternion.y;
        let angleDiff = angle - currentAngle;
        
        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        physics.applyTorque(new CANNON.Vec3(0, angleDiff * 80, 0));
        
        // AI drift - more sophisticated
        const speed = Math.sqrt(physics.velocity.x ** 2 + physics.velocity.z ** 2);
        if (speed > 3 && Math.random() < 0.02) {
          const driftAmount = Math.min(50, speed * 0.5);
          kart.setDrift(kart.getDrift() + driftAmount);
        }
        
        // Sometimes do random maneuvers
        if (Math.random() < 0.005) {
          const randomTorque = (Math.random() - 0.5) * 30;
          physics.applyTorque(new CANNON.Vec3(0, randomTorque, 0));
          kart.setDrift(kart.getDrift() + 15);
        }
      } else {
        // Try to drift around in tight spaces
        if (Math.random() < 0.03) {
          const randomTorque = (Math.random() - 0.5) * 40;
          physics.applyTorque(new CANNON.Vec3(0, randomTorque, 0));
          kart.setDrift(kart.getDrift() + 20);
        }
        
        // Slow down and drift for fun
        const speed = Math.sqrt(physics.velocity.x ** 2 + physics.velocity.z ** 2);
        if (speed > 5) {
          const friction = new CANNON.Vec3(-physics.velocity.x * 0.1, 0, -physics.velocity.z * 0.1);
          physics.velocity.x += friction.x;
          physics.velocity.z += friction.z;
        }
      }
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const dt = this.clock.getDelta();
    
    this.updatePhysics(dt);
    this.updateControls(dt);
    this.updateCamera();
    this.updateAI(dt);
    
    // Update dust particles
    this.sceneManager.animateDust();
    this.sceneManager.updateDust(this.playerKart);
    
    this.renderer.render(this.sceneManager.getScene(), this.camera);
  }
}}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});