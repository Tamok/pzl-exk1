// src/utils/migrationEngine.js
import { v4 as uuidv4 } from 'uuid';
import { getDocs, updateDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { logEvent } from './logger';
import { CURRENT_DB_VERSION } from '../constants';

const migrations = [
  {
    from: '0.5.0',
    to: '0.5.1',
    label: 'Add default player color and patternSeed',
    migrate: async () => {
      const snap = await getDocs(collection(db, 'players'));
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const updates = {};
        if (!data.color) updates.color = '#ffffff';
        if (!data.patternSeed) updates.patternSeed = 'default-seed';
        if (Object.keys(updates).length > 0) {
          await updateDoc(docSnap.ref, updates);
          logEvent('MIGRATION', `Added default player fields to ${docSnap.id}`);
        }
      }
    }
  },
  {
    from: '0.5.1',
    to: '0.5.2',
    label: 'Add createdAt and empty paragraphs[] fallback to entries',
    migrate: async () => {
      const snap = await getDocs(collection(db, 'cadavres_exquis'));
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const updates = {};
        if (!data.createdAt) updates.createdAt = serverTimestamp();
        if (!Array.isArray(data.paragraphs)) updates.paragraphs = [];
        if (Object.keys(updates).length > 0) {
          await updateDoc(docSnap.ref, updates);
          logEvent('MIGRATION', `Fixed entry ${docSnap.id} fields`);
        }
      }
    }
  },
  {
    from: '0.5.2',
    to: '0.5.3',
    label: 'Add UUIDs to paragraphs',
    migrate: async () => {
      const snap = await getDocs(collection(db, 'cadavres_exquis'));
      for (const docSnap of snap.docs) {
        const entry = docSnap.data();
        const updated = (entry.paragraphs || []).map(p => ({ ...p, id: p.id || uuidv4() }));
        await updateDoc(docSnap.ref, { paragraphs: updated });
        logEvent('MIGRATION', `Ensured UUIDs in ${docSnap.id}`);
      }
    }
  },
  {
    from: '0.5.3',
    to: '0.5.4',
    label: 'Normalize paragraphs to Slate format',
    migrate: async () => {
      const snap = await getDocs(collection(db, 'cadavres_exquis'));
      for (const docSnap of snap.docs) {
        const entry = docSnap.data();
        const fixed = (entry.paragraphs || []).map((p, idx) => {
          const valid = Array.isArray(p.text) && p.text[0]?.type === 'paragraph';
          if (!valid) {
            logEvent('MIGRATION', `Normalizing paragraph ${idx} in ${docSnap.id}`);
            return {
              ...p,
              text: [
                {
                  type: 'paragraph',
                  children: [{ text: typeof p.text === 'string' ? p.text : '' }],
                },
              ],
            };
          }
          return p;
        });
        await updateDoc(docSnap.ref, { paragraphs: fixed });
        logEvent('MIGRATION', `Slate-normalized entry ${docSnap.id}`);
      }
    }
  },
  {
    from: '0.5.4',
    to: '0.5.9a',
    label: 'Initialize linkedMainIds for main profiles',
    migrate: async () => {
      const snap = await getDocs(collection(db, 'players'));
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        // For Main Profiles (players with an email), ensure linkedMainIds is set
        if (data.email && data.email.trim() !== '' && data.linkedMainIds === undefined) {
          await updateDoc(docSnap.ref, { linkedMainIds: [] });
          logEvent('MIGRATION', `Initialized linkedMainIds for player ${docSnap.id}`);
        }
      }
    }
  }
];

export const getMigrationPath = (fromVersion) => {
  const path = [];
  let version = fromVersion;

  while (true) {
    const step = migrations.find(m => m.from === version);
    if (!step) break;
    path.push(step);
    version = step.to;
  }

  return path;
};

export const runFirestoreMigrations = async (currentDbVersion) => {
  const path = getMigrationPath(currentDbVersion);
  if (path.length === 0) return false;

  logEvent('MIGRATION', `Running ${path.length} migration(s) from ${currentDbVersion} → ${CURRENT_DB_VERSION}`);
  for (const step of path) {
    await step.migrate();
  }

  const metaRef = doc(db, 'system', 'meta');
  await updateDoc(metaRef, { dbVersion: CURRENT_DB_VERSION, lastUpdated: new Date() });
  logEvent('MIGRATION', `✅ Firestore DB now at version ${CURRENT_DB_VERSION}`);
  return true;
};

/**
 * Migrate a backup JSON object to the latest DB version.
 * Logs each migration step for auditability.
 * @param {Object} json - The original backup file.
 * @returns {Object} - A fully migrated backup object.
 */
export const migrateBackupJson = (json) => {
    const path = getMigrationPath(json.dbVersion);
    let migrated = [...(json.data?.cadavres_exquis || [])];
  
    logEvent('MIGRATION', `Preparing to migrate backup from v${json.dbVersion} to v${CURRENT_DB_VERSION}`);
    if (path.length === 0) {
      logEvent('MIGRATION', `No migrations required.`);
    }
  
    path.forEach((step, i) => {
      const label = step.label || `Step ${i + 1}`;
      logEvent('MIGRATION', `🔁 Running migration: ${label}`);
      migrated = step.migrate(migrated);
      logEvent('MIGRATION', `✅ Migration complete: ${step.from} → ${step.to}`);
    });
  
    logEvent('MIGRATION', `🎉 Backup fully migrated to v${CURRENT_DB_VERSION}`);
  
    return {
      ...json,
      dbVersion: CURRENT_DB_VERSION,
      data: { ...json.data, cadavres_exquis: migrated }
    };
  };
  