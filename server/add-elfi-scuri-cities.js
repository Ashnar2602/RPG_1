const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addElfiScuriCities() {
  try {
    console.log('🌙 Adding Territorio degli Elfi Scuri cities...');
    
    // Get the region ID
    const elfiScuriRegion = await prisma.location.findFirst({
      where: { name: 'Territorio degli Elfi Scuri' }
    });
    
    if (!elfiScuriRegion) {
      console.error('Territorio degli Elfi Scuri not found!');
      return;
    }
    
    // Add the 4 major cities from the documentation
    const cities = [
      {
        id: 'city_nalthor',
        name: 'Nalthor',
        description: 'Cuore Ombra - Capitale degli elfi scuri, città sotterranea del mistero',
        tier: 'CITY',
        parentId: elfiScuriRegion.id,
        coordinatesX: 300, // Same as parent region
        coordinatesY: 0, // Center
        coordinatesZ: -50, // Underground/semi-underground
        population: 80000, // 75k elfi scuri + 5k spie e assassini
        specialFeatures: ['Spionaggio', 'Assassinio', 'Magia Ombra', 'Information Trading'],
        isAccessible: false, // Extremely restricted
        isKnown: false, // Secret city
        isDiscovered: false
      },
      {
        id: 'city_whisperdale',
        name: 'Whisperdale',
        description: 'Valle Sussurro - Centro di spionaggio e addestramento spie',
        tier: 'CITY',
        parentId: elfiScuriRegion.id,
        coordinatesX: 300,
        coordinatesY: -50, // South of Nalthor
        coordinatesZ: 0,
        population: 30000, // 28k elfi scuri + 2k information brokers
        specialFeatures: ['Espionage', 'Code Breaking', 'Surveillance', 'Stealth'],
        isAccessible: false, // Very high clearance
        isKnown: false,
        isDiscovered: false
      },
      {
        id: 'city_shadowmere',
        name: 'Shadowmere',
        description: 'Lago Ombra - Centro di ricerca della magia delle ombre',
        tier: 'CITY',
        parentId: elfiScuriRegion.id,
        coordinatesX: 300,
        coordinatesY: 50, // North of Nalthor
        coordinatesZ: 0,
        population: 26500, // 25k elfi scuri + 1.5k shadow mages
        specialFeatures: ['Shadow Magic', 'Illusion', 'Darkness Manipulation', 'Dark Rituals'],
        isAccessible: false, // Shadow mages only
        isKnown: false,
        isDiscovered: false
      },
      {
        id: 'city_thornwall',
        name: 'Thornwall',
        description: 'Muro Spine - Fortezza di confine, controllo accessi al territorio',
        tier: 'CITY',
        parentId: elfiScuriRegion.id,
        coordinatesX: 300,
        coordinatesY: -100, // Far south (border)
        coordinatesZ: 20,
        population: 25000, // 22k elfi scuri + 3k border guards
        specialFeatures: ['Defense', 'Border Patrol', 'Foreign Surveillance', 'Access Control'],
        isAccessible: true, // This is the only "accessible" one for border crossing
        isKnown: true, // Known as border checkpoint
        isDiscovered: false
      }
    ];
    
    for (const city of cities) {
      await prisma.location.create({
        data: city
      });
      console.log(`✅ Added city: ${city.name} (${city.population?.toLocaleString()} pop) - ${city.isAccessible ? 'Accessible' : 'Restricted'}`);
    }
    
    console.log('🎉 Territorio degli Elfi Scuri cities completed!');
    
    // Verify the update
    const updatedRegion = await prisma.location.findFirst({
      where: { id: elfiScuriRegion.id },
      include: { children: true }
    });
    
    console.log(`✅ ${updatedRegion.name} now has ${updatedRegion.children.length} cities:`);
    updatedRegion.children.sort((a, b) => b.population - a.population).forEach(city => {
      console.log(`  - ${city.name} (${city.population?.toLocaleString()} pop) - ${city.isKnown ? 'Known' : 'Secret'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addElfiScuriCities();
