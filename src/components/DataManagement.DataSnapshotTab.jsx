// src/components/DataManagement.DataSnapshotTab.jsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { logEvent } from '../utils/logger';

const DataSnapshotTab = ({ onRestore }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSnapshots = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'snapshots'));
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSnapshots(docs.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds));
    } catch (e) {
      logEvent('ERROR', `Failed to fetch snapshots: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const handleRestore = (snapshot) => {
    if (typeof onRestore === 'function') {
      onRestore(snapshot);
      logEvent('DATA', `Queued snapshot ${snapshot.id || '(unknown)'} for import`);
    }
  };

  const download = (snapshot, id) => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapshot-${id}.json`;
    a.click();
  };

  const remove = async (id) => {
    const ok = confirm(`Really delete snapshot ${id}?`);
    if (!ok) return;
    await deleteDoc(doc(db, 'snapshots', id));
    logEvent('DATA', `Deleted snapshot ${id}`);
    fetchSnapshots();
  };

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-400">Loading snapshots...</div>}
      {!loading && snapshots.length === 0 && (
        <div className="text-sm text-gray-400">No snapshots saved yet.</div>
      )}

      {snapshots.map((s, i) => (
        <div
          key={i}
          className="p-3 border rounded bg-gray-900 border-gray-700 flex justify-between items-center text-sm"
        >
          <div>
            <div className="text-xs text-gray-400">
              {new Date(s.uploadedAt?.seconds * 1000).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Reason: {s.reason}</div>
            <div className="text-xs text-gray-500">
              Entries: {s.metadata?.entryCount ?? 0} | Players: {s.metadata?.playerCount ?? 0}
            </div>
            <div className="text-xs text-gray-600 italic">
              Version: {s.dbVersion || '?'}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
              onClick={() => handleRestore(s)}
            >
              Restore
            </button>
            <button
              className="bg-yellow-600 text-white px-3 py-1 rounded text-xs"
              onClick={() => download(s, s.id)}
            >
              ⬇️
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
              onClick={() => remove(s.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataSnapshotTab;
