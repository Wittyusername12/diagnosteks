/* =========================================
   CEREBRAS API CLIENT
   Iron Man STEM Mission Interface
   AI-powered problem generation via
   Cloudflare Worker → Groq inference
   ========================================= */

// Combine all exemplar batches into a single pool (loaded via script tags before this file)
const ALL_EXEMPLARS = [
  ...(typeof PROBLEM_EXEMPLARS !== 'undefined' ? PROBLEM_EXEMPLARS : []),
  ...(typeof BATCH2_SUPPORTING_EXEMPLARS !== 'undefined' ? BATCH2_SUPPORTING_EXEMPLARS : []),
  ...(typeof BATCH3_MISSING_TEKS_EXEMPLARS !== 'undefined' ? BATCH3_MISSING_TEKS_EXEMPLARS : [])
];
if (ALL_EXEMPLARS.length > 0) {
  console.log(`[CerebrasAPI] Exemplar bank loaded: ${ALL_EXEMPLARS.length} total exemplars`);
}

// ============================================================
// RANDOM OPERAND GENERATOR — Per-TEKS constraints
// JavaScript picks the numbers, LLM writes the narrative.
// This guarantees variety because Math.random() is truly random,
// unlike LLMs which converge on the same prototypical numbers.
// ============================================================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperandsForTeks(teks, problemIndex) {
  const tier = problemIndex < 3 ? 'easy' : problemIndex < 7 ? 'medium' : 'hard';

  switch (teks) {
    case '3.4A':
    case '3.5A': {
      // Add/subtract within 1,000.
      // CRITICAL: operands MUST require regrouping (carrying for ADD, borrowing
      // for SUBTRACT) so the distractor algorithms produce meaningful errors.
      // STAAR only tests 3.4A with regrouping-required numbers — every released
      // item (2019-2025) involves at least one column that carries or borrows.
      // Without regrouping, borrow-error and regroup-failure distractors are
      // nonsensical (e.g., "forgot to reduce tens after borrowing" when there's
      // no borrowing).
      const operation = Math.random() < 0.5 ? 'ADD' : 'SUBTRACT';

      // Helper: does this pair require regrouping?
      function needsRegrouping(op, x, y) {
        if (op === 'ADD') {
          // At least one column where digit sum >= 10 (carrying)
          return (x % 10) + (y % 10) >= 10 ||
                 (Math.floor(x / 10) % 10) + (Math.floor(y / 10) % 10) >= 10;
        } else {
          // At least one column where top digit < bottom digit (borrowing)
          return (x % 10) < (y % 10) ||
                 (Math.floor(x / 10) % 10) < (Math.floor(y / 10) % 10);
        }
      }

      let a, b;
      // Retry up to 20 times to find a pair that requires regrouping
      for (var attempt = 0; attempt < 20; attempt++) {
        if (tier === 'easy') {
          a = randomInt(20, 99);
          b = randomInt(10, Math.min(99, operation === 'ADD' ? 200 - a : a - 1));
        } else if (tier === 'medium') {
          a = randomInt(200, 599);
          b = randomInt(100, operation === 'ADD' ? Math.min(399, 999 - a) : a - 100);
        } else {
          a = randomInt(400, 950);
          b = randomInt(150, operation === 'ADD' ? Math.min(550, 999 - a) : a - 100);
        }
        if (operation === 'SUBTRACT' && b >= a) { var tmp = a; a = b; b = tmp; }
        if (needsRegrouping(operation, a, b)) break;
      }
      // Safety: if loop exhausted (extremely unlikely), force regrouping-friendly pair
      if (!needsRegrouping(operation, a, b)) {
        if (operation === 'ADD') { a = 375; b = 83; }   // 2024 STAAR Item 1 pattern
        else { a = 514; b = 379; }                        // 2021 STAAR Item 20 pattern
      }
      return { operation, operands: [a, b], teks };
    }

    case '3.4D': {
      // 3.4D: "determine the total number of objects when equally-sized groups
      // are combined or arranged in arrays up to 10 by 10" — MULTIPLY ONLY.
      // Both factors 1-10. teks-rules.json: operations: ["MULTIPLY"]
      // STAAR pattern: diagram shows ONE GROUP, narrative states NUMBER OF GROUPS,
      // student counts items in diagram to find group size, then multiplies.
      let a, b;
      if (tier === 'easy') {
        a = randomInt(2, 5);
        b = randomInt(2, 5);
      } else if (tier === 'medium') {
        a = randomInt(3, 8);
        b = randomInt(3, 8);
      } else {
        a = randomInt(6, 10);
        b = randomInt(6, 10);
      }
      // a = numGroups (stated in text), b = groupSize (shown in diagram)
      return { operation: 'MULTIPLY', operands: [a, b], teks, staarPattern: 'diagram-group', numGroups: a, diagramGroupSize: b };
    }

    case '3.4F': {
      // 3.4F: "recall facts to multiply up to 10 by 10 with automaticity
      // and recall the corresponding division facts" — MULTIPLY and DIVIDE.
      // Both factors 1-10. teks-rules.json: operations: ["MULTIPLY", "DIVIDE"]
      const operation = Math.random() < 0.5 ? 'MULTIPLY' : 'DIVIDE';
      let a, b;
      if (tier === 'easy') {
        a = randomInt(2, 5);
        b = randomInt(2, 5);
      } else if (tier === 'medium') {
        a = randomInt(3, 8);
        b = randomInt(3, 8);
      } else {
        a = randomInt(6, 10);
        b = randomInt(6, 10);
      }
      if (operation === 'DIVIDE') {
        return { operation, operands: [a * b, a], teks };
      }
      return { operation, operands: [a, b], teks };
    }

    case '3.4K':
    case '3.5B': {
      // Multiply/divide within 100
      const operation = Math.random() < 0.5 ? 'MULTIPLY' : 'DIVIDE';
      let a, b;
      if (tier === 'easy') {
        a = randomInt(2, 5);
        b = randomInt(2, 9);
      } else if (tier === 'medium') {
        a = randomInt(3, 9);
        b = randomInt(3, 9);
      } else {
        a = randomInt(5, 10);
        b = randomInt(5, 10);
      }
      if (a * b > 100) b = Math.floor(100 / a);
      if (b < 2) b = 2;
      if (operation === 'DIVIDE') {
        return { operation, operands: [a * b, a], teks };
      }
      return { operation, operands: [a, b], teks };
    }

    case '3.4G': {
      // 2-digit × 1-digit
      let a, b;
      if (tier === 'easy') {
        a = randomInt(10, 25);
        b = randomInt(2, 4);
      } else if (tier === 'medium') {
        a = randomInt(15, 50);
        b = randomInt(3, 6);
      } else {
        a = randomInt(30, 99);
        b = randomInt(4, 9);
      }
      return { operation: 'MULTIPLY', operands: [a, b], teks };
    }

    case '3.4H':
    case '3.4J':
    case '3.5D': {
      // Division (equal sharing, quotient from mult/div relationship)
      let divisor, quotient;
      if (tier === 'easy') {
        divisor = randomInt(2, 5);
        quotient = randomInt(2, 5);
      } else if (tier === 'medium') {
        divisor = randomInt(3, 8);
        quotient = randomInt(3, 8);
      } else {
        divisor = randomInt(4, 10);
        quotient = randomInt(4, 10);
      }
      return { operation: 'DIVIDE', operands: [divisor * quotient, divisor], teks };
    }

    case '3.6C': {
      // Area of rectangles (side × side)
      let a, b;
      if (tier === 'easy') {
        a = randomInt(2, 5);
        b = randomInt(2, 5);
      } else if (tier === 'medium') {
        a = randomInt(3, 8);
        b = randomInt(3, 8);
      } else {
        a = randomInt(5, 12);
        b = randomInt(5, 12);
      }
      return { operation: 'MULTIPLY', operands: [a, b], teks };
    }

    case '3.7B': {
      // Perimeter (add side lengths)
      let a, b;
      if (tier === 'easy') {
        a = randomInt(3, 15);
        b = randomInt(3, 15);
      } else if (tier === 'medium') {
        a = randomInt(10, 30);
        b = randomInt(10, 30);
      } else {
        a = randomInt(20, 50);
        b = randomInt(20, 50);
      }
      return { operation: 'ADD', operands: [a, b], teks };
    }

    default:
      return null; // LLM picks numbers for unhandled TEKS
  }
}

function generateMissionOperands(mathTeks, numProblems) {
  const assignments = [];
  const usedCombos = new Set();

  for (let i = 0; i < numProblems; i++) {
    const teksForThisProblem = mathTeks[i % mathTeks.length];
    let attempt = 0;
    let result = null;

    do {
      result = generateOperandsForTeks(teksForThisProblem, i);
      attempt++;
      if (result) {
        // Deduplicate by fact family, not just raw operands.
        // For MULTIPLY [3,5] and [5,3]: same fact → sorted key "3,5"
        // For DIVIDE [30,5] (=6) and [30,6] (=5): same fact → sorted factors "5,6"
        let comboKey;
        if (result.operation === 'MULTIPLY') {
          const sorted = [result.operands[0], result.operands[1]].sort((a, b) => a - b);
          comboKey = `MUL:${sorted.join(',')}`;
        } else if (result.operation === 'DIVIDE' && result.operands[1] !== 0) {
          const divisor = result.operands[1];
          const quotient = Math.round(result.operands[0] / divisor);
          const sorted = [divisor, quotient].sort((a, b) => a - b);
          comboKey = `MUL:${sorted.join(',')}`; // Same namespace as MULTIPLY — they share fact families
        } else {
          comboKey = `${result.operation}:${result.operands.join(',')}`;
        }
        if (!usedCombos.has(comboKey)) {
          usedCombos.add(comboKey);
          break;
        }
        result = null; // Retry for unique combo
      } else {
        break; // null = LLM picks, no retry needed
      }
    } while (attempt < 20);

    // Always include TEKS assignment, even for LLM-generated problems
    assignments.push(result || { operation: null, operands: null, teks: teksForThisProblem });
  }

  console.log('[CerebrasAPI] Pre-generated operands:', assignments.map(a =>
    a.operation ? `${a.operation} ${a.operands.join(',')}` : `LLM-generated (${a.teks})`
  ));

  return assignments;
}

// ============================================================
// PRE-COMPUTED DISTRACTOR VALUES — JavaScript picks values,
// LLM writes rationales. Digit-by-digit algorithms verified
// against real STAAR rationale documents (2019-2025).
// Pure function, no side effects.
// ============================================================

// Shared column-arithmetic helpers used by compute and label functions
function _regroupFailAdd(a, b) {
  let result = 0, place = 1, tmpA = a, tmpB = b;
  while (tmpA > 0 || tmpB > 0) {
    result += ((tmpA % 10) + (tmpB % 10)) % 10 * place;
    tmpA = Math.floor(tmpA / 10);
    tmpB = Math.floor(tmpB / 10);
    place *= 10;
  }
  return result;
}

function _directionReversalSub(a, b) {
  let result = 0, place = 1, tmpA = a, tmpB = b;
  const len = Math.max(String(a).length, String(b).length);
  for (let i = 0; i < len; i++) {
    result += Math.abs((tmpA % 10) - (tmpB % 10)) * place;
    tmpA = Math.floor(tmpA / 10);
    tmpB = Math.floor(tmpB / 10);
    place *= 10;
  }
  return result;
}

function computeDistractorValues(operation, op1, op2, correctAnswer) {
  const candidates = [];

  switch (operation) {
    case 'ADD': {
      // (a) Wrong operation — subtracted instead of adding
      candidates.push(Math.abs(op1 - op2));
      // (b) Regrouping failure — add each column mod 10, no carrying
      //     Verified: 438+375→703 (STAAR 2019 #15 Option B)
      const noCarry = _regroupFailAdd(op1, op2);
      // If no carrying needed, regrouping failure = correct; use fallback
      if (noCarry !== correctAnswer && noCarry > 0) {
        candidates.push(noCarry);
      } else {
        candidates.push(correctAnswer - 1);
      }
      // (c) Ones column error
      candidates.push(correctAnswer + 1);
      break;
    }
    case 'SUBTRACT': {
      // (a) Wrong operation — added instead of subtracting
      //     Verified: 375-83→458 (STAAR 2024 #1 Option C)
      candidates.push(op1 + op2);
      // (b) Direction reversal — |top - bottom| per column, no regrouping
      //     Verified: 514-379→265 (STAAR 2021 #20 Option H)
      const dirRev = _directionReversalSub(op1, op2);
      candidates.push(dirRev || (correctAnswer + 5));
      // (c) Borrow error — forgot to reduce tens after borrowing
      candidates.push(correctAnswer + 10);
      break;
    }
    case 'MULTIPLY': {
      // (a) Wrong operation — added
      candidates.push(op1 + op2);
      // (b) Wrong operation — subtracted
      candidates.push(Math.abs(op1 - op2));
      // (c) Neighbor fact
      let neighbor = op1 * (op2 + 1);
      if (neighbor === correctAnswer) neighbor = op1 * (op2 - 1);
      candidates.push(neighbor);
      break;
    }
    case 'DIVIDE': {
      // (a) Wrong operation — multiplied
      candidates.push(op1 * op2);
      // (b) Wrong operation — subtracted
      candidates.push(Math.abs(op1 - op2));
      // (c) Wrong operation — added
      candidates.push(op1 + op2);
      break;
    }
    default:
      return null;
  }

  // Filter: remove values equal to correctAnswer or <= 0, then deduplicate
  let filtered = candidates.filter(v => v !== correctAnswer && v > 0);
  filtered = [...new Set(filtered)];

  // Fill if fewer than 3 unique values remain
  const fillers = [correctAnswer + 10, correctAnswer - 10, correctAnswer + 100];
  for (const f of fillers) {
    if (filtered.length >= 3) break;
    if (f > 0 && f !== correctAnswer && !filtered.includes(f)) {
      filtered.push(f);
    }
  }

  // Return exactly 3, sorted ascending
  filtered = filtered.slice(0, 3).sort((a, b) => a - b);
  return filtered.length === 3 ? filtered : null;
}

// ============================================================
// DISTRACTOR LABELING — reverse-identifies which algorithm
// produced each value and attaches a STAAR-language hint.
// ============================================================

function labelDistractorValues(operation, op1, op2, correctAnswer, values) {
  return values.map(v => {
    switch (operation) {
      case 'ADD':
        if (v === Math.abs(op1 - op2))
          return { value: v, label: 'wrong-operation', hint: 'The student subtracted instead of adding.' };
        if (v === _regroupFailAdd(op1, op2) && v !== correctAnswer)
          return { value: v, label: 'regrouping-failure', hint: 'The student added each column without regrouping (carrying).' };
        if (v === correctAnswer + 1 || v === correctAnswer - 1)
          return { value: v, label: 'ones-error', hint: 'The student made an error in the ones column.' };
        break;
      case 'SUBTRACT':
        if (v === op1 + op2)
          return { value: v, label: 'wrong-operation', hint: 'The student added instead of subtracting.' };
        if (v === _directionReversalSub(op1, op2) && v !== correctAnswer)
          return { value: v, label: 'direction-reversal', hint: 'The student subtracted the smaller digit from the larger in each column instead of regrouping.' };
        if (v === correctAnswer + 10)
          return { value: v, label: 'borrow-error', hint: 'The student forgot to reduce the tens digit after borrowing.' };
        break;
      case 'MULTIPLY':
        if (v === op1 + op2)
          return { value: v, label: 'wrong-operation', hint: 'The student added instead of multiplying.' };
        if (v === Math.abs(op1 - op2))
          return { value: v, label: 'wrong-operation', hint: 'The student subtracted instead of multiplying.' };
        if (v === op1 * (op2 + 1) || v === op1 * (op2 - 1))
          return { value: v, label: 'neighbor-fact', hint: 'The student recalled a nearby multiplication fact.' };
        break;
      case 'DIVIDE':
        if (v === op1 * op2)
          return { value: v, label: 'wrong-operation', hint: 'The student multiplied instead of dividing.' };
        if (v === Math.abs(op1 - op2))
          return { value: v, label: 'wrong-operation', hint: 'The student subtracted instead of dividing.' };
        if (v === op1 + op2)
          return { value: v, label: 'wrong-operation', hint: 'The student added instead of dividing.' };
        break;
    }
    return { value: v, label: 'nearby-value', hint: 'The student made a computational error.' };
  });
}

class CerebrasAPI {
  constructor(config) {
    this.config = config || window.CEREBRAS_CONFIG || {};
    console.log('[CerebrasAPI] Initialized');
  }

  /* =========================================
     PUBLIC API
     ========================================= */

  /**
   * Generate all problems for a complete mission.
   * Returns object matching TEST_PROBLEMS shape:
   *   { math: [...], science: [...] }
   *
   * @param {number} gradeLevel - 1 through 5
   * @param {string[]} mathTeksCodes - e.g. ['3.4A', '3.4F', '3.4J']
   * @param {string[]} scienceTeksCodes - e.g. ['3.6B', '3.13B']
   * @param {object} [options] - Additional options
   * @param {boolean} [options.crossCurricular=false] - Include science themes in math
   * @param {function} [options.onMathComplete] - Callback when math generation finishes
   * @returns {Promise<{math: Array, science: Array}>}
   */
  async generateMission(gradeLevel, mathTeksCodes, scienceTeksCodes, options = {}) {
    console.log(`[CerebrasAPI] Generating mission for grade ${gradeLevel}`);
    console.log(`[CerebrasAPI]   Math TEKS: ${mathTeksCodes.join(', ')}`);
    console.log(`[CerebrasAPI]   Science TEKS: ${scienceTeksCodes.join(', ')}`);
    console.log(`[CerebrasAPI]   Cross-curricular: ${!!options.crossCurricular}`);

    // Generate math first (sequential for progress reporting)
    const math = await this.generateMathProblems(
      gradeLevel, mathTeksCodes, scienceTeksCodes, options.crossCurricular, options.format, options.answerFormat
    );

    if (options.onMathComplete) {
      options.onMathComplete(math);
    }

    const science = await this.generateScienceQuestions(gradeLevel, scienceTeksCodes);

    console.log(`[CerebrasAPI] Mission generated: ${math.length} math, ${science.length} science`);
    return { math, science };
  }

  /**
   * Generate 10 math problems (one per firewall).
   * LLM provides: narrative, operation, operands, teks.
   * JS computes: correctAnswer, expression, id.
   *
   * @param {number} gradeLevel
   * @param {string[]} teksCodes - Math TEKS codes
   * @param {string[]} [scienceTeksCodes] - Science TEKS for cross-curricular
   * @param {boolean} [crossCurricular] - Enable cross-curricular theming
   * @returns {Promise<Array>}
   */
  async generateMathProblems(gradeLevel, teksCodes, scienceTeksCodes, crossCurricular, format, answerFormat) {
    const teksDescriptions = this._getTeksDescriptions(gradeLevel, 'math', teksCodes);
    let scienceTeksDescriptions = null;
    if (crossCurricular && scienceTeksCodes && scienceTeksCodes.length > 0) {
      scienceTeksDescriptions = this._getTeksDescriptions(gradeLevel, 'science', scienceTeksCodes);
    }

    // Select relevant few-shot exemplars from the combined bank
    let exemplars = [];
    if (typeof selectExemplars === 'function' && ALL_EXEMPLARS.length > 0) {
      exemplars = selectExemplars(teksCodes, ALL_EXEMPLARS);
      console.log(`[CerebrasAPI] Selected ${exemplars.length} exemplars for TEKS: ${teksCodes.join(', ')}`);
    }

    // Pre-generate random operands — JS picks numbers, LLM writes narrative
    const count = this.config.mathProblemsPerMission || 10;
    const operandAssignments = generateMissionOperands(teksCodes, count);

    const messages = [
      { role: 'system', content: this._buildMathSystemPrompt(gradeLevel, teksDescriptions, exemplars, crossCurricular, scienceTeksDescriptions, operandAssignments, format, answerFormat, teksCodes) },
      { role: 'user', content: `Generate ${count} math problems for grade ${gradeLevel} using TEKS: ${teksCodes.join(', ')}. For pre-selected problems, use the EXACT numbers provided. Output operation and operands so JavaScript can independently calculate each answer.${(answerFormat === 'mc' || answerFormat === 'mix') && typeof DISTRACTOR_RULES_REMINDER !== 'undefined' ? '\n\n' + DISTRACTOR_RULES_REMINDER : ''}` }
    ];

    const raw = await this._callWorker(messages, 0.7);
    const problems = this._parseMathResponse(raw, operandAssignments);

    // Deterministic diagram assignment — JS computes, same as operands and distractors
    problems.forEach((p) => {
      var computed = this._computeDiagram(p.teks, p.operation, p.operands, p.answerType, p.narrative);
      if (computed) {
        p.diagram = computed;
      }
    });

    return problems;
  }

  /**
   * Generate 3 science questions (for Fury interruptions after firewalls 3, 6, 9).
   * LLM provides: question, options, correctAnswer, teks.
   * Science answers ARE from the LLM (the one exception to the "JS computes" rule).
   *
   * @param {number} gradeLevel
   * @param {string[]} teksCodes
   * @returns {Promise<Array>}
   */
  async generateScienceQuestions(gradeLevel, teksCodes) {
    const teksDescriptions = this._getTeksDescriptions(gradeLevel, 'science', teksCodes);

    const messages = [
      { role: 'system', content: this._buildScienceSystemPrompt(gradeLevel, teksDescriptions) },
      { role: 'user', content: `Generate 3 science questions for grade ${gradeLevel} using TEKS: ${teksCodes.join(', ')}` }
    ];

    const raw = await this._callWorker(messages, 0.2);
    return this._parseScienceResponse(raw);
  }

  /**
   * Public wrapper for answer computation.
   * @param {string} operation - e.g. 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'
   * @param {number[]} operands - [a, b]
   * @returns {number}
   */
  calculateAnswer(operation, operands) {
    return this._computeAnswer(operation, operands);
  }

  /**
   * Validate a problem object against the expected schema.
   * @param {object} problem
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateProblemSchema(problem) {
    const errors = [];
    const required = ['id', 'firewallNumber', 'narrative', 'expression', 'correctAnswer', 'operation', 'operands', 'teks'];

    for (const field of required) {
      if (problem[field] === undefined || problem[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    const validOps = [
      'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE',
      'FRACTION_ADD', 'FRACTION_SUBTRACT', 'FRACTION_MULTIPLY',
      'DECIMAL_ADD', 'DECIMAL_SUBTRACT', 'DECIMAL_MULTIPLY',
      'COMPARE', 'IDENTIFY', 'MEASURE', 'DATA_READ', 'CONCEPTUAL'
    ];
    if (problem.operation && !validOps.includes(problem.operation)) {
      errors.push(`Invalid operation: ${problem.operation}`);
    }
    if (problem.operands && !Array.isArray(problem.operands)) {
      errors.push('operands must be an array');
    }

    return { valid: errors.length === 0, errors };
  }

  /* =========================================
     PROMPT BUILDERS
     ========================================= */

  _buildMathSystemPrompt(gradeLevel, teksDescriptions, exemplars, crossCurricular, scienceTeksDescriptions, operandAssignments = [], format = 'mix', answerFormat = 'open', teksCodes = []) {
    const count = this.config.mathProblemsPerMission || 10;

    // Grade-specific number ranges
    const numberRanges = {
      1: 'Addition/Subtraction: within 20. No multiplication or division.',
      2: 'Addition/Subtraction: within 1,000. No multiplication or division.',
      3: 'Addition/Subtraction: within 1,000. Multiplication: facts to 10\u00D710. Division: related division facts.',
      4: 'Addition/Subtraction: within 10,000. Multiplication: 4-digit \u00D7 1-digit, 2-digit \u00D7 2-digit. Division: 4-digit \u00F7 1-digit.',
      5: 'Decimals to thousandths. Multiplication: decimals to hundredths. Division: decimals, fractions.'
    };

    // === BLOCK 1: ROLE AND RULES ===
    let prompt = `You are a TEKS-aligned math problem generator for Texas elementary classrooms, themed around Iron Man and the Avengers. You generate structured JSON problem data. You do NOT calculate answers \u2014 you provide the operation and operands, and separate software calculates the answer independently.

All generated problems should use real-world contexts when appropriate, be solvable through clear mathematical reasoning, and be expressed in grade-appropriate language.

Respond with ONLY a JSON object. No markdown, no explanation, no preamble.

REQUIRED JSON STRUCTURE:
{"problems": [
  {
    "narrative": "Tony Stark is upgrading 4 suits of armor in his lab. Each suit needs 9 new power cells installed. How many power cells does Tony need to order in total?",
    "operation": "MULTIPLY",
    "operands": [4, 9],
    "teks": "3.4F",
    "primaryType": "computation",
    "difficulty": "easy",
    "diagnosticFor": [],
    "answerType": "integer",
    "scienceTeksConnection": null,
    "scienceLabel": null,
    "diagram": null
  },
  {
    "narrative": "Jarvis arranged Iron Man's spare arc reactors in 3 rows with 4 in each row on a display shelf. How many arc reactors are on the display shelf in total?",
    "operation": "MULTIPLY",
    "operands": [3, 4],
    "teks": "3.4D",
    "primaryType": "computation",
    "difficulty": "easy",
    "diagnosticFor": [],
    "answerType": "integer",
    "scienceTeksConnection": null,
    "scienceLabel": null,
    "diagram": {"type": "array", "params": {"rows": 3, "columns": 4, "title": "3 × 4", "showTotal": true}}
  }
]}

IMPORTANT: The "narrative" field IS the word problem the student sees. It must be a complete 2-4 sentence word problem (30-80 words) where the student figures out the operation from context. Do NOT include the operation or a bare equation in the narrative. The game engine builds the expression separately from the operation and operands you provide.

Generate exactly ${count} problems.

THE TEACHER SELECTED THESE MATH TEKS:
${teksDescriptions}
Every problem MUST target one of these standards. Distribute problems across the selected TEKS \u2014 do not put all problems on one standard.

GRADE ${gradeLevel} NUMBER RANGES:
${numberRanges[gradeLevel] || numberRanges[3]}

VALID OPERATION CODES:
- ADD, SUBTRACT, MULTIPLY, DIVIDE \u2014 standard integer arithmetic
- FRACTION_ADD, FRACTION_SUBTRACT, FRACTION_MULTIPLY \u2014 fraction operations (use fraction objects: {"numerator": 1, "denominator": 4})
- DECIMAL_ADD, DECIMAL_SUBTRACT, DECIMAL_MULTIPLY \u2014 decimal operations
- COMPARE \u2014 provide two operands, answerType = "comparison"
- IDENTIFY, CONCEPTUAL \u2014 provide "options" array with 4 choices [{"letter": "A", "text": "..."}, ...] and "correctAnswer" as the letter, answerType = "multipleChoice"

ANSWER TYPES:
- For computation (ADD, SUBTRACT, MULTIPLY, DIVIDE): operands as positive integers, answerType = "integer"
- For FRACTION operations (FRACTION_ADD, FRACTION_SUBTRACT, FRACTION_MULTIPLY): operands as fraction objects {"numerator": N, "denominator": D}, answerType = "fraction"
- For COMPARE: two operands, answerType = "comparison", do NOT include correctAnswer
- For IDENTIFY, CONCEPTUAL: "options" array and "correctAnswer" letter, answerType = "multipleChoice"

COMPARE NARRATIVE REQUIREMENTS:
For COMPARE problems: the narrative MUST clearly describe two quantities being compared. Example: "Jarvis scanned 4,567 data packets from the east server and 4,576 from the west server. Which server processed more packets? Compare the numbers." The expression should be formatted as "operand1 ? operand2" where ? is what the student determines. Do NOT use incomplete narratives like "Tony Stark's lab has" \u2014 always explain WHAT is being compared and WHY.

CRITICAL RULES:
1. Do NOT include any answer or correctAnswer field for computation problems. The game engine computes answers independently.
2. For computation: operands must produce a POSITIVE WHOLE NUMBER result.
3. For SUBTRACT: first operand must be larger than second.
4. For DIVIDE: first operand must be evenly divisible by second.
5. Mix operations across the ${count} problems when the selected TEKS allow it.
6. Use ONLY the TEKS codes listed above.
7. Every narrative MUST be a complete word problem (2-4 sentences) that describes a specific scenario and asks a clear question. The student must determine the operation from context — never state the operation or show a bare equation. BAD: "Tony Stark's lab has 4 × 9 power cells." GOOD: "Tony Stark needs to combine two containers of arc reactor fluid in his lab. One container holds 375 milliliters and the other holds 248 milliliters. How much fluid does he have in total?"
8. Every problem MUST use unique number combinations. Do not reuse the same operands across any two problems in the set. If problem 3 uses 945 and 378, no other problem may use those same numbers.
9. Generate CREATIVE and DIVERSE scenarios. Do NOT use common textbook examples. Do NOT reuse any specific numbers that appear in the exemplars above. Vary your character names, settings, and number ranges widely. If you've used Stark Tower as a setting, try the Helicarrier or Wakanda next. If you've used 945-378 in one problem, use completely different numbers in the next.

DIFFICULTY PROGRESSION:
- Problems 1-3: easier (simpler numbers, one-step). Set "difficulty": "easy"
- Problems 4-7: medium difficulty. Set "difficulty": "medium"
- Problems 8-${count}: harder (larger numbers, multi-step, or trickier concepts). Set "difficulty": "hard"

WORD PROBLEM QUALITY:
Each problem's "narrative" must be a complete Iron Man themed WORD PROBLEM (2-4 sentences, 30-80 words). The word problem must describe a real scenario where the student figures out what operation to use from context. Do NOT include the operation or expression in the narrative — the student must determine that themselves. Use characters: Tony Stark, Jarvis, Pepper Potts, the Avengers. Settings: Stark Industries lab, the Helicarrier, Avengers Tower. Keep word problems age-appropriate and engaging for elementary students.
BAD: "Tony has 4 times 9 power cells. 4 × 9 = ?"
GOOD: "Tony Stark is upgrading 4 suits of armor in his lab. Each suit needs 9 new power cells installed. How many power cells does Tony need to order in total?"

DIAGNOSTIC PROBLEMS:
Design at least 2 problems to reveal common student errors. Examples: carrying/borrowing across zeros, reversible digit answers, fraction misconceptions. Set "diagnosticFor" to an array describing the misconception (e.g., ["borrowing-across-zero"]).

DIAGRAM FIELD:
Every problem MUST include a "diagram" field. Set it to null for problems that don't benefit from visual representation (most arithmetic, pure computation). Include a diagram object ONLY when a visual model would significantly help students understand the problem.

WHEN TO INCLUDE A DIAGRAM:
- Word problems about equal groups, rows/columns, or arrays → use "array"
- Problems comparing quantities across named categories → use "barGraph"
- Problems about fractions (representing, comparing, equivalent) → use "fractionBar" or "fractionCircle"
- Multi-step word problems with part-whole relationships → use "stripDiagram"
- Multi-digit multiplication problems → use "areaModel"
- Data reading problems with frequency counts → use "dotPlot"
- Problems about placing values on a line, rounding, or ordering → use "numberLine"
- Simple computation without context (e.g., "7 × 8 = ?") → null
- DEFAULT: When in doubt, set diagram to null. Only include a diagram when it genuinely helps.

DIAGRAM TYPES (use ONLY these exact type strings and parameter names):

"numberLine": Number line with markers.
  params: { min: number, max: number, step: number, markers: [number], title: string|null }
  Example: { "type": "numberLine", "params": { "min": 0, "max": 100, "step": 10, "markers": [37], "title": "Round to the Nearest 10" } }

"barGraph": Vertical bar chart comparing categories.
  params: { categories: [string], values: [number], title: string|null, xAxisLabel: string|null, yAxisLabel: string|null, showValues: true }
  RULE: categories.length MUST equal values.length. Max 8 categories.
  Example: { "type": "barGraph", "params": { "categories": ["Apples","Oranges","Bananas"], "values": [12,8,15], "title": "Fruit Sold", "showValues": true } }

"fractionBar": Horizontal bar divided into equal parts with some shaded.
  params: { numerator: number, denominator: number, title: string|null, showLabel: true }
  RULE: denominator must be 2, 3, 4, 6, or 8 for Grade 3. numerator must be 0 to denominator.
  Example: { "type": "fractionBar", "params": { "numerator": 3, "denominator": 4, "title": "Three Fourths", "showLabel": true } }

"fractionCircle": Circle divided into equal sectors with some filled.
  params: { numerator: number, denominator: number, title: string|null, showLabel: true }
  RULE: Same constraints as fractionBar.
  Example: { "type": "fractionCircle", "params": { "numerator": 2, "denominator": 3, "showLabel": true } }

"array": Grid of dots in rows × columns for multiplication.
  params: { rows: number, columns: number, title: string|null, showTotal: true }
  RULE: rows and columns must be 1-10.
  Example: { "type": "array", "params": { "rows": 3, "columns": 4, "title": "3 × 4", "showTotal": true } }

"stripDiagram": Labeled sections showing part-whole relationships.
  params: { sections: [{value: number|null, label: string}], total: {value: number, label: string}|null, title: string|null, equalSections: boolean, highlightIndex: number|null }
  RULE: At least one section must have a non-null value. Use null value for the unknown quantity.
  Example: { "type": "stripDiagram", "params": { "sections": [{"value":45,"label":"45"},{"value":null,"label":"?"}], "total": {"value":78,"label":"78"}, "title": "45 + ? = 78", "highlightIndex": 1 } }

"areaModel": Rectangle partitioned into sub-rectangles showing partial products.
  params: { factors: [number, number], title: string|null, showPartialProducts: true, showTotal: true }
  RULE: Both factors must be positive integers.
  Example: { "type": "areaModel", "params": { "factors": [23, 15], "title": "23 × 15", "showPartialProducts": true, "showTotal": true } }

"dotPlot": Number line with stacked dots above data values.
  params: { data: [number], title: string|null, xAxisLabel: string|null }
  RULE: data must have at least 3 values. Values should be whole numbers for K-5.
  Example: { "type": "dotPlot", "params": { "data": [2,3,3,4,4,4,5,5,6], "title": "Test Scores", "xAxisLabel": "Score" } }`;

    // === BLOCK 1B: UNIVERSAL DISTRACTOR RULES (primacy zone — only when MC active) ===
    if ((answerFormat === 'mc' || answerFormat === 'mix') && typeof UNIVERSAL_DISTRACTOR_RULES !== 'undefined') {
      prompt += '\n\n' + UNIVERSAL_DISTRACTOR_RULES;
    }

    // === BLOCK 2: FEW-SHOT EXEMPLARS ===
    if (exemplars && exemplars.length > 0) {
      prompt += `

FEW-SHOT EXEMPLARS:
Study these examples carefully. They show the quality standard you must match \u2014 the difficulty level, narrative style, and distractor reasoning. Generate ORIGINAL problems inspired by these patterns. Do NOT copy or closely paraphrase any example.

${JSON.stringify(exemplars, null, 2)}`;
    }

    // === BLOCK 2B: TEKS-SPECIFIC STAAR PATTERNS ===
    if (teksCodes && teksCodes.includes('3.4K')) {
      prompt += `

STAAR 3.4K TWO-STEP NARRATIVE PATTERN:
TEKS 3.4K tests "one-step AND two-step problems." For 3.4K WORD PROBLEMS (not bare math), create TWO-STEP scenarios where one operand is the result of combining smaller quantities in the story:
- For MULTIPLY [a, b]: Decompose one factor into a sum within the narrative. Example for operands [6, 8]: "Tony bought 4 boxes of red repulsor crystals and 2 boxes of blue. Each box has 8 crystals. How many crystals did Tony buy in total?" (Student adds 4+2=6, then multiplies 6×8=48). The JSON operands stay [6, 8].
- For DIVIDE [dividend, divisor]: Present the dividend as the result of combining groups. Example for operands [30, 6]: "The Avengers have 3 teams with 10 agents each. They need to split all agents into 6 equal squads. How many agents per squad?" (Student multiplies 3×10=30, then divides 30÷6=5). The JSON operands stay [30, 6].
The two-step complexity is in the NARRATIVE only — JSON operands and operation are unchanged. Do NOT create two-step narratives for bare math problems.`;
    }

    // === BLOCK 3: CROSS-CURRICULAR + FINAL INSTRUCTIONS ===
    if (crossCurricular && scienceTeksDescriptions) {
      prompt += `

CROSS-CURRICULAR MODE IS ON. The teacher has selected these science TEKS:
${scienceTeksDescriptions}
You MUST weave science concepts from these TEKS into the word problem narratives for AT LEAST 7 of the ${count} math problems. The math operation and difficulty must match the math TEKS exactly \u2014 only the word problem CONTEXT should reference science concepts. For example, if the science TEKS is about forces and motion, set the word problem in a scenario involving pushing, pulling, or measuring speed \u2014 but the actual math question still tests the math TEKS. Do NOT just add a science word as decoration. The science context should be meaningful enough that a student encounters the science concept while solving the math problem. Problems that include science context MUST set "scienceTeksConnection" to the relevant science TEKS code AND set "scienceLabel" to a SHORT (2-5 word) human-readable description of the science concept (e.g., "Forces & Motion", "Weather & Precipitation", "Weathering & Erosion", "Energy Types", "Food Chains", "Solids, Liquids & Gases"). Do NOT repeat the TEKS code as the label. Problems without science context should set "scienceTeksConnection" to null and "scienceLabel" to null.

IMPORTANT: The science context must be NATURALLY woven into the word problem scenario through vocabulary and setting. Do NOT add any sentence that explicitly explains the science connection. Do NOT write phrases like "This situation involves..." or "This demonstrates..." or "This is related to..." or "This is an example of..." — the science should be IMPLICIT in the scenario, not stated directly. The student is solving a MATH problem. The science context is background flavor, not something the student needs to think about.`;
    }

    // === BLOCK 4: FORMAT INSTRUCTION ===
    if (format === 'pure') {
      prompt += `

PROBLEM FORMAT: PURE MATH
Generate bare arithmetic expressions only — no word problem context. Set each narrative to a minimal description like "Solve: [expression]" or "Calculate: [expression]". Keep narratives under 10 words.`;
    } else if (format === 'word') {
      prompt += `

PROBLEM FORMAT: WORD PROBLEMS
Every problem MUST be a rich real-world word problem with full narrative context (2-4 sentences, 30-80 words). No bare arithmetic expressions.`;
    } else {
      // 'mix' format — explicit integer counts for word vs bare
      const mixOptions = [
        { word: Math.ceil(count * 0.6), bare: Math.floor(count * 0.4) },
        { word: Math.ceil(count * 0.5), bare: Math.floor(count * 0.5) },
        { word: Math.floor(count * 0.4), bare: Math.ceil(count * 0.6) },
      ];
      const ratio = mixOptions[Math.floor(Math.random() * mixOptions.length)];
      console.log(`[CerebrasAPI] Mix format ratio: ${ratio.word} word / ${ratio.bare} bare`);
      prompt += `

PROBLEM FORMAT: MIX
Generate exactly ${ratio.word} of the ${count} math problems as word problems with narrative context (characters, scenarios, Avengers themes, 2-4 sentences, 30-80 words). Generate exactly ${ratio.bare} of the ${count} math problems as bare arithmetic expressions — set their narrative to "Solve: [expression]" with no story context (under 10 words). This split is MANDATORY — do not generate all word problems. You MUST produce exactly ${ratio.bare} bare arithmetic problems.`;
    }

    // === BLOCK 4B: ANSWER FORMAT (MC / Mix) ===
    let mcIndices = null;
    if (answerFormat === 'mc') {
      prompt += `

ANSWER FORMAT: MULTIPLE CHOICE
ALL ${count} problems must use answerType "multipleChoice". For EACH problem, include these additional JSON fields:
- "distractorReasoning": array of 3 strings — for each distractor, describe the single student error and compute the resulting value. Write this BEFORE generating options. For single-digit operations, show the one-step calculation (e.g., '42 × 6 = 252'). For multi-digit addition/subtraction (operands >= 100), show column-by-column work: 'Ones: 8+5=13→3 carry 1. Tens: 3+7=10→0 (DROPPED carry). Hundreds: 4+3=7. → 703'. The resultingValue MUST equal the final number from your computation — if they disagree, fix resultingValue to match. ALL values must be positive integers.
- "options": array of 4 objects [{"letter": "A", "text": "..."}, {"letter": "B", "text": "..."}, {"letter": "C", "text": "..."}, {"letter": "D", "text": "..."}]
- "correctAnswer": the letter (A, B, C, or D) of the correct option
- "distractorRationales": object with 3 keys (one per wrong answer letter), each a 1-sentence rationale

MULTIPLE CHOICE RULES:
1. Each problem must have exactly 4 options (A, B, C, D). One is correct, three are distractors.
2. The correct answer's position (A, B, C, or D) must be RANDOMIZED — vary across problems.
3. Each distractor must target a DIFFERENT common student error for this TEKS — not random wrong numbers.
4. Distractors must be plausible: within grade-appropriate number ranges, positive whole numbers (for grades 1-3), and distinct from each other and the correct answer.
5. Do NOT include correctAnswer as a separate numeric field — JavaScript computes the answer independently. The correctAnswer field is ONLY the letter.
6. Follow the DISTRACTOR CONSTRUCTION RULES provided earlier in this prompt. Compute each distractor value FROM a single student error FIRST, then write the rationale.`;
    } else if (answerFormat === 'mix') {
      // Same ratio logic as Problem Format mix: randomly pick 40/60, 50/50, or 60/40
      const mcMixOptions = [
        { mc: Math.ceil(count * 0.4), open: Math.floor(count * 0.6) },
        { mc: Math.ceil(count * 0.5), open: Math.floor(count * 0.5) },
        { mc: Math.ceil(count * 0.6), open: Math.floor(count * 0.4) },
      ];
      const mcRatio = mcMixOptions[Math.floor(Math.random() * mcMixOptions.length)];
      console.log(`[CerebrasAPI] MC mix ratio: ${mcRatio.mc} mc / ${mcRatio.open} open`);

      // Randomly select which problem indices get MC
      const allIndices = Array.from({ length: count }, (_, i) => i);
      for (let i = allIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
      }
      mcIndices = allIndices.slice(0, mcRatio.mc).sort((a, b) => a - b);
      const mcNums = mcIndices.map(i => i + 1).join(', ');
      const orNums = [];
      for (let i = 0; i < count; i++) { if (!mcIndices.includes(i)) orNums.push(i + 1); }

      prompt += `

ANSWER FORMAT ASSIGNMENT:
Problems ${mcNums}: Multiple Choice (answerType "multipleChoice"). Include "distractorReasoning" (array of 3 strings — for single-digit ops show one-step calc; for multi-digit add/subtract with operands >= 100 show column-by-column work and use the final value your column work produces; ALL values must be positive integers), "options" (4 choices A-D), "correctAnswer" (letter), and "distractorRationales" (object with 3 keys explaining each distractor).
Problems ${orNums.join(', ')}: Open Response (answerType "integer", no options needed).

MULTIPLE CHOICE RULES (for MC problems only):
1. Each MC problem must have exactly 4 options (A, B, C, D). One is correct, three are distractors.
2. The correct answer's position must be RANDOMIZED — vary across problems.
3. Each distractor must target a DIFFERENT common student error for this TEKS.
4. Distractors must be plausible: grade-appropriate, positive whole numbers (grades 1-3), distinct.
5. Do NOT include correctAnswer as a separate numeric field — the correctAnswer field is ONLY the letter.
6. Follow the DISTRACTOR CONSTRUCTION RULES provided earlier in this prompt. Compute each distractor value FROM a single student error FIRST, then write the rationale.`;
    }
    // answerFormat === 'open': no MC instructions, prompt stays as-is (zero regression)

    // === BLOCK 4C: PER-TEKS DISTRACTOR PATTERNS (near-recency zone — only when MC active) ===
    if ((answerFormat === 'mc' || answerFormat === 'mix') && typeof selectDistractorPatterns === 'function') {
      const distractorGuides = selectDistractorPatterns(teksCodes);
      if (distractorGuides.length > 0) {
        prompt += `

TEKS-SPECIFIC DISTRACTOR PATTERNS (from real TEA STAAR rationale documents — study these worked examples):
${JSON.stringify(distractorGuides, null, 2)}

Use these patterns as models. For each MC problem, identify which pattern applies to its operation and TEKS, then follow the construction rule and examples shown.`;
        console.log(`[CerebrasAPI] Injected ${distractorGuides.length} TEKS distractor pattern guide(s) for: ${teksCodes.join(', ')}`);
      }
    }

    // === BLOCK 5: PRE-SELECTED NUMBERS ===
    if (operandAssignments && operandAssignments.length > 0) {
      const opSymbols = { 'ADD': '+', 'SUBTRACT': '\u2212', 'MULTIPLY': '\u00D7', 'DIVIDE': '\u00F7' };
      const lines = operandAssignments.map((a, i) => {
        const diff = i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard';
        let line;
        if (a.staarPattern === 'diagram-group') {
          // STAAR 3.4D pattern: diagram shows ONE group, narrative states number of groups
          line = `Problem ${i + 1}: MULTIPLY, TEKS ${a.teks}, ${diff}
  STAAR DIAGRAM PATTERN: A diagram below the problem shows ONE row/group of ${a.diagramGroupSize} items.
  IF WORD PROBLEM: The student must count items in the diagram to find the group size. State ONLY the number of groups (${a.numGroups}) in the narrative. Do NOT mention the number ${a.diagramGroupSize} anywhere in the narrative. Reference the diagram: "The figure below shows one row..." or "One shelf is shown below."
  Pattern: "[Character] has ${a.numGroups} identical [rows/shelves/groups]. One [row/shelf/group] is shown below. How many [items] are there in total?"
  IF BARE MATH: Just use "Solve: ${a.numGroups} × ${a.diagramGroupSize}"
  JSON operands MUST be [${a.numGroups}, ${a.diagramGroupSize}], operation MUST be "MULTIPLY".`;
        } else if (a.operation) {
          line = `Problem ${i + 1}: ${a.operation} ${a.operands[0]} ${opSymbols[a.operation] || '?'} ${a.operands[1]}, TEKS ${a.teks}, ${diff}`;
        } else {
          line = `Problem ${i + 1}: (your choice of operation and numbers), TEKS ${a.teks}, ${diff}`;
        }

        // Pre-compute distractor values for MC problems
        const isMC = answerFormat === 'mc' || (answerFormat === 'mix' && mcIndices && mcIndices.includes(i));
        if (isMC && a.operation && a.operands && a.operands.length >= 2) {
          const correctVal = this._computeAnswer(a.operation, a.operands);
          const dVals = computeDistractorValues(a.operation, a.operands[0], a.operands[1], correctVal);
          if (dVals) {
            const labeled = labelDistractorValues(a.operation, a.operands[0], a.operands[1], correctVal, dVals);
            const positions = ['A', 'B', 'C', 'D'];
            const correctPos = positions[Math.floor(Math.random() * 4)];
            const dPos = positions.filter(p => p !== correctPos);
            line += `\n  REQUIRED DISTRACTOR VALUES (do NOT compute your own):
  Option ${correctPos}: ${correctVal} (CORRECT ANSWER)
  Option ${dPos[0]}: ${labeled[0].value} [${labeled[0].label}] — ${labeled[0].hint}
  Option ${dPos[1]}: ${labeled[1].value} [${labeled[1].label}] — ${labeled[1].hint}
  Option ${dPos[2]}: ${labeled[2].value} [${labeled[2].label}] — ${labeled[2].hint}
  Set correctAnswer to "${correctPos}". Paraphrase each hint into a 1-sentence rationale for that distractor.`;
            console.log(`[CerebrasAPI] Pre-computed distractors for problem ${i + 1}: [${labeled.map(d => d.value + ' (' + d.label + ')').join(', ')}]`);
          }
        }

        return line;
      });

      prompt += `

PRE-SELECTED NUMBERS (JavaScript-generated for guaranteed variety):
For each problem below, write an Iron Man themed word problem that naturally incorporates the EXACT numbers shown. Echo back the operation and operands unchanged in your JSON response. Do NOT substitute different numbers.
For problems marked "(your choice)", you select the operation and numbers following the rules above.

${lines.join('\n')}`;
    }

    return prompt;
  }

  _buildScienceSystemPrompt(gradeLevel, teksDescriptions) {
    const count = this.config.scienceQuestionsPerMission || 3;
    const afterFirewalls = this.config.scienceAfterFirewalls || [3, 6, 9];

    return `You are generating science quiz questions for an Iron Man themed classroom mission. Nick Fury interrupts the mission at specific points to quiz students on science as a "security verification protocol."

Respond with ONLY a JSON object. No markdown, no explanation, no preamble.

REQUIRED JSON STRUCTURE:
{"questions": [
  {
    "afterFirewall": 3,
    "question": "Full question text with SHIELD theming",
    "options": [
      {"letter": "A", "text": "option text"},
      {"letter": "B", "text": "option text"},
      {"letter": "C", "text": "option text"},
      {"letter": "D", "text": "option text"}
    ],
    "correctAnswer": "A",
    "teks": "3.7A"
  }
]}

Generate exactly ${count} multiple-choice science questions.

Each question MUST use one of these afterFirewall values: [${afterFirewalls.join(', ')}] \u2014 each value used exactly once.

THE TEACHER SELECTED THESE SCIENCE TEKS:
${teksDescriptions}
Generate questions based on these TEKS. Target a different TEKS for each question if possible.

RULES:
1. Questions must be factually accurate.
2. Exactly one option must be correct.
3. Distractors should be plausible but clearly wrong for a grade ${gradeLevel} student.
4. Use grade-appropriate vocabulary for grade ${gradeLevel}.
5. Use ONLY the TEKS codes listed above.

THEMING:
Nick Fury is asking these questions as "agent verification protocol" or "SHIELD science clearance check." Frame questions as if Fury is testing students' knowledge to verify they are authorized agents. Keep the tone authoritative but fair. Example: "Agent verification protocol: Which of these is an example of a force acting on an object?"`;
  }

  /* =========================================
     WORKER COMMUNICATION
     ========================================= */

  async _callWorker(messages, temperature) {
    const maxRetries = this.config.retries || 2;
    const baseDelay = this.config.retryDelay || 1000;
    const timeout = this.config.timeout || 30000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(this.config.workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.config.model,
            messages,
            temperature: temperature || this.config.temperature || 0.7,
            top_p: 0.9,
            max_tokens: this.config.maxTokens || 4096,
            response_format: { type: 'json_object' }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Worker returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error('Empty response from worker');
        }

        console.log(`[CerebrasAPI] Response received (attempt ${attempt + 1})`);
        return content;

      } catch (error) {
        console.warn(`[CerebrasAPI] Attempt ${attempt + 1} failed:`, error.message);

        if (attempt < maxRetries) {
          const delay = baseDelay * (attempt + 1);
          console.log(`[CerebrasAPI] Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          throw new Error(`All ${maxRetries + 1} attempts failed: ${error.message}`);
        }
      }
    }
  }

  /* =========================================
     RESPONSE PARSING & VALIDATION
     ========================================= */

  _parseMathResponse(raw, operandAssignments = []) {
    const parsed = this._extractJSON(raw);
    const problems = parsed.problems || parsed;

    if (!Array.isArray(problems)) {
      throw new Error('[CerebrasAPI] Math response is not an array');
    }

    return problems.map((p, index) => {
      // Override with pre-selected operands (safety net — ensures fresh numbers
      // even if LLM substituted different numbers in its response)
      const preSelected = operandAssignments[index];
      if (preSelected && preSelected.operation) {
        // Override operands only — keeps numbers fresh from Math.random()
        // Do NOT override operation — LLM's narrative determines the operation
        // (e.g., TEKS 3.4A covers both ADD and SUBTRACT, so either is valid)
        p.operands = preSelected.operands;
        if (p.answerType !== 'multipleChoice') p.answerType = 'integer';

        // Guard: ensure LLM's operation is compatible with pre-generated operands
        const llmOp = (p.operation || '').toUpperCase();
        const preOp = preSelected.operation;
        if (preOp === 'DIVIDE' && llmOp === 'MULTIPLY') {
          // Operands are [product, factor] — multiplying gives a huge number
          p.operation = 'DIVIDE';
        } else if (preOp === 'MULTIPLY' && llmOp === 'DIVIDE') {
          // Operands are [a, b] small factors — dividing may not be clean
          p.operation = 'MULTIPLY';
        }
        // For ADD/SUBTRACT: _validateOperands handles a<b swap, so either is fine
      }

      const firewallNumber = p.firewallNumber || (index + 1);
      const operation = this._validateOperation(p.operation);
      const answerType = p.answerType || 'integer';

      // For multipleChoice with computation operations: JS computes the answer,
      // but we also keep the LLM's options/correctAnswer letter for MC display
      if (answerType === 'multipleChoice') {
        const mcOptions = this._validateScienceOptions(p.options);
        const mcCorrectLetter = this._validateScienceAnswer(p.correctAnswer, mcOptions);
        const isComputation = ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE',
          'DECIMAL_ADD', 'DECIMAL_SUBTRACT', 'DECIMAL_MULTIPLY'].includes(operation);

        // Build distractorRationales: use LLM-provided object, or construct from reasoning array
        let rationales = p.distractorRationales || null;
        if (!rationales && Array.isArray(p.distractorReasoning) && p.distractorReasoning.length >= 3) {
          const distractorLetters = ['A', 'B', 'C', 'D'].filter(l => l !== mcCorrectLetter);
          rationales = {};
          distractorLetters.forEach((letter, i) => {
            if (p.distractorReasoning[i]) rationales[letter] = p.distractorReasoning[i];
          });
          console.log('[CerebrasAPI] Built distractorRationales from distractorReasoning for', mcCorrectLetter);
        }

        if (isComputation && p.operands && p.operands.length >= 2) {
          // MC math problem: compute answer from operands, keep options
          const operands = this._validateOperands(p.operands, operation);
          const computedAnswer = this._computeAnswer(operation, operands);
          const expression = this._formatExpression(operation, operands);
          return {
            id: `fw-${firewallNumber}`,
            firewallNumber,
            narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
            expression,
            correctAnswer: computedAnswer,
            mcCorrectLetter,
            operation,
            operands,
            options: mcOptions,
            distractorReasoning: p.distractorReasoning || null,
            distractorRationales: rationales,
            teks: p.teksCode || p.teks || '',
            primaryType: p.primaryType || 'computation',
            difficulty: p.difficulty || 'medium',
            diagnosticFor: p.diagnosticFor || [],
            answerType,
            scienceTeksConnection: p.scienceTeksConnection || null,
            scienceLabel: p.scienceLabel || null,
            diagram: this._validateDiagram(p.diagram)
          };
        }
        // Non-computation MC (IDENTIFY, CONCEPTUAL): trust LLM's answer
        return {
          id: `fw-${firewallNumber}`,
          firewallNumber,
          narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
          expression: p.narrative || '',
          correctAnswer: mcCorrectLetter,
          operation,
          operands: p.operands || [],
          options: mcOptions,
          distractorReasoning: p.distractorReasoning || null,
          distractorRationales: rationales,
          teks: p.teksCode || p.teks || '',
          primaryType: p.primaryType || 'conceptual',
          difficulty: p.difficulty || 'medium',
          diagnosticFor: p.diagnosticFor || [],
          answerType,
          scienceTeksConnection: p.scienceTeksConnection || null,
          scienceLabel: p.scienceLabel || null,
          diagram: this._validateDiagram(p.diagram)
        };
      }

      // For comparison: JS determines >, <, or = from operands
      if (answerType === 'comparison') {
        const operands = this._validateOperands(p.operands, 'COMPARE');
        const correctAnswer = operands[0] > operands[1] ? '>' : operands[0] < operands[1] ? '<' : '=';
        return {
          id: `fw-${firewallNumber}`,
          firewallNumber,
          narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
          expression: `${operands[0]} \u2610 ${operands[1]}`,
          correctAnswer,
          operation,
          operands,
          teks: p.teksCode || p.teks || '',
          primaryType: p.primaryType || 'comparison',
          difficulty: p.difficulty || 'medium',
          diagnosticFor: p.diagnosticFor || [],
          answerType,
          scienceTeksConnection: p.scienceTeksConnection || null,
          scienceLabel: p.scienceLabel || null,
          diagram: this._validateDiagram(p.diagram)
        };
      }

      // For fraction operations: handle fraction object operands
      if (operation.startsWith('FRACTION_')) {
        const operands = this._validateFractionOperands(p.operands);
        const correctAnswer = this._computeFractionAnswer(operation, operands);
        const expression = this._formatFractionExpression(operation, operands);
        return {
          id: `fw-${firewallNumber}`,
          firewallNumber,
          narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
          expression,
          correctAnswer,
          operation,
          operands,
          teks: p.teksCode || p.teks || '',
          primaryType: p.primaryType || 'computation',
          difficulty: p.difficulty || 'medium',
          diagnosticFor: p.diagnosticFor || [],
          answerType: 'fraction',
          scienceTeksConnection: p.scienceTeksConnection || null,
          scienceLabel: p.scienceLabel || null,
          diagram: this._validateDiagram(p.diagram)
        };
      }

      // Standard computation: JS calculates the answer independently
      const operands = this._validateOperands(p.operands, operation);
      const correctAnswer = this._computeAnswer(operation, operands);
      const expression = this._formatExpression(operation, operands);

      return {
        id: `fw-${firewallNumber}`,
        firewallNumber,
        narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
        expression,
        correctAnswer,
        operation,
        operands,
        teks: p.teksCode || p.teks || '',
        primaryType: p.primaryType || 'computation',
        difficulty: p.difficulty || 'medium',
        diagnosticFor: p.diagnosticFor || [],
        answerType,
        scienceTeksConnection: p.scienceTeksConnection || null,
        scienceLabel: p.scienceLabel || null,
        diagram: this._validateDiagram(p.diagram)
      };
    });
  }

  _parseScienceResponse(raw) {
    const parsed = this._extractJSON(raw);
    const questions = parsed.questions || parsed;

    if (!Array.isArray(questions)) {
      throw new Error('[CerebrasAPI] Science response is not an array');
    }

    const afterFirewalls = this.config.scienceAfterFirewalls || [3, 6, 9];

    return questions.map((q, index) => {
      const afterFirewall = q.afterFirewall || afterFirewalls[index];
      const options = this._validateScienceOptions(q.options);
      const correctAnswer = this._validateScienceAnswer(q.correctAnswer, options);

      return {
        id: `fury-${index + 1}`,
        afterFirewall,
        question: q.question || 'Science question unavailable.',
        options,
        correctAnswer,
        teks: q.teks || '',
        diagram: null
      };
    });
  }

  _extractJSON(raw) {
    if (typeof raw !== 'string') return raw;

    // Try direct parse first
    try {
      return JSON.parse(raw);
    } catch (_) {
      // Fall through
    }

    // Try to extract from markdown code fences
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      return JSON.parse(fenceMatch[1].trim());
    }

    // Try to find first { ... } block
    const braceMatch = raw.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }

    throw new Error('[CerebrasAPI] Could not extract JSON from response');
  }

  /* =========================================
     FIELD VALIDATORS
     ========================================= */

  _validateOperation(operation) {
    if (!operation) return 'ADD';

    // Normalize common LLM natural-language variants AND operator symbols
    const OPERATION_ALIASES = {
      'addition': 'ADD', 'add': 'ADD', 'plus': 'ADD',
      '+': 'ADD',
      'subtraction': 'SUBTRACT', 'subtract': 'SUBTRACT', 'minus': 'SUBTRACT',
      '-': 'SUBTRACT', '−': 'SUBTRACT',
      'multiplication': 'MULTIPLY', 'multiply': 'MULTIPLY', 'times': 'MULTIPLY',
      '×': 'MULTIPLY', '*': 'MULTIPLY', 'x': 'MULTIPLY',
      'division': 'DIVIDE', 'divide': 'DIVIDE', 'divided': 'DIVIDE',
      '÷': 'DIVIDE', '/': 'DIVIDE',
    };
    const normalized = OPERATION_ALIASES[operation.toLowerCase()] || operation.toUpperCase();

    const valid = [
      'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE',
      'FRACTION_ADD', 'FRACTION_SUBTRACT', 'FRACTION_MULTIPLY',
      'DECIMAL_ADD', 'DECIMAL_SUBTRACT', 'DECIMAL_MULTIPLY',
      'COMPARE', 'IDENTIFY', 'MEASURE', 'DATA_READ', 'CONCEPTUAL'
    ];
    if (valid.includes(normalized)) return normalized;

    console.warn(`[CerebrasAPI] Unrecognized operation "${operation}", defaulting to ADD`);
    return 'ADD';
  }

  _validateOperands(operands, operation) {
    if (!Array.isArray(operands) || operands.length < 2) {
      console.warn('[CerebrasAPI] Invalid operands, using defaults');
      return [10, 5];
    }

    let [a, b] = operands.map(n => Math.round(Number(n)));

    // Ensure positive integers
    a = Math.max(1, Math.abs(a));
    b = Math.max(1, Math.abs(b));

    // For SUBTRACT: ensure a >= b for positive result
    if (operation === 'SUBTRACT' && a < b) {
      [a, b] = [b, a];
    }

    // For DIVIDE: ensure clean division
    if (operation === 'DIVIDE' && a % b !== 0) {
      a = b * Math.max(1, Math.round(a / b));
    }

    return [a, b];
  }

  _validateScienceOptions(options) {
    const letters = ['A', 'B', 'C', 'D'];

    if (!Array.isArray(options) || options.length < 4) {
      return letters.map(letter => ({ letter, text: `Option ${letter}` }));
    }

    return options.slice(0, 4).map((opt, i) => ({
      letter: opt.letter || letters[i],
      text: opt.text || `Option ${letters[i]}`
    }));
  }

  _validateScienceAnswer(answer, options) {
    const validLetters = options.map(o => o.letter);
    const upper = (answer || '').toUpperCase();
    if (validLetters.includes(upper)) {
      return upper;
    }
    return options[0].letter;
  }

  _validateDiagram(descriptor) {
    // Layer 1: Null/absent check
    if (!descriptor || typeof descriptor !== 'object') return null;
    if (!descriptor.type || descriptor.type === 'none') return null;

    // Layer 2: Type must be one of our registered types
    var validTypes = ['numberLine', 'barGraph', 'fractionBar', 'fractionCircle', 'array', 'stripDiagram', 'areaModel', 'dotPlot'];
    if (validTypes.indexOf(descriptor.type) === -1) {
      console.warn('[CerebrasAPI] Invalid diagram type:', descriptor.type);
      return null;
    }

    // Layer 3: Params must exist and be an object
    if (!descriptor.params || typeof descriptor.params !== 'object') {
      console.warn('[CerebrasAPI] Diagram missing params:', descriptor.type);
      return null;
    }

    var p = descriptor.params;
    var type = descriptor.type;

    // Layer 4: Type-specific validation
    try {
      if (type === 'numberLine') {
        if (typeof p.min !== 'number' || typeof p.max !== 'number') return null;
        if (!isFinite(p.min) || !isFinite(p.max)) return null;
        if (p.min >= p.max) return null;
        if (!Array.isArray(p.markers)) p.markers = [];
        if (p.step !== undefined && (typeof p.step !== 'number' || !isFinite(p.step) || p.step <= 0)) p.step = undefined;
      }
      else if (type === 'barGraph') {
        if (!Array.isArray(p.categories) || !Array.isArray(p.values)) return null;
        if (p.categories.length !== p.values.length) return null;
        if (p.categories.length === 0 || p.categories.length > 8) return null;
        for (var i = 0; i < p.values.length; i++) {
          if (typeof p.values[i] !== 'number' || !isFinite(p.values[i])) return null;
        }
      }
      else if (type === 'fractionBar' || type === 'fractionCircle') {
        if (typeof p.numerator !== 'number' || typeof p.denominator !== 'number') return null;
        if (!isFinite(p.numerator) || !isFinite(p.denominator)) return null;
        if (p.denominator < 1 || p.denominator > 12) return null;
        if (p.numerator < 0 || p.numerator > p.denominator) return null;
      }
      else if (type === 'array') {
        if (typeof p.rows !== 'number' || typeof p.columns !== 'number') return null;
        if (!isFinite(p.rows) || !isFinite(p.columns)) return null;
        if (p.rows < 1 || p.rows > 10 || p.columns < 1 || p.columns > 10) return null;
      }
      else if (type === 'stripDiagram') {
        if (!Array.isArray(p.sections) || p.sections.length === 0) return null;
        var hasValue = false;
        for (var k = 0; k < p.sections.length; k++) {
          if (p.sections[k] && typeof p.sections[k].value === 'number' && isFinite(p.sections[k].value)) hasValue = true;
        }
        if (!hasValue) return null;
      }
      else if (type === 'areaModel') {
        if (!Array.isArray(p.factors) || p.factors.length !== 2) return null;
        if (typeof p.factors[0] !== 'number' || typeof p.factors[1] !== 'number') return null;
        if (!isFinite(p.factors[0]) || !isFinite(p.factors[1])) return null;
        if (p.factors[0] <= 0 || p.factors[1] <= 0) return null;
      }
      else if (type === 'dotPlot') {
        if (!Array.isArray(p.data) || p.data.length < 3) return null;
        for (var j = 0; j < p.data.length; j++) {
          if (typeof p.data[j] !== 'number' || !isFinite(p.data[j])) return null;
        }
      }
    } catch (e) {
      console.warn('[CerebrasAPI] Diagram validation error:', e);
      return null;
    }

    console.log('[CerebrasAPI] Valid diagram:', type);
    return { type: type, params: p };
  }

  // ============================================================
  // DETERMINISTIC DIAGRAM COMPUTATION — JavaScript picks the
  // diagram type and params, same as operands and distractors.
  // Every result is piped through _validateDiagram() for safety.
  // ============================================================

  _computeDiagram(teks, operation, operands, answerType, narrative) {
    // Bare math gets no diagram — check if narrative starts with "Solve:"
    if (!narrative || narrative.trim().indexOf('Solve:') === 0) return null;

    // TEKS whitelist — only generate diagrams for TEKS where STAAR uses visual models.
    // Verified against released STAAR tests 2019-2025:
    //   3.4D: YES — visual model of ONE group, student counts to find group size (2019, 2021, 2024)
    //   3.4A: NO — pure text add/subtract word problems (2019, 2021, 2022, 2023, 2024, 2025)
    //   3.4F: NO — basic recall facts, griddable or MC, no diagrams (2019, 2021)
    //   3.4J: NO — pure text division word problems (2022, 2023, 2025)
    //   3.4K: NO — pure text multiply/divide word problems (2019, 2021, 2023, 2024, 2025)
    var diagramTeks = ['3.4D'];
    if (diagramTeks.indexOf(teks) === -1) return null;

    // MC conceptual/identification questions — no diagram
    if (answerType === 'multipleChoice' && (operation === 'IDENTIFY' || operation === 'CONCEPTUAL')) return null;

    // Comparison problems — no diagram (renderer doesn't support comparison visuals)
    if (answerType === 'comparison') return null;

    // Need valid operands for all diagram types below
    if (!Array.isArray(operands) || operands.length < 2) return null;
    var a = operands[0];
    var b = operands[1];

    // MULTIPLY: check for 3.4D STAAR pattern first (single-row diagram)
    if (operation === 'MULTIPLY') {
      // 3.4D: show ONE ROW of b items — student counts to discover group size
      if (teks === '3.4D' && b >= 1 && b <= 10) {
        return this._validateDiagram({
          type: 'array',
          params: { rows: 1, columns: b, showTotal: false, title: null }
        });
      }
      // General: full array (both ≤ 10) or areaModel (either > 10)
      if (a <= 10 && b <= 10 && a >= 1 && b >= 1) {
        return this._validateDiagram({
          type: 'array',
          params: { rows: a, columns: b, title: a + ' × ' + b, showTotal: true }
        });
      }
      if (a > 0 && b > 0) {
        return this._validateDiagram({
          type: 'areaModel',
          params: { factors: [a, b], title: a + ' × ' + b, showPartialProducts: true, showTotal: true }
        });
      }
    }

    // DIVIDE: array (if quotient and divisor both ≤ 10)
    if (operation === 'DIVIDE') {
      var quotient = (b !== 0) ? Math.round(a / b) : 0;
      if (quotient >= 1 && quotient <= 10 && b >= 1 && b <= 10) {
        return this._validateDiagram({
          type: 'array',
          params: { rows: quotient, columns: b, title: a + ' ÷ ' + b, showTotal: true }
        });
      }
    }

    // ADD: strip diagram showing parts combining to total
    if (operation === 'ADD') {
      var sum = a + b;
      return this._validateDiagram({
        type: 'stripDiagram',
        params: {
          sections: [
            { value: a, label: String(a) },
            { value: b, label: String(b) }
          ],
          total: { value: sum, label: String(sum) },
          title: a + ' + ' + b + ' = ' + sum
        }
      });
    }

    // SUBTRACT: strip diagram showing whole minus known part = unknown
    if (operation === 'SUBTRACT') {
      var difference = a - b;
      return this._validateDiagram({
        type: 'stripDiagram',
        params: {
          sections: [
            { value: b, label: String(b) },
            { value: difference, label: '?' }
          ],
          total: { value: a, label: String(a) },
          title: a + ' − ' + b + ' = ?',
          highlightIndex: 1
        }
      });
    }

    // FRACTION operations: fractionBar
    if (operation === 'FRACTION_ADD' || operation === 'FRACTION_SUBTRACT' || operation === 'FRACTION_MULTIPLY') {
      // Fraction operands are objects {numerator, denominator}
      if (a && typeof a === 'object' && typeof a.numerator === 'number' && typeof a.denominator === 'number') {
        return this._validateDiagram({
          type: 'fractionBar',
          params: { numerator: a.numerator, denominator: a.denominator, showLabel: true }
        });
      }
    }

    // Default: no diagram
    return null;
  }

  /* =========================================
     COMPUTATION — JS does the math,
     never trust the LLM for arithmetic
     ========================================= */

  _computeAnswer(operation, operands) {
    const [a, b] = operands;
    switch (operation) {
      case 'ADD':
      case 'DECIMAL_ADD':
      case 'FRACTION_ADD':
        return a + b;
      case 'SUBTRACT':
      case 'DECIMAL_SUBTRACT':
      case 'FRACTION_SUBTRACT':
        return a - b;
      case 'MULTIPLY':
      case 'DECIMAL_MULTIPLY':
      case 'FRACTION_MULTIPLY':
        return a * b;
      case 'DIVIDE':   return a / b;
      default:         return a + b;
    }
  }

  _formatExpression(operation, operands) {
    const [a, b] = operands;
    const symbols = {
      'ADD': '+', 'SUBTRACT': '-', 'MULTIPLY': '\u00D7', 'DIVIDE': '\u00F7',
      'DECIMAL_ADD': '+', 'DECIMAL_SUBTRACT': '-', 'DECIMAL_MULTIPLY': '\u00D7',
      'FRACTION_ADD': '+', 'FRACTION_SUBTRACT': '-', 'FRACTION_MULTIPLY': '\u00D7'
    };
    return `${a} ${symbols[operation] || '+'} ${b} = ?`;
  }

  /* =========================================
     FRACTION HELPERS
     ========================================= */

  _gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a || 1;
  }

  _normalizeFraction(n) {
    if (typeof n === 'object' && n !== null && 'numerator' in n) {
      return { numerator: Number(n.numerator) || 0, denominator: Number(n.denominator) || 1 };
    }
    const num = Number(n);
    return { numerator: isNaN(num) ? 0 : num, denominator: 1 };
  }

  _simplifyFraction(num, den) {
    if (den === 0) return { numerator: 0, denominator: 1 };
    if (den < 0) { num = -num; den = -den; }
    const g = this._gcd(Math.abs(num), den);
    return { numerator: num / g, denominator: den / g };
  }

  _validateFractionOperands(operands) {
    if (!Array.isArray(operands) || operands.length < 2) {
      return [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 4 }];
    }
    return [this._normalizeFraction(operands[0]), this._normalizeFraction(operands[1])];
  }

  _computeFractionAnswer(operation, operands) {
    const [a, b] = operands;
    let num, den;
    switch (operation) {
      case 'FRACTION_ADD':
        num = a.numerator * b.denominator + b.numerator * a.denominator;
        den = a.denominator * b.denominator;
        break;
      case 'FRACTION_SUBTRACT':
        num = a.numerator * b.denominator - b.numerator * a.denominator;
        den = a.denominator * b.denominator;
        break;
      case 'FRACTION_MULTIPLY':
        num = a.numerator * b.numerator;
        den = a.denominator * b.denominator;
        break;
      default:
        num = a.numerator * b.denominator + b.numerator * a.denominator;
        den = a.denominator * b.denominator;
    }
    return this._simplifyFraction(num, den);
  }

  _formatFractionExpression(operation, operands) {
    const fmt = (f) => f.denominator === 1 ? `${f.numerator}` : `${f.numerator}/${f.denominator}`;
    const symbols = { 'FRACTION_ADD': '+', 'FRACTION_SUBTRACT': '-', 'FRACTION_MULTIPLY': '\u00D7' };
    return `${fmt(operands[0])} ${symbols[operation] || '+'} ${fmt(operands[1])} = ?`;
  }

  /* =========================================
     TEKS HELPERS
     ========================================= */

  _getTeksDescriptions(gradeLevel, subject, codes) {
    // Pull descriptions from TEKS_DATA if available (loaded by app.js)
    if (typeof TEKS_DATA !== 'undefined' && TEKS_DATA[gradeLevel] && TEKS_DATA[gradeLevel][subject]) {
      const allTeks = TEKS_DATA[gradeLevel][subject];
      return codes.map(code => {
        const match = allTeks.find(t => t.code === code);
        return match ? `${code}: ${match.description}` : code;
      }).join('\n');
    }

    // Fallback: just list codes without descriptions
    return codes.join(', ');
  }

  /* =========================================
     SINGLE PROBLEM REGENERATION
     (for Teacher Review Screen)
     ========================================= */

  /**
   * Regenerate a single problem for the review screen.
   * Reuses the system prompt builder but adapted for one problem.
   *
   * @param {number} gradeLevel - 1 through 5
   * @param {string} teksCode - e.g. '3.4A'
   * @param {string} operation - e.g. 'ADD', 'MULTIPLY' (empty for science)
   * @param {string} feedback - Teacher's feedback text (empty for random regen)
   * @param {object} opts - { format, crossCurricular, scienceTeks, isScience }
   * @returns {Promise<object>} Single problem in API schema
   */
  async regenerateProblem(gradeLevel, teksCode, operation, feedback, opts = {}) {
    const _fb = feedback || '';
    console.log(`[CerebrasAPI] Regenerating: grade=${gradeLevel} teks=${teksCode} feedback="${_fb.length > 60 ? _fb.slice(0, 60) + '...' : _fb}"`);

    if (opts.isScience) {
      return this._regenerateScienceProblem(gradeLevel, teksCode, feedback);
    }
    return this._regenerateMathProblem(gradeLevel, teksCode, operation, feedback, opts);
  }

  async _regenerateMathProblem(gradeLevel, teksCode, operation, feedback, opts) {
    const teksDesc = this._getTeksDescriptions(gradeLevel, 'math', [teksCode]);

    // Detect if teacher requested easier or harder numbers
    // Skip detection when mathConstraints is set — teacher wants exact same numbers (e.g., MC/OR conversion)
    const fbLower = (feedback || '').toLowerCase();
    const difficultyShift = opts.mathConstraints ? null
      : (fbLower.includes('smaller') || fbLower.includes('simpler')) ? 'easier'
      : (fbLower.includes('larger') || fbLower.includes('more complex') || fbLower.includes('difficulty')) ? 'harder'
      : null;

    // Pre-generate operands ONLY when NOT doing a difficulty shift
    let operandResult = null;
    if (!difficultyShift) {
      operandResult = generateOperandsForTeks(teksCode, Math.floor(Math.random() * 10));
      // Constrain to the original operation when available, to avoid random op swaps
      if (operation && operandResult && operandResult.operation !== operation) {
        // Retry up to 5 times to get matching operation
        for (let i = 0; i < 5; i++) {
          operandResult = generateOperandsForTeks(teksCode, Math.floor(Math.random() * 10));
          if (operandResult.operation === operation) break;
        }
        // If still mismatched, force the operation (swap operands if needed for SUBTRACT)
        if (operandResult.operation !== operation) {
          operandResult.operation = operation;
        }
      }
    }
    console.log(`[CerebrasAPI] Regen mode: ${difficultyShift ? difficultyShift + ' (LLM-directed)' : 'standard (pre-generated operands)'}, operation: ${operation}`);

    // Pull exemplars from ExemplarBank if available
    let exemplars = [];
    if (window.exemplarBank) {
      exemplars = window.exemplarBank.getExemplars(teksCode, 5);
    } else if (typeof selectExemplars === 'function' && ALL_EXEMPLARS.length > 0) {
      exemplars = selectExemplars([teksCode], ALL_EXEMPLARS).slice(0, 5);
    }

    // Build a focused single-problem prompt
    let prompt = `You are a TEKS-aligned math problem generator for Texas elementary classrooms, themed around Iron Man and the Avengers.

Respond with ONLY a JSON object: {"problems": [{...}]}. Generate exactly 1 problem.

TARGET TEKS: ${teksDesc}
GRADE: ${gradeLevel}

REQUIRED JSON FIELDS per problem:
narrative (string, 30-80 word Iron Man themed word problem), operation (string), operands (array of numbers), teks (string), primaryType (string), difficulty (string), diagnosticFor (array), answerType (string), scienceTeksConnection (string or null), scienceLabel (string or null — short 2-5 word description of science concept if cross-curricular), diagram (object or null)

DIAGRAM FIELD: Include a "diagram" field in your response. Set to null unless the problem benefits from a visual model. Valid types: "numberLine", "barGraph", "fractionBar", "fractionCircle", "array", "stripDiagram", "areaModel", "dotPlot". If including a diagram, use the EXACT same parameter format as shown in the main prompt. When in doubt, set diagram to null.

RULES:
1. Do NOT include correctAnswer — JavaScript computes it.
2. Operands must produce a POSITIVE WHOLE NUMBER result.
3. For SUBTRACT: first operand > second. For DIVIDE: must divide evenly.
4. Narrative must be a complete word problem (2-4 sentences). Do NOT show the operation or equation in the narrative.`;

    // Format instruction — teacher chip override takes precedence over mission format
    if (opts.formatOverride === 'bare') {
      prompt += `\n\nFORMAT REQUIREMENT — BARE ARITHMETIC: You MUST generate a bare arithmetic problem with NO narrative, NO story context, NO character names, NO word problem framing. The output format MUST be exactly: "Solve: [operand1] [operator] [operand2] = ?" Example: "Solve: 478 + 120 = ?" The narrative field must contain ONLY "Solve: X ○ Y = ?" — nothing else. Do NOT include any scenario, context, or story. Just the raw math expression.`;
    } else if (opts.formatOverride === 'word') {
      prompt += `\n\nFORMAT REQUIREMENT — WORD PROBLEM: You MUST generate a word problem with narrative context using Avengers/Marvel characters (Iron Man, Black Widow, Thor, Hulk, Captain America, Jarvis, etc.). The problem MUST include a real-world scenario, NOT just a math expression. The narrative field must describe a scenario that requires the student to perform the math operation. Example: "Iron Man has 478 repulsor energy cells and receives 120 more from Stark Industries. How many energy cells does he have in total?"`;
    } else {
      const format = opts.format || 'mix';
      if (format === 'pure') {
        prompt += '\n\nFORMAT: Generate a bare arithmetic expression only — no word problem context. Set narrative to a minimal description like "Solve: [expression]".';
      } else if (format === 'word') {
        prompt += '\n\nFORMAT: Generate a rich real-world word problem with context (2-4 sentences, 30-80 words).';
      }
    }

    // Math constraints — preserve existing numbers when converting formats
    if (opts.mathConstraints && opts.mathConstraints.operands && opts.mathConstraints.operands.length >= 2) {
      const mc = opts.mathConstraints;
      const opSymbols = { 'ADD': '+', 'SUBTRACT': '-', 'MULTIPLY': '×', 'DIVIDE': '÷' };
      const sym = opSymbols[mc.operation] || '+';
      prompt += `\n\nMATH CONSTRAINT — PRESERVE EXISTING NUMBERS:\nYou MUST use EXACTLY these values in your word problem:\n- First number: ${mc.operands[0]}\n- Second number: ${mc.operands[1]}\n- Operation: ${mc.operation} (${sym})\n- Correct answer: ${mc.answer}\nDo NOT change any numbers or the operation. Build a narrative scenario around these exact values.`;
    }

    // Cross-curricular
    if (opts.crossCurricular && opts.scienceTeks && opts.scienceTeks.length > 0) {
      const sciDesc = this._getTeksDescriptions(gradeLevel, 'science', opts.scienceTeks);
      prompt += `\n\nCROSS-CURRICULAR: Weave in science themes from: ${sciDesc}\nSet scienceTeksConnection to the relevant science TEKS code. Also set "scienceLabel" to a SHORT (2-5 word) description of the science concept used (e.g., "Forces & Motion", "Weather & Precipitation"). Do NOT repeat the TEKS code as the label.\nIMPORTANT: The science context must be NATURALLY woven into the scenario through vocabulary and setting. Do NOT add any sentence that explicitly explains the science connection. Do NOT write phrases like "This situation involves..." or "This demonstrates..." or "This is related to..." or "This is an example of..." — the science should be IMPLICIT, not stated directly. The student is solving a MATH problem.`;
    } else if (opts.crossCurricular === false) {
      prompt += `\n\nPURE MATH — NO SCIENCE CONTEXT: Generate a pure math word problem using Avengers/Marvel characters. Do NOT include any science vocabulary, science scenarios, or science connections. Set scienceTeksConnection to null and scienceLabel to null.`;
    }

    // MC instructions for regeneration (preserve answer format)
    if (opts.answerType === 'multipleChoice') {
      // Inject universal distractor rules (primacy-style, but in regeneration prompt)
      if (typeof UNIVERSAL_DISTRACTOR_RULES !== 'undefined') {
        prompt += '\n\n' + UNIVERSAL_DISTRACTOR_RULES;
      }
      prompt += `\n\nANSWER FORMAT: MULTIPLE CHOICE\nThis problem uses Multiple Choice. You MUST include:\n- "distractorReasoning": array of 3 strings — for each distractor, describe the single student error and compute the resulting value. Write this BEFORE generating options. For single-digit operations, show the one-step calculation (e.g., '42 × 6 = 252'). For multi-digit addition/subtraction (operands >= 100), show column-by-column work: 'Ones: 8+5=13→3 carry 1. Tens: 3+7=10→0 (DROPPED carry). Hundreds: 4+3=7. → 703'. The resultingValue MUST equal the final number from your computation — if they disagree, fix resultingValue to match. ALL values must be positive integers.\n- "options": array of 4 objects [{"letter": "A", "text": "..."}, ...]\n- "correctAnswer": the letter (A, B, C, or D) of the correct option\n- "distractorRationales": object with 3 keys for wrong answers\nSet answerType to "multipleChoice". Randomize correct answer position.\nFollow the DISTRACTOR CONSTRUCTION RULES above. Compute each distractor value FROM a single student error FIRST, then write the rationale.`;
      // Inject per-TEKS distractor patterns (near-recency)
      if (typeof selectDistractorPatterns === 'function') {
        const regenDistrGuides = selectDistractorPatterns([teksCode]);
        if (regenDistrGuides.length > 0) {
          prompt += `\n\nTEKS-SPECIFIC DISTRACTOR PATTERNS (from real TEA STAAR rationale documents):\n${JSON.stringify(regenDistrGuides, null, 2)}`;
        }
      }
    }

    // Difficulty-shift path: tell the LLM the original problem and what direction to move
    if (difficultyShift && operation && opts.originalOperands && opts.originalOperands.length >= 2) {
      const opSymbols = { 'ADD': '+', 'SUBTRACT': '−', 'MULTIPLY': '×', 'DIVIDE': '÷' };
      const sym = opSymbols[operation] || '?';
      const dir = difficultyShift === 'easier' ? 'EASIER (smaller)' : 'HARDER (larger)';
      prompt += `\n\nORIGINAL PROBLEM: ${operation} ${opts.originalOperands[0]} ${sym} ${opts.originalOperands[1]}
TEACHER REQUEST: Generate a problem with ${dir} numbers than the original.
- Keep the SAME operation (${operation}).
- For EASIER: use significantly smaller numbers than ${opts.originalOperands[0]} and ${opts.originalOperands[1]}.
- For HARDER: use significantly larger numbers than ${opts.originalOperands[0]} and ${opts.originalOperands[1]}.
- Numbers must still be valid for TEKS ${teksCode} and produce a positive whole number result.`;
    } else if (operandResult && operandResult.operation) {
      // Standard path: use pre-generated operands
      const opSymbols = { 'ADD': '+', 'SUBTRACT': '−', 'MULTIPLY': '×', 'DIVIDE': '÷' };
      prompt += `\n\nPRE-SELECTED NUMBERS: ${operandResult.operation} ${operandResult.operands[0]} ${opSymbols[operandResult.operation] || '?'} ${operandResult.operands[1]}, TEKS ${teksCode}. Use these EXACT numbers in your problem.`;
    }

    // Pre-computed distractor values for MC regeneration
    if (opts.answerType === 'multipleChoice') {
      let regenOp1, regenOp2, regenOperation, regenAnswer;
      if (opts.mathConstraints && opts.mathConstraints.operands && opts.mathConstraints.operands.length >= 2) {
        regenOp1 = opts.mathConstraints.operands[0];
        regenOp2 = opts.mathConstraints.operands[1];
        regenOperation = opts.mathConstraints.operation;
        regenAnswer = opts.mathConstraints.answer;
      } else if (!difficultyShift && operandResult && operandResult.operation) {
        regenOp1 = operandResult.operands[0];
        regenOp2 = operandResult.operands[1];
        regenOperation = operandResult.operation;
        regenAnswer = this._computeAnswer(regenOperation, [regenOp1, regenOp2]);
      }
      if (regenOp1 !== undefined && regenOperation) {
        const dVals = computeDistractorValues(regenOperation, regenOp1, regenOp2, regenAnswer);
        if (dVals) {
          const labeled = labelDistractorValues(regenOperation, regenOp1, regenOp2, regenAnswer, dVals);
          const positions = ['A', 'B', 'C', 'D'];
          const correctPos = positions[Math.floor(Math.random() * 4)];
          const dPos = positions.filter(p => p !== correctPos);
          prompt += `\n\nREQUIRED DISTRACTOR VALUES (do NOT compute your own):\nOption ${correctPos}: ${regenAnswer} (CORRECT ANSWER)\nOption ${dPos[0]}: ${labeled[0].value} [${labeled[0].label}] — ${labeled[0].hint}\nOption ${dPos[1]}: ${labeled[1].value} [${labeled[1].label}] — ${labeled[1].hint}\nOption ${dPos[2]}: ${labeled[2].value} [${labeled[2].label}] — ${labeled[2].hint}\nSet correctAnswer to "${correctPos}". Paraphrase each hint into a 1-sentence rationale for that distractor.`;
          console.log(`[CerebrasAPI] Pre-computed distractors for regen: [${labeled.map(d => d.value + ' (' + d.label + ')').join(', ')}]`);
        }
      }
    }

    // Few-shot exemplars
    if (exemplars.length > 0) {
      prompt += `\n\nFEW-SHOT EXEMPLARS (match this quality):\n${JSON.stringify(exemplars.slice(0, 3), null, 2)}`;
    }

    // Teacher feedback
    if (feedback && feedback.trim()) {
      prompt += `\n\nTEACHER FEEDBACK — address this: "${feedback}"`;
    }

    const regenUserMsg = `Generate 1 math problem for grade ${gradeLevel}, TEKS ${teksCode}.${opts.answerType === 'multipleChoice' && typeof DISTRACTOR_RULES_REMINDER !== 'undefined' ? '\n\n' + DISTRACTOR_RULES_REMINDER : ''}`;
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: regenUserMsg }
    ];

    const raw = await this._callWorker(messages, 0.7);
    const problems = this._parseMathResponse(raw, operandResult ? [operandResult] : []);

    if (problems && problems.length > 0) {
      // Force-override math fields when mathConstraints provided —
      // LLM correctly uses constraints in narrative but hallucinates JSON fields
      if (opts.mathConstraints && opts.mathConstraints.operands && opts.mathConstraints.operands.length >= 2) {
        const mc = opts.mathConstraints;
        const p = problems[0];
        p.operands = mc.operands;
        p.operation = mc.operation;
        p.correctAnswer = mc.answer;
        const opSym = { ADD: '+', SUBTRACT: '-', MULTIPLY: '×', DIVIDE: '÷' }[mc.operation] || '+';
        p.expression = `${mc.operands[0]} ${opSym} ${mc.operands[1]}`;
      }

      // Deterministic diagram for regenerated problem
      var computedDiagram = this._computeDiagram(problems[0].teks, problems[0].operation, problems[0].operands, problems[0].answerType, problems[0].narrative);
      if (computedDiagram) {
        problems[0].diagram = computedDiagram;
      }

      return problems[0];
    }
    throw new Error('Regeneration returned no problems');
  }

  async _regenerateScienceProblem(gradeLevel, teksCode, feedback) {
    const teksDesc = this._getTeksDescriptions(gradeLevel, 'science', [teksCode]);

    let prompt = `You are generating a science quiz question for an Iron Man themed classroom mission. Nick Fury asks this question as a "security verification protocol."

Respond with ONLY a JSON object: {"questions": [{...}]}. Generate exactly 1 question.

TARGET TEKS: ${teksDesc}
GRADE: ${gradeLevel}

REQUIRED JSON FIELDS: afterFirewall (number), question (string), options (array of 4 objects {letter, text}), correctAnswer (letter A-D), teks (string)

RULES:
1. Questions must be factually accurate.
2. Exactly one option must be correct.
3. Distractors should be plausible but clearly wrong.
4. Use grade-appropriate vocabulary.`;

    if (feedback && feedback.trim()) {
      prompt += `\n\nTEACHER FEEDBACK — address this: "${feedback}"`;
    }

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: `Generate 1 science question for grade ${gradeLevel}, TEKS ${teksCode}.` }
    ];

    const raw = await this._callWorker(messages, 0.2);
    const questions = this._parseScienceResponse(raw);

    if (questions && questions.length > 0) {
      return questions[0];
    }
    throw new Error('Science regeneration returned no questions');
  }
}

// Global instance + class exposure for console testing
window.CerebrasAPI = CerebrasAPI;
const cerebrasAPI = new CerebrasAPI();
window.cerebrasAPI = cerebrasAPI;

console.log('[CerebrasAPI] Module loaded \u2014 test with: cerebrasAPI.generateMission(3, ["3.4A","3.4F","3.4J"], ["3.6B","3.13B"]).then(console.log)');
