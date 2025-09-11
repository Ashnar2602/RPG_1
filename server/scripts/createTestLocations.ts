import { prisma } from '../src/utils/prisma.js';

async function createTestLocations() {
  console.log('🗺️ Creating Test Locations for Map System...\n');

  try {
    // Check if locations already exist
    const existingLocations = await prisma.location.findMany();
    if (existingLocations.length > 0) {
      console.log(`ℹ️  Found ${existingLocations.length} existing locations. Skipping creation.`);
      return;
    }

    console.log('📍 Creating world locations...');

    // 1. Main Continent - Valle Profonda (Starting Area)
    const valliProfonda = await prisma.location.create({
      data: {
        name: 'Valle Profonda',
        description: 'Una valle tranquilla abitata principalmente da Elfi, circondata da montagne e foreste rigogliose.',
        type: 'VILLAGE',
        x: 100,
        y: 100,
        z: 0,
        isStartArea: true,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 50
      }
    });

    // 2. Montagne Naniche (Nord)
    const montagneNaniche = await prisma.location.create({
      data: {
        name: 'Montagne Naniche',
        description: 'Maestose montagne dove i Nani hanno scavato le loro città sotterranee. Ricche di minerali preziosi.',
        type: 'MOUNTAIN',
        x: 100,
        y: 300,
        z: 150,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 30
      }
    });

    // 3. Fortezza di Pietraferrata (Città Nanica)
    const fortezzaPietraferrata = await prisma.location.create({
      data: {
        name: 'Fortezza di Pietraferrata',
        description: 'La grande cittadella nanica scavata nel cuore della montagna. Centro del commercio minerario.',
        type: 'CITY',
        x: 120,
        y: 320,
        z: 100,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 100,
        parentId: montagneNaniche.id
      }
    });

    // 4. Foreste Elfiche (Ovest)
    const foresteElfiche = await prisma.location.create({
      data: {
        name: 'Foreste Elfiche Occidentali',
        description: 'Antiche foreste magiche protette dagli Elfi. Gli alberi sussurrano segreti del passato.',
        type: 'FOREST',
        x: 0,
        y: 100,
        z: 0,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 40
      }
    });

    // 5. Sorgente della Luna (Luogo Sacro Elfico)
    const sorgenteLuna = await prisma.location.create({
      data: {
        name: 'Sorgente della Luna',
        description: 'Una sorgente sacra dove la luce lunare crea incantesimi naturali. Luogo di meditazione elfica.',
        type: 'TEMPLE',
        x: -50,
        y: 150,
        z: 10,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 20,
        parentId: foresteElfiche.id
      }
    });

    // 6. Terre Desolate (Est)
    const terreDesolate = await prisma.location.create({
      data: {
        name: 'Terre Desolate',
        description: 'Regioni aride e pericolose dove creature selvagge vagano liberamente. Non per principianti.',
        type: 'DESERT',
        x: 300,
        y: 100,
        z: 0,
        isStartArea: false,
        isSafeZone: false,
        isPvpEnabled: true,
        maxPlayers: 25
      }
    });

    // 7. Rovine del Tempio Perduto
    const rovineTempioPrerduto = await prisma.location.create({
      data: {
        name: 'Rovine del Tempio Perduto',
        description: 'Antiche rovine di una civiltà dimenticata. Qui si celano tesori ma anche pericoli mortali.',
        type: 'RUINS',
        x: 350,
        y: 80,
        z: 0,
        isStartArea: false,
        isSafeZone: false,
        isPvpEnabled: true,
        maxPlayers: 15,
        parentId: terreDesolate.id
      }
    });

    // 8. Porto Umano (Sud)
    const portoUmano = await prisma.location.create({
      data: {
        name: 'Porto di Marevento',
        description: 'Vivace porto umano dove mercanti di tutto il mondo si incontrano per commerciare.',
        type: 'TOWN',
        x: 200,
        y: 0,
        z: 0,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 80
      }
    });

    // 9. Dungeon Sotterraneo
    const dungeonProfondo = await prisma.location.create({
      data: {
        name: 'Grotte Profonde',
        description: 'Un complesso sistema di grotte abitate da creature pericolose. Solo per avventurieri esperti.',
        type: 'DUNGEON',
        x: 150,
        y: 50,
        z: -50,
        isStartArea: false,
        isSafeZone: false,
        isPvpEnabled: false,
        maxPlayers: 10,
        parentId: valliProfonda.id
      }
    });

    // 10. Villaggio degli Gnomi
    const villaggioGnomi = await prisma.location.create({
      data: {
        name: 'Villaggio di Ingranaggia',
        description: 'Un piccolo villaggio di Gnomi inventori. Le loro macchine magiche creano meraviglie e caos.',
        type: 'VILLAGE',
        x: 80,
        y: 200,
        z: 0,
        isStartArea: false,
        isSafeZone: true,
        isPvpEnabled: false,
        maxPlayers: 25
      }
    });

    console.log('✅ Successfully created test locations:');
    console.log(`🏘️  ${valliProfonda.name} - Starting Area (Safe Zone)`);
    console.log(`🏔️  ${montagneNaniche.name} - Mountain Region`);
    console.log(`🏰    └─ ${fortezzaPietraferrata.name} - Dwarven City`);
    console.log(`🌳  ${foresteElfiche.name} - Forest Region`);
    console.log(`⛪    └─ ${sorgenteLuna.name} - Sacred Temple`);
    console.log(`🏜️  ${terreDesolate.name} - Dangerous Zone (PvP)`);
    console.log(`🏛️    └─ ${rovineTempioPrerduto.name} - Ancient Ruins`);
    console.log(`🚢  ${portoUmano.name} - Trading Hub`);
    console.log(`⚔️  ${dungeonProfondo.name} - Underground Dungeon`);
    console.log(`🔧  ${villaggioGnomi.name} - Gnome Village`);

    // Create some spawn points
    console.log('\n📍 Creating spawn points...');
    
    // NPCs in Valle Profonda
    await prisma.spawnPoint.create({
      data: {
        locationId: valliProfonda.id,
        entityType: 'npc',
        x: 105,
        y: 105,
        z: 0,
        respawnTime: 0 // NPCs don't respawn
      }
    });

    // Monsters in Terre Desolate
    await prisma.spawnPoint.create({
      data: {
        locationId: terreDesolate.id,
        entityType: 'monster',
        x: 320,
        y: 120,
        z: 0,
        respawnTime: 300 // 5 minutes
      }
    });

    // Resources in Montagne Naniche
    await prisma.spawnPoint.create({
      data: {
        locationId: montagneNaniche.id,
        entityType: 'resource',
        x: 110,
        y: 310,
        z: 120,
        respawnTime: 600 // 10 minutes
      }
    });

    console.log('✅ Spawn points created successfully');

    // Now create some test NPCs
    console.log('\n👥 Creating test NPCs...');

    // Mayor of Valle Profonda
    await prisma.nPC.create({
      data: {
        name: 'Eldara Fogliaverde',
        description: 'Sindaco del villaggio elfico, saggia e accogliente verso i nuovi arrivati.',
        type: 'QUEST_GIVER',
        race: 'ELF',
        level: 15,
        health: 200,
        damage: 5,
        defense: 10,
        locationId: valliProfonda.id,
        x: 105,
        y: 105,
        z: 0,
        facing: 0,
        isAggressive: false,
        patrolRadius: 5,
        goldDrop: 0,
        expDrop: 0
      }
    });

    // Guard in Fortezza
    await prisma.nPC.create({
      data: {
        name: 'Guardia Martello di Ferro',
        description: 'Una robusta guardia nanica che protegge l\'ingresso della fortezza.',
        type: 'GUARD',
        race: 'DWARF',
        level: 20,
        health: 300,
        damage: 25,
        defense: 20,
        locationId: fortezzaPietraferrata.id,
        x: 118,
        y: 318,
        z: 100,
        facing: 180,
        isAggressive: false,
        patrolRadius: 10,
        goldDrop: 0,
        expDrop: 0
      }
    });

    // Merchant in Porto
    await prisma.nPC.create({
      data: {
        name: 'Mercante Vela Dorata',
        description: 'Un mercante umano che commercia oggetti esotici da terre lontane.',
        type: 'MERCHANT',
        race: 'HUMAN',
        level: 12,
        health: 150,
        damage: 8,
        defense: 5,
        locationId: portoUmano.id,
        x: 205,
        y: 5,
        z: 0,
        facing: 90,
        isAggressive: false,
        patrolRadius: 3,
        goldDrop: 0,
        expDrop: 0
      }
    });

    // Monster in Dungeon
    await prisma.nPC.create({
      data: {
        name: 'Goblin delle Profondità',
        description: 'Una creatura malvagia che dimora nelle grotte buie.',
        type: 'MONSTER',
        race: 'ORC', // Using ORC as closest to Goblin
        level: 8,
        health: 80,
        damage: 15,
        defense: 5,
        locationId: dungeonProfondo.id,
        x: 155,
        y: 55,
        z: -45,
        facing: 0,
        isAggressive: true,
        patrolRadius: 15,
        goldDrop: 25,
        expDrop: 50
      }
    });

    console.log('✅ Test NPCs created successfully');
    console.log('\n🎮 Map system ready for testing!');

  } catch (error) {
    console.error('❌ Failed to create test locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the location creation
createTestLocations();
