/**
 * IRON MAN STEM MISSION - Batch 3: Missing TEKS Exemplars
 *
 * 30 exemplar math problems covering TEKS standards that are less commonly
 * represented in the main problem bank. Organized by grade (1-5), with
 * approximately 6 problems per grade.
 *
 * Covers geometry, measurement, data analysis, fractions, and conceptual
 * understanding standards across the Texas TEKS framework.
 */

const BATCH3_MISSING_TEKS_EXEMPLARS = [

  // ===================================================================
  // GRADE 1 (6 problems): 1.6A, 1.6D, 1.6E, 1.7A, 1.7B, 1.8B
  // ===================================================================

  // 1. TEKS 1.6A - Classify and sort 2D and 3D shapes
  {
    narrative: "Jarvis is sorting shape files in Tony Stark's lab computer.",
    expression: "Which shape has 3 sides and 3 corners?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "A",
    teks: "1.6A",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Triangle" },
      { letter: "B", text: "Square" },
      { letter: "C", text: "Circle" },
      { letter: "D", text: "Rectangle" }
    ]
  },

  // 2. TEKS 1.6D - Describe attributes of 2D shapes (sides, corners)
  {
    narrative: "Pepper Potts finds a shape on the Stark Industries blueprint.",
    expression: "How many sides does a rectangle have?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "B",
    teks: "1.6D",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "3" },
      { letter: "B", text: "4" },
      { letter: "C", text: "5" },
      { letter: "D", text: "6" }
    ]
  },

  // 3. TEKS 1.6E - Describe attributes of 3D solids (faces, edges, vertices)
  {
    narrative: "Tony Stark examines a 3D model of a new suit helmet.",
    expression: "Which 3D solid has no flat faces and rolls?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "C",
    teks: "1.6E",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Cube" },
      { letter: "B", text: "Cone" },
      { letter: "C", text: "Sphere" },
      { letter: "D", text: "Cylinder" }
    ]
  },

  // 4. TEKS 1.7A - Identify and use measuring tools
  {
    narrative: "Nick Fury needs to measure a map at SHIELD headquarters.",
    expression: "Which tool is best for measuring the length of a desk?",
    operation: "MEASURE",
    operands: [],
    correctAnswer: "B",
    teks: "1.7A",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "measurement",
    options: [
      { letter: "A", text: "Thermometer" },
      { letter: "B", text: "Ruler" },
      { letter: "C", text: "Scale" },
      { letter: "D", text: "Clock" }
    ]
  },

  // 5. TEKS 1.7B - Describe length using non-standard or standard units
  {
    narrative: "Jarvis measures a wire using paper clips in the lab.",
    expression: "A wire is 8 paper clips long. Another is 5 paper clips long. Which wire is longer?",
    operation: "COMPARE",
    operands: [8, 5],
    correctAnswer: "A",
    teks: "1.7B",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "measurement",
    options: [
      { letter: "A", text: "The 8 paper clip wire" },
      { letter: "B", text: "The 5 paper clip wire" },
      { letter: "C", text: "They are the same length" },
      { letter: "D", text: "Cannot tell" }
    ]
  },

  // 6. TEKS 1.8B - Create picture and bar-type graphs
  {
    narrative: "The Avengers count their vehicles for a SHIELD report.",
    expression: "A graph shows: cars = 3, jets = 5, bikes = 2. How many vehicles in all?",
    operation: "DATA_READ",
    operands: [3, 5],
    correctAnswer: "D",
    teks: "1.8B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 1,
    primaryType: "data",
    options: [
      { letter: "A", text: "8" },
      { letter: "B", text: "5" },
      { letter: "C", text: "7" },
      { letter: "D", text: "10" }
    ]
  },

  // ===================================================================
  // GRADE 2 (6 problems): 2.6B, 2.7B, 2.8C, 2.3B, 2.3C, 2.2F
  // ===================================================================

  // 7. TEKS 2.6B - Classify polygons (number of sides/vertices)
  {
    narrative: "Black Widow studies polygon-shaped security badges at SHIELD.",
    expression: "Which polygon has exactly 5 sides?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "C",
    teks: "2.6B",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Quadrilateral" },
      { letter: "B", text: "Triangle" },
      { letter: "C", text: "Pentagon" },
      { letter: "D", text: "Hexagon" }
    ]
  },

  // 8. TEKS 2.7B - Measure length using rulers in inches and centimeters
  {
    narrative: "Tony Stark measures a circuit board at Stark Industries.",
    expression: "Tony's circuit board starts at 0 inches and ends at 6 inches on the ruler. How long is it?",
    operation: "MEASURE",
    operands: [0, 6],
    correctAnswer: "B",
    teks: "2.7B",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "measurement",
    options: [
      { letter: "A", text: "5 inches" },
      { letter: "B", text: "6 inches" },
      { letter: "C", text: "7 inches" },
      { letter: "D", text: "4 inches" }
    ]
  },

  // 9. TEKS 2.8C - Draw conclusions and make predictions from data
  {
    narrative: "Pepper Potts reviews Avengers Tower energy usage data.",
    expression: "Mon: 10 kW, Tue: 15 kW, Wed: 20 kW. If the pattern continues, what is Thursday's usage?",
    operation: "DATA_READ",
    operands: [10, 15],
    correctAnswer: "C",
    teks: "2.8C",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "data",
    options: [
      { letter: "A", text: "15 kW" },
      { letter: "B", text: "20 kW" },
      { letter: "C", text: "25 kW" },
      { letter: "D", text: "30 kW" }
    ]
  },

  // 10. TEKS 2.3B - Explain fraction-whole relationship (halves, fourths, eighths)
  {
    narrative: "Jarvis divides a power cell into equal parts for testing.",
    expression: "A power cell is split into 4 equal parts. What is each part called?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "B",
    teks: "2.3B",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "One half" },
      { letter: "B", text: "One fourth" },
      { letter: "C", text: "One eighth" },
      { letter: "D", text: "One third" }
    ]
  },

  // 11. TEKS 2.3C - Count fractional parts beyond one whole
  {
    narrative: "Nick Fury distributes energy bars at SHIELD headquarters.",
    expression: "Each bar is cut in halves. Fury has 5 halves. How many whole bars and extra halves is that?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "A",
    teks: "2.3C",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "2 whole bars and 1 half" },
      { letter: "B", text: "3 whole bars" },
      { letter: "C", text: "1 whole bar and 3 halves" },
      { letter: "D", text: "5 whole bars" }
    ]
  },

  // 12. TEKS 2.2F - Name the whole number on a number line
  {
    narrative: "Black Widow marks positions on a number line in a training drill.",
    expression: "A number line shows marks at 0, 5, 10, 15, 20. What number is the third mark?",
    operation: "IDENTIFY",
    operands: [0, 20],
    correctAnswer: "C",
    teks: "2.2F",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 2,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "5" },
      { letter: "B", text: "15" },
      { letter: "C", text: "10" },
      { letter: "D", text: "20" }
    ]
  },

  // ===================================================================
  // GRADE 3 (6 problems): 3.6B, 3.6D, 3.7C, 3.8B, 3.4I, 3.2B
  // ===================================================================

  // 13. TEKS 3.6B - Classify polygons by attributes (sides, angles)
  {
    narrative: "Tony Stark designs a new shield shape for the Avengers.",
    expression: "Which shape has 6 sides and 6 angles?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "D",
    teks: "3.6B",
    difficulty: "easy",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Pentagon" },
      { letter: "B", text: "Quadrilateral" },
      { letter: "C", text: "Octagon" },
      { letter: "D", text: "Hexagon" }
    ]
  },

  // 14. TEKS 3.6D - Decompose composite shapes into basic shapes
  {
    narrative: "Jarvis breaks apart a floor plan at Avengers Tower.",
    expression: "An L-shape can be decomposed into which basic shapes?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "B",
    teks: "3.6D",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Two triangles" },
      { letter: "B", text: "Two rectangles" },
      { letter: "C", text: "A circle and a square" },
      { letter: "D", text: "Three triangles" }
    ]
  },

  // 15. TEKS 3.7C - Explain that two fractions are equivalent
  {
    narrative: "Pepper Potts compares fuel tank gauges at Stark Industries.",
    expression: "Which fraction is equivalent to 1/2?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "A",
    teks: "3.7C",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 3,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "2/4" },
      { letter: "B", text: "1/3" },
      { letter: "C", text: "3/4" },
      { letter: "D", text: "2/3" }
    ]
  },

  // 16. TEKS 3.8B - Solve problems using data in bar graphs
  {
    narrative: "Nick Fury reads a bar graph of missions completed per Avenger.",
    expression: "Bar graph: Iron Man = 8, Thor = 5, Hulk = 6. How many more missions did Iron Man complete than Thor?",
    operation: "DATA_READ",
    operands: [8, 5],
    correctAnswer: "B",
    teks: "3.8B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 3,
    primaryType: "data",
    options: [
      { letter: "A", text: "2" },
      { letter: "B", text: "3" },
      { letter: "C", text: "4" },
      { letter: "D", text: "13" }
    ]
  },

  // 17. TEKS 3.4I - Determine a product using properties of operations
  {
    narrative: "Tony Stark calculates suit part orders for the lab.",
    expression: "7 x 8 = ?",
    operation: "MULTIPLY",
    operands: [7, 8],
    correctAnswer: 56,
    teks: "3.4I",
    difficulty: "medium",
    answerType: "integer",
    diagnosticFor: ["multiplication-facts"],
    grade: 3,
    primaryType: "computation"
  },

  // 18. TEKS 3.2B - Describe the value of a digit in a number (place value)
  {
    narrative: "Jarvis analyzes a 3-digit code on the Helicarrier console.",
    expression: "In the number 472, what is the value of the digit 4?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "C",
    teks: "3.2B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: ["place-value"],
    grade: 3,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "4" },
      { letter: "B", text: "40" },
      { letter: "C", text: "400" },
      { letter: "D", text: "4000" }
    ]
  },

  // ===================================================================
  // GRADE 4 (6 problems): 4.5B, 4.6A, 4.6C, 4.7A, 4.3E, 4.3G
  // ===================================================================

  // 19. TEKS 4.5B - Classify triangles (acute, right, obtuse)
  {
    narrative: "Black Widow studies triangle-shaped sensor arrays at SHIELD.",
    expression: "A triangle has one angle measuring exactly 90 degrees. What type of triangle is it?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "B",
    teks: "4.5B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 4,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Acute triangle" },
      { letter: "B", text: "Right triangle" },
      { letter: "C", text: "Obtuse triangle" },
      { letter: "D", text: "Equilateral triangle" }
    ]
  },

  // 20. TEKS 4.6A - Measure angles using a protractor
  {
    narrative: "Tony Stark measures the angle of a repulsor beam path.",
    expression: "A protractor shows the repulsor beam angle starts at 0 and ends at 135. What is the angle?",
    operation: "MEASURE",
    operands: [0, 135],
    correctAnswer: "C",
    teks: "4.6A",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 4,
    primaryType: "measurement",
    options: [
      { letter: "A", text: "45 degrees" },
      { letter: "B", text: "90 degrees" },
      { letter: "C", text: "135 degrees" },
      { letter: "D", text: "180 degrees" }
    ]
  },

  // 21. TEKS 4.6C - Identify lines of symmetry in 2D figures
  {
    narrative: "Pepper Potts designs a symmetric logo for Stark Industries.",
    expression: "How many lines of symmetry does a square have?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "D",
    teks: "4.6C",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 4,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "1" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3" },
      { letter: "D", text: "4" }
    ]
  },

  // 22. TEKS 4.7A - Represent data using stem-and-leaf plots
  {
    narrative: "Nick Fury organizes mission scores using a stem-and-leaf plot.",
    expression: "Stem-and-leaf: Stem 4 | Leaves 2, 5, 7. What are the data values?",
    operation: "DATA_READ",
    operands: [],
    correctAnswer: "A",
    teks: "4.7A",
    difficulty: "hard",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 4,
    primaryType: "data",
    options: [
      { letter: "A", text: "42, 45, 47" },
      { letter: "B", text: "4.2, 4.5, 4.7" },
      { letter: "C", text: "24, 54, 74" },
      { letter: "D", text: "400, 500, 700" }
    ]
  },

  // 23. TEKS 4.3E - Add fractions with like denominators
  {
    narrative: "Jarvis combines two fuel reserves at Avengers Tower.",
    expression: "3/8 + 2/8 = ?",
    operation: "FRACTION_ADD",
    operands: [{ numerator: 3, denominator: 8 }, { numerator: 2, denominator: 8 }],
    correctAnswer: { numerator: 5, denominator: 8 },
    teks: "4.3E",
    difficulty: "easy",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 4,
    primaryType: "computation"
  },

  // 24. TEKS 4.3G - Represent fractions and decimals on a number line
  {
    narrative: "Black Widow marks a fraction on a number line during training.",
    expression: "Where is 3/4 located on a number line from 0 to 1?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "C",
    teks: "4.3G",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 4,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Halfway between 0 and 1" },
      { letter: "B", text: "Closer to 0" },
      { letter: "C", text: "Three-fourths of the way from 0 to 1" },
      { letter: "D", text: "At 1" }
    ]
  },

  // ===================================================================
  // GRADE 5 (6 problems): 5.5B, 5.6B, 5.7A, 5.3F, 5.3I, 5.2C
  // ===================================================================

  // 25. TEKS 5.5B - Classify quadrilaterals (parallelogram, rectangle, etc.)
  {
    narrative: "Tony Stark classifies quadrilateral panels on the Helicarrier hull.",
    expression: "Which quadrilateral has 4 right angles and 4 equal sides?",
    operation: "IDENTIFY",
    operands: [],
    correctAnswer: "D",
    teks: "5.5B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 5,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "Parallelogram" },
      { letter: "B", text: "Trapezoid" },
      { letter: "C", text: "Rectangle" },
      { letter: "D", text: "Square" }
    ]
  },

  // 26. TEKS 5.6B - Determine volume of rectangular prisms
  {
    narrative: "Jarvis calculates the volume of a storage crate in the lab.",
    expression: "A crate is 4 ft long, 3 ft wide, and 2 ft tall. What is the volume?",
    operation: "MEASURE",
    operands: [4, 3],
    correctAnswer: "B",
    teks: "5.6B",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 5,
    primaryType: "measurement",
    options: [
      { letter: "A", text: "9 cubic ft" },
      { letter: "B", text: "24 cubic ft" },
      { letter: "C", text: "20 cubic ft" },
      { letter: "D", text: "12 cubic ft" }
    ]
  },

  // 27. TEKS 5.7A - Solve problems using mean, median, and mode
  {
    narrative: "Pepper Potts analyzes Avengers mission completion times.",
    expression: "Mission times: 10, 15, 20, 15, 25 minutes. What is the median?",
    operation: "DATA_READ",
    operands: [10, 25],
    correctAnswer: "B",
    teks: "5.7A",
    difficulty: "hard",
    answerType: "multipleChoice",
    diagnosticFor: [],
    grade: 5,
    primaryType: "data",
    options: [
      { letter: "A", text: "10" },
      { letter: "B", text: "15" },
      { letter: "C", text: "17" },
      { letter: "D", text: "20" }
    ]
  },

  // 28. TEKS 5.3F - Simplify numerical expressions (order of operations)
  {
    narrative: "Nick Fury simplifies a security code expression at SHIELD.",
    expression: "3 + 4 x 2 = ?",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "C",
    teks: "5.3F",
    difficulty: "hard",
    answerType: "multipleChoice",
    diagnosticFor: ["order-of-operations"],
    grade: 5,
    primaryType: "computation",
    options: [
      { letter: "A", text: "14" },
      { letter: "B", text: "10" },
      { letter: "C", text: "11" },
      { letter: "D", text: "24" }
    ]
  },

  // 29. TEKS 5.3I - Multiply whole number by fraction
  {
    narrative: "Tony Stark uses 3/4 of each power cell for 6 suits.",
    expression: "6 x 3/4 = ?",
    operation: "FRACTION_MULTIPLY",
    operands: [{ numerator: 6, denominator: 1 }, { numerator: 3, denominator: 4 }],
    correctAnswer: { numerator: 9, denominator: 2 },
    teks: "5.3I",
    difficulty: "hard",
    answerType: "fraction",
    diagnosticFor: [],
    grade: 5,
    primaryType: "computation"
  },

  // 30. TEKS 5.2C - Round decimals to tenths or hundredths
  {
    narrative: "Black Widow rounds a distance reading on the Helicarrier display.",
    expression: "Round 7.368 to the nearest tenth.",
    operation: "CONCEPTUAL",
    operands: [],
    correctAnswer: "B",
    teks: "5.2C",
    difficulty: "medium",
    answerType: "multipleChoice",
    diagnosticFor: ["rounding-decimals"],
    grade: 5,
    primaryType: "conceptual",
    options: [
      { letter: "A", text: "7.3" },
      { letter: "B", text: "7.4" },
      { letter: "C", text: "7.37" },
      { letter: "D", text: "7.5" }
    ]
  }

];

window.BATCH3_MISSING_TEKS_EXEMPLARS = BATCH3_MISSING_TEKS_EXEMPLARS;
console.log('[Exemplars] Batch 3 loaded:', BATCH3_MISSING_TEKS_EXEMPLARS.length, 'missing TEKS exemplars');
