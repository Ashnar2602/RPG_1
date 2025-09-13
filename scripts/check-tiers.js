const { PrismaClient } = require('@prisma/client');

async function checkTiers() {
  const prisma = new PrismaClient();
  
  try {
    const locations = await prisma.location.findMany({
      select: { tier: true, name: true }
    });
    
    const tiers = [...new Set(locations.map(l => l.tier))];
    console.log('Unique tiers in database:', tiers);
    
    // Count per tier
    tiers.forEach(tier => {
      const count = locations.filter(l => l.tier === tier).length;
      console.log(`${tier}: ${count} locations`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTiers();
