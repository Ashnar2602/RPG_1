import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Provider configurations
const providerConfigs = {
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, settings: any) => ({
      model: settings.modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: settings.temperature,
      max_tokens: settings.maxTokens
    }),
    extractResponse: (data: any) => data.choices[0].message.content
  },
  anthropic: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    headers: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }),
    formatRequest: (prompt: string, settings: any) => ({
      model: settings.modelId,
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      messages: [{ role: 'user', content: prompt }]
    }),
    extractResponse: (data: any) => data.content[0].text
  },
  google: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, settings: any) => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens
      }
    }),
    extractResponse: (data: any) => data.candidates[0].content.parts[0].text,
    urlTemplate: true
  },
  openrouter: {
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3001',
      'X-Title': 'RPG Narrative Game'
    }),
    formatRequest: (prompt: string, settings: any) => ({
      model: settings.modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: settings.temperature,
      max_tokens: settings.maxTokens
    }),
    extractResponse: (data: any) => data.choices[0].message.content
  }
};

// Test AI connection
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { providerId, modelId, apiKey, temperature, maxTokens } = req.body;

    if (!providerId || !modelId || !apiKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const config = providerConfigs[providerId as keyof typeof providerConfigs];
    if (!config) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    // Test prompt
    const testPrompt = "Rispondi semplicemente 'Test connessione riuscito' per confermare che l'API funziona.";
    
    let apiUrl = config.apiUrl;
    if ('urlTemplate' in config && config.urlTemplate && providerId === 'google') {
      apiUrl = apiUrl.replace('{model}', modelId) + `?key=${apiKey}`;
    }

    const requestBody = config.formatRequest(testPrompt, { modelId, temperature, maxTokens });
    const headers = config.headers(apiKey);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    const responseText = config.extractResponse(data);

    res.json({ 
      success: true, 
      message: 'AI connection successful',
      testResponse: responseText 
    });

  } catch (error) {
    console.error('AI Test Error:', error);
    res.status(500).json({ 
      error: 'Failed to test AI connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate narrative response
router.post('/narrate', authenticateToken, async (req, res) => {
  try {
    const { playerAction, context, character, gameContext, settings } = req.body;

    if (!playerAction || !context || !settings) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { providerId, modelId, apiKey, temperature, maxTokens } = settings;
    
    const config = providerConfigs[providerId as keyof typeof providerConfigs];
    if (!config) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    // Enhanced narrative prompt
    const narrativePrompt = `${context}

ISTRUZIONI PER LA RISPOSTA:
1. Rispondi SOLO con la narrazione, senza aggiungere "Dungeon Master:" o simili
2. Scrivi in seconda persona (tu/te) rivolgendoti direttamente al giocatore
3. Mantieni un tono narrativo coinvolgente ma non eccessivamente drammatico
4. Descrivi conseguenze logiche e realistiche dell'azione del giocatore
5. Se appropriato, includi dialoghi di NPCs o reazioni dell'ambiente
6. Limita la risposta a 200-300 parole per mantenere il ritmo
7. Termina con una situazione che invita a un'altra azione del giocatore

Ricorda: sei il narratore di una storia epica, non un semplice chatbot.`;

    let apiUrl = config.apiUrl;
    if ('urlTemplate' in config && config.urlTemplate && providerId === 'google') {
      apiUrl = apiUrl.replace('{model}', modelId) + `?key=${apiKey}`;
    }

    const requestBody = config.formatRequest(narrativePrompt, { modelId, temperature, maxTokens });
    const headers = config.headers(apiKey);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `AI API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    const narration = config.extractResponse(data);

    // Basic context analysis for updates (can be enhanced later)
    let contextUpdate = {};
    
    // Simple location detection
    if (narration.toLowerCase().includes('esci') || narration.toLowerCase().includes('fuori')) {
      if (gameContext.scene === 'risveglio_iniziale') {
        contextUpdate = { scene: 'fuga_laboratorio' };
      }
    }

    res.json({ 
      narration: narration.trim(),
      contextUpdate 
    });

  } catch (error) {
    console.error('AI Narration Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate narration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
