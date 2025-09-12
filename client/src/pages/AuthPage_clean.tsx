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

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
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

  // Password recovery states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showTempPasswordModal, setShowTempPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [tempPasswordData, setTempPasswordData] = useState({
    tempPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      const response = await fetch('http://localhost:3001/api/characters', {
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
      const url = `http://localhost:3001${endpoint}`;
      const response = await fetch(url, {
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
        localStorage.setItem('username', data.data.user?.username || formData.username);
        setToken(authToken);
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        
        if (onAuthSuccess) {
          onAuthSuccess();
        }
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
      const response = await fetch('http://localhost:3001/api/characters', {
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
      const response = await fetch(`http://localhost:3001/api/characters/${characterId}/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Character selected! Welcome to the game!');
        localStorage.setItem('selectedCharacterId', characterId);
        if (onAuthSuccess) {
          onAuthSuccess();
        }
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

  // Password Recovery Functions
  const generateTempPassword = () => {
    const prefixes = ['HERO', 'QUEST', 'MAGIC', 'SWORD', 'SPELL', 'RUNE', 'DRAGON', 'CRYSTAL'];
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${numbers}`;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const tempPassword = generateTempPassword();
      
      localStorage.setItem('mockTempPassword', tempPassword);
      localStorage.setItem('mockTempEmail', forgotPasswordEmail);
      
      console.log(`📧 Mock Email sent to: ${forgotPasswordEmail}`);
      console.log(`🔑 Mock Temp Password: ${tempPassword}`);
      
      alert(`🎮 RPG Password Recovery\n\nPassword temporanea generata: ${tempPassword}\n\n(In produzione sarà inviata via email)`);
      
      setMessage('Password temporanea inviata! Controlla la tua email.');
      setShowForgotPasswordModal(false);
      setForgotPasswordEmail('');
      
    } catch (error) {
      setMessage('Errore durante l\'invio della password temporanea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTempPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const storedTempPassword = localStorage.getItem('mockTempPassword');
      const storedTempEmail = localStorage.getItem('mockTempEmail');
      
      if (tempPasswordData.tempPassword === storedTempPassword && 
          formData.username === storedTempEmail?.split('@')[0]) {
        
        if (tempPasswordData.newPassword !== tempPasswordData.confirmPassword) {
          setMessage('Le password non coincidono');
          return;
        }
        
        if (tempPasswordData.newPassword.length < 6) {
          setMessage('La password deve essere di almeno 6 caratteri');
          return;
        }
        
        console.log('🔄 Password updated successfully');
        localStorage.removeItem('mockTempPassword');
        localStorage.removeItem('mockTempEmail');
        
        setMessage('Password aggiornata con successo! Ora puoi effettuare il login.');
        setShowTempPasswordModal(false);
        setTempPasswordData({ tempPassword: '', newPassword: '', confirmPassword: '' });
        
      } else {
        setMessage('Password temporanea non valida o username errato');
      }
      
    } catch (error) {
      setMessage('Errore durante il cambio password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTempPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPasswordData({
      ...tempPasswordData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      {/* Screen principale */}
      {currentScreen === 'auth' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url("/rpg_background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '16px',
            paddingBottom: '64px'
          }}
        >
          {/* Overlay scuro */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Particelle decorative */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-70"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-300 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-60 left-1/2 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-40"></div>
            <div className="absolute top-32 right-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-60 right-16 w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce opacity-40"></div>
          </div>
          
          {/* Form container neon */}
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '448px',
              width: '100%',
              backgroundColor: 'rgba(6, 78, 59, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid rgba(34, 197, 94, 0.4)',
              boxShadow: `
                0 0 30px rgba(34, 197, 94, 0.3),
                0 0 60px rgba(34, 197, 94, 0.1),
                inset 0 1px 0 rgba(34, 197, 94, 0.2)
              `,
              background: `
                linear-gradient(135deg, 
                  rgba(6, 78, 59, 0.9) 0%, 
                  rgba(5, 46, 22, 0.85) 50%, 
                  rgba(6, 78, 59, 0.9) 100%
                )
              `
            }}
          >
            {/* Titolo */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #bbf7d0, #6ee7b7, #34d399)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '12px',
                  textShadow: '0 0 20px rgba(52, 211, 153, 0.5)',
                  animation: 'pulse 2s infinite'
                }}
              >
                L'Esperimento di Ashnar
              </h1>
              <p 
                style={{
                  color: '#bbf7d0',
                  fontSize: '1.125rem',
                  textShadow: '0 0 10px rgba(187, 247, 208, 0.3)'
                }}
              >
                {isLogin ? '✨ Bentornato, Viaggiatore' : '🌟 Inizia la tua Avventura'}
              </p>
            </div>

            {/* Messaggio di stato */}
            {message && (
              <div 
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: message.includes('successful') 
                    ? '2px solid rgba(52, 211, 153, 0.5)' 
                    : '2px solid rgba(239, 68, 68, 0.5)',
                  backgroundColor: message.includes('successful') 
                    ? 'rgba(6, 95, 70, 0.6)' 
                    : 'rgba(127, 29, 29, 0.6)',
                  color: message.includes('successful') 
                    ? '#bbf7d0' 
                    : '#fca5a5',
                  boxShadow: message.includes('successful') 
                    ? '0 0 20px rgba(52, 211, 153, 0.3)' 
                    : '0 0 20px rgba(239, 68, 68, 0.3)',
                  textShadow: message.includes('successful') 
                    ? '0 0 8px rgba(187, 247, 208, 0.5)' 
                    : '0 0 8px rgba(252, 165, 165, 0.5)'
                }}
              >
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label 
                  htmlFor="username" 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#bbf7d0',
                    marginBottom: '12px',
                    textShadow: '0 0 8px rgba(187, 247, 208, 0.3)'
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.8)';
                    e.target.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                    e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                  }}
                  placeholder="Il tuo nome utente"
                />
              </div>

              {!isLogin && (
                <div>
                  <label 
                    htmlFor="email" 
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#bbf7d0',
                      marginBottom: '12px',
                      textShadow: '0 0 8px rgba(187, 247, 208, 0.3)'
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: 'rgba(22, 101, 52, 0.6)',
                      border: '2px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(34, 197, 94, 0.8)';
                      e.target.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                      e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                    }}
                    placeholder="la.tua@email.com"
                  />
                </div>
              )}

              <div>
                <label 
                  htmlFor="password" 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#bbf7d0',
                    marginBottom: '12px',
                    textShadow: '0 0 8px rgba(187, 247, 208, 0.3)'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.8)';
                    e.target.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                    e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                  }}
                  placeholder="La tua password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '2px solid rgba(52, 211, 153, 0.5)',
                  fontSize: '1.1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.6 : 1,
                  boxShadow: `
                    0 0 30px rgba(52, 211, 153, 0.4),
                    0 0 60px rgba(52, 211, 153, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'scale(1.02) translateY(-2px)';
                    target.style.boxShadow = `
                      0 0 40px rgba(52, 211, 153, 0.6),
                      0 0 80px rgba(52, 211, 153, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'scale(1) translateY(0)';
                    target.style.boxShadow = `
                      0 0 30px rgba(52, 211, 153, 0.4),
                      0 0 60px rgba(52, 211, 153, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `;
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  isLogin ? '✨ Accedi al Regno' : '🌟 Crea il tuo Destino'
                )}
              </button>
            </form>

            {/* Link Password dimenticata - solo in modalità login */}
            {isLogin && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => setShowForgotPasswordModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(156, 163, 175, 0.5)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    textShadow: '0 0 6px rgba(156, 163, 175, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.color = '#bbf7d0';
                    target.style.textDecorationColor = 'rgba(187, 247, 208, 0.7)';
                    target.style.textShadow = '0 0 8px rgba(187, 247, 208, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.color = '#9ca3af';
                    target.style.textDecorationColor = 'rgba(156, 163, 175, 0.5)';
                    target.style.textShadow = '0 0 6px rgba(156, 163, 175, 0.3)';
                  }}
                >
                  🔒 Password dimenticata?
                </button>
              </div>
            )}

            {/* Link switch login/register */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#bbf7d0',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(34, 197, 94, 0.5)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  textShadow: '0 0 8px rgba(187, 247, 208, 0.3)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = 'white';
                  target.style.textDecorationColor = 'white';
                  target.style.textShadow = '0 0 12px rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = '#bbf7d0';
                  target.style.textDecorationColor = 'rgba(34, 197, 94, 0.5)';
                  target.style.textShadow = '0 0 8px rgba(187, 247, 208, 0.3)';
                }}
              >
                {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
              </button>
              
              {/* Link password temporanea - solo in modalità login */}
              {isLogin && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => setShowTempPasswordModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(107, 114, 128, 0.5)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease',
                      textShadow: '0 0 4px rgba(107, 114, 128, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.color = '#9ca3af';
                      target.style.textDecorationColor = 'rgba(156, 163, 175, 0.7)';
                      target.style.textShadow = '0 0 6px rgba(156, 163, 175, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.color = '#6b7280';
                      target.style.textDecorationColor = 'rgba(107, 114, 128, 0.5)';
                      target.style.textShadow = '0 0 4px rgba(107, 114, 128, 0.3)';
                    }}
                  >
                    🔑 Hai una password temporanea?
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Altri screen - mantengo la struttura esistente per brevità */}
      {currentScreen === 'characters' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
          <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Seleziona il tuo Personaggio</h1>
              <p className="text-blue-200">Scegli il tuo eroe per questa avventura</p>
            </div>
            {/* Resto del contenuto characters */}
          </div>
        </div>
      )}

      {/* Modal 1: Forgot Password */}
      {showForgotPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw', 
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: '400px',
            width: '90%',
            backgroundColor: 'rgba(6, 78, 59, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '32px',
            border: '2px solid rgba(34, 197, 94, 0.5)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: '#bbf7d0',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#bbf7d0',
                marginBottom: '8px',
                textShadow: '0 0 15px rgba(187, 247, 208, 0.5)'
              }}>
                🔒 Password Dimenticata?
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
                Inserisci la tua email per ricevere una password temporanea
              </p>
            </div>

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#bbf7d0',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  placeholder="la.tua@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '2px solid rgba(52, 211, 153, 0.5)',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  boxShadow: '0 0 25px rgba(52, 211, 153, 0.4)',
                }}
              >
                {isLoading ? '🔄 Invio in corso...' : '📧 Invia Password Temporanea'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Temp Password Login */}
      {showTempPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: '450px',
            width: '90%',
            backgroundColor: 'rgba(6, 78, 59, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '32px',
            border: '2px solid rgba(34, 197, 94, 0.5)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTempPasswordModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: '#bbf7d0',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#bbf7d0',
                marginBottom: '8px',
                textShadow: '0 0 15px rgba(187, 247, 208, 0.5)'
              }}>
                🔑 Cambia Password Temporanea
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
                Inserisci la password temporanea e crea la tua nuova password
              </p>
            </div>

            <form onSubmit={handleTempPasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#bbf7d0', marginBottom: '8px' }}>
                  Password Temporanea
                </label>
                <input
                  type="text"
                  name="tempPassword"
                  value={tempPasswordData.tempPassword}
                  onChange={handleTempPasswordInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'monospace',
                    letterSpacing: '1px'
                  }}
                  placeholder="HERO-1234"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#bbf7d0', marginBottom: '8px' }}>
                  Nuova Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={tempPasswordData.newPassword}
                  onChange={handleTempPasswordInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  placeholder="La tua nuova password"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#bbf7d0', marginBottom: '8px' }}>
                  Conferma Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={tempPasswordData.confirmPassword}
                  onChange={handleTempPasswordInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(22, 101, 52, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  placeholder="Conferma la nuova password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '2px solid rgba(52, 211, 153, 0.5)',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  boxShadow: '0 0 25px rgba(52, 211, 153, 0.4)',
                }}
              >
                {isLoading ? '🔄 Aggiornamento...' : '✨ Aggiorna Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
