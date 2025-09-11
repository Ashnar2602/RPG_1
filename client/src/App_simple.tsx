import React, { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { CombatPage } from './pages/CombatPage';
import { MapPage } from './pages/MapPage';
import { CharacterManager } from './components/CharacterManager';
import NarrativeDashboard from './components/NarrativeDashboard';

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
}

type CurrentPage = 'auth' | 'character-manager' | 'dashboard' | 'combat' | 'map';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // Check if we have an active character on app load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const activeCharacter = localStorage.getItem('activeCharacter');
    
    if (token && activeCharacter) {
      try {
        const character = JSON.parse(activeCharacter);
        setSelectedCharacter(character);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } catch (error) {
        // Invalid character data, clear it
        localStorage.removeItem('activeCharacter');
        localStorage.removeItem('activeCharacterId');
      }
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('character-manager');
  };

  const handleCharacterSelected = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentPage('dashboard');
  };

  const handleBackToCharacterSelect = () => {
    setSelectedCharacter(null);
    localStorage.removeItem('activeCharacter');
    localStorage.removeItem('activeCharacterId');
    setCurrentPage('character-manager');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeCharacter');
    localStorage.removeItem('activeCharacterId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setSelectedCharacter(null);
    setCurrentPage('auth');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      {/* Navigation - Only show for dashboard and game pages */}
      {isAuthenticated && selectedCharacter && currentPage !== 'character-manager' && (
        <nav style={{ 
          backgroundColor: '#1f2937', 
          padding: '10px 20px', 
          borderBottom: '1px solid #374151',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 'dashboard' ? '#3b82f6' : 'transparent',
                color: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('combat')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 'combat' ? '#dc2626' : 'transparent',
                color: 'white',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ⚔️ Combat
            </button>
            <button
              onClick={() => setCurrentPage('map')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 'map' ? '#10b981' : 'transparent',
                color: 'white',
                border: '1px solid #10b981',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🗺️ World Map
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Playing as: <strong style={{ color: '#10b981' }}>{selectedCharacter?.name}</strong>
            </span>
            <button
              onClick={handleBackToCharacterSelect}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
                border: '1px solid #374151',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🧙‍♂️ Characters
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#7f1d1d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* Page Content */}
      {currentPage === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      
      {currentPage === 'character-manager' && isAuthenticated && (
        <CharacterManager 
          onCharacterSelected={handleCharacterSelected}
          onBackToAuth={() => setCurrentPage('auth')}
        />
      )}
      
      {currentPage === 'dashboard' && isAuthenticated && selectedCharacter && (
        <NarrativeDashboard 
          character={selectedCharacter}
          onBackToCharacterSelect={handleBackToCharacterSelect}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'combat' && isAuthenticated && selectedCharacter && (
        <CombatPage />
      )}
      
      {currentPage === 'map' && isAuthenticated && selectedCharacter && (
        <MapPage />
      )}
    </div>
  );
}

export default App;
