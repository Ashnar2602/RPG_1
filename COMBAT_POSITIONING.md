# Combat Positioning System — Specifica completa

Data: 5 settembre 2025

## Overview

Sistema di posizionamento tattico per il combat system che aggiunge profondità strategica mantenendo la semplicità del core D50. Include formazioni, manovre tattiche, controllo del terreno e integrazione completa con AI autoplay.

## Core Positioning Framework

### Position Grid System
```typescript
interface CombatGrid {
  // Grid properties
  width: number;
  height: number;
  cell_size: number; // meters per cell
  
  // Terrain features
  terrain_cells: Map<string, TerrainType>;
  elevation_map: Map<string, number>;
  
  // Obstacle tracking
  obstacles: CombatObstacle[];
  cover_points: CoverPoint[];
  
  // Environmental effects
  area_effects: AreaEffect[];
  
  // Line of sight cache
  los_cache: Map<string, boolean>;
}

interface Position {
  x: number;
  y: number;
  facing_direction?: Direction; // North, South, East, West, etc.
  elevation?: number;
}

interface CombatObstacle {
  id: string;
  positions: Position[];
  obstacle_type: ObstacleType;
  height: number;
  provides_cover: boolean;
  blocks_movement: boolean;
  blocks_line_of_sight: boolean;
  destructible?: boolean;
  current_hp?: number;
}

enum TerrainType {
  NORMAL = 'normal',
  DIFFICULT = 'difficult',    // +1 movement cost
  HAZARDOUS = 'hazardous',   // Damage per turn
  WATER = 'water',           // Swimming required
  LAVA = 'lava',             // High fire damage
  ICE = 'ice',               // Slippery (slip chance)
  SWAMP = 'swamp',           // Movement penalties
  ELEVATED = 'elevated',     // Height advantage
  PIT = 'pit'                // Fall damage risk
}

enum ObstacleType {
  WALL = 'wall',
  PILLAR = 'pillar',
  CRATE = 'crate',
  TREE = 'tree',
  BOULDER = 'boulder',
  MAGICAL_BARRIER = 'magical_barrier',
  TRAP = 'trap',
  DESTRUCTIBLE = 'destructible'
}

enum Direction {
  NORTH = 'north',
  NORTHEAST = 'northeast', 
  EAST = 'east',
  SOUTHEAST = 'southeast',
  SOUTH = 'south',
  SOUTHWEST = 'southwest',
  WEST = 'west',
  NORTHWEST = 'northwest'
}
```

### Character Positioning
```typescript
interface CharacterPosition {
  character_id: string;
  position: Position;
  
  // Movement tracking
  movement_used: number;
  movement_remaining: number;
  max_movement_per_turn: number;
  
  // Stance and orientation
  stance: CombatStance;
  facing_direction: Direction;
  
  // Tactical state
  in_cover: boolean;
  cover_quality: CoverQuality;
  has_high_ground: boolean;
  flanked: boolean;
  surrounded: boolean;
  
  // Zone control
  threatens_positions: Position[];
  threatened_by: string[]; // Character IDs
}

enum CombatStance {
  AGGRESSIVE = 'aggressive',    // +damage, -defense
  DEFENSIVE = 'defensive',      // +defense, -damage
  BALANCED = 'balanced',        // No modifiers
  MOBILE = 'mobile',           // +movement, -accuracy
  PRONE = 'prone',             // +cover, very limited movement
  STEALTH = 'stealth'          // Hidden positioning
}

enum CoverQuality {
  NONE = 'none',           // 0% protection
  PARTIAL = 'partial',     // 25% damage reduction
  GOOD = 'good',          // 50% damage reduction  
  EXCELLENT = 'excellent'  // 75% damage reduction
}
```

## Movement and Maneuvering

### Movement Mechanics
```typescript
function calculateMovementCost(
  from: Position,
  to: Position,
  character: Character,
  grid: CombatGrid
): MovementResult {
  
  const base_distance = calculateDistance(from, to);
  let movement_cost = base_distance;
  
  // Terrain modifiers
  const path = calculatePath(from, to, grid);
  for (const cell of path) {
    const terrain = grid.terrain_cells.get(`${cell.x},${cell.y}`) || TerrainType.NORMAL;
    
    switch (terrain) {
      case TerrainType.DIFFICULT:
        movement_cost += 1; // Each cell costs +1 extra
        break;
      case TerrainType.WATER:
        if (!character.abilities.includes('swim')) {
          movement_cost += 2;
        }
        break;
      case TerrainType.ICE:
        // Slip chance
        if (Math.random() < 0.2) {
          return {
            success: false,
            reason: 'slipped_on_ice',
            movement_cost: 0,
            fall_damage: calculateFallDamage(character)
          };
        }
        break;
    }
  }
  
  // Opportunity attack considerations
  const threatened_cells = findThreatenedCells(from, to, grid);
  const opportunity_attacks = [];
  
  for (const cell of threatened_cells) {
    const threatening_characters = findThreateningCharacters(cell, grid);
    for (const threatener of threatening_characters) {
      if (canMakeOpportunityAttack(threatener, character)) {
        opportunity_attacks.push({
          attacker: threatener,
          position: cell
        });
      }
    }
  }
  
  return {
    success: true,
    movement_cost: Math.round(movement_cost),
    path: path,
    opportunity_attacks: opportunity_attacks,
    terrain_effects: calculateTerrainEffects(path, grid)
  };
}

function executeMovement(
  character_id: string,
  target_position: Position,
  combat_state: CombatState
): MovementExecutionResult {
  
  const character_pos = combat_state.positions.get(character_id);
  if (!character_pos) {
    return { success: false, reason: 'character_not_found' };
  }
  
  // Calculate movement cost
  const movement_result = calculateMovementCost(
    character_pos.position,
    target_position,
    combat_state.characters.get(character_id),
    combat_state.grid
  );
  
  if (!movement_result.success) {
    return { success: false, reason: movement_result.reason };
  }
  
  // Check if character has enough movement
  if (movement_result.movement_cost > character_pos.movement_remaining) {
    return { 
      success: false, 
      reason: 'insufficient_movement',
      required: movement_result.movement_cost,
      available: character_pos.movement_remaining
    };
  }
  
  // Execute opportunity attacks
  const opportunity_results = [];
  for (const opp_attack of movement_result.opportunity_attacks) {
    const attack_result = executeOpportunityAttack(opp_attack.attacker, character_id, combat_state);
    opportunity_results.push(attack_result);
    
    // If character is knocked down or killed, movement fails
    if (attack_result.movement_stopped) {
      return {
        success: false,
        reason: 'movement_interrupted',
        opportunity_attacks: opportunity_results,
        final_position: attack_result.position
      };
    }
  }
  
  // Update character position
  character_pos.position = target_position;
  character_pos.movement_used += movement_result.movement_cost;
  character_pos.movement_remaining -= movement_result.movement_cost;
  
  // Update tactical state
  updateTacticalState(character_id, combat_state);
  
  return {
    success: true,
    final_position: target_position,
    movement_cost: movement_result.movement_cost,
    opportunity_attacks: opportunity_results,
    terrain_effects: movement_result.terrain_effects
  };
}
```

### Tactical Manoeuvers
```typescript
interface TacticalManeuver {
  id: string;
  name: string;
  description: string;
  
  // Requirements
  required_movement: number;
  required_actions: number;
  stat_requirements: Record<string, number>;
  
  // Effects
  position_changes: PositionChange[];
  stat_modifiers: StatModifier[];
  special_effects: SpecialEffect[];
  
  // Limitations
  max_uses_per_combat?: number;
  cooldown_turns?: number;
  requires_target: boolean;
}

interface PositionChange {
  movement_type: MovementType;
  distance: number;
  direction?: Direction;
  relative_to_target?: boolean;
}

enum MovementType {
  CHARGE = 'charge',           // Fast movement toward target
  RETREAT = 'retreat',         // Controlled withdrawal
  FLANK = 'flank',            // Move to target's side/rear
  DODGE = 'dodge',            // Evasive movement
  LEAP = 'leap',              // Jump over obstacles
  TELEPORT = 'teleport',      // Magical repositioning
  GRAPPLE_MOVE = 'grapple_move' // Forced movement of target
}

// Predefined tactical maneuvers
const tacticalManeuvers: TacticalManeuver[] = [
  {
    id: "charge",
    name: "Charge",
    description: "Rush toward an enemy for a powerful attack",
    required_movement: 3,
    required_actions: 1,
    stat_requirements: { "STR": 12 },
    position_changes: [
      {
        movement_type: MovementType.CHARGE,
        distance: 5,
        relative_to_target: true
      }
    ],
    stat_modifiers: [
      { stat_name: "damage_bonus", modifier_type: ModifierType.ADDITIVE, value: 10 },
      { stat_name: "accuracy", modifier_type: ModifierType.ADDITIVE, value: -5 }
    ],
    special_effects: [
      {
        effect_type: "knockback_chance",
        value: 0.3,
        target_affected: true
      }
    ],
    requires_target: true
  },
  
  {
    id: "tactical_retreat",
    name: "Tactical Retreat", 
    description: "Withdraw while maintaining defense",
    required_movement: 2,
    required_actions: 0,
    stat_requirements: { "DEX": 10 },
    position_changes: [
      {
        movement_type: MovementType.RETREAT,
        distance: 4,
        relative_to_target: true
      }
    ],
    stat_modifiers: [
      { stat_name: "defense_bonus", modifier_type: ModifierType.ADDITIVE, value: 5 }
    ],
    special_effects: [
      {
        effect_type: "no_opportunity_attacks",
        value: 1
      }
    ],
    requires_target: false
  },
  
  {
    id: "flanking_maneuver",
    name: "Flanking Maneuver",
    description: "Move to attack from an advantageous angle",
    required_movement: 3,
    required_actions: 1,
    stat_requirements: { "DEX": 14, "INT": 10 },
    position_changes: [
      {
        movement_type: MovementType.FLANK,
        distance: 3,
        relative_to_target: true
      }
    ],
    stat_modifiers: [
      { stat_name: "accuracy", modifier_type: ModifierType.ADDITIVE, value: 8 },
      { stat_name: "critical_chance", modifier_type: ModifierType.ADDITIVE, value: 15 }
    ],
    special_effects: [
      {
        effect_type: "ignores_partial_cover",
        value: 1
      }
    ],
    requires_target: true
  }
];

function executeTacticalManeuver(
  character_id: string,
  maneuver_id: string,
  target_id?: string,
  combat_state: CombatState
): ManeuverResult {
  
  const character = combat_state.characters.get(character_id);
  const character_pos = combat_state.positions.get(character_id);
  const maneuver = tacticalManeuvers.find(m => m.id === maneuver_id);
  
  if (!character || !character_pos || !maneuver) {
    return { success: false, reason: 'invalid_parameters' };
  }
  
  // Check requirements
  if (!checkManeuverRequirements(character, character_pos, maneuver)) {
    return { success: false, reason: 'requirements_not_met' };
  }
  
  // Calculate new position
  const new_position = calculateManeuverPosition(
    character_pos.position,
    maneuver,
    target_id ? combat_state.positions.get(target_id)?.position : null
  );
  
  // Execute movement
  const movement_result = executeMovement(character_id, new_position, combat_state);
  if (!movement_result.success) {
    return { success: false, reason: 'movement_failed', details: movement_result };
  }
  
  // Apply maneuver effects
  applyManeuverEffects(character_id, maneuver, combat_state);
  
  return {
    success: true,
    maneuver_executed: maneuver,
    movement_result: movement_result,
    effects_applied: maneuver.stat_modifiers
  };
}
```

## Line of Sight and Cover

### Line of Sight Calculation
```typescript
function calculateLineOfSight(
  from: Position,
  to: Position,
  grid: CombatGrid
): LineOfSightResult {
  
  // Use Bresenham's line algorithm for digital line drawing
  const line_cells = calculateLineCells(from, to);
  
  let blocked = false;
  let blocking_obstacle: CombatObstacle | null = null;
  let cover_quality = CoverQuality.NONE;
  
  for (const cell of line_cells) {
    // Skip start and end cells
    if (cell.equals(from) || cell.equals(to)) continue;
    
    // Check for obstacles
    const obstacle = findObstacleAtPosition(cell, grid);
    if (obstacle && obstacle.blocks_line_of_sight) {
      // Calculate if obstacle actually blocks based on height
      const sight_height = calculateSightHeight(from, to, cell);
      
      if (obstacle.height >= sight_height) {
        blocked = true;
        blocking_obstacle = obstacle;
        break;
      }
    }
    
    // Check terrain elevation
    const elevation_diff = calculateElevationBlocking(from, to, cell, grid);
    if (elevation_diff > 2) { // 2-meter height difference blocks sight
      blocked = true;
      break;
    }
  }
  
  // Calculate cover quality for target position
  if (!blocked) {
    cover_quality = calculateCoverQuality(from, to, grid);
  }
  
  return {
    has_line_of_sight: !blocked,
    blocking_obstacle: blocking_obstacle,
    cover_quality: cover_quality,
    distance: calculateDistance(from, to),
    elevation_advantage: calculateElevationAdvantage(from, to, grid)
  };
}

function calculateCoverQuality(
  attacker_pos: Position,
  target_pos: Position,
  grid: CombatGrid
): CoverQuality {
  
  const nearby_obstacles = findNearbyObstacles(target_pos, 1, grid);
  let best_cover = CoverQuality.NONE;
  
  for (const obstacle of nearby_obstacles) {
    if (obstacle.provides_cover) {
      const cover_angle = calculateCoverAngle(attacker_pos, target_pos, obstacle);
      
      if (cover_angle >= 180) { // Full cover from this angle
        return CoverQuality.EXCELLENT;
      } else if (cover_angle >= 90) {
        best_cover = Math.max(best_cover, CoverQuality.GOOD);
      } else if (cover_angle >= 45) {
        best_cover = Math.max(best_cover, CoverQuality.PARTIAL);
      }
    }
  }
  
  return best_cover;
}
```

### Cover Effects
```typescript
function applyCoverEffects(
  attack_result: AttackResult,
  target_position: CharacterPosition,
  attacker_position: CharacterPosition,
  grid: CombatGrid
): AttackResult {
  
  const cover_quality = target_position.cover_quality;
  let modified_result = { ...attack_result };
  
  switch (cover_quality) {
    case CoverQuality.PARTIAL:
      // 25% damage reduction, -10 to hit
      modified_result.damage_dealt = Math.round(modified_result.damage_dealt * 0.75);
      modified_result.accuracy_modifier -= 10;
      break;
      
    case CoverQuality.GOOD:
      // 50% damage reduction, -20 to hit
      modified_result.damage_dealt = Math.round(modified_result.damage_dealt * 0.5);
      modified_result.accuracy_modifier -= 20;
      break;
      
    case CoverQuality.EXCELLENT:
      // 75% damage reduction, -30 to hit
      modified_result.damage_dealt = Math.round(modified_result.damage_dealt * 0.25);
      modified_result.accuracy_modifier -= 30;
      break;
  }
  
  // Elevation advantage can partially negate cover
  if (attacker_position.has_high_ground) {
    // Reduce cover effectiveness by one level
    const cover_reduction = 0.2; // 20% less cover effectiveness
    modified_result.damage_dealt = Math.round(
      modified_result.damage_dealt * (1 + cover_reduction)
    );
    modified_result.accuracy_modifier += 5;
  }
  
  return modified_result;
}
```

## Formation System

### Formation Definitions
```typescript
interface Formation {
  id: string;
  name: string;
  description: string;
  
  // Size requirements
  min_characters: number;
  max_characters: number;
  
  // Positions relative to formation center
  character_positions: FormationPosition[];
  
  // Formation bonuses
  formation_bonuses: FormationBonus[];
  
  // Requirements
  requires_leader: boolean;
  required_skills?: string[];
  
  // Restrictions
  movement_restrictions: MovementRestriction[];
  facing_requirements: FacingRequirement[];
}

interface FormationPosition {
  role: FormationRole;
  relative_position: Position;
  facing_direction: Direction;
  
  // Role-specific bonuses
  role_bonuses: StatModifier[];
  special_abilities?: string[];
}

enum FormationRole {
  LEADER = 'leader',
  FRONT_LINE = 'front_line',
  SUPPORT = 'support',
  FLANKER = 'flanker',
  REAR_GUARD = 'rear_guard',
  SPECIALIST = 'specialist'
}

interface FormationBonus {
  bonus_type: FormationBonusType;
  value: number;
  applies_to: FormationRole[];
  conditions?: string[];
}

enum FormationBonusType {
  ACCURACY = 'accuracy',
  DAMAGE = 'damage',
  DEFENSE = 'defense',
  MORALE = 'morale',
  MOVEMENT_SPEED = 'movement_speed',
  INITIATIVE = 'initiative',
  SPELL_POWER = 'spell_power'
}

// Predefined formations
const formations: Formation[] = [
  {
    id: "phalanx",
    name: "Phalanx",
    description: "Tight defensive formation with shields front",
    min_characters: 3,
    max_characters: 6,
    character_positions: [
      {
        role: FormationRole.LEADER,
        relative_position: { x: 0, y: -1 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "leadership_bonus", modifier_type: ModifierType.ADDITIVE, value: 5 }
        ]
      },
      {
        role: FormationRole.FRONT_LINE,
        relative_position: { x: -1, y: 0 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "defense", modifier_type: ModifierType.ADDITIVE, value: 8 }
        ]
      },
      {
        role: FormationRole.FRONT_LINE,
        relative_position: { x: 1, y: 0 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "defense", modifier_type: ModifierType.ADDITIVE, value: 8 }
        ]
      }
    ],
    formation_bonuses: [
      {
        bonus_type: FormationBonusType.DEFENSE,
        value: 10,
        applies_to: [FormationRole.FRONT_LINE],
        conditions: ["maintaining_formation", "shields_equipped"]
      }
    ],
    requires_leader: true,
    movement_restrictions: [
      {
        movement_type: MovementType.ALL_MOVEMENT,
        restriction_severity: RestrictionSeverity.MINOR // Formation moves as unit
      }
    ],
    facing_requirements: [
      {
        role: FormationRole.FRONT_LINE,
        required_facing: [Direction.NORTH, Direction.NORTHEAST, Direction.NORTHWEST]
      }
    ]
  },
  
  {
    id: "skirmish_line",
    name: "Skirmish Line",
    description: "Spread formation for ranged combat",
    min_characters: 2,
    max_characters: 8,
    character_positions: [
      {
        role: FormationRole.FLANKER,
        relative_position: { x: -3, y: 0 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "accuracy", modifier_type: ModifierType.ADDITIVE, value: 5 }
        ]
      },
      {
        role: FormationRole.SUPPORT,
        relative_position: { x: 0, y: 0 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "spell_power", modifier_type: ModifierType.ADDITIVE, value: 3 }
        ]
      },
      {
        role: FormationRole.FLANKER,
        relative_position: { x: 3, y: 0 },
        facing_direction: Direction.NORTH,
        role_bonuses: [
          { stat_name: "accuracy", modifier_type: ModifierType.ADDITIVE, value: 5 }
        ]
      }
    ],
    formation_bonuses: [
      {
        bonus_type: FormationBonusType.ACCURACY,
        value: 8,
        applies_to: [FormationRole.FLANKER, FormationRole.SUPPORT],
        conditions: ["clear_line_of_sight"]
      }
    ],
    requires_leader: false,
    movement_restrictions: [],
    facing_requirements: []
  }
];
```

### Formation Management
```typescript
function establishFormation(
  party_members: string[],
  formation_id: string,
  center_position: Position,
  combat_state: CombatState
): FormationResult {
  
  const formation = formations.find(f => f.id === formation_id);
  if (!formation) {
    return { success: false, reason: 'formation_not_found' };
  }
  
  // Validate party size
  if (party_members.length < formation.min_characters || 
      party_members.length > formation.max_characters) {
    return { 
      success: false, 
      reason: 'invalid_party_size',
      required_min: formation.min_characters,
      required_max: formation.max_characters
    };
  }
  
  // Assign roles
  const role_assignments = assignFormationRoles(party_members, formation, combat_state);
  if (!role_assignments.success) {
    return { success: false, reason: 'role_assignment_failed' };
  }
  
  // Calculate positions
  const position_assignments = calculateFormationPositions(
    center_position,
    formation,
    role_assignments.assignments
  );
  
  // Validate positions are available
  for (const assignment of position_assignments) {
    if (!isPositionAvailable(assignment.position, combat_state.grid)) {
      return { 
        success: false, 
        reason: 'position_blocked',
        blocked_position: assignment.position
      };
    }
  }
  
  // Execute formation establishment
  const active_formation: ActiveFormation = {
    id: generateId(),
    formation_id: formation_id,
    center_position: center_position,
    character_assignments: role_assignments.assignments,
    established_at: new Date(),
    is_active: true
  };
  
  // Move characters to positions
  for (const assignment of position_assignments) {
    const movement_result = executeMovement(
      assignment.character_id,
      assignment.position,
      combat_state
    );
    
    if (!movement_result.success) {
      // Rollback formation if any character can't move
      return { 
        success: false, 
        reason: 'character_movement_failed',
        failed_character: assignment.character_id
      };
    }
  }
  
  // Apply formation bonuses
  applyFormationBonuses(active_formation, formation, combat_state);
  
  // Register active formation
  combat_state.active_formations.set(active_formation.id, active_formation);
  
  return {
    success: true,
    formation_established: active_formation,
    position_assignments: position_assignments
  };
}

function maintainFormation(
  formation_id: string,
  combat_state: CombatState
): FormationMaintenanceResult {
  
  const active_formation = combat_state.active_formations.get(formation_id);
  if (!active_formation || !active_formation.is_active) {
    return { success: false, reason: 'formation_not_active' };
  }
  
  const formation_def = formations.find(f => f.id === active_formation.formation_id);
  if (!formation_def) {
    return { success: false, reason: 'formation_definition_missing' };
  }
  
  // Check if formation is still intact
  const integrity_check = checkFormationIntegrity(active_formation, formation_def, combat_state);
  
  if (integrity_check.broken) {
    // Formation has been disrupted
    disbandFormation(formation_id, combat_state);
    return {
      success: false,
      reason: 'formation_disrupted',
      disruption_causes: integrity_check.causes
    };
  }
  
  // Apply ongoing formation bonuses
  refreshFormationBonuses(active_formation, formation_def, combat_state);
  
  return {
    success: true,
    formation_maintained: true,
    integrity_score: integrity_check.integrity_score
  };
}
```

## AI Integration

### AI Positioning Strategy
```typescript
interface AIPositioningStrategy {
  // General preferences
  preferred_range: CombatRange; // MELEE, MEDIUM, LONG
  maintains_formations: boolean;
  uses_cover: boolean;
  seeks_high_ground: boolean;
  
  // Tactical priorities
  protects_allies: boolean;
  focuses_priority_targets: boolean;
  controls_chokepoints: boolean;
  flanks_enemies: boolean;
  
  // Risk tolerance
  risk_tolerance: RiskTolerance; // LOW, MEDIUM, HIGH
  retreats_when_wounded: boolean;
  sacrifices_position_for_damage: boolean;
  
  // Special abilities
  uses_tactical_maneuvers: boolean;
  preferred_maneuvers: string[];
  formation_leadership: boolean;
}

enum CombatRange {
  MELEE = 'melee',      // 1-2 cells
  MEDIUM = 'medium',    // 3-5 cells  
  LONG = 'long'         // 6+ cells
}

enum RiskTolerance {
  LOW = 'low',          // Prioritizes safety
  MEDIUM = 'medium',    // Balanced approach
  HIGH = 'high'         // Aggressive positioning
}

function makeAIPositioningDecision(
  character: Character,
  combat_state: CombatState,
  strategy: AIPositioningStrategy
): PositioningAction | null {
  
  const current_pos = combat_state.positions.get(character.id);
  if (!current_pos) return null;
  
  // Evaluate current position
  const position_assessment = evaluatePosition(
    character,
    current_pos.position,
    combat_state,
    strategy
  );
  
  // If current position is good enough, don't move
  if (position_assessment.score >= 75) {
    return null;
  }
  
  // Find better positions
  const available_positions = findAvailablePositions(
    current_pos.position,
    current_pos.movement_remaining,
    combat_state
  );
  
  let best_position: Position | null = null;
  let best_score = position_assessment.score;
  
  for (const pos of available_positions) {
    const score = evaluatePosition(character, pos, combat_state, strategy);
    if (score.total_score > best_score) {
      best_score = score.total_score;
      best_position = pos;
    }
  }
  
  if (best_position) {
    // Check if we should use a tactical maneuver
    if (strategy.uses_tactical_maneuvers) {
      const maneuver = selectBestManeuver(
        character,
        current_pos.position,
        best_position,
        combat_state,
        strategy
      );
      
      if (maneuver) {
        return {
          action_type: 'tactical_maneuver',
          maneuver_id: maneuver.id,
          target_position: best_position
        };
      }
    }
    
    // Regular movement
    return {
      action_type: 'move',
      target_position: best_position,
      reasoning: position_assessment.weaknesses
    };
  }
  
  return null; // No better position found
}

function evaluatePosition(
  character: Character,
  position: Position,
  combat_state: CombatState,
  strategy: AIPositioningStrategy
): PositionEvaluation {
  
  let score = 50; // Base score
  const factors: EvaluationFactor[] = [];
  
  // Range optimization
  const optimal_range = getOptimalRange(character, strategy);
  const range_score = evaluateRangeOptimization(position, optimal_range, combat_state);
  score += range_score * 0.3;
  factors.push({ type: 'range_optimization', score: range_score });
  
  // Cover evaluation
  if (strategy.uses_cover) {
    const cover_score = evaluateCoverQuality(position, combat_state);
    score += cover_score * 0.2;
    factors.push({ type: 'cover_quality', score: cover_score });
  }
  
  // Tactical advantage
  const tactical_score = evaluateTacticalAdvantage(position, combat_state);
  score += tactical_score * 0.25;
  factors.push({ type: 'tactical_advantage', score: tactical_score });
  
  // Threat assessment
  const threat_score = evaluateThreatLevel(position, character, combat_state);
  score -= threat_score * 0.15; // Subtract because threats are bad
  factors.push({ type: 'threat_level', score: -threat_score });
  
  // Team coordination
  if (strategy.protects_allies) {
    const coordination_score = evaluateTeamCoordination(position, character, combat_state);
    score += coordination_score * 0.1;
    factors.push({ type: 'team_coordination', score: coordination_score });
  }
  
  return {
    total_score: Math.max(0, Math.min(100, score)),
    factors: factors,
    strengths: factors.filter(f => f.score > 0).map(f => f.type),
    weaknesses: factors.filter(f => f.score < 0).map(f => f.type)
  };
}
```

### Formation AI
```typescript
function makeAIFormationDecision(
  party_members: string[],
  combat_state: CombatState,
  ai_strategy: AIStrategy
): FormationAction | null {
  
  // Check if party is large enough for formations
  if (party_members.length < 3) {
    return null; // Too small for meaningful formations
  }
  
  // Evaluate current formation state
  const current_formation = findActiveFormation(party_members, combat_state);
  
  if (current_formation) {
    // Check if current formation is still effective
    const formation_effectiveness = evaluateFormationEffectiveness(
      current_formation,
      combat_state,
      ai_strategy
    );
    
    if (formation_effectiveness < 60) {
      // Current formation is not working, consider changing
      return {
        action_type: 'disband_formation',
        formation_id: current_formation.id,
        reason: 'formation_ineffective'
      };
    } else {
      // Formation is working, maintain it
      return null;
    }
  }
  
  // No current formation, evaluate if we should establish one
  const combat_phase = determineCombatPhase(combat_state);
  
  // Find best formation for current situation
  let best_formation: Formation | null = null;
  let best_score = 0;
  
  for (const formation of formations) {
    if (party_members.length >= formation.min_characters &&
        party_members.length <= formation.max_characters) {
      
      const formation_score = evaluateFormationSuitability(
        formation,
        party_members,
        combat_state,
        ai_strategy
      );
      
      if (formation_score > best_score && formation_score > 70) {
        best_score = formation_score;
        best_formation = formation;
      }
    }
  }
  
  if (best_formation) {
    // Find good position to establish formation
    const formation_position = findOptimalFormationPosition(
      best_formation,
      party_members,
      combat_state
    );
    
    if (formation_position) {
      return {
        action_type: 'establish_formation',
        formation_id: best_formation.id,
        center_position: formation_position,
        party_members: party_members
      };
    }
  }
  
  return null; // No formation action needed
}

function evaluateFormationSuitability(
  formation: Formation,
  party_members: string[],
  combat_state: CombatState,
  ai_strategy: AIStrategy
): number {
  
  let score = 50;
  
  // Check party composition compatibility
  const composition_score = evaluatePartyComposition(formation, party_members, combat_state);
  score += composition_score * 0.3;
  
  // Evaluate tactical situation
  const tactical_score = evaluateTacticalSituation(formation, combat_state);
  score += tactical_score * 0.4;
  
  // Consider enemy positioning
  const enemy_score = evaluateEnemyCounters(formation, combat_state);
  score += enemy_score * 0.2;
  
  // Factor in terrain suitability
  const terrain_score = evaluateTerrainSuitability(formation, combat_state);
  score += terrain_score * 0.1;
  
  return Math.max(0, Math.min(100, score));
}
```

## Database Schema

```sql
-- Combat positioning tables
CREATE TABLE combat_grids (
  id UUID PRIMARY KEY,
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  cell_size DECIMAL(4,2) DEFAULT 1.5, -- meters per cell
  
  -- Terrain data
  terrain_data JSONB DEFAULT '{}', -- Map of cell coordinates to terrain types
  elevation_data JSONB DEFAULT '{}', -- Map of cell coordinates to elevation
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE combat_obstacles (
  id UUID PRIMARY KEY,
  grid_id UUID NOT NULL REFERENCES combat_grids(id),
  obstacle_type VARCHAR(30) NOT NULL,
  
  -- Position data
  positions JSONB NOT NULL, -- Array of {x, y} coordinates
  height DECIMAL(4,2) NOT NULL,
  
  -- Properties
  provides_cover BOOLEAN DEFAULT FALSE,
  blocks_movement BOOLEAN DEFAULT TRUE,
  blocks_line_of_sight BOOLEAN DEFAULT TRUE,
  destructible BOOLEAN DEFAULT FALSE,
  current_hp INTEGER,
  max_hp INTEGER,
  
  -- Metadata
  name VARCHAR(100),
  description TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE character_positions (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  
  -- Current position
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  elevation DECIMAL(4,2) DEFAULT 0,
  facing_direction VARCHAR(10) DEFAULT 'north',
  
  -- Movement tracking
  movement_used INTEGER DEFAULT 0,
  movement_remaining INTEGER NOT NULL,
  max_movement_per_turn INTEGER NOT NULL,
  
  -- Tactical state
  stance VARCHAR(20) DEFAULT 'balanced',
  in_cover BOOLEAN DEFAULT FALSE,
  cover_quality VARCHAR(20) DEFAULT 'none',
  has_high_ground BOOLEAN DEFAULT FALSE,
  flanked BOOLEAN DEFAULT FALSE,
  surrounded BOOLEAN DEFAULT FALSE,
  
  -- Zone control
  threatens_positions JSONB DEFAULT '[]',
  threatened_by JSONB DEFAULT '[]',
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one position per character per combat
  UNIQUE(character_id, combat_session_id)
);

CREATE TABLE active_formations (
  id UUID PRIMARY KEY,
  formation_id VARCHAR(50) NOT NULL,
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  
  -- Formation positioning
  center_position_x INTEGER NOT NULL,
  center_position_y INTEGER NOT NULL,
  facing_direction VARCHAR(10) NOT NULL,
  
  -- Member assignments
  character_assignments JSONB NOT NULL, -- {character_id: role}
  
  -- State tracking
  is_active BOOLEAN DEFAULT TRUE,
  integrity_score INTEGER DEFAULT 100,
  
  -- Formation bonuses applied
  active_bonuses JSONB DEFAULT '[]',
  
  established_at TIMESTAMP DEFAULT NOW(),
  disbanded_at TIMESTAMP,
  
  -- Performance metrics
  formation_effectiveness INTEGER DEFAULT 50,
  disruption_count INTEGER DEFAULT 0
);

CREATE TABLE tactical_maneuvers_log (
  id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  maneuver_id VARCHAR(50) NOT NULL,
  
  -- Execution details
  from_position JSONB NOT NULL, -- {x, y}
  to_position JSONB NOT NULL,   -- {x, y}
  target_character_id UUID REFERENCES characters(id),
  
  -- Results
  execution_successful BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  movement_cost INTEGER,
  
  -- Effects applied
  stat_modifiers_applied JSONB DEFAULT '[]',
  special_effects_triggered JSONB DEFAULT '[]',
  
  executed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cover_calculations (
  id UUID PRIMARY KEY,
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id),
  
  -- Positions involved
  attacker_position JSONB NOT NULL,
  target_position JSONB NOT NULL,
  
  -- Cover analysis
  cover_quality VARCHAR(20) NOT NULL,
  cover_sources JSONB DEFAULT '[]', -- Obstacles providing cover
  
  -- Line of sight data
  has_line_of_sight BOOLEAN NOT NULL,
  blocking_obstacles JSONB DEFAULT '[]',
  distance DECIMAL(6,2) NOT NULL,
  elevation_advantage DECIMAL(4,2) DEFAULT 0,
  
  -- Applied effects
  damage_reduction_percent INTEGER DEFAULT 0,
  accuracy_modifier INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_character_positions_combat ON character_positions(combat_session_id);
CREATE INDEX idx_character_positions_character ON character_positions(character_id);
CREATE INDEX idx_character_positions_location ON character_positions(position_x, position_y);

CREATE INDEX idx_active_formations_combat ON active_formations(combat_session_id);
CREATE INDEX idx_active_formations_active ON active_formations(is_active);

CREATE INDEX idx_maneuvers_log_character ON tactical_maneuvers_log(character_id);
CREATE INDEX idx_maneuvers_log_combat ON tactical_maneuvers_log(combat_session_id);
CREATE INDEX idx_maneuvers_log_executed ON tactical_maneuvers_log(executed_at);

CREATE INDEX idx_cover_calculations_combat ON cover_calculations(combat_session_id);
CREATE INDEX idx_cover_calculations_calculated ON cover_calculations(calculated_at);
```

## Integration Examples

### Integration con Combat System base
```typescript
// Enhanced combat action resolution with positioning
function resolveCombatActionWithPositioning(
  attacker: Character,
  target: Character,
  ability: Ability,
  combat_state: CombatState
): CombatResult {
  
  const attacker_pos = combat_state.positions.get(attacker.id);
  const target_pos = combat_state.positions.get(target.id);
  
  if (!attacker_pos || !target_pos) {
    return { success: false, reason: 'positioning_data_missing' };
  }
  
  // 1. Check range requirements
  const distance = calculateDistance(attacker_pos.position, target_pos.position);
  if (distance > ability.max_range || distance < ability.min_range) {
    return { success: false, reason: 'target_out_of_range' };
  }
  
  // 2. Check line of sight for ranged abilities
  if (ability.requires_line_of_sight) {
    const los_result = calculateLineOfSight(
      attacker_pos.position,
      target_pos.position,
      combat_state.grid
    );
    
    if (!los_result.has_line_of_sight) {
      return { success: false, reason: 'no_line_of_sight' };
    }
  }
  
  // 3. Apply positioning modifiers to base roll
  let accuracy_modifier = 0;
  
  // Elevation advantage
  if (attacker_pos.has_high_ground) {
    accuracy_modifier += 5;
  }
  
  // Flanking bonus
  if (target_pos.flanked) {
    accuracy_modifier += 10;
  }
  
  // Cover penalties
  accuracy_modifier -= getCoverAccuracyPenalty(target_pos.cover_quality);
  
  // 4. Perform base D50 combat resolution with modifiers
  const base_result = resolveCombatAction(attacker, target, ability, {
    accuracy_modifier: accuracy_modifier,
    positioning_context: {
      attacker_position: attacker_pos,
      target_position: target_pos,
      distance: distance
    }
  });
  
  // 5. Apply cover damage reduction
  if (base_result.hit && target_pos.cover_quality !== CoverQuality.NONE) {
    base_result.damage_dealt = applyCoverDamageReduction(
      base_result.damage_dealt,
      target_pos.cover_quality
    );
  }
  
  return base_result;
}
```

---

Questo sistema di Positioning aggiunge profondità tattica significativa mantenendo la compatibilità con il sistema base D50 e integrandosi perfettamente con tutti gli altri sistemi del gioco.
