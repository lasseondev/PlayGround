"use strict";

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioBufferCache = {};
    this.gainNode = null;
    this.masterGain = null;
    this.eventHandlers = {};
    this.soundEffects = {};
    this.musicTracks = {};

    this.initializeAudioContext();
    this.setupSoundEffects();
  }

  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7;

      console.log('Audio context initialized successfully');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.audioContext = null;
    }
  }

  setupSoundEffects() {
    this.soundEffects = {
      click: { url: 'assets/sounds/click.wav', volume: 0.5 },
      build: { url: 'assets/sounds/build.wav', volume: 0.6 },
      attack: { url: 'assets/sounds/attack.wav', volume: 0.7 },
      die: { url: 'assets/sounds/die.wav', volume: 0.5 },
      gameover: { url: 'assets/sounds/gameover.wav', volume: 0.8 },
      music: { url: 'assets/sounds/music.wav', volume: 0.3 }
    };
  }

  async loadSound(name, url) {
    if (!this.audioContext) return null;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.audioBufferCache[name] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load sound '${name}':`, error);
      return null;
    }
  }

  preloadAssets() {
    const promises = [];

    Object.entries(this.soundEffects).forEach(([name, config]) => {
      if (name !== 'music') { // Don't preload music for now
        promises.push(this.loadSound(name, config.url));
      }
    });

    return Promise.all(promises);
  }

  playSound(name, options = {}) {
    if (!this.audioContext) return;

    const buffer = this.audioBufferCache[name];
    if (!buffer) {
      console.warn(`Sound '${name}' not loaded`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = options.volume !== undefined ? options.volume : this.soundEffects[name].volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);

    // Clean up
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
    };
  }

  playMusic(name, options = {}) {
    if (!this.audioContext) return;

    const buffer = this.audioBufferCache[name];
    if (!buffer) {
      console.warn(`Music track '${name}' not loaded`);
      return;
    }

    // Stop any currently playing music
    if (this.currentMusicSource) {
      this.currentMusicSource.stop();
      this.currentMusicSource = null;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = options.volume !== undefined ? options.volume : this.soundEffects[name].volume;

    source.loop = options.loop || false;
    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
    this.currentMusicSource = source;

    // Auto-cleanup
    if (!source.loop) {
      source.onended = () => {
        this.currentMusicSource = null;
      };
    }
  }

  stopMusic() {
    if (this.currentMusicSource) {
      this.currentMusicSource.stop();
      this.currentMusicSource = null;
    }
  }

  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  pause() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }

  // Event handling
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  off(event, callback) {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(callback);
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in audio handler for '${event}':`, error);
        }
      });
    }
  }

  destroy() {
    this.audioBufferCache = {};
    this.eventHandlers = {};
    this.soundEffects = {};
    this.musicTracks = {};

    if (this.currentMusicSource) {
      this.currentMusicSource.stop();
      this.currentMusicSource = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // Public API
  play(name, options = {}) {
    if (name === 'music') {
      this.playMusic(name, options);
    } else {
      this.playSound(name, options);
    }
  }

  stop() {
    this.stopMusic();
  }
}

export default AudioManager;