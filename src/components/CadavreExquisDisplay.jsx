// src/components/CadavreExquisDisplay.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const CadavreExquisDisplay = ({ content }) => {
  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="p-4 space-y-6">
      {content.map((para, index) => (
        <p
          key={index}
          className="mb-4 p-4 rounded leading-relaxed"
          style={{ backgroundColor: getRandomColor() }}
          title={`By: ${para.author}`}
          onMouseEnter={() => logEvent('DISPLAY', `Hovering on paragraph ${index}`)}
        >
          {para.text}
        </p>
      ))}
    </div>
  );
};

export default CadavreExquisDisplay;
