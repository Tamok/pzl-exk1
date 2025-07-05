// src/tests/entryTests.test.js
import { tests } from './entryTests.js';

// Mock the Firebase services to avoid actual Firebase calls
jest.mock('../firebase/services/entries.js', () => ({
  createEntry: jest.fn(() => Promise.resolve('test-entry-id')),
  updateEntry: jest.fn(() => Promise.resolve()),
  deleteEntry: jest.fn(() => Promise.resolve())
}));

describe('Entry Tests', () => {
  tests.forEach(test => {
    it(test.name, async () => {
      const result = await test.run();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});