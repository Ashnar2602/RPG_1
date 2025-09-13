const { PrismaClient } = require('@prisma/client');

async function addPortolunaRegion() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🏪 Adding Confederazione Mercantile di Portoluna...');
    
    // Find the archipelago continent
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' }
    });
    
    if (!archipelago) {
      throw new Error('Archipelago continent not found!');
    }
    
    // Add the region
    const portoluna = await prisma.location.create({
      data: {
        id: 'region_portoluna',
        name: 'Confederazione Mercantile di Portoluna',
        description: 'Isola principale dell\'arcipelago, centro commerciale mondiale e hub finanziario',
        tier: 'REGION',
        parentId: archipelago.id,
        coordinatesX: 100,
        coordinatesY: 50,
        population: 800000,
        isAccessible: true,
        isStartArea: false,
        specialFeatures: ['Centro commerciale', 'Hub finanziario', 'Porto internazionale'],
        requirements: {}
      }
    });
    
    console.log('✅ Regione Portoluna created:', portoluna.name);
    
    // Add the 4 major cities
    const cities = [
      {
        id: 'city_portoluna_capital',
        name: 'Portoluna',
        description: 'Capitale commerciale dell\'arcipelago, porto naturale perfetto con baia a forma di luna crescente',
        population: 230000,
        coordinates: { x: 100, y: 50 },
        features: ['Capitale commerciale', 'Porto internazionale', 'Banche centrali']
      },
      {
        id: 'city_goldweight',
        name: 'Goldweight',
        description: 'Centro bancario fortificato, sistema finanziario internazionale e riserve auree',
        population: 73000,
        coordinates: { x: 105, y: 55 },
        features: ['Sistema bancario', 'Riserve auree', 'Prestiti internazionali']
      },
      {
        id: 'city_shipwright',
        name: 'Shipwright',
        description: 'Cantieri navali avanzati, costruzione e riparazione navale, innovazione marittima',
        population: 67000,
        coordinates: { x: 95, y: 45 },
        features: ['Cantieri navali', 'Innovazione marittima', 'Riparazione navi']
      },
      {
        id: 'city_compass',
        name: 'Compass',
        description: 'Centro navigazione e cartografia, faro principale e osservatorio meteorologico marino',
        population: 53000,
        coordinates: { x: 110, y: 60 },
        features: ['Centro navigazione', 'Cartografia', 'Meteorologia marina']
      }
    ];
    
    for (const cityData of cities) {
      const city = await prisma.location.create({
        data: {
          id: cityData.id,
          name: cityData.name,
          description: cityData.description,
          tier: 'CITY',
          parentId: portoluna.id,
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
    
    console.log('🎉 Confederazione Mercantile di Portoluna completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPortolunaRegion();
