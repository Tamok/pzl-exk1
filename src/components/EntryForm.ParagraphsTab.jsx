// src/components/EntryForm.ParagraphsTab.jsx
import React, { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';
import { logEvent } from '../utils/logger';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { defaultSlateText } from '../utils/formDefaults';

const makeSafeParagraph = (p = {}) => ({
  id: p.id || uuidv4(),
  text: Array.isArray(p.text) ? p.text : defaultSlateText(),
  player: p.player || '',
});

const ParagraphsTab = ({ paragraphs: rawParas, setParagraphs, players, refreshPlayers }) => {
  // 🔐 Ensure safe initial paragraph state
  const safeParas = rawParas.map(makeSafeParagraph);
  const [localEditors, setLocalEditors] = useState(safeParas.map(() => withReact(createEditor())));

  // Keep paragraphs sanitized from the start
  React.useEffect(() => {
    const corrected = rawParas.map(makeSafeParagraph);
    setParagraphs(corrected);
  }, []);

  const addParagraph = () => {
    const para = makeSafeParagraph();
    setParagraphs(prev => [...prev, para]);
    setLocalEditors(prev => [...prev, withReact(createEditor())]);
    logEvent('FORM', 'Added paragraph');
  };

  const deleteParagraph = (index) => {
    if (rawParas.length <= 1) return;

    const updatedParas = [...rawParas];
    const updatedEditors = [...localEditors];
    updatedParas.splice(index, 1);
    updatedEditors.splice(index, 1);

    setParagraphs(updatedParas);
    setLocalEditors(updatedEditors);
    logEvent('FORM', 'Deleted paragraph');
  };

  const updateParagraphField = (index, field, value) => {
    const updated = [...rawParas];
    updated[index][field] = value;
    setParagraphs(updated);
  };

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

    await refreshPlayers?.();
    updateParagraphField(index, 'player', docRef.id);
  };

  return (
    <div className="space-y-6">
      {rawParas.map((para, index) => {
        const editor = localEditors[index] ?? withReact(createEditor());
        const value = Array.isArray(para.text) ? para.text : defaultSlateText();

        return (
          <div key={para.id || index} className="p-4 border rounded bg-gray-800 space-y-3">
            <label className="block font-semibold text-sm">Paragraph {index + 1}</label>
            <Slate
              editor={editor}
              value={value}
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

            {rawParas.length > 1 && (
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
