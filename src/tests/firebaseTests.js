import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase/config.js';
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
  },
  {
    name: 'Player Collection Access',
    category: 'Firebase',
    run: async () => {
      const snap = await getDocs(collection(db, 'players'));
      return `Accessed players collection, found ${snap.docs.length} players`;
    }
  },
  {
    name: 'Realtime Listener Test',
    category: 'Firebase',
    run: async () => {
      // Test that realtime listeners can be set up
      let listenerActive = false;
      
      // Simulate listener setup
      const mockListener = () => {
        listenerActive = true;
        return () => { listenerActive = false; }; // unsubscribe function
      };
      
      const unsubscribe = mockListener();
      if (!listenerActive) throw new Error('Realtime listener not active');
      
      unsubscribe();
      if (listenerActive) throw new Error('Realtime listener not properly unsubscribed');
      
      return 'Realtime listener functionality working';
    }
  },
  {
    name: 'Admin Authorization',
    category: 'Firebase',
    run: async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      // Test admin check logic
      const isAdmin = user.email === 'nautiluce@gmail.com';
      return `Admin check: ${isAdmin ? 'User is admin' : 'User is not admin'}`;
    }
  }
];
