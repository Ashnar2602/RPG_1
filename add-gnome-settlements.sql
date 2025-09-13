-- Add Gnome Kingdom Minor Settlements (Tier 3)

-- Steamvale
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_steamvale', 'Steamvale', 
 'Valle del Vapore - Centro di energia a vapore, energia termica e bagni curativi. Specialisti nell''energia del vapore.',
 'location', 'region_gnomi_occidentali', -1320, -120, -20,
 false, false, false, true, false, false,
 50, ARRAY['Energia a vapore', 'Energia termica', 'Bagni curativi', 'Ingegneria vapore'],
 8900, '{"access_type":"steam_engineers","requirements":["safety_protocols"],"services":"thermal_energy"}', '{}', CURRENT_TIMESTAMP);

-- Tinkertown
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_tinkertown', 'Tinkertown', 
 'Città dei Riparatori - Centro di riparazioni, manutenzione e parti di ricambio. Meccanici e apprendisti specializzati.',
 'location', 'region_gnomi_occidentali', -1380, -180, 0,
 true, false, false, true, false, false,
 50, ARRAY['Riparazioni avanzate', 'Manutenzione specializzata', 'Parti di ricambio', 'Meccanici esperti'],
 7400, '{"access_type":"anyone","services":"repair_maintenance","clientele":"broken_items_welcome"}', '{}', CURRENT_TIMESTAMP);

-- Alchemyville
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_alchemyville', 'Alchemyville', 
 'Villaggio Alchimia - Centro di produzione pozioni, sostanze chimiche e componenti magici. Alchimisti specializzati.',
 'location', 'region_gnomi_occidentali', -1220, -160, 0,
 false, false, false, true, false, false,
 50, ARRAY['Produzione pozioni', 'Chimica avanzata', 'Componenti magici', 'Alchimia gnomesca'],
 6800, '{"access_type":"licensed_alchemists","requirements":["dealer_license"],"products":"potions_chemicals"}', '{}', CURRENT_TIMESTAMP);

-- Lightforge
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_lightforge', 'Lightforge', 
 'Fucina della Luce - Centro di illuminazione, dispositivi ottici e lenti specializzate. Maestri della manipolazione luminosa.',
 'location', 'region_gnomi_occidentali', -1350, -280, 20,
 false, false, false, true, false, false,
 50, ARRAY['Dispositivi ottici', 'Manipolazione luce', 'Lenti specializzate', 'Illuminazione avanzata'],
 5200, '{"access_type":"optical_specialists","alternatives":["light_mages"],"services":"optical_devices"}', '{}', CURRENT_TIMESTAMP);

-- Windmill Heights
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_windmill_heights', 'Windmill Heights', 
 'Alture Mulini Vento - Centro di energia eolica e monitoraggio meteorologico. Specialisti dell''energia ventosa.',
 'location', 'region_gnomi_occidentali', -1200, -220, 80,
 false, false, false, true, false, false,
 50, ARRAY['Energia eolica', 'Monitoraggio meteo', 'Mulini avanzati', 'Previsioni climatiche'],
 4600, '{"access_type":"weather_specialists","requirements":["safety_training"],"services":"weather_monitoring"}', '{}', CURRENT_TIMESTAMP);

-- Cogwheel Station
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_cogwheel_station', 'Cogwheel Station', 
 'Stazione Ruota Dentata - Centro di trasporto meccanico e sistemi di ingranaggi. Hub per trasporti automatizzati.',
 'location', 'region_gnomi_occidentali', -1300, -260, 0,
 true, false, false, true, false, false,
 50, ARRAY['Trasporto meccanico', 'Sistemi ingranaggi', 'Hub trasporti', 'Automazione movimento'],
 3900, '{"access_type":"transport_workers","services":"mechanical_transport","passengers":"welcome"}', '{}', CURRENT_TIMESTAMP);
