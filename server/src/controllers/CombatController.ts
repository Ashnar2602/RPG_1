import { Request, Response } from 'express';
import { CombatService, CombatAction } from '../services/CombatService.js';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma.js';

export class CombatController {
  /**
   * Execute a combat action between two characters
   */
  static async executeCombatAction(req: Request, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { targetId, abilityName, weaponId, attackerId } = req.body;
      const userId = req.user?.id; // From auth middleware

      if (!attackerId) {
        return res.status(400).json({
          success: false,
          error: 'Attacker character ID is required'
        });
      }

      // Verify the character belongs to the authenticated user
      const attackerCharacter = await prisma.character.findFirst({
        where: { 
          id: attackerId,
          userId: userId 
        }
      });

      if (!attackerCharacter) {
        return res.status(403).json({
          success: false,
          error: 'Character not found or not owned by user'
        });
      }

      // Execute combat action
      const combatResult = await CombatService.executeCombatAction(
        attackerId,
        targetId,
        abilityName,
        weaponId
      );

      res.json({
        success: true,
        data: combatResult,
        message: `${abilityName} executed successfully`
      });

    } catch (error) {
      console.error('Combat action error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Combat action failed'
      });
    }
  }

  /**
   * Get combat history for a character
   */
  static async getCombatHistory(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      // Get combat logs from database
      const combatLogs = await prisma.combatLog.findMany({
        where: {
          OR: [
            { attackerId: characterId },
            { defenderId: characterId }
          ]
        },
        orderBy: { timestamp: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          attacker: {
            select: { id: true, name: true, level: true }
          }
        }
      });

      res.json({
        success: true,
        data: combatLogs,
        meta: {
          total: combatLogs.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      });

    } catch (error) {
      console.error('Get combat history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve combat history'
      });
    }
  }

  /**
   * Get available abilities for a character
   */
  static async getAvailableAbilities(req: Request, res: Response) {
    try {
      const { characterId } = req.params;

      // For now, return hardcoded abilities based on class
      // This can be expanded to database-driven abilities later
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: { characterClass: true, level: true }
      });

      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }

      const abilities = this.getClassAbilities(character.characterClass, character.level);

      res.json({
        success: true,
        data: abilities
      });

    } catch (error) {
      console.error('Get abilities error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve abilities'
      });
    }
  }

  /**
   * Start a combat encounter
   */
  static async startCombat(req: Request, res: Response) {
    try {
      const { targetId, attackerId } = req.body;
      const userId = req.user?.id;

      if (!attackerId) {
        return res.status(400).json({
          success: false,
          error: 'Attacker character ID is required'
        });
      }

      // Verify the character belongs to the authenticated user
      const attackerCheck = await prisma.character.findFirst({
        where: { 
          id: attackerId,
          userId: userId 
        }
      });

      if (!attackerCheck) {
        return res.status(403).json({
          success: false,
          error: 'Character not found or not owned by user'
        });
      }

      // Check if both characters exist and are in valid state for combat
      const [attacker, target] = await Promise.all([
        prisma.character.findUnique({
          where: { id: attackerId },
          select: { 
            id: true, 
            name: true, 
            level: true, 
            currentHealth: true,
            locationId: true 
          }
        }),
        prisma.character.findUnique({
          where: { id: targetId },
          select: { 
            id: true, 
            name: true, 
            level: true, 
            currentHealth: true,
            locationId: true 
          }
        })
      ]);

      if (!attacker || !target) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }

      // Check if both characters are alive
      if (attacker.currentHealth <= 0 || target.currentHealth <= 0) {
        return res.status(400).json({
          success: false,
          error: 'One or both characters are defeated'
        });
      }

      // Check if characters are in the same location (basic validation)
      if (attacker.locationId !== target.locationId) {
        return res.status(400).json({
          success: false,
          error: 'Characters must be in the same location to combat'
        });
      }

      res.json({
        success: true,
        data: {
          combatId: `combat_${Date.now()}`, // Simple combat ID
          attacker,
          target,
          status: 'combat_started'
        },
        message: 'Combat encounter started'
      });

    } catch (error) {
      console.error('Start combat error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start combat'
      });
    }
  }

  /**
   * Get class-specific abilities (hardcoded for now)
   */
  private static getClassAbilities(characterClass: string, level: number) {
    const baseAbilities = ['basic_attack'];
    
    const classAbilities: Record<string, string[]> = {
      'WARRIOR': ['basic_attack', 'power_strike', 'shield_bash'],
      'MAGE': ['basic_attack', 'fireball', 'ice_bolt', 'lightning_strike'],
      'ROGUE': ['basic_attack', 'sneak_attack', 'poison_strike'],
      'CLERIC': ['basic_attack', 'heal', 'holy_light', 'bless'],
      'PALADIN': ['basic_attack', 'holy_strike', 'heal', 'divine_protection'],
      'RANGER': ['basic_attack', 'arrow_shot', 'nature_heal'],
      'WARLOCK': ['basic_attack', 'dark_bolt', 'curse', 'life_drain'],
      'MONK': ['basic_attack', 'chi_strike', 'meditation', 'inner_peace']
    };

    let abilities = classAbilities[characterClass] || baseAbilities;
    
    // Filter abilities by level (basic implementation)
    if (level < 5) {
      abilities = abilities.slice(0, 2);
    } else if (level < 10) {
      abilities = abilities.slice(0, 3);
    }

    return abilities.map(ability => ({
      name: ability,
      displayName: ability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      level_required: 1,
      description: `${ability.replace(/_/g, ' ')} ability`
    }));
  }
}

// Validation middleware
export const combatActionValidation = [
  body('attackerId').isString().notEmpty().withMessage('Attacker ID is required'),
  body('targetId').isString().notEmpty().withMessage('Target ID is required'),
  body('abilityName').isString().notEmpty().withMessage('Ability name is required'),
  body('weaponId').optional().isString().withMessage('Weapon ID must be a string')
];

export const getCombatHistoryValidation = [
  param('characterId').isString().notEmpty().withMessage('Character ID is required')
];

export const startCombatValidation = [
  body('attackerId').isString().notEmpty().withMessage('Attacker ID is required'),
  body('targetId').isString().notEmpty().withMessage('Target ID is required')
];
