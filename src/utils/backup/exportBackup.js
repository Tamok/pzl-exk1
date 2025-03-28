// src/utils/backup/exportBackup.js

import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { CURRENT_DB_VERSION } from '../../constants';
import { buildBackupSchema } from './backupSchema';

export async function exportBackup({ includePlayers = true, uploadToCloud = false }) {
  const filters = { includePlayers };
  const data = {};

  const entriesSnap = await getDocs(collection(db, 'cadavres_exquis'));
  data.cadavres_exquis = entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (includePlayers) {
    const playerSnap = await getDocs(collection(db, 'players'));
    data.players = playerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  const backup = buildBackupSchema({
    filters,
    data,
    dbVersion: CURRENT_DB_VERSION
  });

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = `backup-${CURRENT_DB_VERSION}-${Date.now()}.json`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  if (uploadToCloud) {
    await addDoc(collection(db, 'backups'), {
      uploadedAt: serverTimestamp(),
      dbVersion: CURRENT_DB_VERSION,
      metadata: {
        entryCount: data.cadavres_exquis.length,
        playerCount: data.players?.length ?? 0
      },
      raw: backup
    });
  }

  return { fileName, counts: { entries: data.cadavres_exquis.length, players: data.players?.length ?? 0 } };
}
