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
    currentScienceQuestion: null
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
    this.bindEvents();
    this.startClock();
    this.showScreen('grade-select');
    this.checkResumeMission();

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
      'victory': document.getElementById('screen-victory')
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
    checkbox.id = `teks-${teks.code}`;

    const label = document.createElement('label');
    label.className = 'teks-label';
    label.htmlFor = `teks-${teks.code}`;

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
    item.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
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
  generateMission() {
    // Validate selections
    if (this.state.selectedMathTeks.length === 0) {
      this.elements.teksValidationMessage.textContent = 'Select at least 1 math protocol';
      return;
    }
    if (this.state.selectedScienceTeks.length === 0) {
      this.elements.teksValidationMessage.textContent = 'Select at least 1 science protocol';
      return;
    }

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
    this.showScreen('mission-configured');
  },

  beginMission() {
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
    // Reset mission state
    this.missionState = {
      currentFirewall: 1,
      mathCorrect: 0,
      mathTotal: 10,
      scienceCorrect: 0,
      scienceTotal: 3,
      wrongAttempts: 0,
      missionStartTime: Date.now(),
      isComplete: false,
      currentProblem: null,
      currentScienceQuestion: null
    };

    this.state.missionInProgress = true;
    this.state.currentFirewall = 1;
    this.saveMissionState();

    this.updateMissionLog('[INIT] Mission commenced');
    this.updateMissionLog('[FW] Accessing firewall 1');

    // Populate mission objectives
    this.populateMissionObjectives();

    // Load first firewall
    this.loadFirewall(1);

    this.showScreen('firewall');
  },

  /**
   * Load a specific firewall (math problem or transition to Fury)
   * @param {number} firewallNumber - The firewall number (1-10)
   */
  loadFirewall(firewallNumber) {
    this.missionState.currentFirewall = firewallNumber;
    this.state.currentFirewall = firewallNumber;

    // All firewalls (1-10) are math problems
    // Science questions appear AFTER completing firewalls 3, 6, 9

    // Get the math problem for this firewall
    const problem = getMathProblem(firewallNumber);
    if (!problem) {
      console.error(`No problem found for firewall ${firewallNumber}`);
      return;
    }

    this.missionState.currentProblem = problem;

    // Update UI
    this.elements.currentFirewallDisplay.textContent = firewallNumber;
    this.elements.problemNarrative.textContent = problem.narrative;
    this.elements.problemExpression.textContent = problem.expression;
    this.elements.jarvisDialogue.textContent = `"Decryption key required. ${problem.teks} protocol active."`;

    // Clear answer input
    this.elements.answerInput.value = '';
    this.elements.answerInput.classList.remove('correct', 'incorrect');
    this.elements.answerInput.focus();

    // Update firewall grid and progress
    this.updateFirewallGrid();
    this.updateProgress();

    this.updateMissionLog(`[FW] Firewall ${firewallNumber} - ${problem.operation}`);
  },

  /**
   * Check the user's answer for the current math problem
   */
  checkAnswer() {
    if (!this.missionState.currentProblem) {
      return;
    }

    const userInput = this.elements.answerInput.value.trim();
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer)) {
      this.elements.jarvisDialogue.textContent = '"Invalid input. Enter a numeric decryption key."';
      this.elements.answerInput.classList.add('incorrect');
      setTimeout(() => {
        this.elements.answerInput.classList.remove('incorrect');
      }, 500);
      return;
    }

    const correctAnswer = this.missionState.currentProblem.correctAnswer;

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
    this.missionState.mathCorrect++;
    const currentFW = this.missionState.currentFirewall;

    this.updateMissionLog(`[OK] Firewall ${currentFW} breached`);

    // Visual feedback
    this.elements.answerInput.classList.add('correct');
    this.elements.jarvisDialogue.textContent = '"Access granted. Firewall breached. Well done, recruits."';

    // Mark firewall as breached in grid
    const cell = this.elements.firewallGrid.querySelector(`[data-firewall="${currentFW}"]`);
    if (cell) {
      cell.classList.remove('active');
      cell.classList.add('breached');
    }

    // Update progress
    this.updateProgress();

    // Advance after delay
    setTimeout(() => {
      this.elements.answerInput.classList.remove('correct');

      // Check if mission complete (after firewall 10)
      if (currentFW >= 10) {
        this.showVictoryScreen();
        return;
      }

      // Check if we just COMPLETED firewall 3, 6, or 9 - trigger Fury science question
      if (shouldShowFuryAfter(currentFW)) {
        this.showFuryQuestion(currentFW);
      } else {
        // Advance to next firewall
        this.loadFirewall(currentFW + 1);
      }
    }, 1500);
  },

  /**
   * Handle a wrong answer - show feedback, stay on current firewall
   */
  handleWrongAnswer() {
    this.missionState.wrongAttempts++;

    this.updateMissionLog(`[FAIL] Incorrect attempt on firewall ${this.missionState.currentFirewall}`);

    // Visual feedback - shake animation
    this.elements.answerInput.classList.add('incorrect');
    this.elements.jarvisDialogue.textContent = '"Incorrect. Access denied. Try again, recruits."';

    // Clear the incorrect class after animation
    setTimeout(() => {
      this.elements.answerInput.classList.remove('incorrect');
      this.elements.answerInput.value = '';
      this.elements.answerInput.focus();
    }, 500);
  },

  /**
   * Show Nick Fury's science question
   * @param {number} afterFirewall - The firewall number (3, 6, or 9)
   */
  showFuryQuestion(afterFirewall) {
    const question = getScienceQuestion(afterFirewall);
    if (!question) {
      console.error(`No science question found for firewall ${afterFirewall}`);
      // Skip to next math firewall
      this.loadFirewall(afterFirewall + 1);
      return;
    }

    this.missionState.currentScienceQuestion = question;

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

    this.updateMissionLog(`[FURY] Security protocol initiated`);
    this.showScreen('fury');
  },

  /**
   * Check the user's answer for the science question
   * @param {string} letter - The selected option letter (A, B, C, or D)
   * @param {HTMLElement} buttonElement - The clicked button element
   */
  checkScienceAnswer(letter, buttonElement) {
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
    this.missionState.scienceCorrect++;
    const currentFW = this.missionState.currentFirewall;

    this.updateMissionLog(`[FURY] Security verification passed`);

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
      if (nextFW > 10) {
        this.showVictoryScreen();
      } else {
        this.loadFirewall(nextFW);
        this.showScreen('firewall');
      }
    }, 1500);
  },

  /**
   * Handle wrong science answer
   * @param {HTMLElement} buttonElement - The clicked button element
   */
  handleWrongScienceAnswer(buttonElement) {
    this.missionState.wrongAttempts++;

    this.updateMissionLog(`[FURY] Security verification failed`);

    // Visual feedback
    buttonElement.classList.add('incorrect');

    // Update Fury quote
    this.elements.furyQuoteText.textContent = '"Incorrect. Try again. I don\'t have all day."';

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
      currentScienceQuestion: null
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
        const grade = parseInt(btn.dataset.grade);
        this.selectGrade(grade);
      });
    });

    // TEKS action buttons
    document.querySelectorAll('.teks-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
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
      this.showScreen('grade-select');
    });

    document.getElementById('btn-generate-mission')?.addEventListener('click', () => {
      this.generateMission();
    });

    document.getElementById('btn-reconfigure')?.addEventListener('click', () => {
      this.showScreen('teks-select');
    });

    document.getElementById('btn-begin-mission')?.addEventListener('click', () => {
      this.beginMission();
    });

    document.getElementById('btn-resume-mission')?.addEventListener('click', () => {
      this.resumeMission();
    });

    document.getElementById('btn-new-mission')?.addEventListener('click', () => {
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
      this.resetMission();
    });

    // Volume sliders
    // NOTE: Volume sliders save preferences to localStorage.
    // Actual audio control wiring happens in Phase 3 when
    // sound-manager.js is integrated.
    this.elements.volumeAmbient?.addEventListener('input', (e) => {
      this.state.settings.ambientVolume = parseInt(e.target.value);
      this.saveSettings();
    });

    this.elements.volumeEffects?.addEventListener('input', (e) => {
      this.state.settings.effectsVolume = parseInt(e.target.value);
      this.saveSettings();
    });

    this.elements.volumeVoice?.addEventListener('input', (e) => {
      this.state.settings.voiceVolume = parseInt(e.target.value);
      this.saveSettings();
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
          // Submit answer on firewall screen
          if (this.state.currentScreen === 'firewall') {
            this.checkAnswer();
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
