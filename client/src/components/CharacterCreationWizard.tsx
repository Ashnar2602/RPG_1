import React, { useState, useEffect } from 'react';

interface CharacterCreationData {
  name: string;
  background?: string;
  race: string;
  characterClass: string;
  alignment: string;
  statDistribution: {
    strength: number;
    intelligence: number;
    dexterity: number;
    willpower: number;
    charisma: number;
    luck: number;
    stamina: number;
  };
  selectedTraits: string[];
}

interface RacialData {
  [key: string]: {
    display_name: string;
    stat_bonuses: {
      [key: string]: number;
    };
    racial_trait: {
      name: string;
      description: string;
      effect: string;
    };
    preferred_classes: string[];
  };
}



interface SelectableTrait {
  id: string;
  name: string;
  description: string;
  effect: string;
}

interface PreviewStats {
  finalStats: {
    [key: string]: number;
  };
  hp: number;
  mp: number;
  power: number;
  initiative: number;
}

interface CharacterCreationWizardProps {
  onCharacterCreated?: () => void;
}

export const CharacterCreationWizard: React.FC<CharacterCreationWizardProps> = ({ onCharacterCreated }) => {
  console.log('🎮 CharacterCreationWizard COMPLETO caricato! Con sidebar e 3 step!');
  const [step, setStep] = useState(1);
  const [characterData, setCharacterData] = useState<CharacterCreationData>({
    name: '',
    background: '',
    race: 'HUMAN',
    characterClass: 'GUERRIERO',
    alignment: 'NN',
    statDistribution: {
      strength: 10,
      intelligence: 10,
      dexterity: 10,
      willpower: 10,
      charisma: 10,
      luck: 10,
      stamina: 10
    },
    selectedTraits: []
  });

  const [racialData, setRacialData] = useState<RacialData>({});
  const [selectableTraits, setSelectableTraits] = useState<SelectableTrait[]>([]);
  const [previewStats, setPreviewStats] = useState<PreviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const races = [
    { id: 'HUMAN', name: 'Umano' },
    { id: 'ELF', name: 'Elfo' },
    { id: 'DWARF', name: 'Nano' },
    { id: 'GNOME', name: 'Gnomo' },
    { id: 'ORC', name: 'Orco' },
    { id: 'TROLL', name: 'Troll' },
    { id: 'LIZARDMAN', name: 'Uomo Lucertola' },
    { id: 'FISHMAN', name: 'Uomo Pesce' },
    { id: 'AERATHI', name: 'Aerathi' },
    { id: 'GUOLGARN', name: 'Guolgarn' },
    { id: 'ZARKAAN', name: "Zar'kaan" }
  ];

  const classes = [
    { id: 'GUERRIERO', name: 'Guerriero' },
    { id: 'MAGO', name: 'Mago' },
    { id: 'FURFANTE', name: 'Furfante' }
  ];

  const alignments = [
    { id: 'LG', name: 'Legale Buono' },
    { id: 'LN', name: 'Legale Neutrale' },
    { id: 'LE', name: 'Legale Malvagio' },
    { id: 'NG', name: 'Neutrale Buono' },
    { id: 'NN', name: 'Puro Neutrale' },
    { id: 'NE', name: 'Neutrale Malvagio' },
    { id: 'CG', name: 'Caotico Buono' },
    { id: 'CN', name: 'Caotico Neutrale' },
    { id: 'CE', name: 'Caotico Malvagio' }
  ];

  // Load data when component mounts
  useEffect(() => {
    loadGameData();
  }, []);

  // Update preview when stats or race change
  useEffect(() => {
    if (characterData.race) {
      updatePreview();
    }
  }, [characterData.race, characterData.statDistribution]);

  const loadGameData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token di autenticazione non trovato');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load racial data
      const racialResponse = await fetch('http://localhost:3001/api/characters/data/races', { headers });
      const racialResult = await racialResponse.json();
      setRacialData(racialResult.racialBonuses);



      // Load selectable traits
      const traitsResponse = await fetch('http://localhost:3001/api/characters/data/traits', { headers });
      const traitsResult = await traitsResponse.json();
      setSelectableTraits(traitsResult.selectableTraits);

    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const updatePreview = async () => {
    try {
      console.log('Updating preview for race:', characterData.race, 'stats:', characterData.statDistribution);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for preview');
        return;
      }

      const response = await fetch('http://localhost:3001/api/characters/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          race: characterData.race,
          statDistribution: characterData.statDistribution
        })
      });

      const result = await response.json();
      console.log('Preview API response:', result);
      setPreviewStats(result);
    } catch (error) {
      console.error('Failed to update preview:', error);
    }
  };

  const handleStatChange = (stat: string, value: number) => {
    setCharacterData(prev => ({
      ...prev,
      statDistribution: {
        ...prev.statDistribution,
        [stat]: value
      }
    }));
  };

  const calculateRemainingPoints = () => {
    const totalSpent = Object.values(characterData.statDistribution).reduce((sum, val) => sum + (val - 10), 0);
    return 15 - totalSpent;
  };

  const createCharacter = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non sei autenticato');
        return;
      }

      const response = await fetch('http://localhost:3001/api/characters/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Errore nella creazione del personaggio');
        return;
      }

      // Success! Trigger callback to return to character list
      if (onCharacterCreated) {
        onCharacterCreated();
      }
      
      // Reset form
      setStep(1);
      setCharacterData({
        name: '',
        background: '',
        race: 'HUMAN',
        characterClass: 'GUERRIERO',
        alignment: 'NN',
        statDistribution: {
          strength: 10,
          intelligence: 10,
          dexterity: 10,
          willpower: 10,
          charisma: 10,
          luck: 10,
          stamina: 10
        },
        selectedTraits: []
      });

    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h2 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        marginBottom: '25px',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        📝 Informazioni Base
      </h2>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '500', 
          color: '#94a3b8', 
          marginBottom: '8px' 
        }}>
          Nome Personaggio
        </label>
        <input
          type="text"
          value={characterData.name}
          onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem'
          }}
          placeholder="Inserisci il nome del personaggio"
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '500', 
          color: '#94a3b8', 
          marginBottom: '8px' 
        }}>
          Background (Opzionale)
        </label>
        <textarea
          value={characterData.background}
          onChange={(e) => setCharacterData(prev => ({ ...prev, background: e.target.value }))}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem',
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="Descrivi la storia del tuo personaggio..."
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.9rem', 
            fontWeight: '500', 
            color: '#94a3b8', 
            marginBottom: '8px' 
          }}>
            Razza
          </label>
          <select
            value={characterData.race}
            onChange={(e) => setCharacterData(prev => ({ ...prev, race: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem'
            }}
          >
            {races.map(race => (
              <option key={race.id} value={race.id}>{race.name}</option>
            ))}
          </select>
          {racialData[characterData.race] && (
            <div style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: '600', marginBottom: '4px' }}>
                {racialData[characterData.race].racial_trait.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
                {racialData[characterData.race].racial_trait.description}
              </p>
            </div>
          )}
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.9rem', 
            fontWeight: '500', 
            color: '#94a3b8', 
            marginBottom: '8px' 
          }}>
            Classe
          </label>
          <select
            value={characterData.characterClass}
            onChange={(e) => setCharacterData(prev => ({ ...prev, characterClass: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem'
            }}
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '500', 
          color: '#94a3b8', 
          marginBottom: '8px' 
        }}>
          Allineamento
        </label>
        <select
          value={characterData.alignment}
          onChange={(e) => setCharacterData(prev => ({ ...prev, alignment: e.target.value }))}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem'
          }}
        >
          {alignments.map(alignment => (
            <option key={alignment.id} value={alignment.id}>{alignment.name}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const remainingPoints = calculateRemainingPoints();
    
    return (
      <div>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          marginBottom: '25px',
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Distribuzione Statistiche
        </h2>
        
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          marginBottom: '25px'
        }}>
          <p style={{ color: '#60a5fa', fontSize: '1rem', marginBottom: '8px' }}>
            Punti rimanenti: <span style={{ 
              fontWeight: 'bold', 
              color: remainingPoints < 0 ? '#ef4444' : remainingPoints === 0 ? '#22c55e' : '#f59e0b',
              fontSize: '1.2rem'
            }}>
              {remainingPoints}
            </span>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Ogni statistica parte da 10. Hai 15 punti da distribuire.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          {Object.entries(characterData.statDistribution).map(([stat, value]) => {
            const racialBonus = racialData[characterData.race]?.stat_bonuses?.[stat] || 0;
            const finalValue = value + racialBonus;
            
            return (
              <div key={stat} style={{
                backgroundColor: '#374151',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #4b5563'
              }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#94a3b8', 
                  marginBottom: '10px',
                  textTransform: 'capitalize'
                }}>
                  {stat} ({value}
                  {racialBonus > 0 && (
                    <span style={{ color: '#22c55e' }}>
                      {' '}+ {racialBonus} = {finalValue}
                    </span>
                  )}
                  )
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => value > 10 && handleStatChange(stat, value - 1)}
                    disabled={value <= 10}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: value <= 10 ? '#4b5563' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: value <= 10 ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="10"
                    max="20"
                    value={value}
                    onChange={(e) => handleStatChange(stat, Math.max(10, Math.min(20, parseInt(e.target.value) || 10)))}
                    style={{
                      width: '70px',
                      padding: '8px',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <button
                    onClick={() => value < 20 && remainingPoints > 0 && handleStatChange(stat, value + 1)}
                    disabled={value >= 20 || remainingPoints <= 0}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: (value >= 20 || remainingPoints <= 0) ? '#4b5563' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (value >= 20 || remainingPoints <= 0) ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div>
      <h2 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        marginBottom: '25px',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        ✨ Selezione Tratti
      </h2>
      
      <div style={{
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        marginBottom: '25px'
      }}>
        <p style={{ color: '#a78bfa', fontSize: '1rem', marginBottom: '5px' }}>
          Seleziona 2 tratti aggiuntivi per il tuo personaggio
        </p>
        <p style={{ 
          fontSize: '0.9rem', 
          color: characterData.selectedTraits.length === 2 ? '#22c55e' : '#f59e0b',
          fontWeight: 'bold'
        }}>
          Tratti selezionati: {characterData.selectedTraits.length}/2
        </p>
      </div>
      
      {selectableTraits.length === 0 ? (
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '10px' }}>
            🚧 Tratti in arrivo!
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Il sistema dei tratti selezionabili è in fase di sviluppo. Per ora puoi procedere senza selezionare tratti aggiuntivi.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '15px'
        }}>
          {selectableTraits.map(trait => {
            const isSelected = characterData.selectedTraits.includes(trait.id);
            const canSelect = !isSelected && characterData.selectedTraits.length < 2;
            
            return (
              <div
                key={trait.id}
                onClick={() => {
                  if (isSelected) {
                    setCharacterData(prev => ({
                      ...prev,
                      selectedTraits: prev.selectedTraits.filter(id => id !== trait.id)
                    }));
                  } else if (canSelect) {
                    setCharacterData(prev => ({
                      ...prev,
                      selectedTraits: [...prev.selectedTraits, trait.id]
                    }));
                  }
                }}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #4b5563',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : '#374151',
                  cursor: (isSelected || canSelect) ? 'pointer' : 'not-allowed',
                  opacity: (!isSelected && !canSelect) ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ 
                    color: 'white', 
                    fontWeight: '600', 
                    fontSize: '1.1rem',
                    margin: 0
                  }}>
                    {trait.name}
                  </h4>
                  {isSelected && (
                    <span style={{ 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      ✓ Selezionato
                    </span>
                  )}
                </div>
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: '0.9rem', 
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {trait.description}
                </p>
                <p style={{ 
                  color: '#60a5fa', 
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                  lineHeight: '1.3'
                }}>
                  {trait.effect}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderNavigation = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #4b5563'
    }}>
      <button
        onClick={() => setStep(Math.max(1, step - 1))}
        disabled={step === 1}
        style={{
          padding: '12px 24px',
          backgroundColor: step === 1 ? '#4b5563' : '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: step === 1 ? 'not-allowed' : 'pointer',
          opacity: step === 1 ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        ← Indietro
      </button>
      
      {step < 3 ? (
        <button
          onClick={() => setStep(step + 1)}
          disabled={
            (step === 1 && !characterData.name) ||
            (step === 2 && calculateRemainingPoints() !== 0)
          }
          style={{
            padding: '12px 24px',
            backgroundColor: ((step === 1 && !characterData.name) || (step === 2 && calculateRemainingPoints() !== 0)) 
              ? '#4b5563' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: ((step === 1 && !characterData.name) || (step === 2 && calculateRemainingPoints() !== 0)) 
              ? 'not-allowed' : 'pointer',
            opacity: ((step === 1 && !characterData.name) || (step === 2 && calculateRemainingPoints() !== 0)) 
              ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          Avanti →
        </button>
      ) : (
        <button
          onClick={createCharacter}
          disabled={loading || (selectableTraits.length > 0 && characterData.selectedTraits.length !== 2)}
          style={{
            padding: '12px 24px',
            backgroundColor: (loading || (selectableTraits.length > 0 && characterData.selectedTraits.length !== 2)) 
              ? '#4b5563' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: (loading || (selectableTraits.length > 0 && characterData.selectedTraits.length !== 2)) 
              ? 'not-allowed' : 'pointer',
            opacity: (loading || (selectableTraits.length > 0 && characterData.selectedTraits.length !== 2)) 
              ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? '⏳ Creando...' : '✨ Crea Personaggio'}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            ⚔️ Creazione Personaggio
          </h1>
          
          {/* Progress indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: step >= num ? '#3b82f6' : '#374151',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {num}
                </div>
                {num < 3 && <div style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: step > num ? '#3b82f6' : '#374151',
                  borderRadius: '2px'
                }} />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(185, 28, 28, 0.2)', 
            border: '1px solid #dc2626', 
            color: '#fca5a5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Main content with sidebar */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          {/* Character Preview Sidebar */}
          <div style={{ 
            width: '350px', 
            flexShrink: 0,
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #334155'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              textAlign: 'center',
              color: '#3b82f6'
            }}>
              📋 Anteprima Personaggio
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {characterData.name || 'Nome Personaggio'}
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {races.find(r => r.id === characterData.race)?.name} {classes.find(c => c.id === characterData.characterClass)?.name}
              </p>
            </div>

            {/* Stats Preview */}
            {previewStats ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>❤️ Vita</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>
                      {previewStats.hp}
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>💧 Mana</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {previewStats.mp}
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⚡ Potere</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {previewStats.power}
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🏃 Iniziativa</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                      {Math.round(previewStats.initiative)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: 'rgba(107, 114, 128, 0.1)', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  ⏳ Caricamento statistiche...
                </p>
              </div>
            )}

            {/* Final Stats */}
            <div>
              <h5 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#3b82f6' }}>
                📊 Statistiche Finali
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85rem' }}>
                {Object.entries(characterData.statDistribution).map(([stat, value]) => {
                  const racialBonus = racialData[characterData.race]?.stat_bonuses?.[stat] || 0;
                  const finalValue = value + racialBonus;
                  return (
                    <div key={stat} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      backgroundColor: 'rgba(55, 65, 81, 0.5)',
                      borderRadius: '4px'
                    }}>
                      <span style={{ textTransform: 'capitalize', color: '#94a3b8' }}>
                        {stat}:
                      </span>
                      <span style={{ fontWeight: 'bold' }}>
                        {finalValue}
                        {racialBonus > 0 && (
                          <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>
                            {' '}(+{racialBonus})
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Creation Form */}
          <div style={{ 
            flex: 1,
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid #334155'
          }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            
            {renderNavigation()}
          </div>
        </div>
      </div>
    </div>
  );
};
