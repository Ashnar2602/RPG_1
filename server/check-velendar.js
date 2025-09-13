const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVelendar() {
  try {
    const region = await prisma.location.findFirst({ 
      where: { name: 'Regno di Velendar', tier: 'REGION' }
    });
    
    if (region) {
      const cities = await prisma.location.findMany({
        where: { parentId: region.id, tier: 'CITY' },
        orderBy: { population: 'desc' }
      });
      
      console.log('Current Velendar cities:');
      cities.forEach(city => {
        const pop = city.population ? city.population.toLocaleString() : 'N/A';
        console.log(`- ${city.name} (${pop} pop) - ID: ${city.id}`);
      });
      
      console.log(`\nTotal cities: ${cities.length}`);
    } else {
      console.log('Regno di Velendar region not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVelendar();
