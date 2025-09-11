// Simple test without TypeScript issues
const fetch = require('node-fetch').default;

const test = async () => {
  
  console.log('🔍 Simple Login Test...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'combatuser',
        password: 'testpass123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Full response:', JSON.stringify(data, null, 2));
      console.log('Token:', data.data?.token ? 'Present' : 'Missing');
      console.log('User:', data.data?.user?.username || 'Unknown');
      
      // Test getting characters
      if (data.data?.token) {
        console.log('\n👥 Testing character fetch...');
        const charResponse = await fetch('http://localhost:5000/api/characters', {
          headers: { 'Authorization': `Bearer ${data.data.token}` }
        });
        
        if (charResponse.ok) {
          const chars = await charResponse.json();
          console.log(`✅ Characters: ${chars.length} found`);
          
          // Test combat if we have characters from other users
          const allCharsResponse = await fetch('http://localhost:5000/api/characters/all', {
            headers: { 'Authorization': `Bearer ${data.data.token}` }
          });
          
          if (allCharsResponse.ok) {
            const allChars = await allCharsResponse.json();
            console.log(`📋 All characters: ${allChars.length} found`);
            
            if (allChars.length >= 2) {
              console.log('\n⚔️  Testing combat...');
              const combatResponse = await fetch('http://localhost:5000/api/combat/action', {
                method: 'POST',
                headers: { 
                  'Authorization': `Bearer ${data.data.token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  attackerId: allChars[0].id,
                  targetId: allChars[1].id,
                  action: 'basic_attack'
                })
              });
              
              if (combatResponse.ok) {
                const result = await combatResponse.json();
                console.log('✅ Combat test successful!');
                console.log(`   Damage: ${result.damage_dealt}`);
                console.log(`   Critical: ${result.is_critical}`);
              } else {
                const error = await combatResponse.text();
                console.log('❌ Combat failed:', error);
              }
            }
          }
        }
      }
      
    } else {
      console.log('❌ Login failed:', data);
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
};

test();
