// src/utils/migration.js

import { CURRENT_DB_VERSION } from '../../constants';
import { logEvent } from '../logger';

export async function runMigrationIfNeeded(backup) {
  let version = backup.dbVersion ?? 1;
  let data = structuredClone(backup.data || {});
  let changed = false;

  logEvent('MIGRATION', `Running migration from v${version} to v${CURRENT_DB_VERSION}`);

  while (version < CURRENT_DB_VERSION) {
    switch (version) {
      case 1:
        // 🧪 v1 → v2: Add color to players if missing
        if (Array.isArray(data.players)) {
          for (const p of data.players) {
            if (!p.color) p.color = 'gray';
          }
        }
        version = 2;
        changed = true;
        break;

      case 2:
        // 🧠 v2 → v3: Add number to entries
        if (Array.isArray(data.cadavres_exquis)) {
          data.cadavres_exquis.forEach((entry, idx) => {
            if (entry.number === undefined) entry.number = idx + 1;
          });
        }
        version = 3;
        changed = true;
        break;

      case 3:
        // 🧬 v3 → v4: Add uuid to players if missing
        if (Array.isArray(data.players)) {
          for (const player of data.players) {
            if (!player.uuid) {
              player.uuid = `uuid-${Math.random().toString(36).slice(2)}`;
            }
          }
        }
        version = 4;
        changed = true;
        break;

      case 4:
        // 🛡️ v4 → v5: Ensure entries have an authorUUID field
        if (Array.isArray(data.cadavres_exquis)) {
          for (const entry of data.cadavres_exquis) {
            if (!entry.authorUUID) {
              entry.authorUUID = 'anonymous';
            }
          }
        }
        version = 5;
        changed = true;
        break;

      default:
        version = CURRENT_DB_VERSION;
    }
  }

  if (!changed) {
    logEvent('MIGRATION', 'No migration needed');
    return backup;
  }

  const migrated = {
    ...backup,
    dbVersion: CURRENT_DB_VERSION,
    data
  };

  logEvent('MIGRATION', `Successfully migrated to v${CURRENT_DB_VERSION}`);
  return migrated;
}
