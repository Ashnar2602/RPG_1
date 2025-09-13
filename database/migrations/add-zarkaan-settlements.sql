-- Add Zar'Kaan Desert Minor Settlements (Tier location)

-- Scorpion's Rest - Caravan rest stop
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_scorpions_rest', 'Scorpion''s Rest', 
 'Riposo Scorpione - Stazione di riposo per carovane, servizi di guida nel deserto e allevamento di scorpioni.',
 'location', 'region_zarkaan_deserto', -320, -420, 0,
 true, true, true, true, false, false,
 20, ARRAY['Stazione carovane', 'Guide deserto', 'Allevamento scorpioni', 'Riposo viaggiatori'],
 4200, '{"access_type":"caravan_members","services":"guide_services_scorpion_ranching","clientele":"desert_travelers","specialization":"caravan_support"}', '{}', CURRENT_TIMESTAMP);

-- Burnwind Outpost - Weather monitoring
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_burnwind_outpost', 'Burnwind Outpost', 
 'Avamposto Ventobruciante - Avamposto per monitoraggio tempeste di sabbia, magia meteorologica e allarme precoce.',
 'location', 'region_zarkaan_deserto', -200, -300, 100,
 false, true, false, false, true, false,
 12, ARRAY['Monitoraggio tempeste', 'Magia meteorologica', 'Allarme precoce', 'Osservazione climatica'],
 3500, '{"access_type":"weather_specialists","services":"sandstorm_monitoring","specialization":"storm_tracking","function":"early_warning_system"}', '{}', CURRENT_TIMESTAMP);

-- Glassforge Workshop - Glass crafting
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_glassforge_workshop', 'Glassforge Workshop', 
 'Officina Fucinavetro - Officina specializata nella lavorazione del vetro, cristalli e manufatti resistenti al calore.',
 'location', 'region_zarkaan_deserto', -330, -360, 0,
 false, true, false, true, false, false,
 15, ARRAY['Lavorazione vetro', 'Artigianato cristalli', 'Manufatti calore', 'Specialisti resistenza'],
 2800, '{"access_type":"glass_crafters","services":"glass_crystal_crafting","requirements":["heat_resistance"],"specialization":"heat_crafts"}', '{}', CURRENT_TIMESTAMP);

-- Nightcool Haven - Night travel services
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_nightcool_haven', 'Nightcool Haven', 
 'Rifugio Frescosera - Rifugio per viaggiatori notturni con servizi di magia del raffreddamento e area di riposo.',
 'location', 'region_zarkaan_deserto', -270, -430, 0,
 true, true, true, true, false, false,
 18, ARRAY['Viaggi notturni', 'Magia raffreddamento', 'Area riposo', 'Servizi cooling'],
 2100, '{"access_type":"night_travelers","services":"cooling_magic_rest","specialization":"night_travel_support","magic":"cooling_spells"}', '{}', CURRENT_TIMESTAMP);

-- Cactus Garden Oasis - Plant cultivation
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_cactus_garden_oasis', 'Cactus Garden Oasis', 
 'Oasi Giardino Cactus - Oasi specializata nella coltivazione di piante, produzione di medicine e conservazione dell''acqua.',
 'location', 'region_zarkaan_deserto', -310, -370, 0,
 true, true, false, true, false, false,
 15, ARRAY['Coltivazione piante', 'Produzione medicine', 'Conservazione acqua', 'Ricerca botanica'],
 1900, '{"access_type":"botanists_researchers","services":"plant_cultivation_medicine","specialization":"water_conservation","research":"desert_botany"}', '{}', CURRENT_TIMESTAMP);

-- Firecrystal Mine - Crystal extraction
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_firecrystal_mine', 'Firecrystal Mine', 
 'Miniera Cristallofuoco - Miniera per estrazione di cristalli di fuoco e gemme del calore con minatori immuni al fuoco.',
 'location', 'region_zarkaan_deserto', -360, -410, -50,
 false, true, false, false, true, false,
 10, ARRAY['Estrazione cristalli fuoco', 'Gemme calore', 'Minatori immuni fuoco', 'Miniera specializzata'],
 1600, '{"access_type":"fire_resistant_miners","services":"fire_crystal_extraction","requirements":["fire_immunity"],"specialization":"heat_gem_mining"}', '{}', CURRENT_TIMESTAMP);
