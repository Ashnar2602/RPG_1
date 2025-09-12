import { prisma } from '../utils/prisma.js';
import { RACIAL_BONUSES, CLASS_TRAITS, SelectableTrait } from '../data/racialBonuses.js';
import { CharacterRace, CharacterClass } from '@prisma/client';

export interface CharacterCreationData {
  name: string;
  background?: string;
  race: CharacterRace;
  characterClass: CharacterClass;
  alignment: string;
  statDistribution: {
    strength: number;
    intelligence: number;
    dexterity: number;
    willpower: number;
    charisma: number;
    luck: number;
    stamina: number;
  };
  selectedTraits: string[]; // Array of trait IDs
  avatarData?: any;
  personalityData?: {
    personalityTraits: string[];
    motivations: string[];
    fears: string[];
    playstyles: string[];
    communicationStyle: string[];
    moralCode: string[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export class CharacterCreationService {
  
  /**
   * Validates character creation data
   */
  static validateCharacterData(data: CharacterCreationData, userId: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'Il nome deve avere almeno 3 caratteri' });
    }
    if (data.name && data.name.length > 30) {
      errors.push({ field: 'name', message: 'Il nome non può superare 30 caratteri' });
    }
    if (data.name && !/^[a-zA-ZÀ-ÿ\s]+$/.test(data.name)) {
      errors.push({ field: 'name', message: 'Il nome può contenere solo lettere e spazi' });
    }

    // Race validation
    if (!Object.keys(RACIAL_BONUSES).includes(data.race)) {
      errors.push({ field: 'race', message: 'Razza non valida' });
    }

    // Class validation (only initial classes allowed)
    const initialClasses = ['GUERRIERO', 'MAGO', 'FURFANTE'];
    if (!initialClasses.includes(data.characterClass)) {
      errors.push({ field: 'characterClass', message: 'Classe iniziale non valida' });
    }

    // Alignment validation
    const validAlignments = ['LG', 'LN', 'LE', 'NG', 'NN', 'NE', 'CG', 'CN', 'CE'];
    if (!validAlignments.includes(data.alignment)) {
      errors.push({ field: 'alignment', message: 'Allineamento non valido' });
    }

    // Stat distribution validation
    const stats = data.statDistribution;
    const totalPointsSpent = Object.values(stats).reduce((sum, val) => sum + (val - 10), 0);
    
    if (totalPointsSpent !== 15) {
      errors.push({ field: 'statDistribution', message: 'Devi spendere esattamente 15 punti statistici' });
    }

    // Check individual stat limits (base 10 + racial bonuses + free points <= 25)
    const racialData = RACIAL_BONUSES[data.race];
    if (racialData) {
      Object.entries(stats).forEach(([stat, value]) => {
        const racialBonus = racialData.stat_bonuses[stat as keyof typeof racialData.stat_bonuses] || 0;
        const finalValue = value + racialBonus;
        
        if (value < 10) {
          errors.push({ field: 'statDistribution', message: `${stat} non può essere sotto 10` });
        }
        if (finalValue > 25) {
          errors.push({ field: 'statDistribution', message: `${stat} non può superare 25 (inclusi bonus razziali)` });
        }
      });
    }

    // Traits validation
    if (!data.selectedTraits || data.selectedTraits.length !== 2) {
      errors.push({ field: 'selectedTraits', message: 'Devi selezionare esattamente 2 tratti' });
    }

    return errors;
  }

  /**
   * Calculate HP based on stats
   */
  static calculateHP(strength: number, stamina: number): number {
    return Math.round(strength * 1.25 + stamina * 2.25 + 50);
  }

  /**
   * Calculate MP based on stats  
   */
  static calculateMP(intelligence: number, charisma: number): number {
    return Math.round(intelligence * 2.5 + charisma * 0.75 + 75);
  }

  /**
   * Calculate Power using logarithmic formula
   */
  static calculatePower(stats: any): number {
    // Weighted stats for power calculation
    const strWeighted = stats.strength * 3;
    const intWeighted = stats.intelligence * 3;
    const dexWeighted = stats.dexterity * 3;
    const staWeighted = stats.stamina * 1.75;
    const wilWeighted = stats.willpower * 1.75;
    const chaWeighted = stats.charisma * 0.75;
    const lckWeighted = stats.luck * 0.75;

    // Logarithmic mean calculation
    const logSum = Math.log(strWeighted) + Math.log(intWeighted) + Math.log(dexWeighted) + 
                   Math.log(staWeighted) + Math.log(wilWeighted) + Math.log(chaWeighted) + Math.log(lckWeighted);
    
    const geometricMean = Math.exp(logSum / 7);
    return Math.round(geometricMean * 100) / 100; // Round to 2 decimals
  }

  /**
   * Apply racial bonuses to base stats
   */
  static applyRacialBonuses(baseStats: any, race: CharacterRace): any {
    const racialData = RACIAL_BONUSES[race];
    if (!racialData) return baseStats;

    const modifiedStats = { ...baseStats };
    
    Object.entries(racialData.stat_bonuses).forEach(([stat, bonus]) => {
      if (modifiedStats[stat] !== undefined) {
        modifiedStats[stat] += bonus;
      }
    });

    return modifiedStats;
  }

  /**
   * Create a new character
   */
  static async createCharacter(userId: string, data: CharacterCreationData) {
    // Validate data
    const errors = this.validateCharacterData(data, userId);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Check if name is already taken
    const existingCharacter = await prisma.character.findUnique({
      where: { name: data.name.trim() }
    });
    
    if (existingCharacter) {
      throw new Error('Nome personaggio già in uso');
    }

    // Check character limit per user (max 6)
    const userCharacterCount = await prisma.character.count({
      where: { userId }
    });
    
    if (userCharacterCount >= 6) {
      throw new Error('Hai raggiunto il limite massimo di 6 personaggi');
    }

    // Apply racial bonuses to stats
    const finalStats = this.applyRacialBonuses(data.statDistribution, data.race);

    // Calculate derived stats
    const hp = this.calculateHP(finalStats.strength, finalStats.stamina);
    const mp = this.calculateMP(finalStats.intelligence, finalStats.charisma);
    const power = this.calculatePower(finalStats);

    try {
      // Create character in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create main character record
        const character = await tx.character.create({
          data: {
            userId,
            name: data.name.trim(),
            background: data.background?.trim(),
            race: data.race,
            characterClass: data.characterClass,
            alignment: data.alignment,
            
            // Final stats (base + racial bonuses)
            strength: finalStats.strength,
            intelligence: finalStats.intelligence,
            dexterity: finalStats.dexterity,
            willpower: finalStats.willpower,
            charisma: finalStats.charisma,
            luck: finalStats.luck,
            stamina: finalStats.stamina,
            
            // Calculated stats
            baseHealth: hp,
            baseMana: mp,
            basePower: power,
            currentHealth: hp,
            currentMana: mp,
            
            // Starting currency
            gold: 100,
            gems: 0
          }
        });

        // Add racial trait
        const racialData = RACIAL_BONUSES[data.race];
        await tx.characterTrait.create({
          data: {
            characterId: character.id,
            traitType: 'RACIAL',
            traitName: racialData.racial_trait.name,
            description: racialData.racial_trait.description,  
            effect: racialData.racial_trait.effect
          }
        });

        // Add class traits
        const classTraits = CLASS_TRAITS[data.characterClass];
        for (const trait of classTraits) {
          await tx.characterTrait.create({
            data: {
              characterId: character.id,
              traitType: 'CLASS',
              traitName: trait.name,
              description: trait.description,
              effect: trait.effect
            }
          });
        }

        // Add selected traits
        for (const traitId of data.selectedTraits) {
          const trait = this.getSelectableTraitById(traitId);
          if (trait) {
            await tx.characterTrait.create({
              data: {
                characterId: character.id,
                traitType: 'SELECTED',
                traitName: trait.name,
                description: trait.description,
                effect: trait.effect
              }
            });
          }
        }

        // Add avatar data if provided
        if (data.avatarData) {
          await tx.characterAvatar.create({
            data: {
              characterId: character.id,
              race: data.race,
              avatarData: data.avatarData
            }
          });
        }

        // Add personality data if provided
        if (data.personalityData) {
          await tx.characterPersonality.create({
            data: {
              characterId: character.id,
              personalityTraits: data.personalityData.personalityTraits,
              motivations: data.personalityData.motivations,
              fears: data.personalityData.fears,
              playstyles: data.personalityData.playstyles,
              communicationStyle: data.personalityData.communicationStyle,
              moralCode: data.personalityData.moralCode
            }
          });
        }

        return character;
      });

      // Return complete character data
      return this.getCharacterById(result.id);
      
    } catch (error) {
      console.error('Character creation failed:', error);
      throw new Error('Errore nella creazione del personaggio');
    }
  }

  /**
   * Get complete character data by ID
   */
  static async getCharacterById(characterId: string) {
    return prisma.character.findUnique({
      where: { id: characterId },
      include: {
        traits: true,
        avatar: true,  
        personality: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Get all characters for a user
   */
  static async getUserCharacters(userId: string) {
    return prisma.character.findMany({
      where: { userId },
      include: {
        traits: {
          where: { traitType: 'RACIAL' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get selectable trait by ID
   */
  private static getSelectableTraitById(traitId: string): SelectableTrait | undefined {
    const { SELECTABLE_TRAITS } = require('../data/racialBonuses.js');
    return SELECTABLE_TRAITS.find((trait: SelectableTrait) => trait.id === traitId);
  }

  /**
   * Calculate live preview stats for character creation
   */
  static calculatePreviewStats(
    race: CharacterRace,
    statDistribution: any
  ) {
    const finalStats = this.applyRacialBonuses(statDistribution, race);
    const hp = this.calculateHP(finalStats.strength, finalStats.stamina);
    const mp = this.calculateMP(finalStats.intelligence, finalStats.charisma);
    const power = this.calculatePower(finalStats);
    
    return {
      finalStats,
      hp,
      mp,
      power,
      initiative: (finalStats.dexterity * 0.75 * (power / 2)) + finalStats.charisma
    };
  }

  /**
   * Get racial bonus data
   */
  static getRacialBonuses() {
    return RACIAL_BONUSES;
  }

  /**
   * Get class traits data
   */
  static getClassTraits() {
    return CLASS_TRAITS;
  }

  /**
   * Get selectable traits data
   */
  static getSelectableTraits() {
    const { SELECTABLE_TRAITS } = require('../data/racialBonuses.js');
    return SELECTABLE_TRAITS;
  }
}
