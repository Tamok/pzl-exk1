// src/firebase/services/entries.js
import { db } from '../config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { logEvent } from '../../utils/logger';

export const createEntry = async (data) => {
  const enriched = {
    ...data,
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, 'cadavres_exquis'), enriched);
  logEvent('ENTRY', `Created entry #${data.number} (ID: ${docRef.id})`);
  return docRef.id;
};
