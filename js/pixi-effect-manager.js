/**
 * pixi-effect-manager.js - PixiJS Effect Manager for Iron Man STEM Mission
 *
 * Manages a single persistent PIXI.Application instance for transition effects.
 * Uses the "single-instance-with-reset" pattern to avoid WebGL context exhaustion
 * across 10+ transitions in a game session.
 *
 * Reference: Iron_Man_STEM_Mission_Project_Brief_v3.md, Phase 2.5
 * Reference: claude_PixiJS_markdown_file.md — Memory Management section
 *
 * KEY ARCHITECTURE:
 * - ONE PIXI.Application created on first transition, reused for all subsequent
 * - Between transitions, stage children are cleared (NOT app destroyed)
 * - PixiJS ticker is STOPPED; rendering driven through GSAP ticker
 * - Canvas is TRANSPARENT (backgroundAlpha: 0) and behind DOM elements
 */

// === TOP-LEVEL REGISTRATION ===
// Register GSAP PixiPlugin with both GSAP and PIXI immediately when script loads
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

/**
 * PixiEffectManager - Singleton class managing a persistent PIXI.Application
 */
class PixiEffectManager {
  constructor() {
    this.app = null;                  // The single PIXI.Application instance
    this.gsapTickerCallback = null;   // Reference to GSAP ticker callback for cleanup
    this.initialized = false;         // Whether init() has been called
  }

  /**
   * Initialize the PixiJS application inside a container element.
   * Idempotent - safe to call multiple times.
   * @param {HTMLElement} containerElement - The DOM element to append the canvas to
   */
  init(containerElement) {
    // If already initialized AND canvas is still in container, do nothing
    if (this.initialized && this.app && containerElement.contains(this.app.view)) {
      return;
    }

    // If already initialized BUT canvas was removed (e.g., innerHTML cleared),
    // re-append the existing canvas
    if (this.initialized && this.app && !containerElement.contains(this.app.view)) {
      containerElement.appendChild(this.app.view);
      return;
    }

    // First-time initialization
    if (!this.initialized) {
      // Create new PIXI.Application with transparent background
      this.app = new PIXI.Application({
        width: containerElement.clientWidth,
        height: containerElement.clientHeight,
        backgroundAlpha: 0,                    // TRANSPARENT - locked at context creation
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
        clearBeforeRender: true
      });

      // Style the canvas element for proper positioning
      this.app.view.style.position = 'absolute';
      this.app.view.style.top = '0';
      this.app.view.style.left = '0';
      this.app.view.style.width = '100%';
      this.app.view.style.height = '100%';
      this.app.view.style.zIndex = '1';        // Behind DOM text (z-index 2+)
      this.app.view.style.pointerEvents = 'none';

      // Append canvas to container
      containerElement.appendChild(this.app.view);

      // CRITICAL TICKER SETUP: Stop PixiJS ticker, drive rendering through GSAP
      this.app.ticker.stop();
      this.gsapTickerCallback = () => {
        this.app.renderer.render(this.app.stage);
      };
      gsap.ticker.add(this.gsapTickerCallback);

      this.initialized = true;
      console.log('[PixiEffectManager] Initialized (PixiJS ' + PIXI.VERSION + ')');
    }
  }

  /**
   * Reset the stage by destroying all children.
   * Called at the end of each transition before DOM is cleared.
   */
  reset() {
    if (!this.initialized || !this.app) {
      return;
    }

    // Kill ALL GSAP tweens targeting any stage children
    for (let i = 0; i < this.app.stage.children.length; i++) {
      gsap.killTweensOf(this.app.stage.children[i]);
    }

    // Destroy all stage children
    // texture: false preserves shared textures for reuse across transitions
    while (this.app.stage.children.length > 0) {
      const child = this.app.stage.children[0];
      child.destroy({ children: true, texture: false });
    }

    console.log('[PixiEffectManager] Stage reset');
  }

  /**
   * Get the PIXI.Application instance
   * @returns {PIXI.Application|null}
   */
  getApp() {
    return this.app;
  }

  /**
   * Get the stage container
   * @returns {PIXI.Container|null}
   */
  getStage() {
    return this.app ? this.app.stage : null;
  }

  /**
   * Get the actual CSS pixel width of the renderer
   * @returns {number}
   */
  getWidth() {
    if (!this.app) return 0;
    return this.app.renderer.width / this.app.renderer.resolution;
  }

  /**
   * Get the actual CSS pixel height of the renderer
   * @returns {number}
   */
  getHeight() {
    if (!this.app) return 0;
    return this.app.renderer.height / this.app.renderer.resolution;
  }

  /**
   * Resize the renderer
   * @param {number} width - New width in CSS pixels
   * @param {number} height - New height in CSS pixels
   */
  resize(width, height) {
    if (!this.initialized || !this.app) {
      return;
    }
    this.app.renderer.resize(width, height);
  }

  /**
   * Full destroy - only call when completely done with PixiJS
   * (e.g., page unload). Normally use reset() between transitions.
   */
  destroy() {
    if (!this.initialized || !this.app) {
      return;
    }

    // Remove GSAP ticker callback
    if (this.gsapTickerCallback) {
      gsap.ticker.remove(this.gsapTickerCallback);
      this.gsapTickerCallback = null;
    }

    // Kill all tweens on all stage children
    for (let i = 0; i < this.app.stage.children.length; i++) {
      gsap.killTweensOf(this.app.stage.children[i]);
    }

    // Full destroy with all resources
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });

    this.app = null;
    this.initialized = false;

    console.log('[PixiEffectManager] Destroyed');
  }
}

// === GLOBAL SINGLETON ===
window.pixiEffectManager = new PixiEffectManager();
