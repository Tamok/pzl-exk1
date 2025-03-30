// src/firebase/services/emojis.js
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from '../config';
  import { logEvent } from '../../utils/logger';
  
  /**
   * Retrieves all emoji records from the Firestore "emojis" collection.
   * @returns {Promise<Array>} Array of emoji records with id and associated data.
   */
  export const getEmojiRecords = async () => {
    try {
      const emojiCol = collection(db, 'emojis');
      const snapshot = await getDocs(emojiCol);
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      logEvent('EMOJI', `Retrieved ${records.length} emoji records from Firestore`);
      return records;
    } catch (error) {
      logEvent('ERROR', `Failed to retrieve emoji records: ${error.message}`);
      throw error;
    }
  };
  
  /**
   * Creates a new emoji record in the Firestore "emojis" collection.
   * @param {Object} data - The emoji data, including:
   *   - name: Custom name for the emoji (or filename as default)
   *   - emojiUrl: URL to the uploaded emoji image (or video)
   *   - convertedSize: Size (in bytes) of the processed file
   *   - type: The MIME type or a custom type string (e.g., 'video/mp4-converted')
   * @returns {Promise<Object>} The created emoji record, including its Firestore ID.
   */
  export const createEmojiRecord = async (data) => {
    try {
      const emojiCol = collection(db, 'emojis');
      // Prepare new emoji data with a timestamp.
      const newData = {
        name: data.name,
        emojiUrl: data.emojiUrl,
        convertedSize: data.convertedSize,
        type: data.type,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(emojiCol, newData);
      logEvent('EMOJI', `Created emoji record ${docRef.id}`);
      return { id: docRef.id, ...newData };
    } catch (error) {
      logEvent('ERROR', `Failed to create emoji record: ${error.message}`);
      throw error;
    }
  };
  
  /**
   * Updates an existing emoji record in the Firestore "emojis" collection.
   * @param {string} id - The document ID of the emoji to update.
   * @param {Object} updates - An object containing the fields to update.
   * @returns {Promise<void>}
   */
  export const updateEmojiRecord = async (id, updates) => {
    try {
      const emojiDoc = doc(db, 'emojis', id);
      await updateDoc(emojiDoc, updates);
      logEvent('EMOJI', `Updated emoji record ${id}`);
    } catch (error) {
      logEvent('ERROR', `Failed to update emoji record ${id}: ${error.message}`);
      throw error;
    }
  };
  
  /**
   * Deletes an emoji record from the Firestore "emojis" collection.
   * @param {string} id - The document ID of the emoji to delete.
   * @returns {Promise<void>}
   */
  export const deleteEmojiRecord = async (id) => {
    try {
      const emojiDoc = doc(db, 'emojis', id);
      await deleteDoc(emojiDoc);
      logEvent('EMOJI', `Deleted emoji record ${id}`);
    } catch (error) {
      logEvent('ERROR', `Failed to delete emoji record ${id}: ${error.message}`);
      throw error;
    }
  };
  