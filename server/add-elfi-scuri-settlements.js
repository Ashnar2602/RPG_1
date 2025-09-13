const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addElfiScuriMinorSettlements() {
  console.log('🏘️ Adding Territorio degli Elfi Scuri minor settlements (Tier 3)...');

  try {
    // Find the Territorio degli Elfi Scuri region
    const elfiScuriRegion = await prisma.location.findFirst({
      where: {
        name: 'Territorio degli Elfi Scuri',
        tier: 'REGION'
      }
    });

    if (!elfiScuriRegion) {
      console.error('❌ Territorio degli Elfi Scuri region not found!');
      return;
    }

    // Add the 6 minor settlements of Territorio degli Elfi Scuri
    const settlements = [
      {
        name: 'Poisonleaf',
        tier: 'LOCATION',
        description: 'Foglia Veleno - Centro di produzione veleni, ricerca antidoti e alchimia tossica. Alchimisti specializzati in sostanze mortali e cure rare.',
        population: 6200,
        coordinatesX: elfiScuriRegion.coordinatesX - 60,
        coordinatesY: elfiScuriRegion.coordinatesY - 40, // Southwest toxic marshes
        coordinatesZ: elfiScuriRegion.coordinatesZ,
        parentId: elfiScuriRegion.id,
        isAccessible: false, // Requires special clearance
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['poison_production', 'antidote_research', 'toxic_alchemy', 'deadly_plants']
      },
      {
        name: 'Nightbloom',
        tier: 'LOCATION',
        description: 'Fiore Notte - Centro di raccolta piante notturne e componenti magici notturni. Botanici specializzati in flora che fiorisce solo al buio.',
        population: 5800,
        coordinatesX: elfiScuriRegion.coordinatesX + 70,
        coordinatesY: elfiScuriRegion.coordinatesY - 60, // Eastern dark forests
        coordinatesZ: elfiScuriRegion.coordinatesZ,
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['nocturnal_plants', 'night_magic_components', 'botanical_research', 'darkness_flora']
      },
      {
        name: 'Silentbrook',
        tier: 'LOCATION',
        description: 'Ruscello Silente - Centro di magia del silenzio, addestramento furtivo e eliminazione del rumore. Specialisti nel movimento silenzioso assoluto.',
        population: 4900,
        coordinatesX: elfiScuriRegion.coordinatesX - 30,
        coordinatesY: elfiScuriRegion.coordinatesY + 50, // Northern quiet streams
        coordinatesZ: elfiScuriRegion.coordinatesZ,
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['silence_magic', 'stealth_training', 'noise_elimination', 'sound_suppression']
      },
      {
        name: 'Darkwood',
        tier: 'LOCATION',
        description: 'Bosco Scuro - Centro di sorveglianza forestale e manutenzione sentieri nascosti. Rangers specializzati nella sorveglianza invisibile.',
        population: 4300,
        coordinatesX: elfiScuriRegion.coordinatesX + 40,
        coordinatesY: elfiScuriRegion.coordinatesY + 70, // Northeast deep woods
        coordinatesZ: elfiScuriRegion.coordinatesZ,
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['forest_surveillance', 'hidden_paths', 'invisible_scouting', 'woodland_stealth']
      },
      {
        name: 'Ravenspire',
        tier: 'LOCATION',
        description: 'Guglia Corvo - Centro di intercettazione comunicazioni e decrittazione codici. Spie specializzate nell\'intelligence e nell\'interruzione messaggi.',
        population: 3700,
        coordinatesX: elfiScuriRegion.coordinatesX - 20,
        coordinatesY: elfiScuriRegion.coordinatesY + 80, // Northern spire
        coordinatesZ: elfiScuriRegion.coordinatesZ + 100, // High tower
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['communication_interception', 'code_breaking', 'intelligence_gathering', 'message_surveillance']
      },
      {
        name: 'Misthollow',
        tier: 'LOCATION',
        description: 'Cava Nebbia - Centro di magia illusoria, manipolazione nebbie e occultamento. Illusionisti che creano nebbie impenetrabili e nascondimenti.',
        population: 3200,
        coordinatesX: elfiScuriRegion.coordinatesX - 50,
        coordinatesY: elfiScuriRegion.coordinatesY + 30, // Northwestern hollows
        coordinatesZ: elfiScuriRegion.coordinatesZ - 20, // Partially sunken
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['illusion_magic', 'mist_manipulation', 'concealment_spells', 'fog_creation']
      }
    ];

    // Insert settlements
    for (const settlement of settlements) {
      const created = await prisma.location.create({
        data: settlement
      });
      const status = settlement.isAccessible ? 'Accessible' : 'Secret';
      console.log(`✅ Added settlement: ${settlement.name} (${settlement.population.toLocaleString()} pop) - ${status}`);
    }

    console.log('🎉 Territorio degli Elfi Scuri minor settlements completed!');
    
    // Show summary
    const elfiScuriSettlements = await prisma.location.findMany({
      where: {
        parentId: elfiScuriRegion.id,
        tier: 'LOCATION',
        population: { not: null } // Only settlements with population
      },
      orderBy: {
        population: 'desc'
      }
    });

    console.log(`✅ Territorio degli Elfi Scuri now has ${elfiScuriSettlements.length} settlements (Tier 3):`);
    elfiScuriSettlements.forEach(settlement => {
      const status = settlement.isAccessible ? 'Accessible' : 'Secret';
      console.log(`  - ${settlement.name} (${settlement.population?.toLocaleString() || 'N/A'} pop) - ${status}`);
    });

  } catch (error) {
    console.error('❌ Error adding Elfi Scuri settlements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addElfiScuriMinorSettlements();
