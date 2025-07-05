export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleFileExtensions: ["js", "jsx"],
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/src/tests/(?!.*\\.test\\.js$)"
    ],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    extensionsToTreatAsEsm: [".jsx"],
    globals: {
      "ts-jest": {
        useESM: true
      }
    },
    testTimeout: 10000
  };
  