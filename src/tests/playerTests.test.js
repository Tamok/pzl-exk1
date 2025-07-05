// src/tests/playerTests.test.js
import { tests } from './playerTests.js';

// Mock the Firebase services to avoid actual Firebase calls
jest.mock('../firebase/services/players.js', () => ({
  createPlayer: jest.fn(() => Promise.resolve('test-player-uuid')),
  updatePlayer: jest.fn(() => Promise.resolve()),
  deletePlayer: jest.fn(() => Promise.resolve())
}));

jest.mock('../firebase/services/playerMappings.js', () => ({
  mergePlayers: jest.fn(() => Promise.resolve('merged-player-id')),
  getPlayerMapping: jest.fn(() => Promise.resolve({
    linkedUUIDs: ['uuid1', 'uuid2']
  }))
}));

describe('Player Tests', () => {
  tests.forEach(test => {
    it(test.name, async () => {
      const result = await test.run();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});