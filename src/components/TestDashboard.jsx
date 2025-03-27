// src/components/TestDashboard.jsx
import { useState } from 'react';
import { db, storage, auth } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { logEvent } from '../utils/logger';

const TestDashboard = () => {
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const runFirestoreTest = async () => {
    const docRef = doc(db, 'test_collection', 'test_doc');
    try {
      await setDoc(docRef, { testField: 'Hello Firestore!' });
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() : null;
      await deleteDoc(docRef);

      setResults(prev => [...prev, `Firestore Test Passed: ${JSON.stringify(data)}`]);
      logEvent('TEST', 'Firestore test passed');
    } catch (error) {
      setResults(prev => [...prev, `Firestore Test Failed: ${error.message}`]);
      logEvent('ERROR', `Firestore test failed: ${error.message}`);
    }
  };

  const runStorageTest = async () => {
    const storageRef = ref(storage, 'test_folder/test.txt');
    try {
      await uploadString(storageRef, 'Hello Storage!', 'raw');
      const url = await getDownloadURL(storageRef);
      await deleteObject(storageRef);

      setResults(prev => [...prev, `Storage Test Passed: ${url}`]);
      logEvent('TEST', 'Storage test passed');
    } catch (error) {
      setResults(prev => [...prev, `Storage Test Failed: ${error.message}`]);
      logEvent('ERROR', `Storage test failed: ${error.message}`);
    }
  };

  const runAuthTest = () => {
    const user = auth.currentUser;
    if (user) {
      setResults(prev => [...prev, `Auth Test Passed: Logged in as ${user.email}`]);
      logEvent('TEST', `Auth test passed: ${user.email}`);
    } else {
      setResults(prev => [...prev, 'Auth Test Failed: No user logged in']);
      logEvent('ERROR', 'Auth test failed: No user logged in');
    }
  };

  const runCollectionRetrievalTest = async () => {
    try {
      const colRef = collection(db, 'test_collection');
      const snapshot = await getDocs(colRef);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(prev => [...prev, `Collection Retrieval Passed: ${JSON.stringify(docs)}`]);
      logEvent('TEST', 'Collection retrieval test passed');
    } catch (error) {
      setResults(prev => [...prev, `Collection Retrieval Failed: ${error.message}`]);
      logEvent('ERROR', `Collection retrieval test failed: ${error.message}`);
    }
  };

  const runRealtimeListenerTest = () => {
    const docRef = doc(db, 'test_collection', 'realtime_doc');
    setDoc(docRef, { realtime: 'Initial Value' });

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setResults(prev => [...prev, `Realtime Listener Update: ${JSON.stringify(data)}`]);
        logEvent('TEST', 'Realtime listener received update');
      }
    });

    setTimeout(() => {
      setDoc(docRef, { realtime: 'Updated Value' });
      setTimeout(() => {
        unsubscribe();
        deleteDoc(docRef);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="p-4 rounded transition-colors duration-300
                    bg-[var(--container-bg-light)] dark:bg-[var(--container-bg-dark)]
                    text-[var(--text-light)] dark:text-[var(--text-dark)]">
      <h2 className="text-xl mb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        Admin Test Dashboard {isOpen ? '▲' : '▼'}
      </h2>
      {isOpen && (
        <>
          <div className="space-x-2 mb-4">
            <button onClick={runAuthTest} className="bg-blue-500 px-2 py-1 rounded transition-colors duration-200">Test Auth</button>
            <button onClick={runFirestoreTest} className="bg-green-500 px-2 py-1 rounded transition-colors duration-200">Test Firestore</button>
            <button onClick={runStorageTest} className="bg-purple-500 px-2 py-1 rounded transition-colors duration-200">Test Storage</button>
            <button onClick={runCollectionRetrievalTest} className="bg-yellow-500 px-2 py-1 rounded transition-colors duration-200">Retrieve Collection</button>
            <button onClick={runRealtimeListenerTest} className="bg-red-500 px-2 py-1 rounded transition-colors duration-200">Realtime Listener</button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg mb-1">Results:</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default TestDashboard;
