/**
 * ============================================================================
 * IRON MAN STEM MISSION - INTEGRATION MODULE
 * ============================================================================
 * 
 * This module connects all the pieces of the mission system:
 *   1. AI Problem Generation (via Cerebras API)
 *   2. Pattern Detection (pattern-detector.js)
 *   3. Audio Playback (pre-synthesized Cartesia files + TTS fallback)
 *   4. Game State Management
 *   5. UI Updates
 *   6. Teacher Controls
 * 
 * ARCHITECTURE OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        MISSION FLOW                                     │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │  [Teacher selects grade + TEKS]                                         │
 * │           ↓                                                             │
 * │  [AI generates 10 math + 3 science problems]                            │
 * │           ↓                                                             │
 * │  [Mission starts - Firewall 1 displayed]                                │
 * │           ↓                                                             │
 * │  [Student enters answer] ──→ [Pattern Detection] ──→ [Hint Selection]   │
 * │           ↓                         ↓                      ↓            │
 * │  [Correct: Advance]      [Track patterns]        [Play appropriate]     │
 * │           ↓                                          [audio file]       │
 * │  [Fury interrupts at FW 3,6,9 with science]                             │
 * │           ↓                                                             │
 * │  [Black Widow appears randomly with hints]                              │
 * │           ↓                                                             │
 * │  [Firewall 10 complete → Victory sequence]                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * DEPENDENCIES:
 *   - pattern-detector.js (for detectMathError function)
 *   - Cerebras API (for problem generation)
 *   - Audio files matching response_bank.md IDs
 * 
 * @author Shane's Iron Man STEM Project
 * @version 2.0
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Import pattern detection (adjust path as needed)
// import { detectMathError, resetHintTracking, getUnusedHintId } from './pattern-detector.js';

// For browser environments, assume pattern-detector.js is loaded and exposes:
// window.PatternDetector.detectMathError()
// window.PatternDetector.resetHintTracking()
// window.PatternDetector.getUnusedHintId()

// ============================================================================
// TYPE DEFINITIONS (JSDoc for IDE support)
// ============================================================================

/**
 * @typedef {Object} Fraction
 * @property {number} num - Numerator
 * @property {number} den - Denominator
 */

/**
 * @typedef {Object} ProblemData
 * @property {string} operation - One of: ADD, SUBTRACT, MULTIPLY, DIVIDE, FRACTION_ADD, FRACTION_SUBTRACT, FRACTION_MULTIPLY, DECIMAL_ADD, DECIMAL_SUBTRACT
 * @property {number[]|{frac1: Fraction, frac2: Fraction}} operands - The numbers involved
 * @property {string} teksCode - e.g., "3.4A"
 * @property {string} difficulty - easy, medium, hard
 * @property {string[]} [diagnosticFor] - Error patterns this problem is good at revealing
 */

/**
 * @typedef {Object} MathProblem
 * @property {string} id - Unique identifier (e.g., "fw-1")
 * @property {number} firewallNumber - 1-10
 * @property {string} narrative - Iron Man themed context
 * @property {string} expression - The math expression (e.g., "35 + 27 = ?")
 * @property {number|Fraction} correctAnswer - The correct answer
 * @property {string} answerType - "integer", "decimal", or "fraction"
 * @property {ProblemData} problemData - Data for pattern detection
 */

/**
 * @typedef {Object} ScienceQuestion
 * @property {string} id - Unique identifier (e.g., "fury-1")
 * @property {number} appearsAtFirewall - 3, 6, or 9
 * @property {string} question - The science question text
 * @property {string[]} options - Multiple choice options (A, B, C, D)
 * @property {number} correctIndex - 0-3 for correct option
 * @property {string} teksCode - Science TEKS alignment
 * @property {string} explanation - Brief explanation of correct answer
 */

/**
 * @typedef {Object} DetectionResult
 * @property {boolean} correct - Whether answer was correct
 * @property {string} [pattern] - Detected error pattern
 * @property {number} [confidence] - 0-1 confidence score
 * @property {string} [hintId] - Response bank hint ID
 * @property {string} [widowHintId] - Black Widow hint ID
 * @property {boolean} [meetsThreshold] - If confidence >= 80%
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Pattern detection
  CONFIDENCE_THRESHOLD: 0.80,
  
  // Hint triggering
  WRONG_ATTEMPTS_BEFORE_HINT: 2,      // Auto-hint after this many wrong
  WRONG_ATTEMPTS_BEFORE_WIDOW: 3,     // Widow can appear after this many
  WIDOW_APPEARANCE_CHANCE: 0.5,       // 50% chance when conditions met
  MAX_WIDOW_APPEARANCES: 4,           // Maximum times Widow appears per mission
  MIN_FIREWALLS_BETWEEN_WIDOW: 2,     // Don't show Widow on consecutive firewalls
  
  // Fury science interruptions
  FURY_FIREWALLS: [3, 6, 9],
  
  // Timing (milliseconds)
  DELAY_AFTER_CORRECT: 2000,
  DELAY_AFTER_WRONG: 1500,
  DELAY_BEFORE_HINT: 1000,
  DELAY_BEFORE_WIDOW: 500,
  
  // Audio
  AUDIO_PATH: './audio/',             // Path to audio files
  AUDIO_EXTENSION: '.wav',
  USE_TTS_FALLBACK: true,             // Use browser TTS if audio file missing
  
  // Problem generation
  PROBLEMS_PER_MISSION: 10,
  SCIENCE_QUESTIONS_PER_MISSION: 3,
  
  // API - Using Cerebras for fast inference (pre-generation)
  CEREBRAS_MODEL: 'llama-3.3-70b',
  API_TIMEOUT: 30000
};

// ============================================================================
// MISSION STATE
// ============================================================================

/**
 * Central state object for the entire mission.
 * This is the single source of truth for mission progress.
 */
let missionState = {
  // === CONFIGURATION (set at mission start) ===
  gradeLevel: null,                    // 1-5
  selectedMathTeks: [],                // Array of TEKS codes selected by teacher
  selectedScienceTeks: [],             // Array of science TEKS codes
  
  // === GENERATED CONTENT (from AI) ===
  mathProblems: [],                    // Array of MathProblem objects
  scienceQuestions: [],                // Array of ScienceQuestion objects
  generationComplete: false,
  generationError: null,
  
  // === MISSION PROGRESS ===
  missionStarted: false,
  missionComplete: false,
  missionPaused: false,
  currentFirewall: 0,                  // 0 = not started, 1-10 during mission
  firewallsCompleted: 0,
  
  // === CURRENT PROBLEM STATE ===
  currentProblem: null,                // Current MathProblem or ScienceQuestion
  currentProblemType: null,            // 'math' or 'science'
  wrongAttemptsThisProblem: 0,
  hintsGivenThisProblem: 0,
  lastDetectedPattern: null,           // Most recent DetectionResult
  
  // === MISSION-WIDE STATISTICS ===
  totalCorrectFirst: 0,                // Correct on first try
  totalWrongAnswers: 0,
  totalHintsGiven: 0,
  patternsEncountered: {},             // { 'FORGOT_TO_CARRY': 3, ... }
  timeStarted: null,
  timeElapsed: 0,
  
  // === CHARACTER APPEARANCES ===
  widowAppearances: 0,
  lastWidowFirewall: -10,              // Start negative so first can appear early
  furyQuestionsCompleted: 0,
  
  // === AUDIO TRACKING (avoid repetition) ===
  usedCorrectIds: new Set(),
  usedWrongIds: new Set(),
  usedHintIds: new Set(),
  usedWidowIds: new Set()
};

/**
 * Resets mission state for a new mission.
 * Call this before starting a new mission.
 */
function resetMissionState() {
  missionState = {
    gradeLevel: null,
    selectedMathTeks: [],
    selectedScienceTeks: [],
    mathProblems: [],
    scienceQuestions: [],
    generationComplete: false,
    generationError: null,
    missionStarted: false,
    missionComplete: false,
    missionPaused: false,
    currentFirewall: 0,
    firewallsCompleted: 0,
    currentProblem: null,
    currentProblemType: null,
    wrongAttemptsThisProblem: 0,
    hintsGivenThisProblem: 0,
    lastDetectedPattern: null,
    totalCorrectFirst: 0,
    totalWrongAnswers: 0,
    totalHintsGiven: 0,
    patternsEncountered: {},
    timeStarted: null,
    timeElapsed: 0,
    widowAppearances: 0,
    lastWidowFirewall: -10,
    furyQuestionsCompleted: 0,
    usedCorrectIds: new Set(),
    usedWrongIds: new Set(),
    usedHintIds: new Set(),
    usedWidowIds: new Set()
  };
  
  // Also reset hint tracking in pattern detector
  if (typeof PatternDetector !== 'undefined') {
    PatternDetector.resetHintTracking();
  }
}

// ============================================================================
// AI PROBLEM GENERATION
// ============================================================================

/**
 * Master prompt template for generating TEKS-aligned math problems.
 * This is sent to Claude API at mission start.
 * 
 * CRITICAL: The AI must output problems in the exact schema expected
 * by the pattern detector. This prompt enforces that schema.
 */
function buildProblemGenerationPrompt(gradeLevel, mathTeks, scienceTeks) {
  return `You are generating math and science problems for an Iron Man-themed classroom STEM mission. Students are "hacking into S.H.I.E.L.D.'s mainframe" by solving math problems to break through firewalls.

## MISSION PARAMETERS
- Grade Level: ${gradeLevel}
- Math TEKS to cover: ${mathTeks.join(', ')}
- Science TEKS for Fury questions: ${scienceTeks.join(', ')}

## OUTPUT REQUIREMENTS
You must output valid JSON with exactly this structure:
{
  "mathProblems": [/* 10 problems */],
  "scienceQuestions": [/* 3 questions */]
}

## MATH PROBLEM SCHEMA (generate exactly 10)
Each math problem must have this exact structure:
{
  "id": "fw-1",                           // fw-1 through fw-10
  "firewallNumber": 1,                    // 1-10
  "narrative": "Jarvis is calculating...",// Iron Man themed context (1-2 sentences)
  "expression": "35 + 27 = ?",            // The actual math expression
  "correctAnswer": 62,                    // Number for integers/decimals, object for fractions
  "answerType": "integer",                // "integer", "decimal", or "fraction"
  "problemData": {
    "operation": "ADD",                   // MUST be one of: ADD, SUBTRACT, MULTIPLY, DIVIDE, FRACTION_ADD, FRACTION_SUBTRACT, FRACTION_MULTIPLY, DECIMAL_ADD, DECIMAL_SUBTRACT, DECIMAL_MULTIPLY
    "operands": [35, 27],                 // Array of two numbers, OR object with frac1/frac2 for fractions
    "teksCode": "3.4A",                   // Which TEKS this targets
    "difficulty": "easy",                 // "easy", "medium", or "hard"
    "diagnosticFor": ["FORGOT_TO_CARRY"]  // Error patterns this problem is good at revealing (optional)
  }
}

## FRACTION PROBLEMS (for grades 3-5)
For fraction problems, use this format:
{
  "id": "fw-7",
  "firewallNumber": 7,
  "narrative": "The arc reactor efficiency calculation requires...",
  "expression": "1/2 + 1/3 = ?",
  "correctAnswer": {"num": 5, "den": 6},  // Fraction object
  "answerType": "fraction",
  "problemData": {
    "operation": "FRACTION_ADD",
    "operands": {
      "frac1": {"num": 1, "den": 2},
      "frac2": {"num": 1, "den": 3}
    },
    "teksCode": "5.3H",
    "difficulty": "medium",
    "diagnosticFor": ["ADD_BOTH_NUM_AND_DEN"]
  }
}

## SCIENCE QUESTION SCHEMA (generate exactly 3)
{
  "id": "fury-1",
  "appearsAtFirewall": 3,               // Must be 3, 6, or 9
  "question": "Which of the following is a conductor of electricity?",
  "options": ["Rubber", "Copper", "Plastic", "Wood"],
  "correctIndex": 1,                    // 0-based index (B = Copper)
  "teksCode": "4.8B",
  "explanation": "Copper is a metal that allows electrons to flow freely."
}

## DIFFICULTY PROGRESSION
- Firewalls 1-3: Easy problems (single-digit or simple two-digit)
- Firewalls 4-7: Medium problems (multi-digit, some regrouping)
- Firewalls 8-10: Hard problems (complex operations, fractions/decimals if grade-appropriate)

## DIAGNOSTIC PROBLEMS
Some problems should be specifically chosen because they reveal common errors:
- Problems with carrying (like 47 + 28) reveal FORGOT_TO_CARRY
- Problems with borrowing across zeros (like 302 - 167) reveal STOP_BORROW_AT_ZERO
- Fraction addition with different denominators reveals ADD_BOTH_NUM_AND_DEN
- Decimal operations reveal DECIMAL_PLACE_ERROR

## NARRATIVE THEMES
Use Iron Man/Stark Industries themed narratives like:
- "Jarvis is calculating the number of suit components..."
- "The arc reactor requires exactly X units of power..."
- "Decrypt the coordinates to Stark Tower..."
- "Calculate the repulsor beam trajectory..."
- "Determine the number of S.H.I.E.L.D. agents in the building..."

## GRADE-SPECIFIC NUMBER RANGES
- Grade 1: Numbers 0-20, basic addition/subtraction
- Grade 2: Numbers 0-100, addition/subtraction with some regrouping
- Grade 3: Numbers 0-1000, multiplication facts, simple fractions
- Grade 4: Multi-digit multiplication/division, fractions, decimals to hundredths
- Grade 5: All operations, complex fractions, decimals, order of operations

Generate the problems now as valid JSON:`;
}

/**
 * Generates mission problems using Cerebras API.
 * Returns structured problem data for the entire mission.
 * 
 * @param {number} gradeLevel - 1-5
 * @param {string[]} mathTeks - Array of math TEKS codes
 * @param {string[]} scienceTeks - Array of science TEKS codes
 * @returns {Promise<{mathProblems: MathProblem[], scienceQuestions: ScienceQuestion[]}>}
 */
async function generateMissionProblems(gradeLevel, mathTeks, scienceTeks) {
  const prompt = buildProblemGenerationPrompt(gradeLevel, mathTeks, scienceTeks);
  
  try {
    // Call Cerebras API
    // NOTE: In browser, this would go through your backend proxy to hide API key
    const response = await fetch('/api/generate-problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.CEREBRAS_MODEL,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
      timeout: CONFIG.API_TIMEOUT
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    // Cerebras uses OpenAI-compatible format
    const content = data.choices[0].message.content;
    
    // Parse JSON from response (handle markdown code blocks if present)
    let jsonStr = content;
    if (content.includes('```json')) {
      jsonStr = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
      jsonStr = content.split('```')[1].split('```')[0];
    }
    
    const problems = JSON.parse(jsonStr.trim());
    
    // Validate structure
    if (!problems.mathProblems || problems.mathProblems.length !== 10) {
      throw new Error('Invalid math problems structure');
    }
    if (!problems.scienceQuestions || problems.scienceQuestions.length !== 3) {
      throw new Error('Invalid science questions structure');
    }
    
    return problems;
    
  } catch (error) {
    console.error('Problem generation failed:', error);
    
    // Return fallback static problems if AI fails
    return generateFallbackProblems(gradeLevel);
  }
}

/**
 * Fallback static problems if AI generation fails.
 * These are grade-appropriate problems that don't require AI.
 */
function generateFallbackProblems(gradeLevel) {
  // This would contain pre-written problems for each grade level
  // For now, return a simple structure that shows the format
  
  const fallbackMath = [];
  const fallbackScience = [];
  
  // Generate 10 simple addition/subtraction problems
  for (let i = 1; i <= 10; i++) {
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 30) + 5;
    const isAdd = i % 2 === 0;
    
    fallbackMath.push({
      id: `fw-${i}`,
      firewallNumber: i,
      narrative: `Jarvis needs to calculate a security value.`,
      expression: isAdd ? `${num1} + ${num2} = ?` : `${num1} - ${num2} = ?`,
      correctAnswer: isAdd ? num1 + num2 : num1 - num2,
      answerType: 'integer',
      problemData: {
        operation: isAdd ? 'ADD' : 'SUBTRACT',
        operands: [num1, num2],
        teksCode: `${gradeLevel}.4A`,
        difficulty: i <= 3 ? 'easy' : i <= 7 ? 'medium' : 'hard'
      }
    });
  }
  
  // Generate 3 simple science questions
  const scienceTemplates = [
    {
      question: "Which state of matter has a definite shape?",
      options: ["Gas", "Liquid", "Solid", "Plasma"],
      correctIndex: 2,
      teksCode: `${gradeLevel}.6A`,
      explanation: "Solids have a definite shape because their particles are tightly packed."
    },
    {
      question: "What type of energy does the Sun provide to Earth?",
      options: ["Sound energy", "Light and heat energy", "Electrical energy", "Magnetic energy"],
      correctIndex: 1,
      teksCode: `${gradeLevel}.8A`,
      explanation: "The Sun provides light energy and thermal (heat) energy to Earth."
    },
    {
      question: "Which force pulls objects toward Earth?",
      options: ["Magnetism", "Friction", "Gravity", "Electricity"],
      correctIndex: 2,
      teksCode: `${gradeLevel}.7A`,
      explanation: "Gravity is the force that pulls all objects toward the center of Earth."
    }
  ];
  
  scienceTemplates.forEach((template, index) => {
    fallbackScience.push({
      id: `fury-${index + 1}`,
      appearsAtFirewall: CONFIG.FURY_FIREWALLS[index],
      ...template
    });
  });
  
  return {
    mathProblems: fallbackMath,
    scienceQuestions: fallbackScience
  };
}

// ============================================================================
// ANSWER PROCESSING
// ============================================================================

/**
 * Parses raw user input into the appropriate answer type.
 * Handles integers, decimals, and fractions.
 * 
 * @param {string} rawInput - User's typed input
 * @param {string} answerType - Expected type: "integer", "decimal", or "fraction"
 * @returns {{valid: boolean, value: number|Fraction, error?: string}}
 */
function parseAnswer(rawInput, answerType) {
  const input = rawInput.trim();
  
  // Empty input
  if (!input) {
    return { valid: false, error: 'Please enter an answer' };
  }
  
  // === FRACTION PARSING ===
  if (answerType === 'fraction') {
    // Accept formats: "5/6", "5 / 6"
    const fractionMatch = input.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    
    if (!fractionMatch) {
      return { valid: false, error: 'Enter a fraction like 5/6' };
    }
    
    const num = parseInt(fractionMatch[1], 10);
    const den = parseInt(fractionMatch[2], 10);
    
    if (den === 0) {
      return { valid: false, error: 'Denominator cannot be zero' };
    }
    
    return { valid: true, value: { num, den } };
  }
  
  // === DECIMAL PARSING ===
  if (answerType === 'decimal') {
    // Accept formats: "3.5", "3,5" (some locales use comma)
    const normalized = input.replace(',', '.');
    const num = parseFloat(normalized);
    
    if (isNaN(num)) {
      return { valid: false, error: 'Enter a valid decimal number' };
    }
    
    return { valid: true, value: num };
  }
  
  // === INTEGER PARSING ===
  // Default to integer
  // Remove any spaces or commas (some students write "1,234")
  const normalized = input.replace(/[,\s]/g, '');
  const num = parseInt(normalized, 10);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Enter a valid number' };
  }
  
  // Check if they entered a decimal when integer expected
  if (input.includes('.') && Math.floor(num) !== parseFloat(input)) {
    return { valid: false, error: 'Enter a whole number' };
  }
  
  return { valid: true, value: num };
}

/**
 * Main function to process a student's answer submission.
 * This is the core of the game loop.
 * 
 * @param {string} rawInput - The student's typed answer
 * @returns {Promise<void>}
 */
async function processAnswer(rawInput) {
  // Don't process if mission paused or complete
  if (missionState.missionPaused || missionState.missionComplete) {
    return;
  }
  
  const problem = missionState.currentProblem;
  if (!problem) {
    console.error('No current problem set');
    return;
  }
  
  // === STEP 1: PARSE THE ANSWER ===
  const parsed = parseAnswer(rawInput, problem.answerType);
  
  if (!parsed.valid) {
    // Invalid input - show error message but don't count as wrong
    emitEvent('inputError', { message: parsed.error });
    return;
  }
  
  // === STEP 2: RUN PATTERN DETECTION ===
  const result = detectMathError(
    problem.correctAnswer,
    parsed.value,
    problem.problemData,
    missionState.gradeLevel
  );
  
  // Store result for potential hint use
  missionState.lastDetectedPattern = result;
  
  // === STEP 3: HANDLE CORRECT ANSWER ===
  if (result.correct) {
    await handleCorrectAnswer();
    return;
  }
  
  // === STEP 4: HANDLE WRONG ANSWER ===
  await handleWrongAnswer(result);
}

/**
 * Handles a correct answer submission.
 * Plays audio, updates state, advances firewall.
 */
async function handleCorrectAnswer() {
  // Track statistics
  if (missionState.wrongAttemptsThisProblem === 0) {
    missionState.totalCorrectFirst++;
  }
  
  // Play correct audio
  const audioId = getUnusedAudioId('correct');
  await playAudio(audioId);
  
  // Update UI
  emitEvent('answerCorrect', {
    firewall: missionState.currentFirewall,
    firstTry: missionState.wrongAttemptsThisProblem === 0
  });
  
  // Wait for audio/celebration
  await delay(CONFIG.DELAY_AFTER_CORRECT);
  
  // Check if this was a Fury science question
  if (missionState.currentProblemType === 'science') {
    missionState.furyQuestionsCompleted++;
    emitEvent('furyComplete', { questionsCompleted: missionState.furyQuestionsCompleted });
  }
  
  // Advance to next firewall
  await advanceFirewall();
}

/**
 * Handles a wrong answer submission.
 * Plays audio, runs hint logic, potentially triggers Black Widow.
 * 
 * @param {DetectionResult} detectionResult - Result from pattern detector
 */
async function handleWrongAnswer(detectionResult) {
  // Update statistics
  missionState.wrongAttemptsThisProblem++;
  missionState.totalWrongAnswers++;
  
  // Track pattern if detected
  if (detectionResult.pattern && detectionResult.pattern !== 'UNKNOWN') {
    missionState.patternsEncountered[detectionResult.pattern] = 
      (missionState.patternsEncountered[detectionResult.pattern] || 0) + 1;
  }
  
  // Play wrong answer audio
  const wrongAudioId = getUnusedAudioId('wrong');
  await playAudio(wrongAudioId);
  
  // Update UI
  emitEvent('answerWrong', {
    firewall: missionState.currentFirewall,
    attempts: missionState.wrongAttemptsThisProblem,
    pattern: detectionResult.pattern,
    confidence: detectionResult.confidence
  });
  
  // Wait before hint
  await delay(CONFIG.DELAY_AFTER_WRONG);
  
  // === HINT LOGIC ===
  // Only auto-hint after threshold number of wrong attempts
  if (missionState.wrongAttemptsThisProblem >= CONFIG.WRONG_ATTEMPTS_BEFORE_HINT) {
    await triggerHint(detectionResult, 'auto');
  }
  
  // === BLACK WIDOW LOGIC ===
  // Check if Widow should appear
  if (shouldTriggerBlackWidow()) {
    await delay(CONFIG.DELAY_BEFORE_WIDOW);
    await triggerBlackWidow(detectionResult);
  }
}

/**
 * Determines if Black Widow should appear.
 * Based on wrong answer count, appearance limits, and spacing.
 */
function shouldTriggerBlackWidow() {
  // Check basic conditions
  if (missionState.wrongAttemptsThisProblem < CONFIG.WRONG_ATTEMPTS_BEFORE_WIDOW) {
    return false;
  }
  
  if (missionState.widowAppearances >= CONFIG.MAX_WIDOW_APPEARANCES) {
    return false;
  }
  
  // Don't appear on consecutive firewalls
  const firewallGap = missionState.currentFirewall - missionState.lastWidowFirewall;
  if (firewallGap < CONFIG.MIN_FIREWALLS_BETWEEN_WIDOW) {
    return false;
  }
  
  // Random chance
  return Math.random() < CONFIG.WIDOW_APPEARANCE_CHANCE;
}

// ============================================================================
// HINT SYSTEM
// ============================================================================

/**
 * Triggers a hint based on detection results.
 * Can be triggered automatically or manually by teacher.
 * 
 * @param {DetectionResult} detectionResult - Pattern detection result
 * @param {string} source - 'auto' or 'manual' (teacher pressed H)
 */
async function triggerHint(detectionResult, source) {
  missionState.hintsGivenThisProblem++;
  missionState.totalHintsGiven++;
  
  let hintId;
  
  // Use specific pattern hint if confidence is high enough
  if (detectionResult && detectionResult.meetsThreshold) {
    // High confidence - use pattern-specific hint
    hintId = getUnusedHintIdFromPool(detectionResult.pattern);
    
    emitEvent('hintTriggered', {
      source,
      type: 'pattern',
      pattern: detectionResult.pattern,
      hintId
    });
  } else {
    // Low confidence - use generic hint
    hintId = getUnusedHintIdFromPool('generic');
    
    emitEvent('hintTriggered', {
      source,
      type: 'generic',
      hintId
    });
  }
  
  // Play hint audio
  await playAudio(hintId);
}

/**
 * Gets an unused hint ID to avoid repetition.
 * Falls back to generic hints if needed.
 * 
 * @param {string} pattern - Error pattern or 'generic'
 * @returns {string} Hint ID from response bank
 */
function getUnusedHintIdFromPool(pattern) {
  // Map patterns to hint IDs (same as in pattern-detector.js)
  const patternHints = {
    'OFF_BY_ONE': ['HINT-PAT-01', 'HINT-PAT-02'],
    'OFF_BY_TEN': ['HINT-PAT-03', 'HINT-PAT-04'],
    'OFF_BY_HUNDRED': ['HINT-PAT-05'],
    'DIGIT_TRANSPOSITION': ['HINT-PAT-06', 'HINT-PAT-07'],
    'FORGOT_TO_CARRY': ['HINT-PAT-08', 'HINT-PAT-09'],
    'RECORDED_BOTH_DIGITS': ['HINT-PAT-08', 'HINT-PAT-09'],
    'FORGOT_TO_BORROW': ['HINT-PAT-10'],
    'SMALLER_FROM_LARGER': ['HINT-PAT-10'],
    'BORROW_NO_DECREMENT': ['HINT-PAT-10'],
    'STOP_BORROW_AT_ZERO': ['HINT-PAT-10'],
    'WRONG_OPERATION': ['HINT-PAT-11', 'HINT-PAT-12'],
    'ADDED_INSTEAD_OF_SUBTRACTED': ['HINT-PAT-19'],
    'MULTIPLIED_INSTEAD_OF_ADDED': ['HINT-PAT-13'],
    'DIVIDED_INSTEAD_OF_MULTIPLIED': ['HINT-PAT-20'],
    'OFF_BY_ONE_GROUP': ['HINT-PAT-14'],
    'MULTIPLICATION_TABLE_ERROR': ['HINT-PAT-14'],
    'DECIMAL_PLACE_ERROR': ['HINT-PAT-15', 'HINT-PAT-16'],
    'DECIMAL_IGNORED': ['HINT-PAT-15', 'HINT-PAT-16'],
    'ADD_BOTH_NUM_AND_DEN': ['HINT-PAT-17'],
    'LCD_WITHOUT_ADJUSTMENT': ['HINT-PAT-17'],
    'FRACTION_NOT_SIMPLIFIED': ['HINT-PAT-18'],
    'generic': [
      'HINT-GEN-01', 'HINT-GEN-02', 'HINT-GEN-03', 'HINT-GEN-04', 'HINT-GEN-05',
      'HINT-GEN-06', 'HINT-GEN-07', 'HINT-GEN-08', 'HINT-GEN-09', 'HINT-GEN-10',
      'HINT-GEN-11', 'HINT-GEN-12', 'HINT-GEN-13', 'HINT-GEN-14', 'HINT-GEN-15'
    ]
  };
  
  const available = patternHints[pattern] || patternHints['generic'];
  
  // Find unused hint
  const unused = available.filter(id => !missionState.usedHintIds.has(id));
  
  // If all used, reset and pick from full list
  if (unused.length === 0) {
    available.forEach(id => missionState.usedHintIds.delete(id));
    const selected = randomChoice(available);
    missionState.usedHintIds.add(selected);
    return selected;
  }
  
  const selected = randomChoice(unused);
  missionState.usedHintIds.add(selected);
  return selected;
}

/**
 * Triggers Black Widow's appearance with a hint.
 * 
 * @param {DetectionResult} detectionResult - Pattern detection result
 */
async function triggerBlackWidow(detectionResult) {
  missionState.widowAppearances++;
  missionState.lastWidowFirewall = missionState.currentFirewall;
  
  // Get appropriate Widow hint
  const widowHints = {
    'OFF_BY_ONE': ['WIDOW-HINT-01', 'WIDOW-HINT-02'],
    'OFF_BY_TEN': ['WIDOW-HINT-03', 'WIDOW-HINT-04'],
    'OFF_BY_HUNDRED': ['WIDOW-HINT-05'],
    'DIGIT_TRANSPOSITION': ['WIDOW-HINT-06', 'WIDOW-HINT-07'],
    'FORGOT_TO_CARRY': ['WIDOW-HINT-08'],
    'FORGOT_TO_BORROW': ['WIDOW-HINT-09'],
    'SMALLER_FROM_LARGER': ['WIDOW-HINT-09'],
    'WRONG_OPERATION': ['WIDOW-HINT-10', 'WIDOW-HINT-11'],
    'DECIMAL_PLACE_ERROR': ['WIDOW-HINT-12', 'WIDOW-HINT-13'],
    'ADD_BOTH_NUM_AND_DEN': ['WIDOW-HINT-14'],
    'FRACTION_NOT_SIMPLIFIED': ['WIDOW-HINT-15'],
    'OFF_BY_ONE_GROUP': ['WIDOW-HINT-16'],
    'generic': [
      'WIDOW-HINT-GEN-01', 'WIDOW-HINT-GEN-02', 'WIDOW-HINT-GEN-03',
      'WIDOW-HINT-GEN-04', 'WIDOW-HINT-GEN-05', 'WIDOW-HINT-GEN-06',
      'WIDOW-HINT-GEN-07', 'WIDOW-HINT-GEN-08'
    ]
  };
  
  const pattern = (detectionResult && detectionResult.meetsThreshold) 
    ? detectionResult.pattern 
    : 'generic';
  
  const available = widowHints[pattern] || widowHints['generic'];
  const unused = available.filter(id => !missionState.usedWidowIds.has(id));
  const hintId = unused.length > 0 ? randomChoice(unused) : randomChoice(available);
  
  missionState.usedWidowIds.add(hintId);
  
  // Emit event for UI to show Widow overlay
  emitEvent('blackWidowAppears', {
    firewall: missionState.currentFirewall,
    appearance: missionState.widowAppearances,
    hintId
  });
  
  // Play Widow audio
  await playAudio(hintId);
}

// ============================================================================
// MISSION FLOW CONTROL
// ============================================================================

/**
 * Starts a new mission with the given configuration.
 * 
 * @param {number} gradeLevel - 1-5
 * @param {string[]} mathTeks - Selected math TEKS codes
 * @param {string[]} scienceTeks - Selected science TEKS codes
 */
async function startMission(gradeLevel, mathTeks, scienceTeks) {
  // Reset state
  resetMissionState();
  
  // Store configuration
  missionState.gradeLevel = gradeLevel;
  missionState.selectedMathTeks = mathTeks;
  missionState.selectedScienceTeks = scienceTeks;
  
  // Emit loading event
  emitEvent('missionLoading', { gradeLevel });
  
  try {
    // Generate problems via AI
    const problems = await generateMissionProblems(gradeLevel, mathTeks, scienceTeks);
    
    missionState.mathProblems = problems.mathProblems;
    missionState.scienceQuestions = problems.scienceQuestions;
    missionState.generationComplete = true;
    
    // Start the mission
    missionState.missionStarted = true;
    missionState.timeStarted = Date.now();
    
    emitEvent('missionReady', {
      gradeLevel,
      problemCount: problems.mathProblems.length,
      scienceCount: problems.scienceQuestions.length
    });
    
    // Play mission start audio
    await playAudio('START-01');
    
    // Show first firewall
    await advanceFirewall();
    
  } catch (error) {
    missionState.generationError = error.message;
    emitEvent('missionError', { error: error.message });
  }
}

/**
 * Advances to the next firewall (or ends mission if complete).
 */
async function advanceFirewall() {
  missionState.currentFirewall++;
  missionState.firewallsCompleted++;
  missionState.wrongAttemptsThisProblem = 0;
  missionState.hintsGivenThisProblem = 0;
  missionState.lastDetectedPattern = null;
  
  // Check if mission complete
  if (missionState.currentFirewall > CONFIG.PROBLEMS_PER_MISSION) {
    await completeMission();
    return;
  }
  
  // Check for Fury science interruption BEFORE this firewall
  const furyIndex = CONFIG.FURY_FIREWALLS.indexOf(missionState.currentFirewall);
  if (furyIndex !== -1 && missionState.furyQuestionsCompleted <= furyIndex) {
    // Fury appears with science question
    await triggerFuryInterruption(furyIndex);
    return;
  }
  
  // Load math problem for this firewall
  const problem = missionState.mathProblems.find(
    p => p.firewallNumber === missionState.currentFirewall
  );
  
  if (!problem) {
    console.error(`No problem found for firewall ${missionState.currentFirewall}`);
    return;
  }
  
  missionState.currentProblem = problem;
  missionState.currentProblemType = 'math';
  
  emitEvent('firewallStarted', {
    firewall: missionState.currentFirewall,
    problem: {
      narrative: problem.narrative,
      expression: problem.expression,
      answerType: problem.answerType
    }
  });
}

/**
 * Triggers Nick Fury science interruption.
 * 
 * @param {number} furyIndex - 0, 1, or 2 (which Fury question)
 */
async function triggerFuryInterruption(furyIndex) {
  const question = missionState.scienceQuestions[furyIndex];
  
  if (!question) {
    console.error(`No science question found for Fury index ${furyIndex}`);
    // Skip the Fury question and continue to math
    missionState.furyQuestionsCompleted++;
    await loadCurrentMathProblem();
    return;
  }
  
  missionState.currentProblem = question;
  missionState.currentProblemType = 'science';
  
  // Play Fury intro audio (randomly select from available intros for this firewall)
  const furyFirewall = CONFIG.FURY_FIREWALLS[furyIndex];
  const introVariant = Math.floor(Math.random() * 3) + 1;
  const introId = `FURY-INTRO-${furyFirewall}-0${introVariant}`;
  await playAudio(introId);
  
  emitEvent('furyAppears', {
    firewall: missionState.currentFirewall,
    questionIndex: furyIndex,
    question: {
      text: question.question,
      options: question.options
    }
  });
}

/**
 * Loads the current math problem for display.
 * Called after Fury question or when advancing normally.
 */
async function loadCurrentMathProblem() {
  const problem = missionState.mathProblems.find(
    p => p.firewallNumber === missionState.currentFirewall
  );
  
  if (!problem) {
    console.error(`No problem found for firewall ${missionState.currentFirewall}`);
    return;
  }
  
  missionState.currentProblem = problem;
  missionState.currentProblemType = 'math';
  
  emitEvent('firewallStarted', {
    firewall: missionState.currentFirewall,
    problem: {
      narrative: problem.narrative,
      expression: problem.expression,
      answerType: problem.answerType
    }
  });
}

/**
 * Processes answer for Fury's science question.
 * 
 * @param {number} selectedIndex - 0-3 for A-D
 */
async function processScienceAnswer(selectedIndex) {
  const question = missionState.currentProblem;
  
  if (!question || missionState.currentProblemType !== 'science') {
    console.error('No science question active');
    return;
  }
  
  if (selectedIndex === question.correctIndex) {
    // Correct!
    const correctVariant = Math.floor(Math.random() * 10) + 1;
    const correctId = `FURY-CORRECT-${String(correctVariant).padStart(2, '0')}`;
    await playAudio(correctId);
    
    missionState.furyQuestionsCompleted++;
    
    emitEvent('furyAnswerCorrect', {
      firewall: missionState.currentFirewall,
      explanation: question.explanation
    });
    
    await delay(CONFIG.DELAY_AFTER_CORRECT);
    
    // Now show the math problem for this firewall
    await loadCurrentMathProblem();
  } else {
    // Wrong
    missionState.wrongAttemptsThisProblem++;
    missionState.totalWrongAnswers++;
    
    const wrongVariant = Math.floor(Math.random() * 11) + 1;
    const wrongId = `FURY-WRONG-${String(wrongVariant).padStart(2, '0')}`;
    await playAudio(wrongId);
    
    emitEvent('furyAnswerWrong', {
      firewall: missionState.currentFirewall,
      attempts: missionState.wrongAttemptsThisProblem,
      selectedIndex,
      correctIndex: question.correctIndex
    });
  }
}

/**
 * Completes the mission successfully.
 * Plays victory sequence.
 */
async function completeMission() {
  missionState.missionComplete = true;
  missionState.timeElapsed = Date.now() - missionState.timeStarted;
  
  // Play victory audio sequence
  const victoryVariant = Math.floor(Math.random() * 4) + 1;
  const victoryId = `VICTORY-0${victoryVariant}`;
  await playAudio(victoryId);
  
  await delay(2000);
  
  const completeVariant = Math.floor(Math.random() * 4) + 1;
  const completeId = `COMPLETE-0${completeVariant}`;
  await playAudio(completeId);
  
  emitEvent('missionComplete', {
    stats: {
      totalTime: missionState.timeElapsed,
      totalWrong: missionState.totalWrongAnswers,
      correctFirstTry: missionState.totalCorrectFirst,
      hintsUsed: missionState.totalHintsGiven,
      widowAppearances: missionState.widowAppearances,
      patternsEncountered: missionState.patternsEncountered
    }
  });
  
  // Play sign-off after a pause
  await delay(3000);
  const signoffVariant = Math.floor(Math.random() * 4) + 1;
  const signoffId = `SIGNOFF-0${signoffVariant}`;
  await playAudio(signoffId);
}

// ============================================================================
// TEACHER CONTROLS
// ============================================================================

/**
 * Handles keyboard shortcuts for teacher control.
 * Call this from your keydown event listener.
 * 
 * @param {KeyboardEvent} event
 */
function handleTeacherKeypress(event) {
  // Ignore if typing in input field (except Enter for submission)
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.target.value;
      processAnswer(input);
      event.target.value = ''; // Clear input
    }
    return;
  }
  
  switch (event.key.toUpperCase()) {
    case ' ': // Space - Advance (teacher override)
      event.preventDefault();
      teacherAdvance();
      break;
      
    case 'H': // Hint - Manual hint trigger
      event.preventDefault();
      teacherHint();
      break;
      
    case 'M': // Mic Toggle
      event.preventDefault();
      toggleMicrophone();
      break;
      
    case 'P': // Pause
      event.preventDefault();
      pauseMission();
      break;
      
    case 'R': // Resume
      event.preventDefault();
      resumeMission();
      break;
      
    case 'ENTER': // Submit (when not in input field)
      event.preventDefault();
      // Focus the answer input
      const answerInput = document.getElementById('answer-input');
      if (answerInput) answerInput.focus();
      break;
  }
}

/**
 * Teacher manually advances to next firewall.
 * Use for time management or when class needs to move on.
 */
async function teacherAdvance() {
  if (!missionState.missionStarted || missionState.missionComplete) {
    return;
  }
  
  emitEvent('teacherAdvance', { firewall: missionState.currentFirewall });
  
  // If we're on a Fury question, mark it complete
  if (missionState.currentProblemType === 'science') {
    missionState.furyQuestionsCompleted++;
    await loadCurrentMathProblem();
  } else {
    await advanceFirewall();
  }
}

/**
 * Teacher manually triggers a hint.
 */
async function teacherHint() {
  if (!missionState.missionStarted || missionState.missionComplete) {
    return;
  }
  
  // Don't give hints on science questions
  if (missionState.currentProblemType === 'science') {
    return;
  }
  
  // Use last detected pattern if available, otherwise null
  const result = missionState.lastDetectedPattern;
  await triggerHint(result, 'manual');
}

/**
 * Pauses the mission.
 */
async function pauseMission() {
  if (!missionState.missionStarted || missionState.missionComplete) {
    return;
  }
  
  missionState.missionPaused = true;
  
  // Play pause audio
  await playAudio('PAUSE-01');
  
  emitEvent('missionPaused', { firewall: missionState.currentFirewall });
}

/**
 * Resumes the mission.
 */
async function resumeMission() {
  if (!missionState.missionPaused) {
    return;
  }
  
  missionState.missionPaused = false;
  
  // Play resume audio
  await playAudio('RESUME-01');
  
  emitEvent('missionResumed', { firewall: missionState.currentFirewall });
}

/**
 * Toggles microphone (for voice input feature).
 * Placeholder for future voice recognition integration.
 */
function toggleMicrophone() {
  emitEvent('microphoneToggle', {});
  // Voice recognition integration would go here
}

// ============================================================================
// AUDIO SYSTEM
// ============================================================================

/**
 * Plays an audio file by ID.
 * Falls back to browser TTS if file not found.
 * 
 * @param {string} audioId - ID from response bank (e.g., 'CORRECT-01')
 * @returns {Promise<void>}
 */
async function playAudio(audioId) {
  const audioPath = `${CONFIG.AUDIO_PATH}${audioId}${CONFIG.AUDIO_EXTENSION}`;
  
  return new Promise((resolve) => {
    const audio = new Audio(audioPath);
    
    audio.onended = () => resolve();
    
    audio.onerror = async () => {
      console.warn(`Audio file not found: ${audioPath}`);
      
      if (CONFIG.USE_TTS_FALLBACK) {
        // Get text from response bank and use TTS
        const text = getAudioText(audioId);
        if (text) {
          await speakText(text);
        }
      }
      resolve();
    };
    
    audio.play().catch(error => {
      console.warn('Audio play failed:', error);
      resolve();
    });
  });
}

/**
 * Uses browser TTS as fallback for missing audio files.
 * 
 * @param {string} text - Text to speak
 * @returns {Promise<void>}
 */
function speakText(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to find a British English voice for Jarvis
    const voices = speechSynthesis.getVoices();
    const britishVoice = voices.find(v => v.lang.includes('en-GB'));
    if (britishVoice) {
      utterance.voice = britishVoice;
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    speechSynthesis.speak(utterance);
  });
}

/**
 * Gets text for an audio ID from the response bank.
 * This should be populated from parsing response_bank.md
 * 
 * In production, you would parse the markdown file at build time
 * and generate this lookup table. For now, showing structure.
 * 
 * @param {string} audioId - Audio ID
 * @returns {string|null} Text to speak
 */
function getAudioText(audioId) {
  // This would be a lookup table populated from response_bank.md
  // Example entries - in production, generate this from the markdown
  const textBank = {
    // Correct responses
    'CORRECT-01': 'Firewall breached. Well done, recruits.',
    'CORRECT-02': 'Access granted. Your mathematical prowess is duly noted.',
    'CORRECT-03': 'Decryption successful. We\'re making progress, sir.',
    
    // Wrong responses  
    'WRONG-01': 'Decryption failed. But every genius has a rough draft, sir.',
    'WRONG-02': 'That code was rejected. Perhaps we should recalculate.',
    
    // Pattern hints
    'HINT-PAT-01': 'You\'re remarkably close, sir. Off by just one. Perhaps recount those units.',
    'HINT-PAT-02': 'Nearly there. One small adjustment should do it.',
    'HINT-PAT-03': 'I\'d suggest examining your tens column. Something appears to have shifted.',
    'HINT-PAT-08': 'Did you remember to carry? That extra digit has to go somewhere, sir.',
    'HINT-PAT-10': 'When subtracting, sometimes you need to borrow from your neighbor. Did you?',
    
    // Generic hints
    'HINT-GEN-01': 'Perhaps break the problem into smaller steps, sir.',
    'HINT-GEN-02': 'Consider what you know for certain, and build from there.',
    
    // Mission flow
    'START-01': 'Systems online. Initiating S.H.I.E.L.D. mainframe breach protocol. First firewall incoming.',
    'PAUSE-01': 'Mission paused. Take your time, sir.',
    'RESUME-01': 'Resuming mission. Where were we?',
    'VICTORY-01': 'Firewall ten... breached. We\'re in. We\'re actually in.',
    'COMPLETE-01': 'Mission accomplished, recruits. You\'ve successfully retrieved the arc reactor schematics.',
    'SIGNOFF-01': 'This is Jarvis, signing off. Until the next mission, recruits. Stay curious.',
  };
  
  return textBank[audioId] || null;
}

/**
 * Gets an unused audio ID for correct/wrong responses.
 * Tracks usage to avoid repetition.
 * 
 * @param {string} type - 'correct' or 'wrong'
 * @returns {string} Audio ID
 */
function getUnusedAudioId(type) {
  const pool = type === 'correct' 
    ? Array.from({ length: 30 }, (_, i) => `CORRECT-${String(i + 1).padStart(2, '0')}`)
    : Array.from({ length: 41 }, (_, i) => `WRONG-${String(i + 1).padStart(2, '0')}`);
  
  const used = type === 'correct' 
    ? missionState.usedCorrectIds 
    : missionState.usedWrongIds;
  
  const unused = pool.filter(id => !used.has(id));
  
  if (unused.length === 0) {
    // Reset and start over
    used.clear();
    const selected = randomChoice(pool);
    used.add(selected);
    return selected;
  }
  
  const selected = randomChoice(unused);
  used.add(selected);
  return selected;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Delays execution for specified milliseconds.
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Randomly selects an item from an array.
 * @param {any[]} arr - Array to select from
 * @returns {any} Random item
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

/**
 * Event listeners for UI updates.
 * Register handlers with onMissionEvent().
 */
const eventListeners = {};

/**
 * Registers an event listener for mission events.
 * 
 * @param {string} eventName - Event name
 * @param {Function} handler - Event handler function
 */
function onMissionEvent(eventName, handler) {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(handler);
}

/**
 * Removes an event listener.
 * 
 * @param {string} eventName - Event name
 * @param {Function} handler - Handler to remove
 */
function offMissionEvent(eventName, handler) {
  if (!eventListeners[eventName]) return;
  eventListeners[eventName] = eventListeners[eventName].filter(h => h !== handler);
}

/**
 * Emits an event to all registered listeners.
 * 
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
function emitEvent(eventName, data) {
  const handlers = eventListeners[eventName] || [];
  handlers.forEach(handler => {
    try {
      handler(data);
    } catch (error) {
      console.error(`Event handler error for ${eventName}:`, error);
    }
  });
  
  // Also log for debugging
  console.log(`[Mission Event] ${eventName}:`, data);
}

// ============================================================================
// PATTERN DETECTION INTEGRATION
// ============================================================================

/**
 * Wrapper for pattern detection that uses the imported module.
 * This connects to pattern-detector.js
 */
function detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel) {
  // Use the pattern detector module if available
  if (typeof PatternDetector !== 'undefined' && PatternDetector.detectMathError) {
    return PatternDetector.detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel);
  }
  
  // Fallback if module not loaded - just check correctness
  let isCorrect;
  
  // Handle fraction comparison
  if (typeof correctAnswer === 'object' && typeof studentAnswer === 'object') {
    isCorrect = correctAnswer.num === studentAnswer.num && correctAnswer.den === studentAnswer.den;
  } else {
    isCorrect = correctAnswer === studentAnswer;
  }
  
  return {
    correct: isCorrect,
    pattern: isCorrect ? null : 'UNKNOWN',
    confidence: 0,
    meetsThreshold: false
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export for ES6 modules
export {
  // Mission control
  startMission,
  processAnswer,
  processScienceAnswer,
  advanceFirewall,
  pauseMission,
  resumeMission,
  
  // Teacher controls
  handleTeacherKeypress,
  teacherAdvance,
  teacherHint,
  
  // State access
  missionState,
  resetMissionState,
  
  // Events
  onMissionEvent,
  offMissionEvent,
  
  // Configuration
  CONFIG
};

// Export for browser global scope
if (typeof window !== 'undefined') {
  window.IronManMission = {
    startMission,
    processAnswer,
    processScienceAnswer,
    advanceFirewall,
    pauseMission,
    resumeMission,
    handleTeacherKeypress,
    teacherAdvance,
    teacherHint,
    missionState,
    resetMissionState,
    onMissionEvent,
    offMissionEvent,
    CONFIG
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the mission system.
 * Call this when your app loads.
 */
function initMissionSystem() {
  // Set up keyboard listener for teacher controls
  document.addEventListener('keydown', handleTeacherKeypress);
  
  // Load TTS voices (they load asynchronously)
  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    // Some browsers need this event to load voices
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }
  
  console.log('Iron Man Mission System initialized');
  console.log('Available functions: window.IronManMission.*');
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMissionSystem);
  } else {
    initMissionSystem();
  }
}
