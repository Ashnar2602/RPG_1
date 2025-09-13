const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrder() {
  try {
    const continents = await prisma.location.findMany({
      where: { tier: 'CONTINENT' },
      orderBy: { coordinatesX: 'asc' }
    });
    
    console.log('=== CURRENT CONTINENT ORDER ===');
    continents.forEach((c, i) => {
      console.log(`${i+1}. ${c.name} (X: ${c.coordinatesX})`);
    });
    
    const regions = await prisma.location.findMany({
      where: { tier: 'REGION' },
      orderBy: [{ coordinatesX: 'asc' }, { coordinatesY: 'asc' }]
    });
    
    console.log('\n=== CURRENT REGIONS ORDER ===');
    regions.forEach((r, i) => {
      console.log(`${i+1}. ${r.name} (X: ${r.coordinatesX}, Y: ${r.coordinatesY})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrder();
