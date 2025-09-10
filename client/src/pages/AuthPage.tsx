import React, { useState, useEffect } from 'react';

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  currentHealth: number;
  baseHealth: number;
}

interface AuthPageProps {}

export const AuthPage: React.FC<AuthPageProps> = () => {
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'characters' | 'create-character'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Character creation state
  const [characterName, setCharacterName] = useState('');
  const [characterRace, setCharacterRace] = useState('HUMAN');
  const [characterClass, setCharacterClass] = useState('WARRIOR');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadCharacters(savedToken);
    }
  }, []);

  const loadCharacters = async (authToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/characters', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCharacters(data.data || []);
        setCurrentScreen('characters');
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        const authToken = data.data.token;
        localStorage.setItem('token', authToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setToken(authToken);
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        await loadCharacters(authToken);
      } else {
        setMessage(data.error || 'Authentication failed');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: characterName,
          race: characterRace,
          characterClass: characterClass,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Character created successfully!');
        setCharacterName('');
        await loadCharacters(token);
      } else {
        setMessage(data.message || 'Character creation failed');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCharacter = async (characterId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/characters/${characterId}/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Character selected! Welcome to the game!');
        // Here you would typically redirect to the main game interface
      } else {
        setMessage('Failed to select character');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Authentication Screen
  if (currentScreen === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              L'Esperimento di Ashnar
            </h1>
            <p className="text-blue-200">
              {isLogin ? 'Bentornato, Viaggiatore' : 'Inizia la tua Avventura'}
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              message.includes('successful') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-200 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Il tuo nome utente"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="la.tua@email.com"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="La tua password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : (isLogin ? 'Accedi al Regno' : 'Crea il tuo Destino')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-200 hover:text-white transition duration-200"
            >
              {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Character Selection Screen
  if (currentScreen === 'characters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Seleziona il tuo Personaggio
            </h1>
            <p className="text-blue-200">Scegli il tuo eroe per questa avventura</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              message.includes('successful') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {characters.map((character) => (
              <div key={character.id} className="bg-white/20 rounded-lg p-6 cursor-pointer hover:bg-white/30 transition duration-200"
                   onClick={() => handleSelectCharacter(character.id)}>
                <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
                <p className="text-blue-200 mb-1">Race: {character.race}</p>
                <p className="text-blue-200 mb-1">Class: {character.characterClass}</p>
                <p className="text-blue-200 mb-1">Level: {character.level}</p>
                <p className="text-blue-200">Health: {character.currentHealth}/{character.baseHealth}</p>
              </div>
            ))}
            
            <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-lg p-6 cursor-pointer hover:bg-white/20 transition duration-200 flex items-center justify-center"
                 onClick={() => setCurrentScreen('create-character')}>
              <div className="text-center">
                <div className="text-4xl text-white mb-2">+</div>
                <p className="text-blue-200">Crea Nuovo Personaggio</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setCurrentScreen('auth');
                setToken('');
                setCharacters([]);
              }}
              className="text-blue-200 hover:text-white transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Character Creation Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crea il tuo Personaggio
          </h1>
          <p className="text-blue-200">Forgia il tuo destino</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            message.includes('successful') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleCreateCharacter} className="space-y-6">
          <div>
            <label htmlFor="characterName" className="block text-sm font-medium text-blue-200 mb-2">
              Nome Personaggio
            </label>
            <input
              type="text"
              id="characterName"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Nome del tuo eroe"
            />
          </div>

          <div>
            <label htmlFor="characterRace" className="block text-sm font-medium text-blue-200 mb-2">
              Razza
            </label>
            <select
              id="characterRace"
              value={characterRace}
              onChange={(e) => setCharacterRace(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="HUMAN" style={{color: 'black'}}>Umano</option>
              <option value="ELF" style={{color: 'black'}}>Elfo</option>
              <option value="DWARF" style={{color: 'black'}}>Nano</option>
              <option value="ORC" style={{color: 'black'}}>Orco</option>
              <option value="TROLL" style={{color: 'black'}}>Troll</option>
              <option value="GNOME" style={{color: 'black'}}>Gnomo</option>
              <option value="AERATHI" style={{color: 'black'}}>Aerathi</option>
              <option value="GUOLGARN" style={{color: 'black'}}>Guolgarn</option>
            </select>
          </div>

          <div>
            <label htmlFor="characterClass" className="block text-sm font-medium text-blue-200 mb-2">
              Classe
            </label>
            <select
              id="characterClass"
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="WARRIOR" style={{color: 'black'}}>Guerriero</option>
              <option value="MAGE" style={{color: 'black'}}>Mago</option>
              <option value="ROGUE" style={{color: 'black'}}>Ladro</option>
              <option value="CLERIC" style={{color: 'black'}}>Chierico</option>
              <option value="PALADIN" style={{color: 'black'}}>Paladino</option>
              <option value="RANGER" style={{color: 'black'}}>Ranger</option>
              <option value="WARLOCK" style={{color: 'black'}}>Warlock</option>
              <option value="MONK" style={{color: 'black'}}>Monaco</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crea Personaggio'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentScreen('characters')}
            className="text-blue-200 hover:text-white transition duration-200"
          >
            ← Torna alla Selezione
          </button>
        </div>
      </div>
    </div>
  );
};
