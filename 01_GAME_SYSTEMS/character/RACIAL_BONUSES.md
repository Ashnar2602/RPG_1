# BONUS RAZZIALI - Specifica Dettagliata

Questo documento definisce tutti i bonus statistici e tratti razziali per l'implementazione del sistema di creazione personaggi.

## 📊 **TABELLA BONUS RAZZIALI COMPLETA**

### **UMANI** - Figli dell'Equilibrio
```json
{
  "race_id": "HUMAN",
  "display_name": "Umano",
  "stat_bonuses": {
    "charisma": 2,
    "strength": 1, 
    "intelligence": 1,
    "luck": 1
  },
  "racial_trait": {
    "name": "Adattabilità",
    "description": "La versatilità umana permette apprendimento accelerato",
    "effect": "+10% XP guadagnato",
    "mechanical_bonus": "xp_multiplier: 1.1"
  },
  "lore_summary": "Versatili ed equilibrati, capaci di eccellere in qualsiasi campo",
  "preferred_classes": ["GUERRIERO", "MAGO", "FURFANTE"],
  "homeland": "Vari continenti"
}
```

### **ELFI** - Maestri di Magia e Precisione
```json
{
  "race_id": "ELF", 
  "display_name": "Elfo",
  "stat_bonuses": {
    "intelligence": 2,
    "dexterity": 2,
    "willpower": 1
  },
  "racial_trait": {
    "name": "Vista Elfica",
    "description": "Percezione superiore per combattimento a distanza",
    "effect": "+15% precisione armi a distanza",
    "mechanical_bonus": "ranged_accuracy: 1.15"
  },
  "lore_summary": "Maestri della magia e del tiro con l'arco, longevi e saggi",
  "preferred_classes": ["MAGO", "FURFANTE"],
  "homeland": "Foreste antiche, regni magici"
}
```

### **NANI** - Forgiatori Instancabili
```json
{
  "race_id": "DWARF",
  "display_name": "Nano", 
  "stat_bonuses": {
    "strength": 3,
    "stamina": 2
  },
  "racial_trait": {
    "name": "Costituzione Ferrea",
    "description": "Resistenza naturale a sostanze tossiche e malattie",
    "effect": "+20% resistenza a veleni e malattie",
    "mechanical_bonus": "poison_resistance: 1.2, disease_resistance: 1.2"
  },
  "lore_summary": "Fabbri leggendari e combattenti instancabili",
  "preferred_classes": ["GUERRIERO"],
  "homeland": "Montagne, città sotterranee"
}
```

### **ORCHI** - Guerrieri Brutali
```json
{
  "race_id": "ORC",
  "display_name": "Orco",
  "stat_bonuses": {
    "strength": 4,
    "stamina": 1
  },
  "racial_trait": {
    "name": "Furia Orchesca", 
    "description": "Il dolore scatena ferocia devastante",
    "effect": "+25% danno quando sotto 30% HP",
    "mechanical_bonus": "conditional_damage: {condition: 'hp_below_30_percent', multiplier: 1.25}"
  },
  "lore_summary": "Forza devastante, cultura guerriera tribale",
  "preferred_classes": ["GUERRIERO"],
  "homeland": "Steppe, montagne selvagge"
}
```

### **TROLL** - Rigeneranti Tenaci
```json
{
  "race_id": "TROLL",
  "display_name": "Troll",
  "stat_bonuses": {
    "stamina": 3,
    "strength": 1,
    "willpower": 1
  },
  "racial_trait": {
    "name": "Rigenerazione",
    "description": "Capacità di guarigione accelerata naturale", 
    "effect": "+2 HP per turno durante combattimento",
    "mechanical_bonus": "combat_regen: 2"
  },
  "lore_summary": "Difficili da uccidere, adattabili agli ambienti più ostili",
  "preferred_classes": ["GUERRIERO"],
  "homeland": "Caverne, montagne ghiacciate"
}
```

### **GNOMI** - Geni Inventivi
```json
{
  "race_id": "GNOME", 
  "display_name": "Gnomo",
  "stat_bonuses": {
    "intelligence": 3,
    "charisma": 1,
    "luck": 1
  },
  "racial_trait": {
    "name": "Genio Inventivo",
    "description": "Talento naturale per creazioni magico-meccaniche",
    "effect": "+20% efficacia crafting magico",
    "mechanical_bonus": "magical_crafting: 1.2"
  },
  "lore_summary": "Inventori brillanti, maghi specializzati in artefatti",
  "preferred_classes": ["MAGO"],
  "homeland": "Colline, laboratori sotterranei"
}
```

### **AERATHI** - Signori dei Venti
```json
{
  "race_id": "AERATHI",
  "display_name": "Aerathi",
  "stat_bonuses": {
    "dexterity": 2,
    "willpower": 2, 
    "luck": 1
  },
  "racial_trait": {
    "name": "Volo Planato",
    "description": "Può planare dolcemente per brevi distanze",
    "effect": "Capacità di volo planato limitato",
    "mechanical_bonus": "special_movement: 'glide', fall_damage_reduction: 0.5"
  },
  "lore_summary": "Abitanti delle vette più alte, connessi ai venti",
  "preferred_classes": ["FURFANTE", "MAGO"],
  "homeland": "Montagne volanti, picchi inaccessibili"
}
```

### **GUOLGARN** - Guardiani del Sottosuolo
```json
{
  "race_id": "GUOLGARN",
  "display_name": "Guolgarn", 
  "stat_bonuses": {
    "strength": 2,
    "stamina": 1,
    "willpower": 1,
    "intelligence": 1
  },
  "racial_trait": {
    "name": "Vista Sotterranea",
    "description": "Visione perfetta anche nella più completa oscurità",
    "effect": "Visione al buio completa",
    "mechanical_bonus": "darkvision: true, darkness_penalty: 0"
  },
  "lore_summary": "Cultura sotterranea antica, resistenti e misteriosi",
  "preferred_classes": ["GUERRIERO", "MAGO"],
  "homeland": "Abissi sotterranei, città nelle profondità"
}
```

### **ZARKAAN** - Maghi delle Sabbie
```json
{
  "race_id": "ZARKAAN",
  "display_name": "Zar'kaan",
  "stat_bonuses": {
    "intelligence": 2,
    "charisma": 1,
    "willpower": 1,
    "luck": 1
  },
  "racial_trait": {
    "name": "Resistenza Desertica",
    "description": "Adattamento perfetto agli ambienti più aridi e caldi",
    "effect": "Immunità al caldo estremo",
    "mechanical_bonus": "heat_immunity: true, desert_survival: 2.0"
  },
  "lore_summary": "Maestri della magia delle sabbie, artigiani leggendari",
  "preferred_classes": ["MAGO"],
  "homeland": "Deserti delle ceneri, oasi magiche"
}
```

### **UOMINI PESCE** - Signori degli Abissi  
```json
{
  "race_id": "FISHMAN",
  "display_name": "Uomo Pesce",
  "stat_bonuses": {
    "stamina": 2,
    "dexterity": 2,
    "willpower": 1
  },
  "racial_trait": {
    "name": "Respirazione Acquatica", 
    "description": "Può respirare sia aria che acqua senza limitazioni",
    "effect": "Respirazione subacquea illimitata",
    "mechanical_bonus": "underwater_breathing: true, swim_speed: 2.0"
  },
  "lore_summary": "Dominio totale degli ambienti acquatici, cultura abissale",
  "preferred_classes": ["GUERRIERO", "FURFANTE"],
  "homeland": "Oceani profondi, città sommerse"
}
```

### **UOMINI LUCERTOLA** - Costruttori delle Paludi
```json
{
  "race_id": "LIZARDMAN",
  "display_name": "Uomo Lucertola",
  "stat_bonuses": {
    "dexterity": 2,
    "stamina": 1,
    "willpower": 1,
    "intelligence": 1
  },
  "racial_trait": {
    "name": "Mimetismo Ambientale",
    "description": "Capacità naturale di mimetizzarsi negli ambienti naturali",
    "effect": "+25% efficacia stealth in ambienti naturali", 
    "mechanical_bonus": "natural_stealth: 1.25"
  },
  "lore_summary": "Esperti del mimetismo, signori delle paludi e acque tropicali",
  "preferred_classes": ["FURFANTE", "GUERRIERO"],
  "homeland": "Paludi, coste tropicali, arcipelaghi"
}
```

## 🎯 **IMPLEMENTAZIONE TECNICA**

### **Struttura Database**:
```sql
CREATE TABLE racial_bonuses (
  race_id VARCHAR(20) PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL,
  strength_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  dexterity_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  charisma_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0,
  stamina_bonus INTEGER DEFAULT 0,
  racial_trait_name VARCHAR(100) NOT NULL,
  racial_trait_description TEXT NOT NULL,
  racial_trait_effect VARCHAR(200) NOT NULL,
  mechanical_bonus JSONB NOT NULL
);
```

### **Validazione Creazione**:
```typescript
function validateRacialBonuses(race: string, finalStats: CharacterStats): boolean {
  const racialData = RACIAL_BONUSES[race];
  const expectedBonusTotal = Object.values(racialData.stat_bonuses).reduce((sum, bonus) => sum + bonus, 0);
  
  // Verifica che i bonus razziali siano esattamente 5 punti totali
  if (expectedBonusTotal !== 5) {
    throw new Error(`Racial bonuses must total exactly 5 points for ${race}`);
  }
  
  // Verifica che nessuna stat superi 25 dopo bonus razziali + punti liberi
  for (const [stat, value] of Object.entries(finalStats)) {
    if (value > 25) {
      throw new Error(`Stat ${stat} cannot exceed 25 (current: ${value})`);
    }
  }
  
  return true;
}
```

### **Calcolo Automatico**:
```typescript
function applyRacialBonuses(baseStats: CharacterStats, race: string): CharacterStats {
  const racialData = RACIAL_BONUSES[race];
  const modifiedStats = { ...baseStats };
  
  // Applica bonus statistici razziali
  Object.entries(racialData.stat_bonuses).forEach(([stat, bonus]) => {
    modifiedStats[stat] += bonus;
  });
  
  return modifiedStats;
}
```

## 📋 **BILANCIAMENTO E DESIGN**

### **Principi di Design**:
1. **Totale Fisso**: Ogni razza ha esattamente +5 punti statistici
2. **Specializzazione**: Ogni razza eccelle in aree specifiche secondo il lore
3. **Tratti Unici**: Ogni tratto razziale offre vantaggi meccanici distintivi
4. **Sinergie di Classe**: Bonus razziali si allineano con classi consigliate
5. **Bilanciamento PvP**: Nessuna razza dominante in tutti gli aspetti

### **Distribuzione Bonus**:
- **Razze Fisiche**: Focus su STR/STA (Orchi, Nani, Troll)
- **Razze Magiche**: Focus su INT/WIL/CHA (Elfi, Gnomi, Zar'kaan)  
- **Razze Agili**: Focus su DEX/LCK (Aerathi, Uomini Pesce)
- **Razze Equilibrate**: Distribuzione più uniforme (Umani, Guolgarn)

### **Potere Tratti Razziali**:
- **Utility**: Tratti che offrono versatilità (Vista al buio, Respirazione acquatica)
- **Combat**: Tratti che impattano direttamente il combattimento (Rigenerazione, Furia)
- **Economic**: Tratti che influenzano crescita e risorse (Adattabilità, Genio Inventivo)
- **Survival**: Tratti che aiutano nell'esplorazione (Resistenza desertica, Volo planato)

---

**File di riferimento per implementazione sistema razziale completo.**
