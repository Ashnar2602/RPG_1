import React, { useState } from 'react';

interface AIConfiguration {
  enabled: boolean;
  autoTravel: {
    enabled: boolean;
    preferredDestinations: string[];
    avoidHighDanger: boolean;
    staminaThreshold: number;
    encounterStrategy: 'fight' | 'flee' | 'smart';
  };
  autoCombat: {
    enabled: boolean;
    strategy: 'aggressive' | 'defensive' | 'balanced';
    fleeThreshold: number;
    usePotions: boolean;
    prioritizeTargets: 'weakest' | 'strongest' | 'nearest';
  };
  autoQuest: {
    enabled: boolean;
    acceptDifficulty: 'easy' | 'normal' | 'hard' | 'all';
    autoComplete: boolean;
    focusMainStory: boolean;
  };
  autoTrade: {
    enabled: boolean;
    sellJunk: boolean;
    buySupplies: boolean;
    maxSpendPercentage: number;
  };
  personality: {
    name: string;
    decisionMaking: 'cautious' | 'balanced' | 'aggressive';
    riskTolerance: number; // 1-10
    explorationStyle: 'thorough' | 'efficient' | 'random';
  };
}

interface AIConfigurationPageProps {
  onBack: () => void;
}

const AIConfigurationPage: React.FC<AIConfigurationPageProps> = ({ onBack }) => {
  const [config, setConfig] = useState<AIConfiguration>({
    enabled: false,
    autoTravel: {
      enabled: false,
      preferredDestinations: [],
      avoidHighDanger: true,
      staminaThreshold: 20,
      encounterStrategy: 'smart'
    },
    autoCombat: {
      enabled: false,
      strategy: 'balanced',
      fleeThreshold: 25,
      usePotions: true,
      prioritizeTargets: 'weakest'
    },
    autoQuest: {
      enabled: false,
      acceptDifficulty: 'normal',
      autoComplete: false,
      focusMainStory: true
    },
    autoTrade: {
      enabled: false,
      sellJunk: true,
      buySupplies: true,
      maxSpendPercentage: 25
    },
    personality: {
      name: 'Il Mio Dungeon Master',
      decisionMaking: 'balanced',
      riskTolerance: 5,
      explorationStyle: 'efficient'
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'travel' | 'combat' | 'quest' | 'trade' | 'personality'>('general');

  const handleConfigChange = (section: keyof AIConfiguration, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleSaveConfiguration = () => {
    // TODO: Implementare salvataggio configurazione AI
    console.log('Salvando configurazione AI:', config);
    // Qui verrà implementata la chiamata all'API
    alert('Configurazione AI salvata con successo!');
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 20px',
    backgroundColor: isActive ? '#4f46e5' : 'transparent',
    color: isActive ? 'white' : '#6b7280',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s ease',
    marginRight: '8px'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
    backgroundColor: 'white'
  };

  const switchStyle = (enabled: boolean) => ({
    width: '52px',
    height: '28px',
    backgroundColor: enabled ? '#10b981' : '#d1d5db',
    borderRadius: '14px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  });

  const switchKnobStyle = (enabled: boolean) => ({
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '4px',
    left: enabled ? '28px' : '4px',
    transition: 'left 0.3s ease'
  });

  const renderSwitch = (enabled: boolean, onChange: (value: boolean) => void) => (
    <div style={switchStyle(enabled)} onClick={() => onChange(!enabled)}>
      <div style={switchKnobStyle(enabled)} />
    </div>
  );

  const renderGeneralTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '24px', color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
        Configurazione Generale AI
      </h3>
      
      <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ color: '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              Abilita Dungeon Master AI
            </h4>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Attiva il tuo assistente AI personale per automatizzare il gameplay
            </p>
          </div>
          {renderSwitch(config.enabled, (value) => setConfig(prev => ({ ...prev, enabled: value })))}
        </div>
        
        {config.enabled && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5' }}>
            <p style={{ color: '#065f46', fontSize: '14px', margin: 0 }}>
              🤖 Il tuo Dungeon Master AI è attivo e pronto ad assistere la tua avventura!
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
          Nome del tuo Dungeon Master
        </label>
        <input
          type="text"
          value={config.personality.name}
          onChange={(e) => handleConfigChange('personality', 'name', e.target.value)}
          style={inputStyle}
          placeholder="Es: Merlino il Saggio"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
            Stile di Gioco
          </label>
          <select
            value={config.personality.decisionMaking}
            onChange={(e) => handleConfigChange('personality', 'decisionMaking', e.target.value)}
            style={inputStyle}
          >
            <option value="cautious">Cauto - Privilegia la sicurezza</option>
            <option value="balanced">Bilanciato - Mix di rischio e prudenza</option>
            <option value="aggressive">Aggressivo - Massimizza i guadagni</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
            Tolleranza al Rischio: {config.personality.riskTolerance}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={config.personality.riskTolerance}
            onChange={(e) => handleConfigChange('personality', 'riskTolerance', parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#e5e7eb', outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onBack}
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                marginRight: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              ← Indietro
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                🤖 Configurazione Dungeon Master AI
              </h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Personalizza il tuo assistente AI per automatizzare il gameplay
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSaveConfiguration}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#059669'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#10b981'}
          >
            💾 Salva Configurazione
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        padding: '0 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '16px', paddingTop: '16px' }}>
          <button style={tabStyle(activeTab === 'general')} onClick={() => setActiveTab('general')}>
            ⚙️ Generale
          </button>
          <button style={tabStyle(activeTab === 'travel')} onClick={() => setActiveTab('travel')}>
            🗺️ Viaggio
          </button>
          <button style={tabStyle(activeTab === 'combat')} onClick={() => setActiveTab('combat')}>
            ⚔️ Combattimento
          </button>
          <button style={tabStyle(activeTab === 'quest')} onClick={() => setActiveTab('quest')}>
            📜 Quest
          </button>
          <button style={tabStyle(activeTab === 'trade')} onClick={() => setActiveTab('trade')}>
            💰 Commercio
          </button>
          <button style={tabStyle(activeTab === 'personality')} onClick={() => setActiveTab('personality')}>
            🎭 Personalità
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        backgroundColor: 'white',
        color: '#1f2937',
        margin: '24px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        minHeight: '600px'
      }}>
        {activeTab === 'general' && renderGeneralTab()}
        
        {activeTab === 'travel' && (
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
              Automazione Viaggio
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Configura come la tua AI gestisce l'esplorazione e i viaggi nel mondo
            </p>
            
            <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ color: '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Auto-Viaggio
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    Permetti all'AI di viaggiare autonomamente tra le location
                  </p>
                </div>
                {renderSwitch(config.autoTravel.enabled, (value) => handleConfigChange('autoTravel', 'enabled', value))}
              </div>
            </div>

            {config.autoTravel.enabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Strategia negli Scontri
                  </label>
                  <select
                    value={config.autoTravel.encounterStrategy}
                    onChange={(e) => handleConfigChange('autoTravel', 'encounterStrategy', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="fight">Combatti sempre</option>
                    <option value="flee">Fuggi sempre</option>
                    <option value="smart">Intelligente (valuta situazione)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    Soglia Stamina: {config.autoTravel.staminaThreshold}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={config.autoTravel.staminaThreshold}
                    onChange={(e) => handleConfigChange('autoTravel', 'staminaThreshold', parseInt(e.target.value))}
                    style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#e5e7eb', outline: 'none' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Altri tab simili... */}
        {activeTab !== 'general' && activeTab !== 'travel' && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
            <h3 style={{ marginBottom: '16px' }}>🚧 Sezione in Sviluppo</h3>
            <p>La configurazione per "{activeTab}" sarà disponibile nelle prossime versioni.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConfigurationPage;
