// src/components/EntryForm.AudioTab.jsx
import React from 'react';
import { logEvent } from '../utils/logger';

const AudioTab = ({ soundFile, setSoundFile }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSoundFile(file);
      logEvent('SOUND', `Selected: ${file.name}`);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-2">Attach a Sound File:</label>
      <div
        className="p-6 border-dashed border-2 rounded text-center bg-gray-800 text-gray-300 hover:border-blue-500"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {soundFile ? (
          <div>
            <p>{soundFile.name}</p>
            <audio controls className="mt-2 w-full" src={URL.createObjectURL(soundFile)} />
          </div>
        ) : (
          <p>Drag & drop an audio file here</p>
        )}
      </div>
    </div>
  );
};

export default AudioTab;
