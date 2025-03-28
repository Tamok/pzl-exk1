import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getMetadata } from 'firebase/storage';

export const tests = [
  {
    name: 'Auth Check',
    category: 'Firebase',
    run: async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No logged in user found.');
      return `Logged in as ${user.email}`;
    }
  },
  {
    name: 'Firestore Connection',
    category: 'Firebase',
    run: async () => {
      const snap = await getDocs(collection(db, 'cadavres_exquis'));
      return `Fetched ${snap.docs.length} cadavres_exquis entries`;
    }
  },
  {
    name: 'Storage Access',
    category: 'Firebase',
    run: async () => {
      const fakeFile = ref(storage, 'nonexistent-file.mp3');
      try {
        await getMetadata(fakeFile);
        throw new Error('This should not exist');
      } catch (e) {
        if (e.code === 'storage/object-not-found') {
          return 'Storage reachable, test passed (404 expected)';
        }
        throw e;
      }
    }
  }
];
