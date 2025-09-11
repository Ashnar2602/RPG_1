import React, { useState, useEffect } from 'react';

interface Character {
  id: string;
  name: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
  strength: number;
  intelligence: number;
  agility: number;
}

interface CombatAction {
  attacker_id: string;
  target_id: string;
  ability_name: string;
  damage_dealt: number;
  is_critical: boolean;
  effects_applied: string[];
}

interface CombatPageProps {}

export const CombatPage: React.FC<CombatPageProps> = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [availableAbilities, setAvailableAbilities] = useState<string[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<string>('basic_attack');
  const [combatLog, setCombatLog] = useState<CombatAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock characters for testing
  const mockCharacters: Character[] = [
    {
      id: 'char1',
      name: 'Warrior Test',
      level: 5,
      currentHealth: 120,
      baseHealth: 120,
      strength: 15,
      intelligence: 8,
      agility: 12
    },
    {
      id: 'char2', 
      name: 'Mage Test',
      level: 4,
      currentHealth: 80,
      baseHealth: 80,
      strength: 8,
      intelligence: 16,
      agility: 10
    }
  ];

  const executeAttack = async () => {
    if (!selectedCharacter || !targetCharacter) {
      setMessage('Please select both attacker and target');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/combat/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attackerId: selectedCharacter.id,
          targetId: targetCharacter.id,
          abilityName: selectedAbility
        })
      });

      const data = await response.json();

      if (data.success) {
        setCombatLog(prev => [...prev, data.data]);
        setMessage(`${selectedAbility} executed successfully!`);
        
        // Update target health (mock update)
        setTargetCharacter(prev => prev ? {
          ...prev,
          currentHealth: Math.max(0, prev.currentHealth - data.data.damage_dealt)
        } : null);
      } else {
        setMessage(data.error || 'Combat action failed');
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Combat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAbilities = async (characterId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/combat/abilities/${characterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAvailableAbilities(data.data.map((ability: any) => ability.name));
      }
    } catch (error) {
      console.error('Failed to get abilities:', error);
    }
  };

  useEffect(() => {
    if (selectedCharacter) {
      getAbilities(selectedCharacter.id);
    }
  }, [selectedCharacter]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f2937', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem', color: '#f59e0b' }}>
          ⚔️ Combat System Test
        </h1>

        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '20px', 
            borderRadius: '8px',
            backgroundColor: message.includes('success') ? '#065f46' : '#7f1d1d',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Attacker Selection */}
          <div style={{ 
            backgroundColor: '#374151', 
            padding: '20px', 
            borderRadius: '12px',
            border: selectedCharacter ? '2px solid #10b981' : '2px solid transparent'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#10b981' }}>🗡️ Attacker</h3>
            {mockCharacters.map(char => (
              <div 
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: selectedCharacter?.id === char.id ? '#065f46' : '#4b5563',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{char.name} (Level {char.level})</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  ❤️ {char.currentHealth}/{char.baseHealth} | 
                  💪 STR: {char.strength} | 
                  🧠 INT: {char.intelligence} | 
                  🏃 AGI: {char.agility}
                </div>
              </div>
            ))}
          </div>

          {/* Target Selection */} 
          <div style={{ 
            backgroundColor: '#374151', 
            padding: '20px', 
            borderRadius: '12px',
            border: targetCharacter ? '2px solid #ef4444' : '2px solid transparent'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#ef4444' }}>🎯 Target</h3>
            {mockCharacters.map(char => (
              <div 
                key={char.id}
                onClick={() => setTargetCharacter(char)}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: targetCharacter?.id === char.id ? '#7f1d1d' : '#4b5563',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: selectedCharacter?.id === char.id ? 0.5 : 1,
                  pointerEvents: selectedCharacter?.id === char.id ? 'none' : 'auto'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{char.name} (Level {char.level})</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  ❤️ {char.currentHealth}/{char.baseHealth} | 
                  💪 STR: {char.strength} | 
                  🧠 INT: {char.intelligence} | 
                  🏃 AGI: {char.agility}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combat Actions */}
        <div style={{ 
          backgroundColor: '#374151', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#f59e0b' }}>⚡ Combat Actions</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Ability:</label>
            <select 
              value={selectedAbility}
              onChange={(e) => setSelectedAbility(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#4b5563',
                color: 'white',
                border: '1px solid #6b7280',
                minWidth: '200px'
              }}
            >
              {availableAbilities.length > 0 ? 
                availableAbilities.map(ability => (
                  <option key={ability} value={ability}>
                    {ability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                )) : 
                <option value="basic_attack">Basic Attack</option>
              }
            </select>
          </div>

          <button
            onClick={executeAttack}
            disabled={isLoading || !selectedCharacter || !targetCharacter}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !selectedCharacter || !targetCharacter) ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? '⚔️ Attacking...' : '⚔️ Execute Attack'}
          </button>
        </div>

        {/* Combat Log */}
        <div style={{ 
          backgroundColor: '#374151', 
          padding: '20px', 
          borderRadius: '12px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#8b5cf6' }}>📜 Combat Log</h3>
          
          {combatLog.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              opacity: 0.7, 
              padding: '20px' 
            }}>
              No combat actions yet. Start fighting!
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {combatLog.map((action, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: '#4b5563',
                    borderRadius: '6px',
                    borderLeft: action.is_critical ? '4px solid #f59e0b' : '4px solid #6b7280'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {action.is_critical && '💥 CRITICAL! '} 
                    {action.ability_name.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Damage: {action.damage_dealt} HP
                    {action.effects_applied.length > 0 && (
                      <span> | Effects: {action.effects_applied.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
