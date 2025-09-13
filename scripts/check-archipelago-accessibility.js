const { PrismaClient } = require('@prisma/client');

async function checkArchipelagoAccessibility() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking Arcipelago accessibility...\n');
    
    // Find archipelago and its regions
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            isAccessible: true,
            tier: true
          }
        }
      }
    });
    
    if (!archipelago) {
      console.log('❌ Archipelago not found!');
      return;
    }
    
    console.log(`🏝️ ${archipelago.name}`);
    console.log(`   Accessible: ${archipelago.isAccessible}`);
    console.log(`   Regions: ${archipelago.children.length}\n`);
    
    for (const region of archipelago.children) {
      console.log(`   📍 ${region.name}`);
      console.log(`      ID: ${region.id}`);
      console.log(`      Tier: ${region.tier}`);
      console.log(`      Accessible: ${region.isAccessible}`);
      console.log('');
    }
    
    // Check if any regions are not accessible
    const inaccessibleRegions = archipelago.children.filter(r => !r.isAccessible);
    if (inaccessibleRegions.length > 0) {
      console.log('❌ PROBLEM FOUND: Some regions are not accessible:');
      inaccessibleRegions.forEach(r => {
        console.log(`   - ${r.name} (${r.id}): isAccessible = ${r.isAccessible}`);
      });
    } else {
      console.log('✅ All regions are accessible');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArchipelagoAccessibility();
