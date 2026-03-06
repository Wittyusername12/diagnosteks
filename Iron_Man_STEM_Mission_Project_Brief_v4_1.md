# Iron Man STEM Mission - Complete Project Brief v4.1

**Version:** 4.1  
**Last Updated:** March 4, 2026  
**Status:** Active Development -- Phase 3 COMPLETE, Phase 4 IN PROGRESS (Teacher Review built + 15 bugfix rounds, MC mode FUNCTIONAL for Tier 1 arithmetic TEKS with pre-computed STAAR-quality distractors, Layer 5 async validation ATTEMPTED AND ABANDONED — see §10), Exemplar Bank COMPLETE, Distractor Pattern Bank COMPLETE (Tier 1), SVG Diagram Renderer COMPLETE (Tier 1, 8 types, deterministic generation pipeline WIRED, rendered on Teacher Review Screen, not yet on gameplay HUD), Student Response System PLANNED (Phase 5A/5B)

**v4.1 Changes:** MC Distractor Pipeline — complete end-to-end architecture for STAAR-quality multiple choice distractors. Added Distractor Pattern Bank (`distractor-patterns.js`) with 97 worked examples across 27 patterns for 5 Tier 1 TEKS (3.4A, 3.4F, 3.4J, 3.4D, 3.4K), all extracted from official TEA STAAR rationale documents 2019-2025 (Section 7). Added pre-computed distractor value architecture: JavaScript `computeDistractorValues()` function in `cerebras-api.js` calculates distractor values using deterministic digit-by-digit algorithms (direction-reversal, borrow-error, regroup-fail, wrong-operation) instead of relying on LLM arithmetic — LLM receives pre-computed values and writes rationales for them (Section 7). Added rationale label injection: `computeDistractorValues()` returns `{value, rationale, tag}` triples so the LLM paraphrases pre-built rationale strings instead of inventing its own (Section 7). Fixed `selectExemplars` 10-total cap → 5 per TEKS (Section 7). Added MC-specific validation checks to pipeline: duplicate value detection (HARD GATE), rationale-value cross-check (HARD GATE), consecutive integer detection, wide-spread check (Section 10). Promoted MC duplicate check and rationale-value cross-check from WARNING to HARD GATE after discovering LLM fabricates distractor arithmetic (Section 10). Layer 5 async validation (self-consistency voting + blind review) built, tested, and ABANDONED — zero incremental value over Layers 1-4, see §10 postmortem. Added MC gameplay HUD with holographic A/B/C/D buttons and keyboard input (Section 18). Fixed science question skipping bug (Fury interruptions now fire correctly at firewalls 3/6/9). Fixed `distractorReasoning` → `distractorRationales` field bridge in `cerebras-api.js`. Documented 15 bugfix rounds (v4–v15) covering Teacher Review Screen features, validation edge cases, and MC integration (Section 18). Added `distractor-patterns.js` and `validation-engine.js` to Implementation Files (Section 17). Updated Phase 4 build checklist with completed items. Updated Known Issues with current state. Added distractor pipeline research reports to file references. SVG Diagram Renderer — Tier 1 COMPLETE with all 8 diagram types implemented in `js/diagramRenderer.js` (~1,470 lines): numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot (Section 11). DiagramRegistry pattern with `svgEl()` helper (createElementNS), `polarToCartesian()`/`describeArc()` arc math helpers, per-renderer viewBox, parameter validation with defaults/clamping, `testDiagram()` console helper, null container safety. Iron Man HUD theming in `css/diagram-hud.css` with `.im-diagram-*` namespace, 6 CSS custom properties, cyan-on-dark aesthetic with glow filter, Orbitron/Rajdhani fonts. Tested across ~58 test cases including edge cases and cross-renderer regression. Added `diagramRenderer.js` and `diagram-hud.css` to index.html (positions 14 and 2.5 respectively) and to Implementation Files (Section 17). NOT YET WIRED into LLM generation pipeline — diagram field in problem schema still null [subsequently wired in v4.1b — see below]. GSAP DrawSVGPlugin animation layer (`diagramAnimations.js`) NOT YET BUILT.
**v4.1b Changes:** Diagram Generation Pipeline — deterministic `_computeDiagram()` method in `cerebras-api.js` computes diagram descriptors from TEKS + operation + operands + narrative format, following the same pre-computation paradigm as `generateMissionOperands()` and `computeDistractorValues()`. LLM diagram selection was attempted first (system prompt instructions + type definitions + selection rules added to cerebras-api.js, diagram field extraction via `_validateDiagram()` in all 5 return paths of `_parseMathResponse()`) but proved unreliable — LLM returned `diagram: null` on every problem regardless of TEKS or context. Root cause: exemplar-dominated few-shot pattern (8-15 exemplars all showing `diagram: null` overwhelmed the single populated inline example). Solution: JavaScript computes diagrams deterministically post-parsing, overwriting the LLM's null. Coverage: MULTIPLY→array (operands ≤10) or areaModel (operands >10), DIVIDE→array (quotient and divisor ≤10), ADD→stripDiagram (two parts + total), SUBTRACT→stripDiagram (known part + unknown "?" + total), FRACTION_*→fractionBar. Bare math ("Solve: X ○ Y") always gets null. Wired into both `generateMathProblems()` and `_regenerateMathProblem()`. All computed descriptors pass through `_validateDiagram()` before assignment (belt-and-suspenders). Also added `diagram: null` to `toInjectionFormat()` in Batch_1 file so exemplars include the field. Diagram data is now present on every generated problem but NOT YET RENDERED on any UI screen — Teacher Review Screen and gameplay HUD rendering are the next steps [subsequently rendered on Teacher Review in v4.1c — see below].
**v4.1c Changes:** Teacher Review Diagram Rendering + Operand Generator Fixes — SVG diagrams now render on the Teacher Review Screen inside the problem content card for math word problems with non-null `diagram` field. Added `diagram` field mapping in `_mapApiToReview()`, diagram container div in `_renderRightPanel()`, `_renderDiagram()` helper function called after `_bindEvents()` in `_render()`, and diagram passthrough in `_convertBackToApi()` so diagram data survives to gameplay (all in teacher-review.js). DiagramRegistry.render() called via DOM append after innerHTML is set (SVG requires createElementNS, not innerHTML). Bare math and science problems show no diagram container. Fixed `generateOperandsForTeks()` bug: TEKS 3.4D was incorrectly grouped with 3.4F in a shared case block with 50/50 MULTIPLY/DIVIDE split, but 3.4D is multiply-only per teks-rules.json (`operations: ["MULTIPLY"]`). Split into separate case blocks — 3.4D now always returns MULTIPLY with both factors 1-10. This eliminated persistent TEKS violation auto-regen loops where every retry also rolled DIVIDE. Fixed fact-family deduplication in `generateMissionOperands()`: previously used raw operand keys (`"30,5"` vs `"30,6"`) which allowed near-duplicate problems (30÷5=6 and 30÷6=5 test the same knowledge). Now normalizes MULTIPLY and DIVIDE to sorted factor pairs under shared `MUL:` prefix — `DIVIDE [30,5]` → factors [5,6] → key `MUL:5,6`, same as `DIVIDE [30,6]` → factors [5,6] → key `MUL:5,6`. Also blocks cross-operation duplicates (MULTIPLY [5,6] and DIVIDE [30,5] share the same fact family). ADD/SUBTRACT keep separate operation-prefixed keys. Flagged for future: 3.4F's operandConstraints in teks-rules.json say both operands max 10, but DIVIDE produces [a×b, a] where a×b can reach 100 — would cause TEKS violations if 3.4F is selected alone.

**v4.0 Changes:** Strategic reframing — generator identified as core technology, Iron Man mission as first delivery surface (Section 1). Added Student Response System Architecture with Cloudflare Durable Object/WebSocket infrastructure, two-phase deployment (5A anonymous, 5B tracked), retroactive upgrade architecture, and team competition (Section 2). Added Multiple Choice mode with distractor generation, Mix format ratio enforcement with explicit integer counts, ★ Favorite `whyThisIsGood` annotation field for flywheel quality signal, and dual-input flywheel (teacher annotation + student performance data) (Section 7). Added POLLING conditional state to mission state machine for student device answer collection (Section 8). Added five Teacher Review Screen features: per-problem TEKS override toggle, TEKS description tooltips, cross-curricular badge label fix, ★ Favorite annotation field, post-mission analytics dashboard for Phase 5B (Section 9). Added two-tier validation context (Tier 1 hard gate for initial generation, Tier 2 advisory with override for regeneration) (Section 10). Added three new setup screen controls: Answer Format selector (orthogonal to Problem Format), Student Devices toggle (OFF/ANONYMOUS/TRACKED), Competition Mode selector (Section 15). Added Student Response System configuration constants (Section 16). Major build phase restructure: MC mode added to Phase 4, new Phase 5 (5A anonymous + 5B tracked student response), old Phase 5 → Phase 6 (Response Intelligence), old Phase 6 → Phase 7 (Voice Integration) (Section 18). Three new sections: Privacy & Compliance with COPPA/FERPA/Texas Student Privacy Act analysis (Section 21), Patent & IP Strategy with three independent claims and filing strategy (Section 22), Platform Vision with six delivery surfaces and standards portability roadmap (Section 23). Updated Core Design Principles: Principle #2 updated for Base Mode with student device exception, Principle #7 added (Generator-First Architecture). Added Pre-Generation Paradigm clarifying note (answer collection ≠ problem generation). All §X cross-references updated for new section numbering.

**v3.9 Changes:** Added Few-Shot Exemplar Bank Architecture (Section 7) -- complete STAAR-extracted problem exemplar bank covering 100% of Grade 3 Math TEKS (135 items across 3 batches: 65 Readiness, 67 Supporting, 3 Synthetic for never-tested TEKS). Documented 21-field Storage Schema and 7-field Injection Schema. Added exemplar selection function spec with TEKS-budget scaling and diversity maximization. Documented 12-code simplified operation vocabulary for exemplar metadata (distinct from generation pipeline's 15 operation codes). Added three exemplar bank files and five audit reports to Files Reference. Updated Asset Status table with Exemplar Bank COMPLETE row. Updated Phase 4 Prompt 2 to reference exemplar bank as prerequisite input. Added few-shot prompting research report to Research Reports list. Updated Known Issues with exemplar bank completion milestone.

**v3.8 Changes:** Migrated AI backend from Cerebras to Groq (Llama 3.3 70B Versatile) via Cloudflare Worker proxy. Fixed all "Replit" references to local file:// deployment. Added Problem Type Taxonomy (7 types covering all TEKS content standards). Expanded Problem Schema with primaryType, validationTypes, diagram descriptor, and answer format fields. Added Process Standards exclusion note (handled as system-prompt defaults, not selectable parameters). Added Cross-Curricular Mode for science-themed math word problems. Added Teacher Review Screen spec (Option C split panel with per-problem feedback). Added Multi-Layer Validation Pipeline (5 layers, Tier 2 configuration with self-consistency voting and Chain-of-Verification). Added teks-rules.json file spec. Added SVG Diagram Generator architecture (template library with registry pattern, HUD theming, GSAP DrawSVGPlugin animation). Added PDF Upload architecture (pdf.js extraction, Groq parsing, hybrid missions). Rewrote Phase 4 as Prompts 2-6 build sequence. Updated Section 13 implementation files. Updated Asset Status, Phase Summary Table, and Important Reminders.

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
   - [Provider Architecture (Phase 4)](#provider-architecture-phase-4) [NEW v3.8]
   - [PixiJS GPU Effects Architecture](#pixijs-gpu-effects-architecture--v32) [NEW]
   - [Student Response System Architecture (Phase 5)](#student-response-system-architecture-phase-5) [NEW v4.0]
3. [Mission Narrative](#3-mission-narrative)
4. [Mission Structure](#4-mission-structure)
5. [Visual Design](#5-visual-design)
6. [Pattern Detection System](#6-pattern-detection-system) [NEW]
7. [AI Problem Generation](#7-ai-problem-generation) [EXPANDED v3.8, UPDATED v4.1]
   - [Problem Type Taxonomy](#problem-type-taxonomy) [NEW v3.8]
   - [Format-Specific Generation Instructions](#format-specific-generation-instructions) [UPDATED v4.1]
   - [MC Distractor Pipeline Architecture](#mc-distractor-pipeline-architecture) [NEW v4.1]
   - [Cross-Curricular Mode](#cross-curricular-mode) [NEW v3.8]
   - [Process Standards Note](#process-standards-note) [NEW v3.8]
   - [Few-Shot Exemplar Bank](#few-shot-exemplar-bank) [NEW v3.9]
   - [Dual-Input Flywheel](#dual-input-flywheel-phase-5b-enhancement) [NEW v4.0]
8. [Mission Integration Architecture](#8-mission-integration-architecture) [NEW]
   - [POLLING State (Student Device Mode)](#polling-state-student-device-mode) [NEW v4.0]
9. [Teacher Review Screen](#9-teacher-review-screen) [NEW v3.8, UPDATED v4.0]
10. [Multi-Layer Validation Pipeline](#10-multi-layer-validation-pipeline) [NEW v3.8, UPDATED v4.1]
11. [SVG Diagram Generator](#11-svg-diagram-generator) [NEW v3.8, TIER 1 IMPLEMENTED v4.1]
12. [PDF Upload Architecture](#12-pdf-upload-architecture) [NEW v3.8]
13. [Response Bank Reference](#13-response-bank-reference)
14. [Audio Architecture](#14-audio-architecture)
15. [Teacher Controls](#15-teacher-controls) [UPDATED v4.0]
16. [Configuration Constants](#16-configuration-constants) [NEW, UPDATED v4.0]
17. [Implementation Files](#17-implementation-files) [NEW, UPDATED v4.1]
18. [Build Phases](#18-build-phases) [RESTRUCTURED v4.0]
19. [Claude Code Guidelines](#19-claude-code-guidelines)
20. [Module Integration Architecture](#20-module-integration-architecture)
21. [Privacy & Compliance](#21-privacy--compliance) [NEW v4.0]
22. [Patent & IP Strategy](#22-patent--ip-strategy) [NEW v4.0]
23. [Platform Vision & Multiple Delivery Surfaces](#23-platform-vision--multiple-delivery-surfaces) [NEW v4.0]

---

## 1. Project Overview

This project has two architectural layers:

**Core Technology:** A curriculum-aligned AI problem generation engine with a multi-layer validation pipeline and self-improving teacher feedback flywheel. The engine takes curriculum standards (currently Texas TEKS), generates problems via LLM (Groq/Llama 3.3 70B), validates them through four deterministic hard-gate layers, presents them for teacher review with per-problem feedback controls, and stores teacher-approved problems as exemplars that improve future generation quality. This pipeline is the patentable innovation and the foundation everything else is built on.

**First Application:** An immersive Iron Man-themed classroom mission that uses the generation engine to deliver TEKS-aligned math problems inside an engaging Marvel narrative. Students help Tony Stark hack into S.H.I.E.L.D.'s mainframe by solving math problems to breach firewalls, with an AI-powered Jarvis providing dynamic responses, hints, and banter. This is the demo, proof of concept, and first delivery surface for the core technology.

**Philosophy:** Walt Disney approach -- entertain first, educate second. This should feel like students are IN the Marvel universe, not watching a PowerPoint.

**Platform Principle:** The generation engine is delivery-surface agnostic. The Iron Man mission is the first application; future surfaces include worksheet generation, test prep, tutoring, and district assessment tools (see §23).

**Target Audience:** Grades 1-5 (grade selected at mission start)

**Runtime:** 30-45 minutes per mission

**Hardware:** Surface Laptop 5 (12th Gen i7, 16GB RAM), single screen display to TV via HDMI (1920x1080), Bluetooth earpiece mic with mute button

**Deployment:** Local file:// on teacher's Surface Laptop, displayed via HDMI to classroom TV (1920x1080). No server, no hosting -- double-click index.html. Only cloud component in base mode is the Cloudflare Worker proxy for API calls during pre-lesson setup. When Student Devices are enabled (Phase 5), the Worker also hosts Durable Objects for real-time answer collection during the lesson — but the core app still runs from file://.

### Core Design Principles

1. **Entertainment First** -- Every element should feel like a Marvel movie scene
2. **Teacher Controls Everything (Base Mode)** -- In the default configuration, students don't interact directly with the system; the teacher inputs all answers. When Student Devices are enabled (see §15), students interact through a constrained interface (room codes, answer selection) while the teacher retains override authority on all inputs.
3. **Pre-Record Everything Possible** -- Minimize real-time API calls for speed and reliability
4. **Questions Generated at Session Start** -- AI generates all 10 math problems + 3 science questions BEFORE the mission begins
5. **Pattern Detection is Diagnostic** -- ~90% of student errors follow identifiable patterns (research-validated)
6. **Human-in-the-Loop** -- Teacher verifies AI-generated problems before class, solving accuracy concerns
7. **Generator-First Architecture** -- The problem generation pipeline (generation → validation → review → flywheel) is architecturally independent of the mission UI. Any component of the pipeline can be used by other delivery surfaces without modification.

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
| **During Lesson** | Requires API calls + internet | ZERO API calls in normal flow* -- works offline (see exceptions below) |
| **Reliability** | Depends on API uptime | 100% -- everything cached locally |

**The Flow:**
```
PRE-LESSON (5-15 minutes before class):
+--------------------------------------------------------------------------+
| 1. Teacher selects grade + TEKS checkboxes                               |
| 2. Click "Generate Mission"                                              |
| 3. Groq (Llama 3.3 70B Versatile) generates problems (10-30 seconds)     |
| 4. Problems display on screen for teacher review                         |
| 5. Teacher reviews problems, can "Regenerate" any (see §9 for workflow)  |
| 6. Click "Start Mission" after approving all problems                    |
| 7. Cartesia API synthesizes all problem-specific audio (30-60 seconds)   |
| 8. Everything cached locally. System shows "Mission Ready"               |
+--------------------------------------------------------------------------+

DURING LESSON (base mode):
+--------------------------------------------------------------------------+
| * ZERO API calls required (Layer 3 Dynamic Mode is the one exception)    |
| * All audio plays from local cache instantly                             |
| * Runs even if WiFi drops (base mode; Student Devices require network)   |
| * System tracks current problem, plays appropriate pre-cached audio      |
+--------------------------------------------------------------------------+
```

**Why This Matters:**
- Teacher catches any math errors BEFORE students see them
- No "Loading..." or delays during the mission -- instant feedback
- School WiFi issues won't break the experience
- Uses the smartest available AI models (quality > speed)

**Note:** The student response system (§2, Phase 5) operates DURING the lesson via real-time WebSocket, but this is answer COLLECTION, not problem GENERATION. All problems are still pre-generated. The student devices simply provide a new input channel for answers that were previously entered solely by the teacher.

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
|  Chain: Web Speech API -> Groq -> Cartesia                    |
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
- **Model:** Llama 3.3 70B Versatile -- selected for highest instruction-following score (IFEval 92.1), strong math reasoning (MATH-CoT 77.0), and multilingual robustness (MGSM 91.1) per deep research analysis. For K-5 problem generation, controllability > raw capability.
- Generates 10 math problems + 3 science questions per mission
- Problems include metadata for pattern detection (see Section 7)
- 14,400 free requests/day on Groq free tier -- one mission uses ~13 generation requests with current Layers 1-4
- **Token limit is the binding constraint, not requests.** Groq free tier also caps at 100,000 tokens/day (TPD). A single mission generation + auto-regeneration retries consumes ~15,000-25,000 tokens. Heavy iterative testing during development (multiple missions + many manual regenerations per session) can exhaust the TPD limit before the request limit. The project upgraded to Groq Dev Tier during development for higher token limits. Classroom usage (one mission generation + 3-5 manual tweaks) fits comfortably within free tier.
- OpenAI-compatible API format (same request/response structure, just different provider)
- **During lesson:** ZERO API calls (everything pre-generated)
- **Dynamic mode only:** Groq called for Layer 3 "Jarvis, analyze this" requests

### Provider Architecture (Phase 4) [NEW v3.8]

    Browser (file://) --> Cloudflare Worker --> Groq API --> Llama 3.3 70B Versatile
                          (CORS proxy)          (API key stored as Worker secret)

**Why Groq + Llama 3.3 70B:**
- IFEval 92.1 -- highest instruction-following score among open-weight models (per deep research report)
- MATH-CoT 77.0 -- strong mathematical chain-of-thought reasoning for problem generation
- MGSM 91.1 -- multilingual math robustness (relevant for bilingual classrooms)
- For K-5 generation, controllability matters more than raw capability
- Explicit child safety documentation in model card
- Groq free tier: 14,400 requests/day, 100,000 tokens/day (mission uses ~13 requests, ~15-25K tokens; token limit is binding during heavy testing — project upgraded to Dev Tier)
- Llama Guard 3 8B available as optional safety classification pass (free on Groq)

**Why Cloudflare Worker proxy:**
- App runs from file:// which sends Origin: null
- Groq API rejects null origins (CORS policy)
- Worker at ironman-api.shanewaldrop123.workers.dev forwards requests with proper headers
- API key stored as encrypted Worker secret, never exposed in client-side code

**Optional: Llama Guard Safety Pass:**
- Groq offers Llama Guard 3 8B as a free endpoint
- Can classify generated problems before Teacher Review Screen
- Toggleable -- teacher can enable/disable
- Logs warnings (e.g., "Problem 7 flagged for review") rather than hard-blocking

**3. Voice Input (Web Speech API)**
- Browser's built-in speech recognition
- Converts teacher's speech to text
- Matches against trigger phrases
- Voice answer input with natural language parsing

**4. Voice Output (Layered System)**
- **Response Bank (permanent):** Pre-synthesized WAV files for all predictable responses (~750 lines — see §13)
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
    output_format: 'wav'
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

**Why GSAP:** The Webflow acquisition of GSAP (Fall 2024) led to all premium plugins becoming free in April 2025 -- ScrambleText, SplitText, Physics2D would have cost ~$200/year. GSAP's `timeline.time(audio.currentTime)` pattern enables sub-frame precision sync with pre-generated Cartesia audio -- critical for MCU-quality sequences. Benchmarks at 5x faster than CSS transitions.

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

> **Moved to Phase 6 (Voice Integration) in v3.6; that phase was renumbered to Phase 7 in v4.0.** Audio-visual synchronization requires pre-generated Cartesia audio to exist, which doesn't happen until Phase 7. See Phase 7 for the LESSON_PACK timing data structure, FirewallSequence audio sync pattern, and drift correction architecture.

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

### Student Response System Architecture (Phase 5)

The student response system extends the existing Cloudflare Worker infrastructure to enable real-time student device participation during missions. It is deployed in two phases: anonymous (5A) and tracked (5B).

**Infrastructure Stack:**

| Component | Role | Details |
|-----------|------|---------|
| Cloudflare Durable Object | Per-room WebSocket state manager | One Durable Object instance per active room. Manages all WebSocket connections between teacher's Surface Laptop and student Chromebooks. Maintains live answer tallies and connected device count. Memory clears when room expires (5A) or after D1 write (5B). |
| Cloudflare Worker (existing) | Room creation, code generation, routing | Extends the current Groq proxy worker at `ironman-api.shanewaldrop123.workers.dev`. Adds room CRUD endpoints. API key and room state managed as Worker secrets and Durable Object bindings. |
| Student-facing page | Constrained answer input | Pure HTML/JS served directly from the Cloudflare Worker (not from file://). Runs on any device with a modern browser: Chromebooks, tablets, phones. Displays room code entry, waiting screen, question text, and A/B/C/D answer buttons. |
| Teacher's file:// app | Mission control | Communicates with Durable Object via fetch() and WebSocket. Same pattern as existing Groq API calls — no deployment model change. Teacher initiates room, pushes questions, receives aggregated tallies, confirms answers. |
| Cloudflare D1 (Phase 5B only) | Persistent storage | SQLite at the edge. Stores session records, per-student answers, TEKS mastery data. Written at session end, not during real-time gameplay. |

**Room Code System:**

```
Teacher clicks "Start Student Session"
         |
         v
Worker generates 6-digit room code (e.g., 482917)
         |
         v
Students navigate to URL, enter code → see waiting screen
         |
         v
Teacher advances to firewall N
         |
         v
Durable Object pushes question + MC options to all connected devices via WebSocket
         |
         v
Students tap A/B/C/D → answers flow back to Durable Object
         |
         v
Aggregated tally sent to teacher's display as live bar chart
         |
         v
Teacher accepts majority vote OR overrides with own selection
```

**Two-Phase Deployment:**

**Phase 5A — Anonymous (no compliance required):**
No student names, no persistence. Session ends → Durable Object memory clears. Aggregate data only ("Room 482917, Q3: 18 chose A, 4 chose B, 6 chose C, 2 chose D"). No COPPA/FERPA triggers. Functionally equivalent to "raise your hand if you think B." Can be deployed in classrooms immediately.

**Phase 5B — Tracked (requires school authorization):**
Students enter first name + class period on the join screen. Per-student answers recorded. Session data written to D1 at session end. TEKS mastery tracking across sessions. Requires school authorization under COPPA school consent exception (see §21).

**Retroactive Upgrade Architecture (5A → 5B):**

The upgrade from anonymous to tracked is PURELY ADDITIVE, not replacement:

```javascript
// Phase 5A — anonymous WebSocket message
{ room: "482917", answer: "B" }

// Phase 5B — tracked WebSocket message (adds student field)
{ room: "482917", student: "Johnny", answer: "B" }
```

The Durable Object handles both formats with a simple conditional: if `student` field is present, record per-student data; if absent, tally only. The ONLY architectural addition for 5B is a D1 write call at session end before memory clears. Phase 5A builds 85% of the engineering (real-time sync, Durable Object state, WebSocket reliability, student UI, teacher poll display). Phase 5B adds the remaining 15% (D1 schema, persistence logic, analytics dashboard, privacy controls).

**Team Competition Architecture:**

When Competition Mode is set to Teams (see §15), the student join screen includes a "Pick your team" selector. The WebSocket message adds a team field:

```javascript
// Team mode message
{ room: "482917", answer: "B", team: "stark" }
```

The Durable Object maintains per-team running tallies instead of a single aggregate. The teacher's display shows per-team score bars (holographic leaderboard with arc reactor energy bars). For the tracked version, D1 adds a `team` column so analytics show team performance breakdowns.

**Network Considerations:**

Cloudflare Durable Objects use standard HTTPS WebSocket upgrade (port 443) — the same port as regular web traffic, compatible with most school firewalls. Kahoot, Nearpod, and Pear Deck all use this same pattern successfully in school environments. Fallback: HTTP long-polling for restrictive firewalls (degraded mode, slower but universally compatible).

**Hardware Note:** The core app still runs from file:// on the teacher's Surface Laptop. Student devices are Chromebooks/tablets on the school WiFi. The teacher's laptop must be on the same network (or any network with internet access to reach Cloudflare).

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

- **Firewalls 1-10:** All math problems (TEKS-aligned, answer format per teacher selection — see §15) -- these are the "firewalls" being hacked
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
4. **1st wrong answer on this firewall:** After 1.5s delay, Jarvis dialogue box updates with a random generic hint from `JARVIS_GENERIC_HINTS` array (15 lines from response_bank.md Section 5B). Console logs `[Hint] Jarvis generic hint: ...`. This is a TEXT-ONLY placeholder -- Phase 6 upgrades to pattern-specific hints with audio.
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

## 7. AI Problem Generation [EXPANDED v3.8, UPDATED v4.1]

### Core Principle

**All problems are generated at session start.** When the teacher selects a grade level, TEKS checkboxes, and clicks "Generate Mission," the system calls Groq via the Cloudflare Worker to generate 10 math problems + 3 science questions BEFORE the mission flow begins. The LLM generates problem TEXT and structured metadata; JavaScript independently calculates the ANSWER. Never trust the LLM to do arithmetic.

### Problem Type Taxonomy [NEW v3.8]

Reading all five grade-level TEKS files reveals fundamentally different KINDS of problems, not just different numbers in the same kind of problem. Seven distinct problem types identified, each requiring different generation instructions, answer formats, and validation logic:

**COMPUTATION** -- "add 347 + 285" or "multiply 12 x 15." Numeric answer that math.js can independently verify. Standards like 3.4A ("solve with fluency one-step and two-step problems involving addition and subtraction within 1,000") and 5.3B ("multiply with fluency a three-digit number by a two-digit number"). Core type, most straightforward to validate.

**COMPARISON** -- Use >, <, or = to compare two values. Standards like 2.2D ("use place value to compare and order whole numbers up to 1,200 using comparative language, numbers, and symbols") and 4.2C ("compare and order whole numbers to 1,000,000,000"). Answer is a symbol, not a number. LLM generates two values, validator independently computes which is larger, student picks correct symbol. Deterministically verifiable.

**FRACTION** -- Spans computation (adding fractions with unlike denominators), comparison (which fraction is larger), identification (what fraction does this picture represent), equivalence (are these two fractions equivalent). Standards like 3.3A ("represent fractions with denominators of 2, 3, 4, 6, and 8") and 5.3H ("addition and subtraction of fractions with unequal denominators"). Math.js handles fraction arithmetic natively, but validation rules need fraction-specific constraints like allowed denominator sets per grade level.

**GEOMETRY AND MEASUREMENT** -- Split into two sub-types. Some are computational: 4.5D ("solve problems related to perimeter and area of rectangles"), 5.4H ("solve problems related to volume"), 4.7E ("determine measure of unknown angle"). Numeric answers, verifiable. Others are identification/classification: 1.6D ("identify two-dimensional shapes including circles, triangles, rectangles"), 4.6A ("identify points, lines, line segments, rays, angles, perpendicular and parallel lines"). Multiple-choice by nature.

**DATA ANALYSIS** -- Requires visual context -- cannot ask "what does bar graph show" without a bar graph. Standards like 3.8B ("solve problems using data represented with frequency table, dot plot, pictograph, or bar graph") and 5.9C ("solve problems using data from scatterplot"). SVG diagram generator (Section 11) becomes essential. System generates data, renders graph as SVG, asks question about it. Answer still numeric or multiple-choice, therefore verifiable.

**FINANCIAL LITERACY** -- Ranges from vocabulary ("define money earned as income" at grade 1) to light computation ("calculate profit in given situation" at grade 4) to conceptual understanding ("explain difference between gross income and net income" at grade 5). Computational ones validate normally. Conceptual ones need multiple-choice format so there is a verifiable correct answer.

**CONCEPTUAL/EXPLANATION** -- Appear across several strands: "explain that unit fraction 1/b represents quantity formed by one part of whole" (3.3C), "describe meaning of parentheses and brackets in numeric expression" (5.4E). Understanding checks, not calculations. Need multiple-choice with one correct answer and plausible distractors -- different LLM generation pattern than "generate word problem."

### Problem Schema [UPDATED v3.8]

Each generated problem MUST follow this structure. Schema expanded from v3.7 to support all seven problem types:

```javascript
{
  "id": "fw-3",
  "firewallNumber": 3,
  "narrative": "Jarvis is calculating the power output for the repulsor beam.",
  "expression": "302 - 167 = ?",
  "correctAnswer": 135,
  "answerType": "integer",       // "integer" | "decimal" | "fraction" | "comparison" | "multipleChoice"
  "answerUnit": null,            // "cookies" | "square inches" | "degrees" | null (for bare math)
  "primaryType": "computation",  // Display label for Teacher Review Screen
  "validationTypes": ["computation"],  // Array -- drives which validation rules apply
  "problemData": {
    "operation": "SUBTRACT",
    "operands": [302, 167],
    "teksCode": "3.4A",
    "difficulty": "medium",      // "easy" | "medium" | "hard"
    "diagnosticFor": ["STOP_BORROW_AT_ZERO"],
    "scienceTeksConnection": null, // Cross-curricular: e.g., "3.9B" or null
    "scienceLabel": null          // LLM-generated label for cross-curricular badge, e.g., "Forces & Motion" or null [ADDED v4.1]
  },
  "diagram": null                // SVG diagram descriptor or null -- see Section 11
}
```

**Multiple-choice answer format** (for identification, conceptual, and financial literacy types):

> **Note (v4.1):** The schema below shows the ORIGINAL v3.8 MC format used for non-arithmetic MC problems (geometry identification, conceptual questions, etc.) where the options are text strings. For arithmetic MC problems generated through the distractor pipeline, the actual format uses `mcOptions` with numeric `value` fields and a separate `distractorRationales` object — see the "MC Schema Extensions" subsection in the MC Distractor Pipeline Architecture section below.

```javascript
{
  "answerType": "multipleChoice",
  "correctAnswer": "B",
  "options": [
    { "letter": "A", "text": "A triangle" },
    { "letter": "B", "text": "A rectangle" },
    { "letter": "C", "text": "A pentagon" },
    { "letter": "D", "text": "A hexagon" }
  ]
}
```

**Comparison answer format:**
```javascript
{
  "answerType": "comparison",
  "correctAnswer": ">",          // ">" | "<" | "="
  "problemData": {
    "operation": "COMPARE",
    "operands": [4567, 4576]
  }
}
```

### Operation Codes [EXPANDED v3.8]

The `operation` field must be one of:
- `ADD`, `SUBTRACT`, `MULTIPLY`, `DIVIDE`
- `FRACTION_ADD`, `FRACTION_SUBTRACT`, `FRACTION_MULTIPLY`
- `DECIMAL_ADD`, `DECIMAL_SUBTRACT`, `DECIMAL_MULTIPLY`
- `COMPARE` -- for comparison problems (>, <, =)
- `IDENTIFY` -- for identification/classification (multiple choice)
- `MEASURE` -- for measurement computation (perimeter, area, volume, angles)
- `DATA_READ` -- for reading data displays (bar graphs, dot plots, etc.)
- `CONCEPTUAL` -- for understanding checks (multiple choice)

**Operation Normalization (Bugfix v6/v9):** The LLM sometimes returns operation values as natural language ("addition", "subtraction", "minus") or operator symbols ("+", "-", "×", "÷", "*", "/") instead of the canonical enum codes above. The `_validateOperation()` function in `cerebras-api.js` normalizes these via an alias map before any downstream processing. Before this fix, unrecognized values like "-" defaulted to ADD, which caused operation badges to display incorrectly. The alias map covers all common variants: "addition"→ADD, "subtract"→SUBTRACT, "minus"→SUBTRACT, "-"→SUBTRACT, "+"→ADD, "×"→MULTIPLY, "*"→MULTIPLY, "÷"→DIVIDE, "/"→DIVIDE, etc.

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

### Cross-Curricular Mode [NEW v3.8]

Math word problems can incorporate science TEKS themes, creating cross-curricular connections that Texas administrators value ("making connections across different TEKS").

**How it works:**
- Teacher already selects both math AND science TEKS on setup screen
- Cross-Curricular Mode toggle on setup screen (ON by default)
- When enabled, system prompt includes one paragraph telling LLM to theme word problems around the selected science concepts while maintaining math rigor
- Example: If math TEKS is 3.4A (addition/subtraction within 1,000) and science TEKS is 3.9B (organisms and environments), the LLM might generate: "Tony Stark's research lab has 456 rainforest plant specimens. If 189 specimens need to be moved to the new biodome, how many remain in the lab?"
- The math is unchanged. The science context is flavor text that reinforces science vocabulary.

**Science Integration Style (Bugfix v10):** The system prompt explicitly instructs the LLM to weave science concepts into the narrative naturally through vocabulary and scenario choice — NOT by appending explanation sentences. Before this fix, the LLM would tack on sentences like "This situation involves rapid changes in position." or "This situation involves motion and position changes as the packages are delivered." at the end of word problems. The updated prompt directive says the science theme should be invisible as a teaching mechanism: the student encounters science vocabulary organically in the story context, not as a labeled-out lesson. The cross-curricular badge on the review screen tells the teacher which science TEKS is represented; the student never sees that metadata.

**Architecture impact:** ZERO. This is pure prompt engineering -- one paragraph in the system prompt. No new UI elements, no new API calls, no new validation logic. The setup screen already has both math and science TEKS selections.

**Teacher Review Screen integration:**
- Purple badge on each problem indicating which science TEKS it connects to (if any)
- Per-problem cross-curricular control via "✦ Science" dropdown chip: teacher can select any mission science TEKS, choose from ALL grade-level science TEKS via "Choose Other TEKS..." option, or remove science context entirely. Math is always preserved through mathConstraints when changing science theme.

### Process Standards Note [NEW v3.8]

Texas TEKS include Mathematical Process Standards (X.1A through X.1G at every grade level) covering things like "apply mathematics to problems arising in everyday life, society, and the workplace" and "use a problem-solving model that incorporates analyzing given information."

**Decision: Excluded from teks-rules.json and setup screen.**

These are not selectable parameters. They are addressed through default generation guidelines embedded in the system prompt, consistent with how STAAR (Texas state assessment) treats them -- as implicit qualities of all well-constructed math problems rather than standalone assessment targets. STAAR tags questions to content standards like 3.4A or 4.3E, never to process standards in isolation.

The system prompt includes a brief preamble: "All generated problems should use real-world contexts when appropriate, be solvable through clear mathematical reasoning, and be expressed in grade-appropriate language. When a problem can naturally incorporate multiple representations (equation, diagram, verbal description), prefer that approach."

This covers the spirit of all seven process standards without adding teacher-facing complexity.

### Format-Specific Generation Instructions [NEW v4.0]

**Problem Format (Word Problem / Bare Math / Mix):**

When the teacher selects **Mix** format on the setup screen, the system picks a random ratio from three options each generation cycle: 60/40 word-to-bare, 50/50, or 40/60. The LLM prompt receives EXPLICIT integer counts rather than soft language. For a 10-problem mission:

| Random Selection | LLM Instruction |
|-----------------|-----------------|
| 60/40 | "Generate exactly 6 word problems and 4 bare arithmetic problems" |
| 50/50 | "Generate exactly 5 word problems and 5 bare arithmetic problems" |
| 40/60 | "Generate exactly 4 word problems and 6 bare arithmetic problems" |

This explicit count approach prevents the LLM from defaulting to nearly all word problems, which occurs when instructions use approximate language like "approximately half."

**Answer Format (Open Response / Multiple Choice / Mix):**

This is an independent axis from Problem Format (see §15 for the orthogonal selector UI). A bare math problem can have MC options, and a word problem can have open response.

### MC Distractor Pipeline Architecture [NEW v4.1]

When answer format is **Multiple Choice**, the generation pipeline uses a three-layer distractor architecture that produces STAAR-quality distractors with 100% rationale accuracy. This architecture was developed iteratively after discovering that the LLM cannot reliably compute distractor values or reverse-engineer rationales from bare values.

**Layer 1 — Distractor Pattern Bank (`distractor-patterns.js`):**

A per-TEKS pattern bank teaches the LLM HOW to construct diagnostic distractors. Each TEKS entry contains 2-6 error patterns with worked examples showing: problem → student error → resulting distractor value → one-sentence rationale. All 97 worked examples trace to real TEA-authored STAAR rationale documents (2019-2025). The bank is injected into the MC system prompt using a primacy-zone/recency-zone architecture:

- `UNIVERSAL_DISTRACTOR_RULES` (~500 tokens) injected in the **primacy zone** (beginning of system prompt) — enforces rules like "each distractor targets exactly ONE student error" and "only use numbers from the problem"
- Per-TEKS patterns injected in the **middle** alongside question exemplars — provides TEKS-specific error construction rules and worked examples
- `DISTRACTOR_RULES_REMINDER` (~50 tokens) injected in the **recency zone** (end of system prompt) — reinforces key rules exploiting the U-shaped attention curve

At injection time, `selectDistractorPatterns(selectedTeks)` returns ALL patterns for all selected TEKS with no budget cap. `toDistractorInjectionFormat()` strips storage-only fields (source attribution, TEKS descriptions) keeping only what the LLM needs. Typical injection: ~1,800 tokens for 2 TEKS.

The pattern bank builds in tiers:
- **Tier 1 (COMPLETE):** 3.4A, 3.4F, 3.4J, 3.4D, 3.4K — core arithmetic, worst audit failures. 27 patterns, 97 examples.
- **Tier 2 (PLANNED):** 3.4H, 3.4E, 3.5A, 3.5B, 3.4B, 3.4G, 3.6C — high frequency
- **Tier 3 (PLANNED):** 3.3x fractions, 3.2x place value, 3.7B perimeter, 3.7C time
- **Tier 4 (PLANNED):** 3.9x financial, 3.6A-B geometry, 3.8A-B data, 3.5C-E conceptual

**Layer 2 — Pre-Computed Distractor Values (`computeDistractorValues()` in `cerebras-api.js`):**

CRITICAL DISCOVERY: The LLM cannot reliably perform digit-by-digit arithmetic. When told "apply a direction-reversal error to 416 − 229," it describes the error correctly but computes the wrong numeric value. This produced 67% fabricated distractor values for multi-digit addition/subtraction.

Solution: JavaScript computes distractor values using deterministic algorithms that mirror real student errors, then injects those values into the LLM prompt. The LLM writes rationales for pre-determined values instead of computing its own.

`computeDistractorValues(operation, operands, correctAnswer)` returns an array of 3 `{value, rationale, tag}` triples. Algorithms by operation:

- **ADD:** direction-reversal (swap operand order in column subtraction), regroup-fail (skip carry propagation), wrong-operation (subtract instead of add)
- **SUBTRACT:** direction-reversal (subtract smaller from larger per-column), borrow-error (fail to decrement after borrowing), wrong-operation (add instead of subtract)
- **MULTIPLY:** wrong-operation (add instead of multiply), neighbor-fact (adjacent multiplication table entry), off-by-one (correct ± one factor)
- **DIVIDE:** wrong-operation (multiply instead of divide), chose-operand (report divisor or dividend), neighbor-fact (adjacent division fact)

All algorithms guarantee: no duplicate values, no value equals correctAnswer, wide spread (not consecutive integers), and every value traces to exactly one identifiable student error.

**Layer 3 — Rationale Label Injection:**

CRITICAL DISCOVERY: Even with correct pre-computed values, the LLM cannot reverse-engineer what student error produced each value. It invents plausible-sounding but mathematically incoherent rationales (79% were wrong, vague, or fabricated in testing).

Solution: `computeDistractorValues()` builds the rationale string at the same time it computes the value — both come from the same digit-by-digit algorithm. The LLM receives `{value, rationale, tag}` and paraphrases the given rationale instead of inventing one.

Before/after metrics (tested across 5 MC problems, 15 total distractors):
- Accurate rationales: 21% → 100%
- Phantom numbers in rationales: 25% → 0%
- "Made multiple errors" cop-outs: 33% → 0%
- Math errors in rationale text: 21% → 0%
- Auto-regeneration needed: YES (Q1 took 2+ retries) → NO (all 5 first-try)

**MC Schema Extensions:**

The problem schema gains two MC-specific fields when `answerType === 'multipleChoice'`:

```javascript
{
  // ... standard problem fields ...
  "answerType": "multipleChoice",
  "mcOptions": [
    { "letter": "A", "text": "583", "value": 583 },
    { "letter": "B", "text": "593", "value": 593 },
    { "letter": "C", "text": "645", "value": 645 },
    { "letter": "D", "text": "821", "value": 821 }
  ],
  "distractorRationales": {
    "A": "The student added without carrying from the ones to the tens column",
    "C": "The student added instead of subtracting",
    "D": "The student subtracted the smaller digit from the larger in each column"
  },
  "correctAnswer": "B"
}
```

The `distractorRationales` field maps each incorrect option letter to a one-sentence explanation of the student error that produces that value. This field is built by `cerebras-api.js` from the LLM's `distractorReasoning` output (a computation-first array) via a bridge function.

**MC-Specific Validation Checks (added to validation pipeline when MC is active — see §10):**
- **Duplicate value detection (HARD GATE):** No two options can share the same numeric value. Triggers auto-regeneration on failure. Pre-computed values make this virtually impossible to trigger.
- **Rationale-value cross-check (HARD GATE):** Every number mentioned in a distractor rationale must match the actual option value. Catches LLM-fabricated arithmetic. Promoted from WARNING to HARD GATE after discovering 67% fabrication rate.
- **Consecutive integer detection:** Flags problems where distractors are all within ±3 of the correct answer (diagnostic of LLM falling back to "lazy" distractor generation).
- **Wide-spread check:** Verifies distractor values span a meaningful range relative to the correct answer.

When answer format is **Mix**, each problem is randomly assigned either Open Response or MC, independent of its problem format (word/bare). The LLM prompt specifies which problems get MC options (by firewall number) so distractors are only generated where needed. Mix ratio uses the same explicit-integer-count approach as Problem Format: randomly selects 60/40, 50/50, or 40/60 MC-to-open ratio per generation cycle.

**TEKS Coverage Note:** The pre-computed distractor architecture works for ALL arithmetic TEKS (3.4x operations: ADD, SUBTRACT, MULTIPLY, DIVIDE) regardless of whether that specific TEKS has a distractor-patterns.js entry. The pattern bank provides TEKS-specific pedagogical guidance; the pre-compute function provides correct numeric values. TEKS without pattern bank entries still get pre-computed values with correct spread — they just lack the STAAR-specific error taxonomy in the rationale. Fraction TEKS (3.3x), geometry, measurement, data analysis, and financial literacy TEKS are NOT currently supported by the MC pipeline and require different problem generation architectures.

### Few-Shot Exemplar Bank [NEW v3.9]

**Purpose:** The Groq/Llama 3.3 70B system prompt includes carefully selected few-shot exemplars that show the LLM what a high-quality STAAR-style problem looks like. Without these, the LLM generates syntactically valid but pedagogically weak problems -- correct math with useless distractors, missing diagnostic value, and inconsistent difficulty targeting. The exemplar bank solves this by providing real STAAR problems (and 3 synthetic items for never-tested TEKS) as concrete patterns for the LLM to emulate.

**Research basis:** The few-shot prompting research (see `Few-Shot_Prompting_for_STAAR-Quality_Educational_Content_with_Llama_3_3__Optimal_Exemplar_Selection__Formatting__and_Dynamic_Retrieval_Strategies.md`) established that 3-5 carefully curated exemplars per TEKS dramatically outperform zero-shot for Llama 3.3 70B. Quality and relevance matter more than quantity. Dynamic selection (picking exemplars that match the specific TEKS being generated) matches or exceeds 10+ static examples at a fraction of the token cost. The exemplar bank is the raw material that makes dynamic selection possible.

**Three-Tier Flywheel Architecture:**

The exemplar system has three layers that reinforce each other over time:

**Tier 1 -- Seed Bank (this file set).** 135 gold-standard exemplars extracted from official STAAR released tests (2019-2025) plus 3 synthetic items. Read-only, admin-maintained. The selection function draws from this bank for EVERY system prompt, picking up to 5 relevant exemplars per TEKS (not all 135 -- see selection function below). This is what Claude Code sessions implement.

**Tier 2 -- teks-rules.json constraints.** Static validation rules per TEKS (allowed number ranges, permitted operations, denominator sets, step counts). Constrains what the LLM can generate independently of exemplars. See Section 7 "teks-rules.json File Spec."

**Tier 3 -- Organic Growth Library (future).** Every teacher-approved problem becomes a candidate exemplar. Stored in localStorage per teacher. Over time, the best teacher-vetted problems supplement the seed bank, creating a personalized exemplar set per classroom. Selection ratio: always pull at least 1 from seed bank, fill remaining slots with teacher exemplars if available.

**★ Favorite Annotation Mechanism (Tier 3 Quality Signal) [NEW v4.0]:**

When the teacher clicks ★ Favorite on a problem in the Teacher Review Screen, an optional text input expands: "What made this problem great? (optional)". The teacher can type a brief annotation (e.g., "love the difficulty level," "perfect wording for my students," "great distractor design") or skip it entirely. If provided, the annotation is saved as `whyThisIsGood` on the exemplar object. If left blank, the field is null and the exemplar is still saved — favoriting without annotation is perfectly valid.

When this exemplar is later injected as a few-shot example, `whyThisIsGood` is included alongside the problem, giving the LLM explicit signal about what qualities to replicate. This is the primary mechanism for the flywheel's quality improvement: the LLM doesn't just see "here's a good problem," it sees "here's a good problem AND here's specifically what makes it good."

**Dual-Input Flywheel (Phase 5B Enhancement) [NEW v4.0]:**

The flywheel receives quality signal from two independent channels:

**Input Stream 1 — Teacher Annotation (existing):** ★ Favorite with optional `whyThisIsGood`, stored as exemplar, injected into future generation for same TEKS. This is available from Phase 4 onward.

**Input Stream 2 — Student Performance Data (Phase 5B only):** Per-TEKS accuracy rates, distractor selection frequency, and response time patterns. When the tracked student device version is active, student performance metadata attaches to exemplars: "22/25 students got this right — good baseline problem" or "8/25 got this right — excellent diagnostic problem."

Future generation can use this signal in two ways. First, if students consistently pick the "forgot to regroup" distractor on 3.4A problems, the system can generate more regrouping-focused problems. Second, if 90% of the class aces a TEKS, the system can suggest harder difficulty parameters next time. The flywheel improves from two independent channels without any model fine-tuning or retraining.

**Batch Structure:**

The exemplar bank was extracted in three batches following a priority-ordered plan:

| Batch | Scope | Items | TEKS | Source | Status |
|-------|-------|-------|------|--------|--------|
| 1 | Readiness Standards | 65 | 13 | STAAR 2019-2025 | COMPLETE, audited (Batch 1 Pass) |
| 2 | Supporting Standards | 67 | 30 | STAAR 2019-2025 | COMPLETE, audited (Passes 1-5) |
| 3 | Missing TEKS | 3 | 3 | Synthetic (author-drafted) | COMPLETE, teacher-approved |
| **Total** | **All Grade 3 Math** | **135** | **46** | -- | **100% TEKS coverage** |

Readiness standards were extracted first because TEA weights them more heavily on STAAR (~60-65% of test) and they appear on every released exam. Supporting standards were extracted second. Three TEKS (3.3A, 3.9C, 3.9F) were never tested on any released STAAR exam 2019-2025, so synthetic items were drafted to match neighboring TEKS patterns and reviewed by a teacher.

**Coverage Statistics:** 135 items across 46 unique TEKS. Average 2.9 items per TEKS. Excellent coverage (5+ items): 12 TEKS. Good coverage (3-4 items): 13 TEKS. Moderate (2 items): 11 TEKS. Single item: 10 TEKS (including 3 synthetic). Every Grade 3 Math TEKS has at least one exemplar.

**Item Type Distribution (by `staarItemType` field):** 125 MultipleChoice (92.6%, includes 3 synthetic), 3 InlineChoice adapted to MC (2.2%), 2 DragAndDrop adapted to MC (1.5%), 2 HotSpot adapted to MC (1.5%), 2 Griddable/free-response (1.5%), 1 Multiselect (0.7%). All interactive STAAR items were successfully adapted to MC format while preserving original mathematical content. Adaptation faithfulness was verified item-by-item during audits. The 3 synthetic Batch 3 items are also MultipleChoice and are distinguishable by `source: "synthetic"` rather than a separate item type.

**Storage Schema (21 fields):** Every exemplar in the bank has these fields. This is the archival format stored in the JS files.

```javascript
{
  // --- IDENTIFICATION (6 fields) ---
  teks: "3.4A",              // Canonical format "X.YZ" (normalized from TEA's varying formats)
  source: "STAAR",           // "STAAR" for extracted items, "synthetic" for Batch 3
  year: 2023,                // Test administration year (2026 for synthetic)
  itemNumber: 12,            // Position on original test
  grade: 3,                  // Always 3 for this bank
  subject: "math",           // Always "math" for this bank

  // --- PROBLEM CONTENT (5 fields) ---
  questionStem: "A store has 456 books...",  // Full problem text (visual items describe the image inline)
  answerType: "multipleChoice",              // "multipleChoice" | "multiselect" | "integer"
  correctAnswer: "B",                        // string "B" | array ["C","E"] | null (griddable)
  correctAnswerValue: 292,                   // number (for verifiable computation) | null (conceptual)
  options: [                                 // array of 4+ options | null (griddable)
    { letter: "A", text: "164" },
    { letter: "B", text: "292" },
    { letter: "C", text: "392" },
    { letter: "D", text: "344" }
  ],

  // --- DISTRACTOR RATIONALES (1 field, object with 3 keys) ---
  distractorRationales: {
    A: "Subtracted in wrong direction (4-6 instead of 6-4 with regrouping)...",
    C: "Did not regroup from the hundreds place...",
    D: "Added instead of subtracted..."
  },

  // --- SELECTION METADATA (8 fields) ---
  operation: "SUBTRACT",              // One of 12 codes (see below)
  strand: "Number and Operations",    // Deterministic from TEKS prefix
  readinessOrSupporting: "Readiness", // TEA classification
  reportingCategory: 2,               // TEA's 4 reporting categories (1-4)
  problemType: "Computation",         // Human-readable label
  stepCount: 1,                       // 1 or 2 (for TEKS requiring both)
  hasVisual: false,                   // true if original STAAR item had diagram/table/image
  staarItemType: "MultipleChoice",    // Original format before adaptation

  // --- QUALITY ANNOTATION (1 field) ---
  whyThisIsGood: "Tests borrowing across zero in hundreds place..."  // 300-600 chars explaining diagnostic value
}
```

**Type Conventions (polymorphic fields):**
- `correctAnswer`: string `"B"` for MC, array `["C","E"]` for multiselect, `null` for free-response (griddable/equation editor)
- `correctAnswerValue`: number `292` for verifiable numeric answers, `null` for conceptual questions where answer is a concept not a number
- `options`: array of `{letter, text}` objects for MC/multiselect, `null` for free-response

**Injection Schema (7 fields):** When exemplars are injected into the Groq system prompt, the 21-field storage schema is stripped down to 7 fields. The stripping function removes identification metadata, selection metadata, and fields the LLM doesn't need to see. Token cost varies by exemplar length (shortest ~160 tokens for terse items like griddables, longest ~660 tokens for items with long stems and detailed rationales, average ~400 across all 135 items in compact JSON). With the current 5-per-TEKS selection cap (no global cap), a typical mission selecting 3-4 TEKS injects 15-20 exemplars totaling ~6,000-8,000 tokens. The maximum practical case (5 TEKS × 5 exemplars = 25) would be ~10,000 tokens. Even the maximum is well within the Llama 3.3 70B 128K context window, representing ~6-8% of the available budget. (Note: the original 10-exemplar global cap produced ~4,000 tokens at ~3% — that cap was removed after discovering it starved multi-TEKS missions of sufficient coverage.)

```javascript
// toInjectionFormat() strips storage schema --> injection schema
function toInjectionFormat(exemplar) {
  return {
    teks: exemplar.teks,
    questionStem: exemplar.questionStem,
    answerType: exemplar.answerType,
    options: exemplar.options,
    distractorRationales: exemplar.distractorRationales,
    correctAnswer: exemplar.correctAnswer,
    whyThisIsGood: exemplar.whyThisIsGood
  };
}
```

**Exemplar Selection Function:** The selection function picks the best N exemplars for a given set of TEKS, balancing coverage with diversity. It returns injection-ready 7-field items (calls `toInjectionFormat` internally -- do NOT apply `toInjectionFormat` again to its output).

Budget scaling: up to 5 exemplars per TEKS, no global cap. The selection function returns the best exemplars for each requested TEKS independently — if 3 TEKS are selected, it returns up to 5 exemplars per TEKS (up to 15 total). This was changed from the original "hard cap 10 total" design after discovering that the budget-constrained approach starved multi-TEKS missions of sufficient exemplar coverage.

For each TEKS, the function filters the exemplar bank to matching items, then uses `diverseSelect()` to pick the best N while maximizing diversity across operation (Priority 1) and stepCount (Priority 2), with remaining slots filled from the pool. Teacher-edited exemplars (Tier 3, future) are preferred when available.

**Exemplar Bank Operation Codes (12 codes):** These are the simplified codes used in the exemplar bank's `operation` field for selection diversity. They are distinct from the 15 generation pipeline operation codes listed earlier in this section -- the generation codes include prefixed variants like `FRACTION_ADD` that tell the LLM what to generate, while these simplified codes drive the selection function's within-TEKS diversity logic.

`ADD`, `SUBTRACT`, `MULTIPLY`, `DIVIDE` (arithmetic), `COMPARE` (number/fraction comparison), `CLASSIFY` (shape/type identification), `REPRESENT` (place value, number forms, fraction models), `MEASURE` (perimeter, area, time, length), `DATA_INTERPRET` (reading charts, tables, graphs), `PATTERN` (input-output tables, sequences), `FINANCIAL` (money concepts), `CONCEPTUAL` (understanding checks).

**Strand Mapping (deterministic from TEKS prefix):** `3.2x`/`3.3x`/`3.4x` --> "Number and Operations", `3.5x` --> "Algebraic Reasoning", `3.6x`/`3.7x` --> "Geometry and Measurement", `3.8x` --> "Data Analysis", `3.9x` --> "Personal Financial Literacy".

**Extraction Conventions (documented during 5-pass audit):**
- All TEKS codes normalized to canonical `X.YZ` format (e.g., TEA's `3.4(A)` or `3.2.4.A` --> `3.4A`)
- 2019-2022 even-numbered items used F/G/H/J answer letters (TEA convention to reduce copying); all normalized to A/B/C/D during extraction with distractor rationales remapped accordingly
- Interactive STAAR items (InlineChoice, DragAndDrop, HotSpot) adapted to MC format; original format preserved in `staarItemType` field for traceability
- Griddable/EquationEditor items stored with `correctAnswer: null`, `options: null`, `correctAnswerValue: [numeric answer]`
- Tables described inline in questionStem when data is fully representable as text (hasVisual may be false even though original test showed a formatted table, because the LLM has all needed data from the text description)

**Quality Audit Summary (5 passes, all 67 Batch 2 items + spot checks on Batch 1):**

| Finding | Severity | Count | Resolution |
|---------|----------|-------|------------|
| Strand naming inconsistency (2024-2025 used TEA RC names instead of prefix-based names) | MODERATE | 13 items | FIXED -- all normalized to prefix-based convention |
| Rationale phrasing variation (same concept, different words vs TEA) | MINOR | 1 item | Left as-is (defensible) |
| hasVisual=false for inline-described tables | MINOR | 2 items | Left as-is (LLM has all data) |
| Stale header comments (wrong counts) | MINOR | 2 comments | FIXED |
| Duplicate section header | COSMETIC | 1 | FIXED |
| Wrong correct answer, TEKS code, or distractor mapping | CRITICAL | **0** | -- |

Zero critical errors across 135 items. Every correct answer, TEKS code, reporting category, and distractor rationale verified against official TEA source documents (answer keys, rationale PDFs, test PDFs, CSV ground truth).

**Exemplar Bank Files (all in project folder and GitHub repo):**
- `Batch_1_readiness_standards_exemplars.js` -- 65 items, 13 Readiness TEKS, exports `PROBLEM_EXEMPLARS`. **Also exports utility functions:** `toInjectionFormat(exemplar)` (strips 21-field --> 7-field), `selectExemplars(selectedTeks, exemplarBank)` (budget scaling + diverse selection), and `diverseSelect(pool, n)` (maximizes operation and stepCount diversity). These are ALREADY IMPLEMENTED and tested -- the integration task is to combine all 3 batch arrays into one and pass the combined array to these existing functions. Do NOT reimplement. **WARNING:** `selectExemplars` has a default parameter `exemplarBank = PROBLEM_EXEMPLARS` (Batch 1 only, 65 items). You MUST pass the combined 135-item array explicitly: `selectExemplars(selectedTeks, ALL_EXEMPLARS)`. Omitting the second argument silently limits search to Batch 1.
- `Batch_2_supporting_standards_exemplars__1_.js` -- 67 items, 30 Supporting TEKS, exports `BATCH2_SUPPORTING_EXEMPLARS`. **NOTE:** The `__1_` suffix is a Claude.ai upload artifact from the revised version. This is the PRODUCTION file (with strand normalization fixes applied). If a non-suffixed `Batch_2_supporting_standards_exemplars.js` exists in the GitHub repo, it is SUPERSEDED -- do not use it.
- `Batch_3_missing_teks_exemplars.js` -- 3 items, 3 never-tested TEKS, exports `BATCH3_MISSING_TEKS_EXEMPLARS`

**Browser Integration (CRITICAL for Prompt 2):** The exemplar files use `const` declarations and conditional `module.exports` guards. In the browser (no bundler, loaded via `<script>` tags from `file://`), the `module.exports` block is skipped but the `const` arrays and `function` declarations are accessible to subsequent scripts in the global scope. To integrate:

0. Copy the 3 exemplar files from the project folder into `js/`. Rename `Batch_2_supporting_standards_exemplars__1_.js` --> `Batch_2_supporting_standards_exemplars.js` (drop the `__1_` Claude.ai upload artifact). The other two filenames are clean.
1. Add three `<script>` tags to `index.html` for the exemplar files. Position them in the load order AFTER `config.js` (slot 13.5) but BEFORE `cerebras-api.js` (slot 13.6). The order among the three exemplar files does not matter, but all three must load before cerebras-api.js. Suggested slots: 13.51, 13.52, 13.53. See the Script & CSS Load Order table in Section 17 (Implementation Files) for exact entries.
2. In `cerebras-api.js`, combine all three arrays at the top of the file: `const ALL_EXEMPLARS = [...PROBLEM_EXEMPLARS, ...BATCH2_SUPPORTING_EXEMPLARS, ...BATCH3_MISSING_TEKS_EXEMPLARS];`
3. When building the system prompt in `generateMission()`, call `selectExemplars(selectedTeks, ALL_EXEMPLARS)` -- this returns injection-ready 7-field JSON objects, already stripped by `toInjectionFormat`. Stringify them and embed in the system prompt after the instruction block but before the generation query.
4. Do NOT use `require()` or `import` -- the app has no bundler and runs from `file://`.

### AI Prompt Structure

The AI prompt must enforce:
1. **Schema compliance** -- Output must match expected structure exactly (use Groq response_format: { type: "json_object" })
2. **TEKS alignment** -- Problems must target selected standards
3. **Problem type correctness** -- Each problem's type must match what the target TEKS requires
4. **Diagnostic value** -- Some problems should reveal common errors
5. **Difficulty progression** -- Firewalls 1-3 easier, 4-7 medium, 8-10 harder
6. **Narrative wrapping** -- Each problem needs Iron Man themed context
7. **Grade appropriateness** -- Number ranges match grade expectations
8. **Cross-curricular theming** -- When enabled, incorporate science TEKS vocabulary
9. **Diagram descriptor** -- Include diagram field when visual would aid understanding (see Section 11)
10. **Few-shot exemplar injection** -- Include STAAR-sourced exemplars from the exemplar bank (Section 7 "Few-Shot Exemplar Bank"), stripped to injection schema, positioned after instructions but before the generation query per few-shot positioning research. Exemplars are dynamically selected to match the teacher's chosen TEKS (up to 5 per TEKS, no global cap -- see selection function spec). **CRITICAL: The system prompt must explicitly instruct the LLM not to copy exemplars verbatim.** Include language like: *"Study these examples carefully. They show the quality standard you must match -- the difficulty level, narrative style, and distractor reasoning. Generate ORIGINAL problems inspired by these patterns. Do NOT copy or closely paraphrase any example."* The exemplar bank teaches patterns, not recycles problems. Without this instruction, the LLM may reproduce exemplars word-for-word instead of generating new content.

### Grade-Specific Number Ranges

| Grade | Addition/Subtraction | Multiplication | Division |
|-------|---------------------|----------------|----------|
| 1 | Within 20 | N/A | N/A |
| 2 | Within 1,000 | N/A | N/A |
| 3 | Within 1,000 | Facts to 10x10 | Related division facts |
| 4 | Within 10,000 | 4-digit x 1-digit, 2-digit x 2-digit | 4-digit x 1-digit |
| 5 | Decimals to thousandths | Decimals to hundredths | Decimals, fractions |

### teks-rules.json File Spec [NEW v3.8]

Static JSON lookup file containing every content standard across grades 1-5 (excluding process standards X.1A-X.1G). Each entry encodes validation constraints that are programmatically checkable.

**Entry structure:**
```javascript
{
  "3.4A": {
    "text": "solve with fluency one-step and two-step problems involving addition and subtraction within 1,000",
    "grade": 3,
    "strand": "number and operations",
    "primaryType": "computation",
    "validationTypes": ["computation"],
    "operations": ["ADD", "SUBTRACT"],
    "maxOperandDigits": 3,
    "maxResult": 1000,
    "allowedDenominators": null,
    "answerFormat": "integer",
    "suggestedDiagrams": ["numberLine", "stripDiagram"],
    "stepCount": [1, 2]
  },
  "3.3A": {
    "text": "represent fractions with denominators of 2, 3, 4, 6, and 8",
    "grade": 3,
    "strand": "number and operations",
    "primaryType": "fraction",
    "validationTypes": ["fraction", "identification"],
    "operations": ["IDENTIFY"],
    "allowedDenominators": [2, 3, 4, 6, 8],
    "answerFormat": "fraction",
    "suggestedDiagrams": ["fractionBar", "fractionCircle"]
  }
}
```

**Data sources:** TEA Machine-Readable TEKS at teks.texasgateway.org (IMS Global CASE format, JSON-LD via REST API) and Common Standards Project open-source API (github.com/commonstandardsproject/api).

**Coverage:** Approximately 61% of the 217 student expectations across grades 1-5 (132 entries) contain quantifiable constraints checkable programmatically. The remaining ~39% (too conceptual for rule-based validation) rely on the teacher review screen (Section 9) — the teacher is the quality gate for problems where automated rules cannot verify alignment.

**Consumers:** Problem generation system prompt (tells LLM what constraints to follow), validation pipeline Layers 3 and 4 (Section 10), Teacher Review Screen problem type badges (Section 9).

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

### POLLING State (Student Device Mode) [NEW v4.0]

When Student Devices are enabled (see §15), a CONDITIONAL state is inserted into the mission flow between QUESTION_DISPLAYED and ANSWER_SUBMITTED. When Student Devices are OFF (the default), this state is skipped entirely and the existing flow is unchanged.

```
FIREWALL N DISPLAYED (question renders on TV)
         |
         v
+----------------------------------------------------------------------+
|  QUESTION_DISPLAYED                                                   |
|  (existing state — always reached)                                    |
+----------------------------------------------------------------------+
         |
         +--- Student Devices OFF? ---> Skip to ANSWER_SUBMITTED
         |                               (teacher types/speaks answer directly)
         |
         +--- Student Devices ON? ---v
                                     |
+----------------------------------------------------------------------+
|  POLLING (conditional state — only when Student Devices enabled)       |
|  -------------------------------------------------------------------  |
|  1. Durable Object pushes question + MC options to all connected      |
|     student devices via WebSocket                                      |
|  2. Student devices display question and A/B/C/D answer buttons       |
|  3. Teacher's screen shows live bar chart of incoming responses       |
|     updating in real-time                                              |
|  4. Teacher can:                                                       |
|     a) Wait for all students to respond (or POLL_TIMEOUT_SECONDS)     |
|     b) Accept the majority vote (system auto-selects most popular)    |
|     c) Override with their own selection (teacher always has final     |
|        authority — this is Core Design Principle #2)                   |
|  5. Exits to: ANSWER_SUBMITTED with the teacher's confirmed answer    |
+----------------------------------------------------------------------+
         |
         v
+----------------------------------------------------------------------+
|  ANSWER_SUBMITTED                                                     |
|  (existing state — answer source is transparent to downstream logic)  |
+----------------------------------------------------------------------+
```

The answer processing pipeline, pattern detection, hint system, and all downstream logic are identical regardless of whether the answer came from teacher input or student device polling. The POLLING state is purely an input-collection mechanism.

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

## 9. Teacher Review Screen [NEW v3.8]

### Design: Option C -- Split Panel Layout

The Teacher Review Screen appears after mission generation completes. It uses a split-panel design with problem list on the left and detail/feedback panel on the right.

**Left Panel -- Problem List:**
- Scrollable list of all 13 problems (10 math + 3 science)
- Each row shows: problem number, first ~40 characters of problem text, primary type badge (colored), traffic light confidence badge (green/yellow/red)
- Clicking a row selects it and loads detail in right panel
- "Approve & Next" button on each row auto-advances to next problem
- Sort by confidence ascending (problems needing attention appear first)

**Right Panel -- Detail + Feedback:**
- Full problem text with narrative
- Complete answer with work shown (expression, operands, result)
- All validation detail chips: Structure ✅/❌, Math ✅/❌, Content ✅/⚠️, TEKS ✅/❌, Llama Guard safety flag (🛡️ blue shield icon with purple label text, if triggered)
- Expandable "Why this score?" panel showing each validation signal and specific flags in plain language
- Cross-curricular badge (purple) showing science TEKS connection if applicable
- Llama Guard safety flag (🛡️ blue shield icon with purple label text in the bottom legend, if triggered by content flagging)

**Per-Problem Feedback System:**

Quick-action chips for common tweaks (zero typing required for most cases). Each chip has a distinct architecture — they are NOT all identical API calls:

**"Easier Numbers" / "Harder Numbers" (difficulty chips):** These send an API call to the LLM but SKIP `generateOperandsForTeks()` entirely. Instead, the original problem's operands are included in the feedback as context (e.g., "These are the current numbers: 84 + 15. Use SMALLER numbers appropriate for this grade level."). The LLM chooses new numbers guided by the feedback, and Layer 4 TEKS validation catches anything out of range. See "Easier/Harder Numbers Architecture" subsection below for the root cause analysis that led to this design.

**"Word Problem" (format chip):** Sends an API call WITH `mathConstraints` containing the original problem's `{ operands, operation, answer, expression }`. The LLM generates narrative around those exact numbers. After the LLM returns, the system FORCES math fields (operand1, operand2, operation, answer, expression) back to the original constrained values — the LLM is only trusted for narrative text (`questionStem`) and `scienceLabel`. This prevents the known failure mode where the LLM correctly uses constrained numbers in the story text but hallucinates entirely different values in the JSON response fields.

**"Bare Math" (format chip):** LOCAL transformation — NO API call. The problem object already has an `expression` field (e.g., "78 - 30 = ?") even for word problems. The chip reads `expression`, rewrites `questionStem` to "Solve: " + expression, updates `format` to 'bare', and re-renders. Instant, deterministic, zero failure modes. Falls back to building from operand1/operand2/operation if `expression` is missing.

**"✦ Science" (cross-curricular chip):** Opens a dropdown showing the mission's selected science TEKS with short descriptions (e.g., "3.7B: Forces & Motion"), plus "Choose Other TEKS..." (expands to ALL grade-level science TEKS) and "Remove Science" options. Selecting a TEKS triggers an API call with `mathConstraints` (preserving the math) and the selected science TEKS as theming context. Only appears on word problems (bare math has no narrative for science context).

**"Multiple Choice" / "Open Response" (answer format chips):** Per-problem answer format conversion. The "Multiple Choice" chip appears on open response problems; the "Open Response" chip appears on MC problems. "Multiple Choice" sends an API call requesting the LLM to generate the problem with A/B/C/D options and diagnostically-designed distractors. "Open Response" converts in the opposite direction — strips MC options and returns to numeric input. These follow the same pattern as the Word Problem / Bare Math chips but operate on the answer format axis rather than the problem format axis. Implemented in MC bugfix v1.

**All regeneration chips append two implicit constraints** before the LLM call: operation preservation ("IMPORTANT: Keep the same operation (subtraction). Do not change to a different operation.") and format preservation ("Keep this as a word problem with context." or "Keep this as a bare math expression."). These are logged as `[Review] Enhanced feedback:` in the console. Exception: difficulty chips (Easier/Harder) do NOT get mathConstraints because their purpose is to change the numbers.

Free-text feedback field for anything custom (e.g., "Use division instead of multiplication"). Free-text feedback triggers a standard Groq regeneration call with the teacher's text as feedback. **Important fix (bugfix v11):** The original code truncated feedback text to ~40 characters before sending to the LLM API — a silent data loss bug. A teacher typing "can you incorporate black panther and wakanda technology?" would see the LLM receive only "can you incorporate black " and hallucinate freely. The fix sends the complete feedback string to the API; the console.log now truncates cosmetically with "..." for readability only.

"Replace with Custom" button opens form: question text, answer, TEKS tag (dropdown), difficulty (dropdown), optional science TEKS connection.

**Easier/Harder Numbers Architecture — Root Cause & Fix (Bugfix Round 15):**

The original regeneration path called `generateOperandsForTeks(teksCode, Math.floor(Math.random() * 10))` to pick NEW random operands before every regeneration. The `problemIndex` parameter controlled tier selection: < 3 = easy, < 7 = medium, >= 7 = hard. Because the index was random, "Easier Numbers" had a ~70% chance of selecting medium or hard tier operands — producing numbers LARGER than the originals. The LLM then received contradictory instructions: the feedback text said "Use smaller, simpler numbers" while the PRE-SELECTED NUMBERS line in the system prompt said "Use these EXACT numbers: 409 - 141." The LLM obeyed the explicit instruction, producing bigger numbers.

This also explained why "Harder Numbers" appeared to work flawlessly during testing: the random generator's natural bias toward medium/hard tiers (70%) aligned with the teacher's intent for larger numbers. The asymmetry was only visible when testing "Easier Numbers" with wide-range TEKS like 3.4A (anything within 1,000).

The fix: difficulty chips (Easier/Harder Numbers) SKIP `generateOperandsForTeks()` entirely during regeneration. Instead, the original problem's operands are included as context in the feedback text, and the LLM is free to choose appropriate numbers guided by the difficulty direction. Layer 4 TEKS validation catches anything that exceeds TEKS constraints. This is the correct division of labor: the LLM handles creative number selection, deterministic validation handles constraint enforcement.

NOTE: This fix applies ONLY to difficulty chips. The "Word Problem" and "✦ Science" chips still use `mathConstraints` to preserve the exact original math. The "Bare Math" chip uses no API call at all.

**Primary/Secondary Problem Type Display:**
- Primary type gets full-color badge (matching TEKS type color system -- cyan for computation, green for geometry, orange for data analysis, etc.)
- Secondary types get smaller, outlined badges next to primary
- Types derived from teks-rules.json entry, not LLM decision -- deterministic assignment

**Validation Confidence Display:**
- Traffic light badge: green circle (High Confidence), yellow triangle (Needs Review), red diamond (Likely Issues)
  - Distinct shapes supplement colors for red-green colorblind accessibility (~10% of males)
- Score shown as range label ("High Confidence"), NOT precise percentage -- UX research shows "87.3%" triggers suspicion
- Detail chips per validation dimension (expandable)
- Sort problems by confidence ascending so flagged items appear first

**Approval Workflow:**
- "Approve & Next" on each problem auto-advances
- "Approve All" button at bottom for when teacher is satisfied
- "Start Mission" button activates only after all problems approved
- Approved problems locked (visual indicator changes), can be unlocked by clicking again

**Navigation — Back to Setup Screen:**

A "← Back to Setup" link appears in the review screen header, allowing the teacher to return to the setup/selection screen if she chose the wrong grade, wrong TEKS, or wants to start over. If the teacher has any approved problems, a confirmation dialog warns about losing progress (e.g., "You have 6 approved problems. Going back will discard your review. Continue?"). After confirming, the previous setup selections (grade, TEKS, cross-curricular, answer format) are preserved so the teacher only needs to change what was wrong, not re-select everything. Implemented in bugfix v10 (commit `4e29ce2`), button size enlarged in bugfix v11 (commit `3e78d49`) for classroom TV visibility.

**UPLOADED vs AI GENERATED Badges:**
- For hybrid missions (PDF upload + AI generation), each problem shows badge indicating source
- UPLOADED badge: blue outline
- AI GENERATED badge: cyan outline

### Per-Problem TEKS Override Toggle [NEW v4.0]

Each problem card includes a small toggle labeled "TEKS Override" (default OFF). This toggle controls how Layer 4 (TEKS Alignment) of the validation pipeline behaves during regeneration for that specific problem.

**When OFF (default):** TEKS validation operates as a hard gate. If the teacher clicks a quick-action chip (e.g., "↑ Harder Numbers") and the regenerated problem violates TEKS constraints, the system auto-regenerates without showing the violating problem. This is the safe default — the teacher never sees TEKS-misaligned content. If all 3 auto-regeneration retries are exhausted without producing a TEKS-compliant problem, an amber banner appears near the validation chips: "Could not generate within TEKS constraints. Enable TEKS Override to go beyond limits." This guides the teacher to the override toggle rather than silently failing. Implemented in bugfix v4.

**When ON:** TEKS validation switches to ADVISORY mode. Violations display as amber warnings with explanation text (e.g., "⚠ Operands exceed TEKS 3.4F limit (10×10)"), but the problem is NOT auto-regenerated and NOT blocked. The teacher can review the warning and choose to keep or re-roll the problem.

**Use case:** Teacher clicks "↑ Harder Numbers" on a 3.4F problem (multiply up to 10×10). LLM returns operands of 12×8. Validation flags TEKS violation (exceeds 10×10 limit). Without override, the system auto-regenerates. WITH override toggle ON, the system shows the warning but allows the teacher to keep the problem — because the teacher knows their students and wants to push them beyond TEKS minimums.

**Scope rules:**
- This applies ONLY to the regeneration path via quick-action chips. Custom problems entered via "Replace with Custom" already skip TEKS validation entirely (confirmed working). Initial generation always uses hard gate enforcement.
- The toggle is per-problem, not global — the teacher can override validation for one problem while keeping it strict for the other nine.
- Layers 1-2 (structural integrity, mathematical correctness) are ALWAYS hard gates regardless of override. A math error can never be overridden. See §10 for the complete two-tier validation system.

### TEKS Description Tooltips [NEW v4.0]

Hovering over any cyan TEKS badge (e.g., "3.4F") shows a native browser tooltip with the full TEKS description text. Data source is `window.TEKS_RULES_DATA` from teks-rules-data.js (217 math TEKS entries). Example: hovering "3.4F" shows "recall facts to multiply up to 10 by 10 with automaticity and recall the corresponding division facts." Implementation is a `title` attribute on the badge element, populated by looking up the TEKS code in the rules data at render time.

### Cross-Curricular Badge Label Fix [NEW v4.0]

**Problem:** Purple cross-curricular badge currently displays "✦ 3.7B: 3.7B" (TEKS code duplicated where the description should be).

**Root cause:** teks-rules.json contains ONLY math TEKS. Science TEKS codes numerically overlap with math codes. Math 3.7B = "determine the perimeter of a polygon" while Science 3.7B = "demonstrate how position and motion can be changed by pushing and pulling." Looking up a science TEKS code in teks-rules.json returns the WRONG description.

**Fix:** The LLM provides the science description directly in its response. The system prompt already contains science TEKS text. The LLM output schema includes `crossCurricular.label` which must be a human-readable description (e.g., "Forces & Motion"), NOT the raw TEKS code. The review screen maps `crossCurricular.label` directly to the badge display text. Fixed badge displays "✦ 3.7B: Forces & Motion" (code + human-readable description from LLM).

### ★ Favorite Annotation Field [NEW v4.0]

When the teacher clicks ★ Favorite on a problem, a text input expands below the star with placeholder text "What made this problem great? (optional)". The textarea is approximately 2 lines tall. The annotation is entirely optional — the teacher can leave it blank and the exemplar is still saved.

**Data flow:**
- On save: `whyThisIsGood` field added to the exemplar object stored in localStorage via `ExemplarBank.save()`
- If left blank: field is `null`, exemplar still saved (favoriting without annotation is perfectly valid)
- When this exemplar is later retrieved for few-shot injection via `toInjectionFormat()`, `whyThisIsGood` is included in the 7-field injection schema alongside the problem content
- The LLM sees both the problem pattern AND what the teacher liked about it, enabling targeted quality improvement

See §7 "★ Favorite Annotation Mechanism" for the flywheel architecture this feeds into.

### Post-Mission Analytics Dashboard (Phase 5B Only) [NEW v4.0]

When tracked student devices are active (Phase 5B — see §2, §15, §21), the review screen gains a post-mission analytics view accessible after the mission completes. This is NOT visible during the pre-mission review phase.

**Analytics available:**
- Per-problem accuracy: which problems had lowest/highest student accuracy
- Distractor analysis: which wrong answers were selected most frequently, mapped to the misconceptions they diagnose
- Per-student TEKS performance: which TEKS each student demonstrated mastery on vs. struggled with
- Team breakdowns: if Competition Mode was set to Teams, performance data sliced by team

**Phase gating:** This feature is clearly Phase 5B functionality. It requires tracked student device data (per-student answers persisted to Cloudflare D1). It is NOT built in Phase 4 or Phase 5A. The review screen should not display any analytics UI elements until Phase 5B is implemented and tracked mode is active for the session.

**Relationship to Benchmark Tracking (§1):** This dashboard supplements, not replaces, the Benchmark Tracking export. Benchmark Tracking provides per-session JSON/CSV export from the teacher's local machine (available in base mode, no student devices required). The Analytics Dashboard provides cross-session, per-student insights backed by D1 persistence (Phase 5B only).

---

## 10. Multi-Layer Validation Pipeline [NEW v3.8, UPDATED v4.1]

### Overview

Four-layer progressive validation ensures every AI-generated problem passes automated quality checks before reaching the Teacher Review Screen. All four layers are sync and instant. A fifth layer (async LLM review) was built, tested, and permanently abandoned after proving zero incremental value — see the postmortem below.

### Two-Tier Validation Context [NEW v4.0]

The validation pipeline has four active layers (all sync/instant). The layers operate in one of two tiers depending on the generation context. This distinction is critical for understanding the TEKS override toggle (§9) and its interaction with the validation pipeline.

**Tier 1 — Initial Generation (hard gate on all layers):**
When the teacher clicks "Generate Mission," all 10+3 problems go through the full pipeline with ALL active layers as hard gates. TEKS violations in Layer 4 trigger auto-regeneration. No teacher override is possible at this stage. This ensures the FIRST set of problems the teacher sees is always structurally valid, mathematically correct, and TEKS-compliant.

**Tier 2 — Regeneration via Quick-Action Chips (advisory with override):**
When the teacher uses per-problem feedback chips like "↑ Harder Numbers," "↺ Different Context," "Word Problem," etc., the regenerated problem goes through validation with context-sensitive enforcement:

If the problem's TEKS override toggle is ON (see §9): Layer 4 TEKS alignment violations produce an amber WARNING instead of a hard FAIL. The composite score calculation treats the Layer 4 score as informational — it is logged for the teacher to see but not factored into the pass/fail determination. The teacher can review the amber warning and decide whether to keep the problem.

If the problem's TEKS override toggle is OFF (default): Validation behaves identically to Tier 1. TEKS violations still trigger auto-regeneration.

**Invariant across both tiers:** Layers 1-2 (structural integrity, mathematical correctness) are ALWAYS hard gates regardless of tier or override toggle. A math error can never be overridden. You cannot ship a problem where 24×3 is claimed to equal 68.

### The Four Layers

**Layer 1 -- Structural Validation (sync, instant):**
Verify LLM returned valid JSON with all required fields from the problem schema. HARD GATE -- if schema malformed, problem immediately flagged red, can be regenerated without further checks. Uses safeParseLLMJson() to handle common LLM output errors (trailing commas, unquoted keys, single quotes).

**Layer 2 -- Mathematical Verification (sync, instant):**
Parse expression field with math.js (loaded via CDN at unpkg.com/mathjs@15.1.0/lib/browser/math.js, ~200KB, no build tooling required), compare computed result to expectedAnswer. HARD GATE -- if math wrong, composite score immediately capped at 0, problem gets red flag regardless of all other signals. Math.js handles fractions natively and supports BigNumber mode to avoid JavaScript floating-point traps (0.1 + 0.2 === 0.30000000000000004). For elementary math, configure Fraction mode for fraction problems, use epsilon comparison (Math.abs(a - b) < 1e-10) for decimals.

**Layer 2 MC Extension -- Multiple Choice Validation [NEW v4.1]:**

When `answerType === 'multipleChoice'`, four additional checks run within Layer 2:

1. **MC Duplicate Value Check (HARD GATE):** Extracts numeric values from all 4 options, verifies no two are identical. Triggers auto-regeneration on failure. Log: `[Validation] MC duplicate check: pass/FAIL`. Pre-computed distractor values (§7) make this virtually impossible to trigger since values are guaranteed unique by construction.

2. **MC Rationale-Value Cross-Check (HARD GATE):** For each distractor rationale, extracts all numbers mentioned in the text and verifies they are consistent with the actual option value. Catches LLM-fabricated arithmetic where the rationale describes computing 245 but the option shows 358. Promoted from WARNING to HARD GATE after audit revealed 67% fabrication rate on multi-digit subtraction. Log: `[Validation] MC rationale-value cross-check: pass/FAIL`.

3. **Consecutive Integer Detection (WARNING):** Flags problems where all 3 distractors fall within ±3 of the correct answer. Diagnostic of the LLM falling back to "lazy" distractor generation (picking nearby integers instead of computing real student errors). Does not trigger auto-regen but logged for teacher review.

4. **Wide-Spread Check (WARNING):** Verifies that the spread (max distractor − min distractor) exceeds a threshold relative to the correct answer magnitude. STAAR distractors typically span 10x-100x wider ranges than consecutive integers.

**Layer 3 -- Content Policy and Sensibility Checks (sync, instant):**
Validate grade-appropriate number ranges (lookup table: Grade 1 up to 20, Grade 3 up to 1,000, Grade 5 up to 1,000,000). Check nonsensical scenarios: fractional indivisible objects (4.5 "friends"), negative results for early grades, division by zero. Keyword-operation consistency as soft warning ("shared equally" should map to division, "altogether" to addition -- but generates warnings not failures, since "more" can indicate subtraction in context). Runs from static rules engine, no API calls.

**Layer 4 -- TEKS Alignment Check (sync, instant):**
Look up target TEKS code in teks-rules.json (Section 7), verify problem's operation type, operand sizes, number ranges, fraction denominators match standard's specifications. Returns 0-1 alignment score based on proportion of rules passed. Approximately 60-70% of TEKS student expectations contain quantifiable constraints checkable here.

**Layer 5 — LLM Second-Opinion Review [BUILT, TESTED, ABANDONED v4.1]:**

> **This feature was built, tested extensively, and permanently abandoned.** The postmortem below is preserved to prevent anyone from re-attempting this approach without understanding why it failed. confidence.js has been deleted from the codebase.

Layer 5 was built (confidence.js + solveProblem/reviewProblem in cerebras-api.js) and tested extensively. The implementation included self-consistency voting (5 generation samples, temperature > 0, agreement scoring) and Chain-of-Verification blind review (separate Groq call, factored approach).

**Why Layer 5 was reverted — full analysis:**

**Bugs encountered:** (A) regenerating a problem while Layer 5 was still running caused a crash (callback tried to update a deleted problem), and (B) the regeneration mode-selection logic misinterpreted feedback strings as difficulty shifts, causing a regeneration loop.

**Zero incremental value in testing:** Across all real testing, every single math problem scored "pass" from Layer 5. Self-consistency was 5/5 agreement on every problem. Blind reviewer scores ranged 0.82-0.98 for math. Layers 1-4 had already verified math correctness, JSON validity, grade appropriateness, and TEKS constraint compliance. Layer 5 rubber-stamped all ten math problems and caught zero issues that Layers 1-4 missed.

**Science scoring was counterproductive:** The blind reviewer applied math TEKS standards to science questions, producing scores of 0.44 and 0.52 with concerns like "The problem does not align with TEKS standard 3.6C and is not a math problem." This was noise, not signal — science questions are intentionally not math questions.

**Cost:** 78 extra API calls per mission (6 per problem × 13 problems). ~187 lines of wiring code in teacher-review.js. Made debugging harder because every regeneration was interleaved with Layer 5 validation calls in the console.

**The teacher IS Layer 5:** The project brief's Section 9 describes an entire Teacher Review Screen where a professional educator examines every single problem before students ever see it. The teacher can read the problem, judge whether the wording is confusing, decide if the difficulty is right for her specific students, and use quick-action chips or custom feedback. This human review is infinitely more valuable than an LLM scoring "engagement" at 0.90 versus 0.82. The teacher knows her students. The LLM does not.

**Conclusion:** Layer 5 was solving a problem that doesn't exist. By the time a problem survives schema validation (Layer 1), JS math verification (Layer 2), grade checking (Layer 3), and TEKS rule enforcement (Layer 4), it is already a solid problem. There is nothing ambiguous left for an LLM second-opinion to find. confidence.js is deleted from the codebase and will not be rebuilt.

**Decision:** Layer 5 is permanently abandoned. The MC distractor pipeline (pre-computed values + rationale labels) has proven more impactful — it prevents bad distractors at generation time rather than flagging them after the fact. The teacher review screen is the real quality gate, and it works.

### Tier 2 Async Configuration (ABANDONED — historical reference only) [UPDATED v4.1]

> **This configuration was never deployed and will not be implemented.** It is preserved here solely as historical documentation of the abandoned Layer 5 design. The system runs Layers 1-4 only (sync, instant) with MC validation extension.

- 7-8 API calls per problem: 1 generation + 5 self-consistency samples + 1 LLM blind review + 1 Universal Self-Consistency selection
- For 13 problems: ~91-104 calls per mission
- Groq free tier gives 14,400 requests/day -- Tier 2 uses less than 1% of daily budget
- Self-consistency voting: Generate same problem 5 times with temperature > 0, measure agreement. If 4 out of 5 agree on answer, confidence = 0.8
- Chain-of-Verification blind review: In SEPARATE API call (without showing original output), ask LLM to solve generated problem and verify answer
- Rate limiter: cap at 3 concurrent Groq requests
- Progressive DOM updates: sync layers (1-4) display instantly, async layers (5) populate as results arrive
  - Teacher sees "Math: check | TEKS: check | LLM Review: Checking..." with spinner
  - Remaining badges pop in seconds later
- Promise.allSettled() for graceful degradation if individual calls fail

### Composite Scoring (ABANDONED — required Layer 5 which is abandoned) [UPDATED v4.1]

> **The system does NOT use composite scoring and never will in its current architecture.** Layers 1-4 operate as binary hard gates (pass/fail). A problem either passes all four layers or gets auto-regenerated. The composite scoring formula below was the PLANNED design for the abandoned Layer 5 and is preserved here only as historical documentation.

Hard gates enforce non-negotiable requirements; weighted average handles everything else:

```
function computeCompositeScore(signals) {
  if (!signals.structuralValid) return { score: 0, category: 'red', reason: 'Invalid JSON structure' };
  if (!signals.mathCorrect)     return { score: 0, category: 'red', reason: 'Math answer is incorrect' };

  const score = 0.35 * signals.mathScore
              + 0.10 * signals.structuralScore
              + 0.15 * signals.contentScore
              + 0.20 * signals.teksScore
              + 0.20 * signals.llmReviewScore;

  const category = score >= 0.85 ? 'green' : score >= 0.60 ? 'yellow' : 'red';
  return { score: Math.round(score * 100), category, signals };
}
```

**Weight rationale:**
- Mathematical correctness (0.35) -- deterministic, binary, catches most dangerous errors
- TEKS alignment (0.20) -- misaligned problems fail pedagogical purpose even if math correct
- LLM self-assessment (0.20) -- catches qualitative issues rules cannot detect (confusing wording, ambiguous questions)
- Content policy (0.15) -- catches grade-inappropriateness and nonsensical scenarios
- Structural completeness (0.10) -- mostly sanity check

### API Call Budget Summary

| Configuration | Calls/Problem | Calls/Mission (13) | % of Groq Daily Limit |
|--------------|---------------|--------------------|-----------------------|
| **Layers 1-4 (CURRENT)** | **~1** | **~13** | **0.09%** |
| With regenerations | +1 each | Varies | Still under 1% |
| ~~Tier 2 / Layer 5 (ABANDONED)~~ | ~~7-8~~ | ~~91-104~~ | ~~0.7%~~ |

### School District Value Proposition

When an administrator asks "how do you know AI-generated problems are correct?" the answer is: "Every problem passes four independent automated checks — structural validation confirms proper formatting, deterministic JavaScript independently computes the answer and catches any math errors, content policy filters catch grade-inappropriate scenarios, and TEKS alignment verification checks operand ranges and operation types against the actual TEA standards database — and THEN the teacher reviews everything on a confidence dashboard showing exactly which checks passed or failed, with one-click controls to regenerate anything she doesn't like." Each layer individually defensible, combination genuinely more rigorous than most published edtech products. This aligns with the 1EdTech Consortium's December 2025 guidance calling for "risk-based oversight" of AI in education — this system IS that guidance implemented.

---

## 11. SVG Diagram Generator [NEW v3.8, TIER 1 IMPLEMENTED v4.1]

### Architecture: Hybrid Template Library

LLM outputs structured JSON diagram descriptors. Vanilla JavaScript template library renders mathematically precise SVG. LLMs producing raw SVG is categorically unsafe for educational content -- academic research demonstrates even GPT-4o produces mathematically incorrect SVG diagrams 20-40% of the time. By constraining the LLM to output structured descriptors with numeric parameters, the system gains deterministic mathematical precision.

### JSON Descriptor Schema

The diagram field in the problem schema (Section 7) uses this format:

```javascript
{
  "type": "numberLine",     // Must match a registered renderer
  "params": {
    "min": 0,
    "max": 20,
    "markers": [14],
    "labels": true
  }
}
```

If no diagram is appropriate, the field is null. The LLM decides WHAT to draw (it understands which diagram fits which math concept), and deterministic code handles HOW to draw it (with mathematical precision).

### Diagram Type Registry (Tier 1 -- COMPLETE)

All 8 Tier 1 renderers are implemented in `js/diagramRenderer.js`, tested across ~58 test cases including edge cases and regression. Each renderer validates parameters with sensible defaults and range clamping, uses the `svgEl()` helper with `createElementNS()` for all SVG elements, and follows the `.im-diagram-*` CSS namespace. Iron Man HUD theming applied via CSS custom properties in `css/diagram-hud.css`.

These 8 types cover the most common K-5 TEKS visual requirements (used in 3+ grades each):

| Type Key | Renders | TEKS Coverage |
|----------|---------|---------------|
| `numberLine` | Axis with ticks, labels, markers at precise positions | All 5 grades -- ordering, rounding, fractions, decimals |
| `fractionBar` | Horizontal bar divided into equal parts, some shaded | Grades 3-5 -- fraction representation, comparison |
| `fractionCircle` | Circle divided into equal sectors, some filled | Grades 3-5 -- fraction identification |
| `array` | Grid of circles/dots in rows x columns | Grades 3-4 -- multiplication facts, equal groups |
| `stripDiagram` | Labeled sections showing part-whole relationships | Grades 3-4 explicitly (3.3A, 3.5B, 4.5A); Grade 5 implicitly via generic "pictorial models" |
| `areaModel` | Rectangle partitioned into sub-rectangles with product labels | Grades 3-5 -- multi-digit multiplication, decimal operations |
| `barGraph` | Vertical/horizontal bars with labeled axes and data values | Grades 1-5 -- data representation and interpretation |
| `dotPlot` | Number line with stacked dots above values | Grades 3-5 -- frequency data display |

### Tier 2 Diagram Types (Build Second)

pictographs, equal-sized groups, stem-and-leaf plots, unit square grids, input-output tables

### Tier 3 Diagram Types (Build Later, Grade-Specific)

coordinate planes (grade 5), scatterplots (grade 5), angle/circle models (grade 4), ten frames (grade 1)

### Implementation: Vanilla JavaScript + SVG [IMPLEMENTED v4.1]

No SVG library required. `js/diagramRenderer.js` (~1,470 lines) contains the DiagramRegistry pattern, shared helpers (`svgEl`, `polarToCartesian`, `describeArc`), all 8 Tier 1 renderers, and a `testDiagram()` console helper. Every SVG element created with `document.createElementNS()` (using `createElement()` produces DOM nodes that exist but never render). Each renderer sets its own `viewBox` dimensions appropriate to its layout (numberLine: 800×300, barGraph: 800×400, fractionBar: 800×200, etc.).

**DiagramRegistry pattern (actual implementation):**
```javascript
const DiagramRegistry = {
  renderers: {},
  register(type, renderFn) { this.renderers[type] = renderFn; },
  render(container, descriptor) {
    if (!container) { console.warn('[DiagramRenderer] Container is null'); return null; }
    if (!descriptor || !descriptor.type || descriptor.type === 'none') return null;
    const fn = this.renderers[descriptor.type];
    if (!fn) { console.warn('[DiagramRenderer] Unknown type:', descriptor.type); return null; }
    const svg = svgEl('svg', { viewBox: '0 0 800 300', class: 'im-diagram-svg', 'aria-label': 'Math diagram' });
    container.appendChild(svg);
    fn(svg, descriptor.params || {});
    return svg;
  }
};
window.DiagramRegistry = DiagramRegistry;
```

**Console test helper:**
```javascript
window.testDiagram = function(containerId, descriptor) {
  var container = document.getElementById(containerId);
  if (!container) { container = document.body; }
  return DiagramRegistry.render(container, descriptor);
};
```

Each renderer validates parameters with sensible defaults and range clamping. If `max <= min` on a number line, it logs a warning and refuses to render rather than showing broken output. All CSS classes use the `.im-diagram-*` namespace exclusively.

### Iron Man HUD Theming

- Cyan (#00d4ff) strokes for axes and gridlines on near-black (#0a0a0a)
- Filled shapes in translucent cyan (rgba(0, 212, 255, 0.3))
- Warm gold (#ff9500) for highlights and emphasis
- White text labels
- CSS custom properties for theming: --diagram-stroke, --diagram-fill, --diagram-marker, --diagram-text, --diagram-bg, --diagram-glow
- SVG glow effect: CSS drop-shadow(0 0 3px #00d4ff) drop-shadow(0 0 8px #00d4ff) -- GPU-accelerated
- Orbitron font for numbers/headers, Rajdhani for longer labels (better readability for elementary students)

### GSAP DrawSVGPlugin Animation

GSAP now 100% free (April 2025, Webflow acquisition) including formerly premium DrawSVGPlugin. Animation sequence for "HUD powering on" effect:
1. Border lines draw themselves (DrawSVGPlugin, 0.6s)
2. Grid lines fade in with stagger (0.3s)
3. Data elements scale up from zero with back.out ease (0.5s)
4. Labels fade in with upward drift (0.4s)
5. Brief brightness pulse completes boot-up

Load from CDN (works from file://):
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/DrawSVGPlugin.min.js"></script>
```

### Integration with Problem Generation [IMPLEMENTED v4.1b — DETERMINISTIC]

Diagram generation happens at problem-generation time, post-parsing, using deterministic JavaScript — NOT LLM selection. The system prompt includes diagram type definitions and selection rules (added in the initial LLM integration attempt), and `_parseMathResponse()` extracts the LLM's `diagram` field through `_validateDiagram()` in all 5 return paths. However, the LLM proved unreliable at diagram selection (returned `null` on 100% of problems across multiple test runs, even with explicit type definitions, selection criteria, and a populated inline example). Root cause: the 8-15 few-shot exemplars from `toInjectionFormat()` all showed `diagram: null`, overwhelming the single populated example in the system prompt.

The solution follows the same pre-computation paradigm already proven for operands (`generateMissionOperands()`) and distractors (`computeDistractorValues()`): JavaScript computes the diagram descriptor deterministically from the parsed problem's TEKS, operation, operands, answerType, and narrative format. The `_computeDiagram()` method runs AFTER `_parseMathResponse()` returns and OVERWRITES the LLM's diagram field (which is always null in practice). Every computed descriptor passes through `_validateDiagram()` before assignment.

`_computeDiagram()` is wired into both `generateMathProblems()` (main generation, 10 problems) and `_regenerateMathProblem()` (single-problem regeneration via teacher feedback). In the regeneration path, it runs AFTER the mathConstraints override block to use the final operands.

**Current coverage:** MULTIPLY with both operands ≤10 → array, MULTIPLY with larger operands → areaModel, DIVIDE with quotient and divisor both ≤10 → array, ADD → stripDiagram (two parts + total), SUBTRACT → stripDiagram (known part + unknown "?" + total), FRACTION_* → fractionBar. Bare math ("Solve: X ○ Y") and non-computation types (IDENTIFY, CONCEPTUAL, comparison) always return null.

**Status:** Diagram data is computed and present on every generated problem object. Rendered on Teacher Review Screen (v4.1c) — SVG diagrams display inside the content card for word problems with non-null diagram fields, absent for bare math and science. NOT YET RENDERED on gameplay HUD — that is the next step.

---

## 12. PDF Upload Architecture [NEW v3.8]

### Overview

Teachers have problems in PDFs (worksheets, textbooks, benchmark tests). The system uses the LLM itself as a parser to extract structured problem data from uploaded PDFs.

### Extraction Flow

1. Teacher clicks "Upload Problems" on setup screen
2. Browser file picker accepts .pdf files
3. pdf.js (Mozilla's JavaScript PDF parser, loaded via CDN) extracts text from PDF
4. Extracted text sent to Groq via Cloudflare Worker
5. Llama 3.3 70B parses text into problem schema JSON
6. Parsed problems appear on Teacher Review Screen for verification

### LLM Parsing Prompt

System prompt for parsing: "Extract math/science problems from teacher worksheet. For each problem output JSON: {questionText, answer, operation, estimatedDifficulty, suggestedTeks}. If answer uncertain, mark needsReview: true."

Teacher already selected grade level and TEKS on setup screen. When parsing prompt goes to Groq, it includes: "Here are the TEKS the teacher selected for this mission: [list]. Match each extracted problem to the most appropriate TEKS from THIS list." Open-book approach -- LLM does not need TEKS from memory. This is critical because Llama 3.3 70B's training data cutoff is December 2023, meaning Texas-specific TEKS codes (e.g., "3.4A", "3.10B") may not be memorized accurately. Providing the selected TEKS list in-context eliminates this risk entirely.

### needsReview Flag

Llama 3.3 70B does not output numerical confidence scores through standard API calls. Instead, the system prompt instructs: "Set needsReview to true if: (a) you cannot determine correct answer with certainty, (b) problem text is ambiguous or seems incomplete, (c) extracted text may be garbled or truncated, or (d) you had to guess at TEKS mapping." Rule-based self-assessment, not probabilistic confidence. Second validation layer: JavaScript independently computes answer and flags mismatches deterministically.

### Hybrid Missions

Teacher uploads PDF with 8 problems but mission needs 13 total. System extracts 8, AI generates 5 additional to complete the mission. Review Screen shows "UPLOADED" vs "AI GENERATED" badges on each problem.

### Manual Custom Problems

"Replace with Custom" button on each problem card in the Review Screen. Form appears with fields: question text, answer, TEKS tag (dropdown), difficulty (dropdown), optional science TEKS connection. Teacher can replace any AI-generated or uploaded problem with a hand-written one.

### Scanned PDF Limitation

Llama 3.3 70B is text-only -- cannot process images. Scanned PDFs require OCR which adds complexity. MVP handles digitally created PDFs (majority of teacher worksheets in 2025-2026). UI notes "works best with digitally created PDFs." Scanned PDF support deferred to future enhancement.

---

## 13. Response Bank Reference

The complete response bank is in `response_bank.md` (~750 lines). Here's the structure:

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

## 14. Audio Architecture

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

## 15. Teacher Controls

### Keyboard Shortcuts

| Key | Action | When Available |
|-----|--------|----------------|
| **Space** | Advance/Next | When waiting for input, or to skip ahead |
| **H** | Request Hint | During any firewall (uses last detected pattern if available) |
| **M** | Mute/Unmute Mic | Anytime |
| **P** | Pause Mission | During gameplay |
| **R** | Resume Mission | While paused |
| **Enter** | Submit Answer | When answer input has focus |
| **A, B, C, D** | Select MC answer | When question is Multiple Choice (coexists with number input — system knows which input mode is active based on problem's answer format) |

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

### Setup Screen Controls [NEW v4.0]

The following controls appear on the setup screen alongside the existing Grade and TEKS selectors. They configure how the mission generates and collects answers.

**Answer Format Selector (orthogonal to Problem Format):**

This selector controls whether students provide numeric answers or select from multiple choice options. It is INDEPENDENT of the existing Problem Format selector (Word Problem / Bare Math / Mix). These are orthogonal axes — a bare math problem can have MC options, and a word problem can require open response. Both selectors appear on the setup screen, visually distinct and clearly labeled.

| Option | Behavior |
|--------|----------|
| Open Response (default) | Teacher types the numeric answer. Existing behavior. |
| Multiple Choice | Question displays A/B/C/D options on TV. Teacher selects letter (or students do, if Student Devices active). LLM generates 3 diagnostically-designed distractors per problem (see §7 "Format-Specific Generation Instructions"). |
| Mix | Each problem randomly assigned Open Response or MC. LLM prompt specifies which problems get MC options by firewall number so distractors are only generated where needed. |

**Button order convention:** Both selector rows follow the same layout pattern — the "Mix" option always appears in the middle position. Problem Format displays as: Word Problem | **Mix** | Bare Math. Answer Format displays as: Open Response | **Mix** | Multiple Choice. This consistency was implemented via a dedicated CC prompt that swapped the original "Multiple Choice" and "Mix" button positions.

**Show Expression Toggle:**

Controls whether the mathematical expression (e.g., "78 - 30 = ?") is visible alongside word problem narratives during gameplay. Persisted in localStorage via `app.js` (`[ExprToggle] Stored showExpression: true/false` in console). Default: ON (expression visible). When OFF, students must extract the mathematical operation from the word problem context — a higher-order comprehension skill. Has no effect on bare math problems (which are ONLY the expression). This is a teacher scaffolding preference, not a generation setting — it does not affect problem generation, validation, or review. Visible in every console session log at startup.

**Student Devices Toggle:**

Controls whether student Chromebooks/tablets can connect to the mission for answer polling. This is the primary control for the student response system (see §2 "Student Response System Architecture").

| Option | Behavior |
|--------|----------|
| OFF (default) | Existing single-screen teacher-operated mode. No room codes, no student connections. All answer input via teacher keyboard or voice. |
| ANONYMOUS | Enables room codes. Students connect via URL + 6-digit code. No names collected, no data persistence. Aggregate poll results only ("18 chose A, 4 chose B..."). No COPPA/FERPA triggers (see §21). |
| TRACKED | Full assessment mode. Students enter first name + class period. Per-student answers recorded and persisted to Cloudflare D1. TEKS mastery tracking across sessions. Requires school authorization under COPPA school consent exception (see §21). This option is grayed out with tooltip "Requires school authorization — see Settings" until authorization is configured. |

**Competition Mode Selector (conditionally visible):**

This selector is ONLY visible when Student Devices is not OFF. When Student Devices is OFF, Competition Mode is hidden since it has no effect.

| Option | Behavior |
|--------|----------|
| Whole Class (default) | Everyone cooperates. Single aggregate tally of student answers. Current mission experience with poll result overlay. |
| Teams (2-4 teams) | Competitive scoring with live team scoreboard. Holographic leaderboard with arc reactor energy bars on teacher TV. Team assignment options: Random (system assigns on join), Student Choice (students pick team on join screen), Teacher Assigned (teacher types team rosters during setup). |
| Individual | Every student for themselves, live quiz leaderboard. Phase 5B only — requires TRACKED mode for individual identification. Grayed out when Student Devices is ANONYMOUS. |

---

## 16. Configuration Constants [NEW]

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

// Student Response System (Phase 5) [NEW v4.0]
const STUDENT_RESPONSE_CONFIG = {
  ROOM_CODE_LENGTH: 6,                    // Digits in room code
  ROOM_CODE_EXPIRY_MINUTES: 120,          // Room code valid for 2 hours
  MAX_CONNECTED_DEVICES: 40,              // Maximum student connections per room
  POLL_TIMEOUT_SECONDS: 60,               // Auto-close poll after 60s (teacher can still override)
  POLL_SHOW_RESULTS_LIVE: true,           // Show bar chart updating in real-time (vs reveal-all-at-once)
  TEAM_COUNT_OPTIONS: [2, 3, 4],          // Allowed number of teams in Teams mode
  DEFAULT_TEAM_NAMES: ['Stark', 'Banner', 'Rogers', 'Romanoff']  // Default team names (teacher can customize)
};
```

---

## 17. Implementation Files [NEW, UPDATED v4.1]

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
| `firewall-sequence.js` | `js/firewall-sequence.js` | * Complete | Transition engine -- 5 randomized math transitions (+ Fury science animation at FW 3/6/9, Black Widow glitch at opening + pre-FW10 message as separate events), GSAP timeline orchestration |
| `pixi-effect-manager.js` | `js/pixi-effect-manager.js` | * Complete | PixiJS singleton manager (single PIXI.Application, GSAP ticker sync) |

### Phase 4 Implementation Files [NEW v3.8, UPDATED v4.1]

These files are created during Phase 4 prompts:

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| `config.js` | `js/config.js` | ✓ Complete (Prompt 1) | Groq Worker URL, model name, retry settings |
| `cerebras-api.js` | `js/cerebras-api.js` | ✓ Complete (Prompt 1 + MC pipeline) | API wrapper — generateMission(), calculateAnswer(), computeDistractorValues(). Contains: exemplar selection (selectExemplars, 5 per TEKS cap), distractor pattern injection (selectDistractorPatterns), pre-computed distractor value algorithms (ADD/SUBTRACT/MULTIPLY/DIVIDE), rationale label generation, distractorReasoning→distractorRationales bridge, MC mix ratio logic. Requires exemplar + distractor-patterns files loaded first (see Script Load Order). |
| `distractor-patterns.js` | `js/distractor-patterns.js` | ✓ Complete (Tier 1) | Distractor Pattern Bank — 1,586 lines, 97 worked examples, 27 patterns, 5 Tier 1 TEKS (3.4A, 3.4F, 3.4J, 3.4D, 3.4K). Exports: DISTRACTOR_PATTERNS, UNIVERSAL_DISTRACTOR_RULES, DISTRACTOR_RULES_REMINDER, selectDistractorPatterns(), toDistractorInjectionFormat(). Browser + Node compatible (conditional module.exports guard). |
| `validation-engine.js` | `js/validation-engine.js` | ✓ Complete | Inline validation within validateProblem() — Layers 1-4 structural, math, content policy, TEKS alignment checks. MC extension: duplicate value detection (HARD GATE), rationale-value cross-check (HARD GATE), consecutive integer detection, wide-spread check. Originally planned as `validator.js` in the brief; actual implementation created under this name by Prompt 3. |
| `teks-rules.json` | `data/teks-rules.json` | ✓ Complete | Static TEKS validation constraints (217 entries, 132 with quantifiable rules) |
| `teks-rules-data.js` | `js/teks-rules-data.js` | ✓ Complete | `window.TEKS_RULES_DATA` — browser-loadable runtime version of teks-rules.json. 217 math TEKS entries with description fields. Used by teacher-review.js for TEKS description tooltips on hover (§9). |
| `teacher-review.js` | `js/teacher-review.js` | ✓ Complete (Prompt 3 + 15 bugfix rounds + MC bugfix v1 + diagram rendering v4.1c) | Teacher Review Screen — split-panel layout, all quick-action chips (difficulty, format, science, MC/Open Response), free-text feedback, TEKS override toggle with retry-exhausted banner, ★ Favorite annotation, approval workflow, back button to setup screen, validation display with traffic light badges. SVG diagram rendering for math word problems via DiagramRegistry.render() (v4.1c). Diagram data passthrough to gameplay via _convertBackToApi(). The most heavily modified file in the project. |
| `validator.js` | `js/validator.js` | SUPERSEDED | Originally planned as the five-layer validation pipeline. Never created — the Prompt 3 implementation put sync validation into `validation-engine.js` instead. This name appears in older brief sections as the planned target; the actual file is `validation-engine.js`. |
| `confidence.js` | `js/confidence.js` | ABANDONED | Composite scoring and category assignment — built, tested, permanently abandoned. Zero incremental value over Layers 1-4 in testing; teacher review screen is the quality gate. See §10 postmortem. |
| `diagramRenderer.js` | `js/diagramRenderer.js` | ✓ Complete (Tier 1) | DiagramRegistry pattern + 8 Tier 1 SVG renderers (numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot). ~1,470 lines. Shared helpers: svgEl(), polarToCartesian(), describeArc(). Console test helper: testDiagram(). Exposed as window.DiagramRegistry. All renderers validate params with defaults/clamping. CSS classes use `.im-diagram-*` namespace. Diagram generation pipeline WIRED via deterministic `_computeDiagram()` in cerebras-api.js — diagram data present on every generated problem. Rendered on Teacher Review Screen (v4.1c). NOT YET RENDERED on gameplay HUD. |
| `diagramAnimations.js` | `js/diagramAnimations.js` | TODO (Prompt 5) | GSAP DrawSVGPlugin "power-on" animation for diagrams |
| `diagram-hud.css` | `css/diagram-hud.css` | ✓ Complete | Iron Man HUD theming for SVG diagrams. CSS custom properties (--diagram-stroke, --diagram-fill, --diagram-marker, --diagram-text, --diagram-bg, --diagram-glow). Classes for all 8 Tier 1 diagram types using `.im-diagram-*` namespace. Cyan-on-dark aesthetic with glow filter, Orbitron/Rajdhani fonts. |

### Script & CSS Load Order [v3.5, UPDATED v3.8]

This is the complete dependency chain for `index.html`. Files MUST load in this order or you'll get undefined reference errors. Claude Code should consult this table whenever adding or moving `<script>` or `<link>` tags.

| # | File | Type | Why This Position |
|---|------|------|-------------------|
| 1 | `augmented-ui` CSS (CDN) | `<link>` | External dependency -- base UI framework |
| 2 | `css/im-animations.css` | `<link>` | Namespaced animation CSS -- loads AFTER augmented-ui so it can extend, BEFORE styles.css so styles.css can override |
| 2.5 | `css/diagram-hud.css` | `<link>` | Diagram theming CSS — Iron Man HUD aesthetic for all 8 Tier 1 SVG diagram types. `.im-diagram-*` namespace. Loads with animation CSS. [v3.8 planned, IMPLEMENTED v4.1] |
| 3 | `css/styles.css` | `<link>` | Main stylesheet -- last CSS file, can override anything above |
| 4 | PixiJS 7.4.2 (CDN) | `<script>` | GPU rendering engine -- must load before anything that uses PIXI |
| 5 | pixi-filters 5.3.0 (CDN) | `<script>` | 45 GPU filter effects -- requires PixiJS loaded first |
| 6 | `node_modules/gsap/dist/gsap.min.js` | `<script>` | Animation engine -- must load before PixiPlugin and any GSAP users |
| 6.5 | GSAP DrawSVGPlugin (CDN) | `<script>` | [UNVERIFIED — may not be in index.html yet] SVG stroke animation -- requires GSAP loaded. First CC prompt requested this be added but verification did not confirm. Check index.html before building animation layer. [v3.8] |
| 7 | `node_modules/gsap/dist/PixiPlugin.min.js` | `<script>` | GSAP+PixiJS bridge -- requires both GSAP and PixiJS loaded |
| 8 | `js/hud-config.js` | `<script>` | `window.HUD_CONFIG` -- read by nearly everything, load early |
| 9 | `js/pixi-effect-manager.js` | `<script>` | `window.pixiEffectManager` -- requires PixiJS + GSAP, read by firewall-sequence |
| 10 | `js/firewall-sequence.js` | `<script>` | `window.transitionEngine` -- requires hud-config + pixi-effect-manager |
| 11 | `js/sound-manager.js` | `<script>` | Sound system -- independent, can load anywhere after DOM |
| 12 | `js/pattern-detector.js` | `<script>` | Error analysis -- independent |
| 13 | `js/mission-integration.js` | `<script>` | Mission orchestrator -- requires everything above |
| 13.5 | `js/config.js` | `<script>` | Groq config -- independent [v3.8] |
| 13.51 | `js/Batch_1_readiness_standards_exemplars.js` | `<script>` | 65 Readiness exemplars + utility functions (selectExemplars, toInjectionFormat, diverseSelect) [v3.9] |
| 13.52 | `js/Batch_2_supporting_standards_exemplars.js` | `<script>` | 67 Supporting exemplars (renamed from __1_ version) [v3.9] |
| 13.53 | `js/Batch_3_missing_teks_exemplars.js` | `<script>` | 3 Synthetic exemplars for never-tested TEKS [v3.9] |
| 13.54 | `js/distractor-patterns.js` | `<script>` | Distractor Pattern Bank — DISTRACTOR_PATTERNS, UNIVERSAL_DISTRACTOR_RULES, selectDistractorPatterns() as browser globals. Must load before cerebras-api.js which calls selectDistractorPatterns() [v4.1] |
| 13.6 | `js/cerebras-api.js` | `<script>` | API wrapper -- requires config.js + exemplar files + distractor-patterns.js [v3.8, UPDATED v4.1] |
| 13.7 | math.js (CDN) | `<script>` | Expression evaluation for validation [v3.8] |
| 13.8 | `js/teks-rules-data.js` | `<script>` | `window.TEKS_RULES_DATA` — 217 math TEKS entries with descriptions, auto-generated from teks-rules.json. Used by teacher-review.js for TEKS description tooltips. [v4.0] |
| 13.85 | `js/validation-engine.js` | `<script>` | Layers 1-4 validation + MC extension — requires math.js + config. Originally planned as `validator.js` in the brief; actual implementation created under this name by Prompt 3. [v3.8, UPDATED v4.1] |
| 13.9 | `js/confidence.js` | `<script>` | ABANDONED — was composite scoring for Layer 5. File deleted from codebase. Not in current `<script>` tags. [v3.8, ABANDONED v4.1] |
| 13.95 | `js/teacher-review.js` | `<script>` | Teacher Review Screen UI — split-panel layout, quick-action chips, per-problem feedback, TEKS override toggle, ★ Favorite annotation, approval workflow, back button navigation. Most heavily modified file in the project (15 bugfix rounds + MC bugfix v1). Requires cerebras-api.js + validation-engine.js + teks-rules-data.js. [v3.8, UPDATED v4.1] |
| 14 | `js/diagramRenderer.js` | `<script>` | SVG diagram registry — DiagramRegistry pattern + 8 Tier 1 renderers (numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot). Exposed as window.DiagramRegistry. Independent of other scripts (no dependencies). [v3.8 planned, IMPLEMENTED v4.1] |
| 14.5 | `js/diagramAnimations.js` | `<script>` | [PLANNED — NOT YET IN index.html] Diagram GSAP animations -- requires GSAP + diagramRenderer. Will be added when animation layer is built. [v3.8] |
| 15 | `js/app.js` | `<script>` | Entry point -- last, wires everything together |

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

## 18. Build Phases

### Philosophy: Test Early, Test Independently

> **Core Insight:** The worst situation is building something that depends on three other things, because when it breaks you don't know which piece failed. Each phase should produce something testable on its own.

> **Key Principle:** Get the gameplay loop working with hardcoded test data BEFORE introducing API generation. If the gameplay loop doesn't work, you want to know it's a logic problem, not an API timeout issue.

---

### Asset Status Summary [UPDATED v4.1]

| Asset | Status |
|-------|--------|
| Sound Effects (23 WAV files) | [DONE] COMPLETE |
| Sound Integration (all events wired) | [DONE] COMPLETE v3.7 -- 32 event-to-sound mappings (15 gameplay + 6 transition + 11 UI) using 23 unique WAV files (some events share files) |
| pattern-detector.js | [DONE] COMPLETE |
| mission-integration.js | [DONE] COMPLETE |
| sound-manager.js | [DONE] COMPLETE |
| Response Bank (all dialogue text) | [DONE] COMPLETE |
| TEKS Files (grades 1-5) | [DONE] COMPLETE |
| UI/HTML Interface | [WIP] IN PROGRESS |
| Dialogue Audio (Jarvis/Fury/Widow) | [TODO] NOT STARTED |
| Groq API Integration (via Cloudflare Worker) | [DONE] COMPLETE — API module + Worker deployed, CORS tested, exemplar injection working, distractor pattern injection working |
| Teacher Review Screen | [DONE] COMPLETE — Option C split panel built, 15 bugfix rounds (v4-v15), TEKS override toggle, tooltips, cross-curricular badge, ★ Favorite annotation |
| Multi-Layer Validation Pipeline | [DONE] Layers 1-4 COMPLETE (sync, instant). Layer 5 (async LLM review) built, tested, ABANDONED — zero incremental value. MC validation extension COMPLETE (duplicate detection, rationale-value cross-check, consecutive integer detection, wide-spread check). |
| SVG Diagram Generator | [DONE] Tier 1 COMPLETE v4.1, Generation Pipeline WIRED v4.1b, Teacher Review Rendering v4.1c -- 8 renderers (numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot) implemented in diagramRenderer.js (~1,470 lines), HUD theming in diagram-hud.css. Tested across ~58 test cases including edge cases and regression. Deterministic `_computeDiagram()` in cerebras-api.js computes diagram descriptors from TEKS+operation+operands+narrative. Diagram data present on every generated problem (word problems get type-appropriate diagrams, bare math gets null). Rendered on Teacher Review Screen inside content card (v4.1c). NOT YET RENDERED on gameplay HUD. GSAP animation layer (diagramAnimations.js) NOT YET BUILT. |
| PDF Upload System | [TODO] NOT STARTED (Prompt 6) |
| teks-rules.json | [DONE] COMPLETE — 217 entries, 132 with quantifiable rules |
| Few-Shot Exemplar Bank (135 items, 46 TEKS) | [DONE] COMPLETE v3.9 -- Batches 1-3 extracted, audited (5 passes), 100% Grade 3 Math TEKS coverage |
| Distractor Pattern Bank (Tier 1) | [DONE] COMPLETE v4.1 -- 97 examples, 27 patterns, 5 TEKS (3.4A/F/J/D/K), 4-part audit verified, all from TEA STAAR rationales 2019-2025 |
| Pre-Computed Distractor Values | [DONE] COMPLETE v4.1 -- computeDistractorValues() in cerebras-api.js, deterministic algorithms for ADD/SUBTRACT/MULTIPLY/DIVIDE |
| Rationale Label Injection | [DONE] COMPLETE v4.1 -- {value, rationale, tag} triples, 100% rationale accuracy |
| Multiple Choice Mode | [DONE] FUNCTIONAL for Tier 1 arithmetic TEKS — distractor pipeline, validation checks, gameplay HUD with A/B/C/D buttons + keyboard. Tier 2+ TEKS distractor patterns NOT YET BUILT. |
| GSAP Animations + PixiJS Effects | [DONE] 5 transitions in pool COMPLETE + Fury SHIELD animation COMPLETE -- Black Widow overlay remaining |
| **Transition Engine (FirewallSequence)** | [DONE] COMPLETE -- 5 randomized transitions + Widow glitch, PixiJS integration, transition sounds wired |
| **PixiJS Foundation** | [DONE] COMPLETE -- PixiEffectManager singleton, 45 filters, GSAP ticker sync |
| Benchmark Export System | [TODO] NOT STARTED |
| Student Response System (Anonymous) | [TODO] NOT STARTED (Phase 5A) |
| Student Response System (Tracked) | [TODO] NOT STARTED (Phase 5B) |
| Team Competition Mode | [TODO] NOT STARTED (Phase 5A/5B) |
| Post-Mission Analytics Dashboard | [TODO] NOT STARTED (Phase 5B) |

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
| 4.5 | firewall-sequence.js | Fixed typeof guards (window.soundManager -> typeof) |
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

### Phase 4: AI Generation + Teacher Review + Validation * PRE-GENERATION PARADIGM [UPDATED v3.8]

**Goal:** Replace hardcoded test data with AI-generated, validated, teacher-reviewed problems. This phase is split into 5 focused Claude Code Web prompts (Prompts 2-6), each building one self-contained feature.

**Critical Principle:** LLM generates problem TEXT, JavaScript calculates the ANSWER. Never trust the LLM to do arithmetic.

```javascript
// Groq returns this via Cloudflare Worker:
{
  "problem": "Tony needs to power 24 suits. Each suit needs 3 arc reactors. How many reactors total?",
  "operation": "MULTIPLY",
  "operands": [24, 3],
  "teks": "3.4F",
  "primaryType": "computation",
  "diagram": null
}

// JavaScript calculates: 24 * 3 = 72
// Answer is NEVER from the LLM
```

**Prompt 1: API Module + Cloudflare Worker [COMPLETE]**
- [x] Cloudflare Worker proxy deployed at https://ironman-api.shanewaldrop123.workers.dev
- [x] CORS tested: file:// -> Worker -> Groq -> SUCCESS
- [x] js/config.js created with Worker URL, model name (llama-3.3-70b-versatile), retry settings
- [x] js/cerebras-api.js created with generateMission(), calculateAnswer(), validateProblemSchema()
- [x] Offline math verification working (calculateAnswer returns correct results)
- [x] Script tags added to index.html

**Prompt 2: Problem Generation Pipeline [COMPLETE v4.1]**
- [x] Wire "Generate Mission" button -> Cloudflare Worker -> Groq
- [x] System prompt with TEKS instructions, cross-curricular mode, structured JSON output, and explicit "generate ORIGINAL problems, do NOT copy exemplars" instruction
- [x] Integrate Few-Shot Exemplar Bank: selectExemplars picks up to 5 exemplars per selected TEKS, stripped to injection schema, embedded in system prompt
- [x] Parse response, store in mission state
- [x] Progress indicator during generation
- [x] Fallback: load test-problems.js if API fails
- [x] Pre-generated operands: JavaScript generates operation + operands per TEKS rules, LLM receives constrained operands
- [x] Mix format ratio: explicit integer counts (e.g., "6 word / 4 bare") randomly selected per generation

**Prompt 3: Teacher Review Screen + Instant Validation Layers [COMPLETE v4.1]**
- [x] Build Option C split panel UI (Section 9) with ALL validation display elements
- [x] Traffic light badges, validation detail chips
- [x] Wire instant validation layers (Layers 1-4): structural, math, content policy, TEKS alignment
- [x] Per-problem feedback with quick-action chips + free text
- [x] Approve workflow
- [x] 15 bugfix rounds (v4 through v15) addressing: TEKS override toggle, cross-curricular badge, tooltips, ★ Favorite annotation, ID collision bug, CSS visibility, bare math chip, word problem chip, science explanation length, division validation (dividend≤10 → divisor/quotient≤10), firewall-missing-problem handling

**Prompt 4: Async Validation Layers [BUILT, TESTED, ABANDONED v4.1]**
- [x] Self-consistency voting built (5 generation samples, agreement scoring)
- [x] Chain-of-Verification blind review built
- [x] Progressive UI updates implemented
- [ ] ~~Composite confidence scoring~~ — ABANDONED. Two bugs surfaced during testing: (A) regeneration during async Layer 5 caused crashes, (B) regen mode-selection misinterpreted feedback as difficulty shifts. More fundamentally, Layer 5 added zero incremental value — see §10 postmortem.
- **Decision:** Layer 5 permanently abandoned. Layers 1-4 (sync, instant) provide sufficient validation. MC distractor pre-compute prevents most quality issues at generation time rather than catching them after. The teacher review screen is the quality gate.

**Prompt 5: SVG Diagram Generator [TIER 1 RENDERERS COMPLETE v4.1]**
- [x] DiagramRegistry with 8 Tier 1 diagram types (Section 11) — numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot. ~1,470 lines in diagramRenderer.js.
- [x] Vanilla JavaScript SVG renderers (no library dependency) — svgEl() helper with createElementNS, per-renderer viewBox, parameter validation with defaults/clamping
- [x] Iron Man HUD theming with CSS custom properties — diagram-hud.css with `.im-diagram-*` namespace, cyan-on-dark aesthetic, glow filter
- [x] Testable: All 8 diagram types render correctly with hardcoded test data at 1920×1080. ~58 test cases including edge cases and cross-renderer regression. Zero crashes.
- [ ] GSAP DrawSVGPlugin "power-on" animation — `diagramAnimations.js` NOT YET BUILT
- [x] Integration with problem generation — deterministic `_computeDiagram()` in cerebras-api.js computes diagram descriptors from TEKS+operation+operands+narrative (v4.1b). LLM selection attempted first but proved unreliable (100% null output). JS pre-computation follows same paradigm as operands and distractors. Wired into both generateMathProblems() and _regenerateMathProblem(). Diagram data present on every problem. Rendered on Teacher Review Screen (v4.1c).

**Prompt 6: PDF Upload**
- [ ] File picker accepting .pdf files
- [ ] pdf.js text extraction
- [ ] Groq parsing call with TEKS context
- [ ] Hybrid missions (uploaded + AI-generated to fill 13 total)
- [ ] UPLOADED vs AI GENERATED badges on Review Screen
- [x] Manual custom problem entry form — "Replace with Custom Problem" button on each problem card opens inline form with fields: question text, answer, TEKS tag (dropdown with short descriptions from teks-rules-data.js), difficulty (dropdown), optional science TEKS connection (dropdown with descriptions). Enhanced in bugfix v11 with TEKS description labels in dropdowns.
- [ ] Testable: Upload a PDF, see extracted problems on Review Screen

**Phase 4 Bugfix Rounds [UPDATED v4.1]:**
- [x] Bugfix v1-v3: Initial cleanup, validation fixes, state management
- [x] Bugfix v4: TEKS override toggle, cross-curricular badge fix, TEKS tooltips, ★ Favorite annotation, mix ratio display
- [x] Bugfix v5: Cross-contamination ID collision — regenerated problems always received `id: 'fw-1'` because `_parseMathResponse()` uses `firewallNumber = p.firewallNumber || (index + 1)` and single-problem regeneration always has `index = 0`. Then `Object.assign(p, bestMapped, ...)` overwrote the original problem's ID, causing multiple regenerated problems to share the same `_validation` cache key. Fix: "savedId" pattern — save `p.id` before Object.assign, restore after, applied in both `_regenerateProblem` and `_autoRegenerateFailures`. **Architectural warning:** Any future code using Object.assign on problem objects MUST preserve the ID field.
- [x] Bugfix v6-v7: CSS visibility fixes, bare math chip
- [x] Bugfix v8: Bare math event handler (broken by v7 restructure), word problem chip preserving math, per-problem cross-curricular dropdown chip (replaced checkbox with "✦ Science" chip button opening TEKS selector dropdown)
- [x] Bugfix v9: Word problem chip's subtle failure (LLM used constrained numbers in narrative but changed expression to different numbers)
- [x] Bugfix v10: Science explanation sentences too long, cross-curricular feedback loop
- [x] Bugfix v11: Back button size enlargement for classroom TV visibility, feedback text 40-character truncation fix (silent data loss — full string now sent to API), TEKS descriptions added to custom problem dropdowns, "false" literal rendering bug for crossCurricular field, legend indicator colors (green/yellow/red)
- [x] Bugfix v12: Textarea focus loss on first keystroke
- [x] Bugfix v13: Division validation too strict (dividend≤10 → divisor/quotient≤10), firewall-missing-problem graceful handling
- [x] Bugfix v14: Operation & format preservation — implicit constraints appended to all regeneration feedback (e.g., "IMPORTANT: Keep the same operation (subtraction)." + "Keep this as a word problem with context."). See chip architecture §9.
- [x] Bugfix v15: Easier/Harder Numbers fix — difficulty chips skip `generateOperandsForTeks()` during regeneration, include original operands as LLM context instead. Root cause: random tier index in `generateOperandsForTeks()` gave 70% chance of bigger numbers for "Easier." See Easier/Harder architecture §9.

**Key bugfix lesson:** Scope creep was the #1 cause of regressions. Multi-target CC prompts that tried to fix 3+ things simultaneously caused cascading breakage. The most successful fixes were single-target, surgically specific prompts following the XML tag template from the CC prompting report.

**Phase 4 Feature Add: Multiple Choice Mode [FUNCTIONAL v4.1]**
- [x] Setup screen Answer Format toggle (Open Response / Multiple Choice / Mix) — orthogonal to existing Problem Format selector (see §15)
- [x] Distractor Pattern Bank (`distractor-patterns.js`) — Tier 1 COMPLETE: 27 patterns, 97 examples across 3.4A/F/J/D/K. 4-part audit: math verification, schema/pipeline, source attribution, pedagogical integrity. Zero critical issues.
- [x] Pre-computed distractor values (`computeDistractorValues()` in `cerebras-api.js`) — deterministic JS algorithms for ADD/SUBTRACT/MULTIPLY/DIVIDE. Eliminates LLM arithmetic errors.
- [x] Rationale label injection — `computeDistractorValues()` returns `{value, rationale, tag}` triples. LLM paraphrases pre-built rationales instead of inventing them. 100% accuracy.
- [x] MC-specific validation checks — duplicate detection (HARD GATE), rationale-value cross-check (HARD GATE), consecutive integer detection, wide-spread check
- [x] `distractorReasoning` → `distractorRationales` bridge in cerebras-api.js
- [x] Gameplay HUD A/B/C/D rendering — holographic-styled option buttons with selection highlighting
- [x] Keyboard A/B/C/D input for MC problems, coexisting with number input for open response
- [x] Mix mode: random per-problem assignment of open response vs. MC with explicit integer counts
- [x] Per-problem MC ↔ Open Response quick-action chips on Teacher Review Screen (MC bugfix v1) — see chip architecture §9
- [x] Answer Format button order swap: Open Response | Mix | Multiple Choice (Mix in middle, matching Problem Format layout) — see §15
- [x] Science question skipping bug fixed (Fury interruptions now fire correctly at firewalls 3/6/9)
- [ ] Tier 2+ distractor pattern entries (3.4H, 3.4E, 3.5A, 3.5B, 3.4B, 3.4G, 3.6C) — NOT YET BUILT
- [ ] Content filter update: "battle" → YELLOW not RED — NOT YET DONE

**Phase 4 Feature Add: SVG Diagram Renderer [TIER 1 COMPLETE v4.1]**
- [x] DiagramRegistry architecture — registry pattern, svgEl() helper with createElementNS, testDiagram() console helper, null container safety, window.DiagramRegistry global. ~1,470 lines in `js/diagramRenderer.js`.
- [x] Iron Man HUD theming — `css/diagram-hud.css` with CSS custom properties (--diagram-stroke, --diagram-fill, --diagram-marker, --diagram-text, --diagram-bg, --diagram-glow), `.im-diagram-*` namespace, cyan-on-dark aesthetic with glow filter, Orbitron/Rajdhani fonts.
- [x] numberLine renderer — whole numbers, decimals (with toFixed floating-point fix), fractions (showFractions + fractionDenominator with label conversion), multiple markers, highlightRange for rounding, titles. Tested: 9 scenarios.
- [x] barGraph renderer — vertical and horizontal orientation, yMax/yStep auto-calculation, highlightIndex for gold bar, showValues labels, axis labels and titles, gridlines. Tested: 5 scenarios.
- [x] fractionBar renderer — equal-part division, shading, showPartLabels (unit fraction inside each part), highlightParts for gold segments, comparison mode (two bars stacked for visual fraction comparison). Tested: 4 scenarios.
- [x] fractionCircle renderer — SVG arc path math with polarToCartesian/describeArc helpers, full-circle edge case (<circle> fallback when numerator=denominator), empty circle edge case, highlightSectors for gold slices, comparison mode (two circles side-by-side). Tested: 6 scenarios.
- [x] array renderer — nested loop circle grid, dynamic viewBox sizing, showRowLabels/showColLabels, highlightRow, highlightCount (reading-order gold circles), showTotal. Tested: 4 scenarios + 10×10 max and 1×1 min edge cases.
- [x] stripDiagram renderer — variable-width proportional sections, equalSections mode, unknown sections (dashed border, lighter fill), bracket above/below with total label, highlightIndex for gold section. Last-section-as-remainder prevents floating point gaps. Tested: 4 scenarios + single-section and extreme-ratio edge cases.
- [x] areaModel renderer — auto-decomposition by place value (decompose() function handles internal zeros), proportional column widths and row heights, partial product labels centered in cells, explicit decomposition override, highlightCell, showTotal. Tested: 5 scenarios + 302×15 internal-zero edge case.
- [x] dotPlot renderer — number line axis (reuses valueToX pattern), stacked dots above data values with count preprocessing, highlightValue for gold dots at specific value, toFixed decimal fix for tick labels. Tested: 3 scenarios + all-same-value and single-point edge cases.
- [x] Cross-renderer regression — 13 edge cases across all 8 types (endpoint markers, zero-value bars, 8 categories, zero numerator, whole 1/1 fractionBar, denominator=1 fractionCircle, 10×10 array, 1×1 array, single section strip, extreme ratio strip, internal-zero area model, all-same-value dots, single-point dots). Zero crashes, zero console errors.
- [x] Fraction divider visibility fix — `.im-diagram-fraction-divider` changed to white stroke-width 2, opacity 0.9 (was thin cyan, nearly invisible against cyan fill)
- [x] index.html updated — `<link>` for diagram-hud.css at position 2.5, `<script>` for diagramRenderer.js at position 14
- [x] Wire diagram descriptors into generation pipeline — LLM integration attempted first (system prompt additions, _validateDiagram() in all 5 return paths of _parseMathResponse(), diagram type definitions and selection rules, populated inline example, diagram:null in toInjectionFormat). LLM proved unreliable (100% null). Replaced with deterministic `_computeDiagram()` method: TEKS+operation+operands+narrative→descriptor, piped through _validateDiagram(). Wired into generateMathProblems() and _regenerateMathProblem(). (v4.1b)
- [x] Diagram rendering on Teacher Review Screen — `_renderDiagram()` in teacher-review.js calls `DiagramRegistry.render()` on `#im-review-diagram` container inside content card. `diagram` field mapped in `_mapApiToReview()`, passed through in `_convertBackToApi()`. Word problems show SVG diagrams; bare math and science show nothing. (v4.1c)
- [ ] Diagram rendering on gameplay HUD — display diagram alongside problem text during mission
- [ ] GSAP DrawSVGPlugin animation layer (`diagramAnimations.js`) — "HUD power-on" effect for diagram appearance

**Phase 4 Test Criteria (overall):**
- [ ] Generate a full mission, review all problems on Review Screen
- [ ] Verify validation badges display correctly (green/yellow/red)
- [ ] Regenerate a single problem with feedback, verify it updates
- [ ] Start mission and play through with generated content
- [ ] Test API failure -> fallback to static problems
- [ ] Upload a PDF, verify problems extracted and displayed
- [ ] Generate MC problems, verify 4 options display with exactly 1 correct
- [ ] Test TEKS override toggle on a regenerated problem

---

### Phase 5: Student Response System [NEW v4.0]

**Goal:** Transform the app from a single-screen teacher-operated demo into an interactive classroom assessment tool where students participate on their own devices.

**Dependency chain:** Multiple Choice mode (Phase 4) → Phase 5A → Phase 5B. MC must exist before student devices can render answer options. SVG diagrams (Phase 4 Prompt 5) should ideally be stable before Phase 5A, since diagram-containing questions need to render on student devices.

**Rationale for placement:** The Student Response System is higher-impact than dialogue audio (Phase 6) — it transforms the app from a demo into an assessment tool. And having a working prototype strengthens the non-provisional patent filing (see §22).

**Phase 5A — Anonymous (no compliance required):**
- [ ] Extend existing Cloudflare Worker to support room creation and Durable Object bindings
- [ ] Cloudflare Durable Object for real-time room state (one per active room, manages WebSocket connections)
- [ ] WebSocket infrastructure (teacher's file:// app ↔ Durable Object ↔ student devices)
- [ ] Room code generation (6-digit, 2-hour expiry) and room management endpoints
- [ ] Student-facing HTML/JS page served from Worker (room code entry, question display, A/B/C/D buttons, waiting screen)
- [ ] Teacher poll display — live bar chart overlay on mission HUD showing incoming responses in real-time
- [ ] POLLING state integration — new conditional state in mission flow between QUESTION_DISPLAYED and ANSWER_SUBMITTED (see §8)
- [ ] Majority-vote input mode (auto-selects most popular answer, teacher can override)
- [ ] Competition Mode: Whole Class (aggregate tally) and Teams (per-team running tallies, holographic leaderboard)
- [ ] Team assignment options: Random, Student Choice, Teacher Assigned
- [ ] HTTP long-polling fallback for restrictive school firewalls
- [ ] CAN BE TESTED IN CLASSROOMS IMMEDIATELY — no legal compliance required (see §21)
- [ ] Estimated effort: 2-3 focused Claude Code sessions

**Phase 5B — Tracked (requires school authorization before classroom deployment):**
- [ ] Cloudflare D1 database schema (sessions, students, answers, TEKS mastery tables)
- [ ] Student identity on join screen (first name + class period)
- [ ] Per-student answer persistence — session data written to D1 at session end
- [ ] Retroactive upgrade from 5A: additive WebSocket message field (`student`), D1 write call before Durable Object memory clears (see §2 "Retroactive Upgrade Architecture")
- [ ] TEKS mastery tracking — per-student, per-TEKS accuracy calculations across sessions
- [ ] Second flywheel input stream — student performance data attaches to exemplar metadata (see §7 "Dual-Input Flywheel")
- [ ] Teacher analytics dashboard — post-mission view on review screen: accuracy by problem, distractor analysis, per-student TEKS performance, team breakdowns (see §9 "Post-Mission Analytics Dashboard")
- [ ] Privacy policy document (what collected, how used, what NOT done, retention, deletion mechanism — see §21)
- [ ] Data deletion mechanism (teacher or school can request at any time)
- [ ] School authorization workflow
- [ ] Competition Mode: Individual leaderboards (requires tracked mode for student identification)
- [ ] BUILD technically with synthetic data (25 fake students, simulated answer patterns) — deploy only after school authorization obtained
- [ ] Three-stage testing pathway: synthetic data → adult volunteers → formal pilot with school authorization (see §21)
- [ ] Estimated additional effort: 2-3 sessions beyond Phase 5A

---

### Phase 6: Response Intelligence (Three-Layer System) [RENUMBERED from Phase 5 in v4.0]

**Goal:** Jarvis gives intelligent, contextual responses instead of generic "correct/incorrect."

**Build:**
- [ ] Wire `pattern-detector.js` into answer processing
- [ ] Implement three-layer response system:
  - **Layer 1:** Generic wrong answer response (instant, from response bank)
  - **Layer 2:** Pattern-specific hint (instant, based on detected error pattern)
  - **Layer 3:** Dynamic Groq fallback (for edge cases, ~1 sec delay)
- [ ] Connect pattern detection results to hint selection (HINT-PAT-XX IDs)
- [ ] Test all 11 error patterns trigger correct hints
- [ ] Implement Black Widow hint system (deterministic on 2nd wrong answer, max 4 appearances, min 2-firewall spacing — see §4)
- [ ] Implement Fury introduction lines before science questions
- [ ] Wire `mission-integration.js` event system to UI

**Test Criteria:**
- [ ] Intentionally answer "off by 1" -> verify HINT-PAT-01 or -02 triggers
- [ ] Intentionally answer with reversed digits -> verify HINT-PAT-06 or -07 triggers
- [ ] Verify Black Widow appears deterministically on 2nd wrong answer per firewall (no randomness)
- [ ] Verify Fury speaks intro line before each science question

---

### Phase 7: Voice Integration [RENUMBERED from Phase 6 in v4.0]

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

### Phase 8: Dialogue Recording + Polish + Reporting [RENUMBERED from Phase 7 in v4.0]

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

### Phase Dependency Chain [NEW v4.0]

```
Phase 1 (Interface) → Phase 2 (Gameplay Loop) → Phase 2.5 (Animations)
                                                       ↓
                                                  Phase 3 (Sound)
                                                       ↓
                                                  Phase 4 (AI Gen + Review + Validation)
                                                       ↓
                                                  Bugfix v4 → MC Mode (Phase 4 Feature Add)
                                                       ↓
                                                  Phase 5A (Anonymous Student Response)
                                                       ↓
                                                  Phase 5B (Tracked Student Response)
                                                       ↓
                                              Phase 6 (Response Intelligence)
                                                       ↓
                                              Phase 7 (Voice Integration)
                                                       ↓
                                              Phase 8 (Dialogue + Polish)
```

### Phase Summary Table [UPDATED v4.0]

| Phase | What It Builds | What You Can Test | Dependencies |
|-------|----------------|-------------------|--------------|
| **1** | Interface + navigation | Visual design, screen flow, TEKS checkboxes | None |
| **2** | Gameplay loop (hardcoded) | Complete mission flow, all 13 checkpoints, scoring | Phase 1 |
| **2.5** | GSAP animations + PixiJS GPU effects | Transitions with GPU bloom/rays/particles, Fury SHIELD alert, MCU feel | Phase 2 |
| **3** | Sound effects | All 23 SFX trigger correctly | Phase 2 |
| **4 P1** | API module + Cloudflare Worker | file:// -> Worker -> Groq chain, offline math verification | Phase 2 |
| **4 P2** | Problem generation pipeline | Generate 13 problems via Groq, store in mission state | Phase 4 P1 |
| **4 P3** | Teacher Review Screen + sync validation | Split panel UI, instant validation (math, TEKS, content), feedback system | Phase 4 P2 |
| **4 P4** | ~~Async validation~~ | ~~Self-consistency voting, LLM blind review, composite confidence scores~~ | ABANDONED — see §10 postmortem |
| **4 P5** | SVG diagram generator | 8 diagram types render at 1920x1080 with HUD theming | Phase 4 P2 |
| **4 P6** | PDF upload + hybrid missions | Extract problems from PDF, mix with AI-generated | Phase 4 P3 |
| **4 MC** | Multiple Choice mode | MC option display, distractor generation, A/B/C/D input | Bugfix v4 |
| **5A** | Anonymous student response | Room codes, live polling, majority vote, team competition | Phase 4 MC |
| **5B** | Tracked student response + analytics | Per-student TEKS mastery, analytics dashboard, D1 persistence | Phase 5A |
| **6** | Response intelligence | Pattern detection, hint quality, Widow/Fury intros | Phase 3, 4 |
| **7** | Voice I/O + audio-visual sync | Jarvis speech, teacher voice commands, A/V sync with transitions | Phase 6 (Response Intelligence) |
| **8** | Polish + reporting | Classroom-ready experience, benchmark exports | All above |



## 19. Claude Code Guidelines

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

## 20. Module Integration Architecture

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

> **Note:** The schema below shows the **pattern-detection-relevant subset** of fields used by `detectMathError()` and the event flow logic. The complete problem schema — including `answerUnit`, `primaryType`, `validationTypes`, `scienceTeksConnection`, `scienceLabel`, `diagram`, and MC-specific extensions (`mcOptions`, `distractorRationales`) — is defined in §7 "Problem Schema." The LLM outputs the full schema; this section highlights only the fields consumed by the mission gameplay loop.

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
|   |     (Phase 6: upgrade to pattern-specific)|     |
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

## 21. Privacy & Compliance [NEW v4.0]

This section documents the legal framework governing the student response system (§2, §15, Phase 5A/5B in §18). It is included in the project brief because the brief doubles as patent documentation and compliance paper trail.

### COPPA (Children's Online Privacy Protection Act)

COPPA applies when a commercial operator collects personal information online from children under 13. The 2025 COPPA amendments (finalized April 22, 2025; compliance required April 22, 2026) expanded the definition of "personal information" to include biometric identifiers, device IDs, persistent cookies, precise geolocation, and inferred behavioral profiles.

**CRITICAL:** The FTC did NOT codify the school authorization exception in the 2025 final rule. The rulemaking deferred this to potential FERPA amendments from the Department of Education. The exception still exists as longstanding FTC guidance and is actively enforced by the FTC, but it is not written into the formal rule text. This creates some legal ambiguity — the exception is valid and used daily by thousands of edtech companies, but its legal footing is guidance-based rather than regulatory.

**School authorization exception (still valid):** Schools can consent on behalf of parents IF: (1) the information is used for a school-authorized educational purpose and NO other commercial purpose, and (2) the edtech service provides the school with COPPA-required notice of data collection and use practices. The school reviews and authorizes — not individual classroom teachers. A school principal, district IT administrator, or district privacy officer is the appropriate authorizer.

### FERPA (Family Educational Rights and Privacy Act)

FERPA primarily regulates schools and school districts, not edtech vendors directly. However, student answer data linked to student names constitutes "education records" under FERPA, and schools must maintain control over education records shared with third-party services. We operate under the "school official" exception — providing a service the school has authorized for educational purposes. This exception requires a written agreement between the school and the service provider specifying the legitimate educational interest, the data to be disclosed, and the security measures in place.

### Texas Student Privacy Act (Education Code §32.151, SB 1792)

This act directly targets third-party edtech vendors (not just schools), which makes it directly applicable to this project regardless of COPPA/FERPA status.

**Prohibits:** Targeted advertising using student data, selling student data, creating commercial profiles for non-educational purposes.

**Requires:** Reasonable security measures, data minimization (collect only what is adequate, relevant, and reasonably necessary for the educational purpose), and clear privacy notices.

**Key detail:** ALL data from users under 13 is classified as "sensitive" in Texas, triggering heightened protections beyond the baseline requirements.

### Compliance by Phase

**Phase 5A (Anonymous):** No COPPA trigger (no personal information collected), no FERPA trigger (no education records created), no Texas Student Privacy Act trigger (no covered information). The system collects only aggregate anonymous data: "Room X, Question Y: Z chose A." No IP addresses are logged, no cookies are set, no device fingerprints are collected. This is functionally equivalent to "raise your hand if you think B" — a pedagogical technique that predates the internet and triggers no privacy law. Phase 5A can be deployed in classrooms immediately.

**Phase 5B (Tracked):** Full compliance required. Student first name + class period + answer history constitutes personal information (COPPA), education records (FERPA), and covered information (Texas Student Privacy Act). All three regulatory frameworks apply.

### Three-Stage Testing Pathway

**Stage 1 — Synthetic data (zero compliance):** Build the entire tracked system using 25 fake students (Test Student A through Y). Simulate answer patterns covering edge cases (all correct, all wrong, partial mastery, team competition). Verify data flows, analytics calculations, and teacher reporting dashboards. This tests 90% of Phase 5B functionality without any real child data.

**Stage 2 — Adult volunteers (zero COPPA compliance — adults consent for themselves):** Fellow teachers, grad school classmates, and other adults act as "students" on their own devices. Tests real-time multi-device WebSocket experience, poll aggregation latency, dashboard responsiveness. COPPA only applies to children under 13, so adult testers require no regulatory compliance.

**Stage 3 — Formal pilot with real students (full compliance):** Write a plain-language privacy policy covering the requirements below. Present it to the school principal or district IT/privacy officer. The school reviews and authorizes under the COPPA school consent exception. The school handles parent notification via its existing annual technology consent forms (most Texas districts already have these for tools like Google Classroom, Kahoot, and IXL). Run the pilot under that authorization.

### Privacy Policy Requirements for Phase 5B Deployment

The privacy policy document must address five areas: (a) **What data is collected:** student first name or alias, answer selections per question, TEKS performance scores over time. (b) **What is done with it:** teacher assessment reports, problem difficulty adjustment via the dual-input flywheel. (c) **What is NOT done:** no advertising, no selling to third parties, no third-party data sharing, no commercial use beyond educational assessment. (d) **Retention:** data is deleted at the end of the school year or upon request, whichever comes first. (e) **Deletion mechanism:** the teacher or school administrator can request complete data deletion at any time via a clearly documented process.

### Legal Disclaimer

This documentation represents good-faith research by the development team. It is NOT legal advice. Before deploying Phase 5B with real students at scale, consult an attorney specializing in edtech privacy law. The regulatory landscape (especially around the 2025 COPPA amendments and the school authorization exception) may evolve between the time of this writing and actual deployment.

---

## 22. Patent & IP Strategy [NEW v4.0]

This section documents the intellectual property strategy for the core technology described in this brief. The generation pipeline — not the Iron Man mission theme — is the patentable innovation.

### Three Independent Patent Claims

The claims are written at three scope levels to provide layered protection. Each claim is independently defensible.

**Claim 1 — Integrated System (broad):** A system for generating curriculum-aligned educational content comprising: a large language model prompted with curriculum standards and few-shot exemplars, a multi-layer deterministic validation pipeline with hard gates for structural integrity, mathematical correctness, content policy, and curriculum-standard alignment, a teacher review interface with per-item feedback controls that feed approved content back as exemplars, whereby content quality improves over time through teacher usage without model fine-tuning.

**Claim 2 — Flywheel Mechanism (specific):** A method for iteratively improving LLM-generated educational content quality comprising: teacher evaluation of generated content, optional qualitative annotation of approved content (the `whyThisIsGood` field — see §7 and §9), storage of annotated content as exemplars, dynamic retrieval and injection of relevant exemplars during subsequent generation, whereby system quality improves as a byproduct of normal teacher usage without model fine-tuning. In an enhanced embodiment, the flywheel receives a second input stream from student performance data (Phase 5B — see §7 "Dual-Input Flywheel"), with per-problem accuracy and distractor-selection frequency enriching exemplar metadata.

**Claim 3 — Validation Pipeline with Override (specific):** A multi-layer validation method for LLM-generated educational content comprising: deterministic structural verification (hard gate — Layer 1), deterministic mathematical evaluation (hard gate — Layer 2), semantic content analysis (hard gate — Layer 3), curriculum-standard alignment checking against a machine-readable standard database (hard gate or advisory depending on context — Layer 4, see §10 "Two-Tier Validation Context"), with a per-item teacher override mechanism (see §9 "Per-Problem TEKS Override Toggle") that switches curriculum alignment from enforcement to advisory mode for teacher-initiated modifications while maintaining hard gates on mathematical correctness.

### Filing Strategy

File ONE provisional patent application with multiple claims at the scope levels above. File as micro entity ($65 USPTO fee). File as individual inventor (can assign to LLC later if commercializing). The provisional provides a 12-month non-extendable pendency period from the filing date. Under the first-to-file system, the filing date IS the priority date — no grace period needed, no "date of invention" arguments.

**Critical:** Describe ALL planned features in the provisional, including unbuilt ones like the student response system, team competition, second flywheel input stream, adaptive difficulty, and multiple delivery surfaces. This locks in the priority date for the full vision. Features described in the provisional but not yet implemented still receive the provisional's priority date as long as the description is enabling (i.e., a person skilled in the art could build it from the description).

The non-provisional application (filed within 12 months of the provisional) includes implementation details, screenshots, and any new innovations discovered during development. Material described in the provisional keeps the original priority date; genuinely new material gets the non-provisional filing date.

### Prior Art Landscape (Research Conducted February 2025)

No existing system was found that combines: LLM generation + multi-layer validation with deterministic hard gates + teacher annotation flywheel + curriculum-standard alignment checking against machine-readable standards. Individual components exist in isolation — few-shot prompting is well-known, self-consistency voting is published research, teacher feedback loops exist in various edtech products — but the integrated pipeline as described in this brief is novel.

Specific systems examined: Khan Academy Perseus (content authoring but no LLM generation or validation pipeline), IXL (adaptive but proprietary content, no teacher-driven flywheel), Photomath (solving not generating), DreamBox (adaptive but no teacher annotation loop), LearnLens (classroom analytics but no generation), FACET (feedback tools but no LLM pipeline). None implement the flywheel + validation combination.

### Critical IP Notes

**Marvel/Iron Man IP is NOT ours.** The mission theme uses Marvel characters. The patent makes ZERO reference to any Marvel IP. The patentable innovation is entirely in the generation pipeline, which is theme-agnostic. This is why the brief emphasizes generator-first architecture (Principle #7 in §1) — the core technology must be cleanly separable from the delivery surface.

**Public disclosure risk:** The GitHub repo should be PRIVATE until the provisional is filed. Under US patent law, there is a 12-month grace period for the inventor's own disclosures, but international patent rights (PCT, EPO) evaporate immediately upon public disclosure. File the provisional BEFORE making the repo public.

**Fair use note:** Use of Marvel characters in the classroom mission is for educational purposes in a non-commercial classroom setting. This is a separate legal question from the patent and does not affect patentability of the generation pipeline.

---

## 23. Platform Vision & Multiple Delivery Surfaces [NEW v4.0]

This section documents the strategic vision for the core technology beyond the Iron Man mission. It supports Principle #7 (Generator-First Architecture) from §1 and informs the patent's broad claims in §22.

### Core Principle

The problem generation engine is delivery-surface agnostic. The Iron Man mission is surface #1. The same engine — same LLM pipeline, same validation, same exemplar bank, same flywheel — can power multiple surfaces without modification to the core. Each new surface is a thin UI layer that calls into the existing generation and validation infrastructure.

**This isn't theoretical — it's how the system is already built.** The Iron Man theme is window dressing. The setup screen (grade/TEKS selection), the Groq generation call, the four-layer validation pipeline, the teacher review screen with per-problem feedback, the exemplar bank and flywheel — none of these reference firewalls, transitions, Jarvis, or any Marvel narrative. They are pure generator infrastructure. The mission narrative only begins AFTER the teacher clicks "Start Mission," which is the point where surface-specific code takes over. A Worksheet Generator surface would use the exact same setup → generate → validate → review → approve pipeline and then render to PDF instead of feeding into the mission flow. That's a thin output layer, not a rebuild. The beating heart of this project is the problem generator, not the Iron Man facade.

### Identified Delivery Surfaces

**Surface 1 — Iron Man STEM Mission (current, built).** Immersive classroom game with narrative, characters, sound design, and visual effects. Runs locally from file:// on teacher's Surface Laptop. The demo, proof of concept, and first delivery surface. Demonstrates the engine's capabilities in the most engaging possible format.

**Surface 2 — Worksheet Generator (future).** Teacher picks grade + TEKS + count + format, clicks generate, gets a printable PDF of validated problems with answer key. The simplest possible surface — no game, no theme, just quality problems on paper. Lowest development effort of any new surface because the generation pipeline already exists; only the output rendering layer (HTML-to-PDF) is new.

**Surface 3 — STAAR Test Prep (future).** Practice mode mimicking actual STAAR format and question types. Adaptive difficulty based on student performance via the dual-input flywheel (§7). Multiple choice with diagnostically-designed distractors. Particularly strong market fit given that the exemplar bank is already built from STAAR released tests.

**Surface 4 — Tutoring System (future).** Integrated with the student device system (Phase 5). Individual student works through problems at their own pace on their own device. System adapts to their specific weaknesses via the dual-input flywheel — if a student keeps missing regrouping problems, the system generates more regrouping-focused content.

**Surface 5 — District Assessment Tool (future).** School or district administrators generate benchmark assessments aligned to specific TEKS across grade levels. Standardized problem quality across classrooms because every problem goes through the same validation pipeline. Exportable in standardized assessment formats.

**Surface 6 — Textbook Supplement / Curriculum Publisher API (future).** The engine exposed as a REST API that textbook publishers or curriculum companies can integrate into their existing products. They send TEKS codes and constraints, they receive validated problems. The generation pipeline becomes infrastructure rather than an end-user product.

### Standards Portability

**Current:** Texas TEKS (teks-rules.json, 217 entries covering grades 1-5 math). This is the data foundation the system is built on. Texas is home base — it's where the developer teaches, where the STAAR released tests provide exemplar content, and where classroom testing happens.

**The architecture is standards-agnostic, not Texas-specific.** The validation pipeline reads constraint fields (maxOperandDigits, allowedDenominators, stepCount, etc.) from whichever rules file it's given. It does not hard-code any Texas-specific logic. The exemplar bank's 21-field annotation schema and selection function are also standards-agnostic — only the actual exemplar content changes per framework. To support a new state, you build two files: a rules file (equivalent to teks-rules.json) and an exemplar bank seeded from that state's released test items.

**"Common Core" is not a single standard.** Roughly 40 states nominally adopted the Common Core State Standards, but most have since modified, renamed, or supplemented them with state-specific additions. Florida has B.E.S.T. Standards, New York has Next Generation Learning Standards, California layers its own framework on top of CCSS. Simply building one "ccss-rules.json" would not actually serve any of these states well — each state's tweaks affect what's tested, how it's tested, and what constraints apply at each grade level. The real expansion strategy is per-state, driven by market demand: pick a target state, extract its standards into a rules file, seed an exemplar bank from its released tests, and the existing pipeline handles the rest.

**Political reality matters for marketing.** Texas, Virginia, Alaska, Nebraska, Indiana, South Carolina, and Oklahoma never adopted Common Core. Several others have since repealed it. Leading with "we support Common Core" would be counterproductive in many of the largest education markets. Leading with "we support YOUR state's standards" — and backing that with exemplars pulled from YOUR state's actual tests — is a much stronger value proposition.

**Expansion is data work, not engineering work.** Supporting a new state means weeks of extraction, annotation, and audit for that state's standards and released tests. The pipeline architecture doesn't change. This is a scaling challenge with a clear, repeatable process — the same methodology used for Texas TEKS Grade 3 applies identically to any other framework.

### Grade Coverage Expansion

**Why Grade 3 first:** Grade 3 was chosen as the starting point because it's the first STAAR-tested grade in Texas (the richest source of released test items for exemplar extraction), it sits at a complexity sweet spot for working out the generation pipeline (harder than K-2 counting but simpler than Grade 5 multi-step word problems), and it's the grade level the developer has the deepest classroom experience with. Every architectural decision — the annotation schema, the validation layers, the extraction conventions, the audit process — was battle-tested on Grade 3 specifically so it would generalize cleanly to other grades.

**Current exemplar bank:** 135 items covering all 46 Grade 3 Math TEKS, extracted from 6 years of STAAR released tests (2019-2025) plus 3 synthetic items for never-tested TEKS.

**Full coverage target:** Approximately 170 additional TEKS across grades 1-2 and 4-5, requiring similar extraction and annotation work for each grade level's released STAAR tests. This is the same repeatable process used for Grade 3 — not new engineering, just more data work.

**Expansion strategy:** Systematic extraction from official STAAR released tests for each grade level, using the same 21-field annotation schema, the same extraction conventions (F/G/H/J normalization, interactive item adaptation, canonical TEKS format), and the same multi-pass audit process documented in §7. Grade 3 proved the process works end-to-end; grades 1-2 and 4-5 follow the same playbook.

---

## Important Reminders

1. **Questions generated at session start** -- All 10 math + 3 science problems are created BEFORE mission begins
2. **Pattern detection is client-side** -- No API call needed; runs in browser JavaScript
3. **~90% of errors follow patterns** -- The system should catch most common mistakes
4. **Black Widow logic is in flux** -- Current implementation may change based on classroom testing
5. **Voice consistency is critical** -- All Jarvis audio must use the cloned voice
6. **Entertainment first, education second** -- This should feel like a Marvel movie
7. **Single screen primary (base mode)** -- Teacher display optimized for laptop to TV via HDMI (1920x1080). When Student Devices are enabled (§15), student screens are minimal HTML/JS served from the Cloudflare Worker — not a second app to maintain.
8. **Pre-record everything possible** -- Minimize real-time API calls
9. **Teacher controls everything (base mode)** -- In default mode, students don't interact directly with the system. When Student Devices are enabled (§15), students interact through a constrained interface while the teacher retains override authority.
10. **School appropriate always** -- All content must be safe for elementary students
11. **ALL 5 transitions are RANDOM** including Access Granted. Correct/incorrect answers trigger response bank lines, NOT transitions. Transitions play between firewalls. (Glitch Burst is Widow-exclusive via `_buildWidowGlitch()`, NOT in the random pool.)
12. **App runs locally from file://** on Surface Laptop via HDMI to classroom TV. NOT Replit.
13. **Groq via Cloudflare Worker** -- API key never in client-side code. Worker handles CORS for file:// origins.
14. **Process standards (X.1A-X.1G) are system-prompt defaults** -- Not selectable on setup screen. Addressed implicitly like STAAR treats them.
15. **Teacher reviews EVERY problem** -- Validation pipeline flags issues, teacher makes final call. Students never see an unapproved problem.
16. **LLM generates TEXT, JavaScript calculates ANSWER** -- Never trust the LLM to do arithmetic.
17. **SVG diagrams are deterministic** -- Template library renders from structured descriptors. LLM never generates raw SVG.
18. **Currently built for Texas TEKS** -- All standards references use Texas TEKS. The architecture is standards-agnostic (see §23), but the current rules file and exemplar bank are Texas-specific. Don't reference Common Core or other frameworks in generated code.

---

## Files Reference

**In Project Folder:**
- `response_bank.md` -- Complete pre-scripted dialogue (~750 lines)
- `grade_1_sciencemath_teks.txt` through `Grade_5_sciencemath_teks.txt` -- TEKS standards
- `Ironman_STEM_Script.pdf` -- Original mission script
- `Batch_1_readiness_standards_exemplars.js` -- [DONE] 65 STAAR-extracted exemplars, 13 Readiness TEKS, audited clean
- `Batch_2_supporting_standards_exemplars__1_.js` -- [DONE] 67 STAAR-extracted exemplars, 30 Supporting TEKS, audited clean (5 passes). PRODUCTION file (the non-suffixed version is superseded)
- `Batch_3_missing_teks_exemplars.js` -- [DONE] 3 synthetic exemplars for never-tested TEKS (3.3A, 3.9C, 3.9F), teacher-approved
- `distractor-patterns.js` -- [DONE] COMPLETE (Tier 1) -- 1,586 lines, 97 worked examples, 27 patterns, 5 TEKS (3.4A/F/J/D/K). All examples traced to TEA STAAR rationale documents 2019-2025. 4-part audit verified. Exports: DISTRACTOR_PATTERNS, UNIVERSAL_DISTRACTOR_RULES, DISTRACTOR_RULES_REMINDER, selectDistractorPatterns(), toDistractorInjectionFormat(). Browser + Node compatible.
- Various `.jpg`, `.png`, `.webp` -- Reference images

**Complete JavaScript Modules (uploaded separately):**
- `pattern-detector.js` -- [DONE] COMPLETE (~1,100 lines) -- Error pattern detection with 24 patterns
- `mission-integration.js` -- [DONE] COMPLETE (~1,580 lines) -- Mission state and flow management
- `sound-manager.js` -- [DONE] COMPLETE (~500 lines) -- Audio pooling system for sound effects
- `firewall-sequence.js` -- [DONE] COMPLETE -- Transition engine with 5 randomized math transitions (Fury science animation and Black Widow appearances are separate events), GSAP timeline orchestration, PixiJS integration hooks
- `pixi-effect-manager.js` -- [DONE] COMPLETE -- PixiJS singleton manager (single PIXI.Application, GSAP ticker sync, stage reset between transitions)
- `hud-config.js` -- [DONE] COMPLETE -- Central `window.HUD_CONFIG` configuration object (colors, timing, easing, transition pool, mission structure)
- `im-animations.css` -- [DONE] COMPLETE -- Namespaced CSS foundation (`.im-reactor-*`, `.im-panel-*`, `.im-glitch-*`, `.im-transition-*` class families, `--im-*` custom properties)
- `config.js` -- [DONE] COMPLETE (Phase 4 P1) -- Groq Worker URL, model name, retry settings
- `cerebras-api.js` -- [DONE] COMPLETE (Phase 4 P1 + MC pipeline v4.1 + Diagram pipeline v4.1b + Operand fixes v4.1c) -- API wrapper with generateMission(), calculateAnswer(), computeDistractorValues(), selectExemplars() (5 per TEKS cap), distractor pattern injection via selectDistractorPatterns(), rationale label generation returning {value, rationale, tag} triples, distractorReasoning→distractorRationales bridge, MC mix ratio logic. Diagram generation: `_computeDiagram()` deterministically computes diagram descriptors from TEKS+operation+operands+narrative, `_validateDiagram()` validates all diagram descriptors (both LLM-generated and computed). System prompt includes diagram type definitions and selection rules. Wired into both generateMathProblems() and _regenerateMathProblem(). Operand fixes (v4.1c): split 3.4D from 3.4F case block in `generateOperandsForTeks()` — 3.4D is MULTIPLY-only per teks-rules.json. Fact-family deduplication in `generateMissionOperands()` — MULTIPLY and DIVIDE normalized to sorted factor pairs under shared `MUL:` key prefix, preventing near-duplicate problems (e.g., 30÷5 and 30÷6). Requires config.js + exemplar files + distractor-patterns.js loaded first (see Script Load Order).

**Phase 4 Files (status updated v4.1):**
- `validation-engine.js` -- [DONE] COMPLETE. Layers 1-4 validation within validateProblem() + MC extension (duplicate detection, rationale-value cross-check, consecutive integer detection, wide-spread check). Originally planned as `validator.js`; actual implementation created under this name by Prompt 3.
- `teks-rules-data.js` -- [DONE] COMPLETE. `window.TEKS_RULES_DATA` — 217 math TEKS entries with description fields. Browser-loadable runtime version of teks-rules.json. Used by teacher-review.js for TEKS tooltip hover.
- `teacher-review.js` -- [DONE] COMPLETE. Teacher Review Screen UI — split-panel layout, all quick-action chips, free-text feedback, TEKS override toggle, ★ Favorite annotation, approval workflow, back button. The most heavily modified file in the project (15 bugfix rounds + MC bugfix v1).
- `validator.js` -- SUPERSEDED. Was the originally planned five-layer validation pipeline name. Never created — Prompt 3 built sync validation into `validation-engine.js` instead.
- `confidence.js` -- ABANDONED. Built and tested for Layer 5 async validation. Permanently abandoned after testing showed zero incremental value over Layers 1-4, counterproductive science scoring, and two implementation bugs (see §10 postmortem). The teacher review screen is the quality gate. File deleted from codebase.
- `teks-rules.json` -- [DONE] COMPLETE. Static TEKS validation constraints populated from TEA data.
- `diagramRenderer.js` -- [DONE] COMPLETE (Tier 1) -- ~1,470 lines, DiagramRegistry pattern + 8 Tier 1 SVG renderers (numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot). Shared helpers: svgEl(), polarToCartesian(), describeArc(), testDiagram(). All renderers validate params with defaults/clamping. CSS classes use `.im-diagram-*` namespace. Exposed as window.DiagramRegistry. Tested across ~58 test cases. Generation pipeline wired via _computeDiagram() in cerebras-api.js (v4.1b). Rendered on Teacher Review Screen via _renderDiagram() in teacher-review.js (v4.1c). NOT YET RENDERED on gameplay HUD.
- `diagramAnimations.js` -- NOT STARTED. GSAP DrawSVGPlugin animations for diagrams.
- `diagram-hud.css` -- [DONE] COMPLETE -- Iron Man HUD theming for all 8 Tier 1 SVG diagram types. CSS custom properties (--diagram-stroke, --diagram-fill, --diagram-marker, --diagram-text, --diagram-bg, --diagram-glow), `.im-diagram-*` namespace, cyan-on-dark aesthetic with glow filter, Orbitron/Rajdhani fonts.

**Research Reports (in Claude.ai project files):**
- `Building_a_Multi-Layer_Confidence_System_for_LLM-Generated_Math_Problems__Validation_Pipeline_and_TEKS_Alignment.md` -- Validation pipeline research
- `SVG_Math_Diagrams_for_a_TEKS-Aligned_Iron_Man_Learning_App__Template_Architecture_and_LLM_Integration_Strategy.md` -- SVG diagram generation research
- `Few-Shot_Prompting_for_STAAR-Quality_Educational_Content_with_Llama_3_3__Optimal_Exemplar_Selection__Formatting__and_Dynamic_Retrieval_Strategies.md` -- Few-shot exemplar selection, formatting, and dynamic retrieval strategies [NEW v3.9]
- `claude_code_prompting_report.md` -- CC prompting best practices
- `ChatGPT_Claude_Code_prompt_research.pdf` -- CC prompt research (ChatGPT-sourced)
- `ChatGPT_Debugging_research.pdf` -- CC debugging research (ChatGPT-sourced)
- `Building_Vanilla_JS_Features_with_Claude_Code_Web__Prompting_Strategies_and_Architectural_Patterns.md` -- Vanilla JS architecture patterns
- `Prompting_Claude_Code_for_Sound_Integration_Without_Breaking_Things.md` -- Sound integration prompting patterns
- `deep-research-report.md` -- Groq/Llama 3.3 70B selection research
- `claude_PixiJS_markdown_file.md` -- PixiJS integration research
- `ChatGPT_PixiJS_report.pdf` -- PixiJS research (ChatGPT-sourced)

**Still Needed:**
- All dialogue audio files (via Cartesia voice synthesis from response bank)
- Nick Fury voice clone
- Black Widow voice clone

**Exemplar Bank Audit Reports (in Claude.ai project files):** [NEW v3.9]
- `batch2-pass1-findings.md` -- Pass 1 audit: 2019 + 2021 (22 items, 0 critical, 0 moderate, 2 minor)
- `batch2-pass2-findings.md` -- Pass 2 audit: 2022 (12 items, 0 critical, 0 moderate, 1 minor)
- `batch2-pass3-findings.md` -- Pass 3 audit: 2023 + 2024 (22 items, 0 critical, 1 moderate systematic)
- `batch2-pass4-findings.md` -- Pass 4 audit: 2025 (11 items, 0 critical, 1 moderate systematic same root cause)
- `batch2-pass5-findings.md` -- Pass 5 final structural audit: all 67 items, cross-batch validation, master discrepancy registry

---

## Known Issues / In Progress [UPDATED v4.1]

> * **Transition Engine** -- `FirewallSequence` class is BUILT and working. 5 randomized transitions play between firewalls (+ Widow glitch exclusive). PixiJS foundation integrated. Currently rewriting individual transitions to use GPU-accelerated PixiJS effects (starting with Access Granted).

> x **PixiJS Transition Rewrites** -- Access Granted is the first transition being upgraded from CSS/GSAP-only to CSS+GSAP+PixiJS hybrid (DOM text on top, GPU effects canvas underneath). Remaining transitions will follow the same pattern.

> x **Black Widow Logic** -- Appearance triggers still in flux. Current implementation is placeholder pending classroom testing.

> x **CDN Dependencies** -- PixiJS libraries currently load from jsdelivr CDN. This works because the app runs on the teacher's laptop (not student Chromebooks), but should eventually be bundled locally for zero-CDN reliability in schools with strict content filters.

> x **Content Filter: "battle" → YELLOW** -- The content filter currently flags "battle" as RED (blocked), preventing Marvel-themed word problems that use combat vocabulary. Should be YELLOW (warning but allowed). Small fix, not yet committed.

> x **Fraction TEKS Not Supported** -- The app currently supports arithmetic TEKS (3.4x: ADD, SUBTRACT, MULTIPLY, DIVIDE) only. Fraction TEKS (3.3x), geometry (3.6x), measurement (3.7x), data analysis (3.8x), and financial literacy (3.9x) all need their own operand generation, problem structure, and distractor patterns. Testing with 3.3A or 3.3F causes all 10 problems to fail Layer 4 TEKS validation. This is a known architectural limitation, not a bug — the setup screen does not yet indicate which TEKS are supported.

> x **Tier 2+ Distractor Patterns Not Built** -- distractor-patterns.js covers 5 Tier 1 TEKS (3.4A, 3.4F, 3.4J, 3.4D, 3.4K). Seven Tier 2 TEKS (3.4H, 3.4E, 3.5A, 3.5B, 3.4B, 3.4G, 3.6C) need entries. The pre-compute function still generates valid distractor values for unsupported arithmetic TEKS — they just lack STAAR-specific error taxonomy guidance.

> x **Layer 5 Async Validation ABANDONED** -- Self-consistency voting and blind review were built, tested, and permanently abandoned. Testing showed zero incremental value: every math problem scored pass (5/5 self-consistency agreement), science question scoring was counterproductive (blind reviewer applied math TEKS to science questions, producing 0.44-0.52 scores), and the feature cost 78 extra API calls per mission. Two implementation bugs also surfaced (crash on regeneration during async check, regen mode misinterpretation). The teacher review screen is the quality gate. See §10 postmortem.

> [DONE] **SVG Diagram Renderer Tier 1 COMPLETE (v4.1), Generation Pipeline WIRED (v4.1b), Teacher Review Rendering (v4.1c)** -- DiagramRegistry with 8 renderers (numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot) implemented in `diagramRenderer.js` (~1,470 lines) with HUD theming in `diagram-hud.css`. Tested across ~58 test cases including edge cases and cross-renderer regression. Deterministic `_computeDiagram()` in cerebras-api.js computes diagram descriptors from TEKS+operation+operands+narrative (MULTIPLY→array/areaModel, DIVIDE→array, ADD→stripDiagram, SUBTRACT→stripDiagram, FRACTION_*→fractionBar, bare math→null). All computed descriptors validated through `_validateDiagram()`. Diagram data present on every generated problem. Rendered on Teacher Review Screen inside content card (v4.1c). Two remaining steps: (1) render diagrams on gameplay HUD (alongside problem text during mission), (2) build GSAP DrawSVGPlugin "power-on" animation layer (`diagramAnimations.js`). Known cosmetic limitations: extreme-ratio proportional sections (e.g., 5 vs 500) render labels illegibly in narrow segments; array column labels overlap title when both are present on large grids; area model left-side factor labels crowd the model edge on certain decompositions (e.g., 34×27); fractionCircle with denominator=1 renders an unnecessary single radial divider line. None affect real classroom use cases.
> **3.4F Operand Constraint Data Issue (flagged v4.1c)** -- teks-rules.json defines 3.4F's `operandConstraints` as both operands max 10. This is correct for MULTIPLY (both factors ≤10) but wrong for DIVIDE, where operands are [a×b, a] and the dividend (a×b) can reach 100. If 3.4F is selected alone in a mission, DIVIDE problems would trigger Layer 4 TEKS violations on operand range. Fix: update 3.4F's operandConstraints in teks-rules.json to allow operand1 up to 100 when operation is DIVIDE, or add operation-aware constraint logic to the validator. Low priority — 3.4F is rarely selected alone (usually paired with 3.4D or 3.4K).

> x **PDF Upload Not Started** -- Teacher PDF upload and parsing (Section 12) is still TODO.

> [DONE] **Phase 4 Prompts 1-3 COMPLETE (v4.1)** -- API module, problem generation pipeline with exemplar injection, Teacher Review Screen with 15 bugfix rounds. All sync validation (Layers 1-4) working.

> [DONE] **MC Distractor Pipeline COMPLETE (v4.1)** -- End-to-end: pattern bank → pre-computed values → rationale labels → LLM paraphrase → validation (hardgate duplicate + rationale-value checks). 100% rationale accuracy across all tested Tier 1 TEKS. MC gameplay HUD with A/B/C/D holographic buttons and keyboard input.

> [DONE] **Few-Shot Exemplar Bank COMPLETE (v3.9)** -- 135 STAAR-extracted + synthetic exemplars covering all 46 Grade 3 Math TEKS. Three batch files ready for integration. Five-pass audit verified zero critical errors. selectExemplars cap fixed to 5 per TEKS (was 10 total).

---

*Let's build something that makes kids feel like they're actually helping Iron Man save the world.*
