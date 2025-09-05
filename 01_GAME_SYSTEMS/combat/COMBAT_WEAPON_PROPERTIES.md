# Combat Weapon Properties System — Specifica completa

Data: 5 settembre 2025

## Overview

Sistema completo di proprietà delle armi che espande significativamente il combat system con meccaniche specifiche per ogni tipo di arma, durabilità, upgrading, enchantments e interazioni tattiche avanzate. Si integra perfettamente con damage/defense, positioning, status effects e action economy.

## Core Weapon Framework

### Weapon Property System
```typescript
interface WeaponProperties {
  // Basic weapon identification
  weapon_id: string;
  base_weapon_type: WeaponType;
  weapon_subtype: WeaponSubtype;
  
  // Physical characteristics
  physical_properties: PhysicalProperties;
  
  // Combat mechanics
  damage_properties: DamageProperties;
  accuracy_properties: AccuracyProperties;
  special_abilities: WeaponAbility[];
  
  // Durability and maintenance
  durability_data: DurabilityData;
  
  // Enhancement system
  enchantments: Enchantment[];
  upgrades: WeaponUpgrade[];
  
  // Tactical properties
  tactical_features: TacticalFeature[];
  
  // Economic data
  economic_data: WeaponEconomicData;
}

enum WeaponType {
  SWORD = 'sword',
  AXE = 'axe',
  MACE = 'mace',
  DAGGER = 'dagger',
  SPEAR = 'spear',
  BOW = 'bow',
  CROSSBOW = 'crossbow',
  STAFF = 'staff',
  WAND = 'wand',
  THROWING = 'throwing',
  UNARMED = 'unarmed',
  EXOTIC = 'exotic'
}

enum WeaponSubtype {
  // Swords
  SHORTSWORD = 'shortsword',
  LONGSWORD = 'longsword',
  GREATSWORD = 'greatsword',
  RAPIER = 'rapier',
  SCIMITAR = 'scimitar',
  
  // Axes  
  HANDAXE = 'handaxe',
  BATTLEAXE = 'battleaxe',
  GREATAXE = 'greataxe',
  
  // Maces
  LIGHT_MACE = 'light_mace',
  HEAVY_MACE = 'heavy_mace',
  WARHAMMER = 'warhammer',
  
  // Daggers
  DAGGER = 'dagger',
  STILETTO = 'stiletto',
  THROWING_KNIFE = 'throwing_knife',
  
  // Ranged
  SHORTBOW = 'shortbow',
  LONGBOW = 'longbow',
  COMPOSITE_BOW = 'composite_bow',
  LIGHT_CROSSBOW = 'light_crossbow',
  HEAVY_CROSSBOW = 'heavy_crossbow',
  
  // Magic
  WIZARD_STAFF = 'wizard_staff',
  BATTLE_STAFF = 'battle_staff',
  MAGIC_WAND = 'magic_wand',
  ORB = 'orb'
}

interface PhysicalProperties {
  weight: number; // kg
  length: number; // cm
  material: WeaponMaterial;
  craftsmanship_quality: CraftsmanshipLevel;
  
  // Handling characteristics
  balance_point: number; // cm from hilt
  grip_type: GripType;
  handedness: Handedness;
  
  // Physical limitations
  strength_requirement: number;
  dexterity_requirement: number;
  
  // Weapon reach and threat zone
  reach: number; // cells
  threat_radius: number; // cells
}

enum WeaponMaterial {
  WOOD = 'wood',
  IRON = 'iron',
  STEEL = 'steel',
  SILVER = 'silver',
  MITHRIL = 'mithril',
  ADAMANTINE = 'adamantine',
  DRAGONBONE = 'dragonbone',
  CRYSTAL = 'crystal',
  OBSIDIAN = 'obsidian',
  COLD_IRON = 'cold_iron'
}

enum CraftsmanshipLevel {
  CRUDE = 'crude',         // -2 to all rolls
  POOR = 'poor',           // -1 to all rolls  
  AVERAGE = 'average',     // No modifier
  FINE = 'fine',           // +1 to all rolls
  MASTERWORK = 'masterwork', // +2 to all rolls
  LEGENDARY = 'legendary'   // +3 to all rolls, special properties
}

enum GripType {
  SINGLE_HANDED = 'single_handed',
  ONE_AND_HALF_HANDED = 'one_and_half_handed',
  TWO_HANDED = 'two_handed'
}

enum Handedness {
  MAIN_HAND_ONLY = 'main_hand_only',
  OFF_HAND_ONLY = 'off_hand_only',
  EITHER_HAND = 'either_hand',
  BOTH_HANDS = 'both_hands'
}
```

### Damage Properties
```typescript
interface DamageProperties {
  // Base damage
  base_damage_dice: DamageDice;
  damage_types: DamageType[];
  
  // Critical hit properties
  critical_threat_range: number; // 19-20, 18-20, etc.
  critical_multiplier: number; // 2x, 3x, etc.
  
  // Damage scaling
  stat_scaling: StatScaling[];
  
  // Special damage conditions
  conditional_damage: ConditionalDamage[];
  
  // Armor interaction
  armor_penetration: number; // Points of armor ignored
  armor_effectiveness: ArmorEffectiveness;
  
  // Material-specific bonuses
  material_bonuses: MaterialBonus[];
}

interface DamageDice {
  num_dice: number;
  die_size: number;
  bonus_damage: number;
  
  // Variable damage based on grip
  two_handed_bonus?: number;
  dual_wield_penalty?: number;
}

interface StatScaling {
  stat_name: string;
  scaling_factor: number; // Multiplier for stat modifier
  scaling_type: ScalingType;
}

enum ScalingType {
  LINEAR = 'linear',        // 1:1 ratio
  DIMINISHING = 'diminishing', // Reduced effectiveness at high values
  THRESHOLD = 'threshold',  // Bonus only above certain value
  EXPONENTIAL = 'exponential' // Increasing effectiveness
}

interface ConditionalDamage {
  condition: DamageCondition;
  bonus_damage: number;
  damage_type?: DamageType;
  description: string;
}

enum DamageCondition {
  AGAINST_UNARMORED = 'against_unarmored',
  CRITICAL_HIT = 'critical_hit',
  FLANKING = 'flanking',
  CHARGING = 'charging',
  FIRST_ATTACK = 'first_attack',
  AGAINST_WOUNDED = 'against_wounded',
  SNEAK_ATTACK = 'sneak_attack',
  AGAINST_SPELLCASTERS = 'against_spellcasters'
}

// Weapon type definitions
const weaponTypeDefinitions: Record<WeaponSubtype, WeaponProperties> = {
  [WeaponSubtype.LONGSWORD]: {
    weapon_id: "longsword_base",
    base_weapon_type: WeaponType.SWORD,
    weapon_subtype: WeaponSubtype.LONGSWORD,
    
    physical_properties: {
      weight: 1.5,
      length: 95,
      material: WeaponMaterial.STEEL,
      craftsmanship_quality: CraftsmanshipLevel.AVERAGE,
      balance_point: 15,
      grip_type: GripType.ONE_AND_HALF_HANDED,
      handedness: Handedness.MAIN_HAND_ONLY,
      strength_requirement: 12,
      dexterity_requirement: 10,
      reach: 2,
      threat_radius: 1
    },
    
    damage_properties: {
      base_damage_dice: {
        num_dice: 1,
        die_size: 8,
        bonus_damage: 0,
        two_handed_bonus: 2
      },
      damage_types: [DamageType.SLASHING],
      critical_threat_range: 19,
      critical_multiplier: 2,
      stat_scaling: [
        {
          stat_name: "STR",
          scaling_factor: 1.0,
          scaling_type: ScalingType.LINEAR
        }
      ],
      conditional_damage: [
        {
          condition: DamageCondition.CHARGING,
          bonus_damage: 3,
          description: "Extra damage when charging"
        }
      ],
      armor_penetration: 2,
      armor_effectiveness: ArmorEffectiveness.NORMAL,
      material_bonuses: []
    },
    
    accuracy_properties: {
      base_accuracy_modifier: 0,
      stat_scaling: [
        {
          stat_name: "STR",
          scaling_factor: 0.5,
          scaling_type: ScalingType.LINEAR
        },
        {
          stat_name: "DEX",
          scaling_factor: 0.5,
          scaling_type: ScalingType.LINEAR
        }
      ],
      range_modifiers: [
        { range: 1, modifier: 2 },  // Close range bonus
        { range: 2, modifier: 0 }   // Normal range
      ],
      situational_modifiers: [
        {
          situation: AccuracySituation.DUAL_WIELDING,
          modifier: -2,
          description: "Penalty for dual wielding"
        }
      ]
    },
    
    special_abilities: [
      {
        ability_id: "riposte",
        name: "Riposte",
        description: "Counter-attack after successful parry",
        trigger: AbilityTrigger.SUCCESSFUL_PARRY,
        action_cost: 0,
        effect_type: EffectType.COUNTER_ATTACK
      }
    ],
    
    durability_data: {
      max_durability: 100,
      current_durability: 100,
      durability_loss_per_use: 0.1,
      repair_cost_per_point: 5,
      breaks_at_durability: 0,
      durability_affects_performance: true
    },
    
    enchantments: [],
    upgrades: [],
    
    tactical_features: [
      {
        feature_type: TacticalFeatureType.PARRYING,
        effectiveness: 8,
        description: "Good parrying capability"
      },
      {
        feature_type: TacticalFeatureType.REACH,
        effectiveness: 6,
        description: "Medium reach weapon"
      }
    ],
    
    economic_data: {
      base_value: 150,
      rarity: ItemRarity.COMMON,
      availability: ItemAvailability.WIDESPREAD,
      maintenance_cost_per_day: 1
    }
  },
  
  [WeaponSubtype.DAGGER]: {
    weapon_id: "dagger_base",
    base_weapon_type: WeaponType.DAGGER,
    weapon_subtype: WeaponSubtype.DAGGER,
    
    physical_properties: {
      weight: 0.3,
      length: 25,
      material: WeaponMaterial.STEEL,
      craftsmanship_quality: CraftsmanshipLevel.AVERAGE,
      balance_point: 8,
      grip_type: GripType.SINGLE_HANDED,
      handedness: Handedness.EITHER_HAND,
      strength_requirement: 6,
      dexterity_requirement: 12,
      reach: 1,
      threat_radius: 1
    },
    
    damage_properties: {
      base_damage_dice: {
        num_dice: 1,
        die_size: 4,
        bonus_damage: 0,
        dual_wield_penalty: 0 // No penalty for daggers
      },
      damage_types: [DamageType.PIERCING],
      critical_threat_range: 18, // Better crit range
      critical_multiplier: 2,
      stat_scaling: [
        {
          stat_name: "DEX",
          scaling_factor: 1.0,
          scaling_type: ScalingType.LINEAR
        }
      ],
      conditional_damage: [
        {
          condition: DamageCondition.SNEAK_ATTACK,
          bonus_damage: 6,
          description: "Sneak attack bonus"
        },
        {
          condition: DamageCondition.AGAINST_UNARMORED,
          bonus_damage: 2,
          description: "Effective against unarmored targets"
        }
      ],
      armor_penetration: 4, // High piercing capability
      armor_effectiveness: ArmorEffectiveness.REDUCED_VS_HEAVY,
      material_bonuses: []
    },
    
    accuracy_properties: {
      base_accuracy_modifier: 2, // Easy to use
      stat_scaling: [
        {
          stat_name: "DEX",
          scaling_factor: 1.0,
          scaling_type: ScalingType.LINEAR
        }
      ],
      range_modifiers: [
        { range: 1, modifier: 4 }  // Very accurate at close range
      ],
      situational_modifiers: [
        {
          situation: AccuracySituation.DUAL_WIELDING,
          modifier: 0, // No penalty for daggers
          description: "No dual wield penalty"
        },
        {
          situation: AccuracySituation.CONCEALED,
          modifier: 3,
          description: "Easy to conceal"
        }
      ]
    },
    
    special_abilities: [
      {
        ability_id: "sneak_attack",
        name: "Sneak Attack",
        description: "Extra damage when attacking unaware targets",
        trigger: AbilityTrigger.TARGET_UNAWARE,
        action_cost: 0,
        effect_type: EffectType.DAMAGE_BONUS
      },
      {
        ability_id: "thrown_attack",
        name: "Thrown Attack",
        description: "Can be thrown as ranged weapon",
        trigger: AbilityTrigger.MANUAL_ACTIVATION,
        action_cost: 1,
        effect_type: EffectType.RANGED_ATTACK
      }
    ],
    
    durability_data: {
      max_durability: 80,
      current_durability: 80,
      durability_loss_per_use: 0.05,
      repair_cost_per_point: 2,
      breaks_at_durability: 0,
      durability_affects_performance: true
    },
    
    enchantments: [],
    upgrades: [],
    
    tactical_features: [
      {
        feature_type: TacticalFeatureType.CONCEALMENT,
        effectiveness: 9,
        description: "Easily concealed"
      },
      {
        feature_type: TacticalFeatureType.SPEED,
        effectiveness: 8,
        description: "Fast attack speed"
      },
      {
        feature_type: TacticalFeatureType.DUAL_WIELD_COMPATIBLE,
        effectiveness: 10,
        description: "Perfect for dual wielding"
      }
    ],
    
    economic_data: {
      base_value: 20,
      rarity: ItemRarity.COMMON,
      availability: ItemAvailability.UBIQUITOUS,
      maintenance_cost_per_day: 0.1
    }
  }
};
```

## Weapon Abilities and Special Features

### Special Weapon Abilities
```typescript
interface WeaponAbility {
  ability_id: string;
  name: string;
  description: string;
  
  // Activation
  trigger: AbilityTrigger;
  activation_type: ActivationType;
  action_cost: number;
  
  // Requirements
  requirements: AbilityRequirement[];
  
  // Effects
  effect_type: EffectType;
  effect_parameters: EffectParameters;
  
  // Limitations
  uses_per_combat?: number;
  cooldown_turns?: number;
  requires_target: boolean;
  
  // Success conditions
  success_calculation: SuccessCalculation;
}

enum AbilityTrigger {
  MANUAL_ACTIVATION = 'manual_activation',
  ON_HIT = 'on_hit',
  ON_CRITICAL = 'on_critical',
  ON_MISS = 'on_miss',
  SUCCESSFUL_PARRY = 'successful_parry',
  TAKING_DAMAGE = 'taking_damage',
  TARGET_UNAWARE = 'target_unaware',
  CHARGE_ATTACK = 'charge_attack',
  FIRST_ATTACK_OF_TURN = 'first_attack_of_turn'
}

enum ActivationType {
  PASSIVE = 'passive',        // Always active
  TRIGGERED = 'triggered',    // Activates on trigger
  ACTIVE = 'active',         // Manually activated
  CONDITIONAL = 'conditional' // Active under certain conditions
}

enum EffectType {
  DAMAGE_BONUS = 'damage_bonus',
  ACCURACY_BONUS = 'accuracy_bonus',
  COUNTER_ATTACK = 'counter_attack',
  STATUS_EFFECT = 'status_effect',
  AREA_ATTACK = 'area_attack',
  RANGED_ATTACK = 'ranged_attack',
  DEFENSIVE_BONUS = 'defensive_bonus',
  SPECIAL_MANEUVER = 'special_maneuver'
}

// Weapon-specific abilities
const weaponAbilities: WeaponAbility[] = [
  {
    ability_id: "cleave",
    name: "Cleave",
    description: "Strike multiple adjacent enemies",
    trigger: AbilityTrigger.MANUAL_ACTIVATION,
    activation_type: ActivationType.ACTIVE,
    action_cost: 2,
    requirements: [
      {
        requirement_type: "weapon_type",
        value: [WeaponType.AXE, WeaponType.SWORD],
        description: "Requires slashing weapon"
      },
      {
        requirement_type: "stat_minimum",
        stat: "STR",
        value: 15,
        description: "Requires STR 15+"
      }
    ],
    effect_type: EffectType.AREA_ATTACK,
    effect_parameters: {
      attack_pattern: "adjacent_arc",
      max_targets: 3,
      damage_modifier: 0.8, // 80% damage to each target
      accuracy_modifier: -2
    },
    uses_per_combat: 3,
    requires_target: true,
    success_calculation: {
      base_difficulty: 15,
      stat_modifier: "STR",
      situational_modifiers: ["enemy_count", "positioning"]
    }
  },
  
  {
    ability_id: "precise_strike",
    name: "Precise Strike",
    description: "Targeted attack ignoring armor",
    trigger: AbilityTrigger.MANUAL_ACTIVATION,
    activation_type: ActivationType.ACTIVE,
    action_cost: 2,
    requirements: [
      {
        requirement_type: "weapon_category",
        value: ["piercing"],
        description: "Requires piercing weapon"
      },
      {
        requirement_type: "stat_minimum",
        stat: "DEX",
        value: 16,
        description: "Requires DEX 16+"
      }
    ],
    effect_type: EffectType.DAMAGE_BONUS,
    effect_parameters: {
      armor_penetration_bonus: 10,
      accuracy_bonus: -3, // Harder to hit precisely
      damage_multiplier: 1.2,
      ignores_damage_reduction: true
    },
    uses_per_combat: 2,
    requires_target: true,
    success_calculation: {
      base_difficulty: 18,
      stat_modifier: "DEX",
      situational_modifiers: ["target_armor", "range"]
    }
  },
  
  {
    ability_id: "whirlwind",
    name: "Whirlwind Attack",
    description: "Spin attack hitting all surrounding enemies",
    trigger: AbilityTrigger.MANUAL_ACTIVATION,
    activation_type: ActivationType.ACTIVE,
    action_cost: 4,
    requirements: [
      {
        requirement_type: "weapon_type",
        value: [WeaponType.SWORD, WeaponType.AXE],
        description: "Requires one-handed slashing weapon"
      },
      {
        requirement_type: "stance",
        value: "mobile",
        description: "Requires mobile stance"
      }
    ],
    effect_type: EffectType.AREA_ATTACK,
    effect_parameters: {
      attack_pattern: "surrounding_circle",
      max_targets: 8,
      damage_modifier: 0.6,
      accuracy_modifier: -4,
      self_defense_penalty: 5 // Exposed while spinning
    },
    uses_per_combat: 1,
    cooldown_turns: 5,
    requires_target: false,
    success_calculation: {
      base_difficulty: 20,
      stat_modifier: "DEX",
      situational_modifiers: ["surrounding_enemies", "terrain"]
    }
  }
];
```

### Enchantment System
```typescript
interface Enchantment {
  enchantment_id: string;
  name: string;
  description: string;
  enchantment_type: EnchantmentType;
  
  // Power level
  enchantment_level: number; // 1-10
  max_level: number;
  
  // Effects
  stat_bonuses: StatBonus[];
  damage_bonuses: DamageBonus[];
  special_properties: SpecialProperty[];
  
  // Requirements and restrictions
  requirements: EnchantmentRequirement[];
  incompatible_with: string[]; // Other enchantment IDs
  
  // Economic data
  enchantment_cost: number;
  maintenance_cost_increase: number;
  durability_modifier: number;
  
  // Visual effects
  visual_effects: VisualEffect[];
  sound_effects: SoundEffect[];
}

enum EnchantmentType {
  ELEMENTAL = 'elemental',     // Fire, ice, lightning, etc.
  HOLY = 'holy',              // Divine power
  SHADOW = 'shadow',          // Dark/evil power
  NATURE = 'nature',          // Natural magic
  ARCANE = 'arcane',          // Pure magic
  UTILITY = 'utility',        // Non-combat benefits
  PROTECTION = 'protection',   // Defensive bonuses
  ENHANCEMENT = 'enhancement'  // General improvements
}

const enchantments: Enchantment[] = [
  {
    enchantment_id: "flaming",
    name: "Flaming",
    description: "Weapon is wreathed in magical fire",
    enchantment_type: EnchantmentType.ELEMENTAL,
    enchantment_level: 1,
    max_level: 5,
    
    stat_bonuses: [],
    damage_bonuses: [
      {
        damage_type: DamageType.FIRE,
        bonus_per_level: 2,
        description: "Additional fire damage"
      }
    ],
    special_properties: [
      {
        property_id: "light_source",
        description: "Provides light in dark areas",
        mechanical_effect: "illumination_radius_10"
      },
      {
        property_id: "ignite_flammables",
        description: "Can ignite flammable objects",
        mechanical_effect: "fire_spread_chance_25"
      }
    ],
    
    requirements: [
      {
        requirement_type: "material_compatibility",
        value: [WeaponMaterial.STEEL, WeaponMaterial.MITHRIL],
        description: "Material must be able to channel fire magic"
      }
    ],
    incompatible_with: ["frost", "ice_binding"],
    
    enchantment_cost: 500,
    maintenance_cost_increase: 2,
    durability_modifier: -0.1, // Slightly more wear
    
    visual_effects: [
      {
        effect_type: "particle_system",
        effect_name: "fire_aura",
        intensity: "level_based"
      }
    ],
    sound_effects: [
      {
        effect_type: "on_hit",
        sound_name: "fire_sizzle",
        volume: "medium"
      }
    ]
  },
  
  {
    enchantment_id: "keen",
    name: "Keen",
    description: "Weapon finds weak spots more easily",
    enchantment_type: EnchantmentType.ENHANCEMENT,
    enchantment_level: 1,
    max_level: 3,
    
    stat_bonuses: [
      {
        stat_name: "critical_threat_range",
        bonus_per_level: 1,
        description: "Expands critical hit range"
      }
    ],
    damage_bonuses: [],
    special_properties: [
      {
        property_id: "precision_strikes",
        description: "Improved accuracy against vital areas",
        mechanical_effect: "accuracy_vs_unarmored_plus_2"
      }
    ],
    
    requirements: [
      {
        requirement_type: "weapon_category",
        value: ["slashing", "piercing"],
        description: "Only effective on edged weapons"
      }
    ],
    incompatible_with: [],
    
    enchantment_cost: 800,
    maintenance_cost_increase: 1,
    durability_modifier: 0,
    
    visual_effects: [
      {
        effect_type: "edge_highlight",
        effect_name: "silver_gleam",
        intensity: "subtle"
      }
    ],
    sound_effects: [
      {
        effect_type: "on_critical",
        sound_name: "precision_ring",
        volume: "low"
      }
    ]
  }
];
```

## Durability and Maintenance

### Durability System
```typescript
interface DurabilityData {
  max_durability: number;
  current_durability: number;
  
  // Wear patterns
  durability_loss_per_use: number;
  durability_loss_on_critical: number;
  durability_loss_on_block: number;
  durability_loss_on_parry: number;
  
  // Breakage
  breaks_at_durability: number;
  break_chance_per_use: number; // When durability is low
  
  // Performance impact
  durability_affects_performance: boolean;
  performance_degradation_curve: PerformanceCurve;
  
  // Repair
  repair_cost_per_point: number;
  repair_difficulty: number;
  can_be_repaired: boolean;
  
  // Special materials
  material_durability_modifier: number;
  enchantment_durability_modifier: number;
}

interface PerformanceCurve {
  accuracy_penalty_per_10_percent: number;
  damage_penalty_per_10_percent: number;
  critical_chance_penalty_per_10_percent: number;
  
  // Breakpoints where penalties increase
  minor_damage_threshold: number; // 75% durability
  major_damage_threshold: number; // 50% durability
  critical_damage_threshold: number; // 25% durability
}

function calculateDurabilityLoss(
  weapon: WeaponProperties,
  action_type: WeaponActionType,
  context: CombatContext
): DurabilityLossResult {
  
  let durability_loss = 0;
  const base_loss = weapon.durability_data.durability_loss_per_use;
  
  switch (action_type) {
    case WeaponActionType.NORMAL_ATTACK:
      durability_loss = base_loss;
      break;
      
    case WeaponActionType.CRITICAL_HIT:
      durability_loss = base_loss + weapon.durability_data.durability_loss_on_critical;
      break;
      
    case WeaponActionType.BLOCKED_ATTACK:
      durability_loss = base_loss + weapon.durability_data.durability_loss_on_block;
      break;
      
    case WeaponActionType.PARRY:
      durability_loss = weapon.durability_data.durability_loss_on_parry;
      break;
      
    case WeaponActionType.SPECIAL_ABILITY:
      durability_loss = base_loss * 2; // Special abilities stress weapons more
      break;
  }
  
  // Material modifiers
  durability_loss *= weapon.durability_data.material_durability_modifier;
  
  // Environmental modifiers
  if (context.environment === "corrosive") {
    durability_loss *= 2;
  } else if (context.environment === "humid") {
    durability_loss *= 1.5;
  }
  
  // Quality modifiers
  switch (weapon.physical_properties.craftsmanship_quality) {
    case CraftsmanshipLevel.MASTERWORK:
      durability_loss *= 0.5;
      break;
    case CraftsmanshipLevel.FINE:
      durability_loss *= 0.75;
      break;
    case CraftsmanshipLevel.POOR:
      durability_loss *= 1.5;
      break;
    case CraftsmanshipLevel.CRUDE:
      durability_loss *= 2;
      break;
  }
  
  return {
    durability_lost: Math.round(durability_loss * 100) / 100,
    break_chance: calculateBreakChance(weapon, durability_loss),
    performance_impact: calculatePerformanceImpact(weapon)
  };
}

function calculatePerformanceImpact(weapon: WeaponProperties): PerformanceImpact {
  if (!weapon.durability_data.durability_affects_performance) {
    return {
      accuracy_modifier: 0,
      damage_modifier: 0,
      critical_chance_modifier: 0
    };
  }
  
  const durability_percent = weapon.durability_data.current_durability / 
                           weapon.durability_data.max_durability;
  
  const curve = weapon.durability_data.performance_degradation_curve;
  
  let accuracy_penalty = 0;
  let damage_penalty = 0;
  let critical_penalty = 0;
  
  if (durability_percent < curve.critical_damage_threshold) {
    // Severely damaged
    accuracy_penalty = curve.accuracy_penalty_per_10_percent * 7;
    damage_penalty = curve.damage_penalty_per_10_percent * 7;
    critical_penalty = curve.critical_chance_penalty_per_10_percent * 7;
  } else if (durability_percent < curve.major_damage_threshold) {
    // Major damage
    accuracy_penalty = curve.accuracy_penalty_per_10_percent * 4;
    damage_penalty = curve.damage_penalty_per_10_percent * 4;
    critical_penalty = curve.critical_chance_penalty_per_10_percent * 4;
  } else if (durability_percent < curve.minor_damage_threshold) {
    // Minor damage
    accuracy_penalty = curve.accuracy_penalty_per_10_percent * 2;
    damage_penalty = curve.damage_penalty_per_10_percent * 2;
    critical_penalty = curve.critical_chance_penalty_per_10_percent * 2;
  }
  
  return {
    accuracy_modifier: -accuracy_penalty,
    damage_modifier: -damage_penalty,
    critical_chance_modifier: -critical_penalty
  };
}
```

## AI Integration

### AI Weapon Selection Strategy
```typescript
interface AIWeaponStrategy {
  // Weapon preferences
  preferred_weapon_types: WeaponType[];
  preferred_damage_types: DamageType[];
  
  // Tactical considerations
  considers_reach: boolean;
  considers_durability: boolean;
  switches_weapons_tactically: boolean;
  
  // Ability usage
  uses_special_abilities: boolean;
  ability_aggression: number; // 0-1
  saves_abilities_for_bosses: boolean;
  
  // Maintenance awareness
  repairs_weapons: boolean;
  replaces_broken_weapons: boolean;
  carries_backup_weapons: boolean;
  
  // Economic factors
  considers_weapon_cost: boolean;
  upgrades_weapons: boolean;
  seeks_enchantments: boolean;
}

function makeAIWeaponDecision(
  character: Character,
  combat_situation: CombatSituation,
  ai_strategy: AIWeaponStrategy
): WeaponAction | null {
  
  const current_weapon = character.equipment.main_hand;
  if (!current_weapon) {
    return {
      action_type: 'equip_weapon',
      weapon_id: findBestAvailableWeapon(character, ai_strategy)
    };
  }
  
  // Check if current weapon needs replacement
  const weapon_condition = assessWeaponCondition(current_weapon);
  
  if (weapon_condition.should_replace) {
    const replacement = findReplacementWeapon(character, current_weapon, ai_strategy);
    if (replacement) {
      return {
        action_type: 'switch_weapon',
        current_weapon_id: current_weapon.id,
        new_weapon_id: replacement.id,
        reason: weapon_condition.reason
      };
    }
  }
  
  // Check for special ability usage
  if (ai_strategy.uses_special_abilities) {
    const ability_decision = evaluateWeaponAbilityUsage(
      character,
      current_weapon,
      combat_situation,
      ai_strategy
    );
    
    if (ability_decision.should_use) {
      return {
        action_type: 'use_weapon_ability',
        weapon_id: current_weapon.id,
        ability_id: ability_decision.ability_id,
        target_id: ability_decision.target_id
      };
    }
  }
  
  // Check for tactical weapon switching
  if (ai_strategy.switches_weapons_tactically) {
    const tactical_switch = evaluateTacticalWeaponSwitch(
      character,
      current_weapon,
      combat_situation,
      ai_strategy
    );
    
    if (tactical_switch.should_switch) {
      return {
        action_type: 'tactical_switch',
        current_weapon_id: current_weapon.id,
        new_weapon_id: tactical_switch.new_weapon_id,
        reason: tactical_switch.reason
      };
    }
  }
  
  return null; // No weapon action needed
}

function evaluateWeaponAbilityUsage(
  character: Character,
  weapon: WeaponProperties,
  situation: CombatSituation,
  strategy: AIWeaponStrategy
): AbilityUsageDecision {
  
  const available_abilities = weapon.special_abilities.filter(ability => 
    canUseAbility(character, ability, situation)
  );
  
  if (available_abilities.length === 0) {
    return { should_use: false };
  }
  
  // Score each ability
  const ability_scores: AbilityScore[] = [];
  
  for (const ability of available_abilities) {
    const score = scoreWeaponAbility(ability, character, situation, strategy);
    ability_scores.push({
      ability: ability,
      score: score.total_score,
      target_id: score.best_target_id
    });
  }
  
  // Sort by score
  ability_scores.sort((a, b) => b.score - a.score);
  
  const best_ability = ability_scores[0];
  
  // Determine if score is high enough to use
  const use_threshold = 60 + (strategy.ability_aggression * 20); // 60-80 threshold
  
  if (best_ability.score >= use_threshold) {
    return {
      should_use: true,
      ability_id: best_ability.ability.ability_id,
      target_id: best_ability.target_id,
      confidence: best_ability.score / 100
    };
  }
  
  return { should_use: false };
}

function scoreWeaponAbility(
  ability: WeaponAbility,
  character: Character,
  situation: CombatSituation,
  strategy: AIWeaponStrategy
): AbilityScoreDetails {
  
  let score = 50; // Base score
  let best_target_id: string | null = null;
  
  // Evaluate effectiveness based on ability type
  switch (ability.effect_type) {
    case EffectType.DAMAGE_BONUS:
      // Higher score if we need more damage
      const damage_need = assessDamageNeed(character, situation);
      score += damage_need * 30;
      best_target_id = findBestDamageTarget(situation);
      break;
      
    case EffectType.AREA_ATTACK:
      // Score based on number of targets
      const potential_targets = countValidTargets(ability, situation);
      score += potential_targets * 15;
      if (potential_targets >= 2) {
        score += 20; // Bonus for multi-target
      }
      break;
      
    case EffectType.COUNTER_ATTACK:
      // Higher score if we're taking lots of attacks
      const incoming_attacks = countIncomingAttacks(character, situation);
      score += incoming_attacks * 12;
      break;
      
    case EffectType.DEFENSIVE_BONUS:
      // Score based on threat level
      const threat_level = assessThreatLevel(character, situation);
      score += threat_level * 25;
      break;
  }
  
  // Action cost consideration
  const action_efficiency = 100 / Math.max(1, ability.action_cost);
  score += action_efficiency * 0.2;
  
  // Cooldown and usage limitations
  if (ability.uses_per_combat) {
    const uses_remaining = getRemainingUses(character, ability);
    if (uses_remaining <= 1 && !isBossFight(situation)) {
      score -= 20; // Save for more important fights
    }
  }
  
  return {
    total_score: Math.max(0, Math.min(100, score)),
    best_target_id: best_target_id,
    reasoning: generateAbilityReasoning(ability, score, situation)
  };
}
```

## Database Schema

```sql
-- Weapon properties tables
CREATE TABLE weapon_definitions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  weapon_type VARCHAR(20) NOT NULL,
  weapon_subtype VARCHAR(30) NOT NULL,
  
  -- Physical properties
  weight DECIMAL(6,2) NOT NULL,
  length INTEGER NOT NULL, -- cm
  material VARCHAR(20) NOT NULL,
  craftsmanship_quality VARCHAR(20) DEFAULT 'average',
  balance_point INTEGER,
  grip_type VARCHAR(30) NOT NULL,
  handedness VARCHAR(20) NOT NULL,
  strength_requirement INTEGER DEFAULT 10,
  dexterity_requirement INTEGER DEFAULT 10,
  reach INTEGER DEFAULT 1,
  threat_radius INTEGER DEFAULT 1,
  
  -- Damage properties
  base_damage_dice JSONB NOT NULL, -- {num_dice, die_size, bonus_damage}
  damage_types JSONB NOT NULL, -- Array of damage types
  critical_threat_range INTEGER DEFAULT 20,
  critical_multiplier DECIMAL(3,1) DEFAULT 2.0,
  armor_penetration INTEGER DEFAULT 0,
  
  -- Base value and rarity
  base_value INTEGER NOT NULL,
  rarity VARCHAR(20) DEFAULT 'common',
  availability VARCHAR(20) DEFAULT 'widespread',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_instances (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  weapon_definition_id VARCHAR(50) NOT NULL REFERENCES weapon_definitions(id),
  
  -- Current state
  current_durability DECIMAL(5,2) NOT NULL,
  max_durability DECIMAL(5,2) NOT NULL,
  
  -- Customizations
  custom_name VARCHAR(100),
  description_override TEXT,
  
  -- Enhancement tracking
  enhancement_level INTEGER DEFAULT 0,
  total_upgrade_value INTEGER DEFAULT 0,
  
  -- History tracking
  total_uses INTEGER DEFAULT 0,
  total_damage_dealt INTEGER DEFAULT 0,
  total_critical_hits INTEGER DEFAULT 0,
  times_repaired INTEGER DEFAULT 0,
  
  -- Location
  location_type VARCHAR(20) DEFAULT 'inventory', -- inventory, equipped, storage
  equipped_slot VARCHAR(20), -- main_hand, off_hand
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_enchantments (
  id UUID PRIMARY KEY,
  weapon_instance_id UUID NOT NULL REFERENCES weapon_instances(id),
  enchantment_id VARCHAR(50) NOT NULL,
  enchantment_level INTEGER NOT NULL DEFAULT 1,
  
  -- Application details
  applied_by_character_id UUID REFERENCES characters(id),
  application_cost INTEGER,
  
  -- Current state
  is_active BOOLEAN DEFAULT TRUE,
  charges_remaining INTEGER, -- For charged enchantments
  
  applied_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- For temporary enchantments
);

CREATE TABLE weapon_upgrades (
  id UUID PRIMARY KEY,
  weapon_instance_id UUID NOT NULL REFERENCES weapon_instances(id),
  upgrade_type VARCHAR(30) NOT NULL,
  upgrade_level INTEGER NOT NULL DEFAULT 1,
  
  -- Upgrade effects
  stat_modifications JSONB DEFAULT '{}',
  property_changes JSONB DEFAULT '{}',
  
  -- Application details
  upgrade_cost INTEGER NOT NULL,
  applied_by_character_id UUID REFERENCES characters(id),
  materials_used JSONB DEFAULT '[]',
  
  applied_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_abilities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  
  -- Ability mechanics
  ability_type VARCHAR(20) NOT NULL,
  trigger_type VARCHAR(30) NOT NULL,
  activation_type VARCHAR(20) NOT NULL,
  action_cost INTEGER DEFAULT 1,
  
  -- Requirements
  requirements JSONB DEFAULT '[]',
  incompatible_weapons JSONB DEFAULT '[]',
  
  -- Effects
  effect_type VARCHAR(30) NOT NULL,
  effect_parameters JSONB NOT NULL,
  
  -- Limitations
  uses_per_combat INTEGER,
  cooldown_turns INTEGER,
  requires_target BOOLEAN DEFAULT TRUE,
  
  -- Success calculation
  success_calculation JSONB NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_ability_instances (
  id UUID PRIMARY KEY,
  weapon_instance_id UUID NOT NULL REFERENCES weapon_instances(id),
  ability_id VARCHAR(50) NOT NULL REFERENCES weapon_abilities(id),
  
  -- Current state
  uses_remaining_this_combat INTEGER,
  cooldown_expires_at_turn INTEGER,
  
  -- Customization
  ability_level INTEGER DEFAULT 1,
  custom_parameters JSONB DEFAULT '{}',
  
  learned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_usage_log (
  id UUID PRIMARY KEY,
  weapon_instance_id UUID NOT NULL REFERENCES weapon_instances(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  combat_session_id UUID REFERENCES combat_sessions(id),
  
  -- Usage details
  action_type VARCHAR(30) NOT NULL, -- attack, parry, block, special_ability
  ability_used VARCHAR(50), -- If special ability was used
  target_character_id UUID REFERENCES characters(id),
  
  -- Results
  hit_successful BOOLEAN,
  damage_dealt INTEGER DEFAULT 0,
  was_critical BOOLEAN DEFAULT FALSE,
  
  -- Durability impact
  durability_loss DECIMAL(4,2) DEFAULT 0,
  durability_after_use DECIMAL(5,2),
  
  -- Context
  combat_round INTEGER,
  position_data JSONB,
  environmental_factors JSONB DEFAULT '{}',
  
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weapon_maintenance_log (
  id UUID PRIMARY KEY,
  weapon_instance_id UUID NOT NULL REFERENCES weapon_instances(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  
  -- Maintenance details
  maintenance_type VARCHAR(20) NOT NULL, -- repair, sharpen, clean, enchant
  durability_before DECIMAL(5,2) NOT NULL,
  durability_after DECIMAL(5,2) NOT NULL,
  
  -- Cost and materials
  gold_cost INTEGER DEFAULT 0,
  materials_used JSONB DEFAULT '[]',
  performed_by_npc_id UUID REFERENCES npcs(id),
  
  -- Quality and results
  maintenance_quality VARCHAR(20) DEFAULT 'average',
  unexpected_effects JSONB DEFAULT '[]',
  
  performed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_weapon_instances_character ON weapon_instances(character_id);
CREATE INDEX idx_weapon_instances_definition ON weapon_instances(weapon_definition_id);
CREATE INDEX idx_weapon_instances_equipped ON weapon_instances(equipped_slot) WHERE equipped_slot IS NOT NULL;

CREATE INDEX idx_weapon_enchantments_weapon ON weapon_enchantments(weapon_instance_id);
CREATE INDEX idx_weapon_enchantments_active ON weapon_enchantments(is_active);

CREATE INDEX idx_weapon_upgrades_weapon ON weapon_upgrades(weapon_instance_id);

CREATE INDEX idx_weapon_ability_instances_weapon ON weapon_ability_instances(weapon_instance_id);
CREATE INDEX idx_weapon_ability_instances_ability ON weapon_ability_instances(ability_id);

CREATE INDEX idx_weapon_usage_log_weapon ON weapon_usage_log(weapon_instance_id);
CREATE INDEX idx_weapon_usage_log_character ON weapon_usage_log(character_id);
CREATE INDEX idx_weapon_usage_log_combat ON weapon_usage_log(combat_session_id);
CREATE INDEX idx_weapon_usage_log_used ON weapon_usage_log(used_at);

CREATE INDEX idx_weapon_maintenance_log_weapon ON weapon_maintenance_log(weapon_instance_id);
CREATE INDEX idx_weapon_maintenance_log_character ON weapon_maintenance_log(character_id);
CREATE INDEX idx_weapon_maintenance_log_performed ON weapon_maintenance_log(performed_at);
```

## Integration Examples

### Integration con Damage/Defense System
```typescript
// Enhanced damage calculation with weapon properties
function calculateWeaponDamage(
  attacker: Character,
  weapon: WeaponProperties,
  target: Character,
  context: CombatContext
): WeaponDamageResult {
  
  // Base weapon damage
  let base_damage = rollDamageDice(weapon.damage_properties.base_damage_dice);
  
  // Apply stat scaling
  for (const scaling of weapon.damage_properties.stat_scaling) {
    const stat_value = attacker.stats[scaling.stat_name];
    const stat_modifier = calculateStatModifier(stat_value);
    
    switch (scaling.scaling_type) {
      case ScalingType.LINEAR:
        base_damage += stat_modifier * scaling.scaling_factor;
        break;
      case ScalingType.THRESHOLD:
        if (stat_value >= 15) {
          base_damage += stat_modifier * scaling.scaling_factor;
        }
        break;
    }
  }
  
  // Apply conditional damage
  for (const conditional of weapon.damage_properties.conditional_damage) {
    if (evaluateDamageCondition(conditional.condition, attacker, target, context)) {
      base_damage += conditional.bonus_damage;
    }
  }
  
  // Apply enchantment bonuses
  for (const enchantment of weapon.enchantments) {
    for (const damage_bonus of enchantment.damage_bonuses) {
      base_damage += damage_bonus.bonus_per_level * enchantment.enchantment_level;
    }
  }
  
  // Apply durability penalties
  const performance_impact = calculatePerformanceImpact(weapon);
  base_damage += performance_impact.damage_modifier;
  
  // Apply armor penetration
  const final_damage = applyArmorPenetration(
    base_damage,
    weapon.damage_properties.armor_penetration,
    target.equipment.armor
  );
  
  return {
    base_damage: base_damage,
    final_damage: final_damage,
    damage_types: weapon.damage_properties.damage_types,
    armor_penetration_applied: weapon.damage_properties.armor_penetration,
    enchantment_effects: weapon.enchantments.map(e => e.name),
    performance_penalties: performance_impact
  };
}
```

---

Il sistema **Weapon Properties** è ora completo e si integra perfettamente con tutti gli altri sistemi, fornendo un framework ricchissimo per armi personalizzabili, enchantments, durabilità e abilità speciali che aumentano significativamente la profondità del combat system.
