// src/utils/backup/importBackup.js

import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { logEvent } from '../logger';
import { CURRENT_DB_VERSION } from '../../constants';
import { runMigrationIfNeeded } from './migration';
import { createSnapshot } from './createSnapshot';

/**
 * Remove any undefined fields from an object to satisfy Firestore's requirements
 */
function sanitize(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, val]) => val !== undefined));
}

/**
 * Import a backup (after optional migration) into Firestore.
 */
export async function importBackup(backup) {
  const migrated = await runMigrationIfNeeded(backup);
  const { data, dbVersion } = migrated;
  const counts = { entries: 0, players: 0 };
  await createSnapshot('pre-import');

  // Import entries
  if (Array.isArray(data?.cadavres_exquis)) {
    for (const entry of data.cadavres_exquis) {
      const clean = sanitize(entry);
      const ref = doc(db, 'cadavres_exquis', clean.id);
      await setDoc(ref, clean);
      counts.entries++;
      logEvent('ENTRY', `Imported entry ${clean.id}`);
    }
  }

  // Import players
  if (Array.isArray(data?.players)) {
    for (const player of data.players) {
      const clean = sanitize(player);
      const ref = doc(db, 'players', clean.id);
      await setDoc(ref, clean);
      counts.players++;
      logEvent('PLAYER', `Imported player ${clean.id}`);
    }
  }

  return {
    versionFrom: dbVersion,
    versionTo: CURRENT_DB_VERSION,
    imported: counts
  };
}
