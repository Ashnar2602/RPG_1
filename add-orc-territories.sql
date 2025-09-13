-- Add Orc Territories (Territori Orcheschi delle Foreste Selvagge) to Western Continent

-- Note: The region already exists as 'region_orchi', we just need to add cities and settlements

-- Add main cities (Tier 2)

-- Grimfang Stronghold
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_grimfang_stronghold', 'Grimfang Stronghold', 
 'Roccaforte Zannacupa - Fortezza di legno e pietra grezza con trofei di guerra. Centro del potere orchesco meridionale.',
 'city', 'region_orchi', -1100, -100, 0,
 false, false, false, false, true, false,
 50, ARRAY['Fortezza di guerra', 'Trofei di battaglia', 'Consiglio Anziani', 'Addestramento guerriero'],
 28000, '{"access_type":"orcish_guide_required","alternatives":["prisoner","honored_guest"],"services":"warrior_training"}', '{}', CURRENT_TIMESTAMP);

-- Bloodmoon Camp
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_bloodmoon_camp', 'Bloodmoon Camp', 
 'Accampamento Lunasanguinosa - Campo mobile che segue le migrazioni animali. Centro di caccia maggiore orchesca.',
 'city', 'region_orchi', -1050, -150, 0,
 false, false, false, false, true, false,
 50, ARRAY['Campo mobile', 'Caccia bestie', 'Lavorazione carne', 'Migrazioni stagionali'],
 18000, '{"access_type":"find_mobile_camp","requirements":["tribal_acceptance"],"services":"hunting_guides"}', '{}', CURRENT_TIMESTAMP);

-- Ironbark Fortress
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_ironbark_fortress', 'Ironbark Fortress', 
 'Fortezza Corteccieferro - Alberi giganti modificati come fortezza. Alleanza con spiriti della natura.',
 'city', 'region_orchi', -1150, -80, 30,
 false, false, false, true, false, false,
 50, ARRAY['Alberi-fortezza', 'Spiriti natura', 'Tiro con arco', 'Guerra forestale'],
 23500, '{"access_type":"druids_nature_spirits","restrictions":"others_restricted","services":"spirit_guidance"}', '{}', CURRENT_TIMESTAMP);

-- Warsong Valley
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_warsong_valley', 'Warsong Valley', 
 'Valle Cantaguerra - Valle nascosta di addestramento militare. Preparazione per incursioni e guerra.',
 'city', 'region_orchi', -1120, -200, -20,
 false, false, false, false, true, false,
 50, ARRAY['Valle segreta', 'Addestramento militare', 'Tattiche guerra', 'Preparazione incursioni'],
 23000, '{"access_type":"military_invitation_only","danger_level":"extremely_dangerous","services":"elite_training"}', '{}', CURRENT_TIMESTAMP);
