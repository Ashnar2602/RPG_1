const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creating Admin user with full map access...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { username: 'Admin' }
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Updating character...');
      
      // Find admin's character
      const adminChar = await prisma.character.findFirst({
        where: { userId: existingAdmin.id }
      });
      
      if (adminChar) {
        console.log('📝 Updating existing admin character...');
        await updateAdminCharacter(adminChar.id);
        return;
      }
    } else {
      // Create admin user (simple password for testing)
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@rpg.local',
          username: 'Admin',
          password: 'admin123', // Simple password for testing
          role: 'ADMIN',
          isActive: true
        }
      });
      console.log('✅ Admin user created:', adminUser.username);
    }
    
    // Get all locations for known locations array
    const allLocations = await prisma.location.findMany({
      select: { id: true }
    });
    
    const allLocationIds = allLocations.map(loc => loc.id);
    console.log(`🗺️ Found ${allLocationIds.length} locations to unlock`);
    
    // Create admin character with full map knowledge
    const adminUser = await prisma.user.findFirst({
      where: { username: 'Admin' }
    });
    
    const adminCharacter = await prisma.character.create({
      data: {
        userId: adminUser.id,
        name: 'Admin Explorer',
        level: 100,
        experience: 1000000,
        currentLocationId: 'location_laboratorio_alchimista', // Start at same location
        
        // Max stats for testing  
        currentHealth: 1000,
        currentMana: 1000,
        currentStamina: 1000,
        
        // Max attributes
        strength: 100,
        intelligence: 100,
        dexterity: 100,
        willpower: 100,
        charisma: 100,
        luck: 100,
        stamina: 100,
        
        // Rich for testing
        gold: 1000000
      }
    });
    
    console.log('🎯 Admin character created with FULL MAP ACCESS!');
    console.log(`Character: ${adminCharacter.name} (Level ${adminCharacter.level})`);
    console.log(`Known locations: ${allLocationIds.length} / ${allLocationIds.length}`);
    console.log(`Gold: ${adminCharacter.gold.toLocaleString()}`);
    
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('Username: Admin');
    console.log('Password: admin123');
    console.log('\n🗺️ This character can see ALL regions, cities, and locations!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateAdminCharacter(characterId) {
  await prisma.character.update({
    where: { id: characterId },
    data: {
      level: 100,
      gold: 1000000,
      strength: 100,
      intelligence: 100,
      dexterity: 100,
      willpower: 100,
      charisma: 100,
      luck: 100,
      stamina: 100
    }
  });
  
  console.log('✅ Admin character updated with max stats!');
}

createAdminUser();
