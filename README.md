# RPG_1 — MMO testuale ibrido (OGame + DnD)

Questo repository contiene la documentazione progettuale per un gioco di ruolo testuale massivo online, ibrido fra meccaniche asincrone di tipo OGame (edifici, economia, flotte) e regole di gioco di ruolo tipo Dungeons & Dragons (personaggi, equipaggiamento, combattimento).

## Sommario

Questo README descrive: requisiti, scelte tecnologiche raccomandate, architettura di alto livello, MVP minimo, contratto API di base, un modello dati iniziale, casi limite importanti, strategie di test e i prossimi passi pratici.

## Checklist requisiti
- Gioco di ruolo testuale online, massivo (MMO). — Da implementare (documentato qui)
- Ibrido OGame + DnD (economia asincrona + regole di ruolo). — Documentato
- Scegliere stack tecnologico / scaffolding. — Opzioni fornite; attendere scelta per scaffold

Stato: questo file è stato aggiornato con la progettazione di alto livello; il codice di servizio non è ancora incluso in questo repo.

## Piano sintetico

1. Definire l'MVP e i confini (asincrono vs realtime).
2. Scegliere stack (vedi sezione sotto).
3. Implementare backend API + worker per azioni asincrone.
4. Creare frontend testuale web (UI semplice).
5. Scalare: caching, code, eventuale migrazione a servizi concorrenti.

## Raccomandazioni tecnologiche (opzioni e trade‑off)

- Opzione A — PHP + MariaDB
  - Pro: hosting economico, adatto per team con esperienza PHP.
  - Contro: realtime richiede componenti aggiuntivi (Node, Ratchet, Swoole).

- Opzione B — Node.js + PostgreSQL + Redis
  - Pro: sviluppo rapido full‑JS, ottimo supporto WebSocket (Socket.IO), Redis per cache e code.
  - Contro: attenzione all'architettura per carichi molto elevati.

- Opzione C — Elixir (Phoenix) o Go + PostgreSQL + Redis
  - Pro: eccellenti per concorrenza e gestione connessioni (BEAM/Go routines).
  - Contro: curva di apprendimento se il team non le conosce.

Raccomandazione pratica iniziale: se vuoi partire velocemente e sei familiare con PHP, usa PHP + MariaDB e aggiungi Node/Redis per job/notifiche; se preferisci una singola tecnologia moderna per realtime, scegli Node.js + PostgreSQL + Redis.

## Architettura ad alto livello

- Frontend: web UI testuale (React o HTML/CSS/Vanilla), mobile‑friendly.
- API: REST (o GraphQL) per operazioni sincrone.
- Game Engine / Worker: servizio che gestisce azioni asincrone (coda di job).
- DB: relazionale per stato persistente (Postgres o MariaDB), Redis per cache, lock e toggle.
- WebSocket/Push: servizio separato (Socket.IO o Phoenix Channels) per notifiche realtime.
- Job queue: BullMQ / RabbitMQ / Celery / RQ, a seconda dello stack.

## MVP minimo (priorità)

1. Autenticazione (email + JWT).
2. Creazione personaggio/fazione.
3. Mappa/locations semplici (pianeti o dungeon).
4. Risorse + edifici + azione di costruzione asincrona.
5. Combattimento semplificato server‑authoritative.
6. Interfaccia testuale web con feed eventi.

Tempo stimato (1 dev): prototipo base 2–4 settimane.

## Contratto API minimo (esempi)

- POST /api/auth/login -> { token }
- POST /api/auth/register -> { player }
# RPG_1 — MMO testuale ibrido (testuale persistente, IA-driven)

Questo repository contiene la documentazione progettuale e i requisiti di alto livello per un gioco di ruolo testuale massivo online con forte integrazione di IA guidata dall'utente.

Il file descrive: requisiti funzionali, flussi utente critici (registrazione, gestione personaggi, amici, inviti), integrazione IA (contratto e limiti), API consigliate, modello dati iniziale e priorità MVP.

## Ricevuto: obiettivo di questo aggiornamento

Ho ricevuto la descrizione della struttura di gioco. Qui sotto trasformo i requisiti in specifiche tecniche e di prodotto pronti per essere implementati o usati per creare lo scaffold.

## Checklist requisiti (estratti dalla tua descrizione)
- Registrazione utente: username, email, password + verifica età (>=13).
- Creazione e gestione di più personaggi per utente (max 5, espandibile a pagamento).
- Lista amici + invio inviti via email; invito con link che, se accettato e seguito da registrazione, aggiunge automaticamente l'amico.
- Partite singole e di gruppo; mondo fantasy persistente, testo-first (simile a OldGregsTavern + meccaniche asincrone).
- IA personalizzabile: ogni giocatore inserisce la propria API e provider; l'IA valuta le azioni del suo giocatore (non decide per gli altri), e può essere usata per comportamenti automatici quando il giocatore è assente.
- Party max 6 giocatori (raid/missioni speciali fino a 20).
- Sistema offline/autonomo: la AI del giocatore può agire in sua vece in base a log azioni passate, con limiti e vincoli.
- Stagionalità: contenuti espansi ogni ~3–4 mesi.

Per ogni item qui sotto riporterò uno stato (Done/Planned) e suggerimenti tecnici.

## Requisiti funzionali dettagliati e API suggerite

1) Registrazione e autenticazione
- Requisito: registrazione con username, email, password e data di nascita (o conferma età) — min 13 anni.
- Flusso: POST /api/auth/register { username, email, password, dob }
  - Validazioni: email unica, password minima (es. 8 char), dob -> calcolare età >= 13.
  - Risposta: 201 { userId, next: 'verify-email' }
- Login: POST /api/auth/login { email, password } -> returns JWT
- Email verification: token via email (link sicuro) prima di poter creare personaggi.
- Nota sicurezza: conservare password con hashing forte (bcrypt/argon2) e cifrare le chiavi API utente a riposo.

2) Verifica età
- Richiedere data di nascita in fase di registrazione e rifiutare registrazioni con età < 13.
- Conservare una policy per gestione utenti borderline e richieste di verifica (documentare in Privacy/ToS).

3) Personaggi (Character Slots)
- Ogni utente può creare fino a 5 personaggi (espansione futura vendibile).
- Endpoints principali:
  - GET /api/users/{id}/characters
  - POST /api/users/{id}/characters { name, class, appearance, initial_traits }
  - DELETE /api/characters/{charId}
  - PATCH /api/characters/{charId}
- Policy: i personaggi sono indipendenti; inventario, progressi e job separati.
- Monetizzazione: endpoint e model per "buy character slot" (pagamenti esterni).

4) Lista amici e inviti via email
- Gli utenti possono aggiungere amici o invitare persone via email.
- Invito: POST /api/friends/invite { email, message? }
  - Sistema invio mail: link di invito contiene un token riferito all'email e il player che ha inviato.
  - Se il destinatario clicca e completa la registrazione con la stessa email, si stabilisce automaticamente l'amicizia bidirezionale.
  - Se l'utente era già registrato, il link propone una richiesta di amicizia che può essere accettata.

5) Matchmaking/Partite/Party
- Modalità singola o di gruppo; party massimo 6 membri per le attività normali.
- Raid/missioni speciali: fino a 20 giocatori con regole separate per bilanciamento e tempo.
- Endpoints di esempio:
  - POST /api/parties -> crea party (owner, maxPlayers)
  - POST /api/parties/{id}/invite -> invita membri
  - POST /api/parties/{id}/start -> avvia missione

6) Mondo persistente e game loop
- Mondo fantasy persistente con lore e stagionalità (nuove stagioni ogni 3–4 mesi).
- Gameplay testuale: esplorazione luoghi, incontri con NPC e altri giocatori, storie/quest narrative.
- Quando viaggi in una location puoi incontrare NPC (amichevoli/ostili) e ALTRI GIOCATORI.

7) IA personalizzabile (core requirement)
- Ogni giocatore può fornire configurazione del proprio provider IA e la relativa API key (opzionale).
- Architettura suggerita:
  - Conservare provider config e secret cifrati (es. KMS o at-rest encryption) — oppure non memorizzare la chiave sul server ma chiedere un token a ogni sessione (policy opzionale).
  - Payload di esempio inviato alla IA del giocatore: { player_state, recent_action_log, current_location_context, incoming_event }
  - Risposta attesa: { recommended_action, confidence, explanation? }
  - Il gioco valuta la raccomandazione sul server e applica le regole di gioco (server‑authoritative). L'IA non può forzare inconsistenze.
- Limiti e responsabilità:
  - L'IA del singolo giocatore valuta e propone solo per il suo personaggio; non può controllare giocatori esterni.
  - Il giocatore è responsabile del costo dei propri API calls (configurazione provider). Mostrare stima delle chiamate e usare cache e batching.

8) Comportamento offline / delega di decisione
- Quando un giocatore è assente, la sua IA (se configurata) può prendere decisioni automatiche basate su:
  - Log azioni passate (es. ultime N azioni o profilo comportamentale sintetizzato)
  - Regole probabilistiche e limiti (es. non intraprendere azioni irreversibili senza consenso, uso di safe-mode)
  - Un profilo di preferenze pubblico/privato (es. "aggressivo", "difensivo", "neutrale") per limitare decisioni rischiose.
- Implementazione consigliata: worker che esegue un "autoplay tick" per i personaggi offline, chiama il provider IA locale del giocatore (o una fallback AI pubblica) e applica azioni con un rate limit configurabile.

9) Sicurezza e privacy
- Non esporre API keys lato client; cifrare dati sensibili a riposo.
- Server‑authoritative per tutte le risoluzioni di gioco e i calcoli critici.
- Log e auditing per azioni IA automatiche (chi ha invocato, quali input, output, decisione applicata).
- Policy GDPR / ToS: chiarire responsabilità sulle chiamate verso provider esterni e gestione dati.

## Modello dati consigliato (sintesi)
- users(id, username, email, password_hash, dob, email_verified, created_at)
- api_providers(id, user_id, provider_name, encrypted_api_key, config_json, created_at)
- characters(id, user_id, name, class, slots_used, data_json, created_at)
- friends(user_id, friend_user_id, status, created_at)
- friend_invites(id, inviter_user_id, invitee_email, token, status, created_at)
- parties(id, owner_id, max_players, settings_json)
- locations(id, name, type, lore_json, persistent_state_json)
- action_logs(id, character_id, actor, action_json, result_json, created_at)
- autonomous_jobs(id, character_id, trigger, input_snapshot, decisions_json, applied_at)

Suggerimento: usare JSON per campi estensibili (traits, inventory) e tabelle dedicate per query pesanti.

## Contratto IA (bozza)
- Request body verso provider IA del giocatore:
  - { player_id, character_id, player_profile, recent_actions[], visible_context }
- Response attesa:
  - { action: { type, params }, confidence: 0..1, explanation: string }
- Validazione lato server: map action-> engine di gioco che ne valuta la fattibilità prima di eseguirla.

## Monetizzazione e limiti
- Character slots: base 5 gratuiti per utente. Espansione tramite acquisto (in-app o sito) per slot aggiuntivi.
- Eventuale piano premium per usare provider IA pre-configurati o chiamate IA a costo coperto dal servizio.

## Priorità MVP (task immediati)
1. Autenticazione + registrazione con verifica età (mandatory).
2. CRUD personaggi + limitazione slot (5).
3. Lista amici e inviti via email con link token.
4. Implementare storage sicuro per configurazione provider IA (senza chiamate automatiche ancora).
5. Worker minimale per "autonomous ticks" (simulazione offline con fallback deterministico).
6. Piccola UI testuale per: registrazione, lista personaggi, esplora location, invia invito.

## Considerazioni tecniche e opzioni stack
- Opzione rapida: Node.js + Postgres + Redis + BullMQ (veloce per prototipo). Frontend minimale in React o server-side rendering.
- Opzione concurrent: Elixir (Phoenix) + Postgres + Redis per scalabilità di connessioni e semplicità su canali e job.

## Test e qualità
- Unit test per motore di risoluzione azioni e per il worker autonomous.
- Integration test per flusso invito->signup->amicizia.
- Test di sicurezza per storage chiavi e validazione server‑authoritative.

## Roadmap a breve (next steps pratici)
1. Decidere stack e creare scaffold (backend + worker + DB migrations).
2. Implementare registrazione/login + verifica età + semplice UI.
3. Implementare CRUD personaggi e limite slot.
4. Implementare inviti via email e flusso automatico di amicizia.
5. Prototipare integrazione IA con mock provider e worker di autoplay.

## Requisiti coverage (mappatura verso lo stato attuale di questa repo)
- Registrazione + verifica età — Planned (documentato, da implementare)
- Creazione e gestione personaggi (max 5) — Planned
- Lista amici + inviti via email con link che aggiunge amici — Planned
- Partite singole e di gruppo, party max 6, raid fino a 20 — Planned
- Mondo persistente e stagionalità — Planned
- IA personalizzabile per singolo giocatore (utente fornisce provider) — Planned
- Comportamento offline delegato all'IA con log e limiti — Planned

## Note finali
Questo README è ora allineato alla struttura di gioco che hai descritto; se vuoi, procedo con uno scaffold minimo per il backend (Node.js) che implementa: registrazione + verifica età, CRUD personaggi, e il sistema inviti via email (mocked) — oppure dimmi se preferisci un altro stack. Posso anche creare i primi file di migrazione e implementare i test di integrazione per l'invito/amicizia.

---

## Decisioni di design confermate
- XP curve: formula proposta XP_req(L)=round(150 * L^1.45) per una crescita lenta ma sensibile.
- Respec: costa 1 livello (si sottrae l'XP necessario per salire al livello successivo, massimo 1 livello retrocesso).
- Avanzamento a classi avanzate: livello minimo 10 + quest + trial con massimo 3 tentativi.
- Drop & anti‑farm: boss drop fissi + pool casuale; lockout boss e diminishing returns per prevenire farm loop.
- Durabilità: per MVP gli oggetti non hanno durabilità numerica; rotture possibili in eventi speciali; riparazione da NPC.
- Ledger e integrità: ogni item e portafoglio ha UUID; ledger append-only per transfer/create/destroy e controlli periodici per duplicati.
``` 