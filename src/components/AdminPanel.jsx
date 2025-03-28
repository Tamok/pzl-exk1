// src/components/AdminPanel.jsx

import React, { useState } from 'react';
import CadavreExquisEntryForm from './CadavreExquisEntryForm';
import PlayerManagement from './PlayerManagement';
import TestDashboard from './TestDashboard';
import DataManagement from './DataManagement';
import ErrorBoundary from './ErrorBoundary';
import { logEvent } from '../utils/logger';

const tabs = {
  entry: 'New Entry',
  players: 'Player Management',
  tests: 'Tests',
  data: 'Data Management'
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('entry');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'entry': return <CadavreExquisEntryForm />;
      case 'players': return <PlayerManagement />;
      case 'tests': return <TestDashboard />;
      case 'data': return <DataManagement />;
      default: return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 px-6 py-4">
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                logEvent('NAV', `Switched to ${label} tab`);
                setActiveTab(key);
              }}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded shadow-lg">
          {renderTabContent()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminPanel;
