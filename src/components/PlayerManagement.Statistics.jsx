// src/components/PlayerManagement.Statistics.jsx
import React, { useState, useEffect } from 'react';
import { getAllPlayers } from '../firebase/services/players';
import { logEvent } from '../utils/logger';

/**
 * PlayerManagementStatistics displays aggregated statistics and a simple visual map
 * of player connections grouped by main account.
 * Future improvements will add interactive filters and advanced analytics.
 */
const PlayerManagementStatistics = () => {
  const [players, setPlayers] = useState([]);
  const [mainCount, setMainCount] = useState(0);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
        const mains = data.filter(p => p.email && p.email.trim() !== '');
        const entries = data.filter(p => !p.email || p.email.trim() === '');
        setMainCount(mains.length);
        setEntryCount(entries.length);
        logEvent('PLAYER', `Statistics updated: ${mains.length} main profiles, ${entries.length} entry profiles`);
      } catch (error) {
        logEvent('ERROR', `Failed to fetch player statistics: ${error.message}`);
      }
    };

    fetchStats();
  }, []);

  // Group players by their mainId to show connections
  const groupedByMain = Array.from(new Set(players.map(p => p.mainId))).map(mainId => ({
    mainId,
    group: players.filter(p => p.mainId === mainId),
  }));

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Player Statistics</h3>
      <div className="mb-4">
        <p className="text-lg">Total Players: {players.length}</p>
        <p className="text-lg">Main Profiles (with email): {mainCount}</p>
        <p className="text-lg">Entry Profiles (without email): {entryCount}</p>
      </div>
      <div className="border p-4 rounded">
        <h4 className="font-semibold mb-2">Visual Map of Player Connections</h4>
        {players.length > 0 ? (
          <div>
            {groupedByMain.map(({ mainId, group }) => (
              <div key={mainId} className="mb-4">
                <p className="font-bold">Main ID: {mainId}</p>
                <div className="flex flex-wrap gap-2">
                  {group.map(p => (
                    <div key={p.uuid} className="border p-2 rounded text-center w-24">
                      <p className="text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.email && p.email.trim() !== '' ? 'Main' : 'Entry'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No player data available.</p>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Backend analytics and advanced filters will be implemented in future releases.
      </div>
    </div>
  );
};

export default PlayerManagementStatistics;
