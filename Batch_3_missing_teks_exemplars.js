/**
 * STAAR Problem Exemplar Bank -- Grade 3 Math
 * Batch 3: Missing TEKS (Synthetic)
 * ============================================
 * This file contains 3 author-drafted exemplar problems for
 * TEKS that were NEVER tested on released STAAR exams (2019--2025).
 *
 * SCOPE: 3 Missing TEKS: 3.3A, 3.9C, 3.9F
 *
 * PURPOSE: Ensures the Groq/Llama LLM has at least one exemplar
 * for every Grade 3 Math TEKS. Without these, the system would
 * have no few-shot patterns to guide generation for these 3 standards.
 *
 * SOURCE: These items are NOT extracted from official STAAR tests.
 * They are synthetic (author-drafted) items modeled after the style,
 * difficulty, and distractor patterns of real STAAR items from
 * neighboring TEKS. They were reviewed and approved by a former
 * Grade 5 math/science teacher with STAAR administration experience.
 *
 * Combined with Batch 1 (Readiness, 65 items) and Batch 2
 * (Supporting, 67 items), this gives the system 135 total exemplars
 * covering all 46 Grade 3 Math TEKS (100% coverage).
 *
 * EXTRACTION STATUS:
 *   Batch 1 (Readiness): COMPLETE -- 65 items, 13 TEKS
 *   Batch 2 (Supporting): COMPLETE -- 67 items, 30 TEKS
 *   Batch 3 (Missing TEKS): COMPLETE -- 3 items, 3 TEKS
 *
 * SCHEMA: Same 21-field Storage Schema as Batches 1 and 2.
 *   source field is "synthetic" (not "STAAR") to distinguish these.
 *   year field is 2026 (creation year, not a test administration year).
 *
 * TEKS FORMAT: Canonical "X.YZ" format (e.g., "3.3A")
 *
 * OPERATION CODES: Same 12-code vocabulary as Batches 1 and 2.
 *
 * STRAND MAPPING (deterministic from TEKS prefix):
 *   3.3x -> "Number and Operations"
 *   3.9x -> "Personal Financial Literacy"
 */

const BATCH3_MISSING_TEKS_EXEMPLARS = [

  // ============================================================
  // Synthetic Exemplars -- Grade 3 Math (Missing TEKS)
  // Source: Author-drafted, modeled after STAAR item patterns
  //         from neighboring TEKS (3.3B-H, 3.9A-E)
  // Reviewed: Teacher-approved February 2026
  // ============================================================

  {
    // --- IDENTIFICATION ---
    teks: "3.3A",
    source: "synthetic",
    year: 2026,
    itemNumber: 1,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // 3.3A: "represent fractions greater than zero and less than or
    // equal to one with denominators of 2, 3, 4, 6, and 8 using
    // concrete objects and pictorial models, including strip diagrams
    // and number lines"
    //
    // Design rationale: Uses a strip diagram (explicitly named in
    // the TEKS) with denominator 8 (from the approved list). The
    // fraction 3/8 is far enough from 0 and 1 that students must
    // genuinely count parts rather than estimating "almost none"
    // or "almost all." Distractors target the three most common
    // 3rd-grade fraction misconceptions: counting the wrong region,
    // reversing numerator/denominator, and confusing part-to-part
    // ratios with part-to-whole fractions.
    questionStem: "A strip diagram is shown. The strip is divided into 8 equal parts. 3 of the parts are shaded.\n\nWhich fraction does the shaded part of the strip diagram represent?",
    answerType: "multipleChoice",
    correctAnswer: "C",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "5/8" },
      { letter: "B", text: "8/3" },
      { letter: "C", text: "3/8" },
      { letter: "D", text: "3/5" }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Counted the unshaded parts (5) instead of the shaded parts (3) as the numerator. Understands that the denominator is the total number of parts (8) but identified the wrong region of the model. Needs to focus on which parts the question asks about.",
      B: "Reversed the numerator and denominator -- placed the total number of parts (8) over the shaded parts (3). Needs to understand that the denominator represents the total equal parts in the whole and the numerator represents the parts being described.",
      D: "Used the number of shaded parts (3) over the number of unshaded parts (5) instead of over the total parts (8). Created a part-to-part ratio rather than a part-to-whole fraction. Needs to understand that fractions represent parts of the WHOLE, not parts compared to other parts."
    },

    // --- SELECTION METADATA ---
    operation: "REPRESENT",
    strand: "Number and Operations",
    readinessOrSupporting: "Supporting",
    reportingCategory: 1,
    problemType: "Fraction Representation",
    stepCount: 1,
    hasVisual: true,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "ONLY item for TEKS 3.3A in the entire exemplar bank -- critical for 100% TEKS coverage. Tests the most fundamental fraction skill: reading a shaded strip diagram and identifying the fraction it represents. The 3/8 value (denominator 8, from the TEKS-approved list) requires genuine counting rather than estimation. Each distractor targets a distinct, well-documented fraction misconception: counting the wrong region (A), reversing numerator and denominator (B), and confusing part-to-part ratios with part-to-whole fractions (D). Modeled after the strip diagram and number line patterns in 3.3B (2025#3) and 3.3C (2019#17)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9C",
    source: "synthetic",
    year: 2026,
    itemNumber: 2,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // 3.9C: "identify the costs and benefits of planned and
    // unplanned spending decisions"
    //
    // Design rationale: Presents a clear PLANNED spending scenario
    // (saving allowance over 3 weeks) and asks students to identify
    // a BENEFIT. The key design challenge was making distractors that
    // are real consequences of the scenario (not nonsense) but are
    // COSTS rather than BENEFITS. This tests the cost/benefit
    // distinction, which is the core skill of 3.9C. Modeled after
    // the scenario-based structure of 3.9D items (2024#24, 2025#22).
    questionStem: "Nina wanted to buy a new backpack for school. She saved part of her allowance for 3 weeks until she had enough money. Which is a benefit of Nina's planned spending decision?",
    answerType: "multipleChoice",
    correctAnswer: "B",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Nina had to wait 3 weeks to buy the backpack." },
      { letter: "B", text: "Nina was able to buy the backpack without borrowing money." },
      { letter: "C", text: "Nina could not spend her allowance on other things while she was saving." },
      { letter: "D", text: "Nina's backpack cost more than she expected." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Identified a true consequence of planned spending but confused a cost with a benefit. Having to wait is a cost of planned spending (delayed gratification), not a benefit. Needs to understand the difference between costs (trade-offs, sacrifices) and benefits (positive outcomes) of financial decisions.",
      C: "Identified another true consequence of planned spending but confused a cost with a benefit. Not being able to spend money on other things while saving is an opportunity cost, not a benefit. Needs to distinguish positive outcomes (benefits) from trade-offs (costs) in planned spending.",
      D: "Described an unplanned spending situation rather than a benefit of planned spending. An unexpected higher cost is the kind of problem that planned spending helps avoid. Needs to distinguish between planned and unplanned spending scenarios and identify what makes planned spending beneficial."
    },

    // --- SELECTION METADATA ---
    operation: "CONCEPTUAL",
    strand: "Personal Financial Literacy",
    readinessOrSupporting: "Supporting",
    reportingCategory: 4,
    problemType: "Financial Literacy",
    stepCount: 1,
    hasVisual: false,
    staarItemType: "MultipleChoice",

    // --- QUALITY ANNOTATION ---
    whyThisIsGood: "ONLY item for TEKS 3.9C in the entire exemplar bank -- critical for 100% TEKS coverage. Tests the cost-vs-benefit distinction within planned spending, which is the core skill unique to 3.9C. The scenario is age-appropriate (saving allowance for a backpack) and follows the text-only, zero-computation pattern established by all other 3.9x items. Three of the four options describe real consequences of the scenario, but only one is a benefit -- this forces conceptual reasoning rather than elimination. Distractor D introduces the planned-vs-unplanned distinction as an additional layer. Modeled after the scenario-based structure of 3.9D (2024#24) and 3.9E (2023#5)."
  },

  {
    // --- IDENTIFICATION ---
    teks: "3.9F",
    source: "synthetic",
    year: 2026,
    itemNumber: 3,
    grade: 3,
    subject: "math",

    // --- PROBLEM CONTENT ---
    // 3.9F: "identify decisions involving income, spending, saving,
    // credit, and charitable giving"
    //
    // Design rationale: Targets CHARITABLE GIVING since the other
    // four categories are well-covered by neighboring TEKS (3.9A
    // covers income, 3.9B covers spending/scarcity, 3.9D covers
    // credit, 3.9E covers saving). Each option describes a different
    // person making a different type of financial decision, and the
    // student must identify which one is charitable giving. This
    // mirrors the exact structure of the two 3.9D items (2024#24:
    // "Which statement is an example of using credit?" with four
    // person-scenario options). Distractors cover income, credit,
    // and saving -- the three categories most commonly confused
    // with charitable giving at the 3rd-grade level.
    questionStem: "Which situation is an example of charitable giving?",
    answerType: "multipleChoice",
    correctAnswer: "D",
    correctAnswerValue: null,
    options: [
      { letter: "A", text: "Marcus deposits $10 from his birthday into his savings account." },
      { letter: "B", text: "Sophie borrows $5 from her friend to buy lunch." },
      { letter: "C", text: "Javier earns $15 by walking dogs in his neighborhood." },
      { letter: "D", text: "Kenji donates $8 to help buy supplies for an animal shelter." }
    ],

    // --- DISTRACTOR RATIONALES ---
    distractorRationales: {
      A: "Identified a financial decision involving saving, not charitable giving. Depositing money into a savings account means keeping money for future use, which is the opposite of giving it away. Needs to distinguish between saving (setting money aside for yourself) and charitable giving (donating money to help others).",
      B: "Identified a financial decision involving credit, not charitable giving. Borrowing money from someone with an expectation to pay it back is using credit. Needs to understand that charitable giving means donating without expecting anything in return, while credit involves a repayment obligation.",
      C: "Identified a financial decision involving income, not charitable giving. Earning money through labor (walking dogs) is generating income. Needs to distinguish between receiving money for work (income) and giving money away to help others (charitable giving)."
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
    whyThisIsGood: "ONLY item for TEKS 3.9F in the entire exemplar bank -- critical for 100% TEKS coverage. Targets charitable giving specifically because the other four financial categories (income, spending, saving, credit) are already well-covered by neighboring TEKS items. Uses the exact same structure as the two 3.9D credit items (2024#24, 2025#22): short question stem asking to identify a category, with four person-scenario options each representing a different financial decision type. Each distractor cleanly represents one of the other financial categories (saving, credit, income), making this a pure categorization task with no ambiguity. Age-appropriate scenarios with relatable dollar amounts for 3rd graders."
  },

];

// Export for use in the combined exemplar bank
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BATCH3_MISSING_TEKS_EXEMPLARS };
}
