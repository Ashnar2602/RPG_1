import { prisma } from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function setupTestUser() {
  console.log('🔧 Setting up test user for API testing...\n');

  try {
    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'combat@test.com' }
    });

    if (existingUser) {
      console.log('ℹ️  Test user already exists');
      return existingUser;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const testUser = await prisma.user.create({
      data: {
        email: 'combat@test.com',
        username: 'combatuser',
        password: hashedPassword,
        role: 'PLAYER'
      }
    });

    console.log('✅ Test user created successfully');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Username: ${testUser.username}`);
    console.log(`   ID: ${testUser.id}\n`);

    // Create a test character for this user
    const testCharacter = await prisma.character.create({
      data: {
        name: 'API Tester',
        race: 'HUMAN',
        characterClass: 'WARRIOR',
        level: 3,
        experience: 500,
        strength: 15,
        agility: 12,
        intelligence: 10,
        vitality: 14,
        wisdom: 10,
        charisma: 8,
        baseHealth: 70,
        currentHealth: 70,
        baseMana: 30,
        currentMana: 30,
        gold: 200,
        userId: testUser.id
      }
    });

    console.log(`✅ Test character created: ${testCharacter.name} (${testCharacter.characterClass})`);
    console.log(`   Stats: STR:${testCharacter.strength} AGI:${testCharacter.agility} INT:${testCharacter.intelligence}`);
    console.log(`   Health: ${testCharacter.currentHealth}/${testCharacter.baseHealth}\n`);

    return testUser;

  } catch (error) {
    console.error('❌ Failed to setup test user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupTestUser();
