// src/tests/firebaseTests.test.js
import { tests } from './firebaseTests.js';

// Mock the auth to return a mock user
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      email: 'test@example.com',
      uid: 'test-uid'
    }
  })),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

describe('Firebase Tests', () => {
  tests.forEach(test => {
    it(test.name, async () => {
      const result = await test.run();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});