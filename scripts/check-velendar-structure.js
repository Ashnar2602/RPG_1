const { PrismaClient } = require('@prisma/client');

async function checkVelendarStructure() {
  const prisma = new PrismaClient();
  
  try {
    // Find Regno di Velendar
    const velendar = await prisma.location.findFirst({
      where: { name: 'Regno di Velendar' }
    });
    
    console.log('Velendar found:', velendar.name, 'ID:', velendar.id);
    
    // Find all children of Velendar
    const children = await prisma.location.findMany({
      where: { parentId: velendar.id },
      select: { name: true, tier: true, id: true, parentId: true },
      orderBy: { tier: 'asc' }
    });
    
    console.log(`\nAll children of Velendar (${children.length}):`);
    
    const cities = children.filter(c => c.tier === 'CITY');
    const locations = children.filter(c => c.tier === 'LOCATION');
    
    console.log(`\nCities (${cities.length}):`);
    cities.forEach(city => {
      console.log(`- ${city.name} (${city.tier}) - ID: ${city.id}`);
    });
    
    console.log(`\nLocations directly under Velendar (${locations.length}):`);
    locations.forEach(loc => {
      console.log(`- ${loc.name} (${loc.tier}) - ID: ${loc.id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVelendarStructure();
