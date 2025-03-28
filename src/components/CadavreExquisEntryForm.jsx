// src/components/CadavreExquisEntryForm.jsx
import React, { useState, useEffect } from 'react';
import { logEvent } from '../utils/logger';

const CadavreExquisEntryForm = () => {
  // Placeholder: In Phase 5, fetch the latest entry number from the database.
  const [latestEntryNumber, setLatestEntryNumber] = useState(0);
  const entryNumber = latestEntryNumber + 1;

  // Form state for entry details
  const [title, setTitle] = useState('');
  const [themes, setThemes] = useState([{ name: '', voteCount: 0, isRunnerUp: false }]);
  const [paragraphs, setParagraphs] = useState([{ text: '', player: '' }]);
  const [soundFile, setSoundFile] = useState(null);
  const [soundUrl, setSoundUrl] = useState('');

  // Dummy players list for paragraphs (placeholder for DB integration)
  const players = ['Player 1 (placeholder)', 'Player 2 (placeholder)', 'Player 3 (placeholder)'];

  // Simulate fetching latest entry number from database (placeholder)
  useEffect(() => {
    // Placeholder: Replace with DB fetch in Phase 5
    setLatestEntryNumber(0);
  }, []);

  // Handlers for themes
  const addTheme = () => {
    setThemes([...themes, { name: '', voteCount: 0, isRunnerUp: false }]);
    logEvent('FORM', 'Added new theme field');
  };

  const deleteTheme = (index) => {
    if (themes.length > 1) {
      setThemes(themes.filter((_, idx) => idx !== index));
      logEvent('FORM', 'Deleted a theme field');
    }
  };

  const updateTheme = (index, field, value) => {
    const newThemes = [...themes];
    newThemes[index][field] = value;
    setThemes(newThemes);
  };

  // Handlers for paragraphs
  const addParagraph = () => {
    setParagraphs([...paragraphs, { text: '', player: '' }]);
    logEvent('FORM', 'Added new paragraph field');
  };

  const deleteParagraph = (index) => {
    if (paragraphs.length > 1) {
      setParagraphs(paragraphs.filter((_, idx) => idx !== index));
      logEvent('FORM', 'Deleted a paragraph field');
    }
  };

  const updateParagraph = (index, field, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index][field] = value;
    setParagraphs(newParagraphs);
  };

  // Handle sound file drag-and-drop
  const handleSoundDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSoundFile(file);
      logEvent('SOUND', `Sound file selected: ${file.name}`);
      // Placeholder: In Phase 5, implement upload to Firebase Storage.
      setSoundUrl(URL.createObjectURL(file)); // Temporary preview URL
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Automatically determine the winner as the theme with the highest vote count.
    let winnerThemeIndex = 0;
    themes.forEach((theme, index) => {
      if (theme.voteCount > themes[winnerThemeIndex].voteCount) {
        winnerThemeIndex = index;
      }
    });
    logEvent('FORM', `Winner Theme (auto-determined): ${themes[winnerThemeIndex].name}`);
    themes.forEach((theme, ) => {
      if (theme.isRunnerUp) {
        logEvent('FORM', `Runner-Up Theme marked: ${theme.name}`);
      }
    });
    logEvent('FORM', `Submitting new entry #${entryNumber} with title: ${title}`);
    alert(`Submitted entry #${entryNumber} - ${title}\n(Placeholder: Save to database in Phase 5)`);
    
    // Reset form fields
    setTitle('');
    setThemes([{ name: '', voteCount: 0, isRunnerUp: false }]);
    setParagraphs([{ text: '', player: '' }]);
    setSoundFile(null);
    setSoundUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold">Create New Cadavre Exquis Entry</h3>
      <div>
        <label
          className="block font-medium"
          title="Automatically assigned based on the latest database entry (placeholder)"
        >
          Entry Number: {entryNumber} (Placeholder: DB integration pending)
        </label>
      </div>
      <div>
        <label className="block font-medium" title="Title of the cadavre exquis entry">
          Title:
        </label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter entry title"
          title="Enter the title for the new entry"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label
          className="block font-medium"
          title="Themes for the entry. Winner is auto-determined by the highest vote count. Use the Runner-Up checkbox to mark an alternative theme."
        >
          Themes:
        </label>
        {themes.map((theme, index) => (
          <div key={index} className="flex flex-wrap items-center space-x-2 mb-2">
            <input 
              type="text" 
              placeholder="Enter theme name"
              title="Enter theme name"
              value={theme.name}
              onChange={(e) => updateTheme(index, 'name', e.target.value)}
              className="p-2 border rounded flex-1"
              required
            />
            <input 
              type="number" 
              placeholder="Votes"
              title="Enter vote count for this theme"
              value={theme.voteCount}
              onChange={(e) => updateTheme(index, 'voteCount', Number(e.target.value))}
              className="p-2 border rounded w-24"
              required
            />
            <label className="flex items-center space-x-1" title="Mark this theme as the runner-up (optional)">
              <input 
                type="checkbox" 
                checked={theme.isRunnerUp}
                onChange={(e) => updateTheme(index, 'isRunnerUp', e.target.checked)}
              />
              <span>Runner-Up</span>
            </label>
            {themes.length > 1 && (
              <button 
                type="button"
                onClick={() => deleteTheme(index)}
                title="Delete this theme"
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addTheme}
          title="Add another theme"
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Add Theme
        </button>
      </div>
      <div>
        <label className="block font-medium" title="Add multiple paragraphs with assigned players">
          Paragraphs:
        </label>
        {paragraphs.map((para, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <textarea 
              value={para.text}
              onChange={(e) => updateParagraph(index, 'text', e.target.value)}
              placeholder="Enter paragraph text (Rich text editor integration pending)"
              title="Enter paragraph text; rich text editor integration pending"
              className="w-full p-2 border rounded mb-2"
              rows="3"
              required
            ></textarea>
            <label className="block font-medium" title="Select the player associated with this paragraph">
              Player:
            </label>
            <select 
              value={para.player} 
              onChange={(e) => updateParagraph(index, 'player', e.target.value)}
              title="Select player for this paragraph (Placeholder: DB integration)"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--Select Player-- (Placeholder: DB integration)</option>
              {players.map((player, idx) => (
                <option key={idx} value={player}>{player}</option>
              ))}
            </select>
            {paragraphs.length > 1 && (
              <button 
                type="button" 
                onClick={() => deleteParagraph(index)}
                title="Delete this paragraph"
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete Paragraph
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addParagraph}
          title="Add another paragraph"
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Add Paragraph
        </button>
      </div>
      <div>
        <label className="block font-medium" title="Attach a sound file for the entry. This file will be uploaded to Firebase Storage (integration pending).">
          Sound File Attachment:
        </label>
        <div 
          className="mt-2 p-4 border-dashed border-2 border-gray-400 rounded text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleSoundDrop}
          title="Drag & drop sound file here (placeholder: upload logic pending)"
        >
          {soundUrl ? (
            <div>
              <p>Sound file selected: {soundFile.name}</p>
              <audio controls src={soundUrl} className="w-full mt-2"></audio>
            </div>
          ) : (
            <p>Drag & drop sound file here (Placeholder: upload to Firebase Storage in Phase 5)</p>
          )}
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" title="Submit the new entry">
        Submit Entry
      </button>
    </form>
  );
};

export default CadavreExquisEntryForm;
