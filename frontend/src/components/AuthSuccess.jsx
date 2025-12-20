import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Send message to parent window (the popup opener)
    if (window.opener) {
      try {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
          },
          window.location.origin // Only send to same origin
        );
      } catch (error) {
        console.error('Error sending message to parent:', error);
      }
      
      // Close the popup after a brief delay
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // If not in popup, redirect to home
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Authentication successful! Redirecting...</p>
      </div>
    </div>
  );
}
