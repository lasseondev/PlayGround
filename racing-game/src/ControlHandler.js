// Control handler for the racing game
const ControlHandler = {
  // Player input state
  input: {
    forward: 0,
    backward: 0,
    steering: 0,
    boost: false,
    drift: 0
  },
  
  // Keyboard mapping
  keyMap: {
    'KeyW': 'forward',
    'ArrowUp': 'forward',
    'KeyS': 'backward',
    'ArrowDown': 'backward',
    'KeyA': 'steeringLeft',
    'ArrowLeft': 'steeringLeft',
    'KeyD': 'steeringRight',
    'ArrowRight': 'steeringRight',
    'Space': 'boost'
  },
  
  // Initialize controls
  init(container = document) {
    this.container = container;
    this.setupKeyboardListeners();
  },
  
  // Set up keyboard event listeners
  setupKeyboardListeners() {
    this.container.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.container.addEventListener('keyup', (e) => this.handleKeyUp(e));
  },
  
  // Handle key down events
  handleKeyDown(e) {
    const action = this.keyMap[e.code];
    if (action) {
      e.preventDefault();
      
      switch (action) {
        case 'forward':
          this.input.forward = 1;
          break;
        case 'backward':
          this.input.backward = -0.5;
          break;
        case 'steeringLeft':
          this.input.steering = Math.max(-1, this.input.steering - 0.2);
          break;
        case 'steeringRight':
          this.input.steering = Math.min(1, this.input.steering + 0.2);
          break;
        case 'boost':
          this.input.boost = true;
          break;
      }
    }
  },
  
  // Handle key up events
  handleKeyUp(e) {
    const action = this.keyMap[e.code];
    if (action) {
      e.preventDefault();
      
      switch (action) {
        case 'forward':
          if (this.input.backward === 1) this.input.backward = 0;
          break;
        case 'backward':
          if (this.input.backward === -0.5) this.input.backward = 0;
          break;
        case 'steeringLeft':
          if (this.input.steering < 0) this.input.steering = Math.min(0, this.input.steering + 0.2);
          break;
        case 'steeringRight':
          if (this.input.steering > 0) this.input.steering = Math.max(0, this.input.steering - 0.2);
          break;
        case 'boost':
          this.input.boost = false;
          break;
      }
    }
  },
  
  // Get input for physics simulation
  getPhysicsInput(dt) {
    // Calculate drift based on steering and speed
    const speed = Math.sqrt(this.input.forward ** 2 + this.input.backward ** 2);
    const steeringForce = Math.abs(this.input.steering);
    
    // Drift only when moving and steering
    if (speed > 0.1 && steeringForce > 0.1) {
      this.input.drift = Math.min(100, this.input.drift + (steeringForce * 20 * dt));
    } else {
      // Decay drift when not steering
      this.input.drift = Math.max(0, this.input.drift - (10 * dt));
    }
    
    return {
      forward: this.input.forward,
      backward: this.input.backward,
      steering: this.input.steering,
      boost: this.input.boost,
      drift: this.input.drift
    };
  },
  
  // Reset input
  reset() {
    this.input = {
      forward: 0,
      backward: 0,
      steering: 0,
      boost: false,
      drift: 0
    };
  },
  
  // Get current input state
  getInput() {
    return { ...this.input };
  },
  
  // Check if any input is active
  isAnyInputActive() {
    return this.input.forward !== 0 || 
           this.input.backward !== 0 || 
           this.input.steering !== 0 || 
           this.input.boost || 
           this.input.drift > 0;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ControlHandler;
}
if (typeof window !== 'undefined') {
  window.ControlHandler = ControlHandler;
}