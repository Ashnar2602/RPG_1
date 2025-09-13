const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBrynnarMinorSettlements() {
  console.log('🏘️ Adding Regno di Brynnar minor settlements (Tier 3)...');

  try {
    // Find the Regno di Brynnar region
    const brynnarRegion = await prisma.location.findFirst({
      where: {
        name: 'Regno di Brynnar',
        tier: 'REGION'
      }
    });

    if (!brynnarRegion) {
      console.error('❌ Regno di Brynnar region not found!');
      return;
    }

    // Add the 6 minor settlements of Regno di Brynnar
    const settlements = [
      {
        name: 'Bearpit',
        tier: 'LOCATION',
        description: 'Fossa Orso - Centro di caccia agli orsi, lavorazione del cuoio e addestramento alla forza. Cacciatori specializzati e guerrieri che si misurano con gli orsi.',
        population: 8500,
        coordinatesX: brynnarRegion.coordinatesX - 100,
        coordinatesY: brynnarRegion.coordinatesY - 80, // Southwest wilderness
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['bear_hunting', 'leather_working', 'strength_training', 'wilderness_survival']
      },
      {
        name: 'Woodaxe',
        tier: 'LOCATION',
        description: 'Asciabosco - Centro di disboscamento, lavorazione del legno e gestione forestale. Taglialegna esperti e artigiani del legno delle foreste nordiche.',
        population: 7200,
        coordinatesX: brynnarRegion.coordinatesX + 80,
        coordinatesY: brynnarRegion.coordinatesY - 60, // Eastern forests
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['logging', 'wood_crafting', 'forest_management', 'lumber_industry']
      },
      {
        name: 'Coldspring',
        tier: 'LOCATION',
        description: 'Sorgente Fredda - Centro di guarigione con acque fredde e addestramento alla resistenza. Guaritori specializzati nella terapia del freddo.',
        population: 6800,
        coordinatesX: brynnarRegion.coordinatesX - 50,
        coordinatesY: brynnarRegion.coordinatesY + 70, // Northern springs
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['cold_water_healing', 'resistance_training', 'thermal_therapy', 'frost_resistance']
      },
      {
        name: 'Ravencroft',
        tier: 'LOCATION',
        description: 'Campo Corvo - Centro di servizio messaggi, esplorazione e intelligence. Maestri dei corvi per comunicazioni a lunga distanza nelle terre del nord.',
        population: 5400,
        coordinatesX: brynnarRegion.coordinatesX + 60,
        coordinatesY: brynnarRegion.coordinatesY + 90, // Northeast outpost
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['message_service', 'scouting', 'intelligence', 'raven_mastery']
      },
      {
        name: 'Ironpit',
        tier: 'LOCATION',
        description: 'Fossa Ferro - Centro di forgiatura armi, produzione utensili e lavorazione metalli. Fabbri specializzati in armi da guerra e strumenti di sopravvivenza.',
        population: 4900,
        coordinatesX: brynnarRegion.coordinatesX - 30,
        coordinatesY: brynnarRegion.coordinatesY - 40, // Southern mines
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['weapon_forging', 'tool_making', 'metal_working', 'smithing']
      },
      {
        name: 'Longboat',
        tier: 'LOCATION',
        description: 'Drakkarlungo - Centro di costruzione navale, rifornimenti nautici e riparazione imbarcazioni. Cantieri specializzati in navi da guerra nordiche.',
        population: 4100,
        coordinatesX: brynnarRegion.coordinatesX + 40,
        coordinatesY: brynnarRegion.coordinatesY + 120, // Northern coast
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['ship_construction', 'naval_supplies', 'boat_repair', 'longship_building']
      }
    ];

    // Insert settlements
    for (const settlement of settlements) {
      const created = await prisma.location.create({
        data: settlement
      });
      console.log(`✅ Added settlement: ${settlement.name} (${settlement.population.toLocaleString()} pop)`);
    }

    console.log('🎉 Regno di Brynnar minor settlements completed!');
    
    // Show summary
    const brynnarSettlements = await prisma.location.findMany({
      where: {
        parentId: brynnarRegion.id,
        tier: 'LOCATION',
        population: { not: null } // Only settlements with population
      },
      orderBy: {
        population: 'desc'
      }
    });

    console.log(`✅ Regno di Brynnar now has ${brynnarSettlements.length} settlements (Tier 3):`);
    brynnarSettlements.forEach(settlement => {
      console.log(`  - ${settlement.name} (${settlement.population?.toLocaleString() || 'N/A'} pop)`);
    });

  } catch (error) {
    console.error('❌ Error adding Brynnar settlements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBrynnarMinorSettlements();
