// Fix Western Continent Location Hierarchy
// Problem: Settlements are directly under regions instead of under cities

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixGnomiHierarchy() {
  console.log('🔧 Fixing Regno Gnomesco hierarchy...');

  try {
    // Step 1: Find the region
    const gnomiRegion = await prisma.location.findFirst({
      where: {
        name: 'Regno Gnomesco di Nôr-Velyr',
        tier: 'REGION'
      }
    });

    if (!gnomiRegion) {
      console.error('❌ Gnomi region not found');
      return;
    }

    console.log(`✅ Found region: ${gnomiRegion.name} (${gnomiRegion.id})`);

    // Step 2: Find cities under this region
    const cities = await prisma.location.findMany({
      where: {
        parentId: gnomiRegion.id,
        tier: 'CITY',
        name: { in: ['Nôr-Velyr', 'Gearwood', 'Crystalspire', 'Clockwork'] }
      }
    });

    console.log(`✅ Found ${cities.length} cities:`, cities.map(c => c.name));

    // Step 3: Find settlements that need to be moved
    const settlements = await prisma.location.findMany({
      where: {
        parentId: gnomiRegion.id,
        tier: 'LOCATION',
        name: { in: ['Steamvale', 'Tinkertown', 'Alchemyville', 'Lightforge', 'Windmill Heights', 'Cogwheel Station'] }
      }
    });

    console.log(`✅ Found ${settlements.length} settlements to reassign:`, settlements.map(s => s.name));

    // Step 4: Create city lookup
    const cityLookup = {};
    cities.forEach(city => {
      cityLookup[city.name] = city.id;
    });

    // Step 5: Reassign settlements to appropriate cities
    const reassignments = [
      // Nôr-Velyr (Capital): Central services
      { city: 'Nôr-Velyr', settlements: ['Tinkertown', 'Alchemyville'] },
      // Gearwood (Industrial): Mechanical/industrial
      { city: 'Gearwood', settlements: ['Steamvale', 'Cogwheel Station'] },
      // Crystalspire (Energy): Light/energy related
      { city: 'Crystalspire', settlements: ['Lightforge'] },
      // Clockwork (Precision): Measurement/precision
      { city: 'Clockwork', settlements: ['Windmill Heights'] }
    ];

    for (const group of reassignments) {
      const cityId = cityLookup[group.city];
      if (!cityId) {
        console.error(`❌ City ${group.city} not found`);
        continue;
      }

      for (const settlementName of group.settlements) {
        const settlement = settlements.find(s => s.name === settlementName);
        if (settlement) {
          await prisma.location.update({
            where: { id: settlement.id },
            data: { parentId: cityId }
          });
          console.log(`✅ Moved ${settlementName} under ${group.city}`);
        } else {
          console.warn(`⚠️  Settlement ${settlementName} not found`);
        }
      }
    }

    // Step 6: Verify the new structure
    console.log('\n🔍 Verifying new structure...');
    
    const updatedCities = await prisma.location.findMany({
      where: {
        parentId: gnomiRegion.id,
        tier: 'CITY'
      },
      include: {
        children: {
          where: { tier: 'LOCATION' }
        }
      }
    });

    updatedCities.forEach(city => {
      console.log(`🏛️  ${city.name}: ${city.children.length} settlements`);
      city.children.forEach(settlement => {
        console.log(`   └── ${settlement.name}`);
      });
    });

    console.log('\n✅ Gnomi hierarchy fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing hierarchy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixGnomiHierarchy();
