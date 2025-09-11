import { prisma } from './src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    // Test with username
    const user = await prisma.user.findUnique({
      where: { username: 'testuser' },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        isActive: true
      }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive
    });
    
    // Test password
    const passwordMatch = await bcrypt.compare('combat123', user.password);
    console.log('Password match:', passwordMatch);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testLogin();
