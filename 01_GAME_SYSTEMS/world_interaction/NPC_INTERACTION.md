# NPC Interaction System — Specifica completa

Data: 4 settembre 2025

## Overview

Il sistema di interazione NPC gestisce tutti i personaggi non giocanti: vendor, trainer, questgiver, nemici e NPC narrativi. Si integra con combat, inventory, character progression, quest system e AI autoplay per creare un ecosistema vivente.

## Architettura NPC

### NPC Base Structure
```typescript
interface NPC {
  id: string;
  name: string;
  description: string;
  type: NPCType;
  level: number;
  
  // Posizionamento
  location_id: string;
  spawn_type: 'static' | 'roaming' | 'event' | 'random';
  respawn_info?: RespawnInfo;
  
  // Appearance e lore
  appearance: string;
  personality: string;
  backstory?: string;
  faction_id?: string;
  
  // Interactions
  interaction_types: InteractionType[];
  dialogue_tree?: DialogueTree;
  
  // Type-specific data
  vendor_data?: VendorData;
  trainer_data?: TrainerData;
  questgiver_data?: QuestgiverData;
  combat_data?: CombatData;
  
  // Stato dinamico
  current_state: NPCState;
  reputation_requirements?: ReputationRequirement[];
  
  // AI behavior
  behavior_pattern: BehaviorPattern;
  schedule?: NPCSchedule;
}

enum NPCType {
  VENDOR = 'vendor',
  TRAINER = 'trainer', 
  QUESTGIVER = 'questgiver',
  ENEMY = 'enemy',
  NEUTRAL = 'neutral',
  GUARD = 'guard',
  MERCHANT_TRAVELER = 'merchant_traveler',
  LOREKEEPER = 'lorekeeper'
}

enum InteractionType {
  TALK = 'talk',
  TRADE = 'trade',
  TRAIN = 'train',
  QUEST = 'quest',
  ATTACK = 'attack',
  PICKPOCKET = 'pickpocket',
  BRIBE = 'bribe'
}
```

### NPC State Management
```typescript
interface NPCState {
  current_hp: number;
  current_mp: number;
  mood: 'friendly' | 'neutral' | 'hostile' | 'afraid' | 'angry';
  busy_until?: Date; // se impegnato in task
  
  // Dynamic inventory (per vendors/enemies)
  current_inventory?: InventoryItem[];
  currency: CurrencyAmount;
  
  // Reputation tracking
  player_relationships: Record<string, PlayerRelationship>; // player_id -> relationship
  
  // Spawn/respawn state
  spawn_time: Date;
  death_time?: Date;
  next_respawn?: Date;
  
  // Location tracking (per roaming NPCs)
  current_coordinates?: { x: number; y: number };
  destination?: string;
  path?: string[]; // location IDs per roaming
}

interface PlayerRelationship {
  reputation: number; // -100 a +100
  last_interaction: Date;
  interaction_count: number;
  notes: string[]; // eventi significativi
}
```

## Vendor System

### Vendor Configuration
```typescript
interface VendorData {
  shop_name: string;
  shop_type: 'general' | 'weapons' | 'armor' | 'potions' | 'materials' | 'rare' | 'books';
  
  // Inventory management
  base_inventory: ShopItem[];
  restocking_schedule: RestockingRule[];
  currency_accepted: CurrencyType[];
  
  // Pricing
  buy_rate_modifier: number; // moltiplicatore per comprare da player (0.3-0.7)
  sell_rate_modifier: number; // moltiplicatore per vendere a player (1.0-2.0)
  reputation_discount: ReputationDiscount[];
  
  // Specialties
  rare_items_table?: LootTable;
  rare_item_chance: number;
  rare_item_refresh_hours: number;
  
  // Limits
  max_transaction_value: number;
  daily_transaction_limit?: number;
  item_quantity_limits: Record<string, number>; // item_id -> max quantity
}

interface ShopItem {
  item_id: string;
  base_price: number;
  current_stock: number;
  max_stock: number;
  restock_rate: number; // items per hour
  availability_conditions?: AvailabilityCondition[];
}

interface RestockingRule {
  trigger: 'time' | 'sold_percentage' | 'player_level' | 'event';
  condition: any;
  restock_items: string[]; // item IDs da restockare
  restock_quantities: number[];
}
```

### Trading Mechanics
```typescript
// Trade transaction flow
interface TradeTransaction {
  player_id: string;
  npc_id: string;
  type: 'buy' | 'sell';
  items: TradeItem[];
  total_cost: CurrencyAmount;
  reputation_modifier: number;
  timestamp: Date;
}

interface TradeItem {
  item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Pricing formula
function calculateItemPrice(
  base_price: number,
  vendor_data: VendorData,
  player_reputation: number,
  market_conditions: MarketConditions,
  transaction_type: 'buy' | 'sell'
): number {
  let price = base_price;
  
  // Vendor modifier
  if (transaction_type === 'buy') {
    price *= vendor_data.sell_rate_modifier;
  } else {
    price *= vendor_data.buy_rate_modifier;
  }
  
  // Reputation discount
  const rep_discount = getReputationDiscount(player_reputation, vendor_data.reputation_discount);
  price *= (1 - rep_discount);
  
  // Market conditions (supply/demand)
  price *= market_conditions.price_modifier;
  
  // Random variation (±5%)
  price *= (0.95 + Math.random() * 0.1);
  
  return Math.round(price);
}
```

## Trainer System

### Trainer Configuration
```typescript
interface TrainerData {
  specialization: string; // "Warrior Combat", "Fire Magic", "Stealth Arts"
  trainer_level: number; // massimo livello che può insegnare
  
  // Skills available
  available_skills: TrainerSkill[];
  class_advancement: ClassAdvancement[];
  
  // Requirements
  reputation_required: number;
  payment_required: boolean;
  trial_required: boolean;
  
  // Training limits
  max_students_per_day: number;
  current_students_today: number;
  training_cooldown_hours: number;
}

interface TrainerSkill {
  skill_id: string;
  max_level_teachable: number;
  requirements: SkillRequirement[];
  base_cost: CurrencyAmount;
  training_time_hours: number;
  success_rate_base: number; // 0.5-1.0
}

interface ClassAdvancement {
  from_class: string;
  to_class: string;
  requirements: AdvancementRequirement[];
  trial_type: 'combat' | 'knowledge' | 'practical' | 'quest';
  trial_data: TrialData;
}

interface TrialData {
  description: string;
  attempts_allowed: number;
  failure_consequence: string;
  success_reward?: string;
  
  // Combat trial
  enemies?: NPCSpawn[];
  win_condition: string;
  
  // Knowledge trial  
  questions?: QuestionSet;
  passing_score: number;
  
  // Practical trial
  tasks?: PracticalTask[];
  time_limit_minutes?: number;
}
```

### Training Process
```typescript
// Training flow
interface TrainingSession {
  id: string;
  player_id: string;
  trainer_id: string;
  skill_id: string;
  target_level: number;
  
  cost_paid: CurrencyAmount;
  start_time: Date;
  duration_hours: number;
  completion_time: Date;
  
  success_probability: number;
  result?: 'success' | 'partial' | 'failure';
  xp_gained?: number;
  
  can_retry: boolean;
  next_retry_time?: Date;
}

// Success calculation
function calculateTrainingSuccess(
  player_stats: CharacterStats,
  trainer_data: TrainerData,
  skill_data: TrainerSkill,
  player_reputation: number
): number {
  let success_rate = skill_data.success_rate_base;
  
  // Player intelligence bonus
  success_rate += (player_stats.INT - 10) * 0.02;
  
  // Trainer skill bonus
  success_rate += (trainer_data.trainer_level - skill_data.max_level_teachable) * 0.05;
  
  // Reputation bonus
  success_rate += Math.max(0, player_reputation - 50) * 0.001;
  
  // Cap between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, success_rate));
}
```

## Questgiver System

### Questgiver Configuration
```typescript
interface QuestgiverData {
  quest_line: string; // "Village Problems", "Ancient Mysteries"
  available_quests: QuestOffer[];
  completed_quests_tracking: Record<string, Date>; // player_id -> completion time
  
  // Quest generation
  dynamic_quest_pool?: DynamicQuestPool;
  refresh_interval_hours: number;
  max_concurrent_quests_per_player: number;
  
  // Requirements
  minimum_reputation: number;
  prerequisite_quests?: string[];
  level_requirements?: LevelRequirement;
}

interface QuestOffer {
  quest_id: string;
  title: string;
  description: string;
  difficulty: 'trivial' | 'easy' | 'normal' | 'hard' | 'epic';
  
  // Availability
  level_range: { min: number; max: number };
  prerequisites: QuestPrerequisite[];
  available_until?: Date; // time-limited quests
  
  // Rewards preview
  xp_reward: number;
  currency_reward: CurrencyAmount;
  item_rewards: ItemReward[];
  reputation_reward: number;
  
  // Quest data
  objectives: QuestObjective[];
  time_limit?: number; // hours
  can_abandon: boolean;
}

interface DynamicQuestPool {
  templates: QuestTemplate[];
  generation_rules: GenerationRule[];
  reward_scaling: RewardScaling;
}
```

## Dialogue System

### Dialogue Structure
```typescript
interface DialogueTree {
  root_node_id: string;
  nodes: Record<string, DialogueNode>;
  variables: Record<string, any>; // per conditional dialogue
}

interface DialogueNode {
  id: string;
  speaker: 'npc' | 'player';
  text: string;
  
  // Conditions per mostrare questo node
  conditions?: DialogueCondition[];
  
  // Effects when this node is selected
  effects?: DialogueEffect[];
  
  // Possible responses
  options: DialogueOption[];
  
  // Auto-continue senza player input
  auto_continue?: boolean;
  delay_seconds?: number;
}

interface DialogueOption {
  id: string;
  text: string;
  next_node_id?: string; // null = end dialogue
  
  // Requirements per mostrare questa opzione
  requirements?: DialogueRequirement[];
  
  // Costs per scegliere questa opzione
  costs?: DialogueCost[];
  
  // Visual styling
  style?: 'normal' | 'aggressive' | 'diplomatic' | 'sneaky' | 'magical';
}

interface DialogueCondition {
  type: 'stat' | 'item' | 'quest' | 'reputation' | 'variable' | 'time' | 'random';
  target: string;
  operator: '>=' | '=' | '<=' | 'has' | 'not_has' | 'completed';
  value: any;
}

interface DialogueEffect {
  type: 'reputation' | 'item' | 'currency' | 'variable' | 'quest' | 'combat' | 'teleport';
  target: string;
  value: any;
  message?: string; // feedback per player
}
```

### Dialogue Processing
```typescript
// Dialogue session management
interface DialogueSession {
  id: string;
  player_id: string;
  npc_id: string;
  current_node_id: string;
  start_time: Date;
  variables: Record<string, any>;
  history: DialogueHistoryEntry[];
}

interface DialogueHistoryEntry {
  node_id: string;
  option_selected?: string;
  timestamp: Date;
  effects_applied: DialogueEffect[];
}

// Dialogue evaluation
function evaluateDialogueConditions(
  conditions: DialogueCondition[],
  player: Character,
  npc: NPC,
  session: DialogueSession
): boolean {
  return conditions.every(condition => {
    switch (condition.type) {
      case 'stat':
        return player.stats[condition.target] >= condition.value;
      case 'item':
        return player.inventory.hasItem(condition.target, condition.value);
      case 'reputation':
        return npc.current_state.player_relationships[player.id]?.reputation >= condition.value;
      case 'variable':
        return session.variables[condition.target] === condition.value;
      // ... altri tipi
      default:
        return true;
    }
  });
}
```

## Combat NPCs

### Enemy Configuration
```typescript
interface CombatData {
  // Stats (usa stesso sistema del player da COMBAT_SYSTEM.md)
  stats: CharacterStats;
  level: number;
  
  // HP/MP (usa stesse formule)
  max_hp: number;
  max_mp: number;
  current_hp: number;
  current_mp: number;
  
  // Combat behavior
  ai_type: 'aggressive' | 'defensive' | 'balanced' | 'coward' | 'berserker' | 'caster';
  preferred_skills: string[];
  flee_threshold: number; // % HP per tentare fuga
  
  // Loot
  death_loot_table: LootTable;
  currency_drop: CurrencyDrop;
  xp_reward: number;
  
  // Special mechanics
  immunities: DamageType[];
  resistances: Record<DamageType, number>; // damage reduction %
  special_abilities: SpecialAbility[];
  
  // Aggro mechanics
  aggro_range: number; // metri
  aggro_conditions: AggroCondition[];
  deaggro_time: number; // secondi
}

interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  trigger: 'hp_threshold' | 'turn_count' | 'random' | 'player_action';
  trigger_value: any;
  cooldown_turns: number;
  effect: AbilityEffect;
}

// Combat AI decision making
function selectEnemyAction(
  enemy: NPC,
  combat_state: CombatState,
  available_actions: CombatAction[]
): CombatAction {
  const ai_type = enemy.combat_data.ai_type;
  const hp_percentage = enemy.combat_data.current_hp / enemy.combat_data.max_hp;
  
  // Check flee condition
  if (hp_percentage <= enemy.combat_data.flee_threshold) {
    return { type: 'flee', target: null };
  }
  
  // AI behavior patterns
  switch (ai_type) {
    case 'aggressive':
      return selectHighestDamageAction(available_actions);
    case 'defensive':
      return hp_percentage < 0.5 ? selectHealingAction(available_actions) : selectBalancedAction(available_actions);
    case 'caster':
      return selectMagicalAction(available_actions, enemy.combat_data.current_mp);
    default:
      return selectBalancedAction(available_actions);
  }
}
```

## NPC Spawning & Lifecycle

### Spawn Management
```typescript
interface NPCSpawnPoint {
  id: string;
  location_id: string;
  coordinates: { x: number; y: number };
  spawn_rules: SpawnRule[];
  max_npcs: number;
  current_npcs: string[]; // NPC IDs currently spawned
}

interface SpawnRule {
  npc_template_id: string;
  spawn_chance: number;
  spawn_conditions: SpawnCondition[];
  respawn_time_minutes: number;
  max_instances: number;
  level_scaling?: LevelScaling;
}

interface SpawnCondition {
  type: 'time' | 'weather' | 'player_count' | 'event' | 'level_range';
  value: any;
}

// Spawning logic
function processNPCSpawns(location: Location, current_time: Date): NPCSpawnResult[] {
  const results: NPCSpawnResult[] = [];
  
  for (const spawn_point of location.spawn_points) {
    if (spawn_point.current_npcs.length >= spawn_point.max_npcs) continue;
    
    for (const rule of spawn_point.spawn_rules) {
      if (Math.random() < rule.spawn_chance && 
          evaluateSpawnConditions(rule.spawn_conditions, location, current_time)) {
        
        const npc = createNPCFromTemplate(rule.npc_template_id, spawn_point.coordinates);
        results.push({
          spawn_point_id: spawn_point.id,
          npc: npc,
          spawn_time: current_time
        });
      }
    }
  }
  
  return results;
}
```

### NPC Lifecycle Events
```typescript
interface NPCLifecycleEvent {
  type: 'spawn' | 'death' | 'respawn' | 'move' | 'interaction' | 'state_change';
  npc_id: string;
  timestamp: Date;
  data: any;
  triggered_by?: string; // player ID se causato da player
}

// Event handlers
function handleNPCDeath(npc: NPC, killer?: Character): void {
  // Drop loot
  if (npc.combat_data) {
    const loot = generateLoot(npc.combat_data.death_loot_table, killer?.level || 1);
    spawnLootAtLocation(loot, npc.location_id);
    
    // Award XP
    if (killer) {
      awardXP(killer, npc.combat_data.xp_reward);
    }
  }
  
  // Schedule respawn
  if (npc.respawn_info) {
    scheduleNPCRespawn(npc, npc.respawn_info.respawn_time_minutes);
  }
  
  // Update relationships (se killed da player)
  if (killer) {
    updateNPCRelationships(npc, killer, 'killed');
  }
  
  // Log event
  logNPCEvent({
    type: 'death',
    npc_id: npc.id,
    timestamp: new Date(),
    triggered_by: killer?.id
  });
}
```

## Integration con AI Autoplay

### AI NPC Interaction Strategy
```typescript
interface NPCInteractionStrategy {
  // Trading preferences
  auto_trade_enabled: boolean;
  buy_list: string[]; // item IDs da comprare automaticamente
  sell_list: string[]; // item IDs da vendere automaticamente
  max_spend_per_transaction: number;
  
  // Training preferences  
  auto_training_enabled: boolean;
  priority_skills: string[];
  max_training_cost: number;
  
  // Quest preferences
  auto_quest_enabled: boolean;
  difficulty_preference: 'easy' | 'normal' | 'hard';
  quest_types: string[]; // 'kill', 'collect', 'deliver', etc.
  
  // Combat preferences
  engage_enemies: boolean;
  flee_threshold: number;
  target_level_range: { min: number; max: number };
  
  // Social preferences
  reputation_targets: Record<string, number>; // npc_id -> target reputation
  dialogue_style: 'diplomatic' | 'aggressive' | 'neutral';
}

// AI decision making per NPC interactions
function makeAIInteractionDecision(
  character: Character,
  npc: NPC,
  strategy: NPCInteractionStrategy,
  context: InteractionContext
): InteractionDecision {
  
  if (npc.type === 'vendor' && strategy.auto_trade_enabled) {
    return evaluateTradeOpportunity(character, npc, strategy);
  }
  
  if (npc.type === 'trainer' && strategy.auto_training_enabled) {
    return evaluateTrainingOpportunity(character, npc, strategy);
  }
  
  if (npc.type === 'questgiver' && strategy.auto_quest_enabled) {
    return evaluateQuestOpportunity(character, npc, strategy);
  }
  
  if (npc.type === 'enemy' && strategy.engage_enemies) {
    return evaluateCombatOpportunity(character, npc, strategy);
  }
  
  return { action: 'ignore', reason: 'no strategy match' };
}
```

## Database Schema

```sql
-- NPCs base table
CREATE TABLE npcs (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  level INTEGER DEFAULT 1,
  location_id UUID REFERENCES locations(id),
  spawn_type VARCHAR(20) DEFAULT 'static',
  
  appearance TEXT,
  personality TEXT,
  backstory TEXT,
  faction_id UUID REFERENCES factions(id),
  
  interaction_types VARCHAR(20)[] DEFAULT '{}',
  
  -- Type-specific data (JSON for flexibility)
  vendor_data JSONB,
  trainer_data JSONB,
  questgiver_data JSONB,
  combat_data JSONB,
  
  -- Behavior
  behavior_pattern JSONB DEFAULT '{}',
  schedule JSONB,
  
  -- State
  current_state JSONB DEFAULT '{}',
  reputation_requirements JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dialogue trees
CREATE TABLE dialogue_trees (
  id UUID PRIMARY KEY,
  npc_id UUID REFERENCES npcs(id),
  name VARCHAR(100),
  root_node_id UUID,
  nodes JSONB NOT NULL,
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player-NPC relationships
CREATE TABLE player_npc_relationships (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  npc_id UUID REFERENCES npcs(id),
  reputation INTEGER DEFAULT 0,
  last_interaction TIMESTAMP,
  interaction_count INTEGER DEFAULT 0,
  notes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, npc_id)
);

-- NPC spawn points
CREATE TABLE npc_spawn_points (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  coordinates JSONB NOT NULL,
  spawn_rules JSONB NOT NULL,
  max_npcs INTEGER DEFAULT 1,
  current_npcs UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dialogue sessions (active conversations)
CREATE TABLE dialogue_sessions (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  npc_id UUID REFERENCES npcs(id),
  current_node_id UUID,
  start_time TIMESTAMP DEFAULT NOW(),
  variables JSONB DEFAULT '{}',
  history JSONB DEFAULT '[]',
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Trade transactions
CREATE TABLE trade_transactions (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  npc_id UUID REFERENCES npcs(id),
  transaction_type VARCHAR(10) NOT NULL, -- 'buy' or 'sell'
  items JSONB NOT NULL,
  total_cost JSONB NOT NULL, -- currency amounts
  reputation_change INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Training sessions
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  trainer_id UUID REFERENCES npcs(id),
  skill_id VARCHAR(50) NOT NULL,
  target_level INTEGER NOT NULL,
  cost_paid JSONB NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  duration_hours INTEGER NOT NULL,
  completion_time TIMESTAMP NOT NULL,
  success_probability FLOAT NOT NULL,
  result VARCHAR(20), -- 'success', 'partial', 'failure'
  xp_gained INTEGER DEFAULT 0,
  can_retry BOOLEAN DEFAULT TRUE,
  next_retry_time TIMESTAMP
);

-- NPC lifecycle events log
CREATE TABLE npc_events (
  id UUID PRIMARY KEY,
  npc_id UUID REFERENCES npcs(id),
  event_type VARCHAR(20) NOT NULL,
  event_data JSONB DEFAULT '{}',
  triggered_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_npcs_location ON npcs(location_id);
CREATE INDEX idx_npcs_type ON npcs(type);
CREATE INDEX idx_player_npc_rel_player ON player_npc_relationships(player_id);
CREATE INDEX idx_dialogue_sessions_player ON dialogue_sessions(player_id);
CREATE INDEX idx_trade_transactions_player ON trade_transactions(player_id);
CREATE INDEX idx_training_sessions_player ON training_sessions(player_id);
CREATE INDEX idx_npc_events_npc ON npc_events(npc_id);
CREATE INDEX idx_npc_events_time ON npc_events(created_at);
```

## API Endpoints

```typescript
// Get NPCs in current location
GET /api/locations/{location_id}/npcs
Response: {
  npcs: NPCSummary[],
  total_count: number
}

// Get detailed NPC info
GET /api/npcs/{npc_id}
Response: {
  npc: NPC,
  available_interactions: InteractionType[],
  player_relationship?: PlayerRelationship,
  current_dialogue_session?: DialogueSession
}

// Start dialogue
POST /api/npcs/{npc_id}/dialogue
Response: {
  session_id: string,
  current_node: DialogueNode,
  available_options: DialogueOption[]
}

// Continue dialogue
POST /api/dialogue/{session_id}/respond
Body: { option_id: string }
Response: {
  next_node?: DialogueNode,
  available_options: DialogueOption[],
  dialogue_ended: boolean,
  effects_applied: DialogueEffect[]
}

// Trade with vendor
POST /api/npcs/{npc_id}/trade
Body: { action: 'buy' | 'sell', items: TradeItem[] }
Response: {
  success: boolean,
  transaction: TradeTransaction,
  new_inventory: InventoryItem[],
  new_currency: CurrencyAmount,
  reputation_change: number
}

// Get vendor inventory
GET /api/npcs/{npc_id}/shop
Response: {
  shop_info: VendorData,
  available_items: ShopItem[],
  player_discounts: ReputationDiscount[]
}

// Start training
POST /api/npcs/{npc_id}/train
Body: { skill_id: string, target_level: number }
Response: {
  training_session: TrainingSession,
  success_probability: number,
  completion_time: Date
}

// Get training status
GET /api/training/{session_id}
Response: {
  session: TrainingSession,
  time_remaining: number,
  can_cancel: boolean
}

// Attack NPC (start combat)
POST /api/npcs/{npc_id}/attack
Response: {
  combat_session_id: string,
  initial_state: CombatState,
  first_turn: CombatTurn
}

// Set AI interaction strategy
PUT /api/characters/{character_id}/npc-strategy
Body: NPCInteractionStrategy
Response: { success: boolean }
```

## Content Examples

### Starting Town NPCs

#### Merchant Guildmaster (Vendor)
```json
{
  "name": "Aldric Goldweaver",
  "type": "vendor",
  "level": 15,
  "description": "A portly man with keen eyes and calloused hands from years of appraising goods.",
  "vendor_data": {
    "shop_name": "Goldweaver's General Goods",
    "shop_type": "general",
    "buy_rate_modifier": 0.4,
    "sell_rate_modifier": 1.2,
    "base_inventory": [
      { "item_id": "basic_sword", "base_price": 50, "max_stock": 3 },
      { "item_id": "health_potion", "base_price": 15, "max_stock": 10 },
      { "item_id": "travel_rations", "base_price": 5, "max_stock": 20 }
    ]
  }
}
```

#### Combat Trainer (Trainer)
```json
{
  "name": "Captain Theron",
  "type": "trainer",
  "level": 25,
  "description": "A grizzled veteran with scars telling tales of countless battles.",
  "trainer_data": {
    "specialization": "Warrior Combat",
    "available_skills": [
      {
        "skill_id": "power_strike",
        "max_level_teachable": 5,
        "base_cost": { "gold": 100 },
        "requirements": [{ "type": "stat", "stat": "STR", "value": 15 }]
      }
    ]
  }
}
```

#### Village Elder (Questgiver)
```json
{
  "name": "Elder Miriam",
  "type": "questgiver", 
  "level": 8,
  "description": "An elderly woman with wise eyes and a warm smile.",
  "questgiver_data": {
    "quest_line": "Village Problems",
    "available_quests": [
      {
        "quest_id": "rat_problem",
        "title": "The Cellar Rats",
        "description": "Giant rats have infested the village cellars. Clear them out.",
        "difficulty": "easy",
        "level_range": { "min": 1, "max": 5 }
      }
    ]
  }
}
```

## Balance Considerations

### Reputation System
- **Range**: -100 (hated) a +100 (revered)
- **Starting**: 0 (neutral) con tutti gli NPC
- **Daily decay**: -1 punto se non interagisci per 7+ giorni
- **Benefits**: 
  - +50 reputation = 10% discount
  - +75 reputation = 15% discount + access a rare items
  - +90 reputation = 20% discount + special quests

### Training Costs & Time
- **Base cost**: skill_level² × 50 gold
- **Time**: skill_level × 2 ore
- **Success rate**: 70-95% dipende da INT e reputation

### Vendor Economics
- **Buy rate**: 30-70% del market value
- **Sell rate**: 100-200% del market value  
- **Restock**: ogni 4-24 ore dipende da item rarity

## Future Expansions

### Advanced Features (post-MVP)
- **Dynamic relationships**: NPC reagiscono alle azioni tra loro
- **Faction systems**: reputation con gruppi influenza tutti i membri
- **NPC questing**: NPCs danno quest ad altri NPCs
- **Seasonal behavior**: NPCs cambiano routine per stagioni/eventi
- **Romance options**: relationship romantiche con alcuni NPCs
- **NPC homes**: visitable private locations per importanti NPCs

---

Questo sistema NPC fornisce un framework completo per tutti i tipi di interazione, bilanciando depth e usability. È progettato per supportare sia gameplay manuale che AI-driven, con rich content generation e progression systems integrati.
