// Audio system for the racing game
const AudioSystem = {
  audioContext: null,
  masterVolume: 0.7,
  sounds: {},
  backgroundMusic: null,
  
  // Initialize audio system
  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.resume();
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  },
  
  // Load and play sound effect
  playSound(soundName, options = {}) {
    if (!this.audioContext) return;
    
    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Sound ${soundName} not found`);
      return;
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = sound;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = options.volume || 1;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);
    
    if (options.loop) {
      source.loop = true;
      this.backgroundMusic = source;
    }
  },
  
  // Create a simple engine sound
  createEngineSound() {
    if (!this.audioContext) return;
    
    const createOscillator = (frequency, type = 'sine') => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      return oscillator;
    };
    
    // Create engine sound with multiple oscillators
    const osc1 = createOscillator(80, 'sawtooth');
    const osc2 = createOscillator(120, 'sawtooth');
    const osc3 = createOscillator(200, 'triangle');
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    osc1.start();
    osc2.start();
    osc3.start();
    
    // Create engine animation
    let speed = 80;
    const engineAnimation = () => {
      osc1.frequency.setValueAtTime(speed, this.audioContext.currentTime);
      osc2.frequency.setValueAtTime(speed * 1.5, this.audioContext.currentTime);
      osc3.frequency.setValueAtTime(speed * 2.5, this.audioContext.currentTime);
      
      speed += (Math.random() - 0.5) * 10;
      speed = Math.max(60, Math.min(150, speed));
      
      requestAnimationFrame(engineAnimation);
    };
    
    engineAnimation();
    
    return { osc1, osc2, osc3, gainNode };
  },
  
  // Play drift sound
  playDriftSound() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  },
  
  // Play boost sound
  playBoostSound() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  },
  
  // Play collision sound
  playCollisionSound() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  },
  
  // Play background music
  playBackgroundMusic() {
    if (!this.audioContext) return;
    
    this.playSound('background', { loop: true });
  },
  
  // Set master volume
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioSystem;
}
if (typeof window !== 'undefined') {
  window.AudioSystem = AudioSystem;
}