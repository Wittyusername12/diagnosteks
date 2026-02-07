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
    // === DOM CONTAINER (minimal - just for optional flavor label) ===
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    // Optional flavor label at bottom
    const label = document.createElement('div');
    label.className = 'im-transition-fui-label';
    label.style.cssText = 'bottom:30px;left:50%;transform:translateX(-50%);top:auto;';
    label.textContent = '◇ ARC REACTOR DISCHARGE ◇';
    container.appendChild(label);

    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const screenW = app.screen.width;
      const screenH = app.screen.height;
      const cx = screenW / 2;
      const cy = screenH / 2;
      const minDim = Math.min(screenW, screenH);

      // --- ELEMENT 1: THREE CONCENTRIC SEGMENTED RINGS ---
      const ringConfigs = [
        { radius: minDim * 0.35, lineWidth: 2, lineAlpha: 0.5, segments: 12, direction: 1, speed: 2.0 },   // Outer
        { radius: minDim * 0.24, lineWidth: 3, lineAlpha: 0.7, segments: 10, direction: -1, speed: 1.5 }, // Middle
        { radius: minDim * 0.14, lineWidth: 4, lineAlpha: 0.8, segments: 8, direction: 1, speed: 2.0 }    // Inner (fast)
      ];

      const rings = [];
      ringConfigs.forEach((cfg) => {
        const ring = new PIXI.Graphics();
        const numSegments = cfg.segments;
        const segmentAngle = (Math.PI * 2) / numSegments;
        const gapRatio = 0.15;

        // Draw segmented arcs
        ring.lineStyle(cfg.lineWidth, 0x00d4ff, cfg.lineAlpha);
        for (let s = 0; s < numSegments; s++) {
          const startA = s * segmentAngle;
          const endA = startA + segmentAngle * (1 - gapRatio);
          ring.arc(cx, cy, cfg.radius, startA, endA);
          // Move to start of next segment
          const nextStart = endA + segmentAngle * gapRatio;
          ring.moveTo(
            cx + Math.cos(nextStart) * cfg.radius,
            cy + Math.sin(nextStart) * cfg.radius
          );
        }

        // Add glowing nodes along the ring (5 per ring)
        for (let n = 0; n < 5; n++) {
          const nodeAngle = (n / 5) * Math.PI * 2;
          ring.beginFill(0x00d4ff, 0.9);
          ring.drawCircle(
            cx + Math.cos(nodeAngle) * cfg.radius,
            cy + Math.sin(nodeAngle) * cfg.radius,
            3
          );
          ring.endFill();
        }

        ring.blendMode = PIXI.BLEND_MODES.ADD;
        ring.alpha = 0;

        // Set pivot for rotation around center
        ring.pivot.set(cx, cy);
        ring.position.set(cx, cy);

        stage.addChild(ring);
        rings.push({ graphic: ring, direction: cfg.direction, speed: cfg.speed });
      });

      // --- ELEMENT 2: REACTOR CORE (bright center) ---
      const core = new PIXI.Graphics();
      core.beginFill(0xffffff, 0.15); // LOW alpha - bloom amplifies
      core.drawCircle(cx, cy, minDim * 0.06);
      core.endFill();
      core.blendMode = PIXI.BLEND_MODES.ADD;
      core.alpha = 0;
      stage.addChild(core);

      // --- ELEMENT 3: RADIAL LIGHT RAYS (16 rays from core) ---
      const maxLen = Math.max(screenW, screenH) * 0.7;
      const rays = [];
      for (let i = 0; i < 16; i++) {
        const ray = new PIXI.Graphics();
        const angle = (i / 16) * Math.PI * 2;
        const thickness = 1 + Math.random() * 3;
        const length = maxLen * (0.3 + Math.random() * 0.7);
        const rayAlpha = 0.1 + Math.random() * 0.2;

        ray.lineStyle(thickness, 0x00d4ff, rayAlpha);
        ray.moveTo(cx, cy);
        ray.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
        ray.blendMode = PIXI.BLEND_MODES.ADD;
        ray.alpha = 0;
        stage.addChild(ray);
        rays.push({ graphic: ray, targetAlpha: rayAlpha });
      }

      // --- ELEMENT 4: ENERGY ARCS / LIGHTNING (5 arcs between rings) ---
      const innerR = minDim * 0.14;
      const outerR = minDim * 0.35;
      const arcs = [];
      for (let a = 0; a < 5; a++) {
        const arc = new PIXI.Graphics();
        const arcAngle = (a / 5) * Math.PI * 2 + Math.random() * 0.5;
        const steps = 8;

        arc.lineStyle(2, 0x88eeff, 0.6);
        const startX = cx + Math.cos(arcAngle) * innerR;
        const startY = cy + Math.sin(arcAngle) * innerR;
        arc.moveTo(startX, startY);

        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const r = innerR + (outerR - innerR) * t;
          const jitter = (Math.random() - 0.5) * 30;
          const perpAngle = arcAngle + Math.PI / 2;
          const px = cx + Math.cos(arcAngle) * r + Math.cos(perpAngle) * jitter;
          const py = cy + Math.sin(arcAngle) * r + Math.sin(perpAngle) * jitter;
          arc.lineTo(px, py);
        }

        arc.blendMode = PIXI.BLEND_MODES.ADD;
        arc.alpha = 0;
        stage.addChild(arc);
        arcs.push({ graphic: arc, flickerDelay: 0.5 + Math.random() * 1.0 });
      }

      // --- ELEMENT 5: ORBITING DATA FRAGMENTS (12 small rectangles) ---
      const fragments = [];
      for (let f = 0; f < 12; f++) {
        const frag = new PIXI.Graphics();
        const fragW = 4 + Math.random() * 8;
        const fragH = 2 + Math.random() * 4;
        frag.beginFill(0x00d4ff, 0.3 + Math.random() * 0.3);
        frag.drawRect(-fragW / 2, -fragH / 2, fragW, fragH);
        frag.endFill();
        frag.blendMode = PIXI.BLEND_MODES.ADD;

        const orbitRadius = minDim * (0.2 + Math.random() * 0.2);
        const startAngle = (f / 12) * Math.PI * 2;
        frag.x = cx + Math.cos(startAngle) * orbitRadius;
        frag.y = cy + Math.sin(startAngle) * orbitRadius;
        frag.alpha = 0;
        stage.addChild(frag);

        const endAngle = startAngle + Math.PI * (1 + Math.random());
        fragments.push({
          graphic: frag,
          orbitRadius: orbitRadius,
          startAngle: startAngle,
          endAngle: endAngle
        });
      }

      // --- ELEMENT 6: BLOOM FILTER ---
      const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.3,
        bloomScale: 1.0,
        brightness: 1.3,
        blur: 6,
        quality: 4
      });

      // --- ELEMENT 7: RGB SPLIT FILTER ---
      const rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

      stage.filters = [bloomFilter, rgbFilter];

      // === GSAP TIMELINE ANIMATIONS ===

      // 0.0s - 0.3s: Rings fade in
      rings.forEach((r, i) => {
        timeline.to(r.graphic, {
          alpha: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.1 + i * 0.05);
      });

      // 0.1s: Core appears
      timeline.to(core, {
        alpha: 0.15,
        duration: 0.3,
        ease: 'power2.in'
      }, 0.1);

      // 0.1s: Bloom ramps up
      timeline.to(bloomFilter, {
        bloomScale: 1.5,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.1);

      // 0.2s: Rays fade in with stagger
      rays.forEach((r, i) => {
        timeline.to(r.graphic, {
          alpha: r.targetAlpha + 0.2,
          duration: 0.4,
          ease: 'power2.out'
        }, 0.2 + i * 0.02);
      });

      // 0.3s: Rings start spinning (continuous rotation)
      rings.forEach((r) => {
        timeline.to(r.graphic, {
          rotation: r.direction * Math.PI * 2 * r.speed,
          duration: 2.0,
          ease: 'none'
        }, 0.3);
      });

      // 0.3s: Fragments fade in and start orbiting
      fragments.forEach((f, i) => {
        timeline.to(f.graphic, {
          alpha: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.3 + i * 0.05);

        timeline.to(f.graphic, {
          x: cx + Math.cos(f.endAngle) * f.orbitRadius,
          y: cy + Math.sin(f.endAngle) * f.orbitRadius,
          duration: 1.8,
          ease: 'none'
        }, 0.3);
      });

      // 0.8s: PEAK DISCHARGE - bloom spike, RGB split, core pulse
      timeline.to(bloomFilter, {
        bloomScale: 4.0,
        duration: 0.15,
        ease: 'power2.out'
      }, 0.8);
      timeline.to(bloomFilter, {
        bloomScale: 2.0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 1.0);

      // RGB split flash
      timeline.to(rgbFilter.red, {
        0: -4,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.8);
      timeline.to(rgbFilter.blue, {
        0: 4,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.8);
      timeline.to(rgbFilter.red, {
        0: 0,
        duration: 0.1,
        ease: 'power2.out'
      }, 0.85);
      timeline.to(rgbFilter.blue, {
        0: 0,
        duration: 0.1,
        ease: 'power2.out'
      }, 0.85);

      // Core pulse (yoyo between 0.1 and 0.3)
      timeline.to(core, {
        alpha: 0.3,
        duration: 0.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 4
      }, 0.5);

      // Energy arcs flicker
      arcs.forEach((a) => {
        const delay = a.flickerDelay;
        timeline.to(a.graphic, { alpha: 0.8, duration: 0.05, ease: 'none' }, delay);
        timeline.to(a.graphic, { alpha: 0, duration: 0.1, ease: 'none' }, delay + 0.1);
        timeline.to(a.graphic, { alpha: 0.6, duration: 0.05, ease: 'none' }, delay + 0.3);
        timeline.to(a.graphic, { alpha: 0, duration: 0.15, ease: 'none' }, delay + 0.4);
      });

      // 2.0s - 2.3s: Everything fades out
      rings.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 2.0);
      });

      timeline.to(core, {
        alpha: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 2.0);

      rays.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 2.0);
      });

      fragments.forEach((f) => {
        timeline.to(f.graphic, {
          alpha: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 2.0);
      });

      timeline.to(bloomFilter, {
        bloomScale: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 2.0);
    }

    // === DOM ANIMATIONS ===
    gsap.set(label, { opacity: 0 });
    timeline.to(label, {
      opacity: 0.7,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.3);

    timeline.to(label, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 2.0);
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

    // === DOM LAYER 1: Corner brackets (4 corners) with crosshairs and arm tip ticks - 25px from edges ===
    const brackets = [];
    const corners = [
      { className: 'bracket-tl', pos: 'top:25px;left:25px;', crossPos: 'top:-1px;left:-1px;', start: { x: -80, y: -80 },
        ticks: [
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-h', style: 'right:0;top:-4px;' },
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-v', style: 'left:-4px;bottom:0;' }
        ]
      },
      { className: 'bracket-tr', pos: 'top:25px;right:25px;', crossPos: 'top:-1px;right:-1px;', start: { x: 80, y: -80 },
        ticks: [
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-h', style: 'left:0;top:-4px;' },
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-v', style: 'right:-4px;bottom:0;' }
        ]
      },
      { className: 'bracket-bl', pos: 'bottom:25px;left:25px;', crossPos: 'bottom:-1px;left:-1px;', start: { x: -80, y: 80 },
        ticks: [
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-h', style: 'right:0;bottom:-4px;' },
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-v', style: 'left:-4px;top:0;' }
        ]
      },
      { className: 'bracket-br', pos: 'bottom:25px;right:25px;', crossPos: 'bottom:-1px;right:-1px;', start: { x: 80, y: 80 },
        ticks: [
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-h', style: 'left:0;bottom:-4px;' },
          { cls: 'im-transition-bracket-tick im-transition-bracket-tick-v', style: 'right:-4px;top:0;' }
        ]
      }
    ];

    corners.forEach((corner) => {
      const bracket = document.createElement('div');
      bracket.className = 'im-transition-bracket ' + corner.className;
      bracket.style.cssText = corner.pos;

      // Add crosshair at junction
      const cross = document.createElement('div');
      cross.className = 'im-transition-bracket-cross';
      cross.style.cssText = 'position:absolute;' + corner.crossPos;
      bracket.appendChild(cross);

      // Add tick marks at arm tips
      corner.ticks.forEach((tickDef) => {
        const tick = document.createElement('div');
        tick.className = tickDef.cls;
        tick.style.cssText = 'position:absolute;' + tickDef.style;
        bracket.appendChild(tick);
      });

      container.appendChild(bracket);
      brackets.push({ el: bracket, start: corner.start });
    });

    // === DOM LAYER 1.5: FUI border decorations ===
    // Top horizontal line with ticks
    const topLine = document.createElement('div');
    topLine.className = 'im-transition-fui-line horizontal';
    topLine.style.cssText = 'top:40px;left:50%;transform:translateX(-50%);';
    container.appendChild(topLine);

    const topTicks = document.createElement('div');
    topTicks.className = 'im-transition-fui-ticks';
    topTicks.style.cssText = 'top:33px;left:50%;transform:translateX(-50%);';
    for (let i = 0; i < 7; i++) {
      const tick = document.createElement('div');
      tick.className = 'im-transition-fui-tick';
      topTicks.appendChild(tick);
    }
    container.appendChild(topTicks);

    // Bottom horizontal line with ticks
    const bottomLine = document.createElement('div');
    bottomLine.className = 'im-transition-fui-line horizontal';
    bottomLine.style.cssText = 'bottom:40px;left:50%;transform:translateX(-50%);';
    container.appendChild(bottomLine);

    const bottomTicks = document.createElement('div');
    bottomTicks.className = 'im-transition-fui-ticks';
    bottomTicks.style.cssText = 'bottom:33px;left:50%;transform:translateX(-50%);';
    for (let i = 0; i < 7; i++) {
      const tick = document.createElement('div');
      tick.className = 'im-transition-fui-tick';
      bottomTicks.appendChild(tick);
    }
    container.appendChild(bottomTicks);

    // Left and right vertical lines
    const leftLine = document.createElement('div');
    leftLine.className = 'im-transition-fui-line vertical';
    leftLine.style.cssText = 'left:40px;top:50%;transform:translateY(-50%);';
    container.appendChild(leftLine);

    const rightLine = document.createElement('div');
    rightLine.className = 'im-transition-fui-line vertical';
    rightLine.style.cssText = 'right:40px;top:50%;transform:translateY(-50%);';
    container.appendChild(rightLine);

    // Top center label
    const topLabel = document.createElement('div');
    topLabel.className = 'im-transition-fui-label im-transition-fui-label-top';
    topLabel.textContent = '◇ S.H.I.E.L.D. MAINFRAME ◇';
    container.appendChild(topLabel);

    // Bottom center status indicators (7 small rectangles)
    const bottomIndicators = document.createElement('div');
    bottomIndicators.className = 'im-transition-fui-indicators';
    bottomIndicators.style.cssText = 'bottom:18px;left:50%;transform:translateX(-50%);';
    for (let i = 0; i < 7; i++) {
      const dot = document.createElement('div');
      dot.className = 'im-transition-fui-dot' + (i % 2 === 1 ? ' im-transition-fui-dot-dim' : '');
      bottomIndicators.appendChild(dot);
    }
    container.appendChild(bottomIndicators);

    // Side accent hash marks (left and right) - 3 parallel lines each
    const leftHash = document.createElement('div');
    leftHash.className = 'im-transition-fui-hash im-transition-fui-hash-left';
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'im-transition-fui-hash-line';
      leftHash.appendChild(line);
    }
    container.appendChild(leftHash);

    const rightHash = document.createElement('div');
    rightHash.className = 'im-transition-fui-hash im-transition-fui-hash-right';
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'im-transition-fui-hash-line';
      rightHash.appendChild(line);
    }
    container.appendChild(rightHash);

    // Small data readout text in lower corners
    const readoutBL = document.createElement('div');
    readoutBL.className = 'im-transition-fui-readout im-transition-fui-readout-bl';
    readoutBL.textContent = 'SYS: 100%';
    container.appendChild(readoutBL);

    const readoutBR = document.createElement('div');
    readoutBR.className = 'im-transition-fui-readout im-transition-fui-readout-br';
    readoutBR.textContent = 'ENC: AES-256';
    container.appendChild(readoutBR);

    const fuiElements = [topLine, topTicks, bottomLine, bottomTicks, leftLine, rightLine, topLabel, bottomIndicators, leftHash, rightHash, readoutBL, readoutBR];

    // === DOM LAYER 2: Text container (centered, above PixiJS canvas) ===
    // NOTE: NO overflow:hidden — the large text-shadow must spread naturally without clipping
    const textContainer = document.createElement('div');
    textContainer.style.cssText = 'position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;max-width:95%;text-align:center;background:none;border:none;outline:none;';
    container.appendChild(textContainer);

    // Create TWO-LINE title: "ACCESS" on top, "GRANTED" on bottom
    const titleLine1 = document.createElement('div');
    titleLine1.className = 'im-transition-title';
    titleLine1.textContent = 'ACCESS';
    textContainer.appendChild(titleLine1);

    const titleLine2 = document.createElement('div');
    titleLine2.className = 'im-transition-title';
    titleLine2.style.marginTop = '0.5rem'; // Gap between ACCESS and GRANTED
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
      const maxLen = Math.max(screenW, screenH) * 0.9;

      // NOTE: Glow core ellipse REMOVED - the radial starburst rays converging at center
      // with additive blending + AdvancedBloomFilter naturally creates the volumetric halo.
      // A visible ellipse shape looked like a "cyan egg" behind the text.

      // --- EFFECT 1: RADIAL STARBURST RAYS (28 rays emanating from center) ---
      const raysContainer = new PIXI.Container();
      raysContainer.blendMode = PIXI.BLEND_MODES.ADD;
      stage.addChild(raysContainer);

      const rays = [];
      for (let i = 0; i < 28; i++) {
        const ray = new PIXI.Graphics();
        const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.1 - 0.05); // Slight randomness
        const thickness = 1 + Math.random() * 6; // 1-7px wide
        const length = maxLen * (0.5 + Math.random() * 0.5); // 50-100% max length
        const rayAlpha = 0.15 + Math.random() * 0.35; // 0.15-0.5 alpha
        const color = Math.random() > 0.7 ? 0x88eeff : 0x00d4ff;

        ray.lineStyle(thickness, color, rayAlpha);
        ray.moveTo(centerX, centerY);
        ray.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
        ray.alpha = 0;
        raysContainer.addChild(ray);
        rays.push({ graphic: ray, targetAlpha: rayAlpha });
      }

      // --- EFFECT 1.5: EXTRA THICK HORIZONTAL RAYS for lens flare band ---
      const horizontalRays = [];
      const hAngles = [-0.05, 0.02, Math.PI - 0.03, Math.PI + 0.04, -0.12]; // Near horizontal
      for (let i = 0; i < 5; i++) {
        const hRay = new PIXI.Graphics();
        const thickness = 8 + Math.random() * 7; // 8-15px thick
        const length = maxLen * 1.1;
        const hAlpha = 0.3 + Math.random() * 0.3;

        hRay.lineStyle(thickness, 0x00d4ff, hAlpha);
        hRay.moveTo(centerX, centerY);
        hRay.lineTo(centerX + Math.cos(hAngles[i]) * length, centerY + Math.sin(hAngles[i]) * length);
        hRay.alpha = 0;
        raysContainer.addChild(hRay);
        horizontalRays.push({ graphic: hRay, targetAlpha: hAlpha });
      }

      // --- EFFECT 3: Particle Burst Container ---
      const particlesContainer = new PIXI.Container();
      particlesContainer.blendMode = PIXI.BLEND_MODES.ADD;
      stage.addChild(particlesContainer);

      // --- EFFECT 4: Horizontal Lens Flare (full width, very thin) ---
      const lensFlare = new PIXI.Graphics();
      lensFlare.beginFill(0xffffff, 0.6);
      lensFlare.drawRect(0, centerY - 2, screenW, 4);
      lensFlare.endFill();
      lensFlare.blendMode = PIXI.BLEND_MODES.ADD;
      lensFlare.alpha = 0;

      const flareGlowFilter = new PIXI.filters.GlowFilter({
        distance: 20,
        outerStrength: 3,
        innerStrength: 1,
        color: 0x00d4ff,
        quality: 0.3
      });
      lensFlare.filters = [flareGlowFilter];
      stage.addChild(lensFlare);

      // --- EFFECT 5: Bloom Filter on Stage - AGGRESSIVE ---
      const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.3, // Lower threshold = more elements bloom
        bloomScale: 1.5, // Higher starting value
        brightness: 1.4,
        blur: 8, // More blur
        quality: 4
      });

      // --- EFFECT 6: RGB Split Filter on Stage ---
      const rgbSplitFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

      stage.filters = [bloomFilter, rgbSplitFilter];

      // === PIXIJS TIMELINE ANIMATIONS ===

      // 0.0s: Bloom ramps up
      timeline.to(bloomFilter, {
        bloomScale: 2.0,
        duration: 0.4,
        ease: 'power2.out'
      }, 0);

      // 0.1s: Radial rays fade in with stagger
      rays.forEach((r, i) => {
        timeline.to(r.graphic, {
          alpha: r.targetAlpha * 0.6,
          duration: 0.3,
          ease: 'power2.in'
        }, 0.1 + (i * 0.01));
      });

      // 0.15s: Horizontal rays fade in
      horizontalRays.forEach((r, i) => {
        timeline.to(r.graphic, {
          alpha: r.targetAlpha * 0.5,
          duration: 0.35,
          ease: 'power2.in'
        }, 0.15 + (i * 0.02));
      });

      // 0.5s: TEXT SLAM MOMENT - spike effects - EXPLOSIVE
      // Radial rays spike to full brightness
      rays.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.5);
        timeline.to(r.graphic, {
          alpha: r.targetAlpha * 0.8,
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0.6);
      });

      // Horizontal rays spike
      horizontalRays.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.5);
        timeline.to(r.graphic, {
          alpha: r.targetAlpha,
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0.6);
      });

      // Bloom spike - MASSIVE
      timeline.to(bloomFilter, {
        bloomScale: 5.0, // Very high spike
        duration: 0.15,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(bloomFilter, {
        bloomScale: 2.5, // Higher settle
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.65);

      // RGB Split flash - STRONGER
      timeline.to(rgbSplitFilter.red, {
        0: -5,
        1: 2,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(rgbSplitFilter.blue, {
        0: 5,
        1: -2,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(rgbSplitFilter.red, {
        0: 0,
        1: 0,
        duration: 0.15,
        ease: 'power2.out'
      }, 0.55);
      timeline.to(rgbSplitFilter.blue, {
        0: 0,
        1: 0,
        duration: 0.15,
        ease: 'power2.out'
      }, 0.55);

      // Lens flare flash
      timeline.to(lensFlare, {
        alpha: 0.8,
        duration: 0.05,
        ease: 'power2.out'
      }, 0.5);
      timeline.to(lensFlare, {
        alpha: 0.2,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.55);

      // 0.5s: Particle burst - spawn 50 particles (circles and elongated debris)
      timeline.call(() => {
        for (let i = 0; i < 50; i++) {
          const particle = new PIXI.Graphics();
          const isElongated = Math.random() > 0.65; // ~35% elongated for motion blur feel
          const radius = 2 + Math.random() * 2; // 2-4px radius
          const color = Math.random() > 0.4 ? 0x00d4ff : 0xffffff;

          particle.beginFill(color, 1.0);
          if (isElongated) {
            particle.drawRect(-1, -4, 2, 8); // Elongated debris
          } else {
            particle.drawCircle(0, 0, radius);
          }
          particle.endFill();
          particle.blendMode = PIXI.BLEND_MODES.ADD;

          // Start clustered near center
          particle.x = centerX + (Math.random() - 0.5) * 100;
          particle.y = centerY + (Math.random() - 0.5) * 60;
          particle.alpha = 0;

          particlesContainer.addChild(particle);

          // Random outward direction - some slow, some fast
          const angle = Math.random() * Math.PI * 2;
          const isFast = Math.random() > 0.5;
          const distance = isFast ? (400 + Math.random() * 300) : (150 + Math.random() * 150);
          const targetX = particle.x + Math.cos(angle) * distance;
          const targetY = particle.y + Math.sin(angle) * distance;
          const duration = isFast ? (1.0 + Math.random() * 0.5) : (1.2 + Math.random() * 0.8);

          // Animate particle outward - START AT FULL BRIGHTNESS
          gsap.to(particle, {
            alpha: 1.0,
            duration: 0.02,
            ease: 'none'
          });
          gsap.to(particle, {
            x: targetX,
            y: targetY,
            alpha: 0,
            scale: 0.3,
            duration: duration,
            ease: 'power2.out',
            delay: Math.random() * 0.1
          });
        }
      }, null, 0.5);

      // 1.8s: Fade out all PixiJS effects
      rays.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 0,
          duration: 0.5,
          ease: 'power2.in'
        }, 1.8);
      });

      horizontalRays.forEach((r) => {
        timeline.to(r.graphic, {
          alpha: 0,
          duration: 0.5,
          ease: 'power2.in'
        }, 1.8);
      });

      timeline.to(lensFlare, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 1.8);

      timeline.to(bloomFilter, {
        bloomScale: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 1.8);
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
