import { getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config';
import { logEvent } from '../../utils/logger';

/**
 * Adds default color to all players missing the `color` field.
 */
export const migrateMissingPlayerColors = async () => {
  const snapshot = await getDocs(collection(db, 'players'));
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.color) {
      await updateDoc(docSnap.ref, { color: '#ffffff' });
      logEvent('MIGRATION', `Default color added to player ${docSnap.id}`);
    }
  }
};

/**
 * Adds default patternSeed if missing.
 */
export const migrateMissingPatternSeeds = async () => {
  const snapshot = await getDocs(collection(db, 'players'));
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.patternSeed) {
      await updateDoc(docSnap.ref, { patternSeed: 'default-seed' });
      logEvent('MIGRATION', `Default patternSeed added to player ${docSnap.id}`);
    }
  }
};

/**
 * Fix entries with missing createdAt or paragraphs.
 */
export const migrateEntriesMissingFields = async () => {
  const snapshot = await getDocs(collection(db, 'cadavres_exquis'));
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const updates = {};
    if (!data.createdAt) updates.createdAt = new Date();
    if (!Array.isArray(data.paragraphs)) updates.paragraphs = [];
    if (Object.keys(updates).length > 0) {
      await updateDoc(docSnap.ref, updates);
      logEvent('MIGRATION', `Fixed missing fields in entry ${docSnap.id}`);
    }
  }
};

/**
 * Run all active migrations.
 */
export const runAllMigrations = async () => {
  logEvent('MIGRATION', 'Starting all active migrations...');
  await migrateMissingPlayerColors();
  await migrateMissingPatternSeeds();
  await migrateEntriesMissingFields();
  logEvent('MIGRATION', 'All active migrations complete.');
};
