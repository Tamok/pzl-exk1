// src/components/PlayerManagement.Add.jsx
import React, { useState } from 'react';
import { createPlayer } from '../firebase/services/players';
import { logEvent } from '../utils/logger';

const PlayerManagementAdd = ({ onPlayerAdded }) => {
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
    color: '#ffffff',
    patternSeed: 'default-seed',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Email is optional here. Warn if empty.
    if (!newPlayer.email.trim()) {
      alert("Warning: Players without an email will need to be linked to a main account.");
    }
    setLoading(true);
    try {
      const created = await createPlayer(newPlayer);
      logEvent('PLAYER', `Created player ${created.uuid} (${newPlayer.name || 'No Name'})`);
      onPlayerAdded && onPlayerAdded(created);
      setNewPlayer({ name: '', email: '', color: '#ffffff', patternSeed: 'default-seed', avatarUrl: '' });
    } catch (error) {
      logEvent('ERROR', `Failed to create player: ${error.message}`);
      alert(`Failed to create player: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Add New Player</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          value={newPlayer.email}
          onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
          placeholder="Email (optional)"
          className="w-full p-2 border rounded"
        />
        {!newPlayer.email.trim() && (
          <p className="text-xs text-orange-500">
            Players without an email will need to be linked to a main account.
          </p>
        )}
        <div className="flex items-center space-x-2">
          <label className="text-sm">Color:</label>
          <input
            type="color"
            value={newPlayer.color}
            onChange={(e) => setNewPlayer({ ...newPlayer, color: e.target.value })}
          />
        </div>
        <input
          type="text"
          value={newPlayer.patternSeed}
          onChange={(e) => setNewPlayer({ ...newPlayer, patternSeed: e.target.value })}
          placeholder="Pattern Seed"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
        >
          {loading ? 'Saving...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
};

export default PlayerManagementAdd;
