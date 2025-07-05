// src/components/PlayerManagement.jsx
import React, { useState } from 'react';
import PlayerManagementList from './PlayerManagement.List';
import PlayerManagementAdd from './PlayerManagement.Add';
import PlayerManagementDetails from './PlayerManagement.Details';
import PlayerManagementStatistics from './PlayerManagement.Statistics';
import { logEvent } from '../utils/logger';

/**
 * PlayerManagement serves as a container for the player management subtabs.
 * Subtabs:
 * - "List": View and manage player profiles.
 * - "Add": Create new player profiles.
 * - "Details": View detailed information about a selected player.
 * - "Statistics": Aggregated stats and visual maps of player connections.
 */
const PlayerManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Callback when a player row is clicked in the list view
  const handleSelectPlayer = (player) => {
    logEvent('PLAYER', `Selected player for details: ${player.uuid}`);
    setSelectedPlayer(player);
    setActiveTab('details');
  };

  // Return to the list view from details
  const handleBackToList = () => {
    setSelectedPlayer(null);
    setActiveTab('list');
  };

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-neutral-800 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Player Management</h2>
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => {
            setActiveTab('list');
            logEvent('PLAYER', 'Switched to List tab');
          }}
          className={`px-4 py-2 font-semibold ${activeTab === 'list' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          List
        </button>
        <button
          onClick={() => {
            setActiveTab('add');
            logEvent('PLAYER', 'Switched to Add tab');
          }}
          className={`px-4 py-2 font-semibold ${activeTab === 'add' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Add
        </button>
        <button
          onClick={() => {
            if (selectedPlayer) {
              setActiveTab('details');
              logEvent('PLAYER', 'Switched to Details tab');
            } else {
              logEvent('PLAYER', 'No player selected for Details tab');
            }
          }}
          className={`px-4 py-2 font-semibold ${activeTab === 'details' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Details
        </button>
        <button
          onClick={() => {
            setActiveTab('statistics');
            logEvent('PLAYER', 'Switched to Statistics tab');
          }}
          className={`px-4 py-2 font-semibold ${activeTab === 'statistics' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Statistics
        </button>
      </div>
      {activeTab === 'list' && <PlayerManagementList onSelectPlayer={handleSelectPlayer} />}
      {activeTab === 'add' && <PlayerManagementAdd />}
      {activeTab === 'details' && selectedPlayer && (
        <PlayerManagementDetails player={selectedPlayer} onBack={handleBackToList} />
      )}
      {activeTab === 'statistics' && <PlayerManagementStatistics />}
    </div>
  );
};

export default PlayerManagement;
