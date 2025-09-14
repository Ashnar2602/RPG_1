-- Fix Continente Orientale Issues
-- 1. Fix Thalareth ID per seguire naming convention
-- 2. Fix Laboratorio dell'Alchimista parent_id
-- 3. Add missing special locations secondo documentazione

-- Fix Thalareth ID
UPDATE locations 
SET id = 'city_thalareth'
WHERE id = 'cmfhyvx6d0001vh9uq81gpxxy' AND name = 'Thalareth';

-- Fix Laboratorio dell'Alchimista parent_id
UPDATE locations
SET parent_id = 'city_thalareth'
WHERE id = 'location_laboratorio_alchimista';

-- Aggiungiamo le special locations mancanti per Regno di Velendar secondo documentazione

-- Torre della Sapienza Infinita
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_torre_sapienza_infinita', 'Torre della Sapienza Infinita', 
 'Torre più alta dell''Accademia di Magia, ricerca magica definitiva. Centro degli esperimenti più pericolosi e potenti.',
 'location', 'city_thalareth', 200, 100, 150,
 false, true, false, true, false, false,
 5, ARRAY['Ricerca magica suprema', 'Esperimenti pericolosi', 'Accesso arcimagi', 'Magia proibita'],
 50, '{"access_type":"archmage_clearance","requirements":["supreme_magical_authority"],"dangers":"experimental_magic"}', '{}', CURRENT_TIMESTAMP);

-- Biblioteca dei Sogni
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_biblioteca_sogni', 'Biblioteca dei Sogni', 
 'Biblioteca che esiste parzialmente nel regno dei sogni. Contenuto: conoscenza dai sogni, profezie, saggezza inconscia.',
 'location', 'city_thalareth', 180, 120, 100,
 false, false, false, true, false, false,
 10, ARRAY['Reame dei sogni', 'Profezie oniriche', 'Magia del sonno', 'Conoscenza inconscia'],
 25, '{"access_type":"dream_magic","requirements":["sleep_magic_protection"],"realm":"partial_dream_world"}', '{}', CURRENT_TIMESTAMP);

-- Giardini del Tempo
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_giardini_tempo', 'Giardini del Tempo', 
 'Giardini dove il tempo scorre diversamente. Effetti: accelerazione/decelerazione temporale, invecchiamento.',
 'location', 'city_thalareth', 220, 80, 50,
 false, false, false, false, false, false,
 8, ARRAY['Manipolazione temporale', 'Flusso tempo alterato', 'Effetti invecchiamento', 'Magia temporale'],
 15, '{"access_type":"time_mage_clearance","requirements":["temporal_stability_gear"],"effects":"time_distortion"}', '{}', CURRENT_TIMESTAMP);

-- Ponte delle Alleanze
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_ponte_alleanze', 'Ponte delle Alleanze', 
 'Ponte storico dove sono stati firmati i trattati più importanti. Importanza politica e relazioni internazionali.',
 'location', 'city_thalareth', 200, 120, 20,
 true, true, true, true, false, false,
 50, ARRAY['Trattati storici', 'Diplomazia internazionale', 'Cerimonie ufficiali', 'Importanza politica'],
 100, '{"access_type":"diplomatic_ceremonies","services":"international_relations","significance":"treaty_signing"}', '{}', CURRENT_TIMESTAMP);

-- Cripta dei Re Sapienti
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_cripta_re_sapienti', 'Cripta dei Re Sapienti', 
 'Tomba reale con la saggezza preservata dei re passati. Contenuto: saggezza storica, artefatti reali, guida.',
 'location', 'city_thalareth', 180, 100, -20,
 false, true, false, true, false, false,
 15, ARRAY['Saggezza regale', 'Artefatti storici', 'Guida ancestrale', 'Tomba sacra'],
 20, '{"access_type":"royal_historian_clearance","requirements":["royal_bloodline","official_occasions"],"content":"royal_wisdom"}', '{}', CURRENT_TIMESTAMP);
