const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllLocations() {
  try {
    const continentOrientale = await prisma.location.findFirst({
      where: { name: 'Continente Orientale', tier: 'CONTINENT' }
    });
    
    if (!continentOrientale) {
      console.log('❌ Continente Orientale not found');
      return;
    }
    
    // Get all locations hierarchically
    const regions = await prisma.location.findMany({
      where: { parentId: continentOrientale.id, tier: 'REGION' }
    });
    
    console.log('🌍 CONTINENTE ORIENTALE - Current Database Status:');
    console.log('📍 Regions:', regions.length);
    
    for (const region of regions) {
      const cities = await prisma.location.findMany({
        where: { parentId: region.id, tier: 'CITY' }
      });
      
      const settlements = await prisma.location.findMany({
        where: { parentId: region.id, tier: 'LOCATION', population: { not: null } }
      });
      
      const specials = await prisma.location.findMany({
        where: { parentId: region.id, tier: 'LOCATION', population: null }
      });
      
      console.log(`\n🏛️ ${region.name}:`);
      console.log(`  - Cities (Tier 2): ${cities.length}`);
      console.log(`  - Settlements (Tier 3): ${settlements.length}`);
      console.log(`  - Special Locations (Tier 4): ${specials.length}`);
      console.log(`  - Total: ${cities.length + settlements.length + specials.length}`);
    }
    
    // Total count
    const totalRegions = regions.length;
    const totalLocations = await prisma.location.count({
      where: { 
        parentId: { in: regions.map(r => r.id) }
      }
    });
    
    console.log(`\n📊 GRAND TOTAL:`);
    console.log(`  - ${totalRegions} Regions`);
    console.log(`  - ${totalLocations} Sub-locations`);
    console.log(`  - ${totalRegions + totalLocations + 1} Total (including continent)`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllLocations();
