class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.masterGain = null;
    this.soundBuffers = new Map();
    this.musicBuffers = new Map();
    this.activeSources = [];
    this.listeners = [];

    this.initializeAudio();
  }

  initializeAudio() {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);

      this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);

      // Load default sounds
      this.loadDefaultSounds();
      this.loadDefaultMusic();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 Audio:', error);
      this.useHtml5Audio = true;
      this.initializeHtml5Audio();
    }
  }

  loadDefaultSounds() {
    const soundFiles = {
      'buttonClick': '/sounds/button-click.wav',
      'buildComplete': '/sounds/build-complete.wav',
      'unitCreated': '/sounds/unit-created.wav',
      'unitDie': '/sounds/unit-die.wav',
      'explosion': '/sounds/explosion.wav',
      'resourceGather': '/sounds/resource-gather.wav',
      'buyUnit': '/sounds/buy-unit.wav',
      'technologyResearch': '/sounds/technology-research.wav',
      'alert': '/sounds/alert.wav'
    };

    for (const [name, path] of Object.entries(soundFiles)) {
      this.loadSound(name, path);
    }
  }

  loadDefaultMusic() {
    const musicFiles = {
      'menu': '/music/menu-music.mp3',
      'overworld': '/music/overworld-music.mp3',
      'battle': '/music/battle-music.mp3',
      'victory': '/music/victory-music.mp3'
    };

    for (const [name, path] of Object.entries(musicFiles)) {
      this.loadMusic(name, path);
    }
  }

  loadSound(name, url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          this.soundBuffers.set(name, buffer);
          this.notifyListeners('soundLoaded', name);
        },
        (error) => {
          console.error(`Error decoding sound ${name}:`, error);
        }
      );
    };

    request.onerror = () => {
      console.error(`Error loading sound ${name}:`, request.statusText);
    };

    request.send();
  }

  loadMusic(name, url) {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', () => {
      this.musicBuffers.set(name, audio);
      this.notifyListeners('musicLoaded', name);
    });

    audio.addEventListener('error', (error) => {
      console.error(`Error loading music ${name}:`, error);
    });

    audio.src = url;
  }

  playSound(name, options = {}) {
    if (!this.audioContext || this.soundBuffers.size === 0) {
      return;
    }

    const buffer = this.soundBuffers.get(name);
    if (!buffer) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Configure gain
    gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
    if (options.volume) {
      gainNode.gain.setValueAtTime(options.volume, this.audioContext.currentTime);
    }

    // Configure pan
    if (options.pan) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.setValueAtTime(options.pan, this.audioContext.currentTime);
      gainNode.connect(panner);
      panner.connect(this.masterGain);
    }

    // Play sound
    source.start(0);

    // Track source for cleanup
    this.activeSources.push({
      source,
      gainNode,
      panner: options.pan ? panner : null,
      startTime: this.audioContext.currentTime
    });

    // Remove from active sources when done
    source.addEventListener('ended', () => {
      this.activeSources = this.activeSources.filter(active => active.source !== source);
    });
  }

  playMusic(name, options = {}) {
    if (this.useHtml5Audio) {
      this.playHtml5Music(name, options);
      return;
    }

    const audio = this.musicBuffers.get(name);
    if (!audio) {
      console.warn(`Music not found: ${name}`);
      return;
    }

    // Stop currently playing music
    this.stopAllMusic();

    // Configure volume
    audio.volume = options.volume || 1.0;

    // Play music
    audio.play();
  }

  stopAllMusic() {
    for (const music of this.musicBuffers.values()) {
      if (this.useHtml5Audio) {
        music.pause();
        music.currentTime = 0;
      } else {
        // For Web Audio API, we need to stop all sources
        for (const source of this.activeSources) {
          source.source.stop();
        }
      }
    }
  }

  setMusicVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }

    if (this.useHtml5Audio) {
      for (const music of this.musicBuffers.values()) {
        music.volume = volume;
      }
    }
  }

  setSoundVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  pauseAllAudio() {
    if (this.useHtml5Audio) {
      for (const music of this.musicBuffers.values()) {
        music.pause();
      }
    } else {
      for (const source of this.activeSources) {
        source.source.stop();
      }
    }
  }

  resumeAllAudio() {
    if (this.useHtml5Audio) {
      for (const music of this.musicBuffers.values()) {
        if (music.paused) {
          music.play();
        }
      }
    }
  }

  initializeHtml5Audio() {
    // Fallback for browsers without Web Audio API
    this.html5Audio = {};
    this.html5Music = {};

    for (const [name, buffer] of this.soundBuffers.entries()) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(buffer); // This is simplified
      this.html5Audio[name] = audio;
    }

    for (const [name, audio] of this.musicBuffers.entries()) {
      this.html5Music[name] = audio;
    }
  }

  playHtml5Sound(name, options = {}) {
    const audio = this.html5Audio[name];
    if (!audio) {
      return;
    }

    audio.volume = options.volume || 1.0;
    audio.currentTime = 0;
    audio.play();
  }

  playHtml5Music(name, options = {}) {
    // Stop currently playing music
    for (const music of Object.values(this.html5Music)) {
      music.pause();
      music.currentTime = 0;
    }

    const audio = this.html5Music[name];
    if (!audio) {
      return;
    }

    audio.volume = options.volume || 1.0;
    audio.play();
  }

  addEventListener(type, callback) {
    this.listeners.push({ type, callback });
  }

  removeEventListener(type, callback) {
    this.listeners = this.listeners.filter(
      listener => listener.type !== type || listener.callback !== callback
    );
  }

  notifyListeners(type, ...args) {
    for (const listener of this.listeners) {
      if (listener.type === type) {
        try {
          listener.callback(...args);
        } catch (error) {
          console.error(`Error in audio listener for ${type}:`, error);
        }
      }
    }
  }

  update() {
    // Update audio sources
    const currentTime = this.audioContext ? this.audioContext.currentTime : Date.now() / 1000;

    // Remove finished sources (Web Audio API only)
    if (!this.useHtml5Audio) {
      this.activeSources = this.activeSources.filter(({ source, startTime }) => {
        return currentTime < startTime + (source.buffer ? source.buffer.duration : 0);
      });
    }
  }

  dispose() {
    // Clean up audio resources
    if (this.audioContext) {
      this.audioContext.close();
    }

    // Stop all sounds and music
    this.stopAllMusic();

    // Dispose HTML5 audio elements
    if (this.useHtml5Audio) {
      for (const audio of Object.values(this.html5Audio)) {
        audio.pause();
        audio.src = '';
      }
      for (const music of Object.values(this.html5Music)) {
        music.pause();
        music.src = '';
      }
    }
  }
}

module.exports = AudioSystem;