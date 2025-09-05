# Combat Action Economy System — Specifica completa

Data: 5 settembre 2025

## Overview

Sistema avanzato per gestione delle azioni di combattimento che espande il combat system base con azioni multiple per turno, economia delle azioni, combo attacks, interrupt mechanisms e timing strategies. Mantiene piena compatibilità con il sistema D50 core.

## Core Action Economy Framework

### Action System Structure
```typescript
interface ActionEconomy {
  // Action points per turn
  total_action_points: number;
  action_points_used: number;
  action_points_remaining: number;
  
  // Action types tracking
  standard_actions_used: number;
  move_actions_used: number;
  bonus_actions_used: number;
  reaction_actions_used: number;
  
  // Timing and flow
  turn_phase: TurnPhase;
  interrupts_available: number;
  delayed_actions: DelayedAction[];
  
  // Combo tracking
  active_combo_chain: ComboChain | null;
  combo_counter: number;
  
  // Restrictions and modifiers
  action_restrictions: ActionRestriction[];
  speed_modifiers: SpeedModifier[];
}

enum TurnPhase {
  START_OF_TURN = 'start_of_turn',
  MOVEMENT_PHASE = 'movement_phase',
  ACTION_PHASE = 'action_phase',
  BONUS_PHASE = 'bonus_phase', 
  END_OF_TURN = 'end_of_turn',
  REACTION_WINDOW = 'reaction_window'
}

enum ActionType {
  STANDARD = 'standard',     // Primary combat actions
  MOVE = 'move',            // Movement actions
  BONUS = 'bonus',          // Quick actions
  REACTION = 'reaction',    // Responses to triggers
  FREE = 'free',            // No cost actions
  INTERRUPT = 'interrupt'   // Break normal flow
}

interface CombatAction {
  id: string;
  name: string;
  description: string;
  
  // Action costs
  action_type: ActionType;
  action_point_cost: number;
  alternative_costs?: AlternativeCost[]; // Can pay with different action types
  
  // Timing requirements  
  valid_phases: TurnPhase[];
  can_interrupt: boolean;
  interrupt_priority: number;
  
  // Execution details
  casting_time: number; // Turns to complete
  concentration_required: boolean;
  maintains_combo: boolean;
  
  // Prerequisites
  required_stance?: CombatStance;
  requires_target: boolean;
  range_requirements: RangeRequirement;
  
  // Effects and outcomes
  damage_formula?: string;
  effect_functions: EffectFunction[];
  combo_potential: ComboData[];
  
  // Limitations
  max_uses_per_turn?: number;
  max_uses_per_combat?: number;
  cooldown_turns?: number;
}

interface AlternativeCost {
  action_type: ActionType;
  quantity: number;
  conditions?: string[];
}

// Esempio: Azione standard Attack
const standardAttack: CombatAction = {
  id: "standard_attack",
  name: "Attack",
  description: "Basic weapon attack",
  action_type: ActionType.STANDARD,
  action_point_cost: 3,
  alternative_costs: [
    {
      action_type: ActionType.MOVE,
      quantity: 2,
      conditions: ["light_weapon_equipped"]
    }
  ],
  valid_phases: [TurnPhase.ACTION_PHASE],
  can_interrupt: false,
  interrupt_priority: 0,
  casting_time: 0,
  concentration_required: false,
  maintains_combo: true,
  requires_target: true,
  range_requirements: {
    min_range: 0,
    max_range: 2,
    requires_line_of_sight: true
  },
  damage_formula: "weapon_damage + STR_modifier",
  effect_functions: [
    {
      type: "apply_weapon_damage",
      timing: "on_hit"
    }
  ],
  combo_potential: [
    {
      combo_type: "follow_up_strike",
      next_action_cost_reduction: 1,
      damage_bonus: 2
    }
  ]
};
```

### Action Points and Scaling
```typescript
function calculateActionPoints(character: Character): ActionPointData {
  // Base action points from character stats
  let base_ap = 4; // Standard base
  
  // DEX modifier (speed affects action economy)
  const dex_modifier = Math.floor((character.stats.DEX - 10) / 2);
  base_ap += Math.floor(dex_modifier / 2); // +1 AP per 4 DEX points above 10
  
  // Level scaling
  const level_bonus = Math.floor(character.level / 5); // +1 AP every 5 levels
  base_ap += level_bonus;
  
  // Equipment modifiers
  const equipment_modifier = calculateEquipmentAPModifier(character);
  base_ap += equipment_modifier;
  
  // Status effect modifiers
  const status_modifier = calculateStatusAPModifier(character);
  base_ap += status_modifier;
  
  // Minimum and maximum constraints
  const final_ap = Math.max(2, Math.min(12, base_ap));
  
  return {
    total_action_points: final_ap,
    action_points_used: 0,
    action_points_remaining: final_ap,
    
    // Action type limits
    max_standard_actions: Math.floor(final_ap / 3), // Standard actions cost 3 AP
    max_move_actions: Math.floor(final_ap / 2),     // Move actions cost 2 AP
    max_bonus_actions: Math.floor(final_ap / 1),    // Bonus actions cost 1 AP
    
    // Special allocations
    reaction_budget: 2, // Fixed reaction budget per turn
    interrupt_budget: 1 // One interrupt per turn
  };
}

function calculateEquipmentAPModifier(character: Character): number {
  let modifier = 0;
  
  // Light armor bonus
  if (character.equipment.armor?.weight_class === 'light') {
    modifier += 1;
  }
  
  // Heavy armor penalty
  if (character.equipment.armor?.weight_class === 'heavy') {
    modifier -= 1;
  }
  
  // Dual wielding
  if (character.equipment.main_hand && character.equipment.off_hand) {
    if (character.equipment.off_hand.item_type === 'weapon') {
      modifier += 1; // More attack options
    }
  }
  
  // Special items
  const haste_items = character.equipment.accessories?.filter(
    item => item.properties.includes('haste')
  );
  if (haste_items && haste_items.length > 0) {
    modifier += haste_items.length;
  }
  
  return modifier;
}
```

## Action Execution System

### Turn Management
```typescript
function processTurn(
  character_id: string,
  combat_state: CombatState
): TurnProcessingResult {
  
  const character = combat_state.characters.get(character_id);
  if (!character) {
    return { success: false, reason: 'character_not_found' };
  }
  
  // Initialize turn economy
  const action_economy = calculateActionPoints(character);
  combat_state.action_economies.set(character_id, action_economy);
  
  // Process turn phases sequentially
  const turn_result: TurnResult = {
    character_id: character_id,
    phases_completed: [],
    actions_taken: [],
    final_state: null
  };
  
  // Phase 1: Start of turn effects
  const start_result = processStartOfTurnPhase(character_id, combat_state);
  turn_result.phases_completed.push({
    phase: TurnPhase.START_OF_TURN,
    result: start_result
  });
  
  // Phase 2: Movement phase (if character wants to move first)
  if (shouldProcessMovementFirst(character_id, combat_state)) {
    const move_result = processMovementPhase(character_id, combat_state);
    turn_result.phases_completed.push({
      phase: TurnPhase.MOVEMENT_PHASE,
      result: move_result
    });
  }
  
  // Phase 3: Action phase (main actions)
  const action_result = processActionPhase(character_id, combat_state);
  turn_result.phases_completed.push({
    phase: TurnPhase.ACTION_PHASE,
    result: action_result
  });
  
  // Phase 4: Bonus phase (quick actions)
  const bonus_result = processBonusPhase(character_id, combat_state);
  turn_result.phases_completed.push({
    phase: TurnPhase.BONUS_PHASE,
    result: bonus_result
  });
  
  // Phase 5: End of turn effects
  const end_result = processEndOfTurnPhase(character_id, combat_state);
  turn_result.phases_completed.push({
    phase: TurnPhase.END_OF_TURN,
    result: end_result
  });
  
  turn_result.final_state = combat_state.action_economies.get(character_id);
  
  return {
    success: true,
    turn_result: turn_result
  };
}

function processActionPhase(
  character_id: string,
  combat_state: CombatState
): ActionPhaseResult {
  
  const action_economy = combat_state.action_economies.get(character_id);
  if (!action_economy) {
    return { success: false, reason: 'no_action_economy' };
  }
  
  const actions_taken: ActionResult[] = [];
  
  // Continue taking actions while character has action points
  while (action_economy.action_points_remaining > 0) {
    
    // Get next action from AI or player input
    const next_action = getNextCharacterAction(character_id, combat_state);
    
    if (!next_action) {
      break; // Character chooses to end their turn
    }
    
    // Validate action can be performed
    const validation_result = validateAction(next_action, character_id, combat_state);
    if (!validation_result.valid) {
      actions_taken.push({
        action: next_action,
        success: false,
        reason: validation_result.reason
      });
      continue;
    }
    
    // Check action costs
    const cost_check = checkActionCosts(next_action, action_economy);
    if (!cost_check.can_afford) {
      actions_taken.push({
        action: next_action,
        success: false,
        reason: 'insufficient_action_points'
      });
      break;
    }
    
    // Execute action
    const execution_result = executeAction(next_action, character_id, combat_state);
    actions_taken.push(execution_result);
    
    // Deduct costs if action was successful
    if (execution_result.success) {
      deductActionCosts(next_action, action_economy, cost_check.chosen_cost);
    }
    
    // Process any triggered reactions
    processTriggeredReactions(execution_result, combat_state);
    
    // Check for combo opportunities
    if (execution_result.success && next_action.maintains_combo) {
      updateComboChain(character_id, next_action, combat_state);
    } else {
      clearComboChain(character_id, combat_state);
    }
  }
  
  return {
    success: true,
    actions_taken: actions_taken,
    action_points_remaining: action_economy.action_points_remaining
  };
}
```

### Action Validation and Execution
```typescript
function validateAction(
  action: CombatAction,
  character_id: string,
  combat_state: CombatState
): ActionValidationResult {
  
  const character = combat_state.characters.get(character_id);
  const action_economy = combat_state.action_economies.get(character_id);
  
  if (!character || !action_economy) {
    return { valid: false, reason: 'invalid_character_state' };
  }
  
  // Check if action type is allowed in current phase
  if (!action.valid_phases.includes(action_economy.turn_phase)) {
    return { 
      valid: false, 
      reason: 'wrong_turn_phase',
      current_phase: action_economy.turn_phase,
      required_phases: action.valid_phases
    };
  }
  
  // Check action restrictions from status effects
  for (const restriction of action_economy.action_restrictions) {
    if (restriction.restricted_action === action.action_type) {
      if (restriction.restriction_type === 'blocked') {
        return { valid: false, reason: 'action_blocked_by_status' };
      }
    }
  }
  
  // Check usage limits
  const actions_this_turn = getActionsThisTurn(character_id, action.id, combat_state);
  if (action.max_uses_per_turn && actions_this_turn >= action.max_uses_per_turn) {
    return { valid: false, reason: 'max_uses_per_turn_exceeded' };
  }
  
  const actions_this_combat = getActionsThisCombat(character_id, action.id, combat_state);
  if (action.max_uses_per_combat && actions_this_combat >= action.max_uses_per_combat) {
    return { valid: false, reason: 'max_uses_per_combat_exceeded' };
  }
  
  // Check cooldown
  const last_use = getLastActionUse(character_id, action.id, combat_state);
  if (last_use && action.cooldown_turns) {
    const turns_since_use = combat_state.current_turn - last_use.turn;
    if (turns_since_use < action.cooldown_turns) {
      return { 
        valid: false, 
        reason: 'action_on_cooldown',
        turns_remaining: action.cooldown_turns - turns_since_use
      };
    }
  }
  
  // Check target requirements
  if (action.requires_target) {
    // This would be validated based on the specific action parameters
    // For now, assume target validation happens at execution time
  }
  
  // Check range requirements
  if (action.range_requirements) {
    // Range validation would happen here
  }
  
  return { valid: true };
}

function executeAction(
  action: CombatAction,
  character_id: string,
  combat_state: CombatState
): ActionResult {
  
  try {
    // Record action attempt
    const action_log: ActionLogEntry = {
      character_id: character_id,
      action_id: action.id,
      turn_number: combat_state.current_turn,
      execution_time: new Date(),
      success: false
    };
    
    // Multi-turn action handling
    if (action.casting_time > 0) {
      return initiateMultiTurnAction(action, character_id, combat_state);
    }
    
    // Execute action effects
    let execution_result: ActionExecutionResult = {
      success: true,
      effects_applied: [],
      damage_dealt: 0,
      healing_done: 0,
      targets_affected: []
    };
    
    for (const effect_function of action.effect_functions) {
      const effect_result = executeEffectFunction(
        effect_function,
        action,
        character_id,
        combat_state
      );
      
      execution_result = mergeExecutionResults(execution_result, effect_result);
      
      if (!effect_result.success) {
        execution_result.success = false;
        break;
      }
    }
    
    // Update action log
    action_log.success = execution_result.success;
    action_log.effects = execution_result.effects_applied;
    action_log.targets = execution_result.targets_affected;
    
    combat_state.action_log.push(action_log);
    
    return {
      action: action,
      success: execution_result.success,
      execution_result: execution_result,
      log_entry: action_log
    };
    
  } catch (error) {
    return {
      action: action,
      success: false,
      reason: 'execution_error',
      error_details: error.message
    };
  }
}
```

## Combo System

### Combo Chain Mechanics
```typescript
interface ComboChain {
  character_id: string;
  chain_id: string;
  combo_type: ComboType;
  
  // Chain tracking
  actions_in_chain: string[]; // Action IDs
  current_combo_count: number;
  max_combo_count: number;
  
  // Timing constraints
  started_at_turn: number;
  expires_at_turn: number;
  time_window_per_action: number; // Turns allowed between actions
  
  // Combo effects
  cumulative_bonuses: ComboBonuses;
  finisher_unlocked: boolean;
  available_finishers: string[]; // Action IDs
  
  // Conditions
  combo_conditions: ComboCondition[];
  break_conditions: ComboBreakCondition[];
}

enum ComboType {
  WEAPON_MASTERY = 'weapon_mastery',    // Multiple weapon attacks
  SPELL_SEQUENCE = 'spell_sequence',    // Linked spells
  TACTICAL_CHAIN = 'tactical_chain',    // Movement + attacks
  ELEMENTAL_COMBO = 'elemental_combo',  // Different element spells
  MARTIAL_ARTS = 'martial_arts',       // Unarmed combat chains
  DUAL_WIELD = 'dual_wield',           // Dual weapon techniques
  ASSASSINATION = 'assassination'       // Stealth attack chains
}

interface ComboBonuses {
  damage_multiplier: number;
  accuracy_bonus: number;
  critical_chance_bonus: number;
  action_point_discount: number;
  special_effects: ComboSpecialEffect[];
}

interface ComboCondition {
  condition_type: string;
  required_value: any;
  description: string;
}

interface ComboBreakCondition {
  break_type: string;
  description: string;
  automatic: boolean;
}

// Predefined combo chains
const comboChains: Record<ComboType, ComboChainDefinition> = {
  [ComboType.WEAPON_MASTERY]: {
    id: "weapon_mastery_combo",
    name: "Weapon Mastery Chain",
    description: "Consecutive weapon attacks with increasing precision",
    max_combo_count: 5,
    time_window_per_action: 2,
    
    // Bonuses per combo level
    combo_bonuses: [
      { combo_level: 1, damage_multiplier: 1.0, accuracy_bonus: 0 },
      { combo_level: 2, damage_multiplier: 1.1, accuracy_bonus: 2 },
      { combo_level: 3, damage_multiplier: 1.2, accuracy_bonus: 5 },
      { combo_level: 4, damage_multiplier: 1.35, accuracy_bonus: 8 },
      { combo_level: 5, damage_multiplier: 1.5, accuracy_bonus: 12 }
    ],
    
    conditions: [
      {
        condition_type: "same_weapon_type",
        required_value: true,
        description: "Must use the same weapon type for all attacks"
      },
      {
        condition_type: "all_hits_successful",
        required_value: true,
        description: "All attacks in chain must hit"
      }
    ],
    
    break_conditions: [
      {
        break_type: "missed_attack",
        description: "Missing an attack breaks the combo",
        automatic: true
      },
      {
        break_type: "different_weapon",
        description: "Using a different weapon type breaks the combo",
        automatic: true
      },
      {
        break_type: "time_expired",
        description: "Taking too long between attacks",
        automatic: true
      }
    ],
    
    finisher_actions: [
      {
        action_id: "devastating_strike",
        unlock_requirement: { combo_level: 3 },
        bonus_effects: ["double_damage", "ignore_armor"]
      }
    ]
  },
  
  [ComboType.SPELL_SEQUENCE]: {
    id: "spell_sequence_combo",
    name: "Arcane Sequence",
    description: "Linked spells that amplify each other",
    max_combo_count: 4,
    time_window_per_action: 3,
    
    combo_bonuses: [
      { combo_level: 1, damage_multiplier: 1.0, spell_power_bonus: 0 },
      { combo_level: 2, damage_multiplier: 1.15, spell_power_bonus: 3 },
      { combo_level: 3, damage_multiplier: 1.3, spell_power_bonus: 6 },
      { combo_level: 4, damage_multiplier: 1.5, spell_power_bonus: 10 }
    ],
    
    conditions: [
      {
        condition_type: "spell_schools_different",
        required_value: true,
        description: "Each spell must be from a different school"
      }
    ],
    
    break_conditions: [
      {
        break_type: "spell_failed",
        description: "Failed spell casting breaks the sequence",
        automatic: true
      },
      {
        break_type: "same_school_twice",
        description: "Using same school twice breaks sequence",
        automatic: true
      }
    ],
    
    finisher_actions: [
      {
        action_id: "arcane_explosion",
        unlock_requirement: { combo_level: 4 },
        bonus_effects: ["area_effect", "mana_refund"]
      }
    ]
  }
};

function initializeComboChain(
  character_id: string,
  initial_action: CombatAction,
  combat_state: CombatState
): ComboChain | null {
  
  // Determine if action can start a combo
  if (!initial_action.combo_potential || initial_action.combo_potential.length === 0) {
    return null;
  }
  
  // Find appropriate combo type
  const combo_type = determineComboType(initial_action, character_id, combat_state);
  if (!combo_type) {
    return null;
  }
  
  const combo_definition = comboChains[combo_type];
  if (!combo_definition) {
    return null;
  }
  
  // Create new combo chain
  const combo_chain: ComboChain = {
    character_id: character_id,
    chain_id: generateId(),
    combo_type: combo_type,
    actions_in_chain: [initial_action.id],
    current_combo_count: 1,
    max_combo_count: combo_definition.max_combo_count,
    started_at_turn: combat_state.current_turn,
    expires_at_turn: combat_state.current_turn + combo_definition.time_window_per_action,
    time_window_per_action: combo_definition.time_window_per_action,
    cumulative_bonuses: {
      damage_multiplier: 1.0,
      accuracy_bonus: 0,
      critical_chance_bonus: 0,
      action_point_discount: 0,
      special_effects: []
    },
    finisher_unlocked: false,
    available_finishers: [],
    combo_conditions: combo_definition.conditions,
    break_conditions: combo_definition.break_conditions
  };
  
  return combo_chain;
}

function updateComboChain(
  character_id: string,
  new_action: CombatAction,
  combat_state: CombatState
): ComboUpdateResult {
  
  const action_economy = combat_state.action_economies.get(character_id);
  if (!action_economy || !action_economy.active_combo_chain) {
    return { success: false, reason: 'no_active_combo' };
  }
  
  const combo_chain = action_economy.active_combo_chain;
  
  // Check time constraints
  if (combat_state.current_turn > combo_chain.expires_at_turn) {
    clearComboChain(character_id, combat_state);
    return { success: false, reason: 'combo_expired' };
  }
  
  // Validate combo conditions
  const validation_result = validateComboConditions(
    combo_chain,
    new_action,
    combat_state
  );
  
  if (!validation_result.valid) {
    clearComboChain(character_id, combat_state);
    return { 
      success: false, 
      reason: 'combo_broken',
      break_reason: validation_result.break_reason
    };
  }
  
  // Update combo chain
  combo_chain.actions_in_chain.push(new_action.id);
  combo_chain.current_combo_count++;
  combo_chain.expires_at_turn = combat_state.current_turn + combo_chain.time_window_per_action;
  
  // Calculate new bonuses
  updateComboBonuses(combo_chain, combat_state);
  
  // Check for finisher unlock
  checkFinisherUnlock(combo_chain, combat_state);
  
  return {
    success: true,
    combo_chain: combo_chain,
    new_bonuses: combo_chain.cumulative_bonuses
  };
}
```

## Reaction and Interrupt System

### Reaction Mechanics
```typescript
interface ReactionTrigger {
  trigger_id: string;
  name: string;
  description: string;
  
  // Trigger conditions
  trigger_event: TriggerEvent;
  trigger_source: TriggerSource;
  trigger_conditions: TriggerCondition[];
  
  // Timing
  reaction_window_duration: number; // Seconds for player response
  priority: number; // Higher priority reactions trigger first
  
  // Availability
  available_reactions: string[]; // Reaction action IDs
  character_restrictions?: CharacterRestriction[];
}

enum TriggerEvent {
  ENEMY_ENTERS_RANGE = 'enemy_enters_range',
  ALLY_TAKES_DAMAGE = 'ally_takes_damage',
  SPELL_BEING_CAST = 'spell_being_cast',
  MOVEMENT_NEAR_CHARACTER = 'movement_near_character',
  CRITICAL_HIT_RECEIVED = 'critical_hit_received',
  CHARACTER_BELOW_HP_THRESHOLD = 'character_below_hp_threshold',
  ENEMY_ATTACKS_ALLY = 'enemy_attacks_ally',
  AREA_EFFECT_INCOMING = 'area_effect_incoming'
}

enum TriggerSource {
  ANY_CHARACTER = 'any_character',
  ENEMY_CHARACTER = 'enemy_character',
  ALLY_CHARACTER = 'ally_character',
  SELF = 'self',
  ENVIRONMENTAL = 'environmental'
}

interface TriggerCondition {
  condition_type: string;
  value: any;
  comparison: ComparisonOperator;
}

enum ComparisonOperator {
  EQUALS = 'equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  WITHIN_RANGE = 'within_range'
}

// Reaction actions
const reactionActions: CombatAction[] = [
  {
    id: "opportunity_attack",
    name: "Opportunity Attack",
    description: "Strike an enemy leaving your threat range",
    action_type: ActionType.REACTION,
    action_point_cost: 0, // Reactions don't cost AP
    valid_phases: [TurnPhase.REACTION_WINDOW],
    can_interrupt: true,
    interrupt_priority: 5,
    casting_time: 0,
    concentration_required: false,
    maintains_combo: false,
    requires_target: true,
    range_requirements: {
      min_range: 0,
      max_range: 2,
      requires_line_of_sight: true
    },
    damage_formula: "weapon_damage + STR_modifier - 2", // Slight penalty
    effect_functions: [
      {
        type: "apply_weapon_damage",
        timing: "on_hit"
      }
    ],
    combo_potential: []
  },
  
  {
    id: "protective_block",
    name: "Protective Block",
    description: "Interpose yourself to protect an ally",
    action_type: ActionType.REACTION,
    action_point_cost: 0,
    valid_phases: [TurnPhase.REACTION_WINDOW],
    can_interrupt: true,
    interrupt_priority: 8, // High priority for protection
    casting_time: 0,
    concentration_required: false,
    maintains_combo: false,
    requires_target: true,
    range_requirements: {
      min_range: 0,
      max_range: 3,
      requires_line_of_sight: true
    },
    effect_functions: [
      {
        type: "redirect_damage",
        timing: "before_damage_resolution"
      },
      {
        type: "apply_defense_bonus",
        timing: "damage_calculation"
      }
    ],
    combo_potential: []
  },
  
  {
    id: "counterspell",
    name: "Counterspell",
    description: "Interrupt enemy spellcasting",
    action_type: ActionType.REACTION,
    action_point_cost: 0,
    valid_phases: [TurnPhase.REACTION_WINDOW],
    can_interrupt: true,
    interrupt_priority: 10, // Highest priority
    casting_time: 0,
    concentration_required: true,
    maintains_combo: false,
    requires_target: true,
    range_requirements: {
      min_range: 0,
      max_range: 10,
      requires_line_of_sight: true
    },
    effect_functions: [
      {
        type: "interrupt_spell_casting",
        timing: "spell_resolution"
      }
    ],
    combo_potential: []
  }
];

function processReactionTrigger(
  trigger: ReactionTrigger,
  triggering_event: GameEvent,
  combat_state: CombatState
): ReactionProcessingResult {
  
  // Find characters that can react to this trigger
  const eligible_reactors = findEligibleReactors(trigger, triggering_event, combat_state);
  
  if (eligible_reactors.length === 0) {
    return {
      success: true,
      reactions_triggered: 0,
      message: "No characters can react to this event"
    };
  }
  
  // Sort by reaction priority
  eligible_reactors.sort((a, b) => {
    const a_priority = a.reaction_priority || 0;
    const b_priority = b.reaction_priority || 0;
    return b_priority - a_priority; // Higher priority first
  });
  
  const reaction_results: ReactionResult[] = [];
  
  // Process reactions in priority order
  for (const reactor of eligible_reactors) {
    // Check if character still has reactions available
    const action_economy = combat_state.action_economies.get(reactor.character_id);
    if (!action_economy || action_economy.reaction_actions_used >= action_economy.reaction_budget) {
      continue;
    }
    
    // For AI characters, automatically determine reaction
    let chosen_reaction: CombatAction | null = null;
    if (reactor.is_ai_controlled) {
      chosen_reaction = makeAIReactionDecision(
        reactor.character_id,
        trigger,
        triggering_event,
        combat_state
      );
    } else {
      // For player characters, prompt for reaction choice
      chosen_reaction = promptPlayerReaction(
        reactor.character_id,
        trigger,
        triggering_event,
        combat_state
      );
    }
    
    if (chosen_reaction) {
      // Execute reaction
      const reaction_result = executeReaction(
        chosen_reaction,
        reactor.character_id,
        triggering_event,
        combat_state
      );
      
      reaction_results.push(reaction_result);
      
      // Increment reaction usage
      action_economy.reaction_actions_used++;
      
      // If reaction interrupts, stop processing further reactions
      if (chosen_reaction.can_interrupt && reaction_result.success) {
        break;
      }
    }
  }
  
  return {
    success: true,
    reactions_triggered: reaction_results.length,
    reaction_results: reaction_results
  };
}
```

## AI Integration

### AI Action Economy Strategy
```typescript
interface AIActionStrategy {
  // Action prioritization
  action_priorities: ActionPriority[];
  
  // Economy management
  action_point_conservation: number; // 0-1, how much to save
  prefers_many_small_actions: boolean;
  prefers_few_large_actions: boolean;
  
  // Combo preferences
  seeks_combo_opportunities: boolean;
  combo_risk_tolerance: number; // 0-1
  preferred_combo_types: ComboType[];
  
  // Reaction behavior
  reaction_aggressiveness: number; // 0-1
  protects_allies: boolean;
  interrupts_enemies: boolean;
  
  // Turn planning
  plans_full_turn: boolean;
  adapts_to_opportunities: boolean;
  reserves_actions_for_reactions: boolean;
}

interface ActionPriority {
  action_category: ActionCategory;
  priority_weight: number;
  conditions: ActionCondition[];
}

enum ActionCategory {
  DAMAGE_DEALING = 'damage_dealing',
  HEALING = 'healing', 
  BUFFING = 'buffing',
  DEBUFFING = 'debuffing',
  POSITIONING = 'positioning',
  DEFENSE = 'defense',
  UTILITY = 'utility'
}

function makeAIActionDecision(
  character_id: string,
  combat_state: CombatState,
  ai_strategy: AIActionStrategy
): CombatAction | null {
  
  const action_economy = combat_state.action_economies.get(character_id);
  if (!action_economy || action_economy.action_points_remaining <= 0) {
    return null;
  }
  
  // Evaluate current situation
  const situation_assessment = assessCombatSituation(character_id, combat_state);
  
  // Get available actions for current phase
  const available_actions = getAvailableActions(
    character_id,
    action_economy.turn_phase,
    combat_state
  );
  
  if (available_actions.length === 0) {
    return null;
  }
  
  // Score each action based on strategy and situation
  const action_scores: ActionScore[] = [];
  
  for (const action of available_actions) {
    const score = scoreAction(
      action,
      character_id,
      situation_assessment,
      ai_strategy,
      combat_state
    );
    
    action_scores.push({
      action: action,
      score: score.total_score,
      score_breakdown: score.breakdown
    });
  }
  
  // Sort by score
  action_scores.sort((a, b) => b.score - a.score);
  
  // Apply some randomness to prevent predictable behavior
  const top_actions = action_scores.slice(0, Math.min(3, action_scores.length));
  const chosen_action = weightedRandomSelect(top_actions);
  
  return chosen_action.action;
}

function scoreAction(
  action: CombatAction,
  character_id: string,
  situation: SituationAssessment,
  strategy: AIActionStrategy,
  combat_state: CombatState
): ActionScoreDetails {
  
  let total_score = 0;
  const breakdown: ScoreBreakdown = {};
  
  // Base action value
  const base_value = calculateBaseActionValue(action, character_id, combat_state);
  total_score += base_value;
  breakdown.base_value = base_value;
  
  // Situation modifiers
  const situation_modifier = calculateSituationModifier(action, situation);
  total_score += situation_modifier;
  breakdown.situation_modifier = situation_modifier;
  
  // Strategy alignment
  const strategy_alignment = calculateStrategyAlignment(action, strategy);
  total_score += strategy_alignment;
  breakdown.strategy_alignment = strategy_alignment;
  
  // Action economy efficiency
  const efficiency_score = calculateEfficiencyScore(action, character_id, combat_state);
  total_score += efficiency_score;
  breakdown.efficiency_score = efficiency_score;
  
  // Combo potential
  if (strategy.seeks_combo_opportunities) {
    const combo_score = calculateComboScore(action, character_id, combat_state);
    total_score += combo_score;
    breakdown.combo_score = combo_score;
  }
  
  // Risk assessment
  const risk_penalty = calculateRiskPenalty(action, character_id, combat_state);
  total_score -= risk_penalty;
  breakdown.risk_penalty = risk_penalty;
  
  return {
    total_score: total_score,
    breakdown: breakdown
  };
}

function calculateBaseActionValue(
  action: CombatAction,
  character_id: string,
  combat_state: CombatState
): number {
  
  const character = combat_state.characters.get(character_id);
  if (!character) return 0;
  
  let value = 0;
  
  // Damage potential
  if (action.damage_formula) {
    const estimated_damage = estimateActionDamage(action, character);
    value += estimated_damage * 2; // 2 points per damage point
  }
  
  // Healing potential
  const healing_potential = estimateActionHealing(action, character);
  value += healing_potential * 3; // 3 points per healing point (more valuable)
  
  // Utility value
  const utility_value = estimateActionUtility(action, character, combat_state);
  value += utility_value;
  
  // Action point efficiency
  if (action.action_point_cost > 0) {
    value = value / action.action_point_cost; // Points per AP spent
  }
  
  return value;
}
```

## Database Schema

```sql
-- Action economy tracking
CREATE TABLE combat_action_economies (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  turn_number INTEGER NOT NULL,
  
  -- Action points
  total_action_points INTEGER NOT NULL,
  action_points_used INTEGER DEFAULT 0,
  action_points_remaining INTEGER NOT NULL,
  
  -- Action type tracking
  standard_actions_used INTEGER DEFAULT 0,
  move_actions_used INTEGER DEFAULT 0,
  bonus_actions_used INTEGER DEFAULT 0,
  reaction_actions_used INTEGER DEFAULT 0,
  
  -- Current state
  turn_phase VARCHAR(20) DEFAULT 'start_of_turn',
  interrupts_available INTEGER DEFAULT 1,
  
  -- Combo tracking
  active_combo_chain_id UUID,
  combo_counter INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(character_id, combat_session_id, turn_number)
);

CREATE TABLE combat_actions_log (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  turn_number INTEGER NOT NULL,
  action_sequence INTEGER NOT NULL, -- Order within turn
  
  -- Action details
  action_id VARCHAR(50) NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(20) NOT NULL,
  action_point_cost INTEGER NOT NULL,
  
  -- Targets and effects
  target_character_ids JSONB DEFAULT '[]',
  target_positions JSONB DEFAULT '[]',
  
  -- Execution results
  execution_successful BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  
  -- Combat effects
  damage_dealt INTEGER DEFAULT 0,
  healing_done INTEGER DEFAULT 0,
  effects_applied JSONB DEFAULT '[]',
  
  -- Timing
  cast_start_time TIMESTAMP DEFAULT NOW(),
  cast_completion_time TIMESTAMP,
  interrupted BOOLEAN DEFAULT FALSE,
  
  -- Context
  combo_chain_id UUID,
  combo_position INTEGER, -- Position in combo chain
  reaction_to_action_id UUID REFERENCES combat_actions_log(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE combo_chains (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  combo_type VARCHAR(30) NOT NULL,
  
  -- Chain progress
  actions_in_chain JSONB NOT NULL, -- Array of action IDs
  current_combo_count INTEGER NOT NULL,
  max_combo_count INTEGER NOT NULL,
  
  -- Timing
  started_at_turn INTEGER NOT NULL,
  expires_at_turn INTEGER NOT NULL,
  time_window_per_action INTEGER NOT NULL,
  
  -- Bonuses and effects
  current_damage_multiplier DECIMAL(4,2) DEFAULT 1.0,
  current_accuracy_bonus INTEGER DEFAULT 0,
  current_critical_bonus INTEGER DEFAULT 0,
  
  -- State
  is_active BOOLEAN DEFAULT TRUE,
  finisher_unlocked BOOLEAN DEFAULT FALSE,
  available_finishers JSONB DEFAULT '[]',
  
  -- Completion
  completed_successfully BOOLEAN,
  break_reason VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE reaction_triggers_log (
  id UUID PRIMARY KEY,
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  trigger_event VARCHAR(50) NOT NULL,
  triggering_action_id UUID REFERENCES combat_actions_log(id),
  
  -- Trigger details
  trigger_source_character_id UUID REFERENCES characters(id),
  trigger_conditions JSONB DEFAULT '{}',
  
  -- Eligible reactors
  eligible_characters JSONB DEFAULT '[]', -- Array of character IDs
  
  -- Reactions taken
  reactions_executed INTEGER DEFAULT 0,
  reaction_details JSONB DEFAULT '[]',
  
  -- Timing
  triggered_at TIMESTAMP DEFAULT NOW(),
  reaction_window_duration INTEGER DEFAULT 10, -- seconds
  
  -- Resolution
  event_interrupted BOOLEAN DEFAULT FALSE,
  interrupting_character_id UUID REFERENCES characters(id)
);

CREATE TABLE multi_turn_actions (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  action_id VARCHAR(50) NOT NULL,
  
  -- Timing
  started_at_turn INTEGER NOT NULL,
  completion_turn INTEGER NOT NULL,
  current_turn INTEGER NOT NULL,
  
  -- State
  casting_time_remaining INTEGER NOT NULL,
  concentration_required BOOLEAN NOT NULL,
  concentration_broken BOOLEAN DEFAULT FALSE,
  
  -- Interruption tracking
  interruption_attempts JSONB DEFAULT '[]',
  
  -- Completion
  completed_successfully BOOLEAN,
  completion_result JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_action_economies_character ON combat_action_economies(character_id);
CREATE INDEX idx_action_economies_combat ON combat_action_economies(combat_session_id);
CREATE INDEX idx_action_economies_turn ON combat_action_economies(turn_number);

CREATE INDEX idx_actions_log_character ON combat_actions_log(character_id);
CREATE INDEX idx_actions_log_combat ON combat_actions_log(combat_session_id);
CREATE INDEX idx_actions_log_turn ON combat_actions_log(turn_number);
CREATE INDEX idx_actions_log_sequence ON combat_actions_log(action_sequence);
CREATE INDEX idx_actions_log_combo ON combat_actions_log(combo_chain_id);

CREATE INDEX idx_combo_chains_character ON combo_chains(character_id);
CREATE INDEX idx_combo_chains_combat ON combo_chains(combat_session_id);
CREATE INDEX idx_combo_chains_active ON combo_chains(is_active);

CREATE INDEX idx_reaction_triggers_combat ON reaction_triggers_log(combat_session_id);
CREATE INDEX idx_reaction_triggers_event ON reaction_triggers_log(trigger_event);
CREATE INDEX idx_reaction_triggers_triggered ON reaction_triggers_log(triggered_at);

CREATE INDEX idx_multi_turn_actions_character ON multi_turn_actions(character_id);
CREATE INDEX idx_multi_turn_actions_combat ON multi_turn_actions(combat_session_id);
CREATE INDEX idx_multi_turn_actions_completion ON multi_turn_actions(completion_turn);
```

## Integration Examples

### Integration con Combat System base e Status Effects
```typescript
// Enhanced combat turn with action economy
function processEnhancedCombatTurn(
  character_id: string,
  combat_state: CombatState
): EnhancedTurnResult {
  
  // Initialize action economy for turn
  const action_economy = initializeActionEconomy(character_id, combat_state);
  
  // Process start-of-turn status effects
  const status_ticks = processStatusEffectTicks(
    character_id,
    TriggerTiming.START_OF_TURN,
    combat_state
  );
  
  // Apply any status effect restrictions to action economy
  applyStatusRestrictionsToActions(character_id, action_economy, combat_state);
  
  // Execute action phases with full economy
  const turn_result = processTurn(character_id, combat_state);
  
  // Apply end-of-turn effects
  const end_effects = processStatusEffectTicks(
    character_id,
    TriggerTiming.END_OF_TURN,
    combat_state
  );
  
  // Clean up expired effects and actions
  cleanupTurnEffects(character_id, combat_state);
  
  return {
    character_id: character_id,
    action_economy_used: action_economy,
    turn_phases: turn_result.phases_completed,
    status_effects: [...status_ticks, ...end_effects],
    final_state: calculatePostTurnState(character_id, combat_state)
  };
}
```

---

Questo Action Economy System fornisce un framework completo per gestire azioni multiple, combo attacks, reazioni e interrupt, espandendo significativamente la profondità tattica del combat system mantenendo la compatibilità con il core D50.
