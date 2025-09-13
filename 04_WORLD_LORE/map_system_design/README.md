# 🗺️ **MAP SYSTEM DESIGN - L'Esperimento di Ashnar**

## 📋 **INDICE PROGETTAZIONE**

Questa cartella contiene la progettazione completa del sistema mappa gerarchico con routing geografico realistico.

### **📁 Struttura Cartella**
```
map_system_design/
├── README.md                          # Questo file - overview generale
├── 01_WORLD_HIERARCHY.md             # Struttura gerarchica mondo (Continenti → Regioni → Città → Location)
├── 02_STARTING_KNOWLEDGE.md          # Conoscenza iniziale del giocatore al primo login
├── 03_CONTINENTAL_ROUTES.md          # Collegamenti e rotte tra continenti (navi, portali, tunnel nanici)
├── 04_CONTINENT_WEST_DETAILED.md     # Continente Occidentale: regioni, città, location, collegamenti
├── 05_CONTINENT_EAST_DETAILED.md     # Continente Orientale: regioni, città, location, collegamenti  
├── 06_ARCHIPELAGO_DETAILED.md        # Arcipelago Centrale: isole, collegamenti navali, città sottomarine
├── 07_ROUTING_SYSTEM.md              # Sistema di routing: accessibilità, blocchi, prerequisiti
├── 08_DISCOVERY_MECHANICS.md         # Meccaniche di scoperta: rumors NPC, quest unlock, esplorazione
├── 09_TRAVEL_MECHANICS.md            # Meccaniche di viaggio: tempi, costi, pericoli, mezzi di trasporto
└── 10_IMPLEMENTATION_PLAN.md         # Piano implementazione tecnica del sistema
```

## 🎯 **OBIETTIVI SISTEMA MAPPA**

### **🌍 Geografia Realistica**
- **3 Macro-Aree**: Continente Est, Continente Ovest, Arcipelago Centrale
- **Routing Geografico**: Percorsi logici basati su geografia fisica e politica
- **Blocchi Naturali**: Montagne, deserti, oceani che impediscono movimento libero
- **Blocchi Politici**: Confini chiusi, guerre, territori ostili

### **🚶 Sistema di Movimento Realistico**
- **No Teleport Libero**: Non si può andare ovunque solo "sentendo parlare"
- **Percorsi Obbligati**: Strade, sentieri, rotte navali predefinite
- **Prerequisiti di Accesso**: Livello, quest, diplomazia, mezzi di trasporto
- **Progressione Geografica**: Sblocco graduale di aree sempre più lontane

### **📖 Knowledge System**
- **Conoscenza Iniziale**: Vaga idea delle 3 macro-aree
- **Discovery Progressiva**: Rumors NPC → Regioni sentite → Percorsi accessibili
- **Fog of War**: Aree sconosciute vs sentite vs visitabili vs visitate

### **🛣️ Routing & Travel**
- **Rotte Intercontinentali**: Navi, tunnel nanici, portali magici
- **Rotte Regionali**: Strade principali, sentieri, passaggi montani
- **Rotte Locali**: Movimento tra città e location vicine
- **Mezzi di Trasporto**: A piedi, cavallo, nave, mezzi speciali

## 🗺️ **CONCEPT GERARCHICO**

```
MONDO DI ASHNAR
├── 🌊 CONTINENTE OCCIDENTALE
│   ├── 🏔️ REGIONE MONTANA NANICA
│   │   ├── Thar Zhulgar (Capitale sotterranea) 
│   │   ├── Kroldun (Colonia nanica)
│   │   └── Dol Khazir (Outpost minerario)
│   ├── 🌲 REGIONE FORESTE ELFICHE  
│   │   ├── Elarion (Capitale elfica)
│   │   └── Villaggi elfici minori
│   └── [altre regioni...]
├── 🏛️ CONTINENTE ORIENTALE
│   ├── 👑 REGNO DI VELENDAR
│   │   ├── Thalareth (Capitale + Accademia)
│   │   └── Città vassalle
│   └── [altre regioni...]
└── 🏝️ ARCIPELAGO CENTRALE
    ├── 🌋 ISOLA VULCANICA
    ├── 🧝 ISOLE SILVANE
    └── [altre isole...]
```

## 🚀 **STARTING POINT**

### **🧪 Laboratorio dell'Alchimista**
- **Posizione**: Da definire (probabilmente Continente Orientale, vicino Accademia?)
- **Conoscenza Iniziale**: 
  - ✅ "Esistono 3 grandi aree del mondo"  
  - ✅ "Sono in una di queste aree"
  - ❌ Non sa cosa c'è nelle altre aree
  - ❌ Non sa come raggiungerle

### **Prime Esplorazioni**
- **Zona Locale**: 2-3 location immediatamente adiacenti
- **Villaggio/Città Vicina**: Hub per primi NPC e rumors
- **Rumors Iniziali**: "Si dice che a ovest ci siano grandi montagne..."

## 📋 **PROSSIMI PASSI**

1. **📍 Definire posizione Laboratorio** e starting area
2. **🗺️ Mappare collegamenti** tra tutte le location secondo geografia
3. **🚧 Identificare blocchi** naturali e politici
4. **🛣️ Progettare rotte** possibili tra continenti e regioni
5. **📖 Definire discovery system** per unlock progressivo
6. **⚙️ Progettare implementazione** tecnica del sistema

---

*Progettazione iniziata: 12 Settembre 2025*  
*Status: Planning Phase → Detailed Design*
