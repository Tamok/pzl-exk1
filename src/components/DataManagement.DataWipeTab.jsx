// src/components/DataManagement.DataWipeTab.jsx

import React, { useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { logEvent } from '../utils/logger';
import { createSnapshot } from '../utils/backup/createSnapshot';

const DataWipeTab = () => {
  const [loadingTarget, setLoadingTarget] = useState('');

  const wipe = async (target) => {
    const collections = Array.isArray(target) ? target : [target];
    for (const col of collections) {
      const snap = await getDocs(collection(db, col));
      for (const docSnap of snap.docs) {
        await deleteDoc(doc(db, col, docSnap.id));
      }
      logEvent('DATA', `Wiped all ${col}`);
    }
  };

  return (
    <div className="p-4 rounded bg-red-950 border border-red-700 text-sm space-y-4">
      <div className="text-red-300 font-semibold text-lg">⚠️ Wipe Database</div>
      <p className="text-red-400">
        This will permanently delete all selected data. This action cannot be undone.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={async () => {
            const confirmed = confirm('Really wipe all entries?');
            if (!confirmed) return;
            setLoadingTarget('cadavres_exquis');
            await createSnapshot('pre-entries-wipe');
            wipe('cadavres_exquis').finally(() => setLoadingTarget(''));
          }}
          className="bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loadingTarget === 'cadavres_exquis'}
        >
          {loadingTarget === 'cadavres_exquis' ? 'Wiping entries…' : 'Wipe Entries'}
        </button>

        <button
          onClick={async () => {
            const confirmed = confirm('Really wipe all players (including mappings)?');
            if (!confirmed) return;
            setLoadingTarget('players');
            await createSnapshot('pre-player-wipe');
            wipe(['players', 'player_mappings']).finally(() => setLoadingTarget(''));
          }}
          className="bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loadingTarget === 'players'}
        >
          {loadingTarget === 'players' ? 'Wiping players…' : 'Wipe Players'}
        </button>

        <button
          onClick={async () => {
            const confirmed = confirm('Really wipe all entries, players, and player mappings?');
            if (!confirmed) return;
            setLoadingTarget('all');
            await createSnapshot('pre-complete-wipe');
            try {
              await wipe('cadavres_exquis');
              await wipe(['players', 'player_mappings']);
            } finally {
              setLoadingTarget('');
            }
          }}
          className="bg-red-900 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loadingTarget === 'all'}
        >
          {loadingTarget === 'all' ? 'Wiping all…' : 'Wipe Entries + Players'}
        </button>
      </div>
    </div>
  );
};

export default DataWipeTab;
