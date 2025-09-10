import prisma from '@/utils/database'
import bcrypt from 'bcryptjs'
import logger from '@/utils/logger'

async function seedDatabase() {
  try {
    logger.info('🚀 Starting database seed...')

    // Create default locations
    logger.info('Creating default locations...')
    
    const locations = await Promise.all([
      prisma.location.upsert({
        where: { id: 'newbie-town' },
        update: {},
        create: {
          id: 'newbie-town',
          name: 'Newbie Town',
          description: 'A peaceful starting town for new adventurers',
          type: 'TOWN',
          x: 0,
          y: 0,
          z: 0,
          isStartArea: true,
          isSafeZone: true,
          isPvpEnabled: false,
          maxPlayers: 100,
        }
      }),
      
      prisma.location.upsert({
        where: { id: 'forest-entrance' },
        update: {},
        create: {
          id: 'forest-entrance',
          name: 'Forest Entrance',
          description: 'The entrance to the mysterious Whispering Woods',
          type: 'WILDERNESS',
          x: 100,
          y: 0,
          z: 0,
          isStartArea: false,
          isSafeZone: false,
          isPvpEnabled: true,
          maxPlayers: 50,
        }
      }),
      
      prisma.location.upsert({
        where: { id: 'goblin-cave' },
        update: {},
        create: {
          id: 'goblin-cave',
          name: 'Goblin Cave',
          description: 'A dark cave inhabited by hostile goblins',
          type: 'CAVE',
          x: 150,
          y: 50,
          z: -10,
          isStartArea: false,
          isSafeZone: false,
          isPvpEnabled: false,
          maxPlayers: 10,
        }
      })
    ])

    logger.info(`Created ${locations.length} locations`)

    // Create basic items
    logger.info('Creating basic items...')
    
    const items = await Promise.all([
      // Weapons
      prisma.item.upsert({
        where: { id: 'basic_sword' },
        update: {},
        create: {
          id: 'basic_sword',
          name: 'Basic Iron Sword',
          description: 'A simple but reliable iron sword for new warriors',
          type: 'WEAPON',
          subType: 'sword',
          rarity: 'COMMON',
          value: 25,
          weight: 3.0,
          damage: 15,
          defense: 0,
          durability: 100,
          levelRequired: 1,
        }
      }),
      
      prisma.item.upsert({
        where: { id: 'basic_staff' },
        update: {},
        create: {
          id: 'basic_staff',
          name: 'Apprentice Staff',
          description: 'A wooden staff imbued with basic magical energy',
          type: 'WEAPON',
          subType: 'staff',
          rarity: 'COMMON',
          value: 20,
          weight: 2.0,
          damage: 8,
          defense: 0,
          durability: 100,
          levelRequired: 1,
        }
      }),
      
      // Armor
      prisma.item.upsert({
        where: { id: 'leather_armor' },
        update: {},
        create: {
          id: 'leather_armor',
          name: 'Leather Armor',
          description: 'Basic leather armor providing modest protection',
          type: 'ARMOR',
          subType: 'chest',
          rarity: 'COMMON',
          value: 30,
          weight: 5.0,
          damage: 0,
          defense: 10,
          durability: 100,
          levelRequired: 1,
        }
      }),
      
      // Consumables
      prisma.item.upsert({
        where: { id: 'health_potion' },
        update: {},
        create: {
          id: 'health_potion',
          name: 'Health Potion',
          description: 'A red potion that restores health when consumed',
          type: 'CONSUMABLE',
          subType: 'potion',
          rarity: 'COMMON',
          value: 10,
          weight: 0.2,
          stackable: true,
          maxStack: 50,
          levelRequired: 1,
        }
      }),
      
      prisma.item.upsert({
        where: { id: 'mana_potion' },
        update: {},
        create: {
          id: 'mana_potion',
          name: 'Mana Potion',
          description: 'A blue potion that restores magical energy',
          type: 'CONSUMABLE',
          subType: 'potion',
          rarity: 'COMMON',
          value: 12,
          weight: 0.2,
          stackable: true,
          maxStack: 50,
          levelRequired: 1,
        }
      })
    ])

    logger.info(`Created ${items.length} items`)

    // Create NPCs
    logger.info('Creating NPCs...')
    
    const npcs = await Promise.all([
      prisma.nPC.upsert({
        where: { id: 'town-guard' },
        update: {},
        create: {
          id: 'town-guard',
          name: 'Town Guard',
          description: 'A vigilant guard protecting the town',
          type: 'GUARD',
          race: 'HUMAN',
          level: 5,
          health: 150,
          damage: 20,
          defense: 15,
          locationId: 'newbie-town',
          x: 10,
          y: 10,
          z: 0,
          isAggressive: false,
          patrolRadius: 20,
          goldDrop: 0,
          expDrop: 0,
        }
      }),
      
      prisma.nPC.upsert({
        where: { id: 'item-merchant' },
        update: {},
        create: {
          id: 'item-merchant',
          name: 'Item Merchant',
          description: 'A friendly merchant selling basic supplies',
          type: 'MERCHANT',
          race: 'HUMAN',
          level: 1,
          health: 100,
          damage: 0,
          defense: 5,
          locationId: 'newbie-town',
          x: -5,
          y: 15,
          z: 0,
          isAggressive: false,
          patrolRadius: 5,
          goldDrop: 0,
          expDrop: 0,
        }
      }),
      
      prisma.nPC.upsert({
        where: { id: 'goblin-warrior' },
        update: {},
        create: {
          id: 'goblin-warrior',
          name: 'Goblin Warrior',
          description: 'A fierce goblin warrior guarding the cave',
          type: 'MONSTER',
          race: 'ORC', // Using ORC as closest to goblin
          level: 3,
          health: 80,
          damage: 25,
          defense: 8,
          locationId: 'goblin-cave',
          x: 0,
          y: 0,
          z: -5,
          isAggressive: true,
          patrolRadius: 15,
          goldDrop: 5,
          expDrop: 25,
        }
      })
    ])

    logger.info(`Created ${npcs.length} NPCs`)

    // Create basic quests
    logger.info('Creating basic quests...')
    
    const quests = await Promise.all([
      prisma.quest.upsert({
        where: { id: 'welcome-quest' },
        update: {},
        create: {
          id: 'welcome-quest',
          title: 'Welcome to the World',
          description: 'Explore the town and talk to the Item Merchant to get familiar with the game',
          type: 'EXPLORATION',
          level: 1,
          levelRequired: 1,
          expReward: 50,
          goldReward: 10,
          giveNPCId: 'town-guard',
          turnInNPCId: 'item-merchant',
          isActive: true,
        }
      }),
      
      prisma.quest.upsert({
        where: { id: 'goblin-threat' },
        update: {},
        create: {
          id: 'goblin-threat',
          title: 'Goblin Threat',
          description: 'Eliminate the goblin threat in the nearby cave. Kill 5 goblins.',
          type: 'KILL',
          level: 3,
          levelRequired: 2,
          expReward: 200,
          goldReward: 50,
          giveNPCId: 'town-guard',
          isActive: true,
        }
      })
    ])

    logger.info(`Created ${quests.length} quests`)

    // Create chat channels
    logger.info('Creating chat channels...')
    
    const channels = await Promise.all([
      prisma.chatChannel.upsert({
        where: { id: 'global' },
        update: {},
        create: {
          id: 'global',
          name: 'Global',
          type: 'GLOBAL',
          isActive: true,
        }
      }),
      
      prisma.chatChannel.upsert({
        where: { id: 'local' },
        update: {},
        create: {
          id: 'local',
          name: 'Local',
          type: 'LOCAL',
          isActive: true,
        }
      }),
      
      prisma.chatChannel.upsert({
        where: { id: 'system' },
        update: {},
        create: {
          id: 'system',
          name: 'System',
          type: 'SYSTEM',
          isActive: true,
        }
      })
    ])

    logger.info(`Created ${channels.length} chat channels`)

    // Create game configuration
    logger.info('Creating game configuration...')
    
    const configs = await Promise.all([
      prisma.gameConfig.upsert({
        where: { key: 'max_level' },
        update: {},
        create: {
          key: 'max_level',
          value: '100',
          description: 'Maximum character level',
          category: 'character',
        }
      }),
      
      prisma.gameConfig.upsert({
        where: { key: 'starting_gold' },
        update: {},
        create: {
          key: 'starting_gold',
          value: '100',
          description: 'Starting gold for new characters',
          category: 'character',
        }
      }),
      
      prisma.gameConfig.upsert({
        where: { key: 'pvp_enabled' },
        update: {},
        create: {
          key: 'pvp_enabled',
          value: 'true',
          description: 'Whether PvP is enabled globally',
          category: 'gameplay',
        }
      }),
      
      prisma.gameConfig.upsert({
        where: { key: 'guild_creation_cost' },
        update: {},
        create: {
          key: 'guild_creation_cost',
          value: '1000',
          description: 'Gold cost to create a guild',
          category: 'guild',
        }
      })
    ])

    logger.info(`Created ${configs.length} configuration entries`)

    // Create test admin user (optional)
    if (process.env.CREATE_ADMIN_USER === 'true') {
      logger.info('Creating test admin user...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const adminUser = await prisma.user.upsert({
        where: { email: 'admin@rpg.test' },
        update: {},
        create: {
          email: 'admin@rpg.test',
          username: 'admin',
          password: hashedPassword,
          isActive: true,
          isPremium: true,
        }
      })

      logger.info(`Created admin user: ${adminUser.username}`)
    }

    logger.info('✅ Database seed completed successfully!')
    
    // Print summary
    console.log('\n=== SEED SUMMARY ===')
    console.log(`📍 Locations: ${locations.length}`)
    console.log(`⚔️  Items: ${items.length}`)
    console.log(`🤖 NPCs: ${npcs.length}`)
    console.log(`📋 Quests: ${quests.length}`)
    console.log(`💬 Chat Channels: ${channels.length}`)
    console.log(`⚙️  Config Entries: ${configs.length}`)
    console.log('\n🎮 The game world is ready!')

  } catch (error) {
    logger.error('Database seed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

export default seedDatabase
