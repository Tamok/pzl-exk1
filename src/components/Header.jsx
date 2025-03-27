// src/components/Header.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const Header = () => {
  const handleLogoClick = () => {
    logEvent('NAV', 'Logo clicked');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
        <img src="/vite.svg" alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">PZL-EXK1</h1>
      </div>
    </header>
  );
};

export default Header;
