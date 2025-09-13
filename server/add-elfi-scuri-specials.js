const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addElfiScuriSpecialLocations() {
  console.log('🗺️ Adding Territorio degli Elfi Scuri special locations (Tier 4)...');

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

    // Add the 6 special locations of Territorio degli Elfi Scuri
    const specialLocations = [
      {
        name: 'Labirinto delle Menti',
        tier: 'LOCATION',
        description: 'Labirinto magico che attacca la mente, spingendo molti alla follia. Dominazione mentale, pazzia, perdita di memoria. Richiede protezione psichica estrema.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX - 80,
        coordinatesY: elfiScuriRegion.coordinatesY - 70, // Deep southwest
        coordinatesZ: elfiScuriRegion.coordinatesZ - 40, // Partially underground
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['mental_domination', 'insanity_inducement', 'memory_loss', 'psychological_warfare'],
        requirements: JSON.stringify({ access_type: 'mental_protection', required: 'psych_mages', danger: 'extreme_mental_hazard', caution: 'many_go_insane' })
      },
      {
        name: 'Archivio delle Ombre',
        tier: 'LOCATION',
        description: 'Archivio segreto contenente tutta l\'intelligence raccolta nel mondo. Segreti mondiali, materiale di ricatto, storie nascoste. Accesso ultra-ristretto.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX + 10, // Near Nalthor capital
        coordinatesY: elfiScuriRegion.coordinatesY + 20,
        coordinatesZ: elfiScuriRegion.coordinatesZ - 60, // Deep underground
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['world_secrets', 'blackmail_material', 'hidden_histories', 'ultimate_intelligence'],
        requirements: JSON.stringify({ access_type: 'top_level_spies', alternative: 'shadow_council_members', clearance: 'ultimate_secret' })
      },
      {
        name: "Pozzo dell'Oblio",
        tier: 'LOCATION',
        description: 'Pozzo che può cancellare memorie o concedere conoscenze dimenticate. Manipolazione della memoria, conoscenze perdute, amnesia pericolosa.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX + 60,
        coordinatesY: elfiScuriRegion.coordinatesY - 50, // Eastern darkness
        coordinatesZ: elfiScuriRegion.coordinatesZ - 80, // Deep well
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['memory_erasure', 'forgotten_knowledge', 'dangerous_amnesia', 'mind_manipulation'],
        requirements: JSON.stringify({ access_type: 'memory_mages', alternatives: ['desperate_seekers', 'shadow_priests'], danger: 'memory_loss' })
      },
      {
        name: 'Giardino dei Veleni Eterni',
        tier: 'LOCATION',
        description: 'Giardino delle piante più mortali esistenti. Veleni supremi, antidoti rari, componenti tossici. Richiede equipaggiamento protettivo massimo.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX - 40,
        coordinatesY: elfiScuriRegion.coordinatesY - 80, // Southern poison gardens
        coordinatesZ: elfiScuriRegion.coordinatesZ,
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['ultimate_poisons', 'rare_antidotes', 'toxic_components', 'deadly_flora'],
        requirements: JSON.stringify({ access_type: 'master_poisoners', alternatives: ['antidote_specialists'], protection: 'maximum_protection_gear', danger: 'lethal_toxicity' })
      },
      {
        name: 'Teatro delle Illusioni',
        tier: 'LOCATION',
        description: 'Teatro dove le illusioni diventano temporaneamente reali. Illusioni viventi, spettacoli che piegano la realtà, performance magiche supreme.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX + 30,
        coordinatesY: elfiScuriRegion.coordinatesY + 60, // Northern performance area
        coordinatesZ: elfiScuriRegion.coordinatesZ + 30, // Elevated stage
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['living_illusions', 'reality_bending', 'magical_performances', 'temporary_reality'],
        requirements: JSON.stringify({ access_type: 'master_illusionists', alternatives: ['artists', 'reality_mages'], shows: 'reality_bending_performances' })
      },
      {
        name: 'Cripta dei Traditori',
        tier: 'LOCATION',
        description: 'Tomba degli elfi scuri che tradirono il loro popolo. Conseguenze del tradimento, giuramenti di lealtà, storia oscura. Lezioni sui pericoli della slealtà.',
        population: null,
        coordinatesX: elfiScuriRegion.coordinatesX - 60,
        coordinatesY: elfiScuriRegion.coordinatesY + 40,
        coordinatesZ: elfiScuriRegion.coordinatesZ - 50, // Underground tomb
        parentId: elfiScuriRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['betrayal_consequences', 'loyalty_oaths', 'dark_history', 'traitor_punishment'],
        requirements: JSON.stringify({ access_type: 'historians', alternatives: ['shadow_priests', 'redemption_seekers'], lesson: 'consequences_of_betrayal' })
      }
    ];

    // Insert special locations
    for (const location of specialLocations) {
      const created = await prisma.location.create({
        data: location
      });
      console.log(`✅ Added special location: ${location.name}`);
    }

    console.log('🎉 Territorio degli Elfi Scuri special locations completed!');
    
    // Show summary
    const elfiScuriSpecials = await prisma.location.findMany({
      where: {
        parentId: elfiScuriRegion.id,
        tier: 'LOCATION',
        population: null // Special locations have no population
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`✅ Territorio degli Elfi Scuri now has ${elfiScuriSpecials.length} special locations (Tier 4):`);
    elfiScuriSpecials.forEach(location => {
      console.log(`  - ${location.name}`);
    });

  } catch (error) {
    console.error('❌ Error adding Elfi Scuri special locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addElfiScuriSpecialLocations();
