import React, { useState, useRef, useEffect } from 'react';
import { exportBackup } from '../utils/backup/exportBackup';
import { importBackup } from '../utils/backup/importBackup';
import { validateBackup } from '../utils/backup/backupSchema';
import { runMigrationIfNeeded } from '../utils/backup/migration';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { logEvent } from '../utils/logger';
import { CURRENT_DB_VERSION } from '../constants';

const DataManagement = () => {
  const [tab, setTab] = useState('export');
  const [includePlayers, setIncludePlayers] = useState(true);
  const [uploadToCloud, setUploadToCloud] = useState(true);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [cloudBackups, setCloudBackups] = useState([]);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    const result = await exportBackup({ includePlayers, uploadToCloud });
    logEvent('DATA', `Exported backup: ${result.fileName}`);
  };

  const handleImportFile = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const valid = validateBackup(json);
      if (!valid.success) {
        setImportPreview(null);
        setImportError('❌ Invalid backup format');
        logEvent('ERROR', 'Invalid backup format');
        return;
      }

      logEvent('DATA', `Validated backup v${json.dbVersion}`);
      setImportPreview(json);
      setImportError(null);
    } catch (e) {
      setImportPreview(null);
      setImportError(e.message);
      logEvent('ERROR', `Failed to parse import file: ${e.message}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImportFile(file);
  };

  const fetchBackups = async () => {
    const snap = await getDocs(collection(db, 'backups'));
    const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCloudBackups(items.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds));
  };

  useEffect(() => {
    if (tab === 'cloud') fetchBackups();
  }, [tab]);

  const startImport = async () => {
    const result = await importBackup(importPreview);
    setImportPreview(null);
    setImportResult(result);
    setTab('import');
    fetchBackups();
  };

  const runMigration = async () => {
    const migrated = await runMigrationIfNeeded(importPreview);
    logEvent('DATA', `Migrated backup to v${CURRENT_DB_VERSION}`);
    setImportPreview(migrated);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b pb-2 mb-4">
        {['export', 'import', 'cloud'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 font-semibold ${tab === t ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'export' && (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includePlayers} onChange={e => setIncludePlayers(e.target.checked)} />
            Include Players
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={uploadToCloud} onChange={e => setUploadToCloud(e.target.checked)} />
            Upload backup to cloud
          </label>
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
            Export Backup
          </button>
        </div>
      )}

      {tab === 'import' && (
        <div className="space-y-6">
          <div
            className="border-2 border-dashed rounded px-6 py-12 text-center bg-gray-800 text-gray-300 cursor-pointer hover:border-blue-500"
            onClick={() => fileInputRef.current?.click()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) {
                handleImportFile(e.dataTransfer.files[0]);
              }
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
            onChange={handleFileChange}
            className="hidden"
          />

          {importError && (
            <div className="text-sm bg-red-100 dark:bg-red-900 p-3 rounded text-red-800">
              ❌ {importError}
            </div>
          )}

          {importPreview && (
            <div className="text-sm bg-gray-700 p-4 rounded">
              <div className="font-semibold text-white mb-2">Backup Summary</div>
              <div>Backup Version: {importPreview.backupVersion}</div>
              <div>Original DB Version: {importPreview.dbVersion}</div>
              <div>Entries: {importPreview.data?.cadavres_exquis?.length ?? 0}</div>
              <div>Players: {importPreview.data?.players?.length ?? 0}</div>
              <div className="text-yellow-300 mt-2 mb-3">
                {importPreview.dbVersion !== CURRENT_DB_VERSION
                  ? `⚠️ Migration required to version ${CURRENT_DB_VERSION}`
                  : '✅ Ready to import'}
              </div>
              <div className="flex gap-2">
                {importPreview.dbVersion !== CURRENT_DB_VERSION ? (
                  <button onClick={runMigration} className="bg-yellow-500 text-black px-4 py-2 rounded">
                    Migrate Backup
                  </button>
                ) : (
                  <button onClick={startImport} className="bg-green-600 text-white px-4 py-2 rounded">
                    Start Import
                  </button>
                )}
                <button onClick={() => setImportPreview(null)} className="text-sm text-gray-400 underline">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {importResult && (
            <div className="text-sm bg-green-100 dark:bg-green-900 p-3 rounded">
              ✅ Imported backup from version {importResult.versionFrom} → {importResult.versionTo}<br />
              Entries: {importResult.imported.entries}, Players: {importResult.imported.players}
            </div>
          )}
        </div>
      )}

      {tab === 'cloud' && cloudBackups.map(b => (
        <div key={b.id} className="p-2 rounded border border-gray-700 bg-gray-900 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Version: {b.dbVersion || '?'}</div>
            <div>{new Date(b.uploadedAt?.seconds * 1000).toLocaleString()}</div>
            <div className="text-xs text-gray-400">
              Entries: {b.metadata?.entryCount ?? 0} | Players: {b.metadata?.playerCount ?? 0}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
              onClick={() => {
                setImportPreview(b.raw);
                setTab('import');
              }}
            >
              Restore
            </button>
            <button
              className="bg-yellow-600 text-white px-3 py-1 rounded text-xs"
              onClick={() => {
                const json = JSON.stringify(b.raw, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cloud-backup-${b.id}.json`;
                a.click();
              }}
            >
              ⬇️
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
              onClick={async () => {
                await deleteDoc(doc(db, 'backups', b.id));
                logEvent('DATA', `Deleted cloud backup ${b.id}`);
                fetchBackups();
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataManagement;
