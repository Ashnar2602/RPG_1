const { PrismaClient } = require('@prisma/client');

async function fixLocationHierarchy() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing location hierarchy...\n');
    
    // For each region, redistribute its locations among its cities
    const regions = await prisma.location.findMany({
      where: { 
        tier: 'REGION',
        name: { in: ['Regno di Velendar', 'Regno di Brynnar', 'Regno degli Gnomi', 'Territorio degli Elfi Scuri'] }
      },
      include: {
        children: {
          where: { tier: { in: ['CITY', 'LOCATION'] } },
          orderBy: { name: 'asc' }
        }
      }
    });
    
    for (const region of regions) {
      console.log(`=== Processing ${region.name} ===`);
      
      const cities = region.children.filter(c => c.tier === 'CITY');
      const locations = region.children.filter(c => c.tier === 'LOCATION');
      
      console.log(`Cities: ${cities.length}, Locations to redistribute: ${locations.length}`);
      
      if (cities.length === 0) {
        console.log('No cities found, skipping...\n');
        continue;
      }
      
      // Distribute locations evenly among cities (3 per city for 4 cities = 12 total)
      const locationsPerCity = Math.floor(locations.length / cities.length);
      console.log(`Assigning ${locationsPerCity} locations per city`);
      
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const startIndex = i * locationsPerCity;
        const endIndex = startIndex + locationsPerCity;
        const cityLocations = locations.slice(startIndex, endIndex);
        
        console.log(`  ${city.name}: ${cityLocations.map(l => l.name).join(', ')}`);
        
        // Update parentId for these locations
        for (const location of cityLocations) {
          await prisma.location.update({
            where: { id: location.id },
            data: { parentId: city.id }
          });
        }
      }
      
      console.log('');
    }
    
    console.log('✅ Location hierarchy fixed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLocationHierarchy();
