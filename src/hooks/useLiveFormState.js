// src/hooks/useLiveFormState.js
import { useState, useEffect } from 'react';

/**
 * useLiveFormState synchronizes form state with localStorage.
 * @param {string} key - Unique key for this form field.
 * @param {any} initialValue - Initial value if nothing is in storage.
 * @returns {[any, Function]} - The current state and a setter function.
 */
export function useLiveFormState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
