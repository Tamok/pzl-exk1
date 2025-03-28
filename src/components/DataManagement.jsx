// src/components/DataManagement.jsx

import React, { useEffect, useState } from 'react';
import { CURRENT_SCHEMA_VERSION, getDatabaseMeta, setDatabaseVersion } from '../firebase/services/meta';
import { runAllMigrations } from '../firebase/services/migrations';
import { logEvent } from '../utils/logger';

const DataManagement = () => {
  const [dbVersion, setDbVersion] = useState(null);

  const refreshVersion = async () => {
    const meta = await getDatabaseMeta();
    setDbVersion(meta?.dbVersion ?? 'unknown');
  };

  useEffect(() => {
    refreshVersion();
  }, []);

  const isMismatch = dbVersion !== CURRENT_SCHEMA_VERSION;

  const exportDatabase = async () => {
    const { getDocs, collection } = await import('firebase/firestore');
    const { db } = await import('../firebase/config');

    const [entriesSnap, playersSnap] = await Promise.all([
      getDocs(collection(db, 'cadavres_exquis')),
      getDocs(collection(db, 'players'))
    ]);

    const data = {
      entries: entriesSnap.docs.map(d => d.data()),
      players: playersSnap.docs.map(d => d.data())
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pzl-backup-${new Date().toISOString()}.json`;
    a.click();

    logEvent('DATA', 'Exported full database');
  };

  const wipeDatabase = async () => {
    if (!window.confirm('Are you SURE you want to delete all entries and players?')) return;

    const { getDocs, deleteDoc, collection } = await import('firebase/firestore');
    const { db } = await import('../firebase/config');

    const wipe = async (colName) => {
      const snap = await getDocs(collection(db, colName));
      await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)));
    };

    await wipe('cadavres_exquis');
    await wipe('players');

    logEvent('DATA', 'Database wiped (entries and players)');
  };

  const handleMigrations = async () => {
    await runAllMigrations();
    await setDatabaseVersion();
    await refreshVersion();
    logEvent('DATA', 'Migrations completed and DB version synced');
    alert('Migrations complete.');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Data Management</h2>

      <p>
        <strong>Code Schema:</strong> {CURRENT_SCHEMA_VERSION}<br />
        <strong>Database Schema:</strong> {dbVersion}{' '}
        {isMismatch && <span className="text-red-600 font-bold">(Mismatch!)</span>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button onClick={handleMigrations} className="bg-pink-600 text-white px-4 py-2 rounded">
          Run Migrations & Sync Version
        </button>

        <button onClick={exportDatabase} className="bg-blue-600 text-white px-4 py-2 rounded">
          Export Backup
        </button>

        <button
          onClick={() => alert('TODO: Implement import logic')}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Import Backup (TBD)
        </button>

        <button onClick={wipeDatabase} className="bg-red-700 text-white px-4 py-2 rounded">
          Wipe Database (DANGER)
        </button>
      </div>
    </div>
  );
};

export default DataManagement;
