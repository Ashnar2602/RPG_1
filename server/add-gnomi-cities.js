const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGnomiCities() {
  try {
    console.log('⚙️ Adding Regno degli Gnomi cities...');
    
    // Get the region ID
    const gnomiRegion = await prisma.location.findFirst({
      where: { name: 'Regno degli Gnomi' }
    });
    
    if (!gnomiRegion) {
      console.error('Regno degli Gnomi not found!');
      return;
    }
    
    // Add the 4 major cities from the documentation
    const cities = [
      {
        id: 'city_teldrun',
        name: 'Teldrun',
        description: 'Fortezza Precisione - Capitale gnoma, città-macchina di ingegneria perfetta',
        tier: 'CITY',
        parentId: gnomiRegion.id,
        coordinatesX: -100, // Same as parent region
        coordinatesY: 200, // Center
        coordinatesZ: 200, // Mountain elevation
        population: 115000, // 95k gnomi + 12k apprentices + 8k customers
        specialFeatures: ['Precision Engineering', 'Clockwork', 'Measurement', 'Navigation'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      },
      {
        id: 'city_gearspring',
        name: 'Gearspring',
        description: 'Sorgente Ingranaggi - Centro di ingegneria idraulica e sistemi meccanici',
        tier: 'CITY',
        parentId: gnomiRegion.id,
        coordinatesX: -100,
        coordinatesY: 150, // South of Teldrun
        coordinatesZ: 150,
        population: 43000, // 38k gnomi + 5k water engineers
        specialFeatures: ['Hydraulics', 'Water Engineering', 'Power Transmission', 'Mechanical Systems'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      },
      {
        id: 'city_copperwork',
        name: 'Copperwork',
        description: 'Lavorrame - Centro di metallurgia e sperimentazione elettrica primitiva',
        tier: 'CITY',
        parentId: gnomiRegion.id,
        coordinatesX: -100,
        coordinatesY: 250, // North of Teldrun
        coordinatesZ: 180,
        population: 39000, // 35k gnomi + 4k metalworkers
        specialFeatures: ['Metallurgy', 'Wire Crafting', 'Early Electrical Work', 'Mining'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      },
      {
        id: 'city_timekeeper',
        name: 'Timekeeper',
        description: 'Custode Tempo - Osservatorio e centro di misurazione temporale',
        tier: 'CITY',
        parentId: gnomiRegion.id,
        coordinatesX: -100,
        coordinatesY: 300, // Far north
        coordinatesZ: 250, // High mountain
        population: 35000, // 32k gnomi + 3k time specialists
        specialFeatures: ['Chronometry', 'Astronomy', 'Calendar Systems', 'Time Keeping'],
        isAccessible: true,
        isKnown: true,
        isDiscovered: false
      }
    ];
    
    for (const city of cities) {
      await prisma.location.create({
        data: city
      });
      console.log(`✅ Added city: ${city.name} (${city.population?.toLocaleString()} pop)`);
    }
    
    console.log('🎉 Regno degli Gnomi cities completed!');
    
    // Verify the update
    const updatedRegion = await prisma.location.findFirst({
      where: { id: gnomiRegion.id },
      include: { children: true }
    });
    
    console.log(`✅ ${updatedRegion.name} now has ${updatedRegion.children.length} cities:`);
    updatedRegion.children.sort((a, b) => b.population - a.population).forEach(city => {
      console.log(`  - ${city.name} (${city.population?.toLocaleString()} pop)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGnomiCities();
