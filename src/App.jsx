// src/App.jsx
import { useEffect, useState } from 'react';
import { loginWithGoogle, observeAuthState, isAdminUser, auth } from './firebase/config';
import TestDashboard from './components/TestDashboard';
import { logEvent } from './utils/logger';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    observeAuthState((user) => {
      setUser(user);
      setIsAdmin(isAdminUser(user));
      logEvent('AUTH', `User logged ${user ? 'in' : 'out'}: ${user?.email || 'N/A'}`);
    });
  }, []);

  const handleLogin = () => loginWithGoogle().catch((err) => logEvent('ERROR', err.message));
  const handleLogout = () => auth.signOut().catch((err) => logEvent('ERROR', err.message));

  return (
    <div className="text-center p-4">
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <p>{isAdmin ? 'You are admin' : 'You are a regular user'}</p>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogout}>Logout</button>
          {isAdmin && (
            <div className="mt-4">
              <TestDashboard />
            </div>
          )}
        </div>
      ) : (
        <button className="bg-green-500 text-white p-2 rounded" onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
