// src/components/DataManagement.DataCloudTab.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { logEvent } from '../utils/logger';

const DataCloudTab = ({ onRestore }) => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'backups'));
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBackups(docs.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds));
    } catch (e) {
      logEvent('ERROR', `Failed to fetch backups: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const download = (backup, id) => {
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud-backup-${id}.json`;
    a.click();
  };

  const remove = async (id) => {
    const ok = confirm(`Really delete cloud backup ${id}?`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'backups', id));
      logEvent('DATA', `Deleted cloud backup ${id}`);
      fetchBackups();
    } catch (e) {
      logEvent('ERROR', `Delete failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-400">Loading backups...</div>}
      {!loading && backups.length === 0 && (
        <div className="text-sm text-gray-400">No backups found.</div>
      )}
      {backups.map(b => (
        <div key={b.id} className="p-3 border rounded bg-gray-900 border-gray-700 flex justify-between items-center text-sm">
          <div>
            <div className="text-xs text-gray-400">
              {new Date(b.uploadedAt?.seconds * 1000).toLocaleString()}
            </div>
            <div>Version: {b.dbVersion || '?'}</div>
            <div className="text-xs text-gray-400">
              Entries: {b.metadata?.entryCount ?? 0} | Players: {b.metadata?.playerCount ?? 0}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTimeout(() => {
                  const event = new CustomEvent('importPreview', { detail: b.raw });
                  window.dispatchEvent(event);
                }, 0);
                onRestore(b.raw);
              }}
              
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
            >
              Restore
            </button>
            <button
              onClick={() => download(b.raw, b.id)}
              className="bg-yellow-600 text-white px-3 py-1 rounded text-xs"
            >
              ⬇️
            </button>
            <button
              onClick={() => remove(b.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataCloudTab;
