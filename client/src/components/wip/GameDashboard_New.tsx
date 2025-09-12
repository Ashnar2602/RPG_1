import React from 'react';

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
}

interface GameDashboardProps {
  character: Character;
  onBackToCharacterSelect: () => void;
  onLogout: () => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  character,
  onBackToCharacterSelect,
  onLogout
}) => {
  const [currentView, setCurrentView] = React.useState<'overview' | 'inventory' | 'map' | 'combat' | 'quest' | 'chat'>('overview');
  const [notifications, setNotifications] = React.useState([
    { id: 1, type: 'quest', message: 'New quest available: The Ancient Ruins' },
    { id: 2, type: 'system', message: 'Welcome back, adventurer!' }
  ]);

  const getRaceEmoji = (race: string) => {
    const raceEmojis: Record<string, string> = {
      'HUMAN': '🧑',
      'ELF': '🧝‍♂️',
      'DWARF': '👨‍🦲',
      'ORC': '👹',
      'TROLL': '🧌',
      'GNOME': '🧙‍♂️',
      'AERATHI': '🪶',
      'GUOLGARN': '⛰️'
    };
    return raceEmojis[race] || '❓';
  };

  const getClassEmoji = (characterClass: string) => {
    const classEmojis: Record<string, string> = {
      'WARRIOR': '⚔️',
      'MAGE': '🧙‍♂️',
      'ROGUE': '🗡️',
      'CLERIC': '⛪',
      'PALADIN': '🛡️',
      'RANGER': '🏹',
      'WARLOCK': '🔮',
      'MONK': '🥋'
    };
    return classEmojis[characterClass] || '❓';
  };

  const healthPercentage = (character.currentHealth / character.baseHealth) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b',
        padding: '15px 20px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold'
          }}>
            ⚔️ L'Esperimento di Ashnar
          </h1>
          
          <div style={{
            backgroundColor: '#374151',
            padding: '10px 16px',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            border: '1px solid #4b5563'
          }}>
            <span style={{ fontSize: '1.3rem' }}>
              {getRaceEmoji(character.race)}
            </span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                {character.name}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                {getClassEmoji(character.characterClass)} {character.characterClass} • Level {character.level}
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div style={{
            backgroundColor: '#374151',
            padding: '8px 12px',
            borderRadius: '20px',
            minWidth: '200px',
            border: '1px solid #4b5563'
          }}>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#9ca3af', 
              marginBottom: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>❤️ Health</span>
              <span>{character.currentHealth}/{character.baseHealth}</span>
            </div>
            <div style={{
              backgroundColor: '#1f2937',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${healthPercentage}%`,
                  height: '100%',
                  backgroundColor: healthPercentage > 50 ? '#10b981' : healthPercentage > 25 ? '#f59e0b' : '#ef4444',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              style={{
                backgroundColor: notifications.length > 0 ? '#3b82f6' : '#374151',
                color: 'white',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              🔔
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          
          <button
            onClick={onBackToCharacterSelect}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: '1px solid #374151',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            🧙‍♂️ Characters
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '0 20px',
        display: 'flex',
        gap: '0',
        overflowX: 'auto'
      }}>
        {[
          { key: 'overview', label: '🏠 Overview', icon: '🏠' },
          { key: 'map', label: '🗺️ Explore', icon: '🗺️' },
          { key: 'combat', label: '⚔️ Combat', icon: '⚔️' },
          { key: 'quest', label: '📜 Quests', icon: '📜' },
          { key: 'inventory', label: '🎒 Inventory', icon: '🎒' },
          { key: 'chat', label: '💬 Guild', icon: '💬' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentView(tab.key as any)}
            style={{
              padding: '12px 20px',
              backgroundColor: currentView === tab.key ? '#3b82f6' : 'transparent',
              color: currentView === tab.key ? 'white' : '#9ca3af',
              border: 'none',
              borderBottom: currentView === tab.key ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: currentView === tab.key ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (currentView !== tab.key) {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== tab.key) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div style={{ padding: '20px', minHeight: 'calc(100vh - 140px)' }}>
        {currentView === 'overview' && (
          <div>
            {/* Welcome Section */}
            <div style={{
              backgroundColor: '#1e293b',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #334155',
              marginBottom: '30px',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{
                  fontSize: '4rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '50%',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getRaceEmoji(character.race)}
                </div>
                <div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '2.2rem',
                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold'
                  }}>
                    Bentornato, {character.name}!
                  </h2>
                  <p style={{ margin: '8px 0 0 0', color: '#9ca3af', fontSize: '1.2rem' }}>
                    {getClassEmoji(character.characterClass)} Level {character.level} {character.characterClass} • {character.race}
                  </p>
                  <div style={{ 
                    marginTop: '12px',
                    display: 'flex',
                    gap: '20px',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#10b981' }}>✨ Pronto per l'Avventura</span>
                    <span style={{ color: '#3b82f6' }}>🎯 {notifications.length} Nuove Notifiche</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Map & Exploration */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setCurrentView('map')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                  borderRadius: '0 12px 0 100px'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>🗺️</span>
                  <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '1.4rem', fontWeight: 'bold' }}>
                    Esplora il Mondo
                  </h3>
                </div>
                <p style={{ margin: '0 0 20px 0', color: '#9ca3af', lineHeight: '1.5' }}>
                  Scopri antiche rovine, tesori nascosti e luoghi misteriosi attraverso il vasto regno di Ashnar.
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>
                    🎯 10 Locations Available
                  </div>
                  <div style={{ 
                    color: '#3b82f6', 
                    fontSize: '1.5rem',
                    transition: 'transform 0.2s ease'
                  }}>
                    →
                  </div>
                </div>
              </div>

              {/* Combat System */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setCurrentView('combat')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)',
                  borderRadius: '0 12px 0 100px'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>⚔️</span>
                  <h3 style={{ margin: 0, color: '#ef4444', fontSize: '1.4rem', fontWeight: 'bold' }}>
                    Sistema di Combattimento
                  </h3>
                </div>
                <p style={{ margin: '0 0 20px 0', color: '#9ca3af', lineHeight: '1.5' }}>
                  Combatti in battaglie tattiche contro mostri, banditi e creature leggendarie con meccaniche avanzate.
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>
                    🏆 Pronto al Combattimento
                  </div>
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '1.5rem',
                    transition: 'transform 0.2s ease'
                  }}>
                    →
                  </div>
                </div>
              </div>

              {/* Quest System */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setCurrentView('quest')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)',
                  borderRadius: '0 12px 0 100px'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>📜</span>
                  <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '1.4rem', fontWeight: 'bold' }}>
                    Diario delle Quest
                  </h3>
                </div>
                <p style={{ margin: '0 0 20px 0', color: '#9ca3af', lineHeight: '1.5' }}>
                  Segui storie epiche e completa missioni impegnative per ottenere ricompense preziose ed esperienza.
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>
                    📋 Nuova Quest Disponibile
                  </div>
                  <div style={{ 
                    color: '#f59e0b', 
                    fontSize: '1.5rem',
                    transition: 'transform 0.2s ease'
                  }}>
                    →
                  </div>
                </div>
              </div>
            </div>

            {/* Character Stats */}
            <div style={{ 
              backgroundColor: '#1e293b',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #334155',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '25px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  color: '#3b82f6', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  {character.level}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Livello Attuale</div>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  Livello {character.level}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  color: '#10b981', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  {character.currentHealth}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Punti Salute</div>
                <div style={{
                  marginTop: '8px',
                  backgroundColor: '#374151',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: `${healthPercentage}%`,
                      height: '100%',
                      backgroundColor: '#10b981',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  color: '#f59e0b', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  0
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Quest Attive</div>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#92400e',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  Pronto a Iniziare
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  color: '#8b5cf6', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  0
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Oggetti Equipaggiati</div>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#7c3aed',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  Inventario Vuoto
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView !== 'overview' && (
          <div style={{
            backgroundColor: '#1e293b',
            padding: '60px',
            borderRadius: '12px',
            border: '1px solid #334155',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              {currentView === 'map' && '🗺️'}
              {currentView === 'combat' && '⚔️'}
              {currentView === 'quest' && '📜'}
              {currentView === 'inventory' && '🎒'}
              {currentView === 'chat' && '💬'}
            </div>
            <h2 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '2rem',
              color: '#3b82f6'
            }}>
              {currentView === 'map' && 'Mappa del Mondo & Esplorazione'}
              {currentView === 'combat' && 'Sistema di Combattimento'}
              {currentView === 'quest' && 'Diario delle Quest'}
              {currentView === 'inventory' && 'Gestione Inventario'}
              {currentView === 'chat' && 'Gilda & Social'}
            </h2>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '1.1rem',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              Questa funzionalità arriverà presto! Stiamo lavorando duramente per portarti un'esperienza di {currentView} fantastica.
            </p>
            <button
              onClick={() => setCurrentView('overview')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              🏠 Torna alla Panoramica
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
