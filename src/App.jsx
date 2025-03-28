// src/App.jsx
import { useEffect, useState } from 'react';
import { loginWithGoogle, observeAuthState, isAdminUser, auth } from './firebase/config';
import TestDashboard from './components/TestDashboard';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import CadavreExquisDisplay from './components/CadavreExquisDisplay';
import AudioPlayer from './components/AudioPlayer';
import DarkModeToggle from './components/DarkModeToggle';
import AdminPanel from './components/AdminPanel';
import AdminLogOverlay from './components/AdminLogOverlay';
import { logEvent } from './utils/logger';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const entries = [
    { id: '1', title: 'Exquis Entry 1', content: [ /* your content here */ ] },
    { id: '2', title: 'Exquis Entry 2', content: [ /* your content here */ ] },
  ];

  const [currentEntry, setCurrentEntry] = useState(entries[0]);

  useEffect(() => {
    observeAuthState((u) => {
      setUser(u);
      setIsAdmin(isAdminUser(u));
      logEvent('AUTH', `User logged ${u ? 'in' : 'out'}: ${u?.email || 'N/A'}`);
    });
  }, []);

  const handleLogin = () => loginWithGoogle().catch((err) => logEvent('ERROR', err.message));
  const handleLogout = () => auth.signOut().catch((err) => logEvent('ERROR', err.message));

  const handleNavigate = (directionOrId) => {
    let currentIndex = entries.findIndex((e) => e.id === currentEntry.id);
    if (directionOrId === 'prev') {
      currentIndex = (currentIndex - 1 + entries.length) % entries.length;
    } else if (directionOrId === 'next') {
      currentIndex = (currentIndex + 1) % entries.length;
    } else {
      currentIndex = entries.findIndex((e) => e.id === directionOrId);
    }
    setCurrentEntry(entries[currentIndex]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen
                    bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]
                    text-[var(--text-light)] dark:text-[var(--text-dark)]
                    transition-colors duration-300">
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
            <button className="mt-2" onClick={handleLogout}>Logout</button>
            {isAdmin && (
              <div className="mt-4">
                <AdminPanel />
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </div>
      {isAdmin && <AdminLogOverlay />}
    </div>
  );
}

export default App;

