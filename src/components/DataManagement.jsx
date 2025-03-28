// src/components/DataManagement.jsx

import React, { useState } from 'react';
import DataExportTab from './DataManagement.DataExportTab';
import DataImportTab from './DataManagement.DataImportTab';
import DataCloudTab from './DataManagement.DataCloudTab';
import DataWipeTab from './DataManagement.DataWipeTab';
import DataSnapshotTab from './DataManagement.DataSnapshotTab';

const DataManagement = () => {
  const [tab, setTab] = useState('export');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b pb-2 mb-4">
        {['export', 'import', 'cloud', 'snapshots', 'wipe'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 font-semibold ${
              tab === t ? (t === 'wipe' ? 'border-b-2 border-red-400 text-red-400' : 'border-b-2 border-blue-400 text-blue-400')
              : (t === 'wipe' ? 'text-red-400' : 'text-gray-400')
            }`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'export' && <DataExportTab />}
      {tab === 'import' && <DataImportTab />}
      {tab === 'cloud' && 
      <DataCloudTab onRestore={(raw) => {
        setTab('import');
        const event = new CustomEvent('importPreview', { detail: raw });
        window.dispatchEvent(event);
      }} />}
      {tab === 'snapshots' && (
        <DataSnapshotTab
          onRestore={(raw) => {
            setTab('import');
            setTimeout(() => {
              const event = new CustomEvent('importPreview', { detail: raw });
              window.dispatchEvent(event);
            }, 0);
          }}
        />
      )}
      {tab === 'wipe' && <DataWipeTab />}
    </div>
  );
};

export default DataManagement;
