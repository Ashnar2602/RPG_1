# Combat Damage & Defense System — Specifica completa

Data: 5 settembre 2025

## Overview

Questo sistema espande il Combat System base con calcoli dettagliati di danno, difesa, e mitigazione. Si integra perfettamente con le formule D50 esistenti, equipment system e AI autoplay.

## Damage Calculation Framework

### Base Damage Structure
```typescript
interface DamageInstance {
  // Source information
  source_id: string; // character, npc, or ability ID
  ability_id?: string;
  weapon_id?: string;
  
  // Damage components
  base_damage: number; // Da arma/abilità
  stat_modifier: number; // STR per fisico, INT per magico
  power_scaling: number; // Bonus da POWER stat
  
  // Damage type and properties
  damage_type: DamageType;
  damage_properties: DamageProperty[];
  
  // Critical hit information
  is_critical: boolean;
  critical_multiplier: number; // Default 1.5x
  
  // Final calculation
  total_raw_damage: number;
  mitigated_damage: number;
  final_damage: number;
}

enum DamageType {
  PHYSICAL = 'physical',
  FIRE = 'fire',
  ICE = 'ice',
  LIGHTNING = 'lightning',
  POISON = 'poison',
  HOLY = 'holy',
  DARK = 'dark',
  ARCANE = 'arcane'
}

enum DamageProperty {
  PIERCING = 'piercing',     // Ignora parte dell'armatura
  CRUSHING = 'crushing',     // Extra danno vs armatura leggera
  SLASHING = 'slashing',     // Standard physical
  ELEMENTAL = 'elemental',   // Soggetto a resistenze elementali
  PURE = 'pure',            // Ignora resistenze
  BLEEDING = 'bleeding',     // Causa DOT effect
  STUNNING = 'stunning'      // Può causare stun
}
```

### Damage Calculation Formula
```typescript
function calculateDamage(
  attacker: Character | NPC,
  target: Character | NPC,
  ability: Ability,
  weapon?: Equipment,
  context: CombatContext
): DamageInstance {
  
  // 1. Base damage from weapon/ability
  let base_damage = ability.base_damage;
  if (weapon) {
    base_damage += weapon.damage_rating;
  }
  
  // 2. Stat modifier based on ability type
  const primary_stat = ability.primary_stat; // 'STR', 'INT', etc.
  const stat_value = attacker.stats[primary_stat];
  const stat_modifier = stat_value * ability.stat_scaling; // es. 1.2 per STR abilities
  
  // 3. Power scaling (integrazione con sistema esistente)
  const power_scaling = attacker.calculated_power * ability.power_scaling; // es. 0.5
  
  // 4. Critical hit check (usa sistema D50 esistente)
  const is_critical = context.action_result >= 70; // Threshold da COMBAT_SYSTEM.md
  const critical_multiplier = is_critical ? 1.5 : 1.0;
  
  // 5. Raw damage calculation
  const total_raw_damage = Math.round(
    (base_damage + stat_modifier + power_scaling) * critical_multiplier
  );
  
  // 6. Defense mitigation
  const defense_result = calculateDefense(target, ability.damage_type, ability.damage_properties);
  const mitigated_damage = Math.max(1, total_raw_damage - defense_result.total_reduction);
  
  return {
    source_id: attacker.id,
    ability_id: ability.id,
    weapon_id: weapon?.id,
    base_damage: base_damage,
    stat_modifier: stat_modifier,
    power_scaling: power_scaling,
    damage_type: ability.damage_type,
    damage_properties: ability.damage_properties,
    is_critical: is_critical,
    critical_multiplier: critical_multiplier,
    total_raw_damage: total_raw_damage,
    mitigated_damage: mitigated_damage,
    final_damage: mitigated_damage
  };
}
```

## Defense System

### Defense Structure
```typescript
interface DefenseCalculation {
  // Base defense sources
  armor_rating: number; // Da equipment
  natural_armor: number; // Da creature type/class
  shield_bonus: number; // Da scudo equipaggiato
  
  // Resistances
  damage_resistances: DamageResistance[];
  damage_immunities: DamageType[];
  
  // Temporary modifiers
  spell_defenses: SpellDefense[];
  status_bonuses: StatusBonus[];
  
  // Environmental
  cover_bonus: number; // Da positioning system
  terrain_bonus: number; // Da environmental factors
  
  // Final calculation
  total_armor: number;
  resistance_reduction: number;
  total_reduction: number;
}

interface DamageResistance {
  damage_type: DamageType;
  resistance_percentage: number; // 0-100
  flat_reduction?: number; // Riduzione fissa
  source: string; // "equipment", "racial", "spell"
}

interface SpellDefense {
  spell_id: string;
  defense_bonus: number;
  duration_remaining: number;
  applies_to: DamageType[];
}
```

### Defense Calculation
```typescript
function calculateDefense(
  defender: Character | NPC,
  incoming_damage_type: DamageType,
  damage_properties: DamageProperty[]
): DefenseCalculation {
  
  // 1. Base armor from equipment (integrazione con GAME_MECHANICS.md)
  const equipped_armor = getEquippedArmor(defender);
  let armor_rating = equipped_armor.reduce((total, piece) => total + piece.armor_rating, 0);
  
  // 2. Shield bonus se equipaggiato
  const shield = getEquippedShield(defender);
  const shield_bonus = shield ? shield.defense_bonus : 0;
  
  // 3. Natural armor da creature type
  const natural_armor = defender.natural_armor || 0;
  
  // 4. Piercing property reduction
  if (damage_properties.includes(DamageProperty.PIERCING)) {
    armor_rating = Math.floor(armor_rating * 0.7); // -30% effectiveness
  }
  
  // 5. Total physical defense
  const total_armor = armor_rating + natural_armor + shield_bonus;
  
  // 6. Damage type resistances
  const resistances = defender.damage_resistances || [];
  const applicable_resistance = resistances.find(r => r.damage_type === incoming_damage_type);
  
  let resistance_reduction = 0;
  if (applicable_resistance && !damage_properties.includes(DamageProperty.PURE)) {
    resistance_reduction = applicable_resistance.resistance_percentage / 100;
  }
  
  // 7. Immunity check
  const immunities = defender.damage_immunities || [];
  if (immunities.includes(incoming_damage_type)) {
    resistance_reduction = 1.0; // 100% reduction
  }
  
  return {
    armor_rating: armor_rating,
    natural_armor: natural_armor,
    shield_bonus: shield_bonus,
    damage_resistances: resistances,
    damage_immunities: immunities,
    total_armor: total_armor,
    resistance_reduction: resistance_reduction,
    total_reduction: total_armor + (resistance_reduction * 100) // Simplified for readability
  };
}
```

## Weapon Properties Integration

### Weapon Enhancement
```typescript
interface WeaponCombatData {
  // Basic properties (from GAME_MECHANICS.md)
  damage_rating: number;
  handedness: 1 | 2;
  
  // Combat-specific properties
  damage_type: DamageType;
  damage_properties: DamageProperty[];
  
  // Speed and accuracy
  speed_modifier: number; // Modifica initiative
  accuracy_bonus: number; // Bonus ai tiri D50
  
  // Special effects
  on_hit_effects: OnHitEffect[];
  critical_effects: CriticalEffect[];
  
  // Durability integration
  current_condition: number; // 0-100, affects damage
  condition_penalty: number; // Malus se danneggiata
}

interface OnHitEffect {
  effect_type: 'status' | 'damage' | 'heal' | 'special';
  trigger_chance: number; // 0-1 probability
  effect_data: any;
  duration?: number; // For status effects
}

// Esempio: Spada Fiammeggiante
const flamingSword: WeaponCombatData = {
  damage_rating: 15,
  handedness: 1,
  damage_type: DamageType.PHYSICAL,
  damage_properties: [DamageProperty.SLASHING],
  speed_modifier: 0,
  accuracy_bonus: 2,
  on_hit_effects: [
    {
      effect_type: 'damage',
      trigger_chance: 0.3,
      effect_data: {
        damage_type: DamageType.FIRE,
        damage_amount: 5
      }
    }
  ],
  critical_effects: [
    {
      effect_type: 'status',
      effect_data: {
        status_id: 'burning',
        duration: 3
      }
    }
  ],
  current_condition: 85,
  condition_penalty: 0.15 // -15% danno per wear
};
```

## Armor & Equipment Integration

### Armor Properties
```typescript
interface ArmorCombatData {
  // Basic defense
  armor_rating: number;
  
  // Resistances
  damage_resistances: DamageResistance[];
  
  // Weight and mobility (integrazione con carry system)
  mobility_penalty: number; // Malus a DEX-based actions
  
  // Special properties
  set_bonuses?: SetBonus[]; // Se parte di un set
  enchantments?: Enchantment[];
  
  // Environmental
  environmental_protection: EnvironmentProtection[];
}

interface SetBonus {
  set_name: string;
  pieces_required: number;
  pieces_equipped: number;
  bonus_active: boolean;
  bonus_effects: StatusEffect[];
}

// Esempio: Armatura del Drago
const dragonScaleArmor: ArmorCombatData = {
  armor_rating: 25,
  damage_resistances: [
    {
      damage_type: DamageType.FIRE,
      resistance_percentage: 50,
      source: "armor"
    },
    {
      damage_type: DamageType.PHYSICAL,
      resistance_percentage: 15,
      source: "armor"
    }
  ],
  mobility_penalty: 5, // -5 DEX per heavy armor
  environmental_protection: [
    {
      environment_type: "extreme_heat",
      protection_level: "immune"
    }
  ]
};
```

## Status Effect Integration

### Damage-Related Status Effects
```typescript
interface DamageStatusEffect {
  // Basic status info
  id: string;
  name: string;
  description: string;
  duration_turns: number;
  
  // Damage modification
  damage_multiplier?: number; // Modifica danno inflitto
  damage_taken_multiplier?: number; // Modifica danno ricevuto
  
  // DOT/HOT effects
  tick_damage?: DamageOverTime;
  
  // Restrictions
  prevents_actions?: ActionType[];
  stat_modifiers?: Record<string, number>;
}

interface DamageOverTime {
  damage_type: DamageType;
  damage_per_turn: number;
  can_crit: boolean;
  affected_by_resistances: boolean;
}

// Esempi di status effects
const poisonEffect: DamageStatusEffect = {
  id: "poison",
  name: "Poisoned",
  description: "Takes poison damage each turn",
  duration_turns: 5,
  tick_damage: {
    damage_type: DamageType.POISON,
    damage_per_turn: 8,
    can_crit: false,
    affected_by_resistances: true
  }
};

const rageEffect: DamageStatusEffect = {
  id: "rage",
  name: "Berserker Rage",
  description: "Increased damage but reduced defense",
  duration_turns: 10,
  damage_multiplier: 1.5,
  damage_taken_multiplier: 1.3,
  stat_modifiers: {
    "STR": 5,
    "DEX": -3
  }
};
```

## Critical Hit System Enhancement

### Extended Critical Mechanics
```typescript
interface CriticalHitData {
  // Basic crit info
  is_critical: boolean;
  base_multiplier: number; // 1.5x default
  
  // Enhanced crit calculations
  final_multiplier: number; // After items/abilities
  critical_effects: CriticalEffect[];
  
  // Weapon/ability specific
  weapon_crit_bonus: number;
  ability_crit_bonus: number;
  
  // Lucky/unlucky crits
  is_max_crit: boolean; // D50 roll was 50
  is_lucky_crit: boolean; // Special fortune-based bonus
}

interface CriticalEffect {
  effect_type: 'damage' | 'status' | 'special';
  effect_magnitude: number;
  effect_data: any;
}

function calculateCriticalHit(
  base_damage: number,
  attacker: Character,
  weapon: WeaponCombatData,
  ability: Ability,
  d50_roll: number
): CriticalHitData {
  
  const is_critical = d50_roll >= 70;
  const is_max_crit = d50_roll === 50;
  
  let base_multiplier = 1.5;
  
  // Weapon crit bonus
  const weapon_crit_bonus = weapon?.critical_multiplier || 0;
  
  // Ability crit bonus
  const ability_crit_bonus = ability?.critical_bonus || 0;
  
  // Fortune enhancement (integrazione con LCK stat)
  const fortune_bonus = attacker.stats.LCK > 15 ? 0.1 : 0;
  
  // Max crit bonus
  const max_crit_bonus = is_max_crit ? 0.5 : 0;
  
  const final_multiplier = base_multiplier + weapon_crit_bonus + ability_crit_bonus + fortune_bonus + max_crit_bonus;
  
  return {
    is_critical: is_critical,
    base_multiplier: base_multiplier,
    final_multiplier: final_multiplier,
    critical_effects: weapon?.critical_effects || [],
    weapon_crit_bonus: weapon_crit_bonus,
    ability_crit_bonus: ability_crit_bonus,
    is_max_crit: is_max_crit,
    is_lucky_crit: fortune_bonus > 0
  };
}
```

## Environmental Damage

### Environmental Hazards
```typescript
interface EnvironmentalDamage {
  // Source
  environment_type: string; // "lava", "acid_rain", "freezing"
  location_id: string;
  
  // Damage properties
  damage_per_turn: number;
  damage_type: DamageType;
  
  // Conditions
  triggers: EnvironmentTrigger[];
  immunities: string[]; // Creature types immune
  
  // Mitigation
  equipment_protection: string[]; // Equipment that protects
  spell_protection: string[]; // Spells that protect
}

interface EnvironmentTrigger {
  condition: string; // "end_of_turn", "movement", "action"
  probability: number; // 0-1 chance
}

// Integration con Travel System
function applyEnvironmentalDamage(
  character: Character,
  location: Location,
  trigger: string
): DamageInstance[] {
  
  const env_hazards = location.environmental_hazards || [];
  const damage_instances: DamageInstance[] = [];
  
  for (const hazard of env_hazards) {
    const applicable_trigger = hazard.triggers.find(t => t.condition === trigger);
    
    if (applicable_trigger && Math.random() < applicable_trigger.probability) {
      // Check for protection
      const is_protected = checkEnvironmentalProtection(character, hazard);
      
      if (!is_protected) {
        const damage = {
          source_id: `environment_${location.id}`,
          base_damage: hazard.damage_per_turn,
          stat_modifier: 0,
          power_scaling: 0,
          damage_type: hazard.damage_type,
          damage_properties: [DamageProperty.ELEMENTAL],
          is_critical: false,
          critical_multiplier: 1.0,
          total_raw_damage: hazard.damage_per_turn,
          mitigated_damage: hazard.damage_per_turn, // Environmental damage bypasses armor
          final_damage: hazard.damage_per_turn
        };
        
        damage_instances.push(damage);
      }
    }
  }
  
  return damage_instances;
}
```

## AI Integration

### AI Damage Assessment
```typescript
interface AIDamageStrategy {
  // Target selection based on damage potential
  prioritize_low_defense: boolean;
  exploit_resistances: boolean;
  focus_fire: boolean; // Concentrate on one target
  
  // Damage type preferences
  preferred_damage_types: DamageType[];
  avoid_resistant_targets: boolean;
  
  // Critical hit strategy
  use_crit_abilities_when_available: boolean;
  save_resources_for_crits: boolean;
  
  // Defensive priorities
  use_defensive_abilities_at_hp_threshold: number;
  prioritize_healing: boolean;
  retreat_when_overwhelmed: boolean;
}

function selectOptimalTarget(
  attacker: Character,
  available_targets: (Character | NPC)[],
  ability: Ability,
  strategy: AIDamageStrategy
): Character | NPC | null {
  
  let scored_targets = available_targets.map(target => {
    // Calculate expected damage
    const predicted_damage = predictDamageOutput(attacker, target, ability);
    
    // Calculate target threat level
    const threat_score = calculateThreatScore(target, attacker);
    
    // Calculate strategic value
    let strategic_value = 0;
    if (strategy.prioritize_low_defense && predicted_damage.final_damage > predicted_damage.total_raw_damage * 0.8) {
      strategic_value += 20;
    }
    
    if (strategy.focus_fire && target.current_hp < target.max_hp * 0.5) {
      strategic_value += 30; // Finish off wounded targets
    }
    
    return {
      target: target,
      predicted_damage: predicted_damage.final_damage,
      threat_score: threat_score,
      strategic_value: strategic_value,
      total_score: predicted_damage.final_damage + threat_score + strategic_value
    };
  });
  
  // Sort by total score and return best target
  scored_targets.sort((a, b) => b.total_score - a.total_score);
  return scored_targets.length > 0 ? scored_targets[0].target : null;
}
```

## Database Schema Extensions

```sql
-- Extend existing combat system tables

-- Damage instances log (for analytics and debugging)
CREATE TABLE damage_instances (
  id UUID PRIMARY KEY,
  combat_session_id UUID REFERENCES combat_sessions(id),
  source_character_id UUID REFERENCES characters(id),
  target_character_id UUID REFERENCES characters(id),
  
  -- Damage breakdown
  base_damage INTEGER NOT NULL,
  stat_modifier INTEGER DEFAULT 0,
  power_scaling INTEGER DEFAULT 0,
  total_raw_damage INTEGER NOT NULL,
  mitigated_damage INTEGER NOT NULL,
  final_damage INTEGER NOT NULL,
  
  -- Damage properties
  damage_type VARCHAR(20) NOT NULL,
  damage_properties TEXT[] DEFAULT '{}',
  is_critical BOOLEAN DEFAULT FALSE,
  critical_multiplier FLOAT DEFAULT 1.0,
  
  -- Context
  ability_id VARCHAR(50),
  weapon_id UUID REFERENCES items(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Defense calculations cache
CREATE TABLE defense_calculations (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  
  -- Armor values
  base_armor INTEGER DEFAULT 0,
  equipment_armor INTEGER DEFAULT 0,
  bonus_armor INTEGER DEFAULT 0,
  total_armor INTEGER DEFAULT 0,
  
  -- Resistances (JSON for flexibility)
  damage_resistances JSONB DEFAULT '[]',
  damage_immunities TEXT[] DEFAULT '{}',
  
  -- Temporary modifiers
  active_spell_defenses JSONB DEFAULT '[]',
  status_bonuses JSONB DEFAULT '[]',
  
  -- Cache timestamp
  calculated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- Status effects tracking
CREATE TABLE active_status_effects (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  
  -- Effect details
  effect_id VARCHAR(50) NOT NULL,
  effect_name VARCHAR(100) NOT NULL,
  effect_type VARCHAR(20) NOT NULL,
  
  -- Duration
  duration_turns INTEGER NOT NULL,
  turns_remaining INTEGER NOT NULL,
  
  -- Effect data
  stat_modifiers JSONB DEFAULT '{}',
  damage_modifiers JSONB DEFAULT '{}',
  tick_effects JSONB DEFAULT '{}',
  restrictions TEXT[] DEFAULT '{}',
  
  -- Source tracking
  source_character_id UUID REFERENCES characters(id),
  source_ability_id VARCHAR(50),
  
  -- Timestamps
  applied_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Environmental damage tracking
CREATE TABLE environmental_damage_log (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  location_id UUID REFERENCES locations(id),
  
  -- Damage details
  damage_type VARCHAR(20) NOT NULL,
  damage_amount INTEGER NOT NULL,
  
  -- Environment details
  environment_type VARCHAR(50) NOT NULL,
  trigger_condition VARCHAR(50) NOT NULL,
  
  -- Protection
  was_protected BOOLEAN DEFAULT FALSE,
  protection_source VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_damage_instances_combat_session ON damage_instances(combat_session_id);
CREATE INDEX idx_damage_instances_source ON damage_instances(source_character_id);
CREATE INDEX idx_damage_instances_target ON damage_instances(target_character_id);
CREATE INDEX idx_damage_instances_created ON damage_instances(created_at);

CREATE INDEX idx_defense_calculations_character ON defense_calculations(character_id);
CREATE INDEX idx_defense_calculations_expires ON defense_calculations(expires_at);

CREATE INDEX idx_active_status_effects_character ON active_status_effects(character_id);
CREATE INDEX idx_active_status_effects_expires ON active_status_effects(expires_at);

CREATE INDEX idx_environmental_damage_character ON environmental_damage_log(character_id);
CREATE INDEX idx_environmental_damage_location ON environmental_damage_log(location_id);
```

## Integration Examples

### Integration con Equipment System
```typescript
// Quando un item viene equipaggiato, aggiorna defense cache
function onEquipmentChange(character_id: string, item: Equipment): void {
  // Invalidate defense cache
  invalidateDefenseCache(character_id);
  
  // Se l'item ha proprietà speciali, applicale
  if (item.combat_properties) {
    applyEquipmentCombatEffects(character_id, item.combat_properties);
  }
  
  // Aggiorna resistances se necessario
  updateCharacterResistances(character_id);
}
```

### Integration con Travel System
```typescript
// Quando si entra in una location, controlla environmental hazards
function onLocationEnter(character_id: string, location_id: string): void {
  const location = getLocation(location_id);
  const character = getCharacter(character_id);
  
  // Apply immediate environmental effects
  const immediate_damage = applyEnvironmentalDamage(character, location, "enter");
  
  if (immediate_damage.length > 0) {
    logEnvironmentalDamage(character_id, location_id, immediate_damage);
    
    // Notify AI if in autoplay mode
    if (character.autoplay_enabled) {
      notifyAIOfEnvironmentalThreat(character_id, location, immediate_damage);
    }
  }
}
```

### Integration con AI Autoplay
```typescript
// AI decision making con damage considerations
function makeAICombatDecision(
  character: Character,
  combat_state: CombatState,
  strategy: AIDamageStrategy
): CombatAction {
  
  // Assess current damage situation
  const damage_assessment = assessCombatDamage(character, combat_state);
  
  // Se HP basso, prioritize healing/defense
  if (character.current_hp < character.max_hp * 0.3) {
    return selectDefensiveAction(character, combat_state);
  }
  
  // Se ha advantage di danno, be aggressive
  if (damage_assessment.damage_advantage > 1.5) {
    return selectAgggressiveAction(character, combat_state, strategy);
  }
  
  // Altrimenti, tactical decision
  return selectTacticalAction(character, combat_state, strategy);
}
```

## Balance Considerations

### Damage Scaling
- **Low level (1-10)**: Danno 5-50, armor 0-15
- **Mid level (10-25)**: Danno 20-200, armor 10-50  
- **High level (25+)**: Danno 50-500, armor 25-100

### Resistance Caps
- **Resistance massima**: 75% per singolo tipo di danno
- **Immunità**: Solo per creature speciali o high-level spells
- **Piercing effectiveness**: Riduce armor del 30-50%

### Critical Hit Frequency
- **Base chance**: 20% (D50 >= 70)
- **Max crit chance**: 35% con items e abilities ottimali
- **Critical multiplier range**: 1.5x - 3.0x per special abilities

---

Questo sistema di damage e defense si integra completamente con tutti gli altri sistemi esistenti mantenendo la semplicità del D50 core mentre aggiungendo la depth necessaria per combat engaging e strategico.
