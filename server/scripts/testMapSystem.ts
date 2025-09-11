import { MapService } from '../src/services/MapService.js';
import { prisma } from '../src/utils/prisma.js';

async function testMapSystem() {
  console.log('🗺️ Testing Map System...\n');

  try {
    // 1. Test getting all locations
    console.log('📍 Testing getAllLocations...');
    const allLocations = await MapService.getAllLocations();
    console.log(`✅ Found ${allLocations.length} locations`);
    
    const startArea = allLocations.find(loc => loc.isStartArea);
    console.log(`🏠 Start Area: ${startArea?.name} at (${startArea?.x}, ${startArea?.y})`);

    // 2. Get a test character to work with
    console.log('\n👤 Getting test character...');
    const testCharacter = await prisma.character.findFirst({
      select: {
        id: true,
        name: true,
        locationId: true,
        x: true,
        y: true,
        z: true,
        agility: true
      }
    });

    if (!testCharacter) {
      console.log('❌ No test characters found. Please create characters first.');
      return;
    }

    console.log(`✅ Using character: ${testCharacter.name} (${testCharacter.id})`);

    // 3. Move character to start area if not already there
    if (!testCharacter.locationId || testCharacter.locationId !== startArea?.id) {
      console.log('\n🚶 Moving character to start area...');
      const moveResult = await MapService.moveCharacter(
        testCharacter.id,
        startArea!.id,
        startArea!.x,
        startArea!.y,
        startArea!.z
      );

      if (moveResult.success) {
        console.log(`✅ Character moved to ${startArea!.name} in ${moveResult.travelTime} seconds`);
      } else {
        console.log(`❌ Failed to move character: ${moveResult.message}`);
      }
    }

    // 4. Test getting character location
    console.log('\n📍 Testing getCharacterLocation...');
    const charLocation = await MapService.getCharacterLocation(testCharacter.id);
    if (charLocation) {
      console.log(`✅ Character location: ${charLocation.location.name}`);
      console.log(`   Position: (${charLocation.character.position.x}, ${charLocation.character.position.y})`);
      console.log(`   Safe Zone: ${charLocation.location.isSafeZone ? 'Yes' : 'No'}`);
      console.log(`   Nearby Players: ${charLocation.location.nearbyPlayers.length}`);
      console.log(`   NPCs: ${charLocation.location.npcs.length}`);
    }

    // 5. Test getting accessible locations
    console.log('\n🗺️ Testing accessible locations...');
    const accessibleLocations = await MapService.getAccessibleLocations(testCharacter.id);
    console.log(`✅ Found ${accessibleLocations.length} accessible locations:`);
    
    accessibleLocations.forEach((loc, index) => {
      const distance = MapService.calculateTravelTime(
        { x: testCharacter.x, y: testCharacter.y, z: testCharacter.z },
        { x: loc.x, y: loc.y, z: loc.z },
        testCharacter.agility
      );
      console.log(`   ${index + 1}. ${loc.name} (${loc.type}) - ${distance}s travel`);
    });

    // 6. Test movement to different location
    if (accessibleLocations.length > 1) {
      const targetLocation = accessibleLocations.find(loc => loc.id !== startArea?.id);
      if (targetLocation) {
        console.log(`\n🚶 Testing movement to ${targetLocation.name}...`);
        const moveResult = await MapService.moveCharacter(
          testCharacter.id,
          targetLocation.id
        );

        if (moveResult.success) {
          console.log(`✅ Successfully moved to ${targetLocation.name}`);
          console.log(`   Travel time: ${moveResult.travelTime} seconds`);
          console.log(`   New position: (${moveResult.newPosition.x}, ${moveResult.newPosition.y})`);
        } else {
          console.log(`❌ Movement failed: ${moveResult.message}`);
        }
      }
    }

    // 7. Test exploration data
    console.log('\n🔍 Testing exploration data...');
    const explorationData = await MapService.getCharacterExploration(testCharacter.id);
    console.log(`✅ Found ${explorationData.length} quadrants around character`);
    
    const exploredCount = explorationData.filter(q => q.explored).length;
    console.log(`   Explored: ${exploredCount}/${explorationData.length} quadrants`);
    
    explorationData.slice(0, 3).forEach(quadrant => {
      console.log(`   ${quadrant.coordinates}: ${quadrant.explored ? '✅ Explored' : '❌ Unexplored'} - ${quadrant.dangerLevel} danger`);
    });

    // 8. Test specific location details
    console.log('\n🏰 Testing location details...');
    const locationDetails = await MapService.getLocationById(startArea!.id);
    if (locationDetails) {
      console.log(`✅ Location: ${locationDetails.name}`);
      console.log(`   Type: ${locationDetails.type}`);
      console.log(`   Current Players: ${locationDetails.currentPlayers}/${locationDetails.maxPlayers}`);
      console.log(`   Children: ${locationDetails.children?.length || 0}`);
      console.log(`   NPCs: ${locationDetails.npcs?.length || 0}`);
      console.log(`   Spawn Points: ${locationDetails.spawns?.length || 0}`);
    }

    console.log('\n🎉 Map System Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Map System Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testMapSystem();
