import { prisma } from '../src/utils/prisma.js';

async function createTestCharacters() {
  console.log('🎭 Creating Test Characters for Combat System...\n');

  try {
    // Get first user for character creation
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found. Please register a user first.');
      return;
    }

    // Create a Warrior character
    const warrior = await prisma.character.create({
      data: {
        name: 'Thorgar the Mighty',
        race: 'DWARF',
        characterClass: 'WARRIOR',
        level: 5,
        experience: 1200,
        // Warrior stats - high STR and vitality
        strength: 18,
        agility: 12,
        intelligence: 10,
        vitality: 16,
        wisdom: 8,
        charisma: 8,
        // Health and mana
        baseHealth: 85,
        currentHealth: 85,
        baseMana: 20,
        currentMana: 20,
        gold: 500,
        userId: user.id
      }
    });

    // Create a Mage character
    const mage = await prisma.character.create({
      data: {
        name: 'Lyralei Starweaver',
        race: 'ELF',
        characterClass: 'MAGE',
        level: 4,
        experience: 800,
        // Mage stats - high INT and low physical
        strength: 8,
        agility: 14,
        intelligence: 18,
        vitality: 10,
        wisdom: 14,
        charisma: 12,
        // Health and mana
        baseHealth: 45,
        currentHealth: 45,
        baseMana: 80,
        currentMana: 80,
        gold: 300,
        userId: user.id
      }
    });

    // Create a Cleric character
    const cleric = await prisma.character.create({
      data: {
        name: 'Brother Marcus',
        race: 'HUMAN',
        characterClass: 'CLERIC',
        level: 4,
        experience: 750,
        // Cleric stats - balanced with good wisdom
        strength: 12,
        agility: 10,
        intelligence: 14,
        vitality: 14,
        wisdom: 16,
        charisma: 12,
        // Health and mana
        baseHealth: 60,
        currentHealth: 60,
        baseMana: 55,
        currentMana: 55,
        gold: 400,
        userId: user.id
      }
    });

    // Create a Rogue character (using GNOME since HALFLING doesn't exist)
    const rogue = await prisma.character.create({
      data: {
        name: 'Shadowfang',
        race: 'GNOME',
        characterClass: 'ROGUE',
        level: 5,
        experience: 1100,
        // Rogue stats - high AGI and decent STR
        strength: 14,
        agility: 18,
        intelligence: 12,
        vitality: 12,
        wisdom: 10,
        charisma: 10,
        // Health and mana
        baseHealth: 55,
        currentHealth: 55,
        baseMana: 30,
        currentMana: 30,
        gold: 350,
        userId: user.id
      }
    });

    console.log('✅ Successfully created test characters:');
    console.log(`🛡️  ${warrior.name} - Level ${warrior.level} ${warrior.race} ${warrior.characterClass}`);
    console.log(`   STR:${warrior.strength} AGI:${warrior.agility} INT:${warrior.intelligence} HP:${warrior.currentHealth}/${warrior.baseHealth}`);
    console.log(`🔮 ${mage.name} - Level ${mage.level} ${mage.race} ${mage.characterClass}`);
    console.log(`   STR:${mage.strength} AGI:${mage.agility} INT:${mage.intelligence} HP:${mage.currentHealth}/${mage.baseHealth} MP:${mage.currentMana}/${mage.baseMana}`);
    console.log(`⚡ ${cleric.name} - Level ${cleric.level} ${cleric.race} ${cleric.characterClass}`);
    console.log(`   STR:${cleric.strength} AGI:${cleric.agility} INT:${cleric.intelligence} HP:${cleric.currentHealth}/${cleric.baseHealth} MP:${cleric.currentMana}/${cleric.baseMana}`);
    console.log(`🗡️  ${rogue.name} - Level ${rogue.level} ${rogue.race} ${rogue.characterClass}`);
    console.log(`   STR:${rogue.strength} AGI:${rogue.agility} INT:${rogue.intelligence} HP:${rogue.currentHealth}/${rogue.baseHealth}`);

    console.log('\n🎮 Characters ready for combat testing!');

  } catch (error) {
    console.error('❌ Failed to create test characters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the character creation
createTestCharacters();
