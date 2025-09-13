const { PrismaClient } = require('@prisma/client');

async function verifyArchipelagoStructure() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying Arcipelago Centrale structure...\n');
    
    // Find the archipelago continent
    const archipelago = await prisma.location.findUnique({
      where: { id: 'continent_archipelago' },
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
    
    if (!archipelago) {
      console.log('❌ Archipelago not found!');
      return;
    }
    
    console.log(`🏝️ ${archipelago.name}`);
    console.log(`   Population: ${archipelago.population?.toLocaleString()}`);
    console.log(`   Regions: ${archipelago.children.length}\n`);
    
    let totalCities = 0;
    let totalLocations = 0;
    
    for (const region of archipelago.children) {
      const cities = region.children.filter(c => c.tier === 'CITY');
      const regionLocations = cities.reduce((acc, city) => acc + city.children.length, 0);
      
      totalCities += cities.length;
      totalLocations += regionLocations;
      
      console.log(`   📍 ${region.name}`);
      console.log(`      Population: ${region.population?.toLocaleString()}`);
      console.log(`      Cities: ${cities.length}`);
      console.log(`      Total Locations: ${regionLocations}`);
      
      for (const city of cities) {
        console.log(`         🏙️ ${city.name} (${city.population?.toLocaleString()}) - ${city.children.length} locations`);
      }
      console.log('');
    }
    
    const totalPopulation = archipelago.children.reduce((acc, region) => acc + (region.population || 0), 0);
    
    console.log('📊 SUMMARY:');
    console.log(`- Continent: 1 (Arcipelago Centrale)`);
    console.log(`- Regions: ${archipelago.children.length}`);
    console.log(`- Cities: ${totalCities}`);
    console.log(`- Locations: ${totalLocations}`);
    console.log(`- Total Population: ${totalPopulation.toLocaleString()}`);
    console.log(`- Total Database Entries: ${1 + archipelago.children.length + totalCities + totalLocations}`);
    
    // Verify hierarchy integrity
    console.log('\n🔧 HIERARCHY VERIFICATION:');
    let hierarchyOk = true;
    
    for (const region of archipelago.children) {
      if (region.tier !== 'REGION') {
        console.log(`❌ ${region.name} has wrong tier: ${region.tier} (should be REGION)`);
        hierarchyOk = false;
      }
      
      for (const city of region.children) {
        if (city.tier !== 'CITY') {
          console.log(`❌ ${city.name} has wrong tier: ${city.tier} (should be CITY)`);
          hierarchyOk = false;
        }
        
        for (const location of city.children) {
          if (location.tier !== 'LOCATION') {
            console.log(`❌ ${location.name} has wrong tier: ${location.tier} (should be LOCATION)`);
            hierarchyOk = false;
          }
        }
      }
    }
    
    if (hierarchyOk) {
      console.log('✅ Hierarchy structure is correct!');
    }
    
    console.log('\n🎉 Arcipelago Centrale verification completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyArchipelagoStructure();
