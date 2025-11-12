import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { LogoutIcon } from './Icons';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 transition-opacity hover:opacity-80">
        <span className="hidden sm:inline font-medium text-gray-700">{user.displayName}</span>
        <img
          className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-purple-500"
          src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`}
          alt="User avatar"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 origin-top-right animate-in fade-in-0 zoom-in-95">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            <LogoutIcon className="h-5 w-5 mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
