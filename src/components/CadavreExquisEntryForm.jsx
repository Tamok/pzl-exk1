// src/components/CadavreExquisEntryForm.jsx
import React, { useEffect, useState } from 'react';
import { getNextEntryNumber } from '../utils/entryUtils';
import { uploadSoundFile } from '../firebase/services/storage';
import { createEntry } from '../firebase/services/entries';
import { usePlayers } from '../hooks/usePlayers';
import { logEvent } from '../utils/logger';
import { newParagraph, defaultSlateText } from '../utils/formDefaults';
import { v4 as uuidv4 } from 'uuid';
import { useLiveFormState } from '../hooks/useLiveFormState';

import TitleThemesTab from './EntryForm.TitleThemesTab';
import ParagraphsTab from './EntryForm.ParagraphsTab';
import AudioTab from './EntryForm.AudioTab';

const CadavreExquisEntryForm = () => {
  const [entryNumber, setEntryNumber] = useState(1);
  const players = usePlayers();
  const [currentTab, setCurrentTab] = useState('title');

  // Use live state hooks to persist unsaved form data.
  const [title, setTitle] = useLiveFormState('entry-title', '');
  const [themes, setThemes] = useLiveFormState('entry-themes', [{ name: '', voteCount: 0, isRunnerUp: false }]);
  const [paragraphs, setParagraphs] = useLiveFormState('entry-paragraphs', [
    { text: defaultSlateText(), player: '', id: uuidv4() }
  ]);
  
  // Sound file remains transient (file objects cannot be serialized)
  const [soundFile, setSoundFile] = useState(null);

  useEffect(() => {
    getNextEntryNumber().then(setEntryNumber);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    logEvent('ENTRY', `Submitting new entry #${entryNumber}`);

    const winner = themes.reduce((prev, curr) =>
      curr.voteCount > prev.voteCount ? curr : prev, themes[0]);

    const soundUrl = soundFile ? await uploadSoundFile(soundFile) : '';

    const entryData = {
      number: entryNumber,
      title,
      themes,
      paragraphs,
      winnerTheme: winner.name,
      soundUrl,
    };

    try {
      await createEntry(entryData);
      alert(`🎉 Entry #${entryNumber} submitted successfully!`);
      // Reset form state and clear localStorage for these keys by reinitializing
      setTitle('');
      setThemes([{ name: '', voteCount: 0, isRunnerUp: false }]);
      setParagraphs([newParagraph()]);
      setSoundFile(null);
      setCurrentTab('title');
      logEvent('ENTRY', `Entry #${entryNumber} reset completed`);
    } catch (error) {
      logEvent('ERROR', `Entry submission failed: ${error.message}`);
      alert('Submission failed. Please try again.');
    }
  };

  const tabNav = [
    { id: 'title', label: 'Title & Themes' },
    { id: 'paragraphs', label: 'Paragraphs' },
    { id: 'audio', label: 'Audio' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold mb-2">Create Entry #{entryNumber}</h3>

      <div className="flex space-x-4 border-b pb-2 mb-4">
        {tabNav.map(tab => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab(tab.id);
              logEvent('NAV', `Switched to ${tab.label} tab`);
            }}
            className={`px-3 py-1 font-medium ${
              currentTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentTab === 'title' && (
        <TitleThemesTab title={title} setTitle={setTitle} themes={themes} setThemes={setThemes} />
      )}

      {currentTab === 'paragraphs' && (
        <ParagraphsTab
          paragraphs={paragraphs}
          setParagraphs={setParagraphs}
          players={players}
        />
      )}

      {currentTab === 'audio' && (
        <AudioTab soundFile={soundFile} setSoundFile={setSoundFile} />
      )}

      <div className="pt-6 border-t mt-6 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
          Submit Entry
        </button>
      </div>
    </form>
  );
};

export default CadavreExquisEntryForm;
