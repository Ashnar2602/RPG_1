# 🗺️ INTERACTIVE MAP SYSTEM - Advanced World Navigation

## 📋 **SISTEMA MAPPA OVERVIEW**

### **🎯 Design Philosophy**
Sistema mappa interattiva a **quadranti esplorabili** integrato perfettamente nella UI esistente, permettendo esplorazione dettagliata del mondo con informazioni contestuali ricche.

### **🔧 Technical Integration**
- **Tab Navigation**: Nuovo tab "🗺️ ESPLORA" nella sidebar principale
- **Multi-Layer System**: 4 livelli di zoom (Continentale → Regionale → Locale → Dettaglio)
- **Dynamic Content**: Informazioni che cambiano in base a posizione, quest, e alleanze
- **Real-time Updates**: Sincronizzazione con party members e eventi mondo

---

## 🗺️ **MAP INTERFACE STRUCTURE**

### **📐 Layout Architecture**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🗺️ MAPPA MONDO - Valle Profonda [Continental] [Regional] [Local] [Detail]   │
├─────────────────────────────────────────────────────────────────────────────┤
│🏠│ MAP CONTROLS              │                MAIN MAP VIEWPORT              │
│⚔️│ ─────────────             │                                               │
│🗺️│ 🔍 ZOOM LIVELLI:          │   ╔══════════════════════════════════════╗   │
│📜│ ● Continental (1x)        │   ║    🏔️  MONTAGNE NANICHE    ⛏️      ║   │
│👤│ ○ Regional (4x)           │   ║                                      ║   │
│🎒│ ○ Local (16x)             │   ║  🌳      📍 TU SEI QUI               ║   │
│🏰│ ○ Detail (64x)            │   ║  VALLE      🏘️ VILLAGGIO           ║   │
│💬│                           │   ║  PROFONDA    ELFICO                  ║   │
│⚙️│ 📍 QUADRANTI ATTIVI:      │   ║                                      ║   │
│🚪│ [✓] A1-Nord-Ovest         │   ║          🏰                          ║   │
│  │ [✓] A2-Nord-Est           │   ║      FORTEZZA                        ║   │
│  │ [○] B1-Sud-Ovest          │   ║      ANTICA     🌊                   ║   │
│  │ [○] B2-Sud-Est            │   ║                LAGO                  ║   │
│  │                           │   ║                CRISTALLO             ║   │
│  │ 🎯 LAYER OVERLAY:         │   ╚══════════════════════════════════════╝   │
│  │ [✓] Quest Markers         │                                               │
│  │ [✓] NPCs Importanti       │ LOCATION INFO: Valle Profonda (Regione Elfica)│
│  │ [✓] Party Members         │ Sicurezza: ████████░░ (Sicura)              │
│  │ [○] Zone Pericolo         │ Popolazione: ~1,200 Elfi + Alleati           │
│  │ [○] Risorse Raccolta      │ Clima: 🌤️ Sereno, 18°C                      │
│  │ [○] Influenza Divine      │ Accesso: 🚶 A piedi, 🐎 Cavalcatura         │
│  │                           │                                               │
│  │ 🚀 AZIONI RAPIDE:         │ [🔍 Zoom In] [📍 Centra] [🧭 Bussola] [📋 Info] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 **ZOOM LEVELS SYSTEM**

### **🌍 Level 1: Continental View (1x)**
```css
.map-continental {
  /* Zoom Level: 1x - Mostra tutti i continenti */
  view-scale: 1.0;
  grid-size: 4x4; /* 16 macro-regioni */
  detail-level: minimal;
  
  visible-elements: {
    continents: true,
    major-cities: true,
    racial-territories: true,
    divine-influence-zones: true,
    travel-routes: major-only,
    party-members: all-continent
  }
}

/* Elementi Visibili Continental */
Continental Markers:
├── 🏔️ Montagne Naniche (Nord)
├── 🌳 Foreste Elfiche (Centro-Ovest)  
├── 🏜️ Terre Desolate (Est)
├── 🌊 Arcipelaghi Umani (Sud)
├── 🗻 Vette Draconiche (Nord-Est)
├── 🌋 Isole Volanti (Sparse)
└── 🌑 Zone Vuoto (Misteriose)
```

### **🏞️ Level 2: Regional View (4x)**
```css
.map-regional {
  /* Zoom Level: 4x - Mostra singola regione dettagliata */
  view-scale: 4.0;
  grid-size: 8x8; /* 64 sub-aree per regione */
  detail-level: moderate;
  
  visible-elements: {
    cities-towns: all,
    dungeons: major,
    npcs: important-only,
    quest-zones: active,
    resources: rare-only,
    roads-paths: all-types
  }
}

/* Elementi Visibili Regional */
Regional Markers:
├── 🏘️ Villaggi (5-8 per regione)
├── 🏰 Fortezze/Castelli
├── ⚔️ Dungeon Entrance  
├── 👑 NPCs Leggendari
├── 📜 Quest Hub Zones
├── 💎 Risorse Rare
└── 🛣️ Strade Principali
```

### **🏘️ Level 3: Local View (16x)**
```css
.map-local {
  /* Zoom Level: 16x - Mostra area locale esplorabile */
  view-scale: 16.0;
  grid-size: 16x16; /* 256 quadranti esplorabili */
  detail-level: detailed;
  
  visible-elements: {
    buildings: all,
    npcs: all-visible,
    resources: all-gatherable,
    secrets: discovered-only,
    environmental: interactive,
    combat-zones: current-threat-level
  }
}

/* Elementi Visibili Local */
Local Markers:
├── 🏠 Ogni Edificio Individuale
├── 👤 Tutti gli NPCs nell'area
├── 🌿 Risorse Raccoglibili
├── 🗝️ Segreti Scoperti
├── ⚔️ Zone Combat Attive
└── 🚪 Ingressi/Uscite
```

### **🔍 Level 4: Detail View (64x)**
```css
.map-detail {
  /* Zoom Level: 64x - Dettaglio massimo area immediata */
  view-scale: 64.0;
  grid-size: 32x32; /* Griglia tattica per movimento */
  detail-level: maximum;
  
  visible-elements: {
    furniture: indoor-items,
    npcs: exact-positions,
    items: all-on-ground,
    traps: detected-only,
    tactical-positions: combat-relevant,
    interaction-points: all-available
  }
}

/* Elementi Visibili Detail */
Detail Markers:
├── 🪑 Mobili e Oggetti d'Arredo
├── 👥 Posizione Esatta NPCs
├── 💰 Oggetti a Terra
├── ⚠️ Trappole Rilevate
├── 🎯 Posizioni Tattiche
└── 🔍 Punti Interazione
```

---

## 🗂️ **QUADRANT EXPLORATION SYSTEM**

### **📍 Grid Organization**
```javascript
// Sistema Quadranti Esplorabili
const QuadrantSystem = {
  continental: {
    grid: "4x4",
    totalQuadrants: 16,
    size: "25km x 25km each",
    explorationTime: "4-6 hours per quadrant"
  },
  
  regional: {
    grid: "8x8", 
    totalQuadrants: 64,
    size: "3km x 3km each",
    explorationTime: "30-45 minutes per quadrant"
  },
  
  local: {
    grid: "16x16",
    totalQuadrants: 256, 
    size: "200m x 200m each",
    explorationTime: "3-5 minutes per quadrant"
  },
  
  detail: {
    grid: "32x32",
    totalQuadrants: 1024,
    size: "5m x 5m each", 
    explorationTime: "Real-time movement"
  }
};
```

### **🔍 Quadrant States**
```css
/* Quadrant Visual States */
.quadrant {
  border: 1px solid #444;
  position: relative;
  transition: all 0.3s ease;
}

.quadrant.unexplored {
  background: #1a1a1a;
  color: #666;
  border-style: dashed;
}

.quadrant.exploring {
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
  border-color: #F5A623;
  animation: exploration-progress 2s infinite;
}

.quadrant.explored {
  background: #2d2d2d;
  border-color: #4A90E2;
  color: #FFFFFF;
}

.quadrant.quest-active {
  border-color: #E85D5D;
  box-shadow: 0 0 10px rgba(232, 93, 93, 0.5);
  animation: quest-pulse 1.5s infinite;
}

.quadrant.family-present {
  border-color: #F5A623;
  background: radial-gradient(circle, rgba(245, 166, 35, 0.2), transparent);
}

.quadrant.danger-zone {
  border-color: #E85D5D;
  background: linear-gradient(45deg, 
    rgba(232, 93, 93, 0.1), 
    rgba(139, 69, 19, 0.1));
  animation: danger-warning 2s infinite;
}
```

---

## 📊 **LOCATION INFORMATION PANEL**

### **🏞️ Location Info Structure**
```css
.location-info-panel {
  position: absolute;
  right: 20px;
  top: 120px;
  width: 350px;
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 12px;
  border: 2px solid var(--faction-primary);
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.location-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.location-icon {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  filter: drop-shadow(0 0 8px var(--faction-glow));
}

.location-title {
  font-family: "Cinzel", serif;
  font-size: 20px;
  color: #FFFFFF;
  margin: 0;
}

.location-subtitle {
  color: var(--faction-primary);
  font-size: 14px;
  margin-top: 4px;
}
```

### **📋 Location Data Template**
```javascript
// Template Informazioni Location
const LocationInfo = {
  basic: {
    name: "Valle Profonda",
    type: "Villaggio Elfico",
    region: "Terre Elfiche Occidentali",
    coordinates: "A2-Nord-Est",
    discovered: "2025-09-01 14:23"
  },
  
  demographics: {
    population: 1247,
    races: {
      elfi: 89,
      umani: 8,
      nani: 2,
      altri: 1
    },
    alignment: "Ordine +67, Caos -12, Vuoto +5"
  },
  
  environment: {
    climate: "Temperato umido",
    weather: "Sereno, 18°C",
    timeOfDay: "Pomeriggio",
    season: "Estate",
    dangerLevel: "Sicuro",
    magicLevel: "Moderato"
  },
  
  economy: {
    primaryTrade: "Artigianato Elfico",
    resources: ["Legno Magico", "Erbe Curative", "Cristalli Minori"],
    currency: "Monete d'Oro Standard",
    tradingPost: true,
    innAvailable: true
  },
  
  npcsImportant: [
    {
      name: "Eldara Fogliaverde",
      role: "Sindaco del Villaggio", 
      faction: "Ordine",
      questGiver: true,
      relationship: "Neutrale",
      location: "Municipio Centrale"
    },
    {
      name: "Maestro Theron",
      role: "Insegnante di Magia",
      faction: "Vuoto", 
      questGiver: true,
      relationship: "Amichevole",
      location: "Torre degli Studi"
    }
  ],
  
  questsActive: [
    {
      id: "main_atto1_002",
      title: "Prima Casa Sicura",
      type: "Main Quest",
      status: "In Corso",
      objectives: [
        "Trova alloggio per la famiglia ✓",
        "Conosci i vicini (2/3)",
        "Esplora il villaggio"
      ]
    },
    {
      id: "side_iril_001", 
      title: "La Storia di Iril",
      type: "Family Quest",
      status: "Disponibile",
      giver: "Iril"
    }
  ],
  
  pointsOfInterest: [
    {
      name: "Municipio Centrale",
      type: "Governo",
      coordinates: "Centro villaggio",
      services: ["Quest Hub", "Registrazione", "Informazioni"]
    },
    {
      name: "Taverna 'Foglia d'Oro'",
      type: "Sociale",
      coordinates: "Piazza principale", 
      services: ["Riposo", "Informazioni", "Reclutamento"]
    },
    {
      name: "Torre degli Studi",
      type: "Magico",
      coordinates: "Nord villaggio",
      services: ["Formazione", "Incantesimi", "Ricerca"]
    }
  ],
  
  familyStatus: {
    playerLocation: "Valle Profonda",
    ashnarLocation: "Valle Profonda", 
    irilLocation: "Valle Profonda",
    familyHome: "Casetta dei Tre Cuori",
    bondStrength: {
      playerAshnar: 95,
      playerIril: 87,
      ashnarIril: 91
    }
  }
};
```

---

## 🎮 **INTERACTIVE MAP FEATURES**

### **🖱️ Click Interactions**
```javascript
// Sistema Interazioni Mappa
const MapInteractions = {
  // Click Quadrante
  onQuadrantClick: (quadrant) => {
    if (quadrant.explored) {
      showLocationDetails(quadrant);
      highlightConnectedAreas(quadrant);
      updateInfoPanel(quadrant.locationData);
    } else if (quadrant.adjacent) {
      showExplorationOptions(quadrant);
    }
  },
  
  // Hover Quadrante  
  onQuadrantHover: (quadrant) => {
    showQuickInfo(quadrant);
    highlightTravelPaths(quadrant);
    showTravelTime(quadrant);
  },
  
  // Click NPCs
  onNPCClick: (npc) => {
    centerMapOnNPC(npc);
    showNPCDialog(npc);
    highlightQuests(npc);
  },
  
  // Click Quest Marker
  onQuestMarkerClick: (quest) => {
    showQuestDetails(quest);
    highlightQuestArea(quest);
    showQuestPath(quest);
  }
};
```

### **🔍 Search & Filter System**
```css
.map-search-panel {
  position: absolute;
  top: 20px;
  left: 320px;
  width: 300px;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 8px;
  border: 1px solid #444;
  padding: 12px;
  backdrop-filter: blur(10px);
}

.search-input {
  width: 100%;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px 12px;
  color: #FFFFFF;
  font-size: 14px;
  margin-bottom: 12px;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: var(--faction-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  background: var(--faction-secondary);
  transform: scale(1.05);
}

.filter-tag.active {
  background: #F5A623;
  box-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
}
```

### **📍 Travel & Navigation**
```css
.travel-panel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  border: 2px solid var(--faction-primary);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
}

.travel-info {
  color: #FFFFFF;
  font-size: 14px;
}

.travel-time {
  color: var(--faction-primary);
  font-weight: 600;
}

.travel-method {
  display: flex;
  gap: 8px;
}

.method-btn {
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px 12px;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-btn:hover {
  border-color: var(--faction-primary);
  background: var(--faction-primary);
}

.method-btn.selected {
  background: var(--faction-primary);
  border-color: var(--faction-secondary);
}
```

---

## 🌟 **SPECIAL MAP FEATURES**

### **👨‍👩‍👧‍👦 Family Tracking System**
```css
.family-tracker {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(245, 166, 35, 0.1);
  border: 2px solid #F5A623;
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
}

.family-member {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(245, 166, 35, 0.1);
}

.member-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.member-location {
  color: #F5A623;
  font-size: 12px;
  margin-top: 2px;
}

.family-distance {
  font-size: 11px;
  color: #888;
}

/* Family Member Map Markers */
.family-marker {
  position: absolute;
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, #F5A623, #E98B00);
  border: 3px solid #FFD700;
  border-radius: 50%;
  animation: family-pulse 2s infinite;
  z-index: 100;
}

.family-marker::after {
  content: attr(data-member-initial);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
}
```

### **🏛️ Divine Influence Overlay**
```css
.divine-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.3;
  transition: opacity 0.5s ease;
}

.divine-overlay.active {
  opacity: 0.6;
}

.divine-zone {
  position: absolute;
  border-radius: 50%;
  animation: divine-influence 4s infinite;
}

.divine-zone.order {
  background: radial-gradient(circle, rgba(74, 144, 226, 0.3), transparent);
  border: 2px solid rgba(74, 144, 226, 0.5);
}

.divine-zone.chaos {
  background: radial-gradient(circle, rgba(232, 93, 93, 0.3), transparent);
  border: 2px solid rgba(232, 93, 93, 0.5);
}

.divine-zone.void {
  background: radial-gradient(circle, rgba(139, 90, 160, 0.3), transparent);
  border: 2px solid rgba(139, 90, 160, 0.5);
}

@keyframes divine-influence {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}
```

### **⚔️ Combat Zone Indicators**
```css
.combat-zone {
  position: absolute;
  border: 3px dashed #E85D5D;
  background: repeating-linear-gradient(
    45deg,
    rgba(232, 93, 93, 0.1),
    rgba(232, 93, 93, 0.1) 10px,
    transparent 10px,
    transparent 20px
  );
  animation: combat-warning 1s infinite;
}

.combat-zone.active {
  border-style: solid;
  animation: combat-active 0.5s infinite;
}

@keyframes combat-warning {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes combat-active {
  0%, 100% { box-shadow: 0 0 15px rgba(232, 93, 93, 0.5); }
  50% { box-shadow: 0 0 25px rgba(232, 93, 93, 0.8); }
}
```

---

## 📱 **RESPONSIVE MAP DESIGN** ✅ FIXED

### **💻 Desktop (1920x1080+)**
```css
.map-container-desktop {
  width: 100%;
  max-width: 1632px; /* Matches UI_DESIGN_SPECIFICATIONS.md */
  height: 972px; /* Matches main content area */
  position: relative;
  margin: 0 auto;
}

.map-viewport-desktop {
  width: calc(100% - 320px); /* Leave space for controls */
  height: 100%;
  min-width: 800px; /* Minimum usable size */
}

.map-controls-desktop {
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
}
```

### **💻 Laptop (1366x768)**
```css
.map-container-laptop {
  width: 100%;
  height: 688px; /* Adjusted for laptop screens */
  position: relative;
}

.map-viewport-laptop {
  width: calc(100% - 280px);
  height: 100%;
  min-width: 600px;
}

.map-controls-laptop {
  width: 260px; /* Slightly smaller */
  font-size: 14px; /* Compressed text */
}

/* Collapsible controls for space saving */
.controls-collapsed {
  width: 60px;
  overflow: hidden;
}

.controls-collapsed .control-text {
  display: none;
}
```

### **📱 Tablet (1024x768)**  
```css
.map-container-tablet {
  width: 100vw;
  height: calc(100vh - 120px); /* Account for mobile header */
  position: relative;
  touch-action: pan-x pan-y;
}

.map-viewport-tablet {
  width: 100%;
  height: calc(100% - 100px); /* Space for bottom controls */
}

.map-controls-tablet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: rgba(26, 26, 26, 0.95);
  display: flex;
  justify-content: space-around;
  align-items: center;
  backdrop-filter: blur(10px);
}

/* Touch-optimized controls */
.tablet-control-btn {
  min-width: 44px; /* iOS touch target minimum */
  min-height: 44px;
  padding: 8px;
  margin: 4px;
}
```

### **📲 Mobile (375x667)**
```css
.map-container-mobile {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #1a1a1a;
}

.map-viewport-mobile {
  width: 100%;
  height: calc(100% - 80px);
  touch-action: pan-x pan-y;
}

.map-controls-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(26, 26, 26, 0.98);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  backdrop-filter: blur(15px);
}

/* Bottom sheet for detailed controls */
.mobile-controls-sheet {
  position: fixed;
  bottom: -300px;
  left: 0;
  right: 0;
  height: 300px;
  background: #2d2d2d;
  border-radius: 20px 20px 0 0;
  transition: bottom 0.3s ease;
  z-index: 1001;
}

.mobile-controls-sheet.open {
  bottom: 80px;
}

/* Swipe gesture indicators */
.mobile-gesture-hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  animation: fadeInOut 3s infinite;
}
```

---

## 🎯 **INTEGRATION WITH EXISTING UI**

### **📍 Sidebar Integration**
```javascript
## 🎯 **INTEGRATION WITH EXISTING UI** ✅ FIXED

### **📍 Sidebar Integration**
```javascript
// Aggiunta tab mappa nella sidebar esistente (compatibile con UI_DESIGN_SPECIFICATIONS.md)
const SidebarTabs = {
  home: "🏠 Dashboard",
  family: "👥 Famiglia", 
  combat: "⚔️ Combatti",
  map: "🗺️ Esplora",    // NUOVO TAB - integrato correttamente
  quests: "📜 Missioni",
  character: "👤 Personaggio",
  inventory: "🎒 Inventario",
  guild: "🏰 Gilda",
  social: "💬 Sociale",
  settings: "⚙️ Impostazioni"
};
```

### **🔗 Cross-System Links**
```javascript
// Map system integration points with other UI components
const MapIntegration = {
  // Link to quest system
  onQuestMarkerClick: (quest_id) => {
    openQuestDetails(quest_id);
    highlightQuestPath(quest_id);
  },
  
  // Link to combat system
  onCombatZoneEnter: (zone_id) => {
    if (isCombatActive()) {
      showCombatTransition(zone_id);
    }
  },
  
  // Link to family system
  onFamilyMemberClick: (member_id) => {
    openFamilyMemberStatus(member_id);
    centerMapOnMember(member_id);
  },
  
  // Link to travel system
  onLocationSelect: (location_id) => {
    calculateTravelRoute(getCurrentLocation(), location_id);
    showTravelOptions(location_id);
  }
};
```

### **📐 Responsive Layout Compatibility**
```css
/* Ensures map system respects UI_DESIGN_SPECIFICATIONS.md breakpoints */

/* Desktop: Uses full main content area (1632x972) */
@media (min-width: 1920px) {
  .interactive-map {
    width: 1632px; /* Matches UI_DESIGN_SPECIFICATIONS.md */
    height: 972px;
    margin: 0 auto;
  }
}

/* Laptop: Adjusted for reduced header height */
@media (min-width: 1366px) and (max-width: 1919px) {
  .interactive-map {
    width: calc(100vw - 288px); /* Account for sidebar */
    height: calc(100vh - 80px); /* Reduced header height */
    max-width: 1078px; /* 1366 - 288 sidebar */
  }
}

/* Tablet: Drawer-based navigation */
@media (min-width: 768px) and (max-width: 1365px) {
  .interactive-map {
    width: 100vw;
    height: calc(100vh - 60px);
  }
  
  .sidebar-collapsed .interactive-map {
    width: calc(100vw - 60px); /* When sidebar is icon-only */
  }
}

/* Mobile: Full-screen mode */
@media (max-width: 767px) {
  .interactive-map {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  }
  
  .map-exit-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1001;
  }
}
```

### **🎨 Theme Integration**
```css
/* Uses colors from UI_DESIGN_SPECIFICATIONS.md */
.interactive-map {
  --faction-primary: var(--ui-faction-primary, #4A90E2);
  --faction-secondary: var(--ui-faction-secondary, #87CEEB);
  --background-primary: var(--ui-bg-primary, #1a1a1a);
  --background-secondary: var(--ui-bg-secondary, #2d2d2d);
  --text-primary: var(--ui-text-primary, #FFFFFF);
  --text-secondary: var(--ui-text-secondary, #CCCCCC);
}

/* Divine faction integration */
.map-divine-overlay.order {
  background: radial-gradient(circle, rgba(74, 144, 226, 0.3), transparent);
  border: 2px solid var(--faction-primary);
}

.map-divine-overlay.chaos {
  background: radial-gradient(circle, rgba(232, 93, 93, 0.3), transparent);
  border: 2px solid #E85D5D;
}

.map-divine-overlay.void {
  background: radial-gradient(circle, rgba(139, 90, 160, 0.3), transparent);
  border: 2px solid #8B5AA0;
}
```

### **⚡ Performance Optimization for Responsive**
```javascript
// Adaptive rendering based on screen size and performance
class ResponsiveMapRenderer {
  constructor() {
    this.deviceType = this.detectDeviceType();
    this.performanceLevel = this.detectPerformanceLevel();
  }
  
  getOptimalSettings() {
    return {
      // Desktop: Full quality
      desktop: {
        maxQuadrants: 1024,
        animationQuality: 'high',
        effectsEnabled: true,
        updateFrequency: 60 // FPS
      },
      
      // Laptop: Balanced
      laptop: {
        maxQuadrants: 512,
        animationQuality: 'medium',
        effectsEnabled: true,
        updateFrequency: 30
      },
      
      // Tablet: Optimized for touch
      tablet: {
        maxQuadrants: 256,
        animationQuality: 'medium',
        effectsEnabled: false,
        updateFrequency: 30,
        touchOptimized: true
      },
      
      // Mobile: Minimal for battery
      mobile: {
        maxQuadrants: 64,
        animationQuality: 'low',
        effectsEnabled: false,
        updateFrequency: 15,
        powerSaving: true
      }
    }[this.deviceType];
  }
}
```
```

### **🔗 Cross-System Links**
- **Quest Journal** → Map markers per obiettivi
- **Family Panel** → Family tracking sulla mappa
- **Combat System** → Zone di pericolo sulla mappa  
- **Social Hub** → Posizioni party members
- **Divine System** → Overlay influenza divina

---

**🗺️ Un sistema mappa che trasforma l'esplorazione in un'avventura epica attraverso l'universo delle 9 razze!**
