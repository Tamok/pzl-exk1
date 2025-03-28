// src/utils/backup/exportBackup.js

import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { currentDbVersion } from '../migration';

export async function exportBackup({ includePlayers = true, uploadToCloud = false }) {
  const data = {};
  const filters = { includePlayers };

  const entriesSnap = await getDocs(collection(db, 'cadavres_exquis'));
  data.cadavres_exquis = entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (includePlayers) {
    const playerSnap = await getDocs(collection(db, 'players'));
    data.players = playerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  const backup = {
    backupVersion: '0.5.0',
    timestamp: new Date().toISOString(),
    dbVersion: currentDbVersion,
    filters,
    data
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = `backup-${currentDbVersion}-${Date.now()}.json`;

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  // Optional: upload to Firestore
  if (uploadToCloud) {
    await addDoc(collection(db, 'backups'), {
      uploadedAt: serverTimestamp(),
      dbVersion: currentDbVersion,
      metadata: {
        entryCount: data.cadavres_exquis.length,
        playerCount: data.players?.length ?? 0
      },
      raw: backup
    });
  }

  return { fileName, counts: { entries: data.cadavres_exquis.length, players: data.players?.length ?? 0 } };
}
