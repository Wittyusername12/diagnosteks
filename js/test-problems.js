/**
 * IRON MAN STEM MISSION - Fallback Problems
 * Hardcoded test data for gameplay when API is unavailable.
 *
 * Grade 3, TEKS 3.4A (add/subtract within 1,000) and 3.3A (fractions)
 * Science: TEKS 3.7A (forces) and 3.6A (properties of matter)
 *
 * 10 math problems (firewalls 1-10) + 3 science questions (after 3, 6, 9)
 * Includes diagnostic problems targeting common misconceptions.
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
      narrative: 'Jarvis is counting Iron Man suit components in the lab.',
      expression: '125 + 43 = ?',
      correctAnswer: 168,
      operation: 'ADD',
      operands: [125, 43],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'easy',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-2',
      firewallNumber: 2,
      narrative: 'Pepper Potts is tracking remaining power cells at Stark Industries.',
      expression: '94 - 37 = ?',
      correctAnswer: 57,
      operation: 'SUBTRACT',
      operands: [94, 37],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'easy',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-3',
      firewallNumber: 3,
      narrative: 'The Avengers Tower sensors detected two waves of energy signatures.',
      expression: '256 + 138 = ?',
      correctAnswer: 394,
      operation: 'ADD',
      operands: [256, 138],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'easy',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-4',
      firewallNumber: 4,
      narrative: 'Tony needs to calculate remaining shield energy after a blast.',
      expression: '302 - 167 = ?',
      correctAnswer: 135,
      operation: 'SUBTRACT',
      operands: [302, 167],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'medium',
      diagnosticFor: ['borrowing-across-zero'],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-5',
      firewallNumber: 5,
      narrative: 'Stark Industries ships arc reactor parts to two research facilities.',
      expression: '475 + 368 = ?',
      correctAnswer: 843,
      operation: 'ADD',
      operands: [475, 368],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'medium',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-6',
      firewallNumber: 6,
      narrative: 'The Helicarrier database shows encrypted files to decode.',
      expression: '614 - 287 = ?',
      correctAnswer: 327,
      operation: 'SUBTRACT',
      operands: [614, 287],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'medium',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-7',
      firewallNumber: 7,
      narrative: 'Jarvis divides 12 vibranium samples equally into 4 containment pods.',
      expression: '12 \u00F7 4 = ?',
      correctAnswer: 3,
      operation: 'DIVIDE',
      operands: [12, 4],
      teks: '3.3A',
      primaryType: 'computation',
      difficulty: 'medium',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-8',
      firewallNumber: 8,
      narrative: 'Tony calculates total memory needed for the security bypass.',
      expression: '529 + 384 = ?',
      correctAnswer: 913,
      operation: 'ADD',
      operands: [529, 384],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'hard',
      diagnosticFor: ['carrying-multiple-columns'],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-9',
      firewallNumber: 9,
      narrative: 'Pepper divides 18 energy cores equally into 3 storage containers.',
      expression: '18 \u00F7 3 = ?',
      correctAnswer: 6,
      operation: 'DIVIDE',
      operands: [18, 3],
      teks: '3.3A',
      primaryType: 'computation',
      difficulty: 'hard',
      diagnosticFor: [],
      answerType: 'integer',
      scienceTeksConnection: null
    },
    {
      id: 'fw-10',
      firewallNumber: 10,
      narrative: 'FINAL FIREWALL. Calculate the override code to access the arc reactor plans.',
      expression: '803 - 467 = ?',
      correctAnswer: 336,
      operation: 'SUBTRACT',
      operands: [803, 467],
      teks: '3.4A',
      primaryType: 'computation',
      difficulty: 'hard',
      diagnosticFor: ['borrowing-across-zero'],
      answerType: 'integer',
      scienceTeksConnection: null
    }
  ],

  science: [
    {
      id: 'fury-1',
      afterFirewall: 3,
      question: 'Agent verification protocol: Which of these is an example of a force acting on an object?',
      options: [
        { letter: 'A', text: 'A magnet pulling a paperclip toward it' },
        { letter: 'B', text: 'A rock sitting still on a table' },
        { letter: 'C', text: 'The color of a ball changing in sunlight' },
        { letter: 'D', text: 'Water evaporating from a puddle' }
      ],
      correctAnswer: 'A',
      teks: '3.7A'
    },
    {
      id: 'fury-2',
      afterFirewall: 6,
      question: 'SHIELD science clearance check: What physical property can you measure to tell solids, liquids, and gases apart?',
      options: [
        { letter: 'A', text: 'Color \u2014 solids are always darker than liquids' },
        { letter: 'B', text: 'Shape \u2014 solids keep their shape, liquids take the shape of their container' },
        { letter: 'C', text: 'Weight \u2014 gases always weigh more than liquids' },
        { letter: 'D', text: 'Temperature \u2014 solids are always colder than gases' }
      ],
      correctAnswer: 'B',
      teks: '3.6A'
    },
    {
      id: 'fury-3',
      afterFirewall: 9,
      question: 'Final security verification: What happens when you push a ball that is sitting still on a flat surface?',
      options: [
        { letter: 'A', text: 'Nothing \u2014 the ball cannot move on its own' },
        { letter: 'B', text: 'The ball moves in the direction you pushed it' },
        { letter: 'C', text: 'The ball moves in the opposite direction of the push' },
        { letter: 'D', text: 'The ball rises up into the air' }
      ],
      correctAnswer: 'B',
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
