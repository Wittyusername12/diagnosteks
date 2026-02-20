/**
 * Batch_2_supporting_standards_exemplars.js
 *
 * 40 exemplar math problems for supporting TEKS standards (Grades 1-5).
 * Iron Man themed narratives set in the Marvel/Stark Industries universe.
 *
 * Each grade has 8 exemplars covering the designated supporting TEKS.
 */

const BATCH2_SUPPORTING_EXEMPLARS = [

  // =====================================================================
  // GRADE 1 — Supporting Standards (8 exemplars)
  // =====================================================================

  // 1.4A — Coins
  {
    narrative: "Tony Stark finds a dime and a nickel on his lab bench.",
    expression: "10 + 5",
    operation: "ADD",
    operands: [10, 5],
    correctAnswer: 15,
    teks: "1.4A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 1.5B — Skip counting
  {
    narrative: "Jarvis counts Iron Man suits by fives: 5, 10, 15, ___.",
    expression: "15 + 5",
    operation: "ADD",
    operands: [15, 5],
    correctAnswer: 20,
    teks: "1.5B",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 1.5C — 10 more/less
  {
    narrative: "Stark Tower has 34 floors lit. Jarvis turns on 10 more.",
    expression: "34 + 10",
    operation: "ADD",
    operands: [34, 10],
    correctAnswer: 44,
    teks: "1.5C",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 1.6G — Partition shapes
  {
    narrative: "Tony cuts a circular shield target into 4 equal parts. How many parts?",
    expression: "4 parts",
    operation: "IDENTIFY",
    operands: [1, 4],
    correctAnswer: "B",
    teks: "1.6G",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "2 equal parts" },
      { letter: "B", text: "4 equal parts" },
      { letter: "C", text: "3 equal parts" },
      { letter: "D", text: "5 equal parts" }
    ],
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual"
  },

  // 1.7E — Tell time
  {
    narrative: "The Avengers meeting starts at the time shown. What hour is it?",
    expression: "3:00",
    operation: "IDENTIFY",
    operands: [3, 0],
    correctAnswer: "A",
    teks: "1.7E",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "3:00" },
      { letter: "B", text: "6:00" },
      { letter: "C", text: "12:00" },
      { letter: "D", text: "9:00" }
    ],
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual"
  },

  // 1.8C — Read graphs
  {
    narrative: "A bar graph shows 7 heroes voted for red and 5 for blue.",
    expression: "7 - 5",
    operation: "SUBTRACT",
    operands: [7, 5],
    correctAnswer: 2,
    teks: "1.8C",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 1.2B — Compose/decompose numbers
  {
    narrative: "Tony breaks 14 into tens and ones for Jarvis to process.",
    expression: "10 + 4",
    operation: "CONCEPTUAL",
    operands: [10, 4],
    correctAnswer: "C",
    teks: "1.2B",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "1 ten and 0 ones" },
      { letter: "B", text: "0 tens and 14 ones" },
      { letter: "C", text: "1 ten and 4 ones" },
      { letter: "D", text: "4 tens and 1 one" }
    ],
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual"
  },

  // 1.5F — Unknown in equation
  {
    narrative: "Pepper has 6 + ___ = 9 Stark tablets to deliver.",
    expression: "6 + ? = 9",
    operation: "SUBTRACT",
    operands: [9, 6],
    correctAnswer: 3,
    teks: "1.5F",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // =====================================================================
  // GRADE 2 — Supporting Standards (8 exemplars)
  // =====================================================================

  // 2.3A — Partition into fractions
  {
    narrative: "Tony partitions a power cell into 8 equal sections.",
    expression: "1/8 of the cell",
    operation: "CONCEPTUAL",
    operands: [1, 8],
    correctAnswer: "B",
    teks: "2.3A",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Each section is 1/4" },
      { letter: "B", text: "Each section is 1/8" },
      { letter: "C", text: "Each section is 1/2" },
      { letter: "D", text: "Each section is 1/6" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // 2.3D — Fraction examples
  {
    narrative: "Pepper eats 1/4 of a pizza at Avengers Tower.",
    expression: "1/4 of a whole",
    operation: "CONCEPTUAL",
    operands: [1, 4],
    correctAnswer: "A",
    teks: "2.3D",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "1 out of 4 equal slices" },
      { letter: "B", text: "1 out of 2 equal slices" },
      { letter: "C", text: "4 out of 4 slices" },
      { letter: "D", text: "1 out of 3 equal slices" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // 2.5A — Skip count patterns
  {
    narrative: "Jarvis counts arc reactors by tens: 30, 40, 50, ___.",
    expression: "50 + 10",
    operation: "ADD",
    operands: [50, 10],
    correctAnswer: 60,
    teks: "2.5A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 2.6A — 2D shapes
  {
    narrative: "Tony's new shield design is a shape with 6 sides.",
    expression: "Identify shape",
    operation: "IDENTIFY",
    operands: [6, 0],
    correctAnswer: "C",
    teks: "2.6A",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Pentagon" },
      { letter: "B", text: "Octagon" },
      { letter: "C", text: "Hexagon" },
      { letter: "D", text: "Triangle" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // 2.7A — Measurement
  {
    narrative: "Tony measures a wire that is 12 inches long for his suit.",
    expression: "12 inches = ? feet",
    operation: "IDENTIFY",
    operands: [12, 1],
    correctAnswer: "B",
    teks: "2.7A",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "2 feet" },
      { letter: "B", text: "1 foot" },
      { letter: "C", text: "3 feet" },
      { letter: "D", text: "12 feet" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // 2.7C — Time
  {
    narrative: "The SHIELD briefing starts at 2:30 and lasts 30 minutes.",
    expression: "2:30 + 0:30",
    operation: "ADD",
    operands: [230, 30],
    correctAnswer: "A",
    teks: "2.7C",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "3:00" },
      { letter: "B", text: "2:60" },
      { letter: "C", text: "3:30" },
      { letter: "D", text: "2:00" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // 2.8A — Data collection
  {
    narrative: "Nick Fury surveys 5 heroes: 2 chose jets, 3 chose cars.",
    expression: "2 + 3",
    operation: "ADD",
    operands: [2, 3],
    correctAnswer: 5,
    teks: "2.8A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 2.2E — Number line
  {
    narrative: "Jarvis marks 47 on a number line between 40 and 50.",
    expression: "47 is between 40 and 50",
    operation: "CONCEPTUAL",
    operands: [40, 50],
    correctAnswer: "D",
    teks: "2.2E",
    difficulty: "easy",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Closer to 40" },
      { letter: "B", text: "Exactly at 40" },
      { letter: "C", text: "Exactly at 50" },
      { letter: "D", text: "Closer to 50" }
    ],
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual"
  },

  // =====================================================================
  // GRADE 3 — Supporting Standards (8 exemplars)
  // =====================================================================

  // 3.4G — Rounding
  {
    narrative: "Jarvis rounds 467 flight hours to the nearest hundred.",
    expression: "round(467)",
    operation: "CONCEPTUAL",
    operands: [467, 100],
    correctAnswer: "C",
    teks: "3.4G",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "400" },
      { letter: "B", text: "470" },
      { letter: "C", text: "500" },
      { letter: "D", text: "460" }
    ],
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual"
  },

  // 3.6A — 2D shapes
  {
    narrative: "Tony's lab tile is a quadrilateral with 4 right angles and 4 equal sides.",
    expression: "Identify shape",
    operation: "IDENTIFY",
    operands: [4, 4],
    correctAnswer: "A",
    teks: "3.6A",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Square" },
      { letter: "B", text: "Rhombus" },
      { letter: "C", text: "Trapezoid" },
      { letter: "D", text: "Parallelogram" }
    ],
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual"
  },

  // 3.6C — Area
  {
    narrative: "Tony's workbench is 8 units long and 5 units wide.",
    expression: "8 × 5",
    operation: "MULTIPLY",
    operands: [8, 5],
    correctAnswer: 40,
    teks: "3.6C",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 3.7A — Fractions of sets
  {
    narrative: "Pepper has 12 files; 1/3 of them are urgent Stark reports.",
    expression: "12 × (1/3)",
    operation: "MULTIPLY",
    operands: [12, 3],
    correctAnswer: 4,
    teks: "3.7A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 3.7B — Fraction comparisons
  {
    narrative: "Tony compares 2/4 and 3/4 of his suit power levels.",
    expression: "2/4 ? 3/4",
    operation: "COMPARE",
    operands: [0.5, 0.75],
    correctAnswer: "<",
    teks: "3.7B",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 3,
    primaryType: "comparison"
  },

  // 3.8A — Data
  {
    narrative: "A bar graph shows 9 missions in May and 6 in June for SHIELD.",
    expression: "9 - 6",
    operation: "SUBTRACT",
    operands: [9, 6],
    correctAnswer: 3,
    teks: "3.8A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 3.4K — Multi-step
  {
    narrative: "Tony buys 3 packs of 6 bolts and uses 4 bolts.",
    expression: "(3 × 6) - 4",
    operation: "SUBTRACT",
    operands: [18, 4],
    correctAnswer: 14,
    teks: "3.4K",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 3.2A — Compose/decompose numbers
  {
    narrative: "Jarvis decomposes 5,382 for the Stark Industries inventory log.",
    expression: "5000 + 300 + 80 + 2",
    operation: "CONCEPTUAL",
    operands: [5382, 0],
    correctAnswer: "B",
    teks: "3.2A",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "5 thousands, 3 tens, 8 hundreds, 2 ones" },
      { letter: "B", text: "5 thousands, 3 hundreds, 8 tens, 2 ones" },
      { letter: "C", text: "5 hundreds, 3 thousands, 8 tens, 2 ones" },
      { letter: "D", text: "53 hundreds, 8 ones, 2 tens" }
    ],
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual"
  },

  // =====================================================================
  // GRADE 4 — Supporting Standards (8 exemplars)
  // =====================================================================

  // 4.2B — Compare decimals
  {
    narrative: "Jarvis compares two power readings: 3.45 and 3.54.",
    expression: "3.45 ? 3.54",
    operation: "COMPARE",
    operands: [3.45, 3.54],
    correctAnswer: "<",
    teks: "4.2B",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 4,
    primaryType: "comparison"
  },

  // 4.3C — Equivalent fractions
  {
    narrative: "Tony finds that 2/3 of the reactor fuel equals how many sixths?",
    expression: "2/3 = ?/6",
    operation: "MULTIPLY",
    operands: [2, 2],
    correctAnswer: 4,
    teks: "4.3C",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 4.3D — Compare fractions
  {
    narrative: "Black Widow compares mission completion: 5/8 vs 3/8.",
    expression: "5/8 ? 3/8",
    operation: "COMPARE",
    operands: [0.625, 0.375],
    correctAnswer: ">",
    teks: "4.3D",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 4,
    primaryType: "comparison"
  },

  // 4.5A — Perimeter/area
  {
    narrative: "Tony's rectangular lab panel is 12 cm long and 7 cm wide.",
    expression: "2 × (12 + 7)",
    operation: "MULTIPLY",
    operands: [2, 19],
    correctAnswer: 38,
    teks: "4.5A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 4.6D — Angles
  {
    narrative: "The Iron Man repulsor arm bends at a 90-degree angle.",
    expression: "Identify angle",
    operation: "IDENTIFY",
    operands: [90, 0],
    correctAnswer: "B",
    teks: "4.6D",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Acute angle" },
      { letter: "B", text: "Right angle" },
      { letter: "C", text: "Obtuse angle" },
      { letter: "D", text: "Straight angle" }
    ],
    diagnosticFor: [],
    grade: 4,
    primaryType: "conceptual"
  },

  // 4.8A — Data tables
  {
    narrative: "A table shows SHIELD used 24 jets Monday and 18 jets Tuesday.",
    expression: "24 - 18",
    operation: "SUBTRACT",
    operands: [24, 18],
    correctAnswer: 6,
    teks: "4.8A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 4.2G — Relate fractions to decimals
  {
    narrative: "Jarvis converts 3/10 of the power reserve to a decimal.",
    expression: "3/10 as decimal",
    operation: "CONCEPTUAL",
    operands: [3, 10],
    correctAnswer: "A",
    teks: "4.2G",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "0.3" },
      { letter: "B", text: "0.03" },
      { letter: "C", text: "3.0" },
      { letter: "D", text: "0.33" }
    ],
    diagnosticFor: [],
    grade: 4,
    primaryType: "conceptual"
  },

  // 4.4E — Estimation
  {
    narrative: "Pepper estimates 389 × 4 by rounding 389 to 400.",
    expression: "400 × 4",
    operation: "MULTIPLY",
    operands: [400, 4],
    correctAnswer: 1600,
    teks: "4.4E",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // =====================================================================
  // GRADE 5 — Supporting Standards (8 exemplars)
  // =====================================================================

  // 5.2B — Compare decimals
  {
    narrative: "Tony compares thruster outputs of 4.072 and 4.702 gigawatts.",
    expression: "4.072 ? 4.702",
    operation: "COMPARE",
    operands: [4.072, 4.702],
    correctAnswer: "<",
    teks: "5.2B",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 5,
    primaryType: "comparison"
  },

  // 5.3E — Multi-step with fractions
  {
    narrative: "Tony uses 1/4 gallon then 2/4 gallon of coolant from a full tank.",
    expression: "1/4 + 2/4",
    operation: "FRACTION_ADD",
    operands: [
      { numerator: 1, denominator: 4 },
      { numerator: 2, denominator: 4 }
    ],
    correctAnswer: { numerator: 3, denominator: 4 },
    teks: "5.3E",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 5.3H — Fraction division
  {
    narrative: "Pepper divides 3/4 pound of wire equally between 2 suits.",
    expression: "3/4 ÷ 2",
    operation: "CONCEPTUAL",
    operands: [0.75, 2],
    correctAnswer: "C",
    teks: "5.3H",
    difficulty: "hard",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "3/2" },
      { letter: "B", text: "6/4" },
      { letter: "C", text: "3/8" },
      { letter: "D", text: "1/4" }
    ],
    diagnosticFor: [],
    grade: 5,
    primaryType: "conceptual"
  },

  // 5.4A — Algebraic
  {
    narrative: "Jarvis solves: n + 7 = 15. What is n?",
    expression: "n + 7 = 15",
    operation: "SUBTRACT",
    operands: [15, 7],
    correctAnswer: 8,
    teks: "5.4A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 5.5A — Classify shapes
  {
    narrative: "SHIELD headquarters has a roof shaped as a triangle with all sides equal.",
    expression: "Classify triangle",
    operation: "IDENTIFY",
    operands: [3, 3],
    correctAnswer: "D",
    teks: "5.5A",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "Scalene triangle" },
      { letter: "B", text: "Right triangle" },
      { letter: "C", text: "Isosceles triangle" },
      { letter: "D", text: "Equilateral triangle" }
    ],
    diagnosticFor: [],
    grade: 5,
    primaryType: "conceptual"
  },

  // 5.6A — Perimeter/area
  {
    narrative: "Avengers Tower has a square courtyard with sides of 25 meters.",
    expression: "25 × 25",
    operation: "MULTIPLY",
    operands: [25, 25],
    correctAnswer: 625,
    teks: "5.6A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 5.8A — Data
  {
    narrative: "Nick Fury's data shows 14.5 hours of flight and 9.3 hours of lab work.",
    expression: "14.5 - 9.3",
    operation: "DECIMAL_SUBTRACT",
    operands: [14.5, 9.3],
    correctAnswer: 5.2,
    teks: "5.8A",
    difficulty: "medium",
    answerType: "decimal",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 5.4B — Expressions
  {
    narrative: "Tony writes the expression for 8 less than a number p.",
    expression: "p - 8",
    operation: "CONCEPTUAL",
    operands: [0, 8],
    correctAnswer: "B",
    teks: "5.4B",
    difficulty: "medium",
    answerType: "multipleChoice",
    options: [
      { letter: "A", text: "8 - p" },
      { letter: "B", text: "p - 8" },
      { letter: "C", text: "p + 8" },
      { letter: "D", text: "8 × p" }
    ],
    diagnosticFor: [],
    grade: 5,
    primaryType: "conceptual"
  }

];

window.BATCH2_SUPPORTING_EXEMPLARS = BATCH2_SUPPORTING_EXEMPLARS;
console.log('[Exemplars] Batch 2 loaded:', BATCH2_SUPPORTING_EXEMPLARS.length, 'supporting standard exemplars');
