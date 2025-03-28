// src/firebase/services/playerMappings.js

import {
    doc, getDoc, setDoc, updateDoc, collection, getDocs
  } from 'firebase/firestore';
  import { db } from '../config';
  import { logEvent } from '../../utils/logger';
  import { v4 as uuidv4 } from 'uuid';
  
  /**
   * Get mapping data for a mainId.
   * @param {string} mainId
   * @returns {Promise<Object|null>}
   */
  export const getPlayerMapping = async (mainId) => {
    const ref = doc(db, 'player_mappings', mainId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };
  
  /**
   * Create a mapping for a new mainId.
   * @param {Object} data - { mainId, linkedUUIDs, emails, names }
   * @returns {Promise<void>}
   */
  export const createPlayerMapping = async (data) => {
    const ref = doc(db, 'player_mappings', data.mainId);
    await setDoc(ref, {
      linkedUUIDs: data.linkedUUIDs ?? [],
      emails: data.emails ?? [],
      names: data.names ?? [],
    });
    logEvent('MAPPING', `Created player mapping for ${data.mainId}`);
  };
  
  /**
   * Merge multiple players under a new mainId.
   * @param {Array<string>} uuidsToMerge
   * @param {string|null} existingMainId
   * @returns {Promise<string>} - The final mainId used
   */
  export const mergePlayers = async (uuidsToMerge, existingMainId = null) => {
    const mainId = existingMainId ?? uuidv4();
    const allUUIDs = new Set(uuidsToMerge);
    const emails = new Set();
    const names = new Set();
  
    const playersSnapshot = await getDocs(collection(db, 'players'));
    const players = playersSnapshot.docs.map(doc => doc.data());
  
    for (const p of players) {
      if (uuidsToMerge.includes(p.uuid)) {
        if (p.emails) p.emails.forEach(e => emails.add(e));
        if (p.name) names.add(p.name);
      }
    }
  
    for (const uuid of uuidsToMerge) {
      const playerRef = doc(db, 'players', uuid);
      await updateDoc(playerRef, { mainId });
    }
  
    const ref = doc(db, 'player_mappings', mainId);
    await setDoc(ref, {
      linkedUUIDs: Array.from(allUUIDs),
      emails: Array.from(emails),
      names: Array.from(names),
    });
  
    logEvent('MAPPING', `Merged players into ${mainId}: [${Array.from(allUUIDs).join(', ')}]`);
    return mainId;
  };
  