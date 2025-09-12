# 🛠️ Guida Tecnica Completa - L'Esperimento di Ashnar

## 🚀 Setup Ambiente di Sviluppo

### Prerequisiti Sistem
- **Node.js**: 18.x o superiore
- **PostgreSQL**: 15.x o superiore
- **Git**: Ultima versione
- **VS Code**: Raccomandato per TypeScript

### Configurazione Database
```bash
# PostgreSQL deve essere in esecuzione su porta 5433
# Configurazione consigliata:
Host: localhost
Port: 5433  
Database: rpg_game
Username: [configurare in .env]
Password: [configurare in .env]
```

### Setup Iniziale del Progetto
```bash
# 1. Clone del repository
git clone [repository-url]
cd RPG_1

# 2. Installazione dipendenze root
npm install

# 3. Installazione dipendenze client
cd client
npm install
cd ..

# 4. Installazione dipendenze server
cd server
npm install
cd ..

# 5. Configurazione ambiente
cp .env.example .env
# Editare .env con le configurazioni specifiche
```

### File .env Configurazione
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5433/rpg_game"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

## 🗄️ Database Schema e Gestione

### Struttura Database (Prisma)
Il database è organizzato in **18 tabelle principali**:

#### **Tabelle Utenti e Autenticazione**
```sql
- users: Gestione account utente
- user_roles: Sistema ruoli (PLAYER, ADMIN)
- sessions: Gestione sessioni JWT
```

#### **Tabelle Personaggi**
```sql
- characters: Dati personaggi principali
- character_stats: Statistiche (STR, DEX, CON, etc.)
- character_inventory: Inventario oggetti
- character_location: Posizione nel mondo
```

#### **Tabelle Sistema di Gioco**
```sql
- races: 8 razze giocabili con bonus
- classes: 8 classi con abilità
- items: Database oggetti di gioco
- locations: Mappa del mondo e aree
```

### Comandi Database Utili
```bash
# Migrazione database
cd server
npx prisma migrate dev

# Reset database completo
npx prisma migrate reset

# Seeding dati di test
npx prisma db seed

# Visualizzazione database
npx prisma studio
```

### Backup e Ripristino
```bash
# Backup database
pg_dump -h localhost -p 5433 -U username rpg_game > backup.sql

# Ripristino database
psql -h localhost -p 5433 -U username rpg_game < backup.sql
```

## 🔐 Sistema di Autenticazione

### Architettura JWT
Il sistema utilizza **JSON Web Tokens** per l'autenticazione:

```typescript
// Struttura Token
interface JWTPayload {
  userId: string;
  username: string;
  role: 'PLAYER' | 'ADMIN';
  iat: number;
  exp: number;
}
```

### Flow di Autenticazione
1. **Registrazione**: `POST /api/auth/register`
   - Validazione dati input (username, email, password)
   - Controllo vincoli password (8+ char, maiuscole, minuscole, numeri, simboli)
   - Hash password con bcryptjs (12 rounds)
   - Creazione record utente
   - Generazione token JWT con issuer

2. **Login**: `POST /api/auth/login`
   - Verifica credenziali (username o email)
   - Controllo password hashata
   - Rilevamento password temporanea
   - Generazione nuovo token JWT
   - Aggiornamento ultima sessione

3. **Password Recovery**: `POST /api/auth/reset-password`
   - Generazione password temporanea (formato WORD-#### es. MAGIC-3671)
   - Hash e salvataggio con flag isTemporaryPassword
   - Restituisce password temporanea all'utente

4. **Update Password Temporanea**: `POST /api/auth/update-temp-password`
   - Verifica password temporanea corrente
   - Validazione nuova password (criteri sicurezza)
   - Aggiornamento e rimozione flag temporaneo
   - Conversione a password permanente

5. **Protezione Route**: Middleware `authenticateToken`
   - Verifica presenza token nel header Authorization
   - Validazione signature JWT con issuer check
   - Controllo scadenza token
   - Popolamento req.user con dati utente

### Implementazione Client-Side
```typescript
// Salvataggio token
localStorage.setItem('token', jwtToken);

// Invio richieste autenticate
const response = await fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Gestione token scaduto
if (response.status === 401) {
  // Redirect a login
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

## ⚛️ Frontend React - Architettura

### Struttura Componenti
```
src/
├── components/           # Componenti riutilizzabili
│   ├── CharacterCreationWizard.tsx    # Wizard 3-step
│   ├── CharacterManager.tsx           # Gestione personaggi
│   ├── LoginForm.tsx                  # Form login
│   └── RegisterForm.tsx               # Form registrazione
├── pages/               # Pagine principali
│   ├── App_simple.tsx   # App principale
│   └── GamePage.tsx     # Interfaccia di gioco
├── services/            # API client
│   ├── api.ts          # Client HTTP
│   └── auth.ts         # Servizi autenticazione
├── types/               # TypeScript definitions
│   └── game.ts         # Tipi di gioco
└── utils/               # Utilities
    └── constants.ts     # Costanti globali
```

### Sistema di Routing
```typescript
// App_simple.tsx - Router principale
const [currentPage, setCurrentPage] = useState('login');

const renderPage = () => {
  switch (currentPage) {
    case 'login': return <LoginForm />;
    case 'register': return <RegisterForm />;
    case 'character-select': return <CharacterManager />;
    case 'character-creation': return <CharacterCreationWizard />;
    case 'game': return <GamePage />;
    default: return <LoginForm />;
  }
};
```

### Gestione Stato
Stato dell'applicazione gestito tramite **useState** e **Context API**:

```typescript
interface AppState {
  user: User | null;
  selectedCharacter: Character | null;
  characters: Character[];
  isAuthenticated: boolean;
}
```

### Styling e UI
- **CSS-in-JS**: Styling inline per componenti
- **Responsive Design**: Layout adattabile mobile/desktop
- **Theme Consistency**: Colori e tipografia unificati
- **Loading States**: Feedback visivo per operazioni async

## 🔧 Backend Express - Architettura

### Struttura Server
```
src/
├── controllers/         # Business logic
│   ├── authController.ts    # Autenticazione
│   ├── characterController.ts # Gestione personaggi
│   └── gameController.ts    # Logiche di gioco
├── services/            # Servizi core
│   ├── authService.ts   # JWT e password
│   ├── characterService.ts # CRUD personaggi
│   └── databaseService.ts # Database queries
├── middleware/          # Middleware Express
│   ├── auth.ts         # Autenticazione JWT
│   ├── validation.ts   # Validazione input
│   └── rateLimit.ts    # Rate limiting
├── routes/              # API routes
│   ├── auth.ts         # Routes autenticazione
│   ├── characters.ts   # Routes personaggi
│   └── game.ts         # Routes gioco
├── utils/               # Utilities
│   ├── logger.ts       # Logging system
│   └── errors.ts       # Error handling
└── app.ts               # Express app setup
```

### API Endpoints Principali

#### Autenticazione
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

#### Gestione Personaggi
```typescript
GET    /api/characters          # Lista personaggi utente
POST   /api/characters          # Crea nuovo personaggio
GET    /api/characters/:id      # Dettagli personaggio
PUT    /api/characters/:id      # Aggiorna personaggio
DELETE /api/characters/:id      # Elimina personaggio
```

#### Sistema di Gioco
```typescript
GET /api/races                  # Lista razze disponibili
GET /api/classes                # Lista classi disponibili
GET /api/locations              # Locations del mondo
GET /api/items                  # Database oggetti
```

### Middleware Stack
```typescript
// app.ts - Setup middleware
app.use(cors());
app.use(express.json());
app.use(rateLimit);
app.use('/api/auth', authRoutes);
app.use('/api/characters', authenticateToken, characterRoutes);
app.use('/api/game', authenticateToken, gameRoutes);
```

### Error Handling
```typescript
// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});
```

## 🚀 Deploy e Produzione

### Configurazione Porte
- **Client (React)**: http://localhost:5173
- **Server (Express)**: http://localhost:3001  
- **Database (PostgreSQL)**: localhost:5433
- **Redis (Future)**: localhost:6379

### Build per Produzione
```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build

# Start produzione
npm start
```

### Environment Variables Produzione
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/rpg_prod
JWT_SECRET=[strong-production-secret-64-chars-minimum]
CLIENT_URL=https://your-domain.com
```

### Docker Setup (Future)
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: rpg_game
      POSTGRES_USER: rpg_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  server:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  client:
    build: ./client
    ports:
      - "5173:5173"
```

## 🔍 Troubleshooting

### Problemi Comuni e Soluzioni

#### Database Connection Failed
```bash
# Verifica PostgreSQL in esecuzione
sudo systemctl status postgresql

# Controlla porte
netstat -tlnp | grep 5433

# Test connessione
psql -h localhost -p 5433 -U username -d rpg_game
```

#### JWT Token Invalid
```typescript
// Debugging token
const decoded = jwt.decode(token);
console.log('Token payload:', decoded);
console.log('Token expired?', Date.now() >= decoded.exp * 1000);
```

#### CORS Issues
```typescript
// server/src/app.ts
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Port Already in Use
```bash
# Windows - Trova processo su porta
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Linux/Mac - Trova e termina processo
lsof -ti:3001 | xargs kill -9
```

### Performance Monitoring
```typescript
// Logging performance
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

### Debug Mode
```bash
# Server debug
DEBUG=app:* npm run dev

# Client debug
VITE_DEBUG=true npm run dev
```

## 📊 Testing e Quality Assurance

### Test Utente di Sistema
```typescript
// Credenziali di test
Username: TestUser
Password: password123

// Flow di test
1. Login con credenziali test
2. Creazione nuovo personaggio
3. Selezione personaggio esistente  
4. Navigazione tra schermate
5. Logout e re-login
```

### Validazione API
```bash
# Test endpoint autenticazione
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser","password":"password123"}'

# Test endpoint protetto
curl -X GET http://localhost:3001/api/characters \
  -H "Authorization: Bearer [your-jwt-token]"
```

### Monitoring Logs
```bash
# Server logs
tail -f server/logs/app.log

# Database logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

## 🔮 Roadmap Tecnico

### Features in Sviluppo
1. **WebSocket Integration**: Chat real-time
2. **Redis Caching**: Performance optimization
3. **File Upload**: Avatar e assets
4. **API Versioning**: Backward compatibility
5. **Monitoring**: Health checks e metrics

### Ottimizzazioni Future
- **Database Indexing**: Query performance
- **CDN Integration**: Asset delivery
- **Load Balancing**: Multi-instance support
- **Microservices**: Service separation
- **GraphQL**: Query flexibility

---

## 📞 Supporto Tecnico

Per problemi tecnici specifici:
1. Controlla questo documento per soluzioni comuni
2. Verifica logs server e client per errori
3. Testa API endpoints con Postman/curl
4. Controlla configurazione database e variabili ambiente
5. Verifica compatibilità versioni Node.js e dependencies

Il sistema è progettato per essere **robusto** e **scalabile**, con architettura moderna e best practices per supportare la crescita del progetto RPG.
