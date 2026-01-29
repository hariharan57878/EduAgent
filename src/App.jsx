import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateModule from './components/CreateModule';
import MyPaths from './components/MyPaths';
import VoiceInput from './pages/VoiceInput';
import Community from './pages/Community';
import Settings from './pages/Settings';
import ModuleDetail from './pages/ModuleDetail';
import Login from './pages/Login';

import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        Loading EduAgent...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AppProvider>
      <Router>
        <div className="container">
          {/* Navigation Sidebar */}
          <Sidebar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-module" element={<CreateModule />} />
            <Route path="/my-paths" element={<MyPaths />} />
            <Route path="/module/:id" element={<ModuleDetail />} />
            <Route path="/voice-space" element={<VoiceInput />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
