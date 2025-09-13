const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBrynnarCities() {
  try {
    console.log('🏰 Adding Regno di Brynnar major cities...');
    
    // Get the region ID
    const brynnarRegion = await prisma.location.findFirst({
      where: { name: 'Regno di Brynnar' }
    });
    
    if (!brynnarRegion) {
      console.error('Regno di Brynnar not found!');
      return;
    }
    
    // Add the 3 missing major cities
    const cities = [
      {
        id: 'city_ironwolf',
        name: 'Ironwolf',
        description: 'Lupo Ferro - Capitale delle clan lupo, centro di addestramento cavalieri bestia',
        tier: 'CITY',
        parentId: brynnarRegion.id,
        coordinatesX: 200, // Same as parent region
        coordinatesY: 250, // Slightly north
        coordinatesZ: 0,
        population: 50000,
        specialFeatures: ['Wolf Riding', 'Beast Mastery', 'Forest Warfare', 'Pack Tactics'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      },
      {
        id: 'city_stormhaven',
        name: 'Stormhaven',
        description: 'Rifugio Tempesta - Porto del nord, sede dei maestri delle tempeste',
        tier: 'CITY',
        parentId: brynnarRegion.id,
        coordinatesX: 200,
        coordinatesY: 400, // More north (coast)
        coordinatesZ: 0,
        population: 41000,
        specialFeatures: ['Storm Magic', 'Naval Combat', 'Deep Sea Fishing', 'Weather Control'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      },
      {
        id: 'city_frostbeard',
        name: 'Frostbeard',
        description: 'Barbagelo - Città montana, centro di lavorazione del ghiaccio e magia del freddo',
        tier: 'CITY',
        parentId: brynnarRegion.id,
        coordinatesX: 200,  
        coordinatesY: 200, // South of Valkhyr
        coordinatesZ: 100, // Mountain elevation
        population: 44000,
        specialFeatures: ['Ice Crafting', 'Cold Resistance', 'Winter Warfare', 'Ice Magic'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      }
    ];
    
    for (const city of cities) {
      await prisma.location.create({
        data: city
      });
      console.log(`✅ Added city: ${city.name}`);
    }
    
    console.log('🎉 Regno di Brynnar major cities completed!');
    
    // Verify the update
    const updatedRegion = await prisma.location.findFirst({
      where: { id: brynnarRegion.id },
      include: { children: true }
    });
    
    console.log(`✅ ${updatedRegion.name} now has ${updatedRegion.children.length} cities:`);
    updatedRegion.children.forEach(city => {
      console.log(`  - ${city.name} (${city.population?.toLocaleString()} pop)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBrynnarCities();
