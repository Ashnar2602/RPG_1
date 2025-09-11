const fetch = require('node-fetch').default;

const test = async () => {
  console.log('🗺️ Testing Map API Endpoints...\n');
  
  const BASE_URL = 'http://localhost:5000';
  
  try {
    // 1. Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'combatuser',
        password: 'testpass123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login successful\n');

    // 2. Get characters for the logged in user
    console.log('👥 Getting characters...');
    const charactersResponse = await fetch(`${BASE_URL}/api/characters`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!charactersResponse.ok) {
      throw new Error('Failed to get characters');
    }

    const charactersData = await charactersResponse.json();
    const characters = charactersData.data || charactersData;
    
    if (!characters || characters.length === 0) {
      throw new Error('No characters found for this user');
    }
    
    const testCharacter = characters[0];
    console.log(`✅ Using character: ${testCharacter.name} (${testCharacter.id})\n`);

    // 3. Test GET /api/map/locations
    console.log('🗺️ Testing GET /api/map/locations...');
    const locationsResponse = await fetch(`${BASE_URL}/api/map/locations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (locationsResponse.ok) {
      const locationsData = await locationsResponse.json();
      console.log(`✅ Found ${locationsData.data.locations.length} locations`);
      
      const startArea = locationsData.data.locations.find(loc => loc.isStartArea);
      console.log(`   Start Area: ${startArea.name} (${startArea.type})`);
    } else {
      console.log('❌ Failed to get locations');
    }

    // 4. Test GET /api/map/characters/:characterId/location
    console.log('\n📍 Testing GET /api/map/characters/:characterId/location...');
    const charLocationResponse = await fetch(`${BASE_URL}/api/map/characters/${testCharacter.id}/location`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (charLocationResponse.ok) {
      const charLocationData = await charLocationResponse.json();
      console.log(`✅ Character location: ${charLocationData.data.location.name}`);
      console.log(`   Safe Zone: ${charLocationData.data.location.isSafeZone}`);
      console.log(`   NPCs: ${charLocationData.data.location.npcs.length}`);
    } else {
      console.log('❌ Failed to get character location');
    }

    // 5. Test GET /api/map/characters/:characterId/accessible
    console.log('\n🚶 Testing GET /api/map/characters/:characterId/accessible...');
    const accessibleResponse = await fetch(`${BASE_URL}/api/map/characters/${testCharacter.id}/accessible`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (accessibleResponse.ok) {
      const accessibleData = await accessibleResponse.json();
      console.log(`✅ Found ${accessibleData.data.locations.length} accessible locations:`);
      
      accessibleData.data.locations.slice(0, 3).forEach((loc, index) => {
        console.log(`   ${index + 1}. ${loc.name} (${loc.type}) - ${loc.currentPlayers || 0} players`);
      });

      // 6. Test movement to accessible location
      if (accessibleData.data.locations.length > 1) {
        const targetLocation = accessibleData.data.locations[1];
        console.log(`\n🚶 Testing POST /api/map/characters/:characterId/move...`);
        console.log(`   Moving to: ${targetLocation.name}`);

        const moveResponse = await fetch(`${BASE_URL}/api/map/characters/${testCharacter.id}/move`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            targetLocationId: targetLocation.id
          })
        });

        if (moveResponse.ok) {
          const moveData = await moveResponse.json();
          console.log(`✅ Movement successful!`);
          console.log(`   Travel time: ${moveData.data.movement.travelTime} seconds`);
          console.log(`   New position: (${moveData.data.movement.newPosition.x}, ${moveData.data.movement.newPosition.y})`);
        } else {
          const errorText = await moveResponse.text();
          console.log(`❌ Movement failed: ${errorText}`);
        }
      }
    } else {
      console.log('❌ Failed to get accessible locations');
    }

    // 7. Test GET /api/map/characters/:characterId/exploration
    console.log('\n🔍 Testing GET /api/map/characters/:characterId/exploration...');
    const explorationResponse = await fetch(`${BASE_URL}/api/map/characters/${testCharacter.id}/exploration`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (explorationResponse.ok) {
      const explorationData = await explorationResponse.json();
      console.log(`✅ Exploration data retrieved`);
      console.log(`   Total quadrants: ${explorationData.data.totalQuadrants}`);
      console.log(`   Explored: ${explorationData.data.exploredCount}`);
      
      // Show first few quadrants
      explorationData.data.quadrants.slice(0, 3).forEach(quadrant => {
        console.log(`   ${quadrant.coordinates}: ${quadrant.explored ? 'Explored' : 'Unexplored'} (${quadrant.dangerLevel})`);
      });
    } else {
      console.log('❌ Failed to get exploration data');
    }

    // 8. Test GET /api/map/world/overview
    console.log('\n🌍 Testing GET /api/map/world/overview...');
    const overviewResponse = await fetch(`${BASE_URL}/api/map/world/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log(`✅ World overview retrieved`);
      console.log(`   Total locations: ${overviewData.data.worldStats.totalLocations}`);
      console.log(`   Total players online: ${overviewData.data.worldStats.totalPlayers}`);
      console.log(`   Safe zones: ${overviewData.data.worldStats.safeZones}`);
      console.log(`   PvP zones: ${overviewData.data.worldStats.pvpZones}`);
      console.log(`   Location types: ${overviewData.data.worldStats.locationTypes}`);
    } else {
      console.log('❌ Failed to get world overview');
    }

    // 9. Test POST /api/map/travel/calculate
    console.log('\n⏱️ Testing POST /api/map/travel/calculate...');
    const travelCalcResponse = await fetch(`${BASE_URL}/api/map/travel/calculate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromLocation: { x: 100, y: 100, z: 0 },
        toLocation: { x: 200, y: 150, z: 0 },
        characterAgility: 15
      })
    });

    if (travelCalcResponse.ok) {
      const travelData = await travelCalcResponse.json();
      console.log(`✅ Travel time calculated: ${travelData.data.travelTime} seconds`);
      console.log(`   Agility bonus applied: ${travelData.data.characterAgility}`);
    } else {
      console.log('❌ Failed to calculate travel time');
    }

    console.log('\n🎉 All Map API tests completed!');

  } catch (error) {
    console.log(`❌ API Test Error: ${error.message}`);
  }
};

test();
