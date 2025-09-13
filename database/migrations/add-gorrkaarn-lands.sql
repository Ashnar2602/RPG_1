-- Add Gorr'Kaarn Lands (Terre Gorr'Kaarn delle Cime Urlanti) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_gorrkaarn_cime', 'Terre Gorr''Kaarn delle Cime Urlanti', 
 'Nord-est del continente, montagne impervie e altipiani ventosi. Terra dei guerrieri Gorr''kaarn con fortezze scavate nella roccia.',
 'region', 'continent_occidentale', -600, 400, 200,
 false, true, false, false, true, false,
 30, ARRAY['Montagne impervie', 'Altipiani ventosi', 'Guerrieri brutali', 'Fortezze rocciose'],
 93300, '{"access_type":"hostile_territory","restrictions":"extremely_dangerous","culture":"brutal_warrior","warnings":"frequent_raids"}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier city)

-- Skullpeak Stronghold (Main Fortress)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_skullpeak_stronghold', 'Skullpeak Stronghold', 
 'Roccaforte Piccocranio - Fortezza scavata nella montagna con teschi come decorazione. Sede del Warlord supremo dei Gorr''kaarn.',
 'city', 'region_gorrkaarn_cime', -600, 400, 300,
 false, true, false, false, true, false,
 20, ARRAY['Fortezza montana', 'Decorazioni teschi', 'Warlord supremo', 'Guerra brutale'],
 32000, '{"access_type":"prisoners_challengers_only","services":"brutal_warrior_training","governance":"warlord_tribal","dangers":"high_violence"}', '{}', CURRENT_TIMESTAMP);

-- Thunderhorn Camp (Mobile Nomadic)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_thunderhorn_camp', 'Thunderhorn Camp', 
 'Accampamento Cornotuono - Insediamento nomadico mobile che segue le stagioni, base per razzie e allevamento bestiame.',
 'city', 'region_gorrkaarn_cime', -580, 420, 150,
 false, false, false, false, true, false,
 25, ARRAY['Accampamento mobile', 'Nomadi stagionali', 'Allevamento bestiame', 'Base razzie'],
 22000, '{"access_type":"nomads_beast_traders","services":"mount_training_mercenaries","mobility":"seasonal_migration","trade":"beast_cavalry"}', '{}', CURRENT_TIMESTAMP);

-- Ironhorn Forge (Industrial/Volcanic)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_ironhorn_forge', 'Ironhorn Forge', 
 'Fucina Cornoferro - Centro di produzione armi e armature in area vulcanica, utilizza forze naturali e lavoro forzato.',
 'city', 'region_gorrkaarn_cime', -650, 380, 100,
 false, true, false, false, true, false,
 20, ARRAY['Area vulcanica', 'Fucine naturali', 'Produzione armamenti', 'Lavoro forzato'],
 18000, '{"access_type":"weapon_buyers_traders","services":"heavy_weapons_armor","production":"brutal_efficiency","labor":"enslaved_craftsmen"}', '{}', CURRENT_TIMESTAMP);

-- Bloodstone Quarry (Mining/Construction)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_bloodstone_quarry', 'Bloodstone Quarry', 
 'Cava Pietrasanguinosa - Profonda cava di pietra rossa utilizzata per costruzioni e monumenti intimidatori.',
 'city', 'region_gorrkaarn_cime', -620, 360, 50,
 false, true, false, false, true, false,
 20, ARRAY['Cava profonda', 'Pietra rossa', 'Materiali costruzione', 'Monumenti intimidatori'],
 16000, '{"access_type":"stone_traders_specialists","services":"building_materials","products":"carved_intimidation_pieces","extraction":"deep_quarry"}', '{}', CURRENT_TIMESTAMP);
