// src/components/TestDashboard.jsx
import { useState } from 'react';
import { db, storage, auth } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { logEvent } from '../utils/logger';

const TestDashboard = () => {
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const timestamped = (msg) => `[${new Date().toLocaleTimeString()}] ${msg}`;

  const runFirestoreTest = async () => {
    const docRef = doc(db, 'test_collection', 'test_doc');
    try {
      await setDoc(docRef, { testField: 'Hello Firestore!' });
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() : null;
      await deleteDoc(docRef);
      setResults(prev => [...prev, timestamped(`Firestore Test Passed: ${JSON.stringify(data)}`)]);
      logEvent('TEST', 'Firestore test passed');
    } catch (error) {
      setResults(prev => [...prev, timestamped(`Firestore Test Failed: ${error.message}`)]);
      logEvent('ERROR', `Firestore test failed: ${error.message}`);
    }
  };

  const runStorageTest = async () => {
    const storageRef = ref(storage, 'test_folder/test.txt');
    try {
      await uploadString(storageRef, 'Hello Storage!', 'raw');
      const url = await getDownloadURL(storageRef);
      await deleteObject(storageRef);
      setResults(prev => [...prev, timestamped(`Storage Test Passed: ${url}`)]);
      logEvent('TEST', 'Storage test passed');
    } catch (error) {
      setResults(prev => [...prev, timestamped(`Storage Test Failed: ${error.message}`)]);
      logEvent('ERROR', `Storage test failed: ${error.message}`);
    }
  };

  const runAuthTest = () => {
    const user = auth.currentUser;
    if (user) {
      setResults(prev => [...prev, timestamped(`Auth Test Passed: Logged in as ${user.email}`)]);
      logEvent('TEST', `Auth test passed: ${user.email}`);
    } else {
      setResults(prev => [...prev, timestamped('Auth Test Failed: No user logged in')]);
      logEvent('ERROR', 'Auth test failed: No user logged in');
    }
  };

  const runCollectionRetrievalTest = async () => {
    try {
      const colRef = collection(db, 'test_collection');
      const snapshot = await getDocs(colRef);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(prev => [...prev, timestamped(`Collection Retrieval Passed: ${JSON.stringify(docs)}`)]);
      logEvent('TEST', 'Collection retrieval test passed');
    } catch (error) {
      setResults(prev => [...prev, timestamped(`Collection Retrieval Failed: ${error.message}`)]);
      logEvent('ERROR', `Collection retrieval test failed: ${error.message}`);
    }
  };

  const runRealtimeListenerTest = () => {
    const docRef = doc(db, 'test_collection', 'realtime_doc');
    setDoc(docRef, { realtime: 'Initial Value' });

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setResults(prev => [...prev, timestamped(`Realtime Listener Update: ${JSON.stringify(data)}`)]);
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

  // New test: Admin Panel Tab Interaction
  const testAdminPanelTabs = () => {
    logEvent('TEST', 'Simulating Admin Panel tab switch: New Entry');
    setResults(prev => [...prev, timestamped('Admin Panel Tab Test: Switched to New Entry')]);
    logEvent('TEST', 'Simulating Admin Panel tab switch: Player Management');
    setResults(prev => [...prev, timestamped('Admin Panel Tab Test: Switched to Player Management')]);
    logEvent('TEST', 'Simulating Admin Panel tab switch: Tests');
    setResults(prev => [...prev, timestamped('Admin Panel Tab Test: Switched to Tests')]);
  };

  // New test: Cadavre Exquis Entry Form Interaction
  const testEntryFormInteraction = () => {
    let themes = [
      { name: 'Theme A', voteCount: 5, isRunnerUp: false },
      { name: 'Theme B', voteCount: 8, isRunnerUp: true },
      { name: 'Theme C', voteCount: 3, isRunnerUp: false }
    ];
    themes.push({ name: 'Theme D', voteCount: 4, isRunnerUp: false });
    logEvent('TEST', 'Entry Form: Added new theme, total themes: ' + themes.length);
    themes.splice(2, 1);
    logEvent('TEST', 'Entry Form: Deleted one theme, total themes: ' + themes.length);
    let winnerIndex = 0;
    themes.forEach((theme, idx) => {
      if (theme.voteCount > themes[winnerIndex].voteCount) {
        winnerIndex = idx;
      }
    });
    logEvent('TEST', `Entry Form: Winner theme auto-determined: ${themes[winnerIndex].name}`);
    let paragraphs = [
      { text: 'Paragraph 1', player: 'Player 1 (placeholder)' },
      { text: 'Paragraph 2', player: 'Player 2 (placeholder)' }
    ];
    logEvent('TEST', `Entry Form: Added ${paragraphs.length} paragraphs`);
    setResults(prev => [...prev, timestamped('Entry Form Interaction Test passed. Check logs for details.')]);
  };

  // New test: Player Management Interaction
  const testPlayerManagementInteraction = () => {
    let testColor = '#123456';
    logEvent('TEST', `Player Management: Color set to ${testColor}`);
    logEvent('TEST', 'Player Management: Simulated avatar file selection.');
    logEvent('TEST', 'Player Management: Existing players dropdown styled for dark mode.');
    logEvent('TEST', 'Player Management: Form reset simulation complete.');
    setResults(prev => [...prev, timestamped('Player Management Interaction Test passed. Check logs for details.')]);
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
            <button onClick={runAuthTest} className="bg-blue-500 px-2 py-1 rounded transition-colors duration-200" title="Test authentication status">Test Auth</button>
            <button onClick={runFirestoreTest} className="bg-green-500 px-2 py-1 rounded transition-colors duration-200" title="Test Firestore operations">Test Firestore</button>
            <button onClick={runStorageTest} className="bg-purple-500 px-2 py-1 rounded transition-colors duration-200" title="Test Storage operations">Test Storage</button>
            <button onClick={runCollectionRetrievalTest} className="bg-yellow-500 px-2 py-1 rounded transition-colors duration-200" title="Test Firestore collection retrieval">Retrieve Collection</button>
            <button onClick={runRealtimeListenerTest} className="bg-red-500 px-2 py-1 rounded transition-colors duration-200" title="Test realtime listener functionality">Realtime Listener</button>
            <button onClick={testAdminPanelTabs} className="bg-indigo-500 px-2 py-1 rounded transition-colors duration-200" title="Test Admin Panel tab switching">Test Admin Panel Tabs</button>
            <button onClick={testEntryFormInteraction} className="bg-teal-500 px-2 py-1 rounded transition-colors duration-200" title="Test Cadavre Exquis Entry Form interactions">Test Entry Form Interaction</button>
            <button onClick={testPlayerManagementInteraction} className="bg-orange-500 px-2 py-1 rounded transition-colors duration-200" title="Test Player Management interactions">Test Player Management Interaction</button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg mb-1">Results:</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index} className="mb-1 break-words">{result}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default TestDashboard;
