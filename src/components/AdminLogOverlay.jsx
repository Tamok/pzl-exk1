// src/components/AdminLogOverlay.jsx
import React, { useEffect, useState } from 'react';
import { addLogListener } from '../utils/logger';

const AdminLogOverlay = () => {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener = (log) => {
      setLogs(prev => [...prev, log]);
    };
    addLogListener(listener);
    // Note: Removal of the listener is omitted for brevity.
  }, []);

  const handleCopyLog = () => {
    const logText = logs.join("\n");
    navigator.clipboard.writeText(logText)
      .then(() => {
        alert("Log copied to clipboard");
      })
      .catch((error) => {
        alert("Failed to copy log: " + error.message);
      });
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed right-0 top-0 h-full w-64 bg-gray-800/25 text-white p-4 rounded-l shadow-lg z-50 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Console Log</span>
            <div className="flex items-center space-x-2">
              <button onClick={handleCopyLog} className="text-white" title="Copy log to clipboard">
                📋
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white" title="Close log overlay">
                X
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-xs mb-1 break-words">{log}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fixed right-4 bottom-4 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="h-12 w-12 rounded-full bg-gray-800/75 text-white flex items-center justify-center shadow-lg"
            title="Open Console Log"
          >
            <span className="text-sm">LOG</span>
          </button>
        </div>
      )}
    </>
  );
};

export default AdminLogOverlay;
