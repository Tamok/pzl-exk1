// src/components/CadavreExquisDisplay.jsx
import React from 'react';
import { logEvent } from '../utils/logger';
import EditableParagraph from './EditableParagraph';
import EmojiReactions from './EmojiReactions';

const CadavreExquisDisplay = ({ content, onParagraphChange, onEmojiReact }) => {
  const randomClasses = ["bg-random-1", "bg-random-2", "bg-random-3", "bg-random-4"];
  const getRandomClass = () => randomClasses[Math.floor(Math.random() * randomClasses.length)];

  return (
    <div className="p-4 space-y-6">
      {content.map((para, index) => {
        const bgClass = getRandomClass();
        return (
          <div
            key={index}
            className={`mb-4 p-4 rounded leading-relaxed transition-colors duration-200 ${bgClass}`}
            title={`By: ${para.author}`}
          >
            <EditableParagraph
              initialValue={para.text}
              onChange={newValue => {
                logEvent('DISPLAY', `Paragraph ${index} updated in-place`);
                if (onParagraphChange) onParagraphChange(index, newValue);
              }}
            />
            <EmojiReactions
              reactions={para.emojiReactions || {}}
              onReact={(emojiId) => {
                logEvent('REACTION', `Paragraph ${index} reacted with ${emojiId || 'new emoji'}`);
                if (onEmojiReact) onEmojiReact(index, emojiId);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CadavreExquisDisplay;
