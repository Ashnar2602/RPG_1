# 🎮 L'Esperimento di Ashnar - Fantasy RPG

Un RPG fantasy multiplayer con AI narrativa avanzata, sistema di combattimento strategico e meccaniche sociali innovative.

## 🚀 Stato Attuale: **FUNZIONANTE** ✅

**Sistema Completamente Operativo:**
- ✅ **Autenticazione**: JWT completa con registrazione/login
- ✅ **Creazione Personaggio**: Wizard a 3 step con preview in tempo reale
- ✅ **Gestione Personaggi**: Selezione e gestione fino a 6 personaggi per account
- ✅ **Database**: PostgreSQL con Prisma ORM completamente configurato
- ✅ **Frontend**: React + TypeScript con UI italiana completa
- ✅ **Backend**: Express + TypeScript con API RESTful

**Sistemi in Sviluppo:**
- 🚧 **Combat System**: Base implementata, in fase di testing
- 🚧 **Chat System**: WebSocket infrastructure pronta
- 🚧 **Quest System**: Design completato, implementazione in corso

## ⚡ Avvio Rapido

### Prerequisiti
```bash
Node.js 18+
PostgreSQL 15+
npm o yarn
```

### Setup Ambiente di Sviluppo
```bash
# 1. Clona il repository
git clone [repository-url]
cd RPG_1

# 2. Installa dipendenze
npm install

# 3. Configura database PostgreSQL
# Assicurati che PostgreSQL sia in esecuzione sulla porta 5433

# 4. Avvia l'ambiente di sviluppo
npm run dev
```

**Porte di Sviluppo:**
- 🌐 **Client**: http://localhost:5173
- 🔧 **Server**: http://localhost:3001
- 🗄️ **Database**: localhost:5433

### Credenziali di Test
```
Username: TestUser
Password: password123
```

## 🏗️ Architettura del Progetto

```
RPG_1/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Componenti UI
│   │   ├── pages/            # Pagine principali
│   │   ├── services/         # API client
│   │   └── types/            # TypeScript types
│   └── package.json
├── server/                    # Express Backend
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utilities
│   ├── prisma/               # Database schema
│   └── package.json
└── docs/                     # Documentazione di gioco
    ├── 01_GAME_SYSTEMS/      # Meccaniche di gioco
    ├── 02_TECHNICAL_INFRASTRUCTURE/ # Spec tecniche
    └── 05_PROJECT_MANAGEMENT/ # Gestione progetto
```

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **CSS-in-JS** con styling inline per componenti
- **Fetch API** per comunicazione con backend
- **LocalStorage** per gestione token JWT

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** con **PostgreSQL**
- **JWT Authentication** con **bcryptjs**
- **Rate Limiting** e **CORS** configurati
- **WebSocket** ready per real-time features

### Database
- **PostgreSQL 15+** con schema completo
- **Character System**: Razze, classi, statistiche
- **User Management**: Roles, authentication
- **Game Data**: Locations, items, quests

## 🎯 Funzionalità Principali

### ✅ Sistema di Autenticazione
- Registrazione e login sicuri
- JWT token con refresh automatico
- Gestione ruoli utente (PLAYER, ADMIN)
- Rate limiting per sicurezza

### ✅ Creazione Personaggio
- **Wizard a 3 Step**:
  1. 📝 Info Base (Nome, Razza, Classe, Allineamento)
  2. 📊 Distribuzione Statistiche (15 punti da distribuire)
  3. ✨ Selezione Tratti (sistema in sviluppo)
- **Preview in Tempo Reale**: Sidebar con statistiche aggiornate
- **Bonus Razziali**: Applicati automaticamente
- **Validazione Completa**: Client e server-side

### ✅ Gestione Personaggi
- Lista personaggi con dettagli
- Selezione personaggio attivo
- Eliminazione personaggi
- Limite configurabile (attualmente 6 personaggi/account)

## 🚀 Come Iniziare

1. **Primo Accesso**: Vai su http://localhost:5173
2. **Registrazione**: Crea un nuovo account
3. **Login**: Accedi con le credenziali
4. **Crea Personaggio**: Usa il wizard guidato
5. **Inizia Avventura**: Seleziona il personaggio e inizia!

## 📚 Documentazione Completa

### **📋 Guide Principali**
- **[📊 MVP Assessment](./MVP_ASSESSMENT.md)**: Stato progetto e priorità
- **[🗓️ Roadmap](./ROADMAP.md)**: Piano di sviluppo completo
- **[🛠️ Technical Guide](./TECHNICAL_GUIDE.md)**: Setup e troubleshooting
- **[📖 Game Design](./docs/)**: Documentazione completa del gioco

### **🎮 Sistema di Gioco**
- **[⚔️ Combat System](./docs/01_GAME_SYSTEMS/combat/)**: Meccaniche di battaglia
- **[👤 Character Creation](./docs/01_GAME_SYSTEMS/character/)**: Sistema personaggi
- **[🌍 World Interaction](./docs/01_GAME_SYSTEMS/world_interaction/)**: Quest e NPC

### **⚙️ Documentazione Tecnica**
- **[🗄️ Database Schema](./docs/02_TECHNICAL_INFRASTRUCTURE/DATABASE_MASTER_SCHEMA.md)**: Struttura database
- **[🌐 WebSocket](./docs/02_TECHNICAL_INFRASTRUCTURE/WEBSOCKET_INFRASTRUCTURE_SPECIFICATION.md)**: Comunicazione real-time
- **[💬 Chat System](./docs/02_TECHNICAL_INFRASTRUCTURE/CHAT_SYSTEM_SPECIFICATION.md)**: Sistema chat

## 🌟 Caratteristiche Uniche

### 👥 Sistema Famiglia Innovativo
- **Protagonisti Gemelli**: Player + Ashnar come coppia inseparabile
- **Madre Adottiva**: Iril come figura materna protettiva
- **Famiglia Scelta**: Meccaniche di progressione basate sui legami

### 🌍 Universo Complesso
- **9 Razze Giocabili**: Ciascuna con cultura e abilità uniche
- **3 Fazioni Divine**: Ordine vs Caos vs Vuoto
- **Geografia Epica**: 3 continenti con lore profondo
- **Narrativa Unica**: Da esperimento a guardiani cosmici

### ⚔️ Combat Tattico
- Sistema turn-based con posizionamento
- Economia delle azioni bilanciata
- Status effects e combo attacks
- Equipaggiamento con impatto significativo

## 🐛 Troubleshooting

### Problemi Comuni
- **Porta occupata**: Cambia le porte in `.env`
- **Database connection**: Verifica PostgreSQL su porta 5433
- **Token scaduto**: Effettua logout/login
- **Cache browser**: Hard refresh (Ctrl+Shift+R)

### File di Configurazione
```env
# .env esempio
DATABASE_URL="postgresql://username:password@localhost:5433/rpg_game"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
CLIENT_URL=http://localhost:5173
```

## 🎯 Prossimi Sviluppi

### Priorità Immediate (Q1 2025)
1. **⚔️ Combat System**: Implementazione battle mechanics
2. **🗺️ Map System**: Navigazione world e locations
3. **💬 Real-time Chat**: Comunicazione multiplayer
4. **📜 Quest System**: Missioni e progressione

### Obiettivi a Medio Termine (Q2 2025)
- Sistema guild e organizzazioni
- AI-driven content generation
- Mobile responsive optimization
- Advanced social features

## 🤝 Contributi

Progetto in sviluppo privato. Per collaborazioni contattare il maintainer.

## 📄 Licenza

Tutti i diritti riservati - Progetto privato

---

## 🎮 Vision del Progetto

**"L'Esperimento di Ashnar"** rappresenta una nuova frontiera nel gaming RPG, combinando:
- **Narrativa Emotiva**: Storia di famiglia e crescita personale
- **Tecnologia Moderna**: Stack scalabile per 1000+ giocatori
- **Community Focus**: Meccaniche sociali innovative
- **AI Integration**: Contenuto dinamico e personalizzato

Un'esperienza di gioco che va oltre il tradizionale MMO, creando legami emotivi profondi tra giocatori e personaggi in un universo fantasy ricco e complesso.
