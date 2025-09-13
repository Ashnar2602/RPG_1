-- Add Troll Territories (Territori Troll delle Montagne Ghiacciate) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_troll_montagne', 'Territori Troll delle Montagne Ghiacciate', 
 'Estremo nord del continente, vette sempre innevate con ghiacciai e caverne ghiacciate. Dimora dei Troll delle montagne in clima artico estremo.',
 'region', 'continent_occidentale', -400, 600, 500,
 false, true, false, false, true, false,
 20, ARRAY['Vette innevate', 'Ghiacciai perenni', 'Clima artico estremo', 'Troll delle montagne'],
 38800, '{"access_type":"extreme_cold_protection","restrictions":"lethal_temperatures","culture":"troll_survival","warnings":"constant_blizzards"}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier city)

-- Frosthold Keep (Main Fortress)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_frosthold_keep', 'Frosthold Keep', 
 'Fortezza Ghiacciosaldo - Fortezza di ghiaccio e pietra costantemente manutenuta, sede del Consiglio degli Anziani e Alpha Troll.',
 'city', 'region_troll_montagne', -400, 600, 600,
 false, true, false, false, true, false,
 15, ARRAY['Fortezza ghiaccio-pietra', 'Consiglio Anziani', 'Alpha Troll', 'Sopravvivenza freddo estremo'],
 12800, '{"access_type":"extreme_cold_protection","requirements":["troll_approval"],"services":"cold_weather_gear","governance":"elder_council_alpha"}', '{}', CURRENT_TIMESTAMP);

-- Glacier''s Heart (Deep Ice Magic)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_glaciers_heart', 'Glacier''s Heart', 
 'Cuore del Ghiacciaio - Città scavata nel profondo di un ghiacciaio antico, centro di ricerca magica del ghiaccio e raccolta cristalli.',
 'city', 'region_troll_montagne', -420, 580, 400,
 false, false, false, false, true, false,
 12, ARRAY['Ghiacciaio antico', 'Ricerca magia ghiaccio', 'Raccolta cristalli', 'Elementali ghiaccio'],
 8500, '{"access_type":"ice_mages_only","requirements":["extreme_cold_immunity"],"services":"ice_magic_items","specialization":"elemental_communication"}', '{}', CURRENT_TIMESTAMP);

-- Stormwall Citadel (Weather Control)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_stormwall_citadel', 'Stormwall Citadel', 
 'Cittadella Murotempesta - Cittadella sulla vetta più alta accessibile, controllo del tempo e prevenzione valanghe.',
 'city', 'region_troll_montagne', -380, 620, 800,
 false, false, false, false, true, false,
 15, ARRAY['Vetta più alta', 'Controllo meteorologico', 'Magia tempeste', 'Prevenzione valanghe'],
 10000, '{"access_type":"weather_mages_climbers","requirements":["master_climbing_skills"],"services":"weather_prediction","specialization":"avalanche_control"}', '{}', CURRENT_TIMESTAMP);

-- Bonechill Caves (Preservation/Storage)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_bonechill_caves', 'Bonechill Caves', 
 'Grotte Gelogelo - Sistema di grotte profonde naturalmente refrigerate, camere di ibernazione e conservazione alimentare.',
 'city', 'region_troll_montagne', -440, 560, 200,
 false, true, false, true, false, false,
 18, ARRAY['Grotte profonde', 'Refrigerazione naturale', 'Camere ibernazione', 'Conservazione magica'],
 7200, '{"access_type":"preservation_specialists","services":"long_term_storage","specialization":"hibernation_magic","storage":"deep_cave_system"}', '{}', CURRENT_TIMESTAMP);
