// src/components/EntryForm.TitleThemesTab.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const TitleThemesTab = ({ title, setTitle, themes, setThemes }) => {
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter entry title"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Themes:</label>
        {themes.map((theme, index) => (
          <div key={index} className="flex items-center gap-2 mb-2 flex-wrap">
            <input
              type="text"
              value={theme.name}
              onChange={(e) => updateTheme(index, 'name', e.target.value)}
              placeholder="Theme name"
              className="p-2 border rounded flex-1"
              required
            />
            <input
              type="number"
              value={theme.voteCount}
              onChange={(e) => updateTheme(index, 'voteCount', Number(e.target.value))}
              placeholder="Votes"
              className="p-2 border rounded w-24"
              required
            />
            <label className="text-sm">
              <input
                type="checkbox"
                checked={theme.isRunnerUp}
                onChange={(e) => updateTheme(index, 'isRunnerUp', e.target.checked)}
              /> Runner-Up
            </label>
            {themes.length > 1 && (
              <button
                type="button"
                onClick={() => deleteTheme(index)}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addTheme} className="bg-green-500 text-white px-3 py-1 rounded">
          Add Theme
        </button>
      </div>
    </div>
  );
};

export default TitleThemesTab;
