// src/components/DataManagement.DataMigrationTab.jsx

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CURRENT_DB_VERSION } from '../constants';
import { runFirestoreMigrations } from '../utils/migrationEngine';
import { logEvent } from '../utils/logger';

const DataMigrationTab = () => {
  const [dbVersion, setDbVersion] = useState('0.0.0');
  const [loading, setLoading] = useState(false);

  const fetchVersion = async () => {
    const metaRef = doc(db, 'system', 'meta');
    const snap = await getDoc(metaRef);
    if (snap.exists()) {
      setDbVersion(snap.data().dbVersion || '0.0.0');
    } else {
      setDbVersion('0.0.0');
    }
  };

  const runMigrations = async () => {
    setLoading(true);
    await runFirestoreMigrations(dbVersion);
    const metaRef = doc(db, 'system', 'meta');
    await updateDoc(metaRef, {
      dbVersion: CURRENT_DB_VERSION,
      lastUpdated: serverTimestamp(),
    });
    setDbVersion(CURRENT_DB_VERSION);
    setLoading(false);
    logEvent('MIGRATION', `Database migrated to v${CURRENT_DB_VERSION}`);
  };

  useEffect(() => {
    fetchVersion();
  }, []);

  return (
    <div className="space-y-4 text-sm">
      <div className="bg-gray-800 p-4 rounded text-white">
        <div>📦 Current DB Version: <strong>{dbVersion}</strong></div>
        <div>🛠 App Version: <strong>{CURRENT_DB_VERSION}</strong></div>
        {dbVersion !== CURRENT_DB_VERSION && (
          <div className="mt-2 text-yellow-400">
            ⚠️ Database is outdated. Migration recommended.
          </div>
        )}
      </div>

      <button
        onClick={runMigrations}
        disabled={loading}
        className="bg-yellow-500 text-black px-4 py-2 rounded shadow hover:bg-yellow-400 disabled:opacity-50"
      >
        {loading ? 'Migrating...' : 'Run Migration Script'}
      </button>
    </div>
  );
};

export default DataMigrationTab;
