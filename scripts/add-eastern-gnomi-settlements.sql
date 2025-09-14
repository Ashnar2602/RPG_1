-- Aggiungi settlements mancanti per Regno degli Gnomi (Continente Orientale)
-- 6 insediamenti per completare la regione

-- Springcoil (Mollaelica)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_springcoil', 'Springcoil', 
 'Mollaelica - Centro di produzione molle e meccanismi elastici. Specialisti in sistemi a tensione per macchinari di precisione.',
 'location', 'region_gnomi', 200, 100, 150,
 true, true, false, true, false, false,
 35, ARRAY['Produzione molle', 'Meccanismi elastici', 'Sistemi tensione', 'Precisione meccanica'],
 7800, '{"access_type":"mechanical_specialists","services":"spring_manufacturing","welcome":"engineers"}', '{}', CURRENT_TIMESTAMP);

-- Measuredepth (Profondità Misurata)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_measuredepth', 'Measuredepth', 
 'Profondità Misurata - Centro di rilevamento e cartografia. Specialisti in misurazioni precise e mappatura mineraria.',
 'location', 'region_gnomi', 150, 120, 200,
 true, true, false, true, false, false,
 40, ARRAY['Rilevamento topografico', 'Cartografia', 'Misurazioni precise', 'Mappatura mineraria'],
 6900, '{"access_type":"surveyors_cartographers","services":"precision_mapping","welcome":"engineers"}', '{}', CURRENT_TIMESTAMP);

-- Finewheel (Ruota Fine)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_finewheel', 'Finewheel', 
 'Ruota Fine - Officina specializzata in ruote di precisione e taglio ingranaggi. Centro per meccanismi circolari complessi.',
 'location', 'region_gnomi', 180, 80, 180,
 true, true, false, true, false, false,
 35, ARRAY['Ruote precisione', 'Taglio ingranaggi', 'Meccanismi circolari', 'Artigianato fine'],
 6200, '{"access_type":"precision_crafters","services":"wheel_manufacturing","welcome":"mechanical_specialists"}', '{}', CURRENT_TIMESTAMP);

-- Brightlens (Lente Chiara)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_brightlens', 'Brightlens', 
 'Lente Chiara - Centro di produzione lenti e strumenti ottici. Specialisti in miglioramento visivo e strumenti di precisione.',
 'location', 'region_gnomi', 220, 90, 160,
 true, true, false, true, false, false,
 40, ARRAY['Produzione lenti', 'Strumenti ottici', 'Miglioramento visivo', 'Precisione ottica'],
 5600, '{"access_type":"optical_specialists","services":"lens_crafting","welcome":"instrument_makers"}', '{}', CURRENT_TIMESTAMP);

-- Soundwave (Ondasonora)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_soundwave', 'Soundwave', 
 'Ondasonora - Laboratorio di ricerca acustica e ingegneria del suono. Centro per sistemi di comunicazione avanzati.',
 'location', 'region_gnomi', 170, 110, 170,
 true, true, false, true, false, false,
 35, ARRAY['Ricerca acustica', 'Ingegneria suono', 'Sistemi comunicazione', 'Perfezionamento audio'],
 5100, '{"access_type":"sound_engineers","services":"acoustic_research","welcome":"communication_specialists"}', '{}', CURRENT_TIMESTAMP);

-- Tunneldeep (Tunnel Profondo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_tunneldeep', 'Tunneldeep', 
 'Tunnel Profondo - Stazione di manutenzione del grande tunnel verso il continente occidentale. Centro trasporti sotterranei.',
 'location', 'region_gnomi', 120, 100, -50,
 true, true, false, true, false, false,
 40, ARRAY['Manutenzione tunnel', 'Trasporti sotterranei', 'Collegamento continentale', 'Ingegneria tunnel'],
 4500, '{"access_type":"tunnel_specialists","services":"underground_transport","alliance":"dwarf_cooperation"}', '{}', CURRENT_TIMESTAMP);
