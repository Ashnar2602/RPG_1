const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const stats = await Promise.all([
      prisma.location.count({ where: { tier: 'CONTINENT' } }),
      prisma.location.count({ where: { tier: 'REGION' } }),
      prisma.location.count({ where: { tier: 'CITY' } }),
      prisma.location.count({ where: { tier: 'LOCATION' } })
    ]);
    
    console.log('=== CURRENT DATABASE STATS ===');
    console.log('Continents:', stats[0]);
    console.log('Regions:', stats[1]);
    console.log('Cities:', stats[2]);
    console.log('Locations:', stats[3]);
    console.log('Total:', stats.reduce((a,b) => a+b, 0));
    
    console.log('\n=== BY CONTINENT ===');
    const continents = await prisma.location.findMany({
      where: { tier: 'CONTINENT' },
      include: { 
        children: { 
          include: { 
            children: { 
              include: { children: true } 
            } 
          } 
        } 
      },
      orderBy: { coordinatesX: 'asc' }
    });
    
    continents.forEach(cont => {
      console.log(`${cont.name}:`);
      console.log(`  Regions: ${cont.children.length}`);
      cont.children.forEach(reg => {
        console.log(`    ${reg.name}: ${reg.children.length} cities`);
        reg.children.forEach(city => {
          console.log(`      ${city.name}: ${city.children.length} locations`);
        });
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
