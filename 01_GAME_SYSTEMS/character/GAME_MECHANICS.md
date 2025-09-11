# Game Mechanics — Reference

Questo file raccoglie le regole e le formule operative usate nelle specifiche: equip, inventario (peso realistico), mount, skill tree, mastery, talenti, professioni, rigenerazione HP/MP, e note anti‑cheat. Usalo come riferimento tecnico per implementazione e test.

## Indice
- Equip e slot
- Inventario e capacità di carico (formula)
- Valuta
- Mount e capacità di trasporto
- Skill tree (sintesi)
- Mastery delle skill
- Talenti (lista iniziale)
- Professioni
- Regen HP/MP (formule)
- Status effects e debuff/buff
- Anti‑cheat e validazione server

---

## Equip e slot
Slot disponibili per personaggio:
- head, chest, shoulders, cloak, hands, belt, legs, boots
- ring1, ring2, amulet1, amulet2
- main_hand, off_hand (scudo / focus / oggetto / arma mano2)
- ammo_slot
- back_slot (per esempio: borsa, scudo a due mani quando staccato)

Regole rapida:
- Puoi equipaggiare: 2 armi una mano oppure 1 arma a due mani.
- Off_hand può essere scudo, focus magico o un'arma secondaria. Se si impugna arma a due mani l'off_hand è vuoto.
- Oggetti stackabili: pozioni, munizioni, risorse. Stack limit definito per item.

Esempio struttura JSON (equip):
{
  "equipped": {
    "head": null,
    "chest": "item_uuid",
    "main_hand": {"id":"item_uuid","type":"sword","handedness":1},
    "off_hand": {"id":"item_uuid","type":"shield","handedness":1}
  }
}

Ogni item ha attributi principali: id, name, weight_kg, type, handedness, modifiers (JSON), stackable, max_stack, durability.

---

## Inventario e capacità di carico (peso realistico)
Unità: kg. Peso misurato realisticamente per ogni oggetto.

Oggetto: { id, name, weight_kg, stackable, quantity }

Formula capacità di carico (proposta):
CarryCapacity_kg = base + a * STR + b * STA + c * STR^0.7
Parametri consigliati: base = 5, a = 5, b = 3, c = 0.5

Esempio:
- STR=15, STA=16 => CarryCapacity ≈ 128 kg

Soglie di penalità:
- <= capacity: nessuna penalità.
- > capacity e <= capacity*1.2: -10% speed, +consumo stamina.
- > capacity*1.2 e <= capacity*1.5: -25% efficacia azione, no corsa.
- > capacity*1.5: immobilizzato, richiede droppare peso o usare mount.

Inventory actions:
- addItemToInventory(item): verifica peso totale + (item.weight * quantity) <= capacity con regole di stacking.
- Se superi soglie, applica penalità lato server e notifica client.

---

## Valuta
- Base: Bronzo (B)
- 10 B = 1 Argento (S)
- 10 S = 1 Oro (G)
- 10 G = 1 Lettera di Marca (L) — nome proposto per banconota/lettera di credito.

Peso approssimativo:
- Monete metalliche hanno peso (es. 0.02 kg per 10 Bronzi). Le Lettere di Marca hanno peso trascurabile (0.01 kg ciascuna) e sono esenti dai limiti pratici per comodità.

---

## Mount — capacità di trasporto
Mount definito da attributi: { mount_id, name, mount_strength, mount_endurance, tier }

Formula:
MountCapacity_kg = mount_base + 10 * mount_strength + 5 * mount_endurance
Param: mount_base suggerito = 50 kg

Esempio:
- mount_strength=8, mount_endurance=10 => 50 + 80 + 50 = 180 kg

Regole:
- Se il personaggio sale su mount, parte del carico può essere trasferito al mount fino alla sua capacità.
- Penalità di mount se sovraccarico: movimento rallentato, rischio di caduta, ridotta endurance.

---

## Skill tree — sintesi e regole
- Ogni livello personaggio conferisce 1 punto skill.
- Skill hanno prerequisiti in livello/stat e possono essere passive o attive.
- Ogni skill ha: id, name, description, reqs (level, stats), cost (MP/HP/STA), cooldown, max_mastery (10), effects per mastery.

Classi base (bozza):
- Guerriero: Strike, Guard, Shield Bash, Heavy Swing, Battle Cry
- Lestofante: Backstab, Evade, Poison Edge, Shadowstep, Master of Traps
- Adepto: Spark, Mana Shield, Elemental Bolt, Ritual
- Mercenario: Quick Shot, Adaptive Strike, Tactical Move, Field Repair

Implementazione:
- Schema skill: skills(id,name,base_damage,scaling_stat,cooldown_base,mp_cost,prereqs,json_effects)
- Runtime: validate prerequisites, apply cost, run cooldown, compute mastery scaling.

---

## Mastery delle skill
- Livelli 1..10.
- Ogni livello: aumento percentuale dell'effetto base (+~6% per livello) e riduzione cooldown (~-3%/livello) come default.
- XP o uso-based progression da definire: consigliato uso-based (più naturale per mastery d'azione).

Esempio: Skill base danno=10 + STR*1.2
- Mastery 1 → danno *1.06, cooldown*0.97
- Mastery 10 → danno *1.6 circa, cooldown ~0.74

---

## Tratti — Sistema Completo (Aggiornato)

### **Tratti Razziali** (Automatici - Non Modificabili)
- **UMANI**: "Adattabilità" - +10% XP guadagnato
- **ELFI**: "Vista Elfica" - +15% precisione a distanza  
- **NANI**: "Costituzione Ferrea" - +20% resistenza veleni/malattie
- **ORCHI**: "Furia Orchesca" - +25% danno quando sotto 30% HP
- **TROLL**: "Rigenerazione" - +2 HP/turno in combattimento
- **GNOMI**: "Genio Inventivo" - +20% efficacia crafting magico
- **AERATHI**: "Volo Planato" - Può planare per brevi distanze
- **GUOLGARN**: "Vista Sotterranea" - Visione perfetta al buio
- **ZARKAAN**: "Resistenza Desertica" - Immune a caldo estremo
- **UOMINI PESCE**: "Respirazione Acquatica" - Respira sott'acqua
- **UOMINI LUCERTOLA**: "Mimetismo Ambientale" - +25% stealth in ambienti naturali

### **Tratti di Classe** (Automatici - 2 per Classe)

#### **GUERRIERO**:
- "Padronanza Armi" - +10% danno armi da mischia
- "Difesa Solida" - +15% resistenza con scudo

#### **MAGO**:
- "Condotto Arcano" - -15% costo MP incantesimi
- "Concentrazione" - +20% precisione incantesimi

#### **FURFANTE**:
- "Colpo Furtivo" - +30% probabilità critico da stealth
- "Passo Silenzioso" - +25% efficacia stealth

### **Tratti Selezionabili** (2 Scelti alla Creazione - Lista 20)
1. **Resistente** — +5% HP massimi
2. **Mani Veloci** — -10% tempo uso oggetti / +1 azione bonus condizionale
3. **Tiratore Scelto** — +5% precisione armi a distanza
4. **Baluardo** — +5% difesa quando scudo equipaggiato
5. **Recupero Rapido** — +10% rigenerazione fuori combattimento
6. **Furtivo** — +10% efficacia stealth
7. **Lama Affilata** — +5% probabilità critico
8. **Ingegnoso** — +10% drop rate risorse
9. **Alchimista** — +10% efficacia pozioni
10. **Domatore** — +10% capacità cavalcatura
11. **Presa Salda** — +5% capacità di carico
12. **Apprendista Veloce** — +5% guadagno XP
13. **Portafortuna** — +3% bonus Fortuna generale
14. **Tocco Curativo** — +10% efficacia cure
15. **Specialista Trappole** — +15% danno/efficacia trappole
16. **Economista** — -10% costo MP incantesimi
17. **Occhio di Falco** — +15% range visivo
18. **Nervi Saldi** — +10% resistenza effetti mentali
19. **Esploratore** — +20% velocità movimento
20. **Diplomatico** — +15% successo in negoziazioni

**Regole**: 2 tratti selezionabili alla creazione (irrevocabili), fino a 5 totali acquisibili in gioco tramite avanzamento.

---

## Talenti — lista iniziale (20)
1. Hardy — +5% HP max
2. Quick Hands — -10% item use time / +1 azione bonus condizionale
3. Sharpshooter — +5% precisione armi a distanza
4. Bulwark — +5% difesa quando scudo equipaggiato
5. Fast Recovery — +10% regen ooc
6. Stealthy — +10% stealth effect
7. Critical Edge — +5% crit chance
8. Resourceful — +10% resource drop rate
9. Alchemist — +10% potion efficacy
10. Mounted Mastery — +10% mount capacity
11. Iron Grip — +5% carry capacity
12. Quick Learner — +5% XP gain
13. Lucky Charm — +3% luck bonus
14. Medic’s Touch — +10% healing effect
15. Trap Specialist — +15% trap damage/effect
16. Mana Saver — -10% MP cost spells
17. Berserker — +10% damage when HP <25%
18. Tactical Mind — +5% party buff potency
19. Silence Breaker — 1 immunity short silence per fight
20. Trader’s Eye — +5% selling price, -5% buying price

Regole: 2 talenti scelti alla creazione (irrevocabili), fino a 5 tot acquisibili in gioco.

---

## Professioni
- Sbloccabili al livello >=5. Esempi: Fabbro, Alchimista, Minatore, Taglialegna, Tessitore, Armaiolo.
- Mastery professionale 1..10 riduce costi/tempo e migliora qualità output.
- Meccanica: recipes, materiali, job queue (asincrono), probabilità di successo legata a mastery e strumenti.

---

## Regen HP/MP — formule (riassunto)
Combat per turno:
- HP_regen_combat = max(0, floor(0.05 * STA + 0.02 * POWER))
- MP_regen_combat = max(0, floor(0.08 * INT + 0.015 * POWER))

Out of combat (per minuto):
- HP_regen_ooc_per_min = floor(0.2 * STA + 0.05 * POWER)
- MP_regen_ooc_per_min = floor(0.25 * INT + 0.05 * POWER)

Modificatori: skill/item/shelter possono moltiplicare o addizionare al valore base.

---

## Status effects / buffs / debuffs
- Struttura: { effect_id, source, modifiers, remaining_turns, stackable? }
- Tipici: stun, poison (DoT), burn, slow, root, buff_attack, buff_defense, silence.
- Priorità di applicazione e rimozione da definire: ad esempio, debuff di stun override e impedisce azioni per X turni.

---

## Anti‑cheat e validazione server

- Server‑authoritative per tutti i calcoli di combattimento, inventario, transazioni economiche.
- Log action per auditing e rollback in caso di discrepancy.
- Rate limit per autoplay/AI-driven actions quando il personaggio è offline.
- Validazione delle chiamate AI esterne: input sanitized e limiti su costo applicabile automatico (per evitare abuso mediante provider a pagamento).

---

## Progressione, Respec e Avanzamento classe

XP curve (scelta lenta ma percepibile):
- Formula proposta: XP_req(L) = round(base * L^exp)
- Parametri iniziali: base = 150, exp = 1.45
- Esempi: L2 ≈ 410 XP, L3 ≈ 953 XP, L4 ≈ 1650 XP. Questi valori vanno calibrati con playtest ma forniscono crescita lenta verso il cap.

Respec (regole):
- Costo: un respec retrocede il personaggio di 1 livello.
- Meccanica: sottrarre dall'XP totale la quantità richiesta per salire dal livello corrente al successivo (XP_req(currentLevel→nextLevel)). Non si può retrocedere di più di un livello per respec. Respec non cancella abilità apprese ma può temporaneamente disabilitarle se i nuovi requisiti non sono soddisfatti.
- Limitazioni: proibire respec al livello 1; prevedere cooldown su respec ripetuti o costi aggiuntivi in futuro per prevenire abuse.

Avanzamento classe (class change to advanced classes):
- Requisiti: livello minimo 10 + completamento di una quest specifica + superamento di un "trial"/esame.
- Trial: meccanica con fino a 3 tentativi; al terzo fallimento la quest deve essere ripetuta dall'inizio. Il trial può essere di tipo combattimento, puzzle, o skill check e può imporre costi/oggetti richiesti.
- Effetto: cambio di classe avanzata è definitivo; l'applicazione dei bonus statistici è immediata e abilita nuove skill/oggetti.

---

## Drop rules e anti‑farm

Tipi di drop:
- Guaranteed (boss/story drops) — oggetti fissi associati a nemici importanti.
- Random pool — pool di oggetti con probabilità (comuni/rare/epiche) per mob standard.
- Currency/resources — materiali e monete.

Misure anti‑farm:
- Boss lockout: drop rari legati a boss/story possono essere soggetti a lockout per account (es. 24–72h) per evitare farming massivo.
- Diminishing returns: probabilità di drop rari decresce se si ripete la stessa attività in window di tempo breve.
- Drop binding: alcuni oggetti possono diventare "bound on pickup" per limitare exploit via vendita immediata.
- Instance/respawn tuning: rendere aree farm intensive con respawn più lento o con meccaniche di istanzia separata.

Drop design:
- Nemici importanti: definire set di drop fissi X e pool casuale Y; il resto delle ricompense rimane casuale.

---

## Durabilità, rottura e riparazioni

- Per l'MVP gli oggetti non hanno un valore numerico di durabilità che scende per ogni uso. Tuttavia il game master/AI può causare rotture in eventi particolari (critici, scenari narrativi). Gli oggetti rotti possono essere riparati dai fabbri/artigiani con costi e tempi.
- Se si decide in futuro di introdurre durabilità numerica, definire percentuali di decadimento per uso e meccaniche di riparazione basate su materiali e mastery.

---

## Ledger, item UUID e anti‑manipolazione

- Ogni oggetto e ogni portafoglio ha un UUID univoco.
- Tenere un transaction ledger append‑only per tutte le operazioni rilevanti: transfer, create, destroy. Il ledger registra tx_id, timestamp, from, to, item_id, quantity e signature/nonce.
- Integrità: controlli periodici confrontano lo stato degli inventari con il ledger per rilevare duplicazioni di item_id o discrepanze monetarie.
- Azioni squilibrate (es. duplicazione di item_id o balzo sospetto di monete) generano alert automatici e possono congelare transazioni dell'account per indagine.

---

## Note implementative e testing

- Forza le regole nel backend: ogni modifica di inventario/equip dev'essere transazionale.
- Isolare i calcoli (CarryCapacity, Power, Regen, Initiative) in librerie/test unitari.
- Fornire endpoint diagnostics che restituiscono i roll e i calcoli per debugging e per il feed testuale dell'utente.

---

Questo file è pensato come single source of truth per i calcoli e le scelte di bilanciamento iniziali. Se vuoi, posso generare le migrazioni DB base e uno schema SQL per le tabelle `items`, `inventory`, `equipped_slots`, `mounts`, `skills`, `talents`, `professions`.
