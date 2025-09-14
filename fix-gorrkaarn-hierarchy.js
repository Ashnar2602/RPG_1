import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixGorrKaarnHierarchy() {
  try {
    console.log('🏔️ Fixing Gorr\'Kaarn Highlands hierarchy...');
    
    // Find the Gorr'Kaarn region  
    const region = await prisma.location.findFirst({
      where: {
        name: { contains: "Gorr'Kaarn" },
        tier: 'REGION'
      }
    });
    
    if (!region) {
      console.log('❌ Gorr\'Kaarn region not found');
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
      'Bloodstone Quarry': ['Bonegrinder Camp'],
      'Ironhorn Forge': ['Battlehorn Cemetery', 'Ragehammer Village'],
      'Skullpeak Stronghold': ['Windcutter Pass'],
      'Thunderhorn Camp': ['Cliffdweller Outpost', 'Stormwatch Tower']
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
    
    console.log('\n✅ Gorr\'Kaarn Highlands hierarchy fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing Gorr\'Kaarn hierarchy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixGorrKaarnHierarchy();
