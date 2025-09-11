# PERSONALIZZAZIONE AVANZATA - Character Creation

Questo documento definisce le funzionalità avanzate di personalizzazione per il sistema di creazione personaggi.

## 🎨 **PERSONALIZZAZIONE AVATAR**

### **Sistema Base**
- **Avatar Razziali**: Ogni razza ha template base specifici
- **Customizzazione**: Modifica aspetto fisico entro limiti razziali
- **Preview 3D**: Anteprima rotabile del personaggio
- **Salvataggio**: Avatar salvato come asset riutilizzabile

### **Opzioni di Personalizzazione per Razza**

#### **UMANI**
```json
{
  "skin_colors": ["pale", "fair", "olive", "tan", "brown", "dark"],
  "hair_colors": ["black", "brown", "blonde", "red", "auburn", "gray"],
  "eye_colors": ["brown", "blue", "green", "hazel", "amber", "gray"],
  "hair_styles": ["short", "medium", "long", "braided", "bald", "ponytail"],
  "facial_hair": ["clean", "mustache", "beard", "goatee", "full_beard"]
}
```

#### **ELFI**
```json
{
  "skin_colors": ["pale", "ivory", "golden", "silver_tint"],
  "hair_colors": ["silver", "platinum", "golden", "auburn", "black"],
  "eye_colors": ["emerald", "sapphire", "violet", "silver", "gold"],
  "ear_length": ["short", "medium", "long", "very_long"],
  "facial_features": ["angular", "serene", "noble", "mysterious"]
}
```

#### **NANI**
```json
{
  "skin_colors": ["fair", "ruddy", "tan", "weathered"],
  "hair_colors": ["red", "brown", "black", "gray", "white"],
  "eye_colors": ["brown", "green", "blue", "hazel"],
  "beard_styles": ["braided", "long", "trimmed", "full", "decorated"],
  "build": ["stocky", "broad", "muscular", "compact"]
}
```

#### **ORCHI**
```json
{
  "skin_colors": ["green", "gray", "brown", "dark_green", "olive"],
  "hair_colors": ["black", "dark_brown", "red", "gray"],
  "eye_colors": ["red", "yellow", "orange", "brown", "black"],
  "tusk_size": ["small", "medium", "large", "prominent"],
  "scars": ["none", "facial", "body", "battle_worn", "ritual"]
}
```

#### **TROLL**
```json
{
  "skin_colors": ["gray", "blue_gray", "green_gray", "stone"],
  "hair_colors": ["black", "dark_gray", "white", "moss_green"],
  "eye_colors": ["yellow", "red", "orange", "pale_blue"],
  "build": ["lanky", "hulking", "wiry", "massive"],
  "stone_patches": ["none", "arms", "shoulders", "back", "full"]
}
```

#### **GNOMI**
```json
{
  "skin_colors": ["pale", "rosy", "tan", "freckled"],
  "hair_colors": ["brown", "red", "blonde", "gray", "white"],
  "eye_colors": ["brown", "blue", "green", "hazel", "bright_colors"],
  "nose_size": ["small", "prominent", "button", "large"],
  "accessories": ["none", "goggles", "tools", "gems", "clockwork"]
}
```

#### **AERATHI**
```json
{
  "feather_colors": ["white", "silver", "gold", "brown", "black", "iridescent"],
  "wing_patterns": ["solid", "spotted", "striped", "gradient"],
  "eye_colors": ["golden", "silver", "blue", "green", "amber"],
  "beak_shape": ["curved", "straight", "hooked", "pointed"],
  "wingspan": ["compact", "medium", "wide", "majestic"]
}
```

#### **GUOLGARN**
```json
{
  "skin_colors": ["pale", "gray", "blue_tint", "stone_color"],
  "hair_colors": ["white", "silver", "pale_blue", "gray"],
  "eye_colors": ["pale_blue", "silver", "white", "ice_blue"],
  "crystal_growths": ["none", "forehead", "shoulders", "arms", "extensive"],
  "build": ["lean", "muscular", "ethereal", "robust"]
}
```

#### **ZARKAAN**
```json
{
  "skin_colors": ["bronze", "golden", "copper", "sand"],
  "hair_colors": ["black", "dark_brown", "bronze", "copper"],
  "eye_colors": ["amber", "gold", "copper", "dark_brown"],
  "tattoos": ["none", "geometric", "magical", "tribal", "extensive"],
  "jewelry": ["none", "simple", "ornate", "magical", "royal"]
}
```

#### **UOMINI PESCE**
```json
{
  "scale_colors": ["blue", "green", "silver", "teal", "deep_sea"],
  "fin_types": ["shark", "tropical", "deep_sea", "eel", "ray"],
  "eye_colors": ["black", "silver", "blue", "green", "gold"],
  "gill_placement": ["neck", "jaw", "chest"],
  "scale_patterns": ["uniform", "spotted", "striped", "iridescent"]
}
```

#### **UOMINI LUCERTOLA**
```json
{
  "scale_colors": ["green", "brown", "yellow", "red", "blue", "iridescent"],
  "scale_patterns": ["smooth", "ridged", "spotted", "striped"],
  "eye_colors": ["yellow", "green", "orange", "red", "gold"],
  "tail_length": ["short", "medium", "long", "very_long"],
  "crest": ["none", "small", "prominent", "colorful", "spiky"]
}
```

## 🎨 **SISTEMA COLORI E TEMI**

### **Temi Interfaccia Disponibili**
```json
{
  "classic_fantasy": {
    "primary": "#8B4513",
    "secondary": "#DAA520", 
    "accent": "#FF6347",
    "background": "#2F1B14"
  },
  "elven_grace": {
    "primary": "#228B22",
    "secondary": "#FFD700",
    "accent": "#98FB98", 
    "background": "#0F2F0F"
  },
  "dwarven_forge": {
    "primary": "#B22222",
    "secondary": "#FFA500",
    "accent": "#FFD700",
    "background": "#2F1F1F"
  },
  "arcane_mystery": {
    "primary": "#4B0082",
    "secondary": "#9370DB",
    "accent": "#00FFFF",
    "background": "#1A0A2E"
  },
  "nature_harmony": {
    "primary": "#228B22",
    "secondary": "#32CD32",
    "accent": "#98FB98",
    "background": "#0F3F0F"
  },
  "desert_sands": {
    "primary": "#D2691E",
    "secondary": "#F4A460",
    "accent": "#FFD700",
    "background": "#2F2616"
  },
  "deep_ocean": {
    "primary": "#008B8B",
    "secondary": "#20B2AA", 
    "accent": "#00CED1",
    "background": "#0F2F2F"
  },
  "shadow_stealth": {
    "primary": "#2F2F2F",
    "secondary": "#696969",
    "accent": "#B22222",
    "background": "#0A0A0A"
  }
}
```

### **Personalizzazione Colori UI**
- **Selezione Tema**: Base su razza o preferenza personale
- **Customizzazione**: Regolazione fine di tonalità e saturazione
- **Preview Live**: Anteprima immediate dell'interfaccia
- **Salvataggio Profilo**: Colori salvati nel profilo utente

## 🏷️ **SISTEMA TAG PERSONALITÀ PER IA**

### **Categorie Tag Personalità**

#### **🎭 Tratti Caratteriali** (Scegli 3-5)
```json
{
  "personality_traits": [
    "coraggioso", "prudente", "curioso", "riservato",
    "leale", "indipendente", "diplomatico", "diretto", 
    "ottimista", "pragmatico", "idealista", "scettico",
    "compassionevole", "spietato", "onesto", "astuto",
    "paziente", "impulsivo", "umile", "orgoglioso"
  ]
}
```

#### **💭 Motivazioni Primarie** (Scegli 2-3)
```json
{
  "motivations": [
    "vendetta", "giustizia", "conoscenza", "potere",
    "ricchezza", "gloria", "famiglia", "patria",
    "libertà", "pace", "avventura", "redenzione",
    "protezione", "scoperta", "creazione", "distruzione"
  ]
}
```

#### **😨 Paure e Debolezze** (Scegli 1-2)
```json
{
  "fears": [
    "altezze", "buio", "morte", "tradimento",
    "fallimento", "solitudine", "perdita_controllo", "magia",
    "mostri", "acqua", "fuoco", "spazi_chiusi",
    "folla", "responsabilità", "cambiamento", "giudizio"
  ]
}
```

#### **🎯 Stile di Gioco** (Scegli 2-3)
```json
{
  "playstyles": [
    "esploratore", "combattente", "diplomatico", "furtivo",
    "studioso", "mercante", "leader", "solitario",
    "protettore", "distruttore", "guaritore", "manipolatore",
    "artista", "artigiano", "cacciatore", "mistico"
  ]
}
```

#### **🗣️ Stile Comunicativo** (Scegli 2)
```json
{
  "communication_style": [
    "formale", "informale", "poetico", "diretto",
    "sarcastico", "gentile", "autoritario", "umile",
    "misterioso", "chiaro", "eloquente", "conciso",
    "drammatico", "pratico", "filosofico", "umoristico"
  ]
}
```

#### **⚖️ Codice Morale** (Scegli 1-2)
```json
{
  "moral_code": [
    "never_kill_innocent", "always_honor_deals", "protect_weak",
    "seek_truth", "respect_nature", "value_freedom",
    "maintain_order", "embrace_chaos", "serve_greater_good",
    "self_preservation", "family_first", "honor_ancestors",
    "might_makes_right", "knowledge_is_power", "gold_rules_all"
  ]
}
```

### **Utilizzo IA dei Tag**

#### **Generazione Dialoghi**:
```typescript
function generateDialogue(npc: NPC, player: Player, context: string): string {
  const personality = player.personalityTags;
  const motivation = player.motivations;
  const fears = player.fears;
  const style = player.communicationStyle;
  
  // L'IA usa questi tag per:
  // - Modificare tono e stile delle risposte
  // - Suggerire azioni coerenti con personalità  
  // - Creare conflitti interni realistici
  // - Personalizzare reazioni emotive
  
  return aiProvider.generateResponse({
    context: context,
    personality: personality,
    motivations: motivation,
    fears: fears,
    communicationStyle: style
  });
}
```

#### **Decisioni Automatiche**:
- **Quando il giocatore è AFK**: IA prende decisioni basate sui tag
- **Situazioni di Stress**: Reazioni automatiche coerenti con paure
- **Interazioni Sociali**: Stile comunicativo applicato automaticamente
- **Scelte Morali**: Decisioni influenzate dal codice morale

## 💾 **INTEGRAZIONE DATABASE**

### **Struttura Dati Avatar**:
```sql
CREATE TABLE character_avatars (
  character_id UUID PRIMARY KEY REFERENCES characters(id),
  race_id VARCHAR(20) NOT NULL,
  avatar_data JSONB NOT NULL, -- Tutte le scelte estetiche
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Struttura Dati Personalità**:
```sql
CREATE TABLE character_personality (
  character_id UUID PRIMARY KEY REFERENCES characters(id),
  personality_traits TEXT[] NOT NULL,
  motivations TEXT[] NOT NULL,
  fears TEXT[] NOT NULL,
  playstyles TEXT[] NOT NULL,
  communication_style TEXT[] NOT NULL,
  moral_code TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Struttura Dati Tema UI**:
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  ui_theme VARCHAR(50) DEFAULT 'classic_fantasy',
  custom_colors JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎮 **IMPLEMENTAZIONE UX**

### **Flusso Esteso Creazione**:
1. **Nome & Background** (esistente)
2. **Razza & Avatar** (nuovo: selezione + personalizzazione)
3. **Classe & Statistiche** (esistente)
4. **Tratti & Allineamento** (esistente)
5. **Personalità & IA** (nuovo: tag per comportamento IA)
6. **Tema UI** (nuovo: personalizzazione interfaccia)
7. **Preview Finale** (completa con avatar, stats, personalità)

### **Componenti UI Necessari**:
- **Avatar Editor**: Sliders, dropdown, color picker per personalizzazione
- **Tag Selector**: Interfaccia a chip per selezione tag personalità
- **Theme Picker**: Preview live dei temi con selezione
- **Personality Summary**: Riassunto finale personalità per conferma
- **3D Preview**: Rendering avatar con animazioni base

---

**File di riferimento per implementazione funzionalità avanzate di personalizzazione.**
