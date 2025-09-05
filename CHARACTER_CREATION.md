# Character Creation — Specifica

Questo documento descrive il flusso e le regole per la creazione del personaggio: valori iniziali, distribuzione punti, allineamento e restrizioni.

## Valori iniziali
- Ogni nuovo personaggio inizia con le seguenti statistiche base (pre-modificatori):
  - Forza (STR): 10
  - Intelligenza (INT): 10
  - Agilità (DEX): 10
  - Volontà (WIL): 10
  - Carisma (CHA): 10
  - Fortuna (LCK): 10
  - Stamina (STA): 10
- Potere (POWER) non è assegnabile dall'utente: viene calcolato automaticamente usando le altre statistiche secondo la formula della media logaritmica (vedi `COMBAT_SYSTEM.md`).

## Punti bonus di creazione
- L'utente dispone di 15 punti da distribuire tra le 7 statistiche (STR, INT, DEX, WIL, CHA, LCK, STA).
- Vincoli:
  - Ogni statistica parte da 10.
  - Nessuna statistica può superare 25 durante la creazione.
  - I punti sono interi.

## Regole di distribuzione
- L'utente può aumentare qualsiasi statistica fino al cap usando i 15 punti.
- Se il giocatore assegna meno punti del massimo disponibile non spesi, essi restano in inventario del profilo come punti riutilizzabili (opzione per future funzionalità) — per l'MVP, richiedere che tutti i punti vengano spesi o procedere con meno punti lasciati.

## Allineamento
- L'utente sceglie l'allineamento al momento della creazione da una matrice 3×3:
  - Legale/Buono, Legale/Neutrale, Legale/Cattivo
  - Neutrale/Buono, Neutrale/Neutrale, Neutrale/Cattivo
  - Caotico/Buono, Caotico/Neutrale, Caotico/Cattivo
- L'allineamento può essere cambiato successivamente in gioco (con costi o meccaniche narrative). Cambiare allineamento non rimuove le abilità imparate, ma rende alcune non utilizzabili se richiedono un allineamento specifico.

## Nome e identificatori
- Nome del personaggio: stringa unica per utente (non globale obbligatoria ma raccomandata)
- Identificatore interno: UUID.

## Flusso di creazione (ordine consigliato)
1. Scegliere un nome.
2. Scrivere un breve background (bio/introduzione).
3. Scegliere l'allineamento.
4. Distribuire i 15 punti tra le statistiche.
5. Scegliere la classe iniziale (Guerriero, Lestofante, Adepto, Mercenario).
6. (Opzionale) Scegliere una sub‑class che fornisca bonus/skill/quest.

## Regole sul nome
- Il nome deve contenere solo lettere dell'alfabeto (A‑Z, supporto unicode per caratteri accentati), spazi e caratteri diacritici legittimi.
- Sono vietati numeri, simboli speciali (es. @ # $ % ^ & * ), e sequenze chiaramente non nominali (es. "1234", "!!!!").
- Il sistema applicherà un filtro di parole vietate (insulti/oscenità) da una lista modulare; i nomi sospetti verranno rifiutati o messi in moderazione.
- Lunghezza consigliata: 3–30 caratteri.

## Background (bio)
- Il giocatore può scrivere una breve storia introduttiva (range consigliato 50–1000 caratteri, limite tecnico 2000).
- Il testo sarà visibile nel profilo e potrà essere passato all'IA come contesto nelle interazioni narrative.
- Controlli: filtri per linguaggio offensivo; rimozione/o masking di dati sensibili.

## Classe e sub‑class
### Classi iniziali (disponibili subito)
1) Guerriero
  - Ruolo: tank/danno corpo a corpo.
  - Bonus iniziali: nessuno permanente (classi bilanciate), accesso a skill base di combattimento corpo a corpo e uso di armature pesanti.
  - Stile: scudi, spade, martelli.

2) Lestofante
  - Ruolo: furtività/critico/controllo.
  - Bonus iniziali: accesso a skill stealth, trappole e attacchi che sfruttano Agilità.
  - Stile: pugnali, leve, movimenti evasivi.

3) Adepto
  - Ruolo: incantatore/supporto.
  - Bonus iniziali: accesso a incantesimi base, gestione MP, e skill di controllo/utility.
  - Stile: bastone, tomi, focus magico.

4) Mercenario
  - Ruolo: ibrido combattimento a distanza/ corpo a corpo.
  - Bonus iniziali: flessibilità equip/skill, accesso a armi miste e a skill tattiche di supporto.

Nota: le classi iniziali non applicano automaticamente bonus statistici grandi; i bilanciamenti sono mantenuti attraverso skill e accesso a equipaggiamento.

### Sub‑class
- Al momento della creazione (o più avanti tramite rituali), il giocatore può scegliere una sub‑class che fornisce piccoli bonus, skill uniche e quest dedicate.
- Le sub‑class sono modificabili in seguito completando prove/rituali nel gioco; il cambio di sub‑class è intenzionalmente flessibile.
- Esempio di sub‑class: "Guardiano di Pietra" (+bonus difesa), "Scaltro delle Ombre" (+danno critico), "Scriptore" (+efficacia incantesimi), "Cacciatore" (+precisione a distanza).

## Classi avanzate (sbloccabili)
Le classi avanzate sono sbloccabili proseguendo nel gioco tramite requisiti (livello, quest, reputazione). Il cambio verso una classe avanzata è permesso una sola volta per personaggio e diventa definitivo.

### Templare
- Bonus statistici: +2 Forza, +2 Stamina, +1 Carisma
- Specializzazioni: Scudo+Spada o Scudo+Martello da guerra
- Stile: forte difesa, abilità di protezione e contro‑controllo.

### Cavaliere
- Bonus statistici: +1 Forza, +3 Stamina, +1 Volontà
- Specializzazioni: Spade a due mani, Lance/Alabarde a due mani, Martelli/mazze pesanti
- Stile: danno pesante e capacità di mantenere linea di fronte.

### Elementalista (suggerimento)
- Bonus statistici proposti: +3 Intelligenza, +1 Volontà, +1 Carisma
- Specializzazioni proposte: Scuole elementali (Fuoco, Acqua, Aria, Terra). Ogni scuola dà accesso a famiglie di incantesimi (es. Fuoco = danno ad area/over time; Acqua = controllo/curing; Aria = velocità/CC; Terra = difesa/aoe di controllo).
- Stile: incantesimi ad area, manipolazione ambientale, uso di bastoni e focus elementali.

### Evocatore (suggerimento)
- Bonus statistici proposti: +3 Intelligenza, +1 Volontà, +1 Stamina
- Specializzazioni proposte: Familiari (singolo potente), Sciami (molti evocati deboli), Vincoli (evoca creature vincolate temporaneamente con buff/debuff). Richiede gestione risorse e posizionamento tattico.

### Assassino (suggerimento)
- Bonus statistici proposti: +3 Agilità, +1 Forza, +1 Fortuna
- Specializzazioni proposte: Pugnalata & Bleed (alte combo critiche), Avvelenamento & Trappole, Ombra (invisibilità/teleport breve). Stile: burst damage, critici e movimento stealth.

### Tiratore (suggerimento)
- Bonus statistici proposti: +3 Agilità, +2 Fortuna
- Specializzazioni proposte: Tiro a lungo raggio (precisione e danno critico), Tiro rapido (più azioni brevi/raffiche), Trapper (munizioni speciali e trappole a distanza).

## Regole di cambiamento classe e sub‑class
- Cambio classe avanzata: consentito una sola volta per personaggio; il cambio è definitivo e può richiedere requisiti (livello minimo, completamento di quest specifiche).
- Cambio sub‑class: modificabile liberamente ma richiede il completamento di rituali/prove in gioco; il cambio può avere costi in risorse o tempo.
- Effetti sul bilanciamento: il passaggio a classe avanzata applicherà i bonus statistici immediatamente e sbloccherà skill/oggetti; il sistema deve eseguire una riconciliazione dell'equip, abilità non compatibili e cooldowns.

## Progressione, respec e requisiti avanzamento
- XP curve: crescita lenta. Formula proposta: XP_req(L) = round(150 * L^1.45). I valori saranno tarati con playtest.
- Respec: costa 1 livello; la procedura sottrae l'XP necessario per salire al livello successivo e retrocede al massimo di 1 livello. Le abilità restano memorizzate ma disabilitate se non rispettano i nuovi requisiti.
- Avanzamento a classi avanzate: livello minimo 10 + completamento quest + trial (max 3 tentativi, al terzo fallimento la quest va ripetuta).

## Note su drop, durabilità e ledger
- Drop: boss importanti possono droppare oggetti fissi insieme a pool casuale; sono previste misure anti‑farm (lockout, diminishing returns, binding).
- Durabilità: per l'MVP non c'è durabilità numerica, ma gli oggetti possono rompersi in eventi speciali e sono riparabili da NPC artigiani.
- Ledger e integrità: ogni oggetto/portafoglio ha UUID univoco; il sistema mantiene un ledger append-only per tracciare transfer/create/destroy e identificare duplicazioni o manipolazioni.

## Validazioni e UX
- Mostrare anteprima in real time di HP, MP e Potere mentre si distribuiscono i punti.
- Bloccare la creazione se il nome non rispetta i vincoli o se i punti non sono stati assegnati correttamente.
- Offrire preset di distribuzione (es. "Bilanciato", "Glass Cannon", "Tank") per accelerare la creazione.

## Persistenza
- Salvare: name, background, alignment, stats_base, stats_current, class, sub_class, creation_timestamp, user_id.
- Validare atomically la transazione di creazione.

---
Aggiornamento dettagliato per l'endpoint di creazione personaggi e la UI associata. Se vuoi, implemento ora una funzione di validazione in Node.js/Python che applichi i vincoli di nome, distribuzione punti e calcolo preliminare di HP/MP/Potere.

## Equip summary and carry rules (see `GAME_MECHANICS.md`)
- Slot equip: head, chest, shoulders, cloak, hands, belt, legs, boots, ring1, ring2, amulet1, amulet2, main_hand, off_hand, ammo_slot, back_slot.
- Regole rapide: 2 armi a una mano o 1 arma a due mani; off_hand può essere scudo/focus/oggetto.
- Capacità di carico: calcolata con formula in `GAME_MECHANICS.md` (CarryCapacity_kg = 5 + 5*STR + 3*STA + 0.5*STR^0.7). Il client mostrerà il peso corrente e le soglie di penalità.

## Valuta
- Sistema monetario: Bronzo (B), Argento (S), Oro (G), Lettera di Marca (L). 10 B = 1 S, 10 S = 1 G, 10 G = 1 L. Le Lettere di Marca sono banconote virtuali a peso trascurabile.

## Talenti iniziali
- Il giocatore sceglie 2 talenti fissi alla creazione (non respeccabili) da una lista di 20; potrà ottenerne fino a 5 in gioco. La lista completa dei 20 talenti è in `GAME_MECHANICS.md`.

## Hook a `GAME_MECHANICS`
- Questo documento si integra con `GAME_MECHANICS.md` che contiene le formule, gli esempi numerici e le tabelle di riferimento. Durante l'implementazione usare `GAME_MECHANICS.md` come single-source-of-truth per calcoli e test.

## Salute iniziale e mana
- L'HP e MP iniziali sono calcolati usando le formule del combat system:
  - HP = round(STR * 1.25 + STA * 2.25 + 50)
  - MP = round(INT * 2.5 + CHA * 0.75 + 75)

## Esempio di creazione
Utente assegna i 15 punti così:
- STR +3 -> 13
- DEX +4 -> 14
- STA +5 -> 15
- INT +3 -> 13
(Altre stat rimangono 10)

Calcoli:
- Stat pesate e POWER vengono calcolate usando `COMBAT_SYSTEM.md`.
- HP e MP calcolati come sopra.

## Abilità iniziali e prerequisiti
- Alcune classi/abilità possono avere prerequisiti minimi di statistica e/o allineamento.
- L'engine di creazione deve validare i prerequisiti prima di permettere l'apprendimento iniziale di un'abilità.

## Persistenza e rollback
- La creazione del personaggio è una transazione atomica: se fallisce la validazione o la persistenza, il sistema ritorna lo stato precedente e segnala l'errore.

## UI/UX consigliata
- Mostrare una barra dei punti rimanenti e controlli +/- per ogni statistica.
- Mostrare in tempo reale il valore stimato di HP, MP e Potere (calcolato dal server o client con le stesse formule).
- Fornire suggerimenti rapidi: "balanced", "glass cannon" e profili predefiniti (distribuzioni consigliate) per giocatori che vogliono iniziare velocemente.

## Considerazioni future
- Opzione per salvare template di distribuzione.
- Possibilità di comprare slot aggiuntivi di personaggi.
- Implementare oggetti/abilità che modificano temporaneamente o permanentemente le statistiche con durate e priorità di stacking.

---
File di riferimento per l'implementazione dell'endpoint di creazione personaggi e la UI associata.
