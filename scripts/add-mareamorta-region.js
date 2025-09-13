const { PrismaClient } = require('@prisma/client');

async function addMareamortaRegion() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🏴‍☠️ Adding Alleanza dei Pirati di Mareamorta...');
    
    // Find the archipelago continent
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' }
    });
    
    if (!archipelago) {
      throw new Error('Archipelago continent not found!');
    }
    
    // Add the region
    const mareamorta = await prisma.location.create({
      data: {
        id: 'region_mareamorta',
        name: 'Alleanza dei Pirati di Mareamorta',
        description: 'Isole rocciose occidentali nascoste, regno dei pirati liberi e base del contrabbando mondiale',
        tier: 'REGION',
        parentId: archipelago.id,
        coordinatesX: -100,
        coordinatesY: 0,
        population: 135000,
        isAccessible: false, // Dangerous pirate territory
        isStartArea: false,
        specialFeatures: ['Territorio pirata', 'Contrabbando', 'Libertà marittima', 'Porti nascosti'],
        requirements: { "reputation": "pirate", "access": "criminal_contacts" }
      }
    });
    
    console.log('✅ Regione Mareamorta created:', mareamorta.name);
    
    // Add the 4 major cities
    const cities = [
      {
        id: 'city_mareamorta_capital',
        name: 'Mareamorta',
        description: 'Capitale pirata nascosta in baia segreta, rifugio sicuro per tutti i fuorilegge del mare',
        population: 85000,
        coordinates: { x: -100, y: 0 },
        features: ['Capitale pirata', 'Porto nascosto', 'Rifugio fuorilegge'],
        accessible: false
      },
      {
        id: 'city_blackwater',
        name: 'Blackwater',
        description: 'Centro contrabbando e mercato nero, hub per merci illegali e operazioni clandestine',
        population: 32000,
        coordinates: { x: -95, y: 5 },
        features: ['Centro contrabbando', 'Mercato nero', 'Operazioni clandestine'],
        accessible: false
      },
      {
        id: 'city_reefbreak',
        name: 'Reefbreak',
        description: 'Centro demolizione navale e recupero relitti, operazioni di salvataggio pericolose',
        population: 28000,
        coordinates: { x: -105, y: -5 },
        features: ['Demolizione navale', 'Recupero relitti', 'Salvataggio pericoloso'],
        accessible: false
      },
      {
        id: 'city_mutiny',
        name: 'Mutiny',
        description: 'Base ribellione navale e rifugio ammutinati, centro anti-autorità e attività rivoluzionarie',
        population: 25000,
        coordinates: { x: -90, y: -10 },
        features: ['Ribellione navale', 'Rifugio ammutinati', 'Attività rivoluzionarie'],
        accessible: false
      }
    ];
    
    for (const cityData of cities) {
      const city = await prisma.location.create({
        data: {
          id: cityData.id,
          name: cityData.name,
          description: cityData.description,
          tier: 'CITY',
          parentId: mareamorta.id,
          coordinatesX: cityData.coordinates.x,
          coordinatesY: cityData.coordinates.y,
          population: cityData.population,
          isAccessible: cityData.accessible,
          isStartArea: false,
          specialFeatures: cityData.features,
          requirements: { "reputation": "pirate", "access": "criminal" }
        }
      });
      
      console.log(`✅ City created: ${city.name} (Restricted Access)`);
    }
    
    // Add locations for each city (3 per city = 12 total)
    const locationsByCity = {
      'city_mareamorta_capital': [
        {
          name: 'Smugglers',
          description: 'Quartiere contrabbandieri attivi, operazioni cargo illegale e trasporto clandestino',
          population: 6500,
          features: ['Operazioni contrabbando', 'Cargo illegale', 'Trasporto clandestino'],
          accessible: false
        },
        {
          name: 'Isola del Tesoro Maledetto',
          description: 'Isola contenente tesori maledetti che corrompono chiunque li tocchi, pericolo soprannaturale',
          population: 20,
          features: ['Tesoro maledetto', 'Corruzione soprannaturale', 'Pericolo estremo'],
          accessible: false
        },
        {
          name: 'Grotta dei Cento Capitani',
          description: 'Grotta contenente resti e tesori di capitani pirati leggendari della storia',
          population: 100,
          features: ['Capitani leggendari', 'Tesori storici', 'Saggezza pirata'],
          accessible: false
        }
      ],
      'city_blackwater': [
        {
          name: 'Treasure',
          description: 'Centro cacciatori di tesori e lettura mappe, recupero bottini sepolti',
          population: 5800,
          features: ['Caccia tesori', 'Lettura mappe', 'Bottini sepolti'],
          accessible: false
        },
        {
          name: 'Tribunale dell\'Onore Pirata',
          description: 'Tribunale dove i pirati risolvono dispute secondo il codice dell\'onore pirata',
          population: 150,
          features: ['Giustizia pirata', 'Codice onore', 'Dispute legali'],
          accessible: false
        },
        {
          name: 'Mercato Nero dell\'Arcipelago',
          description: 'Il più grande mercato nero del mondo conosciuto, merci proibite e artefatti illegali',
          population: 800,
          features: ['Mercato nero mondiale', 'Merci proibite', 'Artefatti illegali'],
          accessible: false
        }
      ],
      'city_reefbreak': [
        {
          name: 'Parrot',
          description: 'Centro messaggi segreti e comunicazioni pirata, traffico informazioni clandestine',
          population: 5200,
          features: ['Messaggi segreti', 'Comunicazioni pirata', 'Traffico informazioni'],
          accessible: false
        },
        {
          name: 'Fortezza delle Nebbie',
          description: 'Fortezza nascosta protetta da nebbie magiche, difesa principale del territorio pirata',
          population: 300,
          features: ['Fortezza nascosta', 'Nebbie magiche', 'Difesa principale'],
          accessible: false
        },
        {
          name: 'Tempio della Libertà Marittima',
          description: 'Tempio dedicato alla libertà marittima e filosofia pirata, indipendenza dai governi',
          population: 200,
          features: ['Libertà marittima', 'Filosofia pirata', 'Indipendenza'],
          accessible: false
        }
      ],
      'city_mutiny': [
        {
          name: 'Cutlass',
          description: 'Centro artigiani armi e addestramento combattimento, armamenti pirati specializzati',
          population: 4600,
          features: ['Artigiani armi', 'Addestramento combattimento', 'Armamenti pirati'],
          accessible: false
        },
        {
          name: 'Rum',
          description: 'Centro produzione rum e rifornimento taverne, morale pirati e vita sociale',
          population: 4000,
          features: ['Produzione rum', 'Rifornimento taverne', 'Vita sociale pirata'],
          accessible: false
        },
        {
          name: 'Kraken',
          description: 'Centro cacciatori mostri marini e tracciamento creature pericolose, pericoli oceanici',
          population: 3400,
          features: ['Caccia mostri marini', 'Creature pericolose', 'Pericoli oceanici'],
          accessible: false
        }
      ]
    };
    
    // Add locations to each city
    const mareamortaCities = await prisma.location.findMany({
      where: { 
        parentId: mareamorta.id,
        tier: 'CITY'
      }
    });
    
    for (const city of mareamortaCities) {
      const cityLocations = locationsByCity[city.id];
      if (!cityLocations) continue;
      
      console.log(`\nAdding locations for ${city.name}:`);
      
      for (const locationData of cityLocations) {
        const location = await prisma.location.create({
          data: {
            name: locationData.name,
            description: locationData.description,
            tier: 'LOCATION',
            parentId: city.id,
            coordinatesX: city.coordinatesX + (Math.random() * 10 - 5),
            coordinatesY: city.coordinatesY + (Math.random() * 10 - 5),
            population: locationData.population,
            isAccessible: locationData.accessible,
            isStartArea: false,
            specialFeatures: locationData.features,
            requirements: { "reputation": "pirate", "access": "criminal_contacts" }
          }
        });
        
        console.log(`  ✅ ${location.name} (${location.population} inhabitants) [RESTRICTED]`);
      }
    }
    
    console.log('\n🎉 Alleanza dei Pirati di Mareamorta completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMareamortaRegion();
