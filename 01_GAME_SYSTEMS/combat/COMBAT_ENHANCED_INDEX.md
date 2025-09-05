# Combat System Enhanced — Overview e Integration

Data: 4 settembre 2025

## Overview delle espansioni

Questo documento serve come index per il Combat System espanso, che è stato suddiviso in moduli specializzati per maintainability e implementazione modulare.

## Struttura dei file

### Core Combat (COMBAT_SYSTEM.md) — ESISTENTE
- Formula POWER e statistiche base
- Sistema D50 di base
- Iniziativa e turni base
- IA a blocchi da 5 turni

### Nuovi moduli implementati:

1. **DAMAGE_DEFENSE.md** — Sistema di danno e difesa
   - Calcolo danno dettagliato
   - Sistema armature e resistenze
   - Mitigation e penetration

2. **STATUS_EFFECTS.md** — Buff, debuff e condizioni
   - Framework status effects
   - Damage/Healing over Time
   - Control effects (stun, silence, etc.)

3. **DAMAGE_TYPES.md** — Tipi di danno e resistenze
   - Damage types (physical, elemental, etc.)
   - Resistance system
   - Immunities e vulnerabilities

4. **TACTICAL_COMBAT.md** — Posizionamento e tattica
   - Formation system
   - Positioning mechanics
   - Flanking e tactical modifiers

5. **ACTION_ECONOMY.md** — Sistema azioni avanzato
   - Action types (standard, move, quick, reaction)
   - Action points alternative
   - Combo actions

6. **WEAPON_COMBAT.md** — Proprietà armi e stili di combattimento
   - Weapon properties e special abilities
   - Combat styles e techniques
   - Dual wielding e versatile weapons

7. **ENVIRONMENTAL_COMBAT.md** — Fattori ambientali
   - Terrain effects
   - Weather modifiers
   - Visibility e lighting

8. **AI_COMBAT_TEMPLATES.md** — Template comportamentali IA
   - Behavior patterns specializzati
   - Adaptive AI e learning
   - Role-based templates

9. **ADVANCED_DICE.md** — Meccaniche di dice avanzate
   - Advantage/Disadvantage
   - Exploding dice
   - Situational modifiers

10. **COMBAT_STATE_MACHINE.md** — State management del combattimento
    - Combat phases
    - State transitions
    - Victory/defeat conditions

## Integration Points

### Con sistemi esistenti:
- **Equipment (GAME_MECHANICS.md)**: Weapon properties, armor resistances
- **Travel (TRAVEL_SYSTEM.md)**: Environmental factors, terrain
- **NPCs (NPC_INTERACTION.md)**: Enemy AI templates, combat encounters
- **Quest (QUEST_SYSTEM.md)**: Combat objectives, boss mechanics
- **Character Creation**: Class-specific combat styles, skill trees

### Database Integration:
Ogni modulo include le proprie tabelle e schema necessari, progettati per integrarsi con il database principale senza conflitti.

### API Integration:
Gli endpoint sono progettati per essere backward-compatible e estendere l'API base senza breaking changes.

## Implementation Priority

### Phase 1 (MVP Critical):
1. DAMAGE_DEFENSE.md — Essential per actual combat
2. STATUS_EFFECTS.md — Basic buff/debuff per skills
3. WEAPON_COMBAT.md — Integration con equipment system

### Phase 2 (Enhanced Gameplay):
4. DAMAGE_TYPES.md — Strategic depth
5. ACTION_ECONOMY.md — Advanced tactics
6. AI_COMBAT_TEMPLATES.md — NPC variety

### Phase 3 (Advanced Features):
7. TACTICAL_COMBAT.md — Positioning layer
8. ENVIRONMENTAL_COMBAT.md — Location-based combat
9. ADVANCED_DICE.md — Mechanical variety
10. COMBAT_STATE_MACHINE.md — Complex encounter support

## Compatibility Guarantee

Tutti i moduli sono progettati per:
- ✅ Mantenere compatibilità completa con il core D50 system
- ✅ Preservare formule POWER, HP/MP esistenti
- ✅ Supportare IA autoplay con configurazione granulare
- ✅ Integrarsi seamlessly con tutti gli altri sistemi
- ✅ Permettere implementazione graduale senza breaking changes

## Usage Notes

- Ogni modulo può essere implementato indipendentemente
- I moduli si referenziano tra loro ma non creano dipendenze circolari
- Tutti i calcoli sono deterministici e testabili
- Le configurazioni AI sono esposte per ogni sistema

---

I file seguenti contengono le specifiche complete per ogni modulo.
