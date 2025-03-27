// src/components/DarkModeToggle.jsx
import React, { useState, useEffect } from 'react';
import { logEvent } from '../utils/logger';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      logEvent('THEME', 'Dark mode ON');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      logEvent('THEME', 'Dark mode OFF');
    }
  }, [isDark]);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsDark(!isDark)}
        className="px-3 py-1 rounded transition-colors duration-200
                   bg-[var(--btn-bg-light)] dark:bg-[var(--btn-bg-dark)]
                   text-[var(--btn-text-light)] dark:text-[var(--btn-text-dark)]"
      >
        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default DarkModeToggle;
