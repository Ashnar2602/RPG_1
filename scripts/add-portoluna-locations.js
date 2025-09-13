const { PrismaClient } = require('@prisma/client');

async function addPortolunaLocations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🏪 Adding Portoluna settlements and special locations...');
    
    // Find all cities in Portoluna region
    const cities = await prisma.location.findMany({
      where: { 
        parentId: 'region_portoluna',
        tier: 'CITY'
      }
    });
    
    console.log(`Found ${cities.length} cities in Portoluna`);
    
    // Define locations for each city (3 per city = 12 total)
    const locationsByCity = {
      'city_portoluna_capital': [
        {
          name: 'Silkroad',
          description: 'Centro commercio tessuti di lusso e sete orientali, mercanti internazionali di tessuti pregiati',
          population: 12000,
          features: ['Commercio tessuti', 'Sete orientali', 'Lusso internazionale']
        },
        {
          name: 'Camera del Tesoro Mondiale',
          description: 'Vault contenente le più grandi riserve di tesori del mondo conosciuto, accesso ultra-ristretto',
          population: 200,
          features: ['Riserve mondiali', 'Tesori leggendari', 'Sicurezza massima']
        },
        {
          name: 'Faro delle Rotte Eterne',
          description: 'Faro magico che guida tutto il traffico marittimo mondiale, navigazione essenziale',
          population: 150,
          features: ['Faro magico', 'Navigazione mondiale', 'Rotte eterne']
        }
      ],
      'city_goldweight': [
        {
          name: 'Spiceport',
          description: 'Porto specializzato nell\'importazione di spezie rare, conservazione e distribuzione mondiale',
          population: 10500,
          features: ['Importazione spezie', 'Conservazione', 'Distribuzione mondiale']
        },
        {
          name: 'Sala dei Contratti Sacri',
          description: 'Sala dove vengono firmati i più importanti accordi commerciali internazionali, diritto commerciale',
          population: 300,
          features: ['Contratti internazionali', 'Diritto commerciale', 'Accordi sacri']
        },
        {
          name: 'Giardino delle Monete del Mondo',
          description: 'Museo showcasing delle valute di tutte le terre conosciute, storia economica mondiale',
          population: 400,
          features: ['Museo valute', 'Storia economica', 'Numismatica mondiale']
        }
      ],
      'city_shipwright': [
        {
          name: 'Gemhaven',
          description: 'Rifugio commercio gemme preziose, taglio professionale e gioielleria di alta qualità',
          population: 9200,
          features: ['Commercio gemme', 'Taglio professionale', 'Gioielleria fine']
        },
        {
          name: 'Osservatorio delle Maree',
          description: 'Struttura avanzata per predizione maree e meteorologia, sicurezza marittima essenziale',
          population: 250,
          features: ['Predizione maree', 'Meteorologia avanzata', 'Sicurezza marittima']
        },
        {
          name: 'Cripta dei Mercanti Leggendari',
          description: 'Tomba onoraria dei più grandi mercanti della storia, saggezza commerciale e ispirazione',
          population: 100,
          features: ['Mercanti leggendari', 'Saggezza commerciale', 'Ispirazione business']
        }
      ],
      'city_compass': [
        {
          name: 'Sealane',
          description: 'Servizi portuali specializzati, pilotaggio navale e logistica marittima avanzata',
          population: 8800,
          features: ['Servizi portuali', 'Pilotaggio navale', 'Logistica marittima']
        },
        {
          name: 'Coinmint',
          description: 'Zecca ufficiale per conio monete internazionali e certificazione metalli preziosi',
          population: 7600,
          features: ['Conio monete', 'Certificazione metalli', 'Standard monetari']
        },
        {
          name: 'Warehouse',
          description: 'Centro stoccaggio merci e distribuzione, logistica commerciale e magazzinaggio avanzato',
          population: 6400,
          features: ['Stoccaggio merci', 'Distribuzione logistica', 'Magazzinaggio avanzato']
        }
      ]
    };
    
    // Add locations to each city
    for (const city of cities) {
      const cityLocations = locationsByCity[city.id];
      if (!cityLocations) {
        console.log(`No locations defined for ${city.name}, skipping...`);
        continue;
      }
      
      console.log(`\nAdding locations for ${city.name}:`);
      
      for (let i = 0; i < cityLocations.length; i++) {
        const locationData = cityLocations[i];
        
        const location = await prisma.location.create({
          data: {
            name: locationData.name,
            description: locationData.description,
            tier: 'LOCATION',
            parentId: city.id,
            coordinatesX: city.coordinatesX + (Math.random() * 10 - 5), // Slight random offset
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
    
    console.log('\n🎉 All Portoluna locations added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPortolunaLocations();
