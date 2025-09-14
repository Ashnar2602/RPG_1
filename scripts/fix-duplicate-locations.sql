-- Sostituzioni per località rimosse dal Continente Occidentale
-- Dominio Elfico di Altherys - Sostituzioni per Shadowmere e Thornwall

-- Rimpiazzo per Shadowmere: Starfall Grove (Bosco Caduta Stelle)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_starfall_grove', 'Starfall Grove', 
 'Bosco Caduta Stelle - Antico bosco elfico dove cadono stelle ogni notte. Centro di magia astronomica e rituali stellari.',
 'location', 'region_elfi_altherys', -820, 320, 30,
 false, false, false, true, false, false,
 30, ARRAY['Magia stellare', 'Rituali astronomici', 'Cascate di stelle', 'Saggezza antica'],
 3900, '{"access_type":"astronomical_permit","requirements":["star_magic_clearance"],"ceremonies":"nightly_star_rituals"}', '{}', CURRENT_TIMESTAMP);

-- Rimpiazzo per Thornwall: Crystalbrook Crossing (Guado Ruscello Cristallo)  
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_crystalbrook_crossing', 'Crystalbrook Crossing', 
 'Guado Ruscello Cristallo - Attraversamento sicuro di un fiume magico con acque cristalline. Centro di purificazione e guarigione.',
 'location', 'region_elfi_altherys', -760, 280, 10,
 true, true, false, true, false, false,
 40, ARRAY['Acque curative', 'Purificazione magica', 'Attraversamento sicuro', 'Rifugio viandanti'],
 4500, '{"access_type":"healing_sanctuary","services":"purification_rituals","welcome":"weary_travelers"}', '{}', CURRENT_TIMESTAMP);
