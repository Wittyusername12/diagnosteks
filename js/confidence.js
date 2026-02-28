/* =========================================
   CONFIDENCE ENGINE — Layer 5 Async Validation
   Iron Man STEM Mission Interface

   Self-consistency voting, Chain-of-Verification
   blind review, rate limiter, composite scoring.

   Backend only — no UI. Testable via browser console.
   ========================================= */

// ============================================================
// RATE LIMITER — Semaphore-based concurrency control
// Prevents more than N concurrent Groq API calls.
// ============================================================

class RateLimiter {
  constructor(maxConcurrent = 3) {
    this._max = maxConcurrent;
    this._running = 0;
    this._queue = [];
  }

  async acquire() {
    if (this._running < this._max) {
      this._running++;
      return;
    }
    return new Promise(resolve => this._queue.push(resolve));
  }

  release() {
    this._running--;
    if (this._queue.length > 0) {
      this._running++;
      this._queue.shift()();
    }
  }

  async run(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

const rateLimiter = new RateLimiter(3);

// ============================================================
// SELF-CONSISTENCY VOTING
// Ask the LLM to solve each math problem 5 times from the
// problem text alone (without seeing the answer). Compare
// the 5 responses for agreement.
// ============================================================

async function selfConsistencyCheck(problem, grade) {
  // Science questions have no math to verify — skip
  if (problem.type === 'science') {
    return { score: 1.0, agreement: 'N/A', details: 'Science question — skipped' };
  }

  const questionText = problem.questionStem || problem.questionText || problem.narrative;
  const expectedAnswer = problem.answer || problem.correctAnswer;

  if (!questionText) {
    return { score: 0.5, agreement: '0/0', details: 'No question text available' };
  }

  // Launch 5 solve attempts through the rate limiter
  const solvePromises = Array.from({ length: 5 }, () =>
    rateLimiter.run(() => window.cerebrasAPI.solveProblem(questionText, grade))
  );

  const results = await Promise.allSettled(solvePromises);
  const answers = results
    .filter(r => r.status === 'fulfilled' && r.value && r.value.answer !== null)
    .map(r => r.value.answer);

  if (answers.length === 0) {
    return { score: 0.5, agreement: '0/5', details: 'All solve attempts failed' };
  }

  // Count agreement (with floating-point tolerance)
  const answerCounts = {};
  answers.forEach(a => {
    const key = Math.round(a * 1000) / 1000;
    answerCounts[key] = (answerCounts[key] || 0) + 1;
  });

  const mostCommon = Object.entries(answerCounts).sort((a, b) => b[1] - a[1])[0];
  const consensusAnswer = Number(mostCommon[0]);
  const consensusCount = mostCommon[1];
  const totalResponses = answers.length;

  // Check if consensus matches JavaScript-computed answer
  const matchesExpected = Math.abs(consensusAnswer - expectedAnswer) < 0.01;

  // Score calculation
  let score;
  const agreementRatio = consensusCount / totalResponses;

  if (matchesExpected && agreementRatio >= 0.8) {
    score = 1.0;  // Strong agreement, matches JS answer
  } else if (matchesExpected && agreementRatio >= 0.6) {
    score = 0.8;  // Moderate agreement, matches JS answer
  } else if (matchesExpected) {
    score = 0.6;  // Low agreement but correct answer found
  } else if (agreementRatio >= 0.8) {
    score = 0.3;  // LLM agrees on a DIFFERENT answer than JS — concerning
  } else {
    score = 0.2;  // Low agreement AND doesn't match — problem text likely ambiguous
  }

  const agreement = `${consensusCount}/${totalResponses}`;

  console.log(`[Confidence] Self-consistency: ${agreement} agree on ${consensusAnswer}, expected ${expectedAnswer}, match=${matchesExpected}, score=${score}`);

  return { score, agreement, consensusAnswer, matchesExpected, details: `${agreement} agree` };
}

// ============================================================
// BLIND REVIEW — Chain-of-Verification
// Ask the LLM to evaluate problem quality against a rubric.
// The reviewer does NOT see the generation prompt.
// ============================================================

async function blindReview(problem, teksCode, grade) {
  const result = await rateLimiter.run(() =>
    window.cerebrasAPI.reviewProblem(problem, teksCode, grade)
  );

  if (!result) {
    console.log(`[Confidence] Blind review failed for ${teksCode}, using default score`);
    return { score: 0.5, rubric: null, concerns: 'Review call failed' };
  }

  // Compute independent average of the 5 rubric dimensions
  const computedScore = (
    (result.clarity || 0.5) +
    (result.solvability || 0.5) +
    (result.gradeAppropriateness || 0.5) +
    (result.teksAlignment || 0.5) +
    (result.engagement || 0.5)
  ) / 5;

  console.log(`[Confidence] Blind review for ${teksCode}: score=${computedScore.toFixed(2)}, concerns="${result.concerns || 'none'}"`);

  return { score: computedScore, rubric: result, concerns: result.concerns || '' };
}

// ============================================================
// PER-PROBLEM ORCHESTRATOR
// Runs self-consistency + blind review in parallel for one problem.
// ============================================================

async function runLayer5Validation(problem, teksCode, teksRule, grade) {
  // Run self-consistency and blind review IN PARALLEL
  const [scResult, reviewResult] = await Promise.allSettled([
    selfConsistencyCheck(problem, grade),
    blindReview(problem, teksCode, grade)
  ]);

  const selfConsistency = scResult.status === 'fulfilled' ? scResult.value : { score: 0.5, agreement: 'error' };
  const review = reviewResult.status === 'fulfilled' ? reviewResult.value : { score: 0.5, concerns: 'error' };

  // Combined Layer 5 score: 60% self-consistency, 40% blind review
  const layer5Score = (0.6 * selfConsistency.score) + (0.4 * review.score);

  return {
    selfConsistency,
    review,
    layer5Score,
    status: layer5Score >= 0.7 ? 'pass' : layer5Score >= 0.4 ? 'warn' : 'fail'
  };
}

// ============================================================
// MISSION-LEVEL ORCHESTRATOR
// Runs Layer 5 for all problems with rate limiting.
// Fires a callback per problem for progressive UI updates.
// ============================================================

async function runLayer5ForMission(problems, grade, onProblemComplete) {
  const teksRules = window.TEKS_RULES || {};

  const promises = problems.map((problem, index) => {
    const teksCode = problem.tpiCode || problem.teksCode || (problem.problemData && problem.problemData.teksCode);
    const teksRule = teksRules[teksCode] || {};

    return runLayer5Validation(problem, teksCode, teksRule, grade)
      .then(result => {
        console.log(`[Confidence] Problem ${index + 1} Layer 5 complete: score=${result.layer5Score.toFixed(2)}, status=${result.status}`);

        // Fire callback for progressive UI update
        if (onProblemComplete) {
          onProblemComplete(index, result);
        }

        return { index, result };
      })
      .catch(err => {
        console.warn(`[Confidence] Problem ${index + 1} Layer 5 failed:`, err);
        const fallback = { selfConsistency: { score: 0.5 }, review: { score: 0.5 }, layer5Score: 0.5, status: 'warn' };
        if (onProblemComplete) onProblemComplete(index, fallback);
        return { index, result: fallback };
      });
  });

  const results = await Promise.allSettled(promises);
  console.log(`[Confidence] All Layer 5 validation complete for ${problems.length} problems`);

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

// ============================================================
// COMPOSITE SCORING
// Combines ALL validation signals (Layers 1-5) into a final
// confidence score and category (green/yellow/red).
// ============================================================

function computeCompositeScore(signals) {
  // Hard gates — immediate red flag, no override possible
  if (!signals.structuralValid) {
    return { score: 0, category: 'red', reason: 'Invalid JSON structure', signals };
  }
  if (!signals.mathCorrect) {
    return { score: 0, category: 'red', reason: 'Math answer is incorrect', signals };
  }

  // Weighted average of all layer signals
  const mathScore = signals.mathScore ?? 1.0;            // Layer 2
  const structuralScore = signals.structuralScore ?? 1.0; // Layer 1
  const contentScore = signals.contentScore ?? 1.0;       // Layer 3
  const teksScore = signals.teksScore ?? 1.0;             // Layer 4
  const llmReviewScore = signals.llmReviewScore ?? 0.5;   // Layer 5 (0.5 = pending/unknown)

  const score = 0.35 * mathScore
              + 0.10 * structuralScore
              + 0.15 * contentScore
              + 0.20 * teksScore
              + 0.20 * llmReviewScore;

  const category = score >= 0.85 ? 'green' : score >= 0.60 ? 'yellow' : 'red';

  return {
    score: Math.round(score * 100),
    category,
    reason: category === 'green' ? 'High confidence' :
            category === 'yellow' ? 'Needs review' :
            'TEKS/Math violation',
    signals
  };
}

// ============================================================
// MODULE EXPORT
// ============================================================

const confidenceEngine = {
  runLayer5Validation,
  runLayer5ForMission,
  computeCompositeScore,
  selfConsistencyCheck,
  blindReview,
  _rateLimiter: rateLimiter
};

if (typeof window !== 'undefined') {
  window.confidenceEngine = confidenceEngine;
  console.log('[Confidence] Engine loaded — test with: confidenceEngine.selfConsistencyCheck(problem, 3).then(console.log)');
}
