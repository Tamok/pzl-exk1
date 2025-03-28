// src/components/DataManagement.DataImportTab.jsx

import React, { useState, useRef, useEffect } from 'react';
import { importBackup } from '../utils/backup/importBackup';
import { validateBackup } from '../utils/backup/backupSchema';
import { migrateBackupJson } from '../utils/migrationEngine.js';
import { CURRENT_DB_VERSION } from '../constants';
import { logEvent } from '../utils/logger';

const DataImportTab = () => {
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const listener = e => setImportPreview(e.detail);
    window.addEventListener('importPreview', listener);
    return () => window.removeEventListener('importPreview', listener);
  }, []);

  const handleImportFile = async (file) => {
    try {
      setImportError('');
      const text = await file.text();
      const json = JSON.parse(text);
      const valid = validateBackup(json);
      if (!valid.success) {
        setImportPreview(null);
        setImportError('Invalid backup format');
        logEvent('ERROR', 'Invalid backup file structure');
        return;
      }
      setImportPreview(json);
      logEvent('DATA', `Uploaded backup v${json.dbVersion}`);
    } catch (e) {
      setImportPreview(null);
      setImportError('Could not parse file');
      logEvent('ERROR', `Failed to parse uploaded file: ${e.message}`);
    }
  };

  const startImport = async () => {
    setLoading(true);
    try {
      const result = await importBackup(importPreview);
      setImportPreview(null);
      setImportResult(result);
      logEvent('DATA', `Imported backup v${result.versionFrom} → ${result.versionTo}`);
    } catch (e) {
      setImportError(e.message);
      logEvent('ERROR', `Import failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    const migrated = await migrateBackupJson(importPreview);
    setImportPreview(migrated);
    logEvent('DATA', `Migrated backup to v${CURRENT_DB_VERSION}`);
  };

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed rounded px-6 py-12 text-center bg-gray-800 text-gray-300 cursor-pointer hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
        onDrop={e => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) handleImportFile(e.dataTransfer.files[0]);
        }}
        onDragOver={e => e.preventDefault()}
      >
        <div className="text-lg">Drag & drop backup file here</div>
        <div className="text-xs text-gray-500 mt-2">or click to browse</div>
      </div>

      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files[0]) handleImportFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {importError && (
        <div className="text-sm bg-red-800 text-red-200 p-3 rounded">
          ❌ {importError}
        </div>
      )}

      {importPreview && (
        <div className="text-sm bg-gray-700 p-4 rounded space-y-2">
          <div className="font-semibold text-white">Backup Summary</div>
          <div>Backup Version: {importPreview.backupVersion}</div>
          <div>Original DB Version: {importPreview.dbVersion}</div>
          <div>Entries: {importPreview.data?.cadavres_exquis?.length ?? 0}</div>
          <div>Players: {importPreview.data?.players?.length ?? 0}</div>
          <div className="text-yellow-300">
            {importPreview.dbVersion !== CURRENT_DB_VERSION
              ? `⚠️ Migration required to v${CURRENT_DB_VERSION}`
              : '✅ Ready to import'}
          </div>
          <div className="flex gap-2 mt-3">
            {importPreview.dbVersion !== CURRENT_DB_VERSION ? (
              <button onClick={runMigration} className="bg-yellow-500 text-black px-4 py-1 rounded">
                Migrate Backup
              </button>
            ) : (
              <button
                onClick={startImport}
                className={`bg-green-600 text-white px-4 py-1 rounded ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
              >
                {loading ? 'Importing…' : 'Start Import'}
              </button>
            )}
            <button
              onClick={() => setImportPreview(null)}
              className="text-sm text-gray-400 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {importResult && (
        <div className="text-sm bg-green-900 p-3 rounded text-green-200">
          ✅ Imported backup from version {importResult.versionFrom} → {importResult.versionTo}<br />
          Entries: {importResult.imported.entries}, Players: {importResult.imported.players}
        </div>
      )}
    </div>
  );
};

export default DataImportTab;
