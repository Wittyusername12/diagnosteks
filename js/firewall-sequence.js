/**
 * firewall-sequence.js - Transition Engine for Iron Man STEM Mission
 *
 * This class orchestrates full-screen cinematic transitions on correct answers.
 * One of 8 random transition types plays inside #transition-overlay each time.
 *
 * Reference: Iron_Man_STEM_Mission_Project_Brief_v3.md
 * - Phase 2.5A Core Feedback Loop
 * - "Build FirewallSequence class (transition engine) with GSAP timeline"
 *
 * NOTE: This is the SKELETON with placeholder visuals. Actual animation
 * implementations for each of the 8 types come in future prompts.
 */

class FirewallSequence {
  constructor() {
    // DOM references
    this.overlay = document.getElementById('transition-overlay');
    this.content = document.getElementById('transition-content');

    // State
    this.lastPlayedType = null;   // Avoid immediate repeats
    this.activeTimeline = null;   // Reference for cleanup
    this.isPlaying = false;       // Guard against double-triggers

    // Validate DOM elements exist
    if (!this.overlay || !this.content) {
      console.error('[TransitionEngine] Required DOM elements not found!');
      console.error('  #transition-overlay:', this.overlay ? 'OK' : 'MISSING');
      console.error('  #transition-content:', this.content ? 'OK' : 'MISSING');
      return;
    }

    console.log('[TransitionEngine] FirewallSequence initialized');
  }

  /**
   * Pick a random transition type, avoiding consecutive repeats
   * @returns {string} The selected transition type
   */
  getRandomTransition() {
    const pool = window.HUD_CONFIG?.effects?.transitionPool || [];

    if (pool.length === 0) {
      console.warn('[TransitionEngine] No transitions in pool!');
      return 'unknown';
    }

    // If only one item, allow repeats
    if (pool.length === 1) {
      this.lastPlayedType = pool[0];
      return pool[0];
    }

    // Pick random, avoiding the last played type
    let type;
    do {
      type = pool[Math.floor(Math.random() * pool.length)];
    } while (type === this.lastPlayedType);

    this.lastPlayedType = type;
    return type;
  }

  /**
   * Dispatcher - routes each transition type to its builder method
   * @param {string} type - The transition type from transitionPool
   * @param {gsap.core.Timeline} timeline - The GSAP timeline to add animations to
   */
  _buildTransitionContent(type, timeline) {
    switch (type) {
      case 'access_granted':
        return this._buildAccessGranted(timeline);
      case 'arc_reactor_pulse':
        return this._buildArcReactorPulse(timeline);
      case 'data_cascade':
        return this._buildDataCascade(timeline);
      case 'glitch_burst':
        return this._buildGlitchBurst(timeline);
      case 'progress_bar_surge':
        return this._buildProgressBarSurge(timeline);
      case 'ripple_wave':
        return this._buildRippleWave(timeline);
      case 'scan_sweep':
        return this._buildScanSweep(timeline);
      case 'shatter_effect':
        return this._buildShatterEffect(timeline);
      default:
        return this._buildPlaceholder(type, timeline);
    }
  }

  /**
   * Build placeholder content - shows transition type name as text
   * Used for unimplemented transitions
   * @param {string} type - The transition type
   * @param {gsap.core.Timeline} timeline - The GSAP timeline
   */
  _buildPlaceholder(type, timeline) {
    // Create placeholder visual (text showing transition type)
    const placeholder = document.createElement('div');
    placeholder.className = 'im-transition-text';
    placeholder.textContent = type.replace(/_/g, ' ').toUpperCase();
    placeholder.style.fontSize = '4rem';
    placeholder.style.opacity = '0';
    this.content.appendChild(placeholder);

    // Fade in placeholder text
    timeline.to(placeholder, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.3);

    // Hold
    timeline.to({}, { duration: 1.5 }, '+=0');

    // Fade out placeholder text
    timeline.to(placeholder, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  }

  /**
   * Stub - Arc Reactor Pulse transition (not yet implemented)
   */
  _buildArcReactorPulse(timeline) {
    this._buildPlaceholder('arc_reactor_pulse', timeline);
  }

  /**
   * Stub - Data Cascade transition (not yet implemented)
   */
  _buildDataCascade(timeline) {
    this._buildPlaceholder('data_cascade', timeline);
  }

  /**
   * Stub - Glitch Burst transition (not yet implemented)
   */
  _buildGlitchBurst(timeline) {
    this._buildPlaceholder('glitch_burst', timeline);
  }

  /**
   * Stub - Progress Bar Surge transition (not yet implemented)
   */
  _buildProgressBarSurge(timeline) {
    this._buildPlaceholder('progress_bar_surge', timeline);
  }

  /**
   * Stub - Ripple Wave transition (not yet implemented)
   */
  _buildRippleWave(timeline) {
    this._buildPlaceholder('ripple_wave', timeline);
  }

  /**
   * Stub - Scan Sweep transition (not yet implemented)
   */
  _buildScanSweep(timeline) {
    this._buildPlaceholder('scan_sweep', timeline);
  }

  /**
   * Stub - Shatter Effect transition (not yet implemented)
   */
  _buildShatterEffect(timeline) {
    this._buildPlaceholder('shatter_effect', timeline);
  }

  /**
   * Build ACCESS GRANTED transition
   * Reference: transition_access_granted.png
   * Features: hex bg, light rays, particles, corner brackets with crosses,
   *           ScrambleText title with bloom, decorated subtitle, lens flare
   * @param {gsap.core.Timeline} timeline - The GSAP timeline
   */
  _buildAccessGranted(timeline) {
    // Create container for all elements
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
    this.content.appendChild(container);

    // === LAYER 0: Hexagonal background pattern ===
    const hexBg = document.createElement('div');
    hexBg.className = 'im-transition-hex-bg';
    container.appendChild(hexBg);

    // === LAYER 1: Diagonal light rays (behind text) ===
    const raysContainer = document.createElement('div');
    raysContainer.className = 'im-transition-rays-container';
    container.appendChild(raysContainer);

    const rays = [];
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
      const ray = document.createElement('div');
      ray.className = 'im-transition-ray';
      const angle = (i * 360 / rayCount) + 22.5; // Offset to avoid pure vertical/horizontal
      ray.style.transform = `rotate(${angle}deg)`;
      raysContainer.appendChild(ray);
      rays.push(ray);
    }

    // === LAYER 2: Corner brackets (4 corners) with crosshairs ===
    const brackets = [];
    const corners = [
      { pos: 'top:40px;left:40px;', borders: 'border-top:3px solid;border-left:3px solid;', crossPos: 'top:-1px;left:-1px;', start: { x: -60, y: -60 } },
      { pos: 'top:40px;right:40px;', borders: 'border-top:3px solid;border-right:3px solid;', crossPos: 'top:-1px;right:-1px;', start: { x: 60, y: -60 } },
      { pos: 'bottom:40px;left:40px;', borders: 'border-bottom:3px solid;border-left:3px solid;', crossPos: 'bottom:-1px;left:-1px;', start: { x: -60, y: 60 } },
      { pos: 'bottom:40px;right:40px;', borders: 'border-bottom:3px solid;border-right:3px solid;', crossPos: 'bottom:-1px;right:-1px;', start: { x: 60, y: 60 } }
    ];

    corners.forEach((corner) => {
      const bracket = document.createElement('div');
      bracket.className = 'im-transition-bracket';
      bracket.style.cssText = corner.pos + corner.borders;

      // Add crosshair at junction
      const cross = document.createElement('div');
      cross.className = 'im-transition-bracket-cross';
      cross.style.cssText = 'position:absolute;' + corner.crossPos;
      bracket.appendChild(cross);

      container.appendChild(bracket);
      brackets.push({ el: bracket, start: corner.start });
    });

    // === LAYER 3: Text container (centered, above rays) ===
    const textContainer = document.createElement('div');
    textContainer.style.cssText = 'position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    container.appendChild(textContainer);

    // Create main title
    const title = document.createElement('div');
    title.className = 'im-transition-title';
    title.textContent = 'ACCESS GRANTED';
    textContainer.appendChild(title);

    // Create subtitle with decorative flanking
    const subtitle = document.createElement('div');
    subtitle.className = 'im-transition-subtitle';
    subtitle.textContent = '── ◆ FIREWALL BREACHED ◆ ──';
    textContainer.appendChild(subtitle);

    // === LAYER 4: Floating particles ===
    const particles = [];
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'im-transition-particle';
      // Random starting position near center
      const startX = (Math.random() - 0.5) * 100;
      const startY = (Math.random() - 0.5) * 60;
      particle.style.cssText = `left:calc(50% + ${startX}px);top:calc(50% + ${startY}px);`;
      container.appendChild(particle);

      // Random end position (scatter outward)
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 200;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      particles.push({
        el: particle,
        endX: endX,
        endY: endY,
        duration: 0.8 + Math.random() * 0.6
      });
    }

    // Create lens flare
    const flare = document.createElement('div');
    flare.className = 'im-transition-flare';
    container.appendChild(flare);

    // === GSAP Animation Sequence ===
    // All times are absolute positions on the timeline

    // 0.2s: Hex background fades in subtly
    gsap.set(hexBg, { opacity: 0 });
    timeline.to(hexBg, {
      opacity: 0.4,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2);

    // 0.3s: Corner brackets slide in from edges
    brackets.forEach((b) => {
      gsap.set(b.el, { x: b.start.x, y: b.start.y, opacity: 0 });
      timeline.to(b.el, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.3);
    });

    // 0.3s: Light rays fade in and scale outward
    rays.forEach((ray, i) => {
      gsap.set(ray, { opacity: 0, scaleY: 0.5 });
      timeline.to(ray, {
        opacity: 0.6,
        scaleY: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.3 + (i * 0.03)); // Slight stagger
    });

    // 0.4s: Main text ScrambleText decode (with scale for "slam" effect)
    gsap.set(title, { opacity: 1, scale: 1.08 });
    timeline.to(title, {
      duration: 1.0,
      scrambleText: {
        text: 'ACCESS GRANTED',
        chars: '01!<>-_\\/[]{}=+*^?#',
        revealDelay: 0.3,
        speed: 0.4
      },
      ease: 'none'
    }, 0.4);

    // 0.5s: Particles scatter outward
    particles.forEach((p, i) => {
      gsap.set(p.el, { opacity: 0, x: 0, y: 0 });
      timeline.to(p.el, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
      }, 0.5 + (i * 0.02));
      timeline.to(p.el, {
        x: p.endX,
        y: p.endY,
        opacity: 0,
        duration: p.duration,
        ease: 'power2.out'
      }, 0.55 + (i * 0.02));
    });

    // 1.1s: Subtitle fades in and slides up
    gsap.set(subtitle, { opacity: 0, y: 20 });
    timeline.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 1.1);

    // 1.15s: Title "slam" settle (scale punch after ScrambleText mostly done)
    timeline.to(title, {
      scale: 1,
      duration: 0.25,
      ease: 'back.out(2)'
    }, 1.15);

    // 1.2s: Lens flare flashes
    gsap.set(flare, { opacity: 0, scaleX: 0.5 });
    timeline.to(flare, {
      opacity: 1,
      scaleX: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, 1.2);
    timeline.to(flare, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 1.5);

    // 1.3s: Text glow pulse (intense bloom)
    timeline.to(title, {
      textShadow: '0 0 20px rgba(0,212,255,1), 0 0 40px rgba(0,212,255,1), 0 0 80px rgba(0,212,255,0.8), 0 0 120px rgba(0,212,255,0.6), 0 0 160px rgba(0,212,255,0.4)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, 1.3);

    // 1.8s: Hold at full visibility
    timeline.to({}, { duration: 0.5 }, 1.8);

    // 2.3s: Everything fades out together
    timeline.to([title, subtitle, hexBg, ...brackets.map(b => b.el), ...rays], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 2.3);
  }

  /**
   * Play a full-screen cinematic transition
   * @param {function} onComplete - Callback when transition ends (receives type as argument)
   */
  playTransition(onComplete) {
    // Guard against double-triggers
    if (this.isPlaying) {
      console.warn('[TransitionEngine] Transition already playing, ignoring request');
      return;
    }

    // Validate DOM
    if (!this.overlay || !this.content) {
      console.error('[TransitionEngine] Cannot play: DOM elements missing');
      if (onComplete) onComplete(null);
      return;
    }

    this.isPlaying = true;

    // Pick random transition type
    const type = this.getRandomTransition();
    console.log('[TransitionEngine] Playing transition:', type);

    // Build GSAP timeline
    const timeline = gsap.timeline({ paused: true });

    // Step 1: Activate overlay (visibility: visible)
    timeline.call(() => { this.overlay.classList.add('active'); }, null, 0);

    // Step 2: Fade in overlay
    timeline.to(this.overlay, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.in'
    }, 0);

    // Build transition-specific content (adds to timeline)
    this._buildTransitionContent(type, timeline);

    // Step 6: Fade out overlay
    timeline.to(this.overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Step 7: Cleanup
    timeline.call(() => {
      // Remove active class
      this.overlay.classList.remove('active');

      // CRITICAL: Remove inline styles GSAP left on the overlay from opacity tweens
      // Without this, inline opacity:0 would permanently override the CSS
      gsap.set(this.overlay, { clearProps: 'opacity' });

      // Clear content
      this.content.innerHTML = '';

      // Reset state
      this.isPlaying = false;
      this.activeTimeline = null;

      console.log('[TransitionEngine] Transition complete:', type);

      // Fire callback
      if (onComplete) onComplete(type);
    });

    // Store and play
    this.activeTimeline = timeline;
    timeline.play();
  }

  /**
   * Immediately stop and cleanup any playing transition
   */
  destroy() {
    // Kill active timeline
    if (this.activeTimeline) {
      this.activeTimeline.kill();
      this.activeTimeline = null;
    }

    // Clear content
    if (this.content) {
      this.content.innerHTML = '';
    }

    // Reset overlay state
    if (this.overlay) {
      this.overlay.classList.remove('active');
      gsap.set(this.overlay, { clearProps: 'opacity' });
    }

    // Reset flags
    this.isPlaying = false;

    console.log('[TransitionEngine] Destroyed');
  }
}

// Expose class globally
window.FirewallSequence = FirewallSequence;

// Auto-instantiate when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.transitionEngine = new FirewallSequence();
});
