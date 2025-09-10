import prisma from '@/utils/database'
import logger from '@/utils/logger'
import { redisUtils } from '@/utils/redis'
import config from '@/config'

interface CreateCharacterData {
  name: string
  race: string
  characterClass: string
}

interface UpdateCharacterData {
  currentHealth?: number
  currentMana?: number
  currentStamina?: number
  x?: number
  y?: number
  z?: number
  facing?: number
}

export class CharacterService {
  // Create new character
  static async createCharacter(userId: string, data: CreateCharacterData) {
    try {
      const { name, race, characterClass } = data

      // Check if character name is taken
      const existingCharacter = await prisma.character.findUnique({
        where: { name: name.toLowerCase() }
      })

      if (existingCharacter) {
        return {
          success: false,
          message: 'Character name already taken'
        }
      }

      // Get starting location
      const startingLocation = await prisma.location.findFirst({
        where: { isStartArea: true }
      })

      if (!startingLocation) {
        throw new Error('No starting location found')
      }

      // Define base stats by race and class
      const baseStats = this.getBaseStats(race as any, characterClass as any)

      // Create character
      const character = await prisma.character.create({
        data: {
          userId,
          name: name.toLowerCase(),
          race: race as any,
          characterClass: characterClass as any,
          level: 1,
          experience: 0,
          
          // Base stats
          baseHealth: baseStats.health,
          baseMana: baseStats.mana,
          baseStamina: baseStats.stamina,
          
          // Current stats
          currentHealth: baseStats.health,
          currentMana: baseStats.mana,
          currentStamina: baseStats.stamina,
          
          // Attributes
          strength: baseStats.strength,
          agility: baseStats.agility,
          intelligence: baseStats.intelligence,
          vitality: baseStats.vitality,
          wisdom: baseStats.wisdom,
          charisma: baseStats.charisma,
          
          // Starting position
          locationId: startingLocation.id,
          x: startingLocation.x,
          y: startingLocation.y,
          z: startingLocation.z,
          
          // Starting resources
          gold: 100,
          gems: 0,
        },
        include: {
          location: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        }
      })

      // Give starting equipment/items
      await this.giveStartingItems(character.id, race as any, characterClass as any)

      logger.info(`Character created: ${character.name} (${character.race} ${character.characterClass}) for user ${userId}`)

      return {
        success: true,
        data: character,
        message: 'Character created successfully'
      }

    } catch (error) {
      logger.error('Create character error:', error)
      return {
        success: false,
        message: 'Character creation failed'
      }
    }
  }

  // Get user characters
  static async getUserCharacters(userId: string) {
    try {
      const characters = await prisma.character.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          race: true,
          characterClass: true,
          level: true,
          experience: true,
          currentHealth: true,
          baseHealth: true,
          currentMana: true,
          baseMana: true,
          gold: true,
          gems: true,
          lastLogin: true,
          location: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        },
        orderBy: {
          lastLogin: 'desc'
        }
      })

      return {
        success: true,
        data: characters
      }

    } catch (error) {
      logger.error('Get user characters error:', error)
      return {
        success: false,
        message: 'Failed to fetch characters'
      }
    }
  }

  // Get character details
  static async getCharacterDetails(characterId: string, userId: string) {
    try {
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
          userId: userId, // Ensure user owns this character
        },
        include: {
          location: {
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              isSafeZone: true,
              isPvpEnabled: true,
            }
          },
          inventory: {
            include: {
              item: true
            },
            orderBy: {
              slot: 'asc'
            }
          },
          equipment: {
            include: {
              item: true
            }
          },
          guildMember: {
            include: {
              guild: {
                select: {
                  id: true,
                  name: true,
                  tag: true,
                  level: true,
                }
              }
            }
          }
        }
      })

      if (!character) {
        return {
          success: false,
          message: 'Character not found'
        }
      }

      return {
        success: true,
        data: character
      }

    } catch (error) {
      logger.error('Get character details error:', error)
      return {
        success: false,
        message: 'Failed to fetch character details'
      }
    }
  }

  // Update character position and stats
  static async updateCharacter(characterId: string, userId: string, data: UpdateCharacterData) {
    try {
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
          userId: userId,
        }
      })

      if (!character) {
        return {
          success: false,
          message: 'Character not found'
        }
      }

      const updatedCharacter = await prisma.character.update({
        where: { id: characterId },
        data: {
          ...data,
          updatedAt: new Date(),
        }
      })

      return {
        success: true,
        data: updatedCharacter
      }

    } catch (error) {
      logger.error('Update character error:', error)
      return {
        success: false,
        message: 'Failed to update character'
      }
    }
  }

  // Delete character
  static async deleteCharacter(characterId: string, userId: string) {
    try {
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
          userId: userId,
        }
      })

      if (!character) {
        return {
          success: false,
          message: 'Character not found'
        }
      }

      await prisma.character.delete({
        where: { id: characterId }
      })

      logger.info(`Character deleted: ${character.name} (${characterId}) by user ${userId}`)

      return {
        success: true,
        message: 'Character deleted successfully'
      }

    } catch (error) {
      logger.error('Delete character error:', error)
      return {
        success: false,
        message: 'Failed to delete character'
      }
    }
  }

  // Character login (set as active)
  static async loginCharacter(characterId: string, userId: string) {
    try {
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
          userId: userId,
        }
      })

      if (!character) {
        return {
          success: false,
          message: 'Character not found'
        }
      }

      // Update last login
      await prisma.character.update({
        where: { id: characterId },
        data: { lastLogin: new Date() }
      })

      // Cache active character
      await redisUtils.set(
        `user:active_character:${userId}`,
        characterId,
        config.sessionTimeout / 1000
      )

      logger.info(`Character login: ${character.name} (${characterId})`)

      return {
        success: true,
        data: character,
        message: 'Character login successful'
      }

    } catch (error) {
      logger.error('Character login error:', error)
      return {
        success: false,
        message: 'Character login failed'
      }
    }
  }

  // Get active character for user
  static async getActiveCharacter(userId: string) {
    try {
      const characterId = await redisUtils.get(`user:active_character:${userId}`)
      
      if (!characterId) {
        return null
      }

      return await this.getCharacterDetails(characterId, userId)

    } catch (error) {
      logger.error('Get active character error:', error)
      return null
    }
  }

  // Private helper methods
  private static getBaseStats(race: any, characterClass: any) {
    // Base stats by race
    const raceStats: Record<string, any> = {
      HUMAN: { health: 100, mana: 50, stamina: 100, strength: 10, agility: 10, intelligence: 10, vitality: 10, wisdom: 10, charisma: 10 },
      ELF: { health: 80, mana: 80, stamina: 90, strength: 8, agility: 12, intelligence: 12, vitality: 8, wisdom: 12, charisma: 11 },
      DWARF: { health: 120, mana: 40, stamina: 110, strength: 12, agility: 8, intelligence: 9, vitality: 12, wisdom: 10, charisma: 8 },
      GNOME: { health: 70, mana: 90, stamina: 80, strength: 7, agility: 11, intelligence: 13, vitality: 7, wisdom: 13, charisma: 10 },
      ORC: { health: 130, mana: 30, stamina: 120, strength: 14, agility: 9, intelligence: 7, vitality: 13, wisdom: 7, charisma: 6 },
      TROLL: { health: 150, mana: 20, stamina: 140, strength: 16, agility: 6, intelligence: 6, vitality: 15, wisdom: 6, charisma: 5 },
      LIZARDMAN: { health: 110, mana: 40, stamina: 100, strength: 11, agility: 10, intelligence: 8, vitality: 11, wisdom: 9, charisma: 7 },
      FISHMAN: { health: 90, mana: 60, stamina: 80, strength: 9, agility: 12, intelligence: 10, vitality: 9, wisdom: 11, charisma: 8 },
      AERATHI: { health: 70, mana: 100, stamina: 70, strength: 7, agility: 13, intelligence: 14, vitality: 7, wisdom: 14, charisma: 12 },
      GUOLGARN: { health: 140, mana: 25, stamina: 130, strength: 15, agility: 7, intelligence: 6, vitality: 14, wisdom: 6, charisma: 5 },
      ZARKAAN: { health: 85, mana: 70, stamina: 85, strength: 8, agility: 11, intelligence: 11, vitality: 8, wisdom: 12, charisma: 11 },
    }

    // Class modifiers
    const classModifiers: Record<string, any> = {
      WARRIOR: { health: 20, mana: -10, stamina: 10, strength: 3, vitality: 2 },
      MAGE: { health: -20, mana: 30, stamina: -10, intelligence: 3, wisdom: 2 },
      ROGUE: { health: 0, mana: 0, stamina: 10, agility: 3, intelligence: 1 },
      CLERIC: { health: 10, mana: 20, stamina: 0, wisdom: 3, charisma: 1 },
      RANGER: { health: 5, mana: 5, stamina: 15, agility: 2, wisdom: 2 },
      PALADIN: { health: 15, mana: 10, stamina: 5, strength: 2, charisma: 2 },
      WARLOCK: { health: -10, mana: 25, stamina: -5, intelligence: 2, charisma: 2 },
      BARD: { health: 0, mana: 15, stamina: 5, charisma: 3, intelligence: 1 },
      MONK: { health: 10, mana: 10, stamina: 20, agility: 2, wisdom: 2 },
      BARBARIAN: { health: 25, mana: -15, stamina: 20, strength: 3, vitality: 1 },
    }

    const baseStats = raceStats[race] || raceStats.HUMAN
    const classBonus = classModifiers[characterClass] || {}

    return {
      health: baseStats.health + (classBonus.health || 0),
      mana: baseStats.mana + (classBonus.mana || 0),
      stamina: baseStats.stamina + (classBonus.stamina || 0),
      strength: baseStats.strength + (classBonus.strength || 0),
      agility: baseStats.agility + (classBonus.agility || 0),
      intelligence: baseStats.intelligence + (classBonus.intelligence || 0),
      vitality: baseStats.vitality + (classBonus.vitality || 0),
      wisdom: baseStats.wisdom + (classBonus.wisdom || 0),
      charisma: baseStats.charisma + (classBonus.charisma || 0),
    }
  }

  private static async giveStartingItems(characterId: string, race: any, characterClass: any) {
    try {
      // Create basic starting items if they don't exist
      const startingItems = await this.ensureStartingItemsExist()

      // Give basic weapon based on class
      const weaponMapping: Record<string, string> = {
        WARRIOR: 'basic_sword',
        MAGE: 'basic_staff',
        ROGUE: 'basic_dagger',
        CLERIC: 'basic_mace',
        RANGER: 'basic_bow',
        PALADIN: 'basic_sword',
        WARLOCK: 'basic_staff',
        BARD: 'basic_dagger',
        MONK: 'basic_gloves',
        BARBARIAN: 'basic_axe',
      }

      const weaponKey = weaponMapping[characterClass] || 'basic_sword'
      const weapon = startingItems.find(item => item.id === weaponKey)

      if (weapon) {
        await prisma.inventoryItem.create({
          data: {
            characterId,
            itemId: weapon.id,
            quantity: 1,
            slot: 0,
          }
        })
      }

      // Give basic armor
      const armor = startingItems.find(item => item.id === 'basic_cloth_armor')
      if (armor) {
        await prisma.inventoryItem.create({
          data: {
            characterId,
            itemId: armor.id,
            quantity: 1,
            slot: 1,
          }
        })
      }

      // Give health potions
      const healthPotion = startingItems.find(item => item.id === 'health_potion_small')
      if (healthPotion) {
        await prisma.inventoryItem.create({
          data: {
            characterId,
            itemId: healthPotion.id,
            quantity: 5,
            slot: 2,
          }
        })
      }

    } catch (error) {
      logger.error('Give starting items error:', error)
    }
  }

  private static async ensureStartingItemsExist() {
    const startingItems = [
      {
        id: 'basic_sword',
        name: 'Basic Sword',
        description: 'A simple iron sword for beginners',
        type: 'WEAPON',
        subType: 'sword',
        rarity: 'COMMON',
        value: 10,
        weight: 2.0,
        damage: 10,
        levelRequired: 1,
      },
      {
        id: 'basic_staff',
        name: 'Basic Staff',
        description: 'A wooden staff for spellcasters',
        type: 'WEAPON',
        subType: 'staff',
        rarity: 'COMMON',
        value: 8,
        weight: 1.5,
        damage: 5,
        levelRequired: 1,
      },
      {
        id: 'basic_dagger',
        name: 'Basic Dagger',
        description: 'A sharp dagger for quick strikes',
        type: 'WEAPON',
        subType: 'dagger',
        rarity: 'COMMON',
        value: 6,
        weight: 0.5,
        damage: 8,
        levelRequired: 1,
      },
      {
        id: 'basic_cloth_armor',
        name: 'Basic Cloth Armor',
        description: 'Simple cloth armor for protection',
        type: 'ARMOR',
        subType: 'chest',
        rarity: 'COMMON',
        value: 5,
        weight: 1.0,
        defense: 5,
        levelRequired: 1,
      },
      {
        id: 'health_potion_small',
        name: 'Small Health Potion',
        description: 'Restores 50 health points',
        type: 'CONSUMABLE',
        subType: 'potion',
        rarity: 'COMMON',
        value: 5,
        weight: 0.1,
        stackable: true,
        maxStack: 99,
        levelRequired: 1,
      },
    ]

    const createdItems = []
    for (const itemData of startingItems) {
      const existingItem = await prisma.item.findUnique({
        where: { id: itemData.id }
      })

      if (!existingItem) {
        const item = await prisma.item.create({
          data: itemData as any
        })
        createdItems.push(item)
      } else {
        createdItems.push(existingItem)
      }
    }

    return createdItems
  }
}
