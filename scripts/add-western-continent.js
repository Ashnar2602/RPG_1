const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addWesternContinent() {
  try {
    console.log('🌊 Adding Continente Occidentale...\n');

    const continent = await prisma.worldLocation.create({
      data: {
        id: 'continent_occidentale',
        name: 'Continente Occidentale',
        description: 'Il continente occidentale, terra di nani, orchi e montagne maestose',
        tier: 'continent',
        coordinatesX: -1000,
        coordinatesY: 0,
        coordinatesZ: 0,
        isAccessible: true,
        isKnown: false,
        isDiscovered: false,
        isSafeZone: true,
        isPvpEnabled: false,
        isStartArea: false,
        maxPlayers: 50,
        specialFeatures: [
          'Ricco di metalli',
          'Montagne alte',
          'Forgiatori leggendari'
        ],
        population: 1800000,
        requirements: {},
        loreConnections: {}
      }
    });

    console.log('✅ Continente Occidentale creato:', continent.name);
    console.log('   ID:', continent.id);
    console.log('   Popolazione:', continent.population?.toLocaleString());

  } catch (error) {
    console.error('❌ Errore nella creazione:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addWesternContinent();
