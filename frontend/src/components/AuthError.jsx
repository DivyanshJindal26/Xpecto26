import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
        <p className="text-gray-600 mb-6">
          We couldn't complete your authentication. Please try again.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
