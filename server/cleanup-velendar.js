const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupVelendarDuplicates() {
  try {
    console.log('🧹 Cleaning up Velendar duplicate cities...');
    
    const region = await prisma.location.findFirst({ 
      where: { name: 'Regno di Velendar', tier: 'REGION' }
    });
    
    if (!region) {
      console.log('❌ Regno di Velendar region not found');
      return;
    }
    
    // Get all cities
    const cities = await prisma.location.findMany({
      where: { parentId: region.id, tier: 'CITY' },
      orderBy: { population: 'desc' }
    });
    
    console.log(`Found ${cities.length} cities`);
    
    // Group by name and keep only the highest population for each
    const cityGroups = {};
    cities.forEach(city => {
      if (!cityGroups[city.name] || city.population > cityGroups[city.name].population) {
        cityGroups[city.name] = city;
      }
    });
    
    const citiesToKeep = Object.values(cityGroups);
    const citiesToDelete = cities.filter(city => !citiesToKeep.includes(city));
    
    console.log(`Keeping ${citiesToKeep.length} unique cities`);
    console.log(`Deleting ${citiesToDelete.length} duplicate cities`);
    
    // Delete duplicates
    for (const city of citiesToDelete) {
      await prisma.location.delete({ where: { id: city.id } });
      console.log(`🗑️ Deleted duplicate: ${city.name} (${city.population?.toLocaleString() || 'N/A'} pop)`);
    }
    
    // Show final result
    console.log('\n✅ Final Velendar cities:');
    citiesToKeep.forEach(city => {
      const pop = city.population ? city.population.toLocaleString() : 'N/A';
      console.log(`  - ${city.name} (${pop} pop)`);
    });
    
    console.log('🎉 Cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupVelendarDuplicates();
