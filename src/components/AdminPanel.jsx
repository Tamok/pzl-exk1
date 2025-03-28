// src/components/AdminPanel.jsx
import React, { useState } from 'react';
import CadavreExquisEntryForm from './CadavreExquisEntryForm';
import PlayerManagement from './PlayerManagement';
import TestDashboard from './TestDashboard';
import { logEvent } from '../utils/logger';

const AdminPanel = () => {
  const tabs = {
    entry: 'New Entry',
    players: 'Player Management',
    tests: 'Tests'
  };

  const [activeTab, setActiveTab] = useState('entry');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'entry':
        return <CadavreExquisEntryForm />;
      case 'players':
        return <PlayerManagement />;
      case 'tests':
        return <TestDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-[var(--container-bg-light)] dark:bg-[var(--container-bg-dark)]">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="flex space-x-4 mb-4">
        {Object.entries(tabs).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              logEvent('ADMIN', `Switched to ${label} tab`);
            }}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              activeTab === key ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
