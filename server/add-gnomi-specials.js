const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGnomiSpecialLocations() {
  console.log('🗺️ Adding Regno degli Gnomi special locations (Tier 4)...');

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

    // Add the 6 special locations of Regno degli Gnomi
    const specialLocations = [
      {
        name: 'Il Grande Orologio del Mondo',
        tier: 'LOCATION',
        description: 'Orologio massiccio che traccia i fusi orari mondiali. Coordinamento temporale globale, aiuto alla navigazione, magia temporale. Il cuore della precisione temporale.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX + 15, // Near Teldrun capital
        coordinatesY: gnomiRegion.coordinatesY + 25,
        coordinatesZ: gnomiRegion.coordinatesZ + 150, // High clockwork tower
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['global_time_coordination', 'navigation_aid', 'temporal_magic', 'world_clockwork'],
        requirements: JSON.stringify({ access_type: 'master_clockmakers', alternatives: ['time_mages', 'world_navigators'], function: 'global_time_tracking' })
      },
      {
        name: 'Laboratorio della Precisione Infinita',
        tier: 'LOCATION',
        description: 'Laboratorio capace di misurazioni oltre la precisione normale. Misurazioni ultra-precise, controllo qualità, testing di perfezione. Standard di precisione assoluta.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX - 10,
        coordinatesY: gnomiRegion.coordinatesY + 40,
        coordinatesZ: gnomiRegion.coordinatesZ + 20, // Specialized laboratory level
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['ultra_precise_measurements', 'quality_control', 'perfection_testing', 'absolute_precision'],
        requirements: JSON.stringify({ access_type: 'master_engineers', alternatives: ['precision_specialists', 'researchers'], capability: 'beyond_normal_precision' })
      },
      {
        name: 'Archivio Tecnico Universale',
        tier: 'LOCATION',
        description: 'Archivio completo di tutta la conoscenza tecnica. Tutti i progetti, manuali tecnici, soluzioni ingegneristiche. La biblioteca suprema della tecnologia.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX + 30,
        coordinatesY: gnomiRegion.coordinatesY - 20,
        coordinatesZ: gnomiRegion.coordinatesZ - 30, // Protected underground archive
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['all_blueprints', 'technical_manuals', 'engineering_solutions', 'universal_technical_knowledge'],
        requirements: JSON.stringify({ access_type: 'engineers', alternatives: ['inventors', 'technical_scholars'], content: 'complete_technical_archive' })
      },
      {
        name: 'Fucina del Mithril Levigato',
        tier: 'LOCATION',
        description: 'Unica fucina capace di lavorare il mithril raffinato perfettamente. Oggetti in mithril perfetto, strumenti di precisione, qualità leggendaria.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX - 40,
        coordinatesY: gnomiRegion.coordinatesY - 30,
        coordinatesZ: gnomiRegion.coordinatesZ + 10, // Master forge level
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['perfect_mithril_working', 'precision_tools', 'legendary_quality', 'ultimate_crafting'],
        requirements: JSON.stringify({ access_type: 'master_smiths', alternatives: ['mithril_specialists'], clientele: 'wealthy_clients', products: 'legendary_items' })
      },
      {
        name: 'Osservatorio delle Stelle Meccaniche',
        tier: 'LOCATION',
        description: 'Osservatorio meccanico con tracciamento stellare ad orologeria. Carte stellari, sistemi di navigazione, calcoli temporali. Astronomia di precisione.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX + 60,
        coordinatesY: gnomiRegion.coordinatesY + 70,
        coordinatesZ: gnomiRegion.coordinatesZ + 200, // Highest observation point
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['mechanical_star_tracking', 'star_charts', 'navigation_systems', 'temporal_calculations'],
        requirements: JSON.stringify({ access_type: 'astronomers', alternatives: ['navigators', 'time_keepers'], services: 'precision_astronomy' })
      },
      {
        name: 'Camera di Risonanza Perfetta',
        tier: 'LOCATION',
        description: 'Stanza con acustica perfetta per ricerca del suono. Perfezione sonora, ricerca acustica, innovazione musicale. Il sanctum dell\'ingegneria del suono.',
        population: null,
        coordinatesX: gnomiRegion.coordinatesX + 20,
        coordinatesY: gnomiRegion.coordinatesY + 50,
        coordinatesZ: gnomiRegion.coordinatesZ - 20, // Specialized acoustic chamber
        parentId: gnomiRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['perfect_acoustics', 'sound_research', 'acoustic_perfection', 'musical_innovation'],
        requirements: JSON.stringify({ access_type: 'acoustic_researchers', alternatives: ['sound_mages', 'musicians'], use: 'sound_perfection_research' })
      }
    ];

    // Insert special locations
    for (const location of specialLocations) {
      const created = await prisma.location.create({
        data: location
      });
      console.log(`✅ Added special location: ${location.name}`);
    }

    console.log('🎉 Regno degli Gnomi special locations completed!');
    
    // Show summary
    const gnomiSpecials = await prisma.location.findMany({
      where: {
        parentId: gnomiRegion.id,
        tier: 'LOCATION',
        population: null // Special locations have no population
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`✅ Regno degli Gnomi now has ${gnomiSpecials.length} special locations (Tier 4):`);
    gnomiSpecials.forEach(location => {
      console.log(`  - ${location.name}`);
    });

  } catch (error) {
    console.error('❌ Error adding Gnomi special locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGnomiSpecialLocations();
