# Combat System — Specifica tecnica

Questo documento descrive in modo completo le regole di combattimento del gioco: statistiche coinvolte, calcolo del "Potere", iniziativa, risoluzione delle azioni con D50, critici/fumble, regole di turno e comportamento IA durante i blocchi da 5 turni.

## Statistiche
Ogni personaggio possiede le seguenti statistiche base (valori iniziali = 10, cap = 25):
- Forza (STR)
- Intelligenza (INT)
- Agilità (DEX)
- Volontà (WIL)
- Carisma (CHA)
- Fortuna (LCK)
- Stamina (STA)
- Potere (POWER) — calcolato a partire dalle altre statistiche

Note: oggetti o abilità possono modificare temporaneamente o permanentemente (finché equipaggiati) le statistiche; i valori effettivi usati in combattimento sono i valori correnti (valore base + modificatori attivi), rispettando comunque il cap dinamico se presente.

## Pesi per il calcolo del Potere
- Forza, Intelligenza, Agilità: peso = 3
- Stamina, Volontà: peso = 1.75
- Carisma, Fortuna: peso = 0.75

## Formula scelta: media logaritmica (geometric mean via log)
Usiamo la media logaritmica delle statistiche pesate per ottenere un valore di "Potere" stabile e non esplosivo.

Procedura:
1. Per ogni stat s_i (escludendo Power) calcola s_i' = max(1, s_i * weight_i).
2. Calcola la media dei log naturali: m = (1/n) * Σ ln(s_i').
3. Potere = round(exp(m)).

Dove n = 7 (numero di statistiche usate: STR, INT, DEX, WIL, CHA, LCK, STA).

### Esempio pratico (valori di esempio)
Statistiche correnti:
- Forza = 15
- Intelligenza = 12
- Agilità = 14
- Volontà = 11
- Carisma = 13
- Fortuna = 10
- Stamina = 16

Calcolo pesate:
- STR' = 15 * 3 = 45
- INT' = 12 * 3 = 36
- DEX' = 14 * 3 = 42
- STA' = 16 * 1.75 = 28
- WIL' = 11 * 1.75 = 19.25
- CHA' = 13 * 0.75 = 9.75
- LCK' = 10 * 0.75 = 7.5

Logaritmi (n≈7):
ln(45) ≈ 3.81
ln(36) ≈ 3.58
ln(42) ≈ 3.74
ln(28) ≈ 3.33
ln(19.25) ≈ 2.96
ln(9.75) ≈ 2.28
ln(7.5) ≈ 2.01

Media dei log m ≈ 3.10
Potere = round(exp(3.10)) ≈ round(22.2) = 22

### Esempio con tutte le stat al massimo (25)
Stat pesate:
- STR' = 25 * 3 = 75
- INT' = 25 * 3 = 75
- DEX' = 25 * 3 = 75
- STA' = 25 * 1.75 = 43.75
- WIL' = 25 * 1.75 = 43.75
- CHA' = 25 * 0.75 = 18.75
- LCK' = 25 * 0.75 = 18.75

ln(75)≈4.317, ln(43.75)≈3.78, ln(18.75)≈2.93
media log m ≈ (4.317*3 + 3.78*2 + 2.93*2) / 7 ≈ 3.79
Potere ≈ round(exp(3.79)) ≈ round(44.4) = 44

Risultato: anche con massimi valori, il Potere rimane in un range contenuto e gestibile.

## HP e MP
- HP totali = round( Forza * 1.25 + Stamina * 2.25 + 50 )
- MP totali = round( Intelligenza * 2.5 + Carisma * 0.75 + 75 )

Esempio: con STR=15, STA=16 -> HP = round(15*1.25 + 16*2.25 + 50) = round(18.75 + 36 + 50) = 105

## Iniziativa (ordine di turno)
Calcolo singolo per entità (player/NPC/monster) usato per determinare l'ordine di attacco all'inizio dell'incontro (può essere ricalcolato ogni round se effetti cambiano le stat rilevanti):

InitiativeScore = (Agilità * 0.75 * (Potere / 2)) + Carisma

Ordine: valori più alti attivano prima; in caso di pareggio, usare tie‑break casuale o Carisma maggiore.

## Azioni e turni
- Azioni per turno base = 1.
- Azioni bonus: abilità passive o situazioni particolari possono concedere azioni bonus.
- Se il divario di Potere fra attaccante e difensore è >= (1/3) del Potere del difensore (es. attacker_power >= defender_power * 4/3), l'attaccante ottiene 1 azione bonus.
- Cap per turno = 3 azioni massime.
- Di norma ogni azione principale può essere: attacco fisico, abilità (attiva), uso oggetto, difesa, fuga.

## Risoluzione dell'azione — D50 e Fortuna
- Dado: D50 con range 1..50.
- Per una azione viene scelta dallo AI/server la statistica primaria rilevante (es. Forza per un attacco fisico, Intelligenza per un incantesimo offensivo). L'AI del giocatore decide quale stat usare in funzione dell'azione; il server convalida la scelta ragionevolmente.

Meccanica di tiro (per ogni azione):
1. Tiro stat: stat_total = stat_value + roll1 (1..50)
2. Tiro fortuna: luck_total = luck_value + roll2 (1..50)
3. Valore effettivo = round((stat_total + luck_total) / 2)

- Valore minimo teorico: 10 (stat min) + 1 (dado min) = 11 su ogni tiro -> media ≥ 11. L'arrotondamento mantiene numeri interi.

### Soglie (post-media)
- Successo minimo: >= 45
- Critico: >= 70
- Fallimento critico: <= 15

Note: queste soglie si applicano al valore effettivo dopo la media e arrotondamento.

### Esempio di tiro
Stat = Forza 15, Fortuna = 10
roll1 = 22, roll2 = 40
stat_total = 15 + 22 = 37
luck_total = 10 + 40 = 50
eff = round((37 + 50) / 2) = round(43.5) = 44 -> fallimento (sotto 45)

## Critici e fallimenti
- Critico (>=70): aumenta l'efficacia dell'azione (per es. +50% danno, effetti aggiuntivi). Parametri di scala devono essere bilanciati per abilità specifiche.
- Fallimento critico (<=15): l'azione fallisce in modo severo (es. perdita risorse, apertura per contromossa, auto‑danno). Specifiche per abilità vanno definite caso per caso.

## Costi abilità, cooldown, e tipi
- Abilità possono avere costi fissi (es. 15 MP) o percentuali (es. 10% HP max).
- Ogni abilità può avere un cooldown espresso in turni. Le abilità con costi percentuali sono consigliate per limitare spam su target con poche risorse.
- Il server applica ordine: controllo requisiti (stat min, allineamento), costo (sufficienti risorse), cooldown libero, quindi procede al tiro.

## Allineamento e restrizioni
- Allineamenti: combinazione di Legale/Neutrale/Caotico × Buono/Neutrale/Cattivo (classici archetipi).
- Alcune abilità richiedono un allineamento specifico per essere imparate/usate. Se il personaggio cambia allineamento, abilità imparate restano memorizzate ma non utilizzabili fino a che l'allineamento non torna compatibile.

## IA e blocchi da 5 turni
- All'inizio dello scontro il giocatore descrive una strategia (es. "difensivo: curami se HP < 50%; se possibile usa potenziamento prima").
- L'IA del giocatore esegue autonomamente 5 turni seguendo la strategia dichiarata. Dopo 5 turni il sistema chiederà al giocatore (o aggiornerà la strategia) e poi continua.
- Durante quei 5 turni l'IA può scegliere azioni, abilità e oggetti seguendo i vincoli impostati dal giocatore (es. non scendere sotto X% HP), e con piena libertà entro tali limiti.
- L'IA prioritizza: 1) sopravvivenza (rispettare percentuali minime), 2) eseguire obiettivi strategici (danno, controllo), 3) gestione risorse (non esaurire MP/STA inutilmente).

### Log e auditing
- Tutte le decisioni automatiche dell'IA devono essere loggate: input inviato al modello (se presente), decisione scelta, risorsa consumata, risultato del turno.

## Error handling e bilanciamento
- Validazioni server per evitare exploit (es. usare abilità senza pagare costi). Applicare rate limit sui turni automatici per i personaggi offline.
- Bilanciamento: testare parametricamente soglie critico/successo, danni e costi; mettere in atto tweak iterativi.

## Note per l'implementazione
- Usare numeri interi semplifica storage e confronto (tutti i valori vengono arrotondati).
- Isolare il calcolo del Potere e l'engine di risoluzione tiri in moduli testabili e unit-testati.
- Fornire endpoint che restituiscano spiegazioni sintetiche del risultato di un turno (rolls, stat usata, effettivo, soglia, risultato) per debugging e per feed testuali utente.

---
Documento di riferimento per lo sviluppo del motore di combattimento. Per passare alla fase implementativa posso generare pseudocodice o test unitari per i calcoli (Potere, iniziativa, risoluzione D50).
