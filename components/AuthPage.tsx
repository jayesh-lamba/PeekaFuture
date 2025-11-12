// FIX: Implemented the AuthPage component for unauthenticated users.
import React, { useState } from 'react';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/firebase';
import Logo from './Logo';
// FIX: Corrected import path for Icons.
import { GoogleIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from './Icons';

const mapAuthCodeToMessage = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'Email address is not valid.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
       return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    default:
      return 'An unknown error occurred. Please try again.';
  }
};


const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');


  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error during sign-in:", error);
      if (error instanceof Error && 'code' in error) {
         setError(mapAuthCodeToMessage((error as {code: string}).code));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!email || !password || (isSignUp && !displayName)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      // onAuthStateChanged in App.tsx will handle the state change
    } catch (err) {
      console.error("Auth Error:", err);
       if (err instanceof Error && 'code' in err) {
         setError(mapAuthCodeToMessage((err as {code: string}).code));
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };


  return (
    <div className="min-h-screen auth-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo className="text-5xl inline-block" variant="default" />
          <p className="text-md text-gray-600 mt-2">
            Your personalized guide to a successful future.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-200/50">
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-1">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
          <p className="text-center text-gray-600 mb-6">Let's get you started.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="input-with-icon">
                <UserIcon className="icon h-5 w-5" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                  required
                />
              </div>
            )}
             <div className="input-with-icon">
                <EnvelopeIcon className="icon h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                  required
                />
              </div>
               <div className="input-with-icon">
                <LockClosedIcon className="icon h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                  required
                />
              </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-md flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

             <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
               {isSignUp ? 'Sign Up' : 'Sign In'}
             </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
             {isSignUp ? 'Already have an account?' : "Don't have an account?"}
             <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-medium text-purple-600 hover:text-purple-500 ml-1">
               {isSignUp ? 'Sign In' : 'Sign Up'}
             </button>
           </p>

           <div className="my-6 flex items-center">
             <div className="flex-grow border-t border-gray-300"></div>
             <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold uppercase">OR</span>
             <div className="flex-grow border-t border-gray-300"></div>
           </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-purple-50 text-gray-700 font-semibold py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm inline-flex items-center justify-center gap-3 transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;