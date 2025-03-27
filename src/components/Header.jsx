// src/components/Header.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const Header = () => {
  const handleLogoClick = () => {
    logEvent('NAV', 'Logo clicked');
  };

  return (
    <header className="flex items-center justify-between p-4
                       bg-[var(--container-bg-light)] dark:bg-[var(--container-bg-dark)]
                       transition-colors duration-300">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
        {/* Custom SVG logo with centered "PZL" text */}
        <svg 
          className="h-16 w-16" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3366ff" />
              <stop offset="100%" stopColor="#f333ff" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="5" fill="none" />
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="url(#logoGradient)" 
            fontSize="24" 
            fontFamily="Arial"
          >
            PZL
          </text>
        </svg>
        <h1 className="text-2xl font-bold">PZL-EXK1</h1>
      </div>
    </header>
  );
};

export default Header;
