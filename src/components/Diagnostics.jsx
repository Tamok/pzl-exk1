import { useState } from 'react';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import app from '../firebase/config';
import { logEvent } from '../utils/logger';

const Diagnostics = ({ user }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    if (!user) {
      setResults(['⚠️ You must be logged in to run diagnostics.']);
      return;
    }

    setLoading(true);
    const db = getFirestore(app);
    const storage = getStorage(app);
    let testResults = [];

    // Firestore Test
    try {
      const testDocRef = doc(db, 'test_collection', 'testDoc');
      await setDoc(testDocRef, { testField: 'Hello Firebase', timestamp: Date.now() });
      const docSnap = await getDoc(testDocRef);

      if (docSnap.exists() && docSnap.data().testField === 'Hello Firebase') {
        testResults.push('✅ Firestore read/write test passed.');
      } else {
        testResults.push('❌ Firestore read/write test failed.');
      }

      await deleteDoc(testDocRef);
    } catch (error) {
      testResults.push(`❌ Firestore test error: ${error.message}`);
    }

    logEvent('Diagnostics', 'Firestore test complete');

    // Storage Test
    try {
      const testRef = ref(storage, `test/${user.uid}/testFile.txt`);
      await uploadString(testRef, 'Firebase Storage Test');
      const url = await getDownloadURL(testRef);

      if (url) {
        testResults.push('✅ Storage upload/download test passed.');
      } else {
        testResults.push('❌ Storage upload/download test failed.');
      }

      await deleteObject(testRef);
    } catch (error) {
      testResults.push(`❌ Storage test error: ${error.message}`);
    }

    logEvent('Diagnostics', 'Storage test complete');

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded shadow-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">🧪 Firebase Integration Diagnostics</h2>
      <button
        onClick={runDiagnostics}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:bg-gray-500"
      >
        {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
      </button>
      <ul>
        {results.map((result, idx) => (
          <li key={idx} className="mb-2">
            {result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Diagnostics;
