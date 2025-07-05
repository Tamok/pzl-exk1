import { tests as entryTests } from './entryTests.js';
import { tests as playerTests } from './playerTests.js';
import { tests as uiTests } from './uiTests.js';
import { tests as firebaseTests } from './firebaseTests.js';
import { tests as dataTests } from './dataTests.js';

export const allTests = [
  ...entryTests,
  ...playerTests,
  ...uiTests,
  ...firebaseTests,
  ...dataTests
];
