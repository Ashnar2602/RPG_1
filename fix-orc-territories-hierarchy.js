import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrcTerritoriesHierarchy() {
  try {
    console.log('⚔️ Fixing Orc Territories hierarchy...');
    
    // Find the Orc Territories region
    const region = await prisma.location.findFirst({
      where: {
        name: { contains: "Orcheschi" },
        tier: 'REGION'
      }
    });
    
    if (!region) {
      console.log('❌ Orc Territories region not found');
      return;
    }
    
    console.log(`✅ Found region: ${region.name} (${region.slug})`);
    
    // Find all cities under this region
    const cities = await prisma.location.findMany({
      where: {
        parentId: region.id,
        tier: 'CITY'
      }
    });
    
    console.log(`✅ Found ${cities.length} cities:`, cities.map(c => c.name));
    
    // Find all settlements currently under the region (should be under cities)
    const misplacedSettlements = await prisma.location.findMany({
      where: {
        parentId: region.id,
        tier: 'LOCATION'
      }
    });
    
    console.log(`✅ Found ${misplacedSettlements.length} settlements to reassign`);
    
    // Map settlements to appropriate cities based on names/themes
    const cityAssignments = {
      'Warsong Valley': ['Bonecrusher Mine', 'Wildmeat Market'],
      'Bloodmoon Camp': ['Riverclaw Outpost', 'Treeshade Village'],
      'Grimfang Stronghold': ['Thornwall Camp', 'Spiritdance Clearing'],
      'Ironbark Fortress': []
    };
    
    for (const [cityName, settlementNames] of Object.entries(cityAssignments)) {
      const city = cities.find(c => c.name === cityName);
      if (!city) {
        console.log(`⚠️ City ${cityName} not found`);
        continue;
      }
      
      for (const settlementName of settlementNames) {
        const settlement = misplacedSettlements.find(s => s.name === settlementName);
        if (settlement) {
          await prisma.location.update({
            where: { id: settlement.id },
            data: { parentId: city.id }
          });
          console.log(`✅ Moved ${settlementName} to ${cityName}`);
        } else {
          console.log(`⚠️ Settlement ${settlementName} not found`);
        }
      }
    }
    
    // Verify the new structure
    console.log('\n🔍 Verifying new structure:');
    for (const city of cities) {
      const settlements = await prisma.location.findMany({
        where: {
          parentId: city.id,
          tier: 'LOCATION'
        }
      });
      console.log(`🏛️ ${city.name}: ${settlements.length} settlements`);
      settlements.forEach(s => console.log(`   - ${s.name}`));
    }
    
    console.log('\n✅ Orc Territories hierarchy fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing Orc Territories hierarchy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrcTerritoriesHierarchy();
