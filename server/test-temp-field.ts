import { prisma } from './src/utils/prisma.js';

async function testTemporaryPasswordField() {
  try {
    // Test con query SQL diretta per verificare se il campo esiste
    const result = await prisma.$queryRaw`
      SELECT username, email, "isTemporaryPassword" 
      FROM users 
      WHERE username = 'testuser'
      LIMIT 1
    `;
    
    console.log('📊 Database query result:', result);
    
    // Test con query Prisma normale (senza il campo per ora)
    const user = await prisma.user.findUnique({
      where: { username: 'testuser' },
      select: {
        username: true,
        email: true
      }
    });
    
    console.log('🔍 Prisma query result:', user);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testTemporaryPasswordField();
