// src/setupTests.js
import '@testing-library/jest-dom';

// Mock Firebase Auth to avoid localStorage issues
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signOut: jest.fn()
  })),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: []
  })),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn()
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getMetadata: jest.fn(() => Promise.reject({
    code: 'storage/object-not-found'
  })),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn()
}));

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({}))
}));

// Mock localStorage for jsdom environment
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve())
  },
  writable: true
});