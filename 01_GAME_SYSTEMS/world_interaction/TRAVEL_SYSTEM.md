# Travel System — Specifica completa

Data: 4 settembre 2025

## Overview

Il Travel System gestisce l'esplorazione del mondo di gioco, connettendo le location e definendo come i personaggi si muovono tra esse. Si integra con combat, inventory, quest e AI autoplay per creare un gameplay loop coerente.

## Architettura del mondo

### Struttura gerarchica
```
World
├── Continents (2-3 per il mondo)
│   ├── Regions (3-5 per continente)
│   │   ├── Zones (2-4 per regione)
│   │   │   └── Locations (5-10 per zona)
```

### Location Types
- **Town/City** — safe zone, vendors, trainers, respawn point
- **Wilderness** — open exploration, random encounters, resources
- **Dungeon** — instanced areas, boss fights, rare loot
- **Ruins** — puzzle areas, lore, hidden treasures
- **Crossroads** — hub locations, multiple connections
- **Outpost** — mini safe zones, basic services

## Core Mechanics

### Location Structure
```typescript
interface Location {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  level_range: { min: number; max: number };
  
  // Geografia e connessioni
  coordinates: { x: number; y: number; z?: number };
  connections: LocationConnection[];
  region_id: string;
  
  // Gameplay
  is_safe_zone: boolean;
  respawn_point: boolean;
  discovery_requirements?: string[]; // quest IDs, items, level
  
  // Content spawns
  npcs: NPCSpawn[];
  resource_nodes: ResourceNode[];
  random_encounters: EncounterTable[];
  
  // Persistent state
  persistent_data: LocationState;
  
  // Ambiente
  environment: EnvironmentData;
  weather_effects?: WeatherModifier[];
}
```

### Travel Connections
```typescript
interface LocationConnection {
  to_location_id: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'up' | 'down' | 'portal';
  
  // Costi e tempo
  travel_time_minutes: number;
  stamina_cost: number;
  currency_cost?: number;
  
  // Requisiti
  requirements?: TravelRequirement[];
  
  // Pericoli
  danger_level: number; // 0-10, influenza random encounters
  random_encounter_chance: number; // 0-1
  
  // Descrizione
  path_description: string;
  visible: boolean; // se il giocatore può vedere questa connessione
}

interface TravelRequirement {
  type: 'level' | 'quest' | 'item' | 'key' | 'skill' | 'alignment';
  value: string | number;
  operator?: '>=' | '=' | '<=' | 'has' | 'not_has';
}
```

## Travel Actions

### Movimento base
```typescript
// API endpoint: POST /api/characters/{id}/travel
interface TravelRequest {
  destination_id: string;
  travel_method?: 'walk' | 'run' | 'mount' | 'teleport';
  party_members?: string[]; // per travel di gruppo
}

interface TravelResponse {
  success: boolean;
  travel_time_seconds: number;
  stamina_consumed: number;
  currency_consumed?: number;
  random_events?: RandomEvent[];
  arrival_time: Date; // quando il personaggio arriverà
}
```

### Travel Methods

#### 1. Walking (default)
- **Tempo**: base time dalla connection
- **Stamina**: base cost dalla connection
- **Sicurezza**: chance normale di random encounters

#### 2. Running
- **Tempo**: -25% rispetto a walking
- **Stamina**: +75% rispetto a walking
- **Sicurezza**: +15% chance di random encounters (più rumore)
- **Requisito**: STA >= 12

#### 3. Mount Travel
- **Tempo**: -40% rispetto a walking
- **Stamina**: mount consuma invece del personaggio
- **Sicurezza**: chance normale di encounters
- **Capacity**: può trasportare più peso
- **Requisito**: mount equipaggiato e feed/rest sufficiente

#### 4. Teleport (rare)
- **Tempo**: istantaneo
- **Costo**: alto MP o special items
- **Sicurezza**: no random encounters
- **Limitazioni**: solo tra location specifiche (teleport circles)

## Formule di calcolo

### Travel Time Calculation
```typescript
function calculateTravelTime(
  base_time: number,
  character_stats: CharacterStats,
  travel_method: TravelMethod,
  carry_weight: number,
  weather: WeatherEffect
): number {
  let time_modifier = 1.0;
  
  // Method modifier
  switch (travel_method) {
    case 'run': time_modifier *= 0.75; break;
    case 'mount': time_modifier *= 0.6; break;
    case 'teleport': return 0;
  }
  
  // Weight penalty (from GAME_MECHANICS.md)
  const carry_capacity = calculateCarryCapacity(character_stats);
  if (carry_weight > carry_capacity) {
    time_modifier *= 1.25; // +25% tempo se overloaded
  }
  if (carry_weight > carry_capacity * 1.2) {
    time_modifier *= 1.5; // +50% tempo se heavily overloaded
  }
  
  // Weather effects
  time_modifier *= weather.travel_speed_modifier;
  
  // Agility bonus (small)
  const agility_bonus = 1 - (character_stats.DEX - 10) * 0.01; // -1% per point over 10
  time_modifier *= Math.max(0.7, agility_bonus); // cap al 30% bonus
  
  return Math.round(base_time * time_modifier);
}
```

### Stamina Cost Calculation
```typescript
function calculateStaminaCost(
  base_cost: number,
  travel_method: TravelMethod,
  character_stats: CharacterStats,
  terrain_difficulty: number
): number {
  let cost_modifier = 1.0;
  
  // Method modifier
  switch (travel_method) {
    case 'run': cost_modifier *= 1.75; break;
    case 'mount': return 0; // mount consuma invece
    case 'teleport': return 0;
  }
  
  // Terrain modifier
  cost_modifier *= terrain_difficulty; // 0.5 (strada) - 2.0 (montagna)
  
  // Stamina efficiency
  const sta_efficiency = 1 - (character_stats.STA - 10) * 0.02; // -2% per point over 10
  cost_modifier *= Math.max(0.5, sta_efficiency); // cap al 50% riduzione
  
  return Math.round(base_cost * cost_modifier);
}
```

## Random Encounters

### Encounter System
```typescript
interface EncounterTable {
  biome: string; // forest, mountain, desert, etc.
  level_range: { min: number; max: number };
  encounters: EncounterEntry[];
}

interface EncounterEntry {
  weight: number; // probabilità relativa
  type: 'combat' | 'event' | 'discovery' | 'merchant' | 'nothing';
  content: EncounterContent;
  level_scaling: boolean;
}

interface EncounterContent {
  // Per combat
  enemies?: NPCSpawn[];
  
  // Per event
  event_text?: string;
  choices?: EventChoice[];
  
  // Per discovery
  items?: ItemDrop[];
  xp_reward?: number;
  
  // Per merchant
  merchant_inventory?: ShopItem[];
}
```

### Encounter Resolution
1. **Trigger check**: roll contro encounter chance della connection
2. **Table selection**: scegli table basata su location type e level
3. **Encounter roll**: weighted random da encounter table
4. **Level scaling**: adatta content al livello del party
5. **Resolution**: esegui combat/event/discovery
6. **Continue travel**: se non interrotto, prosegui viaggio

## Discovery System

### Location Discovery
```typescript
interface DiscoveryRule {
  location_id: string;
  trigger_type: 'proximity' | 'quest' | 'item' | 'random' | 'npc_hint';
  trigger_condition: any;
  discovery_text: string;
  xp_reward: number;
}
```

### Discovery Types
- **Proximity**: scopri location vicine durante travel
- **Quest**: location sbloccate da quest completion
- **Item**: location accessibili con key items
- **Random**: chance di scoprire durante exploration
- **NPC Hint**: location rivelate da dialoghi NPC

## Party Travel

### Group Movement
- **Leader**: un party member designato sceglie destination
- **Consensus**: tutti i membri devono accettare (timeout 60s)
- **Speed**: party si muove alla velocità del membro più lento
- **Stamina**: ogni membro paga il proprio costo
- **Encounters**: il party affronta insieme random encounters

### Party Benefits
- **Safety**: +2 membri = -15% encounter chance
- **Exploration**: +50% discovery chance con party size 3+
- **Efficiency**: shared mount capacity se qualcuno ha mount

## Integration con AI Autoplay

### Autonomous Travel
```typescript
interface AutoTravelStrategy {
  preferred_destinations: string[]; // priority list
  avoid_high_danger: boolean;
  stamina_threshold: number; // stop travel se STA < threshold
  carry_weight_limit: number; // non travel se overloaded oltre limit
  encounter_strategy: 'fight' | 'flee' | 'smart'; // come gestire encounters
}
```

### AI Decision Making
1. **Valuta destination**: controlla requirements e safety
2. **Calcola costi**: stamina, time, currency necessari
3. **Risk assessment**: evalua danger level vs character power
4. **Execute travel**: con fallback se conditions cambiano
5. **Handle encounters**: secondo strategy del giocatore

## Environment & Weather

### Weather Effects
```typescript
interface WeatherEffect {
  type: 'clear' | 'rain' | 'storm' | 'fog' | 'snow' | 'heat';
  travel_speed_modifier: number; // 0.5 - 1.5
  stamina_cost_modifier: number;
  visibility_modifier: number; // influenza discovery
  encounter_modifier: number; // alcuni nemici preferiscono certe weather
  duration_hours: number;
}
```

### Environmental Hazards
- **Desert**: heat damage se non preparati, mirages (false discoveries)
- **Mountains**: altitude sickness, avalanche risk, cold damage
- **Swamp**: disease risk, slow movement, poison gas pockets
- **Ocean**: storm risk, navigation difficulty, sea monsters

## Implementation Details

### Database Schema
```sql
-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  level_min INTEGER DEFAULT 1,
  level_max INTEGER DEFAULT 50,
  coordinates_x FLOAT,
  coordinates_y FLOAT,
  is_safe_zone BOOLEAN DEFAULT FALSE,
  respawn_point BOOLEAN DEFAULT FALSE,
  region_id UUID REFERENCES regions(id),
  environment_data JSONB,
  persistent_state JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Connections table
CREATE TABLE location_connections (
  id UUID PRIMARY KEY,
  from_location_id UUID REFERENCES locations(id),
  to_location_id UUID REFERENCES locations(id),
  direction VARCHAR(20),
  travel_time_minutes INTEGER NOT NULL,
  stamina_cost INTEGER DEFAULT 10,
  currency_cost INTEGER DEFAULT 0,
  danger_level INTEGER DEFAULT 1,
  encounter_chance FLOAT DEFAULT 0.1,
  requirements JSONB DEFAULT '[]',
  path_description TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Character travel state
CREATE TABLE character_travel (
  character_id UUID PRIMARY KEY REFERENCES characters(id),
  current_location_id UUID REFERENCES locations(id),
  destination_location_id UUID REFERENCES locations(id),
  travel_start_time TIMESTAMP,
  travel_end_time TIMESTAMP,
  travel_method VARCHAR(20) DEFAULT 'walk',
  party_id UUID REFERENCES parties(id),
  auto_travel_strategy JSONB,
  discovered_locations UUID[] DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discovery tracking
CREATE TABLE location_discoveries (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  location_id UUID REFERENCES locations(id),
  discovered_at TIMESTAMP DEFAULT NOW(),
  discovery_method VARCHAR(20), -- proximity, quest, item, random, npc
  xp_awarded INTEGER DEFAULT 0,
  UNIQUE(character_id, location_id)
);
```

### API Endpoints
```typescript
// Get current location and available connections
GET /api/characters/{id}/location
Response: {
  current_location: Location,
  connections: LocationConnection[],
  party_members_here: CharacterSummary[],
  travel_status?: TravelStatus
}

// Start travel
POST /api/characters/{id}/travel
Body: TravelRequest
Response: TravelResponse

// Get travel status (se in viaggio)
GET /api/characters/{id}/travel/status
Response: {
  traveling: boolean,
  destination?: Location,
  time_remaining_seconds?: number,
  can_cancel: boolean
}

// Cancel travel (se possibile)
DELETE /api/characters/{id}/travel
Response: { success: boolean, refund?: ResourceRefund }

// Get discovered locations
GET /api/characters/{id}/discoveries
Response: {
  discovered_locations: Location[],
  total_discoveries: number,
  exploration_percentage: number
}

// Set auto-travel strategy per AI
PUT /api/characters/{id}/auto-travel
Body: AutoTravelStrategy
Response: { success: boolean }
```

## Content Examples

### Starting World Structure
```
Aethermoor Continent
├── Greenlands Region
│   ├── Heartwood Zone
│   │   ├── Millhaven (Town) — starter safe zone
│   │   ├── Farmer's Fields (Wilderness) — level 1-3
│   │   ├── Old Mill Ruins (Ruins) — level 2-4, quest location
│   │   └── Whispering Woods (Wilderness) — level 3-6
│   └── Ironpeak Zone
│       ├── Ironpeak Outpost (Outpost) — mid-level hub
│       ├── Crystal Caves (Dungeon) — level 8-12
│       └── Dragon's Rest (Ruins) — level 15+, boss area
└── Shadowlands Region
    └── Darkwood Zone
        ├── Raven's Hollow (Town) — PvP enabled
        ├── Cursed Marshes (Wilderness) — level 10-15
        └── Necropolis (Dungeon) — endgame content
```

### Example Connections
```
Millhaven → Farmer's Fields
- Direction: north
- Time: 15 minutes
- Stamina: 5
- Danger: 1, Encounter chance: 5%
- Description: "A well-trodden dirt path leads through golden wheat fields."

Farmer's Fields → Whispering Woods
- Direction: west
- Time: 25 minutes
- Stamina: 8
- Danger: 3, Encounter chance: 15%
- Requirements: [{ type: 'level', value: 3, operator: '>=' }]
- Description: "A narrow trail disappears into the shadowy treeline."
```

## Balance Considerations

### Travel Time vs. Engagement
- **Short distances**: 5-15 minuti di real time
- **Medium distances**: 15-45 minuti
- **Long distances**: 1-3 ore (per strategic planning)
- **Cross-continent**: 4-8 ore (major expedition)

### Encounter Frequency
- **Low danger (1-2)**: 5-15% chance
- **Medium danger (3-5)**: 15-30% chance
- **High danger (6-8)**: 30-50% chance
- **Extreme danger (9-10)**: 50-75% chance

### Resource Costs
- **Stamina**: sempre richiesta, regen durante riposo
- **Currency**: solo per special transport (carriage, ship, teleport)
- **Items**: consumabili per harsh environments

## Future Expansions

### Advanced Features (post-MVP)
- **Fast Travel**: network di teleport circles da sbloccare
- **Mounts**: diverse creature con stats e abilities uniche
- **Vehicles**: navi, carriage, airship per group travel
- **Territory Control**: guild possono controllare locations
- **Dynamic Events**: invasioni, caravane, seasonal changes
- **Weather Cycles**: sistema meteorologico complesso
- **Navigation Skills**: abilità per ridurre travel costs

### Integration Opportunities
- **Crafting**: materiali diversi per biome/location
- **Trading**: arbitrage tra mercati di locations diverse
- **Reputation**: standing con settlements influenza services
- **Housing**: player-owned locations come fast travel points

---

Questo travel system fornisce un framework completo per l'esplorazione del mondo, bilanciando realismo e gameplay. È progettato per integrarsi seamlessly con combat, character progression, AI autoplay e tutti gli altri sistemi esistenti.

Il sistema supporta sia gameplay manuale che automatico, permettendo ai giocatori di esplorare attivamente o di delegare travel routine alla loro AI mentre si concentrano su strategie di alto livello.
