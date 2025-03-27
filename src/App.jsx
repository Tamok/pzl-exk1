// src/App.jsx
import { useEffect, useState } from 'react';
import { loginWithGoogle, observeAuthState, isAdminUser, auth } from './firebase/config';
import TestDashboard from './components/TestDashboard';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import CadavreExquisDisplay from './components/CadavreExquisDisplay';
import AudioPlayer from './components/AudioPlayer';
import DarkModeToggle from './components/DarkModeToggle';
import { logEvent } from './utils/logger';
import './App.css';

const sampleContent1 = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec orci at dolor faucibus convallis. Cras sit amet purus at ligula dictum porttitor. Proin eget semper nibh, id bibendum nunc.",
    author: "Alice"
  },
  {
    text: "Suspendisse potenti. Vivamus vestibulum, arcu a fringilla facilisis, magna lorem condimentum nisl, at bibendum mauris felis non risus. Mauris consectetur, turpis non mollis pharetra, urna nisl luctus metus.",
    author: "Alice"
  }
];

const sampleContent2 = [
  {
    text: "Praesent euismod, nibh vel fringilla blandit, nulla sapien varius sapien, ut laoreet massa tortor vitae arcu. Integer tincidunt leo vel urna facilisis. Fusce non orci at sapien sodales pharetra.",
    author: "Bob"
  },
  {
    text: "Curabitur tempus, sapien in dapibus bibendum, ex arcu sodales dui, ac interdum nulla nisi non odio. Donec in sem vitae sapien imperdiet commodo. Quisque ut risus vel lacus sollicitudin.",
    author: "Bob"
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [entries] = useState([
    { id: '1', title: 'Exquis Entry 1', content: sampleContent1 },
    { id: '2', title: 'Exquis Entry 2', content: sampleContent2 },
  ]);

  const [currentEntry, setCurrentEntry] = useState(entries[0]);

  useEffect(() => {
    observeAuthState((user) => {
      setUser(user);
      setIsAdmin(isAdminUser(user));
      logEvent('AUTH', `User logged ${user ? 'in' : 'out'}: ${user?.email || 'N/A'}`);
    });
  }, []);

  const handleLogin = () => loginWithGoogle().catch((err) => logEvent('ERROR', err.message));
  const handleLogout = () => auth.signOut().catch((err) => logEvent('ERROR', err.message));

  // Navigate between whole entries
  const handleNavigate = (directionOrId) => {
    let currentIndex = entries.findIndex((entry) => entry.id === currentEntry.id);
    if (directionOrId === 'prev') {
      currentIndex = (currentIndex - 1 + entries.length) % entries.length;
    } else if (directionOrId === 'next') {
      currentIndex = (currentIndex + 1) % entries.length;
    } else {
      currentIndex = entries.findIndex((entry) => entry.id === directionOrId);
    }
    setCurrentEntry(entries[currentIndex]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <DarkModeToggle />

      <NavigationBar
        entries={entries}
        onNavigate={handleNavigate}
        currentEntryId={currentEntry.id}
      />

      <CadavreExquisDisplay content={currentEntry.content} />

      <AudioPlayer audioUrl="https://firebasestorage.googleapis.com/v0/b/your-audio-file-url" />

      <div className="text-center p-4">
        {user ? (
          <div>
            <p>Logged in as: {user.email}</p>
            <p>{isAdmin ? 'You are admin' : 'You are a regular user'}</p>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogout}>
              Logout
            </button>
            {isAdmin && (
              <div className="mt-4">
                <TestDashboard />
              </div>
            )}
          </div>
        ) : (
          <button className="bg-green-500 text-white p-2 rounded" onClick={handleLogin}>
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
