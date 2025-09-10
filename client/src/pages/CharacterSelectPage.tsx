import React from 'react';

interface CharacterSelectPageProps {}

export const CharacterSelectPage: React.FC<CharacterSelectPageProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Scegli il tuo Destino
          </h1>
          <p className="text-emerald-200">
            Seleziona o crea un personaggio per iniziare la tua avventura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Placeholder per personaggi esistenti */}
          <div className="bg-white/20 border-2 border-dashed border-white/30 rounded-xl p-6 flex flex-col items-center justify-center h-64 hover:bg-white/30 transition duration-200 cursor-pointer">
            <div className="text-6xl mb-4">➕</div>
            <h3 className="text-xl font-bold text-white mb-2">Nuovo Personaggio</h3>
            <p className="text-emerald-200 text-center">
              Crea un nuovo eroe per esplorare il mondo di Ashnar
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition duration-200">
            Continua l'Avventura
          </button>
        </div>
      </div>
    </div>
  );
};
