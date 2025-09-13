const { PrismaClient } = require('@prisma/client');

async function addBellearteRegion() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🎭 Adding Città-Stato Culturale di Bellearte...');
    
    // Find the archipelago continent
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' }
    });
    
    if (!archipelago) {
      throw new Error('Archipelago continent not found!');
    }
    
    // Add the region
    const bellearte = await prisma.location.create({
      data: {
        id: 'region_bellearte',
        name: 'Città-Stato Culturale di Bellearte',
        description: 'Isola orientale centro culturale mondiale, regno dell\'arte, bellezza e ispirazione creativa',
        tier: 'REGION',
        parentId: archipelago.id,
        coordinatesX: 150,
        coordinatesY: 50,
        population: 180000,
        isAccessible: true,
        isStartArea: false,
        specialFeatures: ['Centro culturale mondiale', 'Arte e bellezza', 'Ispirazione creativa', 'Turismo culturale'],
        requirements: {}
      }
    });
    
    console.log('✅ Regione Bellearte created:', bellearte.name);
    
    // Add the 4 major cities
    const cities = [
      {
        id: 'city_bellearte_capital',
        name: 'Bellearte',
        description: 'Capitale culturale mondiale circondata da giardini artistici e teatri all\'aperto',
        population: 110000,
        coordinates: { x: 150, y: 50 },
        features: ['Capitale culturale', 'Giardini artistici', 'Teatri all\'aperto']
      },
      {
        id: 'city_melodia',
        name: 'Melodia',
        description: 'Valle acustica perfetta, centro mondiale della composizione musicale e arte sonora',
        population: 35000,
        coordinates: { x: 145, y: 55 },
        features: ['Valle acustica', 'Composizione musicale', 'Arte sonora']
      },
      {
        id: 'city_dipinto',
        name: 'Dipinto',
        description: 'Colline panoramiche ideali per pittura, centro mondiale delle arti visive e teoria del colore',
        population: 32000,
        coordinates: { x: 155, y: 45 },
        features: ['Colline panoramiche', 'Arti visive', 'Teoria del colore']
      },
      {
        id: 'city_teatro',
        name: 'Teatro',
        description: 'Anfiteatro naturale perfetto, centro mondiale del teatro e performance artistiche',
        population: 28000,
        coordinates: { x: 160, y: 60 },
        features: ['Anfiteatro naturale', 'Teatro mondiale', 'Performance artistiche']
      }
    ];
    
    for (const cityData of cities) {
      const city = await prisma.location.create({
        data: {
          id: cityData.id,
          name: cityData.name,
          description: cityData.description,
          tier: 'CITY',
          parentId: bellearte.id,
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
      'city_bellearte_capital': [
        {
          name: 'Marble',
          description: 'Centro scultori e intagliatori pietra, creazione monumenti e opere scultoree monumentali',
          population: 6800,
          features: ['Scultura professionale', 'Intaglio pietra', 'Monumenti artistici']
        },
        {
          name: 'Galleria delle Meraviglie Eterne',
          description: 'Galleria contenente le opere d\'arte più belle mai create nella storia del mondo',
          population: 500,
          features: ['Capolavori mondiali', 'Arte leggendaria', 'Ispirazione eterna']
        },
        {
          name: 'Teatro dei Sogni Viventi',
          description: 'Teatro dove le performance diventano temporaneamente reali attraverso magia dei sogni',
          population: 300,
          features: ['Teatro magico', 'Sogni viventi', 'Performance reali']
        }
      ],
      'city_melodia': [
        {
          name: 'Canvas',
          description: 'Centro artisti tessili e pittura su tessuto, materiali artistici e arte tessile',
          population: 6100,
          features: ['Arte tessile', 'Pittura tessuto', 'Materiali artistici']
        },
        {
          name: 'Giardino delle Ispirazioni',
          description: 'Giardino magico che ispira creatività in tutti coloro che lo visitano',
          population: 400,
          features: ['Ispirazione magica', 'Creatività potenziata', 'Giardino delle muse']
        },
        {
          name: 'Biblioteca delle Storie Non Scritte',
          description: 'Biblioteca contenente storie che esistono solo nell\'immaginazione e nei sogni',
          population: 200,
          features: ['Storie immaginarie', 'Potenziale creativo', 'Narrativa infinita']
        }
      ],
      'city_dipinto': [
        {
          name: 'Verse',
          description: 'Quartiere poeti e scrittori, centro mondiale della letteratura e arte narrativa',
          population: 5400,
          features: ['Poesia mondiale', 'Arte letteraria', 'Narrativa creativa']
        },
        {
          name: 'Osservatorio della Bellezza Universale',
          description: 'Osservatorio per studiare la natura della bellezza e dell\'estetica universale',
          population: 150,
          features: ['Filosofia bellezza', 'Estetica universale', 'Ricerca bellezza']
        },
        {
          name: 'Cripta dei Grandi Maestri',
          description: 'Tomba onoraria dei più grandi artisti della storia, saggezza artistica eterna',
          population: 100,
          features: ['Maestri leggendari', 'Saggezza artistica', 'Ispirazione storica']
        }
      ],
      'city_teatro': [
        {
          name: 'Color',
          description: 'Centro ricerca colori e creazione pigmenti artistici, alchimia dei colori e tinte',
          population: 4900,
          features: ['Ricerca colori', 'Pigmenti artistici', 'Alchimia cromatica']
        },
        {
          name: 'Dance',
          description: 'Centro danza e coreografia, arti del movimento e espressione corporea',
          population: 4300,
          features: ['Danza professionale', 'Coreografia', 'Arte del movimento']
        },
        {
          name: 'Beauty',
          description: 'Centro specialisti bellezza e creazione cosmetici, arte estetica e bellezza',
          population: 3700,
          features: ['Specialisti bellezza', 'Cosmetici artistici', 'Arte estetica']
        }
      ]
    };
    
    // Add locations to each city
    const bellearteCities = await prisma.location.findMany({
      where: { 
        parentId: bellearte.id,
        tier: 'CITY'
      }
    });
    
    for (const city of bellearteCities) {
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
    
    console.log('\n🎉 Città-Stato Culturale di Bellearte completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBellearteRegion();
