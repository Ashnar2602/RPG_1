# Combat Status Effects System — Specifica completa

Data: 5 settembre 2025

## Overview

Sistema completo per gestione di buff, debuff, damage over time, healing over time e controlli temporanei. Si integra con il Combat System base, AI autoplay e tutti gli altri sistemi del gioco.

## Status Effect Framework

### Core Status Effect Structure
```typescript
interface StatusEffect {
  // Identificatori
  id: string;
  name: string;
  description: string;
  icon?: string; // Per UI future
  
  // Classificazione
  type: StatusEffectType;
  category: StatusEffectCategory;
  stacking_behavior: StackingBehavior;
  
  // Durata
  duration_type: DurationType;
  duration_value: number; // Turni, secondi, o permanente
  max_duration?: number; // Cap per alcuni effetti
  
  // Effetti sui stats
  stat_modifiers: Record<string, StatModifier>;
  
  // Effetti sul combat
  damage_modifiers: DamageModifier[];
  defense_modifiers: DefenseModifier[];
  
  // Effetti periodici
  tick_effects: TickEffect[];
  
  // Restrizioni e controlli
  action_restrictions: ActionRestriction[];
  movement_restrictions: MovementRestriction[];
  
  // Condizioni speciali
  removal_conditions: RemovalCondition[];
  spread_conditions?: SpreadCondition[]; // Per effetti contagiosi
  
  // Metadata
  dispellable: boolean;
  beneficial: boolean; // true per buff, false per debuff
  visible_to_others: boolean;
  
  // Source tracking
  source_character_id?: string;
  source_ability_id?: string;
  source_item_id?: string;
}

enum StatusEffectType {
  BUFF = 'buff',
  DEBUFF = 'debuff',
  DOT = 'dot',           // Damage Over Time
  HOT = 'hot',           // Healing Over Time
  CONTROL = 'control',   // Stun, silence, etc.
  AURA = 'aura',         // Area effects
  CURSE = 'curse',       // Persistent negative effects
  BLESSING = 'blessing'  // Persistent positive effects
}

enum StatusEffectCategory {
  PHYSICAL = 'physical',     // Affecting physical capabilities
  MENTAL = 'mental',         // Affecting mental state
  MAGICAL = 'magical',       // Magical origins
  POISON = 'poison',         // Poison effects
  DISEASE = 'disease',       // Disease effects
  ELEMENTAL = 'elemental',   // Fire, ice, lightning, etc.
  DIVINE = 'divine',         // Holy/unholy effects
  TEMPORARY = 'temporary'    // Short-term tactical effects
}

enum StackingBehavior {
  NO_STACK = 'no_stack',         // Only one instance can exist
  STACK_DURATION = 'stack_duration', // Durations add up
  STACK_INTENSITY = 'stack_intensity', // Effects multiply
  STACK_COUNT = 'stack_count',   // Track number of stacks
  REFRESH = 'refresh'            // Reset duration to max
}

enum DurationType {
  TURNS = 'turns',           // Combat turns
  REAL_TIME = 'real_time',   // Real seconds/minutes
  PERMANENT = 'permanent',   // Until dispelled
  CONDITIONAL = 'conditional' // Until condition met
}
```

### Stat Modifiers
```typescript
interface StatModifier {
  stat_name: string; // 'STR', 'INT', 'DEX', etc.
  modifier_type: ModifierType;
  value: number;
  percentage?: boolean; // true per %, false per flat
}

enum ModifierType {
  ADDITIVE = 'additive',     // +X to stat
  MULTIPLICATIVE = 'multiplicative', // X% of stat
  OVERRIDE = 'override',     // Set stat to X
  MINIMUM = 'minimum',       // Stat cannot go below X
  MAXIMUM = 'maximum'        // Stat cannot go above X
}

// Esempio: Blessing of Strength
const strengthBlessing: StatusEffect = {
  id: "blessing_of_strength",
  name: "Blessing of Strength",
  description: "Divine power enhances physical capabilities",
  type: StatusEffectType.BLESSING,
  category: StatusEffectCategory.DIVINE,
  stacking_behavior: StackingBehavior.NO_STACK,
  duration_type: DurationType.TURNS,
  duration_value: 10,
  stat_modifiers: {
    "STR": {
      stat_name: "STR",
      modifier_type: ModifierType.ADDITIVE,
      value: 5,
      percentage: false
    },
    "STA": {
      stat_name: "STA", 
      modifier_type: ModifierType.ADDITIVE,
      value: 3,
      percentage: false
    }
  },
  damage_modifiers: [],
  defense_modifiers: [],
  tick_effects: [],
  action_restrictions: [],
  movement_restrictions: [],
  removal_conditions: [],
  dispellable: true,
  beneficial: true,
  visible_to_others: true
};
```

### Damage Over Time (DOT) Effects
```typescript
interface TickEffect {
  effect_type: TickEffectType;
  magnitude: number;
  damage_type?: DamageType; // For DOT effects
  healing_type?: HealingType; // For HOT effects
  
  // Frequency
  triggers_per_turn: number; // How many times per turn
  trigger_timing: TriggerTiming; // When during turn
  
  // Scaling
  scales_with_source_power: boolean;
  affected_by_resistances: boolean;
  can_critical: boolean;
  
  // Special properties
  spreads_on_death?: SpreadConfig;
  diminishing_returns?: DiminishingConfig;
}

enum TickEffectType {
  DAMAGE = 'damage',
  HEALING = 'healing',
  MANA_DRAIN = 'mana_drain',
  MANA_RESTORE = 'mana_restore',
  STAT_DRAIN = 'stat_drain',
  STAT_RESTORE = 'stat_restore'
}

enum TriggerTiming {
  START_OF_TURN = 'start_of_turn',
  END_OF_TURN = 'end_of_turn',
  ON_ACTION = 'on_action',
  ON_MOVEMENT = 'on_movement'
}

// Esempio: Deadly Poison
const deadlyPoison: StatusEffect = {
  id: "deadly_poison",
  name: "Deadly Poison",
  description: "Virulent toxins course through the bloodstream",
  type: StatusEffectType.DOT,
  category: StatusEffectCategory.POISON,
  stacking_behavior: StackingBehavior.STACK_INTENSITY,
  duration_type: DurationType.TURNS,
  duration_value: 5,
  stat_modifiers: {
    "STA": {
      stat_name: "STA",
      modifier_type: ModifierType.ADDITIVE,
      value: -2,
      percentage: false
    }
  },
  damage_modifiers: [],
  defense_modifiers: [],
  tick_effects: [
    {
      effect_type: TickEffectType.DAMAGE,
      magnitude: 12,
      damage_type: DamageType.POISON,
      triggers_per_turn: 1,
      trigger_timing: TriggerTiming.END_OF_TURN,
      scales_with_source_power: true,
      affected_by_resistances: true,
      can_critical: false
    }
  ],
  action_restrictions: [],
  movement_restrictions: [],
  removal_conditions: [
    {
      condition_type: "dispel_poison",
      automatic: false
    }
  ],
  dispellable: true,
  beneficial: false,
  visible_to_others: true
};
```

### Control Effects
```typescript
interface ActionRestriction {
  restricted_action: ActionType;
  restriction_type: RestrictionType;
  bypass_conditions?: BypassCondition[];
}

interface MovementRestriction {
  movement_type: MovementType;
  restriction_severity: RestrictionSeverity;
  break_conditions?: BreakCondition[];
}

enum ActionType {
  ATTACK = 'attack',
  CAST_SPELL = 'cast_spell',
  USE_ITEM = 'use_item',
  MOVE = 'move',
  DEFEND = 'defend',
  ALL_ACTIONS = 'all_actions'
}

enum RestrictionType {
  BLOCKED = 'blocked',        // Cannot perform action
  PENALTY = 'penalty',        // Penalty to action (-X to rolls)
  DELAY = 'delay',           // Action takes extra time
  RESOURCE_COST = 'resource_cost' // Extra MP/HP cost
}

enum MovementType {
  WALK = 'walk',
  RUN = 'run', 
  TELEPORT = 'teleport',
  ALL_MOVEMENT = 'all_movement'
}

enum RestrictionSeverity {
  MINOR = 'minor',      // -25% speed
  MAJOR = 'major',      // -50% speed
  SEVERE = 'severe',    // -75% speed
  IMMOBILIZED = 'immobilized' // No movement
}

// Esempio: Paralysis
const paralysis: StatusEffect = {
  id: "paralysis",
  name: "Paralysis",
  description: "Muscles refuse to respond to mental commands",
  type: StatusEffectType.CONTROL,
  category: StatusEffectCategory.PHYSICAL,
  stacking_behavior: StackingBehavior.REFRESH,
  duration_type: DurationType.TURNS,
  duration_value: 3,
  stat_modifiers: {},
  damage_modifiers: [],
  defense_modifiers: [
    {
      modifier_type: "vulnerability",
      damage_types: [DamageType.PHYSICAL],
      multiplier: 1.5 // +50% damage taken
    }
  ],
  tick_effects: [],
  action_restrictions: [
    {
      restricted_action: ActionType.ATTACK,
      restriction_type: RestrictionType.BLOCKED
    },
    {
      restricted_action: ActionType.CAST_SPELL,
      restriction_type: RestrictionType.PENALTY,
      bypass_conditions: [
        {
          condition: "mental_spell",
          difficulty_modifier: -20
        }
      ]
    }
  ],
  movement_restrictions: [
    {
      movement_type: MovementType.ALL_MOVEMENT,
      restriction_severity: RestrictionSeverity.IMMOBILIZED,
      break_conditions: [
        {
          condition_type: "damage_taken",
          threshold: 20,
          chance_to_break: 0.3
        }
      ]
    }
  ],
  removal_conditions: [],
  dispellable: true,
  beneficial: false,
  visible_to_others: true
};
```

## Status Effect Processing

### Application and Resolution
```typescript
function applyStatusEffect(
  target: Character | NPC,
  effect: StatusEffect,
  source?: Character | NPC,
  context?: EffectContext
): ApplicationResult {
  
  // 1. Check immunities
  if (hasImmunity(target, effect)) {
    return {
      success: false,
      reason: "target_immune",
      effect_applied: null
    };
  }
  
  // 2. Check stacking behavior
  const existing_effect = getActiveEffect(target, effect.id);
  if (existing_effect) {
    return handleEffectStacking(target, existing_effect, effect);
  }
  
  // 3. Apply effect
  const applied_effect = createActiveEffect(target, effect, source, context);
  
  // 4. Calculate actual values (considering resistances, etc.)
  const modified_effect = calculateEffectValues(applied_effect, target);
  
  // 5. Apply immediate effects
  applyImmediateEffects(target, modified_effect);
  
  // 6. Register for tick processing
  registerForTickProcessing(target, modified_effect);
  
  // 7. Log application
  logStatusEffectApplication(target, modified_effect, source);
  
  return {
    success: true,
    effect_applied: modified_effect,
    modifications: getEffectModifications(modified_effect)
  };
}

function handleEffectStacking(
  target: Character | NPC,
  existing: ActiveStatusEffect,
  new_effect: StatusEffect
): ApplicationResult {
  
  switch (new_effect.stacking_behavior) {
    case StackingBehavior.NO_STACK:
      return {
        success: false,
        reason: "effect_already_active",
        effect_applied: null
      };
      
    case StackingBehavior.REFRESH:
      existing.duration_remaining = new_effect.duration_value;
      existing.updated_at = new Date();
      return {
        success: true,
        effect_applied: existing,
        modifications: ["duration_refreshed"]
      };
      
    case StackingBehavior.STACK_DURATION:
      existing.duration_remaining += new_effect.duration_value;
      existing.duration_remaining = Math.min(
        existing.duration_remaining,
        new_effect.max_duration || existing.duration_remaining
      );
      return {
        success: true,
        effect_applied: existing,
        modifications: ["duration_extended"]
      };
      
    case StackingBehavior.STACK_INTENSITY:
      existing.stack_count = (existing.stack_count || 1) + 1;
      existing.stack_count = Math.min(existing.stack_count, 10); // Max 10 stacks
      recalculateEffectValues(existing);
      return {
        success: true,
        effect_applied: existing,
        modifications: ["intensity_increased"]
      };
      
    case StackingBehavior.STACK_COUNT:
      // Create separate instance with unique ID
      const stacked_effect = createActiveEffect(target, new_effect);
      stacked_effect.id = `${new_effect.id}_${generateStackId()}`;
      return {
        success: true,
        effect_applied: stacked_effect,
        modifications: ["new_stack_added"]
      };
      
    default:
      return {
        success: false,
        reason: "unknown_stacking_behavior",
        effect_applied: null
      };
  }
}
```

### Tick Processing
```typescript
function processStatusEffectTicks(
  character: Character | NPC,
  timing: TriggerTiming
): TickProcessingResult[] {
  
  const active_effects = getActiveStatusEffects(character);
  const results: TickProcessingResult[] = [];
  
  for (const effect of active_effects) {
    // Process each tick effect for this timing
    for (const tick_effect of effect.tick_effects) {
      if (tick_effect.trigger_timing === timing) {
        
        for (let i = 0; i < tick_effect.triggers_per_turn; i++) {
          const result = processSingleTick(character, effect, tick_effect);
          results.push(result);
          
          // Log significant events
          if (result.damage_dealt > 0 || result.healing_done > 0) {
            logTickEffectResult(character, effect, result);
          }
        }
      }
    }
    
    // Decrease duration if turn-based
    if (effect.duration_type === DurationType.TURNS && timing === TriggerTiming.END_OF_TURN) {
      effect.turns_remaining--;
      
      if (effect.turns_remaining <= 0) {
        removeStatusEffect(character, effect.id);
        results.push({
          effect_id: effect.id,
          effect_expired: true,
          removal_message: `${effect.name} has worn off.`
        });
      }
    }
  }
  
  return results;
}

function processSingleTick(
  character: Character | NPC,
  effect: ActiveStatusEffect,
  tick_effect: TickEffect
): TickProcessingResult {
  
  let magnitude = tick_effect.magnitude;
  
  // Apply stacking multiplier
  if (effect.stack_count && effect.stack_count > 1) {
    magnitude = magnitude * effect.stack_count;
  }
  
  // Scale with source power if applicable
  if (tick_effect.scales_with_source_power && effect.source_character) {
    const source = getCharacter(effect.source_character_id);
    if (source) {
      magnitude = magnitude * (1 + source.calculated_power * 0.02); // 2% per power point
    }
  }
  
  let final_value = magnitude;
  
  switch (tick_effect.effect_type) {
    case TickEffectType.DAMAGE:
      // Apply resistances if applicable
      if (tick_effect.affected_by_resistances && tick_effect.damage_type) {
        const resistance = getCharacterResistance(character, tick_effect.damage_type);
        final_value = magnitude * (1 - resistance / 100);
      }
      
      // Check for critical
      if (tick_effect.can_critical && Math.random() < 0.1) { // 10% crit chance for DOTs
        final_value *= 1.5;
      }
      
      // Apply damage
      character.current_hp = Math.max(0, character.current_hp - Math.round(final_value));
      
      return {
        effect_id: effect.id,
        tick_type: 'damage',
        damage_dealt: Math.round(final_value),
        damage_type: tick_effect.damage_type,
        was_critical: final_value > magnitude,
        target_hp_remaining: character.current_hp
      };
      
    case TickEffectType.HEALING:
      final_value = Math.round(final_value);
      const healing_done = Math.min(final_value, character.max_hp - character.current_hp);
      character.current_hp += healing_done;
      
      return {
        effect_id: effect.id,
        tick_type: 'healing',
        healing_done: healing_done,
        target_hp_remaining: character.current_hp
      };
      
    case TickEffectType.MANA_DRAIN:
      final_value = Math.round(final_value);
      const mana_drained = Math.min(final_value, character.current_mp);
      character.current_mp -= mana_drained;
      
      return {
        effect_id: effect.id,
        tick_type: 'mana_drain',
        mana_drained: mana_drained,
        target_mp_remaining: character.current_mp
      };
      
    // ... other effect types
  }
  
  return {
    effect_id: effect.id,
    tick_type: 'none',
    no_effect: true
  };
}
```

## Predefined Status Effects Library

### Common Buffs
```typescript
const commonBuffs: StatusEffect[] = [
  {
    id: "strength_boost",
    name: "Strength Boost",
    description: "Enhanced physical power",
    type: StatusEffectType.BUFF,
    category: StatusEffectCategory.PHYSICAL,
    stacking_behavior: StackingBehavior.NO_STACK,
    duration_type: DurationType.TURNS,
    duration_value: 8,
    stat_modifiers: {
      "STR": { stat_name: "STR", modifier_type: ModifierType.ADDITIVE, value: 3 }
    },
    beneficial: true,
    dispellable: true,
    visible_to_others: true
  },
  
  {
    id: "haste",
    name: "Haste",
    description: "Increased speed and agility",
    type: StatusEffectType.BUFF,
    category: StatusEffectCategory.MAGICAL,
    stacking_behavior: StackingBehavior.NO_STACK,
    duration_type: DurationType.TURNS,
    duration_value: 6,
    stat_modifiers: {
      "DEX": { stat_name: "DEX", modifier_type: ModifierType.ADDITIVE, value: 4 },
      "initiative_bonus": { stat_name: "initiative_bonus", modifier_type: ModifierType.ADDITIVE, value: 10 }
    },
    beneficial: true,
    dispellable: true,
    visible_to_others: true
  },
  
  {
    id: "regeneration",
    name: "Regeneration",
    description: "Rapid healing of wounds",
    type: StatusEffectType.HOT,
    category: StatusEffectCategory.MAGICAL,
    stacking_behavior: StackingBehavior.STACK_INTENSITY,
    duration_type: DurationType.TURNS,
    duration_value: 10,
    tick_effects: [
      {
        effect_type: TickEffectType.HEALING,
        magnitude: 8,
        triggers_per_turn: 1,
        trigger_timing: TriggerTiming.START_OF_TURN,
        scales_with_source_power: true,
        can_critical: false
      }
    ],
    beneficial: true,
    dispellable: true,
    visible_to_others: true
  }
];
```

### Common Debuffs
```typescript
const commonDebuffs: StatusEffect[] = [
  {
    id: "weakness",
    name: "Weakness",
    description: "Reduced physical capabilities",
    type: StatusEffectType.DEBUFF,
    category: StatusEffectCategory.PHYSICAL,
    stacking_behavior: StackingBehavior.STACK_INTENSITY,
    duration_type: DurationType.TURNS,
    duration_value: 6,
    stat_modifiers: {
      "STR": { stat_name: "STR", modifier_type: ModifierType.MULTIPLICATIVE, value: -25, percentage: true },
      "STA": { stat_name: "STA", modifier_type: ModifierType.ADDITIVE, value: -2 }
    },
    beneficial: false,
    dispellable: true,
    visible_to_others: true
  },
  
  {
    id: "slow",
    name: "Slow",
    description: "Reduced movement and reaction speed",
    type: StatusEffectType.DEBUFF,
    category: StatusEffectCategory.MAGICAL,
    stacking_behavior: StackingBehavior.NO_STACK,
    duration_type: DurationType.TURNS,
    duration_value: 5,
    stat_modifiers: {
      "DEX": { stat_name: "DEX", modifier_type: ModifierType.MULTIPLICATIVE, value: -30, percentage: true }
    },
    movement_restrictions: [
      {
        movement_type: MovementType.ALL_MOVEMENT,
        restriction_severity: RestrictionSeverity.MAJOR
      }
    ],
    beneficial: false,
    dispellable: true,
    visible_to_others: true
  },
  
  {
    id: "confusion",
    name: "Confusion",
    description: "Mental faculties are scrambled",
    type: StatusEffectType.CONTROL,
    category: StatusEffectCategory.MENTAL,
    stacking_behavior: StackingBehavior.NO_STACK,
    duration_type: DurationType.TURNS,
    duration_value: 4,
    action_restrictions: [
      {
        restricted_action: ActionType.CAST_SPELL,
        restriction_type: RestrictionType.PENALTY // -15 to spell rolls
      }
    ],
    beneficial: false,
    dispellable: true,
    visible_to_others: true
  }
];
```

### Poison and Disease Effects
```typescript
const poisonEffects: StatusEffect[] = [
  {
    id: "basic_poison",
    name: "Poison",
    description: "Toxins damage the body over time",
    type: StatusEffectType.DOT,
    category: StatusEffectCategory.POISON,
    stacking_behavior: StackingBehavior.STACK_INTENSITY,
    duration_type: DurationType.TURNS,
    duration_value: 4,
    tick_effects: [
      {
        effect_type: TickEffectType.DAMAGE,
        magnitude: 6,
        damage_type: DamageType.POISON,
        triggers_per_turn: 1,
        trigger_timing: TriggerTiming.END_OF_TURN,
        affected_by_resistances: true,
        can_critical: false
      }
    ],
    beneficial: false,
    dispellable: true,
    visible_to_others: true
  },
  
  {
    id: "wasting_disease",
    name: "Wasting Disease",
    description: "A debilitating illness that saps strength",
    type: StatusEffectType.CURSE,
    category: StatusEffectCategory.DISEASE,
    stacking_behavior: StackingBehavior.NO_STACK,
    duration_type: DurationType.TURNS,
    duration_value: 15,
    stat_modifiers: {
      "STR": { stat_name: "STR", modifier_type: ModifierType.ADDITIVE, value: -1 }, // Gets worse over time
      "STA": { stat_name: "STA", modifier_type: ModifierType.ADDITIVE, value: -1 }
    },
    tick_effects: [
      {
        effect_type: TickEffectType.DAMAGE,
        magnitude: 3,
        damage_type: DamageType.DARK,
        triggers_per_turn: 1,
        trigger_timing: TriggerTiming.END_OF_TURN,
        affected_by_resistances: false,
        can_critical: false
      }
    ],
    spread_conditions: [
      {
        spread_type: "contact",
        spread_chance: 0.1,
        spread_range: 1
      }
    ],
    beneficial: false,
    dispellable: false, // Requires special cure
    visible_to_others: true
  }
];
```

## AI Integration

### AI Status Effect Strategy
```typescript
interface AIStatusStrategy {
  // Buff priorities
  use_buffs_before_combat: boolean;
  maintain_key_buffs: string[]; // Effect IDs to keep active
  buff_party_members: boolean;
  
  // Debuff tactics
  prioritize_control_effects: boolean;
  focus_damage_debuffs: boolean;
  dispel_enemy_buffs: boolean;
  
  // Defensive strategies
  cleanse_important_debuffs: string[]; // Effect IDs to remove ASAP
  use_immunities_preemptively: boolean;
  
  // Resource management
  max_mana_for_buffs: number; // % of max MP to spend on buffs
  save_dispel_for_emergencies: boolean;
}

function makeAIStatusDecision(
  character: Character,
  combat_state: CombatState,
  strategy: AIStatusStrategy
): StatusAction | null {
  
  // Priority 1: Remove critical debuffs
  const critical_debuffs = getActiveStatusEffects(character)
    .filter(effect => strategy.cleanse_important_debuffs.includes(effect.effect_id));
  
  if (critical_debuffs.length > 0) {
    const dispel_ability = findDispelAbility(character);
    if (dispel_ability) {
      return {
        action_type: 'dispel',
        target_character_id: character.id,
        ability_id: dispel_ability.id,
        target_effect_id: critical_debuffs[0].id
      };
    }
  }
  
  // Priority 2: Apply important buffs if missing
  for (const important_buff of strategy.maintain_key_buffs) {
    if (!hasActiveEffect(character, important_buff)) {
      const buff_ability = findBuffAbility(character, important_buff);
      if (buff_ability && canAfford(character, buff_ability)) {
        return {
          action_type: 'buff',
          target_character_id: character.id,
          ability_id: buff_ability.id
        };
      }
    }
  }
  
  // Priority 3: Control enemies if advantageous
  if (strategy.prioritize_control_effects) {
    const best_control_target = findBestControlTarget(combat_state);
    if (best_control_target) {
      const control_ability = findBestControlAbility(character, best_control_target);
      if (control_ability) {
        return {
          action_type: 'control',
          target_character_id: best_control_target.id,
          ability_id: control_ability.id
        };
      }
    }
  }
  
  // Priority 4: Debuff dangerous enemies
  const dangerous_enemies = identifyDangerousEnemies(combat_state);
  for (const enemy of dangerous_enemies) {
    const debuff_ability = findBestDebuffAbility(character, enemy);
    if (debuff_ability && !hasSignificantDebuffs(enemy)) {
      return {
        action_type: 'debuff',
        target_character_id: enemy.id,
        ability_id: debuff_ability.id
      };
    }
  }
  
  return null; // No status action needed
}
```

### Status Effect Evaluation
```typescript
function evaluateStatusEffectValue(
  effect: StatusEffect,
  target: Character | NPC,
  context: CombatContext
): number {
  let value = 0;
  
  // Evaluate stat modifiers
  for (const [stat, modifier] of Object.entries(effect.stat_modifiers)) {
    const current_stat_value = target.stats[stat] || 0;
    let stat_impact = 0;
    
    if (modifier.percentage) {
      stat_impact = current_stat_value * (modifier.value / 100);
    } else {
      stat_impact = modifier.value;
    }
    
    // Weight stats by importance for this character type
    const stat_weight = getStatWeight(stat, target);
    value += stat_impact * stat_weight;
  }
  
  // Evaluate tick effects
  for (const tick of effect.tick_effects) {
    const total_ticks = effect.duration_value;
    const total_effect = tick.magnitude * total_ticks;
    
    if (tick.effect_type === TickEffectType.DAMAGE) {
      value += effect.beneficial ? -total_effect : total_effect;
    } else if (tick.effect_type === TickEffectType.HEALING) {
      value += effect.beneficial ? total_effect : -total_effect;
    }
  }
  
  // Evaluate control effects
  if (effect.action_restrictions.length > 0 || effect.movement_restrictions.length > 0) {
    // Control effects are very valuable
    value += effect.beneficial ? -50 : 50;
  }
  
  // Duration consideration
  value = value * Math.min(1.0, effect.duration_value / 10); // Cap duration benefit
  
  return Math.round(value);
}
```

## Database Schema

```sql
-- Active status effects tracking
CREATE TABLE active_status_effects (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  effect_id VARCHAR(50) NOT NULL,
  effect_name VARCHAR(100) NOT NULL,
  effect_type VARCHAR(20) NOT NULL,
  effect_category VARCHAR(20) NOT NULL,
  
  -- Duration tracking
  duration_type VARCHAR(20) NOT NULL,
  duration_value INTEGER NOT NULL,
  turns_remaining INTEGER,
  expires_at TIMESTAMP,
  
  -- Stacking information
  stack_count INTEGER DEFAULT 1,
  stacking_behavior VARCHAR(20) NOT NULL,
  
  -- Effect data
  stat_modifiers JSONB DEFAULT '{}',
  damage_modifiers JSONB DEFAULT '[]',
  defense_modifiers JSONB DEFAULT '[]',
  tick_effects JSONB DEFAULT '[]',
  action_restrictions JSONB DEFAULT '[]',
  movement_restrictions JSONB DEFAULT '[]',
  
  -- Source tracking
  source_character_id UUID REFERENCES characters(id),
  source_ability_id VARCHAR(50),
  source_item_id UUID REFERENCES items(id),
  
  -- Properties
  dispellable BOOLEAN DEFAULT TRUE,
  beneficial BOOLEAN DEFAULT TRUE,
  visible_to_others BOOLEAN DEFAULT TRUE,
  
  -- Removal conditions
  removal_conditions JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate non-stacking effects
  CONSTRAINT unique_non_stacking_effects 
    EXCLUDE (character_id WITH =, effect_id WITH =) 
    WHERE (stacking_behavior = 'no_stack')
);

-- Status effect tick processing log
CREATE TABLE status_effect_ticks (
  id UUID PRIMARY KEY,
  active_effect_id UUID NOT NULL REFERENCES active_status_effects(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  
  -- Tick details
  tick_type VARCHAR(20) NOT NULL,
  magnitude INTEGER NOT NULL,
  final_value INTEGER NOT NULL,
  
  -- Results
  damage_dealt INTEGER DEFAULT 0,
  healing_done INTEGER DEFAULT 0,
  mana_change INTEGER DEFAULT 0,
  was_critical BOOLEAN DEFAULT FALSE,
  
  -- Context
  trigger_timing VARCHAR(20) NOT NULL,
  combat_session_id UUID REFERENCES combat_sessions(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Status effect applications log
CREATE TABLE status_effect_applications (
  id UUID PRIMARY KEY,
  target_character_id UUID NOT NULL REFERENCES characters(id),
  source_character_id UUID REFERENCES characters(id),
  effect_id VARCHAR(50) NOT NULL,
  
  -- Application result
  application_successful BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  
  -- Stacking information
  stacking_action VARCHAR(20), -- 'new', 'refresh', 'stack', 'blocked'
  previous_stacks INTEGER DEFAULT 0,
  new_stacks INTEGER DEFAULT 1,
  
  -- Context
  source_ability_id VARCHAR(50),
  combat_session_id UUID REFERENCES combat_sessions(id),
  location_id UUID REFERENCES locations(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Status effect library (predefined effects)
CREATE TABLE status_effect_definitions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  effect_type VARCHAR(20) NOT NULL,
  category VARCHAR(20) NOT NULL,
  stacking_behavior VARCHAR(20) NOT NULL,
  
  -- Default values
  default_duration_type VARCHAR(20) NOT NULL,
  default_duration_value INTEGER NOT NULL,
  max_duration INTEGER,
  max_stacks INTEGER DEFAULT 1,
  
  -- Effect data templates
  stat_modifiers_template JSONB DEFAULT '{}',
  damage_modifiers_template JSONB DEFAULT '[]',
  defense_modifiers_template JSONB DEFAULT '[]',
  tick_effects_template JSONB DEFAULT '[]',
  action_restrictions_template JSONB DEFAULT '[]',
  movement_restrictions_template JSONB DEFAULT '[]',
  
  -- Properties
  dispellable BOOLEAN DEFAULT TRUE,
  beneficial BOOLEAN DEFAULT TRUE,
  visible_to_others BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  rarity VARCHAR(20) DEFAULT 'common',
  school VARCHAR(50), -- magical school if applicable
  source_types TEXT[] DEFAULT '{}', -- 'spell', 'item', 'environmental'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_active_status_effects_character ON active_status_effects(character_id);
CREATE INDEX idx_active_status_effects_expires ON active_status_effects(expires_at);
CREATE INDEX idx_active_status_effects_effect_id ON active_status_effects(effect_id);
CREATE INDEX idx_active_status_effects_source ON active_status_effects(source_character_id);

CREATE INDEX idx_status_effect_ticks_effect ON status_effect_ticks(active_effect_id);
CREATE INDEX idx_status_effect_ticks_character ON status_effect_ticks(character_id);
CREATE INDEX idx_status_effect_ticks_created ON status_effect_ticks(created_at);

CREATE INDEX idx_status_applications_target ON status_effect_applications(target_character_id);
CREATE INDEX idx_status_applications_source ON status_effect_applications(source_character_id);
CREATE INDEX idx_status_applications_effect ON status_effect_applications(effect_id);
CREATE INDEX idx_status_applications_created ON status_effect_applications(created_at);
```

## Integration Examples

### Integration con Combat System
```typescript
// Durante la risoluzione di un'azione di combattimento
function processCombatAction(
  attacker: Character,
  target: Character,
  ability: Ability,
  context: CombatContext
): CombatResult {
  
  // 1. Check if attacker can perform action (status restrictions)
  const action_check = checkActionRestrictions(attacker, ability);
  if (!action_check.allowed) {
    return {
      success: false,
      reason: action_check.reason,
      penalties: action_check.penalties
    };
  }
  
  // 2. Apply status effect modifiers to action
  const modified_ability = applyStatusModifiers(attacker, ability);
  
  // 3. Perform base combat resolution (D50 system)
  const base_result = resolveCombatAction(attacker, target, modified_ability, context);
  
  // 4. Apply any status effects from the ability
  if (modified_ability.status_effects_on_hit) {
    for (const effect_data of modified_ability.status_effects_on_hit) {
      if (base_result.hit && Math.random() < effect_data.application_chance) {
        applyStatusEffect(target, effect_data.effect, attacker, context);
      }
    }
  }
  
  // 5. Process any reactive status effects
  processReactiveStatusEffects(target, base_result);
  
  return base_result;
}
```

### Integration con AI Autoplay
```typescript
// AI considera status effects nel decision making
function makeAIDecision(
  character: Character,
  combat_state: CombatState,
  ai_strategy: AIStrategy
): AIAction {
  
  // 1. Evaluate current status situation
  const status_assessment = evaluateStatusSituation(character, combat_state);
  
  // 2. High priority: remove critical debuffs
  if (status_assessment.critical_debuffs.length > 0) {
    const dispel_action = makeAIStatusDecision(character, combat_state, ai_strategy.status_strategy);
    if (dispel_action) {
      return dispel_action;
    }
  }
  
  // 3. Medium priority: apply important buffs
  if (status_assessment.missing_important_buffs.length > 0) {
    const buff_action = makeAIStatusDecision(character, combat_state, ai_strategy.status_strategy);
    if (buff_action) {
      return buff_action;
    }
  }
  
  // 4. Standard combat decision with status considerations
  return makeStandardCombatDecision(character, combat_state, ai_strategy);
}
```

---

Questo sistema di Status Effects si integra completamente con il Combat System esistente e tutti gli altri sistemi, fornendo una base solida per effetti temporanei complessi mentre mantiene la semplicità del core D50 system.
