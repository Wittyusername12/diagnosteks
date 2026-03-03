/**
 * IRON MAN STEM MISSION - Phase 2
 * Navigation, Screen Management, and Gameplay Loop
 *
 * This module handles:
 * - Screen navigation
 * - Grade and TEKS selection
 * - State management
 * - Settings persistence
 * - Clock/date display
 * - Mission log updates
 * - Gameplay loop with math firewalls and science questions
 * - Score tracking and victory screen
 */

// ============================================
// TEKS DATA - Embedded for all grades
// ============================================
const TEKS_DATA = {
  1: {
    math: [
      { code: '1.2A', description: 'Recognize instantly the quantity of structured arrangements' },
      { code: '1.2B', description: 'Compose and decompose numbers up to 120' },
      { code: '1.2C', description: 'Use objects, pictures, and expanded forms to represent numbers' },
      { code: '1.2D', description: 'Generate a number greater than or less than a given number' },
      { code: '1.2E', description: 'Use place value to compare whole numbers up to 120' },
      { code: '1.2F', description: 'Order whole numbers up to 120 using place value' },
      { code: '1.2G', description: 'Represent comparison of two numbers using >, <, or =' },
      { code: '1.3A', description: 'Determine the sum of a multiple of 10 and a one-digit number' },
      { code: '1.3B', description: 'Solve word problems involving joining, separating, comparing sets' },
      { code: '1.3C', description: 'Compose 10 with two or more addends' },
      { code: '1.3D', description: 'Apply basic fact strategies to add and subtract within 20' },
      { code: '1.3E', description: 'Explain strategies to solve addition and subtraction problems' },
      { code: '1.3F', description: 'Generate and solve problem situations with addition/subtraction' },
      { code: '1.4A', description: 'Identify U.S. coins by value and describe relationships' },
      { code: '1.4B', description: 'Write a number with the cent symbol to describe coin value' },
      { code: '1.4C', description: 'Count by twos, fives, and tens to determine collection value' },
      { code: '1.5A', description: 'Recite numbers forward and backward from any given number' },
      { code: '1.5B', description: 'Skip count by twos, fives, and tens to 120' },
      { code: '1.5C', description: 'Determine the number that is 10 more and 10 less' },
      { code: '1.5D', description: 'Represent word problems using models and number sentences' },
      { code: '1.5E', description: 'Understand that equal sign represents same value' },
      { code: '1.5F', description: 'Determine the unknown whole number in an equation' },
      { code: '1.6A', description: 'Classify and sort 2D shapes based on attributes' },
      { code: '1.6B', description: 'Distinguish between defining and non-defining attributes' },
      { code: '1.6C', description: 'Create 2D figures including circles, triangles, rectangles' },
      { code: '1.6D', description: 'Identify and describe 2D shapes using geometric language' },
      { code: '1.6E', description: 'Identify and describe 3D solids using geometric language' },
      { code: '1.6F', description: 'Compose 2D shapes by joining figures' },
      { code: '1.6G', description: 'Partition 2D figures into two and four equal parts' },
      { code: '1.6H', description: 'Identify examples and non-examples of halves and fourths' },
      { code: '1.7A', description: 'Use measuring tools to measure the length of objects' },
      { code: '1.7B', description: 'Illustrate that length is the number of same-size units' },
      { code: '1.7C', description: 'Measure same object with units of two different lengths' },
      { code: '1.7D', description: 'Describe a length to the nearest whole unit' },
      { code: '1.7E', description: 'Tell time to the hour and half hour' },
      { code: '1.8A', description: 'Collect, sort, and organize data in up to three categories' },
      { code: '1.8B', description: 'Use data to create picture and bar-type graphs' },
      { code: '1.8C', description: 'Draw conclusions from picture and bar-type graphs' }
    ],
    science: [
      { code: '1.6A', description: 'Classify objects by observable physical properties' },
      { code: '1.6B', description: 'Explain and predict changes caused by heating and cooling' },
      { code: '1.6C', description: 'Demonstrate that a whole object is a system of organized parts' },
      { code: '1.7A', description: 'Explain how pushes and pulls change motion' },
      { code: '1.7B', description: 'Investigate how pushes and pulls change object motion' },
      { code: '1.8A', description: 'Investigate applications of heat in everyday life' },
      { code: '1.8B', description: 'Describe reversible and irreversible changes caused by heat' },
      { code: '1.9', description: 'Describe and predict patterns of seasons' },
      { code: '1.10A', description: 'Investigate properties of different types of soils' },
      { code: '1.10B', description: 'Investigate how water can move rock and soil particles' },
      { code: '1.10C', description: 'Compare properties of puddles, ponds, streams, rivers, lakes, oceans' },
      { code: '1.10D', description: 'Describe observable characteristics of weather' },
      { code: '1.11A', description: 'Identify how plants, animals, humans use rocks, soil, water' },
      { code: '1.11B', description: 'Explain why water conservation is important' },
      { code: '1.11C', description: 'Describe ways to conserve water' },
      { code: '1.12A', description: 'Classify living and nonliving things' },
      { code: '1.12B', description: 'Describe interactions in terrariums or aquariums' },
      { code: '1.12C', description: 'Identify and illustrate food chains' },
      { code: '1.13A', description: 'Identify external structures of different animals' },
      { code: '1.13B', description: 'Record observations of basic life cycles' },
      { code: '1.13C', description: 'Compare ways that young animals resemble their parents' }
    ]
  },
  2: {
    math: [
      { code: '2.2A', description: 'Compose and decompose numbers up to 1,200' },
      { code: '2.2B', description: 'Use standard, word, and expanded forms to represent numbers' },
      { code: '2.2C', description: 'Generate a number greater than or less than a given number' },
      { code: '2.2D', description: 'Use place value to compare and order whole numbers' },
      { code: '2.2E', description: 'Locate the position of a whole number on a number line' },
      { code: '2.2F', description: 'Name the whole number corresponding to a point on a number line' },
      { code: '2.3A', description: 'Partition objects into equal parts and name them' },
      { code: '2.3B', description: 'Explain relationship between fractional parts and whole' },
      { code: '2.3C', description: 'Count fractional parts beyond one whole' },
      { code: '2.3D', description: 'Identify examples of halves, fourths, and eighths' },
      { code: '2.4A', description: 'Recall basic facts to add and subtract within 20' },
      { code: '2.4B', description: 'Add up to four two-digit numbers and subtract two-digit numbers' },
      { code: '2.4C', description: 'Solve word problems involving addition/subtraction within 1,000' },
      { code: '2.4D', description: 'Generate and solve problem situations within 1,000' },
      { code: '2.5A', description: 'Determine the value of a collection of coins up to one dollar' },
      { code: '2.5B', description: 'Use cent symbol, dollar sign, decimal point for coin values' },
      { code: '2.6A', description: 'Model and describe multiplication situations' },
      { code: '2.6B', description: 'Model and describe division situations' },
      { code: '2.7A', description: 'Determine whether a number up to 40 is even or odd' },
      { code: '2.7B', description: 'Determine number that is 10 or 100 more or less' },
      { code: '2.7C', description: 'Represent and solve word problems with unknowns' },
      { code: '2.8A', description: 'Create 2D shapes based on given attributes' },
      { code: '2.8B', description: 'Classify and sort 3D solids based on attributes' },
      { code: '2.8C', description: 'Classify and sort polygons with 12 or fewer sides' },
      { code: '2.8D', description: 'Compose 2D shapes and 3D solids with given properties' },
      { code: '2.8E', description: 'Decompose 2D shapes and identify resulting parts' },
      { code: '2.9A', description: 'Find the length of objects using concrete models' },
      { code: '2.9B', description: 'Describe inverse relationship between unit size and number' },
      { code: '2.9C', description: 'Represent whole numbers as distances on a number line' },
      { code: '2.9D', description: 'Determine length to the nearest marked unit' },
      { code: '2.9E', description: 'Determine a solution to a problem involving length' },
      { code: '2.9F', description: 'Use concrete models to find the area of a rectangle' },
      { code: '2.9G', description: 'Read and write time to the nearest one-minute increment' },
      { code: '2.10A', description: 'Explain bar graph and pictograph representations' },
      { code: '2.10B', description: 'Organize data with up to four categories' },
      { code: '2.10C', description: 'Write and solve one-step word problems using data' },
      { code: '2.10D', description: 'Draw conclusions and make predictions from graphs' }
    ],
    science: [
      { code: '2.6A', description: 'Classify matter by observable physical properties' },
      { code: '2.6B', description: 'Explain how physical properties can be changed' },
      { code: '2.6C', description: 'Demonstrate that small units can be combined to form objects' },
      { code: '2.7A', description: 'Explain how objects push on each other and may change shape' },
      { code: '2.7B', description: 'Investigate how strength of push/pull changes motion' },
      { code: '2.8A', description: 'Demonstrate that sound is made by vibrating matter' },
      { code: '2.8B', description: 'Explain how different levels of sound are used' },
      { code: '2.8C', description: 'Design a device that uses sound to communicate' },
      { code: '2.9A', description: 'Describe the Sun as a star and explain Moon reflects light' },
      { code: '2.9B', description: 'Observe objects in the sky using tools' },
      { code: '2.10A', description: 'Investigate how wind and water move soil and rock' },
      { code: '2.10B', description: 'Measure, record, and graph weather information' },
      { code: '2.10C', description: 'Investigate different types of severe weather events' },
      { code: '2.11A', description: 'Distinguish between natural and manmade resources' },
      { code: '2.11B', description: 'Describe how human impact can be limited' },
      { code: '2.12A', description: 'Describe how physical characteristics support plants/animals' },
      { code: '2.12B', description: 'Create and describe food chains' },
      { code: '2.12C', description: 'Explain how plants depend on other things for pollination' },
      { code: '2.13A', description: 'Identify parts of plants and compare structures' },
      { code: '2.13B', description: 'Record how animal structures help find food, water, air' },
      { code: '2.13C', description: 'Record how being part of a group helps animals' },
      { code: '2.13D', description: 'Investigate unique life cycles of animals' }
    ]
  },
  3: {
    math: [
      { code: '3.2A', description: 'Compose and decompose numbers up to 100,000' },
      { code: '3.2B', description: 'Describe mathematical relationships in base-10 place value' },
      { code: '3.2C', description: 'Represent a number on a number line between multiples' },
      { code: '3.2D', description: 'Compare and order whole numbers up to 100,000' },
      { code: '3.3A', description: 'Represent fractions using concrete objects and pictorial models' },
      { code: '3.3B', description: 'Determine the fraction for a specified point on a number line' },
      { code: '3.3C', description: 'Explain that unit fraction 1/b represents one part of b equal parts' },
      { code: '3.3D', description: 'Compose and decompose a fraction as a sum of parts 1/b' },
      { code: '3.3E', description: 'Solve problems involving partitioning objects or sets' },
      { code: '3.3F', description: 'Represent equivalent fractions using objects and models' },
      { code: '3.3G', description: 'Explain that two fractions are equivalent' },
      { code: '3.3H', description: 'Compare two fractions with same numerator or denominator' },
      { code: '3.4A', description: 'Solve with fluency problems involving addition/subtraction within 1,000' },
      { code: '3.4B', description: 'Round to the nearest 10 or 100 to estimate solutions' },
      { code: '3.4C', description: 'Determine the value of a collection of coins and bills' },
      { code: '3.4D', description: 'Determine total number of objects in arrays up to 10 by 10' },
      { code: '3.4E', description: 'Represent multiplication facts using various approaches' },
      { code: '3.4F', description: 'Recall facts to multiply up to 10 by 10 with automaticity' },
      { code: '3.4G', description: 'Multiply a two-digit number by a one-digit number' },
      { code: '3.4H', description: 'Determine number of objects when partitioned into equal shares' },
      { code: '3.4I', description: 'Determine if a number is even or odd using divisibility rules' },
      { code: '3.4J', description: 'Determine a quotient using multiplication and division relationship' },
      { code: '3.4K', description: 'Solve problems involving multiplication and division within 100' },
      { code: '3.5A', description: 'Represent one- and two-step problems using models and equations' },
      { code: '3.5B', description: 'Represent and solve multiplication and division problems' },
      { code: '3.5C', description: 'Describe a multiplication expression as a comparison' },
      { code: '3.5D', description: 'Determine the unknown in a multiplication or division equation' },
      { code: '3.5E', description: 'Represent real-world relationships using number pairs' },
      { code: '3.6A', description: 'Classify and sort 2D and 3D figures based on attributes' },
      { code: '3.6B', description: 'Use attributes to recognize quadrilaterals' },
      { code: '3.6C', description: 'Determine the area of rectangles with whole number sides' },
      { code: '3.6D', description: 'Decompose composite figures to determine area' },
      { code: '3.6E', description: 'Decompose 2D figures into parts with equal areas' },
      { code: '3.7A', description: 'Represent fractions as distances from zero on a number line' },
      { code: '3.7B', description: 'Determine perimeter of a polygon or missing length' },
      { code: '3.7C', description: 'Determine solutions involving addition/subtraction of time' },
      { code: '3.7D', description: 'Determine when to use liquid volume or weight' },
      { code: '3.7E', description: 'Determine liquid volume or weight using appropriate units' },
      { code: '3.8A', description: 'Summarize data set using frequency table, dot plot, or bar graph' },
      { code: '3.8B', description: 'Solve problems using categorical data' }
    ],
    science: [
      { code: '3.6A', description: 'Measure and record physical properties of matter' },
      { code: '3.6B', description: 'Describe and classify samples as solids, liquids, and gases' },
      { code: '3.6C', description: 'Predict and observe changes in state of matter' },
      { code: '3.6D', description: 'Demonstrate that materials can be combined based on properties' },
      { code: '3.7A', description: 'Demonstrate forces acting on an object including magnetism' },
      { code: '3.7B', description: 'Investigate how position and motion can be changed' },
      { code: '3.8A', description: 'Identify everyday examples of energy' },
      { code: '3.8B', description: 'Investigate how speed of an object relates to mechanical energy' },
      { code: '3.9A', description: 'Construct models and explain orbits of Sun, Earth, and Moon' },
      { code: '3.9B', description: 'Identify the order of planets in our solar system' },
      { code: '3.10A', description: 'Compare and describe day-to-day weather in different locations' },
      { code: '3.10B', description: 'Investigate how soils are formed by weathering' },
      { code: '3.10C', description: 'Model and describe rapid changes in Earth\'s surface' },
      { code: '3.11A', description: 'Explore how humans use natural resources' },
      { code: '3.11B', description: 'Explain why conservation of natural resources is important' },
      { code: '3.11C', description: 'Identify ways to conserve natural resources' },
      { code: '3.12A', description: 'Explain how temperature and precipitation affect organisms' },
      { code: '3.12B', description: 'Identify and describe energy flow in a food chain' },
      { code: '3.12C', description: 'Describe how natural changes affect the ecosystem' },
      { code: '3.12D', description: 'Identify fossils as evidence of past organisms' },
      { code: '3.13A', description: 'Explore how external structures help animals survive' },
      { code: '3.13B', description: 'Explore, illustrate, and compare life cycles' }
    ]
  },
  4: {
    math: [
      { code: '4.2A', description: 'Interpret the value of each place-value position' },
      { code: '4.2B', description: 'Represent value of digits in whole numbers and decimals' },
      { code: '4.2C', description: 'Compare and order whole numbers to 1,000,000,000' },
      { code: '4.2D', description: 'Round whole numbers to a given place value' },
      { code: '4.2E', description: 'Represent decimals using concrete and visual models' },
      { code: '4.2F', description: 'Compare and order decimals to the hundredths' },
      { code: '4.2G', description: 'Relate decimals to fractions (tenths and hundredths)' },
      { code: '4.2H', description: 'Determine decimal corresponding to a point on a number line' },
      { code: '4.3A', description: 'Represent a fraction a/b as a sum of fractions 1/b' },
      { code: '4.3B', description: 'Decompose a fraction into a sum with same denominator' },
      { code: '4.3C', description: 'Determine if two fractions are equivalent' },
      { code: '4.3D', description: 'Compare two fractions with different numerators/denominators' },
      { code: '4.3E', description: 'Represent addition and subtraction of fractions' },
      { code: '4.3F', description: 'Evaluate reasonableness of sums and differences of fractions' },
      { code: '4.3G', description: 'Represent fractions and decimals as distances from zero' },
      { code: '4.4A', description: 'Add and subtract whole numbers and decimals' },
      { code: '4.4B', description: 'Determine products of a number and 10 or 100' },
      { code: '4.4C', description: 'Represent the product of two two-digit numbers' },
      { code: '4.4D', description: 'Multiply up to a four-digit number by a one-digit number' },
      { code: '4.4E', description: 'Represent quotient of up to four-digit whole number' },
      { code: '4.4F', description: 'Divide up to a four-digit dividend by a one-digit divisor' },
      { code: '4.4G', description: 'Round to estimate solutions involving whole numbers' },
      { code: '4.4H', description: 'Solve with fluency problems involving multiplication/division' },
      { code: '4.5A', description: 'Represent multi-step problems using strip diagrams' },
      { code: '4.5B', description: 'Represent problems using input-output tables' },
      { code: '4.5C', description: 'Use models to determine formulas for perimeter and area' },
      { code: '4.5D', description: 'Solve problems related to perimeter and area of rectangles' },
      { code: '4.6A', description: 'Identify points, lines, line segments, rays, angles' },
      { code: '4.6B', description: 'Identify and draw lines of symmetry' },
      { code: '4.6C', description: 'Apply knowledge of right angles to identify triangles' },
      { code: '4.6D', description: 'Classify 2D figures based on parallel or perpendicular lines' },
      { code: '4.7A', description: 'Illustrate the measure of an angle' },
      { code: '4.7B', description: 'Illustrate degrees as units used to measure an angle' },
      { code: '4.7C', description: 'Determine approximate measures of angles using a protractor' },
      { code: '4.7D', description: 'Draw an angle with a given measure' },
      { code: '4.7E', description: 'Determine measure of unknown angle formed by adjacent angles' },
      { code: '4.8A', description: 'Identify relative sizes of measurement units' },
      { code: '4.8B', description: 'Convert measurements within the same system' },
      { code: '4.8C', description: 'Solve problems involving measurements' },
      { code: '4.9A', description: 'Represent data on a frequency table, dot plot, or stem-and-leaf plot' },
      { code: '4.9B', description: 'Solve problems using data in various forms' }
    ],
    science: [
      { code: '4.6A', description: 'Classify and describe matter using observable physical properties' },
      { code: '4.6B', description: 'Investigate and compare a variety of mixtures' },
      { code: '4.6C', description: 'Demonstrate that matter is conserved when mixtures are formed' },
      { code: '4.7', description: 'Plan and conduct investigations to explore patterns of forces' },
      { code: '4.8A', description: 'Investigate the transfer of energy by objects in motion and waves' },
      { code: '4.8B', description: 'Identify conductors and insulators of thermal and electrical energy' },
      { code: '4.8C', description: 'Demonstrate how electrical energy travels in a closed path' },
      { code: '4.9A', description: 'Collect and analyze data to identify patterns in seasons' },
      { code: '4.9B', description: 'Collect and analyze data to identify patterns of the Moon' },
      { code: '4.10A', description: 'Describe the water cycle and role of the Sun' },
      { code: '4.10B', description: 'Model slow changes to Earth\'s surface by weathering' },
      { code: '4.10C', description: 'Differentiate between weather and climate' },
      { code: '4.11A', description: 'Identify advantages and disadvantages of natural resources' },
      { code: '4.11B', description: 'Explain the critical role of energy resources' },
      { code: '4.11C', description: 'Determine physical properties of rocks' },
      { code: '4.12A', description: 'Investigate how producers make their own food' },
      { code: '4.12B', description: 'Describe cycling of matter and flow of energy in food webs' },
      { code: '4.12C', description: 'Identify and describe past environments based on fossil evidence' },
      { code: '4.13A', description: 'Explore how plant structures enable them to survive' },
      { code: '4.13B', description: 'Differentiate between inherited and acquired physical traits' }
    ]
  },
  5: {
    math: [
      { code: '5.2A', description: 'Represent the value of digits in decimals through thousandths' },
      { code: '5.2B', description: 'Compare and order two decimals to thousandths' },
      { code: '5.2C', description: 'Round decimals to tenths or hundredths' },
      { code: '5.3A', description: 'Estimate to determine solutions to problems' },
      { code: '5.3B', description: 'Multiply with fluency a three-digit by two-digit number' },
      { code: '5.3C', description: 'Solve for quotients of up to four-digit by two-digit divisor' },
      { code: '5.3D', description: 'Represent multiplication of decimals with products' },
      { code: '5.3E', description: 'Solve for products of decimals to the hundredths' },
      { code: '5.3F', description: 'Represent quotients of decimals to the hundredths' },
      { code: '5.3G', description: 'Solve for quotients of decimals to the hundredths' },
      { code: '5.3H', description: 'Represent addition and subtraction of fractions with unequal denominators' },
      { code: '5.3I', description: 'Represent multiplication of a whole number and a fraction' },
      { code: '5.3J', description: 'Represent division of a unit fraction by a whole number' },
      { code: '5.3K', description: 'Add and subtract positive rational numbers fluently' },
      { code: '5.3L', description: 'Divide whole numbers by unit fractions and unit fractions by whole numbers' },
      { code: '5.4A', description: 'Identify prime and composite numbers' },
      { code: '5.4B', description: 'Represent and solve multi-step problems with equations' },
      { code: '5.4C', description: 'Generate a numerical pattern when given a rule' },
      { code: '5.4D', description: 'Recognize additive and multiplicative numerical patterns' },
      { code: '5.4E', description: 'Describe the meaning of parentheses and brackets' },
      { code: '5.4F', description: 'Simplify numerical expressions without exponents' },
      { code: '5.4G', description: 'Develop formulas for volume of a rectangular prism' },
      { code: '5.4H', description: 'Represent and solve problems related to perimeter, area, and volume' },
      { code: '5.5', description: 'Classify 2D figures in a hierarchy using graphic organizers' },
      { code: '5.6A', description: 'Recognize a unit cube and the volume of a 3D figure' },
      { code: '5.6B', description: 'Determine the volume of a rectangular prism' },
      { code: '5.7', description: 'Solve problems by calculating conversions' },
      { code: '5.8A', description: 'Describe key attributes of the coordinate plane' },
      { code: '5.8B', description: 'Describe the process for graphing ordered pairs' },
      { code: '5.8C', description: 'Graph ordered pairs in the first quadrant' },
      { code: '5.9A', description: 'Represent categorical and numerical data' },
      { code: '5.9B', description: 'Represent discrete paired data on a scatterplot' },
      { code: '5.9C', description: 'Solve problems using data from various representations' }
    ],
    science: [
      { code: '5.6A', description: 'Compare and contrast matter based on physical properties' },
      { code: '5.6B', description: 'Demonstrate that some mixtures maintain physical properties' },
      { code: '5.6C', description: 'Compare properties of substances before and after combining' },
      { code: '5.6D', description: 'Illustrate how matter is made up of small particles' },
      { code: '5.7A', description: 'Investigate how equal and unequal forces affect motion' },
      { code: '5.7B', description: 'Design an investigation that tests the effect of force' },
      { code: '5.8A', description: 'Investigate the transformation of energy in systems' },
      { code: '5.8B', description: 'Demonstrate that electrical energy can be transformed' },
      { code: '5.8C', description: 'Demonstrate how light travels and can be reflected or refracted' },
      { code: '5.9', description: 'Demonstrate that Earth rotates on its axis' },
      { code: '5.10A', description: 'Explain how Sun and ocean interact in the water cycle' },
      { code: '5.10B', description: 'Model formation of sedimentary rocks and fossil fuels' },
      { code: '5.10C', description: 'Model how changes to Earth\'s surface result in landforms' },
      { code: '5.11', description: 'Design solutions to minimize environmental impact' },
      { code: '5.12A', description: 'Observe how organisms survive by interacting with environment' },
      { code: '5.12B', description: 'Predict how changes affect cycling of matter and energy' },
      { code: '5.12C', description: 'Describe a healthy ecosystem and human activities' },
      { code: '5.13A', description: 'Analyze structures and functions of species' },
      { code: '5.13B', description: 'Explain how behavioral traits increase survival chances' }
    ]
  }
};

// Jarvis generic hints — displayed in dialogue box on 1st wrong answer
// Phase 5: Replace with pattern-specific hints from pattern-detector.js
const JARVIS_GENERIC_HINTS = [
  "Perhaps break the problem into smaller steps, sir.",
  "Consider what you know for certain, and build from there.",
  "Take another look at the numbers. What's the relationship between them?",
  "Sometimes it helps to work backwards. What would need to be true?",
  "Might I suggest drawing it out? Visualization is a powerful tool.",
  "Focus on one part of the problem at a time.",
  "Have you tried estimating first? A rough answer can guide you to the precise one.",
  "Look for patterns in the numbers. They're often hiding in plain sight.",
  "Remember your fundamentals. What operation does this problem call for?",
  "Take a breath, recruits. Fresh eyes often spot what tired ones miss.",
  "Perhaps talk through your thinking out loud. I find it helps, sir.",
  "What would happen if you tried the opposite approach?",
  "Check your work by plugging your answer back in. Does it make sense?",
  "Even Mr. Stark uses scratch paper. There's no shame in showing your work.",
  "You're closer than you think. One small adjustment could be all it takes."
];

// Random line selector for response bank arrays
function getRandomLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

// ============================================
// APPLICATION STATE
// ============================================
const App = {
  // Current application state
  state: {
    currentScreen: 'grade-select',
    selectedGrade: null,
    selectedMathTeks: [],
    selectedScienceTeks: [],
    currentFirewall: 0,
    totalFirewalls: 10,
    missionInProgress: false,
    settings: {
      ambientVolume: 50,
      effectsVolume: 70,
      voiceVolume: 100
    }
  },

  // Mission gameplay state (Phase 2)
  missionState: {
    currentFirewall: 1,
    mathCorrect: 0,
    mathTotal: 10,
    scienceCorrect: 0,
    scienceTotal: 3,
    wrongAttempts: 0,
    missionStartTime: null,
    isComplete: false,
    currentProblem: null,
    currentScienceQuestion: null,
    currentFirewallAttempted: false,  // Tracks if current firewall had a wrong answer
    currentScienceAttempted: false,   // Tracks if current science question had a wrong answer
    widowIntroPlayed: false,          // Tracks if Black Widow intro has been shown
    widowAppearances: 0,             // Number of Widow hint appearances this mission
    lastWidowFirewall: -10,          // Last firewall where Widow appeared
    wrongAttemptsThisFirewall: 0     // Wrong attempts on current firewall
  },

  // Screen references (populated on init)
  screens: {},

  // DOM element cache
  elements: {},

  // ============================================
  // INITIALIZATION
  // ============================================
  init() {
    this.cacheElements();
    this.loadSettings();

    // Format selector state (default: 'mix')
    this.state.problemFormat = 'mix';

    // Answer format selector state (default: 'open')
    this.state.answerFormat = 'open';

    // Inject Answer Format selector after Problem Format selector
    // NOTE: Must happen BEFORE bindEvents() so event listeners can find the buttons
    const formatSelectorEl = document.getElementById('format-selector');
    if (formatSelectorEl && !document.getElementById('answer-format-selector')) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align: center; padding: 0.35rem 0; margin-top: 0.5rem;';
      wrapper.innerHTML = `
        <label style="color: #00e5ff; font-family: 'Orbitron', sans-serif; font-size: 14px; letter-spacing: 0.08em; font-weight: 700; display: block; margin-bottom: 0.35rem;">
          ANSWER FORMAT
        </label>
        <div class="im-review-format-selector" id="answer-format-selector" style="justify-content: center;">
          <button class="im-review-format-btn active" data-answer-format="open">Open Response</button>
          <button class="im-review-format-btn" data-answer-format="mix">Mix</button>
          <button class="im-review-format-btn" data-answer-format="mc">Multiple Choice</button>
        </div>
        <div style="color: rgba(0,229,255,0.5); font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; margin-top: 0.25rem; letter-spacing: 0.03em;">
          Choose how students answer math problems
        </div>
      `;
      formatSelectorEl.parentElement.after(wrapper);
    }

    this.bindEvents();
    this.startClock();
    this.showScreen('grade-select');
    this.checkResumeMission();

    // Load TEKS rules from pre-loaded script (file:// compatible — no fetch/CORS)
    window.TEKS_RULES = window.TEKS_RULES_DATA || {};
    console.log('[App] TEKS rules loaded:', Object.keys(window.TEKS_RULES).length, 'entries');

    // Initialize Teacher Review Screen
    const reviewContainer = document.getElementById('im-review-container');
    if (reviewContainer && window.TeacherReview) {
      window.TeacherReview.init(reviewContainer);
    }

    // Initial mission log entries
    this.updateMissionLog('[INIT] Protocol: AVENGERS-1');
    this.updateMissionLog('[SYS] Breach sequence loaded');
    this.updateMissionLog('[NET] Target: S.H.I.E.L.D. mainframe');
    this.updateMissionLog('[SYS] JARVIS_OS ready');
    this.updateMissionLog('[AWAIT] Awaiting clearance level');
  },

  // Cache DOM elements for performance
  cacheElements() {
    // Screens
    this.screens = {
      'grade-select': document.getElementById('screen-grade-select'),
      'teks-select': document.getElementById('screen-teks-select'),
      'mission-configured': document.getElementById('screen-mission-configured'),
      'firewall': document.getElementById('screen-firewall'),
      'fury': document.getElementById('screen-fury'),
      'victory': document.getElementById('screen-victory'),
      'review': document.getElementById('screen-review')
    };

    // Other elements
    this.elements = {
      clock: document.getElementById('clock'),
      date: document.getElementById('date'),
      missionLog: document.getElementById('mission-log-content'),
      missionOptions: document.getElementById('mission-options'),
      mathTeksList: document.getElementById('math-teks-list'),
      scienceTeksList: document.getElementById('science-teks-list'),
      teksValidationMessage: document.getElementById('teks-validation-message'),
      firewallGrid: document.getElementById('firewall-grid'),
      progressFill: document.getElementById('progress-fill'),
      firewallCount: document.getElementById('firewall-count'),
      missionObjectivesPanel: document.getElementById('mission-objectives-panel'),
      missionObjectives: document.getElementById('mission-objectives'),

      // Summary elements
      summaryGrade: document.getElementById('summary-grade'),
      summaryMathCount: document.getElementById('summary-math-count'),
      summaryScienceCount: document.getElementById('summary-science-count'),
      summaryMathTags: document.getElementById('summary-math-tags'),
      summaryScienceTags: document.getElementById('summary-science-tags'),

      // Volume sliders
      volumeAmbient: document.getElementById('volume-ambient'),
      volumeEffects: document.getElementById('volume-effects'),
      volumeVoice: document.getElementById('volume-voice'),

      // Firewall gameplay elements
      answerInput: document.getElementById('answer-input'),
      problemNarrative: document.getElementById('problem-narrative'),
      problemExpression: document.getElementById('problem-expression'),
      jarvisDialogue: document.getElementById('jarvis-dialogue'),
      currentFirewallDisplay: document.getElementById('current-firewall'),

      // Fury screen elements
      furyQuoteText: document.getElementById('fury-quote-text'),
      furyQuestion: document.getElementById('fury-question'),
      furyOptions: document.getElementById('fury-options'),

      // Victory screen elements
      victoryMathScore: document.getElementById('victory-math-score'),
      victoryScienceScore: document.getElementById('victory-science-score'),
      victoryTotalScore: document.getElementById('victory-total-score'),
      victoryDuration: document.getElementById('victory-duration'),
      victoryWrongAttempts: document.getElementById('victory-wrong-attempts')
    };
  },

  // ============================================
  // NAVIGATION
  // ============================================
  showScreen(screenId) {
    // Hide all screens
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // Show target screen
    if (this.screens[screenId]) {
      this.screens[screenId].classList.add('active');
      this.state.currentScreen = screenId;
      this.updateMissionLog(`[NAV] Switched to ${screenId}`);

      // Screen-specific actions
      this.onScreenEnter(screenId);
    }
  },

  onScreenEnter(screenId) {
    switch (screenId) {
      case 'firewall':
        this.elements.missionObjectivesPanel.style.display = 'block';
        this.updateFirewallGrid();
        this.updateProgress();
        break;
      case 'fury':
        this.elements.missionObjectivesPanel.style.display = 'none';
        break;
      default:
        this.elements.missionObjectivesPanel.style.display = 'none';
    }
  },

  // ============================================
  // GRADE SELECTION
  // ============================================
  selectGrade(grade) {
    this.state.selectedGrade = grade;
    this.state.selectedMathTeks = [];
    this.state.selectedScienceTeks = [];
    this.updateMissionLog(`[SEL] Clearance level: ${grade}`);
    this.loadTeksForGrade(grade);
    this.showScreen('teks-select');
  },

  // ============================================
  // TEKS LOADING
  // ============================================
  loadTeksForGrade(grade) {
    const teksData = TEKS_DATA[grade];
    if (!teksData) {
      console.error(`No TEKS data found for grade ${grade}`);
      return;
    }

    // Clear existing lists
    this.elements.mathTeksList.innerHTML = '';
    this.elements.scienceTeksList.innerHTML = '';

    // Populate math TEKS
    teksData.math.forEach(teks => {
      const item = this.createTeksItem(teks, 'math');
      this.elements.mathTeksList.appendChild(item);
    });

    // Populate science TEKS
    teksData.science.forEach(teks => {
      const item = this.createTeksItem(teks, 'science');
      this.elements.scienceTeksList.appendChild(item);
    });

    this.updateMissionLog(`[LOAD] ${teksData.math.length} math protocols`);
    this.updateMissionLog(`[LOAD] ${teksData.science.length} science protocols`);
  },

  createTeksItem(teks, type) {
    const item = document.createElement('div');
    item.className = 'teks-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'teks-checkbox';
    checkbox.dataset.code = teks.code;
    checkbox.dataset.type = type;
    checkbox.id = `${type}-teks-${teks.code}`;  // Unique ID with type prefix

    const label = document.createElement('label');
    label.className = 'teks-label';
    label.htmlFor = `${type}-teks-${teks.code}`;  // Match the unique ID

    const code = document.createElement('span');
    code.className = 'teks-code';
    code.textContent = teks.code;

    const description = document.createElement('span');
    description.className = 'teks-description';
    description.textContent = teks.description;

    label.appendChild(code);
    label.appendChild(description);

    item.appendChild(checkbox);
    item.appendChild(label);

    // Click handler for the whole item
    // IMPORTANT: Don't manually toggle if click was on:
    // - The checkbox itself (native behavior handles it)
    // - The label or its children (label's for attribute handles it)
    // Only manually toggle if clicking on the item div padding/margin area
    item.addEventListener('click', (e) => {
      if (e.target !== checkbox && e.target !== label && !label.contains(e.target)) {
        checkbox.checked = !checkbox.checked;
      }
      this.updateTeksSelection();
    });

    checkbox.addEventListener('change', () => {
      this.updateTeksSelection();
    });

    return item;
  },

  updateTeksSelection() {
    // Gather selected math TEKS
    const mathCheckboxes = this.elements.mathTeksList.querySelectorAll('.teks-checkbox:checked');
    this.state.selectedMathTeks = Array.from(mathCheckboxes).map(cb => cb.dataset.code);

    // Gather selected science TEKS
    const scienceCheckboxes = this.elements.scienceTeksList.querySelectorAll('.teks-checkbox:checked');
    this.state.selectedScienceTeks = Array.from(scienceCheckboxes).map(cb => cb.dataset.code);

    // Clear validation message
    this.elements.teksValidationMessage.textContent = '';
  },

  selectAllTeks(type) {
    const list = type === 'math' ? this.elements.mathTeksList : this.elements.scienceTeksList;
    const checkboxes = list.querySelectorAll('.teks-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
    this.updateTeksSelection();
    this.updateMissionLog(`[SEL] All ${type} protocols selected`);
  },

  clearAllTeks(type) {
    const list = type === 'math' ? this.elements.mathTeksList : this.elements.scienceTeksList;
    const checkboxes = list.querySelectorAll('.teks-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    this.updateTeksSelection();
    this.updateMissionLog(`[CLR] All ${type} protocols cleared`);
  },

  // ============================================
  // MISSION CONFIGURATION
  // ============================================
  async generateMission() {
    // Validate selections
    if (this.state.selectedMathTeks.length === 0) {
      this.elements.teksValidationMessage.textContent = 'Select at least 1 math protocol';
      return;
    }
    if (this.state.selectedScienceTeks.length === 0) {
      this.elements.teksValidationMessage.textContent = 'Select at least 1 science protocol';
      return;
    }

    // Get cross-curricular toggle state
    const crossCurricularToggle = document.getElementById('cross-curricular-toggle');
    const crossCurricular = crossCurricularToggle ? crossCurricularToggle.checked : true;

    // Get expression visibility toggle state
    const expressionToggle = document.getElementById('show-expression-toggle');
    this.missionState.showExpression = expressionToggle ? expressionToggle.checked : true;
    console.log('[ExprToggle] Stored showExpression:', this.missionState.showExpression);

    // Get problem format selection
    const activeFormat = document.querySelector('#format-selector .im-review-format-btn.active');
    this.state.problemFormat = activeFormat ? activeFormat.dataset.format : 'mix';

    // Get answer format selection
    const activeAnswerFormat = document.querySelector('#answer-format-selector .im-review-format-btn.active');
    this.state.answerFormat = activeAnswerFormat ? activeAnswerFormat.dataset.answerFormat : 'open';

    // Disable button to prevent double-clicks
    const generateBtn = document.getElementById('btn-generate-mission');
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.textContent = 'GENERATING...';
    }

    // Show progress indicator
    const msg = this.elements.teksValidationMessage;
    msg.style.cssText = 'color: #00d4ff; font-family: Orbitron, sans-serif; font-size: 1.1rem; text-align: center; padding: 1rem 0;';
    msg.textContent = 'GENERATING 10 MATH PROBLEMS VIA GROQ...';
    this.updateMissionLog('[GEN] Contacting Groq API...');

    try {
      const result = await window.cerebrasAPI.generateMission(
        this.state.selectedGrade,
        this.state.selectedMathTeks,
        this.state.selectedScienceTeks,
        {
          crossCurricular,
          format: this.state.problemFormat,
          answerFormat: this.state.answerFormat,
          onMathComplete: (math) => {
            msg.textContent = `${math.length} MATH PROBLEMS LOADED... GENERATING 3 SCIENCE QUESTIONS...`;
            this.updateMissionLog(`[GEN] ${math.length} math problems received`);
          }
        }
      );

      msg.textContent = `ALL ${result.math.length + result.science.length} PROBLEMS LOADED. CONFIGURING MISSION...`;
      this.updateMissionLog(`[GEN] AI generated ${result.math.length} math + ${result.science.length} science`);

      // Store generated problems for game consumption
      window.TEST_PROBLEMS.math = result.math;
      window.TEST_PROBLEMS.science = result.science;

      // Store combined array for console debugging
      this.missionState.problems = [...result.math, ...result.science];
      window.missionState = this.missionState;

      console.log('[Generation] Mission problems:', result);

      // Brief pause for UX
      await new Promise(r => setTimeout(r, 500));

    } catch (error) {
      console.error('[Generation] API call failed:', error);
      msg.style.color = '#ff6b35';
      msg.textContent = 'GENERATION FAILED. LOADING BACKUP PROTOCOLS...';
      this.updateMissionLog('[GEN] API failed \u2014 using fallback problems');

      // TEST_PROBLEMS already has fallback data from test-problems.js
      this.missionState.problems = [...window.TEST_PROBLEMS.math, ...window.TEST_PROBLEMS.science];
      window.missionState = this.missionState;

      await new Promise(r => setTimeout(r, 1500));
    }

    // Reset button and progress indicator
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.textContent = 'GENERATE MISSION';
    }
    msg.style.cssText = '';
    msg.textContent = '';

    // Update summary screen
    this.elements.summaryGrade.textContent = `GRADE ${this.state.selectedGrade}`;
    this.elements.summaryMathCount.textContent = `${this.state.selectedMathTeks.length} selected`;
    this.elements.summaryScienceCount.textContent = `${this.state.selectedScienceTeks.length} selected`;

    // Populate TEKS tags
    this.elements.summaryMathTags.innerHTML = '';
    this.state.selectedMathTeks.forEach(code => {
      const tag = document.createElement('span');
      tag.className = 'teks-tag';
      tag.textContent = code;
      this.elements.summaryMathTags.appendChild(tag);
    });

    this.elements.summaryScienceTags.innerHTML = '';
    this.state.selectedScienceTeks.forEach(code => {
      const tag = document.createElement('span');
      tag.className = 'teks-tag';
      tag.textContent = code;
      this.elements.summaryScienceTags.appendChild(tag);
    });

    this.updateMissionLog('[GEN] Mission parameters configured');

    // Show Teacher Review Screen instead of going straight to mission-configured
    if (window.TeacherReview) {
      const apiResult = {
        math: window.TEST_PROBLEMS.math,
        science: window.TEST_PROBLEMS.science
      };
      const self = this;
      window.TeacherReview.show(apiResult, {
        grade: this.state.selectedGrade,
        mathTeks: this.state.selectedMathTeks,
        scienceTeks: this.state.selectedScienceTeks,
        format: this.state.problemFormat,
        answerFormat: this.state.answerFormat,
        crossCurricular: crossCurricular,
        onLaunch: function(approvedResult) {
          // Replace problems with teacher-approved versions
          window.TEST_PROBLEMS.math = approvedResult.math;
          window.TEST_PROBLEMS.science = approvedResult.science;
          console.log('[Launch Debug] Science problems received:', approvedResult.science?.length, approvedResult.science);
          console.log('[Launch Debug] Math problems received:', approvedResult.math?.length, 'firewallNumbers:', approvedResult.math?.map(p => p.firewallNumber));
          console.log('[Launch Debug] Science afterFirewall values:', approvedResult.science?.map(q => q.afterFirewall));
          self.missionState.problems = [...approvedResult.math, ...approvedResult.science];
          window.missionState = self.missionState;
          self.updateMissionLog('[REVIEW] Teacher approved all problems. Launching mission.');
          window.TeacherReview.hide();
          self.beginMission();
        },
        onBack: function() {
          window.TeacherReview.hide();
          // Re-enable the Generate button
          const generateBtn = document.getElementById('btn-generate-mission');
          if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.textContent = 'GENERATE MISSION';
          }
          // Clear progress message
          if (self.elements.teksValidationMessage) {
            self.elements.teksValidationMessage.textContent = '';
            self.elements.teksValidationMessage.style.cssText = '';
          }
          self.updateMissionLog('[REVIEW] Teacher returned to setup screen.');
          self.showScreen('teks-select');
        }
      });
      this.showScreen('review');
      this.updateMissionLog('[REVIEW] Teacher reviewing generated problems...');
    } else {
      // Fallback: go directly to mission-configured if TeacherReview not loaded
      this.showScreen('mission-configured');
    }
  },

  beginMission() {
    // Phase 3: Initialize sound system on first mission start (user click satisfies autoplay policy)
    soundManager.init();
    soundManager.preloadCritical();
    soundManager.setAmbientVolume(this.state.settings.ambientVolume / 100);
    soundManager.setEffectsVolume(this.state.settings.effectsVolume / 100);
    soundManager.setVoiceVolume(this.state.settings.voiceVolume / 100);
    console.log('[Sound] SoundManager initialized, critical sounds preloading, saved volumes applied');

    // Phase 2: Use startMission for full gameplay loop
    this.startMission();
  },

  populateMissionObjectives() {
    this.elements.missionObjectives.innerHTML = '';

    // Add a subset of selected TEKS as objectives
    const allTeks = [...this.state.selectedMathTeks.slice(0, 3), ...this.state.selectedScienceTeks.slice(0, 3)];

    allTeks.forEach(code => {
      const row = document.createElement('div');
      row.className = 'objective-row';

      const codeSpan = document.createElement('span');
      codeSpan.className = 'objective-code';
      codeSpan.textContent = code;

      const bar = document.createElement('div');
      bar.className = 'objective-bar';

      const fill = document.createElement('div');
      fill.className = 'objective-fill';
      fill.style.width = '0%';

      bar.appendChild(fill);
      row.appendChild(codeSpan);
      row.appendChild(bar);
      this.elements.missionObjectives.appendChild(row);
    });
  },

  // ============================================
  // FIREWALL GAMEPLAY HELPERS
  // ============================================
  updateFirewallGrid() {
    const cells = this.elements.firewallGrid.querySelectorAll('.firewall-cell');
    cells.forEach((cell, index) => {
      const firewallNum = index + 1;
      cell.classList.remove('active', 'breached');

      if (firewallNum < this.state.currentFirewall) {
        cell.classList.add('breached');
      } else if (firewallNum === this.state.currentFirewall) {
        cell.classList.add('active');
      }
    });

    // Update current firewall display
    const currentFirewallEl = document.getElementById('current-firewall');
    if (currentFirewallEl) {
      currentFirewallEl.textContent = this.state.currentFirewall;
    }
  },

  updateProgress() {
    const progress = ((this.state.currentFirewall - 1) / this.state.totalFirewalls) * 100;
    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.firewallCount.textContent = `[${this.state.currentFirewall - 1}/${this.state.totalFirewalls} FIREWALLS]`;
  },

  /**
   * Set up the answer input area based on the current problem's answerType.
   * For comparison: show >, <, = buttons. For multipleChoice: show A/B/C/D buttons.
   * For default (integer/decimal/fraction): show the standard text input + DECRYPT.
   */
  _setupAdaptiveInput(problem) {
    const answerType = problem.answerType || 'integer';
    const answerSection = this.elements.answerInput.parentElement;
    const decryptBtn = document.getElementById('btn-decrypt');

    console.log('[MC Debug] _setupAdaptiveInput called, problem:', {
      answerType: problem.answerType,
      options: problem.options,
      mcCorrectLetter: problem.mcCorrectLetter,
      hasOptions: !!(problem.options && problem.options.length > 0)
    });

    // Remove any existing adaptive buttons from a previous problem
    const existing = document.getElementById('adaptive-answer-area');
    if (existing) existing.remove();

    if (answerType === 'comparison') {
      // Hide text input and DECRYPT button
      this.elements.answerInput.style.display = 'none';
      if (decryptBtn) decryptBtn.style.display = 'none';

      const container = document.createElement('div');
      container.id = 'adaptive-answer-area';
      container.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%;';

      const label = document.createElement('div');
      label.style.cssText = 'font-family: Orbitron, sans-serif; font-size: 0.9rem; color: #00d4ff; letter-spacing: 0.15em; text-transform: uppercase;';
      label.textContent = 'CHOOSE THE CORRECT SYMBOL';
      container.appendChild(label);

      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'display: flex; gap: 1rem; justify-content: center;';

      ['<', '=', '>'].forEach(symbol => {
        const btn = document.createElement('button');
        btn.textContent = symbol;
        btn.style.cssText = 'font-family: Orbitron, sans-serif; font-size: 2rem; font-weight: 700; color: #00d4ff; background: rgba(0, 212, 255, 0.08); border: 2px solid #00d4ff; min-width: 80px; min-height: 70px; cursor: pointer; transition: all 0.2s ease;';
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'rgba(0, 212, 255, 0.2)';
          btn.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.3)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'rgba(0, 212, 255, 0.08)';
          btn.style.boxShadow = 'none';
        });
        btn.addEventListener('click', () => {
          if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
          this.submitAdaptiveAnswer(symbol);
        });
        btnRow.appendChild(btn);
      });

      container.appendChild(btnRow);
      answerSection.appendChild(container);

    } else if (answerType === 'multipleChoice') {
      // Hide text input and DECRYPT button
      this.elements.answerInput.style.display = 'none';
      if (decryptBtn) decryptBtn.style.display = 'none';

      const options = problem.options || [];
      console.log('[MC Debug] MC branch entered, creating buttons for', options.length, 'options:', options);

      const container = document.createElement('div');
      container.id = 'adaptive-answer-area';
      container.className = 'mc-answer-area';

      const label = document.createElement('div');
      label.className = 'mc-answer-label';
      label.textContent = 'SELECT YOUR ANSWER';
      container.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'mc-answer-grid';

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'mc-answer-btn';
        btn.dataset.letter = opt.letter;

        const letterSpan = document.createElement('span');
        letterSpan.className = 'mc-letter';
        letterSpan.textContent = opt.letter;

        const textSpan = document.createElement('span');
        textSpan.className = 'mc-text';
        textSpan.textContent = opt.text;

        btn.appendChild(letterSpan);
        btn.appendChild(textSpan);

        btn.addEventListener('click', () => {
          if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
          this.submitAdaptiveAnswer(opt.letter);
        });

        grid.appendChild(btn);
      });

      container.appendChild(grid);
      answerSection.appendChild(container);

    } else {
      // Default: show text input + DECRYPT button (integer, decimal, fraction)
      console.log('[MC Debug] Open-response branch entered, answerType:', answerType);
      this.elements.answerInput.style.display = '';
      if (decryptBtn) decryptBtn.style.display = '';

      this.elements.answerInput.value = '';
      this.elements.answerInput.classList.remove('correct', 'incorrect');
      this.elements.answerInput.placeholder = answerType === 'fraction' ? 'ENTER FRACTION (e.g. 5/6)' : 'ENTER DECRYPTION KEY';
      this.elements.answerInput.focus();
    }
  },

  /**
   * Submit an answer from an adaptive button (comparison symbol or MC letter).
   * Uses the same correct/wrong answer flow as checkAnswer().
   */
  submitAdaptiveAnswer(answer) {
    if (typeof animator !== 'undefined' && animator.isAnimating) {
      return;
    }
    if (!this.missionState.currentProblem) {
      return;
    }

    const correctAnswer = this.missionState.currentProblem.correctAnswer;
    if (answer === correctAnswer) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  },

  // Navigate to Fury screen (for testing)
  showFuryScreen() {
    this.updateMissionLog('[INT] Nick Fury intercepted');
    this.showScreen('fury');
  },

  // ============================================
  // PHASE 2: GAMEPLAY LOGIC
  // ============================================

  /**
   * Start a new mission - initialize all gameplay state
   */
  startMission() {
    // Preserve generated problems and settings through reset
    const savedProblems = this.missionState.problems;
    const savedShowExpression = this.missionState.showExpression;

    // Reset mission state
    const actualMathCount = (window.TEST_PROBLEMS && window.TEST_PROBLEMS.math) ? window.TEST_PROBLEMS.math.length : 10;
    console.log('[StartMission Debug] mathTotal:', actualMathCount, 'scienceCount:', window.TEST_PROBLEMS?.science?.length);
    console.log('[StartMission Debug] Science afterFirewall values:', window.TEST_PROBLEMS?.science?.map(q => q.afterFirewall));
    this.missionState = {
      currentFirewall: 1,
      mathCorrect: 0,
      mathTotal: actualMathCount,
      scienceCorrect: 0,
      scienceTotal: 3,
      wrongAttempts: 0,
      missionStartTime: Date.now(),
      isComplete: false,
      currentProblem: null,
      currentScienceQuestion: null,
      currentFirewallAttempted: false,
      currentScienceAttempted: false,
      widowIntroPlayed: false,
      widowAppearances: 0,
      lastWidowFirewall: -10,
      wrongAttemptsThisFirewall: 0,
      showExpression: savedShowExpression !== undefined ? savedShowExpression : true,
      problems: savedProblems || [...window.TEST_PROBLEMS.math, ...window.TEST_PROBLEMS.science]
    };
    window.missionState = this.missionState;

    this.state.missionInProgress = true;
    this.state.currentFirewall = 1;
    this.saveMissionState();

    this.updateMissionLog('[INIT] Mission commenced');
    this.updateMissionLog('[FW] Accessing firewall 1');

    // Populate mission objectives
    this.populateMissionObjectives();

    // Play Black Widow intro, then load Firewall 1
    this.playWidowIntro(() => {
      this.loadFirewall(1);
      this.showScreen('firewall');
    });
  },

  /**
   * Play the Black Widow intro sequence
   * Crimson PixiJS glitch animation + "ENCRYPTED TRANSMISSION" overlay
   * Reference: Brief Section "APPEARANCE 1: THE INTRODUCTION"
   * @param {function} callback - Called when intro is complete, to continue mission
   */
  playWidowIntro(callback) {
    // Only play once per mission
    if (this.missionState.widowIntroPlayed) {
      console.log('[WidowIntro] Already played, skipping');
      if (callback) callback();
      return;
    }
    this.missionState.widowIntroPlayed = true;

    // Get DOM elements
    const overlay = document.getElementById('transition-overlay');
    const widowIntroContent = document.getElementById('widow-intro-content');
    const widowIntroText = document.getElementById('widow-intro-text');

    if (!overlay || !widowIntroContent) {
      console.warn('[WidowIntro] DOM elements not found, skipping');
      if (callback) callback();
      return;
    }

    // Set intro message text (randomly pick WIDOW-INTRO-01 or WIDOW-INTRO-02)
    const introMessages = [
      "Tony, it's Natasha. I couldn't let Fury keep those plans locked away forever. I've left breadcrumbs in the system. Your team is good \u2014 use them.",
      "Stark, it's Romanoff. I know what Fury's doing with those plans, and I can't let it happen. I'm leaving you some help along the way. Don't tell him I reached out."
    ];
    if (widowIntroText) {
      widowIntroText.textContent = introMessages[Math.floor(Math.random() * introMessages.length)];
    }

    const pauseDuration = (HUD_CONFIG.timing.widowIntroPauseDuration || 2.5) * 1000;
    const holdDuration = Math.max(HUD_CONFIG.timing.widowIntroDuration || 8, 0) * 1000;

    console.log('[WidowIntro] Starting dramatic pause');
    this.updateMissionLog('[WIDOW] Encrypted transmission detected');

    // Step 1: Dramatic pause before the intro begins
    setTimeout(() => {
      console.log('[WidowIntro] Playing glitch');

      // Sound: Widow intro
      console.log('[Sound] Widow intro → widow-appearance + glitch-static');
      soundManager.play('widow-appearance');
      soundManager.play('glitch-static', { delay: 0.1 });

      // Step 2: Show overlay and start PixiJS glitch animation
      overlay.classList.add('active');
      gsap.set(overlay, { opacity: 1 });

      if (window.transitionEngine && window.transitionEngine.playWidowGlitch) {
        window.transitionEngine.playWidowGlitch();
      }

      // Step 3: After 500ms, fade in intro content on top of glitch
      setTimeout(() => {
        console.log('[WidowIntro] Showing content');
        widowIntroContent.classList.add('im-widow-intro-active');
      }, 500);

      // Step 4: At 2s, kill glitch timeline before its fade-out and clean up PixiJS
      setTimeout(() => {
        if (window.transitionEngine) {
          if (window.transitionEngine.activeTimeline) {
            window.transitionEngine.activeTimeline.kill();
            window.transitionEngine.activeTimeline = null;
          }
          window.transitionEngine.isPlaying = false;
        }
        if (window.pixiEffectManager) {
          window.pixiEffectManager.reset();
        }
        const transitionContent = document.getElementById('transition-content');
        if (transitionContent) transitionContent.innerHTML = '';
      }, 2000);

      // Step 5: Hold for full duration, then fade out
      setTimeout(() => {
        console.log('[WidowIntro] Fading out');
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            // Cleanup
            overlay.classList.remove('active');
            gsap.set(overlay, { clearProps: 'opacity' });
            widowIntroContent.classList.remove('im-widow-intro-active');
            this.updateMissionLog('[WIDOW] Signal lost');
            console.log('[WidowIntro] Complete, continuing mission');
            if (callback) callback();
          }
        });
      }, holdDuration);
    }, pauseDuration);
  },

  /**
   * Show the Black Widow floating panel with a message and auto-destruct countdown
   * Shared by gameplay hints and final transmission
   * @param {string} message - The message to display
   * @param {number} duration - How long to show the panel (seconds)
   * @param {function} [callback] - Called after panel auto-destructs
   */
  showWidowPanel(message, duration, callback) {
    const widowPanel = document.getElementById('widow-panel');
    const widowMessageText = document.getElementById('widow-message-text');
    const widowTimerText = document.getElementById('widow-timer-text');

    if (!widowPanel || !widowMessageText) {
      console.warn('[WidowPanel] DOM elements not found, skipping');
      if (callback) callback();
      return;
    }

    console.log('[WidowPanel] Showing: "' + message.substring(0, 50) + '..."');

    // Set message text
    widowMessageText.textContent = message;

    // Set initial timer display
    let remaining = Math.ceil(duration);
    if (widowTimerText) {
      widowTimerText.textContent = 'AUTO-DESTRUCT: ' + remaining + 's';
    }

    // Sound: Widow hint panel
    console.log('[Sound] Widow hint → hint-chime');
    soundManager.play('hint-chime');

    // Show the panel
    widowPanel.classList.add('im-widow-panel-active');

    // Countdown timer updates every second
    const timerInterval = setInterval(() => {
      remaining--;
      if (remaining > 0 && widowTimerText) {
        widowTimerText.textContent = 'AUTO-DESTRUCT: ' + remaining + 's';
      }
    }, 1000);

    // Auto-dismiss after duration
    setTimeout(() => {
      clearInterval(timerInterval);
      widowPanel.classList.remove('im-widow-panel-active');
      console.log('[WidowPanel] Auto-destruct complete');
      if (callback) callback();
    }, duration * 1000);
  },

  /**
   * Check if Black Widow should appear with a gameplay hint after a wrong answer
   * Runs after the wrong-answer animation completes
   */
  checkWidowHint() {
    const ms = this.missionState;

    // All conditions must be true for Widow to appear
    if (ms.wrongAttemptsThisFirewall < 2) return; // Widow hint available after 2 wrong attempts (teacher preference)
    if (ms.widowAppearances >= 4) return;
    if ((ms.currentFirewall - ms.lastWidowFirewall) < 2) return;

    // All conditions passed - show Widow hint
    ms.widowAppearances++;
    ms.lastWidowFirewall = ms.currentFirewall;

    const genericHints = [
      "Tony, your team is close. Look at the relationship between the numbers.",
      "Psst \u2014 the answer isn't as big as you think. Simplify.",
      "Break it into smaller pieces. That's how I crack codes too.",
      "Young agents, slow down. Read the problem one more time.",
      "Sometimes the simplest approach is the right one. Don't overthink it.",
      "Stark, have your recruits estimate first. Then get precise.",
      "Check your work. Plug the answer back in \u2014 does it make sense?",
      "I've seen this encryption before. Focus on the basics."
    ];

    const hint = genericHints[Math.floor(Math.random() * genericHints.length)];
    const duration = Math.max(HUD_CONFIG.timing.widowHintDuration || 5, 0);

    this.updateMissionLog('[WIDOW] Hint transmission intercepted');
    this.showWidowPanel(hint, duration);
  },

  /**
   * Play Black Widow's final transmission after FW9 science, before FW10
   * Always fires regardless of previous appearance count
   * @param {function} callback - Called after panel auto-destructs, to continue to FW10
   */
  playWidowFinalTransmission(callback) {
    console.log('[WidowFinal] Playing final transmission before FW10');

    const finalMessages = [
      "This is it, Tony. Fury's watching now. Don't let him catch you. Good luck.",
      "Last firewall, Stark. I've done what I can. The rest is up to your team.",
      "You're almost there. Fury doesn't know I helped you. Let's keep it that way. Finish this.",
      "Final transmission, Tony. Your recruits have come this far \u2014 they can do this. I believe in them."
    ];

    const message = finalMessages[Math.floor(Math.random() * finalMessages.length)];
    const duration = Math.max(HUD_CONFIG.timing.widowFinalDuration || 6, 0);

    this.updateMissionLog('[WIDOW] Final transmission incoming');

    // Sound: Widow final transmission
    console.log('[Sound] Widow final → widow-appearance');
    soundManager.play('widow-appearance');

    this.showWidowPanel(message, duration, callback);
  },

  /**
   * Load a specific firewall (math problem or transition to Fury)
   * @param {number} firewallNumber - The firewall number (1-10)
   */
  loadFirewall(firewallNumber) {
    this.missionState.currentFirewall = firewallNumber;
    this.state.currentFirewall = firewallNumber;
    this.missionState.currentFirewallAttempted = false;  // Reset for new firewall
    this.missionState.wrongAttemptsThisFirewall = 0;   // Reset wrong attempts counter

    // All firewalls (1-10) are math problems
    // Science questions appear AFTER completing firewalls 3, 6, 9

    // Get the math problem for this firewall — skip missing slots
    let problem = getMathProblem(firewallNumber);
    if (!problem) {
      console.warn(`[Firewall] Problem missing for firewall ${firewallNumber}, advancing to next`);
      // Try to find the next available firewall
      for (let next = firewallNumber + 1; next <= 10; next++) {
        const nextProblem = getMathProblem(next);
        if (nextProblem) {
          this.loadFirewall(next);
          return;
        }
      }
      // No more firewalls available — go to victory
      console.log('[Firewall] No more problems available, advancing to victory');
      this.showVictoryScreen();
      return;
    }

    this.missionState.currentProblem = problem;

    // Update UI
    this.elements.currentFirewallDisplay.textContent = firewallNumber;
    this.elements.problemNarrative.textContent = problem.narrative;
    // Always set expression content; toggle only controls visibility
    this.elements.problemExpression.textContent = problem.expression;
    this.elements.problemExpression.style.display = this.missionState.showExpression ? '' : 'none';
    console.log('[ExprToggle] Reading showExpression:', this.missionState.showExpression, 'display:', this.elements.problemExpression.style.display);
    // Clear Jarvis dialogue on new problem load — text appears only after answer
    this.elements.jarvisDialogue.textContent = '';
    if (typeof soundManager !== 'undefined') soundManager.play('ui-type');
    console.log('[Sound] New problem loaded → ui-type');

    // Classroom TV readability: increase font sizes (setProperty with important
    // to override any CSS !important rules that may exist on .problem-narrative)
    this.elements.problemNarrative.style.setProperty('font-size', '1.4rem', 'important');
    this.elements.problemNarrative.style.setProperty('line-height', '1.4', 'important');
    this.elements.problemExpression.style.fontSize = '2.5rem';
    this.elements.problemExpression.style.fontWeight = '700';
    this.elements.problemExpression.style.lineHeight = '1.3';
    this.elements.jarvisDialogue.style.fontSize = '1.1rem';
    this.elements.answerInput.style.fontSize = '1.5rem';
    const decryptBtn = document.getElementById('btn-decrypt');
    if (decryptBtn) decryptBtn.style.fontSize = '1.2rem';

    // Set up adaptive answer input based on problem's answerType
    this._setupAdaptiveInput(problem);

    // Update firewall grid and progress
    this.updateFirewallGrid();
    this.updateProgress();

    this.updateMissionLog(`[FW] Firewall ${firewallNumber} - ${problem.operation}`);
  },

  /**
   * Check the user's answer for the current math problem
   */
  checkAnswer() {
    // Prevent answer submission during animations
    if (typeof animator !== 'undefined' && animator.isAnimating) {
      return;
    }

    if (!this.missionState.currentProblem) {
      return;
    }

    const userInput = this.elements.answerInput.value.trim();
    const problem = this.missionState.currentProblem;
    const correctAnswer = problem.correctAnswer;

    // Fraction answer: parse "5/6" and compare by cross-multiplication
    if (problem.answerType === 'fraction' && typeof correctAnswer === 'object') {
      const fractionMatch = userInput.match(/^(-?\d+)\s*\/\s*(\d+)$/);
      if (fractionMatch) {
        const userNum = parseInt(fractionMatch[1]);
        const userDen = parseInt(fractionMatch[2]);
        if (userDen !== 0 && userNum * correctAnswer.denominator === correctAnswer.numerator * userDen) {
          this.handleCorrectAnswer();
        } else {
          this.handleWrongAnswer();
        }
        return;
      }
      // Handle whole number input (e.g. "2" when answer is 2/1)
      const wholeNum = parseFloat(userInput);
      if (!isNaN(wholeNum) && correctAnswer.denominator === 1 && wholeNum === correctAnswer.numerator) {
        this.handleCorrectAnswer();
        return;
      }
      if (userInput === '') {
        this.elements.jarvisDialogue.textContent = '"Enter a fraction like 5/6 or a whole number."';
      } else {
        this.handleWrongAnswer();
      }
      return;
    }

    // Standard numeric answer
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer)) {
      this.elements.jarvisDialogue.textContent = '"Invalid input. Enter a numeric decryption key."';
      this.elements.answerInput.classList.add('incorrect');
      setTimeout(() => {
        this.elements.answerInput.classList.remove('incorrect');
      }, 500);
      return;
    }

    if (userAnswer === correctAnswer) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  },

  /**
   * Handle a correct answer - update UI and advance
   */
  handleCorrectAnswer() {
    const currentFW = this.missionState.currentFirewall;

    // Only increment score if this is a first-attempt correct answer
    if (!this.missionState.currentFirewallAttempted) {
      this.missionState.mathCorrect++;
      this.updateMissionLog(`[OK] Firewall ${currentFW} breached (first attempt)`);
    } else {
      this.updateMissionLog(`[OK] Firewall ${currentFW} breached (retry - no score)`);
    }

    // Mark firewall as breached in grid
    const cell = this.elements.firewallGrid.querySelector(`[data-firewall="${currentFW}"]`);
    if (cell) {
      cell.classList.remove('active');
      cell.classList.add('breached');
    }

    // Update progress
    this.updateProgress();

    // Sound: correct answer feedback
    console.log('[Sound] Correct answer → access-granted + arc-reactor-pulse');
    soundManager.play('access-granted');
    soundManager.play('arc-reactor-pulse', { delay: 0.3 });

    // Pick response bank line and pass to animation (ScrambleText uses the parameter, not DOM)
    let correctLine = '"Processing..."';
    if (typeof JARVIS_CORRECT_LINES !== 'undefined') {
      correctLine = '"' + getRandomLine(JARVIS_CORRECT_LINES) + '"';
    }

    // Play GSAP animation sequence, then advance
    animator.playCorrectSequence(() => {
      console.log('[Fury Debug] handleCorrectAnswer callback: currentFW=', currentFW, 'mathTotal=', this.missionState.mathTotal, 'shouldShowFury=', shouldShowFuryAfter(currentFW));

      // Check Fury FIRST — science questions after FW 3, 6, 9 take priority over victory
      // (Without this order, if mathTotal === 3/6/9, victory would trigger before Fury)
      if (shouldShowFuryAfter(currentFW)) {
        this.showFuryQuestion(currentFW);
        return;
      }

      // Check if mission complete (after last firewall)
      if (currentFW >= (this.missionState.mathTotal || 10)) {
        this.showVictoryScreen();
        return;
      }

      // Advance to next firewall with transition animation
      if (window.transitionEngine) {
        window.transitionEngine.playTransition((type) => {
          this.loadFirewall(currentFW + 1);
        });
      } else {
        // Fallback if transitionEngine not available
        this.loadFirewall(currentFW + 1);
      }
    }, correctLine);
  },

  /**
   * Handle a wrong answer - show feedback, stay on current firewall
   */
  handleWrongAnswer() {
    this.missionState.wrongAttempts++;
    this.missionState.wrongAttemptsThisFirewall++;
    this.missionState.currentFirewallAttempted = true;  // Mark that this firewall had a wrong attempt

    this.updateMissionLog(`[FAIL] Incorrect attempt on firewall ${this.missionState.currentFirewall}`);

    // Sound: wrong answer feedback
    console.log('[Sound] Wrong answer → wrong-answer');
    soundManager.play('wrong-answer');

    // Pick response bank line and pass to animation (ScrambleText uses the parameter, not DOM)
    let wrongLine = '"Decryption failed..."';
    if (typeof JARVIS_WRONG_MATH_LINES !== 'undefined') {
      wrongLine = '"' + getRandomLine(JARVIS_WRONG_MATH_LINES) + '"';
    }

    // Play GSAP wrong answer animation (input is automatically unlocked after)
    animator.playWrongSequence(() => {
      // Tier 1: Jarvis gives a generic text hint on 1st wrong answer
      if (this.missionState.wrongAttemptsThisFirewall === 1) {
        const hint = JARVIS_GENERIC_HINTS[Math.floor(Math.random() * JARVIS_GENERIC_HINTS.length)];
        console.log('[Hint] Jarvis generic hint:', hint);
        // Phase 5: Replace with pattern-specific hints from pattern-detector.js
        setTimeout(() => {
          if (this.elements.jarvisDialogue) {
            this.elements.jarvisDialogue.textContent = '"' + hint + '"';
          }
        }, 1500);
      }

      // Tier 2: Check if Widow should appear (2nd+ wrong answer)
      this.checkWidowHint();
    }, wrongLine);
  },

  /**
   * Show Nick Fury's science question
   * @param {number} afterFirewall - The firewall number (3, 6, or 9)
   */
  showFuryQuestion(afterFirewall) {
    console.log('[Fury Debug] showFuryQuestion called for afterFirewall:', afterFirewall);
    console.log('[Fury Debug] TEST_PROBLEMS.science:', window.TEST_PROBLEMS.science?.length, 'afterFirewall values:', window.TEST_PROBLEMS.science?.map(q => q.afterFirewall));
    const question = getScienceQuestion(afterFirewall);
    console.log('[Fury Debug] getScienceQuestion result:', question ? 'FOUND' : 'NULL', question);
    if (!question) {
      console.error(`No science question found for firewall ${afterFirewall}`);
      // Skip to next math firewall
      this.loadFirewall(afterFirewall + 1);
      return;
    }

    this.missionState.currentScienceQuestion = question;
    this.missionState.currentScienceAttempted = false;  // Reset for new science question

    this.updateMissionLog(`[FURY] Security protocol initiated`);

    // Sound: Fury alert
    console.log('[Sound] Fury alert → warning + glitch-heavy');
    soundManager.play('warning');
    soundManager.play('glitch-heavy', { delay: 0.2 });

    // Play Fury alert animation (red pulses), then show Fury screen
    animator.playFuryAlert(() => {
      // Update Fury screen content
      this.elements.furyQuestion.textContent = question.question;

      // Update answer options
      const optionButtons = this.elements.furyOptions.querySelectorAll('.fury-option');
      optionButtons.forEach((btn, index) => {
        if (question.options[index]) {
          const opt = question.options[index];
          btn.dataset.option = opt.letter;
          btn.querySelector('.option-letter').textContent = opt.letter;
          btn.querySelector('.option-text').textContent = opt.text;
          btn.classList.remove('correct', 'incorrect');
          btn.style.display = 'flex';
        } else {
          btn.style.display = 'none';
        }
      });

      this.showScreen('fury');
      animator.unlockInput();  // Allow clicking Fury answer options
    });
  },

  /**
   * Check the user's answer for the science question
   * @param {string} letter - The selected option letter (A, B, C, or D)
   * @param {HTMLElement} buttonElement - The clicked button element
   */
  checkScienceAnswer(letter, buttonElement) {
    // Prevent answer submission during animations
    if (typeof animator !== 'undefined' && animator.isAnimating) {
      return;
    }

    if (!this.missionState.currentScienceQuestion) {
      return;
    }

    const correctAnswer = this.missionState.currentScienceQuestion.correctAnswer;

    if (letter === correctAnswer) {
      this.handleCorrectScienceAnswer(buttonElement);
    } else {
      this.handleWrongScienceAnswer(buttonElement);
    }
  },

  /**
   * Handle correct science answer
   * @param {HTMLElement} buttonElement - The clicked button element
   */
  handleCorrectScienceAnswer(buttonElement) {
    const currentFW = this.missionState.currentFirewall;

    // Only increment score if this is a first-attempt correct answer
    if (!this.missionState.currentScienceAttempted) {
      this.missionState.scienceCorrect++;
      this.updateMissionLog(`[FURY] Security verification passed (first attempt)`);
    } else {
      this.updateMissionLog(`[FURY] Security verification passed (retry - no score)`);
    }

    // Sound: science correct
    console.log('[Sound] Science correct → science-correct');
    soundManager.play('science-correct');

    // Visual feedback
    buttonElement.classList.add('correct');

    // Update Fury quote to show success
    this.elements.furyQuoteText.textContent = '"Security verified. You may proceed, but I\'ll be watching."';

    // Advance after delay
    setTimeout(() => {
      buttonElement.classList.remove('correct');

      // Reset Fury quote for next time
      this.elements.furyQuoteText.textContent = '"Looks like someone\'s been busy. I\'m Nick Fury, and I\'ve got a little security measure for your recruits."';

      // Move to next firewall
      const nextFW = currentFW + 1;
      if (nextFW > (this.missionState.mathTotal || 10)) {
        this.showVictoryScreen();
      } else {
        // Helper to advance to the next firewall with transition animation
        const advanceToNext = () => {
          if (window.transitionEngine) {
            window.transitionEngine.playTransition((type) => {
              this.loadFirewall(nextFW);
              this.showScreen('firewall');
            });
          } else {
            this.loadFirewall(nextFW);
            this.showScreen('firewall');
          }
        };

        // Black Widow final transmission after FW9 science, before FW10
        if (currentFW === 9) {
          this.playWidowFinalTransmission(advanceToNext);
        } else {
          advanceToNext();
        }
      }
    }, 1500);
  },

  /**
   * Handle wrong science answer
   * @param {HTMLElement} buttonElement - The clicked button element
   */
  handleWrongScienceAnswer(buttonElement) {
    this.missionState.wrongAttempts++;
    this.missionState.currentScienceAttempted = true;  // Mark that this science question had a wrong attempt

    this.updateMissionLog(`[FURY] Security verification failed`);

    // Sound: science wrong
    console.log('[Sound] Science wrong → science-wrong');
    soundManager.play('science-wrong');

    // Visual feedback
    buttonElement.classList.add('incorrect');

    // Update Fury quote with random response bank line
    if (typeof FURY_WRONG_SCIENCE_LINES !== 'undefined') {
      this.elements.furyQuoteText.textContent = '"' + getRandomLine(FURY_WRONG_SCIENCE_LINES) + '"';
    } else {
      this.elements.furyQuoteText.textContent = '"Incorrect. Try again. I don\'t have all day."';
    }

    // Clear incorrect class after animation
    setTimeout(() => {
      buttonElement.classList.remove('incorrect');
    }, 500);
  },

  /**
   * Show the victory screen with final scores
   */
  showVictoryScreen() {
    this.missionState.isComplete = true;
    this.state.missionInProgress = false;

    // Sound: Victory theme
    console.log('[Sound] Victory → the-avengers-theme');
    soundManager.play('the-avengers-theme');

    // Clear saved mission state
    localStorage.removeItem('ironman-mission-state');

    // Calculate duration
    const duration = Date.now() - this.missionState.missionStartTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    const durationStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Calculate total score
    const totalCorrect = this.missionState.mathCorrect + this.missionState.scienceCorrect;
    const totalPossible = this.missionState.mathTotal + this.missionState.scienceTotal;

    // Update victory screen
    this.elements.victoryMathScore.textContent = `${this.missionState.mathCorrect}/${this.missionState.mathTotal}`;
    this.elements.victoryScienceScore.textContent = `${this.missionState.scienceCorrect}/${this.missionState.scienceTotal}`;
    this.elements.victoryTotalScore.textContent = `${totalCorrect}/${totalPossible}`;
    this.elements.victoryDuration.textContent = durationStr;
    this.elements.victoryWrongAttempts.textContent = this.missionState.wrongAttempts;

    this.updateMissionLog('[VICTORY] Mission complete - Arc reactor schematics retrieved');

    // Update progress to 100%
    this.elements.progressFill.style.width = '100%';
    this.elements.firewallCount.textContent = '[10/10 FIREWALLS]';

    // Mark all firewalls as breached
    const cells = this.elements.firewallGrid.querySelectorAll('.firewall-cell');
    cells.forEach(cell => {
      cell.classList.remove('active');
      cell.classList.add('breached');
    });

    this.showScreen('victory');
  },

  /**
   * Reset and start a new mission from victory screen
   */
  resetMission() {
    // Stop all audio (loops, effects, and victory theme)
    soundManager.stopAll(0.5);
    console.log('[Sound] Stopping all audio on reset');

    // Reset all state
    this.missionState = {
      currentFirewall: 1,
      mathCorrect: 0,
      mathTotal: 10,
      scienceCorrect: 0,
      scienceTotal: 3,
      wrongAttempts: 0,
      missionStartTime: null,
      isComplete: false,
      currentProblem: null,
      currentScienceQuestion: null,
      currentFirewallAttempted: false,
      currentScienceAttempted: false,
      widowIntroPlayed: false,
      widowAppearances: 0,
      lastWidowFirewall: -10,
      wrongAttemptsThisFirewall: 0
    };

    this.state.currentFirewall = 0;
    this.state.missionInProgress = false;

    // Reset firewall grid
    const cells = this.elements.firewallGrid.querySelectorAll('.firewall-cell');
    cells.forEach(cell => {
      cell.classList.remove('active', 'breached');
    });

    // Reset progress
    this.elements.progressFill.style.width = '0%';
    this.elements.firewallCount.textContent = '[0/10 FIREWALLS]';

    // Hide mission options
    this.elements.missionOptions.style.display = 'none';

    this.updateMissionLog('[RESET] Mission reset - Ready for new mission');
    this.showScreen('grade-select');
  },

  // ============================================
  // MISSION LOG
  // ============================================
  updateMissionLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    this.elements.missionLog.appendChild(entry);
    this.elements.missionLog.scrollTop = this.elements.missionLog.scrollHeight;
  },

  // ============================================
  // SETTINGS & PERSISTENCE
  // ============================================
  loadSettings() {
    const saved = localStorage.getItem('ironman-mission-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.state.settings = { ...this.state.settings, ...settings };

        // Apply to sliders
        if (this.elements.volumeAmbient) {
          this.elements.volumeAmbient.value = this.state.settings.ambientVolume;
        }
        if (this.elements.volumeEffects) {
          this.elements.volumeEffects.value = this.state.settings.effectsVolume;
        }
        if (this.elements.volumeVoice) {
          this.elements.volumeVoice.value = this.state.settings.voiceVolume;
        }
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  },

  saveSettings() {
    localStorage.setItem('ironman-mission-settings', JSON.stringify(this.state.settings));
  },

  saveMissionState() {
    localStorage.setItem('ironman-mission-state', JSON.stringify({
      missionInProgress: this.state.missionInProgress,
      selectedGrade: this.state.selectedGrade,
      selectedMathTeks: this.state.selectedMathTeks,
      selectedScienceTeks: this.state.selectedScienceTeks,
      currentFirewall: this.state.currentFirewall
    }));
  },

  loadMissionState() {
    const saved = localStorage.getItem('ironman-mission-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading mission state:', e);
      }
    }
    return null;
  },

  checkResumeMission() {
    const savedState = this.loadMissionState();
    if (savedState && savedState.missionInProgress) {
      this.elements.missionOptions.style.display = 'flex';
    }
  },

  resumeMission() {
    const savedState = this.loadMissionState();
    if (savedState) {
      this.state.selectedGrade = savedState.selectedGrade;
      this.state.selectedMathTeks = savedState.selectedMathTeks;
      this.state.selectedScienceTeks = savedState.selectedScienceTeks;
      this.state.currentFirewall = savedState.currentFirewall;
      this.state.missionInProgress = true;

      this.updateMissionLog('[RES] Previous mission restored');
      this.populateMissionObjectives();
      this.loadFirewall(savedState.currentFirewall);  // Load the problem for the current firewall
      this.showScreen('firewall');
    }
  },

  newMission() {
    localStorage.removeItem('ironman-mission-state');
    this.state.missionInProgress = false;
    this.elements.missionOptions.style.display = 'none';
    this.updateMissionLog('[NEW] Starting new mission');
  },

  // ============================================
  // CLOCK & DATE
  // ============================================
  startClock() {
    const updateClock = () => {
      const now = new Date();

      // Time
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.elements.clock.textContent = `${hours}:${minutes}:${seconds}`;

      // Date
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[now.getMonth()];
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      this.elements.date.textContent = `${month} ${day}, ${year}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  },

  // ============================================
  // EVENT BINDINGS
  // ============================================
  bindEvents() {
    // Grade buttons
    document.querySelectorAll('.grade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
        const grade = parseInt(btn.dataset.grade);
        this.selectGrade(grade);
      });
    });

    // TEKS action buttons
    document.querySelectorAll('.teks-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
        const action = btn.dataset.action;
        const type = btn.dataset.type;

        if (action === 'select-all') {
          this.selectAllTeks(type);
        } else if (action === 'clear') {
          this.clearAllTeks(type);
        }
      });
    });

    // Navigation buttons
    document.getElementById('btn-back-to-grade')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.showScreen('grade-select');
    });

    document.getElementById('btn-generate-mission')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.generateMission();
    });

    // Format selector buttons (mutually exclusive)
    document.querySelectorAll('#format-selector .im-review-format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#format-selector .im-review-format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.problemFormat = btn.dataset.format;
      });
    });

    // Answer format selector buttons (mutually exclusive)
    document.querySelectorAll('#answer-format-selector .im-review-format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#answer-format-selector .im-review-format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.answerFormat = btn.dataset.answerFormat;
        console.log('[Setup] Answer format:', btn.dataset.answerFormat);
      });
    });

    document.getElementById('btn-reconfigure')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.showScreen('teks-select');
    });

    document.getElementById('btn-begin-mission')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.beginMission();
    });

    document.getElementById('btn-resume-mission')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.resumeMission();
    });

    document.getElementById('btn-new-mission')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.newMission();
    });

    // Decrypt button - Phase 2: Check answer
    document.getElementById('btn-decrypt')?.addEventListener('click', () => {
      this.checkAnswer();
    });

    // Fury options - Phase 2: Check science answer
    document.querySelectorAll('.fury-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const option = btn.dataset.option;
        this.checkScienceAnswer(option, btn);
      });
    });

    // Victory screen - New mission button
    document.getElementById('btn-new-mission-victory')?.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined') soundManager.play('ui-click');
      this.resetMission();
    });

    // Volume sliders
    // Phase 3: Volume sliders wired to soundManager
    this.elements.volumeAmbient?.addEventListener('input', (e) => {
      this.state.settings.ambientVolume = parseInt(e.target.value);
      this.saveSettings();
      soundManager.setAmbientVolume(e.target.value / 100);
      console.log('[Sound] Volume changed: ambient', e.target.value / 100);
    });

    this.elements.volumeEffects?.addEventListener('input', (e) => {
      this.state.settings.effectsVolume = parseInt(e.target.value);
      this.saveSettings();
      soundManager.setEffectsVolume(e.target.value / 100);
      console.log('[Sound] Volume changed: effects', e.target.value / 100);
    });

    this.elements.volumeVoice?.addEventListener('input', (e) => {
      this.state.settings.voiceVolume = parseInt(e.target.value);
      this.saveSettings();
      soundManager.setVoiceVolume(e.target.value / 100);
      console.log('[Sound] Volume changed: voice', e.target.value / 100);
    });

    // Keyboard shortcuts (prepare for Phase 2)
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          // Advance (Phase 2)
          e.preventDefault();
          this.updateMissionLog('[KEY] Space pressed - Advance');
          break;
        case 'KeyH':
          // Hint (Phase 2)
          this.updateMissionLog('[KEY] H pressed - Hint requested');
          break;
        case 'KeyM':
          // Mic toggle (Phase 2)
          this.updateMissionLog('[KEY] M pressed - Mic toggle');
          break;
        case 'KeyP':
          // Pause (Phase 2)
          this.updateMissionLog('[KEY] P pressed - Pause');
          break;
        case 'KeyR':
          // Resume (Phase 2)
          this.updateMissionLog('[KEY] R pressed - Resume');
          break;
        case 'Enter':
          // Submit answer on firewall screen (text input problems only)
          if (this.state.currentScreen === 'firewall') {
            const at = this.missionState.currentProblem?.answerType;
            if (at !== 'comparison' && at !== 'multipleChoice') {
              this.checkAnswer();
            }
          }
          break;
        case 'KeyA':
        case 'KeyB':
        case 'KeyC':
        case 'KeyD':
          // MC answer shortcuts — A/B/C/D keys on firewall screen
          if (this.state.currentScreen === 'firewall' &&
              this.missionState.currentProblem?.answerType === 'multipleChoice' &&
              !e.ctrlKey && !e.altKey && !e.metaKey) {
            const letter = e.code.charAt(3); // 'KeyA' → 'A'
            const mcBtn = document.querySelector(`.mc-answer-btn[data-letter="${letter}"]`);
            if (mcBtn) {
              e.preventDefault();
              mcBtn.click();
            }
          }
          break;
        case 'KeyF':
          // Teacher override - manually trigger Fury science screen (useful for classroom flexibility)
          if (e.ctrlKey) {
            e.preventDefault();
            this.showFuryScreen();
          }
          break;
      }
    });

    // Enter key in answer input
    document.getElementById('answer-input')?.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-decrypt')?.click();
      }
    });

    // Throttled UI hover sound (delegated, capture phase for mouseenter)
    let lastHoverSoundTime = 0;
    document.body.addEventListener('mouseenter', (e) => {
      if (e.target.closest('button')) {
        const now = Date.now();
        if (now - lastHoverSoundTime > 150) {
          lastHoverSoundTime = now;
          if (typeof soundManager !== 'undefined') soundManager.play('ui-hover');
        }
      }
    }, true);
  }
};

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Expose App globally for debugging (can be removed in production)
window.App = App;
