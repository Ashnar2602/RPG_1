const { PrismaClient } = requir    console.log('=== CURRENT CONTINENT ORDER ===');
    continents.forEach((c, i) => {
      console.log(`${i+1}. ${c.name} (X: ${c.x})`);
    });prisma/client');
const prisma = new PrismaClient();

async function fixOrder() {
  try {
    console.log('🔧 Fixing continent coordinate order...');
    
    // Fix coordinates: Occidentale (-1000) → Arcipelago (0) → Orientale (1000)
    await prisma.location.update({
      where: { id: 'continent_occidentale' },
      data: { x: -1000 }
    });
    
    await prisma.location.update({
      where: { id: 'continent_arcipelago' },
      data: { x: 0 }
    });
    
    await prisma.location.update({
      where: { id: 'continent_orientale' },
      data: { x: 1000 }
    });
    
    console.log('✅ Coordinates fixed!');
    
    // Verify new order
    const continents = await prisma.location.findMany({
      where: { tier: 'CONTINENT' },
      orderBy: { coordinatesX: 'asc' }
    });
    
    console.log('\n=== NEW CONTINENT ORDER ===');
    continents.forEach((c, i) => {
      console.log(`${i+1}. ${c.name} (X: ${c.coordinatesX})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrder();
