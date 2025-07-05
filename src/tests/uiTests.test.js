// src/tests/uiTests.test.js
import { tests } from './uiTests.js';

describe('UI Tests', () => {
  beforeEach(() => {
    // Setup DOM root element that tests expect with the text content
    const root = document.createElement('div');
    root.id = 'root';
    root.innerText = 'New Entry';
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  tests.forEach(test => {
    it(test.name, async () => {
      const result = await test.run();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});