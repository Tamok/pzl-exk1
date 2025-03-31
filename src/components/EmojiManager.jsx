// src/components/EmojiManager.jsx
import React, { useState, useRef, useEffect } from 'react';
import { logEvent } from '../utils/logger';
import { uploadEmojiFile } from '../firebase/services/storage';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
// Firestore emoji service functions for persistence
import {
  getEmojiRecords,
  createEmojiRecord,
  updateEmojiRecord,
  deleteEmojiRecord,
} from '../firebase/services/emojis';

const ffmpeg = new FFmpeg({ log: true });

const EmojiManager = () => {
  // State for files selected for upload: each { file, status, message, customName }
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Persisted emojis loaded from Firestore: each { id, emojiUrl, name, convertedSize, type }
  const [emojis, setEmojis] = useState([]);
  // Multi-select state for mass deletion/editing
  const [selectedEmojiIds, setSelectedEmojiIds] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Load persisted emojis from Firestore on mount
  useEffect(() => {
    const loadEmojis = async () => {
      try {
        const records = await getEmojiRecords();
        setEmojis(records);
        logEvent('EMOJI', `Loaded ${records.length} emoji records from Firestore`);
      } catch (error) {
        logEvent('ERROR', `Failed to load emojis: ${error.message}`);
      }
    };
    loadEmojis();
  }, []);

  // Format file size for display
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file selection via input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    }).map(file => ({
      file,
      status: 'pending',
      message: '',
      customName: file.name, // default name is the filename
    }));
    setSelectedFiles(validFiles);
  };

  // Handle drag-and-drop file selection
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    }).map(file => ({
      file,
      status: 'pending',
      message: '',
      customName: file.name,
    }));
    setSelectedFiles(validFiles);
  };

  // Process a single file using ffmpeg as needed
  const processFile = async (fileObj) => {
    const { file } = fileObj;
    try {
      // For MP4: convert to animated GIF
      if (file.type === 'video/mp4') {
        if (!ffmpeg.loaded) await ffmpeg.load();
        const uniqueId = Date.now();
        const mp4FileName = `input-${uniqueId}.mp4`;
        const gifFileName = `output-${uniqueId}.gif`;
        await ffmpeg.writeFile(mp4FileName, await fetchFile(file));
        await ffmpeg.exec(['-i', mp4FileName, '-vf', 'fps=10,scale=64:-1:flags=lanczos', gifFileName]);
        const data = await ffmpeg.readFile(gifFileName);
        const gifBlob = new Blob([data.buffer], { type: 'image/gif' });
        // Note: set type to image/gif so that it renders as an image
        return { fileBlob: gifBlob, convertedSize: gifBlob.size, type: 'image/gif' };
      }
      // For animated GIF: resize while preserving animation
      if (file.type === 'image/gif') {
        if (!ffmpeg.loaded) await ffmpeg.load();
        const uniqueId = Date.now();
        const inputGif = `input-${uniqueId}.gif`;
        const outputGif = `output-${uniqueId}.gif`;
        await ffmpeg.writeFile(inputGif, await fetchFile(file));
        await ffmpeg.exec(['-i', inputGif, '-vf', 'scale=64:-1:flags=lanczos', outputGif]);
        const data = await ffmpeg.readFile(outputGif);
        const resizedGifBlob = new Blob([data.buffer], { type: 'image/gif' });
        return { fileBlob: resizedGifBlob, convertedSize: resizedGifBlob.size, type: file.type };
      }
      // For other images: resize using canvas to a 64x64 square
      if (file.type.startsWith('image/')) {
        const resizedBlob = await resizeImageToEmoji(file);
        return { fileBlob: resizedBlob, convertedSize: resizedBlob.size, type: file.type };
      }
      throw new Error('Unsupported file type');
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Resize static images using canvas to a 64x64 square with cover effect
  const resizeImageToEmoji = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
      if (file.type === 'image/gif') {
        resolve(file);
        return;
      }
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        // Calculate dimensions for a cover effect
        const aspect = img.width / img.height;
        let drawWidth = canvas.width, drawHeight = canvas.height;
        if (aspect > 1) {
          drawHeight = canvas.height;
          drawWidth = aspect * drawHeight;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / aspect;
        }
        const dx = (canvas.width - drawWidth) / 2;
        const dy = (canvas.height - drawHeight) / 2;
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas resizing failed'));
        }, 'image/png');
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle upload of all queued files
  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setLoading(true);
    const newEmojiRecords = [];
    const updatedFiles = await Promise.all(selectedFiles.map(async (fileObj) => {
      try {
        fileObj.status = 'processing';
        setSelectedFiles([...selectedFiles]);
        const result = await processFile(fileObj);
        fileObj.status = 'success';
        setSelectedFiles([...selectedFiles]);
        return { result, fileObj };
      } catch (error) {
        fileObj.status = 'error';
        fileObj.message = error.message;
        setSelectedFiles([...selectedFiles]);
        logEvent('ERROR', `Failed to process ${fileObj.file.name}: ${error.message}`);
        return { result: null, fileObj };
      }
    }));
    for (const { result, fileObj } of updatedFiles) {
      if (result) {
        try {
          const emojiUrl = await uploadEmojiFile(result.fileBlob, fileObj.file.name);
          const customName = fileObj.customName?.trim() || fileObj.file.name;
          const record = await createEmojiRecord({
            name: customName,
            emojiUrl,
            convertedSize: result.convertedSize,
            type: result.type,
          });
          newEmojiRecords.push(record);
          logEvent('EMOJI', `Processed emoji ${fileObj.file.name}`);
        } catch (uploadError) {
          logEvent('ERROR', `Upload failed for ${fileObj.file.name}: ${uploadError.message}`);
        }
      }
    }
    setEmojis(prev => [...prev, ...newEmojiRecords]);
    setSelectedFiles([]);
    setLoading(false);
  };

  // Handle deletion of a single emoji record from Firestore and state
  const handleDelete = async (id) => {
    if (!window.confirm('Really delete this emoji?')) return;
    try {
      await deleteEmojiRecord(id);
      setEmojis(prev => prev.filter(e => e.id !== id));
      setSelectedEmojiIds(prev => prev.filter(eid => eid !== id));
      logEvent('EMOJI', `Deleted emoji ${id}`);
    } catch (error) {
      logEvent('ERROR', `Failed to delete emoji ${id}: ${error.message}`);
    }
  };

  // Handle inline renaming; update both state and Firestore record
  const handleRename = async (id, newName) => {
    setEmojis(prev => prev.map(e => e.id === id ? { ...e, name: newName } : e));
    try {
      await updateEmojiRecord(id, { name: newName });
      logEvent('EMOJI', `Renamed emoji ${id} to ${newName}`);
    } catch (error) {
      logEvent('ERROR', `Failed to rename emoji ${id}: ${error.message}`);
    }
  };

  // Toggle multi-select checkbox for an emoji
  const toggleSelectEmoji = (id) => {
    setSelectedEmojiIds(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  // "Select All" button functionality: select or deselect all emoji records
  const handleSelectAll = () => {
    if (selectedEmojiIds.length === emojis.length) {
      setSelectedEmojiIds([]);
    } else {
      setSelectedEmojiIds(emojis.map(e => e.id));
    }
  };

  // Bulk delete selected emojis
  const handleDeleteSelected = async () => {
    if (!window.confirm('Really delete selected emojis?')) return;
    try {
      await Promise.all(selectedEmojiIds.map(id => deleteEmojiRecord(id)));
      setEmojis(prev => prev.filter(e => !selectedEmojiIds.includes(e.id)));
      logEvent('EMOJI', `Deleted selected emojis: ${selectedEmojiIds.join(', ')}`);
      setSelectedEmojiIds([]);
    } catch (error) {
      logEvent('ERROR', `Bulk deletion failed: ${error.message}`);
    }
  };

  // Update the custom name for a queued file
  const updateQueuedFileName = (index, newName) => {
    const updated = [...selectedFiles];
    updated[index].customName = newName;
    setSelectedFiles(updated);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold">Emoji Manager</h3>
      {/* Drag-and-drop file input area */}
      <div
        className="p-4 border-dashed border-2 rounded text-center bg-gray-800 text-gray-300 cursor-pointer hover:border-blue-500"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <p>Drag & drop emoji files here or click to select</p>
        <input
          type="file"
          accept="image/*,video/mp4"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {selectedFiles.length > 0 && (
        <div className="text-sm">
          <ul>
            {selectedFiles.map((fileObj, idx) => (
              <li key={idx} className="flex flex-col border-b pb-1">
                <div className="flex justify-between items-center">
                  <span>
                    {fileObj.file.name} ({formatFileSize(fileObj.file.size)})
                  </span>
                  <span>
                    {fileObj.status === 'pending' && '⌛'}
                    {fileObj.status === 'processing' && '⏳'}
                    {fileObj.status === 'success' && '✅'}
                    {fileObj.status === 'error' && '❌'}
                  </span>
                </div>
                <div className="mt-1">
                  <input
                    type="text"
                    value={fileObj.customName}
                    onChange={(e) => updateQueuedFileName(idx, e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                    placeholder="Enter custom name (optional)"
                  />
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-4 py-2 rounded mt-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Custom Emojis</h4>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-blue-500 text-sm underline"
            >
              {selectedEmojiIds.length === emojis.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedEmojiIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-red-500 text-sm underline"
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {emojis.length > 0 ? (
            emojis.map((emoji) => (
              <div key={emoji.id} className="flex flex-col items-center border p-2 rounded">
                <div className="relative h-12 w-12">
                  {emoji.type.startsWith('video/') ? (
                    <video 
                      src={emoji.emojiUrl} 
                      className="h-full w-full object-cover" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                    />
                  ) : (
                    <img 
                      src={emoji.emojiUrl} 
                      alt={emoji.name} 
                      className="h-full w-full object-cover" 
                    />
                  )}
                  <input
                    type="checkbox"
                    checked={selectedEmojiIds.includes(emoji.id)}
                    onChange={() => toggleSelectEmoji(emoji.id)}
                    className="absolute top-0 left-0 m-1"
                  />
                </div>
                <div className="text-xs mt-1">
                  <input
                    type="text"
                    value={emoji.name}
                    onChange={(e) => handleRename(emoji.id, e.target.value)}
                    className="bg-transparent border-b border-dotted text-center text-xs focus:outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(emoji.convertedSize)}
                </div>
                <button
                  onClick={() => handleDelete(emoji.id)}
                  className="text-red-500 text-xs mt-1"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-4">No custom emojis uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiManager;
