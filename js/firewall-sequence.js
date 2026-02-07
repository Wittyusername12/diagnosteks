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
   * Features: hex bg, PixiJS god rays/particles/bloom/glow backlight, corner brackets,
   *           TWO-LINE ScrambleText title with massive bloom, FUI decorations,
   *           decorated subtitle, PixiJS lens flare
   * @param {gsap.core.Timeline} timeline - The GSAP timeline
   */
  _buildAccessGranted(timeline) {
    // Create container for all DOM elements
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    // === DOM LAYER 0: Hexagonal background pattern ===
    const hexBg = document.createElement('div');
    hexBg.className = 'im-transition-hex-bg';
    container.appendChild(hexBg);

    // === DOM LAYER 1: Corner brackets (4 corners) with crosshairs - 30px from edges ===
    const brackets = [];
    const corners = [
      { pos: 'top:30px;left:30px;', borders: 'border-top:3px solid;border-left:3px solid;', crossPos: 'top:-1px;left:-1px;', start: { x: -80, y: -80 } },
      { pos: 'top:30px;right:30px;', borders: 'border-top:3px solid;border-right:3px solid;', crossPos: 'top:-1px;right:-1px;', start: { x: 80, y: -80 } },
      { pos: 'bottom:30px;left:30px;', borders: 'border-bottom:3px solid;border-left:3px solid;', crossPos: 'bottom:-1px;left:-1px;', start: { x: -80, y: 80 } },
      { pos: 'bottom:30px;right:30px;', borders: 'border-bottom:3px solid;border-right:3px solid;', crossPos: 'bottom:-1px;right:-1px;', start: { x: 80, y: 80 } }
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

    // === DOM LAYER 1.5: FUI border decorations ===
    // Top horizontal line with ticks
    const topLine = document.createElement('div');
    topLine.className = 'im-transition-fui-line horizontal';
    topLine.style.cssText = 'top:45px;left:50%;transform:translateX(-50%);';
    container.appendChild(topLine);

    const topTicks = document.createElement('div');
    topTicks.className = 'im-transition-fui-ticks';
    topTicks.style.cssText = 'top:38px;left:50%;transform:translateX(-50%);';
    for (let i = 0; i < 7; i++) {
      const tick = document.createElement('div');
      tick.className = 'im-transition-fui-tick';
      topTicks.appendChild(tick);
    }
    container.appendChild(topTicks);

    // Bottom horizontal line with ticks
    const bottomLine = document.createElement('div');
    bottomLine.className = 'im-transition-fui-line horizontal';
    bottomLine.style.cssText = 'bottom:45px;left:50%;transform:translateX(-50%);';
    container.appendChild(bottomLine);

    const bottomTicks = document.createElement('div');
    bottomTicks.className = 'im-transition-fui-ticks';
    bottomTicks.style.cssText = 'bottom:38px;left:50%;transform:translateX(-50%);';
    for (let i = 0; i < 7; i++) {
      const tick = document.createElement('div');
      tick.className = 'im-transition-fui-tick';
      bottomTicks.appendChild(tick);
    }
    container.appendChild(bottomTicks);

    // Left and right vertical lines
    const leftLine = document.createElement('div');
    leftLine.className = 'im-transition-fui-line vertical';
    leftLine.style.cssText = 'left:45px;top:50%;transform:translateY(-50%);';
    container.appendChild(leftLine);

    const rightLine = document.createElement('div');
    rightLine.className = 'im-transition-fui-line vertical';
    rightLine.style.cssText = 'right:45px;top:50%;transform:translateY(-50%);';
    container.appendChild(rightLine);

    const fuiElements = [topLine, topTicks, bottomLine, bottomTicks, leftLine, rightLine];

    // === DOM LAYER 2: Text container (centered, above PixiJS canvas) ===
    const textContainer = document.createElement('div');
    textContainer.style.cssText = 'position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    container.appendChild(textContainer);

    // Create TWO-LINE title: "ACCESS" on top, "GRANTED" on bottom
    const titleLine1 = document.createElement('div');
    titleLine1.className = 'im-transition-title';
    titleLine1.textContent = 'ACCESS';
    textContainer.appendChild(titleLine1);

    const titleLine2 = document.createElement('div');
    titleLine2.className = 'im-transition-title';
    titleLine2.style.marginTop = '-0.15em'; // Tight line spacing
    titleLine2.textContent = 'GRANTED';
    textContainer.appendChild(titleLine2);

    // Create subtitle with decorative flanking
    const subtitle = document.createElement('div');
    subtitle.className = 'im-transition-subtitle';
    subtitle.textContent = '── ◆ FIREWALL BREACHED ◆ ──';
    textContainer.appendChild(subtitle);

    // === PIXIJS ATMOSPHERIC EFFECTS (rendered on canvas behind DOM) ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const screenW = app.screen.width;
      const screenH = app.screen.height;
      const centerX = screenW / 2;
      const centerY = screenH * 0.45; // Slightly above center, behind text

      // --- EFFECT 0: Glow backlight behind text area ---
      const glowBacklight = new PIXI.Graphics();
      const backlightW = screenW * 0.6;
      const backlightH = screenH * 0.3;
      glowBacklight.beginFill(0x00d4ff, 0.15);
      glowBacklight.drawRoundedRect(centerX - backlightW / 2, centerY - backlightH / 2, backlightW, backlightH, 20);
      glowBacklight.endFill();
      glowBacklight.blendMode = PIXI.BLEND_MODES.ADD;
      glowBacklight.alpha = 0;

      const backlightGlowFilter = new PIXI.filters.GlowFilter({
        distance: 50,
        outerStrength: 3,
        innerStrength: 1,
        color: 0x00d4ff,
        quality: 0.3
      });
      glowBacklight.filters = [backlightGlowFilter];
      stage.addChild(glowBacklight);

      // --- EFFECT 1: God Rays Background - BRIGHTER ---
      const godRaysBg = new PIXI.Graphics();
      godRaysBg.beginFill(0x002244, 0.4); // Brighter fill
      godRaysBg.drawRect(0, 0, screenW, screenH);
      godRaysBg.endFill();
      godRaysBg.blendMode = PIXI.BLEND_MODES.ADD;

      const godRayFilter = new PIXI.filters.GodrayFilter({
        angle: 30,
        gain: 0,
        lacunarity: 2.5,
        parallel: false,
        time: 0,
        alpha: 0.8, // Higher alpha
        center: [0.5, 0.45]
      });
      godRaysBg.filters = [godRayFilter];
      stage.addChild(godRaysBg);

      // --- EFFECT 2: Light Streak Lines (12 diagonal rays) - THICKER AND BRIGHTER ---
      const streaksContainer = new PIXI.Container();
      streaksContainer.blendMode = PIXI.BLEND_MODES.ADD;
      stage.addChild(streaksContainer);

      const streaks = [];
      for (let i = 0; i < 12; i++) {
        const streak = new PIXI.Graphics();
        const angle = (i * 30) + (Math.random() * 12 - 6); // Every 30° with randomness
        const length = 900 + Math.random() * 500;
        const width = 3 + Math.random() * 5; // THICKER: 3-8px
        const alpha = 0.5 + Math.random() * 0.4; // BRIGHTER: 0.5-0.9
        const color = Math.random() > 0.6 ? 0x88eeff : 0x00d4ff;

        const rad = (angle * Math.PI) / 180;
        const endX = centerX + Math.cos(rad) * length;
        const endY = centerY + Math.sin(rad) * length;

        streak.lineStyle(width, color, alpha);
        streak.moveTo(centerX, centerY);
        streak.lineTo(endX, endY);
        streak.alpha = 0;
        streaksContainer.addChild(streak);
        streaks.push({ graphic: streak, targetAlpha: alpha });
      }

      // --- EFFECT 3: Particle Burst Container ---
      const particlesContainer = new PIXI.Container();
      particlesContainer.blendMode = PIXI.BLEND_MODES.ADD;
      stage.addChild(particlesContainer);

      // --- EFFECT 4: Horizontal Lens Flare ---
      const lensFlare = new PIXI.Graphics();
      lensFlare.beginFill(0xffffff, 1);
      lensFlare.drawRect(0, screenH * 0.45 - 3, screenW, 6);
      lensFlare.endFill();
      lensFlare.blendMode = PIXI.BLEND_MODES.ADD;
      lensFlare.alpha = 0;

      const glowFilter = new PIXI.filters.GlowFilter({
        distance: 15,
        outerStrength: 3,
        innerStrength: 1,
        color: 0x00d4ff,
        quality: 0.3
      });
      lensFlare.filters = [glowFilter];
      stage.addChild(lensFlare);

      // --- EFFECT 5: Bloom Filter on Stage - INTENSIFIED ---
      const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.4, // Lower threshold catches more elements
        bloomScale: 0,
        brightness: 1.3,
        blur: 6, // More blur
        quality: 4
      });

      // --- EFFECT 6: RGB Split Filter on Stage ---
      const rgbSplitFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

      stage.filters = [bloomFilter, rgbSplitFilter];

      // === PIXIJS TIMELINE ANIMATIONS ===

      // 0.0s: Glow backlight fades in
      timeline.to(glowBacklight, {
        alpha: 0.15,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);

      // 0.0s: God rays gain ramps up - BRIGHTER
      timeline.to(godRayFilter, {
        gain: 0.8, // Higher gain
        duration: 0.5,
        ease: 'power2.out'
      }, 0);

      // 0.0s: God rays time animates continuously
      timeline.to(godRayFilter, {
        time: 3,
        duration: 3,
        ease: 'none'
      }, 0);

      // 0.0s: Bloom ramps up
      timeline.to(bloomFilter, {
        bloomScale: 0.8,
        duration: 0.4,
        ease: 'power2.out'
      }, 0);

      // 0.1s: Light streaks fade in with stagger
      streaks.forEach((s, i) => {
        timeline.to(s.graphic, {
          alpha: s.targetAlpha,
          duration: 0.4 + Math.random() * 0.3,
          ease: 'power2.out'
        }, 0.1 + (i * 0.05));
      });

      // 0.5s: TEXT SLAM MOMENT - spike effects - INTENSIFIED
      // Glow backlight spike
      timeline.to(glowBacklight, {
        alpha: 0.4,
        duration: 0.1,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(glowBacklight, {
        alpha: 0.2,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0.6);

      // God rays spike - HIGHER
      timeline.to(godRayFilter, {
        gain: 1.2, // Higher spike
        duration: 0.1,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(godRayFilter, {
        gain: 0.8,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.6);

      // Bloom spike - MASSIVE
      timeline.to(bloomFilter, {
        bloomScale: 4.0, // Much higher spike
        duration: 0.1,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(bloomFilter, {
        bloomScale: 2.0, // Higher settle
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.6);

      // RGB Split flash
      timeline.to(rgbSplitFilter.red, {
        0: -4,
        1: 2,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(rgbSplitFilter.blue, {
        0: 4,
        1: -2,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(rgbSplitFilter.red, {
        0: 0,
        1: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.55);
      timeline.to(rgbSplitFilter.blue, {
        0: 0,
        1: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.55);

      // Lens flare flash
      timeline.to(lensFlare, {
        alpha: 0.7,
        duration: 0.1,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(lensFlare, {
        alpha: 0.15,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0.6);

      // 0.5s: Particle burst - spawn 60 BRIGHTER particles
      timeline.call(() => {
        for (let i = 0; i < 60; i++) {
          const particle = new PIXI.Graphics();
          const isElongated = Math.random() > 0.7; // Some elongated for motion blur effect
          const radius = 2 + Math.random() * 3; // LARGER: 2-5px
          const color = Math.random() > 0.4 ? 0x00d4ff : 0xffffff;

          particle.beginFill(color, 1.0); // FULL alpha fill
          if (isElongated) {
            particle.drawRect(-1, -3, 2, 6); // Elongated debris
          } else {
            particle.drawCircle(0, 0, radius);
          }
          particle.endFill();
          particle.blendMode = PIXI.BLEND_MODES.ADD;

          // Start near center with random offset
          particle.x = centerX + (Math.random() - 0.5) * 120;
          particle.y = centerY + (Math.random() - 0.5) * 80;
          particle.alpha = 0;

          particlesContainer.addChild(particle);

          // Random outward direction
          const angle = Math.random() * Math.PI * 2;
          const distance = 350 + Math.random() * 400;
          const targetX = particle.x + Math.cos(angle) * distance;
          const targetY = particle.y + Math.sin(angle) * distance;
          const duration = 1.5 + Math.random() * 1.0;

          // Animate particle outward - START FULLY BRIGHT
          gsap.to(particle, {
            alpha: 1.0, // Full alpha
            duration: 0.05,
            ease: 'power2.out'
          });
          gsap.to(particle, {
            x: targetX,
            y: targetY,
            alpha: 0,
            scale: 0.4,
            duration: duration,
            ease: 'power2.out',
            delay: Math.random() * 0.15
          });
        }
      }, null, 0.5);

      // 2.0s: Fade out all PixiJS effects
      timeline.to(glowBacklight, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 2.0);

      timeline.to(godRaysBg, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 2.0);

      streaks.forEach((s) => {
        timeline.to(s.graphic, {
          alpha: 0,
          duration: 0.5,
          ease: 'power2.in'
        }, 2.0);
      });

      timeline.to(lensFlare, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 2.0);

      timeline.to(bloomFilter, {
        bloomScale: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 2.0);
    }

    // === DOM GSAP ANIMATION SEQUENCE ===
    // All times are absolute positions on the timeline

    // 0.2s: Hex background fades in subtly
    gsap.set(hexBg, { opacity: 0 });
    timeline.to(hexBg, {
      opacity: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2);

    // 0.25s: FUI decorations fade in
    fuiElements.forEach((el) => {
      gsap.set(el, { opacity: 0 });
    });
    timeline.to(fuiElements, {
      opacity: 0.7,
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out'
    }, 0.25);

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

    // 0.4s: TWO-LINE ScrambleText decode with stagger
    gsap.set([titleLine1, titleLine2], { opacity: 1, scale: 1.08 });

    // Line 1: "ACCESS"
    timeline.to(titleLine1, {
      duration: 0.8,
      scrambleText: {
        text: 'ACCESS',
        chars: '01!<>-_\\/[]{}=+*^?#',
        revealDelay: 0.2,
        speed: 0.5
      },
      ease: 'none'
    }, 0.4);

    // Line 2: "GRANTED" - slight delay for stagger
    timeline.to(titleLine2, {
      duration: 0.9,
      scrambleText: {
        text: 'GRANTED',
        chars: '01!<>-_\\/[]{}=+*^?#',
        revealDelay: 0.25,
        speed: 0.45
      },
      ease: 'none'
    }, 0.45);

    // 1.1s: Subtitle fades in and slides up
    gsap.set(subtitle, { opacity: 0, y: 25 });
    timeline.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 1.1);

    // 1.15s: Title "slam" settle (scale punch after ScrambleText mostly done)
    timeline.to([titleLine1, titleLine2], {
      scale: 1,
      duration: 0.25,
      ease: 'back.out(2)'
    }, 1.15);

    // 1.3s: Text glow pulse (MASSIVE bloom) - applied to both lines
    const glowPulse = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00d4ff, 0 0 50px #00d4ff, 0 0 80px rgba(0,212,255,0.9), 0 0 120px rgba(0,212,255,0.7), 0 0 180px rgba(0,212,255,0.5), 0 0 250px rgba(0,212,255,0.3)';
    timeline.to([titleLine1, titleLine2], {
      textShadow: glowPulse,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, 1.3);

    // 1.8s: Hold at full visibility
    timeline.to({}, { duration: 0.5 }, 1.8);

    // 2.3s: DOM elements fade out together
    timeline.to([titleLine1, titleLine2, subtitle, hexBg, ...brackets.map(b => b.el), ...fuiElements], {
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

    // Initialize PixiJS canvas inside the transition content container
    if (window.pixiEffectManager) {
      window.pixiEffectManager.init(this.content);
    }

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

      // Reset PixiJS stage before clearing DOM
      if (window.pixiEffectManager) {
        window.pixiEffectManager.reset();
      }

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
