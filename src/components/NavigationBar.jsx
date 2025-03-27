// src/components/NavigationBar.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const NavigationBar = ({ entries, onNavigate, currentEntryId }) => {
  const handlePrev = () => {
    logEvent('NAV', 'Previous button clicked');
    onNavigate('prev');
  };

  const handleNext = () => {
    logEvent('NAV', 'Next button clicked');
    onNavigate('next');
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    logEvent('NAV', `Dropdown selected: ${selectedId}`);
    onNavigate(selectedId);
  };

  return (
    <nav className="flex items-center justify-center space-x-4 p-4
                    bg-[var(--container-bg-light)] dark:bg-[var(--container-bg-dark)]
                    transition-colors duration-300">
      <button
        onClick={handlePrev}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
      >
        Prev
      </button>

      <select
        onChange={handleSelectChange}
        value={currentEntryId}
        className="p-2 rounded bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
      >
        {entries.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleNext}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
      >
        Next
      </button>
    </nav>
  );
};

export default NavigationBar;
