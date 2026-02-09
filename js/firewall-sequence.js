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
    // === DOM CONTAINER ===
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    const label = document.createElement('div');
    label.className = 'im-transition-fui-label';
    label.style.cssText = 'bottom:30px;left:50%;transform:translateX(-50%);top:auto;';
    label.textContent = '◇ ARC REACTOR DISCHARGE ◇';
    container.appendChild(label);

    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const w = app.screen.width;
      const h = app.screen.height;
      const cx = w / 2;
      const cy = h / 2;
      const minDim = Math.min(w, h);
      const maxLen = Math.max(w, h) * 0.8;

      // =========================================================
      // TWO-CONTAINER ARCHITECTURE: Hardware (NORMAL blend) vs Energy (ADD blend + bloom)
      // =========================================================
      const hardwareContainer = new PIXI.Container();
      const energyContainer = new PIXI.Container();
      stage.addChild(hardwareContainer);  // Hardware renders FIRST (behind)
      stage.addChild(energyContainer);    // Energy renders ON TOP (in front)

      // =========================================================
      // LAYER 1: HEXAGONAL GRID BACKGROUND (HARDWARE — NORMAL blend)
      // =========================================================
      const hexGrid = new PIXI.Graphics();
      const hexRadius = 30;
      const hexW = hexRadius * Math.sqrt(3);
      const hexH = hexRadius * 2;
      hexGrid.lineStyle(1, 0x00d4ff, 0.04);

      for (let row = -2; row < Math.ceil(h / (hexH * 0.75)) + 2; row++) {
        for (let col = -2; col < Math.ceil(w / hexW) + 2; col++) {
          const offsetX = (row % 2) * (hexW / 2);
          const gx = col * hexW + offsetX;
          const gy = row * hexH * 0.75;
          const points = [];
          for (let v = 0; v < 6; v++) {
            points.push(gx + hexRadius * Math.cos(Math.PI / 3 * v + Math.PI / 6));
            points.push(gy + hexRadius * Math.sin(Math.PI / 3 * v + Math.PI / 6));
          }
          hexGrid.drawPolygon(points);
        }
      }
      // NORMAL blendMode (default) — hardware stays dark
      hexGrid.alpha = 0;
      hardwareContainer.addChild(hexGrid);

      // =========================================================
      // LAYER 2: ATMOSPHERIC HAZE FILLS (ENERGY — ADD blend)
      // REDUCED alphas to prevent teal flooding — haze should be barely perceptible
      // =========================================================
      const atmoOuter = new PIXI.Graphics();
      atmoOuter.beginFill(0x0a3355, 0.03);
      atmoOuter.drawCircle(cx, cy, minDim * 0.45);
      atmoOuter.endFill();
      atmoOuter.blendMode = PIXI.BLEND_MODES.ADD;
      atmoOuter.alpha = 0;
      energyContainer.addChild(atmoOuter);

      const atmoMid1 = new PIXI.Graphics();
      atmoMid1.beginFill(0x003366, 0.025);
      atmoMid1.drawCircle(cx, cy, minDim * 0.32);
      atmoMid1.endFill();
      atmoMid1.blendMode = PIXI.BLEND_MODES.ADD;
      atmoMid1.alpha = 0;
      energyContainer.addChild(atmoMid1);

      const atmoMid2 = new PIXI.Graphics();
      atmoMid2.beginFill(0x004477, 0.03);
      atmoMid2.drawCircle(cx, cy, minDim * 0.20);
      atmoMid2.endFill();
      atmoMid2.blendMode = PIXI.BLEND_MODES.ADD;
      atmoMid2.alpha = 0;
      energyContainer.addChild(atmoMid2);

      // =========================================================
      // LAYER 3: PERIPHERAL DATA PANELS (HARDWARE — NORMAL blend)
      // =========================================================
      const panels = new PIXI.Graphics();
      for (let p = 0; p < 18; p++) {
        const isLeft = p < 9;
        const panelX = isLeft ? (10 + Math.random() * 80) : (w - 90 + Math.random() * 80);
        const panelY = h * 0.1 + Math.random() * h * 0.8;
        const panelW = 30 + Math.random() * 50;
        const panelH = 8 + Math.random() * 22;

        if (Math.random() > 0.6) {
          panels.beginFill(0x00d4ff, 0.03);
          panels.drawRect(panelX, panelY, panelW, panelH);
          panels.endFill();
        }
        panels.lineStyle(1, 0x00d4ff, 0.12 + Math.random() * 0.15);
        panels.drawRect(panelX, panelY, panelW, panelH);
      }
      // NORMAL blendMode (default) — hardware stays dark
      panels.alpha = 0;
      hardwareContainer.addChild(panels);

      // =========================================================
      // LAYER 4: RING SYSTEM — SOLID MECHANICAL PLATE SEGMENTS
      // Two-tone rendering: dark filled body + bright inner edge (specular)
      // =========================================================

      // Helper: Draw filled arc-band polygon (traces inner arc then outer arc)
      function drawArcPlate(g, centerX, centerY, innerR, outerR, startAngle, endAngle, fillColor, fillAlpha, steps) {
        steps = steps || 8;
        const points = [];
        // Trace inner arc forward
        for (let i = 0; i <= steps; i++) {
          const a = startAngle + (endAngle - startAngle) * (i / steps);
          points.push(centerX + Math.cos(a) * innerR);
          points.push(centerY + Math.sin(a) * innerR);
        }
        // Trace outer arc backward
        for (let i = steps; i >= 0; i--) {
          const a = startAngle + (endAngle - startAngle) * (i / steps);
          points.push(centerX + Math.cos(a) * outerR);
          points.push(centerY + Math.sin(a) * outerR);
        }
        g.beginFill(fillColor, fillAlpha);
        g.drawPolygon(points);
        g.endFill();
      }

      // Ring configurations: outer rings = wider bands, darker; inner rings = narrower, brighter edges
      // TWEAK 2: bodyAlpha → 0.95 for full opacity (metal is opaque)
      // TWEAK 7: edgeAlpha +20%, inner ring edgeWidth +1px for sharper specular highlights
      const ringConfigs = [
        // OUTER RINGS — widest bands, darkest bodies, subtle edges
        { innerR: 0.39, outerR: 0.44, numSegs: 14, gapDeg: 3, bodyColor: 0x0a1520, bodyAlpha: 0.95, edgeColor: 0x1a5577, edgeAlpha: 0.65, edgeWidth: 1.5, direction: 1, speed: 5.0 },
        { innerR: 0.35, outerR: 0.38, numSegs: 16, gapDeg: 2.5, bodyColor: 0x0d1a2d, bodyAlpha: 0.95, edgeColor: 0x00a4cc, edgeAlpha: 0.75, edgeWidth: 2, direction: -1, speed: 4.0 },
        // MID RINGS — medium width, brighter edges, most detailed
        { innerR: 0.30, outerR: 0.34, numSegs: 18, gapDeg: 2, bodyColor: 0x0f1e33, bodyAlpha: 0.95, edgeColor: 0x00d4ff, edgeAlpha: 0.85, edgeWidth: 2.5, direction: 1, speed: 3.5 },
        { innerR: 0.265, outerR: 0.29, numSegs: 14, gapDeg: 2, bodyColor: 0x0d1a2d, bodyAlpha: 0.95, edgeColor: 0x00bbdd, edgeAlpha: 0.75, edgeWidth: 2, direction: -1, speed: 3.0 },
        { innerR: 0.23, outerR: 0.26, numSegs: 20, gapDeg: 1.5, bodyColor: 0x112640, bodyAlpha: 0.95, edgeColor: 0x00d4ff, edgeAlpha: 0.9, edgeWidth: 3, direction: 1, speed: 2.5 },
        // INNER RINGS — narrower bands, brightest edges (near-white), fastest rotation
        { innerR: 0.19, outerR: 0.22, numSegs: 16, gapDeg: 2, bodyColor: 0x122844, bodyAlpha: 0.95, edgeColor: 0x44ccff, edgeAlpha: 0.95, edgeWidth: 3, direction: -1, speed: 2.0 },
        { innerR: 0.155, outerR: 0.185, numSegs: 14, gapDeg: 2, bodyColor: 0x153050, bodyAlpha: 0.95, edgeColor: 0x66ddff, edgeAlpha: 0.95, edgeWidth: 3.5, direction: 1, speed: 1.8 },
        { innerR: 0.12, outerR: 0.15, numSegs: 12, gapDeg: 2.5, bodyColor: 0x183858, bodyAlpha: 0.95, edgeColor: 0x88eeff, edgeAlpha: 1.0, edgeWidth: 4, direction: -1, speed: 1.5 },
      ];

      const blockRings = [];

      ringConfigs.forEach((rc) => {
        const ring = new PIXI.Graphics();
        const innerRadius = minDim * rc.innerR;
        const outerRadius = minDim * rc.outerR;
        const gapAngle = (rc.gapDeg * Math.PI) / 180;

        // TWEAK 4: Generate IRREGULAR segment widths (60-140% of base width)
        const segAngles = [];
        let totalAngle = 0;
        for (let s = 0; s < rc.numSegs; s++) {
          const baseAngle = (Math.PI * 2) / rc.numSegs;
          const variation = baseAngle * (0.6 + Math.random() * 0.8);
          segAngles.push(variation);
          totalAngle += variation;
        }
        // Normalize so they sum to exactly 2*PI
        const scale = (Math.PI * 2) / totalAngle;
        for (let s = 0; s < segAngles.length; s++) {
          segAngles[s] *= scale;
        }

        let startA = 0;
        for (let s = 0; s < rc.numSegs; s++) {
          const segAngle = segAngles[s];
          const plateAngle = segAngle - gapAngle;
          const endA = startA + plateAngle;

          // TWEAK 3: Per-segment brightness randomization (25-40% variation)
          const segAlphaVariation = 0.65 + Math.random() * 0.35; // 0.65-1.0 multiplier
          const thisSegAlpha = rc.bodyAlpha * segAlphaVariation;
          // Occasionally brighten some segments
          let thisBodyColor = rc.bodyColor;
          if (Math.random() > 0.7) {
            thisBodyColor = rc.bodyColor + 0x0a0a10; // Slightly brighter
          }

          // 1. PLATE BODY — filled polygon with per-segment color/alpha variation
          drawArcPlate(ring, cx, cy, innerRadius, outerRadius, startA, endA, thisBodyColor, thisSegAlpha, 6);

          // 2. BRIGHT INNER EDGE — specular highlight on core-facing face
          ring.lineStyle(rc.edgeWidth, rc.edgeColor, rc.edgeAlpha);
          ring.arc(cx, cy, innerRadius, startA, endA);
          // Move pen to avoid connecting line to next segment
          const nextStart = endA + gapAngle;
          if (s < rc.numSegs - 1) {
            ring.moveTo(cx + Math.cos(nextStart) * innerRadius, cy + Math.sin(nextStart) * innerRadius);
          }

          // 3. FAINT OUTER EDGE — very dim line on shadow side
          ring.lineStyle(1, rc.edgeColor, rc.edgeAlpha * 0.2);
          ring.arc(cx, cy, outerRadius, startA, endA);
          if (s < rc.numSegs - 1) {
            ring.moveTo(cx + Math.cos(nextStart) * outerRadius, cy + Math.sin(nextStart) * outerRadius);
          }

          // 4. SURFACE DETAIL — thin circumferential line through the middle of the plate (for wider rings only)
          if (outerRadius - innerRadius > 15) {
            const midRadius = (innerRadius + outerRadius) / 2;
            ring.lineStyle(1, rc.edgeColor, rc.edgeAlpha * 0.15);
            ring.arc(cx, cy, midRadius, startA + gapAngle * 0.5, endA - gapAngle * 0.5);
            if (s < rc.numSegs - 1) {
              ring.moveTo(cx + Math.cos(nextStart) * midRadius, cy + Math.sin(nextStart) * midRadius);
            }
          }

          // Reset lineStyle for next segment's fill
          ring.lineStyle(0);
          startA += segAngle; // Move to next segment (includes gap)
        }

        // TWEAK 6: Explicit dark gap shadow circles at ring boundaries
        ring.lineStyle(1.5, 0x000508, 0.6);
        ring.drawCircle(cx, cy, innerRadius - 1);
        ring.lineStyle(1, 0x000508, 0.4);
        ring.drawCircle(cx, cy, outerRadius + 1);
        ring.lineStyle(0);

        // GLOWING NODES on some segments (every 3rd-4th segment)
        let nodeStartA = 0;
        for (let n = 0; n < rc.numSegs; n++) {
          if (n % (3 + Math.floor(Math.random() * 2)) === 0) {
            const nodeAngle = nodeStartA + (segAngles[n] - gapAngle) * 0.5;
            const nodeR = innerRadius + 2; // Just inside the inner edge
            ring.beginFill(0xffffff, 0.7);
            ring.drawCircle(cx + Math.cos(nodeAngle) * nodeR, cy + Math.sin(nodeAngle) * nodeR, 2.5);
            ring.endFill();
            ring.beginFill(rc.edgeColor, 0.5);
            ring.drawCircle(cx + Math.cos(nodeAngle) * nodeR, cy + Math.sin(nodeAngle) * nodeR, 4);
            ring.endFill();
          }
          nodeStartA += segAngles[n];
        }

        // NORMAL blendMode (default) — dark steel fills stay dark, bright edges stay sharp
        ring.pivot.set(cx, cy);
        ring.position.set(cx, cy);
        ring.alpha = 0;
        hardwareContainer.addChild(ring);
        blockRings.push({ graphic: ring, dir: rc.direction, speed: rc.speed });
      });

      // THIN ACCENT RINGS — single bright lines between main bands (no fill)
      const accentRings = new PIXI.Graphics();
      const accentRadii = [
        { r: 0.345, color: 0x00d4ff, alpha: 0.2, width: 1 },
        { r: 0.295, color: 0x00aacc, alpha: 0.15, width: 1 },
        { r: 0.255, color: 0x00d4ff, alpha: 0.2, width: 1 },
        { r: 0.188, color: 0x44ccff, alpha: 0.2, width: 1 },
      ];
      accentRadii.forEach((ar) => {
        accentRings.lineStyle(ar.width, ar.color, ar.alpha);
        accentRings.drawCircle(cx, cy, minDim * ar.r);
      });
      // NORMAL blendMode (default) — thin accent lines stay crisp
      accentRings.alpha = 0;
      hardwareContainer.addChild(accentRings);

      // =========================================================
      // LAYER 5: CORE (ENERGY — ADD blend, 5-layer blown-out radiant source)
      // TWEAK 5: Expanded outer layer radii (~2x) for "blown-out" effect — fills ~15% of image
      // =========================================================
      const coreL1 = new PIXI.Graphics();
      coreL1.beginFill(0x003366, 0.1);
      coreL1.drawCircle(cx, cy, minDim * 0.22);
      coreL1.endFill();
      coreL1.blendMode = PIXI.BLEND_MODES.ADD;
      coreL1.alpha = 0;
      energyContainer.addChild(coreL1);

      const coreL2 = new PIXI.Graphics();
      coreL2.beginFill(0x0066aa, 0.15);
      coreL2.drawCircle(cx, cy, minDim * 0.16);
      coreL2.endFill();
      coreL2.blendMode = PIXI.BLEND_MODES.ADD;
      coreL2.alpha = 0;
      energyContainer.addChild(coreL2);

      const coreL3 = new PIXI.Graphics();
      coreL3.beginFill(0x00aaff, 0.25);
      coreL3.drawCircle(cx, cy, minDim * 0.11);
      coreL3.endFill();
      coreL3.blendMode = PIXI.BLEND_MODES.ADD;
      coreL3.alpha = 0;
      energyContainer.addChild(coreL3);

      const coreL4 = new PIXI.Graphics();
      coreL4.beginFill(0x88ddff, 0.4);
      coreL4.drawCircle(cx, cy, minDim * 0.055);
      coreL4.endFill();
      coreL4.blendMode = PIXI.BLEND_MODES.ADD;
      coreL4.alpha = 0;
      energyContainer.addChild(coreL4);

      const coreL5 = new PIXI.Graphics();
      coreL5.beginFill(0xffffff, 0.6);
      coreL5.drawCircle(cx, cy, minDim * 0.025);
      coreL5.endFill();
      coreL5.blendMode = PIXI.BLEND_MODES.ADD;
      coreL5.alpha = 0;
      energyContainer.addChild(coreL5);

      const coreLayers = [coreL1, coreL2, coreL3, coreL4, coreL5];

      // =========================================================
      // LAYER 6: RADIAL RAYS (ENERGY — ADD blend, 30 rays, NO CARDINAL CROSSHAIR)
      // =========================================================
      const rays = [];
      const numRays = 30;
      const angleOffset = 0.15 + Math.random() * 0.3;
      for (let i = 0; i < numRays; i++) {
        const ray = new PIXI.Graphics();
        const angle = angleOffset + (i / numRays) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
        const isThick = Math.random() < 0.2;
        const thickness = isThick ? (3 + Math.random() * 4) : (1 + Math.random() * 1.5);
        const length = maxLen * (isThick ? (0.5 + Math.random() * 0.5) : (0.15 + Math.random() * 0.4));
        const rayColor = isThick ? 0x88ddff : 0x00d4ff;
        const rayAlpha = isThick ? 0.35 : (0.08 + Math.random() * 0.12);

        ray.lineStyle(thickness, rayColor, rayAlpha);
        ray.moveTo(cx, cy);
        ray.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
        ray.blendMode = PIXI.BLEND_MODES.ADD;
        ray.alpha = 0;
        energyContainer.addChild(ray);
        rays.push({ graphic: ray, targetAlpha: isThick ? 0.5 : (0.15 + Math.random() * 0.15) });
      }

      // =========================================================
      // LAYER 7: LIGHTNING WITH BRANCHING (ENERGY — ADD blend, 6 bolts, dual-layer)
      // =========================================================
      const boltInnerR = minDim * 0.08;
      const boltOuterR = minDim * 0.55;
      const bolts = [];

      for (let a = 0; a < 6; a++) {
        const boltGlow = new PIXI.Graphics();
        const boltCore = new PIXI.Graphics();
        const boltAngle = (a / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const steps = 12;
        const points = [];

        const startX = cx + Math.cos(boltAngle) * boltInnerR;
        const startY = cy + Math.sin(boltAngle) * boltInnerR;
        points.push({ x: startX, y: startY });

        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const r = boltInnerR + (boltOuterR - boltInnerR) * t;
          const jitter = (Math.random() - 0.5) * 60;
          const perpAngle = boltAngle + Math.PI / 2;
          const px = cx + Math.cos(boltAngle) * r + Math.cos(perpAngle) * jitter;
          const py = cy + Math.sin(boltAngle) * r + Math.sin(perpAngle) * jitter;
          points.push({ x: px, y: py });
        }

        // Draw glow layer (wide, cyan)
        boltGlow.lineStyle(8, 0x00d4ff, 0.25);
        boltGlow.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length; p++) {
          boltGlow.lineTo(points[p].x, points[p].y);
        }

        // Draw core layer (thin, white)
        boltCore.lineStyle(3, 0xffffff, 0.85);
        boltCore.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length; p++) {
          boltCore.lineTo(points[p].x, points[p].y);
        }

        // Add 2 branches
        for (let br = 0; br < 2; br++) {
          const branchIdx = 3 + Math.floor(Math.random() * 6);
          if (branchIdx < points.length) {
            const brPt = points[branchIdx];
            const brAngle = boltAngle + (Math.random() - 0.5) * 1.2;
            boltGlow.lineStyle(4, 0x00d4ff, 0.15);
            boltCore.lineStyle(2, 0xaaeeff, 0.6);
            boltGlow.moveTo(brPt.x, brPt.y);
            boltCore.moveTo(brPt.x, brPt.y);
            let bx = brPt.x, by = brPt.y;
            for (let bs = 0; bs < 4; bs++) {
              bx += Math.cos(brAngle) * 20 + (Math.random() - 0.5) * 25;
              by += Math.sin(brAngle) * 20 + (Math.random() - 0.5) * 25;
              boltGlow.lineTo(bx, by);
              boltCore.lineTo(bx, by);
            }
          }
        }

        boltGlow.blendMode = PIXI.BLEND_MODES.ADD;
        boltCore.blendMode = PIXI.BLEND_MODES.ADD;
        boltGlow.alpha = 0;
        boltCore.alpha = 0;
        energyContainer.addChild(boltGlow);
        energyContainer.addChild(boltCore);
        bolts.push({ glow: boltGlow, core: boltCore, delay: 0.4 + Math.random() * 0.8 });
      }

      // =========================================================
      // LAYER 8: HORIZONTAL RING OVERFLOW STREAKS (ENERGY — ADD blend)
      // =========================================================
      const overflowStreaks = [];
      const outerRingR = minDim * 0.42;
      for (let os = 0; os < 8; os++) {
        const streak = new PIXI.Graphics();
        const isLeft = os < 4;
        const yOffset = (Math.random() - 0.5) * 40;
        const startX = isLeft ? (cx - outerRingR) : (cx + outerRingR);
        const endX = isLeft ? 0 : w;

        streak.lineStyle(1 + Math.random(), 0x00d4ff, 0.3);
        streak.moveTo(startX, cy + yOffset);
        streak.lineTo(endX, cy + yOffset);
        streak.blendMode = PIXI.BLEND_MODES.ADD;
        streak.alpha = 0;
        energyContainer.addChild(streak);
        overflowStreaks.push(streak);
      }

      // =========================================================
      // LAYER 9: ORBITING FRAGMENTS + HORIZONTAL STREAKS (ENERGY — ADD blend)
      // =========================================================
      const fragments = [];
      const fragColors = [0x1a5577, 0x00d4ff, 0x44ccff, 0x88ddff];
      for (let f = 0; f < 20; f++) {
        const frag = new PIXI.Graphics();
        const isLarge = (f % 5 === 0);
        const fragW = isLarge ? (8 + Math.random() * 15) : (3 + Math.random() * 8);
        const fragH = isLarge ? (4 + Math.random() * 8) : (1 + Math.random() * 4);
        const fragColor = fragColors[Math.floor(Math.random() * fragColors.length)];
        frag.beginFill(fragColor, 0.2 + Math.random() * 0.3);
        frag.drawRect(-fragW / 2, -fragH / 2, fragW, fragH);
        frag.endFill();
        frag.blendMode = PIXI.BLEND_MODES.ADD;

        const orbitRadius = minDim * (0.15 + Math.random() * 0.25);
        const startAngle = (f / 20) * Math.PI * 2;
        frag.x = cx + Math.cos(startAngle) * orbitRadius;
        frag.y = cy + Math.sin(startAngle) * orbitRadius;
        frag.alpha = 0;
        energyContainer.addChild(frag);

        const endAngle = startAngle + Math.PI * (0.8 + Math.random() * 1.5);
        fragments.push({ graphic: frag, orbitRadius, endAngle });
      }

      const streaks = [];
      for (let d = 0; d < 25; d++) {
        const streak = new PIXI.Graphics();
        const streakW = 20 + Math.random() * 60;
        const streakH = 1 + Math.random() * 3;
        const streakY = cy + (Math.random() - 0.5) * h * 0.7;
        const goRight = Math.random() > 0.5;
        const startX = goRight ? -streakW : w + streakW;
        const streakColor = fragColors[Math.floor(Math.random() * fragColors.length)];

        streak.beginFill(streakColor, 0.15 + Math.random() * 0.25);
        streak.drawRect(0, 0, streakW, streakH);
        streak.endFill();
        streak.blendMode = PIXI.BLEND_MODES.ADD;
        streak.x = startX;
        streak.y = streakY;
        streak.alpha = 0;
        energyContainer.addChild(streak);

        const targetX = goRight ? (w + streakW) : (-streakW);
        streaks.push({ graphic: streak, targetX, enterDelay: 0.3 + Math.random() * 1.2 });
      }

      // =========================================================
      // LAYER 10: FILTERS — Two-container architecture
      // energyContainer: bloom + glow (energy effects bloom, hardware stays crisp)
      // stage: RGB split only (brief flash at peak discharge)
      // hardwareContainer: NO filters (dark metal stays dark)
      // =========================================================
      const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.15,
        bloomScale: 2.5,
        brightness: 1.3,
        blur: 8,
        quality: 6
      });

      const glowFilter = new PIXI.filters.GlowFilter({
        distance: 15,
        outerStrength: 2,
        innerStrength: 1,
        color: 0x00d4ff,
        quality: 0.3
      });

      // Bloom + glow on ENERGY container only — core/rays/lightning bloom, rings stay dark
      energyContainer.filters = [bloomFilter, glowFilter];

      // RGB split on stage for peak discharge flash
      const rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);
      stage.filters = [rgbFilter];

      // =========================================================
      // GSAP TIMELINE ANIMATIONS
      // =========================================================

      // --- 0.0s - 0.3s: FADE IN ---
      timeline.to(hexGrid, { alpha: 0.5, duration: 0.3, ease: 'power2.out' }, 0);
      timeline.to(atmoOuter, { alpha: 0.6, duration: 0.4, ease: 'power2.out' }, 0.05);
      timeline.to(atmoMid1, { alpha: 0.5, duration: 0.4, ease: 'power2.out' }, 0.08);
      timeline.to(atmoMid2, { alpha: 0.6, duration: 0.4, ease: 'power2.out' }, 0.1);
      timeline.to(panels, { alpha: 0.6, duration: 0.4, ease: 'power2.out' }, 0.1);

      blockRings.forEach((r, i) => {
        timeline.to(r.graphic, { alpha: 1, duration: 0.3, ease: 'power2.out' }, 0.1 + i * 0.02);
      });

      timeline.to(accentRings, { alpha: 0.6, duration: 0.35, ease: 'power2.out' }, 0.15);

      coreLayers.forEach((c, i) => {
        timeline.to(c, { alpha: 0.6 + i * 0.08, duration: 0.25, ease: 'power2.in' }, 0.1 + i * 0.03);
      });

      timeline.to(bloomFilter, { bloomScale: 3.0, duration: 0.4, ease: 'power2.out' }, 0.1);

      rays.forEach((r, i) => {
        timeline.to(r.graphic, { alpha: r.targetAlpha, duration: 0.3, ease: 'power2.out' }, 0.1 + i * 0.008);
      });

      // --- 0.3s - 0.8s: SPINNING & ORBITING ---
      blockRings.forEach((r) => {
        timeline.to(r.graphic, { rotation: r.dir * Math.PI * 2 * r.speed, duration: 2.0, ease: 'none' }, 0.3);
      });

      fragments.forEach((f, i) => {
        timeline.to(f.graphic, { alpha: 0.5, duration: 0.2, ease: 'power2.out' }, 0.2 + i * 0.02);
        timeline.to(f.graphic, { x: cx + Math.cos(f.endAngle) * f.orbitRadius, y: cy + Math.sin(f.endAngle) * f.orbitRadius, duration: 1.8, ease: 'none' }, 0.2);
      });

      streaks.forEach((s) => {
        timeline.to(s.graphic, { alpha: 0.4, duration: 0.1 }, s.enterDelay);
        timeline.to(s.graphic, { x: s.targetX, duration: 1.0 + Math.random() * 0.5, ease: 'none' }, s.enterDelay);
        timeline.to(s.graphic, { alpha: 0, duration: 0.2 }, s.enterDelay + 0.8);
      });

      // Core pulsing
      timeline.to(coreL3, { alpha: 0.5, duration: 0.15, yoyo: true, repeat: 4, ease: 'power2.inOut' }, 0.4);
      timeline.to(coreL4, { alpha: 0.7, duration: 0.12, yoyo: true, repeat: 5, ease: 'power2.inOut' }, 0.4);
      timeline.to(coreL5, { alpha: 0.9, duration: 0.1, yoyo: true, repeat: 6, ease: 'power2.inOut' }, 0.4);

      // --- 0.8s - 1.0s: PEAK DISCHARGE ---
      timeline.to(bloomFilter, { bloomScale: 7.0, duration: 0.15, ease: 'power2.out' }, 0.8);
      timeline.to(bloomFilter, { bloomScale: 4.0, duration: 0.3, ease: 'power2.inOut' }, 1.0);

      timeline.to(rgbFilter.red, { 0: -5, duration: 0.05, ease: 'power2.out' }, 0.8);
      timeline.to(rgbFilter.blue, { 0: 5, duration: 0.05, ease: 'power2.out' }, 0.8);
      timeline.to(rgbFilter.red, { 0: 0, duration: 0.15, ease: 'power2.out' }, 0.85);
      timeline.to(rgbFilter.blue, { 0: 0, duration: 0.15, ease: 'power2.out' }, 0.85);

      timeline.to(coreL5, { alpha: 0.95, duration: 0.1, ease: 'power2.out' }, 0.8);
      timeline.to(coreL5, { alpha: 0.7, duration: 0.2, ease: 'power2.inOut' }, 0.9);

      // Lightning flash-crackle
      bolts.forEach((b) => {
        const d = b.delay;
        timeline.to(b.glow, { alpha: 0.7, duration: 0.04 }, d);
        timeline.to(b.core, { alpha: 0.9, duration: 0.04 }, d);
        timeline.to(b.glow, { alpha: 0.1, duration: 0.06 }, d + 0.05);
        timeline.to(b.core, { alpha: 0.2, duration: 0.06 }, d + 0.05);
        timeline.to(b.glow, { alpha: 0.6, duration: 0.04 }, d + 0.15);
        timeline.to(b.core, { alpha: 0.8, duration: 0.04 }, d + 0.15);
        timeline.to(b.glow, { alpha: 0, duration: 0.1 }, d + 0.25);
        timeline.to(b.core, { alpha: 0, duration: 0.1 }, d + 0.25);
        timeline.to(b.glow, { alpha: 0.5, duration: 0.04 }, d + 0.5);
        timeline.to(b.core, { alpha: 0.7, duration: 0.04 }, d + 0.5);
        timeline.to(b.glow, { alpha: 0, duration: 0.15 }, d + 0.6);
        timeline.to(b.core, { alpha: 0, duration: 0.15 }, d + 0.6);
      });

      // Overflow streaks flash at peak
      overflowStreaks.forEach((s, i) => {
        timeline.to(s, { alpha: 0.5, duration: 0.1 }, 0.8 + i * 0.02);
        timeline.to(s, { alpha: 0.2, duration: 0.3 }, 1.0);
      });

      // --- 2.0s - 2.3s: FADE OUT ---
      timeline.to(hexGrid, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      timeline.to(atmoOuter, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      timeline.to(atmoMid1, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      timeline.to(atmoMid2, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      timeline.to(panels, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);

      blockRings.forEach((r) => {
        timeline.to(r.graphic, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      });

      timeline.to(accentRings, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);

      coreLayers.forEach((c) => {
        timeline.to(c, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      });

      rays.forEach((r) => {
        timeline.to(r.graphic, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      });

      fragments.forEach((f) => {
        timeline.to(f.graphic, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      });

      overflowStreaks.forEach((s) => {
        timeline.to(s, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
      });

      timeline.to(bloomFilter, { bloomScale: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
    }

    // === DOM ANIMATIONS ===
    gsap.set(label, { opacity: 0 });
    timeline.to(label, { opacity: 0.7, duration: 0.4, ease: 'power2.out' }, 0.3);
    timeline.to(label, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 2.0);
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
    // === DOM CONTAINER ===
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    const label = document.createElement('div');
    label.className = 'im-transition-fui-label';
    label.style.cssText = 'bottom:30px;left:50%;transform:translateX(-50%);top:auto;';
    label.textContent = '◇ SCAN SWEEP ◇';
    container.appendChild(label);

    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const w = app.screen.width;
      const h = app.screen.height;

      // =========================================================
      // TWO-CONTAINER ARCHITECTURE: Background (NORMAL) vs Beam (ADD + bloom)
      // =========================================================
      const backgroundContainer = new PIXI.Container();
      const beamContainer = new PIXI.Container();
      stage.addChild(backgroundContainer);
      stage.addChild(beamContainer);

      // =========================================================
      // LAYER 1: HEXAGONAL GRID BACKGROUND (NORMAL blend)
      // =========================================================
      const hexGrid = new PIXI.Graphics();
      const hexRadius = 30;
      const hexW = hexRadius * Math.sqrt(3);
      const hexH = hexRadius * 2;
      hexGrid.lineStyle(1, 0x0a2a3a, 0.06);

      for (let row = -2; row < Math.ceil(h / (hexH * 0.75)) + 2; row++) {
        for (let col = -2; col < Math.ceil(w / hexW) + 2; col++) {
          const offsetX = (row % 2) * (hexW / 2);
          const gx = col * hexW + offsetX;
          const gy = row * hexH * 0.75;
          const points = [];
          for (let v = 0; v < 6; v++) {
            points.push(gx + hexRadius * Math.cos(Math.PI / 3 * v + Math.PI / 6));
            points.push(gy + hexRadius * Math.sin(Math.PI / 3 * v + Math.PI / 6));
          }
          hexGrid.drawPolygon(points);
        }
      }
      hexGrid.alpha = 0;
      backgroundContainer.addChild(hexGrid);

      // =========================================================
      // LAYER 2: HUD DATA PANELS (left and right edges, NORMAL blend)
      // =========================================================
      const hudPanels = new PIXI.Graphics();

      // Left side panels (8-10 panels)
      for (let p = 0; p < 9; p++) {
        const panelX = 15 + Math.random() * 100;
        const panelY = h * 0.08 + (p / 9) * h * 0.8 + Math.random() * 30;
        const panelW = 40 + Math.random() * 80;
        const panelH = 15 + Math.random() * 35;

        hudPanels.lineStyle(1, 0x00d4ff, 0.12 + Math.random() * 0.08);
        hudPanels.drawRect(panelX, panelY, panelW, panelH);

        // Internal bar lines for some panels
        if (Math.random() > 0.5) {
          const barCount = 2 + Math.floor(Math.random() * 4);
          for (let b = 0; b < barCount; b++) {
            const barY = panelY + 4 + (b / barCount) * (panelH - 8);
            const barW = panelW * (0.3 + Math.random() * 0.6);
            hudPanels.lineStyle(1, 0x00d4ff, 0.08);
            hudPanels.moveTo(panelX + 3, barY);
            hudPanels.lineTo(panelX + 3 + barW, barY);
          }
        }
      }

      // Right side panels (4-6 panels)
      for (let p = 0; p < 5; p++) {
        const panelX = w - 150 + Math.random() * 100;
        const panelY = h * 0.15 + (p / 5) * h * 0.7 + Math.random() * 40;
        const panelW = 30 + Math.random() * 60;
        const panelH = 12 + Math.random() * 25;

        hudPanels.lineStyle(1, 0x00d4ff, 0.1 + Math.random() * 0.08);
        hudPanels.drawRect(panelX, panelY, panelW, panelH);
      }

      hudPanels.alpha = 0;
      backgroundContainer.addChild(hudPanels);

      // =========================================================
      // LAYER 3: CIRCULAR RADAR ELEMENT (upper-left, NORMAL blend)
      // =========================================================
      const radar = new PIXI.Graphics();
      const radarX = 100 + Math.random() * 60;
      const radarY = 100 + Math.random() * 60;

      // Concentric circles
      radar.lineStyle(1, 0x00d4ff, 0.12);
      radar.drawCircle(radarX, radarY, 40);
      radar.drawCircle(radarX, radarY, 60);
      radar.drawCircle(radarX, radarY, 80);

      // Crosshair
      radar.lineStyle(1, 0x00d4ff, 0.1);
      radar.moveTo(radarX - 85, radarY);
      radar.lineTo(radarX + 85, radarY);
      radar.moveTo(radarX, radarY - 85);
      radar.lineTo(radarX, radarY + 85);

      // Center dot
      radar.beginFill(0x00d4ff, 0.3);
      radar.drawCircle(radarX, radarY, 4);
      radar.endFill();

      radar.alpha = 0;
      backgroundContainer.addChild(radar);

      // =========================================================
      // LAYER 4: HORIZONTAL INTERFERENCE LINES (subtle, NORMAL blend)
      // =========================================================
      const interferenceLines = new PIXI.Graphics();
      for (let i = 0; i < 5; i++) {
        const lineY = Math.random() * h;
        interferenceLines.beginFill(0x00d4ff, 0.03 + Math.random() * 0.03);
        interferenceLines.drawRect(0, lineY, w, 1);
        interferenceLines.endFill();
      }
      interferenceLines.alpha = 0;
      backgroundContainer.addChild(interferenceLines);

      // =========================================================
      // LAYER 5: DORMANT BEAM (full width, low intensity, FIXED Y)
      // =========================================================
      const beamY = h * 0.45; // Fixed vertical position
      const dormantBeam = new PIXI.Container();
      dormantBeam.y = beamY;

      // Dormant secondary glow (very dim)
      const dormantGlow = new PIXI.Graphics();
      dormantGlow.beginFill(0x003355, 0.03);
      dormantGlow.drawRect(0, -30, w, 60);
      dormantGlow.endFill();
      dormantGlow.blendMode = PIXI.BLEND_MODES.ADD;
      dormantBeam.addChild(dormantGlow);

      // Dormant core line (dim cyan)
      const dormantCore = new PIXI.Graphics();
      dormantCore.beginFill(0x00d4ff, 0.15);
      dormantCore.drawRect(0, -1, w, 2);
      dormantCore.endFill();
      dormantCore.blendMode = PIXI.BLEND_MODES.ADD;
      dormantBeam.addChild(dormantCore);

      dormantBeam.alpha = 0;
      beamContainer.addChild(dormantBeam);

      // =========================================================
      // LAYER 6: ACTIVATED BEAM WITH MASK (revealed by hotspot sweep)
      // =========================================================
      const activatedBeam = new PIXI.Container();
      activatedBeam.y = beamY;

      // Activated glow (brighter)
      const activatedGlow = new PIXI.Graphics();
      activatedGlow.beginFill(0x00d4ff, 0.12);
      activatedGlow.drawRect(0, -25, w, 50);
      activatedGlow.endFill();
      activatedGlow.blendMode = PIXI.BLEND_MODES.ADD;
      activatedBeam.addChild(activatedGlow);

      // Activated core (white-hot)
      const activatedCore = new PIXI.Graphics();
      activatedCore.beginFill(0xffffff, 0.6);
      activatedCore.drawRect(0, -1.5, w, 3);
      activatedCore.endFill();
      activatedCore.blendMode = PIXI.BLEND_MODES.ADD;
      activatedBeam.addChild(activatedCore);

      // Mask for horizontal reveal (grows rightward)
      const activatedMask = new PIXI.Graphics();
      activatedMask.beginFill(0xffffff);
      activatedMask.drawRect(0, -100, 0, 200); // Start with 0 width
      activatedMask.endFill();
      beamContainer.addChild(activatedMask);
      activatedBeam.mask = activatedMask;
      activatedBeam.alpha = 0;
      beamContainer.addChild(activatedBeam);

      // =========================================================
      // LAYER 7: HOTSPOT (sweeps left to right along the beam)
      // =========================================================
      const hotspot = new PIXI.Container();
      hotspot.y = beamY;
      hotspot.x = -60; // Start off-screen left

      // Outer soft glow
      const outerGlow = new PIXI.Graphics();
      outerGlow.beginFill(0x003366, 0.25);
      outerGlow.drawCircle(0, 0, 80);
      outerGlow.endFill();
      outerGlow.blendMode = PIXI.BLEND_MODES.ADD;
      hotspot.addChild(outerGlow);

      // Mid glow
      const midGlow = new PIXI.Graphics();
      midGlow.beginFill(0x00d4ff, 0.4);
      midGlow.drawCircle(0, 0, 45);
      midGlow.endFill();
      midGlow.blendMode = PIXI.BLEND_MODES.ADD;
      hotspot.addChild(midGlow);

      // Bright core
      const hotspotCore = new PIXI.Graphics();
      hotspotCore.beginFill(0xffffff, 0.9);
      hotspotCore.drawCircle(0, 0, 20);
      hotspotCore.endFill();
      hotspotCore.blendMode = PIXI.BLEND_MODES.ADD;
      hotspot.addChild(hotspotCore);

      // White-hot center
      const hotspotCenter = new PIXI.Graphics();
      hotspotCenter.beginFill(0xffffff, 1);
      hotspotCenter.drawCircle(0, 0, 8);
      hotspotCenter.endFill();
      hotspotCenter.blendMode = PIXI.BLEND_MODES.ADD;
      hotspot.addChild(hotspotCenter);

      hotspot.alpha = 0;
      beamContainer.addChild(hotspot);

      // =========================================================
      // LAYER 8: SECONDARY NODES (flash as hotspot passes)
      // =========================================================
      const secondaryNodes = [];
      const numNodes = 8;

      for (let n = 0; n < numNodes; n++) {
        const nodeX = w * (0.1 + (n / (numNodes - 1)) * 0.8);
        const nodeContainer = new PIXI.Container();
        nodeContainer.x = nodeX;
        nodeContainer.y = beamY;

        // Node glow
        const nodeGlow = new PIXI.Graphics();
        nodeGlow.beginFill(0x00d4ff, 0.5);
        nodeGlow.drawCircle(0, 0, 12);
        nodeGlow.endFill();
        nodeGlow.blendMode = PIXI.BLEND_MODES.ADD;
        nodeContainer.addChild(nodeGlow);

        // Node core
        const nodeCore = new PIXI.Graphics();
        nodeCore.beginFill(0xffffff, 0.8);
        nodeCore.drawCircle(0, 0, 5);
        nodeCore.endFill();
        nodeCore.blendMode = PIXI.BLEND_MODES.ADD;
        nodeContainer.addChild(nodeCore);

        nodeContainer.alpha = 0;
        nodeContainer.scale.set(0.3);
        beamContainer.addChild(nodeContainer);

        secondaryNodes.push({
          container: nodeContainer,
          x: nodeX
        });
      }

      // =========================================================
      // LAYER 9: DRIP PARTICLES (digital rain, activated by hotspot X)
      // =========================================================
      const dripParticles = [];
      const numDrips = 50;

      for (let d = 0; d < numDrips; d++) {
        const drip = new PIXI.Graphics();
        const dripW = 1 + Math.random();
        const dripH = 10 + Math.random() * 20;
        const dripAlpha = 0.3 + Math.random() * 0.3;

        drip.beginFill(0x00d4ff, dripAlpha);
        drip.drawRect(-dripW / 2, 0, dripW, dripH);
        drip.endFill();
        drip.blendMode = PIXI.BLEND_MODES.ADD;

        const dripX = Math.random() * w;
        drip.x = dripX;
        drip.y = beamY; // Start at beam Y
        drip.alpha = 0;
        beamContainer.addChild(drip);

        dripParticles.push({
          graphic: drip,
          x: dripX,
          fallDistance: 80 + Math.random() * 120,
          fallDuration: 0.4 + Math.random() * 0.4
        });
      }

      // =========================================================
      // LAYER 10: FILTERS
      // =========================================================
      const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.4,
        bloomScale: 1.8,
        brightness: 1.2,
        blur: 6,
        quality: 4
      });
      beamContainer.filters = [bloomFilter];

      const rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);
      stage.filters = [rgbFilter];

      // =========================================================
      // GSAP TIMELINE ANIMATIONS
      // =========================================================

      // --- 0.0s - 0.3s: FADE IN BACKGROUND ---
      timeline.to(hexGrid, { alpha: 0.5, duration: 0.3, ease: 'power2.out' }, 0);
      timeline.to(hudPanels, { alpha: 0.7, duration: 0.3, ease: 'power2.out' }, 0);
      timeline.to(radar, { alpha: 0.6, duration: 0.3, ease: 'power2.out' }, 0);
      timeline.to(interferenceLines, { alpha: 0.5, duration: 0.3, ease: 'power2.out' }, 0);

      // --- 0.0s - 0.2s: FADE IN DORMANT BEAM ---
      timeline.to(dormantBeam, { alpha: 1, duration: 0.2, ease: 'power2.out' }, 0);
      timeline.to(activatedBeam, { alpha: 1, duration: 0.2, ease: 'power2.out' }, 0);
      timeline.to(hotspot, { alpha: 1, duration: 0.2, ease: 'power2.out' }, 0);

      // --- 0.1s - 1.6s: HOTSPOT SWEEP (left to right) ---
      const sweepStart = -60;
      const sweepEnd = w + 60;
      const sweepDuration = 1.5;

      timeline.to(hotspot, {
        x: sweepEnd,
        duration: sweepDuration,
        ease: 'none',
        onUpdate: function() {
          // Update activated beam mask to reveal beam behind hotspot
          const progress = (hotspot.x - sweepStart) / (sweepEnd - sweepStart);
          const maskWidth = Math.max(0, hotspot.x + 30);
          activatedMask.clear();
          activatedMask.beginFill(0xffffff);
          activatedMask.drawRect(0, beamY - 100, maskWidth, 200);
          activatedMask.endFill();
        }
      }, 0.1);

      // --- SECONDARY NODES: Flash as hotspot passes ---
      secondaryNodes.forEach((node, i) => {
        // Calculate when hotspot reaches this node
        const nodeProgress = (node.x - sweepStart) / (sweepEnd - sweepStart);
        const flashTime = 0.1 + nodeProgress * sweepDuration;

        // Flash in
        timeline.to(node.container, {
          alpha: 1,
          duration: 0.08,
          ease: 'power2.out'
        }, flashTime - 0.04);

        timeline.to(node.container.scale, {
          x: 1.5,
          y: 1.5,
          duration: 0.1,
          ease: 'power2.out'
        }, flashTime - 0.04);

        // Settle down
        timeline.to(node.container.scale, {
          x: 0.8,
          y: 0.8,
          duration: 0.3,
          ease: 'power2.out'
        }, flashTime + 0.1);

        timeline.to(node.container, {
          alpha: 0.5,
          duration: 0.4,
          ease: 'power2.out'
        }, flashTime + 0.15);
      });

      // --- DRIP PARTICLES: Activate based on hotspot X position ---
      dripParticles.forEach((dp) => {
        // Calculate when hotspot reaches this drip's X position
        const dripProgress = (dp.x - sweepStart) / (sweepEnd - sweepStart);
        const activationTime = 0.1 + Math.max(0, Math.min(1, dripProgress)) * sweepDuration;

        // Fade in
        timeline.to(dp.graphic, {
          alpha: 0.6,
          duration: 0.05
        }, activationTime);

        // Fall downward
        timeline.to(dp.graphic, {
          y: '+=' + dp.fallDistance,
          duration: dp.fallDuration,
          ease: 'power2.out'
        }, activationTime);

        // Fade out while falling
        timeline.to(dp.graphic, {
          alpha: 0,
          duration: dp.fallDuration * 0.8
        }, activationTime + dp.fallDuration * 0.2);
      });

      // --- 0.3s - 1.0s: BLOOM BUILDS ---
      timeline.to(bloomFilter, { bloomScale: 2.5, duration: 0.7, ease: 'power2.out' }, 0.3);

      // --- 1.0s - 1.5s: PEAK BLOOM ---
      timeline.to(bloomFilter, { bloomScale: 3.0, duration: 0.5, ease: 'power2.inOut' }, 1.0);

      // --- 1.5s: RGB SPLIT FLASH ---
      timeline.to(rgbFilter.red, { 0: -2, duration: 0.05, ease: 'power2.out' }, 1.5);
      timeline.to(rgbFilter.blue, { 0: 2, duration: 0.05, ease: 'power2.out' }, 1.5);
      timeline.to(rgbFilter.red, { 0: 0, duration: 0.1, ease: 'power2.out' }, 1.55);
      timeline.to(rgbFilter.blue, { 0: 0, duration: 0.1, ease: 'power2.out' }, 1.55);

      // --- 1.6s - 2.0s: FADE OUT ---
      timeline.to(hexGrid, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(hudPanels, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(radar, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(interferenceLines, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(dormantBeam, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.6);
      timeline.to(activatedBeam, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.6);
      timeline.to(hotspot, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.6);
      secondaryNodes.forEach(node => {
        timeline.to(node.container, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.6);
      });
      timeline.to(bloomFilter, { bloomScale: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
    }

    // === DOM ANIMATIONS ===
    gsap.set(label, { opacity: 0 });
    timeline.to(label, { opacity: 0.7, duration: 0.3, ease: 'power2.out' }, 0.3);
    timeline.to(label, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.6);
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
