// src/firebase/services/players.js
import {
  collection, doc, getDoc, setDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';
import { db } from '../config';
import { logEvent } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
* Creates a new player profile.
* If an email is provided (non-empty), the player is a Main Profile.
* Otherwise, it is an Entry Profile (and will have no mainId).
* For Main Profiles, mainId is set to the player's uuid and emails array includes the email.
* @param {Object} data - Partial Player object with fields: name, email, avatarUrl, color, patternSeed.
* @returns {Promise<string>} - The player's uuid.
*/
export const createPlayer = async (data) => {
const uuid = uuidv4();
const isMain = data.email && data.email.trim() !== '';
const player = {
  uuid,
  name: data.name || 'Unnamed',
  avatarURL: data.avatarUrl || '',
  color: data.color || '#ffffff',
  patternSeed: data.patternSeed || 'default-seed',
  email: isMain ? data.email.trim() : '',
  emails: isMain ? [data.email.trim()] : [],
  // For Main Profiles, mainId is the same as uuid; for Entry Profiles, it starts as null.
  mainId: isMain ? uuid : null,
};
await setDoc(doc(db, 'players', uuid), player);
logEvent('PLAYER', `Created ${isMain ? 'Main' : 'Entry'} profile ${uuid} (${player.name})`);
return uuid;
};

/**
* Updates a player profile by UUID.
* @param {string} uuid - The player's UUID.
* @param {Object} updates - Fields to update.
* @returns {Promise<void>}
*/
export const updatePlayer = async (uuid, updates) => {
const ref = doc(db, 'players', uuid);
await updateDoc(ref, updates);
logEvent('PLAYER', `Updated player ${uuid} with changes: ${JSON.stringify(updates)}`);
};

/**
* Deletes a player profile by UUID.
* @param {string} uuid - The player's UUID.
* @returns {Promise<void>}
*/
export const deletePlayer = async (uuid) => {
await deleteDoc(doc(db, 'players', uuid));
logEvent('PLAYER', `Deleted player ${uuid}`);
};

/**
* Fetches all player profiles.
* @returns {Promise<Array>} Array of player objects.
*/
export const getAllPlayers = async () => {
const snapshot = await getDocs(collection(db, 'players'));
return snapshot.docs.map(doc => doc.data());
};

/**
* Retrieves a specific player profile by UUID.
* @param {string} uuid
* @returns {Promise<Object|null>}
*/
export const getPlayer = async (uuid) => {
const docRef = doc(db, 'players', uuid);
const docSnap = await getDoc(docRef);
return docSnap.exists() ? docSnap.data() : null;
};
