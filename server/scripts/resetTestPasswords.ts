import { prisma } from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function resetTestPasswords() {
  try {
    console.log('🔑 Resetting test user passwords to known values...\n');
    
    // Define test passwords
    const testPasswords = {
      'testuser': 'test123',
      'rpgplayer': 'rpg123', 
      'combatuser': 'combat123'
    };

    const bcryptRounds = 12;
    
    for (const [username, password] of Object.entries(testPasswords)) {
      console.log(`🔐 Processing user: ${username}`);
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        console.log(`   ❌ User ${username} not found, skipping...`);
        continue;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, bcryptRounds);
      
      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      console.log(`   ✅ Password reset for ${username} → ${password}`);
    }

    console.log('\n📋 TEST CREDENTIALS SUMMARY:');
    console.log('================================');
    
    for (const [username, password] of Object.entries(testPasswords)) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          email: true,
          _count: {
            select: {
              characters: true
            }
          }
        }
      });

      if (user) {
        console.log(`👤 ${username.toUpperCase()}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: ${password}`);
        console.log(`   🧙‍♂️ Characters: ${user._count.characters}`);
        console.log('');
      }
    }

    console.log('🎮 LOGIN TESTING EXAMPLES:');
    console.log('==========================');
    console.log('# PowerShell API Testing:');
    console.log('');
    
    for (const [username, password] of Object.entries(testPasswords)) {
      console.log(`# Login ${username}`);
      console.log(`$body = @{`);
      console.log(`    username = "${username}"`);
      console.log(`    password = "${password}"`);
      console.log(`} | ConvertTo-Json`);
      console.log(`Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"`);
      console.log('');
    }

    console.log('🌐 BROWSER TESTING:');
    console.log('===================');
    console.log('Open: http://localhost:5173');
    console.log('Use any of the credentials above to login');
    console.log('');

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetTestPasswords();
