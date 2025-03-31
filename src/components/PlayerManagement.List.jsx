// src/components/PlayerManagement.List.jsx
import React, { useState, useEffect } from 'react';
import { getAllPlayers } from '../firebase/services/players';
import { logEvent } from '../utils/logger';

const PlayerManagementList = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchPlayers = async () => {
    try {
      const playerList = await getAllPlayers();
      setPlayers(playerList);
      logEvent('PLAYER', `Fetched ${playerList.length} players from Firestore`);
    } catch (error) {
      logEvent('ERROR', `Failed to fetch players: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Safely filter players by name or email (handle potential null values)
  const filteredPlayers = players.filter(player => {
    const name = (player.name || "").toLowerCase();
    const email = (player.email || "").toLowerCase();
    const term = search.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Player List</h3>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search players..."
        className="w-full p-2 border rounded mb-4"
      />
      {filteredPlayers.length === 0 ? (
        <p className="text-sm text-gray-500">No players found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPlayers.map((player, index) => (
            <div key={player.uuid || index} className="p-4 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <p className="font-bold">{player.name}</p>
                <p className="text-sm">{player.email}</p>
                <p className="text-xs text-gray-500">
                  {player.uuid === player.mainId ? 'Main Profile' : 'Linked Profile'}
                </p>
                <p className="text-xs text-gray-400">Linked entries: [Coming Soon]</p>
                <p className="text-xs text-gray-400">Visual map: [Coming Soon]</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerManagementList;
