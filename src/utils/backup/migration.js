// src/utils/migration.js

import { CURRENT_DB_VERSION } from '../../constants';

export const currentDbVersion = CURRENT_DB_VERSION;

export async function runMigrationIfNeeded(backup) {
  let version = backup.dbVersion || 1;
  const migrated = { ...backup, dbVersion: version };

  // Example: chain migration up to latest
  while (version < CURRENT_DB_VERSION) {
    if (version === 4) {
      migrated.data.cadavres_exquis = migrated.data.cadavres_exquis.map(entry => ({
        ...entry,
        number: undefined,
        migratedFromV4: true
      }));
    }
    version++;
  }

  migrated.dbVersion = CURRENT_DB_VERSION;
  return migrated;
}
