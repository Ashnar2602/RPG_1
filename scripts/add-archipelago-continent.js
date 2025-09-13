const { PrismaClient } = require('@prisma/client');

async function addArchipelagoContinent() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🏝️ Adding Arcipelago Centrale...');
    
    // Add the continent
    const archipelago = await prisma.location.create({
      data: {
        id: 'continent_archipelago',
        name: 'Arcipelago Centrale',
        description: "L'arcipelago centrale, regno del commercio marittimo e dell'esplorazione",
        tier: 'CONTINENT',
        coordinatesX: 0,
        coordinatesY: 0,
        population: 3000000,
        isAccessible: true,
        isStartArea: false,
        specialFeatures: ['Hub commerciale', 'Navigazione esperta'],
        requirements: {}
      }
    });
    
    console.log('✅ Arcipelago Centrale created:', archipelago.name);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addArchipelagoContinent();
