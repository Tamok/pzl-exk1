import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../firebase/config';
import { logEvent } from '../utils/logger';

const GoogleLogin = ({ onLogin }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      onLogin(result.user); // Pass user to parent
      logEvent('Auth', `User logged in: ${result.user.email}`);
    } catch (err) {
      setError(err.message);
      logEvent('AuthError', err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow-lg text-white text-center">
      {!user ? (
        <>
          <h2 className="text-2xl mb-4">Sign In with Google</h2>
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            🔥 Sign in with Google
          </button>
          {error && <p className="text-red-400 mt-4">⚠️ {error}</p>}
        </>
      ) : (
        <>
          <h2 className="text-xl">🎉 Welcome, {user.displayName}</h2>
          <p className="mt-2">{user.email}</p>
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full mx-auto mt-4"
          />
        </>
      )}
    </div>
  );
};

export default GoogleLogin;
