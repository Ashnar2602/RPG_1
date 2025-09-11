import fetch from 'node-fetch';

async function quickAPITest() {
  console.log('🔍 Quick Combat API Test...\n');
  
  const BASE_URL = 'http://localhost:5000';
  
  try {
    // 1. Test login
    console.log('🔐 Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'combat@test.com',
        password: 'testpass123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful!\n');

    // 2. Get characters
    console.log('👥 Getting characters...');
    const charactersResponse = await fetch(`${BASE_URL}/api/characters`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!charactersResponse.ok) {
      console.log('❌ Failed to get characters');
      return;
    }

    const characters = await charactersResponse.json();
    console.log(`✅ Found ${characters.length} characters\n`);

    if (characters.length === 0) {
      console.log('❌ No characters found for testing');
      return;
    }

    // 3. Get all characters for combat testing
    const allCharactersResponse = await fetch(`${BASE_URL}/api/characters/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let allCharacters = [];
    if (allCharactersResponse.ok) {
      allCharacters = await allCharactersResponse.json();
      console.log(`📋 Total characters in database: ${allCharacters.length}`);
    }

    // Use the first two characters for combat
    if (allCharacters.length >= 2) {
      const [attacker, target] = allCharacters;
      
      console.log(`\n⚔️  Testing combat: ${attacker.name} vs ${target.name}`);
      
      // 4. Test combat action
      const combatResponse = await fetch(`${BASE_URL}/api/combat/action`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attackerId: attacker.id,
          targetId: target.id,
          action: 'basic_attack'
        })
      });

      if (combatResponse.ok) {
        const result = await combatResponse.json();
        console.log('✅ Combat successful!');
        console.log(`   Damage: ${result.damage_dealt}`);
        console.log(`   Critical: ${result.is_critical ? 'YES' : 'NO'}`);
        console.log(`   Effects: ${result.effects_applied.join(', ') || 'None'}`);
      } else {
        const errorText = await combatResponse.text();
        console.log('❌ Combat failed:', errorText);
      }

      // 5. Test combat history
      console.log('\n📜 Testing combat history...');
      const historyResponse = await fetch(`${BASE_URL}/api/combat/history/${attacker.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyResponse.ok) {
        const history = await historyResponse.json();
        console.log(`✅ Combat history: ${history.length} entries`);
        if (history.length > 0) {
          const lastAction = history[0];
          console.log(`   Last action: ${lastAction.type} - ${lastAction.damage} damage`);
        }
      }

      // 6. Test abilities for different classes
      for (const char of allCharacters.slice(0, 3)) {
        console.log(`\n🔮 Testing abilities for ${char.name} (${char.characterClass})...`);
        const abilitiesResponse = await fetch(`${BASE_URL}/api/combat/abilities/${char.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (abilitiesResponse.ok) {
          const abilities = await abilitiesResponse.json();
          console.log(`✅ Available abilities: ${abilities.join(', ')}`);
        }
      }
    }

    console.log('\n🎉 Quick API test completed!');

  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

quickAPITest();
