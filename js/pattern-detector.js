/**
 * IRON MAN STEM MISSION - MATH ERROR PATTERN DETECTION SYSTEM
 * 
 * This module analyzes student math errors to provide intelligent, targeted hints.
 * Based on 40+ years of cognitive science research (Brown & Burton BUGGY system,
 * VanLehn's Repair Theory, Ashlock's Error Patterns in Computation).
 * 
 * Key insight: ~90% of student math errors follow identifiable patterns representing
 * "correct execution of incorrect procedures" - NOT random mistakes.
 * 
 * Usage:
 *   const result = detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel);
 *   if (result.pattern) {
 *     playHint(result.hintId); // Maps to response bank hint IDs
 *   }
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Minimum confidence to trigger a specific hint (vs generic hint)
  CONFIDENCE_THRESHOLD: 0.80,
  
  // Below this, classify as UNKNOWN
  MINIMUM_CONFIDENCE: 0.60,
  
  // Population base rates for common bugs (from research)
  BUG_PREVALENCE: {
    'SMALLER_FROM_LARGER': 0.15,
    'FORGOT_TO_CARRY': 0.12,
    'FORGOT_TO_BORROW': 0.10,
    'ADD_BOTH_NUM_AND_DEN': 0.20,
    'BORROW_NO_DECREMENT': 0.10,
    'WRONG_OPERATION': 0.08,
    'OFF_BY_ONE': 0.05,
    'OFF_BY_TEN': 0.07,
    'DIGIT_TRANSPOSITION': 0.06
  }
};

// ============================================================================
// HINT ID MAPPING (Links to response_bank.md)
// ============================================================================

/**
 * Maps detected error patterns to response bank hint IDs.
 * Each pattern has multiple hint variations to avoid repetition.
 */
const HINT_MAPPING = {
  // Basic proximity errors
  'OFF_BY_ONE': ['HINT-PAT-01', 'HINT-PAT-02'],
  'OFF_BY_TEN': ['HINT-PAT-03', 'HINT-PAT-04'],
  'OFF_BY_HUNDRED': ['HINT-PAT-05'],
  
  // Digit errors
  'DIGIT_TRANSPOSITION': ['HINT-PAT-06', 'HINT-PAT-07'],
  
  // Addition errors
  'FORGOT_TO_CARRY': ['HINT-PAT-08', 'HINT-PAT-09'],
  'RECORDED_BOTH_DIGITS': ['HINT-PAT-08', 'HINT-PAT-09'], // Similar hint applies
  
  // Subtraction errors  
  'FORGOT_TO_BORROW': ['HINT-PAT-10'],
  'SMALLER_FROM_LARGER': ['HINT-PAT-10'], // Conceptually similar - regrouping issue
  'BORROW_NO_DECREMENT': ['HINT-PAT-10'],
  'STOP_BORROW_AT_ZERO': ['HINT-PAT-10'],
  
  // Wrong operation errors
  'WRONG_OPERATION_ADD_SUB': ['HINT-PAT-11'],
  'WRONG_OPERATION_MULT_ADD': ['HINT-PAT-12'],
  'MULTIPLIED_INSTEAD_OF_ADDED': ['HINT-PAT-13'],
  'ADDED_INSTEAD_OF_SUBTRACTED': ['HINT-PAT-19'],
  'DIVIDED_INSTEAD_OF_MULTIPLIED': ['HINT-PAT-20'],
  
  // Multiplication errors
  'OFF_BY_ONE_GROUP': ['HINT-PAT-14'],
  'MULTIPLICATION_TABLE_ERROR': ['HINT-PAT-14'],
  
  // Decimal errors
  'DECIMAL_PLACE_ERROR': ['HINT-PAT-15', 'HINT-PAT-16'],
  'DECIMAL_IGNORED': ['HINT-PAT-15', 'HINT-PAT-16'],
  'LONGER_IS_LARGER': ['HINT-PAT-15', 'HINT-PAT-16'],
  
  // Fraction errors
  'ADD_BOTH_NUM_AND_DEN': ['HINT-PAT-17'],
  'LCD_WITHOUT_ADJUSTMENT': ['HINT-PAT-17'],
  'FRACTION_NOT_SIMPLIFIED': ['HINT-PAT-18'],
  
  // Unknown - use generic hints
  'UNKNOWN': ['HINT-GEN-01', 'HINT-GEN-02', 'HINT-GEN-03', 'HINT-GEN-04', 'HINT-GEN-05',
              'HINT-GEN-06', 'HINT-GEN-07', 'HINT-GEN-08', 'HINT-GEN-09', 'HINT-GEN-10',
              'HINT-GEN-11', 'HINT-GEN-12', 'HINT-GEN-13', 'HINT-GEN-14', 'HINT-GEN-15']
};

// Black Widow hint mapping (for when she appears)
const WIDOW_HINT_MAPPING = {
  'OFF_BY_ONE': ['WIDOW-HINT-01', 'WIDOW-HINT-02'],
  'OFF_BY_TEN': ['WIDOW-HINT-03', 'WIDOW-HINT-04'],
  'OFF_BY_HUNDRED': ['WIDOW-HINT-05'],
  'DIGIT_TRANSPOSITION': ['WIDOW-HINT-06', 'WIDOW-HINT-07'],
  'FORGOT_TO_CARRY': ['WIDOW-HINT-08'],
  'FORGOT_TO_BORROW': ['WIDOW-HINT-09'],
  'WRONG_OPERATION': ['WIDOW-HINT-10', 'WIDOW-HINT-11'],
  'DECIMAL_PLACE_ERROR': ['WIDOW-HINT-12', 'WIDOW-HINT-13'],
  'ADD_BOTH_NUM_AND_DEN': ['WIDOW-HINT-14'],
  'FRACTION_NOT_SIMPLIFIED': ['WIDOW-HINT-15'],
  'OFF_BY_ONE_GROUP': ['WIDOW-HINT-16'],
  'UNKNOWN': ['WIDOW-HINT-GEN-01', 'WIDOW-HINT-GEN-02', 'WIDOW-HINT-GEN-03',
              'WIDOW-HINT-GEN-04', 'WIDOW-HINT-GEN-05', 'WIDOW-HINT-GEN-06',
              'WIDOW-HINT-GEN-07', 'WIDOW-HINT-GEN-08']
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Greatest Common Divisor (for fraction simplification detection)
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Least Common Multiple (for fraction operations)
 */
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Pads a number string to match a target length
 */
function padNumber(numStr, length) {
  return numStr.padStart(length, '0');
}

/**
 * Checks if a number has a decimal component
 */
function hasDecimal(num) {
  return num !== Math.floor(num);
}

/**
 * Extracts digits from a number (ignoring decimal point)
 */
function getDigits(num) {
  return String(num).replace(/[.-]/g, '').split('').map(Number);
}

/**
 * Randomly selects from an array
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// CORE DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects addition carrying errors
 * 
 * Common bugs:
 * - FORGOT_TO_CARRY: 47 + 28 = 65 (should be 75)
 * - RECORDED_BOTH_DIGITS: 36 + 86 = 1112 (wrote 11 and 12 instead of carrying)
 */
function detectAdditionErrors(num1, num2, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Normalize to strings of equal length
  const maxLen = Math.max(String(num1).length, String(num2).length);
  const s1 = padNumber(String(num1), maxLen);
  const s2 = padNumber(String(num2), maxLen);
  
  // Test: Forgot to carry
  // Compute what answer would be if student added each column but never carried
  let noCarryResult = '';
  for (let i = maxLen - 1; i >= 0; i--) {
    const colSum = parseInt(s1[i]) + parseInt(s2[i]);
    noCarryResult = (colSum % 10) + noCarryResult;
  }
  
  if (studentAnswer === parseInt(noCarryResult)) {
    errors.push({
      pattern: 'FORGOT_TO_CARRY',
      confidence: 0.95,
      category: 'PROCEDURAL',
      explanation: 'Student added columns correctly but forgot to carry tens to next column'
    });
  }
  
  // Test: Recorded both digits (concatenated column sums)
  // 36 + 86: student writes 11 (for 3+8) and 12 (for 6+6) = 1112
  let bothDigitsResult = '';
  for (let i = 0; i < maxLen; i++) {
    bothDigitsResult += (parseInt(s1[i]) + parseInt(s2[i]));
  }
  
  if (studentAnswer === parseInt(bothDigitsResult)) {
    errors.push({
      pattern: 'RECORDED_BOTH_DIGITS',
      confidence: 0.95,
      category: 'PROCEDURAL',
      explanation: 'Student wrote both digits of each column sum instead of carrying'
    });
  }
  
  // Test: Off by exactly 10 (carried but added carry in wrong place)
  if (Math.abs(studentAnswer - correctAnswer) === 10) {
    errors.push({
      pattern: 'OFF_BY_TEN',
      confidence: 0.85,
      category: 'PROCEDURAL',
      explanation: 'Answer is off by 10 - possible carrying placement error'
    });
  }
  
  return errors;
}

/**
 * Detects subtraction borrowing errors
 * 
 * Common bugs:
 * - SMALLER_FROM_LARGER: 52 - 37 = 25 (student does 5-3=2, 7-2=5)
 * - FORGOT_TO_BORROW: Didn't add 10 when needed
 * - BORROW_NO_DECREMENT: Borrowed but didn't reduce the lending column
 * - STOP_BORROW_AT_ZERO: Can't borrow from 0, gives up
 */
function detectSubtractionErrors(minuend, subtrahend, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Convert to digit arrays
  const m = String(minuend).split('').map(Number);
  const s = padNumber(String(subtrahend), m.length).split('').map(Number);
  
  // Test: Smaller-from-larger (SFL) bug
  // Student subtracts smaller digit from larger regardless of position
  // This is the most common subtraction bug (31% of struggling students)
  let sflResult = '';
  for (let i = 0; i < m.length; i++) {
    sflResult += Math.abs(m[i] - s[i]);
  }
  
  if (studentAnswer === parseInt(sflResult)) {
    errors.push({
      pattern: 'SMALLER_FROM_LARGER',
      confidence: 0.95,
      category: 'PROCEDURAL',
      explanation: 'Student subtracted smaller digit from larger in each column regardless of position'
    });
  }
  
  // Test: Borrow-no-decrement
  // Student borrows (adds 10 to column) but doesn't decrement the column borrowed from
  let bndResult = simulateBorrowNoDecrement(minuend, subtrahend);
  if (studentAnswer === bndResult) {
    errors.push({
      pattern: 'BORROW_NO_DECREMENT',
      confidence: 0.90,
      category: 'PROCEDURAL',
      explanation: 'Student borrowed but forgot to reduce the column borrowed from'
    });
  }
  
  // Test: Stop-borrow-at-zero
  // When encountering 0, student doesn't know how to borrow across it
  if (String(minuend).includes('0')) {
    let sbzResult = simulateStopBorrowAtZero(minuend, subtrahend);
    if (studentAnswer === sbzResult) {
      errors.push({
        pattern: 'STOP_BORROW_AT_ZERO',
        confidence: 0.90,
        category: 'PROCEDURAL',
        explanation: 'Student couldn\'t borrow across zero'
      });
    }
  }
  
  // Test: Off by 10 (borrowing error in one column)
  if (Math.abs(studentAnswer - correctAnswer) === 10) {
    errors.push({
      pattern: 'OFF_BY_TEN',
      confidence: 0.85,
      category: 'PROCEDURAL',
      explanation: 'Answer is off by 10 - likely a single borrowing error'
    });
  }
  
  // Test: Forgot to borrow entirely
  // Check if answer is what you'd get by subtracting without borrowing (where possible)
  // and putting 0 or skipping where you can't
  let noBorrowResult = '';
  for (let i = 0; i < m.length; i++) {
    if (m[i] >= s[i]) {
      noBorrowResult += (m[i] - s[i]);
    } else {
      // Various buggy behaviors when can't subtract
      noBorrowResult += 0; // One common bug: just write 0
    }
  }
  
  if (studentAnswer === parseInt(noBorrowResult)) {
    errors.push({
      pattern: 'FORGOT_TO_BORROW',
      confidence: 0.85,
      category: 'PROCEDURAL',
      explanation: 'Student didn\'t borrow when subtraction required it'
    });
  }
  
  return errors;
}

/**
 * Simulates borrow-no-decrement bug
 * Student borrows (adds 10) but doesn't reduce the column borrowed from
 */
function simulateBorrowNoDecrement(minuend, subtrahend) {
  const m = String(minuend).split('').map(Number);
  const s = padNumber(String(subtrahend), m.length).split('').map(Number);
  let result = '';
  
  for (let i = m.length - 1; i >= 0; i--) {
    let topDigit = m[i];
    const bottomDigit = s[i];
    
    if (topDigit < bottomDigit && i > 0) {
      // Student borrows (adds 10) but doesn't decrement
      topDigit += 10;
    }
    
    if (topDigit >= bottomDigit) {
      result = (topDigit - bottomDigit) + result;
    } else {
      result = '0' + result; // Can't subtract, just put 0
    }
  }
  
  return parseInt(result) || 0;
}

/**
 * Simulates stop-borrow-at-zero bug
 * When student needs to borrow from a 0, they give up or use 0
 */
function simulateStopBorrowAtZero(minuend, subtrahend) {
  const m = String(minuend).split('').map(Number);
  const s = padNumber(String(subtrahend), m.length).split('').map(Number);
  let result = '';
  
  for (let i = m.length - 1; i >= 0; i--) {
    let topDigit = m[i];
    const bottomDigit = s[i];
    
    if (topDigit < bottomDigit) {
      // Need to borrow
      if (i > 0 && m[i-1] !== 0) {
        topDigit += 10;
        m[i-1]--; // Decrement
      } else {
        // Can't borrow (next digit is 0 or doesn't exist)
        // Bug: student just subtracts smaller from larger
        result = Math.abs(topDigit - bottomDigit) + result;
        continue;
      }
    }
    
    result = (topDigit - bottomDigit) + result;
  }
  
  return parseInt(result) || 0;
}

/**
 * Detects multiplication errors
 * 
 * Common bugs:
 * - MULTIPLICATION_TABLE_ERROR: Basic fact wrong (7×8=54)
 * - OFF_BY_ONE_GROUP: Added/subtracted one multiplicand
 * - FORGOT_TO_CARRY_MULT: Didn't carry in multi-digit multiplication
 */
function detectMultiplicationErrors(num1, num2, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Test: Off by one group (added or subtracted one multiplicand)
  // e.g., 7 × 8 = 48 (one group of 8 short) or = 64 (one group extra)
  if (studentAnswer === correctAnswer - num1 || studentAnswer === correctAnswer - num2) {
    errors.push({
      pattern: 'OFF_BY_ONE_GROUP',
      confidence: 0.90,
      category: 'PROCEDURAL',
      explanation: 'Student is one group short - may have miscounted'
    });
  }
  
  if (studentAnswer === correctAnswer + num1 || studentAnswer === correctAnswer + num2) {
    errors.push({
      pattern: 'OFF_BY_ONE_GROUP',
      confidence: 0.90,
      category: 'PROCEDURAL',
      explanation: 'Student has one extra group - may have miscounted'
    });
  }
  
  // Test: Common multiplication table errors
  // These are fact retrieval errors, not procedural
  const commonErrors = {
    // 7s and 8s are notoriously difficult
    56: [54, 48, 63], // 7×8: common wrong answers
    48: [42, 54, 56], // 6×8
    42: [48, 36, 49], // 6×7
    36: [42, 32, 35], // 6×6
    49: [42, 56, 45], // 7×7
    64: [56, 72, 63], // 8×8
    72: [64, 63, 81], // 8×9
    81: [72, 63, 79], // 9×9
    54: [56, 45, 63], // 6×9
    63: [54, 72, 56], // 7×9
  };
  
  if (commonErrors[correctAnswer] && commonErrors[correctAnswer].includes(studentAnswer)) {
    errors.push({
      pattern: 'MULTIPLICATION_TABLE_ERROR',
      confidence: 0.85,
      category: 'FACTUAL',
      explanation: 'Common multiplication fact retrieval error'
    });
  }
  
  // Test: Multiplied but then added instead of carrying
  // Multi-digit multiplication carrying errors
  if (num1 >= 10 || num2 >= 10) {
    // Check if answer is within 10% but wrong - likely partial product error
    const ratio = studentAnswer / correctAnswer;
    if (ratio > 0.8 && ratio < 1.2 && studentAnswer !== correctAnswer) {
      errors.push({
        pattern: 'PARTIAL_PRODUCT_ERROR',
        confidence: 0.70,
        category: 'PROCEDURAL',
        explanation: 'Possible error in combining partial products'
      });
    }
  }
  
  return errors;
}

/**
 * Detects division errors
 * 
 * Common bugs:
 * - REMAINDER_IGNORED: Dropped remainder
 * - DIVISION_DIRECTION: Divided smaller by larger
 */
function detectDivisionErrors(dividend, divisor, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Test: Ignored remainder (gave integer part only)
  if (studentAnswer === Math.floor(correctAnswer) && correctAnswer !== Math.floor(correctAnswer)) {
    errors.push({
      pattern: 'REMAINDER_IGNORED',
      confidence: 0.90,
      category: 'PROCEDURAL',
      explanation: 'Student gave the quotient but dropped the remainder'
    });
  }
  
  // Test: Gave remainder as answer
  const remainder = dividend % divisor;
  if (studentAnswer === remainder && remainder !== correctAnswer) {
    errors.push({
      pattern: 'GAVE_REMAINDER_ONLY',
      confidence: 0.90,
      category: 'CONCEPTUAL',
      explanation: 'Student gave the remainder instead of the quotient'
    });
  }
  
  // Test: Divided in wrong direction
  if (divisor !== 0 && dividend !== 0) {
    const reversed = divisor / dividend;
    if (Math.abs(studentAnswer - reversed) < 0.01) {
      errors.push({
        pattern: 'DIVISION_REVERSED',
        confidence: 0.95,
        category: 'CONCEPTUAL',
        explanation: 'Student divided in the wrong direction'
      });
    }
  }
  
  return errors;
}

/**
 * Detects fraction operation errors
 * 
 * Common bugs (grades 3-5):
 * - ADD_BOTH_NUM_AND_DEN: 1/2 + 1/3 = 2/5 (added tops AND bottoms)
 * - LCD_WITHOUT_ADJUSTMENT: Found common denominator but didn't adjust numerators
 * - FRACTION_NOT_SIMPLIFIED: Correct but not in lowest terms
 */
function detectFractionErrors(frac1, frac2, operation, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Ensure we have fraction objects
  if (!frac1.num || !frac2.num || !studentAnswer.num) {
    return errors; // Can't analyze without proper fraction data
  }
  
  if (operation === 'ADD' || operation === 'SUBTRACT') {
    // Test: Added/subtracted both numerators AND denominators
    // This is the most common fraction misconception
    const buggyNum = operation === 'ADD' 
      ? frac1.num + frac2.num 
      : frac1.num - frac2.num;
    const buggyDen = operation === 'ADD'
      ? frac1.den + frac2.den
      : Math.abs(frac1.den - frac2.den) || frac1.den; // Avoid 0 denominator
    
    if (studentAnswer.num === buggyNum && studentAnswer.den === buggyDen) {
      errors.push({
        pattern: 'ADD_BOTH_NUM_AND_DEN',
        confidence: 0.95,
        category: 'CONCEPTUAL',
        explanation: 'Student applied whole-number thinking to fractions'
      });
    }
    
    // Test: Found LCD but didn't adjust numerators
    const lcd = lcm(frac1.den, frac2.den);
    if (studentAnswer.den === lcd) {
      const unadjustedNum = operation === 'ADD'
        ? frac1.num + frac2.num
        : frac1.num - frac2.num;
      
      if (studentAnswer.num === unadjustedNum) {
        errors.push({
          pattern: 'LCD_WITHOUT_ADJUSTMENT',
          confidence: 0.90,
          category: 'PROCEDURAL',
          explanation: 'Student found common denominator but forgot to adjust numerators'
        });
      }
    }
  }
  
  if (operation === 'MULTIPLY') {
    // Test: Added instead of multiplied
    const addedNum = frac1.num + frac2.num;
    const addedDen = frac1.den + frac2.den;
    
    if (studentAnswer.num === addedNum || studentAnswer.den === addedDen) {
      errors.push({
        pattern: 'ADDED_INSTEAD_OF_MULTIPLIED',
        confidence: 0.85,
        category: 'PROCEDURAL',
        explanation: 'Student may have added instead of multiplied'
      });
    }
  }
  
  // Test: Correct value but not simplified
  if (correctAnswer.num && correctAnswer.den) {
    const studentValue = studentAnswer.num / studentAnswer.den;
    const correctValue = correctAnswer.num / correctAnswer.den;
    
    if (Math.abs(studentValue - correctValue) < 0.0001) {
      // Same value - check if simplified
      const studentGcd = gcd(studentAnswer.num, studentAnswer.den);
      if (studentGcd > 1) {
        errors.push({
          pattern: 'FRACTION_NOT_SIMPLIFIED',
          confidence: 0.95,
          category: 'PROCEDURAL',
          explanation: 'Answer is correct but not in simplest form'
        });
      }
    }
  }
  
  return errors;
}

/**
 * Detects decimal operation errors
 * 
 * Common bugs:
 * - DECIMAL_IGNORED: Student ignored the decimal point
 * - DECIMAL_PLACE_ERROR: Decimal in wrong position (off by factor of 10, 100)
 * - LONGER_IS_LARGER: Thinks 0.123 > 0.5 because more digits
 */
function detectDecimalErrors(num1, num2, operation, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Test: Off by factor of 10, 100, etc. (decimal place error)
  const factors = [10, 100, 1000, 0.1, 0.01, 0.001];
  for (const factor of factors) {
    if (Math.abs(studentAnswer - correctAnswer * factor) < 0.0001) {
      errors.push({
        pattern: 'DECIMAL_PLACE_ERROR',
        confidence: 0.95,
        category: 'PROCEDURAL',
        factor: factor,
        explanation: `Decimal point is off by factor of ${factor}`
      });
      break;
    }
  }
  
  // Test: Decimal completely ignored
  const correctNoDecimal = parseInt(String(correctAnswer).replace('.', ''));
  if (studentAnswer === correctNoDecimal) {
    errors.push({
      pattern: 'DECIMAL_IGNORED',
      confidence: 0.95,
      category: 'CONCEPTUAL',
      explanation: 'Student ignored the decimal point entirely'
    });
  }
  
  // Test: For comparisons, "longer is larger" misconception
  // e.g., thinking 0.125 > 0.5 because 125 > 5
  if (operation === 'COMPARE') {
    // This would need specific handling in the problem format
    // Check if student chose the number with more decimal digits
  }
  
  return errors;
}

/**
 * Detects wrong operation errors
 * 
 * Student performed a different operation than requested
 */
function detectWrongOperationErrors(num1, num2, requestedOperation, studentAnswer, correctAnswer) {
  const errors = [];
  
  // Calculate what each operation would produce
  const operationResults = {
    'ADD': num1 + num2,
    'SUBTRACT': num1 - num2,
    'SUBTRACT_REVERSE': num2 - num1,
    'MULTIPLY': num1 * num2,
    'DIVIDE': num2 !== 0 ? num1 / num2 : null,
    'DIVIDE_REVERSE': num1 !== 0 ? num2 / num1 : null
  };
  
  // Check if student answer matches a different operation
  for (const [op, result] of Object.entries(operationResults)) {
    if (result === null) continue;
    if (op === requestedOperation) continue; // Skip the correct operation
    
    // Allow small floating point tolerance
    if (Math.abs(studentAnswer - result) < 0.0001) {
      // Determine the specific wrong operation pattern
      let pattern = 'WRONG_OPERATION';
      
      if (requestedOperation === 'ADD' && op.includes('SUBTRACT')) {
        pattern = 'SUBTRACTED_INSTEAD_OF_ADDED';
      } else if (requestedOperation === 'SUBTRACT' && op === 'ADD') {
        pattern = 'ADDED_INSTEAD_OF_SUBTRACTED';
      } else if (requestedOperation === 'MULTIPLY' && op === 'ADD') {
        pattern = 'ADDED_INSTEAD_OF_MULTIPLIED';
      } else if (requestedOperation === 'ADD' && op === 'MULTIPLY') {
        pattern = 'MULTIPLIED_INSTEAD_OF_ADDED';
      } else if (requestedOperation === 'MULTIPLY' && op.includes('DIVIDE')) {
        pattern = 'DIVIDED_INSTEAD_OF_MULTIPLIED';
      } else if (requestedOperation === 'DIVIDE' && op === 'MULTIPLY') {
        pattern = 'MULTIPLIED_INSTEAD_OF_DIVIDED';
      }
      
      errors.push({
        pattern: pattern,
        actualOperation: op,
        confidence: 0.95,
        category: 'PROCEDURAL',
        explanation: `Student performed ${op} instead of ${requestedOperation}`
      });
    }
  }
  
  return errors;
}

/**
 * Detects place value and digit errors
 * 
 * Common bugs:
 * - OFF_BY_ONE: Simple counting error
 * - OFF_BY_TEN/HUNDRED: Place value confusion
 * - DIGIT_TRANSPOSITION: Digits in wrong order (45 vs 54)
 */
function detectPlaceValueErrors(studentAnswer, correctAnswer) {
  const errors = [];
  
  const difference = Math.abs(studentAnswer - correctAnswer);
  
  // Test: Off by 1 (counting error)
  if (difference === 1) {
    errors.push({
      pattern: 'OFF_BY_ONE',
      confidence: 0.90,
      category: 'CARELESS',
      explanation: 'Answer is off by 1 - possible counting or input error'
    });
  }
  
  // Test: Off by 10 (tens place error)
  if (difference === 10) {
    errors.push({
      pattern: 'OFF_BY_TEN',
      confidence: 0.85,
      category: 'PROCEDURAL',
      explanation: 'Answer is off by 10 - check the tens column'
    });
  }
  
  // Test: Off by 100 (hundreds place error)
  if (difference === 100) {
    errors.push({
      pattern: 'OFF_BY_HUNDRED',
      confidence: 0.85,
      category: 'PROCEDURAL',
      explanation: 'Answer is off by 100 - check the hundreds column'
    });
  }
  
  // Test: Digit transposition (same digits, wrong order)
  const correctDigits = getDigits(correctAnswer).sort().join('');
  const studentDigits = getDigits(studentAnswer).sort().join('');
  
  if (correctDigits === studentDigits && studentAnswer !== correctAnswer) {
    errors.push({
      pattern: 'DIGIT_TRANSPOSITION',
      confidence: 0.90,
      category: 'CARELESS',
      explanation: 'Digits are correct but in wrong order'
    });
  }
  
  return errors;
}

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

/**
 * Main entry point for error pattern detection
 * 
 * @param {number} correctAnswer - The correct answer to the problem
 * @param {number|object} studentAnswer - Student's submitted answer
 * @param {object} problemData - Contains problem details:
 *   - operation: 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'FRACTION_ADD', etc.
 *   - operands: [num1, num2] or {frac1: {num, den}, frac2: {num, den}}
 *   - teksCode: e.g., '3.4A'
 * @param {number} gradeLevel - 1-5
 * @returns {object} Detection result with pattern, confidence, hintId
 */
function detectMathError(correctAnswer, studentAnswer, problemData, gradeLevel) {
  // Handle correct answers
  if (correctAnswer === studentAnswer) {
    return { correct: true };
  }
  
  // For fraction problems, compare values
  if (problemData.operation && problemData.operation.includes('FRACTION')) {
    if (typeof correctAnswer === 'object' && typeof studentAnswer === 'object') {
      const correctValue = correctAnswer.num / correctAnswer.den;
      const studentValue = studentAnswer.num / studentAnswer.den;
      if (Math.abs(correctValue - studentValue) < 0.0001) {
        // Check if it needs simplification
        const studentGcd = gcd(studentAnswer.num, studentAnswer.den);
        if (studentGcd > 1) {
          return {
            correct: false,
            pattern: 'FRACTION_NOT_SIMPLIFIED',
            confidence: 0.95,
            category: 'PROCEDURAL',
            hintId: randomChoice(HINT_MAPPING['FRACTION_NOT_SIMPLIFIED']),
            explanation: 'Correct value but not simplified'
          };
        }
        return { correct: true };
      }
    }
  }
  
  // Collect all candidate errors
  let candidates = [];
  const operation = problemData.operation || 'UNKNOWN';
  const operands = problemData.operands || [];
  
  // Run appropriate detectors based on operation
  if (operation.includes('ADD') && !operation.includes('FRACTION')) {
    candidates.push(...detectAdditionErrors(
      operands[0], operands[1], studentAnswer, correctAnswer
    ));
  }
  
  if (operation.includes('SUBTRACT') && !operation.includes('FRACTION')) {
    candidates.push(...detectSubtractionErrors(
      operands[0], operands[1], studentAnswer, correctAnswer
    ));
  }
  
  if (operation.includes('MULTIPLY')) {
    candidates.push(...detectMultiplicationErrors(
      operands[0], operands[1], studentAnswer, correctAnswer
    ));
  }
  
  if (operation.includes('DIVIDE')) {
    candidates.push(...detectDivisionErrors(
      operands[0], operands[1], studentAnswer, correctAnswer
    ));
  }
  
  if (operation.includes('FRACTION')) {
    candidates.push(...detectFractionErrors(
      operands.frac1, operands.frac2, 
      operation.replace('FRACTION_', ''),
      studentAnswer, correctAnswer
    ));
  }
  
  if (operation.includes('DECIMAL') || hasDecimal(correctAnswer)) {
    candidates.push(...detectDecimalErrors(
      operands[0], operands[1], operation, studentAnswer, correctAnswer
    ));
  }
  
  // Always check for wrong operation and place value errors
  if (operands.length >= 2) {
    candidates.push(...detectWrongOperationErrors(
      operands[0], operands[1], 
      operation.replace('FRACTION_', '').replace('DECIMAL_', ''),
      studentAnswer, correctAnswer
    ));
  }
  
  candidates.push(...detectPlaceValueErrors(studentAnswer, correctAnswer));
  
  // Apply grade-level adjustments
  candidates = adjustForGradeLevel(candidates, gradeLevel, operation);
  
  // Sort by confidence
  candidates.sort((a, b) => b.confidence - a.confidence);
  
  // Return best match or unknown
  if (candidates.length > 0 && candidates[0].confidence >= CONFIG.MINIMUM_CONFIDENCE) {
    const best = candidates[0];
    const hintIds = HINT_MAPPING[best.pattern] || HINT_MAPPING['UNKNOWN'];
    
    return {
      correct: false,
      pattern: best.pattern,
      confidence: best.confidence,
      category: best.category,
      explanation: best.explanation,
      hintId: randomChoice(hintIds),
      widowHintId: randomChoice(WIDOW_HINT_MAPPING[best.pattern] || WIDOW_HINT_MAPPING['UNKNOWN']),
      alternativePatterns: candidates.slice(1, 3).map(c => ({
        pattern: c.pattern,
        confidence: c.confidence
      })),
      meetsThreshold: best.confidence >= CONFIG.CONFIDENCE_THRESHOLD
    };
  }
  
  // Unknown error - use generic hints
  return {
    correct: false,
    pattern: 'UNKNOWN',
    confidence: 0,
    category: 'UNKNOWN',
    explanation: 'Could not identify specific error pattern',
    hintId: randomChoice(HINT_MAPPING['UNKNOWN']),
    widowHintId: randomChoice(WIDOW_HINT_MAPPING['UNKNOWN']),
    meetsThreshold: false
  };
}

/**
 * Adjusts confidence scores based on grade level
 * 
 * Research shows:
 * - Procedural bugs decrease with age
 * - Conceptual misconceptions persist longer
 * - Digit reversal more common in K-2
 * - Fraction misconceptions peak in grades 3-5
 */
function adjustForGradeLevel(candidates, gradeLevel, problemType) {
  return candidates.map(error => {
    let adjustedConfidence = error.confidence;
    
    // Grades 1-2: Higher tolerance for developmental errors
    if (gradeLevel <= 2) {
      // Digit reversal/transposition is developmentally normal
      if (error.pattern === 'DIGIT_TRANSPOSITION') {
        adjustedConfidence *= 0.9; // Slightly lower confidence - might be normal
        error.developmental = true;
      }
      
      // Basic counting errors more expected
      if (error.pattern === 'OFF_BY_ONE') {
        adjustedConfidence *= 0.85;
        error.developmental = true;
      }
      
      // Boost procedural errors for single operations
      if (error.category === 'PROCEDURAL' && 
          (problemType.includes('ADD') || problemType.includes('SUBTRACT'))) {
        adjustedConfidence *= 1.05;
      }
    }
    
    // Grades 3-5: Fraction/decimal misconceptions are very common
    if (gradeLevel >= 3) {
      // "Whole number thinking" in fractions is extremely common
      if (error.pattern === 'ADD_BOTH_NUM_AND_DEN') {
        adjustedConfidence *= 1.1; // Boost - this is THE fraction misconception
      }
      
      // Decimal place errors peak around grade 4-5
      if (error.pattern === 'DECIMAL_PLACE_ERROR' || error.pattern === 'DECIMAL_IGNORED') {
        adjustedConfidence *= 1.05;
      }
    }
    
    // Apply population base rate adjustment
    const baseRate = CONFIG.BUG_PREVALENCE[error.pattern] || 0.05;
    adjustedConfidence = adjustedConfidence * 0.8 + baseRate * 0.2;
    
    return {
      ...error,
      confidence: Math.min(adjustedConfidence, 0.99)
    };
  });
}

// ============================================================================
// HINT SELECTION HELPERS
// ============================================================================

/**
 * Tracks which hints have been used to avoid repetition
 */
const usedHints = {
  jarvis: new Set(),
  widow: new Set()
};

/**
 * Gets a hint ID that hasn't been used recently
 */
function getUnusedHintId(pattern, character = 'jarvis') {
  const mapping = character === 'widow' ? WIDOW_HINT_MAPPING : HINT_MAPPING;
  const used = usedHints[character];
  const available = mapping[pattern] || mapping['UNKNOWN'];
  
  // Find unused hints
  const unused = available.filter(id => !used.has(id));
  
  // If all used, reset and start over
  if (unused.length === 0) {
    available.forEach(id => used.delete(id));
    return randomChoice(available);
  }
  
  const selected = randomChoice(unused);
  used.add(selected);
  return selected;
}

/**
 * Resets hint tracking (call at start of new mission)
 */
function resetHintTracking() {
  usedHints.jarvis.clear();
  usedHints.widow.clear();
}

// ============================================================================
// EXPORTS
// ============================================================================

// For use as ES6 module
export {
  detectMathError,
  resetHintTracking,
  getUnusedHintId,
  CONFIG,
  HINT_MAPPING,
  WIDOW_HINT_MAPPING
};

// For use in browser global scope
if (typeof window !== 'undefined') {
  window.PatternDetector = {
    detectMathError,
    resetHintTracking,
    getUnusedHintId,
    CONFIG,
    HINT_MAPPING,
    WIDOW_HINT_MAPPING
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Addition with carrying error
const result1 = detectMathError(
  75,           // correct answer
  65,           // student answer (forgot to carry)
  {
    operation: 'ADD',
    operands: [47, 28],
    teksCode: '3.4A'
  },
  3             // grade level
);
// Returns: { pattern: 'FORGOT_TO_CARRY', confidence: 0.95, hintId: 'HINT-PAT-08', ... }

// Example 2: Subtraction with smaller-from-larger bug
const result2 = detectMathError(
  15,           // correct answer
  25,           // student answer (subtracted smaller from larger: 5-3=2, 7-2=5)
  {
    operation: 'SUBTRACT',
    operands: [52, 37],
    teksCode: '3.4A'
  },
  3
);
// Returns: { pattern: 'SMALLER_FROM_LARGER', confidence: 0.95, hintId: 'HINT-PAT-10', ... }

// Example 3: Fraction addition error
const result3 = detectMathError(
  { num: 5, den: 6 },    // correct: 1/2 + 1/3 = 5/6
  { num: 2, den: 5 },    // student: added tops and bottoms
  {
    operation: 'FRACTION_ADD',
    operands: {
      frac1: { num: 1, den: 2 },
      frac2: { num: 1, den: 3 }
    },
    teksCode: '5.3H'
  },
  5
);
// Returns: { pattern: 'ADD_BOTH_NUM_AND_DEN', confidence: 0.95, hintId: 'HINT-PAT-17', ... }

// Example 4: Integration with game flow
function handleStudentAnswer(studentAnswer) {
  const result = detectMathError(
    currentProblem.correctAnswer,
    studentAnswer,
    currentProblem,
    missionGradeLevel
  );
  
  if (result.correct) {
    playAudio('CORRECT-' + getRandomCorrectId());
    advanceToNextFirewall();
  } else {
    playAudio('WRONG-' + getRandomWrongId());
    
    if (result.meetsThreshold) {
      // High confidence - use specific hint
      playAudio(result.hintId);
    } else {
      // Low confidence - use generic hint
      playAudio(randomChoice(HINT_MAPPING['UNKNOWN']));
    }
    
    // Track for Black Widow potential intervention
    wrongAnswerCount++;
    if (wrongAnswerCount >= 3 && Math.random() < 0.5) {
      triggerBlackWidow(result.widowHintId);
    }
  }
}
*/
