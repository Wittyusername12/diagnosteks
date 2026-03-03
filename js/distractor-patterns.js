/**
 * DISTRACTOR PATTERN BANK — Grade 3 Math
 * =======================================
 * PURPOSE: Teaches the LLM HOW to construct diagnostic distractors
 * for multiple choice problems. Organized by TEKS, dynamically
 * injected into the MC system prompt alongside question exemplars.
 *
 * DISTINCT FROM EXEMPLAR BANK: The exemplar bank (Batches 1-3) shows
 * the LLM what good PROBLEMS look like. This file shows the LLM
 * what good DISTRACTORS look like — the error patterns, construction
 * rules, and worked examples of how real student mistakes produce
 * specific wrong answer values.
 *
 * SOURCE: All patterns extracted from official TEA-released STAAR
 * rationale documents (2019-2025). Every worked example traces to
 * a real test item with a real TEA-authored rationale.
 *
 * TWO SCHEMAS:
 *   Storage (this file): Full metadata including source attribution
 *   Injection (built at runtime): Stripped to what the LLM needs
 *
 * INJECTION: For each teacher-selected TEKS, ALL patterns for that
 * TEKS are injected. No budget cap — every pattern matters.
 * Universal rules always injected regardless of TEKS selection.
 *
 * BUILDS IN TIERS:
 *   Tier 1: 3.4A, 3.4F, 3.4J, 3.4D, 3.4K (core arithmetic)
 *   Tier 2: 3.4H, 3.4E, 3.5A, 3.5B, 3.4B, 3.4G, 3.6C
 *   Tier 3: 3.3x fractions, 3.2x place value, 3.7B, 3.7C
 *   Tier 4: 3.9x financial, 3.6A-B geometry, 3.8A-B data, 3.5C-E
 */

// ============================================================
// UNIVERSAL DISTRACTOR RULES
// Always injected into MC system prompts, regardless of TEKS.
// Position: embedded in system instructions (primacy zone).
// ============================================================
const UNIVERSAL_DISTRACTOR_RULES = `
DISTRACTOR CONSTRUCTION RULES (MANDATORY FOR ALL MULTIPLE CHOICE):

1. Each distractor targets exactly ONE student error. Never chain 2+ errors into one distractor.
2. Only use numbers that appear in the problem. NEVER invent "phantom" numbers the student wouldn't see.
3. COMPUTE the distractor value FROM the error FIRST, THEN write the rationale. Never pick a value and rationalize backward.
4. Spread values widely. Distractors must NOT be consecutive integers for arithmetic problems.
5. In your JSON output, write the "distractorReasoning" array BEFORE the "options" array.
6. Every rationale is ONE sentence following this format: "[Description of what the student did wrong], resulting in [value]."
7. If you cannot trace how a single student error produces a specific value using only the numbers in the problem, do NOT use that value as a distractor.
8. For MULTI-DIGIT addition or subtraction (any operand >= 100): You MUST show column-by-column work in your distractorReasoning computation field. Work from ones place leftward. At each column, either apply the specific error OR compute normally. Only use the FINAL value your column work produces as the distractor. If your column work produces a different value than what you planned, USE THE COLUMN WORK VALUE — it is correct and your planned value was wrong.

BAD EXAMPLE (DO NOT IMITATE):
  Problem: 36 ÷ 6 = ?    Correct: 6
  Distractors: 4, 5, 8
  WHY BAD: Consecutive small integers with no diagnostic value. No student error produces 4, 5, or 8 from 36÷6.

GOOD EXAMPLE (IMITATE THIS):
  Problem: 36 ÷ 6 = ?    Correct: 6
  Distractors: 30, 42, 216
  WHY GOOD: 30 = 36-6 (subtracted instead of dividing). 42 = 36+6 (added instead of dividing). 216 = 36×6 (multiplied instead of dividing). Wide spread, each targets a specific wrong-operation error.

MULTI-DIGIT ADDITION EXAMPLE (REQUIRED FORMAT FOR OPERANDS >= 100):
  Problem: 438 + 375 = ?    Correct: 813

  Distractor 1 (no regroup at tens AND hundreds):
  Column work: Ones: 8+5=13 → write 3, carry 1. Tens: 3+7=10 → write 0 (DROPPED carry from ones). Hundreds: 4+3=7 (DROPPED carry from tens). → 703
  Rationale: "Added without regrouping at the tens or hundreds places, resulting in 703."

  Distractor 2 (no regroup at hundreds only):
  Column work: Ones: 8+5=13 → write 3, carry 1. Tens: 3+7+1=11 → write 1, carry 1. Hundreds: 4+3=7 (DROPPED carry from tens). → 713
  Rationale: "Regrouped correctly at the tens place but not at the hundreds place, resulting in 713."

  Distractor 3 (ones-place arithmetic error):
  Column work: Ones: 8+5=14 (ERROR: should be 13) → write 4, carry 1. Tens: 3+7+1=11 → write 1, carry 1. Hundreds: 4+3+1=8. → 814
  Rationale: "Made an arithmetic error adding the ones digits, resulting in 814."

  NOTE: Every distractor value was DERIVED from the column work, not chosen first. The column work is the proof.

ANTI-PATTERNS TO AVOID:
- NEVER use "but wrote X" or "but answered X" — if your computation doesn't reach the value, the distractor is invalid.
- NEVER introduce numbers not in the problem (e.g., "divided 24 by 6" when the problem says 36÷6).
- NEVER generate distractors by picking nearby integers and rationalizing afterward.
- NEVER use multi-step error chains. Real students make ONE mistake, not three in sequence.
- For multi-digit problems, NEVER describe a regrouping error without showing column-by-column work. If you say 'failed to regroup' but cannot show which column the error occurred in and what value each column produces, the distractor is invalid.
`;

// ============================================================
// UNIVERSAL RULES REMINDER (brief version)
// Injected just before the generation query (recency zone).
// ============================================================
const DISTRACTOR_RULES_REMINDER = `Remember: each distractor = exactly ONE student error. Compute the distractor value FROM the error using ONLY numbers in the problem. Write distractorReasoning BEFORE options in your JSON output. Every rationale is ONE sentence: "[Error description], resulting in [value]." For multi-digit addition/subtraction (operands >= 100): show column-by-column work in your distractorReasoning computation field. Ones first, then tens, then hundreds. Only use the value your column work produces.`;

// ============================================================
// PER-TEKS DISTRACTOR PATTERNS
// Object keyed by TEKS code for O(1) lookup.
// ============================================================
const DISTRACTOR_PATTERNS = {

  // ============================================================
  // 3.4A — Add and subtract within 1,000
  // Sources: 2019 Items 15, 24(skip-griddable)
  //          2021 Items 3, 20
  //          2022 Items 17, 32
  //          2023 Items 9, 17
  //          2024 Items 1, 22
  //          2025 Items 6, 16(skip-equation editor)
  // Total MC items analyzed: 10
  // Total distractor rationales read verbatim: 30 (26 became worked examples; 4 excluded as sub-variants of existing patterns)
  // ============================================================
  "3.4A": {
    teks: "3.4A",
    description: "Add and subtract within 1,000 using strategies based on place value, properties of operations, and the relationship between addition and subtraction",
    operations: ["ADD", "SUBTRACT"],
    answerFormat: "integer",
    diagramTypes: ["numberLine", "stripDiagram"],
    hasMultiselect: false,

    patterns: [

      // --------------------------------------------------------
      // PATTERN 1: Regrouping failure (addition)
      // Appears in: 2019#15-B, 2019#15-D, 2021#3-B, 2021#3-C,
      //             2023#9-D
      // --------------------------------------------------------
      {
        id: "regroup-fail-add",
        name: "Regrouping failure during addition",
        frequency: "common",
        appliesWhen: "addition requiring carrying",
        constructionRule: "When adding multi-digit numbers where a column sums to 10+, the student fails to carry the regrouped value to the next column. To construct: add the column digits without carrying — the tens or hundreds digit will be too low by 1 (or 2 if multiple columns need regrouping). This can happen at the tens-to-hundreds boundary, the ones-to-tens boundary, or both.",
        diagnosticValue: "Reveals the student understands column addition but hasn't mastered the regrouping/carrying procedure. Needs targeted practice with carrying across place values.",
        examples: [
          {
            problem: "438 + 375",
            correctAnswer: 813,
            errorDescription: "Failed to regroup in both the tens and hundreds places during addition",
            resultingValue: 703,
            rationale: "Added digits in each column without regrouping at the tens or hundreds places, resulting in 703.",
            source: "2019 STAAR Item 15, Option B"
          },
          {
            problem: "438 + 375",
            correctAnswer: 813,
            errorDescription: "Failed to carry the regrouped value from the tens to the hundreds column",
            resultingValue: 713,
            rationale: "Added the ones and tens columns correctly with regrouping but failed to carry to the hundreds place, resulting in 713.",
            source: "2019 STAAR Item 15, Option D"
          },
          {
            problem: "143 + 158 + 175",
            correctAnswer: 476,
            errorDescription: "Failed to regroup in both the tens and hundreds places when adding three numbers",
            resultingValue: 366,
            rationale: "Added all three numbers but skipped regrouping at the tens and hundreds places, resulting in 366.",
            source: "2021 STAAR Item 3, Option B"
          },
          {
            problem: "143 + 158 + 175",
            correctAnswer: 476,
            errorDescription: "Regrouped correctly at the ones-to-tens boundary but failed to carry from tens to hundreds",
            resultingValue: 376,
            rationale: "Correctly regrouped at the ones and tens places but failed to carry the 1 from the tens to the hundreds place, resulting in 376.",
            source: "2021 STAAR Item 3, Option C"
          },
          {
            problem: "69 + 48 + 53 + 27",
            correctAnswer: 197,
            errorDescription: "Dropped the carry from the ones column when adding the tens",
            resultingValue: 177,
            rationale: "Set up the correct expression but failed to carry the regrouped value from the ones to the tens place during addition, resulting in 177.",
            source: "2023 STAAR Item 9, Option D"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 2: Direction reversal (subtraction)
      // Appears in: 2021#20-H, 2024#1-B, 2022#17-C,
      //             2022#32-J, 2025#6-D
      // --------------------------------------------------------
      {
        id: "direction-reversal-sub",
        name: "Subtracting smaller from larger in each column regardless of position",
        frequency: "common",
        appliesWhen: "subtraction where minuend digit < subtrahend digit in at least one column",
        constructionRule: "When a column in the minuend has a smaller digit than the subtrahend, the student subtracts the smaller from the larger instead of regrouping. To construct: for each column, compute |top_digit - bottom_digit| instead of (top_digit - bottom_digit with borrowing). This produces a value where the affected columns have reversed differences.",
        diagnosticValue: "Reveals the student does not understand when or how to regroup during subtraction. They apply subtraction mechanically in each column without considering place-value relationships.",
        examples: [
          {
            problem: "514 - 379",
            correctAnswer: 135,
            errorDescription: "Subtracted the smaller digit from the larger in each column: ones 9-4=5, tens 7-1=6, hundreds 5-3=2",
            resultingValue: 265,
            rationale: "Subtracted the smaller digit from the larger in each column regardless of position instead of regrouping, resulting in 265.",
            source: "2021 STAAR Item 20, Option H"
          },
          {
            problem: "375 - 83",
            correctAnswer: 292,
            errorDescription: "Reversed the subtraction in the tens place: subtracted 7 from 8 instead of regrouping to get 17-8",
            resultingValue: 312,
            rationale: "Subtracted digit-by-digit without regrouping in the tens place, resulting in 312.",
            source: "2024 STAAR Item 1, Option B"
          },
          {
            problem: "710 - 524",
            correctAnswer: 186,
            errorDescription: "Subtracted the smaller from the larger in each column instead of regrouping",
            resultingValue: 214,
            rationale: "Subtracted the smaller digit from the larger in each place value rather than properly regrouping, resulting in 214.",
            source: "2022 STAAR Item 17, Option C"
          },
          {
            problem: "543 - 99",
            correctAnswer: 444,
            errorDescription: "Reversed subtraction in ones (9-3=6) and tens (9-4=5) columns instead of borrowing",
            resultingValue: 556,
            rationale: "Subtracted the smaller digit from the larger in the ones and tens columns instead of regrouping, resulting in 556.",
            source: "2022 STAAR Item 32, Option J (step 1 of multi-step)"
          },
          {
            problem: "704 - 610",
            correctAnswer: 94,
            errorDescription: "Made a regrouping error in the tens place during subtraction",
            resultingValue: 114,
            rationale: "Subtracted correctly but made a regrouping error in the tens place, resulting in 114.",
            source: "2025 STAAR Item 6, Option D"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 3: Borrow-across-zero error
      // Appears in: 2023#17-B, 2024#1-D
      // --------------------------------------------------------
      {
        id: "borrow-across-zero",
        name: "Regrouping error when borrowing across a zero or through multiple places",
        frequency: "occasional",
        appliesWhen: "subtraction where the minuend contains a 0 in an intermediate column, or borrowing cascades across multiple columns",
        constructionRule: "When the minuend has a 0 in the tens place (or requires cascading borrows), the student either forgets to reduce the tens digit after borrowing through it, or double-borrows by reducing both the hundreds and tens digits. To construct: perform the subtraction but skip reducing one digit after a borrow, OR reduce an extra digit. The resulting value will be off by exactly 10 or 100 from the correct answer.",
        diagnosticValue: "Reveals the student understands the concept of borrowing but struggles with the specific mechanics when zeros are involved or when borrows cascade across multiple columns.",
        examples: [
          {
            problem: "107 - 88",
            correctAnswer: 19,
            errorDescription: "Borrowed from hundreds to tens correctly but forgot to reduce tens from 10 to 9 before borrowing again for the ones",
            resultingValue: 29,
            rationale: "Made a borrow-across-zero error by not properly reducing the tens digit after cascading borrows from the hundreds place, resulting in 29.",
            source: "2023 STAAR Item 17, Option B"
          },
          {
            problem: "375 - 83",
            correctAnswer: 292,
            errorDescription: "Attempted regrouping but reduced both the hundreds and tens digits by 1 instead of only the hundreds digit",
            resultingValue: 282,
            rationale: "Attempted to regroup but incorrectly reduced both the hundreds and tens places, resulting in 282.",
            source: "2024 STAAR Item 1, Option D"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 4: Wrong operation
      // Appears in: 2024#1-C, 2023#17-C, 2023#17-D,
      //             2022#32-F, 2024#22-A
      // --------------------------------------------------------
      {
        id: "wrong-operation",
        name: "Applied the wrong arithmetic operation",
        frequency: "common",
        appliesWhen: "any single-step addition or subtraction problem",
        constructionRule: "The student adds when they should subtract, or subtracts when they should add. To construct: apply the opposite operation to the two operands. For subtraction word problems, compute a+b instead of a-b. For addition word problems, compute a-b instead of a+b. The resulting value will be dramatically different from the correct answer, providing wide spread.",
        diagnosticValue: "Reveals the student cannot identify the correct operation from the word problem context. They may not understand key vocabulary like 'difference,' 'total,' 'how many more,' or 'how many in all.'",
        examples: [
          {
            problem: "375 - 83",
            correctAnswer: 292,
            errorDescription: "Added the two numbers instead of subtracting",
            resultingValue: 458,
            rationale: "Added 375 and 83 instead of subtracting, resulting in 458.",
            source: "2024 STAAR Item 1, Option C"
          },
          {
            problem: "107 - 88",
            correctAnswer: 19,
            errorDescription: "Added the two numbers instead of subtracting",
            resultingValue: 195,
            rationale: "Added 107 and 88 instead of subtracting, resulting in 195.",
            source: "2023 STAAR Item 17, Option D"
          },
          // NOTE: This is a TEA-documented DUAL-ERROR distractor (wrong
          // operation + regrouping failure). It appears on the real STAAR
          // but violates the one-error-per-distractor rule. Do NOT use
          // this as a model for generating new distractors — it is included
          // only for completeness. Prefer single-error patterns instead.
          {
            problem: "107 - 88",
            correctAnswer: 19,
            errorDescription: "Added the two numbers but also made a regrouping error in the ones place (TEA dual-error exception — do not replicate as default pattern)",
            resultingValue: 185,
            rationale: "Added instead of subtracting and also failed to regroup properly in the ones place, resulting in 185.",
            source: "2023 STAAR Item 17, Option C"
          },
          {
            problem: "543 + 99 + 212 (should be 543 - 99 - 212)",
            correctAnswer: 232,
            errorDescription: "Added all three numbers instead of subtracting",
            resultingValue: 854,
            rationale: "Added 543, 99, and 212 together instead of subtracting, resulting in 854.",
            source: "2022 STAAR Item 32, Option F"
          },
          {
            problem: "295 + 88 (context: '88 more than 295')",
            correctAnswer: 383,
            errorDescription: "Subtracted 88 from 295 instead of adding when the problem said '88 more'",
            resultingValue: 207,
            rationale: "Subtracted 88 from 295 instead of adding, misinterpreting '88 more' as requiring subtraction, resulting in 207.",
            source: "2024 STAAR Item 22, Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 5: Multi-step — intermediate answer as final
      // Appears in: 2022#17-B, 2023#9-A, 2024#22-B, 2025#6-A
      // --------------------------------------------------------
      {
        id: "intermediate-answer",
        name: "Stopped after the first step of a multi-step problem",
        frequency: "common",
        appliesWhen: "multi-step addition/subtraction problems (2+ operations)",
        constructionRule: "The student correctly completes step 1 but submits that intermediate result as their final answer without completing step 2. To construct: compute only the first step of the problem and use that value as a distractor. This is one of the most reliable distractor patterns for multi-step problems — STAAR uses it in nearly every 2-step item.",
        diagnosticValue: "Reveals the student can perform individual arithmetic operations but struggles with multi-step problem solving. They may not track what the question is actually asking for.",
        examples: [
          {
            problem: "158 + 247 + 119 = 524, then 710 - 524 = 186",
            correctAnswer: 186,
            errorDescription: "Correctly added the three seat counts (524) but stopped without subtracting from the total",
            resultingValue: 524,
            rationale: "Added the three values correctly but did not complete the second step of subtracting from the total, resulting in 524.",
            source: "2022 STAAR Item 17, Option B"
          },
          {
            problem: "69 + 48 + 53 = 170, then 170 + 27 = 197",
            correctAnswer: 197,
            errorDescription: "Added the three play values but forgot to include the leftover amount",
            resultingValue: 170,
            rationale: "Added the three values correctly but neglected to include the leftover amount in the final sum, resulting in 170.",
            source: "2023 STAAR Item 9, Option A"
          },
          {
            problem: "295 + 88 = 383, then 295 + 383 = 678",
            correctAnswer: 678,
            errorDescription: "Found Sunday's total (383) but stopped without adding Saturday's count",
            resultingValue: 383,
            rationale: "Correctly computed the second value but did not complete the final step of combining both values, resulting in 383.",
            source: "2024 STAAR Item 22, Option B"
          },
          {
            problem: "360 + 344 = 704, then 704 - 610 = 94",
            correctAnswer: 94,
            errorDescription: "Added summer and winter hours but stopped without subtracting fall hours",
            resultingValue: 704,
            rationale: "Correctly combined the two values but failed to perform the second step of finding the difference, resulting in 704.",
            source: "2025 STAAR Item 6, Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 6: Multi-step — wrong operation on one step
      // Appears in: 2023#9-C, 2022#32-H, 2024#22-C
      // --------------------------------------------------------
      {
        id: "multi-step-wrong-op",
        name: "Applied the wrong operation on one step of a multi-step problem",
        frequency: "occasional",
        appliesWhen: "multi-step addition/subtraction problems (2+ operations)",
        constructionRule: "The student completes both steps but uses the wrong operation on one of them. To construct: flip one operation (add to subtract or subtract to add) while keeping the other step correct. Compute the result of this partially-wrong sequence. Common variants: (1) subtracted where they should have added in step 1, then did step 2 correctly on the wrong intermediate, (2) added in step 1 when they should have subtracted, then did step 2 correctly.",
        diagnosticValue: "Reveals the student can execute multi-step procedures but misidentifies which operation is needed at a specific step. More advanced than Pattern 5 (they at least attempted both steps) but still shows a gap in problem comprehension.",
        examples: [
          {
            problem: "69 + 48 + 53 = 170, then 170 + 27 = 197",
            correctAnswer: 197,
            errorDescription: "Added the three plays correctly (170) but subtracted the leftover instead of adding it",
            resultingValue: 143,
            rationale: "Found the sum of the three values correctly but subtracted the remaining amount instead of adding it, resulting in 143.",
            source: "2023 STAAR Item 9, Option C"
          },
          {
            problem: "543 - 99 - 212 = 232",
            correctAnswer: 232,
            errorDescription: "Added the first two numbers instead of subtracting (543+99=642), then correctly subtracted 212",
            resultingValue: 430,
            rationale: "Added the first two values instead of subtracting, then correctly subtracted the third value from that incorrect sum, resulting in 430.",
            source: "2022 STAAR Item 32, Option H"
          },
          {
            problem: "295 + 88 = 383, then 295 + 383 = 678",
            correctAnswer: 678,
            errorDescription: "Doubled Saturday's count and subtracted the extra instead of adding it: (295+295)-88=502",
            resultingValue: 502,
            rationale: "Doubled the first value and subtracted the additional amount instead of adding it, resulting in 502.",
            source: "2024 STAAR Item 22, Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 7: Ones-place arithmetic error
      // Appears in: 2019#15-C, 2021#3-D
      // --------------------------------------------------------
      {
        id: "ones-arithmetic-error",
        name: "Arithmetic error in the ones column",
        frequency: "occasional",
        appliesWhen: "addition where the ones column sum is close to a regrouping boundary",
        constructionRule: "The student miscalculates the ones column by exactly 1, typically when the sum is near 10 or 15. To construct: miscalculate the ones-column sum by +1 or −1, then carry normally through the remaining columns. The direction should produce a different carry behavior or ones digit than the correct sum — for example, if the true ones sum is 13 (carry 1, write 3), a +1 error gives 14 (carry 1, write 4). The final answer will differ from the correct answer by exactly 1. NOTE: This pattern inherently produces a ±1 distractor (narrow spread), so always use it alongside wider-spread patterns like regroup-fail or wrong-operation — never as the sole distractor source.",
        diagnosticValue: "Reveals a basic fact fluency gap rather than a conceptual misunderstanding. The student understands regrouping and multi-digit procedures but makes a simple computation error on a single-digit addition.",
        examples: [
          {
            problem: "438 + 375",
            correctAnswer: 813,
            errorDescription: "Miscalculated the ones place (8+5=14 instead of 13), then carried the extra 1 forward",
            resultingValue: 814,
            rationale: "Made an arithmetic error in the ones place and carried the incorrect value forward, resulting in 814.",
            source: "2019 STAAR Item 15, Option C"
          },
          {
            problem: "143 + 158 + 175",
            correctAnswer: 476,
            errorDescription: "Computed the ones column as 3+8+5=13 instead of 16, producing wrong ones digit and carry",
            resultingValue: 473,
            rationale: "Made an arithmetic error in the ones column when adding three numbers, resulting in 473.",
            source: "2021 STAAR Item 3, Option D"
          }
        ]
      }

    ] // end patterns array for 3.4A
  },

  // ============================================================
  // 3.4F — Recall facts to multiply up to 10×10 with automaticity
  //        and recall the corresponding division facts
  //
  // TEKS format change: pre-2023 "3.4(F)" → 2023+ "3.2.4.F"
  //
  // Direct 3.4F items: 2019#5 and 2021#14 — BOTH griddable,
  //   no MC distractors. Zero direct 3.4F MC items exist.
  //
  // Patterns extracted from 14 related MC items testing the
  // same single-step multiply/divide facts in MC format:
  //   3.4(D)/3.2.4.D: 2019#20, 2021#16, 2024#11
  //   3.4(H)/3.2.4.H: 2019#18, 2022#25, 2023#2
  //   3.4(J)/3.2.4.J: 2023#27, 2025#2
  //   3.4(K)/3.2.4.K: 2019#26, 2024#20, 2025#10
  //   (2022#11→3.4J entry; 2021#25,2024#28→3.4G entry;
  //    multi-step management from 3.4K items→3.4K entry)
  //
  // Total MC items contributing to 3.4F: 14
  // Total distractor rationales read verbatim from images: 42+
  // Total worked examples in this entry: 26
  //
  // CRITICAL: Since the exemplar bank has ZERO MC exemplars for
  // 3.4F (both are griddable with null distractors), this
  // distractor pattern entry is the LLM's ONLY source of
  // distractor construction guidance for this TEKS.
  // ============================================================
  "3.4F": {
    teks: "3.4F",
    description: "Recall facts to multiply up to 10 by 10 with automaticity and recall the corresponding division facts",
    operations: ["MULTIPLY", "DIVIDE"],
    answerFormat: "integer",
    diagramTypes: ["array", "equalGroups"],
    hasMultiselect: false,

    patterns: [

      // --------------------------------------------------------
      // PATTERN 1: Wrong operation — used addition
      // Appears in: 2019#20-H, 2021#16-J, 2019#18-J,
      //             2022#25-B, 2024#20-A, 2024#11-C, 2025#2-D
      // The most common single-step distractor for basic facts.
      // --------------------------------------------------------
      {
        id: "wrong-op-added",
        name: "Added instead of multiplying or dividing",
        frequency: "common",
        appliesWhen: "any single-step multiplication or division fact problem",
        constructionRule: "The student adds the two operands instead of multiplying or dividing. To construct: compute a+b. For multiplication problems (e.g. 6×9), a+b produces a much SMALLER value than the correct product. For division problems (e.g. 27÷9), a+b produces a much LARGER value than the correct quotient. This creates wide spread automatically.",
        diagnosticValue: "Reveals the student cannot identify the correct operation from the problem context. They may not understand vocabulary like 'groups of,' 'each,' 'shared equally,' or 'times as many.'",
        examples: [
          {
            problem: "6 × 9 (6 photographs per page, 9 pages)",
            correctAnswer: 54,
            errorDescription: "Added 6 and 9 instead of multiplying",
            resultingValue: 15,
            rationale: "Added 6 to 9 instead of multiplying, resulting in 15.",
            source: "2019 STAAR Item 20, Option H"
          },
          {
            problem: "4 × 6 (4 outlets per panel, 6 panels)",
            correctAnswer: 24,
            errorDescription: "Added 4 and 6 instead of multiplying",
            resultingValue: 10,
            rationale: "Added 4 to 6 instead of multiplying, resulting in 10.",
            source: "2021 STAAR Item 16, Option J"
          },
          {
            problem: "27 ÷ 9 (27 students shared among 9 hoops)",
            correctAnswer: 3,
            errorDescription: "Added 27 and 9 instead of dividing",
            resultingValue: 36,
            rationale: "Added 9 to 27 instead of dividing, resulting in 36.",
            source: "2019 STAAR Item 18, Option J"
          },
          {
            problem: "14 ÷ 2 (14 stars on 2 posters)",
            correctAnswer: 7,
            errorDescription: "Added 14 and 2 instead of dividing",
            resultingValue: 16,
            rationale: "Added 14 and 2 instead of dividing, resulting in 16.",
            source: "2022 STAAR Item 25, Option B"
          },
          {
            problem: "75 ÷ 15 (75 shirts, 15 per shelf)",
            correctAnswer: 5,
            errorDescription: "Added 75 and 15 instead of dividing",
            resultingValue: 90,
            rationale: "Added 75 and 15 instead of dividing, resulting in 90.",
            source: "2024 STAAR Item 20, Option A"
          },
          {
            problem: "8 × 8 (8 squares per row, 8 rows on game board)",
            correctAnswer: 64,
            errorDescription: "Added 8 and 8 instead of multiplying",
            resultingValue: 16,
            rationale: "Added 8 and 8 instead of multiplying, resulting in 16.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option C"
          },
          {
            problem: "45 ÷ 5 (45 toy cars divided into 5 colors)",
            correctAnswer: 9,
            errorDescription: "Added 45 and 5 instead of dividing",
            resultingValue: 50,
            rationale: "Added 45 and 5 instead of dividing, resulting in 50.",
            source: "2025 STAAR Item 2 (3.2.4.J), Option D"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 2: Wrong operation — used subtraction
      // Appears in: 2019#18-G, 2022#25-C, 2023#2-B,
      //             2024#20-B, 2025#2-C
      // Primarily appears in division contexts.
      // --------------------------------------------------------
      {
        id: "wrong-op-subtracted",
        name: "Subtracted instead of dividing",
        frequency: "common",
        appliesWhen: "division fact problems",
        constructionRule: "The student subtracts the divisor from the dividend instead of dividing. To construct: compute a-b. For division problems, a-b is always much larger than the correct quotient, creating wide spread. This distractor appears on nearly every division MC item on STAAR.",
        diagnosticValue: "Reveals the student recognizes that two numbers are involved but selects the wrong operation. They may confuse 'how many in each group' or 'how many groups' with a comparison/difference context.",
        examples: [
          {
            problem: "27 ÷ 9 (27 students shared among 9 hoops)",
            correctAnswer: 3,
            errorDescription: "Subtracted 9 from 27 instead of dividing",
            resultingValue: 18,
            rationale: "Subtracted 9 from 27 instead of dividing, resulting in 18.",
            source: "2019 STAAR Item 18, Option G"
          },
          {
            problem: "14 ÷ 2 (14 stars on 2 posters)",
            correctAnswer: 7,
            errorDescription: "Subtracted 2 from 14 instead of dividing",
            resultingValue: 12,
            rationale: "Subtracted 2 from 14 instead of dividing, resulting in 12.",
            source: "2022 STAAR Item 25, Option C"
          },
          {
            problem: "26 ÷ 2 (26 pieces of candy divided into bags of 2)",
            correctAnswer: 13,
            errorDescription: "Subtracted 2 from 26 instead of dividing",
            resultingValue: 24,
            rationale: "Subtracted 2 from 26 instead of dividing, resulting in 24.",
            source: "2023 STAAR Item 2 (3.2.4.H), Option B"
          },
          {
            problem: "75 ÷ 15 (75 shirts, 15 per shelf)",
            correctAnswer: 5,
            errorDescription: "Subtracted 15 from 75 instead of dividing",
            resultingValue: 60,
            rationale: "Subtracted 15 from 75 instead of dividing, resulting in 60.",
            source: "2024 STAAR Item 20, Option B"
          },
          {
            problem: "45 ÷ 5 (45 toy cars in 5 colors)",
            correctAnswer: 9,
            errorDescription: "Subtracted 5 from 45 instead of dividing",
            resultingValue: 40,
            rationale: "Subtracted 5 from 45 instead of dividing, resulting in 40.",
            source: "2025 STAAR Item 2, Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 3: Inverse operation confusion
      // Appears in: 2022#25-A, 2025#2-B, 2019#26-F
      // Student multiplies when they should divide.
      // --------------------------------------------------------
      {
        id: "inverse-op-confusion",
        name: "Multiplied instead of dividing (inverse operation confusion)",
        frequency: "common",
        appliesWhen: "division fact problems",
        constructionRule: "The student multiplies the two numbers instead of dividing. To construct: compute a×b instead of a÷b. This produces a dramatically larger value than the correct quotient. For example, 14÷2=7 becomes 14×2=28. The resulting value is always the product of the two numbers, which is often close to or exactly the dividend squared divided by the quotient — it creates a very recognizable 'too large' distractor.",
        diagnosticValue: "Reveals the student confuses multiplication and division, possibly not understanding that division is the inverse of multiplication. They may need practice connecting fact families (e.g., if 6×7=42, then 42÷7=6).",
        examples: [
          {
            problem: "14 ÷ 2 (14 stars on 2 posters)",
            correctAnswer: 7,
            errorDescription: "Multiplied 14 by 2 instead of dividing",
            resultingValue: 28,
            rationale: "Multiplied 14 and 2 instead of dividing, resulting in 28.",
            source: "2022 STAAR Item 25, Option A"
          },
          {
            problem: "45 ÷ 5 (45 toy cars in 5 colors)",
            correctAnswer: 9,
            errorDescription: "Multiplied the numbers in the problem instead of dividing",
            resultingValue: 225,
            rationale: "Multiplied 5 and 45 instead of dividing, resulting in 225.",
            source: "2025 STAAR Item 2, Option B"
          },
          {
            problem: "30 ÷ 6 (30 basketball players into 6 groups)",
            correctAnswer: 5,
            errorDescription: "Multiplied by 6 instead of dividing by 6 in the second step",
            resultingValue: 180,
            rationale: "Multiplied 30 by 6 instead of dividing, resulting in 180.",
            source: "2019 STAAR Item 26, Option F"
          },
          {
            problem: "28 ÷ 7 (28 ounces split into 7-ounce portions)",
            correctAnswer: 4,
            errorDescription: "Multiplied 7 × 28 = 196 instead of dividing 28 ÷ 7",
            resultingValue: 196,
            rationale: "Multiplied the two numbers instead of dividing, resulting in 196.",
            source: "2023 STAAR Item 27 (3.2.4.J), Option D"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 4: Neighbor fact error (multiplication)
      // Appears in: 2019#20-F, 2019#20-G, 2021#16-G
      // Student recalls a nearby fact from the times table.
      // --------------------------------------------------------
      {
        id: "neighbor-fact",
        name: "Recalled a neighboring multiplication fact",
        frequency: "common",
        appliesWhen: "multiplication fact problems",
        constructionRule: "The student recalls a×(b±1) or (a±1)×b instead of a×b. To construct: compute the product using one factor increased or decreased by 1. For 6×9, neighbor facts are 6×8=48 and 5×9=45. This produces values that differ from the correct answer by exactly one factor (e.g., 54-48=6, which is the other factor). Neighbor facts are the most diagnostic distractor for multiplication because they reveal which specific fact the student is confusing.",
        diagnosticValue: "Reveals the student has a specific gap in multiplication fact fluency. They can multiply but confuse adjacent facts in the times table. Targeted practice with that specific fact family is needed.",
        examples: [
          {
            problem: "6 × 9 (6 photographs per page, 9 pages)",
            correctAnswer: 54,
            errorDescription: "Recalled 6×8=48 instead of 6×9=54 (off by one factor of 9→8)",
            resultingValue: 48,
            rationale: "Confused 6×9 with the neighboring fact 6×8, resulting in 48.",
            source: "2019 STAAR Item 20, Option F"
          },
          {
            problem: "6 × 9 (6 photographs per page, 9 pages)",
            correctAnswer: 54,
            errorDescription: "Recalled 5×9=45 instead of 6×9=54 (off by one factor of 6→5)",
            resultingValue: 45,
            rationale: "Confused 6×9 with the neighboring fact 5×9, resulting in 45.",
            source: "2019 STAAR Item 20, Option G"
          },
          {
            problem: "4 × 6 (4 outlets per panel, 6 panels)",
            correctAnswer: 24,
            errorDescription: "Recalled 4×5=20 instead of 4×6=24 (off by one factor of 6→5)",
            resultingValue: 20,
            rationale: "Confused 4×6 with the neighboring fact 4×5, resulting in 20.",
            source: "2021 STAAR Item 16, Option G"
          },
          {
            problem: "8 × 8 (8 squares per row, 8 rows on game board)",
            correctAnswer: 64,
            errorDescription: "Found 7×8=56 instead of 8×8=64 — used 7 rows instead of 8 total",
            resultingValue: 56,
            rationale: "Confused 8×8 with the neighboring fact 7×8, resulting in 56.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 5: Skip-counting error (multiplication)
      // Appears in: 2021#16-F
      // Student skip-counts but lands one group too many/few.
      // --------------------------------------------------------
      {
        id: "skip-count-error",
        name: "Skip-counting error — counted one group too many or too few",
        frequency: "occasional",
        appliesWhen: "multiplication fact problems, especially with visual groups or arrays",
        constructionRule: "The student uses skip-counting to find the product but counts one extra group or one fewer group. To construct: compute a×(b+1) or a×(b-1). For 4×6, counting one extra group of 4 gives 4×7=28. The resulting value differs from the correct answer by exactly one factor. Note: this can look similar to Pattern 4 (neighbor fact) but the mechanism is different — the student applied the right strategy (skip-counting) but miscounted the number of groups.",
        diagnosticValue: "Reveals the student understands multiplication as repeated addition/skip-counting but has difficulty tracking the count of groups. They need practice with organized counting strategies.",
        examples: [
          {
            problem: "4 × 6 (4 outlets per panel, 6 panels)",
            correctAnswer: 24,
            errorDescription: "Skip-counted by 4 but counted 7 groups instead of 6: 4, 8, 12, 16, 20, 24, 28",
            resultingValue: 28,
            rationale: "Made an error when skip-counting by 4, counting one extra group and resulting in 28.",
            source: "2021 STAAR Item 16, Option F"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 6: Chose operand as answer (division)
      // Appears in: 2019#18-H, 2023#2-A, 2023#2-C,
      //             2024#11-B, 2025#10-D
      // Student selects the divisor or another number from the
      // problem instead of computing the quotient.
      // --------------------------------------------------------
      {
        id: "chose-operand",
        name: "Selected a number from the problem instead of computing",
        frequency: "common",
        appliesWhen: "division fact problems",
        constructionRule: "The student picks the divisor (or dividend, or another number stated in the problem) as their answer instead of performing the division. To construct: use the divisor itself, or another salient number from the problem, as a distractor value. For 27÷9, the student selects 9 (the divisor). This is a fundamentally different error from wrong-operation — the student may not even attempt to compute. IMPORTANT: verify that the chosen operand value differs from the correct answer — if divisor = quotient (e.g. 36÷6=6), use a different problem number instead.",
        diagnosticValue: "Reveals the student does not understand what the division operation produces. They may not comprehend that division finds 'how many in each group' or 'how many groups,' and instead latch onto a number they see in the problem.",
        examples: [
          {
            problem: "27 ÷ 9 (27 students shared among 9 hoops)",
            correctAnswer: 3,
            errorDescription: "Chose the number of hoops (9) as the answer instead of dividing",
            resultingValue: 9,
            rationale: "Selected the divisor from the problem instead of computing the quotient, resulting in 9.",
            source: "2019 STAAR Item 18, Option H"
          },
          {
            problem: "26 ÷ 2 (26 pieces of candy divided into bags of 2)",
            correctAnswer: 13,
            errorDescription: "Chose the number of pieces per bag (2) as the total number of bags",
            resultingValue: 2,
            rationale: "Selected the divisor from the problem instead of computing the quotient, resulting in 2.",
            source: "2023 STAAR Item 2 (3.2.4.H), Option A"
          },
          {
            problem: "26 ÷ 2 (26 pieces of candy divided into bags of 2, shown in 3 rows)",
            correctAnswer: 13,
            errorDescription: "Counted the 3 rows of candy in the picture instead of computing the division",
            resultingValue: 3,
            rationale: "Counted visual rows in the picture (3) instead of computing the division, resulting in 3.",
            source: "2023 STAAR Item 2 (3.2.4.H), Option C"
          },
          {
            problem: "60 ÷ 3 ÷ 4 (60 blocks shared among 3 people, then into 4 piles)",
            correctAnswer: 5,
            errorDescription: "Chose the number of piles (4) as the answer instead of computing",
            resultingValue: 4,
            rationale: "Selected the divisor from the problem instead of computing the quotient, resulting in 4.",
            source: "2025 STAAR Item 10, Option D"
          },
          {
            problem: "8 × 8 (8 squares per row, 8 rows on game board)",
            correctAnswer: 64,
            errorDescription: "Just counted the 8 squares in the model shown without multiplying by number of rows",
            resultingValue: 8,
            rationale: "Reported only the count from one row of the model without multiplying, resulting in 8.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option B"
          }
        ]
      }

    ] // end patterns array for 3.4F
  },

  // ============================================================
  // TIER 1 COMPLETE: 3.4A, 3.4F, 3.4J, 3.4D, 3.4K
  // Next: Tier 2 (3.4H, 3.4E, 3.5A, 3.5B, 3.4B, 3.4G, 3.6C)
  // Then: Tier 3-4
  // ============================================================

  // ============================================================
  // 3.4J — Determine a number that makes an equation involving
  //         multiplication or division true
  //
  // TEKS format change: pre-2023 "3.4(J)" → 2023+ "3.2.4.J"
  //
  // Direct 3.4J/3.2.4.J MC items (3 items):
  //   2022 Item 11 (3.4(J)):   12÷2=□, "which number sentence", Answer=B
  //   2023 Item 27 (3.2.4.J):  7×?=28, "which equation", Answer=B
  //   2025 Item 2 (3.2.4.J):   5×?=45, "which equation", Answer=A
  // Not tested: 2019, 2021, 2024
  //
  // Related 3.5(D) MC item (same skill: find unknown in ×/÷ equation):
  //   2022 Item 23 (3.5(D)):   □×7=98, "what number goes in □", Answer=A
  //
  // ALL FOUR items are "which equation" or "find the missing number"
  // format. Answer choices are complete equations (e.g., "7×4=28")
  // or single numeric values. Our app generates standard numeric MC
  // (e.g., "12÷2=□" with options 6, 14, 24, 10). Patterns below
  // express both the equation-level error and the numeric value.
  //
  // Total MC items analyzed: 4
  // Total distractor rationales read verbatim: 12
  // Total worked examples in this entry: 12
  // ============================================================
  "3.4J": {
    teks: "3.4J",
    description: "Determine a number that makes an equation involving multiplication or division true",
    operations: ["MULTIPLY", "DIVIDE"],
    answerFormat: "integer",
    diagramTypes: [],
    hasMultiselect: false,

    patterns: [

      // --------------------------------------------------------
      // PATTERN 1: Used addition instead of the multiplicative
      //            relationship
      // Appears in: 2022#11-A, 2022#23-C, 2025#2-D
      // Student adds the two visible numbers instead of using
      // the multiplication/division relationship.
      // --------------------------------------------------------
      {
        id: "added-instead",
        name: "Added the two visible numbers instead of using the multiplication or division relationship",
        frequency: "common",
        appliesWhen: "any equation with a missing value involving multiplication or division",
        constructionRule: "For a division equation a÷b=□, the student computes a+b. For a multiplication equation □×b=c, the student computes b+c. The resulting value is always larger than the correct answer for division equations. To construct: add the two numbers the student can see in the equation. STAAR presents this as the student misreading the ÷ symbol as + or simply not understanding what operation the equation requires.",
        diagnosticValue: "Reveals the student does not understand the multiplicative relationship in an equation. They may interpret all equations as addition problems or may not know what the ÷ or × symbols mean in context.",
        examples: [
          {
            problem: "12 ÷ 2 = □",
            correctAnswer: 6,
            errorDescription: "Added 2 + 12 = 14, likely misreading ÷ as +",
            resultingValue: 14,
            rationale: "Added the two numbers in the equation instead of dividing, resulting in 14.",
            source: "2022 STAAR Item 11 (3.4J), Option A"
          },
          {
            problem: "45 ÷ 5 = □ (45 toy cars in 5 colors)",
            correctAnswer: 9,
            errorDescription: "Added 45 + 5 = 50 instead of dividing",
            resultingValue: 50,
            rationale: "Added the two numbers instead of using the division relationship, resulting in 50.",
            source: "2025 STAAR Item 2 (3.2.4.J), Option D"
          },
          {
            problem: "□ × 7 = 98 (find the missing factor)",
            correctAnswer: 14,
            errorDescription: "Added 98 + 7 = 105 instead of dividing to find the missing factor",
            resultingValue: 105,
            rationale: "Added 98 and 7 instead of dividing, resulting in 105.",
            source: "2022 STAAR Item 23 (3.5D), Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 2: Subtracted instead of dividing
      // Appears in: 2022#11-D, 2022#23-B, 2023#27-A, 2025#2-C
      // Student subtracts the smaller from the larger instead
      // of finding the multiplicative relationship.
      // --------------------------------------------------------
      {
        id: "subtracted-instead",
        name: "Subtracted instead of using the multiplication or division relationship",
        frequency: "common",
        appliesWhen: "division equations or word problems requiring division",
        constructionRule: "For a÷b=□, the student computes a−b. The resulting value is always larger than the correct quotient but smaller than the dividend. To construct: subtract the divisor from the dividend. STAAR notes that these students may misread ÷ as − or may interpret 'equal sharing' as 'taking away.'",
        diagnosticValue: "Reveals the student confuses division with subtraction. They may understand that the total is being reduced but choose subtraction instead of equal partitioning.",
        examples: [
          {
            problem: "12 ÷ 2 = □",
            correctAnswer: 6,
            errorDescription: "Subtracted to get 12 − 2 = 10, then misread ÷ as − and used + as its inverse",
            resultingValue: 10,
            rationale: "Misread the division symbol as subtraction and computed 12 − 2, resulting in 10.",
            source: "2022 STAAR Item 11 (3.4J), Option D"
          },
          {
            problem: "□ × 7 = 98 (find the missing factor)",
            correctAnswer: 14,
            errorDescription: "Subtracted 7 from 98 instead of dividing to find the missing factor",
            resultingValue: 91,
            rationale: "Subtracted 7 from 98 instead of dividing, resulting in 91.",
            source: "2022 STAAR Item 23 (3.5D), Option B"
          },
          {
            problem: "28 ÷ 7 = □ (28 ounces, 7 per feeder)",
            correctAnswer: 4,
            errorDescription: "Subtracted 28 − 7 = 21, treating this as a subtraction problem",
            resultingValue: 21,
            rationale: "Subtracted the divisor from the dividend instead of dividing, resulting in 21.",
            source: "2023 STAAR Item 27 (3.2.4.J), Option A"
          },
          {
            problem: "45 ÷ 5 = □ (45 toy cars, 5 colors)",
            correctAnswer: 9,
            errorDescription: "Subtracted 45 − 5 = 40 instead of dividing",
            resultingValue: 40,
            rationale: "Subtracted the divisor from the dividend instead of dividing, resulting in 40.",
            source: "2025 STAAR Item 2 (3.2.4.J), Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 3: Multiplied instead of dividing (inverse
      //            operation confusion)
      // Appears in: 2022#11-C, 2023#27-D, 2025#2-B
      // Student multiplies the two visible numbers instead of
      // finding the quotient. Produces dramatically wrong values.
      // --------------------------------------------------------
      {
        id: "multiplied-instead",
        name: "Multiplied the two visible numbers instead of dividing",
        frequency: "common",
        appliesWhen: "division equations where student can see dividend and divisor",
        constructionRule: "For a÷b=□, the student computes a×b. This produces a value dramatically larger than the correct answer — often absurdly large (e.g., 196 instead of 4). To construct: multiply the dividend by the divisor. STAAR describes this as the student confusing 'dividing 28 by 7 with multiplying 28 by 7' or using the dividend as if it were a factor in a multiplication problem.",
        diagnosticValue: "Reveals the student does not understand the inverse relationship between multiplication and division. They recognize that multiplication is involved but apply it in the wrong direction.",
        examples: [
          {
            problem: "12 ÷ 2 = □",
            correctAnswer: 6,
            errorDescription: "Multiplied 12 × 2 = 24, using dividend × divisor as a multiplication fact",
            resultingValue: 24,
            rationale: "Multiplied the dividend by the divisor instead of dividing, resulting in 24.",
            source: "2022 STAAR Item 11 (3.4J), Option C"
          },
          {
            problem: "28 ÷ 7 = □ (28 ounces, 7 per feeder)",
            correctAnswer: 4,
            errorDescription: "Multiplied 7 × 28 = 196 instead of dividing 28 ÷ 7",
            resultingValue: 196,
            rationale: "Multiplied the two numbers instead of dividing, resulting in 196.",
            source: "2023 STAAR Item 27 (3.2.4.J), Option D"
          },
          {
            problem: "45 ÷ 5 = □ (45 toy cars, 5 colors)",
            correctAnswer: 9,
            errorDescription: "Multiplied 5 × 45 = 225 instead of dividing",
            resultingValue: 225,
            rationale: "Multiplied the two numbers instead of dividing, resulting in 225.",
            source: "2025 STAAR Item 2 (3.2.4.J), Option B"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 4: Found the answer but formed wrong equation
      //            (combined answer with wrong operation)
      // Appears in: 2023#27-C
      // Student correctly finds the unknown but then uses it
      // incorrectly in forming an equation.
      // --------------------------------------------------------
      {
        id: "answer-wrong-equation",
        name: "Found the correct unknown value but combined it with the wrong operation",
        frequency: "occasional",
        appliesWhen: "equation-selection problems where student must identify which equation represents the solution",
        constructionRule: "The student correctly determines the unknown value (quotient or factor) but then combines it with the dividend using addition instead of forming a multiplication equation. For a÷b=q (where q is the unknown), the student finds q correctly but writes a+q instead of b×q=a. To construct: compute a+q where q is the correct answer. This creates a distractor that is close to the dividend, which makes it seem plausible.",
        diagnosticValue: "Reveals the student CAN compute the answer but does not understand how to represent the multiplicative relationship as an equation. This is a more advanced error — the arithmetic is correct but the algebraic thinking is flawed.",
        examples: [
          {
            problem: "28 ÷ 7 = □ (find number of feeders)",
            correctAnswer: 4,
            errorDescription: "Found 4 feeders correctly but then added 28 + 4 = 32 instead of writing 7 × 4 = 28",
            resultingValue: 32,
            rationale: "Found the correct quotient but added it to the dividend instead of forming a multiplication equation, resulting in 32.",
            source: "2023 STAAR Item 27 (3.2.4.J), Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 5: Correct inverse operation but computation error
      // Appears in: 2022#23-D
      // Student correctly identifies division as inverse of
      // multiplication but makes an arithmetic error in the
      // division computation itself.
      // --------------------------------------------------------
      {
        id: "correct-op-computation-error",
        name: "Used the correct inverse operation but made an arithmetic error in the division",
        frequency: "occasional",
        appliesWhen: "equations with larger products where the division fact is not automatic (e.g., 98÷7)",
        constructionRule: "The student correctly identifies that division is the inverse of multiplication and attempts to divide, but gets the quotient off by 1 (neighbor fact error applied to division). For □×b=c, the student computes c÷b but gets (c÷b)±1. To construct: compute the correct quotient, then subtract or add 1. This produces a value very close to the correct answer. STAAR describes this as the student recognizing the correct operation 'but made an error when dividing.'",
        diagnosticValue: "Reveals the student understands the relationship between multiplication and division but lacks fluency with the specific division fact. Unlike Patterns 1-3, the conceptual understanding is correct — only the computation is wrong. Targeted fact practice with that specific fact family is needed.",
        examples: [
          {
            problem: "□ × 7 = 98 (find the missing factor)",
            correctAnswer: 14,
            errorDescription: "Recognized division as inverse but computed 98 ÷ 7 = 13 instead of 14",
            resultingValue: 13,
            rationale: "Used the correct inverse operation (division) but made an error when dividing 98 by 7, resulting in 13.",
            source: "2022 STAAR Item 23 (3.5D), Option D"
          }
        ]
      }

    ] // end patterns array for 3.4J
  },

  // ============================================================
  // 3.4D — Determine the total number of objects when equal-
  //         sized groups are combined or arranged in arrays
  //
  // TEKS format change: pre-2023 "3.4(D)" → 2023+ "3.2.4.D"
  //
  // 3 MC items across 6 years (all that exist — no non-MC):
  //   2019 Item 20 (3.4(D)):  6×9=54, 6 photos/page × 9 pages, Answer=J
  //   2021 Item 16 (3.4(D)):  4×6=24, 4 outlets/panel × 6 panels, Answer=H
  //   2024 Item 11 (3.2.4.D): 8×8=64, 8 squares/row × 8 rows, Answer=D
  // Not tested: 2022, 2023, 2025
  //
  // KEY DISTINCTION FROM 3.4F: All 3.4D problems feature a visual
  // model showing ONE group/row (one page of photos, one panel of
  // outlets, one row of squares). This visual creates a unique
  // distractor pattern: the student multiplies by the number of
  // ADDITIONAL unseen groups instead of the TOTAL number of groups.
  // This "miscounted from visual" pattern does NOT appear in 3.4F
  // (raw fact recall) and is critical for any problem with a model.
  //
  // NOTE: Patterns 1, 2, and 4 overlap with 3.4F patterns since
  // the underlying math is the same multiplication facts. The
  // overlap is intentional — when the LLM generates a 3.4D problem,
  // it needs to see these patterns in equal-groups CONTEXT, not
  // raw-fact context. The construction rules and examples are
  // specific to 3.4D's word-problem-with-visual structure.
  //
  // Total MC items analyzed: 3
  // Total distractor rationales read verbatim: 9
  // Total worked examples in this entry: 9
  // ============================================================
  "3.4D": {
    teks: "3.4D",
    description: "Determine the total number of objects when equal-sized groups of objects are combined or arranged in arrays up to 10 by 10",
    operations: ["MULTIPLY"],
    answerFormat: "integer",
    diagramTypes: ["array", "equalGroups"],
    hasMultiselect: false,

    patterns: [

      // --------------------------------------------------------
      // PATTERN 1: Wrong operation — added factors
      // Appears in: 2019#20-H, 2021#16-J, 2024#11-C
      // Present in ALL 3 items — the most consistent distractor.
      // --------------------------------------------------------
      {
        id: "wrong-op-added",
        name: "Added the number of objects per group and the number of groups instead of multiplying",
        frequency: "common",
        appliesWhen: "any equal-groups or array multiplication problem",
        constructionRule: "The student adds the two factors instead of multiplying. For a groups of b objects each, compute a+b instead of a×b. The resulting value is always dramatically smaller than the correct product (e.g., 15 vs 54 for 6×9), which provides wide spread. STAAR uses this distractor on every 3.4D item because it diagnoses whether the student even recognizes multiplication is needed.",
        diagnosticValue: "Reveals the student cannot identify that equal groups or arrays require multiplication. They may understand that two quantities are involved but default to addition. Needs explicit instruction connecting 'groups of' language to multiplication.",
        examples: [
          {
            problem: "6 × 9 (6 photographs per page, 9 pages in album)",
            correctAnswer: 54,
            errorDescription: "Added 6 + 9 = 15 instead of multiplying",
            resultingValue: 15,
            rationale: "Added the number per group to the number of groups instead of multiplying, resulting in 15.",
            source: "2019 STAAR Item 20 (3.4D), Option H"
          },
          {
            problem: "4 × 6 (4 outlets per panel, 6 electrical panels)",
            correctAnswer: 24,
            errorDescription: "Added 4 + 6 = 10 instead of multiplying",
            resultingValue: 10,
            rationale: "Added the number per group to the number of groups instead of multiplying, resulting in 10.",
            source: "2021 STAAR Item 16 (3.4D), Option J"
          },
          {
            problem: "8 × 8 (8 squares per row, 8 rows on game board)",
            correctAnswer: 64,
            errorDescription: "Added 8 + 8 = 16 instead of multiplying",
            resultingValue: 16,
            rationale: "Added the two factors instead of multiplying, resulting in 16.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option C"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 2: Neighbor fact — recalled adjacent product
      // Appears in: 2019#20-G, 2021#16-G
      // NOTE: Labeled "common" despite only 2 examples because 3.4D
      // has only 3 total MC items — 2 of 3 (67%) is high coverage.
      // --------------------------------------------------------
      {
        id: "neighbor-fact",
        name: "Recalled a neighboring multiplication fact instead of the correct one",
        frequency: "common",
        appliesWhen: "multiplication problems where the student knows multiplication is needed but recalls the wrong fact",
        constructionRule: "The student recalls a×(b-1) or (a-1)×b instead of a×b, producing a product that is off by exactly one factor. To construct: decrease one factor by 1 and compute the product. For 6×9, the neighbor fact 5×9=45 is one factor-of-9 below the correct answer. Choose the decrement that produces the most plausible confusion — typically decreasing the factor that is harder to track (the number of groups rather than the group size).",
        diagnosticValue: "Reveals the student understands multiplication is required and attempts the right operation but has a specific gap in fact fluency. They confuse adjacent facts in the times table.",
        examples: [
          {
            problem: "6 × 9 (6 photographs per page, 9 pages)",
            correctAnswer: 54,
            errorDescription: "Recalled 5×9=45 instead of 6×9=54, confusing the number of photos per page",
            resultingValue: 45,
            rationale: "Confused 6×9 with the neighboring fact 5×9, resulting in 45.",
            source: "2019 STAAR Item 20 (3.4D), Option G"
          },
          {
            problem: "4 × 6 (4 outlets per panel, 6 panels)",
            correctAnswer: 24,
            errorDescription: "Recalled 4×5=20 instead of 4×6=24, confusing the number of panels",
            resultingValue: 20,
            rationale: "Confused 4×6 with the neighboring fact 4×5, resulting in 20.",
            source: "2021 STAAR Item 16 (3.4D), Option G"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 3: Miscounted groups from visual model (±1 group)
      // Appears in: 2019#20-F, 2021#16-F, 2024#11-A
      // UNIQUE TO 3.4D — does not appear in 3.4F.
      // This is the defining distractor for equal-groups problems
      // that include a visual model showing one example group.
      // --------------------------------------------------------
      {
        id: "miscount-groups-visual",
        name: "Miscounted the number of groups by ±1 due to the visual model",
        frequency: "common",
        appliesWhen: "equal-groups or array problems where a visual model shows one example group/row",
        constructionRule: "When a problem shows one group visually (e.g., 'One page of the album is shown') and asks for the total across N groups, the student multiplies by (N-1) instead of N, excluding the shown group from the count. Alternatively, the student may count one EXTRA group beyond the total. To construct: compute groupSize × (totalGroups ± 1). The resulting value differs from correct by exactly one group size. For undercounting (more common): groupSize × (totalGroups - 1). For overcounting: groupSize × (totalGroups + 1). STAAR tests this on EVERY 3.4D item that includes a visual.",
        diagnosticValue: "Reveals the student does not correctly interpret the relationship between the shown model and the total count stated in the problem. They may think '9 pages' means '9 additional pages beyond the one shown' rather than '9 pages total including the shown one.' Critical for problems with arrays or equal-groups models.",
        examples: [
          {
            problem: "6 × 9 (6 photos/page, one page shown, 9 pages total)",
            correctAnswer: 54,
            errorDescription: "Multiplied 6 by 8 (additional unseen pages) instead of 9 (total pages)",
            resultingValue: 48,
            rationale: "Multiplied by the number of additional pages (8) rather than the total number of pages (9), resulting in 48.",
            source: "2019 STAAR Item 20 (3.4D), Option F"
          },
          {
            problem: "4 × 6 (4 outlets/panel, one panel shown, 6 panels total)",
            correctAnswer: 24,
            errorDescription: "Skip-counted by 4 but counted 7 groups instead of 6, going one group beyond the total",
            resultingValue: 28,
            rationale: "Counted one extra group when skip-counting, computing 4×7 instead of 4×6, resulting in 28.",
            source: "2021 STAAR Item 16 (3.4D), Option F"
          },
          {
            problem: "8 × 8 (8 squares/row, one row shown, 8 rows total)",
            correctAnswer: 64,
            errorDescription: "Multiplied 7 × 8 = 56, using only the 7 additional rows not shown in the model",
            resultingValue: 56,
            rationale: "Multiplied by the number of additional rows (7) instead of the total number of rows (8), resulting in 56.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 4: Used one operand as answer
      // Appears in: 2024#11-B
      // --------------------------------------------------------
      {
        id: "operand-as-answer",
        name: "Reported the count of one group or one row without multiplying by the number of groups",
        frequency: "occasional",
        appliesWhen: "equal-groups or array problems, especially when a visual model shows one group",
        constructionRule: "The student counts the objects in the shown model (one group or one row) and reports that count as their answer without multiplying by the total number of groups. For a groups of b objects, the student reports b (the group size). To construct: use the group size as a distractor value. This tends to appear when the visual model prominently displays one group and the student latches onto what they can see. IMPORTANT: verify that the group size differs from the correct total — this is virtually always the case for arrays but worth checking.",
        diagnosticValue: "Reveals the student does not understand that the problem requires finding a TOTAL across multiple groups. They may be able to count objects in a model but cannot extend that count to multiple groups through multiplication.",
        examples: [
          {
            problem: "8 × 8 (8 squares per row, 8 rows, one row shown)",
            correctAnswer: 64,
            errorDescription: "Counted only the 8 squares shown in the model without multiplying by the number of rows",
            resultingValue: 8,
            rationale: "Counted only the objects in the shown model without multiplying by the number of groups, resulting in 8.",
            source: "2024 STAAR Item 11 (3.2.4.D), Option B"
          }
        ]
      }

    ] // end patterns array for 3.4D
  },

  // ============================================================
  // 3.4K — Solve one-step and two-step problems involving
  //         multiplication and division within 1,000
  //
  // TEKS format change: pre-2023 "3.4(K)" → 2023+ "3.2.4.K"
  //
  // HIGHEST-FREQUENCY TIER 1 TEKS ON STAAR (Readiness standard).
  // 8 MC items across 6 years:
  //   2019 Item 2  (3.4(K)):  (3+2)×8=40, "combine types then multiply", Answer=G
  //   2019 Item 26 (3.4(K)):  (3×10)÷6=5, "multiply then divide", Answer=J
  //   2021 Item 10 (3.4(K)):  (63−9)÷9=6, "subtract then divide", Answer=J
  //   2021 Item 31 (3.4(K)):  (4+3)×14=98, "combine types then multiply", Answer=C
  //   2022 Item 30 (3.4(K)):  (4+2)×12=72, "combine types then multiply", Answer=F
  //   2023 Item 15 (3.2.4.K): (11×7)−21=56, "multiply then subtract", Answer=B
  //   2024 Item 20 (3.2.4.K): 75÷15=5, "one-step division", Answer=C
  //   2025 Item 10 (3.2.4.K): (60÷3)÷4=5, "divide then divide", Answer=C
  // Also tested but non-MC (skipped):
  //   2022 Item 14 (griddable), 2025 Item 21 (equation editor)
  //
  // NOTE: Pattern 5 (chose-operand) overlaps with 3.4F's chose-operand
  // pattern. The overlap is intentional — 3.4K version applies to multi-step
  // division contexts while 3.4F version applies to single-step fact recall.
  //
  // KEY DISTINCTION: 3.4K is overwhelmingly TWO-STEP (7 of 8 MC
  // items). This creates distractor patterns that don't exist for
  // single-step TEKS: wrong grouping, skipped steps, wrong
  // operation on ONE of TWO steps, and "added everything."
  //
  // Total MC items analyzed: 8
  // Total distractor rationales read verbatim: 24
  // Total worked examples in this entry: 24
  // ============================================================
  "3.4K": {
    teks: "3.4K",
    description: "Solve one-step and two-step problems involving multiplication and division within 1,000",
    operations: ["MULTIPLY", "DIVIDE", "ADD", "SUBTRACT"],
    answerFormat: "integer",
    diagramTypes: [],
    hasMultiselect: false,

    patterns: [

      // --------------------------------------------------------
      // PATTERN 1: Added all visible numbers (no mult/div)
      // Appears in: 2021#31-A, 2022#30-J, 2023#15-D, 2024#20-A
      // Student ignores multiplication/division entirely and
      // defaults to adding every number in the problem.
      // --------------------------------------------------------
      {
        id: "added-all-numbers",
        name: "Added all numbers in the problem instead of using multiplication or division",
        frequency: "common",
        appliesWhen: "any one-step or two-step multiplication/division word problem",
        constructionRule: "The student adds every number visible in the problem. For a two-step problem with values a, b, and c, compute a+b+c. For a one-step problem a÷b or a×b, compute a+b. This produces a value on a completely different scale from the correct answer. STAAR includes this distractor on every 3.4K item that has 3+ numbers because it cleanly diagnoses whether the student recognizes multiplication/division is needed at all.",
        diagnosticValue: "Reveals the student cannot identify which operations a multi-step word problem requires. They may default to addition for any problem involving combining quantities. Needs explicit instruction connecting problem vocabulary to operations.",
        examples: [
          {
            problem: "(4+3) × 14 = 98 (14 games, 4 red balls + 3 green balls each time)",
            correctAnswer: 98,
            errorDescription: "Added all three numbers: 14 + 4 + 3 = 21",
            resultingValue: 21,
            rationale: "Added all numbers in the problem instead of using multiplication, resulting in 21.",
            source: "2021 STAAR Item 31 (3.4K), Option A"
          },
          {
            problem: "(4+2) × 12 = 72 (4 pink + 2 orange packages, 12 golf balls each)",
            correctAnswer: 72,
            errorDescription: "Added all three numbers: 4 + 2 + 12 = 18",
            resultingValue: 18,
            rationale: "Added all numbers in the problem instead of using multiplication, resulting in 18.",
            source: "2022 STAAR Item 30 (3.4K), Option J"
          },
          {
            problem: "(11×7) − 21 = 56 (11 cages, 7 birds per cage, 21 birds already in cages)",
            correctAnswer: 56,
            errorDescription: "Added all three numbers: 21 + 11 + 7 = 39",
            resultingValue: 39,
            rationale: "Added all numbers in the problem instead of using multiplication and subtraction, resulting in 39.",
            source: "2023 STAAR Item 15 (3.2.4.K), Option D"
          },
          {
            problem: "75 ÷ 15 = 5 (75 shirts, 15 per shelf)",
            correctAnswer: 5,
            errorDescription: "Added 75 + 15 = 90 instead of dividing",
            resultingValue: 90,
            rationale: "Added the two numbers instead of dividing, resulting in 90.",
            source: "2024 STAAR Item 20 (3.2.4.K), Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 2: Skipped a step (intermediate answer)
      // Appears in: 2021#10-G, 2025#10-A
      // Student correctly performs one step of a two-step
      // problem but submits the intermediate result.
      // --------------------------------------------------------
      {
        id: "skipped-step",
        name: "Completed only one step of a two-step problem and submitted the intermediate answer",
        frequency: "occasional",
        appliesWhen: "two-step problems — the student performs the more obvious or salient step and stops",
        constructionRule: "For a two-step problem that requires operations OP1 then OP2, the student performs only OP1 (or only OP2) and reports the result. Identify which step the student is most likely to skip: typically the FIRST step if it involves a less salient operation (like subtracting broken flowers before dividing) or if one step's numbers are more prominent. To construct: compute one step only. The resulting value is always a real intermediate quantity from the problem, which makes it highly plausible to a student who thinks they're done.",
        diagnosticValue: "Reveals the student can perform individual operations correctly but cannot plan and execute a multi-step solution. They may not re-read the problem to verify all conditions are addressed.",
        examples: [
          {
            problem: "(63−9) ÷ 9 = 6 (63 flowers, 9 broken, 9 vases)",
            correctAnswer: 6,
            errorDescription: "Divided all 63 by 9 to get 7, ignoring the 9 flowers that were thrown away first",
            resultingValue: 7,
            rationale: "Divided the total by the number of vases without first removing the broken flowers, resulting in 7.",
            source: "2021 STAAR Item 10 (3.4K), Option G"
          },
          {
            problem: "(60÷3) ÷ 4 = 5 (60 blocks shared among 3 people, then into 4 piles)",
            correctAnswer: 5,
            errorDescription: "Divided 60 by 4 only, skipping the first division by 3",
            resultingValue: 15,
            rationale: "Skipped the first step of dividing among 3 people and divided the total directly by 4, resulting in 15.",
            source: "2025 STAAR Item 10 (3.2.4.K), Option A"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 3: Wrong operation on one step
      // Appears in: 2019#26-H, 2021#10-H, 2021#10-F,
      //             2023#15-A, 2023#15-C, 2024#20-B, 2025#10-B
      // Student gets one step right but swaps the operation
      // on the other step (add↔subtract or multiply↔divide).
      // Most frequent single pattern across all 3.4K items.
      // --------------------------------------------------------
      {
        id: "wrong-op-one-step",
        name: "Applied the wrong operation on one step of the problem",
        frequency: "common",
        appliesWhen: "any multi-step problem or one-step division problem",
        constructionRule: "The student correctly identifies one step but swaps the operation on the other. Common swaps: (1) subtracted instead of dividing in a division step, (2) added instead of subtracting in a subtraction step, (3) subtracted instead of multiplying. For a two-step problem requiring OP1 then OP2, compute OP1 correctly but swap OP2 (e.g., subtract where you should divide). For one-step problems, swap the single operation. The result is always numerically plausible because one step IS correct. IMPORTANT: verify that the swapped operation produces an integer result — if it does not, choose a different operation swap.",
        diagnosticValue: "Reveals the student partially understands the problem structure but confuses specific operations. They may know 'something needs to be done with these numbers' but select the wrong operation. Different from Pattern 1 (added all) because the student IS attempting the right approach.",
        examples: [
          {
            problem: "(3×10) ÷ 6 = 5 (3 teams × 10 players, divided into 6 groups)",
            correctAnswer: 5,
            errorDescription: "Multiplied by 6 instead of dividing in step 2: 3×10×6 = 180",
            resultingValue: 180,
            rationale: "Multiplied by the divisor instead of dividing in step 2, resulting in 180.",
            source: "2019 STAAR Item 26 (3.4K), Option F"
          },
          {
            problem: "(3×10) ÷ 6 = 5 (3 teams × 10 players, divided into 6 groups)",
            correctAnswer: 5,
            errorDescription: "Step 1 correct (3×10=30), but subtracted instead of dividing: 30−6=24",
            resultingValue: 24,
            rationale: "Computed step 1 correctly but subtracted instead of dividing in step 2, resulting in 24.",
            source: "2019 STAAR Item 26 (3.4K), Option H"
          },
          {
            problem: "(63−9) ÷ 9 = 6 (63 flowers, throw away 9, divide into 9 vases)",
            correctAnswer: 6,
            errorDescription: "Performed operations in wrong order: divided first (63÷9=7), then subtracted (9−7=2)",
            resultingValue: 2,
            rationale: "Divided before subtracting and then subtracted the results, reversing the order of operations and resulting in 2.",
            source: "2021 STAAR Item 10 (3.4K), Option F"
          },
          {
            problem: "(63−9) ÷ 9 = 6 (63 flowers, throw away 9, divide into 9 vases)",
            correctAnswer: 6,
            errorDescription: "Added instead of subtracting in step 1: (63+9)÷9 = 72÷9 = 8",
            resultingValue: 8,
            rationale: "Added in step 1 instead of subtracting, then divided correctly in step 2, resulting in 8.",
            source: "2021 STAAR Item 10 (3.4K), Option H"
          },
          {
            problem: "(11×7) − 21 = 56 (11 cages × 7 capacity − 21 current birds)",
            correctAnswer: 56,
            errorDescription: "Multiplied correctly (11×7=77) but added instead of subtracting: 77+21=98",
            resultingValue: 98,
            rationale: "Computed step 1 correctly but added instead of subtracting in step 2, resulting in 98.",
            source: "2023 STAAR Item 15 (3.2.4.K), Option A"
          },
          // NOTE: Step 2 direction reversal (21−4 instead of 4−21) is a
          // forced consequence of the step 1 error, not a second independent
          // mistake. Once 11−7=4 produces a value smaller than 21, a student
          // naturally computes larger−smaller. This is one conceptual error
          // with a cascading consequence.
          {
            problem: "(11×7) − 21 = 56 (11 cages × 7 capacity − 21 current birds)",
            correctAnswer: 56,
            errorDescription: "Subtracted instead of multiplying in step 1 (11−7=4), then computed 21−4=17 since the small intermediate forced a direction reversal in step 2",
            resultingValue: 17,
            rationale: "Subtracted instead of multiplying in step 1, producing a small intermediate that reversed step 2, resulting in 17.",
            source: "2023 STAAR Item 15 (3.2.4.K), Option C"
          },
          {
            problem: "75 ÷ 15 = 5 (75 shirts, 15 per shelf)",
            correctAnswer: 5,
            errorDescription: "Subtracted instead of dividing: 75−15=60",
            resultingValue: 60,
            rationale: "Subtracted instead of dividing, resulting in 60.",
            source: "2024 STAAR Item 20 (3.2.4.K), Option B"
          },
          // NOTE: The "1" in this error comes from the student misreading
          // a problem-text detail ("15 shirts" mentioned in a second sentence)
          // as requiring an additional shelf. This is a text-ambiguity pattern
          // that only works when the problem contains a restatement of the
          // divisor in a way that could be misread as an extra item. Niche
          // but real — TEA documented the exact source of the extra shelf.
          {
            problem: "75 ÷ 15 = 5 (75 shirts, 15 per shelf — problem text also mentions '15 shirts' in a second sentence)",
            correctAnswer: 5,
            errorDescription: "Divided correctly (75÷15=5) but misread a restatement of '15 shirts' in the problem text as requiring 1 additional shelf: 5+1=6",
            resultingValue: 6,
            rationale: "Divided correctly but misinterpreted a problem-text detail as an additional shelf, resulting in 6.",
            source: "2024 STAAR Item 20 (3.2.4.K), Option D"
          },
          {
            problem: "(60÷3) ÷ 4 = 5 (60 blocks ÷ 3 people ÷ 4 piles)",
            correctAnswer: 5,
            errorDescription: "Step 1 correct (60÷3=20), but subtracted instead of dividing: 20−4=16",
            resultingValue: 16,
            rationale: "Computed step 1 correctly but subtracted instead of dividing in step 2, resulting in 16.",
            source: "2025 STAAR Item 10 (3.2.4.K), Option B"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 4: Wrong grouping (combined wrong numbers)
      // Appears in: 2019#2-F, 2019#2-H, 2019#2-J,
      //             2021#31-B, 2021#31-D, 2022#30-G, 2022#30-H
      // Student uses correct operations but applies them to
      // wrong combinations of numbers. UNIQUE to two-step
      // problems with 3+ quantities.
      // --------------------------------------------------------
      {
        id: "wrong-grouping",
        name: "Applied operations to wrong combinations of numbers in a multi-step problem",
        frequency: "common",
        appliesWhen: "two-step problems with three or more quantities, especially 'combine two types then multiply' structure",
        constructionRule: "The student correctly identifies that multiplication is needed but applies it to the wrong pair of numbers. Common sub-variants: (a) Multiplied by only one part instead of the combined total — e.g., for (a+b)×c, computed a×c then added b. (b) Multiplied the parts together instead of adding them — e.g., for (a+b)×c, computed (a×b)×c. (c) Applied a wrong operation to the intermediate result — e.g., for (a+b)×c, computed a×c÷b. To construct: identify the three quantities and try different pairings with multiplication. Each wrong pairing produces a different distractor value.",
        diagnosticValue: "Reveals the student has difficulty determining which quantities to combine at each step. They understand multiplication but cannot correctly set up the multi-step structure. This is a higher-level error than wrong operation — the student knows the right operations but applies them to wrong numbers.",
        examples: [
          {
            problem: "(3+2) × 8 = 40 (3 mint + 2 bubble gum packages, 8 pieces each)",
            correctAnswer: 40,
            errorDescription: "Multiplied only one type: 3×8=24, then added the other package count: 24+2=26",
            resultingValue: 26,
            rationale: "Multiplied by only one type of package and added the other count, resulting in 26.",
            source: "2019 STAAR Item 2 (3.4K), Option F"
          },
          {
            problem: "(3+2) × 8 = 40 (3 mint + 2 bubble gum packages, 8 pieces each)",
            correctAnswer: 40,
            errorDescription: "Multiplied package counts together instead of adding: (3×2)×8 = 6×8 = 48",
            resultingValue: 48,
            rationale: "Multiplied the package counts together instead of adding, then multiplied by pieces per package, resulting in 48.",
            source: "2019 STAAR Item 2 (3.4K), Option J"
          },
          {
            problem: "(3+2) × 8 = 40 (3 mint + 2 bubble gum packages, 8 pieces each)",
            correctAnswer: 40,
            errorDescription: "Multiplied one type correctly (3×8=24) then divided by other count: 24÷2=12",
            resultingValue: 12,
            rationale: "Multiplied one package type by pieces then divided by the other package count, resulting in 12.",
            source: "2019 STAAR Item 2 (3.4K), Option H"
          },
          {
            problem: "(4+3) × 14 = 98 (14 games, 4 red + 3 green balls each time)",
            correctAnswer: 98,
            errorDescription: "Combined wrong numbers: (14+3)×4 = 17×4 = 68",
            resultingValue: 68,
            rationale: "Added games to one ball type and multiplied by the other ball type, resulting in 68.",
            source: "2021 STAAR Item 31 (3.4K), Option B"
          },
          {
            problem: "(4+3) × 14 = 98 (14 games, 4 red + 3 green balls each time)",
            correctAnswer: 98,
            errorDescription: "Multiplied by only one ball type then added the other: 14×3=42, 42+4=46",
            resultingValue: 46,
            rationale: "Multiplied by only one ball type count and added the other, resulting in 46.",
            source: "2021 STAAR Item 31 (3.4K), Option D"
          },
          {
            problem: "(4+2) × 12 = 72 (4 pink + 2 orange packages, 12 balls each)",
            correctAnswer: 72,
            errorDescription: "Multiplied by only one package type then added the count: 12×4=48, 48+2=50",
            resultingValue: 50,
            rationale: "Multiplied by only one package type and then added the other package count, resulting in 50.",
            source: "2022 STAAR Item 30 (3.4K), Option G"
          },
          {
            problem: "(4+2) × 12 = 72 (4 pink + 2 orange packages, 12 balls each)",
            correctAnswer: 72,
            errorDescription: "Multiplied package counts together instead of adding: (4×2)×12 = 8×12 = 96",
            resultingValue: 96,
            rationale: "Multiplied the package counts together instead of adding them, resulting in 96.",
            source: "2022 STAAR Item 30 (3.4K), Option H"
          }
        ]
      },

      // --------------------------------------------------------
      // PATTERN 5: Chose an operand as the answer
      // Appears in: 2019#26-G, 2025#10-D
      // Student reports a number from the problem (typically
      // the divisor) instead of computing the quotient.
      // --------------------------------------------------------
      {
        id: "chose-operand",
        name: "Reported a number from the problem as the answer instead of computing",
        frequency: "occasional",
        appliesWhen: "division problems, especially when the divisor and quotient are close in value",
        constructionRule: "The student reports the divisor, a factor, or another number stated in the problem as their final answer. For a÷b=q, the student reports b instead of q. This is especially likely when b and q are close (e.g., 30÷6=5, student reports 6). To construct: use the divisor or another salient number from the problem as a distractor value. IMPORTANT: verify that the chosen operand value differs from the correct answer — if divisor = quotient, use a different problem number instead.",
        diagnosticValue: "Reveals the student may not understand what the division operation produces, or confuses the roles of divisor and quotient in a division equation.",
        examples: [
          {
            problem: "(3×10) ÷ 6 = 5 (30 players divided into 6 groups)",
            correctAnswer: 5,
            errorDescription: "Reported the divisor 6 as the answer, likely confusing it with the quotient since 30÷6 yields a value close to 6",
            resultingValue: 6,
            rationale: "Confused the divisor with the quotient instead of computing the division, resulting in 6.",
            source: "2019 STAAR Item 26 (3.4K), Option G"
          },
          {
            problem: "(60÷3) ÷ 4 = 5 (60 blocks, 3 people, 4 piles each)",
            correctAnswer: 5,
            errorDescription: "Reported the number of piles (4) instead of computing the blocks per pile",
            resultingValue: 4,
            rationale: "Confused the number of piles with the number of blocks in each pile, resulting in 4.",
            source: "2025 STAAR Item 10 (3.2.4.K), Option D"
          }
        ]
      }

    ] // end patterns array for 3.4K
  }

}; // end DISTRACTOR_PATTERNS


// ============================================================
// INJECTION FUNCTIONS
// ============================================================

/**
 * Given an array of selected TEKS codes, returns distractor pattern
 * guides for injection into the MC system prompt.
 * Unlike selectExemplars(), this has NO budget cap — all patterns
 * for all selected TEKS are returned.
 */
function selectDistractorPatterns(selectedTeks) {
  // Deduplicate TEKS codes to prevent redundant injection
  var unique = selectedTeks.filter(function(t, i) { return selectedTeks.indexOf(t) === i; });
  return unique
    .map(function(teks) { return DISTRACTOR_PATTERNS[teks]; })
    .filter(Boolean)
    .map(toDistractorInjectionFormat);
}

/**
 * Strips storage-only fields, keeping only what the LLM needs.
 * Mirrors the exemplar bank's toInjectionFormat() convention.
 *
 * Stripped fields:
 *   TEKS level: description, operations, answerFormat, diagramTypes, hasMultiselect
 *   Pattern level: id
 *   Example level: source
 */
function toDistractorInjectionFormat(entry) {
  return {
    teks: entry.teks,
    patterns: entry.patterns.map(function(p) {
      return {
        name: p.name,
        frequency: p.frequency,
        appliesWhen: p.appliesWhen,
        constructionRule: p.constructionRule,
        diagnosticValue: p.diagnosticValue,
        examples: p.examples.map(function(e) {
          return {
            problem: e.problem,
            correctAnswer: e.correctAnswer,
            errorDescription: e.errorDescription,
            resultingValue: e.resultingValue,
            rationale: e.rationale
          };
        })
      };
    })
  };
}


// ============================================================
// BROWSER + NODE EXPORT
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DISTRACTOR_PATTERNS,
    UNIVERSAL_DISTRACTOR_RULES,
    DISTRACTOR_RULES_REMINDER,
    selectDistractorPatterns,
    toDistractorInjectionFormat
  };
}
