/**
 * STAAR Problem Exemplar Bank -- Grade 3 Math
 * ============================================
 * This file contains curated exemplar problems extracted from
 * official TEA-released STAAR tests (2019--2025).
 *
 * PURPOSE: Provides few-shot examples for the Groq/Llama LLM
 * so it learns what high-quality, TEKS-aligned problems look like.
 * The LLM reads these patterns and generates original problems
 * with Iron Man theming and fresh numbers.
 *
 * TWO SCHEMAS:
 *   Storage Schema (this file) -- all 21 fields, used for selection
 *   Injection Schema (built at runtime) -- 7 fields sent to LLM
 *
 * EXTRACTION STATUS:
 *   Batch 1 (Readiness): COMPLETE -- 65 of ~93 MC items extracted
 *   Batch 2 (Supporting): NOT STARTED
 *   Batch 3 (Missing TEKS): NOT STARTED
 *
 * TEKS FORMAT: All codes normalized to canonical "X.YZ" format
 *   e.g., "3.4A" (not "3.4(A)" or "3.2.4.A")
 *
 * ANSWER LETTER NORMALIZATION: 2019-2022 even-numbered items
 *   used F/G/H/J instead of A/B/C/D. All normalized during
 *   extraction: F->A, G->B, H->C, J->D.
 *
 * TYPE CONVENTIONS:
 *   correctAnswer: string ("A") | string[] (["A","E"]) | null (free-response)
 *   correctAnswerValue: number (292) | null (conceptual answer)
 *   options: array ([{letter, text}]) | null (free-response)
 *   distractorRationales: object ({B: "...", C: "...", D: "..."}) | null
 *
 * OPERATION CODES (12 total):
 *   ADD, SUBTRACT, MULTIPLY, DIVIDE, COMPARE, CLASSIFY,
 *   REPRESENT, MEASURE, DATA_INTERPRET, PATTERN, FINANCIAL, CONCEPTUAL
 */

const PROBLEM_EXEMPLARS = [

  // ============================================================
  // 2024 STAAR -- Grade 3 Math
  // Source: 2024staar3mathtest_online.pdf (questions)
  //         2024staar3mathrationale.pdf (rationales)
  //         2024staar3mathexptestedTable_1.csv (metadata)
  // ============================================================

  {
    // --- IDENTIFICATION ---
    teks: "3.4A",
    source: "STAAR",
    year: 2024,
    itemNumber: 1,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A school had 375 hot dogs to sell during a carnival. After the carnival ended, 83 hot dogs were not sold. How many hot dogs were sold during the carnival?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 292,
    options: [
      { letter: "A", text: "292" },
      { letter: "B", text: "312" },
      { letter: "C", text: "458" },
      { letter: "D", text: "282" }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Keys = INCORRECT option letters only
    distractorRationales: {
      B: "Subtracted digit-by-digit without regrouping in the tens place (e.g., treated 7-8 as 8-7). Indicates weak regrouping skills.",
      C: "Added 375 + 83 instead of subtracting. Misidentified the operation from the word problem context.",
      D: "Attempted regrouping but made errors in both hundreds and tens places (rewrote 375 as 2 hundreds, 16 tens, 5 ones). Partial understanding of regrouping."
    },

    // --- SELECTION METADATA ---
    operation: "SUBTRACT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Real-world context where both numbers appear naturally in the story. Requires identifying subtraction from 'how many were sold' framing (not explicitly stated as subtraction). All three distractors target specific, common arithmetic misconceptions--regrouping errors and operation confusion--making them pedagogically diagnostic."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.2D",
    source: "STAAR",
    year: 2024,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "This list shows three clues about a number:\n- The number is greater than 89,236.\n- The number is less than 91,103.\n- The number has a digit greater than 7 in the thousands place.\nWhich of these could be the number?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,  // Conceptual--answer is a number selection, not a computed result
    options: [
      { letter: "A", text: "88,598" },
      { letter: "B", text: "91,057" },
      { letter: "C", text: "89,099" },
      { letter: "D", text: "89,572" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Ignored the first clue (greater than 89,236). Found a number less than 91,103 with a thousands digit > 7, but it fails the lower bound check.",
      B: "Verified the first two clues (91,057 > 89,236 and 91,057 < 91,103) but disregarded the third clue -- the thousands digit of 91,057 is 1, which is NOT greater than 7.",
      C: "Confused 'greater than' and 'less than' with arithmetic operations. May have tried adding/subtracting answer choices and 89,236 then checking the thousands digit."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Multi-Clue Reasoning",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Multi-constraint reasoning problem that requires students to check ALL three clues against each option systematically. Each distractor satisfies some clues but not all, testing whether students are thorough. Exercises place value understanding within a logical reasoning framework rather than rote comparison."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7B",
    source: "STAAR",
    year: 2024,
    itemNumber: 6,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // NOTE: Original problem shows 5 geometric figures with labeled side lengths.
    // Describing textually since our system generates text-based problems.
    questionStem: "Zachary drew these figures. The dimensions of each figure are given in feet.\n- Figure P: rectangle with sides 13, 5, 13, 5\n- Figure Q: hexagon with all sides 6\n- Figure R: parallelogram with sides 11, 7, 11, 7\n- Figure S: triangle with all sides 12\n- Figure T: square with all sides 6\nWhich list shows all the figures that have a perimeter of 36 feet?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,  // Answer is a list of figures, not a computed number
    options: [
      { letter: "A", text: "Figures P, Q, R, and S only" },
      { letter: "B", text: "Figures Q, R, and T only" },
      { letter: "C", text: "Figures P, R, and S only" },
      { letter: "D", text: "Figures P, Q, R, S, and T" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Miscalculated perimeter of Figure P (rectangle 13+5+13+5) as not 36, and miscounted Figure S (triangle 12+12+12) as not 36, but incorrectly calculated Figure T (square 6+6+6+6=24) as 36.",
      C: "Miscalculated perimeter of Figure Q (hexagon 6x6=36) as not 36. Correctly identified P, R, and S but missed Q.",
      D: "Included all figures including Figure T, whose perimeter is 24 not 36. Did not verify the square's perimeter calculation."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Perimeter Calculation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests perimeter across FIVE different polygon types (rectangle, hexagon, parallelogram, triangle, square) in one problem. Requires repeated application of 'add all sides' rather than memorizing a single formula. The trap is Figure T--same side length as Q but only 4 sides instead of 6, so different perimeter. Distractors isolate specific miscalculation errors."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5E",
    source: "STAAR",
    year: 2024,
    itemNumber: 13,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // NOTE: Original shows four data tables as answer options.
    // Describing tables textually in the options.
    questionStem: "The chef at a restaurant makes 6 burritos with every 1 pound of meat. Which table shows the relationship between burritos and pounds of meat?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,  // Relationship identification, not a computed number
    options: [
      { letter: "A", text: "Burritos: 7, 8, 16, 20 -> Pounds: 1, 2, 10, 14" },
      { letter: "B", text: "Burritos: 6, 12, 60, 84 -> Pounds: 1, 2, 10, 14" },
      { letter: "C", text: "Burritos: 1, 2, 10, 14 -> Pounds: 6, 12, 60, 84" },
      { letter: "D", text: "Burritos: 6, 12, 18, 24 -> Pounds: 1, 7, 13, 19" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Applied a 'minus 6' pattern instead of 'divided by 6' (7-6=1, 8-6=2, 16-6=10, 20-6=14). Confused subtraction with division in the multiplicative relationship.",
      C: "Reversed the relationship--identified 1 burrito per 6 pounds of meat instead of 6 burritos per 1 pound. Swapped the columns so the multiplier is applied backwards.",
      D: "Found an additive pattern (burritos minus 5 = pounds: 6-5=1, 12-5=7, 18-5=13, 24-5=19) instead of the multiplicative relationship described in the problem."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Input-Output Table",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests multiplicative relationship recognition (x6) with four deliberately crafted distractor tables. Option A tests subtraction vs division confusion. Option C tests direction of the relationship (a common and persistent error). Option D tests additive vs multiplicative thinking. Real-world context (restaurant) makes the relationship concrete rather than abstract."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7B",
    source: "STAAR",
    year: 2024,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A rectangular flag has a perimeter of 40 inches and a width of 5 inches. What is the length of the flag in inches?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 15,
    options: [
      { letter: "A", text: "15 in." },
      { letter: "B", text: "8 in." },
      { letter: "C", text: "30 in." },
      { letter: "D", text: "35 in." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Divided perimeter by width (40 / 5 = 8). Does not understand that perimeter is the sum of all sides, not a division relationship.",
      C: "Correctly subtracted both widths (40 - 5 - 5 = 30) but forgot to divide by 2 to find ONE side length. Partial understanding--got halfway through the multi-step process.",
      D: "Subtracted only one width (40 - 5 = 35). Does not understand that a rectangle has TWO sides of each measurement."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Missing Dimension",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Reverses the typical perimeter problem--gives perimeter and asks for a missing side, requiring algebraic thinking. Multi-step solution (subtract both widths, then divide) with each distractor representing a specific incomplete step in the reasoning chain. Option C is an especially strong distractor because it shows a student who understood most of the process but stopped one step early."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.8A",
    source: "STAAR",
    year: 2024,
    itemNumber: 19,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED: Original shows pictograph images as answer options.
    // Pictograph options described textually for exemplar storage.
    questionStem: "A restaurant sells four sizes of pizza. The table shows the pizzas sold: Small = 4, Medium = 10, Large = 18, Extra large = 8. Each picture of a whole pizza in a pictograph represents 4 pizzas. A picture of a half pizza represents 2 pizzas. Which pictograph correctly shows the data from the table?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Small: 1 whole; Medium: 3 whole; Large: 5 whole; Extra large: 2 whole" },
      { letter: "B", text: "Small: 1 whole; Medium: 2 whole and 1 half; Large: 2 whole; Extra large: 4 whole and 1 half" },
      { letter: "C", text: "Small: 1 whole; Medium: 2 whole; Large: 4 whole; Extra large: 2 whole" },
      { letter: "D", text: "Small: 1 whole; Medium: 2 whole and 1 half; Large: 4 whole and 1 half; Extra large: 2 whole" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Used whole pizza pictures instead of half-pizza pictures for Medium (10 = 2 whole + 1 half, not 3 whole) and Large (18 = 4 whole + 1 half, not 5 whole). Does not understand that a half-picture represents half the key value.",
      B: "Switched the data values for Large and Extra large categories--read 18 as Extra large and 8 as Large. Attention-to-detail error when reading from the source data table.",
      C: "Did not account for the remainder of 2 pizzas in both Medium (10 = 8 + 2) and Large (18 = 16 + 2). Does not recognize that a half-pizza picture can represent 2 pizzas."
    },

    // --- SELECTION METADATA ---
    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Readiness",
    reportingCategory: 4,
    problemType: "Pictograph Interpretation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests pictograph interpretation with a key requiring half-symbol recognition--a common STAAR data analysis pattern. Each distractor isolates a specific misconception: ignoring half-symbols (A), swapping data rows (B), or dropping remainders (C). The data table with non-multiples-of-4 values forces students to reason about partial representations."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4K",
    source: "STAAR",
    year: 2024,
    itemNumber: 20,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Steve puts 75 shirts on shelves at a store. He puts 15 shirts on each shelf. How many shelves does Steve put shirts on?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 5,
    options: [
      { letter: "A", text: "90" },
      { letter: "B", text: "60" },
      { letter: "C", text: "5" },
      { letter: "D", text: "6" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Added 75 + 15 = 90 instead of dividing. Misidentified the operation--saw two numbers and defaulted to addition.",
      B: "Subtracted 75 - 15 = 60 instead of dividing. Misidentified the operation--saw 'puts on' and chose subtraction.",
      D: "Found the correct quotient of 5 but then added 1 more for the '15 shirts' mentioned in the problem text (5 + 1 = 6). Over-interpreted the problem details."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Division Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Clean single-step equal-groups division (75 / 15 = 5). Three distractors test distinct operation-confusion patterns: addition (A), subtraction (B), and over-interpretation (D). Excellent template for generating division word problems because the context is simple and the distractors are pedagogically diagnostic."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4A",
    source: "STAAR",
    year: 2024,
    itemNumber: 22,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "At a weekend bake sale, 295 cookies were sold on Saturday. On Sunday 88 more cookies were sold than were sold on Saturday. What was the total number of cookies sold on Saturday and Sunday?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 678,
    options: [
      { letter: "A", text: "207" },
      { letter: "B", text: "383" },
      { letter: "C", text: "502" },
      { letter: "D", text: "678" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Subtracted 295 - 88 = 207, misinterpreting 'more than' as requiring subtraction instead of addition. Operation identification error with comparative language.",
      B: "Found Sunday's amount correctly (295 + 88 = 383) but stopped there--forgot to add Saturday's 295 to get the total. Classic two-step problem where student completes only step 1.",
      C: "Added Saturday twice then subtracted 88 instead of adding it: (295 + 295) - 88 = 502. Reversed the operation in step two--subtracted the difference instead of adding it."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Word Problem",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Classic two-step addition with 'more than' comparative language--a high-frequency STAAR pattern. Distractor B is especially diagnostic: it catches students who correctly complete step 1 but fail to execute step 2, isolating the multi-step reasoning gap. Requires regrouping across ones and tens places, adding procedural difficulty."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5B",
    source: "STAAR",
    year: 2024,
    itemNumber: 26,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Eva's flower shop has 72 flowers. Eva places an equal number of flowers in 8 vases. She sells 3 vases from the flower shop. Which equation can be used to find how many flowers Eva sells?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 27,
    options: [
      { letter: "A", text: "72 / 8 / 3 = 3" },
      { letter: "B", text: "72 - 8 - 3 = 61" },
      { letter: "C", text: "72 / 8 x 3 = 27" },
      { letter: "D", text: "72 / 8 + 3 = 12" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Divided correctly in step one (72 / 8 = 9) but then divided again by 3 instead of multiplying (9 / 3 = 3). Confused the second operation--divided when the context requires multiplying groups.",
      B: "Subtracted both values from 72 instead of dividing then multiplying (72 - 8 - 3 = 61). Used the wrong operations in both steps--does not recognize equal-groups context.",
      D: "Divided correctly in step one (72 / 8 = 9) but then added 3 instead of multiplying (9 + 3 = 12). Confused the second operation--added vases instead of multiplying by them."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Equation Representation",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step equation-representation problem--students must identify BOTH correct operations (divide then multiply), not just solve. Each distractor gets step one right (/8) but varies the second operation (/3, -8-3, +3), precisely isolating which operation students confuse. Excellent template for generating multi-operation algebraic reasoning problems."
  },

  // ============================================================
  // 2019 STAAR -- Grade 3 Math
  // Source: 2019staar3mathtest.pdf (questions)
  //         2019staar3mathrationales.pdf (rationales)
  //         2019staar3mathexptested.csv (metadata)
  // NOTE: Even-numbered items use F/G/H/J -> normalized to A/B/C/D
  // ============================================================

  {
    // --- IDENTIFICATION ---
    teks: "3.2A",
    source: "STAAR",
    year: 2019,
    itemNumber: 4,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // NORMALIZATION: Even item -- F->A, G->B, H->C, J->D
    questionStem: "The expanded form of a number is shown.\n90,000 + 200 + 40 + 1\nWhat is the standard form of this number?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 90241,
    options: [
      { letter: "A", text: "9,241" },
      { letter: "B", text: "92,041" },
      { letter: "C", text: "90,241" },
      { letter: "D", text: "90,421" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused 90,000 with 9,000 -- placed the digit 9 in the thousands place instead of the ten-thousands place. Place-value magnitude error.",
      B: "Confused 200 with 2,000 -- placed the digit 2 in the thousands place instead of the hundreds place. Place-value magnitude error.",
      D: "Reversed the digits in the hundreds place (2) and the tens place (4), writing 421 instead of 241. Place-value position swap error."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Expanded to Standard Form",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests place-value understanding through expanded-to-standard form conversion with a five-digit number including a zero placeholder (thousands). Each distractor targets a specific place-value confusion: magnitude error for ten-thousands (A), magnitude error for hundreds (B), and position swap (D). The zero in the thousands place is a deliberate trap that tests understanding of placeholder values."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5A",
    source: "STAAR",
    year: 2019,
    itemNumber: 7,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Freddie had $256 in his bank account. On Monday he put $50 more into his account. On Tuesday he took out $87 to buy a bicycle. Which equation can be used to find the amount of money Freddie had in his bank account after he took out money on Tuesday?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "256 - 50 - 87 = ___" },
      { letter: "B", text: "256 + 50 + 87 = ___" },
      { letter: "C", text: "250 - 50 + 87 = ___" },
      { letter: "D", text: "256 + 50 - 87 = ___" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Used subtraction for the $50 deposit instead of addition. Confused 'put into' (addition) with 'took out' (subtraction) -- applied subtraction to both actions.",
      B: "Used addition for the $87 withdrawal instead of subtraction. Confused 'took out' (subtraction) with 'put into' (addition) -- applied addition to both actions.",
      C: "Used wrong starting amount ($250 instead of $256), subtracted the deposit instead of adding, and added the withdrawal instead of subtracting. Multiple errors in both reading and operation identification."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Equation Representation",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step equation representation with real-world banking context (deposit + withdrawal). Tests whether students can match 'put in' -> addition and 'took out' -> subtraction in the same problem. Option C is especially diagnostic -- it contains THREE distinct errors (wrong starting value, reversed first operation, reversed second operation), catching students who are guessing randomly. Strong template for generating contextual equation-matching problems."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6A",
    source: "STAAR",
    year: 2019,
    itemNumber: 11,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED: Original shows 3D shape images as answer options.
    // Shapes described textually based on rationale content.
    questionStem: "Four 3D figures are shown: a cube, a triangular prism, a cylinder, and a rectangular prism. Which figure CANNOT be classified as a prism?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Cube (square bases connected by rectangles)" },
      { letter: "B", text: "Triangular prism (triangular bases connected by rectangles)" },
      { letter: "C", text: "Cylinder (circular bases connected by a curved surface)" },
      { letter: "D", text: "Rectangular prism (rectangular bases connected by rectangles)" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Did not recognize that a cube is a special prism where all faces are the same-size square. Unfamiliarity with cube as a prism subtype.",
      B: "Did not recognize that a prism can have triangular bases. Limited understanding of prism variety -- only associates 'prism' with rectangular shapes.",
      D: "Did not understand the defining characteristics of a prism in general. Needs foundational understanding of prism properties (polygon bases, parallel, connected by rectangles)."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "3D Shape Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests 3D shape classification using an exclusion pattern ('CANNOT be classified as'). The cylinder is the odd one out because its bases are circles (not polygons), which is the defining property that separates prisms from non-prisms. Each distractor reveals a different gap in prism understanding: not knowing cubes are prisms (A), not knowing triangular prisms exist (B), or general prism concept confusion (D)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3H",
    source: "STAAR",
    year: 2019,
    itemNumber: 13,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED: Original shows fraction strip model image.
    // Comparison describable textually -- strips supplementary.
    questionStem: "Fraction strips are shown for halves, thirds, fourths, sixths, and eighths. Which comparison and explanation are true?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "5/6 < 5/8, because eighths are larger than sixths" },
      { letter: "B", text: "5/6 < 5/8, because sixths are larger than eighths" },
      { letter: "C", text: "5/6 > 5/8, because eighths are larger than sixths" },
      { letter: "D", text: "5/6 > 5/8, because sixths are larger than eighths" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Compared denominators (6 < 8) and assumed larger denominator means larger parts. Got both the comparison AND the explanation wrong. Fundamental misconception about denominator-size relationship.",
      B: "Correctly identified that sixths are larger than eighths, but concluded 5/6 < 5/8 -- contradicting the explanation. Confused the comparison symbol (< vs >).",
      C: "Correctly compared 5/6 > 5/8 but incorrectly explained why ('eighths are larger than sixths'). Got the comparison right but the reasoning wrong -- did not attend to the explanation."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Fraction Comparison with Reasoning",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests BOTH fraction comparison AND the explanation -- students must get the direction (> or <) AND the reasoning correct. The 2x2 option structure (comparison x explanation) creates four distinct combinations, each isolating a specific error pattern. This is a common STAAR pattern where matching the symbol to the explanation is the real test, not just knowing which fraction is bigger."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6C",
    source: "STAAR",
    year: 2019,
    itemNumber: 16,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // NORMALIZATION: Even item -- F->A, G->B, H->C, J->D
    // ADAPTED: Original shows grid with shaded rectangle (12x6).
    // Dimensions stated textually from rationale content.
    questionStem: "A grid of unit squares represents a park. The shaded figure on the grid represents Erin's rectangular lawn. The lawn covers 6 rows, and each row is 12 squares long. Each square represents 1 square meter. What is the area in square meters of Erin's lawn?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 72,
    options: [
      { letter: "A", text: "18 square meters" },
      { letter: "B", text: "36 square meters" },
      { letter: "C", text: "62 square meters" },
      { letter: "D", text: "72 square meters" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Added length and width (12 + 6 = 18) instead of multiplying. Confused the area formula with simple addition of dimensions.",
      B: "Calculated the perimeter instead of the area (12 + 12 + 6 + 6 = 36). Confused area (space inside) with perimeter (distance around).",
      C: "Multiplied 12 x 6 but did not regroup in the tens place, getting 62 instead of 72. Correct operation chosen but procedural multiplication error."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Area Calculation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests area calculation with a grid model that supports counting AND multiplication strategies. The three distractors form a perfect diagnostic trio: addition confusion (A), perimeter confusion (B), and correct-operation-but-wrong-execution (C). Option B is the classic area-vs-perimeter trap that appears frequently on STAAR. The grid visual scaffolds understanding while still requiring the multiplication step."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3F",
    source: "STAAR",
    year: 2019,
    itemNumber: 19,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED: Original shows number line with Point P marked.
    // Number line described textually.
    questionStem: "A number line from 0 to 1 is divided into 4 equal sections. Point P is located at the end of the first section from 0. Point P represents two equivalent fractions. Which two equivalent fractions can point P represent?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/4 and 1/8" },
      { letter: "B", text: "1/3 and 2/6" },
      { letter: "C", text: "1/4 and 2/8" },
      { letter: "D", text: "1/4 and 3/4" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Identified 1/4 correctly but chose 1/8 as equivalent -- picked a fraction with the same numerator (1) but a different denominator. Does not understand how to generate equivalent fractions (multiply both numerator and denominator by the same number).",
      B: "Miscounted sections -- saw 3 sections between P and 1, and thought P represented 1/3 instead of 1/4. Then correctly found 2/6 as equivalent to 1/3. Position-reading error on the number line, not an equivalence error.",
      D: "Identified 1/4 correctly but paired it with 3/4 (the remaining distance from P to 1). Confused equivalent fraction with complementary fraction."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Equivalent Fractions on Number Line",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests equivalent fraction identification using a number line model -- students must BOTH read the position correctly AND find an equivalent representation. Each distractor isolates a different skill gap: same-numerator confusion (A), position-reading error (B), and complementary-fraction confusion (D). Option B is especially clever -- the student performs valid equivalence work (1/3 = 2/6) but starts from a misread position, showing partial competence."
  },


  // ============================================================
  // SESSION 3: 2021 STAAR Grade 3 Math -- 12 Readiness Items
  // Extracted from 2021staar3mathtest.pdf + staar2021grade3mathrationales.pdf
  // Even-numbered items normalized from F/G/H/J -> A/B/C/D
  // ============================================================

  // --- 2021 Item 3 | TEKS 3.4A | Addition with regrouping ---
  {
    // --- IDENTIFICATION ---
    teks: "3.4A",
    source: "STAAR",
    year: 2021,
    itemNumber: 3,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A theater sold tickets for three movies. The table shows the number of tickets sold for each movie.\n\nMovie 1: 143 tickets\nMovie 2: 158 tickets\nMovie 3: 175 tickets\n\nWhat was the total number of tickets the theater sold for these three movies?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 476,
    options: [
      { letter: "A", text: "476" },
      { letter: "B", text: "366" },
      { letter: "C", text: "376" },
      { letter: "D", text: "473" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student added the values but did not regroup to the tens place AND the hundreds place -- two separate regrouping failures producing 366.",
      C: "Student added the values but did not regroup to the hundreds place only -- partial regrouping error producing 376.",
      D: "Student made an error adding ones digits (3+8+5), getting 13 wrong and producing 473 instead of 476."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Multi-Addend Addition",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests three-addend addition requiring multiple regrouping steps. Each distractor isolates a specific regrouping failure: B misses BOTH regroupings, C misses only hundreds regrouping, D miscalculates ones-place sum. This gradient of errors lets the LLM learn that good distractors target specific procedural breakdown points rather than random wrong numbers."
  },

  // --- 2021 Item 7 | TEKS 3.6C | Area with unit squares ---
  {
    // --- IDENTIFICATION ---
    teks: "3.6C",
    source: "STAAR",
    year: 2021,
    itemNumber: 7,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Workers at a school are covering a rectangular patio with square tiles. Each square tile has an area of 1 square yard. The figure shows the part of the patio that has already been covered with square tiles. The patio covers 7 rows, and each row is 15 squares long.\n\nWhat is the area of the entire patio in square yards?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 105,
    options: [
      { letter: "A", text: "105 square yards" },
      { letter: "B", text: "90 square yards" },
      { letter: "C", text: "98 square yards" },
      { letter: "D", text: "84 square yards" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student miscounted the number of rows as 6 instead of 7 and multiplied 6 x 15 = 90 -- a counting/reading error on one dimension.",
      C: "Student miscounted the number of squares per row as 14 instead of 15 and multiplied 7 x 14 = 98 -- a counting error on the other dimension.",
      D: "Student miscounted BOTH dimensions (6 rows x 14 squares) getting 84 -- combines both counting errors from B and C."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Area with Unit Squares",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Elegant distractor design -- each wrong answer comes from miscounting exactly one or both dimensions of the array. D is particularly diagnostic: a student choosing 84 has made BOTH errors simultaneously. This teaches the LLM to create area distractors by systematically varying each dimension +/-1 rather than using random wrong products."
  },

  // --- 2021 Item 9 | TEKS 3.7B | Rectangle perimeter ---
  {
    // --- IDENTIFICATION ---
    teks: "3.7B",
    source: "STAAR",
    year: 2021,
    itemNumber: 9,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The side lengths of a rectangular mirror are shown in inches. The mirror is 18 inches wide and 28 inches long.\n\nWhat is the perimeter of the mirror in inches?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 92,
    options: [
      { letter: "A", text: "72 in." },
      { letter: "B", text: "46 in." },
      { letter: "C", text: "74 in." },
      { letter: "D", text: "92 in." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student added 18 + 28 but failed to regroup (got 36 instead of 46), then doubled: 36 + 36 = 72. Combines regrouping error with correct perimeter strategy.",
      B: "Student added only two sides (18 + 28 = 46) and stopped -- doesn't understand perimeter requires ALL four sides.",
      C: "Student added only three sides (18 + 28 + 28 = 74) -- partially understands perimeter but missed one width."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Perimeter Calculation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Complements existing 3.7B items (which are FIND-missing-side problems) by testing CALCULATE-total-perimeter. Distractor A is masterful -- the student uses the RIGHT strategy (double the sum) but makes an ARITHMETIC error (regrouping), showing that perimeter distractors can embed computation errors inside correct conceptual approaches."
  },

  // --- 2021 Item 13 | TEKS 3.5E | Multiplicative input-output table ---
  {
    // --- IDENTIFICATION ---
    teks: "3.5E",
    source: "STAAR",
    year: 2021,
    itemNumber: 13,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The table shows the numbers of baseball cards in different numbers of packages.\n\nPackages | Baseball Cards\n2        | 22\n3        | 33\n4        | 44\n5        | 55\n\nBased on the relationship shown in the table, which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The number of packages times 1 equals the number of baseball cards." },
      { letter: "B", text: "The number of packages plus 1 equals the number of baseball cards." },
      { letter: "C", text: "The number of packages plus 11 equals the number of baseball cards." },
      { letter: "D", text: "The number of packages times 11 equals the number of baseball cards." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student noticed the +1 pattern between consecutive values in the packages column (2->3->4->5) and confused addition with multiplication, thinking 'plus 1' was the same as 'times 1'.",
      B: "Student noticed the +1 pattern between consecutive packages values but didn't find the relationship to the corresponding baseball card values -- applied the within-column pattern as if it were the between-column rule.",
      C: "Student noticed the +11 pattern between consecutive values in the baseball cards column (22->33->44->55) but confused this within-column pattern with the between-column relationship."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Input-Output Relationship",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Brilliant distractor structure targeting THREE distinct pattern-reading errors: A/B both stem from confusing within-column patterns with between-column relationships, while C correctly identifies +11 as a consecutive difference but misattributes it as the rule. Teaches LLM that input-output table distractors should target the specific confusion between 'pattern within one column' vs 'relationship between paired columns'."
  },

  // --- 2021 Item 17 | TEKS 3.3H | Unit fraction comparison ---
  {
    // --- IDENTIFICATION ---
    teks: "3.3H",
    source: "STAAR",
    year: 2021,
    itemNumber: 17,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Fraction strips are shown for halves, thirds, fourths, sixths, and eighths.\n\nWhich comparison is true?\n\nA) 1/6 < 1/4\nB) 1/3 < 1/8\nC) 1/4 > 1/2\nD) 1/8 = 2/8",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/6 < 1/4" },
      { letter: "B", text: "1/3 < 1/8" },
      { letter: "C", text: "1/4 > 1/2" },
      { letter: "D", text: "1/8 = 2/8" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student compared denominators (3 < 8) and assumed smaller denominator means smaller fraction -- the classic 'bigger denominator means bigger piece' misconception reversed.",
      C: "Student compared denominators (4 > 2) and assumed larger denominator means larger fraction -- directly confusing denominator size with fraction size.",
      D: "Student saw the same denominator (8) in both fractions and assumed they were equal, ignoring that the numerators are different (1 != 2)."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Unit Fraction Comparison",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Each distractor targets a distinct fraction misconception: B tests 'bigger denominator = bigger fraction' (reversed), C tests 'bigger denominator = bigger fraction' (direct), D tests 'same denominator always means equal.' Complements existing 3.3H exemplar (2019 Item 13 tested same-numerator comparison with reasoning) by testing unit fraction comparison with visual model support."
  },

  // --- 2021 Item 21 | TEKS 3.3F | Equivalent fractions with area model ---
  {
    // --- IDENTIFICATION ---
    teks: "3.3F",
    source: "STAAR",
    year: 2021,
    itemNumber: 21,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Irene has a group of 8 counters arranged in 4 columns of 2. Two of the counters (one full column) are black, and the rest are white.\n\nWhich two fractions can represent the black counters in the group?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2/6 and 2/8" },
      { letter: "B", text: "1/3 and 2/6" },
      { letter: "C", text: "1/4 and 2/8" },
      { letter: "D", text: "1/4 and 2/4" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student correctly found 2/8 but chose 2/6 as equivalent -- believed equivalent fractions must share the same numerator rather than represent the same value.",
      B: "Student counted 2 black out of 6 WHITE (instead of 8 total), getting 2/6, then correctly found 1/3 equivalent to 2/6. Right equivalence process, wrong denominator (part-to-part instead of part-to-whole).",
      D: "Student correctly found 1/4 (1 column out of 4) but chose 2/4 as equivalent -- believed equivalent fractions must share the same denominator."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Equivalent Fractions with Model",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests equivalent fraction identification through TWO different counting strategies (individual counters: 2/8, columns: 1/4). Distractors isolate three distinct misconceptions: A (same-numerator confusion), B (part-to-part ratio instead of part-to-whole), D (same-denominator confusion). Complements existing 3.3F exemplar (number line model) with a discrete area model."
  },

  // --- 2021 Item 22 | TEKS 3.5A | Two-step equation representation ---
  // Note: Even item -- answer J normalized to D
  {
    // --- IDENTIFICATION ---
    teks: "3.5A",
    source: "STAAR",
    year: 2021,
    itemNumber: 22,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A cafeteria sold a total of 513 drinks on Wednesday. The table shows the number of each type of drink that was sold. The number of bottles of milk is missing from the table.\n\nBottles of apple juice: 172\nBottles of milk: ?\nBottles of water: 263\n\nWhich set of equations can be used to find the number of bottles of milk sold?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "172 + 263 = 435; 513 + 435 = ?" },
      { letter: "B", text: "263 - 172 = 91; 513 - 91 = ?" },
      { letter: "C", text: "513 - 172 = 341; 341 + 263 = ?" },
      { letter: "D", text: "172 + 263 = 435; 513 - 435 = ?" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student correctly added juice and water (172+263=435) but then ADDED that sum to the total (513+435) instead of subtracting -- reversed the second operation.",
      B: "Student subtracted juice FROM water (263-172=91) then subtracted from total (513-91) -- subtracted the two known values from each other rather than adding them.",
      C: "Student subtracted juice from total correctly (513-172=341) but then ADDED water (341+263) instead of subtracting -- correct first step with wrong second operation."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Equation Selection",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests equation SELECTION rather than computation -- students must identify the correct operation sequence without calculating. Each distractor uses the right numbers but wrong operations: A adds instead of subtracts in step 2, B subtracts then adds (operations swapped), C subtracts known values from each other. Complements existing 3.5A exemplar (2019 bank deposits, which tested sequential add-then-subtract) with a find-the-missing-part structure."
  },

  // --- 2021 Item 23 | TEKS 3.8A | Pictograph to table ---
  {
    // --- IDENTIFICATION ---
    teks: "3.8A",
    source: "STAAR",
    year: 2021,
    itemNumber: 23,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The pictograph shows the number of each type of balloon animal a clown made on Tuesday.\n\nDog: 4 icons\nMonkey: 2 icons\nRabbit: 6 icons\nBear: 3 icons\n\nEach icon means 2 animals.\n\nWhich table correctly represents the data?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Dog: 4, Monkey: 2, Rabbit: 5, Bear: 3" },
      { letter: "B", text: "Dog: 8, Monkey: 4, Rabbit: 12, Bear: 6" },
      { letter: "C", text: "Dog: 4, Monkey: 2, Rabbit: 6, Bear: 3" },
      { letter: "D", text: "Dog: 8, Monkey: 4, Rabbit: 10, Bear: 6" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student counted each icon as 1 (ignoring the key entirely) AND miscounted rabbit icons as 5 instead of 6 -- two errors combined.",
      C: "Student counted each icon as 1 animal, completely disregarding the key that says each icon = 2 animals. All values are exactly half the correct amounts.",
      D: "Student correctly applied the key (x2) for most animals but miscounted rabbit icons as 5 instead of 6, getting 10 instead of 12."
    },

    // --- SELECTION METADATA ---
    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Readiness",
    reportingCategory: 4,
    problemType: "Pictograph Interpretation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the critical 'apply the key' skill in pictographs. Distractors cleanly separate two error types: ignoring key (A,C) vs miscounting icons (A,D). C is the purest diagnostic -- if a student picks C, they definitely ignored the key. A combines both errors. Complements existing 3.8A exemplar (2024 Item 19 pizza pictograph creation) by testing pictograph READING rather than creation."
  },

  // --- 2021 Item 29 | TEKS 3.5B | Two-step equation with multiply and divide ---
  {
    // --- IDENTIFICATION ---
    teks: "3.5B",
    source: "STAAR",
    year: 2021,
    itemNumber: 29,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Cassandra used all the balloons in 11 packages to decorate for a party.\n- There were 6 balloons in each package.\n- Half of the balloons in each package were red.\n\nWhich equation can be used to find the total number of red balloons Cassandra used?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 33,
    options: [
      { letter: "A", text: "11 x 6 - 3 = 63" },
      { letter: "B", text: "11 x 6 / 2 = 33" },
      { letter: "C", text: "11 - 6 + 2 = 7" },
      { letter: "D", text: "11 x 6 / 3 = 22" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student correctly multiplied 11x6=66 for total balloons and knew 3 non-red per package, but only subtracted ONE set of 3 instead of accounting for all 11 packages -- doesn't generalize the halving across all packages.",
      C: "Student misread the problem entirely, subtracting then adding the given numbers (11-6+2=7) -- no understanding of the multiplication or halving relationships.",
      D: "Student correctly found total balloons (11x6=66) and knew division was needed, but divided by 3 (half of 6) instead of by 2 -- confused 'half of each package' with 'divide by half-of-6'."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Equation Selection",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests equation representation for a multiply-then-divide problem. Distractor D is exceptionally diagnostic -- the student identifies the right operations (x, /) but confuses the divisor (3 vs 2), revealing a subtle misunderstanding of 'half' as 'divide by half-of-the-group-size.' Complements existing 3.5B exemplar (2024 Item 26 flowers-in-vases) with a different operation pair and context."
  },

  // --- 2021 Item 30 | TEKS 3.6A | 3D shape classification ---
  // Note: Even item -- answer F normalized to A
  {
    // --- IDENTIFICATION ---
    teks: "3.6A",
    source: "STAAR",
    year: 2021,
    itemNumber: 30,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The objects shown can be classified into groups based on their shape: a can, an eraser, a toolbox, and a drum.\n\nWhich table best represents the classifications for these objects?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Prism: Eraser, Toolbox | Cylinder: Can, Drum" },
      { letter: "B", text: "Cube: Eraser, Toolbox | Cylinder: Can, Drum" },
      { letter: "C", text: "Prism: Eraser, Toolbox | Sphere: Can, Drum" },
      { letter: "D", text: "Cylinder: Eraser, Toolbox | Prism: Can, Drum" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student correctly grouped the objects but called the rectangular prism group 'Cubes' -- confuses cubes (all faces are same-size squares) with rectangular prisms (faces are rectangles).",
      C: "Student correctly grouped the objects but called the cylinder group 'Spheres' -- confuses spheres (round like a ball) with cylinders (round with circular bases).",
      D: "Student used the correct category names (Prism and Cylinder) but assigned the objects to the WRONG groups -- reversed which objects belong to which category."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "3D Shape Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests real-world object classification into geometric categories. Each distractor isolates a different geometric vocabulary error: B confuses cube/prism, C confuses sphere/cylinder, D swaps group assignments entirely. Complements existing 3.6A exemplar (2019 Item 11 tested which shape CANNOT be a prism) by testing correct categorization rather than exclusion."
  },

  // --- 2021 Item 31 | TEKS 3.4K | Two-step multiply word problem ---
  {
    // --- IDENTIFICATION ---
    teks: "3.4K",
    source: "STAAR",
    year: 2021,
    itemNumber: 31,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Hector played a game 14 times. Each time he played, he threw 4 red balls and 3 green balls at a target.\n\nWhat was the total number of balls Hector threw at the target?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 98,
    options: [
      { letter: "A", text: "21" },
      { letter: "B", text: "68" },
      { letter: "C", text: "98" },
      { letter: "D", text: "46" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student added all three numbers (14+4+3=21) instead of multiplying -- doesn't understand that multiplication represents repeated groups.",
      B: "Student added green balls to games (14+3=17) then multiplied by red balls (17x4=68) -- incorrectly combines addition and multiplication in the wrong sequence.",
      D: "Student multiplied games by green balls only (14x3=42) then added red balls once (42+4=46) -- only scaled one color of balls across all games."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Multiplication",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests two-step problem requiring add-then-multiply (4+3=7, then 14x7=98). Each distractor shows a different operation-selection error: A uses only addition, B combines operations in wrong order, D only scales one component. Complements existing 3.4K exemplar (2024 Item 20 simple division) by testing multiplication with an add-first prerequisite step."
  },

  // --- 2021 Item 32 | TEKS 3.2D | Number comparison NOT true ---
  // Note: Even item -- answer G normalized to B
  {
    // --- IDENTIFICATION ---
    teks: "3.2D",
    source: "STAAR",
    year: 2021,
    itemNumber: 32,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Which comparison is NOT true?\n\nA) 17,090 > 2,984\nB) 34,162 < 3,986\nC) 16,538 > 15,981\nD) 2,438 < 3,438",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "17,090 > 2,984" },
      { letter: "B", text: "34,162 < 3,986" },
      { letter: "C", text: "16,538 > 15,981" },
      { letter: "D", text: "2,438 < 3,438" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student chose a TRUE comparison instead of the NOT true one -- may have been confused by the negative framing of the question or didn't verify that 17,090 (5 digits) is indeed greater than 2,984 (4 digits).",
      C: "Student likely compared only the hundreds digit (5 vs 9) and concluded 16,538 < 15,981, thinking THIS was the false statement -- didn't compare from the highest place value (thousands: both have 1 in ten-thousands, but 6>5 in thousands).",
      D: "Student likely ignored the thousands digits (both 438) and thought the numbers were equal, making the < comparison false -- missed that 2,438 and 3,438 differ in the thousands place."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Number Comparison (Negated)",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests number comparison with a NOT-true twist that adds cognitive demand. The correct answer (B) is obvious once you count digits (5-digit number CAN'T be less than 4-digit number), but distractors target specific place-value comparison errors: C tests comparing from wrong place value position, D tests ignoring the most significant differing digit. Complements existing 3.2D exemplar (2024 Item 2 number clues) with a direct comparison format."
  },


  // ============================================================
  // SESSION 3 (continued): 2022 STAAR Grade 3 Math -- 10 Readiness Items
  // Extracted from 2022staar3mathtest.pdf + 2022staar3mathrationale.pdf
  // Even-numbered items normalized from F/G/H/J -> A/B/C/D
  // ============================================================

  // --- 2022 Item 1 | TEKS 3.2D | Number comparison ---
  {
    // --- IDENTIFICATION ---
    teks: "3.2D",
    source: "STAAR",
    year: 2022,
    itemNumber: 1,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Which comparison is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "68 > 649" },
      { letter: "B", text: "571 > 582" },
      { letter: "C", text: "730 < 806" },
      { letter: "D", text: "709 < 692" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student compared only the digits to the right of the first digit (8 > 4) without considering that 68 has fewer digits than 649 -- failed to recognize that a 2-digit number is always less than a 3-digit number.",
      B: "Student misinterpreted the > symbol to mean 'less than' -- correctly saw that 571 < 582 but chose the wrong comparison symbol.",
      D: "Student misinterpreted the < symbol to mean 'greater than' -- correctly identified that 709 > 692 but chose the wrong comparison symbol."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Number Comparison",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests 'which comparison is true' format requiring students to evaluate FOUR comparisons -- a higher cognitive demand than single-pair comparison. Two distractors (B, D) specifically target comparison SYMBOL confusion (> vs <) rather than number-value errors, teaching the LLM to create problems where the symbols themselves are the trap. Complements existing 3.2D items testing 5-digit numbers (2024#2 clues, 2021#32 NOT-true) with a simpler 3-digit scope."
  },

  // --- 2022 Item 3 | TEKS 3.3H | Same-denominator fraction comparison ---
  {
    // --- IDENTIFICATION ---
    teks: "3.3H",
    source: "STAAR",
    year: 2022,
    itemNumber: 3,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A student measured the lengths of two worms.\n- Worm S was 1/2 foot long.\n- Worm T was 2/2 foot long.\n\nWhich statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The length of Worm S is greater than the length of Worm T." },
      { letter: "B", text: "The length of Worm T is greater than the length of Worm S." },
      { letter: "C", text: "The length of Worm S is equal to the length of Worm T." },
      { letter: "D", text: "There is not enough information to compare the lengths of the worms." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student misinterpreted the words 'greater than' to mean 'less than' -- recognized the fractions differ but reversed the direction of the comparison.",
      C: "Student compared only the denominators (both are 2) and concluded the fractions are equal, ignoring that the numerators (1 vs 2) are different.",
      D: "Student believed there isn't enough information to compare, possibly not understanding that fractions with the same denominator can be compared by their numerators."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Fraction Comparison (Same Denominator)",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests same-denominator fraction comparison -- the simplest fraction comparison type. Complements existing 3.3H exemplars which test DIFFERENT denominators (2019#13 with fraction strips, 2021#17 with unit fractions). Distractor C is especially diagnostic: students who only look at denominators reveal a fundamental misconception about what numerators represent. Distractor D ('not enough info') targets students who don't yet understand fractions as comparable quantities."
  },

  // --- 2022 Item 9 | TEKS 3.5E | Additive input-output table ---
  {
    // --- IDENTIFICATION ---
    teks: "3.5E",
    source: "STAAR",
    year: 2022,
    itemNumber: 9,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The table shows the numbers of tomato plants and spinach plants in five different gardens.\n\nGarden K: 34 tomato, 43 spinach\nGarden L: 26 tomato, 35 spinach\nGarden M: 38 tomato, 47 spinach\nGarden N: 29 tomato, 38 spinach\nGarden P: 45 tomato, 54 spinach\n\nBased on the relationship shown in the table, which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "There are 9 more spinach plants than tomato plants in each garden." },
      { letter: "B", text: "There are 9 fewer spinach plants than tomato plants in each garden." },
      { letter: "C", text: "There are 8 more spinach plants than tomato plants in each garden." },
      { letter: "D", text: "There are 8 fewer spinach plants than tomato plants in each garden." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student correctly identified the difference as 9 but reversed the direction of the relationship -- said 'fewer' instead of 'more' spinach plants.",
      C: "Student found the difference between consecutive WITHIN-COLUMN values (34-26=8 or 43-35=8) instead of the difference BETWEEN columns in each row. Classic within-column vs between-column confusion.",
      D: "Student found the within-column difference of 8 AND reversed the relationship direction -- combines both error types from B and C."
    },

    // --- SELECTION METADATA ---
    operation: "PATTERN",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Input-Output Additive Relationship",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests ADDITIVE input-output relationship -- complementing existing 3.5E exemplars that test MULTIPLICATIVE relationships (2024#13 burritos x6, 2021#13 cards x11). This additive example (+9) is critical because the LLM needs both relationship types as exemplars. Distractor design is elegant: C/D target within-column vs between-column confusion, while B tests direction reversal. Five data pairs (not just 3-4) make the pattern unambiguous."
  },

  // --- 2022 Item 13 | TEKS 3.6A | Shape attribute table ---
  {
    // --- IDENTIFICATION ---
    teks: "3.6A",
    source: "STAAR",
    year: 2022,
    itemNumber: 13,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Leighton made a table that correctly shows the attributes of shapes. She used a check mark to identify the attributes of each shape.\n\nThe table has columns for: Shape, Has Vertices, and Quadrilateral.\nThe shapes listed are: Rectangle, Triangle, and Circle.\n\nWhich table could be the one Leighton made?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Rectangle: Has Vertices Y, Quadrilateral Y | Triangle: Has Vertices Y, Quadrilateral Y | Circle: no checks" },
      { letter: "B", text: "Rectangle: Has Vertices Y, Quadrilateral Y | Triangle: Quadrilateral Y | Circle: Has Vertices Y" },
      { letter: "C", text: "Rectangle: Has Vertices Y, Quadrilateral Y | Triangle: Has Vertices Y | Circle: no checks" },
      { letter: "D", text: "Rectangle: Has Vertices Y | Triangle: Has Vertices Y | Circle: no checks" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student confused quadrilateral (4-sided figure) with polygon (any closed figure with 3+ sides) -- marked triangle as a quadrilateral when it only has 3 sides.",
      B: "Student misunderstood 'vertices' (corners) and swapped attributes -- gave triangle no vertices but gave circle vertices, while also wrongly marking triangle as quadrilateral.",
      D: "Student correctly identified vertices for rectangle and triangle but did not recognize rectangle as a quadrilateral -- missed that all rectangles have 4 sides."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Shape Attribute Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests 2D shape attribute classification using a table format -- different from existing 3.6A exemplars that test 3D shapes (2019#11 which shape is NOT a prism, 2021#30 classify real-world objects). This 2D focus ensures the LLM sees both 2D and 3D classification exemplars. Distractors target vocabulary confusion: quadrilateral vs polygon (A), vertices misunderstanding (B), and incomplete attribute knowledge (D)."
  },

  // --- 2022 Item 16 | TEKS 3.7B | Octagon perimeter/side length ---
  // Note: Even item -- answer H normalized to C
  {
    // --- IDENTIFICATION ---
    teks: "3.7B",
    source: "STAAR",
    year: 2022,
    itemNumber: 16,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Each side of this figure is the same length. The perimeter of the figure is 72 inches.\n\nThe figure is a regular octagon (8 equal sides).\n\nWhat is the length of one side of the figure in inches?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 9,
    options: [
      { letter: "A", text: "8 in." },
      { letter: "B", text: "12 in." },
      { letter: "C", text: "9 in." },
      { letter: "D", text: "18 in." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student identified that the figure has 8 sides but wrote 8 as the answer -- confused the NUMBER of sides with the LENGTH of each side.",
      B: "Student divided the perimeter by 6 (hexagon sides) instead of 8 (octagon sides): 72/6=12. Miscounted or misidentified the number of sides.",
      D: "Student divided the perimeter by 4 (quadrilateral sides) instead of 8: 72/4=18. Applied rectangle perimeter logic to an octagon."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Perimeter - Find Side Length",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests perimeter with a NON-rectangular shape (octagon) -- a rarer problem type that complements existing 3.7B exemplars focused on rectangles (2024#6 multiple shapes, 2024#18 flag, 2021#9 mirror). The octagon context requires students to know how many sides an octagon has, blending geometry knowledge with measurement. Each distractor represents division by a different polygon's side count (4, 6, 8), making diagnosis precise."
  },

  // --- 2022 Item 17 | TEKS 3.4A | Multi-step subtraction ---
  {
    // --- IDENTIFICATION ---
    teks: "3.4A",
    source: "STAAR",
    year: 2022,
    itemNumber: 17,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A movie theater has 710 seats.\n- 158 seats are red.\n- 247 seats are black.\n- 119 seats are yellow.\n- The rest of the seats are green.\n\nHow many seats are green?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 186,
    options: [
      { letter: "A", text: "186" },
      { letter: "B", text: "524" },
      { letter: "C", text: "214" },
      { letter: "D", text: "206" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student correctly added 158+247+119=524 but stopped there -- didn't complete the second step of subtracting from the total (710).",
      C: "Student correctly added 158+247+119=524 then subtracted 710-524 but used 'subtract smaller from larger in each place value' instead of regrouping: 7-5=2, 1-2->1, 0-4->4 giving 214.",
      D: "Student made a regrouping error during the addition step (158+247+119->504 instead of 524), then correctly subtracted: 710-504=206. The error is in addition, not subtraction."
    },

    // --- SELECTION METADATA ---
    operation: "SUBTRACT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Multi-Step Add-then-Subtract",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests a 3-addend sum followed by subtraction from total -- the most complex multi-step structure under 3.4A. Distractor B (stopped after step 1) is especially powerful for the LLM because it teaches that 'intermediate answer as distractor' is a STAAR pattern. C and D each embed a different arithmetic error (regrouping in subtraction vs regrouping in addition), showing that good distractors can pinpoint WHERE in a multi-step process the student broke down."
  },

  // --- 2022 Item 18 | TEKS 3.6C | Area with unit squares ---
  // Note: Even item -- answer F normalized to A
  {
    // --- IDENTIFICATION ---
    teks: "3.6C",
    source: "STAAR",
    year: 2022,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Ms. Gonzalez is putting square stickers on a rectangular poster. Each sticker has an area of 1 square inch. She has already put some stickers on the poster as shown. The poster covers 7 rows, and each row is 8 stickers long.\n\nWhat is the area of the entire poster in square inches?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 56,
    options: [
      { letter: "A", text: "56 square inches" },
      { letter: "B", text: "42 square inches" },
      { letter: "C", text: "48 square inches" },
      { letter: "D", text: "15 square inches" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student miscounted the number of stickers per row as 6 instead of 8 and multiplied 7x6=42 -- counting error on columns.",
      C: "Student miscounted the number of rows as 6 instead of 7 and multiplied 6x8=48 -- counting error on rows.",
      D: "Student ADDED the dimensions instead of multiplying: 7+8=15. Fundamental confusion between area (multiply) and a sum."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Area with Unit Squares",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Pairs perfectly with 2021#7 (also area with unit squares but 15x7=105) to show the LLM TWO examples of the same problem type with different dimensions. Distractor D (addition instead of multiplication) is a fundamentally different error type from B and C (miscounting), giving the LLM a template for mixing CONCEPTUAL errors with PROCEDURAL errors in the same problem."
  },

  // --- 2022 Item 21 | TEKS 3.5A | Bar model equation representation ---
  {
    // --- IDENTIFICATION ---
    teks: "3.5A",
    source: "STAAR",
    year: 2022,
    itemNumber: 21,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The total number of keys on a computer keyboard is 87.\n- There are 26 letter keys and 21 special symbol keys on the keyboard.\n- The rest of the keys are function keys.\n\nWhich model represents one way to find the number of function keys on the keyboard?\n\nA) Bar model showing 87 total, split into 21 | ? | 26 (special symbols and letters swapped, unknown in middle)\nB) Bar model showing 87 total, split into 26 | 21 | ? (correct: letter + special + unknown = 87)\nC) Bar model showing 87 total with overlapping sections for 26 and 21\nD) Bar model showing 26 | 21 | 87 all in one row (adds all three numbers)",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Bar model: 87 total divided into sections 21, ?, and 26" },
      { letter: "B", text: "Bar model: 87 total divided into sections 26, 21, and ?" },
      { letter: "C", text: "Bar model: 87 total with overlapping sections for 26 and 21" },
      { letter: "D", text: "Bar model: 26, 21, and 87 all as parts adding to unknown total" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Student correctly understood that 26+21+?=87 but reversed the positions of special symbol keys and function keys in the model -- the sections are labeled incorrectly.",
      C: "Student correctly used 87 as total and included 26 and 21, but overlapped the sections -- doesn't understand that bar model parts must be non-overlapping to represent addition.",
      D: "Student placed 26, 21, and 87 all as parts in the same row, making the model show 26+21+87=? which contradicts the problem -- confused the total with a part."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Bar Model Representation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests bar model (part-whole) representation -- a visual/conceptual format not seen in existing 3.5A exemplars (2019#7 tests equation representation, 2021#22 tests equation set selection). This adds representational diversity. Distractors target model-construction errors: swapped labels (A), overlapping sections (C), total-as-part confusion (D) -- teaching the LLM that equation representation problems can use visual models, not just symbolic equations."
  },

  // --- 2022 Item 26 | TEKS 3.3F | Equivalent fractions with strip diagram ---
  // Note: Even item -- answer F normalized to A
  {
    // --- IDENTIFICATION ---
    teks: "3.3F",
    source: "STAAR",
    year: 2022,
    itemNumber: 26,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "The fraction strips shown can be used to find equivalent fractions.\n\nWhich fraction is equivalent to 2/4?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/2" },
      { letter: "B", text: "2/6" },
      { letter: "C", text: "3/4" },
      { letter: "D", text: "1/3" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student saw that 2/4 and 2/6 share the same numerator (2) and assumed same-numerator fractions are equivalent -- doesn't understand that equivalent fractions represent the same amount.",
      C: "Student saw that 2/4 and 3/4 share the same denominator (4) and assumed same-denominator fractions are equivalent -- confuses sharing a denominator with representing the same value.",
      D: "Student incorrectly shaded 2 of the 6 parts in the sixths row instead of 2 of the 4 parts in the fourths row, then found that 1/3 matched that incorrect shading -- misread the strip diagram."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Equivalent Fractions with Strip Diagram",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests direct equivalent fraction identification using strip diagrams. The same-numerator distractor (B: 2/6) and same-denominator distractor (C: 3/4) create a clean diagnostic pair -- together they reveal whether students understand equivalence or are pattern-matching on one component. Complements existing 3.3F exemplars: 2019#19 (number line model) and 2021#21 (counter array model) with strip diagram model, giving the LLM three different visual representations."
  },

  // --- 2022 Item 30 | TEKS 3.4K | Two-step multiply word problem ---
  // Note: Even item -- answer F normalized to A
  {
    // --- IDENTIFICATION ---
    teks: "3.4K",
    source: "STAAR",
    year: 2022,
    itemNumber: 30,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Alex bought 4 packages of pink golf balls and 2 packages of orange golf balls. There were 12 golf balls in each package.\n\nHow many golf balls did Alex buy?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 72,
    options: [
      { letter: "A", text: "72" },
      { letter: "B", text: "50" },
      { letter: "C", text: "96" },
      { letter: "D", text: "18" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Student multiplied 12x4=48 (pink only) then added 2 instead of 2 packages worth: 48+2=50. Treated '2 packages' as just the number 2 added on.",
      C: "Student multiplied all three numbers together: 4x2=8, then 8x12=96. Treated the two package counts as factors to multiply rather than addends to combine first.",
      D: "Student added all three numbers: 4+2+12=18. Used addition for every operation instead of recognizing the multiplication relationship."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Add-then-Multiply",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests add-then-multiply structure: (4+2)x12=72. Complements existing 3.4K exemplars: 2024#20 (simple division 75/15) and 2021#31 (add-then-multiply with 4+3=7, 7x14=98) by offering a THIRD variation. Distractor C (4x2x12=96) is particularly useful -- it reveals whether students understand that packages of the SAME item should be ADDED, not multiplied against each other. This 'multiply everything' error is a common STAAR pattern the LLM needs to generate."
  },


  // ============================================================
  // SESSION 4 PART A: 2022 remaining (7) + 2019 (2) + 2021 (1)
  // 10 items from cached sources
  // ============================================================

  // --- 2022 Item 6 | TEKS 3.8A | Dot plot interpretation ---
  // Note: Even item -- answer G normalized to B
  {
    teks: "3.8A",
    source: "STAAR",
    year: 2022,
    itemNumber: 6,
    grade: 3,
    subject: "math",

    questionStem: "The numbers listed show the speed in miles per hour Henry pitched a baseball.\n\n30, 32, 38, 30, 33, 34, 32, 35, 38, 36, 35, 32, 30, 32, 35\n\nWhich dot plot represents the speed of Henry's pitches?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Dot plot showing one dot per unique speed value (7 dots total)" },
      { letter: "B", text: "Dot plot: 30->3 dots, 32->4 dots, 33->1 dot, 34->1 dot, 35->3 dots, 36->1 dot, 38->2 dots" },
      { letter: "C", text: "Dot plot with at least one dot per value but incorrect counts for some speeds" },
      { letter: "D", text: "Dot plot with correct counts except 30 and 38 are miscounted" }
    ],

    distractorRationales: {
      A: "Student sorted speeds correctly but placed only ONE dot per unique value, ignoring that each data point needs its own dot -- doesn't understand that dots represent individual occurrences.",
      C: "Student placed at least one dot per value on the number line but used incorrect counts for some speeds -- partially understands dot plots but miscounted frequencies.",
      D: "Student counted most speeds correctly but miscounted the occurrences of 30 mph and 38 mph -- a tally/counting error on specific values."
    },

    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Readiness",
    reportingCategory: 4,
    problemType: "Dot Plot Interpretation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests dot plot creation from raw data -- a different 3.8A skill than pictograph reading (2021#23, 2024#19). Requires sorting AND counting, making it 2-step. Distractor A is especially diagnostic: the student who picks it fundamentally misunderstands what dots represent (unique values vs individual data points). Adds data representation diversity to the exemplar bank."
  },

  // --- 2022 Item 12 | TEKS 3.5B | Strip diagram multiplication model ---
  // Note: Even item -- answer F normalized to A
  {
    teks: "3.5B",
    source: "STAAR",
    year: 2022,
    itemNumber: 12,
    grade: 3,
    subject: "math",

    questionStem: "Janet has 2 new games.\n- Each game has 3 packs of cards.\n- Each pack has 10 cards.\n\nWhich model can be used to find the total number of cards Janet has for these 2 games?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Two identical strip diagrams, each showing 3 equal sections labeled 10 (representing 3x10 per game)" },
      { letter: "B", text: "Two identical strip diagrams, each showing 3 equal sections labeled 3 (representing 3x3)" },
      { letter: "C", text: "Two identical strip diagrams showing 3+10 (addition instead of multiplication)" },
      { letter: "D", text: "Two identical strip diagrams, each showing 1 section labeled 10 (representing 1x10)" }
    ],

    distractorRationales: {
      B: "Student confused what the section labels represent -- used 3 as the label (the number of sections) instead of 10 (the number of cards per pack), creating a 3x3 model.",
      C: "Student confused addition (3+10) with multiplication (3x10) when modeling the relationship between packs and cards -- modeled the sum instead of the product.",
      D: "Student misunderstood what the number of sections represents -- showed only 1 section of 10 instead of 3 sections of 10, creating a 1x10 model per game."
    },

    operation: "REPRESENT",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Strip Diagram Multiplication Model",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests visual MODEL selection for multiplication -- a different 3.5B skill than equation selection (2024#26, 2021#29). The two-game structure adds a layer: students must first model 3x10 correctly, then understand TWO copies are needed. Distractor C (addition vs multiplication confusion) is a fundamental misconception that the LLM should know to generate."
  },

  // --- 2022 Item 19 | TEKS 3.2D | Ordering 5-digit numbers ---
  {
    teks: "3.2D",
    source: "STAAR",
    year: 2022,
    itemNumber: 19,
    grade: 3,
    subject: "math",

    questionStem: "Four students with number cards want to line up from left to right in order from least to greatest number.\n\nErin: 9,975\nRico: 90,096\nPenelope: 98,300\nOlivia: 98,087\n\nWhich statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Olivia should be between Erin and Rico." },
      { letter: "B", text: "Erin should be on the right end after Olivia." },
      { letter: "C", text: "Penelope should be on the right end after Olivia." },
      { letter: "D", text: "All the students are in the correct order." }
    ],

    distractorRationales: {
      A: "Student compared only the tens and ones digits (75, 96, 87) and concluded Olivia (87) belongs between Erin (75) and Rico (96) -- ignored higher place values entirely.",
      B: "Student noticed all numbers start with 9 and compared only the second digit, concluding Erin's 9 (in 9,975) is greater than 8 (in 98,087) -- didn't account for different numbers of digits.",
      D: "Student compared only the ten-thousands and thousands digits (9 < 90 < 98 < 98) and assumed the order was already correct -- didn't compare within the 98,xxx pair to distinguish Penelope from Olivia."
    },

    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Number Ordering (Least to Greatest)",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests ORDERING (not just comparison) with mixed digit counts (4-digit vs 5-digit numbers). The 98,300 vs 98,087 pair requires comparing down to the hundreds place after matching ten-thousands and thousands -- a deeper place-value comparison than other 3.2D exemplars. Distractor D ('already correct') catches students who do incomplete comparisons."
  },

  // --- 2022 Item 22 | TEKS 3.6A | NOT a prism ---
  // Note: Even item -- answer J normalized to D
  {
    teks: "3.6A",
    source: "STAAR",
    year: 2022,
    itemNumber: 22,
    grade: 3,
    subject: "math",

    questionStem: "Chris built a fort using prisms. Which figure is NOT one Chris could have used to build his fort?\n\nFour 3D figures are shown: a cube, a triangular prism, a rectangular prism, and a pyramid.",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Cube" },
      { letter: "B", text: "Triangular prism" },
      { letter: "C", text: "Rectangular prism" },
      { letter: "D", text: "Pyramid" }
    ],

    distractorRationales: {
      A: "Student didn't recognize that a cube is a special prism where all faces are same-size squares -- thought cubes and prisms are separate categories.",
      B: "Student didn't recognize that a prism can have triangular bases -- thought prisms must have rectangular bases only.",
      C: "Student didn't recognize that a rectangular prism qualifies as a prism -- a fundamental misunderstanding of prism attributes."
    },

    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "3D Shape Classification (Exclusion)",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests the same 'NOT a prism' format as 2019#11 but with a DIFFERENT non-prism answer (pyramid vs cylinder). Together these two exemplars teach the LLM that NOT-type geometry questions should offer multiple plausible prism types as distractors, each targeting a different attribute misconception (cube!=prism, triangular bases exist, rectangular prism = prism)."
  },

  // --- 2022 Item 27 | TEKS 3.5E | Divisive input-output table ---
  {
    teks: "3.5E",
    source: "STAAR",
    year: 2022,
    itemNumber: 27,
    grade: 3,
    subject: "math",

    questionStem: "Shelly needs tickets for rides at an amusement park. The table shows the numbers of tickets needed to ride different numbers of rides.\n\nTickets | Rides\n6       | 3\n12      | 6\n18      | 9\n24      | 12\n\nBased on the relationship shown in the table, which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Shelly needs 3 tickets for each ride, because the number of tickets minus 3 equals the number of rides." },
      { letter: "B", text: "Shelly needs 3 tickets for each ride, because the number of tickets plus 3 equals the number of rides." },
      { letter: "C", text: "Shelly needs 2 tickets for each ride, because the number of tickets divided by 2 equals the number of rides." },
      { letter: "D", text: "Shelly needs 2 tickets for each ride, because the number of tickets times 2 equals the number of rides." }
    ],

    distractorRationales: {
      A: "Student used only the first row (6-3=3) and concluded subtraction by 3 is the rule -- applied a single-row observation without verifying across all rows.",
      B: "Student found the difference of 3 from the first row but reversed the operation direction -- said 'plus 3' instead of 'minus 3', showing confusion about operation direction.",
      D: "Student correctly identified the factor of 2 as the relationship but reversed the operation -- said 'times 2' instead of 'divided by 2'."
    },

    operation: "PATTERN",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Input-Output Divisive Relationship",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests DIVISION relationship in input-output tables -- complementing the MULTIPLICATION exemplar (2021#13 baseball cards x11) and the ADDITION exemplar (2022#9 garden plants +9). Now the LLM has all three relationship types. Distractors A/B target the 'first-row-only' trap, while D tests operation reversal (/2 vs x2)."
  },

  // --- 2022 Item 31 | TEKS 3.8A | Pictograph to table (key=3) ---
  {
    teks: "3.8A",
    source: "STAAR",
    year: 2022,
    itemNumber: 31,
    grade: 3,
    subject: "math",

    questionStem: "The pictograph shows the number of games each team in a volleyball league won during one season.\n\nSpikes: 4 icons\nAces: 3 icons\nStars: 5 icons\nNets: 2 icons\nDigs: 1 icon\n\nEach icon means 3 games.\n\nWhich table represents the data in the pictograph?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Spikes: 12, Aces: 15, Stars: 9, Nets: 6, Digs: 3" },
      { letter: "B", text: "Spikes: 4, Aces: 3, Stars: 5, Nets: 2, Digs: 1" },
      { letter: "C", text: "Spikes: 12, Aces: 9, Stars: 15, Nets: 6, Digs: 3" },
      { letter: "D", text: "Spikes: 4, Aces: 5, Stars: 3, Nets: 2, Digs: 1" }
    ],

    distractorRationales: {
      A: "Student correctly applied the key (x3) but swapped the values for Stars and Aces -- reading error that transposed two team values.",
      B: "Student counted each icon as 1 game, completely ignoring the key that says each icon = 3 games. All values are exactly one-third of the correct amounts.",
      D: "Student both ignored the key (counted icons as 1) AND swapped Stars and Aces values -- combines both errors from A and B."
    },

    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Readiness",
    reportingCategory: 4,
    problemType: "Pictograph to Table (Key=3)",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Uses key=3 (each icon = 3 games), complementing 2021#23 (key=2) and 2024#19 (key=4). The LLM now sees three different key values. The Aces/Stars swap in distractors A and D is a STAAR pattern -- generating 'correct values assigned to wrong categories' as a distractor type the LLM needs to learn."
  },

  // --- 2022 Item 32 | TEKS 3.4A | Sequential subtraction ---
  // Note: Even item -- answer G normalized to B
  {
    teks: "3.4A",
    source: "STAAR",
    year: 2022,
    itemNumber: 32,
    grade: 3,
    subject: "math",

    questionStem: "At the beginning of September, Mr. Watkins had 543 erasers.\n- During September he gave his students 99 of the erasers.\n- During October he gave his students 212 of the erasers.\n\nHow many erasers did Mr. Watkins have at the end of October?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 232,
    options: [
      { letter: "A", text: "854" },
      { letter: "B", text: "232" },
      { letter: "C", text: "430" },
      { letter: "D", text: "344" }
    ],

    distractorRationales: {
      A: "Student added all three numbers (543+99+212=854) instead of subtracting -- doesn't understand 'gave away' means subtraction.",
      C: "Student added 543+99=642 then subtracted 212 (642-212=430) -- added when should have subtracted in step 1, then correctly subtracted in step 2.",
      D: "Student correctly identified subtraction needed for both steps but failed to regroup properly: (543-99->556) then (556-212->344). Subtracted smaller digit from larger in each place value."
    },

    operation: "SUBTRACT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Sequential Subtraction",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests double subtraction (start - give - give) with regrouping. Distractor D targets the 'subtract smaller from larger in each column' regrouping error -- a critical STAAR distractor pattern. Complements existing 3.4A items: 2024#1 (single subtraction), 2024#22 (two-step addition), 2021#3 (multi-addend addition), 2022#17 (add-then-subtract)."
  },

  // --- 2019 Item 2 | TEKS 3.4K | Two-step add-then-multiply ---
  // Note: Even item -- answer G normalized to B
  {
    teks: "3.4K",
    source: "STAAR",
    year: 2019,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    questionStem: "Gerardo bought 3 packages of mint gum and 2 packages of bubble gum. Each package had 8 pieces of gum.\n\nHow many pieces of gum did Gerardo buy?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 40,
    options: [
      { letter: "A", text: "26" },
      { letter: "B", text: "40" },
      { letter: "C", text: "12" },
      { letter: "D", text: "48" }
    ],

    distractorRationales: {
      A: "Student correctly multiplied 3x8=24 (mint gum) but then added 2 (the package count) instead of 2x8=16 -- treated '2 packages' as the number 2 to add, not as 2 groups of 8.",
      C: "Student multiplied 3x8=24 then divided by 2 (24/2=12) -- introduced an incorrect division step instead of adding the bubble gum packages.",
      D: "Student multiplied all three numbers: 3x2=6, then 6x8=48 -- treated both package counts as multiplicative factors instead of adding them first."
    },

    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Add-then-Multiply",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Nearly identical STRUCTURE to 2022#30 (golf balls: (4+2)x12=72) but with different numbers and context ((3+2)x8=40). Having two exemplars of the same problem type is valuable -- the LLM can see which elements VARY (context, numbers) and which STAY THE SAME (add-packages-then-multiply structure). Distractor D (3x2x8=48) appears in both, confirming it's a reliable STAAR pattern."
  },

  // --- 2019 Item 27 | TEKS 3.2A | Number decomposition NOT ---
  {
    teks: "3.2A",
    source: "STAAR",
    year: 2019,
    itemNumber: 27,
    grade: 3,
    subject: "math",

    questionStem: "Which answer choice does NOT describe the number 7,140?\n\nA) The sum of seven thousands and fourteen tens\nB) The sum of seven thousands, one hundred, and forty tens\nC) The sum of seven thousands, one hundred, and four tens\nD) The sum of seven thousands, one hundred, and forty ones",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The sum of seven thousands and fourteen tens" },
      { letter: "B", text: "The sum of seven thousands, one hundred, and forty tens" },
      { letter: "C", text: "The sum of seven thousands, one hundred, and four tens" },
      { letter: "D", text: "The sum of seven thousands, one hundred, and forty ones" }
    ],

    distractorRationales: {
      A: "Student chose an answer that DOES correctly describe 7,140 (7,000 + 14x10 = 7,140) -- either didn't verify or didn't understand that 14 tens = 140.",
      C: "Student chose an answer that DOES correctly describe 7,140 (7,000 + 100 + 4x10 = 7,140) -- the standard decomposition, misidentified as incorrect.",
      D: "Student chose an answer that DOES correctly describe 7,140 (7,000 + 100 + 40x1 = 7,140) -- didn't understand that 40 ones = 40."
    },

    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Number Decomposition (Negated)",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests non-standard decomposition of numbers -- students must verify FOUR different word descriptions against the number value. The NOT framing adds cognitive demand. B is incorrect because 7,000+100+400=7,500!=7,140 (forty tens = 400, not 40). Complements existing 3.2A exemplar (2019#4 expanded form -> standard form) by testing the reverse: standard form -> verify word descriptions."
  },

  // --- 2021 Item 18 | TEKS 3.6C | Area of square (9x9) ---
  // Note: Even item -- answer J normalized to D
  {
    teks: "3.6C",
    source: "STAAR",
    year: 2021,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    questionStem: "Heidi is making a rectangular card. The shaded rectangle on the grid represents the card. Each square on the grid has an area of 1 square centimeter. The card covers 9 rows, and each row is 9 squares long.\n\nWhat is the area of this card in square centimeters?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 81,
    options: [
      { letter: "A", text: "18 square centimeters" },
      { letter: "B", text: "36 square centimeters" },
      { letter: "C", text: "90 square centimeters" },
      { letter: "D", text: "81 square centimeters" }
    ],

    distractorRationales: {
      A: "Student found 9 rows and 9 columns but ADDED instead of multiplying: 9+9=18. Fundamental confusion between area (multiplication) and perimeter-like thinking.",
      B: "Student found 9 per side and calculated PERIMETER instead of area: 9+9+9+9=36. Confuses the two measurement concepts.",
      C: "Student miscounted one dimension as 10 instead of 9 and multiplied: 9x10=90. A counting error on the grid."
    },

    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Area with Unit Squares (Square Shape)",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests area of a SQUARE (9x9) -- a special case where both dimensions are equal, which creates unique distractors: B (perimeter = 4x9 = 36) is only possible when a shape is a square. Distractor A (9+9=18) reveals students who add dimensions regardless of context. Complements existing 3.6C items with rectangular dimensions (2019#16: 12x6, 2021#7: 15x7, 2022#18: 7x8)."
  },


  // ============================================================
  // SESSION 4 PART B: 2023 STAAR Grade 3 Math -- 10 Readiness Items
  // Question stems reconstructed from rationale descriptions
  // (2023 MC question text in answer key is screenshot-only)
  // ============================================================

  // --- 2023 Item 1 | TEKS 3.3H | Same-numerator fraction comparison ---
  {
    teks: "3.3H",
    source: "STAAR",
    year: 2023,
    itemNumber: 1,
    grade: 3,
    subject: "math",

    questionStem: "Which comparison is true?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2/4 > 2/6" },
      { letter: "B", text: "2/3 = 2/4" },
      { letter: "C", text: "2/6 > 2/4" },
      { letter: "D", text: "2/3 < 2/8" }
    ],

    distractorRationales: {
      B: "Student saw both numerators are 2 and concluded the fractions are equal -- ignored the denominators entirely.",
      C: "Student correctly noticed different denominators and compared them, but concluded that larger denominator (6 > 4) means larger fraction -- reversed the relationship between denominator size and fraction value.",
      D: "Student compared 2/3 and 2/8, correctly saw different denominators, but again concluded larger denominator means larger fraction -- same misconception as C applied to a different pair."
    },

    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Fraction Comparison (Same Numerator)",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests same-NUMERATOR fraction comparison -- conceptually harder than same-denominator comparison (2022#3) because students must understand the inverse relationship between denominator size and fraction value. Distractor C specifically targets the 'bigger denominator = bigger fraction' misconception, which is the #1 fraction error at Grade 3. Complements same-denominator exemplars (2019#13, 2021#17)."
  },

  // --- 2023 Item 4 | TEKS 3.5B | Strip diagram for division ---
  {
    teks: "3.5B",
    source: "STAAR",
    year: 2023,
    itemNumber: 4,
    grade: 3,
    subject: "math",

    questionStem: "A teacher has 32 magnets to attach equally to 8 cabinets.\n\nWhich model can be used to find the number of magnets attached to each cabinet?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Strip diagram showing 32 x 8 (32 as one section, 8 as multiplier)" },
      { letter: "B", text: "Strip diagram showing 32 as the whole divided into 8 equal sections" },
      { letter: "C", text: "Strip diagram showing 8 + 32 (addition model)" },
      { letter: "D", text: "Strip diagram showing 32 -- 8 (subtraction model)" }
    ],

    distractorRationales: {
      A: "Student didn't recognize this as a division situation -- chose a multiplication model (32x8) instead of a model that divides 32 into 8 equal groups.",
      C: "Student didn't recognize equal parts as division -- chose an addition model (8+32) that combines the quantities instead of partitioning.",
      D: "Student didn't recognize equal parts as division -- chose a subtraction model (32-8) that removes one group's worth instead of dividing equally."
    },

    operation: "REPRESENT",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Strip Diagram for Division",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests model selection for DIVISION -- a critical gap since existing 3.5B exemplars focus on multiplication (2022#12 strip diagram x, 2024#26 equation, 2021#29 equation). This division model exemplar ensures the LLM can generate problems where students must recognize equal sharing as division. Each distractor represents a different incorrect operation (x, +, -)."
  },

  // --- 2023 Item 7 | TEKS 3.5A | Missing-value subtraction equation ---
  {
    teks: "3.5A",
    source: "STAAR",
    year: 2023,
    itemNumber: 7,
    grade: 3,
    subject: "math",

    questionStem: "A school cafeteria had 280 ice-cream bars. After lunch, there were 130 ice-cream bars left over.\n\nWhich equation represents a way to find the number of ice-cream bars sold during lunch?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "___ - 280 = 130" },
      { letter: "B", text: "280 + 130 = ___" },
      { letter: "C", text: "280 + ___ = 130" },
      { letter: "D", text: "280 - ___ = 130" }
    ],

    distractorRationales: {
      A: "Student reversed the equation -- put the unknown as the starting amount instead of the amount sold. Confused which value represents the whole.",
      B: "Student chose addition instead of subtraction -- figured the unknown must be the largest number so 280+130=___. Doesn't understand 'left over' implies subtraction.",
      C: "Student correctly identified 280 as the starting amount but added the unknown instead of subtracting, resulting in an equation where the total (280+___) must equal the smaller remainder (130), which is impossible."
    },

    operation: "REPRESENT",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Missing-Value Subtraction Equation",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests equation WRITING for subtraction with the unknown in the middle (280-___=130), not at the end. This is harder than finding a result because students must model 'how many were removed' as the unknown. NOTE: Source item had mixed-representation options (strip diagram and number line in B/D); adapted to equation-only format for text-based exemplar use. Complements existing 3.5A exemplars: 2019#7 (addition equation with boxes), 2021#22 (which equation set), 2022#21 (bar model representation)."
  },

  // --- 2023 Item 8 | TEKS 3.6A | 2D shape attribute identification ---
  {
    teks: "3.6A",
    source: "STAAR",
    year: 2023,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    questionStem: "A group of figures includes a rectangle, a hexagon, a pentagon, and a triangle.\n\nWhich statement is true about these figures?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "All of the figures are parallelograms." },
      { letter: "B", text: "All the figures are polygons." },
      { letter: "C", text: "All of the figures have sides of equal length." },
      { letter: "D", text: "All of the figures are prisms." }
    ],

    distractorRationales: {
      A: "Student considered only the rectangle (which is a parallelogram) and generalized to the whole group -- didn't check whether a hexagon, pentagon, or triangle are parallelograms.",
      C: "Student checked only two of the four figures (hexagon and triangle, which can have equal sides) and assumed all figures share this property -- didn't examine the rectangle and pentagon.",
      D: "Student confused prisms (3D shapes) with polygons (2D shapes) -- a fundamental dimension-category error."
    },

    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "2D Shape Attribute Analysis",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests 'which statement is true' for a GROUP of figures -- students must check EVERY figure against each claim. Distractor D (prisms vs polygons) targets 2D/3D confusion. Complements existing 3.6A exemplars: 2019#11 (3D NOT a prism), 2021#30 (classify real objects), 2022#13 (attribute table), 2022#22 (3D NOT a prism). The correct answer (all are polygons) requires understanding closed 2D figures with straight sides. This adds a pure 2D multi-figure polygon analysis."
  },

  // --- 2023 Item 9 | TEKS 3.4A | Multi-addend addition with leftover ---
  {
    teks: "3.4A",
    source: "STAAR",
    year: 2023,
    itemNumber: 9,
    grade: 3,
    subject: "math",

    questionStem: "Ms. Green had some fabric to make costumes for three school plays.\n- She used 69 yards for the first play.\n- She used 48 yards for the second play.\n- She used 53 yards for the third play.\n- She had 27 yards of fabric left over.\n\nHow many yards of fabric did Ms. Green start with?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 197,
    options: [
      { letter: "A", text: "170 yards" },
      { letter: "B", text: "197 yards" },
      { letter: "C", text: "143 yards" },
      { letter: "D", text: "177 yards" }
    ],

    distractorRationales: {
      A: "Student added the three play amounts (69+48+53=170) but forgot to add the 27 yards left over -- completed only part of the problem.",
      C: "Student added the three amounts correctly (170) but SUBTRACTED the leftover instead of adding it: 170-27=143. Misunderstood that 'left over' means it's PART of the starting total, not something to remove.",
      D: "Student added all four values correctly conceptually but made a regrouping error in the tens column: (69+48+53)+27->177 instead of 197. Arithmetic error, not conceptual."
    },

    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Multi-Addend Addition with Remainder",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests 4-addend addition (3 used amounts + leftover = starting total). The 'left over' phrasing is a STAAR trap -- distractor C catches students who subtract the remainder. This is conceptually different from 'subtract-to-find-remainder' problems. Complements existing 3.4A items: 2024#1 (single subtraction), 2024#22 (3-addend addition), 2021#3 (3-addend pure addition), 2022#17 (add-then-subtract), 2022#32 (sequential subtraction)."
  },

  // --- 2023 Item 11 | TEKS 3.8A | Dot plot reading ---
  {
    teks: "3.8A",
    source: "STAAR",
    year: 2023,
    itemNumber: 11,
    grade: 3,
    subject: "math",

    questionStem: "Miyoung generated random numbers using a computer. The dot plot shows her results.\n\nThe dot plot has dots above numbers 1 through 10:\n1->1 dot, 2->1 dot, 3->0 dots, 4->2 dots, 5->2 dots, 6->0 dots, 7->2 dots, 8->1 dot, 9->1 dot, 10->0 dots\n\nWhich list of numbers represents Miyoung's results?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1, 2, 4, 5, 7, 8, 9" },
      { letter: "B", text: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10" },
      { letter: "C", text: "1, 2, 4, 5, 7, 8, 9, 10" },
      { letter: "D", text: "1, 2, 4, 4, 5, 5, 7, 7, 8, 9" }
    ],

    distractorRationales: {
      A: "Student listed each generated number only ONCE regardless of how many dots appeared -- ignored that multiple dots mean the number appeared multiple times.",
      B: "Student listed every number on the number line (1-10) regardless of whether dots appeared above them -- confused the number line labels with the actual data.",
      C: "Student listed each generated number once and also included 10 (even though it has 0 dots) -- partially misinterpreted the dot plot and included an endpoint."
    },

    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Readiness",
    reportingCategory: 4,
    problemType: "Dot Plot to Data List",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests REVERSE dot plot reading -- converting a dot plot BACK to a data list, the opposite of 2022#6 (data list -> dot plot). Together they form a bidirectional pair. Distractor A (listing each value once) is the mirror image of 2022#6's Distractor A (one dot per unique value). The LLM needs both directions to generate complete data representation problems."
  },

  // --- 2023 Item 15 | TEKS 3.4K | Multiply-then-subtract word problem ---
  {
    teks: "3.4K",
    source: "STAAR",
    year: 2023,
    itemNumber: 15,
    grade: 3,
    subject: "math",

    questionStem: "Martin has 11 bird cages. Each cage can hold up to 7 birds. Martin already has 21 birds in his cages.\n\nWhat is the greatest number of birds Martin can add to his cages?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 56,
    options: [
      { letter: "A", text: "98" },
      { letter: "B", text: "56" },
      { letter: "C", text: "17" },
      { letter: "D", text: "39" }
    ],

    distractorRationales: {
      A: "Student correctly found total capacity (11x7=77) but ADDED 21 instead of subtracting: 77+21=98. Reversed the operation on the existing birds.",
      C: "Student subtracted instead of multiplying in step 1: (11-7)=4, then 21-4=17. Misidentified the operation entirely.",
      D: "Student added instead of multiplying: (11+7)=18, then 18+21=39. Used addition for both operations instead of multiply-then-subtract."
    },

    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Multiply-then-Subtract",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests multiply-then-SUBTRACT structure (11x7-21=56) -- a different two-step pattern than the add-then-multiply items (2019#2, 2022#30). The 'greatest number that can be added' phrasing requires understanding of capacity minus existing count. Complements existing 3.4K items which use division (2024#20) and add-then-multiply (2021#31, 2019#2, 2022#30)."
  },

  // --- 2023 Item 21 | TEKS 3.7B | Rectangle perimeter - find missing width ---
  {
    teks: "3.7B",
    source: "STAAR",
    year: 2023,
    itemNumber: 21,
    grade: 3,
    subject: "math",

    questionStem: "A rectangular garden has a perimeter of 26 feet. The length of the garden is 8 feet.\n\nWhat is the width of the garden?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 5,
    options: [
      { letter: "A", text: "5 feet" },
      { letter: "B", text: "10 feet" },
      { letter: "C", text: "8 feet" },
      { letter: "D", text: "16 feet" }
    ],

    distractorRationales: {
      B: "Student found 26-16=10 (remaining perimeter after two lengths) but didn't divide by 2 for the two equal widths -- forgot that a rectangle has TWO width sides.",
      C: "Student assumed the width equals the length (8 feet) -- doesn't understand that rectangles can have different length and width.",
      D: "Student found that 8+8=16 feet for both lengths but stopped there -- identified the sum of the known sides but didn't subtract from the perimeter."
    },

    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Perimeter - Find Missing Side",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests the INVERSE perimeter problem -- given perimeter, find missing side. This is harder than calculating perimeter from all sides (2021#9 mirror, 2024#6, 2024#18) because students must work backwards. Distractor B (forgot to divide by 2) is a classic half-step error. Complements 2022#16 (octagon perimeter/sides) with a rectangle-specific version."
  },

  // --- 2023 Item 28 | TEKS 3.2A | Place value number description ---
  {
    teks: "3.2A",
    source: "STAAR",
    year: 2023,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    questionStem: "Which answer choice describes the number 9,140?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The sum of nine thousands and fourteen ones" },
      { letter: "B", text: "The sum of nine thousands, one hundred, and forty tens" },
      { letter: "C", text: "The sum of nine thousands, one hundred, and four tens" },
      { letter: "D", text: "The sum of nine thousands, one hundred, and four ones" }
    ],

    distractorRationales: {
      A: "Student treated the digits 1 and 4 as a two-digit number (14) in the ones place instead of using place value to determine each digit's value separately.",
      B: "Student confused 40 tens (which equals 400) with 4 tens (which equals 40) -- doesn't understand that 'forty tens' is not the same as 'four tens.'",
      D: "Student confused the tens place with the ones place -- identified the digit 4 correctly but placed it in ones (4 ones = 4) instead of tens (4 tens = 40)."
    },

    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Place Value Word Form",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests standard -> word-form conversion for 3.2A, complementing 2019#4 (expanded -> standard) and 2019#27 (which does NOT describe). Three different 3.2A problem formats give the LLM format diversity. Distractor B (40 tens = 400, not 40) is the exact same misconception type as 2019#27's correct answer (40 tens makes 7,500 not 7,140) -- the LLM can see this pattern recurs."
  },

  // --- 2023 Item 30 | TEKS 3.3F | Equivalent fractions with visual models ---
  {
    teks: "3.3F",
    source: "STAAR",
    year: 2023,
    itemNumber: 30,
    grade: 3,
    subject: "math",

    questionStem: "Four models are shown.\n- Model W is divided into 8 equal parts with 2 parts shaded.\n- Model X is divided into 4 equal parts with 2 parts shaded.\n- Model Y is divided into 4 equal parts with 3 parts shaded.\n- Model Z is divided into 8 equal parts with 4 parts shaded.\n\nWhich two models are shaded to show equivalent fractions?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Model W and Model X" },
      { letter: "B", text: "Model X and Model Z" },
      { letter: "C", text: "Model W and Model Z" },
      { letter: "D", text: "Model X and Model Y" }
    ],

    distractorRationales: {
      A: "Student saw both Model W (2/8) and Model X (2/4) have 2 parts shaded and assumed same-numerator means equivalent -- compared only numerators without considering denominators.",
      C: "Student saw both Model W (2/8) and Model Z (4/8) have 8 parts total and assumed same-denominator means equivalent -- compared only denominators without considering numerators.",
      D: "Student saw both Model X (2/4) and Model Y (3/4) have 4 parts total and assumed same-denominator means equivalent -- same error as C with different models."
    },

    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Equivalent Fractions with Area Models",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests equivalent fraction identification using area models -- the fourth visual model type after strip diagrams (2022#26), number lines (2019#19), and counter arrays (2021#21). The distractor design is elegant: A tests same-numerator confusion, C/D test same-denominator confusion. The correct answer (2/4=4/8=1/2) requires understanding that equivalent means 'same proportion of the whole.'"
  },


  // ============================================================
  // SESSION 4 PART C: 2025 STAAR Grade 3 Math -- 8 Readiness Items
  // THE FINAL 8 -- Completes Batch 1 at 65 items
  // Question stems reconstructed from rationale descriptions
  // ============================================================

  // --- 2025 Item 8 | TEKS 3.5B | Two-step division equation set ---
  {
    teks: "3.5B",
    source: "STAAR",
    year: 2025,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    questionStem: "There are 12 students in a music class. Half of the students play an instrument. The students who play an instrument are divided equally among 3 instruments: guitar, piano, and violin.\n\nWhich set of equations can be used to find how many students play the guitar?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "12 x 2 = 24 and 24 x 3 = ?" },
      { letter: "B", text: "12 x 2 = 24 and 24 / 3 = ?" },
      { letter: "C", text: "12 / 2 = 6 and 6 x 3 = ?" },
      { letter: "D", text: "12 / 2 = 6 and 6 / 3 = ?" }
    ],

    distractorRationales: {
      A: "Student multiplied instead of dividing for BOTH steps: 12x2=24, then 24x3=72. Used multiplication for 'half of' and 'divided equally' -- doesn't understand either concept.",
      B: "Student multiplied instead of dividing in step 1 (12x2=24) but correctly divided in step 2 (24/3). Gets 'divided equally' right but misinterprets 'half' as doubling.",
      C: "Student correctly divided in step 1 (12/2=6) but multiplied instead of dividing in step 2 (6x3=18). Gets 'half' right but misinterprets 'divided equally among 3' as multiplying by 3."
    },

    operation: "DIVIDE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Two-Step Division Equation Set",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests TWO sequential divisions -- the most cognitively demanding 3.5B problem type. Each distractor swaps exactly one operation (/->x), creating a diagnostic matrix: A (both wrong), B (step 1 wrong), C (step 2 wrong), D (both correct). This pattern teaches the LLM to generate distractors by systematically flipping ONE operation per choice. Adds division-focused exemplar to complement multiplication-focused 3.5B items."
  },

  // --- 2025 Item 14 | TEKS 3.5A | Number line equation representation ---
  {
    teks: "3.5A",
    source: "STAAR",
    year: 2025,
    itemNumber: 14,
    grade: 3,
    subject: "math",

    questionStem: "A library had 530 books at the start of the day. Some books were borrowed and some books were returned. At the end of the day, the library had 430 books.\n\nA number line shows: starting at 530, a ray points LEFT to 280, then a ray points RIGHT from 280 to 430.\n\nWhich statement best describes the situation shown on the number line?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "250 books were returned and 150 books were borrowed: 530 + 250 - 150 = 630" },
      { letter: "B", text: "250 books were borrowed and 150 books were borrowed: 530 - 250 - 150 = 130" },
      { letter: "C", text: "250 books were returned and 150 books were returned: 530 + 250 + 150 = 930" },
      { letter: "D", text: "250 books were borrowed and 150 books were returned: 530 - 250 + 150 = 430" }
    ],

    distractorRationales: {
      A: "Student reversed the meaning of left and right rays -- interpreted the leftward ray (subtraction) as returning books and the rightward ray (addition) as borrowing.",
      B: "Student interpreted BOTH rays as borrowing (subtraction) -- didn't recognize that a rightward ray represents addition/returning.",
      C: "Student interpreted BOTH rays as returning (addition) -- didn't recognize that a leftward ray represents subtraction/borrowing."
    },

    operation: "REPRESENT",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Number Line Two-Step Representation",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests number line representation of a TWO-STEP problem (subtract then add) -- a uniquely visual 3.5A format not seen in other exemplars. Students must interpret ray DIRECTION as operation type: left=subtract, right=add. Distractors systematically test direction confusion: A (both reversed), B (both subtract), C (both add). This is the 5th 3.5A exemplar, completing the format diversity set: equation writing (2019#7, 2023#7), equation set selection (2021#22), bar model (2022#21), and now number line. NOTE: Equations (e.g., 530-250+150=430) were added to each option for scaffolding; source options contained verbal descriptions only."
  },

  // --- 2025 Item 15 | TEKS 3.3H | Same-numerator fraction comparison in context ---
  {
    teks: "3.3H",
    source: "STAAR",
    year: 2025,
    itemNumber: 15,
    grade: 3,
    subject: "math",

    questionStem: "Kayla has 6 blocks. 3 of her blocks are yellow. Doug has 8 blocks. 3 of his blocks are yellow.\n\nWhich person has the greater fraction of yellow blocks, and which comparison supports this?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Kayla, because 3/6 > 3/8" },
      { letter: "B", text: "Doug, because 3/6 > 3/8" },
      { letter: "C", text: "Kayla, because 3/6 < 3/8" },
      { letter: "D", text: "Doug, because 3/6 < 3/8" }
    ],

    distractorRationales: {
      B: "Student confused whose blocks belong to whom -- correctly compared fractions but assigned the wrong person, saying Doug has 3/8 which is greater.",
      C: "Student identified Kayla correctly but used the wrong inequality symbol -- wrote 3/6 < 3/8 instead of 3/6 > 3/8.",
      D: "Student compared only the denominators (6 < 8) and concluded 3/6 < 3/8, meaning Doug has more -- the classic 'bigger denominator = bigger fraction' error."
    },

    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Fraction Comparison in Real-World Context",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests same-numerator fraction comparison embedded in a REAL-WORLD context -- students must first BUILD the fractions (3/6 and 3/8) from a word problem before comparing. This is harder than comparing given fractions (2023#1). Distractor D is the same 'bigger denominator' misconception from 2023#1 but in context, showing the LLM this error persists across formats. Complements the full 3.3H progression: same-denominator (2022#3), unit fractions (2019#13, 2021#17), and same-numerator (2023#1)."
  },

  // --- 2025 Item 17 | TEKS 3.5E | Multiplicative relationship table (x6) ---
  {
    teks: "3.5E",
    source: "STAAR",
    year: 2025,
    itemNumber: 17,
    grade: 3,
    subject: "math",

    questionStem: "Ms. Elisha teaches dance classes. She teaches 6 classes each day she works.\n\nWhich table shows the relationship between the number of days Ms. Elisha teaches and the number of classes she teaches?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Days: 6, 18, 30 | Classes: 1, 3, 5 (reversed: classes / 6 = days)" },
      { letter: "B", text: "Days: 1, 2, 3 | Classes: 7, 8, 9 (additive: days + 6 = classes)" },
      { letter: "C", text: "Days: 1, 3, 5 | Classes: 6, 18, 30 (correct: days x 6 = classes)" },
      { letter: "D", text: "Days: 6, 18, 30 | Classes: 0, 12, 24 (subtractive: days - 6 = classes)" }
    ],

    distractorRationales: {
      A: "Student reversed the relationship -- put 6 classes per day as '6 days per class' by swapping the columns, making the rule classes/6=days instead of daysx6=classes.",
      B: "Student misinterpreted 'times 6' as 'plus 6' -- an additive relationship (1+6=7, 2+6=8, 3+6=9) instead of the correct multiplicative relationship.",
      D: "Student misinterpreted 'times 6' as 'minus 6' -- a subtractive relationship (6-6=0, 18-6=12, 30-6=24)."
    },

    operation: "PATTERN",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Readiness",
    reportingCategory: 2,
    problemType: "Multiplicative Relationship Table Identification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests TABLE IDENTIFICATION for a verbal rule ('6 classes each day') -- different from the 'find the rule from a given table' format of other 3.5E exemplars (2022#9 additive +9, 2022#27 divisive /2, 2021#13 multiplicative x11). This reversal (given rule -> find table) adds cognitive variety. Each distractor uses a different operation (/, +, -), creating a complete operation-confusion diagnostic set."
  },

  // --- 2025 Item 18 | TEKS 3.3F | Equivalent fractions with fraction strips (2/3 = 4/6) ---
  {
    teks: "3.3F",
    source: "STAAR",
    year: 2025,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    questionStem: "Which fraction strip shows a shaded area equivalent to 4/6?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Fraction strip divided into 3 parts with 2 shaded (2/3 = 4/6)" },
      { letter: "B", text: "Fraction strip divided into 6 parts with 3 shaded (3/6, not 4/6)" },
      { letter: "C", text: "Fraction strip divided into 8 parts with 4 shaded (4/8, matched numerator 4)" },
      { letter: "D", text: "Fraction strip divided into 4 parts with 4 shaded (4/4, matched numerator 4)" }
    ],

    distractorRationales: {
      B: "Student correctly identified a strip divided into 6 parts (matching denominator of 4/6) but shaded only 3 instead of 4 -- got the denominator right but the numerator wrong.",
      C: "Student also focused on shading 4 parts (matching the numerator) but used a strip with 8 divisions (4/8=1/2) -- matched the numerator in a wrong denominator context.",
      D: "Student focused on the numerator 4 and shaded 4 parts but used a strip with only 4 divisions (4/4=1 whole) -- matched the numerator without considering the denominator at all."
    },

    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Equivalent Fractions with Fraction Strips",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests fraction strip equivalence with a non-trivial relationship (2/3=4/6 requires doubling both numerator and denominator). The correct answer strip has FEWER parts than the target fraction (3 parts vs denominator 6), which is counterintuitive. Distractors B, C, D target numerator-only matching (C, D) and denominator-only matching (B). Completes the 3.3F visual model collection: strip diagrams (2022#26, this item), number lines (2019#19), counter arrays (2021#21), and area models (2023#30)."
  },

  // --- 2025 Item 20 | TEKS 3.6C | Area of rectangle on grid (9x4) ---
  {
    teks: "3.6C",
    source: "STAAR",
    year: 2025,
    itemNumber: 20,
    grade: 3,
    subject: "math",

    questionStem: "A shaded rectangle is shown on a grid. Each unit square has an area of 1 square centimeter. The rectangle is 9 squares long and 4 squares wide.\n\nWhat is the area of the shaded rectangle in square centimeters?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 36,
    options: [
      { letter: "A", text: "50 square centimeters" },
      { letter: "B", text: "26 square centimeters" },
      { letter: "C", text: "36 square centimeters" },
      { letter: "D", text: "30 square centimeters" }
    ],

    distractorRationales: {
      A: "Student counted grid LINES instead of grid SQUARES -- found 10 lines on the length and 5 on the width, then multiplied 10x5=50.",
      B: "Student calculated PERIMETER instead of area -- added all four sides: 9+9+4+4=26. Confused the two measurement concepts.",
      D: "Student counted the squares around the border of the rectangle only, not the interior -- counted the perimeter squares instead of the total area."
    },

    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Readiness",
    reportingCategory: 3,
    problemType: "Area from Grid (Rectangle)",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Adds a 5th area exemplar with a unique distractor: A (counting grid lines vs squares). This error type doesn't appear in any other 3.6C exemplar and is a common real-world mistake. Distractor B (perimeter confusion) recurs from 2021#18, confirming it's a reliable STAAR pattern. The 9x4 dimensions complement: 12x6 (2019#16), 15x7 (2021#7), 7x8 (2022#18), 9x9 (2021#18)."
  },

  // --- 2025 Item 24 | TEKS 3.2A | Non-standard place value decomposition ---
  {
    teks: "3.2A",
    source: "STAAR",
    year: 2025,
    itemNumber: 24,
    grade: 3,
    subject: "math",

    questionStem: "Evie found the sum of 70 hundreds, 1 ten, and 15 ones.\n\nWhat number represents Evie's sum?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 7025,
    options: [
      { letter: "A", text: "70,025" },
      { letter: "B", text: "7,025" },
      { letter: "C", text: "70,115" },
      { letter: "D", text: "7,015" }
    ],

    distractorRationales: {
      A: "Student confused '70 hundreds' with '70 thousands' -- multiplied 70x1,000=70,000 instead of 70x100=7,000.",
      C: "Student placed the digits in the order they were given (70, 1, 15) without converting to place values -- wrote 70115 as a concatenation.",
      D: "Student correctly found 7,000 from 70 hundreds but then absorbed the '1 ten' into the 15, thinking the 1 in 15 already represents the 1 ten -- got 7,000+15=7,015 instead of 7,000+10+15=7,025."
    },

    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Non-Standard Place Value Composition",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests NON-STANDARD decomposition (70 hundreds, not 7 thousands; 15 ones, not 1 ten 5 ones) -- the hardest 3.2A problem type. Students must convert 70 hundreds->7,000 and handle the regrouping of 15 ones->1 ten + 5 ones. Distractor D is especially subtle: 7,015 looks close to 7,025 but reveals students who don't add 1 ten separately from 15 ones. Completes a 4-item 3.2A set spanning easy (2019#4 standard form) to hard (this item)."
  },

  // --- 2025 Item 30 | TEKS 3.2D | Number between two values in inequality ---
  {
    teks: "3.2D",
    source: "STAAR",
    year: 2025,
    itemNumber: 30,
    grade: 3,
    subject: "math",

    questionStem: "Which number makes this inequality true?\n\n46,523 < _____ < 46,779",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "47,623" },
      { letter: "B", text: "46,518" },
      { letter: "C", text: "46,575" },
      { letter: "D", text: "45,250" }
    ],

    distractorRationales: {
      A: "Student only checked the left inequality (46,523 < 47,623 Y) but didn't verify the right inequality (47,623 < 46,779 X) -- checked only one boundary.",
      B: "Student compared only the ones digits (3 < 8 < 9) and concluded 46,518 fits between the bounds -- but 46,518 < 46,523, failing the left side of the inequality. Looked at ones place only instead of comparing whole numbers.",
      D: "Student misunderstood the inequality symbols and looked for a number LESS than both values -- 45,250 < 46,523, which doesn't satisfy the inequality."
    },

    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Readiness",
    reportingCategory: 1,
    problemType: "Number Between Two Values (Double Inequality)",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    whyThisIsGood: "Tests DOUBLE INEQUALITY -- students must verify a number satisfies BOTH bounds simultaneously. This is harder than single-comparison items (2022#1 'which is true', 2021#32 'NOT true') because two checks are needed. Uses 5-digit numbers with shared prefixes (46,xxx) forcing careful place-value comparison. Distractor A (checks only left bound) teaches the LLM that 'one-sided checking' is a valid distractor pattern. Completes the 3.2D set with the most complex comparison format."
  },

];

// ============================================================
// INJECTION FORMAT CONVERTER
// Strips storage-only fields, keeping only what the LLM needs.
// Called at runtime when building the system prompt.
// ============================================================
function toInjectionFormat(exemplar) {
  return {
    teks: exemplar.teks,
    questionStem: exemplar.questionStem,
    answerType: exemplar.answerType,
    options: exemplar.options,
    distractorRationales: exemplar.distractorRationales,
    correctAnswer: exemplar.correctAnswer,
    whyThisIsGood: exemplar.whyThisIsGood
  };
}

// ============================================================
// EXEMPLAR SELECTION FUNCTION
// Given an array of selected TEKS codes, returns the best
// exemplars for injection into the system prompt.
// ============================================================
function selectExemplars(selectedTeks, exemplarBank = PROBLEM_EXEMPLARS) {
  const numTeks = selectedTeks.length;

  // Budget: scale down per-TEKS count as more TEKS are selected
  // 1 TEKS -> 4-5 exemplars, 2 -> 3 each, 3 -> 2 each, 4+ -> 1-2 each
  const perTeks = Math.max(1, Math.min(5, Math.floor(10 / numTeks)));
  const maxTotal = 10;

  let selected = [];

  for (const teks of selectedTeks) {
    // Find all exemplars for this TEKS
    const pool = exemplarBank.filter(e => e.teks === teks);

    if (pool.length === 0) continue;

    // Diverse selection: pick exemplars with different operations,
    // step counts, and problem types when possible
    const picked = diverseSelect(pool, perTeks);
    selected.push(...picked);
  }

  // Cap total
  return selected.slice(0, maxTotal).map(toInjectionFormat);
}

// ============================================================
// DIVERSE SELECTION HELPER
// Picks N exemplars from a pool, maximizing diversity across
// operation, stepCount, and hasVisual dimensions.
// ============================================================
function diverseSelect(pool, n) {
  if (pool.length <= n) return [...pool];

  const selected = [];
  const used = new Set();

  // Priority 1: different operations
  const byOperation = {};
  pool.forEach((e, i) => {
    byOperation[e.operation] = byOperation[e.operation] || [];
    byOperation[e.operation].push(i);
  });

  for (const op of Object.keys(byOperation)) {
    if (selected.length >= n) break;
    const idx = byOperation[op][0];
    if (!used.has(idx)) {
      selected.push(pool[idx]);
      used.add(idx);
    }
  }

  // Priority 2: different step counts
  for (const item of pool) {
    if (selected.length >= n) break;
    const idx = pool.indexOf(item);
    if (!used.has(idx)) {
      const hasThisStepCount = selected.some(s => s.stepCount === item.stepCount);
      if (!hasThisStepCount) {
        selected.push(item);
        used.add(idx);
      }
    }
  }

  // Priority 3: fill remaining slots
  for (let i = 0; i < pool.length && selected.length < n; i++) {
    if (!used.has(i)) {
      selected.push(pool[i]);
      used.add(i);
    }
  }

  return selected;
}

// Export for use in the main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROBLEM_EXEMPLARS, toInjectionFormat, selectExemplars, diverseSelect };
}
