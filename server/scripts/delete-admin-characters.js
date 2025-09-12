const { PrismaClient } = require('@prisma/client');

async function deleteAdminCharacters() {
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
    
    console.log(`Trovato utente Admin con ID: ${adminUser.id}`);
    
    // Elimina tutti i personaggi dell'utente Admin
    const deletedCharacters = await prisma.character.deleteMany({
      where: {
        userId: adminUser.id
      }
    });
    
    console.log(`Eliminati ${deletedCharacters.count} personaggi dall'account Admin`);
    
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAdminCharacters();
