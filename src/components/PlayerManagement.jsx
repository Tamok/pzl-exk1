// src/components/PlayerManagement.jsx
import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { logEvent } from '../utils/logger';

const PlayerManagement = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [patternSeed, setPatternSeed] = useState('default-seed'); // Pre-filled default value

  // Dummy list of existing players (placeholder for DB integration)
  const existingPlayers = [
    { name: 'Player A', email: 'playerA@example.com' },
    { name: 'Player B', email: 'playerB@example.com' },
    { name: 'Player C', email: 'playerC@example.com' },
  ];
  const [selectedExistingPlayer, setSelectedExistingPlayer] = useState('');

  // Reference for file input to trigger click on container click
  const fileInputRef = useRef(null);

  // Merge drag-and-drop and click-to-select for avatar file
  const handleAvatarDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAvatarFile(file);
      logEvent('PLAYER', `Avatar file dropped: ${file.name}`);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      logEvent('PLAYER', `Avatar file selected: ${e.target.files[0].name}`);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const storageRef = ref(storage, `avatars/${avatarFile.name}`);
    try {
      await uploadBytes(storageRef, avatarFile);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      logEvent('PLAYER', 'Avatar uploaded successfully');
    } catch (error) {
      logEvent('ERROR', `Avatar upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logEvent('PLAYER', `Submitting player: ${playerName} (${playerEmail})`);
    if (avatarFile) {
      await uploadAvatar();
    }
    alert(`Player ${playerName} with email ${playerEmail} submitted.
Color: ${color}
Pattern Seed: ${patternSeed}
(Placeholder: Save to database in Phase 5)`);
    // Reset form fields
    setPlayerName('');
    setPlayerEmail('');
    setAvatarFile(null);
    setAvatarUrl('');
    setColor('#ffffff');
    setPatternSeed('default-seed');
    setSelectedExistingPlayer('');
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Player Management</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium" title="Enter the player's name">
            Player Name:
          </label>
          <input 
            type="text" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            title="Enter the player's name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium" title="Enter the player's email">
            Email:
          </label>
          <input 
            type="email" 
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
            placeholder="Enter player email"
            title="Enter the player's email address"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium" title="Select an existing player (placeholder: DB integration pending)">
            Existing Players:
          </label>
          <select 
            value={selectedExistingPlayer} 
            onChange={(e) => setSelectedExistingPlayer(e.target.value)}
            title="Select an existing player from the database (placeholder)"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">--Select Existing Player-- (Placeholder)</option>
            {existingPlayers.map((player, index) => (
              <option key={index} value={player.email}>
                {player.name} ({player.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium" title="Avatar file: Drag & drop or click to select">
            Avatar File:
          </label>
          <div 
            className="cursor-pointer p-4 border-dashed border-2 border-gray-400 rounded text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleAvatarDrop}
            onClick={() => fileInputRef.current.click()}
            title="Drag & drop avatar image here or click to choose file"
          >
            {avatarUrl ? (
              <div>
                <p>Avatar uploaded: {avatarFile.name}</p>
                <img src={avatarUrl} alt="Avatar" className="mt-2 h-16 w-16 object-cover rounded" />
              </div>
            ) : (
              <p>Drag & drop avatar image here or click to choose file</p>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleAvatarChange}
              title="Select avatar image file"
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium" title="Select a color for the player">Select Color:</label>
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Choose a color for the player's theme"
            className="p-2 border rounded"
          />
          <span title="Current selected color">Selected:</span>
          <div 
            className="h-6 w-6 rounded border" 
            style={{ backgroundColor: color }}
            title={`Current color: ${color}`}
          ></div>
        </div>
        <div>
          <label className="block font-medium" title="Pattern seed determines the border pattern for player's paragraphs">
            Pattern Seed:
          </label>
          <input 
            type="text" 
            value={patternSeed}
            onChange={(e) => setPatternSeed(e.target.value)}
            placeholder="Enter pattern seed (default provided)"
            title="Enter a seed value for pattern generation (default is provided)"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" title="Submit player information">
          Submit Player
        </button>
      </form>
    </div>
  );
};

export default PlayerManagement;
