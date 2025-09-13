const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addVelendarMinorSettlements() {
  console.log('🏘️ Adding Regno di Velendar minor settlements (Tier 3)...');

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

    // Add the 6 minor settlements of Regno di Velendar
    const settlements = [
      {
        name: 'Moonbridge',
        tier: 'LOCATION',
        description: 'Ponte Luna - Ponte commerciale verso territori elfici, centro di diplomazia e scambio culturale tra umani e mezzelfi.',
        population: 18000, // 15k + 3k half-elves
        coordinatesX: velendarRegion.coordinatesX + 150,
        coordinatesY: velendarRegion.coordinatesY + 200, // East towards elven territories
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false, // Requires diplomatic missions
        specialFeatures: ['diplomatic_missions', 'cultural_exchange', 'half_elf_community']
      },
      {
        name: 'Vineyard Hills',
        tier: 'LOCATION',
        description: 'Colline Vigneto - Centro di produzione vinicola e ricerca agricola di lusso, famoso per i vini pregiati e gli studi agrotecnici.',
        population: 12500,
        coordinatesX: velendarRegion.coordinatesX - 100,
        coordinatesY: velendarRegion.coordinatesY - 80, // Southwest hills
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['wine_production', 'agricultural_research', 'luxury_food']
      },
      {
        name: 'Crystalwood',
        tier: 'LOCATION',
        description: 'Bosco Cristallo - Foresta magica per la raccolta di componenti magici e ricerca sulla magia naturale. Alberi cristallizzati forniscono reagenti unici.',
        population: 9800,
        coordinatesX: velendarRegion.coordinatesX + 80,
        coordinatesY: velendarRegion.coordinatesY + 120, // Northeast forest
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: false, // Requires magical license
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['magical_components', 'nature_magic_research', 'crystal_trees']
      },
      {
        name: 'Lightweave',
        tier: 'LOCATION',
        description: 'Tessimaluce - Centro di produzione tessile magica e abbigliamento incantato. Tessitori specializzati in fibre magiche e vestiti incantati.',
        population: 8600,
        coordinatesX: velendarRegion.coordinatesX - 50,
        coordinatesY: velendarRegion.coordinatesY + 60, // North of capital
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['magical_textiles', 'enchanted_clothing', 'textile_specialists']
      },
      {
        name: 'Scholarsford',
        tier: 'LOCATION',
        description: 'Guado Studiosi - Centro di educazione secondaria e avamposto di ricerca. Biblioteca importante e punto di sosta per studiosi viaggiatori.',
        population: 7200,
        coordinatesX: velendarRegion.coordinatesX + 30,
        coordinatesY: velendarRegion.coordinatesY - 40, // Southeast
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['secondary_education', 'research_outpost', 'traveling_scholars']
      },
      {
        name: "Healer's Glen",
        tier: 'LOCATION',
        description: 'Valle Guaritore - Centro di formazione medica e ricerca curativa. Ospedale specializzato e addestramento per praticanti delle arti curative.',
        population: 6400,
        coordinatesX: velendarRegion.coordinatesX - 80,
        coordinatesY: velendarRegion.coordinatesY + 30, // Northwest
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: true,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['medical_training', 'healing_research', 'specialized_hospital']
      }
    ];

    // Insert settlements
    for (const settlement of settlements) {
      const created = await prisma.location.create({
        data: settlement
      });
      console.log(`✅ Added settlement: ${settlement.name} (${settlement.population.toLocaleString()} pop)`);
    }

    console.log('🎉 Regno di Velendar minor settlements completed!');
    
    // Show summary
    const velendarSettlements = await prisma.location.findMany({
      where: {
        parentId: velendarRegion.id,
        tier: 'LOCATION'
      },
      orderBy: {
        population: 'desc'
      }
    });

    console.log(`✅ Regno di Velendar now has ${velendarSettlements.length} settlements (Tier 3):`);
    velendarSettlements.forEach(settlement => {
      console.log(`  - ${settlement.name} (${settlement.population?.toLocaleString() || 'N/A'} pop)`);
    });

  } catch (error) {
    console.error('❌ Error adding Velendar settlements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVelendarMinorSettlements();
