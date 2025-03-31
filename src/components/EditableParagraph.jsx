// src/components/EditableParagraph.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { defaultSlateText } from '../utils/slateDefaults';

/**
 * EditableParagraph enables in-place editing of a paragraph.
 * 
 * Bidirectional synchronization:
 * - When the user edits the paragraph and leaves the field (onBlur),
 *   the onChange callback is invoked with the new Slate value.
 * - The parent component should update Firestore with this new value,
 *   and then pass the updated value down as the new initialValue.
 * - The useEffect hook listens to changes in initialValue to update
 *   the editor's local state accordingly.
 */
const EditableParagraph = ({ initialValue, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || defaultSlateText());

  // Create a stable Slate editor instance.
  const editor = useMemo(() => withReact(createEditor()), []);

  // When initialValue (from Firestore) changes, update local editor state.
  useEffect(() => {
    setValue(initialValue || defaultSlateText());
  }, [initialValue]);

  // On blur, exit editing mode and propagate the new value to parent for Firestore update.
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
            // Use node.id if available; otherwise fall back to index (ensure unique keys)
            <p key={node.id || i}>{node.children.map(child => child.text).join('')}</p>
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
