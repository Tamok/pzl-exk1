import { tests as entryTests } from './entryTests';
import { tests as playerTests } from './playerTests';
import { tests as uiTests } from './uiTests';
import { tests as firebaseTests } from './firebaseTests';

export const allTests = [
  ...entryTests,
  ...playerTests,
  ...uiTests,
  ...firebaseTests
];
