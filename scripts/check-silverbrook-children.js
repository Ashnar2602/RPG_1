const { PrismaClient } = require('@prisma/client');

async function checkSilverbrookChildren() {
  const prisma = new PrismaClient();
  
  try {
    // Find Silverbrook
    const silverbrook = await prisma.location.findFirst({
      where: { name: 'Silverbrook' }
    });
    
    if (!silverbrook) {
      console.log('Silverbrook not found!');
      return;
    }
    
    console.log('Silverbrook found:', silverbrook.name, 'ID:', silverbrook.id);
    
    // Find all locations with Silverbrook as parent
    const children = await prisma.location.findMany({
      where: { parentId: silverbrook.id },
      select: { name: true, tier: true, id: true }
    });
    
    console.log(`Children of Silverbrook (${children.length}):`);
    children.forEach(child => {
      console.log(`- ${child.name} (${child.tier}) - ID: ${child.id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSilverbrookChildren();
