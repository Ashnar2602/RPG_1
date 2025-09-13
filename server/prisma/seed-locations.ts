import { PrismaClient, LocationTier } from '@prisma/client';

const prisma = new PrismaClient();

// World locations data based on our 4-tier hierarchy system
const worldLocations = [
  // TIER 1: CONTINENTS
  {
    id: 'continent_orientale',
    name: 'Continente Orientale',
    description: 'Il continente orientale, sede di antiche civiltà e potenti regni magici',
    tier: LocationTier.CONTINENT,
    coordinatesX: 0,
    coordinatesY: 0,
    isAccessible: true,
    isKnown: true,
    isDiscovered: true,
    specialFeatures: ['Ricco di magia', 'Sede dell\'Accademia', 'Diversità culturale'],
    population: 2500000
  },
  {
    id: 'continent_occidentale', 
    name: 'Continente Occidentale',
    description: 'Il continente occidentale, terra di nani, orchi e montagne maestose',
    tier: LocationTier.CONTINENT,
    coordinatesX: -1000,
    coordinatesY: 0,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Ricco di metalli', 'Montagne alte', 'Forgiatori leggendari'],
    population: 1800000
  },
  {
    id: 'continent_arcipelago',
    name: 'Arcipelago Centrale',
    description: 'L\'arcipelago centrale, regno del commercio marittimo e dell\'esplorazione',
    tier: LocationTier.CONTINENT,
    coordinatesX: 500,
    coordinatesY: -800,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Hub commerciale', 'Navigazione esperta', 'Isole misteriose'],
    population: 900000
  },

  // TIER 2: REGIONS - Continente Orientale
  {
    id: 'region_velendar',
    name: 'Regno di Velendar',
    description: 'Il regno magico orientale, sede dell\'Accademia e centro di sapere',
    tier: LocationTier.REGION,
    parentId: 'continent_orientale',
    coordinatesX: 100,
    coordinatesY: 100,
    isAccessible: true,
    isKnown: true,
    isDiscovered: true,
    specialFeatures: ['Centro magico', 'Accademia prestigiosa', 'Commercio fiorente'],
    population: 800000
  },
  {
    id: 'region_brynnar',
    name: 'Regno di Brynnar',
    description: 'Il regno guerriero del nord, terra di valorosi combattenti',
    tier: LocationTier.REGION,
    parentId: 'continent_orientale',
    coordinatesX: 200,
    coordinatesY: 300,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Guerrieri feroci', 'Clima rigido', 'Fortezze inespugnabili'],
    population: 450000
  },
  {
    id: 'region_gnomi',
    name: 'Regno degli Gnomi',
    description: 'Il regno montano degli gnomi, maestri di ingegneria e precisione',
    tier: LocationTier.REGION,
    parentId: 'continent_orientale',
    coordinatesX: -100,
    coordinatesY: 200,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Ingegneria avanzata', 'Miniere profonde', 'Invenzioni straordinarie'],
    population: 200000
  },
  {
    id: 'region_elfi_scuri',
    name: 'Territorio degli Elfi Scuri',
    description: 'Le terre misteriose degli elfi scuri, avvolte in ombre e segreti',
    tier: LocationTier.REGION,
    parentId: 'continent_orientale',
    coordinatesX: 300,
    coordinatesY: 0,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Magia oscura', 'Foreste tenebrose', 'Segreti antichi'],
    population: 150000
  },

  // TIER 2: REGIONS - Continente Occidentale
  {
    id: 'region_nani',
    name: 'Regno dei Nani',
    description: 'Il regno sotterraneo dei nani, maestri della forgia e delle miniere',
    tier: LocationTier.REGION,
    parentId: 'continent_occidentale',
    coordinatesX: -900,
    coordinatesY: 100,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Forgiatori leggendari', 'Città sotterranee', 'Ricchezze minerarie'],
    population: 600000
  },
  {
    id: 'region_orchi',
    name: 'Territori Orcheschi',
    description: 'Le terre selvagge degli orchi, dominate dalla forza bruta',
    tier: LocationTier.REGION,
    parentId: 'continent_occidentale',
    coordinatesX: -1100,
    coordinatesY: -100,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Guerrieri brutali', 'Terre selvagge', 'Clan in guerra'],
    population: 400000
  },

  // TIER 3: CITIES - Regno di Velendar
  {
    id: 'city_thalareth',
    name: 'Thalareth',
    description: 'La capitale magica, sede dell\'Accademia di Magia e centro del sapere',
    tier: LocationTier.CITY,
    parentId: 'region_velendar',
    coordinatesX: 120,
    coordinatesY: 120,
    isAccessible: true,
    isKnown: true,
    isDiscovered: true,
    isStartArea: true,
    specialFeatures: ['Accademia di Magia', 'Biblioteca immensa', 'Torre del Sapere'],
    population: 250000
  },
  {
    id: 'city_goldenharbor',
    name: 'Goldenharbor',
    description: 'Il grande porto commerciale, porta verso tutti i continenti',
    tier: LocationTier.CITY,
    parentId: 'region_velendar',
    coordinatesX: 150,
    coordinatesY: 80,
    isAccessible: true,
    isKnown: true,
    isDiscovered: false,
    specialFeatures: ['Porto maestoso', 'Hub commerciale', 'Flotta navale'],
    population: 180000
  },
  {
    id: 'city_silverbrook',
    name: 'Silverbrook',
    description: 'La città argentifera, famosa per le sue miniere e commerci',
    tier: LocationTier.CITY,
    parentId: 'region_velendar',
    coordinatesX: 80,
    coordinatesY: 140,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Miniere d\'argento', 'Mercanti ricchi', 'Gioiellieri esperti'],
    population: 120000
  },
  {
    id: 'city_irongate',
    name: 'Irongate',
    description: 'La fortezza di ferro, baluardo difensivo del regno',
    tier: LocationTier.CITY,
    parentId: 'region_velendar',
    coordinatesX: 60,
    coordinatesY: 160,
    isAccessible: true,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Fortezza inespugnabile', 'Guardie d\'élite', 'Armerie leggendarie'],
    population: 90000
  },

  // TIER 3: CITIES - Regno di Brynnar
  {
    id: 'city_valkhyr',
    name: 'Valkhyr',
    description: 'La capitale guerriera, sede del Re-Guerriero e dei clan del nord',
    tier: LocationTier.CITY,
    parentId: 'region_brynnar',
    coordinatesX: 220,
    coordinatesY: 320,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Palazzo del Re-Guerriero', 'Arena dei campioni', 'Clan warriors'],
    population: 150000
  },

  // TIER 4: LOCATIONS - Thalareth
  {
    id: 'location_accademia',
    name: 'Accademia di Magia',
    description: 'La prestigiosa Accademia di Magia, centro mondiale del sapere arcano',
    tier: LocationTier.LOCATION,
    parentId: 'city_thalareth',
    coordinatesX: 125,
    coordinatesY: 125,
    isAccessible: true,
    isKnown: true,
    isDiscovered: true,
    specialFeatures: ['Biblioteca mondiale', 'Torre del Sapere', 'Laboratori magici'],
    population: 5000
  },
  {
    id: 'location_laboratorio_alchimista',
    name: 'Laboratorio dell\'Alchimista',
    description: 'Il laboratorio alchemico dove inizia l\'avventura, in Via delle Scoperte',
    tier: LocationTier.LOCATION,
    parentId: 'city_thalareth',
    coordinatesX: 118,
    coordinatesY: 122,
    isAccessible: true,
    isKnown: true,
    isDiscovered: true,
    isStartArea: true,
    specialFeatures: ['Laboratorio alchemico', 'Via delle Scoperte', 'Punto di partenza'],
    population: 2
  },
  {
    id: 'location_mercato_quartiere',  
    name: 'Mercato del Quartiere',
    description: 'Il vivace mercato locale del quartiere residenziale',
    tier: LocationTier.LOCATION,
    parentId: 'city_thalareth',
    coordinatesX: 115,
    coordinatesY: 120,
    isAccessible: true,
    isKnown: true,
    isDiscovered: false,
    specialFeatures: ['Mercato locale', 'Commercianti amichevoli', 'Prodotti quotidiani'],
    population: 200
  },
  {
    id: 'location_taverna_calderone',
    name: 'Taverna "Il Calderone Fumante"',
    description: 'La taverna locale frequentata da alchimisti e studiosi',
    tier: LocationTier.LOCATION,
    parentId: 'city_thalareth',
    coordinatesX: 116,
    coordinatesY: 119,
    isAccessible: true,
    isKnown: true,
    isDiscovered: false,
    specialFeatures: ['Taverna accogliente', 'Clientela intellettuale', 'Informazioni locali'],
    population: 50
  },
  {
    id: 'location_torre_sapere',
    name: 'Torre del Sapere',
    description: 'L\'antica torre che domina Thalareth, simbolo della conoscenza',
    tier: LocationTier.LOCATION,
    parentId: 'city_thalareth',
    coordinatesX: 130,
    coordinatesY: 130,
    isAccessible: false,
    isKnown: true,
    isDiscovered: false,
    specialFeatures: ['Vista panoramica', 'Archivio segreto', 'Maestri arcani'],
    requirements: { minLevel: 10, questRequirements: ['accademia_enrollment'] }
  },

  // TIER 4: LOCATIONS - Goldenharbor
  {
    id: 'location_porto_maestoso',
    name: 'Porto Maestoso',
    description: 'Il grande porto di Goldenharbor, hub del commercio internazionale',
    tier: LocationTier.LOCATION,
    parentId: 'city_goldenharbor',
    coordinatesX: 155,
    coordinatesY: 75,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Navi commerciali', 'Merci esotiche', 'Capitani esperti'],
    population: 1000
  },
  {
    id: 'location_quartiere_mercanti',
    name: 'Quartiere dei Mercanti',
    description: 'Il ricco quartiere dove risiedono i grandi commercianti',
    tier: LocationTier.LOCATION,
    parentId: 'city_goldenharbor',
    coordinatesX: 145,
    coordinatesY: 85,
    isAccessible: false,
    isKnown: false,
    isDiscovered: false,
    specialFeatures: ['Residenze lussuose', 'Magazzini pieni', 'Gilde commerciali'],
    population: 2000
  }
];

async function seedLocations() {
  console.log('🌍 Seeding world locations...');
  
  try {
    // Clear existing locations
    await prisma.location.deleteMany();
    console.log('🗑️ Cleared existing locations');
    
    // Create locations in hierarchy order (parents before children)
    for (const location of worldLocations) {
      await prisma.location.create({
        data: {
          id: location.id,
          name: location.name,
          description: location.description,
          tier: location.tier,
          parentId: location.parentId,
          coordinatesX: location.coordinatesX,
          coordinatesY: location.coordinatesY,
          coordinatesZ: 0,
          isAccessible: location.isAccessible,
          isKnown: location.isKnown,
          isDiscovered: location.isDiscovered,
          isSafeZone: true,
          isPvpEnabled: false,
          isStartArea: location.isStartArea || false,
          maxPlayers: 50,
          specialFeatures: location.specialFeatures || [],
          population: location.population,
          requirements: location.requirements || {},
          loreConnections: {}
        }
      });
      console.log(`✅ Created: ${location.name} (${location.tier})`);
    }
    
    console.log('🌍 World locations seeded successfully!');
    
    // Update any existing characters to start at the laboratory
    const updateResult = await prisma.character.updateMany({
      where: {
        currentLocationId: null
      },
      data: {
        currentLocationId: 'location_laboratorio_alchimista'
      }
    });
    
    console.log(`🏠 Updated ${updateResult.count} characters to start at the laboratory`);
    
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    throw error;
  }
}

async function main() {
  await seedLocations();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
