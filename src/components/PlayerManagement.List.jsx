// src/components/PlayerManagement.List.jsx
import React, { useState, useEffect } from 'react';
import { getAllPlayers, updatePlayer, deletePlayer } from '../firebase/services/players';
import { getAllEntries } from '../firebase/services/entries';
import { logEvent } from '../utils/logger';
import PlayerLinkPopup from './PlayerLinkPopup';

/**
 * PlayerManagementList displays a list of players with action buttons.
 * Supports mass selection for deletion and linking via a modal popup.
 * Clicking on a row (outside the action buttons) opens the Details tab.
 */
const PlayerManagementList = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkTarget, setLinkTarget] = useState(null); // player for which linking is triggered

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
        logEvent('PLAYER', `Fetched ${data.length} players`);
      } catch (error) {
        logEvent('ERROR', `Failed to fetch players: ${error.message}`);
      }
    };

    const fetchEntries = async () => {
      try {
        const data = await getAllEntries();
        setEntries(data);
        logEvent('ENTRY', `Fetched ${data.length} entries for linked counts`);
      } catch (error) {
        logEvent('ERROR', `Failed to fetch entries: ${error.message}`);
      }
    };

    fetchPlayers();
    fetchEntries();
  }, []);

  // Calculate number of entries linked to a given player
  const getLinkedEntryCount = (playerId) => {
    if (!entries || entries.length === 0) return 0;
    return entries.filter(entry =>
      (entry.paragraphs || []).some(p => p.player === playerId)
    ).length;
  };

  // Edit player using a prompt (for simplicity)
  const handleEdit = async (player) => {
    const newName = prompt('Edit player name:', player.name);
    if (newName && newName !== player.name) {
      try {
        await updatePlayer(player.uuid, { name: newName });
        setPlayers(prev => prev.map(p => p.uuid === player.uuid ? { ...p, name: newName } : p));
        logEvent('PLAYER', `Edited player ${player.uuid} name to ${newName}`);
      } catch (error) {
        logEvent('ERROR', `Failed to edit player ${player.uuid}: ${error.message}`);
      }
    }
  };

  // Delete a player after confirmation
  const handleDelete = async (player) => {
    if (window.confirm(`Really delete player ${player.name}?`)) {
      try {
        await deletePlayer(player.uuid);
        setPlayers(prev => prev.filter(p => p.uuid !== player.uuid));
        logEvent('PLAYER', `Deleted player ${player.uuid}`);
      } catch (error) {
        logEvent('ERROR', `Failed to delete player ${player.uuid}: ${error.message}`);
      }
    }
  };

  // Open linking popup for target player
  const handleLinkToggle = (player) => {
    setLinkTarget(player);
    setShowLinkPopup(true);
  };

  // Toggle mass selection
  const toggleSelect = (playerId) => {
    setSelectedIds(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === players.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(players.map(p => p.uuid));
    }
  };

  // Delete selected players in bulk
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Really delete ${selectedIds.length} selected players?`)) {
      for (const id of selectedIds) {
        try {
          await deletePlayer(id);
          logEvent('PLAYER', `Deleted player ${id} (mass deletion)`);
        } catch (error) {
          logEvent('ERROR', `Failed to delete player ${id}: ${error.message}`);
        }
      }
      setPlayers(prev => prev.filter(p => !selectedIds.includes(p.uuid)));
      setSelectedIds([]);
    }
  };

  const filteredPlayers = players.filter(player => {
    const term = search.toLowerCase();
    return player.name.toLowerCase().includes(term) || (player.email || '').toLowerCase().includes(term);
  });

  // Handle linking confirmation from the popup
  const handleLinkConfirm = async (selectedFromPopup) => {
    // For safety, remove any self-linking if present.
    const finalSelection = selectedFromPopup.filter(id => id !== linkTarget.uuid);
    // For Entry Profiles: ensure only one main profile is linked.
    if (!linkTarget.email || linkTarget.email.trim() === '') {
      if (finalSelection.length > 1) {
        alert('An Entry Profile can only be linked to one Main Profile. Please select only one.');
        return;
      }
      const mainId = finalSelection[0] || null;
      try {
        await updatePlayer(linkTarget.uuid, { mainId });
        logEvent('PLAYER', `Set mainId for entry profile ${linkTarget.uuid} to ${mainId}`);
      } catch (error) {
        logEvent('ERROR', `Failed to update mainId for ${linkTarget.uuid}: ${error.message}`);
      }
    } else {
      // For Main Profiles, update the new field "linkedMainIds"
      try {
        await updatePlayer(linkTarget.uuid, { linkedMainIds: finalSelection });
        logEvent('PLAYER', `Updated linkedMainIds for main profile ${linkTarget.uuid} to [${finalSelection.join(', ')}]`);
      } catch (error) {
        logEvent('ERROR', `Failed to update linkedMainIds for ${linkTarget.uuid}: ${error.message}`);
      }
    }
    // Refresh player list
    const updatedPlayers = await getAllPlayers();
    setPlayers(updatedPlayers);
    setShowLinkPopup(false);
    setLinkTarget(null);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Player List</h3>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search players..."
          className="p-2 border rounded flex-1 mr-2"
        />
        <button onClick={handleSelectAll} className="text-blue-500 text-sm underline mr-2">
          {selectedIds.length === players.length ? 'Deselect All' : 'Select All'}
        </button>
        {selectedIds.length > 0 && (
          <button onClick={handleDeleteSelected} className="text-red-500 text-sm underline">
            Delete Selected
          </button>
        )}
      </div>
      {filteredPlayers.length === 0 ? (
        <p className="text-sm text-gray-500">No players found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPlayers.map((player) => {
            const linkedCount = getLinkedEntryCount(player.uuid);
            const isLinked = player.mainId && player.email && player.email.trim() !== '' 
              ? (player.linkedMainIds || []).length > 0 
              : (player.mainId !== null && player.mainId !== player.uuid);
            return (
              <div
                key={player.uuid}
                className="p-4 border rounded flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                onClick={(e) => {
                  if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'input') return;
                  onSelectPlayer && onSelectPlayer(player);
                }}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(player.uuid)}
                    onChange={() => toggleSelect(player.uuid)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm">
                      {player.email && player.email.trim() !== '' ? player.email : 'Entry Profile'}
                    </p>
                    {player.email && player.email.trim() !== '' && (
                      <>
                        <p className="text-xs text-gray-500">Main ID: {player.mainId}</p>
                      </>
                    )}
                    <p className="text-xs text-gray-500">Linked Entries: {linkedCount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(player); }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(player); }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLinkToggle(player); }}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    {isLinked ? 'Link/Unlink' : 'Link'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showLinkPopup && linkTarget && (
        <PlayerLinkPopup
          players={players}
          targetPlayer={linkTarget}
          onConfirm={handleLinkConfirm}
          onCancel={() => { setShowLinkPopup(false); setLinkTarget(null); }}
        />
      )}
    </div>
  );
};

export default PlayerManagementList;
