/* =========================================
   CEREBRAS API CLIENT
   Iron Man STEM Mission Interface
   AI-powered problem generation via
   Cloudflare Worker → Cerebras inference
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
   * @returns {Promise<{math: Array, science: Array}>}
   */
  async generateMission(gradeLevel, mathTeksCodes, scienceTeksCodes) {
    console.log(`[CerebrasAPI] Generating mission for grade ${gradeLevel}`);
    console.log(`[CerebrasAPI]   Math TEKS: ${mathTeksCodes.join(', ')}`);
    console.log(`[CerebrasAPI]   Science TEKS: ${scienceTeksCodes.join(', ')}`);

    const [math, science] = await Promise.all([
      this.generateMathProblems(gradeLevel, mathTeksCodes),
      this.generateScienceQuestions(gradeLevel, scienceTeksCodes)
    ]);

    console.log(`[CerebrasAPI] Mission generated: ${math.length} math, ${science.length} science`);
    return { math, science };
  }

  /**
   * Generate 10 math problems (one per firewall).
   * LLM provides: narrative, operation, operands, teks.
   * JS computes: correctAnswer, expression, id.
   *
   * @param {number} gradeLevel
   * @param {string[]} teksCodes
   * @returns {Promise<Array>}
   */
  async generateMathProblems(gradeLevel, teksCodes) {
    const teksDescriptions = this._getTeksDescriptions(gradeLevel, 'math', teksCodes);

    const messages = [
      { role: 'system', content: this._buildMathSystemPrompt(gradeLevel, teksDescriptions) },
      { role: 'user', content: `Generate 10 math problems for grade ${gradeLevel} using TEKS: ${teksCodes.join(', ')}` }
    ];

    const raw = await this._callWorker(messages);
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

    const raw = await this._callWorker(messages);
    return this._parseScienceResponse(raw);
  }

  /* =========================================
     PROMPT BUILDERS
     ========================================= */

  _buildMathSystemPrompt(gradeLevel, teksDescriptions) {
    const count = this.config.mathProblemsPerMission || 10;

    return `You are a math problem generator for a grade ${gradeLevel} educational game themed as an Iron Man hacking mission.

Generate exactly ${count} math problems as a JSON array.

Each problem MUST have these fields:
- "firewallNumber": sequential integer 1 through ${count}
- "narrative": a short Iron Man / hacking themed sentence (max 15 words)
- "operation": exactly one of "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"
- "operands": array of exactly 2 positive integers appropriate for grade ${gradeLevel}
- "teks": one of the TEKS codes listed below

CRITICAL RULES:
1. Do NOT include any answer or correctAnswer field. The game engine computes answers.
2. Operands must produce a POSITIVE WHOLE NUMBER result.
3. For SUBTRACT: first operand must be larger than second.
4. For DIVIDE: the first operand must be evenly divisible by the second.
5. Mix operations across the ${count} problems. No operation more than 3 times.
6. Gradually increase difficulty from firewall 1 to ${count}.
7. Use ONLY the TEKS codes provided below.

Available TEKS:
${teksDescriptions}

Return ONLY a valid JSON object with this exact structure:
{"problems": [{"firewallNumber": 1, "narrative": "...", "operation": "ADD", "operands": [35, 27], "teks": "3.4A"}, ...]}

No markdown code fences. No explanation. Just the JSON object.`;
  }

  _buildScienceSystemPrompt(gradeLevel, teksDescriptions) {
    const count = this.config.scienceQuestionsPerMission || 3;
    const afterFirewalls = this.config.scienceAfterFirewalls || [3, 6, 9];

    return `You are a science question generator for a grade ${gradeLevel} educational game themed as an Iron Man / Nick Fury mission briefing.

Generate exactly ${count} multiple-choice science questions as a JSON array.

Each question MUST have these fields:
- "afterFirewall": one of [${afterFirewalls.join(', ')}] — each value used exactly once
- "question": a clear science question appropriate for grade ${gradeLevel}
- "options": array of exactly 4 objects, each with "letter" ("A","B","C","D") and "text"
- "correctAnswer": the letter of the correct option ("A", "B", "C", or "D")
- "teks": one of the TEKS codes listed below

RULES:
1. Questions must be factually accurate.
2. Exactly one option must be correct.
3. Distractors should be plausible but clearly wrong for a grade ${gradeLevel} student.
4. Use grade-appropriate vocabulary.
5. Use ONLY the TEKS codes provided below.

Available TEKS:
${teksDescriptions}

Return ONLY a valid JSON object with this exact structure:
{"questions": [{"afterFirewall": 3, "question": "...", "options": [{"letter": "A", "text": "..."},{"letter": "B", "text": "..."},{"letter": "C", "text": "..."},{"letter": "D", "text": "..."}], "correctAnswer": "A", "teks": "3.13B"}, ...]}

No markdown code fences. No explanation. Just the JSON object.`;
  }

  /* =========================================
     WORKER COMMUNICATION
     ========================================= */

  async _callWorker(messages) {
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
            temperature: this.config.temperature || 0.7,
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
        teks: p.teks || ''
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
    const valid = ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'];
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
      case 'ADD':      return a + b;
      case 'SUBTRACT': return a - b;
      case 'MULTIPLY': return a * b;
      case 'DIVIDE':   return a / b;
      default:         return a + b;
    }
  }

  _formatExpression(operation, operands) {
    const [a, b] = operands;
    const symbols = { 'ADD': '+', 'SUBTRACT': '-', 'MULTIPLY': '\u00D7', 'DIVIDE': '\u00F7' };
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

console.log('[CerebrasAPI] Module loaded — test with: cerebrasAPI.generateMission(3, ["3.4A","3.4F","3.4J"], ["3.6B","3.13B"]).then(console.log)');
