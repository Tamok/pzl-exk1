// src/firebase/services/entries.js

import {
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy
  } from 'firebase/firestore';
  import { db } from '../config';
  import { logEvent } from '../../utils/logger';
  
  /**
   * Get all cadavres exquis entries sorted by number ascending.
   * @returns {Promise<Array>}
   */
  export const getAllEntries = async () => {
    const colRef = collection(db, 'cadavres_exquis');
    const q = query(colRef, orderBy('number', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  /**
   * Get the next entry number, filling any gap from deleted entries.
   * @returns {Promise<number>}
   */
  export const getNextEntryNumber = async () => {
    const entries = await getAllEntries();
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].number !== i + 1) return i + 1;
    }
    return entries.length + 1;
  };
  
  /**
   * Create a new cadavre exquis entry.
   * @param {Object} entryData
   * @returns {Promise<string>} Firestore document ID
   */
  export const createEntry = async (entryData) => {
    const number = await getNextEntryNumber();
    const colRef = collection(db, 'cadavres_exquis');
    const newEntry = {
      ...entryData,
      number,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(colRef, newEntry);
    logEvent('ENTRY', `Created entry #${number} (ID: ${docRef.id})`);
    return docRef.id;
  };
  
  /**
   * Update an existing entry by document ID.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<void>}
   */
  export const updateEntry = async (id, updates) => {
    const ref = doc(db, 'cadavres_exquis', id);
    await updateDoc(ref, updates);
    logEvent('ENTRY', `Updated entry ${id}`);
  };
  
  /**
   * Delete an entry by ID and shift numbers to fill the gap.
   * @param {string} id
   * @returns {Promise<void>}
   */
  export const deleteEntry = async (id) => {
    const entries = await getAllEntries();
    const entryToDelete = entries.find(e => e.id === id);
    if (!entryToDelete) throw new Error(`Entry not found: ${id}`);
    await deleteDoc(doc(db, 'cadavres_exquis', id));
    logEvent('ENTRY', `Deleted entry ${id} (#${entryToDelete.number})`);
  
    const entriesToShift = entries.filter(e => e.number > entryToDelete.number);
    for (const entry of entriesToShift) {
      const ref = doc(db, 'cadavres_exquis', entry.id);
      await updateDoc(ref, { number: entry.number - 1 });
      logEvent('ENTRY', `Shifted entry ${entry.id} to number ${entry.number - 1}`);
    }
  };
  