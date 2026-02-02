/**
 * IRON MAN STEM MISSION - Phase 2
 * Hardcoded Test Problems
 *
 * This file contains test data for the gameplay loop.
 * In Phase 4, these will be replaced by AI-generated problems.
 *
 * Structure:
 * - 10 math problems (one for each firewall 1-10)
 * - 3 science questions for Fury interruptions AFTER completing firewalls 3, 6, 9
 *
 * Flow: Math 1 → Math 2 → Math 3 → Fury 1 → Math 4 → Math 5 → Math 6 → Fury 2 →
 *       Math 7 → Math 8 → Math 9 → Fury 3 → Math 10 → Victory
 */

const TEST_PROBLEMS = {
  math: [
    {
      id: 'fw-1',
      firewallNumber: 1,
      narrative: 'Initializing breach sequence. Calculate power requirements.',
      expression: '35 + 27 = ?',
      correctAnswer: 62,
      operation: 'ADD',
      operands: [35, 27],
      teks: '3.4A'
    },
    {
      id: 'fw-2',
      firewallNumber: 2,
      narrative: 'Decrypting arc reactor energy output.',
      expression: '84 - 39 = ?',
      correctAnswer: 45,
      operation: 'SUBTRACT',
      operands: [84, 39],
      teks: '3.4A'
    },
    {
      id: 'fw-3',
      firewallNumber: 3,
      narrative: 'Bypassing security node. Compute access code.',
      expression: '6 × 7 = ?',
      correctAnswer: 42,
      operation: 'MULTIPLY',
      operands: [6, 7],
      teks: '3.4F'
    },
    {
      id: 'fw-4',
      firewallNumber: 4,
      narrative: 'Decoding Stark Industries manifest.',
      expression: '96 ÷ 8 = ?',
      correctAnswer: 12,
      operation: 'DIVIDE',
      operands: [96, 8],
      teks: '3.4J'
    },
    {
      id: 'fw-5',
      firewallNumber: 5,
      narrative: 'Halfway through. Calculating shield frequency.',
      expression: '156 + 78 = ?',
      correctAnswer: 234,
      operation: 'ADD',
      operands: [156, 78],
      teks: '3.4A'
    },
    {
      id: 'fw-6',
      firewallNumber: 6,
      narrative: 'Penetrating inner firewall. Solve encryption key.',
      expression: '243 - 158 = ?',
      correctAnswer: 85,
      operation: 'SUBTRACT',
      operands: [243, 158],
      teks: '3.4A'
    },
    {
      id: 'fw-7',
      firewallNumber: 7,
      narrative: 'Approaching core systems. Compute trajectory.',
      expression: '9 × 8 = ?',
      correctAnswer: 72,
      operation: 'MULTIPLY',
      operands: [9, 8],
      teks: '3.4F'
    },
    {
      id: 'fw-8',
      firewallNumber: 8,
      narrative: 'Almost there. Divide the security hash.',
      expression: '144 ÷ 12 = ?',
      correctAnswer: 12,
      operation: 'DIVIDE',
      operands: [144, 12],
      teks: '3.4J'
    },
    {
      id: 'fw-9',
      firewallNumber: 9,
      narrative: 'Final security layer. Calculate override code.',
      expression: '467 + 285 = ?',
      correctAnswer: 752,
      operation: 'ADD',
      operands: [467, 285],
      teks: '3.4A'
    },
    {
      id: 'fw-10',
      firewallNumber: 10,
      narrative: 'FINAL FIREWALL. This is it, recruits.',
      expression: '25 × 4 = ?',
      correctAnswer: 100,
      operation: 'MULTIPLY',
      operands: [25, 4],
      teks: '3.4F'
    }
  ],

  science: [
    {
      id: 'fury-1',
      afterFirewall: 3,
      question: 'What is the main function of leaves on a plant?',
      options: [
        { letter: 'A', text: 'To make food through photosynthesis' },
        { letter: 'B', text: 'To absorb water from the soil' },
        { letter: 'C', text: 'To attract bees for pollination' },
        { letter: 'D', text: 'To produce seeds' }
      ],
      correctAnswer: 'A',
      teks: '3.13B'
    },
    {
      id: 'fury-2',
      afterFirewall: 6,
      question: 'What state of matter has a definite shape and volume?',
      options: [
        { letter: 'A', text: 'Gas' },
        { letter: 'B', text: 'Liquid' },
        { letter: 'C', text: 'Solid' },
        { letter: 'D', text: 'Plasma' }
      ],
      correctAnswer: 'C',
      teks: '3.6B'
    },
    {
      id: 'fury-3',
      afterFirewall: 9,
      question: 'Which force pulls objects toward Earth?',
      options: [
        { letter: 'A', text: 'Magnetism' },
        { letter: 'B', text: 'Friction' },
        { letter: 'C', text: 'Gravity' },
        { letter: 'D', text: 'Electricity' }
      ],
      correctAnswer: 'C',
      teks: '3.7A'
    }
  ]
};

/**
 * Get math problem for a specific firewall number
 * @param {number} firewallNumber - The firewall number (1-10)
 * @returns {object|null} The math problem or null if not found
 */
function getMathProblem(firewallNumber) {
  return TEST_PROBLEMS.math.find(p => p.firewallNumber === firewallNumber) || null;
}

/**
 * Get science question that appears after a specific firewall
 * @param {number} afterFirewall - The firewall number just completed (3, 6, or 9)
 * @returns {object|null} The science question or null
 */
function getScienceQuestion(afterFirewall) {
  return TEST_PROBLEMS.science.find(q => q.afterFirewall === afterFirewall) || null;
}

/**
 * Check if completing a firewall triggers a Fury science question
 * @param {number} firewallNumber - The firewall number just COMPLETED
 * @returns {boolean} True if Fury should appear after this firewall
 */
function shouldShowFuryAfter(firewallNumber) {
  return [3, 6, 9].includes(firewallNumber);
}

// Export for use in app.js
window.TEST_PROBLEMS = TEST_PROBLEMS;
window.getMathProblem = getMathProblem;
window.getScienceQuestion = getScienceQuestion;
window.shouldShowFuryAfter = shouldShowFuryAfter;
