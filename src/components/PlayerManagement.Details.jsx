// src/components/PlayerManagement.Details.jsx
import React, { useState, useEffect } from 'react';
import { getAllEntries } from '../firebase/services/entries';
import { getAllPlayers, updatePlayer } from '../firebase/services/players';
import { logEvent } from '../utils/logger';

/**
 * PlayerManagementDetails shows detailed information about a selected player.
 * It allows inline editing of details and shows linked entries and profiles.
 * For Entry Profiles, UUID and Main ID are omitted.
 */
const PlayerManagementDetails = ({ player, onBack }) => {
  const [linkedEntries, setLinkedEntries] = useState([]);
  const [linkedPlayers, setLinkedPlayers] = useState([]);
  const [entriesExpanded, setEntriesExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editablePlayer, setEditablePlayer] = useState(player);

  useEffect(() => {
    setEditablePlayer(player);
  }, [player]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const entries = await getAllEntries();
        const filteredEntries = entries.filter(entry =>
          (entry.paragraphs || []).some(p => p.player === player.uuid)
        );
        setLinkedEntries(filteredEntries);
        logEvent('PLAYER', `Fetched ${filteredEntries.length} linked entries for player ${player.uuid}`);
      } catch (error) {
        logEvent('ERROR', `Failed to fetch linked entries: ${error.message}`);
      }

      try {
        const allPlayers = await getAllPlayers();
        const linked = player.email && player.email.trim() !== ''
          ? allPlayers.filter(p => p.mainId && p.mainId === player.mainId && p.uuid !== player.uuid)
          : [];
        setLinkedPlayers(linked);
        logEvent('PLAYER', `Fetched ${linked.length} linked profiles for main ID ${player.mainId}`);
      } catch (error) {
        logEvent('ERROR', `Failed to fetch linked profiles: ${error.message}`);
      }
    };

    fetchDetails();
  }, [player]);

  const handleSave = async () => {
    try {
      await updatePlayer(player.uuid, {
        name: editablePlayer.name,
        email: editablePlayer.email,
        color: editablePlayer.color,
        patternSeed: editablePlayer.patternSeed,
      });
      logEvent('PLAYER', `Updated details for player ${player.uuid}`);
      setEditMode(false);
    } catch (error) {
      logEvent('ERROR', `Failed to update player ${player.uuid}: ${error.message}`);
      alert('Failed to save changes.');
    }
  };

  return (
    <div className="p-4">
      <button onClick={onBack} className="text-blue-500 underline mb-4">← Back to List</button>
      <h3 className="text-xl font-bold mb-2">Player Details</h3>
      {editMode ? (
        <div className="border p-4 rounded mb-4">
          <label className="block mb-2">
            <strong>Name:</strong>
            <input
              type="text"
              value={editablePlayer.name}
              onChange={(e) => setEditablePlayer({ ...editablePlayer, name: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block mb-2">
            <strong>Email:</strong>
            <input
              type="email"
              value={editablePlayer.email}
              onChange={(e) => setEditablePlayer({ ...editablePlayer, email: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block mb-2">
            <strong>Color:</strong>
            <input
              type="color"
              value={editablePlayer.color}
              onChange={(e) => setEditablePlayer({ ...editablePlayer, color: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block mb-2">
            <strong>Pattern Seed:</strong>
            <input
              type="text"
              value={editablePlayer.patternSeed}
              onChange={(e) => setEditablePlayer({ ...editablePlayer, patternSeed: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <div className="flex space-x-4">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="bg-gray-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded mb-4">
          <p><strong>Name:</strong> {player.name}</p>
          <p>
            <strong>Email:</strong> {player.email && player.email.trim() !== '' ? player.email : 'Entry Profile (no email)'}
          </p>
          {player.email && player.email.trim() !== '' && (
            <p><strong>Main ID:</strong> {player.mainId}</p>
          )}
        </div>
      )}
      {!editMode && (
        <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Edit Details
        </button>
      )}
      <div className="border p-4 rounded mb-4">
        <h4 className="font-semibold mb-2">Linked Entries ({linkedEntries.length})</h4>
        <button
          onClick={() => setEntriesExpanded(!entriesExpanded)}
          className="text-blue-500 underline text-sm mb-2"
        >
          {entriesExpanded ? 'Hide Details' : 'Show Details'}
        </button>
        {entriesExpanded && (
          <ul className="list-disc pl-5">
            {linkedEntries.map(entry => (
              <li key={entry.id}>
                <a href={`#entry-${entry.id}`} className="text-blue-500 underline">
                  {entry.title || `Entry ${entry.number}`}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {player.email && player.email.trim() !== '' && (
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">Linked Profiles (Same Main Account)</h4>
          {linkedPlayers.length === 0 ? (
            <p className="text-sm text-gray-500">No linked profiles found.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {linkedPlayers.map(lp => (
                <div key={lp.uuid} className="border p-2 rounded text-center w-24">
                  <p className="text-sm">{lp.name}</p>
                  <p className="text-xs text-gray-500">
                    {lp.email && lp.email.trim() !== '' ? 'Main' : 'Entry'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerManagementDetails;
