import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      <img
        src={user.avatar || 'https://via.placeholder.com/40'}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
      />
      <div className="hidden md:block">
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-slate-300">{user.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="ml-2 px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition"
      >
        Logout
      </button>
    </div>
  );
}
