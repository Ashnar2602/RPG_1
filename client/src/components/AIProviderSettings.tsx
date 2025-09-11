import React, { useState, useEffect } from 'react';

interface AIProvider {
  id: string;
  name: string;
  description: string;
  models: AIModel[];
  requiresApiKey: boolean;
  website: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  costPer1kTokens: number;
  speed: 'fast' | 'medium' | 'slow';
  recommended: boolean;
}

interface AISettings {
  providerId: string;
  modelId: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

interface AIProviderSettingsProps {
  onBack: () => void;
  onSave: (settings: AISettings) => void;
}

const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ onBack, onSave }) => {
  const [settings, setSettings] = useState<AISettings>({
    providerId: '',
    modelId: '',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 2000
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const providers: AIProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'ChatGPT e GPT-4 - Ottima qualità narrativa, veloce',
      requiresApiKey: true,
      website: 'https://platform.openai.com',
      models: [
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          description: 'Veloce ed economico, ottimo per RPG testuali',
          contextLength: 128000,
          costPer1kTokens: 0.15,
          speed: 'fast',
          recommended: true
        },
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: 'Qualità massima, più costoso',
          contextLength: 128000,
          costPer1kTokens: 5.0,
          speed: 'medium',
          recommended: false
        }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude - Eccellente per storytelling e roleplay',
      requiresApiKey: true,
      website: 'https://console.anthropic.com',
      models: [
        {
          id: 'claude-3-haiku-20240307',
          name: 'Claude 3 Haiku',
          description: 'Velocissimo ed economico, buona qualità',
          contextLength: 200000,
          costPer1kTokens: 0.25,
          speed: 'fast',
          recommended: true
        },
        {
          id: 'claude-3-5-sonnet-20241022',
          name: 'Claude 3.5 Sonnet',
          description: 'Eccellente qualità narrativa, contesto enorme',
          contextLength: 200000,
          costPer1kTokens: 3.0,
          speed: 'medium',
          recommended: true
        }
      ]
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini - Buon rapporto qualità/prezzo, contesto grande',
      requiresApiKey: true,
      website: 'https://makersuite.google.com',
      models: [
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          description: 'Veloce, economico, contesto enorme',
          contextLength: 1000000,
          costPer1kTokens: 0.075,
          speed: 'fast',
          recommended: true
        },
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          description: 'Qualità superiore, contesto massimo',
          contextLength: 2000000,
          costPer1kTokens: 1.25,
          speed: 'medium',
          recommended: false
        }
      ]
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Accesso a modelli multipli tramite una sola API',
      requiresApiKey: true,
      website: 'https://openrouter.ai',
      models: [
        {
          id: 'anthropic/claude-3-haiku:beta',
          name: 'Claude 3 Haiku (via OpenRouter)',
          description: 'Claude Haiku tramite OpenRouter',
          contextLength: 200000,
          costPer1kTokens: 0.25,
          speed: 'fast',
          recommended: true
        },
        {
          id: 'meta-llama/llama-3.1-8b-instruct:free',
          name: 'Llama 3.1 8B (Gratuito)',
          description: 'Modello gratuito, qualità buona',
          contextLength: 131072,
          costPer1kTokens: 0,
          speed: 'medium',
          recommended: true
        }
      ]
    }
  ];

  useEffect(() => {
    // Carica settings salvate
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const selectedProvider = providers.find(p => p.id === settings.providerId);
  const selectedModel = selectedProvider?.models.find(m => m.id === settings.modelId);

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    const recommendedModel = provider?.models.find(m => m.recommended) || provider?.models[0];
    
    setSettings(prev => ({
      ...prev,
      providerId,
      modelId: recommendedModel?.id || '',
      apiKey: prev.providerId === providerId ? prev.apiKey : ''
    }));
  };

  const handleTestConnection = async () => {
    if (!settings.providerId || !settings.modelId || !settings.apiKey) {
      alert('Seleziona provider, modello e inserisci API key');
      return;
    }

    setTestingConnection(true);
    try {
      const response = await fetch('http://localhost:3001/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('✅ Connessione AI testata con successo!');
      } else {
        const error = await response.text();
        alert(`❌ Errore di connessione: ${error}`);
      }
    } catch (error) {
      alert(`❌ Errore di rete: ${error}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!settings.providerId || !settings.modelId) {
      alert('Seleziona provider e modello');
      return;
    }

    if (selectedProvider?.requiresApiKey && !settings.apiKey) {
      alert('Inserisci la tua API key');
      return;
    }

    localStorage.setItem('aiSettings', JSON.stringify(settings));
    onSave(settings);
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '16px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease'
  };

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
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
            >
              ← Indietro
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                🤖 Configurazione Dungeon Master AI
              </h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Configura il tuo provider AI per l'esperienza narrativa
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              style={{
                padding: '12px 24px',
                backgroundColor: testingConnection ? '#6b7280' : '#f59e0b',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: testingConnection ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {testingConnection ? '🔄 Testando...' : '🧪 Testa Connessione'}
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              💾 Salva Configurazione
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Provider Selection */}
        <div style={{ ...cardStyle, color: '#1f2937' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
            📡 Seleziona Provider AI
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {providers.map(provider => (
              <div
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                style={{
                  padding: '16px',
                  border: `2px solid ${settings.providerId === provider.id ? '#4f46e5' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: settings.providerId === provider.id ? '#f0f9ff' : 'white'
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                  {provider.name}
                </h3>
                <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
                  {provider.description}
                </p>
                <a 
                  href={provider.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#4f46e5', fontSize: '12px', textDecoration: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  🔗 Ottieni API Key
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        {selectedProvider && (
          <div style={{ ...cardStyle, color: '#1f2937' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
              🧠 Seleziona Modello per {selectedProvider.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
              {selectedProvider.models.map(model => (
                <div
                  key={model.id}
                  onClick={() => setSettings(prev => ({ ...prev, modelId: model.id }))}
                  style={{
                    padding: '16px',
                    border: `2px solid ${settings.modelId === model.id ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: settings.modelId === model.id ? '#f0fdf4' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                      {model.name} {model.recommended && '⭐'}
                    </h3>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: model.speed === 'fast' ? '#10b981' : model.speed === 'medium' ? '#f59e0b' : '#ef4444',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {model.speed}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
                    {model.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                    <span>📝 {model.contextLength.toLocaleString()} tokens</span>
                    <span>💰 ${model.costPer1kTokens}/1k tokens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Key and Settings */}
        {selectedProvider && selectedProvider.requiresApiKey && (
          <div style={{ ...cardStyle, color: '#1f2937' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
              🔑 Configurazione API
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                API Key per {selectedProvider.name}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Inserisci la tua API key..."
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                La tua API key viene salvata localmente e non condivisa con nessuno
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                  0 = Prevedibile, 1 = Creativo
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Max Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                  Lunghezza massima delle risposte AI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Configuration Summary */}
        {selectedModel && (
          <div style={{ ...cardStyle, color: '#1f2937', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #10b981' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#065f46' }}>
              ✅ Configurazione Attuale
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <strong style={{ color: '#047857' }}>Provider:</strong><br />
                {selectedProvider?.name}
              </div>
              <div>
                <strong style={{ color: '#047857' }}>Modello:</strong><br />
                {selectedModel.name}
              </div>
              <div>
                <strong style={{ color: '#047857' }}>Velocità:</strong><br />
                {selectedModel.speed}
              </div>
              <div>
                <strong style={{ color: '#047857' }}>Costo:</strong><br />
                ${selectedModel.costPer1kTokens}/1k tokens
              </div>
            </div>
            <p style={{ margin: '16px 0 0 0', color: '#065f46', fontSize: '14px' }}>
              🎭 Perfetto per esperienze RPG testuali con narrazione ricca e interazioni naturali!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProviderSettings;
