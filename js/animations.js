/**
 * animations.js - GSAP Animation Controller for Iron Man STEM Mission
 *
 * This module handles all visual animations using GSAP.
 * Key principle: Animations should FEEL like the MCU Jarvis interface.
 */

// Import GSAP (will be loaded via script tag from node_modules)
// gsap, ScrollTrigger, ScrambleTextPlugin are global after script load

/**
 * Central configuration for all animation timings
 * Adjust these values to tune the "feel" of the interface
 */
const HUD_CONFIG = {
  // Timing durations (in seconds)
  timing: {
    scrambleText: 1.2,        // How long text scramble effect takes
    correctFlash: 0.3,        // Green flash duration
    wrongShake: 0.5,          // Shake animation duration
    firewallBreach: 2.0,      // Full breach celebration sequence
    furyAlertPulse: 0.5,      // Red border pulse duration
    furyAlertCount: 4,        // Number of red pulses before Fury appears
    transitionDelay: 1.5,     // Pause before advancing to next firewall
    inputLockBuffer: 0.3      // Extra time to keep input locked after animation
  },

  // ScrambleText character set (techy/glitchy feel)
  scrambleChars: '01!<>-_\\/[]{}=+*^?#@$%',

  // Colors
  colors: {
    cyan: '#00d4ff',
    red: '#ff3333',
    green: '#00ff00',
    white: '#ffffff',
    dark: '#0a0a0a'
  },

  // Easing functions
  easing: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    sharp: 'power4.out'
  }
};

/**
 * AnimationController - Manages all GSAP animations
 *
 * Usage:
 *   const animator = new AnimationController();
 *   animator.playCorrectSequence(element, onCompleteCallback);
 */
class AnimationController {
  constructor() {
    this.isAnimating = false;
    this.currentTimeline = null;
    this.init();
  }

  /**
   * Initialize GSAP plugins
   */
  init() {
    // Register ScrambleText plugin if available
    if (typeof ScrambleTextPlugin !== 'undefined') {
      gsap.registerPlugin(ScrambleTextPlugin);
      console.log('[GSAP] ScrambleTextPlugin registered');
    } else {
      console.warn('[GSAP] ScrambleTextPlugin not available - text effects will be basic');
    }

    console.log('[GSAP] AnimationController initialized');
  }

  /**
   * Lock input during animations
   * Prevents spam-clicking from corrupting animation state
   */
  lockInput() {
    this.isAnimating = true;
    const answerInput = document.getElementById('answer-input');
    const decryptBtn = document.getElementById('btn-decrypt');

    if (answerInput) {
      answerInput.disabled = true;
      answerInput.classList.add('input-locked');
    }
    if (decryptBtn) {
      decryptBtn.disabled = true;
      decryptBtn.classList.add('input-locked');
    }

    console.log('[GSAP] Input locked');
  }

  /**
   * Unlock input after animations complete
   */
  unlockInput() {
    this.isAnimating = false;
    const answerInput = document.getElementById('answer-input');
    const decryptBtn = document.getElementById('btn-decrypt');

    if (answerInput) {
      answerInput.disabled = false;
      answerInput.classList.remove('input-locked');
      answerInput.value = '';  // Clear for next problem
      answerInput.focus();
    }
    if (decryptBtn) {
      decryptBtn.disabled = false;
      decryptBtn.classList.remove('input-locked');
    }

    console.log('[GSAP] Input unlocked');
  }

  /**
   * Scramble text effect - makes text look like it's being decoded
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} finalText - The text to reveal
   * @param {function} onComplete - Callback when done
   */
  scrambleText(element, finalText, onComplete) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) {
      console.error('[GSAP] scrambleText: Element not found');
      if (onComplete) onComplete();
      return;
    }

    // If ScrambleTextPlugin is available, use it
    if (typeof ScrambleTextPlugin !== 'undefined') {
      gsap.to(el, {
        duration: HUD_CONFIG.timing.scrambleText,
        scrambleText: {
          text: finalText,
          chars: HUD_CONFIG.scrambleChars,
          revealDelay: 0.3,
          speed: 0.5
        },
        ease: HUD_CONFIG.easing.smooth,
        onComplete: onComplete
      });
    } else {
      // Fallback: simple fade-in with character reveal
      el.textContent = '';
      let i = 0;
      const interval = setInterval(() => {
        if (i < finalText.length) {
          el.textContent += finalText[i];
          i++;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, HUD_CONFIG.timing.scrambleText * 1000 / finalText.length);
    }
  }

  /**
   * Play correct answer celebration sequence
   * @param {function} onComplete - Callback when animation finishes
   */
  playCorrectSequence(onComplete) {
    this.lockInput();

    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          this.unlockInput();
          if (onComplete) onComplete();
        }, HUD_CONFIG.timing.inputLockBuffer * 1000);
      }
    });

    // Get elements
    const dialogueBox = document.querySelector('.jarvis-dialogue');
    const centerContent = document.querySelector('.content-area');
    const answerInput = document.getElementById('answer-input');

    // Sequence:
    // 1. Flash input/dialogue green
    if (answerInput) {
      timeline.to(answerInput, {
        borderColor: HUD_CONFIG.colors.green,
        boxShadow: `0 0 30px ${HUD_CONFIG.colors.green}`,
        duration: HUD_CONFIG.timing.correctFlash,
        ease: HUD_CONFIG.easing.sharp
      }, 0);
    }

    // 2. Scramble "ACCESS GRANTED" text
    if (dialogueBox) {
      timeline.add(() => {
        this.scrambleText(dialogueBox, '"Access granted. Firewall breached. Well done, recruits."');
      }, 0.1);
    }

    // 3. Pulse the center content
    if (centerContent) {
      timeline.to(centerContent, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: HUD_CONFIG.easing.bounce
      }, 0.2);
    }

    // 4. Return input to normal
    if (answerInput) {
      timeline.to(answerInput, {
        borderColor: HUD_CONFIG.colors.cyan,
        boxShadow: 'none',
        duration: 0.5,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.3');
    }

    // 5. Add delay before callback
    timeline.to({}, { duration: HUD_CONFIG.timing.transitionDelay });

    this.currentTimeline = timeline;
    console.log('[GSAP] Playing correct sequence');
  }

  /**
   * Play wrong answer shake/rejection sequence
   * @param {function} onComplete - Callback when animation finishes
   */
  playWrongSequence(onComplete) {
    this.lockInput();

    const timeline = gsap.timeline({
      onComplete: () => {
        this.unlockInput();
        if (onComplete) onComplete();
      }
    });

    const dialogueBox = document.querySelector('.jarvis-dialogue');
    const answerInput = document.getElementById('answer-input');

    // Sequence:
    // 1. Flash input red
    if (answerInput) {
      timeline.to(answerInput, {
        borderColor: HUD_CONFIG.colors.red,
        boxShadow: `0 0 20px ${HUD_CONFIG.colors.red}`,
        duration: 0.1,
        ease: HUD_CONFIG.easing.sharp
      }, 0);
    }

    // 2. Update dialogue text
    if (dialogueBox) {
      timeline.add(() => {
        dialogueBox.textContent = '"Incorrect. Access denied. Try again, recruits."';
      }, 0);
    }

    // 3. Shake the input field
    if (answerInput) {
      timeline.to(answerInput, {
        x: -10,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'none'
      }, 0.1);
    }

    // 4. Return to normal
    if (answerInput) {
      timeline.to(answerInput, {
        borderColor: HUD_CONFIG.colors.cyan,
        boxShadow: 'none',
        duration: 0.3,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.2');

      // Reset input position
      timeline.set(answerInput, { x: 0 });
    }

    this.currentTimeline = timeline;
    console.log('[GSAP] Playing wrong sequence');
  }

  /**
   * Play Fury alert sequence (red border pulses before Fury appears)
   * @param {function} onComplete - Callback when pulses finish
   */
  playFuryAlert(onComplete) {
    this.lockInput();

    const panels = document.querySelectorAll('.hud-panel, .sidebar, .content-area');
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        // Note: Don't unlock input here - Fury screen will handle that
      }
    });

    // Add fury-alert-active class to body
    document.body.classList.add('fury-alert-active');

    // Pulse all panels red
    panels.forEach(panel => {
      timeline.to(panel, {
        borderColor: HUD_CONFIG.colors.red,
        boxShadow: `0 0 20px ${HUD_CONFIG.colors.red}`,
        duration: HUD_CONFIG.timing.furyAlertPulse / 2,
        repeat: HUD_CONFIG.timing.furyAlertCount * 2 - 1,
        yoyo: true,
        ease: 'power1.inOut'
      }, 0);
    });

    // Remove class when done
    timeline.add(() => {
      document.body.classList.remove('fury-alert-active');
    });

    this.currentTimeline = timeline;
    console.log('[GSAP] Playing Fury alert sequence');
  }

  /**
   * Stop any running animation
   */
  stop() {
    if (this.currentTimeline) {
      this.currentTimeline.kill();
      this.currentTimeline = null;
    }
    this.unlockInput();
  }
}

// Create global instance
const animator = new AnimationController();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController, HUD_CONFIG, animator };
}
