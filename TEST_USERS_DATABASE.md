# 👥 RPG Test Users Database

**Generato il:** 11 Settembre 2025  
**Stato Database:** Attivo su PostgreSQL (localhost:5433)

## 📊 Riepilogo Statistiche

- **Total Users:** 3 utenti registrati
- **Total Characters:** 5 personaggi creati
- **Characters per User:** 1.7 media per utente
- **Database Status:** ✅ Operativo e funzionante

---

## 👤 Utenti di Test Registrati

### 1. **testuser** 
- **📧 Email:** test@example.com
- **🆔 User ID:** `cmfeij1yh0000gqrhaph52es8`
- **📅 Created:** 10 Settembre 2025
- **🧙‍♂️ Characters:** 4 personaggi

#### Personaggi di testuser:
1. **Thorgar the Mighty** - DWARF WARRIOR (Level 5)
   - 📍 Location ID: `cmffern6a000cohfafmyd0vop`
2. **Brother Marcus** - HUMAN CLERIC (Level 4)
   - 📍 Location ID: `cmffern5n0000ohfaqy3371hi`
3. **Shadowfang** - GNOME ROGUE (Level 5)
   - 📍 Location ID: `cmffern5n0000ohfaqy3371hi`
4. **Lyralei Starweaver** - ELF MAGE (Level 4)
   - 📍 Location ID: `cmffern5n0000ohfaqy3371hi`

---

### 2. **rpgplayer**
- **📧 Email:** rpg@example.com
- **🆔 User ID:** `cmfejhr1k000084affuvgg1wf`
- **📅 Created:** 10 Settembre 2025
- **🧙‍♂️ Characters:** 0 personaggi

#### Personaggi di rpgplayer:
*Nessun personaggio creato*

---

### 3. **combatuser**
- **📧 Email:** combat@test.com
- **🆔 User ID:** `cmffe6dls0000mmlyxno44af7`
- **📅 Created:** 11 Settembre 2025
- **🧙‍♂️ Characters:** 1 personaggio

#### Personaggi di combatuser:
1. **API Tester** - HUMAN WARRIOR (Level 3)
   - 📍 Location ID: `cmffern6a000cohfafmyd0vop`

---

## 🧝‍♂️ Statistiche Razze

| Razza | Personaggi | Percentuale |
|-------|------------|-------------|
| HUMAN | 2 | 40% |
| DWARF | 1 | 20% |
| GNOME | 1 | 20% |
| ELF | 1 | 20% |

## ⚔️ Statistiche Classi

| Classe | Personaggi | Percentuale |
|--------|------------|-------------|
| WARRIOR | 2 | 40% |
| CLERIC | 1 | 20% |
| ROGUE | 1 | 20% |
| MAGE | 1 | 20% |

---

## 🔐 Credenziali di Test

**⚠️ AGGIORNATE:** 11 Settembre 2025 - Password resettate a valori conosciuti

### 👤 Account di Test:

| Username | Password | Email | Personaggi | Uso Consigliato |
|----------|----------|-------|------------|------------------|
| **testuser** | `test123` | test@example.com | 4 | Testing completo |
| **combatuser** | `combat123` | combat@test.com | 1 | Combat system |
| **rpgplayer** | `rpg123` | rpg@example.com | 0 | Character creation |

### 🌐 Browser Testing:
**URL:** http://localhost:5173  
Usa qualsiasi delle credenziali sopra per entrare nell'app.

### 🔧 API Testing (PowerShell):

```powershell
# Login testuser (4 personaggi)
$body = @{
    username = "testuser"
    password = "test123"
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token

# Login combatuser (1 personaggio)
$body = @{
    username = "combatuser"
    password = "combat123"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Login rpgplayer (0 personaggi - per test creazione)
$body = @{
    username = "rpgplayer" 
    password = "rpg123"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### Endpoint API Testabili:

- **Authentication:** `http://localhost:3001/api/auth/*`
- **Characters:** `http://localhost:3001/api/characters/*`
- **Combat:** `http://localhost:3001/api/combat/*`
- **Map & Movement:** `http://localhost:3001/api/map/*`

---

## 📍 Location Information

I personaggi sono posizionati in diverse location del mondo:

- **Location ID:** `cmffern5n0000ohfaqy3371hi` (3 personaggi)
- **Location ID:** `cmffern6a000cohfafmyd0vop` (2 personaggi)

*Per dettagli completi sulle location, vedere il Map & Movement System.*

---

## 🔄 Database Utilities

### 📊 Aggiornare User Statistics:
```bash
cd server
npx tsx scripts/getTestUsers.ts
```

### 🔑 Reset Password a Valori Test:
```bash  
cd server
npx tsx scripts/resetTestPasswords.ts
```

**⚠️ Security Note:** Le password di test sono valori semplici per development. In produzione usare password sicure e 2FA.

---

## 🎮 Usage Notes

1. **testuser** è l'account principale con la maggior varietà di personaggi
2. **combatuser** è stato creato specificamente per testare il sistema di combattimento
3. **rpgplayer** ha zero personaggi ed è perfetto per testare la creazione
4. Tutti gli utenti hanno accesso al **Map & Movement System** appena implementato
5. I personaggi sono già posizionati nel mondo di gioco per test di movimento

---

*Questo documento è generato automaticamente e riflette lo stato corrente del database di sviluppo.*
