# Phase 4 Prompt 3 — Teacher Review Screen + Instant Validation (Layers 1–4)

## BEFORE WRITING ANY CODE

Read these files IN THIS ORDER. Do not write a single line of code until you have read all of them:

1. `teacher-review-option-c.jsx` — READ-ONLY React mockup. This is the DEFINITIVE visual reference. Study every color value, every spacing value, every interaction. You will translate this pixel-for-pixel into vanilla JS + CSS.
2. `teks-rules.json` — Data file with 217 TEKS entries (132 have validation constraints, `validatable: true`). Read the schema carefully. Key fields used by the validation engine: `operations` (array), `operandConstraints` (object with `operand1`/`operand2` sub-objects), `maxResult`, `minResult`, `allowedDenominators`, `unitFractionOnly` (boolean, only on 2 entries), `grade`, `primaryType`. Each operand sub-object may contain any combination of: `minDigits`, `maxDigits`, `minValue`, `maxValue`, `mustBeMultipleOf`, `allowedValues`, `exactValue`. All fields are nullable — always null-check before accessing.
3. `js/app.js` — Study the state machine. Understand how screens are shown/hidden. Find `generateMission()` call flow and where generation results arrive.
4. `js/cerebras-api.js` — Study `generateMission()` return format. Understand the problem schema (`wordProblem`, `numbers`, `operation`, `expression`, `expectedAnswer`, `gradeLevel`, `teksCode`). This is what your validation functions receive.
5. `index.html` — Study existing screen containers and script load order. Note existing CDN scripts.
6. `css/styles.css` — Study existing class naming patterns, CSS custom properties, color values.

After reading all six files, enter PLAN MODE. Output your plan BEFORE writing any code. The plan must show:
- Which files you will modify (MINIMAL changes to existing files)
- Which NEW files you will create
- How the state machine transitions: Setup Screen → [Generate] → [loading] → REVIEW SCREEN → [Launch Mission] → Gameplay
- How validation runs on each problem immediately after generation
- How regeneration calls the API and re-validates
- How "Launch Mission" transitions to existing gameplay flow

---

## TASK

Build the Teacher Review Screen — a split-panel interface where teachers review, edit, approve, and validate AI-generated problems BEFORE students play.

This screen appears after mission generation completes, before gameplay begins. It is the single most important quality control feature in the app.

The screen has TWO major subsystems built together in this prompt:
1. **Review/Approve/Regenerate UI** (the interactive split-panel interface)
2. **Instant Validation Pipeline (Layers 1–4)** (automated quality checks that populate traffic-light badges)

Both subsystems ship together because the validation badges are core UI elements of the review screen — they are NOT bolted on later.

---

## CONTEXT

<context>
Iron Man STEM Mission app for Texas elementary classrooms (grades 1–5). After the teacher selects TEKS and clicks "Generate Mission" on the setup screen, Groq API (via Cloudflare Worker) generates 10 math problems + 3 science interruptions. Currently the app skips straight to gameplay. This prompt inserts the review screen between generation and gameplay.

The app is vanilla JavaScript — NO React, NO frameworks, NO build tools. Runs from file:// protocol on a Surface Laptop connected via HDMI to a classroom TV at 1920×1080. The review screen is teacher-only (displayed on the laptop before projecting to students), so it does NOT need mobile responsiveness.

Reference: Iron_Man_STEM_Mission_Project_Brief_v3_9.md, Section 9 (Teacher Review Screen — Option C Split Panel) and Section 10 (Multi-Layer Validation Pipeline).
</context>

---

## PROTECTED FILES — DO NOT MODIFY

```
DO NOT read, modify, or reference these files:
- js/animations.js
- js/sound-manager.js  
- js/firewall-sequence.js
- js/pixi-effect-manager.js
- config.js
- js/response-bank-data.js
- Batch_1_readiness_standards_exemplars.js
- Batch_2_supporting_standards_exemplars.js
- Batch_3_missing_teks_exemplars.js
- teacher-review-option-c.jsx  (READ-ONLY design reference — do NOT modify)
```

---

## TARGET FILES

```
EXISTING data file (already in repo root — do NOT create or modify):
- teks-rules.json            — 217 TEKS entries. Load via fetch('teks-rules.json') at app startup, store in global.

NEW files to create:
- js/teacher-review.js       — All review screen logic (rendering, state, approve/reject/regenerate, feedback, Replace with Custom form)
- js/validation-engine.js    — Validation Layers 1–4 (structural, math verify, content policy, TEKS alignment). Self-contained module.
- js/exemplar-bank.js        — ExemplarBank class (~60 lines). Flywheel mechanism: save approved problems, retrieve blended exemplars for few-shot injection. See "EXEMPLAR BANK & FLYWHEEL MECHANISM" section.

Files to MODIFY (minimal changes only):
- index.html                 — Add <script> tags for new JS files, add math.js CDN, add review screen container <div>
- css/styles.css             — Add all review screen CSS classes (ALL use .im-review-* namespace prefix)
- js/app.js                  — MINIMAL: (1) after generation completes → show review screen, (2) after all approved → start mission with approved problems, (3) load teks-rules.json at startup
- js/cerebras-api.js         — Add regenerateProblem() method for single-problem regeneration
```

---

## DESIGN REFERENCE

The React JSX mockup at `teacher-review-option-c.jsx` is the DEFINITIVE design reference. Translate it faithfully to vanilla JS + CSS. Here is what the mockup specifies:

### Header
- Title "MISSION REVIEW" in Orbitron font, cyan (#00e5ff), uppercase, letter-spacing 2px
- Subtitle showing grade + selected TEKS
- Progress bar: 140px wide, 6px tall, fills cyan-to-green gradient as problems are approved
- Counter: "X/13" in Orbitron
- Button: "Approve All to Launch" (disabled state) → "▶ Launch Mission" (enabled when all approved, green #00ff64)
- NOTE: No format selector or cross-curricular toggle here — those live on the setup/TEKS selection screen. The review header is intentionally minimal: just progress tracking and the launch button.

### Left Panel (360px wide, scrollable)
- Each row: problem number badge (circle), preview text (~40 chars), TEKS badge, type indicator
- Cyan (#00e5ff) styling for math, orange (#ff8a00) for science
- Green checkmark (✓ #00ff64) replaces number badge when approved
- Selected row: left 3px cyan border accent + subtle background rgba(0,255,255,0.06)
- Llama Guard flagged problems: 🛡️ shield icon (orange) — visually distinct from confidence shapes
- Traffic-light confidence badge on each row (see Validation UI section below)
- Sort problems by confidence ascending — flagged/red items appear FIRST in the list

### Right Panel (flexible width)
- If problem is flagged by Llama Guard: 🛡️ orange shield banner at top with flag reason (NOT ⚠️ — shield is visually distinct from the yellow triangle confidence shape)
- TEKS badge, difficulty badge, operation badge
  - **Difficulty badge**: steel-blue text #7B9ECF, background rgba(123,158,207,0.12), border rgba(123,158,207,0.3). Shows "easy" / "medium" / "hard" / "challenging"
  - **Operation badge**: amber text #ffaa32, background rgba(255,170,50,0.12), border rgba(255,170,50,0.25). Shows "ADD" / "SUBTRACT" / "MULTIPLY" / "DIVIDE"
  - These two badges MUST be visually distinct from each other and from all other colors on screen (cyan for TEKS, green for approved, red for violations, purple for cross-curricular, orange for Llama Guard, gold for warnings/feedback)
- **★ Favorite button**: sits at the right edge of the badges row (uses `marginLeft: auto`). Always visible, any state. Uses a warm gold color palette in BOTH states so it's visually noticeable even when unselected:
  - **Unselected**: text rgba(255,200,0,0.55), background rgba(255,200,0,0.05), border rgba(255,200,0,0.25) — clearly a warm gold star, inviting interaction
  - **Selected**: text #ffc800, background rgba(255,200,0,0.15), border rgba(255,200,0,0.5) — brighter, more saturated gold, clearly "active"
  - This is the ONLY mechanism that feeds the flywheel — see "EXEMPLAR BANK & FLYWHEEL MECHANISM" section.
- Cross-curricular badge (purple #b388ff) showing science TEKS connection if applicable
- Validation detail chips section (see below)
- Problem content card:
  - Math: full narrative text, expression, answer
  - Science: question text, options list with correct answer highlighted green
- "Refine This Problem" section (title changes to "Refine This Question" for science):
  - Quick-action chips — DIFFERENT for math vs science:
    - Math problems: Easier Numbers, Harder Numbers, Word Problem, Bare Math
    - Science problems: Simpler Concept, Deeper Thinking, Better Distractors, Different Scenario
  - "Replace with Custom" only appears for math problems (not Fury science interruptions)
  - Free-text feedback textarea
  - **"↻ Regenerate with Changes" button** — appears INSIDE the gold feedback box, directly below the textarea, only when feedback text is present. This is the primary submit action so the teacher doesn't have to look elsewhere after typing. Calls the same regenerate function as "Regenerate with Feedback" below.
- Action buttons row (below the feedback box):
  - "Regenerate (Random)" — red-tinted, no feedback sent, generates fresh random problem
  - "Regenerate with Feedback" — gold-tinted, only shows when feedback exists (redundant with the button inside the box, but available as secondary action)
- "Replace with Custom" button and expandable form (see below)
- "APPROVE & NEXT →" button

### Footer
- Left: minimal screen identification text ("TEACHER REVIEW SCREEN · IRON MAN STEM MISSION")
- Right: shape legend — "● High Confidence   ▲ Needs Review   ◆ TEKS/Math Violation   🛡️ Safety Flag (Llama Guard)"

---

## VALIDATION UI ELEMENTS (built from day one — NOT deferred)

Build ALL validation display elements from day one. Sync layers (1–4) are fully wired. Async layer (5 — LLM Review) shows "Pending" placeholder chip that will be wired in Phase 4 Prompt 4.

### Traffic Light Confidence Badge (on each problem row in left panel)
- **Green circle** — "High Confidence" (all hard gates pass AND no content warnings)
- **Yellow triangle** — "Needs Review" (all hard gates pass BUT Layer 3 content warning exists — teacher decides)
- **Red diamond** — "TEKS/Math Violation" (hard gate failed: Layer 1, 2, or 4 — must fix before approving)
- Shapes are distinct (not just colors) for red-green colorblind accessibility (~10% of males)
- Score shown as descriptive LABEL ("High Confidence" / "Needs Review" / "TEKS/Math Violation"), NOT a numeric score

### CRITICAL: Two Separate Visual Systems — Do NOT Confuse
1. **Confidence system** = geometric SHAPES (●▲◆) in green/yellow/red → comes from validation-engine.js
2. **Llama Guard system** = 🛡️ SHIELD icon in orange → comes from Groq API safety check
These are completely independent systems. A problem can be Llama Guard flagged (🛡️) AND have a green circle (math and TEKS are fine, the concern is content safety). Or a problem can have a red diamond (TEKS violation) with NO Llama Guard flag (content is safe, but numbers are out of range). Never use ⚠️ for Llama Guard — use 🛡️ only.

### Validation Detail Chips (in right panel, below badges, above problem content)
- Row of small chips, one per validation dimension:
  - "Structure: ✅" or "Structure: ❌" (Layer 1)
  - For MATH problems: "Math: ✅" or "Math: ❌" (Layer 2 — JS arithmetic verification)
  - For SCIENCE problems: "Science: ✅" or "Science: ❌" (checks: 4 options exist, correctIndex valid 0-3, TEKS code recognized)
  - "Content: ✅" or "Content: ⚠️" (Layer 3, warnings are yellow — soft flag, teacher decides)
  - "TEKS: ✅" or "TEKS: ❌" (Layer 4 — HARD GATE: any TEKS violation = instant red diamond)
  - "LLM Review: ⏳ Pending" (Layer 5 placeholder — gray, non-interactive)
- Chips are small (font-size 11px), colored by status (green pass, yellow warning, red fail, gray pending)
- Each chip is expandable — clicking reveals WHY it passed/failed (e.g., "Operand 1 has 4 digits, TEKS 3.4G allows max 2 digits")

### Expandable "View issues" Panel
- Collapsible section below validation chips
- Shows all validation flags as a bulleted list in plain language
- Each flag includes which layer generated it and what rule was checked

### Confidence-Based Sort Order
- After validation runs on all problems, sort the left panel list by composite confidence score ASCENDING
- Red/flagged problems appear at TOP of list (teacher sees worst problems first)
- Green/high-confidence problems sink to bottom
- Science problems (which skip math validation) sort after all math problems
- This sort happens ONCE after initial validation; regenerating a problem does NOT re-sort the whole list (would be disorienting)

---

## VALIDATION ENGINE — Layers 1–4 (sync, instant)

Create `js/validation-engine.js` as a self-contained module. It exports: `validateProblem(problem, teksRules)`, `validateAllProblems(problems, teksRules)`, and `computeCompositeScore(signals)`. The `validateAllProblems` function runs `validateProblem` on each item and returns the array of results.

### Layer 1 — Structural Validation (HARD GATE)
```
Determine problem type: if problem.type === "science" OR problem has "question" field → science. Otherwise → math.

Check that problem object has all required fields:
- Math: wordProblem (string), numbers (array of numbers), operation (string), expression (string), expectedAnswer (number), gradeLevel (number), teksCode (string)
- Science: question (string), options (array of 4 strings), correctIndex (number 0-3), teksCode (string)
If ANY required field is missing or wrong type → structuralValid = false → composite score = 0 → red flag
```

### Layer 2 — Mathematical Verification (HARD GATE)
```
IMPORTANT: Normalize the expression before evaluating. The LLM may emit:
  - × (multiplication sign U+00D7) — replace with *
  - ÷ (division sign U+00F7) — replace with /
  - Commas in numbers like "1,250" — strip commas
Normalize FIRST, then evaluate.

Parse the normalized expression with math.js evaluate() function.
Compare computed result to expectedAnswer.
Use epsilon comparison for decimals: Math.abs(computed - expected) < 0.001
For division: also check that dividend is evenly divisible by divisor for integer-answer TEKS.
If math is wrong → mathCorrect = false → composite score = 0 → red flag regardless of everything else.
Science problems SKIP this layer (score = 1.0 automatically).
```

**CRITICAL:** Add math.js via CDN to index.html:
```html
<script src="https://unpkg.com/mathjs@15.1.0/lib/browser/math.js"></script>
```
This is ~200KB, no build tooling required. Handles fractions natively. Supports BigNumber mode for floating-point safety.

### Layer 3 — Content Policy & Sensibility Checks
```
Grade-appropriate number ranges (from teks-rules.json):
  - Look up rule for problem.teksCode
  - If rule.maxResult exists AND problem.expectedAnswer > rule.maxResult → flag "Answer exceeds TEKS maximum"
  - If rule.minResult exists AND problem.expectedAnswer < rule.minResult → flag "Answer below TEKS minimum"
  - If rule.operandConstraints exists, check each number in problem.numbers against rule operand maxValue → flag "Number exceeds grade-level range"

Nonsensical scenario checks:
  - Fractional indivisible objects: if wordProblem mentions "friends", "students", "people", "dogs", "cats" AND answer is not integer → flag
  - Negative results for grades 1-3: if gradeLevel <= 3 AND expectedAnswer < 0 → flag
  - Division by zero: if operation is DIVIDE AND numbers[1] === 0 → flag

Keyword-operation consistency (SOFT WARNING, not failure):
  - "shared equally" / "split" / "each got" → should be DIVIDE
  - "altogether" / "in all" / "total" / "combined" → should be ADD
  - "how many more" / "how many fewer" / "difference" / "left" / "remaining" → should be SUBTRACT
  - "times" / "each" / "groups of" / "rows of" → should be MULTIPLY
  - Generates warning if mismatch, but does NOT fail (context can make "more" mean subtraction)
```

### Layer 4 — TEKS Alignment Check

This is the most important validation layer for pedagogical accuracy. It uses the finalized `teks-rules.json` (217 entries, 132 validatable).

```
Load teks-rules.json at app startup into a global TEKS_RULES object.
Look up rule = TEKS_RULES[problem.teksCode].

If rule not found → score = 0.5, flag "Unknown TEKS code"
If rule.validatable === false → score = 1.0, skip (non-validatable standards)

Run these checks IN ORDER, collecting flags. Each check that fails adds a flag.
Score = (checks passed / checks attempted).

CHECK 1 — Operation Match:
  if (rule.operations && rule.operations.length > 0) {
    if (!rule.operations.includes(problem.operation))
      flag("Operation " + problem.operation + " not allowed. TEKS permits: " + rule.operations.join(", "))
  }

CHECK 2 — Operand Constraints (if rule.operandConstraints exists):
  For each operand key ("operand1", "operand2") in rule.operandConstraints:
    const constraint = rule.operandConstraints[operandKey];
    if (constraint === null) continue; // some entries have operand2: null
    const idx = operandKey === "operand1" ? 0 : 1;
    const value = problem.numbers[idx];
    if (value === undefined) continue; // problem may have fewer operands
    const digitCount = String(Math.abs(Math.floor(value))).length;

    // 2a — Digit count bounds
    if (constraint.minDigits && digitCount < constraint.minDigits)
      flag("Operand " + (idx+1) + " has " + digitCount + " digit(s), TEKS requires minimum " + constraint.minDigits)
    if (constraint.maxDigits && digitCount > constraint.maxDigits)
      flag("Operand " + (idx+1) + " has " + digitCount + " digit(s), TEKS allows maximum " + constraint.maxDigits)

    // 2b — Value range bounds
    if (constraint.minValue !== undefined && constraint.minValue !== null && value < constraint.minValue)
      flag("Operand " + (idx+1) + " is " + value + ", TEKS requires minimum " + constraint.minValue)
    if (constraint.maxValue !== undefined && constraint.maxValue !== null && value > constraint.maxValue)
      flag("Operand " + (idx+1) + " is " + value + ", TEKS allows maximum " + constraint.maxValue)

    // 2c — Must be multiple of
    if (constraint.mustBeMultipleOf && value % constraint.mustBeMultipleOf !== 0)
      flag("Operand " + (idx+1) + " is " + value + ", must be multiple of " + constraint.mustBeMultipleOf)

    // 2d — Allowed values (e.g., 4.4B requires operand2 be exactly 10 or 100)
    if (constraint.allowedValues && !constraint.allowedValues.includes(value))
      flag("Operand " + (idx+1) + " is " + value + ", must be one of: " + constraint.allowedValues.join(", "))

    // 2e — Exact value (e.g., 1.5C requires operand2 be exactly 10)
    if (constraint.exactValue !== undefined && constraint.exactValue !== null && value !== constraint.exactValue)
      flag("Operand " + (idx+1) + " is " + value + ", must be exactly " + constraint.exactValue)

CHECK 3 — Result Range:
  if (rule.maxResult !== null && problem.expectedAnswer > rule.maxResult)
    flag("Answer " + problem.expectedAnswer + " exceeds TEKS max " + rule.maxResult)
  if (rule.minResult !== null && problem.expectedAnswer < rule.minResult)
    flag("Answer " + problem.expectedAnswer + " below TEKS min " + rule.minResult)

CHECK 4 — Denominator Check (fractions):
  if (rule.allowedDenominators && rule.allowedDenominators.length > 0) {
    // Extract denominators from problem (from numbers array or expression parsing)
    // If any denominator not in rule.allowedDenominators → flag
    flag("Denominator X not in allowed set: " + rule.allowedDenominators.join(", "))
  }

CHECK 5 — Unit Fraction (only applies to 5.3J and 5.3L):
  if (rule.unitFractionOnly === true) {
    // Check that all fractions in the problem have numerator = 1
    // If any fraction has numerator ≠ 1 → flag
    flag("TEKS requires unit fractions (numerator must be 1)")
  }

Science problems: check teksCode exists in rules → return 1.0 if valid code, 0.5 if unknown.
```

### Composite Score Calculation
```javascript
function computeCompositeScore(signals) {
  // HARD GATES — any of these = instant red diamond, no weighted average can override
  if (!signals.structuralValid) return { score: 0, category: 'red', reason: 'Invalid structure' };
  if (!signals.mathCorrect)     return { score: 0, category: 'red', reason: 'Math answer incorrect' };
  if (!signals.teksAligned)     return { score: 0, category: 'red', reason: 'TEKS violation' };

  // SOFT FLAGS — Layer 3 content warnings produce yellow
  // If any content flag fired, category is yellow (teacher decides)
  if (signals.contentFlags.length > 0) return { score: 0.70, category: 'yellow' };

  // All checks pass = green
  return { score: 1.0, category: 'green' };
}
```

Hard gate rationale: Layers 1, 2, and 4 check objective facts — either the fields exist, the math is correct, and the problem meets TEKS constraints, or it doesn't. These are not matters of opinion. Layer 3 (content policy) is subjective — "is this scenario age-appropriate?" is a judgment call the teacher should make, so it produces a yellow flag, not a red block.

---

## "REPLACE WITH CUSTOM" FORM

Add a "Replace with Custom" button below the Regenerate buttons in the right panel. When clicked, it expands an inline form (not a modal — stays in the right panel flow):

### Form Fields:
- **Question Text** — textarea, required
- **Answer** — text input, required  
- **TEKS Code** — dropdown populated from teks-rules.json keys filtered by current grade, required
- **Difficulty** — dropdown: Easy, Medium, Hard
- **Operation** — dropdown: ADD, SUBTRACT, MULTIPLY, DIVIDE (for math only)
- **Science TEKS Connection** — optional dropdown, always visible (not gated by any toggle), populated from science TEKS for current grade
- **★ Favorite toggle** — button styled identically to the badges row ★ (same warm gold palette, same "☆ Favorite" / "★ Favorited" text). Placed between the Science TEKS dropdown and the Save button. When toggled on, a hint text appears: "This problem will feed the flywheel for future generation." When off, hint says: "Favorite to use as a template for future AI-generated problems." If the teacher saves with ★ active, the custom problem is both approved AND favorited, triggering the ExemplarBank save.

### Behavior:
- "Save Custom Problem" button replaces the current problem with teacher's manual entry
- Custom problems get an "UPLOADED" badge (blue outline) per brief spec
- Custom problems SKIP validation layers 2–4 (teacher is the authority) but still pass Layer 1 structural check
- Custom problems are automatically marked as approved after save
- If ★ was toggled ON in the form, the saved problem is also marked as favorited (triggering ExemplarBank save since it's both favorited and approved)

### Styling:
- Form uses same dark HUD aesthetic — dark inputs with cyan borders, Rajdhani font
- Collapse/expand with smooth animation
- `.im-review-custom-*` namespace for form-specific classes

---

## SETUP SCREEN ADDITIONS

The existing TEKS selection / setup screen already has the Cross-Curricular toggle and Show Expression toggle. Add the **Problem Format** selector alongside them. All three toggles affect how problems are GENERATED — the teacher sets her preferences BEFORE clicking "Generate Mission," and the initial batch of 10+3 problems arrives in the right format.

**No global toggles appear on the review screen.** The review header is intentionally minimal: progress bar + launch button. Per-problem overrides are handled by the quick-action chips (e.g., "Word Problem" / "Bare Math" for individual math problems).

### Problem Format Selector (NEW — add to setup screen):
- Three mutually exclusive buttons: "Pure Math" | "Mix" | "Word Problems"
- Default: "Mix"
- Place near the existing Cross-Curricular toggle and Show Expression toggle
- Active button: cyan background rgba(0,229,255,0.15) + border rgba(0,229,255,0.5)
- Inactive buttons: dim gray background rgba(255,255,255,0.04)
- Font size: 13px, padding: 6px 16px (large enough to be noticeable)

### How format flows into generation:
- When teacher clicks "Generate Mission", pass the format choice to the Groq API call
- "Pure Math": system prompt includes "Generate bare arithmetic expressions only, no word problem context"
- "Word Problems": system prompt includes "Generate real-world word problems with context"
- "Mix": system prompt does not constrain the format (LLM decides per-problem)

### How cross-curricular flows into generation:
- The existing Cross-Curricular toggle already exists on the setup screen
- When ON: generation prompt includes instruction to weave science TEKS themes into word problems
- When OFF: generation prompt produces math-only context
- On the review screen, problems that HAVE cross-curricular tags still DISPLAY the purple ✦ badges — the toggle just controls whether NEW/regenerated problems get science connections

### Per-problem overrides on review screen:
- "Word Problem" and "Bare Math" quick-action chips let the teacher override format for ONE specific problem
- Free-text feedback can request cross-curricular connections (e.g., "Connect this to the gravity TEKS")
- No global toggles needed on the review screen — the per-problem chips and free-text handle overrides

---

## CEREBRAS API ADDITION

Add `regenerateProblem(grade, teks, operation, feedback = '')` method to the API module (CerebrasAPI or equivalent class in `js/cerebras-api.js`):

- Generates ONE replacement problem for specified TEKS
- If feedback provided, include in prompt: "Teacher feedback: [feedback]. Please address this feedback."
- If no feedback, generate fresh random problem
- **Exemplar injection**: Pull up to 5 exemplars for this TEKS from the ExemplarBank (see next section). If fewer than 5 exist, use all available. Inject them as few-shot examples in the system prompt. The ExemplarBank returns a mix of Tier 1 (STAAR seed bank from `problem-exemplars.js`) and Tier 2 (teacher-approved problems from `localStorage`). Favorited problems have higher selection weight.
- Reads BOTH format AND cross-curricular settings from stored setup config (set on the TEKS selection screen before generation):
  - If format is 'pure', prompt says: "Generate a bare arithmetic expression only, no word problem context"
  - If format is 'word', prompt says: "Generate a real-world word problem with context"
  - If format is 'mix', prompt does not constrain the format (LLM decides)
  - If cross-curricular is ON, prompt includes science TEKS theme instructions
  - If cross-curricular is OFF, prompt produces math-only context
- Per-problem quick-action chips ("Word Problem" / "Bare Math") override the stored format for that single regeneration
- Free-text feedback can request cross-curricular connections even if the global toggle is OFF
- Uses same operand pre-generation pattern (if applicable for this TEKS)
- Returns single problem object matching existing schema
- Reuses existing system prompt builder but adapted for single problem instead of batch
- Keep it DRY — do not duplicate the system prompt logic

---

## EXEMPLAR BANK & FLYWHEEL MECHANISM

This is the reinforcement learning layer of the system. Every problem the teacher approves becomes a potential few-shot exemplar for future generations. The system doesn't learn by changing model weights — it learns by remembering what good output looked like last time and showing it to the LLM next time.

### ExemplarBank class (`js/exemplar-bank.js`, ~60 lines)

Create a lightweight wrapper around `localStorage` with these methods:

- `save(teks, problemSchema)` — saves a problem keyed by TEKS code. Storage key format: `exemplars:{teks}` (e.g., `exemplars:3.4A`). Each entry stores the full problem schema (displayText, expression, answer, operation, difficulty, narrative style) plus a `timestamp`. Every problem in the teacher bank is a favorite by definition — only ★ favorited problems get saved here.
- `getShared(teks, count = 5)` — returns up to `count` exemplars from the STAAR seed bank (`problem-exemplars.js`, Batches 1-3 already in the repo). This is the static Tier 1 shared pool. If fewer than `count` exist for this TEKS, return all available.
- `getTeacher(teks, count = 5)` — returns up to `count` exemplars from this teacher's `localStorage` bank. If fewer than `count` exist, return all available.
- `getExemplars(teks, count = 5)` — the main method other modules call. Returns a blended set: pulls from BOTH shared and teacher banks. If the teacher bank is empty (first week of use), falls back to all shared. As the teacher bank grows, the balance shifts toward personalization. Selection logic: pull up to 2 from shared (baseline quality) and up to 3 from teacher bank (personalization). If teacher bank has fewer than 3, fill remaining slots from shared. Total returned is always `min(count, totalAvailable)`. **5 exemplars per TEKS selected, or all available if fewer than 5.**

### Save trigger: ONLY favorited problems feed the flywheel

When the teacher clicks "APPROVE & NEXT" (or any approve action), the system checks:

1. Marks the problem as approved for this mission (always — goes into gameplay)
2. **IF the problem is ★ favorited**: calls `ExemplarBank.save(problem.teks, problemSchema)` — saves it to `localStorage`. This is the ONLY way problems enter the exemplar bank.
3. **IF the problem is NOT favorited**: nothing is saved. The problem goes to gameplay but does NOT feed the flywheel.

Approving alone does NOT save to the bank. Favoriting alone does NOT save to the bank (the teacher might favorite something she hasn't finished reviewing). The save ONLY happens when a problem is BOTH favorited AND approved. This keeps the exemplar bank lean and high-signal — every entry is a problem the teacher explicitly flagged as "I want more like this."

**Critical**: if the teacher EDITED the problem before favoriting and approving (via feedback chips, free text, or Replace with Custom), the EDITED version is what gets saved — not the original LLM output. This is the most valuable data the flywheel captures, because it encodes the delta between what the LLM thought was good and what the teacher actually wanted.

### ★ Favorite button — always visible

The ★ Favorite button lives in the **badges row** at the top of the right panel, alongside the TEKS badge, difficulty badge, and operation badge. It is ALWAYS visible and clickable regardless of problem state (pending, approved, regenerating). It uses `marginLeft: auto` to push itself to the right edge of the badges row, visually distinct from the metadata badges.

Behavior:
- Click "☆ Favorite" → toggles to "★ Favorited" (gold, #ffc800, background rgba(255,200,0,0.12))
- Click "★ Favorited" → toggles back to unfavorited
- In the left panel, favorited problems show a small gold ★ next to their confidence badge
- When viewing an approved+favorited problem, the confirmation box shows a subtle gold note: "★ Will inform future generations for {teks}"
- Unapproving a problem clears its favorited state (the problem may be regenerated, making the old favorite meaningless)

The teacher's typical flow: read the problem → think "this is exactly what I want" → click ★ → click APPROVE & NEXT. One extra click, right there in the flow, no backtracking required.

How favorites affect generation: When `getExemplars()` selects from the teacher bank, favorited problems are the ONLY problems in the teacher bank (since only favorites get saved). The shared STAAR seed bank provides baseline quality; the teacher bank provides personalization. Over time, this biases the LLM toward producing problems that match the teacher's preferred style, difficulty, and angle.

### The flywheel in practice

Week 1: System uses only STAAR seed exemplars. Maybe 7/10 problems are good on first generation. Teacher edits 3, approves all 10. She ★ favorites the 3-4 she liked best — the ones with exactly the right difficulty, angle, and style. Those 3-4 get saved to `localStorage`. Review takes 8-10 minutes.

Week 3: System pulls from BOTH STAAR seeds AND the teacher's 10-15 favorited problems. The LLM now has examples showing both "what TEA thinks a good 3.4A problem looks like" and "what THIS teacher thinks a good 3.4A problem looks like." Output is noticeably better. Maybe 9/10 are good. Review takes 4-5 minutes.

Week 8: Teacher bank has 40-60 favorited problems across commonly-used TEKS. For favorite standards, the system has 5-10 hand-picked exemplars to choose from. Every single one is a problem she explicitly said "more like this" about. The quality keeps improving with zero additional work — it's a byproduct of normal use. Review is a 2-minute scan-and-approve.

### Architecture note for future scaling

Right now `getShared()` and `getTeacher()` both read from local sources (a static JS file and `localStorage`). The abstraction is designed so that later, when scaling to multiple teachers, you swap `getShared()` to read from a cloud database and keep `getTeacher()` on `localStorage`. Nothing else in the system changes — the `getExemplars()` method still returns the same blended set. The flywheel just gets bigger.

---

## SCREEN FLOW STATE MACHINE

```
Setup Screen
  ↓ [teacher clicks "Generate Mission"]
  ↓
Loading State (existing "Generating..." indicator)
  ↓ [Groq API returns problems — system prompt includes up to 5 exemplars per TEKS from ExemplarBank]
  ↓
═══════════════════════════════════════
REVIEW SCREEN (this prompt)
  ↓ [validation runs instantly on all problems]
  ↓ [problems sorted by confidence ascending]
  ↓ [teacher reviews, approves, regenerates]
  ↓ [on APPROVE: if ★ favorited, save to ExemplarBank via localStorage. If not favorited, no save.]
  ↓ [★ Favorite button is always visible — teacher can star before or during review]
  ↓ [regenerated problems re-validate instantly]
  ↓ [teacher clicks "Launch Mission" when all approved]
═══════════════════════════════════════
  ↓
Gameplay (existing firewall sequence)
```

### Integration with app.js (MINIMAL changes):

1. After `generateMission()` resolves → instead of starting gameplay, call `TeacherReview.show(problems, grade, selectedTeks)`
2. TeacherReview module emits a callback when "Launch Mission" is clicked → app.js receives approved problems and starts gameplay via existing flow
3. teks-rules.json loaded once at app startup via `fetch('teks-rules.json')` and stored in a global

---

## ARCHITECTURE CONSTRAINTS

```
- teacher-review.js must be SELF-CONTAINED
  - Exports: { init, show, hide } interface
  - Does NOT reach into app.js internals except through clean callback API
  - Creates its own DOM elements inside a container div
  - Manages its own state (problems array, selectedIndex, approvedCount, isRegenerating)
  - **Un-approve behavior**: When viewing an already-approved problem, the feedback/regenerate/custom sections are HIDDEN. Instead, show a green confirmation box ("✓ This problem has been approved.") with an "↩ Undo Approval" button. Clicking it sets the problem status back to "pending", decrements the approved counter, and re-shows the feedback/regenerate controls. The "Launch Mission" button re-disables if not all problems are approved.
  
- validation-engine.js must be SELF-CONTAINED  
  - Exports: { validateProblem, validateAllProblems, computeCompositeScore }
  - Pure functions — no DOM manipulation, no side effects
  - Receives teks-rules object as parameter (does not load it itself)

- app.js changes must be MINIMAL
  - Two transition points only
  - One teks-rules.json fetch at startup

- CSS: ALL new classes use .im-review-* prefix
  - No inline styles except minor dynamic overrides (e.g., progress bar width)
  - Match existing app aesthetics:
    - Background: #0a0e17
    - Primary cyan: #00e5ff
    - Science orange: #ff8a00
    - Approved green: #00ff64
    - Warning gold: #ffc800
    - Flagged orange: #ffa000
    - Cross-curricular purple: #b388ff
    - Fonts: Orbitron (headings), Rajdhani (body), monospace (code/data)
    - Subtle glowing borders, near-transparent color washes

- No React, no framework, no build tools
- Must work from file:// protocol
- 1920×1080 target resolution (laptop → HDMI → classroom TV)
- Review screen does NOT need mobile responsiveness
```

---

## VANILLA JS TRANSLATION NOTES

The mockup uses React useState hooks. In vanilla JS, translate to:

```
State management pattern:
- State object in teacher-review.js module scope
- render() function rebuilds affected DOM sections when state changes
- Use event delegation on left panel (single click handler on container, check event.target)
- Use innerHTML for initial render, then targeted DOM updates for state changes
- Or use document.createElement for everything (your choice — whichever produces cleaner code)
```

Mockup's inline styles → CSS classes in styles.css. Small dynamic style changes use `element.style` or `classList.toggle`.

---

## SUCCESS CRITERIA

### Visual (8 checks)
1. Review screen appears after generation completes (setup screen hides, review screen shows)
2. Left panel shows all 13 problem rows with number badges, preview text, TEKS badges
3. Clicking a row loads its detail in the right panel
4. Math problems show full narrative, expression, and answer in right panel
5. Science problems show question, options list, correct answer highlighted green
6. Cross-curricular problems show purple badge with science TEKS label
7. Traffic light confidence badges appear on each row in left panel (green circle, yellow triangle, or red diamond)
8. Validation detail chips appear in right panel (Structure, Math, Content, TEKS, LLM Review)

### Validation (6 checks)
9. Layer 1: A problem missing `expectedAnswer` field triggers red "Structure: ❌" chip
10. Layer 2: A problem with expression "10 + 5" but expectedAnswer=20 triggers red "Math: ❌" chip
11. Layer 3: A Grade 1 problem with numbers > 120 triggers yellow "Content: ⚠️" chip
12. Layer 4: A problem tagged 3.4G (2-digit × 1-digit) but with expression "5 × 5" triggers red "TEKS: ❌" chip and red diamond (hard gate — operand1 has 1 digit, TEKS requires minDigits=2)
13. Composite score correctly computes and assigns green/yellow/red category
14. Problems are sorted by confidence ascending — red/flagged items appear first in left panel

### Approval & Un-approve (6 checks)
15. "APPROVE & NEXT" marks problem green (✓) and auto-advances to next unapproved
16. Progress bar fills proportionally, counter increments
17. "▶ Launch Mission" button activates (green, clickable) when ALL problems approved
18. Clicking "Launch Mission" hides review screen and starts gameplay via existing flow
19. Clicking an already-approved problem shows "↩ Undo Approval" button AND "☆ Favorite" button instead of feedback/regenerate controls
20. Clicking "↩ Undo Approval" sets problem back to pending, clears favorited state, decrements progress bar, hides Launch button if no longer all approved

### ★ Favorite & Flywheel (5 checks)
21. "☆ Favorite" button appears in the badges row on ALL problems (pending, approved, any state) — not hidden behind approval
22. Clicking "☆ Favorite" toggles it to "★ Favorited" (gold #ffc800). Clicking again toggles back. Works on pending AND approved problems.
23. Favorited problems show a gold ★ in the left panel next to their confidence badge
24. On approve: `ExemplarBank.save(teks, problemSchema)` is called ONLY IF the problem is ★ favorited. Non-favorited approvals do NOT save to the bank.
25. `ExemplarBank.getExemplars(teks, 5)` returns a blended set from shared seed bank + teacher localStorage (favorites only). Returns min(5, totalAvailable).

### Regeneration (5 checks)
26. "Regenerate (Random)" calls API and replaces problem with new one
27. Math quick-action chips (Easier/Harder/Word/Bare) populate feedback textarea; science quick-action chips (Simpler/Deeper/Distractors/Scenario) appear instead for science questions
28. "↻ Regenerate with Changes" button appears inside the gold feedback box when text is present, triggers regeneration
29. During regeneration: button shows "Regenerating..." and is disabled, problem row shows spinner
30. After regeneration: new problem validates instantly, status resets to pending

### Replace with Custom (3 checks)
31. "Replace with Custom" button expands inline form (only appears for math problems, not science)
32. Form has all fields: Question Text, Answer, TEKS dropdown, Difficulty dropdown, Operation dropdown, Science TEKS Connection, and ★ Favorite toggle
33. Saving replaces problem, marks it approved, shows "UPLOADED" badge. If ★ was toggled ON, problem is also marked favorited (triggering ExemplarBank save).

### Setup Screen Additions (3 checks)
34. Problem Format buttons (Pure Math / Mix / Word Problems) appear on the TEKS selection / setup screen alongside existing toggles
35. Format choice is passed to the Groq generation call — "Pure Math" produces bare expressions, "Word Problems" produces context-rich word problems
36. Per-problem "Word Problem" / "Bare Math" quick-action chips on the review screen override the global format for individual regenerations

### Review Screen: No Global Toggles (2 checks)
37. Review screen header contains ONLY: title, subtitle, progress bar, and launch button — no format selector, no cross-curricular toggle
38. Problems with cross-curricular tags still display purple ✦ badges on the review screen (display-only, not editable)

### Integration (3 checks)
39. Existing gameplay flow works normally after Launch Mission
40. No console errors during entire review → approve → launch flow
41. Review screen matches visual style of mockup (same colors, fonts, spacing, interactions)

---

## WHAT TO DEFER (NOT part of this prompt)

- Layer 5 LLM blind review (async Groq call) — comes in Phase 4 Prompt 4
- Llama Guard content flagging — comes in Phase 4 Prompt 4
- Self-consistency voting (5 samples) — comes in Phase 4 Prompt 4
- PDF upload integration — Phase 4 Prompt 6
- SVG diagram previews — Phase 4 Prompt 5
- Cloud-based ExemplarBank scaling (Tier 3) — post-MVP. For now, both shared and teacher banks use local sources (static JS file + localStorage). The ExemplarBank abstraction is designed so the implementation can be swapped later without changing any other module.

For now: Layer 5 chip shows "⏳ Pending" (gray). Llama Guard flag data from mockup sample is still shown if present in problem data (the `flagged`/`flagReason` fields), but no automatic Llama Guard API call happens yet.

---

## GIT INSTRUCTIONS

Commit directly to main:
```
git checkout main && git pull origin main
```

Commit message:
```
feat: add Teacher Review Screen with split panel layout, validation Layers 1-4 (TEKS as hard gate), approve/un-approve/regenerate workflow, ExemplarBank flywheel with ★ Favorite, Replace with Custom form, format selector + cross-curricular on setup screen
```

Push directly to main when done. Do NOT create a feature branch.

---

Think harder and thoroughly examine the existing codebase to ensure your approach fits seamlessly with established patterns and architecture.

Aim to make only minimal and necessary changes to existing files, avoiding any disruption to the existing design.

Whenever possible, take advantage of components, utilities, or logic that have already been implemented to maintain consistency, reduce duplication, and streamline integration with the current system.
