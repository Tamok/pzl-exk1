// src/utils/backup/importBackup.js

import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { currentDbVersion, runMigrationIfNeeded } from './migration';

export async function importBackup(json) {
  if (!json || !json.data) throw new Error('Invalid backup file');
  const originalVersion = json.dbVersion || 'unknown';

  const migrated = await runMigrationIfNeeded(json); // You write this to mutate json.data safely
  const { cadavres_exquis = [], players = [] } = migrated.data;

  for (const entry of cadavres_exquis) {
    await setDoc(doc(db, 'cadavres_exquis', entry.id), entry);
  }

  for (const player of players) {
    await setDoc(doc(db, 'players', player.id), player);
  }

  return { versionFrom: originalVersion, versionTo: currentDbVersion, imported: { entries: cadavres_exquis.length, players: players.length } };
}
