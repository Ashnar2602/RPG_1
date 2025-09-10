import { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { CharacterService } from '@/services/CharacterService'
import logger from '@/utils/logger'

// Validation rules
export const createCharacterValidation = [
  body('name')
    .isLength({ min: 2, max: 20 })
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage('Character name must be 2-20 characters long and contain only letters, numbers, underscores, and spaces'),
  body('race')
    .isIn(['HUMAN', 'ELF', 'DWARF', 'GNOME', 'ORC', 'TROLL', 'LIZARDMAN', 'FISHMAN', 'AERATHI', 'GUOLGARN', 'ZARKAAN'])
    .withMessage('Invalid race selected'),
  body('characterClass')
    .isIn(['WARRIOR', 'MAGE', 'ROGUE', 'CLERIC', 'RANGER', 'PALADIN', 'WARLOCK', 'BARD', 'MONK', 'BARBARIAN'])
    .withMessage('Invalid class selected'),
]

export const updateCharacterValidation = [
  param('characterId')
    .isUUID()
    .withMessage('Invalid character ID'),
  body('currentHealth')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Health must be a positive number'),
  body('currentMana')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mana must be a positive number'),
  body('currentStamina')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stamina must be a positive number'),
  body('x')
    .optional()
    .isFloat()
    .withMessage('X coordinate must be a number'),
  body('y')
    .optional()
    .isFloat()
    .withMessage('Y coordinate must be a number'),
  body('z')
    .optional()
    .isFloat()
    .withMessage('Z coordinate must be a number'),
  body('facing')
    .optional()
    .isFloat({ min: 0, max: 360 })
    .withMessage('Facing must be between 0 and 360 degrees'),
]

export class CharacterController {
  // Create new character
  static async createCharacter(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { name, race, characterClass } = req.body

      const result = await CharacterService.createCharacter(req.user.id, {
        name,
        race,
        characterClass,
      })

      if (result.success) {
        res.status(201).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Create character controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get user characters
  static async getUserCharacters(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const result = await CharacterService.getUserCharacters(req.user.id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Get user characters controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get character details
  static async getCharacterDetails(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { characterId } = req.params

      const result = await CharacterService.getCharacterDetails(characterId, req.user.id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(404).json(result)
      }

    } catch (error) {
      logger.error('Get character details controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Update character
  static async updateCharacter(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { characterId } = req.params
      const updateData = req.body

      const result = await CharacterService.updateCharacter(characterId, req.user.id, updateData)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Update character controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Delete character
  static async deleteCharacter(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { characterId } = req.params

      const result = await CharacterService.deleteCharacter(characterId, req.user.id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Delete character controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Character login (set as active)
  static async loginCharacter(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { characterId } = req.params

      const result = await CharacterService.loginCharacter(characterId, req.user.id)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Character login controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get active character
  static async getActiveCharacter(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const result = await CharacterService.getActiveCharacter(req.user.id)

      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({
          success: false,
          message: 'No active character found'
        })
      }

    } catch (error) {
      logger.error('Get active character controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get character stats summary
  static async getCharacterStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { characterId } = req.params

      const result = await CharacterService.getCharacterDetails(characterId, req.user.id)

      if (result.success && result.data) {
        const character = result.data
        
        // Calculate derived stats
        const maxHealth = character.baseHealth + (character.vitality * 10)
        const maxMana = character.baseMana + (character.intelligence * 5)
        const maxStamina = character.baseStamina + (character.vitality * 5)
        
        const stats = {
          level: character.level,
          experience: character.experience,
          experienceToNext: Math.floor(100 * Math.pow(1.5, character.level - 1)),
          
          health: {
            current: character.currentHealth,
            max: maxHealth,
            percentage: Math.round((character.currentHealth / maxHealth) * 100)
          },
          
          mana: {
            current: character.currentMana,
            max: maxMana,
            percentage: Math.round((character.currentMana / maxMana) * 100)
          },
          
          stamina: {
            current: character.currentStamina,
            max: maxStamina,
            percentage: Math.round((character.currentStamina / maxStamina) * 100)
          },
          
          attributes: {
            strength: character.strength,
            agility: character.agility,
            intelligence: character.intelligence,
            vitality: character.vitality,
            wisdom: character.wisdom,
            charisma: character.charisma,
          },
          
          combat: {
            attack: character.strength + (character.agility / 2),
            defense: character.vitality + (character.agility / 4),
            magicAttack: character.intelligence + (character.wisdom / 2),
            magicDefense: character.wisdom + (character.intelligence / 4),
            accuracy: character.agility + (character.intelligence / 4),
            evasion: character.agility + (character.charisma / 4),
          },
          
          resources: {
            gold: character.gold,
            gems: character.gems,
          }
        }

        res.status(200).json({
          success: true,
          data: stats
        })
      } else {
        res.status(404).json(result)
      }

    } catch (error) {
      logger.error('Get character stats controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
