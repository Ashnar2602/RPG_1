const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugMapData() {
  try {
    console.log('🔍 MAP DEBUG - Checking complete data structure...\n');

    // 1. All continents
    const continents = await prisma.worldLocation.findMany({
      where: { tier: 'CONTINENT' },
      select: {
        id: true,
        name: true,
        tier: true,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      }
    });

    console.log('📍 CONTINENTS:');
    continents.forEach(cont => {
      console.log(`  - ${cont.name} (${cont.id})`);
      console.log(`    isAccessible: ${cont.isAccessible}, isKnown: ${cont.isKnown}, isDiscovered: ${cont.isDiscovered}`);
    });

    // 2. Arcipelago regions
    console.log('\n🏝️ ARCIPELAGO CENTRALE REGIONS:');
    const archipelagoRegions = await prisma.worldLocation.findMany({
      where: { 
        tier: 'REGION',
        parent: { name: 'Arcipelago Centrale' }
      },
      select: {
        id: true,
        name: true,
        tier: true,
        isAccessible: true,
        isKnown: true,
        isDiscovered: true
      }
    });

    archipelagoRegions.forEach(region => {
      console.log(`  - ${region.name} (${region.id})`);
      console.log(`    isAccessible: ${region.isAccessible}, isKnown: ${region.isKnown}, isDiscovered: ${region.isDiscovered}`);
    });

    // 3. Total counts per tier
    console.log('\n📊 TOTAL COUNTS:');
    const counts = await prisma.worldLocation.groupBy({
      by: ['tier'],
      _count: {
        id: true
      }
    });

    counts.forEach(count => {
      console.log(`  ${count.tier}: ${count._count.id}`);
    });

    // 4. Simulate API response structure
    console.log('\n🌐 API HIERARCHY SIMULATION:');
    const hierarchyData = await prisma.worldLocation.findMany({
      where: { tier: 'CONTINENT' },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true
              }
            }
          }
        }
      }
    });

    hierarchyData.forEach(continent => {
      console.log(`\n🌍 ${continent.name}:`);
      console.log(`  - ID: ${continent.id}`);
      console.log(`  - Accessible: ${continent.isAccessible}`);
      console.log(`  - Children: ${continent.children.length}`);
      
      if (continent.name === 'Arcipelago Centrale') {
        console.log(`  🔍 DETAILED ARCHIPELAGO BREAKDOWN:`);
        continent.children.forEach(region => {
          console.log(`    🏝️ ${region.name}:`);
          console.log(`      - ID: ${region.id}`);
          console.log(`      - Accessible: ${region.isAccessible}`);
          console.log(`      - Cities: ${region.children.length}`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMapData();
