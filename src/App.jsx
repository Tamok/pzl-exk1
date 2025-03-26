import { useState } from 'react';
import Diagnostics from './components/Diagnostics';
import GoogleLogin from './components/GoogleLogin';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col gap-8 items-center justify-center">
      <GoogleLogin onLogin={setUser} />
      <Diagnostics user={user} />
    </div>
  );
}

export default App;
