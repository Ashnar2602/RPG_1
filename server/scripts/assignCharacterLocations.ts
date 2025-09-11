import { prisma } from '../src/utils/prisma.js';

async function assignCharacterLocations() {
  console.log('📍 Assigning locations to existing characters...\n');

  try {
    // Get the starting area (Valle Profonda)
    const startArea = await prisma.location.findFirst({
      where: { isStartArea: true }
    });

    if (!startArea) {
      console.log('❌ Start area not found');
      return;
    }

    console.log(`🏠 Found start area: ${startArea.name} at (${startArea.x}, ${startArea.y})`);

    // Get all characters without a location
    const charactersWithoutLocation = await prisma.character.findMany({
      where: {
        OR: [
          { locationId: null },
          { locationId: '' }
        ]
      },
      select: {
        id: true,
        name: true,
        race: true,
        characterClass: true
      }
    });

    console.log(`👥 Found ${charactersWithoutLocation.length} characters without location`);

    if (charactersWithoutLocation.length === 0) {
      console.log('✅ All characters already have locations assigned');
      return;
    }

    // Assign start area to all characters
    for (const character of charactersWithoutLocation) {
      await prisma.character.update({
        where: { id: character.id },
        data: {
          locationId: startArea.id,
          x: startArea.x + (Math.random() * 20 - 10), // Random position within 10 units of center
          y: startArea.y + (Math.random() * 20 - 10),
          z: startArea.z
        }
      });

      console.log(`✅ ${character.name} (${character.characterClass}) assigned to ${startArea.name}`);
    }

    // Verify assignments
    const updatedCharacters = await prisma.character.findMany({
      where: {
        id: { in: charactersWithoutLocation.map(c => c.id) }
      },
      include: {
        location: {
          select: {
            name: true,
            type: true
          }
        }
      }
    });

    console.log('\n📋 Character locations after assignment:');
    updatedCharacters.forEach(char => {
      console.log(`   ${char.name}: ${char.location?.name || 'No location'} (${char.x.toFixed(1)}, ${char.y.toFixed(1)})`);
    });

    console.log('\n🎮 Character locations assigned successfully!');

  } catch (error) {
    console.error('❌ Failed to assign character locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the assignment
assignCharacterLocations();
