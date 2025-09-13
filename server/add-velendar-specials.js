const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addVelendarSpecialLocations() {
  console.log('🗺️ Adding Regno di Velendar special locations (Tier 4)...');

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

    // Add the 6 special locations of Regno di Velendar
    const specialLocations = [
      {
        name: "Laboratorio dell'Alchimista",
        tier: 'LOCATION',
        description: '🧪 STARTING POINT - Laboratorio di ricerca privato nella periferia di Thalareth. Torre a 3 piani dove inizia il viaggio del giocatore. Qui si apprendono le basi del mondo.',
        population: null, // Special location
        coordinatesX: velendarRegion.coordinatesX + 20, // Near Thalareth
        coordinatesY: velendarRegion.coordinatesY + 105,
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: false, // Invitation only
        isKnown: false,
        isDiscovered: false,
        isStartArea: true, // Mark as starting area
        specialFeatures: ['starting_point', 'private_research', 'alchemy_lab', 'player_tutorial'],
        requirements: JSON.stringify({ access_type: 'invitation_only', clearance_level: 'exclusive' })
      },
      {
        name: 'Torre della Sapienza Infinita',
        tier: 'LOCATION',
        description: 'Torre più alta dell\'Accademia di Magia, centro della ricerca magica suprema. Esperimenti pericolosi e magia di livello arcimago. Accesso estremamente limitato.',
        population: null,
        coordinatesX: velendarRegion.coordinatesX + 10, // Within Thalareth
        coordinatesY: velendarRegion.coordinatesY + 100,
        coordinatesZ: velendarRegion.coordinatesZ + 200, // High tower
        parentId: velendarRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['ultimate_magic_research', 'dangerous_experiments', 'archmage_only'],
        requirements: JSON.stringify({ access_type: 'magical_clearance', required_level: 'archmage', danger_level: 'extreme' })
      },
      {
        name: 'Biblioteca dei Sogni',
        tier: 'LOCATION',
        description: 'Biblioteca magica che esiste parzialmente nel regno dei sogni. Contiene conoscenza dai sogni, profezie e saggezza inconscia. Accessibile solo con magia del sonno.',
        population: null,
        coordinatesX: velendarRegion.coordinatesX - 5,
        coordinatesY: velendarRegion.coordinatesY + 95,
        coordinatesZ: velendarRegion.coordinatesZ + 50, // Partially ethereal
        parentId: velendarRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['dream_realm', 'prophecies', 'unconscious_wisdom', 'sleep_magic'],
        requirements: JSON.stringify({ access_type: 'dream_magic', protection: 'sleep_magic_shield', danger: 'mental_invasion' })
      },
      {
        name: 'Giardini del Tempo',
        tier: 'LOCATION',
        description: 'Giardini dove il tempo scorre diversamente. Effetti di accelerazione e decelerazione temporale, invecchiamento anomalo. Solo maghi temporali con equipaggiamento protettivo.',
        population: null,
        coordinatesX: velendarRegion.coordinatesX + 40,
        coordinatesY: velendarRegion.coordinatesY + 80,
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: false,
        isKnown: false,
        isDiscovered: false,
        specialFeatures: ['time_acceleration', 'time_deceleration', 'aging_effects', 'temporal_magic'],
        requirements: JSON.stringify({ access_type: 'temporal_magic', protection: 'temporal_stability_gear', danger: 'time_distortion' })
      },
      {
        name: 'Ponte delle Alleanze',
        tier: 'LOCATION',
        description: 'Ponte storico dove sono stati firmati i principali trattati internazionali. Importanza politica suprema, cerimonie diplomatiche ufficiali.',
        population: null,
        coordinatesX: velendarRegion.coordinatesX,
        coordinatesY: velendarRegion.coordinatesY + 110, // Between regions
        coordinatesZ: velendarRegion.coordinatesZ,
        parentId: velendarRegion.id,
        isAccessible: false, // Diplomatic access only
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['historic_treaties', 'political_importance', 'diplomatic_ceremonies'],
        requirements: JSON.stringify({ access_type: 'diplomatic', clearance: 'official_ceremonies', importance: 'international_relations' })
      },
      {
        name: 'Cripta dei Re Sapienti',
        tier: 'LOCATION',
        description: 'Tomba reale con la saggezza preservata dei re del passato. Artefatti reali, saggezza storica e guida spirituale. Accesso limitato alla famiglia reale.',
        population: null,
        coordinatesX: velendarRegion.coordinatesX - 10,
        coordinatesY: velendarRegion.coordinatesY + 90,
        coordinatesZ: velendarRegion.coordinatesZ - 50, // Underground
        parentId: velendarRegion.id,
        isAccessible: false,
        isKnown: true,
        isDiscovered: false,
        specialFeatures: ['royal_tomb', 'historical_wisdom', 'royal_artifacts', 'spiritual_guidance'],
        requirements: JSON.stringify({ access_type: 'royal_lineage', alternative: 'court_historians', occasions: 'special_ceremonies' })
      }
    ];

    // Insert special locations
    for (const location of specialLocations) {
      const created = await prisma.location.create({
        data: location
      });
      console.log(`✅ Added special location: ${location.name}`);
    }

    console.log('🎉 Regno di Velendar special locations completed!');
    
    // Show summary
    const velendarSpecials = await prisma.location.findMany({
      where: {
        parentId: velendarRegion.id,
        tier: 'LOCATION',
        population: null // Special locations have no population
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`✅ Regno di Velendar now has ${velendarSpecials.length} special locations (Tier 4):`);
    velendarSpecials.forEach(location => {
      const isStarting = location.isStartArea ? ' - ⭐ STARTING POINT' : '';
      console.log(`  - ${location.name}${isStarting}`);
    });

  } catch (error) {
    console.error('❌ Error adding Velendar special locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVelendarSpecialLocations();
