# Iron Man STEM Mission - Complete Project Brief v3.7

**Version:** 3.7  
**Last Updated:** February 12, 2026  
**Status:** Active Development -- Phase 3 COMPLETE, Phase 4 Next

**v3.7 Changes:** Phase 3 Sound Integration complete (all 23 sounds wired). Updated hint system: Jarvis gives text hint on 1st wrong answer, Widow appears deterministically on 2nd wrong (no coin flip). Removed ambient arc-reactor-hum loop (file retained, calls removed). Added two-tier transition sound architecture (breach-complete base + type-specific accent). Added typeof soundManager guard pattern to Claude Code Guidelines. Replaced ui-hover.wav and ui-click.wav with cleaner files. Added JARVIS_GENERIC_HINTS placeholder array in app.js. Updated CONFIG constants to match implemented values. Updated Phase 3 checklist to DONE.

**v3.5 Changes:** Fixed firewall listing contradiction (all 10 firewalls are math, science questions inserted AFTER FW 3/6/9 -- not replacing them), added transitions to Correct Answer Flow, added explicit Fury interruption sequence with transition timing, added Sound Key Reference Table, added Script Load Order table, expanded Sound -> Event Mapping to cover all 23 files, added 1920x1080 display resolution, added Replit deployment platform. Ambiguity fixes: replaced shorthand sound key aliases with real kebab-case keys in API examples, added inline comment to totalFirewalls clarifying math-only count, added note that no transition plays before victory sequence, added transition->sound mapping caveat

**v3.6 Changes:** Moved Audio-Visual Sync Architecture from Section 2 to Phase 6 (requires audio to exist), updated transition count from 8 to 6 (dropped Progress Bar Surge and Shatter Effect), updated Phase 2.5 Step 3 to reflect 6 completed PixiJS transitions with Fury SHIELD animation and Black Widow overlay as remaining TODO items, added audio-visual sync to Phase 6 build checklist, fixed Phase Summary Table to remove A/V sync from Phase 2.5 testable column

**v3.4 Changes:** Fixed .mp3 -> .wav in LESSON_PACK example code, added firewall-sequence.js documentation subsection (window.transitionEngine global, playTransition(callback) signature, destroy() method), added .im-transition-* to Complications table namespace listing, updated Phase 2.5 Step 1 namespace listing to show all 4 families, added GSAP className bug warning to Claude Code Guidelines

**v3.3 Changes:** Fixed sound-manager.js documentation (27 sounds -> 23, removed 4 phantom file references), added hud-config.js and im-animations.css to Implementation Files, added Phase 2.5 Implementation Files subsection

**v3.2 Changes:** Added PixiJS 7.4.2 GPU-accelerated effects architecture, PixiEffectManager singleton pattern, updated Visual Resource Tiers (PixiJS promoted from Tier 4 Skip -> Tier 1 Must-Have), updated Phase 2.5 build status to reflect completed transition engine + PixiJS foundation, added pixi-effect-manager.js to implementation files

**v3.1 Changes:** Added Pre-Generation Paradigm, Three-Layer Response System, Dynamic Mode, Benchmark Tracking, Cartesia API integration details

---

## Table of Contents
1. [Project Overview](#1-project-overview)
   - [Pre-Generation Paradigm](#-the-pre-generation-paradigm-critical-architecture-insight) [CRITICAL]
   - [Three-Layer Response System](#-three-layer-response-system-core-architecture) [CRITICAL]
   - [Dynamic Mode Details](#dynamic-mode-details)
   - [Benchmark Tracking](#benchmark-tracking--new) [NEW]
2. [Technical Architecture](#2-technical-architecture)
   - [PixiJS GPU Effects Architecture](#pixijs-gpu-effects-architecture--v32) [NEW]
3. [Mission Narrative](#3-mission-narrative)
4. [Mission Structure](#4-mission-structure)
5. [Visual Design](#5-visual-design)
6. [Pattern Detection System](#6-pattern-detection-system) [NEW]
7. [AI Problem Generation](#7-ai-problem-generation) [NEW]
8. [Mission Integration Architecture](#8-mission-integration-architecture) [NEW]
9. [Response Bank Reference](#9-response-bank-reference)
10. [Audio Architecture](#10-audio-architecture)
11. [Teacher Controls](#11-teacher-controls)
12. [Configuration Constants](#12-configuration-constants) [NEW]
13. [Implementation Files](#13-implementation-files) [NEW]
14. [Build Phases](#14-build-phases)
15. [Claude Code Guidelines](#15-claude-code-guidelines)

---

## 1. Project Overview

An immersive, AI-powered classroom experience where the teacher (dressed as Iron Man/Tony Stark) leads elementary students through a "hacking mission" to retrieve stolen arc reactor blueprints from S.H.I.E.L.D.'s mainframe. Students solve TEKS-aligned math problems to break through firewalls, with an AI-powered Jarvis providing dynamic responses, hints, and banter.

**Philosophy:** Walt Disney approach -- entertain first, educate second. This should feel like students are IN the Marvel universe, not watching a PowerPoint.

**Target Audience:** Grades 1-5 (grade selected at mission start)

**Runtime:** 30-45 minutes per mission

**Hardware:** Surface Laptop 5 (12th Gen i7, 16GB RAM), single screen display to TV via HDMI (1920x1080), Bluetooth earpiece mic with mute button

**Deployment:** Replit (preferred) -- zero-setup browser-based hosting. App runs on teacher's laptop, not student Chromebooks. No local installation required.

### Core Design Principles

1. **Entertainment First** -- Every element should feel like a Marvel movie scene
2. **Teacher Controls Everything** -- Students don't interact directly with the system; the teacher inputs all answers
3. **Pre-Record Everything Possible** -- Minimize real-time API calls for speed and reliability
4. **Questions Generated at Session Start** -- AI generates all 10 math problems + 3 science questions BEFORE the mission begins
5. **Pattern Detection is Diagnostic** -- ~90% of student errors follow identifiable patterns (research-validated)
6. **Human-in-the-Loop** -- Teacher verifies AI-generated problems before class, solving accuracy concerns

---

### * THE PRE-GENERATION PARADIGM (Critical Architecture Insight)

**This changes everything about how the system works.**

Problems are generated BEFORE the lesson -- even just 10 minutes before while you're setting up the room. This fundamentally transforms the architecture:

| Aspect | Real-Time Generation | Pre-Generation (Our Approach) |
|--------|---------------------|-------------------------------|
| **Speed** | Critical -- must be <500ms | Irrelevant -- can take 30-60 seconds |
| **Model Size** | Small/fast models only | Can use large, smart models (Llama 3.3 70B Versatile via Groq) |
| **Accuracy** | Risk of LLM math errors | Teacher reviews and verifies every problem |
| **Audio** | Must synthesize in real-time | Pre-synthesize everything with Cartesia |
| **During Lesson** | Requires API calls + internet | ZERO API calls, works completely offline |
| **Reliability** | Depends on API uptime | 100% -- everything cached locally |

**The Flow:**
```
PRE-LESSON (5-15 minutes before class):
+--------------------------------------------------------------------------+
| 1. Teacher selects grade + TEKS checkboxes                               |
| 2. Click "Generate Mission"                                              |
| 3. Groq (Llama 3.3 70B Versatile) generates problems (10-30 seconds)    |
| 4. Problems display on screen for teacher review                         |
| 5. Teacher can "Regenerate" any problem that looks wrong                 |
| 6. Click "Approve & Synthesize"                                          |
| 7. Cartesia API synthesizes all problem-specific audio (30-60 seconds)   |
| 8. Everything cached locally. System shows "Mission Ready"               |
+--------------------------------------------------------------------------+

DURING LESSON:
+--------------------------------------------------------------------------+
| * ZERO API calls required                                                |
| * All audio plays from local cache instantly                             |
| * Runs even if WiFi drops                                                |
| * System tracks current problem, plays appropriate pre-cached audio      |
+--------------------------------------------------------------------------+
```

**Why This Matters:**
- Teacher catches any math errors BEFORE students see them
- No "Loading..." or delays during the mission -- instant feedback
- School WiFi issues won't break the experience
- Uses the smartest available AI models (quality > speed)

---

### * THREE-LAYER RESPONSE SYSTEM (Core Architecture)

When a student submits a wrong answer, the system responds in layers. **To kids, it FEELS like intelligent real-time analysis. In reality, it's pattern matching with pre-recorded audio.**

```
WRONG ANSWER SUBMITTED
         |
         v
+-------------------------------------------------------------+
|  LAYER 1: Generic Wrong Answer Response (INSTANT)           |
|  ---------------------------------------------------------  |
|  Plays immediately from response bank:                      |
|  "That code was rejected. Perhaps we should recalculate."   |
|  Source: Pre-recorded WAV file                              |
|  Latency: 0ms                                               |
+-------------------------------------------------------------+
         |
         v
+-------------------------------------------------------------+
|  LAYER 2: Pattern-Based Intelligent Hint (INSTANT)          |
|  ---------------------------------------------------------  |
|  JavaScript analyzes: correct=135, submitted=125            |
|  Detects: OFF_BY_TEN (difference of 10)                     |
|  Plays: "Check your tens place. Something shifted."         |
|  Source: Pre-recorded WAV file (pattern-specific)           |
|  Latency: 0ms                                               |
|  Note: If no pattern detected, plays generic fallback hint  |
+-------------------------------------------------------------+
         |
         v
+-------------------------------------------------------------+
|  LAYER 3: Dynamic Mode (OPTIONAL, ~1 second delay)          |
|  ---------------------------------------------------------  |
|  ONLY triggered when teacher says: "Jarvis, analyze this"   |
|  Chain: Web Speech API -> Groq -> Cartesia                |
|  Jarvis gives truly custom explanation of the problem       |
|  Latency: 700-1500ms (feels like "processing")              |
|  Fallback: "Experiencing interference, sir" + text input    |
+-------------------------------------------------------------+
```

**Why Three Layers:**
- **95%+ of interactions are Layer 1 + Layer 2** -- instant, reliable, no API
- **Layer 3 is for showing off** -- ad-lib moments, deeper explanations, special situations
- To students, Jarvis appears to understand their exact mistake in real-time
- The intelligence is in the JavaScript pattern detection, not real-time AI

---

### Dynamic Mode Details

**Trigger Phrase:** `"Jarvis, analyze this"`

This phrase is intentionally distinct from all other triggers in the response bank.

**Timing Chain:**
```
Teacher says "Jarvis, analyze this"
         |
         v Web Speech API (~200-500ms)
Teacher's speech -> text
         |
         v Groq API (~300-500ms)
Context + problem + wrong answer -> analysis text
         |
         v Cartesia API (~200-300ms to start streaming)
Text -> Jarvis voice audio begins playing
         |
         v
TOTAL: ~700-1500ms before Jarvis starts speaking
```

**This delay actually works:** Feels like Jarvis is "analyzing" the problem before responding. Fits the character.

**Fallback Strategy:**
- If API call fails -> Play pre-recorded: "I'm experiencing some interference, sir. Perhaps you could explain?"
- Display text input field on screen as backup
- Teacher can type the explanation/command manually
- System processes typed input same as spoken

---

### Benchmark Tracking [NEW]

Track session data for educator review and portfolio documentation.

**Data Captured:**
| Field | Description |
|-------|-------------|
| `gradeLevel` | Selected grade (1-5) |
| `teksStandards` | Array of TEKS codes tested |
| `problems[]` | For each problem: question, correct answer, student answers, attempts, time spent |
| `scienceQuestions[]` | Same structure as math problems |
| `patternHintsTriggered[]` | Which pattern-based hints played and when |
| `finalSuccessRate` | Percentage of problems solved correctly on first attempt |
| `totalMissionTime` | Time from start to completion |
| `firewallsBreached` | Count of firewalls completed |

**Export Format (v1):** Downloadable JSON/CSV file
- Click "Save Mission Report" after mission completes
- Downloads `mission-report-2026-01-31.json` (or `.csv`)
- Can be imported into spreadsheets for analysis

**Future (v2):** Cloud storage integration (Google Sheets API) for cross-session analytics

---

## 2. Technical Architecture

### Components

**1. Web App (HTML/CSS/JavaScript)**
- Runs in browser (Chrome/Edge)
- Displays all visuals: Jarvis holographic interface, decryption puzzles, progress bar, effects
- Handles pre-recorded audio playback
- Manages mission state and flow
- Saves progress to localStorage
- Handles pattern detection client-side
- Uses **GSAP** (GreenSock Animation Platform) for cinematic MCU-level animations
- Uses **PixiJS 7.4.2** for GPU-accelerated visual effects (bloom, god rays, particles, RGB split) -- see [PixiJS Architecture](#pixijs-gpu-effects-architecture--v32)
- Uses **Augmented-UI** CSS framework for sci-fi panel styling

**2. AI Backend (Groq API via Cloudflare Worker)**
- **Groq** for problem generation during pre-lesson setup, accessed via Cloudflare Worker proxy (https://ironman-api.shanewaldrop123.workers.dev) to handle CORS for file:// origins
- **Model:** Llama 3.3 70B Versatile — selected for highest instruction-following score (IFEval 92.1) per deep research analysis. For K-5 problem generation, controllability > raw capability.
- Generates 10 math problems + 3 science questions per mission
- Problems include metadata for pattern detection (see Section 7)
- 14,400 free requests/day on Groq free tier -- one mission uses ~13 requests (less than 0.1% of daily limit)
- OpenAI-compatible API format (same request/response structure, just different provider)
- **During lesson:** ZERO API calls (everything pre-generated)
- **Dynamic mode only:** Groq called for Layer 3 "Jarvis, analyze this" requests

### Provider Architecture (Phase 4)

```
Browser (file://) --> Cloudflare Worker --> Groq API --> Llama 3.3 70B Versatile
                      (CORS proxy)          (API key stored
                                             as Worker secret)
```

**Why Groq + Llama 3.3 70B:**
- IFEval 92.1 — highest instruction-following score among open-weight models (per deep research report)
- For K-5 generation, controllability matters more than raw capability
- Explicit child safety documentation in model card
- Groq free tier: 14,400 requests/day (mission uses ~13)
- Llama Guard 3 8B available as optional safety classification pass (free on Groq)

**Why Cloudflare Worker proxy:**
- App runs from file:// which sends Origin: null
- Groq API rejects null origins (CORS policy)
- Worker at ironman-api.shanewaldrop123.workers.dev forwards requests with proper headers
- API key stored as encrypted Worker secret, never exposed in client-side code

**Optional: Llama Guard Safety Pass:**
- Groq offers Llama Guard 3 8B as a free endpoint
- Can classify generated problems before Teacher Review Screen
- Toggleable — teacher can enable/disable
- Logs warnings (e.g., "Problem 7 flagged for review") rather than hard-blocking

**3. Voice Input (Web Speech API)**
- Browser's built-in speech recognition
- Converts teacher's speech to text
- Matches against trigger phrases
- Voice answer input with natural language parsing

**4. Voice Output (Layered System)**
- **Response Bank (permanent):** Pre-synthesized WAV files for all predictable responses (~387 lines)
  - Generated ONCE via Cartesia API, saved permanently
  - Covers: correct/wrong answers, hints, banter, Fury/Widow lines
- **Problem-Specific Audio (per-session):** 
  - Synthesized during pre-lesson setup via Cartesia API
  - Cached in browser memory (cleared after mission)
  - Covers: problem-specific hints generated alongside each math problem
- **Dynamic Mode (Layer 3):**
  - Cartesia API called in real-time for "Jarvis, analyze this"
  - ~200-300ms to start streaming audio
  - Fallback to pre-recorded "interference" line if API fails
- **Browser TTS (last-resort fallback):** Used only when audio file not found

**Cartesia API Integration:**
```javascript
// Programmatic audio synthesis - NOT manual web interface
const response = await fetch('https://api.cartesia.ai/tts/bytes', {
  method: 'POST',
  headers: {
    'X-API-Key': CARTESIA_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model_id: 'sonic-english',
    voice: { id: '585af41f-1554-4b87-88d6-fb47127a48b9' }, // Jarvis
    transcript: 'Perhaps try breaking 45 into 40 plus 5, sir.',
    output_format: 'mp3'
  })
});
const audioBlob = await response.blob();
```

### Animation Stack (GSAP)

GSAP provides MCU-level cinematic animations. Selected after analysis showed it was the clear winner for audio-visual synchronization with pre-generated Cartesia audio.

**Core capabilities:**
- **Timeline orchestration** for complex multi-phase sequences
- **SplitText** for data cascade effects
- **ScrambleText** for glitch decode reveals ("ACCESS GRANTED")
- **DrawSVG** for scan line animations
- **Physics2D** for particle effects (firewall breach debris, energy dispersal)
- **Web Audio API sync** for audio-visual coordination

**Why GSAP:** The Webflow acquisition (Fall 2024) made all premium plugins free -- ScrambleText, SplitText, Physics2D would have cost ~$200/year. GSAP's `timeline.time(audio.currentTime)` pattern enables sub-frame precision sync with pre-generated Cartesia audio -- critical for MCU-quality sequences. Benchmarks at 5x faster than CSS transitions.

**Installation:** `npm install gsap` -- Bundle locally, NO CDN (school content filters may block)

```javascript
// Example: Firewall breach sequence
const breachSequence = gsap.timeline();
breachSequence
  .to('.scan-line', { width: '100%', duration: 0.8 })
  .to('.firewall-icon', { scale: 1.2, duration: 0.3 }, '-=0.2')
  .to('.access-text', { opacity: 1, scrambleText: 'ACCESS GRANTED' });
```

### PixiJS GPU Effects Architecture [v3.2]

**Why PixiJS was promoted from Tier 4 (Skip) to Tier 1 (Must-Have):**

The original assessment ("Overkill -- won't hit 500+ particle counts") was based on particle count alone. After building Phase 2.5 transitions with CSS/GSAP only, it became clear that **GPU-accelerated post-processing filters** -- not particle counts -- are what create the MCU "wow factor." Effects like additive-blend light rays, bloom halos, chromatic aberration, god rays, and shockwaves are impossible in CSS and extremely difficult with Canvas 2D, but trivial with PixiJS filters. The decision was made to add PixiJS as a **visual effects layer underneath the existing DOM** rather than replacing the DOM-based UI.

**Architecture: Transparent Canvas Underlay**

```
+---------------+-----------------------------+
|  z-index: 2+  |  DOM Layer (GSAP-animated)  |
|               |  - ScrambleText titles       |
|               |  - SVG brackets/crosshairs   |
|               |  - Hex background pattern    |
|               |  - Subtitles, flash overlays |
+---------------+-----------------------------+
|  z-index: 1   |  PixiJS Canvas (GPU)        |
|               |  - God rays (GodrayFilter)   |
|               |  - Bloom (AdvancedBloomFilter)|
|               |  - RGB split (RGBSplitFilter)|
|               |  - Additive-blend particles  |
|               |  - Light ray Graphics lines  |
|               |  - Lens flare streaks        |
|               |  - ShockwaveFilter pulses    |
+---------------+-----------------------------+
|  z-index: 0   |  Page background            |
+---------------+-----------------------------+
```

DOM elements sit on top of the transparent PixiJS canvas (`backgroundAlpha: 0`). PixiJS handles atmospheric/cinematic effects behind the text. GSAP animates both layers simultaneously -- DOM elements via standard GSAP, PixiJS objects via GSAP PixiPlugin.

**PixiEffectManager Singleton (`js/pixi-effect-manager.js`)**

A single persistent PIXI.Application is shared across all transitions, preventing WebGL context exhaustion (browsers allow max ~8 simultaneous contexts).

```javascript
// Usage in any transition builder:
const app = pixiEffectManager.getApp();
const stage = pixiEffectManager.getStage();
const width = pixiEffectManager.getWidth();
const height = pixiEffectManager.getHeight();

// Create effects on stage...
const raysContainer = new PIXI.Container();
stage.addChild(raysContainer);

// Cleanup is automatic -- pixiEffectManager.reset() called between transitions
// Destroys all stage children (texture:false to preserve shared textures)
// Kills all GSAP tweens on stage children
```

**Key Pattern: GSAP Drives PixiJS Ticker**

PixiJS's internal ticker is stopped. GSAP's ticker drives rendering instead, ensuring perfect synchronization between DOM animations and PixiJS effects:

```javascript
app.ticker.stop();
gsap.ticker.add(() => app.renderer.render(app.stage));
```

**Lifecycle in FirewallSequence.playTransition():**

```
1. this.content.innerHTML = ''           // Clear DOM
2. pixiEffectManager.init(this.content)  // Create/attach canvas
3. ... build DOM elements + PixiJS effects + GSAP timeline ...
4. timeline plays (GSAP drives both DOM + PixiJS)
5. pixiEffectManager.reset()             // Destroy stage children
6. this.content.innerHTML = ''           // Clear DOM
```

**CDN Dependencies (loaded in index.html):**

| Library | Version | CDN URL | Purpose |
|---------|---------|---------|---------|
| PixiJS Core | 7.4.2 | `cdn.jsdelivr.net/npm/pixi.js@7.4.2/dist/pixi.min.js` | WebGL renderer, Graphics, Containers |
| pixi-filters | 5.3.0 | `cdn.jsdelivr.net/npm/pixi-filters@5.3.0/dist/browser/pixi-filters.min.js` | 45 GPU filters (GodrayFilter, AdvancedBloomFilter, RGBSplitFilter, GlitchFilter, CRTFilter, ShockwaveFilter, GlowFilter, etc.) |
| @pixi/particle-emitter | 5.0.8 | `cdn.jsdelivr.net/npm/@pixi/particle-emitter@5.0.8/dist/particle-emitter.min.js` | Particle systems |
| GSAP PixiPlugin | (local) | `node_modules/gsap/dist/PixiPlugin.min.js` | GSAP^PixiJS bridge |

**IMPORTANT:** pixi-filters 5.3.0 correct CDN path is `dist/browser/pixi-filters.min.js` (NOT `dist/pixi-filters.js` which returns 404).

**Available PixiJS Filters (all 45 verified loaded):**

Key filters for Iron Man effects: GodrayFilter (light rays emanating from center), AdvancedBloomFilter (glow halos around bright elements), RGBSplitFilter (chromatic aberration flash), GlitchFilter (digital glitch distortion), CRTFilter (CRT monitor overlay), ShockwaveFilter (expanding ring pulse), GlowFilter (soft outer glow), AsciiFilter (ASCII art effect), MotionBlurFilter (directional blur).

**Effect Patterns for Transition Builders:**

God rays: `new PIXI.filters.GodrayFilter({ angle: 30, gain: 0.2, lacunarity: 2.5, time: 0 })` -- animate `time` and `gain` with GSAP.

Bloom spike: `new PIXI.filters.AdvancedBloomFilter({ threshold: 0.5, bloomScale: 1, blur: 4 })` -- spike `bloomScale` to 3 on impact, settle to 1.5.

RGB split flash: `new PIXI.filters.RGBSplitFilter()` -- animate `red[0]` to -3 and `blue[0]` to 3 for 0.05s, then back to 0.

Additive blending: `graphics.blendMode = PIXI.BLEND_MODES.ADD` -- makes light rays and particles glow realistically.

Particles: `new PIXI.Graphics()` circles with `PIXI.BLEND_MODES.ADD`, scattered outward with GSAP position/alpha tweens.

### Integration Architecture

```
+-----------------------------------------------------------------+
|                      PRE-LESSON PHASE                           |
|  +--------------+    +--------------+    +--------------+      |
|  | AI Problem   | ->  | Human Check  | ->  | Cartesia     |      |
|  | Generation   |    | & Approve    |    | Audio Synth  |      |
|  +--------------+    +--------------+    +--------------+      |
|                              v                                  |
|                      lesson-pack.json                           |
|                      (problems + audio paths + timing cues)     |
+-----------------------------------------------------------------+
                               v
+-----------------------------------------------------------------+
|                      RUNTIME PHASE                              |
|  +----------------------------------------------------------+  |
|  |                    GSAP Master Timeline                   |  |
|  |  +----------+  +----------+  +----------+  +----------+ |  |
|  |  | Problem  |-> | Student  |-> | Feedback |-> | Next     | |  |
|  |  | Reveal   |  | Input    |  | Sequence |  | Firewall | |  |
|  |  +----------+  +----------+  +----------+  +----------+ |  |
|  +----------------------------------------------------------+  |
|                              v                                  |
|  +----------------------------------------------------------+  |
|  |               Cartesia Pre-synth Audio                    |  |
|  |  (Jarvis lines already rendered, stored locally)          |  |
|  +----------------------------------------------------------+  |
+-----------------------------------------------------------------+
```

### Audio-Visual Sync Architecture

> **Moved to Phase 6 (Voice Integration) in v3.6.** Audio-visual synchronization requires pre-generated Cartesia audio to exist, which doesn't happen until Phase 6+. See Phase 6 for the LESSON_PACK timing data structure, FirewallSequence audio sync pattern, and drift correction architecture.

### Jayse Hansen Principle (HUD Design)

Every HUD element must have **purpose that students can understand**:

| Visual Element | Must Map To | Student Understanding |
|----------------|-------------|----------------------|
| Arc Reactor (center) | Overall mission progress | "How close am I to saving Tony's tech?" |
| Firewall bars (10 segments) | Problems remaining | "5 more to go!" |
| Circular gauge | Time remaining | "I need to hurry!" |
| Status LEDs | Hint availability | "Green = I can ask Jarvis for help" |
| Scrolling log | Jarvis commentary | "JARVIS is talking to me!" |
| Glitch effects | System under attack | "Something bad is happening!" |

**Anti-pattern:** Random spinning rings that don't mean anything. Kids sense decorative noise, even if they can't articulate it. This undermines immersion.

### Visual Resource Tiers

**Tier 1: Must-Have (integrate immediately)**
| Resource | Purpose | Risk |
|----------|---------|------|
| GSAP Core + SplitText + ScrambleText + Physics2D | Timeline, text effects, particles | Low |
| PixiJS 7.4.2 + pixi-filters 5.3.0 + particle-emitter 5.0.8 | GPU bloom, god rays, RGB split, additive particles | Low -- verified working |
| GSAP PixiPlugin (local bundle) | Animate PixiJS filters/objects via GSAP timelines | Low |
| Augmented-UI CSS | Stark Industries panel aesthetics | Low |
| CRT Scanline Effect (lbebber) | Atmospheric overlay | Low |
| soulwire Text Scramble | "ACCESS GRANTED" reveals | Low |

**Tier 2: High Value (Week 2)**
| Resource | Purpose | Risk |
|----------|---------|------|
| CSS-Tricks Arc Reactor | Central visual anchor | Low |
| Radar Sweep (thebabydino) | Transition effects | Low |
| Ripple Effect (VeronQ) | Button feedback | Low |

**Tier 3: Evaluate Carefully**
| Resource | Purpose | Risk |
|----------|---------|------|
| WebGL Broken Glass | Firewall breach | Medium - can fail silently |
| Matrix Canvas Cascade | Data visualization | Medium - performance varies |

**Tier 4: Skip**
| Resource | Why Skip |
|----------|----------|
| ARWES Framework | Alpha status, React dependency, API instability |
| Dynamic SciFi Dashboard Kit | Too new (May 2025), canvas-based conflicts with GSAP DOM model |
| ~~PixiJS~~ | ~~Overkill~~ -> **PROMOTED to Tier 1 in v3.2** (GPU filters are the killer feature, not particle counts) |
| Lottie | Adds complexity; GSAP can do everything needed |

### Potential Complications & Mitigations

| Complication | Likelihood | Mitigation |
|--------------|------------|------------|
| WebGL shatter effect fails silently | Medium | Use CSS clip-path shatter as primary, WebGL as enhancement |
| Audio desync on slow browser | Medium | 50ms drift tolerance, auto-resync |
| CodePen CSS conflicts | High | Strict namespacing: `.im-reactor-*`, `.im-panel-*`, `.im-glitch-*`, `.im-transition-*` |
| School content filter blocks CDN | Medium | Self-host ALL assets, zero external requests |
| Student spam-clicks during animation | High | Disable input during sequences, debounce |
| Browser tab goes inactive | Medium | Use `gsap.ticker.lagSmoothing(0)` for graceful resume |
| WebGL context exhaustion (PixiJS) | High if mismanaged | PixiEffectManager singleton reuses ONE PIXI.Application across all transitions; reset() destroys children, not the context |
| PixiJS CDN blocked by school filter | Low | CDN loads are teacher-computer only (not student Chromebooks); fallback: transitions degrade gracefully to CSS-only |

### Voice Cloning (Cartesia)
- **Jarvis:** READY - Voice ID: `585af41f-1554-4b87-88d6-fb47127a48b9`
- **Nick Fury:** TO BE CLONED BY USER
- **Black Widow:** TO BE CLONED BY USER

---

## 3. Mission Narrative

### Premise
Tony Stark received intel from a mysterious informant ("a girl who grew up in a red room" -- Black Widow) that someone copied arc reactor blueprints and hid them in S.H.I.E.L.D.'s mainframe. Students are recruited as Stark's elite digital strike team to hack through 10 firewalls and retrieve the stolen plans before they're weaponized.

### Character Roles
- **Iron Man (Teacher):** Leads the mission, speaks to Jarvis, inputs answers
- **Jarvis (AI):** Assists with decryption, provides hints, engages in banter -- dry British wit, addresses Stark as "sir" or "Mr. Stark"
- **Nick Fury:** Appears at firewalls 3, 6, 9 with science questions (amused/teasing tone -- entertained by the hack attempt)
- **Black Widow:** Secret double agent who feels guilty about the theft; appears with hints (appearance logic still in flux -- see Section 8)

### Opening Sequence (Director Override)

This exact sequence happens at the very beginning:

**Iron Man Opening Line:**
> "Okay, listen up--this is urgent. I got a tip from a friend... let's just say she's got a history with the Red Room and a knack for secrets. She says someone's stashed a copy of my arc reactor schematics deep in the S.H.I.E.L.D. mainframe. That tech in the wrong hands? Catastrophic. I've hit every firewall, every encryption layer--and now, I need the smartest team I could find: you. So suit up, recruits. We're breaking in. I'm not going to let that happen--because I am Iron Man."

**[Jarvis Response - OPEN-01]**
> "And here I thought it was because you had a flair for dramatic entrances, sir. Let's begin."

**[Iron Man: Initiate Deep Decryption Sequence]**
> Iron Man: "Alright Jarvis, run deep decryption program, use routine 9 alpha, tell me what you find."

**[Jarvis - OPEN-02]**
> "Hidden file detected, executive level access required."

**[Iron Man: Attempt Director Override]**
> Iron Man: "Director override, Fury, Nicholas J."

**[Jarvis - OPEN-03a]**
> "Executive level access unlocked... it appears to be a voice message from Director Nick Fury."

**[Fury - OPEN-03b - FURY'S CLONED VOICE]**
> "Nice try, Tony. You didn't think it was gonna be that easy, did you?"

**[Jarvis - OPEN-04]**
> "Systems online. Initiating S.H.I.E.L.D. mainframe breach protocol. I do hope you know what you're doing, sir."

-> First firewall begins

---

## 4. Mission Structure

### 13 Mission Screens (10 Math + 3 Science) [v3.5]

- **Firewalls 1-10:** All math problems (TEKS-aligned, open response) -- these are the "firewalls" being hacked
- **After Firewalls 3, 6, 9:** Nick Fury science interruptions (multiple choice A/B/C/D) -- inserted BETWEEN math firewalls, NOT replacing them

**Complete mission sequence:**
Math 1 -> Math 2 -> Math 3 -> **Fury Science 1** -> Math 4 -> Math 5 -> Math 6 -> **Fury Science 2** -> Math 7 -> Math 8 -> Math 9 -> **Fury Science 3** -> Math 10 -> **Victory**

**Scoring:** Math: X/10 | Science: X/3 | Science questions are NOT counted as firewalls
**Progress bar:** Shows `[4/10 FIREWALLS]` -- counts only math firewalls, not science screens

### Correct Answer Flow [v3.5]
When students answer correctly:
1. Play CORRECT-XX audio (random from pool, avoiding repeats)
2. Update firewall UI (mark as breached)
3. Wait ~2 seconds (controlled by `HUD_CONFIG.timing.firewallBreach`)
4. Check for Fury interruption (firewalls 3, 6, 9)
   - **If Fury triggers:** Skip to Fury Alert sequence (see Nick Fury Interruptions below) -- NO transition plays before Fury
   - **If no Fury:** Continue to step 5
5. Play transition via `window.transitionEngine.playTransition(callback)`
6. On transition callback: Advance to next firewall

**Fury firewall flow (FW 3, 6, 9):**
Correct answer -> response bank line -> Fury Alert (no transition) -> science question -> student answers -> transition -> next math firewall

**Normal firewall flow (all others):**
Correct answer -> response bank line -> transition -> next math firewall

**Milestone-Specific Responses:**
| Firewall | What Plays |
|----------|------------|
| 1, 2, 4, 7, 8 | Random generic correct answer response (CORRECT-01 through CORRECT-30) |
| 3, 6, 9 | Post-Fury specific line (CORRECT-POSTFURY-01 through CORRECT-POSTFURY-04) |
| 5 | Halfway milestone line (CORRECT-HALF-01 through CORRECT-HALF-03) |
| After 9, approaching 10 | Final firewall buildup line (CORRECT-FINAL-INTRO-01 through CORRECT-FINAL-INTRO-04) |

### Wrong Answer Flow [UPDATED v3.7]
When students answer incorrectly:
1. Play WRONG-XX audio (random from pool) + wrong-answer SFX
2. Increment wrong attempt counter
3. Play wrong animation (red glow + shake)
4. **1st wrong answer on this firewall:** After 1.5s delay, Jarvis dialogue box updates with a random generic hint from `JARVIS_GENERIC_HINTS` array (15 lines from response_bank.md Section 5B). Console logs `[Hint] Jarvis generic hint: ...`. This is a TEXT-ONLY placeholder -- Phase 5 upgrades to pattern-specific hints with audio.
5. **2nd wrong answer on this firewall:** Black Widow ALWAYS appears (deterministic, no coin flip). `checkWidowHint()` fires with `wrongAttemptsThisFirewall >= 2`. Subject to existing max appearances (4) + spacing rules (2 firewalls between).
6. **3rd+ wrong answers:** Widow can appear again per spacing/max rules.

**Critical implementation detail:** The wrong attempt counter increments BEFORE the animation callback, so by the time the callback checks thresholds, the counter is already at the new value. 1st wrong = counter 1 = Jarvis hint. 2nd wrong = counter 2 = Widow. Zero overlap guaranteed.

### Black Widow Appearances [FINALIZED v3.6]

Black Widow is a double agent -- she helped Fury lock away the arc reactor plans but feels guilty about it. She secretly leaves clues for Tony and the recruits. She uses a voice clone (Cartesia, TO BE CLONED BY USER).

**Color Identity:** Deep crimson/black (#cc0000 primary, #8b0000 shadows, #ff1a1a glows) -- darker and moodier than the old #ff3333. Derived from Black Widow movie poster palette. See `Black_widow_logo.png` for hourglass logo and `black_widow_red_shade.jpg` for color reference.

**Four-Faction Color System:**
- Cyan (#00d4ff) = Jarvis/Stark = ally
- Amber (#ff8c00) = Fury/SHIELD = obstacle
- Crimson (#cc0000) = Widow = secret ally
- Green (#00ff00) = correct answer feedback

**Appearance System (3-4 total per mission):**

#### APPEARANCE 1: THE INTRODUCTION (deterministic, always happens)
- **When:** After the "Nice try Tony" director override Fury message in the opening sequence, ~2-3 second pause, then fires. This is BEFORE any math problems.
- **Visual:** Full-screen overlay (Option A) covering entire HUD. Crimson/black glitch burst animation entrance using `_buildWidowGlitch()` method (repurposed from transition pool glitch burst, re-skinned to crimson palette). Hourglass logo (`Black_widow_logo.png`) center screen, "ENCRYPTED TRANSMISSION" header in crimson ScrambleText, message text below.
- **Duration:** Configurable via `HUD_CONFIG.timing.widowIntroDuration` (default ~8 seconds). IMPORTANT: Duration must use `Math.max(configuredDuration, audioClipDuration + 1.0)` so voice clips never get cut off.
- **Exit:** Auto-fade out, scanlines dissolve
- **DOM Element:** Reuses `#transition-overlay` (same element as between-firewall transitions)
- **Then:** Firewall 1 loads
- **Dialogue (Option 3 style):** "Tony, it's Natasha. I know what Fury's doing with those arc reactor plans, and I can't let it stand. I've left breadcrumbs in his system for your team. Watch for my signal -- but I can only risk a few transmissions before he catches on. Good luck, Stark." (See WIDOW-INTRO lines in response_bank.md -- user will record final version as voice clone)

#### APPEARANCES 2-3: GAMEPLAY HINTS (deterministic on 2nd wrong answer) [UPDATED v3.7]
- **When:** After 2nd wrong answer on any firewall, OR pre-emptively before hard firewalls (7, 8)
- **Trigger logic:** wrongAttemptsThisFirewall >= 2 (deterministic, NO coin flip) + minimum 2-firewall spacing between appearances + max 4 total appearances per mission
- **Visual:** Floating transmission panel (Option B) -- a self-contained comms box that appears over the game. NO glitch burst entrance -- just fades in smoothly with subtle red border glow. Game screen dims behind it but stays visible.
- **Panel elements:** Header bar ("INTERCEPTED" + hourglass logo small), message body (italicized), footer ("FROM: [REDACTED]" + "AUTO-DESTRUCT: Xs")
- **Duration:** Configurable via `HUD_CONFIG.timing.widowHintDuration` (default ~5 seconds). Same audio-aware formula: `Math.max(configuredDuration, audioClipDuration + 1.0)`
- **DOM Element:** New `#widow-panel` element in index.html (separate from transition overlay)
- **WIDOW STATUS: ALLIED indicator:** When Widow's panel appears, the sidebar "WIDOW STATUS: ALLIED" text pulses crimson briefly as a subtle "she's active" tell

#### APPEARANCE 4: FINAL TRANSMISSION (deterministic, always happens before FW 10)
- **When:** After Fury's firewall 9 science question is answered correctly, BEFORE the transition to firewall 10
- **Visual:** Floating transmission panel (Option B), same as gameplay hints
- **Duration:** Configurable via `HUD_CONFIG.timing.widowFinalDuration` (default ~6 seconds). Same audio-aware formula.
- **Content:** One of the WIDOW-FINAL lines ("This is it, Tony. Fury's watching now...")
- **Always fires** regardless of how many appearances have occurred

**Glitch Burst Extraction:**
- `_buildGlitchBurst` is REMOVED from the between-firewall transition pool (5 transitions remain: access_granted, scan_sweep, ripple_wave, arc_reactor_pulse, data_cascade)
- A NEW separate method `_buildWidowGlitch()` is created with crimson/black color palette
- This method is ONLY used for Widow's introduction (Appearance 1)
- The two methods share no code -- clean separation, no risk of breaking the transition pool

**Audio Sync Architecture:**
- All Widow overlay durations must be configurable, not hardcoded
- Duration formula: `Math.max(HUD_CONFIG.timing.widowXxxDuration, audioClipDuration + 1.0)`
- This ensures voice clips never get cut off when dialogue is recorded
- When no audio is loaded, falls back to the configured default duration

**Future-proofing note:** The Fury "Nice try Tony" line will eventually be a Fury voice clip. Widow's intro must fire AFTER any Fury audio completes, with a 2-3 second silence gap for dramatic tension (the "wait... what's happening?" beat before the screen goes crimson).

**Addressing:** Both Tony and students depending on context ("Tony, your team is close..." or "Young agents, check your tens place...")

**Visual:** Crimson/black overlay with scanlines, auto-fades (Mission Impossible style)

### Nick Fury Interruptions [DETAILED] UX SPEC

**When:** After firewalls 3, 6, and 9 (before math firewall 4, 7, and 10)

**Transition rule:** NO transition plays before Fury's alert. The Fury alert sequence REPLACES the normal between-firewall transition. After the student answers the science question, a normal transition DOES play before the next math firewall loads.

**Complete Fury sequence (e.g. after Math FW 3):** [v3.5]
1. Student answers Math FW 3 correctly -> response bank line plays (CORRECT-POSTFURY)
2. Fury Alert effect triggers (amber flashing, 2-3 seconds) -- NO transition before this
3. Fury Science Screen appears (amber/orange theme, multiple choice A/B/C/D)
4. Student answers science question -> science-correct.wav or science-wrong.wav
5. Transition plays via `window.transitionEngine.playTransition(callback)`
6. On callback: Math FW 4 loads

**Reference:** See `fury_interface.webp` for target visual style, use `shield_logo.png`

**IMPORTANT:** All Fury dialogue comes from `response_bank.md`. Do NOT make up new quotes.

---

#### PART 1: ALERT INTERRUPTION EFFECT (2-3 seconds)

When a science interruption triggers, play a dramatic "system takeover" effect:

```css
/* Add to body when Fury appears */
.fury-alert-active {
  /* Triggers all amber flashing effects */
}
```

| Element | Effect | Duration |
|---------|--------|----------|
| **ALL HUD panels** | Amber flashing borders (left sidebar, right sidebar, top bar, bottom bar, center content) | 3-4 pulses over 2-3 sec |
| **S.H.I.E.L.D. logo** | Appears center screen, large, pulsing amber/glowing | Hold for 2-3 sec |
| **Screen overlay** | Dark amber vignette fades in/out | 2-3 sec |
| **Alert text** | "SECURITY OVERRIDE" or "INCOMING TRANSMISSION" flashing | 2-3 sec |

**CSS Animation Example:**
```css
@keyframes fury-border-pulse {
  0%, 100% { border-color: var(--primary-cyan); }
  50% { border-color: #ff8c00; box-shadow: 0 0 20px #ff8c00; }
}

.fury-alert-active .hud-panel {
  animation: fury-border-pulse 0.5s ease-in-out 4; /* 4 pulses */
}
```

**After 2-3 seconds:** Alert effect stops, borders return to cyan, center content transitions to amber Fury theme.

---

#### PART 2: FURY SCIENCE SCREEN (After Alert Settles)

**Color Scheme -- AMBER/DARK (NOT cyan)** [UPDATED v3.6: changed from red to amber/orange for MCU accuracy and to distinguish from Black Widow's red]

| Element | Color |
|---------|-------|
| Primary | `#ff8c00` (amber/orange) |
| Accent/glow | `#ffaa00` (bright amber) |
| Background | `#0a0a0a` |
| Borders | Amber/dark amber |
| Headers | Amber |
| Content text | White/light gray |

**Layout (see fury_interface.webp):**

```
+-----------------------------------------------------------------+
|  S.H.I.E.L.D.                                    [CLASSIFIED]   |  <- Header bar
+-----------------------------------------------------------------+
|                          +-----+                                |
|                          | NF  |  <- Circle avatar with "NF"     |
|                          +-----+     or S.H.I.E.L.D. logo       |
|                                                                 |
|  +---------------------------------------------------------+   |
|  |  "Looks like someone's been busy. I'm Nick Fury, and    |   |  <- Quote box
|  |   I've got a little security measure for your recruits."|   |    (italicized)
|  +---------------------------------------------------------+   |
|                                                                 |
|            LOADING SECURITY PROTOCOL...                         |  <- Status text
|                                                                 |
|  +----------------------------------------------------------+  |
|  |  (A)  To make food                                       |  |  <- Multiple choice
|  +----------------------------------------------------------+  |    buttons stacked
|  +----------------------------------------------------------+  |    vertically
|  |  (B)  To absorb water and nutrients                      |  |
|  +----------------------------------------------------------+  |
|  +----------------------------------------------------------+  |
|  |  (C)  To attract bees                                    |  |
|  +----------------------------------------------------------+  |
|  +----------------------------------------------------------+  |
|  |  (D)  To produce flowers                                 |  |
|  +----------------------------------------------------------+  |
|                                                             ##=|  <- Amber corner
+-------------------------------------------------------------###+    accents
```

**UI Component Details:**

| Component | Specification |
|-----------|---------------|
| **Header bar** | Left: "S.H.I.E.L.D." text, Right: "CLASSIFIED" badge (amber background) |
| **Fury avatar** | Circle with amber border/glow, "NF" initials inside (or smaller S.H.I.E.L.D. logo) |
| **Quote box** | Dark background, amber border, italicized text from response_bank.md |
| **Answer buttons** | Four stacked vertically, circle with letter (A/B/C/D) on left, dark bg, amber border |
| **Button states** | Hover: brighter amber, Correct: green flash, Wrong: red flash |
| **Corner accents** | Amber geometric accents in corners |

**CRITICAL:** Sidebars STAY cyan -- only center content becomes amber.

---

#### PART 3: AFTER SCIENCE QUESTION ANSWERED

**Correct Answer:**
1. Button flashes green
2. Play `science-correct.wav` 
3. Play Fury correct response (FURY-CORRECT-01 through FURY-CORRECT-10 from response_bank.md)
4. Brief "SECURITY VERIFIED" message displays (green text)
5. Amber theme fades, transitions back to cyan Jarvis theme
6. Continue to next math firewall

**Wrong Answer:**
1. Button flashes red
2. Play `science-wrong.wav`
3. Play Fury wrong response (FURY-WRONG-01 through FURY-WRONG-11 from response_bank.md)
4. Question remains -- try again (or teacher can override)

---

#### FURY DIALOGUE SOURCES (from response_bank.md)

| Category | IDs | Count |
|----------|-----|-------|
| **Intro (Firewall 3)** | FURY-INTRO-3-01 to -03 | 3 lines |
| **Intro (Firewall 6)** | FURY-INTRO-6-01 to -03 | 3 lines |
| **Intro (Firewall 9)** | FURY-INTRO-9-01 to -03 | 3 lines |
| **Correct Answer** | FURY-CORRECT-01 to -10 | 10 lines |
| **Wrong Answer** | FURY-WRONG-01 to -11 | 11 lines |
| **Taunts** | FURY-TAUNT-01 to -08 | 8 lines |

### Celebration Sequence (Mission Complete)
**Note:** After Firewall 10 is breached, the celebration sequence starts directly -- no between-firewall transition plays before victory. [v3.5]
1. Firewall 10 breached -> Victory line plays (VICTORY-01 through VICTORY-04)
2. Matrix rain starts (blue code style)
3. "ACCESS GRANTED" text breaks through
4. Arc reactor powers up with massive glow
5. Arc reactor schematics/blueprints display on screen
6. **Arc Reactor Science Briefing** (grade-appropriate: ARC-SCIENCE-G1 through ARC-SCIENCE-G5)
7. Tony quip -> Jarvis closing line (ARC-CLOSING-01 or ARC-CLOSING-02)
8. Mission complete speech (COMPLETE-01 through COMPLETE-04)
9. Final sign-off (SIGNOFF-01 through SIGNOFF-04)

---

## 5. Visual Design

### Decryption Display Styles
| Moment | Style |
|--------|-------|
| Regular math firewalls | Style 2: Holographic Stark (blue, clean, brackets around numbers) |
| Fury's science questions | Style 4: SHIELD Document (classified file aesthetic, amber accents) |
| When Widow appears | Style 8: Glitch effect (corrupted signal, RGB shifting, crimson/black, auto-fades) |
| Final firewall (#10) | Style 7: Arc Reactor Core (problem inside spinning reactor ring) |

### Color Palette
- **Primary:** Stark Industries blue (#00d4ff)
- **Accent:** Arc reactor glow, orange (#ff6b00) for brackets/highlights
- **Fury/SHIELD:** Amber/orange accents (#ff8c00) [UPDATED v3.6: changed from red for MCU accuracy]
- **Black Widow:** Deep crimson/black theme (#cc0000 primary, #8b0000 shadows, #ff1a1a glows) [UPDATED v3.6: darker, moodier palette from movie poster reference]

### UI Elements
- **Progress Bar:** Bottom of screen, Stark Industries style
  - Format: `[HACKING MAINFRAME] ################## [4/10 FIREWALLS]`
- **Background:** Dark with subtle hexagon pattern (reference Stark Industries images)
- **Typography:** Monospace/tech font for "code," clean sans-serif for readability

### Effects & Audio
- Digital typing sounds when problems appear (STOP when user types answer)
- Background ambience: Low server room hum (adjustable volume slider)
- Fury warning: Amber flashing borders (2 seconds before he appears)
- Different alert sounds for Fury vs regular problems
- SHIELD security alarm sound for wrong answers
- "Systems accessed" sound for correct answers
- Widow transmission: static/glitch audio

### Easter Eggs
- Console logs: "Initializing Protocol: AVENGERS-1"
- Cipher text: "ASSEMBLE" hidden in garbled characters
- "Threat Level: MIDNIGHT"
- "I can do this all day" references
- Budapest mentions
- Shawarma references

---

## 6. Pattern Detection System [NEW]

### Overview

Research shows that approximately **90% of student errors follow identifiable patterns** (Brown & Burton BUGGY system, 1978). When a wrong answer is submitted, the system analyzes it against the correct answer to determine the most likely error pattern, then delivers a targeted hint.

### How It Works

```
[Wrong Answer Submitted]
         v
detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel)
         v
+-------------------------------------------------+
|  Test each pattern hypothesis:                  |
|  - What if they forgot to carry?                |
|  - What if they subtracted smaller from larger? |
|  - What if they reversed digits?                |
|  - What if they used the wrong operation?       |
|  - ... (24 patterns total)                      |
+-------------------------------------------------+
         v
Return: { pattern, confidence, hintId, meetsThreshold }
```

### Detected Patterns (24 Total)

#### Addition Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| FORGOT_TO_CARRY | Simulate addition without carrying; compare | HINT-PAT-08, HINT-PAT-09 |
| RECORDED_BOTH_DIGITS | Student wrote both digits instead of carrying | HINT-PAT-08 |

#### Subtraction Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| SMALLER_FROM_LARGER | Subtract smaller from larger regardless of position (affects 31% of struggling students) | HINT-PAT-10 |
| FORGOT_TO_BORROW | Didn't add 10 when borrowing | HINT-PAT-10 |
| BORROW_NO_DECREMENT | Borrowed but didn't reduce lending column | HINT-PAT-10 |
| STOP_BORROW_AT_ZERO | Can't borrow from 0, gave up | HINT-PAT-10 |

#### Multiplication Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| MULTIPLICATION_TABLE_ERROR | Basic fact wrong (7x8=54) | HINT-GEN-09 |
| OFF_BY_ONE_GROUP | One multiplicand short/extra | HINT-PAT-14 |
| PARTIAL_PRODUCT_ERROR | Multi-digit carrying issues | HINT-PAT-08 |

#### Division Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| REMAINDER_IGNORED | Gave quotient only | HINT-GEN-03 |
| GAVE_REMAINDER_ONLY | Gave remainder as answer | HINT-GEN-03 |
| DIVISION_REVERSED | Divided in wrong direction | HINT-PAT-11 |

#### Fraction Errors (Grades 3-5)
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| ADD_BOTH_NUM_AND_DEN | 1/2 + 1/3 = 2/5 (THE fraction misconception) | HINT-PAT-17 |
| LCD_WITHOUT_ADJUSTMENT | Found common denominator but didn't adjust numerators | HINT-PAT-17 |
| FRACTION_NOT_SIMPLIFIED | Correct value but not lowest terms | HINT-PAT-18 |

#### Decimal Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| DECIMAL_PLACE_ERROR | Off by factor of 10, 100, etc. | HINT-PAT-15, HINT-PAT-16 |
| DECIMAL_IGNORED | Treated 3.5 as 35 | HINT-PAT-15 |
| LONGER_IS_LARGER | Thinks 0.123 > 0.5 | HINT-GEN-03 |

#### Place Value Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| OFF_BY_ONE | `abs(answer - correct) == 1` | HINT-PAT-01, HINT-PAT-02 |
| OFF_BY_TEN | `abs(answer - correct) == 10` | HINT-PAT-03, HINT-PAT-04 |
| OFF_BY_HUNDRED | `abs(answer - correct) == 100` | HINT-PAT-05 |
| DIGIT_TRANSPOSITION | `answer == reversed(correct)` | HINT-PAT-06, HINT-PAT-07 |

#### Wrong Operation Errors
| Pattern | Detection Logic | Response Bank ID |
|---------|----------------|------------------|
| ADDED_INSTEAD_OF_SUBTRACTED | `answer == a + b` when should subtract | HINT-PAT-19 |
| SUBTRACTED_INSTEAD_OF_ADDED | `answer == a - b` when should add | HINT-PAT-11 |
| MULTIPLIED_INSTEAD_OF_ADDED | `answer == a * b` when should add | HINT-PAT-13 |
| ADDED_INSTEAD_OF_MULTIPLIED | `answer == a + b` when should multiply | HINT-PAT-12 |
| DIVIDED_INSTEAD_OF_MULTIPLIED | `answer == a / b` when should multiply | HINT-PAT-20 |

### Confidence Scoring

Each detected pattern receives a confidence score (0.0 - 1.0) based on:

```
confidence = (exactMatch * 0.50) + 
             (populationBaseRate * 0.20) + 
             (studentHistory * 0.20) + 
             (diagnosticValue * 0.10)
```

Where:
- **exactMatch (50%):** Does simulating the bug reproduce the student's exact answer?
- **populationBaseRate (20%):** How common is this error in the general population?
- **studentHistory (20%):** Has this student made this error before this session?
- **diagnosticValue (10%):** Is this problem specifically designed to reveal this bug?

### Grade-Level Adjustments

The system adjusts confidence based on grade level:

| Grade | Adjustments |
|-------|-------------|
| K-2 | Higher tolerance for counting slips; focus on addition/subtraction patterns |
| 3-4 | Include multiplication/fraction patterns |
| 5 | Full pattern set including decimals and complex fractions |

### Hint Selection Logic

```
IF confidence >= CONFIDENCE_THRESHOLD (0.80):
    -> Use pattern-specific hint (HINT-PAT-XX)
ELSE:
    -> Use generic hint (HINT-GEN-XX)
```

### Black Widow Hint Mapping

When Black Widow appears, she uses her own hint versions for the same patterns:

| Pattern | Jarvis Hint ID | Black Widow Hint ID |
|---------|----------------|---------------------|
| OFF_BY_ONE | HINT-PAT-01, -02 | WIDOW-HINT-01, -02 |
| OFF_BY_TEN | HINT-PAT-03, -04 | WIDOW-HINT-03, -04 |
| OFF_BY_HUNDRED | HINT-PAT-05 | WIDOW-HINT-05 |
| DIGIT_TRANSPOSITION | HINT-PAT-06, -07 | WIDOW-HINT-06, -07 |
| FORGOT_TO_CARRY | HINT-PAT-08, -09 | WIDOW-HINT-08 |
| FORGOT_TO_BORROW | HINT-PAT-10 | WIDOW-HINT-09 |
| WRONG_OPERATION | HINT-PAT-11, -19 | WIDOW-HINT-10, -11 |
| DECIMAL_PLACE_ERROR | HINT-PAT-15, -16 | WIDOW-HINT-12, -13 |
| FRACTION_DENOMINATOR | HINT-PAT-17 | WIDOW-HINT-14 |
| FRACTION_NOT_SIMPLIFIED | HINT-PAT-18 | WIDOW-HINT-15 |
| OFF_BY_ONE_GROUP | HINT-PAT-14 | WIDOW-HINT-16 |

---

## 7. AI Problem Generation [NEW]

### Core Principle

**All problems are generated at session start.** When the teacher selects a grade level and clicks "Begin Mission," the system calls the AI API to generate 10 math problems + 3 science questions BEFORE the mission flow begins.

### Problem Schema

Each generated problem MUST follow this exact structure:

```javascript
{
  "id": "fw-3",
  "firewallNumber": 3,
  "narrative": "Jarvis is calculating the power output for the repulsor beam.",
  "expression": "302 - 167 = ?",
  "correctAnswer": 135,
  "answerType": "integer",  // "integer" | "decimal" | "fraction"
  "problemData": {
    "operation": "SUBTRACT",           // Pattern detector uses this
    "operands": [302, 167],            // And this
    "teksCode": "3.4A",
    "difficulty": "medium",            // "easy" | "medium" | "hard"
    "diagnosticFor": ["STOP_BORROW_AT_ZERO"]  // The 0 in 302 reveals this bug
  }
}
```

### Operation Codes

The `operation` field must be one of:
- `ADD`
- `SUBTRACT`
- `MULTIPLY`
- `DIVIDE`
- `FRACTION_ADD`
- `FRACTION_SUBTRACT`
- `FRACTION_MULTIPLY`
- `DECIMAL_ADD`
- `DECIMAL_SUBTRACT`
- `DECIMAL_MULTIPLY`

### Fraction Answer Format

For fraction problems:
```javascript
{
  "correctAnswer": { "numerator": 5, "denominator": 6 },
  "answerType": "fraction",
  "problemData": {
    "operation": "FRACTION_ADD",
    "operands": [
      { "numerator": 1, "denominator": 2 },
      { "numerator": 1, "denominator": 3 }
    ],
    ...
  }
}
```

### Diagnostic Problems

The AI should generate some problems specifically designed to reveal common errors:

| Diagnostic Problem Type | Example | Reveals Pattern |
|------------------------|---------|-----------------|
| Both columns require carry | 47 + 28 | FORGOT_TO_CARRY |
| Zero in middle of minuend | 302 - 167 | STOP_BORROW_AT_ZERO |
| Different denominators | 1/2 + 1/3 | ADD_BOTH_NUM_AND_DEN |
| Reversible digits | 36 + 18 (= 54) | DIGIT_TRANSPOSITION |
| Close to operation boundary | 99 + 2 | FORGOT_TO_CARRY |

### Science Question Format

For Fury's science questions at firewalls 3, 6, 9:

```javascript
{
  "id": "fury-1",
  "firewallNumber": 3,
  "question": "What is the main function of leaves on a plant?",
  "options": [
    { "letter": "A", "text": "To make food" },
    { "letter": "B", "text": "To absorb water and nutrients" },
    { "letter": "C", "text": "To attract bees" },
    { "letter": "D", "text": "To produce flowers" }
  ],
  "correctAnswer": "A",
  "teksCode": "3.12A"
}
```

### AI Prompt Structure

The AI prompt must enforce:
1. **Schema compliance** -- Output must match expected structure exactly
2. **TEKS alignment** -- Problems must target selected standards
3. **Diagnostic value** -- Some problems should reveal common errors
4. **Difficulty progression** -- Firewalls 1-3 easier, 4-7 medium, 8-10 harder
5. **Narrative wrapping** -- Each problem needs Iron Man themed context
6. **Grade appropriateness** -- Number ranges match grade expectations

### Grade-Specific Number Ranges

| Grade | Addition/Subtraction | Multiplication | Division |
|-------|---------------------|----------------|----------|
| 1 | Within 20 | N/A | N/A |
| 2 | Within 1,000 | N/A | N/A |
| 3 | Within 1,000 | Facts to 10x10 | Related division facts |
| 4 | Within 10,000 | 4-digit x 1-digit, 2-digit x 2-digit | 4-digit x 1-digit |
| 5 | Decimals to thousandths | Decimals to hundredths | Decimals, fractions |

---

## 8. Mission Integration Architecture [NEW]

### Mission State Object

Single source of truth for all mission data:

```javascript
missionState = {
  // Configuration (set at mission start)
  gradeLevel: 3,
  selectedMathTeks: ['3.4A', '3.4B', '3.4F'],
  selectedScienceTeks: ['3.9B', '3.10C', '3.7B'],
  
  // Generated content (from AI)
  mathProblems: [...],     // 10 problems
  scienceQuestions: [...], // 3 questions (for Fury at FW 3,6,9)
  
  // Progress tracking
  currentFirewall: 1,
  firewallsCompleted: 0,
  missionPhase: 'playing',  // 'setup' | 'playing' | 'paused' | 'complete'
  
  // Current problem state
  currentProblem: {...},
  wrongAttemptsThisFirewall: 0,
  hintsGivenThisFirewall: 0,
  lastDetectedPattern: null,
  lastPatternConfidence: 0,
  
  // Mission-wide tracking
  totalWrongAnswers: 0,
  totalHintsGiven: 0,
  patternsEncountered: {},  // { 'FORGOT_TO_CARRY': 3, 'OFF_BY_ONE': 1 }
  
  // Character appearances
  widowAppearances: 0,
  lastWidowFirewall: 0,
  widowIntroPlayed: false,
  furyCompleted: [false, false, false],  // FW 3, 6, 9
  
  // Audio tracking (avoid repetition)
  usedCorrectIds: new Set(),
  usedWrongIds: new Set(),
  usedHintIds: new Set()
}
```

### Data Flow Diagram

```
+----------------------------------------------------------------------+
|  TEACHER CLICKS "BEGIN MISSION" (Grade 3, selected TEKS)             |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  AI GENERATES 10 MATH + 3 SCIENCE PROBLEMS                           |
|  Each problem includes:                                              |
|    - narrative: "Jarvis is calculating suit components..."           |
|    - expression: "47 + 28 = ?"                                       |
|    - correctAnswer: 75                                               |
|    - problemData: { operation: 'ADD', operands: [47, 28], ... }      |
|    - diagnosticFor: ['FORGOT_TO_CARRY']  <- Key for detection!        |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  MISSION STARTS - FIREWALL 1 DISPLAYED                               |
|  Student sees: "Jarvis is calculating... 47 + 28 = ?"                |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  STUDENT ANSWER ENTERED (via teacher typing or voice)                |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  PATTERN DETECTION RUNS                                              |
|  detectMathError(75, studentAnswer, problemData, 3)                  |
+----------------------------------------------------------------------+
                                   |
              +--------------------+--------------------+
              v                                        v
+-------------------------+              +-------------------------+
|  CORRECT                |              |  WRONG                  |
|  - Play CORRECT-XX      |              |  - Play WRONG-XX        |
|  - Update firewall UI   |              |  - Store pattern        |
|  - Check Fury (3,6,9)   |              |  - Check hint trigger   |
|  - Advance firewall     |              |  - Check Widow trigger  |
+-------------------------+              +-------------------------+
                                                      |
                                                      v
                                         +-------------------------+
                                         |  HINT DECISION          |
                                         |  IF wrongAttempts >= 2  |
                                         |    AND meetsThreshold   |
                                         |    -> Pattern hint       |
                                         |  ELSE                   |
                                         |    -> Generic hint       |
                                         +-------------------------+
                                                      |
                                                      v
                                         +-------------------------+
                                         |  WIDOW CHECK            |
                                         |  IF wrongAttempts >= 2  |
                                         |    AND conditions met   |
                                         |    -> Widow appears      |
                                         +-------------------------+
```

### Event System

The mission system emits events for UI updates:

| Event | When Emitted | Data |
|-------|--------------|------|
| `missionStarted` | After AI generation complete | { gradeLevel, problemCount } |
| `firewallStarted` | New firewall displayed | { firewallNumber, problem } |
| `answerCorrect` | Correct answer submitted | { firewallNumber, problem } |
| `answerWrong` | Wrong answer submitted | { firewallNumber, studentAnswer, pattern, confidence } |
| `hintTriggered` | Hint plays | { hintId, pattern, isPatternBased } |
| `furyAppears` | Fury interrupts at 3/6/9 | { firewallNumber, question } |
| `furyCorrect` | Science answer correct | { firewallNumber } |
| `furyWrong` | Science answer wrong | { firewallNumber, studentAnswer } |
| `blackWidowAppears` | Widow shows up | { hintId, isPatternBased } |
| `firewallBreached` | Firewall completed | { firewallNumber, attemptsUsed } |
| `missionComplete` | All 10 firewalls done | { totalWrong, patternsEncountered, duration } |
| `missionPaused` | Teacher pressed P | { firewallNumber } |
| `missionResumed` | Teacher pressed R | { firewallNumber } |

### Answer Processing Pipeline

```javascript
// 1. Validate input
const validationResult = validateInput(rawInput);
if (!validationResult.valid) {
  showError(validationResult.message);
  return;
}

// 2. Parse answer based on expected type
const parsedAnswer = parseAnswer(rawInput, problem.answerType);

// 3. Check correctness
const isCorrect = checkAnswer(parsedAnswer, problem.correctAnswer);

// 4. If wrong, run pattern detection
if (!isCorrect) {
  const detection = detectMathError(
    problem.correctAnswer,
    parsedAnswer,
    problem.problemData,
    missionState.gradeLevel
  );
  
  missionState.lastDetectedPattern = detection.pattern;
  missionState.lastPatternConfidence = detection.confidence;
  
  // Handle wrong answer
  handleWrongAnswer(detection);
} else {
  // Handle correct answer
  handleCorrectAnswer();
}
```

---

## 9. Response Bank Reference

The complete response bank is in `response_bank.md` (750+ lines). Here's the structure:

| Section | Count | Description |
|---------|-------|-------------|
| 1. Opening Sequence | 5 | Director Override sequence (OPEN-01 through OPEN-04, plus Fury's OPEN-03b) |
| 2. Correct Answers | 41 | Generic (CORRECT-01 to -30) + Milestones (HALF, POSTFURY, FINAL-INTRO) |
| 3. Wrong - Math | 41 | WRONG-01 through WRONG-41 (includes Gen Alpha slang WRONG-26 to -41) |
| 4. Wrong - Science | 11 | FURY-WRONG-01 through FURY-WRONG-11 |
| 5. Hints | 35 | Pattern-based (HINT-PAT-01 to -20) + Generic (HINT-GEN-01 to -15) |
| 6. Banter Triggers | 34 | BANTER-SNACK, BANTER-REPROGRAM, BANTER-NEXT, etc. |
| 7. Roasts | 30 | ROAST-01 through ROAST-30 (Gen Alpha slang) |
| 8. Black Widow | 36 | WIDOW-INTRO, WIDOW-HINT, WIDOW-WARN, WIDOW-FINAL |
| 9. Nick Fury | 27 | FURY-INTRO-3/6/9, FURY-CORRECT, FURY-TAUNT |
| 10. Encouragement | 31 | ENCOURAGE, ENCOURAGE-STRUGGLE, HYPE, EFFORT |
| 11. Celebration | 40 | VICTORY, COMPLETE, TONY-PRAISE, STUDENT-PRAISE, MCU-CELEBRATE, ARC-SCIENCE, SIGNOFF |
| 12. Miscellaneous | 56 | ACK, IDLE, TECH, REPEAT, INPUT, PAUSE/RESUME, BREAK, START, CLARIFY, TIME |

### Pattern-to-Hint Mapping (Complete)

| Pattern | Primary Jarvis Hints | Alternative Hints | Black Widow Hints |
|---------|---------------------|-------------------|-------------------|
| OFF_BY_ONE | HINT-PAT-01 | HINT-PAT-02 | WIDOW-HINT-01, -02 |
| OFF_BY_TEN | HINT-PAT-03 | HINT-PAT-04 | WIDOW-HINT-03, -04 |
| OFF_BY_HUNDRED | HINT-PAT-05 | -- | WIDOW-HINT-05 |
| DIGIT_TRANSPOSITION | HINT-PAT-06 | HINT-PAT-07 | WIDOW-HINT-06, -07 |
| FORGOT_TO_CARRY | HINT-PAT-08 | HINT-PAT-09 | WIDOW-HINT-08 |
| FORGOT_TO_BORROW | HINT-PAT-10 | -- | WIDOW-HINT-09 |
| WRONG_OP_ADD_SUB | HINT-PAT-11 | HINT-PAT-19 | WIDOW-HINT-10, -11 |
| WRONG_OP_MULT_ADD | HINT-PAT-12 | HINT-PAT-13 | WIDOW-HINT-10, -11 |
| OFF_BY_ONE_GROUP | HINT-PAT-14 | -- | WIDOW-HINT-16 |
| DECIMAL_PLACE | HINT-PAT-15 | HINT-PAT-16 | WIDOW-HINT-12, -13 |
| FRACTION_DENOMINATOR | HINT-PAT-17 | -- | WIDOW-HINT-14 |
| FRACTION_SIMPLIFY | HINT-PAT-18 | -- | WIDOW-HINT-15 |
| WRONG_OP_DIV_MULT | HINT-PAT-20 | -- | WIDOW-HINT-10 |
| (Unknown pattern) | HINT-GEN-01 to -15 | -- | WIDOW-HINT-GEN-01 to -08 |

---

## 10. Audio Architecture

### Audio Status Summary

| Category | Status | Format | Count |
|----------|--------|--------|-------|
| **Sound Effects** | [DONE] COMPLETE | WAV | 23 files |
| **Jarvis Dialogue** | X NOT RECORDED | WAV (planned) | ~200 lines in response bank |
| **Nick Fury Dialogue** | X NOT RECORDED | WAV (planned) | ~30 lines in response bank |
| **Black Widow Dialogue** | X NOT RECORDED | WAV (planned) | ~40 lines in response bank |

**Voice Cloning Status:**
- **Jarvis:** READY - Voice ID: `585af41f-1554-4b87-88d6-fb47127a48b9`
- **Nick Fury:** TO BE CLONED BY USER
- **Black Widow:** TO BE CLONED BY USER

### Sound Effects Inventory (23 files -- ALL COMPLETE)

These are the actual sound effect files currently available:

| Filename | Purpose | When to Use |
|----------|---------|-------------|
| `access-granted.wav` | Success confirmation | Firewall breached |
| `arc-charge.wav` | Energy building | Before major actions |
| `arc-reactor-hum.wav` | Ambient background | Continuous low-level ambience |
| `arc-reactor-pulse.wav` | Energy pulse | Correct answer accent |
| `breach-complete.wav` | Major milestone | Firewall fully breached |
| `data-scroll.wav` | Information display | When data/text appears on screen |
| `data-stream.wav` | Data transfer | During decryption sequences |
| `glitch-heavy.wav` | Major interference | Fury interruption, major errors |
| `glitch-static.wav` | Minor interference | Black Widow transmission |
| `hint-chime.wav` | Hint notification | When hint is triggered |
| `ripple-whoosh.wav` | Transition effect | Screen transitions |
| `scan-sweep.wav` | Scanning animation | When system analyzes input |
| `science-correct.wav` | Science success | Fury question answered correctly |
| `science-wrong.wav` | Science failure | Fury question answered incorrectly |
| `segment-fill.wav` | Progress tick | Progress bar segment fills |
| `text-slam.wav` | Text emphasis | Important text appears forcefully |
| `The Avengers Theme.wav` | Victory music | Mission complete celebration |
| `ui-click.wav` | Button interaction | Any clickable element |
| `ui-hover.wav` | Hover feedback | Mouse over interactive elements |
| `ui-type.wav` | Typing feedback | Text input / problem display |
| `warning.wav` | Alert | Error states, Fury incoming |
| `widow-appearance.wav` | Character entrance | Black Widow transmission starts |
| `wrong-answer.wav` | Incorrect feedback | Math answer is wrong |

### Planned File Organization

```
/iron-man-mission/
+-- audio/
|   +-- dialogue/                    X TO BE RECORDED (via Cartesia)
|   |   +-- jarvis/
|   |   |   +-- opening/             (open-01.wav through open-04.wav)
|   |   |   +-- correct/             (correct-01.wav through correct-30.wav, plus milestones)
|   |   |   +-- wrong/               (wrong-01.wav through wrong-41.wav)
|   |   |   +-- hints/               (hint-pat-01.wav through -20.wav, hint-gen-01.wav through -15.wav)
|   |   |   +-- banter/              (banter-*.wav)
|   |   |   +-- roasts/              (roast-01.wav through roast-30.wav)
|   |   |   +-- encouragement/       (encourage-*.wav, hype-*.wav, effort-*.wav)
|   |   |   +-- celebration/         (victory-*.wav, complete-*.wav, signoff-*.wav)
|   |   |   +-- misc/                (ack-*.wav, idle-*.wav, tech-*.wav, etc.)
|   |   +-- fury/
|   |   |   +-- intros/              (fury-intro-3-*.wav, fury-intro-6-*.wav, fury-intro-9-*.wav)
|   |   |   +-- correct/             (fury-correct-*.wav)
|   |   |   +-- wrong/               (fury-wrong-*.wav)
|   |   |   +-- taunts/              (fury-taunt-*.wav)
|   |   +-- widow/
|   |       +-- intro/               (widow-intro-01.wav, -02.wav)
|   |       +-- hints/               (widow-hint-*.wav)
|   |       +-- warnings/            (widow-warn-*.wav)
|   |       +-- final/               (widow-final-*.wav)
|   |
|   +-- sfx/                         [DONE] COMPLETE (23 files)
|       +-- access-granted.wav
|       +-- arc-charge.wav
|       +-- arc-reactor-hum.wav
|       +-- arc-reactor-pulse.wav
|       +-- breach-complete.wav
|       +-- data-scroll.wav
|       +-- data-stream.wav
|       +-- glitch-heavy.wav
|       +-- glitch-static.wav
|       +-- hint-chime.wav
|       +-- ripple-whoosh.wav
|       +-- scan-sweep.wav
|       +-- science-correct.wav
|       +-- science-wrong.wav
|       +-- segment-fill.wav
|       +-- text-slam.wav
|       +-- The Avengers Theme.wav
|       +-- ui-click.wav
|       +-- ui-hover.wav
|       +-- ui-type.wav
|       +-- warning.wav
|       +-- widow-appearance.wav
|       +-- wrong-answer.wav
```

### Audio Lookup System

The system uses JavaScript objects for instant lookup. **Sound effects are ready NOW; dialogue requires recording first.**

```javascript
// SOUND EFFECTS - READY NOW *
const sfxRegistry = {
  ui: {
    click: 'ui-click.wav',
    hover: 'ui-hover.wav',
    type: 'ui-type.wav'
  },
  mission: {
    accessGranted: 'access-granted.wav',
    breachComplete: 'breach-complete.wav',
    wrongAnswer: 'wrong-answer.wav',
    warning: 'warning.wav',
    hintChime: 'hint-chime.wav',
    segmentFill: 'segment-fill.wav'
  },
  transitions: {
    rippleWhoosh: 'ripple-whoosh.wav',
    textSlam: 'text-slam.wav',
    scanSweep: 'scan-sweep.wav'
  },
  data: {
    dataScroll: 'data-scroll.wav',
    dataStream: 'data-stream.wav'
  },
  arcReactor: {
    hum: 'arc-reactor-hum.wav',
    pulse: 'arc-reactor-pulse.wav',
    charge: 'arc-charge.wav'
  },
  characters: {
    glitchHeavy: 'glitch-heavy.wav',       // Fury interruption
    glitchStatic: 'glitch-static.wav',     // Widow transmission
    widowAppearance: 'widow-appearance.wav'
  },
  science: {
    correct: 'science-correct.wav',
    wrong: 'science-wrong.wav'
  },
  celebration: {
    avengersTheme: 'The Avengers Theme.wav'
  }
};

// DIALOGUE - REQUIRES CARTESIA RECORDING X
// Structure prepared but files don't exist yet
const dialogueRegistry = {
  jarvis: {
    correct: {
      generic: ['CORRECT-01', 'CORRECT-02', ...], // 30 IDs from response bank
      halfway: ['CORRECT-HALF-01', 'CORRECT-HALF-02', 'CORRECT-HALF-03'],
      postFury: ['CORRECT-POSTFURY-01', ...], // 4 IDs
      finalIntro: ['CORRECT-FINAL-INTRO-01', ...] // 4 IDs
    },
    wrong: ['WRONG-01', 'WRONG-02', ...], // 41 IDs
    hints: {
      pattern: ['HINT-PAT-01', 'HINT-PAT-02', ...], // 20 IDs
      generic: ['HINT-GEN-01', 'HINT-GEN-02', ...] // 15 IDs
    }
    // ... etc.
  },
  fury: { ... },
  widow: { ... }
};
```

### Avoiding Repetition

The mission state tracks which audio IDs have been used:

```javascript
function getUnusedAudioId(category, usedSet) {
  const available = audioRegistry[category].filter(id => !usedSet.has(id));
  if (available.length === 0) {
    // All used - reset and start over
    usedSet.clear();
    return audioRegistry[category][0];
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  usedSet.add(selected);
  return selected;
}
```

### Browser TTS Fallback

Until dialogue is recorded, the system can use browser TTS:
- `mission-integration.js` includes a text bank mapping audio IDs to their lines
- If audio file not found, speaks the line using Web Speech API
- Less immersive but allows testing full mission flow

---

## 11. Teacher Controls

### Keyboard Shortcuts

| Key | Action | When Available |
|-----|--------|----------------|
| **Space** | Advance/Next | When waiting for input, or to skip ahead |
| **H** | Request Hint | During any firewall (uses last detected pattern if available) |
| **M** | Mute/Unmute Mic | Anytime |
| **P** | Pause Mission | During gameplay |
| **R** | Resume Mission | While paused |
| **Enter** | Submit Answer | When answer input has focus |

### Hint Triggering (H key)

When teacher presses H:
1. Check if `lastDetectedPattern` exists (from previous wrong answer)
2. If yes AND confidence >= threshold -> play pattern-specific hint
3. If no pattern -> play generic hint
4. Increment `hintsGivenThisFirewall`
5. Mark hint ID as used

### Answer Input Methods

1. **Keyboard:** Teacher types answer, presses Enter
2. **Voice:** Teacher speaks answer naturally (Web Speech API)

### Answer Validation

Accept multiple formats:
- **Numbers:** "37" or "thirty-seven" or "the answer is thirty-seven"
- **Fractions:** "3/4" or "three fourths" or "three over four"
- **Multiple choice:** "B" or "Answer B" or "the answer is B"

---

## 12. Configuration Constants [NEW]

All tunable parameters in one place:

```javascript
const CONFIG = {
  // Pattern Detection
  CONFIDENCE_THRESHOLD: 0.80,        // Minimum confidence to use pattern-specific hint
  
  // Hint System [UPDATED v3.7]
  WRONG_ATTEMPTS_BEFORE_HINT: 1,     // Jarvis text hint on 1st wrong answer
  WRONG_ATTEMPTS_BEFORE_WIDOW: 2,    // Widow ALWAYS appears on 2nd wrong answer
  
  // Black Widow [UPDATED v3.7 -- deterministic, no randomness]
  // WIDOW_APPEARANCE_CHANCE removed -- Widow is now deterministic (always appears when threshold met)
  MAX_WIDOW_APPEARANCES: 4,          // Maximum times she can appear per mission
  MIN_FIREWALLS_BETWEEN_WIDOW: 2,    // Gap required between appearances
  
  // Fury
  FURY_FIREWALLS: [3, 6, 9],         // Which firewalls have Fury interruptions
  
  // Timing (milliseconds)
  DELAY_AFTER_CORRECT: 2000,         // Pause after correct answer
  DELAY_AFTER_WRONG: 1500,           // Pause after wrong answer
  DELAY_BEFORE_HINT: 1500,           // Pause before Jarvis hint text appears in dialogue box
  DELAY_BEFORE_WIDOW: 500,           // Pause before Widow appears
  
  // Mission
  PROBLEMS_PER_MISSION: 10,          // Number of math firewalls
  SCIENCE_QUESTIONS_PER_MISSION: 3,  // Number of Fury interruptions
  
  // Audio [UPDATED v3.7]
  AUDIO_EXTENSION: '.wav',           // All audio files are WAV format
  SFX_PATH: './audio/sfx/',          // Sound effects path
  DIALOGUE_PATH: './audio/dialogue/',// Dialogue path (when recorded)
  // AMBIENT_DEFAULT_VOLUME removed -- ambient hum disabled in v3.7
  EFFECTS_DEFAULT_VOLUME: 0.7,       // Default sound effects volume
  VOICE_DEFAULT_VOLUME: 1.0,         // Default character voice volume
  USE_TTS_FALLBACK: true             // Use browser TTS when audio file missing
};
```

---

## 13. Implementation Files [NEW]

### Complete JavaScript Modules

These files are **COMPLETE** and ready to integrate:

| File | Lines | Status | Location |
|------|-------|--------|----------|
| `pattern-detector.js` | ~1,100 | * Complete | Project uploads / outputs |
| `mission-integration.js` | ~1,580 | * Complete | Project uploads / outputs |
| `sound-manager.js` | ~500 | * Complete | Project uploads (GitHub-ready) |

### Phase 2.5 Implementation Files

These files were created during Phase 2.5 (GSAP + PixiJS integration) and exist in the GitHub repo:

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| `hud-config.js` | `js/hud-config.js` | * Complete | Central configuration object (`window.HUD_CONFIG`) |
| `im-animations.css` | `css/im-animations.css` | * Complete | Namespaced CSS foundation for all animation classes |
| `firewall-sequence.js` | `js/firewall-sequence.js` | * Complete | Transition engine -- 6 randomized transitions, GSAP timeline orchestration |
| `pixi-effect-manager.js` | `js/pixi-effect-manager.js` | * Complete | PixiJS singleton manager (single PIXI.Application, GSAP ticker sync) |

### Script & CSS Load Order [v3.5]

This is the complete dependency chain for `index.html`. Files MUST load in this order or you'll get undefined reference errors. Claude Code should consult this table whenever adding or moving `<script>` or `<link>` tags.

| # | File | Type | Why This Position |
|---|------|------|-------------------|
| 1 | `augmented-ui` CSS (CDN) | `<link>` | External dependency -- base UI framework |
| 2 | `css/im-animations.css` | `<link>` | Namespaced animation CSS -- loads AFTER augmented-ui so it can extend, BEFORE styles.css so styles.css can override |
| 3 | `css/styles.css` | `<link>` | Main stylesheet -- last CSS file, can override anything above |
| 4 | PixiJS 7.4.2 (CDN) | `<script>` | GPU rendering engine -- must load before anything that uses PIXI |
| 5 | pixi-filters 5.3.0 (CDN) | `<script>` | 45 GPU filter effects -- requires PixiJS loaded first |
| 6 | `node_modules/gsap/dist/gsap.min.js` | `<script>` | Animation engine -- must load before PixiPlugin and any GSAP users |
| 7 | `node_modules/gsap/dist/PixiPlugin.min.js` | `<script>` | GSAP^PixiJS bridge -- requires both GSAP and PixiJS loaded |
| 8 | `js/hud-config.js` | `<script>` | `window.HUD_CONFIG` -- read by nearly everything, load early |
| 9 | `js/pixi-effect-manager.js` | `<script>` | `window.pixiEffectManager` -- requires PixiJS + GSAP, read by firewall-sequence |
| 10 | `js/firewall-sequence.js` | `<script>` | `window.transitionEngine` -- requires hud-config + pixi-effect-manager |
| 11 | `js/sound-manager.js` | `<script>` | Sound system -- independent, can load anywhere after DOM |
| 12 | `js/pattern-detector.js` | `<script>` | Error analysis -- independent |
| 13 | `js/mission-integration.js` | `<script>` | Mission orchestrator -- requires everything above |
| 14 | `js/app.js` | `<script>` | Entry point -- last, wires everything together |

### pattern-detector.js

**Purpose:** Analyzes student math errors to detect specific mistake patterns and return appropriate hint IDs.

**Main function:** `detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel)`

**Returns:**
```javascript
{
  correct: boolean,
  pattern: string | null,        // e.g., 'FORGOT_TO_CARRY'
  confidence: number,            // 0.0 - 1.0
  hintId: string,                // e.g., 'HINT-PAT-08'
  widowHintId: string,           // e.g., 'WIDOW-HINT-08'
  meetsThreshold: boolean,       // confidence >= CONFIG.CONFIDENCE_THRESHOLD
  allMatches: Array              // All patterns that matched, sorted by confidence
}
```

**Key features:**
- 24 error pattern detectors (addition, subtraction, multiplication, division, fractions, decimals, place value, wrong operations)
- Confidence scoring with grade-level adjustments
- Tracks used hints to avoid repetition
- Maps patterns directly to response bank hint IDs
- Works as both ES6 module and browser global (`window.PatternDetector`)

### mission-integration.js

**Purpose:** Connects all mission components -- problem generation, pattern detection, audio, state management, UI events.

**Core functions:**
- `startMission(gradeLevel, mathTeks, scienceTeks)` -- Initiates AI generation and starts mission
- `processAnswer(rawInput)` -- Handles answer submission, runs pattern detection
- `advanceFirewall()` -- Moves to next firewall
- `triggerHint()` -- Manual hint request (H key)
- `pauseMission()` / `resumeMission()` -- Teacher controls
- `onMissionEvent(eventName, callback)` -- Subscribe to UI update events
- `getMissionState()` -- Returns current state (read-only)

**Event system (for UI updates):**
```javascript
// Subscribe to events
onMissionEvent('answerCorrect', (data) => {
  // data: { firewall, problem, audioId }
  showSuccessAnimation();
});

onMissionEvent('answerWrong', (data) => {
  // data: { firewall, problem, pattern, confidence, audioId }
  showErrorFeedback();
});

onMissionEvent('hintTriggered', (data) => {
  // data: { hintId, pattern, character }
  displayHintUI();
});

// Other events: missionStarted, firewallStarted, furyAppears, 
// blackWidowAppears, firewallBreached, missionComplete, etc.
```

**Key features:**
- Single source of truth mission state object
- Event-driven architecture for UI updates
- Teacher keyboard controls (Space/H/M/P/R/Enter)
- Audio system with TTS fallback
- Fury interruption logic (firewalls 3, 6, 9)
- Black Widow appearance logic (configurable, currently in flux)
- Works as both ES6 module and browser global (`window.IronManMission`)

### sound-manager.js

**Purpose:** High-performance audio pooling system for instant sound playback during transitions and feedback.

**Features:**
- Audio pools (3 instances each) for frequently-used sounds -- eliminates playback delay
- 23 sounds mapped to actual WAV files (UI, arc reactor, transitions, feedback, dramatic moments)
- Master volume controls (master, effects, voice, ambient) with slider integration
- Loop control with fade-out support
- Preloading system (critical sounds load first, then all)
- AudioContext integration for precise timing

**Sound categories:**
- **UI Feedback:** click, hover, type
- **Arc Reactor:** charge, pulse, hum (looping)
- **Transitions:** whoosh, scan-sweep, glitch-burst, glitch-static, data-stream, data-scroll, text-slam
- **Math Feedback:** success (access-granted), error (wrong-answer), hint-chime
- **Science Feedback:** science-correct, science-wrong, warning
- **Black Widow:** widow-appearance
- **Dramatic:** breach-complete, segment-fill, victory-fanfare (Avengers theme)

**Key methods:**
```javascript
soundManager.init();                    // Call on first user interaction
soundManager.play('access-granted');    // Play sound by kebab-case key (see table below)
soundManager.play('arc-reactor-pulse', { volume: 0.5, delay: 0.2 });
soundManager.playSequence([...]);       // Play sounds in sequence with timing
// soundManager.startLoop('arc-reactor-hum');  // DISABLED v3.7 -- ambient hum removed
// soundManager.stopLoop('arc-reactor-hum', 0.5);  // DISABLED v3.7
soundManager.setEffectsVolume(0.75);    // Adjust category volume
soundManager.preloadCritical();         // Preload essential sounds
```

**CRITICAL: `typeof` guard pattern [v3.7]:** `soundManager` is declared with `const` at the top level of sound-manager.js. In JavaScript, `const` and `let` declarations are NOT properties of `window` (only `var` is). Therefore `window.soundManager` evaluates to `undefined` even though `soundManager` exists. All guards in external files MUST use:
```javascript
// CORRECT:
if (typeof soundManager !== 'undefined') soundManager.play('key');

// BROKEN -- DO NOT USE:
if (window.soundManager) soundManager.play('key');  // Always false!
```

**Integration:** Connects to UI volume sliders via DOM IDs (`slider-ambient`, `slider-effects`, `slider-voice`)

**Sound Key Reference Table:** [v3.5]
The `soundManager.play()` method accepts kebab-case keys that map directly to WAV files. Keys are the file stems (filename without `.wav` extension):

| play() Key | File | Category |
|------------|------|----------|
| `access-granted` | access-granted.wav | Math Feedback |
| `wrong-answer` | wrong-answer.wav | Math Feedback |
| `hint-chime` | hint-chime.wav | Math Feedback |
| `science-correct` | science-correct.wav | Science Feedback |
| `science-wrong` | science-wrong.wav | Science Feedback |
| `warning` | warning.wav | Science Feedback |
| `arc-charge` | arc-charge.wav | Ambient/HUD |
| `arc-reactor-hum` | arc-reactor-hum.wav | Ambient/HUD |
| `arc-reactor-pulse` | arc-reactor-pulse.wav | Ambient/HUD |
| `ui-click` | ui-click.wav | UI Interaction |
| `ui-hover` | ui-hover.wav | UI Interaction |
| `ui-type` | ui-type.wav | UI Interaction |
| `breach-complete` | breach-complete.wav | Transitions |
| `data-scroll` | data-scroll.wav | Transitions |
| `data-stream` | data-stream.wav | Transitions |
| `glitch-heavy` | glitch-heavy.wav | Transitions |
| `glitch-static` | glitch-static.wav | Transitions |
| `ripple-whoosh` | ripple-whoosh.wav | Transitions |
| `scan-sweep` | scan-sweep.wav | Transitions |
| `segment-fill` | segment-fill.wav | Transitions |
| `text-slam` | text-slam.wav | Transitions |
| `widow-appearance` | widow-appearance.wav | Black Widow |
| `the-avengers-theme` | The Avengers Theme.wav | Dramatic |

**Note:** The `HUD_CONFIG.audio.sfxRegistry` uses camelCase variants of these same keys (e.g. `sfxRegistry.mission.accessGranted` -> `'access-granted.wav'`). When calling `soundManager.play()`, always use the kebab-case key from this table.

### hud-config.js [v3.3]

**Purpose:** Central configuration object for all animation timing, colors, easing, and transition pool values. Exposed as `window.HUD_CONFIG` (global, since no module bundler).

**Location:** `js/hud-config.js` -- loaded via `<script>` tag BEFORE `firewall-sequence.js` and `animations.js`

**Structure:**
```javascript
window.HUD_CONFIG = {
  colors: {
    cyan: '#00d4ff',          // Primary Jarvis HUD color
    red: '#ff3333',           // Wrong answers only
    widowCrimson: '#cc0000',  // Black Widow primary [ADDED v3.6]
    widowDark: '#8b0000',     // Black Widow shadows [ADDED v3.6]
    widowGlow: '#ff1a1a',     // Black Widow highlights/glow [ADDED v3.6]
    amber: '#ff8c00',         // Fury/SHIELD alerts, science screen theme [ADDED v3.6]
    amberBright: '#ffaa00',   // Fury/SHIELD glow/accent [ADDED v3.6]
    green: '#00ff00',         // Correct answer feedback
    white: '#ffffff',
    dark: '#0a0a0a',
    // All character colors defined above: cyan (Jarvis), amber (Fury), crimson (Widow)
  },
  timing: {
    scrambleText: 1.2,        // ScrambleText effect duration (seconds)
    correctFlash: 0.3,        // Green flash duration
    wrongShake: 0.5,          // Shake animation duration
    firewallBreach: 2.0,      // Full breach celebration sequence
    furyAlertPulse: 0.5,      // Amber border pulse duration
    furyAlertCount: 4,        // Number of amber pulses before Fury appears
    transitionDelay: 1.5,     // Pause before advancing to next firewall
    inputLockBuffer: 0.3,     // Extra time to keep input locked after animation
    widowIntroDuration: 8.0,  // Widow intro overlay default (overridden by audio length) [ADDED v3.6]
    widowHintDuration: 5.0,   // Widow hint panel default (overridden by audio length) [ADDED v3.6]
    widowFinalDuration: 6.0,  // Widow final transmission default (overridden by audio length) [ADDED v3.6]
    // + transitionDuration, audioDriftTolerance
  },
  easing: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    sharp: 'power4.out',
    dramatic: '...',          // For cinematic transitions
  },
  effects: {
    scrambleChars: '01!<>-_\\/[]{}=+*^?#@$%',
    transitionPool: [
      'arc_reactor_pulse', 'scan_sweep',
      'ripple_wave', 'access_granted', 'data_cascade'
    ]
  },
  mission: {
    totalFirewalls: 10,              // Math firewalls only -- science interruptions are separate screens, not counted here
    scienceInterruptions: [3, 6, 9],
    totalScienceQuestions: 3
  },
  audio: {
    // sfxRegistry: maps logical sound names to WAV filenames
    // dialogueCategories: maps response bank category names to ID prefixes
  }
};
```

**Key usage patterns:**
```javascript
// Transitions read from the pool
const type = HUD_CONFIG.effects.transitionPool[randomIndex];

// GSAP timelines reference timing/easing
gsap.to(el, { duration: HUD_CONFIG.timing.correctFlash, ease: HUD_CONFIG.easing.sharp });

// Colors used throughout
el.style.borderColor = HUD_CONFIG.colors.cyan;
```

**Critical rule:** DO NOT modify `hud-config.js` unless the task specifically asks to change config values. Other files READ from it -- they don't write to it.

### im-animations.css [v3.3]

**Purpose:** Namespaced CSS foundation for all animation and transition classes. Contains CSS custom properties (`--im-*` prefix), class families for four component types, and placeholder `@keyframes`.

**Location:** `css/im-animations.css` -- loaded via `<link>` tag AFTER augmented-ui CSS but BEFORE `styles.css` (so `styles.css` can override if needed)

**CSS Namespace Families:**

The brief's Complications & Mitigations table (Section 2) mandates strict namespacing to avoid CSS conflicts. All animation classes use one of four prefixes:

`.im-reactor-*` -- Arc reactor component classes (`.im-reactor-container`, `.im-reactor-core`, `.im-reactor-ring-1`, etc.)

`.im-panel-*` -- HUD panel effect classes for Fury alerts (`.im-panel-flash`, `.im-panel-pulse`, `.im-panel-border-glow`, `.im-panel-takeover`)

`.im-glitch-*` -- Glitch/distortion effect classes (`.im-glitch-overlay`, `.im-glitch-text`, `.im-glitch-burst`, `.im-glitch-scanline`, `.im-glitch-static`)

`.im-transition-*` -- Full-screen transition overlay classes (`.im-transition-overlay`, `.im-transition-overlay.active`, `.im-transition-content`, `.im-transition-text`)

**CSS Custom Properties:**
```css
:root {
  /* --im-* prefix avoids conflicts with existing --hud-* in styles.css */
  --im-cyan: #00d4ff;
  --im-red: #ff3333;
  --im-green: #00ff00;
  --im-fury-amber: #ff8c00;      /* Fury/SHIELD primary [ADDED v3.6] */
  --im-fury-amber-bright: #ffaa00; /* Fury/SHIELD glow [ADDED v3.6] */
  --im-widow-crimson: #cc0000;   /* Black Widow primary [ADDED v3.6] */
  --im-widow-dark: #8b0000;      /* Black Widow shadows [ADDED v3.6] */
  --im-widow-glow: #ff1a1a;      /* Black Widow highlights [ADDED v3.6] */
  /* + animation-specific durations, glow sizes, blur amounts */
}
```

**Placeholder @keyframes:** `im-reactor-spin`, `im-reactor-pulse`, `im-panel-flash`, `im-glitch-flicker` -- skeleton implementations that future phases build on.

**Critical rule:** When adding new animation CSS, put it in `im-animations.css` using the appropriate `.im-*` namespace prefix. Do NOT add animation CSS to `styles.css`.

### firewall-sequence.js [v3.4]

**Purpose:** Transition engine that orchestrates full-screen animations between firewalls. Contains the `FirewallSequence` class with 5 randomized GSAP transition types, overlay show/hide logic, and PixiJS integration hooks. Also contains the `_buildWidowGlitch()` method for Black Widow's intro animation (crimson palette, called independently, NOT in the random pool).

**Location:** `js/firewall-sequence.js` -- loaded AFTER `hud-config.js` and `pixi-effect-manager.js` (reads from both).

**Global instance:** `window.transitionEngine` -- the singleton `FirewallSequence` instance created at file load. All external code (app.js, console testing, etc.) accesses transitions through this global. Do NOT create additional `FirewallSequence` instances.

```javascript
// How other code triggers transitions:
window.transitionEngine.playTransition(function(transitionType) {
  console.log('Transition complete:', transitionType);  // e.g. "arc_reactor_pulse"
  // Advance to next firewall here
});
```

**Key methods:**

`playTransition(callback)` -- Picks a random transition from `HUD_CONFIG.effects.transitionPool`, shows the overlay, runs the GSAP timeline, hides the overlay, then calls `callback(transitionTypeString)`. The callback receives the transition type name (e.g. `"data_cascade"`) as its only argument. Returns early if a transition is already playing (`this.isPlaying` guard).

`destroy()` -- Kills any active GSAP timeline, hides the overlay immediately, resets `isPlaying` to false. Used for emergency cleanup or when the mission ends.

**Overlay interaction:**
The class manages the `#transition-overlay` and `#transition-content` DOM elements. It uses `classList.add('active')` / `classList.remove('active')` to toggle visibility (never GSAP's `className` property -- see Claude Code Guidelines). GSAP animates the overlay's opacity for fade-in/fade-out.

**PixiJS integration hooks:**
At the start of each transition, `playTransition()` calls `pixiEffectManager.init(this.content)` to insert the PixiJS canvas inside the transition content container. At the end, it calls `pixiEffectManager.reset()` to clear GPU resources. The PixiJS canvas sits at z-index 1 behind DOM text elements (z-index 2+).

**5 transition types** (randomized per firewall, dispatched via `_build[TransitionName]()` private methods): `access_granted`, `scan_sweep`, `ripple_wave`, `arc_reactor_pulse`, `data_cascade`. NOTE: `glitch_burst` was removed from the transition pool in v3.6 and repurposed as `_buildWidowGlitch()` -- exclusively used for Black Widow's intro animation with a crimson/black color palette.

**Critical rule:** Do NOT create a second `FirewallSequence` instance. Always use the existing `window.transitionEngine` global. The singleton pattern prevents WebGL context exhaustion and overlay state conflicts.

### pixi-effect-manager.js [v3.4]

**Purpose:** PixiJS singleton manager. Maintains a single `PIXI.Application` instance across all transitions, preventing WebGL context exhaustion.

**Location:** `js/pixi-effect-manager.js` -- loaded AFTER PixiJS CDN scripts and GSAP PixiPlugin, BEFORE `firewall-sequence.js`.

**Global instance:** `window.pixiEffectManager` -- the singleton `PixiEffectManager` instance.

**Key methods:**

`init(containerElement)` -- Creates or re-attaches the PIXI.Application canvas inside `containerElement`. Idempotent: if already initialized and canvas is still a child of containerElement, returns early. Sets `backgroundAlpha: 0` (transparent canvas), stops PixiJS ticker, and connects GSAP ticker to drive rendering via `app.renderer.render(app.stage)`.

`reset()` -- Destroys all children on the stage (`texture: false` -- preserves the WebGL context). Removes any stage-level filters. Call this between transitions to clean up GPU resources.

`getApp()`, `getStage()`, `getWidth()`, `getHeight()` -- Accessor methods for the PIXI.Application and its dimensions.

**Canvas styling:** Position absolute, z-index 1 (behind DOM text at z-index 2+), `pointerEvents: 'none'` (clicks pass through to DOM elements underneath).

---

## 14. Build Phases

### Philosophy: Test Early, Test Independently

> **Core Insight:** The worst situation is building something that depends on three other things, because when it breaks you don't know which piece failed. Each phase should produce something testable on its own.

> **Key Principle:** Get the gameplay loop working with hardcoded test data BEFORE introducing API generation. If the gameplay loop doesn't work, you want to know it's a logic problem, not an API timeout issue.

---

### Asset Status Summary

| Asset | Status |
|-------|--------|
| Sound Effects (23 WAV files) | [DONE] COMPLETE |
| Sound Integration (all events wired) | [DONE] COMPLETE v3.7 -- 15 gameplay + 6 transition + 11 UI sounds |
| pattern-detector.js | [DONE] COMPLETE |
| mission-integration.js | [DONE] COMPLETE |
| sound-manager.js | [DONE] COMPLETE |
| Response Bank (all dialogue text) | [DONE] COMPLETE |
| TEKS Files (grades 1-5) | [DONE] COMPLETE |
| UI/HTML Interface | [WIP] IN PROGRESS |
| Dialogue Audio (Jarvis/Fury/Widow) | [TODO] NOT STARTED |
| Cerebras API Integration | [TODO] NOT STARTED |
| GSAP Animations + PixiJS Effects | [DONE] 5 transitions in pool COMPLETE + Fury SHIELD animation COMPLETE -- Black Widow overlay remaining |
| **Transition Engine (FirewallSequence)** | [DONE] COMPLETE -- 5 randomized transitions + Widow glitch, PixiJS integration, transition sounds wired |
| **PixiJS Foundation** | [DONE] COMPLETE -- PixiEffectManager singleton, 45 filters, GSAP ticker sync |
| Benchmark Export System | [TODO] NOT STARTED |

---

### Phase 1: Core Interface (No AI, No Audio)

**Goal:** Visual design matches references, navigation works, selections stored correctly.

- [ ] Complete HTML structure with all screens
- [ ] Landing page with arc reactor animation
- [ ] Grade selection screen (1-5)
- [ ] TEKS selection screen (math + science checkboxes)
- [ ] "Mission Ready" placeholder screen
- [ ] All decryption display styles working
- [ ] Progress bar functional
- [ ] Keyboard shortcuts working
- [ ] Visual effects (glitch, matrix rain, arc reactor glow)
- [ ] localStorage for settings/preferences

**Test Criteria:** Can navigate through all screens, TEKS selections persist, visual design matches reference images.

---

### Phase 2: Gameplay Loop (Hardcoded Data) [CRITICAL]

**Goal:** Complete a full mission start-to-finish with fake data. Catch ALL logic bugs before adding API complexity.

**Why this phase exists:** You can fully test the gameplay loop -- does progression work? Does the firewall indicator update? Do science interruptions trigger at the right times? -- without debugging API issues simultaneously.

**Build:**
- [ ] Create `test-problems.js` with 10 hardcoded math problems + 3 science questions
- [ ] Main mission HUD screen showing a problem
- [ ] Answer input field (keyboard only, no voice yet)
- [ ] Answer verification in JavaScript (type answer -> JS checks if correct)
- [ ] Correct answer: Jarvis confirmation TEXT (no audio), advance to next firewall
- [ ] Wrong answer: Basic "incorrect" TEXT feedback, try again
- [ ] Firewall progress indicator updating (1 -> 2 -> 3... -> 10)
- [ ] Nick Fury science interruption screens after firewalls 3, 6, 9 (multiple choice A/B/C/D)
- [ ] Victory screen when all 10 firewalls breached
- [ ] Simple debrief showing score (X/10 math, X/3 science)

**Test Problems Format (test-problems.js):**
```javascript
const TEST_PROBLEMS = {
  math: [
    { id: 'fw-1', expression: '35 + 27 = ?', correctAnswer: 62, operation: 'ADD', operands: [35, 27] },
    { id: 'fw-2', expression: '84 - 39 = ?', correctAnswer: 45, operation: 'SUBTRACT', operands: [84, 39] },
    // ... 8 more
  ],
  science: [
    { id: 'fury-1', question: 'What is the main function of leaves?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
    // ... 2 more
  ]
};
```

**Test Criteria:** 
- [ ] Complete full 10-firewall mission manually
- [ ] Verify science interruptions trigger at EXACTLY firewalls 3, 6, 9
- [ ] Verify victory screen appears after firewall 10
- [ ] Verify score calculates correctly
- [ ] Verify wrong answers don't advance firewall

---

### Phase 2.5: GSAP Animation & Transition Engine + PixiJS Effects [DONE] NEARLY COMPLETE

> See Section 2 "Animation Stack (GSAP)" and "PixiJS GPU Effects Architecture" for detailed architecture

**Why animations are early, not polish:** GSAP animations are CORE to the MCU experience. The transition engine (FirewallSequence) is the skeleton of the mission flow. Retrofitting animations is painful -- better to build on them from the start.

**Step 1: GSAP Foundation [DONE] COMPLETE**
- [x] Install GSAP locally (no CDN): `npm install gsap`
- [x] Set up module structure with namespaced CSS (`.im-reactor-*`, `.im-panel-*`, `.im-glitch-*`, `.im-transition-*`)
- [x] Implement ScrambleText effect for "ACCESS GRANTED" reveals
- [x] **Build FirewallSequence class** (`js/firewall-sequence.js`) with GSAP timeline orchestration
- [x] Implement `playTransition()` method with dispatcher pattern
- [x] Build 5 transition types in randomized pool: `access_granted`, `scan_sweep`, `ripple_wave`, `arc_reactor_pulse`, `data_cascade` (Progress Bar Surge and Shatter Effect dropped in v3.6; glitch_burst moved to Black Widow exclusive in v3.6)
- [x] ALL 5 transitions randomized per firewall (including Access Granted; glitch_burst now Widow-exclusive)
- [x] Correct/incorrect answers trigger response bank lines, NOT transitions
- [x] Transitions play BETWEEN firewalls
- [x] Add input disabling during animation sequences

**Step 2: PixiJS Foundation [DONE] COMPLETE**
- [x] PixiJS 7.4.2 loaded via CDN (synchronous API)
- [x] pixi-filters 5.3.0 loaded (all 45 filters verified: GodrayFilter, AdvancedBloomFilter, RGBSplitFilter, GlitchFilter, CRTFilter, ShockwaveFilter, etc.)
- [x] @pixi/particle-emitter 5.0.8 loaded
- [x] GSAP PixiPlugin registered (local bundle from node_modules)
- [x] **PixiEffectManager singleton** (`js/pixi-effect-manager.js`) -- manages single PIXI.Application
- [x] Ticker synchronization: PixiJS ticker stopped, GSAP ticker drives rendering
- [x] Transparent canvas (backgroundAlpha:0) at z-index:1, DOM at z-index:2+
- [x] Single-instance-with-reset pattern prevents WebGL context exhaustion
- [x] Integration hooks in `playTransition()`: `pixiEffectManager.init()` + `pixiEffectManager.reset()`
- [x] All dependencies verified in browser console

**Step 3: PixiJS-Enhanced Transitions [DONE] MOSTLY COMPLETE**
- [x] Rewrite `_buildAccessGranted` with PixiJS atmospheric effects (GodrayFilter, additive particles, bloom)
- [x] Rewrite `_buildArcReactorPulse` with PixiJS GPU effects
- [x] Rewrite `_buildScanSweep` with PixiJS GPU effects
- [x] Rewrite `_buildGlitchBurst` with PixiJS GPU effects
- [x] Rewrite `_buildRippleWave` with PixiJS GPU effects
- [x] Rewrite `_buildDataCascade` with PixiJS GPU effects (unified rain canvas + PIXI.Graphics FUI elements)
- [x] ALL 5 transitions tested and verified in browser console (glitch_burst tested separately as Widow effect)
- [x] **Implement Nick Fury SHIELD logo alert animation** [DONE v3.6] -- SHIELD logo center screen, all panels flash amber, "SECURITY OVERRIDE" ScrambleText, 2-3 second dramatic takeover using `shield_logo.png`. Color changed from red to amber/orange (#ff8c00) for MCU accuracy and to reserve red for Black Widow.
- [ ] **Add Black Widow overlay system** <-- REMAINING. Two visual modes: (1) Full-screen intro with `_buildWidowGlitch()` crimson glitch burst + hourglass logo (`Black_widow_logo.png`) + ScrambleText, fires after director override in opening sequence; (2) Floating `#widow-panel` transmission box for gameplay hints + final transmission, no glitch animation. Deep crimson palette (#cc0000/#8b0000/#ff1a1a). Glitch burst removed from transition pool and repurposed exclusively for Widow intro. All durations configurable via HUD_CONFIG and audio-aware (`Math.max(config, audioLength + 1s)`). WIDOW STATUS: ALLIED indicator pulses crimson when active.

**Dropped transitions (v3.6):** Progress Bar Surge (animation fidelity not achievable with current tooling) and Shatter Effect (dynamic firewall number display added complexity with marginal value). Glitch Burst moved from random pool to Black Widow exclusive (`_buildWidowGlitch()`). Five transitions remain in the random pool, providing more than enough variety for the classroom experience.

**Step 4: Polish & Resilience**
- [ ] Add CRT scanline overlay (CRTFilter on PixiJS stage)
- [ ] Implement "low-fidelity mode" toggle (disable PixiJS, CSS-only fallback)
- [ ] Test with Chrome 4x CPU throttling
- [ ] Add `gsap.ticker.lagSmoothing(0)` for tab-inactive handling
- [ ] Bundle everything for offline use (zero CDN reliance)

---

### Phase 3: Sound Effects Integration [COMPLETE v3.7]

**Goal:** Mission has audio feedback for all key moments.

- [x] Wire up 23 existing WAV sound effects to mission events
- [x] Audio lookup object structure for SFX
- [x] Volume sliders for ambient/effects/voice (three separate controls)
- [x] Preloading essential files at startup
- [x] Integrate `sound-manager.js` audio pooling system
- [x] Test all sound triggers fire at correct moments
- [x] Two-tier transition sounds (breach-complete base + type-specific accent) [v3.7]
- [x] UI interaction sounds (ui-click, ui-hover with 150ms throttle, ui-type on problem load) [v3.7]
- [x] Jarvis generic hint text on 1st wrong answer (JARVIS_GENERIC_HINTS placeholder) [v3.7]
- [x] Widow deterministic on 2nd wrong answer (coin flip removed) [v3.7]
- [x] Ambient hum disabled (startLoop/stopLoop calls removed) [v3.7]

**Implementation completed across 7 sub-prompts:**
| Prompt | File | Changes |
|--------|------|---------|
| 0-1 | sound-manager.js | 7 key renames + 4 phantom removals |
| 2 | app.js | Init, preload, 3 volume sliders, ambient loop start/stop |
| 3 | app.js | 12 gameplay event sounds across 9 functions |
| 3.5 | app.js | Jarvis generic hints + Widow coin flip removal |
| 4 | firewall-sequence.js | 6 transition sounds (1 base + 5 accents) |
| 4.5 | firewall-sequence.js | Fixed typeof guards (window.soundManager → typeof) |
| 5 | app.js | 9 ui-click + 1 ui-hover + 1 ui-type |

**Sound -> Event Mapping (all 23 files):** [v3.5, UPDATED v3.7]
**Note:** All mappings below are now IMPLEMENTED and verified. Transition sounds use a two-tier architecture: `breach-complete` plays as a BASE sound on every transition, plus a type-specific accent sound. [v3.7]
| Event | Sound File(s) | Notes |
|-------|--------------|-------|
| Correct answer | `access-granted.wav` + `arc-reactor-pulse.wav` | Pulse accents the success |
| Wrong answer | `wrong-answer.wav` | Single sound, no layering |
| Fury alert begins | `warning.wav` + `glitch-heavy.wav` | Amber flashing border sequence |
| Fury science correct | `science-correct.wav` | After answering science question right |
| Fury science wrong | `science-wrong.wav` | After answering science question wrong |
| Widow appears | `widow-appearance.wav` + `glitch-static.wav` | Static effect as she "hacks in" |
| Hint chime | `hint-chime.wav` | Black Widow hint panel appears |
| **Transition BASE (all types)** | `breach-complete.wav` | **Plays at timeline position 0 on EVERY transition** [v3.7] |
| Transition accent: scan sweep | `scan-sweep.wav` | Plays when scan line starts moving |
| Transition accent: data cascade | `data-stream.wav` | Plays when data elements appear |
| Transition accent: ripple wave | `ripple-whoosh.wav` | Plays when ripple expands |
| Transition accent: arc reactor pulse | `arc-charge.wav` | Plays when reactor charge begins |
| Transition accent: access granted | `text-slam.wav` | Plays when ACCESS GRANTED text slams in |
| ~~Transition: shatter effect~~ | ~~`text-slam.wav`~~ | Transition dropped in v3.6, sound reassigned to access_granted accent [v3.7] |
| ~~Transition: progress bar~~ | `segment-fill.wav` | Transition dropped in v3.6, sound available for reuse |
| Transition: data scroll overlay | `data-scroll.wav` | Background data scrolling audio (available, not currently assigned) |
| Transition: glitch burst | `glitch-static.wav` | Repurposed as Widow glitch entrance only |
| ~~Background ambient loop~~ | ~~`arc-reactor-hum.wav`~~ | ~~Looping~~ -- **DISABLED v3.7.** File retained in registry but startLoop/stopLoop calls removed from app.js. |
| UI button click | `ui-click.wav` | Menu buttons, grade select, nav buttons. NOT on DECRYPT (has own sounds). Replaced with cleaner file v3.7. |
| UI element hover | `ui-hover.wav` | Delegated mouseenter on all buttons, 150ms throttle. Replaced with cleaner file v3.7. |
| UI text typing | `ui-type.wav` | Plays ONCE per new firewall load (not per keystroke) |
| Victory | `The Avengers Theme.wav` | Mission complete celebration |

---

### Phase 4: AI Generation + Teacher Review * PRE-GENERATION PARADIGM

**Goal:** Replace hardcoded test data with AI-generated problems. Teacher reviews before class.

**Critical Principle:** LLM generates problem TEXT, JavaScript calculates the ANSWER. Never trust the LLM to do arithmetic.

```javascript
// Cerebras returns this:
{
  "problem": "Tony needs to power 24 suits. Each suit needs 3 arc reactors. How many reactors total?",
  "operation": "MULTIPLY",
  "operands": [24, 3],
  "teks": "3.4F"
}

// JavaScript calculates: 24 * 3 = 72
// Answer is NEVER from the LLM
```

**Build:**
- [ ] Cerebras API integration (use Llama 70B or Qwen3 235B -- speed doesn't matter for pre-generation)
- [ ] "Generate Mission" button calls API
- [ ] Progress indicator during generation ("Generating problem 3 of 13...")
- [ ] **Teacher Review Screen** * -- shows all 13 problems with answers
- [ ] "Regenerate" button for individual problems that look wrong
- [ ] Schema validation (reject malformed responses)
- [ ] Store generated content in session object
- [ ] "Start Mission" button launches gameplay with generated content
- [ ] Fallback: load `test-problems.js` if API fails

**Test Criteria:**
- [ ] Generate a full mission, review all problems
- [ ] Regenerate a single problem, verify it updates
- [ ] Start mission and play through with generated content
- [ ] Test API failure -> fallback to static problems

---

### Phase 5: Response Intelligence (Three-Layer System)

**Goal:** Jarvis gives intelligent, contextual responses instead of generic "correct/incorrect."

**Build:**
- [ ] Wire `pattern-detector.js` into answer processing
- [ ] Implement three-layer response system:
  - **Layer 1:** Generic wrong answer response (instant, from response bank)
  - **Layer 2:** Pattern-specific hint (instant, based on detected error pattern)
  - **Layer 3:** Dynamic Cerebras fallback (for edge cases, ~1 sec delay)
- [ ] Connect pattern detection results to hint selection (HINT-PAT-XX IDs)
- [ ] Test all 11 error patterns trigger correct hints
- [ ] Implement Black Widow hint system (appears 2-4 times randomly)
- [ ] Implement Fury introduction lines before science questions
- [ ] Wire `mission-integration.js` event system to UI

**Test Criteria:**
- [ ] Intentionally answer "off by 1" -> verify HINT-PAT-01 or -02 triggers
- [ ] Intentionally answer with reversed digits -> verify HINT-PAT-06 or -07 triggers
- [ ] Verify Black Widow appears at random points
- [ ] Verify Fury speaks intro line before each science question

---

### Phase 6: Voice Integration

**Goal:** Jarvis speaks, teacher can speak commands.


> **Audio-Visual Sync Architecture** (moved from Section 2 in v3.6 -- requires audio to exist)

### Audio-Visual Sync Architecture

Pre-generated content means pre-generated timing data. Lesson packs include timing markers for each audio clip:

```javascript
// lesson-content.js - Generated during pre-lesson phase
const LESSON_PACK = {
  firewall1: {
    problem: { text: "What is 7 x 8?", answer: 56, grade: 3 },
    audio: {
      jarvisProblem: "./audio/fw1_problem.wav",
      jarvisCorrect: "./audio/fw1_correct.wav", 
      jarvisIncorrect: "./audio/fw1_incorrect.wav"
    },
    timing: {
      problemDuration: 3.2,   // seconds
      textRevealStart: 0.5,   // when to start scramble effect
      glitchBurstAt: 2.0      // sync with Jarvis emphasis
    }
  }
  // ... firewalls 2-10
};
```

```javascript
// FirewallSequence class - Runtime (TRANSITION ENGINE)
class FirewallSequence {
  constructor(lessonPack, firewallId) {
    this.data = lessonPack[firewallId];
    this.audio = new Audio(this.data.audio.jarvisProblem);
    this.timeline = this.buildTimeline();
  }

  buildTimeline() {
    const t = this.data.timing;
    
    return gsap.timeline({ paused: true })
      // Sync visual reveal with Jarvis speaking
      .to(".problem-text", {
        scrambleText: { 
          text: this.data.problem.text, 
          chars: "01!<>-_\\/[]{}=+*^?#" 
        },
        duration: 1.2
      }, t.textRevealStart)
      
      // Glitch burst synced to audio emphasis
      .add(this.createGlitchBurst(), t.glitchBurstAt)
      
      // HUD elements animate
      .to(".firewall-indicator", { 
        filter: "brightness(1.5)", 
        duration: 0.1, 
        repeat: 3, 
        yoyo: true 
      }, t.textRevealStart + 0.2);
  }

  play() {
    this.audio.play();
    this.timeline.play();
    
    // Drift correction - keep audio and timeline synced
    this.audio.addEventListener('timeupdate', () => {
      const drift = Math.abs(this.timeline.time() - this.audio.currentTime);
      if (drift > 0.05) { // 50ms tolerance
        this.timeline.time(this.audio.currentTime);
      }
    });
  }
}
```

**Key architecture points:**
- Audio drives timeline, not the other way around (more reliable)
- Pre-generated timing data means zero runtime calculation
- Drift correction handles browser audio quirks
- Each firewall is a self-contained, modular unit
- Disable input during animation sequences to prevent spam-clicks corrupting timeline


---

**Build:**
- [ ] Cartesia TTS integration for Jarvis voice (ID: `585af41f-1554-4b87-88d6-fb47127a48b9`)
- [ ] Audio-visual sync: wire GSAP timelines to pre-generated Cartesia audio using drift correction pattern (see A/V Sync Architecture above)
- [ ] Achieve audio-visual sync on single firewall (**critical proof point**)
- [ ] Web Speech API for teacher spoken answers
- [ ] Trigger phrase detection ("Jarvis, analyze this" for dynamic mode)
- [ ] Voice mode toggle (some classrooms may prefer keyboard-only)
- [ ] Mic mute toggle for teacher's Bluetooth earpiece
- [ ] Fallback to browser TTS if Cartesia unavailable

**Test Criteria:**
- [ ] Toggle voice on, hear Jarvis read problem text
- [ ] Speak an answer, verify recognition works
- [ ] Say "Jarvis, analyze this" -> verify dynamic mode triggers
- [ ] Test with mic muted -> verify no accidental triggers

---

### Phase 7: Dialogue Recording + Polish + Reporting

**Goal:** Classroom-ready experience with full audio and benchmark tracking.

**Dialogue Recording:**
- [ ] Clone Nick Fury voice in Cartesia (user handles voice samples)
- [ ] Clone Black Widow voice in Cartesia (user handles voice samples)
- [ ] Generate all Jarvis dialogue from response bank (~200 lines)
- [ ] Generate all Fury dialogue from response bank (~30 lines)
- [ ] Generate all Widow dialogue from response bank (~40 lines)
- [ ] Organize audio files in correct folder structure

**Benchmark Export System:** [NEW]
- [ ] Track all session data (see Section 1 "Benchmark Tracking")
- [ ] "Save Mission Report" button after mission completes
- [ ] Export as downloadable JSON file
- [ ] Export as downloadable CSV file (for spreadsheet import)
- [ ] Include: grade, TEKS tested, per-problem stats, hints triggered, timing

**Final Polish:**
- [ ] Opening cinematic sequence (dramatic "I am Iron Man" intro)
- [ ] Smooth transitions between ALL screens
- [ ] Victory sequence with full celebration
- [ ] Detailed debrief screen with visual stats
- [ ] Error handling for edge cases (network drops, browser refresh, etc.)
- [ ] Mobile/tablet optimization if needed

**Test Criteria:**
- [ ] Full classroom dress rehearsal (30-45 minute session)
- [ ] Download benchmark report, verify data accuracy
- [ ] Test on target hardware (Surface Laptop 5 + HDMI to TV)

---

### Phase Summary Table

| Phase | What It Builds | What You Can Test | Dependencies |
|-------|----------------|-------------------|--------------|
| **1** | Interface + navigation | Visual design, screen flow, TEKS checkboxes | None |
| **2** | Gameplay loop (hardcoded) | Complete mission flow, all 13 checkpoints, scoring | Phase 1 |
| **2.5** | GSAP animations + PixiJS GPU effects | Transitions with GPU bloom/rays/particles, Fury SHIELD alert, MCU feel | Phase 2 |
| **3** | Sound effects | All 23 SFX trigger correctly | Phase 2 |
| **4** | AI generation + review | Pre-lesson workflow, problem quality, regeneration | Phase 2 |
| **5** | Response intelligence | Pattern detection, hint quality, Widow/Fury intros | Phase 3, 4 |
| **6** | Voice I/O + audio-visual sync | Jarvis speech, teacher voice commands, A/V sync with transitions | Phase 5 |
| **7** | Polish + reporting | Classroom-ready experience, benchmark exports | All above |


## 15. Claude Code Guidelines

### The Core Problem

Claude Code repeatedly broke the UI because it can't see visual results. When asked to "wire up sound effects," it opened files and "helpfully" changed CSS colors, panel layouts, and styling that looked "inconsistent" to it. This wasn't malicious -- it was well-intentioned scope creep.

**The failure mode:** Claude Code treats every task as an opportunity to "improve" the entire codebase. The UI got progressively worse across multiple commits because each commit touched things outside its scope.

### Structured Autonomy Approach

The solution isn't "don't touch X" -- it's making scope explicit. The project has **layers** with different modification rules:

**1. Visual Layer (LOCKED)**
- Colors, spacing, fonts, layout, panel shapes
- Any task that doesn't explicitly mention visual changes means this layer stays exactly as-is
- If adding a new element, use EXISTING CSS classes and design patterns, don't invent new ones
- Files: `styles.css`, any CSS in `<style>` blocks

**2. Logic Layer (OPEN for specific task)**
- JavaScript functions, game flow, API calls
- Modifications should be surgical -- add the new functionality, don't refactor surrounding code
- Files: `app.js`, `*.js` modules

**3. Content Layer (OPEN, additions only)**
- Response bank text, TEKS data, problem templates
- Don't rewrite existing content unless explicitly asked
- Files: `response_bank.md`, TEKS files, lesson data

### File Classification

| File Type | Permission Level | Notes |
|-----------|-----------------|-------|
| `styles.css` | **LOCKED** | Never modify unless explicitly requested |
| `index.html` structure | **LOCKED** | Don't change existing element IDs/classes |
| `index.html` content | Modify | Can update text, add elements |
| `app.js` / modules | Full access | Can create, modify, refactor |
| `audio/`, `images/` | Reference only | Don't generate, just reference paths |
| Response bank IDs | **LOCKED** | Use exactly as documented, don't rename |

### Absolute Rules (No Exceptions)

**Git Workflow:**
- Push directly to `main`. **Never create branches.**
- **Never create pull requests.**
- One logical change per commit
- Clear commit messages describing what changed

**Scope Declaration:**
Before modifying ANY file, state:
> "I will modify [specific files]. I will NOT modify [other files]. Here's why this scope is correct."

If you can't justify touching a file, don't touch it.

**Verification Before Commit:**
After making changes, verify:
1. Colors unchanged (unless color change was requested)
2. Layout unchanged (unless layout change was requested)
3. No console errors
4. Existing functionality still works

**GSAP Rules (Learned the Hard Way):** [v3.4]
- **Never use GSAP's `className` property** (e.g. `timeline.set(el, { className: '+=active' })`). This corrupts HTML class attributes into garbled strings like `"=+active"` instead of adding the class. This bug caused hours of debugging during Phase 2.5 (the overlay was invisible because its CSS class was destroyed).
- **Always use `classList.add()` / `classList.remove()`** inside GSAP `.call()` callbacks instead:
  ```javascript
  // X WRONG -- corrupts class attribute:
  timeline.set(this.overlay, { className: '+=active' }, 0);
  
  // * CORRECT -- safe class manipulation:
  timeline.call(() => { this.overlay.classList.add('active'); }, null, 0);
  ```
- After any transition/animation completes, verify the overlay's `className` is clean: `el.className` should be `"im-transition-overlay"` with no garbled text and empty `el.style.cssText`.

### What Claude Code CAN Do Freely

- Create new JavaScript modules
- Implement business logic
- Add event listeners to existing elements
- Create new UI elements (using existing CSS patterns)
- Optimize performance
- Add comments and documentation

### What Claude Code Should ASK First

- Any change to visual styling
- Any change affecting multiple files
- Any major refactor
- Any change to the response bank structure

---

## 16. Module Integration Architecture

### Data Flow Overview

```
[Teacher Action] -> [AI Generation] -> [State Storage] -> [User Input] -> [Pattern Detection] -> [Hint Selection] -> [Audio Playback]
```

### Complete Data Flow Diagram

```
+----------------------------------------------------------------------+
|  TEACHER CLICKS "BEGIN MISSION" (Grade 3, TEKS 3.4A, 3.4B)           |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  AI GENERATES 10 MATH + 3 SCIENCE PROBLEMS                           |
|  Each problem includes:                                              |
|    - narrative: "Jarvis is calculating suit components..."           |
|    - expression: "47 + 28 = ?"                                       |
|    - correctAnswer: 75                                               |
|    - problemData: { operation: 'ADD', operands: [47, 28], ... }      |
|    - diagnosticFor: ['FORGOT_TO_CARRY']  <- Key for detection!        |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  FIREWALL 1 DISPLAYED                                                |
|  Student sees: "Jarvis is calculating... 47 + 28 = ?"                |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  STUDENT TYPES "65" AND TEACHER PRESSES ENTER                        |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  PATTERN DETECTOR RUNS:                                              |
|                                                                      |
|  detectMathError(75, 65, {operation:'ADD', operands:[47,28]}, 3)     |
|                                                                      |
|  Internally, it calculates:                                          |
|    - What if student forgot to carry?                                |
|    - 47+28 without carrying: 7+8=15->5, 4+2=6 -> "65" <- MATCH!        |
|                                                                      |
|  Returns: {                                                          |
|    correct: false,                                                   |
|    pattern: 'FORGOT_TO_CARRY',                                       |
|    confidence: 0.95,                                                 |
|    hintId: 'HINT-PAT-08',  <- "Did you remember to carry?"            |
|    meetsThreshold: true    <- 0.95 > 0.80 threshold                   |
|  }                                                                   |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  HINT DECISION:                                                      |
|                                                                      |
|  wrongAttempts: 1                                                    |
|  threshold for auto-hint: 2                                          |
|                                                                      |
|  -> First wrong answer: NO automatic hint                             |
|  -> Play WRONG-XX audio only                                          |
|  -> Store pattern for potential manual hint (teacher presses H)       |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  STUDENT TRIES AGAIN: "65" (same mistake)                            |
|                                                                      |
|  wrongAttempts: 2 <- NOW TRIGGERS AUTO-HINT                           |
|  meetsThreshold: true                                                |
|                                                                      |
|  -> Play WRONG-XX audio                                               |
|  -> Wait 1.5 seconds                                                  |
|  -> Play HINT-PAT-08: "Did you remember to carry?"                    |
+----------------------------------------------------------------------+
                                   |
                                   v
+----------------------------------------------------------------------+
|  STUDENT TRIES AGAIN: "75"                                           |
|                                                                      |
|  detectMathError(75, 75, ...) -> { correct: true }                    |
|                                                                      |
|  -> Play CORRECT-XX audio                                             |
|  -> Update firewall UI (breached!)                                    |
|  -> Wait 2 seconds                                                    |
|  -> Advance to Firewall 2                                             |
+----------------------------------------------------------------------+
```

### AI Problem Schema

The AI must output problems in exactly this format:

```javascript
{
  "id": "fw-3",
  "firewallNumber": 3,
  "narrative": "Calculate the power output for the repulsor beam.",
  "expression": "302 - 167 = ?",
  "correctAnswer": 135,
  "answerType": "integer",
  "problemData": {
    "operation": "SUBTRACT",           // <- Pattern detector uses this
    "operands": [302, 167],            // <- And this
    "teksCode": "3.4A",
    "difficulty": "medium",
    "diagnosticFor": ["STOP_BORROW_AT_ZERO"]  // <- The 0 in 302 reveals this bug
  }
}
```

### Event Flow Logic

```
[Student presses Enter with answer]
    v
validateInput(rawInput)
    v (if valid)
parseAnswer(rawInput, answerType)  // Handle integers, decimals, fractions
    v
detectMathError(correct, parsed, problemData, grade)
    v
+-----------------------------------------------------+
| IF result.correct:                                  |
|   -> playRandomCorrect()                             |
|   -> updateFirewallUI(completed)                     |
|   -> wait(2 seconds)                                 |
|   -> checkForFuryInterruption()                      |
|   -> advanceToNextFirewall()                         |
|                                                     |
| IF !result.correct:                         [v3.7]  |
|   -> playRandomWrong()                               |
|   -> incrementWrongCount()                           |
|   -> play wrong animation                            |
|   -> animation callback:                             |
|      v                                              |
|   +-----------------------------------------+       |
|   | IF wrongAttemptsThisFirewall == 1:      |       |
|   |   -> wait 1.5s                          |       |
|   |   -> show JARVIS_GENERIC_HINTS text     |       |
|   |     (Phase 5: upgrade to pattern-specific)|     |
|   |                                         |       |
|   | IF wrongAttemptsThisFirewall >= 2:      |       |
|   |   -> checkWidowHint() (deterministic)    |       |
|   |   -> Widow ALWAYS appears if spacing OK  |       |
|   +-----------------------------------------+       |
+-----------------------------------------------------+
```

### HTML Integration Example

Add these script tags to your existing HTML:

```html
<script src="js/pattern-detector.js"></script>
<script src="js/mission-integration.js"></script>
<script src="js/sound-manager.js"></script>
```

Wire up your existing UI:

```javascript
// Grade selection buttons
document.querySelectorAll('.grade-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grade = parseInt(btn.dataset.grade);
    // ... your existing TEKS selection logic ...
    IronManMission.startMission(grade, selectedMathTeks, selectedScienceTeks);
  });
});

// Answer input
document.getElementById('answer-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    IronManMission.processAnswer(e.target.value);
    e.target.value = '';
  }
});

// Listen for events to update your UI
IronManMission.onMissionEvent('firewallStarted', (data) => {
  document.querySelector('.problem-narrative').textContent = data.problem.narrative;
  document.querySelector('.problem-expression').textContent = data.problem.expression;
});

IronManMission.onMissionEvent('answerWrong', (data) => {
  console.log(`Pattern detected: ${data.pattern} (${Math.round(data.confidence * 100)}%)`);
  // Your UI feedback here
});

IronManMission.onMissionEvent('answerCorrect', (data) => {
  // Trigger GSAP animation for firewall breach
  playFirewallBreachSequence(data.firewall);
});

IronManMission.onMissionEvent('blackWidowAppears', (data) => {
  showBlackWidowOverlay(); // Your existing function
});

IronManMission.onMissionEvent('furyAppears', (data) => {
  switchToFuryUI(); // Amber theme, science question format
});
```

### Teacher Keyboard Controls

These are already implemented in `mission-integration.js`:

| Key | Function |
|-----|----------|
| `Space` | Advance to next firewall (teacher override) |
| `H` | Manually trigger hint using last detected pattern |
| `M` | Toggle microphone mute |
| `P` | Pause mission |
| `R` | Resume mission |
| `Enter` | Submit answer |

---

## Important Reminders

1. **Questions generated at session start** -- All 10 math + 3 science problems are created BEFORE mission begins
2. **Pattern detection is client-side** -- No API call needed; runs in browser JavaScript
3. **~90% of errors follow patterns** -- The system should catch most common mistakes
4. **Black Widow logic is in flux** -- Current implementation may change based on classroom testing
5. **Voice consistency is critical** -- All Jarvis audio must use the cloned voice
6. **Entertainment first, education second** -- This should feel like a Marvel movie
7. **Single screen only** -- Optimize for laptop display to TV via HDMI
8. **Pre-record everything possible** -- Minimize real-time API calls
9. **Teacher controls everything** -- Students don't interact directly with the system
10. **School appropriate always** -- All content must be safe for elementary students

---

## Files Reference

**In Project Folder:**
- `response_bank.md` -- Complete pre-scripted dialogue (750+ lines)
- `grade_1_sciencemath_teks.txt` through `Grade_5_sciencemath_teks.txt` -- TEKS standards
- `Ironman_STEM_Script.pdf` -- Original mission script
- Various `.jpg`, `.png`, `.webp` -- Reference images

**Complete JavaScript Modules (uploaded separately):**
- `pattern-detector.js` -- [DONE] COMPLETE (~1,100 lines) -- Error pattern detection with 24 patterns
- `mission-integration.js` -- [DONE] COMPLETE (~1,580 lines) -- Mission state and flow management
- `sound-manager.js` -- [DONE] COMPLETE (~500 lines) -- Audio pooling system for sound effects
- `firewall-sequence.js` -- [DONE] COMPLETE -- Transition engine with 6 randomized transitions, GSAP timeline orchestration, PixiJS integration hooks
- `pixi-effect-manager.js` -- [DONE] COMPLETE -- PixiJS singleton manager (single PIXI.Application, GSAP ticker sync, stage reset between transitions)
- `hud-config.js` -- [DONE] COMPLETE -- Central `window.HUD_CONFIG` configuration object (colors, timing, easing, transition pool, mission structure)
- `im-animations.css` -- [DONE] COMPLETE -- Namespaced CSS foundation (`.im-reactor-*`, `.im-panel-*`, `.im-glitch-*`, `.im-transition-*` class families, `--im-*` custom properties)

**Still Needed:**
- All dialogue audio files (via Cartesia voice synthesis from response bank)
- Nick Fury voice clone
- Black Widow voice clone
- PixiJS-enhanced transition effects (replacing CSS atmospheric effects with GPU-accelerated PixiJS -- in progress, starting with Access Granted)

---

## Known Issues / In Progress

> * **Transition Engine** -- `FirewallSequence` class is BUILT and working. 6 randomized transitions play between firewalls. PixiJS foundation integrated. Currently rewriting individual transitions to use GPU-accelerated PixiJS effects (starting with Access Granted).

> x **PixiJS Transition Rewrites** -- Access Granted is the first transition being upgraded from CSS/GSAP-only to CSS+GSAP+PixiJS hybrid (DOM text on top, GPU effects canvas underneath). Remaining 7 transitions will follow the same pattern.

> x **Black Widow Logic** -- Appearance triggers still in flux. Current implementation is placeholder pending classroom testing.

> x **CDN Dependencies** -- PixiJS libraries currently load from jsdelivr CDN. This works because the app runs on the teacher's laptop (not student Chromebooks), but should eventually be bundled locally for zero-CDN reliability in schools with strict content filters.

---

*Let's build something that makes kids feel like they're actually helping Iron Man save the world.*
