/**
 * IRON MAN STEM MISSION - Phase 2
 * Hardcoded Test Problems
 *
 * This file contains test data for the gameplay loop.
 * In Phase 4, these will be replaced by AI-generated problems.
 *
 * Structure:
 * - 7 math problems for firewalls 1, 2, 4, 5, 7, 8, 10
 * - 3 science questions for Fury interruptions after firewalls 3, 6, 9
 */

const TEST_PROBLEMS = {
  math: [
    {
      id: 'fw-1',
      firewallNumber: 1,
      narrative: 'Jarvis is calculating suit power requirements.',
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
      id: 'fw-4',
      firewallNumber: 4,
      narrative: 'Computing repulsor beam trajectory.',
      expression: '7 × 8 = ?',
      correctAnswer: 56,
      operation: 'MULTIPLY',
      operands: [7, 8],
      teks: '3.4F'
    },
    {
      id: 'fw-5',
      firewallNumber: 5,
      narrative: 'Halfway through the mainframe. Calculating shield frequency.',
      expression: '144 ÷ 12 = ?',
      correctAnswer: 12,
      operation: 'DIVIDE',
      operands: [144, 12],
      teks: '3.4J'
    },
    {
      id: 'fw-7',
      firewallNumber: 7,
      narrative: 'Decoding Stark Industries inventory count.',
      expression: '156 + 289 = ?',
      correctAnswer: 445,
      operation: 'ADD',
      operands: [156, 289],
      teks: '3.4A'
    },
    {
      id: 'fw-8',
      firewallNumber: 8,
      narrative: 'Almost there. Compute the security hash.',
      expression: '503 - 267 = ?',
      correctAnswer: 236,
      operation: 'SUBTRACT',
      operands: [503, 267],
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
 * @returns {object|null} The math problem or null if this is a Fury firewall
 */
function getMathProblem(firewallNumber) {
  // Firewalls 3, 6, 9 are Fury science questions
  if ([3, 6, 9].includes(firewallNumber)) {
    return null;
  }
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
 * Check if a firewall triggers a Fury science question
 * @param {number} firewallNumber - The firewall number just completed
 * @returns {boolean} True if Fury should appear
 */
function isFuryFirewall(firewallNumber) {
  return [3, 6, 9].includes(firewallNumber);
}

// Export for use in app.js
window.TEST_PROBLEMS = TEST_PROBLEMS;
window.getMathProblem = getMathProblem;
window.getScienceQuestion = getScienceQuestion;
window.isFuryFirewall = isFuryFirewall;
