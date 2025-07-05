// src/components/PlayerLinkPopup.jsx
import React, { useState, useEffect } from 'react';
import { logEvent } from '../utils/logger';

/**
 * PlayerLinkPopup is a modal for linking profiles.
 * It shows two lists—if the target is a Main Profile, it lists other Main Profiles;
 * if the target is an Entry Profile, it shows only Main Profiles.
 * Existing links are pre‑checked (the target’s current mainId for entry profiles, or linkedMainIds for main profiles).
 * Unchecking a pre‑selected option prompts for confirmation before unlinking.
 * The modal has a transparent, blurred backdrop (like the Console Log overlay).
 */
const PlayerLinkPopup = ({ players, targetPlayer, onConfirm, onCancel }) => {
  // Determine mode based on target: "entry" if no email, otherwise "main"
  const mode = targetPlayer.email && targetPlayer.email.trim() !== '' ? 'main' : 'entry';

  // Filter list based on mode and exclude self
  const available = players.filter(p => {
    if (p.uuid === targetPlayer.uuid) return false;
    if (mode === 'entry') return p.email && p.email.trim() !== '';
    return p.email && p.email.trim() !== '';
  });

  // Pre-select existing links:
  // For entry: pre-select the main profile that is currently linked (if any)
  // For main: pre-select those in linkedMainIds (or empty array if not set)
  const initialSelected = mode === 'entry'
    ? (targetPlayer.mainId ? [targetPlayer.mainId] : [])
    : (targetPlayer.linkedMainIds || []);

  const [selected, setSelected] = useState(new Set(initialSelected));

  // Handle toggle selection with unlink prompt if unchecking an existing selection
  const toggleSelection = (uuid) => {
    const newSelected = new Set(selected);
    if (newSelected.has(uuid)) {
      if (window.confirm('Are you sure you want to unlink this profile?')) {
        newSelected.delete(uuid);
      }
    } else {
      newSelected.add(uuid);
    }
    setSelected(newSelected);
  };

  // Update selection immediately if target has an existing link (pre-checked)
  useEffect(() => {
    setSelected(new Set(initialSelected));
  }, [initialSelected]);

  const handleConfirm = () => {
    logEvent('PLAYER', `Link popup confirmed with selection: ${Array.from(selected).join(', ')}`);
    onConfirm(Array.from(selected));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 max-w-lg p-6">
        <h3 className="text-xl font-bold mb-4">Link Profiles</h3>
        <p className="mb-4">
          {mode === 'entry'
            ? 'Select a Main Profile to link with:'
            : 'Select Main Profiles to link with:'}
        </p>
        <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
          {available.length === 0 ? (
            <p className="text-sm text-gray-400">No available profiles.</p>
          ) : (
            available.map(p => (
              <div key={p.uuid} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selected.has(p.uuid)}
                  onChange={() => toggleSelection(p.uuid)}
                />
                <span className="text-sm">{p.name} {p.email ? `(${p.email})` : ''}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleConfirm} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerLinkPopup;
