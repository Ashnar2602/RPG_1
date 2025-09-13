const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addVelendarCities() {
  console.log('🏛️ Adding Regno di Velendar cities...');

  try {
    // Find the Regno di Velendar region
    const velendarRegion = await prisma.location.findFirst({
      where: {
        name: 'Regno di Velendar',
        tier: 'REGION'
      }
    });

    if (!velendarRegion) {
      console.error('❌ Regno di Velendar region not found!');
      return;
    }

    // Add the 4 major cities of Regno di Velendar
    const cities = [
      {
        name: 'Thalareth',
        tier: 'CITY',
        description: 'Capitale del Regno e sede dell\'Accademia di Magia Suprema. Città costruita su penisola nel Grande Lago, collegata da ponti magici. Centro del potere politico e magico del mondo conosciuto.',
        population: 435000, // 350k + 85k students/foreigners
        coordinatesX: velendarRegion.coordinatesX,
        coordinatesY: velendarRegion.coordinatesY + 100, // Center-south position
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      },
      {
        name: 'Goldenharbor',
        tier: 'CITY', 
        description: 'Porto Dorato, principale porto commerciale del continente. Centro del commercio internazionale con cantieri navali, dogane e banche internazionali.',
        population: 100000, // 85k + 15k international merchants
        coordinatesX: velendarRegion.coordinatesX + 200,
        coordinatesY: velendarRegion.coordinatesY - 150, // South coast
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      },
      {
        name: 'Silverbrook',
        tier: 'CITY',
        description: 'Ruscello d\'Argento, centro di artigianato di lusso nelle colline orientali. Famosa per argenteria, gioielleria e arte raffinata.',
        population: 80000, // 72k + 8k gnome artisans
        coordinatesX: velendarRegion.coordinatesX + 300,
        coordinatesY: velendarRegion.coordinatesY + 50, // East hills
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      },
      {
        name: 'Irongate',
        tier: 'CITY',
        description: 'Portaferro, fortezza di confine occidentale. Centro militare per difesa contro minacce esterne, addestramento e controllo confini.',
        population: 80000, // 68k + 12k military
        coordinatesX: velendarRegion.coordinatesX - 250,
        coordinatesY: velendarRegion.coordinatesY, // West border
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      }
    ];

    // Insert cities
    for (const city of cities) {
      const created = await prisma.location.create({
        data: city
      });
      console.log(`✅ Added city: ${city.name} (${city.population.toLocaleString()} pop)`);
    }

    console.log('🎉 Regno di Velendar cities completed!');
    
    // Show summary
    const velendarCities = await prisma.location.findMany({
      where: {
        parentId: velendarRegion.id,
        tier: 'CITY'
      },
      orderBy: {
        population: 'desc'
      }
    });

    console.log(`✅ Regno di Velendar now has ${velendarCities.length} cities:`);
    velendarCities.forEach(city => {
      console.log(`  - ${city.name} (${city.population.toLocaleString()} pop) - Capital & Academy`);
    });

  } catch (error) {
    console.error('❌ Error adding Velendar cities:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVelendarCities();
