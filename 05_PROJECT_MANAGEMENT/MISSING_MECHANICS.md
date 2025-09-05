# Meccaniche mancanti per MVP — Analisi e priorità

Data: 4 settembre 2025

## Executive Summary

L'analisi dei file esistenti rivela che abbiamo **meccaniche di base solide** (combat, character, inventory) ma mancano **sistemi di gameplay loop** critici per un MVP giocabile.

## Gap Analysis

### ✅ Già documentato (completo)
- Sistema di combattimento con formule matematiche
- Character creation e progression
- Equipment e inventory con peso realistico
- Currency e economy basics
- Skill trees e mastery
- Anti-cheat e security measures

### ⚠️ **MANCANTE CRITICO** (blocca MVP)

#### 1. Travel & World Exploration
**Problema**: Non possiamo giocare senza modo di esplorare il mondo
**Necessario**:
- Struttura world/locations con connections
- Travel mechanics (costi, tempo, limitazioni)
- Location discovery e unlock conditions

**Specifiche proposte**:
```
Location {
  id, name, type, level_requirement,
  connections: [{ to_location_id, travel_time, cost? }],
  spawns: [{ npc_type, probability, level_range }],
  resources: [{ type, respawn_time, quantity }],
  persistent_state: { discovered_by: [], events: [] }
}
```

#### 2. NPC Interaction System
**Problema**: Senza NPC non c'è content da consumare
**Necessario**:
- Vendor mechanics (buy/sell)
- Trainer mechanics (skill learning)
- Questgiver basics
- Combat encounters

**Specifiche proposte**:
```
NPC {
  id, name, type, location_id, level,
  dialogue_tree: { options: [], responses: [] },
  vendor_inventory?: { items: [], prices: [] },
  trainer_skills?: { skills: [], requirements: [] },
  combat_stats?: { hp, mp, stats, skills }
}
```

#### 3. Quest System (Basic)
**Problema**: Senza quest non c'è progression guidata
**Necessario**:
- Quest creation e tracking
- Objective types (kill, collect, talk, travel)
- Completion e rewards

**Specifiche proposte**:
```
Quest {
  id, name, description, level_requirement,
  objectives: [{ type, target, quantity, completed }],
  rewards: { xp, currency, items },
  prerequisites: { quests: [], items: [], level: n }
}
```

### 📋 **MANCANTE IMPORTANTE** (riduce experience)

#### 4. Time System
**Problema**: Autoplay e mechanics asincrone hanno bisogno di time progression
**Necessario**:
- Server time tracking
- Day/night cycles
- Cooldown globali
- Time-based events

#### 5. Loot & Drops
**Problema**: Combat senza rewards è vuoto
**Necessario**:
- Drop tables per NPC
- Loot generation rules
- Rare item mechanics

#### 6. Basic Crafting
**Problema**: Economy ha bisogno di item generation
**Necessario**:
- Recipe system
- Material gathering
- Crafting success rates

## Implementazione consigliata

### Settimana 1: World & Travel
```typescript
// Minimal world structure
interface Location {
  id: string;
  name: string;
  description: string;
  level_min: number;
  connections: LocationConnection[];
  npcs: NPC[];
}

interface LocationConnection {
  to_location: string;
  travel_time_minutes: number;
  cost_currency?: number;
  requirements?: string[]; // quest IDs or items
}
```

### Settimana 2: NPCs & Interaction
```typescript
interface NPC {
  id: string;
  name: string;
  type: 'vendor' | 'trainer' | 'questgiver' | 'enemy';
  level: number;
  location_id: string;
  dialogue?: DialogueNode[];
  shop_inventory?: ShopItem[];
  combat_stats?: CombatStats;
}
```

### Settimana 3: Quests & Content
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  level_min: number;
  objectives: QuestObjective[];
  rewards: QuestReward;
  status: 'available' | 'active' | 'completed';
}
```

## Content requirements (DATA)

Per un MVP giocabile servono **contenuti minimi**:

### Locations (almeno 5-8)
1. **Starting Town** — safe zone, vendors, trainers
2. **Forest Path** — level 1-3 enemies, basic resources
3. **Cave Entrance** — level 2-5 enemies, metal ores
4. **Riverside** — level 1-4 enemies, fishing/water resources
5. **Mountain Pass** — level 4-8 enemies, rare materials
6. **Ancient Ruins** — level 5-10, quest hub, boss encounters

### NPCs (almeno 15-20)
- **5 Vendors** (weapons, armor, potions, general goods, rare items)
- **4 Trainers** (one per base class)
- **3 Questgivers** (starter, mid-level, advanced)
- **8+ Enemies** (variety per location, different levels)

### Quests (almeno 8-12)
- **3 Tutorial quests** (movement, combat, inventory)
- **4 Kill quests** (eliminate X enemies)
- **2 Collection quests** (gather Y resources)
- **2 Delivery quests** (talk to NPC Z)
- **1 Boss quest** (major encounter)

### Items (almeno 30-50)
- **10 Weapons** (per class, levels 1-10)
- **15 Armor pieces** (head/chest/legs/boots/hands)
- **10 Consumables** (potions, food, tools)
- **10 Materials** (crafting components)
- **5 Quest items** (key items for progression)

## Timeline aggiornato

Con questi gap identificati, la stima per MVP diventa:

```
Settimana 1: Database + Auth + Character Creation (come prima)
Settimana 2: World/Travel + Basic NPCs (NUOVO)
Settimana 3: Quest System + Loot/Drops (NUOVO)
Settimana 4: Content Creation + UI + Polish (ESTESO)

Totale: 4 settimane MA con scope MVP più realistico
```

## Raccomandazioni immediate

1. **Priorità assoluta**: implementare Location/Travel system
2. **Secondo**: NPC framework con vendor/trainer/enemy
3. **Terzo**: Quest system linear (no branching per MVP)
4. **Content creation** in parallelo con sviluppo

## Note finali

Senza questi sistemi, il gioco sarebbe tecnicamente funzionante ma **non giocabile**. Le meccaniche esistenti (combat, inventory, character) sono solidissime, ma servono i "binding systems" che li collegano in un gameplay loop coerente.

La buona notizia è che possiamo implementare versioni **semplici** di questi sistemi per l'MVP e raffinarli iterativamente.
