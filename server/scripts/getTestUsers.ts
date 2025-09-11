import { prisma } from '../src/utils/prisma.js';

async function getTestUsers() {
  try {
    console.log('🔍 Fetching test users from database...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get all characters with user info
    const characters = await prisma.character.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    console.log(`📊 Found ${users.length} test users:\n`);
    
    users.forEach((user, index) => {
      const userChars = characters.filter(char => char.userId === user.id);
      
      console.log(`${index + 1}. 👤 USER: ${user.username}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Created: ${user.createdAt.toISOString().split('T')[0]}`);
      console.log(`   🧙‍♂️ Characters: ${userChars.length}`);
      
      userChars.forEach((char, charIndex) => {
        console.log(`      ${charIndex + 1}. ${char.name} - ${char.race} ${char.characterClass} (Level ${char.level})`);
        if (char.locationId) {
          console.log(`         📍 Location ID: ${char.locationId}`);
        }
      });
      console.log('');
    });

    // Get character statistics
    const totalCharacters = await prisma.character.count();

    console.log(`📈 STATISTICS:`);
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Characters: ${totalCharacters}`);
    if (users.length > 0) {
      console.log(`   Characters per User: ${(totalCharacters / users.length).toFixed(1)}`);
    }
    console.log('');

    // Count characters by race
    const raceCount: Record<string, number> = {};
    const classCount: Record<string, number> = {};

    characters.forEach(char => {
      if (char.race) {
        raceCount[char.race] = (raceCount[char.race] || 0) + 1;
      }
      if (char.characterClass) {
        classCount[char.characterClass] = (classCount[char.characterClass] || 0) + 1;
      }
    });

    if (Object.keys(raceCount).length > 0) {
      console.log('🧝‍♂️ CHARACTER RACES:');
      Object.entries(raceCount)
        .sort(([,a], [,b]) => b - a)
        .forEach(([race, count]) => {
          console.log(`   ${race}: ${count} characters`);
        });
      console.log('');
    }

    if (Object.keys(classCount).length > 0) {
      console.log('⚔️ CHARACTER CLASSES:');
      Object.entries(classCount)
        .sort(([,a], [,b]) => b - a)
        .forEach(([charClass, count]) => {
          console.log(`   ${charClass}: ${count} characters`);
        });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getTestUsers();
