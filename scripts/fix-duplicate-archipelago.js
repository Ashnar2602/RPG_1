const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeDuplicateArchipelago() {
  try {
    console.log('🧹 REMOVING DUPLICATE ARCHIPELAGO...\n');

    // First, check what we have
    const archipelagos = await prisma.worldLocation.findMany({
      where: { 
        name: 'Arcipelago Centrale',
        tier: 'CONTINENT'
      },
      include: {
        children: true
      }
    });

    console.log(`Found ${archipelagos.length} Arcipelago Centrale entries:`);
    archipelagos.forEach(arch => {
      console.log(`- ID: ${arch.id}, Children: ${arch.children.length}, Created: ${arch.createdAt}`);
    });

    // Find the empty one (no children)
    const emptyArchipelago = archipelagos.find(arch => arch.children.length === 0);
    const fullArchipelago = archipelagos.find(arch => arch.children.length > 0);

    if (emptyArchipelago && fullArchipelago) {
      console.log(`\n🗑️ Deleting empty archipelago: ${emptyArchipelago.id}`);
      console.log(`✅ Keeping full archipelago: ${fullArchipelago.id} (${fullArchipelago.children.length} children)`);

      await prisma.worldLocation.delete({
        where: { id: emptyArchipelago.id }
      });

      console.log('✅ Duplicate removed successfully!');
    } else {
      console.log('⚠️ Could not identify which archipelago to remove');
    }

    // Verify the result
    const remaining = await prisma.worldLocation.findMany({
      where: { 
        name: 'Arcipelago Centrale',
        tier: 'CONTINENT'
      },
      include: {
        children: true
      }
    });

    console.log(`\n📊 Final result: ${remaining.length} Arcipelago Centrale remaining`);
    remaining.forEach(arch => {
      console.log(`- ID: ${arch.id}, Children: ${arch.children.length}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicateArchipelago();
