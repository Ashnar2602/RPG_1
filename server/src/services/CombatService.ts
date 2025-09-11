import { prisma } from '../utils/prisma.js';

// Types based on combat system documentation
export interface DamageInstance {
  source_id: string;
  ability_id?: string;
  weapon_id?: string;
  base_damage: number;
  stat_modifier: number;
  power_scaling: number;
  damage_type: DamageType;
  damage_properties: DamageProperty[];
  is_critical: boolean;
  critical_multiplier: number;
  total_raw_damage: number;
  mitigated_damage: number;
  final_damage: number;
}

export enum DamageType {
  PHYSICAL = 'physical',
  FIRE = 'fire',
  ICE = 'ice',
  LIGHTNING = 'lightning',
  POISON = 'poison',
  HOLY = 'holy',
  DARK = 'dark',
  ARCANE = 'arcane'
}

export enum DamageProperty {
  PIERCING = 'piercing',
  CRUSHING = 'crushing',
  SLASHING = 'slashing',
  ELEMENTAL = 'elemental',
  PURE = 'pure',
  BLEEDING = 'bleeding',
  STUNNING = 'stunning'
}

export interface DefenseCalculation {
  armor_rating: number;
  natural_armor: number;
  shield_bonus: number;
  damage_resistances: DamageResistance[];
  damage_immunities: DamageType[];
  total_armor: number;
  resistance_reduction: number;
  total_reduction: number;
}

export interface DamageResistance {
  damage_type: DamageType;
  resistance_percentage: number;
  flat_reduction?: number;
  source: string;
}

export interface CombatContext {
  action_result: number; // D50 roll result
  position_modifier?: number;
  environmental_factors?: string[];
}

export interface CombatAction {
  attacker_id: string;
  target_id: string;
  ability_name: string;
  weapon_id?: string;
  damage_dealt: number;
  is_critical: boolean;
  effects_applied: string[];
}

export class CombatService {
  /**
   * Calculate damage dealt by an attacker to a target
   */
  static async calculateDamage(
    attackerId: string,
    targetId: string,
    abilityName: string,
    context: CombatContext,
    weaponId?: string
  ): Promise<DamageInstance> {
    // Get attacker and target characters
    const attacker = await prisma.character.findUnique({
      where: { id: attackerId },
      include: { equipment: true }
    });

    const target = await prisma.character.findUnique({
      where: { id: targetId },
      include: { equipment: true }
    });

    if (!attacker || !target) {
      throw new Error('Character not found');
    }

    // Get weapon if specified
    let weapon = null;
    let weaponItem = null;
    if (weaponId) {
      weapon = await prisma.equipment.findUnique({
        where: { id: weaponId },
        include: { item: true }
      });
      weaponItem = weapon?.item;
    }

    // Get ability definition (for now, use hardcoded basic abilities)
    const ability = this.getAbilityDefinition(abilityName, attacker.characterClass);
    if (!ability) {
      throw new Error(`Ability ${abilityName} not found`);
    }

    // Calculate base damage
    let base_damage = ability.base_damage;
    if (weaponItem) {
      base_damage += weaponItem.damage || 0;
    }

    // Stat modifier based on ability type
    const stat_value = this.getStatValue(attacker, ability.primary_stat);
    const stat_modifier = stat_value * ability.stat_scaling;

    // Power scaling (using character level as power approximation)
    const power_scaling = attacker.level * ability.power_scaling;

    // Critical hit check
    const is_critical = context.action_result >= 70;
    const critical_multiplier = is_critical ? 1.5 : 1.0;

    // Raw damage calculation
    const total_raw_damage = Math.round(
      (base_damage + stat_modifier + power_scaling) * critical_multiplier
    );

    // Defense calculation
    const defense_result = this.calculateDefense(target, ability.damage_type);
    const mitigated_damage = Math.max(1, total_raw_damage - defense_result.total_reduction);

    return {
      source_id: attackerId,
      ability_id: ability.id,
      weapon_id: weaponId,
      base_damage,
      stat_modifier,
      power_scaling,
      damage_type: ability.damage_type,
      damage_properties: ability.damage_properties,
      is_critical,
      critical_multiplier,
      total_raw_damage,
      mitigated_damage,
      final_damage: mitigated_damage
    };
  }

  /**
   * Calculate defense against incoming damage
   */
  static calculateDefense(character: any, damageType: DamageType): DefenseCalculation {
    let armor_rating = 0;
    let shield_bonus = 0;

    // Calculate armor from equipment
    if (character.equipment) {
      character.equipment.forEach((equip: any) => {
        if (equip.item) {
          if (equip.item.type === 'ARMOR') {
            armor_rating += equip.item.defense || 0;
          }
          if (equip.slot === 'OFF_HAND' && equip.item.subType === 'shield') {
            shield_bonus += equip.item.defense || 0;
          }
        }
      });
    }

    // Natural armor based on race/class
    const natural_armor = this.getNaturalArmor(character.race, character.characterClass);

    // Basic resistances (can be expanded later)
    const damage_resistances: DamageResistance[] = [];
    const damage_immunities: DamageType[] = [];

    const total_armor = armor_rating + natural_armor + shield_bonus;
    const resistance_reduction = this.calculateResistanceReduction(damage_resistances, damageType);
    const total_reduction = total_armor + resistance_reduction;

    return {
      armor_rating,
      natural_armor,
      shield_bonus,
      damage_resistances,
      damage_immunities,
      total_armor,
      resistance_reduction,
      total_reduction
    };
  }

  /**
   * Execute a combat action between two characters
   */
  static async executeCombatAction(
    attackerId: string,
    targetId: string,
    abilityName: string,
    weaponId?: string
  ): Promise<CombatAction> {
    // Roll D50 for action
    const action_result = Math.floor(Math.random() * 50) + 1;
    
    const context: CombatContext = {
      action_result
    };

    // Calculate damage
    const damage_instance = await this.calculateDamage(
      attackerId,
      targetId,
      abilityName,
      context,
      weaponId
    );

    // Apply damage to target
    await this.applyDamage(targetId, damage_instance.final_damage);

    // Check for status effects
    const effects_applied = this.applyStatusEffects(damage_instance);

    return {
      attacker_id: attackerId,
      target_id: targetId,
      ability_name: abilityName,
      weapon_id: weaponId,
      damage_dealt: damage_instance.final_damage,
      is_critical: damage_instance.is_critical,
      effects_applied
    };
  }

  /**
   * Apply damage to a character
   */
  static async applyDamage(characterId: string, damage: number): Promise<void> {
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    const new_health = Math.max(0, character.currentHealth - damage);

    await prisma.character.update({
      where: { id: characterId },
      data: { currentHealth: new_health }
    });
  }

  /**
   * Get ability definition (hardcoded for now, can be moved to database later)
   */
  private static getAbilityDefinition(abilityName: string, characterClass: string): any {
    const abilities: Record<string, any> = {
      'basic_attack': {
        id: 'basic_attack',
        name: 'Basic Attack',
        base_damage: 10,
        primary_stat: 'strength',
        stat_scaling: 1.2,
        power_scaling: 0.5,
        damage_type: DamageType.PHYSICAL,
        damage_properties: [DamageProperty.SLASHING]
      },
      'fireball': {
        id: 'fireball',
        name: 'Fireball',
        base_damage: 15,
        primary_stat: 'intelligence',
        stat_scaling: 1.5,
        power_scaling: 0.8,
        damage_type: DamageType.FIRE,
        damage_properties: [DamageProperty.ELEMENTAL]
      },
      'heal': {
        id: 'heal',
        name: 'Heal',
        base_damage: -20, // Negative damage = healing
        primary_stat: 'wisdom',
        stat_scaling: 1.3,
        power_scaling: 0.6,
        damage_type: DamageType.HOLY,
        damage_properties: []
      }
    };

    return abilities[abilityName] || abilities['basic_attack'];
  }

  /**
   * Get stat value from character
   */
  private static getStatValue(character: any, statName: string): number {
    const statMap: Record<string, keyof any> = {
      'strength': 'strength',
      'dexterity': 'agility', // In schema it's 'agility' not 'dexterity'
      'constitution': 'vitality', // In schema it's 'vitality' not 'constitution'
      'intelligence': 'intelligence',
      'wisdom': 'wisdom',
      'charisma': 'charisma'
    };

    return character[statMap[statName]] || 10;
  }

  /**
   * Get natural armor for race/class combination
   */
  private static getNaturalArmor(race: string, characterClass: string): number {
    const raceArmor: Record<string, number> = {
      'DWARF': 2,
      'ORC': 3,
      'TROLL': 4,
      'HUMAN': 1,
      'ELF': 0,
      'GNOME': 0,
      'AERATHI': 1,
      'GUOLGARN': 2
    };

    const classArmor: Record<string, number> = {
      'WARRIOR': 3,
      'PALADIN': 4,
      'MONK': 2,
      'RANGER': 1,
      'ROGUE': 0,
      'MAGE': 0,
      'CLERIC': 1,
      'WARLOCK': 0
    };

    return (raceArmor[race] || 0) + (classArmor[characterClass] || 0);
  }

  /**
   * Calculate resistance reduction for damage type
   */
  private static calculateResistanceReduction(
    resistances: DamageResistance[],
    damageType: DamageType
  ): number {
    const resistance = resistances.find(r => r.damage_type === damageType);
    if (!resistance) return 0;

    return resistance.flat_reduction || 0;
  }

  /**
   * Apply status effects based on damage instance
   */
  private static applyStatusEffects(damage: DamageInstance): string[] {
    const effects: string[] = [];

    // Check for bleeding effect
    if (damage.damage_properties.includes(DamageProperty.BLEEDING) && damage.is_critical) {
      effects.push('bleeding');
    }

    // Check for stunning effect
    if (damage.damage_properties.includes(DamageProperty.STUNNING) && damage.final_damage > 20) {
      effects.push('stunned');
    }

    return effects;
  }
}
