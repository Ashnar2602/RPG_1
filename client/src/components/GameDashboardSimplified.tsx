import React, { useState } from 'react';
import AIConfigurationPage from './AIConfigurationPage';

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

const GameDashboardSimplified: React.FC<GameDashboardProps> = ({ 
  character, 
  onBackToCharacterSelect, 
  onLogout 
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'ai-config'>('dashboard');
  
  if (currentView === 'ai-config') {
    return <AIConfigurationPage onBack={() => setCurrentView('dashboard')} />;
  }

  const getRaceEmoji = (race: string) => {
    const raceEmojis: Record<string, string> = {
      'HUMAN': '🧑', 'ELF': '🧝‍♂️', 'DWARF': '👨‍🦲', 'ORC': '👹',
      'TROLL': '🧌', 'GNOME': '🧙‍♂️', 'AERATHI': '🪶', 'GUOLGARN': '⛰️'
    };
    return raceEmojis[race] || '❓';
  };

  const getClassEmoji = (characterClass: string) => {
    const classEmojis: Record<string, string> = {
      'WARRIOR': '⚔️', 'MAGE': '🧙‍♂️', 'ROGUE': '🗡️', 'CLERIC': '⛪',
      'PALADIN': '🛡️', 'RANGER': '🏹'
    };
    return classEmojis[characterClass] || '⚔️';
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease'
  };

  const progressBarStyle = {
    width: '100%',
    height: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '5px',
    overflow: 'hidden' as const,
    position: 'relative' as const
  };

  const healthPercent = (character.currentHealth / character.baseHealth) * 100;

  const actionButtonStyle = (color: string) => ({
    padding: '20px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600' as const,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '80px'
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Semplificato */}
      <div style={{ 
        padding: '32px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              fontSize: '28px',
              fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)'
            }}>
              {getRaceEmoji(character.race)}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
                Benvenuto, {character.name}
              </h1>
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                {getClassEmoji(character.characterClass)} Livello {character.level} {character.characterClass} • Millhaven
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setCurrentView('ai-config')}
              style={{
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              🤖 Configura Dungeon Master AI
            </button>
            <button
              onClick={onBackToCharacterSelect}
              style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Cambia Personaggio
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' }}>
          
          {/* Character Stats Card */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
              📊 Statistiche Personaggio
            </h2>
            
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '48px'
              }}>
                {getRaceEmoji(character.race)}
              </div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
                {character.name}
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
                {character.race} {character.characterClass}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '16px' }}>❤️ Salute</span>
                <span style={{ color: '#6b7280', fontSize: '16px' }}>{character.currentHealth}/{character.baseHealth}</span>
              </div>
              <div style={progressBarStyle}>
                <div style={{
                  height: '100%',
                  width: `${healthPercent}%`,
                  backgroundColor: healthPercent > 75 ? '#10b981' : healthPercent > 50 ? '#f59e0b' : '#ef4444',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '16px' }}>⭐ Livello</span>
                <span style={{ color: '#6b7280', fontSize: '16px' }}>Livello {character.level}</span>
              </div>
              <div style={progressBarStyle}>
                <div style={{
                  height: '100%',
                  width: `${(character.level % 10) * 10}%`,
                  backgroundColor: '#f59e0b',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                Prossimo livello: {Math.floor((10 - (character.level % 10)) * 10)}% rimanente
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🎮 Azioni Principali
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button style={actionButtonStyle('#3b82f6')}>
                🗺️ Esplora il Mondo
              </button>
              <button style={actionButtonStyle('#ef4444')}>
                ⚔️ Cerca Combattimento
              </button>
              <button style={actionButtonStyle('#10b981')}>
                💰 Visita Mercanti
              </button>
              <button style={actionButtonStyle('#f59e0b')}>
                📜 Trova Quest
              </button>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                💡 Suggerimento
              </h4>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                Configura il tuo Dungeon Master AI per automatizzare le azioni ripetitive e ottimizzare il tuo gameplay!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          
          {/* Current Location */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 Posizione Attuale
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px'
              }}>
                🏰
              </div>
              <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
                Millhaven
              </h4>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                Città Starter • Zona Sicura
              </p>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Cambia Location
              </button>
            </div>
          </div>

          {/* Quest Status */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📜 Quest Attive
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px'
              }}>
                📜
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
                0 Quest Attive
              </p>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Trova Quest
              </button>
            </div>
          </div>

          {/* AI Status */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 Dungeon Master AI
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px'
              }}>
                🤖
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                AI Non Configurata
              </p>
              <button
                onClick={() => setCurrentView('ai-config')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Configura Ora
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div style={{ 
          ...cardStyle, 
          marginTop: '32px', 
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '1px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ✨
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '20px', fontWeight: '600' }}>
                Benvenuto nel mondo di Aethermoor!
              </h3>
              <p style={{ margin: 0, color: '#047857', fontSize: '16px' }}>
                La tua avventura inizia ora. Esplora il mondo, combatti creature leggendarie, completa quest epiche e costruisci la tua leggenda.
                Il tuo Dungeon Master AI personalizzato ti aiuterà a ottimizzare il gameplay e automatizzare le azioni ripetitive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboardSimplified;
