export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    moduleFileExtensions: ["js", "jsx"],
    testMatch: ["**/src/tests/**/*.js", "**/?(*.)+(spec|test).[tj]s?(x)"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    extensionsToTreatAsEsm: [".js", ".jsx"],
    globals: {
      "ts-jest": {
        useESM: true
      }
    }
  };
  