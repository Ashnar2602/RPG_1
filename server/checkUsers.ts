import { prisma } from './src/utils/prisma.js';

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true
      }
    });
    
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkUsers();
