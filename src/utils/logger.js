// src/utils/logger.js
const logListeners = [];

export const addLogListener = (listener) => {
  logListeners.push(listener);
};

export const logEvent = (tag, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}][${tag}] ${message}`;
  console.log(logMessage);
  logListeners.forEach(listener => listener(logMessage));
};
