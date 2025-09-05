# MVP Assessment — Cosa manca per l'implementazione

Data di analisi: 4 settembre 2025

## Assessment dello stato attuale

### Cosa abbiamo (documentazione completa)
✅ **Sistema di combattimento** — D50, statistiche (STR/INT/DEX/WIL/CHA/LCK/STA/POWER), formule complete  
✅ **Creazione personaggi** — classi base (Guerriero/Lestofante/Adepto/Mercenario), talenti (20), allineamento 3×3  
✅ **Equipaggiamento** — 16 slot dettagliati, regole armi 1H/2H, peso realistico con formula  
✅ **Economia** — sistema monetario (Bronzo/Argento/Oro/Lettere di Marca), peso monete  
✅ **Progressione** — XP curve (150 * L^1.45), respec (costa 1 livello), avanzamento classi (livello 10 + quest + trial)  
✅ **Skill tree** — bozza per 4 classi base, mastery 1-10, cooldown, prerequisiti  
✅ **Sistemi sociali** — amici, inviti via email, party max 6, raid max 20  
✅ **IA personalizzabile** — provider config, autoplay offline, strategia a blocchi 5 turni  
✅ **Anti-cheat** — UUID per items, ledger append-only, validazione server-authoritative  
✅ **Drop/farm** — boss drop fissi, pool casuali, misure anti-farm (lockout, diminishing returns)  

### Cosa manca per l'MVP (implementazione)

## 1. Stack tecnologico e scaffold (CRITICO — settimana 1)

**Database schema e migrazioni**
- ❌ Nessun file SQL/ORM presente nella repo
- ❌ Schema per 15+ tabelle (users, characters, items, inventory, equipped_slots, skills, talents, professions, etc.)
- ❌ Migrazioni iniziali e seeder con dati base

**Backend API**
- ❌ Nessun codice server presente
- ❌ Endpoints per auth, characters, inventory, combat, friends
- ❌ Game engine per calcoli (Power, HP/MP, carry capacity, combat resolution)

**Frontend minimale**
- ❌ Nessuna UI presente
- ❌ Character creation flow
- ❌ Character sheet e inventory management
- ❌ Combat interface e log

**Job queue/worker**
- ❌ Sistema per autoplay offline
- ❌ Crafting asincrono
- ❌ AI provider integration

## 2. Implementazione core mechanics (settimane 2-3)

**Game engine (priorità alta)**
- ❌ Calcolo Power (media logaritmica con pesi)
- ❌ HP/MP calculation (formule definite)
- ❌ Carry capacity con soglie penalità
- ❌ Regen HP/MP (combat e out-of-combat)
- ❌ Combat resolver (D50 + Fortuna, soglie 45/70/15)
- ❌ Iniziativa calculation

**Inventory management**
- ❌ Add/remove items con weight validation
- ❌ Stacking rules per oggetti
- ❌ Equip/unequip con slot validation
- ❌ Mount carry capacity integration

**Character management**
- ❌ Character creation con tutte le validazioni
- ❌ Stat distribution (15 punti, cap 25)
- ❌ Talent selection (2 fissi + 3 acquisibili)
- ❌ Class change workflow (quest + trial)

## 3. Contenuti di gioco (settimane 3-4)

**Items database**
- ❌ Armi base (spade, pugnali, bastoni, archi)
- ❌ Armature per ogni slot (head, chest, etc.)
- ❌ Accessori (anelli, amuleti)
- ❌ Oggetti consumabili (pozioni, munizioni)
- ❌ Materiali per crafting

**Skills implementation**
- ❌ Skill per Guerriero (Strike, Guard, Shield Bash, Heavy Swing, Battle Cry)
- ❌ Skill per Lestofante (Backstab, Evade, Poison Edge, Shadowstep, Master of Traps)
- ❌ Skill per Adepto (Spark, Mana Shield, Elemental Bolt, Ritual)
- ❌ Skill per Mercenario (Quick Shot, Adaptive Strike, Tactical Move, Field Repair)
- ❌ Mastery scaling e cooldown management

**Locations/world**
- ❌ Mappe base per esplorazione
- ❌ Location con lore e persistent state
- ❌ Travel system tra locations

**NPCs/encounters**
- ❌ Nemici base con stats e AI
- ❌ Drop tables per oggetti e currency
- ❌ Friendly NPCs (vendor, trainer, questgiver)

## 4. Sistema IA e autoplay (settimana 4)

**AI provider integration**
- ❌ Mock AI per testing
- ❌ Real API calls (OpenAI, Anthropic, etc.)
- ❌ Input sanitization e rate limiting

**Strategy parser**
- ❌ Interpretare strategy text dal giocatore
- ❌ Convert a structured format per AI
- ❌ Validation e safety limits

**Offline worker**
- ❌ Autonomous ticks per personaggi offline
- ❌ Decision logging e audit trail
- ❌ Fallback rules senza AI

## Stack tecnologico raccomandato (100% free/open source)

```
Backend: Node.js + Express + TypeScript + Prisma ORM
Database: PostgreSQL (Supabase free tier o locale con Docker)
Cache/Queue: Redis (locale con Docker o Upstash free tier)
Frontend: React + Vite + TailwindCSS (o plain HTML per prototipo)
Hosting: Railway/Render free tier per backend, Vercel/Netlify per frontend
Testing: Jest + Supertest per backend, Vitest per frontend
```

## Next steps concreti (3 opzioni)

### Opzione A — Database First (2-3 giorni)
1. Generare schema SQL completo (15+ tabelle) + migrazioni Prisma
2. Implementare seeder con items/skills/locations base (50+ items, 20+ skills)
3. Creare API endpoints CRUD per character/inventory/combat
4. **Pro:** solida base dati, facile testing
5. **Contro:** no gameplay immediato

### Opzione B — Core Engine First (2-3 giorni)
1. Creare libreria TypeScript per tutti i calcoli (Power, Combat, Carry, etc.)
2. Implementare unit tests completi per validare formule dai file MD
3. Aggiungere CLI tool per simulazioni combat/character creation
4. **Pro:** engine testato e validated, facile debug
5. **Contro:** no persistenza, no UI

### Opzione C — Full Scaffold (4-5 giorni)
1. Generare progetto completo: backend + frontend + DB + Docker
2. Implementare registrazione + login + character creation
3. Character sheet minimale + basic inventory
4. Deploy automatico su servizi gratuiti
5. **Pro:** subito qualcosa di giocabile e demostrabile
6. **Contro:** più complesso, potenziali problemi di integration

## Priorità immediate per MVP giocabile

**Must have (senza questi non è un gioco):**
1. Database con users/characters/items
2. Character creation completa
3. Basic inventory e equipment
4. Combat system funzionante (anche solo vs dummy)
5. UI per vedere character sheet e fare azioni

**Should have (per demo convincente):**
6. 2-3 locations esplorabili
7. 5-10 NPCs/monster con basic AI
8. Sistema di drop e loot
9. Friend system e party basics
10. Deploy accessibile via web

**Could have (iterazioni successive):**
11. AI provider integration
12. Autoplay offline
13. Crafting e professioni
14. Classi avanzate
15. Seasonal content

## Stima tempi per MVP base giocabile

- **1 settimana:** Stack setup + DB + auth + character creation
- **1 settimana:** Game engine + combat + inventory
- **1 settimana:** Content (items, skills, locations, NPCs)
- **1 settimana:** UI polish + testing + deploy

**Totale: 4 settimane per 1 developer full-time**

## Raccomandazione

**Iniziare con Opzione C (Full Scaffold)** perché:
- Fornisce valore tangibile subito
- Permette testing iterativo
- Identifica problemi di integrazione early
- Più motivante vedere progresso visibile
- Facilita onboarding di altri developer

Una volta stabilito lo scaffold, iterare aggiungendo contenuti e features incrementalmente.

---

*Nota: questo assessment è basato sui file esistenti nella repo (README.md, GAME_MECHANICS.md, CHARACTER_CREATION.md, COMBAT_SYSTEM.md). La documentazione è completa e ben strutturata; l'effort principale è ora sull'implementazione.*
