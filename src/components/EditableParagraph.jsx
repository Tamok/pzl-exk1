// src/components/EditableParagraph.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { defaultSlateText } from '../utils/slateDefaults';

const EditableParagraph = ({ initialValue, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || defaultSlateText());

  // Initialize a stable Slate editor instance.
  const editor = useMemo(() => withReact(createEditor()), []);

  // Bidirectional sync: update local state if initialValue prop changes.
  useEffect(() => {
    setValue(initialValue || defaultSlateText());
  }, [initialValue]);

  // When editing is finished (on blur), exit editing mode and notify parent.
  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      {isEditing ? (
        <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
          <Editable
            onBlur={handleBlur}
            placeholder="Edit paragraph..."
            className="bg-gray-900 text-white p-2 rounded min-h-[80px] border border-gray-600"
          />
        </Slate>
      ) : (
        <div className="p-2">
          {value.map((node, i) => (
            <p key={i}>{node.children.map(child => child.text).join('')}</p>
          ))}
          <button
            className="text-blue-500 text-sm mt-2"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableParagraph;
