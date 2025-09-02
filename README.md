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
- GET /api/player/{id} -> stato del giocatore (risorse, edifici, location)
- POST /api/action -> { type: "build|move|attack|explore", payload } -> returns { jobId }
- GET /api/job/{jobId} -> { status: pending|done|failed, result }

Errori: 401 (auth), 422 (validation), 409 (lock/concurrency).

## Modello dati iniziale (schema semplificato)

- users(id, email, password_hash, created_at)
- players(id, user_id, name, faction, xp, created_at)
- locations(id, type, owner_player_id, resources_json)
- buildings(id, player_id, location_id, type, level, started_at, finish_at)
- actions(id, player_id, type, payload_json, status, result_json, created_at)

Questo è un punto di partenza: usare JSON per payload facilita l'estensione rapida.

## Edge cases essenziali

- Azioni concorrenti sulle stesse risorse -> usare transazioni DB + Redis locks.
- Rollback su job long‑running -> idempotenza e compensating transactions.
- Sicurezza/cheating -> server authoritative, non fidarsi del client.
- Crescita utenti -> split dei servizi, read replicas, sharding logico per player id.

## Test e qualità

- Unit test per engine di gioco (combattimento, calcolo risorse).
- Test d'integrazione per job queue.
- Lint/CI (GitHub Actions) per validazione codice.
- Smoke test e simulazioni di carico (k6, locust) prima dello scale.

## Prossimi passi concreti (opzioni rapide)

- Opzione A (PHP): scaffold backend con Slim/Laravel + MariaDB + worker skeleton + README aggiornato.
- Opzione B (Node): scaffold Express + Socket.IO + PostgreSQL + BullMQ skeleton.
- Opzione C (Design): dettagliare il game design (regole di combattimento, curve costi) prima di codificare.

Se vuoi, procedo subito a generare lo scaffold corrispondente all'opzione che preferisci (A/B/C). Indica la scelta e creerò i file iniziali, le migrazioni DB e un piccolo demo endpoint.

## Note finali

Questo documento è pensato come base vivente: lo aggiorneremo man mano che definiamo regole, bilanciamenti e scelte di deploy. Se vuoi, posso ora creare il repository scaffold e implementare l'autenticazione e la prima azione asincrona (costruzione).

---

Requisiti coverage
- Creare README con progetto dettagliato — Done
- Caricare README nella repo — Done
- Scaffold codice (backend + worker) — Deferred (attendo scelta stack)