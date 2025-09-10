import React from 'react';

interface GamePageProps {}

export const GamePage: React.FC<GamePageProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">L'Esperimento di Ashnar</h1>
            <div className="text-sm text-gray-300">
              Livello 1 | 0/100 XP
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-yellow-400">💰 100 Oro</div>
            <div className="text-sm text-blue-400">💎 0 Gemme</div>
            <button className="text-white hover:text-red-400 transition duration-200">⚙️</button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Character Stats */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4">
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-3">Statistiche</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-400">❤️ Salute:</span>
                <span className="text-white">100/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">🔮 Mana:</span>
                <span className="text-white">50/50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">⚡ Stamina:</span>
                <span className="text-white">100/100</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <h2 className="text-lg font-bold text-white mb-3">Inventario</h2>
            <div className="grid grid-cols-4 gap-2">
              {/* Placeholder per slot inventario */}
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/20 border border-white/30 rounded-md flex items-center justify-center text-white/50 hover:bg-white/30 transition duration-200"
                >
                  {i === 0 ? '⚔️' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Game World */}
        <div className="flex-1 bg-gradient-to-b from-blue-900/50 to-green-900/50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🏰</div>
              <h2 className="text-3xl font-bold mb-2">Benvenuto nel Regno</h2>
              <p className="text-xl text-gray-300">
                La tua avventura inizia qui...
              </p>
            </div>
          </div>

          {/* Mini mappa */}
          <div className="absolute top-4 right-4 w-48 h-32 bg-black/50 border border-white/30 rounded-lg p-2">
            <div className="text-xs text-white mb-1">Mappa</div>
            <div className="w-full h-full bg-green-800/50 rounded relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat & Social */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-l border-white/10 p-4">
          <div className="bg-white/10 rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-lg font-bold text-white mb-3">Chat Globale</h2>
            
            <div className="flex-1 bg-black/30 rounded p-3 mb-3 overflow-y-auto">
              <div className="text-sm text-gray-400 mb-2">Sistema: Benvenuto nel gioco!</div>
              <div className="text-sm text-green-400 mb-2">Giocatore1: Ciao a tutti!</div>
              <div className="text-sm text-blue-400 mb-2">Giocatore2: Qualcuno vuole fare party?</div>
            </div>

            <div className="flex">
              <input 
                type="text" 
                placeholder="Scrivi un messaggio..."
                className="flex-1 bg-white/20 border border-white/30 rounded-l px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r text-white transition duration-200">
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
