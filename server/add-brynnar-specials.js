const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBrynnarSpecialLocations() {
  console.log('🗺️ Adding Regno di Brynnar special locations (Tier 4)...');

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

    // Add the 6 special locations of Regno di Brynnar
    const specialLocations = [
      {
        name: 'Sala degli Eroi Caduti',
        tier: 'LOCATION',
        description: 'Sala sacra che onora i guerrieri morti, guida spirituale per i vivi. Benedizioni per guerrieri, restauro dell\'onore, forza spirituale per chi affronta il combattimento.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX + 5, // Near Valkhyr capital
        coordinatesY: brynnarRegion.coordinatesY + 15,
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['sacred_hall', 'warrior_blessings', 'honor_restoration', 'spiritual_strength'],
        requirements: JSON.stringify({ access_type: 'warrior_status', alternatives: ['families_of_fallen', 'honor_quests'], purpose: 'spiritual_guidance' })
      },
      {
        name: 'Foresta degli Spiriti Lupo',
        tier: 'LOCATION',
        description: 'Foresta sacra abitata dagli spiriti dei lupi. Comunicazione con spiriti lupo, legame con il branco, magia della caccia. Accessibile solo ai cavalieri lupo.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX + 90,
        coordinatesY: brynnarRegion.coordinatesY - 70, // Deep eastern forests
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['wolf_spirits', 'pack_bonding', 'hunting_magic', 'spiritual_connection'],
        requirements: JSON.stringify({ access_type: 'wolf_riders', alternatives: ['pack_leaders'], connection: 'spiritual_bond_with_wolves' })
      },
      {
        name: "Ghiacciaio dell'Eternità",
        tier: 'LOCATION',
        description: 'Ghiacciaio antico con artefatti preservati dal tempo. Armi antiche, storia congelata, magia del ghiaccio. Richiede scalatori esperti e immunità al freddo.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX - 80,
        coordinatesY: brynnarRegion.coordinatesY + 100, // Northern mountains
        coordinatesZ: brynnarRegion.coordinatesZ + 150, // High altitude
        parentId: brynnarRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['ancient_artifacts', 'preserved_history', 'ice_magic', 'time_preservation'],
        requirements: JSON.stringify({ access_type: 'ice_climbers', alternatives: ['archaeologists'], protection: 'cold_immunity', danger: 'extreme_cold' })
      },
      {
        name: 'Arena del Valore',
        tier: 'LOCATION',
        description: 'Grande arena per dimostrare il valore marziale. Duelli d\'onore, competizioni di forza, prove guerriere. Centro delle tradizioni marziali nordiche.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX - 20,
        coordinatesY: brynnarRegion.coordinatesY + 30, // Near capital
        coordinatesZ: brynnarRegion.coordinatesZ,
        parentId: brynnarRegion.id,
        isAccessible: true, // Open to warriors
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['honor_duels', 'strength_competitions', 'warrior_trials', 'martial_tradition'],
        requirements: JSON.stringify({ access_type: 'warriors', purpose: 'prove_worth', events: ['honor_duels', 'strength_tests'] })
      },
      {
        name: 'Tempio della Tempesta',
        tier: 'LOCATION',
        description: 'Tempio dedicato alla magia della tempesta e controllo meteorologico. Addestramento magia della tempesta, previsioni meteo, protezione dalle tempeste.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX + 50,
        coordinatesY: brynnarRegion.coordinatesY + 130, // Northern coast
        coordinatesZ: brynnarRegion.coordinatesZ + 80, // Elevated position
        parentId: brynnarRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['storm_magic', 'weather_control', 'storm_protection', 'meteorological_training'],
        requirements: JSON.stringify({ access_type: 'storm_mages', alternatives: ['weather_controllers', 'sailors'], services: 'storm_magic_training' })
      },
      {
        name: 'Sepolcro del Re-Lupo',
        tier: 'LOCATION',
        description: 'Tomba del leggendario re che si unì ai lupi. Artefatti reali, segreti del legame con i lupi, saggezza sulla leadership. Sacro ai cavalieri lupo.',
        population: null,
        coordinatesX: brynnarRegion.coordinatesX + 70,
        coordinatesY: brynnarRegion.coordinatesY - 50,
        coordinatesZ: brynnarRegion.coordinatesZ - 30, // Partially underground
        parentId: brynnarRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['royal_tomb', 'wolf_bonding_secrets', 'leadership_wisdom', 'legendary_artifacts'],
        requirements: JSON.stringify({ access_type: 'royal_lineage', alternatives: ['wolf_pack_leaders', 'historical_pilgrims'], significance: 'wolf_king_legacy' })
      }
    ];

    // Insert special locations
    for (const location of specialLocations) {
      const created = await prisma.location.create({
        data: location
      });
      console.log(`✅ Added special location: ${location.name}`);
    }

    console.log('🎉 Regno di Brynnar special locations completed!');
    
    // Show summary
    const brynnarSpecials = await prisma.location.findMany({
      where: {
        parentId: brynnarRegion.id,
        tier: 'LOCATION',
        population: null // Special locations have no population
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`✅ Regno di Brynnar now has ${brynnarSpecials.length} special locations (Tier 4):`);
    brynnarSpecials.forEach(location => {
      console.log(`  - ${location.name}`);
    });

  } catch (error) {
    console.error('❌ Error adding Brynnar special locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBrynnarSpecialLocations();
