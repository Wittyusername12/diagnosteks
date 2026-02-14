/* =========================================
   CEREBRAS API CLIENT
   Iron Man STEM Mission Interface
   AI-powered problem generation via
   Cloudflare Worker → Groq inference
   ========================================= */

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

    const messages = [
      { role: 'system', content: this._buildMathSystemPrompt(gradeLevel, teksDescriptions, scienceTeksDescriptions, crossCurricular) },
      { role: 'user', content: `Generate 10 math problems for grade ${gradeLevel} using TEKS: ${teksCodes.join(', ')}` }
    ];

    const raw = await this._callWorker(messages, 0.7);
    return this._parseMathResponse(raw);
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

  _buildMathSystemPrompt(gradeLevel, teksDescriptions, scienceTeksDescriptions, crossCurricular) {
    const count = this.config.mathProblemsPerMission || 10;

    let prompt = `You are a K-5 math problem generator for an Iron Man themed classroom mission. You generate structured JSON problem data. You do NOT calculate answers \u2014 you provide the operation and operands, and separate software calculates the answer independently.

Respond with ONLY a JSON object. No markdown, no explanation, no preamble.

REQUIRED JSON STRUCTURE:
{"problems": [
  {
    "narrative": "Brief Iron Man themed context sentence",
    "operation": "ADD",
    "operands": [47, 28],
    "teks": "3.4A",
    "primaryType": "computation",
    "difficulty": "easy",
    "diagnosticFor": [],
    "answerType": "integer",
    "scienceTeksConnection": null
  }
]}

Generate exactly ${count} problems.

THE TEACHER SELECTED THESE MATH TEKS:
${teksDescriptions}
Every problem MUST target one of these standards. Distribute problems across the selected TEKS \u2014 do not put all problems on one standard.

VALID OPERATION CODES:
- ADD, SUBTRACT, MULTIPLY, DIVIDE \u2014 standard integer arithmetic
- FRACTION_ADD, FRACTION_SUBTRACT, FRACTION_MULTIPLY \u2014 fraction operations (use fraction objects: {"numerator": 1, "denominator": 4})
- DECIMAL_ADD, DECIMAL_SUBTRACT, DECIMAL_MULTIPLY \u2014 decimal operations
- COMPARE \u2014 provide two operands, answerType = "comparison"
- IDENTIFY, CONCEPTUAL \u2014 provide "options" array with 4 choices [{"letter": "A", "text": "..."}, ...] and "correctAnswer" as the letter, answerType = "multipleChoice"

ANSWER TYPES:
- For computation (ADD, SUBTRACT, MULTIPLY, DIVIDE): operands as positive integers, answerType = "integer"
- For COMPARE: two operands, answerType = "comparison", do NOT include correctAnswer
- For IDENTIFY, CONCEPTUAL: "options" array and "correctAnswer" letter, answerType = "multipleChoice"

COMPARE NARRATIVE REQUIREMENTS:
For COMPARE problems: the narrative MUST clearly describe two quantities being compared. Example: "Jarvis scanned 4,567 data packets from the east server and 4,576 from the west server. Which server processed more packets? Compare the numbers." The expression should be formatted as "operand1 ? operand2" where ? is what the student determines. Do NOT use incomplete narratives like "Tony Stark's lab has" — always explain WHAT is being compared and WHY.

CRITICAL RULES:
1. Do NOT include any answer or correctAnswer field for computation problems. The game engine computes answers independently.
2. For computation: operands must produce a POSITIVE WHOLE NUMBER result.
3. For SUBTRACT: first operand must be larger than second.
4. For DIVIDE: first operand must be evenly divisible by second.
5. Mix operations across the ${count} problems when the selected TEKS allow it.
6. Use ONLY the TEKS codes listed above.

DIFFICULTY PROGRESSION:
- Problems 1-3: easier (simpler numbers, one-step). Set "difficulty": "easy"
- Problems 4-7: medium difficulty. Set "difficulty": "medium"
- Problems 8-${count}: harder (larger numbers, multi-step, or trickier concepts). Set "difficulty": "hard"

NARRATIVE WRAPPING:
Each problem needs a 1-2 sentence Iron Man themed narrative (max 25 words). Use characters: Tony Stark, Jarvis, Pepper Potts, the Avengers. Settings: Stark Industries lab, the Helicarrier, Avengers Tower. Keep narratives age-appropriate and engaging for elementary students.

DIAGNOSTIC PROBLEMS:
Design at least 2 problems to reveal common student errors. Examples: carrying/borrowing across zeros, reversible digit answers, fraction misconceptions. Set "diagnosticFor" to an array describing the misconception (e.g., ["borrowing-across-zero"]).

GRADE APPROPRIATENESS:
This is grade ${gradeLevel}. Use number ranges appropriate for this grade level. Do not generate problems beyond what the selected TEKS require.

PROCESS STANDARDS:
All problems should use real-world contexts, be solvable through clear mathematical reasoning, and use grade-appropriate language.`;

    if (crossCurricular && scienceTeksDescriptions) {
      prompt += `

CROSS-CURRICULAR MODE:
The teacher also selected these science TEKS:
${scienceTeksDescriptions}
Where natural, theme math word problems around these science concepts. The math must remain rigorous and aligned to the math TEKS \u2014 the science context is vocabulary reinforcement, not a separate learning objective. For cross-curricular problems, set "scienceTeksConnection" to the relevant science TEKS code. Example: "Tony Stark's research lab has 456 rainforest plant specimens. If 189 need to be moved to the new biodome, how many remain in the lab?"`;
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

  _parseMathResponse(raw) {
    const parsed = this._extractJSON(raw);
    const problems = parsed.problems || parsed;

    if (!Array.isArray(problems)) {
      throw new Error('[CerebrasAPI] Math response is not an array');
    }

    return problems.map((p, index) => {
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
