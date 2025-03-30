// src/components/EmojiReactions.jsx
import React from 'react';

const EmojiReactions = ({ reactions = {}, onReact }) => {
  // reactions is an object where keys are emoji UUIDs and values are { emojiUrl, count }
  return (
    <div className="flex items-center space-x-2 mt-2">
      {Object.entries(reactions).map(([emojiId, reaction]) => (
        <button
          key={emojiId}
          className="flex items-center space-x-1"
          onClick={() => onReact(emojiId)}
        >
          <img src={reaction.emojiUrl} alt="emoji" className="h-6 w-6" />
          <span className="text-xs">{reaction.count}</span>
        </button>
      ))}
      {/* Option to trigger new reaction (opens an emoji picker in future enhancements) */}
      <button onClick={() => onReact(null)} className="text-blue-500 text-xs">
        + React
      </button>
    </div>
  );
};

export default EmojiReactions;
