# 📋 **TECHNICAL REFERENCE: DATABASE LOCATION SYSTEM**

## 📊 **SCHEMA OVERVIEW**

Il sistema geografico del gioco utilizza una struttura gerarchica a 4 livelli implementata nella tabella `locations` di PostgreSQL:

```
CONTINENT (tier: 'continent')
├── REGION (tier: 'region') 
    ├── CITY (tier: 'city')
    └── LOCATION (tier: 'location')
```

---

## 🏗️ **DATABASE STRUCTURE**

### **Table: locations**

| Campo | Tipo | Required | Default | Descrizione |
|-------|------|----------|---------|-------------|
| `id` | text | ✅ | - | Unique identifier seguendo naming convention |
| `name` | text | ✅ | - | Nome displayed nel gioco |
| `description` | text | ❌ | - | Descrizione completa del luogo |
| `tier` | LocationTier | ✅ | - | Enum: 'continent', 'region', 'city', 'location' |
| `parent_id` | text | ❌ | - | FK verso locations.id (NULL per continenti) |
| `coordinates_x` | double | ✅ | 0 | Coordinata X nel mondo |
| `coordinates_y` | double | ✅ | 0 | Coordinata Y nel mondo |
| `coordinates_z` | double | ✅ | 0 | Coordinata Z (altitudine) |
| `population` | integer | ❌ | - | Numero abitanti |
| `is_accessible` | boolean | ✅ | true | Può essere visitato dai player |
| `is_known` | boolean | ✅ | false | È conosciuto ai player inizialmente |
| `is_discovered` | boolean | ✅ | false | È stato scoperto dai player |
| `is_safe_zone` | boolean | ✅ | true | Zone sicure (no PvP/death) |
| `is_pvp_enabled` | boolean | ✅ | false | PvP abilitato |
| `is_start_area` | boolean | ✅ | false | Area di spawn iniziale |
| `max_players` | integer | ✅ | 50 | Massimo players contemporanei |
| `special_features` | text[] | ❌ | - | Array di caratteristiche speciali |
| `requirements` | jsonb | ❌ | - | Requisiti per accesso (JSON) |
| `lore_connections` | jsonb | ❌ | - | Collegamenti lore (JSON) |
| `created_at` | timestamp | ✅ | CURRENT_TIMESTAMP | Auto-generated |
| `updated_at` | timestamp | ✅ | - | Deve essere CURRENT_TIMESTAMP in INSERT |

---

## 🏷️ **NAMING CONVENTIONS**

### **ID Patterns** (Campo `id`)

| Tier | Pattern | Esempio |
|------|---------|---------|
| **continent** | `continent_{nome_semplice}` | `continent_occidentale` |
| **region** | `region_{razza/tipo}_{nome_opt}` | `region_elfi_altherys` |
| **city** | `city_{nome_semplice}` | `city_dhorvar` |
| **location** | `settlement_{nome_descrittivo}` | `settlement_crossroads_inn` |

### **Name Patterns** (Campo `name`)

| Tier | Pattern | Esempio |
|------|---------|---------|
| **continent** | `Continente {Direzione}` | `Continente Occidentale` |
| **region** | `{Tipo} {Razza} di {Nome}` | `Dominio Elfico di Altherys` |
| **city** | `{Nome}` | `Dhorvar` |
| **location** | `{Nome}` o `{Nome Tradotto}` | `Crossroads Inn` |

---

## 📐 **COORDINATE SYSTEM**

### **Western Continent (Occidentale)**
- **X Range**: -1000 to 0 (negative = west)
- **Y Range**: -500 to +500  
- **Usage**: Larger negative X = further west

### **Eastern Continent (Orientale)**
- **X Range**: 0 to +1000 (positive = east)
- **Y Range**: -500 to +500
- **Usage**: Larger positive X = further east

### **Central Archipelago (Arcipelago)**
- **X Range**: -300 to +300 (center)
- **Y Range**: -800 to -200 (south)
- **Usage**: Islands distributed in southern waters

### **Z-Coordinate (Altitude)**
- **Sea Level**: 0
- **Underground**: Negative values (dungeons, tunnels)
- **Mountains/Towers**: Positive values
- **Typical City**: 0-50
- **High Mountains**: 100-500

---

## 🎯 **IMPLEMENTATION WORKFLOW**

### **Step 1: Create Region SQL Script**

```sql
-- TEMPLATE: add-{region-name}.sql
-- Add {Region Name} to {Continent Name}

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('{region_id}', '{Region Display Name}', 
 '{Detailed description}',
 'region', '{parent_continent_id}', {x}, {y}, {z},
 {accessibility}, {known}, {discovered}, {safe_zone}, {pvp}, false,
 50, ARRAY['{feature1}', '{feature2}', '{feature3}', '{feature4}'],
 {total_population}, '{requirements_json}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier city)

-- {City Name} (Capital if applicable)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('{city_id}', '{City Name}', 
 '{City description}',
 'city', '{region_id}', {x}, {y}, {z},
 {accessibility}, {known}, {discovered}, true, false, false,
 50, ARRAY['{feature1}', '{feature2}', '{feature3}', '{feature4}'],
 {city_population}, '{requirements_json}', '{}', CURRENT_TIMESTAMP);

-- Repeat for all major cities (typically 3-4 per region)
```

### **Step 2: Create Settlements SQL Script**

```sql
-- TEMPLATE: add-{region-name}-settlements.sql
-- Add {Region Name} Minor Settlements (Tier location)

-- {Settlement Name}
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('{settlement_id}', '{Settlement Name}', 
 '{Settlement description}',
 'location', '{region_id}', {x}, {y}, {z},
 {accessibility}, {known}, {discovered}, {safe_zone}, {pvp}, false,
 {max_players}, ARRAY['{feature1}', '{feature2}', '{feature3}', '{feature4}'],
 {population}, '{requirements_json}', '{}', CURRENT_TIMESTAMP);

-- Repeat for all settlements (typically 6-8 per region)
```

### **Step 3: Execute Scripts**

```powershell
# Execute region script
Get-Content "add-{region-name}.sql" | & "C:\Program Files\Docker\Docker\resources\bin\docker.exe" exec -i rpg_postgres psql -U rpg_user -d rpg_db

# Execute settlements script  
Get-Content "add-{region-name}-settlements.sql" | & "C:\Program Files\Docker\Docker\resources\bin\docker.exe" exec -i rpg_postgres psql -U rpg_user -d rpg_db
```

### **Step 4: Verification**

```sql
-- Verify region and children
SELECT id, name, tier, parent_id, population 
FROM locations 
WHERE parent_id = '{region_id}' OR id = '{region_id}' 
ORDER BY tier DESC, population DESC;
```

---

## 🎮 **GAMEPLAY CONFIGURATION PATTERNS**

### **Accessibility Patterns**

| Location Type | is_accessible | is_known | is_discovered |
|---------------|---------------|----------|---------------|
| **Major Cities** | true | true | true |
| **Remote Settlements** | true | false | false |
| **Dangerous Dungeons** | false | true | false |
| **Secret Locations** | false | false | false |

### **Safety Patterns**

| Location Type | is_safe_zone | is_pvp_enabled | max_players |
|---------------|--------------|----------------|-------------|
| **Cities/Towns** | true | false | 50-100 |
| **Arenas/Combat** | false | true | 20-50 |
| **Dungeons** | false | true | 8-20 |
| **Peaceful Areas** | true | false | 50 |

### **Population Guidelines**

| Tier | Population Range | Typical |
|------|------------------|---------|
| **continent** | 1,000,000+ | 1.5-8M |
| **region** | 100,000-800,000 | 200-600K |
| **city** | 20,000-350,000 | 50-120K |
| **location** | 0-15,000 | 2-8K |

---

## 📝 **REQUIREMENTS JSON PATTERNS**

### **Standard Access Types**

```json
{"access_type":"open","restrictions":"none"}
{"access_type":"diplomatic_hub","services":"international_embassies"}
{"access_type":"commercial_port","services":"international_trade"}
{"access_type":"military_checkpoint","controls":"rigorous"}
{"access_type":"archaeological_permit","dangers":"traps_undead_guardians"}
```

### **Complex Requirements**

```json
{
  "access_type": "elven_guide_required",
  "requirements": ["elven_escort_mandatory"],
  "restrictions": "very_selective",
  "culture": "ceremonious"
}
```

---

## 🚨 **COMMON MISTAKES TO AVOID**

1. **❌ Wrong Field Names**: Use `tier`, not `type`
2. **❌ Wrong Enum Values**: Use `'location'`, not `'settlement'`
3. **❌ Missing CURRENT_TIMESTAMP**: Always include for `updated_at`
4. **❌ Inconsistent IDs**: Follow naming conventions exactly
5. **❌ Wrong Parent References**: Ensure parent_id exists
6. **❌ Missing Required Fields**: All non-null fields must have values
7. **❌ Wrong Coordinate Ranges**: Follow continent coordinate systems
8. **❌ Inconsistent Population**: Should sum logically within regions

---

## ✅ **SUCCESS VERIFICATION CHECKLIST**

- [ ] All INSERT statements return "INSERT 0 1"
- [ ] Region query returns expected number of locations
- [ ] Population numbers are logical and consistent
- [ ] All special_features are meaningful arrays
- [ ] Coordinates are within proper continent ranges
- [ ] IDs follow naming convention patterns
- [ ] Requirements JSON is valid and meaningful
- [ ] Accessibility settings match gameplay intent

---

## 🎯 **REAL EXAMPLES FROM SUCCESSFUL IMPLEMENTATIONS**

### **Example 1: Elven Domain (Perfect Pattern)**

#### Region Insert:
```sql
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_elfi_altherys', 'Dominio Elfico di Altherys', 
 'Nord-ovest del continente, foreste temperate secolari. Dominio degli alti elfi con foreste sacre e magia naturale.',
 'region', 'continent_occidentale', -800, 300, 0,
 false, false, false, true, false, false,
 50, ARRAY['Foreste secolari', 'Magia naturale', 'Primavera perpetua', 'Conoscenza antica'],
 180000, '{"access_type":"elven_guide_required","restrictions":"very_selective","culture":"ceremonious"}', '{}', CURRENT_TIMESTAMP);
```

#### City Insert:
```sql
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_elarion', 'Elarion', 
 'Cuore del Bosco - Capitale elfica costruita come città-albero integrata nella natura. Sede del Consiglio delle Cinque Casate.',
 'city', 'region_elfi_altherys', -800, 300, 50,
 false, true, false, true, false, false,
 50, ARRAY['Città-albero', 'Costruzioni naturali', 'Consiglio Cinque Casate', 'Arte elfica suprema'],
 107000, '{"access_type":"official_invitation","requirements":["elven_escort_mandatory"],"services":"ceremonious_style"}', '{}', CURRENT_TIMESTAMP);
```

#### Settlement Insert:
```sql
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_greenwood_market', 'Greenwood Market', 
 'Mercato del Bosco Verde - Unico centro commerciale elfico aperto ai non-elfi. Hub di scambio inter-razziale.',
 'location', 'region_elfi_altherys', -820, 250, 0,
 true, false, false, true, false, false,
 50, ARRAY['Commercio inter-razziale', 'Accesso libero', 'Mercanti elfici', 'Scambio culturale'],
 7500, '{"access_type":"registered_merchants","services":"open_to_non_elves","trade":"inter_racial_hub"}', '{}', CURRENT_TIMESTAMP);
```

### **Example 2: Human Confederation (Corrected Pattern)**

#### Different Access Patterns:
```sql
-- Commercial City
'{"access_type":"commercial_port","services":"international_trade","connections":"all_continents"}'

-- Military City  
'{"access_type":"industrial_center","services":"mining_metallurgy","products":"weapons_armor"}'

-- Dangerous Dungeon
'{"access_type":"archaeological_permit","dangers":"traps_undead_guardians","rewards":"ancient_treasures"}'

-- Diplomatic Site
'{"access_type":"diplomatic_only","services":"international_treaties","ceremonies":"official_delegations"}'
```

### **Example 3: Coordinate Patterns**

#### Western Continent Positioning:
```sql
-- Region center
coordinates_x, coordinates_y, coordinates_z: -200, -100, 0

-- Cities spread around region
-- Capital: -200, -100, 0
-- Port: -150, -150, 0 (southeast, closer to water)
-- Industrial: -250, -80, 0 (west, inland)
-- Agricultural: -180, -60, 0 (northeast, fertile area)

-- Settlements distributed
-- Inn: -220, -120, 0 (southwest of capital)
-- Town: -160, -80, 0 (between cities)
-- Forest: -280, -40, 0 (far west, forest edge)
```

### **Example 4: Population Distribution**

#### Successful Region: Human Confederation (450K total)
- **Capital City**: 120,000 (26.7% of region)
- **Major Port**: 85,000 (18.9% of region)  
- **Industrial Center**: 67,000 (14.9% of region)
- **Agricultural Hub**: 52,000 (11.6% of region)
- **Major Settlement**: 9,100 (2.0% of region)
- **Medium Settlements**: 6,000-6,700 each
- **Small Settlements**: 500-2,500 each

**Pattern**: Capital ~25%, Major cities 10-20%, Settlements 1-5%

---

## 🔧 **TROUBLESHOOTING COMMON ERRORS**

### **Error: "column does not exist"**
```sql
-- ❌ Wrong: Using 'type' instead of 'tier'
INSERT INTO locations (name, type, parent_id) VALUES (...)


-- ✅ Correct: Using 'tier'
INSERT INTO locations (name, tier, parent_id) VALUES (...)
```

### **Error: "invalid input value for enum"**
```sql
-- ❌ Wrong: Using invalid tier value
INSERT INTO locations (..., tier, ...) VALUES (..., 'settlement', ...)


-- ✅ Correct: Using valid enum value
INSERT INTO locations (..., tier, ...) VALUES (..., 'location', ...)
```

### **Error: "null value in column violates not-null constraint"**
```sql
-- ❌ Wrong: Missing required field
INSERT INTO locations (id, name, tier) VALUES (...)


-- ✅ Correct: Including all required fields
INSERT INTO locations (id, name, tier, updated_at) VALUES (..., CURRENT_TIMESTAMP)
```

### **Error: "insert or update violates foreign key constraint"**
```sql
-- ❌ Wrong: Parent doesn't exist
INSERT INTO locations (..., parent_id, ...) VALUES (..., 'nonexistent_region', ...)


-- ✅ Correct: Verify parent exists first
SELECT id FROM locations WHERE id = 'region_name' AND tier = 'region';
```

---

*Questo documento completo garantisce implementazioni consistenti e di successo per tutte le future espansioni del mondo di gioco.*
