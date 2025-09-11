import React, { useState, useEffect, useRef } from 'react';

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
}

interface NarrativeEntry {
  id: string;
  type: 'narration' | 'player_action' | 'system';
  content: string;
  timestamp: Date;
  speaker?: string;
}

interface GameContext {
  location: string;
  scene: string;
  characters: string[];
  importantNotes: string[];
  currentQuest?: string;
}

interface NarrativeDashboardProps {
  character: Character;
  onBackToCharacterSelect: () => void;
  onLogout: () => void;
}

const NarrativeDashboard: React.FC<NarrativeDashboardProps> = ({ 
  character, 
  onBackToCharacterSelect, 
  onLogout 
}) => {
  const [narrativeHistory, setNarrativeHistory] = useState<NarrativeEntry[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameContext, setGameContext] = useState<GameContext>({
    location: 'Laboratorio dell\'Alchimista - Cella Sperimentale',
    scene: 'risveglio_iniziale',
    characters: ['Ashnar', 'Altri prigionieri'],
    importantNotes: ['Prima volta che ti svegli', 'Corpo modificato dagli esperimenti']
  });
  
  const narrativeBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Avvia la narrazione iniziale
    initiateOpening();
    // Focus sull'input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll automatico alla fine della narrazione
    if (narrativeBoxRef.current) {
      narrativeBoxRef.current.scrollTop = narrativeBoxRef.current.scrollHeight;
    }
  }, [narrativeHistory]);

  const initiateOpening = async () => {
    setIsAIThinking(true);
    
    // Simula il caricamento della narrazione iniziale
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const openingNarration: NarrativeEntry = {
      id: Date.now().toString(),
      type: 'narration',
      content: `I tuoi occhi si aprono lentamente, offuscati da una nebbia che sembra provenire dalla tua stessa mente. 

Il mondo intorno a te è un mosaico di cristallo e metallo, illuminato da una luce bluastra che pulsa dolcemente. Ti trovi in quello che sembra essere un tubo di vetro trasparente, abbastanza grande da contenere il tuo corpo. Le pareti sono fredde contro la tua pelle nuda.

Attraverso il cristallo, vedi altre sagome simili alla tua - altri bambini, immobili in tubi simili al tuo. Alcuni sembrano dormire, altri... non ne sei sicuro. 

Un ragazzo nei pressi ha gli occhi aperti. I suoi occhi... brillano di un fuoco arancione innaturale. Ti guarda con un'intensità che ti fa sentire meno solo in questo posto terrificante.

"Anche tu ti sei svegliato," sussurra con voce roca. "Sono Ashnar. Da quanto tempo sei qui?"

Il tuo corpo si sente... diverso. Più forte, ma anche strano. Che cosa ti hanno fatto?`,
      timestamp: new Date(),
      speaker: 'Dungeon Master'
    };

    setNarrativeHistory([openingNarration]);
    setIsAIThinking(false);
  };

  const handlePlayerAction = async (action: string) => {
    if (!action.trim() || isAIThinking) return;

    // Aggiungi l'azione del giocatore alla storia
    const playerEntry: NarrativeEntry = {
      id: Date.now().toString(),
      type: 'player_action',
      content: action,
      timestamp: new Date(),
      speaker: character.name
    };

    setNarrativeHistory(prev => [...prev, playerEntry]);
    setPlayerInput('');
    setIsAIThinking(true);

    try {
      // Prepara il contesto per l'AI
      const aiSettings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
      const contextPrompt = buildContextPrompt(action);

      const response = await fetch('http://localhost:3001/api/ai/narrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          playerAction: action,
          context: contextPrompt,
          character: character,
          gameContext: gameContext,
          settings: aiSettings
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResponse = await response.json();
      
      const aiEntry: NarrativeEntry = {
        id: (Date.now() + 1).toString(),
        type: 'narration',
        content: aiResponse.narration,
        timestamp: new Date(),
        speaker: 'Dungeon Master'
      };

      setNarrativeHistory(prev => [...prev, aiEntry]);
      
      // Aggiorna il contesto se l'AI ha fornito aggiornamenti
      if (aiResponse.contextUpdate) {
        setGameContext(prev => ({ ...prev, ...aiResponse.contextUpdate }));
      }

    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback con risposta di errore narrativa
      const errorEntry: NarrativeEntry = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '✨ Il Dungeon Master sembra aver perso momentaneamente il filo della storia. Riprova la tua azione.',
        timestamp: new Date()
      };

      setNarrativeHistory(prev => [...prev, errorEntry]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const buildContextPrompt = (playerAction: string) => {
    const recentHistory = narrativeHistory.slice(-6).map(entry => 
      `${entry.speaker || 'Sistema'}: ${entry.content}`
    ).join('\n\n');

    return `Sei il Dungeon Master di un RPG testuale basato sulla storia "Il Sangue e la Cenere".

CONTESTO ATTUALE:
- Personaggio: ${character.name}, ${character.race} ${character.characterClass} di livello ${character.level}
- Location: ${gameContext.location}
- Scena: ${gameContext.scene}
- Personaggi presenti: ${gameContext.characters.join(', ')}
- Note importanti: ${gameContext.importantNotes.join(', ')}

STORIA RECENTE:
${recentHistory}

AZIONE DEL GIOCATORE: "${playerAction}"

Come Dungeon Master, rispondi in modo narrativo e coinvolgente. Mantieni la coerenza con la lore del mondo di Aethermoor e la main storyline. Il giocatore è uno dei soggetti sperimentali che si sta svegliando nel laboratorio dell'Alchimista insieme ad Ashnar.

Rispondi in prima persona come se stessi narrando la scena, descrivi conseguenze realistiche delle azioni del giocatore, e mantieni il tono drammatico ma non eccessivamente cupo.`;
  };

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

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Compatto */}
      <div style={{ 
        padding: '16px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Character Info */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '20px'
            }}>
              {getRaceEmoji(character.race)}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                {character.name}
              </h1>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                {getClassEmoji(character.characterClass)} Lv.{character.level} • {gameContext.location}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
              ❤️ {character.currentHealth}/{character.baseHealth}
            </div>
            <button
              onClick={onBackToCharacterSelect}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cambia PG
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          
          {/* Sidebar - Character Stats */}
          <div style={{ ...cardStyle, color: '#1f2937', height: 'fit-content' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Statistiche
            </h2>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '32px'
              }}>
                {getRaceEmoji(character.race)}
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                {character.name}
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                {character.race} {character.characterClass}
              </p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#ef4444', fontWeight: '500', fontSize: '14px' }}>❤️ Salute</span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>{character.currentHealth}/{character.baseHealth}</span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(character.currentHealth / character.baseHealth) * 100}%`,
                  backgroundColor: '#ef4444',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                📍 Contesto Attuale
              </h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>
                <strong>Location:</strong> {gameContext.location}
              </p>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>
                <strong>Personaggi:</strong> {gameContext.characters.join(', ')}
              </p>
            </div>
          </div>

          {/* Main Content - Narrative */}
          <div style={{ ...cardStyle, color: '#1f2937', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Narrative History */}
            <div 
              ref={narrativeBoxRef}
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '1px solid #e5e7eb'
              }}
            >
              {narrativeHistory.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>📖</div>
                  <p>La tua avventura sta per iniziare...</p>
                </div>
              ) : (
                narrativeHistory.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    style={{ 
                      marginBottom: index === narrativeHistory.length - 1 ? '0' : '20px',
                      padding: '16px',
                      backgroundColor: entry.type === 'player_action' ? '#dbeafe' : 
                                      entry.type === 'system' ? '#fef3c7' : 'white',
                      borderRadius: '12px',
                      border: '1px solid ' + (entry.type === 'player_action' ? '#3b82f6' :
                                             entry.type === 'system' ? '#f59e0b' : '#e5e7eb'),
                      borderLeft: '4px solid ' + (entry.type === 'player_action' ? '#3b82f6' :
                                                 entry.type === 'system' ? '#f59e0b' : '#8b5cf6')
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ 
                        color: entry.type === 'player_action' ? '#1e40af' : 
                               entry.type === 'system' ? '#92400e' : '#7c3aed',
                        fontSize: '14px' 
                      }}>
                        {entry.type === 'player_action' ? `🎭 ${entry.speaker}` :
                         entry.type === 'system' ? '⚙️ Sistema' : '📚 Dungeon Master'}
                      </strong>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                    <div style={{ 
                      color: '#1f2937', 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line' 
                    }}>
                      {entry.content}
                    </div>
                  </div>
                ))
              )}

              {/* AI Thinking Indicator */}
              {isAIThinking && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #d1d5db',
                      borderTop: '2px solid #8b5cf6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Il Dungeon Master sta riflettendo...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                ref={inputRef}
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePlayerAction(playerInput)}
                placeholder="Descrivi la tua azione... (es: 'rispondo ad Ashnar', 'esamino il tubo di vetro')"
                disabled={isAIThinking}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                onClick={() => handlePlayerAction(playerInput)}
                disabled={!playerInput.trim() || isAIThinking}
                style={{
                  padding: '14px 24px',
                  backgroundColor: !playerInput.trim() || isAIThinking ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: !playerInput.trim() || isAIThinking ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                {isAIThinking ? '⏳' : '▶️ Agisci'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default NarrativeDashboard;
