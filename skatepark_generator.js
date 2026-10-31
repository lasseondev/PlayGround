// Tony Hawk Skate Park 3D Generator
// This script generates 3D geometry for the Tony Hawk skate park
define(`TonyHawkSkateParkGenerator, {
  init() {
    this.materials = {
      ridingSurface: new THREE.MeshPhongMaterial({
        color: 0x404040,
        shininess: 10,
        roughness: 0.8
      }),
      rails: new THREE.MeshPhongMaterial({
        color: 0x606060,
        shininess: 30
      }),
      concrete: new THREE.MeshPhongMaterial({
        color: 0x505050,
        shininess: 5
      })
    };
    
    this.createPark();
  },
  
  createPark() {
    this.group = new THREE.Group();
    
    // Main riding surface
    this.createRidingSurface();
    
    // Entrance rail
    this.createEntranceRail();
    
    // Vertical ramp
    this.createVerticalRamp();
    
    // Half pipe
    this.createHalfPipe();
    
    // Flatbar complex
    this.createFlatbarComplex();
    
    return this.group;
  },
  
  createRidingSurface() {
    const geometry = new THREE.BoxGeometry(50, 1, 40);
    const surface = new THREE.Mesh(geometry, this.materials.ridingSurface);
    surface.position.set(0, 0, 0);
    this.group.add(surface);
  },
  
  createEntranceRail() {
    const railGeometry = new THREE.BoxGeometry(20, 0.1, 0.5);
    const rail = new THREE.Mesh(railGeometry, this.materials.rails);
    rail.position.set(0, 1, 5);
    this.group.add(rail);
  },
  
  createVerticalRamp() {
    // Vertical wall
    const wallGeometry = new THREE.BoxGeometry(15, 12, 5);
    const wall = new THREE.Mesh(wallGeometry, this.materials.concrete);
    wall.position.set(25, 6, 20);
    this.group.add(wall);
    
    // K-gap cut-out
    const gapGeometry = new THREE.BoxGeometry(1, 2, 1);
    const gap = new THREE.Mesh(gapGeometry, this.materials.ridingSurface);
    gap.position.set(25 + 7.5, 3, 22.5);
    this.group.add(gap);
  },
  
  createHalfPipe() {
    const curvePoints = [];
    for (let i = 0; i <= 32; i++) {
      const angle = (i * Math.PI) / 32;
      curvePoints.push(new THREE.Vector3(
        Math.cos(angle) * 8,
        0,
        Math.sin(angle) * 8
      ));
    }
    
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeometry = new THREE.TubeGeometry(
      curve, 32, 6, 8, false
    );
    
    const tube = new THREE.Mesh(tubeGeometry, this.materials.ridingSurface);
    tube.position.set(40, 0, 35);
    tube.rotation.y = Math.PI / 2;
    this.group.add(tube);
  },
  
  createFlatbarComplex() {
    const railGeometry = new THREE.BoxGeometry(25, 0.15, 0.8);
    const flatbar = new THREE.Mesh(railGeometry, this.materials.rails);
    flatbar.position.set(10, 2, 40);
    this.group.add(flatbar);
  }
});

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TonyHawkSkateParkGenerator;
}