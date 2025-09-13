const { PrismaClient } = require('@prisma/client');

async function checkAllRegionsStructure() {
  const prisma = new PrismaClient();
  
  try {
    const regions = await prisma.location.findMany({
      where: { tier: 'REGION' },
      select: { name: true, id: true }
    });
    
    console.log(`Found ${regions.length} regions:`);
    
    for (const region of regions) {
      console.log(`\n=== ${region.name} ===`);
      
      const children = await prisma.location.findMany({
        where: { parentId: region.id },
        select: { name: true, tier: true },
        orderBy: { tier: 'asc' }
      });
      
      const cities = children.filter(c => c.tier === 'CITY');
      const locations = children.filter(c => c.tier === 'LOCATION');
      
      console.log(`Cities: ${cities.length} - ${cities.map(c => c.name).join(', ')}`);
      console.log(`Locations directly under region: ${locations.length}`);
      if (locations.length > 0) {
        console.log(`  - ${locations.slice(0, 5).map(l => l.name).join(', ')}${locations.length > 5 ? '...' : ''}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllRegionsStructure();
