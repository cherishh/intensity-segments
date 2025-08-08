import { IntensitySegments } from './intensity-segments.js';

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✓ ${testName}`);
  } else {
    console.error(`✗ ${testName}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    throw new Error(`Test failed: ${testName}`);
  }
}

function runTests() {
  console.log('Running IntensitySegments tests...\n');

  // Test 1: Basic functionality from PDF examples
  console.log('=== Basic Tests (PDF Examples) ===');

  const segments1 = new IntensitySegments();
  assertEqual(segments1.toString(), '[]', 'Initial empty segments');

  segments1.add(10, 30, 1);
  assertEqual(segments1.toString(), '[[10,1],[30,0]]', 'Add single segment');

  segments1.add(20, 40, 1);
  assertEqual(segments1.toString(), '[[10,1],[20,2],[30,1],[40,0]]', 'Add overlapping segment');

  segments1.add(10, 40, -2);
  assertEqual(segments1.toString(), '[[10,-1],[20,0],[30,-1],[40,0]]', 'Add negative amount');

  // Test 2: Second example from PDF
  console.log('\n=== Second PDF Example ===');

  const segments2 = new IntensitySegments();
  segments2.add(10, 30, 1);
  assertEqual(segments2.toString(), '[[10,1],[30,0]]', 'Example 2 - step 1');

  segments2.add(20, 40, 1);
  assertEqual(segments2.toString(), '[[10,1],[20,2],[30,1],[40,0]]', 'Example 2 - step 2');

  segments2.add(10, 40, -1);
  assertEqual(segments2.toString(), '[[20,1],[30,0]]', 'Example 2 - step 3');

  segments2.add(10, 40, -1);
  assertEqual(segments2.toString(), '[[10,-1],[20,0],[30,-1],[40,0]]', 'Example 2 - step 4');

  // Test 3: Edge cases
  console.log('\n=== Edge Cases ===');

  const segments3 = new IntensitySegments();

  // Test zero amount
  segments3.add(10, 20, 0);
  assertEqual(segments3.toString(), '[]', 'Add zero amount should do nothing');

  // Test same from and to
  segments3.add(10, 10, 5);
  assertEqual(segments3.toString(), '[]', 'Same from and to should do nothing');

  // Test negative coordinates
  segments3.add(-10, 10, 1);
  assertEqual(segments3.toString(), '[[-10,1],[10,0]]', 'Negative coordinates');

  // Test adjacent segments - this is actually testing correct behavior
  // After [-10,1],[10,0], adding [10,20,1] should merge at position 10
  // The result should be [[-10,1],[20,0]] since intensity from -10 to 20 becomes 1
  segments3.add(10, 20, 1);
  assertEqual(segments3.toString(), '[[-10,1],[20,0]]', 'Adjacent segments merge correctly');

  // Test 4: Set method tests
  console.log('\n=== Set Method Tests ===');

  const segments4 = new IntensitySegments();
  segments4.add(0, 100, 1);
  assertEqual(segments4.toString(), '[[0,1],[100,0]]', 'Setup for set tests');

  segments4.set(20, 60, 5);
  assertEqual(segments4.toString(), '[[0,1],[20,5],[60,1],[100,0]]', 'Set overwrites middle section');

  segments4.set(40, 80, 0);
  assertEqual(segments4.toString(), '[[0,1],[20,5],[40,0],[80,1],[100,0]]', 'Set to zero creates gap');

  // Test 5: Complex scenarios
  console.log('\n=== Complex Scenarios ===');

  const segments5 = new IntensitySegments();

  // Multiple overlapping adds
  segments5.add(0, 10, 1);
  segments5.add(5, 15, 2);
  segments5.add(12, 20, -1);
  assertEqual(segments5.toString(), '[[0,1],[5,3],[10,2],[12,1],[15,-1],[20,0]]', 'Multiple overlapping adds');

  // Mix of add and set
  segments5.set(8, 18, 10);
  assertEqual(segments5.toString(), '[[0,1],[5,3],[8,10],[18,-1],[20,0]]', 'Mix add and set operations');

  // Test 6: Large values and boundary conditions
  console.log('\n=== Boundary Tests ===');

  const segments6 = new IntensitySegments();

  // Very large numbers
  segments6.add(1000000, 2000000, 999);
  assertEqual(segments6.toString(), '[[1000000,999],[2000000,0]]', 'Large numbers');

  // Very negative numbers
  segments6.add(-1000000, -500000, -999);
  assertEqual(
    segments6.toString(),
    '[[-1000000,-999],[-500000,0],[1000000,999],[2000000,0]]',
    'Negative large numbers'
  );

  console.log('\n=== All Tests Passed! ===');
}

// Performance test
function performanceTest() {
  console.log('\n=== Performance Test ===');

  const segments = new IntensitySegments();
  const startTime = Date.now();

  // Add many segments to test O(n) performance
  for (let i = 0; i < 1000; i++) {
    segments.add(i * 10, i * 10 + 50, Math.floor(Math.random() * 10) - 5);
  }

  const endTime = Date.now();
  console.log(`Added 1000 segments in ${endTime - startTime}ms`);
  console.log(`Final segments count: ${segments.segments.length}`);
}

// Run all tests
try {
  runTests();
  performanceTest();
  console.log('\n🎉 All tests completed successfully!');
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
