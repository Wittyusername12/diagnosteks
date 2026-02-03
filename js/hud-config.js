/**
 * hud-config.js - Central Configuration Object for Iron Man STEM Mission
 *
 * This file provides the master configuration for all animation, timing,
 * color, and mission parameters. Exposed as window.HUD_CONFIG for global access.
 *
 * Reference: Iron_Man_STEM_Mission_Project_Brief_v3.md
 * - Phase 2.5: GSAP Animation & Transition Engine
 * - Foundation (Days 1-3): "Implement HUD_CONFIG central configuration object"
 */

window.HUD_CONFIG = {
  /**
   * Color palette for the HUD interface
   * Reference: Brief Section "Visual Resource Tiers" and "PART 2: FURY SCIENCE SCREEN"
   */
  colors: {
    // Primary Jarvis/Stark cyan - used throughout the interface
    cyan: '#00d4ff',
    cyanDim: '#0099cc',
    cyanGlow: 'rgba(0, 212, 255, 0.3)',

    // Dark backgrounds
    dark: '#0a0a0a',
    panelBg: '#0d1117',

    // Fury/SHIELD red theme - Brief Section "PART 2: FURY SCIENCE SCREEN"
    furyRed: '#ff3333',
    furyRedDim: '#cc0000',
    furyRedGlow: 'rgba(255, 51, 51, 0.3)',

    // Feedback colors
    correctGreen: '#00ff00',
    wrongRed: '#ff3333',

    // Alert/warning states
    warningAmber: '#ffcc00',

    // Black Widow transmissions
    widowGreen: '#00ff88',

    // Text colors
    white: '#ffffff',
    textPrimary: '#e0e0e0',
    textSecondary: '#888888'
  },

  /**
   * Animation timing durations (in seconds unless noted)
   * Reference: Brief Section "FirewallSequence.buildTimeline" and "PART 1: ALERT INTERRUPTION EFFECT"
   */
  timing: {
    // ScrambleText effect duration - Brief's FirewallSequence.buildTimeline example
    scrambleText: 1.2,

    // Correct/wrong answer feedback glows
    glowDuration: 0.3,
    correctFlash: 0.3,
    wrongShake: 0.5,

    // Full-screen cinematic transition duration
    transitionDuration: 2.0,

    // Firewall breach celebration sequence
    firewallBreach: 2.0,

    // Fury alert effect - Brief Section "PART 1: ALERT INTERRUPTION EFFECT" (2-3 seconds)
    furyAlertDuration: 2.5,
    furyAlertPulse: 0.5,

    // Number of red border pulses - Brief's CSS fury-border-pulse: "repeat 4"
    furyBorderPulses: 4,

    // Audio drift tolerance - Brief's FirewallSequence.play drift correction (50ms)
    audioDriftTolerance: 0.05,

    // Input disable window during animation sequences
    inputDisableWindow: 1.5,

    // Delay before advancing to next firewall
    transitionDelay: 1.5,

    // Extra buffer after animation before unlocking input
    inputLockBuffer: 0.3
  },

  /**
   * GSAP easing curves for different effect types
   * Reference: Brief Section "Visual Resource Tiers" animation descriptions
   */
  easing: {
    // Standard smooth transitions
    standard: 'power2.out',
    smooth: 'power2.out',

    // Dramatic entrances/exits
    dramatic: 'power4.out',
    sharp: 'power4.out',

    // Glitch/tech effects
    glitch: 'steps(12)',

    // Bounce/elastic effects
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.5)'
  },

  /**
   * Special effects configuration
   * Reference: Brief Section "FirewallSequence" and "Visual Resource Tiers"
   */
  effects: {
    // ScrambleText character set - exact string from Brief's FirewallSequence example
    scrambleChars: '01!<>-_\\/[]{}=+*^?#',

    // Pool of 8 transition types matching renamed image files
    // Reference: Brief Section "Full-Screen Cinematic Transitions"
    transitionPool: [
      'arc_reactor_pulse',
      'shatter_effect',
      'scan_sweep',
      'glitch_burst',
      'ripple_wave',
      'access_granted',
      'data_cascade',
      'progress_bar_surge'
    ]
  },

  /**
   * Mission structure parameters
   * Reference: Brief Section "Mission Architecture"
   */
  mission: {
    // Total number of math firewalls to breach
    totalFirewalls: 10,

    // Firewalls where Nick Fury science interruptions trigger
    scienceInterruptions: [3, 6, 9],

    // Total number of science questions (one per Fury interruption)
    totalScienceQuestions: 3
  },

  /**
   * Audio configuration
   * Reference: Brief Section "Sound Effects Inventory"
   */
  audio: {
    // Sound effects registry organized by category
    sfxRegistry: {
      // UI interaction sounds
      ui: {
        buttonClick: 'button-click.wav',
        buttonHover: 'button-hover.wav',
        inputFocus: 'input-focus.wav',
        toggleOn: 'toggle-on.wav',
        toggleOff: 'toggle-off.wav'
      },

      // Mission progress sounds
      mission: {
        firewallBreach: 'firewall-breach.wav',
        accessGranted: 'access-granted.wav',
        accessDenied: 'access-denied.wav',
        missionComplete: 'mission-complete.wav',
        missionStart: 'mission-start.wav'
      },

      // Screen transition sounds
      transitions: {
        screenWipe: 'screen-wipe.wav',
        screenFlash: 'screen-flash.wav',
        glitchBurst: 'glitch-burst.wav'
      },

      // Data/computing sounds
      data: {
        dataStream: 'data-stream.wav',
        encryption: 'encryption.wav',
        decryption: 'decryption.wav',
        processing: 'processing.wav'
      },

      // Arc reactor sounds
      arcReactor: {
        powerUp: 'arc-reactor-power-up.wav',
        hum: 'arc-reactor-hum.wav',
        pulse: 'arc-reactor-pulse.wav'
      },

      // Character-specific sounds
      characters: {
        jarvisChime: 'jarvis-chime.wav',
        furyAlert: 'fury-alert.wav',
        widowTransmission: 'widow-transmission.wav'
      },

      // Science interruption sounds
      science: {
        alertSiren: 'alert-siren.wav',
        securityOverride: 'security-override.wav',
        transmissionIncoming: 'transmission-incoming.wav'
      },

      // Victory/celebration sounds
      celebration: {
        victoryFanfare: 'victory-fanfare.wav',
        applause: 'applause.wav',
        achievement: 'achievement.wav'
      }
    },

    // Dialogue response bank category mappings
    // Maps category names to their ID prefixes in the response bank
    dialogueCategories: {
      jarvisCorrect: 'CORRECT',
      jarvisWrong: 'WRONG',
      jarvisHint: 'HINT',
      jarvisEncouragement: 'ENCOURAGE',
      furyCorrect: 'FURY-CORRECT',
      furyWrong: 'FURY-WRONG',
      furyIntro: 'FURY-INTRO',
      widowHint: 'WIDOW-HINT',
      widowSecret: 'WIDOW-SECRET'
    }
  }
};
