import { CombatService } from '../src/services/CombatService.js';
import { prisma } from '../src/utils/prisma.js';

async function testCombatSystem() {
  console.log('🎮 Testing Combat System...\n');

  try {
    // Get first two characters from database for testing
    const characters = await prisma.character.findMany({
      take: 2,
      include: { equipment: { include: { item: true } } }
    });

    if (characters.length < 2) {
      console.log('❌ Need at least 2 characters to test combat. Create some characters first.');
      return;
    }

    const [attacker, target] = characters;
    console.log(`⚔️  Combat Test: ${attacker.name} (${attacker.characterClass}) vs ${target.name} (${target.characterClass})`);
    console.log(`📊 Attacker Stats: STR:${attacker.strength} AGI:${attacker.agility} INT:${attacker.intelligence} HP:${attacker.currentHealth}`);
    console.log(`📊 Target Stats: STR:${target.strength} AGI:${target.agility} INT:${target.intelligence} HP:${target.currentHealth}\n`);

    // Test basic attack
    console.log('🔥 Testing Basic Attack...');
    const basicAttackResult = await CombatService.executeCombatAction(
      attacker.id,
      target.id,
      'basic_attack'
    );

    console.log(`⚡ Basic Attack Result:
    - Damage Dealt: ${basicAttackResult.damage_dealt}
    - Critical Hit: ${basicAttackResult.is_critical ? 'YES' : 'NO'}
    - Effects Applied: ${basicAttackResult.effects_applied.join(', ') || 'None'}\n`);

    // Test fireball if attacker is a mage
    if (attacker.characterClass === 'MAGE') {
      console.log('🔥 Testing Fireball (Mage ability)...');
      const fireballResult = await CombatService.executeCombatAction(
        attacker.id,
        target.id,
        'fireball'
      );

      console.log(`🔮 Fireball Result:
      - Damage Dealt: ${fireballResult.damage_dealt}
      - Critical Hit: ${fireballResult.is_critical ? 'YES' : 'NO'}
      - Effects Applied: ${fireballResult.effects_applied.join(', ') || 'None'}\n`);
    }

    // Test heal if target is a cleric
    if (target.characterClass === 'CLERIC') {
      console.log('💚 Testing Heal (Cleric ability)...');
      const healResult = await CombatService.executeCombatAction(
        target.id,
        target.id, // Self-heal
        'heal'
      );

      console.log(`✨ Heal Result:
      - Healing Done: ${Math.abs(healResult.damage_dealt)} HP
      - Critical Heal: ${healResult.is_critical ? 'YES' : 'NO'}\n`);
    }

    // Check final health status
    const updatedTarget = await prisma.character.findUnique({
      where: { id: target.id },
      select: { currentHealth: true, name: true }
    });

    console.log(`💖 Final Health Status: ${updatedTarget?.name} has ${updatedTarget?.currentHealth} HP remaining`);
    console.log('✅ Combat System Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Combat Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testCombatSystem();
