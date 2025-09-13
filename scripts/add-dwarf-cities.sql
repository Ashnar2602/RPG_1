-- Add main dwarf cities to Regno Nanico delle Otto Forgie

-- 1. Thar Zhulgar (Capitale - Tier 1)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections
) VALUES (
  'city_thar_zhulgar',
  'Thar Zhulgar',
  'Capitale sotterranea del Regno Nanico. 500m sottoterra con 12 livelli. Sede del Consiglio delle Otto Forgie.',
  'city',
  'region_nani',
  -900, 100, -500,
  false, true, false,
  true, false, false,
  50,
  ARRAY['Capitale nanica', 'Consiglio Otto Forgie', 'Forgiatura suprema', '12 livelli sotterranei'],
  195000,
  '{"access_type": "dwarven_permit", "clearance": "official_business", "entry_point": "via_kroldun"}',
  NULL
);

-- 2. Kroldun (Porta delle Montagne - Tier 2)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections
) VALUES (
  'city_kroldun',
  'Kroldun',
  'Porta delle Montagne - Ingresso principale ai domini nanici. Hub commerciale e dogana di superficie.',
  'city',
  'region_nani',
  -850, 120, 0,
  true, true, false,
  true, false, false,
  50,
  ARRAY['Hub commerciale', 'Dogana nanica', 'Primo contatto', 'Controllo frontiere'],
  53000,
  '{"access_type": "registered_merchants", "requirements": ["trading_license"]}',
  NULL
);

-- 3. Dol Khazir (La Fucina Eterna - Tier 2)  
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections
) VALUES (
  'city_dol_khazir',
  'Dol Khazir',
  'La Fucina Eterna - Centro manifatturiero e minerario primario. 300m sottoterra, specializzato in armi leggendarie.',
  'city',
  'region_nani',
  -850, 80, -300,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Fucina Eterna', 'Armi leggendarie', 'Centro manifatturiero', 'Solo nani puri'],
  35000,
  '{"access_type": "dwarves_only", "alternatives": ["special_invitation"], "escort": "required"}',
  NULL
);

-- 4. Bal-Kundrak (Sentinella del Nord - Tier 2)
INSERT INTO locations (
  id, name, description, tier, parent_id,
  coordinates_x, coordinates_y, coordinates_z,
  is_accessible, is_known, is_discovered,
  is_safe_zone, is_pvp_enabled, is_start_area,
  max_players, special_features, population,
  requirements, lore_connections
) VALUES (
  'city_bal_kundrak',
  'Bal-Kundrak',
  'Sentinella del Nord - Fortezza di superficie che controlla il passo montano strategico e le rotte commerciali del nord.',
  'city',
  'region_nani',
  -900, 200, 50,
  false, false, false,
  true, false, false,
  50,
  ARRAY['Fortezza militare', 'Passo montano', 'Controllo rotte', 'Addestramento militare'],
  31000,
  '{"access_type": "military", "clearance": "special_permits_only"}',
  NULL
);

-- Verify the additions
SELECT id, name, tier, parent_id, population, is_accessible
FROM locations 
WHERE parent_id = 'region_nani' 
AND tier = 'city'
ORDER BY population DESC;
