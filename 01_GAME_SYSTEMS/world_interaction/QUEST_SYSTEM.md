# Quest System — Specifica completa

Data: 4 settembre 2025

## Overview

Il Quest System gestisce tutte le missioni e attività narrative del gioco, integrando Travel System, NPC Interaction e Combat per creare progression guidata e storytelling dinamico. Supporta quest linear, branching narratives, dynamic generation e AI-driven completion.

## Architettura Quest

### Quest Base Structure
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  lore_text?: string; // background story
  
  // Classification
  type: QuestType;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  importance: QuestImportance;
  
  // Requirements
  level_requirements: { min: number; max?: number };
  prerequisites: QuestPrerequisite[];
  class_restrictions?: string[];
  alignment_restrictions?: AlignmentRestriction[];
  
  // Structure
  objectives: QuestObjective[];
  branches?: QuestBranch[]; // per branching quests
  
  // Rewards
  rewards: QuestReward;
  failure_consequences?: QuestConsequence[];
  
  // Metadata
  giver_npc_id?: string;
  quest_line_id?: string;
  repeatable: boolean;
  time_limit?: number; // hours
  seasonal?: boolean;
  
  // State management
  status: QuestStatus;
  can_abandon: boolean;
  auto_complete: boolean;
  
  // Integration
  related_locations: string[]; // location IDs
  related_npcs: string[]; // NPC IDs
  unlocks_content?: UnlockableContent[];
}

enum QuestType {
  KILL = 'kill',           // Eliminate enemies
  COLLECT = 'collect',     // Gather items
  DELIVER = 'deliver',     // Transport items/messages
  ESCORT = 'escort',       // Protect NPCs during travel
  EXPLORE = 'explore',     // Discover locations
  INTERACT = 'interact',   // Talk to NPCs
  CRAFT = 'craft',         // Create items
  SURVIVE = 'survive',     // Stay alive for time
  PUZZLE = 'puzzle',       // Solve riddles/challenges
  STORY = 'story'          // Narrative progression
}

enum QuestCategory {
  MAIN_STORY = 'main_story',
  SIDE_QUEST = 'side_quest',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  GUILD = 'guild',
  PERSONAL = 'personal',
  EVENT = 'event',
  TUTORIAL = 'tutorial'
}

enum QuestDifficulty {
  TRIVIAL = 'trivial',     // Always succeed
  EASY = 'easy',           // Level -2 to +0
  NORMAL = 'normal',       // Level +0 to +2
  HARD = 'hard',           // Level +2 to +5
  EPIC = 'epic',           // Level +5 to +10
  LEGENDARY = 'legendary'   // Level +10+
}

enum QuestImportance {
  CRITICAL = 'critical',   // Main story progression
  IMPORTANT = 'important', // Major side content
  OPTIONAL = 'optional',   // Extra content
  FLAVOR = 'flavor'        // World building
}
```

### Quest Objectives
```typescript
interface QuestObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  
  // Target definition
  target: ObjectiveTarget;
  required_quantity: number;
  current_progress: number;
  
  // Conditions
  completion_conditions?: CompletionCondition[];
  failure_conditions?: FailureCondition[];
  
  // Behavior
  optional: boolean;
  hidden: boolean; // non mostrato fino a trigger
  auto_complete: boolean;
  
  // Rewards (per sub-objectives)
  completion_reward?: ObjectiveReward;
  
  // Tracking
  progress_events: ProgressEvent[];
  completed_at?: Date;
}

enum ObjectiveType {
  KILL_TARGET = 'kill_target',           // Kill specific NPC/enemy type
  KILL_COUNT = 'kill_count',             // Kill X of any enemy in area
  COLLECT_ITEM = 'collect_item',         // Gather specific items
  COLLECT_RESOURCE = 'collect_resource', // Mine/harvest resources
  DELIVER_ITEM = 'deliver_item',         // Transport to NPC/location
  TALK_TO_NPC = 'talk_to_npc',          // Conversation
  REACH_LOCATION = 'reach_location',     // Travel to area
  SURVIVE_TIME = 'survive_time',         // Stay alive for duration
  CRAFT_ITEM = 'craft_item',            // Create specific items
  LEARN_SKILL = 'learn_skill',          // Train with trainer
  GAIN_REPUTATION = 'gain_reputation',   // Reach standing with faction
  COMPLETE_QUEST = 'complete_quest',     // Finish other quests
  TRIGGER_EVENT = 'trigger_event'        // Activate scripted sequence
}

interface ObjectiveTarget {
  type: 'npc' | 'item' | 'location' | 'skill' | 'faction' | 'event';
  id: string;
  name: string;
  
  // Additional filters
  level_range?: { min: number; max: number };
  location_restriction?: string[]; // must be in these locations
  time_restriction?: TimeRestriction;
  
  // For dynamic targets
  tags?: string[]; // "undead", "beast", "magical", etc.
  properties?: Record<string, any>;
}
```

### Quest Branching
```typescript
interface QuestBranch {
  id: string;
  name: string;
  description: string;
  
  // Trigger conditions
  trigger_conditions: BranchCondition[];
  
  // Branch content
  additional_objectives: QuestObjective[];
  modified_rewards: QuestReward;
  
  // Narrative
  branch_text: string;
  npc_dialogue_changes?: DialogueChange[];
  
  // Consequences
  locks_other_branches?: string[]; // mutually exclusive branches
  unlocks_content?: UnlockableContent[];
  
  // Completion
  completion_text: string;
  auto_trigger: boolean;
}

interface BranchCondition {
  type: 'choice' | 'stat' | 'item' | 'reputation' | 'objective' | 'random';
  target: string;
  operator: string;
  value: any;
  weight?: number; // for random selection
}
```

## Quest Generation System

### Dynamic Quest Templates
```typescript
interface QuestTemplate {
  id: string;
  name: string;
  description_template: string; // with {{variables}}
  
  // Generation rules
  generation_rules: GenerationRule[];
  objective_templates: ObjectiveTemplate[];
  reward_formulas: RewardFormula[];
  
  // Constraints
  min_level: number;
  max_level: number;
  cooldown_hours: number;
  max_instances_per_player: number;
  
  // Content pools
  target_pools: TargetPool[];
  location_pools: LocationPool[];
  narrative_variants: NarrativeVariant[];
}

interface ObjectiveTemplate {
  type: ObjectiveType;
  description_template: string;
  target_selection: TargetSelection;
  quantity_formula: string; // "level * 2 + random(1,3)"
  difficulty_scaling: DifficultyScaling;
}

interface RewardFormula {
  type: 'xp' | 'currency' | 'item' | 'reputation';
  base_amount: number;
  level_multiplier: number;
  difficulty_multiplier: number;
  completion_time_bonus: number;
  randomization_factor: number; // ±% variation
}

// Quest generation engine
function generateQuest(
  template: QuestTemplate,
  player: Character,
  context: GenerationContext
): Quest {
  
  // Select appropriate targets based on player level and location
  const targets = selectTargetsFromPools(template.target_pools, player, context);
  
  // Generate objectives
  const objectives = template.objective_templates.map(objTemplate => 
    generateObjective(objTemplate, targets, player.level)
  );
  
  // Calculate rewards
  const rewards = calculateRewards(template.reward_formulas, player.level, template.difficulty);
  
  // Select narrative variant
  const narrative = selectNarrativeVariant(template.narrative_variants, player, context);
  
  return {
    id: generateUUID(),
    title: populateTemplate(narrative.title_template, context),
    description: populateTemplate(narrative.description_template, context),
    type: determineQuestType(objectives),
    difficulty: calculateDifficulty(objectives, player.level),
    objectives: objectives,
    rewards: rewards,
    // ... other properties
  };
}
```

### Content Pools
```typescript
interface TargetPool {
  name: string;
  type: 'npc' | 'item' | 'location';
  level_range: { min: number; max: number };
  tags: string[];
  entries: TargetPoolEntry[];
}

interface TargetPoolEntry {
  target_id: string;
  weight: number;
  conditions?: PoolCondition[];
  quantity_range?: { min: number; max: number };
}

// Example: Enemy kill targets
const UndeadEnemyPool: TargetPool = {
  name: "Undead Enemies",
  type: "npc",
  level_range: { min: 1, max: 15 },
  tags: ["undead", "evil", "necromancy"],
  entries: [
    { target_id: "skeleton_warrior", weight: 30, quantity_range: { min: 3, max: 8 } },
    { target_id: "zombie", weight: 25, quantity_range: { min: 2, max: 6 } },
    { target_id: "wraith", weight: 15, quantity_range: { min: 1, max: 3 } },
    { target_id: "lich", weight: 5, quantity_range: { min: 1, max: 1 } }
  ]
};
```

## Quest State Management

### Player Quest Tracking
```typescript
interface PlayerQuest {
  quest_id: string;
  player_id: string;
  
  // Status
  status: QuestStatus;
  started_at: Date;
  completed_at?: Date;
  abandoned_at?: Date;
  
  // Progress tracking
  current_objectives: ObjectiveProgress[];
  completed_objectives: string[];
  failed_objectives: string[];
  
  // Branching
  active_branches: string[];
  completed_branches: string[];
  available_choices: QuestChoice[];
  
  // Context
  starting_location: string;
  party_members?: string[]; // for group quests
  
  // Dynamic data
  quest_variables: Record<string, any>;
  custom_rewards?: QuestReward; // for modified rewards
  
  // Timestamps
  last_progress_update: Date;
  next_reminder?: Date;
}

interface ObjectiveProgress {
  objective_id: string;
  current_progress: number;
  required_quantity: number;
  progress_percentage: number;
  
  // Tracking details
  progress_log: ProgressLogEntry[];
  last_update: Date;
  
  // Status
  completed: boolean;
  failed: boolean;
  optional: boolean;
}

interface ProgressLogEntry {
  timestamp: Date;
  event_type: string;
  details: any;
  progress_delta: number;
  location_id?: string;
  source?: string; // "combat", "interaction", "travel", etc.
}

enum QuestStatus {
  AVAILABLE = 'available',     // Can be started
  ACTIVE = 'active',          // In progress
  COMPLETED = 'completed',     // Successfully finished
  FAILED = 'failed',          // Failed due to conditions
  ABANDONED = 'abandoned',     // Player chose to abandon
  EXPIRED = 'expired',        // Time limit exceeded
  BLOCKED = 'blocked'         // Prerequisites no longer met
}
```

### Quest Progress Tracking
```typescript
// Progress update system
function updateQuestProgress(
  player_id: string,
  event: GameEvent,
  context: UpdateContext
): QuestProgressUpdate[] {
  
  const player_quests = getActiveQuests(player_id);
  const updates: QuestProgressUpdate[] = [];
  
  for (const player_quest of player_quests) {
    const quest = getQuest(player_quest.quest_id);
    
    for (const objective of quest.objectives) {
      if (objective.completed) continue;
      
      const progress_delta = calculateProgressDelta(objective, event, context);
      if (progress_delta > 0) {
        const new_progress = objective.current_progress + progress_delta;
        const completed = new_progress >= objective.required_quantity;
        
        updates.push({
          player_quest_id: player_quest.id,
          objective_id: objective.id,
          progress_delta: progress_delta,
          new_progress: new_progress,
          completed: completed,
          event: event
        });
        
        // Check quest completion
        if (completed && checkQuestCompletion(quest, player_quest)) {
          updates.push(createQuestCompletionUpdate(player_quest));
        }
      }
    }
  }
  
  return updates;
}

// Event-based progress calculation
function calculateProgressDelta(
  objective: QuestObjective,
  event: GameEvent,
  context: UpdateContext
): number {
  
  switch (objective.type) {
    case ObjectiveType.KILL_TARGET:
      if (event.type === 'npc_killed' && 
          event.npc_id === objective.target.id) {
        return 1;
      }
      break;
      
    case ObjectiveType.COLLECT_ITEM:
      if (event.type === 'item_acquired' && 
          event.item_id === objective.target.id) {
        return event.quantity;
      }
      break;
      
    case ObjectiveType.REACH_LOCATION:
      if (event.type === 'location_entered' && 
          event.location_id === objective.target.id) {
        return 1;
      }
      break;
      
    case ObjectiveType.TALK_TO_NPC:
      if (event.type === 'dialogue_completed' && 
          event.npc_id === objective.target.id) {
        return 1;
      }
      break;
      
    // ... other objective types
  }
  
  return 0;
}
```

## Quest Rewards System

### Reward Structure
```typescript
interface QuestReward {
  // Basic rewards
  xp: number;
  currency: CurrencyAmount;
  
  // Item rewards
  guaranteed_items: ItemReward[];
  choice_items: ItemChoice[]; // player picks one
  random_items: RandomItemPool[];
  
  // Progression rewards
  skill_points?: number;
  attribute_points?: number;
  talent_unlocks?: string[];
  
  // Social rewards
  reputation_changes: ReputationChange[];
  faction_standing?: FactionStanding[];
  
  // Content unlocks
  unlocked_locations?: string[];
  unlocked_quests?: string[];
  unlocked_npcs?: string[];
  unlocked_features?: string[];
  
  // Special rewards
  titles?: string[];
  achievements?: string[];
  cosmetics?: string[];
  
  // Temporary effects
  buffs?: TemporaryBuff[];
  debuffs?: TemporaryDebuff[];
}

interface ItemReward {
  item_id: string;
  quantity: number;
  quality?: ItemQuality;
  enchantments?: EnchantmentData[];
  bound_to_player: boolean;
}

interface ItemChoice {
  choice_id: string;
  title: string;
  description: string;
  options: ItemReward[];
  default_selection?: number;
}

// Reward calculation
function calculateQuestRewards(
  quest: Quest,
  player: Character,
  completion_data: CompletionData
): QuestReward {
  
  let base_rewards = quest.rewards;
  
  // Level scaling
  const level_multiplier = getLevelMultiplier(player.level, quest.difficulty);
  base_rewards.xp = Math.round(base_rewards.xp * level_multiplier);
  
  // Time bonus/penalty
  const time_multiplier = getTimeMultiplier(completion_data.completion_time, quest.time_limit);
  base_rewards.xp = Math.round(base_rewards.xp * time_multiplier);
  
  // Party bonus
  if (completion_data.party_size > 1) {
    const party_bonus = 1 + (completion_data.party_size - 1) * 0.1; // +10% per extra member
    base_rewards.xp = Math.round(base_rewards.xp * party_bonus);
  }
  
  // Perfect completion bonus
  if (completion_data.all_optional_completed) {
    base_rewards.xp = Math.round(base_rewards.xp * 1.25); // +25% bonus
    base_rewards.currency.gold = Math.round(base_rewards.currency.gold * 1.25);
  }
  
  return base_rewards;
}
```

## Quest Lines & Narrative

### Quest Line Structure
```typescript
interface QuestLine {
  id: string;
  name: string;
  description: string;
  theme: string; // "Village Defense", "Ancient Mystery", etc.
  
  // Structure
  quests: QuestLineEntry[];
  
  // Requirements
  unlock_conditions: UnlockCondition[];
  level_requirements: { min: number; max?: number };
  
  // Narrative
  opening_text: string;
  conclusion_text: string;
  lore_background: string;
  
  // Rewards
  completion_rewards: QuestLineReward;
  milestone_rewards: MilestoneReward[];
  
  // Metadata
  estimated_duration_hours: number;
  recommended_party_size: number;
  seasonal: boolean;
  repeatable: boolean;
}

interface QuestLineEntry {
  quest_id: string;
  order: number;
  required: boolean; // se false, è optional per progression
  unlock_conditions?: QuestLineCondition[];
  
  // Branching support
  branches?: QuestLineBranch[];
  mutually_exclusive_with?: string[]; // other quest IDs
}

interface QuestLineBranch {
  condition: BranchCondition;
  alternative_quest_id: string;
  branch_narrative: string;
}

// Quest line progression
function checkQuestLineProgression(
  player_id: string,
  quest_line_id: string
): QuestLineProgress {
  
  const quest_line = getQuestLine(quest_line_id);
  const player_quest_history = getPlayerQuestHistory(player_id, quest_line.quests.map(q => q.quest_id));
  
  let current_step = 0;
  let completed_required = 0;
  let completed_optional = 0;
  let next_available_quests: string[] = [];
  
  for (const entry of quest_line.quests.sort((a, b) => a.order - b.order)) {
    const quest_status = player_quest_history[entry.quest_id]?.status || 'not_started';
    
    if (quest_status === 'completed') {
      if (entry.required) {
        completed_required++;
        current_step = Math.max(current_step, entry.order);
      } else {
        completed_optional++;
      }
    } else if (quest_status === 'not_started' && 
               checkQuestLineConditions(entry.unlock_conditions, player_quest_history)) {
      next_available_quests.push(entry.quest_id);
    }
  }
  
  return {
    quest_line_id: quest_line_id,
    current_step: current_step,
    completed_required: completed_required,
    completed_optional: completed_optional,
    total_required: quest_line.quests.filter(q => q.required).length,
    total_optional: quest_line.quests.filter(q => !q.required).length,
    next_available_quests: next_available_quests,
    completion_percentage: completed_required / quest_line.quests.filter(q => q.required).length,
    estimated_time_remaining: calculateEstimatedTimeRemaining(quest_line, current_step)
  };
}
```

## AI Integration & Autoplay

### AI Quest Strategy
```typescript
interface QuestStrategy {
  // Quest selection preferences
  auto_accept_quests: boolean;
  preferred_difficulties: QuestDifficulty[];
  preferred_types: QuestType[];
  avoid_types: QuestType[];
  
  // Completion preferences
  prioritize_main_story: boolean;
  complete_optional_objectives: boolean;
  max_concurrent_quests: number;
  
  // Risk management
  abandon_if_too_hard: boolean;
  max_death_risk: number; // 0-1 threshold
  require_party_for_hard_quests: boolean;
  
  // Time management
  prefer_short_quests: boolean;
  max_quest_duration_hours: number;
  
  // Reward preferences
  prioritize_xp: boolean;
  prioritize_currency: boolean;
  prioritize_items: boolean;
  needed_item_types: string[];
}

// AI quest decision making
function makeQuestDecision(
  character: Character,
  available_quests: Quest[],
  strategy: QuestStrategy,
  context: AIContext
): QuestDecision[] {
  
  const decisions: QuestDecision[] = [];
  
  // Filter quests by strategy
  const suitable_quests = available_quests.filter(quest => 
    strategy.preferred_difficulties.includes(quest.difficulty) &&
    strategy.preferred_types.includes(quest.type) &&
    !strategy.avoid_types.includes(quest.type)
  );
  
  // Score each quest
  const scored_quests = suitable_quests.map(quest => ({
    quest: quest,
    score: calculateQuestScore(quest, character, strategy, context)
  })).sort((a, b) => b.score - a.score);
  
  // Select top quests up to concurrent limit
  const selected_quests = scored_quests
    .slice(0, strategy.max_concurrent_quests)
    .filter(sq => sq.score > 0);
  
  for (const scored_quest of selected_quests) {
    decisions.push({
      action: 'accept',
      quest_id: scored_quest.quest.id,
      confidence: Math.min(1, scored_quest.score / 100),
      reasoning: generateQuestReasoning(scored_quest.quest, strategy)
    });
  }
  
  return decisions;
}

function calculateQuestScore(
  quest: Quest,
  character: Character,
  strategy: QuestStrategy,
  context: AIContext
): number {
  let score = 50; // base score
  
  // Difficulty appropriateness
  const level_diff = quest.level_requirements.min - character.level;
  if (level_diff > 3) score -= 30; // too hard
  if (level_diff < -5) score -= 20; // too easy
  if (level_diff >= -2 && level_diff <= 1) score += 15; // just right
  
  // Type preference
  if (strategy.preferred_types.includes(quest.type)) score += 20;
  if (strategy.avoid_types.includes(quest.type)) score -= 50;
  
  // Reward value
  score += calculateRewardValue(quest.rewards, character, strategy);
  
  // Quest line importance
  if (quest.importance === QuestImportance.CRITICAL) score += 25;
  if (quest.importance === QuestImportance.IMPORTANT) score += 10;
  
  // Time considerations
  if (quest.time_limit && quest.time_limit < strategy.max_quest_duration_hours) {
    score += 10;
  }
  
  // Location convenience
  const travel_time = calculateTravelTimeToQuest(character.current_location, quest.related_locations);
  score -= Math.min(20, travel_time / 60); // -1 point per hour of travel
  
  return Math.max(0, score);
}
```

### Automated Quest Execution
```typescript
interface QuestExecutionPlan {
  quest_id: string;
  execution_steps: ExecutionStep[];
  estimated_duration: number;
  risk_assessment: RiskAssessment;
  resource_requirements: ResourceRequirement[];
  
  // Contingency planning
  fallback_plans: FallbackPlan[];
  abort_conditions: AbortCondition[];
}

interface ExecutionStep {
  step_id: string;
  type: 'travel' | 'combat' | 'interact' | 'collect' | 'wait';
  description: string;
  
  // Step details
  target?: string;
  location_id?: string;
  duration_estimate: number;
  
  // Conditions
  prerequisites: StepCondition[];
  success_conditions: StepCondition[];
  
  // AI instructions
  ai_instructions: string;
  ai_parameters: Record<string, any>;
}

// Generate execution plan
function generateQuestExecutionPlan(
  quest: Quest,
  character: Character,
  strategy: QuestStrategy
): QuestExecutionPlan {
  
  const steps: ExecutionStep[] = [];
  
  for (const objective of quest.objectives) {
    const objective_steps = generateObjectiveSteps(objective, character, quest);
    steps.push(...objective_steps);
  }
  
  // Optimize step order
  const optimized_steps = optimizeStepOrder(steps, character.current_location);
  
  // Calculate risk and resources
  const risk_assessment = assessQuestRisk(quest, character);
  const resource_requirements = calculateResourceNeeds(optimized_steps, character);
  
  return {
    quest_id: quest.id,
    execution_steps: optimized_steps,
    estimated_duration: optimized_steps.reduce((sum, step) => sum + step.duration_estimate, 0),
    risk_assessment: risk_assessment,
    resource_requirements: resource_requirements,
    fallback_plans: generateFallbackPlans(quest, character),
    abort_conditions: generateAbortConditions(quest, character, strategy)
  };
}
```

## Database Schema

```sql
-- Quest definitions
CREATE TABLE quests (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  lore_text TEXT,
  
  type VARCHAR(20) NOT NULL,
  category VARCHAR(20) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  importance VARCHAR(20) NOT NULL,
  
  level_min INTEGER DEFAULT 1,
  level_max INTEGER,
  prerequisites JSONB DEFAULT '[]',
  class_restrictions VARCHAR(20)[] DEFAULT '{}',
  alignment_restrictions JSONB DEFAULT '{}',
  
  objectives JSONB NOT NULL,
  branches JSONB DEFAULT '[]',
  
  rewards JSONB NOT NULL,
  failure_consequences JSONB DEFAULT '[]',
  
  giver_npc_id UUID REFERENCES npcs(id),
  quest_line_id UUID REFERENCES quest_lines(id),
  repeatable BOOLEAN DEFAULT FALSE,
  time_limit INTEGER, -- hours
  seasonal BOOLEAN DEFAULT FALSE,
  
  can_abandon BOOLEAN DEFAULT TRUE,
  auto_complete BOOLEAN DEFAULT FALSE,
  
  related_locations UUID[] DEFAULT '{}',
  related_npcs UUID[] DEFAULT '{}',
  unlocks_content JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quest lines
CREATE TABLE quest_lines (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  theme VARCHAR(50),
  
  unlock_conditions JSONB DEFAULT '[]',
  level_min INTEGER DEFAULT 1,
  level_max INTEGER,
  
  opening_text TEXT,
  conclusion_text TEXT,
  lore_background TEXT,
  
  completion_rewards JSONB DEFAULT '{}',
  milestone_rewards JSONB DEFAULT '[]',
  
  estimated_duration_hours INTEGER,
  recommended_party_size INTEGER DEFAULT 1,
  seasonal BOOLEAN DEFAULT FALSE,
  repeatable BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player quest tracking
CREATE TABLE player_quests (
  id UUID PRIMARY KEY,
  quest_id UUID REFERENCES quests(id),
  player_id UUID REFERENCES users(id),
  
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  abandoned_at TIMESTAMP,
  
  current_objectives JSONB DEFAULT '[]',
  completed_objectives UUID[] DEFAULT '{}',
  failed_objectives UUID[] DEFAULT '{}',
  
  active_branches UUID[] DEFAULT '{}',
  completed_branches UUID[] DEFAULT '{}',
  available_choices JSONB DEFAULT '[]',
  
  starting_location UUID REFERENCES locations(id),
  party_members UUID[] DEFAULT '{}',
  
  quest_variables JSONB DEFAULT '{}',
  custom_rewards JSONB,
  
  last_progress_update TIMESTAMP DEFAULT NOW(),
  next_reminder TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(quest_id, player_id)
);

-- Quest progress tracking
CREATE TABLE quest_progress_log (
  id UUID PRIMARY KEY,
  player_quest_id UUID REFERENCES player_quests(id),
  objective_id UUID NOT NULL,
  
  event_type VARCHAR(50) NOT NULL,
  event_details JSONB DEFAULT '{}',
  progress_delta INTEGER NOT NULL,
  new_progress INTEGER NOT NULL,
  
  location_id UUID REFERENCES locations(id),
  source VARCHAR(50), -- 'combat', 'interaction', 'travel', etc.
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quest templates (for dynamic generation)
CREATE TABLE quest_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description_template TEXT NOT NULL,
  
  generation_rules JSONB NOT NULL,
  objective_templates JSONB NOT NULL,
  reward_formulas JSONB NOT NULL,
  
  min_level INTEGER DEFAULT 1,
  max_level INTEGER DEFAULT 50,
  cooldown_hours INTEGER DEFAULT 24,
  max_instances_per_player INTEGER DEFAULT 1,
  
  target_pools JSONB DEFAULT '[]',
  location_pools JSONB DEFAULT '[]',
  narrative_variants JSONB DEFAULT '[]',
  
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily/weekly quest instances
CREATE TABLE generated_quests (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES quest_templates(id),
  generated_quest_data JSONB NOT NULL,
  
  available_from TIMESTAMP DEFAULT NOW(),
  available_until TIMESTAMP,
  
  target_player_id UUID REFERENCES users(id), -- for personalized quests
  difficulty_override VARCHAR(20),
  
  generation_context JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quest choices/decisions tracking
CREATE TABLE quest_choices (
  id UUID PRIMARY KEY,
  player_quest_id UUID REFERENCES player_quests(id),
  choice_point_id VARCHAR(50) NOT NULL,
  choice_made VARCHAR(100) NOT NULL,
  choice_timestamp TIMESTAMP DEFAULT NOW(),
  
  choice_context JSONB DEFAULT '{}',
  consequences JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quests_level ON quests(level_min, level_max);
CREATE INDEX idx_quests_type ON quests(type);
CREATE INDEX idx_quests_category ON quests(category);
CREATE INDEX idx_quests_giver ON quests(giver_npc_id);
CREATE INDEX idx_quests_quest_line ON quests(quest_line_id);

CREATE INDEX idx_player_quests_player ON player_quests(player_id);
CREATE INDEX idx_player_quests_status ON player_quests(status);
CREATE INDEX idx_player_quests_quest ON player_quests(quest_id);

CREATE INDEX idx_quest_progress_player_quest ON quest_progress_log(player_quest_id);
CREATE INDEX idx_quest_progress_created ON quest_progress_log(created_at);

CREATE INDEX idx_generated_quests_template ON generated_quests(template_id);
CREATE INDEX idx_generated_quests_player ON generated_quests(target_player_id);
CREATE INDEX idx_generated_quests_available ON generated_quests(available_from, available_until);
```

## API Endpoints

```typescript
// Get available quests for player
GET /api/players/{player_id}/quests/available
Query: ?location_id=uuid&npc_id=uuid&difficulty=normal
Response: {
  available_quests: QuestSummary[],
  recommendations: QuestRecommendation[],
  total_count: number
}

// Get active quests
GET /api/players/{player_id}/quests/active
Response: {
  active_quests: PlayerQuest[],
  progress_summary: ProgressSummary,
  next_objectives: ObjectiveHint[]
}

// Accept quest
POST /api/players/{player_id}/quests/{quest_id}/accept
Body: { party_members?: string[], starting_choices?: Record<string, any> }
Response: {
  player_quest: PlayerQuest,
  initial_objectives: QuestObjective[],
  recommended_actions: ActionRecommendation[]
}

// Get quest details
GET /api/quests/{quest_id}
Query: ?player_id=uuid
Response: {
  quest: Quest,
  player_context?: PlayerQuestContext,
  completion_stats: CompletionStats
}

// Abandon quest
DELETE /api/players/{player_id}/quests/{quest_id}
Response: {
  success: boolean,
  consequences?: QuestConsequence[],
  refunds?: ResourceRefund[]
}

// Make quest choice
POST /api/players/{player_id}/quests/{quest_id}/choice
Body: { choice_point_id: string, choice_id: string }
Response: {
  choice_result: ChoiceResult,
  updated_objectives: QuestObjective[],
  narrative_update: string
}

// Get quest progress
GET /api/players/{player_id}/quests/{quest_id}/progress
Response: {
  progress: ObjectiveProgress[],
  completion_percentage: number,
  estimated_time_remaining: number,
  recent_events: ProgressEvent[]
}

// Complete quest (manual trigger if needed)
POST /api/players/{player_id}/quests/{quest_id}/complete
Response: {
  completion_result: CompletionResult,
  rewards_granted: QuestReward,
  unlocked_content: UnlockableContent[]
}

// Get quest line progress
GET /api/players/{player_id}/quest-lines/{quest_line_id}
Response: {
  quest_line: QuestLine,
  progress: QuestLineProgress,
  next_quests: Quest[],
  completion_rewards: QuestLineReward
}

// Set AI quest strategy
PUT /api/players/{player_id}/quest-strategy
Body: QuestStrategy
Response: { success: boolean }

// Generate dynamic quest
POST /api/players/{player_id}/quests/generate
Body: { template_id?: string, preferences?: GenerationPreferences }
Response: {
  generated_quest: Quest,
  generation_info: GenerationInfo,
  acceptance_deadline: Date
}
```

## Content Examples

### Tutorial Quest Line
```json
{
  "id": "tutorial_basics",
  "name": "First Steps",
  "description": "Learn the fundamentals of adventuring",
  "theme": "Tutorial",
  "quests": [
    {
      "quest_id": "tutorial_movement",
      "order": 1,
      "required": true
    },
    {
      "quest_id": "tutorial_combat", 
      "order": 2,
      "required": true
    },
    {
      "quest_id": "tutorial_inventory",
      "order": 3,
      "required": true
    }
  ]
}
```

### Dynamic Quest Template
```json
{
  "id": "bandit_problem",
  "name": "Bandit Troubles",
  "description_template": "{{location_name}} is being harassed by {{enemy_type}}. Eliminate {{quantity}} of them to restore peace.",
  "objective_templates": [
    {
      "type": "kill_count",
      "description_template": "Defeat {{quantity}} {{enemy_type}} near {{location_name}}",
      "target_selection": {
        "pool": "bandit_enemies",
        "level_appropriate": true
      },
      "quantity_formula": "Math.max(3, Math.floor(level * 0.8) + random(1,3))"
    }
  ],
  "reward_formulas": [
    {
      "type": "xp", 
      "base_amount": 100,
      "level_multiplier": 50,
      "difficulty_multiplier": 1.5
    },
    {
      "type": "currency",
      "base_amount": 50,
      "level_multiplier": 25
    }
  ]
}
```

### Branching Story Quest
```json
{
  "id": "stolen_artifact",
  "title": "The Missing Relic",
  "description": "A sacred artifact has been stolen from the temple. Track down the thieves and decide its fate.",
  "objectives": [
    {
      "id": "find_thieves",
      "type": "reach_location",
      "target": { "type": "location", "id": "bandit_hideout" },
      "description": "Track the thieves to their hideout"
    },
    {
      "id": "confront_leader",
      "type": "talk_to_npc",
      "target": { "type": "npc", "id": "bandit_leader" },
      "description": "Confront the bandit leader"
    }
  ],
  "branches": [
    {
      "id": "peaceful_resolution",
      "trigger_conditions": [
        { "type": "choice", "value": "negotiate" }
      ],
      "additional_objectives": [
        {
          "id": "pay_ransom",
          "type": "deliver_item",
          "target": { "type": "npc", "id": "bandit_leader" },
          "description": "Pay the ransom for the artifact"
        }
      ],
      "modified_rewards": {
        "reputation_changes": [
          { "faction": "temple", "amount": 10 },
          { "faction": "thieves_guild", "amount": 5 }
        ]
      }
    },
    {
      "id": "violent_resolution",
      "trigger_conditions": [
        { "type": "choice", "value": "attack" }
      ],
      "additional_objectives": [
        {
          "id": "defeat_bandits",
          "type": "kill_target",
          "target": { "type": "npc", "id": "bandit_leader" },
          "description": "Defeat the bandit leader in combat"
        }
      ],
      "modified_rewards": {
        "reputation_changes": [
          { "faction": "temple", "amount": 15 },
          { "faction": "thieves_guild", "amount": -10 }
        ]
      }
    }
  ]
}
```

## Balance Considerations

### XP Rewards
- **Base formula**: `base_xp * (1 + level_modifier) * difficulty_multiplier * time_modifier`
- **Level modifier**: `(quest_level - player_level) * 0.1` (capped ±50%)
- **Difficulty multipliers**: Trivial 0.5x, Easy 0.8x, Normal 1.0x, Hard 1.5x, Epic 2.0x, Legendary 3.0x
- **Time modifier**: 0.8x - 1.2x based on completion speed vs. expected time

### Quest Availability
- **Level ranges**: ±3 levels from recommended for normal access
- **Prerequisites**: Max 2-3 prerequisite quests per chain
- **Cooldowns**: 24h for daily, 7d for weekly, 30d for monthly special quests
- **Concurrent limit**: 5-8 active quests per player

### Difficulty Scaling
- **Trivial**: Tutorial/story quests, always completable
- **Easy**: -2 to +0 levels, 90%+ success rate
- **Normal**: +0 to +2 levels, 70-80% success rate  
- **Hard**: +2 to +5 levels, 50-60% success rate
- **Epic**: +5 to +10 levels, 30-40% success rate
- **Legendary**: +10+ levels, 10-20% success rate

## Future Expansions

### Advanced Features (post-MVP)
- **Dynamic world events**: Server-wide quest chains that change the world
- **Player-generated content**: Players can create and share quest templates
- **Cross-server quests**: Epic quests that span multiple game servers
- **Seasonal storylines**: Major narrative arcs that evolve over months
- **Procedural dungeon quests**: Dynamically generated dungeon instances
- **Faction warfare**: PvP-enabled quest lines between opposing factions
- **Legacy quests**: Quests that affect future character generations

### Integration Opportunities
- **Housing system**: Quests that unlock and upgrade player housing
- **Crafting mastery**: Quest lines that unlock advanced crafting recipes
- **Mount collection**: Epic quests to tame rare and legendary mounts
- **Guild progression**: Quests that advance guild level and unlock features
- **Mentorship**: High-level players can create tutorial quests for new players

---

Questo Quest System fornisce un framework completo per content delivery, player progression e narrative engagement. È progettato per supportare sia casual play che hardcore progression, con AI integration che permette autonomous quest completion mentre mantiene player agency nelle decisioni narrative importanti.

Il sistema si integra seamlessly con Travel (location-based objectives), NPCs (questgivers e targets), Combat (enemy encounters), e tutti gli altri sistemi del gioco per creare un gameplay loop coesivo e engaging.
