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
        { innerR: 0.39, outerR: 0.44, numSegs: 14, gapDeg: 3, bodyColor: 0x1e3d55, bodyAlpha: 0.95, edgeColor: 0x1a5577, edgeAlpha: 0.65, edgeWidth: 1.5, direction: 1, speed: 5.0 },
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
   * Build Data Cascade transition - Matrix-style falling code rain
   * Cyan character streams, FUI panels, floating text, floor reflections, bloom glow
   * Reference: transition_data_cascade.png
   */
  _buildDataCascade(timeline) {
    var app = window.pixiEffectManager ? window.pixiEffectManager.getApp() : null;
    if (!app) {
      this._buildPlaceholder('data_cascade', timeline);
      return;
    }
    var stage = window.pixiEffectManager.getStage();
    var W = window.pixiEffectManager.getWidth();
    var H = window.pixiEffectManager.getHeight();
    this._addDataCascade(stage, W, H, timeline);
    this._addDataCascadeEnhance(stage, W, H, timeline);
    this._addDataCascadeFinal(stage, W, H, timeline);
  }

  /**
   * Add Data Cascade visual layers - Matrix-style falling cyan code rain
   * Uses offscreen Canvas 2D for rain rendering, piped into PixiJS as texture
   * for GPU effects (bloom, blur, blend modes)
   * @param {PIXI.Container} stage - The PixiJS stage
   * @param {number} W - Stage width
   * @param {number} H - Stage height
   * @param {gsap.core.Timeline} tl - GSAP timeline
   */
  _addDataCascade(stage, W, H, tl) {
    var self = this;
    var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]{}=+/\\|';

    // =========================================================
    // MASTER CONTAINER - holds all layers, receives global bloom
    // =========================================================
    var masterContainer = new PIXI.Container();
    masterContainer.alpha = 0;
    stage.addChild(masterContainer);

    // =========================================================
    // HELPER: Create rain stream objects
    // =========================================================
    function createStreams(count, minSpeed, maxSpeed, charSize, spacing) {
      var streams = [];
      var cols = Math.ceil(W / spacing);
      for (var i = 0; i < count; i++) {
        var colIndex = i % cols;
        streams.push({
          x: colIndex * spacing + spacing / 2 + (Math.random() - 0.5) * 10,
          y: -Math.random() * H * 1.5,
          speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
          length: 12 + Math.floor(Math.random() * 10),
          charSize: charSize,
          chars: []
        });
        // Initialize characters
        for (var c = 0; c < streams[i].length; c++) {
          streams[i].chars.push(charset[Math.floor(Math.random() * charset.length)]);
        }
      }
      return streams;
    }

    // =========================================================
    // HELPER: Update rain frame on canvas
    // =========================================================
    function updateRainFrame(ctx, streams, canvasW, canvasH, charSize) {
      // Fade trail (DO NOT use clearRect — the trail IS the effect)
      ctx.fillStyle = 'rgba(0, 5, 15, 0.12)';
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.font = charSize + 'px "JetBrains Mono", monospace';
      ctx.textBaseline = 'top';

      for (var s = 0; s < streams.length; s++) {
        var stream = streams[s];
        stream.y += stream.speed;

        // Reset stream if fully below screen
        if (stream.y - stream.length * charSize > canvasH) {
          stream.y = -stream.length * charSize - Math.random() * canvasH * 0.5;
        }

        for (var i = 0; i < stream.length; i++) {
          var charY = stream.y - i * charSize;
          if (charY < -charSize || charY > canvasH) continue;

          // Randomly mutate character (10% chance per frame)
          if (Math.random() < 0.1) {
            stream.chars[i] = charset[Math.floor(Math.random() * charset.length)];
          }

          // Head-to-tail brightness gradient
          var headFactor = 1.0 - (i / stream.length);
          if (i === 0) {
            // HEAD: blazing white-cyan
            ctx.fillStyle = 'rgba(220, 255, 255, 0.95)';
          } else if (i <= 2) {
            // Near-head: bright cyan
            ctx.fillStyle = 'rgba(0, 212, 255, ' + (0.85 * headFactor) + ')';
          } else {
            // Tail: fading to dark blue
            ctx.fillStyle = 'rgba(0, 100, 180, ' + (0.6 * headFactor) + ')';
          }

          ctx.fillText(stream.chars[i], stream.x, charY);
        }
      }

      // Occasional bright flash on random characters
      if (Math.random() < 0.3) {
        for (var f = 0; f < 4; f++) {
          var rs = streams[Math.floor(Math.random() * streams.length)];
          var ri = Math.floor(Math.random() * Math.min(3, rs.length));
          var ry = rs.y - ri * charSize;
          if (ry >= 0 && ry <= canvasH) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText(rs.chars[ri], rs.x, ry);
          }
        }
      }
    }

    // =========================================================
    // LAYER 1: BACKGROUND RAIN (depth layer — blurred, slower, dimmer)
    // =========================================================
    var bgRainCanvas = document.createElement('canvas');
    bgRainCanvas.width = W;
    bgRainCanvas.height = H;
    var bgRainCtx = bgRainCanvas.getContext('2d');
    bgRainCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    bgRainCtx.fillRect(0, 0, W, H);

    var bgStreams = createStreams(28, 1.5, 3, 24, 70);

    var bgBaseTexture = new PIXI.BaseTexture(bgRainCanvas);
    var bgTexture = new PIXI.Texture(bgBaseTexture);
    var bgRainSprite = new PIXI.Sprite(bgTexture);
    bgRainSprite.alpha = 0.4;

    // Apply blur for depth-of-field effect
    try {
      var blurFilter = new PIXI.filters.BlurFilter(3);
      bgRainSprite.filters = [blurFilter];
    } catch (e) {
      console.warn('[DataCascade] BlurFilter not available:', e);
    }

    masterContainer.addChild(bgRainSprite);

    // =========================================================
    // LAYER 2: FOREGROUND RAIN (main visual — sharp, dense, bright)
    // =========================================================
    var rainCanvas = document.createElement('canvas');
    rainCanvas.width = W;
    rainCanvas.height = H;
    var rainCtx = rainCanvas.getContext('2d');
    rainCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    rainCtx.fillRect(0, 0, W, H);

    var fgStreams = createStreams(60, 4, 10, 18, 32);

    var fgBaseTexture = new PIXI.BaseTexture(rainCanvas);
    var fgTexture = new PIXI.Texture(fgBaseTexture);
    var fgRainSprite = new PIXI.Sprite(fgTexture);
    masterContainer.addChild(fgRainSprite);

    // =========================================================
    // LAYER 3: FLOOR REFLECTIONS
    // Second sprite from same texture, flipped, low alpha
    // =========================================================
    var reflectionSprite = new PIXI.Sprite(fgTexture);
    reflectionSprite.y = H;
    reflectionSprite.anchor.y = 1;
    reflectionSprite.scale.y = -0.22;
    reflectionSprite.alpha = 0.15;
    reflectionSprite.blendMode = PIXI.BLEND_MODES.ADD;
    masterContainer.addChild(reflectionSprite);

    // =========================================================
    // LAYER 4: FUI PANELS (left and right monitor frames)
    // =========================================================
    var fuiContainer = new PIXI.Container();
    fuiContainer.alpha = 0;
    masterContainer.addChild(fuiContainer);

    // --- LEFT PANEL ---
    var leftPanel = new PIXI.Graphics();
    var lpX = 20;
    var lpY = H * 0.15;
    var lpW = W * 0.14;
    var lpH = H * 0.55;

    // Dark semi-transparent background
    leftPanel.beginFill(0x000a14, 0.7);
    leftPanel.drawRect(lpX, lpY, lpW, lpH);
    leftPanel.endFill();

    // Cyan border
    leftPanel.lineStyle(1.5, 0x00d4ff, 0.6);
    leftPanel.drawRect(lpX, lpY, lpW, lpH);

    // Corner accents (L-shaped brackets)
    var cornerLen = 12;
    leftPanel.lineStyle(2, 0x00d4ff, 0.8);
    // Top-left corner
    leftPanel.moveTo(lpX, lpY + cornerLen);
    leftPanel.lineTo(lpX, lpY);
    leftPanel.lineTo(lpX + cornerLen, lpY);
    // Top-right corner
    leftPanel.moveTo(lpX + lpW - cornerLen, lpY);
    leftPanel.lineTo(lpX + lpW, lpY);
    leftPanel.lineTo(lpX + lpW, lpY + cornerLen);
    // Bottom-left corner
    leftPanel.moveTo(lpX, lpY + lpH - cornerLen);
    leftPanel.lineTo(lpX, lpY + lpH);
    leftPanel.lineTo(lpX + cornerLen, lpY + lpH);
    // Bottom-right corner
    leftPanel.moveTo(lpX + lpW - cornerLen, lpY + lpH);
    leftPanel.lineTo(lpX + lpW, lpY + lpH);
    leftPanel.lineTo(lpX + lpW, lpY + lpH - cornerLen);

    // Data bars (4-5 horizontal bars)
    for (var dbi = 0; dbi < 5; dbi++) {
      var barY = lpY + 25 + dbi * 22;
      var barW = lpW * (0.3 + Math.random() * 0.5);
      leftPanel.beginFill(0x00d4ff, 0.3 + Math.random() * 0.2);
      leftPanel.drawRect(lpX + 10, barY, barW - 20, 8);
      leftPanel.endFill();
    }

    // Text line placeholders
    for (var tli = 0; tli < 3; tli++) {
      var tlY = lpY + 140 + tli * 18;
      leftPanel.beginFill(0x004466, 0.4);
      leftPanel.drawRect(lpX + 10, tlY, lpW * 0.6, 4);
      leftPanel.endFill();
    }

    // Small bar chart (5 vertical bars)
    var chartBaseY = lpY + lpH - 30;
    for (var chi = 0; chi < 5; chi++) {
      var chH = 15 + Math.random() * 40;
      leftPanel.beginFill(0x00d4ff, 0.4);
      leftPanel.drawRect(lpX + 15 + chi * 18, chartBaseY - chH, 12, chH);
      leftPanel.endFill();
    }

    fuiContainer.addChild(leftPanel);

    // --- RIGHT PANEL ---
    var rightPanel = new PIXI.Graphics();
    var rpX = W * 0.84;
    var rpY = H * 0.25;
    var rpW = W * 0.14;
    var rpH = H * 0.45;

    // Dark semi-transparent background
    rightPanel.beginFill(0x000a14, 0.7);
    rightPanel.drawRect(rpX, rpY, rpW, rpH);
    rightPanel.endFill();

    // Cyan border
    rightPanel.lineStyle(1.5, 0x00d4ff, 0.6);
    rightPanel.drawRect(rpX, rpY, rpW, rpH);

    // Corner accents
    rightPanel.lineStyle(2, 0x00d4ff, 0.8);
    // Top-left corner
    rightPanel.moveTo(rpX, rpY + cornerLen);
    rightPanel.lineTo(rpX, rpY);
    rightPanel.lineTo(rpX + cornerLen, rpY);
    // Top-right corner
    rightPanel.moveTo(rpX + rpW - cornerLen, rpY);
    rightPanel.lineTo(rpX + rpW, rpY);
    rightPanel.lineTo(rpX + rpW, rpY + cornerLen);
    // Bottom-left corner
    rightPanel.moveTo(rpX, rpY + rpH - cornerLen);
    rightPanel.lineTo(rpX, rpY + rpH);
    rightPanel.lineTo(rpX + cornerLen, rpY + rpH);
    // Bottom-right corner
    rightPanel.moveTo(rpX + rpW - cornerLen, rpY + rpH);
    rightPanel.lineTo(rpX + rpW, rpY + rpH);
    rightPanel.lineTo(rpX + rpW, rpY + rpH - cornerLen);

    // Radar/targeting circle
    var radarCX = rpX + rpW / 2;
    var radarCY = rpY + rpH * 0.35;
    rightPanel.lineStyle(1, 0x00d4ff, 0.3);
    rightPanel.drawCircle(radarCX, radarCY, 30);
    rightPanel.drawCircle(radarCX, radarCY, 50);
    rightPanel.drawCircle(radarCX, radarCY, 70);

    // Crosshair lines
    rightPanel.lineStyle(1, 0x00d4ff, 0.2);
    rightPanel.moveTo(radarCX - 75, radarCY);
    rightPanel.lineTo(radarCX + 75, radarCY);
    rightPanel.moveTo(radarCX, radarCY - 75);
    rightPanel.lineTo(radarCX, radarCY + 75);

    // Data lines below radar
    for (var rli = 0; rli < 3; rli++) {
      var rlY = rpY + rpH * 0.7 + rli * 16;
      rightPanel.beginFill(0x004466, 0.4);
      rightPanel.drawRect(rpX + 15, rlY, rpW * 0.65, 4);
      rightPanel.endFill();
    }

    fuiContainer.addChild(rightPanel);

    // Radar blip (small bright dot on outer ring)
    var radarBlip = new PIXI.Graphics();
    radarBlip.beginFill(0x00d4ff, 0.9);
    radarBlip.drawCircle(0, 0, 4);
    radarBlip.endFill();
    radarBlip.x = radarCX + 70;
    radarBlip.y = radarCY;
    radarBlip.pivot.set(-70, 0);
    radarBlip.x = radarCX;
    fuiContainer.addChild(radarBlip);

    // =========================================================
    // LAYER 5: FLOATING TEXT — "BREACH" and "ACCESS"
    // =========================================================
    var breachText = new PIXI.Text('BREACH', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 72,
      fill: '#00d4ff',
      fontWeight: 'bold',
      letterSpacing: 8
    });
    breachText.anchor.set(0.5, 0.5);
    breachText.x = W * 0.22;
    breachText.y = H * 0.42;
    breachText.alpha = 0;

    try {
      var breachGlow = new PIXI.filters.GlowFilter({
        distance: 15,
        outerStrength: 3,
        innerStrength: 1,
        color: 0x00d4ff
      });
      breachText.filters = [breachGlow];
    } catch (e) {
      console.warn('[DataCascade] GlowFilter not available for BREACH:', e);
    }

    masterContainer.addChild(breachText);

    var accessText = new PIXI.Text('ACCESS', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 64,
      fill: '#00d4ff',
      fontWeight: 'bold',
      letterSpacing: 8
    });
    accessText.anchor.set(0.5, 0.5);
    accessText.x = W * 0.72;
    accessText.y = H * 0.38;
    accessText.alpha = 0;

    try {
      var accessGlow = new PIXI.filters.GlowFilter({
        distance: 15,
        outerStrength: 3,
        innerStrength: 1,
        color: 0x00d4ff
      });
      accessText.filters = [accessGlow];
    } catch (e) {
      console.warn('[DataCascade] GlowFilter not available for ACCESS:', e);
    }

    masterContainer.addChild(accessText);

    // =========================================================
    // LAYER 6: CENTER HORIZONTAL LIGHT STREAK
    // =========================================================
    var lightStreak = new PIXI.Graphics();
    // Wide soft glow band
    lightStreak.beginFill(0x00d4ff, 0.04);
    lightStreak.drawRect(0, H * 0.5 - 20, W, 40);
    lightStreak.endFill();
    // Thin bright line
    lightStreak.beginFill(0x00d4ff, 0.3);
    lightStreak.drawRect(0, H * 0.5 - 1, W, 2);
    lightStreak.endFill();
    // Bright center dot
    lightStreak.beginFill(0xffffff, 0.5);
    lightStreak.drawCircle(W * 0.5, H * 0.5, 8);
    lightStreak.endFill();
    lightStreak.blendMode = PIXI.BLEND_MODES.ADD;
    masterContainer.addChild(lightStreak);

    // =========================================================
    // LAYER 7: AMBIENT SPARKLE PARTICLES
    // =========================================================
    var sparkles = new PIXI.Graphics();
    sparkles.blendMode = PIXI.BLEND_MODES.ADD;
    for (var si = 0; si < 90; si++) {
      var sx = Math.random() * W;
      var sy = Math.random() * H;
      var sr = 1 + Math.random() * 2;
      var sa = 0.1 + Math.random() * 0.4;
      sparkles.beginFill(0x00d4ff, sa);
      sparkles.drawCircle(sx, sy, sr);
      sparkles.endFill();
    }
    masterContainer.addChild(sparkles);

    // =========================================================
    // LAYER 8: GLOBAL BLOOM
    // =========================================================
    try {
      var bloomFilter = new PIXI.filters.AdvancedBloomFilter({
        threshold: 0.3,
        bloomScale: 1.2,
        brightness: 1.1,
        blur: 6,
        quality: 4
      });
      masterContainer.filters = [bloomFilter];
    } catch (e) {
      console.warn('[DataCascade] AdvancedBloomFilter not available:', e);
    }

    // =========================================================
    // GSAP ANIMATION TIMELINE
    // =========================================================

    // Phase 1 — BUILD UP (0s - 0.5s)
    tl.fromTo(masterContainer, { alpha: 0 }, { alpha: 1, duration: 0.5, ease: 'power2.in' }, 0);
    tl.fromTo(fuiContainer, { alpha: 0 }, { alpha: 0.8, duration: 0.4, ease: 'power2.out' }, 0.1);

    // Phase 2 — FULL INTENSITY (0s - 3.0s)
    // Rain animation loop via GSAP onUpdate
    tl.to({ frame: 0 }, {
      frame: 1,
      duration: 3.0,
      ease: 'none',
      onUpdate: function() {
        // Update background rain canvas
        updateRainFrame(bgRainCtx, bgStreams, W, H, 24);
        bgBaseTexture.update();
        // Update foreground rain canvas
        updateRainFrame(rainCtx, fgStreams, W, H, 18);
        fgBaseTexture.update();
      }
    }, 0);

    // "BREACH" text fades in at t=0.8s, holds, fades out at t=1.8s
    tl.to(breachText, { alpha: 1, duration: 0.3, ease: 'power2.out' }, 0.8);
    tl.to(breachText, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.8);

    // "ACCESS" text fades in at t=1.4s, holds, fades out at t=2.5s
    tl.to(accessText, { alpha: 1, duration: 0.3, ease: 'power2.out' }, 1.4);
    tl.to(accessText, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 2.5);

    // Radar blip rotates slowly
    tl.to(radarBlip, { pixi: { rotation: 360 }, duration: 3.0, ease: 'none' }, 0.5);

    // Phase 3 — FADE OUT (3.0s - 3.5s)
    tl.to(masterContainer, { alpha: 0, duration: 0.5, ease: 'power2.out' }, 3.0);
  }

  /**
   * Enhance Data Cascade with dramatic visual layers ON TOP of Round 1
   * 10 layers: atmospheric haze, 3-tier depth rain (160+ streams), physical monitors,
   * breach flare, floor reflections, sparkle nodes
   * @param {PIXI.Container} stage - The PixiJS stage
   * @param {number} W - Stage width
   * @param {number} H - Stage height
   * @param {gsap.core.Timeline} tl - GSAP timeline
   */
  _addDataCascadeEnhance(stage, W, H, tl) {
    var self = this;

    // Character set: 85-90% digits for legibility (Wachowski requirement)
    var digitChars = '0123456789';
    var symbolChars = '@#$&';

    // =========================================================
    // MASTER ENHANCEMENT CONTAINER
    // =========================================================
    var enhanceContainer = new PIXI.Container();
    enhanceContainer.alpha = 0;
    stage.addChild(enhanceContainer);

    // =========================================================
    // HELPER: Create stream objects for enhanced rain
    // =========================================================
    function createEnhancedStreams(count, minSpeed, maxSpeed, charSize, spacing, xOffset) {
      var streams = [];
      var cols = Math.ceil(W / spacing);
      for (var i = 0; i < count; i++) {
        var colIndex = i % cols;
        var streamLength = 8 + Math.floor(Math.random() * 16);
        var stream = {
          x: xOffset + colIndex * spacing + spacing / 2 + (Math.random() - 0.5) * 8,
          y: -Math.random() * H * 1.2 - streamLength * charSize,
          speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
          length: streamLength,
          charSize: charSize,
          chars: [],
          charset: Math.random() < 0.88 ? digitChars : (digitChars + symbolChars)
        };
        for (var c = 0; c < stream.length; c++) {
          stream.chars.push(stream.charset[Math.floor(Math.random() * stream.charset.length)]);
        }
        streams.push(stream);
      }
      return streams;
    }

    // =========================================================
    // HELPER: Update enhanced rain frame on canvas
    // =========================================================
    function updateEnhancedRain(ctx, streams, canvasW, canvasH, charSize, trailAlpha) {
      // Trail fade
      ctx.fillStyle = 'rgba(0, 5, 15, ' + trailAlpha + ')';
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.font = charSize + 'px "JetBrains Mono", "Courier New", monospace';
      ctx.textBaseline = 'top';

      for (var s = 0; s < streams.length; s++) {
        var stream = streams[s];
        stream.y += stream.speed;

        if (stream.y - stream.length * charSize > canvasH) {
          stream.y = -(stream.length * charSize) - (Math.random() * canvasH * 0.3);
        }

        for (var i = 0; i < stream.length; i++) {
          var charY = Math.floor(stream.y - i * charSize);
          if (charY < -charSize || charY > canvasH) continue;

          // Character mutation — 8% chance per frame
          if (Math.random() < 0.08) {
            stream.chars[i] = stream.charset[Math.floor(Math.random() * stream.charset.length)];
          }

          // HEAD-TO-TAIL BRIGHTNESS GRADIENT
          var headFactor = 1.0 - (i / stream.length);
          var r, g, b, a;

          if (i === 0) {
            // HEAD: blazing white
            r = 230; g = 255; b = 255; a = 0.95;
          } else if (i === 1) {
            // Near-head: very bright white-cyan
            r = 180; g = 245; b = 255; a = 0.85;
          } else if (i <= 3) {
            // Upper body: bright cyan
            r = 0; g = 212; b = 255; a = 0.7 * headFactor;
          } else if (i <= 7) {
            // Mid body: medium cyan
            r = 0; g = 160; b = 220; a = 0.5 * headFactor;
          } else {
            // Tail: fading dark blue
            r = 0; g = 80; b = 160; a = 0.3 * headFactor;
          }

          ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
          ctx.fillText(stream.chars[i], Math.floor(stream.x), charY);
        }
      }

      // Bright flash sparks — 30% chance per frame
      if (Math.random() < 0.3) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (var f = 0; f < 6; f++) {
          var rs = streams[Math.floor(Math.random() * streams.length)];
          var headY = Math.floor(rs.y);
          if (headY >= 0 && headY <= canvasH) {
            ctx.fillText(rs.chars[0], Math.floor(rs.x), headY);
          }
        }
      }
    }

    // =========================================================
    // LAYER 1: ATMOSPHERIC HAZE (draw first so everything sits on top)
    // =========================================================
    var hazeGfx = new PIXI.Graphics();
    hazeGfx.blendMode = PIXI.BLEND_MODES.ADD;

    // Large soft outer haze
    hazeGfx.beginFill(0x001a2a, 0.08);
    hazeGfx.drawEllipse(W * 0.5, H * 0.48, W * 0.45, H * 0.4);
    hazeGfx.endFill();

    // Brighter central zone
    hazeGfx.beginFill(0x003344, 0.12);
    hazeGfx.drawEllipse(W * 0.5, H * 0.50, W * 0.2, H * 0.15);
    hazeGfx.endFill();

    enhanceContainer.addChild(hazeGfx);

    // =========================================================
    // LAYER 2: DEEP BACKGROUND RAIN (60-80 streams, blurred, dim, small)
    // =========================================================
    var deepBgCanvas = document.createElement('canvas');
    deepBgCanvas.width = W;
    deepBgCanvas.height = H;
    var deepBgCtx = deepBgCanvas.getContext('2d');
    deepBgCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    deepBgCtx.fillRect(0, 0, W, H);

    var deepBgStreams = createEnhancedStreams(70, 1.0, 2.5, 10, 25, 5);

    var deepBgBaseTexture = new PIXI.BaseTexture(deepBgCanvas);
    var deepBgTexture = new PIXI.Texture(deepBgBaseTexture);
    var deepBgSprite = new PIXI.Sprite(deepBgTexture);
    deepBgSprite.alpha = 0.25;
    deepBgSprite.blendMode = PIXI.BLEND_MODES.ADD;

    try {
      var deepBlur = new PIXI.filters.BlurFilter(4);
      deepBgSprite.filters = [deepBlur];
    } catch (e) {
      console.warn('[DataCascadeEnhance] BlurFilter not available for deep bg:', e);
    }

    enhanceContainer.addChild(deepBgSprite);

    // =========================================================
    // LAYER 3: MIDGROUND RAIN (50-60 streams, slight blur, medium brightness)
    // =========================================================
    var midCanvas = document.createElement('canvas');
    midCanvas.width = W;
    midCanvas.height = H;
    var midCtx = midCanvas.getContext('2d');
    midCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    midCtx.fillRect(0, 0, W, H);

    var midStreams = createEnhancedStreams(55, 2.5, 5.0, 14, 32, 10);

    var midBaseTexture = new PIXI.BaseTexture(midCanvas);
    var midTexture = new PIXI.Texture(midBaseTexture);
    var midSprite = new PIXI.Sprite(midTexture);
    midSprite.alpha = 0.45;
    midSprite.blendMode = PIXI.BLEND_MODES.ADD;

    try {
      var midBlur = new PIXI.filters.BlurFilter(1.5);
      midSprite.filters = [midBlur];
    } catch (e) {
      console.warn('[DataCascadeEnhance] BlurFilter not available for mid:', e);
    }

    enhanceContainer.addChild(midSprite);

    // =========================================================
    // LAYER 4: DENSE FOREGROUND RAIN (50-65 streams, sharp, bright, large digits)
    // =========================================================
    var denseFgCanvas = document.createElement('canvas');
    denseFgCanvas.width = W;
    denseFgCanvas.height = H;
    var denseFgCtx = denseFgCanvas.getContext('2d');
    denseFgCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    denseFgCtx.fillRect(0, 0, W, H);

    var denseFgStreams = createEnhancedStreams(58, 4.0, 9.0, 18, 30, 15);

    var denseFgBaseTexture = new PIXI.BaseTexture(denseFgCanvas);
    var denseFgTexture = new PIXI.Texture(denseFgBaseTexture);
    var denseFgSprite = new PIXI.Sprite(denseFgTexture);
    denseFgSprite.alpha = 0.7;
    denseFgSprite.blendMode = PIXI.BLEND_MODES.ADD;

    enhanceContainer.addChild(denseFgSprite);

    // =========================================================
    // LAYER 5: ENHANCED FLOOR REFLECTIONS
    // =========================================================
    // Reflection from dense foreground
    var fgReflection = new PIXI.Sprite(denseFgTexture);
    fgReflection.y = H;
    fgReflection.anchor.y = 1.0;
    fgReflection.scale.y = -0.25;
    fgReflection.alpha = 0.18;
    fgReflection.blendMode = PIXI.BLEND_MODES.ADD;
    try {
      var fgReflBlur = new PIXI.filters.BlurFilter(2);
      fgReflection.filters = [fgReflBlur];
    } catch (e) {}
    enhanceContainer.addChild(fgReflection);

    // Reflection from midground
    var midReflection = new PIXI.Sprite(midTexture);
    midReflection.y = H;
    midReflection.anchor.y = 1.0;
    midReflection.scale.y = -0.20;
    midReflection.alpha = 0.10;
    midReflection.blendMode = PIXI.BLEND_MODES.ADD;
    try {
      var midReflBlur = new PIXI.filters.BlurFilter(3);
      midReflection.filters = [midReflBlur];
    } catch (e) {}
    enhanceContainer.addChild(midReflection);

    // Floor brightness band
    var floorGlow = new PIXI.Graphics();
    floorGlow.blendMode = PIXI.BLEND_MODES.ADD;
    // Wide soft glow band at horizon
    floorGlow.beginFill(0x002233, 0.06);
    floorGlow.drawRect(0, H * 0.76, W, H * 0.06);
    floorGlow.endFill();
    // Thin bright horizon line
    floorGlow.beginFill(0x00d4ff, 0.15);
    floorGlow.drawRect(0, H * 0.78, W, 3);
    floorGlow.endFill();
    enhanceContainer.addChild(floorGlow);

    // =========================================================
    // LAYER 6: CENTRAL BREACH FLARE
    // =========================================================
    var breachFlare = new PIXI.Graphics();
    breachFlare.blendMode = PIXI.BLEND_MODES.ADD;
    var cx = W * 0.5;
    var cy = H * 0.50;

    // Zone 4 (outer haze)
    breachFlare.beginFill(0x004466, 0.06);
    breachFlare.drawCircle(cx, cy, 120);
    breachFlare.endFill();

    // Zone 3 (mid glow)
    breachFlare.beginFill(0x00aadd, 0.15);
    breachFlare.drawCircle(cx, cy, 50);
    breachFlare.endFill();

    // Zone 2 (inner glow)
    breachFlare.beginFill(0x80ddff, 0.4);
    breachFlare.drawCircle(cx, cy, 20);
    breachFlare.endFill();

    // Zone 1 (core)
    breachFlare.beginFill(0xffffff, 0.9);
    breachFlare.drawCircle(cx, cy, 6);
    breachFlare.endFill();

    // Horizontal flare lines
    breachFlare.beginFill(0x00d4ff, 0.4);
    breachFlare.drawRect(cx - W * 0.25, cy - 1, W * 0.5, 2);
    breachFlare.endFill();
    breachFlare.beginFill(0xffffff, 0.3);
    breachFlare.drawRect(cx - W * 0.15, cy - 0.5, W * 0.3, 1);
    breachFlare.endFill();

    // 4 radial flare spikes at 45° angles
    breachFlare.lineStyle(1, 0x00d4ff, 0.5);
    var spikeLen = 30;
    breachFlare.moveTo(cx, cy);
    breachFlare.lineTo(cx + spikeLen * 0.707, cy - spikeLen * 0.707);
    breachFlare.moveTo(cx, cy);
    breachFlare.lineTo(cx - spikeLen * 0.707, cy - spikeLen * 0.707);
    breachFlare.moveTo(cx, cy);
    breachFlare.lineTo(cx + spikeLen * 0.707, cy + spikeLen * 0.707);
    breachFlare.moveTo(cx, cy);
    breachFlare.lineTo(cx - spikeLen * 0.707, cy + spikeLen * 0.707);

    breachFlare.alpha = 0;
    enhanceContainer.addChild(breachFlare);

    // =========================================================
    // LAYER 7: ENHANCED FUI MONITORS (physical screens with bezels)
    // =========================================================

    // --- LEFT MONITOR ---
    var leftMonitorContainer = new PIXI.Container();
    leftMonitorContainer.x = W * 0.02;
    leftMonitorContainer.y = H * 0.30;
    leftMonitorContainer.skew.x = 0.08;
    leftMonitorContainer.alpha = 0;

    var lmW = W * 0.155;
    var lmH = H * 0.50;
    var leftMonitor = new PIXI.Graphics();

    // BEZEL (outer frame)
    leftMonitor.beginFill(0x0a1520, 0.85);
    leftMonitor.drawRect(-8, -8, lmW + 16, lmH + 16);
    leftMonitor.endFill();
    leftMonitor.lineStyle(1.5, 0x003344, 0.5);
    leftMonitor.drawRect(-8, -8, lmW + 16, lmH + 16);

    // SCREEN (inner lit area)
    leftMonitor.beginFill(0x011a28, 0.6);
    leftMonitor.drawRect(0, 0, lmW, lmH);
    leftMonitor.endFill();
    leftMonitor.lineStyle(1, 0x00d4ff, 0.7);
    leftMonitor.drawRect(0, 0, lmW, lmH);

    // Corner brackets
    var cLen = 12;
    leftMonitor.lineStyle(2, 0x00d4ff, 0.8);
    leftMonitor.moveTo(0, cLen);
    leftMonitor.lineTo(0, 0);
    leftMonitor.lineTo(cLen, 0);
    leftMonitor.moveTo(lmW - cLen, 0);
    leftMonitor.lineTo(lmW, 0);
    leftMonitor.lineTo(lmW, cLen);
    leftMonitor.moveTo(0, lmH - cLen);
    leftMonitor.lineTo(0, lmH);
    leftMonitor.lineTo(cLen, lmH);
    leftMonitor.moveTo(lmW - cLen, lmH);
    leftMonitor.lineTo(lmW, lmH);
    leftMonitor.lineTo(lmW, lmH - cLen);

    // Header bar
    leftMonitor.beginFill(0x00d4ff, 0.15);
    leftMonitor.drawRect(5, 5, lmW - 10, 18);
    leftMonitor.endFill();

    // Section 1: Data readout bars
    for (var dbi = 0; dbi < 8; dbi++) {
      var barY = 28 + dbi * 11;
      var fillPct = 0.3 + Math.random() * 0.55;
      leftMonitor.beginFill(0x00d4ff, 0.25 + Math.random() * 0.25);
      leftMonitor.drawRect(8, barY, (lmW - 16) * fillPct, 5);
      leftMonitor.endFill();
      leftMonitor.beginFill(0x002233, 0.15);
      leftMonitor.drawRect(8 + (lmW - 16) * fillPct, barY, (lmW - 16) * (1 - fillPct), 5);
      leftMonitor.endFill();
    }

    // Section 2: Mini line chart
    leftMonitor.lineStyle(1, 0x00d4ff, 0.6);
    var chartY = 120;
    leftMonitor.moveTo(8, chartY + 30);
    for (var cli = 0; cli < 9; cli++) {
      var px = 8 + cli * ((lmW - 16) / 8);
      var py = chartY + 10 + Math.random() * 40;
      leftMonitor.lineTo(px, py);
    }
    leftMonitor.beginFill(0x00d4ff, 0.05);
    leftMonitor.moveTo(8, chartY + 30);
    for (var cli2 = 0; cli2 < 9; cli2++) {
      var px2 = 8 + cli2 * ((lmW - 16) / 8);
      var py2 = chartY + 10 + Math.random() * 40;
      leftMonitor.lineTo(px2, py2);
    }
    leftMonitor.lineTo(lmW - 8, chartY + 60);
    leftMonitor.lineTo(8, chartY + 60);
    leftMonitor.closePath();
    leftMonitor.endFill();

    // Section 3: Text lines
    for (var tli = 0; tli < 7; tli++) {
      var tlY = 190 + tli * 10;
      var tlAlpha = 0.2 + Math.random() * 0.2;
      leftMonitor.beginFill(0x00d4ff, tlAlpha);
      leftMonitor.drawRect(8, tlY, (lmW - 16) * (0.4 + Math.random() * 0.5), 3);
      leftMonitor.endFill();
    }

    // Section 4: Small bar chart at bottom
    var chartBase = lmH - 25;
    for (var chi = 0; chi < 6; chi++) {
      var chH = 20 + Math.random() * 40;
      leftMonitor.beginFill(0x00d4ff, 0.3 + Math.random() * 0.2);
      leftMonitor.drawRect(10 + chi * 14, chartBase - chH, 8, chH);
      leftMonitor.endFill();
    }
    leftMonitor.lineStyle(1, 0x00d4ff, 0.2);
    leftMonitor.moveTo(8, chartBase + 2);
    leftMonitor.lineTo(lmW - 8, chartBase + 2);

    leftMonitorContainer.addChild(leftMonitor);

    try {
      var leftGlow = new PIXI.filters.GlowFilter({
        distance: 8,
        outerStrength: 1.5,
        color: 0x003355
      });
      leftMonitorContainer.filters = [leftGlow];
    } catch (e) {}

    enhanceContainer.addChild(leftMonitorContainer);

    // --- RIGHT MONITOR ---
    var rightMonitorContainer = new PIXI.Container();
    rightMonitorContainer.x = W * 0.83;
    rightMonitorContainer.y = H * 0.35;
    rightMonitorContainer.skew.x = -0.08;
    rightMonitorContainer.alpha = 0;

    var rmW = W * 0.145;
    var rmH = H * 0.45;
    var rightMonitor = new PIXI.Graphics();

    // BEZEL
    rightMonitor.beginFill(0x0a1520, 0.85);
    rightMonitor.drawRect(-8, -8, rmW + 16, rmH + 16);
    rightMonitor.endFill();
    rightMonitor.lineStyle(1.5, 0x003344, 0.5);
    rightMonitor.drawRect(-8, -8, rmW + 16, rmH + 16);

    // SCREEN
    rightMonitor.beginFill(0x011a28, 0.6);
    rightMonitor.drawRect(0, 0, rmW, rmH);
    rightMonitor.endFill();
    rightMonitor.lineStyle(1, 0x00d4ff, 0.7);
    rightMonitor.drawRect(0, 0, rmW, rmH);

    // Corner brackets
    rightMonitor.lineStyle(2, 0x00d4ff, 0.8);
    rightMonitor.moveTo(0, cLen);
    rightMonitor.lineTo(0, 0);
    rightMonitor.lineTo(cLen, 0);
    rightMonitor.moveTo(rmW - cLen, 0);
    rightMonitor.lineTo(rmW, 0);
    rightMonitor.lineTo(rmW, cLen);
    rightMonitor.moveTo(0, rmH - cLen);
    rightMonitor.lineTo(0, rmH);
    rightMonitor.lineTo(cLen, rmH);
    rightMonitor.moveTo(rmW - cLen, rmH);
    rightMonitor.lineTo(rmW, rmH);
    rightMonitor.lineTo(rmW, rmH - cLen);

    // RADAR/TARGETING DISPLAY
    var radarCX = rmW / 2;
    var radarCY = rmH * 0.35;

    // Concentric circles
    rightMonitor.lineStyle(1, 0x00d4ff, 0.2);
    rightMonitor.drawCircle(radarCX, radarCY, 20);
    rightMonitor.lineStyle(1, 0x00d4ff, 0.25);
    rightMonitor.drawCircle(radarCX, radarCY, 35);
    rightMonitor.lineStyle(1, 0x00d4ff, 0.3);
    rightMonitor.drawCircle(radarCX, radarCY, 50);
    rightMonitor.lineStyle(1, 0x00d4ff, 0.2);
    rightMonitor.drawCircle(radarCX, radarCY, 65);

    // Center dot
    rightMonitor.beginFill(0x00d4ff, 0.6);
    rightMonitor.drawCircle(radarCX, radarCY, 2);
    rightMonitor.endFill();

    // Cross-hair lines
    rightMonitor.lineStyle(1, 0x00d4ff, 0.12);
    rightMonitor.moveTo(5, radarCY);
    rightMonitor.lineTo(rmW - 5, radarCY);
    rightMonitor.moveTo(radarCX, 10);
    rightMonitor.lineTo(radarCX, rmH * 0.55);

    // Diagonal cross
    rightMonitor.lineStyle(1, 0x00d4ff, 0.08);
    rightMonitor.moveTo(radarCX - 50, radarCY - 25);
    rightMonitor.lineTo(radarCX + 50, radarCY + 25);
    rightMonitor.moveTo(radarCX + 50, radarCY - 25);
    rightMonitor.lineTo(radarCX - 50, radarCY + 25);

    // Radar blips
    var blipAngles = [0.3, 1.2, 2.1, 3.5, 4.8];
    for (var bi = 0; bi < blipAngles.length; bi++) {
      var bAngle = blipAngles[bi];
      var bRadius = 20 + Math.random() * 45;
      var bx = radarCX + bRadius * Math.cos(bAngle);
      var by = radarCY + bRadius * Math.sin(bAngle) * 0.5;
      rightMonitor.beginFill(0x00d4ff, 0.6);
      rightMonitor.drawCircle(bx, by, 2 + Math.random());
      rightMonitor.endFill();
    }

    // Active target (green)
    rightMonitor.beginFill(0x00ff88, 0.7);
    rightMonitor.drawCircle(radarCX + 40 * Math.cos(1.8), radarCY + 40 * Math.sin(1.8) * 0.5, 3);
    rightMonitor.endFill();

    // Status indicators
    var statusY = rmH * 0.62;
    var statusColors = [0x00d4ff, 0xff6b00, 0x00ff88, 0x00d4ff];
    for (var sti = 0; sti < 4; sti++) {
      rightMonitor.beginFill(statusColors[sti], 0.4 + Math.random() * 0.2);
      rightMonitor.drawRect(8 + sti * 30, statusY, 6, 6);
      rightMonitor.endFill();
      rightMonitor.beginFill(0x003344, 0.25);
      rightMonitor.drawRect(16 + sti * 30, statusY + 1, 20, 4);
      rightMonitor.endFill();
    }

    // Data lines at bottom
    for (var rli = 0; rli < 5; rli++) {
      var rlY = rmH * 0.72 + rli * 12;
      rightMonitor.beginFill(0x00d4ff, 0.2 + Math.random() * 0.15);
      rightMonitor.drawRect(8, rlY, (rmW - 16) * (0.5 + Math.random() * 0.4), 3);
      rightMonitor.endFill();
    }

    rightMonitorContainer.addChild(rightMonitor);

    // Radar sweep wedge (for rotation)
    var radarSweep = new PIXI.Graphics();
    radarSweep.beginFill(0x00d4ff, 0.08);
    radarSweep.moveTo(radarCX, radarCY);
    radarSweep.lineTo(radarCX + 65, radarCY);
    radarSweep.arc(radarCX, radarCY, 65, 0, Math.PI / 6);
    radarSweep.closePath();
    radarSweep.endFill();
    radarSweep.pivot.set(radarCX, radarCY);
    radarSweep.x = radarCX;
    radarSweep.y = radarCY;
    rightMonitorContainer.addChild(radarSweep);

    try {
      var rightGlow = new PIXI.filters.GlowFilter({
        distance: 8,
        outerStrength: 1.5,
        color: 0x003355
      });
      rightMonitorContainer.filters = [rightGlow];
    } catch (e) {}

    enhanceContainer.addChild(rightMonitorContainer);

    // =========================================================
    // LAYER 8: BRIGHT SPARKLE FLARE NODES
    // =========================================================
    var sparkleContainer = new PIXI.Graphics();
    sparkleContainer.blendMode = PIXI.BLEND_MODES.ADD;

    for (var spi = 0; spi < 45; spi++) {
      var spX = Math.random() * W;
      var spY = Math.random() * H * 0.75;
      var spRand = Math.random();
      var spRadius, spColor, spAlpha;

      if (spRand < 0.70) {
        // Subtle sparkles
        spRadius = 1 + Math.random();
        spColor = 0x00d4ff;
        spAlpha = 0.3 + Math.random() * 0.3;
      } else if (spRand < 0.90) {
        // Bright sparkles
        spRadius = 2 + Math.random() * 2;
        spColor = 0x80eeff;
        spAlpha = 0.5 + Math.random() * 0.3;
      } else {
        // Blazing white nodes
        spRadius = 3 + Math.random() * 2;
        spColor = 0xffffff;
        spAlpha = 0.6 + Math.random() * 0.3;
      }

      sparkleContainer.beginFill(spColor, spAlpha);
      sparkleContainer.drawCircle(spX, spY, spRadius);
      sparkleContainer.endFill();
    }

    sparkleContainer.alpha = 0.6;
    enhanceContainer.addChild(sparkleContainer);

    // =========================================================
    // LAYER 9: FOREGROUND RAIN OVERLAY (in front of text)
    // =========================================================
    var overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = W;
    overlayCanvas.height = H;
    var overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.fillStyle = 'rgba(0, 5, 15, 1)';
    overlayCtx.fillRect(0, 0, W, H);

    var overlayStreams = createEnhancedStreams(10, 6.0, 12.0, 20, 180, 50);

    var overlayBaseTexture = new PIXI.BaseTexture(overlayCanvas);
    var overlayTexture = new PIXI.Texture(overlayBaseTexture);
    var overlaySprite = new PIXI.Sprite(overlayTexture);
    overlaySprite.alpha = 0.5;
    overlaySprite.blendMode = PIXI.BLEND_MODES.ADD;

    enhanceContainer.addChild(overlaySprite);

    // =========================================================
    // LAYER 10: ADDITIONAL AMBIENT PARTICLES
    // =========================================================
    var ambientParticles = new PIXI.Graphics();
    ambientParticles.blendMode = PIXI.BLEND_MODES.ADD;

    // Floor zone particles
    for (var fpi = 0; fpi < 50; fpi++) {
      var fpX = Math.random() * W;
      var fpY = H * 0.75 + Math.random() * H * 0.25;
      ambientParticles.beginFill(0x00d4ff, 0.1 + Math.random() * 0.15);
      ambientParticles.drawCircle(fpX, fpY, 1);
      ambientParticles.endFill();
    }

    // Cascade zone fog particles
    for (var cpi = 0; cpi < 30; cpi++) {
      var cpX = Math.random() * W;
      var cpY = Math.random() * H * 0.75;
      ambientParticles.beginFill(0x004466, 0.1 + Math.random() * 0.05);
      ambientParticles.drawCircle(cpX, cpY, 1 + Math.random());
      ambientParticles.endFill();
    }

    enhanceContainer.addChild(ambientParticles);

    // =========================================================
    // GSAP ANIMATION TIMELINE
    // =========================================================

    // Phase 1 — BUILD UP
    tl.fromTo(enhanceContainer, { alpha: 0 }, { alpha: 1, duration: 0.5, ease: 'power2.in' }, 0);

    // Phase 2 — Rain animation loop
    tl.to({ frame: 0 }, {
      frame: 1,
      duration: 3.0,
      ease: 'none',
      onUpdate: function() {
        // Deep background rain
        updateEnhancedRain(deepBgCtx, deepBgStreams, W, H, 10, 0.06);
        deepBgBaseTexture.update();

        // Midground rain
        updateEnhancedRain(midCtx, midStreams, W, H, 14, 0.08);
        midBaseTexture.update();

        // Dense foreground rain
        updateEnhancedRain(denseFgCtx, denseFgStreams, W, H, 18, 0.10);
        denseFgBaseTexture.update();

        // Overlay rain
        updateEnhancedRain(overlayCtx, overlayStreams, W, H, 20, 0.10);
        overlayBaseTexture.update();
      }
    }, 0);

    // Monitor fade-ins
    tl.fromTo(leftMonitorContainer, { alpha: 0 }, { alpha: 1, duration: 0.6, ease: 'power2.out' }, 0.1);
    tl.fromTo(rightMonitorContainer, { alpha: 0 }, { alpha: 1, duration: 0.6, ease: 'power2.out' }, 0.2);

    // Breach flare fade-in
    tl.fromTo(breachFlare, { alpha: 0 }, { alpha: 1, duration: 0.4, ease: 'power2.in' }, 0.5);

    // Sparkle pulse
    tl.fromTo(sparkleContainer, { alpha: 0.6 }, { alpha: 1.0, duration: 0.8, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 0.3);

    // Radar sweep rotation
    tl.to(radarSweep, { pixi: { rotation: 360 }, duration: 3.0, ease: 'none' }, 0);

    // Phase 3 — FADE OUT
    tl.to(enhanceContainer, { alpha: 0, duration: 0.5, ease: 'power2.out' }, 3.0);
  }

  /**
   * Data Cascade Round 5: Unified rain canvas + massive PIXI.Graphics FUI elements
   *
   * Strategy A: ONE simplified rain canvas (ADD + alpha 1.0 + pure black trail)
   * Strategy B: MASSIVE PIXI.Graphics FUI elements drawn directly — guaranteed visible
   *
   * FUI elements: scan lines, rotating arcs, corner brackets, tick marks, data boxes,
   * grid lines, sparkles — inspired by JARVIS HUD design vocabulary.
   * Graphics objects use the normal PixiJS rendering pipeline and always render correctly.
   *
   * @param {PIXI.Container} stage - The PixiJS stage
   * @param {number} W - Stage width
   * @param {number} H - Stage height
   * @param {gsap.core.Timeline} tl - GSAP timeline
   */
  _addDataCascadeFinal(stage, W, H, tl) {
    var self = this;

    // =========================================================
    // MASTER CONTAINER — holds all Round 5 layers
    // =========================================================
    var finalContainer = new PIXI.Container();
    stage.addChild(finalContainer);

    // =========================================================
    // SECTION 1: UNIFIED RAIN CANVAS (165 streams: bg 70 + mid 50 + fg 45)
    // =========================================================

    var rainCanvas = document.createElement('canvas');
    rainCanvas.width = W;
    rainCanvas.height = H;
    var rainCtx = rainCanvas.getContext('2d');
    rainCtx.fillStyle = '#000000';
    rainCtx.fillRect(0, 0, W, H);

    // BACKGROUND STREAMS (70 streams — dim, slow, small)
    var bgStreams = [];
    for (var i = 0; i < 70; i++) {
      var streamLen = 10 + Math.floor(Math.random() * 10);
      var stream = {
        x: Math.floor(i * (W / 70)) + Math.floor(Math.random() * 8 - 4),
        y: -(Math.random() * H),
        speed: 1.0 + Math.random() * 1.5,
        charSize: 10,
        length: streamLen,
        tier: 'bg',
        charset: '0123456789',
        chars: []
      };
      for (var c = 0; c < streamLen; c++) {
        stream.chars.push(stream.charset[Math.floor(Math.random() * stream.charset.length)]);
      }
      bgStreams.push(stream);
    }

    // MIDGROUND STREAMS (50 streams — medium brightness, medium speed)
    var midStreams = [];
    for (var i = 0; i < 50; i++) {
      var streamLen = 14 + Math.floor(Math.random() * 8);
      var stream = {
        x: Math.floor(8 + i * (W / 50)) + Math.floor(Math.random() * 10 - 5),
        y: -(Math.random() * H * 0.5),
        speed: 2.0 + Math.random() * 3.0,
        charSize: 14,
        length: streamLen,
        tier: 'mid',
        charset: '01234567890#',
        chars: []
      };
      for (var c = 0; c < streamLen; c++) {
        stream.chars.push(stream.charset[Math.floor(Math.random() * stream.charset.length)]);
      }
      midStreams.push(stream);
    }

    // FOREGROUND STREAMS (45 streams — bright, fast, large legible digits)
    var fgStreams = [];
    for (var i = 0; i < 45; i++) {
      var streamLen = 16 + Math.floor(Math.random() * 10);
      var stream = {
        x: Math.floor(16 + i * (W / 45)) + Math.floor(Math.random() * 14 - 7),
        y: -(Math.random() * H * 0.3),
        speed: 3.5 + Math.random() * 5.0,
        charSize: 18,
        length: streamLen,
        tier: 'fg',
        charset: '0123456789012345678#&',
        chars: []
      };
      for (var c = 0; c < streamLen; c++) {
        stream.chars.push(stream.charset[Math.floor(Math.random() * stream.charset.length)]);
      }
      fgStreams.push(stream);
    }

    // Combine all streams (165 total)
    var allStreams = bgStreams.concat(midStreams).concat(fgStreams);

    var rainBaseTex = new PIXI.BaseTexture(rainCanvas);
    var rainTex = new PIXI.Texture(rainBaseTex);
    var rainSprite = new PIXI.Sprite(rainTex);
    rainSprite.blendMode = PIXI.BLEND_MODES.ADD;
    rainSprite.alpha = 1.0;
    finalContainer.addChild(rainSprite);

    // RENDERING FUNCTION (called each frame via GSAP onUpdate)
    function renderAllRain(ctx, streams, cW, cH) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';  // PURE BLACK trail
      ctx.fillRect(0, 0, cW, cH);

      for (var s = 0; s < streams.length; s++) {
        var stream = streams[s];
        stream.y += stream.speed;
        if (stream.y - stream.length * stream.charSize > cH) {
          stream.y = -(stream.length * stream.charSize) - (Math.random() * cH * 0.3);
        }

        ctx.font = stream.charSize + 'px "JetBrains Mono", "Courier New", monospace';
        ctx.textBaseline = 'top';

        for (var i = 0; i < stream.length; i++) {
          var cy = Math.floor(stream.y - i * stream.charSize);
          if (cy < -stream.charSize || cy > cH) continue;

          if (Math.random() < 0.06) {
            stream.chars[i] = stream.charset[Math.floor(Math.random() * stream.charset.length)];
          }

          // Brightness depends on tier AND position in stream
          var decay = Math.pow(0.82, i);
          var r, g, b, a;

          if (stream.tier === 'bg') {
            // Background: dim
            if (i === 0) { r = 60; g = 160; b = 190; a = 0.45; }
            else { r = 0; g = 60 + Math.floor(50 * decay); b = 100 + Math.floor(40 * decay); a = 0.25 * decay; }
          } else if (stream.tier === 'mid') {
            // Midground: medium
            if (i === 0) { r = 120; g = 220; b = 240; a = 0.70; }
            else if (i === 1) { r = 60; g = 180; b = 220; a = 0.55; }
            else { r = 0; g = 100 + Math.floor(60 * decay); b = 160 + Math.floor(40 * decay); a = 0.38 * decay; }
          } else {
            // Foreground: bright
            if (i === 0) { r = 220; g = 255; b = 255; a = 0.95; }
            else if (i === 1) { r = 140; g = 235; b = 255; a = 0.78; }
            else if (i <= 3) { r = 40; g = 200; b = 255; a = 0.55 * decay; }
            else { r = 0; g = 100 + Math.floor(80 * decay); b = 170 + Math.floor(50 * decay); a = 0.40 * decay; }
          }

          if (a < 0.02) continue;
          ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
          ctx.fillText(stream.chars[i], Math.floor(stream.x), cy);
        }
      }

      // Bright flash on foreground heads
      if (Math.random() < 0.30) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
        for (var f = 0; f < 6; f++) {
          var idx = Math.floor(Math.random() * streams.length);
          var rs = streams[idx];
          if (rs.tier === 'fg' || rs.tier === 'mid') {
            var hy = Math.floor(rs.y);
            if (hy >= 0 && hy <= cH) {
              ctx.font = rs.charSize + 'px "JetBrains Mono", "Courier New", monospace';
              ctx.fillText(rs.chars[0], Math.floor(rs.x), hy);
            }
          }
        }
      }
    }

    // =========================================================
    // SECTION 2: FUI GRAPHICS EXTRAVAGANZA (the zhuzz)
    // =========================================================

    // --- FUI ELEMENT 1: EDGE TICK MARKS (top, bottom, left, right edges) ---
    var edgeTicks = new PIXI.Graphics();
    edgeTicks.blendMode = PIXI.BLEND_MODES.ADD;

    // Top edge: 60 tick marks
    for (var t = 0; t < 60; t++) {
      var tx = Math.floor(t * (W / 60));
      var tHeight = (t % 5 === 0) ? 12 : 6;
      var tAlpha = (t % 5 === 0) ? 0.40 : 0.20;
      edgeTicks.lineStyle(1, 0x00bbdd, tAlpha);
      edgeTicks.moveTo(tx, 0);
      edgeTicks.lineTo(tx, tHeight);
    }
    // Bottom edge: 60 tick marks
    for (var t = 0; t < 60; t++) {
      var tx = Math.floor(t * (W / 60));
      var tHeight = (t % 5 === 0) ? 12 : 6;
      var tAlpha = (t % 5 === 0) ? 0.35 : 0.15;
      edgeTicks.lineStyle(1, 0x00bbdd, tAlpha);
      edgeTicks.moveTo(tx, H);
      edgeTicks.lineTo(tx, H - tHeight);
    }
    // Left edge: 40 tick marks
    for (var t = 0; t < 40; t++) {
      var ty = Math.floor(t * (H / 40));
      var tWidth = (t % 5 === 0) ? 10 : 5;
      var tAlpha = (t % 5 === 0) ? 0.35 : 0.15;
      edgeTicks.lineStyle(1, 0x00bbdd, tAlpha);
      edgeTicks.moveTo(0, ty);
      edgeTicks.lineTo(tWidth, ty);
    }
    // Right edge: 40 tick marks
    for (var t = 0; t < 40; t++) {
      var ty = Math.floor(t * (H / 40));
      var tWidth = (t % 5 === 0) ? 10 : 5;
      var tAlpha = (t % 5 === 0) ? 0.35 : 0.15;
      edgeTicks.lineStyle(1, 0x00bbdd, tAlpha);
      edgeTicks.moveTo(W, ty);
      edgeTicks.lineTo(W - tWidth, ty);
    }
    finalContainer.addChild(edgeTicks);

    // --- FUI ELEMENT 2: CORNER BRACKET DECORATIONS (all 4 corners) ---
    var corners = new PIXI.Graphics();
    corners.lineStyle(2, 0x00d4ff, 0.60);

    // Top-left corner bracket
    corners.moveTo(0, 40); corners.lineTo(0, 0); corners.lineTo(40, 0);
    // Top-right
    corners.moveTo(W - 40, 0); corners.lineTo(W, 0); corners.lineTo(W, 40);
    // Bottom-left
    corners.moveTo(0, H - 40); corners.lineTo(0, H); corners.lineTo(40, H);
    // Bottom-right
    corners.moveTo(W - 40, H); corners.lineTo(W, H); corners.lineTo(W, H - 40);

    // Inner corner brackets (offset 15px inward, slightly smaller)
    corners.lineStyle(1, 0x00aacc, 0.35);
    corners.moveTo(15, 45); corners.lineTo(15, 15); corners.lineTo(45, 15);
    corners.moveTo(W - 45, 15); corners.lineTo(W - 15, 15); corners.lineTo(W - 15, 45);
    corners.moveTo(15, H - 45); corners.lineTo(15, H - 15); corners.lineTo(45, H - 15);
    corners.moveTo(W - 45, H - 15); corners.lineTo(W - 15, H - 15); corners.lineTo(W - 15, H - 45);

    finalContainer.addChild(corners);

    // --- FUI ELEMENT 3: HORIZONTAL SCAN LINE (animated sweep) ---
    var scanLine = new PIXI.Graphics();
    scanLine.blendMode = PIXI.BLEND_MODES.ADD;
    // Thin bright horizontal line
    scanLine.lineStyle(1, 0x00d4ff, 0.50);
    scanLine.moveTo(0, 0); scanLine.lineTo(W, 0);
    // Wider dim glow band above and below
    scanLine.beginFill(0x004466, 0.08);
    scanLine.drawRect(0, -8, W, 16);
    scanLine.endFill();
    scanLine.y = -20; // Start above viewport
    finalContainer.addChild(scanLine);

    // --- FUI ELEMENT 4: VERTICAL SCAN LINE (animated sweep, delayed) ---
    var vScanLine = new PIXI.Graphics();
    vScanLine.blendMode = PIXI.BLEND_MODES.ADD;
    vScanLine.lineStyle(1, 0x00bbcc, 0.35);
    vScanLine.moveTo(0, 0); vScanLine.lineTo(0, H);
    vScanLine.beginFill(0x003344, 0.06);
    vScanLine.drawRect(-6, 0, 12, H);
    vScanLine.endFill();
    vScanLine.x = -10;
    finalContainer.addChild(vScanLine);

    // --- FUI ELEMENT 5: ROTATING ARC SEGMENTS (around center breach point) ---
    var cx = Math.floor(W * 0.5);
    var cy = Math.floor(H * 0.50);

    var arcsOuter = new PIXI.Graphics();
    arcsOuter.blendMode = PIXI.BLEND_MODES.ADD;
    // 4 arc segments at radius 80, each spanning ~50 degrees, spaced 90 degrees apart
    for (var a = 0; a < 4; a++) {
      var startAngle = (a * Math.PI / 2) + 0.2;
      var endAngle = startAngle + 0.85;
      arcsOuter.lineStyle(2, 0x00d4ff, 0.45);
      arcsOuter.arc(cx, cy, 80, startAngle, endAngle);
      arcsOuter.moveTo(cx + 80 * Math.cos(endAngle), cy + 80 * Math.sin(endAngle));
    }
    arcsOuter.pivot.set(cx, cy);
    arcsOuter.position.set(cx, cy);
    finalContainer.addChild(arcsOuter);

    var arcsInner = new PIXI.Graphics();
    arcsInner.blendMode = PIXI.BLEND_MODES.ADD;
    // 3 arc segments at radius 50, spanning ~40 degrees
    for (var a = 0; a < 3; a++) {
      var startAngle = (a * Math.PI * 2 / 3) + 0.3;
      var endAngle = startAngle + 0.70;
      arcsInner.lineStyle(1.5, 0x00aacc, 0.35);
      arcsInner.arc(cx, cy, 50, startAngle, endAngle);
      arcsInner.moveTo(cx + 50 * Math.cos(endAngle), cy + 50 * Math.sin(endAngle));
    }
    arcsInner.pivot.set(cx, cy);
    arcsInner.position.set(cx, cy);
    finalContainer.addChild(arcsInner);

    // Small tick marks on outer ring (12 ticks at 30-degree intervals)
    var ringTicks = new PIXI.Graphics();
    ringTicks.blendMode = PIXI.BLEND_MODES.ADD;
    for (var t = 0; t < 12; t++) {
      var angle = t * Math.PI / 6;
      var innerR = 75;
      var outerR = (t % 3 === 0) ? 90 : 83;
      ringTicks.lineStyle(1, 0x00d4ff, (t % 3 === 0) ? 0.45 : 0.20);
      ringTicks.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
      ringTicks.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
    }
    finalContainer.addChild(ringTicks);

    // --- FUI ELEMENT 6: DATA READOUT BOXES (4 small info panels) ---
    function drawDataBox(graphics, bx, by, bw, bh) {
      // Border
      graphics.lineStyle(1, 0x00bbdd, 0.40);
      graphics.drawRect(bx, by, bw, bh);
      // Fill
      graphics.beginFill(0x001a25, 0.25);
      graphics.drawRect(bx, by, bw, bh);
      graphics.endFill();
      // Header bar
      graphics.beginFill(0x00d4ff, 0.12);
      graphics.drawRect(bx, by, bw, 10);
      graphics.endFill();
      // 3 text line placeholders
      for (var line = 0; line < 3; line++) {
        var lw = bw * (0.4 + Math.random() * 0.45);
        graphics.beginFill(0x00aacc, 0.15 + Math.random() * 0.15);
        graphics.drawRect(bx + 4, by + 16 + line * 11, lw, 3);
        graphics.endFill();
      }
      // Small blinking indicator dot
      graphics.beginFill(0x00ffaa, 0.50);
      graphics.drawCircle(bx + bw - 6, by + 5, 2);
      graphics.endFill();
    }

    var dataBoxes = new PIXI.Graphics();
    dataBoxes.blendMode = PIXI.BLEND_MODES.ADD;

    // Top-left data box
    drawDataBox(dataBoxes, 55, 55, 120, 55);
    // Top-right data box
    drawDataBox(dataBoxes, W - 180, 50, 125, 50);
    // Bottom-left data box (above floor zone)
    drawDataBox(dataBoxes, 60, Math.floor(H * 0.62), 110, 50);
    // Bottom-right data box
    drawDataBox(dataBoxes, W - 175, Math.floor(H * 0.60), 120, 55);

    finalContainer.addChild(dataBoxes);

    // --- FUI ELEMENT 7: HORIZONTAL DATA BANDS (thin status bars) ---
    var dataBands = new PIXI.Graphics();
    dataBands.blendMode = PIXI.BLEND_MODES.ADD;

    // Band 1: near top (y = 15% height)
    dataBands.lineStyle(1, 0x00aacc, 0.18);
    dataBands.moveTo(Math.floor(W * 0.05), Math.floor(H * 0.15));
    dataBands.lineTo(Math.floor(W * 0.35), Math.floor(H * 0.15));

    // Band 2: upper area (y = 25%)
    dataBands.lineStyle(1, 0x00bbdd, 0.22);
    dataBands.moveTo(Math.floor(W * 0.55), Math.floor(H * 0.22));
    dataBands.lineTo(Math.floor(W * 0.92), Math.floor(H * 0.22));

    // Band 3: lower area (y = 65%)
    dataBands.lineStyle(1, 0x008899, 0.15);
    dataBands.moveTo(Math.floor(W * 0.10), Math.floor(H * 0.65));
    dataBands.lineTo(Math.floor(W * 0.40), Math.floor(H * 0.65));

    // Band 4: near bottom (y = 72%)
    dataBands.lineStyle(1, 0x009aab, 0.18);
    dataBands.moveTo(Math.floor(W * 0.60), Math.floor(H * 0.70));
    dataBands.lineTo(Math.floor(W * 0.88), Math.floor(H * 0.70));

    // Small filled segments on bands (like progress indicators)
    dataBands.beginFill(0x00d4ff, 0.20);
    dataBands.drawRect(Math.floor(W * 0.05), Math.floor(H * 0.15) - 2, Math.floor(W * 0.12), 4);
    dataBands.endFill();
    dataBands.beginFill(0x00d4ff, 0.18);
    dataBands.drawRect(Math.floor(W * 0.55), Math.floor(H * 0.22) - 2, Math.floor(W * 0.15), 4);
    dataBands.endFill();

    finalContainer.addChild(dataBands);

    // --- FUI ELEMENT 8: GRID HASH MARKS (subtle background grid) ---
    var gridLines = new PIXI.Graphics();
    gridLines.blendMode = PIXI.BLEND_MODES.ADD;
    gridLines.lineStyle(1, 0x002a3a, 0.08);

    // Vertical grid lines every ~120px
    for (var gx = 0; gx < W; gx += 120) {
      gridLines.moveTo(gx, 0);
      gridLines.lineTo(gx, H);
    }
    // Horizontal grid lines every ~100px
    for (var gy = 0; gy < H; gy += 100) {
      gridLines.moveTo(0, gy);
      gridLines.lineTo(W, gy);
    }
    finalContainer.addChild(gridLines);

    // Move grid to back (index 0)
    finalContainer.setChildIndex(gridLines, 0);

    // --- FUI ELEMENT 9: FLOOR REFLECTION + HORIZON ---
    var floorReflect = new PIXI.Sprite(rainTex);
    floorReflect.anchor.set(0, 1);
    floorReflect.position.set(0, H);
    floorReflect.scale.y = -0.25;
    floorReflect.alpha = 0.15;
    floorReflect.blendMode = PIXI.BLEND_MODES.ADD;
    try {
      floorReflect.filters = [new PIXI.filters.BlurFilter(2)];
    } catch (e) {}
    finalContainer.addChild(floorReflect);

    // Horizon glow
    var horizon = new PIXI.Graphics();
    horizon.blendMode = PIXI.BLEND_MODES.ADD;
    horizon.beginFill(0x001a2a, 0.06);
    horizon.drawRect(0, Math.floor(H * 0.74), W, Math.floor(H * 0.06));
    horizon.endFill();
    horizon.beginFill(0x00bbdd, 0.14);
    horizon.drawRect(0, Math.floor(H * 0.77), W, 2);
    horizon.endFill();
    finalContainer.addChild(horizon);

    // --- FUI ELEMENT 10: BREACH/ACCESS TEXT (properly positioned) ---
    var breachTxt = new PIXI.Text('BREACH', {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontSize: 64,
      fill: 0xccffff,
      fontWeight: 'bold',
      letterSpacing: 5,
      dropShadow: true,
      dropShadowColor: 0x0088cc,
      dropShadowBlur: 15,
      dropShadowDistance: 0
    });
    breachTxt.anchor.set(0.5);
    breachTxt.x = Math.floor(W * 0.33);
    breachTxt.y = Math.floor(H * 0.40);
    breachTxt.alpha = 0;
    try {
      breachTxt.filters = [new PIXI.filters.GlowFilter({ distance: 20, outerStrength: 2.5, innerStrength: 1.0, color: 0x00aaff, quality: 0.3 })];
    } catch (e) {}
    finalContainer.addChild(breachTxt);

    var accessTxt = new PIXI.Text('ACCESS', {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontSize: 64,
      fill: 0xccffff,
      fontWeight: 'bold',
      letterSpacing: 5,
      dropShadow: true,
      dropShadowColor: 0x0088cc,
      dropShadowBlur: 15,
      dropShadowDistance: 0
    });
    accessTxt.anchor.set(0.5);
    accessTxt.x = Math.floor(W * 0.67);
    accessTxt.y = Math.floor(H * 0.36);
    accessTxt.alpha = 0;
    try {
      accessTxt.filters = [new PIXI.filters.GlowFilter({ distance: 20, outerStrength: 2.5, innerStrength: 1.0, color: 0x00aaff, quality: 0.3 })];
    } catch (e) {}
    finalContainer.addChild(accessTxt);

    // --- FUI ELEMENT 11: SPARKLE FLARE NODES ---
    var sparkles = new PIXI.Graphics();
    sparkles.blendMode = PIXI.BLEND_MODES.ADD;
    for (var sp = 0; sp < 50; sp++) {
      var sx = Math.random() * W;
      var sy = Math.random() * H * 0.78;
      var sr = 1 + Math.random() * 2.5;
      var pick = Math.random();
      if (pick < 0.12) { sparkles.beginFill(0xffffff, 0.6 + Math.random() * 0.3); }
      else if (pick < 0.35) { sparkles.beginFill(0x80eeff, 0.4 + Math.random() * 0.3); }
      else { sparkles.beginFill(0x00bbdd, 0.15 + Math.random() * 0.25); }
      sparkles.drawCircle(Math.floor(sx), Math.floor(sy), sr);
      sparkles.endFill();
    }
    finalContainer.addChild(sparkles);

    // =========================================================
    // GSAP ANIMATION TIMELINE
    // =========================================================

    // Rain animation loop
    tl.to({ frame: 0 }, {
      frame: 1,
      duration: 3.0,
      ease: 'none',
      onUpdate: function() {
        renderAllRain(rainCtx, allStreams, W, H);
        rainBaseTex.update();
      }
    }, 0);

    // Scan line sweeps
    tl.to(scanLine, { y: H + 20, duration: 2.5, ease: 'power1.inOut' }, 0.2);
    tl.to(scanLine, { alpha: 0, duration: 0.3 }, 2.7);
    tl.to(vScanLine, { x: W + 10, duration: 2.0, ease: 'power1.inOut' }, 0.8);
    tl.to(vScanLine, { alpha: 0, duration: 0.3 }, 2.8);

    // Rotating arcs
    tl.to(arcsOuter, { pixi: { rotation: 120 }, duration: 3.0, ease: 'none' }, 0);
    tl.to(arcsInner, { pixi: { rotation: -90 }, duration: 3.0, ease: 'none' }, 0);

    // Text fade-in/out
    tl.to(breachTxt, { alpha: 0.95, duration: 0.5, ease: 'power2.in' }, 0.5);
    tl.to(breachTxt, { alpha: 0, duration: 0.4, ease: 'power2.out' }, 2.6);
    tl.to(accessTxt, { alpha: 0.95, duration: 0.5, ease: 'power2.in' }, 0.9);
    tl.to(accessTxt, { alpha: 0, duration: 0.4, ease: 'power2.out' }, 2.6);

    // Sparkle pulsing
    tl.fromTo(sparkles, { alpha: 0.5 }, { alpha: 1.0, duration: 0.5, yoyo: true, repeat: 4, ease: 'sine.inOut' }, 0.2);

    // Corner brackets and edge ticks fade in
    tl.fromTo(corners, { alpha: 0 }, { alpha: 1, duration: 0.4 }, 0.1);
    tl.fromTo(edgeTicks, { alpha: 0 }, { alpha: 1, duration: 0.5 }, 0.15);

    // Data boxes and bands stagger in
    tl.fromTo(dataBoxes, { alpha: 0 }, { alpha: 1, duration: 0.5 }, 0.3);
    tl.fromTo(dataBands, { alpha: 0 }, { alpha: 1, duration: 0.6 }, 0.2);

    // Floor elements
    tl.fromTo(floorReflect, { alpha: 0 }, { alpha: 0.15, duration: 0.5 }, 0.3);

    // Master container fade-out
    tl.to(finalContainer, { alpha: 0, duration: 0.5, ease: 'power2.out' }, 3.0);
  }

  /**
   * Build Glitch Burst transition — chaotic digital corruption effect
   * RGB chromatic aberration, horizontal noise bands, static patches, corrupt characters
   * Reference: transition_glitch_burst.png, transition_animation_descriptions.pdf
   */
  _buildGlitchBurst(timeline) {
    // === DOM CONTAINER ===
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    const label = document.createElement('div');
    label.className = 'im-transition-fui-label';
    label.style.cssText = 'bottom:30px;left:50%;transform:translateX(-50%);top:auto;';
    label.textContent = '◇ GLITCH BURST ◇';
    container.appendChild(label);

    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const w = app.screen.width;
      const h = app.screen.height;

      // =========================================================
      // CONTAINERS
      // =========================================================
      const glitchContainer = new PIXI.Container();
      glitchContainer.alpha = 0;
      stage.addChild(glitchContainer);

      // Add static dense background layer FIRST (renders underneath animated layer)
      this._addGlitchBurstDensity(glitchContainer, w, h);

      // Add refinement layer (noise grain, dark band population, UI fragments, brighter radar)
      this._addGlitchBurstRefinement(glitchContainer, w, h);

      // Add color depth layer (full saturation range, muddy blocks, dark maroons, white accents)
      this._addGlitchBurstColorDepth(glitchContainer, w, h);

      // Sub-container for noise bands (redrawn on ticker)
      const noiseBandGfx = new PIXI.Graphics();
      glitchContainer.addChild(noiseBandGfx);

      // Sub-container for scan lines (drawn once)
      const scanLineGfx = new PIXI.Graphics();
      glitchContainer.addChild(scanLineGfx);

      // Sub-container for warning triangle
      const warningGfx = new PIXI.Graphics();
      glitchContainer.addChild(warningGfx);

      // Screen flash overlay
      const flashGfx = new PIXI.Graphics();
      flashGfx.beginFill(0xffffff, 1);
      flashGfx.drawRect(0, 0, w, h);
      flashGfx.endFill();
      flashGfx.alpha = 0;
      glitchContainer.addChild(flashGfx);

      // =========================================================
      // FILTERS — RGBSplitFilter + NoiseFilter on STAGE
      // =========================================================
      const rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

      // NoiseFilter is in pixi-filters
      let noiseFilter = null;
      if (PIXI.filters && PIXI.filters.NoiseFilter) {
        noiseFilter = new PIXI.filters.NoiseFilter();
        noiseFilter.noise = 0;
        noiseFilter.seed = Math.random();
      }

      // Apply filters to stage
      if (noiseFilter) {
        stage.filters = [rgbFilter, noiseFilter];
      } else {
        stage.filters = [rgbFilter];
      }

      // =========================================================
      // SCAN LINES — drawn once (static)
      // =========================================================
      for (let sli = 0; sli < 40; sli++) {
        const slY = Math.random() * h;
        const slAlpha = 0.03 + Math.random() * 0.08;
        scanLineGfx.beginFill(0xffffff, slAlpha);
        scanLineGfx.drawRect(0, slY, w, 1);
        scanLineGfx.endFill();
      }

      // =========================================================
      // WARNING TRIANGLE — upper right area
      // =========================================================
      const triCX = w * 0.72;
      const triCY = h * 0.22;
      const triSize = Math.min(w, h) * 0.08;

      // Orange filled triangle
      warningGfx.beginFill(0xff6b00, 0.9);
      warningGfx.moveTo(triCX, triCY - triSize);
      warningGfx.lineTo(triCX + triSize * 0.87, triCY + triSize * 0.5);
      warningGfx.lineTo(triCX - triSize * 0.87, triCY + triSize * 0.5);
      warningGfx.closePath();
      warningGfx.endFill();

      // Dark inner triangle
      warningGfx.beginFill(0x1a0800, 0.8);
      warningGfx.moveTo(triCX, triCY - triSize * 0.65);
      warningGfx.lineTo(triCX + triSize * 0.56, triCY + triSize * 0.32);
      warningGfx.lineTo(triCX - triSize * 0.56, triCY + triSize * 0.32);
      warningGfx.closePath();
      warningGfx.endFill();

      // Exclamation mark (bar + dot)
      warningGfx.beginFill(0xff6b00, 0.95);
      warningGfx.drawRect(triCX - 3, triCY - triSize * 0.35, 6, triSize * 0.4);
      warningGfx.endFill();
      warningGfx.beginFill(0xff6b00, 0.95);
      warningGfx.drawRect(triCX - 3, triCY + triSize * 0.12, 6, 6);
      warningGfx.endFill();

      // =========================================================
      // CORRUPT CHARACTERS — PIXI.Text objects
      // =========================================================
      const glitchChars = '\u2593\u2591\u2592\u2588\u2584\u2580\u25A0\u25A1\u25CA\u25D8\u25CB\u25CF\u2666\u2663\u2660';
      const charTexts = [];
      const charColors = [0x00d4ff, 0xff00ff, 0xff6b00, 0x00ff88, 0xffffff, 0xff0044];

      for (let ci = 0; ci < 25; ci++) {
        const charStr = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const charColor = charColors[Math.floor(Math.random() * charColors.length)];
        const charText = new PIXI.Text(charStr, {
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14 + Math.random() * 24,
          fill: charColor,
          fontWeight: 'bold'
        });
        charText.x = Math.random() * w;
        charText.y = Math.random() * h;
        charText.alpha = 0;
        charTexts.push(charText);
        glitchContainer.addChild(charText);
      }

      // Large center text — corrupted data string
      const centerText = new PIXI.Text('< 7FG\u00D7 \u2190 + \u2192 8\u2588@\u25CF >', {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: Math.min(w * 0.035, 32),
        fill: 0xffffff,
        fontWeight: 'bold',
        letterSpacing: 4
      });
      centerText.anchor.set(0.5);
      centerText.x = w * 0.42;
      centerText.y = h * 0.58;
      centerText.alpha = 0;
      glitchContainer.addChild(centerText);

      // =========================================================
      // NOISE BAND COLORS — mixed neon + desaturated per reference
      // =========================================================
      const bandColors = [
        0x00d4ff, 0xff00ff, 0xff0044, 0xff6b00, 0x556633,
        0x995566, 0x8800ff, 0x445566, 0xff3388, 0x44aaff,
        0x884422, 0xff8800, 0x336666, 0xff0088, 0x775533
      ];

      // =========================================================
      // TICKER — redraws noise bands every frame for chaos
      // =========================================================
      let frameCount = 0;
      let glitchActive = true;

      const drawNoiseBands = () => {
        if (!glitchActive) return;
        frameCount++;
        // Only redraw every 3 frames (~20fps) for performance
        if (frameCount % 3 !== 0) return;

        noiseBandGfx.clear();

        // 30-45 horizontal noise bands at random positions (doubled for density)
        const bandCount = 30 + Math.floor(Math.random() * 15);
        for (let bi = 0; bi < bandCount; bi++) {
          const bandY = Math.random() * h;
          const bandH = 2 + Math.random() * 25;
          const bandX = (Math.random() - 0.5) * 80;
          const bandW = w * (0.3 + Math.random() * 0.7);
          const bandColor = bandColors[Math.floor(Math.random() * bandColors.length)];
          const bandAlpha = 0.30 + Math.random() * 0.60;

          noiseBandGfx.beginFill(bandColor, bandAlpha);
          noiseBandGfx.drawRect(bandX, bandY, bandW, bandH);
          noiseBandGfx.endFill();
        }

        // 60-100 tiny noise rectangles (the "static" patches) - doubled for density
        const patchCount = 60 + Math.floor(Math.random() * 40);
        for (let pi = 0; pi < patchCount; pi++) {
          const px = Math.random() * w;
          const py = Math.random() * h;
          const pw = 2 + Math.random() * 12;
          const ph = 2 + Math.random() * 8;
          const pColor = bandColors[Math.floor(Math.random() * bandColors.length)];
          const pAlpha = 0.2 + Math.random() * 0.6;

          noiseBandGfx.beginFill(pColor, pAlpha);
          noiseBandGfx.drawRect(px, py, pw, ph);
          noiseBandGfx.endFill();
        }

        // Randomize corrupt character positions each update
        for (let cci = 0; cci < charTexts.length; cci++) {
          if (Math.random() < 0.3) {
            charTexts[cci].x = Math.random() * w;
            charTexts[cci].y = Math.random() * h;
          }
        }
      };

      // Add ticker callback
      app.ticker.add(drawNoiseBands);

      // =========================================================
      // GSAP TIMELINE
      // =========================================================

      // Phase 1: Flash in (0s - 0.1s)
      timeline.to(flashGfx, { alpha: 0.8, duration: 0.05, ease: 'power4.in' }, 0);
      timeline.to(flashGfx, { alpha: 0, duration: 0.05, ease: 'power4.out' }, 0.05);

      // Phase 1: Container appears (0s)
      timeline.to(glitchContainer, { alpha: 1, duration: 0.05, ease: 'none' }, 0);

      // Phase 2: RGB split ramps up (0s - 0.15s)
      timeline.to(rgbFilter, {
        duration: 0.15,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = this.progress();
          const intensity = progress * 20;
          rgbFilter.red = [-intensity, 0];
          rgbFilter.blue = [intensity, 0];
          rgbFilter.green = [0, intensity * 0.3];
        }
      }, 0);

      // Phase 2: Noise filter ramps up (0s - 0.1s)
      if (noiseFilter) {
        timeline.to(noiseFilter, { noise: 0.35, duration: 0.1, ease: 'power2.out' }, 0);
      }

      // Phase 3: Corrupt characters flash in/out randomly (0.1s - 1.0s)
      for (let cci2 = 0; cci2 < charTexts.length; cci2++) {
        const charDelay = 0.1 + Math.random() * 0.7;
        const charDur = 0.05 + Math.random() * 0.15;
        timeline.to(charTexts[cci2], { alpha: 0.7 + Math.random() * 0.3, duration: 0.03 }, charDelay);
        timeline.to(charTexts[cci2], { alpha: 0, duration: charDur }, charDelay + 0.03 + charDur);
      }

      // Phase 3: Center text flashes (0.3s - 0.8s)
      timeline.to(centerText, { alpha: 0.9, duration: 0.03 }, 0.3);
      timeline.to(centerText, { alpha: 0, duration: 0.1 }, 0.6);
      timeline.to(centerText, { alpha: 0.8, duration: 0.03 }, 0.75);
      timeline.to(centerText, { alpha: 0, duration: 0.1 }, 0.85);

      // Phase 3: RGB split oscillates wildly (0.15s - 1.0s)
      timeline.to(rgbFilter, {
        duration: 0.85,
        ease: 'none',
        onUpdate: function() {
          const rx = (Math.random() - 0.5) * 40;
          const bx = (Math.random() - 0.5) * 40;
          const gy = (Math.random() - 0.5) * 15;
          rgbFilter.red = [rx, Math.random() * 5];
          rgbFilter.blue = [bx, -Math.random() * 5];
          rgbFilter.green = [Math.random() * 3, gy];
        }
      }, 0.15);

      // Phase 3: Noise seed changes for animated static
      if (noiseFilter) {
        timeline.to(noiseFilter, {
          duration: 0.85,
          ease: 'none',
          onUpdate: function() {
            noiseFilter.seed = Math.random();
          }
        }, 0.15);
      }

      // Phase 3: Second flash at 0.5s
      timeline.to(flashGfx, { alpha: 0.5, duration: 0.03 }, 0.5);
      timeline.to(flashGfx, { alpha: 0, duration: 0.05 }, 0.53);

      // Phase 4: Settle down (1.0s - 1.4s)
      timeline.to(rgbFilter, {
        duration: 0.4,
        ease: 'power2.in',
        onUpdate: function() {
          const progress = this.progress();
          const decay = 1 - progress;
          const rx = (Math.random() - 0.5) * 20 * decay;
          const bx = (Math.random() - 0.5) * 20 * decay;
          rgbFilter.red = [rx, 0];
          rgbFilter.blue = [bx, 0];
          rgbFilter.green = [0, 0];
        }
      }, 1.0);

      // Phase 4: Noise fades
      if (noiseFilter) {
        timeline.to(noiseFilter, { noise: 0, duration: 0.4, ease: 'power2.in' }, 1.0);
      }

      // Phase 4: Container fades out
      timeline.to(glitchContainer, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.1);

      // Phase 5: Final cleanup at end of timeline (1.5s)
      timeline.call(function() {
        // Stop ticker
        glitchActive = false;
        app.ticker.remove(drawNoiseBands);

        // Reset stage filters
        stage.filters = null;

        // Reset RGB filter
        rgbFilter.red = [0, 0];
        rgbFilter.blue = [0, 0];
        rgbFilter.green = [0, 0];
      }, null, null, 1.5);
    }

    // Label fade animation
    gsap.set(label, { opacity: 0 });
    timeline.to(label, { opacity: 0.7, duration: 0.3, ease: 'power2.out' }, 0.3);
    timeline.to(label, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.2);
  }

  /**
   * Build Black Widow Glitch transition — crimson/black digital security breach effect
   * Horizontal glitch bars, crimson noise, scanline interference, data corruption
   * Called independently via playWidowGlitch(), never through random transition pool
   */
  _buildWidowGlitch(timeline) {
    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const w = app.screen.width;
      const h = app.screen.height;

      // =========================================================
      // CRIMSON COLOR PALETTE — Black Widow theme
      // =========================================================
      const widowColors = [
        0xcc0000,  // Primary crimson
        0x8b0000,  // Shadow/dark
        0xff1a1a,  // Glow/highlight
        0x660000,  // Deep dark
        0xff0000,  // Pure red
        0x990000,  // Mid crimson
        0x440000,  // Very dark
        0xaa0000   // Alternate crimson
      ];

      // =========================================================
      // CONTAINERS
      // =========================================================
      const glitchContainer = new PIXI.Container();
      glitchContainer.alpha = 0;
      stage.addChild(glitchContainer);

      // =========================================================
      // STATIC BACKGROUND — Dense crimson noise bands (drawn once)
      // =========================================================
      const denseBg = new PIXI.Graphics();

      // Fill with near-black background
      denseBg.beginFill(0x0a0a0a, 1);
      denseBg.drawRect(0, 0, w, h);
      denseBg.endFill();

      // Horizontal crimson noise bands covering the screen
      let bandY = 0;
      while (bandY < h) {
        const bandH = 2 + Math.floor(Math.random() * 30);
        const bandType = Math.random();

        if (bandType < 0.4) {
          // Dense crimson band
          const bandColor = widowColors[Math.floor(Math.random() * widowColors.length)];
          const bandAlpha = 0.15 + Math.random() * 0.35;
          denseBg.beginFill(bandColor, bandAlpha);
          denseBg.drawRect(0, bandY, w, bandH);
          denseBg.endFill();

          // Sub-blocks within the band
          const subBlockCount = Math.floor(w / 15);
          for (let sb = 0; sb < subBlockCount; sb++) {
            if (Math.random() < 0.35) {
              const sbColor = widowColors[Math.floor(Math.random() * widowColors.length)];
              const sbAlpha = 0.2 + Math.random() * 0.45;
              const sbW = 3 + Math.random() * 15;
              const sbX = sb * 15 + Math.random() * 8;
              denseBg.beginFill(sbColor, sbAlpha);
              denseBg.drawRect(sbX, bandY, sbW, bandH);
              denseBg.endFill();
            }
          }
        } else if (bandType < 0.7) {
          // Dark gap band
          denseBg.beginFill(0x0a0a0a, 0.9);
          denseBg.drawRect(0, bandY, w, bandH);
          denseBg.endFill();
        }
        // else skip - creates visual breathing room

        bandY += bandH + Math.floor(Math.random() * 3);
      }

      // Scattered crimson static patches
      for (let p = 0; p < 80; p++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const pw = 3 + Math.random() * 20;
        const ph = 2 + Math.random() * 10;
        const pColor = widowColors[Math.floor(Math.random() * widowColors.length)];
        const pAlpha = 0.15 + Math.random() * 0.4;
        denseBg.beginFill(pColor, pAlpha);
        denseBg.drawRect(px, py, pw, ph);
        denseBg.endFill();
      }

      glitchContainer.addChild(denseBg);

      // =========================================================
      // ANIMATED NOISE BANDS (redrawn on ticker)
      // =========================================================
      const noiseBandGfx = new PIXI.Graphics();
      glitchContainer.addChild(noiseBandGfx);

      // =========================================================
      // SCAN LINES — crimson tint (drawn once)
      // =========================================================
      const scanLineGfx = new PIXI.Graphics();
      for (let sli = 0; sli < 50; sli++) {
        const slY = Math.random() * h;
        const slAlpha = 0.02 + Math.random() * 0.06;
        scanLineGfx.beginFill(0xcc0000, slAlpha);
        scanLineGfx.drawRect(0, slY, w, 1);
        scanLineGfx.endFill();
      }
      glitchContainer.addChild(scanLineGfx);

      // =========================================================
      // SCREEN FLASH OVERLAY — crimson flash
      // =========================================================
      const flashGfx = new PIXI.Graphics();
      flashGfx.beginFill(0xcc0000, 1);
      flashGfx.drawRect(0, 0, w, h);
      flashGfx.endFill();
      flashGfx.alpha = 0;
      glitchContainer.addChild(flashGfx);

      // =========================================================
      // CORRUPT CHARACTERS — crimson themed
      // =========================================================
      const glitchChars = '\u2593\u2591\u2592\u2588\u2584\u2580\u25A0\u25A1\u25CA\u25D8\u25CB\u25CF\u2666';
      const charTexts = [];
      const charColors = [0xcc0000, 0xff1a1a, 0x8b0000, 0xff0000, 0xaa0000];

      for (let ci = 0; ci < 20; ci++) {
        const charStr = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const charColor = charColors[Math.floor(Math.random() * charColors.length)];
        const charText = new PIXI.Text(charStr, {
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14 + Math.random() * 24,
          fill: charColor,
          fontWeight: 'bold'
        });
        charText.x = Math.random() * w;
        charText.y = Math.random() * h;
        charText.alpha = 0;
        charTexts.push(charText);
        glitchContainer.addChild(charText);
      }

      // =========================================================
      // FILTERS — RGBSplitFilter + NoiseFilter on STAGE
      // =========================================================
      const rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]);

      let noiseFilter = null;
      if (PIXI.filters && PIXI.filters.NoiseFilter) {
        noiseFilter = new PIXI.filters.NoiseFilter();
        noiseFilter.noise = 0;
        noiseFilter.seed = Math.random();
      }

      if (noiseFilter) {
        stage.filters = [rgbFilter, noiseFilter];
      } else {
        stage.filters = [rgbFilter];
      }

      // =========================================================
      // TICKER — redraws noise bands every frame
      // =========================================================
      let frameCount = 0;
      let glitchActive = true;

      const drawNoiseBands = () => {
        if (!glitchActive) return;
        frameCount++;
        if (frameCount % 3 !== 0) return;

        noiseBandGfx.clear();

        // Horizontal noise bands
        const bandCount = 25 + Math.floor(Math.random() * 15);
        for (let bi = 0; bi < bandCount; bi++) {
          const bandY = Math.random() * h;
          const bandH = 2 + Math.random() * 20;
          const bandX = (Math.random() - 0.5) * 60;
          const bandW = w * (0.25 + Math.random() * 0.75);
          const bandColor = widowColors[Math.floor(Math.random() * widowColors.length)];
          const bandAlpha = 0.25 + Math.random() * 0.5;

          noiseBandGfx.beginFill(bandColor, bandAlpha);
          noiseBandGfx.drawRect(bandX, bandY, bandW, bandH);
          noiseBandGfx.endFill();
        }

        // Small static patches
        const patchCount = 50 + Math.floor(Math.random() * 30);
        for (let pi = 0; pi < patchCount; pi++) {
          const px = Math.random() * w;
          const py = Math.random() * h;
          const pw = 2 + Math.random() * 10;
          const ph = 2 + Math.random() * 6;
          const pColor = widowColors[Math.floor(Math.random() * widowColors.length)];
          const pAlpha = 0.2 + Math.random() * 0.5;

          noiseBandGfx.beginFill(pColor, pAlpha);
          noiseBandGfx.drawRect(px, py, pw, ph);
          noiseBandGfx.endFill();
        }

        // Randomize corrupt character positions
        for (let cci = 0; cci < charTexts.length; cci++) {
          if (Math.random() < 0.25) {
            charTexts[cci].x = Math.random() * w;
            charTexts[cci].y = Math.random() * h;
          }
        }
      };

      app.ticker.add(drawNoiseBands);

      // =========================================================
      // GSAP TIMELINE — 2.5 second duration
      // =========================================================

      // Phase 1: Crimson flash in (0s - 0.15s)
      timeline.to(flashGfx, { alpha: 0.7, duration: 0.07, ease: 'power4.in' }, 0);
      timeline.to(flashGfx, { alpha: 0, duration: 0.08, ease: 'power4.out' }, 0.07);

      // Phase 1: Container appears
      timeline.to(glitchContainer, { alpha: 1, duration: 0.05, ease: 'none' }, 0);

      // Phase 2: RGB split ramps up with red emphasis (0s - 0.2s)
      timeline.to(rgbFilter, {
        duration: 0.2,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = this.progress();
          const intensity = progress * 25;
          rgbFilter.red = [intensity, 0];
          rgbFilter.blue = [-intensity * 0.3, 0];
          rgbFilter.green = [0, intensity * 0.2];
        }
      }, 0);

      // Phase 2: Noise filter ramps up
      if (noiseFilter) {
        timeline.to(noiseFilter, { noise: 0.4, duration: 0.15, ease: 'power2.out' }, 0);
      }

      // Phase 3: Corrupt characters flash randomly (0.15s - 1.8s)
      for (let cci2 = 0; cci2 < charTexts.length; cci2++) {
        const charDelay = 0.15 + Math.random() * 1.2;
        const charDur = 0.05 + Math.random() * 0.2;
        timeline.to(charTexts[cci2], { alpha: 0.6 + Math.random() * 0.4, duration: 0.04 }, charDelay);
        timeline.to(charTexts[cci2], { alpha: 0, duration: charDur }, charDelay + 0.04 + charDur);
      }

      // Phase 3: RGB split oscillates with red bias (0.2s - 1.8s)
      timeline.to(rgbFilter, {
        duration: 1.6,
        ease: 'none',
        onUpdate: function() {
          const rx = 15 + (Math.random() - 0.3) * 35;
          const bx = (Math.random() - 0.5) * 20;
          const gy = (Math.random() - 0.5) * 10;
          rgbFilter.red = [rx, Math.random() * 4];
          rgbFilter.blue = [bx, -Math.random() * 3];
          rgbFilter.green = [Math.random() * 2, gy];
        }
      }, 0.2);

      // Phase 3: Noise seed animates
      if (noiseFilter) {
        timeline.to(noiseFilter, {
          duration: 1.6,
          ease: 'none',
          onUpdate: function() {
            noiseFilter.seed = Math.random();
          }
        }, 0.2);
      }

      // Phase 3: Second flash at 0.8s
      timeline.to(flashGfx, { alpha: 0.4, duration: 0.04 }, 0.8);
      timeline.to(flashGfx, { alpha: 0, duration: 0.06 }, 0.84);

      // Phase 3: Third flash at 1.4s
      timeline.to(flashGfx, { alpha: 0.3, duration: 0.03 }, 1.4);
      timeline.to(flashGfx, { alpha: 0, duration: 0.05 }, 1.43);

      // Phase 4: Settle down (1.8s - 2.3s)
      timeline.to(rgbFilter, {
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: function() {
          const progress = this.progress();
          const decay = 1 - progress;
          const rx = 10 * decay + (Math.random() - 0.5) * 15 * decay;
          const bx = (Math.random() - 0.5) * 10 * decay;
          rgbFilter.red = [rx, 0];
          rgbFilter.blue = [bx, 0];
          rgbFilter.green = [0, 0];
        }
      }, 1.8);

      // Phase 4: Noise fades
      if (noiseFilter) {
        timeline.to(noiseFilter, { noise: 0, duration: 0.5, ease: 'power2.in' }, 1.8);
      }

      // Phase 4: Container fades out
      timeline.to(glitchContainer, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 2.0);

      // Phase 5: Cleanup at end (2.5s)
      timeline.call(function() {
        glitchActive = false;
        app.ticker.remove(drawNoiseBands);
        stage.filters = null;
        rgbFilter.red = [0, 0];
        rgbFilter.blue = [0, 0];
        rgbFilter.green = [0, 0];
      }, null, null, 2.5);
    }
  }

  /**
   * Add static dense background to Glitch Burst — drawn ONCE, provides 90% screen coverage
   * Per ChatGPT PixiJS report: "Graphics fastest when not modified"
   */
  _addGlitchBurstDensity(glitchContainer, w, h) {
    // =============================================================
    // STATIC DENSE BACKGROUND — drawn ONCE, never redrawn
    // This layer provides the 90% base density that the reference has
    // =============================================================

    var denseBg = new PIXI.Graphics();

    // COLOR PALETTE — mixed neon + desaturated per reference (50/50)
    var colors = [
        0xff0044, 0xff00ff, 0x00d4ff, 0xff6b00, 0x556633,
        0x995566, 0x8800ff, 0x445566, 0xff3388, 0x44aaff,
        0x884422, 0xff8800, 0x336666, 0xff0088, 0x775533,
        0x667744, 0xff4444, 0x0088ff, 0x886688, 0x554444,
        0x440011, 0x00ffff, 0xff6600, 0x4a5a6a, 0x660022,
        0x2244ff, 0x225522, 0xff00cc, 0x443333, 0x0a1530
    ];

    // =============================================
    // LAYER 1: FULL-WIDTH HORIZONTAL NOISE BANDS
    // These fill the ENTIRE screen height, edge to edge
    // =============================================
    var bandY = 0;
    while (bandY < h) {
        var bandH = 2 + Math.floor(Math.random() * 35);
        var bandType = Math.random();

        if (bandType < 0.35) {
            // DENSE NOISE BAND — bright, multicolor, packed with small blocks
            var bandColor = colors[Math.floor(Math.random() * colors.length)];
            var bandAlpha = 0.20 + Math.random() * 0.50;
            denseBg.beginFill(bandColor, bandAlpha);
            denseBg.drawRect(0, bandY, w, bandH);
            denseBg.endFill();

            // Sub-blocks within the band for texture
            var subBlockCount = Math.floor(w / 12);
            for (var sb = 0; sb < subBlockCount; sb++) {
                if (Math.random() < 0.4) {
                    var sbColor = colors[Math.floor(Math.random() * colors.length)];
                    var sbAlpha = 0.25 + Math.random() * 0.55;
                    var sbW = 3 + Math.random() * 18;
                    var sbX = sb * 12 + Math.random() * 6;
                    denseBg.beginFill(sbColor, sbAlpha);
                    denseBg.drawRect(sbX, bandY, sbW, bandH);
                    denseBg.endFill();
                }
            }
        } else if (bandType < 0.55) {
            // DARK BAND with scattered pixels — the "quieter" zones
            denseBg.beginFill(0x0a0a14, 0.7);
            denseBg.drawRect(0, bandY, w, bandH);
            denseBg.endFill();

            // Scattered colored pixels within dark band
            for (var dp = 0; dp < 15; dp++) {
                var dpColor = colors[Math.floor(Math.random() * colors.length)];
                denseBg.beginFill(dpColor, 0.15 + Math.random() * 0.35);
                denseBg.drawRect(Math.random() * w, bandY + Math.random() * bandH, 2 + Math.random() * 6, 1 + Math.random() * 3);
                denseBg.endFill();
            }
        } else if (bandType < 0.75) {
            // GRADIENT-ISH BAND — color shifts across width
            var segCount = 8 + Math.floor(Math.random() * 4);
            var segW = w / segCount;
            for (var gs = 0; gs < segCount; gs++) {
                var gsColor = colors[Math.floor(Math.random() * colors.length)];
                var gsAlpha = 0.15 + Math.random() * 0.45;
                denseBg.beginFill(gsColor, gsAlpha);
                denseBg.drawRect(gs * segW, bandY, segW + 2, bandH);
                denseBg.endFill();
            }
        } else {
            // THIN INTERFERENCE LINE — 1-3px bright streak
            bandH = 1 + Math.floor(Math.random() * 2);
            var lineColor = colors[Math.floor(Math.random() * colors.length)];
            denseBg.beginFill(lineColor, 0.3 + Math.random() * 0.5);
            denseBg.drawRect(0, bandY, w * (0.3 + Math.random() * 0.7), bandH);
            denseBg.endFill();
        }

        bandY += bandH + Math.floor(Math.random() * 3);
    }

    // =============================================
    // LAYER 2: BLOCK ARTIFACTS (8x8 and 16x16)
    // Compression failure blocks — solid colored squares
    // =============================================
    for (var ba = 0; ba < 150; ba++) {
        var blockSize = (Math.random() < 0.6) ? 8 : 16;
        var bx = Math.floor(Math.random() * (w / blockSize)) * blockSize;
        var by = Math.floor(Math.random() * (h / blockSize)) * blockSize;
        var bColor = colors[Math.floor(Math.random() * colors.length)];
        var bAlpha = 0.25 + Math.random() * 0.60;
        denseBg.beginFill(bColor, bAlpha);
        denseBg.drawRect(bx, by, blockSize, blockSize);
        denseBg.endFill();
    }

    // =============================================
    // LAYER 3: SURVIVING UI FRAGMENTS
    // =============================================

    // RADAR — concentric rings, upper-left area
    var radarCX = w * 0.18;
    var radarCY = h * 0.22;
    var radarR = Math.min(w, h) * 0.10;
    denseBg.lineStyle(2, 0x00d4ff, 0.35);
    denseBg.drawCircle(radarCX, radarCY, radarR);
    denseBg.lineStyle(1.5, 0x00d4ff, 0.25);
    denseBg.drawCircle(radarCX, radarCY, radarR * 0.7);
    denseBg.lineStyle(1, 0x00d4ff, 0.20);
    denseBg.drawCircle(radarCX, radarCY, radarR * 0.4);
    denseBg.lineStyle(0);
    denseBg.beginFill(0x00d4ff, 0.5);
    denseBg.drawCircle(radarCX, radarCY, 3);
    denseBg.endFill();
    denseBg.lineStyle(2.5, 0x00d4ff, 0.18);
    denseBg.arc(radarCX, radarCY, radarR * 0.85, 0.2, 1.4);
    denseBg.lineStyle(0);

    // BAR CHART — lower-right area
    var chartX = w * 0.70;
    var chartY = h * 0.58;
    var barW = 8;
    var barSpacing = 12;
    var chartBars = [0.6, 0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.55];
    for (var cbi = 0; cbi < chartBars.length; cbi++) {
        var barH = 40 * chartBars[cbi];
        var barColor = (cbi % 3 === 2) ? 0xff8800 : 0x00d4ff;
        denseBg.beginFill(barColor, 0.35);
        denseBg.drawRect(chartX + cbi * barSpacing, chartY + 40 - barH, barW, barH);
        denseBg.endFill();
    }
    denseBg.lineStyle(1, 0x00d4ff, 0.15);
    denseBg.drawRect(chartX - 4, chartY - 4, chartBars.length * barSpacing + 4, 48);
    denseBg.lineStyle(0);

    // PANEL OUTLINES — ghostly remnants
    denseBg.lineStyle(1, 0x00d4ff, 0.06);
    denseBg.drawRect(w * 0.01, h * 0.05, w * 0.15, h * 0.35);
    denseBg.drawRect(w * 0.01, h * 0.42, w * 0.12, h * 0.15);
    denseBg.drawRect(w * 0.82, h * 0.08, w * 0.16, h * 0.30);
    denseBg.drawRect(w * 0.85, h * 0.65, w * 0.12, h * 0.20);
    denseBg.lineStyle(0);

    // HEXAGONAL PATTERN — faint hex grid in upper-right
    denseBg.lineStyle(0.5, 0x00d4ff, 0.04);
    var hexR = 14;
    for (var hxi = 0; hxi < 8; hxi++) {
        for (var hyi = 0; hyi < 5; hyi++) {
            var hx = w * 0.55 + hxi * hexR * 1.75 + (hyi % 2) * hexR * 0.87;
            var hy = h * 0.10 + hyi * hexR * 1.5;
            denseBg.moveTo(hx + hexR, hy);
            for (var hv = 1; hv <= 6; hv++) {
                denseBg.lineTo(hx + hexR * Math.cos(Math.PI / 3 * hv), hy + hexR * Math.sin(Math.PI / 3 * hv));
            }
        }
    }
    denseBg.lineStyle(0);

    // =============================================
    // LAYER 4: LARGE WHITE CENTER TEXT BLOCK
    // =============================================
    var bigText = new PIXI.Text('|||6Ä!||', {
        fontFamily: 'Orbitron, monospace',
        fontSize: Math.min(w * 0.08, 72),
        fill: 0xffffff,
        fontWeight: '900',
        letterSpacing: 12
    });
    bigText.anchor.set(0.5);
    bigText.x = w * 0.45;
    bigText.y = h * 0.42;
    bigText.alpha = 0.85;
    glitchContainer.addChild(bigText);

    // Second line of smaller corrupted text
    var subText = new PIXI.Text('SCANNING... \u2593\u2593\u2593 ERR:0x4F2A \u2593\u2593\u2593', {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: Math.min(w * 0.018, 16),
        fill: 0x00d4ff,
        letterSpacing: 3
    });
    subText.anchor.set(0.5);
    subText.x = w * 0.18;
    subText.y = h * 0.28;
    subText.alpha = 0.4;
    glitchContainer.addChild(subText);

    // =============================================
    // LAYER 5: ADDITIONAL CORRUPT CHARACTERS (40 more)
    // =============================================
    var glitchChars = '\u2593\u2591\u2592\u2588\u2584\u2580\u25A0\u25A1\u25CA\u25D8\u25CB\u25CF\u2666\u2663\u2660\u25B6\u25C0\u25BC\u25B2';
    var charColors = [0x00d4ff, 0xff00ff, 0xff6b00, 0x00ff88, 0xffffff, 0xff0044, 0xffff00, 0x8800ff];

    for (var eci = 0; eci < 40; eci++) {
        var ecChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        var ecColor = charColors[Math.floor(Math.random() * charColors.length)];
        var ecText = new PIXI.Text(ecChar, {
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10 + Math.random() * 20,
            fill: ecColor,
            fontWeight: 'bold'
        });
        ecText.x = Math.random() * w;
        ecText.y = Math.random() * h;
        ecText.alpha = 0.15 + Math.random() * 0.55;
        glitchContainer.addChild(ecText);
    }

    // =============================================
    // LAYER 6: DENSE SCAN LINES (CRT effect)
    // =============================================
    var denseScanLines = new PIXI.Graphics();
    for (var dsl = 0; dsl < h; dsl += 3) {
        denseScanLines.beginFill(0x000000, 0.12);
        denseScanLines.drawRect(0, dsl, w, 1);
        denseScanLines.endFill();
    }
    denseScanLines.alpha = 0.6;

    // =============================================
    // ADD TO CONTAINER
    // denseBg goes FIRST (underneath everything)
    // denseScanLines goes on TOP for CRT effect
    // =============================================
    glitchContainer.addChildAt(denseBg, 0);
    glitchContainer.addChild(denseScanLines);
  }

  /**
   * Add refinement layer to Glitch Burst — addresses 6 specific visual gaps:
   * NoiseFilter grain, dark band population, UI fragments, muddy colors, boundary bridging, brighter radar
   */
  _addGlitchBurstRefinement(glitchContainer, w, h) {
    // =============================================================
    // REFINEMENT LAYER — addresses 6 specific visual gaps
    // All drawn ONCE, static, per ChatGPT PixiJS report
    // =============================================================

    var refinementGfx = new PIXI.Graphics();

    // =============================================
    // FIX 1: NoiseFilter on glitchContainer
    // GPU shader adds pixel-level grain to ALL children
    // =============================================
    var containerNoise = new PIXI.filters.NoiseFilter();
    containerNoise.noise = 0.18;
    containerNoise.seed = Math.random();

    var existingContainerFilters = glitchContainer.filters ? glitchContainer.filters.slice() : [];
    glitchContainer.filters = existingContainerFilters.concat([containerNoise]);

    // =============================================
    // FIX 2: DARK BAND POPULATION
    // 200 dim micro-artifacts across the entire screen
    // =============================================
    var microColors = [
        0x00d4ff, 0xff00ff, 0xff0044, 0xff6b00, 0x00ff88,
        0xffff00, 0x8800ff, 0x44aaff, 0xff3388, 0x00ffcc,
        0xff0000, 0x00ff00, 0x0000ff, 0xffffff, 0xcccccc
    ];

    for (var mi = 0; mi < 200; mi++) {
        var mx = Math.random() * w;
        var my = Math.random() * h;
        var mColor = microColors[Math.floor(Math.random() * microColors.length)];

        if (Math.random() < 0.6) {
            var mSize = 1 + Math.random();
            var mAlpha = 0.10 + Math.random() * 0.40;
            refinementGfx.beginFill(mColor, mAlpha);
            refinementGfx.drawRect(mx, my, mSize, mSize);
            refinementGfx.endFill();
        } else {
            var mbW = 3 + Math.random() * 5;
            var mbH = 2 + Math.random() * 4;
            var mbAlpha = 0.08 + Math.random() * 0.25;
            refinementGfx.beginFill(mColor, mbAlpha);
            refinementGfx.drawRect(mx, my, mbW, mbH);
            refinementGfx.endFill();
        }
    }

    // Faint color tints in dark zones
    for (var dti = 0; dti < 12; dti++) {
        var dtY = Math.random() * h;
        var dtH = 15 + Math.random() * 40;
        var dtColor = microColors[Math.floor(Math.random() * microColors.length)];
        refinementGfx.beginFill(dtColor, 0.02 + Math.random() * 0.04);
        refinementGfx.drawRect(0, dtY, w, dtH);
        refinementGfx.endFill();
    }

    // =============================================
    // FIX 4: DESATURATED / MUDDY COLOR BLOCKS
    // 80 blocks in olive, brown, dusty pink, charcoal, navy, dark teal
    // =============================================
    var muddyColors = [
        0x4a3b2a, 0x2a3b4a, 0x3b2a4a, 0x4a4a2a, 0x2a4a3b,
        0x5a4030, 0x304050, 0x403050, 0x505030, 0x305040,
        0x6b5040, 0x405060, 0x504060, 0x606040, 0x406050,
        0x8a7060, 0x607080, 0x706080, 0x808060, 0x608070,
        0x1a1a2a, 0x2a1a1a, 0x1a2a1a, 0x332244, 0x443322,
        0x9a8070, 0x708090, 0x807090, 0xaa9080, 0x8090a0,
        0xccbbaa, 0xaabbcc, 0xbbaacc, 0xddccbb, 0xbbccdd
    ];

    for (var mdi = 0; mdi < 80; mdi++) {
        var mdX = Math.random() * w;
        var mdY = Math.random() * h;
        var mdW = 4 + Math.random() * 25;
        var mdH = 3 + Math.random() * 15;
        var mdColor = muddyColors[Math.floor(Math.random() * muddyColors.length)];
        var mdAlpha = 0.20 + Math.random() * 0.50;
        refinementGfx.beginFill(mdColor, mdAlpha);
        refinementGfx.drawRect(mdX, mdY, mdW, mdH);
        refinementGfx.endFill();
    }

    // Near-white blown-out blocks
    for (var bhi = 0; bhi < 15; bhi++) {
        var bhX = Math.random() * w;
        var bhY = Math.random() * h;
        var bhW = 3 + Math.random() * 20;
        var bhH = 2 + Math.random() * 6;
        refinementGfx.beginFill(0xffffff, 0.15 + Math.random() * 0.35);
        refinementGfx.drawRect(bhX, bhY, bhW, bhH);
        refinementGfx.endFill();
    }

    // Near-black dead-zone blocks
    for (var nbi = 0; nbi < 20; nbi++) {
        var nbX = Math.random() * w;
        var nbY = Math.random() * h;
        var nbW = 5 + Math.random() * 30;
        var nbH = 3 + Math.random() * 12;
        refinementGfx.beginFill(0x050508, 0.40 + Math.random() * 0.50);
        refinementGfx.drawRect(nbX, nbY, nbW, nbH);
        refinementGfx.endFill();
    }

    // =============================================
    // FIX 5: BOUNDARY-CROSSING BLOCKS
    // 50+ blocks that deliberately span band boundaries
    // =============================================

    // Vertical bridging streaks
    for (var vbi = 0; vbi < 30; vbi++) {
        var vbX = Math.random() * w;
        var vbY = Math.random() * h;
        var vbW = 1 + Math.random() * 3;
        var vbH = 10 + Math.random() * 40;
        var vbColor = microColors[Math.floor(Math.random() * microColors.length)];
        refinementGfx.beginFill(vbColor, 0.10 + Math.random() * 0.30);
        refinementGfx.drawRect(vbX, vbY, vbW, vbH);
        refinementGfx.endFill();
    }

    // Wider boundary overlap blocks
    for (var obi = 0; obi < 20; obi++) {
        var obX = Math.random() * w * 0.8;
        var obY = Math.random() * h;
        var obW = 15 + Math.random() * 60;
        var obH = 3 + Math.random() * 8;
        var obColor = microColors[Math.floor(Math.random() * microColors.length)];
        refinementGfx.beginFill(obColor, 0.12 + Math.random() * 0.25);
        refinementGfx.drawRect(obX, obY, obW, obH);
        refinementGfx.endFill();
    }

    // Boundary bleed
    for (var bbi = 0; bbi < 25; bbi++) {
        var bbY = Math.random() * h;
        var bbColor = microColors[Math.floor(Math.random() * microColors.length)];
        refinementGfx.beginFill(bbColor, 0.04 + Math.random() * 0.08);
        refinementGfx.drawRect(0, bbY, w * (0.4 + Math.random() * 0.6), 2);
        refinementGfx.endFill();
    }

    glitchContainer.addChild(refinementGfx);

    // =============================================
    // FIX 6: BRIGHTER RADAR OVERLAY
    // =============================================
    var radarGfx = new PIXI.Graphics();
    var rCX = w * 0.18;
    var rCY = h * 0.22;
    var rR = Math.min(w, h) * 0.10;

    // Bright cyan outer ring
    radarGfx.lineStyle(2.5, 0x00d4ff, 0.55);
    radarGfx.arc(rCX, rCY, rR, 0, Math.PI * 1.4);
    radarGfx.moveTo(rCX + rR * 0.7 * Math.cos(4.8), rCY + rR * 0.7 * Math.sin(4.8));
    radarGfx.lineStyle(2, 0x00d4ff, 0.45);
    radarGfx.arc(rCX, rCY, rR * 0.7, 4.8, Math.PI * 2 + 0.5);

    // Green-shifted corrupted arc
    radarGfx.moveTo(rCX + rR * 0.85 * Math.cos(2.0), rCY + rR * 0.85 * Math.sin(2.0));
    radarGfx.lineStyle(2, 0x00ff44, 0.40);
    radarGfx.arc(rCX, rCY, rR * 0.85, 2.0, 3.2);

    // Red-shifted corrupted arc
    radarGfx.moveTo(rCX + rR * 0.55 * Math.cos(0.5), rCY + rR * 0.55 * Math.sin(0.5));
    radarGfx.lineStyle(1.5, 0xff3344, 0.35);
    radarGfx.arc(rCX, rCY, rR * 0.55, 0.5, 1.8);

    // Inner ring
    radarGfx.moveTo(rCX + rR * 0.4, rCY);
    radarGfx.lineStyle(1.5, 0x00d4ff, 0.40);
    radarGfx.arc(rCX, rCY, rR * 0.4, 0, Math.PI * 2);

    // Bright center dot
    radarGfx.lineStyle(0);
    radarGfx.beginFill(0x00eeff, 0.70);
    radarGfx.drawCircle(rCX, rCY, 4);
    radarGfx.endFill();

    // Radial tick marks
    for (var rti = 0; rti < 8; rti++) {
        var rtAngle = (Math.PI * 2 / 8) * rti;
        var rtInner = rR * 0.92;
        var rtOuter = rR * 1.02;
        radarGfx.lineStyle(1, 0x00d4ff, 0.30);
        radarGfx.moveTo(rCX + rtInner * Math.cos(rtAngle), rCY + rtInner * Math.sin(rtAngle));
        radarGfx.lineTo(rCX + rtOuter * Math.cos(rtAngle), rCY + rtOuter * Math.sin(rtAngle));
    }
    radarGfx.lineStyle(0);

    // Cyan glow behind radar
    var radarGlow = new PIXI.Graphics();
    radarGlow.beginFill(0x003344, 0.25);
    radarGlow.drawCircle(rCX, rCY, rR * 1.15);
    radarGlow.endFill();
    radarGlow.beginFill(0x004455, 0.15);
    radarGlow.drawCircle(rCX, rCY, rR * 1.4);
    radarGlow.endFill();

    glitchContainer.addChild(radarGlow);
    glitchContainer.addChild(radarGfx);

    // =============================================
    // FIX 3: MORE SURVIVING UI ELEMENTS
    // =============================================

    // BAR CHART (lower-right)
    var chartGfx = new PIXI.Graphics();
    var cX = w * 0.72;
    var cY = h * 0.60;
    var barW = 10;
    var barGap = 14;
    var barHeights = [28, 18, 35, 22, 40, 14, 32, 25];
    var barBroken = [false, false, true, false, false, true, false, false];

    chartGfx.lineStyle(1, 0x00d4ff, 0.25);
    chartGfx.drawRect(cX - 6, cY - 45, barHeights.length * barGap + 10, 52);
    chartGfx.lineStyle(0);

    for (var cbi2 = 0; cbi2 < barHeights.length; cbi2++) {
        if (barBroken[cbi2]) {
            chartGfx.beginFill(0xff6b00, 0.40);
            chartGfx.drawRect(cX + cbi2 * barGap, cY - barHeights[cbi2], barW, barHeights[cbi2] * 0.5);
            chartGfx.endFill();
        } else {
            var cColor = (cbi2 % 3 === 0) ? 0xff8800 : 0x00d4ff;
            chartGfx.beginFill(cColor, 0.50);
            chartGfx.drawRect(cX + cbi2 * barGap, cY - barHeights[cbi2], barW, barHeights[cbi2]);
            chartGfx.endFill();
        }
    }
    glitchContainer.addChild(chartGfx);

    // LINE GRAPH / WAVEFORM (pink/red)
    var waveGfx = new PIXI.Graphics();
    waveGfx.lineStyle(1.5, 0xff3388, 0.45);
    var waveStartX = w * 0.72;
    var waveStartY = h * 0.66;
    waveGfx.moveTo(waveStartX, waveStartY);
    for (var wvi = 1; wvi <= 12; wvi++) {
        var wvX = waveStartX + wvi * 10;
        var wvY = waveStartY - 8 + Math.random() * 16;
        if (wvi === 5 || wvi === 9) {
            waveGfx.moveTo(wvX + 8, wvY);
        } else {
            waveGfx.lineTo(wvX, wvY);
        }
    }
    waveGfx.lineStyle(0);
    glitchContainer.addChild(waveGfx);

    // SMALL TEXT LABEL FRAGMENTS
    var labelTexts = [
        { str: 'ERR_0x4F2A', x: 0.08, y: 0.45, color: 0xff6b00, size: 10, alpha: 0.50 },
        { str: 'BUFFER OVERFLOW', x: 0.55, y: 0.12, color: 0xff0044, size: 9, alpha: 0.35 },
        { str: 'SYS_HALT', x: 0.82, y: 0.48, color: 0x00ff88, size: 11, alpha: 0.45 },
        { str: 'DATA LOSS: 94%', x: 0.30, y: 0.72, color: 0xff6b00, size: 10, alpha: 0.40 },
        { str: '/// CRITICAL ///', x: 0.62, y: 0.78, color: 0xff0044, size: 9, alpha: 0.30 },
        { str: 'SECTOR 7-G BREACH', x: 0.12, y: 0.88, color: 0x00d4ff, size: 10, alpha: 0.35 },
        { str: '0xDEAD 0xBEEF', x: 0.75, y: 0.35, color: 0x00ff88, size: 8, alpha: 0.30 },
        { str: 'CHECKSUM FAIL', x: 0.40, y: 0.15, color: 0xffff00, size: 9, alpha: 0.40 }
    ];

    for (var lti = 0; lti < labelTexts.length; lti++) {
        var lt = labelTexts[lti];
        var labelText = new PIXI.Text(lt.str, {
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: lt.size,
            fill: lt.color,
            fontWeight: 'bold',
            letterSpacing: 1
        });
        labelText.x = w * lt.x;
        labelText.y = h * lt.y;
        labelText.alpha = lt.alpha;
        glitchContainer.addChild(labelText);
    }

    // PROGRESS BAR fragment (lower-left)
    var progGfx = new PIXI.Graphics();
    var pX = w * 0.05;
    var pY = h * 0.75;
    var pW = w * 0.20;
    var pH = 6;

    progGfx.lineStyle(1, 0x00d4ff, 0.20);
    progGfx.drawRect(pX, pY, pW, pH);
    progGfx.lineStyle(0);

    progGfx.beginFill(0x00d4ff, 0.35);
    progGfx.drawRect(pX + 1, pY + 1, pW * 0.6, pH - 2);
    progGfx.endFill();

    progGfx.beginFill(0x00eeff, 0.60);
    progGfx.drawRect(pX + pW * 0.58, pY, 4, pH);
    progGfx.endFill();

    glitchContainer.addChild(progGfx);

    // MEDIA CONTROL ARROWS (lower-center)
    var arrowGfx = new PIXI.Graphics();
    var arX = w * 0.48;
    var arY = h * 0.85;

    arrowGfx.beginFill(0xcccccc, 0.30);
    arrowGfx.moveTo(arX, arY);
    arrowGfx.lineTo(arX - 8, arY + 6);
    arrowGfx.lineTo(arX, arY + 12);
    arrowGfx.closePath();
    arrowGfx.endFill();

    arrowGfx.beginFill(0xcccccc, 0.35);
    arrowGfx.moveTo(arX + 15, arY);
    arrowGfx.lineTo(arX + 23, arY + 6);
    arrowGfx.lineTo(arX + 15, arY + 12);
    arrowGfx.closePath();
    arrowGfx.endFill();

    arrowGfx.beginFill(0xffffff, 0.25);
    arrowGfx.drawCircle(arX + 8, arY + 6, 2);
    arrowGfx.endFill();

    glitchContainer.addChild(arrowGfx);
  }

  _addGlitchBurstColorDepth(glitchContainer, w, h) {
    // =============================================================
    // COLOR DEPTH LAYER — addresses saturation uniformity problem
    // Current: all blocks at 70-90% saturation (uniform neon)
    // Target: full range from 10% (olive) to 100% (magenta)
    // Strategy: add desaturated blocks + MULTIPLY overlay + dark tints
    // All drawn ONCE, static. Per ChatGPT PixiJS report guidance.
    // =============================================================

    // =============================================
    // LAYER 1: MULTIPLY BLEND OVERLAY
    // A separate Graphics with MULTIPLY blend mode
    // Per PixiJS v7 docs: "use a separate Graphics object"
    // for blend modes, since they apply per-primitive.
    // Semi-transparent colored patches DARKEN existing neon
    // blocks underneath, creating desaturation effect.
    // =============================================
    var desatOverlay = new PIXI.Graphics();
    desatOverlay.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    // 30 large patches that tone down neon areas
    for (var doi = 0; doi < 30; doi++) {
        var doX = Math.random() * w;
        var doY = Math.random() * h;
        var doW = 40 + Math.random() * 120;
        var doH = 8 + Math.random() * 30;

        // Desaturation tint colors — muted warm/cool grays
        var desatColors = [
            0x998888, 0x889988, 0x888899,
            0x887766, 0x667788, 0x776688,
            0xaa9988, 0x8899aa, 0x99aa88,
            0x776655, 0x557766, 0x665577
        ];
        var doColor = desatColors[Math.floor(Math.random() * desatColors.length)];
        desatOverlay.beginFill(doColor, 0.30 + Math.random() * 0.40);
        desatOverlay.drawRect(doX, doY, doW, doH);
        desatOverlay.endFill();
    }

    glitchContainer.addChild(desatOverlay);

    // =============================================
    // LAYER 2: DESATURATED / MUDDY BLOCKS (120 blocks)
    // The exact hex values from the analysis.
    // These are the "connective tissue" — 25-30% of
    // the composition should be these mid-tones.
    // Three tiers: low-sat, mid-sat, near-gray
    // =============================================
    var colorDepthGfx = new PIXI.Graphics();

    // TIER 1: Olive / Sage / Muddy green (replace excess neon green)
    var oliveColors = [0x556633, 0x667744, 0x445522, 0x778844, 0x669944, 0x557733, 0x3a4a22, 0x4a5a33];

    // TIER 2: Dusty rose / Mauve / Soft warm
    var roseColors = [0x995566, 0x886655, 0xaa7777, 0x775577, 0x886688, 0x664466, 0x9a8070, 0xaa8888];

    // TIER 3: Burnt sienna / Brown / Warm earth
    var earthColors = [0x884422, 0x775533, 0x996644, 0x663322, 0x774433, 0x885533, 0x6a4422, 0x8a6644];

    // TIER 4: Slate blue / Steel / Cool desaturated
    var slateColors = [0x445566, 0x556677, 0x334455, 0x667788, 0x4a5a6a, 0x5a6a7a, 0x3a4a5a, 0x6a7a8a];

    // TIER 5: Warm gray / Cool gray
    var grayColors = [0x554444, 0x665555, 0x443333, 0x444455, 0x555566, 0x333344, 0x504040, 0x405050];

    // TIER 6: Muted teal / Dark teal
    var tealColors = [0x336666, 0x558888, 0x224433, 0x335544, 0x223344, 0x446666, 0x2a4a4a, 0x4a6a6a];

    var allMuddy = oliveColors.concat(roseColors, earthColors, slateColors, grayColors, tealColors);

    for (var mci = 0; mci < 120; mci++) {
        var mcX = Math.random() * w;
        var mcY = Math.random() * h;
        var mcColor = allMuddy[Math.floor(Math.random() * allMuddy.length)];

        // Vary block sizes dramatically
        var sizeRoll = Math.random();
        var mcW, mcH;
        if (sizeRoll < 0.3) {
            // Small 3-8px
            mcW = 3 + Math.random() * 5;
            mcH = 3 + Math.random() * 5;
        } else if (sizeRoll < 0.7) {
            // Medium 10-25px
            mcW = 10 + Math.random() * 15;
            mcH = 4 + Math.random() * 12;
        } else {
            // Large 25-50px
            mcW = 25 + Math.random() * 25;
            mcH = 5 + Math.random() * 18;
        }

        var mcAlpha = 0.30 + Math.random() * 0.55;
        colorDepthGfx.beginFill(mcColor, mcAlpha);
        colorDepthGfx.drawRect(mcX, mcY, mcW, mcH);
        colorDepthGfx.endFill();
    }

    // =============================================
    // LAYER 3: DARK-BUT-COLORED BLOCKS (40 blocks)
    // Very dark versions of each hue — NOT black.
    // Tint the "void" zones with warm/cool/green/red/purple.
    // These are FELT more than seen — 5-15% brightness.
    // =============================================
    var darkColoredBlocks = [
        0x1a0808, 0x220a0a, 0x180808,  // Dark warm red
        0x08081a, 0x0a0a22, 0x081018,  // Dark cool blue
        0x081808, 0x0a220a, 0x0a1a0a,  // Dark green
        0x180808, 0x220808, 0x1a0a0a,  // Dark red
        0x100818, 0x180a22, 0x120a1a,  // Dark purple
        0x181808, 0x1a1a08, 0x141408,  // Dark yellow/olive
        0x081818, 0x0a1a1a, 0x081414   // Dark teal
    ];

    for (var dci = 0; dci < 40; dci++) {
        var dcX = Math.random() * w;
        var dcY = Math.random() * h;
        var dcW = 15 + Math.random() * 80;
        var dcH = 8 + Math.random() * 30;
        var dcColor = darkColoredBlocks[Math.floor(Math.random() * darkColoredBlocks.length)];
        colorDepthGfx.beginFill(dcColor, 0.50 + Math.random() * 0.45);
        colorDepthGfx.drawRect(dcX, dcY, dcW, dcH);
        colorDepthGfx.endFill();
    }

    // =============================================
    // LAYER 4: DARK MAROON / DEEP RED BLOCKS (35 blocks)
    // Expand the red range DOWNWARD into dark territory
    // The reference has dark maroon that creates a 2-tier
    // red system: dark background + bright foreground
    // =============================================
    var maroonColors = [
        0x440011, 0x550016, 0x660022,
        0x330011, 0x440016, 0x550022,
        0x770033, 0x880044, 0x660033,
        0x2a0011, 0x3a0016, 0x4a0022
    ];

    for (var mri = 0; mri < 35; mri++) {
        var mrX = Math.random() * w;
        var mrY = Math.random() * h;
        var mrW = 8 + Math.random() * 35;
        var mrH = 4 + Math.random() * 15;
        var mrColor = maroonColors[Math.floor(Math.random() * maroonColors.length)];
        colorDepthGfx.beginFill(mrColor, 0.40 + Math.random() * 0.50);
        colorDepthGfx.drawRect(mrX, mrY, mrW, mrH);
        colorDepthGfx.endFill();
    }

    // =============================================
    // LAYER 5: WHITE / NEAR-WHITE ACCENTS (25 blocks)
    // Scattered sparkle throughout the composition
    // Mix of cool white (#DDEEFF) and warm white (#FFEEDD)
    // Creates dynamic range contrast against mid-tones
    // =============================================
    var whiteVariants = [
        0xffffff, 0xffeedd, 0xddeeff, 0xffddcc, 0xccddff,
        0xeeeedd, 0xddeeee, 0xfff0e0, 0xe0f0ff, 0xf0f0f0
    ];

    for (var whi = 0; whi < 25; whi++) {
        var whX = Math.random() * w;
        var whY = Math.random() * h;
        var whColor = whiteVariants[Math.floor(Math.random() * whiteVariants.length)];

        if (Math.random() < 0.4) {
            // Tiny hot pixel 1-3px
            colorDepthGfx.beginFill(whColor, 0.30 + Math.random() * 0.50);
            colorDepthGfx.drawRect(whX, whY, 1 + Math.random() * 2, 1 + Math.random() * 2);
            colorDepthGfx.endFill();
        } else {
            // Small bright block 5-15px
            var whW = 5 + Math.random() * 10;
            var whH = 2 + Math.random() * 5;
            colorDepthGfx.beginFill(whColor, 0.20 + Math.random() * 0.40);
            colorDepthGfx.drawRect(whX, whY, whW, whH);
            colorDepthGfx.endFill();
        }
    }

    // =============================================
    // LAYER 6: ELECTRIC BLUE BLOCKS (12 blocks)
    // Standalone blue presence — distinct from teal/cyan
    // Analysis: "Image 1 underuses standalone blue"
    // =============================================
    var blueColors = [0x2244ff, 0x3355ee, 0x2233dd, 0x4466ff, 0x1133cc, 0x3344ee];

    for (var bli = 0; bli < 12; bli++) {
        var blX = Math.random() * w;
        var blY = Math.random() * h;
        var blW = 6 + Math.random() * 20;
        var blH = 3 + Math.random() * 10;
        var blColor = blueColors[Math.floor(Math.random() * blueColors.length)];
        colorDepthGfx.beginFill(blColor, 0.30 + Math.random() * 0.45);
        colorDepthGfx.drawRect(blX, blY, blW, blH);
        colorDepthGfx.endFill();
    }

    // =============================================
    // LAYER 7: NAVY-TINTED DARK ZONE WASHES
    // Full-width very low alpha navy/warm overlays
    // These tint entire horizontal zones so NO dark band
    // is perfectly neutral black
    // =============================================

    // Warm dark washes
    for (var wdi = 0; wdi < 6; wdi++) {
        var wdY = Math.random() * h;
        var wdH = 20 + Math.random() * 50;
        colorDepthGfx.beginFill(0x110808, 0.08 + Math.random() * 0.10);
        colorDepthGfx.drawRect(0, wdY, w, wdH);
        colorDepthGfx.endFill();
    }

    // Cool dark washes
    for (var cdi = 0; cdi < 6; cdi++) {
        var cdY = Math.random() * h;
        var cdH = 20 + Math.random() * 50;
        colorDepthGfx.beginFill(0x080811, 0.08 + Math.random() * 0.10);
        colorDepthGfx.drawRect(0, cdY, w, cdH);
        colorDepthGfx.endFill();
    }

    // Navy-tinted washes
    for (var ndi = 0; ndi < 4; ndi++) {
        var ndY = Math.random() * h;
        var ndH = 25 + Math.random() * 40;
        colorDepthGfx.beginFill(0x0a1530, 0.10 + Math.random() * 0.12);
        colorDepthGfx.drawRect(0, ndY, w, ndH);
        colorDepthGfx.endFill();
    }

    glitchContainer.addChild(colorDepthGfx);

    // =============================================
    // LAYER 8: SECONDARY RING DISPLAY (lower-left)
    // The reference has a second ring in red/maroon tones
    // Smaller than the primary, partially visible
    // =============================================
    var ring2Gfx = new PIXI.Graphics();
    var r2CX = w * 0.12;
    var r2CY = h * 0.78;
    var r2R = Math.min(w, h) * 0.06;

    // Main ring — dark red/maroon
    ring2Gfx.lineStyle(2, 0x881122, 0.35);
    ring2Gfx.arc(r2CX, r2CY, r2R, 0.3, Math.PI * 1.6);

    // Inner ring
    ring2Gfx.moveTo(r2CX + r2R * 0.6, r2CY);
    ring2Gfx.lineStyle(1.5, 0x661122, 0.25);
    ring2Gfx.arc(r2CX, r2CY, r2R * 0.6, 0, Math.PI * 1.3);

    // Center dot
    ring2Gfx.lineStyle(0);
    ring2Gfx.beginFill(0xcc2233, 0.40);
    ring2Gfx.drawCircle(r2CX, r2CY, 2.5);
    ring2Gfx.endFill();

    // Faint glow behind
    ring2Gfx.beginFill(0x220808, 0.20);
    ring2Gfx.drawCircle(r2CX, r2CY, r2R * 1.3);
    ring2Gfx.endFill();

    glitchContainer.addChild(ring2Gfx);
  }

  /**
   * Stub - Progress Bar Surge transition (not yet implemented)
   */
  _buildProgressBarSurge(timeline) {
    this._buildPlaceholder('progress_bar_surge', timeline);
  }

  /**
   * Ripple Wave transition - Concentric elliptical energy rings expanding from center
   * Creates holographic shockwave effect with 3D perspective
   */
  _buildRippleWave(timeline) {
    // === DOM CONTAINER ===
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:2;';
    this.content.appendChild(container);

    const label = document.createElement('div');
    label.className = 'im-transition-fui-label';
    label.style.cssText = 'bottom:30px;left:50%;transform:translateX(-50%);top:auto;';
    label.textContent = '◇ RIPPLE WAVE ◇';
    container.appendChild(label);

    // === PIXIJS EFFECTS ===
    const app = window.pixiEffectManager.getApp();
    const stage = window.pixiEffectManager.getStage();

    if (app && stage) {
      const w = app.screen.width;
      const h = app.screen.height;
      const cx = w / 2;
      const cy = h / 2;

      // Main container for all ripple effects
      const rippleContainer = new PIXI.Container();
      stage.addChild(rippleContainer);

      // =========================================================
      // LAYER 1: HEXAGONAL BACKGROUND (static, drawn once)
      // Faint dark blue hex grid covering entire screen.
      // Per claude_PixiJS_markdown_file.md line 184
      // =========================================================
      const hexBg = new PIXI.Graphics();
      const hexRadius = 30;
      const hexSpacingX = hexRadius * 1.75;
      const hexSpacingY = hexRadius * 1.5;

      for (let hexRow = -1; hexRow < (h / hexSpacingY) + 1; hexRow++) {
        for (let hexCol = -1; hexCol < (w / hexSpacingX) + 1; hexCol++) {
          const hcx = hexCol * hexSpacingX + (hexRow % 2 === 0 ? 0 : hexSpacingX * 0.5);
          const hcy = hexRow * hexSpacingY;

          hexBg.lineStyle(1, 0x0a2a4a, 0.25);
          hexBg.moveTo(hcx + hexRadius * Math.cos(0), hcy + hexRadius * Math.sin(0));
          for (let hvi = 1; hvi <= 6; hvi++) {
            hexBg.lineTo(
              hcx + hexRadius * Math.cos(Math.PI / 3 * hvi),
              hcy + hexRadius * Math.sin(Math.PI / 3 * hvi)
            );
          }
        }
      }
      hexBg.alpha = 0;
      rippleContainer.addChild(hexBg);

      // =========================================================
      // LAYER 2: UI PANEL REMNANTS (static, drawn once)
      // Wireframe globe upper-left, chart bars in corners
      // =========================================================
      const uiGfx = new PIXI.Graphics();

      // Wireframe globe — upper-left
      const globeCX = w * 0.12;
      const globeCY = h * 0.22;
      const globeR = Math.min(w, h) * 0.08;
      uiGfx.lineStyle(1, 0x0a4a6a, 0.30);
      uiGfx.drawCircle(globeCX, globeCY, globeR);
      // Latitude lines
      for (let lat = -2; lat <= 2; lat++) {
        const latY = globeCY + (lat / 3) * globeR;
        const latRX = Math.sqrt(Math.max(0, globeR * globeR - (latY - globeCY) * (latY - globeCY)));
        if (latRX > 5) {
          uiGfx.lineStyle(0.5, 0x0a4a6a, 0.20);
          uiGfx.drawEllipse(globeCX, latY, latRX, latRX * 0.15);
        }
      }
      // Longitude arcs
      uiGfx.lineStyle(0.5, 0x0a4a6a, 0.20);
      uiGfx.drawEllipse(globeCX, globeCY, globeR * 0.3, globeR);
      uiGfx.drawEllipse(globeCX, globeCY, globeR * 0.6, globeR);
      uiGfx.drawEllipse(globeCX, globeCY, globeR, globeR);

      // Chart bars — lower-right
      const chartX = w * 0.82;
      const chartY = h * 0.75;
      for (let bi = 0; bi < 6; bi++) {
        const barH = 10 + Math.random() * 40;
        uiGfx.beginFill(0x0a4a6a, 0.25);
        uiGfx.drawRect(chartX + bi * 12, chartY - barH, 8, barH);
        uiGfx.endFill();
      }

      // Data panel outlines — upper-right, lower-left
      uiGfx.lineStyle(1, 0x0a4a6a, 0.15);
      uiGfx.drawRect(w * 0.78, h * 0.08, w * 0.18, h * 0.12);
      uiGfx.drawRect(w * 0.04, h * 0.75, w * 0.15, h * 0.10);

      uiGfx.alpha = 0.6;
      rippleContainer.addChild(uiGfx);

      // =========================================================
      // LAYER 3: LIGHT RAYS (static, additive blend)
      // 16 thin lines radiating from center through the rings
      // =========================================================
      const rayContainer = new PIXI.Container();
      rayContainer.blendMode = PIXI.BLEND_MODES.ADD;
      const rayGfx = new PIXI.Graphics();

      const maxRayLen = Math.max(w, h) * 0.8;

      for (let ri = 0; ri < 16; ri++) {
        const angle = (ri / 16) * Math.PI * 2 + (Math.random() * 0.1 - 0.05);
        const rayLen = maxRayLen * (0.5 + Math.random() * 0.5);
        const rayAlpha = 0.05 + Math.random() * 0.10;

        rayGfx.lineStyle(1 + Math.random(), 0x00d4ff, rayAlpha);
        rayGfx.moveTo(cx, cy);
        rayGfx.lineTo(
          cx + Math.cos(angle) * rayLen,
          cy + Math.sin(angle) * rayLen
        );
      }

      rayContainer.addChild(rayGfx);
      rayContainer.alpha = 0;
      rippleContainer.addChild(rayContainer);

      // =========================================================
      // LAYER 4: CENTER FLASH (animated)
      // Bright white circle at the origin that flashes and fades
      // =========================================================
      const flashGfx = new PIXI.Graphics();
      flashGfx.beginFill(0xffffff, 1.0);
      flashGfx.drawCircle(0, 0, 8);
      flashGfx.endFill();
      // Softer glow ring around center
      flashGfx.beginFill(0x00d4ff, 0.4);
      flashGfx.drawCircle(0, 0, 25);
      flashGfx.endFill();
      flashGfx.x = cx;
      flashGfx.y = cy;
      flashGfx.alpha = 0;
      rippleContainer.addChild(flashGfx);

      // =========================================================
      // LAYER 5: CONCENTRIC ELLIPTICAL RINGS (5 rings, animated)
      // CRITICAL: ELLIPSES not circles — 2.5:1 width:height ratio
      // for 3D holographic perspective
      // =========================================================
      const ringContainer = new PIXI.Container();
      const rings = [];
      const numRings = 5;

      // Ellipse base dimensions — rings will scale from 0 to 1
      const baseRX = w * 0.45;  // half-width of largest ring
      const baseRY = h * 0.20;  // half-height — creates the 2.5:1 ratio

      for (let rni = 0; rni < numRings; rni++) {
        const ringGfx = new PIXI.Graphics();

        // Main ring stroke — thick cyan
        ringGfx.lineStyle(3 + Math.random() * 2, 0x00d4ff, 0.85);
        ringGfx.drawEllipse(0, 0, baseRX, baseRY);

        // Inner detail line 1 — thinner, slightly smaller
        ringGfx.lineStyle(1, 0x00d4ff, 0.35);
        ringGfx.drawEllipse(0, 0, baseRX * 0.92, baseRY * 0.92);

        // Inner detail line 2 — even thinner, slightly larger
        ringGfx.lineStyle(0.5, 0x44eeff, 0.20);
        ringGfx.drawEllipse(0, 0, baseRX * 1.05, baseRY * 1.05);

        // Sparkle dots along the ring circumference — 12 per ring
        for (let sdi = 0; sdi < 12; sdi++) {
          const sparkAngle = (sdi / 12) * Math.PI * 2;
          const spX = baseRX * Math.cos(sparkAngle);
          const spY = baseRY * Math.sin(sparkAngle);
          ringGfx.lineStyle(0);
          ringGfx.beginFill(0xffffff, 0.4 + Math.random() * 0.4);
          ringGfx.drawCircle(spX, spY, 1 + Math.random() * 2);
          ringGfx.endFill();
        }

        ringGfx.x = cx;
        ringGfx.y = cy;
        ringGfx.scale.set(0);
        ringGfx.alpha = 1;

        ringContainer.addChild(ringGfx);
        rings.push(ringGfx);
      }

      rippleContainer.addChild(ringContainer);

      // =========================================================
      // LAYER 6: RING GLOW DUPLICATES (additive blend)
      // Thicker, lower-alpha copies for bloom effect
      // =========================================================
      const glowContainer = new PIXI.Container();
      glowContainer.blendMode = PIXI.BLEND_MODES.ADD;
      const glowRings = [];

      for (let gri = 0; gri < numRings; gri++) {
        const glowGfx = new PIXI.Graphics();
        glowGfx.lineStyle(8, 0x00d4ff, 0.20);
        glowGfx.drawEllipse(0, 0, baseRX, baseRY);
        glowGfx.lineStyle(15, 0x005577, 0.08);
        glowGfx.drawEllipse(0, 0, baseRX, baseRY);
        glowGfx.x = cx;
        glowGfx.y = cy;
        glowGfx.scale.set(0);
        glowGfx.alpha = 1;
        glowContainer.addChild(glowGfx);
        glowRings.push(glowGfx);
      }

      rippleContainer.addChild(glowContainer);

      // =========================================================
      // LAYER 7: GlowFilter on ring container
      // =========================================================
      let glowFilter = null;
      try {
        glowFilter = new PIXI.filters.GlowFilter({
          distance: 15,
          outerStrength: 2.0,
          innerStrength: 0.5,
          color: 0x00d4ff,
          quality: 0.3
        });
        ringContainer.filters = [glowFilter];
      } catch(e) {
        console.warn('[RippleWave] GlowFilter not available:', e);
      }

      // Add refinement layer (blazing core, god-rays, particles, panels, haze)
      this._addRippleWaveRefinement(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline);

      // Add intensify layer (hex grid, ring thickness, Fresnel, brackets, more particles)
      this._addRippleWaveIntensify(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline);

      // Add polish layer (thick 18px bands, enhanced Fresnel, searing core, more particles)
      this._addRippleWavePolish(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline);

      // Add showtime layer (bloom filter, ADD-blend wide bands, bold Fresnel, sparkle bursts)
      this._addRippleWaveShowtime(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline);

      // =========================================================
      // GSAP ANIMATION TIMELINE
      // All animations added to the passed timeline parameter
      // =========================================================

      // Hex background fade in then out
      timeline.fromTo(hexBg, { alpha: 0 }, { alpha: 0.5, duration: 0.4, ease: 'power1.out' }, 0);
      timeline.to(hexBg, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

      // Center flash: appear, scale up, fade
      timeline.to(flashGfx, { alpha: 1, duration: 0.05, ease: 'power2.out' }, 0);
      timeline.to(flashGfx.scale, { x: 3, y: 3, duration: 0.5, ease: 'power2.out' }, 0);
      timeline.to(flashGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 0.15);

      // Light rays: fade in then out
      timeline.to(rayContainer, { alpha: 0.7, duration: 0.3, ease: 'power1.out' }, 0);
      timeline.to(rayContainer, { alpha: 0, duration: 0.6, ease: 'power1.in' }, 1.4);

      // Rings: staggered expansion — each ring starts 0.15s after the previous
      for (let ani = 0; ani < numRings; ani++) {
        const ringDelay = 0.1 + ani * 0.15;

        // Ring scale: 0 → 1.0
        timeline.to(rings[ani].scale, {
          x: 1.0, y: 1.0,
          duration: 1.5,
          ease: 'power2.out'
        }, ringDelay);

        // Ring alpha: 1 → 0
        timeline.to(rings[ani], {
          alpha: 0,
          duration: 1.3,
          ease: 'power1.in'
        }, ringDelay + 0.2);

        // Glow ring matches
        timeline.to(glowRings[ani].scale, {
          x: 1.0, y: 1.0,
          duration: 1.5,
          ease: 'power2.out'
        }, ringDelay);

        timeline.to(glowRings[ani], {
          alpha: 0,
          duration: 1.3,
          ease: 'power1.in'
        }, ringDelay + 0.2);
      }

      // UI elements fade out at end
      timeline.to(uiGfx, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);

      // Container cleanup fade
      timeline.to(rippleContainer, { alpha: 0, duration: 0.3, ease: 'power2.in' }, 1.7);
    }
  }

  /**
   * Ripple Wave refinement layer - adds visual density to transform
   * from geometric diagram into holographic command center phenomenon
   */
  _addRippleWaveRefinement(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline) {
    // =============================================================
    // 8 LAYERS TO CLOSE THE VISUAL GAP
    // All Graphics drawn ONCE (per ChatGPT PixiJS report guidance)
    // =============================================================

    // =============================================
    // LAYER 1: BLAZING CORE (highest impact change)
    // Multi-zone energy source with additive blend
    // Elliptical to match the ring perspective
    // =============================================
    const coreContainer = new PIXI.Container();
    coreContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const coreGfx = new PIXI.Graphics();

    // Core zone 4 (outermost, drawn first): soft dark glow
    coreGfx.beginFill(0x005577, 0.12);
    coreGfx.drawEllipse(cx, cy, 220, 220 * 0.4);
    coreGfx.endFill();

    // Core zone 3: medium cyan
    coreGfx.beginFill(0x00d4ff, 0.25);
    coreGfx.drawEllipse(cx, cy, 140, 140 * 0.4);
    coreGfx.endFill();

    // Core zone 2: bright cyan
    coreGfx.beginFill(0x88eeff, 0.5);
    coreGfx.drawEllipse(cx, cy, 80, 80 * 0.4);
    coreGfx.endFill();

    // Core zone 1 (innermost): blazing white
    coreGfx.beginFill(0xffffff, 0.9);
    coreGfx.drawEllipse(cx, cy, 40, 40 * 0.4);
    coreGfx.endFill();

    coreContainer.addChild(coreGfx);
    coreContainer.alpha = 0;
    rippleContainer.addChild(coreContainer);

    // =============================================
    // LAYER 2: GOD-RAYS (radial lines from core)
    // 12 main rays + 16 short spear rays near core
    // =============================================
    const godRayContainer = new PIXI.Container();
    godRayContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const godRayGfx = new PIXI.Graphics();

    const maxRayLen = Math.max(w, h) * 0.7;

    // 12 main god-rays
    for (let ri = 0; ri < 12; ri++) {
      const rayAngle = (ri / 12) * Math.PI * 2 + (Math.random() * 0.08 - 0.04);
      const rayLen = maxRayLen * (0.5 + Math.random() * 0.5);

      // Primary rays (up, down, left, right) are brighter
      const isPrimary = (ri % 3 === 0);
      const rayAlpha = isPrimary ? 0.35 : (0.15 + Math.random() * 0.15);
      const rayWidth = isPrimary ? 4 : (2 + Math.random() * 2);

      godRayGfx.lineStyle(rayWidth, 0x00d4ff, rayAlpha);
      godRayGfx.moveTo(cx, cy);
      godRayGfx.lineTo(
        cx + Math.cos(rayAngle) * rayLen,
        cy + Math.sin(rayAngle) * rayLen
      );
    }

    // 16 short spear rays near core (star-burst pattern)
    for (let si = 0; si < 16; si++) {
      const spearAngle = (si / 16) * Math.PI * 2 + (Math.random() * 0.1 - 0.05);
      const spearLen = 30 + Math.random() * 50;
      godRayGfx.lineStyle(1.5, 0xffffff, 0.4);
      godRayGfx.moveTo(cx, cy);
      godRayGfx.lineTo(
        cx + Math.cos(spearAngle) * spearLen,
        cy + Math.sin(spearAngle) * spearLen
      );
    }

    godRayContainer.addChild(godRayGfx);
    godRayContainer.alpha = 0;
    rippleContainer.addChild(godRayContainer);

    // =============================================
    // LAYER 3: RING PARTICLE TEXTURE
    // 5 sets of particle dots that expand with rings
    // Creates luminous matter effect on ring paths
    // =============================================
    const ringParticleContainers = [];

    for (let rpi = 0; rpi < 5; rpi++) {
      const particleGfx = new PIXI.Graphics();

      // 70 particles per ring path
      for (let pi = 0; pi < 70; pi++) {
        const particleAngle = (pi / 70) * Math.PI * 2 + (Math.random() * 0.06 - 0.03);
        const px = baseRX * Math.cos(particleAngle);
        const py = baseRY * Math.sin(particleAngle);

        // Vary particle size and brightness
        const pSize = Math.random() < 0.15 ? (3 + Math.random() * 2) : (1 + Math.random() * 2);
        const pAlpha = Math.random() < 0.15 ? (0.5 + Math.random() * 0.3) : (0.2 + Math.random() * 0.4);
        const pColor = Math.random() < 0.3 ? 0xffffff : 0x88eeff;

        particleGfx.beginFill(pColor, pAlpha);
        particleGfx.drawCircle(px, py, pSize);
        particleGfx.endFill();
      }

      particleGfx.x = cx;
      particleGfx.y = cy;
      particleGfx.scale.set(0);
      particleGfx.alpha = 0.8;

      rippleContainer.addChild(particleGfx);
      ringParticleContainers.push(particleGfx);
    }

    // =============================================
    // LAYER 4: FLOATING DISPLAY PANELS
    // Left panel with globe, right panel with vessel
    // =============================================
    const panelContainer = new PIXI.Container();

    // === LEFT PANEL ===
    const leftPanel = new PIXI.Graphics();
    const lpX = w * 0.03;
    const lpY = h * 0.10;
    const lpW = w * 0.18;
    const lpH = h * 0.38;

    // Panel background
    leftPanel.beginFill(0x041520, 0.50);
    leftPanel.drawRect(lpX, lpY, lpW, lpH);
    leftPanel.endFill();
    leftPanel.lineStyle(1, 0x0a6688, 0.60);
    leftPanel.drawRect(lpX, lpY, lpW, lpH);

    // Wireframe globe
    const globeCX = lpX + lpW * 0.5;
    const globeCY = lpY + lpH * 0.30;
    const globeR = Math.min(lpW, lpH) * 0.25;

    leftPanel.lineStyle(1, 0x00d4ff, 0.50);
    leftPanel.drawCircle(globeCX, globeCY, globeR);

    // Latitude lines (3 horizontal ellipses)
    for (let lat = -1; lat <= 1; lat++) {
      const latY = globeCY + lat * globeR * 0.5;
      const latRX = Math.sqrt(Math.max(1, globeR * globeR - (lat * globeR * 0.5) * (lat * globeR * 0.5)));
      leftPanel.lineStyle(0.5, 0x00aacc, 0.35);
      leftPanel.drawEllipse(globeCX, latY, latRX, latRX * 0.15);
    }

    // Longitude arcs (2 vertical ellipses)
    leftPanel.lineStyle(0.5, 0x00aacc, 0.35);
    leftPanel.drawEllipse(globeCX, globeCY, globeR * 0.4, globeR);
    leftPanel.drawEllipse(globeCX, globeCY, globeR * 0.7, globeR);

    // Grid lines on globe
    leftPanel.lineStyle(0.3, 0x006688, 0.25);
    for (let gi = 0; gi < 6; gi++) {
      const gridAngle = (gi / 6) * Math.PI;
      leftPanel.moveTo(globeCX - globeR * Math.cos(gridAngle), globeCY - globeR * Math.sin(gridAngle));
      leftPanel.lineTo(globeCX + globeR * Math.cos(gridAngle), globeCY + globeR * Math.sin(gridAngle));
    }

    // Bar chart below globe
    const chartBaseY = lpY + lpH * 0.65;
    for (let bi = 0; bi < 8; bi++) {
      const barH = 10 + Math.random() * 35;
      const barColor = Math.random() < 0.2 ? 0xff6644 : 0x00d4ff;
      leftPanel.beginFill(barColor, 0.45);
      leftPanel.drawRect(lpX + 15 + bi * 18, chartBaseY - barH, 12, barH);
      leftPanel.endFill();
    }

    // Waveform line
    leftPanel.lineStyle(1, 0x00aacc, 0.35);
    leftPanel.moveTo(lpX + 10, lpY + lpH * 0.80);
    for (let wi = 0; wi < 12; wi++) {
      const wx = lpX + 10 + wi * (lpW - 20) / 12;
      const wy = lpY + lpH * 0.80 + (Math.random() - 0.5) * 20;
      leftPanel.lineTo(wx, wy);
    }

    // Data readout lines at bottom
    for (let di = 0; di < 4; di++) {
      leftPanel.lineStyle(0.5, 0x00aacc, 0.25);
      leftPanel.moveTo(lpX + 10, lpY + lpH * 0.88 + di * 8);
      leftPanel.lineTo(lpX + 10 + Math.random() * 80, lpY + lpH * 0.88 + di * 8);
    }

    panelContainer.addChild(leftPanel);

    // === RIGHT PANEL ===
    const rightPanel = new PIXI.Graphics();
    const rpX = w * 0.80;
    const rpY = h * 0.08;
    const rpW = w * 0.17;
    const rpH = h * 0.32;

    // Panel background
    rightPanel.beginFill(0x041520, 0.50);
    rightPanel.drawRect(rpX, rpY, rpW, rpH);
    rightPanel.endFill();
    rightPanel.lineStyle(1, 0x0a6688, 0.60);
    rightPanel.drawRect(rpX, rpY, rpW, rpH);

    // Wireframe vessel/craft shape (lens shape)
    const vesselCX = rpX + rpW * 0.5;
    const vesselCY = rpY + rpH * 0.35;
    const vesselW = rpW * 0.7;
    const vesselH = rpH * 0.25;

    rightPanel.lineStyle(1, 0x00d4ff, 0.50);
    // Draw elongated lens using bezier curves
    rightPanel.moveTo(vesselCX - vesselW * 0.5, vesselCY);
    rightPanel.bezierCurveTo(
      vesselCX - vesselW * 0.3, vesselCY - vesselH,
      vesselCX + vesselW * 0.3, vesselCY - vesselH,
      vesselCX + vesselW * 0.5, vesselCY
    );
    rightPanel.bezierCurveTo(
      vesselCX + vesselW * 0.3, vesselCY + vesselH,
      vesselCX - vesselW * 0.3, vesselCY + vesselH,
      vesselCX - vesselW * 0.5, vesselCY
    );

    // Internal mesh lines on vessel
    rightPanel.lineStyle(0.5, 0x006688, 0.30);
    for (let mi = 0; mi < 5; mi++) {
      const mx = vesselCX - vesselW * 0.35 + mi * vesselW * 0.7 / 5;
      rightPanel.moveTo(mx, vesselCY - vesselH * 0.7);
      rightPanel.lineTo(mx, vesselCY + vesselH * 0.7);
    }

    // Circular gauge
    const gaugeX = rpX + rpW * 0.25;
    const gaugeY = rpY + rpH * 0.72;
    const gaugeR = 18;
    rightPanel.lineStyle(1, 0x00aacc, 0.40);
    rightPanel.drawCircle(gaugeX, gaugeY, gaugeR);
    rightPanel.arc(gaugeX, gaugeY, gaugeR * 0.7, -Math.PI * 0.7, Math.PI * 0.3);

    // Mini bar charts
    for (let mbi = 0; mbi < 4; mbi++) {
      const mbH = 8 + Math.random() * 20;
      rightPanel.beginFill(0x00d4ff, 0.35);
      rightPanel.drawRect(rpX + rpW * 0.55 + mbi * 14, rpY + rpH * 0.78 - mbH, 10, mbH);
      rightPanel.endFill();
    }

    panelContainer.addChild(rightPanel);

    // === BOTTOM-LEFT MINI PANEL ===
    const blPanel = new PIXI.Graphics();
    blPanel.beginFill(0x041520, 0.40);
    blPanel.drawRect(w * 0.04, h * 0.75, w * 0.12, h * 0.12);
    blPanel.endFill();
    blPanel.lineStyle(1, 0x0a6688, 0.40);
    blPanel.drawRect(w * 0.04, h * 0.75, w * 0.12, h * 0.12);

    // Bars and red accent
    for (let bbi = 0; bbi < 5; bbi++) {
      const bbH = 5 + Math.random() * 25;
      blPanel.beginFill(0x00d4ff, 0.30);
      blPanel.drawRect(w * 0.05 + bbi * 16, h * 0.84 - bbH, 10, bbH);
      blPanel.endFill();
    }
    blPanel.beginFill(0xff3344, 0.50);
    blPanel.drawCircle(w * 0.14, h * 0.78, 4);
    blPanel.endFill();

    panelContainer.addChild(blPanel);

    // === BOTTOM-RIGHT MINI PANEL ===
    const brPanel = new PIXI.Graphics();
    brPanel.beginFill(0x041520, 0.40);
    brPanel.drawRect(w * 0.84, h * 0.78, w * 0.12, h * 0.10);
    brPanel.endFill();
    brPanel.lineStyle(1, 0x0a6688, 0.40);
    brPanel.drawRect(w * 0.84, h * 0.78, w * 0.12, h * 0.10);

    // Circular gauge element
    brPanel.lineStyle(1, 0x00aacc, 0.35);
    brPanel.drawCircle(w * 0.90, h * 0.83, 15);
    brPanel.arc(w * 0.90, h * 0.83, 10, 0, Math.PI * 1.4);

    panelContainer.addChild(brPanel);

    panelContainer.alpha = 0;
    rippleContainer.addChild(panelContainer);

    // =============================================
    // LAYER 5: SCATTERED PARTICLES
    // 200 bright dots filling the void with energy
    // =============================================
    const scatterGfx = new PIXI.Graphics();

    for (let sci = 0; sci < 200; sci++) {
      // Density gradient: 60% in center, 40% outer
      let scX, scY;
      if (Math.random() < 0.6) {
        scX = cx + (Math.random() - 0.5) * w * 0.6;
        scY = cy + (Math.random() - 0.5) * h * 0.6;
      } else {
        scX = Math.random() * w;
        scY = Math.random() * h;
      }

      // Vary size and brightness
      const isBright = Math.random() < 0.08;
      const scSize = isBright ? (3 + Math.random() * 2) : (1 + Math.random() * 2);
      const scAlpha = isBright ? (0.5 + Math.random() * 0.3) : (0.08 + Math.random() * 0.25);

      // Color distribution: 70% white, 20% cyan, 10% blue
      const colorRoll = Math.random();
      const scColor = colorRoll < 0.7 ? 0xffffff : (colorRoll < 0.9 ? 0x00d4ff : 0x4488ff);

      scatterGfx.beginFill(scColor, scAlpha);
      scatterGfx.drawCircle(scX, scY, scSize);
      scatterGfx.endFill();
    }

    scatterGfx.alpha = 0;
    rippleContainer.addChild(scatterGfx);

    // =============================================
    // LAYER 6: ATMOSPHERIC HAZE
    // Volumetric central glow creating depth
    // =============================================
    const hazeContainer = new PIXI.Container();
    hazeContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const hazeGfx = new PIXI.Graphics();

    // Outer haze
    hazeGfx.beginFill(0x001122, 0.05);
    hazeGfx.drawEllipse(cx, cy, w * 0.55, h * 0.30);
    hazeGfx.endFill();

    // Middle haze
    hazeGfx.beginFill(0x002244, 0.08);
    hazeGfx.drawEllipse(cx, cy, w * 0.40, h * 0.22);
    hazeGfx.endFill();

    // Inner haze
    hazeGfx.beginFill(0x003355, 0.15);
    hazeGfx.drawEllipse(cx, cy, w * 0.25, h * 0.15);
    hazeGfx.endFill();

    hazeContainer.addChild(hazeGfx);
    hazeContainer.alpha = 0;
    rippleContainer.addChild(hazeContainer);

    // =============================================
    // LAYER 7: FLOOR REFLECTIONS
    // Faint mirrored copies of rings below center
    // =============================================
    const floorGfx = new PIXI.Graphics();
    const floorY = cy + baseRY * 0.7;

    // Reflection of 3 rings (indices 0, 2, 4)
    for (let fri = 0; fri < 3; fri++) {
      const reflectAlpha = 0.06 + fri * 0.02;
      const reflectRX = baseRX * (0.3 + fri * 0.3);
      const reflectRY = baseRY * 0.4 * (0.3 + fri * 0.3);

      floorGfx.lineStyle(2, 0x005577, reflectAlpha);
      floorGfx.drawEllipse(cx, floorY + fri * 15, reflectRX, reflectRY);
    }

    floorGfx.alpha = 0;
    rippleContainer.addChild(floorGfx);

    // =============================================
    // LAYER 8: INITIAL VERTICAL BEAM
    // Energy discharge that triggers the ripple
    // =============================================
    const beamContainer = new PIXI.Container();
    beamContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const beamGfx = new PIXI.Graphics();

    // Wide glow beam behind
    beamGfx.beginFill(0x00d4ff, 0.15);
    beamGfx.drawRect(cx - 10, cy - h * 0.35, 20, h * 0.7);
    beamGfx.endFill();

    // Narrow bright beam
    beamGfx.beginFill(0x00d4ff, 0.7);
    beamGfx.drawRect(cx - 2, cy - h * 0.35, 4, h * 0.7);
    beamGfx.endFill();

    // Hot white center line
    beamGfx.beginFill(0xffffff, 0.5);
    beamGfx.drawRect(cx - 1, cy - h * 0.35, 2, h * 0.7);
    beamGfx.endFill();

    beamContainer.addChild(beamGfx);
    beamContainer.alpha = 0;
    rippleContainer.addChild(beamContainer);

    // =============================================
    // GSAP ANIMATIONS FOR REFINEMENT LAYERS
    // =============================================

    // Layer 8: Vertical beam - flash first, then fade
    timeline.to(beamContainer, { alpha: 0.9, duration: 0.05, ease: 'power2.out' }, 0);
    timeline.to(beamContainer, { alpha: 0, duration: 0.35, ease: 'power1.in' }, 0.08);

    // Layer 1: Core glow appears after beam
    timeline.to(coreContainer, { alpha: 1, duration: 0.2, ease: 'power2.out' }, 0.05);
    timeline.to(coreContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 2: God-rays fade in
    timeline.to(godRayContainer, { alpha: 0.8, duration: 0.3, ease: 'power1.out' }, 0.05);
    timeline.to(godRayContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.4);

    // Layer 6: Atmospheric haze
    timeline.to(hazeContainer, { alpha: 0.7, duration: 0.4, ease: 'power1.out' }, 0.05);
    timeline.to(hazeContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 5: Scattered particles
    timeline.to(scatterGfx, { alpha: 0.9, duration: 0.5, ease: 'power1.out' }, 0.1);
    timeline.to(scatterGfx, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 3: Ring particles expand with same stagger as main rings
    for (let rpa = 0; rpa < 5; rpa++) {
      const particleDelay = 0.1 + rpa * 0.15;
      timeline.to(ringParticleContainers[rpa].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, particleDelay);
      timeline.to(ringParticleContainers[rpa], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, particleDelay + 0.2);
    }

    // Layer 4: Display panels
    timeline.to(panelContainer, { alpha: 0.85, duration: 0.4, ease: 'power1.out' }, 0.2);
    timeline.to(panelContainer, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.6);

    // Layer 7: Floor reflections
    timeline.to(floorGfx, { alpha: 0.5, duration: 0.5, ease: 'power1.out' }, 0.15);
    timeline.to(floorGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.5);
  }

  /**
   * Ripple Wave intensify layer - Round 3 enhancements
   * Adds 9 visual layers to increase intensity and FUI detail
   * Target: ~60-65% toward reference image
   */
  _addRippleWaveIntensify(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline) {
    // =============================================================
    // 9 LAYERS TO INTENSIFY VISUAL IMPACT
    // All Graphics drawn ONCE (per ChatGPT PixiJS report guidance)
    // NO new PixiJS filters — all glow via drawn ellipses + ADD blend
    // =============================================================

    // =============================================
    // LAYER 1: PROMINENT HEXAGONAL GRID
    // The Round 1 hex grid is buried under haze.
    // Draw new hex grid at HIGHER alpha, ON TOP of all Round 2 layers.
    // Proximity-based brightness simulates core illumination.
    // =============================================
    const hexGridIntense = new PIXI.Graphics();
    const hexRadius = 35;
    const hexSpacingX = hexRadius * 1.75;
    const hexSpacingY = hexRadius * 1.5;

    for (let hexRow = -1; hexRow < (h / hexSpacingY) + 1; hexRow++) {
      for (let hexCol = -1; hexCol < (w / hexSpacingX) + 1; hexCol++) {
        const hcx = hexCol * hexSpacingX + (hexRow % 2 === 0 ? 0 : hexSpacingX * 0.5);
        const hcy = hexRow * hexSpacingY;

        // Calculate distance from hex center to screen center for proximity dimming
        const distToCenter = Math.sqrt((hcx - cx) * (hcx - cx) + (hcy - cy) * (hcy - cy));
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        let hexAlpha = 0.45;
        if (distToCenter < w * 0.35) {
          hexAlpha = 0.55; // Brighter near center
        } else if (distToCenter > w * 0.55) {
          hexAlpha = 0.30; // Dimmer at edges
        }

        hexGridIntense.lineStyle(1.0, 0x0a4a8a, hexAlpha);
        hexGridIntense.moveTo(hcx + hexRadius * Math.cos(0), hcy + hexRadius * Math.sin(0));
        for (let hvi = 1; hvi <= 6; hvi++) {
          hexGridIntense.lineTo(
            hcx + hexRadius * Math.cos(Math.PI / 3 * hvi),
            hcy + hexRadius * Math.sin(Math.PI / 3 * hvi)
          );
        }
      }
    }
    hexGridIntense.alpha = 0;
    rippleContainer.addChild(hexGridIntense);

    // =============================================
    // LAYER 2: RING THICKNESS BANDS
    // Transform thin lines into luminous bands
    // Wide glow + medium band per ring
    // =============================================
    const thickBandContainer = new PIXI.Container();
    thickBandContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const thickBandGraphics = [];

    for (let tbi = 0; tbi < 5; tbi++) {
      const bandGfx = new PIXI.Graphics();

      // Wide glow band
      bandGfx.lineStyle(12, 0x005577, 0.12);
      bandGfx.drawEllipse(0, 0, baseRX, baseRY);

      // Medium band
      bandGfx.lineStyle(6, 0x00aacc, 0.20);
      bandGfx.drawEllipse(0, 0, baseRX, baseRY);

      bandGfx.x = cx;
      bandGfx.y = cy;
      bandGfx.scale.set(0);
      bandGfx.alpha = 1;

      thickBandContainer.addChild(bandGfx);
      thickBandGraphics.push(bandGfx);
    }
    rippleContainer.addChild(thickBandContainer);

    // =============================================
    // LAYER 3: NEAR-SIDE RING BRIGHTNESS (Fresnel effect)
    // Partial elliptical arc covering only bottom 180°
    // Creates depth cue - near side brighter than far side
    // =============================================
    const fresnelContainer = new PIXI.Container();
    fresnelContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const fresnelGraphics = [];

    for (let fri = 0; fri < 5; fri++) {
      const fresnelGfx = new PIXI.Graphics();

      // Draw ~30 dots along bottom arc (0.1*PI to 0.9*PI)
      for (let fdi = 0; fdi < 30; fdi++) {
        const angle = Math.PI * (0.1 + (fdi / 30) * 0.8);
        const fx = baseRX * Math.cos(angle);
        const fy = baseRY * Math.sin(angle);

        const dotSize = 2 + Math.random() * 1.5;
        const dotAlpha = 0.30 + Math.random() * 0.15;
        fresnelGfx.beginFill(0x44eeff, dotAlpha);
        fresnelGfx.drawCircle(fx, fy, dotSize);
        fresnelGfx.endFill();
      }

      fresnelGfx.x = cx;
      fresnelGfx.y = cy;
      fresnelGfx.scale.set(0);
      fresnelGfx.alpha = 1;

      fresnelContainer.addChild(fresnelGfx);
      fresnelGraphics.push(fresnelGfx);
    }
    rippleContainer.addChild(fresnelContainer);

    // =============================================
    // LAYER 4: FUI CORNER BRACKETS ON PANELS
    // L-shaped bright brackets at each corner
    // Classic Iron Man HUD element
    // =============================================
    const bracketGfx = new PIXI.Graphics();
    const bracketArm = 10;
    const bracketLineWidth = 1.5;
    const bracketColor = 0x00d4ff;
    const bracketAlpha = 0.65;

    // Panel positions from _addRippleWaveRefinement
    const panels = [
      { x: w * 0.03, y: h * 0.10, width: w * 0.18, height: h * 0.38 },   // Left panel
      { x: w * 0.80, y: h * 0.08, width: w * 0.17, height: h * 0.32 },   // Right panel
      { x: w * 0.04, y: h * 0.75, width: w * 0.12, height: h * 0.12 },   // Bottom-left
      { x: w * 0.84, y: h * 0.78, width: w * 0.12, height: h * 0.10 },   // Bottom-right
    ];

    panels.forEach(panel => {
      const px = panel.x;
      const py = panel.y;
      const pw = panel.width;
      const ph = panel.height;

      bracketGfx.lineStyle(bracketLineWidth, bracketColor, bracketAlpha);

      // Top-left bracket
      bracketGfx.moveTo(px, py + bracketArm);
      bracketGfx.lineTo(px, py);
      bracketGfx.lineTo(px + bracketArm, py);

      // Top-right bracket
      bracketGfx.moveTo(px + pw - bracketArm, py);
      bracketGfx.lineTo(px + pw, py);
      bracketGfx.lineTo(px + pw, py + bracketArm);

      // Bottom-left bracket
      bracketGfx.moveTo(px, py + ph - bracketArm);
      bracketGfx.lineTo(px, py + ph);
      bracketGfx.lineTo(px + bracketArm, py + ph);

      // Bottom-right bracket
      bracketGfx.moveTo(px + pw - bracketArm, py + ph);
      bracketGfx.lineTo(px + pw, py + ph);
      bracketGfx.lineTo(px + pw, py + ph - bracketArm);

      // Corner node dots
      bracketGfx.lineStyle(0);
      bracketGfx.beginFill(bracketColor, 0.50);
      bracketGfx.drawCircle(px, py, 2);
      bracketGfx.drawCircle(px + pw, py, 2);
      bracketGfx.drawCircle(px, py + ph, 2);
      bracketGfx.drawCircle(px + pw, py + ph, 2);
      bracketGfx.endFill();
    });

    bracketGfx.alpha = 0;
    rippleContainer.addChild(bracketGfx);

    // =============================================
    // LAYER 5: ADDITIONAL SCATTERED PARTICLES
    // 150 more particles for 3x density boost
    // =============================================
    const extraParticlesGfx = new PIXI.Graphics();

    for (let epi = 0; epi < 150; epi++) {
      // Density gradient: 60% within central 50% of screen
      let epX, epY;
      if (Math.random() < 0.6) {
        epX = cx + (Math.random() - 0.5) * w * 0.5;
        epY = cy + (Math.random() - 0.5) * h * 0.5;
      } else {
        epX = Math.random() * w;
        epY = Math.random() * h;
      }

      // Vary size and brightness
      const isBright = Math.random() < 0.07;
      const epSize = isBright ? (4 + Math.random() * 2) : (1 + Math.random() * 2);
      const epAlpha = isBright ? (0.5 + Math.random() * 0.2) : (0.10 + Math.random() * 0.30);

      // Color distribution: 65% white, 25% cyan, 10% blue
      const colorRoll = Math.random();
      const epColor = colorRoll < 0.65 ? 0xffffff : (colorRoll < 0.90 ? 0x00d4ff : 0x4488ff);

      extraParticlesGfx.beginFill(epColor, epAlpha);
      extraParticlesGfx.drawCircle(epX, epY, epSize);
      extraParticlesGfx.endFill();
    }

    extraParticlesGfx.alpha = 0;
    rippleContainer.addChild(extraParticlesGfx);

    // =============================================
    // LAYER 6: RADIAL STREAK ARTIFACTS
    // Short line segments radiating from center
    // Creates "ejected matter" impression
    // =============================================
    const streakGfx = new PIXI.Graphics();
    streakGfx.blendMode = PIXI.BLEND_MODES.ADD;

    // 30 normal streaks
    for (let sti = 0; sti < 30; sti++) {
      const streakAngle = Math.random() * Math.PI * 2;
      const streakDist = 100 + Math.random() * 300;
      const streakLen = 10 + Math.random() * 30;
      const streakAlpha = 0.10 + Math.random() * 0.15;

      const startX = cx + Math.cos(streakAngle) * streakDist;
      const startY = cy + Math.sin(streakAngle) * streakDist * (baseRY / baseRX); // Elliptical path
      const endX = startX + Math.cos(streakAngle) * streakLen;
      const endY = startY + Math.sin(streakAngle) * streakLen * (baseRY / baseRX);

      streakGfx.lineStyle(1, 0x00d4ff, streakAlpha);
      streakGfx.moveTo(startX, startY);
      streakGfx.lineTo(endX, endY);
    }

    // 5 brighter, longer streaks
    for (let bsi = 0; bsi < 5; bsi++) {
      const streakAngle = Math.random() * Math.PI * 2;
      const streakDist = 80 + Math.random() * 250;
      const streakLen = 40 + Math.random() * 40;

      const startX = cx + Math.cos(streakAngle) * streakDist;
      const startY = cy + Math.sin(streakAngle) * streakDist * (baseRY / baseRX);
      const endX = startX + Math.cos(streakAngle) * streakLen;
      const endY = startY + Math.sin(streakAngle) * streakLen * (baseRY / baseRX);

      streakGfx.lineStyle(2, 0x00d4ff, 0.35);
      streakGfx.moveTo(startX, startY);
      streakGfx.lineTo(endX, endY);
    }

    streakGfx.alpha = 0;
    rippleContainer.addChild(streakGfx);

    // =============================================
    // LAYER 7: CORE INTENSITY BOOST
    // Additional filled ellipses + star-spike cross
    // =============================================
    const coreBoostContainer = new PIXI.Container();
    coreBoostContainer.blendMode = PIXI.BLEND_MODES.ADD;
    const coreBoostGfx = new PIXI.Graphics();

    // Outer boost ellipse
    coreBoostGfx.beginFill(0x88eeff, 0.20);
    coreBoostGfx.drawEllipse(cx, cy, 60, 24);
    coreBoostGfx.endFill();

    // Inner boost ellipse
    coreBoostGfx.beginFill(0xffffff, 0.40);
    coreBoostGfx.drawEllipse(cx, cy, 25, 10);
    coreBoostGfx.endFill();

    // Star-spike cross pattern — 4 thin bright lines through center
    const spikeLength = 80;
    coreBoostGfx.lineStyle(1.5, 0xffffff, 0.50);
    // Vertical spike
    coreBoostGfx.moveTo(cx, cy - spikeLength);
    coreBoostGfx.lineTo(cx, cy + spikeLength);
    // Horizontal spike
    coreBoostGfx.moveTo(cx - spikeLength, cy);
    coreBoostGfx.lineTo(cx + spikeLength, cy);

    coreBoostContainer.addChild(coreBoostGfx);
    coreBoostContainer.alpha = 0;
    rippleContainer.addChild(coreBoostContainer);

    // =============================================
    // LAYER 8: PANEL ILLUMINATION GRADIENT
    // Subtle gradient overlay - brighter side facing center
    // =============================================
    const panelIllumGfx = new PIXI.Graphics();

    panels.forEach(panel => {
      const px = panel.x;
      const py = panel.y;
      const pw = panel.width;
      const ph = panel.height;

      // Determine which side faces center
      const panelCenterX = px + pw / 2;
      const facingLeft = panelCenterX > cx;

      // Draw 4 vertical strips with gradient alpha
      const stripWidth = pw / 4;
      for (let si = 0; si < 4; si++) {
        // If panel is to the right of center, left side is brighter
        // If panel is to the left of center, right side is brighter
        let stripAlpha;
        if (facingLeft) {
          stripAlpha = 0.06 - si * 0.01; // Left strips brighter
        } else {
          stripAlpha = 0.03 + si * 0.01; // Right strips brighter
        }

        panelIllumGfx.beginFill(0x00d4ff, stripAlpha);
        panelIllumGfx.drawRect(px + si * stripWidth, py, stripWidth, ph);
        panelIllumGfx.endFill();
      }
    });

    panelIllumGfx.alpha = 0;
    rippleContainer.addChild(panelIllumGfx);

    // =============================================
    // LAYER 9: ADDITIONAL PANEL FUI DETAIL
    // Text readout lines, tick marks, radar sweep, waveform
    // =============================================
    const panelDetailGfx = new PIXI.Graphics();

    // Left panel (globe panel) details — at w*0.03, h*0.10
    const lpX = w * 0.03;
    const lpY = h * 0.10;
    const lpW = w * 0.18;
    const lpH = h * 0.38;

    // 4 thin horizontal lines (simulating text readouts)
    panelDetailGfx.lineStyle(0.5, 0x00aacc, 0.20);
    for (let tli = 0; tli < 4; tli++) {
      const lineY = lpY + lpH * 0.52 + tli * 12;
      const lineLen = lpW * (0.4 + Math.random() * 0.2);
      panelDetailGfx.moveTo(lpX + 10, lineY);
      panelDetailGfx.lineTo(lpX + 10 + lineLen, lineY);
    }

    // Tick marks around globe equator
    const globeCX = lpX + lpW * 0.5;
    const globeCY = lpY + lpH * 0.30;
    const globeR = Math.min(lpW, lpH) * 0.25;
    panelDetailGfx.lineStyle(0.5, 0x00aacc, 0.25);
    for (let ti = 0; ti < 12; ti++) {
      const tickAngle = (ti / 12) * Math.PI * 2;
      const tickInner = globeR * 0.85;
      const tickOuter = globeR * 0.95;
      panelDetailGfx.moveTo(
        globeCX + tickInner * Math.cos(tickAngle),
        globeCY + tickInner * Math.sin(tickAngle)
      );
      panelDetailGfx.lineTo(
        globeCX + tickOuter * Math.cos(tickAngle),
        globeCY + tickOuter * Math.sin(tickAngle)
      );
    }

    // Right panel (vessel panel) details — at w*0.80, h*0.08
    const rpX = w * 0.80;
    const rpY = h * 0.08;
    const rpW = w * 0.17;
    const rpH = h * 0.32;

    // Small radar sweep indicator
    const radarCX = rpX + rpW * 0.75;
    const radarCY = rpY + rpH * 0.72;
    const radarR = 12;
    panelDetailGfx.lineStyle(1, 0x00aacc, 0.25);
    panelDetailGfx.drawCircle(radarCX, radarCY, radarR);
    panelDetailGfx.lineStyle(0);
    panelDetailGfx.beginFill(0x00aacc, 0.15);
    panelDetailGfx.moveTo(radarCX, radarCY);
    panelDetailGfx.arc(radarCX, radarCY, radarR * 0.9, -Math.PI * 0.5, Math.PI * 0.17);
    panelDetailGfx.lineTo(radarCX, radarCY);
    panelDetailGfx.endFill();

    // Bottom-left panel waveform — at w*0.04, h*0.75
    const blpX = w * 0.04;
    const blpY = h * 0.75;
    const blpW = w * 0.12;
    const blpH = h * 0.12;

    panelDetailGfx.lineStyle(1, 0x00aacc, 0.20);
    panelDetailGfx.moveTo(blpX + 8, blpY + blpH * 0.45);
    for (let wfi = 0; wfi < 10; wfi++) {
      const wfx = blpX + 8 + wfi * (blpW - 16) / 10;
      const wfy = blpY + blpH * 0.45 + (Math.random() - 0.5) * 15;
      panelDetailGfx.lineTo(wfx, wfy);
    }

    // Red/amber accent bar
    panelDetailGfx.lineStyle(0);
    panelDetailGfx.beginFill(0xff4444, 0.35);
    panelDetailGfx.drawRect(blpX + blpW - 18, blpY + 8, 10, 4);
    panelDetailGfx.endFill();

    // Bottom-right panel — at w*0.84, h*0.78
    const brpX = w * 0.84;
    const brpY = h * 0.78;
    const brpW = w * 0.12;
    const brpH = h * 0.10;

    // Additional waveform in bottom-right
    panelDetailGfx.lineStyle(0.5, 0x00aacc, 0.18);
    panelDetailGfx.moveTo(brpX + 8, brpY + brpH * 0.60);
    for (let wfi = 0; wfi < 8; wfi++) {
      const wfx = brpX + 8 + wfi * (brpW - 16) / 8;
      const wfy = brpY + brpH * 0.60 + (Math.random() - 0.5) * 10;
      panelDetailGfx.lineTo(wfx, wfy);
    }

    panelDetailGfx.alpha = 0;
    rippleContainer.addChild(panelDetailGfx);

    // =============================================
    // GSAP ANIMATIONS FOR INTENSIFY LAYERS
    // =============================================

    // Layer 1: Hex grid - fade in then out
    timeline.to(hexGridIntense, { alpha: 0.7, duration: 0.4, ease: 'power1.out' }, 0);
    timeline.to(hexGridIntense, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 2 + 3: Ring thickness bands + Fresnel dots expand with ring stagger
    for (let ani = 0; ani < 5; ani++) {
      const ringDelay = 0.1 + ani * 0.15;

      // Thickness bands
      timeline.to(thickBandGraphics[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(thickBandGraphics[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);

      // Fresnel dots
      timeline.to(fresnelGraphics[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(fresnelGraphics[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);
    }

    // Layer 4: Corner brackets visible immediately
    timeline.to(bracketGfx, { alpha: 0.8, duration: 0.3, ease: 'power1.out' }, 0);
    timeline.to(bracketGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.6);

    // Layer 5: Additional particles fade in
    timeline.to(extraParticlesGfx, { alpha: 0.85, duration: 0.4, ease: 'power1.out' }, 0.15);
    timeline.to(extraParticlesGfx, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 6: Radial streaks fade in
    timeline.to(streakGfx, { alpha: 0.8, duration: 0.4, ease: 'power1.out' }, 0.15);
    timeline.to(streakGfx, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 7: Core boost appears after initial flash
    timeline.to(coreBoostContainer, { alpha: 1, duration: 0.1, ease: 'power2.out' }, 0.05);
    timeline.to(coreBoostContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 8: Panel illumination gradient fades in
    timeline.to(panelIllumGfx, { alpha: 0.7, duration: 0.4, ease: 'power1.out' }, 0.20);
    timeline.to(panelIllumGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.6);

    // Layer 9: Panel detail visible with panels
    timeline.to(panelDetailGfx, { alpha: 0.9, duration: 0.4, ease: 'power1.out' }, 0.2);
    timeline.to(panelDetailGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.6);
  }

  /**
   * Ripple Wave Round 4 polish - 5 focused layers addressing exact visual gaps
   * from reference comparison. PURE ADDITION - transforms thin 3px lines into
   * thick 18px luminous bands, adds Fresnel depth cue, searing white core.
   * Uses NORMAL blend for thick bands (per PixiJS 7 docs: overlapping primitives
   * with ADD blend cause blowout). Graphics drawn ONCE, never modified per frame.
   */
  _addRippleWavePolish(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline) {
    // =============================================================
    // 5 FOCUSED LAYERS - Each targets a specific visual gap
    // Ring timing: ringDelay = 0.1 + i * 0.15, duration: 1.5, ease: 'power2.out'
    // =============================================================

    // =============================================
    // LAYER 1: THICK RING GLOW BANDS (highest impact)
    // Transform thin 3px lines into 18px luminous bands
    // Uses NORMAL blend to avoid blowout from overlapping strokes
    // 3 concentric strokes create gradient band effect
    // =============================================
    const thickBandContainers = [];

    for (let tbi = 0; tbi < 5; tbi++) {
      const bandContainer = new PIXI.Container();
      bandContainer.x = cx;
      bandContainer.y = cy;

      const bandGfx = new PIXI.Graphics();
      // DO NOT use PIXI.BLEND_MODES.ADD - per PixiJS 7 docs, overlapping
      // primitives in same Graphics with ADD blend cause blowout
      // NORMAL blend lets multi-stroke ellipses stack into gradient band

      // Outermost glow - wide and soft
      bandGfx.lineStyle(18, 0x003344, 0.07);
      bandGfx.drawEllipse(0, 0, baseRX, baseRY);

      // Middle band - medium brightness
      bandGfx.lineStyle(8, 0x007799, 0.14);
      bandGfx.drawEllipse(0, 0, baseRX, baseRY);

      // Inner core - brightest, thinnest
      bandGfx.lineStyle(2.5, 0x33ccee, 0.28);
      bandGfx.drawEllipse(0, 0, baseRX, baseRY);

      bandContainer.addChild(bandGfx);
      bandContainer.scale.set(0);
      bandContainer.alpha = 1;

      rippleContainer.addChild(bandContainer);
      thickBandContainers.push(bandContainer);
    }

    // =============================================
    // LAYER 2: FRESNEL NEAR-SIDE BRIGHTNESS (3D depth cue)
    // 45 dots along bottom arc + 6 bright nodes per ring
    // Creates 2-3x brightness at bottom vs top = 3D depth
    // Shares containers with Layer 1 for perfect sync
    // =============================================
    const fresnelContainers = [];

    for (let fri = 0; fri < 5; fri++) {
      const fresnelContainer = new PIXI.Container();
      fresnelContainer.x = cx;
      fresnelContainer.y = cy;

      const fresnelGfx = new PIXI.Graphics();
      fresnelGfx.blendMode = PIXI.BLEND_MODES.ADD;

      // 45 dots distributed along bottom arc (0.15π to 0.85π)
      for (let fdi = 0; fdi < 45; fdi++) {
        const angle = (0.15 + (fdi / 44) * 0.70) * Math.PI;
        // In PixiJS screen coords: +y is down, sin(angle) positive in this range = bottom
        const fx = baseRX * Math.cos(angle);
        const fy = baseRY * Math.sin(angle);

        // Brightness peaks at bottom center (angle = π/2)
        const peakFactor = Math.sin(angle);
        const dotAlpha = 0.15 + peakFactor * 0.35;
        const dotSize = 1.5 + peakFactor * 2.0;

        fresnelGfx.beginFill(0x88eeff, dotAlpha);
        fresnelGfx.drawCircle(fx, fy, dotSize);
        fresnelGfx.endFill();
      }

      // 6 bright nodes per ring at bottom arc - larger sparkle points
      for (let fni = 0; fni < 6; fni++) {
        const nodeAngle = (0.25 + (fni / 5) * 0.50) * Math.PI;
        const nx = baseRX * Math.cos(nodeAngle);
        const ny = baseRY * Math.sin(nodeAngle);
        fresnelGfx.beginFill(0xffffff, 0.55 + Math.random() * 0.20);
        fresnelGfx.drawCircle(nx, ny, 3 + Math.random() * 3);
        fresnelGfx.endFill();
      }

      fresnelContainer.addChild(fresnelGfx);
      fresnelContainer.scale.set(0);
      fresnelContainer.alpha = 1;

      rippleContainer.addChild(fresnelContainer);
      fresnelContainers.push(fresnelContainer);
    }

    // =============================================
    // LAYER 3: SEARING WHITE CORE BOOST
    // Push core brightness toward true white via ADD blend
    // 3 filled ellipses + 6 star-spike lines (lens flare)
    // =============================================
    const coreBoostContainer = new PIXI.Container();
    coreBoostContainer.blendMode = PIXI.BLEND_MODES.ADD;

    const coreGfx = new PIXI.Graphics();

    // Innermost - searing white
    coreGfx.beginFill(0xffffff, 0.50);
    coreGfx.drawEllipse(cx, cy, 28, 11);
    coreGfx.endFill();

    // Middle - bright cyan-white
    coreGfx.beginFill(0xaaddff, 0.25);
    coreGfx.drawEllipse(cx, cy, 65, 26);
    coreGfx.endFill();

    // Outer - subtle dark cyan glow
    coreGfx.beginFill(0x004466, 0.10);
    coreGfx.drawEllipse(cx, cy, 160, 64);
    coreGfx.endFill();

    // 6 star-spike lines through center (lens flare cross pattern)
    const spikeAngles = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3];
    for (let si = 0; si < spikeAngles.length; si++) {
      const sLen = 50 + Math.random() * 60; // 50-110px length
      const sAlpha = 0.4 + Math.random() * 0.25;
      coreGfx.lineStyle(1.2, 0xffffff, sAlpha);
      coreGfx.moveTo(cx, cy);
      // * 0.4 on y flattens spikes to match elliptical perspective
      coreGfx.lineTo(cx + Math.cos(spikeAngles[si]) * sLen, cy + Math.sin(spikeAngles[si]) * sLen * 0.4);
    }

    coreBoostContainer.addChild(coreGfx);
    coreBoostContainer.alpha = 0;
    rippleContainer.addChild(coreBoostContainer);

    // =============================================
    // LAYER 4: PARTICLE DENSITY BOOST + RADIAL STREAKS
    // 200 dust particles + 25 bright standouts
    // 30 radial streaks + 8 brighter longer streaks
    // =============================================
    const dustGfx = new PIXI.Graphics();

    // 200 dust particles with density gradient (65% in center)
    for (let dpi = 0; dpi < 200; dpi++) {
      const inCenter = Math.random() < 0.65;
      const dpx = inCenter ? w * 0.25 + Math.random() * w * 0.50 : Math.random() * w;
      const dpy = inCenter ? h * 0.25 + Math.random() * h * 0.50 : Math.random() * h;
      const dpSize = 0.8 + Math.random() * 1.5;
      const dpAlpha = 0.03 + Math.random() * 0.12;
      const dpColor = Math.random() < 0.65 ? 0xffffff : (Math.random() < 0.7 ? 0x00d4ff : 0x4488ff);

      dustGfx.beginFill(dpColor, dpAlpha);
      dustGfx.drawCircle(dpx, dpy, dpSize);
      dustGfx.endFill();
    }

    // 25 brighter standout particles
    for (let bpi = 0; bpi < 25; bpi++) {
      const bpx = w * 0.15 + Math.random() * w * 0.70;
      const bpy = h * 0.15 + Math.random() * h * 0.70;
      dustGfx.beginFill(0xffffff, 0.35 + Math.random() * 0.35);
      dustGfx.drawCircle(bpx, bpy, 2 + Math.random() * 3);
      dustGfx.endFill();
    }

    dustGfx.alpha = 0;
    rippleContainer.addChild(dustGfx);

    // Radial streak artifacts
    const streakGfx = new PIXI.Graphics();
    streakGfx.blendMode = PIXI.BLEND_MODES.ADD;

    // 30 normal streaks
    for (let sti = 0; sti < 30; sti++) {
      const stAngle = Math.random() * Math.PI * 2;
      const stDist = 120 + Math.random() * 350;
      const stLen = 10 + Math.random() * 35;
      const stStartX = cx + Math.cos(stAngle) * stDist;
      const stStartY = cy + Math.sin(stAngle) * stDist * 0.4; // perspective flatten
      const stEndX = stStartX + Math.cos(stAngle) * stLen;
      const stEndY = stStartY + Math.sin(stAngle) * stLen * 0.4;

      streakGfx.lineStyle(0.8 + Math.random() * 0.8, 0x00d4ff, 0.08 + Math.random() * 0.15);
      streakGfx.moveTo(stStartX, stStartY);
      streakGfx.lineTo(stEndX, stEndY);
    }

    // 8 brighter, longer streaks
    for (let bsi = 0; bsi < 8; bsi++) {
      const bsAngle = Math.random() * Math.PI * 2;
      const bsDist = 80 + Math.random() * 300;
      const bsLen = 30 + Math.random() * 50;
      const bsStartX = cx + Math.cos(bsAngle) * bsDist;
      const bsStartY = cy + Math.sin(bsAngle) * bsDist * 0.4;
      const bsEndX = bsStartX + Math.cos(bsAngle) * bsLen;
      const bsEndY = bsStartY + Math.sin(bsAngle) * bsLen * 0.4;

      streakGfx.lineStyle(1.5, 0x44eeff, 0.20 + Math.random() * 0.15);
      streakGfx.moveTo(bsStartX, bsStartY);
      streakGfx.lineTo(bsEndX, bsEndY);
    }

    streakGfx.alpha = 0;
    rippleContainer.addChild(streakGfx);

    // =============================================
    // LAYER 5: ENHANCED FUI BRACKET CORNER DOTS
    // Larger, brighter corner node dots to emphasize brackets
    // (Brackets already exist from Round 3, this enhances visibility)
    // =============================================
    const bracketDotsGfx = new PIXI.Graphics();
    bracketDotsGfx.blendMode = PIXI.BLEND_MODES.ADD;

    const panelPositions = [
      { x: w * 0.03, y: h * 0.10, width: w * 0.18, height: h * 0.38 },   // Left panel
      { x: w * 0.80, y: h * 0.08, width: w * 0.17, height: h * 0.32 },   // Right panel
      { x: w * 0.04, y: h * 0.75, width: w * 0.12, height: h * 0.12 },   // Bottom-left
      { x: w * 0.84, y: h * 0.78, width: w * 0.12, height: h * 0.10 },   // Bottom-right
    ];

    panelPositions.forEach(panel => {
      const px = panel.x;
      const py = panel.y;
      const pw = panel.width;
      const ph = panel.height;

      // Bright corner dots with glow rings
      bracketDotsGfx.beginFill(0x00d4ff, 0.70);
      bracketDotsGfx.drawCircle(px, py, 3);
      bracketDotsGfx.drawCircle(px + pw, py, 3);
      bracketDotsGfx.drawCircle(px, py + ph, 3);
      bracketDotsGfx.drawCircle(px + pw, py + ph, 3);
      bracketDotsGfx.endFill();

      // Outer glow rings
      bracketDotsGfx.lineStyle(1, 0x00d4ff, 0.25);
      bracketDotsGfx.drawCircle(px, py, 6);
      bracketDotsGfx.drawCircle(px + pw, py, 6);
      bracketDotsGfx.drawCircle(px, py + ph, 6);
      bracketDotsGfx.drawCircle(px + pw, py + ph, 6);
    });

    bracketDotsGfx.alpha = 0;
    rippleContainer.addChild(bracketDotsGfx);

    // =============================================
    // GSAP ANIMATIONS FOR POLISH LAYERS
    // Match exact timing from Round 1 ring animations
    // =============================================

    // Layers 1 & 2: Thick bands + Fresnel expand with ring stagger
    for (let ani = 0; ani < 5; ani++) {
      const ringDelay = 0.1 + ani * 0.15;

      // Layer 1: Thick band containers
      timeline.to(thickBandContainers[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(thickBandContainers[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);

      // Layer 2: Fresnel containers
      timeline.to(fresnelContainers[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(fresnelContainers[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);
    }

    // Layer 3: Core boost - appears after initial flash, fades out
    timeline.to(coreBoostContainer, { alpha: 1, duration: 0.05, ease: 'power2.out' }, 0.05);
    timeline.to(coreBoostContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 4: Dust particles and streaks
    timeline.to(dustGfx, { alpha: 1, duration: 0.15, ease: 'power1.out' }, 0.15);
    timeline.to(dustGfx, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    timeline.to(streakGfx, { alpha: 0.9, duration: 0.15, ease: 'power1.out' }, 0.15);
    timeline.to(streakGfx, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layer 5: Enhanced bracket corner dots
    timeline.to(bracketDotsGfx, { alpha: 0.9, duration: 0.3, ease: 'power1.out' }, 0);
    timeline.to(bracketDotsGfx, { alpha: 0, duration: 0.4, ease: 'power1.in' }, 1.6);
  }

  /**
   * Ripple Wave Round 5 SHOWTIME - Maximum cinematic impact
   * HEADLINE: AdvancedBloomFilter on core for light-bleeding bloom effect
   * ADD-blend wide ring glow bands (28-44px progressive width)
   * Bold Fresnel with squared sine peaks and 8px white hot-spot nodes
   * 15 animated sparkle bursts for razzamatazz
   * Global brightness lift with core-to-ring bridge and upward light column
   */
  _addRippleWaveShowtime(rippleContainer, w, h, cx, cy, baseRX, baseRY, timeline) {
    // =============================================================
    // 5 SHOWTIME LAYERS - Maximum cinematic impact
    // Ring timing: ringDelay = 0.1 + i * 0.15, duration: 1.5, ease: 'power2.out'
    // =============================================================

    // =============================================
    // LAYER 1: ADVANCEDBLOOMFILTER ON CORE (THE CINEMATIC WEAPON)
    // Transforms core from "drawn shape" to "light source that bleeds"
    // =============================================
    const bloomCoreContainer = new PIXI.Container();

    const bloomGfx = new PIXI.Graphics();

    // Searing white center
    bloomGfx.beginFill(0xffffff, 0.95);
    bloomGfx.drawEllipse(cx, cy, 30, 12);
    bloomGfx.endFill();

    // Bright cyan inner glow
    bloomGfx.beginFill(0x88eeff, 0.50);
    bloomGfx.drawEllipse(cx, cy, 75, 30);
    bloomGfx.endFill();

    // Medium teal spread
    bloomGfx.beginFill(0x00aacc, 0.20);
    bloomGfx.drawEllipse(cx, cy, 150, 60);
    bloomGfx.endFill();

    // Wide dark teal aura - bridges core to innermost ring
    bloomGfx.beginFill(0x004466, 0.10);
    bloomGfx.drawEllipse(cx, cy, 250, 100);
    bloomGfx.endFill();

    // Star-spike flares - 6 very bright cross lines
    const spikeData = [
      { angle: 0, len: 80 },
      { angle: Math.PI / 3, len: 55 },
      { angle: 2 * Math.PI / 3, len: 65 },
      { angle: Math.PI, len: 80 },
      { angle: 4 * Math.PI / 3, len: 55 },
      { angle: 5 * Math.PI / 3, len: 65 }
    ];
    for (let s = 0; s < spikeData.length; s++) {
      bloomGfx.lineStyle(1.5, 0xffffff, 0.75);
      bloomGfx.moveTo(cx, cy);
      bloomGfx.lineTo(
        cx + Math.cos(spikeData[s].angle) * spikeData[s].len,
        cy + Math.sin(spikeData[s].angle) * spikeData[s].len * 0.4  // perspective flatten
      );
    }

    bloomCoreContainer.addChild(bloomGfx);

    // Apply AdvancedBloomFilter - access via PIXI.filters (same pattern as GlowFilter)
    let bloomFilter = null;
    try {
      if (PIXI.filters && PIXI.filters.AdvancedBloomFilter) {
        bloomFilter = new PIXI.filters.AdvancedBloomFilter({
          threshold: 0.2,     // Low threshold - catches most bright core elements
          bloomScale: 1.5,    // Strong bloom intensity
          brightness: 1.3,    // Slightly overblown - the "searing" quality
          blur: 6,            // Moderate spread
          quality: 4          // Good quality
        });
        bloomCoreContainer.filters = [bloomFilter];
      } else {
        throw new Error('AdvancedBloomFilter not available');
      }
    } catch (e) {
      console.warn('[RippleWave] AdvancedBloomFilter not found, using drawn glow fallback');
      // Fallback: large glow ellipses in ADD blend
      const fallbackGlow = new PIXI.Graphics();
      fallbackGlow.beginFill(0x004466, 0.08);
      fallbackGlow.drawEllipse(cx, cy, 300, 120);
      fallbackGlow.endFill();
      fallbackGlow.beginFill(0x002233, 0.04);
      fallbackGlow.drawEllipse(cx, cy, 450, 180);
      fallbackGlow.endFill();
      const fallbackContainer = new PIXI.Container();
      fallbackContainer.blendMode = PIXI.BLEND_MODES.ADD;
      fallbackContainer.addChild(fallbackGlow);
      rippleContainer.addChild(fallbackContainer);
    }

    bloomCoreContainer.alpha = 0;
    rippleContainer.addChild(bloomCoreContainer);

    // =============================================
    // LAYER 2: ADD-BLEND WIDE RING GLOW BANDS
    // Fixes Round 4's NORMAL blend mistake - ADD at low alpha IS visible
    // Per-primitive additive stacking creates natural gradient
    // Outer rings progressively wider (28px -> 44px)
    // =============================================
    const wideGlowContainers = [];

    for (let rgi = 0; rgi < 5; rgi++) {
      const glowContainer = new PIXI.Container();
      glowContainer.x = cx;
      glowContainer.y = cy;
      glowContainer.blendMode = PIXI.BLEND_MODES.ADD;

      const glowGfx = new PIXI.Graphics();

      // Progressive width: ring 0 = 28px, ring 4 = 44px
      const wideWidth = 28 + rgi * 4;
      const mediumWidth = 12 + rgi * 2;

      // Wide outer haze - barely visible individually, ADD makes it glow
      glowGfx.lineStyle(wideWidth, 0x003344, 0.020);
      glowGfx.drawEllipse(0, 0, baseRX, baseRY);

      // Medium glow band
      glowGfx.lineStyle(mediumWidth, 0x006688, 0.040);
      glowGfx.drawEllipse(0, 0, baseRX, baseRY);

      // Narrow bright core - reinforces existing thin ring line
      glowGfx.lineStyle(4, 0x22bbdd, 0.085);
      glowGfx.drawEllipse(0, 0, baseRX, baseRY);

      glowContainer.addChild(glowGfx);
      glowContainer.scale.set(0);
      glowContainer.alpha = 1;

      rippleContainer.addChild(glowContainer);
      wideGlowContainers.push(glowContainer);
    }

    // =============================================
    // LAYER 3: BOLD FRESNEL NEAR-SIDE BRIGHTNESS (3:1 ratio)
    // Squared sine for sharper peak, 8 large white hot-spot nodes
    // =============================================
    const boldFresnelContainers = [];

    for (let bfi = 0; bfi < 5; bfi++) {
      const fresnelContainer = new PIXI.Container();
      fresnelContainer.x = cx;
      fresnelContainer.y = cy;

      const fresnelGfx = new PIXI.Graphics();
      // NORMAL blend - dots are opaque bright points, not glow

      // 50 bright Fresnel dots along bottom arc
      for (let fdi = 0; fdi < 50; fdi++) {
        const angle = (0.15 + (fdi / 49) * 0.70) * Math.PI;
        const fx = baseRX * Math.cos(angle);
        const fy = baseRY * Math.sin(angle);

        // Squared sine = sharper peak at bottom center
        const peak = Math.pow(Math.sin(angle), 2.0);
        const dotAlpha = 0.10 + peak * 0.40;  // 0.10 at sides, 0.50 at bottom
        const dotSize = 1.5 + peak * 3.0;     // 1.5px at sides, 4.5px at bottom

        fresnelGfx.beginFill(0x88eeff, dotAlpha);
        fresnelGfx.drawCircle(fx, fy, dotSize);
        fresnelGfx.endFill();
      }

      // 8 LARGE BRIGHT WHITE NODES - the "hot spots"
      for (let fni = 0; fni < 8; fni++) {
        const nodeAngle = (0.20 + (fni / 7) * 0.60) * Math.PI;
        const nx = baseRX * Math.cos(nodeAngle);
        const ny = baseRY * Math.sin(nodeAngle);
        const nodePeak = Math.pow(Math.sin(nodeAngle), 1.5);
        const nodeSize = 3 + nodePeak * 5;        // 3px at sides, 8px at bottom
        const nodeAlpha = 0.40 + nodePeak * 0.40; // 0.40 at sides, 0.80 at bottom

        fresnelGfx.beginFill(0xffffff, nodeAlpha);
        fresnelGfx.drawCircle(nx, ny, nodeSize);
        fresnelGfx.endFill();
      }

      fresnelContainer.addChild(fresnelGfx);
      fresnelContainer.scale.set(0);
      fresnelContainer.alpha = 1;

      rippleContainer.addChild(fresnelContainer);
      boldFresnelContainers.push(fresnelContainer);
    }

    // =============================================
    // LAYER 4: ANIMATED SPARKLE BURSTS (the razzamatazz)
    // 15 sparkles flash at random times during transition
    // =============================================
    const sparkles = [];

    for (let spi = 0; spi < 15; spi++) {
      const sparkle = new PIXI.Graphics();

      // Position on/near ring field using ring ellipse math
      const ringIdx = Math.floor(Math.random() * 5);
      const sparkAngle = Math.random() * Math.PI * 2;
      const sparkRX = baseRX * (0.3 + ringIdx * 0.175);
      const sparkRY = baseRY * (0.3 + ringIdx * 0.175);
      const sparkX = cx + sparkRX * Math.cos(sparkAngle) + (Math.random() - 0.5) * 30;
      const sparkY = cy + sparkRY * Math.sin(sparkAngle) + (Math.random() - 0.5) * 15;

      // Small bright dot with tiny cross (star-point micro-flare)
      const sparkSize = 2 + Math.random() * 4;
      sparkle.beginFill(0xffffff, 0.9);
      sparkle.drawCircle(sparkX, sparkY, sparkSize);
      sparkle.endFill();

      // Tiny cross lines
      sparkle.lineStyle(0.8, 0xffffff, 0.7);
      sparkle.moveTo(sparkX - sparkSize * 1.5, sparkY);
      sparkle.lineTo(sparkX + sparkSize * 1.5, sparkY);
      sparkle.moveTo(sparkX, sparkY - sparkSize * 0.6);
      sparkle.lineTo(sparkX, sparkY + sparkSize * 0.6);

      sparkle.alpha = 0;
      sparkle.blendMode = PIXI.BLEND_MODES.ADD;
      rippleContainer.addChild(sparkle);

      // Store for animation
      sparkles.push({
        gfx: sparkle,
        flashTime: 0.3 + Math.random() * 1.2,
        flashDuration: 0.15 + Math.random() * 0.25
      });
    }

    // =============================================
    // LAYER 5: GLOBAL BRIGHTNESS LIFT + EXPANDED CORE HAZE
    // =============================================

    // Part A: Global ambient lift
    const ambientGfx = new PIXI.Graphics();
    ambientGfx.beginFill(0x001122, 0.025);
    ambientGfx.drawEllipse(cx, cy, w * 0.55, h * 0.45);
    ambientGfx.endFill();

    const ambientContainer = new PIXI.Container();
    ambientContainer.blendMode = PIXI.BLEND_MODES.ADD;
    ambientContainer.addChild(ambientGfx);
    ambientContainer.alpha = 0;
    rippleContainer.addChild(ambientContainer);

    // Part B: Core-to-ring bridge glow
    const bridgeGfx = new PIXI.Graphics();
    bridgeGfx.beginFill(0x003344, 0.045);
    bridgeGfx.drawEllipse(cx, cy, baseRX * 0.6, baseRY * 0.6);
    bridgeGfx.endFill();
    bridgeGfx.beginFill(0x002233, 0.025);
    bridgeGfx.drawEllipse(cx, cy, baseRX * 0.85, baseRY * 0.85);
    bridgeGfx.endFill();

    const bridgeContainer = new PIXI.Container();
    bridgeContainer.blendMode = PIXI.BLEND_MODES.ADD;
    bridgeContainer.addChild(bridgeGfx);
    bridgeContainer.alpha = 0;
    rippleContainer.addChild(bridgeContainer);

    // Part C: Upward light column
    const columnGfx = new PIXI.Graphics();
    columnGfx.beginFill(0x003355, 0.035);
    columnGfx.drawRect(cx - 25, cy - h * 0.4, 50, h * 0.35);
    columnGfx.endFill();
    columnGfx.beginFill(0x004466, 0.020);
    columnGfx.drawRect(cx - 60, cy - h * 0.35, 120, h * 0.30);
    columnGfx.endFill();

    const columnContainer = new PIXI.Container();
    columnContainer.blendMode = PIXI.BLEND_MODES.ADD;
    columnContainer.addChild(columnGfx);
    columnContainer.alpha = 0;
    rippleContainer.addChild(columnContainer);

    // =============================================
    // GSAP ANIMATIONS FOR SHOWTIME LAYERS
    // =============================================

    // Layer 1: Bloom core - appears after initial flash
    timeline.to(bloomCoreContainer, { alpha: 1, duration: 0.05, ease: 'power2.out' }, 0.05);
    timeline.to(bloomCoreContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    // Layers 2 & 3: Wide glow bands + Bold Fresnel expand with ring stagger
    for (let ani = 0; ani < 5; ani++) {
      const ringDelay = 0.1 + ani * 0.15;

      // Layer 2: Wide glow containers
      timeline.to(wideGlowContainers[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(wideGlowContainers[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);

      // Layer 3: Bold Fresnel containers
      timeline.to(boldFresnelContainers[ani].scale, {
        x: 1.0, y: 1.0,
        duration: 1.5,
        ease: 'power2.out'
      }, ringDelay);
      timeline.to(boldFresnelContainers[ani], {
        alpha: 0,
        duration: 1.3,
        ease: 'power1.in'
      }, ringDelay + 0.2);
    }

    // Layer 4: Animated sparkle bursts - each flashes at random time
    sparkles.forEach(sp => {
      const flashIn = sp.flashDuration * 0.3;
      const flashOut = sp.flashDuration * 0.7;

      timeline.to(sp.gfx, {
        alpha: 0.8 + Math.random() * 0.2,
        duration: flashIn,
        ease: 'power2.out'
      }, sp.flashTime);
      timeline.to(sp.gfx, {
        alpha: 0,
        duration: flashOut,
        ease: 'power1.in'
      }, sp.flashTime + flashIn);
    });

    // Layer 5: Global brightness lift elements
    timeline.to(ambientContainer, { alpha: 1, duration: 0.15, ease: 'power1.out' }, 0.1);
    timeline.to(ambientContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    timeline.to(bridgeContainer, { alpha: 1, duration: 0.15, ease: 'power1.out' }, 0.1);
    timeline.to(bridgeContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);

    timeline.to(columnContainer, { alpha: 1, duration: 0.15, ease: 'power1.out' }, 0.1);
    timeline.to(columnContainer, { alpha: 0, duration: 0.5, ease: 'power1.in' }, 1.5);
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
      // LAYER 1: HEXAGONAL GRID BACKGROUND (denser, NORMAL blend)
      // =========================================================
      const hexGrid = new PIXI.Graphics();
      const hexRadius = 20; // Smaller for denser coverage
      const hexW = hexRadius * Math.sqrt(3);
      const hexH = hexRadius * 2;
      hexGrid.lineStyle(1, 0x0a2a3a, 0.08);

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
      hexGrid.alpha = 1;
      backgroundContainer.addChild(hexGrid);

      // beamY defined early for positioning background elements
      const beamY = h * 0.45;

      // =========================================================
      // LAYER 2: STRUCTURAL FRAMEWORK RAILS (thick rails with top-edge highlights)
      // =========================================================
      const structuralRails = new PIXI.Graphics();

      // Helper: draw a horizontal rail with THREE ZONES (bright top + medium face + dark shadow = 14px total)
      const drawHRail = (rx, ry, rw) => {
        // Zone 1: BRIGHT TOP EDGE — specular highlight (2px tall)
        structuralRails.beginFill(0x4a90b0, 0.85);
        structuralRails.drawRect(rx, ry, rw, 2);
        structuralRails.endFill();
        // Zone 2: MEDIUM FACE — the visible front of the rail (10px tall)
        structuralRails.beginFill(0x1e3850, 0.95);
        structuralRails.drawRect(rx, ry + 2, rw, 10);
        structuralRails.endFill();
        // Zone 3: DARK BOTTOM SHADOW (2px tall)
        structuralRails.beginFill(0x060c14, 0.7);
        structuralRails.drawRect(rx, ry + 12, rw, 2);
        structuralRails.endFill();
      };

      // Helper: draw a vertical channel with THREE ZONES (bright left + medium face + dark shadow = 10px total)
      const drawVChannel = (cx, cy, ch) => {
        // Zone 1: BRIGHT LEFT EDGE (2px wide)
        structuralRails.beginFill(0x4a90b0, 0.85);
        structuralRails.drawRect(cx, cy, 2, ch);
        structuralRails.endFill();
        // Zone 2: MEDIUM FACE (6px wide)
        structuralRails.beginFill(0x1e3850, 0.95);
        structuralRails.drawRect(cx + 2, cy, 6, ch);
        structuralRails.endFill();
        // Zone 3: DARK RIGHT SHADOW (2px wide)
        structuralRails.beginFill(0x060c14, 0.7);
        structuralRails.drawRect(cx + 8, cy, 2, ch);
        structuralRails.endFill();
      };

      // LEFT SIDE - 3 horizontal rails
      const topRailY = beamY - h * 0.28;
      const midRailY = beamY - h * 0.08;
      const bottomRailY = beamY + h * 0.12;
      drawHRail(0, topRailY, w * 0.35);
      drawHRail(0, midRailY, w * 0.30);
      drawHRail(0, bottomRailY, w * 0.25);

      // LEFT SIDE - 2 vertical channels
      drawVChannel(w * 0.15, topRailY, bottomRailY - topRailY);
      drawVChannel(w * 0.30, topRailY, midRailY - topRailY);

      // RIGHT SIDE - 2 horizontal rails
      drawHRail(w * 0.72, beamY - h * 0.25, w * 0.28);
      drawHRail(w * 0.78, beamY + h * 0.10, w * 0.22);

      // RIGHT SIDE - 1 vertical channel
      drawVChannel(w * 0.78, beamY - h * 0.25, h * 0.35);

      // Junction gussets at intersections (bright filled circles - bolted connections) - RADIUS 4, ALPHA 0.7
      structuralRails.beginFill(0x4a90b0, 0.7);
      structuralRails.drawCircle(w * 0.15, topRailY, 4);
      structuralRails.drawCircle(w * 0.15, midRailY, 4);
      structuralRails.drawCircle(w * 0.15, bottomRailY, 4);
      structuralRails.drawCircle(w * 0.30, topRailY, 4);
      structuralRails.drawCircle(w * 0.30, midRailY, 4);
      structuralRails.drawCircle(w * 0.78, beamY - h * 0.25, 4);
      structuralRails.drawCircle(w * 0.78, beamY + h * 0.10, 4);
      structuralRails.endFill();

      structuralRails.alpha = 1;
      backgroundContainer.addChild(structuralRails);

      // =========================================================
      // LAYER 3: BEVELED HUD PANELS (filled dark body + bright top/left edges)
      // =========================================================
      const hudPanels = new PIXI.Graphics();

      // Helper: draw beveled panel with two-tone bevel trick
      const drawBeveledPanel = (px, py, pw, ph, edgeAlpha) => {
        // FILLED dark body (visible dark navy blue, opaque)
        hudPanels.beginFill(0x1a3050, 0.95);
        hudPanels.drawRect(px, py, pw, ph);
        hudPanels.endFill();
        // Bright top edge (specular highlight from overhead light) - ALPHA 0.7
        hudPanels.lineStyle(1.5, 0x00d4ff, 0.7);
        hudPanels.moveTo(px, py);
        hudPanels.lineTo(px + pw, py);
        // Bright left edge (secondary highlight) - ALPHA 0.7
        hudPanels.lineStyle(1.5, 0x00d4ff, 0.7);
        hudPanels.moveTo(px, py);
        hudPanels.lineTo(px, py + ph);
        // Dark right edge (shadow)
        hudPanels.lineStyle(1, 0x020508, 0.6);
        hudPanels.moveTo(px + pw, py);
        hudPanels.lineTo(px + pw, py + ph);
        // Dark bottom edge (shadow)
        hudPanels.lineStyle(1, 0x020508, 0.6);
        hudPanels.moveTo(px, py + ph);
        hudPanels.lineTo(px + pw, py + ph);
      };

      // Helper: draw bar chart inside panel - BRIGHTER BARS
      const drawBarChart = (bx, by, chartW, chartH, barCount) => {
        for (let i = 0; i < barCount; i++) {
          const barH = chartH * (0.3 + Math.random() * 0.7);
          const barW = (chartW / barCount) * 0.7;
          const barX = bx + i * (chartW / barCount);
          const barY = by + chartH - barH;
          // Amber accent every 3rd bar - ALPHA 0.75
          if (i % 3 === 2) {
            hudPanels.beginFill(0xCC8800, 0.75);
          } else {
            hudPanels.beginFill(0x00d4ff, 0.55);
          }
          hudPanels.drawRect(barX, barY, barW, barH);
          hudPanels.endFill();
        }
      };

      // Helper: draw text readout lines
      const drawTextReadout = (tx, ty, lineW, lineCount) => {
        for (let i = 0; i < lineCount; i++) {
          const thisAlpha = 0.08 + Math.random() * 0.15;
          const thisW = lineW * (0.5 + Math.random() * 0.5);
          hudPanels.beginFill(0x00d4ff, thisAlpha);
          hudPanels.drawRect(tx, ty + i * 8, thisW, 2);
          hudPanels.endFill();
        }
      };

      // LEFT UPPER ZONE panels (between top rail and mid rail)
      drawBeveledPanel(w * 0.16, beamY - h * 0.24, 120, 55, 0.5);
      drawBarChart(w * 0.16 + 8, beamY - h * 0.24 + 8, 104, 40, 8);

      drawBeveledPanel(w * 0.16, beamY - h * 0.15, 100, 40, 0.5);
      drawBarChart(w * 0.16 + 6, beamY - h * 0.15 + 6, 88, 28, 6);

      drawBeveledPanel(w * 0.02, beamY - h * 0.14, 80, 30, 0.22);
      drawTextReadout(w * 0.02 + 6, beamY - h * 0.14 + 6, 68, 3);

      // LEFT LOWER ZONE panels (between mid rail and bottom rail)
      drawBeveledPanel(w * 0.02, beamY - h * 0.04, 90, 50, 0.55);
      drawTextReadout(w * 0.02 + 6, beamY - h * 0.04 + 8, 78, 5);

      drawBeveledPanel(w * 0.10, beamY + h * 0.02, 60, 35, 0.20);
      drawBeveledPanel(w * 0.02, beamY + h * 0.04, 70, 25, 0.18);

      // BELOW BEAM panels (below bottom rail)
      drawBeveledPanel(w * 0.02, beamY + h * 0.15, 100, 40, 0.22);
      drawBeveledPanel(w * 0.12, beamY + h * 0.18, 50, 50, 0.15);

      // Progress bar in lower left panel
      const progX = w * 0.02 + 8, progY = beamY + h * 0.15 + 12;
      for (let s = 0; s < 6; s++) {
        if (s < 3) {
          hudPanels.beginFill(0x00d4ff, 0.4);
        } else {
          hudPanels.beginFill(0x1a3050, 0.7);
        }
        hudPanels.drawRect(progX + s * 14, progY, 12, 6);
        hudPanels.endFill();
      }

      // RIGHT SIDE panels
      drawBeveledPanel(w * 0.80, beamY - h * 0.22, 100, 70, 0.22);
      drawBarChart(w * 0.80 + 8, beamY - h * 0.22 + 10, 84, 50, 7);

      drawBeveledPanel(w * 0.82, beamY - h * 0.08, 80, 40, 0.18);
      drawTextReadout(w * 0.82 + 6, beamY - h * 0.08 + 8, 68, 4);

      drawBeveledPanel(w * 0.85, beamY + h * 0.05, 60, 50, 0.20);
      drawBeveledPanel(w * 0.80, beamY + h * 0.14, 70, 35, 0.16);
      drawBeveledPanel(w * 0.88, beamY + h * 0.16, 55, 40, 0.15);

      hudPanels.alpha = 1;
      backgroundContainer.addChild(hudPanels);

      // =========================================================
      // LAYER 4: RADAR WITH BEZEL HOUSING
      // =========================================================
      const radar = new PIXI.Graphics();
      const radarCX = w * 0.07;
      const radarCY = beamY - h * 0.22;
      const radarR = Math.min(w, h) * 0.055;

      // Rectangular bezel housing (FILLED visible dark navy + bright edges)
      const bezelX = radarCX - radarR - 12;
      const bezelY = radarCY - radarR - 12;
      const bezelW = radarR * 2 + 24;
      const bezelH = radarR * 2 + 24;
      radar.beginFill(0x1a3050, 0.95);
      radar.drawRect(bezelX, bezelY, bezelW, bezelH);
      radar.endFill();
      // Bright top edge
      radar.lineStyle(1.5, 0x50a0c0, 0.7);
      radar.moveTo(bezelX, bezelY);
      radar.lineTo(bezelX + bezelW, bezelY);
      // Bright left edge
      radar.lineStyle(1.5, 0x50a0c0, 0.7);
      radar.moveTo(bezelX, bezelY);
      radar.lineTo(bezelX, bezelY + bezelH);
      // Dark right edge
      radar.lineStyle(1, 0x000508, 0.4);
      radar.moveTo(bezelX + bezelW, bezelY);
      radar.lineTo(bezelX + bezelW, bezelY + bezelH);
      // Dark bottom edge
      radar.moveTo(bezelX, bezelY + bezelH);
      radar.lineTo(bezelX + bezelW, bezelY + bezelH);

      // Screen area (emissive display fill - slightly brighter interior)
      radar.beginFill(0x122840, 0.96);
      radar.drawRect(radarCX - radarR - 4, radarCY - radarR - 4, radarR * 2 + 8, radarR * 2 + 8);
      radar.endFill();

      // Concentric rings
      radar.lineStyle(1, 0x00d4ff, 0.15);
      radar.drawCircle(radarCX, radarCY, radarR * 0.4);
      radar.drawCircle(radarCX, radarCY, radarR * 0.7);
      radar.drawCircle(radarCX, radarCY, radarR);

      // Crosshair
      radar.lineStyle(1, 0x00d4ff, 0.12);
      radar.moveTo(radarCX - radarR - 2, radarCY);
      radar.lineTo(radarCX + radarR + 2, radarCY);
      radar.moveTo(radarCX, radarCY - radarR - 2);
      radar.lineTo(radarCX, radarCY + radarR + 2);

      // Center dot
      radar.beginFill(0x00d4ff, 0.5);
      radar.drawCircle(radarCX, radarCY, 3);
      radar.endFill();

      // Sweep indicator (bright dot on ring)
      radar.beginFill(0x00ffff, 0.6);
      radar.drawCircle(radarCX + radarR * 0.5, radarCY - radarR * 0.3, 2);
      radar.endFill();

      radar.alpha = 1;
      backgroundContainer.addChild(radar);

      // =========================================================
      // LAYER 5: CHEVRON BRACKETS (angled metal elements, lower-left)
      // =========================================================
      const chevrons = new PIXI.Graphics();

      const drawChevron = (cx, cy, chevW, chevH) => {
        // FILLED dark body (visible dark navy, opaque) - 0x1e3850 same as rails
        chevrons.beginFill(0x1e3850, 0.92);
        chevrons.drawPolygon([
          cx, cy,                      // left point (arrow tip)
          cx + chevW, cy - chevH / 2,  // top right
          cx + chevW, cy + chevH / 2   // bottom right
        ]);
        chevrons.endFill();
        // Bright leading edge (top edge - specular highlight) - ALPHA 0.8
        chevrons.lineStyle(2, 0x4a90b0, 0.8);
        chevrons.moveTo(cx, cy);
        chevrons.lineTo(cx + chevW, cy - chevH / 2);
        // Dark trailing edge (bottom edge - shadow)
        chevrons.lineStyle(1, 0x060c14, 0.6);
        chevrons.moveTo(cx, cy);
        chevrons.lineTo(cx + chevW, cy + chevH / 2);
      };

      // CHEVRONS 2X LARGER: width 70-90px, height 24px, spacing 30px
      drawChevron(w * 0.04, beamY + h * 0.26, 80, 24);
      drawChevron(w * 0.04, beamY + h * 0.30, 70, 24);
      drawChevron(w * 0.04, beamY + h * 0.34, 90, 24);

      chevrons.alpha = 1;
      backgroundContainer.addChild(chevrons);

      // =========================================================
      // LAYER 6: FLOOR REFLECTION (BRIGHTER mirrored glow below beam)
      // =========================================================
      const floorReflection = new PIXI.Graphics();

      // Primary reflection band - DOUBLED alpha
      floorReflection.beginFill(0x00d4ff, 0.06);
      floorReflection.drawRect(0, beamY + 25, w, 25);
      floorReflection.endFill();

      // Secondary softer reflection - TRIPLED alpha
      floorReflection.beginFill(0x0a2540, 0.05);
      floorReflection.drawRect(0, beamY + 50, w, 50);
      floorReflection.endFill();

      // Specular floor dots - BRIGHTER and more
      for (var fdi = 0; fdi < 8; fdi++) {
        floorReflection.beginFill(0x00d4ff, 0.12 + Math.random() * 0.15);
        floorReflection.drawCircle(w * 0.1 + Math.random() * w * 0.8, beamY + 35 + Math.random() * 70, 1.5 + Math.random() * 1.5);
        floorReflection.endFill();
      }

      floorReflection.alpha = 1;
      backgroundContainer.addChild(floorReflection);

      // =========================================================
      // LAYER 7: HORIZONTAL INTERFERENCE LINES (subtle, NORMAL blend)
      // =========================================================
      const interferenceLines = new PIXI.Graphics();
      for (let i = 0; i < 5; i++) {
        const lineY = Math.random() * h;
        interferenceLines.beginFill(0x00d4ff, 0.03 + Math.random() * 0.03);
        interferenceLines.drawRect(0, lineY, w, 1);
        interferenceLines.endFill();
      }
      interferenceLines.alpha = 1;
      backgroundContainer.addChild(interferenceLines);

      // Container starts invisible, will fade in via animation
      backgroundContainer.alpha = 0;

      // =========================================================
      // LAYER 8: DORMANT BEAM (full width, low intensity, FIXED Y)
      // =========================================================
      // beamY defined earlier in background section
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
      // LAYER 9: ACTIVATED BEAM WITH MASK (revealed by hotspot sweep)
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
      // LAYER 10: HOTSPOT (sweeps left to right along the beam)
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
      // LAYER 11: SECONDARY NODES (flash as hotspot passes)
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
      // LAYER 12: DRIP PARTICLES (digital rain, activated by hotspot X)
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
      // LAYER 13: FILTERS
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

      // Add atmospheric effects (glow, particle rain, floor reflection, density panels)
      this._addScanSweepAtmosphere(beamContainer, backgroundContainer, w, h, beamY, timeline);

      // Add visible floor surface (MUST be in backgroundContainer for NORMAL blend, not ADD)
      this._addScanSweepFloor(backgroundContainer, w, h, beamY, timeline);

      // =========================================================
      // GSAP TIMELINE ANIMATIONS
      // =========================================================

      // --- 0.0s - 0.3s: FADE IN BACKGROUND (container handles all children) ---
      timeline.to(backgroundContainer, { alpha: 1.0, duration: 0.3, ease: 'power2.out' }, 0);

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
      timeline.to(structuralRails, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(hudPanels, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(radar, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(chevrons, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
      timeline.to(floorReflection, { alpha: 0, duration: 0.4, ease: 'power2.in' }, 1.6);
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
   * Add atmospheric effects to Scan Sweep: glow bands, particle rain, floor reflection, extra panels
   */
  _addScanSweepAtmosphere(beamContainer, backgroundContainer, w, h, beamY, timeline) {
    // === ATMOSPHERIC GLOW — goes in beamContainer (ADD blend + bloom) ===
    var atmoGlow = new PIXI.Graphics();

    // Wide soft haze band (160px tall, centered on beam)
    atmoGlow.beginFill(0x006688, 0.06);
    atmoGlow.drawRect(0, beamY - 80, w, 160);
    atmoGlow.endFill();

    // Medium glow band (80px tall)
    atmoGlow.beginFill(0x0088aa, 0.08);
    atmoGlow.drawRect(0, beamY - 40, w, 80);
    atmoGlow.endFill();

    // Narrow bright core band (20px tall)
    atmoGlow.beginFill(0x00aacc, 0.12);
    atmoGlow.drawRect(0, beamY - 10, w, 20);
    atmoGlow.endFill();

    // Vertical glow column at center (where hotspot passes)
    atmoGlow.beginFill(0x005577, 0.04);
    atmoGlow.drawRect(w * 0.35, beamY - 150, w * 0.30, 300);
    atmoGlow.endFill();

    atmoGlow.alpha = 0;
    beamContainer.addChild(atmoGlow);

    // Fade in atmospheric glow
    timeline.to(atmoGlow, { alpha: 1, duration: 0.5, ease: 'power2.out' }, 0.1);

    // === PARTICLE RAIN — hundreds of tiny vertical streaks falling from beam ===
    var particleRain = new PIXI.Graphics();

    // 120 particles spread across the width, concentrated near center
    for (var pi = 0; pi < 120; pi++) {
      // Gaussian-ish distribution: more particles near center
      var px = w * 0.1 + Math.random() * w * 0.8;
      var centerDist = Math.abs(px - w * 0.5) / (w * 0.5);
      if (Math.random() < centerDist * 0.6) continue; // skip more particles far from center

      var rainLen = 8 + Math.random() * 35;  // 8-43px tall streaks
      var rainY = beamY + 5 + Math.random() * (h * 0.45);  // below beam down to lower area
      var rainAlpha = 0.15 + Math.random() * 0.45;  // 0.15 - 0.60
      var rainW = 1 + Math.random() * 1.5;  // 1-2.5px wide

      particleRain.beginFill(0x00ccff, rainAlpha);
      particleRain.drawRect(px, rainY, rainW, rainLen);
      particleRain.endFill();
    }

    // A few amber particles for color variety (matching reference amber accents)
    for (var ai = 0; ai < 8; ai++) {
      var ax = w * 0.05 + Math.random() * w * 0.35;  // left side only (near equipment)
      var ay = beamY + 10 + Math.random() * (h * 0.3);
      particleRain.beginFill(0xCC8800, 0.2 + Math.random() * 0.3);
      particleRain.drawCircle(ax, ay, 1 + Math.random() * 1.5);
      particleRain.endFill();
    }

    particleRain.alpha = 0;
    beamContainer.addChild(particleRain);

    // Fade in particles
    timeline.to(particleRain, { alpha: 1, duration: 0.6, ease: 'power2.out' }, 0.2);

    // === FLOOR REFLECTION — visible reflective surface in bottom portion ===
    var floorReflect = new PIXI.Graphics();

    // Bright beam reflection line
    floorReflect.beginFill(0x00bbdd, 0.07);
    floorReflect.drawRect(0, beamY + 30, w, 4);
    floorReflect.endFill();

    // Primary reflection gradient band
    floorReflect.beginFill(0x00aacc, 0.05);
    floorReflect.drawRect(0, beamY + 34, w, 30);
    floorReflect.endFill();

    // Secondary softer reflection
    floorReflect.beginFill(0x004466, 0.04);
    floorReflect.drawRect(0, beamY + 64, w, 50);
    floorReflect.endFill();

    // Tertiary very soft floor wash
    floorReflect.beginFill(0x0a1e30, 0.03);
    floorReflect.drawRect(0, beamY + 114, w, h - beamY - 114);
    floorReflect.endFill();

    // 15 bright specular dots on floor
    for (var fi = 0; fi < 15; fi++) {
      var fx = w * 0.05 + Math.random() * w * 0.9;
      var fy = beamY + 35 + Math.random() * 120;
      var fBright = 0.08 + Math.random() * 0.20;
      var fRad = 1 + Math.random() * 2.5;
      floorReflect.beginFill(0x00ccff, fBright);
      floorReflect.drawCircle(fx, fy, fRad);
      floorReflect.endFill();
    }

    floorReflect.alpha = 0;
    beamContainer.addChild(floorReflect);

    // Fade in floor reflection
    timeline.to(floorReflect, { alpha: 1, duration: 0.4, ease: 'power2.out' }, 0.15);

    // === EXTRA DENSITY — small panels added to backgroundContainer ===
    var extraPanels = new PIXI.Graphics();

    // 12 small filler panels in gaps between existing panels
    var smallPanels = [
      [w*0.15, beamY-h*0.35, w*0.14, h*0.025],
      [w*0.01, beamY-h*0.04, w*0.28, h*0.022],
      [w*0.15, beamY+h*0.04, w*0.08, h*0.04],
      [w*0.01, beamY+h*0.16, w*0.10, h*0.025],
      [w*0.01, beamY+h*0.20, w*0.08, h*0.025],
      [w*0.12, beamY+h*0.08, w*0.06, h*0.03],
      [w*0.80, beamY-h*0.08, w*0.18, h*0.03],
      [w*0.85, beamY+h*0.08, w*0.12, h*0.025],
      [w*0.82, beamY+h*0.15, w*0.10, h*0.04],
      [w*0.32, beamY+h*0.04, w*0.36, h*0.05],
      [w*0.35, beamY+h*0.11, w*0.30, h*0.04],
      [w*0.02, beamY-h*0.12, w*0.06, h*0.03]
    ];

    for (var spi = 0; spi < smallPanels.length; spi++) {
      var sp = smallPanels[spi];
      extraPanels.beginFill(0x1a3050, 0.85);
      extraPanels.drawRect(sp[0], sp[1], sp[2], sp[3]);
      extraPanels.endFill();
      // Top edge highlight
      extraPanels.lineStyle(1, 0x00d4ff, 0.5);
      extraPanels.moveTo(sp[0], sp[1]);
      extraPanels.lineTo(sp[0] + sp[2], sp[1]);
      extraPanels.lineStyle(0);
    }

    // Data readout lines inside some panels
    for (var dri = 0; dri < 8; dri++) {
      var drX = w*0.33 + Math.random() * w*0.34;
      var drY = beamY + h*0.05 + dri * 6;
      var drW = w*0.04 + Math.random() * w*0.14;
      extraPanels.beginFill(0x00d4ff, 0.06 + Math.random() * 0.10);
      extraPanels.drawRect(drX, drY, drW, 1.5);
      extraPanels.endFill();
    }

    // Progress bar
    for (var pbi = 0; pbi < 8; pbi++) {
      var pbFilled = pbi < 5;
      extraPanels.beginFill(pbFilled ? 0x00d4ff : 0x0a1520, pbFilled ? 0.45 : 0.2);
      extraPanels.drawRect(w*0.02 + pbi * 13, beamY + h*0.17, 9, 5);
      extraPanels.endFill();
    }

    // Amber indicator dots
    var amberDots = [[w*0.12,beamY-h*0.15],[w*0.25,beamY-h*0.10],[w*0.08,beamY+h*0.09],[w*0.22,beamY+h*0.05]];
    for (var adi = 0; adi < amberDots.length; adi++) {
      extraPanels.beginFill(0xCC8800, 0.5);
      extraPanels.drawCircle(amberDots[adi][0], amberDots[adi][1], 2);
      extraPanels.endFill();
    }

    extraPanels.alpha = 0;
    backgroundContainer.addChild(extraPanels);

    // Fade in extra panels with background
    timeline.to(extraPanels, { alpha: 1, duration: 0.3, ease: 'power2.out' }, 0);
  }

  /**
   * Add visible floor surface to Scan Sweep — MUST be in backgroundContainer (NORMAL blend)
   * NOT beamContainer — ADD blend makes dark fills invisible
   */
  _addScanSweepFloor(backgroundContainer, w, h, beamY, timeline) {
    // =====================================================
    // FLOOR SURFACE — in backgroundContainer (NORMAL blend)
    // NOT beamContainer — ADD blend makes dark fills invisible
    // =====================================================
    var floorSurface = new PIXI.Graphics();

    // LAYER 1: Full floor base surface — covers bottom 40% of screen
    // This is the "polished dark floor" that makes it feel like a room
    // Color 0x0c1820 = RGB(12, 24, 32) — dark teal, NOT black
    // Alpha 0.55 — high enough to clearly differentiate from pure black background
    var floorTop = beamY + 25;
    var floorH = h - floorTop;
    floorSurface.beginFill(0x0c1820, 0.55);
    floorSurface.drawRect(0, floorTop, w, floorH);
    floorSurface.endFill();

    // LAYER 2: Brighter gradient band near beam (beam illuminates nearby floor)
    // Gradient faked with 3 stacked rects of decreasing alpha
    floorSurface.beginFill(0x142838, 0.40);
    floorSurface.drawRect(0, floorTop, w, 40);
    floorSurface.endFill();

    floorSurface.beginFill(0x102030, 0.25);
    floorSurface.drawRect(0, floorTop + 40, w, 50);
    floorSurface.endFill();

    // LAYER 3: Bright beam reflection line (mirror of scan beam)
    // This is the most visible element — a bright horizontal line on the floor
    floorSurface.beginFill(0x00ccee, 0.18);
    floorSurface.drawRect(0, floorTop + 5, w, 3);
    floorSurface.endFill();

    // Secondary dimmer reflection line
    floorSurface.beginFill(0x008899, 0.10);
    floorSurface.drawRect(0, floorTop + 12, w, 2);
    floorSurface.endFill();

    // LAYER 4: Specular highlights — bright dots scattered on floor
    // These are points where the polished floor catches direct light
    var specPositions = [
      [w * 0.15, floorTop + 20, 2.5, 0.25],
      [w * 0.30, floorTop + 35, 2.0, 0.20],
      [w * 0.45, floorTop + 15, 3.0, 0.30],
      [w * 0.55, floorTop + 25, 2.5, 0.22],
      [w * 0.65, floorTop + 40, 2.0, 0.18],
      [w * 0.75, floorTop + 18, 2.5, 0.25],
      [w * 0.85, floorTop + 30, 2.0, 0.20],
      [w * 0.20, floorTop + 55, 1.5, 0.15],
      [w * 0.40, floorTop + 65, 1.5, 0.12],
      [w * 0.60, floorTop + 50, 2.0, 0.18],
      [w * 0.80, floorTop + 60, 1.5, 0.14],
      [w * 0.50, floorTop + 10, 3.5, 0.35],
      [w * 0.10, floorTop + 45, 1.5, 0.12],
      [w * 0.90, floorTop + 22, 2.0, 0.20],
      [w * 0.35, floorTop + 8, 2.0, 0.28]
    ];
    for (var si = 0; si < specPositions.length; si++) {
      var sp = specPositions[si];
      floorSurface.beginFill(0x00ddff, sp[3]);
      floorSurface.drawCircle(sp[0], sp[1], sp[2]);
      floorSurface.endFill();
    }

    // LAYER 5: Reflected particle streaks on floor (mirror of rain above)
    // Shorter and dimmer than the actual particles
    for (var rpi = 0; rpi < 30; rpi++) {
      var rpx = w * 0.1 + Math.random() * w * 0.8;
      var rpy = floorTop + 15 + Math.random() * 100;
      var rpLen = 5 + Math.random() * 15;
      var rpAlpha = 0.06 + Math.random() * 0.12;
      floorSurface.beginFill(0x00aacc, rpAlpha);
      floorSurface.drawRect(rpx, rpy, 1.5, rpLen);
      floorSurface.endFill();
    }

    // LAYER 6: Subtle horizontal lines suggesting floor surface texture
    for (var fli = 0; fli < 5; fli++) {
      var fly = floorTop + 30 + fli * 25;
      floorSurface.beginFill(0x00aacc, 0.03);
      floorSurface.drawRect(0, fly, w, 1);
      floorSurface.endFill();
    }

    // Start invisible, fade in
    floorSurface.alpha = 0;

    // CRITICAL: Add to backgroundContainer (NORMAL blend), NOT beamContainer (ADD blend)
    backgroundContainer.addChild(floorSurface);

    // Fade in with background
    timeline.to(floorSurface, { alpha: 1, duration: 0.4, ease: 'power2.out' }, 0.1);
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
   * Play Black Widow glitch transition — crimson/black security breach effect
   * Called independently for Widow intro, never through random transition pool
   * @param {function} callback - Callback when transition ends
   */
  playWidowGlitch(callback) {
    // Guard against double-triggers
    if (this.isPlaying) {
      console.warn('[TransitionEngine] Transition already playing, ignoring Widow glitch request');
      return;
    }

    // Validate DOM
    if (!this.overlay || !this.content) {
      console.error('[TransitionEngine] Cannot play Widow glitch: DOM elements missing');
      if (callback) callback();
      return;
    }

    this.isPlaying = true;
    console.log('[TransitionEngine] Playing Widow glitch');

    // Build GSAP timeline
    const timeline = gsap.timeline({ paused: true });

    // Step 1: Activate overlay
    timeline.call(() => { this.overlay.classList.add('active'); }, null, 0);

    // Step 2: Fade in overlay
    timeline.to(this.overlay, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.in'
    }, 0);

    // Initialize PixiJS canvas
    if (window.pixiEffectManager) {
      window.pixiEffectManager.init(this.content);
    }

    // Build Widow glitch content
    this._buildWidowGlitch(timeline);

    // Step 3: Fade out overlay (after glitch animation ~2.5s)
    timeline.to(this.overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 2.6);

    // Step 4: Cleanup
    timeline.call(() => {
      this.overlay.classList.remove('active');
      gsap.set(this.overlay, { clearProps: 'opacity' });

      if (window.pixiEffectManager) {
        window.pixiEffectManager.reset();
      }

      this.content.innerHTML = '';
      this.isPlaying = false;
      this.activeTimeline = null;

      console.log('[TransitionEngine] Widow glitch complete');

      if (callback) callback();
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
