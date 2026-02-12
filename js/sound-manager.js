/* =========================================
   SOUND MANAGER - Audio Pooling System
   Iron Man STEM Mission Interface
   High-performance audio for transitions
   ========================================= */

class SoundManager {
  constructor() {
    // Audio pools for frequently-used sounds
    this.pools = {};
    this.poolSize = 3;

    // Master volume controls
    this.volumes = {
      master: 1.0,
      effects: 0.75,
      voice: 1.0,
      ambient: 0.5
    };

    // Mute state
    this.muted = false;

    // Audio context for precise timing
    this.audioContext = null;

    // Sound definitions - ALL MAPPED TO ACTUAL WAV FILES
    // Updated: Removed references to non-existent files
    this.sounds = {
      // =========================================
      // UI FEEDBACK
      // =========================================
      'ui-click': { src: 'audio/sfx/ui-click.wav', volume: 0.6, pool: true },
      'ui-hover': { src: 'audio/sfx/ui-hover.wav', volume: 0.4, pool: true },
      'ui-type': { src: 'audio/sfx/ui-type.wav', volume: 0.3, pool: true },

      // =========================================
      // ARC REACTOR
      // =========================================
      'arc-charge': { src: 'audio/sfx/arc-charge.wav', volume: 0.8, pool: false },
      'arc-reactor-pulse': { src: 'audio/sfx/arc-reactor-pulse.wav', volume: 0.7, pool: true },
      'arc-reactor-hum': { src: 'audio/sfx/arc-reactor-hum.wav', volume: 0.3, pool: false, loop: true },

      // =========================================
      // TRANSITIONS
      // =========================================
      'ripple-whoosh': { src: 'audio/sfx/ripple-whoosh.wav', volume: 0.6, pool: true },
      'scan-sweep': { src: 'audio/sfx/scan-sweep.wav', volume: 0.5, pool: true },
      'glitch-heavy': { src: 'audio/sfx/glitch-heavy.wav', volume: 0.6, pool: true },
      'glitch-static': { src: 'audio/sfx/glitch-static.wav', volume: 0.5, pool: true },
      'data-stream': { src: 'audio/sfx/data-stream.wav', volume: 0.4, pool: true },
      'data-scroll': { src: 'audio/sfx/data-scroll.wav', volume: 0.4, pool: true },
      'text-slam': { src: 'audio/sfx/text-slam.wav', volume: 0.7, pool: true },

      // =========================================
      // MATH FEEDBACK (JARVIS)
      // =========================================
      'access-granted': { src: 'audio/sfx/access-granted.wav', volume: 0.7, pool: true },
      'wrong-answer': { src: 'audio/sfx/wrong-answer.wav', volume: 0.6, pool: true },
      'hint-chime': { src: 'audio/sfx/hint-chime.wav', volume: 0.6, pool: true },

      // =========================================
      // SCIENCE FEEDBACK (NICK FURY)
      // =========================================
      'science-correct': { src: 'audio/sfx/science-correct.wav', volume: 0.7, pool: true },
      'science-wrong': { src: 'audio/sfx/science-wrong.wav', volume: 0.6, pool: true },
      'warning': { src: 'audio/sfx/warning.wav', volume: 0.7, pool: false },

      // =========================================
      // BLACK WIDOW
      // =========================================
      'widow-appearance': { src: 'audio/sfx/widow-appearance.wav', volume: 0.7, pool: false },

      // =========================================
      // DRAMATIC MOMENTS
      // =========================================
      'breach-complete': { src: 'audio/sfx/breach-complete.wav', volume: 0.8, pool: false },
      'segment-fill': { src: 'audio/sfx/segment-fill.wav', volume: 0.6, pool: true },
      'the-avengers-theme': { src: 'audio/sfx/The Avengers Theme.wav', volume: 0.8, pool: false }
    };

    // Preloaded sounds
    this.preloaded = new Map();

    // Currently playing loops
    this.activeLoops = new Map();

    // Active non-pooled audio (for stopAll)
    this.activeAudio = new Set();

    console.log('[SoundManager] Initialized with 23 sounds');
  }

  /* =========================================
     INITIALIZATION
     ========================================= */

  // Initialize audio context (call on user interaction)
  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('[SoundManager] AudioContext initialized');
      } catch (e) {
        console.warn('[SoundManager] AudioContext not available:', e);
      }
    }

    // Resume context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Initialize pools for pooled sounds
    this._initPools();

    return this;
  }

  // Initialize audio pools
  _initPools() {
    Object.entries(this.sounds).forEach(([name, config]) => {
      if (config.pool) {
        this.pools[name] = [];
        for (let i = 0; i < this.poolSize; i++) {
          const audio = new Audio();
          audio.src = config.src;
          audio.preload = 'auto';
          audio.volume = config.volume * this.volumes.effects * this.volumes.master;
          this.pools[name].push({
            audio,
            inUse: false
          });
        }
      }
    });
    console.log('[SoundManager] Audio pools initialized');
  }

  /* =========================================
     PRELOADING
     ========================================= */

  // Preload a specific sound
  preload(name) {
    const config = this.sounds[name];
    if (!config) {
      console.warn(`[SoundManager] Unknown sound: ${name}`);
      return Promise.resolve();
    }

    if (this.preloaded.has(name)) {
      return Promise.resolve(this.preloaded.get(name));
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.preloaded.set(name, audio);
        resolve(audio);
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn(`[SoundManager] Failed to preload ${name}:`, e);
        resolve(null); // Don't reject - graceful degradation
      }, { once: true });

      audio.src = config.src;
    });
  }

  // Preload all sounds
  preloadAll() {
    const promises = Object.keys(this.sounds).map(name => this.preload(name));
    return Promise.all(promises);
  }

  // Preload critical sounds for fast playback
  preloadCritical() {
    const critical = [
      'ui-click',
      'access-granted',
      'wrong-answer',
      'ripple-whoosh',
      'arc-reactor-pulse',
      'breach-complete',
      'warning',
      'widow-appearance'
    ];
    return Promise.all(critical.map(name => this.preload(name)));
  }

  /* =========================================
     PLAYBACK
     ========================================= */

  // Play a sound
  play(name, options = {}) {
    if (this.muted) return null;

    const config = this.sounds[name];
    if (!config) {
      console.warn(`[SoundManager] Unknown sound: ${name}`);
      return null;
    }

    const {
      volume = 1.0,
      rate = 1.0,
      delay = 0,
      loop = config.loop || false
    } = options;

    // Use pool if available
    if (config.pool && this.pools[name]) {
      return this._playFromPool(name, config, { volume, rate, delay, loop });
    }

    // Otherwise create new audio instance
    return this._playNew(name, config, { volume, rate, delay, loop });
  }

  // Play from audio pool
  _playFromPool(name, config, options) {
    const pool = this.pools[name];

    // Find available audio in pool
    let slot = pool.find(s => !s.inUse);

    // If all in use, use the first one (will cut off)
    if (!slot) {
      slot = pool[0];
      slot.audio.pause();
      slot.audio.currentTime = 0;
    }

    const audio = slot.audio;
    slot.inUse = true;

    // Configure
    audio.volume = Math.min(1, config.volume * options.volume * this.volumes.effects * this.volumes.master);
    audio.playbackRate = options.rate;
    audio.loop = options.loop;

    // Handle completion
    const onEnded = () => {
      slot.inUse = false;
      audio.removeEventListener('ended', onEnded);
    };
    audio.addEventListener('ended', onEnded);

    // Play with optional delay
    if (options.delay > 0) {
      setTimeout(() => {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('[SoundManager] Play failed:', e));
      }, options.delay * 1000);
    } else {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('[SoundManager] Play failed:', e));
    }

    return audio;
  }

  // Play new audio instance
  _playNew(name, config, options) {
    const audio = new Audio(config.src);

    // Configure - loops use ambient volume, one-shots use effects volume
    const volumeCategory = options.loop ? this.volumes.ambient : this.volumes.effects;
    audio.volume = Math.min(1, config.volume * options.volume * volumeCategory * this.volumes.master);
    audio.playbackRate = options.rate;
    audio.loop = options.loop;

    // Track loops
    if (options.loop) {
      this.activeLoops.set(name, audio);
    } else {
      // Track non-loop audio for stopAll()
      this.activeAudio.add(audio);
      audio.addEventListener('ended', () => {
        this.activeAudio.delete(audio);
      }, { once: true });
    }

    // Play with optional delay
    if (options.delay > 0) {
      setTimeout(() => {
        audio.play().catch(e => console.warn('[SoundManager] Play failed:', e));
      }, options.delay * 1000);
    } else {
      audio.play().catch(e => console.warn('[SoundManager] Play failed:', e));
    }

    return audio;
  }

  // Play a sequence of sounds
  playSequence(sequence) {
    let totalDelay = 0;
    const audios = [];

    sequence.forEach(item => {
      const { name, delay = 0, options = {} } = item;
      totalDelay += delay;

      options.delay = totalDelay;
      const audio = this.play(name, options);
      if (audio) audios.push(audio);

      // Add duration for next sound
      const config = this.sounds[name];
      if (config && item.duration) {
        totalDelay += item.duration;
      }
    });

    return audios;
  }

  /* =========================================
     LOOP CONTROL
     ========================================= */

  // Start a looping sound
  startLoop(name, options = {}) {
    options.loop = true;
    return this.play(name, options);
  }

  // Stop a looping sound
  stopLoop(name, fadeTime = 0.5) {
    const audio = this.activeLoops.get(name);
    if (!audio) return;

    if (fadeTime > 0) {
      // Fade out
      const startVolume = audio.volume;
      const steps = 20;
      const stepTime = (fadeTime * 1000) / steps;
      const volumeStep = startVolume / steps;

      let step = 0;
      const fadeInterval = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVolume - (volumeStep * step));

        if (step >= steps) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
          this.activeLoops.delete(name);
        }
      }, stepTime);
    } else {
      audio.pause();
      audio.currentTime = 0;
      this.activeLoops.delete(name);
    }
  }

  // Stop all loops
  stopAllLoops(fadeTime = 0.5) {
    this.activeLoops.forEach((audio, name) => {
      this.stopLoop(name, fadeTime);
    });
  }

  /* =========================================
     VOLUME CONTROL
     ========================================= */

  // Set master volume
  setMasterVolume(volume) {
    this.volumes.master = Math.max(0, Math.min(1, volume));
    this._updatePoolVolumes();
    this._updateLoopVolumes();
  }

  // Set effects volume
  setEffectsVolume(volume) {
    this.volumes.effects = Math.max(0, Math.min(1, volume));
    this._updatePoolVolumes();
    this._updateLoopVolumes();
  }

  // Set voice volume
  setVoiceVolume(volume) {
    this.volumes.voice = Math.max(0, Math.min(1, volume));
  }

  // Set ambient volume
  setAmbientVolume(volume) {
    this.volumes.ambient = Math.max(0, Math.min(1, volume));
    this._updateLoopVolumes();
  }

  // Update pool volumes
  _updatePoolVolumes() {
    Object.entries(this.pools).forEach(([name, pool]) => {
      const config = this.sounds[name];
      pool.forEach(slot => {
        slot.audio.volume = config.volume * this.volumes.effects * this.volumes.master;
      });
    });
  }

  // Update loop volumes (uses ambient volume, not effects)
  _updateLoopVolumes() {
    this.activeLoops.forEach((audio, name) => {
      const config = this.sounds[name];
      if (config) {
        audio.volume = config.volume * this.volumes.ambient * this.volumes.master;
      }
    });
  }

  /* =========================================
     MUTE CONTROL
     ========================================= */

  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;

    if (this.muted) {
      this.stopAllLoops(0);
      // Mute all pool audios
      Object.values(this.pools).forEach(pool => {
        pool.forEach(slot => {
          slot.audio.pause();
          slot.inUse = false;
        });
      });
    }

    return this.muted;
  }

  // Set mute state
  setMute(muted) {
    this.muted = muted;
    if (muted) {
      this.stopAllLoops(0);
    }
  }

  /* =========================================
     UTILITY METHODS
     ========================================= */

  // Get sound duration
  getDuration(name) {
    const preloaded = this.preloaded.get(name);
    if (preloaded) {
      return preloaded.duration;
    }
    return 0;
  }

  // Check if a sound exists
  hasSound(name) {
    return !!this.sounds[name];
  }

  // Stop all sounds (loops, pools, and non-pooled audio)
  stopAll(fadeTime = 0) {
    console.log('[SoundManager] Stopping all audio' + (fadeTime ? ' (' + fadeTime + 's fade)' : ''));

    // Stop all loops (handles its own fading)
    this.stopAllLoops(fadeTime);

    // Collect all non-loop audio elements to stop
    const audios = [];

    Object.values(this.pools).forEach(pool => {
      pool.forEach(slot => {
        if (slot.inUse) {
          audios.push(slot.audio);
          slot.inUse = false;
        }
      });
    });

    this.activeAudio.forEach(audio => audios.push(audio));
    this.activeAudio.clear();

    if (fadeTime > 0 && audios.length > 0) {
      const steps = 20;
      const stepTime = (fadeTime * 1000) / steps;
      audios.forEach(audio => {
        const startVolume = audio.volume;
        const volumeStep = startVolume / steps;
        let step = 0;
        const fadeInterval = setInterval(() => {
          step++;
          audio.volume = Math.max(0, startVolume - (volumeStep * step));
          if (step >= steps) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0;
          }
        }, stepTime);
      });
    } else {
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }

  // Cleanup
  destroy() {
    this.stopAll();
    this.pools = {};
    this.preloaded.clear();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Global instance
const soundManager = new SoundManager();

// Initialize on first user interaction
document.addEventListener('click', () => {
  soundManager.init();
}, { once: true });

// Connect to volume sliders if they exist
document.addEventListener('DOMContentLoaded', () => {
  const ambientSlider = document.getElementById('slider-ambient');
  const effectsSlider = document.getElementById('slider-effects');
  const voiceSlider = document.getElementById('slider-voice');

  if (ambientSlider) {
    ambientSlider.addEventListener('input', (e) => {
      soundManager.setAmbientVolume(e.target.value / 100);
    });
  }

  if (effectsSlider) {
    effectsSlider.addEventListener('input', (e) => {
      soundManager.setEffectsVolume(e.target.value / 100);
    });
  }

  if (voiceSlider) {
    voiceSlider.addEventListener('input', (e) => {
      soundManager.setVoiceVolume(e.target.value / 100);
    });
  }
});

console.log('[SoundManager] Module loaded');
