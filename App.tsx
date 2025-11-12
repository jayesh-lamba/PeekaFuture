// FIX: Implemented the main App component to handle authentication and routing.
import React, { useState, useEffect } from 'react';
// FIX: Updated imports to use the v9+ modular Firebase authentication functions.
import { auth, onAuthStateChanged } from './services/firebase';
// FIX: Corrected import path for types.
import type { User } from './types';
import WelcomePage from './components/WelcomePage';
import AuthPage from './components/AuthPage';
// FIX: Corrected import path for DashboardPage.
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // FIX: Use the modular `onAuthStateChanged` function from Firebase v9+.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading Peekafuture...</div>
      </div>
    );
  }

  if (user) {
    return <DashboardPage user={user} />;
  }
  
  if (showWelcome) {
    return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  }

  return <AuthPage />;
};

export default App;