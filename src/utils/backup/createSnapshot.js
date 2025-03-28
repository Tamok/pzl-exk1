// src/utils/backup/createSnapshot.js

import { getDocs, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CURRENT_DB_VERSION } from '../../constants';
import { logEvent } from '../logger';

export async function createSnapshot(reason = 'manual', metadata = {}) {
  try {
    const entriesSnap = await getDocs(collection(db, 'cadavres_exquis'));
    const playersSnap = await getDocs(collection(db, 'players'));

    const entries = entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const players = playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const snapshot = {
      dbVersion: CURRENT_DB_VERSION,
      backupVersion: 'snapshot-' + CURRENT_DB_VERSION,
      uploadedAt: serverTimestamp(),
      createdBy: metadata.createdBy || 'unknown',
      reason,
      metadata: {
        entryCount: entries.length,
        playerCount: players.length
      },
      data: {
        cadavres_exquis: entries,
        players: players
      }
    };

    const id = `${Date.now()}-${reason}`;
    await setDoc(doc(db, 'snapshots', id), snapshot);
    logEvent('DATA', `Created snapshot for reason "${reason}" with id ${id}`);

    return { id, counts: snapshot.metadata };
  } catch (e) {
    logEvent('ERROR', `Snapshot failed: ${e.message}`);
    throw e;
  }
}
