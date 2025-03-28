// src/firebase/services/players.js

import {
    collection, doc, getDoc, setDoc, getDocs, updateDoc, deleteDoc
  } from 'firebase/firestore';
  import { db } from '../config';
  import { logEvent } from '../../utils/logger';
  import { v4 as uuidv4 } from 'uuid';
  
  /**
   * Create a new player profile.
   * @param {Object} data - Partial Player object
   * @returns {Promise<string>} - UUID of created player
   */
  export const createPlayer = async (data) => {
    const uuid = uuidv4();
    const docRef = doc(db, 'players', uuid);
    const player = {
      uuid,
      name: data.name ?? 'Unnamed',
      avatarURL: data.avatarURL ?? '',
      color: data.color ?? '#ffffff',
      patternSeed: data.patternSeed ?? 'default-seed',
      emails: data.emails ?? [],
      mainId: uuid,
    };
    await setDoc(docRef, player); // 🔧 Set directly by UUID
    logEvent('PLAYER', `Created player ${uuid} (${player.name})`);
    return uuid;
  };  
  
  /**
   * Update a player profile by UUID.
   * @param {string} uuid
   * @param {Object} updates
   * @returns {Promise<void>}
   */
  export const updatePlayer = async (uuid, updates) => {
    const ref = doc(db, 'players', uuid);
    await updateDoc(ref, updates);
    logEvent('PLAYER', `Updated player ${uuid}`);
  };
  
  /**
   * Delete a player by UUID.
   * @param {string} uuid
   * @returns {Promise<void>}
   */
  export const deletePlayer = async (uuid) => {
    await deleteDoc(doc(db, 'players', uuid));
    logEvent('PLAYER', `Deleted player ${uuid}`);
  };
  
  /**
   * Fetch all players.
   * @returns {Promise<Array>}
   */
  export const getAllPlayers = async () => {
    const snapshot = await getDocs(collection(db, 'players'));
    return snapshot.docs.map(doc => doc.data());
  };
  
  /**
   * Get a specific player by UUID.
   * @param {string} uuid
   * @returns {Promise<Object|null>}
   */
  export const getPlayer = async (uuid) => {
    const docRef = doc(db, 'players', uuid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };
  