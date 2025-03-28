import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';

export const CURRENT_SCHEMA_VERSION = '0.5.0';

export const getDatabaseMeta = async () => {
  const ref = doc(db, 'system', 'meta');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const setDatabaseVersion = async () => {
  const ref = doc(db, 'system', 'meta');
  await setDoc(ref, {
    dbVersion: CURRENT_SCHEMA_VERSION,
    lastUpdated: serverTimestamp()
  });
};
