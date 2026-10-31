// Three.js utilities for the racing game
const ThreeUtils = {
  // Create a simple gradient background
  createSkyGradient: (renderer, color1, color2) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2;
    canvas.height = 512;
    
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#' + color1.toString(16).padStart(6, '0'));
    gradient.addColorStop(1, '#' + color2.toString(16).padStart(6, '0'));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  },
  
  // Create a simple kart model
  createKartModel: (color) => {
    const group = new THREE.Group();
    
    // Kart body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 2.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    group.add(body);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const wheelPositions = [
      [-0.8, 0, 1.2],
      [0.8, 0, 1.2],
      [-0.8, 0, -1.2],
      [0.8, 0, -1.2]
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.x = Math.PI / 2;
      group.add(wheel);
    });
    
    return group;
  },
  
  // Create track segments
  createTrackSegment: (x, z, width, length) => {
    const segmentGeometry = new THREE.BoxGeometry(width, 0.5, length);
    const segmentMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
    segment.position.set(x, 0, z);
    return segment;
  },
  
  // Create a simple AI kart with different behavior
  createAIKart: (index) => {
    const colors = [0xff0000, 0x0000ff, 0x00ff00];
    const kart = new ThreeUtils.createKartModel(colors[index % colors.length]);
    return kart;
  },
  
  // Create particle effect for drifting
  createDriftEffect: (position) => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.7
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particles.push(particle);
    }
    return particles;
  },
  
  // Normalize vector
  normalizeVector: (x, z) => {
    const length = Math.sqrt(x * x + z * z);
    if (length === 0) return { x: 0, z: 0 };
    return { x: x / length, z: z / length };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreeUtils;
}
if (typeof window !== 'undefined') {
  window.ThreeUtils = ThreeUtils;
}