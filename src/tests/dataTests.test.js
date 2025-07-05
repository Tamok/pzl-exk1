// src/tests/dataTests.test.js
import { tests } from './dataTests.js';

describe('Data Tests', () => {
  tests.forEach(test => {
    it(test.name, async () => {
      const result = await test.run();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});