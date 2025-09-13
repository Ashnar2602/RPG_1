const { PrismaClient } = require('@prisma/client');

async function addVelacortaRegion() {
  const prisma = new PrismaClient();
  
  try {
    console.log('⚓ Adding Repubblica Marinara di Velacorta...');
    
    // Find the archipelago continent
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' }
    });
    
    if (!archipelago) {
      throw new Error('Archipelago continent not found!');
    }
    
    // Add the region
    const velacorta = await prisma.location.create({
      data: {
        id: 'region_velacorta',
        name: 'Repubblica Marinara di Velacorta',
        description: 'Cluster di isole meridionali specializzate in navigazione militare, esplorazione marina e sicurezza marittima',
        tier: 'REGION',
        parentId: archipelago.id,
        coordinatesX: 50,
        coordinatesY: -50,
        population: 210000,
        isAccessible: true,
        isStartArea: false,
        specialFeatures: ['Navigazione militare', 'Esplorazione marina', 'Sicurezza marittima'],
        requirements: {}
      }
    });
    
    console.log('✅ Regione Velacorta created:', velacorta.name);
    
    // Add the 4 major cities
    const cities = [
      {
        id: 'city_velacorta_capital',
        name: 'Velacorta',
        description: 'Capitale navale e base militare principale, accademia navale e comando flotta dell\'arcipelago',
        population: 110000,
        coordinates: { x: 50, y: -50 },
        features: ['Capitale navale', 'Accademia militare', 'Comando flotta']
      },
      {
        id: 'city_stormwatch',
        name: 'Stormwatch',
        description: 'Osservatorio meteorologico avanzato, monitoraggio tempeste e sicurezza marittima',
        population: 42000,
        coordinates: { x: 45, y: -45 },
        features: ['Osservatorio meteorologico', 'Controllo tempeste', 'Sicurezza marittima']
      },
      {
        id: 'city_deepanchor',
        name: 'Deepanchor',
        description: 'Centro ricerca oceanica e esplorazione marina profonda, archeologia subacquea',
        population: 38000,
        coordinates: { x: 55, y: -55 },
        features: ['Ricerca oceanica', 'Esplorazione profonda', 'Archeologia marina']
      },
      {
        id: 'city_windcutter',
        name: 'Windcutter',
        description: 'Centro sport nautici e competizioni veliche, innovazione nella velocità navale',
        population: 35000,
        coordinates: { x: 60, y: -40 },
        features: ['Sport nautici', 'Competizioni veliche', 'Innovazione velocità']
      }
    ];
    
    for (const cityData of cities) {
      const city = await prisma.location.create({
        data: {
          id: cityData.id,
          name: cityData.name,
          description: cityData.description,
          tier: 'CITY',
          parentId: velacorta.id,
          coordinatesX: cityData.coordinates.x,
          coordinatesY: cityData.coordinates.y,
          population: cityData.population,
          isAccessible: true,
          isStartArea: false,
          specialFeatures: cityData.features,
          requirements: {}
        }
      });
      
      console.log(`✅ City created: ${city.name}`);
    }
    
    // Add locations for each city (3 per city = 12 total)
    const locationsByCity = {
      'city_velacorta_capital': [
        {
          name: 'Seahawk',
          description: 'Centro ricognizione aerea e addestramento falchi marini, navigazione aerea e scouting',
          population: 7800,
          features: ['Ricognizione aerea', 'Addestramento falchi', 'Scouting navale']
        },
        {
          name: 'Abisso del Kraken Dormiente',
          description: 'Fossa marina pericolosa dove dorme un antico mostro marino, esplorazione ad alto rischio',
          population: 50,
          features: ['Pericolo estremo', 'Mostro marino', 'Esplorazione rischiosa']
        },
        {
          name: 'Tempio delle Correnti',
          description: 'Tempio sottomarino dedicato alle correnti marine e alla navigazione perfetta',
          population: 200,
          features: ['Tempio sottomarino', 'Navigazione sacra', 'Benedizioni marine']
        }
      ],
      'city_stormwatch': [
        {
          name: 'Tidepool',
          description: 'Centro ricerca maree e navigazione costiera, specialisti delle maree e magia tidale',
          population: 6900,
          features: ['Ricerca maree', 'Navigazione costiera', 'Magia tidale']
        },
        {
          name: 'Laboratorio delle Maree Magiche',
          description: 'Struttura di ricerca per lo studio degli effetti magici delle maree oceaniche',
          population: 300,
          features: ['Ricerca magica', 'Magie tidali', 'Studi oceanici']
        },
        {
          name: 'Arena Navale degli Eroi',
          description: 'Grande arena per competizioni navali e battaglie simulate, campionati marittimi',
          population: 500,
          features: ['Competizioni navali', 'Battaglie simulate', 'Campionati marittimi']
        }
      ],
      'city_deepanchor': [
        {
          name: 'Saltspray',
          description: 'Centro produzione sale marino e conservazione, chimica marina e preservazione cibi',
          population: 6200,
          features: ['Produzione sale', 'Conservazione', 'Chimica marina']
        },
        {
          name: 'Cimitero delle Navi Perdute',
          description: 'Cimitero sottomarino di navi storiche, archeologia navale e tesori sommersi',
          population: 100,
          features: ['Archeologia navale', 'Navi storiche', 'Tesori sommersi']
        },
        {
          name: 'Archivio delle Rotte Segrete',
          description: 'Archivio segreto delle rotte marine nascoste e intelligence marittima classificata',
          population: 80,
          features: ['Rotte segrete', 'Intelligence navale', 'Informazioni classificate']
        }
      ],
      'city_windcutter': [
        {
          name: 'Kelp',
          description: 'Centro ricerca botanica marina e coltivazione sottomarina, verdure marine',
          population: 5500,
          features: ['Botanica marina', 'Coltivazione sottomarina', 'Verdure marine']
        },
        {
          name: 'Coral',
          description: 'Centro gestione barriere coralline e costruzione sottomarina, protezione marina',
          population: 4800,
          features: ['Gestione coralli', 'Costruzione sottomarina', 'Protezione marina']
        },
        {
          name: 'Pearl',
          description: 'Centro immersioni per perle e tesori sottomarini, beni di lusso marini',
          population: 4100,
          features: ['Immersioni perle', 'Tesori sottomarini', 'Lusso marino']
        }
      ]
    };
    
    // Add locations to each city
    const velacortaCities = await prisma.location.findMany({
      where: { 
        parentId: velacorta.id,
        tier: 'CITY'
      }
    });
    
    for (const city of velacortaCities) {
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
            isAccessible: true,
            isStartArea: false,
            specialFeatures: locationData.features,
            requirements: {}
          }
        });
        
        console.log(`  ✅ ${location.name} (${location.population} inhabitants)`);
      }
    }
    
    console.log('\n🎉 Repubblica Marinara di Velacorta completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVelacortaRegion();
