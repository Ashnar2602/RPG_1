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
            onClick={onLogout}
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
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Welcome Section */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
              {getRaceEmoji(character.race)}
            </div>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '10px',
              color: '#10b981'
            }}>
              Welcome back, {character.name}!
            </h2>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '1.1rem',
              marginBottom: '20px'
            }}>
              {getClassEmoji(character.characterClass)} {character.race} {character.characterClass} • Level {character.level}
            </p>
            
            {/* Health Bar */}
            <div style={{ 
              maxWidth: '300px', 
              margin: '0 auto',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '0.9rem',
                color: '#9ca3af'
              }}>
                <span>❤️ Health</span>
                <span>{character.currentHealth}/{character.baseHealth}</span>
              </div>
              <div style={{
                backgroundColor: '#374151',
                borderRadius: '6px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#10b981',
                  height: '100%',
                  width: `${(character.currentHealth / character.baseHealth) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            <div style={{
              display: 'inline-block',
              backgroundColor: '#065f46',
              color: '#10b981',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #10b981'
            }}>
              🎯 Ready for Adventure!
            </div>
          </div>

          {/* Coming Soon Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              { icon: '🗺️', title: 'World Map', desc: 'Explore the realm' },
              { icon: '⚔️', title: 'Combat Arena', desc: 'Battle monsters' },
              { icon: '🎒', title: 'Inventory', desc: 'Manage your gear' },
              { icon: '📜', title: 'Quests', desc: 'Epic adventures await' },
              { icon: '👥', title: 'Social', desc: 'Chat with players' },
              { icon: '🏛️', title: 'Guilds', desc: 'Join a community' }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => alert(`${feature.title} coming soon! 🚀`)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#e2e8f0',
                  fontSize: '1.1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#9ca3af',
                  fontSize: '0.9rem'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Development Status */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#8b5cf6', marginBottom: '15px' }}>
              🚧 Development Status
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              fontSize: '0.9rem'
            }}>
              <div>✅ Authentication System</div>
              <div>✅ Character Management</div>
              <div>✅ Map & Movement System</div>
              <div>⚠️ Dashboard (Current)</div>
              <div>🔄 Chat System (Next)</div>
              <div>📋 Quest System (Planned)</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
