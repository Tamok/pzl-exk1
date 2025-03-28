import React, { useState, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';
import { logEvent } from '../utils/logger';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { defaultSlateText } from '../utils/formDefaults';

// Ensure each paragraph is properly initialized.
const makeSafeParagraph = (p = {}) => ({
  id: p.id || uuidv4(),
  // Always set a valid initial content array.
  text: Array.isArray(p.text) && p.text.length > 0 ? p.text : defaultSlateText(),
  player: p.player || '',
});

const ParagraphsTab = ({ paragraphs = [], setParagraphs, players, refreshPlayers }) => {
  // Initialize local editor instances only once based on the initial paragraphs.
  const [localEditors, setLocalEditors] = useState(() =>
    paragraphs.map(() => withReact(createEditor()))
  );

  // Keep local editor instances in sync with the number of paragraphs.
  useEffect(() => {
    setLocalEditors(prev => {
      if (prev.length < paragraphs.length) {
        const additional = Array(paragraphs.length - prev.length)
          .fill(null)
          .map(() => withReact(createEditor()));
        return [...prev, ...additional];
      } else if (prev.length > paragraphs.length) {
        return prev.slice(0, paragraphs.length);
      }
      return prev;
    });
  }, [paragraphs.length]);

  // Add a new paragraph.
  const addParagraph = () => {
    const newPara = makeSafeParagraph();
    setParagraphs(prev => [...prev, newPara]);
    logEvent('FORM', 'Added paragraph');
  };

  // Delete a paragraph (ensuring at least one remains).
  const deleteParagraph = (index) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(prev => prev.filter((_, i) => i !== index));
    logEvent('FORM', 'Deleted paragraph');
  };

  // Update a specific field in a paragraph.
  // For the "text" field, ensure a valid array is always set.
  const updateParagraphField = (index, field, value) => {
    setParagraphs(prev => {
      const updated = [...prev];
      if (field === 'text') {
        updated[index] = {
          ...updated[index],
          [field]: Array.isArray(value) && value.length > 0 ? value : defaultSlateText(),
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  // Add an anonymous player and assign its ID to the paragraph.
  const addAnonymousPlayer = async (index) => {
    const name = prompt("Enter name for the new player:");
    if (!name) return;

    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const patternSeed = uuidv4();

    const newPlayer = {
      name,
      email: null,
      color,
      patternSeed,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'players'), newPlayer);
    logEvent('PLAYER', `Created anon player ${name} (ID: ${docRef.id})`);

    if (refreshPlayers) await refreshPlayers();
    updateParagraphField(index, 'player', docRef.id);
  };

  return (
    <div className="space-y-6">
      {paragraphs.map((para, index) => {
        // Use a stable editor instance for this paragraph.
        const editor = localEditors[index] || withReact(createEditor());
        // Ensure the initial content is a valid array.
        const initialContent = Array.isArray(para.text) && para.text.length > 0 ? para.text : defaultSlateText();

        return (
          <div key={para.id} className="p-4 border rounded bg-gray-800 space-y-3">
            <label className="block font-semibold text-sm">Paragraph {index + 1}</label>
            <Slate
              editor={editor}
              // Use initialValue (the one-time initial content) instead of value.
              initialValue={initialContent}
              onChange={(val) => updateParagraphField(index, 'text', val)}
            >
              <Editable
                placeholder="Enter rich paragraph text…"
                className="bg-gray-900 text-white p-2 rounded min-h-[80px] border border-gray-600"
              />
            </Slate>

            <div className="flex items-center gap-2">
              <select
                value={para.player}
                onChange={(e) => updateParagraphField(index, 'player', e.target.value)}
                className="p-2 border rounded flex-1 bg-gray-900 text-white"
                required
              >
                <option value="">-- Select Player --</option>
                {players.map((p) => (
                  <option key={p.uuid} value={p.uuid}>
                    {p.name} {p.email ? `(${p.email})` : '[anon]'}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addAnonymousPlayer(index)}
                title="Add new anonymous player"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                + Add Player
              </button>
            </div>

            {paragraphs.length > 1 && (
              <button
                type="button"
                onClick={() => deleteParagraph(index)}
                className="bg-red-600 text-white text-xs px-3 py-1 rounded"
              >
                Delete Paragraph
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addParagraph}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Paragraph
      </button>
    </div>
  );
};

export default ParagraphsTab;
