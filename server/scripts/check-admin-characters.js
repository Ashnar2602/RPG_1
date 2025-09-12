const { PrismaClient } = require('@prisma/client');

async function checkAdminCharacters() {
  const prisma = new PrismaClient();
  
  try {
    // Trova l'utente Admin
    const adminUser = await prisma.user.findUnique({
      where: { username: 'Admin' }
    });
    
    if (!adminUser) {
      console.log('Utente Admin non trovato');
      return;
    }
    
    // Conta i personaggi dell'utente Admin
    const characterCount = await prisma.character.count({
      where: {
        userId: adminUser.id
      }
    });
    
    console.log(`L'utente Admin ha attualmente ${characterCount} personaggi`);
    console.log(`Slot disponibili: ${6 - characterCount} su 6`);
    
  } catch (error) {
    console.error('Errore durante la verifica:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminCharacters();
