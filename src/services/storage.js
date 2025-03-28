// src/firebase/services/storage.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config';
import { logEvent } from '../../utils/logger';

export const uploadSoundFile = async (file) => {
  const path = `audio/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  logEvent('SOUND', `Uploaded audio: ${file.name}`);
  return url;
};
