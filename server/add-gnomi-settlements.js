const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGnomiMinorSettlements() {
  console.log('🏘️ Adding Regno Gnomi minor settlements (Tier 3)...');

  try {
    // Find the Regno degli Gnomi region
    const gnomiRegion = await prisma.location.findFirst({
      where: {
        name: 'Regno degli Gnomi',
        tier: 'REGION'
      }
    });

    if (!gnomiRegion) {
      console.error('❌ Regno degli Gnomi region not found!');
      return;
    }

    // Add the 6 minor settlements of Regno degli Gnomi
    const settlements = [
      {
        name: 'Springcoil',
        tier: 'LOCATION',
        description: 'Mollaelica - Centro di produzione molle, meccanismi elastici e sistemi di tensione. Ingegneri specializzati in molle di precisione e sistemi elastici.',
        population: 7800,
        coordinatesX: gnomiRegion.coordinatesX - 60,
        coordinatesY: gnomiRegion.coordinatesY + 40, // Northwest springs
        coordinatesZ: gnomiRegion.coordinatesZ,
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['spring_manufacturing', 'elastic_mechanisms', 'tension_systems', 'precision_springs']
      },
      {
        name: 'Measuredepth',
        tier: 'LOCATION',
        description: 'Profondità Misurata - Centro di rilevamento topografico, misurazione e cartografia. Topografi e ingegneri minerari specializzati in misurazioni precise.',
        population: 6900,
        coordinatesX: gnomiRegion.coordinatesX + 70,
        coordinatesY: gnomiRegion.coordinatesY - 50, // Southeast survey points
        coordinatesZ: gnomiRegion.coordinatesZ,
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['surveying', 'measurement', 'cartography', 'mining_surveys']
      },
      {
        name: 'Finewheel',
        tier: 'LOCATION',
        description: 'Ruota Fine - Centro di produzione ruote di precisione, taglio ingranaggi e meccanismi circolari. Artigiani specializzati in componenti rotanti perfetti.',
        population: 6200,
        coordinatesX: gnomiRegion.coordinatesX - 30,
        coordinatesY: gnomiRegion.coordinatesY - 40, // Southwest workshops
        coordinatesZ: gnomiRegion.coordinatesZ,
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['precision_wheels', 'gear_cutting', 'circular_mechanisms', 'rotating_components']
      },
      {
        name: 'Brightlens',
        tier: 'LOCATION',
        description: 'Lente Chiara - Centro di molatura lenti, strumenti ottici e potenziamento visivo. Specialisti ottici e produttori di strumenti di precisione.',
        population: 5600,
        coordinatesX: gnomiRegion.coordinatesX + 50,
        coordinatesY: gnomiRegion.coordinatesY + 60, // Northeast optical center
        coordinatesZ: gnomiRegion.coordinatesZ + 80, // Elevated for clarity
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['lens_grinding', 'optical_instruments', 'vision_enhancement', 'precision_optics']
      },
      {
        name: 'Soundwave',
        tier: 'LOCATION',
        description: 'Ondasonora - Centro di ricerca acustica, ingegneria del suono e comunicazione. Ingegneri specializzati in acustica e sistemi di comunicazione.',
        population: 5100,
        coordinatesX: gnomiRegion.coordinatesX + 20,
        coordinatesY: gnomiRegion.coordinatesY + 80, // Northern acoustic center
        coordinatesZ: gnomiRegion.coordinatesZ + 50, // Elevated for sound
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['acoustics_research', 'sound_engineering', 'communication_systems', 'audio_technology']
      },
      {
        name: 'Tunneldeep',
        tier: 'LOCATION',
        description: 'Tunnel Profondo - Centro di manutenzione tunnel verso continente occidentale e trasporti. Lavoratori specializzati nei tunnel intercontinentali.',
        population: 4500,
        coordinatesX: gnomiRegion.coordinatesX - 80,
        coordinatesY: gnomiRegion.coordinatesY, // Western tunnel entrance
        coordinatesZ: gnomiRegion.coordinatesZ - 100, // Deep underground
        parentId: gnomiRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['tunnel_maintenance', 'intercontinental_transport', 'underground_engineering', 'dwarf_cooperation']
      }
    ];

    // Insert settlements
    for (const settlement of settlements) {
      const created = await prisma.location.create({
        data: settlement
      });
      console.log(`✅ Added settlement: ${settlement.name} (${settlement.population.toLocaleString()} pop)`);
    }

    console.log('🎉 Regno Gnomi minor settlements completed!');
    
    // Show summary
    const gnomiSettlements = await prisma.location.findMany({
      where: {
        parentId: gnomiRegion.id,
        tier: 'LOCATION',
        population: { not: null } // Only settlements with population
      },
      orderBy: {
        population: 'desc'
      }
    });

    console.log(`✅ Regno degli Gnomi now has ${gnomiSettlements.length} settlements (Tier 3):`);
    gnomiSettlements.forEach(settlement => {
      console.log(`  - ${settlement.name} (${settlement.population?.toLocaleString() || 'N/A'} pop)`);
    });

  } catch (error) {
    console.error('❌ Error adding Gnomi settlements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGnomiMinorSettlements();
