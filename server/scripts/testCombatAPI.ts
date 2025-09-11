import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'combattest@rpg.test',
  username: 'combattest',
  password: 'testpassword123'
};

let authToken = '';
let testCharacters: any[] = [];

async function testCombatAPI() {
  console.log('🚀 Testing Combat API Endpoints...\n');

  try {
    // 1. Register test user (if not exists) and login
    console.log('🔐 Setting up authentication...');
    
    // Try to register (might fail if user exists)
    try {
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
      });
      console.log('✅ Test user registered');
    } catch (error) {
      console.log('ℹ️  Test user already exists');
    }

    // Login to get token
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Failed to login');
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Authentication successful\n');

    // 2. Get characters
    console.log('👥 Fetching characters...');
    const charactersResponse = await fetch(`${BASE_URL}/api/characters`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!charactersResponse.ok) {
      throw new Error('Failed to fetch characters');
    }

    testCharacters = await charactersResponse.json();
    console.log(`✅ Found ${testCharacters.length} characters\n`);

    if (testCharacters.length < 2) {
      console.log('❌ Need at least 2 characters for combat testing');
      return;
    }

    const attacker = testCharacters[0];
    const target = testCharacters[1];

    // 3. Test Combat Action Endpoint
    console.log('⚔️  Testing Combat Action...');
    console.log(`   ${attacker.name} attacks ${target.name}`);

    const combatResponse = await fetch(`${BASE_URL}/api/combat/action`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attackerId: attacker.id,
        targetId: target.id,
        action: 'basic_attack'
      })
    });

    if (!combatResponse.ok) {
      const errorText = await combatResponse.text();
      throw new Error(`Combat action failed: ${errorText}`);
    }

    const combatResult = await combatResponse.json();
    console.log('✅ Combat Action Result:', {
      damageDealt: combatResult.damage_dealt,
      isCritical: combatResult.is_critical,
      effectsApplied: combatResult.effects_applied
    });

    // 4. Test Get Combat History
    console.log('\n📜 Testing Combat History...');
    const historyResponse = await fetch(`${BASE_URL}/api/combat/history/${attacker.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (historyResponse.ok) {
      const history = await historyResponse.json();
      console.log(`✅ Combat history retrieved: ${history.length} entries`);
    }

    // 5. Test Get Available Abilities (if Mage exists)
    const mage = testCharacters.find(char => char.characterClass === 'MAGE');
    if (mage) {
      console.log('\n🔮 Testing Available Abilities for Mage...');
      const abilitiesResponse = await fetch(`${BASE_URL}/api/combat/abilities/${mage.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (abilitiesResponse.ok) {
        const abilities = await abilitiesResponse.json();
        console.log('✅ Available abilities:', abilities);

        // Test Fireball spell
        if (abilities.includes('fireball')) {
          console.log('\n🔥 Testing Fireball spell...');
          const fireballResponse = await fetch(`${BASE_URL}/api/combat/action`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              attackerId: mage.id,
              targetId: target.id,
              action: 'fireball'
            })
          });

          if (fireballResponse.ok) {
            const fireballResult = await fireballResponse.json();
            console.log('✅ Fireball Result:', {
              damageDealt: fireballResult.damage_dealt,
              isCritical: fireballResult.is_critical,
              effectsApplied: fireballResult.effects_applied
            });
          }
        }
      }
    }

    // 6. Test Heal ability (if Cleric exists)
    const cleric = testCharacters.find(char => char.characterClass === 'CLERIC');
    if (cleric) {
      console.log('\n💚 Testing Heal ability...');
      const healResponse = await fetch(`${BASE_URL}/api/combat/action`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attackerId: cleric.id,
          targetId: cleric.id, // Self-heal
          action: 'heal'
        })
      });

      if (healResponse.ok) {
        const healResult = await healResponse.json();
        console.log('✅ Heal Result:', {
          healingDone: Math.abs(healResult.damage_dealt),
          isCritical: healResult.is_critical
        });
      }
    }

    console.log('\n🎉 All Combat API tests completed successfully!');

  } catch (error) {
    console.error('❌ Combat API Test Failed:', error);
  }
}

// Run the API tests
testCombatAPI();
