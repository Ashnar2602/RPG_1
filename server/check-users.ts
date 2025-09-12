import { prisma } from './src/utils/prisma.js';

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      username: true, 
      email: true,
      createdAt: true
    }
  });
  
  console.log(`📊 Users in database (${users.length} total):`);
  users.forEach(user => {
    console.log(`- ${user.username}: ${user.email} (${user.createdAt.toLocaleDateString()})`);
  });
  
  await prisma.$disconnect();
}

checkUsers();
