// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBO74eBJJ864xdZwqum5wn9jBhIizpcpVo",
  authDomain: "pzl-exki.firebaseapp.com",
  projectId: "pzl-exki",
  storageBucket: "pzl-exki.firebasestorage.app",
  messagingSenderId: "612276808544",
  appId: "1:612276808544:web:cfc6f44f66529ca20f0c05",
  measurementId: "G-JZF622LNY1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Simple login function
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Check if current user is admin
export const isAdminUser = (user) => {
  return user && user.email === "nautiluce@gmail.com";
};

// Listen for auth state changes
export const observeAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

export { app, auth, db, storage };
