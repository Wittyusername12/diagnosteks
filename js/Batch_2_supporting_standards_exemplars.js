/**
 * STAAR Problem Exemplar Bank -- Grade 3 Math
 * Batch 2: Supporting Standards
 * ============================================
 * This file contains 67 curated exemplar problems extracted from
 * official TEA-released STAAR tests (2019--2025).
 *
 * SCOPE: All 30 Supporting TEKS tested across 6 years.
 *
 * PURPOSE: Provides few-shot examples for the Groq/Llama LLM
 * so it learns what high-quality, TEKS-aligned problems look like.
 * Combined with Batch 1 (Readiness, 65 items), this gives the
 * system 132 total exemplars covering 43 of 46 Grade 3 Math TEKS.
 *
 * TWO SCHEMAS:
 *   Storage Schema (this file) -- all 21 fields, used for selection
 *   Injection Schema (built at runtime) -- 7 fields sent to LLM
 *
 * EXTRACTION STATUS:
 *   Batch 1 (Readiness): COMPLETE -- 65 items, 13 TEKS
 *   Batch 2 (Supporting): COMPLETE -- 67 items, 30 TEKS
 *   Batch 3 (Missing TEKS): NOT STARTED -- 3 never-tested TEKS (3.3A, 3.9C, 3.9F)
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
 *
 * ITEM TYPE DISTRIBUTION:
 *   MultipleChoice: 57  (85%)
 *   InlineChoice:    3  ( 4%) -- adapted to MC
 *   Griddable:       2  ( 3%) -- free-response numeric
 *   DragAndDrop:     2  ( 3%) -- adapted to MC
 *   HotSpot:         2  ( 3%) -- adapted to MC
 *   Multiselect:     1  ( 1%) -- multiple correct answers
 *
 * TEKS COVERAGE (30 TEKS):
 *   1 item:  3.2C, 3.3B, 3.3D, 3.5D, 3.6D, 3.7E, 3.9E (7 TEKS)
 *   2 items: 3.3E, 3.3G, 3.4C, 3.4E, 3.4F, 3.4G, 3.7A, 3.7D, 3.9A, 3.9B, 3.9D (11 TEKS)
 *   3 items: 3.2B, 3.3C, 3.4B, 3.4D, 3.4I, 3.4J, 3.6B, 3.6E, 3.7C, 3.8B (10 TEKS)
 *   4 items: 3.4H, 3.5C (2 TEKS)
 */

const BATCH2_SUPPORTING_EXEMPLARS = [

  // ============================================================
  // 2019 STAAR -- Grade 3 Math (Supporting Standards)
  // Source: 2019staar3mathtest.pdf (questions)
  //         2019staar3mathkey.pdf (answer key)
  //         2019staar3mathrationales.pdf (rationales)
  //         2019staar3mathexptested.csv (metadata)
  // ============================================================

  {
    // --- IDENTIFICATION ---
    teks: "3.4F",
    source: "STAAR",
    year: 2019,
    itemNumber: 5,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Griddable item -- students enter a numeric answer, no MC options
    questionStem: "Serafina put a total of 42 cupcakes into packages. She put 6 cupcakes into each package. What is the total number of packages Serafina used for these cupcakes?",
    answerType: "integer",
    correctAnswer: null,
    correctAnswerValue: 7,
    options: null,

    // --- DISTRACTOR RATIONALES ---
    // Griddable items have no MC distractors
    distractorRationales: null,

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "Griddable",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Clean, single-step equal sharing/grouping problem that tests recall of basic division facts (42 / 6 = 7). Real-world packaging context makes the division interpretation natural. As a griddable item, it tests pure computational fluency without answer-choice scaffolding -- the student must produce the answer from scratch, not recognize it."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4I",
    source: "STAAR",
    year: 2019,
    itemNumber: 6,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "Which number is odd?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "205" },
      { letter: "B", text: "350" },
      { letter: "C", text: "168" },
      { letter: "D", text: "514" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Considered a number with 0 in the ones place to be odd. Needs to understand that numbers with 0 in the ones place are even (divisible by 2).",
      C: "Looked at the hundreds digit (1) instead of the ones digit (8) to determine odd/even. Needs to focus on the ones place when applying divisibility rules.",
      D: "Looked at the hundreds digit (5) and tens digit (1) instead of the ones digit (4). Needs to understand that only the ones place determines whether a number is even or odd."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Classification",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the fundamental divisibility rule that only the ones digit determines odd/even. Each distractor targets a specific misconception: confusing which digit to examine (hundreds vs ones), or misunderstanding that zero in the ones place means even. Three-digit numbers raise the complexity slightly beyond trivial single-digit odd/even checks."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6E",
    source: "STAAR",
    year: 2019,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: Two congruent squares -- one divided diagonally into 2 triangles,
    // the other divided into 2 rectangles by a horizontal line.
    questionStem: "Brandon drew two congruent squares. He divided one square into 2 congruent triangular parts (by cutting diagonally). He divided the other square into 2 congruent rectangular parts (by cutting horizontally). Which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Each triangular part and each rectangular part represents 1/2 the area of one square." },
      { letter: "B", text: "Each triangular part has an area that is greater than the area of each rectangular part." },
      { letter: "C", text: "Each triangular part and each rectangular part represents 1/4 the area of one square." },
      { letter: "D", text: "Each rectangular part has an area that is greater than the area of each triangular part." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Thought the triangular parts look bigger than the rectangular parts based on visual appearance. Needs to understand that congruent figures can be divided in different ways to represent the same fractional area.",
      C: "Understood that figures can be divided differently to represent the same fraction but confused the fraction -- thought dividing into 2 parts means each is 1/4 instead of 1/2. Needs to focus on expressing area of a part as a fraction of the whole.",
      D: "Thought the rectangular parts look bigger than the triangular parts based on visual appearance. Needs to understand that congruent figures can be divided in different ways to represent the same fractional area."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the deep conceptual understanding that equal area can look different -- dividing congruent shapes in different ways (diagonal vs horizontal) produces parts with equal area despite different shapes. Distractors B and D test visual bias (thinking one shape 'looks bigger'), while C tests fraction misunderstanding. Connects geometry (congruence) with fractions (equal parts)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7C",
    source: "STAAR",
    year: 2019,
    itemNumber: 9,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: A clock face is shown but the problem is purely about adding time intervals
    questionStem: "Felix swam, rode his bike, and ran in a race. He spent 19 minutes swimming, 21 minutes riding his bike, and 30 minutes running. What was the total amount of time Felix spent swimming, riding his bike, and running in this race?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1 hour 20 minutes" },
      { letter: "B", text: "40 minutes" },
      { letter: "C", text: "1 hour 10 minutes" },
      { letter: "D", text: "1 hour" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Added correctly to get 70 minutes but made an error converting to hours and minutes (reported 1 hour 20 minutes instead of 1 hour 10 minutes). Needs to understand conversion when solutions exceed 60 minutes.",
      B: "Only added 19 + 21 = 40 minutes and missed the 30 minutes for running. Needs to attend to all details in the problem.",
      D: "Attempted to add 19 + 21 + 30 but did not regroup properly in the ones place, getting 60 minutes, then converted to 1 hour. Needs to focus on regrouping when adding."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Word Problem",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Multi-step time addition problem requiring both arithmetic (19+21+30=70) and unit conversion (70 min = 1 hr 10 min). Real-world triathlon context. Each distractor targets a distinct error: conversion mistake, missing a value, and regrouping failure. The 70-minute answer forces the hours-and-minutes conversion that many students struggle with."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3C",
    source: "STAAR",
    year: 2019,
    itemNumber: 17,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Two circle models -- Model R divided into 5 UNEQUAL parts with 1 shaded,
    // Model T divided into 5 EQUAL parts with 1 shaded.
    questionStem: "Two circle models are shown. Model R is divided into 5 parts that are NOT all equal in size, with 1 part shaded. Model T is divided into 5 equal parts, with 1 part shaded. Which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The shaded parts of Model R and Model T are different sizes, but each model represents the same fraction of the whole." },
      { letter: "B", text: "The shaded part of Model R cannot be written as the fraction 1/5, because the parts are not all equal in size." },
      { letter: "C", text: "The shaded part of Model T is 1/4, because the parts are all equal in size." },
      { letter: "D", text: "The total number of parts in Model R is 5, so 1/5 of Model R is shaded." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Did not consider that the shaded parts must be the same size to represent the same fraction (1/5). Needs to understand that parts of a fraction model must be equal in size.",
      C: "Considered the denominator of Model T to be 4 because there are 4 unshaded parts. Needs to understand that the denominator equals the total number of parts, not just the unshaded parts.",
      D: "Did not consider that Model R's shaded part is not 1 of 5 equal-size parts. Simply counted 1 shaded out of 5 total parts and wrote 1/5. Needs to understand that fraction parts must be equal in size."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the foundational concept that fractions require EQUAL-sized parts -- the most critical conceptual prerequisite for all fraction work. Model R serves as a counterexample (5 parts but unequal, so 1/5 does not apply). Each distractor targets a different fraction misconception: ignoring equal-size requirement, confusing denominator with unshaded count, and counting parts without checking equality."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4H",
    source: "STAAR",
    year: 2019,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: 9 hoops arranged in a 3x3 grid
    questionStem: "A group of 27 students played a game with 9 hoops. An equal number of the students shared each hoop. How many students shared each hoop?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 3,
    options: [
      { letter: "A", text: "3" },
      { letter: "B", text: "18" },
      { letter: "C", text: "9" },
      { letter: "D", text: "36" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Subtracted 9 from 27 instead of dividing 27 by 9. Needs to understand which operation (division, not subtraction) applies to equal sharing problems.",
      C: "Chose the number of hoops given in the problem rather than computing the answer. Needs to focus on understanding the operations needed to solve real-world equal sharing problems.",
      D: "Added 9 to 27 instead of dividing 27 by 9. Needs to understand which operation (division, not addition) applies to equal sharing problems."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Classic equal sharing/partition problem (27 / 9 = 3). The visual of 9 hoops provides the divisor, requiring students to extract information from the image. Each distractor represents a different operation error: subtraction (27-9=18), no computation (just restating 9), and addition (27+9=36). Tests whether students can identify division as the correct operation in context."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4D",
    source: "STAAR",
    year: 2019,
    itemNumber: 20,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: One album page showing 6 photographs arranged in a grid
    questionStem: "There are 6 photographs on each page of an album. How many photographs are on 9 pages of the album?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 54,
    options: [
      { letter: "A", text: "48" },
      { letter: "B", text: "45" },
      { letter: "C", text: "15" },
      { letter: "D", text: "54" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Multiplied 6 by 8 instead of 9, likely excluding the page already shown in the image (6 x 8 = 48). Needs to attend to problem details -- the question asks about ALL 9 pages, not just the unseen ones.",
      B: "Understood multiplication was needed but confused the product of 6 x 9 (54) with 5 x 9 (45). Needs to focus on recalling multiplication facts accurately.",
      C: "Added 6 + 9 instead of multiplying 6 x 9. Needs to understand which operation (multiplication, not addition) applies when combining equally-sized groups."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Equal-groups multiplication problem (6 x 9 = 54). The image showing one page with 6 photos establishes the group size visually. Distractor A (48) is especially diagnostic -- it catches students who subtract the 'shown' page from the count, revealing a misunderstanding of the problem scope. Distractor C catches operation confusion (addition vs multiplication)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9A",
    source: "STAAR",
    year: 2019,
    itemNumber: 23,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "Ms. Patterson works for a company. Which factor would most likely affect the amount of money Ms. Patterson gets paid by the company?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The amount of money Ms. Patterson has to pay in bills" },
      { letter: "B", text: "The size of Ms. Patterson's family" },
      { letter: "C", text: "The amount of money Ms. Patterson saves every month" },
      { letter: "D", text: "The work experience Ms. Patterson has" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Understood that Ms. Patterson needs money for bills but did not realize a company would not consider personal expenses when determining pay. Needs to focus on understanding factors companies use to set wages.",
      B: "Understood that Ms. Patterson has family expenses but did not realize a company would not consider family size when determining pay. Needs to focus on understanding factors companies use to set wages.",
      C: "Understood that Ms. Patterson saves money but did not realize a company would not consider personal savings habits when determining pay. Needs to focus on understanding factors companies use to set wages."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests understanding of human capital -- specifically that work experience (a form of human capital) affects income, while personal financial choices (bills, savings, family size) do not determine employer-set wages. All three distractors are plausible-sounding personal finance concepts that students might confuse with factors that determine pay. Pure conceptual reasoning, no computation."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5C",
    source: "STAAR",
    year: 2019,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "There are 18 spoons in a drawer. This expression represents the number of forks in the same drawer: 2 x 18. Which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "There are 2 more spoons than forks in the drawer." },
      { letter: "B", text: "There are 2 more forks than spoons in the drawer." },
      { letter: "C", text: "There are 2 times as many forks as spoons in the drawer." },
      { letter: "D", text: "There are 2 times as many spoons as forks in the drawer." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused 'more than' (addition) with 'times as many' (multiplication) AND reversed which item has more. Two compounded errors: wrong operation language and wrong direction.",
      B: "Confused 'more than' (addition) with 'times as many' (multiplication). Correctly identified forks as the greater quantity but used additive language instead of multiplicative language.",
      D: "Correctly used multiplicative language ('times as many') but reversed the relationship -- said spoons are 2 times forks when the expression 2 x 18 means forks are 2 times spoons."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the critical distinction between additive comparison ('more than') and multiplicative comparison ('times as many') -- a key algebraic reasoning concept. The 2x2 distractor matrix (additive vs multiplicative language crossed with correct vs reversed direction) systematically covers every possible error combination. No computation required -- purely tests whether students can interpret a multiplication expression as a comparison."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7A",
    source: "STAAR",
    year: 2019,
    itemNumber: 29,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Four number lines from 0 to 1 mile, each divided differently with point J marked.
    // A: line divided into 3 sections, J at first mark (1/3 position)
    // B: line divided into 2 sections, J at midpoint (1/2 position) -- CORRECT
    // C: line divided into 3 sections, J near the 1-mile mark (2/3 position)
    // D: line divided into 3 sections, J at midpoint but measured from 1 instead of 0
    questionStem: "Javier rode his bike a distance of 1/2 mile from his house. On which number line does point J represent Javier's position after riding his bike?\n- A: Number line from 0 to 1 mile divided into 3 equal sections, point J at first tick mark\n- B: Number line from 0 to 1 mile divided into 2 equal sections, point J at midpoint\n- C: Number line from 0 to 1 mile divided into 3 equal sections, point J at second tick mark (near 1)\n- D: Number line from 0 to 1 mile divided into 3 equal sections, point J at midpoint (between first and second tick marks)",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Number line divided into 3 sections, J at 1/3 position" },
      { letter: "B", text: "Number line divided into 2 sections, J at 1/2 position" },
      { letter: "C", text: "Number line divided into 3 sections, J near 1 mile" },
      { letter: "D", text: "Number line divided into 3 sections, J at midpoint from right" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Placed J such that there are 2 same-size sections between J and the 1-mile mark. Counted sections from J to 1 (getting 2) rather than understanding the denominator represents TOTAL sections from 0 to 1.",
      C: "Considered only the numerator (1) and placed J one section back from the 1-mile mark. Needs to understand both numerator and denominator roles and that fractions are measured from 0 (left to right).",
      D: "Moved right to left on the number line, placing J at 1/2 measured from 1 instead of from 0. Needs to understand that fractions on a number line are measured from 0."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Number Line Representation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests fraction representation on a number line -- students must understand that 1/2 means the line is divided into 2 equal sections with the point at the end of the first section from 0. Each distractor targets a different number line misconception: counting sections from the wrong endpoint, using only the numerator, and measuring from 1 instead of 0. The visual number line format is critical for building fraction number sense."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4C",
    source: "STAAR",
    year: 2019,
    itemNumber: 31,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Image shows 1 dollar bill, 1 quarter, 1 nickel, and 2 pennies
    questionStem: "Dana used the money shown to buy a snack: 1 dollar bill, 1 quarter, 1 nickel, and 2 pennies. What amount of money did Dana use to buy the snack?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 1.32,
    options: [
      { letter: "A", text: "$1.37" },
      { letter: "B", text: "$1.32" },
      { letter: "C", text: "$1.40" },
      { letter: "D", text: "$1.27" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused the nickel for a dime, adding $0.10 instead of $0.05 ($1.00 + $0.25 + $0.10 + $0.01 + $0.01 = $1.37). Needs to distinguish between nickels and dimes.",
      C: "Confused the pennies for nickels, adding $0.05 instead of $0.01 for each ($1.00 + $0.25 + $0.05 + $0.05 + $0.05 = $1.40). Needs to distinguish between pennies and nickels.",
      D: "Omitted the nickel entirely when adding the values ($1.00 + $0.25 + $0.01 + $0.01 = $1.27). Needs to accurately account for all coins in a collection."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the ability to determine the value of a collection of bills and coins -- a practical life skill. Each distractor corresponds to a specific coin identification error: confusing nickel/dime, confusing penny/nickel, or missing a coin entirely. The image-based format (recognizing actual coins) adds an important real-world dimension beyond pure arithmetic."
  },

  // ============================================================
  // 2021 STAAR -- Grade 3 Math (Supporting Standards)
  // ============================================================
  {
    // --- IDENTIFICATION ---
    teks: "3.3C",
    source: "STAAR",
    year: 2021,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: Three circle models (pizzas). Diego's is divided into 2 UNEQUAL parts
    // with the larger part shaded. Victoria's is divided into 4 equal parts with
    // 1 part shaded. Wesley's is divided into 2 EQUAL parts with 1 part shaded.
    questionStem: "Three friends divided three pizzas into pieces. The shaded parts of the models represent the pieces that the friends ate.\n- Diego's pizza: divided into 2 unequal parts, larger part shaded\n- Victoria's pizza: divided into 4 equal parts, 1 part shaded\n- Wesley's pizza: divided into 2 equal parts, 1 part shaded\nWhich statement describes the fraction of a pizza that one of the friends ate?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Diego ate 1/2 of a pizza, because he ate the largest piece of his 2 pieces." },
      { letter: "B", text: "Victoria ate 1/3 of a pizza, because she ate 1 piece and had 3 equal-size pieces left over." },
      { letter: "C", text: "Wesley ate 1/2 of a pizza, because he ate 1 piece of his 2 equal-size pieces." },
      { letter: "D", text: "Victoria ate 3/1 of a pizza, because she ate 1 piece and had 3 pieces left over." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Did not understand that the pieces must be equal in size for 1/2 to apply. Diego's model is divided into two parts, but they are NOT equal in size, so the shaded part does not represent 1/2.",
      B: "Wrote the fraction with the number of pieces not eaten (3 unshaded) as the denominator instead of the total number of parts (4). Chose 1/3 instead of 1/4. Needs to understand that the denominator is the TOTAL number of equal parts.",
      D: "Reversed numerator and denominator -- wrote the number of unshaded parts (3) as the numerator and the number of shaded parts (1) as the denominator, getting 3/1 instead of 1/4. Needs to understand that the numerator is the designated (shaded) parts."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the unit fraction concept through three contrasting models: Diego's (unequal parts -- trap for students who only count pieces), Victoria's (equal parts but 1/4 not 1/3), and Wesley's (correct 1/2). Each distractor targets a distinct fraction misconception: ignoring equal-size requirement, confusing denominator with remaining parts, and reversing numerator/denominator. The multi-model comparison forces careful reasoning about WHAT makes a valid fraction."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4C",
    source: "STAAR",
    year: 2021,
    itemNumber: 4,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: 1 five-dollar bill, 2 one-dollar bills, 7 quarters, 3 dimes, 1 nickel
    questionStem: "Owen received the coins and bills shown when he sold lemonade: 1 five-dollar bill, 2 one-dollar bills, 7 quarters, 3 dimes, and 1 nickel. What is the value of the coins and bills Owen received?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 9.10,
    options: [
      { letter: "A", text: "$8.85" },
      { letter: "B", text: "$9.00" },
      { letter: "C", text: "$9.10" },
      { letter: "D", text: "$8.90" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Miscalculated the value of the quarters as $1.50 instead of $1.75 (likely miscounted or skipped one quarter). Needs to focus on accurately counting coin values.",
      B: "Miscounted the dimes or confused dime and nickel values -- either counted 1 dime and 3 nickels, or only 2 dimes. Either error path yields $9.00. Needs to distinguish between dime and nickel values.",
      D: "Counted one of the quarters as a nickel, getting 6 quarters ($1.50) and 2 nickels ($0.10) instead of 7 quarters ($1.75) and 1 nickel ($0.05). Needs to distinguish between quarter and nickel coins."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "More complex money problem than typical -- involves 5 different denominations and 14 total items ($5 bill, 2 $1 bills, 7 quarters, 3 dimes, 1 nickel). The large number of coins makes miscounting likely, and each distractor targets a specific counting or identification error. Tests both coin recognition and systematic counting strategies."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4B",
    source: "STAAR",
    year: 2021,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "The table shows the number of snow cones sold at a shop on each of three days.\n- Friday: 273\n- Saturday: 123\n- Sunday: 305\nWhich answer choice is the best estimate of the total number of snow cones sold on these three days?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 700,
    options: [
      { letter: "A", text: "600" },
      { letter: "B", text: "700" },
      { letter: "C", text: "900" },
      { letter: "D", text: "800" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Rounded 273 down to 200 instead of up to 300, then added 200 + 100 + 300 = 600. Needs to understand rounding rules -- when the tens digit is 7 (>= 5), round up.",
      C: "Rounded 123 up to 200 and 305 up to 400, then added 300 + 200 + 400 = 900. Applied rounding-up incorrectly to numbers whose tens digit is < 5.",
      D: "Rounded 305 up to 400 instead of down to 300, then added 300 + 100 + 400 = 800. The 0 in the tens place means round down, not up."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Estimation",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step estimation problem: round each number to the nearest hundred THEN add. Each distractor results from a specific rounding error applied to one or more numbers, making it diagnostic. Tests both rounding skills (3.4B) and addition. The three numbers are carefully chosen so that each common rounding mistake produces a different distractor value."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.8B",
    source: "STAAR",
    year: 2021,
    itemNumber: 11,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Bar graph titled "Drinks Ordered" with 4 bars.
    // Water=50, Lemonade=30, Tea=75 (on unlabeled grid line above 70), Soda=60.
    questionStem: "The bar graph shows the number of each different type of drink ordered in a restaurant one day. The y-axis shows Number Ordered (scale: 0, 10, 20, 30, 40, 50, 60, 70). The bars show:\n- Water: 50\n- Lemonade: 30\n- Tea: 75 (on the unlabeled grid line above 70)\n- Soda: 60\nWhat was the total number of drinks ordered?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 215,
    options: [
      { letter: "A", text: "205" },
      { letter: "B", text: "75" },
      { letter: "C", text: "215" },
      { letter: "D", text: "210" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Made an addition error in the tens place, getting 20 tens instead of 21 tens. Needs to focus on adding three or more two-digit numbers correctly.",
      B: "Misunderstood the question and identified only the value of the tallest bar (tea = 75) instead of finding the total. Needs to attend to question details when interpreting graphs.",
      D: "Misread the tea bar as 70 instead of 75 (the bar lands on an unlabeled grid line halfway between 70 and 80). Needs to understand how to read values on unlabeled grid lines."
    },

    // --- SELECTION METADATA ---
    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Data Reading",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step data problem: read 4 bar values THEN add them. The tea bar at 75 (on an unlabeled grid line) is the key diagnostic feature -- it separates students who can interpolate between labeled values from those who can't. Distractor B (just reporting the tallest bar) catches students who misinterpret what 'total' means. Clean, realistic context."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3G",
    source: "STAAR",
    year: 2021,
    itemNumber: 12,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: Fraction strip diagram. "1 whole" bar on top.
    // Strip A: divided into 4 equal parts, 3 parts shaded (= 3/4).
    // Strip B: divided into 8 equal parts, 6 parts shaded (= 6/8).
    // Same total area shaded in both strips.
    questionStem: "A fraction strip diagram shows two strips below a '1 whole' reference bar.\n- Strip A is divided into 4 equal parts with 3 parts shaded (representing 3/4).\n- Strip B is divided into 8 equal parts with 6 parts shaded (representing 6/8).\nThe fractions represented are --",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "equivalent, because the shaded area of Strip B is greater than the shaded area of Strip A" },
      { letter: "B", text: "not equivalent, because Strip A has 4 parts in all and Strip B has 8 parts in all" },
      { letter: "C", text: "equivalent, because the shaded area of Strip A is the same as the shaded area of Strip B" },
      { letter: "D", text: "not equivalent, because Strip A has 3 shaded parts and Strip B has 6 shaded parts" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Recognized the fractions are equivalent but gave the wrong reason -- claimed Strip B's shaded area is greater when they are actually the same. Confused 'more shaded parts' with 'more shaded area.'",
      B: "Focused only on the different denominators (4 vs 8) and concluded the fractions cannot be equivalent. Needs to understand that fractions with different denominators CAN be equivalent if they represent the same amount.",
      D: "Focused only on the different numerators (3 vs 6) and concluded the fractions cannot be equivalent. Needs to understand that different numbers of shaded parts can represent the same total area when part sizes differ."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Directly tests the definition of equivalent fractions using visual fraction strips. The key insight is that 3/4 = 6/8 because the shaded AREAS are the same, even though the number of parts and number of shaded parts differ. Each distractor represents a different incomplete understanding: recognizing equivalence but misidentifying the reason, or rejecting equivalence based on different denominators or different numerators alone."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4F",
    source: "STAAR",
    year: 2021,
    itemNumber: 14,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item but griddable -- no letter normalization needed
    questionStem: "There are 4 erasers on each table in a classroom. There are 5 tables in the classroom. What is the total number of erasers on all of the tables in this classroom?",
    answerType: "integer",
    correctAnswer: null,
    correctAnswerValue: 20,
    options: null,

    // --- DISTRACTOR RATIONALES ---
    // Griddable items have no MC distractors
    distractorRationales: null,

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "Griddable",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Clean equal-groups multiplication problem (4 x 5 = 20) testing automaticity of basic facts. Complements the 2019 griddable for the same TEKS (3.4F) which tested division (42 / 6 = 7). Together, these two items show 3.4F requires recall of BOTH multiplication and division facts. The griddable format tests pure fact recall without answer-choice scaffolding."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7D",
    source: "STAAR",
    year: 2021,
    itemNumber: 15,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "After a soccer game Isaac drank a bottle of water. Which unit of measurement can be used to measure the volume of the water in the bottle?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Fluid ounces" },
      { letter: "B", text: "Grams" },
      { letter: "C", text: "Inches" },
      { letter: "D", text: "Square centimeters" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Confused mass measurement units with liquid volume units. Grams measure mass/weight, not liquid volume. Needs to distinguish between measurement types.",
      C: "Confused length measurement units with liquid volume units. Inches measure length/distance, not liquid volume. Needs to distinguish between measurement types.",
      D: "Confused area measurement units with liquid volume units. Square centimeters measure area (2D space), not liquid volume. Needs to distinguish between measurement types."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Classification",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the ability to select appropriate measurement units for liquid volume (capacity). Each distractor represents a different measurement domain: mass (grams), length (inches), and area (square centimeters). The real-world context (water bottle) makes the correct answer intuitive for students with good measurement sense, while the distractors catch students who confuse measurement types."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4D",
    source: "STAAR",
    year: 2021,
    itemNumber: 16,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: An electrical panel with 4 outlets shown
    questionStem: "The electrical panel shown has 4 outlets. How many outlets do 6 of these electrical panels have?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 24,
    options: [
      { letter: "A", text: "28" },
      { letter: "B", text: "20" },
      { letter: "C", text: "24" },
      { letter: "D", text: "10" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Made a skip-counting error: counted 4, 8, 12, 16, 20, 24, 28 -- went one skip too many (7 skips instead of 6). Needs to track the number of groups when skip counting.",
      B: "Confused multiplication facts: computed 4 x 5 = 20 instead of 4 x 6 = 24. Needs to recall multiplication facts accurately.",
      D: "Added 4 + 6 = 10 instead of multiplying 4 x 6. Confused addition with multiplication for equal-groups problems."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Equal-groups multiplication (4 x 6 = 24) with a practical real-world context. The visual shows one panel with 4 outlets, anchoring the group size. Distractor A (28) catches skip-counting errors -- a particularly diagnostic error because it reveals students CAN multiply by skip-counting but lose track of how many groups they've counted. Clean single-step problem."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7A",
    source: "STAAR",
    year: 2021,
    itemNumber: 19,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Four number lines from 0 to 1 yard, each divided differently with point A marked.
    // A: divided into 4 sections, A at 2nd mark from 0 (at 2/4 position)
    // B: divided into 8 sections, A at 1st mark from 0 (at 1/8 position, counted tick at 0)
    // C: divided into larger segments, A at 2nd mark but with 8 tick marks AFTER A (not 8 total sections)
    // D: divided into 8 equal sections, A at 2nd mark from 0 (at 2/8 position) -- CORRECT
    questionStem: "An ant crawled 2/8 yard from an ant mound. On which number line does point A represent the ant's position after crawling 2/8 yard?\n- A: Number line 0 to 1 yard divided into 4 sections, point A at the 2nd mark\n- B: Number line 0 to 1 yard divided into 8 sections, point A at the 1st mark from 0\n- C: Number line 0 to 1 yard with point A at 2nd mark, but 8 tick marks appear AFTER point A\n- D: Number line 0 to 1 yard divided into 8 equal sections, point A at the 2nd mark from 0",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Number line with 4 sections, A at 2/4 position" },
      { letter: "B", text: "Number line with 8 sections, A at 1/8 position" },
      { letter: "C", text: "Number line with A at 2nd mark but 8 ticks after A, not 8 total sections" },
      { letter: "D", text: "Number line with 8 equal sections, A at 2/8 position" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Found a number line where A is 2 sections from 0 but disregarded the total number of sections. The number line has only 4 sections (not 8), so A is at 2/4, not 2/8. Needs to understand the denominator represents total sections from 0 to 1.",
      B: "Found a number line with 8 sections but counted tick marks starting from the tick at 0, placing A at the 1st mark instead of the 2nd section. Needs to understand how to count sections (not tick marks) on a number line.",
      C: "Found a number line where A is 2 marks from 0, but chose one with 8 tick marks AFTER point A rather than 8 total sections between 0 and 1. Needs to understand the denominator represents total sections in the whole, not remaining sections."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Number Line Representation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests fraction representation on a number line with 2/8 (a fraction with a numerator > 1). Each distractor targets a specific number-line misconception: wrong total sections (denominator error), counting tick marks vs sections (off-by-one), and confusing remaining sections with total sections. The 2/8 fraction (rather than a unit fraction) adds complexity over simpler 1/n problems."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4G",
    source: "STAAR",
    year: 2021,
    itemNumber: 25,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "A softball team played in 6 tournaments last year. The team paid $95 to play in each tournament. What was the total amount the softball team paid to play in these 6 tournaments?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 570,
    options: [
      { letter: "A", text: "$570" },
      { letter: "B", text: "$540" },
      { letter: "C", text: "$101" },
      { letter: "D", text: "$480" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Multiplied 95 x 6 but did not regroup from the ones to the tens place (5 x 6 = 30, carried 0 instead of 3). Got 540 instead of 570. Needs to focus on regrouping when multiplying.",
      C: "Added 95 + 6 = 101 instead of multiplying. Confused addition with multiplication in an equal-groups context.",
      D: "Multiplied 90 x 6 instead of 95 x 6, then also made a fact error (90 x 6 should be 540, not 480). Compound error of dropping the ones digit AND miscalculating."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests multiplying a two-digit number by a one-digit number (95 x 6 = 570) in a realistic financial context. The number 95 is strategically chosen -- the 5 in the ones place requires regrouping (5 x 6 = 30, carry 3), which is exactly what distractor B tests. Distractor C catches operation confusion. Higher complexity than single-digit multiplication."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7C",
    source: "STAAR",
    year: 2021,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: Analog clock showing 1:35 P.M.
    questionStem: "On Saturday afternoon Marcus went to a swimming pool. The clock shows the time he arrived at the pool: 1:35 P.M. He left the pool 45 minutes later. At what time did Marcus leave the pool?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2:20 P.M." },
      { letter: "B", text: "7:55 P.M." },
      { letter: "C", text: "2:15 P.M." },
      { letter: "D", text: "3:20 P.M." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Reversed the hour and minute hands, reading the clock as 7:10 instead of 1:35. Then added 45 minutes: 7:10 + 45 = 7:55. Needs to understand how to read analog clocks -- the short hand shows hours, the long hand shows minutes.",
      C: "Misread the clock as 1:30 instead of 1:35 (thought the minute hand was on the 6 instead of the 7). Then added 45: 1:30 + 45 = 2:15. Needs to read analog clocks more precisely.",
      D: "Misread the clock as 2:35 instead of 1:35 (read the hour hand as pointing to 2 instead of 1). Then added 45: 2:35 + 45 = 3:20. Needs to focus on accurately reading the hour hand on an analog clock."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Word Problem",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step elapsed time problem: read analog clock (1:35) THEN add 45 minutes (crossing the hour boundary: 1:35 + 45 = 2:20). Each distractor results from a specific clock-reading error: reversing hour/minute hands (B), misreading minute hand by one position (C), or misreading hour hand (D). The 45-minute addition crosses an hour boundary, adding complexity beyond simple within-hour additions."
  },

  // ============================================================
  // 2022 STAAR -- Grade 3 Math (Supporting Standards)
  // ============================================================
  {
    // --- IDENTIFICATION ---
    teks: "3.5C",
    source: "STAAR",
    year: 2022,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "Haruko did 9 sit-ups in P.E. class. The number of sit-ups Tom did can be represented by this expression: 2 x 9. Which statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Tom did 2 times as many sit-ups as Haruko." },
      { letter: "B", text: "Haruko did 2 times as many sit-ups as Tom." },
      { letter: "C", text: "Tom did 2 more sit-ups than Haruko." },
      { letter: "D", text: "Haruko did 2 more sit-ups than Tom." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Reversed which person did more sit-ups. Correctly used 'times as many' language but applied it to the wrong person. Needs to understand which value is greater in a multiplication expression.",
      C: "Confused 'more than' (addition) with 'times as many' (multiplication). Correctly identified Tom as having more but used additive language instead of multiplicative.",
      D: "Made two compounded errors: confused 'more than' with 'times as many' AND reversed which person did more. Needs to understand both the operation language and the direction of comparison."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the same multiplicative comparison concept as 2019 Item 28 (3.5C) but with a different context and simpler numbers (2x9 vs 2x18). The 2x2 distractor matrix systematically crosses additive-vs-multiplicative language with correct-vs-reversed direction, ensuring every error type is caught. Together with the 2019 item, these two exemplars give the LLM two patterns for this critical algebraic reasoning skill."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9A",
    source: "STAAR",
    year: 2022,
    itemNumber: 4,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "Trey is describing his labor and income. Which statement could be a description of both labor and income for Trey?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Trey does volunteer work at a hospital." },
      { letter: "B", text: "Trey pays a company to repair his roof." },
      { letter: "C", text: "Trey takes $25 out of his bank account and spends the money at a store." },
      { letter: "D", text: "Trey takes dogs for a walk after school and earns $25." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Identified labor (volunteer work) but did not recognize there is no income -- volunteer work is unpaid. Needs to understand the direct connection between labor and income.",
      B: "Described paying for goods/services, which involves spending money, not earning it through labor. Needs to understand that income comes FROM labor, not from purchasing services.",
      C: "Described withdrawing and spending money, which is a financial transaction but involves neither labor nor earned income. Needs to understand the labor-income relationship."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the fundamental labor-income relationship -- that work (labor) produces earnings (income). Each distractor isolates a different misconception: labor without income (volunteering), spending money (paying for services), and financial transactions without labor (bank withdrawal). Complements 2019 Item 23 (3.9A) which tested human capital factors in pay determination."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4E",
    source: "STAAR",
    year: 2022,
    itemNumber: 7,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Four methods for solving 7 x 11:
    // A = array model (7 columns of 11 blocks each = 77)
    // B = number line with 7 jumps of 11 from 0 to 77
    // C = skip counting: 11, 22, 33, 44, 55, 66, 77 (circled)
    // D = list: 7, 18, 29, 40, 51, 62, 73 (circled) -- adds 11 but starts at 7, wrong answer 73
    questionStem: "Gia lists some different methods she thinks she can use to solve the multiplication problem 7 x 11 = ?. Which answer choice is NOT a correct method for Gia to use?\n- A: An array of blocks showing 7 columns with 11 blocks in each column (totaling 77)\n- B: A number line from 0 to 80 with 7 jumps of 11, landing at 77\n- C: Skip counting by 11: 11, 22, 33, 44, 55, 66, 77 (77 circled)\n- D: A list: 7, 18, 29, 40, 51, 62, 73 (73 circled) -- adds 11 repeatedly but starts at 7 instead of 11",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Array model: 7 columns of 11 blocks = 77" },
      { letter: "B", text: "Number line: 7 jumps of 11 from 0 to 77" },
      { letter: "C", text: "Skip counting by 11: 11, 22, 33, 44, 55, 66, 77" },
      { letter: "D", text: "List starting at 7, adding 11: 7, 18, 29, 40, 51, 62, 73 (incorrect result)" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Did not recognize that block arrays model multiplication. Each strip = 10 units, each individual block = 1 unit. 7 columns of 11 = 77. This IS a correct method.",
      B: "Did not recognize that skip-counting jumps on a number line model multiplication. 7 jumps of 11 starting at 0 lands at 77. This IS a correct method.",
      C: "Did not recognize that skip counting by 11 seven times models 7 x 11. The sequence 11, 22, 33, 44, 55, 66, 77 correctly produces the product. This IS a correct method."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests understanding of multiple multiplication representations (arrays, number lines, skip counting) through a 'which is NOT correct' framing that requires evaluating all four methods. The incorrect method (D) has a subtle error: it adds 11 repeatedly but starts at 7 instead of 0 or 11, producing 73 instead of 77. This catches students who focus only on 'adding 11' without checking the starting point or final answer."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6B",
    source: "STAAR",
    year: 2022,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: Three quadrilaterals, each with exactly one pair of parallel sides (trapezoids).
    // One is a right trapezoid, one is an isosceles trapezoid, one is an irregular trapezoid.
    questionStem: "A group of three quadrilateral figures is shown. Each figure has exactly one pair of parallel sides. Which word best describes all the figures in the group?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Rectangle" },
      { letter: "B", text: "Rhombus" },
      { letter: "C", text: "Trapezoid" },
      { letter: "D", text: "Parallelogram" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused rectangle (all 90-degree angles, opposite sides equal) with trapezoid. Rectangles have TWO pairs of parallel sides; these figures have only ONE pair.",
      B: "Confused rhombus (all sides equal, opposite sides parallel) with trapezoid. Rhombuses have TWO pairs of parallel sides and equal side lengths; these figures have neither.",
      D: "Confused parallelogram (opposite sides parallel, opposite sides equal) with trapezoid. Parallelograms have TWO pairs of parallel sides; these figures have only ONE pair."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests quadrilateral classification by the defining attribute: number of parallel side pairs. The key insight is that trapezoids have EXACTLY one pair of parallel sides, while rectangles, rhombuses, and parallelograms all have two pairs. Showing three different-looking trapezoids reinforces that the classification depends on properties, not appearance. Each distractor is a quadrilateral type with two pairs of parallel sides."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3D",
    source: "STAAR",
    year: 2022,
    itemNumber: 10,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    // Visual: 8 theater seats in a row, 3 children sitting in 3 of them.
    questionStem: "A picture shows 8 seats in a movie theater. Children are sitting in 3 of the seats. Which expression is equivalent to the fraction of the seats that have children sitting in them?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8" },
      { letter: "B", text: "1/3 + 1/3 + 1/3" },
      { letter: "C", text: "3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8" },
      { letter: "D", text: "1/8 + 1/8 + 1/8" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Correctly identified each seat as 1/8 but counted ALL 8 seats instead of only the 3 with children. Sum = 8/8 = 1, which represents the whole, not the fraction with children.",
      B: "Used the number of children (3) as the denominator instead of the total seats (8). Each term should be 1/8, not 1/3. Confused the numerator count with the denominator.",
      C: "Recognized the fraction 3/8 but then incorrectly added it 8 times. Only one instance of 3/8 is needed. Confused the decomposition concept with repeated addition of the whole fraction."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction Decomposition",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests fraction decomposition as a sum of unit fractions (3/8 = 1/8 + 1/8 + 1/8). The visual model makes the unit fraction concept concrete -- each occupied seat IS 1/8. Each distractor targets a specific fraction decomposition error: counting all seats vs occupied ones, using wrong denominator, or over-applying the fraction. This is the only item for TEKS 3.3D in the entire bank."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4J",
    source: "STAAR",
    year: 2022,
    itemNumber: 11,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "Which number sentence can be used to find the number that goes in the box? 12 / 2 = ?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2 + 12 = 14" },
      { letter: "B", text: "6 x 2 = 12" },
      { letter: "C", text: "12 x 2 = 24" },
      { letter: "D", text: "2 + 10 = 12" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Misread the division symbol as addition and added 2 + 12 = 14. Needs to understand that multiplication is the inverse of division.",
      C: "Recognized that multiplication is the inverse of division but used the wrong related fact (12 x 2 = 24 instead of 6 x 2 = 12). The unknown should be the factor, not the dividend.",
      D: "Misread the division symbol as subtraction and used addition as its inverse (2 + 10 = 12). Needs to understand the relationship between multiplication and division."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Inverse Operations",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests understanding that multiplication and division are inverse operations. The student must recognize that 12 / 2 = ? can be solved via the related fact 6 x 2 = 12. Each distractor represents a different inverse-operation misconception: confusing the division symbol with addition, using the wrong multiplication fact, or treating it as subtraction. Pure relational thinking, no computation required."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3E",
    source: "STAAR",
    year: 2022,
    itemNumber: 15,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "Carter and Dane shared a package of 8 baseballs equally. What fraction of the package of baseballs did each person get?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2/8" },
      { letter: "B", text: "4/4" },
      { letter: "C", text: "4/1" },
      { letter: "D", text: "4/8" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Used the number of people (2) as the numerator and total baseballs (8) as the denominator, forming 2/8. Confused the number of sharers with the number each person receives.",
      B: "Correctly determined each person gets 4 baseballs but used 4 as both numerator AND denominator (4/4 = 1 whole). Did not recognize the denominator should be the total package size (8).",
      C: "Correctly determined 4 baseballs per person but placed it as 4/1 instead of 4/8. Does not understand how to form a fraction from a sharing context -- the denominator should be the total, not 1."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Word Problem",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step problem: divide 8 by 2 to get 4, THEN express 4 out of 8 as a fraction (4/8). Each distractor targets a specific fraction-from-context error: using the number of sharers as numerator, using the per-person amount as both numerator and denominator, or inverting the fraction. Tests the connection between division and fraction representation."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9B",
    source: "STAAR",
    year: 2022,
    itemNumber: 20,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "Dahlia sold pineapples at a fruit stand. The table shows the number of pineapples Dahlia had for sale each week and the number of customers she expected.\n- Week 1: 110 pineapples, 50 expected customers\n- Week 2: 150 pineapples, 150 expected customers\n- Week 3: 200 pineapples, 40 expected customers\n- Week 4: 25 pineapples, 50 expected customers\nIn which week did Dahlia most likely sell her pineapples for the highest price?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Week 1, because the number of pineapples was greater than the expected number of customers" },
      { letter: "B", text: "Week 2, because the number of pineapples was the same as the expected number of customers" },
      { letter: "C", text: "Week 3, because fewer customers were expected to come to the fruit stand this week than any other week" },
      { letter: "D", text: "Week 4, because the number of pineapples was less than the expected number of customers" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Reversed the supply-demand relationship -- thought more supply than demand means higher prices. Actually, surplus (more pineapples than customers) leads to LOWER prices.",
      B: "Thought equal supply and demand would produce the highest price. When supply equals demand, prices are moderate, not maximized. Highest prices occur when demand exceeds supply.",
      C: "Focused only on customer count (fewest customers = highest price?) without considering the supply side. Week 3 actually has the MOST pineapples with few customers -- lowest price scenario."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests basic supply and demand -- when supply is low relative to demand (25 pineapples for 50 customers), prices are highest. Each distractor represents a different economic misconception: reversing the supply-demand relationship, thinking equilibrium maximizes price, or considering only one variable. The table format requires students to compare across four scenarios."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5D",
    source: "STAAR",
    year: 2022,
    itemNumber: 23,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    questionStem: "What number goes in the box to make the equation true? Box x 7 = 98",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 14,
    options: [
      { letter: "A", text: "14" },
      { letter: "B", text: "91" },
      { letter: "C", text: "105" },
      { letter: "D", text: "13" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Subtracted 7 from 98 instead of dividing (98 - 7 = 91). Needs to understand that division is the inverse of multiplication for finding unknown factors.",
      C: "Added 98 and 7 instead of dividing (98 + 7 = 105). Needs to understand that division is the inverse of multiplication.",
      D: "Recognized that division is needed but made an error dividing 98 by 7, getting 13 instead of 14. Needs to focus on division accuracy."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Missing Factor",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests finding an unknown factor using the inverse relationship between multiplication and division (? x 7 = 98, so ? = 98 / 7 = 14). The algebraic framing (box notation) introduces equation-solving thinking. Distractor D (13) is especially diagnostic -- it shows the student understood to divide but made a computation error, which is a different issue than not understanding the operation."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4H",
    source: "STAAR",
    year: 2022,
    itemNumber: 25,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Two identical poster outlines shown side by side
    questionStem: "Greg had a package of 14 stars to put on 2 posters. He put the same number of stars on each poster, and he used all the stars in the package. How many stars did Greg put on each poster?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 7,
    options: [
      { letter: "A", text: "28" },
      { letter: "B", text: "16" },
      { letter: "C", text: "12" },
      { letter: "D", text: "7" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Multiplied 14 x 2 = 28 instead of dividing. Needs to understand which operation (division, not multiplication) applies to equal sharing problems.",
      B: "Added 14 + 2 = 16 instead of dividing. Needs to understand which operation (division, not addition) applies to equal sharing problems.",
      C: "Subtracted 14 - 2 = 12 instead of dividing. Needs to understand which operation (division, not subtraction) applies to equal sharing problems."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Classic equal sharing problem (14 / 2 = 7). Each distractor systematically represents a different wrong operation: multiplication (28), addition (16), subtraction (12). This diagnostic structure cleanly identifies WHICH operation the student confused with division. The visual of two posters makes the equal-sharing context concrete."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4I",
    source: "STAAR",
    year: 2022,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Even item: F->A, G->B, H->C, J->D
    questionStem: "Which statement about the number 27 is true?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "It is even because the digit in the tens place is even." },
      { letter: "B", text: "It is odd because the digit in the ones place is odd." },
      { letter: "C", text: "It is even because it can be divided by 9 evenly." },
      { letter: "D", text: "It is odd because it can be divided by 2 evenly." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Looked at the tens digit (2, which is even) instead of the ones digit (7). Needs to understand that only the ones place determines even/odd.",
      C: "Recognized 27 is divisible by 9 but confused 'divided evenly' with 'is even.' Divisibility by 9 does not make a number even. Needs to understand that even/odd is determined by divisibility by 2, not by other factors.",
      D: "Correctly classified 27 as odd but gave a contradictory reason -- 27 cannot be divided by 2 evenly. The statement contains a logical contradiction (odd but divisible by 2). Needs to understand the relationship between odd/even and divisibility by 2."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Classification",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests even/odd classification with sophisticated distractors that go beyond simple identification. Each option pairs a classification (even/odd) with a justification, requiring students to evaluate BOTH parts. Distractor C is especially tricky -- 27 IS divisible by 9, but that does not make it even. Distractor D has a logical contradiction. Complements 2019 Item 6 (3.4I) which tested the same concept with simpler 'which number is odd' framing."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6E",
    source: "STAAR",
    year: 2022,
    itemNumber: 29,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Odd item: A/B/C/D native
    // Visual: Four pairs of figures. Each pair shows two shapes with shading.
    // A: Two congruent circles, but one is divided into unequal parts (not valid 1/4)
    // B: Two rectangles of different sizes (not congruent), each with 1/4 shaded
    // C: Two congruent circles, but divided into 5 parts not 4
    // D: Two congruent rectangles, each divided into 4 equal parts with 1 part shaded (correct)
    questionStem: "Derrick drew two congruent figures and then shaded 1/4 of each figure. Which figures could be the ones Derrick drew and shaded?\n- A: Two congruent circles, but one circle is divided into 4 unequal parts (the shaded part is not truly 1/4)\n- B: Two rectangles that are different sizes (not congruent), each divided into 4 equal parts with 1 shaded\n- C: Two congruent circles, each divided into 5 equal parts with 1 part shaded (represents 1/5, not 1/4)\n- D: Two congruent rectangles, each divided into 4 equal parts with 1 part shaded",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Two congruent circles, one with unequal parts (not valid 1/4 shading)" },
      { letter: "B", text: "Two different-sized rectangles with 1/4 shaded (not congruent)" },
      { letter: "C", text: "Two congruent circles divided into 5 parts with 1 shaded (1/5, not 1/4)" },
      { letter: "D", text: "Two congruent rectangles, each divided into 4 equal parts with 1 shaded" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Recognized congruent shapes with 1 part shaded, but only one figure has 4 EQUAL parts. The other has unequal divisions, so its shading does not represent a valid 1/4. Needs to understand equal-part requirement for fractions.",
      B: "Recognized figures divided into 4 equal parts with 1/4 shaded, but the figures are NOT congruent (different sizes). Needs to understand that congruent means same shape AND same size.",
      C: "Recognized congruent figures with 1 part shaded, but the figures are divided into 5 parts (representing 1/5), not 4 parts (1/4). Needs to focus on the denominator matching the required fraction."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests THREE concepts simultaneously: congruence (same shape and size), equal partitioning (parts must be equal for fraction to apply), and specific fraction value (1/4 means 4 equal parts with 1 shaded). Each distractor violates exactly one of these three requirements while satisfying the other two, making it a precise diagnostic tool."
  },

  // ============================================================
  // 2023 STAAR -- Grade 3 Math (Supporting Standards)
  // ============================================================
  {
    // --- IDENTIFICATION ---
    teks: "3.4H",
    source: "STAAR",
    year: 2023,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: 26 candy pieces arranged in 3 rows (9 + 9 + 8)
    questionStem: "Lupita has 26 pieces of candy as shown. She puts two pieces of candy each into bags. How many bags does Lupita need for all of the candy?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 13,
    options: [
      { letter: "A", text: "2" },
      { letter: "B", text: "24" },
      { letter: "C", text: "3" },
      { letter: "D", text: "13" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Chose the number of pieces per bag (2) instead of computing the number of bags. Did not recognize that the 26 candies needed to be divided by 2.",
      B: "Subtracted instead of dividing (26 - 2 = 24). Needs to understand which operation (division, not subtraction) applies to equal grouping problems.",
      C: "Counted the 3 visual rows of candy in the picture and assumed each row fills one bag, ignoring the actual grouping instruction of 2 per bag."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests equal grouping division (26 / 2 = 13) with a visual array that introduces a misleading cue -- the candies appear in 3 rows, tempting students to answer 3. Distractor C catches this exact visual-misinterpretation error. Complements 2022 Item 25 (3.4H) which used equal sharing context with simpler numbers (14 / 2 = 7)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6D",
    source: "STAAR",
    year: 2023,
    itemNumber: 3,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: L-shaped figure on a grid (each square = 1 sq ft).
    // Can be decomposed as 12 + 4 = 16, or 6 + 10 = 16.
    questionStem: "The shaded figure on the grid represents the ceiling of a closet. The ceiling has two rectangular sections. Each grid square equals 1 square foot. What is the area of the ceiling in square feet?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 16,
    options: [
      { letter: "A", text: "12 square feet" },
      { letter: "B", text: "10 square feet" },
      { letter: "C", text: "20 square feet" },
      { letter: "D", text: "16 square feet" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Split the figure into two rectangles (3x4 and 2x2) but only counted the 12 squares in the larger rectangle, forgetting to add the smaller section. Needs to understand that ALL parts of a composite figure must be included.",
      B: "Split the figure into two rectangles (2x5 and 2x3) but only counted the 10 squares in one rectangle, neglecting the second section.",
      C: "Filled in the missing corner to create a complete 4x5 rectangle (20 sq ft) instead of counting only the shaded L-shaped area. Needs to distinguish between the composite figure and the bounding rectangle."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Composite Area",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests decomposing a composite figure into non-overlapping rectangles to find total area. The L-shape requires students to split and add. Distractors A and B catch the 'forgot one section' error (counting only one rectangle), while C catches 'filled in the bounding rectangle' error. This is the ONLY item for TEKS 3.6D in the entire bank."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9E",
    source: "STAAR",
    year: 2023,
    itemNumber: 5,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Multiselect: 5 options, select TWO correct.
    questionStem: "What are some benefits of saving money? Select TWO correct answers.",
    answerType: "multipleChoice",
    correctAnswer: ["C", "E"],
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "To increase debt" },
      { letter: "B", text: "To increase interest on monthly bills" },
      { letter: "C", text: "To prepare to pay for college" },
      { letter: "D", text: "To help spend money faster" },
      { letter: "E", text: "To help pay for unplanned needs" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Did not recognize that debt is money OWED -- increasing debt is a cost, not a benefit. Needs to understand that saving money reduces debt rather than increasing it.",
      B: "Confused earning interest on savings with paying interest on bills. Interest on monthly bills is a COST to the consumer, not a benefit of saving. Needs to understand the difference between earning and paying interest.",
      D: "Did not recognize that saving money means spending LESS, not more. Saving and spending are opposite financial behaviors."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Conceptual Understanding",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "Multiselect",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Only item for TEKS 3.9E in the entire bank. Tests understanding of why people save money -- for planned future expenses (college) and unplanned emergencies. Each distractor represents a specific financial literacy misconception: confusing debt with savings, confusing interest earned vs paid, and confusing saving with spending. Multiselect format (correctAnswer is array) requires understanding BOTH benefits."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7E",
    source: "STAAR",
    year: 2023,
    itemNumber: 6,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Lunch tray with juice box, fruit, eggs, sandwich
    questionStem: "Hannah gets a juice box like the one shown when she buys a lunch. Which measurement is closest to the amount of juice in a full juice box?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "2 milliliters" },
      { letter: "B", text: "200 milliliters" },
      { letter: "C", text: "2 liters" },
      { letter: "D", text: "200 liters" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Recognized milliliters as the correct unit for small volumes but chose far too small a value. 2 mL would be a tiny drop, not a juice box. Needs to understand the relative scale of metric volume units.",
      C: "Focused on the number 2 without considering unit size. 2 liters would be a large soda bottle, not a juice box. May have realized 2 mL was too small and overcorrected to liters.",
      D: "Confused liters with milliliters. 200 liters would fill a large fish tank. Needs to understand the relationship between milliliters and liters (1 liter = 1,000 milliliters)."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Estimation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests liquid volume estimation using familiar objects. Only item for TEKS 3.7E. The four options systematically vary both the number (2 vs 200) and the unit (mL vs L), creating a 2x2 matrix that diagnoses whether the student understands unit scale, numeric scale, or both. Real-world context (lunch tray) helps students reason about reasonable sizes."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4I",
    source: "STAAR",
    year: 2023,
    itemNumber: 10,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Which statement about the number 510 is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "It is odd, because it can be divided by 3 evenly." },
      { letter: "B", text: "It is odd, because the digit in the hundreds place is odd." },
      { letter: "C", text: "It is even, because it can be divided by 2 evenly." },
      { letter: "D", text: "It is even, because the digit in the tens place is even." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Recognized that 5+1+0=6 is divisible by 3 and concluded the number must be odd. Confused divisibility by 3 (digit sum rule) with even/odd classification. Even/odd is determined only by divisibility by 2.",
      B: "Looked at the hundreds digit (5, which is odd) and concluded the whole number is odd. Needs to understand that only the ONES place determines even/odd.",
      D: "Correctly identified 510 as even but gave the wrong reason -- looked at the tens digit (1, which is actually odd, not even). The statement itself contains a factual error (1 is not even). Needs to understand that only the ones place matters."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Classification",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Third exemplar for 3.4I alongside 2019 Item 6 and 2022 Item 28. Uses a 3-digit number (510) with a tricky ones digit (0), testing whether students know that 0 is even. The classification-plus-justification format requires evaluating BOTH the even/odd label AND the reasoning. Distractor D contains a factual error in its reasoning (calls the tens digit even when it is 1), testing whether students verify all parts of a claim."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3G",
    source: "STAAR",
    year: 2023,
    itemNumber: 18,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Inline Choice format (3 drop-down menus).
    // Original: Number line from 0 to 1 divided into 6 equal sections.
    // Point U at 3rd tick mark. Student selects: 3/6, 1/2,
    // "are exactly halfway between zero and 1."
    // Visual: Number line from 0 to 1 with 6 equal sections, Point U at 3rd mark.
    questionStem: "Point U is on a number line between 0 and 1. The number line is divided into 6 equal sections, and Point U is at the 3rd tick mark from 0. Which statement correctly describes Point U?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Point U represents 3/6, which is equivalent to 1/3 because both fractions have a numerator of 1 or 3." },
      { letter: "B", text: "Point U represents 3/6, which is equivalent to 1/2 because both fractions are exactly halfway between 0 and 1." },
      { letter: "C", text: "Point U represents 1/6, which is equivalent to 1/2 because the number line has 6 equal sections." },
      { letter: "D", text: "Point U represents 6/3, which is equivalent to 2 because 6 divided by 3 equals 2." }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Inline Choice format.
    // Original item had no MC distractors; these are based on documented
    // fraction equivalence misconception patterns from TEA rationales.
    distractorRationales: {
      A: "Correctly identified 3/6 but simplified incorrectly (3/6 = 1/3 instead of 1/2). May have divided only the numerator by 3 without dividing the denominator. Needs to understand that simplifying requires dividing BOTH numerator and denominator by the same number.",
      C: "Miscounted the position on the number line -- read Point U as the 1st section rather than the 3rd tick mark, getting 1/6 instead of 3/6. Then incorrectly claimed 1/6 = 1/2.",
      D: "Inverted the fraction (wrote 6/3 instead of 3/6). 6/3 = 2, which is not even on a 0-to-1 number line. Needs to understand that numerator counts parts from zero and denominator counts total equal parts."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction Equivalence",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "InlineChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Inline Choice (3 drop-down menus) to MC format. Tests fraction equivalence on a number line: identifying 3/6, simplifying to 1/2, and explaining WHY they are equivalent (both halfway between 0 and 1). Complements 2021 Item 12 (3.3G) which tested equivalence using fraction strips. Together, these two items show equivalence through different representations (number line vs area model). Distractors target simplification errors, position-reading errors, and fraction inversion."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.2B",
    source: "STAAR",
    year: 2023,
    itemNumber: 20,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Three base-ten block models.
    // Anne: 1 flat (100) + 1 rod (10) + 10 units (10) = 120
    // Kareena: 1 flat (100) + 2 units (2) = 102
    // Zane: 12 rods (120) = 120
    questionStem: "Three students made models to represent numbers using base-ten blocks. Anne's model shows 1 flat, 1 rod, and 10 units. Kareena's model shows 1 flat and 2 units. Zane's model shows 12 rods. Which models represent the same number?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Anne's model and Kareena's model, because 1 hundred, 1 ten, and 10 ones is equivalent to 1 hundred and 2 ones" },
      { letter: "B", text: "Kareena's model and Zane's model, because 1 hundred and 2 ones is equivalent to 12 tens" },
      { letter: "C", text: "Anne's model and Zane's model, because 1 hundred, 1 ten, and 10 ones is equivalent to 12 tens" },
      { letter: "D", text: "None of the models" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused 102 with 120 by miscounting Kareena's 2 units as 2 rods (20). Anne = 120, Kareena = 102 -- these are NOT equal. Needs to understand the difference between units (ones) and rods (tens).",
      B: "Same unit/rod confusion as A but in the other direction -- assumed Kareena's 2 units represented 20, making her model equal to 120. Kareena = 102, Zane = 120 -- NOT equal.",
      D: "Did not understand how to convert between different base-ten representations. All three models CAN be evaluated: Anne = 120, Kareena = 102, Zane = 120. Two DO match."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Place Value",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests base-10 place value relationships by requiring students to evaluate THREE different representations and find the matching pair. The key insight is that 10 ones = 1 ten, so Anne's 1 hundred + 1 ten + 10 ones = 1 hundred + 2 tens = 120, matching Zane's 12 tens = 120. Kareena's model (102) is the trap -- students who confuse units with rods will pair her incorrectly. Only item for TEKS 3.2B in the bank so far."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5C",
    source: "STAAR",
    year: 2023,
    itemNumber: 26,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Drag and Drop format.
    // Original: Drag tiles (Sara, Alex, 8, 3, more points than, times as many points as)
    // to complete: "[Sara] scored [3] [times as many points as] [Alex] did."
    questionStem: "Alex scored 8 points in a basketball game. The expression 8 x 3 shows the number of points Sara scored. Which statement correctly compares the number of points scored by Alex and Sara?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Sara scored 3 more points than Alex." },
      { letter: "B", text: "Alex scored 3 times as many points as Sara." },
      { letter: "C", text: "Sara scored 8 more points than Alex." },
      { letter: "D", text: "Sara scored 3 times as many points as Alex." }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Drag and Drop format.
    // Original item had no MC distractors; these are based on documented
    // multiplicative comparison misconception patterns from TEA rationales
    // for TEKS 3.5C (see 2019 Item 28, 2022 Item 2).
    distractorRationales: {
      A: "Confused multiplicative comparison ('times as many') with additive comparison ('more than'). Recognized Sara scored more but described the relationship as addition rather than multiplication.",
      B: "Reversed the comparison direction -- Alex did NOT score 3 times as many as Sara. Alex scored FEWER points (8 vs 24). Needs to understand which person is described by the larger expression.",
      C: "Used the wrong number in the additive comparison. The factor is 3, not 8. Also confused multiplicative with additive language."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Multiplicative Comparison",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "DragAndDrop",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Drag and Drop format. Third exemplar for 3.5C alongside 2019 Item 28 and 2022 Item 2. All three test multiplicative comparison but with different contexts: a 'times as many' word problem (2019), a 'times as many' expression interpretation (2022), and a direct comparison from a multiplication expression (2023). The 2x2 distractor matrix crosses additive-vs-multiplicative language with correct-vs-reversed direction, matching the pattern established in the other 3.5C exemplars."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4J",
    source: "STAAR",
    year: 2023,
    itemNumber: 27,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Ms. Morales made 28 fluid ounces of sugar water to fill the hummingbird feeders in her backyard. She put 7 fluid ounces of sugar water into each feeder. She put all the sugar water she made into the feeders. Which equation can be used to find the total number of feeders Ms. Morales filled with sugar water?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "28 - 7 = 21" },
      { letter: "B", text: "7 x 4 = 28" },
      { letter: "C", text: "28 + 4 = 32" },
      { letter: "D", text: "7 x 28 = 196" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Treated it as a subtraction problem -- subtracted 7 from 28 as if Ms. Morales only filled one feeder. Needs to understand that equal grouping requires division (or the related multiplication fact), not subtraction.",
      C: "Found the correct answer (4 feeders) but then ADDED it to 28 instead of recognizing that 7 x 4 = 28 is the related multiplication equation. Needs to focus on reading carefully and understanding what the equation should represent.",
      D: "Confused dividing 28 by 7 with multiplying 28 by 7. Used the correct operation concept (multiplication/division relationship) but applied it incorrectly, producing 196 instead of finding the quotient."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Inverse Operations",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Second exemplar for 3.4J alongside 2022 Item 11. Both test the multiplication-division inverse relationship, but with different framings: 2022 asks 'which number sentence solves 12 / 2 = ?' (abstract), while 2023 wraps it in a real-world equal grouping context (28 / 7 = ? feeders, solved via 7 x 4 = 28). Together they show the LLM both abstract and contextualized patterns for this TEKS."
  },

  // ============================================================
  // 2024 STAAR -- Grade 3 Math (Supporting Standards)
  // ============================================================
  {
    // --- IDENTIFICATION ---
    teks: "3.2B",
    source: "STAAR",
    year: 2024,
    itemNumber: 4,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "What is the relationship between the thousands place and the tens place in the number shown?\n\n583,436",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The thousands place is two times greater than the tens place." },
      { letter: "B", text: "The thousands place is ten times greater than the tens place." },
      { letter: "C", text: "The thousands place is one hundred times greater than the tens place." },
      { letter: "D", text: "The thousands place is three hundred times greater than the tens place." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Noticed that the 3 in the thousands place is two places to the left of the 3 in the tens place and chose 'two times' based on counting positions rather than understanding place-value magnitude. Needs to understand that each position represents 10 times the value, not just one more.",
      B: "Confused the hundreds place with the thousands place, thinking the difference is only one position (10x). Only accounted for one place-value step instead of two. Needs to focus on counting the number of positions between the digits.",
      D: "Correctly found that the hundreds place is 10 times the tens place and calculated 30 x 10 = 300, but then stated the relationship as '300 times greater' instead of recognizing that thousands is 100 times tens. Conflated the digit value (30) with the place-value relationship (100x)."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Place Value Relationship",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests multiplicative place-value relationships (100x) rather than simple digit identification. The number 583,436 has the digit 3 appearing in BOTH the thousands and tens places, forcing students to compare the same digit across two positions. Third exemplar for 3.2B alongside 2023#20 (base-ten blocks) and 2025#27 (Inline Choice). This item approaches place value through the abstract relationship lens rather than concrete models."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9B",
    source: "STAAR",
    year: 2024,
    itemNumber: 5,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Farmers planted more orange trees, resulting in an increase in the orange crop this year. This will affect the price of oranges.\n\nWhich statement best describes the effect on the price of oranges this year?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The price will likely increase because there are more oranges for sale." },
      { letter: "B", text: "The price will likely decrease because there are more oranges for sale." },
      { letter: "C", text: "The price will likely increase because there are fewer oranges for sale." },
      { letter: "D", text: "The price will likely decrease because there are fewer oranges for sale." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused the effects of supply and demand -- thought a greater supply would result in prices increasing instead of decreasing. Correctly identified more oranges but reversed the price effect.",
      C: "Understood that decreased supply raises costs but did not recognize that planting MORE trees means MORE oranges, not fewer. Misread the scenario while applying the correct economic rule in reverse.",
      D: "Double error: misread the scenario as fewer oranges AND reversed the supply-demand relationship. Did not recognize that more trees produce more oranges and confused how supply changes affect price."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Supply and Demand",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests supply-and-demand reasoning in a concrete agricultural context. The 2x2 distractor matrix (increase/decrease price x more/fewer oranges) systematically covers all four possible combinations, revealing exactly which concept the student misunderstands. Second exemplar for 3.9B alongside 2022#20, providing a different commodity context (oranges vs. the 2022 scenario)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.2C",
    source: "STAAR",
    year: 2024,
    itemNumber: 8,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Number line with marks at 200 and 300, a midpoint tick,
    // and a point plotted more than halfway between 200 and 300.
    questionStem: "Michel plots a point on a number line to represent a number. The point is more than halfway between 200 and 300.\n\nWhich number could Michel's point represent?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 264,
    options: [
      { letter: "A", text: "225" },
      { letter: "B", text: "208" },
      { letter: "C", text: "264" },
      { letter: "D", text: "250" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Recognized that 250 is halfway but misinterpreted 'more than halfway' to mean between 200 and 250 (the first half). Chose 225 which is less than 250, not more.",
      B: "Did not recognize that the number needed to be more than halfway between 200 and 300 -- just chose a number between 200 and 300 without checking the halfway constraint (208 < 250).",
      D: "Misinterpreted 'more than halfway' as 'exactly halfway.' Found 250 correctly as the midpoint but did not account for the word 'more' requiring a number strictly greater than 250."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Number Line",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "ONLY item for TEKS 3.2C in the entire exemplar bank -- critical for coverage. Tests number line reasoning and the distinction between 'halfway' and 'more than halfway.' Requires students to first determine the midpoint (250), then compare each option to determine which exceeds it. Distractors systematically test three distinct errors: confusing halves, ignoring the constraint, and conflating 'more than' with 'equal to.'"
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4E",
    source: "STAAR",
    year: 2024,
    itemNumber: 9,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A student solved a problem by skip counting. The student's work is shown with the answer circled.\n\n4, 8, 12, 16, 20, 24, 28, 32, 36, (40), 44\n\nWhich equation CANNOT be used to find the answer the student circled?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "10 \u00d7 10 \u00d7 10 \u00d7 10 =" },
      { letter: "B", text: "4 \u00d7 10 =" },
      { letter: "C", text: "10 \u00d7 4 =" },
      { letter: "D", text: "4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 =" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Interpreted 4 x 10 as '4 jumps of 10' and compared it to the '10 jumps of 4' shown in the skip counting, believing the two equations were different despite having equal products (both = 40). Needs to understand the commutative property.",
      C: "Did not understand that the correct answer had to be an equation that does NOT equal 40. Found that 10 x 4 = 40, which DOES equal the circled answer, so this cannot be the answer to a 'which CANNOT' question.",
      D: "Did not understand that the correct answer had to be an equation that does NOT equal 40. Used the skip counting pattern to verify that 10 groups of 4 sum to 40, which DOES match. Needs to focus on the CANNOT qualifier."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Multiplication Representations",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests understanding of multiple multiplication representations (skip counting, repeated addition, multiplication expressions) with a CANNOT qualifier that reverses the typical logic. The distractor 10 x 10 x 10 x 10 = 10,000 is far from 40, making it clearly wrong, but students must recognize that B, C, and D all equal 40. Second exemplar for 3.4E alongside 2022#15. Complements it by using skip counting rather than array context."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3C",
    source: "STAAR",
    year: 2024,
    itemNumber: 10,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Inline Choice format (2 drop-down menus).
    // Original: Byron draws a fraction model (circle divided into 7 UNEQUAL parts,
    // 1 part shaded). He claims the shaded part represents 1/7.
    // Student selects: "incorrect" and "out of 7 equal parts" from dropdowns.
    // Visual: Circle divided into 7 unequal-sized wedges, 1 shaded.
    questionStem: "Byron draws a fraction model divided into 7 parts with 1 part shaded. He claims the shaded part represents 1/7 of the whole model. However, the 7 parts in his model are NOT all the same size.\n\nWhich statement best describes Byron's claim?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Byron's claim is correct because there is 1 shaded part out of 7 total parts." },
      { letter: "B", text: "Byron's claim is incorrect because 1/7 of a model should be represented by 1 shaded part out of 7 equal parts." },
      { letter: "C", text: "Byron's claim is correct because the shaded part is one of the pieces in the model." },
      { letter: "D", text: "Byron's claim is incorrect because the model should have 1 shaded part out of 6 equal parts." }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Inline Choice format.
    // Original item had dropdown menus, not MC distractors. These are based on
    // the TEA rationale's documented equal-parts misconception.
    distractorRationales: {
      A: "Correctly counted 1 shaded out of 7 parts but did not recognize that the parts must be EQUAL in size for the fraction to be valid. This is the most common misconception -- students focus on counting parts without checking for equal sizing.",
      C: "Similar to A but with even vaguer reasoning. Accepted the fraction representation based solely on the existence of one shaded piece, completely ignoring the equal-parts requirement for fractions.",
      D: "Correctly identified that the claim is incorrect and that equal parts are needed, but made an off-by-one counting error (6 instead of 7). May have excluded the shaded part from the total count."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction Concepts",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "InlineChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Inline Choice (2 drop-down menus) to MC format. Tests the critical 'equal parts' requirement for fractions -- a foundational concept students frequently overlook. The model has 7 parts with 1 shaded BUT the parts are unequal, making Byron's 1/7 claim invalid. Third exemplar for 3.3C alongside 2019#17 (partition verification) and 2021#25 (equal share identification). This item uniquely tests the EVALUATION of someone else's claim rather than direct identification."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4D",
    source: "STAAR",
    year: 2024,
    itemNumber: 11,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: A row of 8 alternating light and dark squares (like a chessboard row).
    questionStem: "There are 8 squares on each row of a game board. One row of the game board is shown.\n\nHow many squares are on 8 rows of the game board?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 64,
    options: [
      { letter: "A", text: "56" },
      { letter: "B", text: "8" },
      { letter: "C", text: "16" },
      { letter: "D", text: "64" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Understood that 7 MORE rows would be added but found only the number of squares NOT shown in the model: 7 x 8 = 56. Subtracted the visible row instead of including it in the total.",
      B: "Counted only the squares in the single row shown (8) without multiplying by the number of rows. Did not connect the visual model to the multiplication required.",
      C: "Added the 8 squares in the model to the 8 rows of the game board: 8 + 8 = 16. Confused addition with multiplication for finding the total in equal groups."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Equal Groups",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests multiplication as equal groups (8 rows of 8 squares = 64) using a visual model showing only ONE row. Students must extend the single visible row to 8 rows via multiplication, not addition. Distractor C (8 + 8 = 16) catches the classic addition-instead-of-multiplication error. Third exemplar for 3.4D alongside 2019#21 (stickers in album) and 2021#7 (tile rows)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6B",
    source: "STAAR",
    year: 2024,
    itemNumber: 12,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: A tangram-style puzzle showing 7 pieces inside a square frame.
    // The pieces include: 1 small square, 1 parallelogram, and 5 triangles
    // of various sizes. Lines show how the pieces divide the square.
    questionStem: "Seven pieces of a puzzle are shown. The puzzle is made up of triangles, a square, and a parallelogram.\n\nWhich answer choice best describes the two quadrilaterals that are pieces of the puzzle?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Square and parallelogram" },
      { letter: "B", text: "Parallelogram and triangle" },
      { letter: "C", text: "Square and trapezoid" },
      { letter: "D", text: "Triangle and rhombus" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Found the two types of figures in the puzzle (parallelograms and triangles) but included triangle, which has only 3 sides and is NOT a quadrilateral. Needs to understand that quadrilateral means exactly 4 sides.",
      C: "Correctly identified the square as a quadrilateral but confused the parallelogram with a trapezoid. Both have 4 sides, but the puzzle piece is a parallelogram (opposite sides parallel), not a trapezoid. Needs to distinguish between types of quadrilaterals.",
      D: "Misidentified the parallelogram as a rhombus AND included triangle (not a quadrilateral). The parallelogram does not have all four sides equal, so it is not a rhombus. Also shows confusion about what 'quadrilateral' means."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Shape Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests two skills simultaneously: identifying quadrilaterals AND classifying specific quadrilateral types within a composite figure. The tangram context requires students to decompose a complex visual into individual shapes. Third exemplar for 3.6B alongside 2022#23 (trapezoid classification) and 2025#7 (Hot Spot). Each tests classification from a different angle."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.8B",
    source: "STAAR",
    year: 2024,
    itemNumber: 14,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Dot plot titled "Days Running" with x-axis "Number of Miles" (0-10).
    // Dots at: 0 (one dot), 2 (two dots), 5 (one dot), 8 (one dot).
    // Represents 5 days of running; the 6th day's dot is missing.
    questionStem: "The dot plot shows the numbers of miles Joseph ran on five days. Joseph ran on one more day, but the dot is missing from the dot plot.\n\nDays Running (dot plot):\n- 0 miles: 1 dot\n- 2 miles: 2 dots\n- 5 miles: 1 dot\n- 8 miles: 1 dot\n\nJoseph ran a total of 25 miles during the six days. How many miles did Joseph run on the sixth day?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 8,
    options: [
      { letter: "A", text: "6" },
      { letter: "B", text: "8" },
      { letter: "C", text: "17" },
      { letter: "D", text: "10" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Interpreted 'the sixth day' literally -- assumed Joseph ran 6 miles because it was the sixth day. Did not use the dot plot data or the 25-mile total at all.",
      C: "Correctly added the dots on the plot (0 + 2 + 2 + 5 + 8 = 17) but stopped there, reporting the sum of the five visible days instead of subtracting from 25. Found the intermediate value but not the answer.",
      D: "Counted each number on the dot plot only ONCE: 0 + 2 + 5 + 8 = 15 (ignoring the second dot at 2 miles). Then subtracted: 25 - 15 = 10. Needs to understand that each dot represents one day, not one value."
    },

    // --- SELECTION METADATA ---
    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Dot Plot",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step problem requiring BOTH dot-plot reading AND arithmetic (sum then subtract). The missing-dot framing is clever -- instead of just reading a graph, students must reason about what data is absent. Third exemplar for 3.8B alongside 2021#22 (bar graph reading) and 2022#31 (frequency table). Distractor D catches the subtle error of conflating dot count with value count."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6E",
    source: "STAAR",
    year: 2024,
    itemNumber: 16,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Four answer options, each showing a pair of figures:
    // A: Two circles of DIFFERENT sizes, each with 1/4 shaded
    // B: A square and a pentagon(?) with different partitions
    // C: Two same-sized squares -- one divided into 4 equal squares
    //    (1/4 shaded), one divided into 4 equal triangles (1/4 shaded)
    // D: Two same-sized triangles with different fractions shaded (3/4 vs 1/4)
    questionStem: "Calvin draws two congruent figures. He shades an equal area of each figure.\n\nWhich figures could be Calvin's?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Two circles that are different sizes, each with 1/4 of the area shaded" },
      { letter: "B", text: "Two different shapes (a square and a partial shape) with equal shading but different forms" },
      { letter: "C", text: "Two same-sized squares, one divided into 4 equal smaller squares with 1 shaded, and one divided into 4 equal triangles with 1 shaded" },
      { letter: "D", text: "Two same-sized triangles with different amounts shaded (3/4 shaded in one and 1/4 shaded in the other)" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Saw that both shapes are circles and each has 1/4 shaded, but did not account for the circles being DIFFERENT sizes. Different-sized figures are not congruent, even if the same fraction is shaded. Needs to understand that congruent figures must have the same area.",
      B: "Saw that the second shape could match the first and that an equal-sized part was shaded on each, but the shapes are fundamentally DIFFERENT. Congruent figures must be the same shape AND same size.",
      D: "Saw that the shapes are the same type (triangles) and the same size, satisfying the congruence requirement, but did not notice that the shaded areas are DIFFERENT (3/4 vs 1/4). Needs to attend to the 'equal area shaded' requirement."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Congruence and Partitioning",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests TWO conditions simultaneously: congruent figures AND equal shaded area. Each distractor violates exactly one condition: A violates congruence (different sizes), B violates congruence (different shapes), D violates equal shading (3/4 vs 1/4). Only C satisfies both. Third exemplar for 3.6E alongside 2019#8 (line of symmetry) and 2022#29 (congruence identification). This item adds the partitioning dimension."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4B",
    source: "STAAR",
    year: 2024,
    itemNumber: 17,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Eliza rode her bike on three days last week.\n\n- On Tuesday, she rode 12 miles.\n- On Thursday, she rode 9 miles.\n- On Saturday, she rode 7 miles.\n\nShe rounds each number to the nearest ten to find the estimate of the total number of miles she rode. What is Eliza's estimate?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 30,
    options: [
      { letter: "A", text: "10 mi" },
      { letter: "B", text: "30 mi" },
      { letter: "C", text: "40 mi" },
      { letter: "D", text: "20 mi" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Realized that 12, 9, and 7 all round to 10 but only reported one value of 10 instead of adding the three rounded values (10 + 10 + 10). Stopped after rounding without completing the addition step.",
      C: "Rounded 7 and 9 correctly to 10 each but incorrectly rounded 12 UP to 20 instead of DOWN to 10. Since 12 ends in 2 (less than 5), it should round down. Calculated 10 + 10 + 20 = 40.",
      D: "Did not round first -- added the original values (12 + 9 + 7 = 28) and then incorrectly rounded 28 down to 20. The problem asks to round EACH number first, then add, not to add first and round the total."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Estimation",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step estimation problem: round three numbers to the nearest ten THEN add the rounded values. Cleverly, all three numbers (12, 9, 7) round to 10, making the correct answer simply 10 + 10 + 10 = 30. Distractors test three distinct errors: skipping the addition step (A), rounding 12 up instead of down (C), and rounding the sum instead of the addends (D). Second exemplar for 3.4B alongside 2021#31 (rounding to nearest hundred)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9D",
    source: "STAAR",
    year: 2024,
    itemNumber: 24,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Which statement is an example of using credit?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Dante saves $100 per paycheck." },
      { letter: "B", text: "Baylee budgets $85 for groceries each week." },
      { letter: "C", text: "Maria borrows $400 for car repairs." },
      { letter: "D", text: "Nina earns $250 in tips at work." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused using credit with building savings. Saving money per paycheck is a financial behavior but is the opposite of borrowing. Needs to understand that credit specifically involves borrowing money from a lender.",
      B: "Confused using credit with responsible spending (budgeting). Setting aside money for groceries is planning, not borrowing. Needs to understand that credit means obtaining goods or money now with a promise to pay later.",
      D: "Confused using credit with earning income. Earning tips at work is income generation, not borrowing. Needs to focus on the distinction between earning, saving, budgeting, and borrowing."
    },

    // --- SELECTION METADATA ---
    operation: "FINANCIAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Financial Literacy",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests understanding of credit as a specific financial concept (borrowing money) versus other financial behaviors (saving, budgeting, earning). Each distractor represents a different financial concept that students commonly confuse with credit. First of 2 items for 3.9D (the other is 2025#22). Clean text-only item with no computation required -- purely conceptual financial literacy."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4G",
    source: "STAAR",
    year: 2024,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A teacher bought 8 boxes of pencils. Each box contained 48 pencils.\n\nHow many pencils did the teacher buy?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: 384,
    options: [
      { letter: "A", text: "376" },
      { letter: "B", text: "384" },
      { letter: "C", text: "366" },
      { letter: "D", text: "324" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Multiplied 48 x 8 correctly to get 384 but then subtracted 8 from the product: 384 - 8 = 376. Applied an unnecessary extra operation, possibly confusing the 8 boxes with something to subtract.",
      C: "Made regrouping errors in the standard algorithm: multiplied 8 x 8 = 64 but placed the 6 in the ones place and regrouped the 4 (should be reversed: 4 in ones, regroup 6). Then 40 x 8 = 320 + 40 (wrong regroup) = 360, yielding 366.",
      D: "Multiplied 8 x 8 = 64 correctly and placed 4 in ones, but did NOT carry the 6 to the tens column. Then 4 x 8 = 32 for the upper digits, yielding 324. Classic failure to regroup during multi-digit multiplication."
    },

    // --- SELECTION METADATA ---
    operation: "MULTIPLY",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Word Problem",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests multi-digit multiplication (48 x 8) with regrouping, a key 3.4G skill. All three distractors represent specific, documented regrouping errors in the standard algorithm -- making this item a diagnostic goldmine. Each wrong answer pinpoints exactly WHERE in the algorithm the student failed. Second exemplar for 3.4G alongside 2022#28 (missing factor). Together they test both forward multiplication and inverse reasoning."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7D",
    source: "STAAR",
    year: 2024,
    itemNumber: 29,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Guadalupe has a bottle of juice.\n\nWhich unit of measurement could be used to measure the volume of juice in the bottle?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Pounds" },
      { letter: "B", text: "Feet" },
      { letter: "C", text: "Centimeters" },
      { letter: "D", text: "Liters" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused volume with weight. Pounds measure weight/mass, not liquid volume. May associate 'measuring a bottle' with weighing it.",
      B: "Confused volume with length. Feet measure linear distance, not liquid capacity. Needs to differentiate between measuring types (length, weight, volume).",
      C: "Confused volume with length. Centimeters measure linear dimensions, not liquid capacity. This is a metric length unit, not a volume unit."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Measurement Units",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the fundamental skill of selecting appropriate measurement units for liquid volume. Each distractor is a real measurement unit for a DIFFERENT attribute (weight, length), requiring students to distinguish between measurement types. The 'bottle of juice' context makes volume concrete and relatable. Second exemplar for 3.7D alongside 2021#6 (which likely tested a different measurement attribute). Together they cover different dimensions of measurement unit selection."
  },

  // ============================================================
  // 2025 STAAR -- Grade 3 Math (Supporting Standards)
  // ============================================================
  {
    // --- IDENTIFICATION ---
    teks: "3.4J",
    source: "STAAR",
    year: 2025,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A store has 45 toy cars in 5 different colors. There are the same number of cars in each color.\n\nWhich equation could be used to find the number of cars in each of the 5 colors?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "5 \u00d7 9 = 45" },
      { letter: "B", text: "5 \u00d7 45 = 225" },
      { letter: "C", text: "45 \u2212 5 = 40" },
      { letter: "D", text: "45 + 5 = 50" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      B: "Treated the problem as straight multiplication of the two given numbers (5 x 45 = 225) instead of recognizing it as a division situation. Needs to understand that finding 'how many in each group' requires dividing the total by the number of groups.",
      C: "Chose subtraction (45 - 5 = 40) instead of division. Did not recognize that equal distribution of 45 items into 5 groups requires division, not subtraction.",
      D: "Chose addition (45 + 5 = 50) instead of division. Did not recognize that equal distribution requires division, not combining the total with the number of groups."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Inverse Operations",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests the multiplication-division inverse relationship: given 45 total and 5 groups, find the missing factor (5 x ? = 45 means 45 / 5 = 9). Each distractor represents a different wrong operation (multiplication, subtraction, addition), making this item diagnostic for which operation students default to. Third exemplar for 3.4J alongside 2022#11 (12 / 2 via 6 x 2) and 2023#27 (28 / 7 via 7 x 4). This item uses a larger quotient (9) in a real-world context."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3B",
    source: "STAAR",
    year: 2025,
    itemNumber: 3,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Number line from 0 to 1, divided into 6 equal parts.
    // Point plotted at the 5th tick mark.
    questionStem: "A number line is shown. The number line goes from 0 to 1 and is divided into 6 equal parts. A point is plotted on the 5th tick mark from 0.\n\nWhich fraction does the point represent?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/5" },
      { letter: "B", text: "1/6" },
      { letter: "C", text: "5/5" },
      { letter: "D", text: "5/6" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Counted the tick marks between 0 and the point (5) and used that as the denominator, getting 1/5. Confused the numerator position count with the denominator (total parts). Needs to understand that the denominator comes from the total number of equal parts on the number line.",
      B: "Correctly identified 6 equal parts (denominator = 6) but used 1 as the numerator instead of counting to the 5th tick mark. May have read each section as representing 1/6 without determining which specific fraction the point represents.",
      C: "Counted tick marks to the point as both numerator AND denominator, getting 5/5. Did not recognize that the denominator should be 6 (the total number of equal sections), not 5."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction on Number Line",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "ONLY item for TEKS 3.3B in the entire exemplar bank -- critical for coverage. Tests fraction identification on a number line, which requires understanding both numerator (position count) and denominator (total equal parts). The 5/6 answer is close to 1, testing whether students can distinguish near-whole fractions. Each distractor targets a specific misconception about how numerators and denominators relate to number line divisions."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.6B",
    source: "STAAR",
    year: 2025,
    itemNumber: 7,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Hot Spot format (student clicks on 2 of 5 figures).
    // Original: Shows 5 figures -- a chevron/arrow (not quad), a parallelogram (quad),
    // a square (quad), a circle (not quad), a pentagon (not quad).
    // Student clicks on the square and parallelogram.
    // Visual: Five figures displayed (arrow, parallelogram, square, circle, pentagon).
    questionStem: "Five figures are shown: a chevron (arrow shape), a parallelogram, a square, a circle, and a pentagon.\n\nWhich pair of figures are both quadrilaterals?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Pentagon and parallelogram" },
      { letter: "B", text: "Square and parallelogram" },
      { letter: "C", text: "Chevron and square" },
      { letter: "D", text: "Circle and pentagon" }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Hot Spot format.
    // Original item had no MC options; these are based on the TEA rationale's
    // documented understanding that quadrilateral = exactly 4 sides.
    distractorRationales: {
      A: "Correctly identified the parallelogram as a quadrilateral but included the pentagon, which has 5 sides (not 4). Needs to understand that a quadrilateral must have EXACTLY 4 sides.",
      C: "Correctly identified the square as a quadrilateral but included the chevron (arrow shape), which has more than 4 sides. The chevron's pointed shape may look like it has 4 sides but actually has 5 or more.",
      D: "Chose a circle (0 straight sides) and pentagon (5 sides). Neither is a quadrilateral. May not understand what 'quadrilateral' means."
    },

    // --- SELECTION METADATA ---
    operation: "CLASSIFY",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Shape Classification",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "HotSpot",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Hot Spot (click 2 of 5 figures) to MC format. Tests the fundamental definition of quadrilateral (exactly 4 sides) across a diverse set of figures including non-polygons (circle) and polygons with different side counts (pentagon, chevron). Third exemplar for 3.6B alongside 2022#23 (trapezoid classification) and 2024#12 (tangram puzzle). This item focuses on pure identification rather than classification within the quadrilateral family."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.3E",
    source: "STAAR",
    year: 2025,
    itemNumber: 19,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: A rectangle (wall) divided into 8 equal parts (4 columns x 2 rows).
    questionStem: "A school chooses 4 students to paint an entire wall. The model shown represents the wall divided into equal parts. The wall is divided into 8 equal parts.\n\nEach student will paint the same amount of the wall. What fraction of the wall will each student paint?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "1/8" },
      { letter: "B", text: "4/8" },
      { letter: "C", text: "12/8" },
      { letter: "D", text: "2/8" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Correctly identified the wall as divided into 8 equal parts (denominator = 8) but used 1 as the numerator instead of dividing 8 parts among 4 students (8 / 4 = 2). Chose the fraction representing ONE part rather than each student's share of 2 parts.",
      B: "Used the number of students (4) as the numerator with 8 as the denominator, getting 4/8. Did not understand that 8 parts divided among 4 students means each gets 2 parts, not 4.",
      C: "Added the number of students to the number of parts (4 + 8 = 12) and used that as the numerator, getting 12/8. An improper fraction greater than 1 makes no sense when dividing a single wall among students."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction Partitioning",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Combines fraction concepts with equal-sharing division: 8 equal parts shared among 4 students requires 8 / 4 = 2, so each student paints 2/8. The visual model grounds the abstract fraction in a concrete area model. Second exemplar for 3.3E alongside 2022#15. Both involve partitioning into fractions, but this item adds the division-among-people layer that makes it more complex. Distractor C (12/8) catches an especially revealing error -- students who add instead of divide."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9D",
    source: "STAAR",
    year: 2025,
    itemNumber: 22,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "Which statement is an example of using credit?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Paying sales tax at a restaurant" },
      { letter: "B", text: "Saving part of your income in a bank" },
      { letter: "C", text: "Using cash to pay for a book" },
      { letter: "D", text: "Getting a loan to pay for a car" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Confused using credit with paying sales tax. Sales tax is a government charge on purchases, not a form of borrowing money. Needs to understand that credit specifically involves borrowing.",
      B: "Confused using credit with building savings. Saving income in a bank is the opposite of borrowing -- it's setting money aside. Needs to distinguish between saving and using credit.",
      C: "Confused using credit with direct purchasing. Using cash to pay for a book is spending money you already have, not borrowing. Credit means obtaining goods or money now with a promise to pay later."
    },

    // --- SELECTION METADATA ---
    operation: "FINANCIAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Financial Literacy",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Second credit-identification item alongside 2024#24 (Maria borrows $400). Together they form a strong pair: this item uses 'getting a loan' while 2024 uses 'borrowing' -- both are credit but framed differently. Distractors cover sales tax (government), saving (opposite of credit), and cash purchase (direct spending) -- four distinct financial concepts students must differentiate."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.5C",
    source: "STAAR",
    year: 2025,
    itemNumber: 23,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    questionStem: "A restaurant sells 38 pizzas on Wednesday. The expression 38 \u00d7 2 can be used to find the number of pizzas the restaurant sells on Saturday.\n\nWhich statement is true?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "There are 38 times as many pizzas sold on Wednesday as on Saturday." },
      { letter: "B", text: "There are 2 times as many pizzas sold on Wednesday as on Saturday." },
      { letter: "C", text: "There are 2 times as many pizzas sold on Saturday as on Wednesday." },
      { letter: "D", text: "There are 38 times as many pizzas sold on Saturday as on Wednesday." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Identified 38 as the multiplier and incorrectly applied it as the comparison factor, AND reversed the direction (Wednesday vs Saturday). Double error: wrong factor and wrong direction.",
      B: "Correctly identified 2 as the comparison factor but reversed the direction -- said Wednesday has 2 times as many as Saturday, when actually Saturday has 2 times as many as Wednesday. The expression 38 x 2 finds Saturday's count.",
      D: "Identified 38 as the multiplier and used it as the comparison factor. While the direction is correct (Saturday vs Wednesday), 38 is the base amount, not the multiplier. The '2' in 38 x 2 is the comparison factor."
    },

    // --- SELECTION METADATA ---
    operation: "COMPARE",
    strand: "Algebraic Reasoning",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Multiplicative Comparison",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests interpretation of a multiplication expression as a comparison statement. The 2x2 distractor matrix (factor 2 vs 38 crossed with direction Wed-vs-Sat vs Sat-vs-Wed) systematically covers all four possible misinterpretations. Fourth exemplar for 3.5C alongside 2019#27, 2021#19, and 2023#26. While previous items used smaller numbers or concrete models, this uses the expression-to-statement translation format."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4H",
    source: "STAAR",
    year: 2025,
    itemNumber: 25,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Hot Spot format (student clicks any 8 of 24 marbles).
    // Original: 24 marbles shown in rows, student selects 8 to show one group.
    // Visual: 24 marbles arranged in 4 rows of 6.
    questionStem: "Barry has 24 marbles. He separates them into 3 groups of equal size.\n\nHow many marbles are in one group?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: 8,
    options: [
      { letter: "A", text: "3" },
      { letter: "B", text: "6" },
      { letter: "C", text: "8" },
      { letter: "D", text: "21" }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Hot Spot format.
    // Original item had no MC options; these target documented equal-grouping
    // misconceptions from TEA rationale patterns.
    distractorRationales: {
      A: "Chose the number of groups (3) as the answer instead of the number of marbles per group. Confused the divisor with the quotient.",
      B: "May have counted the marbles per row in the visual (6 per row) instead of computing 24 / 3 = 8. Relied on the visual arrangement rather than the mathematical operation.",
      D: "Subtracted instead of dividing: 24 - 3 = 21. Used the wrong operation for an equal-grouping problem."
    },

    // --- SELECTION METADATA ---
    operation: "DIVIDE",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Equal Groups",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "HotSpot",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Hot Spot (select any 8 marbles from 24) to MC format. Tests basic equal-grouping division (24 / 3 = 8). The original Hot Spot format required students to physically demonstrate one group, which is a richer assessment. The adapted MC version still captures the core division skill. Fourth exemplar for 3.4H alongside 2019#26, 2022#25, and 2023#2. Together they show division in various contexts: candy sharing, equal grouping, and concrete marble separation."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.7C",
    source: "STAAR",
    year: 2025,
    itemNumber: 26,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Analog clock showing 7:13 (hour hand between 7 and 8,
    // minute hand at approximately the 13-minute mark).
    questionStem: "Gemma reads a book for 1 hour and 20 minutes. She finishes reading at 7:13 p.m. as shown on the clock.\n\nWhat time did Gemma start reading her book?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "6:13 p.m." },
      { letter: "B", text: "5:53 p.m." },
      { letter: "C", text: "8:33 p.m." },
      { letter: "D", text: "6:53 p.m." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Subtracted only the 1 hour from 7:13 p.m. (getting 6:13 p.m.) but did not subtract the additional 20 minutes. Incomplete subtraction -- needs to apply the full elapsed time.",
      C: "Added 1 hour and 20 minutes to 7:13 p.m. instead of subtracting. To find a START time from an END time and elapsed duration, you subtract, not add. 7:13 + 1:20 = 8:33.",
      D: "Subtracted 1 hour and 20 minutes from 7:13 p.m. but made an error crossing the hour boundary. Subtracted 1 hour to get 6:13, then subtracted 20 minutes but did not carry across the hour: reported 6:53 instead of 5:53. Needs to understand that 6:13 - 0:20 requires borrowing from the 6."
    },

    // --- SELECTION METADATA ---
    operation: "MEASURE",
    strand: "Geometry and Measurement",
    readinessOrSupporting: "Supporting",
    reportingCategory: 3,
    problemType: "Elapsed Time",
    stepCount: 2,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Two-step elapsed time problem requiring subtraction across an hour boundary. 7:13 - 1:20 requires borrowing from the hour (6:13 - 0:20 = 5:53), which is the highest-difficulty time subtraction pattern. Distractor D specifically catches the borrowing error. Third exemplar for 3.7C alongside 2019#9 (time addition) and 2021#8 (time-to-analog-clock). This item is the only one testing time SUBTRACTION with borrowing."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.2B",
    source: "STAAR",
    year: 2025,
    itemNumber: 27,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Inline Choice format (2 drop-down menus).
    // Original: Number 858,386. Two sentences with dropdown blanks:
    // "The value of the 8 in the hundred thousands place is [100] times greater
    // than the value of the 8 in the thousands place."
    // "The value of the 8 in the hundred thousands place is [10,000] times greater
    // than the value of the 8 in the tens place."
    questionStem: "A number is shown.\n\n858,386\n\nThe digit 8 appears in three places: the hundred thousands place, the thousands place, and the tens place.\n\nWhich statement correctly describes the relationships between these 8s?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "The 8 in the hundred thousands place is 10 times greater than the 8 in the thousands place and 100 times greater than the 8 in the tens place." },
      { letter: "B", text: "The 8 in the hundred thousands place is 1,000 times greater than the 8 in the thousands place and 100,000 times greater than the 8 in the tens place." },
      { letter: "C", text: "The 8 in the hundred thousands place is 100 times greater than the 8 in the thousands place and 10,000 times greater than the 8 in the tens place." },
      { letter: "D", text: "The 8 in the hundred thousands place is 100 times greater than the 8 in the thousands place and 1,000 times greater than the 8 in the tens place." }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Inline Choice format.
    // Original item had dropdown menus selecting multipliers.
    // These distractors target documented place-value multiplier errors.
    distractorRationales: {
      A: "Used 10x for the hundred-thousands-to-thousands relationship (should be 100x -- they are 2 places apart, so 10 x 10 = 100). Then used 100x for the hundred-thousands-to-tens relationship (should be 10,000x -- they are 4 places apart). Undercounted the number of positions in both cases.",
      B: "Overcounted: used 1,000x for the hundred-thousands-to-thousands relationship (only 2 places apart, should be 100x) and 100,000x for the hundred-thousands-to-tens (4 places apart, should be 10,000x). Overcounted the number of positions in both cases.",
      D: "Got the first relationship correct (100x for hundred-thousands to thousands) but used 1,000x for hundred-thousands to tens (should be 10,000x -- 4 places apart means 10^4). Correctly counted 2 positions but miscounted 4 as 3."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Place Value Relationship",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "InlineChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Inline Choice (2 drop-down menus) to MC format. Tests multiplicative place-value relationships across MULTIPLE position gaps in a single number. The digit 8 appears in THREE places (hundred thousands, thousands, tens), requiring students to compute two different multipliers: 100x (2 places) and 10,000x (4 places). Third exemplar for 3.2B alongside 2023#20 (base-ten blocks) and 2024#4 (hundreds-to-tens ratio). This is the most advanced, testing the widest position gap (4 places = 10,000x)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.8B",
    source: "STAAR",
    year: 2025,
    itemNumber: 28,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // Visual: Dot plot titled "Hotel Rating" with x-axis "Number of Stars" (1-5).
    // Dots: 1 star (3 dots), 2 stars (1 dot), 3 stars (2 dots),
    // 4 stars (3 dots), 5 stars (2 dots).
    // Each dot = 1 guest's rating.
    questionStem: "The owner of a hotel asks guests to rate the hotel on a scale of 1 to 5 stars. The data are shown in the dot plot.\n\nHotel Rating (dot plot):\n- 1 star: 3 dots\n- 2 stars: 1 dot\n- 3 stars: 2 dots\n- 4 stars: 3 dots\n- 5 stars: 2 dots\n\nEach dot represents 1 guest's rating.\n\nHow many guests rated the hotel fewer than 3 stars?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: 4,
    options: [
      { letter: "A", text: "2" },
      { letter: "B", text: "3" },
      { letter: "C", text: "6" },
      { letter: "D", text: "4" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Subtracted the number of 2-star ratings from 1-star ratings: 3 - 1 = 2. Used subtraction instead of addition to combine the two categories below 3 stars.",
      B: "Counted only the dots above the 1-star rating (3 dots) and ignored the 2-star rating entirely. Did not include all ratings that are 'fewer than 3.'",
      C: "Included the 3-star ratings in the count: 3 + 1 + 2 = 6. Did not understand that 'fewer than 3' means strictly less than 3, not 'less than or equal to 3.'"
    },

    // --- SELECTION METADATA ---
    operation: "DATA_INTERPRET",
    strand: "Data Analysis",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Dot Plot",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Tests dot plot reading with a 'fewer than' conditional filter. Students must identify which categories to include (1-star and 2-star, NOT 3-star) and then sum the dots. Distractor C specifically catches the 'fewer than vs fewer than or equal to' boundary error. Third exemplar for 3.8B alongside 2021#22 (bar graph) and 2024#14 (dot plot with missing data). Each uses a different graph type or conditional, providing diverse data interpretation practice."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.4B",
    source: "STAAR",
    year: 2025,
    itemNumber: 29,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // ADAPTED from Drag and Drop format (3 tiles dragged into 3 boxes).
    // Original: Tile bank [70, 50, 130, 60, 110, 120].
    // Sentences: "She rounds 67 green marbles to [70]."
    //            "She rounds 54 blue marbles to [50]."
    //            "Andrea estimates she has [120] marbles in total."
    questionStem: "Andrea has 67 green marbles and 54 blue marbles. She rounds each number to the nearest ten to estimate how many marbles she has in total.\n\nWhich shows Andrea's correct estimation?",
    answerType: "multipleChoice",
    correctAnswer: "A",
    correctAnswerValue: 120,
    options: [
      { letter: "A", text: "67 rounds to 70, 54 rounds to 50, and the estimated total is 120." },
      { letter: "B", text: "67 rounds to 60, 54 rounds to 50, and the estimated total is 110." },
      { letter: "C", text: "67 rounds to 70, 54 rounds to 60, and the estimated total is 130." },
      { letter: "D", text: "67 rounds to 70, 54 rounds to 50, and the estimated total is 70." }
    ],

    // --- DISTRACTOR RATIONALES ---
    // Note: Distractors created during adaptation from Drag and Drop format.
    // Original item had 6 tiles; these options test specific rounding errors
    // documented in TEA rationale patterns for rounding-then-adding problems.
    distractorRationales: {
      B: "Rounded 67 DOWN to 60 instead of UP to 70. Since the ones digit (7) is greater than or equal to 5, 67 should round UP to 70. Correctly rounded 54 to 50 but the initial rounding error cascades to the wrong total (60 + 50 = 110).",
      C: "Rounded 54 UP to 60 instead of DOWN to 50. Since the ones digit (4) is less than 5, 54 should round DOWN to 50. Correctly rounded 67 to 70 but the 54-rounding error gives 70 + 60 = 130.",
      D: "Correctly rounded both numbers (67 to 70, 54 to 50) but reported only the first rounded value (70) as the total instead of adding them. Skipped the addition step entirely."
    },

    // --- SELECTION METADATA ---
    operation: "ADD",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 2,
    problemType: "Estimation",
    stepCount: 2,
    hasVisual: false,
    staarItemType: "DragAndDrop",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "Adapted from Drag and Drop (3 tiles from a bank of 6) to MC format. Tests the complete rounding-then-adding estimation process in one integrated question. Each distractor isolates a specific error: rounding 67 wrong (B), rounding 54 wrong (C), or skipping the addition step (D). Second exemplar for 3.4B alongside 2024#17 (Eliza biking). Together they test estimation with different numbers: this item has digits right on the rounding boundary (7 >= 5, 4 < 5)."
  },

];

// Export for use in the combined exemplar bank
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BATCH2_SUPPORTING_EXEMPLARS };
}
