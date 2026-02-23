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
      // Add/subtract within 1,000
      const operation = problemIndex % 2 === 0 ? 'ADD' : 'SUBTRACT';
      let a, b;
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
      if (operation === 'SUBTRACT' && b >= a) [a, b] = [b, a];
      return { operation, operands: [a, b], teks };
    }

    case '3.4F':
    case '3.4D': {
      // Multiply/divide facts within 10×10
      const operation = problemIndex % 2 === 0 ? 'MULTIPLY' : 'DIVIDE';
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
      const operation = problemIndex % 2 === 0 ? 'MULTIPLY' : 'DIVIDE';
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
        const comboKey = `${result.operands.join(',')}`;
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
      gradeLevel, mathTeksCodes, scienceTeksCodes, options.crossCurricular
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
  async generateMathProblems(gradeLevel, teksCodes, scienceTeksCodes, crossCurricular) {
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
      { role: 'system', content: this._buildMathSystemPrompt(gradeLevel, teksDescriptions, exemplars, crossCurricular, scienceTeksDescriptions, operandAssignments) },
      { role: 'user', content: `Generate ${count} math problems for grade ${gradeLevel} using TEKS: ${teksCodes.join(', ')}. For pre-selected problems, use the EXACT numbers provided. Output operation and operands so JavaScript can independently calculate each answer.` }
    ];

    const raw = await this._callWorker(messages, 0.7);
    return this._parseMathResponse(raw, operandAssignments);
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

    const raw = await this._callWorker(messages, 0.5);
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

  _buildMathSystemPrompt(gradeLevel, teksDescriptions, exemplars, crossCurricular, scienceTeksDescriptions, operandAssignments = []) {
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
    "scienceTeksConnection": null
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
Design at least 2 problems to reveal common student errors. Examples: carrying/borrowing across zeros, reversible digit answers, fraction misconceptions. Set "diagnosticFor" to an array describing the misconception (e.g., ["borrowing-across-zero"]).`;

    // === BLOCK 2: FEW-SHOT EXEMPLARS ===
    if (exemplars && exemplars.length > 0) {
      prompt += `

FEW-SHOT EXEMPLARS:
Study these examples carefully. They show the quality standard you must match \u2014 the difficulty level, narrative style, and distractor reasoning. Generate ORIGINAL problems inspired by these patterns. Do NOT copy or closely paraphrase any example.

${JSON.stringify(exemplars, null, 2)}`;
    }

    // === BLOCK 3: CROSS-CURRICULAR + FINAL INSTRUCTIONS ===
    if (crossCurricular && scienceTeksDescriptions) {
      prompt += `

CROSS-CURRICULAR MODE:
The teacher also selected these science TEKS:
${scienceTeksDescriptions}
Where natural, theme math word problems around these science concepts. The math must remain rigorous and aligned to the math TEKS \u2014 the science context is vocabulary reinforcement, not a separate learning objective. For cross-curricular problems, set "scienceTeksConnection" to the relevant science TEKS code. Example: "Tony Stark's research lab has 456 rainforest plant specimens. If 189 need to be moved to the new biodome, how many remain in the lab?"`;
    }

    // === BLOCK 4: PRE-SELECTED NUMBERS ===
    if (operandAssignments && operandAssignments.length > 0) {
      const opSymbols = { 'ADD': '+', 'SUBTRACT': '\u2212', 'MULTIPLY': '\u00D7', 'DIVIDE': '\u00F7' };
      const lines = operandAssignments.map((a, i) => {
        const diff = i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard';
        if (a.operation) {
          return `Problem ${i + 1}: ${a.operation} ${a.operands[0]} ${opSymbols[a.operation] || '?'} ${a.operands[1]}, TEKS ${a.teks}, ${diff}`;
        }
        return `Problem ${i + 1}: (your choice of operation and numbers), TEKS ${a.teks}, ${diff}`;
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
      // Override with pre-selected operands (safety net — ensures correctness
      // even if LLM substituted different numbers in its response)
      const preSelected = operandAssignments[index];
      if (preSelected && preSelected.operation) {
        p.operation = preSelected.operation;
        p.operands = preSelected.operands;
        p.answerType = 'integer';
      }

      const firewallNumber = p.firewallNumber || (index + 1);
      const operation = this._validateOperation(p.operation);
      const answerType = p.answerType || 'integer';

      // For multipleChoice: trust the LLM's correctAnswer letter
      if (answerType === 'multipleChoice') {
        const options = this._validateScienceOptions(p.options);
        const correctAnswer = this._validateScienceAnswer(p.correctAnswer, options);
        return {
          id: `fw-${firewallNumber}`,
          firewallNumber,
          narrative: p.narrative || `Firewall ${firewallNumber} detected.`,
          expression: p.narrative || '',
          correctAnswer,
          operation,
          operands: p.operands || [],
          options,
          teks: p.teksCode || p.teks || '',
          primaryType: p.primaryType || 'conceptual',
          difficulty: p.difficulty || 'medium',
          diagnosticFor: p.diagnosticFor || [],
          answerType,
          scienceTeksConnection: p.scienceTeksConnection || null
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
          scienceTeksConnection: p.scienceTeksConnection || null
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
          scienceTeksConnection: p.scienceTeksConnection || null
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
        scienceTeksConnection: p.scienceTeksConnection || null
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
        teks: q.teks || ''
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
    const valid = [
      'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE',
      'FRACTION_ADD', 'FRACTION_SUBTRACT', 'FRACTION_MULTIPLY',
      'DECIMAL_ADD', 'DECIMAL_SUBTRACT', 'DECIMAL_MULTIPLY',
      'COMPARE', 'IDENTIFY', 'MEASURE', 'DATA_READ', 'CONCEPTUAL'
    ];
    const upper = (operation || '').toUpperCase();
    if (!valid.includes(upper)) {
      console.warn(`[CerebrasAPI] Invalid operation "${operation}", defaulting to ADD`);
      return 'ADD';
    }
    return upper;
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
}

// Global instance + class exposure for console testing
window.CerebrasAPI = CerebrasAPI;
const cerebrasAPI = new CerebrasAPI();
window.cerebrasAPI = cerebrasAPI;

console.log('[CerebrasAPI] Module loaded \u2014 test with: cerebrasAPI.generateMission(3, ["3.4A","3.4F","3.4J"], ["3.6B","3.13B"]).then(console.log)');
