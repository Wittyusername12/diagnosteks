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
    furyAlertPulse: 0.5,      // Amber border pulse duration
    furyAlertCount: 4,        // Number of amber pulses during SHIELD takeover
    transitionDelay: 1.5,     // Pause before advancing to next firewall
    inputLockBuffer: 0.3      // Extra time to keep input locked after animation
  },

  // ScrambleText character set (techy/glitchy feel)
  scrambleChars: '01!<>-_\\/[]{}=+*^?#@$%',

  // Colors
  colors: {
    cyan: '#00d4ff',
    amber: '#ff8c00',
    amberBright: '#ffaa00',
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
   * Uses boxShadow and filter instead of borderColor (augmented-ui conflict)
   * @param {function} onComplete - Callback when animation finishes
   */
  playCorrectSequence(onComplete) {
    this.lockInput();

    // Get elements (all confirmed to exist in index.html)
    const dialogueBox = document.querySelector('.jarvis-dialogue');
    const dialogueContent = document.getElementById('jarvis-dialogue');
    const problemContainer = document.querySelector('.problem-container');
    const answerInput = document.getElementById('answer-input');

    // Debug logging - verify elements found
    console.log('[GSAP] playCorrectSequence - Elements found:');
    console.log('  .jarvis-dialogue:', dialogueBox ? 'YES' : 'NO');
    console.log('  #jarvis-dialogue:', dialogueContent ? 'YES' : 'NO');
    console.log('  .problem-container:', problemContainer ? 'YES' : 'NO');
    console.log('  #answer-input:', answerInput ? 'YES' : 'NO');

    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          this.unlockInput();
          if (onComplete) onComplete();
        }, HUD_CONFIG.timing.inputLockBuffer * 1000);
      }
    });

    // Build array of elements to animate (filter nulls)
    const glowTargets = [dialogueBox, problemContainer].filter(el => el);

    // GREEN SUCCESS ANIMATION
    // Use boxShadow + filter (augmented-ui doesn't control these)
    if (glowTargets.length > 0) {
      // 1. Flash green glow
      timeline.to(glowTargets, {
        boxShadow: '0 0 30px #00ff00, inset 0 0 20px rgba(0, 255, 0, 0.3)',
        filter: 'brightness(1.3)',
        duration: 0.2,
        ease: HUD_CONFIG.easing.sharp
      }, 0);

      // 2. Slight scale pulse
      timeline.to(glowTargets, {
        scale: 1.02,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: HUD_CONFIG.easing.bounce
      }, 0);

      // 3. Return to normal
      timeline.to(glowTargets, {
        boxShadow: 'none',
        filter: 'brightness(1)',
        scale: 1,
        duration: 0.4,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.3');
    }

    // Glow the input field too
    if (answerInput) {
      timeline.to(answerInput, {
        boxShadow: '0 0 20px #00ff00',
        filter: 'brightness(1.2)',
        duration: 0.2,
        ease: HUD_CONFIG.easing.sharp
      }, 0);

      timeline.to(answerInput, {
        boxShadow: 'none',
        filter: 'brightness(1)',
        duration: 0.4,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.3');
    }

    // Scramble "ACCESS GRANTED" text
    if (dialogueContent) {
      timeline.add(() => {
        this.scrambleText(dialogueContent, '"Access granted. Firewall breached. Well done, recruits."');
      }, 0.1);
    }

    // Add delay before callback (transition to next firewall)
    timeline.to({}, { duration: HUD_CONFIG.timing.transitionDelay });

    this.currentTimeline = timeline;

    // ScrambleText effect for "ACCESS GRANTED" reveal
    if (dialogueContent) {
      this.scrambleText(dialogueContent, '"ACCESS GRANTED. Firewall breached."');
      console.log('[GSAP] Playing ScrambleText effect');
    }

    console.log('[GSAP] Playing correct sequence - animating', glowTargets.length, 'panels');
  }

  /**
   * Play wrong answer shake/rejection sequence
   * Uses boxShadow and filter instead of borderColor (augmented-ui conflict)
   * @param {function} onComplete - Callback when animation finishes
   */
  playWrongSequence(onComplete) {
    this.lockInput();

    // Get elements (all confirmed to exist in index.html)
    const dialogueBox = document.querySelector('.jarvis-dialogue');
    const dialogueContent = document.getElementById('jarvis-dialogue');
    const problemContainer = document.querySelector('.problem-container');
    const answerInput = document.getElementById('answer-input');

    // Debug logging - verify elements found
    console.log('[GSAP] playWrongSequence - Elements found:');
    console.log('  .jarvis-dialogue:', dialogueBox ? 'YES' : 'NO');
    console.log('  #jarvis-dialogue:', dialogueContent ? 'YES' : 'NO');
    console.log('  .problem-container:', problemContainer ? 'YES' : 'NO');
    console.log('  #answer-input:', answerInput ? 'YES' : 'NO');

    const timeline = gsap.timeline({
      onComplete: () => {
        this.unlockInput();
        if (onComplete) onComplete();
      }
    });

    // Build array of elements to animate (filter nulls)
    const glowTargets = [dialogueBox, problemContainer].filter(el => el);

    // RED FAILURE ANIMATION
    // Use boxShadow + filter (augmented-ui doesn't control these)
    if (glowTargets.length > 0) {
      // 1. Flash red glow
      timeline.to(glowTargets, {
        boxShadow: '0 0 30px #ff0000, inset 0 0 20px rgba(255, 0, 0, 0.3)',
        filter: 'brightness(1.3)',
        duration: 0.15,
        ease: HUD_CONFIG.easing.sharp
      }, 0);

      // 2. Return to normal
      timeline.to(glowTargets, {
        boxShadow: 'none',
        filter: 'brightness(1)',
        duration: 0.2,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.3');
    }

    // Update dialogue text
    if (dialogueContent) {
      timeline.add(() => {
        dialogueContent.textContent = '"Incorrect. Access denied. Try again, recruits."';
      }, 0);
    }

    // Glow and shake the input field
    if (answerInput) {
      // Red glow on input
      timeline.to(answerInput, {
        boxShadow: '0 0 20px #ff0000',
        filter: 'brightness(1.2)',
        duration: 0.1,
        ease: HUD_CONFIG.easing.sharp
      }, 0);

      // Shake the input left-right
      timeline.to(answerInput, {
        x: -10,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'power2.inOut'
      }, 0.1);

      // Return to normal
      timeline.to(answerInput, {
        boxShadow: 'none',
        filter: 'brightness(1)',
        x: 0,
        duration: 0.2,
        ease: HUD_CONFIG.easing.smooth
      }, '+=0.1');
    }

    this.currentTimeline = timeline;
    console.log('[GSAP] Playing wrong sequence - animating', glowTargets.length, 'panels');
  }

  /**
   * Play Fury alert sequence - 2.5 second dramatic SHIELD takeover
   * Creates fullscreen overlay with SHIELD logo and amber panel flashes
   * @param {function} onComplete - Callback when alert sequence finishes
   */
  playFuryAlert(onComplete) {
    this.lockInput();

    // Target ALL panels including header and footer
    const panels = document.querySelectorAll(
      '.hud-panel, .sidebar, .problem-container, .jarvis-dialogue, .header-bar, .footer-bar, .content-area'
    );

    console.log('[GSAP] playFuryAlert - Creating SHIELD alert overlay');
    console.log('[GSAP] playFuryAlert - Panels to flash:', panels.length);

    // Create the overlay DOM structure
    const overlay = document.createElement('div');
    overlay.className = 'im-fury-overlay';
    overlay.innerHTML = `
      <div class="im-fury-overlay-bg"></div>
      <div class="im-fury-vignette"></div>
      <div class="im-fury-alert-text">SECURITY OVERRIDE</div>
      <img class="im-fury-logo" src="./shield_logo.png" alt="S.H.I.E.L.D.">
    `;
    document.body.appendChild(overlay);

    const alertText = overlay.querySelector('.im-fury-alert-text');
    const logo = overlay.querySelector('.im-fury-logo');

    // Add fury-alert-active class to body
    document.body.classList.add('fury-alert-active');

    // Master timeline for the 2.5 second sequence
    const timeline = gsap.timeline({
      onComplete: () => {
        // Remove overlay from DOM
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        // Remove class
        document.body.classList.remove('fury-alert-active');
        // Ensure all panels return to normal (cyan)
        panels.forEach(panel => {
          gsap.set(panel, { boxShadow: 'none', filter: 'brightness(1)' });
        });
        console.log('[GSAP] Fury alert complete - overlay removed, panels reset');
        if (onComplete) onComplete();
      }
    });

    // ========================================
    // PHASE 1: SCREEN TAKEOVER (0s to 0.8s)
    // ========================================

    // Make overlay visible and block pointer events
    timeline.set(overlay, {
      visibility: 'visible',
      pointerEvents: 'all'
    }, 0);

    // Fade in overlay immediately
    timeline.to(overlay, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, 0);

    // Flash all HUD panel borders amber - 4 pulses over 2 seconds
    panels.forEach(panel => {
      timeline.to(panel, {
        boxShadow: '0 0 25px rgba(255, 140, 0, 0.6), inset 0 0 15px rgba(255, 140, 0, 0.2)',
        filter: 'brightness(1.2)',
        duration: 0.25,
        repeat: 3,
        yoyo: true,
        ease: 'power1.inOut'
      }, 0);
    });

    // Scale SHIELD logo from 0 to 1 with elastic ease
    timeline.to(logo, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, 0.1);

    // ========================================
    // PHASE 2: LOGO PULSE + TEXT (0.5s to 2.0s)
    // ========================================

    // Fade in "SECURITY OVERRIDE" text
    if (typeof ScrambleTextPlugin !== 'undefined') {
      // Use ScrambleText for dramatic effect
      timeline.fromTo(alertText,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.5);
      timeline.to(alertText, {
        duration: 0.8,
        scrambleText: {
          text: 'SECURITY OVERRIDE',
          chars: '!<>-_\\/[]{}=+*^?#@$%01',
          revealDelay: 0.3,
          speed: 0.4
        }
      }, 0.5);
    } else {
      // Fallback: simple fade in
      timeline.to(alertText, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.5);
    }

    // Logo pulses scale gently (1.0 to 1.05 and back, repeat 2)
    timeline.to(logo, {
      scale: 1.05,
      duration: 0.4,
      repeat: 2,
      yoyo: true,
      ease: 'sine.inOut'
    }, 0.9);

    // Intensify logo glow then dim
    timeline.to(logo, {
      filter: 'brightness(2) drop-shadow(0 0 50px rgba(255, 140, 0, 1)) drop-shadow(0 0 80px rgba(255, 140, 0, 0.7))',
      duration: 0.3,
      ease: 'power2.in'
    }, 1.2);
    timeline.to(logo, {
      filter: 'brightness(1.5) drop-shadow(0 0 30px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 60px rgba(255, 140, 0, 0.5))',
      duration: 0.3,
      ease: 'power2.out'
    }, 1.5);

    // ========================================
    // PHASE 3: DISMISS (2.0s to 2.5s)
    // ========================================

    // Fade out everything
    timeline.to([overlay, logo, alertText], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    }, 2.0);

    this.currentTimeline = timeline;
    console.log('[GSAP] Playing Fury SHIELD alert - 2.5s dramatic takeover');
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
