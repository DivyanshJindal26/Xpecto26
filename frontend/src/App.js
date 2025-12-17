import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import XpectoHome from './components/XpectoHome';
import AuthSuccess from './components/AuthSuccess';
import AuthError from './components/AuthError';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<XpectoHome />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/error" element={<AuthError />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
