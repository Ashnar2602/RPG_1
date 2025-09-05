# Damage & Defense System — Specifica completa

Data: 4 settembre 2025

## Overview

Sistema completo per calcolo del danno, difesa e mitigation che si integra con il core D50 system esistente. Mantiene compatibilità totale con formule POWER e statistics, aggiungendo layer di depth per equipment e tactical play.

## Damage Calculation Framework

### Base Damage Structure
```typescript
interface DamageInstance {
  // Input values
  base_damage: number;           // Da weapon/skill base
  attack_stat: number;           // STR per fisico, INT per magico
  attacker_power: number;        // POWER dell'attaccante
  attacker_level: number;
  
  // Modifiers
  critical_hit: boolean;
  damage_type: DamageType;
  weapon_properties: WeaponProperty[];
  situational_modifiers: DamageModifier[];
  
  // Calculated values
  raw_damage: number;            // Pre-defense
  final_damage: number;          // Post-defense
  calculation_breakdown: DamageBreakdown;
}

interface DamageBreakdown {
  base_damage: number;
  stat_bonus: number;
  power_scaling: number;
  critical_multiplier: number;
  weapon_bonus: number;
  situational_bonus: number;
  total_raw_damage: number;
  
  armor_reduction: number;
  resistance_reduction: number;
  final_mitigation: number;
  damage_dealt: number;
}
```

### Damage Calculation Formula
```typescript
function calculateDamage(
  attacker: CombatParticipant,
  target: CombatParticipant,
  attack_source: AttackSource,
  combat_context: CombatContext
): DamageInstance {
  
  // Step 1: Base damage from weapon/skill
  let base_damage = attack_source.base_damage;
  
  // Step 2: Stat scaling
  const attack_stat = getRelevantStat(attack_source.damage_type, attacker.stats);
  const stat_bonus = Math.floor(attack_stat * attack_source.stat_scaling);
  
  // Step 3: Power scaling (integrates with existing POWER calculation)
  const power_bonus = Math.floor(attacker.power * attack_source.power_scaling);
  
  // Step 4: Critical hit multiplier
  let critical_multiplier = 1.0;
  if (attack_source.critical_hit) {
    critical_multiplier = attack_source.critical_damage_multiplier || 1.5;
  }
  
  // Step 5: Weapon properties bonus
  const weapon_bonus = calculateWeaponBonus(
    attack_source.weapon_properties, 
    target, 
    combat_context
  );
  
  // Step 6: Situational modifiers
  const situational_bonus = calculateSituationalModifiers(
    attack_source.situational_modifiers,
    attacker,
    target,
    combat_context
  );
  
  // Calculate raw damage
  const raw_damage = Math.floor(
    (base_damage + stat_bonus + power_bonus + weapon_bonus + situational_bonus) 
    * critical_multiplier
  );
  
  // Step 7: Apply defense mitigation
  const final_damage = applyDefenseMitigation(raw_damage, attack_source, target);
  
  return {
    base_damage: base_damage,
    raw_damage: raw_damage,
    final_damage: final_damage,
    critical_hit: attack_source.critical_hit,
    damage_type: attack_source.damage_type,
    calculation_breakdown: {
      base_damage: base_damage,
      stat_bonus: stat_bonus,
      power_scaling: power_bonus,
      critical_multiplier: critical_multiplier,
      weapon_bonus: weapon_bonus,
      situational_bonus: situational_bonus,
      total_raw_damage: raw_damage,
      damage_dealt: final_damage
      // ... mitigation details filled by applyDefenseMitigation
    }
  };
}
```

## Defense & Mitigation System

### Armor System
```typescript
interface ArmorValue {
  // Physical protection
  physical_armor: number;        // Flat reduction vs physical
  armor_penetration_resistance: number; // 0-100%
  
  // Magical protection  
  magical_resistance: number;    // % reduction vs magical
  spell_penetration_resistance: number; // 0-100%
  
  // Special properties
  armor_properties: ArmorProperty[];
  durability_current: number;
  durability_max: number;
}

enum ArmorProperty {
  REINFORCED = 'reinforced',     // Extra vs crushing
  FLEXIBLE = 'flexible',         // Bonus vs piercing
  ENCHANTED = 'enchanted',       // Magical resistance
  SPIKED = 'spiked',            // Damage reflection
  LIGHTWEIGHT = 'lightweight'    // No movement penalty
}

// Integration with existing equipment system (GAME_MECHANICS.md)
interface EquippedArmor {
  slot: EquipmentSlot;           // head, chest, legs, etc.
  item_id: string;
  armor_value: ArmorValue;
  weight: number;                // For carry capacity
  condition: number;             // 0-100% durability
}
```

### Defense Calculation
```typescript
function applyDefenseMitigation(
  raw_damage: number,
  attack_source: AttackSource,
  target: CombatParticipant
): number {
  
  let mitigated_damage = raw_damage;
  let armor_reduction = 0;
  let resistance_reduction = 0;
  
  // Step 1: Armor mitigation (for physical damage)
  if (attack_source.damage_type === DamageType.PHYSICAL) {
    const total_armor = calculateTotalArmor(target.equipped_armor);
    const effective_armor = calculateEffectiveArmor(
      total_armor,
      attack_source.armor_penetration
    );
    
    armor_reduction = Math.min(
      Math.floor(effective_armor * 0.5), // 50% of armor value
      Math.floor(raw_damage * 0.8)       // Max 80% reduction
    );
    
    mitigated_damage -= armor_reduction;
  }
  
  // Step 2: Elemental/magical resistance
  if (attack_source.damage_type !== DamageType.PHYSICAL) {
    const resistance = getElementalResistance(
      target.resistances,
      attack_source.damage_type
    );
    
    const effective_resistance = calculateEffectiveResistance(
      resistance,
      attack_source.spell_penetration
    );
    
    resistance_reduction = Math.floor(
      mitigated_damage * (effective_resistance / 100)
    );
    
    mitigated_damage -= resistance_reduction;
  }
  
  // Step 3: Stat-based defense (DEX for dodge, WIL for mental)
  const stat_defense = calculateStatDefense(
    target.stats,
    attack_source.damage_type
  );
  
  mitigated_damage = Math.floor(mitigated_damage * (1 - stat_defense));
  
  // Minimum damage (always deal at least 1 damage)
  const final_damage = Math.max(1, mitigated_damage);
  
  // Update breakdown for logging
  target.last_damage_breakdown = {
    armor_reduction: armor_reduction,
    resistance_reduction: resistance_reduction,
    final_mitigation: raw_damage - final_damage,
    damage_dealt: final_damage
  };
  
  return final_damage;
}
```

### Penetration Mechanics
```typescript
interface PenetrationValues {
  armor_penetration: number;     // Flat armor ignored
  armor_penetration_percent: number; // % armor ignored
  spell_penetration: number;     // Flat resistance ignored
  spell_penetration_percent: number; // % resistance ignored
}

function calculateEffectiveArmor(
  base_armor: number,
  penetration: PenetrationValues
): number {
  
  // Apply flat penetration first
  let effective_armor = Math.max(0, base_armor - penetration.armor_penetration);
  
  // Apply percentage penetration
  effective_armor = Math.floor(
    effective_armor * (1 - penetration.armor_penetration_percent / 100)
  );
  
  return Math.max(0, effective_armor);
}
```

## Damage Variance & Scaling

### Damage Scaling by Level
```typescript
interface DamageScaling {
  base_damage: number;
  level_scaling: number;         // Damage per level
  stat_scaling: number;          // Multiplier for stat bonus
  power_scaling: number;         // Multiplier for POWER bonus
  
  // Level difference modifiers
  level_advantage_bonus: number; // Bonus per level above target
  level_disadvantage_penalty: number; // Penalty per level below target
}

function calculateLevelScaling(
  attacker_level: number,
  target_level: number,
  scaling: DamageScaling
): number {
  
  const level_difference = attacker_level - target_level;
  
  if (level_difference > 0) {
    // Attacker higher level
    return 1 + (level_difference * scaling.level_advantage_bonus);
  } else if (level_difference < 0) {
    // Attacker lower level  
    return 1 + (Math.abs(level_difference) * scaling.level_disadvantage_penalty);
  }
  
  return 1.0; // Same level
}
```

### Damage Variance
```typescript
interface DamageVariance {
  base_variance: number;         // ±% base damage variation
  stat_variance: number;         // ±% stat bonus variation  
  critical_variance: number;     // ±% critical damage variation
  
  // Consistency factors
  weapon_consistency: number;    // Higher = less variance
  skill_consistency: number;     // Higher = less variance
}

function applyDamageVariance(
  calculated_damage: number,
  variance_config: DamageVariance
): number {
  
  // Base random factor (-variance to +variance)
  const variance_factor = 
    (Math.random() * 2 - 1) * variance_config.base_variance / 100;
  
  // Apply consistency modifiers (reduce variance)
  const consistency_factor = 
    (variance_config.weapon_consistency + variance_config.skill_consistency) / 200;
  
  const final_variance = variance_factor * (1 - consistency_factor);
  
  return Math.floor(calculated_damage * (1 + final_variance));
}
```

## Integration con Equipment System

### Weapon Damage Properties
```typescript
// Extends existing equipment from GAME_MECHANICS.md
interface WeaponDamageData {
  base_damage: number;
  damage_type: DamageType;
  stat_scaling: StatScaling;
  
  // Special properties
  armor_penetration: number;
  critical_chance_bonus: number;
  critical_damage_bonus: number;
  
  // Attack speed
  attack_speed_modifier: number; // Affects initiative
  
  // Range
  effective_range: WeaponRange;
  range_penalties: RangePenalty[];
}

interface StatScaling {
  primary_stat: StatType;        // STR, INT, DEX, etc.
  scaling_factor: number;        // Multiplier for stat bonus
  secondary_stat?: StatType;     // Optional secondary scaling
  secondary_factor?: number;
}

enum WeaponRange {
  MELEE = 'melee',              // Adjacent only
  REACH = 'reach',              // 1-2 positions
  RANGED = 'ranged',            // Long distance
  THROWN = 'thrown'             // Consumed on use
}
```

### Armor Integration
```typescript
// Extends existing equipment system
interface ArmorPiece {
  // From existing GAME_MECHANICS.md
  slot: EquipmentSlot;
  weight_kg: number;
  durability: number;
  
  // New damage/defense properties
  armor_value: ArmorValue;
  movement_penalty: number;      // Affects DEX-based checks
  stealth_penalty: number;       // Affects stealth abilities
  
  // Special properties
  set_bonus_id?: string;         // For armor sets
  enchantments: ArmorEnchantment[];
}

interface ArmorEnchantment {
  enchantment_id: string;
  effect_type: 'resistance' | 'bonus_stat' | 'special_ability';
  effect_value: number;
  duration_type: 'permanent' | 'charges' | 'time_limited';
}
```

## Critical Hit System

### Critical Mechanics
```typescript
interface CriticalHitData {
  base_chance: number;           // Base crit chance %
  stat_bonus: number;            // Bonus from stats (DEX, LCK)
  weapon_bonus: number;          // Bonus from weapon
  skill_bonus: number;           // Bonus from abilities
  situational_bonus: number;     // Flanking, status effects, etc.
  
  total_chance: number;          // Final crit chance
  damage_multiplier: number;     // How much extra damage
  special_effects: CriticalEffect[]; // Additional effects on crit
}

enum CriticalEffect {
  BLEED = 'bleed',              // DoT effect
  STUN = 'stun',                // Skip next turn
  ARMOR_BREAK = 'armor_break',   // Reduce target armor temporarily
  WEAPON_BREAK = 'weapon_break', // Damage target weapon
  KNOCKDOWN = 'knockdown'        // Position effect
}

// Integration with existing D50 system
function checkCriticalHit(
  d50_result: number,
  critical_data: CriticalHitData,
  luck_stat: number
): boolean {
  
  // Base critical threshold (70+ from existing system)
  const base_threshold = 70;
  
  // Enhanced threshold with bonuses
  const enhanced_threshold = base_threshold - critical_data.total_chance;
  
  // Check if D50 result meets threshold
  if (d50_result >= Math.max(base_threshold, enhanced_threshold)) {
    return true;
  }
  
  // Luck-based second chance (maintains existing Luck integration)
  const luck_threshold = 95 - Math.floor(luck_stat / 2);
  return d50_result >= luck_threshold;
}
```

## Damage Over Time (DoT) System

### DoT Framework
```typescript
interface DamageOverTime {
  dot_id: string;
  source_type: 'weapon' | 'skill' | 'environmental';
  source_id: string;
  
  damage_per_tick: number;
  tick_interval: number;         // Turns between ticks
  total_duration: number;        // Total turns
  remaining_duration: number;
  
  damage_type: DamageType;
  can_stack: boolean;
  stack_behavior: 'additive' | 'refresh' | 'intensify';
  
  // Visual/narrative
  description: string;
  tick_message: string;
}

function processDamageOverTime(
  target: CombatParticipant,
  current_turn: number
): DoTResult[] {
  
  const results: DoTResult[] = [];
  
  for (const dot of target.active_dots) {
    if (current_turn % dot.tick_interval === 0) {
      
      // Calculate DoT damage (bypasses armor, but not resistances)
      const dot_damage = calculateDoTDamage(dot, target);
      
      // Apply damage
      target.current_hp -= dot_damage;
      
      // Record result
      results.push({
        dot_id: dot.dot_id,
        damage_dealt: dot_damage,
        target_id: target.id,
        remaining_duration: dot.remaining_duration - 1
      });
      
      // Reduce duration
      dot.remaining_duration--;
      
      // Remove if expired
      if (dot.remaining_duration <= 0) {
        removeDamageOverTime(target, dot.dot_id);
      }
    }
  }
  
  return results;
}
```

## Database Schema

```sql
-- Damage calculation tracking
CREATE TABLE damage_instances (
  id UUID PRIMARY KEY,
  combat_session_id UUID REFERENCES combat_sessions(id),
  attacker_id UUID REFERENCES characters(id),
  target_id UUID REFERENCES characters(id),
  
  -- Damage details
  base_damage INTEGER NOT NULL,
  raw_damage INTEGER NOT NULL,
  final_damage INTEGER NOT NULL,
  damage_type VARCHAR(20) NOT NULL,
  critical_hit BOOLEAN DEFAULT FALSE,
  
  -- Calculation breakdown (for debugging/analysis)
  calculation_breakdown JSONB NOT NULL,
  
  -- Context
  attack_source VARCHAR(50), -- weapon_id or skill_id
  turn_number INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Armor and defense tracking
CREATE TABLE armor_instances (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  equipment_slot VARCHAR(20) NOT NULL,
  item_id UUID REFERENCES items(id),
  
  -- Armor values
  physical_armor INTEGER DEFAULT 0,
  magical_resistance INTEGER DEFAULT 0,
  armor_properties JSONB DEFAULT '[]',
  
  -- Condition
  current_durability INTEGER NOT NULL,
  max_durability INTEGER NOT NULL,
  
  -- Temporary modifiers
  temporary_bonuses JSONB DEFAULT '[]',
  
  equipped_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Damage over time effects
CREATE TABLE active_dots (
  id UUID PRIMARY KEY,
  target_character_id UUID REFERENCES characters(id),
  source_character_id UUID REFERENCES characters(id),
  
  -- DoT details
  dot_type VARCHAR(50) NOT NULL,
  damage_per_tick INTEGER NOT NULL,
  tick_interval INTEGER DEFAULT 1,
  total_duration INTEGER NOT NULL,
  remaining_duration INTEGER NOT NULL,
  
  damage_type VARCHAR(20) NOT NULL,
  can_stack BOOLEAN DEFAULT FALSE,
  stack_count INTEGER DEFAULT 1,
  
  -- Context
  source_type VARCHAR(20), -- 'weapon', 'skill', 'environmental'
  source_id VARCHAR(50),
  applied_at TIMESTAMP DEFAULT NOW(),
  
  -- Combat tracking
  combat_session_id UUID REFERENCES combat_sessions(id),
  last_tick_turn INTEGER DEFAULT 0
);

-- Critical hit tracking
CREATE TABLE critical_hits (
  id UUID PRIMARY KEY,
  damage_instance_id UUID REFERENCES damage_instances(id),
  
  -- Critical details
  base_chance INTEGER NOT NULL,
  total_chance INTEGER NOT NULL,
  d50_roll INTEGER NOT NULL,
  damage_multiplier FLOAT NOT NULL,
  
  -- Special effects applied
  special_effects JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_damage_instances_combat ON damage_instances(combat_session_id);
CREATE INDEX idx_damage_instances_attacker ON damage_instances(attacker_id);
CREATE INDEX idx_damage_instances_target ON damage_instances(target_id);
CREATE INDEX idx_damage_instances_turn ON damage_instances(turn_number);

CREATE INDEX idx_armor_instances_character ON armor_instances(character_id);
CREATE INDEX idx_armor_instances_item ON armor_instances(item_id);

CREATE INDEX idx_active_dots_target ON active_dots(target_character_id);
CREATE INDEX idx_active_dots_combat ON active_dots(combat_session_id);
CREATE INDEX idx_active_dots_duration ON active_dots(remaining_duration);
```

## API Endpoints

```typescript
// Calculate damage preview (for UI)
POST /api/combat/damage/preview
Body: {
  attacker_id: string,
  target_id: string,
  attack_source: string, // weapon_id or skill_id
  situational_modifiers?: string[]
}
Response: {
  damage_preview: DamagePreview,
  hit_chance: number,
  critical_chance: number,
  estimated_damage_range: { min: number, max: number }
}

// Get combat participant defense info
GET /api/combat/participants/{id}/defense
Response: {
  armor_values: ArmorValue[],
  resistances: ElementalResistance[],
  defensive_stats: DefensiveStats,
  active_defensive_effects: StatusEffect[]
}

// Apply damage (internal combat use)
POST /api/combat/damage/apply
Body: {
  damage_instance: DamageInstance,
  combat_context: CombatContext
}
Response: {
  damage_result: DamageResult,
  target_status: CombatParticipantStatus,
  triggered_effects: TriggeredEffect[]
}

// Get damage statistics
GET /api/characters/{id}/combat/damage-stats
Query: ?time_period=last_week&combat_type=pve
Response: {
  damage_dealt: DamageStats,
  damage_received: DamageStats,
  critical_hit_rate: number,
  average_damage_per_hit: number,
  most_effective_attacks: AttackEffectiveness[]
}
```

## AI Integration

### AI Damage Assessment
```typescript
interface AIDamageStrategy {
  // Target prioritization based on damage efficiency
  prioritize_low_armor: boolean;
  prioritize_vulnerable_types: boolean;
  avoid_resistant_targets: boolean;
  
  // Damage optimization
  prefer_critical_builds: boolean;
  use_armor_penetration: boolean;
  exploit_damage_types: boolean;
  
  // Resource management
  damage_per_resource_threshold: number;
  save_resources_for_big_damage: boolean;
  
  // Risk assessment
  acceptable_damage_variance: number;
  minimum_damage_efficiency: number;
}

function aiSelectBestAttack(
  attacker: CombatParticipant,
  available_targets: CombatParticipant[],
  available_attacks: AttackOption[],
  strategy: AIDamageStrategy
): AttackDecision {
  
  const attack_evaluations: AttackEvaluation[] = [];
  
  for (const target of available_targets) {
    for (const attack of available_attacks) {
      
      // Calculate expected damage
      const damage_preview = calculateDamagePreview(attacker, target, attack);
      
      // Evaluate efficiency
      const efficiency = evaluateAttackEfficiency(
        damage_preview,
        attack.resource_cost,
        strategy
      );
      
      attack_evaluations.push({
        target: target,
        attack: attack,
        expected_damage: damage_preview.average_damage,
        efficiency_score: efficiency,
        success_probability: damage_preview.hit_chance
      });
    }
  }
  
  // Sort by efficiency and select best
  attack_evaluations.sort((a, b) => b.efficiency_score - a.efficiency_score);
  
  return {
    selected_target: attack_evaluations[0].target,
    selected_attack: attack_evaluations[0].attack,
    confidence: attack_evaluations[0].efficiency_score / 100,
    reasoning: generateAttackReasoning(attack_evaluations[0], strategy)
  };
}
```

## Balance Considerations

### Damage Scaling
- **Level 1-10**: Base damage 5-20, armor 2-10
- **Level 11-25**: Base damage 15-60, armor 8-30  
- **Level 26-50**: Base damage 40-150, armor 20-75

### Critical Hit Rates
- **Base chance**: 5% (D50 ≥ 70)
- **High DEX/LCK build**: up to 25%
- **Critical multiplier**: 1.5x base, up to 2.5x with specialization

### Armor Effectiveness
- **Light armor**: 10-30% physical reduction
- **Medium armor**: 25-50% physical reduction  
- **Heavy armor**: 40-70% physical reduction, movement penalties

### Damage Type Distribution
- **Physical**: 60% of attacks, countered by armor
- **Elemental**: 30% of attacks, countered by resistances
- **True damage**: 10% of attacks, bypasses all defenses

---

Questo sistema di damage e defense fornisce depth tattica mantenendo semplicità computazionale e piena compatibilità con il sistema D50 esistente.
