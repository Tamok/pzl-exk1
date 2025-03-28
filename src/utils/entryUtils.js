// src/utils/entryUtils.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getNextEntryNumber = async () => {
  const snap = await getDocs(collection(db, 'cadavres_exquis'));
  const used = snap.docs.map(doc => doc.data().number).filter(Boolean).sort((a, b) => a - b);

  let expected = 1;
  for (const num of used) {
    if (num > expected) break;
    expected++;
  }
  return expected;
};
