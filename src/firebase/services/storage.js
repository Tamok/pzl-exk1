// src/firebase/services/storage.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config';
import { logEvent } from '../../utils/logger';

/**
 * Uploads a sound file to Firebase Storage under /sounds/
 * Returns the download URL.
 */
export const uploadSoundFile = async (file) => {
  const filePath = `sounds/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, filePath);

  try {
    logEvent('SOUND', `Uploading sound file: ${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    logEvent('SOUND', `Upload successful: ${url}`);
    return url;
  } catch (error) {
    logEvent('ERROR', `Sound upload failed: ${error.message}`);
    throw new Error('Failed to upload sound file.');
  }
};
