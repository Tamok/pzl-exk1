// src/components/PlayerManagement.jsx
import React, { useState } from 'react';
import PlayerManagementList from './PlayerManagement.List';
import PlayerManagementAdd from './PlayerManagement.Add';
import PlayerManagementStatistics from './PlayerManagement.Statistics';

/**
 * PlayerManagement serves as a container for the player management subtabs.
 * Subtabs:
 * - "List": View and search player profiles.
 * - "Add": Create new player profiles.
 * - "Statistics": Placeholder for aggregated stats and backend analytics.
 */
const PlayerManagement = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-neutral-800 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Player Management</h2>
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'list' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'add' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
          }`}
        >
          Add
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'statistics' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
          }`}
        >
          Statistics
        </button>
      </div>
      {activeTab === 'list' && <PlayerManagementList />}
      {activeTab === 'add' && <PlayerManagementAdd />}
      {activeTab === 'statistics' && <PlayerManagementStatistics />}
    </div>
  );
};

export default PlayerManagement;
