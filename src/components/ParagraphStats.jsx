// src/components/ParagraphStats.jsx
import React from 'react';

const ParagraphStats = ({ paragraphs }) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold">Paragraph Statistics</h3>
      {paragraphs.map((para, index) => {
        const totalReactions = para.emojiReactions
          ? Object.values(para.emojiReactions).reduce((sum, r) => sum + r.count, 0)
          : 0;
        return (
          <div key={index} className="border p-2 my-2 rounded">
            <p>Paragraph {index + 1}: {totalReactions} reactions</p>
          </div>
        );
      })}
    </div>
  );
};

export default ParagraphStats;
