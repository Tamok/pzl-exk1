// src/utils/backup/backupSchema.js

import { z } from 'zod';

export const backupSchema = z.object({
  backupVersion: z.string(),
  timestamp: z.string(),
  dbVersion: z.number(),
  filters: z.record(z.any()),
  data: z.object({
    cadavres_exquis: z.array(z.any()),
    players: z.array(z.any()).optional()
  })
});

export function validateBackup(json) {
  return backupSchema.safeParse(json);
}

export function buildBackupSchema({ dbVersion, filters, data }) {
  return {
    backupVersion: '0.5.0',
    timestamp: new Date().toISOString(),
    dbVersion,
    filters,
    data
  };
}
