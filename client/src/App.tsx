import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Import pages (we'll create these)
import { AuthPage } from './pages/AuthPage';
import { CharacterSelectPage } from './pages/CharacterSelectPage';
import { GamePage } from './pages/GamePage';

// Import components
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NotificationContainer } from './components/common/NotificationContainer';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route
              path="/characters"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CharacterSelectPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/game"
              element={
                <ProtectedRoute requireCharacter>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
          
          {/* Global notifications */}
          <NotificationContainer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
