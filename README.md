# DiagnosTEKS

**A standards-aligned diagnostic assessment generator that structurally excludes the language model from every computation whose correctness matters.**

DiagnosTEKS generates elementary mathematics assessment items aligned to the Texas Essential Knowledge and Skills (TEKS), where each incorrect multiple-choice option is a *deterministically computed* simulation of a specific, documented student error. A teacher reviews and approves every item before any student sees it.

The system is a working prototype, not a product. This repository is published as a technical artifact in support of graduate study applications.

---

## Table of contents

- [The problem this addresses](#the-problem-this-addresses)
- [Core architectural principle](#core-architectural-principle)
- [System architecture](#system-architecture)
- [The generation pipeline](#the-generation-pipeline)
- [The deterministic distractor engine](#the-deterministic-distractor-engine)
- [The validation pipeline](#the-validation-pipeline)
- [What has actually been measured](#what-has-actually-been-measured)
- [Negative results](#negative-results)
- [Limitations and what this does not claim](#limitations-and-what-this-does-not-claim)
- [Technology stack](#technology-stack)
- [Repository layout](#repository-layout)
- [Running it](#running-it)
- [Data provenance](#data-provenance)
- [Project status](#project-status)
- [Author](#author)

---

## The problem this addresses

A diagnostic assessment item is not merely a question with one right answer. Its diagnostic power lives in the **wrong** answers. If a third grader computes `514 − 379` and selects `265`, that is not noise — it means the student subtracted the smaller digit from the larger one in every column instead of regrouping. A different wrong answer, `235`, means something else entirely: the student regrouped but failed to reduce the hundreds digit afterward. Each wrong answer, properly constructed, is a measurement of a specific procedural misconception.

Constructing such options by hand is expensive expert labor. The obvious move is to ask a large language model to do it. That move fails, and it fails in a specific and instructive way.

**Llama 3.3 70B reliably describes a digit-level arithmetic error correctly and then computes the wrong resulting value for it** — while producing a fluent, confident, entirely plausible-sounding justification for the wrong value. Told to apply a direction-reversal error to `416 − 229`, it narrates the error accurately and emits a number that does not follow from it. The rationale reads as authoritative. Nothing in the output signals that the arithmetic is fabricated.

This is the dangerous failure mode for assessment. A wrong answer that is *merely* wrong is a nuisance. A wrong answer that is wrong **and** carries a confident, specific, plausible explanation is worse than useless: it will be read by a teacher as a diagnosis and acted on. The explanation launders the error.

## Core architectural principle

> **The language model is never permitted to compute any value whose correctness matters. It computes nothing. It is given values and asked to write prose about them.**

This was arrived at empirically, by observing the failure above, not by design preference. The practical consequence is a strict division of labor:

| Responsibility | Owner | Why |
|---|---|---|
| Choosing operands | Deterministic JS | Must satisfy structural constraints (e.g. addition must require carrying) |
| Computing the correct answer | Deterministic JS | Arithmetic is not a language task |
| Computing each wrong answer | Deterministic JS | Each must provably follow from a named error algorithm |
| Writing the narrative / scenario | LLM | Genuinely a language task |
| Writing the rationale for each option | LLM | Paraphrasing a pre-built explanation of a pre-computed value |
| Verifying the whole item | Deterministic JS | Independent recomputation, hard gates |

The LLM contributes fluency. It contributes nothing else. Every number in a finished item was produced by JavaScript, and every number is independently recomputed before the item is shown to a teacher.

This generalizes beyond mathematics assessment. The transferable claim is architectural: **in a domain where a confidently-worded wrong answer causes more harm than an obvious one, the correct integration pattern is not a better prompt or a better model — it is to remove the model from the computation entirely and verify what remains.** The same structure applies anywhere a generative model's fluency would otherwise be mistaken for correctness.

## System architecture

```
 TEACHER (setup)
   │  grade level, TEKS codes, answer format
   ▼
┌─────────────────────────────────────────────────────────────┐
│ DETERMINISTIC PRE-COMPUTATION (JavaScript, no LLM)          │
│   generateOperandsForTeks()   → operands + STAAR metadata   │
│       · constraint retry loop (carrying / borrowing)        │
│   computeDistractorValues()   → wrong answers by algorithm  │
│   labelDistractorValues()     → {value, rationale, tag}     │
│   _computeDiagram()           → SVG descriptor (whitelist)  │
└─────────────────────────────────────────────────────────────┘
   │  pre-computed values injected into prompt
   ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPT ASSEMBLY                                             │
│   TEKS constraints (teks-rules.json, 217 entries)           │
│   + few-shot exemplars (5 per TEKS, diversity-selected)     │
│   + distractor pattern bank for the selected TEKS           │
│   + schema with computation-before-assertion field ordering │
│   primacy / recency positioning of the binding constraints  │
└─────────────────────────────────────────────────────────────┘
   │  single call, response_format: json_object
   ▼
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Worker proxy  →  Groq  →  llama-3.3-70b-versatile│
│   API key held as an encrypted Worker secret, never client  │
└─────────────────────────────────────────────────────────────┘
   │  JSON
   ▼
┌─────────────────────────────────────────────────────────────┐
│ VALIDATION ENGINE (validation-engine.js)                    │
│   Layer 1  Structural          HARD GATE                    │
│   Layer 2  Math verification   HARD GATE                    │
│   Layer 3  Content policy      soft flags                   │
│   Layer 4  TEKS alignment      HARD GATE                    │
│   → composite score → green / yellow / red                  │
└─────────────────────────────────────────────────────────────┘
   │  failures auto-regenerate (≤ 3 attempts)
   ▼
 TEACHER REVIEW SCREEN  →  approval required  →  GAMEPLAY
```

### The pre-generation paradigm

Every item for a lesson is generated, validated, and teacher-approved **before instruction begins** — typically five to fifteen minutes ahead. **Zero API calls occur while students are present.** No latency, no mid-lesson failure mode, no network dependency during instruction, and a human has seen every item. This is a deliberate constraint, not an optimization.

## The generation pipeline

1. **Operand generation.** `generateOperandsForTeks()` selects numbers satisfying the structural requirements of the downstream error algorithms. For TEKS 3.4A this includes a `do-while` retry loop (up to 20 attempts) guaranteeing that every addition requires carrying and every subtraction requires borrowing — released STAAR items test 3.4A exclusively with regrouping-required operands, and without that guarantee the borrow-error and regroup-failure algorithms produce nonsensical values (e.g. "forgot to borrow" on `73 − 33`).

2. **Fact-family deduplication.** `generateMissionOperands()` normalizes MULTIPLY and DIVIDE to sorted factor pairs under a shared key prefix, preventing near-duplicate items within one lesson.

3. **Distractor pre-computation.** Wrong answers are computed in JavaScript (below) and handed to the model as `{value, rationale, tag}` triples.

4. **Exemplar selection.** `selectExemplars()` draws five worked examples per selected TEKS from the seed bank, with diversity selection across operation, step count, and problem format.

5. **Prompt assembly.** TEKS constraints, exemplars, and the distractor pattern bank are composed with the binding constraints placed at the prompt's beginning and end, exploiting the documented U-shaped attention profile of transformer context windows.

6. **Constrained decoding.** A single call via the Worker with `response_format: {type: 'json_object'}`, `top_p: 0.9`, `max_tokens: 4096`. The schema orders fields so that the model must emit its reasoning *before* the value it asserts.

7. **Parsing and independent recomputation.** `_parseMathResponse()` recomputes the correct answer from the operands via `_computeAnswer()` and compares against the model's claim. Two independent paths must agree.

8. **Validation, then teacher review.** Items failing a hard gate auto-regenerate up to three times; survivors reach the review screen, where no lesson can launch until a human approves.

## The deterministic distractor engine

`computeDistractorValues()` in `js/cerebras-api.js` simulates student errors as executable algorithms operating on digits:

- `_regroupFailAdd()` — adds columns without propagating the carry
- `_directionReversalSub()` — subtracts the smaller digit from the larger in each column
- `_columnErrorAdd()` — locates the first carrying column (digit sum ≥ 10) and returns `correctAnswer − placeValue`, modelling a digit-sum miscalculation rather than a blind `±1`
- wrong-operation, neighbor-fact, and borrow-error variants

Each returns a value that provably follows from the named error. The model never selects a distractor value; it receives one and paraphrases the supplied rationale.

### The distractor pattern bank

`js/distractor-patterns.js` encodes an error taxonomy extracted from official TEA STAAR rationale documents, 2019–2025. **Counts verified by traversing the loaded object in this repository:**

| TEKS | Patterns | Worked examples |
|---|---|---|
| 3.4A — addition / subtraction to 1,000 | 7 | 26 |
| 3.4F — multiplication facts | 6 | 26 |
| 3.4J — equations / unknowns | 5 | 12 |
| 3.4D — multiplication with models | 4 | 9 |
| 3.4K — one- and two-step problems | 5 | 24 |
| **Total** | **27** | **97** |

> **Discrepancy note.** The project brief in this repository states *28 patterns / 98 examples* in several places. Direct traversal of the loaded `DISTRACTOR_PATTERNS` object yields **27 / 97**. The table above reflects the code. The brief is off by one and should be corrected.

Each pattern carries an `id`, `name`, observed `frequency`, an `appliesWhen` precondition, a generalized `constructionRule`, a `diagnosticValue` statement describing what selecting it reveals about the student, and worked examples traced to released items.

## The validation pipeline

Implemented in `js/validation-engine.js` (663 lines). Four layers; three are unconditional hard gates.

**Layer 1 — Structural (HARD GATE).** Required fields, types, option counts, schema conformance.

**Layer 2 — Mathematical verification (HARD GATE).** The answer is recomputed independently from the operands and from the rendered expression, and both must agree with the asserted answer. Multiple-choice items additionally face:

| Check | Severity | Purpose |
|---|---|---|
| Duplicate option values | **HARD GATE** | Two identical options make an item unanswerable |
| Rationale–value cross-check | **HARD GATE** | Every number in a rationale must be consistent with its option's value — this is the gate that catches fabricated arithmetic |
| Consecutive integers | warn | Options `6,7,8,9` carry no diagnostic signal |
| Narrow spread on division | warn | STAAR division distractors use wide, wrong-operation spreads |
| Rationale completeness | warn | Every distractor needs an explanation |

The two hard gates were originally warnings. They were **promoted to hard gates after the fabrication failure mode was identified** — the single most consequential change in the project's history.

**Layer 3 — Content policy (soft flags).** Word-boundary matching against a blocked-term list (weapons, violence, death), a yellow-tier list acceptable in context, negative-answer detection by grade, non-integer answers in contexts counting people or animals, and narrative/operation consistency checks against high-confidence phrase cues.

**Layer 4 — TEKS alignment (HARD GATE).** The item is checked against the constraint record for its standard in `teks-rules.json` — permitted operations, operand ranges, result bounds, allowed denominators, answer format, step count.

**Composite scoring** (`computeCompositeScore`) is deliberately not a weighted blend. Any hard-gate failure returns `0 / red` immediately; content flags return `0.70 / yellow`; a clean item returns `1.0 / green`. Aggregation was avoided precisely because a weighted average can let a real failure be masked by high scores elsewhere.

## What has actually been measured

This section separates measured results from design intent. Sample sizes are stated. Figures without clean provenance are excluded.

**Distractor alignment with state assessment methodology — 29 of 30 (96.7%).** An end-to-end production run of 10 generated problems × 3 distractors each. Twenty-nine of thirty distractors had a traceable computation path matching a documented, state-published error pattern. The single exception is same-factor multiplication (`4 × 4`), where `|a − b| = 0` collapses the neighbor-fact algorithm and the system falls back to a filler value.

**TEKS constraint coverage — 217 entries** across grades 1–5 (grade 1: 43, grade 2: 43, grade 3: 46, grade 4: 46, grade 5: 39), each with operation whitelists, operand constraints, result bounds, and answer-format rules.

**Exemplar seed bank — 136 worked items** (66 readiness-standard, 67 supporting-standard, 3 gap-fill), derived from released STAAR items.

**Diagram renderer — 8 types**, exercised across roughly 58 test cases including edge cases and cross-renderer regression.

### A note on quantification

A figure of "67%" circulates in this repository's own project brief as a fabrication rate. Tracing it reveals that **at least two distinct measurements were recorded under that same number at different times**, and its provenance cannot be reconstructed with confidence. It is therefore not used in this README and should be treated as unreliable wherever it appears in the brief. The qualitative failure mode it describes is real and well-documented; the specific percentage is not.

## Negative results

Reported because they constrain the design as much as the successes do.

**Layer 5 — LLM-as-judge: built, measured, removed.** A fifth validation layer was implemented, comprising self-consistency voting (five samples at non-zero temperature with agreement scoring) and a Chain-of-Verification blind review via a separate model call. Across all testing, **every math item scored "pass." Self-consistency returned 5/5 agreement on every item. The blind reviewer scored 0.82–0.98. It caught zero issues that Layers 1–4 had not already caught.** It cost 78 additional API calls per lesson and roughly 187 lines of wiring, and it made debugging materially harder. It was removed.

The honest reading is narrow and worth stating precisely: **this does not demonstrate that LLM-as-judge fails.** The judge was only ever run on items that two independent deterministic paths had already verified as correct. Agreeing with them is correct behavior, not failure. What the experiment establishes is that *this* monitor added no value *downstream of* sufficient deterministic verification — an argument about ordering and redundancy, not about monitoring in general. Testing it against known-corrupted items was never done.

**Out-of-rubric inputs scored low but were not rejected.** Science items evaluated by the math rubric scored 0.44–0.58 while every math item scored 0.64–0.98 — complete separation, a clean signal that the input was out of distribution. The system nonetheless abstained zero times in 94 logged completions, and composite aggregation passed those items at 0.78–0.82. The signal existed and the architecture discarded it. This is the clearest internal evidence for the hard-gate-over-weighted-score decision described above.

## Limitations and what this does not claim

**No formal pilot has been conducted.** The system has been run with real students in a live elementary classroom on a small number of occasions, with the author serving as the substitute teacher of record. **No measurement protocol was in place, no student data was collected, and there was no control condition.** Informal feedback was gathered from teachers. No claim of learning gain, efficacy, or diagnostic validity is made or supported.

**Diagnostic validity is unestablished.** That a distractor is constructed from a documented error pattern does not establish that selecting it reliably indicates the student holds that misconception. That requires response-data validation which has not been performed.

**Coverage is narrow.** The distractor pattern bank covers five grade-3 arithmetic standards. Seven Tier 2 standards fall back to generic place-value and wrong-operation algorithms without standard-specific taxonomy. Diagram generation is whitelisted to a single TEKS (3.4D), as that is the only standard where released STAAR items were verified to use visual models.

**Single-model, single-grade evidence.** All results come from one model (`llama-3.3-70b-versatile`) on grade-3 content. Nothing has been tested for cross-model or cross-grade generalization.

**Not accessibility-audited, not security-audited, not FERPA-reviewed.** No student data is collected, which sidesteps rather than solves the privacy question.

**No patent has been filed.** The architecture described here is unprotected and, by publication of this repository, publicly disclosed.

## Technology stack

| Layer | Choice | Rationale |
|---|---|---|
| Inference | Llama 3.3 70B Versatile via Groq | Throughput sufficient for pre-lesson batch generation |
| Decoding | `response_format: json_object` | Syntactic validity guaranteed; schema enforced client-side |
| Proxy | Cloudflare Worker | CORS termination; API key held as an encrypted Worker secret, never exposed to the client |
| Frontend | Vanilla JavaScript, HTML, CSS | No framework, no build step, no `npm install` — runs from `file://` by opening `index.html` |
| Animation | GSAP; PixiJS 7.4.2 | Transition and effect layer |
| Diagrams | Hand-rolled SVG via `createElementNS` | DOM API auto-escapes text content; no `innerHTML` interpolation anywhere in the render path |

The zero-build-step constraint is deliberate. The deployment target is a teacher's own laptop connected to a classroom display, where a Node toolchain cannot be assumed to exist or to be installable.

## Repository layout

```
index.html                         entry point — open directly, no server required
js/
  config.js                        Worker URL + model parameters
  cerebras-api.js                  generation pipeline, operand + distractor computation,
                                   prompt assembly, parsing, regeneration        (1,906 lines)
  validation-engine.js             four-layer validation, composite scoring        (663 lines)
  distractor-patterns.js           STAAR-derived error taxonomy, 27 patterns     (1,624 lines)
  teks-rules-data.js               217 TEKS constraint records                   (6,199 lines)
  Batch_1/2/3_*_exemplars.js       136 STAAR-derived few-shot exemplars
  teacher-review.js                review screen, approval gate, auto-regeneration
  app.js                           lesson flow and state
  diagramRenderer.js               8 SVG diagram types
  pattern-detector.js              student error-pattern detection
  firewall-sequence.js             transition engine
  animations.js / sound-manager.js / pixi-effect-manager.js
teks-rules.json                    TEKS constraint database (source of truth)
Iron_Man_STEM_Mission_Project_Brief_v4_1.md
                                   full design document and development history
```

> **Naming artifact.** `cerebras-api.js` and `CEREBRAS_CONFIG` are historical. The system migrated from Cerebras to Groq (commit `7be99b0`) and the identifiers were not renamed. The model actually invoked is `llama-3.3-70b-versatile` on Groq.

The student-facing layer is themed as a superhero narrative — an engagement wrapper built for a specific classroom, entirely separable from the assessment engine. The themed assets and transition code are not the contribution; `cerebras-api.js`, `distractor-patterns.js`, and `validation-engine.js` are.

## Running it

Generation requires a Groq API key and a deployed Cloudflare Worker proxy.

```bash
git clone https://github.com/Wittyusername12/diagnosteks.git
cd diagnosteks
# open index.html directly in a Chromium-based browser — no server, no build
```

To inspect the architecture without running inference, the three files worth reading are `js/cerebras-api.js`, `js/distractor-patterns.js`, and `js/validation-engine.js`. The pure functions are side-effect free and can be exercised in Node:

```bash
node -e "
const fs=require('fs'), vm=require('vm');
const s={window:{},console}; vm.createContext(s);
vm.runInContext(fs.readFileSync('js/distractor-patterns.js','utf8')
  + ';globalThis.P=DISTRACTOR_PATTERNS;', s);
console.log(Object.keys(s.P));
"
```

## Data provenance

- **Standards:** Texas Essential Knowledge and Skills, grades 1–5 mathematics (Texas Education Agency).
- **Error taxonomy:** extracted by hand from official TEA STAAR rationale documents and released test items, 2019–2025.
- **Exemplars:** derived from released STAAR items across the same period.

No student data of any kind is collected, transmitted, or stored by this system.

## Project status

Working prototype under active development. The generation pipeline, validation engine, distractor engine, teacher review screen, and diagram renderer are implemented and functional for Tier 1 grade-3 arithmetic standards. A student response system and the diagnostic reporting layer are designed but not built.

## Author

**Shane Waldrop** — M.S. candidate in Artificial Intelligence, Angelo State University. Former elementary mathematics and science teacher; currently substitute teaching, which is the context in which this system has been trialled.

Sole author. The system was built from scratch beginning August 2025, with no prior experience calling an API from code; the architecture, the error taxonomy extraction, and the decision to remove the model from computation are the author's own.

---

*This repository is published as a technical artifact supporting graduate applications. It is not a commercial product and carries no warranty.*
