-- Add minor dwarf settlements to Regno Nanico delle Otto Forgie

-- 1. Khaz Ankor (Guardia del Tunnel - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_khaz_ankor',
  'Khaz Ankor',
  'Guardia del Tunnel - Controllo del tunnel intercontinentale verso Teldrun. Punto strategico sotterraneo.',
  'location',
  'region_nani',
  -750, 150, -200,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Controllo tunnel', 'Collegamento intercontinentale', 'Strategico', 'Sotterraneo'],
  8000,
  '{"access_type": "tunnel_permit", "guide": "mandatory", "clearance": "intercontinental_travel"}',
  NULL,
  CURRENT_TIMESTAMP
);

-- 2. Grimm Khazad (Miniera Profonda - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_grimm_khazad',
  'Grimm Khazad',
  'Miniera Profonda - Estrazione del mithril e base operativa per le miniere più profonde del regno.',
  'location',
  'region_nani',
  -950, 50, -800,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Estrazione mithril', 'Miniere profonde', 'Base operativa', 'Solo personale autorizzato'],
  6500,
  '{"access_type": "mining_personnel", "contracts": "required", "safety": "extreme_precautions"}',
  NULL,
  CURRENT_TIMESTAMP
);

-- 3. Kazak Dum (Casa della Fucina - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_kazak_dum',
  'Kazak Dum',
  'Casa della Fucina - Specializzazione in gioielli, oreficeria e arte nanica di lusso.',
  'location',
  'region_nani',
  -880, 130, -100,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Gioielleria', 'Oreficeria', 'Arte nanica', 'Prodotti di lusso'],
  7200,
  '{"access_type": "artists_collectors", "requirements": ["references", "artistic_purpose"]}',
  NULL,
  CURRENT_TIMESTAMP
);

-- 4. Baruk Khazad (Assi delle Asce - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_baruk_khazad',
  'Baruk Khazad',
  'Assi delle Asce - Accademia militare nanica per addestramento delle truppe d''elite.',
  'location',
  'region_nani',
  -920, 180, 0,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Accademia militare', 'Addestramento elite', 'Guerrieri nani', 'Tradizioni marziali'],
  5800,
  '{"access_type": "dwarven_military", "alternatives": ["high_rank_allies"], "purpose": "military_training"}',
  NULL,
  CURRENT_TIMESTAMP
);

-- 5. Khaz Kazak (Fortezza del Ferro - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_khaz_kazak',
  'Khaz Kazak',
  'Fortezza del Ferro - Centro ricerca ingegneristica e sviluppo macchine da guerra.',
  'location',
  'region_nani',
  -950, 120, -50,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Ricerca ingegneristica', 'Macchine da guerra', 'Cooperazione gnomi', 'Innovazione militare'],
  6600,
  '{"access_type": "engineers_inventors", "requirements": ["approved_projects", "security_clearance"]}',
  NULL,
  CURRENT_TIMESTAMP
);

-- 6. Azgal Khazad (Morte del Nemico - Tier 3)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections, updated_at
) VALUES (
  'settlement_azgal_khazad',
  'Azgal Khazad',
  'Morte del Nemico - Avamposto militare contro creature sotterranee pericolose.',
  'location',
  'region_nani',
  -1000, 80, -600,
  false, false, false,
  false, true, false,
  50,
  ARRAY['Avamposto militare', 'Creature pericolose', 'Zona ad alto rischio', 'Veterani'],
  4200,
  '{"access_type": "military_only", "danger_level": "extreme", "clearance": "combat_veterans"}',
  NULL,
  CURRENT_TIMESTAMP
);

-- Verify all dwarf locations
SELECT 
  id, name, tier, population, is_accessible,
  CASE 
    WHEN tier = 'city' THEN 'CITTÀ'
    WHEN tier = 'location' THEN 'INSEDIAMENTO'
  END as tipo
FROM locations 
WHERE parent_id = 'region_nani'
ORDER BY population DESC;
