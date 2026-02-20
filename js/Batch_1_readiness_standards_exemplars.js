/**
 * Batch_1_readiness_standards_exemplars.js
 *
 * 65 Iron Man themed math exemplars aligned to Texas TEKS readiness standards,
 * grades 1-5 (~13 per grade). Includes computation, comparison, fraction, and
 * decimal operations with diagnosticFor error-pattern codes where appropriate.
 *
 * Globals exported: PROBLEM_EXEMPLARS, selectExemplars, toInjectionFormat, diverseSelect
 */

/* eslint-disable no-unused-vars */

var PROBLEM_EXEMPLARS = [

  // =========================================================================
  // GRADE 1  (within 20)  --  13 exemplars
  // =========================================================================

  // 1 - ADD easy
  {
    narrative: "Tony Stark finds 3 screws and then 4 more on the lab bench.",
    expression: "3 + 4 = ?",
    operation: "ADD",
    operands: [3, 4],
    correctAnswer: 7,
    teks: "1.3B",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 2 - ADD easy
  {
    narrative: "Jarvis counts 6 bolts plus 2 more in the Stark Industries lab.",
    expression: "6 + 2 = ?",
    operation: "ADD",
    operands: [6, 2],
    correctAnswer: 8,
    teks: "1.3B",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 3 - ADD medium
  {
    narrative: "Pepper Potts stacks 8 reports then adds 7 more at Avengers Tower.",
    expression: "8 + 7 = ?",
    operation: "ADD",
    operands: [8, 7],
    correctAnswer: 15,
    teks: "1.3B",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["bridging-ten"],
    grade: 1,
    primaryType: "computation"
  },

  // 4 - ADD hard
  {
    narrative: "Tony Stark loads 9 missiles and then 8 more onto the suit.",
    expression: "9 + 8 = ?",
    operation: "ADD",
    operands: [9, 8],
    correctAnswer: 17,
    teks: "1.3B",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["bridging-ten"],
    grade: 1,
    primaryType: "computation"
  },

  // 5 - SUBTRACT easy
  {
    narrative: "Jarvis has 9 alerts and clears 3 from the display.",
    expression: "9 - 3 = ?",
    operation: "SUBTRACT",
    operands: [9, 3],
    correctAnswer: 6,
    teks: "1.3D",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 6 - SUBTRACT medium
  {
    narrative: "Tony has 14 repulsor charges and uses 6 in a test flight.",
    expression: "14 - 6 = ?",
    operation: "SUBTRACT",
    operands: [14, 6],
    correctAnswer: 8,
    teks: "1.3D",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["bridging-ten"],
    grade: 1,
    primaryType: "computation"
  },

  // 7 - SUBTRACT medium
  {
    narrative: "Pepper has 17 files and archives 9 of them at Stark Industries.",
    expression: "17 - 9 = ?",
    operation: "SUBTRACT",
    operands: [17, 9],
    correctAnswer: 8,
    teks: "1.3D",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["bridging-ten"],
    grade: 1,
    primaryType: "computation"
  },

  // 8 - SUBTRACT hard
  {
    narrative: "The Avengers had 20 drones; 13 were destroyed in battle.",
    expression: "20 - 13 = ?",
    operation: "SUBTRACT",
    operands: [20, 13],
    correctAnswer: 7,
    teks: "1.3D",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 9 - ADD medium (doubles)
  {
    narrative: "Jarvis installs 7 sensors on each arm of the Iron Man suit.",
    expression: "7 + 7 = ?",
    operation: "ADD",
    operands: [7, 7],
    correctAnswer: 14,
    teks: "1.3F",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 10 - ADD easy (fact fluency)
  {
    narrative: "Tony picks up 5 wires and then 5 more from the workbench.",
    expression: "5 + 5 = ?",
    operation: "ADD",
    operands: [5, 5],
    correctAnswer: 10,
    teks: "1.3F",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // 11 - COMPARE easy
  {
    narrative: "Jarvis compares 12 watts to 18 watts of arc reactor output.",
    expression: "12 ? 18",
    operation: "COMPARE",
    operands: [12, 18],
    correctAnswer: "<",
    teks: "1.2G",
    difficulty: "easy",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 1,
    primaryType: "comparison"
  },

  // 12 - COMPARE medium
  {
    narrative: "Pepper compares 15 emails received to 15 emails sent today.",
    expression: "15 ? 15",
    operation: "COMPARE",
    operands: [15, 15],
    correctAnswer: "=",
    teks: "1.2G",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: ["equality-confusion"],
    grade: 1,
    primaryType: "comparison"
  },

  // 13 - SUBTRACT hard
  {
    narrative: "SHIELD has 18 agents; 9 depart on a covert mission.",
    expression: "18 - 9 = ?",
    operation: "SUBTRACT",
    operands: [18, 9],
    correctAnswer: 9,
    teks: "1.3D",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: [],
    grade: 1,
    primaryType: "computation"
  },

  // =========================================================================
  // GRADE 2  (within 1,000)  --  13 exemplars
  // =========================================================================

  // 14 - ADD easy
  {
    narrative: "Tony Stark orders 34 circuit boards and then 25 more.",
    expression: "34 + 25 = ?",
    operation: "ADD",
    operands: [34, 25],
    correctAnswer: 59,
    teks: "2.4A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 15 - ADD medium
  {
    narrative: "Pepper ships 148 crates and then 237 more from Stark Industries.",
    expression: "148 + 237 = ?",
    operation: "ADD",
    operands: [148, 237],
    correctAnswer: 385,
    teks: "2.4A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 16 - ADD hard (regrouping)
  {
    narrative: "Jarvis logs 475 scans on Monday and 368 on Tuesday.",
    expression: "475 + 368 = ?",
    operation: "ADD",
    operands: [475, 368],
    correctAnswer: 843,
    teks: "2.4A",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["regroup-add"],
    grade: 2,
    primaryType: "computation"
  },

  // 17 - SUBTRACT easy
  {
    narrative: "Tony has 86 micro-chips and uses 23 in a prototype.",
    expression: "86 - 23 = ?",
    operation: "SUBTRACT",
    operands: [86, 23],
    correctAnswer: 63,
    teks: "2.4B",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 18 - SUBTRACT medium
  {
    narrative: "SHIELD stores 530 weapons; 274 are moved to the Helicarrier.",
    expression: "530 - 274 = ?",
    operation: "SUBTRACT",
    operands: [530, 274],
    correctAnswer: 256,
    teks: "2.4B",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["regroup-sub"],
    grade: 2,
    primaryType: "computation"
  },

  // 19 - SUBTRACT hard
  {
    narrative: "Avengers Tower had 800 visitors; 357 left before the tour ended.",
    expression: "800 - 357 = ?",
    operation: "SUBTRACT",
    operands: [800, 357],
    correctAnswer: 443,
    teks: "2.4B",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["regroup-sub", "zeros-in-sub"],
    grade: 2,
    primaryType: "computation"
  },

  // 20 - ADD medium
  {
    narrative: "Tony counts 199 nuts and 156 bolts in the supply room.",
    expression: "199 + 156 = ?",
    operation: "ADD",
    operands: [199, 156],
    correctAnswer: 355,
    teks: "2.4C",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["regroup-add"],
    grade: 2,
    primaryType: "computation"
  },

  // 21 - ADD easy
  {
    narrative: "Pepper organizes 120 pens and 50 pencils for the office.",
    expression: "120 + 50 = ?",
    operation: "ADD",
    operands: [120, 50],
    correctAnswer: 170,
    teks: "2.4C",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 22 - SUBTRACT medium
  {
    narrative: "Jarvis tracks 465 data packets and discards 218 corrupted ones.",
    expression: "465 - 218 = ?",
    operation: "SUBTRACT",
    operands: [465, 218],
    correctAnswer: 247,
    teks: "2.4C",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 2,
    primaryType: "computation"
  },

  // 23 - COMPARE easy
  {
    narrative: "Tony compares 345 lab samples to 354 field samples.",
    expression: "345 ? 354",
    operation: "COMPARE",
    operands: [345, 354],
    correctAnswer: "<",
    teks: "2.2D",
    difficulty: "easy",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 2,
    primaryType: "comparison"
  },

  // 24 - COMPARE medium
  {
    narrative: "SHIELD compares 672 agents in New York to 627 in Washington.",
    expression: "672 ? 627",
    operation: "COMPARE",
    operands: [672, 627],
    correctAnswer: ">",
    teks: "2.2D",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: ["digit-swap-compare"],
    grade: 2,
    primaryType: "comparison"
  },

  // 25 - ADD hard
  {
    narrative: "The Avengers collect 589 alien artifacts and find 311 more.",
    expression: "589 + 311 = ?",
    operation: "ADD",
    operands: [589, 311],
    correctAnswer: 900,
    teks: "2.4A",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["regroup-add"],
    grade: 2,
    primaryType: "computation"
  },

  // 26 - SUBTRACT hard
  {
    narrative: "Pepper manages a budget of 750 dollars and spends 486.",
    expression: "750 - 486 = ?",
    operation: "SUBTRACT",
    operands: [750, 486],
    correctAnswer: 264,
    teks: "2.4B",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["regroup-sub"],
    grade: 2,
    primaryType: "computation"
  },

  // =========================================================================
  // GRADE 3  (within 1,000, multiply facts to 10x10)  --  13 exemplars
  // =========================================================================

  // 27 - ADD medium
  {
    narrative: "Tony Stark ships 347 parts to the lab and 285 to the Helicarrier.",
    expression: "347 + 285 = ?",
    operation: "ADD",
    operands: [347, 285],
    correctAnswer: 632,
    teks: "3.4A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 28 - SUBTRACT medium
  {
    narrative: "Jarvis monitors 802 signals and filters out 467 as noise.",
    expression: "802 - 467 = ?",
    operation: "SUBTRACT",
    operands: [802, 467],
    correctAnswer: 335,
    teks: "3.4A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["regroup-sub", "zeros-in-sub"],
    grade: 3,
    primaryType: "computation"
  },

  // 29 - MULTIPLY easy
  {
    narrative: "Tony packs 5 boxes with 6 repulsor coils in each box.",
    expression: "5 x 6 = ?",
    operation: "MULTIPLY",
    operands: [5, 6],
    correctAnswer: 30,
    teks: "3.4F",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 30 - MULTIPLY medium
  {
    narrative: "Pepper arranges 7 rows of 8 chairs for the Stark Industries gala.",
    expression: "7 x 8 = ?",
    operation: "MULTIPLY",
    operands: [7, 8],
    correctAnswer: 56,
    teks: "3.4F",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["mult-fact-error"],
    grade: 3,
    primaryType: "computation"
  },

  // 31 - MULTIPLY hard
  {
    narrative: "SHIELD deploys 9 squads of 9 agents to guard Avengers Tower.",
    expression: "9 x 9 = ?",
    operation: "MULTIPLY",
    operands: [9, 9],
    correctAnswer: 81,
    teks: "3.4F",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["mult-fact-error"],
    grade: 3,
    primaryType: "computation"
  },

  // 32 - MULTIPLY easy
  {
    narrative: "Jarvis runs 3 diagnostics on each of 4 suit systems.",
    expression: "3 x 4 = ?",
    operation: "MULTIPLY",
    operands: [3, 4],
    correctAnswer: 12,
    teks: "3.4H",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 33 - DIVIDE easy
  {
    narrative: "Tony splits 20 energy cells equally among 5 suits.",
    expression: "20 / 5 = ?",
    operation: "DIVIDE",
    operands: [20, 5],
    correctAnswer: 4,
    teks: "3.4H",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 34 - DIVIDE medium
  {
    narrative: "The Avengers divide 56 supplies equally into 7 kits.",
    expression: "56 / 7 = ?",
    operation: "DIVIDE",
    operands: [56, 7],
    correctAnswer: 8,
    teks: "3.4H",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 35 - MULTIPLY medium
  {
    narrative: "Pepper orders 10 sets of 10 name badges for the conference.",
    expression: "10 x 10 = ?",
    operation: "MULTIPLY",
    operands: [10, 10],
    correctAnswer: 100,
    teks: "3.5A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 36 - FRACTION_ADD easy
  {
    narrative: "Tony uses 1/4 of a vibranium sheet, then another 1/4.",
    expression: "1/4 + 1/4 = ?",
    operation: "FRACTION_ADD",
    operands: [{ numerator: 1, denominator: 4 }, { numerator: 1, denominator: 4 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "3.3A",
    difficulty: "easy",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 37 - FRACTION_SUBTRACT easy
  {
    narrative: "Jarvis fills 3/4 of a fuel cell and drains 1/4 for testing.",
    expression: "3/4 - 1/4 = ?",
    operation: "FRACTION_SUBTRACT",
    operands: [{ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 4 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "3.3A",
    difficulty: "easy",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 3,
    primaryType: "computation"
  },

  // 38 - COMPARE medium
  {
    narrative: "Tony compares 589 watts of output to 598 watts on the display.",
    expression: "589 ? 598",
    operation: "COMPARE",
    operands: [589, 598],
    correctAnswer: "<",
    teks: "3.2D",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: [],
    grade: 3,
    primaryType: "comparison"
  },

  // 39 - SUBTRACT hard
  {
    narrative: "SHIELD has 1000 rounds of ammunition; 637 are used in training.",
    expression: "1000 - 637 = ?",
    operation: "SUBTRACT",
    operands: [1000, 637],
    correctAnswer: 363,
    teks: "3.4J",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["zeros-in-sub", "regroup-sub"],
    grade: 3,
    primaryType: "computation"
  },

  // =========================================================================
  // GRADE 4  (within 10,000, multi-digit multiply)  --  13 exemplars
  // =========================================================================

  // 40 - ADD easy
  {
    narrative: "Tony logs 1,245 flight hours and adds 320 more this month.",
    expression: "1245 + 320 = ?",
    operation: "ADD",
    operands: [1245, 320],
    correctAnswer: 1565,
    teks: "4.4A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 41 - ADD medium
  {
    narrative: "Pepper tracks 3,478 donations and receives 2,156 more.",
    expression: "3478 + 2156 = ?",
    operation: "ADD",
    operands: [3478, 2156],
    correctAnswer: 5634,
    teks: "4.4A",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 42 - ADD hard
  {
    narrative: "SHIELD records 4,867 incidents and 3,945 in the following year.",
    expression: "4867 + 3945 = ?",
    operation: "ADD",
    operands: [4867, 3945],
    correctAnswer: 8812,
    teks: "4.4A",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["regroup-add"],
    grade: 4,
    primaryType: "computation"
  },

  // 43 - SUBTRACT easy
  {
    narrative: "Tony has 5,000 credits and spends 1,200 on arc reactor parts.",
    expression: "5000 - 1200 = ?",
    operation: "SUBTRACT",
    operands: [5000, 1200],
    correctAnswer: 3800,
    teks: "4.4A",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 44 - SUBTRACT hard
  {
    narrative: "Jarvis tracks 7,003 records and purges 2,568 outdated entries.",
    expression: "7003 - 2568 = ?",
    operation: "SUBTRACT",
    operands: [7003, 2568],
    correctAnswer: 4435,
    teks: "4.4A",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["zeros-in-sub", "regroup-sub"],
    grade: 4,
    primaryType: "computation"
  },

  // 45 - MULTIPLY easy
  {
    narrative: "Tony installs 12 thrusters on each of 4 prototype suits.",
    expression: "12 x 4 = ?",
    operation: "MULTIPLY",
    operands: [12, 4],
    correctAnswer: 48,
    teks: "4.4B",
    difficulty: "easy",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 46 - MULTIPLY medium
  {
    narrative: "Pepper orders 23 tables with 15 settings at each for the gala.",
    expression: "23 x 15 = ?",
    operation: "MULTIPLY",
    operands: [23, 15],
    correctAnswer: 345,
    teks: "4.4B",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["multi-digit-mult"],
    grade: 4,
    primaryType: "computation"
  },

  // 47 - MULTIPLY hard
  {
    narrative: "SHIELD orders 48 crates with 36 grenades in each crate.",
    expression: "48 x 36 = ?",
    operation: "MULTIPLY",
    operands: [48, 36],
    correctAnswer: 1728,
    teks: "4.4D",
    difficulty: "hard",
    answerType: "integer",
    diagnosticFor: ["multi-digit-mult"],
    grade: 4,
    primaryType: "computation"
  },

  // 48 - DIVIDE medium
  {
    narrative: "The Avengers split 144 rations equally among 12 members.",
    expression: "144 / 12 = ?",
    operation: "DIVIDE",
    operands: [144, 12],
    correctAnswer: 12,
    teks: "4.4F",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 49 - DIVIDE medium
  {
    narrative: "Tony distributes 225 nanobots equally into 9 repair modules.",
    expression: "225 / 9 = ?",
    operation: "DIVIDE",
    operands: [225, 9],
    correctAnswer: 25,
    teks: "4.4F",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 50 - FRACTION_ADD medium
  {
    narrative: "Tony fills 1/3 of a fuel tank, then Jarvis adds another 1/6.",
    expression: "1/3 + 1/6 = ?",
    operation: "FRACTION_ADD",
    operands: [{ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "4.3A",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: ["unlike-denom"],
    grade: 4,
    primaryType: "computation"
  },

  // 51 - FRACTION_SUBTRACT medium
  {
    narrative: "Pepper allocates 5/8 of the budget and returns 1/8 to reserves.",
    expression: "5/8 - 1/8 = ?",
    operation: "FRACTION_SUBTRACT",
    operands: [{ numerator: 5, denominator: 8 }, { numerator: 1, denominator: 8 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "4.3A",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 52 - COMPARE hard
  {
    narrative: "Jarvis compares 4,567 volts on sensor A to 4,576 on sensor B.",
    expression: "4567 ? 4576",
    operation: "COMPARE",
    operands: [4567, 4576],
    correctAnswer: "<",
    teks: "4.2A",
    difficulty: "hard",
    answerType: "comparison",
    diagnosticFor: ["digit-swap-compare"],
    grade: 4,
    primaryType: "comparison"
  },

  // =========================================================================
  // GRADE 5  (decimals, fractions)  --  13 exemplars
  // =========================================================================

  // 53 - FRACTION_ADD medium
  {
    narrative: "Tony mixes 1/2 liter of solvent with 1/3 liter of catalyst.",
    expression: "1/2 + 1/3 = ?",
    operation: "FRACTION_ADD",
    operands: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }],
    correctAnswer: { numerator: 5, denominator: 6 },
    teks: "5.3A",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: ["unlike-denom"],
    grade: 5,
    primaryType: "computation"
  },

  // 54 - FRACTION_SUBTRACT medium
  {
    narrative: "Jarvis charges 7/8 of the battery and uses 3/8 overnight.",
    expression: "7/8 - 3/8 = ?",
    operation: "FRACTION_SUBTRACT",
    operands: [{ numerator: 7, denominator: 8 }, { numerator: 3, denominator: 8 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "5.3A",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 55 - FRACTION_ADD hard
  {
    narrative: "Pepper combines 2/5 of a shipment with 3/10 from another warehouse.",
    expression: "2/5 + 3/10 = ?",
    operation: "FRACTION_ADD",
    operands: [{ numerator: 2, denominator: 5 }, { numerator: 3, denominator: 10 }],
    correctAnswer: { numerator: 7, denominator: 10 },
    teks: "5.3A",
    difficulty: "hard",
    answerType: "fraction",
    diagnosticFor: ["unlike-denom"],
    grade: 5,
    primaryType: "computation"
  },

  // 56 - FRACTION_MULTIPLY medium
  {
    narrative: "Tony needs 2/3 of a 3/4-meter titanium rod for the suit.",
    expression: "2/3 x 3/4 = ?",
    operation: "FRACTION_MULTIPLY",
    operands: [{ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "5.3B",
    difficulty: "medium",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 57 - FRACTION_MULTIPLY hard
  {
    narrative: "SHIELD uses 5/6 of a 3/5-ton crate of vibranium for upgrades.",
    expression: "5/6 x 3/5 = ?",
    operation: "FRACTION_MULTIPLY",
    operands: [{ numerator: 5, denominator: 6 }, { numerator: 3, denominator: 5 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "5.3B",
    difficulty: "hard",
    answerType: "fraction",
    diagnosticFor: ["frac-mult-simplify"],
    grade: 5,
    primaryType: "computation"
  },

  // 58 - FRACTION_SUBTRACT hard
  {
    narrative: "Jarvis reserves 5/6 of memory but frees 1/3 after cleanup.",
    expression: "5/6 - 1/3 = ?",
    operation: "FRACTION_SUBTRACT",
    operands: [{ numerator: 5, denominator: 6 }, { numerator: 1, denominator: 3 }],
    correctAnswer: { numerator: 1, denominator: 2 },
    teks: "5.3D",
    difficulty: "hard",
    answerType: "fraction",
    diagnosticFor: ["unlike-denom"],
    grade: 5,
    primaryType: "computation"
  },

  // 59 - DECIMAL_ADD easy
  {
    narrative: "Tony measures 3.25 grams of palladium and adds 1.50 grams more.",
    expression: "3.25 + 1.50 = ?",
    operation: "DECIMAL_ADD",
    operands: [3.25, 1.50],
    correctAnswer: 4.75,
    teks: "5.3K",
    difficulty: "easy",
    answerType: "decimal",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 60 - DECIMAL_ADD medium
  {
    narrative: "Pepper logs expenses of 47.89 dollars and 36.45 dollars.",
    expression: "47.89 + 36.45 = ?",
    operation: "DECIMAL_ADD",
    operands: [47.89, 36.45],
    correctAnswer: 84.34,
    teks: "5.3K",
    difficulty: "medium",
    answerType: "decimal",
    diagnosticFor: ["decimal-align"],
    grade: 5,
    primaryType: "computation"
  },

  // 61 - DECIMAL_SUBTRACT easy
  {
    narrative: "Tony has 9.75 liters of coolant and uses 3.25 liters.",
    expression: "9.75 - 3.25 = ?",
    operation: "DECIMAL_SUBTRACT",
    operands: [9.75, 3.25],
    correctAnswer: 6.50,
    teks: "5.3K",
    difficulty: "easy",
    answerType: "decimal",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 62 - DECIMAL_SUBTRACT medium
  {
    narrative: "Jarvis measures 15.03 volts and detects a 7.68 volt drop.",
    expression: "15.03 - 7.68 = ?",
    operation: "DECIMAL_SUBTRACT",
    operands: [15.03, 7.68],
    correctAnswer: 7.35,
    teks: "5.3K",
    difficulty: "medium",
    answerType: "decimal",
    diagnosticFor: ["decimal-align", "regroup-sub"],
    grade: 5,
    primaryType: "computation"
  },

  // 63 - DECIMAL_MULTIPLY medium
  {
    narrative: "SHIELD orders 4.5 kilograms of alloy at 12 credits per kilogram.",
    expression: "4.5 x 12 = ?",
    operation: "DECIMAL_MULTIPLY",
    operands: [4.5, 12],
    correctAnswer: 54,
    teks: "5.3K",
    difficulty: "medium",
    answerType: "decimal",
    diagnosticFor: ["decimal-place-mult"],
    grade: 5,
    primaryType: "computation"
  },

  // 64 - COMPARE medium
  {
    narrative: "Tony compares a 0.75 efficiency rating to a 0.7 rating.",
    expression: "0.75 ? 0.7",
    operation: "COMPARE",
    operands: [0.75, 0.7],
    correctAnswer: ">",
    teks: "5.2A",
    difficulty: "medium",
    answerType: "comparison",
    diagnosticFor: ["decimal-compare-length"],
    grade: 5,
    primaryType: "comparison"
  },

  // 65 - COMPARE hard
  {
    narrative: "Jarvis compares power readings of 0.125 kilowatts and 0.15 kilowatts.",
    expression: "0.125 ? 0.15",
    operation: "COMPARE",
    operands: [0.125, 0.15],
    correctAnswer: "<",
    teks: "5.2A",
    difficulty: "hard",
    answerType: "comparison",
    diagnosticFor: ["decimal-compare-length"],
    grade: 5,
    primaryType: "comparison"
  }

];
// --------------------------------------------------------------------------
//  Helper functions
// --------------------------------------------------------------------------

/**
 * Strip a full exemplar down to 7-field injection format for the LLM prompt.
 */
function toInjectionFormat(exemplar) {
  return {
    narrative: exemplar.narrative,
    operation: exemplar.operation,
    operands: exemplar.operands,
    teks: exemplar.teks,
    difficulty: exemplar.difficulty,
    answerType: exemplar.answerType,
    diagnosticFor: exemplar.diagnosticFor || []
  };
}

/**
 * Select a diverse set of exemplars relevant to the selected TEKS.
 * Returns injection-ready 7-field objects (already stripped).
 * @param {string[]} selectedTeks - Array of TEKS codes the teacher selected
 * @param {Array} exemplars - Full exemplar pool (default: PROBLEM_EXEMPLARS only)
 * @returns {Array} Up to 8 injection-ready exemplar objects
 */
function selectExemplars(selectedTeks, exemplars) {
  if (typeof exemplars === 'undefined') exemplars = PROBLEM_EXEMPLARS;
  var MAX = 8;

  // Direct TEKS matches first
  var direct = exemplars.filter(function (e) {
    return selectedTeks.includes(e.teks);
  });

  if (direct.length >= MAX) {
    return diverseSelect(direct, MAX).map(toInjectionFormat);
  }

  // Fill with same-grade exemplars
  var grades = [];
  selectedTeks.forEach(function (t) {
    var g = t.charAt(0);
    if (grades.indexOf(g) === -1) grades.push(g);
  });

  var gradeMatches = exemplars.filter(function (e) {
    return grades.indexOf(String(e.grade)) !== -1 && direct.indexOf(e) === -1;
  });

  var combined = direct.concat(gradeMatches);
  return diverseSelect(combined, MAX).map(toInjectionFormat);
}

/**
 * Select diverse items from a pool, balancing difficulty and operation variety.
 */
function diverseSelect(items, count) {
  if (items.length <= count) return items.slice();

  var selected = [];
  var seen = {};

  // First pass: one per unique operation
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!seen[item.operation] && selected.length < count) {
      selected.push(item);
      seen[item.operation] = true;
    }
  }

  // Second pass: one per difficulty level
  var diffs = ['easy', 'medium', 'hard'];
  for (var d = 0; d < diffs.length; d++) {
    if (selected.length >= count) break;
    for (var j = 0; j < items.length; j++) {
      if (items[j].difficulty === diffs[d] && selected.indexOf(items[j]) === -1) {
        selected.push(items[j]);
        break;
      }
    }
  }

  // Fill remaining randomly
  var remaining = items.filter(function (it) {
    return selected.indexOf(it) === -1;
  });
  while (selected.length < count && remaining.length > 0) {
    var idx = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(idx, 1)[0]);
  }

  return selected;
}

// --------------------------------------------------------------------------
//  Expose globals
// --------------------------------------------------------------------------
window.PROBLEM_EXEMPLARS = PROBLEM_EXEMPLARS;
window.selectExemplars   = selectExemplars;
window.toInjectionFormat = toInjectionFormat;
window.diverseSelect     = diverseSelect;

console.log('[Exemplars] Batch 1 loaded:', PROBLEM_EXEMPLARS.length, 'readiness standard exemplars');
