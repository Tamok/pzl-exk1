// src/utils/logger.js
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const shouldSendToFirestore = true;
const LOG_KEY = 'adminLogs';
let logListeners = new Set();

const loadStoredLogs = () => {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const storeLog = (entry) => {
  const logs = loadStoredLogs();
  logs.unshift(entry); // Newest on top
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 500))); // Trim to last 500
};

export const getStoredLogs = loadStoredLogs;

export const addLogListener = (fn) => logListeners.add(fn);
export const removeLogListener = (fn) => logListeners.delete(fn);

export const clearStoredLogs = () => {
  localStorage.removeItem(LOG_KEY);
};

export const logEvent = async (tag, message) => {
  const ts = new Date().toISOString();
  const entry = `[${ts}][${tag}] ${message}`;
  console.log(entry);
  storeLog(entry);
  logListeners.forEach(fn => fn(entry));
  window.dispatchEvent(new CustomEvent('log-message', { detail: entry }));

  // 🔥 Send to Firestore
  if (shouldSendToFirestore) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'logs'), {
        message,
        tag,
        timestamp: serverTimestamp(),
        user: {
          email: user.email,
          uid: user.uid
        }
      });
    }
  }
};
