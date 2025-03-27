// src/components/CadavreExquisDisplay.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const CadavreExquisDisplay = ({ content }) => {
  // Predefined background classes defined in tailwind.css
  const randomClasses = ["bg-random-1", "bg-random-2", "bg-random-3", "bg-random-4"];
  
  const getRandomClass = () => {
    return randomClasses[Math.floor(Math.random() * randomClasses.length)];
  };

  return (
    <div className="p-4 space-y-6">
      {content.map((para, index) => {
        const bgClass = getRandomClass();
        return (
          <p
            key={index}
            className={`mb-4 p-4 rounded leading-relaxed transition-colors duration-200
                        text-[var(--text-light)] dark:text-[var(--text-dark)] ${bgClass}`}
            title={`By: ${para.author}`}
            onMouseEnter={() => logEvent('DISPLAY', `Hovering on paragraph ${index}`)}
          >
            {para.text}
          </p>
        );
      })}
    </div>
  );
};

export default CadavreExquisDisplay;
