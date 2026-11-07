// Particle System for game effects
const THREE = require('three');

class ParticleSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.particleSystems = [];
    this.renderer = null;
  }

  createExplosion(position, options = {}) {
    const particleCount = options.particleCount || 50;
    const radius = options.radius || 10;
    const duration = options.duration || 2000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * radius;
      const speed = Math.random() * 5 + 2;

      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = height;
      velocities[i3 + 2] = Math.sin(angle) * speed;

      colors[i3] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;

      sizes[i] = Math.random() * 2 + 1;
      lifetimes[i] = Math.random() * duration;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifetimes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        center: { value: new THREE.Vector3(0, 0, 0) },
        explosionPosition: { value: position.clone() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        attribute float lifespan;
        uniform float time;
        uniform vec3 explosionPosition;
        varying vec3 vColor;
        varying float vAge;

        void main() {
          vAge = (time * 1000.0) % lifespan / lifespan;
          vec3 pos = position + velocity * (time * 1000.0);
          vec3 transformed = (modelViewMatrix * vec4(pos, 1.0)).xyz;
          
          gl_Position = projectionMatrix * transformed;
          gl_PointSize = size * (300.0 / length(transformed)) * (1.0 - vAge);
          
          vColor = color;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAge;
        uniform float time;

        void main() {
          float alpha = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - vec2(0.5)));
          alpha *= (1.0 - vAge);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    this.scene.add(particles);

    const particleSystem = {
      mesh: particles,
      startTime: performance.now(),
      duration: duration,
      remove() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
      }
    };

    this.particleSystems.push(particleSystem);
    return particleSystem;
  }

  createFire(position, options = {}) {
    const particleCount = options.particleCount || 30;
    const duration = options.duration || 3000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    // Initialize fire particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      velocities[i3] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 1] = Math.random() * 2 + 0.5;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

      // Fire colors (red to orange to yellow)
      const colorPhase = Math.random();
      if (colorPhase < 0.33) {
        colors[i3] = 1.0;
        colors[i3 + 1] = colorPhase / 0.33 * 0.3;
        colors[i3 + 2] = 0.0;
      } else if (colorPhase < 0.66) {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.3 + (colorPhase - 0.33) / 0.33 * 0.4;
        colors[i3 + 2] = 0.0;
      } else {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.7 + (colorPhase - 0.66) / 0.34 * 0.3;
        colors[i3 + 2] = 0.0;
      }

      sizes[i] = Math.random() * 2 + 0.5;
      lifetimes[i] = Math.random() * duration;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifetimes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        center: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        attribute float lifespan;
        uniform float time;
        varying vec3 vColor;
        varying float vAge;

        void main() {
          vAge = (time * 1000.0) % lifespan / lifespan;
          vec3 pos = position + velocity * (time * 1000.0);
          pos.y += Math.sin(time * 5.0 + position.x) * 0.5;
          
          vec3 transformed = (modelViewMatrix * vec4(pos, 1.0)).xyz;
          
          gl_Position = projectionMatrix * transformed;
          gl_PointSize = size * (300.0 / length(transformed)) * (1.0 - vAge * 0.5);
          
          vColor = color;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAge;

        void main() {
          float alpha = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - vec2(0.5)));
          alpha *= (1.0 - vAge * 0.5);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    this.scene.add(particles);

    const particleSystem = {
      mesh: particles,
      startTime: performance.now(),
      duration: duration,
      remove() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
      }
    };

    this.particleSystems.push(particleSystem);
    return particleSystem;
  }

  createSmoke(position, options = {}) {
    const particleCount = options.particleCount || 20;
    const duration = options.duration || 5000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    // Initialize smoke particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = Math.random() * 0.5 + 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;

      // Gray smoke colors
      const gray = Math.random() * 0.5 + 0.3;
      colors[i3] = gray;
      colors[i3 + 1] = gray;
      colors[i3 + 2] = gray;

      sizes[i] = Math.random() * 3 + 1;
      lifetimes[i] = Math.random() * duration;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifetimes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        center: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        attribute float lifespan;
        uniform float time;
        varying vec3 vColor;
        varying float vAge;

        void main() {
          vAge = (time * 1000.0) % lifespan / lifespan;
          vec3 pos = position + velocity * (time * 1000.0);
          pos.y += time * 0.5; // Rising smoke
          
          vec3 transformed = (modelViewMatrix * vec4(pos, 1.0)).xyz;
          
          gl_Position = projectionMatrix * transformed;
          gl_PointSize = size * (300.0 / length(transformed)) * (1.0 - vAge * 0.8);
          
          vColor = color;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAge;

        void main() {
          float alpha = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - vec2(0.5)));
          alpha *= (1.0 - vAge * 0.8);
          gl_FragColor = vec4(vColor, alpha * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    this.scene.add(particles);

    const particleSystem = {
      mesh: particles,
      startTime: performance.now(),
      duration: duration,
      remove() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
      }
    };

    this.particleSystems.push(particleSystem);
    return particleSystem;
  }

  update() {
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;

    // Update each particle system
    for (let i = this.particleSystems.length - 1; i >= 0; i--) {
      const particleSystem = this.particleSystems[i];
      const mesh = particleSystem.mesh;
      const geometry = mesh.geometry;

      // Update shader uniforms
      if (mesh.material.uniforms && mesh.material.uniforms.time) {
        mesh.material.uniforms.time.value = elapsed / 1000;
      }

      // Check if particle system has expired
      if (elapsed > particleSystem.duration) {
        particleSystem.remove();
        this.particleSystems.splice(i, 1);
      }
    }
  }

  dispose() {
    // Clean up all particle systems
    for (const particleSystem of this.particleSystems) {
      particleSystem.remove();
    }
    this.particleSystems = [];
  }
}

module.exports = ParticleSystem;