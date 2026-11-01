"use strict";

import AudioManager from './AudioManager.js';

const AudioManagerInstance = new AudioManager();

let assetsLoaded = false;
let loadPromise = null;

function preloadAssets() {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Load audio assets
    const audioPromise = AudioManagerInstance.preloadAssets()
      .then(() => {
        console.log('Audio assets loaded successfully');
      })
      .catch(error => {
        console.warn('Some audio assets failed to load:', error);
      });

    // Create placeholder image assets promise
    const imagePromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log('Image assets loaded (placeholders)');
        resolve();
      }, 100);
    });

    Promise.all([audioPromise, imagePromise])
      .then(() => {
        assetsLoaded = true;
        resolve();
      })
      .catch(error => {
        console.error('Failed to load all assets:', error);
        reject(error);
      });
  });

  return loadPromise;
}

function setupAudio() {
  // Setup audio context and resume if needed
  AudioManagerInstance.resume();

  // Setup event listeners
  AudioManagerInstance.on('audioError', (error) => {
    console.warn('Audio error:', error);
  });
}

function playSound(name, options = {}) {
  AudioManagerInstance.play(name, options);
}

function playMusic(name, options = {}) {
  AudioManagerInstance.play(name, options);
}

function stopMusic() {
  AudioManagerInstance.stop();
}

function setVolume(volume) {
  AudioManagerInstance.setVolume(volume);
}

function pauseAudio() {
  AudioManagerInstance.pause();
}

function resumeAudio() {
  AudioManagerInstance.resume();
}

function getAudioManager() {
  return AudioManagerInstance;
}

function isAssetsLoaded() {
  return assetsLoaded;
}

function destroy() {
  AudioManagerInstance.destroy();
}

export {
  preloadAssets,
  setupAudio,
  playSound,
  playMusic,
  stopMusic,
  setVolume,
  pauseAudio,
  resumeAudio,
  getAudioManager,
  isAssetsLoaded,
  destroy
};

export default {
  preloadAssets,
  setupAudio,
  playSound,
  playMusic,
  stopMusic,
  setVolume,
  pauseAudio,
  resumeAudio,
  getAudioManager,
  isAssetsLoaded,
  destroy
};