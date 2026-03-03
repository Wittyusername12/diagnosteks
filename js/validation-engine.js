/* =========================================
   VALIDATION ENGINE — Layers 1–4 (sync, instant)
   Iron Man STEM Mission — Teacher Review Screen

   Self-contained module. Pure functions — no DOM, no side effects.
   Receives teksRules object as parameter (does not load it itself).

   Exports (global): validateProblem, validateAllProblems, computeCompositeScore
   ========================================= */

/**
 * Validate a single problem against all 4 layers.
 *
 * @param {object} problem — Review-schema problem:
 *   Math:    { type:'math', displayText, numbers, operation, expression, answer, teks, gradeLevel, answerType }
 *   Science: { type:'science', question, options, correctIndex, teks, gradeLevel }
 * @param {object} teksRules — Parsed teks-rules.json keyed by TEKS code
 * @returns {{ category: 'green'|'yellow'|'red', chips: object, flags: string[], scores: object }}
 */
function validateProblem(problem, teksRules) {
  const isScience = problem.type === 'science' || !!problem.question;
  const flags = [];

  // ── Layer 1 — Structural Validation (HARD GATE) ──────────────
  let structuralValid = true;
  if (isScience) {
    if (typeof problem.question !== 'string' || !problem.question.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing "question" field');
    }
    if (!Array.isArray(problem.options) || problem.options.length < 4) {
      structuralValid = false; flags.push('Layer 1 Structure: Must have 4 answer options');
    }
    if (typeof problem.correctIndex !== 'number' || problem.correctIndex < 0 || problem.correctIndex > 3) {
      structuralValid = false; flags.push('Layer 1 Structure: correctIndex must be 0-3');
    }
    if (typeof problem.teks !== 'string' || !problem.teks.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing TEKS code');
    }
  } else {
    if (typeof problem.displayText !== 'string' || !problem.displayText.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing word problem text');
    }
    if (!Array.isArray(problem.numbers) || problem.numbers.length < 1) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing numbers array');
    }
    if (typeof problem.operation !== 'string' || !problem.operation.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing operation');
    }
    if (typeof problem.expression !== 'string' || !problem.expression.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing expression');
    }
    if (problem.answer === undefined || problem.answer === null) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing expected answer');
    }
    if (typeof problem.teks !== 'string' || !problem.teks.trim()) {
      structuralValid = false; flags.push('Layer 1 Structure: Missing TEKS code');
    }
  }

  // ── Layer 2 — Math / Science Verification (HARD GATE) ────────
  let mathCorrect = true;
  if (isScience) {
    // Science structural verification
    if (structuralValid) {
      if (!Array.isArray(problem.options) || problem.options.length !== 4) {
        mathCorrect = false; flags.push('Layer 2 Science: Must have exactly 4 options');
      }
      if (typeof problem.correctIndex !== 'number' || problem.correctIndex < 0 || problem.correctIndex > 3) {
        mathCorrect = false; flags.push('Layer 2 Science: correctIndex must be 0-3');
      }
      if (teksRules && problem.teks && !teksRules[problem.teks]) {
        // Not a hard fail for science — just note it
      }
    }
  } else if (structuralValid) {
    // Math verification using math.js (if available) or manual computation
    const computedAnswer = _computeFromExpression(problem.expression);
    if (computedAnswer !== null) {
      if (Math.abs(computedAnswer - problem.answer) > 0.001) {
        mathCorrect = false;
        flags.push(`Layer 2 Math VIOLATION: Expression "${problem.expression}" evaluates to ${computedAnswer}, but expected answer is ${problem.answer}`);
      }
    }

    // Also verify via operands + operation (belt and suspenders)
    if (problem.numbers && problem.numbers.length >= 2 && problem.operation) {
      const opAnswer = _computeFromOperands(problem.operation, problem.numbers);
      if (opAnswer !== null && Math.abs(opAnswer - problem.answer) > 0.001) {
        mathCorrect = false;
        flags.push(`Layer 2 Math VIOLATION: ${problem.operation}(${problem.numbers.join(', ')}) = ${opAnswer}, but expected answer is ${problem.answer}`);
      }
    }

    // Division: check clean division for integer-answer TEKS
    if (problem.operation === 'DIVIDE' && problem.numbers && problem.numbers.length >= 2) {
      if (problem.answerType !== 'fraction' && problem.numbers[1] !== 0 && problem.numbers[0] % problem.numbers[1] !== 0) {
        flags.push(`Layer 2 Math Warning: ${problem.numbers[0]} ÷ ${problem.numbers[1]} does not divide evenly`);
      }
    }

    // Division by zero
    if (problem.operation === 'DIVIDE' && problem.numbers && problem.numbers[1] === 0) {
      mathCorrect = false;
      flags.push('Layer 2 Math VIOLATION: Division by zero');
    }

    // MC-specific validation (only for multipleChoice math problems)
    if (problem.answerType === 'multipleChoice' && problem.mcOptions) {
      const opts = problem.mcOptions;

      // Check 1: exactly 4 distinct options with letter and text
      if (!Array.isArray(opts) || opts.length !== 4) {
        mathCorrect = false;
        flags.push(`Layer 2 MC VIOLATION: Expected 4 options, got ${Array.isArray(opts) ? opts.length : 0}`);
      } else {
        const hasFields = opts.every(o => o && typeof o.letter === 'string' && o.text !== undefined);
        if (!hasFields) {
          mathCorrect = false;
          flags.push('Layer 2 MC VIOLATION: Each option must have "letter" and "text" fields');
        }

        // Check duplicate option texts
        const texts = opts.map(o => String(o.text).trim());
        if (new Set(texts).size !== texts.length) {
          mathCorrect = false;
          flags.push('Layer 2 MC VIOLATION: Duplicate option texts detected — all 4 options must have distinct values');
        }

        // Check 2: correctAnswer letter is valid
        const correctLetter = problem.mcCorrectLetter;
        if (!correctLetter || !['A', 'B', 'C', 'D'].includes(correctLetter)) {
          mathCorrect = false;
          flags.push(`Layer 2 MC VIOLATION: correctAnswer letter "${correctLetter}" is not A, B, C, or D`);
        }

        // Check 3: correct option matches JS-computed answer
        if (correctLetter && typeof problem.answer === 'number') {
          const correctOpt = opts.find(o => o.letter === correctLetter);
          if (correctOpt) {
            const optNum = parseFloat(String(correctOpt.text).replace(/,/g, '').trim());
            if (!isNaN(optNum) && Math.abs(optNum - problem.answer) > 0.001) {
              mathCorrect = false;
              flags.push(`Layer 2 MC VIOLATION: Option ${correctLetter} is "${correctOpt.text}" (${optNum}), but computed answer is ${problem.answer}`);
            }
          }
        }

        // Check 4: no duplicate numeric values across options
        const numericVals = opts.map(o => parseFloat(String(o.text).replace(/,/g, '').trim())).filter(n => !isNaN(n));
        if (numericVals.length === 4 && new Set(numericVals).size !== 4) {
          mathCorrect = false;
          flags.push('Layer 2 MC VIOLATION: Duplicate numeric values among options — all 4 values must be distinct');
        }

        // Check 5: consecutive integers (WARN) — no diagnostic value
        if (numericVals.length === 4 && numericVals.every(v => Number.isInteger(v))) {
          const sorted = [...numericVals].sort((a, b) => a - b);
          const isConsecutive = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
          if (isConsecutive) {
            flags.push(`Layer 2 MC WARNING: Options are consecutive integers (${sorted.join(', ')}) — no diagnostic value, distractors should target specific student errors`);
          }
        }

        // Check 6: narrow spread for division (WARN) — distractors too close to answer
        if (numericVals.length === 4 && problem.operation === 'DIVIDE' && typeof problem.answer === 'number') {
          const sorted = [...numericVals].sort((a, b) => a - b);
          const spread = sorted[3] - sorted[0];
          // For division, spread should be at least 3× the correct answer or at least 10
          const minSpread = Math.max(10, problem.answer * 3);
          if (spread < minSpread && problem.answer > 2) {
            flags.push(`Layer 2 MC WARNING: Narrow value spread for division (range: ${sorted[0]}-${sorted[3]}, spread: ${spread}) — STAAR distractors use wrong-operation values with wide spread`);
          }
        }

        // Check 7: distractorRationales completeness (WARN)
        if (correctLetter && problem.distractorRationales) {
          const wrongLetters = ['A', 'B', 'C', 'D'].filter(l => l !== correctLetter);
          const missingRationales = wrongLetters.filter(l => !problem.distractorRationales[l] || String(problem.distractorRationales[l]).trim().length < 10);
          if (missingRationales.length > 0) {
            flags.push(`Layer 2 MC WARNING: Missing or inadequate rationales for distractor(s) ${missingRationales.join(', ')} — each distractor should have a rationale explaining the student error`);
          }
        }
      }
    }
  }

  // ── Layer 3 — Content Policy & Sensibility (SOFT warnings) ───
  const contentFlags = [];
  if (structuralValid && !isScience) {
    const text = problem.displayText || '';
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

    // Word count check (30-80 words for word problems) — skip for bare math
    if (problem.format !== 'bare' && wordCount > 0 && wordCount < 10 && problem.answerType !== 'multipleChoice') {
      contentFlags.push('Layer 3 Content: Narrative is very short (fewer than 10 words) — may be bare math, not a word problem');
    }

    // Negative results for young grades
    if (problem.gradeLevel && problem.gradeLevel <= 3 && typeof problem.answer === 'number' && problem.answer < 0) {
      contentFlags.push(`Layer 3 Content: Negative answer (${problem.answer}) not appropriate for Grade ${problem.gradeLevel}`);
    }

    // Fractional people/animals
    const peopleWords = ['friends', 'students', 'people', 'dogs', 'cats', 'children', 'kids', 'boys', 'girls', 'teachers', 'birds', 'fish'];
    const textLower = text.toLowerCase();
    const mentionsPeople = peopleWords.some(w => textLower.includes(w));
    if (mentionsPeople && typeof problem.answer === 'number' && !Number.isInteger(problem.answer)) {
      contentFlags.push('Layer 3 Content: Answer is not a whole number, but problem mentions people/animals');
    }

    // NOTE: TEKS range checks (answer exceeds max, below min) are EXCLUSIVELY in Layer 4.
    // Do NOT add teksRules-based checks here — that causes duplicate violations.

    // Keyword-operation consistency (soft warning)
    // ONLY high-confidence multi-word phrases — no single-word matching (too ambiguous)
    // Skip entirely for bare math problems (no narrative to check)
    if (problem.format !== 'bare' && problem.operation) {
      const highConfidencePhrases = [
        // DIVIDE — only when sharing/splitting is explicit
        ['shared equally among', 'DIVIDE'], ['shared equally between', 'DIVIDE'],
        ['split equally among', 'DIVIDE'], ['split equally between', 'DIVIDE'],
        ['divided equally among', 'DIVIDE'], ['divided equally between', 'DIVIDE'],
        ['distribute equally among', 'DIVIDE'],
        // ADD — only when combining is explicit
        ['how many altogether', 'ADD'], ['how many in all', 'ADD'],
        ['how much altogether', 'ADD'], ['how much in all', 'ADD'],
        // SUBTRACT — only when comparison/removal is explicit
        ['how many more than', 'SUBTRACT'], ['how many fewer than', 'SUBTRACT'],
        ['how much more than', 'SUBTRACT'], ['how much less than', 'SUBTRACT'],
        ['what is the difference', 'SUBTRACT'],
        // MULTIPLY — only when grouping is unambiguous
        ['times as many', 'MULTIPLY'], ['times as much', 'MULTIPLY'],
      ];

      const suggested = new Set();
      for (const [phrase, op] of highConfidencePhrases) {
        if (textLower.includes(phrase)) suggested.add(op);
      }

      if (suggested.size > 0 && !suggested.has(problem.operation)) {
        const suggestedList = Array.from(suggested).join(' or ');
        contentFlags.push(`Layer 3 Content: Narrative suggests ${suggestedList} but operation is ${problem.operation} (may be intentional)`);
      }
    }

    // Weapon / violence term check — inappropriate for elementary classrooms
    const blockedTerms = [
      'bullet', 'bullets', 'ammunition', 'ammo',
      'gun', 'guns', 'rifle', 'pistol', 'weapon', 'weapons',
      'sword', 'knife', 'bomb', 'explosive', 'grenade', 'missile',
      'shoot', 'shooting', 'kill', 'killing', 'murder',
      'dead', 'death', 'die', 'dies',
      'blood', 'wound', 'stab',
      'attack', 'fight', 'fighting', 'war',
      'destroy', 'destruction',
      'punch', 'hit', 'slap', 'kick'
    ];
    // Build word-boundary regex so "hit" doesn't match "white" etc.
    const blockedRegex = new RegExp('\\b(' + blockedTerms.join('|') + ')\\b', 'i');
    const narrativeMatch = textLower.match(blockedRegex);
    if (narrativeMatch) {
      contentFlags.push(`Layer 3 Content: Narrative contains inappropriate term "${narrativeMatch[0]}" — not suitable for elementary classrooms`);
    }

    // YELLOW-tier terms — acceptable in Avengers/STAAR context but worth noting
    const yellowTerms = ['battle'];
    const yellowRegex = new RegExp('\\b(' + yellowTerms.join('|') + ')\\b', 'i');
    const yellowMatch = textLower.match(yellowRegex);
    if (yellowMatch) {
      contentFlags.push(`Layer 3 Content (YELLOW): Narrative uses "${yellowMatch[0]}" — acceptable in Avengers context but review for appropriateness`);
    }
  }
  flags.push(...contentFlags);

  // ── Layer 4 — TEKS Alignment (HARD GATE) ─────────────────────
  let teksAligned = true;
  const teksFlags = [];

  if (structuralValid && teksRules && problem.teks) {
    const rule = teksRules[problem.teks];

    if (!rule) {
      teksAligned = true; // Unknown TEKS — don't block, but note it
      teksFlags.push(`Layer 4 TEKS: Code "${problem.teks}" not found in teks-rules.json — skipping alignment check`);
    } else if (!rule.validatable) {
      // Non-validatable standard — pass automatically
    } else {
      // CHECK 1 — Operation Match
      if (rule.operations && rule.operations.length > 0 && !isScience) {
        if (problem.operation && !rule.operations.includes(problem.operation)) {
          teksAligned = false;
          teksFlags.push(`Layer 4 TEKS VIOLATION: Operation "${problem.operation}" not allowed for ${problem.teks}. Permitted: ${rule.operations.join(', ')}`);
        }
      }

      // CHECK 2 — Operand Constraints
      if (rule.operandConstraints && !isScience && problem.numbers) {
        const op1Constraints = rule.operandConstraints.operand1;
        const op2Constraints = rule.operandConstraints.operand2;
        const operations = rule.operations || [];

        // Division under a MULTIPLY+DIVIDE TEKS: constraints describe factor ranges.
        // For "corresponding division facts," the divisor and quotient are the factors.
        const hasBothMultDiv = operations.includes('MULTIPLY') && operations.includes('DIVIDE');
        const isDivision = problem.operation === 'DIVIDE';

        if (isDivision && hasBothMultDiv) {
          // Divisor (operand2) checked against operand2 constraints — same as normal
          if (op2Constraints && problem.numbers[1] !== undefined && problem.numbers[1] !== null) {
            const divisor = Math.abs(typeof problem.numbers[1] === 'number' ? problem.numbers[1] : Number(problem.numbers[1]));
            if (op2Constraints.minValue !== undefined && op2Constraints.minValue !== null && divisor < op2Constraints.minValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Divisor ${problem.numbers[1]}, ${problem.teks} requires minimum ${op2Constraints.minValue}`);
            }
            if (op2Constraints.maxValue !== undefined && op2Constraints.maxValue !== null && divisor > op2Constraints.maxValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Divisor ${problem.numbers[1]}, ${problem.teks} allows maximum ${op2Constraints.maxValue}`);
            }
          }
          // Quotient (answer) checked against operand1 constraints — it's the other factor
          if (op1Constraints && typeof problem.answer === 'number') {
            const quotient = Math.abs(problem.answer);
            if (op1Constraints.minValue !== undefined && op1Constraints.minValue !== null && quotient < op1Constraints.minValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Quotient ${problem.answer}, ${problem.teks} requires factor minimum ${op1Constraints.minValue}`);
            }
            if (op1Constraints.maxValue !== undefined && op1Constraints.maxValue !== null && quotient > op1Constraints.maxValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Quotient ${problem.answer}, ${problem.teks} allows factor maximum ${op1Constraints.maxValue}`);
            }
          }
          // Verify exact division (no remainder) for corresponding division facts
          if (problem.numbers[1] !== 0 && problem.numbers[0] % problem.numbers[1] !== 0) {
            teksAligned = false;
            teksFlags.push(`Layer 4 TEKS VIOLATION: ${problem.numbers[0]} ÷ ${problem.numbers[1]} is not an exact division`);
          }
        } else {
          // Normal operand constraint checking (non-division, or DIVIDE-only TEKS)
          const operandKeys = ['operand1', 'operand2'];
          for (let oi = 0; oi < operandKeys.length; oi++) {
            const constraint = rule.operandConstraints[operandKeys[oi]];
            if (!constraint) continue;
            const value = problem.numbers[oi];
            if (value === undefined || value === null) continue;
            const absVal = Math.abs(typeof value === 'number' ? value : Number(value));
            const digitCount = String(Math.floor(absVal) || 0).length;

            // 2a — Digit count bounds
            if (constraint.minDigits && digitCount < constraint.minDigits) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} has ${digitCount} digit(s), ${problem.teks} requires minimum ${constraint.minDigits}`);
            }
            if (constraint.maxDigits && digitCount > constraint.maxDigits) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} has ${digitCount} digit(s), ${problem.teks} allows maximum ${constraint.maxDigits}`);
            }

            // 2b — Value range bounds
            if (constraint.minValue !== undefined && constraint.minValue !== null && absVal < constraint.minValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} is ${value}, ${problem.teks} requires minimum ${constraint.minValue}`);
            }
            if (constraint.maxValue !== undefined && constraint.maxValue !== null && absVal > constraint.maxValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} is ${value}, ${problem.teks} allows maximum ${constraint.maxValue}`);
            }

            // 2c — Must be multiple of
            if (constraint.mustBeMultipleOf && absVal % constraint.mustBeMultipleOf !== 0) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} is ${value}, must be multiple of ${constraint.mustBeMultipleOf}`);
            }

            // 2d — Allowed values
            if (constraint.allowedValues && !constraint.allowedValues.includes(absVal)) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} is ${value}, must be one of: ${constraint.allowedValues.join(', ')}`);
            }

            // 2e — Exact value
            if (constraint.exactValue !== undefined && constraint.exactValue !== null && absVal !== constraint.exactValue) {
              teksAligned = false;
              teksFlags.push(`Layer 4 TEKS VIOLATION: Operand ${oi + 1} is ${value}, must be exactly ${constraint.exactValue}`);
            }
          }
        }
      }

      // CHECK 3 — Result Range
      if (!isScience && typeof problem.answer === 'number') {
        if (rule.maxResult !== null && rule.maxResult !== undefined && problem.answer > rule.maxResult) {
          teksAligned = false;
          teksFlags.push(`Layer 4 TEKS VIOLATION: Answer ${problem.answer} exceeds ${problem.teks} max result of ${rule.maxResult}`);
        }
        if (rule.minResult !== null && rule.minResult !== undefined && problem.answer < rule.minResult) {
          teksAligned = false;
          teksFlags.push(`Layer 4 TEKS VIOLATION: Answer ${problem.answer} below ${problem.teks} min result of ${rule.minResult}`);
        }
      }

      // CHECK 4 — Denominator Check (fractions)
      if (rule.allowedDenominators && rule.allowedDenominators.length > 0 && !isScience) {
        const denoms = _extractDenominators(problem);
        for (const d of denoms) {
          if (!rule.allowedDenominators.includes(d)) {
            teksAligned = false;
            teksFlags.push(`Layer 4 TEKS VIOLATION: Denominator ${d} not in allowed set: ${rule.allowedDenominators.join(', ')}`);
          }
        }
      }

      // CHECK 5 — Unit Fraction (5.3J, 5.3L)
      if (rule.unitFractionOnly === true && !isScience) {
        const fractions = _extractFractions(problem);
        for (const f of fractions) {
          if (f.numerator !== 1) {
            teksAligned = false;
            teksFlags.push(`Layer 4 TEKS VIOLATION: TEKS requires unit fractions (numerator must be 1), found ${f.numerator}/${f.denominator}`);
          }
        }
      }
    }
  }
  flags.push(...teksFlags);

  // ── TEKS Override handling ───────────────────────────────────
  const teksOverridden = (problem.teksOverride === true && !teksAligned);
  const effectiveTeksAligned = teksOverridden ? true : teksAligned;

  // ── Composite Score ──────────────────────────────────────────
  const signals = {
    structuralValid,
    mathCorrect,
    teksAligned: effectiveTeksAligned,
    contentFlags: teksOverridden ? [...contentFlags, ...teksFlags.map(f => f.replace('VIOLATION', 'OVERRIDE'))] : contentFlags
  };

  const result = computeCompositeScore(signals);

  // Build chips object
  const chips = {
    structure: structuralValid ? 'pass' : 'fail',
    content: contentFlags.length > 0 ? 'warn' : 'pass',
    teks: teksOverridden ? 'override' : (teksAligned ? 'pass' : 'fail'),
    llm: 'pending'
  };

  if (isScience) {
    chips.science = (structuralValid && mathCorrect) ? 'pass' : 'fail';
  } else {
    chips.math = mathCorrect ? 'pass' : 'fail';
  }

  // Custom/uploaded problems skip layers 2-4
  if (problem.source === 'uploaded') {
    chips.math = 'skip';
    chips.science = 'skip';
    chips.content = 'skip';
    chips.teks = 'skip';
    chips.llm = 'skip';
    return { category: 'green', chips, flags: [], scores: { structural: 1, math: 1, content: 1, teks: 1 } };
  }

  return {
    category: result.category,
    chips,
    flags,
    scores: {
      structural: structuralValid ? 1 : 0,
      math: mathCorrect ? 1 : 0,
      content: contentFlags.length === 0 ? 1 : 0.5,
      teks: teksAligned ? 1 : 0
    }
  };
}

/**
 * Validate all problems and return results keyed by problem ID.
 */
function validateAllProblems(problems, teksRules) {
  const results = {};
  for (const p of problems) {
    results[p.id] = validateProblem(p, teksRules);
  }
  return results;
}

/**
 * Compute composite score from signal object.
 * Hard gates (structural, math, TEKS) override everything.
 */
function computeCompositeScore(signals) {
  if (!signals.structuralValid) return { score: 0, category: 'red', reason: 'Invalid structure' };
  if (!signals.mathCorrect) return { score: 0, category: 'red', reason: 'Math answer incorrect' };
  if (!signals.teksAligned) return { score: 0, category: 'red', reason: 'TEKS violation' };
  if (signals.contentFlags && signals.contentFlags.length > 0) return { score: 0.70, category: 'yellow' };
  return { score: 1.0, category: 'green' };
}

/* =========================================
   PRIVATE HELPERS
   ========================================= */

/**
 * Evaluate a math expression string. Normalizes ×, ÷, commas.
 * Uses math.js if available, falls back to manual parse.
 */
function _computeFromExpression(expr) {
  if (!expr || typeof expr !== 'string') return null;

  // Normalize: strip " = ?", replace ×÷, strip commas
  let normalized = expr
    .replace(/\s*=\s*\??\s*$/, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/,/g, '')
    .replace(/\u00D7/g, '*')
    .replace(/\u00F7/g, '/')
    .replace(/\u2212/g, '-')
    .replace(/\u2610/g, '?')  // comparison placeholder
    .trim();

  // Skip comparison expressions
  if (normalized.includes('?')) return null;

  try {
    if (typeof math !== 'undefined' && math.evaluate) {
      return math.evaluate(normalized);
    }
    // Fallback: simple eval for basic arithmetic (safe — only numbers and operators)
    if (/^[\d\s+\-*/().]+$/.test(normalized)) {
      return Function('"use strict"; return (' + normalized + ')')();
    }
  } catch (e) {
    // Expression couldn't be evaluated
  }
  return null;
}

/**
 * Compute answer from operation + operands.
 */
function _computeFromOperands(operation, operands) {
  if (!operands || operands.length < 2) return null;
  const [a, b] = operands;
  switch (operation) {
    case 'ADD': case 'DECIMAL_ADD': return a + b;
    case 'SUBTRACT': case 'DECIMAL_SUBTRACT': return a - b;
    case 'MULTIPLY': case 'DECIMAL_MULTIPLY': return a * b;
    case 'DIVIDE': return b !== 0 ? a / b : null;
    default: return null;
  }
}

/**
 * Extract denominators from a problem (for fraction TEKS checks).
 */
function _extractDenominators(problem) {
  const denoms = [];
  if (problem.numbers) {
    for (const n of problem.numbers) {
      if (typeof n === 'object' && n !== null && n.denominator) {
        denoms.push(n.denominator);
      }
    }
  }
  // Also try parsing expression for fractions like "1/4"
  if (problem.expression) {
    const matches = problem.expression.match(/\d+\s*\/\s*(\d+)/g);
    if (matches) {
      for (const m of matches) {
        const parts = m.split('/');
        if (parts.length === 2) denoms.push(parseInt(parts[1].trim()));
      }
    }
  }
  return denoms;
}

/**
 * Extract fractions from a problem (for unit fraction checks).
 */
function _extractFractions(problem) {
  const fractions = [];
  if (problem.numbers) {
    for (const n of problem.numbers) {
      if (typeof n === 'object' && n !== null && n.numerator !== undefined && n.denominator !== undefined) {
        fractions.push({ numerator: n.numerator, denominator: n.denominator });
      }
    }
  }
  if (problem.expression) {
    const matches = problem.expression.match(/(\d+)\s*\/\s*(\d+)/g);
    if (matches) {
      for (const m of matches) {
        const parts = m.split('/');
        if (parts.length === 2) {
          fractions.push({ numerator: parseInt(parts[0].trim()), denominator: parseInt(parts[1].trim()) });
        }
      }
    }
  }
  return fractions;
}

// Export globally
window.ValidationEngine = { validateProblem, validateAllProblems, computeCompositeScore };
