import React, { useState, useEffect } from 'react';
import AIProviderSettings from './AIProviderSettings';
import { CharacterCreationWizard } from './CharacterCreationWizard';

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
  locationId?: string;
}

interface AISettings {
  providerId: string;
  modelId: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

interface CharacterManagerProps {
  onCharacterSelected: (character: Character) => void;
  onBackToAuth: () => void;
}

export const CharacterManager: React.FC<CharacterManagerProps> = ({ 
  onCharacterSelected, 
  onBackToAuth 
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentView, setCurrentView] = useState<'characters' | 'ai-settings' | 'create-character'>('characters');
  const [aiConfigured, setAiConfigured] = useState(false);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Player';

  useEffect(() => {
    loadCharacters();
    // Controlla se AI è già configurata
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAiConfigured(!!settings.providerId && !!settings.modelId && !!settings.apiKey);
    }
  }, []);

  const loadCharacters = async () => {
    console.log('Loading characters with token:', token ? 'presente' : 'assente');
    if (!token) {
      setError('Token di autenticazione non trovato');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/characters', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nel caricamento personaggi: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCharacters(data.data || []);
      } else {
        throw new Error(data.error || 'Errore nel caricamento personaggi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento personaggi');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharacter = async (character: Character) => {
    try {
      setLoading(true);
      setError(null);

      // For now, skip the server call and go directly to dashboard
      // TODO: Implement proper character login when token authentication is fixed
      
      // Store selected character info
      localStorage.setItem('activeCharacter', JSON.stringify(character));
      localStorage.setItem('activeCharacterId', character.id);
      
      console.log('🎮 Character selected:', character);
      
      // Notify parent component
      onCharacterSelected(character);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select character');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = () => {
    setCurrentView('create-character');
  };

  const handleAISettings = () => {
    setCurrentView('ai-settings');
  };

  const handleAISaved = (settings: AISettings) => {
    setAiConfigured(true);
    setCurrentView('characters');
    alert('✅ Configurazione AI salvata! Ora puoi iniziare la tua avventura.');
  };

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

  const getHealthColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 75) return '#10b981'; // green
    if (percentage > 50) return '#f59e0b'; // amber
    if (percentage > 25) return '#ef4444'; // red
    return '#7f1d1d'; // dark red
  };

  // Se siamo nella vista AI settings, mostra quella
  if (currentView === 'ai-settings') {
    return (
      <AIProviderSettings 
        onBack={() => setCurrentView('characters')}
        onSave={handleAISaved}
      />
    );
  }

  // Se siamo nella vista creazione personaggio, mostra il wizard
  if (currentView === 'create-character') {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="p-4">
          <button
            onClick={() => {
              setCurrentView('characters');
              loadCharacters(); // Ricarica personaggi quando torna indietro
            }}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Torna ai Personaggi
          </button>
        </div>
        <CharacterCreationWizard onCharacterCreated={() => {
          console.log('Character created, returning to character list');
          setCurrentView('characters');
          loadCharacters();
        }} />
      </div>
    );
  }

  if (loading && characters.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0f172a', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚡</div>
          <p>Loading your characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onBackToAuth}
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: '1px solid #374151',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← Back to Login
          </button>

          <button
            onClick={handleAISettings}
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              padding: '8px 16px',
              backgroundColor: aiConfigured ? '#10b981' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🤖 {aiConfigured ? 'AI Configurata' : 'Configura AI'}
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Character Manager
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
            Welcome back, <strong>{username}</strong>! Choose your character to continue your adventure.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        {/* AI Configuration Warning */}
        {!aiConfigured && (
          <div style={{
            backgroundColor: '#f59e0b',
            border: '1px solid #d97706',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center',
            color: '#92400e'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤖</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#92400e', fontSize: '18px', fontWeight: '600' }}>
              Configura il tuo Dungeon Master AI
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#92400e', fontSize: '14px' }}>
              Per iniziare la tua avventura narrativa, devi prima configurare il provider AI che farà da Dungeon Master!
            </p>
            <button
              onClick={handleAISettings}
              style={{
                padding: '12px 24px',
                backgroundColor: '#92400e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              🚀 Configura Ora
            </button>
          </div>
        )}

        {/* Characters Grid */}
        {characters.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {characters.map((character) => (
              <div
                key={character.id}
                style={{
                  backgroundColor: '#1e293b',
                  border: selectedCharacter?.id === character.id ? '2px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onClick={() => setSelectedCharacter(character)}
              >
                {/* Character Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginRight: '15px'
                  }}>
                    {getRaceEmoji(character.race)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '1.3rem',
                      color: '#e2e8f0'
                    }}>
                      {character.name}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#9ca3af',
                      fontSize: '0.9rem'
                    }}>
                      {getClassEmoji(character.characterClass)} {character.race} {character.characterClass}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    Level {character.level}
                  </div>
                </div>

                {/* Health Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                    fontSize: '0.85rem',
                    color: '#9ca3af'
                  }}>
                    <span>❤️ Health</span>
                    <span>{character.currentHealth}/{character.baseHealth}</span>
                  </div>
                  <div style={{
                    backgroundColor: '#374151',
                    borderRadius: '4px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: getHealthColor(character.currentHealth, character.baseHealth),
                      height: '100%',
                      width: `${(character.currentHealth / character.baseHealth) * 100}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Character Actions */}
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!aiConfigured) {
                        alert('⚠️ Devi configurare il Dungeon Master AI prima di iniziare la tua avventura!');
                        handleAISettings();
                        return;
                      }
                      handleSelectCharacter(character);
                    }}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: loading ? '#6b7280' : (aiConfigured ? '#10b981' : '#ef4444'),
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Selecting...' : (aiConfigured ? '🎮 Play' : '⚠️ Configura AI')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Character details for ${character.name} coming soon!`);
                    }}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: 'transparent',
                      color: '#9ca3af',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📊
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #334155',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧙‍♂️</div>
            <h3 style={{ color: '#e2e8f0', marginBottom: '10px' }}>Nessun Personaggio</h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Crea il tuo primo personaggio per iniziare la tua avventura nel mondo di Ashnar!
            </p>
          </div>
        )}

        {/* Create New Character Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleCreateCharacter}
            style={{
              padding: '15px 30px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            ➕ Crea Nuovo Personaggio
          </button>
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem'
        }}>
          <p>💡 Suggerimento: Puoi creare fino a 6 personaggi per account</p>
        </div>
      </div>
    </div>
  );
};
