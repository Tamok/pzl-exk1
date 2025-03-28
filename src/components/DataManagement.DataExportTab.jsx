// src/components/DataManagement.DataExportTab.jsx

import React, { useState } from 'react';
import { exportBackup } from '../utils/backup/exportBackup';
import { logEvent } from '../utils/logger';

const DataExportTab = () => {
  const [includePlayers, setIncludePlayers] = useState(true);
  const [uploadToCloud, setUploadToCloud] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await exportBackup({ includePlayers, uploadToCloud });
      logEvent('DATA', `Exported backup: ${result.fileName}`);
      setResult(result);
    } catch (e) {
      logEvent('ERROR', `Export failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includePlayers}
          onChange={e => setIncludePlayers(e.target.checked)}
        />
        Include Players
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={uploadToCloud}
          onChange={e => setUploadToCloud(e.target.checked)}
        />
        Upload backup to cloud
      </label>

      <button
        onClick={handleExport}
        className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
        disabled={loading}
      >
        {loading ? 'Exporting…' : 'Export Backup'}
      </button>

      {result && (
        <div className="text-sm text-green-400">
          ✅ Exported {result.counts.entries} entries, {result.counts.players} players
        </div>
      )}
    </div>
  );
};

export default DataExportTab;
